# Quickstart

Get AI skills running on your platform in under 5 minutes. This guide covers the fastest path for each supported platform. For detailed setup and configuration, see the dedicated deployment guides linked at the end.

---

## Prerequisites

Before you begin, make sure you have the following installed:

- **Git** -- to clone the repository
- **Python 3.8+** -- required only if you plan to run pipeline scripts (sync, convert, validate)
- **Node.js 18+** -- required only if you plan to run the Copilot JS converter

You also need access to at least one AI platform:

| Platform | What You Need |
|----------|---------------|
| Claude | Anthropic account; Claude Desktop app or Claude Code CLI |
| Gemini | Google account; Gemini app, AI Studio, or Gemini CLI |
| Copilot | GitHub account; VS Code with Copilot extension or Copilot CLI |
| Codex | OpenAI account; Codex CLI or API access |

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/skills.git
cd skills
```

The repository is approximately 200 MB. If you only need a single platform, you can do a sparse checkout (see the FAQ for instructions).

---

## Step 2: Pick Your Platform

Choose one of the sections below. Each one shows the single command needed to deploy all skills to that platform.

### Claude Desktop (Windows)

```powershell
Copy-Item -Recurse "ClaudeSkills-Desktop\.claude-plugin" "$env:APPDATA\Claude\"
```

Restart Claude Desktop after copying. Skills appear in the plugin panel.

### Claude Desktop (macOS)

```bash
cp -r ClaudeSkills-Desktop/.claude-plugin ~/Library/Application\ Support/Claude/
```

Restart Claude Desktop after copying.

### Claude Code CLI

```bash
cp -r ClaudeSkills-CLI/.claude/commands ~/.claude/commands
```

Skills become available as slash commands in Claude Code. Run `/help` to see the list.

### Gemini CLI

```bash
cp -r GeminiSkills-CLI/.gemini ~/.gemini
```

Skills are available in your next Gemini CLI session.

### Gemini Agents

```bash
cp -r GeminiSkills-Agents/.gemini/agents ~/.gemini/agents
```

Agent configurations are loaded automatically by the Gemini CLI.

### GitHub Copilot (VS Code / CLI)

```bash
cp -r CopilotSkills-CLI/.github .github
```

Run this from the root of any Git repository where you want Copilot to use the skills. The `.github/copilot-instructions.md` file is read automatically.

### OpenAI Codex CLI

```bash
cp -r CodexSkills-CLI/.codex ~/.codex
```

Skills are picked up by the Codex CLI on next launch.

---

## Step 3: Verify the Installation

After deploying, run a quick test to confirm skills are loaded:

### Claude

Open Claude Desktop or Claude Code and ask:

```
Use the "code-review-checklist" skill to review this function:

def add(a, b):
    return a + b
```

If the response follows a structured code-review format, the skills are working.

### Gemini

In the Gemini CLI, try:

```
@code-review-checklist Review this Python function for best practices.
```

### Copilot

In VS Code, open a file and ask Copilot Chat:

```
Using the project instructions, review this code for security issues.
```

### Codex

In the Codex CLI:

```
Review the current file using the code review agent.
```

---

## Step 4: Explore Skills

The library contains 507 skills across 6 categories:

| Category | Count | Examples |
|----------|-------|---------|
| ai-agents | 232 | Multi-agent orchestration, tool-use patterns, RAG pipelines |
| technical | 127 | Code review, architecture design, DevOps automation |
| strategy | 59 | Market analysis, competitive intelligence, business planning |
| creative | 40 | Content writing, brainstorming, design critique |
| operations | 24 | Project management, process optimization, incident response |
| industry | 25 | Healthcare compliance, financial modeling, legal review |

Browse the master source files:

```bash
ls _master-skills/
```

Each category is a subdirectory. Inside each category, skills are organized by slug (directory name). Every skill directory contains a `SKILL.md` file with YAML frontmatter and markdown body.

To see all skills in a category:

```bash
ls _master-skills/ai-agents/
```

To read a specific skill:

```bash
cat _master-skills/technical/code-review-checklist/SKILL.md
```

---

## Step 5: Deploy Individual Skills (Optional)

If you only want specific skills rather than the full set, copy individual files:

### Claude CLI -- single skill

```bash
cp _master-skills/technical/code-review-checklist/SKILL.md \
   ~/.claude/commands/code-review-checklist.md
```

### Gemini -- single Gem

```bash
cp GeminiSkills/gems/technical/code-review-checklist.json \
   ~/.config/gemini/gems/
```

### Copilot -- single instruction

```bash
cp CopilotSkills/custom-instructions/technical/code-review-checklist.md \
   .github/copilot-instructions/code-review-checklist.md
```

---

## What to Read Next

- [Choosing a Skill](./choosing-a-skill.md) -- learn how to browse and filter the full catalog
- [Deploying to Claude](./deploying-to-claude.md) -- detailed Claude setup for all 4 variants
- [Deploying to Gemini](./deploying-to-gemini.md) -- Gems, Studio, Agents, and CLI
- [Deploying to Copilot](./deploying-to-copilot.md) -- VS Code, CLI, and Frontier
- [Deploying to Codex](./deploying-to-codex.md) -- Responses API, GPT Builder, and CLI
- [FAQ](./faq.md) -- troubleshooting and common questions

---

## Troubleshooting

**Skills not appearing after copy?**
- Restart the application (Claude Desktop, VS Code, etc.).
- Check that you copied to the correct directory. Paths are case-sensitive on macOS and Linux.
- On Windows, ensure the `.claude-plugin` directory was not renamed during copy.

**Python encoding errors on Windows?**
Set the encoding environment variable before running any pipeline script:

```powershell
$env:PYTHONIOENCODING = "utf-8"
python sync-skills.py
```

Or in bash:

```bash
PYTHONIOENCODING=utf-8 python sync-skills.py
```

**Permission denied errors?**
Some target directories may require elevated permissions. On macOS/Linux, prefix with `sudo` if needed. On Windows, run PowerShell as Administrator.
