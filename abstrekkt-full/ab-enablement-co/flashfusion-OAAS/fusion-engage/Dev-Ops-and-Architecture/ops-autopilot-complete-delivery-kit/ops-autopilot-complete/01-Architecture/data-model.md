# Data Model — Ops Autopilot

> **Audience:** ENG | **Phase:** MVP (Week 1)

---

## Entity Relationships

```
Customer (1) ──▶ (N) Run ──▶ (N) Step
                   │              └──▶ (0..1) Approval
                   └──▶ (N) Approval
                   └──▶ (N) Evidence
Customer (1) ──▶ (N) Policy (via workflow_ids[])
All entities ──▶ AuditLog (append-only)
```

---

## Core Tables

### `run`
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | uuid | NO | PK, `gen_random_uuid()` |
| `customer_id` | uuid | NO | RLS partition key |
| `workflow_id` | text | NO | e.g., `ticket_routing_v1` |
| `status` | enum | NO | PENDING, RUNNING, WAITING_FOR_APPROVAL, COMPLETED, FAILED, PAUSED, CANCELLED |
| `trigger` | jsonb | NO | `{ type: "teams_bot"|"slack"|"api"|"schedule", source_id }` |
| `initiator_user_id` | text | YES | Who triggered |
| `idempotency_key` | text | NO | `hash(workflow_id + source_id + timestamp_bucket)` UNIQUE |
| `context` | jsonb | YES | Workflow input (sanitized, no secrets) |
| `metadata` | jsonb | YES | Tags, labels, priority |
| `started_at` | timestamptz | NO | `now()` |
| `completed_at` | timestamptz | YES | Null if running |
| `error_summary` | text | YES | Human-readable error |

**Indexes:** `(customer_id, status)`, `(idempotency_key)` UNIQUE, `(workflow_id, created_at DESC)`, `(customer_id, created_at DESC)`

### `step`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `run_id` | uuid | FK to run |
| `step_index` | int | Execution order (0-based) |
| `step_name` | text | e.g., `create_azure_ad_user` |
| `connector_type` | text | `azure_ad`, `okta`, `jira`, `slack`, `email`, `custom` |
| `connector_action` | text | `create_user`, `assign_group`, etc. |
| `status` | enum | PENDING, RUNNING, WAITING_FOR_APPROVAL, COMPLETED, FAILED, SKIPPED |
| `input_params_hash` | text | SHA-256 of input (idempotency) |
| `output` | jsonb | Step result (sanitized) |
| `error` | jsonb | `{ code, message, retry_count, last_retry_at }` |
| `execution_time_ms` | int | Duration |
| `timeout_ms` | int | Default 30000 |

### `approval`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `run_id` / `step_id` | uuid | FK references |
| `approval_policy_id` | uuid | Which policy triggered this |
| `requester_id` / `approver_id` | text | Initiator / decision-maker |
| `decision` | enum | APPROVED, DENIED, EXPIRED, ESCALATED (null until decided) |
| `decision_reason` | text | Free-text from approver |
| `context_snapshot` | jsonb | Immutable snapshot of what approver saw |
| `ttl_seconds` | int | Default 3600, min 60, max 604800 |
| `notification_channel` | text | `slack`, `teams`, `email` |
| `requested_at` / `reminded_at` / `escalated_at` / `decision_at` | timestamptz | Lifecycle timestamps |

### `audit_log`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `customer_id` | uuid | RLS partition key |
| `timestamp` | timestamptz | When event occurred |
| `event_type` | text | `run.created`, `approval.decided`, `secret.rotated`, etc. |
| `actor_id` / `actor_type` | text | Who + role (user/system/service_account/int_support) |
| `resource_type` / `resource_id` | text/uuid | What was affected |
| `action` | text | create, update, approve, deny, rotate, pause, etc. |
| `change_delta` | jsonb | `{ before: {}, after: {} }` |
| `outcome` | text | success, failure, denied, timeout |
| `hmac_signature` | text | HMAC-SHA256 of entry |
| `chain_hash` | text | Links to previous entry |

**Constraints:** `REVOKE UPDATE, DELETE FROM audit_log` — append-only

### `policy`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `customer_id` | uuid | RLS key |
| `policy_name` | text | e.g., `user_creation_requires_manager` |
| `workflow_ids` | text[] | Which workflows |
| `rules` | jsonb | Array of `{ condition, action, approval_chain, ttl_seconds, rate_limit, fallback }` |
| `version` | int | Schema version |
| `is_active` | boolean | Currently enforced |

### `secret_registry`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `customer_id` | uuid | RLS key |
| `secret_name` | text | e.g., `azure_ad_client_secret` |
| `secret_hash` | text | SHA-256 (never plaintext) |
| `connector_type` | text | Which connector |
| `last_rotated_at` / `next_rotation_due` | timestamptz | Rotation tracking |
| `status` | enum | ACTIVE, ROTATING, EXPIRED, REVOKED |

### `customer`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK (matches auth.uid()) |
| `name` | text | Company name |
| `tier` | enum | STARTER, GROWTH, ENTERPRISE |
| `n8n_instance_url` | text | Customer's n8n URL |
| `max_concurrent_workflows` / `max_workflows_per_day` | int | Tier limits |
| `status` | enum | ONBOARDING, ACTIVE, SUSPENDED, CHURNED |

---

## RLS Pattern (Applied to All Customer Tables)

```sql
CREATE POLICY customer_isolation ON [table]
  FOR ALL
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());
```

## Migration Strategy

Sequential naming: `001_initial_schema.sql`, `002_seed_default_policies.sql`, etc. Each has corresponding down file. Tested in staging before production.
