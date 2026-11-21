# MVP validation — 21 November 2026

## Results

- `npm test`: nine PostgreSQL-engine integration tests passed, covering ownership/default roles, explainable scores, replay suppression, alert review, real event velocity, rate limits including backdated events, staff case/audit atomicity, severity boundaries, disabled rules and fresh migration installation.
- `npm run typecheck`: passed after framework compatibility fixes.
- `npm run build`: patched Cloudflare-default build passed. Node-server preset also built successfully.
- `node scripts/smoke.mjs`: production landing and sign-in return HTTP 200; unknown path returns 404; no-store and nosniff response headers verified. Loopback network isolation required running this check with local network access.
- `npm audit --omit=dev`: zero known vulnerabilities in installed runtime dependencies. Full dependency audit retains four moderate findings in the unused Drizzle/esbuild development chain. Audit results are a point-in-time check, not proof of security.

## Verification limits

The in-app browser webview failed to attach, so no visual screenshot, responsive layout certification or browser end-to-end login result is claimed. The production HTTP checks do not execute client-side interactions. Docker is unavailable, so the supplied image/Compose configuration is untested as an image; its Node-server build target and HTTP startup were tested directly.

Real Supabase signup/email confirmation/session flows, hosted migration execution, Telegram/FCM delivery, live finance providers and bank integrations were not exercised. PGlite tests mock Supabase identity claims and roles while executing real SQL policies/functions. No production deployment, paid integration, commit or push was performed.

## Files changed by stage

1. Audit/setup: `docs/AUDIT.md`, `README.md`, `.env.example`, `.gitignore`, package manifest/lock, Supabase local Auth configuration.
2. Database/access: fresh baseline and MVP hardening migrations under `supabase/migrations`; typed RPC definitions; bearer verified-user middleware; validated server functions with propagated database failures.
3. Existing UI: BankGuard branding, synthetic scenario selector, currency-aware transaction/case amounts, dashboard error state, keyboard transaction selection, owner alert review, honest unsent statuses, restricted rule toggles, role-aware navigation and logout cache clearing.
4. Verification/deployment: `tests/database.test.mjs`, `scripts/smoke.mjs`, CI, runtime dependency audit report, security/API/architecture documentation, Dockerfile and Compose configuration.

See README for Windows startup and manual verification. For an existing database apply only the hardening migration after backup and staging validation; do not replay the fresh baseline. Review historical staff grants before shared deployment. Legacy fixture assessments are retained for audit history and are not retroactively rescored; use new synthetic scenarios to verify current rules.
