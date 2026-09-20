---
name: skill-reminder
description: Helps build and debug skill reminder processes. Analyzes your task and suggests which skills from your library would be most helpful. Use when starting a new task or unsure which existing skills apply to your current work.
---

# Claude Code Essentials for Skill Reminder

The skill-reminder skill reaches its full power when paired with Claude Code's native capabilities. As a meta-skill that helps you discover and invoke other skills from your library, it benefits enormously from Claude Code's slash command system, context awareness, and agent orchestration features. Understanding these concepts transforms skill discovery from a manual lookup into an intelligent, context-aware recommendation engine.

## Why These 12 Concepts Matter

Think of these concepts as three layers of a skill discovery system. The **core layer** (Skills, Slash Commands, CLAUDE.md) gives you the foundation for organizing and invoking skills. The **intelligence layer** (Plan Mode, Context Window, Compaction, Tool Use) lets Claude analyze your task deeply and match it to the right skills. The **orchestration layer** (Subagents, MCP Server, Hooks, Permissions, Settings.json) enables automated, multi-skill workflows that chain together seamlessly.

## The 12 Concepts

### 1. Skills
**What it is:** Reusable markdown files containing specialized instructions that Claude can invoke via slash commands.
**Why it matters for skill-reminder:** Skills are the fundamental building blocks this skill helps you discover. Each skill in your library is a SKILL.md file with frontmatter metadata that the reminder system uses to match tasks to capabilities.
**Example:**
```bash
# Your skills library structure
ls _master-skills/technical/
# code-refactor/SKILL.md    backend-development/SKILL.md
# code-transfer/SKILL.md    frontend-development/SKILL.md
# Each SKILL.md has name + description frontmatter for matching
```

---

### 2. Slash Commands
**What it is:** Quick shortcuts (e.g., /commit, /review-pr) that invoke predefined skills or workflows.
**Why it matters for skill-reminder:** Once the reminder identifies the right skill, slash commands provide instant invocation. Custom commands in `.claude/commands/` can wrap skill-reminder itself, making discovery a single keystroke away.
**Example:**
```bash
# Create a custom slash command for skill discovery
# .claude/commands/find-skill.md
# "Analyze my current task and suggest the best skills from the library.
#  Consider the files I have open and recent conversation context."

# Then invoke with:
# /find-skill
```

---

### 3. CLAUDE.md
**What it is:** A configuration file that provides project context, coding conventions, and instructions to Claude Code automatically.
**Why it matters for skill-reminder:** CLAUDE.md can pre-load your skill library catalog so Claude always knows what skills are available. It can also define project-specific skill preferences, ensuring recommendations align with your team's toolchain.
**Example:**
```markdown
# CLAUDE.md
## Available Skills Library
- Use /code-refactor for renaming, pattern replacement
- Use /backend-development for API and database work
- Use /frontend-development for React/TypeScript components
- Prefer /test-fixing after any refactoring task
- Always suggest /code-auditor before PR submission
```

---

### 4. Plan Mode
**What it is:** A mode where Claude explores and plans before making changes, creating a step-by-step implementation strategy for approval.
**Why it matters for skill-reminder:** For complex tasks that span multiple domains, Plan Mode lets Claude analyze the full scope before recommending skills. Instead of suggesting one skill, it can propose a sequenced workflow of 3-5 skills with dependencies mapped out.
**Example:**
```
User: "I need to rebuild our authentication system with OAuth 2.0"

Claude (Plan Mode):
1. /backend-development - Design OAuth 2.0 flow and token management
2. /api-development - Define auth endpoints and response contracts
3. /code-refactor - Update all existing auth calls to new endpoints
4. /test-fixing - Fix broken tests after auth migration
5. /frontend-development - Update login components and token handling

Approve this skill sequence? [Y/n]
```

---

### 5. Context Window
**What it is:** The amount of text Claude can see and reason about at once (200K tokens).
**Why it matters for skill-reminder:** With 200K tokens, Claude can hold your entire skill library catalog in context simultaneously, enabling accurate cross-referencing. It can read multiple SKILL.md files at once to compare which best fits your task rather than guessing from names alone.
**Example:**
```bash
# Claude can read and compare multiple skills at once
# "Read all 6 technical skills and tell me which ones apply
#  to migrating a monolith to microservices"
# Claude reads all SKILL.md files, cross-references content,
# and recommends the 3 most relevant with specific sections cited
```

---

### 6. Compaction
**What it is:** Automatic compression of conversation history when approaching context limits, summarizing earlier context to free space for new work.
**Why it matters for skill-reminder:** During long sessions where you invoke multiple skills sequentially, compaction preserves the key decisions and skill recommendations from earlier in the conversation while freeing tokens for new skill execution.
**Example:**
```
# Long session flow:
# 1. Skill-reminder suggests /backend-development (executed, compacted)
# 2. Skill-reminder suggests /api-development (executed, compacted)
# 3. Now suggesting /test-fixing -- Claude still remembers the
#    API contracts designed in step 2, even though details were compacted
```

---

### 7. Tool Use
**What it is:** Claude's ability to call external tools like file editors, terminal commands, web searches, and MCP servers.
**Why it matters for skill-reminder:** Tool Use lets Claude actively scan your skill library filesystem to find matching skills rather than relying on a static list. It can Grep through SKILL.md descriptions, read frontmatter, and dynamically build recommendations based on actual file content.
**Example:**
```bash
# Claude uses tools to find relevant skills dynamically
Grep(pattern="database|SQL|migration", path="_master-skills/",
     glob="**/SKILL.md", output_mode="files_with_matches")
# Returns: backend-development, api-development, code-refactor
# Claude then reads each to verify relevance before recommending
```

---

### 8. Subagents
**What it is:** Specialized child agents spawned by Claude to handle specific subtasks in parallel or sequence.
**Why it matters for skill-reminder:** After recommending multiple skills, Claude can spawn subagents to execute them in parallel. A research subagent can scan the codebase while a planning subagent drafts the implementation strategy, both feeding results back to the main recommendation.
**Example:**
```
# User asks: "Set up a new microservice with tests and CI/CD"
# Claude spawns parallel subagents:
#   Subagent 1: Reads /backend-development SKILL.md
#   Subagent 2: Reads /github-actions-templates SKILL.md
#   Subagent 3: Scans existing project structure
# All three report back -> Claude synthesizes a unified recommendation
```

---

### 9. MCP Server
**What it is:** A service that exposes tools and data to Claude via the MCP protocol, extending Claude's capabilities.
**Why it matters for skill-reminder:** An MCP server can expose your skill library as a searchable API, enabling Claude to query skills by category, keyword, or capability without reading every file. This scales skill discovery to libraries with hundreds of skills.
**Example:**
```json
{
  "mcpServers": {
    "skill-library": {
      "command": "node",
      "args": ["skill-server.js"],
      "tools": ["search_skills", "get_skill_details", "list_categories"]
    }
  }
}
// Claude calls: search_skills({query: "refactoring", category: "technical"})
// Returns: [{name: "code-refactor", relevance: 0.95}, ...]
```

---

### 10. Hooks
**What it is:** Shell commands that execute automatically before/after Claude Code events like tool calls, notifications, or session start.
**Why it matters for skill-reminder:** A session-start hook can automatically trigger skill-reminder analysis based on the current working directory and recent git changes, proactively suggesting relevant skills before you even ask.
**Example:**
```json
{
  "hooks": {
    "SessionStart": [{
      "command": "python analyze_context.py --dir . --output skill-suggestions.json",
      "description": "Auto-suggest skills based on current project context"
    }]
  }
}
// On session start, Claude reads skill-suggestions.json and says:
// "Based on your recent changes to auth/, I suggest /backend-development"
```

---

### 11. Permissions
**What it is:** Access control model with three levels: Allow (automatic), Ask (user confirmation), Deny (blocked).
**Why it matters for skill-reminder:** Permissions ensure that when skill-reminder triggers skill invocation, each skill operates within safe boundaries. File reads for discovery are auto-allowed, while destructive operations from invoked skills require confirmation.
**Example:**
```json
{
  "permissions": {
    "Read": "Allow",
    "Grep": "Allow",
    "Edit": "Ask",
    "Bash": "Ask"
  }
}
// Skill discovery (Read + Grep) runs automatically
// Skill execution (Edit + Bash) prompts for approval
```

---

### 12. Settings.json
**What it is:** Configuration file (~/.claude/settings.json) for Claude Code defaults: permissions, allowed tools, environment preferences.
**Why it matters for skill-reminder:** Settings.json can define default skill library paths, preferred skill categories, and auto-approval rules that streamline the discovery-to-execution pipeline across all your projects.
**Example:**
```json
{
  "env": {
    "SKILL_LIBRARY_PATH": "D:/02_Development/Skills/_master-skills",
    "DEFAULT_SKILL_CATEGORIES": "technical,operations"
  },
  "permissions": {
    "allow": ["Read", "Grep"],
    "ask": ["Edit", "Bash"]
  }
}
```

---

## How These Concepts Work Together

When you ask "What skills should I use for this task?", Claude Code orchestrates a sophisticated discovery pipeline. First, **CLAUDE.md** provides the baseline catalog of available skills. **Tool Use** lets Claude actively scan your skill library with Grep and Read to find matches beyond the static list. The **Context Window** holds multiple SKILL.md files simultaneously for accurate comparison. **Plan Mode** sequences multi-skill recommendations for complex tasks. **Slash Commands** provide instant invocation once a skill is chosen. **Subagents** can execute multiple skills in parallel, while **Hooks** can proactively trigger recommendations at session start. **Compaction** ensures long multi-skill sessions stay productive, and **Permissions** keep everything safe.

### Quick Workflow
1. Session starts -- Hook analyzes project context and pre-loads suggestions
2. You describe your task -- Claude uses Tool Use to search SKILL.md files
3. Plan Mode analyzes task complexity -- single skill or multi-skill sequence
4. Claude recommends 2-5 skills with reasoning from Context Window analysis
5. You approve -- Slash Commands invoke the chosen skill instantly
6. For multi-skill tasks, Subagents execute in parallel where possible
7. Compaction preserves decisions as you move through the skill sequence

## Next Steps

- **Beginner:** Start by adding your skill catalog to CLAUDE.md so Claude always knows what is available
- **Intermediate:** Create custom slash commands in `.claude/commands/` for your most common skill discovery patterns
- **Advanced:** Build an MCP server that exposes your full skill library as a searchable API

**See also:** code-refactor, code-transfer, backend-development, feature-planning, create-agent-skills

<objective>
Help you discover and leverage relevant skills from your Claude skills library by analyzing your task description and matching it against available skills.
</objective>

<quick_start>
**Usage:**
```
"I need to [describe your task]"
"What skills should I use for [task]?"
"Help me find the right skill for [problem]"
```

Claude will analyze your request and suggest 2-5 relevant skills to use.
</quick_start>

<process>
## Core Workflow

## Step 1: Understand the Task

Ask the user what they're trying to accomplish:
- What's the goal?
- What type of work? (coding, writing, data, design, etc.)
- What deliverables are needed?

If they already provided context, skip to Step 2.

## Step 2: Analyze Task Type

Categorize the task into domains:

**Development:**
- Frontend (React, Vue, Svelte, HTML/CSS)
- Backend (API, database, auth, deployment)
- Full-stack (Next.js, integration)
- Mobile (iOS, Android)
- DevOps (Docker, CI/CD, deployment)

**Security:**
- AppSec (OWASP, input validation, secrets)
- Threat modeling (STRIDE, attack surface)
- Compliance (SOC2, GDPR, HIPAA)

**Content & Design:**
- Documents (docx, pdf, xlsx, pptx)
- Design (frontend, UI/UX, responsive)
- Graphics (production assets, brand systems)

**Planning & Process:**
- Project planning (roadmaps, milestones)
- Feature planning (breakdown, implementation)
- Documentation (technical docs, ADRs)

**Automation & Integration:**
- Workflow automation (n8n, Zapier, Make)
- AI agents (LangChain, CrewAI, MCP)
- API integration

**Analysis & Research:**
- Code analysis (audit, refactor)
- Data analysis (CSV, JSON, visualization)
- User research

## Step 3: Match to Skills

Based on task type, suggest relevant skills:

### Document Creation
→ **docx**, **pdf**, **pptx**, **xlsx** skills

### Web Development
→ **frontend-design**, **responsive-design-patterns**, **animation-motion-design**, **ui-component-library**

### Professional Design
→ **professional-web-design**, **production-graphics**, **design-system-builder**, **advanced-visual-design**

### Security & Compliance
→ **staff-engineer-v3** (includes AppSec), **error-tracking** (Sentry)

### Development Workflows
→ **backend-dev-guidelines**, **frontend-dev-guidelines**, **test-fixing**, **git-pushing**

### Planning & Architecture
→ **create-plans**, **feature-planning**, **architecture-diagram-creator**, **flowchart-creator**, **timeline-creator**

### Technical Documentation
→ **technical-doc-creator**, **codebase-documenter**, **internal-comms**

### Automation
→ **workflow-automation**, **ai-agents-workflow**, **mcp-builder**

### Code Quality
→ **code-auditor**, **code-refactor**, **code-transfer**, **debug-like-expert**

### Project Setup
→ **project-bootstrapper**, **create-slash-commands**, **create-subagents**, **create-agent-skills**

### Meta/Tools
→ **skill-packager**, **skill-creator**, **conversation-analyzer**, **build-macos-apps**, **build-iphone-apps**

## Step 4: Provide Recommendations

Format response as:

```
Based on your task to [restate task], I recommend these skills:

1. **skill-name** - Why it's relevant
2. **skill-name** - Why it's relevant
3. **skill-name** - Why it's relevant

Would you like me to use any of these skills now?
```

## Step 5: Invoke if Requested

If user says "yes" or names a skill:
- Read the appropriate SKILL.md from references/
- Follow that skill's workflow
- Complete the task using the skill's guidance

</process>

<skill_categories>
## Available Skill Categories

### 📝 Document Creation
- docx, pdf, pptx, xlsx
- production-graphics, canvas-design

### 💻 Development
- frontend-dev-guidelines, backend-dev-guidelines
- frontend-design, responsive-design-patterns
- ui-component-library, animation-motion-design

### 🔒 Security & Quality
- staff-engineer-v3 (AppSec + Platform)
- error-tracking, code-auditor
- test-fixing, debug-like-expert

### 📊 Planning & Architecture
- create-plans, feature-planning
- architecture-diagram-creator
- flowchart-creator, timeline-creator

### 📚 Documentation
- technical-doc-creator
- codebase-documenter
- internal-comms

### 🤖 Automation & AI
- workflow-automation
- ai-agents-workflow
- mcp-builder

### 🛠️ Tools & Meta
- skill-packager, skill-creator
- create-agent-skills
- conversation-analyzer

### 📱 Platform-Specific
- build-macos-apps
- build-iphone-apps
- webapp-testing

### 🎨 Design Systems
- design-system-builder
- advanced-visual-design
- advanced-ux-patterns
- professional-web-design

### 🔄 Code Operations
- code-refactor, code-transfer
- git-pushing, review-implementing
- file-operations

</skill_categories>

<matching_rules>
## Keyword → Skill Matching

**Keywords → Suggested Skills:**

- "document", "report", "memo" → docx, internal-comms
- "spreadsheet", "data", "CSV" → xlsx, code-execution
- "presentation", "slides" → pptx, canvas-design
- "PDF", "form" → pdf

- "frontend", "React", "UI" → frontend-dev-guidelines, frontend-design
- "backend", "API", "database" → backend-dev-guidelines, error-tracking
- "responsive", "mobile-first" → responsive-design-patterns
- "animation", "motion" → animation-motion-design

- "secure", "security", "OWASP" → staff-engineer-v3
- "audit", "review" → code-auditor
- "test", "failing tests" → test-fixing
- "debug", "error" → debug-like-expert, error-tracking

- "plan", "roadmap", "milestone" → create-plans, feature-planning
- "architecture", "system design" → architecture-diagram-creator
- "flowchart", "process" → flowchart-creator
- "timeline", "Gantt" → timeline-creator

- "documentation", "API docs" → technical-doc-creator
- "explain codebase" → codebase-documenter
- "team update", "status" → internal-comms

- "automation", "workflow" → workflow-automation, ai-agents-workflow
- "agent", "AI orchestration" → ai-agents-workflow
- "MCP", "server" → mcp-builder

- "package skill", "zip" → skill-packager
- "create skill", "new skill" → create-agent-skills, skill-creator
- "analyze chats" → conversation-analyzer

- "macOS app", "Swift" → build-macos-apps
- "iPhone app", "iOS" → build-iphone-apps
- "web testing", "Playwright" → webapp-testing

- "design system", "tokens" → design-system-builder
- "visual design", "typography" → advanced-visual-design
- "UX", "accessibility" → advanced-ux-patterns
- "professional web" → professional-web-design

- "refactor", "rename" → code-refactor
- "copy code", "move code" → code-transfer
- "commit", "push" → git-pushing
- "PR feedback", "review comments" → review-implementing

</matching_rules>

<success_criteria>
Task complete when:
- [ ] User's task is understood
- [ ] Task categorized into domain(s)
- [ ] 2-5 relevant skills suggested
- [ ] Clear explanation of why each skill fits
- [ ] User asked if they want to use suggested skills
- [ ] If yes, appropriate skill invoked and task completed
</success_criteria>

<examples>
## Example Interactions

**Example 1: Document Creation**
```
User: "I need to create a quarterly business review presentation"
Assistant: Based on your task to create a quarterly business review presentation, I recommend:

1. **pptx** - Create professional PowerPoint presentations with charts and data
2. **canvas-design** - Design visual elements like cover slides and infographics
3. **xlsx** - Build supporting spreadsheets with financial data

Would you like me to use the pptx skill to start your presentation?
```

**Example 2: Web Development**
```
User: "Build a responsive landing page with smooth animations"
Assistant: Based on your task to build a responsive landing page with animations, I recommend:

1. **frontend-design** - Create professional frontend with modern design patterns
2. **responsive-design-patterns** - Implement mobile-first responsive layouts
3. **animation-motion-design** - Add smooth, performant animations and transitions

Would you like me to use these skills to start building?
```

**Example 3: Security Review**
```
User: "Review this API for security issues"
Assistant: Based on your task to review an API for security issues, I recommend:

1. **staff-engineer-v3** - Comprehensive AppSec review with OWASP compliance
2. **code-auditor** - Systematic code quality and security analysis
3. **backend-dev-guidelines** - Check against backend best practices

Would you like me to use the staff-engineer-v3 skill to perform the security audit?
```

</examples>

<notes>
- This skill acts as a "meta-skill" to help discover other skills
- Best used at start of new tasks or when stuck
- Can be combined with other skills in workflows
- Regularly updated as new skills are added to library
</notes>
