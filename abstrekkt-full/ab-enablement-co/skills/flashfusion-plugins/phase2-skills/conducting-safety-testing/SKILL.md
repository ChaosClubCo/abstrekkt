---
name: conducting-safety-testing
description: >-
  Performs AI safety testing including red teaming, adversarial attacks,
  jailbreak testing, and robustness evaluation. Activates when
  conducting AI safety testing, running red team exercises, testing
  adversarial inputs, evaluating jailbreak resistance, or assessing
  model robustness. Also triggers on: safety testing, red teaming,
  adversarial testing, jailbreak test, robustness testing, AI safety,
  attack testing, prompt injection test, safety evaluation, or can this
  be hacked. Even if someone says 'red team this model' or 'test for
  jailbreaks' — use this skill.
version: "1.0.0"
---

# Conducting Safety Testing

Stress-tests AI systems before they reach users at Intinc — systematic red teaming, adversarial attacks, and jailbreak testing that finds vulnerabilities before bad actors do.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New safety testing? ──────── Creation workflow
  ├─ Update existing? ──── Modification workflow
  ├─ Review / audit? ───── Assessment workflow
  ├─ Reporting? ──────────── Analytics & Dashboards
  └─ Issue / escalation? ── Troubleshooting workflow
```

## Usage Examples

**Example 1 — Implement conducting safety testing for our AI platform**
→ Review regulatory requirements → assess current conducting safety testing maturity → define target state → create implementation roadmap → build tooling and processes → validate with test scenarios → document compliance evidence.

**Example 2 — Audit our current conducting safety testing practices**
→ Gather existing documentation → test against framework requirements → identify gaps and non-conformities → classify by severity (critical, high, medium, low) → produce audit report with remediation timeline.

**Example 3 — A regulator/client is asking about our conducting safety testing approach**
→ Pull current compliance documentation → verify it reflects actual practice → identify any gaps between docs and reality → prepare evidence package → draft response with supporting artifacts → route for legal review before sending.

## Golden Path Workflow

1. Identify applicable regulatory and policy requirements
2. Assess current conducting safety testing maturity level
3. Define target state and gap analysis for conducting safety testing
4. Design implementation plan with clear milestones
5. Build tooling, processes, and documentation
6. Validate with test scenarios and edge cases
7. Train relevant teams on new processes
8. Deploy to production with monitoring
9. Collect compliance evidence and maintain audit trail
10. Schedule periodic reviews and updates

## Edge Cases & Anti-Patterns

- **Regulatory variation** — conducting safety testing requirements differ by jurisdiction. What's compliant in the US may not be in the EU.
- **Retroactive requirements** — New regulations may apply retroactively to existing AI systems. Maintain an inventory of deployed models for rapid conducting safety testing reassessment.
- **Third-party components** — conducting safety testing applies to vendor-provided AI components too, not just internally built systems.
- **Edge case escalation** — When automated conducting safety testing checks are inconclusive, have a clear human escalation path with defined SLA.

## Cross-Skill References

Works with: `implementing-ai-observability`, `testing-ai-systems`, `implementing-guardrails`, `detecting-ai-bias`, `building-explainability`

## Compliance & Security

SOC2 (audit trails for AI decisions and governance actions), GDPR (automated decision-making transparency, right to explanation), AI Act (high-risk AI system requirements, conformity assessments), NIST AI RMF (risk management framework alignment), ISO 42001 (AI management system standard).

## Self-Verification Checklist

- [ ] Correct workflow selected for request type
- [ ] All conducting safety testing data validated and current
- [ ] Stakeholder approvals obtained where required
- [ ] Audit trail maintained for all changes
- [ ] Compliance requirements addressed
- [ ] Cross-skill handoffs identified
- [ ] Output format matches audience expectations
- [ ] No sensitive data exposed in deliverables

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- This skill covers the core conducting safety testing workflows at Intinc
- Compliance requirements reflect current framework versions
- Edge cases reflect real ai governance & safety scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific requirements may extend beyond the ai governance & safety scope covered here

**CONTRADICTIONS:**
- Thoroughness of process sometimes conflicts with speed of execution — calibrate based on deal size and risk
- Standardization improves consistency but may not fit every client's unique situation