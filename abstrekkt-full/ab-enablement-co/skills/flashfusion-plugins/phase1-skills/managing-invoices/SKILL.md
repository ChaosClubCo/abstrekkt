---
name: managing-invoices
description: >-
  Manages end-to-end invoice workflows including creation, tracking,
  reconciliation, aging reports, and payment follow-up. Activates when
  creating invoices, tracking outstanding payments, generating aging
  reports, reconciling accounts receivable, managing billing disputes,
  or auditing invoice accuracy. Also triggers on: invoice, billing,
  accounts receivable, AR aging, payment tracking, overdue invoice, send
  invoice, invoice template, billing cycle, or net-30. Even if someone
  says 'where is that payment' or 'who owes us money' — use this skill.
version: "1.0.0"
---

# Managing Invoices

Handles the full invoice lifecycle at Intinc — from generation through collection. Ensures accurate billing, timely follow-up on outstanding payments, and clean reconciliation against the general ledger. Critical for maintaining healthy cash flow in a managed services business where recurring invoices are the revenue backbone.

## Quick-Start Decision Tree

```
Request arrives
  ├─ Create new invoice? ──────── Invoice Creation workflow
  ├─ Track outstanding? ────────── AR Aging & Follow-up
  ├─ Reconcile payments? ────────── Reconciliation workflow
  ├─ Dispute or correction? ────── Dispute Resolution
  └─ Reporting / analysis? ─────── Invoice Analytics
```

## Usage Examples

**Example 1 — Generate monthly invoices for all active MSP clients**
→ Pull active client list from CRM → match against service agreements → generate line items per SLA tier → apply volume discounts → produce PDF invoices → queue for approval → distribute via email/portal.

**Example 2 — We have $45K in overdue receivables — who owes what?**
→ Run AR aging report (Current / 30 / 60 / 90+ buckets) → sort by amount descending → flag accounts over 60 days → draft follow-up emails with payment links → escalate 90+ to account manager.

**Example 3 — Client disputes a line item on their invoice**
→ Pull invoice detail → cross-reference against service delivery logs and ticket history → identify whether charge is valid → if valid, prepare evidence package → if invalid, issue credit memo and corrected invoice.

## Golden Path Workflow

1. Identify invoice trigger (monthly cycle, project milestone, ad-hoc)
2. Pull service delivery data (tickets closed, hours logged, SLA metrics)
3. Match against pricing in the service agreement
4. Apply any credits, discounts, or adjustments
5. Generate invoice in standard INT template
6. Route for internal approval (manager sign-off for invoices > $10K)
7. Deliver to client via preferred channel (email, portal, mail)
8. Log in accounting system and set follow-up reminders
9. Monitor payment receipt and reconcile against bank deposits

## Edge Cases & Anti-Patterns

- **Partial payments** — Don't mark as paid; create a split record showing amount received and remaining balance.
- **Multi-currency clients** — Always invoice in the agreed contract currency; note exchange rate assumptions.
- **Disputed items** — Never delete a line item. Issue a credit memo and re-invoice. Maintain full audit trail.
- **Pre-paid retainers** — Draw down against retainer balance first; only invoice overages.

## Cross-Skill References

Works with: `tracking-expenses`, `reporting-financials`, `managing-subscriptions`, `administering-contracts`

## Compliance & Security

SOC2 (audit trail for all invoice modifications), PCI-DSS (if storing payment card data for auto-pay), revenue recognition (ASC 606 for multi-element arrangements).

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
- This skill covers the complete managing invoices workflow at Intinc
- Compliance requirements are mapped to relevant frameworks
- Edge cases reflect real operational scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific regulations may add requirements not covered here

**CONTRADICTIONS:**
- Speed of execution sometimes conflicts with thoroughness of compliance checks — prioritize based on risk level