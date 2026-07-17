# FocusFlow AI — Multi-Root Framework Bundle
This archive contains the four golden prompts (P1–P4), a minimal Next.js seed, Supabase SQL, governance artifacts, and integrations.

## Structure
- /P1_seed — ideation prompt + example ideas
- /P2_build — Next.js seed + API routes + Supabase schema
- /P3_governance — security, observability, retention, threat model
- /P4_evolution — digest function, roadmap, Slack payload
- /extensions — idempotency, entitlements, chaos day, DSAR SQL
- /integrations — OTEL, Stripe, Supabase, Slack, Resend, Sentry, PostHog, Plausible, Upstash, Turnstile, Vercel, GitHub Actions

## Deploy (high level)
1) Provision Supabase; run `supabase/schema.sql` then `supabase/policies.sql`.
2) Set env using `.env.example` as guide.
3) Configure Stripe webhook -> `/api/stripe/webhook`.
4) Set OTLP endpoint; verify spans.
5) Optional: enable Resend, Sentry, PostHog, Plausible, Upstash, Turnstile.
