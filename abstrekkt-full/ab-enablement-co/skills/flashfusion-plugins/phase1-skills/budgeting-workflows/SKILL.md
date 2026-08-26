---
name: budgeting-workflows
description: >-
  Manages budget creation, forecasting, variance analysis, and
  reallocation workflows. Activates when creating annual or quarterly
  budgets, analyzing budget variances, forecasting spend, requesting
  budget reallocations, or tracking budget utilization. Also triggers
  on: budget, forecast, variance analysis, budget request, cost center,
  capex, opex, budget allocation, spending plan, or financial planning.
  Even if someone says 'are we on budget' or 'I need more budget for Q2'
  — use this skill.
version: "1.0.0"
---

# Budgeting Workflows

Drives financial planning discipline at Intinc — from annual budget creation through monthly variance tracking. Ensures departments have clear spending guardrails while maintaining flexibility to reallocate as business needs shift.

## Quick-Start Decision Tree

```
Request arrives
  ├─ Create budget? ──────── Budget Building workflow
  ├─ Check utilization? ──── Budget vs Actual report
  ├─ Variance analysis? ──── Variance Investigation
  ├─ Reallocation? ─────── Transfer Request workflow
  └─ Forecasting? ────────── Projection Model
```

## Usage Examples

**Example 1 — Build the FY2027 engineering department budget**
→ Pull FY2026 actuals as baseline → adjust for known changes (headcount plan, tool renewals, infrastructure growth) → add new initiatives from roadmap → apply inflation factor (3-5%) to recurring costs → model 3 scenarios (conservative, baseline, aggressive) → present to VP Engineering for review → iterate → lock and submit to finance.

**Example 2 — We're 15% over budget on cloud costs — what happened?**
→ Pull cloud spend actuals vs budget by service → identify top 3 variance drivers → root cause each (usage spike, new service, pricing change, miscategorized) → quantify impact → recommend corrective actions (reserved instances, rightsizing, cleanup unused resources) → project year-end impact if uncorrected.

**Example 3 — Move $20K from the conference budget to the AI tools budget**
→ Verify source budget has sufficient remaining funds → confirm receiving budget classification (CapEx vs OpEx) → generate transfer request with business justification → route to cost center owners for dual approval → update budget system → notify finance.

## Golden Path Workflow

1. Define budget period and cost center scope
2. Gather historical actuals and known commitments
3. Build bottoms-up estimate with department input
4. Model scenarios (conservative, baseline, stretch)
5. Review and iterate with stakeholders
6. Lock budget and publish to finance system
7. Monitor actuals vs budget monthly
8. Investigate variances exceeding 10% threshold
9. Prepare quarterly reforecast with updated assumptions

## Edge Cases & Anti-Patterns

- **Mid-year reorg** — Reassign budgets to new cost centers; maintain audit trail of original allocations.
- **Emergency spending** — Allow up to 5% budget override with VP + Finance approval; formalize in next reforecast.
- **Capital vs operating** — Enforce CapEx/OpEx classification at creation; changing after approval requires CFO sign-off.
- **Multi-year commitments** — Spread across fiscal years; flag the out-year obligations as committed spend.

## Cross-Skill References

Works with: `tracking-expenses`, `reporting-financials`, `forecasting-revenue`, `managing-vendor-costs`

## Compliance & Security

SOX (budget controls), GAAP (CapEx/OpEx classification), SOC2 (change management for budget modifications).

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
- This skill covers the complete budgeting workflows workflow at Intinc
- Compliance requirements are mapped to relevant frameworks
- Edge cases reflect real operational scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific regulations may add requirements not covered here

**CONTRADICTIONS:**
- Speed of execution sometimes conflicts with thoroughness of compliance checks — prioritize based on risk level