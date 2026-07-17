# Platform Comparison

A side-by-side comparison of all 14 output targets across the four supported AI platforms, plus the Universal Adapters toolkit. Use this guide to choose the right platform and variant for your workflow.

---

## Full Comparison Matrix

| Target | Platform | Files | Format | Deployment | Model Support | Temperature | Safety Settings | Special Features |
|--------|----------|-------|--------|------------|---------------|-------------|-----------------|------------------|
| ClaudeSkills | Claude | 508 | SKILL.md (YAML + MD) | Reference library | claude-sonnet-4, claude-opus-4-6 | Category-based | N/A | MCP tool hints, category org |
| ClaudeSkills-CLI | Claude | 503 | SKILL.md | `~/.claude/commands/` | claude-sonnet-4, claude-opus-4-6 | Category-based | N/A | Slash commands |
| ClaudeSkills-Desktop | Claude | 508 | SKILL.md + plugin.json | App data directory | claude-sonnet-4, claude-opus-4-6 | Category-based | N/A | Plugin bundles |
| ClaudeSkills-Web | Claude | 508 | project-instructions.md | Claude.ai Projects | claude-sonnet-4, claude-opus-4-6 | Category-based | N/A | Plain Markdown, no frontmatter |
| GeminiSkills | Gemini | 525 | .gem.json | AI Studio / API | gemini-2.0-flash, gemini-2.0-pro, gemini-2.5-pro-preview | Category-based (0.3--0.9) | 4 categories, configurable | Grounding (Google Search), super-gems |
| GeminiSkills-CLI | Gemini | 507 | SKILL.md | `~/.gemini/skills/` | Gemini models | Category-based | N/A | Dual deploy paths |
| GeminiSkills-Studio | Gemini | 258 pairs | .md + .json | AI Studio UI | Gemini models | In config.json | N/A | topP, topK, maxOutputTokens |
| GeminiSkills-Agents | Gemini | 508 pairs | GEMINI.md + .json | `.gemini/agents/` | Gemini models | In config.json | In config.json | Google Search + Code Execution tools |
| CopilotSkills | Copilot | 512 + 519 | SKILL.md + .md | VS Code settings | GitHub Copilot models | N/A (model-managed) | N/A | Agent-skills + custom-instructions |
| CopilotSkills-CLI | Copilot | 507 | SKILL.md | `.github/` | GitHub Copilot models | N/A | N/A | Repo-level shared instructions |
| CopilotSkills-Frontier | Copilot | 508 | SKILL.md | M365 Copilot | M365 Copilot models | N/A | N/A | Declarative agent manifests |
| CodexSkills | Codex | 3,054 | .agent/.gpt/.assistant.json + .txt | OpenAI API / GPT Builder | gpt-4o-mini, gpt-4o, o3 | Category-based (0.3--0.9) | N/A | Multi-format per skill, conversation starters |
| CodexSkills-CLI | Codex | 508 | AGENTS.md | `~/.codex/` | OpenAI models | Category-based | N/A | AGENTS.md convention |
| Universal Adapters | All | 2,313 | JS adapters + JSON schema | Programmatic / CI-CD | All platforms | Adapter-dependent | Adapter-dependent | Batch conversion, extensible |

---

## Format Comparison

| Platform | Primary Format | Config Format | Human-Readable | Machine-Readable | Multi-File per Skill |
|----------|---------------|---------------|----------------|-------------------|---------------------|
| Claude | Markdown + YAML frontmatter | Embedded in frontmatter | Yes | Moderate | No (single SKILL.md) |
| Gemini | JSON (gems) or Markdown (CLI/agents) | Separate .json | Gems: No, Others: Yes | Gems: Yes, Others: Moderate | Agents: Yes (paired) |
| Copilot | Markdown | VS Code settings.json | Yes | Moderate | No (single .md) |
| Codex | JSON (multiple formats) | Embedded in JSON | .txt only | Yes | Yes (up to 6 files) |

---

## Model Mapping

Each platform assigns models based on skill complexity (simple, moderate, complex):

| Complexity | Claude | Gemini | Codex |
|------------|--------|--------|-------|
| simple | claude-sonnet-4-20250514 | gemini-2.0-flash | gpt-4o-mini |
| moderate | claude-sonnet-4-20250514 | gemini-2.0-pro | gpt-4o |
| complex | claude-opus-4-6 | gemini-2.5-pro-preview | o3 |

GitHub Copilot does not expose model selection -- the model is managed by the Copilot service.

---

## Temperature Ranges

Temperature values by category, applied to platforms that support temperature configuration:

| Category | Claude | Gemini | Codex | Copilot |
|----------|--------|--------|-------|---------|
| creative | 0.8--0.9 | 0.8--0.9 | 0.8--0.9 | N/A |
| strategy | 0.5--0.6 | 0.5--0.6 | 0.5--0.6 | N/A |
| technical | 0.3--0.5 | 0.3--0.5 | 0.3--0.5 | N/A |
| ai-agents | 0.4--0.5 | 0.4--0.5 | 0.4--0.5 | N/A |
| operations | 0.3--0.4 | 0.3--0.4 | 0.3--0.4 | N/A |
| industry | 0.4--0.5 | 0.4--0.5 | 0.4--0.5 | N/A |

---

## Feature Matrix

| Feature | Claude | Gemini | Copilot | Codex |
|---------|--------|--------|---------|-------|
| Model selection | Yes | Yes | No | Yes |
| Temperature control | Yes | Yes | No | Yes |
| Safety settings | No | Yes (4 categories) | No | No |
| Grounding / web search | Via MCP hints | Native (Google Search) | No | Via tools |
| Code execution | Via MCP hints | Native | Via Copilot | Via code_interpreter |
| Tool configuration | MCP tool_hints | tools array in config | VS Code settings | tools array in JSON |
| Conversation starters | No | No | No | Yes (.gpt.json) |
| Category organization | Yes (main variant) | Yes (gems) | Yes (both sub-formats) | No (flat only) |
| Bundle support | No | Yes (7 bundles) | Yes (6 bundles) | Yes (5 bundles) |
| Multi-file output | No | Agents variant | No | Yes (up to 6 per skill) |
| Metadata enrichment | Frontmatter tags | Config JSON | Frontmatter tags | metadata.json |

---

## Deployment Comparison

| Platform | CLI Deploy Command | Desktop/App Deploy | Web Deploy |
|----------|-------------------|-------------------|------------|
| Claude | `cp -r ClaudeSkills-CLI/skills/* ~/.claude/commands/` | Copy to app data dir | Paste into Claude.ai Projects |
| Gemini | `cp -r GeminiSkills-CLI/.gemini ~/.gemini` | N/A | Import to AI Studio |
| Copilot | `cp -r CopilotSkills-CLI/.github .github` | N/A (VS Code reads .github/) | N/A |
| Codex | `cp -r CodexSkills-CLI/.codex ~/.codex` | N/A | Create via OpenAI API/UI |

---

## Bundle Comparison

| Platform | Total Bundles | Full Library | By Category | Enterprise | Essential | Other |
|----------|--------------|-------------|-------------|------------|-----------|-------|
| Gemini | 7 | gems-full (508) | by-category (508) | vertex-enterprise (53) | studio-essential-30 (30) | agent-chains-20, idx-workspace (20), studio-creative-15 (15) |
| Copilot | 6 | -- | by-category (508) | -- | workspace-essential-30 (30) | workspace-by-stack (79), agent-skills-50, coding-agent-20, chat-participants-20 |
| Codex | 5 | responses-api-full (508) | by-category (508) | enterprise-assistants (53) | -- | gpt-builder-50, agent-builder-20 |
| Claude | 0 | N/A | Skills organized by category dirs | N/A | N/A | N/A |

---

## Choosing a Platform

### Choose Claude if...

- You want the most human-readable skill format (Markdown everywhere).
- You use Claude CLI, Claude Desktop, or Claude.ai Projects.
- You prefer YAML frontmatter for metadata.
- You want MCP (Model Context Protocol) tool integration hints.
- You need the simplest deployment (single file per skill).

### Choose Gemini if...

- You need fine-grained control over model, temperature, and safety settings.
- You use Google AI Studio or Vertex AI.
- You want grounding with Google Search built into your skills.
- You need multi-step agent configurations with paired instruction + config files.
- You deploy to Google Cloud for enterprise workloads (Vertex AI).

### Choose Copilot if...

- VS Code is your primary development environment.
- You want skills shared across your team via repository `.github/` configuration.
- You need workspace-level or stack-specific skill bundles.
- You are building Microsoft 365 Copilot declarative agents.
- You prefer zero-configuration deployment (just commit to repo).

### Choose Codex (OpenAI) if...

- You build with the OpenAI API (Responses API, Assistants API).
- You want to create Custom GPTs from skill definitions.
- You need multiple output formats per skill (API, GPT Builder, Assistant, raw prompt).
- You want conversation starters pre-configured for each skill.
- You need the widest range of deployment targets from a single source.

### Choose Universal Adapters if...

- You work across multiple AI platforms.
- You need to convert skills between platforms programmatically.
- You want to add support for a new platform not yet in the library.
- You run batch conversions as part of a CI/CD pipeline.
- You want a single source of truth that outputs to all platforms.

---

## File Count Summary

| Platform | Variant | Count | Notes |
|----------|---------|-------|-------|
| Claude | ClaudeSkills | 508 | Main library, by category |
| Claude | ClaudeSkills-CLI | 503 | Minor filter differences |
| Claude | ClaudeSkills-Desktop | 508 | With plugin.json |
| Claude | ClaudeSkills-Web | 508 | project-instructions.md |
| Gemini | GeminiSkills | 525 | Includes super-gems, IDX, extras |
| Gemini | GeminiSkills-CLI | 507 | Flat skills + .gemini/ (514) |
| Gemini | GeminiSkills-Studio | 258 pairs | .md + .json per skill |
| Gemini | GeminiSkills-Agents | 508 pairs | GEMINI.md + config.json |
| Copilot | CopilotSkills | 512 + 519 | Agent-skills + custom-instructions |
| Copilot | CopilotSkills-CLI | 507 | Flat skills |
| Copilot | CopilotSkills-Frontier | 508 | M365 declarative agents |
| Codex | CodexSkills | 3,054 | Multi-file per skill |
| Codex | CodexSkills-CLI | 508 | AGENTS.md format |
| Adapters | UniversalAdapters | 2,313 | Pre-built output, 7 targets |
| **Total** | **14 targets** | **~10,700+** | |

---

## Related Guides

- [Claude Guide](claude-guide.md) -- Detailed Claude platform documentation
- [Gemini Guide](gemini-guide.md) -- Detailed Gemini platform documentation
- [Copilot Guide](copilot-guide.md) -- Detailed GitHub Copilot platform documentation
- [Codex Guide](codex-guide.md) -- Detailed OpenAI Codex platform documentation
- [Universal Adapters](universal-adapters-guide.md) -- Cross-platform conversion toolkit
- [Getting Started](../01-getting-started/) -- Initial setup and orientation
