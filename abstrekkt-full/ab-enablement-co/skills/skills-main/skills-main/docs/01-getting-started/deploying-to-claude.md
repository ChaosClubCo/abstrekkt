# Deploying to Claude

This guide covers deploying skills to all four Claude output variants: Claude Desktop, Claude Code CLI, Claude Web, and the main ClaudeSkills directory. Each variant serves a different workflow; pick the one that matches how you use Claude.

---

## Overview of Claude Variants

| Variant | Directory | Format | Use Case |
|---------|-----------|--------|----------|
| Claude Desktop | `ClaudeSkills-Desktop/` | `.claude-plugin/skills/{slug}/SKILL.md` | Desktop app plugin panel |
| Claude Code CLI | `ClaudeSkills-CLI/` | `skills/{slug}/SKILL.md` | Slash commands in Claude Code |
| Claude Web | `ClaudeSkills-Web/` | `projects/{slug}/project-instructions.md` | Claude.ai project instructions |
| ClaudeSkills (main) | `ClaudeSkills/` | `skills/{category}/{slug}/SKILL.md` | Reference source, organized by category |

All four contain the same 508 skill definitions, formatted slightly differently for each target.

---

## Prerequisites

- The Skills Library repository cloned locally
- Claude Desktop app (for Desktop variant) or Claude Code CLI installed
- A Claude.ai account (for Web variant)

---

## Claude Desktop

Claude Desktop reads plugins from a specific directory on your system. Copying the `.claude-plugin` folder to the right location makes all skills available in the Desktop app.

### Windows

```powershell
Copy-Item -Recurse "ClaudeSkills-Desktop\.claude-plugin" "$env:APPDATA\Claude\"
```

The target path expands to something like `C:\Users\YourName\AppData\Roaming\Claude\.claude-plugin\`.

### macOS

```bash
cp -r ClaudeSkills-Desktop/.claude-plugin ~/Library/Application\ Support/Claude/
```

### Linux

```bash
cp -r ClaudeSkills-Desktop/.claude-plugin ~/.config/claude/
```

### After Copying

1. Restart Claude Desktop.
2. Open the plugin panel (look for the plugin icon in the sidebar).
3. You should see skills listed by slug name.
4. Click any skill to activate it for the current conversation.

### Deploying a Subset

If you do not want all 508 skills, copy individual skill directories:

```powershell
# Windows -- copy a single skill
Copy-Item -Recurse "ClaudeSkills-Desktop\.claude-plugin\skills\code-review-checklist" "$env:APPDATA\Claude\.claude-plugin\skills\"
```

```bash
# macOS/Linux -- copy a single skill
cp -r ClaudeSkills-Desktop/.claude-plugin/skills/code-review-checklist \
   ~/Library/Application\ Support/Claude/.claude-plugin/skills/
```

### Updating Skills

To update to newer skill versions, delete the existing plugin directory and re-copy:

```powershell
# Windows
Remove-Item -Recurse "$env:APPDATA\Claude\.claude-plugin"
Copy-Item -Recurse "ClaudeSkills-Desktop\.claude-plugin" "$env:APPDATA\Claude\"
```

```bash
# macOS
rm -rf ~/Library/Application\ Support/Claude/.claude-plugin
cp -r ClaudeSkills-Desktop/.claude-plugin ~/Library/Application\ Support/Claude/
```

---

## Claude Code CLI

Claude Code is Anthropic's CLI tool. Skills deployed here become available as slash commands that you can invoke directly from the terminal.

### Installation

```bash
cp -r ClaudeSkills-CLI/.claude/commands ~/.claude/commands
```

This copies all skill files into your Claude Code commands directory.

### Verifying

Launch Claude Code and run:

```
/help
```

You should see the deployed skills listed among the available commands.

### Using a Skill

Invoke any skill by name as a slash command:

```
/code-review-checklist Review the auth module for security issues.
```

Claude Code reads the skill's instructions and applies them to your prompt.

### Deploying Individual Skills

```bash
# Copy a single skill
cp ClaudeSkills-CLI/skills/code-review-checklist/SKILL.md \
   ~/.claude/commands/code-review-checklist.md
```

### Directory Structure

After deployment, your CLI commands directory looks like this:

```
~/.claude/
  commands/
    code-review-checklist.md
    api-design-reviewer.md
    multi-agent-orchestrator.md
    ...
```

### Project-Level Skills

You can also place skills in a project directory to scope them to a specific project:

```bash
# From your project root
mkdir -p .claude/commands
cp ClaudeSkills-CLI/skills/code-review-checklist/SKILL.md \
   .claude/commands/code-review-checklist.md
```

Project-level commands take precedence over global commands with the same name.

---

## Claude Web (claude.ai)

Claude Web skills are formatted as project instructions for Claude.ai's Projects feature.

### How It Works

Claude.ai Projects allow you to set custom instructions that apply to every conversation within a project. The `ClaudeSkills-Web/` directory contains one project-instructions file per skill.

### Setting Up a Project with a Skill

1. Go to [claude.ai](https://claude.ai) and open or create a project.
2. Click "Project settings" or the gear icon.
3. In the "Custom instructions" field, paste the contents of the skill file.

For example, to use the code review skill:

```bash
cat ClaudeSkills-Web/projects/code-review-checklist/project-instructions.md
```

Copy the output and paste it into the project's custom instructions.

### Combining Multiple Skills

You can combine multiple skills into a single project by concatenating their instructions:

```bash
cat ClaudeSkills-Web/projects/code-review-checklist/project-instructions.md \
    ClaudeSkills-Web/projects/security-audit/project-instructions.md \
    > combined-instructions.md
```

Then paste the contents of `combined-instructions.md` into your project settings.

### Tips for Claude Web

- Keep combined instructions under the project instruction character limit.
- Use 3-5 skills per project for best results; too many instructions can dilute focus.
- Name your projects after the skill set for easy identification (e.g., "Code Quality Review").

---

## ClaudeSkills (Main Directory)

The main `ClaudeSkills/` directory is the reference source organized by category. It is primarily used for browsing and as an input to the pipeline rather than for direct deployment.

### Directory Structure

```
ClaudeSkills/
  skills/
    ai-agents/
      multi-agent-orchestrator/SKILL.md
      tool-use-planner/SKILL.md
      ...
    technical/
      code-review-checklist/SKILL.md
      api-design-reviewer/SKILL.md
      ...
    strategy/
      competitive-landscape-analyzer/SKILL.md
      ...
    creative/
      ...
    operations/
      ...
    industry/
      ...
```

### When to Use This Variant

- **Browsing by category** -- the category-based organization makes it easy to explore related skills.
- **As pipeline input** -- converter scripts read from this directory.
- **For reference** -- when you need the canonical version of a skill with full category context.

### Using It Directly

While the other three variants are designed for direct deployment, you can use the main directory with Claude Desktop or CLI by copying individual files:

```bash
# Copy a single skill to Claude CLI
cp ClaudeSkills/skills/technical/code-review-checklist/SKILL.md \
   ~/.claude/commands/code-review-checklist.md
```

---

## Verifying Your Deployment

After deploying to any variant, run a quick smoke test:

1. Start a new conversation with Claude.
2. Reference a specific skill by name: "Using the code-review-checklist skill, review this code..."
3. Check that Claude's response follows the structured format defined in the skill.

If the response is generic rather than structured, the skill was not loaded. Check:

- The file was copied to the correct path.
- The application was restarted after copying.
- The file name matches what the platform expects.

---

## What to Read Next

- [Deploying to Gemini](./deploying-to-gemini.md) -- if you also use Gemini
- [Deploying to Copilot](./deploying-to-copilot.md) -- if you also use Copilot
- [Deploying to Codex](./deploying-to-codex.md) -- if you also use Codex
- [Choosing a Skill](./choosing-a-skill.md) -- browse the full catalog
- [FAQ](./faq.md) -- troubleshooting and common questions
