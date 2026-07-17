# AppSec-First Vibe Coding: A Self-Taught Engineer's Playbook

**Kyle Rosebrook · Self-taught engineer · Updated May 2026**

I did not come up through a traditional CS path. I came from hospitality and retail management, which means I learned systems thinking from a different angle: how failure modes in a service environment propagate, how trust between components breaks down under load, how the gap between "works in the demo" and "works at 2am when no one is watching" is almost entirely a function of how seriously you modeled failure before you shipped.

That framing transfers directly to vibe coding. The tools are fast. The outputs are often good enough to look right.

The failure modes are not obvious. The security gaps I've found in AI-generated production code were not caused by bad engineering — they were caused by engineers who trusted confident output without modeling the failure modes first.

What follows is four tips and an incident ledger. The tips are how I work. The ledger is what's actually been caught.

---

## Tip 1: AI Models Confidence, Not Correctness

> *"It will generate syntactically valid, logically confident, and subtly wrong code for edge cases it wasn't trained on."*

The model gives you what looks like a complete answer. It does not flag what it doesn't know. It does not flag what *you* didn't know to ask. That gap is yours to close.

**Missing validation on untrusted input.** Default behavior treats function arguments as clean. If the input originates from user-controlled sources, you're responsible for adding sanitization, type enforcement, and bounds checking. The AI will not add it unless you explicitly require it.

**The HumanX assessment tool, February 2026.** I had AI generate the initial architecture for a live assessment tool we were deploying at a conference booth. The first pass had three issues that worked perfectly in every functional test and would have failed in production for three different reasons:

1. **`NEXT_PUBLIC_ANTHROPIC_API_KEY` as the env var name.** In Next.js, anything prefixed `NEXT_PUBLIC_` gets inlined into the browser JS bundle. The key would have been scrapable from the bundle on page load. Anthropic's browser CORS policy would have blocked the call anyway, but the leaked key is the bigger problem.
2. **AWS Lambda backup URL exposed client-side**, also as a `NEXT_PUBLIC_` variable. Anyone with DevTools could have POSTed garbage to it.
3. **No rate limiting on any endpoint that called a paid API.** A bored attendee on Moscone WiFi running a script could have racked up real Claude fees fast.

I caught all three in a pre-deploy audit. None of them were bugs in the AI's logic. The code did exactly what I asked for. The AI had no way to know the deployment surface — that conference WiFi attracts adversarial curiosity, that `NEXT_PUBLIC_` bleeds to the bundle, that paid APIs need cost ceilings independent of usage logic. You have to bring that context to the session *before* you start, not after you ship.

The fix was a server-side proxy route. Browser hits `/api/assess`; the server hits Anthropic. Key never touches the client. Per-IP throttle (10/hour) in the same route. Lambda call moved server-side too.

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

**The meta-prompt pattern I use.** I enforce this with a structured prompt protocol that takes a `SCOPE_MODE` parameter:

- `SCOPE_MODE: LITE` = spec + constraints only
- `SCOPE_MODE: STANDARD` = spec + arch + implementation plan
- `SCOPE_MODE: FULL` = complete implementation with tests, security notes, and observability hooks

The model doesn't move to code until the architecture is stated. This is the single highest-leverage habit for preventing AI-generated technical debt.

**What skipping this actually costs — full audit on the same HumanX tool.** When I ran a complete pre-deploy audit, the three secret-and-throttle issues from Tip 1 were just part of the picture. The complete audit found seventeen findings. Most of them were not security issues in isolation — they were the cost of generating code without an architecture document first:

- Missing HSTS header. No Content Security Policy. No `X-Frame-Options`.
- Null byte injection accepted in path parameters.
- The QR code component pulled from `api.qrserver.com` — an external CDN that Moscone's conference WiFi firewall blocks. The QR feature would have failed silently at the booth.
- No `.gitignore`, so `.env.local` would have committed to GitHub on the first push.
- No print stylesheet — the "Save Report" button rendered garbage.
- No viewport meta tag — iOS Safari rendered the wrong layout.
- `crypto.randomUUID()` used unguarded — throws on roughly 8% of older Android WebViews, which exist in the conference attendee population.

Zero of these were bugs in the AI's output. Every one of them was a constraint that wasn't written down before generation began. The rebuild took a full day. The architecture document would have taken twenty minutes.

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

**What this caught in production — Intinc.AI platform, March 2026.** I ran the seven-question pass against the AI chat route and intelligence generation endpoint. The code had monthly plan limit checks — it correctly enforced subscription tiers. Question 7 (missing validation) flagged that there was no per-minute rate limit on either endpoint.

Monthly limit ≠ abuse protection. A single session could send a thousand requests per minute and remain "within plan" for the whole burst. At per-Claude-call cost, the bill compounds fast — well into the hundreds within an hour, before the monthly cap fires. The AI implemented exactly what I asked for: plan enforcement. It had no way to know I also needed request throttling. That gap only surfaces if you ask for it explicitly. The fix was four lines of middleware. The cost of not asking would have been a live cost-amplification surface.

---

## Tip 4: Incremental Review Must Be Structural, Not Personal

> *"Code review discipline degrades under velocity pressure. The solution is not better intentions. It is gates that don't close until requirements are met."*

Personal discipline is not a reliable security control. These are structural gates that enforce review before progression — independent of how fast the sprint is moving:

- **CI smoke step** — runs on every commit, fails fast on linting, type errors, and basic security patterns (hardcoded secrets, unsafe eval, missing env var guards). No merge without green CI.
- **CODEOWNERS enforcement** — security-sensitive paths (auth, data access, API boundaries, RLS policies) require review from a designated owner. Not just "a reviewer." The right reviewer.
- **RLS policy review requirement** — any migration touching a table with user or tenant data requires explicit RLS policy review before merge. Separate checklist item, not implied by code review.
- **Test gate** — tests written alongside the feature, not after. AI-generated code ships with AI-assisted tests, both reviewed before merge.
- **Staged deployment with smoke verification** — no production deploy without a post-deploy smoke step. Failures trigger automatic rollback.

The reason engineers skip review steps under pressure is that the steps are perceived as friction. The reframe that works: these are not review steps, they are the definition of done. Code that hasn't passed the gates isn't ready. It isn't a judgment call. It's a state.

**Two findings from the same Intinc.AI audit, March 2026** — both passed every functional test, both got caught only by reading the code adversarially against a checklist:

The first was a row-level security scope gap. The user-facing RLS was correct: users could only access their own playbooks and conversations. But the admin dashboard queried both tables directly with no admin-specific policy. Tests written from the user's perspective all passed. Code review passed because the RLS policies existed and looked correct — nobody had checked whether they covered the admin path specifically. The fix was an explicit admin select policy on each table, gated on a profiles-table role check. The deeper fix was a checklist item: *"verify RLS for every query path, not just the primary user flow."*

The second was subtler and more dangerous in a different way. The middleware file had a block for admin routes that was *entirely a comment*: "This block is a placeholder for future JWT claims-based role check." The actual protection worked — `requireRole('admin')` in the admin layout enforced access correctly. But the middleware comment created the impression of two-layer protection when only one layer existed. Anyone reading the codebase and concluding "admin routes are protected at middleware" would have been wrong. Comments that look like enforcement are worse than no comment at all. Fix: removed the misleading comment, documented in `SECURITY.md` that middleware does origin check only and role enforcement is at the layout level.

Structural gates catch what good intentions miss under deadline pressure. One of these would have been a real data exposure if it had shipped. The other was a slow-motion failure — code that would have looked safe to the next developer who came to read it.

**The honest version of this tip:** gates are the goal, not the guarantee. On DashGen — a live deployed app — a Playwright E2E audit run against the *production URL* found six missing security headers and client-side auth guards that rendered protected content without redirecting. That code was already in production. The gate didn't catch it because the gate didn't exist yet for that project. The lesson isn't "feel bad about it." It's: if pre-deploy gates aren't in place, a recurring post-deploy audit against the live surface is the minimum compensating control. Audit the thing that's actually running, not just the thing in the repo.

---

## AI Trust Calibration Matrix

Not all AI-generated output carries the same risk. Calibrate review depth to the actual blast radius.

| Output Type | Trust Level | Required Review Action |
|-------------|-------------|------------------------|
| Auth handlers / session logic | **Never trust** | Full adversarial review + CODEOWNERS sign-off |
| Data access / RLS-adjacent queries | **Low trust** | RLS policy review + tenant scope verification |
| API endpoints / input handling | **Low trust** | Input validation + 7-question adversarial pass |
| Business logic / algorithms | **Medium trust** | Unit test coverage + edge case review |
| UI components / boilerplate | **Higher trust** | Standard code review, no special protocol |

---

## Incident Ledger

A scannable record of caught-and-fixed AppSec issues from real codebases. Every entry is a real catch on a real codebase. Most were caught before production exposure. One (DashGen) was caught *after* the app was already live — that one is the most instructive, because pre-deploy discipline is the goal but post-deploy auditing is the reality you live in when you ship fast.

| # | Project | Date | Gap Type | What AI Missed | How Caught | Fix |
|---|---------|------|----------|----------------|------------|-----|
| 1 | HumanX Assessment Tool | Feb 2026 | Client-side secret exposure | `NEXT_PUBLIC_ANTHROPIC_API_KEY` inlined into browser bundle; AWS Lambda backup URL also exposed client-side as `NEXT_PUBLIC_` var | Pre-deploy audit | Server-side proxy route at `/api/assess`; env var renamed to `ANTHROPIC_API_KEY`; Lambda call moved server-side |
| 2 | HumanX Assessment Tool | Feb 2026 | Cost-amplification vector | Zero rate limiting on endpoints calling a paid LLM API | Pre-deploy audit (every paid-API endpoint reviewed for throttle) | In-memory per-IP throttle (10/hour) + 25-second server timeout |
| 3 | HumanX Assessment Tool | Feb 2026 | Architecture-gap cluster | 17 missing controls including external QR CDN, missing `.gitignore`, no print CSS, no viewport meta, no security headers, unguarded `crypto.randomUUID()` | Full pre-deploy audit traced back to no architecture doc | One-day rebuild with explicit architecture; inline QR generation via `qrcode` npm package; security headers in `next.config.js`; UUID polyfill |
| 4 | INT Smart Triage AI 2.0 | Nov 2025 | No error handling on browser storage | `localStorage.getItem`/`setItem` calls with no try/catch; entire React tree unmounts in private browsing mode | PR #110 review thinking through worst-case demo scenarios | `safeLocalStorage` wrapper with try/catch on both ops; error boundary at provider level; fail-silent pattern |
| 5 | INT Smart Triage AI 2.0 | Nov 2025 | Auth bypass + service-role exposure | `/api/analytics` endpoint had no auth check AND used the Supabase service-role key (bypasses RLS); returned all org data on public POST | GitHub PR review (PR #102) | `getServerSession` check returning 401; role whitelist (admin/analyst/manager) returning 403; switched from service-role to anon client + RLS; per-access audit log |
| 6 | Intinc.AI | Mar 2026 | Monthly quota with no per-minute throttle | Plan limits enforced correctly; nothing prevented a thousand-RPM single-session burst within plan | 7-question adversarial review (Q7: missing validation) | Per-IP throttle middleware before plan check |
| 7 | Intinc.AI | Mar 2026 | RLS scope gap (admin path uncovered) | `playbooks` and `conversations` had user-scoped RLS but no admin-specific policy; admin queries silently broken or over-privileged depending on table | Full codebase audit (SEC-2) | Admin select policies gated on profiles-table role check; checklist item: "verify RLS for every query path" |
| 8 | Intinc.AI | Mar 2026 | Comment-only role check creating false confidence | Middleware admin-routes block was entirely a placeholder comment; actual protection lived in layout's `requireRole()` | Full codebase audit (SEC-3) | Removed misleading comment; documented real protection layer in `SECURITY.md` |
| 9 | FlashFusion (waitlist) | Apr 2026 | Email enumeration | Position-lookup endpoint keyed off a base64-encoded email — trivially decodable and iterable, so anyone could harvest who was on the waitlist | Self-directed post-build hardening pass against own work | Replaced with signed HS256 JWT (7-day expiry, single-purpose claim, zero-dependency Web Crypto); old email endpoint deleted entirely |
| 10 | FlashFusion (waitlist) | Apr 2026 | Rate limiter ineffective in serverless | In-memory rate limiter resets on every Vercel cold start — in a serverless deployment that means effectively no rate limiting, not "resets occasionally" | Same self-directed hardening pass; recognized the cold-start pattern from prior HumanX work where it was acceptable for a one-day conference but not for a live waitlist | Upstash Redis-backed limiter across all 5 API routes, per-route configs (auth tightest at 3/min); in-memory fallback retained only for local dev |
| 11 | DashGen (live app) | Apr 2026 | Missing security headers + non-redirecting auth guard — **caught post-deploy** | Deployed app served zero of: CSP, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy. Protected routes used client-side guards that rendered landing content without changing the URL — looked authenticated-gated, wasn't | Playwright E2E audit run against the **live production URL**, not the source | Drop-in Express `security-headers.js` middleware with CSP scoped to the exact stack (Google Fonts, Replit domains, all 3 OAuth providers); flagged the client-side guard as needing server-side route protection |

---

The tools are fast. The failure modes are not obvious. The security gaps I've found in AI-generated production code were not caused by bad engineering — they were caused by engineers who trusted confident output without modeling the failure modes first.

Architecture-first. Adversarial review on security surfaces. Structural gates that enforce quality independent of velocity pressure. These are not restrictions on how you use AI. They are the conditions under which AI actually accelerates safe production output.
