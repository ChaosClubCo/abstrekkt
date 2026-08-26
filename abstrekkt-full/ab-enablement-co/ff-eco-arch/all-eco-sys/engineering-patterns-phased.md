# Engineering Best Practices — Phased Implementation Reference

> **Purpose:** Paste relevant phase(s) into any LLM chat to guide implementation. Each pattern is self-contained. Implement in order — later phases depend on earlier ones.

---

## PHASE 1: FOUNDATION (Do First — Everything Else Depends on This)

### 1.1 Input Validation at Every Trust Boundary
Validate and sanitize all input at API entry points, service boundaries, and before DB writes. Use schema validation (Zod, Joi, Yup) for request bodies, query params, and path params. Parameterized queries only — never string interpolation for SQL. Reject invalid input early with clear error messages. Defense in depth: validate at gateway AND service AND DB constraint level.

### 1.2 Structured Logging with Correlation IDs
All logs must be JSON-structured with: timestamp, level, message, correlationId (trace ID propagated across requests), requestId, userId/tenantId, service name. Never use unstructured console.log in production. Include request method, path, status code, and duration on every HTTP log line. Use a logger library (pino, winston) configured once at app root.

### 1.3 Error Classification and Handling
Classify every error as: TRANSIENT (retry — network timeout, 503, DB lock), PERMANENT (alert — bad data, auth failure, 4xx), or EXPECTED (log only — 404, validation rejection). Wrap all async operations in try/catch. Never swallow errors silently. Return consistent error response shapes: `{ error: { code, message, details } }`. Map internal errors to safe external messages (never leak stack traces or DB errors to clients).

### 1.4 Environment-Based Secrets Management
All secrets (API keys, DB connection strings, service tokens) in environment variables only. Never in source code, frontend bundles, or Git history. Use `.env.example` with placeholder values committed; actual `.env` in `.gitignore`. For production: use platform secrets (Vercel env vars, Replit Secrets, Supabase vault, Cloudflare secrets). Rotate secrets on a schedule. Audit for accidental commits with `git log --all -p | grep -i "secret\|password\|api_key"`.

### 1.5 Aggressive Timeouts on All Network Calls
Every HTTP request, DB query, and external API call must have an explicit timeout. Default "no timeout" = thread/connection leak under load. Set connect timeout (2-5s), read timeout (5-30s depending on operation), and total timeout independently. For DB: statement_timeout in Postgres (SET statement_timeout = '30s'). For HTTP clients: configure at client instantiation, not per-request.

### 1.6 Health Checks (Deep)
Implement `/health` endpoint that verifies: DB connection alive, cache (Redis) reachable, critical downstream services responding. Return `{ status: "healthy" | "degraded" | "unhealthy", checks: { db: "ok", cache: "ok", ... }, timestamp }`. Separate liveness (process alive) from readiness (can serve traffic). If using Kubernetes/containers: liveness probe = shallow, readiness probe = deep.

### 1.7 Connection Pooling
Reuse database and Redis connections via pooling. For Postgres: PgBouncer or Supabase's built-in pooler or Cloudflare Hyperdrive. Set pool min/max based on expected concurrency. Monitor active vs idle connections. For HTTP clients: reuse agents with keep-alive. For serverless: use external poolers (connection per invocation without pooling = DB connection exhaustion at scale).

---

## PHASE 2: RESILIENCE (Prevent Cascade Failures)

### 2.1 Retry with Exponential Backoff + Jitter
Retry transient failures only (network errors, 503, 429, DB lock timeouts). Use exponential backoff: delay = base * 2^attempt. Add random jitter (±25-50%) to prevent synchronized retry storms. Set max retries (3-5). CRITICAL: Only retry idempotent operations. Non-idempotent writes without idempotency keys must NOT be retried. Log every retry with attempt number and delay.

### 2.2 Circuit Breaker Pattern
Track failure rate per dependency. Three states: CLOSED (normal, requests pass through), OPEN (failures exceeded threshold, return fallback immediately without calling dependency), HALF-OPEN (after cooldown, allow one test request — if succeeds go CLOSED, if fails go OPEN). Thresholds: open after 5 failures in 60 seconds, cooldown 30 seconds. Libraries: opossum (Node.js), resilience4j (Java). Every external dependency should have its own circuit breaker.

### 2.3 Fallback Strategies
Design fallbacks BEFORE you need them. For each external dependency, define: What do we show if this is down? Options: serve stale cached data, return safe defaults, disable non-critical feature (behind feature flag), show static fallback page. Test fallbacks explicitly — untested fallbacks fail in production. Priority: data-serving paths get stale-cache fallback; feature paths get graceful disable; write paths get queued-for-retry.

### 2.4 Bulkhead Isolation
Separate connection pools / thread pools per dependency. If Service A has a shared pool of 20 connections used for DB, Redis, and external API, one slow external API consumes all 20 connections and starves DB access. Instead: DB pool = 10, Redis pool = 5, external API pool = 5. Apply to HTTP clients, DB connections, and worker threads independently. Failure in one pool cannot cascade to others.

### 2.5 Rate Limiting (Tiered)
Implement rate limits at multiple levels: per-IP (prevent abuse from single source), per-authenticated-user (fair usage), per-tenant (multi-tenant isolation), per-endpoint (protect expensive operations). Use token bucket or sliding window algorithm. Return 429 with `Retry-After` header. Store counters in Redis for distributed systems. For APIs behind shared NAT: prefer authenticated user identity over IP. Rate limit AI/LLM endpoints aggressively (cost amplification risk).

### 2.6 Backpressure
When a downstream system can't keep up, signal upstream to slow down rather than buffering unboundedly. Implement queue depth limits — reject new work when queue exceeds threshold. For HTTP: return 503 with Retry-After when at capacity (load shedding). For message queues: set max queue length, use consumer acknowledgment before pulling more. For streams: use reactive backpressure (Node.js streams have this built in). Without backpressure: queues grow → memory exhaustion → OOM → cascading failure.

### 2.7 Idempotency Keys
Every write/mutation API endpoint should accept an `Idempotency-Key` header (client-generated UUID). Server stores key + response for TTL (24-48 hours). If same key received again, return stored response without re-executing. For DB writes: `INSERT ... ON CONFLICT DO NOTHING` or `ON CONFLICT DO UPDATE`. This makes retries safe, prevents duplicate charges/records, and is required for reliable webhook/event processing.

---

## PHASE 3: PERFORMANCE & CACHING (Speed Without Complexity)

### 3.1 Layered Caching Strategy
Layer 1 — Browser: `Cache-Control: public, max-age=31536000, immutable` for hashed static assets. `Cache-Control: no-cache` + ETag for dynamic HTML. Layer 2 — CDN/Edge: cache static assets and cacheable API responses at edge. Use `stale-while-revalidate` for tolerance of brief staleness. Layer 3 — Application (Redis): cache hot-path query results, session data, computed values. Set TTL based on data freshness requirements. Layer 4 — DB: materialized views for expensive aggregations refreshed on schedule. Every cache entry must have a TTL. Every cache must have an invalidation strategy documented.

### 3.2 Cache Invalidation Patterns
Choose per use case: CACHE-ASIDE (lazy load: check cache → miss → query DB → populate cache; most common), WRITE-THROUGH (write to cache and DB simultaneously; strong consistency), WRITE-BEHIND (write to cache, async flush to DB; fast writes, risk of data loss). For multi-tenant: ALWAYS include tenant ID in cache key to prevent cross-tenant data leaks. Prevent cache stampede: use probabilistic early expiration or mutex/lock on cache miss so only one request rebuilds.

### 3.3 Lazy Loading
Defer loading of non-critical resources until needed. Images: `loading="lazy"` attribute or Intersection Observer. Routes: dynamic `import()` for route-level code splitting. Components: React.lazy + Suspense with meaningful loading states. DB relations: don't eagerly JOIN everything — load related data on demand. Risk: layout shift (CLS) — use fixed-dimension placeholders for lazy-loaded images/components.

### 3.4 Code Splitting and Tree Shaking
Split bundles by route (each page loads only its code) and by feature (heavy libraries loaded only when feature is used). Use dynamic `import()` at split points. Tree shaking: ensure ES module imports (`import { x } from 'lib'` not `const x = require('lib')`). Audit bundle with `npx webpack-bundle-analyzer` or `npx vite-bundle-visualizer`. Target: no single chunk > 200KB gzipped. Mark side-effect-free packages in package.json for better tree shaking.

### 3.5 Database Indexing Strategy
Create indexes matching your actual query patterns. Use `EXPLAIN ANALYZE` on every slow query (>100ms). Composite indexes: column order matters — put equality conditions first, range conditions last. Partial indexes for filtered queries (`CREATE INDEX ... WHERE status = 'active'`). Covering indexes to avoid table lookups (`INCLUDE` clause). Monitor unused indexes (`pg_stat_user_indexes` where idx_scan = 0) and drop them — they slow writes. Never add indexes blindly; always validate with query plan.

### 3.6 Cursor-Based Pagination
Replace offset pagination (`LIMIT 20 OFFSET 1000`) with cursor-based (`WHERE id > $last_seen_id ORDER BY id LIMIT 20`). Offset is O(n) — DB skips rows sequentially, gets slower as offset grows. Cursor is O(1) — seeks directly via index. Return cursor token to client: `{ data: [...], nextCursor: "abc123" }`. For multi-column sort: encode composite cursor (e.g., `created_at + id` to break ties).

### 3.7 Debouncing and Throttling
Client-side: debounce search/autocomplete inputs (300-500ms delay after last keystroke). Throttle scroll/resize handlers (16ms = 60fps, or 100ms for non-animation). Server-side: batch/coalesce writes (collect changes over 1-2s window, flush as single write). Debounce notifications (don't send 10 emails for 10 rapid edits — wait 5 min, send one summary). For AI/LLM calls: debounce aggressively — each call costs money.

---

## PHASE 4: DATA INTEGRITY & ASYNC (Correctness at Scale)

### 4.1 Transactional Outbox Pattern
Problem: you need to write to DB AND publish an event (to queue/webhook). If you do them separately, one can succeed while the other fails = inconsistent state. Solution: write to your main table AND an `outbox` table in a single DB transaction. A separate process polls the outbox and publishes events, marking them as sent. This guarantees: if the DB write committed, the event will eventually be published. Use for: webhook delivery, event-driven architectures, cross-service data sync.

### 4.2 Async Job Queues
Move slow operations off the request-response path: email sending, PDF generation, image processing, AI inference, data exports, webhook delivery. Use a job queue (BullMQ + Redis, Inngest, Temporal). Every job must have: max retries, exponential backoff, a dead letter queue for permanent failures, timeout, and logging with job ID. Monitor queue depth and processing latency. Alert when DLQ has items — someone must investigate and replay or discard.

### 4.3 Dead Letter Queues (DLQ)
When a message/job fails all retries, route it to a dead letter queue instead of discarding. DLQ must be: monitored (alert when items arrive), inspectable (view payload and failure reason), replayable (re-enqueue fixed messages). Set max DLQ retention (7-30 days). Review DLQ weekly minimum. Common causes of DLQ items: schema changes, downstream permanently down, poison messages (malformed data). Without DLQ: failed messages disappear silently = silent data loss.

### 4.4 Optimistic Concurrency Control
Add a `version` integer or `updated_at` timestamp column to tables with concurrent write risk. On update: `UPDATE ... SET ..., version = version + 1 WHERE id = $id AND version = $current_version`. If 0 rows affected → conflict detected → fetch latest, merge or reject. Use for: collaborative editing, inventory management, any resource with concurrent writers. Cheaper than pessimistic locking for low-to-medium contention. For high contention: use pessimistic locking (`SELECT ... FOR UPDATE`).

### 4.5 Schema Migrations (Zero-Downtime)
Never rename or drop columns in a single deploy. Use expand-then-contract: Step 1 (deploy A): add new column, write to both old and new. Step 2 (backfill): migrate existing data from old to new column. Step 3 (deploy B): read from new column, stop writing old. Step 4 (deploy C): drop old column. For large tables: use `CREATE INDEX CONCURRENTLY` (Postgres) to avoid locking. Monitor `pg_stat_activity` for lock contention during migrations. Always test migrations against production-sized data in staging.

### 4.6 Saga Pattern (Distributed Transactions)
When a business operation spans multiple services/databases, use a saga: a sequence of local transactions where each step has a compensating action (undo). Example: Create Order → Reserve Inventory → Charge Payment. If payment fails: Compensate Inventory (release) → Compensate Order (cancel). Implement as orchestrator (central coordinator) or choreography (each service listens for events). Log every step for debugging. Test compensation paths — they are the most under-tested code in any system.

---

## PHASE 5: OBSERVABILITY & OPERATIONAL MATURITY

### 5.1 Distributed Tracing
Instrument with OpenTelemetry. Propagate trace context (W3C Trace Context header) across all service calls. Every span should include: service name, operation name, duration, status, and relevant attributes (userId, tenantId, endpoint). Sample at 10-100% depending on traffic volume. Use trace-based debugging: given a slow request, see the full call chain with timing per service. Export to Jaeger, Grafana Tempo, or Datadog APM. Without tracing, debugging latency in multi-service systems is guesswork.

### 5.2 Metrics (RED + USE Framework)
RED for services: Rate (requests/second), Errors (error rate %), Duration (latency p50/p95/p99). USE for infrastructure: Utilization (% capacity used), Saturation (queue depth, wait time), Errors (hardware/system errors). Instrument both. Use Prometheus + Grafana, Datadog, or PostHog for metrics. Alert on: error rate > 1%, p99 latency > 2x baseline, saturation > 80%. Do NOT alert on p50 — it's too noisy. Dashboard the four golden signals per service.

### 5.3 SLIs / SLOs / Error Budgets
Define Service Level Indicators (SLIs): the metrics that matter (availability, latency, correctness). Set Service Level Objectives (SLOs): targets for those indicators (99.9% availability, p99 < 500ms). Calculate error budget: 100% - SLO = budget for incidents/experiments. Alert on burn rate (consuming error budget too fast), not raw thresholds. Review SLOs monthly. If consistently exceeding SLO: raise it or invest effort elsewhere. If burning budget: freeze features, fix reliability.

### 5.4 Error Budgets and Alert Design
Avoid threshold alerts (`if errors > 10 then page`). Use burn-rate alerts: if current error rate would exhaust monthly error budget in 1 hour → page. If would exhaust in 3 days → ticket. If within budget → do nothing. This prevents alert fatigue and aligns alerting with business impact. Every alert must have: runbook link, severity level, clear ownership, and expected response time.

### 5.5 Log Volume Management
Structured logging generates high volume. Control costs: log at appropriate levels (ERROR always, WARN in production, DEBUG only when investigating). Sample high-volume logs (log 1 in 100 successful requests, 100% of errors). Filter at source — don't ship logs you'll never query. Tier retention: hot (7 days searchable), warm (30 days archived), cold (90 days compressed). Estimate cost before shipping: 1GB/day to Datadog ≈ $3/day ≈ $90/month. At 100GB/day that's $9,000/month.

---

## PHASE 6: DEPLOYMENT SAFETY & RELEASE ENGINEERING

### 6.1 Feature Flags
Decouple deployment from release. Deploy code with feature behind flag → enable for 5% → monitor → ramp to 100% → remove flag. Use for: gradual rollouts, A/B tests, kill switches for new features, ops toggles (disable expensive feature under load). Implement with: LaunchDarkly, Unleash, Flipt, or a Postgres-backed flags table. CRITICAL: clean up flags after full rollout. Stale flags accumulate and become tech debt landmines. Track flag age; archive flags older than 90 days.

### 6.2 Canary and Blue-Green Deployments
Canary: route 5-10% of traffic to new version, monitor error rates and latency for 15-30 minutes, then promote or rollback. Blue-Green: run two identical environments, switch traffic atomically. Canary is better for catching subtle bugs; blue-green is better for instant rollback. Monitor during canary window: error rate, latency p99, and key business metrics (conversion, API success rate). Automate promotion/rollback based on metric thresholds.

### 6.3 Rollback Plan (Mandatory)
Every deployment must have a documented rollback path that takes < 5 minutes. For code: revert to previous container image / Git SHA. For DB migrations: every migration must have a reverse migration tested in staging. For feature flags: disable flag = instant rollback without redeploy. For config changes: revert config and restart. If rollback would take > 5 minutes or is impossible (destructive migration), the deploy needs additional review and a maintenance window.

### 6.4 CI/CD Pipeline Essentials
Minimum pipeline stages: lint → type check → unit tests → build → integration tests → deploy to staging → smoke tests → deploy to production. Add security scanning: dependency audit (`npm audit`), SAST (static analysis), secret scanning. Fail fast: lint and type check run in < 30 seconds. Parallelize test suites. Pin dependency versions (use lockfile). Cache node_modules/pip packages between runs. Deploy should be: one click, repeatable, and auditable (who deployed what when).

### 6.5 Chaos Engineering (Start Small)
Validate resilience by intentionally injecting failures. Start in staging. Level 1: kill a service instance, verify traffic routes to healthy instances. Level 2: add 500ms latency to a dependency, verify circuit breaker activates and fallback serves. Level 3: corrupt cache, verify cache-aside pattern rebuilds correctly. Level 4: simulate DB failover, verify connection pool recovers. Document findings. Fix what breaks. Graduate to production chaos only after staging is clean. Tools: Chaos Monkey, Litmus, Gremlin, or manual kubectl delete pod.

---

## PHASE 7: SCALABILITY PATTERNS (When Traffic Grows)

### 7.1 Horizontal Scaling Readiness
Ensure your service can run as N instances behind a load balancer. Requirements: no local filesystem state (use S3/R2 for files, Redis for sessions), no in-memory state that isn't replicated, no hardcoded `localhost` references, stateless request handling (JWT or session store, not in-process memory). Test by running 2+ instances locally and verifying no request depends on hitting the same instance twice.

### 7.2 Read Replicas and CQRS
When read:write ratio exceeds 10:1, separate read and write paths. Route reads to replicas, writes to primary. For Postgres: streaming replication to read replicas. For Supabase: use connection pooler with read replica support. CQRS (Command Query Responsibility Segregation): different models/stores optimized for reads vs writes. Risk: replication lag means reads may be stale by 10ms-5s. Design for eventual consistency or route critical reads (post-write verification) to primary.

### 7.3 Edge Computing and CDN Strategy
Push computation and caching to edge nodes (Cloudflare Workers, Vercel Edge Functions). Cache static assets with long TTL + immutable hashing. Cache dynamic API responses at edge with short TTL + `stale-while-revalidate`. Use edge for: auth token validation, A/B test assignment, geo-routing, rate limiting. Don't use edge for: complex DB queries, transactions, heavy computation. Risk: cache invalidation across 300+ edge PoPs takes time — design for eventual consistency.

### 7.4 Async Processing at Scale
As traffic grows, more work must move off the synchronous request path. Pattern: accept request → validate → enqueue job → return 202 Accepted with job ID → client polls for result or receives webhook callback. Use for: report generation, bulk operations, AI inference, media processing, data exports. Scale workers independently from web servers. Monitor queue depth as a leading indicator of capacity problems.

### 7.5 Database Scaling Patterns
Vertical first (bigger instance) until you hit limits. Then: read replicas for read scaling, connection pooling for connection scaling, table partitioning for large tables (partition by date, tenant, or range), archival strategy for old data (move to cold storage). Avoid premature sharding — it adds massive complexity. If you must shard: shard by tenant ID for multi-tenant SaaS. Monitor: `pg_stat_statements` for slow queries, table bloat, index usage, connection count.

---

## PHASE 8: ADVANCED / EDGE CASES (The Unknown-Unknowns)

### 8.1 DNS TTL and Failover
DNS records have TTL (time to live) cached by resolvers globally. Changing a DNS record doesn't take effect instantly — old TTL may be cached for hours to days. For failover: use low TTL (60-300s) on records that may change. For static assets: high TTL is fine. If your disaster recovery plan depends on DNS changes, test actual propagation time. Use health-check-based DNS (Cloudflare Load Balancing, Route 53 health checks) for automatic failover.

### 8.2 Clock Skew in Distributed Systems
Different servers have slightly different clocks. This affects: JWT expiry validation (token appears expired on one server but valid on another), event ordering (events appear out of order), rate limiting (time windows misaligned), cache TTL (expires at different times). Mitigation: use NTP synchronization, design for bounded skew (±1 second tolerance), use logical clocks (Lamport timestamps) for ordering where physical time isn't reliable.

### 8.3 Cold Start Amplification
Serverless functions and edge workers have cold start latency (100ms-2s). Under traffic spike: all instances cold start simultaneously = cascading timeouts upstream. Mitigation: provision minimum instances (Cloudflare Workers minimum = 0, but Vercel/AWS allow provisioned concurrency), use keep-alive pings, warm critical paths on deploy, set timeouts that accommodate cold start latency.

### 8.4 Serialization Cost at Scale
JSON.parse/JSON.stringify on large payloads on every request adds up. At 1000 req/s with 100KB payloads: ~100MB/s of serialization CPU. For internal service-to-service: consider Protocol Buffers, MessagePack, or CBOR for 2-10x speedup. For client-facing: JSON is fine but minimize payload size (field selection, pagination, compression). Profile serialization cost — it's often invisible in flame graphs but significant in aggregate.

### 8.5 Connection Leak Detection
Connections opened but never closed/returned to pool. Slow leak over days/weeks, then sudden pool exhaustion = all requests fail. Monitor: active connections over time (should be stable, not monotonically increasing), idle connection count, pool wait time. Set connection max lifetime (30 min) to force recycling. Log when pool wait time exceeds threshold. In Node.js: use `on('error')` handlers on all connection objects.

### 8.6 Retry Budget / Cascade Amplification
Service A retries 3x to Service B, which retries 3x to Service C. One failure at C = 9 requests from A's perspective. With fan-out: exponential amplification. Solution: global retry budget — each request carries remaining retry budget in header. If budget exhausted, fail immediately without retrying. Alternative: only retry at the edge (API gateway), not at intermediate services.

### 8.7 TOCTOU (Time-of-Check to Time-of-Use)
Check permission → gap → execute action. During the gap, permission/state can change. Example: check user has access → user gets removed → action executes = unauthorized access. Fix: atomic check-and-act (DB transaction, compare-and-swap). For file operations: use exclusive locks. For API operations: re-validate at execution time, not just at request start. Particularly critical for: payment processing, permission changes, inventory management.

### 8.8 Unbounded Aggregations
`SELECT COUNT(*) FROM large_table` scans the entire table. Works at 10K rows. OOM or timeout at 10M. Same for GROUP BY, DISTINCT on large datasets. Solutions: approximate counts (HyperLogLog, `pg_stat_user_tables` for row estimates), materialized rollup tables (pre-compute daily/hourly aggregates), paginated aggregation (compute in chunks), streaming aggregation (process as events arrive, maintain running totals). Design data models with query patterns in mind from day one.

### 8.9 Log/Metric Cardinality Explosion
Adding user_id, request_id, or other high-cardinality values as metric labels creates millions of time series = storage/cost explosion. Rule: metric labels should have bounded cardinality (< 1000 unique values). Use: status_code, method, endpoint, region, tenant_tier as labels. Do NOT use: user_id, request_id, session_id as metric labels. Put high-cardinality data in logs and traces, not metrics.

---

## QUICK REFERENCE: WHICH PHASE FOR WHICH PROBLEM

| Symptom | Go To Phase |
|---|---|
| App crashes under load | Phase 2 (Resilience) + Phase 1.7 (Connection Pooling) |
| Slow response times | Phase 3 (Caching/Performance) + Phase 5 (Observability to find bottleneck) |
| Data inconsistency / duplicates | Phase 4 (Data Integrity) + Phase 2.7 (Idempotency) |
| Can't debug production issues | Phase 5 (Observability) |
| Afraid to deploy | Phase 6 (Deployment Safety) |
| Single instance limits reached | Phase 7 (Scalability) |
| Weird intermittent failures | Phase 8 (Unknown-Unknowns) |
| Security audit prep | Phase 1 (Foundation) + Phase 2.5 (Rate Limiting) |
| Cost growing with traffic | Phase 3 (Caching) + Phase 5.5 (Log Volume) + Phase 8.4 (Serialization) |

---

## HOW TO USE THIS DOCUMENT IN LLM CHATS

**For new projects:** Paste Phase 1 in full as context. Reference later phases as you build.

**For existing projects with issues:** Use the Quick Reference table to find the right phase. Paste that phase and say: "Audit my codebase against these patterns and list what's missing."

**For specific implementation:** Paste the individual pattern block and say: "Implement this pattern in my [stack]. Here's my current code: [paste relevant file]."

**For architecture review:** Paste Phases 1-4 and say: "Review this architecture against these patterns. List gaps and prioritize fixes."
