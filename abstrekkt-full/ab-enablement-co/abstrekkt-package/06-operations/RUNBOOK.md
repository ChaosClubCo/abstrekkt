# Operations Runbook — solo-founder edition

**TL;DR:** With one person running everything, the operational risks are lane contamination, secret sprawl, and single-person continuity. This runbook captures the standing operational rules and the routines that keep them enforced.

## Lane separation (the load-bearing operational rule)

- **Three lanes:** the day-job (managed IT firm, never named externally), Abstrekkt/FlashFusion (the business), and personal. They never touch. [SOURCED — instructions]
- The firm is never named externally; "a managed IT firm" is the ceiling. Zero interest in the firm's clients. Subcontracting the firm is Phase 2 only, post-revenue, from leverage. [SOURCED — instructions]
- Work products, credentials, and time are attributed to the correct lane. The "diagnosing" skill belongs to Kyle, not any employer. [SOURCED — instructions]
- **Automation governance:** keep INT/day-job and FlashFusion tenants, schedules, and data sources strictly separated (no cross-lane cron/n8n tenant collision). [GENERATED — from auditing-cross-lane-routine-artifacts skill posture]

## Secrets & credentials

- Never commit secrets or `.env`. Secrets are **server-side only, via env vars** — never in client/frontend bundles. [SOURCED — AGENTS.md + Kyle security hard rule]
- Never disable Supabase RLS; never edit applied migrations without instruction. [SOURCED — AGENTS.md]
- Weekly credential/health check (Friday, ~10 min): n8n status, rotate if needed, Drive cleanup, Git status, MCP health. [SOURCED — drive_audit.jsx DigitalME runbook spec]

## Weekly maintenance (from the DigitalME runbook spec)

1. Check n8n (krosebrook.app.n8n.cloud) — are workflows running / any errored?
2. Rotate credentials if flagged.
3. Google Drive cleanup against the FlashFusion / Intinc / Personal / Archive taxonomy.
4. Git status; **resolve the home-directory global-git-repo issue** (unresolved structural debt). [SOURCED — drive_audit.jsx]
5. MCP health (Snyk via `snyk auth` not plaintext token; audit Windows-MCP before use; pre-warm uv cache). [SOURCED — drive_audit.jsx]

## Release / change process (software)

- `npm run dev && npm run build && npm test` before shipping. [SOURCED — AGENTS.md]
- Regenerate Supabase types after schema changes. [SOURCED — AGENTS.md]
- All writes idempotent; no placeholder content — surface gaps. [SOURCED — AGENTS.md]

## Continuity (single-person risk)

- The org's knowledge lives in the Claude project (225 docs) + this package. Keep the project current — it is the continuity mechanism if Kyle is unavailable. [SOURCED — project tool guidance]
- Client-facing commitments (delivery dates) must survive certification week and any day-job crunch; do not schedule client delivery in exam week. [SOURCED — instructions]

## Incident posture (lightweight)

- No formal monitoring/alerting/on-call exists (solo, pre-revenue). Sentry catches app errors; there is no paging. This is acceptable pre-revenue but must be revisited before any client depends on an always-on agent. [GENERATED — inferred from absence of ops docs]
