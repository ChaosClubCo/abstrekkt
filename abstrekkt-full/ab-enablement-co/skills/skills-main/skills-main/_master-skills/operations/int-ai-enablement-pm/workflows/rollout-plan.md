<process>

## Domain Unlock Rollout Plan

**Purpose:** Plan the phased delivery of a skill or AI capability to the Intinc team, anchored to domain unlock evidence.

**Collect before writing:**
- Which skill / domain are we rolling out?
- What hat-wearers are the target? (Service desk / engineers / ops / leadership)
- What's the pilot group size? (Default: 3–5 people, Kyle delivers 1:1)
- What's the unlock evidence? (What does "this domain is unlocked" look like for this person?)

---

## Rollout Plan Template

```markdown
## [Skill Name] Domain Unlock Rollout Plan
Owner: Kyle Rosebrook | Date: [date]

**Domain being unlocked:** [e.g., KB Article Creation]
**Target hat-wearers:** [e.g., Daniel's service desk team — 4 people]
**Unlock evidence:** [e.g., Person produces a complete KB article using kb-article-gen in < 15 min]

---

### Phase 0 — Kyle Validates (Before Any Rollout)
- [ ] Kyle uses the skill on a REAL task — not a test prompt
- [ ] Output Kyle would actually use in production
- [ ] Audit loop passed if it's a code/build skill

### Phase 1 — Pilot (Week 1–2)
- [ ] Identify 3–5 pilot users — choose for influence + receptiveness
- [ ] Deliver 1:1 aha-moment session for each (find their most repetitive task, solve it live)
- [ ] Collect feedback: what worked, what was confusing, what would they change?
- [ ] Exit criteria: [N] of [N] pilots complete 1 task with the skill and rate it useful

### Phase 2 — Soft Launch (Week 3–4)
- [ ] Post skill link + 1-paragraph "how to use it" in #ai-wins Teams channel
- [ ] Daniel (or relevant lead) endorses it to their team
- [ ] Office hours slot dedicated to this skill
- [ ] Exit criteria: [X]% of target hat-wearers have attempted the skill at least once

### Phase 3 — Full Deployment (Week 5+)
- [ ] Skill added to the shared Notion skills library under the correct category
- [ ] Domain unlock count logged in the dashboard (via int-data-analyst)
- [ ] Monthly tracking starts

---

### Aha-Moment Session Format (Highest-Leverage Activity)
1. Before the session: ask "what's the one task you do most often that you hate?"
2. During: build a skill invocation for THAT specific task, with them watching
3. End: they do it themselves once before leaving
4. Follow-up: check in 48 hours — did they use it again?
```

</process>
