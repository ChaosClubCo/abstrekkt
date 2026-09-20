# Engineering Quality Gate — Mandatory Patterns

> Paste this into CLAUDE.md, instructions.md, or project-level system prompts. Every build session inherits these as constraints.

## PHASE 1: NON-NEGOTIABLE (Every file, every commit)
- **Input validation at every trust boundary** — Zod/Joi schemas, parameterized queries, reject invalid early
- **Structured logging** — JSON with correlationId, requestId, tenantId. No bare console.log in production
- **Error classification** — TRANSIENT (retry), PERMANENT (alert), EXPECTED (log). Consistent error response shapes
- **Secrets in env vars only** — Never in code, never in frontend bundles, never in git history
- **Timeouts on ALL network calls** — Connect (2-5s), read (5-30s), total. Default no-timeout = leak
- **Deep health checks** — `/health` verifies DB, cache, downstream deps. Not just "process alive"
- **Connection pooling** — Reuse DB/Redis/HTTP connections. Pool exhaustion is the silent killer

## PHASE 2: RESILIENCE (Before any external dependency)
- **Retry with backoff + jitter** — Transient + idempotent only. Max 3-5 retries. Log every retry
- **Circuit breaker** — Per dependency. Closed → Open (5 failures/60s) → Half-Open (30s cooldown)
- **Fallback strategies** — Design BEFORE needed. Stale cache, safe defaults, feature flag disable
- **Rate limiting** — Per-user, per-IP, per-endpoint, per-tenant. Token bucket or sliding window
- **Idempotency keys** — Every write endpoint. Client-generated UUID. Store key + response for 24-48h
- **Backpressure** — Queue depth limits. 503 + Retry-After when at capacity. Never buffer unboundedly

## PHASE 3: DATA INTEGRITY (Every write path)
- **Optimistic concurrency** — Version column checked at write. Reject stale, don't overwrite
- **Zero-downtime migrations** — Expand then contract. Never rename/drop in single deploy
- **Async job queues** — Email, PDF, AI inference off request path. Every job: retries + DLQ + timeout

## SECURITY BASELINE (AppSec mandate — non-negotiable)
- **RLS on all multi-tenant tables** — Every query tenant-scoped by default, not by developer memory
- **OWASP Top 10 check** before any auth or API work
- **No secrets in client code** — Ever
- **Dependency scanning** — npm audit / Snyk on every PR
- **CORS / CSP / security headers** — Test in report-only first

## OBSERVABILITY MINIMUM
- **Structured logs** + **distributed tracing** (OpenTelemetry) + **RED metrics** (Rate, Errors, Duration)
- **Error classification** — Don't page on 404s. Burn-rate alerts, not threshold alerts
- **SLIs/SLOs** — Define "working" quantitatively before building

## WHEN TO SEARCH FOR MORE
Reference `engineering-patterns-phased.md` for the full 8-phase implementation guide covering: caching strategies, deployment safety, scalability patterns, and unknown-unknowns (DNS TTL, clock skew, cold start amplification, connection leaks, cascade retry amplification, TOCTOU, unbounded aggregations, log cardinality explosion).
