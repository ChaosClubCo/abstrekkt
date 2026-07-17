---
name: conversation-analyzer
description: Analyzes your Claude Code conversation history to identify patterns, common mistakes, and opportunities for workflow improvement. Use when user wants to understand usage patterns, optimize workflow, identify automation opportunities, or check if they're following best practices.
---

# Claude Code Essentials for Conversation Analyzer

Conversation analysis in Claude Code goes far beyond reading logs -- it means leveraging the full agent toolkit to parse history files, identify automation opportunities, and translate findings into concrete workflow improvements. These 12 concepts give you the power to build a self-improving feedback loop: analyze how you use Claude Code, then use Claude Code to fix the gaps.

## Why These 12 Concepts Matter

Think of these concepts as three toolkits working together:

**Core Analysis Tools** -- Context Window, Tool Use, Terminal CLI, and Code Execution form the foundation for ingesting and processing conversation history at scale.

**Automation Enablers** -- CLAUDE.md, Slash Commands, Hooks, and Headless Mode let you turn analysis findings into automated workflows that prevent repeated mistakes.

**Advanced Orchestration** -- Subagents, Plan Mode, MCP Servers, and Checkpoints handle the complexity of multi-dimensional analysis across hundreds of conversations.

## The 12 Concepts

### 1. Context Window

**What it is:** The amount of text Claude can see and reason about at once (200K tokens).

**Why it matters for conversation analysis:** History files like `~/.claude/history.jsonl` can contain thousands of entries. The 200K token context window lets you load substantial chunks of conversation history in a single pass, enabling pattern detection across hundreds of sessions without losing earlier context.

**Example:**
```bash
# Load a large history file for comprehensive analysis
# 200K tokens can hold roughly 500-800 conversation entries
claude -p "Read ~/.claude/history.jsonl and identify the top 10
  most repeated request patterns across all sessions"
```

---

### 2. Tool Use

**What it is:** Claude's ability to call external tools like file editors, terminal commands, web searches, and MCP servers.

**Why it matters for conversation analysis:** Analyzing conversations requires reading history files (Read), running Python analysis scripts (Bash), searching for patterns (Grep), and writing reports (Write). Tool Use is the mechanism that lets Claude orchestrate all of these in a single analysis session.

**Example:**
```python
# Claude uses multiple tools in sequence during analysis:
# 1. Read tool: Load history.jsonl
# 2. Bash tool: Run analyze_history.py
# 3. Grep tool: Search for specific error patterns
# 4. Write tool: Generate recommendations.txt

# The analysis script itself uses tool-like operations
import json
from pathlib import Path

history = Path("~/.claude/history.jsonl").expanduser()
entries = [json.loads(line) for line in history.read_text().splitlines()]
# Tool Use enables this entire pipeline
```

---

### 3. Terminal CLI

**What it is:** Command-line interface for running Claude Code directly in your terminal for coding tasks.

**Why it matters for conversation analysis:** The CLI is how you invoke the conversation analyzer itself. Whether running interactively or piping history data through analysis scripts, Terminal CLI is the entry point for all analysis workflows.

**Example:**
```bash
# Interactive analysis session
claude
> /conversation-analyzer

# Quick one-shot analysis
claude -p "Analyze my last 50 conversations and list repeated tasks"

# Pipe history through a custom analyzer
claude -p "$(cat ~/.claude/history.jsonl | tail -100)" \
  "What patterns do you see in these recent sessions?"
```

---

### 4. Code Execution

**What it is:** Claude's ability to run code (via Bash tool) directly in your environment, executing tests, builds, and scripts in real-time.

**Why it matters for conversation analysis:** The analyze_history.py script needs to run in real-time to parse JSON, compute statistics, and generate reports. Code Execution lets Claude run this analysis immediately and iterate on findings without manual intervention.

**Example:**
```bash
# Claude executes the analysis script and reads results immediately
python3 scripts/analyze_history.py --last 200

# Then iterates based on what it finds
python3 -c "
import json
from collections import Counter

with open('conversation_analysis.txt') as f:
    data = f.read()
# Drill deeper into any surprising patterns
print('Top error categories:', data[:500])
"
```

---

### 5. CLAUDE.md

**What it is:** A configuration file that provides project context, coding conventions, and instructions to Claude Code automatically.

**Why it matters for conversation analysis:** When the analyzer discovers patterns (e.g., "you always forget to run tests before committing"), those findings can be codified into CLAUDE.md rules. This closes the feedback loop -- analysis becomes prevention.

**Example:**
```markdown
# CLAUDE.md -- Rules derived from conversation analysis

## Discovered Patterns (from conversation-analyzer)
- Always run `npm test` before suggesting a commit
- When working in src/api/, check for rate limiting
- User prefers TypeScript strict mode -- never suggest `any` types
- Common mistake: forgetting to update .env.example after adding env vars

## Automation Reminders
- Test failures in auth module recur weekly -- suggest test-fixing skill
- Large PRs (>400 lines) correlate with review delays -- suggest splitting
```

---

### 6. Slash Commands

**What it is:** Quick shortcuts (e.g., /commit, /review-pr) that invoke predefined skills or workflows.

**Why it matters for conversation analysis:** The analyzer identifies repetitive tasks that should become slash commands. When you discover you type the same 3-step request 8 times, that becomes a candidate for a custom `/my-workflow` command.

**Example:**
```bash
# Analysis reveals: "User runs lint + test + commit 12 times/week"
# Create a custom slash command:

# .claude/commands/check-and-commit.md
# Runs lint, tests, and commits if clean
# Usage: /check-and-commit "commit message"

# Now the 3-step manual process becomes:
claude
> /check-and-commit "fix auth token refresh"
```

---

### 7. Hooks

**What it is:** Shell commands that execute automatically before/after Claude Code events like tool calls, notifications, or session start.

**Why it matters for conversation analysis:** Hooks can automatically log conversation metadata for later analysis. A PostToolUse hook can record which tools are used most, which files are edited repeatedly, and which commands fail -- feeding richer data back into the analyzer.

**Example:**
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": ".*",
      "command": "python3 scripts/log_tool_usage.py --tool $TOOL_NAME --session $SESSION_ID",
      "description": "Log tool usage for conversation analysis"
    }],
    "SessionStart": [{
      "command": "python3 scripts/log_session_start.py --session $SESSION_ID",
      "description": "Track session start times for time-of-day analysis"
    }]
  }
}
```

---

### 8. Headless Mode

**What it is:** Run Claude Code non-interactively via CLI flags (-p/--print) for scripting, CI/CD, and automation pipelines.

**Why it matters for conversation analysis:** Scheduled analysis runs can happen in headless mode -- a daily cron job that analyzes yesterday's conversations and emails a summary, or a weekly report that tracks productivity trends.

**Example:**
```bash
# Daily automated analysis via cron
# crontab entry: 0 9 * * * /path/to/daily-analysis.sh

#!/bin/bash
claude -p "Analyze conversations from the last 24 hours in
  ~/.claude/history.jsonl. Focus on: repeated requests,
  error patterns, and automation opportunities.
  Output as JSON." --output-format json > /tmp/daily-analysis.json

# Parse and send summary
python3 scripts/send_analysis_email.py /tmp/daily-analysis.json
```

---

### 9. Subagents

**What it is:** Specialized child agents spawned by Claude to handle specific subtasks in parallel or sequence.

**Why it matters for conversation analysis:** Multi-dimensional analysis benefits from parallelism. One subagent can analyze error patterns while another tallies request types and a third identifies time-of-day distributions -- all working simultaneously on different slices of the history data.

**Example:**
```bash
# Claude spawns parallel subagents for analysis dimensions:

# Subagent 1: Error pattern analysis
claude -p "Read ~/.claude/history.jsonl and extract all error-related
  conversations. Categorize by error type and frequency."

# Subagent 2: Request type distribution
claude -p "Read ~/.claude/history.jsonl and categorize each conversation
  by type: bug-fix, feature, refactor, query, testing, other."

# Subagent 3: Automation opportunity detection
claude -p "Read ~/.claude/history.jsonl and find requests that appear
  3+ times with similar wording. These are automation candidates."
```

---

### 10. Plan Mode

**What it is:** A mode where Claude explores and plans before making changes, creating a step-by-step implementation strategy for approval.

**Why it matters for conversation analysis:** Before diving into 200+ conversations, Plan Mode lets you define the analysis strategy: which dimensions to prioritize, what thresholds matter, and how to structure the output. This prevents wasted analysis time on low-value dimensions.

**Example:**
```markdown
## Analysis Plan (Plan Mode output)

1. **Load & Validate** -- Read history.jsonl, check format, count entries
2. **Categorize** -- Tag each conversation by type (bug/feature/refactor/query)
3. **Pattern Detection** -- Find repeated requests (>2 occurrences)
4. **Error Analysis** -- Extract error keywords, group by category
5. **Time Analysis** -- Map conversations to hour-of-day, find peak windows
6. **Recommendations** -- Rank findings by impact, suggest automations
7. **Report** -- Generate structured output with examples

Estimated tokens: ~80K for 200 conversations
Proceed with this plan? [Y/n]
```

---

### 11. MCP Servers

**What it is:** A service that exposes tools and data to Claude via the MCP protocol, extending Claude's capabilities.

**Why it matters for conversation analysis:** An MCP server can expose conversation history as a queryable data source, letting Claude run structured queries against session data rather than parsing raw JSONL. This enables richer analysis like cross-session trend tracking and team-wide pattern aggregation.

**Example:**
```typescript
// MCP server exposing conversation history as queryable resource
const server = new MCPServer({
  tools: [{
    name: "query_conversations",
    description: "Query conversation history with filters",
    parameters: {
      dateRange: { type: "string" },
      type: { type: "string", enum: ["bug", "feature", "refactor"] },
      project: { type: "string" }
    },
    handler: async ({ dateRange, type, project }) => {
      // Query structured conversation database
      return db.conversations.find({ dateRange, type, project });
    }
  }]
});
```

---

### 12. Checkpoints

**What it is:** Git-based snapshots of progress that let you undo changes and restore to a known good state.

**Why it matters for conversation analysis:** When analysis findings lead to workflow changes (new CLAUDE.md rules, new hooks, new slash commands), checkpoints let you try those changes safely. If a new hook causes problems, revert to the checkpoint before the change.

**Example:**
```bash
# Analysis recommends adding 3 new hooks and updating CLAUDE.md
# Claude creates a checkpoint before making changes

git stash  # Checkpoint current state

# Apply analysis recommendations
# ... add hooks, update CLAUDE.md, create slash commands ...

# If something breaks:
git stash pop  # Revert to pre-analysis state

# If everything works:
git add -A && git commit -m "Apply conversation analysis recommendations"
```

---

## How These Concepts Work Together

In a typical conversation analysis workflow, the pieces connect like this:

You invoke the analyzer via **Terminal CLI** or a **Slash Command** (`/conversation-analyzer`). Claude enters **Plan Mode** to define the analysis strategy, then uses **Code Execution** to run the analysis script against your history file. The **Context Window** holds enough history data for comprehensive pattern detection, while **Tool Use** coordinates reading files, running scripts, and writing reports.

When the analyzer discovers repeated tasks, it recommends creating **Slash Commands**. When it finds recurring mistakes, it suggests **CLAUDE.md** rules. **Hooks** can be set up to automatically log richer metadata for future analysis. For scheduled analysis, **Headless Mode** enables cron-based automation. **Subagents** parallelize multi-dimensional analysis, and **MCP Servers** can provide structured query access to history data. Throughout, **Checkpoints** ensure that any workflow changes recommended by the analysis can be safely tested and reverted.

### Quick Workflow

1. **Invoke** -- `/conversation-analyzer` or `claude -p "analyze my conversations"`
2. **Plan** -- Define analysis dimensions and thresholds
3. **Execute** -- Run analysis scripts, parse history, compute statistics
4. **Discover** -- Identify patterns, repeated tasks, common errors
5. **Recommend** -- Suggest slash commands, CLAUDE.md rules, hooks
6. **Apply** -- Implement recommendations with checkpoint safety
7. **Automate** -- Schedule recurring analysis via headless mode

## Next Steps

Once you have mastered conversation analysis with these concepts, explore related skills:

- **skill-developer** -- Turn analysis findings into new Claude Code skills
- **project-bootstrapper** -- Set up the tooling infrastructure analysis recommends
- **debug-like-expert** -- Apply systematic investigation to the errors your analysis uncovers

Progress from reactive analysis (what happened) to proactive prevention (stop it from happening again) by combining conversation-analyzer findings with CLAUDE.md rules, hooks, and custom slash commands.

# Conversation Analyzer

Analyzes your Claude Code conversation history to identify patterns, common mistakes, and workflow improvement opportunities.

## When to Use

- "analyze my conversations"
- "review my Claude Code history"
- "what patterns do you see in my usage"
- "how can I improve my workflow"
- "am I using Claude Code effectively"

## What It Analyzes

1. **Request type distribution** (bug fixes, features, refactoring, queries, testing)
2. **Most active projects**
3. **Common error keywords**
4. **Time-of-day patterns**
5. **Repetitive tasks** (automation opportunities)
6. **Vague requests** causing back-and-forth
7. **Complex tasks** attempted without planning
8. **Recurring bugs/errors**

## Analysis Scope

Default: **Last 200 conversations** for recency and relevance.

## Methodology

### 1. Request Type Distribution
Categorizes by: bug fixes, feature additions, refactoring, information queries, testing, other.

### 2. Project Activity
Tracks which projects consume most time, identifies project-specific patterns.

### 3. Time Patterns
Hour-of-day usage distribution, identifies peak productivity times.

### 4. Common Mistakes
- **Vague requests**: Initial requests lacking context vs. acceptable follow-ups
- **Repeated fixes**: Same issues occurring multiple times
- **Complex tasks**: Multi-step requests without planning
- **Repetitive commands**: Manual tasks that could be automated

### 5. Error Analysis
Frequency of error-related requests, common error keywords, recurring problems.

### 6. Automation Opportunities
Identifies repeated exact requests, suggests skills, slash commands, or scripts.

## Output

Structured report with:
- **Statistics**: Request types, active projects, timing patterns
- **Patterns**: Common tasks, repetitive commands, complexity indicators
- **Issues**: Specific problems with examples
- **Recommendations**: Prioritized, actionable improvements

## Tools Used

- **Read**: Load history file (`~/.claude/history.jsonl`)
- **Write**: Create analysis reports if requested
- **Bash**: Execute Python analysis script
- **Direct analysis**: Parse JSON programmatically

## Analysis Script

Uses `scripts/analyze_history.py` for comprehensive analysis:

**Capabilities:**
- Loads and parses `~/.claude/history.jsonl`
- Analyzes patterns across multiple dimensions
- Identifies common mistakes and inefficiencies
- Generates actionable recommendations
- Outputs detailed reports

**Usage within skill:**
Runs automatically when user requests analysis.

**Standalone usage:**
```bash
cd ~/.claude/plugins/*/productivity-skills/conversation-analyzer/scripts
python3 analyze_history.py
```

Outputs:
- `conversation_analysis.txt` - Detailed pattern analysis
- `recommendations.txt` - Specific improvement suggestions

## Example Output

```
Analyzed last 200 conversations:
- 60% general tasks, 15% bug fixes, 13% feature additions
- Project "ultramerge" dominates 58% of activity
- Same test-fixing request made 8 times
- 19 multi-step requests without planning
- Peak productivity: 13:00-15:00

Recommendations:
- Use test-fixing skill for recurring test failures
- Create project-specific utilities for ultramerge
- Use feature-planning skill for complex requests
- Add tests to prevent recurring bugs
- Schedule complex work during peak hours
```

## Success Criteria

- User understands usage patterns
- Concrete, actionable recommendations
- Specific examples from history
- Prioritized by impact (quick wins vs long-term)
- User can immediately apply improvements

## Integration

- **feature-planning**: Implement recommended improvements
- **test-fixing**: Address recurring test failures
- **git-pushing**: Commit workflow improvements

## Privacy Note

All analysis happens locally. Conversation history never leaves user's machine.
