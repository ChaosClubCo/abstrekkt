---
name: managing-subscriptions
description: >-
  Manages subscription lifecycle including creation, renewals, upgrades,
  downgrades, cancellations, and usage tracking. Activates when managing
  client subscriptions, processing upgrades or downgrades, handling
  renewal workflows, tracking subscription metrics (MRR, churn, LTV), or
  configuring subscription billing. Also triggers on: subscription, MRR,
  recurring billing, upgrade, downgrade, cancel subscription, renewal,
  plan change, subscription tier, or recurring revenue. Even if someone
  says 'move them to the pro plan' or 'they want to cancel' — use this
  skill.
version: "1.0.0"
---

# Managing Subscriptions

Orchestrates the full subscription lifecycle at Intinc — from initial enrollment through renewal or cancellation. Tracks MRR impact of every change, enforces contract terms, and provides the subscription metrics that drive revenue forecasting.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New subscription? ────── Enrollment workflow
  ├─ Upgrade / downgrade? ─── Plan Change workflow
  ├─ Renewal approaching? ─── Renewal Management
  ├─ Cancellation request? ── Retention → Cancel workflow
  └─ Metrics / reporting? ─── Subscription Analytics
```

## Usage Examples

**Example 1 — Upgrade Acme Corp from Standard to Enterprise tier**
→ Pull current subscription details → calculate prorated cost for remainder of billing period → generate change order with new pricing → route for client approval → update billing system → provision additional features/capacity → confirm upgrade in client portal.

**Example 2 — What's our MRR breakdown by tier?**
→ Query subscription database → group by tier (Starter, Standard, Enterprise) → calculate MRR per tier → show growth/contraction vs prior month → flag accounts with upcoming renewals or cancellation risk → export to dashboard.

**Example 3 — Client wants to cancel — they say our competitor is cheaper**
→ Trigger retention workflow → pull usage data to quantify value delivered → prepare TCO comparison showing total cost (not just license) → offer retention incentives within approval matrix (discount, extended trial, feature unlock) → if save fails, process cancellation with exit survey.

## Golden Path Workflow

1. Identify subscription event (new, change, renew, cancel)
2. Pull current subscription state and contract terms
3. Calculate financial impact (MRR change, proration)
4. Route for appropriate approval based on impact
5. Execute change in billing and provisioning systems
6. Update CRM with new subscription state
7. Notify relevant teams (CS, Finance, Support)
8. Log MRR impact for reporting
9. Schedule next lifecycle event (renewal date, review date)

## Edge Cases & Anti-Patterns

- **Mid-cycle downgrade** — Prorate credit for unused premium capacity; apply to next billing cycle.
- **Annual-to-monthly switch** — Recalculate at monthly rate (typically higher); warn about price increase.
- **Reactivation after cancellation** — Check if within grace period; may need new contract vs. reinstatement.
- **Multi-year contract upgrade** — Maintain original term commitment; adjust pricing from change date forward.

## Cross-Skill References

Works with: `managing-invoices`, `processing-payments`, `forecasting-revenue`, `preventing-churn`

## Compliance & Security

ASC 606 (subscription revenue recognition), SOC2 (change audit trail), contract law (term enforcement).

## Self-Verification Checklist

- [ ] Correct workflow selected for request type
- [ ] All financial calculations verified
- [ ] Approval thresholds respected
- [ ] Audit trail maintained for all changes
- [ ] Compliance requirements addressed
- [ ] Cross-skill handoffs identified
- [ ] Output format matches audience expectations

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- This skill covers the complete managing subscriptions workflow at Intinc
- Compliance requirements are mapped to relevant frameworks
- Edge cases reflect real operational scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific regulations may add requirements not covered here

**CONTRADICTIONS:**
- Speed of execution sometimes conflicts with thoroughness of compliance checks — prioritize based on risk level