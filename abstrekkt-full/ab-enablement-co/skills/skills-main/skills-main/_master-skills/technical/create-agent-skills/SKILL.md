---
name: create-agent-skills
description: Helps build and debug create agent skills processes. Expert guidance for creating, writing, building, and refining Claude Code Skills. Use when working with SKILL.md files, authoring new skills, improving existing skills, or understanding skill structure and best practices.
---

# Claude Code Essentials for Create Agent Skills

This skill reaches its full power in Claude Code -- a coding agent that lives in your terminal, understands your codebase, and runs code in real-time.

## Why These 12 Concepts Matter

Think of these concepts like a **toolkit for building reusable agent capabilities:**
- Core tools: Skills, Slash Commands, CLAUDE.md
- Power tools: Subagents, Hooks, Plan Mode, Tool Use
- Advanced moves: Permissions, MCP Servers, Settings.json, Checkpoints, Code Execution

Together, they let you create, test, and deploy modular skills that transform Claude Code into a domain expert on demand.

## The 12 Concepts

### 1. Skills
**What it is:** Reusable markdown files containing specialized instructions that Claude can invoke via slash commands.

**Why it matters for create-agent-skills:** Skills are the core artifact this skill produces. Every SKILL.md file you author becomes a loadable capability that gives Claude domain expertise -- from code review to deployment pipelines to security auditing.

**Example:**
```markdown
# A skill file at .claude/skills/security-audit/SKILL.md
---
name: security-audit
description: Audit code for OWASP Top 10 vulnerabilities. Use when reviewing PRs or before deployment.
---

<objective>Scan codebase for security vulnerabilities</objective>
<process>
1. Check authentication and authorization patterns
2. Scan for injection vulnerabilities (SQL, XSS, SSRF)
3. Review secrets handling and exposure risks
</process>
<success_criteria>All OWASP Top 10 categories checked with findings report</success_criteria>
```

---

### 2. Slash Commands
**What it is:** Quick shortcuts (e.g., /commit, /review-pr) that invoke predefined skills or workflows.

**Why it matters for create-agent-skills:** Slash commands are the delivery mechanism for skills. When you build a skill, you also need to consider how it will be invoked -- whether as a standalone command or as part of a larger command library that teams share.

**Example:**
```markdown
# .claude/commands/audit-skill.md
---
description: Audit a skill against best practices and quality standards
argument-hint: [path-to-skill]
---

<objective>
Evaluate the skill at $ARGUMENTS against authoring best practices.
</objective>

<process>
1. Read the SKILL.md file at $ARGUMENTS
2. Check YAML frontmatter (name, description with trigger verbs)
3. Verify XML structure (no markdown headings in body)
4. Assess progressive disclosure (under 500 lines)
5. Report findings with actionable fixes
</process>
```

---

### 3. CLAUDE.md
**What it is:** A configuration file that provides project context, coding conventions, and instructions to Claude Code automatically.

**Why it matters for create-agent-skills:** CLAUDE.md defines the environment your skills operate in. When authoring skills, you need to understand what context CLAUDE.md already provides so your skill does not duplicate instructions -- and so it can reference project conventions that CLAUDE.md establishes.

**Example:**
```markdown
# CLAUDE.md at project root
## Skill Authoring Conventions
- All skills use pure XML structure (no markdown headings in body)
- YAML frontmatter requires: name (lowercase-hyphenated), description (with trigger verbs)
- Maximum 500 lines per SKILL.md; split into references/ for detail
- Test every skill with at least one real invocation before committing
```

---

### 4. Subagents
**What it is:** Specialized child agents spawned by Claude to handle specific subtasks in parallel or sequence.

**Why it matters for create-agent-skills:** Complex skills often delegate work to subagents. When designing a skill, you need to decide which parts require user interaction (main chat) and which can run autonomously (subagent). The router pattern in skill design maps directly to subagent orchestration.

**Example:**
```markdown
# A skill that spawns subagents for parallel research
# .claude/agents/skill-researcher.md
---
name: skill-researcher
description: Research domain knowledge for a new skill. Use when gathering reference material.
tools: Read, Grep, Glob, WebFetch
model: sonnet
---

<role>You are a domain research specialist gathering reference material for skill authoring.</role>
<workflow>
1. Search codebase for existing patterns related to the domain
2. Identify best practices and common patterns
3. Return structured findings as XML for skill content
</workflow>
```

---

### 5. Hooks
**What it is:** Shell commands that execute automatically before/after Claude Code events like tool calls, notifications, or session start.

**Why it matters for create-agent-skills:** Hooks let you add validation and automation around skill usage. You can create hooks that validate SKILL.md files on save, enforce naming conventions, or auto-run quality checks whenever a skill file is modified.

**Example:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "python lib/skill_validator.py \"$(jq -r '.tool_input.file_path' | grep 'SKILL.md')\" 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

---

### 6. Plan Mode
**What it is:** A mode where Claude explores and plans before making changes, creating a step-by-step implementation strategy for approval.

**Why it matters for create-agent-skills:** Building a complex skill requires planning before writing. Plan Mode lets Claude analyze the domain, identify what workflows and references are needed, propose a skill structure, and get your approval before generating any files.

**Example:**
```
User: "Create a skill for Kubernetes deployment management"

Claude (Plan Mode):
1. Analyze domain scope: kubectl commands, manifests, helm charts, monitoring
2. Propose structure:
   - SKILL.md: Router with intake + routing table
   - workflows/: deploy.md, rollback.md, scale.md, troubleshoot.md
   - references/: kubectl-patterns.md, helm-best-practices.md, monitoring-setup.md
   - templates/: deployment.yaml, service.yaml, ingress.yaml
3. Estimate: ~300 lines SKILL.md, 4 workflows, 3 references, 3 templates
→ Approve this plan? Then I will generate each file.
```

---

### 7. Tool Use
**What it is:** Claude's ability to call external tools like file editors, terminal commands, web searches, and MCP servers.

**Why it matters for create-agent-skills:** Skills are authored and tested through tool use. Claude reads existing skills with Read, creates new ones with Write, searches for patterns with Grep, and validates with Bash. Understanding the tool ecosystem helps you design skills that leverage the right tools.

**Example:**
```
# When creating a new skill, Claude uses multiple tools:
1. Glob("**/*SKILL.md") → Find existing skills for pattern reference
2. Read("_master-skills/technical/create-hooks/SKILL.md") → Study a well-structured example
3. Write(".claude/skills/new-skill/SKILL.md") → Create the skill file
4. Bash("python lib/skill_validator.py .claude/skills/new-skill/SKILL.md") → Validate quality
```

---

### 8. Permissions
**What it is:** Access control model with three levels: Allow (automatic), Ask (user confirmation), Deny (blocked).

**Why it matters for create-agent-skills:** When skills invoke tools, permissions determine what runs automatically vs. what requires approval. Designing skills with permission boundaries in mind ensures they work smoothly -- restricting destructive operations while allowing safe reads.

**Example:**
```json
{
  "permissions": {
    "Read": "allow",
    "Grep": "allow",
    "Glob": "allow",
    "Write": "ask",
    "Bash(python lib/skill_validator.py:*)": "allow",
    "Bash(rm:*)": "deny"
  }
}
```

---

### 9. MCP Servers
**What it is:** A service that exposes tools and data to Claude via the MCP protocol, extending Claude's capabilities.

**Why it matters for create-agent-skills:** Skills can reference MCP tools, and you can build MCP servers that provide specialized capabilities for your skills. For example, a skill for database management might rely on an MCP server that provides safe SQL query tools.

**Example:**
```json
{
  "mcpServers": {
    "skill-registry": {
      "command": "node",
      "args": ["./mcp-servers/skill-registry/index.js"],
      "description": "Provides tools for searching, indexing, and validating skills across the library"
    }
  }
}
```

---

### 10. Settings.json
**What it is:** Configuration file (~/.claude/settings.json) for Claude Code defaults: permissions, allowed tools, environment preferences.

**Why it matters for create-agent-skills:** Settings.json controls the global environment where skills run. When authoring skills, you need to know what tools are available by default and what permissions are pre-configured so your skill works without requiring users to change their settings.

**Example:**
```json
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(python lib/skill_validator.py:*)"
    ],
    "deny": [
      "Bash(rm -rf:*)"
    ]
  },
  "env": {
    "SKILLS_DIR": "./_master-skills"
  }
}
```

---

### 11. Checkpoints
**What it is:** Git-based snapshots of progress that let you undo changes and restore to a known good state.

**Why it matters for create-agent-skills:** When refactoring or upgrading skills, checkpoints let you experiment safely. If a batch enhancement breaks validation, you can revert to the last checkpoint and try a different approach without losing your prior work.

**Example:**
```
# Workflow for batch skill enhancement with checkpoints:
1. Checkpoint: "Before skill enhancement batch"
2. Enhance 10 skills with new Claude Code Essentials section
3. Run validator: python lib/skill_validator.py --all
4. If failures → revert to checkpoint, fix template, retry
5. If all pass → checkpoint: "After skill enhancement batch"
```

---

### 12. Code Execution
**What it is:** Claude's ability to run code (via Bash tool) directly in your environment, executing tests, builds, and scripts in real-time.

**Why it matters for create-agent-skills:** Skills are validated through code execution. After writing a skill, Claude can immediately run the validator, check for syntax issues, verify frontmatter formatting, and even test the skill by invoking it -- all without leaving the conversation.

**Example:**
```bash
# Validate a newly created skill
python lib/skill_validator.py .claude/skills/new-skill/SKILL.md

# Output:
# Score: 95/100
# PASS
# Warnings:
#   - Description could include more trigger verbs
#   - Consider adding references/ for domain knowledge > 100 lines
```

---

## How These Concepts Work Together

When you create a new skill, the full Claude Code ecosystem activates: Plan Mode maps out the skill structure, Tool Use reads existing patterns and writes new files, Code Execution validates quality instantly, and Checkpoints protect your work throughout. Once deployed, Slash Commands make the skill accessible, Hooks enforce quality gates, and CLAUDE.md provides the project context the skill operates within.

### Quick Workflow
1. Use **Plan Mode** to analyze the domain and propose skill structure (SKILL.md + workflows + references)
2. Use **Tool Use** to read existing skills for patterns, then write the new skill files
3. Use **Code Execution** to run the validator and verify quality (score >= 90, no blocking errors)
4. Result: A tested, validated skill ready to invoke via **Slash Commands** or auto-triggered by **Subagents**

---

## Next Steps
- Try **Plan Mode** with a simple single-file skill to see the planning-then-execution pattern
- Layer in **Hooks** to auto-validate SKILL.md files whenever they are written or edited
- Combine with **Subagents** to build skills that delegate research to specialized agents

See also:
- create-subagents
- create-hooks
- create-slash-commands

---

<essential_principles>
## Core Workflow

## How Skills Work

Skills are modular, filesystem-based capabilities that provide domain expertise on demand. This skill teaches how to create effective skills.

### 1. Skills Are Prompts

All prompting best practices apply. Be clear, be direct, use XML structure. Assume Claude is smart - only add context Claude doesn't have.

### 2. SKILL.md Is Always Loaded

When a skill is invoked, Claude reads SKILL.md. Use this guarantee:
- Essential principles go in SKILL.md (can't be skipped)
- Workflow-specific content goes in workflows/
- Reusable knowledge goes in references/

### 3. Router Pattern for Complex Skills

```
skill-name/
├── SKILL.md              # Router + principles
├── workflows/            # Step-by-step procedures (FOLLOW)
├── references/           # Domain knowledge (READ)
├── templates/            # Output structures (COPY + FILL)
└── scripts/              # Reusable code (EXECUTE)
```

SKILL.md asks "what do you want to do?" → routes to workflow → workflow specifies which references to read.

**When to use each folder:**
- **workflows/** - Multi-step procedures Claude follows
- **references/** - Domain knowledge Claude reads for context
- **templates/** - Consistent output structures Claude copies and fills (plans, specs, configs)
- **scripts/** - Executable code Claude runs as-is (deploy, setup, API calls)

### 4. Pure XML Structure

No markdown headings (#, ##, ###) in skill body. Use semantic XML tags:
```xml
<objective>...</objective>
<process>...</process>
<success_criteria>...</success_criteria>
```

Keep markdown formatting within content (bold, lists, code blocks).

### 5. Progressive Disclosure

SKILL.md under 500 lines. Split detailed content into reference files. Load only what's needed for the current workflow.
</essential_principles>

<intake>
What would you like to do?

1. Create new skill
2. Audit/modify existing skill
3. Add component (workflow/reference/template/script)
4. Get guidance

**Wait for response before proceeding.**
</intake>

<routing>
| Response | Next Action | Workflow |
|----------|-------------|----------|
| 1, "create", "new", "build" | Ask: "Task-execution skill or domain expertise skill?" | Route to appropriate create workflow |
| 2, "audit", "modify", "existing" | Ask: "Path to skill?" | Route to appropriate workflow |
| 3, "add", "component" | Ask: "Add what? (workflow/reference/template/script)" | workflows/add-{type}.md |
| 4, "guidance", "help" | General guidance | workflows/get-guidance.md |

**Progressive disclosure for option 1 (create):**
- If user selects "Task-execution skill" → workflows/create-new-skill.md
- If user selects "Domain expertise skill" → workflows/create-domain-expertise-skill.md

**Progressive disclosure for option 3 (add component):**
- If user specifies workflow → workflows/add-workflow.md
- If user specifies reference → workflows/add-reference.md
- If user specifies template → workflows/add-template.md
- If user specifies script → workflows/add-script.md

**Intent-based routing (if user provides clear intent without selecting menu):**
- "audit this skill", "check skill", "review" → workflows/audit-skill.md
- "verify content", "check if current" → workflows/verify-skill.md
- "create domain expertise", "exhaustive knowledge base" → workflows/create-domain-expertise-skill.md
- "create skill for X", "build new skill" → workflows/create-new-skill.md
- "add workflow", "add reference", etc. → workflows/add-{type}.md
- "upgrade to router" → workflows/upgrade-to-router.md

**After reading the workflow, follow it exactly.**
</routing>

<quick_reference>
## Skill Structure Quick Reference

**Simple skill (single file):**
```yaml
---
name: skill-name
description: What it does and when to use it.
---

<objective>What this skill does</objective>
<quick_start>Immediate actionable guidance</quick_start>
<process>Step-by-step procedure</process>
<success_criteria>How to know it worked</success_criteria>
```

**Complex skill (router pattern):**
```
SKILL.md:
  <essential_principles> - Always applies
  <intake> - Question to ask
  <routing> - Maps answers to workflows

workflows/:
  <required_reading> - Which refs to load
  <process> - Steps
  <success_criteria> - Done when...

references/:
  Domain knowledge, patterns, examples

templates/:
  Output structures Claude copies and fills
  (plans, specs, configs, documents)

scripts/:
  Executable code Claude runs as-is
  (deploy, setup, API calls, data processing)
```
</quick_reference>

<reference_index>
## Domain Knowledge

All in `references/`:

**Structure:** recommended-structure.md, skill-structure.md
**Principles:** core-principles.md, be-clear-and-direct.md, use-xml-tags.md
**Patterns:** common-patterns.md, workflows-and-validation.md
**Assets:** using-templates.md, using-scripts.md
**Advanced:** executable-code.md, api-security.md, iteration-and-testing.md
</reference_index>

<workflows_index>
## Workflows

All in `workflows/`:

| Workflow | Purpose |
|----------|---------|
| create-new-skill.md | Build a skill from scratch |
| create-domain-expertise-skill.md | Build exhaustive domain knowledge base for build/ |
| audit-skill.md | Analyze skill against best practices |
| verify-skill.md | Check if content is still accurate |
| add-workflow.md | Add a workflow to existing skill |
| add-reference.md | Add a reference to existing skill |
| add-template.md | Add a template to existing skill |
| add-script.md | Add a script to existing skill |
| upgrade-to-router.md | Convert simple skill to router pattern |
| get-guidance.md | Help decide what kind of skill to build |
</workflows_index>

<yaml_requirements>
## YAML Frontmatter

Required fields:
```yaml
---
name: skill-name          # lowercase-with-hyphens, matches directory
description: ...          # What it does AND when to use it (third person)
---
```

Name conventions: `create-*`, `manage-*`, `setup-*`, `generate-*`, `build-*`
</yaml_requirements>

<success_criteria>
A well-structured skill:
- Has valid YAML frontmatter
- Uses pure XML structure (no markdown headings in body)
- Has essential principles inline in SKILL.md
- Routes directly to appropriate workflows based on user intent
- Keeps SKILL.md under 500 lines
- Asks minimal clarifying questions only when truly needed
- Has been tested with real usage
</success_criteria>
