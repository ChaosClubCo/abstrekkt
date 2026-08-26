# FlashFusion Monorepo Layout (platform-first)

Carried verbatim from the source chat, then annotated with where the artifacts
in *this* package land. The organizing principle from the source:

> **If it affects money, permissions, or AI output — it lives in Postgres.**
> No hidden state. No magic globals. No client trust.

```
flashfusion/
  apps/
    web/                      # Next.js (Vercel): RSC + Server Actions, API routes
    workers/                  # Node workers (queues, job runners) <- worker/executor.ts
    edge-functions/           # Supabase Edge Functions (webhook intake, light validation)
  packages/
    db/                       # SQL migrations, RLS policies, typed queries  <- migrations/*
    contracts/                # AI job contract, integration contracts, schemas <- contracts/ai-job-contract.json
    ui/                       # shared design system
    core/                     # auth, tenancy utils, idempotency, logging
    integrations/             # Shopify/Etsy/TikTok/Printify clients + adapters
    validators/               # FlashFusion Validator Suite modules
  tooling/
    cli/                      # ff: commands (scaffold, doctor, deploy, migrate)
    scripts/                  # smoke, rollback, seed  <- scripts/*, seed.sql
  docs/
    architecture/
    runbooks/
    security/                 # <- docs/RLS-TESTS.md, security notes
```

## Where this package's files map

| This package | Monorepo home |
|--------------|---------------|
| `migrations/0001..0006_*.sql` | `packages/db/migrations/` |
| `seed.sql` | `tooling/scripts/seed.sql` or `packages/db/seed.sql` |
| `contracts/ai-job-contract.json` | `packages/contracts/` |
| `worker/executor.ts` | `apps/workers/src/` |
| `scripts/smoke.sh`, `scripts/rollback.sh` | `tooling/scripts/` |
| `docs/RLS-TESTS.md` | `docs/security/` |

## Execution-fabric split (from source)

- **Vercel** = execution fabric. Next.js App Router (RSC + Server Actions).
  - **Edge functions**: auth-gated AI request entry, webhook verification, light
    personalization. Keep payloads small.
  - **Serverless (Node) functions**: heavy orchestration, billing enforcement,
    long-running AI workflows. Large prompts belong here, not on the edge.
- **Supabase** = system of record / authority layer: Postgres (truth), Auth
  (User/Owner/Embedded-Client roles, JWT plan+tier claims), Realtime (job
  status), Storage (generated assets), Edge Functions (webhook intake).

## Validator Suite mapping (first-class, not a side feature)

The FlashFusion Validator Suite becomes another `ai_job_kind` + contract module:

- Validator "tracks" -> `ai_job_kind = 'validator_run'` with `input.track = SaaS|Content|Ecom`
- Shared UI -> `packages/ui`
- Scraping/scoring logic -> `packages/validators`
- Cached trends + validated ideas -> new tables `validated_ideas`, `trend_cache`,
  `validator_runs` (not in this package's migrations yet — see Next Steps).

## Embed support (deferred — hooks already in the schema)

The `embedded_customer` role (enum) and `can_embed` plan flag exist now. Do NOT
start embed work until: AI job + billing is correct, the publish pipeline is
reliable, and audit logs are trustworthy. When ready, add an `embed_sessions`
table (org-owned), issue short-lived signed session tokens, and constrain
embedded users to a subset of scopes (generate only; no billing admin).
