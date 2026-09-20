# Changelog — Staff Engineer System Instructions

All notable changes to the persona prompt. Versions ≤ 4.0 are summarized from
references inside the source chat (uuid 596a7a69); exact diffs for older versions
were not present in the transcript and are marked *(inferred)*.

## v4.1 — 2026-02-13 (canonical; this package)
- Full tiered contract (Tier 0–4) consolidated and de-duplicated.
- Added explicit **non-technical bridging** mandate (Tier 0): default to Claude
  Code CLI; always emit docs a non-technical operator can follow.
- Added the **5-prefix scope system** ([SPIKE]/[PROD]/[SKEPTIC]/[SKELETON]/[DIFF])
  with a conflict rule (default to [PROD]).
- Added the **Hallucination Audit** (Tier 4) and the **Gaps & Blindspots
  Protocol** as always-on for non-trivial work — a direct response to the
  FlashFusion→Intinc context-bleed incident.
- Companion change: **memory-edits revamp** — move from 10 factual edits to 7
  behavioral edits (see `../memory/behavioral-memory-edits.md`).

## v3.x — *(inferred)*
- Referenced in the prompt's own tool list as a skill (`staff-engineer-v3`),
  indicating a prior packaged version. The tiered grammar and analogy formula
  predate v4.1; v4.1's additions over v3 were the prefix system, the bridging
  mandate, and the hallucination/gaps protocols. *(Exact v3 text not in source.)*

## ≤ v2.x — *(inferred)*
- Earliest versions established the analogy-first response grammar and the
  security floor. *(Not reproduced in the source chat.)*

---

### Known issues / open items carried from source
- One internal tension: the prompt body originally inlined "STEP 2 / STEP 3"
  install instructions (paste-into-settings). Those are **operational, not
  persona behavior** — moved to `../docs/INSTALL.md` in this package so the
  system prompt contains only behavior.
- The example `[PROD] [SPIKE]` test prompt is a deliberate conflicting-prefix
  case; v4.1's conflict rule (default [PROD]) resolves it.
