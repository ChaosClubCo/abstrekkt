# Deprecated Features

_Aggregated automatically from crawled pages. Verify retirement dates against the source._

## Model Strings

| String | Retired / Retiring | Migration Path | Source |
|---|---|---|---|
| `claude-2.1` | see source | see source | [link](https://platform.claude.com/docs/en/api/completions.md) |
| `claude-3-5-haiku-20241022` | see source | see source | [link](https://docs.anthropic.com/en/release-notes/overview.md) |
| `claude-3-5-sonnet-20240620` | see source | see source | [link](https://docs.anthropic.com/en/release-notes/overview.md) |
| `claude-3-5-sonnet-20241022` | see source | see source | [link](https://docs.anthropic.com/en/release-notes/overview.md) |
| `claude-3-7-sonnet-20250219` | see source | see source | [link](https://docs.anthropic.com/en/release-notes/overview.md) |
| `claude-3-haiku-20240307` | see source | see source | [link](https://docs.anthropic.com/en/release-notes/overview.md) |
| `claude-3-opus-20240229` | see source | see source | [link](https://docs.anthropic.com/en/release-notes/overview.md) |
| `claude-haiku-4-5-20251001` | see source | see source | [link](https://docs.claude.com/en/docs/about-claude/models/overview.md) |
| `claude-opus-4-1-20250805` | see source | see source | [link](https://docs.claude.com/en/docs/about-claude/models/overview.md) |
| `claude-opus-4-20250514` | see source | see source | [link](https://docs.claude.com/en/docs/about-claude/models/overview.md) |
| `claude-opus-4-5-20251101` | see source | see source | [link](https://docs.claude.com/en/docs/about-claude/models/overview.md) |
| `claude-sonnet-4-20250514` | see source | see source | [link](https://docs.claude.com/en/docs/about-claude/models/overview.md) |
| `claude-sonnet-4-5-20250929` | see source | see source | [link](https://docs.claude.com/en/docs/about-claude/models/overview.md) |

## API Parameters

| Parameter | Endpoint | Status | Migration Path | Source |
|---|---|---|---|---|
| _none auto-detected_ | | | | |

## Features

| Feature | Status | Notes | Source |
|---|---|---|---|
| (see notes) | deprecated/legacy | <section title="Legacy models"> | [link](https://docs.claude.com/en/docs/about-claude/models/overview.md) |
| (see notes) | deprecated/legacy | - We've deprecated [fast mode](/docs/en/build-with-claude/fast-mode) for Claude Opus 4.6, with rem | [link](https://docs.anthropic.com/en/release-notes/overview.md) |
| (see notes) | deprecated/legacy | - Deprecated `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` (will be removed on 06/01). To use fast mode on Opus 4.6, switch with `/model claude-opus-4-6[1m | [link](https://docs.anthropic.com/en/release-notes/claude-code.md) |
| (see notes) | deprecated/legacy | \| Claude Opus 4.1 ([deprecated](/docs/en/about-claude/model-deprecations)) \| `auto`, `none`<hr />`any`, `tool` | [link](https://docs.claude.com/en/docs/build-with-claude/tool-use/overview.md) |
| (see notes) | deprecated/legacy | \| Claude Opus 4.1 ([deprecated](/docs/en/about-claude/model-deprecations)) \| $15 / MTok \| $18.75 / MTok | [link](https://docs.claude.com/en/docs/build-with-claude/prompt-caching.md) |
| (see notes) | deprecated/legacy | \| Claude Opus 4.1 ([deprecated](/docs/en/about-claude/model-deprecations)) \| $7.50 / MTok \| $37.50 / MTok | [link](https://docs.claude.com/en/docs/build-with-claude/batch-processing.md) |
| (see notes) | deprecated/legacy | ecommended; the manual configuration is still functional on these models but is deprecated and will be removed in a future model release. | [link](https://docs.claude.com/en/docs/build-with-claude/extended-thinking.md) |
| (see notes) | deprecated/legacy | earchResultBlock) and also include the `output_config.format` parameter (or the deprecated `output_format` parameter), the API will return a 400 error. | [link](https://docs.claude.com/en/docs/build-with-claude/citations.md) |
| (see notes) | deprecated/legacy | ter-use-2025-01-24"` for Claude Sonnet 4.5, Claude Haiku 4.5, Claude Opus 4.1 ([deprecated](/docs/en/about-claude/model-deprecations)), Claude Sonnet 4 ([deprec | [link](https://docs.claude.com/en/docs/agents-and-tools/tool-use/computer-use-tool.md) |
| (see notes) | deprecated/legacy | \| **Deprecated** \| Feature is still functional but no longer recommended. A migration path and | [link](https://platform.claude.com/docs/en/build-with-claude/overview.md) |
| (see notes) | deprecated/legacy | get_tokens` is still functional on Claude Opus 4.6 and Claude Sonnet 4.6 but is deprecated and no longer recommended. See the warning below. | [link](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking.md) |
| (see notes) | deprecated/legacy | Lifecycle terms (Deprecated, Retired) are defined in [Model deprecations](/docs/en/about-claude/model-depre | [link](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry.md) |
| (see notes) | deprecated/legacy | # Claude on Amazon Bedrock (legacy) | [link](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy.md) |
| (see notes) | deprecated/legacy | Lifecycle terms (Deprecated, Retired) are defined in [Model deprecations](/docs/en/about-claude/model-depre | [link](https://platform.claude.com/docs/en/build-with-claude/claude-on-vertex-ai.md) |
| (see notes) | deprecated/legacy | edrock](/docs/en/build-with-claude/claude-in-amazon-bedrock) \| [Amazon Bedrock (legacy)](/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy) \| | [link](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws.md) |
| (see notes) | deprecated/legacy | \| Opus \| Claude Opus 4.5 and later \| Claude Opus 4.1 (deprecated) and earlier \| | [link](https://platform.claude.com/docs/en/build-with-claude/context-editing.md) |
| (see notes) | deprecated/legacy | ence. While `budget_tokens` is still accepted on Opus 4.6 and Sonnet 4.6, it is deprecated and will be removed in a future model release. At `high` (default) an | [link](https://platform.claude.com/docs/en/build-with-claude/effort.md) |
| (see notes) | deprecated/legacy | Fast mode for Claude Opus 4.6 is deprecated as of the Claude Opus 4.8 launch and will be removed approximately 30 days late | [link](https://platform.claude.com/docs/en/build-with-claude/fast-mode.md) |
| (see notes) | deprecated/legacy | r `refusal` stop reasons frequently while using Claude Sonnet 4.5 or Opus 4.1 ([deprecated](/docs/en/about-claude/model-deprecations)), you can try updating you | [link](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons.md) |
| (see notes) | deprecated/legacy | The previous version (`mcp-client-2025-04-04`) is deprecated. See [Deprecated version: mcp-client-2025-04-04](#deprecated-version-mcp-client-2025-04-04). | [link](https://platform.claude.com/docs/en/agents-and-tools/mcp-connector.md) |
| (see notes) | deprecated/legacy | \| Language \| Claude Opus 4.1 (deprecated)<sup>1</sup> \| Claude Opus 4 (deprecated)<sup>1</sup> \| Claude Sonnet 4.5<sup>1</sup> \| Claude Sonnet 4 (deprecated)<su | [link](https://platform.claude.com/docs/en/build-with-claude/multilingual-support.md) |
| (see notes) | deprecated/legacy | - Claude Opus 4.1 ([deprecated](/docs/en/about-claude/model-deprecations)) (`claude-opus-4-1-20250805`) | [link](https://platform.claude.com/docs/en/build-with-claude/search-results.md) |
| (see notes) | deprecated/legacy | <summary>Legacy v1 API (deprecated 2025-08)</summary> | [link](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices.md) |
| (see notes) | deprecated/legacy | e task requires arbitrary GUI interaction that more specific tools can't reach: legacy software without an API, visual verification steps, or workflows that spa | [link](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-combinations.md) |
| (see notes) | deprecated/legacy | Scopes granted to the key (empty for legacy non-scoped admin keys) | [link](https://platform.claude.com/docs/en/api/compliance/activities.md) |
| (see notes) | deprecated/legacy | Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/beta/messages/batches.md) |
| (see notes) | deprecated/legacy | Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/csharp/beta/messages/batches.md) |
| (see notes) | deprecated/legacy | Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/java/beta/messages/batches.md) |
| (see notes) | deprecated/legacy | - `claude-opus-4-0` - Deprecated: Will reach end-of-life on June 15th, 2026. Please migrate to a newer model. Vi | [link](https://platform.claude.com/docs/en/api/python/beta/messages/batches.md) |
| (see notes) | deprecated/legacy | Body param: Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/cli/beta.md) |
| (see notes) | deprecated/legacy | Body param: Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/go/beta.md) |
| (see notes) | deprecated/legacy | Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/php/beta.md) |
| (see notes) | deprecated/legacy | Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/ruby/beta.md) |
| (see notes) | deprecated/legacy | Body param: Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/typescript/beta.md) |
| (see notes) | deprecated/legacy | [Legacy] Create a Text Completion. | [link](https://platform.claude.com/docs/en/api/completions.md) |
| (see notes) | deprecated/legacy | [Legacy] Create a Text Completion. | [link](https://platform.claude.com/docs/en/api/java/completions.md) |
| (see notes) | deprecated/legacy | [Legacy] Create a Text Completion. | [link](https://platform.claude.com/docs/en/api/python/completions.md) |
| (see notes) | deprecated/legacy | Scopes granted to the key (empty for legacy non-scoped admin keys) | [link](https://platform.claude.com/docs/en/api/compliance.md) |
| (see notes) | deprecated/legacy | Body param: Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/cli/beta/messages/count_tokens.md) |
| (see notes) | deprecated/legacy | Body param: Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/go/beta/messages/count_tokens.md) |
| (see notes) | deprecated/legacy | Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/php/beta/messages/count_tokens.md) |
| (see notes) | deprecated/legacy | Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/ruby/beta/messages/count_tokens.md) |
| (see notes) | deprecated/legacy | Body param: Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/typescript/beta/messages/count_tokens.md) |
| (see notes) | deprecated/legacy | - `claude-opus-4-0` - Deprecated: Will reach end-of-life on June 15th, 2026. Please migrate to a newer model. Vi | [link](https://platform.claude.com/docs/en/api/python/messages/count_tokens.md) |
| (see notes) | deprecated/legacy | Body param: Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/cli/beta/messages/create.md) |
| (see notes) | deprecated/legacy | Body param: Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/go/beta/messages/create.md) |
| (see notes) | deprecated/legacy | Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/php/beta/messages/create.md) |
| (see notes) | deprecated/legacy | Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/ruby/beta/messages/create.md) |
| (see notes) | deprecated/legacy | Body param: Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/typescript/beta/messages/create.md) |
| (see notes) | deprecated/legacy | - `claude-opus-4-0` - Deprecated: Will reach end-of-life on June 15th, 2026. Please migrate to a newer model. Vi | [link](https://platform.claude.com/docs/en/api/python/messages/create.md) |
| (see notes) | deprecated/legacy | Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/go/beta/messages/batches/create.md) |
| (see notes) | deprecated/legacy | Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/ruby/beta/messages/batches/create.md) |
| (see notes) | deprecated/legacy | Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/typescript/beta/messages/batches/create.md) |
| (see notes) | deprecated/legacy | - `claude-opus-4-0` - Deprecated: Will reach end-of-life on June 15th, 2026. Please migrate to a newer model. Vi | [link](https://platform.claude.com/docs/en/api/python/messages/batches/create.md) |
| (see notes) | deprecated/legacy | [Legacy] Create a Text Completion. | [link](https://platform.claude.com/docs/en/api/completions/create.md) |
| (see notes) | deprecated/legacy | [Legacy] Create a Text Completion. | [link](https://platform.claude.com/docs/en/api/java/completions/create.md) |
| (see notes) | deprecated/legacy | [Legacy] Create a Text Completion. | [link](https://platform.claude.com/docs/en/api/python/completions/create.md) |
| (see notes) | deprecated/legacy | Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/beta/messages.md) |
| (see notes) | deprecated/legacy | Body param: Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/csharp/beta/messages.md) |
| (see notes) | deprecated/legacy | Deprecated: Use `output_config.format` instead. See [structured outputs](https://platform. | [link](https://platform.claude.com/docs/en/api/java/beta/messages.md) |
| (see notes) | deprecated/legacy | - `claude-opus-4-0` - Deprecated: Will reach end-of-life on June 15th, 2026. Please migrate to a newer model. Vi | [link](https://platform.claude.com/docs/en/api/python/beta/messages.md) |
| (see notes) | deprecated/legacy | - `claude-opus-4-0` - Deprecated: Will reach end-of-life on June 15th, 2026. Please migrate to a newer model. Vi | [link](https://platform.claude.com/docs/en/api/python/beta/messages/batches/results.md) |
| (see notes) | deprecated/legacy | * Deprecated `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` (will be removed on 06/01). To use fast mode on Opus 4.6, switch with `/model claude-opus-4-6[1m | [link](https://code.claude.com/docs/en/changelog.md) |
| (see notes) | deprecated/legacy | \| `todos/`, `statsig/`, `logs/` \| Legacy directories from older versions. No longer written. The sweep removes their con | [link](https://code.claude.com/docs/en/claude-directory.md) |
| (see notes) | deprecated/legacy | <Step title="Identify legacy code for refactoring"> | [link](https://code.claude.com/docs/en/common-workflows.md) |
| (see notes) | deprecated/legacy | The SSE (Server-Sent Events) transport is deprecated. Use HTTP servers instead, where available. | [link](https://code.claude.com/docs/en/mcp.md) |
| (see notes) | deprecated/legacy | skill. Use this for background knowledge that isn't actionable as a command. A `legacy-system-context` skill explains how an old system works. Claude should kno | [link](https://code.claude.com/docs/en/skills.md) |
| (see notes) | deprecated/legacy | Use this for directories you never work in, such as other teams' packages, legacy code, or vendored subtrees. The exclusion list is static, not a per-task switc | [link](https://code.claude.com/docs/en/large-codebases.md) |
| (see notes) | deprecated/legacy | me from. `~/.local/bin/claude` is the native installer, `~/.claude/local/` is a legacy local npm install created by older versions of Claude Code, and the npm g | [link](https://code.claude.com/docs/en/troubleshoot-install.md) |
| (see notes) | deprecated/legacy | # or the deprecated ANTHROPIC_SMALL_FAST_MODEL set. | [link](https://code.claude.com/docs/en/amazon-bedrock.md) |
| (see notes) | deprecated/legacy | For current and legacy model IDs, see [Models overview](https://platform.claude.com/docs/en/about-clau | [link](https://code.claude.com/docs/en/google-vertex-ai.md) |
| (see notes) | deprecated/legacy | For current and legacy model IDs, see [Models overview](https://platform.claude.com/docs/en/about-clau | [link](https://code.claude.com/docs/en/microsoft-foundry.md) |
| (see notes) | deprecated/legacy | a permission decision and one for the execution itself. When the Agent tool, or legacy Task tool, spawns a subagent, the subagent's API and tool spans nest unde | [link](https://code.claude.com/docs/en/monitoring-usage.md) |
| (see notes) | deprecated/legacy | ss paths such as `\\*` that may contain WebDAV subdirectories. [WebDAV has been deprecated by Microsoft](https://learn.microsoft.com/en-us/windows/whats-new/dep | [link](https://code.claude.com/docs/en/security.md) |
| (see notes) | deprecated/legacy | the person writes routinely. Suggest trying it on the work they tend to avoid: legacy files, unfamiliar services, or test scaffolding, where the leverage is hig | [link](https://code.claude.com/docs/en/champion-kit.md) |
| (see notes) | deprecated/legacy | The legacy Windows path `C:\ProgramData\ClaudeCode\managed-settings.json` is no longer sup | [link](https://code.claude.com/docs/en/settings.md) |
| (see notes) | deprecated/legacy | Note: `ANTHROPIC_SMALL_FAST_MODEL` is deprecated in favor of | [link](https://code.claude.com/docs/en/model-config.md) |
| (see notes) | deprecated/legacy | Fast mode for Opus 4.6 is deprecated and will be removed approximately 30 days after the Opus 4.8 launch. After removal, fast mode on Op | [link](https://code.claude.com/docs/en/fast-mode.md) |
| (see notes) | deprecated/legacy | <Note>{/* max-version: 2.1.90 */}The standalone `/output-style` command was deprecated in v2.1.73 and removed in v2.1.91. Use `/config` or edit the `outputStyle | [link](https://code.claude.com/docs/en/output-styles.md) |
| (see notes) | deprecated/legacy | \| `ANTHROPIC_SMALL_FAST_MODEL` \| \[DEPRECATED] Name of [Haiku-class model for background tasks](/en/costs) | [link](https://code.claude.com/docs/en/env-vars.md) |
| (see notes) | deprecated/legacy | \| `TaskOutput` \| (Deprecated) Retrieves output from a background task. Prefer `Read` on the task's output fi | [link](https://code.claude.com/docs/en/tools-reference.md) |
| (see notes) | deprecated/legacy | ToolUse previously used top-level `decision` and `reason` fields, but these are deprecated for this event. Use `hookSpecificOutput.permissionDecision` and `hook | [link](https://code.claude.com/docs/en/hooks.md) |
| (see notes) | deprecated/legacy | ## Deprecated and renamed terms | [link](https://code.claude.com/docs/en/glossary.md) |
| (see notes) | deprecated/legacy | \| [Commands](/en/agent-sdk/slash-commands) \| Custom commands in the legacy format. Use skills for new custom commands \| `.claude/commands/*.md` | [link](https://code.claude.com/docs/en/agent-sdk/overview.md) |
| (see notes) | deprecated/legacy | to Claude as the tool result. The top-level `decision` and `reason` fields are deprecated for `PreToolUse`. See the [hooks guide](/en/agent-sdk/hooks) for the f | [link](https://code.claude.com/docs/en/agent-sdk/claude-code-features.md) |
| (see notes) | deprecated/legacy | The `.claude/commands/` directory is the legacy format. The recommended format is `.claude/skills/<name>/SKILL.md`, which suppo | [link](https://code.claude.com/docs/en/agent-sdk/slash-commands.md) |
| (see notes) | deprecated/legacy | The `commands/` directory is a legacy format. Use `skills/` for new plugins. Claude Code continues to support both fo | [link](https://code.claude.com/docs/en/agent-sdk/plugins.md) |
| (see notes) | deprecated/legacy | Ks. The older `updatedMCPToolOutput` field replaces MCP tool output only and is deprecated. | [link](https://code.claude.com/docs/en/agent-sdk/hooks.md) |
| (see notes) | deprecated/legacy | \| `undefined` \| *Deprecated:* Use `thinking` instead. Maximum tokens for thinking process | [link](https://code.claude.com/docs/en/agent-sdk/typescript.md) |
| (see notes) | deprecated/legacy | debug_stderr: Any = sys.stderr # Deprecated | [link](https://code.claude.com/docs/en/agent-sdk/python.md) |
| (see notes) | deprecated/legacy | bout 2.5x the speed. Opus 4.7 and 4.6 stay at \$30/\$150. Opus 4.6 fast mode is deprecated.</p> | [link](https://code.claude.com/docs/en/whats-new/2026-w22.md) |
| (see notes) | deprecated/legacy | > Installation via npm is deprecated. Use one of the recommended methods below. | [link](https://github.com/anthropics/claude-code) |
| (see notes) | deprecated/legacy | e-lifecycle.md): How individual MCP specification features move through Active, Deprecated, and Removed states, and the timeline implementers can plan against. | [link](https://modelcontextprotocol.io) |
