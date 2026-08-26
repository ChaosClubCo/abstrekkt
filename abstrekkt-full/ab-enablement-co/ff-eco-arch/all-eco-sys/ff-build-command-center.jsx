import { useState, useMemo } from "react";

// FlashFusion Build Command Center
// 25 items per category × 6 categories = 150 total
// Status legend: exists / progress / build
// Priority: p1 / p2 / p3

const STATUS = {
  exists:   { label: "exists",       bg: "rgba(134,239,172,.12)", color: "#86efac", border: "rgba(134,239,172,.35)" },
  progress: { label: "in progress",  bg: "rgba(252,211,77,.12)",  color: "#fcd34d", border: "rgba(252,211,77,.35)" },
  build:    { label: "needs build",  bg: "rgba(252,165,165,.12)", color: "#fca5a5", border: "rgba(252,165,165,.35)" },
};

const PRI = {
  p1: { label: "P1", color: "#fca5a5" },
  p2: { label: "P2", color: "#fcd34d" },
  p3: { label: "P3", color: "#86efac" },
};

const CATEGORIES = [
  {
    id: "docs",
    label: "Documents",
    desc: "Sales · delivery · legal · ops",
    items: [
      { n: "One-Pager",                          s: "exists",   p: "p1", note: "Enterprise AI agent platform framing." },
      { n: "Proposal Template",                  s: "exists",   p: "p1", note: "POC proposal with placeholder fills." },
      { n: "Discovery Call Guide",               s: "exists",   p: "p1", note: "Tiered scoping. 5-dimension scorecard." },
      { n: "Objection Handling Guide",           s: "exists",   p: "p1", note: "Top 12 objections with rebuttals." },
      { n: "Outreach Email Templates",           s: "exists",   p: "p1", note: "Cold + warm + reactivation variants." },
      { n: "Pricing Sheet (Tier Card)",          s: "build",    p: "p1", note: "$0 free / $1,500 Skills / $4,500 Sprint visual." },
      { n: "Statement of Work (SOW) Template",   s: "build",    p: "p1", note: "Per-tier SOW with deliverables, timeline, payment." },
      { n: "Master Services Agreement (MSA)",    s: "build",    p: "p1", note: "Legal foundation. Indemnification + IP clauses." },
      { n: "NDA Template",                       s: "build",    p: "p1", note: "Mutual NDA for prospect calls." },
      { n: "Retainer Agreement",                 s: "build",    p: "p1", note: "$2K/mo Managed Retainer terms." },
      { n: "Skills Library Catalog",             s: "progress", p: "p1", note: "50 built — 4 compliance gaps gating." },
      { n: "Onboarding Checklist (per client)",  s: "build",    p: "p2", note: "Day 0-30 client setup workflow." },
      { n: "Case Study Template (Butler)",       s: "build",    p: "p1", note: "5-skill suite delivery — pending permission." },
      { n: "Battle Cards (Competitive Intel)",   s: "build",    p: "p2", note: "Copilot · LangChain · DIY · OpenAI agents." },
      { n: "vCAIO Description (Month 12+)",      s: "build",    p: "p3", note: "Advisory tier offering." },
      { n: "QBR (Quarterly Business Review)",    s: "build",    p: "p2", note: "Retainer client report template." },
      { n: "Anthropic Partner Pitch",            s: "exists",   p: "p1", note: "Partner narrative drafted." },
      { n: "FF Brand Guide",                     s: "build",    p: "p3", note: "Color, type, voice, logo usage." },
      { n: "Press Kit / Media One-Sheet",        s: "build",    p: "p3", note: "Bio + photo + key facts." },
      { n: "Delivery Playbook (Internal)",       s: "build",    p: "p2", note: "How a sprint runs end-to-end." },
      { n: "Invoice Template",                   s: "build",    p: "p2", note: "Branded, with payment terms." },
      { n: "Client Intake Form",                 s: "build",    p: "p1", note: "Pre-discovery questionnaire." },
      { n: "Engagement Kickoff Deck",            s: "build",    p: "p2", note: "5-slide deck for Day 1 of any engagement." },
      { n: "Skill Pack User Guide (per pack)",   s: "build",    p: "p2", note: "How to install, configure, get value." },
      { n: "Kelan Co-founder Brief",             s: "build",    p: "p1", note: "Full inventory + scope ask." },
    ],
  },
  {
    id: "artifacts",
    label: "Artifacts",
    desc: "Interactive tools · dashboards · widgets",
    items: [
      { n: "AI Setup Audit Scorecard (Base44)",     s: "exists",   p: "p1", note: "Live at audit.flashfusion.co." },
      { n: "ROI Calculator",                        s: "build",    p: "p1", note: "Sliders → weekly value, payback weeks." },
      { n: "Discovery Live Scorecard",              s: "build",    p: "p1", note: "5-dim scoring during call, .txt export." },
      { n: "Skills Browser",                        s: "build",    p: "p1", note: "All 50 skills filterable + searchable." },
      { n: "5-Week Sprint Tracker",                 s: "build",    p: "p1", note: "Per-week progress bars + deliverables." },
      { n: "Proposal Builder (form → text)",        s: "build",    p: "p2", note: "Form input → formatted proposal copy." },
      { n: "Audit Report Generator",                s: "build",    p: "p1", note: "8-dim sliders → branded PDF report." },
      { n: "Pipeline Dashboard ($222K target)",     s: "build",    p: "p1", note: "Kanban tracking to Y1 revenue target." },
      { n: "Revenue Tracker (MRR + collections)",   s: "build",    p: "p1", note: "Invoice log + Y1 progress bar." },
      { n: "Outreach Tracker",                      s: "build",    p: "p1", note: "Per-prospect stage dots, pre-seeded." },
      { n: "Battle Card Browser",                   s: "build",    p: "p2", note: "Tabbed competitor library." },
      { n: "Per-Client Dashboard",                  s: "build",    p: "p2", note: "Deliverables + health + activity." },
      { n: "Newsletter Generator (The Prompt)",     s: "build",    p: "p2", note: "Claude-in-Claude → edition draft." },
      { n: "Skills Gap Detector (5-Q quiz)",        s: "build",    p: "p2", note: "Question quiz → ranked skill recs." },
      { n: "Client Onboarding Hub",                 s: "build",    p: "p2", note: "Self-serve portal + checklist." },
      { n: "Agent Builder UI",                      s: "build",    p: "p3", note: "Compose agent → n8n workflow blueprint." },
      { n: "Chaos Club Daily Dispatch",             s: "build",    p: "p3", note: "Separate lane — red brand, distinct." },
      { n: "Fusion AI Closed Beta App",             s: "exists",   p: "p1", note: "Base44 id 68dd8e79ca073475565c8e16." },
      { n: "Skill Pack Installer Widget",           s: "build",    p: "p3", note: "/plugin install browser for clients." },
      { n: "Audit-to-Sprint Converter",             s: "build",    p: "p2", note: "Import audit findings → sprint plan." },
      { n: "FF Build Command Center (this)",        s: "exists",   p: "p1", note: "150-item inventory + status." },
      { n: "Anthropic Ambassador App Tracker",      s: "build",    p: "p2", note: "Application status + deliverable progress." },
      { n: "Lee Pitch Drafting Surface",            s: "build",    p: "p2", note: "Moltbook angle drafting tool." },
      { n: "Mark Hope Engagement Brief",            s: "exists",   p: "p2", note: "Call prep artifact." },
      { n: "Lafu Onboarding Surface",               s: "build",    p: "p2", note: "Co-founder coordination workspace." },
    ],
  },
  {
    id: "skills",
    label: "Skills",
    desc: "SKILL.md packs · Cowork plugins",
    items: [
      { n: "drafting-multi-format-content",      s: "exists",   p: "p1", note: "48 templates built." },
      { n: "ai-audit-delivery",                  s: "build",    p: "p1", note: "End-to-end audit playbook as skill." },
      { n: "enablement-sprint-planning",         s: "build",    p: "p1", note: "5-week sprint scaffolding skill." },
      { n: "client-communication",               s: "build",    p: "p2", note: "Status updates, async check-ins." },
      { n: "competitive-intelligence",           s: "build",    p: "p2", note: "Battle card generation + win/loss." },
      { n: "retainer-management",                s: "build",    p: "p2", note: "Monthly cadence + QBR prep." },
      { n: "discovery-call-runner",              s: "build",    p: "p1", note: "Live call assist + scoring." },
      { n: "proposal-generation",                s: "build",    p: "p1", note: "Form → SOW → contract chain." },
      { n: "skill-pack-deployment",              s: "build",    p: "p2", note: "Client environment install + verify." },
      { n: "memoir-excavation-protocol",         s: "build",    p: "p1", note: "Per project instructions — Kyle-scoped." },
      { n: "ground-truth-verification",          s: "build",    p: "p1", note: "Check claims against PROJECT_STATE." },
      { n: "lane-discipline-enforcement",        s: "build",    p: "p1", note: "Block context bleed across brands." },
      { n: "pipeline-pulse-friday",              s: "build",    p: "p2", note: "EOW pipeline status compiler." },
      { n: "newsletter-edition-drafter",         s: "build",    p: "p2", note: "The Prompt weekly edition." },
      { n: "case-study-writer",                  s: "build",    p: "p2", note: "Anonymized + branded variants." },
      { n: "objection-handler-live",             s: "build",    p: "p2", note: "Real-time during calls." },
      { n: "anthropic-partner-application",      s: "build",    p: "p1", note: "Cert paths + capability prep." },
      { n: "base44-app-architect",               s: "build",    p: "p3", note: "Spec → entities → app scaffold." },
      { n: "n8n-workflow-builder",               s: "build",    p: "p3", note: "Description → workflow blueprint." },
      { n: "supabase-migration-planner",         s: "build",    p: "p3", note: "Schema design + RLS guard." },
      { n: "vercel-deployment-coordinator",      s: "build",    p: "p3", note: "Project setup + env vars + rollback prep." },
      { n: "chrome-extension-scaffolder",        s: "build",    p: "p3", note: "Manifest v3 + content script bootstrap." },
      { n: "wordpress-page-publisher",           s: "build",    p: "p2", note: "Business plan required — verify before use." },
      { n: "github-repo-auditor",                s: "build",    p: "p3", note: "630+ Krosebrook repo cleanup pass." },
      { n: "ff-customization-quoter",            s: "build",    p: "p2", note: "Replaces INT lane — internal scope." },
    ],
  },
  {
    id: "agents",
    label: "Agents",
    desc: "n8n workflows · multi-step automations",
    items: [
      { n: "Portfolio Command Center",          s: "exists",   p: "p1", note: "n8n JPSVa3cLtQPi8NKF — daily." },
      { n: "Discovery Brief Auto-Generator",    s: "build",    p: "p1", note: "Trigger on form submit → brief in Notion." },
      { n: "Proposal-to-Contract Pipeline",     s: "build",    p: "p1", note: "Approved proposal → SOW → DocuSign." },
      { n: "Client Onboarding Sequencer",       s: "build",    p: "p1", note: "Day 0-30 email + task automation." },
      { n: "Audit Findings Summarizer",         s: "build",    p: "p1", note: "Audit data → exec summary + slides." },
      { n: "Sprint Weekly Status Compiler",     s: "build",    p: "p1", note: "Pulls from all sources → email." },
      { n: "Retainer Monthly QBR",              s: "build",    p: "p2", note: "Scheduled monthly cadence." },
      { n: "Pipeline Pulse Friday",             s: "build",    p: "p1", note: "EOW pipeline + revenue snapshot." },
      { n: "New Lead Routing",                  s: "build",    p: "p2", note: "Form → scored → CRM → assignee." },
      { n: "Newsletter Production Chain",       s: "build",    p: "p2", note: "Research → draft → edit → publish." },
      { n: "Skill Pack Update Notifier",        s: "build",    p: "p3", note: "Pack version change → client notify." },
      { n: "Github PR-to-Linear Sync",          s: "build",    p: "p3", note: "PR open → Linear ticket created." },
      { n: "Calendar Conflict Auto-Resolver",   s: "build",    p: "p3", note: "Detect → suggest reshuffle → notify." },
      { n: "Slack Mentions Digest (3x daily)",  s: "build",    p: "p2", note: "Aggregated digest at 8/13/17." },
      { n: "Stale Doc Alert (monthly)",         s: "build",    p: "p3", note: "180+ days untouched docs." },
      { n: "Win/Loss Capture",                  s: "build",    p: "p2", note: "Deal closed/lost → analysis form." },
      { n: "Case Study Auto-Drafter",           s: "build",    p: "p3", note: "Engagement complete → case study draft." },
      { n: "Anthropic Cert Tracker",            s: "build",    p: "p2", note: "Track cert progress for 10 seats." },
      { n: "Memoir Session Saver",              s: "build",    p: "p2", note: "Excavation output → /mnt/project/." },
      { n: "Chaos Club Daily Dispatch",         s: "build",    p: "p3", note: "Separate lane — red brand." },
      { n: "Vercel Deploy Health Watcher",      s: "build",    p: "p3", note: "Production deploy monitor + alert." },
      { n: "Supabase Bill Reminder",            s: "build",    p: "p2", note: "Continuum unblock dependency." },
      { n: "FF Customization Quote Generator",  s: "build",    p: "p2", note: "Form → quote → DocuSign." },
      { n: "Cowork Skill Sync",                 s: "build",    p: "p3", note: "Local skills → marketplace." },
      { n: "Audit Cleanup (weekly)",            s: "build",    p: "p3", note: "Test data + stale entities pruning." },
    ],
  },
  {
    id: "prompts",
    label: "Prompts",
    desc: "Reusable prompt library",
    items: [
      { n: "AI Setup Audit (full pass)",            s: "exists",   p: "p1", note: "Production prompt for audit delivery." },
      { n: "Discovery Call Live Assist",            s: "build",    p: "p1", note: "Real-time hint generator." },
      { n: "Objection Rebuttal Generator",          s: "build",    p: "p1", note: "Input objection → 3 rebuttals + evidence." },
      { n: "Cold Outreach (variant pair)",          s: "exists",   p: "p1", note: "Direct + warm versions." },
      { n: "Decision Memo Compiler",                s: "exists",   p: "p1", note: "Context + options → 1-page memo." },
      { n: "Meeting Prep Packet",                   s: "exists",   p: "p1", note: "Calendar event → prep brief." },
      { n: "Status Update Compiler",                s: "exists",   p: "p1", note: "Daily/weekly + audience-tuned." },
      { n: "Code Review Pre-Pass",                  s: "build",    p: "p2", note: "PR scan → severity-labeled findings." },
      { n: "Bug Triage Triage",                     s: "build",    p: "p2", note: "Bug report → severity + first step." },
      { n: "Doc Search & Cite",                     s: "build",    p: "p2", note: "Q → answer with sources, no hallucination." },
      { n: "Newsletter Draft (The Prompt)",         s: "build",    p: "p2", note: "Source URLs → edition draft." },
      { n: "Case Study Drafter",                    s: "build",    p: "p2", note: "Engagement data → case study." },
      { n: "Battle Card Generator",                 s: "build",    p: "p2", note: "Competitor → us-vs-them card." },
      { n: "Pricing Tier Recommender",              s: "build",    p: "p1", note: "Discovery answers → tier + anchor." },
      { n: "Sprint Plan Generator",                 s: "build",    p: "p1", note: "Audit findings → 5-week plan." },
      { n: "Retainer QBR Drafter",                  s: "build",    p: "p2", note: "Past quarter data → QBR draft." },
      { n: "Memoir Excavation Question",            s: "build",    p: "p1", note: "Scene seed → 1 question, no preamble." },
      { n: "Anthropic Cert Practice Pass",          s: "build",    p: "p2", note: "Quiz mode for the 10 cert seats." },
      { n: "FF Customization Quote",                s: "build",    p: "p2", note: "Form input → priced quote text." },
      { n: "Lane Discipline Pre-Flight",            s: "build",    p: "p1", note: "Check output for cross-brand bleed." },
      { n: "Claim Verifier (PROJECT_STATE)",        s: "build",    p: "p1", note: "Check claim against ground truth." },
      { n: "Skill Pack README Generator",           s: "build",    p: "p2", note: "Skill files → public README." },
      { n: "GitHub Issue Triage",                   s: "build",    p: "p3", note: "New issue → label + priority + assignee." },
      { n: "Linear Ticket Drafter",                 s: "build",    p: "p3", note: "Spec → Linear-formatted ticket." },
      { n: "Pitch Brief (Lee/Insider)",             s: "build",    p: "p2", note: "Moltbook angle drafting prompt." },
    ],
  },
  {
    id: "plugins",
    label: "Plugins / MCPs",
    desc: "Connectors · MCP servers · integrations",
    items: [
      { n: "Notion (connected)",            s: "exists",   p: "p1", note: "Training Hub + project sync." },
      { n: "Google Drive (connected)",      s: "exists",   p: "p1", note: "Doc export per client folder." },
      { n: "Gmail (connected)",             s: "exists",   p: "p1", note: "Outreach + follow-up sends." },
      { n: "Google Calendar (connected)",   s: "exists",   p: "p1", note: "Auto-schedule sessions." },
      { n: "Slack (connected)",             s: "exists",   p: "p1", note: "Mentions digest + posts." },
      { n: "GitHub (connected)",            s: "exists",   p: "p1", note: "Krosebrook + ChaosClubCo + FFv1." },
      { n: "n8n (connected, read/exec)",    s: "exists",   p: "p1", note: "Krosebrook.app.n8n.cloud." },
      { n: "Vercel (connected)",            s: "exists",   p: "p1", note: "Team team_hPVeJgH0h1nCrogiaMvD6fxu." },
      { n: "Supabase (connected)",          s: "exists",   p: "p1", note: "Continuum blocked on bill." },
      { n: "Base44 (connected, no update)", s: "exists",   p: "p1", note: "47 apps. Create/query only." },
      { n: "WordPress.com (connected)",     s: "exists",   p: "p2", note: "Business plan needed for pages." },
      { n: "Figma (connected)",             s: "exists",   p: "p2", note: "Team 152971 — FFwebsite + Ample." },
      { n: "PostHog (connected)",           s: "exists",   p: "p2", note: "Analytics + feature flags." },
      { n: "Linear (connected)",            s: "exists",   p: "p2", note: "Issue tracking integration." },
      { n: "Atlassian Rovo (connected)",    s: "exists",   p: "p3", note: "Jira/Confluence access." },
      { n: "Stripe (connected)",            s: "exists",   p: "p1", note: "Payment processing for clients." },
      { n: "Cloudflare (connected)",        s: "exists",   p: "p2", note: "DNS + workers + R2." },
      { n: "Airtable (connected)",          s: "exists",   p: "p2", note: "Staging layer for dashboards." },
      { n: "Tavily (connected)",            s: "exists",   p: "p3", note: "Web search for research." },
      { n: "Exa (connected)",               s: "exists",   p: "p3", note: "Semantic search alternative." },
      { n: "Apollo.io (connected)",         s: "exists",   p: "p2", note: "Prospect data enrichment." },
      { n: "Hubspot (connected)",           s: "exists",   p: "p3", note: "Optional CRM lane." },
      { n: "FlashFusion Custom MCP",        s: "build",    p: "p1", note: "Internal API exposure for FF tools." },
      { n: "Chaos Club Custom MCP",         s: "build",    p: "p3", note: "Separate lane — peer-support tools." },
      { n: "Skills Library MCP",            s: "build",    p: "p2", note: "/plugin install bridge from claude-code-plugins-plus." },
    ],
  },
];

const TOTAL = CATEGORIES.reduce((a, c) => a + c.items.length, 0);

const T = {
  bg: "#0a0a14", surface: "#11111d", card: "#1a1a2a",
  border: "#2a2a3d", borderHi: "#4a4a6a",
  text: "#e8e6f0", textMuted: "#8a8aa0",
  purple: "#a78bfa", cyan: "#67e8f9",
};

export default function FFBuildCommandCenter() {
  const [activeCat, setActiveCat] = useState("docs");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPri, setFilterPri] = useState("all");
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const flat = CATEGORIES.flatMap(c => c.items);
    return {
      total: flat.length,
      exists: flat.filter(i => i.s === "exists").length,
      progress: flat.filter(i => i.s === "progress").length,
      build: flat.filter(i => i.s === "build").length,
      p1: flat.filter(i => i.p === "p1").length,
    };
  }, []);

  const cat = CATEGORIES.find(c => c.id === activeCat);
  const filtered = useMemo(() => {
    let items = cat.items;
    if (filterStatus !== "all") items = items.filter(i => i.s === filterStatus);
    if (filterPri !== "all") items = items.filter(i => i.p === filterPri);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(i => (i.n + i.note).toLowerCase().includes(q));
    }
    return items;
  }, [cat, filterStatus, filterPri, search]);

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'Inter',-apple-system,sans-serif",padding:"32px 24px"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <header style={{marginBottom:32}}>
          <h1 style={{fontSize:32,fontWeight:700,letterSpacing:"-.02em",
            background:"linear-gradient(135deg,#a78bfa,#67e8f9)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:8}}>
            FlashFusion Build Command Center
          </h1>
          <p style={{color:T.textMuted,fontSize:15}}>
            {TOTAL} items across 6 categories · {stats.exists} exist · {stats.progress} in progress · {stats.build} need building
          </p>
        </header>

        {/* Stats row */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:24}}>
          {[
            {l:"Total items",v:stats.total,c:T.text},
            {l:"Exist",v:stats.exists,c:STATUS.exists.color},
            {l:"In progress",v:stats.progress,c:STATUS.progress.color},
            {l:"Need build",v:stats.build,c:STATUS.build.color},
            {l:"P1 priority",v:stats.p1,c:PRI.p1.color},
          ].map(s => (
            <div key={s.l} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"14px 16px"}}>
              <div style={{fontSize:11,color:T.textMuted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>{s.l}</div>
              <div style={{fontSize:24,fontWeight:700,color:s.c,fontFamily:"'JetBrains Mono',monospace"}}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Category tabs */}
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
          {CATEGORIES.map(c => {
            const active = c.id === activeCat;
            return (
              <button key={c.id} onClick={()=>setActiveCat(c.id)} style={{
                padding:"10px 16px",
                background:active?T.purple:"transparent",
                color:active?T.bg:T.textMuted,
                border:`1px solid ${active?T.purple:T.border}`,
                borderRadius:6,cursor:"pointer",
                fontFamily:"inherit",fontSize:13,fontWeight:500,transition:"all .15s",
              }}>
                {c.label} <span style={{opacity:.7,marginLeft:6}}>{c.items.length}</span>
              </button>
            );
          })}
        </div>

        {/* Filter bar */}
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:16,marginBottom:16,
          display:"flex",flexWrap:"wrap",gap:10,alignItems:"center"}}>
          <span style={{fontSize:13,color:T.textMuted,fontWeight:500}}>{cat.desc}</span>
          <div style={{flex:1}}/>
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
            style={{padding:"7px 10px",background:T.bg,border:`1px solid ${T.border}`,color:T.text,borderRadius:5,fontSize:12}}>
            <option value="all">All status</option>
            <option value="exists">Exists</option>
            <option value="progress">In progress</option>
            <option value="build">Needs build</option>
          </select>
          <select value={filterPri} onChange={e=>setFilterPri(e.target.value)}
            style={{padding:"7px 10px",background:T.bg,border:`1px solid ${T.border}`,color:T.text,borderRadius:5,fontSize:12}}>
            <option value="all">All priority</option>
            <option value="p1">P1 only</option>
            <option value="p2">P2 only</option>
            <option value="p3">P3 only</option>
          </select>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search items..."
            style={{padding:"7px 10px",background:T.bg,border:`1px solid ${T.border}`,color:T.text,borderRadius:5,fontSize:12,minWidth:200}}/>
        </div>

        {/* Item grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:12}}>
          {filtered.map((item, idx) => {
            const st = STATUS[item.s];
            const pr = PRI[item.p];
            return (
              <div key={idx} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:8,gap:8}}>
                  <div style={{fontSize:14,fontWeight:600,lineHeight:1.3,flex:1}}>{item.n}</div>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:pr.color,
                    border:`1px solid ${pr.color}33`,padding:"2px 6px",borderRadius:3}}>{pr.label}</span>
                </div>
                <div style={{display:"inline-block",background:st.bg,color:st.color,border:`1px solid ${st.border}`,
                  padding:"3px 8px",borderRadius:4,fontSize:10,fontWeight:600,textTransform:"uppercase",
                  letterSpacing:".05em",marginBottom:8}}>{st.label}</div>
                <div style={{fontSize:12,color:T.textMuted,lineHeight:1.5}}>{item.note}</div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{textAlign:"center",padding:48,color:T.textMuted,fontSize:14}}>
            No items match the current filters.
          </div>
        )}

        <footer style={{marginTop:48,paddingTop:24,borderTop:`1px solid ${T.border}`,
          fontSize:12,color:T.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>
          FF Build Command Center · {TOTAL} items · 6 categories ·
          P1 priority items: {stats.p1} ·
          Build queue: {stats.build} items
        </footer>
      </div>
    </div>
  );
}
