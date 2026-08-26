import { useState, useMemo } from "react";

// ─── SHARED PRIMITIVES ────────────────────────────────────────────────────────

const CAT_ICONS = {
  Governance:"ti-lock", Observability:"ti-eye", Automation:"ti-topology-star",
  Claude:"ti-robot", AWS:"ti-cloud", Sales:"ti-user-search",
  "Dev & Infra":"ti-server", Analytics:"ti-chart-dots", Publishing:"ti-mail",
};

const MODE_CONFIG = {
  work: {
    label: "Work — INT",
    icon: "ti-building",
    accent: "var(--color-text-warning)",
    accentBg: "var(--color-background-warning)",
    accentBorder: "var(--color-border-warning)",
    baseline: [
      { name: "Microsoft 365", note: "Teams, SharePoint, Exchange, OneDrive, Entra ID" },
      { name: "Copilot Studio", note: "Claude Catalyst — Teams/SharePoint deployment" },
    ],
  },
  personal: {
    label: "Personal — Kyle",
    icon: "ti-user",
    accent: "var(--color-text-success)",
    accentBg: "var(--color-background-success)",
    accentBorder: "var(--color-border-success)",
    baseline: [
      { name: "Vercel Pro", note: "Frontend deploy — active" },
      { name: "Supabase", note: "Backend — active" },
      { name: "Cloudflare Pro", note: "Edge, DNS, Workers — active" },
      { name: "GitHub", note: "Repos, Actions CI/CD — active" },
    ],
  },
};

// ─── WORK PLATFORMS (INT) ─────────────────────────────────────────────────────

const WORK_PLATFORMS = [
  // GOVERNANCE
  { id:"w-vanta",         name:"Vanta",               category:"Governance",   icon:"ti-certificate",        pricing:"$500–$1,000/mo",             roi:"Automates SOC 2 / ISO 27001 evidence collection. Audit prep: 200+ hrs → under 20. Directly unlocks enterprise client tiers.", description:"Continuous compliance automation. Monitors controls, collects evidence, preps auditors." },
  { id:"w-purview",       name:"Microsoft Purview",    category:"Governance",   icon:"ti-eye",                pricing:"Bundled or $7/user/mo",       roi:"DLP and audit logging across M365. Required for HIPAA/CMMC clients. Already inside the M365 estate — needs activation only.", description:"Data governance, DLP, information protection, eDiscovery — native to M365." },
  { id:"w-entra-gov",     name:"Entra ID Governance",  category:"Governance",   icon:"ti-id-badge",           pricing:"$7/user/mo (P2 add-on)",      roi:"Access reviews, PIM, entitlement management. SOC 2 access control evidence. Closes the identity governance gap in standard Entra.", description:"Identity governance on Entra ID. Access reviews, PIM, lifecycle workflows." },
  { id:"w-knowbe4",       name:"KnowBe4",              category:"Governance",   icon:"ti-shield-check",       pricing:"$25–$55/user/yr",             roi:"Reduces phishing click-through 60–80%. Required evidence item for cyber insurance. Protects INT's E&O exposure on client environments.", description:"Security awareness training, simulated phishing, compliance reporting." },
  { id:"w-1password",     name:"1Password Teams",      category:"Governance",   icon:"ti-lock",               pricing:"$4–$8/user/mo",               roi:"Team vaults with audit logs satisfy SOC 2 credential controls. Eliminates shared-password risk across all INT staff and client credentials.", description:"Password manager. Team vaults, secret rotation, audit trails, developer secrets." },
  { id:"w-huntress",      name:"Huntress",             category:"Governance",   icon:"ti-radar",              pricing:"$3–$5/endpoint/mo",           roi:"MDR built for MSPs. 24/7 SOC coverage without hiring a security analyst. Displaces 1 FTE equivalent in monitoring cost.", description:"Managed Detection and Response for MSP endpoints. Foothold detection, ransomware canaries." },
  // OBSERVABILITY
  { id:"w-datadog",       name:"Datadog",              category:"Observability",icon:"ti-chart-line",         pricing:"$15–$31/host/mo",             roi:"Unified APM, logs, and traces for INT's client infrastructure. MTTR drops 40–60% vs no-platform baseline. Single pane of glass for MSP clients.", description:"Full-stack observability. APM, logs, metrics, traces, dashboards, alerting." },
  { id:"w-grafana",       name:"Grafana Cloud",        category:"Observability",icon:"ti-topology-star-ring", pricing:"Free–$299/mo",                roi:"Client health dashboards aggregating Azure Monitor, AWS, and on-prem metrics. Open standard — no vendor lock. 150+ connectors.", description:"Metrics, logs, and traces visualization. Prometheus, Loki, Tempo, 150+ sources." },
  { id:"w-azure-monitor", name:"Azure Monitor",        category:"Observability",icon:"ti-activity",           pricing:"Consumption (bundled w/ Azure)",roi:"Native observability for INT's Azure/M365 estate. Log Analytics + Application Insights — already in the estate, activation only.", description:"Azure-native monitoring. Log Analytics, Application Insights, alerts, workbooks." },
  { id:"w-cloudtrail",    name:"AWS CloudTrail",       category:"Observability",icon:"ti-file-search",        pricing:"First trail free, $2/100K",   roi:"Audit log of every AWS API call across INT-managed client environments. Required for SOC 2 and security incident investigation.", description:"AWS API audit logging. Who did what, when, from where — across all services." },
  // AUTOMATION
  { id:"w-power-auto",    name:"Power Automate",       category:"Automation",   icon:"ti-brand-windows",      pricing:"Bundled w/ M365 / $15 premium",roi:"Already licensed. Native connectors to SharePoint, Teams, Copilot Studio. Zero incremental cost at base tier — highest ROI activation in INT's estate.", description:"Microsoft workflow automation. M365 connectors, desktop flows, AI Builder." },
  { id:"w-logic-apps",    name:"Azure Logic Apps",     category:"Automation",   icon:"ti-git-branch",         pricing:"~$0.000025/action",           roi:"Server-side automation for backend INT workflows needing Azure integration (SQL, Service Bus, Event Grid). Complements Power Automate.", description:"Azure-native integration workflows. 400+ connectors, enterprise event-driven patterns." },
  { id:"w-zapier",        name:"Zapier",               category:"Automation",   icon:"ti-plug-connected",     pricing:"$49–$299/mo",                 roi:"No-code automation for ops and service desk without dev involvement. Bridges SaaS tools outside the Microsoft ecosystem. 6000+ integrations.", description:"No-code automation. 6000+ integrations, multi-step workflows, Tables, Interfaces." },
  // CLAUDE
  { id:"w-claude-teams",  name:"Claude Teams",         category:"Claude",       icon:"ti-users-group",        pricing:"$30/user/mo",                 roi:"Licensed access for all INT staff — admin controls, centralized billing, team Projects. No personal accounts required. No data used for training.", description:"claude.ai Teams. Admin console, team workspaces, centralized billing, data privacy." },
  { id:"w-claude-excel",  name:"Claude for Excel",     category:"Claude",       icon:"ti-table",              pricing:"Included w/ Teams/Enterprise", roi:"AI-native Excel for non-technical INT staff. Formula generation, data analysis, report automation. Highest adoption ceiling of any Claude product.", description:"Claude inside Excel. Formula help, data analysis, chart generation, natural language queries." },
  { id:"w-claude-ppt",    name:"Claude for PowerPoint",category:"Claude",       icon:"ti-presentation",       pricing:"Included w/ Teams/Enterprise", roi:"Draft and iterate decks in PowerPoint. Cuts time on client presentations and Claude Ecosystem Mastery training materials.", description:"Claude inside PowerPoint. Slide generation, content rewrite, speaker notes." },
  { id:"w-claude-bedrock",name:"Claude on AWS Bedrock",category:"Claude",       icon:"ti-cloud-computing",    pricing:"AWS usage-based (no markup)",  roi:"Claude inside AWS VPC. Data never leaves the cloud boundary — required for HIPAA, FedRAMP, and enterprise clients with data residency mandates.", description:"Claude via AWS Bedrock. Private deployment, IAM auth, VPC isolation, no data retention." },
  // AWS
  { id:"w-aws-bedrock",   name:"AWS Bedrock",          category:"AWS",          icon:"ti-box",                pricing:"Usage-based (token pricing)",  roi:"Foundation model access with AWS-native security. Enables private Claude deployment for enterprise INT clients who can't use shared SaaS.", description:"Managed foundation models via AWS. Claude, Titan, Llama — IAM, VPC, no training on data." },
  { id:"w-aws-s3",        name:"AWS S3",               category:"AWS",          icon:"ti-cylinder",           pricing:"$0.023/GB/mo",                roi:"Document archive for INT client data with lifecycle policies, versioning, and presigned URL delivery. Cheap, durable, no ops overhead.", description:"Object storage. Unlimited scale, versioning, lifecycle policies, presigned URLs." },
  { id:"w-aws-guardduty", name:"AWS GuardDuty",        category:"AWS",          icon:"ti-shield",             pricing:"~$4–$8/account/mo",           roi:"ML threat detection on CloudTrail and VPC flows. Catches credential compromise automatically. Low overhead, high signal — no analyst needed.", description:"Intelligent AWS threat detection. CloudTrail, VPC flows, DNS anomaly analysis." },
  { id:"w-aws-ct",        name:"AWS Control Tower",    category:"AWS",          icon:"ti-building-skyscraper",pricing:"Free (underlying services)",   roi:"Multi-account governance for INT's AWS footprint. Enforces security baselines and SCPs automatically. Required for managing client AWS environments.", description:"AWS multi-account governance. Landing zone, guardrails, SCPs, account factory." },
  { id:"w-aws-sechub",    name:"AWS Security Hub",     category:"AWS",          icon:"ti-shield-lock",        pricing:"$0.001/check/mo",             roi:"Aggregates GuardDuty, Config, and Inspector findings into one posture score. Turns fragmented signals into an exec dashboard Dave and Jackie can read.", description:"Centralized AWS security posture. Aggregates findings, CSPM checks, compliance scores." },
  { id:"w-aws-config",    name:"AWS Config",           category:"AWS",          icon:"ti-adjustments",        pricing:"$0.003/config item",          roi:"Continuous resource config tracking. Answers 'what changed and when.' Essential for SOC 2 change management evidence.", description:"AWS resource config history and compliance rules. Drift detection, remediation." },
  // SALES
  { id:"w-apollo",        name:"Apollo.io",            category:"Sales",        icon:"ti-user-search",        pricing:"$49–$99/user/mo",             roi:"MSP and enterprise prospect enrichment. 270M+ contacts, email sequencing, intent signals. ICP-matched outreach for INT's client acquisition motion.", description:"Sales intelligence + engagement. Contact database, sequencing, enrichment, dialer, intent." },
  { id:"w-hubspot",       name:"HubSpot CRM",          category:"Sales",        icon:"ti-chart-arrows",       pricing:"Free–$1,200/mo",              roi:"Client lifecycle management and upsell tracking. Apollo feeds into HubSpot — covers prospecting through close. Free tier handles pipeline management.", description:"CRM, marketing, sales, and service hub. Free tier scales to full revenue ops platform." },
];

// ─── PERSONAL PLATFORMS (KYLE) ────────────────────────────────────────────────

const PERSONAL_PLATFORMS = [
  // CLAUDE
  { id:"k-claude-pro",   name:"Claude Pro",            category:"Claude",      icon:"ti-robot",              pricing:"$20/mo",                      roi:"Primary AI workspace. Projects, Memory, Artifacts, 50+ MCP connectors, extended thinking. Foundation for all consulting output.", description:"claude.ai Pro. Projects, Memory, Artifacts, web search, file creation, MCP connectors." },
  { id:"k-claude-max",   name:"Claude Max",            category:"Claude",      icon:"ti-rocket",             pricing:"$100–$200/mo",                roi:"5x–20x usage limits over Pro. Eliminates rate-limit friction during high-output consulting sessions. Justified at 3+ cap-hits per week.", description:"claude.ai Max. All Pro features, highest usage limits, priority access." },
  { id:"k-claude-api",   name:"Claude API",            category:"Claude",      icon:"ti-code",               pricing:"~$3–$75/MTok",                roi:"Powers embedded AI in consulting tools and automated pipelines. Core delivery engine for the AI Customization Service.", description:"Anthropic API. Messages, tool use, batch, prompt caching, streaming, structured output." },
  { id:"k-claude-code",  name:"Claude Code",           category:"Claude",      icon:"ti-terminal",           pricing:"Usage-based (API tokens)",    roi:"Terminal-native agentic coder. Multi-file refactors, PR generation, full codebase understanding. Cuts build delivery time 40–60%.", description:"CLI coding agent. Codebase nav, PR creation, test writing, hooks, headless mode." },
  { id:"k-claude-vscode",name:"Claude Code — VS Code", category:"Claude",      icon:"ti-brand-vscode",       pricing:"Free (API credits)",          roi:"Claude Code inline in VS Code. Inline diff UI, no context-switch between editor and terminal. Zero incremental cost over API.", description:"VS Code extension for Claude Code. Inline suggestions, diff view, terminal integration." },
  { id:"k-claude-bedrock",name:"Claude on AWS Bedrock",category:"Claude",      icon:"ti-cloud-computing",    pricing:"AWS usage-based",             roi:"Claude inside AWS VPC for consulting clients with data residency requirements. Same model, private boundary, IAM auth.", description:"Claude via AWS Bedrock. Private deployment, IAM auth, no data retention, VPC isolation." },
  // DEV & INFRA
  { id:"k-n8n",          name:"n8n Cloud",             category:"Dev & Infra", icon:"ti-topology-star",      pricing:"$24/mo",                      roi:"100-automation catalog. Each workflow displaces 1–5 hrs/mo. Code + AI nodes give the highest ceiling of any automation platform.", description:"Workflow automation. 400+ integrations, code nodes, AI agent nodes." },
  { id:"k-zapier",       name:"Zapier",                category:"Dev & Infra", icon:"ti-plug-connected",     pricing:"$49–$299/mo",                 roi:"Bridges SaaS tools outside n8n's native connector set. Long-tail integrations with zero custom code.", description:"No-code automation. 6000+ integrations, multi-step Zaps, Tables, Interfaces." },
  { id:"k-make",         name:"Make",                  category:"Dev & Infra", icon:"ti-circles-relation",   pricing:"$9–$29/mo",                   roi:"Visual data transformation and multi-branch scenarios. Handles structured data flows that Zapier can't model cleanly.", description:"Visual workflow automation. Data mapping, routers, iterators, HTTP modules." },
  { id:"k-supabase",     name:"Supabase",              category:"Dev & Infra", icon:"ti-database",           pricing:"$25/mo",                      roi:"Auth + RLS + Postgres in one — replaces 3 separate subscriptions. No managed DB overhead for consulting-built apps.", description:"Backend-as-a-service. Postgres, auth, realtime, storage, edge functions." },
  { id:"k-stripe",       name:"Stripe",                category:"Dev & Infra", icon:"ti-credit-card",        pricing:"2.9% + $0.30/txn",            roi:"Revenue infrastructure for AI Customization Service and Notion Marketplace products. Required from day one of monetization.", description:"Payment processing, subscriptions, invoicing, Connect for marketplaces." },
  { id:"k-resend",       name:"Resend",                category:"Dev & Infra", icon:"ti-mail-forward",       pricing:"$20/mo",                      roi:"Transactional email API for consulting tools. Developer-first — no SMTP config. React email templates.", description:"Email delivery API. React email templates, webhooks, domain management." },
  // AWS
  { id:"k-aws-lambda",   name:"AWS Lambda",            category:"AWS",         icon:"ti-function",           pricing:"$0.20/1M requests + compute", roi:"Serverless execution for automation triggers and API backends. Pairs with Step Functions for production Claude pipelines. Zero idle cost.", description:"Serverless compute. Event-driven, 15-min max, 1ms billing." },
  { id:"k-aws-eb",       name:"AWS EventBridge",       category:"AWS",         icon:"ti-antenna",            pricing:"$1/million events",           roi:"Event bus for decoupled automation. Routes SaaS events (Stripe, HubSpot) to Lambda without polling. Core for production agentic systems.", description:"Serverless event bus. SaaS integrations, event routing, pipes, scheduler." },
  { id:"k-aws-s3",       name:"AWS S3",                category:"AWS",         icon:"ti-cylinder",           pricing:"$0.023/GB/mo",                roi:"File storage for consulting tool artifacts, batch API inputs, and client deliverables. No ops overhead.", description:"Object storage. Unlimited scale, versioning, lifecycle policies, presigned URLs." },
  { id:"k-step-fn",      name:"AWS Step Functions",    category:"AWS",         icon:"ti-sitemap",            pricing:"$0.025/1K transitions",       roi:"Orchestrates multi-step Claude API pipelines with retries and branching. Better than Lambda chains for agentic workflows.", description:"Workflow orchestration. State machines, retries, error handling, parallel branches." },
  { id:"k-cloudtrail",   name:"AWS CloudTrail",        category:"AWS",         icon:"ti-file-search",        pricing:"First trail free, $2/100K",   roi:"Audit trail for AWS-hosted consulting tools. Required for any client with SOC 2 or security review requirements.", description:"AWS API audit logging. Who did what, when, from where." },
  // OBSERVABILITY
  { id:"k-sentry",       name:"Sentry",                category:"Observability",icon:"ti-bug",               pricing:"$26–$80/mo",                  roi:"Error tracking with full stack traces and session replay. Cuts debugging time 50%+ vs raw logs. MCP connector active.", description:"Application error tracking, performance monitoring, session replay." },
  { id:"k-posthog",      name:"PostHog",               category:"Observability",icon:"ti-chart-dots",        pricing:"Free–$450/mo",                roi:"Product analytics for consulting tools. Funnels, feature flags, session recording. Replaces Mixpanel + Hotjar.", description:"Open-source product analytics. Events, funnels, A/B flags, recordings, SQL." },
  { id:"k-grafana",      name:"Grafana Cloud",         category:"Observability",icon:"ti-topology-star-ring",pricing:"Free–$299/mo",                roi:"Unified dashboards across Supabase, Cloudflare, n8n, and AWS services. Open standard, no vendor lock.", description:"Metrics, logs, and traces visualization. 150+ connectors." },
  { id:"k-datadog",      name:"Datadog",               category:"Observability",icon:"ti-chart-line",        pricing:"$15–$31/host/mo",             roi:"Full APM and log aggregation for consulting-built production apps. Unified view vs separate tools per service.", description:"Full-stack observability. APM, logs, metrics, traces, dashboards, alerting." },
  // ANALYTICS & PUBLISHING
  { id:"k-apollo",       name:"Apollo.io",             category:"Sales",       icon:"ti-user-search",        pricing:"$49–$99/user/mo",             roi:"ICP prospect list building for the AI Customization Service. Intent data, sequencing, and enrichment for consulting outreach.", description:"Sales intelligence. 270M+ contacts, sequencing, enrichment, dialer, intent signals." },
  { id:"k-hubspot",      name:"HubSpot CRM",           category:"Sales",       icon:"ti-chart-arrows",       pricing:"Free–$1,200/mo",              roi:"Consulting pipeline management and lead tracking. Free tier covers the full motion until deal volume justifies paid.", description:"CRM, marketing, sales, service hub. Free tier scales to full revenue ops." },
  { id:"k-close",        name:"Close CRM",             category:"Sales",       icon:"ti-phone-call",         pricing:"$49–$139/user/mo",            roi:"Sales-native CRM with built-in calling and sequencing. Evaluate against HubSpot — running both is redundant at solo consulting scale.", description:"CRM for outbound. Built-in calling, SMS, sequences, pipeline reporting." },
  { id:"k-beehiiv",      name:"Beehiiv",               category:"Publishing",  icon:"ti-mail",               pricing:"$39–$99/mo",                  roi:"Newsletter platform for The Prompt. Better B2B analytics, segmentation, and monetization than Substack. Referral engine built in.", description:"Newsletter platform. Segmentation, analytics, paid subscriptions, referrals." },
  { id:"k-lemon",        name:"Lemon Squeezy",         category:"Publishing",  icon:"ti-shopping-cart",      pricing:"5% + $0.50/txn",              roi:"Merchant of record for Notion Marketplace products. Handles VAT and sales tax globally — a legal gap Stripe alone doesn't cover for digital goods.", description:"Digital product storefront. Merchant of record, VAT handling, license keys, SaaS billing." },
];

// ─── BUNDLES ──────────────────────────────────────────────────────────────────

const WORK_BUNDLES = [
  {
    id:"wb-compliance", name:"INT Compliance Posture", icon:"ti-certificate",
    pricing:"~$600–$1,200/mo + per-user",
    pitch:"Everything needed to pass a SOC 2 audit, satisfy cyber insurance requirements, and protect INT's E&O exposure. Justify as a single line item — these tools only make sense together.",
    combined_roi:"SOC 2 Type II unlocks enterprise-tier clients at $50K–$200K ACV. Cyber insurance discounts 10–30% with documented controls. Audit prep drops from 200+ hrs/yr to under 20.",
    platform_ids:["w-vanta","w-purview","w-entra-gov","w-knowbe4","w-1password","w-huntress"],
  },
  {
    id:"wb-claude", name:"Claude Ecosystem — INT", icon:"ti-robot",
    pricing:"$30/user/mo + usage",
    pitch:"Full Claude deployment across INT staff. Teams for licensed access and admin controls, Excel and PPT plugins for the non-technical majority, Bedrock for client environments requiring private VPC deployment.",
    combined_roi:"Teams license covers the org. Excel and PPT plugins are included at no incremental cost. Bedrock opens healthcare, legal, and government opportunities blocked by data residency requirements.",
    platform_ids:["w-claude-teams","w-claude-excel","w-claude-ppt","w-claude-bedrock"],
  },
  {
    id:"wb-aws-sec", name:"AWS Security & Governance", icon:"ti-shield-lock",
    pricing:"~$50–$200/mo (mostly consumption)",
    pitch:"Security posture for any AWS workloads INT manages or builds. GuardDuty catches threats, Security Hub aggregates findings, Config tracks drift, Control Tower enforces guardrails across accounts.",
    combined_roi:"CloudTrail + Config satisfy SOC 2 CC6–CC8 audit trail requirements. GuardDuty + Security Hub give leadership a single cloud security dashboard without analyst headcount.",
    platform_ids:["w-aws-guardduty","w-aws-ct","w-aws-sechub","w-aws-config","w-cloudtrail"],
  },
  {
    id:"wb-automation", name:"INT Automation Stack", icon:"ti-git-branch",
    pricing:"$49–$350/mo + M365 (bundled)",
    pitch:"Power Automate is already licensed — activate it. Logic Apps handles backend Azure integration. Zapier bridges any SaaS tool outside Microsoft. Three layers covering 95% of INT's automation surface.",
    combined_roi:"Power Automate is $0 incremental. Logic Apps is consumption-only. Zapier at $49/mo base. Together: service desk routing, onboarding, SharePoint sync, and client reporting automated within 90 days.",
    platform_ids:["w-power-auto","w-logic-apps","w-zapier"],
  },
  {
    id:"wb-obs", name:"INT Observability Stack", icon:"ti-eye",
    pricing:"~$100–$500/mo depending on scale",
    pitch:"Datadog for client infrastructure and APM, Grafana for cross-source dashboards, Azure Monitor for the M365 estate, CloudTrail for AWS audit logs. Each has a distinct lane — they don't overlap.",
    combined_roi:"Single pane of glass for MSP client environments. MTTR drops 40–60%. Proactive alerting on client issues before tickets are raised — measurable service quality differentiator.",
    platform_ids:["w-datadog","w-grafana","w-azure-monitor","w-cloudtrail"],
  },
  {
    id:"wb-sales", name:"INT Sales & GTM", icon:"ti-user-search",
    pricing:"$49–$1,300/mo",
    pitch:"Apollo builds and enriches the prospect list. HubSpot manages the pipeline from first touch to close. Together they cover the full revenue motion without a dedicated sales ops hire.",
    combined_roi:"Apollo typically yields 3–5x ROI on outbound when ICP is defined. HubSpot free tier covers pipeline management until volume justifies paid. Justify as the INT revenue infrastructure line item.",
    platform_ids:["w-apollo","w-hubspot"],
  },
];

const PERSONAL_BUNDLES = [
  {
    id:"kb-claude", name:"Claude Consulting Stack", icon:"ti-rocket",
    pricing:"$150–$350/mo + API usage",
    pitch:"End-to-end Claude stack for consulting delivery. Pro or Max for the daily workspace, API for embedded tools and pipelines, Code for agentic builds, VS Code extension for inline delivery. These five work as a unit.",
    combined_roi:"Pro/Max covers daily output. API powers client-facing tools. Claude Code cuts multi-file build time 40–60%. VS Code extension removes context-switch. Together: the AI Customization Service runs on this stack.",
    platform_ids:["k-claude-pro","k-claude-max","k-claude-api","k-claude-code","k-claude-vscode"],
  },
  {
    id:"kb-aws", name:"AWS Serverless Foundation", icon:"ti-function",
    pricing:"Pay-per-use (~$5–$50/mo at low scale)",
    pitch:"Minimal AWS footprint for production AI pipelines. Lambda executes, EventBridge decouples routing, S3 stores inputs and outputs, Step Functions orchestrates multi-step Claude workflows with retries.",
    combined_roi:"Zero idle cost — pay on invocation only. Replaces a $100+/mo always-on VM for background jobs. Step Functions provides visual debugging and built-in retry logic for agentic pipeline failures.",
    platform_ids:["k-aws-lambda","k-aws-eb","k-aws-s3","k-step-fn","k-cloudtrail"],
  },
  {
    id:"kb-automation", name:"Kyle Automation Stack", icon:"ti-topology-star",
    pricing:"$82–$350/mo",
    pitch:"Three-layer automation for different job types. n8n runs the 100-skill catalog and AI-native workflows. Zapier covers the SaaS long tail. Make handles structured data transformation scenarios. Each has a lane.",
    combined_roi:"n8n alone displaces 100–500 hrs/yr across the catalog. Zapier covers integrations n8n can't reach natively. Make handles data-heavy transforms. Together they eliminate virtually all manual repetitive work.",
    platform_ids:["k-n8n","k-zapier","k-make","k-step-fn"],
  },
  {
    id:"kb-obs", name:"Consulting Observability", icon:"ti-bug",
    pricing:"~$50–$500/mo depending on scale",
    pitch:"Sentry and PostHog are the core — error tracking and product analytics for every consulting-built tool. Grafana and Datadog add infrastructure visibility when apps grow beyond a single service.",
    combined_roi:"Sentry cuts debugging time 50%+. PostHog replaces Mixpanel + Hotjar. Together they give you full visibility into what broke and how users are behaving — required for any client-facing tool.",
    platform_ids:["k-sentry","k-posthog","k-grafana","k-datadog"],
  },
  {
    id:"kb-sales", name:"Kyle Sales & GTM", icon:"ti-user-search",
    pricing:"$49–$1,300/mo",
    pitch:"Apollo builds the AI Customization Service prospect list with intent data and ICP filtering. HubSpot or Close manages the pipeline. Pick one CRM — running both is redundant at solo consulting scale.",
    combined_roi:"Apollo + HubSpot (free) covers the full outbound motion at minimal cost. Upgrade HubSpot when deal volume exceeds what the free tier tracks. Drop Close if HubSpot covers the workflow.",
    platform_ids:["k-apollo","k-hubspot","k-close"],
  },
  {
    id:"kb-publish", name:"Publishing & Monetization", icon:"ti-mail",
    pricing:"~$60–$200/mo + transaction fees",
    pitch:"Beehiiv runs The Prompt newsletter with real analytics and a monetization layer. Lemon Squeezy is the merchant of record for Notion Marketplace products — legally required for global digital goods sales.",
    combined_roi:"Beehiiv's referral engine can grow a B2B list 2–3x faster than organic. Lemon Squeezy removes the VAT/sales tax liability that would otherwise require a tax attorney in 40+ countries. Both are revenue enablers, not nice-to-haves.",
    platform_ids:["k-beehiiv","k-lemon"],
  },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

const PLATFORM_MAP = Object.fromEntries([...WORK_PLATFORMS,...PERSONAL_PLATFORMS].map(p=>[p.id,p]));

export default function App() {
  const [mode, setMode] = useState("work"); // "work" | "personal"
  const [owned,   setOwned]   = useState({ work: new Set(), personal: new Set() });
  const [wanted,  setWanted]  = useState({ work: new Set(), personal: new Set() });
  const [expanded, setExpanded] = useState(new Set());
  const [view, setView] = useState("bundles");
  const [activeCategory, setActiveCategory] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");

  const cfg = MODE_CONFIG[mode];
  const platforms = mode === "work" ? WORK_PLATFORMS : PERSONAL_PLATFORMS;
  const bundles   = mode === "work" ? WORK_BUNDLES   : PERSONAL_BUNDLES;
  const ownedSet  = owned[mode];
  const wantedSet = wanted[mode];

  const setOwn  = id => setOwned(prev => {
    const s = new Set(prev[mode]);
    if (s.has(id)) { s.delete(id); } else { s.add(id); setWanted(w => { const n=new Set(w[mode]); n.delete(id); return {...w,[mode]:n}; }); }
    return {...prev, [mode]:s};
  });
  const setWant = id => setWanted(prev => {
    const s = new Set(prev[mode]);
    if (s.has(id)) { s.delete(id); } else { s.add(id); setOwned(o => { const n=new Set(o[mode]); n.delete(id); return {...o,[mode]:n}; }); }
    return {...prev, [mode]:s};
  });
  const getState = id => ownedSet.has(id) ? "owned" : wantedSet.has(id) ? "wanted" : "none";

  const addBundle = bundle => {
    bundle.platform_ids.forEach(id => { if (!ownedSet.has(id)) setWant(id); });
  };
  const toggleExpand = id => setExpanded(prev => { const s=new Set(prev); s.has(id)?s.delete(id):s.add(id); return s; });

  const categories = useMemo(() => ["All",...new Set(platforms.map(p=>p.category))], [platforms]);

  const filtered = useMemo(() => platforms.filter(p => {
    if (activeCategory !== "All" && p.category !== activeCategory) return false;
    if (tagFilter === "Have"     && !ownedSet.has(p.id))  return false;
    if (tagFilter === "Want"     && !wantedSet.has(p.id)) return false;
    if (tagFilter === "Untagged" && (ownedSet.has(p.id)||wantedSet.has(p.id))) return false;
    return true;
  }), [platforms, activeCategory, tagFilter, ownedSet, wantedSet]);

  const ownedList  = platforms.filter(p=>ownedSet.has(p.id));
  const wantedList = platforms.filter(p=>wantedSet.has(p.id));

  // Reset category when mode switches
  const switchMode = m => { setMode(m); setActiveCategory("All"); setTagFilter("All"); setView("bundles"); };

  const Chip = ({ label, color, bg }) => (
    <span style={{ fontSize:"10px", padding:"2px 7px", borderRadius:"var(--border-radius-md)", background:bg, color, whiteSpace:"nowrap" }}>{label}</span>
  );

  const TogglePair = ({ id }) => {
    const state = getState(id);
    return (
      <div style={{ display:"flex", gap:"5px", flexShrink:0 }}>
        {[{type:"owned",label:"Have it",icon:"ti-check"},{type:"wanted",label:"Want it",icon:"ti-plus"}].map(({type,label,icon})=>{
          const active = state===type;
          const isOwned = type==="owned";
          return (
            <button key={type} onClick={()=>isOwned?setOwn(id):setWant(id)} aria-pressed={active} style={{
              fontSize:"12px", padding:"4px 10px", cursor:"pointer", display:"flex", alignItems:"center", gap:"4px",
              borderRadius:"var(--border-radius-md)",
              background: active ? (isOwned?"var(--color-background-success)":"var(--color-background-warning)") : "transparent",
              border:`0.5px solid ${active?(isOwned?"var(--color-border-success)":"var(--color-border-warning)"):"var(--color-border-tertiary)"}`,
              color: active ? (isOwned?"var(--color-text-success)":"var(--color-text-warning)") : "var(--color-text-secondary)",
              fontWeight: active?500:400,
            }}>
              <i className={`ti ${icon}`} style={{fontSize:"11px"}} aria-hidden="true"/>
              {label}
            </button>
          );
        })}
      </div>
    );
  };

  const PlatformCard = ({ id, compact }) => {
    const p = PLATFORM_MAP[id];
    if (!p) return null;
    const state = getState(id);
    const borderColor = state==="owned"?"var(--color-border-success)":state==="wanted"?"var(--color-border-warning)":"var(--color-border-tertiary)";
    return (
      <div style={{ display:"flex", alignItems: compact?"center":"flex-start", gap:"12px", padding: compact?"9px 12px":"12px 14px",
        border:`0.5px solid ${borderColor}`, borderRadius:"var(--border-radius-md)",
        background: state!=="none"?"var(--color-background-primary)":"transparent" }}>
        <i className={`ti ${p.icon}`} style={{ fontSize:"15px", flexShrink:0, marginTop: compact?0:"2px",
          color:state==="owned"?"var(--color-text-success)":state==="wanted"?"var(--color-text-warning)":"var(--color-text-secondary)" }} aria-hidden="true"/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom: compact?0:"3px", flexWrap:"wrap" }}>
            <span style={{ fontWeight:500, fontSize:"13px" }}>{p.name}</span>
            <span style={{ fontSize:"11px", color:"var(--color-text-secondary)", marginLeft:"auto", whiteSpace:"nowrap" }}>{p.pricing}</span>
          </div>
          {!compact && <p style={{ margin:"0 0 6px", fontSize:"12px", color:"var(--color-text-secondary)", lineHeight:1.5 }}>{p.description}</p>}
          {!compact && (
            <div style={{ background:"var(--color-background-secondary)", borderRadius:"var(--border-radius-md)", padding:"7px 10px" }}>
              <div style={{ fontSize:"10px", color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:"2px" }}>ROI angle</div>
              <p style={{ margin:0, fontSize:"12px", lineHeight:1.5 }}>{p.roi}</p>
            </div>
          )}
        </div>
        <TogglePair id={id} />
      </div>
    );
  };

  const BundleCard = ({ bundle }) => {
    const ownedN  = bundle.platform_ids.filter(id=>ownedSet.has(id)).length;
    const wantedN = bundle.platform_ids.filter(id=>wantedSet.has(id)).length;
    const total   = bundle.platform_ids.length;
    const allTagged = ownedN+wantedN===total;
    const allOwned  = ownedN===total;
    const isOpen    = expanded.has(bundle.id);

    return (
      <div style={{ border:`0.5px solid ${allTagged?"var(--color-border-info)":"var(--color-border-tertiary)"}`, borderRadius:"var(--border-radius-lg)", overflow:"hidden" }}>
        <div style={{ padding:"16px", background:allTagged?"var(--color-background-info)":"transparent" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"8px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <i className={`ti ${bundle.icon}`} style={{ fontSize:"18px", color:allTagged?"var(--color-text-info)":"var(--color-text-secondary)" }} aria-hidden="true"/>
              <div>
                <div style={{ fontWeight:500, fontSize:"14px" }}>{bundle.name}</div>
                <div style={{ fontSize:"12px", color:"var(--color-text-secondary)" }}>{bundle.pricing}</div>
              </div>
            </div>
            <span style={{ fontSize:"11px", color:"var(--color-text-secondary)", whiteSpace:"nowrap", marginLeft:"8px" }}>{ownedN+wantedN}/{total} tagged</span>
          </div>
          <p style={{ margin:"0 0 10px", fontSize:"13px", lineHeight:1.5, color:"var(--color-text-secondary)" }}>{bundle.pitch}</p>
          <div style={{ background:"var(--color-background-secondary)", borderRadius:"var(--border-radius-md)", padding:"8px 12px", marginBottom:"12px" }}>
            <div style={{ fontSize:"10px", color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:"3px" }}>Combined ROI</div>
            <p style={{ margin:0, fontSize:"12px", lineHeight:1.5 }}>{bundle.combined_roi}</p>
          </div>
          {/* Platform chips */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:"5px", marginBottom:"12px" }}>
            {bundle.platform_ids.map(id=>{
              const p=PLATFORM_MAP[id]; if(!p)return null;
              const state=getState(id);
              return (
                <span key={id} style={{ fontSize:"11px", padding:"2px 8px", borderRadius:"var(--border-radius-md)", display:"flex", alignItems:"center", gap:"4px",
                  border:`0.5px solid ${state==="owned"?"var(--color-border-success)":state==="wanted"?"var(--color-border-warning)":"var(--color-border-tertiary)"}`,
                  background:state==="owned"?"var(--color-background-success)":state==="wanted"?"var(--color-background-warning)":"transparent",
                  color:state==="owned"?"var(--color-text-success)":state==="wanted"?"var(--color-text-warning)":"var(--color-text-secondary)",
                }}>
                  {state!=="none"&&<i className={`ti ${state==="owned"?"ti-check":"ti-plus"}`} style={{fontSize:"10px"}} aria-hidden="true"/>}
                  {p.name}
                </span>
              );
            })}
          </div>
          {/* Actions */}
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
            <button onClick={()=>addBundle(bundle)} disabled={allOwned} style={{
              fontSize:"12px", padding:"5px 14px", cursor:allOwned?"default":"pointer", display:"flex", alignItems:"center", gap:"5px",
              background:allOwned?"transparent":"var(--color-background-warning)",
              border:`0.5px solid ${allOwned?"var(--color-border-tertiary)":"var(--color-border-warning)"}`,
              borderRadius:"var(--border-radius-md)",
              color:allOwned?"var(--color-text-secondary)":"var(--color-text-warning)",
              fontWeight:allOwned?400:500, opacity:allOwned?0.5:1,
            }}>
              <i className="ti ti-plus" style={{fontSize:"12px"}} aria-hidden="true"/>
              {allOwned?"All confirmed":ownedN+wantedN===0?"Add all to Want it":"Add remaining to Want it"}
            </button>
            <button onClick={()=>toggleExpand(bundle.id)} style={{
              fontSize:"12px", padding:"5px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px",
              background:"transparent", border:"0.5px solid var(--color-border-tertiary)",
              borderRadius:"var(--border-radius-md)", color:"var(--color-text-secondary)",
            }}>
              <i className={`ti ${isOpen?"ti-chevron-up":"ti-chevron-down"}`} style={{fontSize:"12px"}} aria-hidden="true"/>
              {isOpen?"Collapse":"Expand platforms"}
            </button>
          </div>
        </div>
        {isOpen && (
          <div style={{ borderTop:"0.5px solid var(--color-border-tertiary)", padding:"12px", display:"grid", gap:"6px" }}>
            {bundle.platform_ids.map(id=><PlatformCard key={id} id={id} compact={false}/>)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding:"1rem 0" }}>
      <h2 style={{ position:"absolute", opacity:0, pointerEvents:"none" }}>Subscription catalog</h2>

      {/* ── MODE SWITCHER ──────────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"20px" }}>
        {["work","personal"].map(m=>{
          const c=MODE_CONFIG[m]; const active=mode===m;
          return (
            <button key={m} onClick={()=>switchMode(m)} style={{
              padding:"14px 16px", cursor:"pointer", borderRadius:"var(--border-radius-lg)", textAlign:"left",
              border:`0.5px solid ${active?c.accentBorder:"var(--color-border-tertiary)"}`,
              background:active?c.accentBg:"transparent",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
                <i className={`ti ${c.icon}`} style={{ fontSize:"16px", color:active?c.accent:"var(--color-text-secondary)" }} aria-hidden="true"/>
                <span style={{ fontWeight:600, fontSize:"14px", color:active?c.accent:"var(--color-text-primary)" }}>{c.label}</span>
                {active && <i className="ti ti-check" style={{ fontSize:"13px", color:c.accent, marginLeft:"auto" }} aria-hidden="true"/>}
              </div>
              <div style={{ fontSize:"12px", color:"var(--color-text-secondary)", paddingLeft:"24px" }}>
                {m==="work"
                  ? `${(owned.work.size+wanted.work.size)} tagged · ${WORK_PLATFORMS.length} platforms · ${WORK_BUNDLES.length} bundles`
                  : `${(owned.personal.size+wanted.personal.size)} tagged · ${PERSONAL_PLATFORMS.length} platforms · ${PERSONAL_BUNDLES.length} bundles`}
              </div>
            </button>
          );
        })}
      </div>

      {/* Baseline */}
      <div style={{ display:"flex", gap:"5px", marginBottom:"14px", flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:"11px", color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:"0.05em" }}>Confirmed baseline:</span>
        {cfg.baseline.map(b=>(
          <div key={b.name} style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"12px", background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-md)", padding:"3px 10px" }}>
            <i className="ti ti-check" style={{ fontSize:"12px", color:"var(--color-text-success)" }} aria-hidden="true"/>
            <span style={{ fontWeight:500 }}>{b.name}</span>
            <span style={{ color:"var(--color-text-secondary)" }}>— {b.note}</span>
          </div>
        ))}
      </div>

      {/* Sub-nav */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px", flexWrap:"wrap", gap:"8px" }}>
        <div style={{ display:"flex", gap:"5px" }}>
          {[
            { id:"bundles",  label:"Bundles",                          icon:"ti-packages" },
            { id:"catalog",  label:"All platforms",                    icon:"ti-layout-grid" },
            { id:"review",   label:`Review (${ownedSet.size+wantedSet.size})`, icon:"ti-list-check" },
          ].map(({id,label,icon})=>(
            <button key={id} onClick={()=>setView(id)} style={{
              display:"flex", alignItems:"center", gap:"5px", fontSize:"12px", padding:"5px 12px",
              background:view===id?"var(--color-background-secondary)":"transparent",
              border:`0.5px solid ${view===id?"var(--color-border-primary)":"var(--color-border-tertiary)"}`,
              borderRadius:"var(--border-radius-md)", fontWeight:view===id?500:400,
              color:view===id?"var(--color-text-primary)":"var(--color-text-secondary)", cursor:"pointer",
            }}>
              <i className={`ti ${icon}`} style={{fontSize:"13px"}} aria-hidden="true"/>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:"10px", fontSize:"12px" }}>
          <span style={{ color:"var(--color-text-success)" }}><i className="ti ti-check" aria-hidden="true"/> {ownedSet.size} have it</span>
          <span style={{ color:"var(--color-text-warning)" }}><i className="ti ti-plus" aria-hidden="true"/> {wantedSet.size} want it</span>
        </div>
      </div>

      {/* ── BUNDLES ──────────────────────────────────────────────── */}
      {view==="bundles" && (
        <div style={{ display:"grid", gap:"12px" }}>
          {bundles.map(b=><BundleCard key={b.id} bundle={b}/>)}
        </div>
      )}

      {/* ── CATALOG ──────────────────────────────────────────────── */}
      {view==="catalog" && (
        <>
          <div style={{ display:"flex", gap:"5px", marginBottom:"10px", flexWrap:"wrap" }}>
            {categories.map(c=>{
              const on=activeCategory===c;
              return (
                <button key={c} onClick={()=>setActiveCategory(c)} style={{
                  display:"flex", alignItems:"center", gap:"4px", fontSize:"12px", padding:"4px 10px",
                  background:on?"var(--color-background-secondary)":"transparent",
                  border:`0.5px solid ${on?"var(--color-border-primary)":"var(--color-border-tertiary)"}`,
                  borderRadius:"var(--border-radius-md)", fontWeight:on?500:400,
                  color:on?"var(--color-text-primary)":"var(--color-text-secondary)", cursor:"pointer",
                }}>
                  {c!=="All"&&<i className={`ti ${CAT_ICONS[c]||"ti-point"}`} style={{fontSize:"12px"}} aria-hidden="true"/>}
                  {c}
                </button>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:"5px", marginBottom:"14px", flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ fontSize:"12px", color:"var(--color-text-secondary)" }}>Show:</span>
            {[{id:"All",label:"All"},{id:"Have",label:`Have (${ownedSet.size})`},{id:"Want",label:`Want (${wantedSet.size})`},{id:"Untagged",label:"Untagged"}].map(({id,label})=>(
              <button key={id} onClick={()=>setTagFilter(id)} style={{
                fontSize:"12px", padding:"3px 9px", cursor:"pointer",
                background:tagFilter===id?"var(--color-background-secondary)":"transparent",
                border:`0.5px solid ${tagFilter===id?"var(--color-border-primary)":"var(--color-border-tertiary)"}`,
                borderRadius:"var(--border-radius-md)", fontWeight:tagFilter===id?500:400,
                color:tagFilter===id?"var(--color-text-primary)":"var(--color-text-secondary)",
              }}>{label}</button>
            ))}
            <span style={{ fontSize:"12px", color:"var(--color-text-secondary)", marginLeft:"auto" }}>{filtered.length} platforms</span>
          </div>
          <div style={{ display:"grid", gap:"8px" }}>
            {filtered.map(p=><PlatformCard key={p.id} id={p.id} compact={false}/>)}
          </div>
        </>
      )}

      {/* ── REVIEW ───────────────────────────────────────────────── */}
      {view==="review" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px", marginBottom:"20px" }}>
            {[
              { label:"Confirmed", value:ownedSet.size,  color:"var(--color-text-success)", bg:"var(--color-background-success)" },
              { label:"Need case", value:wantedSet.size, color:"var(--color-text-warning)", bg:"var(--color-background-warning)" },
              { label:"Unreviewed",value:platforms.length-ownedSet.size-wantedSet.size, color:"var(--color-text-secondary)", bg:"var(--color-background-secondary)" },
            ].map(({label,value,color,bg})=>(
              <div key={label} style={{ background:bg, borderRadius:"var(--border-radius-md)", padding:"12px", textAlign:"center" }}>
                <div style={{ fontSize:"11px", color, marginBottom:"3px" }}>{label}</div>
                <div style={{ fontSize:"20px", fontWeight:500, color }}>{value}</div>
              </div>
            ))}
          </div>

          {ownedList.length>0 && (
            <div style={{ marginBottom:"20px" }}>
              <div style={{ fontSize:"11px", fontWeight:500, color:"var(--color-text-success)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"8px", display:"flex", alignItems:"center", gap:"6px" }}>
                <i className="ti ti-check" aria-hidden="true"/> Confirmed in stack
              </div>
              <div style={{ display:"grid", gap:"5px" }}>
                {ownedList.map(p=><PlatformCard key={p.id} id={p.id} compact={true}/>)}
              </div>
            </div>
          )}

          {wantedList.length>0 && (
            <div style={{ marginBottom:"20px" }}>
              <div style={{ fontSize:"11px", fontWeight:500, color:"var(--color-text-warning)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"8px", display:"flex", alignItems:"center", gap:"6px" }}>
                <i className="ti ti-plus" aria-hidden="true"/> Need a business case
              </div>
              <div style={{ display:"grid", gap:"6px" }}>
                {wantedList.map(p=><PlatformCard key={p.id} id={p.id} compact={false}/>)}
              </div>
            </div>
          )}

          {ownedSet.size===0&&wantedSet.size===0&&(
            <div style={{ textAlign:"center", padding:"40px 20px", color:"var(--color-text-secondary)", fontSize:"13px" }}>
              Start in Bundles — add a bundle, then fine-tune in All Platforms.
            </div>
          )}

          {wantedList.length>0 && (
            <div style={{ border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", padding:"16px", marginTop:"8px" }}>
              <div style={{ fontSize:"13px", fontWeight:500, marginBottom:"6px" }}>Draft business case — {wantedList.length} {mode==="work"?"INT":"personal"} platform{wantedList.length>1?"s":""}</div>
              <p style={{ margin:"0 0 12px", fontSize:"13px", color:"var(--color-text-secondary)", lineHeight:1.5 }}>
                Generates an executive summary + itemized cost-benefit table. Grouped by category with ROI angles and a cost-of-doing-nothing close.
              </p>
              <button onClick={()=>sendPrompt(
                `Write an executive business case for approving these ${wantedList.length} ${mode==="work"?"INT (managed IT services provider)":"personal consulting"} subscriptions. Group by category. For each: one-sentence justification, pricing, ROI angle. Close with a total cost summary table and a "cost of doing nothing" paragraph.\n\n` +
                [...new Set(wantedList.map(p=>p.category))].map(c=>{
                  const items=wantedList.filter(p=>p.category===c);
                  return `## ${c}\n`+items.map(p=>`- **${p.name}** (${p.pricing}): ${p.roi}`).join("\n");
                }).join("\n\n")
              )} style={{ fontSize:"13px", display:"flex", alignItems:"center", gap:"6px" }}>
                <i className="ti ti-file-text" aria-hidden="true"/>
                Draft business case ↗
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
