---
name: template-skill
description: Scaffold and create a new SKILL.md by copying this template, then customize the description, principles, intake, and workflow. Use when building a new skill from scratch — start here, generate the structure, and validate against `lib/skill_validator.py`. Triggers on: new skill, create skill, scaffold skill, build skill, design skill, skill template, skill boilerplate, copy template, starter skill.
---

# Template Skill — Replace with the Real Title

> **How to use this template:** Copy this folder under `_master-skills/<category>/<your-skill-slug>/`, rename it, then replace every section below. Keep the section names — the validator in `lib/skill_validator.py` looks for an h2 from `CORE_SECTION_NAMES` (e.g. `## Core Workflow`).

## Essential Principles

State the 3-6 non-negotiable rules that govern this skill. Each principle should:

1. **Be a complete sentence with a bold lead-in.** State the rule, then explain *why* in one line.
2. **Be actionable.** A reader should know whether they are violating it.
3. **Be specific to this skill.** Generic advice ("write clean code") belongs in a style guide, not here.
4. **Avoid restating what the description already says.** This section is about *how to behave*, not *what the skill does*.

## Intake

Describe what to confirm with the user before doing any work. Use a table when the skill has multiple deliverable types or scope modes.

| Request | Deliverable / Mode | Workflow |
|---|---|---|
| Example: short brief | 1-pager | `workflows/brief.md` |
| Example: full analysis | Detailed report | `workflows/report.md` |

**If the request is ambiguous:** state the exact clarifying question to ask.

## Core Workflow

The required section. List the numbered steps the skill executes. Include at least one code block or detailed numbered list — the validator requires concrete examples.

1. **Confirm scope** — restate what's being asked and the success criteria.
2. **Load any required references** from the Reference Index below.
3. **Do the work** — produce the deliverable.
4. **Self-check** against the Essential Principles before delivery.

```text
Example block — replace with a real example or template relevant to this skill.
Code blocks satisfy the validator's "concrete examples" requirement.
```

## Reference Index

| Reference | Purpose |
|-----------|---------|
| `references/example.md` | Replace with real reference files you create under `references/` |

## Workflows Index

| Workflow | Purpose |
|----------|---------|
| `workflows/example.md` | Replace with real workflow files you create under `workflows/` |

## Validator Checklist

Before you commit a new skill built from this template:

- [ ] Renamed the `name:` field to match the directory slug (lowercase-hyphenated, 3+ chars)
- [ ] Wrote a description that is 20-500 chars, has 2+ trigger verbs, and includes a "Use when…" phrase
- [ ] Replaced every placeholder section with skill-specific content
- [ ] Body is at least 50 lines and 500 characters (aim for 200+ lines for depth)
- [ ] Kept at least one `## h2` that matches `CORE_SECTION_NAMES` (Core Workflow, Instructions, Process, Quick Start, etc.)
- [ ] Included at least one code block or detailed numbered list
- [ ] Ran `python lib/skill_validator.py --skill <category>/<your-skill>` and it passed
