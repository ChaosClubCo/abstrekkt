# Deploying to Copilot

This guide covers deploying skills to all three GitHub Copilot output variants: the main CopilotSkills directory (agent skills and custom instructions), CLI, and Frontier (M365 declarative agents). Each variant targets a different part of the Copilot ecosystem.

---

## Overview of Copilot Variants

| Variant | Directory | Format | Use Case |
|---------|-----------|--------|----------|
| CopilotSkills (main) | `CopilotSkills/` | Agent skills + custom instructions | VS Code, GitHub.com |
| Copilot CLI | `CopilotSkills-CLI/` | `.github/copilot-instructions.md` | Per-repo instructions |
| Copilot Frontier | `CopilotSkills-Frontier/` | `skills/{slug}/SKILL.md` | M365 Copilot agents |

The main `CopilotSkills/` directory contains two complementary formats:
- `agent-skills/` -- 512 skills organized by category, formatted as agent skill definitions
- `custom-instructions/` -- 519 skills formatted as Copilot custom instruction files
- `chat-participants/` -- additional chat participant configurations
- `bundles/` -- 6 curated bundles

---

## Prerequisites

- The Skills Library repository cloned locally
- GitHub account with Copilot access
- VS Code with GitHub Copilot and Copilot Chat extensions installed
- Git (for per-repo deployment)

---

## Copilot Custom Instructions (VS Code)

Custom instructions tell Copilot how to behave in a specific repository. This is the most common deployment method.

### Per-Repository Setup

From the root of any Git repository where you want Copilot to use skills:

```bash
# Deploy all custom instructions
cp -r CopilotSkills-CLI/.github .github
```

This creates a `.github/` directory in your repo with `copilot-instructions.md` and related files. Copilot reads these automatically.

### How Copilot Reads Instructions

Copilot looks for instructions in this order:

1. `.github/copilot-instructions.md` at the repository root
2. VS Code workspace settings (`settings.json`)
3. Global VS Code user settings

Repository-level instructions take highest priority.

### Deploying a Single Skill as Instructions

If you want only one skill's instructions applied to your repo:

```bash
mkdir -p .github
cp CopilotSkills/custom-instructions/technical/code-review-checklist.md \
   .github/copilot-instructions.md
```

### Combining Multiple Skills

To use several skills in one repository, concatenate them:

```bash
mkdir -p .github
cat CopilotSkills/custom-instructions/technical/code-review-checklist.md \
    CopilotSkills/custom-instructions/technical/api-design-reviewer.md \
    > .github/copilot-instructions.md
```

Keep the combined file under 8,000 characters for best results. Copilot may truncate very long instruction files.

### VS Code Settings Alternative

You can also provide instructions via VS Code settings:

```json
// .vscode/settings.json
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "file": ".github/copilot-instructions.md"
    }
  ]
}
```

---

## Copilot Agent Skills

Agent skills provide more structured definitions that Copilot can invoke as discrete capabilities.

### Directory Structure

```
CopilotSkills/
  agent-skills/
    ai-agents/
      multi-agent-orchestrator/SKILL.md
      tool-use-planner/SKILL.md
      ...
    technical/
      code-review-checklist/SKILL.md
      api-design-reviewer/SKILL.md
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

### Using Agent Skills

Agent skills can be referenced in Copilot Chat. After placing them in your repository:

```bash
mkdir -p .github/copilot-skills
cp -r CopilotSkills/agent-skills/technical/* .github/copilot-skills/
```

Then in Copilot Chat:

```
@workspace Use the code-review-checklist skill to review the changes in this PR.
```

### Deploying by Category

To deploy all skills in a specific category:

```bash
mkdir -p .github/copilot-skills
cp -r CopilotSkills/agent-skills/technical/* .github/copilot-skills/
```

Or multiple categories:

```bash
mkdir -p .github/copilot-skills
cp -r CopilotSkills/agent-skills/technical/* .github/copilot-skills/
cp -r CopilotSkills/agent-skills/ai-agents/* .github/copilot-skills/
```

---

## Copilot CLI

The CLI variant provides skills formatted specifically for the GitHub Copilot CLI tool.

### Installation

```bash
cp -r CopilotSkills-CLI/.github .github
```

Run this from your project root. The Copilot CLI reads the `.github/` directory automatically.

### Global Installation

To make skills available across all repositories, place them in your home directory:

```bash
mkdir -p ~/.github
cp CopilotSkills-CLI/.github/copilot-instructions.md ~/.github/
```

### Using with Copilot CLI

```bash
# Ask Copilot CLI a question with skill context
gh copilot explain "How should I structure error handling in this codebase?"

# Ask Copilot CLI to suggest code
gh copilot suggest "Write a test for the authentication module"
```

The CLI picks up instructions from `.github/copilot-instructions.md` in the current repository.

---

## Copilot Frontier (M365 Declarative Agents)

Copilot Frontier skills are formatted for Microsoft 365 Copilot declarative agents, targeting enterprise environments.

### Directory Structure

```
CopilotSkills-Frontier/
  skills/
    code-review-checklist/SKILL.md
    api-design-reviewer/SKILL.md
    multi-agent-orchestrator/SKILL.md
    ...
```

### Deployment

Frontier skills are deployed through the Microsoft 365 admin center or via Teams app packaging. The deployment process depends on your organization's M365 configuration:

1. Read the skill's SKILL.md to extract the agent instructions.
2. Create a new declarative agent in the M365 admin center.
3. Paste the instructions into the agent's system prompt.
4. Configure permissions and availability as required by your organization.

### Building a Teams App Package

For automated deployment, you can package skills as Teams apps:

```bash
# Example: Create a manifest for a single skill
cat CopilotSkills-Frontier/skills/code-review-checklist/SKILL.md
```

Use the content to populate a Teams app manifest's `declarativeAgent` configuration. Consult the Microsoft documentation for the current manifest schema.

---

## Chat Participants

The `CopilotSkills/chat-participants/` directory contains additional configurations for Copilot Chat participants -- specialized personas that appear in the Copilot Chat sidebar.

These are an advanced feature. Consult the GitHub Copilot documentation for the current chat participants API.

---

## Using Bundles

Instead of deploying all skills, choose a curated bundle from `CopilotSkills/bundles/`:

| Bundle | Skills | Best For |
|--------|--------|----------|
| by-category | 508 | Full deployment, organized by category |
| workspace-by-stack | 79 | Tech stack specific (React, Python, etc.) |
| agent-skills-50 | 50 | Top 50 most useful agent skills |
| workspace-essential-30 | 30 | Essential workspace skills |
| coding-agent-20 | 20 | Focused coding assistant skills |
| chat-participants-20 | 20 | Top chat participant configs |

Example -- deploy the essential 30:

```bash
cp -r CopilotSkills/bundles/workspace-essential-30/ .github/copilot-skills/
```

---

## Best Practices

### Keep Instructions Focused

Copilot works best with clear, concise instructions. When combining multiple skills:

- Limit to 3-5 skills per repository.
- Remove sections that are not relevant to the repository's tech stack.
- Put the most important instructions first.

### Use Repository-Specific Skills

Match skills to the repository's purpose:

- **Backend API repo** -- `api-design-reviewer`, `database-schema-optimizer`, `security-audit`
- **Frontend app repo** -- `ui-component-reviewer`, `accessibility-checker`, `performance-optimizer`
- **Infrastructure repo** -- `ci-cd-pipeline-designer`, `infrastructure-as-code-reviewer`

### Version Control Your Instructions

Since skills are deployed as files in your repository, they are version-controlled automatically. Use pull requests to review changes to your Copilot instructions.

### Team Sharing

Share skill configurations across your team by committing the `.github/` directory to your repository. Everyone on the team gets the same Copilot behavior.

---

## Troubleshooting

**Copilot not following instructions?**
- Ensure `.github/copilot-instructions.md` exists at the repository root.
- Restart VS Code after adding or modifying instruction files.
- Check that the file is not too large (keep under 8,000 characters).

**Agent skills not recognized?**
- Verify the file format matches what Copilot expects.
- Check that the Copilot Chat extension is up to date.
- Try referencing the skill explicitly: `@workspace /skill-name`.

**Instructions conflicting with each other?**
- Reduce the number of combined skills.
- Ensure instructions do not contain contradictory directives.
- Place the highest-priority instructions first in the file.

---

## What to Read Next

- [Deploying to Claude](./deploying-to-claude.md) -- if you also use Claude
- [Deploying to Gemini](./deploying-to-gemini.md) -- if you also use Gemini
- [Deploying to Codex](./deploying-to-codex.md) -- if you also use Codex
- [Choosing a Skill](./choosing-a-skill.md) -- browse the full catalog
- [FAQ](./faq.md) -- troubleshooting and common questions
