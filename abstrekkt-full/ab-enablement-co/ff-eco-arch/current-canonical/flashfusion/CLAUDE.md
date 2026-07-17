# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this directory is

A **staging area for FlashFusion-lane artifacts** — not a buildable project. There is no
`package.json`, lockfile, `.git`, build system, or test runner. Do not look for
`npm`/`build`/`lint`/`test` at this level; they do not exist.

> **Reorganized 2026-06-17 (Phase 6, this Pixel-synced copy).** This lane used to be a flat dump of
> ~41 loose files; it is now grouped into sub-folders. Foreign/junk clusters (Obsidian config, data
> exports, a stray `.winmd`, debug screenshots) were archived under `../_archive/`, and media
> binaries were hoisted to the top-level `../media/`. Nothing was deleted — every move is logged in
> `../_meta/REORG-MANIFEST.md` (Phase 6), reversible by swapping the two paths on a line.
> This still does **not** match the parent `../CLAUDE.md`'s richer idealized inventory
> (`16-agent-system/`, `ai-orchestration-platform/`, …) — those sub-projects don't exist on this
> device. Trust what `ls` shows here.

Current layout:

```
flashfusion/
├── CLAUDE.md            # this file
├── .claude/             # settings.local.json
├── audit-kit/           # "AI Setup Audit" productized-service kit (client-facing)
├── business/            # sellable product packages & the production runbook
├── n8n-oai-workflows/   # n8n automation specs
├── scripts/             # the only executable code (Node CLIs + a build .sh + a Supabase schema)
└── artifacts/           # single-file React/HTML artifacts
```

## Lane & hard constraints (inherited — non-negotiable)

This is **Lane 2 — FlashFusion** (B2B AI enablement; revenue work). The root operating rules in
`../../CLAUDE.md` apply in full:

- **Do not cross lanes.** Never carry FlashFusion context/voice into memoir, Intinc, or
  personal-brand work, or vice versa.
- **NEVER name Kyle's employer** in any output.
- **Secrets**: reference as `{SECRET_NAME}` placeholders only; never embed real keys.

Read the root `../../CLAUDE.md` ("authority order", "lane system") before substantive work — it is
the authoritative cross-lane context layer.

## Contents map (what each cluster is)

**`audit-kit/`** — FlashFusion engagement deliverables (the substantive content here):
- `audit-kit-01-facilitator.md`, `audit-kit-02-client-intake.md`, `audit-kit-03-deliverable-template.md`
  — the **"AI Setup Audit"** productized-service kit (facilitator script, pre-audit client intake
  form, written-summary deliverable template). These are client-facing; preserve their structure
  when editing.

**`business/`** — sellable packages & runbooks:
- `OUTCOME-AWARE AI SYSTEMS_ A PRODUCTION RUNBOOK.docx` — binary; open with a docx-aware tool, not
  `Read`/`cat`.
- `agentos-build-manifest.md` + `agentos-sellable.zip` — the AgentOS sellable product (12-pass build
  manifest + packaged artifact).
- `AI_Knowledge_Infrastructure_Roadmap_Package.zip` — packaged roadmap deliverable.

**`n8n-oai-workflows/`** — n8n automation specs (target env: `krosebrook.app.n8n.cloud`):
- `n8n-workflow-specs.md` — workflow specs for the SparkAcademy ecosystem.
- `tiktok-sora2-automation.json` — a *pointer/summary* (not the workflow JSON itself): a 35-node
  TikTok automation using Sora 2 + GPT-4o + Supabase + Ayrshare. The real export lives elsewhere.

**`scripts/`** — the only executable code (see caveats below):
- `create-project.js` — scaffolds `web` / `api` / `fullstack` apps (Next.js / Express / Supabase
  stacks) onto an external drive. `node create-project.js [name] [type]`.
- `token-saver.js` — searches local dirs first to reuse existing code before regenerating, backed by
  a `.code-cache.json`. `node token-saver.js`.
- `build_ai_workforce_os_int_package_sh.sh` ⚠ — builds an "INT AIaaS strategy package".
- `supabase_setup.sql` ⚠ — Supabase schema for the **"HumanX Assessment Tool"** (placeholders only;
  scanned clean of live secrets).
  > ⚠ **Lane flag:** the two `⚠` files carry **Intinc** signals ("INT AIaaS", "HumanX" = INT-HumanX)
  > despite living in the FlashFusion lane. They were **kept in-lane pending confirmation** — do not
  > move them to `intinc/` without Kyle's sign-off (would be a silent lane crossing).

**`artifacts/`** — single-file React/HTML artifacts (react-only imports; no bundler):
- `prompt-engineering-guide-v3.jsx`, `project_focus_evolution.html`.

**Relocated out of this lane on 2026-06-17** (see `../_meta/REORG-MANIFEST.md` Phase 6):
- Obsidian vault config dump (`app.json`, `appearance.json`, `manifest.json`, `switcher.json`,
  `backlink.json`, `page-preview.json`, `webviewer.json`, `image-converter-image-alignments.json`,
  `workspace-mobile.json`) → `../_archive/obsidian-config-dump/` — NOT project config.
- Large data exports (`managed_agents_40.json`, `scripts (1).json`, `applet_access_history.json`)
  → `../_archive/data-exports/`.
- `Microsoft.Services.Store.winmd` → `../_archive/foreign-binaries/`.
- Debug screenshots (`b44-orgs.png`, `b44-git-error.png`) → `../_archive/screenshots-debug/`.
- Media/design binaries (`*.mp4`, `bta-*.png`, `Gemini_Generated_Image_.png`,
  `Rapid_AI_UI_Design_Workflow.png`) → top-level `../media/`.
- `compass_artifact_*_text_markdown.md` → `../_meta/research/`; `_drain.md` → `../_meta/`.

## Running the Node scripts (caveats)

Both Node scripts (now under `scripts/`) are plain Node (`require`, no deps to install) and
self-contained, but they hardcode Windows paths that were valid on Kyle's primary workstation,
**not** on this synced path:
- `scripts/token-saver.js` searches `C:\Users\kyler\FlashFusion-Unified`, `C:\Users\kyler\repos`,
  `D:\Projects\Active|Templates` and writes its cache to `D:\Projects\.code-cache.json`.
- `scripts/create-project.js` writes generated projects to an external drive.

Before running on this machine, verify those target paths exist (the `D:` drive is often not
mounted) or edit the path constants at the top of each file. They will silently no-op or error
against missing directories otherwise.

## Editing conventions

- **Audit-kit `.md` files** are structured client deliverables — keep their section shape (intake
  fields, facilitator steps, deliverable headings) intact rather than reflowing them.
- **`.js` tools** import only Node built-ins (`fs`, `path`, `child_process`); keep them
  dependency-free single files so they stay runnable without an install step.
- If you reorganize or promote anything out of this flat dump, mirror the parent project's
  convention: log moves in `../_meta/REORG-MANIFEST.md` rather than deleting.
