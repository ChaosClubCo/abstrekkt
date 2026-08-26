# Runbook: Queue Overflow / DLQ Backlog

> **Severity:** HIGH | **Detection:** `ops_queue_depth > 100` or `ops_queue_dlq_total` increasing

## Symptoms
- Workflows queued but not executing
- Increasing latency (trigger → first step)
- Redis memory climbing toward limit
- DLQ accumulating failed jobs

## Diagnosis
1. Check queue depth: `ops_queue_depth{customer_id="X"}` — which customer?
2. Check DLQ: how many jobs, what error codes?
3. Check Redis: `ops_redis_memory_bytes` — approaching OOM?
4. Check n8n: is the worker processing? `ops_n8n_health`

## Recovery
**If n8n healthy but slow:**
- Check connector rate limits (429s causing retry storms)
- Increase Bull concurrency temporarily: `queue.concurrency = 10`
- Stagger retry delays to reduce burst

**If Redis OOM:**
- Evict expired jobs: `redis-cli FLUSHDB` (only Bull queue DB)
- Scale Redis memory allocation
- Check for memory leak in job data (large payloads)

**If DLQ backlog:**
- Inspect top 10 DLQ jobs: what error? which connector?
- Fix root cause (connector down, auth expired, etc.)
- Replay DLQ jobs: `queue.process('dlq', handler)`
- Monitor for re-failures

## Prevention
- Per-customer queue limits: Starter 100, Growth 500, Enterprise 2000
- Redis memory alert at 80% threshold
- DLQ alert when >5 new jobs per hour
- Connector rate limiting to prevent retry storms
