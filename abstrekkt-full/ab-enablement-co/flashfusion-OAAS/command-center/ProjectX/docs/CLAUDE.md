# CLAUDE.md - ProjectX

This file provides guidance to Claude Code when working with projects in this directory.

## Project Overview

ProjectX contains multiple subprojects and repositories for development and reference.

---

## Agent-Specific Instructions

<!-- AUTO-SYNCED from AGENTS.md files - Last updated: 2026-01-19 -->
<!-- Source files:
  - ./awesome-copilot-main/awesome-copilot-main/AGENTS.md
  - ./boilerplates-main/boilerplates-main/AGENTS.md
  - ./spec-kit-main/spec-kit-main/AGENTS.md
  - ./SuperClaude-master/SuperClaude-master/AGENTS.md
-->
<!-- In case of conflicts, Agent-Specific Instructions take precedence -->

---

### Awesome Copilot (./awesome-copilot-main/)

**Project**: Community-driven collection of custom agents, prompts, and instructions for GitHub Copilot.

**Structure**:
- `agents/` - Custom GitHub Copilot agent definitions (.agent.md files)
- `prompts/` - Task-specific prompts (.prompt.md files)
- `instructions/` - Coding standards and guidelines (.instructions.md files)
- `skills/` - Agent Skills folders (SKILL.md + bundled assets)
- `collections/` - Curated collections of resources

**Commands**:
```bash
npm ci                      # Install dependencies
npm run build               # Generate README.md
npm run collection:validate # Validate collection manifests
npm run skill:validate      # Validate agent skills
npm run skill:create -- --name <skill-name>  # Create new skill
```

**Key Rules**:
- All files must include proper markdown front matter
- File names: lower-case with hyphens
- Always run `bash scripts/fix-line-endings.sh` before committing (CRLF → LF)
- Skills follow the Agent Skills specification at agentskills.io

---

### Boilerplates (./boilerplates-main/)

**Project**: Infrastructure templates with Python CLI for Terraform, Docker, Ansible, Kubernetes.

**Structure**:
- `cli/` - Python CLI application (Typer + Jinja2)
- `cli/core/` - Core components (collection, config, display, template)
- `cli/core/schema/` - JSON schema definitions for all modules
- `cli/modules/` - Technology-specific modules (compose, terraform, etc.)
- `library/` - Template collections by module
- `archetypes/` - Testing tool for template snippets

**Commands**:
```bash
python3 -m cli                           # Run CLI
python3 -m cli --log-level DEBUG compose list  # Debug mode
yamllint <file>                          # Lint YAML
ruff check --fix . && ruff format .      # Lint + format Python
```

**Critical Rules**:
- **NEVER** use `console.print()` outside display manager classes
- **ALWAYS** use `module_instance.display.display_*()` for ALL output
- DisplayManager is the ONLY interface for CLI output rendering
- Templates inherit ALL variables from module schema version
- Variable precedence: module < template < user config < CLI

**Template Versioning**:
- `metadata.version` should match the underlying application version (e.g., nginx:1.25.3)
- Schemas use 2-level versioning: MAJOR.MINOR (e.g., "1.0", "1.2")

---

### Spec Kit (./spec-kit-main/)

**Project**: Toolkit for Spec-Driven Development (SDD) with multi-agent support.

**Supported Agents**: Claude Code, Gemini CLI, GitHub Copilot, Cursor, Qwen, opencode, Codex, Windsurf, Kilo Code, Auggie, Roo Code, CodeBuddy, Qoder, Amazon Q, Amp, SHAI, IBM Bob

**Key Design Rule**:
Use **actual CLI tool names** as AGENT_CONFIG keys (e.g., `"cursor-agent"` not `"cursor"`).

**Changes to `__init__.py`** require:
1. Version bump in `pyproject.toml`
2. Entry in `CHANGELOG.md`

**Command Formats**:
- Markdown agents: `$ARGUMENTS` placeholder
- TOML agents (Gemini, Qwen): `{{args}}` placeholder
- Script placeholder: `{SCRIPT}`

---

### SuperClaude Framework (./SuperClaude-master/)

**Project**: Python package with pytest plugin + slash commands for AI-assisted development.

**CRITICAL**: Use **UV** for all Python operations. Never use `python -m`, `pip install` directly.

**Commands**:
```bash
uv run pytest                    # Run tests
uv run pytest tests/pm_agent/   # Run specific tests
uv pip install package           # Install dependencies
make dev                         # Install editable with dev deps
make verify                      # Verify installation
make lint && make format         # Code quality
```

**Core Patterns**:
1. **ConfidenceChecker**: Pre-execution assessment (≥90% proceed, 70-89% alternatives, <70% ask)
2. **SelfCheckProtocol**: Post-implementation evidence-based validation
3. **ReflexionPattern**: Error learning and prevention

**Parallel Execution**: Wave → Checkpoint → Wave pattern (3.5x faster)

**MCP Servers**: Use `superclaude mcp` for interactive install (gateway recommended)

**Git Workflow**: `master` ← `integration` ← `feature/*`, `fix/*`, `docs/*`

---

## General Development Guidelines

1. **Evidence-Based**: Never guess - verify with official docs before implementation
2. **Confidence-First**: Check confidence BEFORE starting work
3. **Parallel-First**: Use Wave → Checkpoint → Wave pattern where possible
4. **Token Efficiency**: Simple (200), Medium (1000), Complex (2500 tokens)

---

*This file was auto-generated by `/sync-agent-context`. Edit source AGENTS.md files and re-run to update.*
