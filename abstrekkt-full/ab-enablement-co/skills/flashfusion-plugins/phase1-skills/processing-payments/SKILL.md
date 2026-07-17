---
name: processing-payments
description: >-
  Manages payment processing workflows including gateway configuration,
  transaction monitoring, reconciliation, and PCI compliance. Activates
  when processing client payments, configuring payment gateways,
  reconciling transactions, handling failed payments, managing auto-pay
  enrollment, or ensuring PCI-DSS compliance. Also triggers on: payment,
  credit card, ACH, wire transfer, payment gateway, Stripe, transaction,
  payment failed, auto-pay, PCI compliance, or charge client. Even if
  someone says 'run their card' or 'payment didn't go through' — use
  this skill.
version: "1.0.0"
---

# Processing Payments

Orchestrates all payment collection at Intinc — from gateway setup through transaction reconciliation. Enforces PCI-DSS compliance at every step, ensures failed payments are retried appropriately, and maintains clean transaction records for audit.

## Quick-Start Decision Tree

```
Request arrives
  ├─ Process a payment? ──────── Transaction Processing
  ├─ Payment failed? ──────────── Retry & Recovery workflow
  ├─ Gateway configuration? ───── Gateway Setup
  ├─ Reconciliation? ──────────── Transaction Reconciliation
  └─ PCI compliance? ──────────── Compliance Audit
```

## Usage Examples

**Example 1 — Set up auto-pay for a new enterprise client**
→ Verify PCI-compliant tokenization is active → collect payment method via hosted form (never raw card data) → create customer profile in gateway → configure recurring schedule matching billing cycle → send confirmation → test with $0.01 auth/void.

**Example 2 — Three clients' payments failed overnight**
→ Pull failed transaction log → categorize failure codes (insufficient funds, expired card, gateway timeout) → for soft declines: schedule intelligent retry (24h, 48h, 72h) → for hard declines: notify client with payment update link → escalate if 3rd retry fails.

**Example 3 — Are we PCI compliant for our new payment flow?**
→ Run PCI-DSS SAQ checklist against current implementation → verify no raw card data touches our servers → confirm tokenization active → check TLS 1.2+ on all payment endpoints → verify encryption at rest for stored tokens → document scope and sign off.

## Golden Path Workflow

1. Receive payment trigger (invoice due, auto-pay schedule, manual request)
2. Validate payment method is current and authorized
3. Submit transaction to gateway with idempotency key
4. Handle gateway response (approved, declined, error)
5. For approved: record transaction, issue receipt, update AR
6. For declined: classify error, schedule retry or notify client
7. Reconcile transactions against bank settlements daily
8. Generate payment report for accounting team
9. Archive transaction records per retention policy

## Edge Cases & Anti-Patterns

- **Duplicate charges** — Always use idempotency keys. If duplicate detected, void immediately and notify client.
- **Partial payments** — Supported only with explicit client agreement. Record as partial, update remaining balance.
- **Chargebacks** — Escalate immediately to finance. Compile evidence (signed contract, delivery proof, communication log).
- **International payments** — Verify currency, check for additional fees, ensure OFAC/sanctions screening.

## Cross-Skill References

Works with: `managing-invoices`, `handling-refunds`, `managing-subscriptions`, `tracking-compliance`

## Compliance & Security

PCI-DSS Level 4 SAQ-A (card-not-present, hosted payment page), SOC2 Type II (transaction logging), NACHA rules (ACH processing).

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
- This skill covers the complete processing payments workflow at Intinc
- Compliance requirements are mapped to relevant frameworks
- Edge cases reflect real operational scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific regulations may add requirements not covered here

**CONTRADICTIONS:**
- Speed of execution sometimes conflicts with thoroughness of compliance checks — prioritize based on risk level