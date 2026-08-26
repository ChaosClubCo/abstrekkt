# Architecture

This document describes the internal architecture of the Skills Library pipeline, including data flow, module responsibilities, converter design, and key technical decisions.

## Table of Contents

- [System Overview](#system-overview)
- [Pipeline Flow](#pipeline-flow)
- [Data Model](#data-model)
- [Shared Libraries](#shared-libraries)
- [Converter Architecture](#converter-architecture)
- [Standalone Scripts vs sync-skills.py](#standalone-scripts-vs-sync-skillspy)
- [populate_all.py Phases](#populate_allpy-phases)
- [Cross-Cutting Concerns](#cross-cutting-concerns)
- [Key Design Decisions](#key-design-decisions)

---

## System Overview

The Skills Library is a conversion pipeline that transforms 514 platform-neutral master skill definitions into platform-specific formats for 4 AI assistant platforms:

- **Claude** (Anthropic) -- CLI skills, Desktop plugins, Web project instructions
- **Gemini** (Google) -- Gem JSON configs, CLI skills, Studio prompts, Agent configs
- **Codex** (OpenAI) -- Responses API JSON, GPT Builder, Agent Builder, system prompts
- **Copilot** (GitHub) -- Custom instructions, agent skills, CLI skills

The pipeline produces 15,000+ output files from 514 master SKILL.md sources.

---

## Pipeline Flow

The end-to-end pipeline executes in three stages:

```
                    STAGE 1                STAGE 2               STAGE 3
                Quality Fixes          Conversion             Population
               +--------------+     +----------------+     +----------------+
               |              |     |                |     |                |
 _master-      | fix_skills_  |     |  sync-skills   |     | populate_all   |
 skills/  -->  | unified.py   | --> |  .py           | --> | .py            |
 514 SKILL.md  |              |     |                |     |                |
               | Pass 1: FM   |     | GeminiConv     |     | Phase 3: Quality
               | Pass 2: Hdgs |     | CopilotConv    |     | Phase 1: Bundles
               | Pass 3: Slugs|     | CodexConv      |     | Phase 2: Variants
               +--------------+     | ClaudeConv     |     | Phase 4: Cleanup
                                    | CLIConv        |     +----------------+
                                    +----------------+
                                           |
                                    +------+------+------+------+
                                    |      |      |      |      |
                                  Claude Gemini Codex  Copilot  CLI
                                  Skills  Gems   JSON   Instr  Skills
```

### Stage 1: Quality Fixes (`fix_skills_unified.py`)

Three passes run in sequence on each master SKILL.md, reading once and writing once:

| Pass | Purpose | Key Operations |
|------|---------|----------------|
| 1 | Frontmatter repair | Add missing `name`/`description`, inject trigger verbs, append "Use when" phrases |
| 2 | Structure normalization | Promote `#` headings to `##`, insert workflow/instruction section headings |
| 3 | Slug/description cleanup | Slugify names to lowercase-hyphenated, trim descriptions to 490 chars at sentence boundary |

### Stage 2: Conversion (`sync-skills.py`)

The central multi-platform sync engine. Parses each master skill via `SkillParser`, enriches with metadata, then dispatches to 5 converter classes based on `--targets`:

| Target | Converter Class | Output Format |
|--------|----------------|---------------|
| `gemini` | `GeminiConverter` | `.gem.json` with model, safety, grounding |
| `copilot` | `CopilotConverter` | Markdown with YAML frontmatter (applyTo, scope, priority) |
| `codex` | `CodexResponsesConverter` | `.response.json`, `.gpt.json`, system-prompt `.txt` |
| `claude` | `ClaudeConverter` | SKILL.md with enriched frontmatter (model, tags, tools, complexity) |
| `cli` | `CLISkillsConverter` | Platform-specific CLI skill files for all 4 platforms |

### Stage 3: Population (`populate_all.py`)

The top-level orchestrator that generates bundles, thin variants, and performs cleanup.

---

## Data Model

### Master SKILL.md Format

```yaml
---
name: skill-slug-name
description: Action-oriented description. Use when [trigger condition].
---

## Overview
[What this skill does and why it exists]

## When to Use
[Bullet list of trigger conditions]

## Core Processes
[Step-by-step workflows and procedures]

## Tools & Templates
[Frameworks, templates, checklists]

## Metrics
[KPIs and success measures]

## Common Pitfalls
[Anti-patterns and mistakes to avoid]

## Integration Points
[How this skill connects to other skills/systems]
```

### Skill Identity

Each skill is uniquely identified by:

- **Slug**: The directory name under `_master-skills/{category}/{slug}/` (lowercase-hyphenated)
- **Category**: One of 6 categories (`ai-agents`, `technical`, `strategy`, `creative`, `operations`, `industry`)
- **Effective slug**: For 5 cross-category collision groups, a dedup prefix `{category}--{slug}` is applied

### Parsed Skill Data Structure

After `SkillParser.parse()`, each skill is a dictionary:

```python
{
    "name": "api-design-principles",    # from frontmatter
    "description": "...",               # from frontmatter
    "body": "## Overview\n...",         # full markdown body
    "category": "technical",            # from directory path
    "slug": "api-design-principles",    # from directory name
    "path": "/path/to/SKILL.md",        # absolute file path
    "complexity": "moderate",           # estimated by platform_tuning
    "version": "1.0.0",                 # from enrichment
    "tags": ["api", "design", ...],     # auto-generated by enricher
    "related_skills": [...],            # detected by enricher
    "token_estimate": 2500,             # estimated by enricher
}
```

---

## Shared Libraries

All shared modules live in `lib/` and are imported by pipeline scripts with graceful degradation (scripts work with reduced functionality if a lib module is unavailable).

### lib/config.py

**Purpose**: Single source of truth for all shared constants.

| Constant | Description |
|----------|-------------|
| `MASTER_DIR` | Path to `_master-skills/` |
| `BASE_DIR` | Project root |
| `CATEGORIES` | List of 6 category names |
| `CATEGORY_TEMPERATURES` | Default temperature per category (e.g., technical=0.3, creative=0.7) |
| `GEMINI_MODELS` | Model map by complexity (`simple`/`moderate`/`complex` -> `gemini-2.5-flash`/`gemini-2.5-pro`) |
| `CODEX_MODELS` | Model map by complexity (`gpt-4.1-mini`/`gpt-4.1`/`gpt-4.1`) |
| `CODEX_TOOLS` | Tools assignment per category (code_interpreter, file_search) |
| `GEMINI_SAFETY_SETTINGS` | 5 harm categories with `BLOCK_MEDIUM_AND_ABOVE` threshold |
| `JUNK_SLUGS` | Set of known garbage skill slugs to filter out |
| `TRIGGER_VERBS`, `USE_WHEN_MAP`, `VERB_MAP` | Quality fix constants |
| `CORE_SECTION_NAMES`, `WORKFLOW_PATTERNS` | Section detection patterns |
| `PLATFORM_OUTPUTS` | Map of platform names to output directory paths |

### lib/skill_parser.py

**Purpose**: Canonical YAML frontmatter parser with skill discovery.

Key functions:

- `parse_frontmatter(text)` -- Parse YAML frontmatter using `yaml.safe_load` with regex fallback
- `parse_skill_file(path)` -- Parse a single SKILL.md into structured dict
- `discover_all_skills(master_dir)` -- Walk all categories, find all SKILL.md files, detect slug collisions, apply dedup prefixes
- `get_effective_slug(skill)` -- Return `_dedup_slug` if set, else `slug`

Collision detection: Builds a frequency map of slugs across categories. Any slug appearing in 2+ categories gets a `_dedup_slug` field set to `{category}--{slug}`.

### lib/platform_tuning.py

**Purpose**: Generate platform-specific settings based on skill metadata.

Key functions:

- `estimate_complexity(skill)` -- Weighted scoring based on body length, section count, and tag count
- `get_gemini_settings(skill)` -- Returns model, temperature, safety settings, max output tokens
- `get_codex_settings(skill)` -- Returns model, temperature, tools list
- `get_copilot_settings(skill)` -- Returns applyTo patterns, scope, priority
- `get_claude_settings(skill)` -- Returns model, MCP tool hints, max tokens

All functions use `CATEGORY_TEMPERATURES` from config for base temperature, adjusted by complexity.

### lib/metadata_enricher.py

**Purpose**: Auto-enrich skill data with derived metadata.

Key functions:

- `auto_tag(skill)` -- Extract tags from body content using keyword matching
- `detect_related_skills(skill, all_skills)` -- Find related skills by tag overlap
- `estimate_complexity(skill)` -- 3-factor average (body length, sections, tags)
- `enrich_skill(skill)` -- Apply all enrichment in one call
- `enrich_all(skills)` -- Batch enrichment with cross-referencing

### lib/skill_validator.py

**Purpose**: Quality scoring and validation rules.

Key class: `SkillValidator` with methods:

- `validate(skill)` -- Returns `ValidationResult` dataclass with `passed`, `errors`, `warnings`, `score`
- `validate_all(skills)` -- Batch validation with summary statistics

Scoring: Base 100, -20 per error, -5 per warning, +10 for 5+ sections, +10 for 3+ tags, +5 for description quality. Clamped to 0-100.

### lib/logger.py

**Purpose**: Colored terminal output and error tracking.

Key exports:

- `setup_logger(name, verbose)` -- Configure logger with `ColoredFormatter`
- `create_error_tracker()` -- Returns `ErrorTracker` instance for counting errors/warnings/successes
- `get_logger(name)` -- Get or create a named logger

---

## Converter Architecture

### Converter Class Pattern

Each converter in `sync-skills.py` follows the same interface:

```python
class PlatformConverter:
    def __init__(self, output_dir: Path):
        self.output_dir = output_dir

    def convert(self, skill: Dict, *, dry_run: bool = False) -> List[Path]:
        """Convert a skill to platform format. Returns output paths."""
        # 1. Get platform-tuned settings
        settings = get_platform_settings(skill)

        # 2. Wrap body with platform template
        wrapped_body = _wrap_body(skill['body'], "platform_template")

        # 3. Build output structure (JSON, Markdown, etc.)
        output = build_output(skill, settings, wrapped_body)

        # 4. Write to output_dir/{category}/{slug}.ext
        if not dry_run:
            write_output(output)

        return [output_path]
```

### SkillsSyncer Orchestrator

`SkillsSyncer` ties everything together:

1. Discovers all skills via `SkillParser`
2. Instantiates requested converter classes
3. Iterates skills, calling `converter.convert()` for each
4. Optionally validates results via `SkillValidator`
5. Prints summary statistics

---

## Standalone Scripts vs sync-skills.py

### Historical Context

The project originally had independent converter scripts (`convert_to_gems.py`, `convert_to_codex_responses.py`, `convert_to_cli_skills.py`, `convert-to-copilot.js`). Later, `sync-skills.py` was created with converter classes that reimplemented the same logic with better integration.

### Current State

Standalone Python converters are now **deprecated thin wrappers** that delegate to `sync-skills.py`'s converter classes:

```
convert_to_gems.py         --> sync-skills.py --targets gemini
convert_to_codex_responses.py --> sync-skills.py --targets codex
convert_to_cli_skills.py   --> sync-skills.py --targets cli
```

Each wrapper:
1. Emits a `DeprecationWarning`
2. Attempts to import and delegate to the `sync-skills.py` converter class
3. Falls back to its own inline logic if delegation fails (e.g., custom flags like `--model-override`)

`convert-to-copilot.js` is fully deprecated with no delegation (it requires Node.js while the Python `CopilotConverter` handles everything).

---

## populate_all.py Phases

Phase ordering is critical -- quality fixes must run before conversion to ensure clean metadata:

| Execution Order | Phase | Purpose |
|----------------|-------|---------|
| 1st | Phase 3: Quality | Run `fix_skills_unified.py` on all masters, then `sync-skills.py` for base conversion |
| 2nd | Phase 1: Bundles | Populate 18 bundle directories across Gemini (7), Copilot (6), Codex (5) |
| 3rd | Phase 2: Variants | Generate thin variants (Copilot Frontier, Gemini Agents, Gemini Studio, Claude Desktop, Claude Web) |
| 4th | Phase 4: Cleanup | Remove junk files (undefined.gem.json, template-skill, etc.) from output directories |

---

## Cross-Cutting Concerns

### Encoding

- All `read_text()` calls use `encoding='utf-8', errors='replace'` to handle non-UTF-8 bytes gracefully
- `PYTHONIOENCODING=utf-8` must be set on Windows to prevent cp1252 console encoding errors
- BOM stripping (`.lstrip('\ufeff')`) applied after file reads where needed
- `json.dumps()` uses `ensure_ascii=False` to preserve Unicode characters

### Slug Collision Dedup

5 skill slugs exist in 2 categories simultaneously:

| Slug | Categories |
|------|-----------|
| `inventory-management` | ai-agents, operations |
| `packaging-design` | ai-agents, creative |
| `podcast-production` | ai-agents, creative |
| `presentation-design` | ai-agents, creative |
| `vendor-management` | operations, strategy |

Resolution: `discover_all_skills()` detects duplicates and sets `_dedup_slug = "{category}--{slug}"`. All output paths use `get_effective_slug()` which returns the dedup slug when set.

### Windows Compatibility

- Forward slashes in `Path()` operations (works on Windows Python)
- `\r\n` normalization in JavaScript parsers (`.replace(/\r\n/g, '\n')`)
- `.editorconfig` enforces LF line endings for new files
- `errors='replace'` prevents crashes on cp1252-encoded files

---

## Key Design Decisions

### Why Directory-Name Slugs

**Decision**: Use `file_path.parent.name` (the directory name) as the skill slug, not `slugify(frontmatter_name)`.

**Rationale**: The old approach of slugifying the frontmatter `name` field caused ~13 skills to silently overwrite each other because different skills could slugify to the same string. Directory names are guaranteed unique within a category by the filesystem.

### Why Category Dedup Prefix

**Decision**: Use `{category}--{slug}` for cross-category collision handling instead of alternative approaches (numbering, hashing, namespacing).

**Rationale**: The double-dash prefix is human-readable, sorts correctly, and preserves the original slug as a substring. It only affects 10 out of 514 skills (5 collision pairs).

### Why Phase Ordering Matters

**Decision**: Quality fixes (Phase 3) execute before bundle/variant generation (Phases 1-2).

**Rationale**: If bundles are generated before quality fixes, skills with missing frontmatter or broken descriptions propagate bad data into bundle outputs. Fixing first ensures all downstream outputs start from clean data.

### Why Graceful Degradation for lib/ Imports

**Decision**: All scripts use `_HAS_*` flags with inline fallbacks for `lib/` module imports.

**Rationale**: Allows standalone scripts to work even if `lib/` modules are missing or broken, maintaining backward compatibility during the transition to centralized modules.

### Why Deprecated (Not Deleted) Standalone Scripts

**Decision**: Keep standalone converter scripts with deprecation warnings rather than deleting them.

**Rationale**: Existing CI/CD workflows and developer muscle memory may reference them. The thin-wrapper approach means they produce identical output to `sync-skills.py` while printing migration guidance.
