# PHASE A2: TEMPLATE DEVELOPMENT
## Detailed Step-by-Step Execution Runbook

**Duration:** Days 2-3  
**Depends on:** Phase A1 (tier-1-concept-mapping.json)  
**Status checkpoint:** `tier-1-template-ready`  
**Can stop/resume:** YES (after each substep)

---

## STEP A2.1: Create Reusable Enhancement Block Template

### What We're Doing
Building a **reusable markdown template** that every Tier 1 skill enhancement will follow. This ensures consistency and speeds up batch processing.

### Template Purpose
This template will be used 70 times (once per skill). Invest time getting it right.

### The Enhancement Template

**File:** `tier-1-enhancement-template.md`

```markdown
# Claude Code Essentials for [SKILL_NAME]

This skill reaches its full power in Claude Code—a coding agent that understands your codebase and runs code in real-time.

## Why These [N] Concepts Matter

Think of these concepts like a **toolkit for [DOMAIN]:**
- Core tools: [concept 1], [concept 2], [concept 3]
- Power tools: [concept 4], [concept 5], [concept 6]
- Advanced moves: [concept 7], ..., [concept N]

Together, they let you [SPECIFIC_OUTCOME].

## The [N] Concepts (with examples)

### 1. [CONCEPT_NAME]
**What it is:**  
[1-2 sentence definition. What does this do?]

**Why it matters for [SKILL_NAME]:**  
[How does this concept help you with THIS skill? Be specific.]

**Example:**
\`\`\`
[Concrete code/workflow example that's copy-pasteable]
[Should be runnable or at least clear enough to follow]
\`\`\`

**Learn more:**  
[Link to docs.claude.com or internal reference]

---

### 2. [CONCEPT_NAME]
[Repeat above pattern for concepts 2...N]

---

## How To Use These Concepts Together

[Brief narrative showing how these concepts work together for this skill's workflow. 2-3 sentences.]

### Quick Workflow

1. [Step 1 using concept X]
2. [Step 2 using concept Y]
3. [Step 3 using concept Z]
4. [Result: outcome the user gets]

---

## Next Steps

- Try [Concept 1] with a simple [example domain]
- Then layer in [Concept 2] for [benefit]
- Combine [Concept 3] for [advanced benefit]

See also:
- [Related Tier 1 skill]
- [Related Tier 1 skill]
- [Tier 2 skill for next level]

---
```

### Template Customization Per Skill

For each skill, populate:
- `[SKILL_NAME]` → e.g., "create-agent-skills"
- `[N]` → concept count (10-15)
- `[DOMAIN]` → e.g., "agent building" or "code generation"
- `[SPECIFIC_OUTCOME]` → what the user can do with these concepts
- `[CONCEPT_NAME]` → each of 10-15 concepts from the mapping
- `[1-2 sentence definition]` → from concept library (see A2.2 below)
- `[Concrete example]` → skill-specific example (not generic)
- `[Link]` → reference URL
- `[How to use together]` → brief narrative for this specific skill
- `[Quick Workflow]` → 3-4 steps showing the path
- `[Related skills]` → cross-references to other Tier 1 skills

### Example: Fully Populated for "create-agent-skills"

```markdown
# Claude Code Essentials for Agent Building

This skill reaches its full power in Claude Code—a coding agent that understands your codebase and runs code in real-time.

## Why These 15 Concepts Matter

Think of these concepts like a **toolkit for building intelligent agents:**
- Core tools: Subagents, Hooks, Permissions
- Power tools: Slash Commands, Plan Mode, Tool Use, MCP Servers
- Advanced moves: CLAUDE.md, Checkpoints, Artifacts, Context Window, Ultrathink

Together, they let you **build multi-agent systems that coordinate, validate, and scale.**

## The 15 Concepts

### 1. Subagents
**What it is:**  
Specialized child agents that handle specific subtasks within a parent agent's workflow.

**Why it matters for Agent Building:**  
Instead of one monolithic agent doing everything, you split complex work across task-specialized agents. This is how production systems scale.

**Example:**
\`\`\`
# Parent agent: BrandCreationAgent
class BrandCreationAgent:
  def __init__(self):
    self.research_agent = SubAgent("BrandResearchAgent")
    self.design_agent = SubAgent("BrandDesignAgent")
    self.validation_agent = SubAgent("ValidationAgent")
  
  def create_brand(self, brief):
    research = self.research_agent.run(brief)
    design = self.design_agent.run(research)
    validated = self.validation_agent.run(design)
    return validated
\`\`\`

**Learn more:**  
[See create-subagents skill](D:\02_Development\Skills\_master-skills\ai-agents\create-subagents\SKILL.md)

---

### 2. Hooks
**What it is:**  
Interceptors that run before/after agent actions, letting you validate, modify, or block behavior.

**Why it matters for Agent Building:**  
Agents need guardrails. Hooks let you enforce permissions, validate outputs, and prevent bad actions before they happen.

**Example:**
\`\`\`
@hook("PreToolUse")
def validate_tool_permission(tool_name, tool_input):
  if tool_name == "delete_production_data":
    return Ask(user, f"Are you sure you want to delete: {tool_input}?")
  return Allow()

@hook("PostToolUse")
def log_action(tool_name, result):
  audit_log.append({
    "tool": tool_name,
    "timestamp": now(),
    "result": result
  })
  return result
\`\`\`

**Learn more:**  
[See create-hooks skill]

---

[... Repeat for concepts 3-15 ...]

---

## How These Concepts Work Together

When building an agent system, you start simple:
1. **Define the agent** (CLAUDE.md → instructions)
2. **Plan its workflow** (Plan Mode → decompose tasks)
3. **Add subagents** (Subagents → task specialization)
4. **Add guardrails** (Hooks → validation + safety)
5. **Checkpoint progress** (Checkpoints → resumable workflows)
6. **Expose quick actions** (Slash Commands → shortcuts)
7. **Connect tools** (Tool Use + MCP Servers → integrations)

### Quick Workflow: Building a Multi-Agent Brand Creator

1. Create parent agent with Subagents for research, design, validation
2. Add PreToolUse hook to check permissions before design operations
3. Use Plan Mode to decompose the full workflow
4. Add checkpoint after research phase (so you can resume from here)
5. Add /create-brand slash command for quick invocation
6. Document agent instructions in CLAUDE.md
7. Test with small examples, checkpoint, iterate

---

## Next Steps

- Start with [create-subagents]: Build your first multi-agent system
- Then add [create-hooks]: Add validation and safety
- Then add [create-slash-commands]: Make it user-friendly
- Then add [create-meta-prompts]: Optimize prompt structure

See also:
- [skill-developer] - Creating reusable skills
- [ai-agents-workflow] - Full workflow patterns
- [debug-like-expert] - Debugging agent behavior
```

### ✅ Checkpoint: A2.1 Complete
- [ ] Template created: `tier-1-enhancement-template.md`
- [ ] Template has all required fields: definition, why, example, learn-more, workflow, next-steps
- [ ] Example is clear and copy-pasteable
- [ ] Template is skill-agnostic (placeholders for customization)
- [ ] Update ENHANCEMENT_STATUS.json:
  ```json
  "A2_template_development": {
    "status": "IN_PROGRESS (A2.1_complete)"
  }
  ```

**If you stop here:** Template is ready. Resume at A2.2 (Concept Library).

---

## STEP A2.2: Create Concept Description Library

### What We're Doing
Building a lookup table of **all 30 Claude Code concepts** with consistent definitions. This speeds up filling in the template.

### File: `concept-descriptions.json`

This will have all 30 concepts with:
- Short definition (1-2 sentences)
- Applicable domains (which skills use it)
- Generic example (customizable per skill)
- Reference link

### Complete Concept Library

```json
{
  "metadata": {
    "created": "2026-02-08",
    "total_concepts": 30,
    "version": "1.0",
    "last_updated_by": "Kyle"
  },
  
  "concepts": {
    "Claude Code": {
      "definition": "A coding agent that understands your codebase, reads files, runs code, and iterates on solutions in real-time.",
      "domains": ["code-generation", "code-analysis", "testing", "debugging"],
      "generic_example": "Claude Code reads your project structure, understands your patterns, and generates code that fits your codebase style.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/claude-code",
      "often_paired_with": ["Terminal CLI", "Code Execution", "Checkpoints"]
    },
    
    "Terminal CLI": {
      "definition": "Command-line interface for running Claude Code skills and agents without GUI.",
      "domains": ["automation", "scripting", "devops", "testing"],
      "generic_example": "claude-code run my-skill.md --input 'Hello world'",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/terminal-cli",
      "often_paired_with": ["Code Execution", "Git Worktrees", "Bash"]
    },
    
    "CLAUDE.md": {
      "definition": "A configuration file defining agent instructions, constraints, and behavior.",
      "domains": ["agent-building", "orchestration", "automation"],
      "generic_example": "CLAUDE.md specifies: goals, constraints, tools available, expected input/output, examples of good behavior.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/claude-md",
      "often_paired_with": ["Slash Commands", "Hooks", "Permissions"]
    },
    
    "Context Window": {
      "definition": "The amount of text Claude can see and reason about at once (200K tokens).",
      "domains": ["long-document-analysis", "large-codebase-analysis", "research"],
      "generic_example": "You can paste entire codebases (up to 200K tokens) and Claude understands the full context without losing details.",
      "reference": "https://docs.claude.com/en/docs/about-claude/models-overview",
      "often_paired_with": ["Checkpoints", "Artifacts", "Code Execution"]
    },
    
    "Compaction": {
      "definition": "Automatic compression of old conversation context, freeing up space for new content while retaining key information.",
      "domains": ["long-running-tasks", "multi-phase-projects"],
      "generic_example": "After 50 messages, Claude compacts earlier context, summarizing decisions made and keeping token space for new work.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/context-management",
      "often_paired_with": ["Checkpoints", "Long-running tasks"]
    },
    
    "Checkpoints": {
      "definition": "Snapshots of progress that let you resume complex tasks from a known state.",
      "domains": ["multi-step-workflows", "testing", "deployment"],
      "generic_example": "After deploying to staging, save a checkpoint. If tests fail, you can revert to this checkpoint and try a different approach.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/checkpoints",
      "often_paired_with": ["Plan Mode", "Code Execution", "Terminal CLI"]
    },
    
    "Permissions": {
      "definition": "Access control model: Allow (automatic), Ask (user confirmation), Deny (block).",
      "domains": ["security", "agent-safety", "access-control"],
      "generic_example": "Permissions: reading source code = Allow; deleting database = Ask; accessing private keys = Deny.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/permissions",
      "often_paired_with": ["Hooks", "Tool Use", "Subagents"]
    },
    
    "Tool Use": {
      "definition": "Agents calling external tools/APIs (MCP servers, webhooks, system commands).",
      "domains": ["integrations", "automation", "orchestration"],
      "generic_example": "Agent uses tool: 'notify_slack' to send message; 'query_database' to fetch data; 'trigger_workflow' to start process.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/tool-use",
      "often_paired_with": ["MCP Servers", "Permissions", "Hooks"]
    },
    
    "Plan Mode": {
      "definition": "Agent breaks complex tasks into steps before executing, optimizing for correctness.",
      "domains": ["complex-tasks", "architecture", "orchestration"],
      "generic_example": "Instead of refactoring a codebase in one shot, Plan Mode breaks it into: analyze → plan → refactor module 1 → test → refactor module 2 → test → etc.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/plan-mode",
      "often_paired_with": ["Checkpoints", "Code Execution", "Terminal CLI"]
    },
    
    "MCP": {
      "definition": "Model Context Protocol—open standard for AI agents to connect to external systems.",
      "domains": ["integrations", "extensibility", "automations"],
      "generic_example": "MCP lets agents connect to: GitHub repos, Slack workspaces, databases, APIs—without building custom code.",
      "reference": "https://modelcontextprotocol.io",
      "often_paired_with": ["MCP Server", "Tool Use", "Hooks"]
    },
    
    "MCP Server": {
      "definition": "A service exposing tools and data to Claude via MCP protocol.",
      "domains": ["integrations", "extensibility"],
      "generic_example": "Run an MCP server for GitHub (tools: create-issue, list-repos, etc.) and agents can use these tools natively.",
      "reference": "https://modelcontextprotocol.io/quickstart/server",
      "often_paired_with": ["MCP", "Tool Use", "Subagents"]
    },
    
    "Hooks": {
      "definition": "Interceptors (PreToolUse, PostToolUse, etc.) that run before/after agent actions.",
      "domains": ["validation", "safety", "logging"],
      "generic_example": "Hook: before tool use, validate permissions. After tool use, log to audit trail.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/hooks",
      "often_paired_with": ["Permissions", "Subagents", "CLAUDE.md"]
    },
    
    "Skills": {
      "definition": "Reusable, packaged expertise that Claude can invoke. The skill you're building is a skill.",
      "domains": ["reusability", "knowledge-sharing", "modularization"],
      "generic_example": "A 'code-review' skill can be used by multiple projects/teams without duplication.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/skills",
      "often_paired_with": ["Slash Commands", "CLAUDE.md", "Subagents"]
    },
    
    "Plugins": {
      "definition": "Extensions that add capabilities to Claude Code environment (VS Code extension, GitHub integration, etc.).",
      "domains": ["ide-integration", "workflow-integration"],
      "generic_example": "VS Code plugin for Claude Code lets you invoke Claude from your editor without leaving.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/plugins",
      "often_paired_with": ["VS Code Extension"]
    },
    
    "Subagents": {
      "definition": "Specialized child agents handling subtasks within a parent workflow.",
      "domains": ["multi-agent-systems", "task-specialization", "orchestration"],
      "generic_example": "Parent: BrandCreationAgent; children: ResearchAgent, DesignAgent, ValidationAgent. Each focuses on one domain.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/subagents",
      "often_paired_with": ["Hooks", "Tool Use", "Checkpoints"]
    },
    
    "Background Tasks": {
      "definition": "Long-running tasks that execute asynchronously, with status checking/polling.",
      "domains": ["automation", "batch-processing", "async-workflows"],
      "generic_example": "Start a background task: process 1000 images → check status every 30s → when done, notify user.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/background-tasks",
      "often_paired_with": ["Checkpoints", "Slash Commands", "Webhooks"]
    },
    
    "Slash Commands": {
      "definition": "Quick shortcuts (e.g., /create-brand) that invoke agents/workflows without parameters.",
      "domains": ["user-experience", "automation", "accessibility"],
      "generic_example": "Type /create-brand → agent runs full workflow without user specifying each step.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/slash-commands",
      "often_paired_with": ["Subagents", "Skills", "CLAUDE.md"]
    },
    
    "Agent SDK": {
      "definition": "Software development kit for building custom agents programmatically.",
      "domains": ["advanced-development", "custom-agents"],
      "generic_example": "Use Agent SDK to build a custom agent in Python that runs locally and talks to your systems.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/agent-sdk",
      "often_paired_with": ["MCP Server", "Hooks", "Tool Use"]
    },
    
    "Ultrathink": {
      "definition": "Extended reasoning mode that makes Claude think very carefully through complex problems.",
      "domains": ["complex-analysis", "problem-solving", "architecture"],
      "generic_example": "Facing a tricky refactoring or architecture decision? Ultrathink mode spends more tokens reasoning before answering.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/ultrathink",
      "often_paired_with": ["Plan Mode", "Code Execution", "Context Window"]
    },
    
    "Artifacts": {
      "definition": "Dedicated space to render rich output (code, diagrams, documents) alongside conversation.",
      "domains": ["presentation", "documentation", "code-display"],
      "generic_example": "Instead of code in a code block, create an artifact: multi-file project, interactive demo, or formatted report.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/artifacts",
      "often_paired_with": ["Code Execution", "Checkpoints", "Inline Diffs"]
    },
    
    "VS Code Extension": {
      "definition": "Claude Code plugin for VS Code IDE, enabling inline Claude Code use without context switching.",
      "domains": ["ide-integration", "developer-workflow"],
      "generic_example": "Highlight code in VS Code, ask Claude to refactor, see changes inline—all without leaving your editor.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/vs-code-extension",
      "often_paired_with": ["Code Execution", "Inline Diffs", "Terminal CLI"]
    },
    
    "JetBrains Plugin": {
      "definition": "Claude Code plugin for JetBrains IDEs (IntelliJ, PyCharm, etc.).",
      "domains": ["ide-integration", "developer-workflow"],
      "generic_example": "Same as VS Code: inline refactoring, debugging, generation—without leaving JetBrains.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/jetbrains-plugin",
      "often_paired_with": ["Code Execution", "Inline Diffs"]
    },
    
    "Inline Diffs": {
      "definition": "Side-by-side visualization of code changes before/after.",
      "domains": ["code-review", "refactoring", "testing"],
      "generic_example": "Refactor a function: see original on left, new version on right, understand changes at a glance.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/inline-diffs",
      "often_paired_with": ["Code Execution", "Artifacts", "Git Worktrees"]
    },
    
    "LSP Support": {
      "definition": "Language Server Protocol integration for real-time code intelligence (linting, completion, etc.).",
      "domains": ["code-quality", "developer-experience"],
      "generic_example": "Claude Code runs LSP for your language: see syntax errors, type mismatches, and suggestions in real-time.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/lsp-support",
      "often_paired_with": ["Code Execution", "VS Code Extension"]
    },
    
    "Claude in Chrome": {
      "definition": "Browser extension that makes Claude available for web automation and research tasks.",
      "domains": ["web-automation", "research", "web-scraping"],
      "generic_example": "Use Claude in Chrome to summarize articles, extract data from web pages, fill forms—all from your browser.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/claude-in-chrome",
      "often_paired_with": ["Tool Use", "Slash Commands"]
    },
    
    "Settings.json": {
      "definition": "Configuration file for Claude Code environment: agent defaults, tool settings, behavior tuning.",
      "domains": ["configuration", "environment-setup"],
      "generic_example": "settings.json: max_tokens_per_generation, default_model, tool_timeout, log_level, etc.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/configuration",
      "often_paired_with": ["CLAUDE.md", "Hooks", "Permissions"]
    },
    
    "GitHub Actions": {
      "definition": "Workflow automation on GitHub: trigger Claude Code agents on push, PR, etc.",
      "domains": ["ci-cd", "automation", "devops"],
      "generic_example": "GitHub Actions workflow: on PR, run code-review skill → add comments on issues found.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/github-actions",
      "often_paired_with": ["Terminal CLI", "Code Execution", "Tool Use"]
    },
    
    "Slack Integration": {
      "definition": "Connect Claude agents to Slack for chat-based automation and notifications.",
      "domains": ["team-automation", "notifications", "chat-ops"],
      "generic_example": "Slack: @claude-brand create marketing assets → agent runs, posts results to channel.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/slack-integration",
      "often_paired_with": ["Slash Commands", "Tool Use", "Background Tasks"]
    },
    
    "Headless Mode": {
      "definition": "Run Claude Code without GUI, purely via API/CLI for programmatic use.",
      "domains": ["automation", "scripting", "batch-processing"],
      "generic_example": "Programmatically invoke Claude Code: no UI, just input → computation → output.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/headless-mode",
      "often_paired_with": ["Terminal CLI", "Agent SDK", "Background Tasks"]
    },
    
    "Git Worktrees": {
      "definition": "Work on multiple branches simultaneously without context switching.",
      "domains": ["parallel-development", "testing-refactoring"],
      "generic_example": "Worktree 1: refactoring + tests. Worktree 2: new feature. No conflicts, parallel progress.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/git-worktrees",
      "often_paired_with": ["Code Execution", "Terminal CLI", "Inline Diffs"]
    },
    
    "Code Execution": {
      "definition": "Run code (Python, Node, bash) directly in Claude Code environment and see output in real-time.",
      "domains": ["testing", "validation", "prototyping"],
      "generic_example": "Write a refactored function, execute tests immediately, see results—iterate until tests pass.",
      "reference": "https://docs.claude.com/en/docs/build-with-claude/code-execution",
      "often_paired_with": ["Checkpoints", "Inline Diffs", "Terminal CLI"]
    }
  }
}
```

### ✅ Checkpoint: A2.2 Complete
- [ ] `concept-descriptions.json` created with all 30 concepts
- [ ] Each concept has: definition, domains, example, reference, often_paired_with
- [ ] All definitions are 1-2 sentences (concise)
- [ ] All examples are skill-agnostic (will be customized per skill)
- [ ] No syntax errors in JSON
- [ ] Update ENHANCEMENT_STATUS.json:
  ```json
  "A2_template_development": {
    "status": "COMPLETE",
    "template_created": true,
    "concept_library_created": true,
    "completed": "2026-02-XX"
  }
  ```

**If you stop here:** Both template and concept library are ready. Resume at Phase A3 (Batch Enhancement).

---

## PHASE A2 COMPLETE CHECKLIST

Before moving to Phase A3, ensure:

- [ ] `tier-1-enhancement-template.md` exists and has all sections
- [ ] `concept-descriptions.json` has all 30 concepts with definitions
- [ ] Both files tested for JSON/markdown syntax
- [ ] Template customization instructions are clear
- [ ] Concept library is indexed and searchable
- [ ] ENHANCEMENT_STATUS.json updated for A2

**If ALL ✓, you're ready for Phase A3 (Batch Enhancement).**

---

## RESUMPTION FROM PHASE A2

### If Stopped During A2.1 (Template Creation)
```
1. Open tier-1-enhancement-template.md
2. Review: has all required sections?
3. If missing: add them
4. Test: can you fill placeholders?
5. Mark A2.1 COMPLETE
6. Move to A2.2 (Concept Library)
```

### If Stopped During A2.2 (Concept Library)
```
1. Open concept-descriptions.json
2. Find last concept with complete definition
3. Resume from next concept
4. Ensure: all 30 concepts defined
5. Mark A2.2 COMPLETE
6. Ready for Phase A3
```

---

**PHASE A2 END**

Next phase: A3 - Batch Enhancement  
Location: See PHASE_A3_RUNBOOK.md (coming next)
