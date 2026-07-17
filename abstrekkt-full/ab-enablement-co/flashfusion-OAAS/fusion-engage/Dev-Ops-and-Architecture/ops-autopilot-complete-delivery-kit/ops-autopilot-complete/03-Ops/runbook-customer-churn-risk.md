# Runbook: Customer Churn Risk

> **Severity:** MEDIUM | **Owner:** Customer Success + Sales

## Detection Signals

| Signal | Threshold | Urgency |
|--------|-----------|---------|
| Workflow runs drop >50% week-over-week | <10 runs/week | Week 1: outreach |
| No runs for 7 consecutive days | 0 runs in 7d | Week 1: urgent outreach |
| Support tickets increasing | >3 tickets/week | Investigate immediately |
| Approval response time increasing | Avg >4 hours | Process issue |
| Feature adoption flat | Same 1-2 workflows for 30+ days | Expansion opportunity missed |
| NPS score <30 | Survey response | Executive escalation |

## Intervention Playbook

**Week 1 (Low engagement detected):**
- Success manager sends personalized email: "We noticed [workflow] usage dropped — anything we can help with?"
- Offer 30-min check-in call
- Review their dashboard: are they hitting errors?

**Week 2 (No response or continued decline):**
- Product lead offers free onboarding session for additional workflows
- Share relevant case study from similar company
- Check: is their n8n instance healthy?

**Week 3 (Still declining):**
- Offer 30% discount on next renewal
- VP-level outreach: personal call/email
- Exit interview: understand why they're disengaging

**Week 4 (Formal churn risk):**
- CEO review of account
- Last-resort offer: free month + dedicated support
- If churning: conduct exit interview, document learnings
- Update churn analysis dashboard

## Churn Prevention Metrics
- Target: <5% monthly churn during beta, <3% at GA
- Track: saves (interventions that retained customer) vs losses
- Monthly churn analysis: reasons, patterns, product gaps
