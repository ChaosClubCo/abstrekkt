# Pipeline Operations

This document walks through the full Skills Library pipeline phase-by-phase. Each phase has exact commands, expected output counts, and troubleshooting guidance.

## Quick Start

The easiest way to run the full pipeline:

- **Windows**: Double-click `run-pipeline.bat` in the project root
- **Mac/Linux**: Run `./run-pipeline.sh` from the project root

These wrappers handle encoding, check for Python, and pass any arguments through. No terminal knowledge needed — just double-click the `.bat` file on Windows.

To preview without changing files, open a terminal and run:
```
run-pipeline.bat --dry-run
```

## Overview

The pipeline transforms 508 master skills in `_master-skills/` into platform-specific outputs for Claude, Gemini, Codex, and GitHub Copilot. It runs in five sequential stages:

1. **Quality Fixes** (3-pass) -- normalize frontmatter, structure, and slugs
2. **Sync/Convert** -- convert master skills to all platform formats
3. **Bundle Population** -- generate curated bundles across 3 platforms
4. **Variant Fixes** -- update thin variants (Frontier, Agents, Desktop, Web)
5. **Cleanup** -- remove junk skills and deprecated files

## Prerequisites

Before running any pipeline stage:

```bash
# Windows: set encoding to avoid cp1252 issues
export PYTHONIOENCODING=utf-8

# Verify Python and Node
python --version   # 3.10+
node --version     # 18+

# Verify master skills are present
ls _master-skills/ | head -10
```

The master skills directory must contain 6 category subdirectories:

- `ai-agents/` (232 skills)
- `technical/` (127 skills)
- `strategy/` (59 skills)
- `creative/` (40 skills)
- `operations/` (25 skills)
- `industry/` (25 skills)

---

## Phase 1: Quality Fixes (3-Pass)

The quality fix pipeline normalizes all SKILL.md files in `_master-skills/`. Run the three passes in order.

### Pass 1: Frontmatter Fixes

Script: `fix_skills.py`

```bash
python fix_skills.py
```

What it does:

- Ensures every SKILL.md has valid YAML frontmatter with `name` and `description` fields
- Adds trigger verbs to descriptions that lack them (using category-specific verb maps from `lib/config.py`)
- Adds "Use when..." phrases to descriptions missing context (using `USE_WHEN_MAP` in `lib/config.py`)
- Trims descriptions exceeding 500 characters
- Fixes missing or malformed `---` frontmatter delimiters

Expected output: Reports the number of skills fixed. All 508 SKILL.md files should have valid frontmatter after this pass.

### Pass 2: Structure Fixes

Script: `fix_skills_structure.py`

```bash
python fix_skills_structure.py
```

What it does:

- Ensures every skill body contains at least one `##` heading
- Validates heading hierarchy (no `###` before a `##`)
- Adds missing core sections (Overview, Core Processes, etc.)
- Normalizes heading capitalization and formatting

Expected output: Reports structural fixes applied per skill.

### Pass 3: Slug and Description Cleanup

Script: `fix_skills_pass3.py`

```bash
python fix_skills_pass3.py
```

What it does:

- Validates that `name` in frontmatter matches the directory slug pattern (`[a-z0-9]+(-[a-z0-9]+)*`)
- Fixes names that do not match (replaces with directory name)
- Trims overly long descriptions
- Removes junk skills matching slugs in `JUNK_SLUGS` (defined in `lib/config.py`): `undefined`, `unnamed`, `template-skill`, `test-skill`, `example-skill`, etc.

Expected output: Reports slug corrections and any junk removals.

### Running All Three Passes

```bash
python fix_skills.py && python fix_skills_structure.py && python fix_skills_pass3.py
```

---

## Phase 2: Sync and Convert

Script: `sync-skills.py`

This is the main conversion engine. It reads from `_master-skills/` and writes to all platform output directories.

### Full Sync (All Targets)

```bash
python sync-skills.py --targets all
```

### Individual Targets

```bash
python sync-skills.py --targets gemini
python sync-skills.py --targets codex
python sync-skills.py --targets copilot
python sync-skills.py --targets claude
python sync-skills.py --targets cli
```

### With Validation

```bash
python sync-skills.py --targets all --validate
```

The `--validate` flag runs `SkillValidator` against each skill before conversion and reports errors.

### Single Skill or Category

```bash
python sync-skills.py --skill technical/api-development --targets all
python sync-skills.py --category ai-agents --targets gemini --dry-run
```

### Sync Statistics

```bash
python sync-skills.py --targets all --stats
```

### Converter Targets

The five converter targets and their output directories:

| Target | Script/Module | Output Directory | Format |
|--------|--------------|-----------------|--------|
| `gemini` | `convert_to_gems.py` | `Gemini/GeminiSkills/gems/{category}/` | JSON (Gem format) |
| `codex` | `convert_to_codex_responses.py` | `Codex/CodexSkills/` | JSON (Responses API, GPT Builder, Agent Builder, system-prompt TXT) |
| `copilot` | `convert-to-copilot.js` | `GithubCopilot/CopilotSkills/` | Markdown (custom-instructions, agent-skills, chat-participants) |
| `claude` | Internal to sync-skills.py | `Claude/ClaudeSkills/skills/{category}/` | SKILL.md with enhanced frontmatter |
| `cli` | `convert_to_cli_skills.py` | `{Platform}-CLI/skills/{slug}/` | Platform-native SKILL.md for CLI usage |

### Expected Output Counts

| Output | Expected Count |
|--------|---------------|
| ClaudeSkills (main) | 508 |
| ClaudeSkills-CLI | 503-507 |
| ClaudeSkills-Desktop | 508 |
| ClaudeSkills-Web | 508 |
| GeminiSkills gems | 525 (508 + extras) |
| GeminiSkills-CLI | 507 |
| GeminiSkills-Agents | 508 |
| CopilotSkills agent-skills | 512 |
| CopilotSkills custom-instructions | 519 |
| CopilotSkills-CLI | 507 |
| CopilotSkills-Frontier | 508 |
| CodexSkills | 3054 (multi-file per skill) |
| CodexSkills-CLI | 508 |

---

## Phase 3: Bundle Population

Script: `populate_all.py`

### Full Population (All Phases)

```bash
python populate_all.py --phase all
```

### Individual Phases

```bash
python populate_all.py --phase bundles
python populate_all.py --phase variants
python populate_all.py --phase quality
python populate_all.py --phase cleanup
```

### Dry Run

```bash
python populate_all.py --dry-run --phase all
```

### Bundle Output

`populate_all.py` generates 18 bundles across 3 platforms:

**Gemini Bundles** (in `Gemini/GeminiSkills/bundles/`):

| Bundle | Count | Description |
|--------|-------|-------------|
| `gems-full` | 508 | All skills as Gem JSON |
| `by-category` | 508 | Organized by category subdirectories |
| `vertex-enterprise` | 53 | Enterprise-focused skills for Vertex AI |
| `studio-essential-30` | 30 | Top 30 skills for AI Studio |
| `studio-creative-15` | 15 | Creative-focused skills for AI Studio |
| `agent-chains-20` | 20 | Multi-step agent chain skills |
| `idx-workspace` | 20 | Skills for IDX workspace environments |

**Codex Bundles** (in `Codex/CodexSkills/bundles/`):

| Bundle | Count | Description |
|--------|-------|-------------|
| `responses-api-full` | 508 | All skills as Responses API JSON |
| `by-category` | 508 | Organized by category subdirectories |
| `gpt-builder-50` | 50 | Top 50 for GPT Builder |
| `agent-builder-20` | 20 | Top 20 for Agent Builder |
| `enterprise-assistants` | 53 | Enterprise assistant configurations |

**Copilot Bundles** (in `GithubCopilot/CopilotSkills/bundles/`):

| Bundle | Count | Description |
|--------|-------|-------------|
| `by-category` | 508 | Organized by category subdirectories |
| `workspace-essential-30` | 30 | Top 30 workspace instructions |
| `workspace-by-stack` | 79 | Grouped by technology stack |
| `agent-skills-50` | 50 | Top 50 agent skills |
| `chat-participants-20` | 20 | Chat participant configurations |
| `coding-agent-20` | 20 | Coding agent skills |

### How Bundle Selection Works

Skills are ranked by `score_skill()` in `populate_all.py`. The scoring function rewards:

- Substantial body length (50+ lines: +2, 100+ lines: +2, 200+ lines: +1)
- Good description (50+ chars: +1, contains "when"/"use": +1)
- Structural headings (up to +3 based on heading count)
- Code blocks (up to +2)
- Penalizes very short skills (under 20 lines: -3)

Curated bundles take the top-N skills by this score.

---

## Phase 4: Variant Fixes

The `--phase variants` flag in `populate_all.py` updates four thin variant outputs:

| Variant | Path | Selection |
|---------|------|-----------|
| Copilot Frontier | `GithubCopilot/CopilotSkills-Frontier/` | Skills matching `FRONTIER_SKILL_KEYWORDS` |
| Gemini Agents | `Gemini/GeminiSkills-Agents/.gemini/agents/` | All skills as paired GEMINI.md + .json |
| Claude Desktop | `Claude/ClaudeSkills-Desktop/` | All skills as `.claude-plugin` format |
| Claude Web | `Claude/ClaudeSkills-Web/` | All skills as `project-instructions.md` |

```bash
python populate_all.py --phase variants
```

---

## Phase 5: Cleanup

```bash
python populate_all.py --phase cleanup
```

Removes:

- Skills with slugs in `JUNK_SLUGS` from all output directories
- Deprecated files and empty directories
- Stale outputs for skills that no longer exist in `_master-skills/`

---

## Full Pipeline End-to-End

The unified pipeline script (`scripts/pipeline.py`) runs all steps in order:

```bash
export PYTHONIOENCODING=utf-8

# Full pipeline (quality → sync → populate)
python scripts/pipeline.py

# Dry-run preview
python scripts/pipeline.py --dry-run

# Skip a step
python scripts/pipeline.py --skip quality

# Run only one step
python scripts/pipeline.py --only sync
```

The pipeline runs these steps in order:

| Step | Script | Default Args |
|------|--------|-------------|
| `quality` | `fix-skills-unified.py` | `--all` |
| `sync` | `sync-skills.py` | `--targets all --validate --stats` |
| `populate` | `populate-all.py` | `--phase all` |

The `--dry-run` flag is forwarded to all sub-steps. The pipeline stops on the first failure with a clear error message and reports per-step timing.

### Maintaining the Pipeline

If you add or rename a pipeline script, update the `STEPS` list in `scripts/pipeline.py` to keep it in sync. The step definitions are at the top of the file and are self-documenting.

### Manual Alternative

You can still run each step individually if needed:

```bash
export PYTHONIOENCODING=utf-8
python scripts/fix-skills-unified.py --all
python scripts/sync-skills.py --targets all --validate --stats
python scripts/populate-all.py --phase all
```

Estimated runtime: 2-5 minutes depending on hardware.

---

## Verification

After a full pipeline run, verify output counts:

```bash
# Master skills
find _master-skills -name "SKILL.md" | wc -l
# Expected: 508

# Claude main
find Claude/ClaudeSkills/skills -name "SKILL.md" | wc -l
# Expected: 508

# Gemini gems
find Gemini/GeminiSkills/gems -name "*.json" | wc -l
# Expected: 525

# Codex total files
find Codex/CodexSkills -name "*.json" -o -name "*.txt" | wc -l
# Expected: ~3054

# Copilot agent-skills
find GithubCopilot/CopilotSkills/agent-skills -name "SKILL.md" | wc -l
# Expected: 512

# Bundles
find Gemini/GeminiSkills/bundles -name "*.json" | wc -l
find Codex/CodexSkills/bundles -name "*.json" | wc -l
find GithubCopilot/CopilotSkills/bundles -name "*.md" -o -name "*.json" | wc -l
```

---

## Troubleshooting

### UnicodeDecodeError on Windows

```
UnicodeDecodeError: 'charmap' codec can't decode byte ...
```

Fix: Set the encoding environment variable before running any script.

```bash
export PYTHONIOENCODING=utf-8
```

### ModuleNotFoundError for lib modules

```
ModuleNotFoundError: No module named 'lib.config'
```

Fix: Run all scripts from the project root directory (`D:\02_Development\Skills`). The `lib/` directory must be a sibling of the scripts.

### Slug Collisions

If two skills in different categories share the same directory name, the pipeline applies a dedup prefix. See [Slug Collision Reference](../07-reference/slug-collision-reference.md) for the full list.

### Missing YAML Dependency

`sync-skills.py` imports `yaml`. Install it if missing:

```bash
pip install pyyaml
```

### Converter Script Not Found

If `convert-to-copilot.js` fails:

```bash
node convert-to-copilot.js
```

Ensure Node.js 18+ is installed and you are running from the project root.

---

## Related Documents

- [Quality Control](quality-control.md) -- validator, enricher, and quality scoring details
- [Bundle Management](bundle-management.md) -- creating and modifying bundles
- [Cheat Sheet](../07-reference/cheat-sheet.md) -- compact command reference
- [Config Reference](../07-reference/config-reference.md) -- all configuration constants
