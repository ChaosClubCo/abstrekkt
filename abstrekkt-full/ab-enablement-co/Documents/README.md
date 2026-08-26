# FlashFusion Inbound Webhook Ingress — [PROD]

PERSONAL lane / FlashFusion. Production webhook ingress with HMAC verification, duplicate-delivery
prevention, approval-gated delivery, and a phased path to agents + async infra. **Nothing in this
package has been deployed or sent** — it is reviewable code + config. Irreversible steps are gated
and labeled; each needs your explicit "proceed."

## 1. Executive Summary
An n8n **production webhook** (`POST /flashfusion/events`) accepts signed events. A Code node
verifies a Stripe-style HMAC signature over the raw body (with a replay window), then claims the
delivery id in a Supabase ledger so redelivered events are processed **exactly once**. New +
`approved` events are posted to a chat channel (Slack ChaosClubCo by default = lane-clean; Teams
optional = cross-lane). Phases 2–6 add an Anthropic provider adapter, a read-only GitHub App
(write-gated), and Cloudflare Queues + R2 for async/file workloads.

## 2. Architecture
```
Sender ──POST(signed)──▶ n8n Webhook (rawBody on)
                          │
                          ▼
              Code node: verify HMAC (t + v1, 300s window)   ── invalid ──▶ 401
                          │ valid
                          ▼
              Claim delivery_id in Supabase (insert, ignore-dupes)
                          │
                 ┌────────┴─────────┐
              isNew && approved   duplicate / not-approved
                 │                     │
                 ▼                     ▼
        POST to Slack/Teams          200 ok (skip)
                 │
                 ▼
               200 ok
```
Phase 2: `AnthropicAdapter` + `AgentRunner` (named agents → real model work).
Phase 3: `GitHubAppClient` read-only; `assertWritesPermitted()` fails closed.
Phase 6: `queue-consumer.ts` drains `flashfusion-jobs`, writes artifacts to R2, DLQ on poison.

## 3. Implementation
| File | Role |
|---|---|
| `n8n/flashfusion-webhook.workflow.json` | Importable workflow (webhook → verify → gate → deliver → respond) |
| `n8n/code-node-verify.js` | Paste into the Code node: HMAC verify + Supabase idempotency claim |
| `src/hmacVerify.ts` | Stripe-style signature verify/sign, constant-time compare, replay window |
| `src/idempotency.ts` | Supabase-backed delivery ledger (`claim` → isNew) |
| `src/deliver.ts` | Slack/Teams payload builder + retrying POST |
| `src/anthropicAdapter.ts` | Phase 2 provider adapter + named-agent registry |
| `src/githubReadonly.ts` | Phase 3 read-only GitHub App client (write-gated) |
| `sql/001_webhook_deliveries.sql` | Idempotency ledger table + RLS lockdown |
| `infra/wrangler.toml`, `infra/queue-consumer.ts` | Phase 6 Queues + R2 (gated) |
| `infra/github-app-setup.md` | Phase 3 App creation, JWT signer, gate procedure |
| `test/smoke.test.mjs` | 9 smoke tests (HMAC, idempotency, delivery, adapter) |

### Deploy (Phase 1)
1. Apply `sql/001_webhook_deliveries.sql` to flashnframe-app (GATED — needs "proceed").
2. Import the workflow JSON into n8n; paste `code-node-verify.js` into the Code node.
3. Set env vars (see `.env.example`) in n8n; store secrets in Bitwarden.
4. Activate the workflow → copy the production webhook URL.

## 4. Security
- HMAC-SHA256 over `${timestamp}.${rawBody}`; constant-time compare; 300s replay window.
- Supports multiple `v1=` signatures for **key rotation**.
- Secrets only via env/Bitwarden. `service_role` key is server-side only; RLS denies all
  non-service access to the ledger. No secret is embedded in any client-reachable code.
- GitHub App ships **read-only**; writes fail closed until the two-step gate is opened.

## 5. Performance
- Webhook path does 1 HMAC (µs) + 1 Supabase insert (single round-trip) before ack.
- Delivery POST has bounded retries (250/500/1000ms) with an 8s timeout.
- Slow work (model calls, file generation) is designed to move to the Phase 6 queue so the
  webhook stays fast.

## 6. Observability
- Ledger rows carry `status` (received/processed/skipped/failed) + timestamps.
- Adapter returns token usage. Queue consumer logs failures before retry/DLQ.
- [GAP] No metrics emitter wired yet (see §10).

## 7. Failure Modes
| Failure | Behavior |
|---|---|
| Bad/absent signature | 401, no processing |
| Clock skew > 300s | 401 (replay guard) |
| Duplicate redelivery | 200 ack, processing skipped |
| Supabase error during claim | Throws → fails **closed** (won't double-send) |
| Delivery 5xx/429 | Retries; non-2xx non-retryable → error |
| Queue job poison | Retries to max, then DLQ (not lost) |

## 8. Validation
- `npx tsx --test test/smoke.test.mjs` → **9/9 pass** (verified in build).
- `npx tsc --noEmit` under strict → **clean** (verified in build).
- Acceptance: (a) tampered body → 401; (b) same delivery id twice → one delivery; (c) approved
  event → exactly one channel post; (d) non-approved → no post.

## 9. Next Steps
1. You: decide delivery target (Slack lane-clean vs Teams cross-lane) + provide webhook URL.
2. Proceed → apply SQL migration + create R2 bucket (I can do R2 live via MCP).
3. Set `ANTHROPIC_MODEL` to a **verified** current id; wire `AgentRunner` into the queue consumer.
4. Phase 3 when repo access is needed; Phase 6 when work goes async/produces files.

## 10. CLAIMS CHECK
See `what-changed.md` for the CLAIMS / GAPS footers.
