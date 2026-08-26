# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this directory is

`abstrekkt-full` is **three unrelated things sharing one folder**, not a project. Identify which
zone your task belongs to before doing anything — the zones have different rules and almost no
relationship to each other:

1. **A Claude Code memory hierarchy** (`1-global/` … `5-shared/`) — real, live config.
2. **~88 generated design artifacts** (`corridor_*`, `memoir_draft_*`, `shader_*`, …) — static output.
3. **`ab-enablement-co/`** — a ~400-entry flat dump mixing drafts, media, a few real apps, and
   **live secrets/PII**.

It is a leaf inside the `D:\02_Homebase` git repo but **nothing here is versioned** — the Homebase
`.gitignore` excludes all of `/02_abstrekkt/`. Parent files already define the shared rules
(allow-list `.gitignore`, never stage `**/.env`, prefer `Read`/`Glob`/`Grep` over subagents, extract
binaries before reading, scope globs to avoid timeouts): repo root `CLAUDE.md`, `02_abstrekkt/`,
`KAR/`, and `KAR/02_Projects/`. This file only adds what's specific to `abstrekkt-full`.

## Zone 1 — the numbered config hierarchy (`1-global/` … `5-shared/`)

A working Claude memory hierarchy, deliberately terse ("non-obvious rules only"). **This is ground
truth for Kyle's operating rules** — read it rather than inferring from the artifacts.

| Path | Role |
|------|------|
| `1-global/CLAUDE.md` | Identity, philosophy, decision priority, cross-project IDs, hard rules |
| `2-global-rules/comms.md`, `engineering.md` | Communication + engineering rules |
| `3-flashfusion-project/` | `CLAUDE.md`, `AGENTS.md`, `CONTEXT.md`, `CLAUDE.local.md` |
| `4-intinc-project/` | `CLAUDE.md`, `CONTEXT.md` (no `AGENTS.md` — non-code lane) |
| `5-shared/MEMORY.md` | Settled-decisions ledger + permanent ID table |

The file-role split is the load-bearing convention and is easy to violate:

- **`CONTEXT.md` — replace, never append.** Rewrite at the start of each session.
- **`MEMORY.md` — append, never rewrite.** If it's in there, don't re-litigate it.

Rules restated here because they govern work in this whole tree:

- **The two-lane firewall.** INTINC and FLASHFUSION stay completely separate in all outputs. No
  FlashFusion business context in any Intinc output; FlashFusion is the personal lane, not
  Intinc employment.
- **Decision priority:** Maintainability > Correctness > Security > Observability > Scalability >
  Performance > Cleverness.
- **No fabrication.** No placeholder or invented content in any artifact; case studies reflect real
  work only. Surface the gap instead of filling it.
- Kyle is an **L1 Service Desk Tech + informal AI SME** — see the stale-docs warning below.

## Zone 2 — the generated artifact folders (~88 of them)

`corridor_*`, `memoir_draft_*`, `the_construction_*`, `manifesto_*`, `shader_*`, `product_*`,
`mobile_*`, `the_rupture_*`, and the directories confusingly *named* `rosebrook_*.png`.

They all follow one convention — a **Stitch-style export**, one design per folder:

```
<artifact_name>/
  code.html     # the entire artifact, self-contained
  screen.png    # rendered preview (some folders have only one of the two)
```

They are **output, not source**. There is no build, no bundler, no shared component library — open
`code.html` directly. Don't refactor across them or treat them as an app.

## Zone 3 — `ab-enablement-co/` (read the warnings first)

A flat dump of ~400 loose entries at its root: `.jsx`/`.tsx`/`.html` artifacts, `.md` drafts,
`.docx`/`.mp4`/`.png` media, and real apps in subfolders. It has **no organizing convention** —
find files by name, don't expect a structure.

> **`ab-enablement-co/CLAUDE.md` is wrong — do not follow it.** It describes a tree with
> `Cortex-Nextus-AutoAI/`, `FF-CC/`, `FlashFusion-Enterprise/`, and `KAR/`. **None of those four
> exist here** (verified 2026-07-16); it was copied from another directory. Its FlashFusion tech
> stack and brand notes may still be useful, but every path and command in it is fiction.

> **Live secrets and PII live at this folder's root** — 2FA backup codes
> (`Backup-codes-krosebrook86.txt`), attorney/family-law documents, a police incident report, and raw
> voice samples, interleaved with ordinary drafts. Never read, echo, commit, or send these
> externally, and never bulk-read the folder. Open files by explicit name only.

## Buildable artifacts (the only runnable code)

Everything else is documents. Each app owns its setup — `cd` in and use its tooling; there is no
tree-wide build, and there are **no nested git repos** here.

| Path | Stack | Commands |
|------|-------|----------|
| `model-audit-console/model-audit-console/` | TS CLI; Anthropic + OpenAI + Gemini SDKs | `npm install`; `npm run audit` (tsx) / `build` / `start` |
| `ab-enablement-co/frontend/` | Next.js + Supabase (`@flashfusion/core-frontend`) | `npm run dev` / `build` / `lint` / `typecheck` / `test` (vitest) / `smoke` |
| `ab-enablement-co/backend/` | TS lib (`zod`, `jose`) | `npm run typecheck` / `test` |
| `ab-enablement-co/abstrekkt-natural--eye-app/` | Next.js + Radix + Tailwind + R3F (v0 export) | `npm run dev` / `build` / `start` / `lint` |
| `ab-enablement-co/kyle-mcp-v1.1.0/` | MCP server (Vercel) | `npm run typecheck` / `smoke` |
| `ab-enablement-co/PROJECT-EXPORT/` | pnpm monorepo (`memoir-monorepo`) | `pnpm -r test` / `pnpm -r typecheck` |

`model-audit-console` needs `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, and `GEMINI_API_KEY` in a local
`.env` (`cp .env.example .env`) — server-side only, never commit.

`notebooklm_knowledge_pipeline_production_package/notebooklm_knowledge_pipeline_v1/` looks like an app
but is a **numbered spec/SOP bundle** (`00_START_HERE` … `14_logs`) — docs and schemas, not a build.

## Known-stale and junk (verified 2026-07-16)

- **`ab-enablement-co/CLAUDE.md`** — wrong directory entirely. See above.
- **`00_MASTER_GUIDE_TABLE_OF_CONTENTS.md`** — a 380-line aspirational career/life plan. It calls
  Kyle a "Staff Engineer at INT Inc, ~$200K/year," contradicting `1-global/CLAUDE.md` and
  `4-intinc-project/CLAUDE.md` ("L1 Service Desk Tech + informal AI SME"). **The numbered folders
  win.** Treat the TOC as planning fiction, not fact.
- **`{1-global,2-global-rules,3-flashfusion-project`** — a literal directory created by a
  `mkdir -p {a,b,...}` that ran in a shell without brace expansion. Completely empty; quote the path
  if removing it.
- **`../_INDEX.md`** — the parent auto-inventory doesn't list `abstrekkt-full` at all and inventories
  unrelated folders. It is not a table of contents for this tree.
