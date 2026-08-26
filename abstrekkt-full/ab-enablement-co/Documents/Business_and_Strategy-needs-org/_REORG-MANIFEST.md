# Reorg Manifest — `Business_and_Strategy-needs-org`

> Review this, then approve. Execution runs `_reorg.ps1`. **Nothing has moved yet.**
> Locked rules: re-sort **in place**; **never touch `*.gdoc`**; delete obvious dupes; manifest-first.

## Target structure

| Folder | Holds | How |
|---|---|---|
| `01_INT-Operations/` | INT INC deployment kit (DK-###), escalation (ES-###), troubleshooting (TL-###), KB index, Kixie, ITSM framework | 33 files pulled from `crit-docs/` + root |
| `02_Strategy-and-Research/` | Briefings, memos, market/competitive analyses, study guides, tech specs | `Business-Strategy/` + `Platform-Research/` **moved as whole folders** + ~50 loose docs |
| `03_Prompt-Library/` | Persona prompts (`.txt`) + prompt-engineering reference | ~43 files |
| `04_Blueprints-and-Guides/` | Instructional PDFs (AI_Architect, Agentic_RAG, Sovereign_AI, …) | 31 PDFs |
| `05_Learning-Media/` | Audio (`.m4a`), video (`.mp4`), images (`.png`), quiz/flashcard workbooks (`.xlsx`) | 20 files |
| `06_Deliverables/` | Self-contained packaged units (own READMEs) | `CSR_Framework_Deliverables/`, `EnterpriseROI/`, `printify_checklists_upgraded/`, `saasgeneration/`, `Enterpriseprofilebuilder/`, `Enterpriseprofilebuilder-main/` — moved whole |
| `07_Personal/` | Résumés, encouragement notes, creative writing, private | 7 files |
| `08_Reference/` | Indexes, how-tos, misc loose reference | `articles-bookmarks/` (whole) + 16 files |

**Untouched at root:** ~101 `*.gdoc` stubs, `crit-docs/IntgrationApplicationRoadmap.gdoc`, `_INDEX.md`
(auto-generated), `CLAUDE.md`, `.claude/`. `DigitalProductArchitect/` (empty) is removed.

## Deletions

**Auto — byte-identical (md5 verified), keep the DK-named twin:**
- `crit-docs\INT, dk-201.docx` → twin `INT, DK-201 Notion Client Workspace Provisioning.docx` keeps
- `crit-docs\INT, dk202.docx` → twin `INT, DK-202 n8n Orchestrator Workflow Import and Config.docx` keeps
- `crit-docs\INT, dk203.docx` → twin `INT, DK-203 New Client Onboarding Environment Checklist.docx` keeps
- `crit-docs\INT, dk301.docx` → twin `INT, DK-301 Phase 3 Automation Build n8n Workflow Guide.docx` keeps

**Confirm-in-review — near-identical supersedes (2–13 byte diff vs the DK canonical).** These are deleted by
the script; to KEEP any, remove its `Remove-One` line in `_reorg.ps1` §2 and add it to the `$int` move list:
- `crit-docs\INT, Notion Client Workspace Provisioning.docx`  (vs DK-201)
- `crit-docs\INT, n8n Orchestrator Workflow Import and Config.docx`  (vs DK-202)
- `crit-docs\INT, New Client Onboarding Environment Checklist.docx`  (vs DK-203)
- `crit-docs\INT, Phase 3 Automation Build n8n Workflow Guide.docx`  (vs DK-301)
- `crit-docs\INT, Phase 3 Automation Build - n8n Workflow Guide.docx`  (vs DK-301, larger variant)

**Kept (NOT dupes):** the two Kixie voicemail docs (18.7 KB vs 47.6 KB — genuinely different), both résumés
(different years), all five `The_Library_Meta-Skill_*` variants.

## Flags to be aware of

- **`SECRETS.docx`** → routed to `07_Personal/`. Scope is "re-sort in place", so it is **not** quarantined or
  encrypted — just grouped. If it holds live credentials, say so and I'll handle it separately.
- **`Enterpriseprofilebuilder/` (401 MB, has `node_modules/`)** → grouped under `06_Deliverables/`, but it's an
  actual code project and ideally belongs in `D:\03_Development`. Left here per the in-place decision; flagging
  for a future move.
- **Ambiguous routing** (judgment calls — easy to override): `Breathe_Through_the_BS_RECOVERED.docx`→07,
  `nontech_playbook.docx` vs `kyle_nontech_playbook.docx` (possible dup, both kept)→02, `Presentation -
  FlashFusion.pdf`→02, `github_rai_network_engineer.pdf`→08.

## Net effect

~150 real files relocated into 8 themed folders; 9 duplicates deleted (4 auto + 5 confirm); `.gdoc` stubs and
auto-generated index untouched. Fully reversible via git? No — folder is gitignored; reversibility is the
manifest itself (every move is listed). Tell me to proceed and I run `_reorg.ps1`.
