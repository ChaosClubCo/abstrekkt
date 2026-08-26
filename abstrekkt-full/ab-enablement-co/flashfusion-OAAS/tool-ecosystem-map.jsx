import { useState, useRef, useEffect } from "react";

const LANES   = ['All','Build','Deploy','Automate','Create','Operate'];
const LC      = { All:'#6b7280', Build:'#7c6fff', Deploy:'#22d3a4', Automate:'#f97316', Create:'#ec4899', Operate:'#38bdf8' };
const TC      = { 1:{bg:'#052e16',c:'#4ade80'}, 2:{bg:'#0c1a4a',c:'#7dd3fc'}, 3:{bg:'#431407',c:'#fb923c'} };
const TIER    = { 1:'Core', 2:'Active', 3:'Exp' };
const CC      = { paid:'#fbbf24', free:'#34d399', built:'#a78bfa', employer:'#38bdf8', mixed:'#94a3b8' };

const PLATFORMS = [
  { id:'anthropic', name:'Anthropic', color:'#ff6b35', x:730, y:235,
    desc:'Primary AI layer. Claude across every interface — daily driver for everything built.',
    tools:[
      {id:'c1',name:'Claude.ai',tier:1,cost:'paid',lanes:['Build','Automate','Create','Operate'],usage:'Daily driver. Reasoning, memoir, code review, FlashFusion strategy. Max plan.'},
      {id:'c2',name:'Claude Code CLI',tier:1,cost:'paid',lanes:['Build','Deploy'],usage:'Agentic terminal coding. Builds entire features, manages repos, runs tests autonomously.'},
      {id:'c3',name:'Claude Desktop',tier:1,cost:'paid',lanes:['Build','Operate'],usage:'Local MCP hub. Connects to filesystem, Notion, GitHub, Drive simultaneously.'},
      {id:'c4',name:'Claude Cowork',tier:2,cost:'paid',lanes:['Build','Operate'],usage:'Desktop automation. File ops, multi-app task management.'},
      {id:'c5',name:'Claude in Chrome',tier:2,cost:'paid',lanes:['Automate','Operate'],usage:'Browser agentic tasks. Research, form automation, web scraping.'},
      {id:'c6',name:'Claude Skills (39)',tier:1,cost:'built',lanes:['Build','Automate'],usage:'39 production skills: engineering, design, automation, docs, AI/LLM, business.'},
      {id:'c7',name:'Claude Projects',tier:1,cost:'paid',lanes:['Build','Operate'],usage:'Context-persistent workspaces. Memoir, FlashFusion, ChaosClub as separate lanes.'},
      {id:'c8',name:'Claude Max',tier:1,cost:'paid',lanes:['Build'],usage:'Highest-tier compute. Complex builds and long-context work.'},
    ]},

  { id:'openai', name:'OpenAI', color:'#10a37f', x:1010, y:155,
    desc:'Second AI layer. API backbone, Codex for repo-scale changes, GPT in multi-model pipelines.',
    tools:[
      {id:'o1',name:'ChatGPT Plus',tier:1,cost:'paid',lanes:['Build','Create','Operate'],usage:'Second-opinion reasoning, prompt testing, alternative framing.'},
      {id:'o2',name:'OpenAI API',tier:1,cost:'paid',lanes:['Build'],usage:'Embeddings (text-embedding-3-small), function calling, structured JSON in production apps.'},
      {id:'o3',name:'Codex Desktop',tier:1,cost:'paid',lanes:['Build'],usage:'Repo-level edits. Applies multi-file natural language changes across a codebase.'},
      {id:'o4',name:'DALL-E',tier:2,cost:'paid',lanes:['Create'],usage:'Image generation for UI prototyping and concept mockups.'},
      {id:'o5',name:'Whisper',tier:2,cost:'free',lanes:['Create','Operate'],usage:'Audio transcription. Meeting notes, voice memo → structured text.'},
    ]},

  { id:'google', name:'Google / Gemini', color:'#4285f4', x:1280, y:355,
    desc:'Cloud backbone + Gemini AI + primary app build platform. GCP, Firebase, AI Studio with 20+ apps built.',
    tools:[
      {id:'g1',name:'Gemini',tier:1,cost:'paid',lanes:['Build','Create'],usage:'Long-context analysis. Document processing, multi-modal tasks.'},
      {id:'g2',name:'Gemini CLI',tier:1,cost:'free',lanes:['Build'],usage:'Terminal Gemini. Pairs with Claude Code for multi-model dev.'},
      {id:'g3',name:'Google AI Studio',tier:1,cost:'free',lanes:['Build','Create'],usage:'PRIMARY BUILD PLATFORM for 20+ apps: Nebula SaaS Studio, AutoArchitect v3.4, Aether (integrated agentic ecosystem), Virtual Agent Workspace, DashLib AI, Canary in a Box, and more. Also used for prompt prototyping and model testing.'},
      {id:'g4',name:'Google Antigravity',tier:1,cost:'free',lanes:['Build'],usage:'AI-powered coding assistant inside Google ecosystem.'},
      {id:'g5',name:'Google Cloud',tier:1,cost:'paid',lanes:['Deploy'],usage:'Firebase hosting, Cloud Run, BigQuery analytics, Cloud Functions.'},
      {id:'g6',name:'Firebase',tier:1,cost:'paid',lanes:['Build','Deploy'],usage:'Chaos Club Co. backend. Auth, Firestore, Storage, Functions. React 19 + Vite + Gemini stack.'},
      {id:'g7',name:'NotebookLM',tier:1,cost:'free',lanes:['Operate','Create'],usage:'FlashFusion Foundation notebook. Research synthesis + podcast-style summaries.'},
      {id:'g8',name:'Google Workspace',tier:1,cost:'paid',lanes:['Operate'],usage:'Gmail, Calendar, Drive — daily communication and file layer.'},
      {id:'g9',name:'Gemini Code Assist',tier:2,cost:'free',lanes:['Build'],usage:'IDE code completion and review in VS Code.'},
      {id:'g10',name:'BigQuery',tier:2,cost:'paid',lanes:['Operate'],usage:'Log analysis, large dataset queries via Cloudflare Logpush.'},
    ]},

  { id:'microsoft', name:'Microsoft', color:'#00a4ef', x:1280, y:680,
    desc:'Enterprise AI + MSP ops layer. Copilot ecosystem across M365 and Azure.',
    tools:[
      {id:'m1',name:'Copilot',tier:2,cost:'paid',lanes:['Build','Operate'],usage:'Embedded AI in M365. Drafting, summarizing, Teams meeting notes.'},
      {id:'m2',name:'Copilot Studio',tier:2,cost:'paid',lanes:['Build','Automate'],usage:'Custom AI agents for MSP automation. Freshservice ticket integration.'},
      {id:'m3',name:'Azure AI Foundry',tier:2,cost:'paid',lanes:['Build'],usage:'Enterprise AI model deployment, fine-tuning, evaluation.'},
      {id:'m4',name:'Microsoft 365',tier:1,cost:'paid',lanes:['Operate'],usage:'Teams, Outlook, SharePoint — enterprise communication layer.'},
      {id:'m5',name:'Azure',tier:2,cost:'paid',lanes:['Deploy'],usage:'Cloud infra for enterprise MSP services and agent hosting.'},
      {id:'m6',name:'Agent 365',tier:2,cost:'paid',lanes:['Automate'],usage:'Agentic automation within the M365 ecosystem.'},
    ]},

  { id:'github', name:'GitHub / Dev', color:'#79c0ff', x:640, y:735,
    desc:'656 repos across 3 orgs. Source of truth for everything built.',
    tools:[
      {id:'gh1',name:'GitHub',tier:1,cost:'paid',lanes:['Build','Deploy'],usage:'656 repos: KR personal, ChaosClubCo, FlashFusionv1. Version control foundation.'},
      {id:'gh2',name:'GitHub Actions',tier:1,cost:'paid',lanes:['Deploy','Automate'],usage:'CI/CD. Auto-deploy to Vercel on merge, run test suites.'},
      {id:'gh3',name:'Copilot CLI',tier:2,cost:'paid',lanes:['Build'],usage:'Terminal AI assist for git ops and shell command generation.'},
      {id:'gh4',name:'Codespaces',tier:2,cost:'paid',lanes:['Build'],usage:'Cloud dev environments for repo-specific isolated contexts.'},
      {id:'gh5',name:'CodeRabbit',tier:2,cost:'free',lanes:['Build'],usage:'AI PR review bot. Catches logic errors on every PR.'},
      {id:'gh6',name:'Qodo',tier:3,cost:'free',lanes:['Build'],usage:'Test generation and code quality analysis.'},
    ]},

  { id:'aibuilders', name:'AI Builders', color:'#8b5cf6', x:290, y:490,
    desc:'Vibe-coding platforms. Base44 has 41 apps across FlashFusion, INT, and Personal lanes.',
    tools:[
      {id:'ab1',name:'Cursor',tier:1,cost:'paid',lanes:['Build'],usage:'Primary IDE for complex multi-file builds. Composer + MCP integration. Active Snyk HIGH findings tracked.'},
      {id:'ab2',name:'Replit',tier:1,cost:'paid',lanes:['Build','Deploy'],usage:'3 workspaces: KR personal, FlashFusion team, INT team. DashGen/OmniGen deployed here.'},
      {id:'ab3',name:'Base44',tier:1,cost:'paid',lanes:['Build','Deploy'],usage:'41 apps across 4 lanes: Fusion AI, Invoke, Beta Tester Army, agentrus, WebnfloW, TESSA, ArchDesigner, Graph Studio, Orchestrator AI, Continuum + INT apps (TeamSync, INTeract, Card Catalog AI).'},
      {id:'ab4',name:'Lovable.dev',tier:2,cost:'paid',lanes:['Build','Deploy'],usage:'Full-stack React + Supabase generation from prompts.'},
      {id:'ab5',name:'v0',tier:2,cost:'free',lanes:['Build','Create'],usage:'UI component gen. shadcn/ui prototyping from text.'},
      {id:'ab6',name:'Bolt.new',tier:2,cost:'free',lanes:['Build'],usage:'Browser-based WebContainer full-stack prototypes.'},
      {id:'ab7',name:'Firebase Studio',tier:2,cost:'free',lanes:['Build'],usage:'Firebase-native scaffolding and deployment.'},
    ]},

  { id:'deploy', name:'Deploy / Cloud', color:'#0d9488', x:290, y:255,
    desc:'Vercel + Cloudflare as the deploy backbone. Wix for commerce. WordPress for personal brand.',
    tools:[
      {id:'dp1',name:'Vercel',tier:1,cost:'paid',lanes:['Deploy'],usage:'Primary deploy. FlashFusion, Continuum, kylerosebrook.com.'},
      {id:'dp2',name:'Cloudflare',tier:1,cost:'paid',lanes:['Deploy','Build'],usage:'DNS, CDN, DDoS protection. Foundation layer for all domains.'},
      {id:'dp3',name:'CF Workers',tier:1,cost:'paid',lanes:['Build','Deploy'],usage:'Serverless edge. API proxies, webhook handlers, KV + Queues + R2.'},
      {id:'dp4',name:'Cloudflare R2',tier:2,cost:'paid',lanes:['Build','Deploy'],usage:'S3-compatible storage. Chaos Club premium content gating via signed URLs.'},
      {id:'dp5',name:'Netlify',tier:2,cost:'paid',lanes:['Deploy'],usage:'Secondary static site deploy for marketing pages.'},
      {id:'dp6',name:'Wix',tier:2,cost:'paid',lanes:['Deploy','Create'],usage:'FlashFusion commercial store. Site ID 4cad8458. 20 products. 3 API-blocked manual steps pending automation.'},
      {id:'dp7',name:'WordPress.com',tier:3,cost:'paid',lanes:['Deploy','Create'],usage:'kylerosebrook.com personal site. Blog ID 253504189. Launch pending.'},
    ]},

  { id:'backend', name:'Backend / Data', color:'#f59e0b', x:455, y:120,
    desc:'Supabase + PostgreSQL backbone. Vector layer powers RAG pipelines and agent memory.',
    tools:[
      {id:'be1',name:'Supabase',tier:1,cost:'paid',lanes:['Build','Deploy'],usage:'Primary backend. PostgreSQL + Auth + Storage + Realtime. FlashFusion Continuum core. Active security: plaintext OAuth tokens in social_platforms table flagged.'},
      {id:'be2',name:'PostgreSQL',tier:1,cost:'free',lanes:['Build'],usage:'Relational backbone with pgvector extension for AI embedding storage.'},
      {id:'be3',name:'Redis / Upstash',tier:2,cost:'paid',lanes:['Build','Deploy'],usage:'Caching, rate limiting, session storage.'},
      {id:'be4',name:'Stripe',tier:2,cost:'paid',lanes:['Build','Operate'],usage:'Payments. Chaos Club subscriptions, FlashFusion invoicing.'},
      {id:'be5',name:'Prisma',tier:2,cost:'paid',lanes:['Build'],usage:'ORM. Type-safe, schema-first database access.'},
      {id:'be6',name:'Resend',tier:2,cost:'paid',lanes:['Build','Operate'],usage:'Transactional email. Chaos Club notifications, FlashFusion comms.'},
      {id:'be7',name:'NeonDB',tier:2,cost:'free',lanes:['Build'],usage:'Serverless PostgreSQL with database branching for dev environments.'},
    ]},

  { id:'mcp', name:'MCP Layer', color:'#a855f7', x:730, y:100,
    desc:'240+ tools catalogued. 50+ servers configured. The connective tissue of the stack.',
    tools:[
      {id:'mc1',name:'240+ MCP Tools',tier:1,cost:'mixed',lanes:['Build','Automate'],usage:'Full catalog. Catalogued and tested — ~30 mastered active at any time.'},
      {id:'mc2',name:'50+ MCP Servers',tier:1,cost:'mixed',lanes:['Build','Automate'],usage:'Active: GitHub, Supabase, Notion, Drive, Figma, Slack, Linear, Vercel + more.'},
      {id:'mc3',name:'Firecrawl MCP',tier:2,cost:'paid',lanes:['Build','Automate'],usage:'Web scraping and content extraction through MCP protocol.'},
      {id:'mc4',name:'Playwright MCP',tier:2,cost:'free',lanes:['Build','Automate'],usage:'Browser automation. KB article screenshot capture, QA workflows.'},
      {id:'mc5',name:'Context7 MCP',tier:2,cost:'free',lanes:['Build'],usage:'Live library documentation retrieval. Always-fresh docs in context.'},
      {id:'mc6',name:'Sequential Thinking',tier:2,cost:'free',lanes:['Build'],usage:'Structured reasoning chains for complex problem decomposition.'},
    ]},

  { id:'agents', name:'Agent / LLMOps', color:'#22d3ee', x:960, y:355,
    desc:'LangGraph orchestration spine + LangSmith observability. The agent infrastructure layer powering FlashFusion Agent Stack v1.9.9.',
    tools:[
      {id:'ag1',name:'LangGraph',tier:1,cost:'built',lanes:['Build','Automate'],usage:'PRIMARY agent orchestration spine. FlashFusion Agent Stack v1.9.9 — 5 agents: Orchestration Core, Persistent Context, Security Guardian, Deploy+Rollback, Universal Template Generator.'},
      {id:'ag2',name:'LangSmith',tier:2,cost:'paid',lanes:['Operate','Build'],usage:'Agent observability. Traces every LLM call, measures output quality, debugs agent runs in production.'},
      {id:'ag3',name:'CrewAI',tier:2,cost:'paid',lanes:['Build','Automate'],usage:'Scoped to listing_crew. Multi-agent crew for structured role-based automation tasks.'},
      {id:'ag4',name:'Cohere Rerank',tier:2,cost:'paid',lanes:['Build'],usage:'Reranking in RAG pipeline (Knowledge Lane). Improves retrieval precision before LLM synthesis. Pairs with pgvector/Pinecone.'},
      {id:'ag5',name:'Pinecone',tier:2,cost:'paid',lanes:['Build'],usage:'Vector database for production RAG at scale. High-throughput embedding search alongside pgvector.'},
      {id:'ag6',name:'Weaviate',tier:2,cost:'free',lanes:['Build'],usage:'Open-source vector database. Self-hosted vector search option for RAG stack.'},
    ]},

  { id:'automation', name:'Automation', color:'#f97316', x:730, y:490,
    desc:'n8n as the orchestration hub. Everything connects through automated workflows.',
    tools:[
      {id:'au1',name:'n8n',tier:1,cost:'paid',lanes:['Automate'],usage:'Primary automation hub. krosebrook.app.n8n.cloud. Portfolio Command Center, drive automation, newsletter workflows. 4/9 active workflows; WF-05 is Priority 1.'},
      {id:'au2',name:'Zapier',tier:1,cost:'paid',lanes:['Automate'],usage:'200+ actions. Business process automation, SaaS connectors, CRM pipelines.'},
      {id:'au3',name:'Make',tier:2,cost:'paid',lanes:['Automate'],usage:'Complex multi-step visual automation. Data transformation pipelines.'},
      {id:'au4',name:'IFTTT',tier:3,cost:'free',lanes:['Automate'],usage:'Simple consumer app trigger/action automations.'},
      {id:'au5',name:'Pipedream',tier:3,cost:'free',lanes:['Automate','Build'],usage:'Code-first automation with API integrations.'},
    ]},

  { id:'knowledge', name:'Knowledge / PM', color:'#6366f1', x:1030, y:520,
    desc:'Notion as the OS. Everything documented, tracked, and connected to the workflow.',
    tools:[
      {id:'kn1',name:'Notion',tier:1,cost:'paid',lanes:['Operate'],usage:'Portfolio Command Center, FlashFusion Foundation notebook, knowledge OS. Authoritative source for technical specs.'},
      {id:'kn2',name:'Linear',tier:2,cost:'paid',lanes:['Operate','Build'],usage:'Issue tracking for FlashFusion and Chaos Club development sprints.'},
      {id:'kn3',name:'Obsidian',tier:2,cost:'free',lanes:['Operate','Create'],usage:'Local markdown KB. Memoir notes, personal research.'},
      {id:'kn4',name:'Mem',tier:2,cost:'paid',lanes:['Operate'],usage:'AI memory layer connected to Claude via MCP.'},
      {id:'kn5',name:'Craft',tier:2,cost:'paid',lanes:['Create','Operate'],usage:'Polished documents. Essays, blog posts, long-form writing.'},
      {id:'kn6',name:'OneNote',tier:1,cost:'paid',lanes:['Operate'],usage:'MSP documentation and internal KB articles at INT.'},
    ]},

  { id:'design', name:'Design / Creative', color:'#ec4899', x:900, y:870,
    desc:'Figma to ElevenLabs to Meshy. Full creative and 3D production stack.',
    tools:[
      {id:'de1',name:'Figma',tier:1,cost:'paid',lanes:['Create','Build'],usage:'UI design hub. FlashFusion designs, tool UIs, shadcn/ui component library.'},
      {id:'de2',name:'Canva',tier:1,cost:'paid',lanes:['Create'],usage:'Marketing assets, social graphics, brand visuals at scale.'},
      {id:'de3',name:'ElevenLabs',tier:2,cost:'paid',lanes:['Create'],usage:'Voice cloning and audio content for ChaosClub and personal brand.'},
      {id:'de4',name:'Suno',tier:2,cost:'paid',lanes:['Create'],usage:'AI music gen. Song mining excavation for Chaos Club creative layer.'},
      {id:'de5',name:'Sora 2',tier:2,cost:'paid',lanes:['Create'],usage:'Video generation from text. Social content and product demos.'},
      {id:'de6',name:'Cloudinary',tier:2,cost:'paid',lanes:['Deploy','Create'],usage:'Image/video CDN. Transformations, optimization, delivery.'},
      {id:'de7',name:'InVideo',tier:2,cost:'paid',lanes:['Create'],usage:'Template-based AI video creation for social content.'},
      {id:'de8',name:'Leonardo.AI',tier:2,cost:'paid',lanes:['Create'],usage:'Image gen for design assets and UI prototyping.'},
      {id:'de9',name:'Meshy AI',tier:2,cost:'paid',lanes:['Create'],usage:'AI-powered 3D model generation. Meshes, textures, scenes from text or image prompts.'},
      {id:'de10',name:'Stability AI',tier:2,cost:'paid',lanes:['Create'],usage:'Image generation backbone. Used in multi-modal pipelines alongside DALL-E and Leonardo.'},
      {id:'de11',name:'Procreate',tier:2,cost:'paid',lanes:['Create'],usage:'Digital illustration on iPad. Hand-crafted visual elements.'},
      {id:'de12',name:'Runway',tier:3,cost:'paid',lanes:['Create'],usage:'Professional AI video editing and generation.'},
    ]},

  { id:'ops', name:'Ops / Observe', color:'#94a3b8', x:505, y:870,
    desc:'Freshservice for MSP. Sentry + PostHog + LangSmith on every build. Snyk as AppSec gate.',
    tools:[
      {id:'op1',name:'Freshservice',tier:1,cost:'employer',lanes:['Operate'],usage:'MSP service desk at INT. Ticket triage, workflow automation, AI-assisted categorization.'},
      {id:'op2',name:'Sentry',tier:2,cost:'paid',lanes:['Operate','Deploy'],usage:'Error tracking. Every production app has Sentry configured.'},
      {id:'op3',name:'PostHog',tier:2,cost:'paid',lanes:['Operate'],usage:'Product analytics. Feature flags, session replay, funnels.'},
      {id:'op4',name:'HubSpot',tier:2,cost:'paid',lanes:['Operate'],usage:'CRM for FlashFusion client pipeline. Ryan Anderskow, Lee Chong Ming outreach.'},
      {id:'op5',name:'Snyk',tier:2,cost:'paid',lanes:['Operate','Build'],usage:'Dependency vulnerability scanning. Active HIGH findings in Roo-Code (no fix available). Mandatory AppSec gate.'},
      {id:'op6',name:'Datadog',tier:3,cost:'paid',lanes:['Operate'],usage:'Infrastructure monitoring for complex multi-service deployments.'},
    ]},
];

const CONNECTIONS = [
  {from:'anthropic', to:'github',    label:'Claude Code → git push',         lane:'Build'},
  {from:'github',    to:'deploy',    label:'Actions → Vercel auto-deploy',    lane:'Deploy'},
  {from:'deploy',    to:'backend',   label:'Vercel ↔ Supabase API',           lane:'Deploy'},
  {from:'anthropic', to:'mcp',       label:'Desktop → MCP servers',           lane:'Build'},
  {from:'mcp',       to:'knowledge', label:'Notion + Drive MCP',              lane:'Automate'},
  {from:'mcp',       to:'github',    label:'GitHub MCP',                      lane:'Build'},
  {from:'automation',to:'knowledge', label:'n8n → Notion sync',               lane:'Automate'},
  {from:'automation',to:'google',    label:'n8n → Gmail + Drive',             lane:'Automate'},
  {from:'backend',   to:'ops',       label:'Sentry + PostHog',                lane:'Operate'},
  {from:'aibuilders',to:'backend',   label:'Base44 → Supabase',               lane:'Build'},
  {from:'aibuilders',to:'deploy',    label:'Replit → Vercel',                 lane:'Deploy'},
  {from:'google',    to:'deploy',    label:'Firebase hosting',                lane:'Deploy'},
  {from:'microsoft', to:'ops',       label:'Copilot Studio → Freshservice',   lane:'Operate'},
  {from:'openai',    to:'backend',   label:'API → Supabase embeddings',       lane:'Build'},
  {from:'design',    to:'deploy',    label:'Cloudinary CDN',                  lane:'Deploy'},
  {from:'anthropic', to:'knowledge', label:'Claude → Notion MCP',             lane:'Operate'},
  {from:'openai',    to:'anthropic', label:'Multi-model pipeline',            lane:'Build'},
  {from:'automation',to:'ops',       label:'n8n → HubSpot',                   lane:'Operate'},
  {from:'mcp',       to:'aibuilders',label:'MCP in Cursor',                   lane:'Build'},
  {from:'github',    to:'backend',   label:'Supabase GitHub integration',     lane:'Deploy'},
  {from:'automation',to:'deploy',    label:'GitHub Actions triggers',         lane:'Automate'},
  // Agent/LLMOps
  {from:'anthropic', to:'agents',    label:'Claude LLM backbone',             lane:'Build'},
  {from:'openai',    to:'agents',    label:'GPT in multi-model agents',       lane:'Build'},
  {from:'agents',    to:'backend',   label:'pgvector memory layer',           lane:'Build'},
  {from:'agents',    to:'ops',       label:'LangSmith traces',                lane:'Operate'},
  {from:'agents',    to:'automation',label:'n8n ↔ agent triggers',            lane:'Automate'},
];

function bezierPath(from, to) {
  const fp = PLATFORMS.find(p => p.id === from);
  const tp = PLATFORMS.find(p => p.id === to);
  if (!fp || !tp) return '';
  const dx = tp.x - fp.x, dy = tp.y - fp.y;
  const dist = Math.sqrt(dx*dx + dy*dy) || 1;
  const r = 52;
  const sx = fp.x + (dx/dist)*r, sy = fp.y + (dy/dist)*r;
  const ex = tp.x - (dx/dist)*r, ey = tp.y - (dy/dist)*r;
  const off = dist * 0.16;
  const cx = (sx+ex)/2 + (-dy/dist)*off;
  const cy = (sy+ey)/2 + (dx/dist)*off;
  return `M${sx},${sy} Q${cx},${cy} ${ex},${ey}`;
}

function orbitalTools(platform) {
  const n = platform.tools.length;
  const r = Math.max(128, n * 16 + 28);
  return platform.tools.map((t, i) => {
    const angle = (2*Math.PI*i/n) - Math.PI/2;
    return { ...t, ox: platform.x + r*Math.cos(angle), oy: platform.y + r*Math.sin(angle) };
  });
}

export default function ToolEcosystem() {
  const [selPlatform, setSelPlatform] = useState(null);
  const [selTool,     setSelTool]     = useState(null);
  const [lane,        setLane]        = useState('All');
  const [tooltip,     setTooltip]     = useState(null);
  const [tPos,        setTPos]        = useState({x:0, y:0});
  const [xf,          setXf]          = useState({tx:20, ty:30, s:0.64});
  const [panning,     setPanning]     = useState(false);
  const panRef = useRef(null);
  const cRef   = useRef(null);

  useEffect(() => {
    const el = cRef.current;
    if (!el) return;
    const h = e => {
      e.preventDefault();
      const f = e.deltaY < 0 ? 1.09 : 0.92;
      setXf(t => ({...t, s: Math.min(Math.max(t.s*f, 0.18), 2.8)}));
    };
    el.addEventListener('wheel', h, {passive:false});
    return () => el.removeEventListener('wheel', h);
  }, []);

  const onMouseDown = e => {
    if (e.button !== 0) return;
    setPanning(true);
    panRef.current = {sx: e.clientX - xf.tx, sy: e.clientY - xf.ty};
  };
  const onMouseMove = e => {
    setTPos({x: e.clientX, y: e.clientY});
    if (panning && panRef.current)
      setXf(t => ({...t, tx: e.clientX - panRef.current.sx, ty: e.clientY - panRef.current.sy}));
  };
  const onMouseUp = () => { setPanning(false); panRef.current = null; };

  const onBgClick = () => { setSelPlatform(null); setSelTool(null); };
  const onPlatformClick = (e, p) => {
    e.stopPropagation();
    if (selPlatform?.id === p.id) { setSelPlatform(null); setSelTool(null); }
    else { setSelPlatform(p); setSelTool(null); }
  };
  const onToolClick = (e, tool, platform) => {
    e.stopPropagation();
    setSelTool({...tool, platformName: platform.name, platformColor: platform.color});
  };

  const expanded      = selPlatform ? orbitalTools(selPlatform) : [];
  const isPFaded      = p => lane !== 'All' && !p.tools.some(t => t.lanes.includes(lane));
  const isToolFd      = t => lane !== 'All' && !t.lanes.includes(lane);
  const isConnActive  = c => {
    const ok = lane === 'All' || c.lane === lane;
    if (selPlatform) return ok && (c.from === selPlatform.id || c.to === selPlatform.id);
    return ok && lane !== 'All';
  };
  const isConnFaded   = c => {
    if (selPlatform) return c.from !== selPlatform.id && c.to !== selPlatform.id;
    return lane !== 'All' && c.lane !== lane;
  };
  const isConnToSel   = p => selPlatform && CONNECTIONS.some(
    c => (c.from === selPlatform.id && c.to === p.id) || (c.to === selPlatform.id && c.from === p.id)
  );

  const totalTools = PLATFORMS.reduce((s,p) => s + p.tools.length, 0);
  const showPanel  = selTool || selPlatform;
  const winW = typeof window !== 'undefined' ? window.innerWidth  : 1280;
  const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
  const ttx  = tPos.x + 16 + 240 > winW ? tPos.x - 256 : tPos.x + 16;
  const tty  = Math.min(tPos.y - 8, winH - 140);

  return (
    <div
      ref={cRef}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{
        background:'#05050d', width:'100vw', height:'100vh',
        fontFamily:'ui-sans-serif,system-ui,-apple-system,sans-serif',
        display:'flex', flexDirection:'column',
        overflow:'hidden', userSelect:'none',
      }}
    >
      {/* HEADER */}
      <div style={{
        padding:'10px 20px', flexShrink:0,
        background:'#07070f', borderBottom:'1px solid #11112a',
        display:'flex', alignItems:'center', gap:18,
      }}>
        <div>
          <span style={{color:'#f8f8ff',fontSize:13,fontWeight:700,letterSpacing:'-0.01em'}}>Kyle Rosebrook</span>
          <span style={{color:'#1e1e3a',margin:'0 8px'}}>/ </span>
          <span style={{color:'#4b5060',fontSize:12}}>Tool Ecosystem</span>
          <span style={{color:'#1e1e3a',margin:'0 8px',fontSize:11}}>·</span>
          <span style={{color:'#2a2a50',fontSize:11}}>
            {PLATFORMS.length} platforms · {totalTools}+ tools · 656 repos · 240+ MCP
          </span>
        </div>
        <div style={{flex:1}}/>
        <div style={{display:'flex',gap:5}}>
          {LANES.map(l => (
            <button key={l} onClick={() => setLane(l)} style={{
              padding:'3px 12px', borderRadius:20,
              border:`1px solid ${lane===l ? LC[l] : '#1a1a32'}`,
              background: lane===l ? LC[l]+'1a' : 'transparent',
              color: lane===l ? LC[l] : '#3a3a5a',
              fontSize:11, fontWeight:600, cursor:'pointer', transition:'all 0.15s',
            }}>{l}</button>
          ))}
        </div>
        <div style={{color:'#1a1a32',fontSize:10,marginLeft:8}}>scroll · drag · click</div>
      </div>

      {/* CANVAS */}
      <div style={{flex:1, position:'relative', overflow:'hidden'}}>
        <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.9" fill="#0d0d22"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)"/>
        </svg>

        <svg
          width="100%" height="100%"
          onMouseDown={onMouseDown}
          onClick={onBgClick}
          style={{cursor:panning?'grabbing':'grab', display:'block', position:'relative', zIndex:1}}
        >
          <g transform={`translate(${xf.tx},${xf.ty}) scale(${xf.s})`}>

            {/* CONNECTIONS */}
            {CONNECTIONS.map((c,i) => {
              const active = isConnActive(c);
              const faded  = isConnFaded(c);
              return (
                <path key={i} d={bezierPath(c.from, c.to)} fill="none"
                  stroke={active ? LC[c.lane] : '#10103a'}
                  strokeWidth={active ? 1.5 : 0.7}
                  strokeOpacity={faded ? 0.04 : active ? 0.8 : 0.3}
                  strokeDasharray={active ? 'none' : '3,7'}
                />
              );
            })}

            {/* SPOKES */}
            {expanded.map(t => (
              <line key={`sp-${t.id}`}
                x1={selPlatform.x} y1={selPlatform.y}
                x2={t.ox} y2={t.oy}
                stroke={selPlatform.color} strokeWidth={0.6}
                strokeOpacity={isToolFd(t) ? 0.06 : 0.22}
                strokeDasharray="2,6"
              />
            ))}

            {/* PLATFORM CLUSTERS */}
            {PLATFORMS.map(p => {
              const faded   = isPFaded(p);
              const sel     = selPlatform?.id === p.id;
              const connSel = isConnToSel(p);
              const dimmed  = selPlatform && !sel && !connSel;
              const r = 54;
              return (
                <g key={p.id}
                  transform={`translate(${p.x},${p.y})`}
                  onClick={e => onPlatformClick(e, p)}
                  onMouseEnter={() => setTooltip({type:'p',...p})}
                  onMouseLeave={() => setTooltip(null)}
                  style={{cursor:'pointer', opacity: faded?0.1:dimmed?0.26:1, transition:'opacity 0.2s'}}
                >
                  {sel    && <circle r={r+22} fill={p.color} fillOpacity={0.05}/>}
                  {sel    && <circle r={r+10} fill="none" stroke={p.color} strokeWidth={0.8} strokeOpacity={0.22} strokeDasharray="4,6"/>}
                  {connSel && <circle r={r+8}  fill={p.color} fillOpacity={0.07}/>}
                  <circle r={r}
                    fill={p.color} fillOpacity={sel?0.18:0.07}
                    stroke={p.color} strokeWidth={sel?1.8:0.9}
                    strokeOpacity={sel?1:0.45}
                  />
                  <text y={-9} textAnchor="middle" fill="#e8e8ff"
                    fontSize={10} fontWeight={700} letterSpacing="0.04em"
                    style={{pointerEvents:'none', textTransform:'uppercase'}}>
                    {p.name}
                  </text>
                  <text y={7} textAnchor="middle" fill={p.color}
                    fontSize={9} style={{pointerEvents:'none'}}>
                    {p.tools.length} tools
                  </text>
                </g>
              );
            })}

            {/* EXPANDED TOOL NODES */}
            {expanded.map(t => {
              const faded = isToolFd(t);
              const sel   = selTool?.id === t.id;
              const lbl   = t.name.length > 13 ? t.name.slice(0,12)+'…' : t.name;
              return (
                <g key={`et-${t.id}`}
                  transform={`translate(${t.ox},${t.oy})`}
                  onClick={e => onToolClick(e, t, selPlatform)}
                  onMouseEnter={() => setTooltip({type:'t',...t, pColor:selPlatform.color})}
                  onMouseLeave={() => setTooltip(null)}
                  style={{cursor:'pointer', opacity:faded?0.1:1, transition:'opacity 0.2s'}}
                >
                  {sel && <circle r={27} fill={selPlatform.color} fillOpacity={0.18}/>}
                  <circle r={21}
                    fill={selPlatform.color} fillOpacity={sel?0.28:0.1}
                    stroke={selPlatform.color} strokeWidth={sel?1.8:0.8}
                    strokeOpacity={sel?1:0.4}
                  />
                  <text textAnchor="middle" fill="#d8d8f0" fontSize={7} fontWeight={500}
                    dy={3} style={{pointerEvents:'none'}}>
                    {lbl}
                  </text>
                  <circle cx={15} cy={-15} r={3.5}
                    fill={t.tier===1?'#4ade80':t.tier===2?'#7dd3fc':'#fb923c'}
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {/* TOOLTIP */}
        {tooltip && !panning && (
          <div style={{
            position:'fixed', left:ttx, top:tty, pointerEvents:'none', zIndex:200,
            background:'#0c0c1e',
            border:`1px solid ${(tooltip.color||tooltip.pColor||'#333')}45`,
            borderRadius:8, padding:'9px 13px', maxWidth:240,
          }}>
            <div style={{color:'#f0f0ff',fontSize:12,fontWeight:700,
              marginBottom:(tooltip.desc||tooltip.usage)?4:0}}>
              {tooltip.name}
            </div>
            {tooltip.type==='p' && tooltip.desc && (
              <div style={{color:'#5a5a7a',fontSize:10.5,lineHeight:1.55}}>{tooltip.desc}</div>
            )}
            {tooltip.type==='t' && <>
              <div style={{color:'#4a4a6a',fontSize:10,marginBottom:3}}>
                <span style={{color:TC[tooltip.tier]?.c}}>{TIER[tooltip.tier]}</span>
                {' · '}<span style={{color:CC[tooltip.cost]}}>{tooltip.cost}</span>
                {' · '}<span style={{color:'#3a3a5a'}}>{tooltip.lanes?.join(', ')}</span>
              </div>
              <div style={{color:'#3a3a58',fontSize:9.5,lineHeight:1.5}}>
                {(tooltip.usage||'').slice(0,95)}{(tooltip.usage?.length||0)>95?'…':''}
              </div>
            </>}
          </div>
        )}

        {/* SIDE PANEL */}
        {showPanel && (
          <div style={{
            position:'absolute', right:0, top:0, bottom:0, width:292,
            background:'#08081a', borderLeft:'1px solid #11112a',
            overflowY:'auto', padding:'18px 20px', zIndex:50,
          }}>
            {selTool ? (
              <>
                <button onClick={() => setSelTool(null)} style={{
                  background:'#0f0f28', border:'none', color:'#4a4a6a',
                  borderRadius:4, padding:'3px 10px', cursor:'pointer',
                  fontSize:11, marginBottom:18,
                }}>← back</button>
                <div style={{color:'#3a3a5a',fontSize:9,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:4}}>
                  {selTool.platformName}
                </div>
                <div style={{color:'#f0f0ff',fontSize:17,fontWeight:700,marginBottom:13,lineHeight:1.25,
                  borderBottom:`1px solid ${selTool.platformColor}30`,paddingBottom:13}}>
                  {selTool.name}
                </div>
                <div style={{display:'flex',gap:6,marginBottom:16,flexWrap:'wrap'}}>
                  <span style={{padding:'2px 8px',borderRadius:4,fontSize:10,fontWeight:600,
                    background:TC[selTool.tier]?.bg,color:TC[selTool.tier]?.c}}>
                    {TIER[selTool.tier]}
                  </span>
                  <span style={{padding:'2px 8px',borderRadius:4,fontSize:10,fontWeight:600,
                    background:'#0f0f28',color:CC[selTool.cost],textTransform:'capitalize'}}>
                    {selTool.cost}
                  </span>
                </div>
                <div style={{color:'#2a2a48',fontSize:9,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:7}}>
                  Workflow Lanes
                </div>
                <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:18}}>
                  {selTool.lanes?.map(l => (
                    <span key={l} style={{padding:'2px 10px',borderRadius:12,
                      background:LC[l]+'18',color:LC[l],fontSize:10,fontWeight:600}}>{l}</span>
                  ))}
                </div>
                <div style={{color:'#2a2a48',fontSize:9,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:9}}>
                  How I Use It
                </div>
                <div style={{color:'#9090b8',fontSize:12,lineHeight:1.75}}>{selTool.usage}</div>
              </>
            ) : selPlatform ? (
              <>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                  <div style={{width:9,height:9,borderRadius:'50%',background:selPlatform.color}}/>
                  <div style={{color:'#f0f0ff',fontSize:15,fontWeight:700}}>{selPlatform.name}</div>
                </div>
                <div style={{color:'#3a3a58',fontSize:11.5,lineHeight:1.7,marginBottom:18,
                  paddingBottom:15,borderBottom:'1px solid #11112a'}}>
                  {selPlatform.desc}
                </div>
                <div style={{color:'#2a2a48',fontSize:9,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:10}}>
                  Tools ({selPlatform.tools.length})
                </div>
                {selPlatform.tools.map(t => (
                  <div key={t.id}
                    onClick={e => onToolClick(e, t, selPlatform)}
                    style={{padding:'7px 10px',borderRadius:6,background:'#0c0c20',marginBottom:5,
                      cursor:'pointer',border:`1px solid ${selPlatform.color}18`,transition:'border-color 0.12s'}}
                    onMouseEnter={e => e.currentTarget.style.borderColor = selPlatform.color+'50'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = selPlatform.color+'18'}
                  >
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{color:'#d0d0f0',fontSize:12}}>{t.name}</span>
                      <span style={{fontSize:9,padding:'1px 5px',borderRadius:3,fontWeight:600,
                        background:TC[t.tier]?.bg,color:TC[t.tier]?.c}}>
                        {TIER[t.tier]}
                      </span>
                    </div>
                    <div style={{marginTop:3}}>
                      {t.lanes?.map(l => (
                        <span key={l} style={{color:LC[l],fontSize:9,marginRight:5}}>{l}</span>
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{marginTop:18,color:'#2a2a48',fontSize:9,textTransform:'uppercase',
                  letterSpacing:'0.12em',marginBottom:10}}>Connected To</div>
                {CONNECTIONS
                  .filter(c => c.from===selPlatform.id || c.to===selPlatform.id)
                  .map((c,i) => {
                    const oid = c.from===selPlatform.id ? c.to : c.from;
                    const op  = PLATFORMS.find(p => p.id===oid);
                    return op ? (
                      <div key={i}
                        style={{display:'flex',alignItems:'center',gap:7,marginBottom:6,cursor:'pointer'}}
                        onClick={e => { e.stopPropagation(); setSelPlatform(op); setSelTool(null); }}
                      >
                        <div style={{width:6,height:6,borderRadius:'50%',background:op.color,flexShrink:0}}/>
                        <span style={{color:'#5a5a7a',fontSize:11}}>{op.name}</span>
                        <span style={{color:'#22223a',fontSize:9,marginLeft:'auto',maxWidth:110,
                          whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.label}</span>
                      </div>
                    ) : null;
                  })
                }
              </>
            ) : null}
          </div>
        )}

        {/* LEGEND */}
        <div style={{
          position:'absolute', bottom:16, left:16,
          background:'#08081a', border:'1px solid #11112a',
          borderRadius:8, padding:'9px 13px',
        }}>
          <div style={{color:'#3a3a5a',fontWeight:600,marginBottom:6,fontSize:9,
            textTransform:'uppercase',letterSpacing:'0.1em'}}>Tier</div>
          {[['Core','#4ade80'],['Active','#7dd3fc'],['Exp','#fb923c']].map(([l,c]) => (
            <div key={l} style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:c}}/>
              <span style={{color:'#3a3a5a',fontSize:10}}>{l}</span>
            </div>
          ))}
        </div>

        {/* ZOOM */}
        <div style={{
          position:'absolute', bottom:16, right: showPanel ? 308 : 16,
          display:'flex', flexDirection:'column', gap:4,
        }}>
          {[['＋', () => setXf(t=>({...t,s:Math.min(t.s*1.2,2.8)}))],
            ['－', () => setXf(t=>({...t,s:Math.max(t.s*0.8,0.18)}))],
            ['⟳',  () => setXf({tx:20, ty:30, s:0.64})]
          ].map(([lbl,fn]) => (
            <button key={lbl} onClick={fn} style={{
              width:30, height:30, borderRadius:6,
              background:'#08081a', border:'1px solid #11112a',
              color:'#3a3a5a', fontSize:13, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>{lbl}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
