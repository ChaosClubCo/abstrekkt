# Skills Library -- Development & Contributing Guide

This guide covers everything needed to set up a development environment,
create or modify skills, run the conversion pipeline, and contribute
changes back to the project.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Setup](#2-setup)
3. [Project Layout](#3-project-layout)
4. [Creating a New Skill](#4-creating-a-new-skill)
5. [Modifying Existing Skills](#5-modifying-existing-skills)
6. [Adding a New Platform](#6-adding-a-new-platform)
7. [Running the Pipeline](#7-running-the-pipeline)
8. [Testing](#8-testing)
9. [Encoding and Windows Notes](#9-encoding-and-windows-notes)
10. [Slug Collision Handling](#10-slug-collision-handling)
11. [Common Issues and Troubleshooting](#11-common-issues-and-troubleshooting)
12. [Code Style](#12-code-style)
13. [Validation and Quality](#13-validation-and-quality)

---

## 1. Prerequisites

| Dependency | Minimum Version | Purpose |
|------------|-----------------|---------|
| Python | 3.8+ | Pipeline scripts, converters, validators |
| Node.js | 16+ | `convert-to-copilot.js`, universal adapters |
| PyYAML | 6.0+ | YAML frontmatter parsing (`yaml.safe_load`) |
| pytest | 7.0+ | Running the test suite |
| Git | 2.30+ | Version control |

### Platform-specific notes

**Windows** -- Most development happens on Windows. All Python scripts use
`encoding="utf-8"` and `errors="replace"` for file I/O. Set the environment
variable `PYTHONIOENCODING=utf-8` before running any script to avoid cp1252
codec errors in terminal output. See [Section 9](#9-encoding-and-windows-notes)
for details.

**macOS / Linux** -- No special configuration needed. UTF-8 is the default
encoding on these platforms. Line endings are normalized to LF by the
`.editorconfig`.

---

## 2. Setup

### Clone the repository

```bash
git clone <repo-url> Skills
cd Skills
```

### Install Python dependencies

```bash
pip install -r requirements.txt
```

The only runtime Python dependency is `PyYAML>=6.0`. For testing, also
install pytest:

```bash
pip install pytest
```

### Install Node dependencies (optional, for Copilot converter)

```bash
npm install   # only needed if package.json exists at root
```

### Verify the setup with a dry run

```bash
# Validate all master skills without writing any files
python fix_skills_unified.py --dry-run --all --verbose

# Confirm the parser can discover all 508 skills
python -c "from lib.skill_parser import _test_parser; _test_parser()"
```

Expected output from `_test_parser()`:

```
Found 508 skills
10 skills have dedup prefix
```

---

## 3. Project Layout

```
Skills/
|-- _master-skills/              # 508 canonical SKILL.md files (source of truth)
|   |-- ai-agents/               # 232 skills  (AI agent roles and workflows)
|   |-- technical/               # 127 skills  (coding, DevOps, architecture)
|   |-- strategy/                #  59 skills  (business planning, analysis)
|   |-- creative/                #  40 skills  (design, writing, content)
|   |-- operations/              #  25 skills  (process, logistics, ops)
|   `-- industry/                #  25 skills  (sector-specific regulations)
|
|-- lib/                         # Shared Python libraries
|   |-- config.py                # Constants: categories, models, paths, verbs
|   |-- skill_parser.py          # Canonical YAML parser + skill discovery
|   |-- skill_validator.py       # Quality scoring, validation rules
|   |-- metadata_enricher.py     # Auto-tagging, complexity estimation
|   |-- platform_tuning.py       # Per-platform model/temp/safety settings
|   `-- logger.py                # Logging helpers
|
|-- fix_skills_unified.py        # 3-pass quality fixer (frontmatter, structure, slugs)
|-- fix_skills.py                # Pass 1 standalone (frontmatter + descriptions)
|-- fix_skills_structure.py      # Pass 2 standalone (headings, sections)
|-- fix_skills_pass3.py          # Pass 3 standalone (slug names, trimming)
|-- sync-skills.py               # Multi-platform converter (5 converter classes)
|-- populate_all.py              # Orchestrator: bundles, variants, quality, cleanup
|-- convert_to_gems.py           # Gemini Gem JSON generator
|-- convert-to-copilot.js        # Copilot format converter (JS)
|-- convert_to_codex_responses.py  # OpenAI Responses API + GPT/Agent Builder
|-- convert_to_cli_skills.py     # Universal CLI placer for all 4 platforms
|
|-- tests/                       # pytest test suite
|   |-- conftest.py              # Shared fixtures (sample skills, temp dirs)
|   |-- test_skill_validator.py  # Validator tests
|   |-- test_metadata_enricher.py
|   `-- test_platform_tuning.py
|
|-- docs/                        # Documentation (this file lives here)
|-- requirements.txt             # Python dependencies (PyYAML>=6.0)
|-- .editorconfig                # Editor formatting rules
`-- .gitignore                   # Ignored paths
```

### Platform output directories (generated)

```
Claude/
  ClaudeSkills/          # Main organized-by-category output
  ClaudeSkills-CLI/      # CLI format
  ClaudeSkills-Desktop/  # Desktop plugin format
  ClaudeSkills-Web/      # Web project-instructions format

Gemini/
  GeminiSkills/          # Gem JSON files + bundles
  GeminiSkills-CLI/      # CLI format
  GeminiSkills-Studio/   # Studio prompt pairs
  GeminiSkills-Agents/   # Agent GEMINI.md + JSON pairs

GithubCopilot/
  CopilotSkills/         # Agent skills + custom instructions + bundles
  CopilotSkills-CLI/     # CLI format
  CopilotSkills-Frontier/# Frontier coding agent format

Codex/
  CodexSkills/           # Multi-file JSON (Responses API, GPT, Agent Builder)
  CodexSkills-CLI/       # CLI format (AGENTS.md)
```

---

## 4. Creating a New Skill

### Step 1 -- Choose a category

Every skill belongs to exactly one of the six categories. Choose the best
fit based on the skill's primary domain:

| Category | Slug | Count | When to use |
|----------|------|-------|-------------|
| AI Agents | `ai-agents` | 232 | Agent roles, orchestration, AI workflows |
| Technical | `technical` | 127 | Coding, DevOps, architecture, debugging |
| Strategy | `strategy` | 59 | Business planning, competitive analysis |
| Creative | `creative` | 40 | Design, writing, content production |
| Operations | `operations` | 25 | Process management, logistics, automation |
| Industry | `industry` | 25 | Sector-specific regulations, compliance |

### Step 2 -- Create the directory

The directory name becomes the skill's **slug**. Use lowercase letters,
digits, and hyphens only. The slug must match the regex
`^[a-z0-9]+(?:-[a-z0-9]+)*$`.

```bash
mkdir -p _master-skills/technical/my-new-skill
```

### Step 3 -- Write SKILL.md

Create `_master-skills/technical/my-new-skill/SKILL.md` with proper YAML
frontmatter and all required body sections.

**Frontmatter requirements:**

- `name` -- Must match the directory slug exactly (lowercase, hyphenated).
- `description` -- 20 to 500 characters. Must contain at least one action
  verb from the trigger-verb list (create, analyze, build, manage, optimize,
  generate, design, develop, implement, configure, deploy, automate, etc.).
  Should include a "Use when ..." phrase.

**Required body sections** (as `##` headings):

1. **Overview** -- What the skill does and its value proposition.
2. **When to Use** -- Concrete scenarios that trigger this skill.
3. **Core Processes** (or Core Workflow / Instructions) -- Step-by-step
   workflow with numbered lists or detailed procedures.
4. **Tools & Templates** -- Code blocks, templates, or frameworks.
5. **Metrics** -- How to measure success or quality.
6. **Common Pitfalls** -- Mistakes to avoid.
7. **Integration Points** -- How this skill connects to related skills.

### Step 4 -- Skill template

Copy and adapt this template:

```markdown
---
name: my-new-skill
description: >-
  Build and implement [what it does] for [target audience].
  Use when you need to [primary use case]. Analyze [secondary use case]
  and optimize [tertiary use case].
---

# My New Skill

## Overview

Provide a 2-4 sentence summary of the skill. Explain what problem it
solves and who benefits from it.

## When to Use

This skill activates when you need assistance with:
- [Scenario 1]
- [Scenario 2]
- [Scenario 3]

## Core Processes

1. **Step one** -- Describe the first phase of the workflow in detail.
   Include inputs, expected outputs, and decision criteria.
2. **Step two** -- Continue with the second phase. Explain how it builds
   on the previous step.
3. **Step three** -- Wrap up with final deliverables and quality checks.

## Tools & Templates

```python
# Example template or code snippet relevant to the skill
def example():
    pass
```

## Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| [Metric 1] | [Target] | [Method] |
| [Metric 2] | [Target] | [Method] |

## Common Pitfalls

- **[Pitfall 1]** -- Explanation and how to avoid it.
- **[Pitfall 2]** -- Explanation and how to avoid it.

## Integration Points

- [Related Skill 1](../related-skill-1/SKILL.md) -- How they connect
- [Related Skill 2](../related-skill-2/SKILL.md) -- How they connect
```

### Step 5 -- Validate

Run the unified fixer to check and auto-repair formatting:

```bash
# Dry run first (shows what would change, writes nothing)
python fix_skills_unified.py --skill technical/my-new-skill --dry-run --verbose

# Apply fixes
python fix_skills_unified.py --skill technical/my-new-skill
```

Run the validator to get a quality score:

```bash
python lib/skill_validator.py --skill technical/my-new-skill
```

A passing skill has zero errors and a score of 70 or above.

### Step 6 -- Generate platform outputs

```bash
python sync-skills.py
```

This runs all five converter classes (Gemini, Copilot, Codex, Claude, CLI)
and produces output files in every platform directory.

---

## 5. Modifying Existing Skills

1. **Edit the master file only.** All platform outputs are generated from
   `_master-skills/`. Never edit files in `ClaudeSkills/`, `GeminiSkills/`,
   etc. directly -- those are overwritten on every sync.

2. **Re-run the pipeline** after editing:

   ```bash
   python fix_skills_unified.py --skill <category>/<slug>
   python sync-skills.py
   ```

3. **Verify** the change propagated:

   ```bash
   python lib/skill_validator.py --skill <category>/<slug>
   ```

---

## 6. Adding a New Platform

The `sync-skills.py` script uses converter classes to produce platform
output. To add a new platform:

### Step 1 -- Create a converter class

Add a new class to `sync-skills.py` following the existing pattern. The
five current converters are:

| Class | Output |
|-------|--------|
| `GeminiConverter` | Gemini Gem JSON files |
| `CopilotConverter` | GitHub Copilot custom instructions and agent skills |
| `CodexResponsesConverter` | OpenAI Responses API, GPT Builder, Agent Builder |
| `ClaudeConverter` | Claude Desktop, Web, and main skill files |
| `CLISkillsConverter` | Universal CLI format for all platforms |

Your converter class needs at minimum:

```python
class MyPlatformConverter:
    """Converts master skills to MyPlatform format."""

    def __init__(self, master_dir: Path, output_dir: Path):
        self.master_dir = master_dir
        self.output_dir = output_dir

    def convert_skill(self, skill_data: dict) -> Path:
        """Convert a single skill dict to the platform format.

        Args:
            skill_data: Dict from skill_parser.parse_skill_file().

        Returns:
            Path to the written output file.
        """
        # Transform skill_data into platform-specific format
        # Write to self.output_dir / ...
        ...

    def convert_all(self) -> int:
        """Convert all skills. Returns count of files written."""
        from lib.skill_parser import discover_all_skills
        skills = discover_all_skills(self.master_dir)
        count = 0
        for skill in skills:
            self.convert_skill(skill)
            count += 1
        return count
```

### Step 2 -- Register in config

Add output paths and any platform-specific settings to `lib/config.py`:

```python
# In PLATFORM_OUTPUTS dict
PLATFORM_OUTPUTS["myplatform"] = BASE_DIR / "MyPlatform" / "MyPlatformSkills"
```

### Step 3 -- Wire into the orchestrator

Add a call to your converter in `populate_all.py` and/or `sync-skills.py`
so it runs as part of the full pipeline.

### Step 4 -- Add tests

Create `tests/test_myplatform_converter.py` with at least:
- A test that converts a sample skill and checks the output file exists.
- A test that validates the output format is correct.

---

## 7. Running the Pipeline

### Full rebuild

The full pipeline runs three phases:

```bash
# Phase 1: Quality fixes (3 passes)
python fix_skills_unified.py --all

# Phase 2: Platform conversion (5 converters)
python sync-skills.py

# Phase 3: Bundles, variants, and cleanup
python populate_all.py
```

Or run everything through the orchestrator:

```bash
python populate_all.py    # Runs all phases automatically
```

### Incremental -- single skill

```bash
python fix_skills_unified.py --skill ai-agents/ceo
python sync-skills.py     # Currently re-syncs all; incremental is TODO
```

### Incremental -- single category

```bash
python fix_skills_unified.py --category technical
```

### Dry-run mode

Every script supports `--dry-run` to preview changes without writing files:

```bash
python fix_skills_unified.py --dry-run --all --verbose
python sync-skills.py --dry-run
python populate_all.py --dry-run
```

### Verbose mode

Add `--verbose` for detailed per-file logging:

```bash
python fix_skills_unified.py --all --verbose
python lib/skill_validator.py --all --verbose
```

### Running individual fix passes

The unified fixer supports selecting individual passes:

```bash
python fix_skills_unified.py --all --pass 1    # Frontmatter + descriptions
python fix_skills_unified.py --all --pass 2    # Heading promotion, sections
python fix_skills_unified.py --all --pass 3    # Slug names, description trim
```

---

## 8. Testing

### Running the test suite

```bash
# Run all tests
pytest tests/ -v

# Run a specific test file
pytest tests/test_skill_validator.py -v

# Run a specific test class or method
pytest tests/test_skill_validator.py::TestValidationResult -v
pytest tests/test_skill_validator.py::TestValidationResult::test_default_values -v
```

### Test structure

```
tests/
  conftest.py                   # Shared fixtures
  test_skill_validator.py       # SkillValidator + ValidationResult
  test_metadata_enricher.py     # Auto-tagging, complexity estimation
  test_platform_tuning.py       # Platform-specific model/temp settings
```

### What is tested

- **ValidationResult dataclass** -- Field presence, default values, the
  type is a dataclass (not a dict), string representation for PASS/FAIL.
- **SkillValidator.validate()** -- Return type, pass/fail logic, error and
  warning separation.
- **validate_frontmatter** -- Missing name, invalid characters in name,
  missing description, description too short/long, missing trigger verbs.
- **validate_body** -- Empty body, short body, missing `##` headings,
  missing core section, no code blocks or numbered lists, stub detection.
- **validate_structure** -- Heading order (`##` before `###`), duplicate
  content blocks, progressive disclosure warnings.
- **validate_description_quality** -- Trigger verb count, "Use when" phrase
  presence, boilerplate detection.
- **calculate_score** -- Clamping to 0-100, error/warning penalties, bonus
  points for code blocks and template sections.
- **validate_all** -- Batch summary aggregation over a temp directory.

### Shared fixtures (conftest.py)

The `conftest.py` file provides reusable fixtures:

| Fixture | Description |
|---------|-------------|
| `sample_skill` | A realistic skill dict that passes validation |
| `simple_skill` | A minimal skill classified as "simple" complexity |
| `complex_skill` | A large skill classified as "complex" complexity |
| `sample_master_dir` | A temp directory with 5 sample SKILL.md files |

### Adding new tests

1. Create a file named `tests/test_<module>.py`.
2. Import the project root onto `sys.path` (see existing test files for
   the pattern).
3. Use fixtures from `conftest.py` where possible.
4. Follow the naming convention: `TestClassName` for classes,
   `test_descriptive_name` for methods.

---

## 9. Encoding and Windows Notes

### The cp1252 problem

On Windows, Python defaults to the `cp1252` codec for console output. Many
SKILL.md files contain Unicode characters (curly quotes, em-dashes, etc.)
that cannot be encoded in cp1252, causing `UnicodeEncodeError`.

**Solution:** Always set the environment variable before running scripts:

```bash
# PowerShell
$env:PYTHONIOENCODING = "utf-8"

# Command Prompt
set PYTHONIOENCODING=utf-8

# Bash (Git Bash, WSL)
export PYTHONIOENCODING=utf-8
```

### File reading with errors='replace'

All file reads in the codebase use `errors="replace"` to prevent crashes
on malformed bytes:

```python
content = path.read_text(encoding="utf-8", errors="replace")
```

This replaces undecodable bytes with the Unicode replacement character
(U+FFFD) rather than raising an exception.

### BOM handling

Some files created by Windows editors may contain a UTF-8 BOM
(`\xef\xbb\xbf`). The YAML parser handles this gracefully because
`yaml.safe_load` strips leading whitespace. If you encounter BOM issues
in other contexts, strip it explicitly:

```python
if content.startswith("\ufeff"):
    content = content[1:]
```

### Line endings

The `.editorconfig` enforces `end_of_line = lf` for all files. Git should
be configured to normalize line endings:

```bash
git config core.autocrlf input    # on Windows
git config core.autocrlf false    # on macOS/Linux
```

---

## 10. Slug Collision Handling

### The problem

Five skill directory names appear in multiple categories. For example,
`content-strategy` exists in both `strategy/` and `creative/`. Without
deduplication, one would overwrite the other during platform conversion.

### The five collision groups

| Slug | Categories it appears in |
|------|--------------------------|
| `content-strategy` | strategy, creative |
| `market-research` | strategy, industry |
| `product-launch` | strategy, operations |
| `stakeholder-management` | strategy, operations |
| `workflow-optimization` | operations, technical |

### The fix -- category prefix

For skills whose slug is in a collision group, the effective slug becomes
`{category}--{slug}`. This is handled automatically by
`lib/skill_parser.py`:

```python
# In discover_all_skills():
_SLUG_COLLISION_GROUPS = frozenset({
    "content-strategy",
    "market-research",
    "product-launch",
    "stakeholder-management",
    "workflow-optimization",
})

# Skills in collision groups get a _dedup_slug field:
skill["_dedup_slug"] = f"{category}--{slug}"
# e.g., "strategy--content-strategy", "creative--content-strategy"
```

### Using the effective slug

Always use `get_effective_slug()` when generating output file names:

```python
from lib.skill_parser import get_effective_slug

slug = get_effective_slug(skill)
# Returns "strategy--content-strategy" if dedup is needed,
# otherwise returns the plain slug like "api-development"
```

### Historical context

An earlier bug used `slugify(frontmatter_name)` to derive slugs, which
caused approximately 13 skills with similar names to overwrite each other.
The fix was to use `path.parent.name` (the directory name) as the slug
instead.

---

## 11. Common Issues and Troubleshooting

### UnicodeEncodeError on Windows

```
UnicodeEncodeError: 'charmap' codec can't encode character '\u2019'
```

**Fix:** Set `PYTHONIOENCODING=utf-8`. See [Section 9](#9-encoding-and-windows-notes).

### "Missing required key 'description'" during validation

The YAML frontmatter is missing the `description` field or has malformed
YAML syntax. Check for:
- Missing colon after the key name.
- Unquoted special characters (`:`, `#`, `[`, `]`) in the value.
- Incorrect indentation for multi-line descriptions.

**Fix:** Use the YAML folded scalar syntax for long descriptions:

```yaml
---
name: my-skill
description: >-
  Build and implement production-ready services.
  Use when you need to deploy scalable backends.
---
```

### "Body: no ## (h2) headings found"

The skill body uses `#` (h1) headings instead of `##` (h2). The fixer
automatically promotes these.

**Fix:** Run `python fix_skills_unified.py --skill <category>/<slug>`.

### "Body: missing a 'Core Workflow' or 'Instructions' section"

None of the recognized core section heading names were found. The
validator accepts any of these heading titles (case-insensitive):

`Core Workflow`, `Instructions`, `Core Processes`, `Core Process`,
`Workflow`, `Quick Start`, `How to Use`, `Getting Started`, `Steps`,
`Usage`, `Implementation`, `Process`, `Guide`, `Overview`, `Methodology`,
`Framework`, `Approach`, `Procedure`, `How It Works`,
`Implementation Guide`, `Key Capabilities`, `Primary Functions`,
`Main Features`, `Configuration`.

### "Description quality: only 0 trigger verb(s) found"

The description field needs action verbs to be discoverable. Include at
least one (preferably two or more) of these verbs:

`create`, `analyze`, `build`, `manage`, `optimize`, `generate`, `design`,
`develop`, `implement`, `configure`, `deploy`, `automate`, `review`,
`audit`, `plan`, `monitor`, `debug`, `test`, `transform`, `validate`,
`migrate`, `integrate`, `document`, `evaluate`, `refactor`.

### Slug contains forbidden characters

Skill names (the `name` field in frontmatter) must match
`^[a-z0-9]+(-[a-z0-9]+)*$`. No uppercase, no underscores, no spaces.

**Fix:** Rename the directory and update the `name` field to match.

### Pipeline produces fewer than 508 files

Check for:
- Junk slugs being filtered (see `JUNK_SLUGS` in `lib/config.py`).
- Parse errors logged as `[WARN] Failed to parse ...` during discovery.
- Skills missing from a category directory.

Run the parser test to confirm the count:

```bash
python -c "from lib.skill_parser import _test_parser; _test_parser()"
```

### TypeError in platform_tuning.py -- "sections field can be list or int"

This was a known bug where the `sections` field was sometimes returned as
a list instead of an integer. It has been fixed. If you encounter it again,
check that `estimate_complexity()` returns consistent types.

---

## 12. Code Style

### EditorConfig

The project uses `.editorconfig` to enforce consistent formatting:

| File type | Indent | Size | Max line length |
|-----------|--------|------|-----------------|
| `*.py` | spaces | 4 | 120 |
| `*.js` | spaces | 2 | 120 |
| `*.json`, `*.yml`, `*.yaml` | spaces | 2 | -- |
| `*.md` | spaces | 2 | -- |
| `Makefile` | tabs | -- | -- |

All files use:
- `charset = utf-8`
- `end_of_line = lf`
- `insert_final_newline = true`
- `trim_trailing_whitespace = true` (except Markdown, where trailing
  whitespace is preserved)

### Python conventions

- **Type hints** -- All function signatures use type annotations
  (`Dict`, `List`, `Optional`, `Path`, etc.).
- **Docstrings** -- Google/NumPy style with `Args:`, `Returns:`, and
  `Examples:` sections.
- **Imports** -- Standard library first, then third-party, then local
  `lib.*` modules.
- **Path handling** -- Always use `pathlib.Path`, never raw string
  concatenation.
- **Error handling** -- Catch specific exceptions; use `errors="replace"`
  for file I/O; log warnings with `[WARN]` prefix and continue.

### JavaScript conventions

- **Indent** -- 2 spaces.
- **Semicolons** -- Used.
- **Template literals** -- Preferred for string interpolation.

---

## 13. Validation and Quality

### How the validator works

The `SkillValidator` class in `lib/skill_validator.py` performs five
categories of checks on each skill:

| Check | What it validates |
|-------|-------------------|
| `validate_frontmatter()` | `name` field exists and matches slug pattern; `description` exists, is 20-500 chars, contains trigger verbs |
| `validate_body()` | Line count (minimum 50, warning under 200, max 2000); at least one `##` heading; a core section heading; code blocks or detailed numbered lists; not a stub (minimum 500 chars) |
| `validate_structure()` | `##` headings appear before `###`; no duplicate content blocks; progressive disclosure warning if over 500 lines without a `references/` directory |
| `validate_description_quality()` | At least 2 trigger verbs; contains a "Use when" or equivalent phrase; no boilerplate text |
| `validate_cross_references()` | Referenced skills exist in the skill set; no broken links |

### Quality scoring

The score starts at 100 and is adjusted as follows:

| Adjustment | Points |
|------------|--------|
| Per blocking error | -20 |
| Per warning | -5 |
| Has code blocks or detailed numbered lists | +10 |
| Has a Templates/Framework section heading | +10 |
| Has an Output Format section heading | +5 |
| **Floor / Ceiling** | **0 / 100** |

A skill **passes** validation if it has zero blocking errors (warnings are
allowed). A quality score of 70+ is considered acceptable for production.

### Running the validator

```bash
# Validate a single skill
python lib/skill_validator.py --skill technical/api-development

# Validate an entire category
python lib/skill_validator.py --category ai-agents

# Validate everything and show minimum score threshold
python lib/skill_validator.py --all --min-score 70

# Full batch summary
python lib/skill_validator.py --all
```

### Example output

```
[PASS] _master-skills/technical/api-development/SKILL.md (score: 95)

[FAIL] _master-skills/creative/some-skill/SKILL.md (score: 40)
  ERROR: Frontmatter: description is too short (15 chars, minimum 20).
  ERROR: Body: too short (30 lines, minimum 50).
  WARN:  Description quality: only 0 trigger verb(s) found.
```

### Batch summary keys

When you call `validate_all()` programmatically, it returns a dict with:

| Key | Type | Description |
|-----|------|-------------|
| `total` | int | Number of skills validated |
| `passed` | int | Number that passed (zero errors) |
| `failed` | int | Number that failed |
| `average_score` | float | Mean quality score across all skills |
| `skills_by_score` | list | (path, score) tuples sorted ascending |
| `common_issues` | Counter | Frequency of each issue description |
| `results` | list | List of `ValidationResult` objects |

---

## Appendix: Quick Reference Commands

```bash
# Validate all skills
python lib/skill_validator.py --all

# Fix all skills (dry run)
python fix_skills_unified.py --dry-run --all --verbose

# Fix all skills (apply changes)
python fix_skills_unified.py --all

# Convert to all platforms
python sync-skills.py

# Full pipeline (bundles + variants + cleanup)
python populate_all.py

# Run tests
pytest tests/ -v

# Test the parser
python -c "from lib.skill_parser import _test_parser; _test_parser()"
```
