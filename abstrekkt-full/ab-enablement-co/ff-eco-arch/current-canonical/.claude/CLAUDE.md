# Project Snapshot — current-canonical

> Structured index for Claude Code. Operational guidance lives in the root `../CLAUDE.md`.

## HUMAN SUMMARY

**Canonical staging/drop directory** for Kyle Rosebrook's cross-lane deliverables and working
artifacts — *not* a buildable app. As of **2026-06-01** it has been **reorganized by lane in place**:
the old flat `flashfusion-batch3/` dump (≈383 mixed files) is gone, and everything now lives under
six lane folders plus `_meta/`, `_archive/`, and `media/`. Coherent sub-projects (the FlashFusion
16-Agent system, etc.) moved as whole units, keeping their own `CLAUDE.md`. Nothing was deleted —
superseded/duplicate files went to `_archive/`, and every move is logged in
`_meta/REORG-MANIFEST.md` (reversible by swapping the two paths on a line). Contents: authoritative
state docs, single-file React (`.jsx`) artifacts, dashboard design-prompt specs, Intinc `.docx`
KB/runbooks, and nested sub-projects.

- **Stack:** No language toolchain — Markdown + `.docx` + self-contained React artifacts (import `"react"` only). No build/test/lint; no `npm`/`git`.
- **Where to start:** `_meta/PROJECT_STATE_UPDATED.md` (Apr 7 snapshot) → root `CLAUDE.md` → `_meta/PROJECT_INSTRUCTIONS_UPDATED.md`.
- **Layout:** Reorganized by lane in place (2026-06-01). Top level = `_meta/`, `_archive/`, six lane folders (`intinc/`, `flashfusion/`, `chaosclubco/`, `memoir/`, `personal-brand/`) + `media/`. The old flat `flashfusion-batch3/` dump is gone. Every move logged in `_meta/REORG-MANIFEST.md` (reversible).
- **Gotchas:** `D:` drive is not always mounted; the 6-lane "no bleeding" rule + never-name-employer are hard constraints; two sub-trees have their own overriding `CLAUDE.md`; `_meta/unsorted/` is a deliberate mixed bucket of cross-lane files kept together on purpose (not a triage backlog — do not re-sort).
- **This copy (Pixel-synced):** only the `intinc/` + `flashfusion/` lanes exist on this device (no `chaosclubco`/`memoir`/`personal-brand`). On **2026-06-17** the `flashfusion/` lane was de-flattened from a loose dump into sub-folders (`audit-kit/`, `business/`, `n8n-oai-workflows/`, `scripts/`, `artifacts/`), foreign/junk clusters were archived, media hoisted to top-level `media/`, and an `intinc/` straggler flattened to `intinc/Invelo-v1.5/` — see `_meta/REORG-MANIFEST.md` **Phase 6**. Trust a live `ls` over the idealized 6-lane layout above. ⚠ `flashfusion/scripts/{build_ai_workforce_os_int_package_sh.sh,supabase_setup.sql}` carry Intinc signals — kept in-lane pending confirmation.

## AI CONTEXT

```yaml
project:
  name: current-canonical
  purpose: Cross-lane staging/drop directory for Kyle's deliverables & working artifacts; reorganized by lane (2026-06-01)
  owner: Kyle Rosebrook <kylerosebrook@gmail.com>
  lane: personal   # multi-lane hub: spans Intinc / FlashFusion / ChaosClubCo / memoir / Kinsley / personal-brand
stack:
  language: none   # Markdown + .docx + standalone .jsx artifacts; no compiled source
  framework: React (single-file Claude.ai/canvas artifacts, react-only imports)
  buildTool: none  # no bundler, no package.json, no git
  packageManager: none
structure:
  entryPoint: _meta/PROJECT_STATE_UPDATED.md   # then root CLAUDE.md, _meta/PROJECT_INSTRUCTIONS_UPDATED.md
  keyFolders:
    - _meta/                     # cross-lane state docs, tools, research, REORG-MANIFEST.md, unsorted/
    - _archive/                  # superseded versions & duplicates (nothing deleted)
    - intinc/                    # dashboard-prompts, deployment-kit, prompt-engineering-system (INT-HumanX), anthropic-academy, artifacts
    - flashfusion/               # 16-agent-system, ai-orchestration-platform, prompt-toolkit, stitch-command-center, suite, prompts, cowork-training, web, business, n8n-oai-workflows, artifacts
    - chaosclubco/               # app, book, drafting-skill
    - memoir/                    # cowork-session (own CLAUDE.md, Karpathy wiki), characters, material-bank, sessions, songs, research
    - personal-brand/            # site, writing, blog, outreach, pitch, resume
    - media/                     # large AV binaries (*.mp4, *.m4a)
  configFiles:
    - CLAUDE.md
    - _meta/PROJECT_STATE_UPDATED.md    # Apr 7 — authoritative (supersedes _archive/PROJECT_STATE.md, Mar 25)
    - _meta/PROJECT_INSTRUCTIONS_UPDATED.md
    - _meta/REORG-MANIFEST.md           # every old→new move from the by-lane reorg
dependencies:
  external: [Base44, Wix, n8n, Notion, Vercel, Firebase, Supabase, PostHog, Etsy/Gumroad]
  critical:
    - memoir/cowork-session/CLAUDE.md governs memoir lane (overrides root)
    - flashfusion/16-agent-system/agents-project/CLAUDE.md governs that sub-tree (APPROVAL_REQUIRED gates, Tessa routing)
constraints:
  - Not a buildable repo — no npm/build/lint/test commands exist
  - 6-lane separation: confirm lane before acting; never bleed context across lanes
  - NEVER name Kyle's employer in any output
  - Memoir boundaries (TBI/family) + scene-confirmation rules apply in lane 4
  - .jsx artifacts must stay single-file, react-only imports (no bundler/relative imports)
  - Secrets only as {SECRET_NAME} placeholders; never in client artifacts
  - _meta/unsorted/ is a deliberate mixed bucket kept on purpose, not a lane (do not re-sort)
links:
  docs: ./CLAUDE.md
  setup: ./_meta/PROJECT_STATE_UPDATED.md
  manifest: ./_meta/REORG-MANIFEST.md
```
