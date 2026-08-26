# Session — April 16, 2026
**Project:** Literary Memoir / FlashFusion / Personal Brand
**Type:** State sync + knowledge architecture + pitch research

---

## What We Did

### 1. Knowledge Architecture System Designed
Built a full content-addressed knowledge system for cross-project Claude context — the answer to the "no project merging" problem.

**Four layers:**
- **Atom** — single fact/decision, stable ID (`FF-ARCH-001`)
- **Cluster** — aggregated atoms by type (`FF-ARCH` table)
- **Hub** — per-project master context doc, what you upload to Claude projects
- **Root (MOC)** — map of everything, points to all hubs

**ID format:** `{PROJECT}-{TYPE}-{NNN}`
- Projects: `FF` (FlashFusion), `INT` (Intinc), `CUST` (Customization), `XREF` (shared)
- Types: `ARCH`, `BLOCK`, `SKILL`, `BIZ`, `STACK`, `API`, `OKR`, `XREF`

**Key insight:** `XREF` nodes live once, referenced by multiple hubs — no duplication.

**Distillation prompt to run on any old Claude project:**
```
Analyze this conversation and produce atomic knowledge nodes using the format:
- ID: {PROJECT}-{TYPE}-{NNN}
- Status: stable/draft/stale
- Summary (1 sentence max)
- Detail (2-3 sentences)
- Cross-refs (IDs of related nodes)

Then produce a cluster table grouping all nodes by type.
Then produce a 2-sentence hub summary: current state, open blockers, key decisions.
Output as markdown codeblocks.
```

---

### 2. Full Chat Audit — 20 Conversations Reviewed

**Key findings surfaced:**

| Item | Finding |
|---|---|
| Lee Chong Ming | HE/HIM — prior sessions had wrong pronouns. Pitch not killed, still drafting. |
| Continuum root cause | TWO problems: broken GitHub App + Node 24→22 version mismatch |
| Book 1 | Nuked by Kyle, now rebuilding from scratch |
| Base44 | Grew from 35 → 43 apps |
| kylerosebrook.com | Live + crawlable. WooCommerce ghost cart on homepage. robots.txt still blocking. |
| All 5 memoir seeds | Confirmed as real memory |
| Personal brand launch | Pushed back from April 13 |

---

### 3. robots.txt Fix Locations

**kylerosebrook.com (WordPress):**
WP Admin → Settings → Reading → uncheck "Discourage search engines" → Save
*(Also check Yoast SEO → Search Appearance if installed)*

**flashfusion.co (Wix):**
Wix Dashboard → Settings → SEO → Robots.txt Editor → remove `Disallow: /` → Save

Both take 24–72 hours to propagate to Google.

---

### 4. Lee Chong Ming Pitch — Send Window Is Now

He just published:
- AI agent at Stanford outperforming human hackers at finding security flaws
- 7-hour embedded piece with a vibe coding team at Google Gemini hackathon

His LinkedIn bio: *"particularly interested in how people and businesses use AI — if there's a bold, quirky, or unexpected angle, even better."*

**Two things needed before sending:**
1. Live playbook URL (kylerosebrook.com post or public Notion doc)
2. WooCommerce off homepage

Contact: `cmlee@insider.com`

---

### 5. Book 1 Status
"Breathe Through the Bullsh*t" — nuked, now rebuilding from scratch.

---

## Current State Snapshot

### Blockers (in order)
1. **Supabase bill** — overdue, ~2 weeks to pay. Continuum suspension risk.
2. **Vercel GitHub App** — manual reconnect at `vercel.com/flash-fusion/continuum/settings/git`
3. **WooCommerce** — deactivate plugin, delete Cart/Checkout/Shop/My Account pages
4. **robots.txt** — both domains blocked from indexing

### Active
- FlashFusion Demo Day — April 18, 5 gates still open
- Literary memoir — excavation phase, Session 3 (Tool Archaeology) next
- Lee Chong Ming pitch — drafting, timing is good
- Book 1 rebuild — in progress
- FlashFusion + personal brand running parallel

### Not Started
- Memoir Session 3 — Tool Archaeology (chronological 240+ tools mapping)
- robots.txt lift on both domains
- WooCommerce cleanup

### Parked Until Supabase Paid
- Continuum reconnect / new deploys

---

## Open Question

**Book 1 rebuild** — what's the current structure? Blank page, recovered outline, or something else?

---

*Next session focus options:*
- *Memoir Session 3: Tool Archaeology*
- *Lee Chong Ming pitch finalization*
- *Book 1 rebuild direction*
