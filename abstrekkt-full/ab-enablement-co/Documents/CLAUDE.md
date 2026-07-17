# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this directory actually is

`C:\Users\kyler\Downloads` is **not a project** — it is a Windows download/staging area. It is
not a git repository, has no root `package.json`, and no top-level build, lint, or test toolchain.
It holds ~35 unrelated top-level items: extracted app downloads, standalone `.jsx` / `.html`
artifacts, Claude Skills (`SKILL.md`), a data-processing pipeline, an Obsidian vault, PDFs, images,
and archive (`.zip` / `.tar.gz`) blobs.

Do not attempt to "build the repo" or run a global test suite — there is nothing global to run.
Work happens **inside a specific subfolder**, and each subfolder brings its own conventions.

## Critical operating rules

- **These are extracted copies, not canonical checkouts.** Many folders are self-nested
  (e.g. `Infinite-Heros-Bedtime-Chronicles-v5-main/Infinite-Heros-Bedtime-Chronicles-v5-main/`)
  and sit next to their source `.zip`/`.tar.gz`. Per the user's global `CLAUDE.md`, canonical
  active projects live on **`E:\`** (e.g. `E:\Infinite-Heros-Bedtime-Chronicles-v5`). Before
  editing anything here that looks like a maintained app, confirm whether the real working copy
  is on `E:\` — edits made in Downloads are easily lost.
- **Ask before destructive actions.** This is a staging area full of backups
  (`*-backup-*`, `project_backup/`, `Received from PC/`, `_UNSORTED/`). Deleting or overwriting
  is high-risk; treat it as such.
- **Large binaries live here** (`.aab` ~194 MB, `.apk` ~129 MB, `.zip` up to ~33 MB). Never read
  these with file tools; inspect metadata only.
- A subfolder with its **own `CLAUDE.md` wins** for work inside it — most importantly
  `Projects/Abstrekkt/CLAUDE.md`. Read and defer to it rather than duplicating guidance here.

## Directory layout (sorting scheme)

Loose files are sorted into labeled buckets; **keep this scheme when new downloads land.**
Prefer shallow, clearly-named top-level buckets over deep nesting — this is a scan-by-eye area.

| Bucket | Holds | New files go here when… |
|--------|-------|--------------------------|
| `Artifacts/` | Generated apps & web artifacts. App **folders** at top level; loose HTML exports in `Artifacts/exports/`; one-off app definitions (e.g. `FlashFusion-opal-app.json`) at its root. | It's a generated app, dashboard, or exported `.html` artifact. |
| `JSX-Components/` | Standalone single-file React `.jsx` artifacts. | A self-contained `.jsx` component (no bundler). |
| `Skills/` | Claude Agent Skills — `SKILL.md` files + their source bundles. | It's a Skill definition or `Skill-*` zip. |
| `Android-Builds/` | Large mobile build outputs (`.aab`, `.apk`). | It's a compiled app binary. Never read these; metadata only. |
| `Organized/` | Generic media/docs by type: `Documents/` (PDF etc.), `Photos/`, `Videos/`, `Archives/` (`.zip`/`.tar.gz`). | It's a plain document, image, video, or archive with no dev context. |

**Hygiene rules applied here (repeat them):**
- Delete via **Recycle Bin**, never hard-delete — use PowerShell
  `[Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile($p,'OnlyErrorDialogs','SendToRecycleBin')`.
- Only delete provably worthless files: corrupted Office temp files (`~$*`), **byte-verified**
  duplicates (`cmp -s` first), and freely re-downloadable installers (`.msi`).
- Give extension-less files a correct extension before filing (e.g. sniff with `file`).
- **Never touch `.tmp.drivedownload/` or `.tmp.driveupload/`** — active Google Drive sync state;
  files land there and at root mid-session. Route newly-synced loose files into the buckets above.

## The notable subfolders

| Path | What it is | How to work in it |
|------|-----------|-------------------|
| `Infinite-Heros-Bedtime-Chronicles-v5-main/…` | Full-stack app source (`app/`, `api/`, `components/`, `agents/`, `constants/`, `__tests__/`). Expo/full-stack per user notes. | Look for `package.json` in the **inner** folder; canonical copy is likely `E:\Infinite-Heros-Bedtime-Chronicles-v5`. |
| `int-l1-helper/` | INT Inc L1 service-desk tooling — loose React `.jsx` artifacts (`int-service-desk.jsx`, `runbook-generator.jsx`, `hdi_sca_study_planner.jsx`, `int-l1-coverage-map.jsx`) plus `int-service-desk-src.tar.gz`. | Standalone single-file JSX components; no build wiring in this folder. The `.tar.gz` holds the real source tree. |
| `NLM_PIPELINE/` | Numbered data-processing pipeline: `00_raw` → `01_deduped` → `02_ocr` → `03_transcripts` → … → `09_company_brain_ingest` → `10_qa`. NotebookLM/knowledge ingestion. | Stages are ordered directories, not code. Respect the numeric flow; outputs of stage N feed stage N+1. |
| `Projects/Abstrekkt/` | Kyle's Abstrekkt/FlashFusion knowledge workspace with numbered lanes (`00_Inbox`…`99_Personal-Gifts`). **Has its own `CLAUDE.md` and `README.md`.** | Read `Projects/Abstrekkt/CLAUDE.md` first and follow it. |
| `Obsidian/` | Obsidian markdown vault. | Markdown notes; there is an Obsidian MCP server available for structured access if needed. |
| Top-level `SKILL.md`, `skill-rebuild/`, `Skill-Builder-*.zip` | Claude Agent Skills (YAML-frontmatter + instructions). `SKILL.md` here = `generating-audience-tier-reports`. | Follow Skill authoring conventions (frontmatter `name`/`description`, `references/`). |
| Loose `*.jsx` / `*.html` (`learning-path-generator.jsx`, `pitch_console.html`, `<uuid>.html`) | One-off generated artifacts / Claude Artifacts exports. | Self-contained; open and read directly. No shared toolchain. |

## Working with individual `.jsx` artifacts

Most `.jsx` files here (INT L1 helper set, `learning-path-generator.jsx`, `hdi_sca_study_planner.jsx`)
are **self-contained single-file React components** authored as Claude Artifacts — no local
`node_modules`, no bundler config in this directory. Treat each as a standalone file: read it whole,
edit in place, and don't assume an import graph or test harness exists unless you find one.

## Inherited standards

The user's global instructions (`C:\Users\kyler\.claude\CLAUDE.md` and `~/.claude/rules/*`) apply:
prefer safe, minimal edits; credentials via env vars only (`C:\.env` or `D:\.env`); pause for
approval on HIGH/CRITICAL-risk changes (auth, payments, migrations, deletions). There is no
project-specific override in this directory beyond what is documented above.
