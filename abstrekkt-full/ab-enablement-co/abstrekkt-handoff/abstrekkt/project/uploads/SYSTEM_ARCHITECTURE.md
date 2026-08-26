# System Architecture — FlashFusion / Abstrekkt software

**TL;DR:** TypeScript/React front end, Supabase (Postgres + Auth + RLS) as the system of record, Cloudflare at the edge, n8n for orchestration, Base44 for platform apps, Anthropic API as the default model provider. chaosclub.co is the one outlier (Firebase).

## Canonical stack [SOURCED — AGENTS.md, WorkstreamMapper.jsx]

| Layer | Technology | Notes |
|---|---|---|
| Language / UI | TypeScript (strict), React 19, Vite | strict TS on FF apps; chaosclub.co has no strict mode, no Zod |
| Data + auth | Supabase (Postgres, Auth, RLS) | RLS must never be disabled; migrations immutable once applied |
| Edge / CDN / DNS | Cloudflare (Workers, Pages, R2, CDN, DNS) | R2 for signed-URL media gating |
| Orchestration | n8n (krosebrook.app.n8n.cloud) | 11 workflows currently blocked |
| Platform apps | Base44 | Fusion AI + FF Consulting CRM |
| Payments | Stripe | webhook idempotency required |
| Analytics / errors | PostHog, Sentry | PostHog untaxonomied on chaosclub.co |
| Email | Resend | |
| Model providers | Anthropic API (claude-sonnet-4-6 default; opus for max tier); Gemini (chaosclub.co); OpenAI (TBC) | no unified cost view; no provider-abstraction layer |
| CRM | HubSpot | FF Consulting |
| Automation glue | n8n + Make + Zapier | |
| Knowledge | Notion (FlashFusion HQ) | |

## App topology

- **app.flashfusion.co** — Fusion AI (Base44, ~101 entities).
- **client.flashfusion.co** — FF Consulting ops CRM (Base44 + HubSpot); ROI model pending.
- **audit.flashfusion.co** — FreeAssessment flow + case-study publishing.
- **chaosclub.co** — peer-support app (Firebase + R2 + Stripe + PostHog). Migration-to-Supabase is a design spike only.
- **mcp.flashfusion.co** — referenced as a 50-MCP routing platform on Base44 + Manufact Cloud; architecture reference not yet written. [SOURCED — drive_audit.jsx] [GENERATED — maturity unclear]

## Hard architectural rules [SOURCED — AGENTS.md]

1. Never commit secrets or `.env` values. **Secrets are server-side only, via env vars** — never in client bundles (aligns with Kyle's security hard rule).
2. Never disable Supabase RLS.
3. Never modify applied Supabase migrations without explicit instruction.
4. All data writes idempotent.
5. No placeholder content — surface the gap if data is missing.
6. Regenerate types after schema changes: `pnpm supabase gen types typescript`.

## Known architectural debt

- **Two DB platforms** (Supabase everywhere + Firebase on chaosclub.co) — doubles auth surface, blocks shared RLS. Migration costed but not committed. [SOURCED — WorkstreamMapper.jsx]
- **No provider-abstraction layer** — model provider changes are not centralized; no unified cost view. [SOURCED — WorkstreamMapper.jsx]
- **~101 Base44 entities, unknown dead count** — schema bloat, slower agent context. [SOURCED — WorkstreamMapper.jsx]
- **Home directory initialized as a global Git repo** — unresolved structural workspace debt. [SOURCED — drive_audit.jsx]
