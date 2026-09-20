# Incident Runbooks — FlashFusion (P0–P3)

Severity as fire alarms: **P0** building burning · **P1** room on fire · **P2**
smell smoke · **P3** lingering. Detection is Sentry/Prometheus-driven.

## P0 — API down (all requests 503)

- **Detection:** Sentry error rate >95% for 2+ min OR health check fails.
- **Investigate (0–5 min):** Is it API latency or RDS latency? Check RDS
  connection pool first (common cause: pool exhausted at the 503 limit).
- **Resolve:** if RDS pool exhausted → scale pool (e.g. 500 → 2000) or upgrade
  instance; if API-side → roll back last deploy (ArgoCD auto-syncs previous).
- **Validate:** error rate < 1%, p95 < 500ms restored.

## P1 — Degraded (e.g. high error rate on one component)

- **Detection:** Sentry: component error >10% for 5+ min.
- **Investigate:** filter Sentry by endpoint; find worst-performing routes;
  check recent deploys/feature flags.
- **Resolve:** disable the offending flag, roll back, or scale the component.

## P2 — Feature broken for a subset (no full outage)

- **Detection:** Sentry alert (e.g. `pod.order.stuck`) OR manual report.
- **Resolve:** isolate the failing path; apply fix or feature-flag it off;
  communicate to affected users.

## P3 — Cosmetic / no functional impact

- Triage into the normal backlog; no paging.

## Example postmortem (template)

```
## <Incident title> — <date>
### Timeline (UTC)
- HH:MM detection · HH:MM on-call engaged · HH:MM root cause · HH:MM resolved
### Root cause
<e.g. RDS connection pool exhausted (503 limit)>
### Contributing factors
<deploy, traffic spike, missing alert, etc.>
### Action items (owner, deadline)
- [ ] ...
### Lessons learned
<what we change so it can't recur>
```

## Alerting path

PrometheusAlert (k8s) → EventBridge → SNS (`flashfusion-alerts-prod`) → PagerDuty
service with an escalation policy. Every privileged remediation action is written
to the immutable audit trail.
