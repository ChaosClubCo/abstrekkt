# PROJECT STATE — Current as of March 26, 2026

This file is the authoritative snapshot of where things stand. Update at end of major sessions.

---

## FLASHFUSION — Current State (MAJOR UPDATE)

**Status: ACTIVE. Fully rebuilt. Not archived.**

FlashFusion is now a Claude-native platform for building agent-native products in any vertical.
Thesis: Moltbook proved the category (launched Jan 28, acquired by Meta March 10 — 6 weeks).
FlashFusion is the production-safe infrastructure layer.

### Base44 Apps
- `Fusion AI` (68dd8e79ca073475565c8e16) — 67-entity production platform. Core product schema.
- `FlashFusion` (69c440b10249984f1114bc4b) — B2B-facing client app
- `Sole Customizer` (6990d794da1e2f0102c267bd) — **Product already built for The Sole Revival**
  - Entities: Inquiry, Product, Testimonial, SavedDesign, Wishlist, Order, Review
  - This is the customer-facing Activation OS. Not a concept — production schema.
- `SoleIgnite` (68d1c017b920ca5b5d9c7db5) — Earlier predecessor to Sole Customizer
- `Continuum` (69c44063f697f0f1017ed1c2) — Base44 version of Continuum

### Vercel (FlashFusion team: team_hPVeJgH0h1nCrogiaMvD6fxu)
- `continuum` — LIVE, last good deploy March 23 2026, `dpl_57UsUBvynxW1o9bknVzhe7cL3CNm`
- `agentk`, `command-center`, `int-dash-engine`, `omni-gen`, `int-sysdesigngen` — deployed
- Total ~18 projects deployed

### Supabase
- `flashfusion` (mlqebvxmavrzousuqyjr) — CLEAN, zero advisors, 7 tables (full schema applied)
- `FlashFusionWebsite` (qeutkkceycackggavmtq) — separate, active
- `ascend-ai` (suihrwqpljkswdbhekms) — new March 20, corresponds to Ascend.Ai Base44 app
- `intinc` (oorstbwcydxwiojrsoim) — INT-adjacent
- `tessa-desktop` (kobgzhovkthxkeufgvaq) — active

### n8n Workflows
- `Portfolio Command Center — Live Sync` (JPSVa3cLtQPi8NKF) — **ACTIVE**, 3 triggers
- `PassiveIncome-Scrapper` (a41HQFUp5tMraWWP) — active, MCP-enabled
- 7x OAI operational workflows created March 26 — **INACTIVE, need URL config**
  - HTTP Request nodes missing Base44 API endpoint URLs
  - Need manual config in n8n editor before activation

### Google Drive (FlashFusion docs)
- Due Diligence / Hard-Question FAQ: https://docs.google.com/document/d/1C76cw3Y--51FIS3h-A9BLObcCumohHBXQfMTCpKCFC0/edit
- Claude Partner Network Roadmap: https://docs.google.com/document/d/1rSZUaYvJBuRUZAJ0Qpz4XX7idpAINXJSnsndeObjQqE/edit
- Master Reference (Agentic Economy): https://docs.google.com/document/d/1sQdUCemN8Vp8hCJgW8UnM_bNxsOSpbyw1YRRi8aJN0M/edit
- Complete Messaging System: https://docs.google.com/document/d/1z6DMLQaZcirxmvQ0fkn-1Ybe4aCw6myfi42GbrHs3eo/edit
- Competitive Positioning: https://docs.google.com/document/d/1BrS7iU1QCNX4_1g5TOlhPdSWbtm8Tv1Ci7v32rRPyrM/edit
- Launch & Scaling Framework: https://docs.google.com/document/d/1DpiFzNGpw_-5PAHGmXEiX78d_nBH5Pj0vbOrT3bLxJc/edit

### Notion (strategy + cross-system bridge)
- Strategy Session Export (Source 6 for NotebookLM): https://www.notion.so/32eea14fb16781f396edc68b9e14dd72
- Cross-System Bridge: https://www.notion.so/32eea14fb167819c9b10ddfa4fecd01e

### Prospect Pipeline (6 tiers)
See Notion strategy doc for full details. WSJF order:
1. Sole Revival — Fortune 500 adjacency, Activation OS built (Sole Customizer app)
2. CSTMPRNT — job management product
3. Relish Print — lighter version
4. Iron Horse Seating — dispatch vertical
5. Grand Appliance — EVP contact Aaron Reckling (birthday this month)
6. Centerline Equipment — best friend, cline.com domain play

### Key Decisions (March 25)
- First customer: Sole Revival first, CSTMPRNT simultaneous
- Pricing: $99-149/mo base + $0.10-0.25/AI action (hybrid)
- Anthropic Plan B: "Claude-preferred, not Claude-locked" — OpenAI operator tier fallback

### Pending
- [ ] Text Sole Revival (no pitch — "have something to show you")
- [ ] Text CSTMPRNT (diagnostic question only)
- [ ] Text Centerline friend (cline.com domain value)
- [ ] Message Aaron Reckling (birthday — reconnect only)
- [ ] NotebookLM: Upload Notion strategy page as Source 6, re-run Prompt 10
- [ ] n8n: Configure OAI workflow HTTP Request URLs, then activate
- [ ] flashfusion.co DNS: Point Cloudflare → Vercel

---

## PUBLISHING — Current State (NEW TRACK)

**Status: Active. Full strategy documented March 25.**

**Publishing Strategy doc:** https://docs.google.com/document/d/11qjw9UcmwVQ4lpD4FarkDoeA4Q3oXHg2wy5_IX41Y0o/edit

### Workbook Track
- Format sequence: B (8-15K, launch first) → C (20-30K, scale) → A (flagship, Year 2+)
- Format D: DISQUALIFIED (KDP saturation + Etsy policy risk)
- Day-60 kill gates defined for each format
- Interior tool: Atticus ($147, not Vellum)
- KU: YES for Format B, NO for Format C
- Physical POD: Printify or Gelato, from Month 6
- 4 pillars: Mental Wellness, Professional/Creative Economy, Digital Life Design, Tech/Family
- **BLOCKER: Perplexity Prompt 5 (title scorecard) not yet run — do not commit production hours to specific title**

### Memoir Track
- Structure: Parallel timeline / crucible hybrid (Educated + Beautiful Boy model)
- Open: near the crucible — not childhood
- Target: 70,000 words
- Primary reader: Year 2 recovery, brain they haven't figured out what to do with
- Thesis: "Skills developed in active use — pattern recognition, systems thinking under pressure, compartmentalization — became exact cognitive toolkit of effective technologist"
- Author name: Kyle Rosebrook (real name, locked)
- KU: DO NOT ENROLL (0% in top recovery memoir categories)
- Publish: AFTER workbooks build list (Month 10-12)
- Legal review: $500-3K, budget at Month 8-9 separately

### Open Research Prompts (NotebookLM)
- 🔴 Prompt 3-C: B→C ladder validation (is this documented with success rates?) — RUN FIRST
- 🔴 Prompt 5: Title-level scorecard for all 8 portfolio titles — run after 3-C
- 🟡 Prompt 6: Revenue model Year 1 with kill gates — run after 5
- Load KyleRosebrook_Publishing_Strategy_v1 as source before running

---

## CHAOS CLUB CO. APP — Current State

**Phase: Full MVP build kicked off on Base44 March 26.**

Base44 app: 69726bea1c1525bf9ac336d1
Editor: https://app.base44.com/apps/69726bea1c1525bf9ac336d1/editor/preview

Features in build:
- Daily Dispatch (3-step check-in, streak tracking)
- Rebel Coach (raccoon AI, crisis detection → 988/Crisis Text Line, always free)
- Community Circles (topic groups, anonymous posting, moderation)
- Arsenal (25 categories, search/filter, crisis category always free)
- PuppyChow gamification (earn by engagement, store with cosmetic rewards)
- Session Simulator (practice hard conversations with AI)
- Subscriptions (Free / Premium $9.99/mo, crisis always free)

Legal framework: in project knowledge.
Firebase MVP: shelved in favor of Base44 build (faster, same outcome).

### Chaos Club Book 1
Title: "Breathe Through the Bullsh*t"
Status: Manuscript complete. Build script written. Final .docx pending execution.
Script: `/home/claude/build_manuscript.js`
Next: `node build_manuscript.js` → validate → present_files

### Google Drive (Chaos Club)
- Digital Product Listings & Launch Assets (March 23): https://docs.google.com/document/d/1zKS1yLo0kjAlOzbjDr4PkjgDcBjMjTW8WTg63EskQf8/edit
- Keyword Pack Copy Deliverables (March 23): https://docs.google.com/document/d/1pcbrw43b7K_iHo3ILpU6T5kEtES_nm4HRGDTlXQ9apI/edit

---

## MEMOIR — Current State

**Phase: Early excavation. Working thesis locked.**

Working thesis: "How does a person whose mind has been broken rebuild agency not through recovery of what was lost, but through construction of what never existed?"

O'Toole's excavation complete (March 25):
- Regulars: Fran + Stewart (wedding bartend blocked by manager/Kinsley custody), Kylie + Tony (Star Wars/tech bond)
- Memory held without systems
- The wander: varied, Q3 left blank
- Face: calm 98% / frantic 2% (internal screaming masked)
- Two modes: shoulder-to-shoulder chaos vs ebb-and-flow nights
- KEY: tech always present — engineering was recognition, not reinvention

What exists:
- Voice DNA v2 (voice-dna.jsx in project files)
- Memoir material bank (memoir_material_bank_storyteller_pro_mining.md)
- Publishing strategy doc (see above — parallel track)

What's needed:
- First excavation of The Rupture (TBI specifics, on Kyle's terms)
- Chronological tool/system mapping (archaeology of the construction project)
- Life coach figure (critical gap)
- Meditation practice full evolution
- First chapter draft before committing to structure

---

## THREE-LAYER BRAND ARCHITECTURE

1. **kylerosebrook.com** — personal brand / distribution hub. Monday launch. Origins story, path, voice.
2. **FlashFusion.co** — B2B AI enablement (audits, consulting, skills frameworks)
3. **ChaosClubCo** — mental health / peer support platform (completely separate)

---

## KINSLEY — Current State

- `kidcreator` (StoryWeaver) — ChaosClubCo GitHub, last commit Nov 2025
- `Kinsley's World` — Google AI Studio, voice-powered sandbox, March 9 2026
- `infinite-heros-bedtime-chronicles` + v5 — Vercel, deployed
- Keep completely separate from all business tracks

---

## SONGWRITING — Current State

Songs: "Hold On, Dad," "Gold in the Static," "Still Standing," "Echo Chamber Karaoke," "Little Blue Halos," "Dopamine Doesn't Disappear," "Friday Goodbye," "Meditation Was the Thing"
Tool: Suno AI Custom Mode
Status: Multiple complete. Not yet finalized/released.

---

## ASSET INVENTORY SUMMARY

### Base44 Apps (37 total)
Key: Fusion AI, FlashFusion, Chaos Club, Continuum, Sole Customizer, SoleIgnite, AI Adoption Strategist, AI Ops Concierge, Proactive Mentor OS, INTelligence.ai, Ascend.Ai, Sedona Soul Sessions

### Vercel Projects (~18 FlashFusion team)
Key: continuum, agentk, command-center, int-sysdesigngen, int-dash-engine, omni-gen, invelo, odyssey-learns, harmoniq, vibe-coding-workshop, v0-skydda-ai-sentinel, infinite-heros-bedtime-chronicles

### Supabase (7 projects)
flashfusion (clean), FlashFusionWebsite, intinc, ascend-ai, tessa-desktop, tiktokstory, AI Platform Explorer Figma PreBeta

### n8n Workflows (19 total)
Active: Portfolio Command Center — Live Sync, PassiveIncome-Scrapper
Need config: 7x OAI workflows
Inactive drafts: Cross-Platform AI Productivity Orchestration, Agent Message Hub, AI Agent Health Monitoring, Work+Personal Event Gateway, Onboarding, Import Path Fixer

### Domains
- flashfusion.co — Cloudflare DNS, needs to point to Vercel
- kylerosebrook.com — clean slate, robots.txt blocking crawl, Monday launch target

---

## TOOLS & INFRASTRUCTURE

Development: React, TypeScript, Firebase, Next.js, Supabase, Stripe, n8n, Google Gemini Pro, Zustand
AI: Claude (primary), ChatGPT (secondary), Suno AI (music), Lovable.dev, Base44, Replit
MCP: 13 configurations, 60+ connected tools

---

## BUDGET

~$1K available. Publishing track Phase 1-2 conservative estimate: $400-700. Memoir legal review: $500-3K at Month 8-9.

---

## THE ONE RULE

Build in silence until it's real. Personal time, personal tools, personal domains, personal relationships only.

---

## SESSION LOG

| Date | Track | Output |
|---|---|---|
| March 26 | All tracks | Full audit, pipeline update, Chaos Club build started, Publishing Strategy loaded, OAI workflow config gap identified, Sole Customizer confirmed as Sole Revival product |
| March 25 | FlashFusion | Strategy session, 3 key decisions, NotebookLM session, Continuum `/api/discover` built |
| March 23 | Chaos Club | Digital product listings + keyword pack delivered to Drive |
| March 13 | Chaos Club Book 1 | Manuscript complete, build_manuscript.js written |
