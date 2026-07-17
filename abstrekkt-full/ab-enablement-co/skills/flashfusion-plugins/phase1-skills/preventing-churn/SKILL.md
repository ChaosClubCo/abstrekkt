---
name: preventing-churn
description: >-
  Detects churn risk and executes save plays including escalation
  protocols, retention offers, and win-back campaigns. Activates when
  identifying churn risk, executing save plays, designing retention
  offers, managing escalation for at-risk accounts, or analyzing churn
  patterns. Also triggers on: churn, churn risk, save play, retention,
  at-risk, cancellation risk, churn prevention, win-back, customer
  leaving, or reduce churn. Even if someone says 'they might leave' or
  'how do we keep this client' — use this skill.
version: "1.0.0"
---

# Preventing Churn

Catches accounts before they churn at Intinc through systematic risk detection, intervention playbooks, and escalation protocols that put the right resources on at-risk accounts at the right time.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New churn? ──────── Creation workflow
  ├─ Update existing? ──── Modification workflow
  ├─ Review / audit? ───── Assessment workflow
  ├─ Reporting? ──────────── Analytics & Dashboards
  └─ Issue / escalation? ── Troubleshooting workflow
```

## Usage Examples

**Example 1 — Set up preventing churn for our new enterprise client**
→ Review client profile and contract terms → create customized plan based on their goals → define milestones and success criteria → assign CS resources → schedule initial touchpoints → set up tracking in CS platform.

**Example 2 — Run a preventing churn review across our book of business**
→ Pull data for all active clients → score each against framework criteria → segment into tiers (healthy, needs attention, at-risk) → create intervention plans for at-risk accounts → brief CS team on findings → schedule follow-up actions.

**Example 3 — Our preventing churn numbers are declining — diagnose the issue**
→ Pull trend data for last 6 months → segment by client tier, tenure, and service type → identify the cohort driving decline → root cause the top 3 contributing factors → recommend corrective actions → set measurement targets for improvement.

## Golden Path Workflow

1. Identify the preventing churn trigger or request
2. Gather context (stakeholders, constraints, timeline, budget)
3. Assess current state and define desired outcome
4. Select appropriate framework or template
5. Execute primary workflow steps
6. Validate output against quality criteria
7. Route for stakeholder review and approval
8. Document decisions and rationale
9. Set follow-up actions and review cadence

## Edge Cases & Anti-Patterns

- **Incomplete data** — Never proceed with preventing churn on assumptions alone. Flag gaps explicitly and get confirmation before continuing.
- **Scope creep** — If the request expands beyond the original preventing churn scope, pause and re-scope rather than absorbing silently.
- **Stakeholder conflict** — When stakeholders disagree on preventing churn approach, document both positions and escalate to decision-maker rather than choosing sides.
- **Compliance overlap** — Check whether preventing churn activities trigger requirements in other compliance frameworks (SOC2, HIPAA, GDPR).

## Cross-Skill References

Works with: `onboarding-customers`, `scoring-health`, `managing-renewals`, `collecting-feedback`

## Compliance & Security

SOC2 (customer data access controls), HIPAA (if handling healthcare client data), GDPR (customer communication consent), data retention policies for customer records.

## Self-Verification Checklist

- [ ] Correct workflow selected for request type
- [ ] All preventing churn data validated and current
- [ ] Stakeholder approvals obtained where required
- [ ] Audit trail maintained for all changes
- [ ] Compliance requirements addressed
- [ ] Cross-skill handoffs identified
- [ ] Output format matches audience expectations
- [ ] No sensitive data exposed in deliverables

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- This skill covers the core preventing churn workflows at Intinc
- Compliance requirements reflect current framework versions
- Edge cases reflect real customer success scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific requirements may extend beyond the customer success scope covered here

**CONTRADICTIONS:**
- Thoroughness of process sometimes conflicts with speed of execution — calibrate based on deal size and risk
- Standardization improves consistency but may not fit every client's unique situation