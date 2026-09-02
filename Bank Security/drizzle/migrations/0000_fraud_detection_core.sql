-- ENUMS
create type public.app_role as enum ('admin', 'analyst', 'customer');
create type public.severity_level as enum ('low', 'medium', 'high', 'critical');
create type public.txn_status as enum ('cleared', 'flagged', 'blocked');
create type public.case_status as enum ('open', 'in_review', 'escalated', 'resolved');

-- PROFILES
create table public.profiles (
  id uuid primary key,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles readable by authenticated" on public.profiles for select to authenticated using (true);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

-- ROLES
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','analyst'))
$$;

create policy "read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id or public.is_staff(auth.uid()));

-- signup trigger: profile + default analyst role
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'analyst')
  on conflict do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- ACCOUNTS
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  account_number text not null unique,
  holder_name text not null,
  home_city text not null default 'Lagos',
  home_country text not null default 'NG',
  balance numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.accounts to authenticated;
grant all on public.accounts to service_role;
alter table public.accounts enable row level security;
create policy "staff read accounts" on public.accounts for select to authenticated using (public.is_staff(auth.uid()) or auth.uid() = user_id);
create policy "staff write accounts" on public.accounts for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- RULES
create table public.rules (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  description text not null,
  weight int not null default 10,
  severity public.severity_level not null default 'medium',
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.rules to authenticated;
grant all on public.rules to service_role;
alter table public.rules enable row level security;
create policy "staff read rules" on public.rules for select to authenticated using (public.is_staff(auth.uid()));
create policy "admin write rules" on public.rules for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- TRANSACTIONS
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  txn_ref text not null unique,
  account_id uuid not null references public.accounts(id) on delete cascade,
  amount numeric(14,2) not null,
  kind text not null default 'card_purchase',
  merchant text,
  city text,
  country text,
  ip_address text,
  asn text,
  device text,
  browser text,
  fingerprint text,
  new_device boolean not null default false,
  risk_score int not null default 0,
  severity public.severity_level not null default 'low',
  status public.txn_status not null default 'cleared',
  occurred_at timestamptz not null default now()
);
create index on public.transactions (occurred_at desc);
grant select, insert, update, delete on public.transactions to authenticated;
grant all on public.transactions to service_role;
alter table public.transactions enable row level security;
create policy "staff read txns" on public.transactions for select to authenticated
  using (public.is_staff(auth.uid()) or exists (select 1 from public.accounts a where a.id = account_id and a.user_id = auth.uid()));
create policy "staff write txns" on public.transactions for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- RULE HITS
create table public.rule_hits (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions(id) on delete cascade,
  rule_code text not null,
  label text not null,
  points int not null default 0,
  severity public.severity_level not null default 'medium'
);
grant select, insert, delete on public.rule_hits to authenticated;
grant all on public.rule_hits to service_role;
alter table public.rule_hits enable row level security;
create policy "staff read hits" on public.rule_hits for select to authenticated using (public.is_staff(auth.uid()));
create policy "staff write hits" on public.rule_hits for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- DEVICE LOGS
create table public.device_logs (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts(id) on delete cascade,
  event text not null default 'login',
  ip_address text,
  asn text,
  device text,
  browser text,
  fingerprint text,
  city text,
  country text,
  first_seen boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert on public.device_logs to authenticated;
grant all on public.device_logs to service_role;
alter table public.device_logs enable row level security;
create policy "staff read devices" on public.device_logs for select to authenticated
  using (public.is_staff(auth.uid()) or exists (select 1 from public.accounts a where a.id = account_id and a.user_id = auth.uid()));
create policy "staff write devices" on public.device_logs for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- CASES
create table public.cases (
  id uuid primary key default gen_random_uuid(),
  case_ref text not null unique,
  transaction_id uuid references public.transactions(id) on delete set null,
  account_id uuid references public.accounts(id) on delete cascade,
  severity public.severity_level not null default 'medium',
  status public.case_status not null default 'open',
  summary text not null,
  assignee_id uuid,
  assignee_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.cases to authenticated;
grant all on public.cases to service_role;
alter table public.cases enable row level security;
create policy "staff read cases" on public.cases for select to authenticated using (public.is_staff(auth.uid()));
create policy "staff write cases" on public.cases for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- AUDIT TRAIL
create table public.case_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases(id) on delete cascade,
  actor_name text not null default 'system',
  action text not null,
  detail text,
  created_at timestamptz not null default now()
);
create index on public.case_events (created_at desc);
grant select, insert on public.case_events to authenticated;
grant all on public.case_events to service_role;
alter table public.case_events enable row level security;
create policy "staff read events" on public.case_events for select to authenticated using (public.is_staff(auth.uid()));
create policy "staff write events" on public.case_events for insert to authenticated with check (public.is_staff(auth.uid()));

-- ALERTS
create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid references public.transactions(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete cascade,
  channel text not null default 'email',
  recipient text not null,
  message text not null,
  severity public.severity_level not null default 'high',
  delivered boolean not null default true,
  created_at timestamptz not null default now()
);
grant select, insert on public.alerts to authenticated;
grant all on public.alerts to service_role;
alter table public.alerts enable row level security;
create policy "staff read alerts" on public.alerts for select to authenticated
  using (public.is_staff(auth.uid()) or exists (select 1 from public.accounts a where a.id = account_id and a.user_id = auth.uid()));
create policy "staff write alerts" on public.alerts for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- SEED: rules
insert into public.rules (code, label, description, weight, severity) values
 ('R-114','High amount on new device','Transaction over $1,000 from a device never seen on this account',38,'critical'),
 ('R-072','Velocity spike','3 or more transactions from the same account within 10 minutes',22,'high'),
 ('R-031','Geo deviation','Transaction location far from the account home city',14,'medium'),
 ('R-018','Unusual hour','Transaction between 00:00 and 05:00 local time',6,'low'),
 ('R-055','Cross-border transfer','Transaction country differs from account home country',12,'medium'),
 ('R-090','Round-amount wire','Wire transfer with a suspiciously round amount above $5,000',10,'medium');

-- SEED: accounts
insert into public.accounts (id, account_number, holder_name, home_city, home_country, balance) values
 ('a1111111-1111-4111-8111-000000000001','4417900000007341','Amara Nwosu','Lagos','NG',48210.55),
 ('a1111111-1111-4111-8111-000000000002','3390110000000912','Tunde Achebe','Accra','GH',12980.00),
 ('a1111111-1111-4111-8111-000000000003','5521440000004458','Ifeoma Balogun','Kano','NG',7340.20),
 ('a1111111-1111-4111-8111-000000000004','2204220000002210','Samuel Okoro','Ibadan','NG',23110.75);

-- SEED: transactions
insert into public.transactions (id, txn_ref, account_id, amount, kind, merchant, city, country, ip_address, asn, device, browser, fingerprint, new_device, risk_score, severity, status, occurred_at) values
 ('b2222222-2222-4222-8222-000000000001','TXN-88231','a1111111-1111-4111-8111-000000000001',4180.00,'wire_out','Interbank wire','Lagos','NG','197.231.44.102','AS41062 · Chisco','Android','Chrome 121','fp_9a2c71e0',true,92,'critical','flagged', now() - interval '4 minutes'),
 ('b2222222-2222-4222-8222-000000000002','TXN-88229','a1111111-1111-4111-8111-000000000002',1925.50,'card_purchase','Zenith Electronics','Accra','GH','154.160.22.8','AS30986 · Vodafone','iPhone','Safari 17','fp_44be1120',false,81,'high','flagged', now() - interval '18 minutes'),
 ('b2222222-2222-4222-8222-000000000003','TXN-88217','a1111111-1111-4111-8111-000000000003',890.00,'p2p_out','Transfer to new payee','Kano','NG','102.89.44.17','AS36873 · MTN','Android','Chrome 120','fp_71cc9004',true,64,'medium','flagged', now() - interval '46 minutes'),
 ('b2222222-2222-4222-8222-000000000004','TXN-88203','a1111111-1111-4111-8111-000000000004',240.75,'card_purchase','Shoprite','Ibadan','NG','41.203.10.5','AS37282 · Spectranet','Desktop','Firefox 122','fp_2210aa71',false,38,'low','cleared', now() - interval '1 hour 12 minutes'),
 ('b2222222-2222-4222-8222-000000000005','TXN-88198','a1111111-1111-4111-8111-000000000001',2340.00,'wire_out','Offshore beneficiary','Port Harcourt','NG','197.231.44.102','AS41062 · Chisco','Android','Chrome 121','fp_9a2c71e0',true,77,'high','flagged', now() - interval '2 hours'),
 ('b2222222-2222-4222-8222-000000000006','TXN-88185','a1111111-1111-4111-8111-000000000002',6750.00,'wire_out','Crypto exchange payout','Abuja','NG','102.89.90.4','AS36873 · MTN','iPhone','Safari 17','fp_0f18cc32',true,95,'critical','blocked', now() - interval '3 hours'),
 ('b2222222-2222-4222-8222-000000000007','TXN-88170','a1111111-1111-4111-8111-000000000003',510.20,'card_purchase','Jumia','Enugu','NG','105.112.4.90','AS29465 · Airtel','Android','Chrome 121','fp_71cc9004',false,59,'medium','flagged', now() - interval '5 hours'),
 ('b2222222-2222-4222-8222-000000000008','TXN-88151','a1111111-1111-4111-8111-000000000004',1120.00,'card_purchase','Domestic retail','Ibadan','NG','41.203.10.5','AS37282 · Spectranet','Desktop','Firefox 122','fp_2210aa71',false,21,'low','cleared', now() - interval '9 hours'),
 ('b2222222-2222-4222-8222-000000000009','TXN-87990','a1111111-1111-4111-8111-000000000001',380.40,'bill_pay','Utility · EKEDC','Lagos','NG','41.58.120.9','AS37148 · Airtel','Desktop','Chrome 121','fp_5510bb02',false,12,'low','cleared', now() - interval '1 day'),
 ('b2222222-2222-4222-8222-000000000010','TXN-87811','a1111111-1111-4111-8111-000000000001',2450.00,'ach_in','Salary credit','Lagos','NG','41.58.120.9','AS37148 · Airtel','Desktop','Chrome 121','fp_5510bb02',false,8,'low','cleared', now() - interval '2 days');

-- SEED: rule hits
insert into public.rule_hits (transaction_id, rule_code, label, points, severity) values
 ('b2222222-2222-4222-8222-000000000001','R-114','Amount > $1,000 on new device',38,'critical'),
 ('b2222222-2222-4222-8222-000000000001','R-072','Velocity: 3 tx / 10 min',22,'high'),
 ('b2222222-2222-4222-8222-000000000001','R-031','Location 2,340 km from baseline',14,'medium'),
 ('b2222222-2222-4222-8222-000000000001','R-018','Unusual hour (03:14 local)',6,'low'),
 ('b2222222-2222-4222-8222-000000000002','R-055','Cross-border transaction',12,'medium'),
 ('b2222222-2222-4222-8222-000000000002','R-090','Round-amount wire',10,'medium'),
 ('b2222222-2222-4222-8222-000000000003','R-114','Amount > $1,000 on new device',38,'critical'),
 ('b2222222-2222-4222-8222-000000000005','R-114','Amount > $1,000 on new device',38,'critical'),
 ('b2222222-2222-4222-8222-000000000005','R-031','Location far from baseline',14,'medium'),
 ('b2222222-2222-4222-8222-000000000006','R-114','Amount > $1,000 on new device',38,'critical'),
 ('b2222222-2222-4222-8222-000000000006','R-090','Round-amount wire',10,'medium'),
 ('b2222222-2222-4222-8222-000000000007','R-018','Unusual hour (02:41 local)',6,'low');

-- SEED: device logs
insert into public.device_logs (account_id, event, ip_address, asn, device, browser, fingerprint, city, country, first_seen, created_at) values
 ('a1111111-1111-4111-8111-000000000001','login','197.231.44.102','AS41062 · Chisco','Android','Chrome 121','fp_9a2c71e0','Lagos','NG',true, now() - interval '6 minutes'),
 ('a1111111-1111-4111-8111-000000000001','transaction','197.231.44.102','AS41062 · Chisco','Android','Chrome 121','fp_9a2c71e0','Lagos','NG',false, now() - interval '4 minutes'),
 ('a1111111-1111-4111-8111-000000000002','login','154.160.22.8','AS30986 · Vodafone','iPhone','Safari 17','fp_44be1120','Accra','GH',false, now() - interval '20 minutes'),
 ('a1111111-1111-4111-8111-000000000003','login','102.89.44.17','AS36873 · MTN','Android','Chrome 120','fp_71cc9004','Kano','NG',true, now() - interval '50 minutes'),
 ('a1111111-1111-4111-8111-000000000004','login','41.203.10.5','AS37282 · Spectranet','Desktop','Firefox 122','fp_2210aa71','Ibadan','NG',false, now() - interval '1 hour 20 minutes');

-- SEED: cases
insert into public.cases (id, case_ref, transaction_id, account_id, severity, status, summary, assignee_name, created_at, updated_at) values
 ('c3333333-3333-4333-8333-000000000001','CASE-0442','b2222222-2222-4222-8222-000000000001','a1111111-1111-4111-8111-000000000001','critical','open','New-device wire, 4 rules matched','K. Osei', now() - interval '4 minutes', now() - interval '4 minutes'),
 ('c3333333-3333-4333-8333-000000000002','CASE-0439','b2222222-2222-4222-8222-000000000002','a1111111-1111-4111-8111-000000000002','high','in_review','Velocity spike · merchant M-2201','T. Achebe', now() - interval '18 minutes', now() - interval '10 minutes'),
 ('c3333333-3333-4333-8333-000000000003','CASE-0435','b2222222-2222-4222-8222-000000000003','a1111111-1111-4111-8111-000000000003','medium','escalated','New device, elevated amount','R. Bello', now() - interval '1 hour', now() - interval '30 minutes'),
 ('c3333333-3333-4333-8333-000000000004','CASE-0431','b2222222-2222-4222-8222-000000000007','a1111111-1111-4111-8111-000000000003','low','resolved','False positive · confirmed card','K. Osei', now() - interval '5 hours', now() - interval '3 hours'),
 ('c3333333-3333-4333-8333-000000000005','CASE-0428','b2222222-2222-4222-8222-000000000006','a1111111-1111-4111-8111-000000000002','critical','escalated','Crypto payout blocked pending review','T. Achebe', now() - interval '3 hours', now() - interval '2 hours');

-- SEED: audit trail
insert into public.case_events (case_id, actor_name, action, detail, created_at) values
 ('c3333333-3333-4333-8333-000000000001','system','flagged','Rule engine matched R-114 (score 92)', now() - interval '4 minutes'),
 ('c3333333-3333-4333-8333-000000000001','K. Osei','opened','Case opened from TXN-88231', now() - interval '3 minutes'),
 ('c3333333-3333-4333-8333-000000000002','T. Achebe','note','Contacted cardholder, awaiting confirmation', now() - interval '10 minutes'),
 ('c3333333-3333-4333-8333-000000000003','R. Bello','escalated','Escalated to Tier 3', now() - interval '30 minutes'),
 ('c3333333-3333-4333-8333-000000000004','K. Osei','resolved','Marked false positive after cardholder confirmation', now() - interval '3 hours'),
 ('c3333333-3333-4333-8333-000000000005','system','blocked','Transaction auto-blocked, score 95', now() - interval '3 hours');

-- SEED: alerts
insert into public.alerts (transaction_id, account_id, channel, recipient, message, severity, created_at) values
 ('b2222222-2222-4222-8222-000000000001','a1111111-1111-4111-8111-000000000001','email','amara.nwosu@example.com','Suspicious wire of $4,180.00 from a new device in Lagos. Reply BLOCK to stop it.','critical', now() - interval '4 minutes'),
 ('b2222222-2222-4222-8222-000000000006','a1111111-1111-4111-8111-000000000002','sms','+233 20 000 0000','Blocked $6,750.00 transfer to a crypto exchange. Contact your bank.','critical', now() - interval '3 hours'),
 ('b2222222-2222-4222-8222-000000000003','a1111111-1111-4111-8111-000000000003','email','ifeoma.balogun@example.com','Transfer of $890.00 to a new payee was flagged for review.','medium', now() - interval '46 minutes');