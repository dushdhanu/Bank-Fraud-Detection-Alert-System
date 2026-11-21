-- Apply AFTER the existing 0000_fraud_detection_core migration.
-- No existing roles are revoked automatically: audit historical analyst grants before use.
begin;
revoke create on schema public from public;
alter function public.has_role(uuid,public.app_role) set search_path = '';
alter function public.is_staff(uuid) set search_path = '';

drop policy "profiles readable by authenticated" on public.profiles;
create policy "own profile read" on public.profiles for select to authenticated
  using (id = auth.uid());

alter table public.rules add constraint rule_weight_range check (weight between 0 and 100);
alter table public.transactions add constraint positive_amount check (amount > 0);
alter table public.transactions add constraint score_range check (risk_score between 0 and 100);
alter table public.transactions add column simulated boolean not null default true;
alter table public.transactions add column received_at timestamptz not null default now();
create index bankguard_account_received on public.transactions(account_id,received_at desc);
create index bankguard_account_occurred on public.transactions(account_id,occurred_at desc);
alter table public.transactions add column currency text not null default 'USD' check (currency in ('USD','LKR'));
alter table public.alerts alter column delivered set default false;
alter table public.alerts add column verification_status text not null default 'unresolved'
  check (verification_status in ('recognized','suspicious','unresolved'));
-- Historical rows were fabricated by the old simulator, not delivered.
update public.alerts set delivered = false, channel = 'in_app', recipient = 'dashboard',
  message = 'DEMONSTRATION: Suspicious activity. Review using your bank''s official app or website.';

drop policy "staff read rules" on public.rules;
create policy "authenticated read rules" on public.rules for select to authenticated using (true);
drop policy "staff read hits" on public.rule_hits;
create policy "owned rule hits" on public.rule_hits for select to authenticated using (
  public.is_staff(auth.uid()) or exists (
    select 1 from public.transactions t join public.accounts a on a.id = t.account_id
    where t.id = transaction_id and a.user_id = auth.uid()
  )
);

-- All writes go through narrowly scoped, transactional functions.
revoke insert, update, delete on public.accounts, public.transactions, public.rule_hits,
  public.device_logs, public.cases, public.case_events, public.alerts from authenticated;
revoke insert, delete on public.rules from authenticated;

update public.rules set label = 'Large synthetic LKR transfer', description = 'Synthetic LKR amount >= 50,000', weight = 35 where code = 'R-114';
update public.rules set label = 'Transaction velocity', description = 'At least 3 events in 10 minutes, including this event', weight = 25 where code = 'R-072';
update public.rules set label = 'Unfamiliar device', description = 'Synthetic event explicitly indicates an unfamiliar device', weight = 30 where code = 'R-031';
update public.rules set label = 'Unusual local hour', description = 'Synthetic event between 00:00 and 04:59 Asia/Colombo', weight = 10 where code = 'R-018';
update public.rules set enabled = false, description = 'Reserved: no reliable consented location evidence or provider integration in MVP' where code = 'R-055';
update public.rules set enabled = false, description = 'Reserved: replay events are suppressed by unique event references, not a fraud score' where code = 'R-090';

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id,email,full_name) values
    (new.id,new.email,left(coalesce(new.raw_user_meta_data->>'full_name','BankGuard user'),100)) on conflict do nothing;
  insert into public.user_roles(user_id,role) values(new.id,'customer') on conflict do nothing;
  insert into public.accounts(user_id,account_number,holder_name,home_city,home_country)
    values(new.id,'DEMO-' || new.id::text,'Synthetic account','Colombo','LK');
  return new;
end $$;

-- Existing users get an owned synthetic account; preexisting shared fixtures stay untouched.
insert into public.accounts(user_id,account_number,holder_name,home_city,home_country)
select id,'DEMO-' || id::text,'Synthetic account','Colombo','LK' from public.profiles p
where not exists(select 1 from public.accounts a where a.user_id = p.id);

create or replace function public.simulate_bankguard_event(event_id uuid, scenario text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  owner_id uuid := auth.uid(); a public.accounts; t public.transactions; r public.rules;
  amount_lkr numeric; fresh boolean; event_time timestamptz := now(); n int; score int := 0;
  band public.severity_level; fired boolean; hit_codes text[] := '{}'; case_id uuid; case_ref text;
begin
  if owner_id is null then raise exception 'Authentication required'; end if;
  if event_id is null then raise exception 'Event identifier required'; end if;
  if scenario not in ('normal','large_transfer','new_device','suspicious_transfer','unusual_hour') or scenario is null
    then raise exception 'Unsupported synthetic scenario'; end if;
  -- Serialize per user: concurrent retries, velocity checks, and rate limits remain consistent.
  perform pg_advisory_xact_lock(hashtextextended(owner_id::text,0));
  select * into a from public.accounts where user_id = owner_id order by created_at limit 1;
  if a.id is null then raise exception 'Owned synthetic account unavailable'; end if;
  select * into t from public.transactions where txn_ref = 'DEMO-' || event_id::text;
  if t.id is not null then
    if t.account_id <> a.id then raise exception 'Event reference unavailable'; end if;
    return jsonb_build_object('txnRef',t.txn_ref,'riskScore',t.risk_score,'severity',t.severity,'status',t.status,'duplicate',true);
  end if;
  select count(*) into n from public.transactions where account_id = a.id and received_at > now() - interval '1 minute';
  if n >= 10 then raise exception 'Simulation limit reached. Wait one minute.'; end if;
  amount_lkr := case when scenario in ('large_transfer','suspicious_transfer') then 85000 else 1500 end;
  fresh := scenario in ('new_device','suspicious_transfer');
  if scenario = 'unusual_hour' then
    event_time := (date_trunc('day',now() at time zone 'Asia/Colombo') + interval '2 hours') at time zone 'Asia/Colombo';
    if event_time > now() then event_time := event_time - interval '1 day'; end if;
  end if;
  select count(*) into n from public.transactions where account_id = a.id
    and occurred_at between event_time - interval '10 minutes' and event_time;
  for r in select * from public.rules where enabled order by code loop
    fired := case r.code when 'R-114' then amount_lkr >= 50000 when 'R-072' then n >= 2
      when 'R-031' then fresh when 'R-018' then extract(hour from event_time at time zone 'Asia/Colombo') < 5 else false end;
    if fired then score := score + r.weight; hit_codes := array_append(hit_codes,r.code); end if;
  end loop;
  score := least(100,score);
  band := case when score >= 80 then 'critical' when score >= 60 then 'high' when score >= 30 then 'medium' else 'low' end;
  insert into public.transactions(txn_ref,account_id,amount,currency,kind,merchant,city,country,
    device,new_device,risk_score,severity,status,occurred_at)
  values('DEMO-' || event_id::text,a.id,amount_lkr,'LKR','synthetic_transfer','DEMONSTRATION · ' || scenario,
    'Colombo','LK',case when fresh then 'Synthetic unfamiliar device' else 'Synthetic trusted device' end,
    fresh,score,band,case when score >= 30 then 'flagged'::public.txn_status else 'cleared'::public.txn_status end,event_time)
  returning * into t;
  insert into public.rule_hits(transaction_id,rule_code,label,points,severity)
    select t.id,code,label,weight,severity from public.rules where code = any(hit_codes);
  if score >= 60 then
    case_ref := 'DEMO-CASE-' || event_id::text;
    insert into public.cases(case_ref,transaction_id,account_id,severity,summary)
      values(case_ref,t.id,a.id,band,'Synthetic activity requires review; no banking operations blocked') returning id into case_id;
    insert into public.case_events(case_id,actor_name,action,detail)
      values(case_id,owner_id::text,'synthetic detection','Risk score ' || score);
    insert into public.alerts(transaction_id,account_id,channel,recipient,message,severity,delivered)
      values(t.id,a.id,'in_app','dashboard','DEMONSTRATION: Suspicious LKR activity. Review using your bank''s official app or website.',band,false);
  end if;
  return jsonb_build_object('txnRef',t.txn_ref,'riskScore',score,'severity',band,'status',t.status,'hits',cardinality(hit_codes),'caseRef',case_ref,'duplicate',false);
end $$;

create or replace function public.review_bankguard_alert(alert_id uuid, verdict text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or verdict not in ('recognized','suspicious','unresolved') or verdict is null then
    raise exception 'Invalid review'; end if;
  update public.alerts set verification_status = verdict where id = alert_id and exists
    (select 1 from public.accounts a where a.id = account_id and a.user_id = auth.uid());
  if not found then raise exception 'Alert unavailable'; end if;
  insert into public.case_events(actor_name,action,detail)
    values(auth.uid()::text,'user alert review',alert_id::text || ': ' || verdict || ' (not bank confirmation)');
end $$;

create or replace function public.review_bankguard_case(case_id uuid, new_status public.case_status, note text default null)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_staff(auth.uid()) then raise exception 'Staff authorization required'; end if;
  if length(note) > 1000 or new_status is null then raise exception 'Invalid case review'; end if;
  update public.cases set status = new_status, assignee_id = auth.uid(), assignee_name = auth.uid()::text, updated_at = now() where id = case_id;
  if not found then raise exception 'Case unavailable'; end if;
  insert into public.case_events(case_id,actor_name,action,detail) values(case_id,auth.uid()::text,'status: ' || new_status,note);
end $$;

-- Rule edits get an audit record; caller identity cannot be supplied by the client.
create or replace function public.audit_bankguard_rule()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.case_events(actor_name,action,detail)
    values(coalesce(auth.uid()::text,'migration'),'rule configuration',new.code || ': enabled=' || new.enabled || ', weight=' || new.weight);
  return new;
end $$;
create trigger bankguard_rule_audit after update on public.rules for each row execute function public.audit_bankguard_rule();

revoke all on function public.simulate_bankguard_event(uuid,text), public.review_bankguard_alert(uuid,text),
  public.review_bankguard_case(uuid,public.case_status,text) from public, anon;
grant execute on function public.simulate_bankguard_event(uuid,text), public.review_bankguard_alert(uuid,text),
  public.review_bankguard_case(uuid,public.case_status,text) to authenticated;
commit;
