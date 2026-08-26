---
name: managing-pipeline
description: >-
  Maintains pipeline hygiene including stage definitions, velocity
  metrics, coverage ratios, and pipeline reviews. Activates when
  cleaning pipeline data, defining sales stages, measuring pipeline
  velocity, running pipeline reviews, or analyzing conversion rates.
  Also triggers on: pipeline hygiene, pipeline review, sales stages,
  conversion rate, pipeline velocity, stale deals, pipeline coverage,
  stage definitions, pipeline cleanup, or deal aging. Even if someone
  says 'clean up the pipeline' or 'too many stale deals' — use this
  skill.
version: "1.0.0"
---

# Managing Pipeline

Enforces pipeline hygiene at Intinc to ensure the CRM reflects reality. Clean pipeline data is the foundation of accurate forecasting and efficient sales operations.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New pipeline? ──────── Creation workflow
  ├─ Update existing? ──── Modification workflow
  ├─ Review / audit? ───── Assessment workflow
  ├─ Reporting? ──────────── Analytics & Dashboards
  └─ Issue / escalation? ── Troubleshooting workflow
```

## Usage Examples

**Example 1 — Help me with managing pipeline for our top 5 accounts**
→ Pull current state for all 5 accounts → assess each against framework criteria → prioritize by revenue impact → create action plan per account → set review cadence → track progress weekly.

**Example 2 — What's the current status of our managing pipeline metrics?**
→ Query CRM for current data → calculate key metrics (conversion rates, velocity, value) → compare against targets and prior period → identify trends → flag items needing attention → generate summary report.

**Example 3 — Improve our managing pipeline process — we're losing too many deals**
→ Audit current process end-to-end → identify bottlenecks and drop-off points → benchmark against industry standards → recommend 3-5 specific improvements → estimate impact of each → prioritize by effort/impact → implement top 2 immediately.

## Golden Path Workflow

1. Identify the managing pipeline trigger or request
2. Gather context (stakeholders, constraints, timeline, budget)
3. Assess current state and define desired outcome
4. Select appropriate framework or template
5. Execute primary workflow steps
6. Validate output against quality criteria
7. Route for stakeholder review and approval
8. Document decisions and rationale
9. Set follow-up actions and review cadence

## Edge Cases & Anti-Patterns

- **Incomplete data** — Never proceed with managing pipeline on assumptions alone. Flag gaps explicitly and get confirmation before continuing.
- **Scope creep** — If the request expands beyond the original managing pipeline scope, pause and re-scope rather than absorbing silently.
- **Stakeholder conflict** — When stakeholders disagree on managing pipeline approach, document both positions and escalate to decision-maker rather than choosing sides.
- **Compliance overlap** — Check whether managing pipeline activities trigger requirements in other compliance frameworks (SOC2, HIPAA, GDPR).

## Cross-Skill References

Works with: `qualifying-leads`, `managing-opportunities`, `generating-proposals`, `forecasting-revenue`

## Compliance & Security

SOC2 (data handling in proposals and contracts), GDPR (prospect data processing), CAN-SPAM (email communications). Client data in CRM must follow Intinc's data classification policy.

## Self-Verification Checklist

- [ ] Correct workflow selected for request type
- [ ] All managing pipeline data validated and current
- [ ] Stakeholder approvals obtained where required
- [ ] Audit trail maintained for all changes
- [ ] Compliance requirements addressed
- [ ] Cross-skill handoffs identified
- [ ] Output format matches audience expectations
- [ ] No sensitive data exposed in deliverables

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- This skill covers the core managing pipeline workflows at Intinc
- Compliance requirements reflect current framework versions
- Edge cases reflect real sales & revenue scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific requirements may extend beyond the sales & revenue scope covered here

**CONTRADICTIONS:**
- Thoroughness of process sometimes conflicts with speed of execution — calibrate based on deal size and risk
- Standardization improves consistency but may not fit every client's unique situation