# Vibe Coding: A Practitioner's Cheat Sheet

**By Kyle Rosebrook**

Most vibe coding guides are written by journalists watching from the press box. This one is written from the field — by someone who builds multi-agent AI systems, ships production apps solo, and has broken enough things to know where the advice articles stop and the real work starts.

This is the cheat sheet I wish existed when I started. It covers what actually works, what the mainstream guides get wrong, and the production-grade patterns that separate a weekend prototype from something that holds up under load.

---

## What Vibe Coding Actually Is

Andrej Karpathy coined the term in early 2025: a workflow where you describe intent in natural language, an AI generates code, and you iterate through conversation instead of syntax.

The popular framing splits this into "pure vibe coding" (trust the AI, ship fast, don't read diffs) and "responsible AI-assisted development" (review everything, pair-program style). That framing is wrong. It's not a spectrum between reckless and careful. It's a spectrum between **unstructured prompting** and **orchestrated AI pipelines** — and the second one is where the real leverage lives.

> **[ANNOTATION]** The eWeek version presents "pure vibe coding" as a valid technique for throwaway projects, then three sections later reports that 5,000 apps leaked sensitive data because of exactly this approach. The framing contradicts itself. There is no safe version of "fully trust the AI and don't read diffs." Even throwaway projects run on real infrastructure with real credentials.

---

## The Core Loop (What Everyone Gets Right)

The basic cycle is accurate everywhere you read about it:

1. **Describe** — State what you want in plain language
2. **Generate** — AI drafts the code
3. **Run** — Execute it, observe the result
4. **Refine** — Feed back errors, add constraints
5. **Repeat** — Until it works the way you need

This loop works for single-file scripts and small features. It breaks down the moment your project spans multiple files, has state, or talks to external services. That's where the intermediate and advanced patterns come in.

---

## The Prompt Layer (What Most Guides Undersell)

### The Real Failure Mode

Monolithic prompts under token pressure produce shallow, hallucinated output. This is the single most important thing to understand about AI-assisted development, and most cheat sheets skip it entirely.

When you stuff a giant prompt with requirements, context, constraints, and examples, the model doesn't process all of it equally. Attention degrades. Later sections get less weight. The AI starts pattern-matching to "what confident code looks like" instead of reasoning about your specific problem. The result looks correct. It compiles. It passes a glance test. And it has silent bugs in exactly the sections you cared about most.

> **[ANNOTATION]** The eWeek "3-layer prompt structure" (technical context → functional requirements → edge cases) is fine for beginners but doesn't address this failure mode. Breaking a prompt into three layers inside the same message doesn't fix attention degradation — breaking it into three *separate interactions* does.

### What Actually Works: Phased Pipelines

Instead of one prompt that tries to do everything, build a sequence:

**Phase 1 — Spec.** Describe the system boundaries, data flow, auth model, and failure modes. Don't ask for code yet. Ask the AI to produce a spec document and identify what it doesn't know.

**Phase 2 — Validate.** Feed the spec to a second conversation (or a second model). Ask it to find gaps, contradictions, and unstated assumptions. This is your adversarial critic gate.

**Phase 3 — Implement.** With a validated spec, now generate code in focused chunks. One file or one function at a time. Each chunk gets the spec as context, not the full conversation history.

**Phase 4 — Review.** A separate pass (fresh context) reviews the output against the spec. It reports problems — it does not fix them. You decide what to act on.

**Phase 5 — Integrate.** Assemble, test, and ship.

The key mechanism: **baton-pass blocks**. Each phase produces a structured handoff document that the next phase consumes. The handoff contract prevents context rot and ensures each phase starts clean.

### Prompt Craft That Matters

The basics are well-documented everywhere. Here's what's under-documented:

- **State your stack in every prompt.** "Python 3.11, FastAPI, Pydantic v2" is not optional context. It's the difference between getting v1 patterns and v2 patterns.
- **Include negative constraints.** "Do not use any external libraries" or "Do not add error handling yet — I'll add it in the next pass" prevents the AI from over-building.
- **Ask for explanations before fixes.** "Explain what's causing this error" produces better fixes than "fix this error" because it forces the model to reason before generating.
- **Paste exact error messages.** Full stack traces. Not "it threw an error." The model can pattern-match on specific error signatures.
- **Name your unknowns.** "I'm not sure whether this needs WebSocket or SSE — evaluate both and recommend one with tradeoffs" gets better output than picking one and hoping.

---

## The Tools (Honest Assessment)

### All-in-One Platforms

These handle hosting, database, and deployment. You trade control for speed.

| Tool | What It's Good At | Where It Breaks |
|---|---|---|
| **Replit** | Fastest path to running code. 50+ languages, browser-native. Good for prototypes and automation scripts. | Performance ceiling. Not where you want production infrastructure. |
| **Base44** | Clean data persistence, secure workflows. Fewest steps from description to working app. | Wix acquisition may change the roadmap. Watch the integration story. |
| **Bolt.new** | Full-stack generation with Figma import. Transparent — you can inspect everything. | Newer platform, smaller ecosystem. |
| **v0 by Vercel** | High-quality code output, real Git integration. Scales from prototype to production. | Opinionated toward Next.js. Fine if that's your stack, limiting if not. |
| **Lovable** | Best visual editing — click-to-modify any element. Native Supabase integration. | Non-technical founder bias. Can hit walls on complex backend logic. |

### AI Coding Agents

These give you control. You manage infrastructure.

| Tool | What It's Good At | Where It Breaks |
|---|---|---|
| **Claude Code** | Terminal-based, massive context window, exceptional reasoning on multi-file projects. MCP ecosystem for tool integration. | Learning curve. Not a visual IDE. |
| **Cursor** | AI-first IDE. Deep codebase awareness, good at cross-file refactors. | Can be opinionated about suggestions. Requires configuration to get the best output. |
| **GitHub Copilot** | Deepest GitHub integration. Free tier. Agent Mode for autonomous tasks. | Completion quality varies. Best as an autocomplete layer, not a primary agent. |

> **[ANNOTATION]** The eWeek version treats these categories as static. They're not. The real differentiator isn't "app vs. agent" — it's whether the tool supports **multi-agent orchestration**: can you chain models, enforce review gates, and maintain state across phases? That's the frontier. Tools like LangGraph, CrewAI, and MCP servers are the orchestration spine that the all-in-one platforms don't expose.

---

## When It Works and When It Breaks

### Works well for:

- **Prototyping and validation.** Get a working thing in front of users before investing in architecture.
- **Boilerplate and scaffolding.** Config files, CRUD endpoints, repetitive components.
- **Learning new frameworks.** Ask the AI to generate examples, then ask it to explain the patterns.
- **Single-file automation.** Data processing scripts, one-off transforms, CLI tools.
- **Documentation.** Feed working code back to the AI and ask it to write the README.

### Breaks down for:

- **Multi-file state management.** Changes in one file silently break another. The AI doesn't have a global dependency graph unless you give it one.
- **Security-critical paths.** Auth, payments, user data, secrets management. Always needs human review. Always.
- **Performance-sensitive work.** AI prioritizes readability and convention over hardware optimization.
- **Long-lived conversations.** Context windows degrade. The model starts following stale patterns from earlier in the conversation. Start fresh conversations often.

### The in-between (where most real work lives):

- **Multi-file features** — works if you use phased pipelines and explicit file-by-file generation
- **API integrations** — works if you paste the API docs into context instead of hoping the model remembers them
- **Database schema design** — works if you validate with a second pass and check for missing indexes, RLS policies, and migration safety

---

## The Doom Loop (And How to Break It)

The doom loop: you hit a bug, the AI says it fixed it, the fix introduces a new bug, the AI fixes that one, which re-introduces the first bug. You're now going in circles and the codebase is worse than when you started.

### Why it happens:

1. **Context rot.** Long conversations degrade output quality. The model is pattern-matching on stale context from 15 messages ago.
2. **Layer mismatch.** The AI updated the controller but not the model. Or the frontend but not the API contract. Layers are out of sync.
3. **Ambiguous requirements.** You weren't specific enough. The AI made assumptions. You corrected one assumption, which violated another assumption the AI made silently.

### How to break it:

**Stop. Don't let the agent keep trying.** This is the critical move. Every additional attempt in a corrupted context makes things worse.

1. **Start a fresh conversation.** Copy only the relevant code and the exact error message. Leave the conversation history behind.
2. **Diagnose before fixing.** "Explain what's causing this error and what state the code is in" — not "fix this."
3. **Verify the diagnosis.** Does the AI's explanation match what you observe? If not, the diagnosis is wrong and any fix will be wrong too.
4. **Apply one fix at a time.** Test after each change. Don't batch fixes.

### How to prevent it:

- **Checkpoint aggressively.** Save working versions before asking for changes. Git commit, copy the file, whatever works. Rollback capability is non-negotiable.
- **One task per prompt.** Don't ask "add auth and also fix the CSS and also add a loading state." Three prompts. Three commits.
- **Fresh conversations for fresh tasks.** A conversation that's been going for 20+ messages is operating on degraded context. Start over.

---

## Debugging Patterns

| Do this | Not this |
|---|---|
| Run the code yourself every time. Compile ≠ correct. | Trust that it works because it looks right. |
| Paste the full stack trace, not a summary. | "It threw an error." (Which error? Where? What input?) |
| Ask "explain what's causing this" before "fix this." | Jump straight to "fix this" and hope. |
| Treat every fix as a hypothesis. Test it. Confirm root cause. | Accept the first thing the AI suggests. |
| Use print statements and logs. See what the code actually does. | Assume the code does what you intended. |
| Stop after 3 failed fix attempts. Fresh context. | Let the agent keep trying in a corrupted conversation. |

---

## Security (The Part That Gets People Burned)

Red Access found roughly 380,000 publicly accessible assets created with vibe coding tools. About 5,000 leaked sensitive data — medical records, financial documents, internal business schedules. The root cause isn't AI-generated code being uniquely insecure. It's that AI-generated code **skips security defaults that experienced developers add automatically**, and non-technical users don't know to check.

### The Checklist

**Before you write any code:**

- [ ] Secrets live in environment variables, never in code. `.env` files are gitignored.
- [ ] No API keys, connection strings, or service role keys in frontend/client-side code. Server-side only.
- [ ] Auth uses established protocols (OAuth2, JWT via proven libraries). Never roll your own.

**Before you deploy:**

- [ ] All user inputs are validated and sanitized. Type checking enforced.
- [ ] CORS configured correctly — not `*` in production.
- [ ] HTTPS enforced.
- [ ] Database has row-level security enabled (Supabase ships with RLS disabled by default on new tables — this catches people constantly).
- [ ] Dependencies audited. Versions pinned. No untrusted packages.
- [ ] Access controls configured. Default-deny, not default-allow.

**Before you call it done:**

- [ ] Run a static security scan (Snyk, Semgrep, or similar).
- [ ] Grep your production bundle for `sk-`, `pk_live_`, `eyJh` (JWT prefix), and any string that looks like a credential.
- [ ] Open the app in an unauthenticated browser. Can you see data you shouldn't? Your authenticated browser lies to you about what's publicly accessible.
- [ ] Human review on every significant chunk. Treat AI output like a third-party contribution from someone who doesn't know your threat model.

> **[ANNOTATION]** The eWeek security checklist is correct but incomplete. It doesn't mention RLS defaults, bundle grepping, or unauthenticated-browser testing — the three things that actually catch the leaks Red Access found. Most vibe-coded apps leak data not because of sophisticated attacks but because the builder never checked what's publicly accessible.

---

## What the Mainstream Guides Miss Entirely

### Observability

AI-generated code almost never includes logging, metrics, or tracing. If you can't see what your app is doing in production, you can't debug it, you can't optimize it, and you can't prove it's working correctly. Add structured logging and error tracking before you deploy, not after the first incident.

### Test-Driven Workflows

Ask the AI to write tests *before* writing implementation. "Write a test suite for a function that takes a CSV file path and returns all valid email addresses. Include edge cases: empty file, malformed emails, Unicode characters, file not found." Then implement against the tests. This inverts the vibe coding loop in a way that dramatically improves output quality.

### Adversarial Review Gates

Every consequential output gets checked against three questions:

1. **What claims am I making?** Are they sourced or generated? Could someone find a counterexample?
2. **What am I assuming?** State every assumption explicitly. Silent assumptions are how bugs ship.
3. **What don't I know?** Known unknowns are manageable. Unknown unknowns are where projects die.

### Multi-Agent Orchestration

The frontier of AI-assisted development isn't one person talking to one model. It's pipelines: a spec agent, a coding agent, a review agent, a testing agent — each with focused context and explicit handoff contracts. Tools like LangGraph, CrewAI, and MCP (Model Context Protocol) servers make this possible today. If you're still doing everything in a single chat window, you're leaving most of the leverage on the table.

---

## Quick Reference

### Before you start:

- [ ] Write a plan in markdown. Iterate the plan before you touch code.
- [ ] Start a fresh conversation. Clean context window.
- [ ] Break your first goal into the smallest possible chunk.
- [ ] Define your tech stack in every prompt.
- [ ] State what you *don't* want as clearly as what you do.

### During the build:

- [ ] One task per prompt. One commit per task.
- [ ] Checkpoint working versions before requesting changes.
- [ ] Fresh conversation every 15-20 messages or when quality degrades.
- [ ] Ask for explanations before fixes.
- [ ] Paste full error messages, not summaries.

### Before you ship:

- [ ] Run the code yourself. Compile ≠ correct.
- [ ] Security checklist (above) — every item.
- [ ] Independent review pass (human or AI reviewer in a separate context).
- [ ] All assumptions documented. No silent defaults.
- [ ] No TODO placeholders in "finished" deliverables.

### Always:

- [ ] AI-generated code can look correct and be logically wrong.
- [ ] Testing is non-negotiable. Every time.
- [ ] Context windows degrade. Start fresh often.
- [ ] The faster you go without planning, the slower you'll go later.
- [ ] Architecture before features. Failure modes before happy paths.

---

*Kyle Rosebrook builds AI systems, automation pipelines, and production applications as a solo operator. He works as an L1 Service Desk Technician at an MSP by day and builds multi-agent orchestration platforms by night. His work lives at [kylerosebrook.com](https://kylerosebrook.com).*
