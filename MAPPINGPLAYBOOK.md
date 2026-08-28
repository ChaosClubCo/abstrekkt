# Ecosystem Mapping & Sync Playbook

**Owner:** Kyle Rosebrook · **Generated:** 2026-07-14 · **Status:** [SPIKE] reference
**Provenance:** every capability claim is tagged `[SOURCED]` (with URL) or `[GENERATED]` (reasoned/inferred). Verify before you automate anything irreversible.

> TL;DR — There is **no official API** to programmatically list your consumer NotebookLM notebooks *or* your Claude projects. Both are UI-only in 2026. So the map is maintained by (a) a **manual/exported catalog** for the LLM side, and (b) a **real `rclone bisync` hub** for the file side. Treat one local `~/Vault` tree as truth; Drive, OneDrive, Notion feed into it; GitHub stays *outside* it.

---

## 1. Mapping & condensing 200+ NotebookLM notebooks

### What's actually true in 2026
- **Notebook cap is 500 on every paid tier including Ultra.** Free 100 / AI Plus 200 / AI Pro 500 / AI Ultra 500 (600 sources per notebook on the 30TB plan). Ultra does **not** raise the *notebook* ceiling above Pro — it raises the *per-notebook source* cap and daily quotas. `[SOURCED]` https://support.google.com/notebooklm/answer/16213268
- **No consumer API.** No public endpoint to list/export/manage notebooks. An official API exists **only** under *Gemini Enterprise → NotebookLM Enterprise* on Google Cloud (`notebooks.create/get/listRecentlyViewed/batchDelete/share`, Preview) — a separate paid product, and **it has no export method**. `[SOURCED]` https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-notebooks
- **No native folders, tags, cross-notebook search, or merge.** Native org = public/featured notebooks + sharing + (Apr 2026) bulk-share and auto-categorize *sources*. Consolidation of notebooks is manual. `[SOURCED]` https://www.nlmtools.com/blog/notebooklm-tips-1-organizing-notebooks
- **Export is per-artifact, not per-notebook.** Audio→WAV, video→download, notes/reports→Google Docs/Sheets, decks→PDF/PPTX, mindmaps/infographics→PNG. **No native "export the whole notebook," no native bulk export.** The Google **Workspace admin** Data Export tool *does* cover NotebookLM (chat history, audio overviews, uploaded content, notes) — but that's admin-only, not consumer self-serve. `[SOURCED]` https://knowledge.workspace.google.com/admin/migrate/export-notebooklm-data

### The condensing method (do this — no API required)
Goal: turn ~130 sprawling notebooks into a governed, deduped set well under the 500 cap, with a catalog you can drop into the map.

1. **Inventory manually into a sheet.** One row per notebook: `title · theme · #sources · lane · last-touched · action(keep/merge/archive)`. There is no API, so this is a UI pass — but it's a one-time ~2-hr sweep for 130 notebooks. `[GENERATED]`
2. **Cluster by theme, not by whim.** Your corpus already clusters cleanly: *Agentic/AI-engineering*, *Abstrekkt/personal-branding (ABS-*)*, *Business/scaling*, *Claude-specific*, *FlashFusion*, *INT*, *governance/safety*. Merge within a cluster, never across lanes. `[GENERATED]`
3. **Consolidate by rebuilding, since merge doesn't exist.** For a target cluster: create one "hub" notebook, re-add the surviving sources (dedupe URLs/PDFs first), regenerate one clean overview, then archive the originals. You can't merge in place — you rebuild. `[SOURCED: no-merge]`
4. **Set a hard rule:** *max ~40 active notebooks per lane; anything older than 6 months with <3 sources → archive candidate.* Keeps you off the 500 ceiling and keeps signal high. `[GENERATED]`
5. **Optional tooling — convenience, not infrastructure.** Browser extensions add folders/tags/search: **NotebookLM Tools** (nlmtools.com), **Bookshelf for NotebookLM**, **NotebookLM Organizer/Folders**, **Export Pro**; **Apify "NotebookLM API"** scrapes exports. All **unofficial** → Google ToS + breakage risk; they touch your source data. Use for organizing, **not** as a system of record. `[SOURCED]` nlmtools.com; https://apify.com/clearpath/notebooklm-api

**Risk block:** scraping/automation of consumer NotebookLM is a ToS gray zone and breaks on UI changes. Keep the authoritative catalog in *your* sheet, not in an extension. `[GENERATED]`

---

## 2. Mapping all Claude projects (and artifacts)

### What's actually true in 2026
- **Self-serve export exists:** Settings → Privacy → **Export data**; async, emailed download link **expires in 24h**, **not re-importable** to another account. Officially it "includes conversation data and user data." `[SOURCED]` https://privacy.claude.com/en/articles/9450526-export-your-claude-data
- **Whether the personal export includes Projects + Artifacts is unconfirmed.** Official docs are silent; a practitioner teardown says the personal export is a **ZIP of JSON conversation history** and does **not** include Projects; the *org* export wording implies non-deleted projects *are* captured. Treat personal-export Project/Artifact coverage as **unverified**. `[SOURCED/conflicting]` https://amitkoth.com/export-claude-projects-data/ · https://support.claude.com/en/articles/13346720-export-your-organization-s-data
- **No public API to list your claude.ai projects/conversations.** The developer Messages API is stateless and does **not** expose chat history/Projects/Artifacts. No consumer admin API. `[SOURCED]` https://platform.claude.com/docs/en/build-with-claude/working-with-messages · open request: https://github.com/anthropics/claude-code/issues/12858
- **Artifacts:** live in a sidebar **Artifacts** section; export is **per-artifact** (Copy / Download) — **no bulk export**. **Publish** creates a **public stable URL** (embeddable, remixable). `[SOURCED]` https://support.claude.com/en/articles/9487310 · https://support.claude.com/en/articles/9547008
- **Cowork projects** are persistent workspaces (own files, context, instructions, **memory**) — a distinct subsystem from classic Projects; enumerated only via the sidebar. `[SOURCED]` https://support.claude.com/en/articles/13345190

### The method
1. **Maintain the catalog by hand — it's already 90% done** (this map ships with your ~50 Cowork projects, IDs, URLs, lane tags). Update on project create/rename. `[GENERATED]`
2. **Quarterly first-party export** (Settings → Privacy → Export) as a cold backup of conversation history. Download within 24h; store in `~/Vault/30_resources/claude-exports/YYYY-QN/`. `[SOURCED]`
3. **Artifacts you want to keep or reuse → Publish** to get a stable URL, then log the URL in the catalog. That's the only durable, ToS-clean "artifact registry." `[SOURCED]`
4. **Consolidation prompt (ToS-safe):** in each heavy project, ask Claude to emit a markdown index of instructions, knowledge-file summaries, decisions, and reusable prompts; save to `~/Vault`. Zero scraping. `[SOURCED]`
5. **Avoid UI-scraping extensions** for anything you rely on — gray-area + brittle. If used, treat output as disposable. `[SOURCED-risk]`

---

## 3. Mapping & syncing local ↔ cloud (the file hub)

### Architecture: one local truth, star topology
```
                 ┌───────────────┐
   gh repo clone │   GitHub      │  (code lives OUTSIDE the vault)
        ────────▶│   ~/code      │
                 └───────────────┘
   ┌─────────────────────────────────────────┐
   │        ~/Vault   (SINGLE SOURCE)         │◀── Notion API markdown (export-only)
   └───────────────┬───────────────┬──────────┘
      rclone bisync │               │ rclone bisync
                    ▼               ▼
              gdrive:Vault     onedrive:Vault
```
- **rclone `bisync` is the hub.** Added v1.58, hardened in **v1.66 (2024-03-10)**; current docs dropped the "beta" label and call it an *"advanced command — use with care."* Not "certified production-ready," but stable + maintained with the safety flags. `[SOURCED]` https://rclone.org/bisync/
- Remotes: Google Drive `type = drive`, OneDrive `type = onedrive`. `[SOURCED]` https://rclone.org/drive/ · https://rclone.org/onedrive/
- **Never point OneDrive's native client and Google Drive for Desktop at the same folder** — double-replication, `(1)` duplicates, delete-echo loops, cross-service deletes. Reserved-char + placeholder engines corrupt each other; Google Docs are 0-byte pointers that don't round-trip. `[SOURCED]` https://learn.microsoft.com/en-us/answers/questions/5063407/

### First-run (baseline) — one time
```bash
rclone bisync /home/kyle/Vault gdrive:Vault \
  --resync --check-access --create-empty-src-dirs \
  --compare size,modtime,checksum --drive-skip-gdocs -MvP
```
### Steady-state (safe, scheduled) — repeat
```bash
rclone bisync /home/kyle/Vault gdrive:Vault \
  --check-access --max-delete 10 --conflict-resolve newer \
  --compare size,modtime,checksum --drive-skip-gdocs --resilient -MvP
# then the same for onedrive:Vault  (two independent bisync pairs)
```
Safety flags (all `[SOURCED]` from the bisync manual): `--resync` first-run only · `--check-access` aborts if `RCLONE_TEST` markers missing on either side · `--max-delete 10` aborts if >10% would delete (default 50) · `--dry-run` before ANY config/filter change.

### GitHub — clone-all, kept out of the vault
```bash
gh repo list <you> --limit 1000 --json nameWithOwner -q '.[].nameWithOwner' \
  | xargs -P4 -I{} gh repo clone {} ~/code/{}
```
`.git` is a live loose-object DB and `node_modules` is tens of thousands of tiny files — a sync client racing git corrupts repos and blows file-count quotas. Canonical code backup = GitHub itself. If a repo must live under a synced path: `--filter "- .git/**" --filter "- node_modules/**"`. `[SOURCED usage]` https://github.com/dword-design/gh-repo-clone-all

### Notion — export-only node
As of Notion-Version `2026-03-11` the API has native markdown: `GET /v1/pages/:id/markdown`. Pull changed pages (`last_edited_time`) to `~/Vault/30_resources/notion/*.md`, which then rides your normal rclone sync. Notion is **one-directional into** the map, never a live two-way filesystem node. `[SOURCED]` https://developers.notion.com/guides/data-apis/working-with-markdown-content
```bash
curl 'https://api.notion.com/v1/pages/PAGE_ID/markdown' \
  -H "Authorization: Bearer $NOTION_API_KEY" -H 'Notion-Version: 2026-03-11'
```

### Manifest / index / dedupe for the 31k-file problem
```bash
# citable inventory with hashes (works identically on local + remotes)
rclone lsjson -R --hash ~/Vault           > ~/Vault/_meta/manifest_local.json
rclone lsjson -R --hash gdrive:Vault      > ~/Vault/_meta/manifest_gdrive.json
rclone check ~/Vault gdrive:Vault --checkers 8   # verify trees match by hash
# dedupe — rmlint emits a REVIEWABLE script, doesn't delete blindly
rmlint ~/Vault && ./rmlint.sh -n          # dry-run the generated script first
rclone dedupe gdrive:Vault                 # Drive's legal same-name dupes
```
`[SOURCED]` rclone docs · https://github.com/sahib/rmlint

### Recommended vault taxonomy (PARA + numbered prefix)
```
~/Vault/
  00_inbox/      # unsorted intake, nothing stays
  10_projects/   # active work, one dir per project (mirror repo names)
  20_areas/      # ongoing: finance, INT, FlashFusion
  30_resources/  # reference, notion/ + claude-exports/ targets
  40_archive/    # cold/done
  _meta/         # manifests + dedupe reports
~/code/          # ALL git repos — OUTSIDE the vault
```

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS
- **NotebookLM caps at 500 notebooks on Ultra** — `[SOURCED]` support.google.com/notebooklm/answer/16213268.
- **No consumer API for NotebookLM or claude.ai project listing** — `[SOURCED]` Google Enterprise API docs + Anthropic Messages API docs + open GH request #12858.
- **!CONTRADICTION:** personal Claude export — practitioner blog says conversation-only (no Projects); org-export wording implies projects captured. **Coverage of Projects/Artifacts in the *personal* export is UNVERIFIED.** `[SOURCED-conflicting]`
- **rclone bisync is no longer labeled beta** but docs still warn "advanced command." Not the same as a vendor "production-ready" cert. `[SOURCED]` rclone.org/bisync
- **Running OneDrive + Google Drive native clients over one folder causes data loss** — `[SOURCED]` MS Q&A 5063407.
- Command strings (rclone/gh/rmlint multi-flag invocations) are composed from documented flags → `[GENERATED]`; **dry-run each first.**

## GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS
- Consumer **Google Takeout** coverage of NotebookLM: unconfirmed (only Workspace-admin export is documented).
- Exact **schema** of the Claude personal export ZIP: third-party-sourced, not officially documented.
- **WSL placement** (`/mnt/c` vs native ext4) materially changes bisync performance/inotify — keep the Vault on native Linux fs if bisync runs in WSL. Not benchmarked here.
- Notion API rate limits / very-large-page pagination not stress-tested.
- Your actual Windows paths, rclone remote names, and Notion page IDs are placeholders — swap before running.
