---
name: writing-workflow-tutorials
description: >
  Writes step-by-step workflow tutorials for FlashFusion: automation walkthroughs,
    AI tool setup guides, and reproducible workflows for newsletter creators.
    Covers tutorial structure, tool-specific patterns, and complexity calibration.
    Activates when writing a workflow tutorial, creating a how-to guide, building
    a step-by-step walkthrough for FlashFusion readers, or producing the Workflow
    of the Week section. Also triggers on: write a tutorial, how-to guide, workflow
    walkthrough, step-by-step guide, workflow of the week, set up this tool,
    automation tutorial.
metadata:
  version: "1.0.0"
  category: newsletter-content
  brand: flashfusion
---

# Writing Workflow Tutorials — FlashFusion How-To System

Tutorials that readers can complete in the same session they read them.

## Quick-Start Decision Tree

```
Tutorial type?
  ├─ Quick workflow (5–10 steps) ── Newsletter section length; ≤400 words
  ├─ Deep-dive workflow ────────── Full tutorial; 600–900 words + screenshots
  ├─ Automation setup ──────────── n8n/Zapier/Make specific; include JSON/template
  ├─ AI tool configuration ─────── Setup + prompt configuration + test run
  └─ Integration tutorial ──────── Connect two tools; prerequisites → steps → verify
```

---

## Tutorial Structure Template

```
WORKFLOW OF THE WEEK: [Title]
Time to implement: [X minutes]
Tools needed: [List exactly]
Difficulty: [Beginner / Intermediate / Advanced]

WHAT YOU'LL BUILD
[1–2 sentences: the specific outcome, not the general benefit]

STEPS
1. [Clear imperative instruction]
   → [Expected result or what to look for]
2. [Next step]
   → [Expected result]
...

TEST IT
[How to verify the workflow worked — specific observable outcome]

VARIATIONS
[1–2 ways to extend or adapt for different use cases]
```

---

## Usage Examples

**Example 1 — Claude research workflow**
```
WORKFLOW: AI-Assisted Newsletter Research Brief
Time: 20 minutes setup + 10 minutes/week
Tools: Claude API (or claude.ai), Notion
Difficulty: Beginner

WHAT YOU'LL BUILD
A repeatable research process that extracts creator angles from 5–10 articles
in under 10 minutes, outputting a structured brief ready for drafting.

STEPS
1. Open a new Claude conversation (claude.ai works; API gives more control)
   → You'll use this as your research workspace for the session

2. Paste this system prompt at the start of the conversation:
   "You are helping me research a creator-tech newsletter. For each article
    I share, extract: (1) the specific change or update, (2) why a solo
    newsletter creator should care, (3) one action they can take immediately,
    (4) relevance score 1-5."

3. Paste each article you want to evaluate (one per message)
   → Claude returns a structured evaluation for each

4. At the end: "Summarize the top 3 items by score as a research brief"
   → Brief is ready for drafting

TEST IT
Share 3 articles. Verify you get scores + creator angles for each.
If output is too generic, add "assume reader is a solo newsletter creator
writing about AI tools" to the system prompt.
```

**Example 2 — Complexity calibration**
Beginner: Step count ≤8; no code; free tools preferred; 15 minutes max
Intermediate: Up to 15 steps; may include paid tools; code blocks with explanation
Advanced: 15+ steps; API access required; assume technical literacy

**Example 3 — n8n workflow tutorial**
For automation tutorials, always include:
- The workflow JSON (importable)
- Credential setup instructions
- A test case with expected output
- Common error and fix ("if you see X error, the fix is Y")

---

## Tutorial Quality Standards

**Tested requirement:** Every tutorial must be tested before publishing.
"I think this works" is not sufficient. Run the workflow, verify the output,
note the actual time it took.

**Screenshot standard:** If including screenshots, use actual tool output
(not mockups). Dated screenshots: note the version/date since UIs change.

---

## Quality Gates

- [ ] Tutorial tested with the exact steps as written
- [ ] "Time to implement" is accurate (not aspirational)
- [ ] Tools list includes all required tools (no hidden prerequisites)
- [ ] Test/verify step included (readers know when they've succeeded)
- [ ] Beginner/Intermediate/Advanced calibrated correctly

---

## CLAIMS
- Including a "TEST IT" step with a specific observable outcome reduces "I tried this and it didn't work" reader complaints because the verification step surfaces setup issues

## COUNTEREXAMPLE
- Over-detailed tutorials (30+ steps) lose readers mid-way — split complex workflows into Part 1/Part 2 across two issues rather than publishing a single 1,000-word walkthrough

## CONTRADICTIONS
- "Test before publishing" vs. "cover new tools quickly" — for brand-new tools (day-one releases), label as "Initial walkthrough — not yet fully tested" and update in the next issue
