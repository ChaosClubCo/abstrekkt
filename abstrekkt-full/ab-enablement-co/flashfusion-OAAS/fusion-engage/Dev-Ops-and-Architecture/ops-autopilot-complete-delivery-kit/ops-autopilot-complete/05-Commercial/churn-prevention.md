# Churn Prevention Strategy

> **Audience:** SALES | **Phase:** Beta

---

## Disengagement Signals

| Signal | Threshold | Urgency | Detection |
|--------|-----------|---------|-----------|
| Run volume drop | >50% week-over-week | High | Automated (PostHog) |
| Zero runs for 7 days | 0 in 7d | Critical | Automated |
| Support tickets increasing | >3/week | Medium | Support queue |
| Approval timeout rate increasing | >20% of approvals | Medium | Dashboard |
| Only using 1 workflow | Single workflow for 30+ days | Low | Usage analytics |
| NPS <30 | Survey response | High | NPS tool |
| Payment failure | Stripe declined | Critical | Stripe webhook |

## Intervention Ladder

**Week 1 — Soft Touch:**
- Success manager email: "Noticed [X], anything we can help with?"
- Offer 30-min check-in call
- Share relevant tips/best practices

**Week 2 — Active Engagement:**
- Product lead offers free onboarding for additional workflows
- Share case study from similar company
- Diagnose: technical issue or lack of value?

**Week 3 — Escalation:**
- 30% discount on next 3 months
- VP-level personal outreach
- Exit interview if declining

**Week 4 — Save or Learn:**
- CEO review
- Last-resort: free month + dedicated support engineer
- If churning: exit interview (mandatory), document learnings

## Retention Targets

| Phase | Monthly Churn Target | Annual Retention |
|-------|---------------------|------------------|
| Beta | <5% | — |
| GA (Year 1) | <3% | >65% |
| Mature (Year 2+) | <2% | >78% |
