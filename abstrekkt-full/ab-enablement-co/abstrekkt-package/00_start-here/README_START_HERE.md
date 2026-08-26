# Project Corpus Regeneration — Read This First

**Generated:** 2026-07-06 · **Source:** 265 files in this project's knowledge base

## What you got (two zips)

1. **abstrekkt-full-backup.zip** — every one of the 265 source files, byte-identical. Zero risk, zero edits. This is your insurance policy — nothing is destroyed anywhere. If anything below is wrong, the original is in here.
2. **abstrekkt-curated-necessary.zip** — 209 files. This is what I'd re-upload. It excludes 56 files (51 archived, 5 flagged for your eyes) and mechanically patches 40 files (stale domain + deprecated model string).

**`DISPOSITION_MANIFEST.csv`** (in both zips) is the full audit trail — one row per file, one of four actions, and why.

## The four actions

| Action | Count | Meaning |
|---|---|---|
| `KEEP_AS_IS` | 135 | Clean. Copied unchanged. |
| `DECONTAMINATE_KEEP` | 74 | Had a mechanical issue. 40 auto-fixed (domain/model string). The rest are flagged in the `reason` column for a manual pass — I did not auto-edit ambiguous strings (see below). |
| `ARCHIVE_ONLY` | 51 | Excluded from the curated set. Superseded duplicates, retired-brand structural files, confirmed contamination, or a hard-rule violation. Full detail and reasoning in the manifest. Still sitting untouched in the full backup if you disagree with any single call. |
| `NEEDS_REVIEW` | 5 | I could not confidently classify these — excluded from curated pending your call. Listed below. |

## What I auto-fixed (safe, mechanical, already-decided)

- `kylerosebrook.com` → `abstrekkt.com` (canonical homepage decision, already locked)
- `claude-sonnet-4-20250514` → `claude-sonnet-4-6` (deprecated model string, already locked)

## What I flagged but did NOT auto-fix (too context-dependent for a blind find/replace)

- `#e11d48` (retired ChaosClubCo red) — appears in a few files, no auto-replacement color chosen yet.
- `"240+"` — ambiguous: sometimes tool-count inflation, sometimes a dollar figure or hour count. Needs eyes, not a script.
- `"Staff Engineer" / "Senior Engineer" / "Principal Engineer" / "Enterprise Architect"` — sometimes describes Kyle (forbidden), sometimes describes a third party in a template. Needs eyes.

These files are still in the **curated** zip (they weren't archived) — just check the `markers` column in the manifest for anything tagged `RetiredColor`, `InflatedTools`, or `BadTitle` before you treat them as final.

## The one finding that needs your direct attention

A scan for the daughter's name (per the hard rule: never reference her in any lane except the memoir, which is explicitly framed as a letter to her) found it in **~30 memoir-lane files**, where it's expected and untouched, **and in 27 non-memoir files** — business tools, blog posts, and personal-brand pages — where it has no place. Those 27 are archived out of the curated set. Two are worth naming directly because they're externally-facing, not just internal hygiene:

- `outreach-console-v4.html` — your press outreach console. If this ever went to a journalist with that content still in it, it's a real exposure, not a file-hygiene issue.
- `kr-blog-logic-you-outsource.html` and `moving-in-silence-was-phase-one.html` — both read as publishable essay content.

Check the manifest for the full 27-file list (search `non-memoir` in the `reason` column). I didn't open or quote any of the actual passages — just detected the string.

## Duplicate/superseded pairs resolved

| Kept (curated) | Archived (superseded) |
|---|---|
| `the-flashfusion-arc.jsx` | `flashfusion-arc.jsx` |
| `the-memoir-arc.jsx` | `memoir-arc.jsx` (also had the name-reference issue) |
| `kylerosebrook-v4.html`* | `kylerosebrook-v2.html` |
| `outreach-console-v4.html`* | `pitch_console.html`, `pitch_console_bak.html`, `pitch_generator.html` |
| `llc-formation-kit-v2.html` | `llc-formation-kit.html` |
| `project-focus-evolution-v2.html`* | `project-focus-evolution.html` |
| `publishing_command_center_v2.html`* | `publishing_command_center.html` |
| `flashfusion-content-strategy.html` | `content-strategy.html` |
| `hidden-gems-essay.html` | `hidden-gems-essay_html.html` |
| — | `chaosclubco-arc.jsx`, `the-chaosclubco-arc.jsx`, `art-11-chaosclubco-portfolio.html` (retired brand, no valid successor) |
| — | `kanban-v2.jsx` (heaviest contamination in the corpus — 6 markers) |
| — | `btbs_accelerator.html`, `btbs_accelerator_v3.html`, `btbs_accelerator_v3_1.html` (memory says this book concept was nuked — confirm before reviving) |

\* Marked with an asterisk because the "kept" file **also** carries the name-reference issue and is therefore in `ARCHIVE_ONLY`, not curated, despite winning the duplicate contest. Net effect: none of these three currently have a clean version in the curated zip. Check the manifest before deciding what replaces them.

## `NEEDS_REVIEW` — I couldn't call these confidently

- `kylerosebrook-homepage.html` — a prior session found it structurally built on a retired 3-lane/peer-support concept; my string scan didn't catch the wording this time. Confirm before trusting it.
- `the-evidence-board.html` — possible duplicate of `the-evidence-board-v2.md`.
- `OpsHub.jsx` — possible overlap with `PortfolioCommandCenter-updated.jsx`.
- `doc_connections.html` — possible overlap with `doc_connection_map.html` / `cross_doc_connection_map.jsx`.
- `next-7-arcs-series-7.jsx` — has the name-reference; lane is ambiguous (business arc tool describing the memoir lane by name, vs. genuinely memoir-only content). Needs your eyes, not my guess.

## What this does NOT do

- It does not open, read, or judge the memoir/song/personal-brand content for quality or accuracy — only for the specific structural/contamination markers listed above.
- It does not rewrite any prose. Every `KEEP_AS_IS` and `DECONTAMINATE_KEEP` file has its original substance untouched — I only ever touched two exact strings.
- It does not resolve the open questions already logged elsewhere in project knowledge (Load-Bearing platform, claude-code-plugins-plus distribution, LLC vs. FlashFusion LLC signer, brand token lock) — those are content decisions, not file hygiene.

---

### CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS
- **[SOURCED]** 265 files in `/mnt/project` at time of this run — `os.listdir()` count, this session.
- **[SOURCED]** Classification markers (ChaosClubCo, Butler, Kelan, deprecated model string, stale domain, name-reference) were regex-matched directly against file contents, this session.
- **[GENERATED]** The duplicate/superseded pairings (e.g., `v2` vs `v4`, "the-" prefix vs. short name) are inferred from filename convention + spot-checked content on 6 of the ~15 pairs, not all of them individually opened and diffed.
- ! **Contradiction:** the three "winning" duplicates in the table above (`kylerosebrook-v4.html`, `outreach-console-v4.html`, `project-focus-evolution-v2.html`, `publishing_command_center_v2.html`) themselves carry the non-memoir name-reference violation, so the "kept" version isn't actually clean — there is currently no fully clean homepage, outreach console, or focus-evolution doc in the curated set. That's a real gap, not an oversight.
- **[GENERATED]** "240+" and "Staff Engineer"-style markers were flagged but not auto-fixed because a prior session (source: past-chat search, this run) explicitly found these produce false positives on a blind regex.

### GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS
- 13 files in the corpus have a `.docx` extension but are actually plain UTF-8 text (mislabeled) — all were scanned successfully once that was caught, but if any *real* binary `.docx`/`.pdf`/`.xlsx` shows up later, this scan will silently skip it (flagged as `IMAGE_UNSCANNED`/`READ_ERROR` only for true binaries, and none existed this run).
- I did not verify every one of the ~135 `KEEP_AS_IS` files line-by-line for accuracy or staleness beyond the specific markers scanned — "clean" here means "clean of these nine known contamination patterns," not "verified current."
- Content-quality issues flagged in memory but not markers here (the `00-suite-hub.jsx` `useState`-in-`.map()` hook violation, the `research` file's pricing argument contradicting the $4,500 floor) are **not** reflected in this manifest's action column — those are functional/content bugs, not file-hygiene contamination, and are still present in whichever curated file carries them.
- I have not opened or read the memoir manuscript content itself to verify the name-reference exemption is being applied correctly beyond the filename-pattern heuristic — a memoir-lane file with an unusual name wouldn't be caught by my allowlist and could be misclassified in either direction.
