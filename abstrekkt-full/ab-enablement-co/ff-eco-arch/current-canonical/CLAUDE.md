# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this directory is

This is a **staging / "canonical" drop directory**, not a buildable software project. There is no
`package.json`, `.git`, build system, test runner, or dependency manifest anywhere in the tree — do
not look for `npm`/`build`/`lint`/`test` commands; they do not exist. The contents are deliverables
and working artifacts produced across Kyle Rosebrook's project lanes.

> **Reorganized by lane (in place) on 2026-06-01.** The old flat `flashfusion-batch3/` dump is gone;
> everything now lives under lane folders. Nothing was deleted — superseded/duplicate files were
> moved to `_archive/`. Every move is logged in `_meta/REORG-MANIFEST.md` (reversible by swapping
> the two paths on a line).

### Directory layout

```
current-canonical/
├── CLAUDE.md                 # this file (root operational guide)
├── .claude/CLAUDE.md         # snapshot index
├── _meta/                    # cross-lane: state docs, neutral tools, research, manifests
│   ├── PROJECT_STATE_UPDATED.md, PROJECT_INSTRUCTIONS_UPDATED.md   # authoritative context layer
│   ├── REORG-MANIFEST.md     # every old→new move
│   ├── tools/  research/  connection-maps/  kanban/  state-text-variants/
│   └── unsorted/             # mixed cross-lane files kept together on purpose — do NOT re-sort
├── _archive/                 # superseded versions & duplicates (nothing deleted)
├── intinc/                   # dashboard-prompts/  deployment-kit/  prompt-engineering-system/  anthropic-academy/  artifacts/
├── flashfusion/              # 16-agent-system/  ai-orchestration-platform/  prompt-toolkit/  stitch-command-center/  suite/  prompts/  cowork-training/  blog/  web/  artifacts/  business/  n8n-oai-workflows/
├── chaosclubco/              # app/  book/  drafting-skill/
├── memoir/                   # cowork-session/  characters/  material-bank/  sessions/  songs/  research/
├── personal-brand/           # site/  writing/  blog/  outreach/  pitch/  resume/
└── media/                    # large AV binaries (*.mp4, *.m4a)
```

> **Sync note (verified 2026-06-03):** the `flashfusion/` sub-project folders above describe the
> primary `D:`/`C:` workstation. On the CrossDevice/Pixel-synced copy, `flashfusion/` is currently a
> **flat dump of loose files** (audit-kit deliverables, n8n specs, two Node scripts, an Obsidian
> config dump, data exports) with **none** of the listed sub-projects present. When working there,
> trust `flashfusion/CLAUDE.md` and a live `ls` over this idealized inventory.

- **State + instruction docs** — now under `_meta/` (`PROJECT_STATE_UPDATED.md`,
  `PROJECT_INSTRUCTIONS_UPDATED.md`). The authoritative context layer; read these first.
- **Standalone React artifacts** (`*.jsx`) — single-file Claude.ai/canvas components (import only
  from `"react"`). Cross-lane tools live in `_meta/tools/`; lane-specific ones under that lane
  (e.g. `flashfusion/artifacts/`). There is nothing to `npm run` here.
- **Design-prompt specs** (`01-*.md` … `15-*.md`) — now in `intinc/dashboard-prompts/`.
- **`.docx` KB / runbook files** (`INT, DK-*`, `INT, TL-*`, `INT, ES-*`) — now in
  `intinc/deployment-kit/`.
- **Nested sub-projects** keep their own `CLAUDE.md` (see "Nested authority" below) and moved as
  whole units into their lane.
- **`_meta/unsorted/`** — mixed cross-lane files whose lane wasn't asserted from the filename. Kyle
  has chosen to **keep them here as-is** — treat this as their intentional home; do not re-sort or
  redistribute them into lanes.

## Authority order (which file wins)

State files were written at different dates and partially supersede each other. When they conflict,
trust the most recent:

1. **`_meta/PROJECT_STATE_UPDATED.md`** (Apr 7, 2026) — newest cross-lane snapshot. Authoritative.
2. **`memoir/cowork-session/CLAUDE.md`** (Apr 11, 2026) — authoritative for the **memoir lane only**.
3. **`_meta/PROJECT_INSTRUCTIONS_UPDATED.md`** (Mar 25) — collaboration rules, lane definitions,
   memoir protocol, engineering standards.
4. **`_archive/PROJECT_STATE.md`** (Mar 25) — older snapshot; **superseded** by
   `_meta/PROJECT_STATE_UPDATED.md` for status, still useful for the deeper per-lane inventories.

If you change project status, update `_meta/PROJECT_STATE_UPDATED.md` (not the archived
`PROJECT_STATE.md`).

## The lane system (the most important operating rule)

Work is organized into **6 lanes that must not bleed into each other**. Confirm which lane a request
belongs to *before* acting; never carry context, assets, or voice from one lane into another.

| Lane | Name | Nature |
|------|------|--------|
| 1 | **Intinc** | Staff Engineer work — AppSec, platform eng, governance docs, n8n chains. NDA-sensitive. |
| 2 | **FlashFusion** | B2B AI enablement — Creator AI Workflow Kit, Base44 "Fusion AI", agent system. Revenue. |
| 3 | **ChaosClubCo** | Mental-health platform — app (Firebase MVP, specced not built), Book 1, digital products. |
| 4 | **Memoir** | Literary nonfiction. Governed by `memoir/cowork-session/CLAUDE.md`. Highly sensitive. |
| 5 | **Kinsley** | Personal/gift apps for Kyle's daughter. Keep separate from business. |
| 6 | **Personal Brand** | kylerosebrook.com, origin story, distribution. Connective tissue across lanes. |

## Hard constraints (non-negotiable, apply everywhere)

- **NEVER name Kyle's employer** in any output. The "diagnostic instinct" through-line belongs to
  Kyle and predates any employer; there is no employer blessing for public representation.
- **Do not cross lanes.** Especially: never bleed FlashFusion / Intinc / employer / personal-brand
  context into the memoir, and vice versa.
- **Memoir boundaries** (when in lane 4): never write prose from an unconfirmed scene, never probe
  TBI specifics or family-beyond-Kinsley, treat substance use as self-medication (not clinical
  addiction). The full rules live in `memoir/cowork-session/CLAUDE.md` — read it before any memoir work.
- **Secrets**: artifacts reference secrets as `{SECRET_NAME}` placeholders only. Never embed real
  keys/tokens; never put secrets in client-side React artifacts.

## Nested authority — defer to sub-project CLAUDE.md

Two sub-trees define their own binding rules. When working inside them, **their `CLAUDE.md` overrides
this file**:

- **`memoir/cowork-session/`** — memoir-excavation Cowork project. Uses the Karpathy wiki pattern
  (`raw/` is append-only; `wiki/` pages with `[[wikilinks]]`; scene-status markers
  ✅/❓/🧠/🚫/📌). Read `CLAUDE.md` → `CONTEXT.md` → `wiki/log.md` (last 3 entries) before acting.
- **`flashfusion/16-agent-system/agents-project/`** — the FlashFusion
  16-Agent MCP Orchestration System (production multi-agent platform for a Wix store). Has its own
  `CLAUDE.md`, `AGENTS.md`, `.claude/` (agents, commands, hooks, rules), `mcp/` schemas, `evals/`,
  `tests/`. Key rules: all multi-domain tasks route through **Tessa**; mandatory agent chains
  (`forge → inspector → pipeline`); any production/destructive/schema/secret action must emit an
  `APPROVAL_REQUIRED:` block and wait for a human. Tier 1–5 permission model in
  `.claude/rules/permissions.md`.

## Working with the artifacts

- **Editing a `.jsx` artifact**: keep it a single self-contained file importing only from `"react"`.
  Do not introduce relative imports, a bundler, or external packages — these run in the artifact
  runtime, not a local build. Examples: `_meta/tools/dispatch-v3.jsx`,
  `_meta/tools/WorkstreamMapper.jsx`, `flashfusion/artifacts/flashfusion-agent-factory.jsx`,
  `_meta/tools/prompt-framework-explorer.jsx`.
- **Editing a design-prompt spec** (`NN-*.md`, in `intinc/dashboard-prompts/`): these are generation
  prompts with a fixed shape (Prompt / Layout Structure / Visual Style / Accessibility / Avoid).
  Preserve that structure.
- **`.docx` files** are binary; read them with an appropriate tool rather than `Read`/`cat`.
- **Sub-projects** moved intact into their lanes: `flashfusion/16-agent-system/`,
  `flashfusion/ai-orchestration-platform/`, `flashfusion/prompt-toolkit/`,
  `flashfusion/stitch-command-center/`, `intinc/prompt-engineering-system/INT-HumanX-2026-Package/`,
  `chaosclubco/drafting-skill/`, `memoir/cowork-session/`. Each keeps its own `CLAUDE.md`/`INDEX.md`/
  relative paths — start from those rather than scanning the whole tree.

## Collaboration conventions (from PROJECT_INSTRUCTIONS_UPDATED.md)

- **Confirm the lane** and ask 3–5 targeted clarifying questions on ambiguous requests rather than
  assuming critical constraints.
- **Scope modes**: `LITE` (fast/exploratory), `STANDARD` (balanced), `FULL` (adversarial validation
  with a CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS footer).
- **Engineering priority order** when building anything:
  Maintainability > Correctness > Security > Observability > Scalability > Performance > Cleverness.
  Phase 1 (validation, structured logging, error classification, secrets mgmt, timeouts, health
  checks) is mandatory before any deploy; see references to `engineering-patterns-phased.md`.
