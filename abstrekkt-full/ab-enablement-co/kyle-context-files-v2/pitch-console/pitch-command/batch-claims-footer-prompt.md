# Batch CLAIMS Footer Prompt
# Use this prompt in a fresh Claude session to process the remaining 35 skills.
# Feed it the skill files as attachments or paste contents inline per batch.

---

You are a senior skill architect adding `CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS` footers to Claude skill files in a personal skill library. These footers are an anti-sycophancy standard. Your job is to read each skill, identify what it implicitly or explicitly claims, surface the scenarios where those claims break down, and flag internal tensions.

## FORMAT SPEC

Append this block at the END of each SKILL.md, after any existing content:

```
---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

- [SOURCED] <fact that can be traced to an observable spec, documented tool behavior, or stated rule in the skill itself>
- [GENERATED] <reasoned estimate or inference — label the reasoning basis in a short clause>
- COUNTEREXAMPLE: <a real scenario where the skill's default advice is wrong, incomplete, or counterproductive>
- !CONTRADICTION: <an internal tension between two things the skill asserts, or a tension with another known skill>
```

## LABELING RULES

- `[SOURCED]` — the claim comes directly from the skill body, a tool's documented behavior, or an empirically observed pattern. Do not use this for projections or inferences.
- `[GENERATED]` — the claim is a reasoned estimate, best practice inference, or heuristic that has not been independently measured. Always add a short reasoning clause: "— inferred from X" or "— estimated from Y."
- `COUNTEREXAMPLE:` — no brackets. A concrete case where following the skill's default instruction produces a worse outcome than the alternative. Must be specific, not abstract.
- `!CONTRADICTION:` — no brackets. An actual tension between two things the skill says, or between this skill and another one. If you cannot identify a real contradiction, write one that is honest about the limits of the skill's scope.

## MINIMUM REQUIREMENTS PER FOOTER

- At least 2 CLAIMS (mix of SOURCED and GENERATED)
- At least 1 COUNTEREXAMPLE
- At least 1 CONTRADICTION (prefix with `!`)
- Total: 4–6 bullet points. No boilerplate. Every claim must be derivable from reading the skill body.

## WHAT NOT TO DO

- Do not write generic claims that could apply to any skill ("this skill helps users accomplish tasks efficiently")
- Do not invent claims that aren't in the skill
- Do not add a SOURCED label to something you're inferring
- Do not add a footer if the skill already has a `## CLAIMS` section — skip it
- Do not change anything else in the file — append only

## EXAMPLE FOOTER (from managing-ff-pipeline)

```
---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

- [SOURCED] Pausing Apollo sequences immediately on first response prevents double-touching a prospect who already replied — established operational rule in skill
- [GENERATED] Closed Lost reason logging converts dead deals into dated pipeline assets — inferred from CRM best practices; not measured against FlashFusion's actual pipeline data
- COUNTEREXAMPLE: The 3-touch minimum applies to cold outreach; warm referrals need zero sequence — adding a referred prospect to an automated sequence damages the relationship that generated the referral
- !CONTRADICTION: "Enrich before reaching out" conflicts with moving fast on time-sensitive opportunities; enrichment depth loses to outreach speed when a prospect is actively evaluating competing vendors right now
```

## SKILLS TO PROCESS

Process each skill below in order. For each:
1. Read the full SKILL.md content
2. Identify 2–4 key claims the skill makes (implicit or explicit)
3. Find 1 scenario where the skill's default breaks down
4. Find 1 internal tension or scope limitation
5. Write the footer per the format spec above
6. Append to the END of the file (do not modify existing content)
7. Confirm line count stays under 500 after appending

**Skip any skill that already contains `## CLAIMS` in the file.**

### Batch 1 — Cross-cutting tooling and methodology

```
/mnt/skills/user/ai-agents-workflow/SKILL.md
/mnt/skills/user/ai-solution-architecture/SKILL.md
/mnt/skills/user/anchor/SKILL.md
/mnt/skills/user/applying-web-design-standards/SKILL.md
/mnt/skills/user/auditing-logic/SKILL.md
/mnt/skills/user/building-kb-pipelines/SKILL.md
/mnt/skills/user/code-auditor/SKILL.md
/mnt/skills/user/code-transfer/SKILL.md
```

### Batch 2 — Agent and workflow skills

```
/mnt/skills/user/create-agent-skills/SKILL.md
/mnt/skills/user/create-meta-prompts/SKILL.md
/mnt/skills/user/create-subagents/SKILL.md
/mnt/skills/user/debug-like-expert/SKILL.md
/mnt/skills/user/deep-research-lcot/SKILL.md
/mnt/skills/user/designing-research-surveys/SKILL.md
/mnt/skills/user/elite-ui-design/SKILL.md
/mnt/skills/user/engineering-patterns/SKILL.md
```

### Batch 3 — INT skills

```
/mnt/skills/user/generating-intinc-documents/SKILL.md
/mnt/skills/user/generating-kb-articles/SKILL.md
/mnt/skills/user/generating-msm-documents/SKILL.md
/mnt/skills/user/implementing-review-feedback/SKILL.md
/mnt/skills/user/kb-screenshot-automator/SKILL.md
/mnt/skills/user/managing-design-briefs/SKILL.md
/mnt/skills/user/orchestrating-ai-agents/SKILL.md
/mnt/skills/user/organizing-projects/SKILL.md
```

### Batch 4 — Remaining user skills

```
/mnt/skills/user/fixing-tests/SKILL.md
/mnt/skills/user/producing-video-content/SKILL.md
/mnt/skills/user/project-bootstrapper/SKILL.md
/mnt/skills/user/refactoring-code/SKILL.md
/mnt/skills/user/reminding-skill-usage/SKILL.md
/mnt/skills/user/sparc-methodology-coach/SKILL.md
/mnt/skills/user/task-decomposition/SKILL.md
/mnt/skills/user/tracking-personal-challenges/SKILL.md
/mnt/skills/user/troubleshooting-skills/SKILL.md
/mnt/skills/user/unifying-service-desk/SKILL.md
/mnt/skills/user/use-case-discovery/SKILL.md
/mnt/skills/user/workflow-automation/SKILL.md
```

## AFTER EACH BATCH

Run this verification:

```bash
for f in [list of files processed]; do
  if grep -q "CLAIMS" "$f"; then
    echo "✅ $(basename $(dirname $f))"
  else
    echo "❌ $(basename $(dirname $f))"
  fi
done
```

Process one batch at a time. Confirm all pass before moving to the next batch.
