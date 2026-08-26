# Security Policy
## Data
- No PII in logs. Surrogate keys only.
## Access
- Supabase RLS owner model. Service role on server only.
## Payments
- Stripe webhook signature verify + idempotent handling.
## LLM
- Input sanitization. Rate limits. Abuse filtering.
## IR
- 24h initial response. 72h post-mortem.
