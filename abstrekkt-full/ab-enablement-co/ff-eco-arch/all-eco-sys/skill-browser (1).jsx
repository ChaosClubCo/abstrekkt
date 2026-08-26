import { useState, useMemo } from "react";

const FF = {
  void: "#0A0A0F", deep: "#141328", indigo: "#322B75",
  primary: "#8B5CF6", primaryLight: "#C4B5FD", glow: "#A855F7",
  electric: "#06B6D4", electricLight: "#67E8F9", bright: "#E0E7FF",
  text: "#F8FAFC", muted: "#94A3B8",
  success: "#34D399", warning: "#FBBF24", danger: "#F87171", info: "#67E8F9",
  border: "rgba(196,181,253,0.12)", borderHover: "rgba(196,181,253,0.25)",
};

const CAT = {
  engineering: { label: "Engineering", color: FF.electric },
  design:      { label: "Design / UI",  color: FF.glow },
  content:     { label: "Content",      color: FF.warning },
  docs:        { label: "Docs",         color: FF.primaryLight },
  automation:  { label: "Automation",   color: FF.electricLight },
  support:     { label: "Support",      color: FF.danger },
  personal:    { label: "Personal",     color: FF.success },
  meta:        { label: "Meta / Skills",color: FF.muted },
};

const SRC = { user: FF.primary, public: FF.electric, examples: FF.warning };

const SKILLS = [
  // PUBLIC
  { name:"docx",source:"public",installed:true,category:"docs",label:"Docx",description:"Create, read, edit Word documents. TOCs, headings, page numbers, letterheads, tracked changes.",triggers:["word doc",".docx","report","memo","letter","template"]},
  { name:"file-reading",source:"public",installed:true,category:"docs",label:"File Reading",description:"Routes file reading by type — PDF, docx, xlsx, CSV, JSON, images, archives.",triggers:["uploaded file","read this file","file path","/mnt/user-data"]},
  { name:"frontend-design",source:"public",installed:true,category:"design",label:"Frontend Design",description:"Distinctive, production-grade frontend interfaces. Avoids generic AI aesthetics. Bold aesthetic direction.",triggers:["build UI","web component","landing page","dashboard","React component","HTML layout"]},
  { name:"pdf",source:"public",installed:true,category:"docs",label:"PDF",description:"Full PDF ops: read, extract, merge, split, rotate, watermark, create, fill forms, encrypt, OCR.",triggers:[".pdf","PDF","combine PDFs","split PDF","fill PDF form"]},
  { name:"pdf-reading",source:"public",installed:true,category:"docs",label:"PDF Reading",description:"Read and extract from PDFs — text, tables, images, form fields. Strategy selection by document type.",triggers:["read PDF","extract PDF","PDF text","scan PDF"]},
  { name:"product-self-knowledge",source:"public",installed:true,category:"meta",label:"Product Self Knowledge",description:"Verify Anthropic product facts before asserting — Claude Code, API, claude.ai plans, pricing, models.",triggers:["Claude Code","Anthropic API","claude.ai plan","pricing","SDK"]},
  { name:"pptx",source:"public",installed:true,category:"docs",label:"PPTX",description:"Create, read, edit PowerPoint presentations. Slides, layouts, themes, speaker notes.",triggers:["presentation","slides","deck",".pptx","pitch deck"]},
  { name:"xlsx",source:"public",installed:true,category:"docs",label:"XLSX",description:"Spreadsheet ops: create, read, edit .xlsx/.xlsm/.csv. Formulas, charts, formatting, data cleaning.",triggers:["spreadsheet",".xlsx","Excel","CSV","tabular data"]},
  // USER
  { name:"advanced-ux-patterns",source:"user",installed:true,category:"design",label:"Advanced UX Patterns",description:"WCAG 2.2 accessibility, interaction patterns, user research methods, usability principles.",triggers:["UX audit","accessibility","WCAG","usability","interaction design"]},
  { name:"advanced-visual-design",source:"user",installed:true,category:"design",label:"Advanced Visual Design",description:"Typography systems, color theory, grid layouts, visual hierarchy. Type scale, font pairing, HSL, 8-pt grid.",triggers:["type scale","font pairing","color palette","visual hierarchy","design foundations"]},
  { name:"ai-solution-architecture",source:"user",installed:true,category:"automation",label:"AI Solution Architecture",description:"Pre-sales AI/ML technical architectures for B2B enterprise. Reference architectures, integration patterns, infra sizing.",triggers:["AI architecture","solution design","technical scoping","pre-sales"]},
  { name:"anchor",source:"user",installed:true,category:"personal",label:"Anchor",description:"Calm anxiety companion for daily support between therapy sessions. Check-ins, grounding, breathing, journaling.",triggers:["anxious","bad day","overwhelmed","racing thoughts","grounding","rough morning"]},
  { name:"applying-sparc-methodology",source:"user",installed:true,category:"engineering",label:"SPARC Methodology",description:"Spec → Pseudocode → Architecture → Refinement → Completion. Structured thinking before coding.",triggers:["SPARC","spec this out","TDD","write tests first","pseudocode first","architecture before coding"]},
  { name:"code-auditor",source:"user",installed:true,category:"engineering",label:"Code Auditor",description:"Comprehensive codebase analysis: architecture, code quality, security, performance, testing, maintainability.",triggers:["audit code","technical debt","security issues","codebase health"]},
  { name:"code-transfer",source:"user",installed:true,category:"engineering",label:"Code Transfer",description:"Transfer code between files with line-based precision. Copy/move functions, extract blocks, insert at line numbers.",triggers:["copy code","move function","transfer code","extract block"]},
  { name:"create-agent-skills",source:"user",installed:true,category:"meta",label:"Create Agent Skills",description:"Expert guidance for creating, writing, and refining Claude Code Skills and SKILL.md files.",triggers:["write a skill","SKILL.md","create a skill","skill authoring"]},
  { name:"create-meta-prompts",source:"user",installed:true,category:"automation",label:"Create Meta Prompts",description:"Optimized prompts for Claude-to-Claude pipelines with research, planning, and execution stages.",triggers:["meta prompt","Claude pipeline","research → plan → implement"]},
  { name:"create-subagents",source:"user",installed:true,category:"automation",label:"Create Subagents",description:"Expert guidance for Claude Code subagents and the Task tool. Agent configs, multi-agent orchestration.",triggers:["subagent","Task tool","Claude Code agent","agent configuration"]},
  { name:"debug-like-expert",source:"user",installed:true,category:"engineering",label:"Debug Like Expert",description:"Deep analysis debugging for complex issues. Evidence gathering, hypothesis testing, root cause analysis.",triggers:["debug this","complex bug","root cause","standard troubleshooting failed"]},
  { name:"design-system-builder",source:"user",installed:true,category:"design",label:"Design System Builder",description:"Build cohesive design systems with tokens, component libraries, documentation, governance. Storybook, CVA.",triggers:["design system","design tokens","component library","Storybook","atomic design"]},
  { name:"developing-skills",source:"user",installed:true,category:"meta",label:"Developing Skills",description:"Create and manage Claude skills: YAML frontmatter, trigger density, gerund naming, progressive disclosure.",triggers:["create new skill","modify skill","skill not firing","trigger pattern","how do skills work"]},
  { name:"drafting-multi-format-content",source:"user",installed:true,category:"content",label:"Multi-Format Content",description:"Video/audio scripts, threaded long-form social (LinkedIn, X, IG carousels), and FlashFusion customer lifecycle comms.",triggers:["script video","LinkedIn thread","X thread","IG carousel","customer email"]},
  { name:"elite-ui-design",source:"user",installed:true,category:"design",label:"Elite UI Design",description:"End-to-end product design orchestrator. Experience thesis, design systems, interaction models. Anti-slop audit.",triggers:["design an app","UI that doesn't suck","anti-slop","experience thesis","design audit","redesign"]},
  { name:"enforcing-output-formats",source:"user",installed:true,category:"content",label:"Enforcing Output Formats",description:"Industry-standard formatting for songs, scripts, screenplays, emails, letters, legal docs, resumes, recipes.",triggers:["lyric sheet","script format","screenplay","business letter","industry standard format"]},
  { name:"engineering-staff-workflows",source:"user",installed:true,category:"engineering",label:"Engineering Staff Workflows",description:"Security-first, scope-gated Staff Engineer workflow. WSJF, AppSec threat modeling, full-stack to edge.",triggers:["multi-file build","architect this","production ready","system design","security audit"]},
  { name:"fixing-tests",source:"user",installed:true,category:"engineering",label:"Fixing Tests",description:"Run tests and systematically fix failures using smart error grouping.",triggers:["fix tests","failing tests","make tests pass"]},
  { name:"generating-intinc-documents",source:"user",installed:true,category:"docs",label:"Intinc Documents",description:"Generate .docx documents following INT brand standards and templates.",triggers:["INT document","Intinc doc","generate a doc","INT template","reference guide"]},
  { name:"generating-kb-articles",source:"user",installed:true,category:"docs",label:"KB Articles",description:"Generate .docx Knowledge Base articles following INT brand template. SOPs, runbooks, reference guides.",triggers:["KB article","knowledge base","SOP","runbook","troubleshooting guide"]},
  { name:"generating-msm-documents",source:"user",installed:true,category:"docs",label:"MSM Documents",description:"Generate .docx documents following MSM (Multimedia Sales & Marketing) brand standards.",triggers:["MSM document","MSM template","deployment guide","client documentation"]},
  { name:"generating-social-posts",source:"user",installed:true,category:"content",label:"Social Posts (Gen)",description:"Platform-optimized social posts in Kyle's voice. LinkedIn, X/Twitter, Threads, Blog, Audio Script.",triggers:["write a post","LinkedIn post","Twitter post","social content","hot take"]},
  { name:"implementing-review-feedback",source:"user",installed:true,category:"engineering",label:"Implement Review Feedback",description:"Process and implement code review feedback systematically from PR comments, reviewer notes.",triggers:["review feedback","PR comments","code review notes","implement suggestions"]},
  { name:"kb-screenshot-automator",source:"user",installed:true,category:"docs",label:"KB Screenshot Automator",description:"Automate screenshot capture for Scribe-formatted KB articles with Screenshot Placeholder markers.",triggers:["screenshot this guide","populate screenshots","fill in placeholders"]},
  { name:"managing-design-briefs",source:"user",installed:true,category:"design",label:"Design Briefs",description:"Design briefs, anti-slop gates, locked design tokens. INT and FlashFusion brand profiles.",triggers:["design brief","v0 prompt","anti-slop","design tokens","FlashFusion UI"]},
  { name:"orchestrating-ai-agents",source:"user",installed:true,category:"automation",label:"Orchestrating AI Agents",description:"Build AI agents, MCP servers, LangChain/CrewAI agents, multi-LLM workflows.",triggers:["MCP server","AI agent","LangChain","CrewAI","multi-agent","automation workflow"]},
  { name:"organizing-projects",source:"user",installed:true,category:"engineering",label:"Organizing Projects",description:"Analyze, reorganize, scaffold project repos. Structure audits, monorepo decisions, migration planning.",triggers:["organize repo","project structure","folder layout","naming conventions","monorepo"]},
  { name:"packaging-skills",source:"user",installed:true,category:"meta",label:"Packaging Skills",description:"Package Claude skills into production-ready zip files with full spec compliance and structure validation.",triggers:["zip this skill","package skill","validate skill","distribute skill"]},
  { name:"producing-ai-newsletter",source:"user",installed:true,category:"content",label:"AI Newsletter",description:"Multi-config AI newsletter production: INT and FlashFusion profiles. Research → draft → edit → format.",triggers:["newsletter","weekly briefing","The Prompt","AI brief","draft edition"]},
  { name:"producing-graphics",source:"user",installed:true,category:"design",label:"Producing Graphics",description:"Export-ready graphics for web, print, and social. Proper formats, color spaces, resolution, optimization.",triggers:["export graphic","web asset","marketing material","optimize image"]},
  { name:"professional-web-design",source:"user",installed:true,category:"design",label:"Professional Web Design",description:"Responsive design, performance optimization, modern CSS. Core Web Vitals, WCAG, pre-launch audit.",triggers:["responsive layout","mobile-first","Core Web Vitals","CSS Grid","optimize my site"]},
  { name:"project-bootstrapper",source:"user",installed:true,category:"engineering",label:"Project Bootstrapper",description:"Set up new projects or improve existing ones with best practices, tooling, documentation, workflow automation.",triggers:["new project","project setup","scaffold project","dev workflows"]},
  { name:"prototyping-testing",source:"user",installed:true,category:"design",label:"Prototyping & Testing",description:"Prototyping strategy selection, usability tests, heuristic evaluation, A/B experiments, tree testing.",triggers:["prototype","usability test","A/B experiment","heuristic evaluation","user research"]},
  { name:"refactoring-code",source:"user",installed:true,category:"engineering",label:"Refactoring Code",description:"Bulk code refactoring: rename variables/functions across files, replace patterns, update API calls.",triggers:["rename variable","refactor","replace deprecated","update method calls","bulk changes"]},
  { name:"reminding-skill-usage",source:"user",installed:true,category:"meta",label:"Reminding Skill Usage",description:"Analyze your task and suggest which skills from your library would be most helpful.",triggers:["which skill","what skill","suggest skills","starting a new task"]},
  { name:"roi-calculator-building",source:"user",installed:true,category:"automation",label:"ROI Calculator Building",description:"Build AI implementation ROI models for B2B enterprise. Cost savings, revenue impact, payback period, TCO.",triggers:["ROI calculator","business case","cost-benefit","AI investment","value engineering"]},
  { name:"running-drive-automation",source:"user",installed:true,category:"automation",label:"Drive Automation",description:"Google Drive classification/routing pipeline with Supabase audit trail. Agent council, n8n, CrewAI.",triggers:["organize my drive","run the council","drive router","agent council","chain 1","chain 2"]},
  { name:"social-post-generator",source:"user",installed:true,category:"content",label:"Social Post Generator",description:"Platform-optimized social posts in Kyle's voice — LinkedIn, X/Twitter, Threads, Blog, Audio Script.",triggers:["write a post","social post","LinkedIn","X post","audio script"]},
  { name:"task-decomposition",source:"user",installed:true,category:"engineering",label:"Task Decomposition",description:"Decompose complex requests into parallel workstreams with dependency tracking and integration planning.",triggers:["break this down","decompose","parallel plan","workstreams","multi-deliverable"]},
  { name:"tracking-personal-challenges",source:"user",installed:true,category:"personal",label:"Personal Challenges",description:"Track personal challenges: learning, fitness, building, creative, habits. Check-ins, progress, pattern analysis.",triggers:["streak","accountability","habit tracking","personal challenge","check in"]},
  { name:"troubleshooting-skills",source:"user",installed:true,category:"meta",label:"Troubleshooting Skills",description:"Diagnose and fix Claude skill pack issues: corrupted zips, path errors, upload failures, YAML errors.",triggers:["skill won't upload","skill error","skill not triggering","SKILL.md not found"]},
  { name:"ui-component-library",source:"user",installed:true,category:"design",label:"UI Component Library",description:"Reusable UI component patterns beyond shadcn: compound components, virtualized lists, drag-and-drop, command palette.",triggers:["custom component","compound component","command palette","autocomplete","drag and drop"]},
  { name:"unifying-service-desk",source:"user",installed:true,category:"support",label:"Unified Service Desk",description:"Multi-tier IT support (L0–L4) with auto escalation. 12 issue categories, incident triage, root cause analysis.",triggers:["IT support","incident","ticket","outage","troubleshoot","locked out","broken"]},
  { name:"workflow-automation",source:"user",installed:true,category:"automation",label:"Workflow Automation",description:"Build automated workflows with n8n, Zapier, Make. Connect SaaS tools, automate business processes.",triggers:["n8n","Zapier","Make","webhook","automate this","connect these apps"]},
  { name:"writing-shell-scripts",source:"user",installed:true,category:"engineering",label:"Shell Scripts",description:"Production-ready Bash (.sh) and PowerShell (.ps1) with adversarial audit gate, MSP-grade error handling, idempotency.",triggers:["shell script","bash script","PowerShell",".sh file",".ps1","deploy script"]},
  // EXAMPLES (installed)
  { name:"algorithmic-art",source:"examples",installed:true,category:"design",label:"Algorithmic Art",description:"Create algorithmic art using p5.js with seeded randomness, flow fields, particle systems.",triggers:["generative art","algorithmic art","flow field","particle system","p5.js"]},
  { name:"brand-guidelines",source:"examples",installed:true,category:"design",label:"Brand Guidelines",description:"Apply Anthropic's official brand colors and typography to any artifact.",triggers:["Anthropic brand","brand colors","brand guidelines","company design standards"]},
  { name:"canvas-design",source:"examples",installed:true,category:"design",label:"Canvas Design",description:"Create visual art in .png and .pdf. Posters, illustrations, static designs using design philosophy.",triggers:["create a poster","piece of art","visual design","static design","canvas"]},
  { name:"doc-coauthoring",source:"examples",installed:true,category:"docs",label:"Doc Coauthoring",description:"Structured workflow for co-authoring documentation. Proposals, specs, decision docs. Context transfer + iteration.",triggers:["write documentation","create proposal","technical spec","decision doc","co-author"]},
  { name:"internal-comms",source:"examples",installed:true,category:"content",label:"Internal Comms",description:"Internal communications in company formats: status reports, leadership updates, company newsletters, FAQs.",triggers:["internal comms","status report","leadership update","company newsletter","incident report"]},
  { name:"mcp-builder",source:"examples",installed:true,category:"automation",label:"MCP Builder",description:"Build high-quality MCP servers in Python (FastMCP) or Node/TypeScript (MCP SDK) to integrate external APIs.",triggers:["build MCP server","FastMCP","MCP SDK","integrate API via MCP"]},
  { name:"skill-creator",source:"examples",installed:true,category:"meta",label:"Skill Creator",description:"Create, modify, improve, run evals, and benchmark skills. Optimizes SKILL.md descriptions for triggering accuracy.",triggers:["create skill","edit skill","skill evals","benchmark skill","optimize skill"]},
  { name:"slack-gif-creator",source:"examples",installed:true,category:"design",label:"Slack GIF Creator",description:"Create animated GIFs optimized for Slack. Constraints, validation, animation concepts.",triggers:["Slack GIF","animated GIF","GIF for Slack"]},
  { name:"theme-factory",source:"examples",installed:true,category:"design",label:"Theme Factory",description:"Style artifacts with themes. 10 pre-set themes (colors/fonts) for slides, docs, reports, HTML pages.",triggers:["apply theme","style this artifact","themed slides","theme-factory"]},
  { name:"web-artifacts-builder",source:"examples",installed:true,category:"design",label:"Web Artifacts Builder",description:"Elaborate multi-component HTML artifacts using React, Tailwind CSS, shadcn/ui. Complex state, routing.",triggers:["complex artifact","multi-component","shadcn/ui","web artifact builder"]},
  // EXAMPLES (not installed)
  { name:"benepass-reimbursement",source:"examples",installed:false,category:"personal",label:"Benepass Reimbursement",description:"Submit expense reimbursements through Benepass. Login, benefit selection, form filling, receipt upload. Requires computer-use.",triggers:["Benepass","expense reimbursement","benefits platform"]},
  { name:"call-to-book",source:"examples",installed:false,category:"personal",label:"Call to Book",description:"Make a phone call to book an appointment or reservation. Checks calendar, gets consent, discloses AI identity.",triggers:["book by phone","call to book","phone appointment","make reservation call"]},
  { name:"cancel-unsubscribe",source:"examples",installed:false,category:"personal",label:"Cancel / Unsubscribe",description:"Cancel subscriptions or unsubscribe from services. Works from description, charge line, URL, or screenshot. Audits full statements.",triggers:["cancel subscription","unsubscribe","cancel this service","recurring charges"]},
  { name:"event-planning",source:"examples",installed:false,category:"personal",label:"Event Planning",description:"Plan events from birthday dinner to wedding. Venue research, guest lists, timelines, vendors, budgets.",triggers:["plan an event","birthday dinner","wedding planning","event timeline","venue research"]},
  { name:"file-expenses",source:"examples",installed:false,category:"personal",label:"File Expenses",description:"Submit expenses on any platform — Benepass, Brex, Concur, Expensify. Finds receipts, checks duplicates.",triggers:["file expense","expense report","submit reimbursement","Brex","Concur","Expensify"]},
  { name:"file-form",source:"examples",installed:false,category:"personal",label:"File Form",description:"Handle bureaucratic tasks — jury duty, parking tickets, passport renewals, DMV forms, permit applications.",triggers:["jury duty","parking ticket","passport renewal","DMV form","permit application"]},
  { name:"financial-calculator",source:"examples",installed:false,category:"personal",label:"Financial Calculator",description:"Financial calculations and scenario comparisons — tax estimates, loan comparisons, retirement projections, rent vs. buy.",triggers:["tax estimate","loan comparison","retirement projection","rent vs buy","financial calc"]},
  { name:"grocery-shopping",source:"examples",installed:false,category:"personal",label:"Grocery Shopping",description:"Order groceries for delivery. Store selection, occasion-based list building, budget tracking, cart assembly.",triggers:["order groceries","grocery delivery","grocery list"]},
  { name:"hire-help",source:"examples",installed:false,category:"personal",label:"Hire Help",description:"Find and book service providers — cleaning, handyman, moving, assembly, yard work. TaskRabbit, Handy, Thumbtack.",triggers:["hire someone","find cleaner","handyman","TaskRabbit","yard work"]},
  { name:"meal-delivery",source:"examples",installed:false,category:"personal",label:"Meal Delivery",description:"Order food timed to arrive at a specific time. Works backward from target arrival, suggests restaurants.",triggers:["order food","meal delivery","food by 7pm","order dinner"]},
  { name:"prescription-refill",source:"examples",installed:false,category:"personal",label:"Prescription Refill",description:"Refill a prescription. Works from medication name, Rx number, bottle photo, or 'I'm running low.' Handles online or phone.",triggers:["refill prescription","Rx refill","running low on meds","pharmacy refill"]},
  { name:"return-refund",source:"examples",installed:false,category:"personal",label:"Return / Refund",description:"Return an item or request a refund from any retailer. Return policy, process navigation, shipping labels, phone calls.",triggers:["return item","get refund","return policy","refund request"]},
];

const Pill = ({ children, color, small }) => (
  <span style={{
    display:"inline-block", padding: small ? "2px 8px" : "3px 10px",
    borderRadius:"999px", fontSize: small ? "10px" : "11px", fontWeight:"500",
    background:`${color}22`, color, border:`1px solid ${color}44`,
    letterSpacing:"0.02em", whiteSpace:"nowrap"
  }}>{children}</span>
);

const Chip = ({ label }) => (
  <span style={{
    display:"inline-block", padding:"2px 7px", borderRadius:"4px",
    fontSize:"10px", fontWeight:"500", background:"rgba(148,163,184,0.12)",
    color:FF.muted, border:`1px solid rgba(148,163,184,0.15)`, whiteSpace:"nowrap"
  }}>{label}</span>
);

const FilterBtn = ({ active, onClick, children, color }) => (
  <button onClick={onClick} style={{
    padding:"6px 14px", borderRadius:"6px", fontSize:"12px", fontWeight:"500",
    cursor:"pointer", transition:"all 0.15s", border:"none", outline:"none",
    background: active ? (color || FF.primary) : "transparent",
    color: active ? "#fff" : FF.muted,
    boxShadow: active ? `0 0 12px ${(color||FF.primary)}44` : "none",
  }}>{children}</button>
);

export default function SkillBrowser() {
  const [search, setSearch] = useState("");
  const [srcFilter, setSrcFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    return SKILLS.filter(s => {
      if (srcFilter !== "all" && s.source !== srcFilter) return false;
      if (statusFilter === "active" && !s.installed) return false;
      if (statusFilter === "available" && s.installed) return false;
      if (catFilter !== "all" && s.category !== catFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return s.label.toLowerCase().includes(q) ||
               s.description.toLowerCase().includes(q) ||
               s.triggers.some(t => t.toLowerCase().includes(q));
      }
      return true;
    });
  }, [search, srcFilter, statusFilter, catFilter]);

  const stats = {
    total: SKILLS.length,
    active: SKILLS.filter(s => s.installed).length,
    available: SKILLS.filter(s => !s.installed).length,
    user: SKILLS.filter(s => s.source === "user").length,
    pub: SKILLS.filter(s => s.source === "public").length,
    ex: SKILLS.filter(s => s.source === "examples").length,
  };

  const installSkill = (skill) => {
    sendPrompt(`Install skill: /mnt/skills/${skill.source}/${skill.name}.skill`);
  };

  const viewSkill = (skill) => {
    setExpanded(expanded === skill.name ? null : skill.name);
  };

  return (
    <div style={{ background: FF.void, minHeight: "100vh", color: FF.text, fontFamily: "'Poppins', 'Inter', sans-serif", padding: "20px 24px 40px" }}>
      <h2 className="sr-only">Skill Browser — browse and install Claude skills</h2>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"8px" }}>
        <div>
          <h1 style={{ fontSize:"22px", fontWeight:"600", margin:0, color:FF.text, letterSpacing:"-0.03em" }}>
            Skill Browser
          </h1>
          <p style={{ color:FF.muted, fontSize:"13px", margin:"3px 0 0" }}>
            {stats.active} active · {stats.available} available to install · {stats.total} total
          </p>
        </div>
        <div style={{ display:"flex", gap:"12px" }}>
          {[["user", SRC.user, stats.user + " User"], ["public", SRC.public, stats.pub + " Public"], ["examples", SRC.ex, stats.ex + " Examples"]].map(([src, col, label]) => (
            <span key={src} style={{ fontSize:"12px", color:col, fontWeight:"500" }}>{label}</span>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ position:"relative", marginBottom:"14px" }}>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, description, or trigger phrase…"
          style={{
            width:"100%", padding:"10px 16px", background:FF.deep,
            border:`1px solid ${FF.border}`, borderRadius:"8px",
            color:FF.text, fontSize:"13px", outline:"none", boxSizing:"border-box",
          }}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{
            position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)",
            background:"none", border:"none", color:FF.muted, cursor:"pointer", fontSize:"16px",
          }}>×</button>
        )}
      </div>

      {/* Filter row */}
      <div style={{ display:"flex", gap:"4px", marginBottom:"8px", flexWrap:"wrap" }}>
        <span style={{ color:FF.muted, fontSize:"11px", alignSelf:"center", marginRight:"4px" }}>SOURCE</span>
        {[["all","All"], ["user","User"], ["public","Public"], ["examples","Examples"]].map(([val, label]) => (
          <FilterBtn key={val} active={srcFilter===val} onClick={()=>setSrcFilter(val)} color={val==="user"?SRC.user:val==="public"?SRC.public:val==="examples"?SRC.ex:FF.primary}>{label}</FilterBtn>
        ))}
      </div>
      <div style={{ display:"flex", gap:"4px", marginBottom:"8px", flexWrap:"wrap" }}>
        <span style={{ color:FF.muted, fontSize:"11px", alignSelf:"center", marginRight:"4px" }}>STATUS</span>
        {[["all","All"], ["active","Active"], ["available","Available"]].map(([val, label]) => (
          <FilterBtn key={val} active={statusFilter===val} onClick={()=>setStatusFilter(val)}>{label}</FilterBtn>
        ))}
      </div>
      <div style={{ display:"flex", gap:"4px", marginBottom:"18px", flexWrap:"wrap" }}>
        <span style={{ color:FF.muted, fontSize:"11px", alignSelf:"center", marginRight:"4px" }}>CATEGORY</span>
        {[["all","All"], ...Object.entries(CAT).map(([k,v])=>[k,v.label])].map(([val, label]) => (
          <FilterBtn key={val} active={catFilter===val} onClick={()=>setCatFilter(val)} color={CAT[val]?.color}>{label}</FilterBtn>
        ))}
      </div>

      {/* Results count */}
      <p style={{ color:FF.muted, fontSize:"12px", margin:"0 0 12px" }}>
        Showing {filtered.length} of {SKILLS.length} skills
      </p>

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:"10px" }}>
        {filtered.map(skill => {
          const isExpanded = expanded === skill.name;
          const catColor = CAT[skill.category]?.color || FF.muted;
          const srcColor = SRC[skill.source];
          return (
            <div key={skill.name} onClick={() => viewSkill(skill)} style={{
              background: FF.deep,
              border: `1px solid ${isExpanded ? FF.borderHover : FF.border}`,
              borderRadius:"10px", padding:"14px",
              cursor:"pointer", transition:"border-color 0.15s",
              position:"relative",
            }}>
              {/* Card header */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"8px" }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ margin:0, fontSize:"13px", fontWeight:"600", color:FF.text, lineHeight:1.3 }}>{skill.label}</p>
                  <p style={{ margin:"2px 0 0", fontSize:"10px", fontFamily:"monospace", color:FF.muted }}>{skill.name}</p>
                </div>
                <div style={{ display:"flex", gap:"4px", flexShrink:0, marginLeft:"8px", flexDirection:"column", alignItems:"flex-end" }}>
                  <Pill color={srcColor} small>{skill.source}</Pill>
                  {skill.installed
                    ? <Pill color={FF.success} small>active</Pill>
                    : <Pill color={FF.warning} small>available</Pill>
                  }
                </div>
              </div>

              {/* Category */}
              <div style={{ marginBottom:"8px" }}>
                <Pill color={catColor} small>{CAT[skill.category]?.label || skill.category}</Pill>
              </div>

              {/* Description */}
              <p style={{ margin:"0 0 10px", fontSize:"12px", color:FF.muted, lineHeight:1.6, display:"-webkit-box", WebkitLineClamp: isExpanded ? "none" : 2, WebkitBoxOrient:"vertical", overflow: isExpanded ? "visible" : "hidden" }}>
                {skill.description}
              </p>

              {/* Triggers (expanded only) */}
              {isExpanded && (
                <div style={{ marginBottom:"10px" }}>
                  <p style={{ margin:"0 0 6px", fontSize:"10px", color:FF.muted, textTransform:"uppercase", letterSpacing:"0.08em" }}>Trigger phrases</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"4px" }}>
                    {skill.triggers.map(t => <Chip key={t} label={t} />)}
                  </div>
                </div>
              )}

              {/* Path + action */}
              {isExpanded && (
                <div style={{ marginTop:"10px", paddingTop:"10px", borderTop:`1px solid ${FF.border}` }}>
                  <p style={{ margin:"0 0 6px", fontSize:"10px", color:FF.muted, fontFamily:"monospace" }}>
                    /mnt/skills/{skill.source}/{skill.name}.skill
                  </p>
                  {!skill.installed ? (
                    <button onClick={e => { e.stopPropagation(); installSkill(skill); }} style={{
                      padding:"7px 16px", borderRadius:"6px", fontSize:"12px", fontWeight:"600",
                      cursor:"pointer", border:`1px solid ${FF.primary}`, background:`${FF.primary}22`,
                      color:FF.primary, transition:"all 0.15s", width:"100%",
                    }}>
                      Download .skill file ↗
                    </button>
                  ) : (
                    <p style={{ margin:0, fontSize:"11px", color:FF.success }}>✓ Active in this project</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:"center", padding:"60px 20px", color:FF.muted }}>
          <p style={{ fontSize:"32px", margin:"0 0 12px" }}>∅</p>
          <p style={{ fontSize:"14px" }}>No skills match your filters.</p>
        </div>
      )}
    </div>
  );
}
