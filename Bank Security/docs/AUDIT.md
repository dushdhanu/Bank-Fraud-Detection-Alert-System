# Phase 1 audit — 21 November 2026

Scope: the supplied local Bank Security directory, application source, SQL, package manifest, installed dependency build, and configuration. No bank systems were accessed. Existing environment values were not printed or changed.

## Confirmed architecture

- React 19 + TypeScript, TanStack Router/Start server functions, Vite 8, Tailwind 4, Radix UI, TanStack Query. Existing dark/light theme, landing/login, monitoring, cases, rules, device logs, alerts, and audit screens.
- Supabase Auth and PostgreSQL/PostgREST, authenticated bearer requests and row-level policies. No Spring Boot or Java backend. Preserving this stack avoids unnecessary duplication and retains Lovable compatibility.
- The Drizzle TypeScript schema is empty; the SQL migration is the existing schema source. Do not run Drizzle schema push against it.
- Existing CSRF middleware, UUID database identifiers, role policies, and account masking in the UI were retained.
- Baseline TypeScript and production build passed. The directory has no .git; Git discovery points to an unavailable parent location. No commit, push, or history rewrite was performed.

## Findings and priorities

| Priority | Finding | MVP response |
|---|---|---|
| Critical | Every signup was granted analyst access, which could read all accounts and modify operational data | New signup receives customer only; owned synthetic account; historical staff grants require manual review |
| High | Authenticated users could read all profile emails | Own-profile policy |
| High | Scoring conditions differed from rule descriptions; foreign geography substituted for velocity | PostgreSQL evaluates four explicitly described rules using actual recent event count and Colombo local time |
| High | Simulator marked nonexistent email deliveries successful and suggested replying BLOCK to freeze a card | In-app records explicitly unsent to mobile; no freeze claims or banking actions |
| High | Transaction, explanations, case and alerts could partially save; random event IDs collided | Transactional RPC, UUID idempotency, per-user lock |
| High | Browser/server input validators were identity functions | Zod validators plus database ownership, role and input checks |
| Medium | Many read errors became empty arrays | Main dashboard and list functions surface failures; visible dashboard/alert error states |
| Medium | Direct staff writes allowed forged/deleted operational history | Revoke direct operational writes; case/review RPCs generate audit entries |
| Medium | No tests or useful setup/security documentation | Real PostgreSQL-engine tests, CI, setup and limitations |

## Release sequence

1. This release: repair authorization and synthetic processing; preserve existing UI; test SQL isolation and fraud paths; document runnable setup.
2. Authentication hardening: enforce email verification, password rules, abuse limits, MFA enrollment and assurance checks, password reset, session revocation, and browser end-to-end tests against a separate Supabase project.
3. Verified Telegram/FCM destinations, outbox, deduplication, retry worker, opt-in preferences and test delivery. No delivery claims until provider receipts are verified.
4. Authorized exchange/market providers, explicit stale/delayed data labels, converter/watchlists; authorized bank adapter and consent lifecycle later.
5. Production readiness: ASVS L2 control review, security scans, external review, encrypted backup restore drill, production deployment and incident response validation.

Only the initial MVP is implemented here. The 16-page platform, financial data, mobile integrations, passkeys, MFA UI, and production certification are not complete.
