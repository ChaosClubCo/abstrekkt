# Bundle Catalog

This document provides a complete reference for all 18 bundles shipped with the Skills Library. Each entry includes the bundle's platform, skill count, target audience, file format, selection criteria, and recommended use case.

---

## Summary Comparison

| # | Bundle | Platform | Count | Format | Type | Audience |
|---|--------|----------|------:|--------|------|----------|
| 1 | gems-full | Gemini | 508 | .gem.json | Full | All Gemini users |
| 2 | by-category (Gemini) | Gemini | 508 | .gem.json | Category | Organized browsing |
| 3 | vertex-enterprise | Gemini | 53 | .gem.json | Enterprise | Platform architects |
| 4 | studio-essential-30 | Gemini | 30 | .gem.json | Essential | AI Studio generalists |
| 5 | agent-chains-20 | Gemini | 20 | .gem.json | Specialist | Agent pipeline builders |
| 6 | idx-workspace | Gemini | 20 | .gem.json | Specialist | Project IDX developers |
| 7 | studio-creative-15 | Gemini | 15 | .gem.json | Specialist | Designers and creatives |
| 8 | by-category (Copilot) | Copilot | 508 | .md | Category | All Copilot users |
| 9 | workspace-by-stack | Copilot | 79 | .md | Enterprise | Stack-specific teams |
| 10 | agent-skills-50 | Copilot | 50 | SKILL.md | Enterprise | Agent mode power users |
| 11 | workspace-essential-30 | Copilot | 30 | .md | Essential | VS Code generalists |
| 12 | coding-agent-20 | Copilot | 20 | SKILL.md | Specialist | Autonomous coding agents |
| 13 | chat-participants-20 | Copilot | 20 | .json | Specialist | Chat participant builders |
| 14 | responses-api-full | Codex | 508 | .response.json | Full | Responses API integrators |
| 15 | by-category (Codex) | Codex | 508 | .response.json | Category | Organized browsing |
| 16 | enterprise-assistants | Codex | 53 | .response.json | Enterprise | Enterprise teams |
| 17 | gpt-builder-50 | Codex | 50 | .gpt.json | Enterprise | Custom GPT creators |
| 18 | agent-builder-20 | Codex | 20 | .agent.json | Specialist | Agent Builder developers |

---

## Size Distribution

```
Full (508 skills):     gems-full, by-category (x3), responses-api-full
Enterprise (50-79):    vertex-enterprise (53), workspace-by-stack (79),
                       agent-skills-50 (50), enterprise-assistants (53),
                       gpt-builder-50 (50)
Essential (30):        studio-essential-30, workspace-essential-30
Specialist (15-20):    agent-chains-20, idx-workspace (20),
                       studio-creative-15, coding-agent-20,
                       chat-participants-20, agent-builder-20
```

---

## Selection and Ranking

Ranked bundles (those with a target count) use the `score_skill()` function in `populate_all.py` to sort skills. The scoring criteria:

| Factor | Points | Condition |
|--------|-------:|-----------|
| Body length | +2.0 | 50+ lines |
| Body length | +2.0 | 100+ lines |
| Body length | +1.0 | 200+ lines |
| Description quality | +1.0 | Description longer than 50 characters |
| Description quality | +1.0 | Contains "when" or "use" |
| Structure | +0.3/heading | Up to +3.0 max |
| Code blocks | +0.2/block | Up to +2.0 max |
| Too short | -3.0 | Fewer than 20 lines |

Maximum possible score: approximately 11.0. The top-ranked skills typically score 8.0 or above.

Category-filtered bundles (like `agent-chains-20` or `studio-creative-15`) first filter by category, then rank within that filtered set. The `vertex-enterprise` and `enterprise-assistants` bundles use a multi-category filter: all skills from `operations` and `industry`, plus `strategy` skills matching enterprise-related keywords (enterprise, compliance, governance, risk, audit).

The `workspace-by-stack` bundle uses keyword matching against skill names and descriptions to assign skills to 8 technology stacks, then takes the top 10 per stack by score.

The `coding-agent-20` bundle uses the `is_frontier_skill()` predicate to filter for skills suitable for autonomous coding agents before ranking.

---

## Gemini Bundles (7)

### 1. gems-full

- **Path:** `GeminiSkills/bundles/gems-full/{category}/{slug}.gem.json`
- **Count:** 508
- **Format:** Gem JSON files organized by category subdirectories
- **Audience:** Users who want every skill available as a Gemini Gem
- **Selection:** All 508 master skills, no filtering
- **Description:** The complete Skills Library converted to Gem JSON format. Each file includes model configuration, temperature settings, safety settings, and grounding parameters tuned by category. Use this when you want full coverage and will rely on Gemini's own search and selection to surface relevant skills.
- **Use case:** Deploying a comprehensive Gem library to a shared team workspace or populating a Gemini-powered internal tool with the entire skill set.

### 2. by-category (Gemini)

- **Path:** `GeminiSkills/bundles/by-category/{category}/{slug}.gem.json`
- **Count:** 508 (distributed across 6 category directories)
- **Format:** Gem JSON
- **Audience:** Users who browse skills by category and want to deploy individual categories
- **Selection:** All skills, organized into `ai-agents/`, `technical/`, `strategy/`, `creative/`, `operations/`, `industry/`
- **Description:** The same 508 skills as gems-full, organized into category subdirectories. This makes it possible to deploy a single category at a time. For example, deploying only the `technical/` directory gives you 127 coding and infrastructure skills without the other categories.
- **Use case:** Selective deployment by category. Deploy `operations/` plus `industry/` for a compliance team, or `creative/` alone for a design team.

### 3. vertex-enterprise

- **Path:** `GeminiSkills/bundles/vertex-enterprise/{slug}.gem.json`
- **Count:** 53
- **Format:** Gem JSON
- **Audience:** Enterprise architects, compliance teams, operations managers
- **Selection:** All skills from the `operations` and `industry` categories, plus `strategy` skills matching keywords: enterprise, compliance, governance, risk, audit. Sorted by score.
- **Description:** A curated bundle for enterprise deployments on Google Cloud Vertex AI. Contains governance, compliance, risk management, operations, and industry-specific skills. Excludes creative, agent-building, and general technical skills that are less relevant to enterprise governance contexts.
- **Use case:** Setting up Vertex AI assistants for regulated industries, internal compliance workflows, or enterprise governance programs.

### 4. studio-essential-30

- **Path:** `GeminiSkills/bundles/studio-essential-30/{slug}.gem.json`
- **Count:** 30
- **Format:** Gem JSON
- **Audience:** General-purpose AI Studio users
- **Selection:** Top 30 skills by `score_skill()` across all categories
- **Description:** The 30 highest-quality skills in the library, regardless of category. This is the recommended starting point for individual users who want a small, high-quality set of Gems in AI Studio without category-specific filtering.
- **Use case:** Personal AI Studio workspace. Quick setup for demos or evaluations.

### 5. agent-chains-20

- **Path:** `GeminiSkills/bundles/agent-chains-20/{slug}.gem.json`
- **Count:** 20
- **Format:** Gem JSON
- **Audience:** Developers building multi-step agent workflows
- **Selection:** Top 20 skills from the `ai-agents` category by score
- **Description:** The highest-scoring agent-related skills, designed for building and orchestrating multi-step AI agent pipelines. These skills cover agent architecture patterns, tool use, chain-of-thought workflows, evaluation, and monitoring. They work well as Gems that inform agent behavior in Gemini-based pipelines.
- **Use case:** Building agent chains in Gemini. Deploying agent-aware Gems that guide autonomous or semi-autonomous workflows.

### 6. idx-workspace

- **Path:** `GeminiSkills/bundles/idx-workspace/{slug}.gem.json`
- **Count:** 20
- **Format:** Gem JSON
- **Audience:** Developers using Google Project IDX
- **Selection:** Top 20 skills from the `technical` category by score
- **Description:** A compact, development-focused bundle optimized for Project IDX workspaces. Contains the 20 best technical skills covering code quality, architecture, testing, debugging, and infrastructure. These skills complement IDX's built-in Gemini integration by providing domain-specific guidance.
- **Use case:** Adding Gems to an IDX workspace for code review, architecture decisions, and development workflows.

### 7. studio-creative-15

- **Path:** `GeminiSkills/bundles/studio-creative-15/{slug}.gem.json`
- **Count:** 15
- **Format:** Gem JSON
- **Audience:** Designers, content creators, creative professionals
- **Selection:** Top 15 skills from the `creative` category by score
- **Description:** A focused creative bundle for AI Studio. Contains skills covering content strategy, visual design, UX writing, brand guidelines, creative briefs, and other design-adjacent workflows. Uses category-tuned temperature settings that favor more creative, exploratory outputs.
- **Use case:** Creative teams using AI Studio for brainstorming, content generation, brand work, or design system documentation.

---

## Copilot Bundles (6)

### 8. by-category (Copilot)

- **Path:** `CopilotSkills/bundles/by-category/{category}/{slug}.md`
- **Count:** 508 (distributed across 6 category directories)
- **Format:** Markdown (Copilot custom instruction format)
- **Audience:** Full coverage users on GitHub Copilot
- **Selection:** All 508 skills organized by category
- **Description:** The complete Skills Library in Copilot custom instruction Markdown format, organized by category. Each file is a self-contained instruction document that Copilot can use to guide its behavior for a specific skill domain.
- **Use case:** Deploying the full library to a GitHub repository. Selecting individual categories for team-specific repos.

### 9. workspace-by-stack

- **Path:** `CopilotSkills/bundles/workspace-by-stack/{stack}/{slug}.md`
- **Count:** 79 (across 8 stack directories, up to 10 per stack)
- **Format:** Markdown
- **Audience:** Development teams organized by technology stack
- **Selection:** Skills matched by keyword to 8 stacks, top 10 per stack by score
- **Description:** Skills organized by technology stack rather than the library's default categories. The 8 stacks and their matching keywords are:

  | Stack | Keywords |
  |-------|----------|
  | react-typescript | react, typescript, nextjs, next.js, frontend |
  | python-data | python, data, pandas, numpy, ml, machine-learning |
  | node-express | node, express, api, rest, backend |
  | devops-cloud | docker, kubernetes, terraform, aws, azure, ci, cd, devops |
  | mobile-dev | mobile, react-native, flutter, ios, android, swift |
  | database | database, sql, postgres, mongo, redis, schema |
  | security | security, auth, encryption, vulnerability, owasp, access |
  | testing-qa | test, qa, quality, jest, pytest, cypress, selenium |

  Each stack directory contains up to 10 skills matched by name or description keywords, ranked by score.
- **Use case:** A React/TypeScript team copies only `workspace-by-stack/react-typescript/` to their repo. A DevOps team uses `workspace-by-stack/devops-cloud/`.

### 10. agent-skills-50

- **Path:** `CopilotSkills/bundles/agent-skills-50/{slug}/SKILL.md`
- **Count:** 50
- **Format:** SKILL.md in per-skill directories
- **Audience:** Users of Copilot's Agent Skills feature
- **Selection:** Top 50 skills by `score_skill()` across all categories
- **Description:** The 50 highest-scoring skills in Agent Skills format, where each skill gets its own directory with a `SKILL.md` file. This matches the directory structure expected by Copilot's agent skill loading mechanism.
- **Use case:** Deploying agent skills to a GitHub repository or Copilot workspace that uses the agent skills feature.

### 11. workspace-essential-30

- **Path:** `CopilotSkills/bundles/workspace-essential-30/{slug}.md`
- **Count:** 30
- **Format:** Markdown
- **Audience:** VS Code users who want a lean, high-quality instruction set
- **Selection:** Top 30 by `score_skill()` across all categories
- **Description:** A compact, general-purpose bundle. The 30 highest-quality skills converted to Copilot custom instructions. Suitable as a starting point for any workspace without overwhelming the user with hundreds of files.
- **Use case:** Quick Copilot setup. Personal workspaces. Evaluating the library before deploying a larger bundle.

### 12. coding-agent-20

- **Path:** `CopilotSkills/bundles/coding-agent-20/{slug}/SKILL.md`
- **Count:** 20
- **Format:** SKILL.md (Frontier agent format)
- **Audience:** Users of Copilot's autonomous coding agent mode
- **Selection:** Top 20 skills passing the `is_frontier_skill()` filter, ranked by score
- **Description:** Skills specifically selected for autonomous coding agents. The `is_frontier_skill()` filter selects skills related to code generation, debugging, refactoring, testing, and other tasks where an agent can operate with minimal human guidance. Uses the Frontier skill format with agent-specific instructions.
- **Use case:** Configuring Copilot's autonomous agent mode with curated coding skills.

### 13. chat-participants-20

- **Path:** `CopilotSkills/bundles/chat-participants-20/{slug}.json`
- **Count:** 20
- **Format:** JSON (chat participant configuration)
- **Audience:** Developers building custom chat participants for Copilot
- **Selection:** Top 20 by `score_skill()` across all categories
- **Description:** Each file is a JSON object with `name`, `fullName`, `description`, `instructions`, and `category` fields. These can be loaded as custom chat participant definitions in Copilot Chat, enabling users to invoke specialized expertise with `@participant-name` syntax.
- **Use case:** Building custom `@participant` commands in VS Code Copilot Chat. Prototyping domain-specific chat assistants.

---

## Codex Bundles (5)

### 14. responses-api-full

- **Path:** `CodexSkills/bundles/responses-api-full/{category}/{slug}.response.json`
- **Count:** 508 (distributed across 6 category directories)
- **Format:** Responses API JSON
- **Audience:** Developers integrating with OpenAI's Responses API
- **Selection:** All 508 skills
- **Description:** The complete library formatted as Responses API JSON objects. Each file contains the structured response configuration needed to use a skill through the OpenAI API. Organized by category subdirectories.
- **Use case:** Building applications on the Responses API that need the full skill catalog. Batch-loading skills into a Responses API-based system.

### 15. by-category (Codex)

- **Path:** `CodexSkills/bundles/by-category/{category}/{slug}.response.json`
- **Count:** 508 (distributed across 6 category directories)
- **Format:** Responses API JSON
- **Audience:** Codex users who want per-category deployment
- **Selection:** All 508 skills organized by category
- **Description:** Functionally identical to `responses-api-full` in content, but structured as a separate bundle for consistency with other platforms' `by-category` bundles. Deploy individual category directories as needed.
- **Use case:** Selective category deployment. Deploying `ai-agents/` and `technical/` to a developer-focused Codex instance while leaving out `creative/` and `industry/`.

### 16. enterprise-assistants

- **Path:** `CodexSkills/bundles/enterprise-assistants/{slug}.response.json`
- **Count:** 53
- **Format:** Responses API JSON
- **Audience:** Enterprise teams using OpenAI for internal tooling
- **Selection:** Same selection criteria as Gemini `vertex-enterprise`: operations + industry + enterprise-related strategy skills
- **Description:** Enterprise-focused skills in Responses API format. Covers the same governance, compliance, risk, and operations domains as the Gemini `vertex-enterprise` bundle, but formatted for OpenAI's API.
- **Use case:** Building enterprise assistants on the OpenAI platform. Internal compliance tools, risk assessment chatbots, or operations dashboards with AI capabilities.

### 17. gpt-builder-50

- **Path:** `CodexSkills/bundles/gpt-builder-50/{slug}.gpt.json`
- **Count:** 50
- **Format:** GPT Builder JSON
- **Audience:** GPT Builder users creating custom GPTs
- **Selection:** Top 50 by `score_skill()` across all categories
- **Description:** Each file is a GPT Builder configuration with `name`, `description`, `instructions`, `conversation_starters`, and `capabilities` fields. Capabilities are set by category: web browsing for strategy/industry/ai-agents, image generation for creative, code interpreter and file upload for all. Each GPT includes 4 auto-generated conversation starters.
- **Use case:** Rapidly creating custom GPTs in OpenAI's GPT Builder. Import a JSON file to scaffold a GPT with pre-written instructions and capabilities.

### 18. agent-builder-20

- **Path:** `CodexSkills/bundles/agent-builder-20/{slug}.agent.json`
- **Count:** 20
- **Format:** Agent Builder JSON
- **Audience:** Developers using OpenAI's Agent Builder
- **Selection:** Top 20 from the `ai-agents` category by score
- **Description:** Agent Builder configuration files with `name`, `description`, `instructions`, `model`, `tools`, `handoff_description`, and `metadata`. The model and tools are set per-category using `CODEX_MODELS` and `CODEX_TOOLS` mappings from `lib/config.py`. Each agent includes a handoff description (first 200 characters of the skill description) for multi-agent orchestration.
- **Use case:** Building multi-agent systems with OpenAI's Agent Builder. Each file can be loaded as an agent definition with tool access and handoff support.

---

## Cross-Platform Equivalents

Some bundles serve the same purpose across platforms:

| Purpose | Gemini | Copilot | Codex |
|---------|--------|---------|-------|
| Full collection | gems-full | by-category | responses-api-full |
| By category | by-category | by-category | by-category |
| Enterprise/compliance | vertex-enterprise | -- | enterprise-assistants |
| Top 30 general | studio-essential-30 | workspace-essential-30 | -- |
| Agent-focused | agent-chains-20 | coding-agent-20 | agent-builder-20 |
| Top 50 | -- | agent-skills-50 | gpt-builder-50 |
| Creative | studio-creative-15 | -- | -- |
| By tech stack | -- | workspace-by-stack | -- |
| Cloud IDE | idx-workspace | -- | -- |
| Chat extensions | -- | chat-participants-20 | -- |

---

## Choosing a Bundle

Use this decision tree to pick the right bundle:

1. **Which platform are you deploying to?** -- Gemini, Copilot, or Codex.
2. **Do you want everything or a subset?**
   - Everything: Use the full or by-category bundle for your platform.
   - Subset: Continue to step 3.
3. **What is your primary role or context?**
   - Enterprise/governance: vertex-enterprise, enterprise-assistants, workspace-by-stack
   - Everyday development: studio-essential-30, workspace-essential-30
   - Agent workflows: agent-chains-20, coding-agent-20, agent-builder-20
   - Creative work: studio-creative-15
   - Custom GPTs: gpt-builder-50
   - Cloud IDE: idx-workspace
   - Chat extensions: chat-participants-20
4. **None of these fit?** -- [Create a custom bundle](./creating-bundles.md).

---

## Related Pages

- [Bundle System Overview](./README.md)
- [Gemini Bundles](./gemini-bundles.md)
- [Copilot Bundles](./copilot-bundles.md)
- [Codex Bundles](./codex-bundles.md)
- [Creating Bundles](./creating-bundles.md)
