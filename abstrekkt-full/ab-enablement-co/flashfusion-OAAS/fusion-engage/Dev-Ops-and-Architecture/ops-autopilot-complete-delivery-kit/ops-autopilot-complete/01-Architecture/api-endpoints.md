# API Endpoints Reference — Ops Autopilot

> **Audience:** ENG, LEAD | **Phase:** MVP (Week 1)
> **Machine-Readable:** [api-specification.yaml](./api-specification.yaml)

---

## Authentication

All requests: `Authorization: Bearer <JWT>` — JWT from Supabase Auth with `sub`, `customer_id`, `role` claims.

## Endpoints

### 1. POST /runs — Create Workflow Run
```json
// Request
{ "workflow_id": "ticket_routing_v1", "trigger": { "type": "teams_bot", "source_id": "msg_abc" }, "initiator_user_id": "jane@acme.com", "context": { "ticket_id": "TICK-1234", "priority": "high" } }
// 201: { "run_id": "uuid", "status": "RUNNING", "idempotency_key": "hash..." }
// 200: Duplicate detected, existing run returned
// 429: Rate limit exceeded, retry_after header
```

### 2. GET /runs/{run_id} — Run Status with Steps & Approvals
Returns full run object including `steps[]` (name, status, timing) and `approvals[]` (decision, approver).

### 3. POST /approvals/{approval_id}/decision — Approve/Reject
```json
// Request
{ "decision": "APPROVED", "reason": "Verified by HR" }
// 200: { "approval_id": "uuid", "decision": "APPROVED", "run_status": "RUNNING" }
// 404: Expired (TTL exceeded)
// 409: Already decided
```

### 4. POST /n8n/{instance_id}/trigger — Queue Workflow
Async. Returns 202 with `job_id` and `estimated_start`.

### 5. POST /runs/{run_id}/steps/{step_id}/complete — Report Step
```json
// Success: { "status": "COMPLETED", "output_hash": "sha256:...", "execution_time_ms": 1200 }
// Failure: { "status": "FAILED", "error": { "code": "AZURE_AD_429", "message": "Rate limited", "retry_count": 3 } }
// 409: Already completed (idempotent)
```

### 6. GET /audit — Query Audit Log
Params: `run_id`, `event_type`, `from`, `to`, `limit`, `cursor`. Returns paginated entries + `next_cursor`.

### 7. POST /secrets/{secret_id}/rotate — Record Rotation
```json
// Request: { "new_hash": "sha256:64chars..." }
// 200: { "secret_id": "uuid", "status": "ACTIVE", "next_rotation_due": "2025-05-14T10:00:00Z" }
```

### 8. GET /customers/{customer_id}/dashboard — Metrics
Params: `period` (24h/7d/30d). Returns: total/completed/failed runs, success_rate, latency, pending approvals, top errors, usage vs limits.

## Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| RATE_LIMIT | 429 | Tier limit exceeded |
| IDEMPOTENT | 409 | Resource exists |
| APPROVAL_EXPIRED | 404 | TTL exceeded |
| UNAUTHORIZED | 401 | Invalid JWT |
| FORBIDDEN | 403 | Wrong role |
| VALIDATION | 422 | Schema failed |

## Rate Limits

| Tier | Runs/Day | Concurrent | API Calls/Min |
|------|---------|-----------|---------------|
| Starter | 100 | 10 | 60 |
| Growth | 1,000 | 50 | 300 |
| Enterprise | Unlimited | 200 | 1,000 |
