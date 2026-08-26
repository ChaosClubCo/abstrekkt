# Vibe Coding Playbook: AppSec-First AI Development at Enterprise Scale

**Kyle Rosebrook · Self-taught engineer · March 2026**

---

I did not come up through a traditional CS path. I came from hospitality and retail management, which means I learned systems thinking from a different angle: how failure modes in a service environment propagate, how trust between components breaks down under load, how the gap between "works in the demo" and "works at 2am when no one is watching" is almost entirely a function of how seriously you modeled failure before you shipped.

That framing transfers directly to vibe coding. The tools are fast. The outputs are often good enough to look right. The failure modes are subtle — they surface at security boundaries, in multi-tenant data access patterns, and in edge cases that weren't covered by the prompt that generated the code.

This playbook is what I apply to every AI-assisted system I build. It assumes you know how to code. It's about knowing how to code with AI without introducing the classes of problems that get caught in prod instead of review.

---

## Tip 1: Model Failure Modes Before You Prompt

> *"Confident output and correct output are independent variables. At security boundaries they're often inversely correlated."*

AI code generation fails in patterned ways. These aren't random bugs — they're structural gaps you can model before you start:

**Implicit permission assumptions.** AI defaults to "authenticated = authorized." It will generate code that checks for a valid session token and assumes that's sufficient. Row-level authorization, tenant isolation, and role-scoped access are not implicit. You have to require them explicitly.

**Context window contamination.** In long sessions, early assumptions bleed into later outputs. The auth model you described in turn three will silently inform the data access pattern generated in turn fourteen. Validate late-session outputs against your actual architecture, not the session history.

**Confident wrongness at interfaces.** AI is most dangerous at API boundaries, database queries, and auth handlers — exactly where errors have the highest blast radius. It will generate syntactically valid, logically confident, and subtly wrong code for edge cases it wasn't trained on.

**Missing validation on untrusted input.** Default behavior treats function arguments as clean. If the input originates from user-controlled sources, you're responsible for adding sanitization, type enforcement, and bounds checking. The AI won't add it unless you explicitly require it.

**What this looked like in practice:** I ran a security audit on a Supabase project. The `invite_codes` and `api_keys` tables had no Row Level Security policies. They existed, they worked, they passed functional tests. But any authenticated user could query any row. The AI that generated the initial schema had no way to know the multi-tenant requirements — it built what multi-tenant schemas generally look like. General is not the same as correct for your system.

---

## Tip 2: Architecture-First Is Non-Negotiable

> *"Features built without a modeled architecture are technical debt with a polished UI. AI accelerates the rate at which you can accumulate that debt."*

Before you prompt for any feature, system, or component, the following must be modeled explicitly. Not implied. Not assumed. Written down where you can reference them in the session:

- **System boundaries:** What is inside this system and what is outside it? Where does trust change?
- **Data flows:** Where does data enter, what transforms it, where does it persist, who can read it?
- **State transitions:** What are the valid states of each entity? What triggers each transition? What's invalid?
- **Auth model:** Authentication mechanism, session lifecycle, authorization model (RBAC/ABAC/tenant-scoped), token storage, revocation.
- **Failure modes:** What happens when each dependency is unavailable?
- **Abuse vectors:** Who are the adversarial actors? What do they gain by breaking each component? What's the blast radius?

**The meta-prompt pattern I use:** I enforce this via a structured prompt protocol with an explicit `SCOPE_MODE` parameter:

- `SCOPE_MODE: LITE` = spec + constraints only
- `SCOPE_MODE: STANDARD` = spec + arch + implementation plan
- `SCOPE_MODE: FULL` = complete implementation with tests, security notes, and observability hooks

The model doesn't move to code until the architecture is stated. This is the single highest-leverage habit for preventing AI-generated technical debt.

**What skipping this actually costs.** I ran an end-to-end HTTP audit on a production domain. What it found without architecture-first development:

- **Missing HSTS header** — allows protocol downgrade attacks. Not caught in functional testing.
- **No Content Security Policy** — XSS surface left open. AI-generated HTML templates don't add CSP by default.
- **No rate limiting on auth endpoints** — brute force surface fully open. Auth logic generated correctly, protection layer never added because it wasn't in the prompt.
- **Null byte injection accepted** — input handling generated without considering non-printable characters in path parameters.

None of these were bugs in the code. They were gaps in the architecture that was never written down before the code was generated.

---

## Tip 3: Security Prompting Is a Discipline, Not a Checkbox

> *"The model will answer questions you ask. It will not ask the questions you didn't think of. Your job is to have a standing list of questions that covers the failure modes you've seen."*

After generating any security-relevant code — auth handlers, data access layers, API endpoints, input processing — run this prompt verbatim:

```
Adversarial security review. For the code above, answer each question:

1. UNTRUSTED INPUT: Which function parameters could carry
   user-controlled data? Is each one validated before use?

2. SQL / QUERY CONSTRUCTION: Is any query assembled via
   string concatenation? If so, where and with what input?

3. CONCURRENCY: Are there race conditions possible under
   concurrent requests? Identify any shared mutable state.

4. DATA EXPOSURE: What data does this return or log?
   Is any of it sensitive? Is it scoped to the requesting
   user or tenant?

5. FAIL BEHAVIOR: Does this fail open or fail closed?
   What is the default behavior on error?

6. IMPLICIT PERMISSIONS: Does this code assume that
   authentication implies authorization? Where?

7. MISSING VALIDATION: What inputs, states, or edge cases
   are not covered by explicit validation?
```

This is not a comprehensive security review. It is the minimum viable adversarial pass for code that touches auth, data access, or user input.

**RLS violation caught by this pattern:** During a code review cycle, I ran this prompt on a data access function that had passed functional tests. Question 6 flagged that the query was scoped to authenticated users generally — not to the requesting user's tenant. The Supabase RLS policy existed on the table but was not enforced at the application layer. Both layers need to hold. The AI had generated one.

---

## Tip 4: Incremental Review Must Be Structural, Not Personal

> *"Code review discipline degrades under velocity pressure. The solution is not better intentions. It is gates that don't close until requirements are met."*

Personal discipline is not a reliable security control. These are structural gates that enforce review before progression — independent of how fast the sprint is moving:

- **CI smoke step** — runs on every commit, fails fast on linting, type errors, and basic security patterns (hardcoded secrets, unsafe eval, missing env var guards). No merge without green CI.
- **CODEOWNERS enforcement** — security-sensitive paths (auth, data access, API boundaries, RLS policies) require review from a designated owner. Not just "a reviewer." The right reviewer.
- **RLS policy review requirement** — any migration touching a table with user or tenant data requires explicit RLS policy review before merge. Separate checklist item, not implied by code review.
- **Test gate** — tests written alongside the feature, not after. AI-generated code ships with AI-assisted tests, both reviewed before merge. The project I'm most actively maintaining has 529+ unit tests and Playwright E2E coverage.
- **Staged deployment with smoke verification** — no production deploy without a post-deploy smoke step. Failures trigger automatic rollback.

The reason engineers skip review steps under pressure is that the steps are perceived as friction. The reframe that works: these are not review steps, they are the definition of done. Code that hasn't passed the gates isn't ready. It isn't a judgment call. It's a state.

---

## AI Trust Calibration Matrix

Not all AI-generated output carries the same risk. Calibrate review depth to the actual blast radius.

| Output Type | Trust Level | Required Review Action |
|---|---|---|
| Auth handlers / session logic | **Never trust** | Full adversarial review + CODEOWNERS sign-off |
| Data access / RLS-adjacent queries | **Low trust** | RLS policy review + tenant scope verification |
| API endpoints / input handling | **Low trust** | Input validation + 7-question adversarial pass |
| Business logic / algorithms | **Medium trust** | Unit test coverage + edge case review |
| UI components / boilerplate | **Higher trust** | Standard code review, no special protocol |

---

The tools are fast. The failure modes are not obvious. The security gaps I've found in AI-generated production code were not caused by bad engineering — they were caused by engineers who trusted confident output without modeling the failure modes first.

Architecture-first. Adversarial review on security surfaces. Structural gates that enforce quality independent of velocity pressure. These are not restrictions on how you use AI. They are the conditions under which AI actually accelerates safe production output.

---

*Kyle Rosebrook · [kylerosebrook.com](https://kylerosebrook.com)*
