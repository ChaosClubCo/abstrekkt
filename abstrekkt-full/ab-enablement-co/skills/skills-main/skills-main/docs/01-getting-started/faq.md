# Frequently Asked Questions

This page answers the most common questions about the Skills Library. If your question is not listed here, check the deployment guides or open an issue in the repository.

---

## General

### What is a skill?

A skill is a structured set of instructions that tells an AI assistant how to perform a specific task. Each skill is defined in a `SKILL.md` file with YAML frontmatter (containing the skill's `name` and `description`) followed by a markdown body with sections like Overview, When to Use, Core Processes, Tools and Templates, Metrics, Common Pitfalls, and Integration Points.

Skills are not code libraries or plugins -- they are prompt-based configurations that shape how the AI responds within a particular domain.

### How many skills are there?

The library contains **507 master skills** stored in `_master-skills/`. These are distributed across 6 categories:

| Category | Count | Description |
|----------|-------|-------------|
| ai-agents | 232 | Autonomous agent patterns, tool-use orchestration, multi-agent workflows |
| technical | 127 | Software engineering, DevOps, architecture, code review |
| strategy | 59 | Business strategy, competitive analysis, market research |
| creative | 40 | Writing, design, content generation, brainstorming |
| operations | 24 | Project management, process optimization, logistics |
| industry | 25 | Healthcare, finance, legal, manufacturing verticals |
| **Total** | **507** | |

The converted platform outputs may show slightly different counts (e.g., 508, 512, 519) because some platforms include index files, extras, or category-level overviews.

### What platforms are supported?

Four AI ecosystems are supported, with 14 output targets total:

| Ecosystem | Variants |
|-----------|----------|
| **Claude** (Anthropic) | ClaudeSkills, ClaudeSkills-CLI, ClaudeSkills-Desktop, ClaudeSkills-Web |
| **Gemini** (Google) | GeminiSkills (Gems), GeminiSkills-CLI, GeminiSkills-Studio, GeminiSkills-Agents |
| **Copilot** (GitHub/Microsoft) | CopilotSkills, CopilotSkills-CLI, CopilotSkills-Frontier |
| **Codex** (OpenAI) | CodexSkills, CodexSkills-CLI |

See the [Quickstart](./quickstart.md) for deployment commands.

### Which platform should I choose?

Choose based on where you do most of your AI-assisted work:

| If you primarily use... | Deploy to... | Guide |
|------------------------|-------------|-------|
| Claude Desktop or Claude.ai | Claude Desktop or Claude Web | [Deploying to Claude](./deploying-to-claude.md) |
| Claude Code (CLI) | Claude CLI | [Deploying to Claude](./deploying-to-claude.md) |
| Gemini in the browser or AI Studio | Gemini Gems or Studio | [Deploying to Gemini](./deploying-to-gemini.md) |
| Gemini CLI | Gemini CLI | [Deploying to Gemini](./deploying-to-gemini.md) |
| VS Code with GitHub Copilot | Copilot custom instructions | [Deploying to Copilot](./deploying-to-copilot.md) |
| OpenAI API or custom GPTs | Codex (Responses API or GPT Builder) | [Deploying to Codex](./deploying-to-codex.md) |
| Codex CLI | Codex CLI | [Deploying to Codex](./deploying-to-codex.md) |

You can deploy to multiple platforms simultaneously. The skills are platform-agnostic at the source level; only the output format differs.

### Can I use skills across platforms?

Yes. Every skill originates from the same master `SKILL.md` source. The pipeline scripts convert each skill into the format required by each platform. If you switch from Gemini to Claude, for example, you do not need to rewrite skills -- just deploy the Claude variant instead.

You can also run multiple platforms at once. Having `code-review-checklist` deployed to both Claude CLI and Copilot means you can use it in whichever tool you happen to be working in.

---

## Skills and Categories

### What is the difference between categories?

Categories group skills by domain:

- **ai-agents** -- Skills focused on building, orchestrating, and evaluating AI agent systems. Includes multi-agent coordination, tool use, prompt engineering, RAG, and LLM evaluation.
- **technical** -- Software engineering skills: languages, frameworks, testing, DevOps, databases, architecture, security, and performance.
- **strategy** -- Business and organizational skills: strategic planning, competitive intelligence, market research, financial modeling, and growth.
- **creative** -- Content creation and design skills: copywriting, brand identity, UX design, storytelling, and visual design.
- **operations** -- Process and project management skills: agile practices, resource planning, risk management, and logistics.
- **industry** -- Vertical-specific skills: healthcare compliance, financial regulation, legal analysis, manufacturing quality, and education.

### How do I find the right skill for my task?

Several approaches:

1. **Browse by role** -- Check the [Role Guides](../03-role-guides/) for curated lists matching your job function (developer, PM, designer, data analyst, DevOps, executive, content writer).
2. **Browse by category** -- See the [Skill Catalog](../05-skill-catalog/) for the complete listing organized by category.
3. **Search by keyword** -- Use your file manager or `grep` to search skill names and descriptions:
   ```bash
   grep -rl "kubernetes" _master-skills/ --include="SKILL.md" -l
   ```
4. **Use the choosing guide** -- Read [Choosing a Skill](./choosing-a-skill.md) for a decision-tree approach.

### Can I customize a skill?

Yes. Skills are plain markdown files. You can:

- Edit the instructions to match your team's conventions.
- Remove sections that do not apply to your workflow.
- Add domain-specific context (e.g., your company's coding standards).
- Combine sections from multiple skills into a single custom file.

If you customize skills, keep your modifications in a separate branch or directory so you can merge upstream updates cleanly.

### What is the governance directory?

The `intinc-claude-skills-governance-role-bundles/` directory at the project root contains meta-governance files: `GOVERNANCE.md` (project policies and maintenance standards), `INDEX.md` (master listing of all skills and their status), and related configuration. These define how the library itself is managed -- contribution rules, quality gates, release processes -- not individual skill instructions.

### How are skill slugs determined?

Slugs are the directory names under `_master-skills/{category}/{slug}/SKILL.md`. They use lowercase letters and hyphens (e.g., `code-review-checklist`, `k8s-manifest-generator`). The slug is derived from the directory name, not from the `name` field in the YAML frontmatter.

---

## Bundles

### What is a bundle?

A bundle is a curated collection of skills packaged for a specific use case or persona. Instead of deploying all 507 skills, you can install a bundle containing just the 15-50 skills most relevant to your workflow.

### How many bundles are there?

There are **18 bundles** across three platforms:

**Gemini** (7 bundles in `GeminiSkills/bundles/`):

| Bundle | Skills | Description |
|--------|--------|-------------|
| gems-full | 508 | Complete Gem collection |
| by-category | 508 | Full set organized by category |
| vertex-enterprise | 53 | Enterprise Vertex AI configs |
| studio-essential-30 | 30 | Essential AI Studio prompts |
| agent-chains-20 | 20 | Multi-step agent chains |
| idx-workspace | 20 | IDX workspace integrations |
| studio-creative-15 | 15 | Creative Studio prompts |

**Copilot** (6 bundles in `CopilotSkills/bundles/`):

| Bundle | Skills | Description |
|--------|--------|-------------|
| by-category | 508 | Full set organized by category |
| workspace-by-stack | 79 | Stack-specific (React, Python, etc.) |
| agent-skills-50 | 50 | Top 50 agent skills |
| workspace-essential-30 | 30 | Essential workspace skills |
| coding-agent-20 | 20 | Focused coding assistant |
| chat-participants-20 | 20 | Chat participant configs |

**Codex** (5 bundles in `CodexSkills/bundles/`):

| Bundle | Skills | Description |
|--------|--------|-------------|
| responses-api-full | 508 | Complete Responses API collection |
| by-category | 508 | Full set organized by category |
| enterprise-assistants | 53 | Enterprise assistant configs |
| gpt-builder-50 | 50 | Top GPT Builder configs |
| agent-builder-20 | 20 | Focused agent builder set |

### How do I install a bundle?

Each bundle is a directory containing the skills in that platform's native format. Copy the bundle contents to your deployment target. For example:

```bash
# Gemini -- deploy the essential 30
cp -r GeminiSkills/bundles/studio-essential-30/ ~/.gemini/skills/

# Copilot -- deploy the coding agent bundle
cp -r CopilotSkills/bundles/coding-agent-20/ .github/copilot-skills/

# Codex -- deploy the enterprise assistants
cp -r CodexSkills/bundles/enterprise-assistants/ ~/.codex/skills/
```

### Can I create my own bundle?

Yes. A bundle is simply a directory containing skill files. Create a new directory, copy in the skills you want, and deploy it like any other bundle. If you want it included in the official library, submit a pull request with a bundle manifest.

---

## Deployment

### What are the deployment commands?

Quick reference for all platforms:

```bash
# Claude Code CLI
cp -r ClaudeSkills-CLI/.claude/commands ~/.claude/commands

# Claude Desktop (Windows -- run in PowerShell)
# Copy-Item -Recurse "ClaudeSkills-Desktop\.claude-plugin" "$env:APPDATA\Claude\"

# Claude Desktop (macOS)
cp -r ClaudeSkills-Desktop/.claude-plugin ~/Library/Application\ Support/Claude/

# Gemini CLI
cp -r GeminiSkills-CLI/.gemini ~/.gemini

# Copilot
cp -r CopilotSkills-CLI/.github .github

# Codex CLI
cp -r CodexSkills-CLI/.codex ~/.codex
```

For detailed instructions, see the platform-specific deployment guides:
- [Deploying to Claude](./deploying-to-claude.md)
- [Deploying to Gemini](./deploying-to-gemini.md)
- [Deploying to Copilot](./deploying-to-copilot.md)
- [Deploying to Codex](./deploying-to-codex.md)

### Do I need to deploy all skills?

No. You can deploy a single skill, a bundle, or the full set. Deploying fewer skills keeps your configuration lean and avoids noise. See the bundles section above or the individual deployment guides for instructions on deploying subsets.

### Can I deploy to multiple platforms at once?

Yes. The platform outputs are independent directories. You can deploy to Claude CLI, Gemini CLI, and Copilot simultaneously without conflicts:

```bash
cp -r ClaudeSkills-CLI/.claude/commands ~/.claude/commands
cp -r GeminiSkills-CLI/.gemini ~/.gemini
cp -r CopilotSkills-CLI/.github .github
```

### How do I update skills after a new release?

Pull the latest changes from the repository and re-run the deployment command for your platform. If you have customized any skill files in the target location, back them up first -- the copy commands overwrite existing files.

```bash
git pull origin main
cp -r ClaudeSkills-CLI/.claude/commands ~/.claude/commands
```

### Do I need Python to use skills?

No. Python is only required if you want to run the conversion pipeline (adding new skills, modifying existing ones, regenerating platform outputs, or generating bundles). If you are deploying pre-generated skills from the repository, all you need is a file copy command:

```bash
cp -r ClaudeSkills-CLI/.claude/commands ~/.claude/commands
```

No Python, no Node.js, no build step. The platform output files are ready to use as-is.

### Can I do a sparse checkout to save disk space?

Yes. If you only need one platform, use Git sparse checkout:

```bash
git clone --filter=blob:none --sparse https://github.com/your-org/skills.git
cd skills
git sparse-checkout set _master-skills ClaudeSkills-CLI
```

Replace `ClaudeSkills-CLI` with whichever platform directory you need.

---

## Contributing

### How do I contribute a new skill?

1. Create a new directory under `_master-skills/{category}/{your-skill-slug}/`.
2. Add a `SKILL.md` file with the required format:
   ```yaml
   ---
   name: Your Skill Name
   description: A one-line description of what this skill does
   ---
   ```
   Followed by markdown sections: Overview, When to Use, Core Processes, Tools and Templates, Metrics, Common Pitfalls, Integration Points.
3. Run the validator to check your skill:
   ```bash
   export PYTHONIOENCODING=utf-8
   python lib/skill_validator.py --strict _master-skills/{category}/{your-skill-slug}/SKILL.md
   ```
4. Run the conversion pipeline to generate platform outputs:
   ```bash
   python sync-skills.py
   ```
5. Submit a pull request.

### What are the quality requirements?

Every skill must:

- Have valid YAML frontmatter with `name` and `description` fields.
- Contain at least one actionable instruction section in the body.
- Have no hardcoded API keys, secrets, or personally identifiable information.
- Pass the validator: `python lib/skill_validator.py --strict <file>`.
- Follow the naming convention: lowercase slug with hyphens, matching the directory name.

### How do I report an issue with a skill?

Open an issue in the repository with:

- The skill slug (e.g., `code-review-checklist`).
- The platform you deployed to.
- A description of the problem (incorrect instructions, formatting issues, missing sections).
- The expected behavior.

---

## Technical

### What are the prerequisites for running pipeline scripts?

- **Python 3.8+** -- for `sync-skills.py`, `convert_to_gems.py`, `convert_to_codex_responses.py`, `convert_to_cli_skills.py`, `fix_skills.py`, and the library modules.
- **Node.js 18+** -- for `convert-to-copilot.js`.
- **PYTHONIOENCODING=utf-8** -- required on Windows to avoid cp1252 encoding errors.

### What does the pipeline do?

The pipeline has three stages:

1. **Quality passes** -- `fix_skills.py` (frontmatter and description fixes), `fix_skills_structure.py` (headings and section structure), `fix_skills_pass3.py` (slug names and description trimming).
2. **Conversion** -- `sync-skills.py` discovers all master skills and runs five converters: Claude, Gemini, Codex, Copilot, and CLI formats.
3. **Orchestration** -- `populate_all.py` runs all phases including bundle generation, variant creation, quality checks, and cleanup.

### Why do platform outputs have different file counts?

The master library has 507 skills, but platform outputs vary slightly:

- Some platforms include index files or category overviews (pushing counts to 508, 512, or 519).
- CLI variants may filter out a few skills that do not translate well to CLI format (503-507).
- Gemini Gems includes extra configurations beyond the master set (525).
- Copilot custom-instructions includes additional format variations (519).

These differences are expected and documented in the [Platform Outputs](../PLATFORM_OUTPUTS.md) reference.

### How are slug collisions handled?

Slugs are derived from directory names, not from the `name` field in frontmatter. When two skills in different categories share the same slug (about 13 cases), the pipeline applies a deduplication prefix: `{category}--{slug}`. For example, if both `ai-agents/monitoring` and `technical/monitoring` exist, one becomes `ai-agents--monitoring`.

### Can I run the pipeline on Windows?

Yes. All scripts run on Windows. Set the encoding variable first:

```powershell
$env:PYTHONIOENCODING = "utf-8"
python sync-skills.py
```

Or in bash:

```bash
export PYTHONIOENCODING=utf-8
python sync-skills.py
```

### Is convert_to_gems.js still supported?

No. `convert_to_gems.js` is deprecated. Use the Python version `convert_to_gems.py` instead, which supports dynamic model selection, category-based temperature tuning, safety settings, grounding instructions, auto-tagging, and bundle generation.

---

## What to Read Next

- [Quickstart](./quickstart.md) -- deploy skills in under 5 minutes
- [Choosing a Skill](./choosing-a-skill.md) -- find the right skill for your task
- [Role Guides](../03-role-guides/) -- curated recommendations by job function
- [Skill Catalog](../05-skill-catalog/) -- browse the full list
