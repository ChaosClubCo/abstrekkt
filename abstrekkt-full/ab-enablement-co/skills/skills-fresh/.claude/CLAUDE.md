# Skills Library - Claude Code Instructions

## Project Overview
Conversion pipeline transforming 514 master AI skill definitions into platform-specific formats.
- **Repo**: github.com/Krosebrook/skills-pipeline
- **Platforms**: Claude, Gemini, GitHub Copilot, OpenAI Codex
- **Output**: ~32,500 files across all platform variants
- **Categories**: ai-agents (233), technical (130), strategy (59), creative (40), operations (27), industry (25)
- **Related repos**: Krosebrook/skills (Anthropic fork), ChaosClubCo/skills (org customs), Krosebrook/intinc-platform (private INT INC skills)

## Key Structure
```
_master-skills/          # 514 canonical SKILL.md files (6 category subdirs)
platforms/               # claude/, gemini/, github-copilot/, codex/ outputs
adapters/universal/      # JS adapters + batch converter
agents/github-repo/      # GitHub-native agent configs
scripts/                 # Pipeline scripts (Python + JS)
lib/                     # Shared Python libraries
tests/                   # pytest test suite
docs/                    # 60+ documentation pages
data/                    # Data files
```

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
