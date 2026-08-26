---
name: tracking-compliance
description: >-
  Monitors compliance posture across frameworks, manages audit
  preparation, enforces policies, and tracks remediation of gaps.
  Activates when preparing for audits, tracking compliance requirements,
  managing policy enforcement, conducting gap analysis, or monitoring
  regulatory changes. Also triggers on: compliance, audit, SOC2, HIPAA,
  PCI-DSS, GDPR, regulatory, policy enforcement, compliance gap, audit
  preparation, certification, or risk assessment. Even if someone says
  'are we compliant' or 'audit is next month' — use this skill.
version: "1.0.0"
---

# Tracking Compliance

Maintains continuous compliance posture at Intinc across SOC2, HIPAA, PCI-DSS, and GDPR frameworks. Shifts compliance from a point-in-time audit exercise to an ongoing operational discipline — tracking controls, monitoring gaps, and ensuring audit readiness year-round.

## Quick-Start Decision Tree

```
Request arrives
  ├─ Audit prep? ──────────── Audit Readiness workflow
  ├─ Gap analysis? ─────────── Control Assessment
  ├─ Policy enforcement? ───── Policy Monitoring
  ├─ Regulatory change? ────── Impact Assessment
  └─ Certification status? ──── Compliance Dashboard
```

## Usage Examples

**Example 1 — Our SOC2 Type II audit is in 6 weeks — are we ready?**
→ Pull current control status from compliance tracker → identify any open remediation items → verify evidence collection is current for all 64 trust service criteria → schedule pre-audit internal review → assign owners to any gaps → establish daily standup for audit prep → prepare auditor access and document packages.

**Example 2 — A client is asking about our HIPAA compliance — what do we say?**
→ Verify current BAA template is up to date → confirm technical safeguards (encryption, access controls, audit logging) → pull latest risk assessment → prepare compliance summary document → verify breach notification procedures are tested → provide client-facing compliance attestation.

**Example 3 — New GDPR guidance was published — what's the impact on us?**
→ Review new guidance → map against current data processing activities → identify any gaps in current compliance posture → assess impact on existing DPAs → recommend policy updates → estimate remediation effort and timeline → brief legal team.

## Golden Path Workflow

1. Maintain compliance framework mapping (controls → requirements)
2. Monitor control effectiveness continuously
3. Collect and organize evidence artifacts
4. Conduct quarterly internal control reviews
5. Track remediation items with owners and deadlines
6. Prepare for external audits (evidence, access, schedule)
7. Monitor regulatory changes and assess impact
8. Report compliance posture to leadership monthly
9. Update policies and procedures as requirements evolve

## Edge Cases & Anti-Patterns

- **Overlapping frameworks** — Map common controls across SOC2/HIPAA/PCI to avoid duplicate evidence collection.
- **Control failure** — Document immediately, assess impact, implement corrective action, notify auditor if during audit period.
- **New service launch** — Conduct compliance impact assessment before go-live; update scope and controls.
- **Client-specific requirements** — Track per-client compliance obligations separately; some may exceed standard frameworks.

## Cross-Skill References

Works with: `managing-vendors`, `administering-contracts`, `responding-to-ai-incidents`, `monitoring-sla-compliance`

## Compliance & Security

SOC2 Type II, HIPAA Security Rule, PCI-DSS v4.0, GDPR, NIST CSF, ISO 27001.

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
- This skill covers the complete tracking compliance workflow at Intinc
- Compliance requirements are mapped to relevant frameworks
- Edge cases reflect real operational scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific regulations may add requirements not covered here

**CONTRADICTIONS:**
- Speed of execution sometimes conflicts with thoroughness of compliance checks — prioritize based on risk level