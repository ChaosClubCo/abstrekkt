---
name: managing-vendors
description: >-
  Manages vendor relationships including onboarding, performance
  tracking, contract management, and risk assessment. Activates when
  onboarding new vendors, evaluating vendor performance, conducting
  vendor reviews, managing vendor contracts, or assessing vendor risk.
  Also triggers on: vendor, supplier, procurement, vendor onboarding,
  vendor review, RFP, vendor scorecard, third-party risk, vendor
  management, or buy vs build. Even if someone says 'find a vendor for
  this' or 'how is our vendor performing' — use this skill.
version: "1.0.0"
---

# Managing Vendors

Governs vendor relationships at Intinc — from initial selection through ongoing performance management. Ensures vendors meet security, compliance, and service delivery standards while optimizing total cost of ownership.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New vendor needed? ────── Vendor Selection (RFP/RFI)
  ├─ Onboard vendor? ─────── Onboarding workflow
  ├─ Performance review? ──── Vendor Scorecard
  ├─ Risk assessment? ─────── Third-Party Risk Assessment
  └─ Contract issue? ────────── Escalation & Remediation
```

## Usage Examples

**Example 1 — We need a new cloud monitoring vendor — help us evaluate options**
→ Define requirements (features, scale, budget, compliance needs) → issue RFI to 5-7 vendors → score responses against weighted criteria → shortlist to 3 → conduct demos/POCs → negotiate pricing → select with stakeholder consensus → document decision rationale.

**Example 2 — Run the quarterly vendor performance review for our top 10 vendors**
→ Pull SLA performance data per vendor → calculate scorecard metrics (uptime, response time, ticket resolution, NPS) → compare against contractual commitments → flag any vendors below threshold → prepare discussion points → schedule review meetings.

**Example 3 — Assess the security risk of onboarding this new AI vendor**
→ Request vendor security questionnaire (SIG Lite or custom) → review SOC2 report → check for data processing agreement → evaluate data residency and encryption → assess business continuity plan → score risk (Low/Medium/High/Critical) → document findings and conditions for approval.

## Golden Path Workflow

1. Identify vendor need and define requirements
2. Source candidates (RFP, referral, marketplace)
3. Evaluate against weighted criteria
4. Conduct security and compliance assessment
5. Negotiate terms and pricing
6. Execute contract with standard INT provisions
7. Complete onboarding (access, integration, contacts)
8. Monitor performance against SLA quarterly
9. Conduct annual renewal review with cost optimization

## Edge Cases & Anti-Patterns

- **Sole source vendor** — Document justification for no-bid; require VP approval; plan exit strategy.
- **Vendor acquisition/merger** — Trigger contract review; assess impact on service continuity and compliance.
- **Security incident at vendor** — Activate third-party incident response; assess data exposure; notify affected clients if needed.
- **Vendor going out of business** — Trigger business continuity plan; begin emergency replacement procurement.

## Cross-Skill References

Works with: `administering-contracts`, `tracking-compliance`, `managing-vendor-costs`, `tracking-expenses`

## Compliance & Security

SOC2 (third-party risk management), HIPAA (BAA requirements), GDPR (data processing agreements), ISO 27001 (supplier relationships).

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
- This skill covers the complete managing vendors workflow at Intinc
- Compliance requirements are mapped to relevant frameworks
- Edge cases reflect real operational scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific regulations may add requirements not covered here

**CONTRADICTIONS:**
- Speed of execution sometimes conflicts with thoroughness of compliance checks — prioritize based on risk level