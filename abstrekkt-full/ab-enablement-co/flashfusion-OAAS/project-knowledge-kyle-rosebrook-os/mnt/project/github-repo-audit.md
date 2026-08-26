# GitHub Repository Audit — Kyle Rosebrook (Krosebrook)
## 630+ Repos → Categorized, Curated, Mapped, Consolidated
### Generated April 14, 2026

---

## PHASE 1: CATEGORIZATION AUDIT

### Summary Counts

| Category | Count | Action |
|----------|-------|--------|
| **Reference Forks (high-star upstream)** | ~280 | Archive or delete 90%+ |
| **"Awesome List" Forks** | ~45 | Archive all — use bookmarks instead |
| **Framework/SDK Forks** | ~60 | Archive unless actively patched |
| **Base44 Apps** | ~32 | Audit for active vs. abandoned |
| **Kyle's Original Projects** | ~120 | Triage: keep / archive / merge |
| **Kinsley/Personal Projects** | ~20 | Keep in personal lane, archive stale |
| **INT/Intinc Projects** | ~18 | Private or archive — never public-facing |
| **FlashFusion Projects** | ~16 | Consolidate to 2-3 active repos |
| **Lovable/Blink/Leap/v0 Scaffolds** | ~30 | Archive 95% — one-off experiments |
| **Replit Mirror Repos** | ~10 | Archive all — Replit is source |
| **Duplicate/Version Repos** | ~15 | Merge into canonical repos |

---

### A. REFERENCE FORKS (~280 repos)

These are repos Kyle forked from popular open-source projects. They inflate the repo count but represent **zero original work**. Unless Kyle has active PRs or modifications, these should be archived or unforked.

#### Tier 1: Major Framework/Platform Forks (archive all unless actively modified)

| Repo | Upstream Stars | Purpose | Action |
|------|---------------|---------|--------|
| n8n | 56k | Workflow automation platform | **KEEP** — active in stack |
| react | 51k | React library | Archive |
| next.js | 31k | Next.js framework | Archive |
| freeCodeCamp | 44k | Learning platform | Archive |
| build-your-own-x | 46k | Learning resource | Archive |
| public-apis | 45k | API directory | Archive |
| system-design-primer | 55k | Learning resource | Archive |
| bootstrap | 79k | CSS framework | Archive |
| supabase | 12k | Database platform | **KEEP** — active in stack |
| awesome-chatgpt-prompts | 20k | Prompt library | Archive |
| awesometopics | 34k | Topic lists | Archive |
| system-prompts-and-models | 34k | System prompts | Archive |
| airflow | 17k | Workflow engine | Archive |
| superset | 17k | Data viz | Archive |
| material-ui | 33k | Component lib | Archive |
| transformers | 33k | ML models | Archive |
| awesome-llm-apps | 15k | LLM resources | Archive |
| yt-dlp | 12k | Video downloader | Archive |
| Font-Awesome | 12k | Icons | Archive |
| html5-boilerplate | 12k | Template | Archive |
| terraform | 10k | IaC | Archive |
| fastapi | 8.9k | Python API | Archive |
| django | 34k | Python framework | Archive |
| PowerToys | 7.8k | Windows utils | Archive |
| godot | 25k | Game engine | Archive |

#### Tier 2: AI/Agent Framework Forks (archive unless actively using)

| Repo | Stars | Verdict |
|------|-------|---------|
| langflow | 8.7k | Archive — not in active stack |
| langgraph | 4.7k | Archive |
| crewAI | 6.4k | Archive |
| autogen | 8.5k | Archive |
| OpenHands | 8.7k | Archive |
| agent-zero | 3.4k | Archive |
| swarms | 794 | Archive |
| swarm (OpenAI) | 2.3k | Archive |
| letta | 2.3k | Archive |
| aider | 4.1k | Archive |
| Archon | 2.4k | Archive |
| agent-framework | 1.4k | Archive |
| llama_index | 7.1k | Archive |
| pipecat | 1.8k | Archive |

#### Tier 3: Claude/MCP Ecosystem Forks

| Repo | Stars | Verdict |
|------|-------|---------|
| servers (MCP) | 10k | Archive — reference only |
| claude-code | 7k | Archive |
| superpowers | 9.2k | Archive |
| skills | 11k | **KEEP** — active reference for skills work |
| awesome-claude-code | 2.3k | Archive |
| claude-code-templates | 2.3k | Archive |
| claude-flow | 2.9k | Archive |
| claude-code-by-agents | 227 | Archive |
| spec-kit | 7k | Archive |
| agents (subagents) | 3.5k | Archive |
| SuperClaude | 1.9k | Archive |
| claude-squad | 463 | Archive |
| claude-cookbooks | 3.9k | Archive |
| anthropic-quickstarts | 2.6k | Archive |

#### Tier 4: "Awesome Lists" (archive ALL — use browser bookmarks)

awesome-go, awesome-python, awesome-nodejs, awesome-react, awesome-vue, awesome-flutter, awesome-java, awesome-javascript, awesome-shell, awesome-docker, awesome-compose, awesome-readme, awesome-react-components, awesome-react-native, awesome-android-ui, awesome-selfhosted, awesome-scalability, awesome-saas-directory, awesome-claude-skills, awesome-claude-code2, awesome-claude-code3, awesome-claude-code-plugins, awesome-claude-code-subagents, awesome-copilot, awesome-cursorrules, awesome-n8n, awesome-n8n-templates, awesome-workflow-automation, awesome-workflow-engines, Awesome-Prompt-Engineering, ai-engineering-toolkit, awesome-mcp-servers, the-book-of-secret-knowledge, cs-video-courses

**→ 35+ repos. Archive every single one.**

#### Tier 5: Misc Tool/Platform Forks (archive all)

InvenTree, snipe-it, nocodb, budibase, leantime, carbon, erpnext, samarium, AppFlowy, Nettacker, NodeGoat, zaproxy, ghidra, Percona tools, Redis tools, cloudnative-pg, kubespray, OmniParser, stable-diffusion, audiocraft, flash-attention, Skywork, DeepCode, markitdown, flatbuffers, better-auth, stagehand, open-interpreter, LangBot, genai-processors, etc.

**→ ~60 repos. Archive all.**

---

### B. KYLE'S ORIGINAL PROJECTS (~120 repos)

#### Base44 Apps (32 repos)

| Repo | App Name | Status | Lane | Action |
|------|----------|--------|------|--------|
| fusion-ai | Fusion AI | **ACTIVE** — 67-entity flagship | FlashFusion | **KEEP — PRIMARY** |
| chaos-club | Chaos Club | **ACTIVE** — MVP | ChaosClub | **KEEP** |
| interact | INTeract | Active | INT | **KEEP — PRIVATE** |
| tessa-ai | Jarvis AI Companion | Active (3 days ago) | Personal | Keep |
| sedona-soul-sessions | Sedona Soul Sessions | Retained | Personal | Keep |
| teamsync | TeamSync | Recent (5 days) | FlashFusion | Evaluate |
| enterprise-hub | Enterprise Hub | Stale (3w) | FlashFusion | Archive |
| nexus-copilot | Nexus Copilot | Stale | FlashFusion | Archive |
| platformforge | PlatformForge | Stale | FlashFusion | Archive |
| ai-ops-concierge | AI Ops Concierge | Stale | FlashFusion | Archive |
| lifesync | LifeSync | Stale | Personal | Archive |
| auraflow | AuraFlow | Stale | Personal | Archive |
| seth | SETH | Stale | Personal | Archive |
| enterprise-ai-app-generator | Enterprise AI App Generator | Stale | FlashFusion | Archive |
| AIaaS | Captured: hqforai.com | Stale | FlashFusion | Archive |
| champions-hub | Champions Hub | Stale | Personal | Archive |
| ai-game-day-oracle | AI Game Day Oracle | Stale | Personal | Archive |
| battle-arena-pro | Battle Arena Pro | Stale | Personal | Archive |
| gamecraft | GameCraft | Stale (5d) | Personal | Archive |
| painpoint-insights | PainPoint Insights | Stale | FlashFusion | Archive |
| archon-orchestrator | Archon Orchestrator | Stale | FlashFusion | Archive |
| ai-studio-builder | AI Studio | Stale | FlashFusion | Archive |
| soleignite | SoleIgnite | Stale | FlashFusion/Kelan | Evaluate — Kelan demo? |
| ai-adoption-strategist | AI Adoption Strategist | Stale | FlashFusion | Archive |
| orchestrator-ai | Orchestrator AI | Stale | FlashFusion | Archive |
| ai-passive-income-navigator | AI Passive Income Nav | Stale | Personal | Archive |
| sparkacademy | SparkAcademy | Stale | FlashFusion | Archive |
| archdesigner | ArchDesigner | Stale | FlashFusion | Archive |
| webnflow | WebnfloW | Stale | FlashFusion | Archive |
| proactive-mentor-os | Proactive Mentor OS | Stale | Personal | Archive |

**Base44 verdict:** Keep 4 (fusion-ai, chaos-club, interact, tessa-ai). Evaluate 2 (teamsync, soleignite). Archive 26.

#### FlashFusion Projects (16 repos)

| Repo | Purpose | Last Activity | Action |
|------|---------|---------------|--------|
| fusion-ai | Flagship Base44 app | Active | **KEEP — PRIMARY** |
| Flashfusionwebsitev20 | Website v2 | 2 weeks | Evaluate — is this the live site? |
| flashfusion-marketing-hub-79 | Marketing hub | 1 week | **KEEP** if marketing active |
| FlashFusion | Original TypeScript | Jan 2025 | Archive — superseded |
| OpenFlashFusion | Open source variant | Oct 2025 | Archive |
| flashfusion-commerce-forge | E-commerce | Jan 2025 | Archive |
| flashfusion-platform | Blink scaffold | Jan 2025 | Archive |
| Flash-UI | UI components | Jan 2025 | Archive |
| Flash-n-Frame | Visualizer | Feb 2025 | Archive |
| flashnframe-app | TypeScript app | Active (1 commit) | Evaluate |
| FusionAI | Earlier version | Jan 2025 | Archive — superseded by fusion-ai |
| FusenFlow | Writing assistant | Feb 2025 | Archive |
| fusion-flux-flow | Unknown | Jan 2025 | Archive |
| fusion-stage-hub | Unknown | Jan 2025 | Archive |
| fission-vision | Unknown | 2 weeks | Evaluate |
| FFKB | Knowledge base | Oct 2025 | Archive |

**FlashFusion verdict:** Keep 2-3 (fusion-ai, Flashfusionwebsitev20, marketing-hub). Archive 12+.

#### INT/Intinc Projects (18 repos)

**⚠️ CRITICAL: These must NEVER be public-facing per Kyle's constraint.**

| Repo | Visibility | Action |
|------|-----------|--------|
| intinc-platform | **Private** ✓ | **KEEP** — Skills Library (330 skills) |
| INT-SysDesignGen | Public ⚠️ | Make private or archive |
| INT-Platform-Explorerv2.6 | Public ⚠️ | Make private or archive |
| INT-Platform-Explorer-2 | Public ⚠️ | Make private or archive |
| IntDashEngine | Public ⚠️ | Make private or archive |
| INTeiiIgen | Public ⚠️ | Make private or archive |
| INTeractv1.0 | Public ⚠️ | Archive — superseded by interact (Base44) |
| INTeract-Engage | Public ⚠️ | Make private or archive |
| INTExplore | Public ⚠️ | Make private or archive |
| INT-FlashnFrame | Public ⚠️ | Make private or archive |
| INT-Voice-Library | Public ⚠️ | Make private or archive |
| INTake-to-Insight | Public ⚠️ | Make private or archive |
| INTEnterpriseProfileBuilderFinalv.1.0 | Public ⚠️ | Make private or archive |
| int-smart-triage-ai (v2.0, v3.0 variants) | Mixed ⚠️ | Make private or archive |
| INT-Smart-Triage-AI-2.0 | Public ⚠️ | Make private or archive |
| INFOGeniusv2.0 | Public ⚠️ | Make private or archive |
| INTincRoadmap | Public ⚠️ | Make private or archive |
| Intos | Public ⚠️ | Make private or archive |

**🚨 INT verdict: 16 of 18 INT repos are PUBLIC and reference Intinc. This is a brand/employment risk. Immediate action: make all private or archive.**

#### Kinsley/Personal Projects (20 repos)

| Repo | Description | Last Activity | Action |
|------|-------------|---------------|--------|
| infinity-heroes-bedtime-chronicles | TypeScript, active | 19 hours ago | **KEEP — ACTIVE** |
| Infinite-Heros-Bedtime-Chronicles-v5 | Newer version | Recent | **KEEP** — consolidate with above |
| InfiniteHeros | Earlier version | Last week | Archive — superseded |
| KinsleysCreativeSuite | Coloring book gen | Oct 2025 | Archive |
| KinsleyCorner | Mindfulness app | Dec 2025 | Evaluate |
| Kinsley-Company | Unknown | Jan 2025 | Archive |
| KinsOpolis / KinsOpoliss | Town builder | 2 weeks | Archive one duplicate |
| kingdomofkins | Private | 2 weeks | Evaluate |
| KinsKitchen | Recipe app | Jan 2025 | Archive |
| WonderTales | Audiobook for kids | Jan 2025 | Archive |
| ChatterBot-K | Chatbot | Jan 2025 | Archive |
| Castle-Builder (5 versions!) | Castle game | Jan 2025 | **CONSOLIDATE** → 1 repo |
| MumbleJumble | Character gen | Feb 2025 | Archive |
| DreamLinesColorscape | Coloring book | 2 weeks | Archive |
| LittleLotus | App for kids | Feb 2025 | Archive |
| FableArchitectBuilder | Builder game | Jan 2025 | Archive |
| LifeWins | Kid training | Jun 2025 | Archive |

**Kinsley verdict:** Keep 2 (infinity-heroes-bedtime-chronicles, KinsleyCorner). Archive 15+. Eliminate 5 Castle-Builder duplicates → 1 repo.

#### Tools/Utilities/Platforms (misc original, ~40 repos)

| Repo | Purpose | Active? | Action |
|------|---------|---------|--------|
| **upe-priority-engine** | WSJF/ROI scoring | Private, active | **KEEP — HIDDEN GEM** |
| **intinc-platform** | 330 Skills Library | Private, active | **KEEP — PRIMARY** |
| **monk** | Portfolio Command Center | Active (20h) | **KEEP** |
| **cowork** | Cowork private | Active (yesterday) | **KEEP** |
| **ai-pr-review-system** | PR review | Active (2d) | **KEEP** |
| **vibe-coding-workshop** | Workshop materials | Active (4d) | **KEEP** |
| Agent-K / tessa-ai | AI companion | Active (2w/3d) | **KEEP tessa-ai**, archive Agent-K |
| command-center | D:\ drive dashboard | 2 weeks | Evaluate |
| odyssey-learns | Learning platform | Last week | **KEEP** |
| pixel-perfect | Unknown | 2 weeks | Evaluate |
| source-of-truth-monorepo | MONOTURBO | Active | **KEEP — CONSOLIDATION TARGET** |
| continuum | Opportunity discovery | Active | **KEEP — but BLOCKED (Supabase)** |
| AutoArchtect / AutoArchitect-main / AutoArchitectv1.2 | Automation builder | Stale | Archive 2, keep 1 |
| DashBoardGenv1.0 / DashGenVariant1 / DashLib-AI / InteliBuildDashGen | Dashboard generators | Stale | Archive all — redundant |
| AetherAgentsOS / AgenticAI / AgentGraph | Agent platforms | Stale | Archive all |
| PersonaFlow / PersonaRepository | Profile builders | Stale | Archive |
| PromptForge | Prompt builder | Stale | Archive |
| ProjectManagerOS | PM tool | Stale | Archive |
| NexusDash | Dashboard | Stale | Archive |
| StrategicAnalysis | Business analysis | 2 weeks | Evaluate |

#### Lovable/Blink/Leap/v0 Scaffolds (~30 repos)

These are one-off experiments from various AI builders. Almost all are stale.

**Archive ALL except:**
- Enterpriseprofilebuilder (if still active for Gwen)
- enterprise-profile-studio-stale- (already marked stale in name)
- flashfusion-marketing-hub-79 (if marketing active)

Everything else: ai-landing-page-genie, notion-os-builder, call-to-brief, spin-the-price, sentinel-local-pulse, meshmind-orchestrator, insight-catch-magic, ui-component-genie, pixel-perfect-magic-63, nexus-pod, actionflow-magic, spark-digger, sparc-flow, superscale-lovable-guide, etc. → **Archive all.**

#### Replit Mirror Repos (~10 repos)

These are GitHub mirrors of Replit projects. Archive all — Replit is source of truth:

RoseyRecords, slapstickers, Castle-Builder (Replit), BuildProduction, solo-merch-flow, AffordableStoreStuff, affordstuff, Production-Planer, solemuchbetterv2, tiktok-story-ai

---

## PHASE 2: PORTFOLIO CURATION

### What Actually Represents Kyle's Work

From 630+ repos, these are the repos that represent **real, demonstrable competence** a recruiter, investor, or collaborator should see:

#### Tier 1: Showcase Repos (Pin these on GitHub profile)

| Repo | Why | Lane |
|------|-----|------|
| **intinc-platform** | 330 production skills across 6 categories | FlashFusion/INT (keep private) |
| **fusion-ai** | 67-entity enterprise AI platform schema | FlashFusion |
| **upe-priority-engine** | WSJF/ROI scoring — real engineering | FlashFusion |
| **source-of-truth-monorepo** | Shows architectural thinking | FlashFusion |
| **monk** | Portfolio command center + n8n automation | Personal |
| **chaos-club** | Mental health platform MVP | ChaosClub |

#### Tier 2: Supporting Evidence

| Repo | Why |
|------|-----|
| continuum | Next.js 16 + Supabase + Tailwind 4 (when unblocked) |
| odyssey-learns | Learning platform |
| vibe-coding-workshop | Teaching materials |
| ai-pr-review-system | CI/CD automation |
| infinity-heroes-bedtime-chronicles | Creative coding for Kinsley |

#### Tier 3: Hidden Gems to Spotlight

| Repo | Why | Current State |
|------|-----|---------------|
| ChaosClubCo/claude-code-plugins-plus | 244-plugin marketplace catalog | **Exists but undistributed** |
| SyntheINC | 21 templates, 22 block types | Private, stale |
| upe-priority-engine | WSJF scoring | Private |

### Profile Cleanup Recommendations

1. **Pin 6 repos** on GitHub profile: fusion-ai, upe-priority-engine, monk, chaos-club, source-of-truth-monorepo, odyssey-learns
2. **Update profile bio** to reflect current identity: "Self-taught Staff Engineer | Building externalized cognition systems | FlashFusion | Chaos Club Co."
3. **Archive 450+ repos** in a single batch operation (see Phase 4)

---

## PHASE 3: LANE MAPPING

### Lane 1: FlashFusion (B2B AI Enablement)

**Active repos (KEEP):**
- fusion-ai (Base44 flagship)
- intinc-platform (Skills Library — 330 skills)
- Flashfusionwebsitev20 (website)
- flashfusion-marketing-hub-79 (marketing)
- source-of-truth-monorepo (MONOTURBO)
- monk (Portfolio Command Center)
- cowork (Cowork private)
- teamsync (evaluate)

**Archive (12+ repos):**
All older FlashFusion iterations, commerce-forge, Flash-UI, fusion-flux-flow, etc.

### Lane 2: Chaos Club Co. (Mental Health Platform)

**Active repos (KEEP):**
- chaos-club (Base44 app)
- ChaosClubCo org repos (separate org — not in this audit)

**Archive:**
Nothing to archive from Krosebrook — most ChaosClub work is in the ChaosClubCo org.

### Lane 3: Personal Brand / Memoir

**Active repos (KEEP):**
- monk (Portfolio Command Center)
- vibe-coding-workshop (teaching cred)
- ai-pr-review-system (engineering cred)
- odyssey-learns (platform)
- awesome-claude-code (if contributing)

**No repos needed** — memoir and personal brand live in WordPress/project knowledge, not GitHub.

### Lane 4: Kinsley (Personal/Gift)

**Active repos (KEEP):**
- infinity-heroes-bedtime-chronicles (active)
- KinsleyCorner (evaluate)

**Archive:** All Castle-Builder variants, KinsKitchen, WonderTales, MumbleJumble, etc.

### Lane 5: INT/Intinc (Day Job — NEVER PUBLIC)

**Active repos (KEEP PRIVATE):**
- intinc-platform (already private)

**🚨 URGENT: Make private or archive (16 public INT repos):**
Every repo with "INT" in the name that's currently public. This is an immediate risk.

---

## PHASE 4: CONSOLIDATION PLAN

### Immediate Actions (Do Today — 30 min)

1. **🚨 Make all INT repos private** (16 repos) — employment/brand risk
2. **Archive all "awesome-*" forks** (35 repos) — zero value on profile
3. **Archive all Replit mirrors** (10 repos)
4. **Archive Castle-Builder duplicates** (4 of 5)

### This Week Actions (2 hours)

5. **Archive major framework forks** (react, next.js, django, bootstrap, etc.) — 60+ repos
6. **Archive stale Base44 apps** (26 repos)
7. **Archive stale Kinsley projects** (15 repos)
8. **Archive Lovable/Blink/v0 scaffolds** (25+ repos)

### This Month Actions (4 hours)

9. **Archive AI/agent framework forks** (langflow, crewAI, autogen, etc.) — 30+ repos
10. **Archive misc tool forks** (InvenTree, snipe-it, nocodb, etc.) — 50+ repos
11. **Consolidate FlashFusion repos** → point everything to fusion-ai + source-of-truth-monorepo
12. **Update GitHub profile**: bio, pinned repos, clean organization

### Target End State

| Metric | Current | Target |
|--------|---------|--------|
| Total repos (visible) | 630+ | **~40-50** |
| Archived repos | 0 | ~500 |
| Deleted/unforked | 0 | ~80 (pure forks with no commits) |
| Pinned repos | Unknown | 6 (curated) |
| Public INT repos | 16 ⚠️ | **0** |
| Active repos | ~20 | ~20 (same, but findable) |

---

## PHASE 5: EXECUTION SCRIPT

### Batch Archive Script (GitHub CLI)

```bash
# Install GitHub CLI if needed: brew install gh

# Step 1: Archive all awesome-* forks
gh repo list Krosebrook --limit 1000 --json name --jq '.[].name' | \
  grep -i "^awesome" | \
  while read repo; do
    echo "Archiving Krosebrook/$repo"
    gh repo archive "Krosebrook/$repo" --yes
  done

# Step 2: Make all INT repos private
for repo in INTincRoadmap INT-SysDesignGen INT-Platform-Explorerv2.6 \
  INT-Platform-Explorer-2 IntDashEngine INTeiiIgen INTeractv1.0 \
  INTeract-Engage INTExplore INT-FlashnFrame INT-Voice-Library \
  INTake-to-Insight INTEnterpriseProfileBuilderFinalv.1.0 \
  int-smart-triage-ai-3.0 INT-Smart-Triage-AI-2.0 INFOGeniusv2.0 \
  Intos; do
    echo "Making private: Krosebrook/$repo"
    gh repo edit "Krosebrook/$repo" --visibility private
  done

# Step 3: Archive stale Base44 apps
for repo in enterprise-hub nexus-copilot platformforge ai-ops-concierge \
  lifesync auraflow seth enterprise-ai-app-generator AIaaS champions-hub \
  ai-game-day-oracle battle-arena-pro ai-studio-builder painpoint-insights \
  archon-orchestrator ai-adoption-strategist orchestrator-ai \
  ai-passive-income-navigator sparkacademy archdesigner webnflow \
  proactive-mentor-os; do
    echo "Archiving Krosebrook/$repo"
    gh repo archive "Krosebrook/$repo" --yes
  done

# Step 4: Archive Kinsley duplicates
for repo in InfiniteHeros KinsleysCreativeSuite Kinsley-Company \
  KinsKitchen WonderTales ChatterBot-K MumbleJumble LittleLotus \
  FableArchitectBuilder Castle-Builder Castle-Builderv1.5 \
  Castle-Builder.2.0 Castle-Builder3 CastleBuilder ReplitCastleBuilder \
  LifeWins DreamLinesColorscape KinsOpoliss; do
    echo "Archiving Krosebrook/$repo"
    gh repo archive "Krosebrook/$repo" --yes
  done

# Step 5: Archive Lovable/Blink/v0 scaffolds
for repo in ai-landing-page-genie notion-os-builder call-to-brief \
  spin-the-price sentinel-local-pulse meshmind-orchestrator \
  insight-catch-magic ui-component-genie pixel-perfect-magic-63 \
  nexus-pod actionflow-magic spark-digger sparc-flow \
  superscale-lovable-guide-33147 agent-k-architect autoarchitect-suite \
  autoarchitect nanogen-studio nanogen-studio.FBEdition \
  onboardly-saas-platform pixel-perfect-clone-8825 \
  dads-e-commerce-plan-generator lead-scraping-dashboard-with-oauth-supabase-and-n8n-integration-remix \
  ai-seo-content-platform-for-automated-article-generation-and-ranking-insights \
  ai-prompt-shop-launchpad-create-sell-digital-prompt-products-effortlessly-remix \
  universal-blindspot-radar-industry-agnostic-blindspot-compliance-intelligence-suite; do
    echo "Archiving Krosebrook/$repo"
    gh repo archive "Krosebrook/$repo" --yes
  done

# Step 6: Archive Replit mirrors
for repo in RoseyRecords slapstickers BuildProduction solo-merch-flow \
  AffordableStoreStuff affordstuff solemuchbetterv2; do
    echo "Archiving Krosebrook/$repo"
    gh repo archive "Krosebrook/$repo" --yes
  done
```

### Pin Configuration

```bash
# After cleanup, pin these 6 repos:
# 1. fusion-ai (FlashFusion flagship)
# 2. upe-priority-engine (engineering credibility)
# 3. monk (portfolio + automation)
# 4. chaos-club (mental health platform)
# 5. source-of-truth-monorepo (architectural thinking)
# 6. odyssey-learns (learning platform)
#
# Note: GitHub pinning must be done via web UI
```

---

## RED FLAGS FOUND

### 🚨 Priority 1: INT Repos Public (IMMEDIATE)
16 repos with "INT" branding are publicly visible. Per Kyle's constraint, Intinc must never appear in external content. **Fix today.**

### ⚠️ Priority 2: Duplicate/Version Sprawl
Multiple repos for the same project (5 Castle-Builders, 3 AutoArchitects, 4 Dashboard generators, 2 INT Platform Explorers, multiple FlashFusion iterations). Consolidate to canonical repos.

### ⚠️ Priority 3: Profile Signal-to-Noise
At 630+ repos, anyone visiting Kyle's GitHub sees noise. The 20 repos that represent real work are buried under 610 forks and experiments. Archiving brings the signal to the surface.

### ℹ️ Priority 4: Org Separation
ChaosClubCo org exists (50+ repos). FlashFusionv1 org exists. Good separation. But Krosebrook personal account holds repos that belong in these orgs. Consider migrating:
- chaos-club → ChaosClubCo org
- All FF repos → FlashFusionv1 org

---

## MEMOIR RELEVANCE

This audit IS memoir material. The 630 repos — the compulsive forking, the 5 versions of Castle-Builder, the tool hoarding — this is the externalized cognition chapter. The construction project in action. Not organized, not efficient, but *surviving*. The cleanup is the reconstruction.

Key data points for Tool Archaeology (Session 3):
- Earliest repos: ~2022-2023 (printmaster, PIPrint, Floating-Navigation-View)
- First AI-adjacent: ~2023-2024 (stable-diffusion, open-musiclm, langforge)
- Explosion: Late 2024-2025 (agent frameworks, MCP servers, Base44 apps)
- Current: ~40+ active repos across 3 lanes

The chronological mapping of these 630 repos IS the tool archaeology session.
