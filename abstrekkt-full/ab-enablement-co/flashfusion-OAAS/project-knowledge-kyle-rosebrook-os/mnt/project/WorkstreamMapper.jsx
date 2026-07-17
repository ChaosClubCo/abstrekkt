import { useState, useRef, useEffect } from "react";

const WS = {
  fusion:     { label: "Fusion AI",            status: "101 entities / n8n blocked",  color: "#7C3AED" },
  consulting: { label: "FF Consulting",        status: "Live / client.flashfusion.co", color: "#10B981" },
  chaos:      { label: "chaosclub.co",         status: "Peer support / Firestore live", color: "#EC4899" },
  content:    { label: "Content / The Prompt", status: "Greenlit / No distribution",  color: "#F59E0B" },
  growth:     { label: "Growth Detector",      status: "Validation stage",             color: "#3B82F6" },
  ops:        { label: "Ops / Blockers",       status: "Active",                       color: "#EF4444" },
  ai:         { label: "AI Providers",          status: "Multi-provider / Untracked",   color: "#06B6D4" },
};

const PM = {
  P0: { label: "P0 — This week",   dot: "#EF4444", bg: "#7F1D1D22", bd: "#EF444455", tx: "#FCA5A5" },
  P1: { label: "P1 — This sprint", dot: "#F59E0B", bg: "#78350F22", bd: "#F59E0B55", tx: "#FCD34D" },
  P2: { label: "P2 — Next sprint", dot: "#3B82F6", bg: "#1E3A5F22", bd: "#3B82F655", tx: "#93C5FD" },
  P3: { label: "P3 — Backlog",     dot: "#6B7280", bg: "#1F293722", bd: "#6B728055", tx: "#D1D5DB" },
};

const TAG_COLOR = {
  config:       { bg: "#064E3B", c: "#6EE7B7" },
  reliability:  { bg: "#064E3B", c: "#6EE7B7" },
  velocity:     { bg: "#064E3B", c: "#6EE7B7" },
  efficiency:   { bg: "#064E3B", c: "#6EE7B7" },
  architecture: { bg: "#2D1B69", c: "#C4B5FD" },
  quality:      { bg: "#2D1B69", c: "#C4B5FD" },
  analytics:    { bg: "#2D1B69", c: "#C4B5FD" },
  "sales tool": { bg: "#78350F", c: "#FCD34D" },
  distribution: { bg: "#78350F", c: "#FCD34D" },
  positioning:  { bg: "#1E3A5F", c: "#93C5FD" },
  product:      { bg: "#1E3A5F", c: "#93C5FD" },
  migration:    { bg: "#7F1D1D", c: "#FCA5A5" },
};

const ITEMS = [
  // P0
  {
    id: "op1", p: "P0", ws: "ops", tag: "config", ef: "1–2 days",
    cap: "n8n: Base44 Bearer creds + SCH-02 lane field — 11 workflows blocked",
    bk: "11 n8n workflows stalled: Base44 Bearer credentials not resolving in HTTP Request node, SCH-02 lane field missing from WIR-01 payload schema, 4 orphan WIR-01 duplicates inflating queue depth. Blocks Fusion AI intake automation, consulting pipeline routing, and Growth Detector signal processing.",
    ub: "All 11 workflows resume. Fusion AI agentic intake queue, consulting CRM routing, and Growth Detector lead processing all unblock in one fix sequence.",
    ns: "1) Audit Base44 MCP token scope — Bearer vs API Key header format. 2) Add SCH-02 lane field to WIR-01 schema in Base44. 3) Deduplicate 4 orphan WIR-01 records. 4) Smoke test all 11 workflows end-to-end."
  },
  {
    id: "ct0", p: "P0", ws: "content", tag: "distribution", ef: "1 day",
    cap: "Content has no home — memoir + The Prompt have nowhere to distribute",
    bk: "Content strategy greenlit May 2026. Construction Manifesto written. Memoir active. The Prompt defined. Zero publicly indexed output exists. No Substack, no standalone site, no RSS. Writing is invisible.",
    ub: "The Prompt has a live Substack with a first issue. Memoir has a dedicated page under flashfusion.co/writing or writing.flashfusion.co. Content becomes discoverable and shareable for the first time.",
    ns: "Pick one channel and ship today: (A) Substack — set up, write 400-word Issue 0 as a positioning piece, publish. (B) writing.flashfusion.co — Cloudflare CNAME to Notion published page. Don't plan the full calendar first — get one URL live."
  },
  // P1
  {
    id: "f1", p: "P1", ws: "fusion", tag: "architecture", ef: "3–5 days",
    cap: "Fusion AI: effort controls cost router — replace flat model calls",
    bk: "All 101-entity Fusion AI API calls use the same model tier. No complexity-based routing. Paying max rates on simple lookup tasks and low-stakes automation jobs.",
    ub: "Four-tier cost router: low for lookup/read ops, medium for standard agent tasks, high for reasoning chains, max for security-sensitive workflows. Estimated 50–70% token cost reduction on low/medium calls.",
    ns: "Audit 101 entity schemas — classify each as lookup, task, reasoning, or secure. Map to model tier. Replace flat API calls. Instrument with PostHog custom events per tier so cost is visible. Validate in staging with 3 representative agent flows."
  },
  {
    id: "f2", p: "P1", ws: "fusion", tag: "velocity", ef: "Token spike: 2–5x",
    cap: "Fusion AI: agent teams — parallel 101-entity schema optimization",
    bk: "Entity schema review done sequentially. At current pace, auditing 101 entities takes 4–6 sessions. Single-context review misses cross-entity dependency patterns.",
    ub: "Parallel agent instances process entity batches simultaneously. 3–4x throughput. Lead agent assigns 20-entity batches by domain; subagents audit and flag; lead synthesizes cross-entity conflicts.",
    ns: "Enable CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1. Run 10-entity cost spike first. If quality holds: assign Core (25), Automation (25), CRM/Pipeline (25), Meta/Config (26). Budget 3–5x tokens. Output: entity health report + prioritized schema fixes."
  },
  {
    id: "c1", p: "P1", ws: "chaos", tag: "quality", ef: "2–3 days",
    cap: "chaosclub.co: TypeScript strict mode + Zod validation migration",
    bk: "chaosclub.co running TypeScript without strict mode. No runtime schema validation on external inputs (Gemini API responses, OpenAI API responses, Anthropic API responses, Stripe webhooks, Cloudflare R2 metadata). Silent type errors in production; Stripe webhook handler is highest risk.",
    ub: "Strict mode catches null/undefined errors at compile time. Zod schemas on all external boundaries prevent malformed data from reaching business logic. Stripe webhook handler becomes audit-safe.",
    ns: "1) Enable strict in tsconfig.json, run tsc — collect error list. 2) Fix nullability + implicit any. 3) Zod schemas on: Stripe webhook handler, Gemini API response parser, OpenAI API response parser, Anthropic API response parser, R2 metadata reader. 4) Run Vitest on all patched boundaries."
  },
  {
    id: "p1", p: "P1", ws: "content", tag: "distribution", ef: "0.5 days",
    cap: "The Prompt: Substack setup + Issue 0 published",
    bk: "The Prompt newsletter has a defined format and FlashFusion creator-tech audience but no live distribution URL. Zero subscribers. docs/content-strategy-v1.md not yet created.",
    ub: "Live Substack with a real URL. Issue 0 published as a positioning piece. Backlink from flashfusion.co. Content strategy document created and referenced from FlashFusion claude.md.",
    ns: "Set up Substack under 'The Prompt by FlashFusion.' Write Issue 0: 400 words, your actual take on one tool or workflow. Publish. Then write docs/content-strategy-v1.md as a one-pager: audience, cadence, format per channel."
  },
  // P2
  {
    id: "obs1", p: "P2", ws: "ops", tag: "config", ef: "2–3 days",
    cap: "Obsidian vault integration — Claude read/write via TS plugin + MCP bridge",
    bk: "Obsidian vault disconnected from all Claude workflows. Project notes, session context, and skill library docs live in isolated silo. FlashFusion claude.md is the closest thing to a context file but has no live sync.",
    ub: "Claude reads vault notes as session context. Session summaries write back to vault on close. File watcher triggers on vault changes. Context persists across sessions for the first time.",
    ns: "Single blocker: vault absolute path. 1) Confirm vault path. 2) Wire TS plugin to MCP server. 3) Test read (FlashFusion project notes surface in context) and write (session summary lands in vault on close)."
  },
  {
    id: "c2", p: "P2", ws: "chaos", tag: "analytics", ef: "1–2 days",
    cap: "chaosclub.co: PostHog event taxonomy + conversion funnel",
    bk: "PostHog installed but no defined event taxonomy. No conversion funnel tracked. Can't answer: do support-content viewers convert to account creation? What is the premium audio completion rate? Blind to actual user behavior.",
    ub: "Named event taxonomy: support_content_viewed, session_started, session_completed, premium_gate_hit, account_created, stripe_checkout_started, stripe_payment_success. Funnel from support_content_viewed → stripe_payment_success visible in dashboard.",
    ns: "Write event taxonomy doc (20 min). Implement one PostHog.capture() call per event in chaosclub.co codebase. Define 2 funnels in PostHog UI: free-to-paid and generation-to-completion. Baseline data visible within 24hrs of deploy."
  },
  {
    id: "g1", p: "P2", ws: "growth", tag: "velocity", ef: "2–3 day sprint",
    cap: "Growth Detector: GitHub signal pipeline validation sprint",
    bk: "Growth Detector in validation stage. Signal-to-lead pipeline architecture defined but not smoke-tested end-to-end. Unknown: false positive rate on buying-signal classification, actual data freshness from GitHub API.",
    ub: "Validated signal pipeline with known precision/recall on 3 test profiles. GitHub API rate limit ceiling confirmed. False positive rate measured on 50-repo sample. Go/no-go decision on moving to n8n automation.",
    ns: "Run 50-repo manual validation sprint: pull GitHub events, classify signals by hand, compare to classifier output. If precision >70% — wire to n8n. If not — tighten classifier prompt. Don't automate an unvalidated signal."
  },
  {
    id: "ff1", p: "P2", ws: "consulting", tag: "sales tool", ef: "2–3 days",
    cap: "FF Consulting: CFO cost modeling tool — close the budget objection",
    bk: "No credible cost projection before contract. Prospects at client.flashfusion.co asking for ROI model before approving. Consulting tiers shown but no forward-looking cost model at scale.",
    ub: "React artifact: input team size + task distribution → output monthly AI cost at low/medium/high effort tiers with payback timeline. Defensible, shareable, closes the CFO objection cold.",
    ns: "Build as standalone React artifact. Wire to FlashFusion consulting tier pricing. Test against 3 real prospect profiles. Host at client.flashfusion.co/roi or embed in Notion proposal template."
  },
  // P3
  {
    id: "f3", p: "P3", ws: "fusion", tag: "architecture", ef: "1 day audit",
    cap: "Fusion AI: 101-entity schema audit — dead entities + dependency map",
    bk: "101 entities accumulated over multiple build phases. Unknown how many are orphaned (no active n8n references, no active agent calls). Dead entities inflate schema complexity and slow Claude context load in Base44.",
    ub: "Confirmed live vs dead entity count. Dependency map showing which entities are touched by which n8n workflows. Candidates for archival flagged. Cleaner schema = faster agent context loads.",
    ns: "Cross-reference 101 Base44 entities against 11 n8n workflow inputs. Flag any entity with zero workflow references and no active API surface. Produce: live count, dead candidates list, dependency map. Archive dead candidates after confirmation."
  },
  {
    id: "c3", p: "P3", ws: "chaos", tag: "migration", ef: "Design spike: 1 day",
    cap: "chaosclub.co: Firebase → Supabase migration path design",
    bk: "chaosclub.co on Firebase for auth + database. Rest of FlashFusion stack is Supabase. Running two DB platforms adds operational complexity, doubles auth surface, and prevents shared RLS policies across FF apps.",
    ub: "Single Supabase instance across chaosclub.co + Fusion AI + consulting ops. Unified auth, shared RLS, single billing line. Migration path designed and costed before committing.",
    ns: "Design sprint only. Map Firebase usage: auth providers, Firestore collections, security rules. Estimate migration effort (data export, auth migration, query rewrites). Produce go/no-go doc with complexity rating. Don't migrate — know the cost first."
  },
  {
    id: "g2", p: "P3", ws: "growth", tag: "architecture", ef: "After g1 validates",
    cap: "Growth Detector: n8n lead gen automation pipeline",
    bk: "Growth Detector currently manual. GitHub signal → lead classification → outreach is a 3-step process by hand. Doesn't scale past 50 targets/week. Blocked on g1 validation sprint.",
    ub: "Automated pipeline: GitHub API polling → n8n signal classifier → Supabase leads table → HubSpot contact create. Lead scored and queued without manual intervention. 10x lead volume capacity.",
    ns: "Blocked on g1. Once signal precision confirmed >70%, wire: GitHub API polling → n8n classifier → Supabase insert → HubSpot contact create. Start with 20-lead/day cap for first 2 weeks."
  },
  {
    id: "tok1", p: "P3", ws: "consulting", tag: "config", ef: "2–3 hours",
    cap: "Create designs/FlashFusion-tokens.md + docs/content-strategy-v1.md",
    bk: "FlashFusion claude.md references both files as '[NOT YET CREATED]'. Every UI build and content work starts without locked tokens or a canonical content direction. Design drift accumulates per-project.",
    ub: "Locked token file (v3 spec: surfaces, typography, colors, radii) used in every UI build. Canonical content strategy doc referenced from all content work. Zero token drift across FF builds.",
    ns: "1) Write designs/FlashFusion-tokens.md: Instrument Serif + Geist + Geist Mono, surfaces #0B0B14/#13131F, accent #7C3AED/#EC4899, border-radius 100px pills. 2) Write docs/content-strategy-v1.md: audience, cadence, format per channel. Commit both to source-of-truth-monorepo."
  },
  // ── AI PROVIDERS ──────────────────────────────────────────
  {
    id: "ai1", p: "P1", ws: "ai", tag: "config", ef: "1 day",
    cap: "AI provider version governance — pin + track models across all FF apps",
    bk: "No centralized record of which model version is live in each FF app. Fusion AI uses claude-sonnet-4-6 (confirmed). chaosclub.co uses Gemini (version unknown). OpenAI version unknown. No policy on when to upgrade, how to test, or who decides. Silent breaking changes on provider-side are invisible.",
    ub: "Single source of truth: provider → app → model version → pinned date → upgrade policy. Every FF app's AI calls are auditable. Breaking changes caught in staging, not production.",
    ns: "Audit each FF app: (1) Fusion AI — confirm claude-sonnet-4-6 hardcoded or env var. (2) chaosclub.co — find Gemini SDK call, record model string. (3) Any OpenAI or Copilot calls — find and record. Produce: AI_PROVIDERS.md table. Add upgrade policy: test in staging, 1-week soak, then promote."
  },
  {
    id: "ai2", p: "P1", ws: "ai", tag: "architecture", ef: "2–3 days",
    cap: "Multi-provider cost dashboard — unified Anthropic + Google + OpenAI spend",
    bk: "AI costs are fragmented across 3+ provider dashboards. No single view of total spend across Fusion AI (Anthropic), chaosclub.co (Gemini), and any OpenAI usage. Can't answer: what is total monthly AI COGS? Which app is the most expensive per user? No budget ceiling per app.",
    ub: "Single PostHog or Supabase cost rollup: tokens used × cost per token per provider per app per day. Budget ceiling alerts. Monthly COGS visible in one view. Informs pricing decisions for Fusion AI and FF Consulting.",
    ns: "Wire cost telemetry per provider: (1) Anthropic — log input/output tokens per API call to Supabase. (2) Gemini — same. (3) OpenAI if used — same. Aggregate in PostHog dashboard or simple Supabase view. Ceiling: alert when any app hits 80% of monthly budget cap."
  },
  {
    id: "ai3", p: "P1", ws: "ai", tag: "positioning", ef: "0.5 days",
    cap: "Provider intel pages — Anthropic / OpenAI / Google / Microsoft Notion trackers",
    bk: "No dedicated Notion intel pages for any of the 4 major providers. Capability releases (new models, APIs, pricing changes) are discovered ad-hoc. FlashFusion's competitive positioning and client recommendations lag provider reality by weeks.",
    ub: "4 live Notion pages: Anthropic, OpenAI, Google/Gemini, Microsoft/Copilot. Each tracks: latest model, pricing, key capabilities, FF relevance score, last-updated. Sync agent can push updates on session open.",
    ns: "Create 4 Notion sub-pages under FlashFusion HQ (32eea14fb16781bdb12cff15311e1273). Template: Model | Version | Input$/1M | Output$/1M | Context window | FF relevance | Notes | Last updated. Seed with current known state. Wire Notion sync agent to update on session open."
  },
  {
    id: "ai4", p: "P2", ws: "ai", tag: "architecture", ef: "2–3 days",
    cap: "Provider abstraction layer — swap-safe AI calls across FF apps",
    bk: "Every FF app calls its AI provider directly with no abstraction. Switching from Gemini to Claude, or adding a fallback provider, requires touching every call site. Provider outages have no fallback path. No A/B routing between providers.",
    ub: "Thin provider abstraction: one interface, multiple backends (Anthropic / OpenAI / Gemini / Copilot). Swap providers via env var. Add fallback routing. Enable A/B cost testing across providers for identical tasks.",
    ns: "Build lightweight TypeScript interface: generateText(prompt, options) → {text, provider, tokens, cost}. Implement adapters for: AnthropicAdapter, GeminiAdapter, OpenAIAdapter. Drop into chaosclub.co first (lowest risk). Wire Fusion AI after validation. Env var selects default + fallback."
  },
  {
    id: "ai5", p: "P2", ws: "ai", tag: "positioning", ef: "1 day",
    cap: "GitHub Copilot overlap map — where it helps vs. where FF Consulting competes",
    bk: "GitHub Copilot is in active dev workflow (likely) but not mapped against FF Consulting's positioning. Prospects sometimes ask 'why not just use Copilot?' No documented answer. Risk of Copilot expanding into FF's advisory lane (enterprise AI strategy, workflow automation) with Microsoft backing.",
    ub: "One-page overlap map: Copilot's actual scope (code completion, PR reviews, chat in IDE) vs FF Consulting's scope (AI strategy, workflow automation, org-wide enablement). Clear 'compete / complement / ignore' verdict per Copilot feature.",
    ns: "Write overlap map doc. Copilot scope: code completion + IDE chat + PR summaries. FF scope: org AI strategy + workflow automation + enablement sprints + vCAIO. Most is complement, not compete. Formalize the answer so sales conversations don't stall on this objection."
  },
  {
    id: "ai6", p: "P3", ws: "ai", tag: "product", ef: "Design spike: 1 day",
    cap: "Multi-provider routing for Fusion AI — task-type aware provider selection",
    bk: "Fusion AI sends all agent tasks to Anthropic. Some task types (structured data extraction, long-context summarization, image input) may be cheaper or more accurate on Gemini or OpenAI for specific agents. Single-provider dependency also creates outage risk.",
    ub: "Fusion AI routes by task type: Claude for reasoning/agentic chains, Gemini for multimodal/long-context, OpenAI for embedding/fine-tuned tasks. Total cost down 20–40% on routed tasks. No single-provider outage takes down the platform.",
    ns: "Design sprint only. Map 101 entity task types against provider strengths. Identify top 3 routing candidates. Cost model the savings. Build on top of provider abstraction layer (ai4 must ship first). Go/no-go doc before any routing logic is written."
  },
];

const ASSISTANT_SYS = `You are Kyle Rosebrook's FlashFusion workstream assistant. Current date: May 2026. FlashFusion only.

Active workstreams:
- Fusion AI (app.flashfusion.co): Base44 agent platform, ~101 entities, n8n automation (11 workflows blocked: Base44 Bearer creds + SCH-02 lane field + 4 orphan WIR-01 dupes). App ID 68dd8e79ca073475565c8e16.
- FF Consulting (client.flashfusion.co): Live consulting ops. Base44 app ID 6a02ac1bad2b4e37732ef382. HubSpot CRM. CFO cost model needed.
- chaosclub.co: Peer support platform (NOT lyrics/audio/music). React 19 + Vite + TypeScript + Firebase + Cloudflare R2 + Stripe + PostHog. No strict mode. No Zod. PostHog untaxonomied. Firestore schema finalized: 10 collections, R2 signed-URL premium audio gating, Stripe webhook idempotency, soft-delete.
- Content / The Prompt: Content strategy greenlit May 2026. Memoir active ("Construction, Not Recovery"). The Prompt newsletter defined. Zero public distribution URLs exist. No Substack.
- Growth Detector: GitHub activity → lead gen tool. Validation stage. Signal pipeline not yet smoke-tested.
- Ops/Blockers: n8n (krosebrook.app.n8n.cloud), Obsidian vault integration pending (vault path needed), designs/FlashFusion-tokens.md and docs/content-strategy-v1.md not yet created.
- AI Providers: Anthropic (claude-sonnet-4-6, Fusion AI + FF Consulting primary), Google Gemini (chaosclub.co, version unconfirmed), OpenAI (usage unconfirmed across apps), Microsoft Copilot (dev workflow + potential enterprise overlap). No unified cost view. No provider intel Notion pages. No version governance. No provider abstraction layer.

FlashFusion tech stack: Supabase, Vercel, Cloudflare (CDN/edge/DNS/R2), Stripe, PostHog, Sentry, Resend, Anthropic Claude API (claude-sonnet-4-6 default), Google Gemini API (chaosclub.co), OpenAI API (status TBC), Base44, n8n + Make + Zapier, HubSpot, GitHub (ChaosClubCo org + Krosebrook user), Notion (FlashFusion HQ: 32eea14fb16781bdb12cff15311e1273).

Answer directly under 200 words. Prioritize unblocking actions over planning.`;

const PROMPT_SYS = `You generate production-ready context-engineered prompts for the FlashFusion platform. May 2026.

Stack: TypeScript strict, React 19, Vite, Supabase (auth + RLS + Postgres), Vercel, Cloudflare (Workers/R2/CDN), Stripe, PostHog, Resend, Sentry, Anthropic API (claude-sonnet-4-6 default, claude-opus-4-6 for max tier).

Apps:
- Fusion AI (app.flashfusion.co): Base44 agent platform, 101 entities, n8n automation (4 WIR + 7 OAI workflows). Provider: Anthropic (claude-sonnet-4-6 default, claude-opus-4-6 max)
- FF Consulting (client.flashfusion.co): Base44 consulting ops CRM. Provider: Anthropic
- chaosclub.co: Peer support platform. React 19 + Vite + Firebase + Stripe + PostHog. Providers: Gemini (primary), OpenAI (TBC), Anthropic (TBC)
- Growth Detector: GitHub signal → lead gen pipeline (validation stage). Provider: TBC

AI provider context: Anthropic = agentic reasoning + strategy tasks. Gemini = multimodal + long-context. OpenAI = embeddings + structured extraction. Copilot = dev workflow (IDE-level, not FF app-level). Provider abstraction layer not yet built — direct SDK calls per app.

Capabilities:
- Effort Controls GA: model tier routing (low/medium/high/max)
- Skills API GA: /v1/skills programmatic deploy/version/manage
- Context Compaction Beta: server-side summarization, trigger at 50K tokens
- Agent Teams Research Preview: CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1

Security: no client-side API keys, RLS enforced, Zod on all external inputs, Stripe webhooks via stripe.webhooks.constructEvent, no secrets in bundles.

Generate ONE context-engineered prompt for the given capability and next step. Include: role, FF stack context, precise task with API/file references, security constraints, exact output spec. Return ONLY the prompt text starting with "You are" or "Act as". Under 400 words.`;

const T = {
  bg0: "#0A0A0F", bg1: "#0F0F18", bg2: "#12121A", bg3: "#1A1A26",
  border: "#1E1E2E", border2: "#2A2A3A",
  text: "#F0F0F8", muted: "#9CA3AF", dim: "#6B7280",
};

const s = {
  root: { fontFamily: "'Inter',system-ui,sans-serif", background: T.bg0, minHeight: "100vh", color: T.text, fontSize: 14 },
  header: { background: T.bg2, borderBottom: `1px solid ${T.border}`, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 },
  statsBar: { background: T.bg1, borderBottom: `1px solid ${T.border}`, padding: "8px 16px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" },
  body: { padding: 14 },
  navBtn: { padding: "5px 12px", borderRadius: 6, border: `1px solid ${T.border2}`, background: "transparent", color: T.muted, cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: "inherit" },
  genBtn: { display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6, border: `1px solid ${T.border2}`, background: "transparent", color: T.muted, cursor: "pointer", fontSize: 11, fontWeight: 500, fontFamily: "inherit" },
  copyBtn: { display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 5, border: `1px solid ${T.border2}`, background: "transparent", color: T.dim, cursor: "pointer", fontSize: 11, fontFamily: "inherit" },
  filterBtn: { padding: "4px 9px", borderRadius: 5, border: `1px solid ${T.border2}`, background: "transparent", color: T.muted, cursor: "pointer", fontSize: 11, fontWeight: 500, fontFamily: "inherit" },
  input: { flex: 1, background: T.bg2, border: `1px solid ${T.border2}`, borderRadius: 7, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", fontFamily: "inherit" },
  sendBtn: { background: "#4C1D95", color: "#C4B5FD", border: "none", borderRadius: 7, padding: "9px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" },
  promptBox: { fontSize: 11.5, lineHeight: 1.55, padding: "8px 10px", borderRadius: 6, background: T.bg1, border: `1px solid ${T.border2}`, color: T.text, fontFamily: "'SF Mono','Fira Code',monospace", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 180, overflowY: "auto" },
  errBox: { fontSize: 11, lineHeight: 1.5, padding: "7px 9px", borderRadius: 6, background: "#7F1D1D22", border: "1px solid #EF444455", color: "#FCA5A5", fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" },
};

async function callClaude(system, userMsg) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system,
      messages: [{ role: "user", content: userMsg }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${data?.error?.message || JSON.stringify(data)}`);
  const text = data.content?.find(b => b.type === "text")?.text;
  if (!text) throw new Error("No text block in response");
  return text;
}

function TagPill({ tag }) {
  const tc = TAG_COLOR[tag] || { bg: "#1F2937", c: "#D1D5DB" };
  return <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 6px", borderRadius: 4, background: tc.bg, color: tc.c }}>{tag}</span>;
}

function Card({ item, showWs, prompts, errors, generating, onGen }) {
  const [open, setOpen] = useState(false);
  const pm = PM[item.p];
  const pt = prompts[item.id];
  const er = errors[item.id];
  const g = generating[item.id];
  const copyText = async (text) => { try { await navigator.clipboard.writeText(text); } catch {} };

  return (
    <div onClick={() => setOpen(o => !o)} style={{ borderRadius: 7, border: `1px solid ${open ? pm.bd : T.border2}`, cursor: "pointer", overflow: "hidden", background: open ? T.bg3 : T.bg1, transition: "border-color .12s,background .12s" }}>
      <div style={{ padding: "9px 10px", display: "flex", alignItems: "flex-start", gap: 7 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: pm.dot, flexShrink: 0, marginTop: 5, display: "inline-block" }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.text, lineHeight: 1.4 }}>{item.cap}</div>
          <div style={{ display: "flex", gap: 5, marginTop: 4, flexWrap: "wrap", alignItems: "center" }}>
            {showWs && <span style={{ fontSize: 10, color: WS[item.ws].color }}>{WS[item.ws].label}</span>}
            <TagPill tag={item.tag} />
            <span style={{ fontSize: 10, color: T.dim }}>⏱ {item.ef}</span>
            {pt && <span style={{ fontSize: 10, color: "#10B981" }}>✓ prompt</span>}
            {er && <span style={{ fontSize: 10, color: "#EF4444" }}>⚠ error</span>}
          </div>
        </div>
        <span style={{ fontSize: 10, color: T.dim, flexShrink: 0, transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .12s" }}>▶</span>
      </div>
      {open && (
        <div onClick={e => e.stopPropagation()} style={{ padding: "0 10px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
          {[["Was blocked", item.bk, "#EF4444"], ["Now unblocked", item.ub, "#10B981"], ["Next step", item.ns, "#3B82F6"]].map(([lbl, txt, c]) => (
            <div key={lbl}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.dim, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{lbl}</div>
              <div style={{ fontSize: 12, lineHeight: 1.5, padding: "6px 8px", borderRadius: 6, background: c + "18", border: `1px solid ${c}33`, color: c + "EE" }}>{txt}</div>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 8, marginTop: 2 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
              <button style={{ ...s.genBtn, ...(g ? { opacity: .5, cursor: "not-allowed" } : {}) }} disabled={!!g} onClick={() => onGen(item.id)}>
                {g ? "⏳ Generating…" : pt ? "↺ Regenerate" : "✦ Generate prompt"}
              </button>
              {pt && <button style={s.copyBtn} onClick={() => copyText(pt)}>⎘ Copy</button>}
            </div>
            {g && <div style={{ fontSize: 11, color: T.muted, fontStyle: "italic" }}>Generating context-engineered prompt…</div>}
            {er && !g && <div style={s.errBox}><b>Error:</b> {er}</div>}
            {pt && !g && <div style={s.promptBox}>{pt}</div>}
            {!pt && !g && !er && <div style={{ fontSize: 11, color: T.dim, fontStyle: "italic" }}>Not yet generated</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function BoardView({ prompts, errors, generating, onGen }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10 }}>
      {["P0","P1","P2","P3"].map(p => {
        const pm = PM[p];
        const items = ITEMS.filter(i => i.p === p);
        return (
          <div key={p} style={{ background: T.bg2, borderRadius: 9, border: `1px solid ${pm.bd}`, overflow: "hidden" }}>
            <div style={{ padding: "9px 12px", borderBottom: `1px solid ${pm.bd}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: pm.bg }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: pm.tx }}>{pm.label}</span>
              <span style={{ fontSize: 10, color: pm.tx, padding: "1px 7px", borderRadius: 10, border: `1px solid ${pm.bd}` }}>{items.length}</span>
            </div>
            <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              {items.map(i => <Card key={i.id} item={i} showWs prompts={prompts} errors={errors} generating={generating} onGen={onGen} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WorkstreamsView({ wsFilter, setWsFilter, prompts, errors, generating, onGen }) {
  const ids = Object.keys(WS).filter(id => wsFilter === "all" || wsFilter === id);
  return (
    <>
      <div style={{ display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap" }}>
        {[["all","All"], ...Object.entries(WS).map(([id,w]) => [id, w.label])].map(([id,lbl]) => (
          <button key={id} style={{ ...s.filterBtn, ...(wsFilter === id ? { borderColor: "#7C3AED", background: "#2D1B69", color: "#C4B5FD" } : {}) }} onClick={() => setWsFilter(id)}>{lbl}</button>
        ))}
      </div>
      {ids.map(id => {
        const w = WS[id];
        const items = ITEMS.filter(i => i.ws === id);
        const p0 = items.filter(i => i.p === "P0").length;
        const p1 = items.filter(i => i.p === "P1").length;
        return (
          <div key={id} style={{ background: T.bg2, borderRadius: 9, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: 10 }}>
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: w.color, display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{w.label}</span>
              <span style={{ fontSize: 10, color: w.color, background: w.color + "22", border: `1px solid ${w.color}44`, borderRadius: 10, padding: "2px 8px" }}>{w.status}</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
                {p0 > 0 && <span style={{ fontSize: 10, color: "#EF4444", background: "#7F1D1D44", border: "1px solid #EF444433", borderRadius: 4, padding: "1px 6px" }}>P0 ×{p0}</span>}
                {p1 > 0 && <span style={{ fontSize: 10, color: "#F59E0B", background: "#78350F44", border: "1px solid #F59E0B33", borderRadius: 4, padding: "1px 6px" }}>P1 ×{p1}</span>}
                <span style={{ fontSize: 11, color: T.dim }}>{items.length} items</span>
              </div>
            </div>
            <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 5 }}>
              {["P0","P1","P2","P3"].flatMap(p => items.filter(i => i.p === p).map(i => <Card key={i.id} item={i} prompts={prompts} errors={errors} generating={generating} onGen={onGen} />))}
            </div>
          </div>
        );
      })}
    </>
  );
}

function PromptsView({ prompts, errors, generating, onGen, onGenAll, genAllRunning, genAllDone, genAllTotal }) {
  const done = Object.keys(prompts).length;
  const total = ITEMS.length;
  const pct = Math.round(done / total * 100);
  const rem = total - done;
  const copyText = async (text) => { try { await navigator.clipboard.writeText(text); } catch {} };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "10px 12px", background: T.bg2, borderRadius: 8, border: `1px solid ${T.border}`, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 5 }}>{done} of {total} prompts generated{genAllRunning ? ` — generating ${genAllDone}/${genAllTotal}…` : ""}</div>
          <div style={{ height: 4, background: T.bg0, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: 4, background: "#10B981", borderRadius: 2, width: `${pct}%`, transition: "width .4s" }} />
          </div>
        </div>
        <button style={{ ...s.genBtn, padding: "7px 14px", fontSize: 12, ...(genAllRunning ? { opacity: .5, cursor: "not-allowed" } : {}) }} disabled={genAllRunning} onClick={onGenAll}>
          {genAllRunning ? `⏳ ${genAllDone}/${genAllTotal}…` : rem > 0 ? `✦ Generate remaining ${rem}` : "↺ Regenerate all"}
        </button>
      </div>
      {["P0","P1","P2","P3"].map(p => {
        const pm = PM[p];
        const items = ITEMS.filter(i => i.p === p);
        const pdone = items.filter(i => prompts[i.id]).length;
        return (
          <div key={p} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: pm.tx, background: pm.bg, borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", marginBottom: 8 }}>
              {pm.label} <span style={{ opacity: .65 }}>{pdone}/{items.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {items.map(item => {
                const pt = prompts[item.id]; const er = errors[item.id]; const g = generating[item.id];
                return (
                  <div key={item.id} style={{ background: T.bg2, borderRadius: 7, border: `1px solid ${pt ? T.border2 : er ? "#EF444433" : T.border}`, padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: pt || er || g ? 8 : 0 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: pm.dot, flexShrink: 0, display: "inline-block" }} />
                      <span style={{ fontSize: 12, fontWeight: 500, flex: 1, minWidth: 0 }}>{item.cap}</span>
                      <span style={{ fontSize: 10, color: WS[item.ws].color }}>{WS[item.ws].label}</span>
                      <button style={{ ...s.genBtn, fontSize: 10, padding: "3px 8px", ...(g ? { opacity: .5, cursor: "not-allowed" } : {}) }} disabled={!!g} onClick={() => onGen(item.id)}>
                        {g ? "⏳" : pt ? "↺" : "✦"} {g ? "Generating…" : pt ? "Regen" : "Generate"}
                      </button>
                      {pt && <button style={{ ...s.copyBtn, fontSize: 10 }} onClick={() => copyText(pt)}>⎘ Copy</button>}
                    </div>
                    {g && <div style={{ fontSize: 11, color: T.muted, fontStyle: "italic" }}>Generating…</div>}
                    {er && !g && <div style={s.errBox}>{er}</div>}
                    {pt && !g && <div style={s.promptBox}>{pt}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

function AskView({ msgs, loading, inputVal, setInputVal, onSend }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);
  const SUGS = [
    "What do I actually do this week?",
    "Fastest path to unblock Fusion AI?",
    "How do I get The Prompt live today?",
    "chaosclub.co — what's the highest-risk gap?",
    "Is Growth Detector worth automating yet?",
    "Which AI provider is costing us the most right now?",
    "Should chaosclub.co stay on Gemini or switch to Claude?",
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 180px)", maxWidth: 660, margin: "0 auto" }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, padding: "4px 0 12px" }}>
        {msgs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 16px" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>✦</div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 18 }}>Ask anything about FlashFusion workstreams, blockers, or next steps</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {SUGS.map(sg => (
                <button key={sg} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${T.border2}`, background: "transparent", color: T.muted, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }} onClick={() => setInputVal(sg)}>{sg}</button>
              ))}
            </div>
          </div>
        ) : msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "82%", padding: "9px 12px", fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap", borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px", background: m.role === "user" ? "#2D1B69" : "#1A1A26", color: m.role === "user" ? "#C4B5FD" : T.text }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ display: "flex", justifyContent: "flex-start" }}><div style={{ padding: "9px 12px", borderRadius: "12px 12px 12px 4px", background: "#1A1A26", color: T.muted, fontSize: 13 }}>Thinking…</div></div>}
        <div ref={endRef} />
      </div>
      <div style={{ display: "flex", gap: 8, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
        <input value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && onSend()} placeholder="Ask about FlashFusion workstreams, blockers, next steps…" style={s.input} />
        <button onClick={onSend} disabled={!inputVal.trim() || loading} style={{ ...s.sendBtn, opacity: (!inputVal.trim() || loading) ? 0.4 : 1, cursor: (!inputVal.trim() || loading) ? "not-allowed" : "pointer" }}>Send</button>
      </div>
    </div>
  );
}

export default function WorkstreamMapper() {
  const [view, setView] = useState("board");
  const [wsFilter, setWsFilter] = useState("all");
  const [prompts, setPrompts] = useState({});
  const [errors, setErrors] = useState({});
  const [generating, setGenerating] = useState({});
  const [genAllRunning, setGenAllRunning] = useState(false);
  const [genAllDone, setGenAllDone] = useState(0);
  const [genAllTotal, setGenAllTotal] = useState(0);
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const genPrompt = async (id) => {
    if (generating[id]) return;
    const item = ITEMS.find(i => i.id === id);
    if (!item) return;
    setGenerating(g => ({ ...g, [id]: true }));
    setErrors(e => { const n = { ...e }; delete n[id]; return n; });
    try {
      const text = await callClaude(PROMPT_SYS, `Capability: ${item.cap}\nWorkstream: ${WS[item.ws].label} (${item.p})\nTag: ${item.tag}\nEffort: ${item.ef}\nBlocked: ${item.bk}\nUnblocked: ${item.ub}\nNext step: ${item.ns}`);
      setPrompts(p => ({ ...p, [id]: text }));
    } catch (err) {
      setErrors(e => ({ ...e, [id]: err.message }));
    }
    setGenerating(g => { const n = { ...g }; delete n[id]; return n; });
  };

  const genAll = async () => {
    if (genAllRunning) return;
    const targets = ITEMS.filter(i => !prompts[i.id]);
    if (!targets.length) { setPrompts({}); return; }
    setGenAllRunning(true); setGenAllDone(0); setGenAllTotal(targets.length);
    for (let i = 0; i < targets.length; i++) { await genPrompt(targets[i].id); setGenAllDone(i + 1); }
    setGenAllRunning(false);
  };

  const sendMsg = async () => {
    if (!inputVal.trim() || loading) return;
    const txt = inputVal.trim(); setInputVal("");
    const newMsgs = [...msgs, { role: "user", content: txt }];
    setMsgs(newMsgs); setLoading(true);
    try {
      const text = await callClaude(ASSISTANT_SYS, newMsgs.map(m => `${m.role}: ${m.content}`).join("\n\n"));
      setMsgs(m => [...m, { role: "assistant", content: text }]);
    } catch (err) {
      setMsgs(m => [...m, { role: "assistant", content: `Error: ${err.message}` }]);
    }
    setLoading(false);
  };

  const pdone = Object.keys(prompts).length;
  const p0 = ITEMS.filter(i => i.p === "P0").length;
  const p1 = ITEMS.filter(i => i.p === "P1").length;
  const p2 = ITEMS.filter(i => i.p === "P2").length;
  const p3 = ITEMS.filter(i => i.p === "P3").length;
  const navStyle = (v) => ({ ...s.navBtn, ...(view === v ? { borderColor: "#7C3AED", background: "#2D1B69", color: "#C4B5FD" } : {}) });

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.3px" }}>FlashFusion Workstream Mapper</div>
          <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>May 2026 · {ITEMS.length} items · {Object.keys(WS).length} workstreams{pdone > 0 ? ` · ${pdone} prompts` : ""}</div>
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <button style={navStyle("board")}   onClick={() => setView("board")}>Priority board</button>
          <button style={navStyle("ws")}      onClick={() => setView("ws")}>Workstreams</button>
          <button style={navStyle("prompts")} onClick={() => setView("prompts")}>{pdone > 0 ? `Prompts (${pdone})` : "Prompts"}</button>
          <button style={navStyle("ask")}     onClick={() => setView("ask")}>Ask Claude ✦</button>
        </div>
      </div>
      <div style={s.statsBar}>
        {[[p0,"P0",PM.P0.dot],[p1,"P1",PM.P1.dot],[p2,"P2",PM.P2.dot],[p3,"P3",PM.P3.dot]].map(([n,lbl,c]) => (
          <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: c }}>{n}</span>
            <span style={{ fontSize: 10, color: T.dim }}>{lbl}</span>
          </div>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
          {Object.entries(WS).map(([id, w]) => {
            const hot = ITEMS.filter(i => i.ws === id && (i.p === "P0" || i.p === "P1")).length;
            return <span key={id} style={{ fontSize: 11, color: T.dim }}><span style={{ color: w.color }}>●</span> {w.label.split(" ")[0]} <span style={{ color: hot > 0 ? "#F59E0B" : T.dim, fontWeight: hot > 0 ? 600 : 400 }}>{hot}</span></span>;
          })}
        </div>
      </div>
      <div style={s.body}>
        {view === "board"   && <BoardView prompts={prompts} errors={errors} generating={generating} onGen={genPrompt} />}
        {view === "ws"      && <WorkstreamsView wsFilter={wsFilter} setWsFilter={setWsFilter} prompts={prompts} errors={errors} generating={generating} onGen={genPrompt} />}
        {view === "prompts" && <PromptsView prompts={prompts} errors={errors} generating={generating} onGen={genPrompt} onGenAll={genAll} genAllRunning={genAllRunning} genAllDone={genAllDone} genAllTotal={genAllTotal} />}
        {view === "ask"     && <AskView msgs={msgs} loading={loading} inputVal={inputVal} setInputVal={setInputVal} onSend={sendMsg} />}
      </div>
    </div>
  );
}
