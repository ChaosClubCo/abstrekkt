import { useState } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const SKILLS=[
  {id:"action-hub",name:"Action Hub",cat:"Productivity",desc:"Personal command center — aggregates tasks, projects, and priorities across tools.",install:"/plugin install action-hub",tags:["tasks","workflow"]},
  {id:"ai-marketing",name:"AI Marketing System",cat:"Marketing",desc:"End-to-end marketing campaign builder: strategy → content → distribution.",install:"/plugin install ai-marketing-system",tags:["marketing","content"]},
  {id:"agent-factory",name:"Agent Factory System",cat:"Engineering",desc:"Build, test, and deploy custom Claude agents with structured schemas.",install:"/plugin install agent-factory-system",tags:["agents","dev"]},
  {id:"cowork-organizer",name:"Cowork Organizer",cat:"Productivity",desc:"Organize Cowork sessions, projects, and context across all your Claude work.",install:"/plugin install cowork-organizer",tags:["cowork","organization"]},
  {id:"cowork-plugin-gen",name:"Cowork Plugin Generator",cat:"Engineering",desc:"Generate Cowork plugin SKILL.md files from a description.",install:"/plugin install cowork-plugin-generator",tags:["cowork","skills","dev"]},
  {id:"capturing-workflows",name:"Capturing Workflows as Skills",cat:"Engineering",desc:"Convert documented workflows into reusable SKILL.md plugin files.",install:"/plugin install capturing-workflows-as-skills",tags:["skills","automation"]},
  {id:"frontend-design",name:"Frontend Design",cat:"Design",desc:"Production-grade UI generation with Reading Room at Midnight design system.",install:"/plugin install frontend-design",tags:["ui","design","code"]},
  {id:"adversarial-review",name:"Adversarial Review",cat:"Quality",desc:"Forces outputs through CLAIMS/COUNTEREXAMPLES/CONTRADICTIONS audit gate.",install:"/plugin install applying-adversarial-review",tags:["quality","audit"]},
  {id:"ui-components",name:"UI Component Library",cat:"Design",desc:"Advanced React components: compound, headless, virtualized lists, command palette.",install:"/plugin install ui-component-library",tags:["react","ui","components"]},
  {id:"social-posts",name:"Generating Social Posts",cat:"Marketing",desc:"Platform-optimized posts in Kyle Rosebrook voice. LinkedIn, X, Threads, Blog.",install:"/plugin install generating-social-posts",tags:["social","content","marketing"]},
  {id:"shell-scripts",name:"Writing Shell Scripts",cat:"Engineering",desc:"Production-ready Bash/.ps1 with MSP-grade error handling, logging, idempotency.",install:"/plugin install writing-shell-scripts",tags:["bash","powershell","automation"]},
  {id:"sparc",name:"SPARC Methodology",cat:"Engineering",desc:"Spec → Pseudocode → Architecture → Refinement → Completion. TDD-first.",install:"/plugin install applying-sparc-methodology",tags:["dev","architecture","tdd"]},
  {id:"drive-automation",name:"Drive Automation",cat:"Operations",desc:"Multi-agent Google Drive classification and routing pipeline with Supabase audit trail.",install:"/plugin install running-drive-automation",tags:["drive","automation","agents"]},
  {id:"kb-articles",name:"Generating KB Articles",cat:"Operations",desc:"INT-branded .docx Knowledge Base articles from a prompt.",install:"/plugin install generating-kb-articles",tags:["documentation","kb","msm"]},
  {id:"staff-workflows",name:"Staff Engineer Workflows",cat:"Engineering",desc:"Security-first WSJF-prioritized Staff Engineer workflow for production systems.",install:"/plugin install engineering-staff-workflows",tags:["engineering","architecture","security"]},
  {id:"orchestrating-agents",name:"Orchestrating AI Agents",cat:"Engineering",desc:"Multi-LLM workflows, MCP servers, LangChain/CrewAI, tool integrations.",install:"/plugin install orchestrating-ai-agents",tags:["agents","mcp","crewai"]},
  {id:"ai-newsletter",name:"AI Newsletter",cat:"Marketing",desc:"Multi-config newsletter production system: INT and FlashFusion brand profiles.",install:"/plugin install producing-ai-newsletter",tags:["newsletter","content","flashfusion"]},
  {id:"roi-calculator",name:"ROI Calculator Building",cat:"Sales",desc:"AI implementation ROI models for B2B enterprise sales.",install:"/plugin install roi-calculator-building",tags:["roi","sales","b2b"]},
  {id:"ai-solution-arch",name:"AI Solution Architecture",cat:"Engineering",desc:"Pre-sales technical architectures for AI/ML solutions targeting B2B enterprise.",install:"/plugin install ai-solution-architecture",tags:["architecture","pre-sales","b2b"]},
  {id:"workflow-automation",name:"Workflow Automation",cat:"Operations",desc:"n8n, Zapier, Make workflows. Connect SaaS tools, automate business processes.",install:"/plugin install workflow-automation",tags:["n8n","zapier","make","automation"]},
  {id:"task-decomp",name:"Task Decomposition",cat:"Productivity",desc:"Breaks complex requests into parallel workstreams with dependency tracking.",install:"/plugin install task-decomposition",tags:["planning","workflow"]},
  {id:"service-desk",name:"Unifying Service Desk",cat:"Operations",desc:"Multi-tier IT support (L0-L4) with auto escalation routing across 12 issue categories.",install:"/plugin install unifying-service-desk",tags:["IT","support","helpdesk"]},
  {id:"anchor",name:"Anchor",cat:"Wellbeing",desc:"Calm, adaptive anxiety companion for daily support between therapy sessions.",install:"/plugin install anchor",tags:["mental-health","wellbeing"]},
  {id:"mcp-builder",name:"MCP Builder",cat:"Engineering",desc:"Build production-quality MCP servers in Python (FastMCP) or Node/TypeScript.",install:"/plugin install mcp-builder",tags:["mcp","dev","integration"]},
  {id:"code-auditor",name:"Code Auditor",cat:"Engineering",desc:"Comprehensive codebase analysis: architecture, security, performance, maintainability.",install:"/plugin install code-auditor",tags:["code","security","quality"]},
  {id:"context7",name:"Context7 Docs",cat:"Engineering",desc:"Fetch live library documentation for any npm/pip package — always current.",install:"Connected via MCP",tags:["docs","reference","dev"]},
  {id:"debug-expert",name:"Debug Like Expert",cat:"Engineering",desc:"Deep analysis debugging with evidence gathering, hypothesis testing, root cause analysis.",install:"/plugin install debug-like-expert",tags:["debugging","analysis"]},
  {id:"canvas-design",name:"Canvas Design",cat:"Design",desc:"Generate export-ready posters, art, and static visuals as PNG/PDF.",install:"/plugin install canvas-design",tags:["design","graphics","print"]},
  {id:"lynx",name:"Lyra",cat:"Creative",desc:"AI creative assistant for music, lyrics, and audio projects.",install:"/plugin install lyra",tags:["music","creative","lyrics"]},
  {id:"n8n-builder",name:"n8n Workflow Builder",cat:"Operations",desc:"Design and build n8n workflow automation from natural language descriptions.",install:"/plugin install n8n-workflow-builder",tags:["n8n","automation"]},
];
const CATS=["All",...new Set(SKILLS.map(s=>s.cat))];
export default function SkillsBrowser(){
  const [q,setQ]=useState("");const [cat,setCat]=useState("All");const [copied,setCopied]=useState("");
  const res=SKILLS.filter(s=>(cat==="All"||s.cat===cat)&&(!q||s.name.toLowerCase().includes(q.toLowerCase())||s.desc.toLowerCase().includes(q.toLowerCase())||s.tags.some(t=>t.includes(q.toLowerCase()))));
  const copy=(s,cmd)=>{navigator.clipboard.writeText(cmd).catch(()=>{});setCopied(s);setTimeout(()=>setCopied(""),1500);};
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0c0c0b}::-webkit-scrollbar-thumb{background:#303030;border-radius:2px}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>Skills Browser</div>
      <div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ Claude Code plugin library · {SKILLS.length} skills · /plugin install</div>
    </div>
    <div style={{display:"flex",borderBottom:`1px solid ${T.b}`,padding:"8px 18px",gap:8,flexWrap:"wrap",alignItems:"center"}}>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search skills, tags, categories…" style={{padding:"5px 9px",borderRadius:2,border:`1px solid ${T.h}`,fontSize:12,...mn,background:T.sf,color:T.t,outline:"none",width:240}} />
      <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
        {CATS.map(c=><button key={c} onClick={()=>setCat(c)} style={{background:"transparent",border:`1px solid ${cat===c?T.a:T.b}`,borderRadius:2,color:cat===c?T.a:T.t2,...mn,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>{c}</button>)}
      </div>
      <span style={{...mn,fontSize:9,color:T.t3,marginLeft:"auto"}}>{res.length} skills</span>
    </div>
    <div style={{padding:"12px 18px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:7}}>
      {res.map(s=><div key={s.id} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"10px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
          <div><div style={{fontWeight:500,fontSize:12,color:T.t}}>{s.name}</div><div style={{...mn,fontSize:9,color:T.a,marginTop:1}}>{s.cat}</div></div>
          <button onClick={()=>copy(s.id,s.install)} style={{background:"transparent",border:`1px solid ${copied===s.id?T.g:T.h}`,borderRadius:2,color:copied===s.id?T.g:T.t2,...mn,fontSize:9,padding:"3px 7px",cursor:"pointer",flexShrink:0}}>{copied===s.id?"✓ Copied":"Copy"}</button>
        </div>
        <div style={{fontSize:11,color:T.t2,lineHeight:1.5,marginBottom:6}}>{s.desc}</div>
        <div style={{background:T.sf,borderRadius:2,padding:"4px 7px",...mn,fontSize:9,color:T.m,marginBottom:6}}>{s.install}</div>
        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{s.tags.map(tag=><span key={tag} style={{background:T.tg,border:`1px solid ${T.h}`,borderRadius:2,...mn,fontSize:8,padding:"1px 4px",color:T.t3}}>#{tag}</span>)}</div>
      </div>)}
      {!res.length&&<div style={{gridColumn:"1/-1",textAlign:"center",color:T.t2,padding:24,...mn,fontSize:11}}>No skills match "{q}"</div>}
    </div>
  </div></>;
}
