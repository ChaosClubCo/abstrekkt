# Infrastructure Architecture

    _Generated: 2026-06-21. Reconstruction confidence is bounded by accessible project memory/context and the current chat session._


## Primary Stack

- Vercel: Next.js web deployment.
- Supabase: Postgres, Auth, RLS, Edge Functions, Storage metadata, pgvector.
- GitHub: source control, CI/CD, branch protection, code scanning.
- Cloudflare: DNS, WAF, caching where configured.
- Observability: Sentry, PostHog, Langfuse, OneUptime as staged adoption.

## Environments

- `local`: developer machine using `.env.local` and Supabase local/dev.
- `preview`: Vercel preview deployments per PR.
- `staging`: controlled environment with seeded test data.
- `production`: protected branch deploy with migrations, smoke tests, and rollback plan.
