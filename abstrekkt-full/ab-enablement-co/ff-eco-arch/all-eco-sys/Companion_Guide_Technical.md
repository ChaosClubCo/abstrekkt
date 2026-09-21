# Structured Prompting for Engineers
## A Technical Guide to Using the 15 Frameworks Library with Claude

**For:** Developers, engineers, architects, and DevOps practitioners who are new to Claude and AI assistants  
**Assumes:** You write code, think in systems, and want to know *how it works* — not just *what to type*  
**Companion to:** *Top 15 Prompting Frameworks v2.0*  
**Version:** 1.0 · May 2026

---

## How This Guide Differs from the Non-Technical Version

The non-technical companion covers 5 frameworks with analogy-driven explanations for writers, PMs, and business users. This guide covers 9 frameworks relevant to engineering work, explains the underlying mechanics (context windows, tokenization, extended thinking), and shows you how to integrate structured prompting into your technical workflow — including API calls, Claude Code, and MCP tool chains.

If you've used LLMs casually but never engineered prompts systematically, start here.

---

## Part 1: Claude's Architecture (What You Need to Know to Prompt Well)

### 1.1 Models and When They Matter

Claude ships in multiple model tiers. The model affects output quality, speed, and cost.

| Model | Strengths | Use When |
|-------|-----------|----------|
| **Claude Opus 4** | Deepest reasoning, best at complex multi-step tasks, most thorough | Architecture decisions, threat models, multi-file code generation, nuanced analysis |
| **Claude Sonnet 4** | Strong reasoning at higher speed, good balance of quality and throughput | Day-to-day coding, code review, document generation, most engineering tasks |
| **Claude Haiku 4** | Fast, cheap, good at well-defined tasks | Classification, extraction, boilerplate, high-volume API calls, CI pipeline checks |

**Practical rule:** Use Sonnet for most work. Reach for Opus when reasoning depth matters (architecture, security, complex debugging). Use Haiku for high-volume, well-constrained tasks where speed and cost matter more than nuance.

### 1.2 Context Windows

Claude's context window is the total amount of text it can process in a single conversation turn — your prompt, any attached files, conversation history, and its response combined.

- Current context windows range from 200K tokens (standard) with support for extended context
- 1 token ≈ 4 characters of English text, or roughly ¾ of a word
- A 200K-token window holds roughly 150K words — approximately 500 pages

**Why this matters for prompting:** You can paste entire codebases, long documents, or multiple files into a single prompt. But more context isn't always better — Claude performs best when the context is high-signal. Irrelevant context dilutes attention.

**Engineering implication:** Don't paste your entire repo when asking about one module. Include only the files and context Claude needs. This is what Anthropic calls *context engineering* — assembling the minimum set of high-signal tokens for the task.

### 1.3 Extended Thinking

Extended thinking gives Claude a scratchpad for reasoning before it responds. It's not just "think harder" — it's a structurally different processing mode where Claude can:

- Plan multi-step solutions before writing code
- Evaluate multiple approaches before committing
- Catch edge cases and contradictions in its own reasoning
- Work through complex logic chains

**When to use it:** Architecture decisions, debugging complex issues, security analysis, code that involves concurrency or state management, anything where "think before you write" produces better results than "stream the first thing that comes to mind."

**In the frameworks library:** COT-S, ReAct, ToT, BMAD, and Expert Panel all recommend enabling extended thinking. These are the frameworks where reasoning quality is the primary output.

### 1.4 XML Tags as Semantic Structure

This is the single most important technical concept for prompt engineering with Claude.

Claude 4.x parses XML tags as semantic boundaries — not just formatting. When you wrap content in `<context>`, `<task>`, `<constraints>`, or `<examples>` tags, Claude treats each section as a distinct processing unit with a defined role.

```xml
<!-- Claude processes these as semantic zones, not decoration -->
<context>
Technical background and constraints go here.
Claude treats this as "the situation" and doesn't generate from it — it references it.
</context>

<task>
The specific deliverable goes here.
Claude treats this as "what I need to produce."
</task>

<constraints>
Restrictions and boundaries go here.
Claude treats these as hard limits on its output.
</constraints>

<examples>
Desired output patterns go here.
Claude treats these as format templates to match.
</examples>
```

**Why XML tags matter more than markdown headers:** Markdown headers (`## Context`) are visual formatting that Claude interprets loosely. XML tags create unambiguous boundaries that Claude's architecture processes as distinct sections. The difference shows up most in complex prompts where Claude needs to reference context while following constraints — XML keeps these cleanly separated.

Every template in the frameworks library uses XML tags. When you see the templates, the tags aren't optional decoration — they're load-bearing structure.

### 1.5 System Prompts vs. User Messages

In the API (and in Claude Projects), there's a distinction between the *system prompt* and the *user message*:

- **System prompt:** Persistent instructions that apply to the entire conversation. Sets Claude's role, behavior rules, and output standards. Equivalent to `system` in the Messages API.
- **User message:** The per-turn request. Contains the specific task, context, and constraints for this particular interaction.

**In the framework templates:** The `<system>` block maps to the system prompt. Everything inside `<instructions>` maps to the user message. When using Claude.ai (not the API), paste both together — Claude still respects the semantic boundary.

---

## Part 2: The 9 Frameworks That Matter for Engineering Work

The full library has 15 frameworks. For engineering work, 9 are your working set:

| Framework | Engineering Use Case |
|-----------|---------------------|
| **RCTF** | Architecture docs, design specs, technical proposals |
| **RISEN** | Runbooks, deployment procedures, operational playbooks |
| **ReAct** | Debugging, investigation, multi-source research |
| **COT-S** | Build-vs-buy analysis, trade-off evaluation, root cause analysis |
| **BMAD** | Threat models, security assessments, risk analysis |
| **Eval-First** | Code review rubrics, quality gates, acceptance criteria |
| **ToT** | Architecture decisions with multiple viable paths |
| **Few-Shot** | Standardizing output formats (code reviews, commit messages, API responses) |
| **Zero-Shot** | Classification rules, policy enforcement, automated categorization |

The remaining 6 (CO-STAR, SCQA, OODA, Pyramid, CRISP-DM, Expert Panel) are useful but less frequent for engineering. CO-STAR is good for writing technical communications. OODA is good for incident response. See the full library for those.

---

### Framework Deep-Dives

#### RCTF — When to Use Over RISEN

RCTF gives Claude latitude to organize and structure. RISEN constrains Claude to a defined step sequence.

**Use RCTF when:** You want Claude to *design* something — an architecture, a migration strategy, a technical spec. The output's structure is part of the value.

**Use RISEN when:** You want Claude to *document* something — a deployment runbook, a setup procedure, an incident response checklist. The output's step order is part of the value.

**Technical example (RCTF):**

```xml
<system>
You are a senior platform architect specializing in event-driven microservices
on AWS (EventBridge, SQS, Lambda, Step Functions).
</system>

<instructions>
<context>
We're decomposing a monolithic Django application (84K LOC, PostgreSQL) into
microservices. Current pain points: 45-minute deploy cycles, 3 teams blocked
on shared database schema changes, and a single point of failure in the
payment processing module. Team: 14 engineers across 3 squads.
</context>

<task>
Produce a decomposition strategy document covering:
1. Service boundary identification (which modules become services, with rationale)
2. Data ownership mapping (which service owns which tables, how to handle shared data)
3. Communication patterns (sync vs. async for each service boundary, with justification)
4. Migration sequencing (which service to extract first, dependency order)
5. Strangler fig implementation plan (how traffic routes during migration)

Include a risk register: what could go wrong at each phase and how to mitigate.
</task>

<format>
2,500-3,000 words. Include architecture diagrams as ASCII or Mermaid syntax.
Service boundary decisions as a table: module | proposed service | data owned |
communication pattern | extraction priority (1-5) | risk level.
</format>

<guardrails>
  <data_handling>No real table names or API endpoints. Use descriptive placeholders.</data_handling>
  <output_restrictions>No vendor-specific lock-in recommendations without noting the lock-in tradeoff.</output_restrictions>
  <audience_sensitivity>Primary: engineering team implementing. Secondary: VP Engineering approving investment.</audience_sensitivity>
  <source_attribution>Label architecture patterns [SOURCED] where documented. Migration estimates [GENERATED].</source_attribution>
</guardrails>
</instructions>
```

#### ReAct — The Investigation Framework

ReAct (Reason + Act) is unique among the frameworks because it's the only one designed for iterative tool use. Claude alternates between reasoning and taking actions — querying databases, reading logs, calling APIs, searching documentation.

**When to use:** Any task where Claude needs to *discover* information rather than *generate* it. Debugging, root cause analysis, research, competitive analysis, security investigation.

**The loop:**
```
THINK → What's my hypothesis? What evidence would confirm/refute it?
ACT   → Call a tool, query a log, read a file, search the web.
OBSERVE → What did I find?
ASSESS → Update hypothesis. Continue or conclude.
```

**Technical example:**

```xml
<system>
You are a senior SRE with access to: Datadog APM traces, PostgreSQL slow query
log, AWS CloudWatch metrics, and application structured logs (JSON, ELK stack).
</system>

<instructions>
<objective>
API p99 latency spiked from 220ms to 1,800ms starting at 14:22 UTC.
The spike correlates with a deployment at 14:15 UTC but the deployment only
changed the notification service (no database changes, no API route changes).
Determine root cause.
</objective>

<investigation_protocol>
For each step:
1. THINK: State hypothesis and what evidence would confirm/refute
2. ACT: Specify the exact query, log search, or metric you'd check
3. OBSERVE: Record the finding
4. ASSESS: Update hypothesis — continue or conclude

Maximum 8 steps. Prioritize: identify cause → assess blast radius → recommend fix.
</investigation_protocol>

<constraints>
Production system — no destructive actions.
Assume you can read but not write to any data source.
</constraints>

<output_format>
Investigation log (numbered steps with THINK/ACT/OBSERVE/ASSESS),
then: Root Cause (3 sentences), Immediate Fix, Permanent Fix, Timeline.
</output_format>

<guardrails>
  <data_handling>Sanitize all log examples. No real IPs, user IDs, or query content.</data_handling>
  <output_restrictions>No blame. Focus on systems and process.</output_restrictions>
  <source_attribution>Observations [SOURCED] from described tools. Root cause [GENERATED].</source_attribution>
</guardrails>
</instructions>
```

**ReAct vs. COT-S — the key distinction:** If Claude can answer from the prompt context alone → COT-S. If Claude needs to look things up, call tools, or verify against external sources → ReAct.

#### COT-S — Pure Analytical Reasoning

Chain-of-Thought Structured forces Claude to show its work. It's the framework for decisions where you need to see the reasoning chain, not just the conclusion.

**Use for:** Build-vs-buy decisions, technology evaluations, cost-benefit analyses, architectural trade-offs.

The structure is explicit:
1. **DEFINE** — Restate the problem and key variables
2. **DECOMPOSE** — Break into independently answerable sub-questions
3. **ANALYZE** — Address each sub-question with evidence
4. **SYNTHESIZE** — Combine into a conclusion
5. **VALIDATE** — Check for gaps, challenge assumptions

**When extended thinking adds value:** Always, for COT-S. The framework's purpose is visible reasoning, and extended thinking gives Claude space to reason before committing to a structure.

#### BMAD — Security and Risk Analysis

BMAD (Boundaries, Mitigations, Assumptions, Deliverables) is purpose-built for threat modeling and risk assessment. Every field maps to a security analysis concept:

- **Boundaries:** System scope, trust boundaries, data flows, integration points
- **Mitigations:** Existing controls and compensating measures
- **Assumptions:** Stated threat actor capabilities, attack surface assumptions (verified vs. unverified)
- **Deliverables:** Specific security artifacts (STRIDE matrix, risk register, remediation roadmap)

**When to use over RCTF:** Any task involving threats, vulnerabilities, or risk. RCTF would work for a generic "write a security doc" but BMAD forces the structured thinking that security analysis requires.

#### Eval-First — Quality Gates Before Generation

Eval-First inverts the normal prompt flow: define what "good" looks like *before* Claude generates anything. This is the meta-framework — it defines the rubric, then generates output constrained by that rubric, then self-evaluates.

**Engineering use cases:** Code review standards, architecture decision record quality gates, PR readiness checklists, deployment go/no-go criteria.

**Why it matters technically:** When you define evaluation criteria first, Claude optimizes its generation toward those criteria rather than its default "make it comprehensive" mode. You get targeted output instead of generic completeness.

#### ToT — Tree of Thought for Architecture Decisions

ToT generates multiple solution paths, evaluates each against weighted criteria, and recommends one with sensitivity analysis. It's the framework for decisions where there's no single right answer — only trade-offs.

**Structure:**
1. Define the problem and solution space
2. Specify evaluation criteria with weights (e.g., Cost 25%, Risk 20%, Maintainability 30%, Time-to-value 25%)
3. Generate N distinct solution paths (usually 3)
4. Score each path against criteria
5. Recommend with justification and "what would change my mind"

**Extended thinking:** Always enable. Multi-branch reasoning is ToT's mechanism.

#### Few-Shot — Format Standardization via Examples

Few-Shot provides examples of desired output so Claude matches the pattern. For engineering, this is how you standardize: code review comments, commit messages, API error responses, incident update formats, PR descriptions.

**Key technical detail:** Include both positive examples (what good looks like) AND negative examples (what to avoid and why). Anthropic's guidance specifically calls out that negative examples define boundaries as effectively as positive ones.

```xml
<examples>
<example type="good">
[Complete example of desired output with all fields]
</example>

<example type="good">
[Different input, same format — proves the pattern is consistent]
</example>

<example type="bad">
[What NOT to do, with explicit explanation of WHY it fails]
</example>
</examples>
```

#### Zero-Shot — Rule-Based Classification Without Examples

Zero-Shot is the inverse of Few-Shot: rules replace examples. Use it for classification, policy enforcement, and automated categorization where examples could over-anchor Claude on specific cases rather than general rules.

**Engineering use cases:** PII detection in logs, commit message classification (feat/fix/chore), PR complexity scoring, incident severity classification, security finding categorization.

---

## Part 3: XML Tag Patterns You'll Use Daily

### 3.1 The Universal Structure

Every framework template in the library follows this skeleton:

```xml
<system>
[Role and expertise — maps to system prompt in API]
</system>

<instructions>
  <context>[Situation, constraints, background]</context>
  <task>[Specific deliverable]</task>
  <format>[Structure, length, sections]</format>
  <guardrails>
    <data_handling>[What data is in-scope/excluded]</data_handling>
    <output_restrictions>[What Claude must NOT output]</output_restrictions>
    <audience_sensitivity>[Who reads this]</audience_sensitivity>
    <source_attribution>[SOURCED] vs. [GENERATED] labeling</source_attribution>
  </guardrails>
  <examples>[Optional: positive and negative examples]</examples>
</instructions>
```

### 3.2 Guardrails as Native Fields

The guardrails block isn't optional decoration — it's a compliance layer baked into every template. This is where you enforce:

- **Data handling:** "No real customer names. Use anonymized IDs only."
- **Output restrictions:** "No actual SQL with production schema. Use placeholders."
- **Source attribution:** Forces Claude to label every claim as `[SOURCED]` (from cited reference) or `[GENERATED]` (Claude's reasoned estimate).

### 3.3 Compliance Toggle Prefixes

For regulated environments, prepend an industry-specific compliance block before `<instructions>`:

```xml
<!-- Activate for HIPAA-regulated work -->
<compliance_prefix type="HIPAA">
  <phi_rules>No Protected Health Information in output. De-identify all examples.</phi_rules>
  <minimum_necessary>Only include health data elements essential to the task.</minimum_necessary>
</compliance_prefix>

<!-- Activate for PCI-DSS work -->
<compliance_prefix type="PCI-DSS">
  <cardholder_rules>No PANs, CVVs, or cardholder data. Mask to first 6 / last 4.</cardholder_rules>
  <scope_boundary>Outputs must not expand the CDE boundary.</scope_boundary>
</compliance_prefix>

<!-- Activate for SOC 2 work -->
<compliance_prefix type="SOC2">
  <evidence_rules>Map all assertions to Trust Services Criteria (CC, A, C, PI, P).</evidence_rules>
  <audit_trail>Include evidence type, collection method, review frequency.</audit_trail>
</compliance_prefix>
```

These stack — you can apply HIPAA + SOC 2 simultaneously for a healthcare SaaS audit.

---

## Part 4: Integration Patterns

### 4.1 Claude.ai (Chat Interface)

Paste the full XML-tagged prompt (system + instructions) as a single message. Claude respects the semantic boundaries even when both sections are in the same message.

**For recurring work:** Create a Claude Project. Put the `<system>` block and standard `<guardrails>` in the Project instructions. Then each conversation only needs the `<task>` and `<context>` specific to that session.

### 4.2 Claude API (Messages Endpoint)

```python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=4096,
    system="You are a senior platform architect specializing in...",  # <system> block
    messages=[
        {
            "role": "user",
            "content": """
            <context>We're decomposing a monolithic Django app...</context>
            <task>Produce a decomposition strategy...</task>
            <format>2,500-3,000 words...</format>
            <guardrails>
              <data_handling>No real table names...</data_handling>
            </guardrails>
            """
        }
    ]
)
```

**Key point:** The `system` parameter in the API maps directly to the `<system>` block in the templates. The `content` in the user message contains everything inside `<instructions>`.

### 4.3 Claude Code (Terminal Agent)

Claude Code can execute the ReAct loop natively — it reads files, runs commands, observes outputs, and iterates. When using ReAct-style prompts with Claude Code:

- The THINK/ACT/OBSERVE/ASSESS loop maps to Claude Code's natural tool-use cycle
- You don't need to simulate the loop — Claude Code actually executes the ACT steps
- Provide the investigation objective and constraints; Claude Code handles the iteration

### 4.4 MCP Tool Chains

For prompts that involve external tools (databases, APIs, monitoring systems), MCP servers give Claude direct access. ReAct prompts become more powerful when Claude can actually query Datadog, read Slack channels, or search Notion — rather than simulating what it would find.

---

## Part 5: Extended Thinking Usage Guide

### When to Enable

| Framework | Enable Extended Thinking? | Why |
|-----------|--------------------------|-----|
| RCTF | For complex, multi-section deliverables (>2K words) | Planning document structure before writing |
| RISEN | For complex multi-branch procedures (>15 steps) | Reasoning about state and rollback paths |
| ReAct | Always | Investigation requires hypothesis tracking |
| COT-S | Always | Visible reasoning is the entire point |
| BMAD | Always | Security reasoning benefits from auditability |
| Eval-First | For complex multi-dimensional rubrics | Criteria design requires trade-off reasoning |
| ToT | Always | Multi-branch evaluation is the mechanism |
| Few-Shot | Rarely — only if examples are contradictory | Simple pattern matching doesn't need it |
| Zero-Shot | For complex classification with overlapping categories | Ambiguous boundary cases benefit from reasoning |

### How to Activate

**In Claude.ai:** Extended thinking is available when you toggle it on in settings or when using models that support it. Claude will use its thinking block to reason before responding.

**In the API:**

```python
message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000  # How much thinking space to allocate
    },
    messages=[...]
)
```

**Budget guidance:**
- Simple tasks: 2,000–5,000 tokens
- Architecture/security analysis: 8,000–15,000 tokens
- Complex multi-branch reasoning (ToT): 10,000–20,000 tokens

---

## Part 6: Evaluation Criteria for Engineering Prompts

Every framework template in the library includes 3–5 evaluation criteria. For engineering work, these are the dimensions that recur:

| Dimension | What It Measures | Score 1 (Fail) | Score 5 (Excellent) |
|-----------|-----------------|----------------|---------------------|
| **Technical accuracy** | Are claims correct? Are patterns valid? | Hallucinated APIs, wrong syntax, impossible architectures | All references verified, patterns proven, edge cases handled |
| **Actionability** | Can an engineer execute from this output? | Vague recommendations requiring further research | Step-by-step with commands, configs, and verification |
| **Security posture** | Are security implications addressed? | Secrets in code, missing auth, unvalidated inputs | Defense in depth, least privilege, input validation, logging |
| **Operational readiness** | Can this run in production? | No monitoring, no rollback, no error handling | Observability, graceful degradation, runbook-ready |
| **Guardrail adherence** | Does the output follow the stated constraints? | Sensitive data exposed, wrong audience level, missing attributions | All restrictions followed, attribution complete, audience-calibrated |

Use these to evaluate Claude's output before you ship it. If any dimension scores below 3, iterate.

---

## Part 7: Common Technical Pitfalls

1. **Underconstrained prompts produce generic output.** "Write a deployment script" → generic. "Write a Bash deployment script for a Node.js API on EKS using Helm 3, with canary deployment at 10% traffic, rollback on error rate >0.5%, and Datadog integration for deploy markers" → useful.

2. **Overconstrained prompts box Claude in.** If you specify every line of code, you're not getting Claude's value. Specify the *what* and *constraints*, let Claude handle the *how*.

3. **Missing negative constraints.** Claude will use every pattern it knows unless told not to. "Do NOT use deprecated `componentWillMount`" is as important as "Use React hooks."

4. **No verification step.** Always include: "After generating, verify: [specific checks]." For code: "Include a smoke test." For architecture: "Check for single points of failure."

5. **Ignoring the guardrails block.** The `<guardrails>` section isn't boilerplate — it prevents Claude from leaking PII, generating secrets in client code, or producing output inappropriate for the audience. Every production prompt should have it.

6. **Using Few-Shot when Zero-Shot is better.** If you provide 3 examples of how to classify security findings, Claude will match the pattern of your examples rather than apply the underlying rules. For classification tasks, rules (Zero-Shot) generalize better than examples (Few-Shot).

7. **Not labeling [SOURCED] vs. [GENERATED].** When Claude generates a metric ("this will improve performance by 30%"), you need to know whether that's from a benchmark or from Claude's estimate. The `source_attribution` guardrail forces this labeling.

8. **Treating conversation as stateless.** Each message in a conversation builds on prior context. If you refined a prompt through 5 iterations and then start a new conversation, you lose all of that refinement. Use Claude Projects to persist instructions, or document your refined prompts in your team's knowledge base.

---

## Part 8: Quick Reference

### Framework Selection for Engineering Tasks

| Task | Framework | Runner-up |
|------|-----------|-----------|
| Write an architecture spec | RCTF | ToT (if comparing options) |
| Write a deployment runbook | RISEN | RCTF (if less procedural) |
| Debug a production issue | ReAct | COT-S (if all data is in-context) |
| Evaluate build-vs-buy | COT-S | ToT (if >2 options) |
| Threat model a system | BMAD | RCTF (for general security doc) |
| Define code review standards | Eval-First | Few-Shot (for comment format) |
| Choose between 3 tech stacks | ToT | COT-S (if only 2 options) |
| Standardize PR descriptions | Few-Shot | Zero-Shot (if rules > examples) |
| Classify incident severity | Zero-Shot | Few-Shot (if edge cases need examples) |

### The 5-Second Decision

```
Need to CREATE a document?          → RCTF
Need to DOCUMENT a procedure?       → RISEN
Need to INVESTIGATE something?      → ReAct
Need to ANALYZE a decision?         → COT-S
Need to ASSESS risk/threats?        → BMAD
Need to DEFINE quality standards?   → Eval-First
Need to COMPARE multiple options?   → ToT
Need to MATCH a format pattern?     → Few-Shot
Need to ENFORCE classification rules? → Zero-Shot
```

### XML Skeleton (Copy This)

```xml
<system>
You are [ROLE] with [SPECIFIC EXPERTISE].
</system>

<instructions>
<context>[Situation, constraints, what Claude needs to know]</context>
<task>[Specific deliverable — what, how long, what sections]</task>
<format>[Structure, length, code block requirements]</format>
<guardrails>
  <data_handling>[In-scope/excluded data, PII rules]</data_handling>
  <output_restrictions>[What must NOT appear]</output_restrictions>
  <audience_sensitivity>[Reader context]</audience_sensitivity>
  <source_attribution>Label [SOURCED] or [GENERATED].</source_attribution>
</guardrails>
</instructions>
```

---

*End of Technical Guide. For the full 150-prompt library with all 15 frameworks, see: Top 15 Prompting Frameworks v2.0*
