# Platform Guides

This section provides detailed guides for deploying and using skills on each supported AI platform. The Skills Library ships 507 master skills across 6 categories, converted into platform-native formats for Claude, Gemini, GitHub Copilot, and OpenAI Codex.

## Platform Overview

| Platform | Variants | Total Files | Primary Format | Best For |
|----------|----------|-------------|----------------|----------|
| [Claude](claude-guide.md) | 4 | ~2,027 | SKILL.md (YAML frontmatter + Markdown) | CLI workflows, Desktop plugins, Web projects |
| [Gemini](gemini-guide.md) | 4 | ~1,798 | .gem.json, GEMINI.md, config JSON | Gems, AI Studio prompts, multi-step agents |
| [Copilot](copilot-guide.md) | 3 | ~1,546 | SKILL.md, custom-instructions .md | VS Code, GitHub repos, M365 Copilot agents |
| [Codex / OpenAI](codex-guide.md) | 2 | ~3,562 | .agent.json, .gpt.json, .assistant.json | Responses API, GPT Builder, Agent Builder |
| [Universal Adapters](universal-adapters-guide.md) | 7 targets | 2,313+ | JS adapters + JSON schema | Cross-platform conversion, automation |

## Variant Breakdown

### Claude

| Variant | Directory | Files | Format | Deployment Target |
|---------|-----------|-------|--------|-------------------|
| ClaudeSkills | `Claude/ClaudeSkills/skills/{category}/{slug}/` | 508 | SKILL.md | Reference / main library |
| ClaudeSkills-CLI | `Claude/ClaudeSkills-CLI/skills/{slug}/` | 503 | SKILL.md | `~/.claude/commands/` |
| ClaudeSkills-Desktop | `Claude/ClaudeSkills-Desktop/.claude-plugin/skills/{slug}/` | 508 | SKILL.md + plugin.json | `%APPDATA%\Claude\` (Win) / `~/Library/Application Support/Claude/` (Mac) |
| ClaudeSkills-Web | `Claude/ClaudeSkills-Web/projects/{slug}/` | 508 | project-instructions.md | Claude.ai Projects |

### Gemini

| Variant | Directory | Files | Format | Deployment Target |
|---------|-----------|-------|--------|-------------------|
| GeminiSkills | `Gemini/GeminiSkills/gems/{category}/` | 525 | .gem.json | Google AI Gems |
| GeminiSkills-CLI | `Gemini/GeminiSkills-CLI/skills/{slug}/` | 507 | SKILL.md | `~/.gemini/skills/` |
| GeminiSkills-Studio | `Gemini/GeminiSkills-Studio/prompts/{slug}/` | 258 pairs | .md + .json | Google AI Studio |
| GeminiSkills-Agents | `Gemini/GeminiSkills-Agents/.gemini/agents/{slug}/` | 508 pairs | GEMINI.md + gemini.config.json | Multi-step Gemini agents |

### GitHub Copilot

| Variant | Directory | Files | Format | Deployment Target |
|---------|-----------|-------|--------|-------------------|
| CopilotSkills | `GithubCopilot/CopilotSkills/` | 512 + 519 | SKILL.md, .md | VS Code agent-skills + custom-instructions |
| CopilotSkills-CLI | `GithubCopilot/CopilotSkills-CLI/skills/{slug}/` | 507 | SKILL.md | `.github/copilot-instructions.md` |
| CopilotSkills-Frontier | `GithubCopilot/CopilotSkills-Frontier/skills/{slug}/` | 508 | SKILL.md | M365 Copilot declarative agents |

### Codex / OpenAI

| Variant | Directory | Files | Format | Deployment Target |
|---------|-----------|-------|--------|-------------------|
| CodexSkills | `Codex/CodexSkills/` | 3,054 | .agent.json, .gpt.json, .assistant.json, .txt | Responses API, GPT Builder, Agent Builder |
| CodexSkills-CLI | `Codex/CodexSkills-CLI/skills/{slug}/` | 508 | AGENTS.md | `~/.codex/` |

## Quick Start

1. **Pick your platform** -- Read the guide for the AI tool you use daily.
2. **Choose a variant** -- Each platform has variants optimized for different deployment targets (CLI, web, desktop, API).
3. **Copy or deploy** -- Follow the deployment instructions in the platform guide to install skills into your environment.
4. **Browse skills** -- Use the [skill catalog](../05-skill-catalog/) or the category guides in [04-category-guides](../04-category-guides/) to find skills by topic.

## Cross-Platform Comparison

For a side-by-side feature matrix comparing formats, model support, temperature control, and deployment methods, see the [Platform Comparison](platform-comparison.md).

## Universal Adapters

If you need to convert skills between platforms programmatically or add support for a new platform, see the [Universal Adapters Guide](universal-adapters-guide.md).
