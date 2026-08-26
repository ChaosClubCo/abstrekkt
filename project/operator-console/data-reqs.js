/* Abstrekkt Operator Console — requirements + architecture + dependency data. */
window.ConsoleData = window.ConsoleData || {};

window.ConsoleData.reqs = {
  business: {
    tldr: "FlashFusion sells the \u201Cchampion model\u201D via an audit \u2192 sprint \u2192 retainer \u2192 vCAIO ladder with a hard $4,500 audit floor and a ~$222K midpoint annual target. The business rules below are non-negotiable constraints, not aspirations.",
    offer: "Champion model: domain experts learn AI from Kyle and become the AI champion for their vertical; Kyle documents the workflows and exits the dependency. The product is transferred capability, not ongoing execution.",
    ladder: [
      { stage: "Audit", what: "Diagnostic + report", pricing: "$4,500 hard floor" },
      { stage: "Sprint", what: "Ships a working system", pricing: "Per-project fee" },
      { stage: "Retainer", what: "Ongoing outcome ownership", pricing: "Recurring" },
      { stage: "vCAIO", what: "Fractional AI leadership", pricing: "Top of ladder" },
      { stage: "Training", what: "Cohort / workshop", pricing: "Per-cohort or per-seat" },
    ],
    conversion: "Conversion assumptions (to be validated, not laws): ~30% at each rung \u2014 3 audits \u2192 1 sprint; 3 sprints \u2192 1 retainer; 2 retainers \u2192 1 vCAIO conversation. If actuals are lower, renegotiate the gate sequence, not the floor.",
    revenueTarget: "$222K midpoint, adjust quarterly. (Target, not booked revenue \u2014 current booked revenue is $0.)",
    hardRules: [
      "$4,500 audit floor is structural. If it leaks to a second prospect, the pricing model collapses. Exception conversations are deprioritized ruthlessly.",
      "Exactly one documented pricing exception may exist (Ryan) and the list may not grow without a written boundary doc closing it first.",
      "No paid contract before Milestone 0 (LLC + EIN + bank + IP clearance + E&O + MSA).",
      "Solo founder. No co-founders unless an offer is heavily in Kyle's favor. Scale via clients, channels, contractors \u2014 not partners.",
      "Lane separation from the day job is absolute. The managed IT firm is never named externally; zero interest in its clients; subcontracting it is Phase 2, post-revenue.",
      "No credential overclaim. Certification not claimed until the 2026-07-20 pass; no degree-based credential claims ever.",
      "Union VP: no free engagement, no exception. Per-cohort/per-seat only; largest potential contract; sets no precedent.",
      "All public claims verified or [GENERATED]-tagged. Never inflate tool counts (~30 hands-on; \u201C240+\u201D = catalogued MCP configs, never \u201Cmastered\u201D).",
    ],
    pipeline: [
      { tier: "ACTIVE", items: "Art (real estate; anonymous; free; GUI/web only) \u00B7 Ryan/Iron Horse (case-study trade; ! amount disputed free vs $3,000; boundary doc owed)." },
      { tier: "PRE-OUTREACH", items: "CLC (setup only, nothing sent) \u00B7 Union VP (setup only, outreach overdue since Jun 2026, board cycle 30\u201390 days)." },
      { tier: "WARM", items: "Brother's boss (guitar mfg), Lafu/Joe (cstmprnt ERP; Joe decides), Grand Appliance (friend; slot opens ~week 4), Timothy O'Toole's (3-location restaurant; ROI-driven), Milwaukee family rentals, community dive bar." },
      { tier: "PASSIVE INBOUND ONLY (never pursue)", items: "Sole Revival (asshole-tax pricing if inbound), custom print store that blew Kyle off." },
    ],
    concurrentCap: "Undecided; recommend 3; currently 2.",
  },

  product: {
    tldr: "The software line (Fusion AI on Base44, claude-code-plugins-plus, chaosclub.co, Ample, FissionPrompt) is real but secondary to consulting revenue. Requirements here are captured for continuity; none is on the current critical path.",
    items: [
      {
        name: "Fusion AI (app.flashfusion.co)",
        body: "Base44 agent platform. ~101 entities accumulated over multiple build phases. n8n automation layer. Base44 app IDs: Fusion AI 68dd8e79ca073475565c8e16; FF Consulting 6a02ac1bad2b4e37732ef382.",
        requirement: "Blocked: 11 n8n workflows on (a) Base44 Bearer credentials, (b) SCH-02 lane field, (c) 4 orphan WIR-01 duplicates. Debt: cross-reference 101 entities against active n8n references + API surface; flag zero-reference entities; archive after confirmation. Do not delete before confirmation.",
      },
      {
        name: "FF Consulting ops (client.flashfusion.co)",
        body: "Base44 consulting ops CRM + HubSpot. Live consulting ops surface.",
        requirement: "Open requirement: CFO-facing ROI cost model (team size + task distribution \u2192 monthly AI cost at low/med/high tiers + payback). Closes the CFO objection; host at client.flashfusion.co/roi or embed in proposal.",
      },
      {
        name: "claude-code-plugins-plus",
        body: "244 plugins, built.",
        requirement: "Choose ONE distribution path (marketplace / blog / direct / Anthropic) \u2014 currently undecided and blocking any go-to-market. Never present the plugin/MCP catalogue count as \u201Cmastered tools.\u201D",
      },
      {
        name: "chaosclub.co (peer-support platform)",
        body: "Peer-support app (explicitly NOT lyrics/audio/music). React 19 + Vite + TypeScript + Firebase + Cloudflare R2 + Stripe + PostHog. Firestore: 10 collections, R2 signed-URL premium audio gating, Stripe webhook idempotency, soft-delete. No strict mode, no Zod, PostHog untaxonomied.",
        requirement: "Firebase\u2192Supabase migration is a design spike only \u2014 map auth providers, Firestore collections, security rules; estimate effort; produce a go/no-go doc. Do not migrate before costing. ! Naming open question: relationship of the chaosclub.co domain to the retired ChaosClubCo brand is unresolved.",
      },
      {
        name: "Ample, FissionPrompt",
        body: "Named in the instructions as products; little detail sampled this session. Status UNKNOWN.",
        requirement: "Document scope/status before treating as portfolio.",
      },
      {
        name: "kidcreator / StoryWeaver",
        body: "Personal gift project for Kyle's daughter. Hosted in the org but NOT commercial portfolio.",
        requirement: "Hard rule: never market it.",
      },
    ],
    crossCutting: [
      "HITL (human-in-the-loop) checkpoints required for consequential/irreversible agent actions in any client-facing agent (approval queue pattern).",
      "Provider posture: Anthropic API (claude-sonnet-4-6 default; opus for max tier) primary; Gemini on chaosclub.co; OpenAI status TBC. No unified cost view or provider-abstraction layer yet.",
    ],
  },

  architecture: {
    tldr: "TypeScript/React front end, Supabase (Postgres + Auth + RLS) as the system of record, Cloudflare at the edge, n8n for orchestration, Base44 for platform apps, Anthropic API as the default model provider. chaosclub.co is the one outlier (Firebase).",
    stack: [
      { layer: "Language / UI", tech: "TypeScript (strict), React 19, Vite", notes: "strict TS on FF apps; chaosclub.co has no strict mode, no Zod" },
      { layer: "Data + auth", tech: "Supabase (Postgres, Auth, RLS)", notes: "RLS must never be disabled; migrations immutable once applied" },
      { layer: "Edge / CDN / DNS", tech: "Cloudflare (Workers, Pages, R2, CDN, DNS)", notes: "R2 for signed-URL media gating" },
      { layer: "Orchestration", tech: "n8n (krosebrook.app.n8n.cloud)", notes: "11 workflows currently blocked" },
      { layer: "Platform apps", tech: "Base44", notes: "Fusion AI + FF Consulting CRM" },
      { layer: "Payments", tech: "Stripe", notes: "webhook idempotency required" },
      { layer: "Analytics / errors", tech: "PostHog, Sentry", notes: "PostHog untaxonomied on chaosclub.co" },
      { layer: "Email", tech: "Resend", notes: "" },
      { layer: "Model providers", tech: "Anthropic API (sonnet-4-6 default; opus max tier); Gemini (chaosclub.co); OpenAI (TBC)", notes: "no unified cost view; no provider-abstraction layer" },
      { layer: "CRM", tech: "HubSpot", notes: "FF Consulting" },
      { layer: "Automation glue", tech: "n8n + Make + Zapier", notes: "" },
      { layer: "Knowledge", tech: "Notion (FlashFusion HQ)", notes: "" },
    ],
    topology: [
      { app: "app.flashfusion.co", desc: "Fusion AI (Base44, ~101 entities)." },
      { app: "client.flashfusion.co", desc: "FF Consulting ops CRM (Base44 + HubSpot); ROI model pending." },
      { app: "audit.flashfusion.co", desc: "FreeAssessment flow + case-study publishing." },
      { app: "chaosclub.co", desc: "Peer-support app (Firebase + R2 + Stripe + PostHog). Migration-to-Supabase is a design spike only." },
      { app: "mcp.flashfusion.co", desc: "Referenced as a 50-MCP routing platform on Base44 + Manufact Cloud; architecture reference not yet written. Maturity unclear." },
    ],
    hardRules: [
      "Never commit secrets or .env values. Secrets are server-side only, via env vars \u2014 never in client bundles.",
      "Never disable Supabase RLS.",
      "Never modify applied Supabase migrations without explicit instruction.",
      "All data writes idempotent.",
      "No placeholder content \u2014 surface the gap if data is missing.",
      "Regenerate types after schema changes: pnpm supabase gen types typescript.",
    ],
    debt: [
      "Two DB platforms (Supabase everywhere + Firebase on chaosclub.co) \u2014 doubles auth surface, blocks shared RLS. Migration costed but not committed.",
      "No provider-abstraction layer \u2014 model provider changes are not centralized; no unified cost view.",
      "~101 Base44 entities, unknown dead count \u2014 schema bloat, slower agent context.",
      "Home directory initialized as a global Git repo \u2014 unresolved structural workspace debt.",
    ],
  },

  dependency: {
    revenueCriticalPath: [
      "First PAID contract",
      "\u2190 MSA ready",
      "\u2190 E&O bound (affirmative-AI rider)",
      "\u2190 Employment-IP attorney clearance  \u2190 attorney engaged",
      "\u2190 Business bank account",
      "\u2190 EIN",
      "\u2190 LLC filed (confirmed, not \u201Cprepared\u201D)  \u2190 IL SOS search run by Kyle",
    ],
    revenueCriticalNote: "Every arrow above is currently open. The chain is strictly sequential only from LLC\u2192EIN\u2192bank; IP review and E&O quotes can run in parallel with filing and should start today.",
    chains: [
      {
        title: "Credential / partner dependencies",
        lines: ["Anthropic Partner Network application", "\u2190 LLC certificate in hand", "\u2190 kyle@flashfusion.co domain email active", "\u2190 Anthropic certification passed (2026-07-20)"],
      },
      {
        title: "Public credential claims",
        lines: ["Public credential claims", "\u2190 certification pass (2026-07-20)  [never claim before]"],
      },
      {
        title: "Union VP contract",
        lines: ["Union VP contract", "\u2190 board approval (30\u201390 day cycle)", "\u2190 board proposal (one ask + date)", "\u2190 proof section (case study + honest credential + E&O confirmation)", "\u2190 LLC + E&O", "\u2190 initial outreach SENT  \u2190 OVERDUE since Jun 2026"],
      },
      {
        title: "Union/CLC per-cohort pricing",
        lines: ["Union/CLC per-cohort pricing", "\u2190 CLC first-delivery actuals (reference point) \u2014 CLC not yet contacted"],
      },
      {
        title: "Concurrent delivery (>2 engagements)",
        lines: ["Concurrent delivery (>2 engagements)", "\u2190 concurrent-engagement cap decision (recommend 3)"],
      },
      {
        title: "Content dependency",
        lines: ["Press outreach", "\u2190 Load-Bearing live public URL", "\u2190 platform decision (Substack/Ghost/Beehiiv/self-hosted)", "\u2190 platform selection criteria written"],
      },
      {
        title: "Software dependencies",
        lines: ["Fusion AI automation live", "\u2190 11 n8n workflows unblocked", "    \u2190 Base44 Bearer credentials", "    \u2190 SCH-02 lane field added", "    \u2190 4 orphan WIR-01 duplicates removed"],
      },
      {
        title: "Shared RLS across FF apps",
        lines: ["Shared RLS across FF apps", "\u2190 chaosclub.co Firebase\u2192Supabase migration (design spike \u2192 go/no-go first)"],
      },
      {
        title: "Growth Detector automated lead-gen",
        lines: ["Growth Detector automated lead-gen", "\u2190 g1 signal precision validated (>70%)"],
      },
    ],
    crossCutting: [
      "Kyle's time is the top shared dependency across every consulting engagement (single-person bottleneck; see Bottleneck Register).",
      "Certification week (2026-07-20) owns the July calendar; no client delivery scheduled that week.",
    ],
  },
};
