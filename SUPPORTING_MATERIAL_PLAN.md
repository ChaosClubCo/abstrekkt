# Supporting Material Plan

Audit of every arc for tasks that assume **pre-existing personal source material** (your own posts, videos, builds, drafts, data) rather than material the curriculum creates as it goes. 61 of 75 arcs reference *some* audit/artifact task; most are fine — the "material" is generated in-arc (an ADR, a playbook, a rubric). This plan isolates the tasks that **block on something you have to supply**, and proposes what to gather before that month arrives.

**Severity key:** 🔴 blocking (task cannot start without the source material) · 🟡 soft (task degrades to guesswork without it, but can proceed) · ⚪ self-resolving (the arc creates the artifact itself, no external input needed — listed for completeness only where it's a recurring cross-arc dependency)

---

## 1. Highest priority — Series 9 personal arcs

These are about *your* actual ventures. The curriculum text assumes specific real artifacts exist (a repo, a Figma file, a draft manuscript). Right now the project has no record of them.

### `brand` (Brand)
- 🔴 **Last 20 LinkedIn posts** (M1, M2) — the entire positioning + content-audit exercise reads your actual post history. Export or screenshot your last ~20-30 posts (text + engagement counts) before M1.
- 🔴 **List of your last 12 builds** (M1) — for pillar-mapping. A simple bullet list (what you shipped, which pillar it proves) is enough.
- 🟡 **Newsletter analytics** (M3) — subscriber count, open/click rate, which editions got replies. Needed from wherever The Prompt is hosted (Substack/ConvertKit/etc).
- 🟡 **List of 25 practitioners to engage with** (M2) — names/handles, not analysis.
- ⚪ Everything from M6 onward (repurposing, flagship post, retrospective) consumes what M1-M3 produce — no new external material once the above exists.

### `chaosclubco` (ChaosClubCo)
- 🔴 **claude-code-plugins-plus repo state** (M1) — confirm the 244 plugins actually install; the arc assumes this audit as a precondition.
- 🔴 **Ample Figma file** (M4) — "what exists vs. what is in the Figma file" needs the file itself.
- 🔴 **FissionPrompt repo, last commit Nov 2025** (M7) — needs repo access to audit current state.
- 🟡 **Demo recording** (M1) and **3 video generations** (M8) — screen-capture tooling, no pre-existing asset, but budget time to actually shoot them.

### `flashfusion` (FlashFusion)
- 🔴 **Ryan/Iron Horse case study material** (M2-M3) — audit fieldwork, profile, case study draft all assume the underlying client engagement notes exist somewhere. Consolidate what's real vs. aspirational before M2.
- 🟡 **CLC workshop materials** (M4) — referenced as an input to other arcs (`brand` M5, `teaching`) — decide once, reuse everywhere rather than rebuilding per arc.

### `readingroom` (Reading Room)
- 🔴 **Load-Bearing newsletter archive** (M5, M9) — "read 8 weeks back," "distribution analysis" both need the actual published editions and their stats.
- 🟡 **Essay series drafts** (M3-M4) — concept brief assumes a theme is already forming; fine to originate in-arc if nothing exists yet.

### `abstrekkt` (Abstrekkt Products)
- 🔴 Same repo audit as `chaosclubco` M1 — **the 244-plugin repo is the shared source for both arcs.** Do this once, not twice (see cross-arc note below).
- 🟡 **Ample / FissionPrompt product definitions** — flagged in the catalog itself as "no product definitions yet." That's honestly a content gap, not a supporting-material gap — those arcs are waiting on a decision, not a document.

### `memoir` (Memoir)
- 🔴 **Existing memoir draft + existing practitioner-book notes** (M1 in `book`, M4 external read in `memoir`) — the very first task is a side-by-side audit of two drafts that must already exist in some file/folder. Locate and consolidate them before M1.

---

## 2. Cross-arc shared-artifact gotcha

Several arcs reference a "capability brief," "playbook," or "Partner Network profile" as if one canonical version already exists and just gets updated — but no such artifact lives in this project. First arc to touch one of these should **create it as a real file**, and every later arc should link/update that same file instead of re-describing it from scratch:

- **Capability brief** — first built in `aiaas` M2; referenced again in `security`, `rag`, `mcp`, `n8n`, `devex`. Build once in `aiaas`, reuse.
- **The "playbook"** (subject varies per arc: security posture, eval, RAG, sales, DX) — each arc's own playbook is genuinely distinct content, but the *pattern* (draft in a mid-month, polish near the end, publish at the gate) repeats identically across `security`, `rag`, `n8n`, `eval`, `synthetic`, `aidev`, `consulting`, `enterprise-sales`, `governance`. No material gap here — just note it's the same shape every time so drafting doesn't start from zero each arc.
- **Partner Network / LinkedIn profile updates** — appear as a recurring gate action (`security`, `rag`, `n8n`, `mcp`, `partner`, `course`) assuming the profile already exists and is current. Confirm it's actually live before the first arc that references it (`mcp` M9 or `security` M5, whichever lands first).

---

## 3. Original-26 arcs — lighter touch, real but self-contained

These reference "your own builds" or "your existing X" but the audit is meant to run *on whatever you actually have* — no specific pre-supplied file is assumed, so no blocking gap. Flagging only where the source is unusually specific:

- 🟡 `eval` M1 — "pick one production agent you've shipped (Bitwarden migration, Drive automation, or a Customization Service workflow)" — names specific past projects; confirm these three are real and pick one before M1.
- 🟡 `strategy` M1 — same three named projects, different audit (PRD you should have written).
- 🟡 `n8n` M1 — "your top 5 existing workflows" — list them before M1 so the 10-point audit isn't done live.
- 🟡 `aisec` M10 / `devex` M11 / `governance` M9 / `local-ai` M8 — each needs "one real client or Intinc-adjacent project" willing to be the guinea pig. Line this up a month ahead so the gate doesn't stall on availability.
- ⚪ Everything else in this tier (ADRs, rubrics, red-team reports, retros) is generated fresh in-arc — no gap.

---

## Action list, in order of urgency

1. Pull your last ~20-30 LinkedIn posts (text + engagement) → unblocks `brand` M1-M2.
2. Confirm claude-code-plugins-plus repo installs cleanly at 244 plugins → unblocks `chaosclubco` M1 and `abstrekkt` M1 (same audit, do once).
3. Locate the Ample Figma file and FissionPrompt repo → unblocks `chaosclubco` M4/M7.
4. Consolidate whatever's real on the Ryan/Iron Horse engagement into one doc → unblocks `flashfusion` M2-M3.
5. Find (or confirm the absence of) the memoir draft + practitioner-book notes → unblocks `memoir`/`book` M1.
6. Locate Load-Bearing newsletter archive + any subscriber stats → unblocks `readingroom` M5/M9.
7. Name the three "real production agent/project" examples used repeatedly (`eval`, `strategy`, `n8n`) so those M1s don't stall.
8. Decide where the capability brief will live once `aiaas` M2 creates it, so later arcs link instead of re-authoring.

Nothing above requires new curriculum writing — it's all "go find/confirm this real-world artifact before the month that needs it."
