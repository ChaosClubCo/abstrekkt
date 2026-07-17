# Quality Control

This document covers the three quality systems in the Skills Library: the 3-pass fix pipeline, the skill validator, and the metadata enricher.

## Overview

Quality control operates at three levels:

1. **Fix Pipeline** (`fix_skills.py`, `fix_skills_structure.py`, `fix_skills_pass3.py`) -- automated corrections applied to all skills
2. **Validator** (`lib/skill_validator.py`) -- validation checks with scoring, run on demand
3. **Enricher** (`lib/metadata_enricher.py`) -- computed metadata added during conversion

---

## The 3-Pass Fix Pipeline

The fix pipeline runs before conversion and makes automated corrections to SKILL.md files in `_master-skills/`.

### Pass 1: `fix_skills.py` -- Frontmatter Fixes

Fixes applied:

- **Missing frontmatter**: Adds `---` delimiters and `name`/`description` fields
- **Missing name**: Sets `name` to the directory slug
- **Missing description**: Generates a default description from the skill name and category
- **Missing trigger verbs**: Appends category-specific verbs from `VERB_MAP` in `lib/config.py`
- **Missing "Use when" context**: Appends a phrase from `USE_WHEN_MAP` in `lib/config.py`
- **Overly long descriptions**: Trims to 500 characters

Category-specific verb suggestions (from `lib/config.py`):

| Category | Default Verbs |
|----------|--------------|
| technical | build, debug, optimize, implement, deploy |
| strategy | analyze, plan, evaluate, develop, optimize |
| creative | design, create, review, produce, refine |
| industry | manage, audit, monitor, implement, evaluate |
| operations | automate, manage, optimize, monitor, streamline |
| ai-agents | configure, build, automate, integrate, orchestrate |

```bash
python fix_skills.py
```

### Pass 2: `fix_skills_structure.py` -- Heading and Section Fixes

Fixes applied:

- **Missing `##` headings**: Adds an `## Overview` heading if none exists
- **Heading hierarchy violations**: Fixes `###` appearing before any `##`
- **Missing core sections**: Checks for at least one heading matching `CORE_SECTION_NAMES` from `lib/config.py` (e.g., "Core Workflow", "Instructions", "Core Processes", "Quick Start", "Overview")
- **Heading formatting**: Normalizes spacing around headings

```bash
python fix_skills_structure.py
```

### Pass 3: `fix_skills_pass3.py` -- Slug and Description Cleanup

Fixes applied:

- **Invalid slug names**: Replaces the `name` frontmatter field with the directory name if it does not match the pattern `[a-z0-9]+(-[a-z0-9]+)*`
- **Junk skills**: Removes skills whose slugs match `JUNK_SLUGS` in `lib/config.py` (e.g., `undefined`, `unnamed`, `template-skill`, `test-skill`)
- **Description trimming**: Final pass to ensure descriptions are within the 20-500 character range

```bash
python fix_skills_pass3.py
```

### Running All Three Passes

```bash
export PYTHONIOENCODING=utf-8
python fix_skills.py && python fix_skills_structure.py && python fix_skills_pass3.py
```

---

## The Skill Validator

Module: `lib/skill_validator.py`

The validator checks skills against quality standards and produces a numeric score. It does not modify files.

### Validator Class: `SkillValidator`

The `SkillValidator` class has five validation methods, each returning a list of issue strings. Issues prefixed with `[WARN]` are warnings; all others are errors.

#### `validate_frontmatter(skill_data)`

Checks:

- `name` field is present and matches `[a-z0-9]+(-[a-z0-9]+)*`
- `description` field is present
- Description length is 20-500 characters
- Description contains at least one trigger verb from `TRIGGER_VERBS` (44 verbs including: create, analyze, build, manage, optimize, generate, design, develop, implement, configure, deploy, automate, review, audit, plan, monitor, debug, test, transform, validate, migrate, integrate, document, evaluate, refactor)

#### `validate_body(skill_data)`

Checks:

- Line count >= 50 (error if below)
- Line count < 200 (warning to consider expanding)
- Line count <= 2000 (error if above)
- At least one `##` heading exists
- At least one core section heading exists (from `CORE_SECTION_NAMES`)
- Concrete examples present (code blocks or detailed numbered lists with 20+ character items)
- Body is not a stub (fewer than 500 characters)

#### `validate_structure(skill_data)`

Checks:

- Bodies over 500 lines without a `references/` directory (warning)
- Duplicate content blocks (paragraphs over 80 characters that appear more than once)
- Heading order (`###` must not appear before any `##`)

#### `validate_description_quality(description)`

Checks:

- At least 2 trigger verbs (warning if fewer)
- Contains a "when to use" indicator (warning if missing): phrases like "use when", "use for", "ideal for", "helpful for", "designed for", "when you need"
- No boilerplate text: "this skill does things", "a general purpose skill", "use this for everything", "does stuff", "a skill for doing things"

#### `validate_cross_references(skill_data, all_skills)`

Checks:

- Markdown links to sibling directories (`[name](../other-skill/)`) reference existing skills
- Text references (`See: skill-name`, `Related skill: skill-name`) reference existing skills
- Only validates hyphenated slugs and names longer than 3 characters
- Filters out common English words and directory names

### Quality Scoring

The `calculate_score()` method produces a 0-100 score:

| Factor | Points |
|--------|--------|
| Starting score | 100 |
| Each error | -20 |
| Each warning | -5 |
| Has code blocks | +10 |
| Has detailed numbered lists (if no code blocks) | +10 |
| Has a templates/frameworks section heading | +10 |
| Has an output format section heading | +5 |
| **Clamped range** | **0-100** |

A skill passes validation if it has zero errors (warnings do not cause failure).

### CLI Usage

```bash
# Single skill
python -m lib.skill_validator --skill technical/api-development

# Entire category
python -m lib.skill_validator --category ai-agents

# All skills
python -m lib.skill_validator --all

# Only show skills below a threshold
python -m lib.skill_validator --all --min-score 70
```

Output includes a colored terminal table showing skill path, score, pass/fail status, error count, and warning count. Skills are sorted by score ascending (worst first).

### Batch Validation: `validate_all()`

The `validate_all(master_dir)` function validates every SKILL.md under the given directory and returns a summary dict:

```python
{
    "total": 508,
    "passed": 490,
    "failed": 18,
    "average_score": 82.3,
    "skills_by_score": [("path/to/skill", 45), ...],  # sorted ascending
    "common_issues": Counter({"issue description": count, ...}),
    "results": [ValidationResult, ...],
}
```

---

## The Metadata Enricher

Module: `lib/metadata_enricher.py`

The enricher adds computed metadata fields to skill data during conversion. It does not modify master files.

### `auto_tag(skill_data)`

Generates tags from three sources:

1. **Category**: The skill's category becomes a tag
2. **Name parts**: The skill name is split on hyphens; each part over 2 characters becomes a tag
3. **Domain keywords**: The body is scanned for 20 domain keywords: testing, deployment, security, data, frontend, backend, devops, design, marketing, finance, compliance, automation, integration, analytics, documentation, architecture, performance, monitoring, workflow, collaboration

Returns: A sorted, deduplicated list of lowercase tag strings.

### `detect_related_skills(skill_data, all_skill_names)`

Finds up to 5 related skills using three signals:

| Signal | Weight |
|--------|--------|
| Body mentions (skill name appears in body text) | 3.0 |
| Tag overlap (shared tags between skills) | 1.0 per shared tag |
| Category proximity (category name in other skill's tags) | 0.5 |

Returns: Up to 5 skill names sorted by relevance score descending.

### `assess_platform_capabilities(skill_data)`

Evaluates what each platform can leverage from a skill based on keyword detection:

**Gemini capabilities**: grounding, code_execution, multimodal, vertex_ai

**Codex capabilities**: code_interpreter, web_search, file_search, function_calling

**Copilot capabilities**: workspace_context, terminal_access, file_patterns, chat_participants

**Claude capabilities**: mcp_tools, subagents, artifacts, long_context

### `estimate_complexity(skill_data)`

Uses a multi-factor scoring approach (same function as in `lib/platform_tuning.py`):

- Line count: simple (<100), moderate (100-300), complex (>300)
- Section count: bonus for 5+ and 10+ headings
- Code blocks, templates, and framework references: bonus for each

Returns: `"simple"`, `"moderate"`, or `"complex"`.

### `enrich_skill(skill_data, all_skill_names)`

Main entry point that combines all enrichment functions. Adds these computed fields to the skill dict:

- `tags` -- auto-generated tags
- `complexity` -- simple/moderate/complex
- `token_estimate` -- estimated token count (body length / 4)
- `related_skills` -- up to 5 related skill names
- `platform_capabilities` -- per-platform capability flags
- `section_count` -- number of markdown headings
- `code_block_count` -- number of fenced code blocks

### CLI Usage

```bash
# Enrich a single skill
python -m lib.metadata_enricher --skill technical/api-development

# Enrich all skills
python -m lib.metadata_enricher --all

# Export enriched metadata to JSON
python -m lib.metadata_enricher --export enriched_metadata.json
```

---

## Common Quality Issues and Fixes

### Low Scores (Below 50)

Typical causes:

- Missing frontmatter fields (-20 per missing field)
- Description too short or missing trigger verbs (-20)
- Body too short or missing headings (-20)
- No code blocks or examples (-10 implicitly, via missing bonus)

Fix: Run the 3-pass fix pipeline first, then manually edit remaining issues.

### Warnings About Short Bodies

Skills with 50-200 lines get a warning. To resolve:

- Add more detailed step-by-step instructions
- Include code examples or templates
- Add a Common Pitfalls or Metrics section

### Duplicate Content Blocks

The structure validator flags paragraphs (over 80 characters) that appear more than once. Common cause: copy-paste errors between similar skills. Fix by removing the duplicate paragraphs.

### Missing Cross-References

The cross-reference validator warns when a skill references another skill that does not exist. This often means:

- The referenced skill was renamed or removed
- The reference has a typo in the slug

Fix by updating or removing the invalid reference.

---

## Quality Control Workflow

Recommended workflow for maintaining quality across the library:

```bash
export PYTHONIOENCODING=utf-8

# 1. Run the fix pipeline
python fix_skills.py
python fix_skills_structure.py
python fix_skills_pass3.py

# 2. Validate everything
python -m lib.skill_validator --all --min-score 70

# 3. Fix skills below threshold manually
# (edit the SKILL.md files reported by the validator)

# 4. Re-validate to confirm fixes
python -m lib.skill_validator --all --min-score 70

# 5. Sync and populate
python sync-skills.py --targets all --validate
python populate_all.py --phase all
```

---

## Related Documents

- [Pipeline Operations](pipeline-operations.md) -- full pipeline walkthrough
- [Skill Management](skill-management.md) -- adding and updating skills
- [Config Reference](../07-reference/config-reference.md) -- all configuration constants
