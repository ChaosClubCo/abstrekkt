---
name: int-ai-enablement-pm
description: Helps automate and manage int ai enablement pm processes. <essential_principles>. Use when managing, optimizing, or automating operational workflows.
---

# INT AI Enablement PM Skill

## Core Workflow


<essential_principles>

1. **Understand the current state before proposing.** Never assume the baseline. Always ask what exists now, what's broken, and who is affected — before writing a single word of the proposal.

2. **Stakeholder-specific framing.** Dave = business ROI + risk. Jackie = operations + efficiency. Daniel = service desk outcomes. Engineering = time saved + skill growth. The same initiative gets a different brief for each audience.

3. **WSJF first, always.** Every initiative gets a WSJF score before entering the roadmap. No score = no prioritization = no shipping. WSJF is the input, not the override — political viability exists, but it gets named explicitly rather than silently inflating the score.

4. **Hat-neutral language.** Intinc wears multiple hats. There are no levels, no maturity scores, no "you're a L1." The framing is always "unlocking capabilities" — which domains can this person operate in with AI assistance?

5. **No placeholders.** Every PRD and brief is complete and deployable. Never output TBD, [insert here], or stub sections. If information is missing, ask for it before writing.

6. **Executives read 1-pagers, not PRDs.** Default to the 1-pager format for Dave, Jackie, and Daniel. Offer the full PRD only if they ask for more detail or if the initiative requires cross-functional sign-off.

</essential_principles>

<intake>

**Determine the deliverable type:**

| Request | Deliverable | Workflow |
|---|---|---|
| Brief for Dave / Jackie / Daniel | 1-pager stakeholder brief | `workflows/stakeholder-brief.md` |
| Full initiative proposal | PRD with stakeholder impact + rollout plan | `workflows/prd.md` |
| Prioritize a list of initiatives | WSJF backlog table | `workflows/wsjf-backlog.md` |
| Plan a skill rollout | Domain unlock rollout plan | `workflows/rollout-plan.md` |
| All of the above for one initiative | Full package | Run all four workflows in sequence |

**If request is ambiguous:** ask "Who is the primary audience — Dave, Jackie, Daniel, or engineering? And what do you need them to do after reading it?"

</intake>

<routing>

Route to the appropriate workflow based on deliverable type identified at intake.

**Chain to `intinc-doc-generator`** at the end of any workflow to produce a formatted INT-branded .docx.

**Pull metrics from `int-data-analyst`** when a proposal needs data backing — don't estimate numbers when real data exists.

</routing>

<reference_index>

| Reference | Purpose |
|-----------|---------|
| `references/stakeholder-map.md` | Dave / Jackie / Daniel framing guide, brief examples, WSJF reference table |

</reference_index>

<workflows_index>

| Workflow | Purpose |
|----------|---------|
| `workflows/stakeholder-brief.md` | 1-pager brief for a specific stakeholder |
| `workflows/prd.md` | Full PRD with stakeholder impact, metrics, rollout, risks |
| `workflows/wsjf-backlog.md` | WSJF scoring and prioritization for a list of initiatives |
| `workflows/rollout-plan.md` | Domain unlock rollout plan with phased delivery |

</workflows_index>
