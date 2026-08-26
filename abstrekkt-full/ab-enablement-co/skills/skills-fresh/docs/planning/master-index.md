# Skills Multi-Platform Master Index

## Project Status: ACTIVE

The Skills library contains 507 master skills across 6 categories, with automated pipelines converting to all supported platforms (14 output targets across 4 ecosystems).

---

## Skill Categories

| Category | Skills | Description |
|----------|--------|-------------|
| ai-agents | 232 | Autonomous agent patterns, tool-use orchestration, multi-agent workflows |
| technical | 127 | Software engineering, DevOps, architecture, code review |
| strategy | 59 | Business strategy, competitive analysis, market research |
| creative | 40 | Writing, design, content generation, brainstorming |
| operations | 24 | Project management, process optimization, logistics |
| industry | 25 | Healthcare, finance, legal, manufacturing verticals |
| **Total** | **507** | |

---

## Platform Distribution

### Claude

| Platform | Directory | Format | Description |
|----------|-----------|--------|-------------|
| Claude (source) | `ClaudeSkills/` | `SKILL.md` | Master source skills (web/desktop) |
| Claude Code CLI | `ClaudeSkills-CLI/` | `.claude/commands/SKILL.md` | CLI slash-commands |
| Claude Desktop | `ClaudeSkills-Desktop/` | `.claude-plugin/skills/SKILL.md` | Desktop plugin skills |
| Claude Web | `ClaudeSkills-Web/` | `projects/SKILL.md` | Claude.ai project skills |

### Gemini

| Platform | Directory | Format | Description |
|----------|-----------|--------|-------------|
| Gemini Gems | `GeminiSkills/` | `.gem.json` | Gems with model/temperature tuning |
| Gemini CLI | `GeminiSkills-CLI/` | `.gemini/skills/GEMINI.md` | CLI skills |
| Gemini Studio | `GeminiSkills-Studio/` | `prompts/GEMINI.md` | AI Studio prompts |
| Gemini Agents | `GeminiSkills-Agents/` | `.gemini/agents/GEMINI.md` | Multi-step agent configs |

### Codex (OpenAI)

| Platform | Directory | Format | Description |
|----------|-----------|--------|-------------|
| Codex (Responses API, GPTs, Agents) | `CodexSkills/` | Responses API JSON / GPT config | Responses API, GPTs, and Agents |
| Codex CLI | `CodexSkills-CLI/` | `.codex/agents.md` | CLI agent instructions |

### Copilot (GitHub / Microsoft)

| Platform | Directory | Format | Description |
|----------|-----------|--------|-------------|
| Copilot | `CopilotSkills/` | `copilot-instructions.md` | Instructions and agent skills |
| Copilot CLI | `CopilotSkills-CLI/` | `.github/copilot-instructions.md` | CLI instruction files |
| Copilot Frontier | `CopilotSkills-Frontier/` | `declarativeAgent.json` | M365 Copilot declarative agents |

---

## Pipeline Tools

### Converters

| Script | Status | Purpose |
|--------|--------|---------|
| `sync-skills.py` | Active | Master sync: discovers, validates, and fans out skills to all platforms |
| `convert_to_gems.py` | Active | Converts to Gemini Gems with dynamic model selection, category-based temperature, safety settings, grounding instructions, auto-tagging, and bundle generation |
| `convert-to-copilot.js` | Active | Converts to Copilot instruction and agent-skill formats |
| `convert_to_codex_responses.py` | **NEW** | Converts to OpenAI Codex Responses API / GPT / Agent formats |
| `convert_to_cli_skills.py` | **NEW** | Converts to CLI-native formats for Claude, Gemini, Codex, and Copilot CLIs |
| `populate_all.py` | Active | Top-level orchestrator: bundles, variants, quality checks, and cleanup (4 phases) |
| `convert_to_gems.js` | **DEPRECATED** | Legacy JS Gem converter -- use `convert_to_gems.py` instead |

### Libraries

| Module | Purpose |
|--------|---------|
| `lib/platform_tuning.py` | Per-platform model, temperature, and safety defaults |
| `lib/skill_validator.py` | Validates SKILL.md frontmatter, structure, and content |
| `lib/metadata_enricher.py` | Auto-tags skills with category, complexity, and platform hints |

---

## Quality Standards

Every skill -- source or converted -- must pass the following checks before merge:

- [ ] Valid YAML frontmatter (`name`, `description`, `category` required)
- [ ] Body contains at least one actionable instruction section
- [ ] No hardcoded API keys, secrets, or PII
- [ ] Platform-specific formatting verified (JSON valid for Gems/Codex, Markdown valid for CLI)
- [ ] Metadata enriched (tags, complexity rating, compatible platforms)
- [ ] Validator passes: `python lib/skill_validator.py --strict <file>`
- [ ] Tested on target platform or emulator before release

---

## Bundles

Bundles group related skills into installable packages so users can adopt an entire capability in one step rather than picking individual skills. There are **18 bundles** across 3 platforms:

| Platform | Bundles | Location |
|----------|---------|----------|
| Gemini | 7 (gems-full, by-category, vertex-enterprise, studio-essential-30, agent-chains-20, idx-workspace, studio-creative-15) | `GeminiSkills/bundles/` |
| Copilot | 6 (by-category, workspace-by-stack, agent-skills-50, workspace-essential-30, coding-agent-20, chat-participants-20) | `CopilotSkills/bundles/` |
| Codex | 5 (responses-api-full, by-category, enterprise-assistants, gpt-builder-50, agent-builder-20) | `CodexSkills/bundles/` |

**Bundling strategy:**

- Each bundle targets a persona or workflow (e.g., "Full-Stack Dev", "Startup Founder", "Security Auditor").
- Bundles are defined in `bundles/` as YAML manifests listing the included skill IDs.
- The pipeline tools (`sync-skills.py`, `convert_to_gems.py`, `populate_all.py`, etc.) generate platform-native bundle artifacts automatically.
- A bundle may span multiple categories -- for example, "DevOps Pro" pulls from `technical`, `operations`, and `ai-agents`.
- Named bundles range from 15 to 79 skills; full bundles contain 508 entries each.

---

## Quick Start

### Claude Desktop (Windows)
```powershell
Copy-Item -Recurse "D:\02_Development\Skills\ClaudeSkills-Desktop\.claude-plugin" "$env:APPDATA\Claude\"
```

### Claude Desktop (macOS)
```bash
cp -r ClaudeSkills-Desktop/.claude-plugin ~/Library/Application\ Support/Claude/
```

### Claude Code CLI
```bash
cp -r ClaudeSkills-CLI/.claude/commands ~/.claude/commands
```

### Gemini CLI
```bash
cp -r GeminiSkills-CLI/.gemini ~/.gemini
```

### Gemini Agents
```bash
cp -r GeminiSkills-Agents/.gemini/agents ~/.gemini/agents
```

### GitHub Copilot
```bash
cp -r CopilotSkills-CLI/.github .github
```

### OpenAI Codex
```bash
cp -r CodexSkills-CLI/.codex ~/.codex
```

---

## Documentation

The full documentation is in the `docs/` directory. Start with the [Documentation Index](docs/INDEX.md).

| Document | Location | Description |
|----------|----------|-------------|
| Documentation Index | `docs/INDEX.md` | Central navigation hub for all docs |
| Quickstart | `docs/01-getting-started/quickstart.md` | 5-minute setup for any platform |
| Deploy to Claude | `docs/01-getting-started/deploying-to-claude.md` | All 4 Claude variants |
| Deploy to Gemini | `docs/01-getting-started/deploying-to-gemini.md` | Gems, CLI, Studio, Agents |
| Deploy to Copilot | `docs/01-getting-started/deploying-to-copilot.md` | VS Code, CLI, Frontier |
| Deploy to Codex | `docs/01-getting-started/deploying-to-codex.md` | Responses API, GPT Builder, CLI |
| FAQ | `docs/01-getting-started/faq.md` | Common questions answered |
| Architecture | `docs/ARCHITECTURE.md` | System design and data flow |
| Scripts Reference | `docs/SCRIPTS_REFERENCE.md` | All pipeline scripts with arguments |
| Platform Outputs | `docs/PLATFORM_OUTPUTS.md` | Output format specs for every target |
| Skill Format Spec | `docs/SKILL_FORMAT_SPEC.md` | SKILL.md format and validation rules |
| Development Guide | `docs/DEVELOPMENT_GUIDE.md` | Contributing and local development |

---

**Last Updated:** February 2026
**Master Skills:** 507
**Platforms Supported:** 14 targets across 4 ecosystems (Claude, Gemini, Codex, Copilot)
**Bundles:** 18 across 3 platforms (Gemini 7, Copilot 6, Codex 5)
