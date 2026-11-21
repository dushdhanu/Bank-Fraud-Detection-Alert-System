import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';

let db;
const alice = '11111111-1111-4111-8111-111111111111';
const bob = '22222222-2222-4222-8222-222222222222';
const query = async (sql, params = []) => (await db.query(sql, params)).rows;
const asUser = async id => {
  await db.exec('reset role');
  await query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
  await db.exec('set role authenticated');
};
const simulate = async (scenario, id = randomUUID()) => (await query('select public.simulate_bankguard_event($1,$2) as result',[id,scenario]))[0].result;
before(async () => {
  db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role;
    create schema auth; create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema public,auth to authenticated,anon;
    grant execute on function auth.uid() to authenticated,anon;
    revoke create on schema public from public;`);
  await db.exec(await readFile(new URL('../drizzle/migrations/0000_fraud_detection_core.sql',import.meta.url),'utf8'));
  await db.exec(await readFile(new URL('../supabase/migrations/202611210001_bankguard_mvp.sql',import.meta.url),'utf8'));
  await query("insert into auth.users values ($1,'alice@example.test','{}'),($2,'bob@example.test','{}')",[alice,bob]);
});
after(async () => { await db?.close(); });

test('signup grants customer only; profiles and accounts are isolated',async () => {
  await asUser(alice);
  assert.deepEqual((await query('select role from public.user_roles')).map(r=>r.role),['customer']);
  assert.equal((await query('select * from public.profiles')).length,1);
  assert.equal((await query('select * from public.accounts')).length,1);
  assert.equal((await query('select * from public.accounts'))[0].user_id,alice);
  await assert.rejects(query("insert into public.user_roles(user_id,role) values($1,'admin')",[alice]));
  // PostgreSQL RLS filters unauthorized UPDATE targets rather than raising.
  await query("update public.rules set weight=100");
  assert.equal((await query("select weight from public.rules where code='R-114'"))[0].weight,35);
});
test('large unfamiliar-device event is explainable; replay creates no duplicate',async () => {
  await asUser(alice);
  const id=randomUUID(); const event=await simulate('suspicious_transfer',id);
  assert.ok([65,75].includes(event.riskScore)); // depends on Colombo local hour
  assert.equal(event.severity,'high'); assert.equal(event.status,'flagged');
  const hits=await query('select * from public.rule_hits');
  assert.ok(hits.some(h=>h.rule_code==='R-114' && h.points===35));
  assert.ok(hits.some(h=>h.rule_code==='R-031' && h.points===30));
  assert.equal(hits.reduce((sum,h)=>sum+h.points,0),event.riskScore);
  const repeat=await simulate('normal',id); assert.equal(repeat.duplicate,true);
  assert.equal((await query('select * from public.transactions')).length,1);
  assert.equal((await query('select * from public.alerts'))[0].delivered,false);
});
test('user review is owned and independent of delivery or bank confirmation',async () => {
  await asUser(alice);
  const alert=(await query('select * from public.alerts'))[0];
  await query("select public.review_bankguard_alert($1,'recognized')",[alert.id]);
  assert.equal((await query('select * from public.alerts'))[0].verification_status,'recognized');
  await asUser(bob);
  assert.equal((await query('select * from public.transactions')).length,0);
  assert.equal((await query('select * from public.alerts')).length,0);
  assert.equal((await query('select * from public.rule_hits')).length,0);
  await assert.rejects(query("select public.review_bankguard_alert($1,'suspicious')",[alert.id]));
  await assert.rejects(query("select public.review_bankguard_case($1,'resolved',null)",[randomUUID()]));
});
test('normal payments avoid high risk; actual recent frequency triggers velocity',async () => {
  await asUser(bob);
  const first=await simulate('normal'); assert.ok(first.riskScore<30);
  const second=await simulate('normal'); assert.ok(second.riskScore<30);
  const third=await simulate('normal'); assert.ok(third.riskScore>=25 && third.riskScore<=35);
  const hits=await query("select * from public.rule_hits where rule_code='R-072'");
  assert.equal(hits.length,1);
});
test('severity is capped; invalid scenarios, writes, anonymous access and bursts are rejected',async () => {
  await asUser(bob);
  const event=await simulate('suspicious_transfer');
  assert.ok(event.riskScore>=90 && event.riskScore<=100); assert.equal(event.severity,'critical');
  await assert.rejects(simulate('unknown'));
  await assert.rejects(query("update public.transactions set risk_score=0"));
  for(let i=0;i<6;i++) await simulate('normal');
  await assert.rejects(simulate('normal'),/Simulation limit/);
  await db.exec('reset role; set role anon');
  await assert.rejects(simulate('normal'));
});
test('staff case reviews are atomic and audited; failed reviews leave no log',async () => {
  await db.exec('reset role');
  await query("insert into public.user_roles(user_id,role) values($1,'analyst')",[bob]);
  await asUser(bob);
  const row=(await query('select * from public.cases'))[0];
  await query("select public.review_bankguard_case($1,'resolved','Reviewed synthetic evidence')",[row.id]);
  assert.equal((await query('select status from public.cases where id=$1',[row.id]))[0].status,'resolved');
  const count=(await query('select count(*)::int as n from public.case_events'))[0].n;
  await assert.rejects(query("select public.review_bankguard_case($1,'resolved','missing')",[randomUUID()]));
  assert.equal((await query('select count(*)::int as n from public.case_events'))[0].n,count);
  await assert.rejects(query("delete from public.case_events"));
});

test('classification boundaries use configured rule weights and disabled rules do not fire',async () => {
  await db.exec('reset role');
  const user=randomUUID();
  await query("insert into auth.users values ($1,'boundary@example.test','{}')",[user]);
  await db.exec("update public.rules set enabled = (code='R-114')");
  for(const [weight,band] of [[29,'low'],[30,'medium'],[59,'medium'],[60,'high'],[79,'high'],[80,'critical']]) {
    await db.exec('reset role');
    await query("update public.rules set weight=$1 where code='R-114'",[weight]);
    await asUser(user);
    const result=await simulate('suspicious_transfer');
    assert.equal(result.riskScore,weight); assert.equal(result.severity,band);
  }
});

test('backdated unusual-hour scenarios cannot bypass received-time rate limiting',async () => {
  await db.exec('reset role');
  const user=randomUUID();
  await query("insert into auth.users values ($1,'time@example.test','{}')",[user]);
  await asUser(user);
  for(let i=0;i<10;i++) await simulate('unusual_hour');
  await assert.rejects(simulate('unusual_hour'),/Simulation limit/);
});

test('fresh installation migrations create no shared financial fixtures',async () => {
  const fresh=new PGlite();
  try {
    await fresh.exec(`create role anon; create role authenticated; create role service_role;
      create schema auth; create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;`);
    await fresh.exec(await readFile(new URL('../supabase/migrations/202611210000_existing_baseline.sql',import.meta.url),'utf8'));
    await fresh.exec(await readFile(new URL('../supabase/migrations/202611210001_bankguard_mvp.sql',import.meta.url),'utf8'));
    assert.equal((await fresh.query('select count(*)::int as n from public.accounts')).rows[0].n,0);
    assert.equal((await fresh.query('select count(*)::int as n from public.transactions')).rows[0].n,0);
    assert.equal((await fresh.query('select count(*)::int as n from public.rules where enabled')).rows[0].n,4);
  } finally { await fresh.close(); }
});
