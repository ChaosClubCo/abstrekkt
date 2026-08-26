# what-changed.md — Memoir source pack

**Generated:** July 2026 session (Cowork)
**Lane:** PERSONAL / memoir
**Blast radius:** Read-only retrieval from the ChaosCollective project + one project write (`PROJECT_STATE.md`). This local pack is a delivery copy; no memoir source docs were altered.

---

## What this pack is

A packaged copy of the four documents involved in the "Rupture" / "I did claude" source-material hunt and the Tom identity correction, plus this changelog.

| File | Status in this pack |
|---|---|
| `PROJECT_STATE.md` | **PATCHED** — new Character status ledger + July 2026 session entry. This is the version that was written back to the project. |
| `memoir-excavation-jan2025-the-rupture.md` | Verbatim copy of the project doc. **Unedited.** |
| `moving-in-silence-was-phase-one.html` | Verbatim copy of the project doc. **Unedited.** |
| `btbs_accelerator_v3_1.html` | Verbatim copy of the project doc. **Unedited.** (Interactive app; the runtime API calls are non-functional without a key — by design, no secret embedded.) |

---

## The only file that was changed: PROJECT_STATE.md

Three additive edits, nothing else touched (all prior content preserved byte-for-byte):

1. **New "Character status ledger"** under the MEMOIR section — ground truth, confirmed by Kyle:
   - **Tom Ropel — ALIVE.** Best friend. One of "The Five." Never write him as deceased.
   - **Tom Schopp — DECEASED.** Choked on his own vomit (alcohol-related). Met Kyle at the Salvation Army / on truck routes. Niece: Nora. Colin texted re: his death.
   - **Dave Datt — DECEASED.** Brain aneurysm.
   - Disambiguation line: the bare "Tom" who dies in the memoir docs = **Tom Schopp, NOT Tom Ropel.**
2. **July 2026 session-history entry** recording the correction.
3. Header date rolled June → July 2026.

---

## Open flags — NOT auto-resolved (need Kyle's call)

These were found during the hunt and are surfaced rather than silently "fixed," because fixing them means assigning biography to a specific Tom, which only Kyle can confirm.

1. **`btbs_accelerator_v3_1.html` conflates the two Toms in its own ground truth.** The `SYS` block lists "Tom Ropel" among The Five (alive) but attaches the dead-shelter-Tom biography ("met at Sally on truck routes… Died choking on vomit, alone… Niece Nora") to a bare "Tom." Worse, the **"Tom — Full Chapter" excavation prompt (PR array) explicitly names the dead best-friend "Tom Ropel"** — "Best friend growing up. Met at Sally on truck routes. Helped with Kinsley… losing him." Per the corrected ledger, the one who died = **Schopp**, so this prompt currently assigns a death to a living person. Needs Kyle to split which biographical details (Sally/truck routes/Kinsley helper/Nora/Oliver/Colin) belong to Schopp vs. Ropel.

2. **`memoir-excavation-jan2025-the-rupture.md` §4** still carries the unresolved `[FLAG — IDENTITY]` ("is shelter-Tom = Tom Ropel / Schopp / neither?"). Answer per the ledger: **Schopp.** The flag text itself was left in place (source doc unedited in this pack).

3. **Date conflict on the "I move in silence" repost:** dated **Jan 5, 2025** in the rupture doc and **Jan 12, 2025** in `moving-in-silence-was-phase-one.html`. Same verbatim text, two dates. Unresolved.

4. **The raw "I did claude" post** (in-bed doomscroll; "amazing im not dead"; "quit xanax for good"; "be a dad"; 24-hours-nothing) was **NOT FOUND** as a standalone artifact anywhere in the project. The phrase "I did claude" exists only as a quoted line inside the rupture doc. If it exists, it's on Facebook / an un-uploaded screenshot.

5. **`btbs_accelerator_v3_1.html` is the nuked Book 1** ("Breathe Through the Bullshit"). PROJECT_STATE lists Book 1 as NUKED / do-not-reference, yet the housekeeping section retains this file as canonical. Included here because it was in scope of the Tom discussion — flagging the status contradiction, not resolving it.

---

## Verify

- `PROJECT_STATE.md` — open, confirm the Character status ledger reads correctly and no other section changed.
- To resolve flags 1 & 2 in the source docs: tell me which Tom owns which biography and I'll patch both via targeted edits (Kyle-verbatim quotes left untouched).
