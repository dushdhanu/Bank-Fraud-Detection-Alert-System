# BankGuard

Smart Banking Fraud Detection & Financial Intelligence System — a synthetic-data portfolio MVP. React/TypeScript and TanStack Start supply the UI and server functions; Supabase supplies authentication and PostgreSQL. This preserves the existing Lovable application. No real bank account is connected or blocked.

**Implemented:** customer registration/sign-in UI, verified-account checks on server functions, owned synthetic accounts, transaction monitoring, PostgreSQL fraud scoring and explanations, duplicate suppression, simulation rate limits, in-app alerts with owner review, staff case management, admin-only rule toggles, audit entries, dark/light themes, database integration tests and CI.

**Pending:** verified mobile delivery (Telegram/FCM), mobile test-alert button, live currency/stocks, watchlists, authorized bank integration, MFA/passkeys/reset UI, production session hardening and the complete requested page set. In-app records are not delivery receipts. This is not bank-certified or independently security-verified.

Read the [audit and prioritized plan](docs/AUDIT.md), [security checklist](docs/SECURITY.md), and [API/architecture](docs/ARCHITECTURE.md).

## Windows 11 setup

Use Node.js 24, npm, VS Code and a separate development Supabase project. Open **this Bank Security directory** in VS Code. The parent directory's Git setup is currently unavailable; no Git history was changed.

```powershell
npm ci
Copy-Item .env.example .env
```

Replace all four example values with your development project's URL and public publishable/anon key. Client and server must use the same project. Never place a service-role key or any banking secret in `VITE_*`. The existing `.env` is ignored and was left unchanged.

### Database: choose one path

**Fresh development Supabase database:** execute these files in order in its SQL editor:

1. `supabase/migrations/202611210000_existing_baseline.sql`
2. `supabase/migrations/202611210001_bankguard_mvp.sql`

The baseline creates the existing schema and rule configuration without legacy demonstration identities, transactions or fake deliveries. New signups get a synthetic account. PostgreSQL alone is insufficient: the migration requires Supabase Auth's `auth.users`, `auth.uid()` and database roles.

**Existing project with the original schema already applied:** back up the database, then apply **only** `202611210001_bankguard_mvp.sql` in staging first. Do not replay the baseline. The hardening migration changes existing alert messages to honest demonstration notices and clears fake delivered flags. Review that change before applying it to an existing environment.

**Fully local development:** install Docker Desktop and the Supabase CLI, then:

```powershell
supabase start
supabase db reset
supabase status
```

`db reset` clears the **local development** database. Never use it against a real project. Copy the local URL and anon/publishable key from `status` into `.env`. This repository's `supabase/migrations` is the canonical new-install migration path. The old Drizzle migration and `schema_and_seed.sql` are historical references; do not apply them again. Drizzle's TypeScript schema is empty, so do not use schema push.

In hosted Supabase Auth settings, require email confirmation, configure a minimum 12-character password, and set the site URL and allowed redirect to `http://localhost:8080` and `http://localhost:8080/console`. The local config supplies these defaults. Use the local mail inbox shown by `supabase status` for confirmation emails. Configure real SMTP separately for hosted email.

### Run frontend and backend

```powershell
npm run dev -- --host 127.0.0.1 --port 8080
```

Open [BankGuard locally](http://localhost:8080). TanStack Start runs the frontend and server functions in the same process; there is no separate Java backend to start. Restart after environment changes. Use the localhost URL for authentication to match the configured redirect.

### Verify the MVP

1. Register and verify your email, then sign in. New users must have `customer`, never automatic `analyst` or `admin`.
2. Select **Normal payment** and simulate it. Open the row by keyboard or mouse to inspect explanations.
3. Simulate **Large transfer + new device**: LKR 85,000 scores at least 65 and creates an in-app alert and staff case. Review it under Alerts as recognized, suspicious or unresolved. This is not bank confirmation.
4. Three transactions within ten minutes trigger the velocity rule; scores cap at 100. Ten new events per minute is the simulation limit. Repeated event UUIDs return the existing event.
5. Sign out, register another user and verify that the first user's records are unavailable. Staff data is deliberately separate.

For an explicitly authorized test operator only, a project owner can grant staff access through the SQL editor using a verified user's UUID:

```sql
insert into public.user_roles(user_id,role) values ('REPLACE_WITH_USER_UUID','analyst') on conflict do nothing;
```

Use `admin` only when rule editing is required. Before shared deployment, manually audit old analyst grants: the previous signup trigger granted staff access to everyone. Existing assignments are preserved to avoid silently revoking legitimate operators; this is a release blocker until reviewed.

## Tests and build

```powershell
npm test
npm run typecheck
npm run build
npm audit
```

Tests execute actual migrations in PGlite's PostgreSQL engine with test-only Supabase identities and database roles. They cover customer grants, cross-user isolation, fraud rules, replay suppression, rate limits, unsent alerts, owner review, forbidden direct writes and atomic staff audit changes. No API keys or bank access are required. They do not verify real Supabase Auth, browser sessions, network delivery or a production database.

The existing Nitro build targets Cloudflare by default. `npm run preview` previews the production build. A static upload cannot run this backend. Production needs a compatible server runtime, separate project/secrets, migrations, TLS, tested auth settings and review of unresolved security risks. No deployment or paid service was activated.

For a portable Node server and HTTP smoke test:

```powershell
$env:NITRO_PRESET='node-server'
npm run build
node scripts/smoke.mjs
```

`Dockerfile` builds that Node preset as a non-root container; `compose.yml` binds it to localhost port 3000. With a separate development Supabase project configured in `.env`, run `docker compose up --build`. Only public project configuration is supplied at build time; server configuration is supplied at runtime. When Supabase runs on the Windows host, the container's server URL must use `host.docker.internal` rather than container-local `127.0.0.1`. The browser URL must remain browser-reachable. Docker itself is unavailable in the current workspace, so the image has not been built here. Configure TLS and exact Auth redirects before exposing a deployment.

Runtime dependency audit after the security upgrades reports zero known advisories. The complete development audit retains four moderate findings in unused Drizzle tooling's esbuild chain. No forced downgrade was applied. See `dependency-audit.json` for the runtime report.

## Fraud rules

| ID | Evidence | Weight |
|---|---|---:|
| R-114 | Synthetic LKR amount >= 50,000 | 35 |
| R-072 | At least three events for the account in ten minutes, including current event | 25 |
| R-031 | Explicitly unfamiliar synthetic device | 30 |
| R-018 | 00:00–04:59 in Asia/Colombo | 10 |

0–29 low, 30–59 medium, 60–79 high, 80–100 critical. Prototype bands, not validated banking standards. Admins can toggle supported rules; weights have database constraints. Amount/frequency and band threshold editing remains future work. Reserved geography and legacy round-transfer rules are disabled. The new simulator performs no location inference or real fingerprinting.

New events are marked simulated and carry currency. Legacy fixtures remain USD; new scenarios use LKR. Different currencies are not summed into a misleading total. Alert/case creation is atomic with assessment persistence, and replay checks precede new writes. No event blocks a banking operation.

## Future integrations

- **Telegram/FCM:** pending implementation, not just missing keys. Add verified linking, opt-in/revocation, severity preferences, durable outbox, bounded retries and provider receipts before exposing Send Test Security Alert. Keep tokens server-side.
- **Currency/stocks:** no fabricated prices are displayed. Select legally permitted providers, confirm LKR coverage and market licensing, cache with timestamps and stale/delay states. CBSL/CSE licensing and hosting recommendations have not been investigated in this MVP.
- **Bank adapter:** documented authorized APIs and explicit consent only; never request bank passwords, PINs, OTPs or CVVs. Adapter/consent lifecycle and CSV import are future work.

Portfolio description: “BankGuard is a TypeScript financial-security prototype with PostgreSQL-enforced data ownership, explainable synthetic fraud detection, atomic event processing and tested alert/case workflows.”

This project remains connected to Lovable. Preserve published Git history; do not force-push or rewrite pushed commits.
