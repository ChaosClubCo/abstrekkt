# SKILL.md Format Specification

Version: 1.0
Last Updated: 2026-02-14
Status: Authoritative reference for all SKILL.md files in the Skills Library

---

## Table of Contents

1. [Overview](#1-overview)
2. [File Location and Naming](#2-file-location-and-naming)
3. [YAML Frontmatter](#3-yaml-frontmatter)
4. [Body Sections](#4-body-sections)
5. [Categories](#5-categories)
6. [Quality Rules (Validator)](#6-quality-rules-validator)
7. [Auto-Fix Rules](#7-auto-fix-rules)
8. [Platform Mapping](#8-platform-mapping)
9. [Slug Collision Rules](#9-slug-collision-rules)
10. [Complete Template](#10-complete-template)
11. [Examples](#11-examples)

---

## 1. Overview

A `SKILL.md` file is the canonical, platform-neutral representation of a single skill in the Skills Library. Each skill encodes domain expertise, workflows, best practices, and tooling guidance that AI assistants can use to provide specialized help.

Every SKILL.md file consists of two parts:

1. **YAML Frontmatter** -- A metadata block delimited by `---` markers containing the skill name and description.
2. **Markdown Body** -- Structured content organized into standardized sections that convey the skill's knowledge.

SKILL.md files in `_master-skills/` serve as the single source of truth. All platform-specific outputs (Claude, Gemini, Codex, Copilot) are derived from these master files through automated converters.

The library currently contains **508** master skills across **6 categories**, converted to **4 platforms** with multiple output variants each.

---

## 2. File Location and Naming

### Directory Structure

```
_master-skills/
  {category}/
    {slug}/
      SKILL.md
      references/        (optional: supplementary material)
      assets/            (optional: templates, scripts)
```

### Path Convention

Every skill lives at exactly:

```
_master-skills/{category}/{slug}/SKILL.md
```

### Slug Rules

- The **slug** is the directory name, not derived from the frontmatter `name` field.
- Format: lowercase alphanumeric characters separated by hyphens.
- Regex: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- Examples: `api-design-principles`, `ceo`, `animation-motion-design`

### What NOT to Use as Slugs

The following are reserved/junk slugs that the pipeline rejects:

- `undefined`, `unnamed`, `template-skill`, `flashfusion-ai-skill-pack`
- `claudeskills`, `untitled`, `test-skill`, `example-skill`

---

## 3. YAML Frontmatter

The frontmatter block is delimited by `---` markers on the first and third lines. It contains exactly two required fields.

### Format

```yaml
---
name: {slug}
description: {description-text}
---
```

### Required Fields

#### `name` (string)

- Must match the directory slug exactly (the parent directory name).
- Lowercase alphanumeric with hyphens only.
- Validated against the regex: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- Examples: `api-design-principles`, `ceo`, `animation-motion-design`

#### `description` (string)

- **Length**: Minimum 20 characters, maximum 500 characters.
- **Action phrase start**: Must contain at least one trigger verb (see list below).
- **"Use when" clause**: Must contain a phrase explaining when to invoke the skill. Accepted indicators include: `Use when`, `Use for`, `Use this`, `Invoke when`, `Helpful for`, `Designed for`, `Ideal for`, `Best for`, `Suitable for`, `When you need`, `When you want`.
- **No boilerplate**: Must not contain generic phrases like "this skill does things" or "a general purpose skill".
- **Quality target**: Should contain 2 or more trigger verbs for optimal discoverability.

### Trigger Verbs

The following action verbs are recognized by the validator and enrichment pipeline:

```
create, analyze, build, manage, optimize, generate, design, develop,
implement, configure, deploy, automate, review, audit, plan, monitor,
debug, test, transform, validate, migrate, integrate, document,
evaluate, refactor, maintain, scale, convert, extract, visualize,
streamline, diagnose, write, assess, produce, compile, format,
structure, define, establish, enforce, resolve, track
```

### Frontmatter Examples

Good:

```yaml
---
name: api-design-principles
description: Master REST and GraphQL API design principles to build intuitive, scalable, and maintainable APIs that delight developers. Use when designing new APIs, reviewing API specifications, or establishing API design standards.
---
```

```yaml
---
name: animation-motion-design
description: Comprehensive motion design guide covering animation principles, Lottie, Framer Motion, GSAP, performance optimization, and accessibility. Provides production-ready patterns for micro-interactions, transitions, choreography, and branded motion languages following 2025 best practices. Use when designing, creating, or reviewing creative deliverables.
---
```

Bad (would fail validation):

```yaml
---
name: My Skill Name
description: Does stuff.
---
```

Problems: name contains uppercase and spaces; description is too short, lacks trigger verbs, and has no "Use when" clause.

---

## 4. Body Sections

The body follows the closing `---` of the frontmatter. It uses markdown with `##` (h2) level headings for primary sections. The expected sections are listed below. While the skill body is flexible, the validator checks for the presence of a core workflow/instructions section and adequate depth.

### Section Reference

#### 4.1. Title Heading (Optional)

```markdown
# {Skill Title}
```

- Level: `#` (h1)
- Purpose: Human-readable title of the skill.
- The auto-fix pipeline keeps the first `#` heading as the title and promotes subsequent `#` headings to `##`.

#### 4.2. Overview / Core Workflow (Required -- one of these)

```markdown
## Overview
```

or

```markdown
## Core Workflow
```

- Level: `##` (h2)
- Purpose: Brief summary of what the skill covers and its primary value proposition.
- This is the most critical section. The validator checks for the presence of a heading from a recognized set of core section names.
- **Required**: Yes. At least one heading from the recognized set must be present.

**Recognized core section heading names** (case-insensitive):

```
core workflow, instructions, core processes, core process, workflow,
quick start, how to use, getting started, steps, step, usage,
implementation, process, guide, overview, methodology, framework,
approach, procedure, how it works, implementation guide, key capabilities,
primary functions, main features, configuration
```

#### 4.3. When to Use (Recommended)

```markdown
## When to Use
```

or `## When to Use This Skill`

- Level: `##` (h2)
- Purpose: Bullet list of scenarios, triggers, and contexts where this skill applies.
- **Required**: No, but strongly recommended for discoverability.

Example:

```markdown
## When to Use This Skill

- Designing new REST or GraphQL APIs
- Refactoring existing APIs for better usability
- Establishing API design standards for your team
- Reviewing API specifications before implementation
```

#### 4.4. Core Processes / Patterns / Concepts (Recommended)

```markdown
## Core Concepts
```

or `## Core Processes`, `## Patterns`, `## Implementation Techniques`, etc.

- Level: `##` (h2)
- Purpose: The substantive knowledge content. Detailed workflows, patterns, code examples, frameworks, step-by-step procedures.
- **Required**: No, but the validator expects the body to contain either code blocks (triple-backtick fenced blocks) or detailed numbered lists (numbered items with 20+ character descriptions).

#### 4.5. Tools and Templates (Optional)

```markdown
## Tools & Templates
```

or `## Tools & Resources`, `## Resources`

- Level: `##` (h2)
- Purpose: Reference tools, libraries, frameworks, templates, and external resources relevant to the skill.
- **Scoring bonus**: Skills with headings containing "template", "framework", "boilerplate", or "scaffold" receive a +10 quality score bonus.

#### 4.6. Metrics (Optional)

```markdown
## Metrics
```

- Level: `##` (h2)
- Purpose: Key performance indicators, success metrics, and measurement approaches for evaluating skill application.

#### 4.7. Common Pitfalls (Recommended)

```markdown
## Common Pitfalls
```

- Level: `##` (h2)
- Purpose: Anti-patterns, frequent mistakes, and things to avoid.

#### 4.8. Integration Points (Optional)

```markdown
## Integration Points
```

or `## Related Skills`

- Level: `##` (h2)
- Purpose: Cross-references to related skills, adjacent domains, or follow-up workflows.
- Cross-references can use markdown links: `[skill-name](../other-skill/SKILL.md)`

### Body Requirements Summary

| Aspect | Requirement | Penalty/Bonus |
|--------|-------------|---------------|
| Minimum body length | 50 lines (blocking error below this) | -20 per error |
| Recommended body length | 200+ lines | Warning if under 200 |
| Maximum body length | 2000 lines | Error above 2000 |
| Minimum substantive content | 500 characters | Error if stub detected |
| At least one `##` heading | Required | Error if missing |
| Core workflow section | Required (any recognized name) | Error if missing |
| Code blocks or detailed lists | Required | Error if neither present |
| `references/` directory | Recommended if body > 500 lines | Warning if missing |
| Heading order | `##` must appear before `###` | Error if violated |
| No duplicate paragraphs | Blocks > 80 chars must not repeat | Error if duplicates found |

---

## 5. Categories

The Skills Library organizes skills into 6 categories. Each category has a default temperature setting used by platform converters, category-specific trigger verb suggestions, and a "Use when" phrase appended to descriptions that lack one.

### Category Reference

#### `ai-agents` -- AI Agent Workflows

- **Skill count**: 232
- **Default temperature**: 0.5
- **Description**: Skills for configuring, building, and troubleshooting AI agent workflows. Covers LLM orchestration, RAG pipelines, prompt engineering, MCP builders, and multi-agent architectures.
- **"Use when" phrase**: "Use when configuring, building, or troubleshooting AI agent workflows."
- **Suggested verbs**: configure, build, automate, integrate, orchestrate
- **Example skills**: `ceo`, `rag-implementation`, `langchain-architecture`, `mcp-builder`, `llm-evaluation`

#### `technical` -- Technical Implementation

- **Skill count**: 127
- **Default temperature**: 0.3
- **Description**: Skills for building, debugging, and optimizing technical implementations. Covers software development, DevOps, cloud architecture, testing, security, and infrastructure.
- **"Use when" phrase**: "Use when building, debugging, or optimizing technical implementations."
- **Suggested verbs**: build, debug, optimize, implement, deploy
- **Example skills**: `api-design-principles`, `code-review`, `cloud-architecture`, `testing-strategies`, `microservices-patterns`

#### `strategy` -- Business Strategy

- **Skill count**: 59
- **Default temperature**: 0.5
- **Description**: Skills for planning, analyzing, and developing business strategies. Covers market analysis, competitive intelligence, growth planning, product strategy, and business modeling.
- **"Use when" phrase**: "Use when planning, analyzing, or developing business strategies."
- **Suggested verbs**: analyze, plan, evaluate, develop, optimize
- **Example skills**: `product-strategy`, `competitive-intelligence`, `go-to-market`, `pricing-optimization`, `market-analysis`

#### `creative` -- Creative Design

- **Skill count**: 40
- **Default temperature**: 0.7
- **Description**: Skills for designing, creating, and reviewing creative deliverables. Covers visual design, UX, animation, typography, content creation, and brand systems.
- **"Use when" phrase**: "Use when designing, creating, or reviewing creative deliverables."
- **Suggested verbs**: design, create, review, produce, refine
- **Example skills**: `animation-motion-design`, `typography-mastery`, `color-theory-application`, `ui-design`, `data-visualization`

#### `operations` -- Operational Workflows

- **Skill count**: 24
- **Default temperature**: 0.4
- **Description**: Skills for managing, optimizing, and automating operational workflows. Covers procurement, compliance, supply chain, facility management, and workflow orchestration.
- **"Use when" phrase**: "Use when managing, optimizing, or automating operational workflows."
- **Suggested verbs**: automate, manage, optimize, monitor, streamline
- **Example skills**: `supply-chain-optimization`, `procurement-workflows`, `release-management`, `workflow-orchestration`, `payroll-processing`

#### `industry` -- Industry-Specific

- **Skill count**: 25
- **Default temperature**: 0.4
- **Description**: Skills for navigating industry-specific regulations, processes, and operations. Covers healthcare, fintech, manufacturing, logistics, legal, energy, and more.
- **"Use when" phrase**: "Use when navigating industry-specific regulations, processes, or operations."
- **Suggested verbs**: manage, audit, monitor, implement, evaluate
- **Example skills**: `healthcare-compliance`, `fintech-operations`, `logistics-optimization`, `pharmaceutical-compliance`, `real-estate-management`

### Temperature Summary

| Category | Temperature | Rationale |
|----------|------------|-----------|
| technical | 0.3 | Precision and correctness critical |
| operations | 0.4 | Process accuracy important |
| industry | 0.4 | Regulatory precision needed |
| ai-agents | 0.5 | Balance between precision and creativity |
| strategy | 0.5 | Analytical with room for creative insight |
| creative | 0.7 | Maximum creative expression |

---

## 6. Quality Rules (Validator)

The `lib/skill_validator.py` module defines a `SkillValidator` class that runs five validation passes on each skill and calculates a 0-100 quality score.

### 6.1. Frontmatter Validation

| Check | Severity | Rule |
|-------|----------|------|
| `name` field present and non-empty | Error | Missing name fails validation |
| `name` matches slug pattern | Error | Must match `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| `description` field present and non-empty | Error | Missing description fails validation |
| `description` minimum length | Error | Must be >= 20 characters |
| `description` maximum length | Error | Must be <= 500 characters |
| `description` contains trigger verbs | Error | At least 1 trigger verb required |

### 6.2. Body Validation

| Check | Severity | Rule |
|-------|----------|------|
| Body length >= 50 lines | Error | Minimum line count |
| Body length 50-199 lines | Warning | Recommend expanding to 200+ |
| Body length > 2000 lines | Error | Consider splitting |
| Has at least one `##` heading | Error | Required for structure |
| Has core workflow/instructions section | Error | Must have recognized heading |
| Has code blocks or detailed numbered lists | Error | Concrete examples required |
| Body >= 500 characters | Error | Stub detection threshold |

### 6.3. Structure Validation

| Check | Severity | Rule |
|-------|----------|------|
| Body > 500 lines without `references/` dir | Warning | Suggest splitting |
| Duplicate content blocks (>80 chars) | Error | Remove repeated paragraphs |
| `###` heading before any `##` heading | Error | Use `##` before `###` |

### 6.4. Description Quality Validation

| Check | Severity | Rule |
|-------|----------|------|
| Fewer than 2 trigger verbs | Warning | Aim for 2+ for discoverability |
| No "Use when" / "Use for" / similar phrase | Warning | Should explain when to use |
| Contains boilerplate text | Error | Write specific descriptions |

### 6.5. Cross-Reference Validation

| Check | Severity | Rule |
|-------|----------|------|
| Referenced skill does not exist | Warning | Broken cross-reference |

### 6.6. Scoring Rubric

Scoring starts at 100 and adjusts as follows:

| Factor | Points |
|--------|--------|
| Each error | -20 |
| Each warning | -5 |
| Has code blocks or detailed numbered lists | +10 |
| Has template/framework/boilerplate/scaffold section | +10 |
| Has output format/deliverable/result format section | +5 |

Score is clamped to the range 0-100.

**Pass threshold**: A skill passes validation if it has **zero errors** (warnings are allowed).

### Running the Validator

```bash
# Validate all skills
python lib/skill_validator.py --all

# Validate a single skill
python lib/skill_validator.py --skill technical/api-design-principles

# Validate a category
python lib/skill_validator.py --category ai-agents

# Show only skills below a score threshold
python lib/skill_validator.py --all --min-score 70
```

---

## 7. Auto-Fix Rules

The `fix_skills_unified.py` script consolidates three quality-fix passes into a single script. Each pass can be run independently or all together. Passes are applied in sequence on the in-memory content, with a single read at the start and a single write at the end.

### Pass 1: Frontmatter Repair and Description Generation

**Purpose**: Ensure every skill has valid frontmatter with a high-quality description.

| Fix | Trigger | Action |
|-----|---------|--------|
| Missing frontmatter | No `---` block at top | Generate `name` from directory slug, generate description from body content |
| Malformed frontmatter | Opening `---` but no closing `---` | Parse partial YAML, add closing marker |
| Empty/short description | Description missing or < 20 chars | Extract description from first paragraph(s) of body |
| Missing trigger verbs | Fewer than 2 trigger verbs | Prepend "Helps {verb1} and {verb2} {title} processes." |
| Missing "Use when" | No "Use when" / "Use for" phrase | Append category-specific "Use when" phrase |

**Description generation heuristic**: The first non-heading, non-blank, non-list paragraph of the body is used. Blockquotes (lines starting with `>`) are preferred. Markdown formatting (`**bold**`, `[links](url)`) is stripped. The result is capped at 300 characters.

**Description improvement**: If the existing description already exists but lacks quality, a category-specific prefix is added. The category-specific "Use when" phrases (from `lib/config.py`) are:

| Category | "Use when" Phrase |
|----------|-------------------|
| technical | Use when building, debugging, or optimizing technical implementations. |
| strategy | Use when planning, analyzing, or developing business strategies. |
| creative | Use when designing, creating, or reviewing creative deliverables. |
| industry | Use when navigating industry-specific regulations, processes, or operations. |
| operations | Use when managing, optimizing, or automating operational workflows. |
| ai-agents | Use when configuring, building, or troubleshooting AI agent workflows. |

### Pass 2: Heading Promotion and Section Insertion

**Purpose**: Fix structural heading issues and ensure a core workflow section exists.

| Fix | Trigger | Action |
|-----|---------|--------|
| No `##` headings but has `#` headings | Body has `#` but no `##` | Keep first `#` as title, promote all subsequent `#` to `##` |
| No core section heading | No heading from recognized set (after 100+ chars of body) | Insert `## Core Workflow` (if body has numbered steps) or `## Instructions` (otherwise) after the title |

### Pass 3: Name Slugification, Description Trimming, and Structure Polish

**Purpose**: Final cleanup and consistency pass.

| Fix | Trigger | Action |
|-----|---------|--------|
| Non-slug name | Name contains uppercase, spaces, or special chars | Convert to lowercase-hyphenated slug |
| Description too long | Description > 500 characters | Truncate at sentence boundary (prefer period + space), fall back to word boundary at ~490 chars |
| No core section with existing `##` headings | Has `##` headings but no recognized core section name | Insert `## Core Workflow` (if numbered steps follow) or `## Overview` before the first `##` heading |

### Running the Fixer

```bash
# All skills, all passes
python fix_skills_unified.py --all

# All skills, pass 1 only
python fix_skills_unified.py --all --pass 1

# One category, dry run
python fix_skills_unified.py --category ai-agents --dry-run

# One skill
python fix_skills_unified.py --skill technical/api-design-principles

# Preview all changes without writing
python fix_skills_unified.py --dry-run --all --verbose
```

---

## 8. Platform Mapping

Each master SKILL.md is converted to platform-specific formats through automated converters. The mapping is driven by skill metadata (category, body complexity) combined with platform-specific configuration in `lib/config.py` and `lib/platform_tuning.py`.

### 8.1. Complexity Estimation

All platforms use a shared complexity estimation function. The complexity level (`simple`, `moderate`, `complex`) determines model selection and output configuration.

| Signal | Simple | Moderate | Complex |
|--------|--------|----------|---------|
| Line count | < 100 | 100-300 | > 300 |
| Section count | <= 5 | 6-10 | > 10 |
| Has code blocks | -- | +1 | +1 |
| Has template variables (`{{...}}`) | -- | +1 | +1 |
| Has framework/architecture references | -- | +1 | +1 |

Score mapping: 1-2 = simple, 3-5 = moderate, 6+ = complex.

### 8.2. Gemini

**Output formats**: JSON gem files, CLI SKILL.md, Studio prompt pairs, Agent GEMINI.md + JSON.

**Model selection** (by complexity):

| Complexity | Model |
|-----------|-------|
| simple | gemini-2.5-flash |
| moderate | gemini-2.5-flash |
| complex | gemini-2.5-pro |

**Temperature**: Set by category (see Section 5 temperature table).

**Safety settings**: All five harm categories set to `BLOCK_ONLY_HIGH`:

- `HARM_CATEGORY_HARASSMENT`
- `HARM_CATEGORY_HATE_SPEECH`
- `HARM_CATEGORY_SEXUALLY_EXPLICIT`
- `HARM_CATEGORY_DANGEROUS_CONTENT`
- `HARM_CATEGORY_CIVIC_INTEGRITY`

**Grounding**: Enabled for categories `strategy`, `industry`, and `operations`. When grounding is active, the system prompt is prefixed with instructions to leverage Google Search grounding and use structured output.

**Agent tools** (per category):

| Category | Tools |
|----------|-------|
| technical | code_execution, google_search |
| ai-agents | code_execution, google_search |
| strategy | google_search |
| creative | code_execution |
| operations | code_execution |
| industry | google_search |

### 8.3. Codex (OpenAI)

**Output formats**: Responses API JSON, GPT Builder JSON, Agent Builder JSON, system-prompt TXT, CLI AGENTS.md.

**Model selection** (by complexity):

| Complexity | Model |
|-----------|-------|
| simple | gpt-4.1-mini |
| moderate | gpt-4.1 |
| complex | o4-mini |

**Category-level model overrides** (used when category is the primary selector):

| Category | Model |
|----------|-------|
| technical | gpt-4.1 |
| ai-agents | gpt-4.1 |
| strategy | o4-mini |
| creative | gpt-4.1 |
| operations | gpt-4.1-mini |
| industry | gpt-4.1 |

**Tools** (per category):

| Category | Tools |
|----------|-------|
| technical | code_interpreter, file_search |
| ai-agents | code_interpreter, web_search |
| strategy | code_interpreter, web_search |
| creative | code_interpreter |
| operations | code_interpreter |
| industry | code_interpreter, web_search |

**GPT Builder capabilities** (per category):

| Category | web_browsing | code_interpreter | image_generation | file_upload |
|----------|-------------|-------------------|-----------------|-------------|
| technical | false | true | false | true |
| strategy | true | true | false | true |
| creative | false | true | true | true |
| operations | false | true | false | true |
| industry | true | true | false | true |
| ai-agents | true | true | false | true |

**Response format hints**:

- `style`: `structured_markdown` for technical and operations categories; `prose` for others.
- `verbosity`: `detailed` for complex skills; `concise` for simple/moderate.

### 8.4. GitHub Copilot

**Output formats**: Custom instructions (per category), agent skills, chat participants, CLI SKILL.md, Frontier SKILL.md.

**File patterns** (which files the instruction applies to):

| Category | File Patterns |
|----------|--------------|
| technical | `**/*.py`, `**/*.js`, `**/*.ts`, `**/*.java`, `**/*.go`, `**/*.rs`, `**/*.cpp`, `**/*.c`, `**/*.h`, `**/*.cs` |
| creative | `**/*.md`, `**/*.mdx`, `**/*.txt`, `**/*.html`, `**/*.css`, `**/*.svg` |
| strategy | `**/*.md`, `**/*.txt`, `**/*.pdf`, `**/*.docx` |
| operations | `**/*.yaml`, `**/*.yml`, `**/*.toml`, `**/*.json`, `**/*.tf`, `**/*.hcl`, `**/Dockerfile`, `**/*.sh` |
| industry | `**/*.md`, `**/*.json`, `**/*.yaml`, `**/*.csv` |
| ai-agents | `**/*.py`, `**/*.js`, `**/*.ts`, `**/*.yaml`, `**/*.json` |

**Scope**: `workspace` for technical, operations, ai-agents; `global` for others.

**Priority** (higher = higher precedence):

| Category | Priority |
|----------|----------|
| ai-agents | 9 |
| technical | 8 |
| operations | 7 |
| strategy | 6 |
| industry | 6 |
| creative | 5 |

### 8.5. Claude (Anthropic)

**Output formats**: CLI SKILL.md, Desktop plugin SKILL.md, Web project-instructions.md, main skills (by category).

**Model selection** (by complexity):

| Complexity | Model |
|-----------|-------|
| simple | claude-sonnet-4-5-20250929 |
| moderate | claude-sonnet-4-5-20250929 |
| complex | claude-opus-4-6 |

**Max tokens** (by complexity):

| Complexity | Max Tokens |
|-----------|------------|
| simple | 4,096 |
| moderate | 8,192 |
| complex | 16,384 |

**MCP tool hints** (per category):

- **technical, operations**: filesystem server, GitHub server
- **strategy, industry, ai-agents**: web_search server
- **ai-agents**: subagent server (task delegation)

### 8.6. Platform Template Wrappers

Each platform wraps the skill's core instructions with platform-specific preamble and postamble. The placeholder `{core_instructions}` is replaced with the converted skill body.

- **Gemini**: Grounding instructions + structured output guidance
- **Codex**: Tool use patterns + function calling guidance
- **Copilot**: @workspace references + VS Code integration notes
- **Claude**: MCP tool references + sub-agent delegation patterns

---

## 9. Slug Collision Rules

### The Problem

Some skill directory names exist in multiple categories. When converting to flat output formats (where skills are identified only by slug), these collisions cause one skill to overwrite another.

### Known Collision Groups

The following 5 slug names appear in more than one category:

1. `content-strategy`
2. `market-research`
3. `product-launch`
4. `stakeholder-management`
5. `workflow-optimization`

### Dedup Prefix Pattern

When a collision is detected, the effective slug becomes:

```
{category}--{slug}
```

For example:
- `strategy--content-strategy`
- `creative--content-strategy`

### Detection Mechanism

The `lib/skill_parser.py` module handles collision detection in `discover_all_skills()`:

1. **Type 1 (known)**: The slug is in the hardcoded `_SLUG_COLLISION_GROUPS` set. The `{category}--{slug}` prefix is always applied.
2. **Type 2 (dynamic)**: The slug appears more than once across all parsed skills (detected by counting). The prefix is applied automatically even if not in the known set.

### Using Effective Slugs

Always use `get_effective_slug(skill)` from `lib/skill_parser.py` when generating output file names. This function returns `_dedup_slug` if present, otherwise falls back to the base `slug`.

---

## 10. Complete Template

```markdown
---
name: my-skill-name
description: Action-rich description that explains what this skill does and helps users discover it. Covers key capabilities and workflows. Use when working on tasks related to this domain.
---

# My Skill Name

## Overview

Brief summary of what this skill provides, its primary value proposition,
and the domain it covers. Should be 2-4 sentences.

---

## When to Use This Skill

- Scenario or trigger condition 1
- Scenario or trigger condition 2
- Scenario or trigger condition 3
- Scenario or trigger condition 4
- Scenario or trigger condition 5

---

## Core Processes

### Process 1: Name

**Purpose**: What this process accomplishes.

**Steps**:
1. First step with enough detail to be actionable
2. Second step with concrete guidance
3. Third step with expected outcomes

**Example**:
```language
// Code example or template demonstrating the process
```

### Process 2: Name

**Purpose**: What this process accomplishes.

**Steps**:
1. First step
2. Second step
3. Third step

---

## Tools & Templates

### Recommended Tools
- **Tool Name**: Brief description of what it does and when to use it
- **Tool Name**: Brief description

### Templates
- **Template Name**: What it provides and how to use it

---

## Metrics

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| Metric 1 | Target value | How to measure |
| Metric 2 | Target value | How to measure |

---

## Common Pitfalls

- **Pitfall 1**: Description of what goes wrong and how to avoid it
- **Pitfall 2**: Description of what goes wrong and how to avoid it
- **Pitfall 3**: Description of what goes wrong and how to avoid it

---

## Integration Points

- **Related Skill 1**: When and why to use it alongside this skill
- **Related Skill 2**: When and why to use it alongside this skill
```

---

## 11. Examples

### Example 1: Technical Skill (api-design-principles)

```yaml
---
name: api-design-principles
description: Master REST and GraphQL API design principles to build intuitive, scalable, and maintainable APIs that delight developers. Use when designing new APIs, reviewing API specifications, or establishing API design standards.
---
```

Body structure (abbreviated):

```markdown
# API Design Principles

## Core Workflow


Master REST and GraphQL API design principles to build intuitive,
scalable, and maintainable APIs...

## When to Use This Skill

- Designing new REST or GraphQL APIs
- Refactoring existing APIs for better usability
- Establishing API design standards for your team
- Reviewing API specifications before implementation
- Migrating between API paradigms (REST to GraphQL, etc.)

## Core Concepts

### 1. RESTful Design Principles
...

### 2. GraphQL Design Principles
...

### 3. API Versioning Strategies
...

## REST API Design Patterns

### Pattern 1: Resource Collection Design
[code examples]

### Pattern 2: Pagination and Filtering
[code examples]

## Best Practices

### REST APIs
1. Consistent Naming...
2. Stateless...

### GraphQL APIs
1. Schema First...
2. Avoid N+1...

## Common Pitfalls

- Over-fetching/Under-fetching (REST)
- Breaking Changes
- Inconsistent Error Formats
...

## Resources

- references/rest-best-practices.md
- assets/rest-api-template.py
...
```

**Validator assessment**: This skill would score high (90+). It has valid frontmatter, multiple trigger verbs in the description ("design", "build", "review"), a "Use when" phrase, recognized core sections ("Core Workflow", "Core Concepts"), extensive code blocks, and multiple `##` headings in correct order.

### Example 2: AI Agents Skill (ceo)

```yaml
---
name: ceo
description: Helps configure and build ceo processes. Chief Executive Officer - Strategic Advisor. Use when configuring, building, or troubleshooting AI agent workflows.
---
```

Body structure (abbreviated):

```markdown
# Chief Executive Officer Skill

## Core Workflow

## Purpose
Serve as a strategic advisor to the CEO...

## When to Use
- Board meeting preparation and materials
- Investor relations and fundraising communications
- Strategic planning and company direction
...

## Model Configuration
[table with model, tokens, tier]

## System Prompt
[fenced code block with full system prompt]

## Variables
[template variables table]

## HITL Rules
[human-in-the-loop rules]

## Trigger Patterns
[auto-activation keywords]

## Best Practices
### Do / Don't lists

## Examples
### Example 1: Board Meeting Preparation
### Example 2: Strategic Direction

## Related Skills
- CTO, CFO, CISO

## Governance Notes
[audit retention, session timeout, rate limits]
```

**Validator assessment**: This skill demonstrates the full-featured format used by ai-agents skills, including model configuration, system prompts, variables, HITL rules, trigger patterns, examples with expected response patterns, and governance notes. The description contains trigger verbs ("configure", "build") and a "Use when" phrase.

### Example 3: Creative Skill (animation-motion-design)

```yaml
---
name: animation-motion-design
description: Comprehensive motion design guide covering animation principles, Lottie, Framer Motion, GSAP, performance optimization, and accessibility. Provides production-ready patterns for micro-interactions, transitions, choreography, and branded motion languages following 2025 best practices. Use when designing, creating, or reviewing creative deliverables.
---
```

Body structure (abbreviated):

```markdown
# Animation & Motion Design Skill

## Overview
Comprehensive guide to animation systems, motion design principles,
and performance-optimized implementation...

## When to Use This Skill
- Designing micro-interactions
- Building animation systems for design systems
- Creating branded motion languages
...

## Motion Design Principles
### 12 Principles of Animation
[CSS and JSX code examples for each principle]

## Animation Taxonomy
### 1. Micro-Interactions
### 2. Transitions
### 3. Choreography
### 4. Branded Motion

## Implementation Techniques
### 1. CSS Animations
### 2. Framer Motion
### 3. GSAP
### 4. Lottie
### 5. Web Animations API

## Performance Optimization
### 1. GPU Acceleration
### 2. Reduce Complexity
### 3. Reduce Motion Support
### 4. Performance Monitoring

## Common Animation Patterns
[Loading states, notifications, modals, lists, scroll animations]

## Animation Checklist
[Design phase, development phase, QA phase checklists]

## Common Pitfalls
[Anti-patterns and best practices]

## Tools & Resources
[Design tools, development libraries, performance tools]

## Gaps & Blindspots
[Known limitations and unknown unknowns]
```

**Validator assessment**: This skill scores very high. It has a clear "Overview" section, extensive code examples across CSS, JSX, and JavaScript, well-organized `##` and `###` headings, a dedicated "Common Pitfalls" section, and comprehensive tool references. The description contains multiple trigger verbs ("design", "create", "review") and a "Use when" phrase.

---

## Appendix: File Reference

| File | Purpose |
|------|---------|
| `lib/config.py` | Categories, temperatures, models, trigger verbs, tools, patterns |
| `lib/skill_validator.py` | Quality validation and scoring |
| `lib/metadata_enricher.py` | Auto-tagging, complexity estimation, token counting |
| `lib/platform_tuning.py` | Platform-specific settings (Gemini, Codex, Copilot, Claude) |
| `lib/skill_parser.py` | Frontmatter parsing, slug collision handling, skill discovery |
| `fix_skills_unified.py` | Three-pass quality fixer |
| `sync-skills.py` | Multi-platform conversion orchestrator |
| `populate_all.py` | Top-level pipeline orchestrator (bundles, variants, quality, cleanup) |
