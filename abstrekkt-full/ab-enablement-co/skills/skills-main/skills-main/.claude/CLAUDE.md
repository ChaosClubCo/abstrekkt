# Skills Library - Claude Code Instructions

## Project Overview
Conversion pipeline transforming 513 master AI skill definitions into platform-specific formats.
- **Repo**: github.com/Krosebrook/skills-pipeline
- **Platforms**: Claude, Gemini, GitHub Copilot, OpenAI Codex
- **Output**: ~32,500 files across all platform variants
- **Categories**: ai-agents (232), technical (130), strategy (59), creative (40), operations (27), industry (25) — canonical, excludes `JUNK_SLUGS`
- **Related repos**: Krosebrook/skills (Anthropic fork), ChaosClubCo/skills (org customs), Krosebrook/intinc-platform (private INT INC skills)

## Key Structure
```
_master-skills/          # 513 canonical SKILL.md files (6 category subdirs)
platforms/               # claude/, gemini/, github-copilot/, codex/ outputs
adapters/universal/      # JS adapters + batch converter
agents/github-repo/      # GitHub-native agent configs
scripts/                 # Pipeline scripts (Python + JS)
lib/                     # Shared Python libraries
tests/                   # pytest test suite
docs/                    # 60+ documentation pages
data/                    # Data files
```

## Critical Constraints
- **Source of truth is `_master-skills/`.** `platforms/`, `adapters/`, and `agents/` are **generated** and overwritten on every pipeline run — never hand-edit them; fix the source skill or the converter.
- **Run scripts from the project root**, not `scripts/` — `lib/` imports use a graceful-degradation fallback that only resolves from root (`ModuleNotFoundError` = wrong CWD).
- **Canonical skill count = SKILL.md files minus `lib/config.py` → `JUNK_SLUGS`.** Raw `find _master-skills -name SKILL.md` returns 514; canonical is **513** (the populate cleanup phase deletes junk like `technical/template-skill`; `ai-agents/agent-factory` is incomplete with no SKILL.md). Always re-derive — don't trust hardcoded totals.
- **Pipeline phase order is immutable:** quality → sync → populate. Changing it is a human-review trigger.
- **Slug resolution comes from the directory name** (`get_effective_slug`), not the frontmatter `name`. Five cross-category collisions use a `{category}--{slug}` prefix.

## Critical Scripts
| Script | Purpose |
|--------|---------|
| `run-pipeline.bat` / `run-pipeline.sh` | **Double-click** to run full pipeline (wraps pipeline.py) |
| `scripts/pipeline.py` | **Unified entry point** — runs quality, sync, populate in order |
| `scripts/sync-skills.py` | Main multi-platform converter |
| `scripts/populate-all.py` | Orchestrator (bundles, variants, quality, cleanup) |
| `scripts/fix-skills-unified.py` | Consolidated quality fix script |

## Key Commands
```bash
# Test
pytest tests/ -v --tb=short

# Lint
ruff check . && black --check .

# Validate (dry run)
python scripts/sync-skills.py --validate --dry-run

# Convert all platforms
python scripts/sync-skills.py --targets all

# Populate bundles
python scripts/populate-all.py --phase all

# Full pipeline (quality → sync → populate)
python scripts/pipeline.py

# Pipeline dry-run
python scripts/pipeline.py --dry-run
```

## Conventions
- **Python**: 3.10+, Black formatting, line length 120, Ruff (E, F, W, I rules)
- **Node.js**: 18+ for JS scripts
- **Encoding**: All file I/O must use `encoding="utf-8"` and `errors="replace"`
- **Windows**: Set `PYTHONIOENCODING=utf-8` before running scripts
- **Naming**: Script files use kebab-case; skill slugs are lowercase-hyphenated
- **Slow tests**: Mark with `@pytest.mark.slow` for full corpus tests

## Shared Libraries (`lib/`)
- `config.py` - Paths, constants, platform settings
- `encoding.py` - Windows UTF-8 helper
- `logger.py` - Logging utilities
- `skill_parser.py` - YAML frontmatter + body parser
- `skill_validator.py` - Validation rules and quality scoring
- `metadata_enricher.py` - Auto-tagging, related skills, complexity scoring
- `platform_tuning.py` - Per-platform model/temperature/safety settings

## Master Skill Format
YAML frontmatter + structured markdown body. Slugs derived from directory names.

## CI/CD
- GitHub Actions: ruff lint + pytest on push to main
- Per-file lint ignores: E402 for tests (sys.path), E501 for scripts (long templates)
- No deployment step — this is a pipeline tool, not a deployed service

---

## Project Snapshot (generated via /goal, 2026-06-03)

The **skills-pipeline** (`Krosebrook/skills-pipeline`, internally packaged as `skills-library` v1.0.0) is a **code-generation pipeline, not a deployed app**. It transforms ~513 hand-authored canonical skill definitions in `_master-skills/{category}/{slug}/SKILL.md` into ~32,500 platform-specific files for Claude, Gemini, GitHub Copilot, and OpenAI Codex. There is no runtime service and no deploy step — the "product" is the generated output trees.

The architecture is **three immutable stages run in a fixed order: quality → sync → populate** (the order itself is a human-review trigger). `scripts/pipeline.py` is a thin subprocess orchestrator that shells out to the real stage scripts; it owns no conversion logic. Stage 1 (`fix-skills-unified.py`) normalizes master skills in place; Stage 2 (`sync-skills.py`) converts each skill to every platform via the `convert-to-*.py/.js` scripts; Stage 3 (`populate-all.py`) builds curated bundles, fills thin variants, runs a final quality pass, and cleans up junk. All scripts depend on the shared `lib/` layer, where `config.py` holds every path, category list, and platform constant.

The hard rule: **`_master-skills/` is the only source of truth.** The `platforms/`, `adapters/`, and `agents/` trees are generated and overwritten on every run — never hand-edit them; fix the source skill or the converter. Slug resolution comes from the **directory name** via `get_effective_slug()` (not the frontmatter `name`); all file I/O must use `encoding="utf-8", errors="replace"`; run all scripts from the project root.

**Current state (this checkout):** Source-only — the generated output trees (`platforms/`, `adapters/`, `agents/`) are **not present** here and would be regenerated by a full `python scripts/pipeline.py` run. `_master-skills/` carries a 7th directory (`intinc-claude-skills-governance-role-bundles`) beyond the 6 canonical categories. The 513 canonical count is derived at runtime from `lib/config.py` minus `JUNK_SLUGS` — treat it as approximate, not hardcoded truth.

```yaml
project:
  name: skills-pipeline
  purpose: Code-gen pipeline — transforms 513 canonical SKILL.md into ~32,500 platform files (Claude/Gemini/Copilot/Codex). No runtime, no deploy.
  owner: Kyle Rosebrook <kylerosebrook@gmail.com>
  lane: personal
  github: Krosebrook/skills-pipeline
  version: 1.0.0
stack:
  language: Python >=3.10 (+ Node 18+ for JS converters)
  framework: n/a (CLI pipeline; subprocess orchestrator)
  buildTool: n/a (output trees are the product)
  packageManager: pip (pyproject.toml) + npm (JS scripts)
  lint: ruff (E,F,W,I) + black, line-length 120
  test: pytest (marker 'slow' = full 500+ corpus)
structure:
  entryPoint: scripts/pipeline.py   # or run-pipeline.bat / run-pipeline.sh
  keyFolders:
    - _master-skills/   # SOURCE OF TRUTH — 7 category dirs (6 canonical + intinc governance bundles)
    - scripts/          # kebab-case pipeline + convert-to-*.py/.js
    - lib/              # snake_case shared layer (config.py = all paths/constants)
    - tests/            # pytest suite
    - docs/             # 9 numbered guide sets + ARCHITECTURE.md
    - data/
  generatedOutputs:     # ABSENT in this checkout — regenerated by pipeline
    - platforms/  adapters/universal/  agents/github-repo/
  configFiles:
    - pyproject.toml  requirements.txt  .pre-commit-config.yaml  .editorconfig
    - CLAUDE.md  AGENTS.md  CONVENTIONS.md  GLOSSARY.md
dependencies:
  runtime: [PyYAML>=6.0]
  dev: [pytest, pytest-cov, ruff, black]
  ci: GitHub Actions .github/workflows/test.yml (ruff + pytest on push to main)
constraints:
  - "_master-skills/ is source of truth; platforms/adapters/agents are generated — never hand-edit"
  - "Run scripts from project root only (lib/ imports use root-resolved fallback)"
  - "Pipeline phase order quality->sync->populate is immutable (human-review trigger)"
  - "Slug from directory name via get_effective_slug(), NOT frontmatter name; 5 collisions use {category}--{slug}"
  - "All file I/O: encoding=utf-8, errors=replace; ASCII --- only, no box-drawing chars"
  - "Per-skill failures logged/counted (ErrorTracker), pipeline still exits 0; only fatal config/lib errors exit 1"
  - "Windows: set PYTHONIOENCODING=utf-8 before running"
humanReviewTriggers:
  - lib/config.py, slug-collision logic, category set, phase order, new external dep, or >50 output files changed
links:
  docs: docs/ARCHITECTURE.md
  pipeline: docs/06-admin-guide/pipeline-operations.md
  skillFormat: docs/SKILL_FORMAT_SPEC.md
  related: [Krosebrook/skills, ChaosClubCo/skills, Krosebrook/intinc-platform]
```
