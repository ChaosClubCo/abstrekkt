# FlashFusion — Vercel + Supabase Multi-Tenant Architecture (ZIP_SPEC)

> Reconstructed from source chat
> `Production-grade FlashFusion architecture on Vercel and Supabase`
> (uuid `f490b74d…`, created 2025-12-21, batch-0001).
> The source designed a **wide, edge-first, multi-tenant AI SaaS** for Kyle's
> FlashFusion (ecommerce content generation + publishing): Supabase as the
> system of record, Vercel as the execution fabric. It already contained a
> near-complete artifact set — a multi-tenant Postgres schema + RLS migration,
> a strict AI-job lifecycle JSON contract, a Product→Listing→Publish vertical,
> a monorepo layout, RLS sanity checks, and its own CLAIMS CHECK. This package
> **materializes those artifacts as real files and expands them**: the single
> SQL blob is split into six ordered, idempotent migrations; the audit log and
> a DB-level transition guard (specified but never written) are added; the
> worker pickup/state-machine executor is built; and seed/smoke/rollback
> scripts plus an RLS test runbook are included.

## 1. Executive Summary

FlashFusion is treated as a **platform, not an app**. The architecture splits
cleanly along the line *where truth, cost, and authority live*:

- **Supabase = system of record / authority layer.** Postgres holds every fact
  that touches money, permissions, or AI output. Row-Level Security is
  enforcement (deny-by-default), not suggestion. Auth carries org roles
  (`owner`/`admin`/`member`/`embedded_customer`) and plan+tier claims.
- **Vercel = execution fabric.** Next.js App Router (RSC + Server Actions);
  edge functions for auth-gated AI entry + webhook verification; Node
  serverless/workers for heavy orchestration, billing enforcement, and
  long-running AI workflows.

The core security thesis from the source, preserved here: **AI is a
transactional system, not a stateless API call.** Credits are reserved before a
generation runs and reconciled after; clients may *request* jobs but never write
`ai_jobs.state`, cost columns, or `usage_events` — those are server-only. This
package ships that thesis as enforceable artifacts: deny-by-default RLS, a
database transition guard, idempotent billing keys, and a lease-based worker.

## 2. Build

```bash
# 0) configure (no secrets in git)
cp .env.example .env            # fill DATABASE_URL + Supabase keys

# 1) apply migrations IN ORDER (psql shown; Supabase SQL editor / CLI also work)
for f in migrations/000{1,2,3,4,5,6}_*.sql; do
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"
done

# 2) seed first org + owner + plan + demo product (edit the owner UUID first)
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f seed.sql

# 3) verify isolation + guards (offline self-test needs no DB)
bash scripts/smoke.sh           # offline: executor state-machine self-test
DATABASE_URL="$DATABASE_URL" bash scripts/smoke.sh   # db mode: RLS gate + guard

# 4) run the worker (after wiring runModel() to your model router)
WORKER_ID=worker-1 npx tsx worker/run.ts     # see worker/executor.ts:runLoop()
```

The offline self-test is the fast quality gate (no Postgres required); it
validates the contract's allowed transitions, the happy path, credit
enforcement, and idempotent billing. Verified passing in this build.

## 3. Output (file tree)

```
flashfusion-vercel-supabase-architecture/
├── README.md                         (this file)
├── .env.example                      all keys as placeholders + comments (no secrets)
├── seed.sql                          bootstrap org/plan/owner/demo product (idempotent)
├── migrations/
│   ├── README.md                     apply order, rollback, RLS verify gate
│   ├── 0001_extensions_and_helpers.sql      pgcrypto, org_role enum, RLS helper fns
│   ├── 0002_organizations_and_memberships.sql
│   ├── 0003_plans_and_usage.sql      entitlements + credit metering (server-only writes)
│   ├── 0004_vertical_products_listings_publish.sql
│   ├── 0005_ai_jobs_and_audit.sql    ai_jobs + audit_logs + DB transition guard
│   └── 0006_rls_policies.sql         enable RLS + deny-by-default ALLOW policies
├── contracts/
│   └── ai-job-contract.json          state machine + retry + billing + idempotency (v1.0)
├── worker/
│   ├── executor.ts                   pickup loop + state machine + reserve/finalize
│   └── executor.selftest.ts          offline in-memory verification (no DB)
├── scripts/
│   ├── smoke.sh                      fail-fast: static + offline self-test or DB RLS gate
│   └── rollback.sh                   guarded deploy + DB rollback (snapshot-first)
└── docs/
    ├── MONOREPO.md                   platform-first layout + Validator Suite mapping
    └── RLS-TESTS.md                  runnable tenant-isolation + tamper tests
```

### Architecture

```
            CLIENT (browser / embedded SDK)
                     │  requests only — never writes state/cost
                     ▼
   VERCEL  ┌───────────────────────────────────────────┐
 (exec     │ Next.js App Router (RSC + Server Actions)  │
  fabric)  │   edge fns: auth-gate, webhook verify      │
           │   node fns: orchestration, billing, AI     │
           └───────────────┬───────────────────────────┘
                           │ service role (RLS-bypass) — server only
                           ▼
   SUPABASE ┌──────────────────────────────────────────┐
 (system    │ Postgres (TRUTH)  ── RLS deny-by-default  │
  of        │   organizations / memberships / plans     │
  record)   │   usage_events (server-only writes)       │
            │   products → product_listings → publish_jobs
            │   ai_jobs  ── DB transition guard + audit │
            │ Auth (roles + plan/tier claims)           │
            │ Realtime (job status) · Storage (assets)  │
            └───────────────┬──────────────────────────┘
                           │ lease pickup (atomic CAS)
                           ▼
   WORKER   ┌──────────────────────────────────────────┐
 (Node)     │ executor.ts: queued→…→succeeded/failed    │
            │  reserve credits → run model → reconcile  │
            │  retry w/ backoff · stale-lock recovery   │
            └──────────────────────────────────────────┘
```

## 4. Implementation Considerations

- **RLS is necessary but not sufficient.** The API/worker must still enforce
  plan entitlements (`can_publish`, `monthly_credits`) and the credit state
  machine. RLS stops cross-tenant reads and client writes to sensitive tables;
  it does not understand business rules.
- **Server-only write tables:** `usage_events`, `publish_jobs`, `ai_jobs`,
  `audit_logs`. They have **no** authenticated insert/update policy by design.
  The worker writes them with the service role (which bypasses RLS). Adding a
  client insert policy "for convenience" reopens billing/state tampering.
- **Do not trust a client "active org".** Isolation derives from membership rows
  + explicit `organization_id` filters, never a mutable session variable.
- **Edge ≠ free.** Large prompts belong in Node functions, not edge.
- **Choose your worker host:** Supabase Edge Functions *or* a separate Node
  worker service. The source recommends (and this package assumes) a Node worker
  for reliability and long tasks.
- **Streaming UX** needs careful abort + retry; `streaming` is a first-class
  state in the contract.

## 5. Performance / Security Notes

- **Idempotency on every billable action.** `usage_events.unique(organization_id,
  idempotency_key)` + the `<job>:reserve` / `:finalize` / `:refund` key
  convention make retries safe (no double-charge, no double-refund).
- **Lease-based pickup with timeout.** `locked_by`/`locked_at` + an atomic
  conditional UPDATE (`for update skip locked`) prevent two workers grabbing one
  job; stale leases older than `lock_timeout_seconds` are reclaimed (zombie-lock
  recovery).
- **Conservative reservations.** Reserve the estimate up front; reconcile the
  delta on completion so a cheap-then-expensive race can't drain credits.
- **Deny-by-default RLS + `force row level security`** on the money/state tables
  so even a mistaken query as the table owner is policy-checked.
- **Don't store raw model output containing secrets.** Store hashes + redacted
  text. The executor's `runModel()` is a stub and must never `eval`/exec
  untrusted `job.input` — treat job input as data.
- **No secrets in the repo.** `.env.example` is placeholders only; the
  service-role key is server-only and must never be logged.
- **Webhook intake** (Stripe/Shopify/etc.) must verify signatures and protect
  against replay before mutating plans or jobs.

## 6. Recommended Next Steps

1. Wire `worker/executor.ts:runModel()` to your real model router (multi-model:
   GPT / Claude / Gemini, cost-aware dispatch).
2. Build the API surface the source listed: `POST /api/products`,
   `POST /api/listings/generate` (creates `ai_job(kind=listing_generate)` with
   reservation), `GET /api/ai-jobs/:id` (poll/stream), `POST /api/publish`.
3. Add the publish-job executor (mirror the AI-job lease + retry loop for
   integration calls; enforce `plan.can_publish`).
4. Add the Validator Suite tables (`validated_ideas`, `trend_cache`,
   `validator_runs`) and the `validator_run` ai_job_kind path (already in the
   enum) — see `docs/MONOREPO.md`.
5. Only then: embed support (`embed_sessions`, signed short-lived tokens,
   `embedded_customer` scope subset) — after AI/billing/publish/audit are solid.
6. Add CI: run `scripts/smoke.sh` (offline) on every PR; run db-mode smoke
   against an ephemeral Postgres.

## 7. Risk Checklist

| Risk | Status in this package |
|------|------------------------|
| **Auth gaps** | RLS deny-by-default; roles via `org_role` enum + membership predicates. App must still gate routes server-side. |
| **Secrets handling** | `.env.example` placeholders only; service-role key server-only; rollback/smoke read env, never echo secrets. |
| **Tenant isolation** | RLS on all 9 tenant tables; `force row level security` on money/state tables; isolation via membership, not session vars. Tested in `docs/RLS-TESTS.md`. |
| **Rate limiting** | Per-tenant kill-switch + credit caps are the throttle; an HTTP rate-limit helper is a **gap** (source mentioned it; not built here). |
| **Observability** | Append-only `audit_logs` + per-transition rows via DB trigger; cost-per-job tracked. Structured request logging is app-layer (not built here). |
| **Rollback** | `scripts/rollback.sh` (snapshot-first, guarded); migrations additive; reverse-order teardown for dev only. |
| **Dependency drift** | Worker is dependency-light (one JSON import); pin `@supabase/supabase-js`/`pg` + `tsx` when wired. |
| **Missing tests** | Offline executor self-test + RLS runbook included; integration/e2e (Playwright) are a **gap**. |
| **Unclear ownership** | `created_by` + `owner/admin` roles define ownership; delete restricted to owner/admin. |
| **Requirement contradictions** | See CLAIMS CHECK §8 (session-org vs membership-derived isolation; v1.0 contract). |

## 8. CLAIMS CHECK

The source carried its own claims check; it is **preserved and extended** here.

### Verified (present in source, materialized faithfully)
- Multi-tenant org-scoped schema with `organization_id` everywhere, role enum
  (`owner`/`admin`/`member`/`embedded_customer`), plans/entitlements, credit
  `usage_events` with idempotency, and the Product→Listing→Publish vertical.
- Deny-by-default RLS: `is_org_member(organization_id, auth.uid())` on all tenant
  tables; **no** authenticated insert/update on `ai_jobs`, `usage_events`,
  `publish_jobs` (client cannot tamper with billing/state).
- AI job lifecycle contract: explicit states, `allowed_transitions`, retry
  policy (retryable vs non-retryable codes, backoff), billing policy
  (reserve→reconcile, idempotency scoped to org), locking policy.
- Monorepo layout and the Validator Suite mapping (`validator_run` kind).
- Source's own verification steps (RLS sanity, contract sanity, vertical happy
  path) — materialized as runnable SQL in `docs/RLS-TESTS.md`.

### Inferred (this kit's reconstruction, not literally in source)
- Splitting the single SQL blob into six **ordered, idempotent** migrations and
  the apply/rollback runbook.
- The `audit_logs` table and the **DB-level transition guard trigger**: the
  source *specified* `audit_policy.log_every_transition` and recommended a
  "server-side transition guard" but never wrote them. Added so the contract is
  enforced in the database, not only in app code.
- The `worker/executor.ts` pickup loop, lease/CAS pickup, reserve/finalize
  billing implementation, retry/backoff, and the offline self-test — the source
  listed "Add worker pickup loop (state machine executor)" as a next step.
- Billing reconciliation arithmetic: reserve event = estimate, finalize event =
  `final − reserved` (delta), so `SUM(total_cost_credits)` = final cost. This is
  one consistent interpretation of the source's `reconcile.adjustment`; the
  source did not specify how reserve and finalize sum in rollups.
- The illustrative `price_table` in the contract (source referenced a price
  table but did not provide values; values here are conservative placeholders).

### Unresolved / caveats
- `runModel()` is a **stub** — no model provider is wired; reconciliation uses
  placeholder token counts until you connect a router.
- HTTP rate limiting, structured request logging, and Playwright e2e were
  referenced (source) or implied but are **not built** in this package.
- Cross-schema FK to `auth.users` is intentionally omitted (fragile across
  Supabase upgrades); membership integrity relies on RLS + the seed/admin path.
- `embed_sessions` and the SDK are deferred by design.

### Contradictions / risks flagged
- **Session-org vs membership-derived isolation (source's own warning):** if you
  later rely on an unvalidated client "active org" context, you can permit
  cross-tenant reads. This package follows the source's safe choice — isolation
  is membership-derived, no session-var org selection.
- **Convenience insert policy on `ai_jobs`:** adding one to let clients create
  jobs directly reopens state/cost tampering. Keep job creation server-only.
- **Stack version drift in source:** the human prompt said "Next.js 14"; a later
  assistant turn said "Next.js 15". Not resolved by the user; pin your version
  explicitly (this package is framework-agnostic at the data layer, so it is
  unaffected).
- **Reserve/finalize summation** must be applied consistently (see Inferred).
  If a rollup sums reserve as a charge *and* finalize as the full cost, it
  double-counts; this package's delta-finalize avoids that.
