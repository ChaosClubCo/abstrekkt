# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Directory Is

This is **not a single application** — it is the **Abstrekkt / FlashFusion brand and platform
workspace** (~51k files): brand content, deliverables, prompt packs, design artifacts, and a
handful of genuinely buildable apps. There is **no root `package.json`, build, or test** — each
buildable app lives in its own *deeply nested* subdirectory with its own stack and commands.

The directory root itself is mostly a **flat artifact dump**: hundreds of loose `.jsx`, `.tsx`,
`.html`, `.md`, `.json`, `.m4a`, and `.mp4` files sitting directly at the top level. These are
standalone exports/deliverables, **not** part of any build. Before running any command, identify
which subproject you are in and `cd` into it; do not assume a tool (Vite, npm, Next) applies at
the root.

> **Verify paths against disk before trusting them — this tree drifts often.** The actual
> top-level *folders* (alongside the loose files) include: `abstrekkt-design/` (large; holds the
> `flashfusion-OAAS/` platform tree), `abstrekkt-natural--eye-app/`, `abstrekkt-opportunity-packages/`,
> `ai-brain-arch/`, `anti-sycophancy-pack/`, `ff-eco-arch/`, `Kinsley/`, `Unicorn-maybe/`,
> `notebook-audit/`, `pitch-console/`, `kyle-context-files/` (+ `-v2`), `KAR/`, `json/`, `skills/`,
> `blog/`, `site/`, `outreach/`, `resume/`, `writing/`, `sellable-templates/`, `voice_ai_deliverables_pack/`,
> `asset-explorer/`, `barcode-scanner/`, `connectors-dashboard/`, `Obsidian/`, `Vault/`.
> Earlier docs claimed top-level `anthropic-academy/`, `Docs/`, `rebuild/`, `Command-2/`, `ChaosClub/`,
> and four `Kit_0X_*` design kits — those are **not at this level**. `asset-explorer/`,
> `barcode-scanner/`, and `connectors-dashboard/` are loose `.jsx`/`.html` collections, **not**
> npm apps (no `package.json`).

## AI Context (machine-readable)

```yaml
project:
  name: abstrekkt-workspace
  purpose: >-
    Abstrekkt personal-brand + FlashFusion platform workspace — brand content, deliverables,
    prompt packs, design-system kits, and POC apps. Multi-project staging area, not one app.
  owner: Kyle Rosebrook <kylerosebrook@gmail.com>
  lane: FlashFusion / Abstrekkt (focus lanes: FF, INT, MEMOIR)
stack:
  language: TypeScript / JavaScript / Python (per-subproject; mixed)
  framework: per-project (React/Vite, Next.js, serverless); none at root
  buildTool: none at root — per nested subproject
  packageManager: npm (within nested apps only)
structure:
  entryPoint: none at root — this CLAUDE.md is the only index; cd into a subproject before running anything
  size: ~51k files; root is a flat dump of loose deliverables; most JS/TS counts are nested node_modules + a python venv
  topLevelShape: hundreds of loose .jsx/.tsx/.html/.md/.json/.m4a/.mp4 files at root + the folders below (verify against disk)
  topLevelFolders:
    - abstrekkt-design/            # large; contains flashfusion-OAAS/ (command-center/ProjectX, fusion-engage, etc.)
    - ff-eco-arch/                 # current-canonical/intinc/* electron+pwa reference apps
    - Unicorn-maybe/               # flashfusion-web (Next.js)
    - abstrekkt-natural--eye-app/  abstrekkt-opportunity-packages/  ai-brain-arch/  anti-sycophancy-pack/
    - notebook-audit/  pitch-console/  Kinsley/  kyle-context-files/ (+ -v2)
    - KAR/  json/  skills/  blog/  site/  outreach/  resume/  writing/  sellable-templates/
    - asset-explorer/  barcode-scanner/  connectors-dashboard/   # loose .jsx/.html, NOT npm apps
  buildableApps:                   # only these have a real package.json — read its scripts block first
    - abstrekkt-design/flashfusion-OAAS/command-center/ProjectX/     # Vite + React 19 + TS (dev/build/test/lint/typecheck)
    - abstrekkt-natural--eye-app/                                    # Next.js (v0 export)
    - notebook-audit/notebooklm-prompt-library-app/                  # Vite + React (+ sibling python venv)
    - pitch-console/portfolio/kylerosebrook-portfolio/kyle-rosebrook-portfolio-nextjs/kyle-portfolio/  # Next.js
    - Kinsley/Infinite-Heros/Infinite-Heros-Bedtime-Chronicles-v5-main/   # Expo / React Native + tsx server + drizzle
  configFiles:
    - CLAUDE.md   # this file — the only authoritative index here (no root README.md or Docs/ exist)
dependencies:
  external:
    - Supabase (project oorstbwcydxwiojrsoim) — Postgres + RLS + Auth
    - Base44 (app 68dd8e79ca073475565c8e16, ~101 entities)
    - Vercel · Cloudflare Workers/Pages · Stripe · Upstash Redis · PostHog · Resend
    - n8n (krosebrook.app.n8n.cloud) · Make · Zapier
    - AI: Claude (primary), Gemini (secondary)
  critical:
    - Per-subproject env vars (Supabase keys, Stripe keys, Upstash) — server-side only
constraints:
  - No root build/test — cd into the correct nested subproject first; conventions vary per folder
  - No secrets in client/Vite/Cloudflare bundles; RLS enforced at DB layer, never app-layer
  - Many subtrees are stale (2025) and paths drift — verify any folder/path against disk before relying on it
  - Flash-n-Frame (model-router SaaS) is shelved — do not surface it
  - Under homebase repo's gitignored 02_abstrekkt tree (formerly 02_ChaosCollective) — working area, not versioned source
  - git root is D:\02_Homebase (the homebase repo); this whole tree is gitignored there
links:
  context: ./CLAUDE.md      # the only index file here; no root README.md exists
  parentRepo: https://github.com/Krosebrook/homebase
```

## Buildable Projects & Their Commands

There is **no root build**. Buildable apps are nested several levels deep — `cd` into one, run
`npm install`, then use its scripts. Commands below are verified from each app's `package.json`;
re-check the `scripts` block if a folder looks stale. Paths are relative to this directory.

| App (cd into) | Stack | Key commands |
|---|---|---|
| `abstrekkt-design/flashfusion-OAAS/command-center/ProjectX/` | Vite + React 19 + TS | `npm run dev` · `npm run build` (`tsc && vite build`) · `npm run test` (vitest) · `npm run typecheck` · `npm run lint` · `npm run lint:fix` · `npm run format` |
| `abstrekkt-natural--eye-app/` | Next.js (v0 export) | `npm run dev` · `npm run build` · `npm start` · `npm run lint` (`eslint .`) |
| `notebook-audit/notebooklm-prompt-library-app/` | Vite + React | `npm run dev` · `npm run build` · `npm run preview` (uses `@google/genai`; python `venv` is a sibling) |
| `pitch-console/portfolio/kylerosebrook-portfolio/kyle-rosebrook-portfolio-nextjs/kyle-portfolio/` | Next.js | `npm run dev` · `npm run build` · `npm start` · `npm run lint` |
| `Kinsley/Infinite-Heros/Infinite-Heros-Bedtime-Chronicles-v5-main/` | Expo / React Native + tsx server | `npm start` (`expo start`) · `npm run server:dev` · `npm run typecheck` (`tsc --noEmit`) · `npm run lint` · `npm run db:push` (drizzle-kit) |

- **Running a single test (ProjectX, the only app with tests):** `npx vitest run path/to/file.test.ts`,
  or `npx vitest -t "test name"` to match by name; `npm run test:coverage` for coverage.
- Other `package.json` files exist under `ff-eco-arch/current-canonical/intinc/*` (electron + PWA
  reference apps) and `Unicorn-maybe/flashfusion-web/` (Next.js) — treat as reference/experimental;
  inspect their scripts before assuming they build.

> **The FlashFusion platform code is still here**, contrary to older notes — it lives nested under
> `abstrekkt-design/flashfusion-OAAS/` (e.g. `command-center/ProjectX`, `fusion-engage`) rather than
> as top-level `flashfusion-v3`/`-worker`/`-mcp-servers`. The external services it uses (Supabase /
> Base44 / Vercel / Cloudflare / Stripe) are summarized under *Platform Stack* below.

## Navigation Notes

- There is **no root `README.md` and no `Docs/`** at this level — this `CLAUDE.md` is the only
  index. Don't cite paths from memory; glob/list against disk first, because the tree drifts.
- Loose `.jsx`/`.tsx`/`.html` files at the root and inside most folders are standalone
  artifacts/exports, not part of a build. `asset-explorer/`, `barcode-scanner/`, and
  `connectors-dashboard/` are such collections (no `package.json`), despite earlier "POC app" labels.
- Supabase schemas, when present, live per nested project — there is no shared DB project at this level.
- A Python `venv` exists under `notebook-audit/` — ignore its bundled `node_modules`/`site-packages`
  (and any nested `node_modules`) when reasoning about first-party code.
- A live `.env` exists in this tree (gitignored) — never open, print, or commit it; see Security Hard Rules.

## Platform Stack (FlashFusion overall)

- **Frontend**: React 19, Vite, TypeScript, Tailwind (per-project; not universal here)
- **Backend/DB**: Supabase (project `oorstbwcydxwiojrsoim`) — Postgres + RLS + Auth
- **Platform**: Base44 (app ID `68dd8e79ca073475565c8e16`, ~101 entities)
- **Edge/Deploy**: Cloudflare Workers + Pages, Vercel
- **Payments**: Stripe · **Analytics**: PostHog · **Email**: Resend
- **Automation**: n8n (`krosebrook.app.n8n.cloud`), Make, Zapier
- **AI**: Claude (primary), Gemini (secondary)
- **Active MCP integrations**: Supabase, Base44, n8n, Cloudflare, Vercel, PostHog, Notion, Linear, Slack, Gmail

## Security Hard Rules

- No API keys, secrets, DB connection strings, or `service_role` keys in front-end/client-side
  code. Server-side / env vars only. Actively flag any pattern that would leak a secret into a
  Vite or Cloudflare bundle.
- RLS must be enforced at the DB layer — never rely on app-layer filtering for tenant/user isolation.
- Sensitive credential files were relocated to `06-Archive-and-Backups/SENSITIVE-REVIEW/`; do not
  re-introduce credentials into the tree.

## Working Conventions

- **Decision priority**: Maintainability > Correctness > Security > Observability > Scalability > Performance > Cleverness
- **Dev flow**: spec → arch → code gen → local test → deploy → monitor → iterate
- TypeScript strict mode; error handling + input validation on all public-facing functions;
  logging hooks on async ops; a smoke/validation step with every build output.
- No TODO placeholders in finished deliverables. No generic scaffolding.
- **File naming standard**: `YYYY-MM-DD_FF-{TYPE}-{NNN}_{TOPIC}.ext`
  (Types: `ARCH` · `BLOCK` · `DEC` · `POST` · `DOC` · `ID`)

## Owner Context

Kyle is an L1 Service Desk Technician at Intinc (MSP, Lincolnshire IL). This AI/automation work
is self-initiated, not org-mandated — do not frame deliverables as engineer-to-engineer training
material. Do not reference "Kinsley".

Project lanes (focus labels, not gatekeeping): `FF` (FlashFusion platform + content strategy),
`INT` (Intinc MSP client workflows), `MEMOIR` (active writing project, ~50 pages).

## What NOT to Do

- Do not invent precision (no "improves X by 20–30%" without a citation).
- Do not inflate tool/entity counts.
- Do not re-introduce shelved projects unless Kyle raises them. **Flash-n-Frame** (model-router
  SaaS) is shelved — do not surface it.
