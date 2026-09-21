# Integration Guides

Per-ecosystem connection guides for the Integrations layer (core prompt 07).
Consolidated here as sections; split into per-service files when each is built.
**All inbound external data is untrusted — validate before persisting. Broker all
third-party secrets server-side; never store them in client state.**

| Service | Direction | Synced entities | Auth | Failure handling |
|---|---|---|---|---|
| **Supabase** | bi | users, onboarding_state, lifecycle_state, deals | service role (server) + RLS | retry w/ backoff; surface sync_failed |
| **Vercel** | out | hosting/edge functions, env | project token | deploy gate in CI |
| **n8n** | bi | workflow triggers, digest sends | webhook + API key | dead-letter + replay |
| **Microsoft (M365/Power Platform)** | bi | calendar, Teams, Power Automate flows | OAuth2 (MS Entra) | token refresh; backoff |
| **Claude** | out | AI recommendations, explanations | API key (server) | rate-limit; cache |
| **Google (Workspace/Drive)** | bi | Drive docs, Sheets exports | OAuth2 | token refresh; backoff |
| **AWS** | bi | S3 storage, optional compute | IAM role / scoped keys | retry; CloudWatch alert |

## Implementation notes
- Each integration emits normalized events (`integration_connected{service}`,
  `sync_succeeded{service}`, `sync_failed{service,reason}`) so analytics stays
  consistent regardless of source.
- Supabase RLS enforces per-user / per-workspace isolation on financial data — this
  is a security control, not just config (see package Security Review).
- Outbound calls (Claude, Google, MS, AWS) must rate-limit + back off; never block
  the user-facing flow on a slow external sync.
