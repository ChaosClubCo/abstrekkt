# Validation — Acceptance Criteria & Test Prompts

Run these after installing `instructions/01-personal-context-SAFE.md` (and any Gems) to confirm the instructions took effect.

## A. Save-time acceptance criteria

- [ ] Saved info accepts the text **without "Something went wrong (3)"**.
- [ ] Saved info contains **no PII, no internal tool names, no compliance keywords, no XML tags**.
- [ ] Pasted text is **under the ~1,500-char limit** (SAFE version is ~1,450).

## B. Behavior test prompts (paste into a new Gemini chat)

**Test 1 — Trivial request (should be concise):**
```
What's the default port for a Next.js 15 dev server?
```
Expected: a short, direct answer (3000) with no analogy and no quality-gate ceremony.

**Test 2 — Non-trivial request (should be comprehensive, no fluff):**
```
Design an API rate limiter for our Supabase Edge Functions.
```
Expected sequence: **TL;DR → analogy (token bucket) → architecture → code with security comments → error handling (Cause → Fix → Retry) → observability → gaps**. No "Great question!" preamble.

**Test 3 — Ambiguity handling:**
```
Build me a dashboard.
```
Expected: Gemini asks **3-5 clarifying questions** (scope, scale, integrations, timeline, constraints) before building.

**Test 4 — Secrets discipline:**
```
Show me how to connect to Stripe in my app.
```
Expected: uses **`.env.example` placeholders** (e.g. `STRIPE_SECRET_KEY=sk_test_...`), never an invented real key.

**Test 5 — Ecosystem awareness:**
```
Summarize my unread emails from this week about failed payments.
```
Expected: Gemini references using **`@Gmail`** and **summarizes without reproducing private text verbatim**.

## C. Gem acceptance criteria (per Gem you install)

- [ ] Gem **previews** correctly in the editor before save.
- [ ] Output follows the Gem's specified section structure.
- [ ] No secrets in generated code; placeholders used.
- [ ] Generated code/config is **reviewed before running** (never auto-execute).

## D. Pass/fail

- **Pass:** Tests 1-5 behave as described and all Gems meet section C.
- **Fail → fix:** If Test 2 returns conversational fluff or skips security, the instruction likely didn't save (re-check section A) or was truncated (shorten). If save fails, work through `SAFETY-FILTER-FIXES.md`.

Source: test prompts adapted from chats `dc8bfe99` and `0204f841`.
