---
name: tracking-expenses
description: >-
  Manages expense report submission, approval workflows, policy
  enforcement, and reimbursement processing. Activates when submitting
  expense reports, reviewing expense claims, enforcing spending
  policies, tracking departmental budgets, or processing reimbursements.
  Also triggers on: expense report, reimbursement, receipt, spending
  policy, travel expenses, per diem, corporate card, expense approval,
  out-of-pocket, or mileage. Even if someone says 'I need to expense
  this' or 'approve my receipts' — use this skill.
version: "1.0.0"
---

# Tracking Expenses

Enforces expense management discipline at Intinc — from receipt capture through reimbursement. Ensures policy compliance, proper categorization for tax purposes, and timely processing while preventing fraud.

## Quick-Start Decision Tree

```
Request arrives
  ├─ Submit expense? ────────── Submission workflow
  ├─ Approve expenses? ─────── Approval workflow
  ├─ Policy question? ────────── Policy Lookup
  ├─ Reimbursement status? ──── Tracking
  └─ Expense reporting? ─────── Analytics & Budgets
```

## Usage Examples

**Example 1 — I need to submit expenses from the Chicago client visit**
→ Gather receipts (hotel, meals, transport, parking) → verify each against travel policy (per diem limits, approved vendors) → categorize by GL code → attach receipt images → add business justification per item → submit for manager approval → estimated reimbursement in next payroll cycle.

**Example 2 — Review and approve the engineering team's Q1 expenses**
→ Pull all pending approvals for engineering dept → sort by amount descending → flag any items over policy threshold → verify receipts are attached and legible → check for duplicate submissions → approve compliant items → return non-compliant with notes → generate summary for finance.

**Example 3 — Are we over budget on software subscriptions this quarter?**
→ Pull software/SaaS expense category by GL code → compare against quarterly budget allocation → identify top 10 subscriptions by cost → flag any new subscriptions added without procurement approval → calculate run-rate for year-end projection → recommend consolidation opportunities.

## Golden Path Workflow

1. Capture expense with receipt and business justification
2. Categorize by expense type and GL code
3. Validate against spending policy and budget
4. Route for approval (manager → finance if over threshold)
5. Process approved expenses for reimbursement
6. Post to accounting system
7. Generate departmental expense reports
8. Reconcile corporate card statements monthly
9. Archive receipts per retention policy

## Edge Cases & Anti-Patterns

- **Missing receipt** — Require signed affidavit for expenses over $25; auto-approve under $25 with description.
- **Foreign currency** — Convert at transaction-date rate; document exchange rate used.
- **Split expenses** — Allow splitting across projects/cost centers with percentage allocation.
- **Late submissions** — Accept up to 60 days; require VP approval after 60 days; reject after 90 days.

## Cross-Skill References

Works with: `budgeting-workflows`, `reporting-financials`, `tracking-compliance`, `managing-vendors`

## Compliance & Security

IRS (receipt retention, per diem rates), SOC2 (approval audit trail), SOX (expense control environment).

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
- This skill covers the complete tracking expenses workflow at Intinc
- Compliance requirements are mapped to relevant frameworks
- Edge cases reflect real operational scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific regulations may add requirements not covered here

**CONTRADICTIONS:**
- Speed of execution sometimes conflicts with thoroughness of compliance checks — prioritize based on risk level