# On-Call Rotation — Ops Autopilot

> **Audience:** ENG, LEAD | **Phase:** Beta (Week 5)

---

## Rotation Schedule

**Coverage:** Mon–Fri 9am–5pm EST (MVP/Beta). 24/7 at GA.
**Rotation:** Weekly, handoff Monday 9am EST.
**Tool:** PagerDuty (primary), Slack #on-call (secondary).

## Handoff Checklist (Monday 9am)

```
☐ Read incident log from previous week
☐ Check PagerDuty: any unresolved alerts?
☐ Skim Slack #ops-alerts: any patterns?
☐ Review stale approvals (pending >4 hours)
☐ Check queue depth per customer
☐ Verify dashboard panels are green
☐ Confirm: "I have the pager" in #on-call
```

## Triage Flowchart

```
Customer reports issue (or alert fires)
  │
  ▼
On-call reads (5 min SLA)
  │
  ▼
Can reproduce?
  ├── YES → Classify severity
  └── NO → Ask customer for logs/screenshots → retry
  
Classify severity:
  │
  ├── CRITICAL (data loss, product unusable, security)
  │   → Page escalation engineer NOW
  │   → Investigate <15 min
  │   → Hot-fix target: 30 min
  │
  ├── HIGH (feature broken, connector down)
  │   → Investigate yourself (1hr SLA)
  │   → Fix if <1hr, else escalate
  │
  ├── MEDIUM (slow, minor bug, degraded)
  │   → Document in issue tracker
  │   → Add to weekly triage
  │
  └── LOW (docs, feature request, cosmetic)
      → Route to support queue
      → Async response (24hr)
```

## Escalation Matrix

| Issue | Primary | Escalate If | Escalate To |
|-------|---------|-------------|-------------|
| Auth failure | Support Engineer | No resolution 30m | Product Lead |
| Approval stuck | Support Engineer | Policy issue | Product Lead |
| Connector timeout | Support Engineer | >5 occurrences/day | Platform Lead |
| n8n crash | On-Call | Unrecoverable | VP Engineering |
| Data loss | On-Call | Any risk | VP Eng + Legal |
| Security incident | On-Call | Immediately | CISO + CEO |

## PagerDuty Configuration

```
Escalation Policy:
  Level 1 (0 min):  On-call engineer
  Level 2 (15 min): Engineering lead
  Level 3 (30 min): VP Engineering
  Level 4 (60 min): CTO

Services:
  - ops-control-plane (Vercel health + API errors)
  - ops-approval-engine (TTL expiry + decision failures)
  - ops-n8n-health (per-customer instance checks)
  - ops-connectors (per-connector health)
  - ops-security (kill-switch, RLS, audit)
```
