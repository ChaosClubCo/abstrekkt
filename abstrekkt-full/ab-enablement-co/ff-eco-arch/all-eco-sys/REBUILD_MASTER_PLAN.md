# Abstrekkt Corpus — Rebuild & Merge Master Plan
**Created:** Jun 2026 · **Status:** Awaiting Phase 0 execution · **Supersedes:** `PROJECT_STATE.md`, `00_MASTER_GUIDE_TABLE_OF_CONTENTS.md`

> This document + `DISPOSITION_MANIFEST.csv` are the **seed of the new project knowledge**. They are built to survive deletion of the current corpus and to drive the rebuild even after the source files are gone. Read the deletion gate first.

---

## TL;DR
256 files → target ~110 active files. The plan separates **data (precious, preserve)** from **chrome (cheap, rebuild)**. One hard rule governs everything: **do not delete current project knowledge until Phase 0 (preservation) is verified complete** — the merges need the source content, and ~58 files are irreplaceable ground truth that I cannot regenerate. Six phases, revenue-first. Three decisions need your sign-off before Phase 1.

---

## ⛔ DELETION SAFETY GATE — read this first

You said you'll delete all current project knowledge after delivery. **If you delete before Phase 0 runs, the rebuild loses its source.** Here is why and the safe order:

- The merges (memoir tools, lane tools, arcs, pitch tools) reconstruct **chrome** around **data** that currently lives only in the source files.
- ~58 files are **irreplaceable** — memoir ground truth, the BTBS system prompt, client facts, song lyrics, the recovered manuscript, cognitive-profile data, pricing strategy. I **cannot** regenerate these. If deleted before extraction, they are gone.

**Safe sequence:**
1. **Phase 0 runs first** → extracts all irreplaceable data into durable canon files (`MEMOIR_GROUND_TRUTH.md`, `MEMOIR_SOURCE_BANK/`, `VOICE_CANON.md`, `STACK_CANON.md`, `FF_CANON.md`, `SOURCE_BANK/`).
2. **You verify** the canon files contain the data (acceptance checklist in Phase 0).
3. **Only then** is deletion safe — and even then, recommend keeping the original corpus archived (zipped) until Phase 6 cutover, not deleted.

**Recommendation:** Don't delete. **Archive** the current corpus to a zip, re-upload only the rebuilt clean set as the new project knowledge. Deletion is irreversible; archiving costs nothing.

---

## Decisions needed before Phase 1 (3)

| # | Decision | My recommendation | Why it blocks |
|---|----------|-------------------|---------------|
| **D1** | **Memoir title vs thesis.** Three strings in the corpus: *Breathe Through the Bullshit* (btbs, breathe_landing, book CC, `Breathe_Through_the_BS_RECOVERED.md`), *Construction over Recovery* (project instructions, memoir skill), *Construction, Not Recovery* (memoir-hub-v3). | **Reconcile, don't pick:** Title = **Breathe Through the Bullshit**; thesis/throughline = **Construction over Recovery**. Normalize "Construction, Not Recovery" → "Construction over Recovery". If that's wrong, one word corrects it. | Every memoir tool + title card + landing references one of these. Can't normalize without the canonical pair. |
| **D2** | **Abstrekkt brand tokens.** Project instructions say "undefined." Memory says defined: Reading Room at Midnight — dark ink, brass `#C8A86A`, Fraunces + Crimson Pro + JetBrains Mono. FlashFusion: void-dark `#0B0B14`, violet `#A855F7`, magenta `#EC4899`, cyan `#22D3EE`. | **Treat as defined** (memory is newer than the project doc). Use Reading Room tokens for Abstrekkt-lane chrome, FF tokens for FF-lane. `#e11d48` (CCC red) is retired everywhere. | Every visual rebuild needs tokens. If the project doc's "undefined" is actually current, all Phase 1–4 chrome stalls. |
| **D3** | **Rebuild priority.** Phase 1a left the `daily_driver` column blank. | **Default revenue-first:** Console → FlashFusion → Abstrekkt/Brand → Memoir → Content/Products. Override by marking your 8–10 most-opened tools and I'll front-load those. | Sets phase order. Safe default exists; your override only improves it. |

**Deferred (not blocking):** Load-Bearing platform (Substack/Ghost/self-host) blocks only `newsletter_series.jsx` rebuild in Phase 5.

---

## Target architecture

### Lane taxonomy (5 + 1 firewall)
1. **Abstrekkt** — parent/brand, personal site, holding-co ops, personal tooling
2. **FlashFusion** — revenue: audits, builds, training, client tools, pipeline, CRM, sales assets
3. **Products** — claude-code-plugins-plus, Ample, FissionPrompt
4. **Content / Load-Bearing** — newsletter, essays, blog, editorial
5. **Memoir** — *Breathe Through the Bullshit* (thesis: Construction over Recovery)
- **INT (FIREWALL)** — day-job material. **Excluded** from this corpus. 4 `TEMPLATE_*` files + `persona-quick-start-cards.html` are INT-lane and get relocated/removed, not rebuilt here.

### The data/chrome split (core principle)
- **Data = preserve.** Ground truth, client facts, memoir source, voice rules, stack truth, pricing strategy. Lives in canon files. Never regenerated.
- **Chrome = rebuild.** UI shells, command centers, dashboards, the Console. Cheap to rebuild around preserved data, expensive to keep contaminated.

### Canon files (created in Phase 0 — the durable spine)
| File | Holds | Sourced from |
|------|-------|--------------|
| `MEMOIR_GROUND_TRUTH.md` | The verbatim BTBS system prompt (names, dates, scenes, The Five, Rogers/Herrington, Sally Army) | `btbs_accelerator_v3_1.html` |
| `MEMOIR_SOURCE_BANK/` | Manuscript, archives, char files, songs, protocols, evidence | ~30 memoir source files + 31 song `.txt` |
| `VOICE_CANON.md` | Authoritative voice rules + exemplar | `03-style.md`, `editorial-framework`, `lb-essay-07`, voice patch |
| `STACK_CANON.md` | Real tool inventory (~40 hands-on, not 240+), repos, B44 apps | tool-archaeology FINAL, github-repo-audit, base44-disposition |
| `FF_CANON.md` | Pricing strategy ($4,500 floor + Ryan exception), positioning, PR targets | pricing pressure-test, journalist report |
| `SOURCE_BANK/` | Origin scripts, paradigm-fit, cognitive profile | origin scripts, paradigm-fit, Rosebrook_K_Eval |

### The hub
**`abstrekkt-console.jsx`** replaces the poisoned `00_MASTER_GUIDE` + `00-suite-hub`. Indexes every surviving tool by lane + status, pulling from `DISPOSITION_MANIFEST.csv`. Single entry point.

---

## Phases

### PHASE 0 — PRESERVE & DECIDE  `(gate before deletion)`
**Goal:** Extract every irreplaceable byte into canon. Make deletion safe.
**Actions:**
- Extract BTBS system prompt verbatim → `MEMOIR_GROUND_TRUTH.md`
- Extract 31 songs + ~13 memoir source docs → `MEMOIR_SOURCE_BANK/`
- **Extract 14 binaries** (docx) to text first — they're unscanned and may hold both ground truth (Rosebrook_K_Eval, sudowrite_*) and CCC contamination
- Build `VOICE_CANON.md`, `STACK_CANON.md`, `FF_CANON.md`, `SOURCE_BANK/`
- Lock D1, D2, D3
**Acceptance:** Every `PRESERVE-SOURCE` row in the manifest has its content present in a canon file. Spot-check: open `MEMOIR_GROUND_TRUTH.md` and confirm The Five + Rogers/Herrington dates are intact. **← deletion safe only after this passes.**

### PHASE 1 — ABSTREKKT CONSOLE `(the spine)`
**Goal:** Clean hub + reference layer.
**Builds:** `abstrekkt-console.jsx` (NEW), rebuild `tool-ecosystem-map.jsx` against STACK_CANON, decontaminate `reference-hub.jsx` + `claude-config-explorer.jsx` + `anthropic-ecosystem-reference-v2.md`.
**Deletes:** `00_MASTER_GUIDE_TABLE_OF_CONTENTS.md`, `00-suite-hub.jsx`.
**Acceptance:** Console renders, lists every active tool by lane+status, no CCC strings, real tool counts (not 240+).

### PHASE 2 — FLASHFUSION `(revenue)`
**Goal:** Every client-facing + revenue tool clean and current.
**Merges:**
- `pitch_console.html` ← `pitch_generator.html` (+ de-dupe `pitch-kanban-final.jsx`/`kanban-v2`). **Enforce $4,500 floor; Ryan $3K documented as isolated exception.**
- `ff-command-center.html` ← rebuild `ff-ecosystem-command-center.html` + fold `portfolio_command_center.html`. **Fix stale state: n8n→Make, Supabase bill, model-in-notes.**
**Rebuilds/decontaminates:** `WorkstreamMapper.jsx` (kill dead chaosclub.co workstream), `dispatch-v3.jsx`, `room-configurator.html` (keep — Art, clean), `llc-formation-kit-v2.html`, sales assets (objection guide, outreach, proposal, one-pager), `board-audit`, `launch-readiness-engineer`, `operational-docs-toolkit`.
**Review-gated:** Art portfolio rebrand, KB-automation case study (verify real before publish), employee/facilitator suites, 8 FF binaries.
**New (gaps):** Iron Horse/Ryan engagement artifact, CLC engagement + SparkAcademy activation checklist.
**Acceptance:** Pitch tool refuses sub-$4,500 audit without explicit exception flag; FF command center reflects Make (not n8n-0-built); zero CCC.

### PHASE 3 — ABSTREKKT BRAND + PERSONAL
**Goal:** Public-facing brand correct; personal ops consolidated.
**Merges:**
- `kylerosebrook.html` ← `kylerosebrook-v4` (base) + salvage from `-v2` + `-homepage`. **Full CCC purge; Abstrekkt parent hierarchy.**
- `lane-ops.jsx` ← `lane-allocator` + `lane-balance` + `lane-blockers` + `lane-dashboard`. **Purge ccc lane + #e11d48.**
**Rebuilds/decontaminates:** Abstrekkt brand artifact (NEW — abstrekkt.com has no content home), `editorial-framework`, `voice-audit`, `knowledge-os` (rebuild vs current second-brain), `kanban-v2`, cognitive/scheduling/routine tools, `project-focus-evolution-v2`.
**Acceptance:** No "Chaos Club" in any public-facing file (site, OG, schema.org); brand artifact uses Reading Room tokens; lane-ops shows 5 lanes.

### PHASE 4 — MEMOIR
**Goal:** Two clean memoir tools; canonical title everywhere.
**Merges:**
- `memoir-explorer.jsx` ← fold excavation prompts from `memoir-hub-v3.jsx` + `memoir_engine.html`.
- `memoir-command-center.jsx` ← fold `memoir-project-hub.jsx`.
- `book-command-center.html` ← fold `publishing_command_center_v2.html`.
- `the-evidence-board.html` ← de-dupe `memoir_evidence_board.html` + feed `the-evidence-board-v2.md` data.
**Decontaminates:** title card (apply D1), the-arsenal, card-table-wall scenes, blind-spots, song-mining-hub, breathe_landing (rebuild under Abstrekkt).
**Review-gated:** moments-chat, hold-on-dad, connection-map, genre profiles de-dupe, Origin_Story_Book.tsx, session2.
**Acceptance:** One title string across all memoir files (D1); 4 memoir tools → 2 primary + tracker + board.

### PHASE 5 — CONTENT / PRODUCTS / ARCS
**Goal:** Content library clean; 17 arcs → 1 viewer.
**Merges:**
- `arc-viewer.jsx` ← all `*-arc.jsx` + `next-7-arcs-series-*` (selector-driven; one shell, data payloads). ChaosClubCo arcs archived.
- `content-strategy.html` ← reframe + fold `flashfusion-content-strategy.html`.
**Decontaminates:** ~27 essays/blogs (kr-, ff-, lb-, cc-), content-templates, playbook, vibe-coding assets.
**Deletes:** `hidden-gems-essay_html`, `ff-blog-interactive`.
**Blocked:** `newsletter_series.jsx` (Load-Bearing platform decision).
**Review-gated:** agent-series-viewer (vs arc-viewer), products launch plan, sycophancy artifact.
**Acceptance:** One arc tool; every published essay has sourced/[GENERATED] claims; zero CCC.

### PHASE 6 — VERIFY & CUTOVER
**Goal:** Confirm clean replacement exists for every load-bearing file, then swap.
**Actions:** Rebuild `doc-map.jsx` against the POST-consolidation set (delete both HTML doc maps); final corpus-wide CCC grep = 0; verify every `MERGE-INTO` source has landed in its target; produce `RE-UPLOAD_MAP.md` (old→new).
**Acceptance:** `grep -ri "chaos club\|chaosclub\|#e11d48" → 0`; manifest has no orphaned MERGE-INTO; **then** delete/archive original corpus, upload clean set.

---

## Decontamination spec (applies every phase)
| Pattern | Action |
|---------|--------|
| "Chaos Club Co." / "Chaos Collective" in **content/copy** | Remove; reframe to Abstrekkt (parent) or FlashFusion (product) |
| `ccc` lane definition, `chaosclubco-arc` | Retired — replace with 5-lane taxonomy; archive arcs |
| `chaosclub.co` as a live app/workstream | Dead — remove the workstream, do **not** rename |
| `#e11d48` (CCC red) | → Abstrekkt brass `#C8A86A` or FF token by lane |
| Memoir title strings | Normalize per D1 |
| "240+ tools" / inflated counts | → real ~40 hands-on (STACK_CANON); "240+" only as "MCP configs catalogued" |
| Unsourced numbers / claims | Add `[SOURCED]`/`[GENERATED]` tag or cut |
| Code identifiers that *contain* `ccc`/`chaos` (storageKeys, var names) | **Leave** — blind swaps break apps. Only touch content. |

---

## Disposition summary (from `DISPOSITION_MANIFEST.csv`)
| Action | Count | Meaning |
|--------|-------|---------|
| DECONTAMINATE | 67 | Keep, strip CCC/stale |
| PRESERVE-SOURCE | 58 | Extract to canon (Phase 0) |
| REVIEW-REQUIRED | 58 | Needs read/extraction before disposition (incl. 14 binaries) |
| MERGE-INTO | 24 | Fold into a target tool |
| DELETE | 17 | Exact dup or superseded version |
| REBUILD | 17 | Rebuild chrome around preserved data |
| ARCHIVE | 7 | Ephemeral / CCC-retired / one-off |
| SUPERSEDE | 3 | Replaced by plan/console/live tool |
| KEEP-CLEAN | 3 | Already clean (room-configurator, genkit, lb-essay-07) |

**Net:** ~256 → ~110 active files (≈40 deleted/archived, ≈24 merged away, the rest decontaminated or preserved as canon).

---

## Risks
- **Deletion-before-preservation** → permanent loss of irreplaceable ground truth. *Mitigation: Phase 0 gate + archive-don't-delete.*
- **"Keep newest version" assumption** → a dropped feature in an older version is lost. *Mitigation: diff old vs new before each DELETE; salvage notes captured in manifest.*
- **Binary contamination unknown** → 14 docx unscanned; may carry CCC or hold ground truth. *Mitigation: Phase 0 extracts all 14 to text first.*
- **INT firewall leak** → 5 INT-lane files in this corpus; rebuilding them here violates lane separation. *Mitigation: flagged INT-FIREWALL, excluded from rebuild.*
- **Title decision deferred** → memoir tools rebuilt twice if D1 lands late. *Mitigation: lock D1 in Phase 0.*
- **Claim integrity** → case studies / essays may carry fabricated precision. *Mitigation: REVIEW-REQUIRED on case studies; sourced/[GENERATED] gate in Phase 5.*

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS
- `[SOURCED]` 256 files, action/lane counts, CCC contamination list — derived directly from the corpus this turn.
- `[GENERATED]` "~110 active files" target — estimate from the disposition math, not a hard count; REVIEW-REQUIRED rows may shift it.
- `[GENERATED]` D1 reconciliation (title vs thesis) — inferred from file-name frequency (BTBS used as title in 4+ files; CoR used as project/thesis label). Requires your confirm.
- `[GENERATED]` D2 "brand is defined" — from memory, which postdates the project doc. If the project doc is actually current, this inverts.
- `!CONTRADICTION` Project instructions list Abstrekkt brand as "undefined"; memory says it's defined (Reading Room/brass/Fraunces). Resolved in favor of memory pending D2.
- `!CONTRADICTION` `ff-ecosystem-command-center.html` shows n8n "0 built"; memory shows n8n migrating to Make with 9 P1 workflows done. The command center is stale — flagged REBUILD.

## GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS
- 14 binaries (docx) not yet read — dispositions are provisional until Phase 0 extraction. `Rosebrook_K_Eval.docx` and `sudowrite_*` likely hold real ground truth; `*_playbook.docx` may duplicate each other.
- "the-* arc longer = canonical" assumes longer is newer; a lightweight rebuild could be the intended current version. Diff before deleting the short ones.
- `Origin_Story_Book.tsx` (only .tsx) and `html5up-seeder-workflow.json` (only .json) — purpose unconfirmed.
- Whether `agent-series-viewer.html` duplicates the new `arc-viewer` or is a distinct content artifact — unread.
- Files referenced in memory but **not present** in this corpus (ABSTREKKT_DESIGN.md, ABSTREKKT_BRAND_PROMPT.md, KYLE_DESIGN.md, second-brain CLAUDE.md set) live in Drive — confirm they're preserved there before relying on them as brand/voice canon.
