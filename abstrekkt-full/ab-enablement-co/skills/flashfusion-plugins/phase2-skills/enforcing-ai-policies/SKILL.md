---
name: enforcing-ai-policies
description: >-
  Implements and enforces AI usage policies including guardrail
  configurations, blocklist management, acceptable use enforcement, and
  policy compliance monitoring. Activates when enforcing AI policies,
  configuring guardrails, managing blocklists, monitoring policy
  compliance, or updating acceptable use policies. Also triggers on: AI
  policy, guardrail configuration, blocklist, acceptable use, policy
  enforcement, usage policy, AI rules, content blocklist, policy
  monitoring, or enforce the rules. Even if someone says 'update the
  blocklist' or 'enforce our AI policies' — use this skill.
version: "1.0.0"
---

# Enforcing AI Policies

Enforces the rules of AI engagement at Intinc — translating AI policies into technical controls (guardrails, blocklists, monitoring) that ensure compliance without manual review of every interaction.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New ai policies? ──────── Creation workflow
  ├─ Update existing? ──── Modification workflow
  ├─ Review / audit? ───── Assessment workflow
  ├─ Reporting? ──────────── Analytics & Dashboards
  └─ Issue / escalation? ── Troubleshooting workflow
```

## Usage Examples

**Example 1 — Implement enforcing ai policies for our AI platform**
→ Review regulatory requirements → assess current enforcing ai policies maturity → define target state → create implementation roadmap → build tooling and processes → validate with test scenarios → document compliance evidence.

**Example 2 — Audit our current enforcing ai policies practices**
→ Gather existing documentation → test against framework requirements → identify gaps and non-conformities → classify by severity (critical, high, medium, low) → produce audit report with remediation timeline.

**Example 3 — A regulator/client is asking about our enforcing ai policies approach**
→ Pull current compliance documentation → verify it reflects actual practice → identify any gaps between docs and reality → prepare evidence package → draft response with supporting artifacts → route for legal review before sending.

## Golden Path Workflow

1. Identify applicable regulatory and policy requirements
2. Assess current enforcing ai policies maturity level
3. Define target state and gap analysis for enforcing ai policies
4. Design implementation plan with clear milestones
5. Build tooling, processes, and documentation
6. Validate with test scenarios and edge cases
7. Train relevant teams on new processes
8. Deploy to production with monitoring
9. Collect compliance evidence and maintain audit trail
10. Schedule periodic reviews and updates

## Edge Cases & Anti-Patterns

- **Regulatory variation** — enforcing ai policies requirements differ by jurisdiction. What's compliant in the US may not be in the EU.
- **Retroactive requirements** — New regulations may apply retroactively to existing AI systems. Maintain an inventory of deployed models for rapid enforcing ai policies reassessment.
- **Third-party components** — enforcing ai policies applies to vendor-provided AI components too, not just internally built systems.
- **Edge case escalation** — When automated enforcing ai policies checks are inconclusive, have a clear human escalation path with defined SLA.

## Cross-Skill References

Works with: `implementing-ai-observability`, `testing-ai-systems`, `implementing-guardrails`, `detecting-ai-bias`, `conducting-safety-testing`

## Compliance & Security

SOC2 (audit trails for AI decisions and governance actions), GDPR (automated decision-making transparency, right to explanation), AI Act (high-risk AI system requirements, conformity assessments), NIST AI RMF (risk management framework alignment), ISO 42001 (AI management system standard).

## Self-Verification Checklist

- [ ] Correct workflow selected for request type
- [ ] All enforcing ai policies data validated and current
- [ ] Stakeholder approvals obtained where required
- [ ] Audit trail maintained for all changes
- [ ] Compliance requirements addressed
- [ ] Cross-skill handoffs identified
- [ ] Output format matches audience expectations
- [ ] No sensitive data exposed in deliverables

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- This skill covers the core enforcing ai policies workflows at Intinc
- Compliance requirements reflect current framework versions
- Edge cases reflect real ai governance & safety scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific requirements may extend beyond the ai governance & safety scope covered here

**CONTRADICTIONS:**
- Thoroughness of process sometimes conflicts with speed of execution — calibrate based on deal size and risk
- Standardization improves consistency but may not fit every client's unique situation