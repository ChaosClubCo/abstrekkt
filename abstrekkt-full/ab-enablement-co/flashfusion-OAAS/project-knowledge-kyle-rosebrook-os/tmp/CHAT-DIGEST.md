# Chat Digest — kyle-rosebrook-os
**Extracted:** 2026-06-07  
**Coverage:** 40 most recent chats (Jun 7 back through ~May 15, 2026)  
**Labeling:** [VERIFIED] = explicitly stated in chat | [INFERRED] = drawn from context

---

## DECISIONS MADE

### Brand / Identity
- [VERIFIED] **abstrekkt.com purchased Jun 6 2026** — new parent org replacing ChaosClubCo AND ChaosCollective. FlashFusion sits under it as primary revenue consultancy. (chat: naming-principles-for-companies-that-last)
- [VERIFIED] **ABSTREKKT replaces ChaosClubCo fully.** Memory updated 3× in that session to correct Claude's misread of "kylerosebrook.com + Wix = GONE" — domain is rebuilt elsewhere, Wix build is gone. (chat: naming-principles)
- [VERIFIED] **ChaosClubCo peer-support framing DEAD — May 2026 pivot.** Content/media + software parent org framing only. (multiple chats)
- [VERIFIED] **"Chaos Collective" vs. ChaosClubCo architecture unresolved.** Two theories: rebrand vs. separate publishing surface. Decision pending. (chat: finding-a-domain-name-for-chaoscollective)
- [VERIFIED] **kylerosebrook.com is NOT gone.** It is rebuilt (not on Wix). Claude was corrected multiple times. (chat: naming-principles)
- [VERIFIED] **Load-Bearing newsletter approved differentiator.** Tagline: "AI tools, tested under load." 8-essay gate before launch; as of Jun 2026, gate essays complete. Platform decision still open. (chats: converting-pictures-into-blog-posts, enriching-and-rebuilding)
- [INFERRED] **Reading Room at Midnight is a content aesthetic**, not a product. Fraunces + Crimson Pro + brass on dark. Applied to memoir and personal editorial work only.
- [VERIFIED] **Signal theme locked for client-facing FlashFusion artifacts** — rose/cyan/ember, Poppins + Inter. (chat: stitch-prompt-gen)
- [INFERRED] **Three-lane visual identity confirmed:** FlashFusion (`#09090f` bg, `#7c3aed` purple), ABSTREKKT/ChaosClubCo (`#e11d48` rose), Reading Room (`#0d0d0f` bg, `#c9a96e` brass).

### FlashFusion Business
- [VERIFIED] **$4,500 hard floor confirmed.** Ryan Anderskow $3,000 = isolated case-study trade, documented exception only. (multiple chats)
- [VERIFIED] **Ryan Anderskow outreach gated on FreeAssessment anonymous submission test.** Incognito test still needed as of Jun 5 2026. (chat: EmailtoHo)
- [VERIFIED] **Lee Chong Ming pitch gated.** Gate = kylerosebrook.com live + published playbook URL. Pitch alive, NOT sent, NOT killed. He/him always. (multiple chats; correction: prior sessions used wrong pronouns — NEVER recur)
- [VERIFIED] **audit.flashfusion.co live** — CNAME `audit` → `base44.onrender.com`, proxy OFF in Cloudflare. Three products seeded: $0 / $1,500 / $4,500. (chat: EmailtoHo, Jun 5)
- [VERIFIED] **client.flashfusion.co CNAME still needed.** Not yet connected. (project state)
- [VERIFIED] **IC model confirmed: Kyle sells + delivers solo.** Lafu = technical co-founder. Kelan = deferred until revenue milestone or YC. (multiple chats)
- [VERIFIED] **Chris Butler case study was ILLUSTRATIVE — not a real engagement.** Kyle corrected this. All references purged. (chat: finding-unexpected-connections, Jun 2)
- [VERIFIED] **Three illustrative Apr 9 case studies in audit app need decision: replace with real or label as examples.** Unresolved. (project description)
- [VERIFIED] **SparkAcademy GTM locked as Option C: 3-lane** — consumer freemium (career transitioners), B2B institutional (education, K-12 faculty not students), consulting-led B2B (workplace). (chat: learning-about-ai-for-personal-growth)
- [INFERRED] **FlashFusion Year 1 target: $222K.** Mentioned in revenue ladder: $4.5K audits → $5K sprints → $2K/mo retainers → vCAIO yr2+.

### Memoir
- [VERIFIED] **Book 1 "Breathe Through the Bullsh*t" nuked.** Do not reference. (multiple chats)
- [VERIFIED] **Working title confirmed: "Construction, Not Recovery."** (Prior session had "Tax the Damage" — superseded.)
- [VERIFIED] **HOVAV corridor dates: Card Table = 2015, Sedona = 2016** — BOTH predate TBI event (~2020–21). Flagged as unresolved structural conflict. If dates are factual, construction method predates injury → thesis sharpens. Requires Kyle confirmation before Thread 3 restructures. (chat: identifying-writing-weaknesses, Jun 7)
- [VERIFIED] **Songs correction Jun 7:** Please Dad I Need You, Please Daddy I Need You, Dear Dad, I Learned This From You, Hold On Dad — written in Kinsley's voice, addressed to Kyle. NOT about his father. "I Learned This From You" has a narrative flip (surface: inherited harm; actual: Kyle was the one who experienced harm from others). Kyle confirmed he is the first person in family lineage not to hurt his child. This is the construction thesis as biographical fact. (chat: identifying-writing-weaknesses)
- [VERIFIED] **Schopp (Kyle's best friend from 2010 shelter) is missing from memoir people inventory.** The Five is actually The Six. Not excavated. (chat: identifying-writing-weaknesses)
- [VERIFIED] **Manifesto built Jun 6 = Act 1 of stalled origin video** — same arc, same closing line ("building in the dark… turning on the lights"). Never connected across sessions until Jun 7. (chat: identifying-writing-weaknesses)
- [VERIFIED] **HOVAV corridor contains dated scene material 2009–2016** that memoir's blind-spots doc treats as unexcavated. Correction: it IS excavated in HOVAV, just not cross-referenced. (chat: identifying-writing-weaknesses)
- [INFERRED] **O'Toole's excavation done. Card table locked.** Tool Archaeology (Session 3) NOT done = highest-leverage next action. Unblocks 3 chapters.
- [VERIFIED] **Sudowrite manuscript exists.** Session excavation continues in parallel.
- [VERIFIED] **Cognitive profile:** Processing Speed 99th, Recall 12th, Resilience 2nd percentile. Thesis in data: engine full speed, storage empty → tools as prosthetic memory.

### Infrastructure
- [VERIFIED] **Continuum blocked:** Supabase bill overdue + Vercel GitHub App broken. Last good deploy: `dpl_6G5v9RpMSend3Ckh4eZJfCf4ZTL9` from PR #112 (Mar 23). Do not recommend Supabase-dependent features until resolved. (multiple chats)
- [VERIFIED] **MCP session initialization confirmed:** Enabling MCPs does NOT inject tools into already-active sessions. New session required. Verify tool surface at start. (chats: google-drive-mcp-not-loading, kyle-rosebrook-flashfusion-avatar-script)
- [VERIFIED] **INT lane status changed materially (week of Jun 7):** Workplace political incident involving senior leadership. Written no-conflict confirmation expected Monday. Prior "firm okayed" was verbal only, not settled. (chat: identifying-writing-weaknesses)
- [VERIFIED] **4 skills compliance gaps gating INT deployment:** missing "Use when" triggers, version not nested under metadata, hooks/triggers keys, allowed-tools not least-privilege. Fix-before-expand rule active. (multiple chats)
- [VERIFIED] **n8n workflows:** WIR-02 and WIR-04 reference stale Base44 subdomain (`orchestrator-ai-6ea9ba23.base44.app`). Both `active: false`, `triggerCount: 0`. (chats: continue-this, identifying-knowledge-gaps)
- [VERIFIED] **Drive sprawl detected Jun 5:** Dozens of folders created within same second, duplicate folder 3 hours apart. Likely n8n workflow or Zapier running 14:00–18:00 on Jun 5. Source unconfirmed. (chat: identifying-writing-weaknesses)
- [VERIFIED] **Claude Code CLI confirmed on Windows, D drive.** Safety gates documented: deny rules in settings.json, PreToolUse bash hooks, maxToolUseRounds/maxCompletionTokens caps. CLAUDE.md is guidance only, not enforcement. (chat: claude-code-cli-d-drive)

### Project knowledge
- [VERIFIED] **Project consolidation recommended:** Consolidate to 3 projects max matching 3 lanes. MEMORY.md as shared knowledge layer. Google Drive via MCP as cross-project document layer. (chat: grant-proposals, Jun 7)
- [VERIFIED] **12-file context system built (CLAUDE.md / AGENTS.md / MEMORY.md pattern).** v2 trimmed version generated. (chat: grant-proposals)

---

## ASSETS BUILT AND WHERE THEY LIVE

### Base44 Apps
- AI Setup Audit Scorecard: `69c440b10249984f1114bc4b` — live at `audit.flashfusion.co`
- SparkAcademy: `69180d077a5cbed7242f90ab` — 32 courses, 125 lessons, 5 LearningPaths (workplace + education + career transition); 12 Integration records seeded; schemas extended
- Fusion AI: `68dd8e79ca073475565c8e16` — 101 entities, 0 real data, closed beta
- Consulting ops: `6a02ac1bad2b4e37732ef382`
- HOVAV admin panel: `hovav-admin-panel.html` in project

### Artifacts (in /mnt/project/)
- `the-flashfusion-arc.jsx`, `the-chaosclubco-arc.jsx`, `the-memoir-arc.jsx`, `the-reading-room-arc.jsx` — lane arc artifacts with 12-month gates + 48-week sprints
- `lane-allocator.jsx`, `lane-blockers.jsx` (WSJF-scored cross-lane blockers, 10 known blockers pre-populated)
- `dispatch-v2.jsx`, `dispatch-v3.jsx` — "Kyle's Dispatch" content build tool (LinkedIn + X generation), WCAG 2.2 AA compliant
- `kanban-v2.jsx` — Kanban board, 26 cards, 6 lanes, 7 team members (May 2026 data)
- `claude-ecosystem-map-v2.jsx` — visual map of full Anthropic/Claude ecosystem
- `context-capsule-skills-library.jsx` — 50-skill Cowork library browser
- `newsletter_series.jsx` — Load-Bearing newsletter series tool
- `ff-enterprise-ai-hub.jsx` — enterprise client portal
- `memoir-command-center.jsx`, `memoir-explorer.jsx`, `memoir-hub-v3.jsx` — memoir project management artifacts
- `construction-manifesto.html` — "Construction, Not Recovery" manifesto (confirmed = Act 1 of origin video)
- `ff-blog-interactive.html`, `content-strategy.html`, `content-templates.html`, `editorial-framework.html` — FlashFusion content ops
- `pitch_console.html` — journalist outreach pitch console (10 pitches, status tracking)
- `knowledge-os.html` — 128KB comprehensive knowledge management system
- `Origin_Story_Book.tsx` — interactive origin story component
- `funding_dashboard.html` — grant/funding tracker
- `routine-cards.html` — daily routine system
- `kyle_docs_readable.txt` — 106KB compiled text export of all project docs

### Google Drive Docs (verified IDs)
- Origin story scripts: `1wiNrKMpxVQxZqTy_cHxu2vQiLUR494lOHO1wYudmlgo`
- "Beyond the Hype" article: `1j--MYDH6VWStmZPpTZIDCpMUCJSgNxjBVwJtrixHgHE`
- INT KB Automation Business Case v1.2: `1FeUHTvSQfKKVJuqYpUeSW8ul2oNX4x8IeAqDZM8eoD4`
- FF Case Study (Zero Admin KB): created in Drive, name = FF-CaseStudy-ZeroAdminKB-IntincMSP
- "Construction over Recovery" essay: created in Drive

### Skills Library (n=50 in /mnt/skills/user/)
- `drafting-multi-format-content` — 48 templates (8 video/audio, 20 threaded social, 20 FF customer lifecycle) + voice guardrails
- 12-skill rebuilt set (flashfusion + int-platform tracks, 68 files total) — skills-v2.zip was produced
- 4 compliance gaps still outstanding (see Decisions)

### n8n Workflows
- Portfolio Command Center: `JPSVa3cLtQPi8NKF`
- WIR-02, WIR-04: both inactive, stale Base44 URL in nodes (blocked)
- 3 Fusionomics workflows appear in recent list (source unclear)

### Figma (team/152971)
- FlashFusionWebsite (published, starred)
- Figma UI for Ample (connects to ChaosClubCo/Ample repo)
- shadcn/ui + MCP kits imported
- Stitch Prompt Generator asset created in Figma during stitch-prompt-gen session

### Vercel (team: `team_hPVeJgH0h1nCrogiaMvD6fxu`)
- ~25 projects including: agentk, invelo, command-center, omni-gen, int-dash-engine, odyssey-learns, harmoniq
- Continuum: last good deploy `dpl_6G5v9RpMSend3Ckh4eZJfCf4ZTL9` (PR #112 Mar 23); blocked

---

## PRICING / NUMBERS / COMMITMENTS

- [VERIFIED] AI Setup Audit: $4,500 — hard floor
- [VERIFIED] Enablement Sprint: $5,000
- [VERIFIED] Retainer: $2,000/month
- [VERIFIED] Free scorecard: $0 (seeded in audit app)
- [VERIFIED] Ryan Anderskow case-study exception: $3,000 (documented, not a precedent)
- [VERIFIED] FlashFusion Year 1 target: $222K [INFERRED from revenue ladder]
- [VERIFIED] claude-code-plugins-plus: 244-plugin catalog — built, distribution decision pending
- [INFERRED] Kyle's GitHub: ~628 repos personal (Krosebrook), 50+ ChaosClubCo org
- [VERIFIED] Moltbook stat (used in Lee Chong Ming pitch): Wiz Security Jan 31 2026 — 1.5M API auth tokens + 35K email addresses exposed (Supabase RLS disabled). Sources: Wiz Security, 404 Media, Infosecurity Magazine.

---

## OPEN LOOPS / UNFINISHED WORK

1. **INT no-conflict written confirmation** — expected Monday after Jun 7 political incident. Verbal only so far. [VERIFIED]
2. **HOVAV date conflict** — Card Table 2015, Sedona 2016 both predate TBI. Kyle must confirm before Thread 3 restructures memoir. [VERIFIED]
3. **Tom Ropel excavation** — not done. Chapter by itself. [VERIFIED]
4. **Dave Datt excavation** — not done (died of brain aneurysm). [VERIFIED]
5. **Schopp excavation** — not in memoir inventory at all. Identified Jun 7 as missing sixth person. [VERIFIED]
6. **Tool Archaeology Session 3** — highest-leverage next action. Unblocks 3 chapters. NOT done. [VERIFIED]
7. **Follow-up SPECT scan, Aug 2 2022 results review scene, internal date conflict resolution** (p2 "summer 2020" vs p3 "Oct 2021" for hypoxia event) — all open. [VERIFIED]
8. **Ryan Anderskow incognito anonymous submission test** — needed before outreach sends. [VERIFIED]
9. **Lee Chong Ming pitch** — gated on site live + playbook URL. Draft exists. [VERIFIED]
10. **client.flashfusion.co CNAME** — not yet set up. [VERIFIED]
11. **spark.flashfusion.co CNAME** — not set up. [VERIFIED]
12. **Kelan co-founder conversation** — prerequisite checklist exists; not yet initiated. [VERIFIED]
13. **Lafu technical co-founder formalization** — informal only. [VERIFIED]
14. **4 skills compliance gaps** — must fix before INT deployment. [VERIFIED]
15. **n8n WIR-02 + WIR-04 unblock** — need correct Base44 app ID confirmed + Bearer credentials. [VERIFIED]
16. **Supabase overdue bill** — blocks Continuum, Stripe, downstream monetization. [VERIFIED]
17. **Vercel GitHub App reconnect** — manual reconnect needed at vercel.com/flash-fusion/continuum/settings/git. [VERIFIED]
18. **claude-code-plugins-plus (244 plugins) distribution decision** — built and ready; options: marketplace, blog launch, direct outreach, Anthropic partnership. [VERIFIED]
19. **Chaos Collective vs ChaosClubCo architecture decision** — rebrand or separate surface. [VERIFIED]
20. **Load-Bearing platform decision** — standalone editorial / FF feeder / paid tier / amplification only. [VERIFIED]
21. **Three illustrative Apr 9 case studies** — replace with real or label explicitly. [VERIFIED]
22. **Drive sprawl source** — Jun 5 automated folder creation event, source (n8n or Zapier) unconfirmed. [VERIFIED]
23. **Claude Certified Architect exam** — targeting July 20 2026. [VERIFIED]
24. **Anthropic Ambassador + Partner Network applications** — drafted, ready to send. [VERIFIED]
25. **INTeract rename** — INT branding in name = risk. Rename before any future development. [INFERRED from project state]
26. **Michael journal** — attorney review required before any publication. [VERIFIED from project instructions]

---

## CONTRADICTIONS / CORRECTIONS

- **Songs voice corrected Jun 7:** Several song files (Please Dad, Dear Dad, etc.) were previously being treated as Kyle writing about his relationship to his own father. Correction: these are written in Kinsley's voice, addressed to Kyle as her father. [VERIFIED]
- **"I Learned This From You" corrected Jun 7:** Surface reads as inherited harm from Kyle. Actual narrative: Kyle is the one who experienced harm from others. Never harmed his daughter. [VERIFIED]
- **kylerosebrook.com NOT gone:** Claude misread "Wix = GONE" as the domain being dead. Domain is rebuilt elsewhere. Memory corrected 3× in naming session. [VERIFIED]
- **Parent org architecture corrected Jun 6:** ABSTREKKT replaces both ChaosClubCo AND ChaosCollective — it is one parent, not a peer to FlashFusion. FlashFusion sits under ABSTREKKT. [VERIFIED]
- **Chris Butler case study was illustrative — NOT real:** Corrected in finding-unexpected-connections chat (Jun 2). All project files purged. Kyle handled source-of-truth cleanup directly. [VERIFIED]
- **memoir working title:** "Tax the Damage" appeared in May 2026 sessions. Jun 2026 state = "Construction, Not Recovery." [INFERRED — "Tax the Damage" may have been a subtitle candidate]
- **INT verbal vs. written:** Prior state said "firm okayed FlashFusion as non-issue." Jun 7 correction: okayed verbally only; written confirmation still pending after political incident. [VERIFIED]
- **~30 tools rule:** "240+" figure refers to MCP configs catalogued, NOT tools actively used. Public-facing cap is "~30 tools used well." Never use 240+ as active-use claim. [VERIFIED, consistent across all sessions]
- **Title ceiling:** Kyle = L1 Service Desk Tech. "Staff Engineer" appeared in May 2026 chats (artifact legacy data) and was corrected. [VERIFIED]
- **Lee Chong Ming pronouns:** Prior sessions used wrong pronouns. Always he/him. [VERIFIED]
- **HOVAV dates vs. memoir thesis:** Dates in HOVAV (Card Table 2015, Sedona 2016) predate TBI. Memoir's Thread 3 assumed TBI came first. This is unresolved — may sharpen thesis, not break it. [VERIFIED, flagged as requiring Kyle confirmation]
