# Security status

Reference: [OWASP ASVS 5.0](https://asvs.owasp.org/) as a future Level 2 verification target. No conformance claim. See Supabase's [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) and [function privilege](https://supabase.com/docs/guides/database/functions) guidance.

Implemented and covered by PostgreSQL-engine tests: customer-only signup, ownership isolation, server-computed synthetic scores, event deduplication, received-time rate limits, atomic assessment/case/alert persistence, owner-only alert review, staff-only case changes and audit records. Direct operational table writes are revoked. New security-definer functions have fixed empty search paths and explicit caller checks; anonymous execution is revoked. Database owners can still alter audit data; this is not tamper-proof storage.

Server functions verify bearer claims, current user identity and confirmed email. Existing CSRF protection remains. Response headers restrict framing, object/base/form use and device permissions and mark responses no-store. CSP does not yet restrict scripts with nonces. Sign-out clears query cache. No service-role secret is used by these functions.

## Before shared or real financial use

- Audit historical analyst grants: the previous signup trigger gave everyone staff access. Existing roles are preserved to avoid silently removing legitimate operators.
- Enforce and test hosted Auth email confirmation, 12-character passwords, abuse rate limits, SMTP, session expiry/revocation and allowed redirects. Local defaults do not change hosted settings.
- Add MFA/passkeys/password reset, step-up authentication and assurance checks. Browser bearer tokens still use Supabase browser storage; HttpOnly cookie sessions are not implemented.
- Resolve dependency advisories and review Nitro beta compatibility. CI intentionally fails on unresolved high/critical runtime advisories.
- Run real Supabase and browser tests for signup/login/logout, expiry, CSRF, CORS and revocation. PGlite tests mock identity; they do not validate cryptographic authentication or hosted policies.
- Review/redact existing SSR logs and Lovable error-reporting telemetry. Do not send financial data or credentials to telemetry.
- Complete nonce-based script CSP, edge TLS/HSTS, secret scanning, static/dynamic security review, encrypted backups, retention/deletion, secrets/key management and independent assessment.
- Implement verified Telegram/FCM destinations, opt-in/revocation, durable outbox, deduplication and bounded retries before claiming mobile delivery.

## Backup, rollback and incidents

Back up before migration; encrypt backups and test restoration in isolation. Roll back application artifacts only when compatible with the new schema; prefer a forward corrective migration to undoing security controls. Restore can lose later events, so plan reconciliation and a maintenance window. No backup infrastructure was activated.

For an incident, contain the affected integration, revoke compromised sessions/keys through the provider, preserve redacted evidence, identify affected identities, notify responsible operators through established channels, rotate credentials and verify isolation before restoring access. Reporting requirements need qualified review. No intrusive testing against third-party systems was performed.
