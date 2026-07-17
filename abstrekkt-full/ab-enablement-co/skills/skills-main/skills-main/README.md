# Skills Library

A conversion pipeline that transforms 513 master AI skill definitions into platform-specific formats for Claude, Gemini, GitHub Copilot, and OpenAI Codex. The pipeline produces 32,500+ output files across 15 platform variants, 18 curated bundles, and a universal adapter layer.

## Key Stats

| Metric | Count |
|--------|-------|
| Master skills | 513 |
| Target platforms | 4 (Claude, Gemini, Copilot, Codex) |
| Platform variants | 15 |
| Curated bundles | 18 |
| Total output files | 32,500+ |
| Skill categories | 6 |

## Skill Categories

| Category | Skills | Description |
|----------|--------|-------------|
| ai-agents | 232 | AI agent roles (CEO, CTO, engineer personas, etc.) |
| technical | 130 | Software development, architecture, DevOps |
| strategy | 59 | Business strategy, planning, analysis |
| creative | 40 | Writing, design, content creation |
| operations | 27 | Project management, process optimization |
| industry | 25 | Domain-specific industry knowledge |

## Project Structure

```
Skills/
├── _master-skills/                  # 513 canonical SKILL.md files
│   ├── ai-agents/                   #   232 skills
│   ├── technical/                   #   130 skills
│   ├── strategy/                    #    59 skills
│   ├── creative/                    #    40 skills
│   ├── operations/                  #    27 skills
│   └── industry/                    #    25 skills
│
├── platforms/
│   ├── claude/                      # Claude variants (Main, CLI, Desktop, Web)
│   ├── gemini/                      # Gemini variants (Gems, CLI, Studio, Agents)
│   ├── github-copilot/              # Copilot variants (Agent Skills, CLI, Frontier)
│   └── codex/                       # Codex variants (Multi-format, CLI)
│
├── adapters/universal/              # JS adapters + batch converter
├── agents/github-repo/              # GitHub-native agent configs (258 files)
│
├── lib/                             # Shared Python libraries
│   ├── config.py                    # Paths, constants, platform settings
│   ├── encoding.py                  # Windows UTF-8 helper
│   ├── logger.py                    # Logging utilities
│   ├── metadata_enricher.py         # Auto-tagging, related skills, complexity scoring
│   ├── platform_tuning.py           # Per-platform model/temperature/safety settings
│   ├── skill_parser.py              # SKILL.md frontmatter + body parser
│   └── skill_validator.py           # Validation rules and quality scoring
│
├── scripts/                         # Pipeline scripts (Python + JS)
│   ├── sync-skills.py               # Multi-platform converter (5 targets)
│   ├── populate-all.py              # Orchestrator (bundles, variants, quality, cleanup)
│   ├── fix-skills-unified.py        # Consolidated quality fix script
│   └── ...                          # Additional utility scripts
│
├── tests/                           # pytest test suite
├── docs/                            # Documentation (60+ pages)
├── data/                            # Data files
└── requirements.txt                 # Python dependencies
```

## Master Skill Format

Each master skill is a Markdown file with YAML frontmatter located at `_master-skills/{category}/{slug}/SKILL.md`.

```yaml
---
name: ceo
description: Chief Executive Officer - Strategic Advisor. Use when configuring...
---

# Chief Executive Officer Skill

## Purpose
Serve as a strategic advisor to the CEO...

## When to Use
This skill activates when you need assistance with:
- Board meeting preparation and materials
- Investor relations and fundraising communications
...

## Model Configuration
| Setting | Value |
|---------|-------|
| Default Model | `claude-opus-4-5-20251101` |
...

## System Prompt
...

## Best Practices
### Do
- ...
### Don't
- ...

## Related Skills
- [CTO](../cto/SKILL.md)
...
```

Standard sections include: Purpose, When to Use, Model Configuration, System Prompt, Variables, HITL Rules, Features Enabled, Trigger Patterns, Best Practices, Examples, Related Skills, Governance Notes, and Changelog. Not all sections are required for every skill.

## Platform Outputs

| Platform | Variant | Output Path | Format | Count |
|----------|---------|-------------|--------|-------|
| Claude | Main | `platforms/claude/claude-skills/skills/{category}/{slug}/SKILL.md` | Markdown | 508 |
| Claude | CLI | `platforms/claude/claude-skills-cli/skills/{slug}/SKILL.md` | Markdown | 503 |
| Claude | Desktop | `platforms/claude/claude-skills-desktop/.claude-plugin/skills/{slug}/SKILL.md` | Markdown | 508 |
| Claude | Web | `platforms/claude/claude-skills-web/projects/{slug}/project-instructions.md` | Markdown | 508 |
| Gemini | Gems | `platforms/gemini/gemini-skills/gems/{category}/{slug}.json` | JSON | 525 |
| Gemini | CLI | `platforms/gemini/gemini-skills-cli/skills/{slug}/SKILL.md` | Markdown | 507 |
| Gemini | Studio | `platforms/gemini/gemini-skills-studio/prompts/{slug}/` | .md + .json | 258 pairs |
| Gemini | Agents | `platforms/gemini/gemini-skills-agents/.gemini/agents/{slug}/` | GEMINI.md + .json | 508 pairs |
| Copilot | Agent Skills | `platforms/github-copilot/copilot-skills/agent-skills/{category}/{slug}/SKILL.md` | Markdown | 512 |
| Copilot | Custom Inst. | `platforms/github-copilot/copilot-skills/custom-instructions/{category}/{slug}.md` | Markdown | 519 |
| Copilot | CLI | `platforms/github-copilot/copilot-skills-cli/skills/{slug}/SKILL.md` | Markdown | 507 |
| Copilot | Frontier | `platforms/github-copilot/copilot-skills-frontier/skills/{slug}/SKILL.md` | Markdown | 508 |
| Codex | Multi-format | `platforms/codex/codex-skills/` | JSON + TXT | 3,054 |
| Codex | CLI | `platforms/codex/codex-skills-cli/skills/{slug}/AGENTS.md` | Markdown | 508 |
| Universal | Adapters | `adapters/universal/output/` | JS + JSON | 2,325 |

CLI variant counts (503-507) differ slightly due to filtering rules for CLI-appropriate skills.

## Pipeline Architecture

The pipeline runs in three stages:

```
Stage 1: Quality Fixes        Stage 2: Conversion           Stage 3: Population
========================       ========================       ========================
scripts/fix-skills-unified.py  scripts/sync-skills.py         scripts/populate-all.py
  Single unified script:         --targets gemini               Phase 1: bundles
  frontmatter, descriptions,     --targets copilot              Phase 2: variants
  section structure, slug        --targets codex                Phase 3: quality
  names, description trimming    --targets claude               Phase 4: cleanup
                                 --targets cli
```

**Stage 1 -- Quality Fixes.** A single unified script normalizes the 513 master skills: fixing YAML frontmatter, enforcing section structure, and cleaning up slug names and descriptions.

**Stage 2 -- Conversion.** `scripts/sync-skills.py` reads master skills and converts them to each platform format. It delegates to dedicated converters and optionally runs validation and metadata enrichment via the `lib/` modules.

**Stage 3 -- Population.** `scripts/populate-all.py` orchestrates bundle generation across Gemini, Codex, and Copilot; populates thin variants (Copilot Frontier, Gemini Agents, Claude Desktop, Claude Web); runs a final quality pass; and cleans up deprecated files.

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ (for JavaScript converters and UniversalAdapters)
- PyYAML

### Install

```bash
pip install -r requirements.txt
```

On Windows, set UTF-8 encoding to avoid cp1252 issues:

```bash
set PYTHONIOENCODING=utf-8
```

### Run the Full Pipeline

```bash
# Stage 1: Quality fixes
python scripts/fix-skills-unified.py

# Stage 2: Convert to all platforms
python scripts/sync-skills.py --targets all

# Stage 3: Populate bundles, variants, and cleanup
python scripts/populate-all.py --phase all
```

### Common Operations

```bash
# Convert a single skill to all platforms
python scripts/sync-skills.py --skill technical/api-development --targets all

# Convert one category to Gemini only
python scripts/sync-skills.py --category ai-agents --targets gemini

# Dry run (no writes)
python scripts/sync-skills.py --targets all --dry-run
python scripts/populate-all.py --phase all --dry-run

# Show statistics after conversion
python scripts/sync-skills.py --targets all --stats

# Run validation
python scripts/sync-skills.py --targets all --validate

# Run only bundles phase
python scripts/populate-all.py --phase bundles
```

## Script Reference

| Script | Purpose | Key Flags |
|--------|---------|-----------|
| `scripts/sync-skills.py` | Multi-platform converter (5 targets) | `--targets`, `--skill`, `--category`, `--validate`, `--dry-run`, `--stats` |
| `scripts/populate-all.py` | Orchestrator (bundles, variants, quality, cleanup) | `--phase {all,bundles,variants,quality,cleanup}`, `--dry-run` |
| `scripts/fix-skills-unified.py` | Consolidated quality fix script (frontmatter, structure, slugs) | runs on `_master-skills/` |

## Shared Libraries (lib/)

| Module | Size | Purpose |
|--------|------|---------|
| `config.py` | -- | Central paths, category lists, platform constants, temperature maps |
| `encoding.py` | -- | Windows UTF-8 helper for file I/O |
| `logger.py` | -- | Structured logging utilities |
| `metadata_enricher.py` | 24 KB | `auto_tag()`, `detect_related_skills()`, `estimate_complexity()`, `enrich_all()` |
| `platform_tuning.py` | 15 KB | `get_gemini_settings()`, `get_codex_settings()`, `get_copilot_settings()`, `get_claude_settings()` |
| `skill_parser.py` | -- | YAML frontmatter + Markdown body parser |
| `skill_validator.py` | 31 KB | `SkillValidator` class, `validate_all()`, quality scoring engine |

## Bundle System

Bundles are curated subsets of skills packaged for specific use cases. 18 bundles span three platforms totaling roughly 3,000 files.

### Gemini Bundles (GeminiSkills/bundles/)

| Bundle | Skills | Description |
|--------|--------|-------------|
| gems-full | 508 | Complete skill set as Gem JSON |
| by-category | 508 | Organized by category subdirectories |
| vertex-enterprise | 53 | Enterprise-grade skills for Vertex AI |
| studio-essential-30 | 30 | Core skills for AI Studio |
| agent-chains-20 | 20 | Multi-agent workflow chains |
| idx-workspace | 20 | IDX development workspace skills |
| studio-creative-15 | 15 | Creative-focused Studio skills |

### Copilot Bundles (CopilotSkills/bundles/)

| Bundle | Skills | Description |
|--------|--------|-------------|
| by-category | 508 | Organized by category subdirectories |
| workspace-by-stack | 79 | Grouped by technology stack |
| agent-skills-50 | 50 | Top agent-mode skills |
| workspace-essential-30 | 30 | Core workspace skills |
| coding-agent-20 | 20 | Development-focused agent skills |
| chat-participants-20 | 20 | Chat participant configurations |

### Codex Bundles (CodexSkills/bundles/)

| Bundle | Skills | Description |
|--------|--------|-------------|
| responses-api-full | 508 | Complete set as Responses API JSON |
| by-category | 508 | Organized by category subdirectories |
| enterprise-assistants | 53 | Enterprise assistant configurations |
| gpt-builder-50 | 50 | GPT Builder format skills |
| agent-builder-20 | 20 | Agent Builder format skills |

## UniversalAdapters

The `UniversalAdapters/` directory provides a JavaScript-based adapter layer that converts skills between any platform format at runtime. It contains:

- **8 platform adapters** -- `claude-cli`, `claude-desktop`, `claude-web`, `codex-cli`, `copilot-cli`, `gemini-cli`, `github-repo`, and an `index` aggregator
- **Batch converter** -- bulk conversion across all adapter targets
- **Skill schema** -- `skill-schema.json` defining the canonical skill structure
- **2,313 output files** across 7 platform subdirectories

## Key Technical Details

**Slug resolution.** Skill slugs are derived from the directory name (`file_path.parent.name`), not from slugifying the frontmatter `name` field. Five cross-category collision groups use a `{category}--{slug}` dedup prefix.

**Platform tuning.** Each converter applies platform-specific settings: Gemini gets model selection, temperature, safety settings, and grounding config; Codex gets Responses API structure plus GPT Builder and Agent Builder variants; Copilot gets custom-instruction, agent-skill, and chat-participant formats.

**Encoding.** On Windows, run scripts with `PYTHONIOENCODING=utf-8` to avoid cp1252 encoding errors.

## License

MIT License. Copyright (c) 2025-2026 Kyler. See [LICENSE](LICENSE) for full text.
