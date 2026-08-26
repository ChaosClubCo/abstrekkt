# Observability Stack — Ops Autopilot

> **Audience:** ENG | **Phase:** MVP (Week 4)

---

## Stack Overview

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Prometheus   │  │ Loki        │  │ Jaeger      │
│ (metrics)    │  │ (logs)      │  │ (traces)    │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
                 ┌──────▼──────┐
                 │  Grafana     │  ← Dashboards, alerts
                 └──────┬──────┘
                        │
                 ┌──────▼──────┐
                 │  PagerDuty   │  ← Incident management
                 └─────────────┘
```

## Prometheus Configuration

**Scrape targets:**
- Control plane API: `/metrics` endpoint (Vercel function)
- Per-customer n8n: `/metrics` via Cloudflare Tunnel (proxied)
- Redis: Redis exporter sidecar
- Bull queue: Bull Board metrics endpoint

**Scrape interval:** 15 seconds (control plane), 30 seconds (n8n instances)

**Retention:** 30 days local, 1 year in Thanos/Grafana Cloud (if needed)

## Loki Configuration

**Log sources:**
- Control plane: Vercel function logs → Loki via log drain
- n8n: Docker container logs → Loki via Promtail sidecar
- Cloudflare: WAF/tunnel logs → Loki via webhook

**Labels:** `level`, `component`, `customer_id`, `error_code`
**Retention:** 30 days (queryable), 90 days (archived)

## Jaeger Configuration

**Trace collection:**
- Control plane: OpenTelemetry SDK → Jaeger collector (OTLP/HTTP)
- n8n: OpenTelemetry auto-instrumentation → same collector

**Sampling:** 100% for errors, 10% for successful requests (adjustable per customer)

**Trace structure:**
```
Trace: workflow_execution
  └─ Span: api_gateway (auth + routing)
     └─ Span: run_creation (idempotency check + DB insert)
        └─ Span: policy_evaluation (rule matching)
        └─ Span: approval_creation (if needed)
        └─ Span: step_execution (connector call)
           └─ Span: connector_azure_ad (external HTTP)
        └─ Span: audit_log_write (HMAC signing)
```

## PostHog Configuration

**Events tracked:**
- `run_created`, `run_completed`, `run_failed`
- `approval_requested`, `approval_decided`
- `dashboard_pageview`, `workflow_activated`
- `feature_flag_evaluated`

**Properties:** customer_id, tier, workflow_id, connector_type

**Dashboards:** Feature adoption funnels, cohort retention, workflow usage heatmap

## Deployment Options

| Option | Cost | Effort | Best For |
|--------|------|--------|----------|
| Self-hosted (Docker Compose) | $50/mo (VM) | High | MVP, cost-sensitive |
| Grafana Cloud (free tier) | $0–50/mo | Low | MVP, quick start |
| Grafana Cloud (Pro) | $200–500/mo | Low | Beta, scale |
| Datadog (alternative) | $500+/mo | Low | Enterprise, if budget allows |
