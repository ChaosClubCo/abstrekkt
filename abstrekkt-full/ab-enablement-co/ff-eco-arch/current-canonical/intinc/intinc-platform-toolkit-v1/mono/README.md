# @intinc/platform-toolkit

> Monorepo for INT Inc's PWA, Electron, and Tauri platform toolkit — audit, scaffold, and ship production apps.

## Packages

| Package | Description | Status |
|---|---|---|
| [`@intinc/cli-audit`](./packages/cli-audit) | Scan and score apps for conversion readiness | ✅ |
| [`@intinc/cli-scaffold`](./packages/cli-scaffold) | Interactive project scaffolder from production templates | ✅ |
| [`@intinc/shared`](./packages/shared) | Shared types, template registry, VISTADEL phase definitions | ✅ |

## Quick Start

```bash
# Clone and install
git clone https://github.com/intinc/platform-toolkit.git
cd platform-toolkit
pnpm install

# Build all packages
pnpm build

# Audit an existing app
pnpm audit:scan -- --dir ../my-app

# Scaffold a new project
pnpm scaffold
```

## Workflow

```
1. AUDIT    →  intinc-audit scan --dir ./existing-app
                 ↓ scores, recommendations, effort estimates
2. DECIDE   →  Review dashboard / spreadsheet
                 ↓ PWA? Electron? Tauri? Keep? Discontinue?
3. SCAFFOLD →  intinc-scaffold create
                 ↓ production template + addons
4. BUILD    →  pnpm dev → pnpm test → pnpm build
                 ↓ iterate through VISTADEL phases
5. SHIP     →  CI/CD pipeline → production
```

## Templates

### PWA
- **pwa-react** — React 18 + Vite + Workbox + push notifications + offline queue
- **pwa-vanilla** — Zero-dependency PWA modules (framework agnostic)

### Electron
- **electron-react** — Security-hardened Electron + React + IPC bridge + auto-updater
- **electron-vanilla** — Minimal Electron shell (framework agnostic)

### Tauri
- **tauri-react** — Tauri 2.0 + React + Rust backend (40-50MB binary vs 200MB Electron)

### Server
- **push-server** — Express + VAPID push + SQLite subscriptions

## Add-ons

Integrations can be added during scaffolding:

- **Supabase** — Auth, database, RLS, real-time subscriptions
- **Stripe** — Checkout, subscriptions, customer portal
- **Sentry** — Error monitoring, performance tracing, session replay
- **PostHog** — Product analytics, feature flags, session recording

## VISTADEL Integration

Each scaffolded project maps to VISTADEL phases with quality gates:

| Phase | Gate Metric | Threshold | Scaffolder Phase |
|---|---|---|---|
| V: Vision | Overall Score | ≥ 30 | Pre-scaffold audit |
| I: Integration | Security Posture | ≥ 40 | Addon selection |
| S: Stack | Code Quality | ≥ 50 | Template selection |
| T: Testing | Test Coverage | ≥ 40 | Built-in test suites |
| A: AI Implementation | Production Readiness | ≥ 50 | Monitoring addons |
| D: Deployment | Target Score | ≥ 60 | CI/CD templates |
| E: Evolution | All Scores | ≥ 60 avg | Re-audit cycle |
| L: Launch | Overall Score | ≥ 70 | Production checklist |

## Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Language**: TypeScript 5.6+ (strict mode)
- **CI**: GitHub Actions with scaffold smoke tests
- **Versioning**: Changesets

## Development

```bash
pnpm install          # install all deps
pnpm build            # build all packages
pnpm dev              # dev mode (watch)
pnpm test             # run tests
pnpm typecheck        # type checking
pnpm changeset        # create changeset for release
```

## Architecture

```
platform-toolkit/
├── packages/
│   ├── cli-audit/          # Scan + score engine
│   │   └── src/
│   │       ├── index.ts    # CLI commands (scan, batch, export, report)
│   │       ├── scanner.ts  # File/GitHub repo scanner
│   │       └── scoring.ts  # Scoring engine + recommendation + effort
│   ├── cli-scaffold/       # Project generator
│   │   └── src/
│   │       ├── index.ts    # Interactive prompts + CLI
│   │       └── generator.ts # Template writer + addon injector
│   └── shared/             # Shared types
│       └── src/
│           └── index.ts    # Templates, addons, VISTADEL phases
├── .github/workflows/ci.yml
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## License

MIT © INT Inc.
