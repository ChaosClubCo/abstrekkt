# Reconciliation Audit — live Arc System vs. `arc-system-2026-06-10`

Compares this project's live **Arc System** (v1.4, 75 arcs, `arcs-data.json`) against the attached local folder **`arc-system-2026-06-10`** (governance docs + source dated Jun 10 → Jul 7, 2026). Exploration only — nothing below has been applied. See `CLAIMS / GAPS` at the end.

---

## 0. Two different systems that both say "arc"

- **This project's Arc System** — a **learning-curriculum tracker**. 75 arcs (skill domains + 5 personal ventures) across 9 "series," each with a 12-month/48-week schema. Six DC tools (Reader/Momentum/Portfolio/Execution/Dependencies/Briefing) read one shared data layer.
- **`arc-system-2026-06-10`** — a **business/life operations system**. 4 real "lanes" (FlashFusion, Abstrekkt Products, Memoir, Reading Room) tracked by 8 execution tools (allocator, dashboard, balance, blockers, briefing, WSJF, composer, schedule-mapper), plus governance docs (`AUDIT-2026-06-10.md`, `README-v2-2026-06-10.md`, `ryan-boundary-doc-2026-07-07.md`, `SPRINT-M2-2026-07-07.md`) that carry real, current business facts: an active client (Art), a case-study trade (Ryan/Iron Horse), warm pipeline (Union VP, College of Lake County, Lafu/Joe), LLC/E&O status, and a CCA-F exam dated Jul 20, 2026.

They share DNA (below) but are not interchangeable, and the second one is the more current source of truth about Kyle's actual life/business state.

## 1. Lineage — the 26 originals + roadmap, confirmed

All **26 "original" arcs** in `arcs-data.json` map 1:1 to the 26 single-arc `.jsx` files in `04-inherited-intinc-era/` (e.g. `claude-arc.jsx`→`claude`, `security-arc.jsx`→`security`, `eval-safety-expert-arc.jsx`→`evalexpert`). Same for the **44 roadmap arcs**, sourced from `next-7-arcs-series-1.jsx` through `-8.jsx`.

**The "Series 2" question resolves clean, not as a gap.** `next-7-arcs-series-2.jsx` and its `.root-conflict-2026-06-23.jsx` fork both define the *same* 7 ids — `gcp`, `fullstack`, `azure`, `eval`, `voice`, `product` (titleEm "Strategy"), `cloudflare` — which are already live as 6 of the 26 originals (`product`→`strategy`). So Series 2 isn't a missing roadmap batch; it's an **unresolved duplicate draft** of arcs already counted. `SPRINT-M2` flags the conflict as unretired tracked debt, but it's low-stakes — the content's already live under the canonical versions.

## 2. Critical — day-job / colleague contamination in live data

`arcs-data.json` + `arcs-prose.json` were extracted verbatim from the inherited files, **before** the governance rule in `AUDIT-2026-06-10.md` (C4) existed: *"day job NEVER named externally, 'a managed IT firm' is the ceiling, complete lane separation."* That rule isn't reflected anywhere in the live system:

| Term | In `arcs-data.json` | In `arcs-prose.json` | Arcs affected |
|---|---|---|---|
| **Intinc** | 139 | 29 | **39 of 75** — all 26 originals + 13 roadmap arcs |
| Daniel / Jackie / Dave (real colleague first names) | 46 / 13 / 18 | 7 / 2 / 2 | overlaps the same set |
| CLC (College of Lake County, real institution) | 76 | 9 | used as generic "run a workshop at ___" filler across dozens of arcs |

Representative live sentences: *"Build one from a real Intinc or FlashFusion use case,"* *"Create a basic AI RMF organizational profile for Intinc or FlashFusion,"* *"pick the one most relevant to Intinc's actual risk."* This is baked into specific week-tasks and gate text, not a stray label — a straight find/replace of "Intinc" → "a managed IT firm" would work for most instances but should be spot-checked per sentence.

## 3. Series 9 (personal arcs) — mixed accuracy

- **`flashfusion`** ✅ current. Kicker literally says *"v2 rebased Jun 2026."* Lafu is correctly framed as warm pipeline ("Lafu/Joe") — not the retired co-founder framing. No action needed.
- **`chaosclubco`** ⚠️ **stale.** Per the Jun 2026 ruling (`AUDIT` C1), ChaosClubCo is a **retired brand, absorbed by Abstrekkt**, and shouldn't appear in new forward-planning copy. The local folder's corrected 4-lane system dropped it entirely from `01-lane-arcs/` and kept it *only* as history in `03-history/`. The live arc has no idea it's retired — it reads as a fully active, forward-looking 12-month plan ("Content + Software Portfolio"), still carrying the accent `#e11d48` that `AUDIT` explicitly says "does not automatically carry to Abstrekkt." It also directly contradicts its own sibling arc: `abstrekkt` correctly self-describes as *"parent holding identity, not a product brand"* — i.e., the system currently contains two arcs both claiming to be the parent-org lane.
- **`abstrekkt`** ✅ current — correctly labeled interim accent (`#34d399`, "pending brand v1"), matches README-v2 exactly.
- **`memoir`, `readingroom`** — extracted, not spot-checked for staleness (lower risk; local folder marks both as rebased-in-place, "content unchanged" / "name kept").
- None of the 5 personal arcs have tradeoff/claims prose yet (known gap, already in `CATALOG.md`).

## 4. Adjacent but out of scope for arc extraction

- **`uploads/kyle-career-arc.jsx`** — a 757-line life-phases timeline (P0 Organic → P1 Rupture → …), not a months/weeks/gates curriculum. Shape matches the design system's "Thinking Map" template, not the Arc schema. Flagging so it doesn't get force-fit into `arcs-data.json`.
- **`uploads/CANON.md`** — a *separate* canonical-artifact registry for an Abstrekkt content-publishing tool ecosystem (memoir tools, pitch tools, `content-engine.jsx`, `dispatch-v3.jsx`, etc.). It's more current than this project's own `uploads/` — it flags `dispatch-v2.jsx` and `publishing_command_center.html` (both sitting in this project) as stale, superseded elsewhere. None of this is arc content; noted for awareness only.
- **Local folder's `02-execution-layer/`** — a sibling business-ops suite (allocator/dashboard/balance/blockers/briefing/WSJF/composer/schedule-mapper) for the 4 real lanes. Structurally it rhymes with `Arc Portfolio` / `Arc Dependencies` / `Arc Briefing`, but it tracks real client capacity and legal blockers, not learning arcs — a different tool for a different job. Three of its own tools are mid-*internal* merge (`wsjf-prioritizer`→`lane-blockers`, `communication-composer`→`quarterly-self-briefing`, `cognitive-schedule-mapper`→`lane-allocator`), unverified as of Jul 7 — that consolidation doesn't touch this project unless asked.

## 5. Housekeeping — uploads/ duplication

Essentially every file in this project's `uploads/` has an exact-named twin with an 8-char hash suffix (~54 pairs, e.g. `claude-arc.jsx` / `claude-arc-949607cc.jsx`). Looks like the same batch got uploaded twice. Candidate for a dedupe pass once confirmed byte-identical.

## 6. On "Extract all 100+"

I didn't find a hidden batch of un-extracted arcs anywhere in the attached material. Everything shaped like a curriculum arc (26 originals + 8 roadmap series files) is already merged; Series 2 turned out to be a duplicate, not new content; everything else (career timeline, content-publishing tools, business-ops tools, governance docs) isn't arc-shaped. **75 looks like the practical ceiling of what's extractable from what exists today.** Getting past 100 means either net-new original authorship, a different definition of "100+," or source material I haven't seen yet.

---

## CLAIMS / GAPS

**CLAIMS:** All counts (Intinc 139/29, Daniel/Jackie/Dave, CLC, Ryan/Lafu/ChaosClubCo hit lists, accent values, series-2 id overlap) are **[SOURCED]** — computed directly from `arcs-data.json`/`arcs-prose.json` and grep/read of the named files, this session. The compliance framing (day-job rule, ChaosClubCo retirement, Lafu reframing) is **[SOURCED]** from `AUDIT-2026-06-10.md` and `README-v2-2026-06-10.md` verbatim.

**GAPS:** `memoir` and `readingroom` arcs were not content-diffed against their local-folder counterparts (only confirmed extracted + unchanged-per-source-docs). Whether "the-chaosclubco-arc.jsx" or an older draft was the actual v1.3 extraction source is unconfirmed — doesn't change the finding (both read as live/unretired). `uploads/` duplicate pairs were spot-checked by filename pattern only, not byte-diffed. No visibility into anything after Jul 7, 2026 (today is Jul 16) — the CCA-F exam (Jul 20) and several sprint items may have since resolved.
