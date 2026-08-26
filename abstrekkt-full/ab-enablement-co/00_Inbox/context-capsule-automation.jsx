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
    sessionTitle: "AI Automation Consulting + n8n Platform — Multi-Session Build",
    sourceProject: "AI Workflow Automation Consulting (regulated industries) + krosebrook.app.n8n.cloud + ZMSC v2.2 packaging",
    destinationProject: "",
    date: new Date().toISOString().split("T")[0],
    version: "1.0",
    provenance: "Seed extracted from 35 second-order chat summaries + workspace memory on a 2026-06-09 baseline. Specifics (node counts, the 8.1/10 security score, $ ranges) are AS-REPORTED, not re-verified against live artifacts — the named source files (n8n_cloud_workflow.json, tiktok-sora2-automation.json) were not on disk this session. n8n MCP was NOT reachable when this capsule was built, so workflow counts (53 total / 41 inactive) are the 2026-06-09 audit figures and may have drifted. Re-run search_workflows limit:200 before acting on any count.",
  },
  built: [
    {
      id: "b1",
      name: "FlashFusion Lead Intake System",
      type: "n8n-workflow",
      file: "flashfusion-lead-intake (Notion + Supabase editions)",
      description: "Production lead-capture pipeline off a client contact form (a FlashFusion service build, client-agnostic and re-brandable per engagement). HMAC-SHA256 signature validation, input sanitization (XSS/SQLi), lead scoring 0-100 with hot/warm/cold classification, duplicate detection (24h window), HubSpot contact+deal creation, hot-lead email notifications, UTM tracking. Security raised 3.2/10 to 8.1/10 (87% risk reduction). GDPR 90-day retention. Ships in two editions: Notion-backed (low volume) and Supabase-backed (high volume), with a decision matrix.",
      status: "shipped",
    },
    {
      id: "b2",
      name: "AI-Powered Lead Qualification (FlashFusion service offering)",
      type: "n8n-workflow",
      file: "flashfusion-lead-qualifier (24-node)",
      description: "Cloud-hosted, client-agnostic lead qualifier built as a FlashFusion sellable service. 24 nodes. Compliance-weighted scoring (30 of 100 points reflect regulated-industry fit). Claude AI lead enrichment. Routes 70+ scores to Linear for immediate follow-up; enrolls 45-69 in nurture email. Client-branded templates, full error handling, website integration code, test procedures.",
      status: "shipped",
    },
    {
      id: "b3",
      name: "Import Path Fixer Workflow",
      type: "n8n-workflow",
      file: "import-path-fixer (cloud webhook version)",
      description: "12-node workflow that repairs broken TS/JS imports after file reorganization. Parses README for documented moves, scans codebase for broken imports via regex, computes new relative paths with confidence scoring, IF-node routes on confidence threshold, generates bash sed script with backup/rollback. P0 security: input validation, path allowlisting, dangerous-pattern detection, atomic ops. Hardened after a 17K-word audit (10 findings, 6/10 OWASP-LLM violations) with prompt-injection isolation and token-budget cap under $0.25/run. Cloud-optimized: webhook entry + Respond-to-Webhook exit, compressed node code.",
      status: "shipped",
    },
    {
      id: "b4",
      name: "TikTok-Sora2 Content Automation",
      type: "n8n-workflow",
      file: "tiktok-sora2-automation.json",
      description: "35-node pipeline: GPT-4o for style/character/prompt generation, Sora 2 for 5-30s vertical video (polling for completion), Supabase for metadata+storage, Ayrshare for TikTok/multi-platform publishing. Input validation against prompt injection, cost estimation, scheduled (every 8h) or webhook trigger. ~3 videos/day at ~$40-70/mo. Delivered as a ZMSC v2.2 six-file package (README, Supabase schema with RLS, .env template, package.json, workflow JSON).",
      status: "shipped",
    },
    {
      id: "b5",
      name: "Mission Control Dashboard v1.0",
      type: "dashboard",
      file: "mission-control (Next.js 14 + Supabase)",
      description: "Single-pane ops dashboard: Next.js 14, TypeScript, Tailwind, Supabase Realtime. Four widgets — leads pipeline, system health, action items, intelligence feeds. Phase 1 intentionally no-auth for single-user VPN deployment. 12 security findings (4 critical: anonymous RLS USING(true)). Deploys in under 30 min. Packaged with seed data, deployment guide, quick-start. Positioned as a $15K-$50K enterprise template; ROI paths modeled for personal/client/enterprise.",
      status: "shipped",
    },
    {
      id: "b6",
      name: "ZMSC v2.2 Deliverables Package",
      type: "package",
      file: "zmsc-automations-deliverables-v2.2.zip (84K)",
      description: "Full workspace extraction + audit bundle. Four folders: source project files, extraction artifacts, IngestSchema v2.4 snapshot (snapshot_id 01e8da7dda76b9ad covering 53 workflows, 24 integrations, 26 conversations), and LLM-SARP v2.4 audit report. SHA256 checksums for all 10 content files + Merkle root. Honest gap logged in-file: .zip.metadata.json was written after the checksum pass so it appears in the zip but not in CHECKSUMS.sha256.",
      status: "shipped",
    },
    {
      id: "b7",
      name: "n8n Scheduled Workflow Fixes (WF-02, WF-04)",
      type: "ops-fix",
      file: "krosebrook.app.n8n.cloud",
      description: "WF-02 Research Brief Generator (wlGeCq7iEz0zs8Hc) had failed every Friday for 5 weeks; root cause was wrong credential (active version used httpHeaderAuth; correct Notion cred identified via read-only 7-credential draft probe) plus an IF-node boolean bug. Fixed and verified end-to-end; missed brief generated and saved to Notion as Research Brief Week 23. WF-04 Feed Health Monitor (eQp8c1Y0uM7I9dY7) confirmed healthy, 32 consecutive successes.",
      status: "shipped",
    },
    {
      id: "b8",
      name: "MONOTURBO Monorepo Migration Plan",
      type: "migration-plan",
      file: "monoturbo (ZMSC v2.1, 12 files)",
      description: "Consolidation plan for 15-20 repos into one Turborepo. 13-week phased timeline (adjusted up from 12 for realistic complexity). 12-file package: migration plan, app-migration + emergency-rollback bash scripts, Turborepo pipeline config, pnpm workspace config, GitHub Actions CI, env templates, guides. Targets ~$400/mo savings via build optimization + infra consolidation, zero-downtime for Next.js + Supabase apps. NOT yet executed.",
      status: "planned",
    },
    {
      id: "b9",
      name: "AI Workflow Factory Business Model",
      type: "business-model",
      file: "ai-workflow-factory (deliverables package)",
      description: "Complete consulting business-in-a-box. 12 industry templates (healthcare, financial services, manufacturing, legal, e-commerce, real estate, HR, marketing, SaaS, supply chain, insurance, education), each with pricing $15K-$300K. 2,500+ lines of Python for core systems (automation platform, sales playbook with lead scoring + objection handling, ops/CRM). Financial model: $375K-$4.3M/yr at 90%+ margin. Reduces 40-80h implementations to 2-12h via security-first templates.",
      status: "shipped",
    },
    {
      id: "b10",
      name: "Automation Service Delivery Framework",
      type: "framework",
      file: "service-delivery-framework",
      description: "Platform-agnostic delivery system. JSON schema (metadata, triggers, steps, AI calls, outputs, monitoring, security, deployment, compliance, cost controls). 10 concrete automation examples (lead qual, support triage, content repurposing, KPI digest, meeting notes, compliance doc review, onboarding, social monitoring, expense processing, inventory reorder). 5-phase playbook (discovery to handover). SLA maintenance tiers $200-$1200/mo. Naming conventions + 3 internal ops workflows (onboarding, weekly health check, monthly billing).",
      status: "shipped",
    },
    {
      id: "b11",
      name: "Project Custom Instructions",
      type: "instructions",
      file: "project-custom-instructions (~420 tokens/turn)",
      description: "Web-search-grounded Claude project instructions covering five areas: workspace identity (AI automation consulting for regulated industries), stack defaults (n8n Cloud, Supabase Pro, Next.js 15, Vercel, GitHub Actions, Claude Sonnet), ZMSC v2.2 + Snapshot Harvester v1.2 conventions, Cowork skill-authoring standards, behavioral overrides. Communication/format rules deliberately excluded (already in user preferences) to avoid token waste.",
      status: "shipped",
    },
    {
      id: "b12",
      name: "Automation Events Master DB",
      type: "notion-db",
      file: "Notion: Automation Events Master DB",
      description: "Central event ledger in Notion. Properties: Status, Priority, Event_Type (AI_Query, Deploy_Event, Error_Log, API_Call, Data_Sync, Workflow_Trigger), Source_App (full stack), Retry_Count, Payload_JSON, Error_Message, Resolution_Notes. Backbone for cross-platform automation observability across Zapier/n8n/Make.",
      status: "shipped",
    },
    {
      id: "b13",
      name: "Bot System Schema (krosebrook@gmail.com)",
      type: "schema",
      file: "supabase: gloqchibrcklsjsznvjg",
      description: "Multi-tenant bot backend. 10+ interconnected tables (conversations, messages, tasks, memory, workflows, executions, events, error_log, audit_log) with indexing, RLS, audit-trail triggers, helper functions for conversation management + memory storage, materialized views for analytics, automated data-retention. Supabase Edge Function create-bot-user (idempotent, Auth Admin API) at /functions/v1/create-bot-user.",
      status: "shipped",
    },
    {
      id: "b14",
      name: "events-gateway Webhook",
      type: "webhook",
      file: "krosebrook.app.n8n.cloud/webhook/events-gateway",
      description: "Production webhook that receives events, validates signatures, routes work vs personal context by email-domain analysis, inserts into separate Supabase databases, and creates corresponding Notion pages. Solved IPv6 corporate-network failure via Supabase Transaction Pooler (IPv4 hostnames, port 6543) and n8n Expression mode for hostname fields.",
      status: "shipped",
    },
    {
      id: "b15",
      name: "Zapier Sales Automation Prompts",
      type: "prompts",
      file: "zapier-sales-prompts (RISE methodology)",
      description: "Three production-ready Zapier automation prompts using Apollo.io (not Clearbit): lead enrichment pipeline (Apollo to HubSpot + notification), deal-stage automation (HubSpot progression triggers tasks + company enrichment), outbound sequence (Apollo scoring into Instantly.ai). Each with security constraints, error handling, env templates, test scenarios, rollback. Flagged: outbound sequence exceeds Zapier Pro 750-task limit.",
      status: "shipped",
    },
  ],
  decisions: [
    {
      id: "d1",
      decision: "Security-first architecture is the competitive moat for regulated industries.",
      rationale: "AppSec + Platform background is rare in the automation-consulting market. HMAC, sanitization, RLS, audit logging, and HIPAA/SOC2/GDPR/PCI-DSS readiness are baked into every deliverable, letting the business serve pharma/healthcare/manufacturing where most freelancers cannot.",
      alternatives: "Compete on speed/price (commoditized, race to the bottom); generic no-code automation (no defensible edge).",
    },
    {
      id: "d2",
      decision: "Two-tier market strategy — anchor on enterprise regulated ($15K-$300K).",
      rationale: "The @sifuyik 8-step $5K/mo freelancer blueprint targets solopreneurs and lacks compliance, scalability, and QC for regulated clients. Adopt it only as a low-end funnel, not the core model.",
      alternatives: "Go all-in on the $5K/mo bootstrapper model (low ceiling, wrong buyer); enterprise-only with no funnel (slower pipeline).",
    },
    {
      id: "d3",
      decision: "Notion over Supabase for low-volume lead intake.",
      rationale: "15 min faster setup (30 vs 45), ~$300/yr saved at low volume, native collaboration UI. Supabase retained for high-volume/complex workloads. Ship both editions with a decision matrix so the buyer chooses by volume/team.",
      alternatives: "Supabase everywhere (overkill + cost for low volume); Airtable (weaker API ergonomics for this flow).",
    },
    {
      id: "d4",
      decision: "n8n is primary for AI-heavy workflows; Zapier is the connector hub.",
      rationale: "n8n runs ~2-2.4s vs Zapier ~4.8-5.5s on AI workflows and gives full control. Zapier has no native Anthropic integration (webhook workaround required). Make.com Maia chat-builder still in beta.",
      alternatives: "Zapier-first (slower, no native Claude); Make-first (chat config not production-ready yet).",
    },
    {
      id: "d5",
      decision: "Platform lane separation: n8n for internal + client-owned instances, Make for monetized multi-tenant delivery, Zapier as connector hub.",
      rationale: "n8n Sustainable Use License blocks reselling n8n itself as a hosted multi-tenant SaaS, but permits building automations for your own business and delivering them into a client's own n8n instance — so n8n covers internal + client-owned builds. Centrally-hosted monetized/multi-tenant automation routes through Make; Zapier bridges the long tail of SaaS connectors.",
      alternatives: "One platform for everything (license/cost/risk concentration).",
    },
    {
      id: "d6",
      decision: "Supabase from n8n via Transaction Pooler (port 6543) + Expression mode.",
      rationale: "Corporate Windows network has no IPv6, so direct connection fails. Pooler exposes IPv4 hostnames (aws-0/aws-1-us-east-1.pooler.supabase.com). n8n Fixed mode on hostname fields causes SASL auth failures; Expression mode works.",
      alternatives: "Direct DB connection (IPv6-only, fails); session pooler port 5432 (not IPv4-friendly here).",
    },
    {
      id: "d7",
      decision: "n8n IF-node single-value boolean assert uses operation:'false' with no rightValue.",
      rationale: "In IF v2.2, operation:'equal' with rightValue:false validates but silently routes ALL inputs as false (caught in execution 8789; correct form confirmed in 8790, matches Ecosystem Scanner). ADR 2026-06-06.",
      alternatives: "operation:'equal' rightValue:false (silent misroute); Code-node boolean check (heavier, unnecessary).",
    },
    {
      id: "d8",
      decision: "Attach credentials with literal {id,name} pairs in update_workflow.",
      rationale: "newCredential('name') triggers a silent 'credential auto-assignment skipped' warning and leaves nodes unlinked. Literal {notionApi:{id:'2NqWlhsFmaiAAQUI', name:'Notion account 6'}} works.",
      alternatives: "newCredential() helper (silently skips); UI-only attach (not scriptable).",
    },
    {
      id: "d9",
      decision: "n8n.io Chat Agent prompts must stay under 1000 characters.",
      rationale: "Hard platform limit. Use extreme compression — variable shortening, whitespace removal, drop examples, terse instructions — averaging ~65% reduction while preserving function and safety constraints.",
      alternatives: "Full verbose prompts (rejected by platform); split across nodes (added complexity).",
    },
    {
      id: "d10",
      decision: "Package ZMSC zips via bash cat>>EOF with per-file ls -lh verification.",
      rationale: "create_file can report success but not sync to disk before zip, producing empty archives. The reliable sequence: mkdir -p, write with heredoc, verify each with ls -lh, zip, verify with unzip -l, compute SHA256, generate Merkle root.",
      alternatives: "create_file then zip (empty-archive risk); UI export (no manifest/checksums).",
    },
    {
      id: "d11",
      decision: "n8n Cloud workflows use webhook triggers, never manual triggers.",
      rationale: "Cloud requires a webhook entry node + Respond-to-Webhook exit; manual-execution nodes do not fire as a deployed endpoint. Node code is compressed to stay within Cloud execution constraints.",
      alternatives: "Manual trigger (does not run as endpoint in Cloud); cron-only (no synchronous API response).",
    },
    {
      id: "d12",
      decision: "Dual-purpose rule: every internal tool is packageable as a client template in under 2 hours.",
      rationale: "Build once for internal use, parameterize, and resell. Mission Control, lead intake, and import-path-fixer were all built to this standard.",
      alternatives: "Separate internal vs product tracks (duplicated effort).",
    },
    {
      id: "d13",
      decision: "OAI maintenance suite (8 destructive workflows) should be availableInMCP:false.",
      rationale: "Workflows like TTL purge, data-retention purge, and token-budget reset could be invoked accidentally during an AI client session. Manual UI execution remains available. STILL UNACTIONED across multiple sessions — also tracked as a P0 thread.",
      alternatives: "Leave ON (accidental-destruction risk); delete them (lose the maintenance capability).",
    },
    {
      id: "d14",
      decision: "Use draft-probe via update_workflow instead of create_workflow_from_code.",
      rationale: "create_workflow_from_code is approval-gated and unreliable. Manipulate a draft inside an existing workflow, execute manually, read results, then restore — zero residue on the active/published version.",
      alternatives: "create_workflow_from_code (approval-gated, flaky); building live on the active version (production risk).",
    },
    {
      id: "d15",
      decision: "Disclose gaps and contradictions directly in deliverable files.",
      rationale: "Honest in-file disclosure (e.g., the .zip.metadata.json checksum gap, phantom-infra corrections) over smoothing builds trust and prevents silent downstream failures.",
      alternatives: "Polish over gaps (hidden landmines); separate errata doc (gets lost).",
    },
  ],
  openThreads: [
    {
      id: "t1",
      thread: "41 of 53 workflows inactive with no production/scaffolding classification",
      priority: "P0",
      context: "LLM-SARP v2.4 audit finding (2026-06-09; the 53-total / 41-inactive split is unverified this session — n8n MCP was not reachable). No taxonomy distinguishes production workflows from test/scaffold artifacts, so the instance is unauditable at a glance and risky to prune.",
      nextAction: "Run a classification pass tagging each workflow production vs scaffold vs deprecated; archive or label accordingly.",
    },
    {
      id: "t2",
      thread: "Rollback is manual-only — no pre-deploy snapshot mechanism",
      priority: "P0",
      context: "A bad update_workflow (which replaces the entire structure) has no automatic restore point. Recovery is manual reconstruction.",
      nextAction: "Build a pre-deploy snapshot step that exports workflow JSON before any mutation; store with timestamp for one-command restore.",
    },
    {
      id: "t3",
      thread: "Zero automated test suite across the n8n platform",
      priority: "P0",
      context: "No regression coverage. Fixes (e.g., the WF-02 IF-node bug) are verified by hand on single executions.",
      nextAction: "Scaffold a smoke-test harness that exercises each production workflow against known inputs and asserts routing/output.",
    },
    {
      id: "t4",
      thread: "OAI maintenance suite still availableInMCP:true",
      priority: "P0",
      context: "8 destructive workflows remain MCP-invokable. Recommendation to disable has been open across multiple sessions. May be instance metadata not settable via update_workflow (see t8).",
      nextAction: "Test one toggle, confirm the write path, then batch-disable all 8.",
    },
    {
      id: "t5",
      thread: "Portfolio Command Center Live Sync (JPSVa3cLtQPi8NKF) trigger-mode errors",
      priority: "P1",
      context: "Daily trigger-mode errors. Diagnosed. 38-node workflow — update_workflow would drop omitted nodes, so a UI toggle is the safe fix path.",
      nextAction: "Correct trigger mode in the n8n UI; verify against 3 most recent executions.",
    },
    {
      id: "t6",
      thread: "Fusionomics Script-to-Audio-to-Video (5oX3SVx3PQkznNdM) credential failure",
      priority: "P1",
      context: "active:true but documented execution failures from a credential attachment problem. Diagnosed. UI-only fix.",
      nextAction: "Attach the correct credential via UI; confirm with get_execution on recent runs.",
    },
    {
      id: "t7",
      thread: ".zip.metadata.json checksum gap in ZMSC packaging",
      priority: "P1",
      context: "The metadata file is written after the CHECKSUMS.sha256 pass, so it ships in the zip but is absent from the checksum manifest — a parity break.",
      nextAction: "Reorder packaging so metadata is written before checksums, or append its hash after generation.",
    },
    {
      id: "t8",
      thread: "availableInMCP may be instance metadata, not workflow-definition data",
      priority: "P1",
      context: "If the flag lives outside the workflow definition, update_workflow cannot set it. Blocks the t4 batch operation until confirmed.",
      nextAction: "Run a single test update on a low-risk workflow before batching 19 toggle operations.",
    },
    {
      id: "t9",
      thread: "Notion MCP pages show 'Page not found' for the user",
      priority: "P2",
      context: "Recurring. Pages created via MCP are visible to Claude (fetch works) but inaccessible to the user across create/update/move/duplicate attempts — workspace isolation or permission-inheritance issue.",
      nextAction: "Verify the integration is connected to the target DB via Notion Connections; test page creation under a known-accessible parent.",
    },
    {
      id: "t10",
      thread: "First-3-clients validation for the consulting model",
      priority: "P1",
      context: "Pricing tiers and the AI Workflow Factory model are built but unvalidated against real buyers. Compliance certification requirements (which certs, for which industries) still open.",
      nextAction: "Run discovery with 3 target clients; validate price points and required compliance attestations.",
    },
    {
      id: "t11",
      thread: "MONOTURBO migration not executed",
      priority: "P1",
      context: "13-week plan and full automation/rollback package are ready; execution has not started.",
      nextAction: "Confirm repo inventory is current, then begin Phase 1 (tooling + workspace scaffold).",
    },
    {
      id: "t12",
      thread: "Mission Control Phase 2 hardening",
      priority: "P2",
      context: "Phase 1 ships anonymous RLS USING(true) (4 critical findings) for single-user VPN use. Multi-tenant resale needs a full auth redesign.",
      nextAction: "Add auth architecture, Zod input validation, and rate limiting via Edge Functions before any client deployment.",
    },
    {
      id: "t13",
      thread: "Fresh workflow inventory before each audit/packaging pass",
      priority: "P2",
      context: "Live count moved 43 to 53 between May and June; chat-history counts go stale.",
      nextAction: "Always run search_workflows limit:200 at the start of any audit; do not trust prior-session counts.",
    },
  ],
  projectKnowledge: [
    {
      id: "k1",
      file: "ZMSC v2.2 packaging convention",
      relevance: "high",
      keyInsights: "ZIP/Manifest/System-Contract framework. Requires manifest parity (every content file listed), SHA256 per file, a .zip.metadata.json, and a Merkle root. Reliable build: mkdir -p, write with cat>>EOF heredoc, ls -lh verify each, zip, unzip -l verify, sha256sum, Merkle. Separate folders for source / extraction / snapshot / audit.",
      usedFor: "Every deliverable package (TikTok-Sora2, MONOTURBO, import-path-fixer, the v2.2 deliverables bundle).",
    },
    {
      id: "k2",
      file: "Snapshot Harvester v1.2 / IngestSchema v2.4",
      relevance: "high",
      keyInsights: "AI observability/governance tool. Reverse-engineers workflows and full workspaces into structured JSON (functional features, integrations, AI agents, security boundaries, economics, telemetry). snapshot_id 01e8da7dda76b9ad captured 53 workflows / 24 integrations / 26 conversations. Self-correct data-quality errors in-snapshot (model was Claude Sonnet 4.6, not Opus).",
      usedFor: "Structured extraction before any audit; the Mission Control and multi-workflow analyses.",
    },
    {
      id: "k3",
      file: "LLM-SARP v2.4 auditor role",
      relevance: "high",
      keyInsights: "Ranks platform findings by severity. Produced the 12 findings / 3 P0s on the n8n instance (inactive-workflow classification, manual-only rollback, no test suite) and flagged the OAI destructive suite.",
      usedFor: "Post-snapshot audit and prioritization.",
    },
    {
      id: "k4",
      file: "n8n MCP tool knowledge (krosebrook.app.n8n.cloud)",
      relevance: "high",
      keyInsights: "search_workflows limit:200 returns the full instance in one call (currently 53). active:true does NOT mean healthy — pull get_execution on the 3 most recent runs. update_workflow replaces the ENTIRE structure (omitted nodes are dropped) so it is unsafe for surgical edits on large workflows (use UI). create_workflow_from_code is approval-gated/unreliable; draft-probe instead. get_sdk_reference and validate_workflow may need a tool-context refresh to clear an approval gate.",
      usedFor: "All live n8n ops, fixes, and audits.",
    },
    {
      id: "k5",
      file: "Supabase connectivity + projects",
      relevance: "high",
      keyInsights: "Two projects: gloqchibrcklsjsznvjg and gcqfqzhgludrzkfajljp. From n8n use the Transaction Pooler (aws-0/aws-1-us-east-1.pooler.supabase.com, port 6543) for IPv4; set hostname fields in Expression mode (Fixed mode causes SASL auth failure). JSONB inserts must wrap n8n expressions in single quotes and cast: '{{...}}'::jsonb. n8n v1.115.4 has no $input.item() — use $json.",
      usedFor: "events-gateway, bot schema, lead intake Supabase edition.",
    },
    {
      id: "k6",
      file: "Notion credentials with confirmed DB access",
      relevance: "high",
      keyInsights: "Account 6 (2NqWlhsFmaiAAQUI) and Account 7 (elX8rDQEYy6VAbzL) have access to Research Inbox DB (02dcdeff6afe43d6a1325882a14289dc) and Newsletter Drafts DB (8280dab1d4b24a57b50323db78650b11). Accounts 1-4 are Gemini/Claude integrations with no DB access. Account 5 (bNCmilKslaiEG6Dz) was never attached to the active WF-02 (corrected a prior-session assumption). API needs property wrappers (rich_text, multi_select arrays) and the integration must be connected to the DB or calls 403; rate limit ~3 req/s.",
      usedFor: "WF-02 fix, lead intake Notion edition, Automation Events Master DB.",
    },
    {
      id: "k7",
      file: "Canonical workflow IDs",
      relevance: "high",
      keyInsights: "WF-02 Research Brief wlGeCq7iEz0zs8Hc; WF-04 Feed Health eQp8c1Y0uM7I9dY7; WF-05 Morning Briefing Ox31Oio70TITrzdJ; WF-06 Lead Capture CRM GwQpwZTiacEV0Zhc; WF-07 Weekly Review kTWKqhC3QE0f1AhI; WF-08 EOD Shutdown fbPXkL3VwwBYL6kQ; Onboarding 6ZXg746BkNu2oZpN; Portfolio Command Center JPSVa3cLtQPi8NKF; Fusionomics 5oX3SVx3PQkznNdM.",
      usedFor: "Targeting the right workflow in any ops/audit action.",
    },
    {
      id: "k8",
      file: "Security deliverable standard (regulated industries)",
      relevance: "high",
      keyInsights: "Non-negotiables: HMAC-SHA256 signature validation, input sanitization (XSS/SQLi), path allowlisting, prompt-injection isolation via user-content tags, token-budget caps, audit trails with 90-day GDPR retention, RLS. OWASP-LLM is the checklist (import-path-fixer originally violated 6/10).",
      usedFor: "Every client-facing automation and the lead-intake systems.",
    },
    {
      id: "k9",
      file: "Platform performance + resilience patterns",
      relevance: "medium",
      keyInsights: "n8n ~2-2.4s vs Zapier ~4.8-5.5s on AI workflows. Use exponential backoff (3-5 retries), circuit breakers for persistent failures, and distinguish retryable vs fatal errors. Cost controls: token budgets, polling for long-running APIs (Sora 2), per-run cost estimation.",
      usedFor: "Platform selection and error-handling design across all workflows.",
    },
    {
      id: "k10",
      file: "Zapier / Make platform constraints",
      relevance: "medium",
      keyInsights: "Zapier Professional: 750 tasks/mo at ~$103.50, no native Anthropic (webhook workaround). Zapier is now an 8-component orchestration platform (Zaps, Tables, Interfaces, Canvas, Agents, Chatbots, Copilot, MCP), 8000+ apps. Make.com Maia AI chat-builder is in beta/waitlist; HTTP modules cover custom AI/JSON as a workaround. The outbound-sequence Zapier prompt exceeds the 750-task ceiling.",
      usedFor: "Zapier sales prompts, lane-separation decision, task-budget planning.",
    },
  ],
  tags: ["n8n", "zmsc-v2.2", "snapshot-harvester", "llm-sarp", "flashfusion-lead-intake", "tiktok-sora2", "mission-control", "import-path-fixer", "supabase", "notion", "hubspot", "zapier", "make", "regulated-industries", "hipaa-soc2-gdpr", "security-first", "lead-scoring", "ayrshare", "apollo-io", "monoturbo", "webhook-gateway", "consulting-business", "automation-templates", "flashfusion"],
  nextSessionPrimer: "Resume on P0 audit remediation for krosebrook.app.n8n.cloud: (1) classify all 53 workflows production vs scaffold; (2) build a pre-deploy snapshot/rollback step; (3) scaffold a smoke-test harness. Then disable the OAI destructive maintenance suite (test one availableInMCP toggle first to confirm the write path, then batch the 8). UI-only fixes still pending for Portfolio Command Center (trigger mode) and Fusionomics (credential attach) — verify both via get_execution on the 3 most recent runs. Always run search_workflows limit:200 before auditing; counts go stale.",
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
