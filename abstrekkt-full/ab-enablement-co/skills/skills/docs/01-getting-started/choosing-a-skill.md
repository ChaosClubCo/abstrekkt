# Choosing a Skill

The Skills Library contains 514 skills. This guide shows you how to browse, filter, and evaluate skills so you can find the right one for your task.

---

## Where Skills Live

All master skill definitions are in the `_master-skills/` directory at the project root. They are organized by category:

```
_master-skills/
  ai-agents/          # 233 skills
  technical/          # 130 skills
  strategy/           #  59 skills
  creative/           #  40 skills
  operations/         #  27 skills
  industry/           #  25 skills
```

Each skill has its own subdirectory named with a URL-friendly slug. Inside that directory is a single `SKILL.md` file:

```
_master-skills/technical/code-review-checklist/SKILL.md
_master-skills/ai-agents/multi-agent-orchestrator/SKILL.md
_master-skills/strategy/competitive-landscape-analyzer/SKILL.md
```

The directory name (the slug) is the skill's unique identifier. It is used across all platforms and in all converted output formats.

---

## Understanding the SKILL.md Format

Every SKILL.md file has two parts: YAML frontmatter and a markdown body.

### Frontmatter

The frontmatter block is enclosed in `---` delimiters at the top of the file. It always contains at least two fields:

```yaml
---
name: Code Review Checklist
description: Performs structured code reviews following a comprehensive checklist covering correctness, security, performance, readability, and maintainability.
---
```

- **name** -- the human-readable display name of the skill.
- **description** -- a one- or two-sentence summary of what the skill does.

Some skills include additional frontmatter fields added by the metadata enricher:

```yaml
---
name: Code Review Checklist
description: Performs structured code reviews following a comprehensive checklist.
tags: [code-review, quality, security]
complexity: intermediate
related_skills: [architecture-review, security-audit, testing-strategy]
platforms: [claude, gemini, codex, copilot]
---
```

- **tags** -- keywords for search and filtering.
- **complexity** -- one of `beginner`, `intermediate`, or `advanced`.
- **related_skills** -- slugs of complementary skills.
- **platforms** -- which platforms this skill is converted for.

### Body Sections

The markdown body follows a standard structure. Not every section is present in every skill, but the common headings are:

| Section | Purpose |
|---------|---------|
| Overview | What the skill does and when it is useful |
| When to Use | Specific scenarios and triggers |
| Core Processes | Step-by-step instructions the AI follows |
| Tools & Templates | Frameworks, checklists, and output templates |
| Metrics | How to measure success |
| Common Pitfalls | Mistakes to avoid |
| Integration Points | How this skill connects to other skills |

---

## Browsing by Category

The fastest way to find a skill is to start with the right category.

### ai-agents (233 skills)

Skills for building, orchestrating, and managing autonomous AI agents. Examples:

- `multi-agent-orchestrator` -- coordinate multiple agents on a shared task
- `tool-use-planner` -- plan and execute tool calls in sequence
- `rag-pipeline-builder` -- build retrieval-augmented generation pipelines
- `agent-memory-manager` -- manage short- and long-term agent memory
- `chain-of-thought-reasoner` -- structured reasoning and problem decomposition

Best for: developers building agent systems, anyone doing complex multi-step AI workflows.

### technical (130 skills)

Software engineering, DevOps, architecture, and code quality. Examples:

- `code-review-checklist` -- structured code review
- `api-design-reviewer` -- evaluate REST/GraphQL API designs
- `database-schema-optimizer` -- analyze and improve database schemas
- `ci-cd-pipeline-designer` -- design continuous integration workflows
- `refactoring-advisor` -- suggest code refactoring strategies

Best for: software engineers, DevOps teams, technical leads.

### strategy (59 skills)

Business strategy, market analysis, and decision-making. Examples:

- `competitive-landscape-analyzer` -- map and analyze competitors
- `market-entry-strategy` -- plan market entry for new products
- `okr-framework-builder` -- create objectives and key results
- `risk-assessment-matrix` -- identify and score business risks
- `pricing-strategy-modeler` -- model pricing scenarios

Best for: product managers, founders, business analysts, consultants.

### creative (40 skills)

Writing, design, content generation, and ideation. Examples:

- `content-strategy-planner` -- plan content calendars and themes
- `copywriting-optimizer` -- improve marketing copy
- `brainstorming-facilitator` -- structured ideation sessions
- `brand-voice-developer` -- define and maintain brand voice
- `story-structure-analyzer` -- analyze narrative structure

Best for: writers, marketers, designers, content creators.

### operations (27 skills)

Project management, process improvement, and operational efficiency. Examples:

- `project-kickoff-planner` -- structure project launches
- `process-optimization-analyst` -- find and fix process bottlenecks
- `incident-response-coordinator` -- manage production incidents
- `resource-allocation-optimizer` -- balance team workloads
- `meeting-agenda-builder` -- create effective meeting agendas

Best for: project managers, operations teams, team leads.

### industry (25 skills)

Domain-specific skills for regulated and specialized industries. Examples:

- `healthcare-compliance-reviewer` -- HIPAA and regulatory compliance
- `financial-model-builder` -- build financial projections
- `legal-contract-analyzer` -- review contracts for issues
- `manufacturing-process-optimizer` -- improve production workflows
- `education-curriculum-designer` -- design learning programs

Best for: domain specialists, compliance teams, industry consultants.

---

## Filtering by Complexity

If skills have been enriched with complexity metadata, you can filter by difficulty:

### Using grep

```bash
# Find all beginner-level skills
grep -rl "complexity: beginner" _master-skills/

# Find all advanced skills in the ai-agents category
grep -rl "complexity: advanced" _master-skills/ai-agents/
```

### Using the validator

The skill validator can report complexity across the entire library:

```bash
python lib/skill_validator.py --report complexity
```

### Complexity levels

| Level | Typical Use | Example |
|-------|-------------|---------|
| beginner | Single-step tasks, straightforward instructions | `meeting-agenda-builder` |
| intermediate | Multi-step workflows, requires some domain knowledge | `code-review-checklist` |
| advanced | Complex orchestration, multi-agent, deep domain expertise | `multi-agent-orchestrator` |

---

## Finding Related Skills

Many skills reference related skills in their frontmatter or body. To find skills that work well together:

### Check the frontmatter

```bash
cat _master-skills/technical/code-review-checklist/SKILL.md | head -10
```

Look for the `related_skills` field.

### Search by keyword

```bash
# Find all skills mentioning "security"
grep -rl "security" _master-skills/ --include="SKILL.md"

# Find skills mentioning "API" in the technical category
grep -rl "API" _master-skills/technical/ --include="SKILL.md"
```

### Use the metadata enricher

The enricher can auto-detect related skills:

```bash
python -c "from lib.metadata_enricher import detect_related_skills; print(detect_related_skills('code-review-checklist'))"
```

---

## Using Bundles

Bundles are pre-curated groups of skills designed for specific use cases. Instead of picking individual skills, you can install an entire bundle.

The library includes 18 bundles across 3 platforms:

### Gemini Bundles (in `GeminiSkills/bundles/`)

| Bundle | Skills | Description |
|--------|--------|-------------|
| gems-full | 508 | Complete skill set as Gems |
| by-category | 508 | Organized by category |
| vertex-enterprise | 53 | Enterprise-grade Vertex AI skills |
| studio-essential-30 | 30 | Top 30 for AI Studio |
| agent-chains-20 | 20 | Multi-agent chain patterns |
| idx-workspace | 20 | IDX workspace integration |
| studio-creative-15 | 15 | Creative skills for Studio |

### Copilot Bundles (in `CopilotSkills/bundles/`)

| Bundle | Skills | Description |
|--------|--------|-------------|
| by-category | 508 | Organized by category |
| workspace-by-stack | 79 | Grouped by tech stack |
| agent-skills-50 | 50 | Top 50 agent skills |
| workspace-essential-30 | 30 | Essential workspace skills |
| coding-agent-20 | 20 | Coding-focused agent skills |
| chat-participants-20 | 20 | Chat participant configurations |

### Codex Bundles (in `CodexSkills/bundles/`)

| Bundle | Skills | Description |
|--------|--------|-------------|
| responses-api-full | 508 | Complete Responses API set |
| by-category | 508 | Organized by category |
| enterprise-assistants | 53 | Enterprise assistant configs |
| gpt-builder-50 | 50 | Top 50 for GPT Builder |
| agent-builder-20 | 20 | Agent Builder configurations |

---

## Tips for Choosing

1. **Start with the category** that matches your domain. If you are a developer, start in `technical` or `ai-agents`.

2. **Read the description** in the frontmatter before reading the full body. It tells you in one sentence whether the skill is relevant.

3. **Check complexity** if available. Start with `beginner` or `intermediate` skills to get a feel for the format.

4. **Look at related skills** to build a toolkit. Skills often work best in combination.

5. **Try a bundle** if you are setting up a new workspace. Bundles give you a curated starting point without the overhead of evaluating individual skills.

6. **Search by keyword** when you have a specific task in mind. The grep approach is fast and reliable across the full library.

---

## What to Read Next

- [Deploying to Claude](./deploying-to-claude.md) -- install selected skills on Claude
- [Deploying to Gemini](./deploying-to-gemini.md) -- install selected skills on Gemini
- [Deploying to Copilot](./deploying-to-copilot.md) -- install selected skills on Copilot
- [Deploying to Codex](./deploying-to-codex.md) -- install selected skills on Codex
- [FAQ](./faq.md) -- common questions about skill selection
