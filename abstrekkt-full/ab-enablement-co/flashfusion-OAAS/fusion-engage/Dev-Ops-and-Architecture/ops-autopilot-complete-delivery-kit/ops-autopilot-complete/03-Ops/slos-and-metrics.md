# SLOs and Metrics — Ops Autopilot

> **Audience:** ENG, LEAD | **Phase:** MVP (Week 1)

---

## Service Level Objectives

### Availability

| Tier | Target | Measurement | Alert Threshold |
|------|--------|-------------|----------------|
| Starter | 99.0% | Control plane API uptime (5min intervals) | <99.0% over 24h rolling |
| Growth | 99.5% | Control plane + customer n8n combined | <99.5% over 24h rolling |
| Enterprise | 99.9% | End-to-end (trigger → completion) | <99.9% over 24h rolling |

**Exclusions:** Scheduled maintenance (announced 48h in advance), customer n8n instance failures (customer responsibility), third-party connector outages (Azure AD, Okta, Jira).

### Latency

| Metric | Starter | Growth | Enterprise |
|--------|---------|--------|------------|
| Trigger → first step start (P95) | <10s | <5s | <2s |
| Step execution median | <30s | <20s | <10s |
| Approval notification delivery | <30s | <15s | <5s |

### Throughput

| Metric | Starter | Growth | Enterprise |
|--------|---------|--------|------------|
| Concurrent workflows | 10 | 50 | 200 |
| Workflows per day | 100 | 1,000 | Unlimited |
| API calls per minute | 60 | 300 | 1,000 |

### Reliability

| Metric | Target | Measurement |
|--------|--------|-------------|
| Workflow success rate | >99% (GA) | Completed / (Completed + Failed) |
| Approval response time (median) | <30 min | requested_at → decision_at |
| Mean Time Between Failures (MTBF) | 7d (Starter) → 30d (Enterprise) | Time between SEV-1/2 incidents |
| Mean Time To Recovery (MTTR) | 4h (Starter) → 15min (Enterprise) | Incident start → resolution |

---

## Key Metrics (Prometheus)

### Workflow Metrics

```
ops_run_total{customer_id, workflow_id, status}
  Description: Total workflow runs
  Labels: customer_id, workflow_id, status (completed|failed|cancelled)
  Type: Counter

ops_run_duration_seconds{customer_id, workflow_id, quantile}
  Description: Workflow execution duration
  Type: Histogram
  Buckets: 1, 2, 5, 10, 20, 30, 60, 120, 300

ops_step_duration_seconds{customer_id, connector_type, connector_action, quantile}
  Description: Step execution duration
  Type: Histogram
  Buckets: 0.5, 1, 2, 5, 10, 20, 30

ops_step_error_total{customer_id, connector_type, error_code}
  Description: Step failures by error code
  Type: Counter

ops_active_runs{customer_id}
  Description: Currently executing workflows
  Type: Gauge
```

### Approval Metrics

```
ops_approval_total{customer_id, decision}
  Description: Approval decisions
  Labels: decision (approved|denied|expired|escalated)
  Type: Counter

ops_approval_response_seconds{customer_id, quantile}
  Description: Time from request to decision
  Type: Histogram
  Buckets: 60, 300, 600, 1800, 3600, 7200

ops_approval_pending{customer_id}
  Description: Currently pending approvals
  Type: Gauge
```

### Infrastructure Metrics

```
ops_queue_depth{customer_id, queue}
  Description: Bull queue depth
  Type: Gauge

ops_queue_dlq_total{customer_id}
  Description: Jobs moved to dead letter queue
  Type: Counter

ops_redis_memory_bytes{customer_id}
  Description: Redis memory usage
  Type: Gauge

ops_n8n_health{customer_id}
  Description: n8n health check status (1=up, 0=down)
  Type: Gauge

ops_connector_health{customer_id, connector_type}
  Description: Connector health (1=healthy, 0=degraded/down)
  Type: Gauge

ops_connector_latency_seconds{customer_id, connector_type}
  Description: Connector health check latency
  Type: Gauge
```

---

## Alert Rules

### Critical (PagerDuty — page immediately)

| Alert | Condition | For |
|-------|-----------|-----|
| ControlPlaneDown | `up{job="control-plane"} == 0` | 5min |
| HighErrorRate | `rate(ops_step_error_total[5m]) > 0.1` | 5min |
| AuditLogTamper | `ops_audit_chain_valid == 0` | 1min |
| KillSwitchActivated | `ops_kill_switch_active == 1` | 0min |
| SecretExposure | `ops_secret_exposure_detected == 1` | 0min |
| CrossTenantLeak | `ops_rls_bypass_detected == 1` | 0min |

### High (PagerDuty — 1 hour response)

| Alert | Condition | For |
|-------|-----------|-----|
| N8nInstanceDown | `ops_n8n_health == 0` | 10min |
| ConnectorDegraded | `ops_connector_health == 0` | 15min |
| HighLatency | `histogram_quantile(0.95, ops_run_duration_seconds) > 10` | 10min |
| QueueBacklog | `ops_queue_depth > 100` | 10min |
| ApprovalBacklog | `ops_approval_pending > 20` | 30min |
| RedisMemoryHigh | `ops_redis_memory_bytes / ops_redis_memory_max > 0.8` | 5min |

### Medium (Slack notification — 4 hour response)

| Alert | Condition | For |
|-------|-----------|-----|
| DLQGrowing | `ops_queue_dlq_total increase > 5 in 1h` | 30min |
| SecretRotationDue | `ops_secret_days_until_rotation < 7` | 1h |
| SlowConnector | `ops_connector_latency_seconds > 5` | 15min |
| LowSuccessRate | `ops_run_success_rate < 0.95 over 1h` | 1h |

---

## SLO Burn Rate Alerts

Using multi-window burn rate alerting for availability SLO:

```
Fast burn (2% budget consumed in 1 hour):
  Alert if: error_rate > 14.4 × (1 - SLO_target) over 1h AND over 5m
  Action: Page on-call immediately

Slow burn (5% budget consumed in 6 hours):
  Alert if: error_rate > 6 × (1 - SLO_target) over 6h AND over 30m
  Action: Slack notification, investigate within 4 hours

Budget exhaustion (>50% monthly budget consumed):
  Alert if: remaining_budget < 50% at current burn rate
  Action: Exec notification, freeze non-critical deployments
```

---

## Dashboards (Grafana)

### Dashboard 1: Real-Time Health
- Total runs (24h) — big number
- Success rate — gauge (green >99%, yellow >95%, red <95%)
- P95 latency — timeseries
- Active runs — gauge per customer
- Queue depth — bar chart
- Connector health — status grid

### Dashboard 2: Per-Customer Deep Dive
- Customer selector (dropdown)
- Runs by workflow (stacked bar)
- Step error breakdown (pie)
- Approval response time (histogram)
- Usage vs tier limits (progress bars)

### Dashboard 3: Business Metrics
- MRR by tier — stacked area
- Customer count — timeseries
- Churn rate — line
- NPS trend — line
- Feature adoption — heatmap
