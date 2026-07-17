# Claude Certified Architect – Foundations
## Kyle's Honest Study Plan
> Built from the actual official exam guide. No padding.

---

## The Real Talk First

This exam doesn't test whether you've *heard* of things.
It tests whether you've *been burned by* them in production.

Every sample question follows the same pattern:
> "Your agent is doing X in production. Which change fixes the actual root cause?"

Three of the four wrong answers are things that *sound right* to someone who hasn't shipped it.
Your production experience across Intinc, the Customization Service, and Kinsley is your biggest advantage — if you've actually hit these failure modes, you'll recognize them on sight.

What this means: don't study like a student memorizing definitions.
Study like an engineer reviewing post-mortems.

---

## Domain Breakdown + Honest Self-Assessment

### Domain 1: Agentic Architecture & Orchestration — 27% of exam
*The biggest domain. Where the exam is won or lost.*

What it covers:
- Agentic loop lifecycle: `stop_reason` ("tool_use" vs "end_turn"), tool result appending
- Multi-agent coordinator-subagent patterns (hub-and-spoke)
- Subagent spawning via `Task` tool, `allowedTools` must include "Task"
- Programmatic enforcement vs prompt-based guidance (critical distinction)
- Agent SDK hooks: `PostToolUse`, tool call interception
- Session management: `--resume`, `fork_session`, scratchpad persistence
- Task decomposition: prompt chaining vs dynamic adaptive decomposition

Your likely strengths:
- You've built multi-step Claude workflows → agentic loop intuition
- AppSec background → you already think about programmatic enforcement over probabilistic prompt compliance

Your likely gaps:
- `fork_session` specifics and when to use it vs `--resume`
- Agent SDK hooks — `PostToolUse` patterns, exact interception behavior
- Coordinator context isolation: subagents do NOT inherit parent context automatically (this is a common exam trap)
- The specific `allowedTools: ["Task"]` requirement to spawn subagents

Exam trap to know cold:
> Prompt instructions have a non-zero failure rate for business-critical sequences.
> When the exam says "12% of cases skip verification," the correct answer is always a programmatic gate — never "update the system prompt."

Study time allocation: **6 hours**

---

### Domain 3: Claude Code Configuration & Workflows — 20% of exam
*Your home turf. Should be your strongest domain.*

What it covers:
- CLAUDE.md hierarchy: user (`~/.claude/CLAUDE.md`) → project (`.claude/CLAUDE.md`) → directory
- `.claude/rules/` with YAML frontmatter glob patterns for conditional rule loading
- `.claude/commands/` (project-scoped, version-controlled) vs `~/.claude/commands/` (personal)
- `.claude/skills/` with SKILL.md frontmatter: `context: fork`, `allowed-tools`, `argument-hint`
- Plan mode vs direct execution: when each applies
- CI/CD: `-p` / `--print` flag for non-interactive, `--output-format json`, `--json-schema`
- Session tools: `/memory`, `/compact`, `--resume <session-name>`, `Explore` subagent

Your likely strengths:
- You use Claude Code daily across real projects — this is applied knowledge
- CLAUDE.md, skills, commands — you've built these

Your likely gaps:
- `context: fork` in skill frontmatter — the isolation behavior, when to use it
- Path-scoped rules via YAML frontmatter glob patterns (vs directory-level CLAUDE.md) — know when each is correct
- The exact `-p` / `--print` flag for CI — sounds obvious but shows up in sample questions
- `/compact` and `Explore` subagent for context management in long sessions

Exam trap to know cold:
> Instructions in `~/.claude/CLAUDE.md` are personal — they are NOT shared with teammates via version control.
> Project-level is `.claude/CLAUDE.md` (or root `CLAUDE.md`). User-level is `~/.claude/CLAUDE.md`.
> This distinction appears directly in sample questions.

Study time allocation: **3 hours** (mostly verification, not new learning)

---

### Domain 4: Prompt Engineering & Structured Output — 20% of exam
*Technical prompt engineering, not "write better prompts." Production extraction systems.*

What it covers:
- Explicit criteria vs vague instructions (false positive rate reduction)
- Few-shot examples: when they're the right tool vs when they're overkill
- `tool_use` with JSON schemas for guaranteed structured output
- `tool_choice`: "auto" vs "any" vs forced `{"type": "tool", "name": "..."}` — know all three
- Schema design: required vs optional fields, nullable fields, enum with "other" + detail
- Validation-retry loops: retry with specific error message appended
- Message Batches API: 50% cost savings, 24-hour window, no guaranteed SLA, no multi-turn tool calling
- Multi-pass review architecture: per-file passes + integration pass to avoid attention dilution

Your likely strengths:
- You've engineered production prompts and seen them fail
- Token/cost awareness (you model LLM costs)
- Schema design from your API/backend work

Your likely gaps:
- Exact `tool_choice` options and when each is correct — this is tested precisely
- Message Batches API specifics: the `custom_id` correlation pattern, the no-multi-turn-tool-calling limitation
- Semantic validation errors (values don't sum) vs syntax errors (eliminated by tool_use) — the distinction matters

Exam trap to know cold:
> `tool_choice: "auto"` means the model *may* return text instead of calling a tool.
> `tool_choice: "any"` forces a tool call but lets the model choose which one.
> Forced selection (`{"type": "tool", "name": "X"}`) forces a specific tool.
> Making a nullable field required causes the model to fabricate values. Always design optional fields as nullable.

Study time allocation: **4 hours**

---

### Domain 2: Tool Design & MCP Integration — 18% of exam
*Your AppSec instincts apply directly here.*

What it covers:
- Tool descriptions as the primary LLM tool-selection mechanism
- Structured error responses: `isError` flag, `errorCategory` (transient/validation/permission/business), `isRetryable`
- Too many tools degrades selection reliability — 4-5 per agent, not 18
- MCP server scoping: `.mcp.json` (project, shared) vs `~/.claude.json` (user, personal)
- Environment variable expansion in `.mcp.json` for credential management
- MCP resources for content catalogs (reduces exploratory tool calls)
- Built-in tools: Read, Write, Edit, Bash, Grep, Glob — selection criteria for each

Your likely strengths:
- You've connected Claude to real backend systems via MCP
- You think about least-privilege and tool boundaries (AppSec)
- You know the difference between a good and bad API contract

Your likely gaps:
- `isError` flag pattern specifics — MCP's error communication model
- MCP resources (as distinct from tools) — exposing content catalogs
- Edit vs Read+Write fallback: Edit fails on non-unique text matches; fallback is Read + Write

Exam trap to know cold:
> Minimal tool descriptions cause misrouting — the fix is enriching descriptions, not adding routing layers.
> The first correct answer when tool selection is unreliable is always "improve the description" — not "add a classifier" or "consolidate tools."

Study time allocation: **3 hours**

---

### Domain 5: Context Management & Reliability — 15% of exam
*Smallest domain. But the failure modes are subtle and your AppSec background helps.*

What it covers:
- Progressive summarization risks: numerical values, dates, amounts get lost
- "Lost in the middle": models reliably process beginning and end, miss the middle
- Verbose tool results accumulating in context — trim to relevant fields
- Scratchpad files for persistence across context boundaries
- Escalation triggers: customer requests human, policy gap, inability to progress
- Error propagation: structured context (failure type, what was attempted, partial results)
- Information provenance: claim-source mappings, temporal data, conflict annotation
- Confidence calibration: field-level scores, stratified sampling, accuracy by document type

Your likely strengths:
- You think about observability — what to log, what to preserve
- Multi-tenant systems → you understand data isolation and context boundaries

Your likely gaps:
- Escalation criteria precision — know the three legitimate escalation triggers cold
- Structured error propagation patterns — the exact shape of what subagents return to coordinator
- Provenance tracking in multi-source synthesis

Study time allocation: **2 hours**

---

## Study Plan: 18 Hours Total

This is a realistic number for someone with your background.
Not 40 hours. Not a week of cramming. 18 deliberate hours across 2 weeks.

### Week 1: Knowledge Gaps (10 hours)

**Day 1 — 2 hours: Domain 1 deep dive (Agent SDK specifics)**
- Read: Anthropic Agent SDK docs on `Task` tool, `allowedTools`, `PostToolUse` hooks
- Build: A minimal coordinator that spawns two subagents with explicit context passing
- Key thing to verify: subagents do NOT inherit coordinator context. Pass it explicitly. Feel this.

**Day 2 — 2 hours: Domain 1 continued (sessions + orchestration)**
- Read: `--resume`, `fork_session`, session isolation docs
- Build: Fork a session and confirm the branches are actually independent
- Key thing to verify: When to start fresh with a summary vs resume with stale context

**Day 3 — 2 hours: Domain 4 (structured output + tool_choice)**
- Read: API docs on `tool_choice` options, JSON schema for `tool_use`
- Build: An extraction that uses all three `tool_choice` modes and see the behavioral difference
- Key thing to verify: nullable vs required fields — make a required field for absent data and see hallucination happen

**Day 4 — 2 hours: Domain 2 (MCP error handling)**
- Read: MCP spec on `isError`, error categories
- Build: A tool that returns structured errors with `errorCategory` and `isRetryable`
- Key thing to verify: Transient vs business errors get handled differently by the agent

**Day 5 — 2 hours: Domain 3 verification**
- Audit your existing CLAUDE.md files against the hierarchy
- Build one `.claude/rules/` file with YAML frontmatter glob patterns if you haven't already
- Verify you know the personal vs project scope distinction for commands and skills

---

### Week 2: Exam Prep (8 hours)

**Day 6 — 3 hours: Sample questions from the guide**
Work through every sample question in the official exam guide.
For each one:
1. Answer it before reading the explanation
2. If you got it wrong, write one sentence on WHY the wrong answer was tempting
3. If you got it right for the wrong reason, that counts as wrong

The 12 sample questions cover all 6 scenarios. The explanations are the most valuable part of the guide.

**Day 7 — 2 hours: Scenario walkthroughs**
For each of the 6 exam scenarios, write a 3-sentence answer to:
> "What are the top 3 failure modes in this system and what fixes them?"
- Customer Support Resolution Agent
- Code Generation with Claude Code
- Multi-Agent Research System
- Developer Productivity with Claude
- Claude Code for Continuous Integration
- Structured Data Extraction

**Day 8 — 2 hours: Practice exam**
The official practice exam is referenced in the guide.
Access it through the Anthropic Academy once you're in the Partner Portal.
Take it under real conditions: no looking things up, time yourself.

**Day 9 — 1 hour: Review wrong answers only**
Don't re-read everything. Only go back to the specific knowledge gaps revealed by the practice exam.

---

## 10 Things to Know Cold Before You Sit the Exam

These are the highest-leverage facts — things that appear in sample questions or are explicitly flagged in the exam guide.

1. **`stop_reason` values**: "tool_use" = continue loop. "end_turn" = terminate. Never use text parsing or arbitrary iteration caps to terminate an agentic loop.

2. **Programmatic vs prompt-based enforcement**: When a business rule requires deterministic compliance (e.g., verify customer before refund), prompt instructions have a non-zero failure rate. Use a programmatic gate.

3. **Subagent context isolation**: Subagents do NOT inherit the coordinator's conversation history automatically. Pass context explicitly in the subagent's prompt.

4. **`allowedTools` must include "Task"**: For a coordinator to spawn subagents, its `allowedTools` must include "Task".

5. **`tool_choice` options**: "auto" = model may return text. "any" = model must call a tool, chooses which. Forced = must call this specific named tool.

6. **Nullable fields prevent hallucination**: Required fields for absent data cause fabrication. Make fields nullable/optional when the source document may not contain the information.

7. **Personal vs project CLAUDE.md**: `~/.claude/CLAUDE.md` = personal, not version-controlled, not shared. `.claude/CLAUDE.md` = project, version-controlled, shared with team.

8. **Tool description quality is the first fix for misrouting**: When tool selection is unreliable, enrich the descriptions. Adding routing classifiers or consolidating tools is almost never the "best first step."

9. **Message Batches API limitation**: Does not support multi-turn tool calling within a single request. Use it for latency-tolerant workloads (overnight reports, weekly audits). Never for blocking workflows.

10. **Lost in the middle**: Models process beginning and end reliably; middle sections get missed. Put key findings at the start of aggregated inputs. Use explicit section headers.

---

## The Imposter Syndrome Note

You want this cert to prove to yourself you're not an imposter.

Here's the honest thing: the exam is grounded in scenarios you have already lived through.
Customer support agents that skip verification steps.
CI pipelines that hang because someone forgot a flag.
Multi-agent systems where subagents produce irrelevant results because the coordinator decomposed the problem wrong.
Tool descriptions so minimal that the model has no idea which one to call.

You haven't been an imposter. You've been building real systems that fail in real ways, which is exactly what this exam tests.

The 18 hours isn't to teach you things you don't know.
It's to give you the vocabulary for things you already understand.
And 720/1000 is the score that says: I know what I'm doing here, and now there's a credential that says so.

---

## Access Path

1. Apply to Partner Network first (free, 30 minutes): anthropic.com/news/claude-partner-network
2. Once accepted: access Partner Portal → Anthropic Academy training materials
3. Exam access: anthropic.skilljar.com/claude-certified-architect-foundations-access-request
4. Official exam guide (already retrieved): everpath-course-content.s3-accelerate.amazonaws.com (full PDF)

---

## After You Pass: Partner Network Leverage

Once you have the cert:

For Intinc:
- "Claude Certified Architect" is a credential your org can point to when justifying Claude adoption
- Positions you to lead internal Claude enablement — you're not just an advocate, you're certified
- Opens the conversation for Intinc to join the Partner Network itself (enterprise benefit)

For Customization Service:
- Listed in Anthropic's Services Partner Directory — enterprise buyers find implementation partners there
- "We deploy certified Claude architects" is a differentiator in sales conversations
- Co-marketing investment from Anthropic for joint campaigns and events
- The cert is proof for clients that your Claude builds are production-grade, not demo-grade

---
*Study plan built from the official Claude Certified Architect – Foundations Exam Guide (v0.1, Feb 2025). Domains, weightings, and sample questions sourced directly from the guide.*
