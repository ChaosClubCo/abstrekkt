---
name: capturing-workflows-as-skills
description: >
  Use whenever a user says "turn this into a skill", "make this a skill",
  "encode this as a skill", "capture this workflow", "save this as a skill",
  "bottle this up", "this should be a skill", "make this repeatable",
  "I keep doing this manually", "I don't want to redo this from scratch",
  "save this pattern", "capture this session", "skill this up",
  "preserve this workflow", "formalize this", "let's not figure this out
  again", or finishes a multi-step task and asks to preserve it. Also
  triggers on: extract skill from this, workflow skill, save what we
  learned, reusable skill, turn this conversation into a skill, add this
  to my skill library, capture the gotchas, document this process as a
  skill, remember this for next time. Even if the user doesn't say
  "skill" — activate whenever they finish a hard session and want it
  preserved for reuse.
metadata:
  version: "1.3.0"
---

# Capturing Workflows as Skills

Converts completed tasks, conversations, and hard-won workflows into reusable
Cowork SKILL.md files. The primary value is capturing what would otherwise be
re-learned: CDN restrictions, required headers, model string gotchas, API
quirks, decision trees, and code patterns that aren't obvious from docs alone.

## TL;DR

Read what was done. Extract the non-obvious parts. Write a skill that makes
the next run faster and more correct. A good skill saves at least one
"I forgot about that" per future use.

---

## Skill Chaining

| Need | Skill |
|---|---|
| Naming and structural rules | `developing-skills` |
| Create a distributable .skill zip | `packaging-skills` |
| Fix a broken or under-performing skill | `auditing-and-rewriting-skills` |

When in doubt: capture here first, then package with `packaging-skills`.

---

## Decision Tree

```
Where is the workflow documented?
  ├─ Current conversation / context window
  │    └─ Read the conversation summary + key messages fully before extracting
  ├─ A file on disk (code, notes, artifact)
  │    └─ Read it with the Read tool before extracting
  └─ Only in the user's head
       ├─ Ask 3 clarifying questions: What problem does it solve? What are
       │  the non-obvious steps? What would you warn someone doing this
       │  for the first time?
       └─ If answers are still vague → ask: "Walk me through the last time
          you did this step by step." before writing anything.

Should this even be a skill?
  ├─ Will it run more than 2-3 times? → Yes, capture it
  ├─ Is it trivial (Claude handles it fine without instructions)? → Skip
  ├─ Is the workflow too one-off to generalize? → Skip
  └─ Does an existing skill already cover it well? → Improve that skill instead

Skill name decided?
  ├─ Yes → confirm gerund form (verb-ing + noun), lowercase + hyphens, ≤ 64 chars
  └─ No  → derive from the core action: "converting-X-to-Y", "building-X-with-Y"

SKILL.md under 500 lines?
  ├─ Yes → write single file
  └─ No  → split into references/ by topic (one semantic domain per file)

Done → save to outputs/<skill-name>/SKILL.md and present the file
```

---

## Usage Examples

Three end-to-end worked extraction scenarios (technical session, recurring operational process, debugging session). See `examples/worked-examples.md`.

---

## Extraction Protocol

### Step 1 — Read the source fully

Do not summarize from memory. Read the conversation context, files, or artifact
before writing anything. Misread state models, wrong API calls, and invented
constraints are worse than no skill.

Priority read order:
1. Any output files created during the workflow (code, artifacts, docs)
2. The conversation summary / key messages
3. Any referenced external docs or specs

### Step 2 — Classify what's extractable

| Category | What to extract | Where in SKILL.md |
|---|---|---|
| Non-obvious constraints | CDN restrictions, required headers, blocked features | Gotchas |
| Decision points | "Use X when Y, else Z" | Decision Tree |
| Reusable code patterns | Auth helpers, streaming patterns, parsers | Code Blocks |
| Feature casualties | Things that don't work in this context | Gotchas |
| Verification steps | How to confirm the output is correct | Self-Verification |
| Natural trigger phrases | Exact words the user typed to start this | Description field |

### Step 3 — Write the SKILL.md

See `examples/worked-examples.md` for the full SKILL.md template skeleton. Structure: frontmatter → title → TL;DR → Decision Tree → Usage Examples → core workflow section(s) → Gotchas → Self-Verification Checklist → CLAIMS/COUNTEREXAMPLE/CONTRADICTIONS.

### Step 4 — Write a pushy description

The description is the most important field. Claude under-triggers skills.

**Rules:**
- Open with "Use whenever" — not a summary sentence about what the skill does
- Include the exact phrases the user typed — not your reformulation
- At least one casual/lowercase variant
- A "use whenever X — even if Y" clause
- 4–8 distinct trigger phrases minimum
- No workflow summary text — that space belongs to trigger phrases
- Max 1024 chars

See `examples/worked-examples.md` for a weak-vs-pushy description example.

### Step 5 — Write 3+ eval scenarios before finalizing

See `examples/worked-examples.md` for the eval template and the dogfooded eval scenarios for this skill.

If a positive eval fails → add the failing phrase to the description.
If a negative eval triggers → tighten description specificity.

### Step 6 — Populate Gotchas from actual failures

- Things tried that didn't work (and why)
- Requirements not obvious until you hit them
- Tempting-but-wrong approaches
- Environment-specific behavior

Update Gotchas every time the skill runs and something unexpected happens.

---

## Naming Conventions

See `examples/worked-examples.md` for good-vs-bad naming examples.

Rules: gerund start, lowercase hyphens only, ≤ 64 chars, describes the action not the output.

---

## Reference Files

- `examples/worked-examples.md` — worked extraction scenarios, a weak-vs-pushy description example, the eval template + dogfooded eval scenarios, good-vs-bad naming examples, and the full SKILL.md template skeleton.

---

## Gotchas

1. **Don't guess the workflow — read the source.** Extracting from memory produces
   plausible but incorrect details. The CDN restriction, the required header, the
   broken feature — these are not in documentation. They're in what actually happened.

2. **The description is not a summary — it's a trigger contract.** Open with
   "Use whenever." Include the actual phrases the user typed. Strip all workflow
   summary text — that space should be more trigger phrases.

3. **`version` goes under `metadata:`, not top-level.** Top-level frontmatter fields
   are `name`, `description`, `license`, `compatibility`, `metadata`. A top-level
   `version:` key is non-standard and may cause parsing issues. v1.1.0 of this
   skill itself committed this error while documenting it as a Gotcha.

4. **Gotchas decay if you don't update them.** A skill without a living Gotchas
   section becomes stale. Add every time the skill runs and something unexpected happens.

5. **Generic skills get ignored.** A skill named `web-development` with "helps with
   web development" will never trigger on anything specific. Name and describe the
   exact workflow, not the domain.

6. **Skills don't auto-sync across surfaces.** A skill written to `outputs/<name>/SKILL.md`
   is not automatically installed. Drop the folder into the skills directory or use
   `packaging-skills` to zip it. Always tell the user this after creating.

7. **Code snippets are the highest-ROI content.** A skill with the actual streaming
   helper, actual CSS variables, actual API call pattern is worth 10x one that says
   "rewrite the streaming logic in vanilla JS." Give the code.

8. **Test trigger phrases against real messages.** Go back to the conversation and
   pull the exact phrasing. Don't invent canonical terms — the user's phrasing is
   the trigger.

9. **"Only in the user's head" is not a dead end — but it's close.** If after 3
   clarifying questions you still don't have concrete steps, non-obvious constraints,
   or at least one "watch out for" — you don't have a skill yet. Ask them to walk
   through the last time they did it step by step before writing anything.

---

## Self-Verification Checklist

0. Source workflow was read fully (not summarized or guessed)
1. Name is gerund form, lowercase + hyphens, ≤ 64 chars, matches directory name
2. Description opens with "Use whenever", is pushy, third-person, ≤ 1024 chars — trigger phrases only, no workflow summary
3. `version` is nested under `metadata:`, not top-level
4. 3+ eval scenarios written for THIS skill; positive evals pass, negative evals stay silent
5. Decision tree covers the main branching logic, including "should this even be a skill?" gate
6. 3 usage examples present — `User: "[exact phrase]"` → steps → outcome format
7. Gotchas populated from actual failures (not invented edge cases)
8. Code snippets included where patterns are reusable
9. SKILL.md is under 500 lines
10. CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS present as three separate `##` sections
11. File saved to `outputs/<skill-name>/SKILL.md`
12. User told how to install (drop folder into skills dir, or use packaging-skills)

---

## CLAIMS

- [SOURCED] Claude under-triggers skills by default; pushy descriptions measurably
  improve activation — Anthropic skill-creator docs, March 2026
- [SOURCED] Skills are an open standard as of January 2026; they do not auto-sync
  between claude.ai / API / Claude Code / Cowork — Anthropic platform docs
- [SOURCED] Required top-level frontmatter fields are `name` and `description` only;
  `version` belongs nested under `metadata:` — Anthropic Complete Guide to Building
  Skills, 2026
- [SOURCED] SKILL.md body ≤ 500 lines is enforced as FAIL by the validator —
  developing-skills v2.0
- [GENERATED] The highest-value content in a retroactively-extracted skill is the
  Gotchas section — general steps are findable in docs, non-obvious constraints from
  real runs are not.
- [GENERATED] A description opening with a workflow summary sentence burns ~60–130
  chars of trigger space with zero activation benefit; "Use whenever" openers are
  denser triggers for the same character cost.

## COUNTEREXAMPLE

- A skill with a perfectly dense description can still fail to activate if the YAML
  frontmatter has a syntax error that prevents parsing.
- Eval-first authorship can overfit: a description tuned to 3 specific prompts may
  miss valid real-world variations.
- A "should NOT trigger" eval can pass (stays silent) even when the description is
  too broad — negative evals require actual adjacent prompts, not just different domains.

## CONTRADICTIONS

! "Read source fully before writing" vs. "skill should be created quickly at end of
  session" — tension when the conversation is long. Resolution: read the summary +
  primary output files; skip intermediate back-and-forth with no technical constraints.
! "Strip workflow summary from description" conflicts with the v1.0.0 description
  which included the core loop — that version was burning ~130 chars of trigger space
  on content that belongs in the body. v1.2.0 opens with "Use whenever" as canonical.
! v1.1.0 Gotcha #3 correctly identified the `metadata:` nesting rule while the
  skill's own frontmatter violated it at the top level. A skill can describe correct
  behavior without enforcing it on itself. Fixed in v1.2.0; checklist item 3 now
  explicitly audits the frontmatter.
