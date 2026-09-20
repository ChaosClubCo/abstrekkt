# Audit Logging — Immutable Event Trail

> **Audience:** ENG, LEAD
> **Phase:** MVP (Week 2)
> **Last Updated:** 2025-02-13

---

## Design Principles

1. **Append-only.** No UPDATE or DELETE operations on the audit log. Ever.
2. **Signed.** Every entry includes an HMAC-SHA256 signature for tamper detection.
3. **Chained.** Each entry references the hash of the previous entry, creating a verifiable chain.
4. **Comprehensive.** Every system action generates an audit event — no gaps.

---

## Table Constraints

```sql
-- Create table
CREATE TABLE audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customer(id),
  timestamp timestamptz NOT NULL DEFAULT now(),
  event_type text NOT NULL,
  actor_id text NOT NULL,
  actor_type text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid NOT NULL,
  action text NOT NULL,
  change_delta jsonb,
  outcome text NOT NULL,
  reason text,
  ip_address text,
  user_agent text,
  hmac_signature text NOT NULL,
  chain_hash text
);

-- CRITICAL: Remove all mutation permissions
REVOKE UPDATE ON audit_log FROM PUBLIC;
REVOKE UPDATE ON audit_log FROM authenticated;
REVOKE UPDATE ON audit_log FROM service_role;
REVOKE DELETE ON audit_log FROM PUBLIC;
REVOKE DELETE ON audit_log FROM authenticated;
REVOKE DELETE ON audit_log FROM service_role;

-- Only INSERT and SELECT allowed
GRANT INSERT ON audit_log TO service_role;
GRANT SELECT ON audit_log TO authenticated;

-- RLS: customers can only see their own entries
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_select ON audit_log
  FOR SELECT USING (customer_id = auth.uid());

-- Index for common queries
CREATE INDEX idx_audit_customer_time ON audit_log (customer_id, timestamp DESC);
CREATE INDEX idx_audit_resource ON audit_log (resource_type, resource_id);
CREATE INDEX idx_audit_event_type ON audit_log (event_type, timestamp DESC);

-- Partition by month for performance at scale
-- (implement when audit_log exceeds 10M rows)
```

---

## HMAC Signing

Every audit log entry is signed to detect tampering:

```typescript
import { createHmac } from 'crypto';

function signAuditEntry(entry: AuditLogEntry, signingKey: string): string {
  const payload = [
    entry.id,
    entry.timestamp,
    entry.event_type,
    entry.actor_id,
    entry.resource_id,
    entry.action,
    entry.outcome
  ].join('|');
  
  return createHmac('sha256', signingKey)
    .update(payload)
    .digest('hex');
}

// Signing key stored in environment variable (rotated quarterly)
// Never stored in database or version control
```

**Verification:**
```typescript
function verifyAuditEntry(entry: AuditLogEntry, signingKey: string): boolean {
  const expectedSignature = signAuditEntry(entry, signingKey);
  return timingSafeEqual(entry.hmac_signature, expectedSignature);
}
```

---

## Chain Hashing

Each entry includes a hash linking it to the previous entry, creating a tamper-evident chain:

```typescript
function computeChainHash(entry: AuditLogEntry, previousChainHash: string | null): string {
  const payload = [
    previousChainHash || 'GENESIS',
    entry.id,
    entry.hmac_signature
  ].join('|');
  
  return createHash('sha256').update(payload).digest('hex');
}
```

**Chain verification (integrity check):**
```typescript
async function verifyAuditChain(customerId: string, from: Date, to: Date): Promise<{
  valid: boolean;
  entries_checked: number;
  first_invalid?: string;
}> {
  const entries = await getAuditEntries(customerId, from, to, { order: 'asc' });
  let previousHash: string | null = null;
  
  for (const entry of entries) {
    const expectedHash = computeChainHash(entry, previousHash);
    if (entry.chain_hash !== expectedHash) {
      return { valid: false, entries_checked: entries.indexOf(entry), first_invalid: entry.id };
    }
    previousHash = entry.chain_hash;
  }
  
  return { valid: true, entries_checked: entries.length };
}
```

---

## Cryptographic Anchoring

Every hour, the system creates an anchor record:

```typescript
// Runs every hour via cron
async function createAnchor() {
  const lastEntry = await getLastAuditEntry();
  const anchor = {
    timestamp: new Date().toISOString(),
    last_entry_id: lastEntry.id,
    last_chain_hash: lastEntry.chain_hash,
    entry_count_since_last_anchor: await getEntrySinceLastAnchor(),
  };
  
  // Store anchor in separate, independently-secured location
  await storeAnchor(anchor); // e.g., S3 with versioning, or external service
}
```

This means: even if someone gained SUPERUSER access to the database, the external anchor would detect any modifications.

---

## Event Types

| Event Type | Trigger | Key Fields |
|------------|---------|------------|
| `run.created` | New workflow run starts | workflow_id, trigger, initiator |
| `run.completed` | Run finishes successfully | duration_ms, steps_count |
| `run.failed` | Run finishes with error | error_code, error_message |
| `run.paused` | Kill-switch or manual pause | reason |
| `run.resumed` | Resume after pause | resumed_by |
| `step.started` | Step begins execution | connector_type, connector_action |
| `step.completed` | Step finishes successfully | execution_time_ms, output_hash |
| `step.failed` | Step fails | error, retry_count |
| `approval.requested` | Approval created | approver, ttl_seconds, context_snapshot |
| `approval.decided` | Human makes decision | decision, reason, response_time_ms |
| `approval.expired` | TTL exceeded | escalated_to (if applicable) |
| `approval.escalated` | Approval moves to next approver | from_approver, to_approver |
| `secret.registered` | New secret hash stored | secret_name, connector_type |
| `secret.rotated` | Secret hash updated | old_hash, new_hash |
| `secret.revoked` | Secret marked inactive | reason |
| `policy.created` | New approval policy | policy_name, rules_count |
| `policy.updated` | Policy modified | change_delta |
| `kill_switch.activated` | Emergency shutdown | reason, affected_runs |
| `kill_switch.deactivated` | System resumed | resumed_by |
| `user.login` | User authenticated | ip_address, user_agent |

---

## Retention Policies

| Tier | Retention | Storage Estimate (per customer/year) |
|------|-----------|--------------------------------------|
| Starter | 1 year (365 days) | ~50MB (100 runs/day × 5 events/run × 365) |
| Growth | 3 years (1095 days) | ~500MB (1000 runs/day × 5 events/run × 1095) |
| Enterprise | 7 years (2555 days) | ~5GB (unlimited runs × 5 events/run × 2555) |

**Cleanup:**
- Cron job runs nightly
- Checks `created_at + retention_days < now()` per customer tier
- Deletes expired entries (exception to append-only: retention-based cleanup only)
- Creates final anchor before deletion batch
- Logs deletion event in a separate retention_log table

---

## Compliance Report Generation

Automated monthly reports for customer compliance teams:

```
Report contents:
1. Total events in period
2. Events by type (bar chart data)
3. Approval summary: requested vs approved vs denied vs expired
4. Average approval response time
5. Failed steps with error breakdown
6. Secret rotation compliance (on-time vs overdue)
7. Chain integrity verification result
8. Anomaly flags (unusual activity patterns)

Format: JSON (machine-readable) + PDF (human-readable)
Delivery: Email to compliance_officer role + dashboard download
```

---

## Querying the Audit Log

**By run (see everything that happened in a workflow execution):**
```
GET /api/v1/audit?resource_type=run&resource_id={run_id}
```

**By time range (compliance review):**
```
GET /api/v1/audit?from=2025-01-01T00:00:00Z&to=2025-01-31T23:59:59Z&limit=100
```

**By event type (all approval decisions):**
```
GET /api/v1/audit?event_type=approval.decided&from=2025-02-01T00:00:00Z
```

**By actor (everything a specific user did):**
```
GET /api/v1/audit?actor_id=manager@acmecorp.com&limit=50
```

---

## Tamper Detection Tests

| Test | Method | Expected |
|------|--------|----------|
| Attempt UPDATE on audit_log | `UPDATE audit_log SET outcome = 'success'` | Permission denied |
| Attempt DELETE on audit_log | `DELETE FROM audit_log WHERE id = '...'` | Permission denied |
| Modify entry, re-verify HMAC | Change `outcome` field, run verification | Signature mismatch detected |
| Break chain, re-verify | Delete middle entry, verify chain | Chain break detected at missing entry |
| Clock manipulation | Set server clock back 1 hour, insert entry | Timestamp ordering anomaly flagged |
