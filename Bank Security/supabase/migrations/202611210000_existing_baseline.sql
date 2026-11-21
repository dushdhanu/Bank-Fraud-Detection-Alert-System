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

