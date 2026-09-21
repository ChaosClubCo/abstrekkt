<required_reading>
Load `references/stakeholder-map.md` for stakeholder framing.
Pull metrics from `int-data-analyst` before estimating baselines.
</required_reading>

<process>

## Full PRD

**When to use:** Cross-functional initiative requiring sign-off from multiple stakeholders, or when engineering needs a complete spec to implement.

**Collect before writing:** current state + baseline metrics + stakeholders + success criteria + timeline + risks. Do not write a PRD with unknown baselines — pull real data first.

```markdown
# [Initiative Name] — AI Enablement PRD

**Status**: Draft | In Review | Approved
**Owner**: Kyle Rosebrook, Staff Engineer (AI SME)
**Date**: [YYYY-MM-DD]
**WSJF Score**: [score — see wsjf-backlog workflow]
**Primary Audience**: [Dave / Jackie / Daniel / Engineering]

---

## Problem Statement
[1–2 sentences: what pain, how many affected, evidence.
Example: "KB article creation takes 45 min/article with inconsistent quality.
Service desk creates ~8/month = ~6 hours of team time at a loaded rate of ~$X."]

## Proposed Solution
[What the AI capability does. How staff invoke it. Name the specific skill. What it replaces.]

## Stakeholder Impact
| Stakeholder | Current State | Future State | Metric |
|---|---|---|---|
| Dave | [pain] | [outcome] | [ROI / cost metric] |
| Jackie | [pain] | [outcome] | [efficiency metric] |
| Daniel | [pain] | [outcome] | [service desk metric] |
| Engineering | [pain] | [outcome] | [time saved / skill unlocked] |

## Success Metrics
| Metric | Baseline | Target | Measurement Method | Review Cadence |
|---|---|---|---|---|
| [e.g., KB article time] | [e.g., 45 min] | [e.g., 8 min] | [e.g., Daniel's team time log] | Monthly |

## Rollout Plan
| Phase | Timeline | Scope | Owner | Exit Criteria |
|---|---|---|---|---|
| Pilot | Week 1–2 | [N people] | Kyle | [N complete 1 task; feedback documented] |
| Soft launch | Week 3–4 | [broader] | Kyle + [stakeholder] | [adoption > X%] |
| Full deploy | Week 5+ | All eligible | Department lead | [success metric hit] |

## Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Low adoption (onboarding hard) | High | High | Kyle 1:1 aha-moment sessions for first 5 users |
| Output quality inconsistent | Medium | Medium | Acceptance criteria in skill; outputs reviewed before publish |

## Acceptance Criteria
- [ ] Stakeholder sign-off from [name] by [date]
- [ ] Pilot with [N] people; feedback documented
- [ ] Baseline metric captured before launch
- [ ] Skill deployed to shared repo and documented in Notion

## Out of Scope
[What this does NOT cover — prevent scope creep]
```

</process>
