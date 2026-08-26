# VISTADEL × Platform Toolkit Integration Guide

**Version:** 1.0 | **Last Updated:** March 2026 | **Owner:** Kyle (Staff Engineer, AppSec & Platform)

This guide maps INT's Platform Toolkit (audit CLI, scaffolder, reference library) into each VISTADEL phase. Every app — whether new build, vibecoded migration, or client delivery — flows through these gates.

---

## How the Pieces Fit

```
VISTADEL Phase    Tool/Asset                         Gate Check
─────────────    ──────────────────────────          ──────────────
V: Vision     →  Audit CLI (scan existing app)    →  Overall ≥ 30
I: Integration→  Supabase addon + RLS templates   →  Security ≥ 40
S: Stack      →  CLI Scaffolder (template select) →  Quality ≥ 50
T: Testing    →  Built-in test suites + CI/CD     →  Testing ≥ 40
A: AI Impl    →  Sentry/PostHog addons + Claude   →  Production ≥ 50
D: Deployment →  Reference library + CI configs   →  Target Score ≥ 60
E: Evolution  →  Re-audit cycle + dashboard       →  All Scores ≥ 60 avg
L: Launch     →  Security/PWA checklists          →  Overall ≥ 70
```

---

## Phase V: Vision — "Is This App Worth Building/Converting?"

**The Question:** Should this app exist? If it already exists (vibecoded), should we invest in converting it?

**Toolkit Actions:**

1. **For existing apps (~75-90 vibecoded):** Run the audit CLI against the repo.
   ```bash
   intinc-audit scan --dir ./existing-app
   # or for GitHub repos:
   intinc-audit scan --repo intinc/crm-dashboard --token $GITHUB_TOKEN
   ```

2. **For batch assessment:** Scan the entire org at once.
   ```bash
   intinc-audit batch --org intinc --token $GITHUB_TOKEN --output vision-audit.json
   intinc-audit export --input vision-audit.json --format csv
   ```

3. **Review in dashboard:** Paste `vision-audit.json` into the Audit Dashboard artifact. Filter by `discontinue` to identify apps to archive immediately.

**Gate: Overall Score ≥ 30**

| Score | Decision | Action |
|---|---|---|
| 0-15 | **Archive** | Move to `intinc-archive/` org. Don't invest. |
| 16-29 | **Rebuild or Archive** | If business value exists, rebuild from scratch using scaffolder. |
| 30-49 | **Convert with prep** | Needs refactoring before conversion. Proceed to Phase I. |
| 50+ | **Convert directly** | Good candidate. Proceed to Phase I. |

**Deliverables:**
- Audit results JSON + CSV for all candidate apps
- Go/no-go decision per app documented in spreadsheet "Notes" column
- Batch of apps cleared for Phase I

---

## Phase I: Integration — "What Does This App Touch?"

**The Question:** What data flows, APIs, auth patterns, and compliance requirements exist?

**Toolkit Actions:**

1. **Review audit security score.** Apps scoring <40 on security need auth + RLS before anything else.

2. **Select addons during scaffolding** (for new builds):
   ```bash
   intinc-scaffold create
   # When prompted for addons, select:
   # ✔ Supabase Integration (auth, RLS, real-time)
   # ✔ Stripe Payments (if applicable)
   # ✔ Sentry Error Tracking
   ```

3. **For existing apps:** Use the reference library's Supabase integration patterns.
   - `code/pwa-react/src/hooks/usePushSubscription.ts` — push notification subscription flow
   - `code/push-server/` — VAPID push server with subscription management
   - `supabase/migrations/001_init.sql` — RLS policy templates from the Supabase addon

**Gate: Security Posture ≥ 40**

Minimum requirements to pass:
- Authentication configured (Supabase Auth, Clerk, or Auth0)
- Row-Level Security policies on all user-facing tables
- Environment variables externalized (no hardcoded secrets)
- CORS configured for production domains only

**Reference Library Assets:**
- `docs/10-security-hardening.md` — OWASP Top 10 mapping
- `templates/electron-security-checklist.md` — Electron-specific security audit
- `diagrams/svg/security-boundaries.svg` — Electron renderer/main process boundaries
- `diagrams/mermaid/network-topology.mermaid` — Client → CDN → Origin flow

---

## Phase S: Stack — "What Are We Building With?"

**The Question:** Which template + framework + deployment target is right for this app?

**Toolkit Actions:**

1. **Use audit recommendation.** The CLI already recommends PWA, Electron, Tauri, keep-web, or discontinue.

2. **Scaffold the project:**
   ```bash
   # Interactive (recommended for first-timers)
   intinc-scaffold create

   # Quick mode (for scripts/CI)
   intinc-scaffold create --template electron-react --name client-portal \
     --addons supabase,stripe,sentry --pm pnpm --yes
   ```

3. **Template selection guide:**

   | App Needs | Template | Why |
   |---|---|---|
   | Works offline, installable, push notifications | `pwa-react` | Zero install, browser-based, SW handles offline |
   | File system access, system tray, native APIs | `electron-react` | Full desktop capabilities, auto-update |
   | Small binary, performance-critical, Rust backend | `tauri-react` | 40-50MB vs 200MB Electron, native performance |
   | Framework-agnostic modules for existing apps | `pwa-vanilla` or `electron-vanilla` | Drop-in modules, no framework lock |
   | Push notification infrastructure | `push-server` | Standalone VAPID server, SQLite subscriptions |

**Gate: Code Quality ≥ 50**

Scaffolded projects start at ~65 quality score (TypeScript strict, ESLint, Vite, structured architecture). To maintain:
- Keep TypeScript strict mode (`strict: true` in tsconfig)
- Don't disable ESLint rules without documented reasoning
- Keep dependency count under 40 for PWA, under 50 for Electron

**Reference Library Assets:**
- `docs/02-pwa-decision-framework.md` — When to PWA vs native
- `docs/04-native-vs-pwa-vs-electron.md` — Comparison deep dive
- `diagrams/svg/comparison-matrix.svg` — PWA vs Electron vs Native vs Tauri
- `diagrams/svg/migration-paths.svg` — Effort estimates per conversion path

---

## Phase T: Testing — "Can We Ship Without Breaking Things?"

**The Question:** Do we have enough test coverage to refactor and deploy with confidence?

**Toolkit Actions:**

1. **Scaffolded projects include test infrastructure.** Every template ships with:
   - `vitest.config.ts` — Unit test runner with 70% coverage thresholds
   - `tests/` — Starter unit tests for hooks and utilities
   - `playwright.config.ts` — E2E config (PWA templates)
   - `.github/workflows/ci.yml` — Lint → typecheck → unit → E2E → build

2. **Run tests:**
   ```bash
   pnpm test              # unit tests
   pnpm test -- --coverage # with coverage report
   pnpm test:e2e          # E2E (PWA templates)
   pnpm typecheck         # TypeScript strict checks
   ```

3. **For existing apps:** Add test infrastructure from the reference library:
   - Copy `code/pwa-react/vitest.config.ts` and `tests/setup.ts`
   - Copy `code/pwa-react/playwright.config.ts` for E2E
   - Copy `ci/.github/workflows/pwa-ci.yml` for CI pipeline

**Gate: Test Coverage ≥ 40**

| Coverage | Status | Action |
|---|---|---|
| 0-20% | **Blocked** | Cannot proceed. Add tests for critical paths. |
| 20-39% | **At risk** | Add integration tests. Proceed with caution. |
| 40-69% | **Acceptable** | Meets gate. Continue improving incrementally. |
| 70%+ | **Production grade** | Target state. Maintain with CI enforcement. |

**Reference Library Assets:**
- `code/pwa-react/tests/` — Example unit tests (hooks, utils)
- `code/pwa-react/e2e/pwa.spec.ts` — PWA-specific E2E tests
- `ci/.github/workflows/` — CI configs for all three platforms
- `diagrams/svg/deployment-pipeline.svg` — CI/CD stage visualization

---

## Phase A: AI Implementation — "How Is Claude Helping Us Build?"

**The Question:** Where does AI accelerate development, and what guardrails prevent hallucination/cost issues?

**Toolkit Actions:**

1. **Add monitoring addons** during scaffolding:
   - Sentry for error tracking + performance tracing
   - PostHog for product analytics + feature flags

2. **Claude Code CLI integration** for iterative development:
   ```bash
   # Audit → fix → re-audit cycle
   intinc-audit scan --dir .          # baseline score
   # ... Claude Code fixes issues ...
   intinc-audit scan --dir .          # verify improvement
   ```

3. **Cost controls:** Use circuit breakers from the reference library patterns:
   - Rate limiting on Claude API calls
   - Token budget per request
   - Fallback to cached responses when budget exceeded

**Gate: Production Readiness ≥ 50**

Requirements:
- Error tracking configured (Sentry DSN set, ErrorBoundary component wrapping app)
- Performance monitoring active (Sentry tracing or PostHog session recording)
- No unhandled promise rejections in production build
- Claude API calls have timeout + retry + budget limits

**Reference Library Assets:**
- Sentry addon: `src/lib/sentry.ts`, `src/components/ErrorBoundary.tsx`
- PostHog addon: `src/lib/posthog.ts`, `src/hooks/useFeatureFlag.ts`
- `diagrams/svg/performance-optimization.svg` — Build + load + runtime optimization paths

---

## Phase D: Deployment — "How Do We Ship This?"

**The Question:** What's the deploy pipeline, and does the app meet its target platform requirements?

**Toolkit Actions:**

1. **Re-run audit** to verify target platform score:
   ```bash
   intinc-audit scan --dir . --output pre-deploy-audit.json
   ```

2. **PWA deployment:**
   ```bash
   pnpm build
   # Deploy to Vercel / Netlify / Cloudflare Pages
   # Verify: Lighthouse PWA score ≥ 90
   ```

3. **Electron deployment:**
   ```bash
   pnpm build:electron
   # Outputs to release/ — macOS .dmg, Windows .exe, Linux .AppImage
   # Code signing required for distribution
   ```

4. **Tauri deployment:**
   ```bash
   pnpm build:tauri
   # ~40-50MB binary vs ~200MB Electron
   ```

**Gate: Target Platform Score ≥ 60**

| Target | Key Metrics | Reference |
|---|---|---|
| PWA | Lighthouse PWA ≥ 90, LCP < 2.5s, CLS < 0.1 | `templates/pwa-audit-checklist.md` |
| Electron | Startup < 3s, memory < 200MB, all IPC via invoke | `templates/electron-security-checklist.md` |
| Tauri | Binary < 50MB, startup < 2s, no node runtime | Tauri build config in scaffolder |

**Reference Library Assets:**
- `ci/.github/workflows/pwa-ci.yml` — Lighthouse CI integration
- `ci/.github/workflows/electron-ci.yml` — Multi-OS build matrix
- `ci/scripts/lighthouse-check.sh` — Performance gate script
- `diagrams/svg/deployment-pipeline.svg` — Full CI/CD visualization

---

## Phase E: Evolution — "What Gets Better Next?"

**The Question:** Based on data, what should we improve?

**Toolkit Actions:**

1. **Periodic re-audit:**
   ```bash
   # Run monthly against all active apps
   intinc-audit batch --org intinc --output monthly-audit-$(date +%Y%m).json
   ```

2. **Compare scores over time** in the dashboard or spreadsheet. Track:
   - Overall score trend (should increase each month)
   - Security posture (should never decrease)
   - Test coverage (should increase or hold steady)

3. **Prioritize by impact:**
   - Highest-traffic apps with lowest quality scores → fix first
   - Apps approaching VISTADEL gate thresholds → push over the line
   - Unused/stale apps → archive

**Gate: All Scores ≥ 60 Average**

If any dimension drops below 40, it blocks the app from receiving new features until addressed.

---

## Phase L: Launch — "Are We Production-Ready?"

**The Question:** Does this app pass all quality gates for public/client release?

**Toolkit Actions:**

1. **Final audit with strict thresholds:**
   ```bash
   intinc-audit scan --dir . --output launch-audit.json
   # Overall must be ≥ 70
   ```

2. **Run checklists:**
   - `templates/pwa-audit-checklist.md` — 30+ items covering caching, push, performance, security
   - `templates/electron-security-checklist.md` — IPC, CSP, code signing, update security

3. **Lighthouse verification:**
   ```bash
   bash ci/scripts/lighthouse-check.sh https://your-app.vercel.app
   # Targets: Performance ≥ 85, PWA ≥ 90, Accessibility ≥ 90, SEO ≥ 90
   ```

**Gate: Overall Score ≥ 70**

Non-negotiable launch requirements:
- All security checklist items green
- Test coverage ≥ 70%
- CI pipeline green on main branch
- No critical or high severity audit findings
- Error tracking configured and verified

---

## Quick Reference: Tool → Phase Mapping

| Tool / Asset | V | I | S | T | A | D | E | L |
|---|---|---|---|---|---|---|---|---|
| `intinc-audit scan` | ★ | | | | | ★ | ★ | ★ |
| `intinc-audit batch` | ★ | | | | | | ★ | |
| Audit Dashboard | ★ | | | | | | ★ | |
| Audit Spreadsheet | ★ | | ★ | | | | ★ | |
| `intinc-scaffold create` | | | ★ | | | | | |
| Supabase addon | | ★ | ★ | | | | | |
| Stripe addon | | ★ | ★ | | | | | |
| Sentry addon | | | | | ★ | | | |
| PostHog addon | | | | | ★ | | | |
| Test suites | | | | ★ | | | | |
| CI/CD configs | | | | ★ | | ★ | | |
| Reference library docs | | ★ | ★ | | | ★ | | ★ |
| SVG/Mermaid diagrams | | ★ | ★ | | | | | |
| PWA audit checklist | | | | | | ★ | | ★ |
| Electron security checklist | | | | | | ★ | | ★ |
