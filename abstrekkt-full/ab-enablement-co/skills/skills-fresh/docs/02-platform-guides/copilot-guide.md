# GitHub Copilot Platform Guide

This guide covers all three GitHub Copilot skill variants: agent-skills and custom-instructions for VS Code, CLI skills for repository-level configuration, and Frontier skills for M365 Copilot declarative agents. Copilot skills use Markdown-based formats that integrate directly with VS Code, GitHub repositories, and the broader Microsoft 365 ecosystem.

## Variants at a Glance

| Variant | Files | Path Pattern | Use Case |
|---------|-------|--------------|----------|
| CopilotSkills | 512 + 519 | `agent-skills/{category}/{slug}/SKILL.md` + `custom-instructions/{category}/{slug}.md` | VS Code agent-skills and workspace instructions |
| CopilotSkills-CLI | 507 | `skills/{slug}/SKILL.md` | Repository `.github/` integration |
| CopilotSkills-Frontier | 508 | `skills/{slug}/SKILL.md` | M365 Copilot declarative agents |

---

## 1. CopilotSkills (Agent-Skills + Custom-Instructions)

The primary Copilot format, providing two complementary sub-formats for VS Code integration.

### Directory Structure

```
GithubCopilot/CopilotSkills/
  agent-skills/
    ai-agents/               # 232 skills
      access-management/
        SKILL.md
      accountability-buddy/
        SKILL.md
      ...
    technical/               # 127 skills
    strategy/                # 59 skills
    creative/                # 40 skills
    operations/              # 24 skills
    industry/                # 25 skills
  custom-instructions/
    ai-agents/               # 232 instructions
      access-management.md
      accountability-buddy.md
      ...
    technical/               # 127 instructions
    strategy/                # 59 instructions
    creative/                # 40 instructions
    operations/              # 24 instructions
    industry/                # 25 instructions
  chat-participants/         # Additional chat participant format
  bundles/                   # 6 curated bundles
    by-category/             # 508
    workspace-by-stack/      # 79
    agent-skills-50/         # 50
    workspace-essential-30/  # 30
    coding-agent-20/         # 20
    chat-participants-20/    # 20
```

### Agent-Skills Format (512 files)

Each `SKILL.md` in `agent-skills/` follows the standard YAML frontmatter + Markdown body:

```yaml
---
name: "access-management"
description: "Comprehensive identity and access management implementation..."
version: "1.0.0"
category: ai-agents
complexity: complex
tags: ["access", "security", "compliance"]
---

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

The 512 count (vs. 508 master skills) includes a small number of index and metadata files alongside the standard skills.

### Custom-Instructions Format (519 files)

Each `.md` file in `custom-instructions/` is a streamlined Markdown document designed to be pasted into VS Code's Copilot custom instructions:

```markdown
# Access Management

Comprehensive identity and access management implementation and governance.

## Instructions

When helping with access management tasks:

1. Assess the current identity infrastructure and authentication mechanisms.
2. Identify gaps in role-based access control (RBAC) or attribute-based access control (ABAC).
3. Recommend least-privilege policies and separation of duties.
4. Generate implementation code for IAM providers (AWS IAM, Azure AD, Okta).
5. Create audit trails and compliance documentation.

## Key Patterns

- Zero Trust architecture principles
- Just-in-time (JIT) access provisioning
- Multi-factor authentication (MFA) enforcement
- Service account lifecycle management

## Common Pitfalls

- Over-permissioned service accounts
- Stale access reviews
- Missing break-glass procedures
```

The 519 count includes extra files for category indexes and cross-references.

### Deploying Agent-Skills to VS Code

**Method 1: Workspace settings (per-project)**

Create or edit `.vscode/settings.json` in your project:

```json
{
  "github.copilot.chat.agent.skills": {
    "access-management": {
      "description": "Comprehensive identity and access management...",
      "instructions": ".copilot/skills/access-management/SKILL.md"
    }
  }
}
```

Then copy the skill files:

```bash
# Copy skills into your project
mkdir -p .copilot/skills
cp -r GithubCopilot/CopilotSkills/agent-skills/ai-agents/access-management .copilot/skills/
```

**Method 2: User settings (global)**

Add to your VS Code user `settings.json`:

```json
{
  "github.copilot.chat.agent.skills": {
    "access-management": {
      "description": "Comprehensive identity and access management...",
      "instructions": "${userHome}/.copilot/skills/access-management/SKILL.md"
    }
  }
}
```

### Deploying Custom-Instructions to VS Code

Custom instructions are set at the workspace level. Create `.github/copilot-instructions.md` in your repo root:

```bash
# Copy a custom instruction as the repo-level Copilot instruction
cp GithubCopilot/CopilotSkills/custom-instructions/ai-agents/access-management.md \
   .github/copilot-instructions.md
```

To combine multiple instructions:

```bash
# Concatenate multiple skill instructions
cat GithubCopilot/CopilotSkills/custom-instructions/technical/api-design.md \
    GithubCopilot/CopilotSkills/custom-instructions/technical/code-review.md \
    GithubCopilot/CopilotSkills/custom-instructions/technical/testing-strategy.md \
    > .github/copilot-instructions.md
```

### Chat Participants

The `chat-participants/` directory contains skills formatted for Copilot Chat's `@workspace` participant model. These are invoked via chat commands:

```
@workspace /access-management Design an IAM architecture for our microservices
```

### Bundles

| Bundle | Count | Use Case |
|--------|-------|----------|
| `by-category` | 508 | Full library organized by category |
| `workspace-by-stack` | 79 | Tech-stack-specific workspace configs |
| `agent-skills-50` | 50 | Top 50 most-used agent skills |
| `workspace-essential-30` | 30 | Essential workspace instructions |
| `coding-agent-20` | 20 | Core coding assistance skills |
| `chat-participants-20` | 20 | Chat participant format skills |

---

## 2. CopilotSkills-CLI

Skills formatted for repository-level deployment via `.github/` directory integration.

### Directory Structure

```
GithubCopilot/CopilotSkills-CLI/
  skills/
    access-management/
      SKILL.md
    accountability-buddy/
      SKILL.md
    ...                      # 507 skills (flat)
  .github/
    copilot-instructions.md  # Aggregated instructions
```

### File Format

Same YAML frontmatter + Markdown format as agent-skills, but flat (no category subdirectories):

```yaml
---
name: "access-management"
description: "Comprehensive identity and access management..."
---

## Overview
...
```

### Deployment

The primary deployment method is copying the `.github` directory to your repository root:

```bash
# Deploy Copilot CLI instructions to your repo
cp -r GithubCopilot/CopilotSkills-CLI/.github .github
```

This makes the instructions available to GitHub Copilot for all contributors working in the repository.

**Selective deployment:**

```bash
# Create .github directory
mkdir -p .github

# Copy specific skills
mkdir -p .copilot/skills
cp -r GithubCopilot/CopilotSkills-CLI/skills/access-management .copilot/skills/
cp -r GithubCopilot/CopilotSkills-CLI/skills/code-review .copilot/skills/

# Create a combined instructions file
cat .copilot/skills/*/SKILL.md > .github/copilot-instructions.md
```

### Usage in GitHub Repositories

Once `.github/copilot-instructions.md` exists in your repo:

1. GitHub Copilot Chat in VS Code automatically loads the instructions.
2. GitHub.com Copilot Chat (in pull requests, issues) also reads these instructions.
3. All team members with Copilot access benefit from the shared skill context.

### Tips

- The `.github/copilot-instructions.md` file has a practical size limit. If combining many skills, prioritize the most relevant ones.
- Repository-level instructions apply to all Copilot interactions in that repo, so choose skills that match the project's domain.
- The 507 count reflects minor filter differences in the CLI converter pipeline.

---

## 3. CopilotSkills-Frontier

Skills formatted for Microsoft 365 Copilot declarative agents.

### Directory Structure

```
GithubCopilot/CopilotSkills-Frontier/
  skills/
    access-management/
      SKILL.md
    accountability-buddy/
      SKILL.md
    ...                      # 508 skills (flat)
```

### File Format

Frontier skills use the standard SKILL.md format with additional metadata relevant to M365 Copilot:

```yaml
---
name: "access-management"
description: "Comprehensive identity and access management..."
version: "1.0.0"
category: ai-agents
complexity: complex
---

## Overview
...

## Core Processes
...
```

### Declarative Agent Configuration

M365 Copilot declarative agents are defined via a JSON manifest. To create one from a Frontier skill:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.0/schema.json",
  "version": "v1.0",
  "name": "Access Management Agent",
  "description": "Comprehensive identity and access management specialist",
  "instructions": "$[file('skills/access-management/SKILL.md')]",
  "capabilities": [
    {
      "name": "WebSearch"
    },
    {
      "name": "GraphicArt"
    }
  ],
  "actions": []
}
```

### Deployment

**For Teams / M365 Apps:**

1. Create a Teams app manifest that references the declarative agent JSON.
2. Include the SKILL.md files in the app package.
3. Deploy via Teams Admin Center or sideload for development.

**For local development:**

```bash
# Copy Frontier skills to your project
mkdir -p skills
cp -r GithubCopilot/CopilotSkills-Frontier/skills/access-management skills/

# Create declarative agent manifest
# (See JSON example above)
```

### When to Use Frontier

- You are building M365 Copilot extensions or declarative agents.
- You want skills available in Microsoft Teams, Outlook, or other M365 apps.
- Your organization uses Microsoft 365 Copilot as the primary AI interface.

---

## VS Code Configuration Reference

### Workspace Settings

A comprehensive `.vscode/settings.json` for a project using Copilot skills:

```json
{
  "github.copilot.enable": {
    "*": true,
    "markdown": true,
    "plaintext": true
  },
  "github.copilot.chat.agent.skills": {
    "code-review": {
      "description": "Expert code review and quality analysis",
      "instructions": ".copilot/skills/code-review/SKILL.md"
    },
    "api-design": {
      "description": "REST and GraphQL API design guidance",
      "instructions": ".copilot/skills/api-design/SKILL.md"
    },
    "testing-strategy": {
      "description": "Comprehensive testing approaches and patterns",
      "instructions": ".copilot/skills/testing-strategy/SKILL.md"
    }
  }
}
```

### Multi-Root Workspace

For multi-root workspaces, each root can have its own `.github/copilot-instructions.md`:

```
my-workspace.code-workspace
  frontend/
    .github/
      copilot-instructions.md   # Frontend-specific skills
  backend/
    .github/
      copilot-instructions.md   # Backend-specific skills
  shared/
    .github/
      copilot-instructions.md   # Shared skills
```

---

## Stack-Specific Workspace Bundles

The `workspace-by-stack` bundle (79 skills) provides pre-configured skill sets for common technology stacks:

| Stack | Skills Included | Focus |
|-------|-----------------|-------|
| React / Next.js | ~12 | Component design, state management, SSR |
| Node.js / Express | ~10 | API design, middleware, error handling |
| Python / Django | ~10 | ORM patterns, views, testing |
| Go | ~8 | Concurrency, interfaces, error patterns |
| Rust | ~8 | Ownership, lifetimes, async patterns |
| DevOps / CI-CD | ~15 | Pipelines, containers, infrastructure |
| Security | ~16 | IAM, vulnerability analysis, compliance |

---

## Choosing a Variant

| If you... | Use this variant |
|-----------|-----------------|
| Use VS Code with Copilot daily | CopilotSkills (agent-skills) |
| Want repo-level instructions for your team | CopilotSkills-CLI |
| Need quick custom instructions in VS Code | CopilotSkills (custom-instructions) |
| Build M365 Copilot extensions | CopilotSkills-Frontier |
| Want pre-built stack-specific bundles | CopilotSkills `workspace-by-stack` bundle |
| Need chat-based skill invocation | CopilotSkills `chat-participants` |

---

## Troubleshooting

### Copilot not reading instructions

- Verify `.github/copilot-instructions.md` exists at the repository root.
- Check that the file is committed to git (Copilot reads from the repository, not just the working tree).
- Restart VS Code after adding instructions.

### Agent-skill not appearing in chat

- Confirm the skill path in `.vscode/settings.json` is correct and the file exists.
- Ensure the VS Code Copilot Chat extension is up to date.
- Check that the `description` field is not empty.

### Encoding issues on Windows

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$env:PYTHONIOENCODING = "utf-8"
```

### Combined instructions too large

If your `.github/copilot-instructions.md` is too large for Copilot to process effectively:

1. Prioritize the most relevant skills for your project.
2. Use the `workspace-essential-30` or `coding-agent-20` bundle instead of the full library.
3. Move less-used skills to agent-skills format (loaded on demand) rather than instructions (always loaded).

### Duplicate skill names

Cross-category collisions use the `{category}--{slug}` dedup prefix in flat output directories. In categorized directories (`agent-skills/`, `custom-instructions/`), the category folder prevents collisions.

---

## Related Guides

- [Claude Guide](claude-guide.md) -- Compare with Claude's similar Markdown format
- [Codex Guide](codex-guide.md) -- Compare with OpenAI's JSON-based format
- [Platform Comparison](platform-comparison.md) -- Side-by-side feature matrix
- [Universal Adapters](universal-adapters-guide.md) -- Convert between platforms
- [Getting Started](../01-getting-started/) -- Initial setup and orientation
