# Monitoring Dashboards — Ops Autopilot

> **Audience:** ENG, LEAD | **Phase:** MVP (Week 4)

---

## Dashboard Architecture

```
Data Sources:
  Prometheus → Metrics (counters, gauges, histograms)
  Loki → Logs (structured JSON, tagged by customer/run/step)
  Jaeger → Traces (distributed, cross-component)
  PostHog → Product analytics (feature adoption, funnels)
  Supabase → Business data (customers, billing, audit)

Visualization: Grafana (self-hosted or Grafana Cloud)
Alerting: Grafana → PagerDuty (critical/high) + Slack (medium/low)
```

---

## Dashboard 1: System Health (Default View)

**Refresh:** 30 seconds | **Time range:** Last 6 hours

**Row 1 — Key Numbers (Stat panels)**
- Total Runs (24h): `sum(increase(ops_run_total[24h]))`
- Success Rate: `sum(ops_run_total{status="completed"}) / sum(ops_run_total) * 100`
- P95 Latency: `histogram_quantile(0.95, rate(ops_run_duration_seconds_bucket[5m]))`
- Pending Approvals: `sum(ops_approval_pending)`
- Queue Depth: `sum(ops_queue_depth)`

**Row 2 — Time Series**
- Runs per minute (stacked by status: completed, failed, cancelled)
- Step latency P50/P95/P99
- Error rate (per connector)

**Row 3 — Status Grid**
- n8n instance health (per customer): green/red
- Connector health: grid showing each connector × status
- Control plane components: API, DB, queue, audit

**Row 4 — Alerts**
- Active alerts table (severity, description, duration, owner)
- Recent incidents (last 7 days)

---

## Dashboard 2: Per-Customer Deep Dive

**Variables:** `$customer_id` (dropdown, populated from customer table)

**Row 1 — Customer Summary**
- Customer name, tier, onboarded date
- Workflows active count
- Usage: runs today vs limit (progress bar)
- Usage: concurrent vs limit (progress bar)

**Row 2 — Workflow Performance**
- Runs by workflow (stacked bar, last 7 days)
- Success rate per workflow (table)
- Average duration per workflow (bar chart)
- Error breakdown by workflow (pie chart)

**Row 3 — Approval Analytics**
- Approval response time histogram
- Approvals by decision (approved/denied/expired)
- Average response time by approver role
- Pending approvals (list with age)

**Row 4 — Connectors**
- Connector call volume (per type)
- Error rate per connector
- Latency per connector (P95)
- Last health check result

---

## Dashboard 3: Observability Deep Dive

**For:** On-call engineers during incidents

**Row 1 — Infrastructure**
- Vercel function invocations + errors
- Supabase connection pool usage
- Redis memory + eviction rate
- Bull queue: active, waiting, delayed, failed jobs

**Row 2 — Logs (Loki panels)**
- Error log stream (filtered by `log_level="error"`)
- Slow query log (queries >1s)
- Audit log events (last 100)

**Row 3 — Traces (Jaeger link)**
- Recent traces with errors (embedded Jaeger search)
- Trace duration distribution
- Service dependency map

---

## Dashboard 4: Business Metrics

**Refresh:** 1 hour | **Time range:** Last 30 days

- MRR by tier (stacked area: Starter, Growth, Enterprise)
- Customer count trend (line)
- New vs churned customers (bar)
- Revenue per customer (distribution)
- Feature adoption heatmap (workflows × customers)
- NPS trend (if survey data available)
- Support ticket volume (bar by severity)

---

## Log Structure (Loki)

All logs are JSON with these required fields:

```json
{
  "timestamp": "2025-02-13T10:00:00.000Z",
  "level": "info|warn|error|debug",
  "component": "api|approval|audit|connector|queue|n8n",
  "customer_id": "uuid",
  "run_id": "uuid",
  "step_id": "uuid",
  "message": "Human-readable description",
  "error_code": "AZURE_AD_429",
  "duration_ms": 1200,
  "metadata": {}
}
```

**Label extraction (Loki):** `level`, `component`, `customer_id`, `error_code`
**Parsed fields:** `run_id`, `step_id`, `duration_ms`
