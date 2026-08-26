# PROJECT STATE — Current as of March 26, 2026

This file is the authoritative snapshot of where things stand.
Last updated: End of March 26 parallel audit session.

---

## FLASHFUSION — Current State (FULLY ACTIVE, NOT ARCHIVED)

> Previous state had FlashFusion listed as "archived at 60-70%." That was stale by 3 sessions. FlashFusion is the primary business track.

**Strategy status:** Full strategy locked March 25. Three decisions made:
1. First customer: Sole Revival FIRST (Fortune 500 adjacency), CSTMPRNT simultaneous
2. Pricing: Hybrid — $99-149/mo base + $0.10-0.25/AI action
3. Anthropic Plan B: "Model-agnostic, Claude-preferred" + OpenAI operator tier fallback

**Three-layer brand architecture (decided):**
1. `kylerosebrook.com` — personal brand/story/distribution hub (Monday launch target)
2. `FlashFusion.co` — B2B AI enablement
3. `ChaosClubCo` — mental health/peer support (stays separate)

### Base44 Apps (FlashFusion lane)
| App | ID | Status | Notes |
|---|---|---|---|
| Fusion AI | 68dd8e79ca073475565c8e16 | Live | 67-entity production platform. Core product. |
| FlashFusion B2B | 69c440b10249984f1114bc4b | Live | B2B app. AI Readiness Scorecard, 3 tiers, client portal, ROI calc. |
| Continuum | 69c44063f697f0f1017ed1c2 | Live | AI opportunity discovery engine. |
| Sole Customizer | 6990d794da1e2f0102c267bd | BUILT — DEMO READY | Corporate custom shoe platform. 7 entities: Inquiry, Product, Order, SavedDesign, Testimonial, Review, Wishlist. **This is the Sole Revival demo asset. Already built.** |
| SoleIgnite | 68d1c017b920ca5b5d9c7db5 | Live | Earlier Sole Revival iteration. |

### Vercel (FlashFusion team: team_hPVeJgH0h1nCrogiaMvD6fxu)
- `continuum` — LIVE, last good deploy March 23
- `int-sysdesigngen`, `agentk`, `command-center`, `omni-gen`, `int-dash-engine` — deployed
- `v0-skydda-ai-sentinel` — AppSec tool

### Supabase
- `flashfusion` (mlqebvxmavrzousuqyjr) — main, ZERO advisors, fully clean
- `FlashFusionWebsite` — frontend project
- `ascend-ai` (suihrwqpljkswdbhekms) — new March 20
- `intinc` — INT-adjacent, separate concern

### n8n Workflows
**ACTIVE:**
- Portfolio Command Center Live Sync (JPSVa3cLtQPi8NKF) — active, 3 triggers

**7 OAI workflows (March 26) — INACTIVE, NEED HTTP WIRING:**
All are: Schedule Trigger → HTTP Request [EMPTY] → Code → HTTP Request [EMPTY]
Endpoints and auth not configured. Cannot activate until wired.

| Workflow | ID | Schedule |
|---|---|---|
| OAI Data Retention Purge | JErzPwjEoqxgMRUR | Nightly 2AM |
| OAI Context TTL Purge | iRYUUgbGXoILsNK4 | Hourly |
| OAI Token Budget Reset | kLeTXNrAb3NHAmu4 | Hourly |
| OAI Execution Queue Expiry | Nxbib8ZjIqBjl27b | Hourly |
| OAI System Health Snapshot | 4v2bcTMOuY6oG0F4 | Hourly |
| OAI Scheduled Job Executor | otATfw4PYkkMOBGc | Per-minute |
| OAI WebhookBridge Pinger | fk1RKSu2sBoYvOuL | Every 5 min |

### Google Drive Docs (March 25)
- Hard-Question FAQ: https://docs.google.com/document/d/1C76cw3Y--51FIS3h-A9BLObcCumohHBXQfMTCpKCFC0
- Claude Partner Network Roadmap: https://docs.google.com/document/d/1rSZUaYvJBuRUZAJ0Qpz4XX7idpAINXJSnsndeObjQqE
- Master Reference: https://docs.google.com/document/d/1sQdUCemN8Vp8hCJgW8UnM_bNxsOSpbyw1YRRi8aJN0M
- Messaging System: https://docs.google.com/document/d/1z6DMLQaZcirxmvQ0fkn-1Ybe4aCw6myfi42GbrHs3eo
- Competitive Positioning: https://docs.google.com/document/d/1BrS7iU1QCNX4_1g5TOlhPdSWbtm8Tv1Ci7v32rRPyrM
- Launch & Scaling Framework: https://docs.google.com/document/d/1DpiFzNGpw_-5PAHGmXEiX78d_nBH5Pj0vbOrT3bLxJc

### Notion
- Source 6 for NotebookLM (STILL NEEDS UPLOADING): https://www.notion.so/32eea14fb16781f396edc68b9e14dd72
- Prompt 10 (co-founder brief) needs re-run after Source 6 upload

### Prospect Pipeline
| Tier | Business | Contact | Price | Status |
|---|---|---|---|---|
| T1 | The Sole Revival | Former boss | $500/mo | Demo built (Sole Customizer). Text this week. Lead with demo. |
| T1 | CSTMPRNT | Owner relationship | $400/mo | Simultaneous. Discovery call. |
| T1 | Relish Print | Owner Derrick Baker | $300/mo | After CSTMPRNT. |
| T1 | Iron Horse Seating | Marketing contact | $600-800/mo | High ceiling. Dispatch/ops vertical. |
| T2 | Grand Appliance | EVP Aaron Reckling | $50-150K/yr | Birthday this month. Reconnect only. |
| T2 | Centerline Equipment | Best friend | $1-3K/mo | Domain play (cline.com) + internal AI |
| T3 | Fogcutter, O'Tooles, Music repair | Various | $200-1K/mo | INT clients, not FlashFusion |
| T4 | Individuals | Open tier | $20-75/mo | Validation + testimonials |
| T5 | Jeff at Chase | Best friend | Year 2 | Requires SOC2 |
| T6 | cline.com domain | Best friend owns it | ? | Text this week |

---

## PUBLISHING STRATEGY — Current State (NEW TRACK)

**Document:** KyleRosebrook_Publishing_Strategy_v1 (March 25, 2026)
https://docs.google.com/document/d/11qjw9UcmwVQ4lpD4FarkDoeA4Q3oXHg2wy5_IX41Y0o

### Track 1 — Workbook Ladder

Format sequence: B → C → A (Format D disqualified)

| Format | WSJF | Action |
|---|---|---|
| B — Short-Form (8-15K words) | 6.67 | LAUNCH FIRST |
| C — Workbook-First (20-30K) | 3.80 | Scale from B |
| A — Flagship (50-70K) | 1.33 | Year 2+ |
| D — Low Content | DISQUALIFIED | Do not launch |

**4 Pillars:** Mental Wellness | Professional Success/Creative Economy | Digital Life Design | Tech-Heavy Living/Family Wellness

**Critical blocker:** Prompt 5 (title-level scorecard) NOT run. DO NOT commit production hours to any title until complete.

**Phase 1 kill gate (Day 60):** Format B BSR ≤150K + read-through signal = GO. BSR >500K + $150 ads + 0 organic = KILL.

**Production rules:**
- Format B: KU enrolled, $2.99-$3.99, reused cover template per series
- Format C: KU NOT enrolled, $14.99-$24.99, paperback primary, Atticus interior
- Illinois LLC/DBA imprint: register BEFORE first publish ($150-300)
- AI disclosure: "AI-augmented human creator" framing

**Tool purchases needed:**
- Publisher Rocket ($97-199/yr) — before Prompt 5
- Atticus ($147 one-time) — before Phase 2

### Track 2 — Memoir
See MEMOIR section below. Publish AFTER workbooks build list (12-18 months).

### Open Research Prompts (priority order)
1. 🔴 Prompt 3-C: Phase-gated roadmap + B→C adversarial — CRITICAL, run now
2. 🔴 Prompt 5: Title-level validation scorecard — after 3-C
3. 🟡 Prompt 6: Revenue model Year 1 — after Prompt 5
4. 🟡 Prompt 2: Author identity — after Prompt 6
5. 🟡 Prompt 4: Tech stack leverage — concurrent with Phase 2
6. 🟢 Prompt 7: Hybrid ecosystem — Month 6

---

## MEMOIR (LITERARY NONFICTION) — Current State

**Phase:** Early excavation. Working thesis locked. No full chapters drafted.

**Thesis:** "How does a person whose mind has been broken rebuild agency not through recovery of what was lost, but through construction of what never existed?"

**Structure confirmed (Publishing Strategy v1):** Parallel Timeline / Crucible hybrid
- Opens near the crucible (NOT at childhood)
- Past: specific scenes from active use, intelligence performing, compartmentalization
- Present: Staff Engineer, same cognitive work, clean, AI-augmented
- Converge: timelines meet at transformation
- THE INVERSION: skills from active use (pattern recognition, systems thinking, risk tolerance, compartmentalization) = cognitive toolkit of effective technologist

**Primary reader:** Person in Year 2 of recovery with a brain they haven't figured out what to do with yet.

**Publish after:** 12-18 months of workbook publishing. Memoir publishes to the list they build.

**What exists:**
- Voice DNA v2 artifact
- Governing thesis locked
- Letter-to-Kinsley frame established (load-bearing)
- Neuroimaging scan as potential cover concept
- Comparable works identified — NO DIRECT COMP EXISTS (this is the gap)

**Unique intersection Kyle owns:** Substance use + high-intelligence disguise + multiple career reinventions + arrival at technical/AI identity + non-credentialed expertise impostor syndrome. Not in any published book.

**What's needed next:**
- Excavation: O'Toole's sensory inventory, the rupture rough notes
- Chronological tool/system mapping (construction archaeology)

**Protected areas:** TBI specifics, addiction specifics, family (beyond Kinsley) — Kyle discloses on his terms.

**Memoir legal review:** $500-3,000. Required at Month 8-9. Budget now, spend later.

---

## CHAOS CLUB CO. APP — Current State

**Phase:** MVP concept complete. Firebase Studio implementation documented.
**Base44 app:** 69726bea1c1525bf9ac336d1 — live

**All spec docs in project knowledge** (see prior state for full list)

**Pending:**
- PWA micro-app vs. B2B/EAP direction — decision pending
- Firebase MVP build — NOT STARTED (full spec ready)

---

## CHAOS CLUB BOOK 1 — Current State

**Title:** "Breathe Through the Bullsh*t"
**Status:** MANUSCRIPT COMPLETE. .docx build pending.
**Build script:** `/home/claude/build_manuscript.js` — written, not yet run
**Steps remaining:** `node build_manuscript.js` → validate → present_files
**Known issue:** Chapters 1-6 appear twice in source — exclude second copy

---

## KINSLEY PROJECTS — Current State

**Vercel:** infinite-heros-bedtime-chronicles + v5 live (FlashFusion team)
**GitHub:** ChaosClubCo/kidcreator (StoryWeaver, last commit Nov 2025)
**Google AI Studio:** Kinsley's World (March 9 2026) — voice-powered sandbox EXISTS
**Status:** Multiple live surfaces. Keep entirely separate from business.

---

## OPEN ITEMS (PRIORITY ORDER)

### Kyle owns this week
- [ ] Text Sole Revival — lead with "I built something for you" not a pitch
- [ ] Text CSTMPRNT — discovery call: "What would ERP actually do for you?"
- [ ] Text Centerline friend about cline.com domain value
- [ ] Message Aaron Reckling (birthday month — reconnect only, no pitch)
- [ ] Upload Notion page to NotebookLM as Source 6, re-run Prompt 10

### Technical work (next sessions)
- [ ] Wire 7 OAI n8n workflows — needs Supabase/Base44 API endpoints + auth
- [ ] Deploy flashfusion.co → Vercel (Cloudflare DNS)
- [ ] Run Publishing Prompts 3-C and 5 (need NotebookLM + Publisher Rocket first)
- [ ] Purchase Publisher Rocket ($97-199) before Prompt 5
- [ ] Chaos Club Firebase MVP — full session
- [ ] Run `node build_manuscript.js` for Book 1 .docx
- [ ] Illinois LLC/DBA imprint registration ($150-300)

---

## BUDGET CONTEXT

~$1K available.

Priority spend order:
1. Publisher Rocket: $97-199/yr (before Prompt 5)
2. Atticus: $147 one-time (before Phase 2 workbook build)
3. Illinois LLC/DBA: $150-300 (before first publish)
4. Amazon Ads Phase 1: $150-300 (launch week only)
5. Memoir legal review: $500-3,000 (Month 8-9, budget now, spend later)

---

## SESSION HISTORY (Recent)

**Session: March 26, 2026**
- Full parallel system audit
- Discovered: Sole Customizer already built; Publishing Strategy v1 fetched; 7 OAI workflows are stubs; PROJECT_STATE was severely outdated
- Updated: Notion pipeline (Tier 4 individuals); this PROJECT_STATE
- Pending: Wire OAI workflows; NotebookLM Source 6; deploy flashfusion.co

**Session: March 25, 2026**
- Three decisions locked (first customer, pricing, Plan B)
- Continuum /api/discover built and deployed
- NotebookLM: 10 prompts run, Source 6 confirmed missing

**Session: March 2026 (prior)**
- Chaos Club Book 1 manuscript completed
- build_manuscript.js written (not yet run)
