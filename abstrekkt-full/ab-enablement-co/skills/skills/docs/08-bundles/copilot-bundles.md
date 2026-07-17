# Copilot Bundles

This guide covers the 6 bundles available for the GitHub Copilot platform. Each bundle is located under `CopilotSkills/bundles/` and contains skill files formatted for Copilot's custom instructions, agent skills, or chat participant systems.

---

## Overview

| Bundle | Skills | Format | Target |
|--------|-------:|--------|--------|
| [by-category](#by-category) | 508 | Custom instructions by category | Full library, organized |
| [workspace-by-stack](#workspace-by-stack) | 79 | Custom instructions by tech stack | Multi-stack teams |
| [agent-skills-50](#agent-skills-50) | 50 | Agent skill SKILL.md | Agent mode power users |
| [workspace-essential-30](#workspace-essential-30) | 30 | Custom instructions | VS Code starter set |
| [coding-agent-20](#coding-agent-20) | 20 | Agent skill SKILL.md (Frontier) | Automated coding agents |
| [chat-participants-20](#chat-participants-20) | 20 | Chat participant JSON | Chat extensions |

---

## Copilot File Formats

Copilot bundles use three different output formats depending on the bundle type:

**Custom instructions (.md)** -- Markdown files that Copilot loads as workspace-level instructions. These influence Copilot's suggestions and completions in VS Code. Used by: by-category, workspace-by-stack, workspace-essential-30.

**Agent skill (SKILL.md)** -- Markdown files in per-skill directories (`{slug}/SKILL.md`). These are loaded by Copilot's agent mode for autonomous multi-step tasks. Used by: agent-skills-50, coding-agent-20.

**Chat participant (.json)** -- JSON configuration files that define custom chat participants accessible via `@participant-name` in Copilot Chat. Each file includes name, description, instructions, and category. Used by: chat-participants-20.

---

## by-category

**Path:** `CopilotSkills/bundles/by-category/`
**Skills:** 508
**Format:** Markdown custom instructions organized into 6 category subdirectories

### Contents

The complete Skills Library converted to Copilot custom instruction format and organized by category. Each skill is a `.md` file containing instructions that Copilot uses to guide its responses.

### Directory Structure

```
CopilotSkills/bundles/by-category/
  ai-agents/
    autonomous-agent-design.md
    multi-agent-orchestration.md
    ...
    (232 files)
  technical/
    api-design-principles.md
    ...
    (127 files)
  strategy/
    ...
    (59 files)
  creative/
    ...
    (40 files)
  operations/
    ...
    (25 files)
  industry/
    ...
    (25 files)
```

### Deployment

```bash
# Deploy full categorized library to your workspace
cp -r CopilotSkills/bundles/by-category/ .github/copilot-instructions/

# Deploy a single category
cp -r CopilotSkills/bundles/by-category/technical/ .github/copilot-instructions/technical/

# Or deploy the full CLI skill set
cp -r CopilotSkills-CLI/.github .github
```

### When to Choose

Use by-category when you want the entire library available in VS Code and prefer browsing by domain. Recommended for teams that want maximum coverage and will select skills as needed.

---

## workspace-by-stack

**Path:** `CopilotSkills/bundles/workspace-by-stack/`
**Skills:** 79
**Format:** Custom instructions organized by technology stack

### Contents

Skills reorganized by technology stack rather than the library's default categories. Each stack contains up to 10 skills matched by keyword against skill names and descriptions, then ranked by `score_skill()`.

### Stack Directories

| Stack | Skills | Keywords Used |
|-------|-------:|---------------|
| react-typescript | up to 10 | react, typescript, nextjs, next.js, frontend |
| python-data | up to 10 | python, data, pandas, numpy, ml, machine-learning |
| node-express | up to 10 | node, express, api, rest, backend |
| devops-cloud | up to 10 | docker, kubernetes, terraform, aws, azure, ci, cd, devops |
| mobile-dev | up to 10 | mobile, react-native, flutter, ios, android, swift |
| database | up to 10 | database, sql, postgres, mongo, redis, schema |
| security | up to 10 | security, auth, encryption, vulnerability, owasp, access |
| testing-qa | up to 10 | test, qa, quality, jest, pytest, cypress, selenium |

### Directory Structure

```
CopilotSkills/bundles/workspace-by-stack/
  react-typescript/
    react-component-patterns.md
    typescript-best-practices.md
    ...
  python-data/
    data-pipeline-design.md
    ml-model-evaluation.md
    ...
  node-express/
    api-design-principles.md
    ...
  devops-cloud/
    ci-cd-pipeline-design.md
    containerization.md
    ...
  mobile-dev/
    ...
  database/
    ...
  security/
    ...
  testing-qa/
    ...
```

### Deployment

```bash
# Deploy all stacks
cp -r CopilotSkills/bundles/workspace-by-stack/ .github/copilot-instructions/

# Deploy only your team's stack
cp -r CopilotSkills/bundles/workspace-by-stack/react-typescript/ .github/copilot-instructions/

# Deploy multiple stacks for a full-stack team
cp -r CopilotSkills/bundles/workspace-by-stack/react-typescript/ .github/copilot-instructions/frontend/
cp -r CopilotSkills/bundles/workspace-by-stack/node-express/ .github/copilot-instructions/backend/
cp -r CopilotSkills/bundles/workspace-by-stack/database/ .github/copilot-instructions/data/
```

### Configuration Tips

The workspace-by-stack bundle is particularly useful for monorepos. You can deploy different stack directories to different workspace folders so that Copilot loads context-appropriate skills based on which directory you are working in.

A skill may appear in multiple stacks if it matches keywords for more than one stack. This is intentional -- `api-design-principles` is relevant to both `node-express` and `react-typescript` contexts.

### When to Choose

Use workspace-by-stack when your team works across multiple technology layers and you want skills organized by technology rather than abstract category. Especially useful for monorepo setups or teams with distinct frontend/backend/data roles.

---

## agent-skills-50

**Path:** `CopilotSkills/bundles/agent-skills-50/`
**Skills:** 50
**Format:** Agent skill SKILL.md files in per-skill directories

### Contents

The 50 highest-scoring skills across all categories, formatted for Copilot's agent mode. Each skill gets its own directory with a `SKILL.md` file, matching the structure Copilot expects for agent skill loading.

### Directory Structure

```
CopilotSkills/bundles/agent-skills-50/
  api-design-principles/
    SKILL.md
  automated-testing-strategy/
    SKILL.md
  code-review-checklist/
    SKILL.md
  ...
  (50 directories)
```

### Deployment

```bash
# Deploy agent skills to your repository
cp -r CopilotSkills/bundles/agent-skills-50/ .github/copilot-agent-skills/
```

### When to Choose

Use agent-skills-50 when you primarily use Copilot in agent mode and want a broad set of capabilities. This is the recommended agent bundle for most users -- large enough to cover common tasks but small enough to avoid noise. For a leaner agent deployment, use coding-agent-20 instead.

---

## workspace-essential-30

**Path:** `CopilotSkills/bundles/workspace-essential-30/`
**Skills:** 30
**Format:** Markdown custom instructions

### Contents

The 30 highest-scoring skills across all categories, selected by `score_skill()`. Provides a balanced starter set covering the most commonly needed development capabilities.

Representative skills include:

- code-review-checklist
- api-design-principles
- automated-testing-strategy
- debugging-strategies
- refactoring-patterns
- performance-optimization
- documentation-generation
- git-workflow-management
- error-handling-patterns
- security-best-practices

### Deployment

```bash
# Deploy essential 30 to your workspace
cp -r CopilotSkills/bundles/workspace-essential-30/ .github/copilot-instructions/
```

### Configuration Tips

The essential-30 bundle works well as a baseline that you extend over time. After deploying, you can add individual skills from the full library:

```bash
# Add a specific skill on top of the essential 30
cp CopilotSkills/bundles/by-category/technical/kubernetes-orchestration.md .github/copilot-instructions/
```

### When to Choose

Use workspace-essential-30 as your starting point if you are new to the library, want a lean setup, or are configuring Copilot for a small team. This is the Copilot counterpart to the Gemini `studio-essential-30` bundle.

---

## coding-agent-20

**Path:** `CopilotSkills/bundles/coding-agent-20/`
**Skills:** 20
**Format:** Agent skill SKILL.md files (Frontier format)

### Contents

Twenty skills specifically selected for autonomous coding agents. Skills are filtered by `is_frontier_skill()`, which identifies skills suitable for code generation, debugging, refactoring, testing, and other tasks an agent can perform with minimal human guidance. The filtered set is then ranked by `score_skill()`.

Representative skills include:

- code-generation
- automated-testing-strategy
- code-review-checklist
- refactoring-patterns
- bug-fix-workflow
- test-driven-development
- type-safety-enforcement
- dependency-management
- commit-message-standards
- pull-request-automation

### Directory Structure

```
CopilotSkills/bundles/coding-agent-20/
  code-generation/
    SKILL.md
  automated-testing-strategy/
    SKILL.md
  ...
  (20 directories)
```

### Deployment

```bash
# Deploy lean agent set
cp -r CopilotSkills/bundles/coding-agent-20/ .github/copilot-agent-skills/
```

### Configuration Tips

The Frontier format used by coding-agent-20 includes agent-specific instruction sections not present in regular custom instructions. These sections guide the agent's autonomous behavior: when to ask for confirmation, how to handle ambiguous requirements, and what safety checks to run before making changes.

### When to Choose

Use coding-agent-20 when you want a minimal agent deployment focused purely on code-level tasks. This bundle excludes architecture, strategy, and creative skills in favor of tight code-centric automation. For broader agent coverage, use agent-skills-50 instead.

---

## chat-participants-20

**Path:** `CopilotSkills/bundles/chat-participants-20/`
**Skills:** 20
**Format:** Chat participant JSON configuration files

### Contents

The top 20 skills by `score_skill()`, formatted as Copilot Chat participant configurations. Each file is a JSON object with the following fields:

```json
{
  "name": "code-review-checklist",
  "fullName": "Code Review Checklist",
  "description": "Comprehensive code review guidelines...",
  "instructions": "...(full skill body)...",
  "category": "technical"
}
```

These can be used to create specialized chat participants that users invoke with `@participant-name` in the Copilot Chat panel. For example:

- `@code-reviewer` -- Reviews code with the code-review-checklist skill
- `@api-designer` -- Guides API design with api-design-principles
- `@test-writer` -- Generates tests using automated-testing-strategy

### Deployment

```bash
# Deploy chat participants
cp -r CopilotSkills/bundles/chat-participants-20/ .github/copilot-chat-participants/
```

### When to Choose

Use chat-participants-20 when you want to expose skills as named chat participants in Copilot Chat. This provides a natural interface where users invoke specific expertise by name rather than relying on Copilot to select the right skill automatically.

---

## Regenerating Copilot Bundles

All Copilot bundles are generated by `populate_all.py` during the pipeline's bundle phase:

```bash
PYTHONIOENCODING=utf-8 python populate_all.py --phase bundles
```

To preview without writing:

```bash
PYTHONIOENCODING=utf-8 python populate_all.py --phase bundles --dry-run
```

The script discovers all master skills, converts them to the appropriate Copilot format using `build_copilot_instruction()`, `build_copilot_agent_skill()`, or `build_frontier_skill()`, and places them in each bundle directory.

---

## Related Pages

- [Bundle Catalog](./bundle-catalog.md) -- All 18 bundles at a glance
- [Gemini Bundles](./gemini-bundles.md)
- [Codex Bundles](./codex-bundles.md)
- [Creating Bundles](./creating-bundles.md)
- [Deploying to Copilot](../01-getting-started/deploying-to-copilot.md)
