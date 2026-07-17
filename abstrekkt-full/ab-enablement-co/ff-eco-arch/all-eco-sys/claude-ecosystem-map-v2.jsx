import { useState, useEffect, useMemo } from "react";

/* ─── tokens (prompt-forge aesthetic) ─── */
const V = {
  bg:"#08050f", surf:"rgba(255,255,255,0.05)", brd:"rgba(255,255,255,0.08)",
  brd2:"rgba(255,255,255,0.04)", cyan:"#22d3ee", fuch:"#d946ef", vio:"#7c3aed",
  em:"#10b981", am:"#f59e0b", red:"#ef4444", txt:"#e2e8f0", mut:"rgba(255,255,255,0.5)",
  dim:"rgba(255,255,255,0.25)", font:"'Space Grotesk',sans-serif",
};
const GR = `linear-gradient(135deg,#fff 30%,${V.cyan} 70%,${V.fuch} 100%)`;
const GR2 = `linear-gradient(90deg,${V.vio},${V.fuch},${V.cyan})`;

/* ─── data ─── */
// Disabled status: "Disabled" immediately follows disabled plugin in Cowork UI
const PLUGINS = [
  // ACTIVE
  {n:"action-hub",         s:1,l:"B",  dom:"Core",      note:"Unified dispatcher · slash commands · ad-hoc task routing"},
  {n:"ai-marketing-system",s:1,l:"B",  dom:"Marketing", note:"FlashFusion marketing · content cadence · campaign drafts · social scheduling"},
  {n:"agent-factory-system",s:1,l:"B", dom:"Agents",    note:"Template-based agent creation · spec → config → deploy pipeline"},
  {n:"cowork-organizer",   s:1,l:"B",  dom:"Core",      note:"Session scaffolding · lane confirmation · workspace hygiene"},
  {n:"cowork-plugin-generator",s:1,l:"B",dom:"Core",    note:"Generates plugin bundles: plugin.yaml + skills/ subfolder from brief"},
  {n:"capturing-workflows-as-skills",s:1,l:"B",dom:"Skills",note:"Converts observed workflows into SKILL.md via structured extraction"},
  {n:"nlm-content",        s:1,l:"A",  dom:"Content",   note:"The Prompt content layer · article sourcing · curation · section drafting"},
  {n:"nlm-core",           s:1,l:"A",  dom:"Content",   note:"Newsletter engine · template mgmt · edition tracking · continuity log"},
  {n:"kyle-os",            s:1,l:"B",  dom:"Core",      note:"v1.1 command center · 6 slash commands · 11 MCP connectors"},
  {n:"morning-automation-pack",s:1,l:"B",dom:"Core",    note:"Daily startup · calendar pull · Notion sync · task hydration"},
  {n:"sidecar-association-coworker",s:1,l:"M",dom:"Agents",note:"Companion context agent · surfaces related work · cross-references active sessions"},
  {n:"ecc",                s:1,l:"A",  dom:"Content",   note:"Enterprise content creation · INT-branded docs · KB articles · SOPs"},
  {n:"agent-sdk-dev",      s:1,l:"B",  dom:"Dev",       note:"Claude SDK dev environment · tooling · test harnesses · agent scaffolding"},
  {n:"claude-code-setup",  s:1,l:"M",  dom:"Dev",       note:"Claude Code bootstrap · CLAUDE.md init · project config · MCP registration"},
  {n:"claude-md-management",s:1,l:"M", dom:"Dev",       note:"CLAUDE.md lifecycle · creation · version tracking · context hygiene"},
  {n:"code-review",        s:1,l:"M",  dom:"Dev",       note:"Structured code review · 6-persona audit · blast-radius scoring · security gate"},
  {n:"code-simplifier",    s:1,l:"M",  dom:"Dev",       note:"Complexity reduction · identifies over-engineering · extracts clean patterns"},
  {n:"production-agents-suite",s:1,l:"B",dom:"Agents",  note:"Production-grade agent configs · observability · failure modes · retry logic"},
  {n:"ai-ethics-governance-specialist",s:1,l:"A",dom:"Governance",note:"AI ethics review · bias audit · governance framework · SOC 2 alignment"},
  {n:"ai-engineer",        s:1,l:"B",  dom:"AI",        note:"Full AI engineering context · model selection · prompt architecture · eval design"},
  {n:"analyze-codebase",   s:1,l:"M",  dom:"Dev",       note:"Codebase health · architecture · tech debt · test coverage · security posture"},
  {n:"whimsy-injector",    s:1,l:"B",  dom:"Creative",  note:"Adds creative personality and playful voice to dry technical outputs"},
  {n:"visual-storyteller", s:1,l:"B",  dom:"Creative",  note:"Visual narrative · storyboard drafts · image prompt sequences"},
  {n:"workflow-optimizer", s:1,l:"M",  dom:"Platform",  note:"Analyzes workflows for friction · redundancy · automation opportunities"},
  {n:"ux-researcher",      s:1,l:"B",  dom:"Design",    note:"UX research protocols · usability test plans · heuristic evaluation"},
  {n:"ceo-quality-controller-agent",s:1,l:"M",dom:"Governance",note:"Executive quality gate · clarity · strategic alignment · polish check"},
  {n:"lyra",               s:1,l:"B",  dom:"Creative",  note:"Long-form creative writing and voice tuning assistant"},
  {n:"n8n-workflow-builder",s:1,l:"M", dom:"Automation",note:"n8n JSON workflow construction · trigger · node config · error handling · smoke test"},
  {n:"infrastructure-maintainer",s:1,l:"M",dom:"Platform",note:"Infrastructure health · monitoring · scaling decisions · dependency audits"},
  {n:"mobile-app-builder", s:1,l:"B",  dom:"Dev",       note:"React Native / Expo · mobile app scaffolding · FlashFusion design tokens"},
  {n:"project-curator",    s:1,l:"M",  dom:"Dev",       note:"Project organization · repo structure audit · naming conventions · dead code"},
  {n:"prd-specialist",     s:1,l:"M",  dom:"Product",   note:"Product requirements · structured PRD generation · acceptance criteria"},
  {n:"update-claudemd",    s:1,l:"M",  dom:"Dev",       note:"Automated CLAUDE.md content updates based on session learnings"},
  {n:"agent-teams",        s:1,l:"B",  dom:"Agents",    note:"Multi-agent team coordination · role assignment · handoff protocols"},
  {n:"product-tracking-skills",s:1,l:"B",dom:"Product", note:"Product metrics · PostHog dashboards · KPI tracking · funnel analysis"},
  {n:"searchfit-seo",      s:1,l:"C",  dom:"GTM",       note:"SEO optimization · keyword mapping · content scoring · technical SEO audits"},
  {n:"cloudinary",         s:1,l:"M",  dom:"Media",     note:"Media asset management · upload automation · transformation pipelines · CDN"},
  {n:"sales",              s:1,l:"C",  dom:"Sales",     note:"Sales workflow automation · CRM ops · pipeline management · proposal generation"},
  {n:"character-studio",   s:1,l:"B",  dom:"Creative",  note:"Character design · persona development · voice profiles · brand characters"},
  // DISABLED
  {n:"checking-drive-health",s:0,l:"B",dom:"Platform",  note:"Google Drive health audits · drift detection · classification · audit log"},
  {n:"hitl-intinc",        s:0,l:"A",  dom:"Platform",  note:"HITL review system · Supabase-backed · n8n workflows · Daniel Bell P1 escalation"},
  {n:"app-store-optimizer",s:0,l:"C",  dom:"GTM",       note:"ASO workflow · keyword research · description optimization · review analysis"},
  {n:"startup-business-analyst",s:0,l:"C",dom:"Business",note:"Business analysis for early-stage ventures · market sizing · competitive positioning"},
  {n:"figma",              s:0,l:"M",  dom:"Design",    note:"Figma MCP integration · design context · component inspection · token extraction"},
  {n:"engineering",        s:0,l:"M",  dom:"Dev",       note:"General engineering · architecture review · system design · RFC drafting"},
  {n:"common-room",        s:0,l:"C",  dom:"GTM",       note:"Community intelligence · member activity · engagement tracking · growth signals"},
  {n:"fastly-agent-toolkit",s:0,l:"M", dom:"Platform",  note:"Fastly CDN management · config automation · purge workflows · edge rules"},
  {n:"prisma",             s:0,l:"M",  dom:"Dev",       note:"Prisma ORM · schema management · migrations · type-safe query generation"},
  {n:"data",               s:0,l:"M",  dom:"Data",      note:"Data pipeline workflows · ETL · analytics · warehouse operations"},
  {n:"productivity",       s:0,l:"B",  dom:"Ops",       note:"Productivity integrations · task management · calendar ops · focus workflows"},
  {n:"marketing",          s:0,l:"C",  dom:"Marketing", note:"Marketing automation stack · campaign workflows · analytics · audience targeting"},
  {n:"apollo",             s:0,l:"C",  dom:"Sales",     note:"Apollo.io sales intelligence · contact enrichment · sequence management · outreach"},
  {n:"operations",         s:0,l:"A",  dom:"Ops",       note:"Operations management · SOPs · process documentation · capacity planning"},
];

const SKILL_CATS = {
  "Design/UI":   {c:V.fuch, skills:[
    {n:"frontend-design",       t:"user",    note:"Code execution layer · FlashFusion/INT profiles · anti-slop gates"},
    {n:"elite-ui-design",       t:"user",    note:"End-to-end product design · experience thesis → component architecture"},
    {n:"advanced-visual-design",t:"user",    note:"Typography systems · color theory · grid-based layouts · visual hierarchy"},
    {n:"design-system-builder", t:"user",    note:"Build cohesive design systems · tokens · component libraries · governance"},
    {n:"managing-design-briefs",t:"user",    note:"Design briefs · anti-slop enforcement · locked tokens · INT and FF profiles"},
    {n:"professional-web-design",t:"user",   note:"Responsive design · Core Web Vitals · modern CSS · production-ready workflows"},
    {n:"advanced-ux-patterns",  t:"user",    note:"WCAG 2.2 · interaction patterns · user research · usability principles"},
    {n:"prototyping-testing",   t:"user",    note:"Usability test planning · heuristic evaluation · A/B design · tree testing"},
    {n:"ui-component-library",  t:"user",    note:"Advanced React components · compound patterns · headless hooks · render props"},
    {n:"applying-brand-guidelines",t:"new",  note:"Brand application across surfaces · token enforcement · visual consistency"},
  ]},
  "Engineering": {c:V.cyan, skills:[
    {n:"engineering-staff-workflows",t:"user",note:"Security-first Staff Engineer · SCOPE_MODE gating · full stack · agent orchestration"},
    {n:"applying-sparc-methodology",t:"user",note:"Full SPARC coach · Spec → Pseudocode → Architecture → Refinement → Completion"},
    {n:"orchestrating-ai-agents",t:"user",   note:"MCP servers · LangChain · CrewAI · multi-LLM workflows · 20+ tool integrations"},
    {n:"workflow-automation",    t:"user",   note:"n8n · Zapier · Make · webhook orchestration · business process automation"},
    {n:"ai-solution-architecture",t:"user",  note:"Pre-sales AI architectures · reference designs · integration mapping · infra sizing"},
    {n:"writing-shell-scripts",  t:"user",   note:"Production Bash/.ps1 · adversarial audit gate · MSP-grade error handling · idempotency"},
    {n:"refactoring-code",       t:"user",   note:"Bulk refactoring · rename across files · replace patterns · update API calls"},
    {n:"fixing-tests",           t:"user",   note:"Run tests · systematic fix · smart error grouping · all failures resolved"},
    {n:"implementing-review-feedback",t:"user",note:"Process PR review comments · implement systematically · verify each change"},
    {n:"project-bootstrapper",   t:"new",    note:"New project scaffolding · opinionated structure · convention setup · CI/CD init"},
  ]},
  "Code Tools":  {c:"#3b82f6", skills:[
    {n:"code-auditor",           t:"user",   note:"Comprehensive codebase analysis · architecture · security · performance · maintainability"},
    {n:"code-transfer",          t:"user",   note:"Transfer code between files · line-based precision · extract / insert functions"},
    {n:"debug-like-expert",      t:"user",   note:"Deep analysis debugging · evidence gathering · hypothesis testing · root cause"},
    {n:"create-subagents",       t:"user",   note:"Claude Code subagents · Task tool · agent configurations · specialized launches"},
    {n:"create-agent-skills",    t:"user",   note:"Claude Code SKILL.md creation · structure · trigger patterns · best practices"},
    {n:"create-meta-prompts",    t:"user",   note:"Claude-to-Claude pipelines · research + planning + execution stages"},
    {n:"organizing-projects",    t:"user",   note:"Repo organization · structure audits · convention enforcement · migration planning"},
  ]},
  "Skills/Meta": {c:V.vio, skills:[
    {n:"developing-skills",      t:"user",   note:"Authoritative skill creation · YAML frontmatter · trigger density · 500-line rule"},
    {n:"packaging-skills",       t:"user",   note:"Production zip packaging · March 2026 Anthropic spec compliance · structure validation"},
    {n:"troubleshooting-skills", t:"user",   note:"Diagnose corrupted zips · path errors · upload failures · YAML problems"},
    {n:"task-decomposition",     t:"user",   note:"Decompose complex requests · parallel workstreams · dependency tracking"},
    {n:"applying-adversarial-review",t:"user",note:"CLAIMS/COUNTEREXAMPLES/CONTRADICTIONS · [SOURCED]/[GENERATED] labels · streak flag"},
    {n:"reminding-skill-usage",  t:"user",   note:"Analyzes task · suggests relevant skills from library · activation router"},
    {n:"enforcing-output-formats",t:"new",   note:"Output format enforcement · structured response contracts · schema validation"},
  ]},
  "Content":     {c:V.em, skills:[
    {n:"generating-social-posts",t:"user",   note:"Kyle's voice · LinkedIn/X/Threads/Blog/Audio · 10 content types · 4-5 clarifiers"},
    {n:"drafting-multi-format-content",t:"user",note:"Video/audio scripts · threaded long-form social · ChaosClubCo customer lifecycle"},
    {n:"producing-ai-newsletter",t:"user",   note:"Multi-config AI newsletter · INT + FF profiles · research → draft → deliver"},
    {n:"internal-comms",         t:"examples",note:"Status reports · leadership updates · incident reports · company newsletters"},
  ]},
  "Docs/KB":     {c:V.am, skills:[
    {n:"generating-kb-articles", t:"user",   note:"INT-branded .docx KB articles · SOPs · reference guides · troubleshooting guides"},
    {n:"generating-intinc-documents",t:"user",note:"Intinc document engine · INT brand standards · reports · memos · process docs"},
    {n:"generating-msm-documents",t:"user",  note:"MSM brand .docx · deployment guides · client documentation · onboarding docs"},
    {n:"kb-screenshot-automator",t:"user",   note:"Screenshot capture for Scribe KB articles · Claude in Chrome integration"},
  ]},
  "Media":       {c:"#ec4899", skills:[
    {n:"producing-graphics",     t:"user",   note:"Export-ready graphics · WebP · srcset · SVGO · CMYK print · social sizes · favicon"},
    {n:"canvas-design",          t:"examples",note:"Visual art in .png/.pdf · posters · illustrations · design philosophy"},
    {n:"theme-factory",          t:"examples",note:"10 pre-set themes · apply to slides/docs/HTML artifacts · on-the-fly theme gen"},
  ]},
  "Business":    {c:"#f97316", skills:[
    {n:"roi-calculator-building",t:"user",   note:"AI ROI models · B2B enterprise sales · cost savings · payback period · TCO"},
  ]},
  "Personal":    {c:"#a78bfa", skills:[
    {n:"anchor",                 t:"user",   note:"Anxiety companion · daily support · grounding · breathing · journal · reframe"},
    {n:"tracking-personal-challenges",t:"user",note:"Challenges across learning/fitness/building/creative/habit · cross-pattern analysis"},
  ]},
  "Automation":  {c:"#06b6d4", skills:[
    {n:"running-drive-automation",t:"user",  note:"Drive Automation Chain 1+2 · agent council · Supabase audit trail · n8n integration"},
  ]},
  "Service Desk":{c:"#64748b", skills:[
    {n:"unifying-service-desk",  t:"user",   note:"Multi-tier IT support L0-L4 · auto escalation routing · 12 issue categories"},
  ]},
  "Examples":    {c:"#475569", skills:[
    {n:"web-artifacts-builder",  t:"examples",note:"Complex multi-component HTML artifacts · React + Tailwind + shadcn/ui"},
    {n:"skill-creator",          t:"examples",note:"Create/modify/improve skills · run evals · benchmark · optimize descriptions"},
    {n:"mcp-builder",            t:"examples",note:"High-quality MCP server creation · Python FastMCP · Node TypeScript MCP SDK"},
  ]},
  "Built-in":    {c:"#334155", skills:[
    {n:"schedule",               t:"builtin", note:"Schedule routines and timed automations within Cowork"},
    {n:"setup-cowork",           t:"builtin", note:"Initialize and configure a new Cowork session environment"},
    {n:"context",                t:"builtin", note:"Load and manage project context files within the session"},
  ]},
};

const CONNECTORS = {
  "Core Stack": [
    {n:"Notion",       s:"web",  note:"Full R/W · page_id param · primary KB"},
    {n:"Supabase",     s:"web",  note:"⚠ oorstbwcydxwiojrsoim = Intinc ONLY · ask before write"},
    {n:"n8n",          s:"web",  note:"krosebrook.app.n8n.cloud · 5 HITL workflows"},
    {n:"Google Drive", s:"web",  note:"Drive Chain 1+2 · gdrive_fetch · classification"},
    {n:"GitHub",       s:"web",  note:"Krosebrook/source-of-truth-monorepo · master branch"},
    {n:"Linear",       s:"web",  note:"Issue tracking · ask before create/update"},
    {n:"Sentry",       s:"web",  note:"Error monitoring · read for debugging"},
    {n:"PostHog",      s:"web",  note:"Product analytics · feature flags · session replay"},
    {n:"Vercel",       s:"web",  note:"Deployments · logs · project config"},
  ],
  "Comms & Calendar": [
    {n:"Notion",       s:"web",  note:"See Core Stack"},
    {n:"Slack",        s:"web",  note:"⚠ Personal/ChaosClubCo ONLY · NEVER for INT"},
    {n:"Gmail",        s:"web",  note:"Email read/search · compose drafts"},
    {n:"Google Calendar",s:"web",note:"Native MCP · preferred over Zapier equivalent"},
    {n:"ms365",        s:"web",  note:"INT Teams · calendar fallback · SharePoint"},
    {n:"Otter.ai",     s:"web",  note:"Meeting transcription and summary"},
    {n:"Granola",      s:"web",  note:"Meeting notes and AI summaries"},
    {n:"Calendly",     s:"web",  note:"Scheduling automation"},
  ],
  "Automation": [
    {n:"Zapier",       s:"web",  note:"≤3KB limit for file push · fallback automation"},
    {n:"Make",         s:"web",  note:"Secondary automation platform"},
    {n:"IFTTT",        s:"web",  note:"Simple trigger automation"},
  ],
  "Design & Creative": [
    {n:"Figma",        s:"desktop",note:"Design context · component inspection"},
    {n:"Canva",        s:"web",  note:"Visual content creation"},
    {n:"Cloudinary",   s:"web",  note:"Asset management · transformation pipelines"},
    {n:"Excalidraw",   s:"web",  note:"Whiteboard/diagram creation"},
    {n:"Lucid",        s:"web",  note:"Flowcharts · org charts · sequence diagrams"},
    {n:"Mermaid Chart",s:"web",  note:"Diagram-as-code rendering"},
    {n:"tldraw",       s:"web",  note:"Collaborative whiteboard"},
    {n:"Gamma",        s:"web",  note:"AI slide generation"},
  ],
  "Dev & Platform": [
    {n:"Cloudflare",   s:"web",  note:"Workers · KV · R2 · DNS management"},
    {n:"Netlify",      s:"web",  note:"Static site deployment"},
    {n:"Postman",      s:"web",  note:"API testing and documentation"},
    {n:"Hugging Face", s:"web",  note:"Model hub · inference API"},
    {n:"Context7",     s:"web",  note:"Library documentation lookup"},
    {n:"Base44",       s:"web",  note:"AI app builder · rapid prototyping"},
    {n:"Exa",          s:"web",  note:"Semantic web search"},
    {n:"GraphOS MCP",  s:"web",  note:"Apollo GraphQL platform"},
  ],
  "Commerce & GTM": [
    {n:"HubSpot",      s:"web",  note:"CRM · freelance/FlashFusion pipeline"},
    {n:"Shopify",      s:"web",  note:"ChaosClubCo / FlashFusion commerce"},
    {n:"MailerLite",   s:"web",  note:"Newsletter send for FlashFusion"},
    {n:"Apollo.io",    s:"web",  note:"Contact enrichment and outreach"},
    {n:"Common Room",  s:"web",  note:"Community intelligence"},
    {n:"Bitly",        s:"web",  note:"Link shortening and tracking"},
  ],
  "Content & Media": [
    {n:"Airtable",     s:"web",  note:"Structured data workflows"},
    {n:"ClickUp",      s:"web",  note:"Task management"},
    {n:"Spotify",      s:"web",  note:"Music for context"},
    {n:"SurveyMonkey", s:"web",  note:"Survey creation and analysis"},
    {n:"Indeed",       s:"web",  note:"Job posting and talent search"},
    {n:"Intercom",     s:"web",  note:"Customer support workflows"},
  ],
  "Desktop Tools": [
    {n:"Claude in Chrome",    s:"desktop",note:"INCLUDED · browse agent · KB screenshot automation"},
    {n:"Desktop Commander",   s:"desktop",note:"Desktop automation · file system access"},
    {n:"Cloudinary Assets",   s:"desktop",note:"Asset management desktop client"},
    {n:"ElevenLabs Agents",   s:"desktop",note:"Voice AI agents"},
    {n:"ElevenLabs Player",   s:"desktop",note:"Audio playback for voice content"},
    {n:"KARP Inspector",      s:"desktop",note:"Accessibility inspection"},
    {n:"React Aria",          s:"desktop",note:"Accessible React component reference"},
    {n:"Shadcn UI",           s:"desktop",note:"Component library reference"},
    {n:"Socket",              s:"desktop",note:"Real-time socket debugging"},
    {n:"ToolUniverse",        s:"desktop",note:"Tool discovery and access"},
  ],
  "Not Connected": [
    {n:"Stripe",              s:"no",     note:"Planned for FlashFusion billing · not yet active"},
    {n:"Datadog",             s:"no",     note:"Monitoring/APM platform"},
    {n:"Miro",                s:"no",     note:"Collaborative whiteboard"},
    {n:"monday.com",          s:"no",     note:"Project management"},
    {n:"Atlassian",           s:"no",     note:"Jira + Confluence"},
    {n:"Filesystem",          s:"no",     note:"Local filesystem MCP"},
    {n:"Tavily",              s:"no",     note:"Real-time search API"},
    {n:"WordPress.com",       s:"no",     note:"CMS · posts require user_confirmed: Confirmed"},
    {n:"Superhuman Mail",     s:"no",     note:"Email client"},
    {n:"Similarweb",          s:"no",     note:"Web analytics / competitive intel"},
    {n:"Udemy Business",      s:"no",     note:"Learning platform"},
    {n:"Datagrail",           s:"no",     note:"Data privacy management"},
    {n:"gitlab",              s:"no",     note:"GitLab integration"},
    {n:"Harness",             s:"no",     note:"CI/CD platform"},
    {n:"Tines",               s:"no",     note:"Security automation"},
  ],
};

const SURFACES = [
  {id:"web",   ic:"🌐", lbl:"Claude.ai Web",     c:V.cyan,
   roles:["Strategy · Planning · KB articles","The Prompt newsletter","MCP connectors: 70+ services","Skills at /mnt/skills/user/","[SPIKE] [TEACH] [TEAM] primary surface"],
   note:"Main session. Artifacts, search, plugins, skills all active."},
  {id:"code",  ic:"⌨️", lbl:"Claude Code",       c:V.fuch,
   roles:["Terminal agent · multi-file builds","Reads CLAUDE.md on session open","Local skill authoring: D:\\03_Dev\\Skills","vp.py + skill-audit.py run here","[PROD] primary surface"],
   note:"Full codebase context. Auth, payments, infra work. Never in browser."},
  {id:"cowork",ic:"⚙️", lbl:"Claude Cowork",     c:V.vio,
   roles:["Sandboxed execution · /mnt/skills/user/","Artifacts DO NOT persist between sessions","Known: useradd exit 12 (infra-level)","Fallback: Claude Code + VS Code","Always zip + download before closing"],
   note:"⚠ RPC error active. Fallback to local tooling."},
  {id:"mob",   ic:"📱", lbl:"Dispatch (Mobile)",  c:V.am,
   roles:["Trigger routines · quick queries","Morning boot via kyle-os","Not for complex builds","Heavy artifacts won't render","Async task kicking"],
   note:"Planning and trigger only. Not for production work."},
  {id:"art",   ic:"◈",  lbl:"Artifacts / Live",  c:V.em,
   roles:["React JSX · HTML · Three.js r128","Storage API: window.storage.get/set","Anthropic API callable in context","FlashFusion profile tokens","Recharts · D3 · Chart.js available"],
   note:"Single-file. No localStorage. FF brand: #0F0618, A855F7, F472B6, 22D3EE."},
];

const ROUTINES = [
  {n:"/morning",   t:"kyle-os", note:"Boot sequence · calendar pull · Notion sync · priority queue · context load"},
  {n:"/lane",      t:"kyle-os", note:"Confirm active lane (A/B/C) · prevents context bleed · required before task start"},
  {n:"/skills",    t:"kyle-os", note:"List deployed skills · check activation · audit skill library status"},
  {n:"/status",    t:"kyle-os", note:"Session health check · MCP connector status · Cowork RPC check"},
  {n:"/wsjf",      t:"kyle-os", note:"WSJF prioritization calculator · cost of delay ÷ job size · backlog ordering"},
  {n:"/audit",     t:"kyle-os", note:"6-persona audit trigger · blast-radius scoring · adversarial critic step"},
  {n:"Drive Chain",t:"automation",note:"Classify → route → audit trail · Supabase log · n8n trigger · council memo"},
  {n:"HITL Queue", t:"automation",note:"n8n → Supabase queue → Daniel Bell P1 escalation · 5 workflow JSONs"},
  {n:"KB Gen",     t:"automation",note:"Scribe export → kb-screenshot-automator → Claude in Chrome → .docx output"},
  {n:"Newsletter", t:"automation",note:"Research week → draft week · nlm-core/nlm-content · Teams/SharePoint delivery"},
];

/* ─── component atoms ─── */
const css = (obj) => Object.entries(obj).map(([k,v])=>`${k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())}:${v}`).join(';');
const Brd = ({s}) => {
  const m = {web:{c:V.cyan,l:"WEB"},desktop:{c:V.fuch,l:"DESK"},no:{c:"rgba(255,255,255,0.2)",l:"—"}};
  const x = m[s]||m.web;
  return <span style={{fontSize:8,fontWeight:800,padding:"1px 5px",borderRadius:3,background:`${x.c}18`,color:x.c,border:`1px solid ${x.c}30`,letterSpacing:"0.06em"}}>{x.l}</span>;
};
const Tag = ({c,children}) => (
  <span style={{fontSize:9,fontWeight:800,padding:"1px 6px",borderRadius:3,background:`${c}18`,color:c,border:`1px solid ${c}30`,letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{children}</span>
);
const LaneDot = ({l}) => {
  const m={A:V.cyan,B:V.vio,C:V.fuch,M:V.am};
  return <span style={{width:16,height:16,borderRadius:"50%",background:`${m[l]||V.dim}22`,border:`1px solid ${m[l]||V.dim}50`,color:m[l]||V.dim,fontSize:8,fontWeight:800,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{l}</span>;
};

export default function App() {
  const [tab,setTab]  = useState("overview");
  const [pq,setPq]    = useState("");
  const [pl,setPl]    = useState("all");
  const [pd,setPd]    = useState("all");
  const [ps,setPs]    = useState("all");
  const [sq,setSq]    = useState("");
  const [sc,setSc]    = useState("all");
  const [cq,setCq]    = useState("");

  useEffect(()=>{
    (async()=>{try{const r=await window.storage.get("eco-v2");if(r){const d=JSON.parse(r.value);if(d.tab)setTab(d.tab);}}catch{}})();
  },[]);
  const nav = t => {setTab(t);try{window.storage.set("eco-v2",JSON.stringify({tab:t}));}catch{}};

  const pDoms = useMemo(()=>["all",...[...new Set(PLUGINS.map(p=>p.dom))].sort()],[]);
  const filteredP = useMemo(()=>PLUGINS.filter(p=>{
    if(ps!=="all"&&(ps==="active"?!p.s:p.s))return false;
    if(pl!=="all"&&p.l!==pl)return false;
    if(pd!=="all"&&p.dom!==pd)return false;
    if(pq&&!p.n.includes(pq.toLowerCase())&&!p.note.toLowerCase().includes(pq.toLowerCase()))return false;
    return true;
  }),[pq,pl,pd,ps]);
  const filteredS = useMemo(()=>{
    const cats = Object.entries(SKILL_CATS).filter(([cat])=>sc==="all"||cat===sc);
    return cats.map(([cat,data])=>({cat,c:data.c,skills:data.skills.filter(s=>!sq||s.n.includes(sq.toLowerCase())||s.note.toLowerCase().includes(sq.toLowerCase()))})).filter(x=>x.skills.length);
  },[sq,sc]);
  const filteredC = useMemo(()=>{
    const groups = Object.entries(CONNECTORS);
    if(!cq) return groups;
    return groups.map(([grp,items])=>([grp,items.filter(c=>c.n.toLowerCase().includes(cq.toLowerCase()))]))
                 .filter(([,items])=>items.length);
  },[cq]);

  const totalSkills = Object.values(SKILL_CATS).reduce((a,c)=>a+c.skills.length,0);
  const deployedSkills = Object.values(SKILL_CATS).reduce((a,c)=>a+c.skills.filter(s=>s.t==="user").length,0);
  const newSkills = Object.values(SKILL_CATS).reduce((a,c)=>a+c.skills.filter(s=>s.t==="new").length,0);
  const activeP = PLUGINS.filter(p=>p.s).length;
  const disabledP = PLUGINS.filter(p=>!p.s).length;
  const webConn = Object.values(CONNECTORS).flat().filter(c=>c.s==="web").length;
  const deskConn = Object.values(CONNECTORS).flat().filter(c=>c.s==="desktop").length;

  const TABS = ["overview","surfaces","plugins","skills","connectors","reference"];

  /* ─── inline styles as reusable constants ─── */
  const card = {background:V.surf,border:`1px solid ${V.brd}`,borderRadius:14,padding:"14px 16px",backdropFilter:"blur(20px)"};
  const inputS = {background:"rgba(0,0,0,0.4)",border:`1px solid ${V.brd}`,borderRadius:8,padding:"6px 10px",color:V.txt,fontSize:11,outline:"none",fontFamily:V.font,width:"100%"};
  const selS   = {...inputS,width:"auto",minWidth:90,cursor:"pointer"};
  const rowS   = {display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderRadius:8,border:`1px solid ${V.brd2}`,background:"rgba(0,0,0,0.2)",marginBottom:4};

  return (
    <div style={{minHeight:"100vh",background:V.bg,color:V.txt,fontFamily:V.font,fontSize:13}}>
      {/* ambient glows */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{position:"absolute",left:"-5%",top:"-15%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(217,70,239,0.12),transparent 70%)",filter:"blur(80px)"}}/>
        <div style={{position:"absolute",right:"-5%",top:"5%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(34,211,238,0.1),transparent 70%)",filter:"blur(80px)"}}/>
        <div style={{position:"absolute",bottom:"-20%",left:"25%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(124,58,237,0.1),transparent 70%)",filter:"blur(80px)"}}/>
      </div>

      <div style={{position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto",padding:"16px 16px 60px"}}>

        {/* header */}
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",alignItems:"baseline",gap:10,flexWrap:"wrap"}}>
            <h1 style={{fontFamily:V.font,fontWeight:900,fontSize:20,background:GR,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-0.01em",margin:0}}>
              Claude Ecosystem Map
            </h1>
            <span style={{fontSize:10,color:V.mut,fontWeight:700}}>v2 · Personal · Path B</span>
          </div>
          <p style={{color:V.mut,fontSize:11,margin:"3px 0 0",fontWeight:500}}>
            {activeP} active plugins · {deployedSkills} deployed skills · {newSkills} pending · {webConn} web + {deskConn} desktop connectors · 5 surfaces
          </p>
        </div>

        {/* tab bar */}
        <div style={{display:"flex",gap:2,marginBottom:18,background:"rgba(255,255,255,0.03)",borderRadius:10,padding:3,border:`1px solid ${V.brd}`}}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>nav(t)}
              style={{flex:1,padding:"6px 0",border:"none",borderRadius:7,cursor:"pointer",fontSize:10,fontWeight:800,letterSpacing:"0.04em",textTransform:"uppercase",fontFamily:V.font,
                background:tab===t?"rgba(255,255,255,0.08)":"transparent",
                color:tab===t?V.txt:V.mut,transition:"all 0.12s",
                boxShadow:tab===t?`inset 0 0 0 1px ${V.brd}`:"none"}}>
              {t}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab==="overview"&&<div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8,marginBottom:14}}>
            {[
              {l:"Surfaces",    v:"5",          c:V.cyan},
              {l:"Active Plugins",v:activeP,    c:V.em},
              {l:"Disabled",    v:disabledP,    c:V.mut},
              {l:"Deployed Skills",v:deployedSkills,c:V.vio},
              {l:"Pending Skills",v:newSkills,  c:V.am},
              {l:"Connectors",  v:webConn+deskConn,c:V.fuch},
            ].map(s=>(
              <div key={s.l} style={{...card,padding:"10px 12px",textAlign:"center"}}>
                <div style={{fontSize:8,color:V.mut,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:3}}>{s.l}</div>
                <div style={{fontSize:20,fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
              </div>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
            {/* lanes */}
            <div style={{...card}}>
              <div style={{fontSize:9,fontWeight:800,color:V.mut,letterSpacing:"0.08em",marginBottom:10}}>LANES · STRICT ISOLATION</div>
              {[
                {l:"A · Intinc",d:"AI enablement · HITL · The Prompt · KB articles",c:V.cyan},
                {l:"B · Personal",d:"FlashFusion · ChaosClubCo · Kinsley Apps · skill library",c:V.vio},
                {l:"C · Freelance",d:"Customization Service · Tech/SaaS clients · deliverables",c:V.fuch},
              ].map(x=>(
                <div key={x.l} style={{display:"flex",gap:8,marginBottom:8,padding:"7px 9px",borderRadius:8,border:`1px solid ${x.c}20`,background:`${x.c}08`}}>
                  <div style={{width:2,borderRadius:1,background:x.c,flexShrink:0}}/>
                  <div><div style={{fontSize:10,fontWeight:800,color:x.c,marginBottom:1}}>{x.l}</div>
                  <div style={{fontSize:9,color:V.mut,lineHeight:1.4}}>{x.d}</div></div>
                </div>
              ))}
            </div>
            {/* wsjf queue */}
            <div style={{...card}}>
              <div style={{fontSize:9,fontWeight:800,color:V.mut,letterSpacing:"0.08em",marginBottom:10}}>SKILL QUEUE · WSJF</div>
              {[
                {n:"Learning/Teaching Framework",w:3.2,s:"queued"},
                {n:"DB Optimizer",               w:3.0,s:"queued"},
                {n:"SPARC Methodology Coach",    w:2.9,s:"done"},
                {n:"Task Decomposition",         w:2.8,s:"done"},
                {n:"applying-brand-guidelines",  w:null,s:"new"},
                {n:"enforcing-output-formats",   w:null,s:"new"},
                {n:"project-bootstrapper",       w:null,s:"new"},
              ].map(q=>(
                <div key={q.n} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5,padding:"4px 8px",borderRadius:6,background:"rgba(0,0,0,0.2)"}}>
                  <span style={{fontSize:9,color:q.s==="done"?V.mut:V.txt,fontWeight:q.s==="queued"?700:400}}>{q.n}</span>
                  <div style={{display:"flex",gap:4,alignItems:"center"}}>
                    {q.w&&<span style={{fontSize:9,fontFamily:"monospace",color:V.am}}>{q.w}</span>}
                    <Tag c={q.s==="done"?V.em:q.s==="new"?V.am:V.vio}>{q.s.toUpperCase()}</Tag>
                  </div>
                </div>
              ))}
              <div style={{marginTop:8,padding:"6px 8px",borderRadius:6,background:`${V.am}10`,border:`1px solid ${V.am}25`,fontSize:9,color:V.am,fontWeight:600}}>
                ⚠ Cowork RPC error (useradd 12) → fallback: Claude Code + VS Code
              </div>
            </div>
            {/* hard constraints */}
            <div style={{...card}}>
              <div style={{fontSize:9,fontWeight:800,color:V.mut,letterSpacing:"0.08em",marginBottom:10}}>HARD CONSTRAINTS</div>
              {[
                {t:"Supabase",d:"oorstbwcydxwiojrsoim = Intinc ONLY. NEVER in B/C lane calls.",c:V.red},
                {t:"Slack",d:"Personal/ChaosClubCo ONLY. Use Teams for all INT work.",c:V.am},
                {t:"Cowork",d:"Sandboxed. Zip + download before closing. No artifact persistence.",c:V.cyan},
                {t:"Skills",d:"Gerund-first kebab-case. 'claude' reserved. No root version field.",c:V.vio},
                {t:"GitHub",d:"master branch only. skills/ prefix. NEVER commit zip artifacts.",c:V.fuch},
                {t:"Secrets",d:"Bitwarden = primary. Keeper = LEGACY — migrate + remove.",c:V.em},
              ].map(c=>(
                <div key={c.t} style={{display:"flex",gap:7,marginBottom:6,padding:"5px 8px",borderRadius:6,border:`1px solid ${c.c}25`,background:`${c.c}06`}}>
                  <div style={{width:2,borderRadius:1,background:c.c,flexShrink:0,alignSelf:"stretch"}}/>
                  <div><span style={{fontSize:9,fontWeight:800,color:c.c}}>{c.t} · </span>
                  <span style={{fontSize:9,color:V.mut}}>{c.d}</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* plugin domain breakdown */}
          <div style={{...card}}>
            <div style={{fontSize:9,fontWeight:800,color:V.mut,letterSpacing:"0.08em",marginBottom:10}}>PLUGIN DOMAINS</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {Object.entries(
                PLUGINS.reduce((a,p)=>{a[p.dom]=(a[p.dom]||{active:0,off:0});p.s?a[p.dom].active++:a[p.dom].off++;return a},{})
              ).sort((a,b)=>b[1].active-a[1].active).map(([dom,counts])=>(
                <div key={dom} style={{padding:"4px 10px",borderRadius:20,background:"rgba(255,255,255,0.04)",border:`1px solid ${V.brd}`,fontSize:10,fontWeight:700}}>
                  {dom} <span style={{color:V.em}}>{counts.active}</span>{counts.off>0&&<span style={{color:V.mut,fontWeight:400}}> +{counts.off}off</span>}
                </div>
              ))}
            </div>
          </div>
        </div>}

        {/* ── SURFACES ── */}
        {tab==="surfaces"&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {SURFACES.map(s=>(
            <div key={s.id} style={{...card,borderLeft:`3px solid ${s.c}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{fontSize:20}}>{s.ic}</span>
                <div>
                  <div style={{fontWeight:900,fontSize:13,color:s.c}}>{s.lbl}</div>
                  <div style={{fontSize:9,color:V.mut,marginTop:1}}>{s.note}</div>
                </div>
              </div>
              <div style={{borderTop:`1px solid ${V.brd}`,paddingTop:10}}>
                {s.roles.map((r,i)=>(
                  <div key={i} style={{display:"flex",gap:6,marginBottom:4}}>
                    <span style={{color:s.c,fontSize:8,flexShrink:0,marginTop:2}}>›</span>
                    <span style={{fontSize:10,color:V.mut,lineHeight:1.4}}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>}

        {/* ── PLUGINS ── */}
        {tab==="plugins"&&<div>
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
            <div style={{flex:"2 1 160px"}}><input value={pq} onChange={e=>setPq(e.target.value.toLowerCase())} placeholder="Search plugins…" style={inputS}/></div>
            <select value={ps} onChange={e=>setPs(e.target.value)} style={selS}>
              <option value="all">All</option><option value="active">Active</option><option value="disabled">Disabled</option>
            </select>
            <select value={pl} onChange={e=>setPl(e.target.value)} style={selS}>
              <option value="all">All lanes</option><option value="A">A · Intinc</option><option value="B">B · Personal</option><option value="C">C · Freelance</option><option value="M">Multi</option>
            </select>
            <select value={pd} onChange={e=>setPd(e.target.value)} style={selS}>
              {pDoms.map(d=><option key={d}>{d==="all"?"All domains":d}</option>)}
            </select>
            <span style={{fontSize:10,color:V.mut,fontWeight:700}}>{filteredP.length}/{PLUGINS.length}</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6}}>
            {filteredP.map(p=>(
              <div key={p.n} style={{...rowS,opacity:p.s?1:0.55,flexWrap:"wrap",marginBottom:0}}>
                <LaneDot l={p.l}/>
                <span style={{fontSize:11,fontWeight:800,fontFamily:"monospace",color:p.s?V.txt:V.mut,flex:"1 1 120px"}}>{p.n}</span>
                <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"flex-end"}}>
                  <Tag c={p.s?V.em:V.mut}>{p.s?"ON":"OFF"}</Tag>
                  <Tag c={V.dim}>{p.dom}</Tag>
                </div>
                <div style={{width:"100%",fontSize:9,color:V.mut,marginTop:3,paddingLeft:22,lineHeight:1.4}}>{p.note}</div>
              </div>
            ))}
          </div>
        </div>}

        {/* ── SKILLS ── */}
        {tab==="skills"&&<div>
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
            <div style={{flex:"2 1 160px"}}><input value={sq} onChange={e=>setSq(e.target.value.toLowerCase())} placeholder="Search skills…" style={inputS}/></div>
            <select value={sc} onChange={e=>setSc(e.target.value)} style={selS}>
              <option value="all">All categories</option>
              {Object.keys(SKILL_CATS).map(c=><option key={c}>{c}</option>)}
            </select>
            <span style={{fontSize:10,color:V.mut,fontWeight:700}}>{filteredS.reduce((a,x)=>a+x.skills.length,0)}/{totalSkills}</span>
          </div>
          {filteredS.map(({cat,c,skills})=>(
            <div key={cat} style={{marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                <div style={{width:3,height:14,borderRadius:2,background:c}}/>
                <span style={{fontSize:9,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",color:c}}>{cat}</span>
                <span style={{fontSize:9,color:V.mut}}>{skills.length}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5}}>
                {skills.map(s=>(
                  <div key={s.n} style={{...rowS,flexDirection:"column",alignItems:"flex-start",marginBottom:0,padding:"8px 10px"}}>
                    <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap",marginBottom:3}}>
                      <span style={{fontSize:10,fontWeight:800,fontFamily:"monospace",color:s.t==="new"?V.am:s.t==="builtin"?V.mut:V.txt}}>{s.n}</span>
                      <Tag c={s.t==="user"?c:s.t==="new"?V.am:s.t==="builtin"?"#475569":V.mut}>
                        {s.t==="user"?"USR":s.t==="new"?"NEW":s.t==="builtin"?"BTIN":"EX"}
                      </Tag>
                    </div>
                    <div style={{fontSize:9,color:V.mut,lineHeight:1.4}}>{s.note}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>}

        {/* ── CONNECTORS ── */}
        {tab==="connectors"&&<div>
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
            <div style={{flex:"2 1 160px"}}><input value={cq} onChange={e=>setCq(e.target.value.toLowerCase())} placeholder="Search connectors…" style={inputS}/></div>
            <div style={{fontSize:10,color:V.mut,fontWeight:700,display:"flex",gap:8}}>
              <span style={{color:V.cyan}}>● {webConn} web</span>
              <span style={{color:V.fuch}}>● {deskConn} desktop</span>
              <span style={{color:V.mut}}>● {Object.values(CONNECTORS).flat().filter(c=>c.s==="no").length} not connected</span>
            </div>
          </div>
          {filteredC.map(([grp,items])=>(
            <div key={grp} style={{marginBottom:12}}>
              <div style={{fontSize:9,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",color:V.mut,marginBottom:6}}>{grp}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5}}>
                {items.map(c=>(
                  <div key={c.n} style={{...rowS,marginBottom:0,opacity:c.s==="no"?0.6:1,flexWrap:"wrap"}}>
                    <Brd s={c.s}/>
                    <span style={{fontSize:10,fontWeight:700,color:c.s==="no"?V.mut:V.txt,flex:1}}>{c.n}</span>
                    <div style={{width:"100%",fontSize:9,color:V.mut,marginTop:2,lineHeight:1.4}}>{c.note}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>}

        {/* ── REFERENCE ── */}
        {tab==="reference"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {/* routines */}
          <div style={{...card,gridColumn:"1/-1"}}>
            <div style={{fontSize:9,fontWeight:800,color:V.mut,letterSpacing:"0.08em",marginBottom:10}}>ROUTINES · AUTOMATIONS</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:5}}>
              {ROUTINES.map(r=>(
                <div key={r.n} style={{...rowS,marginBottom:0,flexWrap:"wrap"}}>
                  <span style={{fontSize:11,fontWeight:900,fontFamily:"monospace",color:r.t==="kyle-os"?V.vio:V.cyan,minWidth:90}}>{r.n}</span>
                  <Tag c={r.t==="kyle-os"?V.vio:V.cyan}>{r.t==="kyle-os"?"KYLE-OS":"AUTO"}</Tag>
                  <div style={{width:"100%",fontSize:9,color:V.mut,marginTop:3,lineHeight:1.4}}>{r.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* agents */}
          <div style={{...card}}>
            <div style={{fontSize:9,fontWeight:800,color:V.mut,letterSpacing:"0.08em",marginBottom:10}}>ACTIVE AGENTS</div>
            {[
              {n:"Drive Council",t:"multi-agent",note:"CrewAI agent council · classify → route → audit · Supabase trail"},
              {n:"HITL System",  t:"n8n-hybrid", note:"Human-in-the-loop · 5 n8n workflows · Daniel Bell P1 escalation"},
              {n:"KB Screenshot",t:"browser",    note:"Claude in Chrome → Scribe export → screenshot insertion → .docx"},
              {n:"FlashFusion AI",t:"platform",  note:"SMB enablement platform · 7 plugin domains · 50-skill suite"},
              {n:"Production Agents Suite",t:"config",note:"Production-grade agent configs with observability + retry logic"},
              {n:"Sidecar Coworker",t:"companion",note:"Cross-references active sessions · surfaces related context"},
            ].map(a=>(
              <div key={a.n} style={{...rowS,marginBottom:5,flexWrap:"wrap"}}>
                <span style={{fontWeight:800,fontSize:11,color:V.txt,flex:1}}>{a.n}</span>
                <Tag c={V.am}>{a.t}</Tag>
                <div style={{width:"100%",fontSize:9,color:V.mut,marginTop:3,lineHeight:1.4}}>{a.note}</div>
              </div>
            ))}
          </div>

          {/* plugin domains */}
          <div style={{...card}}>
            <div style={{fontSize:9,fontWeight:800,color:V.mut,letterSpacing:"0.08em",marginBottom:10}}>FLASHFUSION PLUGIN DOMAINS</div>
            {[
              {d:"flashfusion-revenue",         c:V.em,   note:"Billing · Stripe · ROI calculators · pricing workflows"},
              {d:"flashfusion-ai-risk-ops",      c:V.red,  note:"AI ethics · governance · HITL · SOC 2 · risk scoring"},
              {d:"flashfusion-platform-engineering",c:V.cyan,note:"Infra · Cloudflare · Vercel · n8n · Claude Code setup"},
              {d:"flashfusion-ai-product",       c:V.vio,  note:"PRD · UX research · product tracking · roadmap generation"},
              {d:"flashfusion-growth-marketing", c:V.fuch, note:"SEO · ASO · social posts · newsletter · marketing automation"},
              {d:"flashfusion-industry-verticals",c:V.am,  note:"ChaosClubCo · client verticals · customization service"},
              {d:"flashfusion-personal",         c:"#a78bfa",note:"Anchor · challenge tracking · kyle-os · morning pack"},
            ].map(x=>(
              <div key={x.d} style={{display:"flex",gap:7,marginBottom:6,padding:"5px 8px",borderRadius:6,border:`1px solid ${x.c}20`,background:`${x.c}06`}}>
                <div style={{width:2,borderRadius:1,background:x.c,flexShrink:0}}/>
                <div><div style={{fontSize:9,fontWeight:800,color:x.c,marginBottom:1,fontFamily:"monospace"}}>{x.d}</div>
                <div style={{fontSize:9,color:V.mut}}>{x.note}</div></div>
              </div>
            ))}
          </div>
        </div>}

      </div>
    </div>
  );
}
