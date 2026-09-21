# FocusFlow AI — MVP Bundle
- App Router Next.js 14, Supabase, Stripe, OpenAI, OTEL
- Idempotent Stripe webhook + AI usage counters
- Server-side entitlement checks returning HTTP 429 with Retry-After

## Quickstart
1. Copy `.env.example` to `.env.local` and fill keys.
2. Apply SQL: `psql $DB_URL -f supabase/schema.sql` and `psql $DB_URL -f supabase/policies.sql`
3. Run dev: `npm i && npm run dev`

## Webhooks
- Start Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Create a session via `/api/stripe/checkout`

## Observability
- Set `OTEL_EXPORTER_OTLP_ENDPOINT` to your collector.
