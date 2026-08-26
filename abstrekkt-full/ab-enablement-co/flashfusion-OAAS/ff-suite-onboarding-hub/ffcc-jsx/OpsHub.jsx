// ═══════════════════════════════════════════════════════════════════════
// OPS HUB v1.0 — Kyle Rosebrook
// Today | Kanban | Portfolio | Memoir
// localStorage persistence + manual export/import
// April 7, 2026
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Storage helpers ────────────────────────────────────────────────────────
const SK = {
  cards:"ops_cards_v1", lanes:"ops_lanes_v1", members:"ops_members_v1",
  sprints:"ops_sprints_v1", projects:"ops_projects_v1", memoir:"ops_memoir_v1",
};
const ld = (key, fb) => { try { const s=localStorage.getItem(key); return s?JSON.parse(s):fb; } catch { return fb; } };
const sv = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

// ─── Kanban constants ────────────────────────────────────────────────────────
const PC={1:"#3fb950",2:"#d29922",3:"#f0883e",4:"#da3633",5:"#8b5cf6"};
const PL={1:"Low",2:"Med",3:"High",4:"Crit",5:"Urgent"};
const LC={
  bug:"#da3633",feature:"#388bfd","tech-debt":"#d29922",migration:"#f0883e",
  urgent:"#8b5cf6",security:"#ec4899",automation:"#14b8a6",client:"#10b981",
  internal:"#6366f1",research:"#84cc16",memoir:"#a855f7",writing:"#e879f9",
  legal:"#f59e0b",launch:"#22d3ee",
};
const LANES=[
  {id:"backlog",title:"Backlog",wipLimit:0,color:"#484f58"},
  {id:"todo",title:"To Do",wipLimit:5,color:"#388bfd"},
  {id:"inprogress",title:"In Progress",wipLimit:3,color:"#d29922"},
  {id:"review",title:"Review",wipLimit:3,color:"#f0883e"},
  {id:"blocked",title:"Blocked",wipLimit:0,color:"#da3633"},
  {id:"done",title:"Done",wipLimit:0,color:"#3fb950"},
];
const PLATFORMS=["Vercel","Firebase","Base44","GitHub","Replit","Supabase","Lovable","Cloudflare","WordPress","Other"];
const STATUSES=["Active","Planning","Blocked","Archived","Sunset"];

// ─── Templates ───────────────────────────────────────────────────────────────
const TEMPLATES=[
  {id:"bug",name:"Bug",icon:"🐛",defaults:{priority:4,labels:["bug"],estimate:"2h",description:"**Steps:**\n1. \n\n**Expected:**\n**Actual:**"}},
  {id:"feature",name:"Feature",icon:"✨",defaults:{priority:2,labels:["feature"],estimate:"1d",description:"**User Story:**\nAs a [user], I want [feature] so that [benefit].\n\n**Acceptance Criteria:**\n- [ ] "}},
  {id:"techdebt",name:"Tech Debt",icon:"⚙️",defaults:{priority:2,labels:["tech-debt"],estimate:"4h",description:"**Problem:**\n**Solution:**\n**Impact if ignored:**"}},
  {id:"migration",name:"Migration",icon:"🚀",defaults:{priority:3,labels:["migration"],estimate:"2d",description:"**From:**\n**To:**\n**Steps:**\n1. Backup\n2. \n3. Validate\n\n**Rollback:**"}},
  {id:"security",name:"Security",icon:"🔒",defaults:{priority:4,labels:["security"],estimate:"1d",description:"**Scope:**\n- [ ] Input validation\n- [ ] Auth checks\n- [ ] RLS policies\n- [ ] Secrets scan"}},
  {id:"research",name:"Research",icon:"🔬",defaults:{priority:2,labels:["research"],estimate:"4h",description:"**Question:**\n**Timebox:**\n**Output:** Decision doc / PoC"}},
  {id:"memoir",name:"Memoir",icon:"📖",defaults:{priority:2,labels:["memoir","writing"],estimate:"3h",description:"**Session type:** Excavation / Drafting / Revision\n**Target arc:**\n**Raw material needed:**\n\n⚠ Protected areas: TBI specifics, addiction details — Kyle's call only"}},
  {id:"launch",name:"Launch Task",icon:"🎯",defaults:{priority:4,labels:["launch","urgent"],estimate:"1h",description:"**What must ship:**\n**Manual steps:**\n**Validation:**"}},
  {id:"legal",name:"Legal",icon:"⚖️",defaults:{priority:5,labels:["legal","security"],estimate:"1d",description:"**Scope:**\n**Risk area:**\n**Required before:** [what can't ship without this]"}},
  {id:"blank",name:"Blank",icon:"📝",defaults:{priority:2,labels:[],estimate:"",description:""}},
];

const DEF_MEMBERS=[
  {id:"kyle",name:"Kyle",team:"Platform",avatar:"K"},
  {id:"team",name:"Team",team:"Eng",avatar:"T"},
];

// ─── Default Cards (Sprint 10 active, Apr 7 2026) ────────────────────────────
const DEF_CARDS=[
  // ── IN PROGRESS ──────────────────────────────────────────────────
  {id:"c1",laneId:"backlog",title:"FlashFusion.co: Find first commercial customer",description:"flashfusion.co → Base44 'Fusion AI' app (67-entity schema). FlashFusion-Unified (GitHub/Vite/Vercel) ~60-70% complete. Anthropic Plan B drafted (model-agnostic, Claude-preferred).\n\nARCHIVED CONTEXT: Sole Revival was the original first-customer target — currently on semi-permanent pause. Do not re-engage. CSTMPRNT was simultaneous pipeline.\n\nNext: identify new first customer before resuming Vite/Vercel reconnect.",priority:2,labels:["migration","client","research"],dueDate:null,estimate:"tbd",assignee:"kyle",subtasks:[{id:"s1",text:"Confirm Base44 schema exported",done:true},{id:"s2",text:"Identify new first customer target",done:false},{id:"s3",text:"Reconnect Vite/Vercel FlashFusion-Unified",done:false}],healthScore:45,repo:"Krosebrook/FlashFusion",timeLog:[{date:"2026-03-20",duration:90,note:"Discovery & plan"}],sprintId:null,storyPoints:5,createdAt:"2026-03-15"},
  {id:"c11",laneId:"inprogress",title:"Book 1 (BTBS): Build + deliver final .docx",description:"Manuscript COMPLETE (76K chars). Build script written at /home/claude/build_manuscript.js — NOT yet executed. KNOWN ISSUE: Chapters 1-6 appear TWICE in source — exclude duplicate. Steps: 1) node build_manuscript.js 2) validate 3) present_files. Book 2 identified: 'The Chaos Journal'.",priority:5,labels:["feature","urgent","writing"],dueDate:"2026-04-10",estimate:"2h",assignee:"kyle",subtasks:[{id:"b1",text:"Run node build_manuscript.js",done:false},{id:"b2",text:"Run validation script",done:false},{id:"b3",text:"Copy to outputs + present_files",done:false}],healthScore:90,repo:"",timeLog:[],sprintId:"sp2",storyPoints:2,createdAt:"2026-03-13"},
  // ── TO DO ────────────────────────────────────────────────────────
  {id:"c8",laneId:"todo",title:"kylerosebrook.com: Disable Coming Soon + set homepage",description:"Manual steps: 1) Disable Coming Soon in WP Admin, 2) Set static homepage in Settings → Reading, 3) Confirm custom domain live. 'Staff Engineer' removed from all copy. Hire-block reframed to early-collaborator positioning.",priority:4,labels:["launch","urgent"],dueDate:"2026-04-08",estimate:"30m",assignee:"kyle",subtasks:[{id:"la1",text:"Disable Coming Soon mode",done:false},{id:"la2",text:"Set static homepage in WP settings",done:false},{id:"la3",text:"Confirm custom domain live",done:false}],healthScore:85,repo:"",timeLog:[],sprintId:"sp2",storyPoints:1,createdAt:"2026-03-25"},
  {id:"c9",laneId:"todo",title:"Unblock robots.txt + submit to Google Search Console",description:"Both kylerosebrook.com and flashfusion.co blocked from web crawl. Remove disallow all, submit sitemap to Google Search Console. Clean slates for relaunch.",priority:3,labels:["launch"],dueDate:"2026-04-09",estimate:"1h",assignee:"kyle",subtasks:[{id:"la4",text:"Update robots.txt — kylerosebrook.com",done:false},{id:"la5",text:"Update robots.txt — flashfusion.co",done:false},{id:"la6",text:"Submit sitemap to Google Search Console",done:false}],healthScore:80,repo:"",timeLog:[],sprintId:"sp2",storyPoints:2,createdAt:"2026-03-25"},
  {id:"c12",laneId:"todo",title:"CCC: Legal foundation + risk mitigation",description:"MUST HAPPEN BEFORE Firebase MVP. Step 1 per top_10_crit_steps. Files exist: Legal_proteection_kit, Legal_liability_disclaimer. CCC is a mental health platform — liability exposure is real. Crisis resources must be always free, never paywalled.",priority:5,labels:["legal","security","urgent"],dueDate:"2026-04-14",estimate:"3d",assignee:"kyle",subtasks:[{id:"cc1",text:"Review Legal_proteection_kit",done:false},{id:"cc2",text:"Finalize disclaimer language",done:false},{id:"cc3",text:"Define crisis intervention liability scope",done:false},{id:"cc4",text:"Enforce: crisis resources always free",done:false}],healthScore:55,repo:"ChaosClubCo/app",timeLog:[],sprintId:"sp2",storyPoints:8,createdAt:"2026-03-26"},
  {id:"c17",laneId:"todo",title:"Memoir: Excavation Session 1 — Hospitality years",description:"Phase: Early excavation. Thesis locked. No chapters drafted. Target: the Before the Break arc. Sensory inventory of O'Toole's. Key characters: Fran, Stewart, Kylie, Tony. Letter-to-Kinsley frame is load-bearing. Do NOT force meaning too fast.",priority:3,labels:["memoir","research"],dueDate:null,estimate:"3h",assignee:"kyle",subtasks:[{id:"m1",text:"Sensory inventory: O'Toole's space",done:false},{id:"m2",text:"Key characters + relationship dynamics",done:false},{id:"m3",text:"First signs something was building",done:false}],healthScore:85,repo:"",timeLog:[],sprintId:"sp2",storyPoints:3,createdAt:"2026-03-26"},
  {id:"c5",laneId:"todo",title:"Firebase MVP — Chaos Club App",description:"Full-stack React app. Features: Onboarding, Dashboard, Daily Drill, Panic Button, Chaos Tracker, PuppyChow, Community Circles, Raccoon Den. Full spec in Firebase_studio_app_dev_prompt. BLOCKED DEPENDENCY: Legal foundation (c12) must complete first.",priority:4,labels:["feature"],dueDate:null,estimate:"5d",assignee:"kyle",subtasks:[{id:"s11",text:"Legal foundation complete",done:false},{id:"s12",text:"Auth setup",done:false},{id:"s13",text:"Firestore schema",done:false},{id:"s14",text:"Rebel AI crisis detection",done:false}],healthScore:70,repo:"ChaosClubCo/app",timeLog:[],sprintId:"sp2",storyPoints:13,createdAt:"2026-03-10"},
  // ── REVIEW ───────────────────────────────────────────────────────
  {id:"c3",laneId:"review",title:"Daily Dispatch — Chaos Club",description:"3-step morning mental health check-in: Acknowledge, Anchor, Clarity. Phase 1 feature build.",priority:3,labels:["feature"],dueDate:"2026-04-10",estimate:"2d",assignee:"kyle",subtasks:[],healthScore:75,repo:"ChaosClubCo/app",timeLog:[],sprintId:"sp2",storyPoints:3,createdAt:"2026-03-17"},
  // ── BLOCKED ──────────────────────────────────────────────────────
  {id:"c4",laneId:"blocked",title:"Continuum: Batch-merge 90 Dependabot PRs",description:"Batch-merge strategy — NOT individually. 90+ active Dependabot PRs on Krosebrook/continuum. Last good prod deploy March 23 2026. Active project with Claude-powered discovery API route committed.",priority:3,labels:["tech-debt","urgent"],dueDate:null,estimate:"2h",assignee:"kyle",subtasks:[{id:"s8",text:"Group PRs by dependency type",done:false},{id:"s9",text:"Batch merge non-breaking groups",done:false},{id:"s10",text:"Validate prod deploy",done:false}],healthScore:45,repo:"Krosebrook/continuum",timeLog:[],sprintId:"sp2",storyPoints:3,createdAt:"2026-03-19"},
  {id:"c10",laneId:"blocked",title:"Reconnect n8n, Notion, Craft + rotate GitHub PAT",description:"Auth failed on: n8n, Notion, Craft. Wix requires manual check in Cowork. GitHub PAT used for webhook installation needs rotation.",priority:3,labels:["automation","tech-debt"],dueDate:null,estimate:"2h",assignee:"kyle",subtasks:[{id:"la7",text:"Reconnect n8n auth",done:false},{id:"la8",text:"Reconnect Notion auth",done:false},{id:"la9",text:"Reconnect Craft auth",done:false},{id:"la10",text:"Check Wix in Cowork",done:false},{id:"la11",text:"Rotate GitHub PAT",done:false}],healthScore:40,repo:"",timeLog:[],sprintId:"sp2",storyPoints:3,createdAt:"2026-03-25"},
  // ── BACKLOG ──────────────────────────────────────────────────────
  {id:"c6",laneId:"backlog",title:"Kinsley's World — Concept Spec",description:"Educational creative sandbox for Kinsley (ages 8-10). Voice-powered. Concept only — no spec docs exist. Google AI Studio game template identified as base. Development not started.",priority:2,labels:["internal","research"],dueDate:null,estimate:"2w",assignee:"kyle",subtasks:[{id:"s15",text:"Write spec doc",done:false},{id:"s16",text:"Scaffold Google AI Studio base",done:false}],healthScore:60,repo:"ChaosClubCo/kidcreator",timeLog:[],sprintId:null,storyPoints:20,createdAt:"2026-03-01"},
  {id:"c13",laneId:"backlog",title:"CCC: Crisis intervention system design",description:"Step 2 per top_10_crit_steps. crisis_safety_sprint_structure doc exists. Design: crisis protocols that connect rather than save. Rebel AI needs crisis detection. Crisis resources never paywalled.",priority:4,labels:["feature","security"],dueDate:null,estimate:"2d",assignee:"kyle",subtasks:[{id:"cc5",text:"Review crisis_safety_sprint_structure",done:false},{id:"cc6",text:"Design Rebel AI crisis detection logic",done:false},{id:"cc7",text:"Always-free crisis resource access",done:false}],healthScore:65,repo:"ChaosClubCo/app",timeLog:[],sprintId:null,storyPoints:5,createdAt:"2026-03-26"},
  {id:"c14",laneId:"backlog",title:"CCC: Brand voice AI training — Rebel",description:"Chaos raccoon mascot. Anti-toxic-positivity voice. Step 4 per top_10_crit_steps. 15 brand pillars defined. 'Welcome to the Chaos Club: where no one has to pretend — but everyone understands.'",priority:2,labels:["feature","automation"],dueDate:null,estimate:"1w",assignee:"kyle",subtasks:[],healthScore:50,repo:"ChaosClubCo/app",timeLog:[],sprintId:null,storyPoints:5,createdAt:"2026-03-26"},
  {id:"c16",laneId:"backlog",title:"CCC: Outline Book 2 — The Chaos Journal",description:"Structured prompts for excavating what's underneath. Natural sequel to BTBS. Outline while Book 1 is fresh.",priority:1,labels:["writing","research"],dueDate:null,estimate:"2h",assignee:"kyle",subtasks:[],healthScore:80,repo:"",timeLog:[],sprintId:null,storyPoints:2,createdAt:"2026-03-26"},
  {id:"c18",laneId:"backlog",title:"Memoir: The Rupture — first rough notes",description:"TBI and addiction chapter seeds. Protected — Kyle discloses on his terms. Raw notes only. What was the first moment old strategies stopped working? Memory gaps ARE the content — not a writing flaw.",priority:2,labels:["memoir","writing"],dueDate:null,estimate:"3h",assignee:"kyle",subtasks:[],healthScore:80,repo:"",timeLog:[],sprintId:null,storyPoints:3,createdAt:"2026-03-26"},
  {id:"c19",laneId:"backlog",title:"Memoir: Chronological tool/system archaeology",description:"Map the 240+ tools from first post-TBI coping tools → current MCP configuration. Each tool is a prosthetic, not a productivity hack. Identify the first tool that actually worked.",priority:2,labels:["memoir","research"],dueDate:null,estimate:"4h",assignee:"kyle",subtasks:[{id:"m4",text:"List tools by approximate acquisition date",done:false},{id:"m5",text:"Identify 'first tool that actually helped'",done:false},{id:"m6",text:"Map to rupture timeline",done:false}],healthScore:80,repo:"",timeLog:[],sprintId:null,storyPoints:3,createdAt:"2026-03-26"},
  {id:"c21",laneId:"backlog",title:"Suno: Finalize 5 songs in progress",description:"'Gold in the Static', 'Still Standing', 'Echo Chamber Karaoke', 'Little Blue Halos', 'Hold On, Dad'. Suno AI Custom Mode. Requires [Verse]/[Chorus]/[Bridge] + detailed style descriptions. NOT artist name references.",priority:1,labels:["writing"],dueDate:null,estimate:"2h",assignee:"kyle",subtasks:[{id:"sg1",text:"'Gold in the Static'",done:false},{id:"sg2",text:"'Little Blue Halos'",done:false},{id:"sg3",text:"'Hold On, Dad'",done:false}],healthScore:70,repo:"",timeLog:[],sprintId:null,storyPoints:2,createdAt:"2026-03-26"},
  // ── DONE ─────────────────────────────────────────────────────────
  {id:"c2",laneId:"done",title:"RLS Audit — Supabase",description:"Proactive RLS audit. Replaced auth.uid() with (select auth.uid()) to fix auth_rls_initplan warnings.",priority:5,labels:["security"],dueDate:"2026-03-26",estimate:"1d",assignee:"kyle",subtasks:[{id:"s5",text:"Identify all policies",done:true},{id:"s6",text:"Test tenant isolation",done:true},{id:"s7",text:"Document findings",done:true}],healthScore:95,repo:"Krosebrook/continuum",timeLog:[],sprintId:"sp1",storyPoints:5,createdAt:"2026-03-18"},
  {id:"c7",laneId:"done",title:"INT Institutional Hub v1.0",description:"Launch completed. Final deploy & validation.",priority:4,labels:["client"],dueDate:"2026-03-20",estimate:"1w",assignee:"kyle",subtasks:[],healthScore:95,repo:"intinc/hub",timeLog:[{date:"2026-03-20",duration:180,note:"Final deploy & validation"}],sprintId:"sp1",storyPoints:5,createdAt:"2026-03-01"},
];

const DEF_SPRINTS=[
  {id:"sp1",name:"Sprint 9 — Launch",startDate:"2026-03-16",endDate:"2026-03-30",totalPoints:24,
   burndown:[{d:0,i:24,a:24},{d:1,i:22.3,a:23},{d:2,i:20.6,a:22},{d:3,i:18.9,a:20},{d:4,i:17.1,a:18},{d:5,i:15.4,a:16},{d:6,i:13.7,a:14},{d:7,i:12,a:12},{d:8,i:10.3,a:9},{d:9,i:8.6,a:7},{d:10,i:6.9,a:5},{d:11,i:5.1,a:4},{d:12,i:3.4,a:3},{d:13,i:1.7,a:1.5},{d:14,i:0,a:1}]},
  {id:"sp2",name:"Sprint 10 — Build",startDate:"2026-03-31",endDate:"2026-04-14",totalPoints:45,
   burndown:[{d:0,i:45,a:45},{d:1,i:41.8,a:44},{d:2,i:38.6,a:42},{d:3,i:35.4,a:40},{d:4,i:32.1,a:38},{d:5,i:28.9,a:35},{d:6,i:25.7,a:32},{d:7,i:22.5,a:30},{d:8,i:19.3,a:null},{d:9,i:16.1,a:null},{d:10,i:12.9,a:null},{d:11,i:9.6,a:null},{d:12,i:6.4,a:null},{d:13,i:3.2,a:null},{d:14,i:0,a:null}]},
];

// ─── Portfolio seed data ─────────────────────────────────────────────────────
const DEF_PROJECTS=[
  {id:"continuum-001",name:"Continuum",status:"Active",platform:"Vercel",techDebt:2,businessValue:5,monthlyCost:20,lastActivity:"2026-03-23",repo:"https://github.com/Krosebrook/continuum",auditChecks:{hasTests:true,hasCI:true,hasDocs:false},notes:"Next.js / Supabase / Tailwind. 90+ dependabot PRs — batch-merge queued. Claude-powered discovery API committed. Last good prod deploy 2026-03-23."},
  {id:"chaos-club-app",name:"Chaos Club Co. App",status:"Active",platform:"Firebase",techDebt:2,businessValue:5,monthlyCost:25,lastActivity:"2026-04-07",repo:"",auditChecks:{hasTests:false,hasCI:false,hasDocs:true},notes:"Peer support & wellness platform. BLOCKED on legal foundation. Firebase Studio spec complete. Rebel AI raccoon mascot w/ crisis detection."},
  {id:"chaos-club-book1",name:"BTBS Book 1",status:"Active",platform:"Other",techDebt:1,businessValue:4,monthlyCost:0,lastActivity:"2026-04-07",repo:"",auditChecks:{hasTests:false,hasCI:false,hasDocs:true},notes:"'Breathe Through the Bullsh*t' — manuscript COMPLETE. build_manuscript.js written but not run. Chapters 1-6 duplicated in source — exclude second copy."},
  {id:"memoir-001",name:"The Memoir",status:"Planning",platform:"Other",techDebt:1,businessValue:5,monthlyCost:0,lastActivity:"2026-04-07",repo:"",auditChecks:{hasTests:false,hasCI:false,hasDocs:true},notes:"Literary nonfiction. Construction vs. recovery thesis locked. Voice DNA v2 built. Letter-to-Kinsley frame is load-bearing. Phase: early excavation. No chapters drafted."},
  {id:"kylerosebrook-001",name:"kylerosebrook.com",status:"Planning",platform:"WordPress",techDebt:1,businessValue:5,monthlyCost:0,lastActivity:"2026-04-07",repo:"",auditChecks:{hasTests:false,hasCI:false,hasDocs:true},notes:"WP.com Business (site ID 253504189). Launch pending: disable Coming Soon, set static homepage, unblock robots.txt. Hire-block removed — early-collaborator positioning."},
  {id:"flashfusion-co",name:"flashfusion.co",status:"Active",platform:"Base44",techDebt:2,businessValue:4,monthlyCost:0,lastActivity:"2026-04-01",repo:"",auditChecks:{hasTests:false,hasCI:false,hasDocs:false},notes:"Points to Base44 'Fusion AI' app (67-entity schema). First customer TBD — Sole Revival on semi-permanent pause (archived, do not re-engage). robots.txt blocking crawl."},
  {id:"flashfusion-unified",name:"FlashFusion-Unified",status:"Archived",platform:"Vercel",techDebt:4,businessValue:4,monthlyCost:20,lastActivity:"2025-09-01",repo:"https://github.com/Krosebrook/FlashFusion",auditChecks:{hasTests:false,hasCI:false,hasDocs:false},notes:"Archived at 60-70% completion. Revival contingent on finding first customer — Sole Revival was original target but is on semi-permanent pause. Do not confuse with ChaosClub or Intinc."},
  {id:"kidcreator-001",name:"KidCreator / Kinsley App",status:"Planning",platform:"GitHub",techDebt:2,businessValue:4,monthlyCost:0,lastActivity:"2025-11-01",repo:"",auditChecks:{hasTests:false,hasCI:false,hasDocs:false},notes:"Educational sandbox for Kinsley (ages 8-10). Voice-powered. Concept only — no spec docs. Google AI Studio game template identified as base."},
];

// ─── Memoir seed data ────────────────────────────────────────────────────────
const DEF_MEMOIR={
  arcs:[
    {id:"arc1",title:"Before the Break",subtitle:"Hospitality years — O'Toole's",status:"excavation",color:"#388bfd",notes:"Sensory inventory target. Key characters: Fran, Stewart, Kylie, Tony. Bartending as competence before memory failed."},
    {id:"arc2",title:"The Rupture",subtitle:"TBI · addiction · strategies failing",status:"protected",color:"#da3633",notes:"Protected — Kyle discloses on his terms. What was the first moment old strategies stopped working?"},
    {id:"arc3",title:"The Construction Project",subtitle:"First tools · external cognition · learning to program",status:"pending",color:"#d29922",notes:"Chronological tool archaeology needed. 240+ tools mapped by acquisition date. Each tool is a prosthetic."},
    {id:"arc4",title:"Late-Life Emergence",subtitle:"Self-teaching → Staff Engineer · FlashFusion · Intinc",status:"pending",color:"#f0883e",notes:""},
    {id:"arc5",title:"Parallel Constructions",subtitle:"Kinsley · Chaos Club · the memoir itself",status:"pending",color:"#a855f7",notes:"Are Chaos Club and the memoir the same project? What does Kinsley see?"},
  ],
  sessions:[],
  excavationQueue:[
    {id:"eq1",text:"Sensory inventory of O'Toole's — smell, sound, the muscle memory of bartending",done:false},
    {id:"eq2",text:"Who was Fran? What did she see in you that you didn't see in yourself yet?",done:false},
    {id:"eq3",text:"First tool/system that actually helped after the break — what was it and why?",done:false},
    {id:"eq4",text:"What would pre-injury Kyle think of constructed Kyle?",done:false},
    {id:"eq5",text:"Chronological mapping: earliest tool → current 240+ MCP stack",done:false},
    {id:"eq6",text:"The rupture moment — when did you first realize old strategies had stopped working?",done:false},
    {id:"eq7",text:"Kinsley — what does she see? What will she understand when she's older?",done:false},
    {id:"eq8",text:"What is permanently lost? What exists now that couldn't have existed before?",done:false},
  ],
  voiceReminders:[
    "Direct without being cold",
    "Metaphor-heavy — 'dumpster fire brain', 'cognitive scaffolding', 'smoke detector / burnt toast'",
    "NEVER: 'And that's when I realized...' / 'Looking back, I can see...'",
    "Technical descriptions of emotional states",
    "Memory uncertainty IS the content — not a writing flaw",
    "Construction, not recovery",
    "Leave room for the reader to work",
  ],
};

// ─── Utilities ───────────────────────────────────────────────────────────────
const fmt = (min) => min>=60?`${Math.floor(min/60)}h${min%60?` ${min%60}m`:""}` : `${min}m`;
const isOverdue = (d) => d && new Date(d) < new Date();
const totalTime = (card) => (card.timeLog||[]).reduce((s,e)=>s+e.duration,0);
const getMember = (members,id) => members.find(m=>m.id===id);
const repoUrl = (r) => !r ? null : r.startsWith("http") ? r : `https://github.com/${r}`;
const calcHealth = (p) => {
  const days = p.lastActivity?Math.floor((Date.now()-new Date(p.lastActivity))/86400000):999;
  let s=100;
  if(days>180)s-=40; else if(days>90)s-=25; else if(days>30)s-=10;
  s-=((p.techDebt||3)-1)*8;
  if(p.status==="Blocked")s-=20;
  if(p.status==="Archived"||p.status==="Sunset")s-=30;
  s+=((p.businessValue||3)-3)*5;
  s+=Object.values(p.auditChecks||{}).filter(Boolean).length*2;
  return Math.max(0,Math.min(100,Math.round(s)));
};
const hc=(h)=>h>=75?"#3fb950":h>=50?"#d29922":h>=30?"#f0883e":"#da3633";
const hl=(h)=>h>=75?"Healthy":h>=50?"Fair":h>=30?"At Risk":"Critical";

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#080c10;--s:#0d1117;--s2:#161b22;--s3:#21262d;
  --b:#21262d;--b2:#30363d;--t:#e6edf3;--t2:#8b949e;--t3:#484f58;
  --a:#7c3aed;--a2:#a855f7;--ag:rgba(124,58,237,0.15);
  --green:#3fb950;--yellow:#d29922;--orange:#f0883e;--red:#da3633;--blue:#388bfd;
}
body{background:var(--bg);color:var(--t);font-family:'Inter',sans-serif;font-size:13px;min-height:100vh}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--b2);border-radius:2px}
.mono{font-family:'IBM Plex Mono',monospace}
.btn{cursor:pointer;border:none;border-radius:6px;font-family:inherit;font-size:12px;font-weight:500;padding:6px 12px;transition:all 0.15s;display:inline-flex;align-items:center;gap:5px;white-space:nowrap}
.btn:hover{filter:brightness(1.15)}.btn:active{transform:scale(0.97)}
.btn-primary{background:var(--a);color:#fff}
.btn-ghost{background:transparent;color:var(--t2);border:1px solid var(--b2)}
.btn-ghost:hover{color:var(--t);border-color:var(--t2)}
.btn-danger{background:var(--red);color:#fff}
.btn-success{background:#238636;color:#fff}
.btn-sm{padding:3px 9px;font-size:11px}
.inp{background:var(--s);border:1px solid var(--b2);border-radius:6px;color:var(--t);font-family:inherit;font-size:12px;padding:7px 10px;outline:none;width:100%;transition:border-color 0.15s}
.inp:focus{border-color:var(--a)} select.inp{cursor:pointer}
.inp-sm{padding:4px 8px;font-size:11px}
textarea.inp{resize:vertical;min-height:72px}
.card{background:var(--s2);border:1px solid var(--b);border-radius:8px;padding:10px}
.card:hover{border-color:var(--b2)}
.k-card{background:var(--s2);border:1px solid var(--b);border-radius:7px;padding:10px;cursor:pointer;transition:all 0.12s;user-select:none}
.k-card:hover{border-color:var(--b2);background:#1c2128}
.k-card.dragging{opacity:0.3;transform:rotate(1deg)}
.drop-zone{border-color:var(--blue)!important;background:#0d2240!important}
.pbar{height:4px;background:var(--s3);border-radius:2px;overflow:hidden}
.pfill{height:100%;border-radius:2px;transition:width 0.4s}
.sl{font-size:10px;font-weight:600;color:var(--t2);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:5px;font-family:'IBM Plex Mono'}
.badge{display:inline-flex;align-items:center;font-size:10px;font-weight:600;padding:2px 7px;border-radius:100px;text-transform:uppercase;letter-spacing:0.4px}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px;backdrop-filter:blur(4px)}
.modal{background:var(--s2);border:1px solid var(--b2);border-radius:12px;padding:24px;width:640px;max-width:100%;max-height:90vh;overflow-y:auto}
.fade{animation:fade 0.2s ease}
@keyframes fade{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}
.tab-pill{padding:5px 14px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;border:none;font-family:inherit;transition:all 0.12s}
.wip-warn{color:var(--red)!important}
.arc-pill{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:600;padding:2px 8px;border-radius:100px;text-transform:uppercase;letter-spacing:0.4px;border:1px solid}
`;

// ─── Shared Components ────────────────────────────────────────────────────────
function Lbl({ text }) {
  const c = LC[text] || "#8b949e";
  return (
    <span className="badge" style={{ background: c + "22", color: c, border: `1px solid ${c}44` }}>
      {text}
    </span>
  );
}

function Ava({ name, size = 22 }) {
  const c = ["#388bfd","#3fb950","#d29922","#f0883e","#8b5cf6"][name?.charCodeAt(0) % 5 || 0];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: c + "33", border: `1px solid ${c}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.45, fontWeight: 700, color: c, flexShrink: 0, fontFamily: "'IBM Plex Mono'" }}>
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
}

function SBadge({ status }) {
  const c = { Active:"#3fb950", Planning:"#388bfd", Blocked:"#da3633", Archived:"#484f58", Sunset:"#8b949e" }[status] || "#8b949e";
  return (
    <span className="badge" style={{ background: c + "22", color: c, border: `1px solid ${c}44` }}>
      {status}
    </span>
  );
}

function HBar({ score }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div className="pbar" style={{ flex: 1 }}>
        <div className="pfill" style={{ width: `${score}%`, background: hc(score) }} />
      </div>
      <span className="mono" style={{ fontSize: 11, color: hc(score), minWidth: 24, textAlign: "right" }}>{score}</span>
    </div>
  );
}

// ─── KANBAN: CardItem ─────────────────────────────────────────────────────────
function CardItem({card,members,onClick,onDragStart,onDragEnd,activeTimer,isDragging}){
  const tt=totalTime(card),done=card.subtasks?.filter(s=>s.done).length||0,total=card.subtasks?.length||0;
  const isTimerActive=activeTimer?.cardId===card.id,overdue=isOverdue(card.dueDate);
  const ru=repoUrl(card.repo);
  return(
    <div className={`k-card${isDragging?" dragging":""}`}style={{borderLeft:`3px solid ${PC[card.priority]}`,marginBottom:6}}
      draggable onClick={()=>onClick(card)}
      onDragStart={e=>{e.dataTransfer.effectAllowed="move";onDragStart(card.id);}}
      onDragEnd={onDragEnd}>
      <div style={{fontSize:12,fontWeight:500,color:"#e6edf3",lineHeight:1.4,marginBottom:5}}>{card.title}</div>
      {card.labels?.length>0&&<div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:5}}>{card.labels.map(l=><Lbl key={l} text={l}/>)}</div>}
      <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
        {card.assignee&&<Ava name={getMember(members,card.assignee)?.name||card.assignee}size={16}/>}
        {card.dueDate&&<span style={{fontSize:10,color:overdue?"#da3633":"#484f58",fontFamily:"'IBM Plex Mono'"}}>{overdue?"⚠ ":""}{card.dueDate}</span>}
        {total>0&&<span style={{fontSize:10,color:done===total?"#3fb950":"#484f58",fontFamily:"'IBM Plex Mono'"}}>{done}/{total}</span>}
        {tt>0&&<span style={{fontSize:10,color:"#14b8a6",fontFamily:"'IBM Plex Mono'"}}>⏱{fmt(tt)}</span>}
        {isTimerActive&&<span style={{fontSize:10,color:"#3fb950",fontFamily:"'IBM Plex Mono'"}}>● REC</span>}
        {ru&&<span onClick={e=>{e.stopPropagation();window.open(ru,"_blank");}}style={{fontSize:10,color:"#484f58",cursor:"pointer",marginLeft:"auto"}}title={card.repo}>↗</span>}
        {card.storyPoints&&<span style={{fontSize:10,color:"#484f58",marginLeft:ru?"0":"auto",fontFamily:"'IBM Plex Mono'"}}>{card.storyPoints}pt</span>}
      </div>
    </div>
  );
}

// ─── KANBAN: BoardView ────────────────────────────────────────────────────────
function BoardView({lanes,cards,members,dragCardId,setDragCardId,dragOverLane,setDragOverLane,moveCard,onCardClick,onAddCard,activeTimer,filteredCards}){
  const handleDrop=laneId=>{if(dragCardId)moveCard(dragCardId,laneId);setDragCardId(null);setDragOverLane(null);};
  const getLaneCards=laneId=>filteredCards.filter(c=>c.laneId===laneId);
  const getLaneCount=laneId=>cards.filter(c=>c.laneId===laneId).length;
  const isWipOver=lane=>lane.wipLimit>0&&getLaneCount(lane.id)>lane.wipLimit;
  return(
    <div style={{flex:1,overflow:"auto",padding:"12px 16px"}}>
      <div style={{display:"flex",gap:10,minWidth:"max-content"}}>
        {lanes.map(lane=>{
          const laneCards=getLaneCards(lane.id);
          const wip=isWipOver(lane);
          return(
            <div key={lane.id}style={{width:230,flexShrink:0,display:"flex",flexDirection:"column"}}>
              <div style={{padding:"7px 10px",borderRadius:"7px 7px 0 0",background:"var(--s2)",border:`1px solid ${wip?"var(--red)":"var(--b)"}`,borderBottom:"none",display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:lane.color,flexShrink:0}}/>
                <span style={{fontSize:12,fontWeight:600,color:"var(--t)",flex:1}}>{lane.title}</span>
                <span className="mono"style={{fontSize:11,color:wip?"var(--red)":"var(--t3)"}}>{getLaneCount(lane.id)}{lane.wipLimit>0?`/${lane.wipLimit}`:""}</span>
                <button className="btn"style={{padding:"0 5px",fontSize:14,background:"transparent",color:"var(--t3)",border:"none"}}onClick={()=>onAddCard(lane.id)}>+</button>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:8,background:"var(--s)",border:`1px solid ${dragOverLane===lane.id?"var(--blue)":wip?"var(--red)":"var(--b)"}`,borderTop:"none",borderRadius:"0 0 7px 7px",minHeight:80,transition:"border-color 0.1s"}}
                className={dragOverLane===lane.id?"drop-zone":""}
                onDragOver={e=>{e.preventDefault();setDragOverLane(lane.id);}}
                onDrop={()=>handleDrop(lane.id)}
                onDragLeave={()=>setDragOverLane(null)}>
                {laneCards.map(card=>(
                  <CardItem key={card.id}card={card}members={members}onClick={onCardClick}activeTimer={activeTimer}
                    isDragging={dragCardId===card.id}
                    onDragStart={id=>setDragCardId(id)}
                    onDragEnd={()=>{setDragCardId(null);setDragOverLane(null);}}/>
                ))}
                {laneCards.length===0&&<div style={{textAlign:"center",color:"var(--t3)",fontSize:11,padding:"14px 0",fontStyle:"italic"}}>Drop here</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── KANBAN: CardModal ────────────────────────────────────────────────────────
function CardModal({card,lanes,members,onSave,onDelete,onClose,activeTimer,startTimer,stopTimer,timerDisplay,addTimeEntry}){
  const[form,setForm]=useState(card);
  const[tab,setTab]=useState("details");
  const[newSub,setNewSub]=useState("");
  const[timeForm,setTimeForm]=useState({duration:"",date:new Date().toISOString().split("T")[0],note:""});
  const isTimerActive=activeTimer?.cardId===card.id;
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const toggleLabel=l=>{const ls=form.labels.includes(l)?form.labels.filter(x=>x!==l):[...form.labels,l];set("labels",ls);};
  const addSub=()=>{if(!newSub.trim())return;set("subtasks",[...(form.subtasks||[]),{id:`s${Date.now()}`,text:newSub.trim(),done:false}]);setNewSub("");};
  const toggleSub=id=>set("subtasks",form.subtasks.map(s=>s.id===id?{...s,done:!s.done}:s));
  const removeSub=id=>set("subtasks",form.subtasks.filter(s=>s.id!==id));
  const handleAddTime=()=>{if(!timeForm.duration)return;const entry={date:timeForm.date,duration:parseInt(timeForm.duration)||0,note:timeForm.note};addTimeEntry(card.id,timeForm.duration,timeForm.date,timeForm.note);setForm(f=>({...f,timeLog:[...(f.timeLog||[]),entry]}));setTimeForm({duration:"",date:new Date().toISOString().split("T")[0],note:""});};
  const ru=repoUrl(form.repo);
  return(
    <div className="modal-bg"onClick={onClose}>
      <div className="modal"onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:14}}>
          <div style={{width:4,height:36,background:PC[form.priority],borderRadius:2,flexShrink:0,marginTop:2}}/>
          <input className="inp"style={{flex:1,fontSize:15,fontWeight:600,background:"transparent",border:"none",padding:"4px 0",borderRadius:0,borderBottom:"1px solid var(--b)"}}value={form.title}onChange={e=>set("title",e.target.value)}/>
          <button className="btn btn-ghost btn-sm"onClick={onClose}>✕</button>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:14,borderBottom:"1px solid var(--b)",paddingBottom:0}}>
          {[["details","Details"],["time","⏱ Time"],["subtasks","Subtasks"]].map(([id,label])=>(
            <button key={id}className="tab-pill"onClick={()=>setTab(id)}style={{background:tab===id?"var(--s3)":"transparent",color:tab===id?"var(--t)":"var(--t2)",border:"none",borderBottom:tab===id?"2px solid var(--blue)":"2px solid transparent",borderRadius:"4px 4px 0 0"}}>
              {label}{id==="subtasks"&&form.subtasks?.length>0?` (${form.subtasks.length})`:""}{id==="time"&&totalTime(form)>0?` ${fmt(totalTime(form))}`:""}
            </button>
          ))}
        </div>
        {tab==="details"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div><div className="sl">Lane</div><select className="inp"value={form.laneId}onChange={e=>set("laneId",e.target.value)}>{lanes.map(l=><option key={l.id}value={l.id}>{l.title}</option>)}</select></div>
            <div><div className="sl">Priority</div><select className="inp"value={form.priority}onChange={e=>set("priority",parseInt(e.target.value))}>{[1,2,3,4,5].map(p=><option key={p}value={p}>P{p} — {PL[p]}</option>)}</select></div>
            <div><div className="sl">Assignee</div><select className="inp"value={form.assignee||""}onChange={e=>set("assignee",e.target.value||null)}><option value="">Unassigned</option>{members.map(m=><option key={m.id}value={m.id}>{m.name}</option>)}</select></div>
            <div><div className="sl">Due Date</div><input className="inp"type="date"value={form.dueDate||""}onChange={e=>set("dueDate",e.target.value||null)}/></div>
            <div><div className="sl">Estimate</div><input className="inp"placeholder="2h, 1d…"value={form.estimate||""}onChange={e=>set("estimate",e.target.value)}/></div>
            <div><div className="sl">Story Points</div><input className="inp"type="number"min="1"max="100"value={form.storyPoints||1}onChange={e=>set("storyPoints",parseInt(e.target.value)||1)}/></div>
            <div style={{gridColumn:"span 2"}}><div className="sl">Description</div><textarea className="inp"style={{minHeight:90}}value={form.description||""}onChange={e=>set("description",e.target.value)}/></div>
            <div style={{gridColumn:"span 2"}}>
              <div className="sl">Labels</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {Object.keys(LC).map(l => {
                  const active = form.labels?.includes(l);
                  return (
                    <button key={l} className="badge" style={{cursor:"pointer",background:active?LC[l]+"33":LC[l]+"11",color:LC[l],border:`1px solid ${LC[l]}${active?"":"33"}`,opacity:active?1:0.6}} onClick={()=>toggleLabel(l)}>
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="sl">Repo</div>
              <div style={{display:"flex",gap:6}}>
                <input className="inp"placeholder="org/repo or https://…"value={form.repo||""}onChange={e=>set("repo",e.target.value)}/>
                {ru&&<button className="btn btn-ghost btn-sm"onClick={()=>window.open(ru,"_blank")}>↗</button>}
              </div>
            </div>
            <div><div className="sl">Health</div><input className="inp"type="number"min="0"max="100"value={form.healthScore||""}onChange={e=>set("healthScore",parseInt(e.target.value)||null)}placeholder="0–100"/></div>
          </div>
        )}
        {tab==="time"&&(
          <div>
            <div style={{background:"var(--s)",border:"1px solid var(--b)",borderRadius:7,padding:14,marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
              <div className="mono"style={{fontSize:26,fontWeight:700,color:isTimerActive?"#3fb950":"var(--t)",flex:1}}>{isTimerActive?timerDisplay:"00:00"}</div>
              {isTimerActive?<button className="btn btn-danger"onClick={()=>stopTimer(card.id)}>⏹ Stop</button>:<button className="btn btn-success"onClick={()=>startTimer(card.id)}>▶ Start</button>}
            </div>
            <div style={{background:"var(--s)",border:"1px solid var(--b)",borderRadius:7,padding:12,marginBottom:14}}>
              <div className="sl"style={{marginBottom:8}}>Log manually</div>
              <div style={{display:"grid",gridTemplateColumns:"80px 1fr 1fr auto",gap:8,alignItems:"end"}}>
                <div><div style={{fontSize:10,color:"var(--t3)",marginBottom:3}}>Minutes</div><input className="inp inp-sm"type="number"min="1"placeholder="60"value={timeForm.duration}onChange={e=>setTimeForm(f=>({...f,duration:e.target.value}))}/></div>
                <div><div style={{fontSize:10,color:"var(--t3)",marginBottom:3}}>Date</div><input className="inp inp-sm"type="date"value={timeForm.date}onChange={e=>setTimeForm(f=>({...f,date:e.target.value}))}/></div>
                <div><div style={{fontSize:10,color:"var(--t3)",marginBottom:3}}>Note</div><input className="inp inp-sm"placeholder="What?"value={timeForm.note}onChange={e=>setTimeForm(f=>({...f,note:e.target.value}))}/></div>
                <button className="btn btn-primary"style={{padding:"5px 10px"}}onClick={handleAddTime}>Add</button>
              </div>
            </div>
            {(form.timeLog||[]).length>0&&(
              <div style={{background:"var(--s2)",border:"1px solid var(--b)",borderRadius:7,overflow:"hidden"}}>
                <div style={{padding:"7px 12px",background:"var(--s)",borderBottom:"1px solid var(--b)",display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--t2)",fontWeight:600}}>
                  <span>Time Log</span><span className="mono"style={{color:"#14b8a6"}}>Total: {fmt(totalTime(form))}</span>
                </div>
                {(form.timeLog||[]).map((e,i)=>(
                  <div key={i}style={{display:"flex",gap:10,padding:"7px 12px",borderBottom:i<form.timeLog.length-1?"1px solid var(--b)":"none"}}>
                    <span className="mono"style={{fontSize:11,color:"var(--t2)",width:88}}>{e.date}</span>
                    <span className="mono"style={{fontSize:11,fontWeight:600,color:"#14b8a6",width:36}}>{fmt(e.duration)}</span>
                    <span style={{fontSize:12,color:"var(--t2)",flex:1}}>{e.note||"—"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab==="subtasks"&&(
          <div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <input className="inp"placeholder="Add subtask…"value={newSub}onChange={e=>setNewSub(e.target.value)}onKeyDown={e=>e.key==="Enter"&&addSub()}/>
              <button className="btn btn-primary"style={{flexShrink:0}}onClick={addSub}>Add</button>
            </div>
            {(form.subtasks||[]).length>0&&(
              <div>
                <div style={{marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
                  <div className="pbar"style={{flex:1}}><div className="pfill"style={{width:`${form.subtasks.filter(s=>s.done).length/form.subtasks.length*100}%`,background:"#3fb950"}}/></div>
                  <span className="mono"style={{fontSize:11,color:"var(--t2)"}}>{form.subtasks.filter(s=>s.done).length}/{form.subtasks.length}</span>
                </div>
                {form.subtasks.map(s=>(
                  <div key={s.id}style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid var(--b)"}}>
                    <input type="checkbox"checked={s.done}onChange={()=>toggleSub(s.id)}style={{cursor:"pointer",accentColor:"#3fb950"}}/>
                    <span style={{flex:1,fontSize:13,color:s.done?"var(--t3)":"var(--t)",textDecoration:s.done?"line-through":"none"}}>{s.text}</span>
                    <button className="btn"style={{padding:"2px 5px",background:"transparent",color:"var(--t3)",border:"none"}}onClick={()=>removeSub(s.id)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div style={{display:"flex",gap:8,marginTop:18,paddingTop:14,borderTop:"1px solid var(--b)"}}>
          <button className="btn btn-danger btn-sm"onClick={()=>onDelete(card.id)}>Delete</button>
          <div style={{flex:1}}/>
          <button className="btn btn-ghost btn-sm"onClick={onClose}>Cancel</button>
          <button className="btn btn-primary"onClick={()=>onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── KANBAN: TemplatePicker ───────────────────────────────────────────────────
function TemplatePicker({onSelect,onClose}){
  return(
    <div className="modal-bg"onClick={onClose}>
      <div style={{background:"var(--s2)",border:"1px solid var(--b)",borderRadius:10,padding:20,width:460,maxWidth:"95vw"}}onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontWeight:700,fontSize:14}}>Choose template</span>
          <button className="btn btn-ghost btn-sm"onClick={onClose}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
          {TEMPLATES.map(t=>(
            <button key={t.id}className="btn btn-ghost"style={{padding:"10px 12px",textAlign:"left",height:"auto",flexDirection:"column",alignItems:"flex-start",gap:3}}onClick={()=>onSelect(t)}>
              <div style={{fontSize:16}}>{t.icon}</div>
              <div style={{fontSize:12,fontWeight:600,color:"var(--t)"}}>{t.name}</div>
              <div style={{fontSize:10,color:"var(--t3)"}}>{t.defaults.labels.join(", ")||"no labels"} · {t.defaults.estimate||"no estimate"}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PORTFOLIO: ProjectModal ──────────────────────────────────────────────────
function ProjectModal({project,onSave,onClose}){
  const[p,setP]=useState({...project});
  const s=(k,v)=>setP(x=>({...x,[k]:v}));
  const sa=(k,v)=>setP(x=>({...x,auditChecks:{...x.auditChecks,[k]:v}}));
  const ru=repoUrl(p.repo);
  return(
    <div className="modal-bg"onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal fade"style={{width:600}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <b style={{fontSize:15}}>{p.id?"Edit Project":"New Project"}</b>
          <button className="btn btn-ghost btn-sm"onClick={onClose}>✕</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div><div className="sl">Name</div><input className="inp"value={p.name}onChange={e=>s("name",e.target.value)}placeholder="Project name"/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><div className="sl">Status</div><select className="inp"value={p.status}onChange={e=>s("status",e.target.value)}>{STATUSES.map(x=><option key={x}>{x}</option>)}</select></div>
            <div><div className="sl">Platform</div><select className="inp"value={p.platform}onChange={e=>s("platform",e.target.value)}>{PLATFORMS.map(x=><option key={x}>{x}</option>)}</select></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <div><div className="sl">Tech Debt (1–5)</div><input className="inp"type="number"min={1}max={5}value={p.techDebt}onChange={e=>s("techDebt",+e.target.value)}/></div>
            <div><div className="sl">Biz Value (1–5)</div><input className="inp"type="number"min={1}max={5}value={p.businessValue}onChange={e=>s("businessValue",+e.target.value)}/></div>
            <div><div className="sl">Cost/mo ($)</div><input className="inp"type="number"min={0}value={p.monthlyCost}onChange={e=>s("monthlyCost",+e.target.value)}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><div className="sl">Last Activity</div><input className="inp"type="date"value={p.lastActivity}onChange={e=>s("lastActivity",e.target.value)}/></div>
            <div>
              <div className="sl">Repo / URL</div>
              <div style={{display:"flex",gap:6}}>
                <input className="inp"value={p.repo||""}onChange={e=>s("repo",e.target.value)}placeholder="https://github.com/…"/>
                {ru&&<button className="btn btn-ghost btn-sm"onClick={()=>window.open(ru,"_blank")}>↗</button>}
              </div>
            </div>
          </div>
          <div><div className="sl">Notes / Current State</div><textarea className="inp"style={{minHeight:76}}value={p.notes||""}onChange={e=>s("notes",e.target.value)}placeholder="Status, blockers, next actions…"/></div>
          <div>
            <div className="sl"style={{marginBottom:8}}>Audit</div>
            <div style={{display:"flex",gap:16}}>{["hasTests","hasCI","hasDocs"].map(k=>(
              <label key={k}style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:12,color:"var(--t2)"}}>
                <input type="checkbox"checked={!!p.auditChecks?.[k]}onChange={e=>sa(k,e.target.checked)}style={{accentColor:"var(--a)"}}/>
                {k.replace("has","")}
              </label>
            ))}</div>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:4}}>
            <button className="btn btn-ghost"onClick={onClose}>Cancel</button>
            <button className="btn btn-primary"onClick={()=>onSave(p)}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TODAY TAB ────────────────────────────────────────────────────────────────
function TodayTab({cards,lanes,projects,memoir,onCardClick,onAddCard,activeSprintId,sprints}){
  const[quickTitle,setQuickTitle]=useState("");
  const[quickPriority,setQuickPriority]=useState(3);
  const today=new Date().toISOString().split("T")[0];
  const overdue=cards.filter(c=>c.laneId!=="done"&&isOverdue(c.dueDate));
  const dueToday=cards.filter(c=>c.laneId!=="done"&&c.dueDate===today);
  const blocked=cards.filter(c=>c.laneId==="blocked");
  const urgent=cards.filter(c=>c.laneId!=="done"&&c.priority>=4&&!isOverdue(c.dueDate));
  const sprint=sprints.find(s=>s.id===activeSprintId)||sprints[sprints.length-1];
  const sprintCards=sprint?cards.filter(c=>c.sprintId===sprint.id):[];
  const done=sprintCards.filter(c=>c.laneId==="done").reduce((s,c)=>s+(c.storyPoints||0),0);
  const total=sprintCards.reduce((s,c)=>s+(c.storyPoints||0),0);
  const nextMemoir=memoir.excavationQueue?.find(q=>!q.done);

  const CardRow=({card,accent})=>{
    const ru=repoUrl(card.repo);
    return(
      <div onClick={()=>onCardClick(card)}style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",cursor:"pointer",borderBottom:"1px solid var(--b)",transition:"background 0.1s"}}
        onMouseEnter={e=>e.currentTarget.style.background="var(--s3)"}onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
        <div style={{width:3,height:28,background:accent||PC[card.priority],borderRadius:2,flexShrink:0}}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12,fontWeight:500,color:"var(--t)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{card.title}</div>
          <div style={{fontSize:10,color:"var(--t3)",display:"flex",gap:8,marginTop:2}}>
            <span>{lanes.find(l=>l.id===card.laneId)?.title}</span>
            {card.dueDate&&<span style={{color:isOverdue(card.dueDate)?"var(--red)":"var(--t3)"}}>due {card.dueDate}</span>}
            {card.storyPoints&&<span>{card.storyPoints}pt</span>}
          </div>
        </div>
        {card.labels?.slice(0,2).map(l=><Lbl key={l}text={l}/>)}
        {ru&&<a href={ru}target="_blank"rel="noopener noreferrer"onClick={e=>e.stopPropagation()}style={{fontSize:11,color:"var(--t3)",textDecoration:"none"}}title={card.repo}>↗</a>}
        <span style={{fontSize:11,fontWeight:700,color:PC[card.priority],flexShrink:0}}>{PL[card.priority]}</span>
      </div>
    );
  };

  const Section=({title,items,accent,emptyMsg})=>(
    <div style={{background:"var(--s2)",border:"1px solid var(--b)",borderRadius:8,overflow:"hidden",marginBottom:14}}>
      <div style={{padding:"8px 14px",background:"var(--s)",borderBottom:"1px solid var(--b)",display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:7,height:7,borderRadius:"50%",background:accent,flexShrink:0}}/>
        <span style={{fontSize:12,fontWeight:700,color:"var(--t)"}}>{title}</span>
        <span className="mono"style={{fontSize:11,color:"var(--t3)",marginLeft:"auto"}}>{items.length}</span>
      </div>
      {items.length===0?<div style={{padding:"16px 14px",fontSize:12,color:"var(--t3)",fontStyle:"italic"}}>{emptyMsg}</div>:items.map(c=><CardRow key={c.id}card={c}accent={accent}/>)}
    </div>
  );

  const wh = projects.map(p => ({ ...p, health: calcHealth(p) }));
  const portfolioAlerts = wh.filter(p => p.health < 40 || p.status === "Blocked").slice(0, 4);

  return (
    <div style={{flex:1,overflow:"auto",padding:20,maxWidth:900,margin:"0 auto",width:"100%"}}>
      {/* Quick capture */}
      <div style={{background:"var(--s2)",border:"1px solid var(--a)",borderRadius:8,padding:14,marginBottom:20}}>
        <div className="sl">Quick Capture → To Do</div>
        <div style={{display:"flex",gap:8,marginTop:6}}>
          <input className="inp"style={{flex:1}}placeholder="Card title…"value={quickTitle}onChange={e=>setQuickTitle(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&quickTitle.trim()){onAddCard("todo",{defaults:{priority:quickPriority,labels:[],estimate:"",description:""}},quickTitle.trim());setQuickTitle("");}}}/>
          <select className="inp"style={{width:110}}value={quickPriority}onChange={e=>setQuickPriority(+e.target.value)}>{[1,2,3,4,5].map(p=><option key={p}value={p}>P{p} {PL[p]}</option>)}</select>
          <button className="btn btn-primary"style={{flexShrink:0}}disabled={!quickTitle.trim()}onClick={()=>{if(quickTitle.trim()){onAddCard("todo",{defaults:{priority:quickPriority,labels:[],estimate:"",description:""}},quickTitle.trim());setQuickTitle("");}}} >+ Add</button>
        </div>
        <div style={{fontSize:10,color:"var(--t3)",marginTop:5}}>Press Enter to quick-save</div>
      </div>

      {/* Sprint progress */}
      {sprint&&(
        <div style={{background:"var(--s2)",border:"1px solid var(--b)",borderRadius:8,padding:14,marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <span style={{fontSize:13,fontWeight:600}}>{sprint.name}</span>
            <span className="mono"style={{fontSize:10,color:"var(--t3)"}}>{sprint.startDate} → {sprint.endDate}</span>
            <span className="mono"style={{fontSize:12,color:"var(--green)",marginLeft:"auto"}}>{done}/{total}pt</span>
          </div>
          <div className="pbar"style={{height:6}}><div className="pfill"style={{width:`${total>0?Math.round(done/total*100):0}%`,background:"var(--green)"}}/></div>
          <div style={{fontSize:10,color:"var(--t3)",marginTop:4}}>{total>0?Math.round(done/total*100):0}% complete · {sprintCards.filter(c=>c.laneId!=="done").length} cards remaining</div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
        <div style={{paddingRight:10}}>
          {overdue.length>0&&<Section title="⚠ Overdue"items={overdue}accent="var(--red)"emptyMsg="None overdue"/>}
          <Section title="📅 Due Today"items={dueToday}accent="var(--orange)"emptyMsg="Nothing due today — clear runway"/>
          <Section title="🚫 Blocked"items={blocked}accent="var(--red)"emptyMsg="Nothing blocked"/>
        </div>
        <div style={{paddingLeft:10}}>
          <Section title="🔥 Urgent / Critical"items={urgent.slice(0,6)}accent="var(--yellow)"emptyMsg="No urgent cards"/>
          {/* Memoir nudge */}
          {nextMemoir&&(
            <div style={{background:"var(--s2)",border:"1px solid #a855f733",borderRadius:8,padding:14,marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:700,color:"#a855f7",marginBottom:6}}>📖 Memoir — Next excavation</div>
              <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.5}}>{nextMemoir.text}</div>
              <div style={{fontSize:10,color:"var(--t3)",marginTop:6}}>Switch to Memoir tab to log a session</div>
            </div>
          )}
          {/* Portfolio alerts */}
          {portfolioAlerts.length > 0 && (
            <div style={{background:"var(--s2)",border:"1px solid var(--b)",borderRadius:8,overflow:"hidden",marginBottom:14}}>
              <div style={{padding:"8px 14px",background:"var(--s)",borderBottom:"1px solid var(--b)",fontSize:12,fontWeight:700,color:"var(--t)"}}>⚡ Portfolio Alerts</div>
              {portfolioAlerts.map(p=>(
                <div key={p.id}style={{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",borderBottom:"1px solid var(--b)"}}>
                  <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500,color:"var(--t)"}}>{p.name}</div><div style={{fontSize:10,color:"var(--t3)"}}>{p.status} · Health {p.health}/100</div></div>
                  <SBadge status={p.status}/>
                  <span className="mono"style={{fontSize:16,fontWeight:700,color:hc(p.health)}}>{p.health}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MEMOIR TAB ───────────────────────────────────────────────────────────────
const ARC_STATUSES={pending:"#484f58",excavation:"#388bfd","raw-notes":"#d29922",drafting:"#f0883e",revising:"#8b5cf6",complete:"#3fb950",protected:"#da3633"};

function MemoirTab({memoir,setMemoir}){
  const[newSession,setNewSession]=useState({date:new Date().toISOString().split("T")[0],arc:"arc1",phase:"Excavation",produced:"",next:""});
  const[showLog,setShowLog]=useState(false);
  const[newQItem,setNewQItem]=useState("");

  const addSession=()=>{
    if(!newSession.produced.trim())return;
    setMemoir(m=>({...m,sessions:[{id:`sess${Date.now()}`,...newSession,loggedAt:new Date().toISOString()},...m.sessions]}));
    setNewSession(s=>({...s,produced:"",next:""}));
  };
  const toggleQ=id=>setMemoir(m=>({...m,excavationQueue:m.excavationQueue.map(q=>q.id===id?{...q,done:!q.done}:q)}));
  const addQ=()=>{if(!newQItem.trim())return;setMemoir(m=>({...m,excavationQueue:[...m.excavationQueue,{id:`eq${Date.now()}`,text:newQItem.trim(),done:false}]}));setNewQItem("");};
  const setArcStatus=(id,status)=>setMemoir(m=>({...m,arcs:m.arcs.map(a=>a.id===id?{...a,status}:a)}));

  return(
    <div style={{flex:1,overflow:"auto",padding:20,maxWidth:1000,margin:"0 auto",width:"100%"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        {/* Arc tracker */}
        <div>
          <div style={{fontSize:14,fontWeight:700,color:"var(--t)",marginBottom:12}}>📖 Five Arcs</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {memoir.arcs.map(arc=>(
              <div key={arc.id}style={{background:"var(--s2)",border:"1px solid var(--b)",borderRadius:8,padding:14,borderLeft:`4px solid ${ARC_STATUSES[arc.status]||"#484f58"}`}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:6}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--t)"}}>{arc.title}</div>
                    <div style={{fontSize:11,color:"var(--t3)",marginTop:1}}>{arc.subtitle}</div>
                  </div>
                  <select value={arc.status}onChange={e=>setArcStatus(arc.id,e.target.value)}style={{background:"var(--s)",border:"1px solid var(--b)",borderRadius:5,color:"var(--t2)",fontSize:10,padding:"2px 6px",cursor:"pointer",fontFamily:"inherit"}}>
                    {Object.keys(ARC_STATUSES).map(s=><option key={s}value={s}>{s}</option>)}
                  </select>
                </div>
                {arc.notes&&<div style={{fontSize:11,color:"var(--t3)",lineHeight:1.5,borderTop:"1px solid var(--b)",paddingTop:6}}>{arc.notes}</div>}
                <div style={{marginTop:6}}>
                  <span className="arc-pill"style={{background:ARC_STATUSES[arc.status]+"22",color:ARC_STATUSES[arc.status],borderColor:ARC_STATUSES[arc.status]+"44"}}>{arc.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Voice reminders */}
          <div style={{background:"var(--s2)",border:"1px solid #a855f733",borderRadius:8,padding:14,marginTop:14}}>
            <div style={{fontSize:12,fontWeight:700,color:"#a855f7",marginBottom:8}}>Voice Reminders</div>
            {memoir.voiceReminders?.map((r,i)=>(
              <div key={i}style={{fontSize:11,color:"var(--t2)",padding:"4px 0",borderBottom:i<memoir.voiceReminders.length-1?"1px solid var(--b)":"none",lineHeight:1.5}}>→ {r}</div>
            ))}
          </div>
        </div>

        {/* Right: queue + session log */}
        <div>
          {/* Excavation queue */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:14,fontWeight:700,color:"var(--t)",marginBottom:10}}>🔍 Excavation Queue</div>
            <div style={{background:"var(--s2)",border:"1px solid var(--b)",borderRadius:8,overflow:"hidden"}}>
              {memoir.excavationQueue?.map((q,i)=>(
                <div key={q.id}style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 12px",borderBottom:i<memoir.excavationQueue.length-1?"1px solid var(--b)":"none",background:q.done?"transparent":"var(--s2)"}}>
                  <input type="checkbox"checked={q.done}onChange={()=>toggleQ(q.id)}style={{marginTop:2,cursor:"pointer",accentColor:"#3fb950",flexShrink:0}}/>
                  <span style={{fontSize:12,color:q.done?"var(--t3)":"var(--t2)",textDecoration:q.done?"line-through":"none",lineHeight:1.5}}>{q.text}</span>
                </div>
              ))}
              <div style={{padding:"8px 12px",borderTop:"1px solid var(--b)",display:"flex",gap:6}}>
                <input className="inp inp-sm"style={{flex:1}}placeholder="Add excavation prompt…"value={newQItem}onChange={e=>setNewQItem(e.target.value)}onKeyDown={e=>e.key==="Enter"&&addQ()}/>
                <button className="btn btn-primary btn-sm"onClick={addQ}>Add</button>
              </div>
            </div>
          </div>

          {/* Session log */}
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{fontSize:14,fontWeight:700,color:"var(--t)"}}>📝 Session Log</div>
              <button className="btn btn-ghost btn-sm"onClick={()=>setShowLog(v=>!v)}>
                {showLog?"Hide log":memoir.sessions?.length>0?`View ${memoir.sessions.length} sessions`:"View log"}
              </button>
            </div>
            <div style={{background:"var(--s2)",border:"1px solid var(--b)",borderRadius:8,padding:14,marginBottom:10}}>
              <div className="sl">Log a session</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8,marginTop:6}}>
                <div><div style={{fontSize:10,color:"var(--t3)",marginBottom:3}}>Date</div><input className="inp inp-sm"type="date"value={newSession.date}onChange={e=>setNewSession(s=>({...s,date:e.target.value}))}/></div>
                <div>
                  <div style={{fontSize:10,color:"var(--t3)",marginBottom:3}}>Arc</div>
                  <select className="inp inp-sm"value={newSession.arc}onChange={e=>setNewSession(s=>({...s,arc:e.target.value}))}>
                    {memoir.arcs?.map(a=><option key={a.id}value={a.id}>{a.title}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{fontSize:10,color:"var(--t3)",marginBottom:3}}>Phase</div>
                  <select className="inp inp-sm"value={newSession.phase}onChange={e=>setNewSession(s=>({...s,phase:e.target.value}))}>
                    {["Excavation","Raw notes","Drafting","Revision","Structural"].map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div style={{marginBottom:7}}><div style={{fontSize:10,color:"var(--t3)",marginBottom:3}}>What was produced</div><textarea className="inp"style={{minHeight:52}}value={newSession.produced}onChange={e=>setNewSession(s=>({...s,produced:e.target.value}))}/></div>
              <div style={{marginBottom:10}}><div style={{fontSize:10,color:"var(--t3)",marginBottom:3}}>Next session target</div><input className="inp inp-sm"value={newSession.next}onChange={e=>setNewSession(s=>({...s,next:e.target.value}))}/></div>
              <button className="btn btn-primary btn-sm"onClick={addSession}disabled={!newSession.produced.trim()}>Log Session</button>
            </div>
            {showLog&&memoir.sessions?.length>0&&(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {memoir.sessions.map(s=>(
                  <div key={s.id}style={{background:"var(--s2)",border:"1px solid var(--b)",borderRadius:7,padding:12}}>
                    <div style={{display:"flex",gap:8,marginBottom:5}}>
                      <span className="mono"style={{fontSize:10,color:"var(--t3)"}}>{s.date}</span>
                      <span className="badge"style={{background:"var(--ag)",color:"var(--a2)",border:"1px solid var(--a)44",fontSize:9}}>{s.phase}</span>
                      <span style={{fontSize:10,color:"var(--t3)"}}>{memoir.arcs?.find(a=>a.id===s.arc)?.title}</span>
                    </div>
                    <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.5,marginBottom:s.next?6:0}}>{s.produced}</div>
                    {s.next&&<div style={{fontSize:11,color:"var(--a2)"}}>→ Next: {s.next}</div>}
                  </div>
                ))}
              </div>
            )}
            {showLog&&memoir.sessions?.length===0&&<div style={{fontSize:12,color:"var(--t3)",fontStyle:"italic",padding:"8px 0"}}>No sessions logged yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PORTFOLIO TAB ────────────────────────────────────────────────────────────
function PortfolioTab({projects,setProjects}){
  const[filter,setFilter]=useState("All");
  const[editP,setEditP]=useState(null);
  const[showNew,setShowNew]=useState(false);
  const wh=projects.map(p=>({...p,health:calcHealth(p)}));
  const filtered=filter==="All"?wh:wh.filter(p=>p.status===filter);
  const criticals=wh.filter(p=>p.health<40||p.status==="Blocked").sort((a,b)=>a.health-b.health);
  const total=projects.reduce((s,p)=>s+(p.monthlyCost||0),0);
  const avgH=Math.round(wh.reduce((s,p)=>s+p.health,0)/(wh.length||1));

  const saveProject=p=>{if(!p.id)p.id=`proj-${Date.now()}`;setProjects(prev=>{const i=prev.findIndex(x=>x.id===p.id);if(i>=0){const n=[...prev];n[i]=p;return n;}return[...prev,p];});setEditP(null);setShowNew(false);};
  const deleteProject=id=>{if(window.confirm("Delete project?"))setProjects(prev=>prev.filter(p=>p.id!==id));};

  return(
    <div style={{flex:1,overflow:"auto",padding:20,maxWidth:1100,margin:"0 auto",width:"100%"}}>
      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {l:"Avg Health",v:avgH,s:hl(avgH),c:hc(avgH)},
          {l:"Projects",v:projects.length,s:`${projects.filter(p=>p.status==="Active").length} active`},
          {l:"Monthly Cost",v:`$${total}`,s:wh.filter(p=>p.platform==="Base44").length>0?"migration needed":undefined,c:wh.filter(p=>p.platform==="Base44").length>0?"var(--yellow)":undefined},
          {l:"Alerts",v:criticals.length,s:`${projects.filter(p=>p.status==="Blocked").length} blocked`,c:criticals.length>0?"var(--red)":"var(--green)"},
        ].map(s=>(
          <div key={s.l}style={{background:"var(--s2)",border:"1px solid var(--b)",borderRadius:8,padding:"12px 16px"}}>
            <div className="sl"style={{marginBottom:3}}>{s.l}</div>
            <div className="mono"style={{fontSize:22,fontWeight:600,color:s.c||"var(--t)",lineHeight:1}}>{s.v}</div>
            {s.s&&<div style={{fontSize:10,color:"var(--t3)",marginTop:3}}>{s.s}</div>}
          </div>
        ))}
      </div>

      {/* Filter + Add */}
      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
        {["All",...STATUSES].map(s=>(
          <button key={s}onClick={()=>setFilter(s)}style={{padding:"3px 12px",borderRadius:100,border:"1px solid",cursor:"pointer",fontFamily:"inherit",fontSize:11,borderColor:filter===s?"var(--a)":"var(--b2)",background:filter===s?"var(--ag)":"transparent",color:filter===s?"var(--a2)":"var(--t2)"}}>
            {s}
          </button>
        ))}
        <span className="mono"style={{fontSize:10,color:"var(--t3)",marginLeft:4}}>{filtered.length}</span>
        <div style={{flex:1}}/>
        <button className="btn btn-primary btn-sm"onClick={()=>setShowNew(true)}>+ Add Project</button>
      </div>

      {/* Table */}
      <div style={{background:"var(--s2)",border:"1px solid var(--b)",borderRadius:8,overflow:"hidden",marginBottom:20}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{borderBottom:"1px solid var(--b)"}}>
              {["Project","Status","Platform","Health","Activity","Cost/mo","",""].map(h=>(
                <th key={h}style={{padding:"8px 12px",textAlign:"left",fontSize:10,fontWeight:600,color:"var(--t3)",fontFamily:"'IBM Plex Mono'",textTransform:"uppercase",letterSpacing:"0.6px"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p,i)=>{
              const ru=repoUrl(p.repo);
              return(
                <tr key={p.id}style={{borderBottom:i<filtered.length-1?"1px solid var(--b)":"none",background:i%2===1?"rgba(255,255,255,0.01)":"transparent"}}>
                  <td style={{padding:"10px 12px",maxWidth:200}}>
                    <div style={{fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                    {p.notes&&<div style={{fontSize:10,color:"var(--t3)",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:185}}title={p.notes}>{p.notes}</div>}
                  </td>
                  <td style={{padding:"10px 12px"}}><SBadge status={p.status}/></td>
                  <td style={{padding:"10px 12px",fontSize:11,color:"var(--t2)",fontFamily:"'IBM Plex Mono'"}}>{p.platform}</td>
                  <td style={{padding:"10px 12px",minWidth:110}}><HBar score={p.health}/></td>
                  <td style={{padding:"10px 12px",fontSize:11,color:"var(--t2)",fontFamily:"'IBM Plex Mono'",whiteSpace:"nowrap"}}>{p.lastActivity||"—"}</td>
                  <td style={{padding:"10px 12px",fontSize:11,color:p.monthlyCost>0?"var(--t)":"var(--t3)",fontFamily:"'IBM Plex Mono'"}}>{p.monthlyCost>0?`$${p.monthlyCost}`:"free"}</td>
                  <td style={{padding:"10px 12px"}}>{ru&&<button className="btn btn-ghost btn-sm"onClick={()=>window.open(ru,"_blank")}style={{fontSize:10}}>↗ repo</button>}</td>
                  <td style={{padding:"10px 12px"}}>
                    <div style={{display:"flex",gap:4}}>
                      <button className="btn btn-ghost btn-sm"onClick={()=>setEditP(p)}>Edit</button>
                      <button className="btn btn-ghost btn-sm"style={{color:"var(--red)"}}onClick={()=>deleteProject(p.id)}>✕</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length===0&&<div style={{padding:32,textAlign:"center",color:"var(--t3)"}}>No projects</div>}
      </div>

      {/* Health list */}
      {criticals.length>0&&(
        <div>
          <div style={{fontSize:13,fontWeight:700,color:"var(--red)",marginBottom:10}}>⚡ Needs Attention</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {criticals.map(p=>{
              const ru=repoUrl(p.repo);
              return(
                <div key={p.id}style={{background:"var(--s2)",border:"1px solid var(--b)",borderRadius:8,padding:"12px 16px",borderLeft:`3px solid ${hc(p.health)}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontWeight:500}}>{p.name}</span><SBadge status={p.status}/>{ru&&<button className="btn btn-ghost btn-sm"style={{fontSize:10,padding:"1px 6px"}}onClick={()=>window.open(ru,"_blank")}>↗</button>}</div>
                      <HBar score={p.health}/>
                      {p.notes&&<div style={{fontSize:10,color:"var(--t3)",marginTop:5,lineHeight:1.4}}>{p.notes.slice(0,120)}{p.notes.length>120?"…":""}</div>}
                    </div>
                    <div style={{textAlign:"right",minWidth:60}}><div className="mono"style={{fontSize:20,fontWeight:700,color:hc(p.health)}}>{p.health}</div><div style={{fontSize:10,color:"var(--t3)"}}>{hl(p.health)}</div></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(editP||showNew)&&(
        <ProjectModal
          project={editP||{id:"",name:"",status:"Active",platform:"Vercel",techDebt:3,businessValue:3,monthlyCost:0,lastActivity:new Date().toISOString().split("T")[0],repo:"",notes:"",auditChecks:{hasTests:false,hasCI:false,hasDocs:false}}}
          onSave={saveProject}
          onClose={()=>{setEditP(null);setShowNew(false);}}
        />
      )}
    </div>
  );
}

// ─── EXPORT / IMPORT MODAL ────────────────────────────────────────────────────
function ExportImportModal({cards,projects,memoir,sprints,members,lanes,onImport,onClose}){
  const doExport=()=>{
    const data=JSON.stringify({version:"ops_hub_v1",exported:new Date().toISOString(),cards,projects,memoir,sprints,members,lanes},null,2);
    const b=new Blob([data]);const u=URL.createObjectURL(b);const a=document.createElement("a");
    a.href=u;a.download=`ops-hub-backup-${new Date().toISOString().split("T")[0]}.json`;a.click();
    URL.revokeObjectURL(u);
  };
  const doImport=()=>{
    const input=document.createElement("input");input.type="file";input.accept=".json";
    input.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(window.confirm(`Import "${f.name}"? This will replace all current data.`)){onImport(d);onClose();}}catch(err){alert("Invalid JSON file.");}};r.readAsText(f);};
    input.click();
  };
  return(
    <div className="modal-bg"onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal fade"style={{width:420}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <b style={{fontSize:15}}>Export / Import</b>
          <button className="btn btn-ghost btn-sm"onClick={onClose}>✕</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:"var(--s)",border:"1px solid var(--b)",borderRadius:7,padding:14}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>⬇ Export Backup</div>
            <div style={{fontSize:12,color:"var(--t2)",marginBottom:10,lineHeight:1.5}}>Downloads a JSON file with all cards, projects, memoir, sprints, and settings. Use after pulling updated source files to preserve your data.</div>
            <button className="btn btn-primary"onClick={doExport}>Export all data</button>
          </div>
          <div style={{background:"var(--s)",border:"1px solid var(--b)",borderRadius:7,padding:14}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>⬆ Import Backup</div>
            <div style={{fontSize:12,color:"var(--t2)",marginBottom:10,lineHeight:1.5}}>Replaces all current data with a backup JSON. Use to restore after a reset or to migrate to a new session.</div>
            <div style={{fontSize:10,color:"var(--red)",marginBottom:8}}>⚠ This will overwrite all current data.</div>
            <button className="btn btn-ghost"onClick={doImport}>Choose backup file…</button>
          </div>
          <div style={{background:"var(--s)",border:"1px solid var(--b)",borderRadius:7,padding:14}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>↺ Reset to Defaults</div>
            <div style={{fontSize:12,color:"var(--t2)",marginBottom:10,lineHeight:1.5}}>Clears localStorage and reloads all seed data. Export first if you want to keep your changes.</div>
            <button className="btn btn-danger"style={{background:"transparent",color:"var(--red)",border:"1px solid var(--red)33"}}onClick={()=>{if(window.confirm("Reset everything to defaults? Export first to save your data."))onImport(null);}}>Reset to defaults</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI PANEL ─────────────────────────────────────────────────────────────────
function AIPanel({analysis,loading,onReanalyze,moveCard,cards}){
  if(loading) return (
    <div style={{padding:20,textAlign:"center",color:"var(--t2)"}}>
      <div style={{fontSize:20,marginBottom:8}}>◈</div>Analyzing board…
    </div>
  );
  if(!analysis)return null;
  return(
    <div style={{fontSize:12}}>
      <div style={{background:"var(--s)",border:"1px solid var(--b)",borderRadius:7,padding:12,marginBottom:12,color:"var(--t2)",lineHeight:1.6}}>{analysis.summary}</div>
      {analysis.riskAlerts?.length>0&&analysis.riskAlerts.map((r,i)=>(
        <div key={i}style={{background:"#3a1a1a",border:"1px solid var(--red)55",borderRadius:6,padding:"7px 10px",marginBottom:6,color:"var(--orange)",fontSize:11}}>⚠ {r}</div>
      ))}
      {analysis.wipWarnings?.length>0&&<div style={{marginBottom:12}}><div className="sl">WIP Warnings</div>{analysis.wipWarnings.map((w,i)=><div key={i}style={{color:"var(--yellow)",padding:"3px 0",borderBottom:"1px solid var(--b)",fontSize:11}}>• {w}</div>)}</div>}
      {analysis.weeklyFocus?.length>0&&<div style={{marginBottom:12}}><div className="sl">This Week</div>{analysis.weeklyFocus.map((f,i)=><div key={i}style={{color:"var(--green)",padding:"3px 0",borderBottom:"1px solid var(--b)",fontSize:11}}>→ {f}</div>)}</div>}
      {analysis.suggestedMoves?.length>0&&<div style={{marginBottom:12}}>
        <div className="sl">Suggested Moves</div>
        {analysis.suggestedMoves.map((m,i)=>{
          const card=cards.find(c=>c.title.toLowerCase().includes((m.cardTitle||"").toLowerCase()));
          return(
            <div key={i}style={{background:"var(--s)",border:"1px solid var(--b)",borderRadius:6,padding:"7px 10px",marginBottom:4}}>
              <div style={{fontWeight:600,color:"var(--t)",marginBottom:2,fontSize:11}}>{m.cardTitle}</div>
              <div style={{color:"var(--t2)",fontSize:10,marginBottom:5}}>{m.from} → {m.to}: {m.reason}</div>
              {card&&<button className="btn btn-primary btn-sm"onClick={()=>moveCard(card.id,LANES.find(l=>l.title.toLowerCase()===(m.to?.toLowerCase()||""))?.id||"todo")}>Apply</button>}
            </div>
          );
        })}
      </div>}
      {analysis.bottlenecks?.length>0&&<div><div className="sl">Bottlenecks</div>{analysis.bottlenecks.map((b,i)=><div key={i}style={{color:"var(--a2)",padding:"3px 0",fontSize:11}}>◈ {b}</div>)}</div>}
    </div>
  );
}

// ─── KANBAN TAB ───────────────────────────────────────────────────────────────
function KanbanTab({cards,setCards,lanes,setLanes,members,setMembers,sprints,setSprints,activeSprintId,setActiveSprintId}){
  const[filters,setFilters]=useState({search:"",label:"",assignee:"",priority:""});
  const[dragCardId,setDragCardId]=useState(null);
  const[dragOverLane,setDragOverLane]=useState(null);
  const[editCard,setEditCard]=useState(null);
  const[templatePickerLane,setTemplatePickerLane]=useState(null);
  const[boardView,setBoardView]=useState("board");
  const[showAI,setShowAI]=useState(false);
  const[aiAnalysis,setAiAnalysis]=useState(null);
  const[aiLoading,setAiLoading]=useState(false);
  const[activeTimer,setActiveTimer]=useState(null);
  const[timerDisplay,setTimerDisplay]=useState("00:00");
  const timerRef=useRef(null);

  useEffect(()=>{
    if(activeTimer){timerRef.current=setInterval(()=>{const s=Math.floor((Date.now()-activeTimer.startTime)/1000);setTimerDisplay(`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`);},1000);}
    else{clearInterval(timerRef.current);setTimerDisplay("00:00");}
    return()=>clearInterval(timerRef.current);
  },[activeTimer]);

  const addCard=(laneId,template,titleOverride)=>{
    const d=template?.defaults||{};
    const c={id:`c${Date.now()}`,laneId,title:titleOverride||"New Card",description:d.description||"",priority:d.priority||2,labels:d.labels||[],dueDate:null,estimate:d.estimate||"",assignee:null,subtasks:[],healthScore:null,repo:"",timeLog:[],sprintId:activeSprintId,storyPoints:1,createdAt:new Date().toISOString().split("T")[0]};
    setCards(prev=>[...prev,c]);
    if(!titleOverride)setEditCard(c);
    setTemplatePickerLane(null);
    return c;
  };
  const updateCard=u=>{setCards(prev=>prev.map(c=>c.id===u.id?u:c));setEditCard(null);};
  const deleteCard=id=>{setCards(prev=>prev.filter(c=>c.id!==id));setEditCard(null);};
  const moveCard=(cardId,laneId)=>setCards(prev=>prev.map(c=>c.id===cardId?{...c,laneId}:c));
  const startTimer=cardId=>setActiveTimer({cardId,startTime:Date.now()});
  const stopTimer=cardId=>{if(!activeTimer||activeTimer.cardId!==cardId)return;const dur=Math.max(1,Math.floor((Date.now()-activeTimer.startTime)/60000));setCards(prev=>prev.map(c=>c.id===cardId?{...c,timeLog:[...(c.timeLog||[]),{date:new Date().toISOString().split("T")[0],duration:dur,note:"Tracked session"}]}:c));setActiveTimer(null);};
  const addTimeEntry=(cardId,duration,date,note)=>setCards(prev=>prev.map(c=>c.id===cardId?{...c,timeLog:[...(c.timeLog||[]),{date,duration:parseInt(duration)||0,note}]}:c));

  const filteredCards=cards.filter(c=>{
    if(filters.search&&!c.title.toLowerCase().includes(filters.search.toLowerCase()))return false;
    if(filters.label&&!c.labels?.includes(filters.label))return false;
    if(filters.assignee&&c.assignee!==filters.assignee)return false;
    if(filters.priority&&c.priority!==parseInt(filters.priority))return false;
    return true;
  });

  const runAI=async()=>{
    setAiLoading(true);setShowAI(true);
    try{
      const summary={lanes:lanes.map(l=>({lane:l.title,count:cards.filter(c=>c.laneId===l.id).length,wip:l.wipLimit})),overdue:cards.filter(c=>c.dueDate&&new Date(c.dueDate)<new Date()).map(c=>c.title),blocked:cards.filter(c=>c.laneId==="blocked").map(c=>c.title),highPriority:cards.filter(c=>c.priority>=4).map(c=>({title:c.title,lane:c.laneId}))};
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Analyze this Kanban board and return ONLY valid JSON (no markdown):\n${JSON.stringify(summary)}\n\nReturn: {"summary":"2-sentence overview","wipWarnings":[],"suggestedMoves":[{"cardTitle":"","from":"","to":"","reason":""}],"bottlenecks":[],"weeklyFocus":[],"riskAlerts":[]}`}]})});
      const data=await res.json();
      const txt=data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"{}";
      setAiAnalysis(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    }catch(err){setAiAnalysis({summary:"Analysis unavailable.",wipWarnings:[],suggestedMoves:[],bottlenecks:[],weeklyFocus:[],riskAlerts:[]});}
    setAiLoading(false);
  };

  // Burndown view
  const sprint=sprints.find(s=>s.id===activeSprintId)||sprints[0];
  const sprintCards=sprint?cards.filter(c=>c.sprintId===sprint.id):[];
  const completed=sprintCards.filter(c=>c.laneId==="done").reduce((s,c)=>s+(c.storyPoints||0),0);
  const W=480,H=180,PAD={l:36,r:16,t:8,b:28};
  const cW=W-PAD.l-PAD.r,cH=H-PAD.t-PAD.b;
  const xSc=d=>PAD.l+(d/(sprint?.burndown.length-1||1))*cW;
  const ySc=p=>PAD.t+cH-(p/(sprint?.totalPoints||1))*cH;
  const idealPath=sprint?.burndown.map((pt,i)=>`${i===0?"M":"L"}${xSc(pt.d)},${ySc(pt.i)}`).join(" ");
  const actPts=sprint?.burndown.filter(pt=>pt.a!==null)||[];
  const actualPath=actPts.map((pt,i)=>`${i===0?"M":"L"}${xSc(pt.d)},${ySc(pt.a)}`).join(" ");

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {/* Toolbar */}
      <div style={{padding:"8px 14px",borderBottom:"1px solid var(--b)",display:"flex",alignItems:"center",gap:8,flexShrink:0,flexWrap:"wrap"}}>
        <input className="inp inp-sm"placeholder="🔍 Search…"style={{width:160}}value={filters.search}onChange={e=>setFilters(f=>({...f,search:e.target.value}))}/>
        <select className="inp inp-sm"style={{width:"auto"}}value={filters.label}onChange={e=>setFilters(f=>({...f,label:e.target.value}))}><option value="">All Labels</option>{Object.keys(LC).map(l=><option key={l}>{l}</option>)}</select>
        <select className="inp inp-sm"style={{width:"auto"}}value={filters.priority}onChange={e=>setFilters(f=>({...f,priority:e.target.value}))}><option value="">All Priorities</option>{[1,2,3,4,5].map(p=><option key={p}value={p}>P{p} {PL[p]}</option>)}</select>
        <div style={{flex:1}}/>
        <select className="inp inp-sm"style={{width:"auto"}}value={activeSprintId}onChange={e=>setActiveSprintId(e.target.value)}>{sprints.map(s=><option key={s.id}value={s.id}>{s.name}</option>)}</select>
        {activeTimer&&(
          <div style={{background:"#0c2a0c",border:"1px solid var(--green)",borderRadius:6,padding:"3px 10px",fontSize:11,color:"var(--green)",fontFamily:"'IBM Plex Mono'",display:"flex",alignItems:"center",gap:6}}>
            ● {timerDisplay}
            <button className="btn btn-danger btn-sm"onClick={()=>stopTimer(activeTimer.cardId)}>Stop</button>
          </div>
        )}
        <div style={{display:"flex",border:"1px solid var(--b)",borderRadius:6,overflow:"hidden"}}>
          {[["board","⊞"],["list","☰"],["burndown","〜"]].map(([v,icon])=>(
            <button key={v}className="btn"onClick={()=>setBoardView(v)}style={{borderRadius:0,padding:"4px 9px",background:boardView===v?"var(--s3)":"transparent",color:boardView===v?"var(--t)":"var(--t2)",border:"none",fontSize:13}}>
              {icon}
            </button>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm"style={{border:`1px solid ${showAI?"var(--blue)":"var(--b)"}`,color:showAI?"var(--blue)":"var(--t2)",background:showAI?"#0d2240":"transparent"}}
          onClick={()=>{if(!aiAnalysis&&!aiLoading)runAI();else setShowAI(v=>!v);}}>◈ AI</button>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {boardView==="board"&&(
            <BoardView lanes={lanes}cards={cards}filteredCards={filteredCards}members={members}
              dragCardId={dragCardId}setDragCardId={setDragCardId}dragOverLane={dragOverLane}setDragOverLane={setDragOverLane}
              moveCard={moveCard}onCardClick={setEditCard}onAddCard={laneId=>setTemplatePickerLane(laneId)}activeTimer={activeTimer}/>
          )}
          {boardView==="list"&&(
            <div style={{flex:1,overflow:"auto",padding:"12px 16px"}}>
              <div style={{background:"var(--s2)",border:"1px solid var(--b)",borderRadius:8,overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr style={{borderBottom:"1px solid var(--b)"}}>{["Status","Title","Priority","Labels","Due","Points"].map(h=><th key={h}style={{padding:"8px 12px",textAlign:"left",fontSize:10,fontWeight:600,color:"var(--t3)",fontFamily:"'IBM Plex Mono'",textTransform:"uppercase",letterSpacing:"0.6px"}}>{h}</th>)}</tr></thead>
                  <tbody>
                    {[...filteredCards].sort((a,b)=>b.priority-a.priority).map((card,i)=>(
                      <tr key={card.id}style={{borderBottom:i<filteredCards.length-1?"1px solid var(--b)":"none",cursor:"pointer"}}
                        onMouseEnter={e=>e.currentTarget.style.background="var(--s3)"}onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                        onClick={()=>setEditCard(card)}>
                        <td style={{padding:"8px 12px"}}><span style={{fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:4,background:lanes.find(l=>l.id===card.laneId)?.color+"22",color:lanes.find(l=>l.id===card.laneId)?.color}}>{lanes.find(l=>l.id===card.laneId)?.title}</span></td>
                        <td style={{padding:"8px 12px",fontSize:12,color:"var(--t)",fontWeight:500,paddingRight:8}}>{card.title}</td>
                        <td style={{padding:"8px 12px"}}><span style={{fontSize:11,fontWeight:700,color:PC[card.priority]}}>{PL[card.priority]}</span></td>
                        <td style={{padding:"8px 12px"}}><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{card.labels?.slice(0,2).map(l=><Lbl key={l}text={l}/>)}</div></td>
                        <td style={{padding:"8px 12px",fontSize:11,color:isOverdue(card.dueDate)?"var(--red)":"var(--t2)",fontFamily:"'IBM Plex Mono'"}}>{card.dueDate||"—"}</td>
                        <td style={{padding:"8px 12px",fontSize:11,color:"var(--t2)",fontFamily:"'IBM Plex Mono'"}}>{card.storyPoints||"—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {boardView==="burndown"&&sprint&&(
            <div style={{flex:1,overflow:"auto",padding:20}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
                {[{l:"Sprint",v:sprint.name,s:`${sprint.startDate} → ${sprint.endDate}`},{l:"Total Points",v:sprint.totalPoints,s:"committed"},{l:"Completed",v:`${completed}pt`,s:`${sprint.totalPoints>0?Math.round(completed/sprint.totalPoints*100):0}% done`},{l:"Remaining",v:`${sprint.totalPoints-completed}pt`,s:sprint.totalPoints-completed<0?"ahead":"to go"}].map(st=>(
                  <div key={st.l}style={{background:"var(--s2)",border:"1px solid var(--b)",borderRadius:8,padding:"12px 14px"}}>
                    <div className="sl"style={{marginBottom:3}}>{st.l}</div>
                    <div className="mono"style={{fontSize:20,fontWeight:700,color:"var(--t)",lineHeight:1}}>{st.v}</div>
                    <div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>{st.s}</div>
                  </div>
                ))}
              </div>
              <div style={{background:"var(--s2)",border:"1px solid var(--b)",borderRadius:8,padding:"14px 0 8px",marginBottom:16}}>
                <div style={{padding:"0 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:13,fontWeight:600}}>Burndown</span>
                  <div style={{display:"flex",gap:12}}>
                    <span style={{fontSize:11,color:"var(--t3)",display:"flex",alignItems:"center",gap:4}}><span style={{display:"inline-block",width:18,height:2,background:"var(--t3)",borderRadius:1}}/> Ideal</span>
                    <span style={{fontSize:11,color:"var(--blue)",display:"flex",alignItems:"center",gap:4}}><span style={{display:"inline-block",width:18,height:2,background:"var(--blue)",borderRadius:1}}/> Actual</span>
                  </div>
                </div>
                <svg width="100%"viewBox={`0 0 ${W} ${H}`}style={{overflow:"visible"}}>
                  {[0,0.25,0.5,0.75,1].map(p=>(
                    <g key={p}><line x1={PAD.l}y1={ySc(sprint.totalPoints*p)}x2={W-PAD.r}y2={ySc(sprint.totalPoints*p)}stroke="var(--b2)"strokeWidth="1"/><text x={PAD.l-4}y={ySc(sprint.totalPoints*p)+4}fontSize="9"fill="var(--t3)"textAnchor="end">{Math.round(sprint.totalPoints*p)}</text></g>
                  ))}
                  {[0,3,6,9,12,14].map(d=><text key={d}x={xSc(d)}y={H-5}fontSize="9"fill="var(--t3)"textAnchor="middle">D{d}</text>)}
                  <path d={idealPath}fill="none"stroke="var(--t3)"strokeWidth="1.5"strokeDasharray="4,3"/>
                  {actualPath&&<path d={actualPath}fill="none"stroke="var(--blue)"strokeWidth="2.5"strokeLinecap="round"strokeLinejoin="round"/>}
                  {actPts.map(pt=><circle key={pt.d}cx={xSc(pt.d)}cy={ySc(pt.a)}r="3"fill="var(--blue)"stroke="var(--bg)"strokeWidth="1.5"/>)}
                </svg>
              </div>
            </div>
          )}
        </div>
        {showAI&&(
          <div style={{width:280,borderLeft:"1px solid var(--b)",background:"var(--s2)",overflow:"auto",padding:14,flexShrink:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{fontWeight:700,fontSize:13}}>◈ AI Analysis</span>
              <button className="btn btn-ghost btn-sm"onClick={()=>setShowAI(false)}>✕</button>
            </div>
            <AIPanel analysis={aiAnalysis}loading={aiLoading}onReanalyze={runAI}moveCard={moveCard}cards={cards}/>
            <button className="btn btn-primary"style={{width:"100%",marginTop:10}}onClick={runAI}disabled={aiLoading}>{aiLoading?"Analyzing…":"↺ Re-analyze"}</button>
          </div>
        )}
      </div>
      {templatePickerLane&&<TemplatePicker onSelect={t=>addCard(templatePickerLane,t)}onClose={()=>setTemplatePickerLane(null)}/>}
      {editCard&&<CardModal card={editCard}lanes={lanes}members={members}onSave={updateCard}onDelete={deleteCard}onClose={()=>setEditCard(null)}activeTimer={activeTimer}startTimer={startTimer}stopTimer={stopTimer}timerDisplay={timerDisplay}addTimeEntry={addTimeEntry}/>}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function OpsHub(){
  const[tab,setTab]=useState("today");
  const[cards,setCards]=useState(()=>ld(SK.cards,DEF_CARDS));
  const[lanes,setLanes]=useState(()=>ld(SK.lanes,LANES));
  const[members,setMembers]=useState(()=>ld(SK.members,DEF_MEMBERS));
  const[sprints,setSprints]=useState(()=>ld(SK.sprints,DEF_SPRINTS));
  const[projects,setProjects]=useState(()=>ld(SK.projects,DEF_PROJECTS));
  const[memoir,setMemoir]=useState(()=>ld(SK.memoir,DEF_MEMOIR));
  const[activeSprintId,setActiveSprintId]=useState("sp2");
  const[showExportImport,setShowExportImport]=useState(false);

  // Persist all state
  useEffect(()=>sv(SK.cards,cards),[cards]);
  useEffect(()=>sv(SK.lanes,lanes),[lanes]);
  useEffect(()=>sv(SK.members,members),[members]);
  useEffect(()=>sv(SK.sprints,sprints),[sprints]);
  useEffect(()=>sv(SK.projects,projects),[projects]);
  useEffect(()=>sv(SK.memoir,memoir),[memoir]);

  const doImport=data=>{
    if(data===null){
      Object.values(SK).forEach(k=>localStorage.removeItem(k));
      setCards(DEF_CARDS);setLanes(LANES);setMembers(DEF_MEMBERS);
      setSprints(DEF_SPRINTS);setProjects(DEF_PROJECTS);setMemoir(DEF_MEMOIR);
      setActiveSprintId("sp2");return;
    }
    if(data.cards)setCards(data.cards);
    if(data.lanes)setLanes(data.lanes);
    if(data.members)setMembers(data.members);
    if(data.sprints)setSprints(data.sprints);
    if(data.projects)setProjects(data.projects);
    if(data.memoir)setMemoir(data.memoir);
  };

  const quickAddCard=(laneId,template,title)=>{
    const d=template?.defaults||{};
    const c={id:`c${Date.now()}`,laneId,title:title||"New Card",description:d.description||"",priority:d.priority||2,labels:d.labels||[],dueDate:null,estimate:d.estimate||"",assignee:null,subtasks:[],healthScore:null,repo:"",timeLog:[],sprintId:activeSprintId,storyPoints:1,createdAt:new Date().toISOString().split("T")[0]};
    setCards(prev=>[...prev,c]);
    return c;
  };

  const TABS=[
    {id:"today",label:"Today",icon:"◉"},
    {id:"kanban",label:"Kanban",icon:"◈"},
    {id:"portfolio",label:"Portfolio",icon:"⬡"},
    {id:"memoir",label:"Memoir",icon:"📖"},
  ];

  const overdueCount=cards.filter(c=>c.laneId!=="done"&&isOverdue(c.dueDate)).length;
  const blockedCount=cards.filter(c=>c.laneId==="blocked").length;

  return(
    <div style={{fontFamily:"'Inter',sans-serif",background:"var(--bg)",color:"var(--t)",minHeight:"100vh",display:"flex",flexDirection:"column",fontSize:13}}>
      <style>{CSS}</style>
      {/* Header */}
      <div style={{background:"var(--s)",borderBottom:"1px solid var(--b)",padding:"0 16px",display:"flex",alignItems:"center",gap:4,flexShrink:0,height:44}}>
        <div className="mono"style={{fontWeight:700,fontSize:13,color:"var(--t)",marginRight:12}}>
          <span style={{color:"var(--a)"}}>⬡</span> OpsHub
        </div>
        {TABS.map(t=>(
          <button key={t.id}onClick={()=>setTab(t.id)}style={{padding:"0 14px",height:44,background:"transparent",color:tab===t.id?"var(--t)":"var(--t2)",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:tab===t.id?600:400,borderBottom:tab===t.id?"2px solid var(--a)":"2px solid transparent",display:"flex",alignItems:"center",gap:5,transition:"all 0.12s",position:"relative"}}>
            {t.icon} {t.label}
            {t.id==="today"&&(overdueCount>0||blockedCount>0)&&(
              <span style={{position:"absolute",top:8,right:4,background:"var(--red)",color:"#fff",fontSize:9,fontWeight:700,borderRadius:100,padding:"1px 4px",minWidth:14,textAlign:"center"}}>{overdueCount+blockedCount}</span>
            )}
          </button>
        ))}
        <div style={{flex:1}}/>
        <button className="btn btn-ghost btn-sm"onClick={()=>setShowExportImport(true)} title="Export / Import / Reset">⬡ Data</button>
      </div>

      {/* Content */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {tab==="today"&&<TodayTab cards={cards}lanes={lanes}projects={projects}memoir={memoir}onCardClick={()=>{setTab("kanban");}}onAddCard={quickAddCard}activeSprintId={activeSprintId}sprints={sprints}/>}
        {tab==="kanban"&&<KanbanTab cards={cards}setCards={setCards}lanes={lanes}setLanes={setLanes}members={members}setMembers={setMembers}sprints={sprints}setSprints={setSprints}activeSprintId={activeSprintId}setActiveSprintId={setActiveSprintId}/>}
        {tab==="portfolio"&&<PortfolioTab projects={projects}setProjects={setProjects}/>}
        {tab==="memoir"&&<MemoirTab memoir={memoir}setMemoir={setMemoir}/>}
      </div>

      {showExportImport&&<ExportImportModal cards={cards}projects={projects}memoir={memoir}sprints={sprints}members={members}lanes={lanes}onImport={doImport}onClose={()=>setShowExportImport(false)}/>}
    </div>
  );
}
