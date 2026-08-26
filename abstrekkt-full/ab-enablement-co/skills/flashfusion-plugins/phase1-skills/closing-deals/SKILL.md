---
name: closing-deals
description: >-
  Manages the deal close process including final approvals, execution,
  handoff to delivery, and win/loss analysis. Activates when closing
  sales deals, managing close plans, coordinating deal execution,
  conducting win/loss reviews, or handling deal handoff. Also triggers
  on: close deal, deal close, won deal, lost deal, close plan, handoff,
  win/loss analysis, deal execution, signature, or deal review. Even if
  someone says 'we won the deal' or 'why did we lose this one' — use
  this skill.
version: "1.0.0"
---

# Closing Deals

Orchestrates smooth deal closes at Intinc — from final negotiation through execution and delivery handoff. Ensures nothing falls through the cracks during the critical close-to-delivery transition.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New deals? ──────── Creation workflow
  ├─ Update existing? ──── Modification workflow
  ├─ Review / audit? ───── Assessment workflow
  ├─ Reporting? ──────────── Analytics & Dashboards
  └─ Issue / escalation? ── Troubleshooting workflow
```

## Usage Examples

**Example 1 — Help me with closing deals for our top 5 accounts**
→ Pull current state for all 5 accounts → assess each against framework criteria → prioritize by revenue impact → create action plan per account → set review cadence → track progress weekly.

**Example 2 — What's the current status of our closing deals metrics?**
→ Query CRM for current data → calculate key metrics (conversion rates, velocity, value) → compare against targets and prior period → identify trends → flag items needing attention → generate summary report.

**Example 3 — Improve our closing deals process — we're losing too many deals**
→ Audit current process end-to-end → identify bottlenecks and drop-off points → benchmark against industry standards → recommend 3-5 specific improvements → estimate impact of each → prioritize by effort/impact → implement top 2 immediately.

## Golden Path Workflow

1. Identify the closing deals trigger or request
2. Gather context (stakeholders, constraints, timeline, budget)
3. Assess current state and define desired outcome
4. Select appropriate framework or template
5. Execute primary workflow steps
6. Validate output against quality criteria
7. Route for stakeholder review and approval
8. Document decisions and rationale
9. Set follow-up actions and review cadence

## Edge Cases & Anti-Patterns

- **Incomplete data** — Never proceed with closing deals on assumptions alone. Flag gaps explicitly and get confirmation before continuing.
- **Scope creep** — If the request expands beyond the original closing deals scope, pause and re-scope rather than absorbing silently.
- **Stakeholder conflict** — When stakeholders disagree on closing deals approach, document both positions and escalate to decision-maker rather than choosing sides.
- **Compliance overlap** — Check whether closing deals activities trigger requirements in other compliance frameworks (SOC2, HIPAA, GDPR).

## Cross-Skill References

Works with: `qualifying-leads`, `managing-opportunities`, `generating-proposals`, `forecasting-revenue`

## Compliance & Security

SOC2 (data handling in proposals and contracts), GDPR (prospect data processing), CAN-SPAM (email communications). Client data in CRM must follow Intinc's data classification policy.

## Self-Verification Checklist

- [ ] Correct workflow selected for request type
- [ ] All closing deals data validated and current
- [ ] Stakeholder approvals obtained where required
- [ ] Audit trail maintained for all changes
- [ ] Compliance requirements addressed
- [ ] Cross-skill handoffs identified
- [ ] Output format matches audience expectations
- [ ] No sensitive data exposed in deliverables

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- This skill covers the core closing deals workflows at Intinc
- Compliance requirements reflect current framework versions
- Edge cases reflect real sales & revenue scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific requirements may extend beyond the sales & revenue scope covered here

**CONTRADICTIONS:**
- Thoroughness of process sometimes conflicts with speed of execution — calibrate based on deal size and risk
- Standardization improves consistency but may not fit every client's unique situation