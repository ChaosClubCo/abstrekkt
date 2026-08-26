# Remediation Prompt Pack

Copy-paste prompts for Copilot Chat or Claude to close the gaps the evaluator
finds. Each is tagged `[PROD]` (production-grade, full error handling, no TODOs)
or `[SPIKE]` (exploratory/doc work). The evaluator auto-selects the relevant
subset and embeds them in the PR comment; this file is the full library plus the
auto-fix integration.

---

## 1. Repo-aware evaluation prompt (LLM judge mode)

Paste into Copilot Chat or Claude with repo access. Forces repo-first analysis,
evidence-based scoring, deterministic math, kill-switch enforcement.

```
PROJECT EVALUATION MODE (AUTONOMOUS)
SCOPE_MODE: STANDARD
INSTRUCTION: Analyze this repository FIRST. Extract facts from code, issues, PRs,
README, package.json, CI configs, commit history. Do not assume. Missing evidence
=> write "UNKNOWN" and apply penalties.
ROLE: Ruthless Project Evaluator.
GOAL: Fill the full scorecard with repo-derived evidence, compute composite /100,
emit ONE ranking row.
RULES: No optimism bias. No suggestions-only output. No rewriting code. Read-only.
Apply penalties exactly as defined in the rubric.

STEP 1 — REPO ANALYSIS: project name, owner(s), status, stack; scan for issues
citing pain, feature requests, TODO/FIXME, API deps, external services, tests,
observability, RLS/security. Cite file references.

SCORE per rubric (Pain 30, Timeline 20, Risk 20, Fit 15, Quality 15):
- Pain: Y=1 M=0.5 N=0 UNKNOWN=0 (-0.5 each UNKNOWN). /5
- Timeline: estimate from TODO density / missing tests/infra/auth. <=10:20 11-14:12 15-21:5 >21:0. +2 days per UNKNOWN phase.
- Risk: 8 rows prob*impact /200; (1-risk/200)*20 floor 0. +10 per UNKNOWN row.
- Fit: mobile/native => Replit 6-criteria %; else infer + justify. (fit/100)*15.
- Quality: 9 gates, YES only if verifiable. (gates/9)*15.

COMPOSITE = sum. KILL SWITCHES: Pain<3 => max CONSIDER; Gates<7 => cannot SHIP;
Days>14 => cannot SHIP FIRST.

OUTPUT (only the row at the end):
| Project | Status | Composite | Pain (/5) | Days | Risk (/200) | Fit % | Gates (/9) | Top 2 Risks | Next 2 Actions |
```

---

## 2. Fix Missing Quality Gates `[PROD]`

```
[PROD] Add missing quality gates to this repo: <LIST FROM EVALUATOR>.
Provide:
- zod validators for all user inputs (API params, form data, env vars)
- React error boundary component + error.tsx (if Next.js), with Sentry capture
- .env.example with all required env vars (placeholders only, NO secrets)
- Unit tests: 1 happy path + 1 edge case per MVP feature (min 6)
- Sentry (errors) + PostHog (analytics) wired end-to-end
- README with deploy/rollback steps
All code production-ready. Include run commands + a completion checklist.
```

## 3. Add Observability `[PROD]`

```
[PROD] Wire Sentry (errors) and PostHog (analytics).
- Sentry.init() in app entry; captureException in catch blocks
- PostHog capture() for signup, feature_used, error, share
- Structured logging (Pino); no PII/tokens in logs
- .env.example: SENTRY_DSN, POSTHOG_KEY placeholders
- docs/OBSERVABILITY.md (what is tracked and why) + npm run test-sentry smoke
```

## 4. Add Error Boundaries `[PROD]`

```
[PROD] Add error boundaries to every major screen (Expo/React Native or React).
- ErrorBoundary.tsx (try/catch async + Sentry.captureException)
- Fallback UI: icon + "Something went wrong" + Retry button
- Wrap HomeScreen, ProfileScreen, MainFeatureScreen individually
- Smoke test: intentionally crash each screen, verify the boundary catches it
- docs/ERROR_HANDLING.md explaining the pattern
```

## 5. Add Tests `[PROD]`

```
[PROD] Add unit tests: 1 happy path + 1 edge case per MVP feature (min 6).
Jest or Vitest. describe("Feature") { it("happy"); it("error"); }. Mock external
APIs (Stripe, Supabase). Snapshot tests for UI components. Run: npm test.
docs/TESTING.md describing each test.
```

## 6. Create .env.example `[PROD]`

```
[PROD] Create .env.example with all required env vars.
- NO secrets (use placeholders: https://xxx, sk_test_xxx, pk_live_xxx)
- Group by service: Database, Auth, Payment, API, Observability
- Comment each var. Add .env.local.example for dev overrides.
```

## 7. Buildathon Submission Bundle `[PROD]`/`[SPIKE]`

```
[PROD] Prepare this Expo app for Replit Mobile Buildathon submission.
- docs/buildathon/SUBMISSION.md: demo video link (placeholder), TestFlight link
  (placeholder), 5-bullet USP (problem, user, key feature, uniqueness, Replit
  features used), known limitations, how to run locally
- docs/PRIVACY.md (data collection, retention, contact)
- docs/SECURITY.md (secrets handling, auth flow, encryption, no PII in logs)
- app.json: name, slug, version, orientation, icon, splash, bundleIdentifier
- Error boundaries + offline UI + loading skeletons on main screens
Include "Buildathon ready: [ ]" checklist + smoke test commands.
```

## 8. Reduce Timeline Scope `[SPIKE]`

```
[SPIKE] Estimated timeline exceeds the 10-day window. Split features into Phase 1
(must-have, days 1-7) and Phase 2 (post-launch). Provide a trimmed MVP (3-5
features) that ships in 7 days, with the Phase 2 backlog listed separately.
```

---

## Option B files (semi-auto via Claude API)

The semi-auto workflow (`automation/workflows/claude-auto-fix.yml`) calls two
helper scripts defined in the source chat. Add them to `.github/scripts/`:

### `claude-fix-generator.mjs` (contract)

- Uses `@anthropic-ai/sdk` (`new Anthropic()` reads `ANTHROPIC_API_KEY`).
- `parseArgs` for `--fix-type`, `--project-dir`, `--output`.
- A `FIX_TEMPLATES` map keyed by fix type (`add-quality-gates`,
  `add-observability`, `add-error-boundaries`, `add-tests`, `env-example`,
  `buildathon-submission`), each holding a `[PROD]` instruction and target files.
- Reads `package.json` + a README excerpt as context, calls
  `client.messages.create({ model, max_tokens: 4096, messages: [...] })`, strips
  markdown fences, and `JSON.parse`s the response.
- **Must validate** the response has `id`, `filesModified`, and `changes`; throw
  otherwise. Output JSON shape:
  ```json
  {
    "id": "fix-123",
    "summary": "Added zod validators, error boundary, tests",
    "filesModified": ["src/lib/validators.ts", ".env.example"],
    "changes": [{ "file": "src/lib/validators.ts", "action": "create", "content": "..." }]
  }
  ```
- Pin the model to a current Claude model id at install time.

### `apply-fix.mjs` (contract)

- `parseArgs` for `--fix-file`, `--target-dir`.
- For each `change`: `mkdir -p` the dir; `action: "create"` writes the file;
  `action: "update"` does a `find`→`replace` on existing content.
- Prints what it created/updated.

> Security: the generator is the only component that needs a credential. Keep it
> behind the draft-PR review gate (Option B). For Option C (zero-review), use the
> strict variants gated by lint + typecheck + tests with auto-revert — and only
> for low-risk fix types (`env-example`, `docs`, config). Never for auth, schema,
> or business logic.

## Auto-fix options (A / B / C) recap

- **A — Manual (safest):** paste a prompt above into Copilot/Claude, review, commit, re-run `/evaluate`.
- **B — Semi-auto (recommended):** dispatch `claude-auto-fix.yml`, review the draft PR, merge.
- **C — Zero-review (risky, low-risk only):** Claude commits to a branch, CI runs
  lint+typecheck+tests; pass → auto-merge, fail → auto-revert + open an issue.
