---
name: administering-contracts
description: >-
  Manages contract lifecycle from creation through renewal or
  termination, including review, approval, and compliance tracking.
  Activates when creating contracts, reviewing terms, managing renewals,
  handling amendments, or tracking contract obligations. Also triggers
  on: contract, agreement, MSA, SOW, terms and conditions, contract
  renewal, amendment, NDA, SLA agreement, contract template, or legal
  review. Even if someone says 'draft a contract' or 'when does this
  agreement expire' — use this skill.
version: "1.0.0"
---

# Administering Contracts

Governs the full contract lifecycle at Intinc — from template selection through execution, compliance monitoring, and renewal. Ensures all agreements protect Intinc's interests, meet compliance requirements, and are tracked to prevent lapses.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New contract? ──────── Contract Creation workflow
  ├─ Review / redline? ──── Legal Review workflow
  ├─ Amendment needed? ──── Amendment workflow
  ├─ Renewal approaching? ── Renewal Management
  └─ Termination? ────────── Exit workflow
```

## Usage Examples

**Example 1 — Draft an MSA for a new enterprise client**
→ Select MSA template appropriate for service type → populate client details and service scope → set standard terms (payment net-30, 99.9% SLA, limitation of liability) → add data processing addendum if handling PII → route to legal for review → incorporate feedback → send to client for signature via DocuSign.

**Example 2 — Client wants to change the SLA from 99.9% to 99.99%**
→ Assess operational feasibility of 99.99% → calculate cost impact (additional redundancy, monitoring, staffing) → draft amendment with revised SLA terms and adjusted pricing → route for legal and operations approval → present to client with cost implications → execute amendment.

**Example 3 — We have 15 contracts renewing in Q2 — what's the plan?**
→ Pull all contracts with Q2 renewal dates → categorize by type and value → flag strategic accounts for early engagement (90 days out) → identify at-risk renewals (support tickets, NPS scores) → assign renewal owners → prepare pricing proposals with any adjustments → track progress weekly.

## Golden Path Workflow

1. Identify contract need and select appropriate template
2. Populate terms based on service scope and client requirements
3. Route for internal review (legal, finance, operations)
4. Negotiate with counterparty (redline cycle)
5. Obtain final approvals and execute
6. Log in contract management system with key dates
7. Set automated alerts for renewal, review, and expiration
8. Monitor compliance with contract obligations
9. Initiate renewal or termination process 90 days before expiry

## Edge Cases & Anti-Patterns

- **Unsigned contracts** — Never begin work without executed agreement. If urgency requires it, use signed LOI with key terms while MSA is finalized.
- **Auto-renewal clause** — Track opt-out windows carefully; missing a window locks in another term.
- **Assignment clause** — If Intinc or client is acquired, review assignment provisions before assuming contract transfers.
- **Force majeure** — Document any force majeure claims carefully; maintain evidence of impact and mitigation efforts.

## Cross-Skill References

Works with: `managing-vendors`, `negotiating-contracts`, `tracking-compliance`, `managing-subscriptions`

## Compliance & Security

SOC2 (contract controls), HIPAA (BAA execution), GDPR (DPA requirements), SOX (contract authorization).

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
- This skill covers the complete administering contracts workflow at Intinc
- Compliance requirements are mapped to relevant frameworks
- Edge cases reflect real operational scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific regulations may add requirements not covered here

**CONTRADICTIONS:**
- Speed of execution sometimes conflicts with thoroughness of compliance checks — prioritize based on risk level