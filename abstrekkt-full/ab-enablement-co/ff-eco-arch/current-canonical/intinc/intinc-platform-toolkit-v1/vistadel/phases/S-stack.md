# Phase S: Stack

**"Choose tools that solve your problem — not tools that are popular."**

---

## What This Phase Is

Stack is where you make the technical decisions that you'll live with for the life of the project. Framework, language, database, hosting, bundler, state management, monitoring — every choice here creates a constraint downstream. Good choices create leverage. Bad choices create rework.

Phase I mapped what your app touches. Phase S decides what you build it with. The decisions are informed by your data inventory, API boundaries, auth requirements, compliance needs, and offline strategy — all outputs from Phase I. If you're making stack decisions without that context, you're guessing.

This phase is especially consequential for prototype-to-production conversions. Your prototype was built on whatever platform you happened to use — Base44, Lovable, Bolt.new, v0, Replit. The production version doesn't have to use the same stack. Phase S is where you evaluate whether the prototype's stack carries forward or gets replaced.

### Phase Gate

Do not proceed to Phase T (Testing) until:

- **Code quality score ≥ 50** (for existing prototypes re-audited after stack migration)
- **Stack decision document completed** with justification for each choice
- **Development environment running** — the team can clone, install, and start the dev server
- **TypeScript strict mode enabled** (non-negotiable for production builds in this framework)

---

## Step 1: Evaluate, Don't Default

The most common stack mistake is defaulting to what you already know without evaluating whether it fits the problem. The second most common mistake is chasing what's trending without evaluating whether it fits the problem. Both are the same error — choosing tools based on something other than the requirements.

### The Stack Decision Matrix

For each layer of your stack, evaluate against the requirements that emerged from Phase I:

| Layer | Question | What Phase I Told You |
|---|---|---|
| **Language** | TypeScript or JavaScript? | Complexity of data model, team size, long-term maintenance |
| **Framework** | React, Vue, Svelte, vanilla? | Component complexity, ecosystem needs, team familiarity |
| **Meta-framework** | Next.js, Nuxt, SvelteKit, none? | SSR needs, routing complexity, API routes |
| **Bundler** | Vite, webpack, esbuild, Turbopack? | Build speed, plugin ecosystem, HMR requirements |
| **Database** | Supabase (Postgres), Firebase, SQLite, none? | Data model, RLS needs, real-time requirements, offline |
| **Auth** | Supabase Auth, Clerk, Auth0, custom? | Roles identified in Phase I, SSO requirements |
| **Hosting** | Vercel, Cloudflare Pages, Netlify, self-hosted? | Edge requirements, serverless needs, budget |
| **Desktop wrapper** | Electron, Tauri, none (PWA only)? | File system needs, binary size constraints, native APIs |
| **State management** | Zustand, Jotai, Redux, Context, none? | State complexity, cross-component sharing needs |
| **Monitoring** | Sentry, PostHog, Prometheus, none? | Error tracking needs, analytics requirements |

### What the Audit CLI Tells You

If you're converting a prototype, the audit CLI provides a quantitative starting point:

```bash
intinc-audit scan --dir ./my-prototype --output stack-audit.json
```

The audit scores PWA readiness, Electron readiness, and Tauri readiness independently. These scores reflect what the prototype already has in place (service workers, manifests, Electron configs, Tauri configs) and what would need to be added for each target.

The recommendation engine combines these scores with code quality, security posture, and dependency analysis to suggest a primary conversion target. The suggestion is a starting point — not a mandate. Override it when your Phase I requirements point elsewhere.

---

## Step 2: Choose Your Platform Target

The first and highest-impact decision: is this app a PWA, an Electron app, a Tauri app, or does it stay web-only?

### Decision Framework

| Your app needs... | Choose | Why |
|---|---|---|
| Installable, works offline, push notifications, no download required | **PWA** | Zero-install, browser-based, service worker handles offline |
| File system access, system tray, native OS integration, auto-update | **Electron** | Full desktop capabilities, mature ecosystem |
| Same as Electron but binary size matters (< 15MB vs ~200MB) | **Tauri** | Rust backend, system WebView, dramatically smaller binaries |
| None of the above — standard web app is sufficient | **Web only** | Don't add complexity you don't need |

### When to Choose Each — Honest Tradeoffs

**PWA:**
- Strengths: no install friction, works on all platforms from one codebase, automatic updates via service worker
- Weaknesses: limited native API access (no file system beyond File API, no system tray), browser-dependent behavior differences, WebView storage limits
- Best for: content-heavy apps, dashboards, tools where offline caching is more important than file system access

**Electron:**
- Strengths: full Node.js access, mature plugin ecosystem, established deployment pipeline (electron-builder), familiar web stack
- Weaknesses: large binaries (~150-200MB), high memory usage (~150-300MB idle), Chromium bundled (security surface), slower startup
- Best for: apps that need deep OS integration, file I/O, native menus, system tray, or apps where binary size doesn't matter

**Tauri:**
- Strengths: tiny binaries (~5-15MB), low memory (~30-80MB), Rust backend (memory safe, fast), system WebView (no bundled browser)
- Weaknesses: Rust learning curve for backend commands, younger ecosystem, system WebView differences across platforms, no Node.js module access
- Best for: apps where binary size or performance matters, new projects where the team can invest in learning basic Rust

**Web only:**
- If your Phase I analysis shows no need for offline support, push notifications, file system access, or native APIs — don't add a platform layer. A standard web app deployed to Vercel or Cloudflare Pages is simpler, cheaper, and easier to maintain.

### INT OS Context

For INT's per-client OS architecture, the current recommendation is Electron for the initial version. The reasoning: INT OS requires complex MCP integration that benefits from Node.js ecosystem access, and the per-client deployment model means binary size is a secondary concern (clients download once and auto-update). The toolkit's Electron and Tauri hooks are API-compatible, making a future Tauri migration straightforward when the ecosystem matures.

---

## Step 3: Choose Your Core Stack

Once the platform target is set, the remaining decisions cascade from it.

### The INT Toolkit Default Stack

The scaffolder (`intinc-scaffold create`) generates projects with this default stack. It's not the only valid choice — it's a well-tested starting point.

| Layer | Default | Why |
|---|---|---|
| Language | TypeScript (strict) | Type safety, IDE support, catches errors at compile time |
| Framework | React 18 | Largest ecosystem, most library support, team familiarity |
| Bundler | Vite 5 | Fast HMR, clean config, growing plugin ecosystem |
| Database | Supabase (Postgres) | RLS, auth, real-time, edge functions, generous free tier |
| Auth | Supabase Auth | Integrated with database, supports OAuth providers |
| Hosting | Vercel | Edge network, zero-config deploys, preview environments |
| Monitoring | Sentry + PostHog | Error tracking + product analytics in two tools |
| CSS | Tailwind | Utility-first, no CSS file management, consistent styling |
| State | Zustand | Minimal API, no boilerplate, scales well |

### When to Deviate

| If you need... | Consider instead... |
|---|---|
| Server-side rendering | Next.js 15 on top of React |
| Smaller bundle, faster runtime | Svelte or SvelteKit |
| Vue ecosystem (existing team skill) | Vue 3 + Nuxt 3 |
| No framework at all | Vanilla TypeScript with the `pwa-vanilla` template |
| Firebase ecosystem (existing investment) | Firebase instead of Supabase — but you lose RLS |
| Self-hosted database | Raw Postgres, but you lose Supabase's auth/real-time/edge |
| Enterprise SSO | Clerk or Auth0 instead of Supabase Auth |

### TypeScript Strict Mode: Non-Negotiable

Every production project in VISTADEL uses TypeScript with `strict: true`. This is not a preference — it's a quality gate.

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

The audit CLI scores TypeScript strict mode as part of code quality. Projects without it start with a significant quality penalty. If your prototype was built in JavaScript, the migration to TypeScript is part of Phase S — not deferred to later.

### For Prototypes Being Rebuilt

Your prototype's stack was chosen by the vibecoding platform, not by you. Phase S is where you make a deliberate choice:

- **Base44 prototypes:** React-based, typically need migration to standard React + Vite. Base44-specific APIs and components don't carry over.
- **Lovable prototypes:** React + Tailwind + Supabase — closest to the toolkit's default stack. Often the easiest migration path.
- **Bolt.new prototypes:** Various stacks. Evaluate what the prototype generated and decide what carries forward.
- **v0 prototypes:** React components with Tailwind. The components may carry forward; the scaffolding needs replacement.
- **Replit prototypes:** Various stacks, often with Replit-specific hosting assumptions. Need full re-scaffolding for production deployment.

The common pattern: your prototype's UI components and business logic may carry forward, but the project structure, configuration, auth, and deployment pipeline get replaced by the scaffolder's output.

---

## Step 4: Configure the Development Environment

A stack decision isn't complete until the dev environment works. Phase S ends with a project that builds, runs, and can be developed on by anyone with access.

### Using the Scaffolder

The fastest path from stack decision to working project:

```bash
# Interactive — walks through every choice
intinc-scaffold create

# Quick mode — when you've already decided
intinc-scaffold create \
  --template pwa-react \
  --name my-app \
  --addons supabase,sentry \
  --pm pnpm \
  --yes
```

The scaffolder generates a complete project: package.json, tsconfig (strict), vite config, service worker or Electron main process, hooks, components, test setup, CI config, .env.example, and README.

### What the Scaffolder Provides per Template

| Template | What You Get |
|---|---|
| `pwa-react` | Vite + React + Workbox SW + push hooks + offline queue + install prompt + vitest + Playwright |
| `pwa-vanilla` | Zero-dep TypeScript modules: SW manager, cache manager, push client, offline queue |
| `electron-react` | Electron + React + Vite + IPC bridge + auto-updater + CSP + security hardening |
| `electron-vanilla` | Minimal Electron shell with secure IPC — framework agnostic |
| `tauri-react` | Tauri 2.0 + React + Vite + Rust commands (file I/O, system tray, dialogs, notifications) |
| `push-server` | Express + VAPID push + SQLite subscriptions + broadcast + rate limiting |

### Available Addons

| Addon | What It Adds |
|---|---|
| `supabase` | Client library, auth hook, real-time hook, RLS migration template |
| `sentry` | Error tracking, performance tracing, ErrorBoundary component |
| `posthog` | Product analytics, feature flag hook, session recording config |

### Post-Scaffold Verification

After scaffolding, verify the environment works:

```bash
cd my-app
pnpm install        # Dependencies install without errors
pnpm dev            # Dev server starts, app loads in browser
pnpm typecheck      # Zero TypeScript errors
pnpm test           # Starter tests pass
```

If any of these fail, fix them before writing application code. A broken development environment slows down everything downstream.

---

## Step 5: Document Your Decisions

Stack decisions should be documented — not because someone will audit you, but because future you (or a new team member) will need to understand why React instead of Vue, why Supabase instead of Firebase, why Electron instead of Tauri.

### Architecture Decision Records (ADRs)

For each significant choice, write a short record:

```markdown
# ADR-001: Use Supabase as primary database

## Status
Accepted

## Context
Phase I identified multi-tenant data with role-based access control
and real-time update requirements. Compliance review found no
regulated data requiring specialized hosting.

## Decision
Use Supabase (hosted Postgres) with Row-Level Security for tenant
isolation, Supabase Auth for authentication, and Supabase Realtime
for live updates.

## Consequences
- Positive: RLS enforced at database level, integrated auth, generous free tier
- Positive: Edge functions for server-side logic without separate backend
- Negative: Vendor dependency on Supabase (mitigated: standard Postgres underneath)
- Negative: Limited to Postgres — no document store without workaround (jsonb columns)
```

You don't need ADRs for every choice. Write them for decisions where the reasoning isn't obvious — where someone might look at the stack and ask "why not X instead?"

### What to Document

At minimum, your Phase S deliverable includes:

1. **Platform target** (PWA / Electron / Tauri / web-only) with reasoning
2. **Core stack table** listing each layer and the chosen tool
3. **ADRs** for any non-obvious decisions
4. **Development environment instructions** (clone, install, run)
5. **For prototypes:** what carries forward from the original and what gets replaced

---

## Phase S Checklist

- [ ] Platform target selected (PWA / Electron / Tauri / web-only) with justification
- [ ] Core stack decided for each layer (language, framework, bundler, database, auth, hosting, monitoring, CSS, state)
- [ ] TypeScript strict mode enabled
- [ ] Project scaffolded using `intinc-scaffold create` or equivalent
- [ ] Dev server runs without errors
- [ ] TypeScript compiles with zero errors
- [ ] Starter tests pass
- [ ] Addons configured (Supabase, Sentry, PostHog as needed)
- [ ] .env.example populated with all required environment variables
- [ ] ADRs written for non-obvious decisions
- [ ] Development setup instructions documented (README)
- [ ] For prototypes: migration plan documenting what carries forward vs. what's replaced
- [ ] Code quality audit score ≥ 50

---

## Common Failures

**"Let's use [hot new framework] because it's trending."**
Popularity doesn't mean fit. Evaluate against your Phase I requirements. If Svelte is the right tool for your data model and team, use it. If you're choosing it because of a blog post, reconsider.

**"We'll migrate to TypeScript later."**
You won't. JavaScript codebases that plan to migrate later almost never do. Start with TypeScript strict mode. The scaffolder generates it by default.

**"We need a monorepo from day one."**
Maybe. But if your project is one app with one deployment, a monorepo adds overhead without benefit. The toolkit's monorepo structure exists for the multi-package platform toolkit — not as a default for every project.

**"The prototype's stack is fine for production."**
Sometimes it is — Lovable projects using React + Supabase often carry forward cleanly. Sometimes it isn't — Base44 and Replit projects often need full re-scaffolding. Phase S evaluates honestly.

**"We don't need monitoring yet."**
Add Sentry on day one. The cost of debugging a production issue without error tracking is orders of magnitude higher than the five minutes it takes to configure. The scaffolder's Sentry addon wires it up automatically.

---

## AI Your BI℠: Claude in Phase S

Three specific uses:

**Stack Evaluation** — Describe your Phase I requirements (data model, API boundaries, auth needs, compliance, offline strategy) and ask Claude to recommend a stack with tradeoffs. Claude can compare multiple options side-by-side without the bias of having used one more than the others.

**Migration Planning** — For prototype conversions, describe your current prototype's stack and ask Claude to identify what carries forward to the target stack, what needs to be rewritten, and what the migration sequence should be.

**Configuration Review** — After scaffolding, paste your tsconfig, vite config, and package.json and ask Claude to review for common misconfigurations, missing optimizations, or security issues.

Example prompt:

```
My app requirements from Phase I:
- Data: [summary of data inventory]
- APIs: [summary of boundaries]
- Auth: [roles and provider choice]
- Compliance: [requirements or none]
- Offline: [strategy chosen]
- Platform: [PWA / Electron / Tauri]

My prototype was built on [platform] using [stack].

Recommend:
1. Which parts of the prototype stack carry forward
2. What should be replaced and with what
3. A migration sequence (what to move first)
4. Any risks or tradeoffs I should be aware of
```

---

## References

- `mono/packages/cli-scaffold/` — Interactive project scaffolder
- `mono/packages/shared/src/index.ts` — Template registry with all available templates and addons
- `ref/docs/02-pwa-decision-framework.md` — When to choose PWA
- `ref/docs/04-native-vs-pwa-vs-electron.md` — Platform comparison
- `p4/docs/electron-vs-tauri-comparison.md` — Side-by-side Electron vs Tauri
- `p4/docs/electron-to-tauri-migration.md` — Migration guide
- `ref/diagrams/svg/comparison-matrix.svg` — PWA vs Electron vs Native vs Tauri
- `ref/diagrams/svg/migration-paths.svg` — Effort estimates per conversion path

---

**Previous Phase:** [← Phase I: Integration](./I-integration.md)
**Next Phase:** [Phase T: Testing →](./T-testing.md)
