# Config Reference

All configuration constants are defined in `lib/config.py`. This document lists every constant, its type, and its purpose.

---

## Paths

| Constant | Type | Value | Purpose |
|----------|------|-------|---------|
| `BASE_DIR` | `Path` | Project root (auto-detected) | Root directory for all path resolution |
| `MASTER_DIR` | `Path` | `BASE_DIR / "_master-skills"` | Location of all master SKILL.md files |

---

## Categories

### `CATEGORIES`

Type: `List[str]`

The six skill categories, used for directory traversal and filtering:

```python
["technical", "strategy", "creative", "industry", "operations", "ai-agents"]
```

### `CATEGORY_TEMPERATURES`

Type: `Dict[str, float]`

Temperature setting per category, used by all platform converters:

| Category | Temperature | Use Case |
|----------|------------|----------|
| `technical` | 0.3 | Precise, deterministic outputs |
| `operations` | 0.4 | Structured but flexible |
| `industry` | 0.4 | Domain-specific accuracy |
| `strategy` | 0.5 | Balanced analysis |
| `ai-agents` | 0.5 | Balanced agent responses |
| `creative` | 0.7 | Expressive, varied outputs |

---

## Model Mappings

### `GEMINI_MODELS`

Type: `Dict[str, str]`

Maps complexity to Gemini model name:

| Complexity | Model |
|-----------|-------|
| `simple` | `gemini-2.5-flash` |
| `moderate` | `gemini-2.5-flash` |
| `complex` | `gemini-2.5-pro` |

### `CODEX_MODELS`

Type: `Dict[str, str]`

Maps complexity to OpenAI model name:

| Complexity | Model |
|-----------|-------|
| `simple` | `gpt-4.1-mini` |
| `moderate` | `gpt-4.1` |
| `complex` | `o4-mini` |

### `CLAUDE_MODELS`

Type: `Dict[str, str]`

Maps complexity to Anthropic model name:

| Complexity | Model |
|-----------|-------|
| `simple` | `claude-sonnet-4-5-20250929` |
| `moderate` | `claude-sonnet-4-5-20250929` |
| `complex` | `claude-opus-4-6` |

### `CODEX_CATEGORY_MODELS`

Type: `Dict[str, str]`

Category-level model mapping for Codex (used by `populate_all.py` and `convert_to_codex_responses.py`):

| Category | Model |
|----------|-------|
| `technical` | `gpt-4.1` |
| `ai-agents` | `gpt-4.1` |
| `strategy` | `o4-mini` |
| `creative` | `gpt-4.1` |
| `operations` | `gpt-4.1-mini` |
| `industry` | `gpt-4.1` |

---

## Gemini Safety Settings

### `GEMINI_HARM_CATEGORIES`

Type: `List[str]`

The five harm categories applied to all Gemini outputs:

```python
[
    "HARM_CATEGORY_HARASSMENT",
    "HARM_CATEGORY_HATE_SPEECH",
    "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "HARM_CATEGORY_DANGEROUS_CONTENT",
    "HARM_CATEGORY_CIVIC_INTEGRITY",
]
```

### `GEMINI_SAFETY_SETTINGS`

Type: `List[Dict[str, str]]`

Pre-built safety settings list. Each entry maps a category to the `BLOCK_ONLY_HIGH` threshold.

---

## Gemini Grounding

### `GROUNDING_CATEGORIES`

Type: `Set[str]`

Categories that receive Google Search grounding in Gemini outputs:

```python
{"strategy", "industry", "operations"}
```

### `GROUNDING_PREFIX`

Type: `str`

Text prepended to Gemini system instructions for skills in grounding categories:

```
When responding, leverage Google Search grounding to verify facts and provide
current information. Use structured output when presenting data, comparisons,
or analysis results.
```

---

## Codex Tool Mappings

### `CODEX_TOOLS`

Type: `Dict[str, List[Dict[str, str]]]`

Tools assigned to Codex skills by category:

| Category | Tools |
|----------|-------|
| `technical` | `code_interpreter`, `file_search` |
| `strategy` | `code_interpreter`, `web_search_preview` |
| `creative` | `code_interpreter` |
| `industry` | `code_interpreter`, `web_search_preview` |
| `operations` | `code_interpreter` |
| `ai-agents` | `code_interpreter`, `web_search_preview` |

### `CAPABILITIES_MAP`

Type: `Dict[str, Dict[str, bool]]`

GPT Builder capability flags per category:

| Category | web_browsing | code_interpreter | image_generation | file_upload |
|----------|-------------|-----------------|-----------------|-------------|
| `technical` | false | true | false | true |
| `strategy` | true | true | false | true |
| `creative` | false | true | true | true |
| `industry` | true | true | false | true |
| `operations` | false | true | false | true |
| `ai-agents` | true | true | false | true |

### `AGENT_LOOP_PREFIX`

Type: `str`

Prefix prepended to Agent Builder system prompts:

```
You are an autonomous agent. Follow these operating principles:
1. Break complex tasks into discrete, verifiable steps.
2. Use your tools to gather information before generating responses.
3. Verify your work at each step before proceeding.
4. If uncertain, state your confidence level and reasoning.
5. Provide structured, actionable output.
```

---

## Copilot Configuration

### `COPILOT_PATTERNS`

Type: `Dict[str, str]`

File glob patterns for Copilot `applyTo` settings, per category:

| Category | Pattern |
|----------|---------|
| `technical` | `**/*.{ts,js,py,go,rs,java}` |
| `strategy` | `**/*.{md,txt}` |
| `creative` | `**/*.{md,html,css,svg}` |
| `operations` | `**/*.{yml,yaml,json,toml,sh}` |
| `industry` | `**/*.{md,txt,csv,json}` |
| `ai-agents` | `**/*.{md,yml,yaml,json,py,ts}` |

### `FRONTIER_SKILL_KEYWORDS`

Type: `List[str]`

Keywords used to select skills for Copilot Frontier (coding agent). A skill is included if its name or description contains any of these keywords:

```python
["code", "api", "test", "debug", "refactor", "review", "deploy", "ci",
 "docker", "git", "database", "security", "performance", "architect",
 "documentation", "migration", "monitoring", "infrastructure", "devops",
 "typescript", "python", "react", "vue", "angular", "node", "rust",
 "kubernetes", "terraform", "aws", "azure", "microservice", "graphql"]
```

---

## Gemini Agent Configuration

### `GEMINI_AGENT_TOOLS`

Type: `Dict[str, List[Dict[str, str]]]`

Tools assigned to Gemini declarative agents by category:

| Category | Tools |
|----------|-------|
| `technical` | `code_execution`, `google_search` |
| `ai-agents` | `code_execution`, `google_search` |
| `strategy` | `google_search` |
| `creative` | `code_execution` |
| `operations` | `code_execution` |
| `industry` | `google_search` |

---

## Platform Output Paths

### `PLATFORM_OUTPUTS`

Type: `Dict[str, Path]`

CLI output directories per platform:

| Key | Path |
|-----|------|
| `claude` | `Claude/ClaudeSkills-CLI` |
| `gemini` | `Gemini/GeminiSkills-CLI` |
| `codex` | `Codex/CodexSkills-CLI` |
| `copilot` | `GithubCopilot/CopilotSkills-CLI` |

### Bundle Paths

| Constant | Path |
|----------|------|
| `GEMINI_BUNDLES` | `Gemini/GeminiSkills/bundles` |
| `CODEX_BUNDLES` | `Codex/CodexSkills/bundles` |
| `COPILOT_BUNDLES` | `GithubCopilot/CopilotSkills/bundles` |

### Variant Paths

| Constant | Path |
|----------|------|
| `COPILOT_FRONTIER` | `GithubCopilot/CopilotSkills-Frontier` |
| `GEMINI_AGENTS` | `Gemini/GeminiSkills-Agents/.gemini/agents` |
| `CLAUDE_DESKTOP` | `Claude/ClaudeSkills-Desktop` |
| `CLAUDE_WEB` | `Claude/ClaudeSkills-Web` |

---

## Quality Fix Constants

### `TRIGGER_VERBS`

Type: `List[str]`

25 action verbs enforced in skill descriptions:

```python
["create", "analyze", "build", "manage", "optimize", "generate", "design",
 "develop", "implement", "configure", "deploy", "automate", "review", "audit",
 "plan", "monitor", "debug", "test", "transform", "validate", "migrate",
 "integrate", "document", "evaluate", "refactor"]
```

### `USE_WHEN_MAP`

Type: `Dict[str, str]`

Default "Use when" phrases appended to descriptions missing context:

| Category | Phrase |
|----------|--------|
| `technical` | Use when building, debugging, or optimizing technical implementations. |
| `strategy` | Use when planning, analyzing, or developing business strategies. |
| `creative` | Use when designing, creating, or reviewing creative deliverables. |
| `industry` | Use when navigating industry-specific regulations, processes, or operations. |
| `operations` | Use when managing, optimizing, or automating operational workflows. |
| `ai-agents` | Use when configuring, building, or troubleshooting AI agent workflows. |

### `VERB_MAP`

Type: `Dict[str, List[str]]`

Category-specific verb suggestions for descriptions:

| Category | Verbs |
|----------|-------|
| `technical` | build, debug, optimize, implement, deploy |
| `strategy` | analyze, plan, evaluate, develop, optimize |
| `creative` | design, create, review, produce, refine |
| `industry` | manage, audit, monitor, implement, evaluate |
| `operations` | automate, manage, optimize, monitor, streamline |
| `ai-agents` | configure, build, automate, integrate, orchestrate |

### `CORE_SECTION_NAMES`

Type: `Set[str]`

Section heading names recognized as valid core sections (27 entries):

```python
{"core workflow", "instructions", "core processes", "core process", "workflow",
 "quick start", "how to use", "getting started", "steps", "step", "usage",
 "implementation", "process", "guide", "overview", "methodology", "framework",
 "approach", "procedure", "how it works", "implementation guide",
 "key capabilities", "primary functions", "main features", "configuration"}
```

### `JUNK_SLUGS`

Type: `Set[str]`

Directory names that are removed during cleanup:

```python
{"undefined", "unnamed", "template-skill", "flashfusion-ai-skill-pack",
 "claudeskills", "untitled", "test-skill", "example-skill"}
```

---

## Platform Tuning Functions

These functions live in `lib/platform_tuning.py` and consume the config constants above.

| Function | Platform | Inputs | Returns |
|----------|----------|--------|---------|
| `estimate_complexity(skill_data)` | All | `body` (+ optional `sections`, `has_code_blocks`) | `"simple"`, `"moderate"`, or `"complex"` |
| `get_gemini_settings(skill_data)` | Gemini | `category`, `body` | `model`, `temperature`, `safetySettings` |
| `get_codex_settings(skill_data)` | Codex | `category`, `body` | `model`, `tools`, `response_format` |
| `get_copilot_settings(skill_data)` | Copilot | `category` | `applyTo`, `scope`, `priority` |
| `get_claude_settings(skill_data)` | Claude | `category`, `body` | `model`, `max_tokens`, `tool_hints` |

---

## Related Documents

- [Model Mappings](model-mappings.md) -- focused model table view
- [Glossary](glossary.md) -- term definitions
- [Pipeline Operations](../06-admin-guide/pipeline-operations.md) -- how these constants are used
