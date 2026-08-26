---
name: responding-to-ai-governance-incidents
description: >-
  Manages governance-specific AI incidents including bias discovery in
  production, safety violations, compliance breaches, and ethical
  failures with structured response and remediation. Activates when
  responding to AI governance incidents, managing bias incidents,
  handling safety violations, addressing compliance breaches, or
  executing ethical failure response. Also triggers on: governance
  incident, bias incident, safety violation, compliance breach AI,
  ethical failure, AI incident governance, model failure governance,
  regulatory incident AI, governance response, or the model did
  something biased. Even if someone says 'we found bias in production'
  or 'handle this AI compliance issue' — use this skill. NOTE: For
  general AI service outages, see `responding-to-ai-incidents` in Phase
  1 Strategy skills.
version: "1.0.0"
---

# Responding to AI Governance Incidents

Responds to governance-specific AI failures at Intinc — bias discoveries, safety violations, and compliance breaches with structured investigation, remediation, and regulatory communication. Distinct from general AI incident response which covers service availability.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New to ai governance incidents? ──────── Creation workflow
  ├─ Update existing? ──── Modification workflow
  ├─ Review / audit? ───── Assessment workflow
  ├─ Reporting? ──────────── Analytics & Dashboards
  └─ Issue / escalation? ── Troubleshooting workflow
```

## Usage Examples

**Example 1 — Implement responding to ai governance incidents for our AI platform**
→ Review regulatory requirements → assess current responding to ai governance incidents maturity → define target state → create implementation roadmap → build tooling and processes → validate with test scenarios → document compliance evidence.

**Example 2 — Audit our current responding to ai governance incidents practices**
→ Gather existing documentation → test against framework requirements → identify gaps and non-conformities → classify by severity (critical, high, medium, low) → produce audit report with remediation timeline.

**Example 3 — A regulator/client is asking about our responding to ai governance incidents approach**
→ Pull current compliance documentation → verify it reflects actual practice → identify any gaps between docs and reality → prepare evidence package → draft response with supporting artifacts → route for legal review before sending.

## Golden Path Workflow

1. Identify applicable regulatory and policy requirements
2. Assess current responding to ai governance incidents maturity level
3. Define target state and gap analysis for responding to ai governance incidents
4. Design implementation plan with clear milestones
5. Build tooling, processes, and documentation
6. Validate with test scenarios and edge cases
7. Train relevant teams on new processes
8. Deploy to production with monitoring
9. Collect compliance evidence and maintain audit trail
10. Schedule periodic reviews and updates

## Edge Cases & Anti-Patterns

- **Regulatory variation** — responding to ai governance incidents requirements differ by jurisdiction. What's compliant in the US may not be in the EU.
- **Retroactive requirements** — New regulations may apply retroactively to existing AI systems. Maintain an inventory of deployed models for rapid responding to ai governance incidents reassessment.
- **Third-party components** — responding to ai governance incidents applies to vendor-provided AI components too, not just internally built systems.
- **Edge case escalation** — When automated responding to ai governance incidents checks are inconclusive, have a clear human escalation path with defined SLA.

## Cross-Skill References

Works with: `implementing-ai-observability`, `testing-ai-systems`, `implementing-guardrails`, `detecting-ai-bias`, `conducting-safety-testing`

## Compliance & Security

SOC2 (audit trails for AI decisions and governance actions), GDPR (automated decision-making transparency, right to explanation), AI Act (high-risk AI system requirements, conformity assessments), NIST AI RMF (risk management framework alignment), ISO 42001 (AI management system standard).

## Self-Verification Checklist

- [ ] Correct workflow selected for request type
- [ ] All responding to ai governance incidents data validated and current
- [ ] Stakeholder approvals obtained where required
- [ ] Audit trail maintained for all changes
- [ ] Compliance requirements addressed
- [ ] Cross-skill handoffs identified
- [ ] Output format matches audience expectations
- [ ] No sensitive data exposed in deliverables

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- This skill covers the core responding to ai governance incidents workflows at Intinc
- Compliance requirements reflect current framework versions
- Edge cases reflect real ai governance & safety scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific requirements may extend beyond the ai governance & safety scope covered here

**CONTRADICTIONS:**
- Thoroughness of process sometimes conflicts with speed of execution — calibrate based on deal size and risk
- Standardization improves consistency but may not fit every client's unique situation