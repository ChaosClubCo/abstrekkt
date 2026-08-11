# CANON Sync Ops — Jul 7, 2026
> Companion to the reconciled `CANON.md`. Execute all sections in ONE sitting
> (§2.4 atomicity): renames + hub patches + CANON upload together, or the
> registry points at ghosts.

---

## 1. Rename ops (project UI — 6 files, all verified live)

| # | Current name | New name |
|---|---|---|
| 1 | `dispatch-v6.jsx` | `dispatch.jsx` |
| 2 | `dispatch-v2.jsx` | `dispatch_archive_2026-07.jsx` |
| 3 | `project-focus-evolution-v2.html` | `project-focus-evolution.html` |
| 4 | `kyle-origin-video-scripts-v4.md` | `kyle-origin-video-scripts.md` |
| 5 | `voice-generator-v4.html` | `voice-generator.html` |
| 6 | `the-evidence-board-v2.md` | `the-evidence-board.md` |

Already resolved — no action: `pitch_console_bak.html` (deleted), `PROJECT_STATE.md`
(removed), `Breathe_Through_the_BS_RECOVERED.md` (removed), focus-evolution v1 +
underscore sibling (removed), `memoir-command-center.jsx` / `memoir-hub-v3.jsx` /
`memoir-project-hub.jsx` / `dispatch-v3.jsx` / `publishing_command_center_v2.html`
(all removed from live project).

---

## 2. abstrekkt-author-hub.jsx patches (str_replace, in order)

**P1 — CONTENT_TYPES, X Thread row** (dispatch-v3 appears 2–3× in the file;
patch rows individually using full-row anchors, not the bare filename):
```
OLD: { type:"X Thread",             badge:"THREAD",       tool:"dispatch-v3.jsx",                   when:"Have 4–6 connected observations. Thread = argument, not list." },
NEW: { type:"X Thread",             badge:"THREAD",       tool:"dispatch.jsx",                      when:"Have 4–6 connected observations. Thread = argument, not list." },
```

**P2 — CONTENT_TYPES, LinkedIn Post row** (row text partially verified; anchor
on `tool:"dispatch-v3.jsx"` remaining after P1 if it appears in this row):
apply the same `dispatch-v3.jsx → dispatch.jsx` swap.

**P3 — CONTENT_TYPES, Video Script row:**
```
OLD: { type:"Video Script",          badge:"VIDEO",        tool:"kyle-origin-video-scripts-v4.md",   when:"Recording origin story or explainer video content." },
NEW: { type:"Video Script",          badge:"VIDEO",        tool:"kyle-origin-video-scripts.md",      when:"Recording origin story or explainer video content." },
```

**P4 — CANON_TABLE, delete two memoir ghost rows:**
```
DELETE: { lane:"Memoir",   file:"memoir-command-center.jsx",         what:"Chapter tracker, storage-backed, real chapter data",   use:"Status review, session handoffs" },
DELETE: { lane:"Memoir",   file:"memoir-hub-v3.jsx",                 what:"Writing collaborator, self-healing API, excavation",   use:"Active writing + excavation sessions" },
```

**P5 — CANON_TABLE, three filename swaps:**
```
OLD: { lane:"Pitch",    file:"dispatch-v3.jsx",                   what:"Quick-post dispatcher, Drive MCP, tone control",       use:"Short FlashFusion/AI posts from build notes" },
NEW: { lane:"Pitch",    file:"dispatch.jsx",                      what:"Quick-post dispatcher, self-healing API, client mode", use:"Short FlashFusion/AI posts from build notes" },

OLD: { lane:"Content",  file:"publishing_command_center_v2.html", what:"5 publishing paths + 4 personas + pitch/letters",      use:"Path decision, persona targeting" },
NEW: { lane:"Content",  file:"publishing_command_center.html",    what:"5 publishing paths + 4 personas + pitch/letters",      use:"Path decision, persona targeting" },

OLD: { lane:"Ref",      file:"project-focus-evolution-v2.html",   what:"Career/project evolution timeline",                    use:"Narrative ref for pitches and About copy" },
NEW: { lane:"Ref",      file:"project-focus-evolution.html",      what:"Career/project evolution timeline",                    use:"Narrative ref for pitches and About copy" },
```
Also swap the `kyle-origin-video-scripts-v4.md` CANON_TABLE row to the suffix-free name.

**P6 — STALE array, full replacement:**
```
OLD:
const STALE = [
  { file:"memoir-project-hub.jsx",          why:"Superseded by memoir-command-center.jsx" },
  { file:"publishing_command_center.html",   why:"Superseded by v2 (fewer tabs, less content)" },
  { file:"project-focus-evolution.html",     why:"Superseded by v2 (token-aware, memoir section)" },
  { file:"pitch_console_bak.html",           why:"Pre-Jared backup — archive/delete" },
  { file:"dispatch-v2.jsx",                  why:"Superseded by v3 (Drive integration, toasts)" },
];

NEW:
const STALE = [
  { file:"dispatch_archive_2026-07.jsx",     why:"Was v2 (WCAG pass) — superseded by dispatch.jsx" },
  { file:"memoir-command-center.jsx",        why:"Retired Jul 2026 — absorbed by this hub" },
  { file:"memoir-hub-v3.jsx",                why:"Retired Jul 2026 — absorbed by this hub" },
  { file:"dispatch-v3.jsx",                  why:"Removed from project Jul 2026" },
  { file:"pitch_console_bak.html",           why:"Deleted Jul 2026 ✓" },
];
```

> Standing defect: this hub hardcodes a parallel copy of CANON — third drift
> incident from this mechanism. Follow-up worth 30 min: render the CANON tab
> from one pasted source block instead of a maintained array.

**RESOLVED Aug 11, 2026:** implemented — `abstrekkt-author-hub.jsx` now stores CANON.md §1 as one
pasted `CANON_SOURCE` template string; `parseCanonSource()` derives lane groups, rows, and a
best-effort stale list from it for `CanonTab()`. Syncing CANON.md into the hub is now a single
copy-paste (escape backticks/`${` on paste) instead of a manual field-by-field transcription.

---

## 3. Upload set

1. `CANON.md` (reconciled — replaces current)
2. `abstrekkt-author-hub.jsx` (after P1–P6)
3. Verify `STATE.md` [VERIFY] item still open: Load-Bearing publish status (D10 — needs one-line answer)

---

## 4. Acceptance criteria (run in a session with a refreshed mount)

1. `ls /mnt/project | grep -cE '\-v[0-9]|_v[0-9]|_bak'` → **0** (`_archive_` exempt)
2. Every §1 canonical → file PRESENT
3. `grep -c "dispatch-v3\|_v2.html\|-v4.md" CANON.md abstrekkt-author-hub.jsx` → **0**
4. REVIEW block ≤ 6 entries and shrinking — each gets a purpose row or archive rename within two sessions
5. `view /mnt/project/STATE.md` succeeds (mount refresh confirmed)

---

## 5. Decisions log

| ID | Decision | Basis |
|---|---|---|
| Q1 | dispatch-v6 → canonical `dispatch.jsx` | EVIDENCE — v6 source verified in index (3-retry self-heal, mock fallback, Drive phase, client mode) |
| Q2 | `publishing_command_center.html` survivor = canonical | DEFAULT — VERIFY tag embedded; v2 content recoverable from index if survivor is v1 |
| Q3 | memoir-command-center + memoir-hub-v3 = retired by absorption into author hub | DEFAULT — hub replicates chapter ledger + excavation queue; sources recoverable |
| Q4 | FlashFusion Delivery suite (00–06) = relocated, not deleted | DEFAULT — consistent with Jul 7 lane reorg; restore from index if wrong |
| D8 | Breathe RECOVERED file | MOOT — already absent from live project |
| D9 | 9-file mount gap | MOOT — mount-refresh lag, files live in project |
| D10 | Load-Bearing publish status | **OPEN** — needs one-line answer |
