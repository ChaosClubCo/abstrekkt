# PROJECT STATE — Current as of April 14, 2026

This file is the authoritative snapshot of where things stand. Update it at the end of major sessions.

---

## BRAND ARCHITECTURE (Locked)

Three-lane — do not conflate:

| Lane | Domain | Purpose |
|---|---|---|
| Personal brand | kylerosebrook.com | Story, distribution hub, origin narrative |
| B2B AI enablement | FlashFusion.co | Audits, consulting, skills library, enterprise AI |
| Mental health platform | ChaosClubCo | Peer support, Chaos Club app |

**Intinc boundary (permanent):** Kyle does NOT have employer blessing for public representation. Never reference Intinc by name in external content. Kyle's public identity = self-taught engineer, founder (FlashFusion, Chaos Club Co.), personal brand (kylerosebrook.com).

**Domain status:** Both kylerosebrook.com and flashfusion.co are unindexed — robots.txt blocking Google crawl. Both live, both clean slates for relaunch.

---

## PERSONAL BRAND — Current State

**Status: NOT YET LIVE. Launch pushed back from Apr 13.**

- kylerosebrook.com: WordPress (site ID: 253504189), Gutenberg-based
- Site is technically live and crawlable — Coming Soon is off
- **Blockers:**
  - WooCommerce ghost cart bleeding onto homepage (not cleaned)
  - robots.txt still blocking Google indexing — site not yet indexed
- Personal brand launch deferred until blockers resolved

**Launch dependencies:**
- Fix WooCommerce ghost cart
- Remove robots.txt block
- Get site indexed
- Playbook URL must exist before Lee Chong Ming pitch can be sent

---

## FLASHFUSION / SKILLS LIBRARY — Current State

**Status: Active B2B AI enablement lane. Primary active build.**

### Skills Library (highest priority)
- **50 Phase 1+2 production-ready skills built**
- Pipeline tooling scripts complete
- Chris Butler 5-skill suite complete
- Teams-embedded migration agent in progress
- Architecture analysis document complete

**4 compliance gaps gating Intinc deploy (fix before expand):**
1. Description fields missing "Use when..." trigger phrases
2. Version fields not nested under metadata
3. Triggers/hooks present on claude.ai-targeted skills
4. allowed-tools not implementing least privilege

**Deploy targets:** Daniel, Dave, Gwen, Jackie (Intinc team) — 30-day definition of done

**8 locked architectural decisions:**
- 2025 Anthropic spec as governing standard
- Gerund-first kebab-case naming
- claude.ai / Claude Code platform split
- Description-as-primary-discovery-mechanism
- 500-line skill file limits
- Least-privilege allowed-tools
- Six-category 300-skill library architecture
- Fix-before-expand sequencing

### FlashFusion Platform
- flashfusion.co → Base44 "Fusion AI" (id: 68dd8e79ca073475565c8e16)
- 67-entity enterprise AI platform schema — production-grade, not prototype
- Covers: CI/CD, multi-agent orchestration, prompt versioning, analytics, compliance, plugin marketplace

### Demo Day
- **April 18, 2026** — FlashFusion Demo Day
- 5 gates open as of Apr 10: demo env, 3+ discovery calls, one-pager, Anthropic partner narrative, E1-E4 modules
- Sprint v1.9.9 closed Apr 13
- **Outcome: unknown — confirm next session**

### Key collaborators
- Chris Butler: Business Development Specialist, 5-skill suite complete
- Ryan Anderskow: first free audit target (confirmed revenue path)
- Jackie Miles: senior stakeholder, fortnightly updates
- Kelan: potential co-founder candidate (former colleague, strong ops/sales) — show full inventory, formalize conversation

---

## CONTINUUM — Current State

**Status: BLOCKED — Supabase bill overdue.**

- Stack: Next.js 16, Supabase, Tailwind 4
- **Do not recommend Supabase-dependent features until bill resolved (~2 weeks)**
- Vercel GitHub App connection broken — manual reconnect needed: vercel.com/flash-fusion/continuum/settings/git
- Last good prod deploy: dpl_6G5v9RpMSend3Ckh4eZJfCf4ZTL9 (PR #112, Mar 23)
- Project ID: prj_suXzxaQd6dxVDeEiR0LgFZOTB6IG
- Vercel team ID: team_hPVeJgH0h1nCrogiaMvD6fxu

---

## MEMOIR — Current State

**Phase:** Active excavation. Multiple sessions complete. No full chapters drafted yet.

**Frame (locked):**
- Genre: Literary nonfiction. Not self-help. Not recovery memoir.
- Thesis: Construction not recovery — how does a person rebuild agency not through recovery of what was lost, but construction of what never existed?
- Reader: Kinsley — the memoir is ultimately a letter to her
- Spine: Diagnostic instinct — reading rooms (O'Toole's), reading processes (QC), reading systems (engineering). This survived cognitive disruption and became the foundation for reconstruction.

**5 narrative threads:**
1. Before the Break (O'Toole's competence)
2. Rupture (TBI/addiction — old strategies fail)
3. Construction (240+ tools as externalized cognition)
4. Late-Life Emergence (Staff Engineer arrival)
5. Parallel Constructions (Kinsley / Chaos Club / memoir itself)

**Voice (locked):**
- Direct without coldness. Metaphor-heavy. Technical precision when it serves clarity. Strategic profanity. Self-aware irony.
- NO: "And that's when I realized...", performative vulnerability, generic recovery language
- YES: Declarative observations, technical emotion descriptions, uncertainty admissions, humor that doesn't defuse

**What exists:**
- Voice DNA v2 artifact — interactive writing voice guide (6 tabs, browser-persistent, exportable)
- O'Toole's excavation: COMPLETE (Mar 25)
- All 5 scene seeds CONFIRMED as real memory:
  - Age oscillation
  - Relief line
  - Late-night walk
  - Couch permission scene
  - Monitor reflection
- Working thesis locked
- Narrative architecture defined
- Comparable works identified (Noonday Demon, In the Realm of Hungry Ghosts, Brain on Fire)

**What's needed next:**
- Session 3: Tool Archaeology — chronological mapping of 240+ tools (NOT YET DONE)
- First rupture notes — even rough
- Decision on structural approach (needs one chapter drafted before committing)

**Lee Chong Ming (Business Insider) pitch:**
- He/him. Covers AI, vibe coding, non-traditional builders (Singapore bureau)
- Pitch angle: Moltbook API key failure mode / competence story not productivity story
- Status: **UNRESOLVED CONFLICT** — one memory says killed, Kyle answered "still drafting" Apr 11
- **Do not act until Kyle confirms killed vs. drafting**
- Dependencies before sending: kylerosebrook.com must be live + playbook URL must exist

**Timeline (locked):**
- Michaels: 2018–2020
- Injury: ~2020–2021
- O'Toole's: Oct 2021–Mar 2025
- QC: Mar–Aug 2025
- Intinc: 2025+
- TBI eval: July 2022 (SPECT + neuropsych — confirmed in Gmail)

**Excavation gaps (sessions needed):**
- TBI date/cause/symptoms/treatment specifics
- Addiction specifics/timeline/substances
- Homelessness duration/location/exit
- Meditation practice details/breakthrough moments
- Therapy modalities/therapists/what worked
- "The gap" between graphic suicidal content period and systematic tool orchestration

**Protected/sensitive areas:**
- TBI specifics — Kyle discloses on his terms
- Addiction specifics — Kyle discloses on his terms
- Family (beyond Kinsley) — approach carefully

---

## CHAOS CLUB CO. APP — Current State

**Phase:** MVP concept complete. Firebase Studio implementation documented. Legal framework drafted.

**What exists in project knowledge:**
- Definitive_blueprint — full technical architecture + feature spec
- top_10_crit_steps — prioritized development sequence
- Corefeatures — Phase 1-4 feature list, brand voice implementation, tech architecture
- Firebase_studio_app_dev_prompt — full-stack React app spec
- Legal_proteection_kit — legal framework
- crisis_safety_sprint_structure — crisis feature sprint plan
- The_Arsenal_kit — Arsenal library full spec

**React prototype:** Single-file React component. Features: Onboarding, Dashboard, Daily Drill, Panic Button, Chaos Tracker, PuppyChow gamification, Community Circles, Raccoon Den store, Field Manual, Merch Store, Settings.

**15 Brand Pillars:** Locked — see project instructions.

**Pending decisions:**
- PWA micro-app vs. B2B/EAP enterprise direction
- Firebase Studio MVP — not yet started (has full spec)
- Brand voice AI training for Rebel — not yet started

**Next logical steps:**
1. Legal foundation + risk mitigation (before any dev)
2. Crisis intervention system design
3. Firebase Studio MVP
4. Brand voice AI training + validation
5. User research framework (50 beta testers)

**Funding path:**
- Techstars Chicago + NSF SBIR Phase I (M3–M6 target)
- YC deferred to M9+ pending Intinc resolution and revenue establishment

---

## CHAOS CLUB BOOK 1 — Current State

**Title:** "Breathe Through the Bullsh*t: Your No-Nonsense Starter Kit for Mental Chaos"

**Status: MANUSCRIPT COMPLETE. Final .docx build pending execution.**

**All 12 chapters + front/back matter written.** Known issue: Chapters 1–6 appear twice in source docx — second copy is a duplicate, exclude from final output.

**Build script:** `/home/claude/build_manuscript.js` — written, not yet executed.

**Remaining steps:**
1. Run `node build_manuscript.js`
2. Validate output
3. Deliver final .docx

**Book 2 identified:** "The Chaos Journal" — structured prompts for excavating what's underneath.

---

## KINSLEY APP — Current State

**Status: EXISTS in AI Studio. Not yet full app build.**

- "Kinsley's World" — voice-powered creative sandbox (Google AI Studio, last updated Mar 9 2026)
- GitHub: ChaosClubCo/kidcreator (StoryWeaver with auto-generated character portraits, last commit Nov 2025)
- Target: ages 8–10
- **Keep strictly separate from business projects — personal gift project**
- Next: full spec when bandwidth allows

---

## SONGWRITING — Current State

**Status: 8 songs completed via Suno AI. Distribution path undecided.**

- "Hold On, Dad" · "Gold in the Static" · "Still Standing" · "Echo Chamber Karaoke"
- "Little Blue Halos" · "Dopamine Doesn't Disappear" · "Friday Goodbye" · "Meditation Was the Thing"
- Format: [Verse]/[Chorus]/[Bridge] + detailed style descriptions

---

## N8N WORKFLOWS — Current State

**Instance:** krosebrook.app.n8n.cloud — 10 workflows total

**Key active:**
- PassiveIncome-Scrapper (active, MCP-enabled)
- Cross-Platform AI Productivity Orchestration
- Agent Message Hub
- AI Agent Health Monitoring
- Work+Personal Event Gateway with Notion
- Onboarding Workflow
- Portfolio Command Center (id: JPSVa3cLtQPi8NKF)

**Pending wiring:**
- Gmail credential → Portfolio Command Center daily digest
- Base44 API base URL + auth token → 7 OAI workflows (HTTP Request nodes)

**Auth failures needing reconnect:** n8n, Notion, Craft

---

## ASSET INVENTORY — Current State

**Base44:** 43 apps. Key: Fusion AI (flagship, id: 68dd8e79ca073475565c8e16), Chaos Club, Sole Revival, Sedona Soul Sessions.

**Vercel (team: team_hPVeJgH0h1nCrogiaMvD6fxu, ~25 projects):**
Key active: agentk, invelo/Living Coloring World, command-center, omni-gen, harmoniq, odyssey-learns, int-dash-engine, Continuum (BLOCKED — Supabase)

**GitHub:**
- Krosebrook: 630+ repos, consolidating to ~130 via MONOTURBO monorepo
- ChaosClubCo: 50+ repos
- FlashFusionv1

**Hidden gems (built, need distribution):**
- ChaosClubCo/claude-code-plugins-plus: 244-plugin marketplace catalog for Claude Code (Oct 2025)
- FissionPrompt: video generation tool (Nov 2025)
- SynthelNC: AI content gen, 21 templates, 22 block types
- upe-priority-engine: WSJF/ROI/Severity scoring tool

**Replit:** 3 workspaces — kylerosebrook personal, FlashFusion team, INT team

**Lovable.dev published:** Enterprise Profile Studio, Contour, MCP Hub, FlashFusion Marketing Hub, cortex-second-brain

**Google AI Studio:** 35+ apps. Key: Kinsley's World, Intlinc Architect 2of2, The Transplantable Skeleton, NotebookLM Prompt Library (200+ RISE prompts)

**Figma (team 152971):** FlashFusionWebsite (starred, dark theme), FlashFusion Tools Website (template), Figma UI for Ample (ChaosClubCo/Ample), Enterprise Profile Builder, shadcn/ui + MCP Apps UI kits imported

**Wix:** Connector enabled — verify manually in Cowork

---

## INTINC / PROFESSIONAL — Current State

**Role:** Staff Engineer, AppSec + Platform Engineering
**Context:** 50–200 engineer org. Self-taught (no CS degree).
**Keep separate from:** all external content, Chaos Club Co., Kinsley apps, memoir

---

## TOOLS & INFRASTRUCTURE

**Development:** React Native + TypeScript, Firebase, Next.js, Supabase, Stripe, n8n, Google Gemini Pro, Zustand, Base44, Lovable.dev, Replit, Cloudflare, Resend, Zapier, Make, PostHog, 1Password

**AI/Automation:** 80+ connected MCP servers, 240+ tools catalogued (≠ actively used), n8n/Zapier/Make workflows, Gemini API, Suno AI

**MCP note:** "240+" refers to total tools catalogued across ecosystem — not tools mastered. Do not use "actively uses 240+" in public-facing copy.

**Artifacts:**
- Voice DNA v2 (voice-dna.jsx) — browser-persistent, exportable
- Origin_Story_Book.tsx — React component

---

## FUNDING PATH

| Target | Timing | Notes |
|---|---|---|
| Anthropic Partner Network + AI Grant | M1–M2 | Primary near-term |
| Techstars Chicago | M3–M6 | Chaos Club Co. |
| NSF SBIR Phase I | M3–M6 | Chaos Club Co. |
| YC | M9+ | Deferred — pending Intinc resolution + revenue |

---

## OPEN BLOCKERS (Prioritized)

1. **Skills Library compliance gaps** — 4 gaps must be fixed before Intinc deploy (30-day DOD)
2. **Continuum: Supabase bill** — overdue, ~2 weeks to resolve
3. **Continuum: Vercel GitHub App** — broken, manual reconnect needed
4. **kylerosebrook.com: WooCommerce ghost cart** — blocking homepage
5. **kylerosebrook.com: robots.txt** — blocking Google indexing
6. **n8n: Gmail credential** — wire for daily digest
7. **n8n: Base44 API tokens** — 7 OAI workflows need wiring
8. **Reconnect: n8n, Notion, Craft** — auth failures

---

## OPEN DECISIONS

1. Lee Chong Ming pitch: killed vs. still drafting — **clarify before any action**
2. FlashFusion Demo Day (Apr 18) — confirm outcome next session
3. Kelan: co-founder conversation — show full inventory, formalize
4. Ryan Anderskow: first free audit — outreach timing
5. Chaos Club App: PWA micro-app vs. B2B/EAP direction
6. Memoir: which chapter gets written first — Before the Break or The Rupture?
7. Memoir Session 3: Tool Archaeology — schedule
8. claude-code-plugins-plus: distribution strategy for 244-plugin catalog
9. Songs: distribution path for 8 completed tracks
10. Kinsley app: when does full spec happen?

---

## BUDGET CONTEXT

~$1K available for immediate investments across all projects. Time is the binding constraint — full-time Staff Engineer + Friday custody of Kinsley.

---

## SESSION HISTORY (Recent)

**Session: Apr 14, 2026**
- Topic: Conversation archaeology + PROJECT_STATE audit
- Found: Vibecoding playbook (Nov 13 2025): https://claude.ai/chat/8b43a34b-5cc4-419b-bb20-92a22610f52d
- Found: VibeCode UI + Neural Genesis artifacts (Sept 20 2025): https://claude.ai/chat/6f79df7a-12af-4603-b828-69882659fc53
- Audit: identified ~15 gaps/errors in PROJECT_STATE.md vs. Apr 2026 reality
- Output: Full replacement PROJECT_STATE.md (this file)

**Session: Mar 13, 2026**
- Topic: Chaos Club Book 1 final manuscript completion
- Completed: Conclusion Part 2, Acknowledgments, Resources sections
- Created: build_manuscript.js (full docx builder, all content embedded)
- Pending: Running build script + delivering final .docx
- Transcript: /mnt/transcripts/2026-03-13-17-31-39-chaos-club-book1-manuscript.txt

**Session: Mar 12, 2026**
- Topic: Chaos Club Book 1 manuscript analysis + docx skill review
- Output: Full content audit, missing sections identified
- Transcript: /mnt/transcripts/2026-03-12-08-41-24-chaos-club-book1-project.txt
