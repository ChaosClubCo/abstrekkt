# Skill Management

This document covers the lifecycle of skills in the Skills Library: adding new skills, updating existing ones, removing skills, and retiring skills that are no longer relevant.

## Skill File Structure

Every skill lives in a directory under `_master-skills/{category}/{slug}/`:

```
_master-skills/
  technical/
    api-development/
      SKILL.md           # Required: the skill definition
      references/        # Optional: supporting materials
        example.md
        template.yaml
```

### SKILL.md Format

Each SKILL.md file has two parts: YAML frontmatter and a markdown body.

```markdown
---
name: api-development
description: >
  Build, test, and document RESTful and GraphQL APIs. Use when designing
  new endpoints, troubleshooting integration issues, or generating
  OpenAPI specifications.
---

## Overview

Brief description of what this skill does and when to use it.

## Core Processes

Step-by-step instructions for the skill's primary workflow.

### Step 1: Requirements Gathering

Detailed instructions...

## Tools & Templates

Templates, code blocks, and reusable artifacts.

## Metrics

How to measure success.

## Common Pitfalls

Mistakes to avoid.

## Integration Points

How this skill connects to related skills.
```

### Frontmatter Rules

- **name**: Must be lowercase alphanumeric with hyphens only. Pattern: `[a-z0-9]+(-[a-z0-9]+)*`. Must match the directory name (the slug).
- **description**: 20-500 characters. Must contain at least one trigger verb (create, analyze, build, manage, optimize, etc.). Should explain when to use the skill.

### Body Requirements

- Minimum 50 lines (below this triggers a validation error)
- At least one `##` heading
- At least one core section (Overview, Core Processes, Workflow, Instructions, or equivalent)
- Concrete examples: code blocks or detailed numbered lists

---

## Adding a New Skill

### Step 1: Choose the Category

Select from the six categories:

| Category | Description | Skills |
|----------|-------------|--------|
| `ai-agents` | AI agent workflows, multi-agent patterns, LLM orchestration | 232 |
| `technical` | Software development, architecture, DevOps, testing | 127 |
| `strategy` | Business strategy, planning, analysis, decision-making | 59 |
| `creative` | Design, content creation, branding, UX | 40 |
| `operations` | Operational workflows, automation, process optimization | 25 |
| `industry` | Industry-specific regulations, compliance, domain knowledge | 25 |

### Step 2: Choose the Slug

Pick a lowercase, hyphenated name that is descriptive and unique across the library.

```
Good:  api-rate-limiting
Bad:   APIRateLimiting
Bad:   api_rate_limiting
Bad:   rate-limiting  (too generic, might collide)
```

Check for collisions against existing skills:

```bash
find _master-skills -maxdepth 2 -type d -name "*rate-limiting*"
```

If the same slug exists in another category, the pipeline will apply a dedup prefix (`{category}--{slug}`) during conversion. See [Slug Collision Reference](../07-reference/slug-collision-reference.md) for known collision groups.

### Step 3: Create the Directory and SKILL.md

```bash
mkdir -p _master-skills/technical/api-rate-limiting
```

Create `_master-skills/technical/api-rate-limiting/SKILL.md` with valid frontmatter and a complete body following the structure in the format section above.

### Step 4: Validate

Run the validator against the new skill:

```bash
export PYTHONIOENCODING=utf-8
python -m lib.skill_validator --skill technical/api-rate-limiting
```

The validator checks:

- Frontmatter completeness (name, description)
- Description quality (trigger verbs, "use when" phrases, length)
- Body length and structure (headings, core sections, examples)
- Structural quality (heading order, duplicates)
- Cross-references (if referenced skills exist)

Fix any errors (score penalties: -20 each) and warnings (score penalties: -5 each) before proceeding.

### Step 5: Run the Pipeline

```bash
python fix_skills.py
python fix_skills_structure.py
python fix_skills_pass3.py
python sync-skills.py --targets all --validate
python populate_all.py --phase all
```

Or run just the sync for a single skill to test:

```bash
python sync-skills.py --skill technical/api-rate-limiting --targets all
```

### Step 6: Verify Outputs

Check that the skill appears in all platform outputs:

```bash
# Claude
ls Claude/ClaudeSkills/skills/technical/api-rate-limiting/SKILL.md

# Gemini
ls Gemini/GeminiSkills/gems/technical/api-rate-limiting.json

# Codex (multiple files)
find Codex/CodexSkills -name "*api-rate-limiting*"

# Copilot
ls GithubCopilot/CopilotSkills/agent-skills/technical/api-rate-limiting/SKILL.md
ls GithubCopilot/CopilotSkills/custom-instructions/technical/api-rate-limiting.md
```

---

## Updating an Existing Skill

### Step 1: Edit the Master

All edits go to the master file in `_master-skills/{category}/{slug}/SKILL.md`. Never edit platform outputs directly -- they are generated files.

### Step 2: Validate

```bash
python -m lib.skill_validator --skill technical/api-development
```

### Step 3: Re-run the Pipeline

For a single skill:

```bash
python sync-skills.py --skill technical/api-development --targets all
```

For a full re-sync (if you edited multiple skills):

```bash
python sync-skills.py --targets all --validate
python populate_all.py --phase bundles
```

### Bulk Updates

To update all skills in a category (e.g., adding a new section):

```bash
# Validate the entire category first
python -m lib.skill_validator --category ai-agents

# Sync the category
python sync-skills.py --category ai-agents --targets all
```

---

## Removing a Skill

### Step 1: Delete the Master Directory

```bash
rm -rf _master-skills/technical/obsolete-skill
```

### Step 2: Run Cleanup

```bash
python populate_all.py --phase cleanup
```

This removes the skill from all platform outputs, bundles, and variant directories.

### Step 3: Verify Removal

```bash
find . -name "*obsolete-skill*" -not -path "./.git/*"
```

Nothing should match.

---

## Retiring a Skill

Retiring is softer than removing. A retired skill stays in the master directory but is excluded from bundles and curated outputs.

### Option 1: Move to a Retired Directory

```bash
mkdir -p _master-skills/_retired
mv _master-skills/technical/legacy-api-tool _master-skills/_retired/
```

The pipeline only scans the six category directories, so skills in `_retired/` are ignored.

### Option 2: Add a Retirement Marker

Add a frontmatter field to mark the skill as retired:

```yaml
---
name: legacy-api-tool
description: ...
status: retired
---
```

Note: The current pipeline does not filter on `status`. This is a convention for human readers. To fully exclude the skill, use Option 1.

---

## Moving a Skill Between Categories

### Step 1: Move the Directory

```bash
mv _master-skills/technical/workflow-optimizer _master-skills/operations/workflow-optimizer
```

### Step 2: Run the Full Pipeline

```bash
python fix_skills.py
python sync-skills.py --targets all
python populate_all.py --phase all
```

The pipeline derives the category from the directory path, so moving the directory is sufficient.

### Step 3: Verify

Check that the skill appears under the new category in all outputs and no longer appears under the old category.

---

## Renaming a Skill

Renaming requires updating both the directory name and the frontmatter.

### Step 1: Rename the Directory

```bash
mv _master-skills/technical/old-name _master-skills/technical/new-name
```

### Step 2: Update Frontmatter

Edit `_master-skills/technical/new-name/SKILL.md` and change the `name` field:

```yaml
---
name: new-name
description: ...
---
```

### Step 3: Run Pipeline and Cleanup

```bash
python fix_skills.py
python sync-skills.py --targets all
python populate_all.py --phase cleanup
python populate_all.py --phase bundles
```

The cleanup phase removes outputs for the old slug. The bundles phase regenerates with the new slug.

---

## Adding Reference Files

For skills that need supporting materials (examples, templates, data files):

```bash
mkdir -p _master-skills/technical/api-development/references
```

Place files in the `references/` subdirectory. The validator will recognize this directory and suppress warnings about long skill bodies (the 500-line threshold for recommending a references directory).

Reference files are not automatically converted to platform outputs. They serve as supplementary material for skill authors and users reading the master version.

---

## Validation Quick Reference

```bash
# Validate a single skill
python -m lib.skill_validator --skill technical/api-development

# Validate all skills in a category
python -m lib.skill_validator --category ai-agents

# Validate everything
python -m lib.skill_validator --all

# Show only skills below a score threshold
python -m lib.skill_validator --all --min-score 70
```

Quality score starts at 100, with penalties and bonuses:

| Factor | Points |
|--------|--------|
| Each error | -20 |
| Each warning | -5 |
| Has code blocks or detailed numbered lists | +10 |
| Has templates/frameworks section | +10 |
| Has output format section | +5 |
| **Range** | **0-100** |

---

## Related Documents

- [Pipeline Operations](pipeline-operations.md) -- full pipeline walkthrough
- [Quality Control](quality-control.md) -- validator and enricher details
- [Glossary](../07-reference/glossary.md) -- terminology definitions
