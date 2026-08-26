---
name: handling-refunds
description: >-
  Processes refund requests through approval workflows, financial
  reconciliation, and customer communication. Activates when processing
  refund requests, calculating partial refunds, managing credit memos,
  handling service credits, or reconciling refund transactions. Also
  triggers on: refund, credit memo, money back, reimbursement, service
  credit, billing adjustment, reversal, chargeback prevention, or
  customer wants money back. Even if someone says 'they want a refund'
  or 'issue a credit' — use this skill.
version: "1.0.0"
---

# Handling Refunds

Manages refund and credit workflows at Intinc with proper approval chains, financial controls, and audit trails. Balances customer satisfaction with financial discipline — ensuring legitimate refunds are processed quickly while preventing revenue leakage.

## Quick-Start Decision Tree

```
Request arrives
  ├─ Full refund? ────────── Full Refund Approval workflow
  ├─ Partial refund? ─────── Partial Calculation + Approval
  ├─ Service credit? ─────── Credit Memo workflow
  ├─ Chargeback response? ── Chargeback Defense
  └─ Refund reporting? ──── Refund Analytics
```

## Usage Examples

**Example 1 — Client wants a full refund for last month — our SLA was breached 3 times**
→ Pull SLA breach records → verify against monitoring data → calculate service credit per contract terms (typically 5-10% per breach, capped) → if breaches warrant full refund per contract, escalate to VP approval → process refund to original payment method → document root cause.

**Example 2 — Issue a $2,500 credit memo for the onboarding delay**
→ Verify delay is documented in project logs → confirm credit amount against contract terms → generate credit memo with reference to original invoice → route for manager approval (< $5K threshold) → apply credit to next invoice or process as refund → notify client.

**Example 3 — We're getting a chargeback from Acme Corp — they say they didn't authorize the charge**
→ Pull transaction record → gather authorization evidence (signed contract, service agreement, delivery confirmation) → compile communication history → submit chargeback response within 7 days → flag account for review.

## Golden Path Workflow

1. Receive refund request with reason and documentation
2. Validate against contract terms and refund policy
3. Calculate refund amount (full, partial, or credit)
4. Route for approval based on dollar threshold
5. Process refund via original payment method
6. Generate credit memo and update AR records
7. Notify client with refund confirmation and timeline
8. Reconcile refund against original transaction
9. Log in refund report for trend analysis

## Edge Cases & Anti-Patterns

- **Expired payment method** — Cannot refund to expired card. Collect updated payment info or issue check.
- **Refund exceeds original payment** — Never process. Cap at original transaction amount.
- **Recurring service mid-cycle cancellation** — Prorate based on days used, not calendar months.
- **Refund after revenue recognition** — Coordinate with finance for proper reversal entry.

## Cross-Skill References

Works with: `processing-payments`, `managing-invoices`, `managing-subscriptions`, `tracking-compliance`

## Compliance & Security

SOC2 (approval workflow audit trail), PCI-DSS (refund to original payment method), ASC 606 (revenue reversal).

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
- This skill covers the complete handling refunds workflow at Intinc
- Compliance requirements are mapped to relevant frameworks
- Edge cases reflect real operational scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific regulations may add requirements not covered here

**CONTRADICTIONS:**
- Speed of execution sometimes conflicts with thoroughness of compliance checks — prioritize based on risk level