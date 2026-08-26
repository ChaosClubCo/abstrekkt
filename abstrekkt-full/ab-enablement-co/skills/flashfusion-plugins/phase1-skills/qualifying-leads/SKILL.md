---
name: qualifying-leads
description: >-
  Scores and qualifies inbound and outbound leads using BANT, MEDDIC,
  and custom frameworks. Activates when scoring leads, qualifying
  prospects, routing MQLs to sales, defining ICP criteria, building lead
  scoring models, or evaluating prospect fit. Also triggers on: lead
  scoring, lead qualification, MQL, SQL, ICP, BANT, MEDDIC, prospect,
  inbound lead, lead routing, or qualified lead. Even if someone says
  'is this lead worth pursuing' or 'score these leads' — use this skill.
version: "1.0.0"
---

# Qualifying Leads

Systematizes lead qualification at Intinc to ensure sales focuses on high-probability prospects. Combines firmographic scoring (company size, industry, tech stack) with behavioral signals (engagement, intent) to produce reliable lead scores that accelerate pipeline velocity.

## Quick-Start Decision Tree

```
Request arrives
  ├─ New leads? ──────── Creation workflow
  ├─ Update existing? ──── Modification workflow
  ├─ Review / audit? ───── Assessment workflow
  ├─ Reporting? ──────────── Analytics & Dashboards
  └─ Issue / escalation? ── Troubleshooting workflow
```

## Usage Examples

**Example 1 — Help me with qualifying leads for our top 5 accounts**
→ Pull current state for all 5 accounts → assess each against framework criteria → prioritize by revenue impact → create action plan per account → set review cadence → track progress weekly.

**Example 2 — What's the current status of our qualifying leads metrics?**
→ Query CRM for current data → calculate key metrics (conversion rates, velocity, value) → compare against targets and prior period → identify trends → flag items needing attention → generate summary report.

**Example 3 — Improve our qualifying leads process — we're losing too many deals**
→ Audit current process end-to-end → identify bottlenecks and drop-off points → benchmark against industry standards → recommend 3-5 specific improvements → estimate impact of each → prioritize by effort/impact → implement top 2 immediately.

## Golden Path Workflow

1. Identify the qualifying leads trigger or request
2. Gather context (stakeholders, constraints, timeline, budget)
3. Assess current state and define desired outcome
4. Select appropriate framework or template
5. Execute primary workflow steps
6. Validate output against quality criteria
7. Route for stakeholder review and approval
8. Document decisions and rationale
9. Set follow-up actions and review cadence

## Edge Cases & Anti-Patterns

- **Incomplete data** — Never proceed with qualifying leads on assumptions alone. Flag gaps explicitly and get confirmation before continuing.
- **Scope creep** — If the request expands beyond the original qualifying leads scope, pause and re-scope rather than absorbing silently.
- **Stakeholder conflict** — When stakeholders disagree on qualifying leads approach, document both positions and escalate to decision-maker rather than choosing sides.
- **Compliance overlap** — Check whether qualifying leads activities trigger requirements in other compliance frameworks (SOC2, HIPAA, GDPR).

## Cross-Skill References

Works with: `managing-opportunities`, `generating-proposals`, `forecasting-revenue`, `managing-pipeline`

## Compliance & Security

SOC2 (data handling in proposals and contracts), GDPR (prospect data processing), CAN-SPAM (email communications). Client data in CRM must follow Intinc's data classification policy.

## Self-Verification Checklist

- [ ] Correct workflow selected for request type
- [ ] All qualifying leads data validated and current
- [ ] Stakeholder approvals obtained where required
- [ ] Audit trail maintained for all changes
- [ ] Compliance requirements addressed
- [ ] Cross-skill handoffs identified
- [ ] Output format matches audience expectations
- [ ] No sensitive data exposed in deliverables

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- This skill covers the core qualifying leads workflows at Intinc
- Compliance requirements reflect current framework versions
- Edge cases reflect real sales & revenue scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific requirements may extend beyond the sales & revenue scope covered here

**CONTRADICTIONS:**
- Thoroughness of process sometimes conflicts with speed of execution — calibrate based on deal size and risk
- Standardization improves consistency but may not fit every client's unique situation