# INT Platform Toolkit v1

Everything your team needs to audit, scaffold, and ship PWA/Electron/Tauri apps.

## Structure

```
toolkit/
├── ref/          ← Reference library (112 files)
│   ├── code/     PWA React/Vanilla, Electron React/Vanilla, Push Server, Modules
│   ├── docs/     10 deep-dive guides
│   ├── diagrams/ 16 SVG + 16 Mermaid
│   ├── ci/       GitHub Actions workflows + scripts
│   └── templates/ PWA audit + Electron security checklists
│
├── mono/         ← Monorepo (pnpm + Turborepo)
│   └── packages/
│       ├── cli-audit/    Scan + score apps (intinc-audit)
│       ├── cli-scaffold/ Generate projects (intinc-scaffold)
│       └── shared/       Types, templates, VISTADEL phases
│
├── audit/        ← Standalone audit CLI (if you want it outside the monorepo)
│   └── src/      scoring.ts, scanner.ts, index.ts
│
├── p4/           ← Advanced integrations
│   ├── supabase/   Multi-tenant: migrations, edge functions, hooks, client
│   ├── electron-advanced/  INT OS shell: menu, tray, multi-window, file I/O, protocol
│   ├── tauri/      Full Electron parity: Rust backend + React hooks
│   └── docs/       Electron vs Tauri comparison + migration guide
│
├── assets/       ← Standalone deliverables
│   ├── audit-dashboard.jsx              Interactive React dashboard
│   ├── training-curriculum.jsx          Team training with progress tracking
│   ├── app-audit-scoring-template.xlsx  Excel scoring rubric + VISTADEL mapping
│   └── team-onboarding-guide.docx      Professional onboarding doc (10 sections)
│
├── vistadel/      ← VISTADEL Framework (20,100 words)
│   ├── phases/    8 phase docs (V-I-S-T-A-D-E-L) in .md + .docx
│   └── vistadel-platform-toolkit-integration.md
│
└── docs/
    └── vistadel-platform-toolkit-integration.md  Phase-by-phase toolkit mapping
```

## Quick Start

```bash
# Option A: Use the monorepo (recommended)
cd mono && pnpm install && pnpm build
pnpm audit:scan -- --dir ../some-app    # Audit an app
pnpm scaffold                           # Create a new project

# Option B: Use standalone audit CLI
cd audit && npm install && npx tsx src/index.ts scan --dir ../some-app
```

## What's Inside (175 files)

| Section | Files | Purpose |
|---|---|---|
| Reference Library | 112 | Production code, docs, diagrams, CI/CD, checklists |
| Monorepo | 20 | Audit CLI + Scaffolder + Shared types |
| Audit CLI | 4 | Standalone scoring engine |
| Supabase | 5 | Multi-tenant: migrations, edge functions, hooks |
| Electron Advanced | 3 | INT OS shell with all desktop features |
| Tauri | 5 | Electron feature parity in Rust |
| VISTADEL Framework | 17 | 8 phases (.md + .docx) + integration guide |
| Docs | 3 | Comparison, migration guide, VISTADEL integration |
| Assets | 4 | Dashboard, training, Excel template, onboarding doc |
| This README | 1 | You are here |
