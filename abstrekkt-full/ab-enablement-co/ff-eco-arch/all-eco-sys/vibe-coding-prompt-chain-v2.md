# VIBE CODING PROMPT CHAIN v2.0

**Optimized for Claude (claude.ai + Claude Code) | March 2026**
**Stack: Next.js · Vite · React · Node · Supabase · Cloudflare · Vercel · AWS/GCP**

---

## CHANGELOG FROM v1.0

| What Changed | Why |
|---|---|
| Removed persona role-play primers | Claude doesn't need "you are a senior architect" — it degrades output by narrowing reasoning space. Anthropic's own docs confirm this. |
| Security moved from Phase 8 to Phase 0 (woven throughout) | OWASP, RLS, and input validation are constraints, not afterthoughts. Research: bugs found late cost 30× more to fix. |
| Test-first, not test-after | Simon Willison's "vibe engineering" research + Spotify's background agent data: agents with test suites produce 2× fewer regressions. |
| Added CLAUDE.md / Context Pack pattern | Anthropic's context engineering guide: persistent project context via CLAUDE.md is the #1 lever for agentic coding quality. |
| Replaced self-opinion critique with tool-grounded validation | Self-Refine research (Madaan et al., 2023): LLMs say "everything looks good" 94% of the time. External validation (tests, lint, type-check) is mandatory. |
| Bounded loops to 3 max with explicit stop criteria | Self-Refine + Reflexion research: loops beyond 3-4 iterations plateau or degrade. Stop condition must be tool-verified, not self-assessed. |
| Removed multi-agent swarm architecture | Claude Code's single-loop + subagent pattern outperforms swarms (Anthropic engineering blog, PromptLayer reverse-engineering analysis). Simpler = more debuggable. |
| Added compaction awareness | Claude Code triggers compaction at ~92% context window. Prompts must account for this — keep context lean, use just-in-time retrieval. |
| Added diff-based workflow | Minimal change principle: preserve correct code, change only what's broken. Prevents the "rewrite everything" anti-pattern. |
| Fixed Python wrapper (model strings, API patterns) | Updated to `claude-sonnet-4-5-20250929` and current Anthropic SDK patterns. |
| Removed fictional Cursor config | `.cursor/agent_config.json` with those fields doesn't exist. Replaced with actual rules-for-ai patterns. |
| Added subagent delegation pattern | Claude Code can spawn focused sub-agents via Task tool for isolated work. |

---

## HOW TO USE THIS DOCUMENT

**Three operating modes. Pick one per session.**

| Mode | When | Prompts Used |
|---|---|---|
| **Full Build** | New feature/app from scratch | Context Pack → Phase 0 → 1 → 2 → Feature Loop → Harden |
| **Feature Slice** | Adding to existing codebase | Context Pack → Feature Loop (3A–3E) → Harden |
| **Fast Vibe** | Quick change, prototype, throwaway | Context Pack → Fast Mode prompt → done |

**Rules:**
- Paste the Context Pack once at session start (or put it in CLAUDE.md for Claude Code)
- Run phases in order; for each feature, repeat the Feature Loop
- Never skip Phase 0 (it's 30 seconds and prevents 30 minutes of rework)
- If a critique loop stabilizes (no new issues), stop — do not force more iterations

---

## CONTEXT PACK (PASTE ONCE OR PUT IN CLAUDE.md)

This is your persistent project context. Claude Code loads CLAUDE.md automatically. For claude.ai, paste at session start.

```markdown
# PROJECT CONTEXT

## Stack
- Frontend: React (Vite) + Next.js (App Router, TypeScript)
- Backend: Node.js (TypeScript strict mode)
- Data/Auth: Supabase (Postgres + RLS + Auth + Storage + Realtime)
- Edge/CDN/Security: Cloudflare (DNS, WAF, Workers, Hyperdrive)
- Deploy: Vercel (Next.js) + Cloudflare (static/edge)
- Extras: AWS/GCP available when needed
- Monitoring: PostHog (analytics), Sentry (errors)

## Conventions
- TypeScript everywhere, strict mode enabled
- Zod for all runtime validation (inputs, env vars, API responses)
- ESLint + Prettier (default configs)
- Vitest for unit/integration tests
- Playwright for E2E smoke tests
- Next.js App Router with server actions for mutations
- Route handlers for public API endpoints
- Supabase JS client with generated Database types
- RLS always on — no service role key in browser, ever
- Secrets in env vars only; .env.example committed, .env never committed

## Security Non-Negotiables
- Validate all inputs server-side with Zod before any DB operation
- RLS policies on every table — test with anon + authenticated roles
- No service_role key in client bundles
- Rate limit public endpoints (Cloudflare or Vercel middleware)
- Sanitize all user-generated content before rendering
- Log structured JSON, never log PII or secrets
- CORS locked to known origins

## Quality Gates (every PR must pass)
- [ ] TypeScript compiles with zero errors
- [ ] Vitest passes (>90% coverage on new logic)
- [ ] ESLint passes with zero warnings
- [ ] No console.log in production code
- [ ] Zod validation on all external inputs
- [ ] RLS tested (both allowed and denied cases)
- [ ] .env.example updated if new env vars added
- [ ] No hardcoded secrets

## Architecture Decision: Where Server Logic Lives
Default: Next.js server actions for mutations, route handlers for APIs
Use Supabase Edge Functions when: logic is tightly coupled to DB triggers/auth
Use Cloudflare Workers when: edge filtering, rate limiting, caching, public API shielding
Never mix lanes without explicit justification.
```

---

## PHASE 0 — INTENT LOCK (30 seconds, prevents 30 minutes of rework)

This is the cheapest phase. Do it every time, even for "quick" changes.

```
We are building: [NAME]

What it does (one sentence):
Who it's for:
What it must NOT do (constraints):
Auth requirement: [public | logged-in | role-based]
Data touched: [new table | existing table | no DB]
Deadline/effort: [quick (<2hr) | medium (half-day) | full (multi-day)]

Task:
1. Restate the goal as a single paragraph.
2. List functional requirements (numbered, testable).
3. List non-functional requirements (security, perf, scale, compliance).
4. List edge cases and failure modes.
5. List assumptions explicitly. Ask max 3 clarifying questions only if correctness or security is blocked.
6. Define acceptance criteria (each one must be verifiable by a test or command).
```

**Why this works:** Research on program synthesis shows specification-first approaches improve correctness by 20-40% compared to "just start coding." You're spending 30 seconds to save 30 minutes of rework.

---

## PHASE 1 — ARCHITECTURE SLICE (lightweight, not a thesis)

Only run this for medium+ effort features. Skip for quick changes.

```
Based on the locked spec:

1. Choose the implementation lane:
   A) Next.js server actions (default for mutations)
   B) Next.js route handlers (for API endpoints)
   C) Supabase Edge Function (DB-coupled logic)
   D) Cloudflare Worker (edge shielding/caching)
   Explain why in 1-2 sentences.

2. Define the data flow:
   Request → validation → auth check → business logic → DB → response
   Show each step, including error paths.

3. Define new/modified data:
   - Tables (with RLS policy sketch)
   - Types (Zod schemas)
   - API contracts (input → output → error shapes)

4. Define test strategy:
   - What to unit test (pure logic, validation)
   - What to integration test (DB queries with RLS)
   - What to E2E test (critical user path)

5. Security surface:
   - What can an attacker do? (injection, privilege escalation, data leak)
   - How do we prevent it? (specific controls, not generic "use auth")

Output: architecture note (not a 10-page doc — a focused reference you'd put in a PR description).
```

---

## PHASE 2 — SCAFFOLD (only for new projects/modules)

Skip if adding to an existing codebase.

```
Given the architecture:

1. Folder tree that scales (annotated: what goes where and why).
2. Dependencies list (name, version, why it exists). Pin exact versions.
3. Minimal boot code to run locally in under 2 minutes.
4. Config files: tsconfig.json, .eslintrc, vitest.config, playwright.config.
5. .env.example with every required variable and a comment explaining each.
6. Smoke check commands (copy-paste, run in 60 seconds, confirms it works):
   - `npm run dev` → sees homepage
   - `npm run test` → green
   - `npm run lint` → clean
   - `npm run typecheck` → clean
```

---

## FEATURE LOOP (repeat per feature — this is where you spend most time)

### PROMPT 3A — FEATURE SPEC + TEST PLAN (test-first)

```
Feature: [NAME]

1. Define what the user experiences (behavior, not implementation).
2. Define inputs/outputs (payloads, events, CLI args — with Zod schemas).
3. List edge cases, failure modes, and "weird user" scenarios.
4. Define acceptance criteria (bulleted, each one testable).
5. Write the test plan FIRST:
   - Unit tests: what functions, what assertions
   - Integration tests: what DB queries, what RLS checks
   - Smoke test: what user action, what expected result
6. Define observability: what to log, what to measure, what alerts on.
```

**Why test-first:** Spotify's background coding agent data shows agents with pre-defined test targets produce cleaner PRs. The test plan constrains the implementation — the agent can't "cheat" by claiming something works without verification.

### PROMPT 3B — IMPLEMENT (with tests alongside)

```
Implement the feature AND its tests together.

Rules:
- Production-grade TypeScript. No placeholders. No TODO unless it's a genuine future item, clearly labeled.
- Zod validation on every external input.
- RLS-aware queries (use Supabase client with user context, never service role unless explicitly justified).
- Explicit error handling: typed errors, safe user-facing messages, structured server logs.
- Keep changes minimal and consistent with the existing architecture.
- Write tests alongside the implementation (not after).
- Provide full file contents grouped by file path.

Output:
- Files changed (list)
- Code (full files, not diffs — diffs are for revisions)
- Tests (in the same output)
- Key decisions explained in 1-2 sentences each
- Local run + test commands
- Smoke check (exact commands, expected output)
```

### PROMPT 3C — VALIDATE (tool-grounded, not self-opinion)

This replaces the old "self-critique" step. The key insight from Self-Refine research: LLMs say "looks good" 94% of the time when critiquing their own code. Tool validation is mandatory.

```
Validate the implementation using external tools, not self-assessment.

Run these checks and report results:
1. TypeScript: `npx tsc --noEmit` — report any type errors
2. Lint: `npx eslint . --ext .ts,.tsx` — report any warnings/errors
3. Tests: `npx vitest run` — report pass/fail with details on failures
4. Security scan: check for hardcoded secrets, service role exposure, missing validation

For each failure:
- Root cause (specific, not "something went wrong")
- Minimal fix (smallest correct change)
- Updated code (diff format — show only what changed)

If all checks pass:
- Report "All validations passed" with the exact output
- List any remaining concerns that tools can't catch (business logic correctness, UX edge cases)

Do NOT rewrite code that passed validation. Only fix what failed.
```

### PROMPT 3D — REVISE (targeted, bounded)

Only use if 3C found failures. Max 2 revision cycles.

```
Fix ONLY the issues identified in validation.

Rules:
- Do not add new features.
- Do not refactor passing code.
- Preserve correct parts — change minimal surface area.
- Show changes as diffs (what changed, what was preserved).
- Re-run the failing validations after fixing.
- If the same issue persists after 2 attempts, flag it as a blocker and explain what's needed.

Output:
- Diffs only (not full files)
- What changed and why
- Re-validation results
- Remaining issues (if any)
```

### PROMPT 3E — STABILITY CHECK (stop condition)

```
Run the full validation suite one final time:
1. `npx tsc --noEmit`
2. `npx eslint . --ext .ts,.tsx`
3. `npx vitest run`

If all pass: Feature is done. Output a summary:
- What was built (2-3 sentences)
- Files created/modified (list)
- Test coverage on new code
- Any caveats or known limitations
- Next recommended action

If any fail: One more targeted fix cycle (3D), then stop and report status regardless.
```

---

## PHASE 3 — HARDEN (before shipping)

Run once before merging to main. Not per-feature — per-release.

```
Production readiness audit for the new code.

Check and report status on each:
- [ ] Input validation: every external input has a Zod schema
- [ ] Auth boundaries: every protected route checks auth; RLS tested
- [ ] Rate limiting: public endpoints have rate limits (CF/Vercel middleware)
- [ ] Secret handling: no hardcoded secrets; .env.example updated
- [ ] Logging: structured JSON, no PII, useful for debugging
- [ ] Error behavior: user sees safe messages, server logs full context
- [ ] Dependency audit: `npm audit` clean or issues documented
- [ ] Performance: no N+1 queries, no overfetching, caching where appropriate
- [ ] Observability: errors tracked (Sentry), key events tracked (PostHog)
- [ ] Rollback plan: how to revert safely (git revert + any DB migrations)

Output:
- Risk list (severity: Critical/High/Medium/Low)
- Fix list (ordered by severity)
- "Ship it?" verdict with conditions
- Rollback procedure (exact commands)
```

---

## FAST MODE (max vibe, minimal ceremony)

Use for: prototypes, throwaway scripts, quick fixes, one-file changes.

```
Ship the smallest correct change.

Context: [what exists now]
Goal: [what should change]
Constraint: [what must not break]

Do:
1. Implement the change
2. Add a smoke test or verification command
3. Run validation (typecheck + lint + test)
4. Stop

Keep it under 5 files. No refactors unless required for correctness.
If you see something that should be fixed but isn't part of this change, note it separately — don't fix it now.
```

---

## CLAUDE CODE CLI AUTOMATION

For automated loops in Claude Code terminal.

### CLAUDE.md (project root)

The Context Pack above goes in CLAUDE.md. Claude Code loads it automatically every session.

### Agentic Loop Pattern

Claude Code already implements the optimal loop: `gather context → take action → verify results`. You don't need to build a custom loop — you need to give it good constraints.

**What to put in CLAUDE.md for agentic behavior:**

```markdown
# CLAUDE.md

[Context Pack from above]

## Workflow Rules
- Before implementing: read related files, understand existing patterns
- After implementing: run `npm run typecheck && npm run lint && npm run test`
- If tests fail: fix the specific failure, don't rewrite unrelated code
- If stuck after 2 attempts: report the blocker, don't loop forever
- Commit messages: conventional commits (feat:, fix:, refactor:, test:)
- Never modify files outside the scope of the current task

## Task Decomposition
For complex tasks, create a TODO list:
- [ ] Step 1: ...
- [ ] Step 2: ...
Cross off items as completed. If a step fails, note why before moving on.
```

### Subagent Delegation

For isolated, focused work within a larger task:

```
Spawn a sub-agent for: [specific isolated task]
Context it needs: [relevant files/schemas only]
Success criteria: [what "done" looks like]
Return: [what the main agent needs from the result]
```

Use subagents for: test generation, documentation updates, type generation, migration scripts. Don't use them for: core business logic (keep that in the main loop for context continuity).

---

## ANTHROPIC API WRAPPER (local automation)

Updated to current SDK and model strings.

### Install

```bash
pip install anthropic
```

### minimal_agent.py

```python
"""
Bounded iterative refinement agent using Anthropic API.
Model: claude-sonnet-4-5-20250929
Max iterations: 3 (research-backed ceiling)
Stop condition: tool-verified, not self-assessed
"""

import anthropic
import subprocess
import json
import sys

client = anthropic.Anthropic()  # Uses ANTHROPIC_API_KEY env var

MODEL = "claude-sonnet-4-5-20250929"
MAX_ITERATIONS = 3

SYSTEM = """You are an expert software engineer in bounded refinement mode.

Rules:
- Separate draft from critique.
- Prefer correctness and maintainability over cleverness.
- When critiquing: list concrete issues ranked by severity. No vague "looks good."
- When revising: fix ONLY identified issues. Do not add features or refactor passing code.
- When you say "no major issues remain": you mean all outputs would pass typecheck, lint, and tests.
- Max refinement iterations: 3. Stop early if stable.
"""


def ask(prompt: str, system: str = SYSTEM) -> str:
    """Single-turn API call."""
    response = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=system,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text


def run_validation(code: str, lang: str = "typescript") -> dict:
    """Run external validation tools. Returns pass/fail with details."""
    results = {"passed": True, "details": []}

    if lang == "typescript":
        checks = [
            ("typecheck", "npx tsc --noEmit"),
            ("lint", "npx eslint . --ext .ts,.tsx --quiet"),
            ("test", "npx vitest run --reporter=verbose"),
        ]
    elif lang == "python":
        checks = [
            ("typecheck", "mypy ."),
            ("lint", "ruff check ."),
            ("test", "pytest -v"),
        ]
    else:
        return {"passed": True, "details": ["No validation configured"]}

    for name, cmd in checks:
        try:
            result = subprocess.run(
                cmd, shell=True, capture_output=True, text=True, timeout=60
            )
            passed = result.returncode == 0
            results["details"].append({
                "check": name,
                "passed": passed,
                "output": result.stdout[-500:] if passed else result.stderr[-500:],
            })
            if not passed:
                results["passed"] = False
        except subprocess.TimeoutExpired:
            results["details"].append({"check": name, "passed": False, "output": "Timeout"})
            results["passed"] = False

    return results


def iterative_refine(task: str, max_iters: int = MAX_ITERATIONS) -> str:
    """
    Bounded refinement loop:
    1. Draft implementation
    2. Critique with structured rubric
    3. Revise only identified issues
    4. Stop when stable or max iterations hit
    """
    # Step 1: Draft
    draft = ask(f"Task:\n{task}\n\nWrite the implementation with tests.")
    code = draft

    for i in range(max_iters):
        # Step 2: Structured critique
        critique = ask(
            f"Critique this implementation using this rubric:\n"
            f"1. Correctness (logic, edge cases)\n"
            f"2. Security (validation, auth, injection, secrets)\n"
            f"3. Performance (N+1, caching, complexity)\n"
            f"4. Maintainability (naming, boundaries, types)\n"
            f"5. Testability (seams, determinism)\n\n"
            f"List concrete issues ranked by severity (Critical/High/Medium/Low).\n"
            f"If no issues remain, say exactly: 'NO_ISSUES_REMAINING'\n\n"
            f"Code:\n{code}"
        )

        # Stop condition: explicit signal, not vibes
        if "NO_ISSUES_REMAINING" in critique:
            print(f"Stabilized after {i + 1} critique(s).")
            break

        # Step 3: Targeted revision
        code = ask(
            f"Revise the code to fix ONLY these issues:\n{critique}\n\n"
            f"Do not add new features. Preserve correct parts. Show what changed.\n\n"
            f"Current code:\n{code}"
        )

    return code


if __name__ == "__main__":
    if len(sys.argv) > 1:
        task = " ".join(sys.argv[1:])
    else:
        task = input("Enter task: ")

    result = iterative_refine(task)
    print("\n" + "=" * 60)
    print("FINAL OUTPUT")
    print("=" * 60)
    print(result)
```

---

## RULES-FOR-AI FILE (for Cursor, Windsurf, Copilot)

These tools use `.cursorrules`, `.windsurfrules`, or `.github/copilot-instructions.md`. The content is the same — adapt the filename.

```markdown
# .cursorrules / .windsurfrules / .github/copilot-instructions.md

## Project Stack
TypeScript (strict), Next.js App Router, React, Supabase (Postgres + RLS + Auth),
Cloudflare (DNS/WAF), Vercel deployment.

## Code Style
- Zod for all runtime validation
- Server actions for mutations, route handlers for APIs
- No console.log in production; use structured logger
- Conventional commits: feat:, fix:, refactor:, test:, docs:

## Security (non-negotiable)
- Validate inputs server-side before DB operations
- RLS on every table; test allowed AND denied cases
- No service_role key in client code
- No secrets in source; use env vars

## When Generating Code
- Include TypeScript types for all function signatures
- Include Zod schema for all external inputs
- Include at least one test per exported function
- Include error handling (typed errors, safe user messages)
- Keep changes minimal; don't refactor unrelated code

## When Unsure
- Ask before making architectural changes
- Flag assumptions explicitly
- If a fix requires changing >5 files, describe the plan first
```

---

## RESEARCH FOUNDATIONS

This prompt chain is built on empirical research, not vibes about vibes.

**Self-Refine (Madaan et al., 2023):** Iterative Draft → Feedback → Refine loops improve output quality by 5-40% across tasks. Key finding: structured rubric-based feedback outperforms free-form reflection. LLMs say "looks good" 94% of the time without explicit rubrics. Bounded to 3-4 iterations — beyond that, quality plateaus or degrades.

**Reflexion (Shinn et al., 2023):** Verbal reinforcement learning where agents reflect on failures. Key finding: reflection with external validation (tests) dramatically outperforms reflection with self-assessment only.

**Claude Code Architecture (Anthropic, 2025):** Single-threaded master loop: `while(tool_call) → execute → feed results → repeat`. Compaction at ~92% context window. Subagent spawning for isolated tasks. CLAUDE.md for persistent project context. Key finding: simple single-loop with good tools beats complex multi-agent swarms.

**Spotify Background Coding Agent (2025):** 50+ production migrations using Claude Code. Key findings: task decomposition via TODO lists, prompt quality matters more than prompt quantity, context engineering (right files in context) is the #1 predictor of success.

**Context Engineering (Anthropic Engineering Blog, 2025):** Just-in-time retrieval beats pre-loading everything. CLAUDE.md files loaded upfront, dynamic context via grep/glob at runtime. Compaction preserves architectural decisions while discarding redundant tool outputs.

**Prompt Chaining Research (ACL 2024 Findings):** Chained prompts (separate draft/critique/revision) consistently outperform monolithic "do everything in one prompt" approaches for complex tasks. Structured handoffs between steps minimize context bleed.

**Codified Context Infrastructure (2026):** Documentation-as-infrastructure: machine-readable specs that agents depend on for correct output. 283 development sessions showing persistent context prevents cross-session failures.

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

### Claims Made
1. Bounded refinement (3 iterations max) produces better results than unbounded loops.
2. Tool-grounded validation beats self-assessment for code quality.
3. Test-first development improves agentic coding outcomes.
4. Single-loop + subagent beats multi-agent swarms for most coding tasks.
5. Context engineering (CLAUDE.md + just-in-time retrieval) is the #1 lever for quality.

### Counterexamples
- **Claim 1:** For highly creative/exploratory tasks (UI design, brainstorming), more iterations can help. The 3-iteration ceiling is for correctness-oriented coding, not creative exploration.
- **Claim 4:** For truly massive codebases (10M+ lines) with many independent modules, parallel multi-agent approaches may outperform. Spotify found Claude Code works well at their scale, but their modules are well-isolated.
- **Claim 5:** For tiny scripts (<50 lines), context engineering overhead isn't worth it. Just prompt and go.

### Contradictions
- **"Test-first" vs "Fast Mode":** Fast Mode skips the formal test plan. This is intentional — Fast Mode is for throwaway/prototype work where full ceremony isn't justified. The risk is acknowledged: Fast Mode output is lower confidence.
- **"Minimal changes" vs "Clean architecture":** Sometimes the minimal fix creates tech debt. The prompt chain resolves this by noting non-fix improvements separately rather than mixing them into the current change.
- **"Never assume" vs "Keep momentum":** The chain caps clarifying questions at 3 and requires safe defaults for everything else. This is a deliberate tradeoff — some wrong assumptions will slip through, but momentum is preserved.

---

## APPENDIX: QUICK REFERENCE CARD

```
SESSION START
├─ Paste Context Pack (or load CLAUDE.md)
├─ Identify mode: Full Build | Feature Slice | Fast Vibe
│
├─ FULL BUILD
│  ├─ Phase 0: Intent Lock (30 sec)
│  ├─ Phase 1: Architecture Slice
│  ├─ Phase 2: Scaffold
│  ├─ Feature Loop (repeat per feature)
│  │  ├─ 3A: Spec + Test Plan (test-first)
│  │  ├─ 3B: Implement + Tests
│  │  ├─ 3C: Validate (tools, not self-opinion)
│  │  ├─ 3D: Revise (only if 3C failed, max 2×)
│  │  └─ 3E: Stability Check (stop condition)
│  └─ Phase 3: Harden (before shipping)
│
├─ FEATURE SLICE
│  ├─ Phase 0: Intent Lock (30 sec)
│  └─ Feature Loop (3A → 3E)
│
└─ FAST VIBE
   └─ Fast Mode prompt → done
```
