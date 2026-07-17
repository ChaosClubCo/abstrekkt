# Worked Examples — Capturing Workflows as Skills

Worked, illustrative examples moved out of SKILL.md for progressive disclosure. Standalone; no cross-links to other reference files.

## Worked extraction scenarios (was: Usage Examples)

## Usage Examples

**Example 1 — End of a technical workflow.**
User: "We just spent an hour getting this Three.js scene working. Turn this into a skill."
→ Read the conversation for CDN restrictions, required headers, geometry quirks,
   what failed and why. Extract as `building-threejs-scenes`. Write decision tree
   + working code patterns + gotchas. Non-obvious constraints are the highest-value
   content — everything else is scaffolding.

**Example 2 — Recurring operational workflow.**
User: "I run this marketing cadence every week and keep forgetting steps. Make this a skill."
→ Ask: what steps, where's the friction, what tools are involved. Write
   `running-weekly-marketing-cadence` with the checklist, tool sequence, and gotchas
   (e.g., "post LinkedIn before Tuesday, reach drops after").

**Example 3 — After a debugging session.**
User: "I just spent 2 hours on that Supabase RLS issue. Save this as a skill."
→ Extract the diagnosis path (what was checked, what the actual cause was), the fix,
   and the verification step. Write `debugging-supabase-rls-silent-blocks`.
   The Gotchas section IS the skill — everything else is scaffolding.

---

## Weak vs. pushy description example (was: Step 4)

**Weak:**
> Helps convert React components.

**Pushy:**
> Use whenever the user says "turn this into a live artifact", "convert to artifact",
> "make this a Cowork artifact" — even if they don't say "React" or "artifact".
> Also triggers on: artifact conversion, vanilla JS rewrite, strip React, remove Tailwind.

## Eval template + dogfooded eval scenarios (was: Step 5)

Template:

```
Should trigger:
1. [Exact phrase from user's real message]
2. [Casual variant]
3. [Domain-specific variant]

Should NOT trigger:
1. [Related but different task]
2. [Adjacent domain with its own skill]
```

Dogfood eval scenarios for THIS skill:

```
Should trigger:
1. "We just solved that n8n issue. Turn this into a skill."
2. "I keep doing this manually — can we make it a skill?"
3. "Capture the gotchas from this session before we close it out."
4. "I don't want to figure this out again. Save it."
5. "Add this to my skill library."

Should NOT trigger:
1. "Help me build a new skill from scratch." (→ skill-creator)
2. "How do skills work?" (→ developing-skills)
3. "Package my skill into a zip." (→ packaging-skills)
4. "Fix my broken SKILL.md." (→ auditing-and-rewriting-skills)
```

## Naming convention examples (was: Naming Conventions)

## Naming Conventions

```
capturing-workflows-as-skills         ✓  gerund, descriptive
workflow-capturer                     ✗  not gerund
capture-skill                         ✗  not gerund, too vague
converting-react-to-cowork-artifacts  ✓  specific, gerund
react-to-artifact                     ✗  not gerund
```

## SKILL.md template skeleton (was: Extraction Protocol, Step 3)

```yaml
---
name: gerund-verb-noun
description: >
  Use whenever [trigger scenario] — even if the user doesn't say
  [canonical term]. Also triggers on: [4-8 casual variants].
metadata:
  version: "1.0.0"
---

# [Title]

[2-sentence summary]

## TL;DR
[1-2 sentence core insight]

---

## Decision Tree
[flowchart covering the main branching logic]

---

## Usage Examples
[3 examples: User: "[exact phrase]" → steps → outcome]

---

## [Core workflow section(s)]
[Decision tables, code snippets, step-by-step procedures]

---

## Gotchas
[Numbered list of non-obvious failures]

---

## Self-Verification Checklist
[Numbered 0-indexed list]

---

## CLAIMS
## COUNTEREXAMPLE
## CONTRADICTIONS
```
