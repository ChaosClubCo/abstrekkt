import { useState, useRef } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0d1117}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes glow{0%,100%{box-shadow:0 0 8px #6366f133}50%{box-shadow:0 0 20px #6366f166}}
  .btn:hover{filter:brightness(1.12);transform:translateY(-1px)}.btn:active{transform:translateY(0)}
  textarea:focus,input:focus{outline:none!important;border-color:#6366f155!important;box-shadow:0 0 0 2px #6366f111}
  .field-card:hover{border-color:#1e293b!important}
  .tag-pill:hover{background:#1e293b!important;color:#94a3b8!important}
  .copy-flash{animation:pulse .3s ease}
`;

// ── SEED DATA (this session) ────────────────────────────────────────────────
const SESSION_SEED = {
  meta: {
    sessionTitle: "Beta Tester Army + Copilot Studio Toolkit — Multi-Session Build",
    sourceProject: "Flash-n-Frame / Claude Ecosystem Knowledge + Microsoft Copilot Studio Enterprise Agent Project",
    destinationProject: "",
    date: new Date().toISOString().split("T")[0],
    version: "2.0",
  },
  built: [
    {
      id: "b1",
      name: "Beta Tester Army v1",
      type: "artifact",
      file: "beta-tester-army.jsx",
      description: "AI persona generator + parallel flow tester. Input: product name, description, flows, agent count. Output: parallel Claude API calls per persona, per-flow friction scores, verbatim quotes, drop-off points, sentiment, and synthesized intelligence brief.",
      status: "shipped",
    },
    {
      id: "b2",
      name: "Beta Tester Army v2",
      type: "artifact",
      file: "beta-tester-army-v2.jsx",
      description: "Extended v1 with full template system. 6 built-in templates (Web App, API/Dev Tool, Mobile, Landing Page, Physical Product, SOP/Process). Meta Template Generator (AI builds custom templates from a plain-English brief). Import/export as JSON. Template-aware persona generation and meta-prompt injection into test agents.",
      status: "shipped",
    },
    {
      id: "b3",
      name: "Copilot Studio Agent Build Flow",
      type: "artifact",
      file: "CopilotStudioFlow.jsx",
      description: "Interactive 862-line React build-flow visualizer for Copilot Studio enterprise agents. 14 nodes covering full lifecycle: Define Purpose → Instructions (≤400 tokens) → Knowledge Sources → Topics → Tools → Integration Decision → External System Config → Event Triggers (service account pattern) → Auth/Licensing → Test Set → Security Hardening → Publish → Monitor → Escalation paths. Each node has Detail, AI, Notes, Progress, and Config tabs. Configurable per org (orgName, agentName, channel, escalation). Bypasses flagged. Status tracked per step. Reusable as enterprise delivery checklist.",
      status: "shipped",
    },
    {
      id: "b4",
      name: "Azure AI Foundry Explorer v12",
      type: "artifact",
      file: "azure-ai-foundry-v12.jsx",
      description: "Teaching tool + live playground. Calls Claude API directly (not Azure). 3 modes: MOCK (pre-written simulations, no API key needed), LIVE (real Claude model, uses tokens), DEMO (client-facing mode, hides internal branding). 3 personas: Explorer (plain language), Power User (technical depth), Admin/MSP (governance + licensing). Progress saved to device. API key never stored. Use case: demo Azure AI Foundry to clients before any Azure spend; test system prompts before deploying to Copilot Studio.",
      status: "shipped",
    },
    {
      id: "b5",
      name: "FreshService Ticket Updater (Computer Use Tool)",
      type: "tool-spec",
      file: "FS_Ticket_Updater_Deliverables.md",
      description: "Production-ready Computer Use tool for Copilot Studio to update Freshservice tickets via browser UI. 5 deliverables: (1) Tool configuration with description, (2) Computer Use instructions — 41-step sequence with 10 global safety rules (never post public reply without confirmation, exact ticket ID match required, dry_run flag, idempotency key), (3) 30-input schema (5 required + 6 optional update + 5 verification + 6 audit/control inputs), (4) Fill-using-configuration guide (Dynamic AI vs Custom Value per input), (5) JSON I/O contracts with full schema. Result codes: success, dry_run, failed, not_found, permission_denied, validation_error, duplicate_detected, ticket_mismatch, timeout.",
      status: "shipped",
    },
    {
      id: "b6",
      name: "Prompt Engineering Toolkit v3.2.0",
      type: "knowledge-base",
      file: "README.md / 23-core-techniques-quick-reference.md / prompt-templates-library.md / cursor-ai-prompts-ready-to-use.md / cursor-ai-8-phase-system.md / technique-use-cases-complete.md / evidence-base-citations.md / testing-complete-guide.md / security-patterns-complete-guide.md",
      description: "Evidence-based prompt engineering framework. 3 versions shipped in session: v3.0 (13 files, initial), v3.1 (18 files, +n8n/Make.com/Zapier guides, CLI agents, QA master guide), v3.2 (+7 files = 25 total: Cursor AI complete guide, Claude Code/ChatGPT API quick ref, security patterns OWASP, testing complete guide, dev docs templates, git hooks, slash commands library). Core: 23 techniques (curated from 47, 24 duplicates removed). 150+ prompts total. 16-prompt sequential Cursor AI system (8 phases). ROI-mapped per technique (CoT +40-50%, Schema +50-60%, RAG +40-60%). Docker Compose observability stack. 73-page comprehensive taxonomy exists externally (Google Drive ID: 1zj1x82w_TEJanhvQfroMgsPAsDrTpLX-oT5O9PtgWXo) — not included in project due to size.",
      status: "shipped",
    },
    {
      id: "b7",
      name: "GitHub Copilot Repo Agent — Documentation Generator Prompt",
      type: "prompt",
      file: "copilot-docs-agent-prompt.md",
      description: "Reusable mega-prompt for GitHub Copilot's repo agent. Phase 0: mandatory repo reconnaisance (map structure, classify type, detect stack, inventory existing docs with quality grades, detect conventions). Phase 1: generates full documentation manifest — Tier 1 Core (README, CONTRIBUTING, CHANGELOG, LICENSE, SECURITY), Tier 2 Dev (API docs, Architecture, ADRs, Local dev setup), Tier 3 Ops (Deployment, Runbooks, Monitoring, Incident response). Merges existing content vs. generating from scratch based on quality grade. Targets human devs, AI coding agents, and non-technical stakeholders.",
      status: "shipped",
    },
    {
      id: "b8",
      name: "Copilot Studio Reference Index",
      type: "knowledge-base",
      file: "COPILOT-STUDIO-REFERENCE-INDEX.md",
      description: "Curated relevance-rated index of all Copilot Studio documentation (last reviewed May 2026). 10 categories: Knowledge Sources, Orchestration & Agent Behavior, Topics & Conversation Design, Variables & Expressions, Auth & Security, Publishing & Deployment, Analytics & Monitoring, Data Governance, Multi-channel, Advanced Features. Each doc rated ⭐⭐⭐ / ⭐⭐ / ⭐ / ❌. Critical entries flagged (e.g., 4-website classic limit, service account for triggers, tenant graph grounding requirements).",
      status: "shipped",
    },
    {
      id: "b9",
      name: "Copilot Frontier Brain v8 + Collections Reference",
      type: "artifact",
      file: "copilot-frontier-brain-v8.html / copilot-studio-collections-reference.html / copilot-collections-reference.html",
      description: "HTML artifacts: Frontier Brain v8 (comprehensive Frontier program feature map), Copilot Studio Collections Reference (structured reference for Copilot Studio capabilities), Copilot Collections Reference (broader M365 Copilot collections overview). Used for client demos, internal reference, and agent-authoring context.",
      status: "shipped",
    },
    {
      id: "b10",
      name: "Zero-G Agent Orchestrator v4.1",
      type: "artifact",
      file: "zero-g-agent-orchestrator-v4.1.html (rebuilt June 2026 from Feb session specs)",
      description: "Single-file Three.js r128 multi-agent orchestration visualization (923 lines). EventBus, storage-safe ConfigStore (localStorage + in-memory fallback), Logger ring buffer, ProviderFactory routing real inference through claude-sonnet-4-6 via host proxy. Six live Claude-backed role agents (Architect, Builder, Security, Researcher, Ops, Scribe) + three honestly-labeled inactive provider slots (Codex, Gemini, Copilot). BoundedConcurrency TaskDispatcher. Four switchable topologies (star, ring, mesh, hierarchy). MCP connector overlay seeded with real ~18-connector stack. Tokyo Night void-dark HUD. 14 WCAG 2.2 AA patches applied: contrast fix, aria-hidden canvas, aria-live status region, button elements for legend rows, aria-pressed topology buttons, role=dialog for popovers, prefers-reduced-motion damping. Rebuilt from recovered spec — original artifact from Feb session (chats 6ea931a9 + 1c446770).",
      status: "shipped",
    },
    {
      id: "b11",
      name: "Nexus Copilot — UMPG v4.0 Base44 Implementation",
      type: "artifact",
      file: "https://nexus-aii.base44.app (Base44 appId: 6953593fa0363e206cad4944, org_id: 69535cb174c44c15f219148f)",
      description: "UMPG v4.0 Plan-Execute-Refine architecture implemented into Base44 Nexus Copilot app. Seeded: KnowledgeBase articles (architectural overview, quality gates reference, model selection strategy); 3 Agents (UMPG Planner with Chain-of-Verification, UMPG Executor with Reflexion error recovery, UMPG Synthesizer with Self-Refine loops); 8 ToolRegistry entries with cost weights; 5-step active Plan-Execute-Refine Workflow; 4 UI surfaces (Agent Studio, Governance tab, Tools tab, enhanced KB view).",
      status: "shipped",
    },
    {
      id: "b12",
      name: "PROJECT NEXUS — 7-Prompt Chain",
      type: "document",
      file: "PROJECT_NEXUS__Complete_7-Prompt_Chain.md",
      description: "Complete 7-prompt sequential build chain for a DevOps command center. Stack: Cloudflare Pages + Workers + D1 (SQLite edge DB) + R2. Prompts: (1) D1 schema design (9 tables), (2) React ProjectCard with real-time metrics polling, (3) automated prompt regression test suite + GitHub Actions CI/CD, (4) log analysis + anomaly detection via scheduled Workers, (5) CI/CD visualization + GitHub Actions API, (6) AI-powered file organization (Claude API categorization + PowerShell move scripts), (7) master Lovable.dev integration prompt. Build time: 12-15 hrs. Cost: ~$35-50/month (Cloudflare $20 + OpenAI $10-20 + Claude API $5-10). NOT YET BUILT — prompt chain only.",
      status: "shipped",
    },
    {
      id: "b14",
      name: "Agent Graph Studio",
      type: "artifact",
      file: "Agent_Graph_Studio.tsx + GraphProvider___Client_SDK.txt + orchestrator-flow.jsx",
      description: "React + Three.js 3D AI agent topology visualizer. Intelligence layer: severity/ROI/priority scoring via useMemo hooks (44px KPI strip, sort controls, priority badges, Risk View toggle). Supabase backend: 4 tables (agent_graphs, graph_request_logs, graph_shares, user_plan_quotas) with RLS. Realtime Broadcast integration. Share tokens with expiry. Security boundary groups visualization (Core Platform, Dev Agents, Infrastructure, Security Boundary with sensitivity ratings). Electron desktop packaging: NSIS installer + portable .exe via electron-builder. Three-tier plan gating (Free/Pro/Team) at DB + edge function level. appId: 68dd8e79ca073475565c8e16 (~101 entities in Base44). GraphProvider/MockGraphProvider abstraction for PROD/DEV switching.",
      status: "shipped",
    },
    {
      id: "b15",
      name: "VISTADEL Framework — All 8 Phases",
      type: "document",
      file: "vistadel-complete/phases/ (Express/EJS site on Replit)",
      description: "8-phase app development methodology: Vision, Integration, Stack, Testing, AI Implementation, Deployment, Evolution, Launch. 20,100 words total (each phase in .md + .docx). Each phase: tagline, what it is, phase gate (score threshold), 5 steps, checklist, common failures, AI Your BI℠ section, references. Phase gates: V≥30, I security≥40, S quality≥50, T coverage≥40, A production≥50, D target≥60, E all≥60 avg, L overall≥70. Live Replit Express/EJS app serving from vistadel-complete/phases/. Kyle's own self-built methodology — a new app-development capability he created from scratch.",
      status: "shipped",
    },
    {
      id: "b16",
      name: "MCP Ecosystem Audit — 57-Connection Stack",
      type: "document",
      file: "xlsx audit (3 iterations, color-coded by recommendation)",
      description: "Full audit of Kyle's MCP server ecosystem. 57 total connections: native marketplace servers, disabled servers, custom URL-based, desktop servers. Findings: Sentry + Stripe disabled but active in stack (corrected); ~88 Zapier actions overlapping with native MCPs (Gmail, GCal, GitHub, Notion, M365, weather, web parser) = disable candidates; dead-weight servers to disconnect (Wix, Invideo, monday.com, Explorium). Lane separation confirmed: n8n = internal/self-hosted automation only (Sustainable Use License), Make = Customization Service + monetized/client-facing, Zapier = connector hub for services without native MCPs. Delivered as xlsx via openpyxl, color-coded (green=keep, red=remove, yellow=review, purple=completed, cyan=migration target, indigo=enable).",
      status: "shipped",
    },
    {
      id: "b17",
      name: "Antigravity IDE Workflow Library",
      type: "document",
      file: "4 phase files × 5 workflows each = 20 workflows",
      description: "Production-grade workflow library for Google Antigravity IDE (VS Code fork with Gemini 3 Pro, Claude Sonnet/Opus 4.6, GPT-OSS-120B). 20 workflows across 4 phases targeting the Flash-n-Frame TypeScript stack (Supabase, Vercel, Cloudflare Workers, n8n, Stripe, PostHog, Redis/Upstash). Expanded to ~12,000 chars each per requirement. Key workflows: /architect (8-phase system design + ADRs), /code-review (7-lens blocking/non-blocking protocol), /debug-expert (7-phase RCA with hypothesis scoring), /prompt-hardening (4 threat classes + Antigravity indirect injection defense), /n8n-flow (3-level error handling + DLQ schema), /stripe-flow (webhook state architecture + 10-scenario test card matrix), /db-migrate (zero-downtime patterns), /skill-authoring (complete SKILL.md format + eval suite).",
      status: "shipped",
    },
  ],
  decisions: [
    {
      id: "d1",
      decision: "Export format is JSON, not plain prompt text",
      rationale: "JSON is importable back into the app, versionable in Git, feedable to the Flash-n-Frame API, and diffable. Flat prompt strings give none of that.",
      alternatives: "Plain prompt text (.txt or .md)",
    },
    {
      id: "d2",
      decision: "Templates contain: persona archetypes, pre-written flows, scoring rubric with weighted dimensions, and meta-prompt as a string field",
      rationale: "Meta-prompt as a field inside JSON = structured AND injectable. Rubric weights allow future scoring dimension calibration per product type.",
      alternatives: "Flat template with just flows and description",
    },
    {
      id: "d3",
      decision: "Path B (infrastructure-first) over Path A (template-first)",
      rationale: "Migration infrastructure compounds across every future project hop. The Agentic System template can be built in the next project using this capsule as grounding.",
      alternatives: "Path A: Ship Agentic template now, then migrate",
    },
    {
      id: "d4",
      decision: "Proactive + hybrid project knowledge surfacing",
      rationale: "Kyle wants project knowledge used without being asked when clearly relevant, silent otherwise. Pull from project docs when building agentic/Claude-specific content.",
      alternatives: "On-demand only",
    },
    {
      id: "d5",
      decision: "Computer Use (Frontier) over native Freshservice connector for ticket updates",
      rationale: "Native Copilot Studio Freshservice connector has API limitations that block reliable ticket updates. Computer Use navigates the actual Freshservice UI with full field access. Trade-off: requires Frontier access + service account + browser session management, but delivers complete field coverage and no connector maintenance.",
      alternatives: "Native connector (blocked), Custom REST API action (more dev work, same limitations), Power Automate flow (requires PA premium license per run)",
    },
    {
      id: "d6",
      decision: "30-input schema with dry-run, idempotency key, and approval gate for Computer Use tool",
      rationale: "Production safety design: dry_run=true during all testing so no real tickets modified. Idempotency key (FS-{ticketId}-{updateType}-{hash}) prevents duplicate notes. requester_visibility_confirmed=false by default — explicit boolean required before any public reply. Separates audit context inputs from operational inputs. Enables HITL pattern without workflow restructure.",
      alternatives: "Minimal 3-input schema (faster to configure, unsafe for production), Single audit flag (loses granularity)",
    },
    {
      id: "d7",
      decision: "MOCK/LIVE/DEMO mode pattern for interactive teaching artifacts",
      rationale: "Allows demonstrating full Azure AI Foundry Explorer to clients before any Azure spend or setup. MOCK = credible simulation with labeled [MOCK MODE] responses. LIVE = real Claude API. DEMO = client-facing with internal branding hidden. Pattern is reusable across any teaching artifact that needs safe demo capability.",
      alternatives: "Always-live (requires API key from client), Always-mock (loses credibility of live demo)",
    },
    {
      id: "d8",
      decision: "23 techniques (not 47) — remove duplicates, cite everything",
      rationale: "Original 47-technique list had 24 duplicates under different names. 23 evidence-based techniques with citations > 47 uncited techniques. Every technique in the library has a research source or real-world evidence. Reduces cognitive load; increases trust from practitioners.",
      alternatives: "47 techniques (more complete but diluted), 10 techniques (too sparse for comprehensive use)",
    },
    {
      id: "d9",
      decision: "Service account (not personal credentials) for all Copilot Studio event triggers",
      rationale: "Triggers run with maker credentials. Personal creds = single-point-of-failure when that person leaves or changes password. Service account format: svc-[agentname]@yourdomain.com. Every trigger delivery = 1 Copilot Studio message (billing impact tied to account). Governance requires non-personal auth for production automations.",
      alternatives: "Personal credentials (simpler setup, non-compliant for production, billing tied to individual)",
    },
    {
      id: "d10",
      decision: "Agent instructions capped at ≤400 tokens — procedures go in Topics, not Instructions",
      rationale: "Instructions = identity, scope, behavior rules, output format, fallback. Procedures (step-by-step how-tos) belong in Topics. Bloated instructions degrade generative orchestration routing accuracy. 400 token target ≈ 1,600 chars. Verified with tokenizer before publish.",
      alternatives: "Long-form instructions (common mistake — causes routing failures and reduced retrieval quality)",
    },
    {
      id: "d11",
      decision: "Automation platform lane separation: n8n = internal/self-hosted only, Make = monetized/client-facing, Zapier = connector hub",
      rationale: "n8n Sustainable Use License explicitly prohibits commercial embedding and client-facing monetization. Make.com is the active migration target for the Customization Service. Zapier fills the connector hub role for services without native MCPs (Google Sheets, Google Docs, OpenAI, Google Workspace Admin). Violating this lane separation creates SUL legal exposure.",
      alternatives: "n8n for all automation (SUL violation risk), Make for everything (loses n8n's internal-automation depth)",
    },
    {
      id: "d12",
      decision: "UMPG v4.0: Plan-Execute-Refine over implicit ReAct; multi-stage self-correction (CoV + Reflexion + Self-Refine)",
      rationale: "Implicit ReAct fails on complex multi-step tasks — single-pass reasoning with no re-planning on failure, monolithic LLM calls causing high latency, insufficient error recovery. Plan-Execute-Refine separates concerns: Planner (Claude Sonnet for security/strategy) → Executor (Haiku for speed) → Synthesizer (Self-Refine loop). Multi-stage correction reduces hallucination compounding. Target cost reduction: $0.25/run → $0.08/run via model routing.",
      alternatives: "Implicit ReAct (current v3.4 baseline), single-model orchestration (higher cost, no specialization)",
    },
    {
      id: "d13",
      decision: "PROJECT NEXUS: Cloudflare Pages + Workers + D1 + R2 (not Vercel)",
      rationale: "Kyle has a paid Cloudflare account. Edge-native D1 (SQLite) is included in paid plan with <50ms query targets. Workers + Pages = serverless global edge with no cold start. R2 for artifact storage. TanStack Query for server state. 30-second polling is simpler than WebSockets for single-user DevOps dashboard. ~$35-50/month total vs higher Vercel cost at scale.",
      alternatives: "Vercel + Supabase (more familiar stack, higher cost), Encore.dev (backend POC but adds complexity)",
    },
    {
      id: "d14",
      decision: "FlashFusion --ff-primary (#8B5CF6) is UI-only — fails WCAG AA for body text",
      rationale: "Contrast ratio fails 4.5:1 AA threshold for body text. Text-safe alternatives: --ff-primary-light (#C4B5FD) and --ff-electric-light (#67E8F9). This constraint is locked into DESIGN.md and FLASHFUSION_STATUS.MD project knowledge and must not be overridden in any future UI generation.",
      alternatives: "None — this is a compliance rule, not a preference",
    },
    {
      id: "d15",
      decision: "'Accolade' is permanently blacklisted as a fabricated client name — never use it",
      rationale: "Name was invented in a prior session. No metrics, quotes, timelines, or narratives may be fabricated for any client. Only publicly documented facts may be used.",
      alternatives: "None — hard rule, no exceptions",
    },
    {
      id: "d16",
      decision: "75-90 vibecoded prototypes are unfinished tools for learning/personal use — not failed projects",
      rationale: "Kyle built these (Base44, Lovable, Bolt.new, v0, Replit) to solve personal problems and learn. They are not abandoned or dead. Kyle is confident they can be rebuilt for production given skills progress. Sequential audit protocol: evaluate one at a time — Electron conversion vs web vs discontinue. Do not frame as failures.",
      alternatives: "None — framing rule",
    },
  ],
  openThreads: [
    {
      id: "t1",
      thread: "Agentic / Multi-Agent System template",
      priority: "high",
      context: "Highest-leverage next Beta Tester Army template. Ground in project knowledge: orchestrator/worker patterns, HITL controls, context rot (95% threshold), T-Mux observability, zombie agent risk, adversarial researcher/fact-checker pairing. Personas: Skeptical Enterprise Architect, Vibe Coder Who Broke Prod, Security-First DevOps Lead, New Renaissance Developer, Budget-Conscious CTO.",
      nextAction: "Build in next project session using this capsule as context",
    },
    {
      id: "t2",
      thread: "Claude Code / Dev Tool template variant",
      priority: "medium",
      context: "More specific than the generic API template. Should cover: Skills (progressive disclosure, SKILL.md structure), subagent architecture (isolated context windows, task vs. role), MCP integration patterns, CLAUDE.md setup, ACI design principles.",
      nextAction: "Build after Agentic template",
    },
    {
      id: "t3",
      thread: "Flash-n-Frame integration path",
      priority: "medium",
      context: "Beta Tester Army was built for Flash-n-Frame's 10 persona user flows. The template + export system makes this portable as a Flash-n-Frame feature or standalone AIaaS tool. API key structure already designed (Anthropic/OpenAI passthrough).",
      nextAction: "Evaluate as Flash-n-Frame v4.x feature after standalone validation",
    },
    {
      id: "t4",
      thread: "Context capsule as recurring workflow",
      priority: "high",
      context: "This tool itself should become a habit: generate capsule before every project migration. Each hop the capsule gets richer. By project 3-4 it becomes a living architecture brief any Claude instance can cold-start from.",
      nextAction: "Use this capsule immediately. Refine schema after next migration.",
    },
    {
      id: "t5",
      thread: "FreshService Ticket Updater — production QA + deployment",
      priority: "high",
      context: "Full spec delivered (FS_Ticket_Updater_Deliverables.md). Needs: (1) QA in staging with dry_run=true against real Freshservice tenant, (2) service account provisioned with correct permissions, (3) Frontier Computer Use access confirmed, (4) duplicate_check_window set to 24h for testing → 1h for production, (5) idempotency key formula wired in Copilot Studio as Custom Value/formula. Not deployed yet — spec only.",
      nextAction: "Provision service account. Run dry_run QA pass. Flip dry_run=false after QA sign-off.",
    },
    {
      id: "t6",
      thread: "Copilot Studio Flow artifact — further hardening",
      priority: "medium",
      context: "CopilotStudioFlow.jsx is the agent build workflow visualizer. Current state: 14-node flow with detail/AI/notes/progress/config tabs, bypass support, org config fields. Gaps: no export of completed checklist as PDF/JSON, no multi-agent topology support (child agents vs. connected agents decision node), no licensing calculator integration.",
      nextAction: "Add export-checklist functionality. Add A2A / multi-agent decision node after Tools step.",
    },
    {
      id: "t7",
      thread: "Azure AI Foundry Explorer — v13 iteration",
      priority: "medium",
      context: "v12 shipped. Known gaps from user testing: Access Kit checklist incomplete for gov/GCC tenants, Persona switcher sometimes loses state on section navigation, DEMO mode doesn't suppress the Settings gear icon entirely. Also: Azure AI Foundry has released new features (prompt flows, model catalog updates) since v12 was locked.",
      nextAction: "Collect feedback from 2-3 MSP users. Patch state bug. Update model catalog section for post-v12 releases.",
    },
    {
      id: "t8",
      thread: "Computer Use expansion — ticket creation + ticket search",
      priority: "medium",
      context: "FS_Ticket_Updater covers updates only. Parallel tools needed: (1) FreshService Ticket Creator (new ticket from Copilot conversation), (2) FreshService Ticket Searcher (find tickets by keyword/status/requester for context retrieval). Same safety pattern: dry_run flag, idempotency key, approval gate for creation.",
      nextAction: "Clone Ticket Updater spec. Adapt Computer Use instructions for create and search flows. Same 30-input schema pattern.",
    },
    {
      id: "t10",
      thread: "73-page Comprehensive Prompt Engineering Taxonomy — integrate into toolkit",
      priority: "low",
      context: "Full 73-page academic taxonomy exists at Google Drive ID: 1zj1x82w_TEJanhvQfroMgsPAsDrTpLX-oT5O9PtgWXo. Contents: prompt framework analysis (R-T-F, RISE, ROSE, COSTAR), atomic instruction components, universal best practices, advanced reasoning patterns, QA mechanisms, production deployment patterns. Excluded from project due to size limits. Not yet integrated into the 23-technique quick reference or templates library.",
      nextAction: "Fetch from Drive. Extract atomic components table. Merge non-duplicate patterns into 23-technique library. Check if any of 24 removed techniques are redeemed by academic evidence.",
    },
    {
      id: "t11",
      thread: "Azure AI Foundry model connector — integrate into Foundry Explorer v13",
      priority: "medium",
      context: "Copilot Studio now supports BYO model from Azure AI Foundry (GPT-4.5, Llama, DeepSeek + 1,800+ model catalog). Model added to Studio prompt tool via Azure AI Foundry connector (Power Platform admin center). Governance policy set per connector. Azure AI Foundry Explorer v12 predates this feature — current model section only covers GPT-4.1 / GPT-5 family. Explorer should demonstrate Azure AI Foundry connector path for clients who want open-source or vertical-specific models.",
      nextAction: "Add 'BYOM from Azure AI Foundry' section to Explorer v13. Include model connector setup flow. Highlight DeepSeek/Llama as alternatives to GPT for cost-sensitive deployments.",
    },
    {
      id: "t9",
      thread: "PA_Flow_Build_Guide — Power Automate flow build guide review",
      priority: "low",
      context: "PA_Flow_Build_Guide.docx exists in project. Not reviewed in this session. Unknown whether it represents a built deliverable or reference material. Content and status unclear.",
      nextAction: "Read PA_Flow_Build_Guide.docx. Classify as built artifact or reference. If built, add to capsule.",
    },
    {
      id: "t12",
      thread: "PROJECT NEXUS — actual build (7-prompt chain exists, execution pending)",
      priority: "high",
      context: "Full 7-prompt chain delivered (PROJECT_NEXUS__Complete_7-Prompt_Chain.md in project files). Architecture decided: Cloudflare Pages + Workers + D1 + R2. Build time: 12-15 hours. Cost: ~$35-50/month. Not yet executed — prompts only. Sequential execution: Prompt 1 (D1 schema) → Prompt 2 (ProjectCard) → Prompt 3 (test suite) → Prompt 4 (log analyzer) → Prompt 5 (CI/CD dashboard) → Prompt 6 (file organizer) → Prompt 7 (Lovable master prompt).",
      nextAction: "Schedule 12-15 hour focused sprint. Execute prompts sequentially. Start with wrangler d1 create nexus-db.",
    },
    {
      id: "t13",
      thread: "UMPG v4.0 platform decision — Encore.dev POC vs Cloudflare Durable Objects production",
      priority: "high",
      context: "Two valid paths: (A) Encore.dev — rapid prototype, TypeScript native, built-in service discovery, faster to POC; (B) Cloudflare Durable Objects — cost-optimized production, edge-native, state persistence per workflow instance, ~$0.08/run target. State persistence strategy for multi-turn workflows is undefined. Recommendation from prior session: Encore.dev for POC → migrate to Durable Objects for production. Nexus Copilot Base44 app is the current implementation surface (appId: 6953593fa0363e206cad4944).",
      nextAction: "Make explicit platform decision. Define state schema for multi-turn Plan-Execute-Refine workflow before next implementation sprint.",
    },
    {
      id: "t14",
      thread: "75-90 vibecoded prototypes — sequential audit",
      priority: "medium",
      context: "Portfolio of unfinished tools across Base44, Lovable, Bolt.new, v0, Replit. Not failures — built for learning and personal problem-solving. Audit protocol: one app at a time. Decision per app: (A) Electron conversion for desktop distribution, (B) web deployment on Vercel/Cloudflare, (C) discontinue. No batch audits — each app deserves individual evaluation against current production stack (React 19, Vite, TypeScript, Tailwind, Supabase, Cloudflare Workers).",
      nextAction: "List all 75-90 apps. Start with highest personal utility. One audit session per app.",
    },
    {
      id: "t15",
      thread: "WSL/Docker C: drive space — docker_data.vhdx compact pending",
      priority: "low",
      context: "docker_data.vhdx identified at C:\\Users\\kyler\\AppData\\Local\\Docker\\wsl\\disk\\docker_data.vhdx consuming 41.67 GB. Fix identified: diskpart compact vhdx. Process was identified during the D: drive recovery session but not completed (external drive emergency took priority). WSL2 running Ubuntu + docker-desktop distros. C: drive space issue may still be pending.",
      nextAction: "Open diskpart as admin. Run: select vdisk file='C:\\Users\\kyler\\AppData\\Local\\Docker\\wsl\\disk\\docker_data.vhdx' → attach vdisk readonly → compact vdisk → detach vdisk. Verify C: space recovered.",
    },
    {
      id: "t16",
      thread: "VISTADEL — public/community tier vs monetized product",
      priority: "medium",
      context: "VISTADEL is Kyle's self-built 8-phase app development methodology. Currently live as Express/EJS Replit site. Open questions: Does it become a public open-source framework? A paid product? Phase gates are quantitative (V≥30 through L≥70) and the phase-gate audit CLI is the scoring tool. Kyle's own creation, not yet formally launched.",
      nextAction: "Decide lane: public community vs monetized product.",
    },
    {
      id: "t17",
      thread: "Context Capsule search — wire sendPrompt() callback for real chat searches",
      priority: "low",
      context: "Context Capsule has a Search panel with 4 scopes: Capsule (client-side), Drive (MCP), Notion (MCP), Chats (architectural ceiling — native conversation search not exposable via MCP URL from browser artifact). The Chats scope currently uses claude-sonnet API routed through Notion MCP with noted limitation. Fix: wire sendPrompt() callback so Search button fires real chat search back into Claude session instead of API proxy.",
      nextAction: "Add sendPrompt('conversation_search: [query]') callback in Chats scope result handler.",
    },
  ],
  projectKnowledge: [
    {
      id: "k1",
      file: "vibe working & multi-agent orchestration docs (multiple)",
      relevance: "high",
      keyInsights: "Vibe Working = outcome-based orchestration vs task-based prompting. Human role shifts to Judgment + Taste. Agent swarm architecture: Lead Agent → Specialist Agents → Shared Task List. T-Mux swim lanes for observability. HITL as primary governance layer.",
      usedFor: "Informed Agentic template design strategy",
    },
    {
      id: "k2",
      file: "claude-skills-architecture-and-implementation-road-20260302.md",
      relevance: "high",
      keyInsights: "Skills = reusable instruction manuals. Progressive disclosure = only name+description in context until skill invoked. Stackable. Portability across workspace. .skll file format.",
      usedFor: "Claude Code template variant planning",
    },
    {
      id: "k3",
      file: "a-technical-analysis-of-claude-code-extensibility-20260302.docx",
      relevance: "high",
      keyInsights: "Sub-agents: isolated context windows, unique system prompts, specific tool permissions. Task vs. Role distinction critical. Context window pollution prevention. MCP integrations: Supabase, Chrome DevTools, Playwright, Stripe.",
      usedFor: "Agentic template persona and flow design",
    },
    {
      id: "k4",
      file: "technical-governance-framework-enterprise-agentic-20260302.docx",
      relevance: "medium",
      keyInsights: "Core Four: Context, Model, Tools, Safety. MRCV2 score: Opus 4.6 at 76% retrieval @ 1M tokens. Renaissance Developer archetype. 12-hour sandbox lifespan. Zombie agent fiscal risk.",
      usedFor: "Agentic template scoring rubric dimensions",
    },
    {
      id: "k5",
      file: "copilot-studio-project-instructions.md",
      relevance: "high",
      keyInsights: "Hard limits: 500 files/agent, 25 websites (generative) / 4 websites (classic), 5 concurrent sources at runtime, 500 total knowledge objects. File sizes: <7MB without M365 Copilot license, up to 512MB with. Auth: Sites.Read.All + Files.Read.All scopes. SharePoint: modern pages only, no encrypted files. Dataverse: 2 sources max, 15 tables each. Trigger billing: each delivery = 1 message. Agent 365: IT control plane (launched Nov 18 2025, Frontier). Model defaults: GPT-4.1 (Oct 2025), GPT-5.x in preview. Performance degrades at 30-40 tool/topic combos → split into child agents.",
      usedFor: "Every architecture decision in CopilotStudioFlow.jsx and FS_Ticket_Updater. Knowledge source constraints, auth requirements, trigger safety rules.",
    },
    {
      id: "k6",
      file: "COPILOT-STUDIO-REFERENCE-INDEX.md",
      relevance: "high",
      keyInsights: "Curated doc index (May 2026). ⭐⭐⭐ items: add-knowledge-to-an-agent, publish-agent-fails-due-to-bing-sources (classic 4-site limit), Orchestrate_With_Agentic_AI (generative vs. classic comparison), Add_Tools_To_agents (all tool types), Adding_Other_Agents (child vs. connected, A2A protocol preview), manage-topics, use-system-topics, variables-overview, work-with-global-variables, audit-copilot-studio-activities-in, configure-data-policies-for-agents.",
      usedFor: "Navigation during CopilotStudioFlow build. Troubleshooting reference during tool configuration.",
    },
    {
      id: "k7",
      file: "security-patterns-complete-guide.md",
      relevance: "high",
      keyInsights: "OWASP Top 10 (2023) TypeScript patterns with Zod schemas. A01: RBAC with typed permissions. A02: password hashing (bcrypt/Argon2). A03: parameterized queries. A07: auth patterns. Prompt injection defense: input sanitization + output validation + context isolation. All patterns include test cases. Production-ready — not toy examples.",
      usedFor: "Security hardening node in CopilotStudioFlow. Reference for Computer Use tool input validation design.",
    },
    {
      id: "k8",
      file: "qa-master-guide.md",
      relevance: "medium",
      keyInsights: "QA workflows using AI. Universal test prompt template (Jest/Vitest/Playwright/Cypress). Test generation for functions, APIs, components. E2E testing patterns. OWASP compliance test prompts. Input validation test cases. Coverage target: 90%+. AI-assisted test generation reduces manual QA time significantly.",
      usedFor: "QA plan for FreshService Ticket Updater. Test case generation strategy for Computer Use tools.",
    },
    {
      id: "k9",
      file: "23-core-techniques-quick-reference.md / technique-use-cases-complete.md / prompt-templates-library.md / evidence-base-citations.md / QUICK-REFERENCE.md / testing-complete-guide.md",
      relevance: "medium",
      keyInsights: "23 evidence-based techniques with ROI table: CoT +40-50% (2-3x tokens), Few-Shot +30-40% (1.5-2x), Schema Prompting +50-60% (1.2x), RAG/Grounding +40-60% (1.5x), Self-Eval +25-35% (2x). Best stacks: Code Gen = Persona+Schema+CoT+Self-Eval; Research = Grounding+Citations+Comparative+Self-Eval; Content = Few-Shot+Tone+Length. Anti-patterns per technique documented (e.g., Persona overhead wastes tokens on simple factual queries). technique-use-cases-complete.md = full ROI analysis + failure modes for all 23. testing-complete-guide.md = production Vitest config (80% coverage thresholds), Jest, Playwright E2E with AI-assisted test generation prompts. Emergency troubleshooting: AI ignores instructions → RTF; inconsistent outputs → Few-Shot examples; confidently wrong → Boundary+Self-Eval; token explosion → Modular.",
      usedFor: "Meta Template Generator for Beta Tester Army. Cursor AI 16-prompt system design. Agent instruction authoring. Test generation for FS Ticket Updater and Computer Use tools.",
    },
    {
      id: "k10",
      file: "Adding_Other_Agents + Orchestrate_With_Agentic_AI + Add_Tools_To_agents",
      relevance: "high",
      keyInsights: "Child agents vs. connected agents: child = inline execution in parent conversation, connected = separate agent call with context handoff. A2A protocol (preview): agent-to-agent communication standard. Performance threshold: 30-40 tool/topic combos before degradation — split at that point. Tool types: connectors, prebuilt connectors, agent flows, prompts, REST API, MCP, Computer Use. Trigger condition description = most critical field in generative orchestration (vague = wrong tool called).",
      usedFor: "Multi-agent architecture decisions in CopilotStudioFlow. FreshService tool design. Generative vs. classic orchestration selection rationale.",
    },
    {
      id: "k11",
      file: "Agent_Graph_Studio.tsx + GraphProvider___Client_SDK.txt + orchestrator-flow.jsx (in project files)",
      relevance: "high",
      keyInsights: "Agent Graph Studio: 4 node type presets (FlashFusion Pipeline, Simple 3-Node), SECURITY_GROUPS array (Core Platform/Dev Agents/Infrastructure/Security Boundary with sensitivity ratings), intelligence layer scoring (severity = status weight + latency + errors + security sensitivity; ROI = cost burden + throughput risk + severity; priority = composite + node degree centrality). GraphProvider pattern: SupabaseGraphProvider (PROD) / MockGraphProvider (DEV) — switch via import.meta.env.PROD. Share link flow: getUserQuota() → check sharingEnabled → createShareLink(id, 24hrs). Realtime: subscribeLiveUpdates() returns unsubscribe function — call in useEffect cleanup. orchestrator-flow.jsx: 14-node Copilot Studio build flow (same flow pattern, different domain).",
      usedFor: "Agent Graph Studio production deployment. Intelligence layer scoring rubric for Agentic template in Beta Tester Army.",
    },
    {
      id: "k12",
      file: "VISTADEL framework — 8 phase docs + audit CLI pattern",
      relevance: "medium",
      keyInsights: "Phase structure: Vision (V≥30), Integration (I security≥40), Stack (S quality≥50), Testing (T coverage≥40), AI Implementation (A production≥50), Deployment (D target≥60), Evolution (E all≥60 avg), Launch (L overall≥70). Each phase: tagline, scope, phase gate, 5 steps, checklist, common failures, AI Your BI℠ section. Scoring tool: phase-gate audit CLI. Mixed voice: first person for intro ('I'm building this as I go'), neutral for methodology sections. 'Accolade' permanently removed from all VISTADEL content.",
      usedFor: "VISTADEL Replit site content. Phase gate scoring reference for any app project.",
    },
    {
      id: "k13",
      file: "FlashFusion DESIGN.md + FLASHFUSION_STATUS.MD (project knowledge uploads)",
      relevance: "high",
      keyInsights: "Design system: neon-glass dark-mode, void/electric violet palette. Locked tokens: --ff-void #0A0A0F, --ff-deep #141328, --ff-primary #8B5CF6 (UI only — fails AA for body text), --ff-primary-light #C4B5FD (text-safe), --ff-electric #06B6D4, --ff-electric-light #67E8F9 (text-safe), --ff-glow #A855F7, --ff-text #F8FAFC. Typography: Poppins 800/900 display, Inter 400-700 body. Three separate brands: FlashFusion (neon-glass), chaosclub.co (dark editorial 'Reading Room at Midnight'), kylerosebrook.com (monochromatic dark cinematic: #FFFFFF/#EEEEEE/#BBBBBB/#1E1E1E/#000000). FLASHFUSION_STATUS.MD: prevents hallucinated recommendations — live production stack is Base44 (app ID 68dd8e79ca073475565c8e16, ~101 entities), n8n at krosebrook.app.n8n.cloud, Wix (20 products, 10 collections), Stripe, Cloudflare R2, PostHog, Supabase, multi-provider LLM routing (Claude, Gemini, ChatGPT). No duplicate Next.js MVP scaffolding — already live.",
      usedFor: "All FlashFusion UI generation and design decisions. Prevents AI hallucinating incorrect stack. Color compliance for WCAG AA.",
    },
    {
      id: "k14",
      file: "MCP Ecosystem Audit + Platform Lane Map",
      relevance: "high",
      keyInsights: "57 total MCP connections (not 240+, not 13). Three-lane automation architecture: n8n Cloud (internal/self-hosted only — SUL restriction), Make.com (Customization Service + client-facing monetized), Zapier (connector hub for Gmail/GCal/GitHub/Notion/M365/OpenAI without native MCPs). Dead-weight servers disconnected: Wix, Invideo, monday.com, Explorium. Zapier actions overlapping with native MCPs identified (~88 actions). Sentry + Stripe confirmed enabled. Stytch removed. Claude Desktop MCP stdio servers require full absolute paths (not bare npx) — minimal inherited environment on launch.",
      usedFor: "MCP server configuration decisions. Automation platform selection. Tool count accuracy (never inflate above actual ~40 hands-on tools).",
    },
    {
      id: "k15",
      file: "PROJECT_NEXUS__Complete_7-Prompt_Chain.md (in project files)",
      relevance: "high",
      keyInsights: "7-prompt sequential build for Cloudflare-native DevOps dashboard. Key decisions table: D1 (edge-native SQLite), Workers (serverless global edge), React+TypeScript (Lovable native support), shadcn/ui (production-ready Tailwind), TanStack Query (server state caching), GitHub Actions (native CI/CD free tier), OpenAI GPT-4 temp=0 for deterministic testing, Claude API for file context understanding. 9 D1 tables: projects, context_snapshots, prompt_test_baselines, prompt_test_results, alert_rules, alerts, file_moves, user_preferences, deployment_logs. Real-time via 30-second polling (not WebSockets — simpler for single-user). Slack webhooks for alerts. All Workers use Cloudflare environment variables — never hardcode API keys.",
      usedFor: "PROJECT NEXUS execution. Architecture reference for Cloudflare-native builds. Prompt chain template for future multi-component builds.",
    },
  ],
  tags: ["beta-tester-army", "flash-n-frame", "template-system", "agentic", "vibe-working", "claude-code", "migration-infrastructure", "copilot-studio", "computer-use", "freshservice", "azure-ai-foundry", "prompt-engineering", "enterprise-agent", "frontier", "multi-agent", "umpg-v4", "project-nexus", "agent-graph-studio", "vistadel", "zero-g-orchestrator", "mcp-audit", "make-migration", "flashfusion", "three-js", "cloudflare-workers", "antigravity-ide"],
};

// ── COMPONENTS ──────────────────────────────────────────────────────────────
function SectionHeader({ icon, label, count }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
      <span style={{ fontSize:16 }}>{icon}</span>
      <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#e2e8f0", fontSize:15 }}>{label}</span>
      {count !== undefined && (
        <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"#1e293b", color:"#475569", fontFamily:"'Space Mono',monospace" }}>{count}</span>
      )}
    </div>
  );
}

function PriorityBadge({ p }) {
  const c = p==="high"?"#ef4444":p==="medium"?"#f59e0b":"#22d3ee";
  return <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:c+"22", color:c, border:`1px solid ${c}44`, fontFamily:"'Space Mono',monospace" }}>{p}</span>;
}

function StatusBadge({ s }) {
  const c = s==="shipped"?"#10b981":s==="in-progress"?"#22d3ee":"#6366f1";
  return <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:c+"22", color:c, fontFamily:"'Space Mono',monospace" }}>{s}</span>;
}

function EditableText({ value, onChange, rows=2, mono=false, placeholder="" }) {
  return (
    <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder}
      style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:6,
        padding:"8px 10px", color:"#94a3b8", fontSize:12, lineHeight:1.6, resize:"vertical",
        fontFamily:mono?"'Space Mono',monospace":"'Syne',sans-serif", transition:"border-color .2s" }}
    />
  );
}

// ── MAIN ────────────────────────────────────────────────────────────────────
export default function ContextCapsule() {
  const [capsule, setCapsule] = useState(SESSION_SEED);
  const [activeSection, setActiveSection] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);
  const [primerGenerated, setPrimerGenerated] = useState(false);
  const [generatingPrimer, setGeneratingPrimer] = useState(false);

  function update(path, value) {
    setCapsule(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = next;
      for (let i=0;i<keys.length-1;i++) obj=obj[keys[i]];
      obj[keys[keys.length-1]] = value;
      return next;
    });
  }

  function updateArrayItem(arr, id, field, value) {
    setCapsule(prev => ({
      ...prev,
      [arr]: prev[arr].map(item => item.id===id ? {...item,[field]:value} : item)
    }));
  }

  function addItem(arr, template) {
    setCapsule(prev => ({ ...prev, [arr]: [...prev[arr], { ...template, id: arr[0]+Date.now() }] }));
  }

  function removeItem(arr, id) {
    setCapsule(prev => ({ ...prev, [arr]: prev[arr].filter(i=>i.id!==id) }));
  }

  function addTag(tag) {
    if (tag && !capsule.tags.includes(tag)) {
      setCapsule(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  }

  function removeTag(tag) {
    setCapsule(prev => ({ ...prev, tags: prev.tags.filter(t=>t!==tag) }));
  }

  async function generatePrimer() {
    setGeneratingPrimer(true);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{ role:"user", content:
            `You are writing a cold-start primer for the NEXT Claude instance that will receive this session handoff.

Write a dense, efficient 150-200 word primer that:
1. Establishes what was built and the current state
2. Flags the most important open thread to execute first
3. Lists 3 specific things Claude should do proactively in the new session
4. Notes any key constraints or decisions NOT to re-litigate

Session built: ${capsule.built.map(b=>b.name+": "+b.description).join(" | ")}
Key decisions: ${capsule.decisions.map(d=>d.decision).join(" | ")}
Top open thread: ${capsule.openThreads.filter(t=>t.priority==="high").map(t=>t.thread+": "+t.context).join(" | ")}
Tags: ${capsule.tags.join(", ")}

Write as a direct instruction to the next Claude instance. Terse, no filler.`
          }]
        })
      });
      const d = await r.json();
      const txt = d.content?.filter(b=>b.type==="text").map(b=>b.text).join("") || "";
      update("nextSessionPrimer", txt);
      setPrimerGenerated(true);
    } catch(e) {
      update("nextSessionPrimer", "Failed to generate — write manually.");
    }
    setGeneratingPrimer(false);
  }

  function exportJSON() {
    const payload = {
      ...capsule,
      meta: { ...capsule.meta, exportedAt: new Date().toISOString(), schema: "context-capsule-v1" }
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `context-capsule-${capsule.meta.sessionTitle.slice(0,30).replace(/\s+/g,"-").toLowerCase()}-${capsule.meta.date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(()=>setExported(false), 2000);
  }

  function copyJSON() {
    const payload = { ...capsule, meta: { ...capsule.meta, exportedAt: new Date().toISOString(), schema: "context-capsule-v1" } };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  }

  const NAV = [
    { id:"overview", label:"Overview", icon:"◈" },
    { id:"built", label:"Built", icon:"📦", count: capsule.built.length },
    { id:"decisions", label:"Decisions", icon:"⚖️", count: capsule.decisions.length },
    { id:"threads", label:"Open Threads", icon:"🧵", count: capsule.openThreads.length },
    { id:"knowledge", label:"Project Knowledge", icon:"📚", count: capsule.projectKnowledge.length },
    { id:"primer", label:"Next Session Primer", icon:"🚀" },
    { id:"export", label:"Export", icon:"⬇" },
  ];

  const completeness = [
    capsule.meta.sessionTitle,
    capsule.meta.destinationProject,
    capsule.built.length > 0,
    capsule.decisions.length > 0,
    capsule.openThreads.length > 0,
    capsule.nextSessionPrimer,
  ].filter(Boolean).length;

  const pct = Math.round((completeness / 6) * 100);

  // ── LAYOUT ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight:"100vh", background:"#020817", fontFamily:"'Syne',sans-serif", color:"#e2e8f0",
        display:"flex", flexDirection:"column",
        backgroundImage:"radial-gradient(#0d1525 1px, transparent 1px)", backgroundSize:"24px 24px" }}>

        {/* Top Bar */}
        <div style={{ padding:"12px 20px", borderBottom:"1px solid #1a2744", background:"#030912cc",
          backdropFilter:"blur(8px)", position:"sticky", top:0, zIndex:100,
          display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0 }}>
            <div style={{ fontSize:10, letterSpacing:3, color:"#6366f1", fontFamily:"'Space Mono',monospace", flexShrink:0 }}>◈ CAPSULE</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#e2e8f0", fontSize:14, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
              {capsule.meta.sessionTitle || "Untitled Session"}
            </div>
          </div>
          {/* Completeness */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <div style={{ width:80, height:3, background:"#1e293b", borderRadius:2 }}>
              <div style={{ width:`${pct}%`, height:"100%", background: pct===100?"#10b981":"#6366f1", borderRadius:2, transition:"width .4s ease" }}/>
            </div>
            <span style={{ fontSize:10, color: pct===100?"#10b981":"#475569", fontFamily:"'Space Mono',monospace" }}>{pct}%</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button className="btn" onClick={copyJSON} style={{ background:"transparent", border:"1px solid #1e293b", borderRadius:7, padding:"6px 12px", color: copied?"#10b981":"#64748b", cursor:"pointer", fontSize:11, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
              {copied ? "✓ copied" : "⎘ copy"}
            </button>
            <button className="btn" onClick={exportJSON} style={{ background: exported?"#10b98122":"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", borderRadius:7, padding:"6px 14px", color: exported?"#10b981":"#fff", cursor:"pointer", fontSize:11, fontFamily:"'Syne',sans-serif", fontWeight:700, transition:"all .2s" }}>
              {exported ? "✓ exported" : "⬇ Export JSON"}
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          {/* Sidebar */}
          <div style={{ width:180, flexShrink:0, borderRight:"1px solid #0d1525", padding:"16px 12px", display:"flex", flexDirection:"column", gap:2 }}>
            {NAV.map(n => (
              <button key={n.id} onClick={()=>setActiveSection(n.id)} style={{
                display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8,
                background: activeSection===n.id ? "#1e293b" : "transparent",
                border:`1px solid ${activeSection===n.id?"#6366f133":"transparent"}`,
                color: activeSection===n.id ? "#e2e8f0" : "#475569",
                cursor:"pointer", fontSize:12, fontFamily:"'Syne',sans-serif",
                fontWeight: activeSection===n.id ? 600 : 400, transition:"all .15s", textAlign:"left"
              }}>
                <span style={{ fontSize:13 }}>{n.icon}</span>
                <span style={{ flex:1 }}>{n.label}</span>
                {n.count !== undefined && <span style={{ fontSize:9, color:"#334155", fontFamily:"'Space Mono',monospace" }}>{n.count}</span>}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex:1, overflow:"auto", padding:"24px 28px", animation:"fadeUp .3s ease" }}>

            {/* ── OVERVIEW ── */}
            {activeSection==="overview" && (
              <div style={{ maxWidth:640 }}>
                <SectionHeader icon="◈" label="Session Overview"/>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {[
                    { label:"SESSION TITLE", key:"meta.sessionTitle", placeholder:"e.g. Beta Tester Army — Build + Template System" },
                    { label:"SOURCE PROJECT", key:"meta.sourceProject", placeholder:"Where this session took place" },
                    { label:"DESTINATION PROJECT", key:"meta.destinationProject", placeholder:"Where you're migrating next →" },
                  ].map(f => (
                    <div key={f.key} className="field-card" style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"14px 16px", transition:"border-color .2s" }}>
                      <label style={{ display:"block", fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", letterSpacing:1, marginBottom:8 }}>{f.label}</label>
                      <input value={f.key.split(".").reduce((o,k)=>o[k],capsule)} onChange={e=>update(f.key,e.target.value)}
                        placeholder={f.placeholder}
                        style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:6, padding:"8px 10px", color:"#e2e8f0", fontSize:13, fontFamily:"'Syne',sans-serif", transition:"border-color .2s" }}
                      />
                    </div>
                  ))}
                  {/* Tags */}
                  <div className="field-card" style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"14px 16px", transition:"border-color .2s" }}>
                    <label style={{ display:"block", fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", letterSpacing:1, marginBottom:10 }}>TAGS</label>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                      {capsule.tags.map(tag => (
                        <span key={tag} className="tag-pill" onClick={()=>removeTag(tag)} title="click to remove"
                          style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:"#1a2744", color:"#64748b", cursor:"pointer", border:"1px solid #1e293b", transition:"all .15s" }}>
                          #{tag} ×
                        </span>
                      ))}
                    </div>
                    <input placeholder="Add tag + Enter" onKeyDown={e=>{ if(e.key==="Enter"){ addTag(e.target.value.trim().replace(/\s+/g,"-").toLowerCase()); e.target.value=""; }}}
                      style={{ background:"#080e1c", border:"1px solid #1a2744", borderRadius:6, padding:"6px 10px", color:"#64748b", fontSize:12, fontFamily:"'Space Mono',monospace", width:160, transition:"border-color .2s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── BUILT ── */}
            {activeSection==="built" && (
              <div style={{ maxWidth:680 }}>
                <SectionHeader icon="📦" label="What Was Built" count={capsule.built.length}/>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {capsule.built.map(item => (
                    <div key={item.id} style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"16px 18px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <input value={item.name} onChange={e=>updateArrayItem("built",item.id,"name",e.target.value)}
                          style={{ flex:1, background:"transparent", border:"none", color:"#e2e8f0", fontSize:14, fontFamily:"'Syne',sans-serif", fontWeight:700 }}/>
                        <StatusBadge s={item.status}/>
                        <button onClick={()=>removeItem("built",item.id)} style={{ background:"transparent", border:"none", color:"#334155", cursor:"pointer", fontSize:14 }}>×</button>
                      </div>
                      <div style={{ display:"flex", gap:10, marginBottom:10 }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>TYPE</div>
                          <input value={item.type} onChange={e=>updateArrayItem("built",item.id,"type",e.target.value)}
                            style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:5, padding:"5px 8px", color:"#64748b", fontSize:11, fontFamily:"'Space Mono',monospace" }}/>
                        </div>
                        <div style={{ flex:2 }}>
                          <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>FILE / ARTIFACT</div>
                          <input value={item.file} onChange={e=>updateArrayItem("built",item.id,"file",e.target.value)}
                            style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:5, padding:"5px 8px", color:"#64748b", fontSize:11, fontFamily:"'Space Mono',monospace" }}/>
                        </div>
                      </div>
                      <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>DESCRIPTION</div>
                      <EditableText value={item.description} rows={3} onChange={v=>updateArrayItem("built",item.id,"description",v)}/>
                    </div>
                  ))}
                  <button className="btn" onClick={()=>addItem("built",{ name:"New Item", type:"artifact", file:"", description:"", status:"in-progress" })}
                    style={{ background:"transparent", border:"1px dashed #1e293b", borderRadius:10, padding:"12px", color:"#334155", cursor:"pointer", fontSize:12, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
                    + add item
                  </button>
                </div>
              </div>
            )}

            {/* ── DECISIONS ── */}
            {activeSection==="decisions" && (
              <div style={{ maxWidth:680 }}>
                <SectionHeader icon="⚖️" label="Key Decisions" count={capsule.decisions.length}/>
                <div style={{ fontSize:12, color:"#334155", marginBottom:14, fontFamily:"'Space Mono',monospace" }}>
                  Decisions not to re-litigate in the next session.
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {capsule.decisions.map(d => (
                    <div key={d.id} style={{ background:"#060c1a", border:"1px solid #0d1525", borderLeft:"3px solid #6366f1", borderRadius:10, padding:"16px 18px" }}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:10 }}>
                        <input value={d.decision} onChange={e=>updateArrayItem("decisions",d.id,"decision",e.target.value)}
                          style={{ flex:1, background:"transparent", border:"none", color:"#e2e8f0", fontSize:13, fontFamily:"'Syne',sans-serif", fontWeight:600 }}/>
                        <button onClick={()=>removeItem("decisions",d.id)} style={{ background:"transparent", border:"none", color:"#334155", cursor:"pointer", fontSize:14, flexShrink:0 }}>×</button>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                        <div>
                          <div style={{ fontSize:10, color:"#10b981", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>RATIONALE</div>
                          <EditableText value={d.rationale} rows={2} onChange={v=>updateArrayItem("decisions",d.id,"rationale",v)}/>
                        </div>
                        <div>
                          <div style={{ fontSize:10, color:"#f59e0b", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>ALTERNATIVES CONSIDERED</div>
                          <EditableText value={d.alternatives} rows={2} onChange={v=>updateArrayItem("decisions",d.id,"alternatives",v)}/>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="btn" onClick={()=>addItem("decisions",{ decision:"New Decision", rationale:"", alternatives:"" })}
                    style={{ background:"transparent", border:"1px dashed #1e293b", borderRadius:10, padding:"12px", color:"#334155", cursor:"pointer", fontSize:12, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
                    + add decision
                  </button>
                </div>
              </div>
            )}

            {/* ── OPEN THREADS ── */}
            {activeSection==="threads" && (
              <div style={{ maxWidth:680 }}>
                <SectionHeader icon="🧵" label="Open Threads" count={capsule.openThreads.length}/>
                <div style={{ fontSize:12, color:"#334155", marginBottom:14, fontFamily:"'Space Mono',monospace" }}>
                  What needs to happen in the next session. High priority = execute first.
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[...capsule.openThreads].sort((a,b)=>{ const o={high:0,medium:1,low:2}; return o[a.priority]-o[b.priority]; }).map(t => (
                    <div key={t.id} style={{ background:"#060c1a", border:"1px solid #0d1525", borderLeft:`3px solid ${t.priority==="high"?"#ef4444":t.priority==="medium"?"#f59e0b":"#22d3ee"}`, borderRadius:10, padding:"16px 18px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <input value={t.thread} onChange={e=>updateArrayItem("openThreads",t.id,"thread",e.target.value)}
                          style={{ flex:1, background:"transparent", border:"none", color:"#e2e8f0", fontSize:13, fontFamily:"'Syne',sans-serif", fontWeight:600 }}/>
                        <select value={t.priority} onChange={e=>updateArrayItem("openThreads",t.id,"priority",e.target.value)}
                          style={{ background:"#0d1425", border:"1px solid #1e293b", borderRadius:6, padding:"3px 8px", color:"#64748b", fontSize:11, cursor:"pointer" }}>
                          <option value="high">high</option>
                          <option value="medium">medium</option>
                          <option value="low">low</option>
                        </select>
                        <PriorityBadge p={t.priority}/>
                        <button onClick={()=>removeItem("openThreads",t.id)} style={{ background:"transparent", border:"none", color:"#334155", cursor:"pointer", fontSize:14 }}>×</button>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:10 }}>
                        <div>
                          <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>CONTEXT</div>
                          <EditableText value={t.context} rows={3} onChange={v=>updateArrayItem("openThreads",t.id,"context",v)}/>
                        </div>
                        <div>
                          <div style={{ fontSize:10, color:"#22d3ee", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>NEXT ACTION</div>
                          <EditableText value={t.nextAction} rows={3} onChange={v=>updateArrayItem("openThreads",t.id,"nextAction",v)}/>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="btn" onClick={()=>addItem("openThreads",{ thread:"New Thread", priority:"medium", context:"", nextAction:"" })}
                    style={{ background:"transparent", border:"1px dashed #1e293b", borderRadius:10, padding:"12px", color:"#334155", cursor:"pointer", fontSize:12, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
                    + add thread
                  </button>
                </div>
              </div>
            )}

            {/* ── PROJECT KNOWLEDGE ── */}
            {activeSection==="knowledge" && (
              <div style={{ maxWidth:680 }}>
                <SectionHeader icon="📚" label="Project Knowledge Used" count={capsule.projectKnowledge.length}/>
                <div style={{ fontSize:12, color:"#334155", marginBottom:14, fontFamily:"'Space Mono',monospace" }}>
                  Which files from the source project were most useful — so the next project can search for them.
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {capsule.projectKnowledge.map(k => (
                    <div key={k.id} style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"16px 18px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <input value={k.file} onChange={e=>updateArrayItem("projectKnowledge",k.id,"file",e.target.value)}
                          style={{ flex:1, background:"transparent", border:"none", color:"#94a3b8", fontSize:12, fontFamily:"'Space Mono',monospace" }}/>
                        <select value={k.relevance} onChange={e=>updateArrayItem("projectKnowledge",k.id,"relevance",e.target.value)}
                          style={{ background:"#0d1425", border:"1px solid #1e293b", borderRadius:6, padding:"3px 8px", color:"#64748b", fontSize:11, cursor:"pointer" }}>
                          <option value="high">high</option>
                          <option value="medium">medium</option>
                          <option value="low">low</option>
                        </select>
                        <button onClick={()=>removeItem("projectKnowledge",k.id)} style={{ background:"transparent", border:"none", color:"#334155", cursor:"pointer", fontSize:14 }}>×</button>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:10 }}>
                        <div>
                          <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>KEY INSIGHTS</div>
                          <EditableText value={k.keyInsights} rows={3} onChange={v=>updateArrayItem("projectKnowledge",k.id,"keyInsights",v)}/>
                        </div>
                        <div>
                          <div style={{ fontSize:10, color:"#6366f1", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>USED FOR</div>
                          <EditableText value={k.usedFor} rows={3} onChange={v=>updateArrayItem("projectKnowledge",k.id,"usedFor",v)}/>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="btn" onClick={()=>addItem("projectKnowledge",{ file:"", relevance:"medium", keyInsights:"", usedFor:"" })}
                    style={{ background:"transparent", border:"1px dashed #1e293b", borderRadius:10, padding:"12px", color:"#334155", cursor:"pointer", fontSize:12, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
                    + add file
                  </button>
                </div>
              </div>
            )}

            {/* ── PRIMER ── */}
            {activeSection==="primer" && (
              <div style={{ maxWidth:640 }}>
                <SectionHeader icon="🚀" label="Next Session Primer"/>
                <div style={{ fontSize:12, color:"#475569", marginBottom:16, lineHeight:1.6 }}>
                  A dense cold-start message for the next Claude instance. Paste this as your first message in the new project — it eliminates re-derivation of context.
                </div>
                <div style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"20px" }}>
                  {!capsule.nextSessionPrimer && !generatingPrimer && (
                    <div style={{ textAlign:"center", padding:"24px 0" }}>
                      <div style={{ color:"#334155", fontSize:13, marginBottom:16 }}>No primer generated yet.</div>
                      <button className="btn" onClick={generatePrimer}
                        style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", borderRadius:8, padding:"10px 20px", color:"#fff", cursor:"pointer", fontSize:13, fontFamily:"'Syne',sans-serif", fontWeight:700, transition:"all .2s" }}>
                        ✨ Generate AI Primer
                      </button>
                    </div>
                  )}
                  {generatingPrimer && (
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"20px 0", color:"#6366f1", fontSize:12, fontFamily:"'Space Mono',monospace" }}>
                      <div style={{ width:14, height:14, border:"2px solid #6366f133", borderTopColor:"#6366f1", borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
                      Synthesizing session context...
                    </div>
                  )}
                  {capsule.nextSessionPrimer && (
                    <>
                      <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:8, display:"flex", justifyContent:"space-between" }}>
                        <span>PRIMER TEXT {primerGenerated && <span style={{ color:"#10b981" }}>· AI GENERATED</span>}</span>
                        <button className="btn" onClick={generatePrimer} style={{ background:"transparent", border:"none", color:"#6366f1", cursor:"pointer", fontSize:10, fontFamily:"'Space Mono',monospace" }}>↺ regenerate</button>
                      </div>
                      <EditableText value={capsule.nextSessionPrimer} rows={10} onChange={v=>update("nextSessionPrimer",v)}
                        placeholder="Write or generate a cold-start primer for the next session..."/>
                      <button className="btn" onClick={()=>{ navigator.clipboard.writeText(capsule.nextSessionPrimer); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
                        style={{ marginTop:10, background:"transparent", border:"1px solid #1e293b", borderRadius:6, padding:"6px 14px", color:"#64748b", cursor:"pointer", fontSize:11, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
                        {copied?"✓ copied":"⎘ copy primer text"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── EXPORT ── */}
            {activeSection==="export" && (
              <div style={{ maxWidth:580 }}>
                <SectionHeader icon="⬇" label="Export Capsule"/>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[
                    { label:"JSON File", desc:"Full structured capsule. Import back into this tool or feed directly to Claude API / Flash-n-Frame.", action: exportJSON, btn:"⬇ Download JSON", color:"linear-gradient(135deg,#1d4ed8,#0ea5e9)" },
                    { label:"Copy to Clipboard", desc:"Paste directly into the next Claude session as context. Best combined with the primer text.", action: copyJSON, btn: copied?"✓ Copied":"⎘ Copy JSON", color:"linear-gradient(135deg,#4f46e5,#7c3aed)" },
                  ].map(opt => (
                    <div key={opt.label} style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"20px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
                      <div>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#e2e8f0", fontSize:14, marginBottom:4 }}>{opt.label}</div>
                        <div style={{ color:"#475569", fontSize:12, lineHeight:1.5 }}>{opt.desc}</div>
                      </div>
                      <button className="btn" onClick={opt.action} style={{ background:opt.color, border:"none", borderRadius:8, padding:"10px 18px", color:"#fff", cursor:"pointer", fontSize:12, fontFamily:"'Syne',sans-serif", fontWeight:700, flexShrink:0, transition:"all .2s" }}>
                        {opt.btn}
                      </button>
                    </div>
                  ))}

                  {/* Schema preview */}
                  <div style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"16px 18px" }}>
                    <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:10, letterSpacing:1 }}>JSON SCHEMA PREVIEW</div>
                    <pre style={{ color:"#475569", fontSize:11, lineHeight:1.6, fontFamily:"'Space Mono',monospace", overflow:"auto" }}>
{`{
  "meta": { sessionTitle, sourceProject, destinationProject, date, schema },
  "built": [{ name, type, file, description, status }],
  "decisions": [{ decision, rationale, alternatives }],
  "openThreads": [{ thread, priority, context, nextAction }],
  "projectKnowledge": [{ file, relevance, keyInsights, usedFor }],
  "nextSessionPrimer": "...",
  "tags": []
}`}
                    </pre>
                  </div>

                  {/* Migration checklist */}
                  <div style={{ background:"#031a0f", border:"1px solid #10b98133", borderRadius:10, padding:"16px 18px" }}>
                    <div style={{ fontSize:10, color:"#10b981", fontFamily:"'Space Mono',monospace", marginBottom:10 }}>MIGRATION CHECKLIST</div>
                    {[
                      "Session title filled in",
                      "Destination project named",
                      "All built artifacts documented",
                      "Key decisions recorded (don't re-litigate these)",
                      "Open threads prioritized",
                      "Primer generated and copied",
                      "JSON exported",
                    ].map((item, i) => {
                      const checks = [
                        !!capsule.meta.sessionTitle,
                        !!capsule.meta.destinationProject,
                        capsule.built.length > 0,
                        capsule.decisions.length > 0,
                        capsule.openThreads.length > 0,
                        !!capsule.nextSessionPrimer,
                        exported,
                      ];
                      return (
                        <div key={i} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                          <span style={{ color: checks[i] ? "#10b981" : "#1e293b", fontSize:12 }}>{checks[i]?"✓":"○"}</span>
                          <span style={{ color: checks[i] ? "#6ee7b7" : "#334155", fontSize:12 }}>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
