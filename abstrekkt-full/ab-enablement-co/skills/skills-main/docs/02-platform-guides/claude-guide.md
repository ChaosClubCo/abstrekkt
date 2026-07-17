# Claude Platform Guide

This guide covers all four Claude skill variants: the main categorized library, CLI commands, Desktop plugins, and Web project instructions. Each variant uses a Markdown-based format with YAML frontmatter, making Claude skills the most human-readable format in the library.

## Variants at a Glance

| Variant | Files | Path Pattern | Use Case |
|---------|-------|--------------|----------|
| ClaudeSkills | 508 | `skills/{category}/{slug}/SKILL.md` | Reference library, browsing by category |
| ClaudeSkills-CLI | 503 | `skills/{slug}/SKILL.md` | Claude CLI slash commands |
| ClaudeSkills-Desktop | 508 | `.claude-plugin/skills/{slug}/SKILL.md` | Claude Desktop app plugins |
| ClaudeSkills-Web | 508 | `projects/{slug}/project-instructions.md` | Claude.ai Projects custom instructions |

---

## 1. ClaudeSkills (Main Library)

The primary skill collection, organized by category with enriched frontmatter metadata.

### Directory Structure

```
Claude/ClaudeSkills/
  skills/
    ai-agents/           # 232 skills
      access-management/
        SKILL.md
      accountability-buddy/
        SKILL.md
      ...
    technical/           # 127 skills
    strategy/            # 59 skills
    creative/            # 40 skills
    operations/          # 24 skills
    industry/            # 25 skills
```

### File Format

Each SKILL.md uses YAML frontmatter followed by a structured Markdown body:

```yaml
---
name: "access-management"
description: "Comprehensive identity and access management implementation..."
version: "1.0.0"
category: ai-agents
complexity: complex
tags: ["access", "security", "compliance", "management"]
model: claude-opus-4-6
max_tokens: 16384
tool_hints:
  - type: mcp
    name: web_search
    description: "Search the web for up-to-date information via MCP web-search server."
  - type: mcp
    name: subagent
    description: "Delegate subtasks to specialised sub-agents via MCP subagent server."
synced_at: "2026-02-09T18:36:17.719713+00:00"
---

# MCP Tool References
...

## Overview
...

## When to Use
...

## Core Processes
...

## Tools & Templates
...

## Metrics
...

## Common Pitfalls
...

## Integration Points
...
```

### Frontmatter Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Skill slug identifier (matches directory name) |
| `description` | string | One-sentence description used as the skill trigger |
| `version` | string | Semantic version, typically `1.0.0` |
| `category` | string | One of: `ai-agents`, `technical`, `strategy`, `creative`, `operations`, `industry` |
| `complexity` | string | `simple`, `moderate`, or `complex` -- drives model selection |
| `tags` | array | Auto-generated tags for discoverability |
| `model` | string | Recommended Claude model (e.g., `claude-opus-4-6`, `claude-sonnet-4-20250514`) |
| `max_tokens` | integer | Maximum output tokens (4096, 8192, or 16384) |
| `tool_hints` | array | MCP tool references the skill may use |
| `synced_at` | string | ISO timestamp of last sync |

### Model Selection by Complexity

The `lib/platform_tuning.py` pipeline automatically assigns models:

| Complexity | Model | max_tokens |
|------------|-------|------------|
| simple | claude-sonnet-4-20250514 | 4096 |
| moderate | claude-sonnet-4-20250514 | 8192 |
| complex | claude-opus-4-6 | 16384 |

### When to Use This Variant

- Browsing the full skill library by category
- Building indexes or catalogs
- Reference material for understanding skill structure
- Source of truth for all other Claude variants

---

## 2. ClaudeSkills-CLI

Skills formatted for the Claude CLI (`claude` command), deployed as slash commands.

### Directory Structure

```
Claude/ClaudeSkills-CLI/
  skills/
    accessibility-core/
      SKILL.md
    access-management/
      SKILL.md
    accountability-buddy/
      SKILL.md
    ...                   # 503 skills (flat, no category subdirs)
```

### File Format

The CLI variant uses the same YAML frontmatter + Markdown body as the main library, but organized flat by slug rather than by category.

```yaml
---
name: "access-management"
description: "Comprehensive identity and access management..."
---

## Overview
...
```

### Deployment

To install CLI skills, copy them to your Claude commands directory:

**Linux / macOS:**

```bash
# Copy all skills to Claude CLI commands directory
cp -r Claude/ClaudeSkills-CLI/skills/* ~/.claude/commands/

# Or copy a single skill
cp -r Claude/ClaudeSkills-CLI/skills/access-management ~/.claude/commands/
```

**Windows (PowerShell):**

```powershell
# Copy all skills
Copy-Item -Recurse Claude\ClaudeSkills-CLI\skills\* "$env:USERPROFILE\.claude\commands\"

# Copy a single skill
Copy-Item -Recurse Claude\ClaudeSkills-CLI\skills\access-management "$env:USERPROFILE\.claude\commands\"
```

### Usage

Once deployed, skills become available as slash commands in Claude CLI:

```bash
# List available commands
claude /help

# Use a specific skill
claude /access-management "Design an IAM architecture for our SaaS platform"
```

### Tips

- The 503 count (vs. 508 in main) reflects minor filter differences in the CLI converter -- a few skills are excluded due to slug length or special character constraints.
- Skills are flat (no category folders) because Claude CLI expects commands in a single directory level.
- The `description` field in frontmatter determines how Claude surfaces the command in help text.

---

## 3. ClaudeSkills-Desktop

Skills packaged as Claude Desktop plugins with a `plugin.json` manifest.

### Directory Structure

```
Claude/ClaudeSkills-Desktop/
  .claude-plugin/
    skills/
      accessibility-core/
        SKILL.md
      access-management/
        SKILL.md
      ...                 # 508 skills
```

### File Format

Each skill is a SKILL.md identical to the CLI format. The Desktop variant additionally includes a `plugin.json` manifest when deployed as a standalone plugin:

```json
{
  "name": "access-management",
  "version": "1.0.0",
  "description": "Comprehensive identity and access management...",
  "skills": ["skills/**/*.md"],
  "commands": [],
  "agents": []
}
```

### Deployment

**Windows:**

```powershell
# Deploy the entire plugin directory
Copy-Item -Recurse Claude\ClaudeSkills-Desktop\.claude-plugin\* "$env:APPDATA\Claude\.claude-plugin\"
```

**macOS:**

```bash
# Deploy the entire plugin directory
cp -r Claude/ClaudeSkills-Desktop/.claude-plugin/* ~/Library/Application\ Support/Claude/.claude-plugin/
```

**Linux:**

```bash
cp -r Claude/ClaudeSkills-Desktop/.claude-plugin/* ~/.config/Claude/.claude-plugin/
```

### When to Use This Variant

- You use Claude Desktop as your primary interface
- You want skills available in the Desktop app without using the CLI
- You want to bundle multiple skills into a single plugin package

### Creating a Custom Plugin Bundle

You can create a focused plugin by selecting specific skills:

```bash
# Create a custom plugin directory
mkdir -p my-plugin/.claude-plugin/skills

# Copy selected skills
cp -r Claude/ClaudeSkills-Desktop/.claude-plugin/skills/access-management my-plugin/.claude-plugin/skills/
cp -r Claude/ClaudeSkills-Desktop/.claude-plugin/skills/api-design my-plugin/.claude-plugin/skills/
cp -r Claude/ClaudeSkills-Desktop/.claude-plugin/skills/code-review my-plugin/.claude-plugin/skills/
```

Then create a `my-plugin/.claude-plugin/plugin.json`:

```json
{
  "name": "my-security-bundle",
  "version": "1.0.0",
  "description": "Custom security and development skills",
  "skills": ["skills/**/*.md"]
}
```

---

## 4. ClaudeSkills-Web

Skills formatted as project instructions for Claude.ai Projects.

### Directory Structure

```
Claude/ClaudeSkills-Web/
  projects/
    accessibility-core/
      project-instructions.md
    access-management/
      project-instructions.md
    ...                        # 508 skills
```

### File Format

Each `project-instructions.md` contains the skill name, description, and full body content in plain Markdown:

```markdown
# Access Management

Comprehensive identity and access management implementation and governance...

## Overview
...

## When to Use
...

## Core Processes
...
```

Note that the Web format drops the YAML frontmatter in favor of a plain Markdown document. This is because Claude.ai Projects accepts raw text as project instructions, not structured YAML.

### Deployment

1. Go to [claude.ai](https://claude.ai) and open (or create) a Project.
2. Click the project settings or "Custom Instructions" area.
3. Paste the contents of the relevant `project-instructions.md` file.
4. The skill's instructions will now apply to all conversations within that project.

### Combining Multiple Skills

You can concatenate multiple skill instructions into a single project:

```bash
# Combine several skills into one instructions file
cat Claude/ClaudeSkills-Web/projects/access-management/project-instructions.md \
    Claude/ClaudeSkills-Web/projects/api-design/project-instructions.md \
    Claude/ClaudeSkills-Web/projects/code-review/project-instructions.md \
    > my-combined-instructions.md
```

Then paste `my-combined-instructions.md` into your Claude.ai Project.

### Tips

- Claude.ai Projects have a character limit for custom instructions. If combining skills, keep the total under the limit (currently around 10,000 characters for the instructions field).
- Each skill works best as a standalone project instruction. If you combine them, skills with overlapping sections (e.g., two skills that both define "Core Processes") may need manual editing.
- The `project-instructions.md` filename is a convention -- you can rename it for clarity.

---

## Common Configuration

### Skill Body Sections

All Claude skill variants share the same body structure:

| Section | Purpose |
|---------|---------|
| Overview | What the skill does and why it matters |
| When to Use | Trigger conditions and specific use cases |
| Core Processes | Step-by-step workflows with code examples |
| Tools & Templates | Reusable templates and configuration snippets |
| Metrics | KPIs and measurement targets |
| Common Pitfalls | Known failure modes and how to avoid them |
| Integration Points | Related systems and skills |

### MCP Tool Hints

The main ClaudeSkills variant includes `tool_hints` in frontmatter to help Claude discover MCP (Model Context Protocol) tools:

```yaml
tool_hints:
  - type: mcp
    name: web_search
    description: "Search the web for up-to-date information via MCP web-search server."
  - type: mcp
    name: subagent
    description: "Delegate subtasks to specialised sub-agents via MCP subagent server."
```

These hints are informational -- they tell Claude which MCP tools the skill may benefit from, but do not enforce tool availability. The actual MCP server configuration is separate from the skill files.

---

## Choosing a Variant

| If you... | Use this variant |
|-----------|-----------------|
| Want to browse skills by category | ClaudeSkills (main) |
| Use `claude` CLI daily | ClaudeSkills-CLI |
| Use Claude Desktop app | ClaudeSkills-Desktop |
| Use Claude.ai Projects in browser | ClaudeSkills-Web |
| Need to build tooling or indexes | ClaudeSkills (main) -- richest metadata |
| Want the smallest file size per skill | ClaudeSkills-CLI -- minimal frontmatter |

---

## Troubleshooting

### Skill not appearing in CLI

- Verify the skill directory exists in `~/.claude/commands/`
- Check that the `SKILL.md` file has valid YAML frontmatter (opening and closing `---`)
- Ensure the `name` field in frontmatter matches the directory name

### Encoding issues on Windows

The skills use UTF-8 encoding. If you see garbled characters:

```powershell
# Set console to UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$env:PYTHONIOENCODING = "utf-8"
```

### Duplicate skill names

Some skills share names across categories (e.g., "analytics" exists in both `ai-agents` and `strategy`). In the main ClaudeSkills variant, these are separated by category directories. In flat variants (CLI, Desktop, Web), the pipeline applies a dedup prefix: `{category}--{slug}` (e.g., `ai-agents--analytics`).

---

## Related Guides

- [Platform Comparison](platform-comparison.md) -- See how Claude compares to other platforms
- [Universal Adapters](universal-adapters-guide.md) -- Convert skills between platforms
- [Getting Started](../01-getting-started/) -- Initial setup and orientation
