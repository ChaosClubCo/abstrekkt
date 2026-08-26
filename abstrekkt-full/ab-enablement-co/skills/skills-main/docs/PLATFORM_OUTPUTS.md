# Platform Output Documentation

Comprehensive reference for all platform-specific outputs produced by the Skills Library pipeline. This document covers file formats, directory structures, JSON schemas, and file counts for every output variant across four AI platforms, plus the UniversalAdapters cross-platform tooling and the bundle system.

---

## Table of Contents

1. [Overview](#overview)
2. [Claude Platform](#claude-platform)
3. [Gemini Platform](#gemini-platform)
4. [Codex Platform](#codex-platform)
5. [Copilot Platform](#copilot-platform)
6. [UniversalAdapters](#universaladapters)
7. [Bundles](#bundles)
8. [File Count Summary](#file-count-summary)

---

## Overview

The Skills Library converts 508 master skill definitions (in `_master-skills/`) into platform-native formats for four AI coding platforms. Each platform has multiple output variants targeting different deployment contexts (CLI, desktop, web, studio, agent, etc.).

### Platform Summary

| Platform | Variants | Primary Format | Total Skill Files |
|----------|----------|----------------|-------------------|
| Claude (Anthropic) | 4 | Markdown (SKILL.md) with YAML frontmatter | ~2,027 |
| Gemini (Google) | 4 + extras | JSON (.gem.json) and Markdown (GEMINI.md) | ~2,041+ |
| Codex (OpenAI) | 2 | JSON (.response.json, .gpt.json, .agent.json) + TXT | ~3,079 |
| Copilot (GitHub) | 3 | Markdown (SKILL.md, .md) with YAML frontmatter | ~2,039 |

Additional outputs:
- **UniversalAdapters** -- 7 platform subdirectories with 4,563 output files
- **GitHubRepoAgents** -- 258 files (agents, configs, workflows)
- **Bundles** -- 18 curated bundles across 3 platforms totaling ~2,874 files

### Category Distribution (Master Skills)

| Category | Count |
|----------|-------|
| ai-agents | 232 |
| technical | 127 |
| strategy | 59 |
| creative | 40 |
| operations | 25 |
| industry | 25 |
| **Total** | **508** |

---

## Claude Platform

**Location:** `Claude/`

Claude has four output variants, all using Markdown with YAML frontmatter. The differences lie in frontmatter richness, directory layout, and platform-specific conventions.

### ClaudeSkills (Main)

**Path:** `Claude/ClaudeSkills/skills/{category}/{slug}/SKILL.md`
**Count:** 508 SKILL.md files
**Organization:** By category (ai-agents, technical, strategy, creative, operations, industry)

This is the primary, most enriched Claude output. Each skill has extended frontmatter with model hints, tool references, tags, and complexity scoring.

#### Directory Structure

```
Claude/ClaudeSkills/
  skills/
    ai-agents/
      accessibility-design/
        SKILL.md
      access-management/
        SKILL.md
      ...
    technical/
      ...
    strategy/
      ...
    creative/
      ...
    operations/
      ...
    industry/
      ...
```

#### Frontmatter Schema

```yaml
---
name: "skill-slug"
description: "Skill description text."
version: "1.0.0"
category: ai-agents
complexity: complex          # simple | moderate | complex | advanced
tags: ["tag1", "tag2", ...]
model: claude-opus-4-6
max_tokens: 16384
tool_hints:
  - type: mcp
    name: web_search
    description: "Search the web..."
  - type: mcp
    name: subagent
    description: "Delegate subtasks..."
synced_at: "2026-02-09T18:36:17.762950+00:00"
---
```

#### Content Structure

After frontmatter, each file contains:
1. MCP Tool References header (standard boilerplate)
2. Skill title as H1
3. Instructions section with blockquote description
4. Skill Overview
5. Core Capabilities (with subsections)
6. Domain-specific content (varies by skill)
7. Integration Points / Related Skills
8. Success Metrics
9. Version History table

### ClaudeSkills-CLI

**Path:** `Claude/ClaudeSkills-CLI/skills/{slug}/SKILL.md`
**Count:** 503 SKILL.md files
**Organization:** Flat by slug (no category subdirectories)

Simplified format for Claude Code CLI auto-discovery. Minimal frontmatter with just `name` and `description`.

#### Directory Structure

```
Claude/ClaudeSkills-CLI/
  CLAUDE.md          # Project index with full skill listing
  skills/
    accessibility-design/
      SKILL.md
    access-management/
      SKILL.md
    ...
```

#### Frontmatter Schema

```yaml
---
name: skill-slug
description: "Skill description text."
---
```

### ClaudeSkills-Desktop

**Path:** `Claude/ClaudeSkills-Desktop/.claude-plugin/skills/{slug}/SKILL.md`
**Count:** 508 SKILL.md files
**Organization:** Flat by slug under `.claude-plugin/` directory

Targets Claude Desktop plugin format. Uses the `.claude-plugin/` convention for plugin discovery. Minimal frontmatter identical to CLI variant.

#### Directory Structure

```
Claude/ClaudeSkills-Desktop/
  .claude-plugin/
    skills/
      accessibility-design/
        SKILL.md
      access-management/
        SKILL.md
      ...
```

#### Frontmatter Schema

```yaml
---
name: skill-slug
description: "Skill description text."
---
```

### ClaudeSkills-Web

**Path:** `Claude/ClaudeSkills-Web/projects/{slug}/project-instructions.md`
**Count:** 508 project-instructions.md files
**Organization:** Flat by slug

Formatted for Claude.ai web projects. No YAML frontmatter; instead uses a plain Markdown header with the slug as H1 followed by the description as body text, then the full instructions.

#### Directory Structure

```
Claude/ClaudeSkills-Web/
  projects/
    accessibility-design/
      project-instructions.md
    access-management/
      project-instructions.md
    ...
```

#### Content Format

```markdown
# skill-slug

Description text here.

## Instructions

# Skill Title

## Instructions

> Blockquote description.

## Skill Overview
...
```

### Claude Format Comparison

| Feature | ClaudeSkills | ClaudeSkills-CLI | ClaudeSkills-Desktop | ClaudeSkills-Web |
|---------|-------------|-----------------|---------------------|-----------------|
| File name | SKILL.md | SKILL.md | SKILL.md | project-instructions.md |
| Category dirs | Yes | No | No | No |
| Frontmatter | Rich (model, tags, tools, complexity) | Minimal (name, description) | Minimal (name, description) | None |
| MCP boilerplate | Yes | No | No | No |
| Count | 508 | 503 | 508 | 508 |

---

## Gemini Platform

**Location:** `Gemini/`

Gemini outputs use a mix of JSON configuration files and Markdown instruction files. The platform has four main variants plus several specialized outputs (super-gems, IDX workspaces, AI Studio, Vertex AI).

### GeminiSkills (Gems)

**Path:** `Gemini/GeminiSkills/gems/{category}/{slug}.gem.json`
**Count:** 519 .gem.json files
**Organization:** By category

The primary Gemini output. Each gem is a self-contained JSON file with the full system instruction, model settings, safety settings, and metadata.

#### Directory Structure

```
Gemini/GeminiSkills/
  gems/
    ai-agents/
      accessibility-design.gem.json
      access-management.gem.json
      ...
    technical/
      ...
    strategy/
      ...
    creative/
      ...
    operations/
      ...
    industry/
      ...
  super-gems/          # 50 files
    agent-chains/
    interactive-apps/
    multi-step-workflows/
  idx-workspaces/      # 6 files
    extensions/
    nix-configs/
    templates/
  ai-studio/           # 1 file (prompt-library.json)
  vertex-ai/           # 1 file (deployment-config.yaml)
  bundles/             # 7 bundle directories
```

#### Gem JSON Schema

```json
{
  "name": "skill-slug",
  "description": "Skill description.",
  "systemInstruction": "# Skill Title\n\n## Instructions\n\n...(full markdown body)...",
  "context": {
    "files": [],
    "knowledgeBase": []
  },
  "settings": {
    "temperature": 0.5,
    "model": "gemini-2.5-pro",
    "topP": 0.95,
    "topK": 40,
    "maxOutputTokens": 8192
  },
  "safetySettings": [
    { "category": "HARM_CATEGORY_HARASSMENT",         "threshold": "BLOCK_ONLY_HIGH" },
    { "category": "HARM_CATEGORY_HATE_SPEECH",        "threshold": "BLOCK_ONLY_HIGH" },
    { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",   "threshold": "BLOCK_ONLY_HIGH" },
    { "category": "HARM_CATEGORY_DANGEROUS_CONTENT",   "threshold": "BLOCK_ONLY_HIGH" }
  ],
  "metadata": {
    "category": "ai-agents",
    "version": "1.0.0",
    "source": "master-skills",
    "complexity": "advanced",
    "tags": ["tag1", "tag2", ...]
  }
}
```

Key features of the gem format:
- **Model selection** is dynamic per complexity (gemini-2.5-pro for advanced, gemini-2.5-flash for standard)
- **Safety settings** use BLOCK_ONLY_HIGH across all four harm categories
- **Temperature** varies by skill complexity (typically 0.3-0.7)
- **systemInstruction** contains the full skill body as escaped markdown

### GeminiSkills-CLI

**Path:** `Gemini/GeminiSkills-CLI/skills/{slug}/SKILL.md`
**Secondary:** `Gemini/GeminiSkills-CLI/.gemini/skills/{slug}/GEMINI.md`
**Count:** 507 SKILL.md files + 257 GEMINI.md files in `.gemini/skills/`
**Organization:** Flat by slug

Targets Gemini CLI (gemini-cli) auto-discovery. Contains skills in two locations: a `skills/` directory with SKILL.md files, and a `.gemini/skills/` directory with GEMINI.md files for Gemini-native discovery.

#### Directory Structure

```
Gemini/GeminiSkills-CLI/
  GEMINI.md            # Project-level config
  config/
  skills/
    accessibility-design/
      SKILL.md
    ...
  .gemini/
    skills/
      accessibility-design/
        GEMINI.md
      ...
```

### GeminiSkills-Studio

**Path:** `Gemini/GeminiSkills-Studio/prompts/{slug}/`
**Count:** 507 paired sets (GEMINI.md + .json per skill)
**Organization:** Flat by slug

Each skill produces a paired output: a GEMINI.md file (the prompt/instruction content) and a JSON configuration file (model, safety settings, category metadata).

#### Directory Structure

```
Gemini/GeminiSkills-Studio/
  prompts/
    accessibility-design/
      GEMINI.md
      accessibility-design.json
    access-management/
      GEMINI.md
      access-management.json
    ...
```

#### GEMINI.md Frontmatter

```yaml
---
name: skill-slug
description: Skill description text.
platform: gemini-studio
model: gemini-2.5-flash
temperature: 0.5
---
```

#### Studio JSON Schema

```json
{
  "name": "skill-slug",
  "description": "Skill description.",
  "model": "gemini-2.5-flash",
  "temperature": 0.5,
  "category": "ai-agents",
  "safetySettings": [
    { "category": "HARM_CATEGORY_HARASSMENT",          "threshold": "BLOCK_ONLY_HIGH" },
    { "category": "HARM_CATEGORY_HATE_SPEECH",         "threshold": "BLOCK_ONLY_HIGH" },
    { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",    "threshold": "BLOCK_ONLY_HIGH" },
    { "category": "HARM_CATEGORY_DANGEROUS_CONTENT",    "threshold": "BLOCK_ONLY_HIGH" },
    { "category": "HARM_CATEGORY_CIVIC_INTEGRITY",      "threshold": "BLOCK_ONLY_HIGH" }
  ],
  "version": "1.0.0"
}
```

Note: Studio JSON includes an additional safety category (`HARM_CATEGORY_CIVIC_INTEGRITY`) compared to the gem format.

### GeminiSkills-Agents

**Path:** `Gemini/GeminiSkills-Agents/.gemini/agents/{slug}/`
**Count:** 508 paired sets (GEMINI.md + gemini.config.json per skill)
**Organization:** Flat by slug under `.gemini/agents/`

Targets Gemini's agent deployment format. Each agent has a GEMINI.md instruction file and a `gemini.config.json` that references it, plus specifies tools.

#### Directory Structure

```
Gemini/GeminiSkills-Agents/
  .gemini/
    agents/
      accessibility-design/
        GEMINI.md
        gemini.config.json
      access-management/
        GEMINI.md
        gemini.config.json
      ...
```

#### Agent Config JSON Schema

```json
{
  "name": "skill-slug",
  "version": "1.0.0",
  "model": "gemini-2.5-pro",
  "instructions": "./GEMINI.md",
  "tools": [
    { "name": "code_execution" },
    { "name": "google_search" }
  ]
}
```

#### Agent GEMINI.md Frontmatter

```yaml
---
name: skill-slug
description: "Skill description."
platform: gemini-cli
---
```

### Gemini Extras

| Output | Location | Files | Description |
|--------|----------|-------|-------------|
| super-gems | `GeminiSkills/super-gems/` | 50 | Multi-step workflows, agent chains, interactive apps |
| idx-workspaces | `GeminiSkills/idx-workspaces/` | 6 | IDX (Project IDX) workspace templates, Nix configs |
| ai-studio | `GeminiSkills/ai-studio/` | 1 | Prompt library JSON for AI Studio |
| vertex-ai | `GeminiSkills/vertex-ai/` | 1 | Deployment config YAML for Vertex AI |

### Gemini Format Comparison

| Feature | GeminiSkills | GeminiSkills-CLI | GeminiSkills-Studio | GeminiSkills-Agents |
|---------|-------------|-----------------|--------------------|--------------------|
| Primary file | .gem.json | SKILL.md / GEMINI.md | GEMINI.md + .json | GEMINI.md + gemini.config.json |
| Model config | In JSON (settings) | None | In JSON | In gemini.config.json |
| Safety settings | 4 categories | None | 5 categories | None (config only) |
| Tools declared | No | No | No | Yes (code_execution, google_search) |
| System instruction | Embedded in JSON | Markdown body | Markdown body | Markdown body (referenced) |
| Count | 519 | 507 + 257 | 507 pairs | 508 pairs |

---

## Codex Platform

**Location:** `Codex/`

Codex (OpenAI) outputs are the most diverse in format. A single master skill produces up to four different JSON/TXT files, each targeting a different OpenAI product surface.

### CodexSkills

**Path:** `Codex/CodexSkills/`
**Organization:** By format type, then by category

CodexSkills contains four parallel output trees, each organized by category:

#### Directory Structure

```
Codex/CodexSkills/
  responses/
    ai-agents/
      accessibility-design.response.json
      ...
    technical/
    strategy/
    creative/
    operations/
    industry/                          [Not present - industry in responses only if applicable]
  gpts/
    ai-agents/
      accessibility-design.gpt.json
      ...
  agents/
    ai-agents/
      accessibility-design.agent.json
      ...
  system-prompts/
    accessibility-design.txt           [Flat, no category subdirs]
    access-management.txt
    ...
  bundles/
  cli/
  docs/
```

#### Responses API Format (.response.json)

**Count:** 517 files
Targets the OpenAI Responses API. Contains the model, full instructions as a string, tools, and generation parameters.

```json
{
  "model": "gpt-4o",
  "instructions": "# Skill Title\n\n## Instructions\n\n...(full markdown)...",
  "tools": [
    { "type": "code_interpreter" },
    { "type": "web_search_preview" }
  ],
  "metadata": {
    "skill_name": "accessibility-design",
    "category": "ai-agents",
    "version": "1.0.0",
    "source": "master-skills"
  },
  "temperature": 0.5,
  "top_p": 1.0,
  "max_output_tokens": 4096
}
```

#### GPT Builder Format (.gpt.json)

**Count:** 519 files
Targets the GPT Builder / Custom GPTs interface. Includes conversation starters and capability flags.

```json
{
  "name": "Skill Title",
  "description": "Skill description.",
  "instructions": "# Skill Title\n\n...(full markdown)...",
  "conversation_starters": [
    "Help me set up Skill automation",
    "Design a Skill workflow",
    "What tools integrate best with Skill?",
    "Troubleshoot my Skill implementation"
  ],
  "capabilities": {
    "web_browsing": true,
    "code_interpreter": true,
    "image_generation": false,
    "file_upload": true
  },
  "category": "ai-agents"
}
```

#### Agent Builder Format (.agent.json)

**Count:** 517 files
Targets the OpenAI Agent Builder. Includes agent-specific preamble in instructions, handoff description, and tool declarations.

```json
{
  "name": "Skill Agent",
  "description": "Skill description.",
  "instructions": "You are an autonomous agent. Follow these operating principles:\n1. Break complex tasks into discrete, verifiable steps.\n2. Use your tools to gather information before generating responses.\n3. Verify your work at each step before proceeding.\n4. If uncertain, state your confidence level and reasoning.\n5. Provide structured, actionable output.\n\n# Skill Title\n\n...(full markdown)...",
  "model": "gpt-4o",
  "tools": [
    { "type": "code_interpreter" },
    { "type": "web_search_preview" }
  ],
  "handoff_description": "Skill description.",
  "metadata": {
    "category": "ai-agents",
    "version": "1.0.0"
  }
}
```

#### System Prompt Format (.txt)

**Count:** 1,019 files
Plain text system prompts. Flat directory (no category organization). Contains the raw skill body without JSON wrapping.

### CodexSkills-CLI

**Path:** `Codex/CodexSkills-CLI/skills/{slug}/AGENTS.md`
**Count:** 507 AGENTS.md files
**Organization:** Flat by slug

Targets OpenAI Codex CLI agent discovery. Uses the `AGENTS.md` filename convention.

#### Directory Structure

```
Codex/CodexSkills-CLI/
  skills/
    accessibility-design/
      AGENTS.md
    access-management/
      AGENTS.md
    ...
```

#### Content Format

```markdown
# Skill Title
> Skill description.

## Instructions

# Skill Title

## Instructions

> Blockquote description.

## Skill Overview
...
```

### Codex Format Comparison

| Feature | Responses API | GPT Builder | Agent Builder | System Prompts | CodexSkills-CLI |
|---------|--------------|-------------|---------------|---------------|----------------|
| File ext | .response.json | .gpt.json | .agent.json | .txt | AGENTS.md |
| Model field | Yes (gpt-4o) | No | Yes (gpt-4o) | No | No |
| Tools | code_interpreter, web_search_preview | No (capabilities instead) | code_interpreter, web_search_preview | No | No |
| Conversation starters | No | Yes (4 per skill) | No | No | No |
| Agent preamble | No | No | Yes (5-point operating principles) | No | No |
| Handoff description | No | No | Yes | No | No |
| Category organization | By category | By category | By category | Flat | Flat |
| Count | 517 | 519 | 517 | 1,019 | 507 |

---

## Copilot Platform

**Location:** `GithubCopilot/`

GitHub Copilot outputs use Markdown with YAML frontmatter across all variants. The platform has three main output directories with multiple sub-formats.

### CopilotSkills

**Path:** `GithubCopilot/CopilotSkills/`

Contains three distinct output formats plus workspace configs:

#### Agent Skills

**Path:** `CopilotSkills/agent-skills/{category}/{slug}/SKILL.md`
**Count:** 512 SKILL.md files
**Organization:** By category

Standard Copilot agent skill format with minimal frontmatter.

```
CopilotSkills/
  agent-skills/
    ai-agents/
      accessibility-design/
        SKILL.md
      ...
    technical/
    strategy/
    creative/
    operations/
```

**Frontmatter:**

```yaml
---
name: skill-slug
description: Skill description text.
---
```

#### Custom Instructions

**Path:** `CopilotSkills/custom-instructions/{category}/{slug}.md`
**Count:** 512 .md files
**Organization:** By category (single file per skill, not in subdirectory)

Formatted for Copilot workspace custom instructions. Includes workspace-specific context hints (e.g., `@workspace`, `#file:path`).

```
CopilotSkills/
  custom-instructions/
    ai-agents/
      accessibility-design.md
      access-management.md
      ...
    technical/
    strategy/
    creative/
    operations/
```

**Content format (no YAML frontmatter):**

```markdown
# Skill Title

## Overview
Skill description.

## Workspace Context
When working with this skill in a codebase:
- Reference relevant files using @workspace
- Use #file:path syntax to include specific file context
- Consider the project's existing patterns and conventions

## Instructions
...
```

#### Chat Participants

**Path:** `CopilotSkills/chat-participants/workspace-patterns.md`
**Count:** 1 file

A consolidated workspace patterns reference for Copilot Chat participants.

#### Workspace Configs

**Path:** `CopilotSkills/workspace-configs/`
**Count:** 2 files (`ai-agents-workspace.md`, `technical-workspace.md`)

Curated workspace configuration files grouping related skills.

### CopilotSkills-CLI

**Path:** `GithubCopilot/CopilotSkills-CLI/skills/{slug}/SKILL.md`
**Count:** 507 SKILL.md files
**Organization:** Flat by slug

Standard CLI format with minimal frontmatter.

```
GithubCopilot/CopilotSkills-CLI/
  skills/
    accessibility-design/
      SKILL.md
    ...
```

### CopilotSkills-Frontier

**Path:** `GithubCopilot/CopilotSkills-Frontier/skills/{slug}/SKILL.md`
**Count:** 508 SKILL.md files
**Organization:** Flat by slug

Targets Copilot's frontier/agent mode. Includes `mode: agent` in frontmatter and an additional agent-specific instructions preamble.

**Frontmatter:**

```yaml
---
name: skill-slug
description: "Skill description."
mode: agent
---
```

**Additional content (before core instructions):**

```markdown
## Agent Instructions

When operating autonomously on this task:
1. Read and understand the existing codebase before making changes
2. Break complex tasks into discrete, verifiable steps
3. Test your changes at each step before proceeding
4. Use the terminal to verify builds and test results
5. Commit logical units of work with clear messages

## Core Instructions
```

### Copilot Format Comparison

| Feature | Agent Skills | Custom Instructions | CopilotSkills-CLI | CopilotSkills-Frontier |
|---------|-------------|--------------------|--------------------|----------------------|
| File name | SKILL.md | {slug}.md | SKILL.md | SKILL.md |
| Category dirs | Yes | Yes | No | No |
| Frontmatter | name, description | None | name, description | name, description, mode |
| Workspace hints | No | Yes (@workspace, #file) | No | No |
| Agent preamble | No | No | No | Yes (5-step agent instructions) |
| Count | 512 | 512 | 507 | 508 |

---

## UniversalAdapters

**Location:** `UniversalAdapters/`

A cross-platform conversion toolkit that takes master skills and converts them to any supported platform format using JavaScript adapters.

### Structure

```
UniversalAdapters/
  adapters/                  # 8 JS adapter modules
    claude-cli.js
    claude-desktop.js
    claude-web.js
    codex-cli.js
    copilot-cli.js
    gemini-cli.js
    github-repo.js
    index.js                 # Adapter registry
  converters/
    batch-converter.js       # Bulk conversion orchestrator
  schemas/
    skill-schema.json        # Universal skill schema definition
  output/                    # 7 platform output directories
    claude-cli/              # 507 skill directories
    claude-desktop/
    claude-web/
    codex-cli/
    copilot-cli/
    gemini-cli/
    github-repo/
  package.json
  README.md
```

### Output Directories

Each output subdirectory contains converted skills in the target platform format. The adapter handles format-specific transformations (frontmatter style, file naming, directory structure).

**Total output files:** 4,563

| Output Directory | Target Platform | File Format |
|-----------------|-----------------|-------------|
| `claude-cli/` | Claude Code CLI | `{slug}/SKILL.md` |
| `claude-desktop/` | Claude Desktop plugin | `{slug}/SKILL.md` |
| `claude-web/` | Claude.ai web projects | `{slug}/project-instructions.md` (or SKILL.md) |
| `codex-cli/` | OpenAI Codex CLI | `{slug}/AGENTS.md` |
| `copilot-cli/` | GitHub Copilot CLI | `{slug}/SKILL.md` |
| `gemini-cli/` | Gemini CLI | `{slug}/SKILL.md` |
| `github-repo/` | GitHub repo agent files | Various |

### Adapters

Each adapter (e.g., `claude-cli.js`) implements a common interface:
- Reads the universal skill schema
- Applies platform-specific transformations (frontmatter, content structure, naming)
- Writes to the corresponding output directory

The `batch-converter.js` orchestrates running all adapters across the full skill set.

---

## Bundles

Bundles are curated subsets of skills packaged for specific use cases. They exist for three platforms (Gemini, Copilot, Codex) with a total of 18 named bundles.

### Bundle Inventory

#### Gemini Bundles (7)

| Bundle | Path | Files | Description |
|--------|------|-------|-------------|
| gems-full | `GeminiSkills/bundles/gems-full/` | 508 | Complete gem collection |
| by-category | `GeminiSkills/bundles/by-category/` | 508 | Skills organized by category |
| vertex-enterprise | `GeminiSkills/bundles/vertex-enterprise/` | 53 | Enterprise-grade skills for Vertex AI |
| studio-essential-30 | `GeminiSkills/bundles/studio-essential-30/` | 30 | Top 30 essential skills for AI Studio |
| agent-chains-20 | `GeminiSkills/bundles/agent-chains-20/` | 20 | Multi-agent chain workflows |
| idx-workspace | `GeminiSkills/bundles/idx-workspace/` | 20 | Skills for Project IDX workspaces |
| studio-creative-15 | `GeminiSkills/bundles/studio-creative-15/` | 15 | Creative-focused Studio skills |

#### Copilot Bundles (6)

| Bundle | Path | Files | Description |
|--------|------|-------|-------------|
| by-category | `CopilotSkills/bundles/by-category/` | 508 | Skills organized by category |
| workspace-by-stack | `CopilotSkills/bundles/workspace-by-stack/` | 81 | Skills grouped by technology stack |
| agent-skills-50 | `CopilotSkills/bundles/agent-skills-50/` | 50 | Top 50 agent-mode skills |
| workspace-essential-30 | `CopilotSkills/bundles/workspace-essential-30/` | 30 | Essential workspace skills |
| coding-agent-20 | `CopilotSkills/bundles/coding-agent-20/` | 20 | Coding-focused agent skills |
| chat-participants-20 | `CopilotSkills/bundles/chat-participants-20/` | 20 | Chat participant skill set |

#### Codex Bundles (5)

| Bundle | Path | Files | Description |
|--------|------|-------|-------------|
| responses-api-full | `CodexSkills/bundles/responses-api-full/` | 508 | Complete Responses API collection |
| by-category | `CodexSkills/bundles/by-category/` | 508 | Skills organized by category |
| enterprise-assistants | `CodexSkills/bundles/enterprise-assistants/` | 53 | Enterprise-grade assistant skills |
| gpt-builder-50 | `CodexSkills/bundles/gpt-builder-50/` | 50 | Top 50 GPT Builder skills |
| agent-builder-20 | `CodexSkills/bundles/agent-builder-20/` | 20 | Top 20 Agent Builder skills |

### Bundle Totals

| Platform | Bundles | Total Bundle Files |
|----------|---------|-------------------|
| Gemini | 7 | 1,154 |
| Copilot | 6 | 709 |
| Codex | 5 | 1,139 |
| **Total** | **18** | **3,002** |

---

## File Count Summary

### Primary Skill Outputs

| Platform | Variant | Path Pattern | Count |
|----------|---------|-------------|-------|
| Claude | ClaudeSkills (main) | `Claude/ClaudeSkills/skills/{cat}/{slug}/SKILL.md` | 508 |
| Claude | ClaudeSkills-CLI | `Claude/ClaudeSkills-CLI/skills/{slug}/SKILL.md` | 503 |
| Claude | ClaudeSkills-Desktop | `Claude/ClaudeSkills-Desktop/.claude-plugin/skills/{slug}/SKILL.md` | 508 |
| Claude | ClaudeSkills-Web | `Claude/ClaudeSkills-Web/projects/{slug}/project-instructions.md` | 508 |
| Gemini | GeminiSkills (gems) | `Gemini/GeminiSkills/gems/{cat}/{slug}.gem.json` | 519 |
| Gemini | GeminiSkills-CLI (skills) | `Gemini/GeminiSkills-CLI/skills/{slug}/SKILL.md` | 507 |
| Gemini | GeminiSkills-CLI (.gemini) | `Gemini/GeminiSkills-CLI/.gemini/skills/{slug}/GEMINI.md` | 257 |
| Gemini | GeminiSkills-Studio | `Gemini/GeminiSkills-Studio/prompts/{slug}/GEMINI.md` | 507 |
| Gemini | GeminiSkills-Studio (JSON) | `Gemini/GeminiSkills-Studio/prompts/{slug}/{slug}.json` | 507 |
| Gemini | GeminiSkills-Agents (MD) | `Gemini/GeminiSkills-Agents/.gemini/agents/{slug}/GEMINI.md` | 508 |
| Gemini | GeminiSkills-Agents (JSON) | `Gemini/GeminiSkills-Agents/.gemini/agents/{slug}/gemini.config.json` | 508 |
| Gemini | super-gems | `Gemini/GeminiSkills/super-gems/` | 50 |
| Gemini | idx-workspaces | `Gemini/GeminiSkills/idx-workspaces/` | 6 |
| Gemini | ai-studio | `Gemini/GeminiSkills/ai-studio/` | 1 |
| Gemini | vertex-ai | `Gemini/GeminiSkills/vertex-ai/` | 1 |
| Codex | Responses API | `Codex/CodexSkills/responses/{cat}/{slug}.response.json` | 517 |
| Codex | GPT Builder | `Codex/CodexSkills/gpts/{cat}/{slug}.gpt.json` | 519 |
| Codex | Agent Builder | `Codex/CodexSkills/agents/{cat}/{slug}.agent.json` | 517 |
| Codex | System Prompts | `Codex/CodexSkills/system-prompts/{slug}.txt` | 1,019 |
| Codex | CodexSkills-CLI | `Codex/CodexSkills-CLI/skills/{slug}/AGENTS.md` | 507 |
| Copilot | Agent Skills | `GithubCopilot/CopilotSkills/agent-skills/{cat}/{slug}/SKILL.md` | 512 |
| Copilot | Custom Instructions | `GithubCopilot/CopilotSkills/custom-instructions/{cat}/{slug}.md` | 512 |
| Copilot | Chat Participants | `GithubCopilot/CopilotSkills/chat-participants/` | 1 |
| Copilot | Workspace Configs | `GithubCopilot/CopilotSkills/workspace-configs/` | 2 |
| Copilot | CopilotSkills-CLI | `GithubCopilot/CopilotSkills-CLI/skills/{slug}/SKILL.md` | 507 |
| Copilot | CopilotSkills-Frontier | `GithubCopilot/CopilotSkills-Frontier/skills/{slug}/SKILL.md` | 508 |

### Supplementary Outputs

| Output | Path | Count |
|--------|------|-------|
| UniversalAdapters (total) | `UniversalAdapters/output/` | 4,563 |
| GitHubRepoAgents | `GitHubRepoAgents/` | 258 |
| Gemini Bundles (7) | `Gemini/GeminiSkills/bundles/` | 1,154 |
| Copilot Bundles (6) | `GithubCopilot/CopilotSkills/bundles/` | 709 |
| Codex Bundles (5) | `Codex/CodexSkills/bundles/` | 1,139 |

### Grand Total

| Category | Approximate File Count |
|----------|----------------------|
| Primary skill outputs (all platforms) | ~9,913 |
| Bundles (18 across 3 platforms) | ~3,002 |
| UniversalAdapters output | ~4,563 |
| GitHubRepoAgents | ~258 |
| **Estimated grand total (skill files)** | **~17,736** |

---

*Generated February 2026. Counts reflect actual filesystem enumeration and may vary slightly as skills are added or pipeline filters change.*
