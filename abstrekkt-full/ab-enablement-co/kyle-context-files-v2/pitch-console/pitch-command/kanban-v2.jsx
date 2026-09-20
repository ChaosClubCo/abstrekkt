
// Claude Kanban Board v2 — All 5 enhancements
import { useState, useEffect, useRef } from "react";

const SK = "claude_kanban_v2";
const PC = {1:"#3fb950",2:"#d29922",3:"#f0883e",4:"#da3633",5:"#8b5cf6"};
const PL = {1:"Low",2:"Med",3:"High",4:"Crit",5:"Urgent"};
const LC = {bug:"#da3633",feature:"#388bfd","tech-debt":"#d29922",migration:"#f0883e",urgent:"#8b5cf6",security:"#ec4899",automation:"#14b8a6",client:"#10b981",internal:"#6366f1",research:"#84cc16"};

const LANES = [
  {id:"backlog",title:"Backlog",wipLimit:0,color:"#484f58"},
  {id:"todo",title:"To Do",wipLimit:5,color:"#388bfd"},
  {id:"inprogress",title:"In Progress",wipLimit:3,color:"#d29922"},
  {id:"review",title:"Review",wipLimit:3,color:"#f0883e"},
  {id:"blocked",title:"Blocked",wipLimit:0,color:"#da3633"},
  {id:"done",title:"Done",wipLimit:0,color:"#3fb950"},
];

const TEMPLATES = [
  {id:"bug",name:"Bug Report",icon:"🐛",defaults:{priority:4,labels:["bug"],estimate:"2h",description:"**Steps to reproduce:**\n1. \n\n**Expected:**\n**Actual:**"}},
  {id:"feature",name:"Feature",icon:"✨",defaults:{priority:2,labels:["feature"],estimate:"1d",description:"**User Story:**\nAs a [user], I want [feature] so that [benefit].\n\n**Acceptance Criteria:**\n- [ ] "}},
  {id:"techdebt",name:"Tech Debt",icon:"⚙️",defaults:{priority:2,labels:["tech-debt"],estimate:"4h",description:"**Problem:**\n**Solution:**\n**Impact if ignored:**"}},
  {id:"migration",name:"Migration",icon:"🚀",defaults:{priority:3,labels:["migration"],estimate:"2d",description:"**From:**\n**To:**\n**Steps:**\n1. Backup\n2. \n3. Validate\n\n**Rollback:**"}},
  {id:"security",name:"Security",icon:"🔒",defaults:{priority:4,labels:["security"],estimate:"1d",description:"**Scope:**\n- [ ] Input validation\n- [ ] Auth checks\n- [ ] RLS policies\n- [ ] Secrets scan"}},
  {id:"research",name:"Research",icon:"🔬",defaults:{priority:2,labels:["research"],estimate:"4h",description:"**Question:**\n**Timebox:**\n**Output:** Decision doc / PoC"}},
  {id:"release",name:"Release",icon:"📦",defaults:{priority:3,labels:["internal"],estimate:"2h",description:"- [ ] Tests passing\n- [ ] Changelog updated\n- [ ] Staging validated"}},
  {id:"blank",name:"Blank",icon:"📝",defaults:{priority:2,labels:[],estimate:"",description:""}},
];

const DEF_MEMBERS = [
  {id:"kyle",name:"Kyle",team:"FlashFusion",avatar:"K"},
  {id:"daniel",name:"Daniel",team:"Intinc",avatar:"D"},
  {id:"dave",name:"Dave",team:"Intinc",avatar:"Dv"},
  {id:"gwen",name:"Gwen",team:"Intinc",avatar:"G"},
  {id:"jackie",name:"Jackie",team:"Intinc",avatar:"J"},
  {id:"kelan",name:"Kelan",team:"FlashFusion",avatar:"Ke"},
  {id:"chris",name:"Chris B",team:"FlashFusion",avatar:"C"},
];

// Source of truth: PROJECT_STATE.md + userMemories + chat history as of Apr 14 2026
// Chats pulled: Apr 10 priorities, Apr 11 state sync, Apr 12 memoir search, Apr 13 full sync
const DEF_CARDS = [
  // ── IN PROGRESS ────────────────────────────────────────────────────────
  {id:"c1",laneId:"inprogress",
   title:"Demo Day April 18 — prep & gate audit",
   description:"Demo Day is April 18. **4 days out.** Sprint v1.9.9 closes April 13.\n\n**5 confirmation gates still open (per Apr 10 OI tracker):**\n- [ ] Demo environment tested end-to-end\n- [ ] 3+ discovery calls booked\n- [ ] One-pager approved for distribution\n- [ ] Anthropic partner narrative reviewed\n- [ ] E1–E4 modules reviewed for accuracy\n\nNotionDocs: Demo Day Outline, OI Tracker, Launch Materials Package",
   priority:5,labels:["urgent","client"],dueDate:"2026-04-18",estimate:"4d",assignee:"kyle",
   subtasks:[
     {id:"s1",text:"Test demo environment end-to-end",done:false},
     {id:"s2",text:"Book 3+ discovery calls",done:false},
     {id:"s3",text:"Approve one-pager for distribution",done:false},
     {id:"s4",text:"Review Anthropic partner narrative",done:false},
     {id:"s5",text:"Review E1–E4 modules for accuracy",done:false},
   ],
   healthScore:52,repo:"FlashFusionv1",timeLog:[],sprintId:"sp1",storyPoints:8,createdAt:"2026-04-10"},

  {id:"c2",laneId:"inprogress",
   title:"Fix 4 Skills Library compliance gaps — gate deploy",
   description:"**30-day definition of done: deploy to Intinc team.** 4 gaps block all deployment.\n\n**Gaps:**\n- [ ] Add 'Use when...' trigger phrases to ALL description fields (primary discovery mechanism)\n- [ ] Nest version fields under metadata\n- [ ] Remove triggers/hooks from claude.ai-targeted skills\n- [ ] Implement least-privilege allowed-tools\n\n**Fix-before-expand rule in effect.** Do not build new skills until existing 50 pass compliance.",
   priority:5,labels:["tech-debt","urgent"],dueDate:"2026-04-30",estimate:"4h",assignee:"kyle",
   subtasks:[
     {id:"s6",text:"Add 'Use when...' trigger phrases to description fields",done:false},
     {id:"s7",text:"Nest version under metadata in all skills",done:false},
     {id:"s8",text:"Remove triggers/hooks from claude.ai skills",done:false},
     {id:"s9",text:"Audit and fix allowed-tools for least privilege",done:false},
     {id:"s10",text:"Validate all 50 skills pass compliance check",done:false},
   ],
   healthScore:72,repo:"FlashFusionv1/skills-library",timeLog:[],sprintId:"sp1",storyPoints:5,createdAt:"2026-04-10"},

  {id:"c3",laneId:"inprogress",
   title:"Continuum: fix Vercel build failure (Node 24→22, PR #115)",
   description:"Production + preview both failing since Apr 10. Failing in ~700ms with zero log output — Vercel rejecting before repo clone.\n\n**Root cause candidates:**\n1. Node version: Vercel project set to 24.x, repo has .nvmrc=22. Go to Settings → Node.js Version → change to 22.x → Save → Redeploy\n2. Billing block: check vercel.com/flash-fusion/settings/billing for payment failure\n\n**Trigger:** PR #115 (Copilot privacy policy + data-retention docs)\n\n.node-version file pushed (tries 22) — didn't fix it.\n\nLast good deploy: dpl_6G5v9RpMSend3Ckh4eZJfCf4ZTL9 (PR #112, Mar 23)",
   priority:4,labels:["bug","urgent"],dueDate:"2026-04-18",estimate:"30m",assignee:"kyle",
   subtasks:[
     {id:"s11",text:"Check billing at vercel.com/flash-fusion/settings/billing",done:false},
     {id:"s12",text:"Set Node.js Version to 22.x in Vercel project settings",done:false},
     {id:"s13",text:"Redeploy and confirm green on both envs",done:false},
   ],
   healthScore:15,repo:"Krosebrook/continuum",timeLog:[],sprintId:"sp1",storyPoints:2,createdAt:"2026-04-10"},

  // ── BLOCKED ─────────────────────────────────────────────────────────────
  {id:"c4",laneId:"blocked",
   title:"Cloudflare invoice due Apr 15 — no money",
   description:"Action-required email Apr 10. Invoice due **April 15 (tomorrow)**. Non-payment = CDN downgrade, proxy rules + DNS go dark.\n\n**Kyle stated Apr 10: can't pay right now.** Infra risk active. Monitor — if paid, move to done.",
   priority:4,labels:["urgent","tech-debt"],dueDate:"2026-04-15",estimate:"10m",assignee:"kyle",
   subtasks:[
     {id:"s14",text:"Pay Cloudflare invoice",done:false},
     {id:"s15",text:"Enable auto-pay to prevent recurrence",done:false},
   ],
   healthScore:10,repo:"cloudflare/flashfusion",timeLog:[],sprintId:"sp1",storyPoints:1,createdAt:"2026-04-10"},

  {id:"c5",laneId:"blocked",
   title:"Continuum: Supabase bill overdue",
   description:"Supabase bill overdue ~2 weeks. Do NOT add Supabase-dependent features until resolved. Blocking Continuum development track entirely.",
   priority:4,labels:["tech-debt","urgent"],dueDate:null,estimate:"10m",assignee:"kyle",
   subtasks:[
     {id:"s16",text:"Pay overdue Supabase bill",done:false},
     {id:"s17",text:"Verify Continuum DB still healthy after payment",done:false},
   ],
   healthScore:20,repo:"Krosebrook/continuum",timeLog:[],sprintId:"sp1",storyPoints:1,createdAt:"2026-04-01"},

  {id:"c6",laneId:"blocked",
   title:"Wire Gmail → n8n Portfolio Command Center digest",
   description:"Portfolio Command Center workflow (JPSVa3cLtQPi8NKF) exists and is ready. Gmail credential still unconnected. Daily digest inert.",
   priority:2,labels:["automation"],dueDate:null,estimate:"30m",assignee:"kyle",
   subtasks:[
     {id:"s17b",text:"Wire Gmail credential in n8n workflow JPSVa3cLtQPi8NKF",done:false},
   ],
   healthScore:60,repo:"n8n/workflows",timeLog:[],sprintId:"sp1",storyPoints:1,createdAt:"2026-04-05"},

  // ── TO DO ────────────────────────────────────────────────────────────────
  {id:"c7",laneId:"todo",
   title:"Memoir: Story Extraction session — DO FIRST",
   description:"**187 pages exist. The fix is extracting the narrative spine, not writing a new book. That changes timeline from months to days.**\n\nUse memoir_engine.html → Chapter Map mode. Pull narrative spine from existing 187 pages.\n\nClinical backbone now loaded: 99th percentile processing speed / 12th percentile recall. That split IS the thesis in one data point.\n\n26 primary source docs digitized: handwritten journals (Michael period), poems, CBT worksheets, Soaring Bear emails, self-care mind map.\n\nSudowrite workflow established: Claude = excavation/voice audit, Sudowrite = sustained drafting. Story Bible feeds loop.",
   priority:4,labels:["research","internal"],dueDate:"2026-04-20",estimate:"3h",assignee:"kyle",
   subtasks:[
     {id:"s18",text:"Open memoir_engine.html → Chapter Map",done:false},
     {id:"s19",text:"Extract narrative spine from existing 187 pages",done:false},
     {id:"s20",text:"Run word count (est ~47K — confirm range vs 55-80K target)",done:false},
     {id:"s21",text:"Map Amen Clinic clinical data to memoir arc",done:false},
   ],
   healthScore:78,repo:"kylerosebrook/memoir",timeLog:[],sprintId:"sp1",storyPoints:3,createdAt:"2026-04-11"},

  {id:"c8",laneId:"todo",
   title:"Lee Chong Ming (Business Insider): verify stat → send pitch",
   description:"**Pitch is ALIVE — not killed.** Files treat it as send-ready pending verification. Kyle answered 'still drafting' Apr 11, consistent with files.\n\n**Blocker:** Moltbook stat unverified. One web search away — or strip the stat and send clean.\n\nConduit Books is parallel opportunity: UK press, open direct submissions, specifically seeking male literary memoir. Worth a query while Lee pitch is in flight.",
   priority:3,labels:["research","internal"],dueDate:null,estimate:"1h",assignee:"kyle",
   subtasks:[
     {id:"s22",text:"Verify Moltbook stat (or strip it)",done:false},
     {id:"s23",text:"Send Lee Chong Ming pitch",done:false},
     {id:"s24",text:"Draft Conduit Books direct query in parallel",done:false},
   ],
   healthScore:65,repo:"kylerosebrook/memoir",timeLog:[],sprintId:"sp1",storyPoints:2,createdAt:"2026-04-11"},

  {id:"c9",laneId:"todo",
   title:"Personal brand relaunch: WooCommerce + robots.txt",
   description:"Both kylerosebrook.com and flashfusion.co unindexed. Two quick fixes:\n\n1. **WooCommerce ghost cart** → WP Admin → Plugins → WooCommerce → Deactivate\n2. **robots.txt kylerosebrook.com** → WP Admin → Settings → Reading → uncheck 'Discourage search engines' → Save\n3. **robots.txt flashfusion.co** → Wix Dashboard → Settings → SEO → Robots.txt Editor → remove `Disallow: /`\n\nEstimated total: ~10 min.",
   priority:3,labels:["tech-debt"],dueDate:null,estimate:"10m",assignee:"kyle",
   subtasks:[
     {id:"s25",text:"Deactivate WooCommerce (WP Admin → Plugins)",done:false},
     {id:"s26",text:"Uncheck 'Discourage search engines' on kylerosebrook.com",done:false},
     {id:"s27",text:"Remove Disallow: / from flashfusion.co Wix robots.txt",done:false},
     {id:"s28",text:"Submit both to Google Search Console",done:false},
   ],
   healthScore:35,repo:"kylerosebrook/site",timeLog:[],sprintId:"sp1",storyPoints:1,createdAt:"2026-04-11"},

  {id:"c10",laneId:"todo",
   title:"Deploy Skills Library to Intinc team (post-compliance)",
   description:"After compliance gaps fixed: deploy 50 Phase 1+2 production skills to Daniel, Dave, Gwen, Jackie.\n\nChris Butler 5-skill suite complete. Teams-embedded migration agent in progress.",
   priority:4,labels:["client","internal"],dueDate:"2026-04-30",estimate:"2h",assignee:"kyle",
   subtasks:[
     {id:"s29",text:"All 50 skills pass compliance check",done:false},
     {id:"s30",text:"Deploy to Daniel + verify",done:false},
     {id:"s31",text:"Deploy to Dave, Gwen, Jackie",done:false},
     {id:"s32",text:"Fortnightly update to Jackie Miles",done:false},
   ],
   healthScore:70,repo:"FlashFusionv1/skills-library",timeLog:[],sprintId:"sp1",storyPoints:3,createdAt:"2026-04-10"},

  {id:"c11",laneId:"todo",
   title:"Kelan: co-founder conversation — show full inventory",
   description:"Kelan was physically present for a session. Has solemuchbetter.com (Sole Revival variant). 'Aware something is brewing but hasn't seen the full scope.'\n\nStrong operator profile: ran all sales/supply/events for Sole Revival solo, no college degree.\n\nShow: claude-code-plugins-plus (244-plugin catalog), live Sole Revival Base44 app, Sole Customizer (7-entity schema), Fusion AI (101 entities). Co-founder bridge artifact started.",
   priority:3,labels:["internal"],dueDate:null,estimate:"2h",assignee:"kyle",
   subtasks:[
     {id:"s33",text:"Demo Fusion AI (101 entities) + Sole Customizer",done:false},
     {id:"s34",text:"Show claude-code-plugins-plus 244-plugin catalog",done:false},
     {id:"s35",text:"Show live Sole Revival Base44 app",done:false},
     {id:"s36",text:"Define co-founder terms, roles, equity",done:false},
   ],
   healthScore:80,repo:"FlashFusionv1",timeLog:[],sprintId:"sp1",storyPoints:2,createdAt:"2026-04-12"},

  {id:"c12",laneId:"todo",
   title:"Wire 7 n8n OAI workflows — Base44 API auth",
   description:"7 OAI workflows inert. Need Base44 API base URL + auth token wired into HTTP Request nodes. Get token from 1Password.",
   priority:3,labels:["automation"],dueDate:null,estimate:"2h",assignee:"kyle",
   subtasks:[
     {id:"s37",text:"Pull Base44 API base URL + auth token from 1Password",done:false},
     {id:"s38",text:"Wire all 7 HTTP Request nodes",done:false},
     {id:"s39",text:"Test each workflow activation",done:false},
   ],
   healthScore:55,repo:"n8n/workflows",timeLog:[],sprintId:"sp1",storyPoints:2,createdAt:"2026-04-08"},

  {id:"c13",laneId:"todo",
   title:"GitHub PR #44: EnterpriseProfileBuilder merge check",
   description:"Phase 12 complete, bot-reviewed. Needs human merge decision. Also: PR #115 (continuum privacy docs) tied to the Vercel build failure — may need to be reverted or patched.",
   priority:2,labels:["tech-debt"],dueDate:null,estimate:"30m",assignee:"kyle",
   subtasks:[
     {id:"s40",text:"Review PR #44 EnterpriseProfileBuilder Phase 12",done:false},
     {id:"s41",text:"Merge or request changes on PR #44",done:false},
     {id:"s42",text:"Assess PR #115 (continuum) — revert or patch",done:false},
   ],
   healthScore:75,repo:"Krosebrook",timeLog:[],sprintId:"sp1",storyPoints:1,createdAt:"2026-04-10"},

  {id:"c14",laneId:"todo",
   title:"Ryan Anderskow: first free audit outreach",
   description:"Confirmed revenue path for FlashFusion audit + consulting. First free audit target. Personal contact.",
   priority:3,labels:["client"],dueDate:null,estimate:"1h",assignee:"kyle",
   subtasks:[
     {id:"s43",text:"Draft outreach message",done:false},
     {id:"s44",text:"Send and schedule discovery call",done:false},
   ],
   healthScore:85,repo:"FlashFusionv1",timeLog:[],sprintId:"sp1",storyPoints:1,createdAt:"2026-04-12"},

  // ── BACKLOG ──────────────────────────────────────────────────────────────
  {id:"c15",laneId:"backlog",
   title:"Memoir: Session 3 — Tool Archaeology (after Story Extraction)",
   description:"Chronological mapping of 240+ tools across career. Do AFTER Story Extraction session.\n\nGoal: map tools to timeline as evidence of cognitive scaffolding, not productivity flex. What got built when and why.",
   priority:3,labels:["research","internal"],dueDate:null,estimate:"3h",assignee:"kyle",
   subtasks:[
     {id:"s45",text:"Map tools by era: hospitality → QC → engineering → founding",done:false},
     {id:"s46",text:"Identify first tool that actually helped post-injury",done:false},
   ],
   healthScore:65,repo:"kylerosebrook/memoir",timeLog:[],sprintId:null,storyPoints:3,createdAt:"2026-04-01"},

  {id:"c16",laneId:"backlog",
   title:"Conduit Books direct query",
   description:"UK press. Open direct submissions specifically seeking male literary memoir. Parallel to Lee Chong Ming pitch. Flagged Apr 13 as worth querying.",
   priority:2,labels:["research"],dueDate:null,estimate:"2h",assignee:"kyle",
   subtasks:[
     {id:"s47",text:"Draft query letter for Conduit Books",done:false},
     {id:"s48",text:"Submit",done:false},
   ],
   healthScore:80,repo:"kylerosebrook/memoir",timeLog:[],sprintId:null,storyPoints:2,createdAt:"2026-04-13"},

  {id:"c17",laneId:"backlog",
   title:"Chaos Club: Legal foundation + Firebase Studio MVP",
   description:"Legal before dev (top_10_crit_steps #1). Firebase Studio MVP has full spec. Not started. PWA vs B2B/EAP direction still undecided.\n\nBase44 MVP kicked off Apr 10 — check editor status: app.base44.com/apps/69726bea1c1525bf9ac336d1/editor/preview",
   priority:3,labels:["feature","internal"],dueDate:null,estimate:"3w",assignee:"kyle",
   subtasks:[
     {id:"s49",text:"Confirm Base44 MVP status in editor",done:false},
     {id:"s50",text:"File LLC + legal risk framework",done:false},
     {id:"s51",text:"Decide: PWA micro-app vs B2B/EAP",done:false},
     {id:"s52",text:"Firebase Studio MVP build",done:false},
   ],
   healthScore:55,repo:"ChaosClubCo/app",timeLog:[],sprintId:null,storyPoints:20,createdAt:"2026-03-01"},

  {id:"c18",laneId:"backlog",
   title:"Funding: Anthropic Partner + AI Grant + NSF SBIR + IAC",
   description:"**M1-M2:** Anthropic Partner Network + AI Grant (post LLC formation)\n**M3-M6:** NSF SBIR Phase I Path B (FlashFusion) + Techstars Chicago / NSF for Chaos Club\n**M9+:** YC — deferred (Intinc employment conflict, revenue not yet established)\n\n**Illinois Arts Council:** CPG ($1K-$30K, 1:1 match) + Creative Accelerator ($10K, no match) — both eligible for memoir/creative work.\n\n**LLC is gating item for NSF + Anthropic.** FlashFusion must be registered business entity before applying.",
   priority:2,labels:["internal","research"],dueDate:null,estimate:"1w",assignee:"kyle",
   subtasks:[
     {id:"s53",text:"Form Illinois LLC (~$150, 1-2 weeks)",done:false},
     {id:"s54",text:"Anthropic Partner Network application",done:false},
     {id:"s55",text:"NSF SBIR Phase I Path B application",done:false},
     {id:"s56",text:"Illinois Arts Council CPG application (memoir)",done:false},
   ],
   healthScore:60,repo:"FlashFusionv1",timeLog:[],sprintId:null,storyPoints:8,createdAt:"2026-04-01"},

  {id:"c19",laneId:"backlog",
   title:"Reconnect platforms: n8n, Notion, Craft (auth failed)",
   description:"All three have auth failures. Blocking automation workflows and project knowledge syncs.",
   priority:2,labels:["tech-debt","automation"],dueDate:null,estimate:"1h",assignee:"kyle",
   subtasks:[
     {id:"s57",text:"Reconnect n8n",done:false},
     {id:"s58",text:"Reconnect Notion",done:false},
     {id:"s59",text:"Reconnect Craft",done:false},
   ],
   healthScore:40,repo:"n8n/workflows",timeLog:[],sprintId:null,storyPoints:1,createdAt:"2026-04-08"},

  {id:"c20",laneId:"backlog",
   title:"GoDaddy domain transfer + Google/Notion security check",
   description:"GoDaddy authorization code in inbox — domain transfer in motion.\n\nGoogle security alert: Notion Mail granted Google account access — verify intentional.",
   priority:2,labels:["security","internal"],dueDate:null,estimate:"20m",assignee:"kyle",
   subtasks:[
     {id:"s60",text:"Monitor GoDaddy domain transfer completion",done:false},
     {id:"s61",text:"Verify Google → Notion Mail access grant was intentional",done:false},
   ],
   healthScore:70,repo:"kylerosebrook/infra",timeLog:[],sprintId:null,storyPoints:1,createdAt:"2026-04-10"},

  {id:"c21",laneId:"backlog",
   title:"Kinsley's World: spec + first build",
   description:"Voice-powered educational sandbox for Kinsley (ages 8-10). Google AI Studio game template as base. Concept only — development not started. Keep separate from business work.",
   priority:2,labels:["internal"],dueDate:null,estimate:"3w",assignee:"kyle",
   subtasks:[],
   healthScore:90,repo:"ChaosClubCo/kidcreator",timeLog:[],sprintId:null,storyPoints:20,createdAt:"2026-03-01"},

  // ── DONE ─────────────────────────────────────────────────────────────────
  {id:"c22",laneId:"done",
   title:"Fusion AI: 101-entity full audit (Apr 11)",
   description:"Full Base44 audit complete April 11. Schema grew from 67 → 101 entities. Base44 confirmed as right app for flashfusion.co. Sole Customizer confirmed purpose: already-built product for The Sole Revival, 7 entities, production schema.",
   priority:4,labels:["feature","internal"],dueDate:"2026-04-11",estimate:"1d",assignee:"kyle",
   subtasks:[
     {id:"s61b",text:"Full entity audit: 67 → 101",done:true},
     {id:"s62",text:"Confirm flashfusion.co → Fusion AI mapping",done:true},
     {id:"s63",text:"Confirm Sole Customizer purpose + schema",done:true},
   ],
   healthScore:100,repo:"FlashFusionv1/fusion-ai",timeLog:[],sprintId:"sp1",storyPoints:3,createdAt:"2026-04-10"},

  {id:"c23",laneId:"done",
   title:"Memoir: 26 primary source docs digitized + clinical data loaded",
   description:"26 documents transcribed into primary-source-archive.md: handwritten journals (Michael period, 11 pages), poems ('You Bitch,' 'America'), annotated rap with timing marks, Soaring Bear emails, CBT worksheet, self-care mind map.\n\nAmen Clinic data loaded:\n- Processing speed: 99th percentile\n- Recall memory: 12th percentile\n- Resilience: 2nd percentile\n- Temporal lobe dysfunction, PFC underactivation under load\n\nThe 99/12 split is the thesis in one data point.",
   priority:3,labels:["research","internal"],dueDate:"2026-04-12",estimate:"4h",assignee:"kyle",
   subtasks:[
     {id:"s64",text:"26 primary source documents transcribed",done:true},
     {id:"s65",text:"Amen Clinic clinical data integrated",done:true},
     {id:"s66",text:"Publishing command center v2 created",done:true},
   ],
   healthScore:100,repo:"kylerosebrook/memoir",timeLog:[{date:"2026-04-12",duration:180,note:"Primary source digitization session"}],sprintId:"sp1",storyPoints:3,createdAt:"2026-04-11"},

  {id:"c24",laneId:"done",
   title:"50 Phase 1+2 Skills + Chris Butler 5-skill suite",
   description:"50 production-ready skills complete. Pipeline tooling scripts done. Architecture analysis doc complete. Chris Butler 5-skill suite complete. Teams-embedded migration agent in progress.",
   priority:4,labels:["feature","client"],dueDate:"2026-04-10",estimate:"3w",assignee:"kyle",
   subtasks:[
     {id:"s67",text:"50 Phase 1+2 skills built",done:true},
     {id:"s68",text:"Pipeline tooling scripts complete",done:true},
     {id:"s69",text:"Chris Butler 5-skill suite complete",done:true},
     {id:"s70",text:"Architecture analysis document complete",done:true},
   ],
   healthScore:100,repo:"FlashFusionv1/skills-library",timeLog:[],sprintId:"sp1",storyPoints:13,createdAt:"2026-03-15"},

  {id:"c25",laneId:"done",
   title:"O'Toole's excavation — 5 scene seeds confirmed",
   description:"All 5 real memories locked: age oscillation, relief line, late-night walk, couch permission scene, monitor reflection.",
   priority:3,labels:["research","internal"],dueDate:"2026-03-25",estimate:"2h",assignee:"kyle",
   subtasks:[
     {id:"s71",text:"Excavate O'Toole's sensory inventory",done:true},
     {id:"s72",text:"Confirm 5 scene seeds as real memory",done:true},
   ],
   healthScore:100,repo:"kylerosebrook/memoir",timeLog:[{date:"2026-03-25",duration:120,note:"Full excavation session"}],sprintId:"sp1",storyPoints:3,createdAt:"2026-03-20"},

  {id:"c26",laneId:"done",
   title:"The Prompt newsletter: Apr 10 publish (Post #135)",
   description:"Published April 10 as WordPress Post #135. Topic: 'Mythos, Disposable Software, and Software for Agents.'",
   priority:2,labels:["internal"],dueDate:"2026-04-10",estimate:"2h",assignee:"kyle",
   subtasks:[],
   healthScore:100,repo:"kylerosebrook/site",timeLog:[],sprintId:"sp1",storyPoints:2,createdAt:"2026-04-10"},
];

const DEF_SPRINTS = [
  {id:"sp1",name:"Sprint 10 — Apr 14–30",startDate:"2026-04-14",endDate:"2026-04-30",totalPoints:34,
   burndown:[
     {d:0,i:34,a:34},{d:1,i:31.7,a:33},{d:2,i:29.4,a:31},{d:3,i:27.1,a:29},
     {d:4,i:24.8,a:26},{d:5,i:22.5,a:22},{d:6,i:20.3,a:null},{d:7,i:18,a:null},
     {d:8,i:15.7,a:null},{d:9,i:13.4,a:null},{d:10,i:11.1,a:null},{d:11,i:8.9,a:null},
     {d:12,i:6.6,a:null},{d:13,i:4.3,a:null},{d:14,i:2,a:null},{d:15,i:0,a:null},
   ]},
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:#0d1117}
::-webkit-scrollbar-thumb{background:#30363d;border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:#484f58}
.btn{cursor:pointer;border:none;border-radius:6px;font-family:inherit;font-size:12px;font-weight:500;padding:6px 12px;transition:all 0.15s;display:inline-flex;align-items:center;gap:4px}
.btn:hover{filter:brightness(1.15)}
.btn-primary{background:#388bfd;color:white}
.btn-ghost{background:transparent;color:#8b949e;border:1px solid #30363d}
.btn-ghost:hover{color:#e6edf3;border-color:#484f58;background:#161b22}
.btn-danger{background:#da3633;color:white}
.btn-success{background:#238636;color:white}
.inp{background:#0d1117;border:1px solid #30363d;border-radius:6px;color:#e6edf3;font-family:inherit;font-size:13px;padding:6px 10px;outline:none;width:100%}
.inp:focus{border-color:#388bfd}
.inp-sm{padding:4px 8px;font-size:12px}
textarea.inp{resize:vertical;min-height:80px}
.tag{display:inline-flex;align-items:center;font-size:10px;font-weight:600;padding:2px 7px;border-radius:100px;text-transform:uppercase;letter-spacing:0.4px;white-space:nowrap}
.card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:10px;cursor:pointer;transition:all 0.15s;user-select:none}
.card:hover{border-color:#484f58;background:#1c2128}
.card.dragging{opacity:0.3;transform:rotate(1deg)}
.drop-target{background:#1c2128!important;border-color:#388bfd!important;border-style:dashed!important}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px}
.modal{background:#161b22;border:1px solid #30363d;border-radius:12px;padding:24px;width:680px;max-width:100%;max-height:88vh;overflow-y:auto}
.sl{font-size:10px;font-weight:700;color:#8b949e;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px}
.pbar{height:3px;background:#21262d;border-radius:2px;overflow:hidden}
.pfill{height:100%;border-radius:2px;transition:width 0.3s}
.tab-pill{padding:4px 12px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;border:none;font-family:inherit}
.swimlane-header{padding:8px 12px;background:#0d1117;border:1px solid #21262d;border-radius:6px;margin-bottom:8px;font-size:12px;font-weight:600;color:#8b949e;display:flex;align-items:center;gap:8px}
.wip-warning{background:#3d1c1c;border-color:#da3633!important}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────

const fmt = (min) => min >= 60 ? `${Math.floor(min/60)}h${min%60?` ${min%60}m`:""}` : `${min}m`;
const isOverdue = (d) => d && new Date(d) < new Date();
const totalTime = (card) => (card.timeLog||[]).reduce((s,e)=>s+e.duration,0);
const getMember = (members, id) => members.find(m=>m.id===id);

function Lbl({text}) {
  const c = LC[text] || "#8b949e";
  return <span className="tag" style={{background:c+"22",color:c,border:`1px solid ${c}44`}}>{text}</span>;
}

function Ava({name,size=22}) {
  const c = ["#388bfd","#3fb950","#d29922","#f0883e","#8b5cf6"][name?.charCodeAt(0)%5||0];
  return <div style={{width:size,height:size,borderRadius:"50%",background:c+"33",border:`1px solid ${c}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.45,fontWeight:700,color:c,flexShrink:0,fontFamily:"'JetBrains Mono'"}}>{name?.[0]?.toUpperCase()||"?"}</div>;
}

// ─── Card Item ─────────────────────────────────────────────────────────────

function CardItem({card,members,onClick,onDragStart,onDragEnd,activeTimer,isDragging}) {
  const tt = totalTime(card);
  const done = card.subtasks?.filter(s=>s.done).length||0;
  const total = card.subtasks?.length||0;
  const isTimerActive = activeTimer?.cardId === card.id;
  const overdue = isOverdue(card.dueDate);
  return (
    <div className={`card${isDragging?" dragging":""}`}
      style={{borderLeft:`3px solid ${PC[card.priority]}`,marginBottom:6}}
      draggable onClick={()=>onClick(card)}
      onDragStart={(e)=>{e.dataTransfer.effectAllowed="move";onDragStart(card.id);}}
      onDragEnd={onDragEnd}>
      <div style={{fontSize:13,fontWeight:500,color:"#e6edf3",lineHeight:1.4,marginBottom:6}}>{card.title}</div>
      {card.labels.length>0&&<div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:6}}>{card.labels.map(l=><Lbl key={l} text={l}/>)}</div>}
      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
        {card.assignee && <Ava name={getMember(members,card.assignee)?.name||card.assignee} size={18}/>}
        {card.dueDate&&<span style={{fontSize:10,color:overdue?"#da3633":"#8b949e",fontFamily:"'JetBrains Mono'"}}>
          {overdue?"⚠":"📅"} {card.dueDate}</span>}
        {total>0&&<span style={{fontSize:10,color:done===total?"#3fb950":"#8b949e",fontFamily:"'JetBrains Mono'"}}>{done}/{total}</span>}
        {tt>0&&<span style={{fontSize:10,color:"#14b8a6",fontFamily:"'JetBrains Mono'"}}>⏱{fmt(tt)}</span>}
        {isTimerActive&&<span style={{fontSize:10,color:"#3fb950",fontFamily:"'JetBrains Mono'",animation:"pulse 1s infinite"}}>● REC</span>}
        {card.storyPoints&&<span style={{fontSize:10,color:"#8b949e",marginLeft:"auto",fontFamily:"'JetBrains Mono'"}}>{card.storyPoints}pt</span>}
      </div>
    </div>
  );
}

// ─── Lane ──────────────────────────────────────────────────────────────────

function Lane({lane,cards,members,onAddCard,onCardClick,onDragOver,onDrop,onDragLeave,isOver,isWipOver,activeTimer,dragCardId}) {
  return (
    <div style={{width:240,flexShrink:0,display:"flex",flexDirection:"column",maxHeight:"calc(100vh - 200px)"}}>
      <div style={{padding:"8px 10px",borderRadius:"8px 8px 0 0",background:"#161b22",border:`1px solid ${isWipOver?"#da3633":"#30363d"}`,borderBottom:"none",display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:lane.color,flexShrink:0}}/>
        <span style={{fontSize:12,fontWeight:600,color:"#e6edf3",flex:1}}>{lane.title}</span>
        <span style={{fontSize:11,fontFamily:"'JetBrains Mono'",color:isWipOver?"#da3633":"#8b949e"}}>
          {cards.length}{lane.wipLimit>0?`/${lane.wipLimit}`:""}
        </span>
        <button className="btn" style={{padding:"1px 6px",fontSize:14,background:"transparent",color:"#8b949e",border:"none"}}
          onClick={()=>onAddCard(lane.id)}>+</button>
      </div>
      <div className={`${isOver?"drop-target":""}`}
        style={{flex:1,overflowY:"auto",padding:8,background:"#0d1117",border:`1px solid ${isOver?"#388bfd":isWipOver?"#da3633":"#30363d"}`,borderTop:"none",borderRadius:"0 0 8px 8px",minHeight:80}}
        onDragOver={(e)=>{e.preventDefault();onDragOver(lane.id);}}
        onDrop={(e)=>{e.preventDefault();onDrop(lane.id);}}
        onDragLeave={onDragLeave}>
        {cards.map(card=>(
          <CardItem key={card.id} card={card} members={members}
            onClick={onCardClick} activeTimer={activeTimer}
            isDragging={dragCardId===card.id}
            onDragStart={(id)=>{}} onDragEnd={()=>{}}
          />
        ))}
        {cards.length===0&&<div style={{textAlign:"center",color:"#484f58",fontSize:11,padding:"20px 0"}}>Drop here</div>}
      </div>
    </div>
  );
}

// ─── Board View ────────────────────────────────────────────────────────────

function BoardView({lanes,cards,members,swimlaneGroup,groups,getCards,dragCardId,setDragCardId,dragOverLane,setDragOverLane,moveCard,onCardClick,onAddCard,activeTimer}) {
  const handleDragStart = (cardId) => setDragCardId(cardId);
  const handleDrop = (laneId) => { if(dragCardId) moveCard(dragCardId,laneId); setDragCardId(null); setDragOverLane(null); };
  const getLaneCount = (laneId) => cards.filter(c=>c.laneId===laneId).length;
  const isWipOver = (lane) => lane.wipLimit>0 && getLaneCount(lane.id)>lane.wipLimit;

  return (
    <div style={{flex:1,overflow:"auto",padding:"12px 16px"}}>
      {groups.map(group=>(
        <div key={group.id} style={{marginBottom:group.name?24:0}}>
          {group.name&&(
            <div className="swimlane-header">
              <span style={{color:"#388bfd"}}>◈</span>
              <span>{group.name}</span>
              <span style={{marginLeft:"auto",fontFamily:"'JetBrains Mono'",fontSize:11}}>
                {lanes.reduce((s,l)=>s+getCards(group.id,l.id).length,0)} cards
              </span>
            </div>
          )}
          <div style={{display:"flex",gap:10,minWidth:"max-content"}}>
            {lanes.map(lane=>{
              const laneCards = getCards(group.id, lane.id);
              // We need to override the card onClick with drag events in context
              return (
                <div key={lane.id} style={{width:240,flexShrink:0,display:"flex",flexDirection:"column"}}>
                  <div style={{padding:"8px 10px",borderRadius:"8px 8px 0 0",background:"#161b22",border:`1px solid ${isWipOver(lane)?"#da3633":"#30363d"}`,borderBottom:"none",display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:lane.color,flexShrink:0}}/>
                    <span style={{fontSize:12,fontWeight:600,color:"#e6edf3",flex:1}}>{lane.title}</span>
                    <span style={{fontSize:11,fontFamily:"'JetBrains Mono'",color:isWipOver(lane)?"#da3633":"#8b949e"}}>
                      {getLaneCount(lane.id)}{lane.wipLimit>0?`/${lane.wipLimit}`:""}
                    </span>
                    <button className="btn" style={{padding:"0px 5px",fontSize:14,background:"transparent",color:"#484f58",border:"none"}} onClick={()=>onAddCard(lane.id)}>+</button>
                  </div>
                  <div style={{flex:1,overflowY:"auto",padding:8,background:"#0d1117",border:`1px solid ${dragOverLane===lane.id?"#388bfd":isWipOver(lane)?"#da3633":"#21262d"}`,borderTop:"none",borderRadius:"0 0 8px 8px",minHeight:100,transition:"border-color 0.1s"}}
                    onDragOver={(e)=>{e.preventDefault();setDragOverLane(lane.id);}}
                    onDrop={()=>handleDrop(lane.id)}
                    onDragLeave={()=>setDragOverLane(null)}>
                    {laneCards.map(card=>(
                      <div key={card.id} className={`card${dragCardId===card.id?" dragging":""}`}
                        style={{borderLeft:`3px solid ${PC[card.priority]}`,marginBottom:6}}
                        draggable
                        onClick={()=>onCardClick(card)}
                        onDragStart={(e)=>{e.dataTransfer.effectAllowed="move";handleDragStart(card.id);}}
                        onDragEnd={()=>{setDragCardId(null);setDragOverLane(null);}}>
                        <div style={{fontSize:12,fontWeight:500,color:"#e6edf3",lineHeight:1.4,marginBottom:5}}>{card.title}</div>
                        {card.labels.length>0&&<div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:5}}>{card.labels.map(l=><Lbl key={l} text={l}/>)}</div>}
                        <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                          {card.assignee&&<Ava name={getMember(members,card.assignee)?.name||card.assignee} size={16}/>}
                          {card.dueDate&&<span style={{fontSize:10,color:isOverdue(card.dueDate)?"#da3633":"#484f58",fontFamily:"'JetBrains Mono'"}}>{card.dueDate}</span>}
                          {(card.subtasks||[]).length>0&&<span style={{fontSize:10,color:"#484f58",fontFamily:"'JetBrains Mono'"}}>{card.subtasks.filter(s=>s.done).length}/{card.subtasks.length}</span>}
                          {totalTime(card)>0&&<span style={{fontSize:10,color:"#14b8a6",fontFamily:"'JetBrains Mono'"}}>⏱{fmt(totalTime(card))}</span>}
                          {activeTimer?.cardId===card.id&&<span style={{fontSize:10,color:"#3fb950",fontFamily:"'JetBrains Mono'"}}>●REC</span>}
                          {card.storyPoints&&<span style={{fontSize:10,color:"#484f58",marginLeft:"auto",fontFamily:"'JetBrains Mono'"}}>{card.storyPoints}pt</span>}
                        </div>
                      </div>
                    ))}
                    {laneCards.length===0&&<div style={{textAlign:"center",color:"#30363d",fontSize:11,padding:"16px 0",fontStyle:"italic"}}>Drop here</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── List View ─────────────────────────────────────────────────────────────

function ListView({cards,lanes,members,onCardClick}) {
  const [sortBy,setSortBy] = useState("priority");
  const sorted = [...cards].sort((a,b)=>{
    if(sortBy==="priority") return b.priority-a.priority;
    if(sortBy==="due") return (a.dueDate||"9")>(b.dueDate||"9")?1:-1;
    if(sortBy==="health") return (b.healthScore||0)-(a.healthScore||0);
    return 0;
  });
  const cols = ["Status","Title","Priority","Labels","Assignee","Due","Time","Points"];
  return (
    <div style={{flex:1,overflow:"auto",padding:"12px 16px"}}>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        {["priority","due","health"].map(s=>(
          <button key={s} className="btn btn-ghost" style={{padding:"4px 10px",background:sortBy===s?"#21262d":"transparent",color:sortBy===s?"#e6edf3":"#8b949e"}} onClick={()=>setSortBy(s)}>Sort: {s}</button>
        ))}
      </div>
      <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:8,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"120px 1fr 80px 150px 80px 100px 70px 60px",gap:0,background:"#0d1117",borderBottom:"1px solid #30363d",padding:"8px 12px"}}>
          {cols.map(c=><div key={c} style={{fontSize:11,color:"#8b949e",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.6px"}}>{c}</div>)}
        </div>
        {sorted.map((card,i)=>(
          <div key={card.id} style={{display:"grid",gridTemplateColumns:"120px 1fr 80px 150px 80px 100px 70px 60px",gap:0,padding:"9px 12px",borderBottom:i<sorted.length-1?"1px solid #21262d":"none",cursor:"pointer",transition:"background 0.1s"}}
            onMouseEnter={e=>e.currentTarget.style.background="#1c2128"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            onClick={()=>onCardClick(card)}>
            <div><span style={{fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:4,background:lanes.find(l=>l.id===card.laneId)?.color+"22",color:lanes.find(l=>l.id===card.laneId)?.color}}>{lanes.find(l=>l.id===card.laneId)?.title||card.laneId}</span></div>
            <div style={{fontSize:12,color:"#e6edf3",fontWeight:500,paddingRight:8}}>{card.title}</div>
            <div><span style={{fontSize:11,fontWeight:700,color:PC[card.priority]}}>{PL[card.priority]}</span></div>
            <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{card.labels.slice(0,2).map(l=><Lbl key={l} text={l}/>)}</div>
            <div>{card.assignee&&<Ava name={getMember(members,card.assignee)?.name||""} size={20}/>}</div>
            <div style={{fontSize:11,color:isOverdue(card.dueDate)?"#da3633":"#8b949e",fontFamily:"'JetBrains Mono'"}}>{card.dueDate||"—"}</div>
            <div style={{fontSize:11,color:"#14b8a6",fontFamily:"'JetBrains Mono'"}}>{totalTime(card)>0?fmt(totalTime(card)):"—"}</div>
            <div style={{fontSize:11,color:"#8b949e",fontFamily:"'JetBrains Mono'"}}>{card.storyPoints||"—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Burndown View ─────────────────────────────────────────────────────────

function BurndownView({sprints,activeSprint,setActiveSprint,setSprints,cards}) {
  const sprint = sprints.find(s=>s.id===activeSprint)||sprints[0];
  const [editing,setEditing] = useState(false);
  const [form,setForm] = useState({name:sprint.name,startDate:sprint.startDate,endDate:sprint.endDate,totalPoints:sprint.totalPoints});

  const sprintCards = cards.filter(c=>c.sprintId===sprint.id);
  const completed = sprintCards.filter(c=>c.laneId==="done").reduce((s,c)=>s+(c.storyPoints||0),0);
  const remaining = sprintCards.reduce((s,c)=>s+(c.storyPoints||0),0) - completed;

  // SVG chart
  const W=520,H=200,PAD={l:40,r:20,t:10,b:30};
  const chartW = W-PAD.l-PAD.r, chartH = H-PAD.t-PAD.b;
  const maxDay = sprint.burndown.length-1;
  const maxPts = sprint.totalPoints;
  const xScale = (d) => PAD.l + (d/maxDay)*chartW;
  const yScale = (p) => PAD.t + chartH - (p/maxPts)*chartH;

  const idealPath = sprint.burndown.map((pt,i)=>`${i===0?"M":"L"}${xScale(pt.d)},${yScale(pt.i)}`).join(" ");
  const actualPoints = sprint.burndown.filter(pt=>pt.a!==null);
  const actualPath = actualPoints.map((pt,i)=>`${i===0?"M":"L"}${xScale(pt.d)},${yScale(pt.a)}`).join(" ");

  return (
    <div style={{flex:1,overflow:"auto",padding:20}}>
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        {sprints.map(s=>(
          <button key={s.id} className="btn btn-ghost" style={{background:activeSprint===s.id?"#21262d":"transparent",color:activeSprint===s.id?"#388bfd":"#8b949e",borderColor:activeSprint===s.id?"#388bfd":"#30363d"}} onClick={()=>setActiveSprint(s.id)}>{s.name}</button>
        ))}
        <button className="btn btn-ghost" style={{marginLeft:"auto"}} onClick={()=>setSprints(prev=>[...prev,{id:`sp${Date.now()}`,name:`Sprint ${prev.length+9}`,startDate:"",endDate:"",totalPoints:40,burndown:[{d:0,i:40,a:40}]}])}>+ New Sprint</button>
      </div>

      {/* Sprint stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {label:"Sprint",value:sprint.name,sub:`${sprint.startDate} → ${sprint.endDate}`},
          {label:"Total Points",value:sprint.totalPoints,sub:"committed"},
          {label:"Completed",value:completed+"pt",sub:`${sprint.totalPoints>0?Math.round(completed/sprint.totalPoints*100):0}% done`},
          {label:"Remaining",value:remaining+"pt",sub:remaining<0?"ahead of target":"to go"},
        ].map(stat=>(
          <div key={stat.label} style={{background:"#161b22",border:"1px solid #30363d",borderRadius:8,padding:"12px 16px"}}>
            <div style={{fontSize:10,color:"#8b949e",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.6px",marginBottom:4}}>{stat.label}</div>
            <div style={{fontSize:22,fontWeight:700,color:"#e6edf3",fontFamily:"'JetBrains Mono'"}}>{stat.value}</div>
            <div style={{fontSize:11,color:"#484f58",marginTop:2}}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:"16px 0 8px",marginBottom:16}}>
        <div style={{padding:"0 16px",marginBottom:12,display:"flex",alignItems:"center",gap:16}}>
          <span style={{fontSize:13,fontWeight:600,color:"#e6edf3"}}>Burndown Chart</span>
          <div style={{display:"flex",gap:12}}>
            <span style={{fontSize:11,color:"#484f58",display:"flex",alignItems:"center",gap:4}}><span style={{display:"inline-block",width:20,height:2,background:"#484f58",borderRadius:1}}/> Ideal</span>
            <span style={{fontSize:11,color:"#388bfd",display:"flex",alignItems:"center",gap:4}}><span style={{display:"inline-block",width:20,height:2,background:"#388bfd",borderRadius:1}}/> Actual</span>
          </div>
        </div>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible"}}>
          {/* Grid lines */}
          {[0,0.25,0.5,0.75,1].map(p=>(
            <g key={p}>
              <line x1={PAD.l} y1={yScale(maxPts*p)} x2={W-PAD.r} y2={yScale(maxPts*p)} stroke="#21262d" strokeWidth="1"/>
              <text x={PAD.l-6} y={yScale(maxPts*p)+4} fontSize="9" fill="#484f58" textAnchor="end">{Math.round(maxPts*p)}</text>
            </g>
          ))}
          {/* X axis labels */}
          {[0,3,6,9,12,14].map(d=>(
            <text key={d} x={xScale(d)} y={H-5} fontSize="9" fill="#484f58" textAnchor="middle">D{d}</text>
          ))}
          {/* Ideal line */}
          <path d={idealPath} fill="none" stroke="#484f58" strokeWidth="1.5" strokeDasharray="4,3"/>
          {/* Actual line */}
          {actualPath&&<path d={actualPath} fill="none" stroke="#388bfd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>}
          {/* Actual dots */}
          {actualPoints.map(pt=>(
            <circle key={pt.d} cx={xScale(pt.d)} cy={yScale(pt.a)} r="3.5" fill="#388bfd" stroke="#0d1117" strokeWidth="1.5"/>
          ))}
        </svg>
      </div>

      {/* Sprint cards list */}
      <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:8,overflow:"hidden"}}>
        <div style={{padding:"10px 14px",borderBottom:"1px solid #21262d",fontSize:12,fontWeight:600,color:"#8b949e"}}>Cards in Sprint ({sprintCards.length})</div>
        {sprintCards.length===0?<div style={{padding:20,textAlign:"center",color:"#484f58",fontSize:12}}>No cards in this sprint</div>:(
          sprintCards.map((card,i)=>(
            <div key={card.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",borderBottom:i<sprintCards.length-1?"1px solid #21262d":"none"}}>
              <span style={{width:3,height:32,background:PC[card.priority],borderRadius:2,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:"#e6edf3",fontWeight:500}}>{card.title}</div>
                <div style={{fontSize:10,color:"#484f58"}}>{card.labels.join(", ")}</div>
              </div>
              <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:4,background:LANES.find(l=>l.id===card.laneId)?.color+"22",color:LANES.find(l=>l.id===card.laneId)?.color,fontFamily:"'JetBrains Mono'"}}>{LANES.find(l=>l.id===card.laneId)?.title||card.laneId}</span>
              <span style={{fontSize:11,fontWeight:600,color:"#8b949e",fontFamily:"'JetBrains Mono'",width:30,textAlign:"right"}}>{card.storyPoints||0}pt</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Template Picker ────────────────────────────────────────────────────────

function TemplatePicker({onSelect,onClose}) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:12,padding:24,width:480,maxWidth:"95vw"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontSize:15,fontWeight:700,color:"#e6edf3"}}>Choose a Template</div>
          <button className="btn btn-ghost" style={{padding:"3px 8px"}} onClick={onClose}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {TEMPLATES.map(t=>(
            <button key={t.id} className="btn btn-ghost" style={{padding:"12px 14px",textAlign:"left",height:"auto",flexDirection:"column",alignItems:"flex-start",gap:4}}
              onClick={()=>onSelect(t)}>
              <div style={{fontSize:18}}>{t.icon}</div>
              <div style={{fontSize:12,fontWeight:600,color:"#e6edf3"}}>{t.name}</div>
              <div style={{fontSize:10,color:"#8b949e"}}>{t.defaults.labels.join(", ")||"No labels"} · {t.defaults.estimate||"No estimate"}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Card Modal ────────────────────────────────────────────────────────────

function CardModal({card,lanes,members,onSave,onDelete,onClose,activeTimer,startTimer,stopTimer,timerDisplay,addTimeEntry}) {
  const [form,setForm] = useState(card);
  const [tab,setTab] = useState("details");
  const [newSub,setNewSub] = useState("");
  const [timeForm,setTimeForm] = useState({duration:"",date:new Date().toISOString().split("T")[0],note:""});
  const isTimerActive = activeTimer?.cardId===card.id;
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const toggleLabel = (l) => {
    const ls = form.labels.includes(l) ? form.labels.filter(x=>x!==l) : [...form.labels,l];
    set("labels",ls);
  };
  const addSubtask = () => {
    if(!newSub.trim()) return;
    set("subtasks",[...(form.subtasks||[]),{id:`s${Date.now()}`,text:newSub.trim(),done:false}]);
    setNewSub("");
  };
  const toggleSubtask = (id) => set("subtasks",form.subtasks.map(s=>s.id===id?{...s,done:!s.done}:s));
  const removeSubtask = (id) => set("subtasks",form.subtasks.filter(s=>s.id!==id));
  const handleAddTime = () => {
    if(!timeForm.duration) return;
    const entry = {date:timeForm.date,duration:parseInt(timeForm.duration)||0,note:timeForm.note};
    addTimeEntry(card.id, timeForm.duration, timeForm.date, timeForm.note);
    setForm(f=>({...f, timeLog:[...(f.timeLog||[]), entry]}));
    setTimeForm({duration:"",date:new Date().toISOString().split("T")[0],note:""});
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16}}>
          <div style={{width:4,height:36,background:PC[form.priority],borderRadius:2,flexShrink:0,marginTop:2}}/>
          <input className="inp" style={{flex:1,fontSize:15,fontWeight:600,background:"transparent",border:"none",padding:"4px 0",borderRadius:0,borderBottom:"1px solid #30363d"}}
            value={form.title} onChange={e=>set("title",e.target.value)}/>
          <button className="btn btn-ghost" style={{padding:"4px 8px",flexShrink:0}} onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,marginBottom:16,borderBottom:"1px solid #21262d",paddingBottom:0}}>
          {[["details","Details"],["time","⏱ Time"],["subtasks","Subtasks"]].map(([id,label])=>(
            <button key={id} className="tab-pill" onClick={()=>setTab(id)}
              style={{background:tab===id?"#21262d":"transparent",color:tab===id?"#e6edf3":"#8b949e",border:"none",borderBottom:tab===id?"2px solid #388bfd":"2px solid transparent",borderRadius:"4px 4px 0 0"}}>
              {label}{id==="subtasks"&&form.subtasks?.length>0?` (${form.subtasks.length})`:""}{id==="time"&&totalTime(form)>0?` ${fmt(totalTime(form))}`:""}
            </button>
          ))}
        </div>

        {tab==="details"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div>
              <div className="sl">Lane</div>
              <select className="inp" value={form.laneId} onChange={e=>set("laneId",e.target.value)}>
                {lanes.map(l=><option key={l.id} value={l.id}>{l.title}</option>)}
              </select>
            </div>
            <div>
              <div className="sl">Priority</div>
              <select className="inp" value={form.priority} onChange={e=>set("priority",parseInt(e.target.value))}>
                {[1,2,3,4,5].map(p=><option key={p} value={p}>P{p} — {PL[p]}</option>)}
              </select>
            </div>
            <div>
              <div className="sl">Assignee</div>
              <select className="inp" value={form.assignee||""} onChange={e=>set("assignee",e.target.value||null)}>
                <option value="">Unassigned</option>
                {members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <div className="sl">Due Date</div>
              <input className="inp" type="date" value={form.dueDate||""} onChange={e=>set("dueDate",e.target.value||null)}/>
            </div>
            <div>
              <div className="sl">Estimate</div>
              <input className="inp" placeholder="2h, 1d, 1w..." value={form.estimate||""} onChange={e=>set("estimate",e.target.value)}/>
            </div>
            <div>
              <div className="sl">Story Points</div>
              <input className="inp" type="number" min="1" max="100" value={form.storyPoints||1} onChange={e=>set("storyPoints",parseInt(e.target.value)||1)}/>
            </div>
            <div style={{gridColumn:"span 2"}}>
              <div className="sl">Description</div>
              <textarea className="inp" style={{minHeight:100}} value={form.description||""} onChange={e=>set("description",e.target.value)}/>
            </div>
            <div style={{gridColumn:"span 2"}}>
              <div className="sl">Labels</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {Object.keys(LC).map(l=>{
                  const active = form.labels.includes(l);
                  return <button key={l} className="tag" style={{cursor:"pointer",background:active?LC[l]+"33":LC[l]+"11",color:LC[l],border:`1px solid ${LC[l]}${active?"":"33"}`,opacity:active?1:0.6}} onClick={()=>toggleLabel(l)}>{l}</button>;
                })}
              </div>
            </div>
            <div>
              <div className="sl">Repo</div>
              <input className="inp" placeholder="org/repo" value={form.repo||""} onChange={e=>set("repo",e.target.value)}/>
            </div>
            <div>
              <div className="sl">Health Score</div>
              <input className="inp" type="number" min="0" max="100" value={form.healthScore||""} onChange={e=>set("healthScore",parseInt(e.target.value)||null)} placeholder="0-100"/>
            </div>
          </div>
        )}

        {tab==="time"&&(
          <div>
            {/* Timer */}
            <div style={{background:"#0d1117",border:"1px solid #30363d",borderRadius:8,padding:16,marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontFamily:"'JetBrains Mono'",fontSize:28,fontWeight:700,color:isTimerActive?"#3fb950":"#e6edf3",flex:1}}>{isTimerActive?timerDisplay:"00:00"}</div>
              {isTimerActive?(
                <button className="btn btn-danger" onClick={()=>stopTimer(card.id,"Session")}>⏹ Stop & Log</button>
              ):(
                <button className="btn btn-success" onClick={()=>startTimer(card.id)}>▶ Start Timer</button>
              )}
            </div>

            {/* Manual entry */}
            <div style={{background:"#0d1117",border:"1px solid #30363d",borderRadius:8,padding:14,marginBottom:16}}>
              <div className="sl" style={{marginBottom:10}}>Log Time Manually</div>
              <div style={{display:"grid",gridTemplateColumns:"80px 1fr 1fr auto",gap:8,alignItems:"end"}}>
                <div>
                  <div style={{fontSize:10,color:"#484f58",marginBottom:4}}>Minutes</div>
                  <input className="inp inp-sm" type="number" min="1" placeholder="60" value={timeForm.duration} onChange={e=>setTimeForm(f=>({...f,duration:e.target.value}))}/>
                </div>
                <div>
                  <div style={{fontSize:10,color:"#484f58",marginBottom:4}}>Date</div>
                  <input className="inp inp-sm" type="date" value={timeForm.date} onChange={e=>setTimeForm(f=>({...f,date:e.target.value}))}/>
                </div>
                <div>
                  <div style={{fontSize:10,color:"#484f58",marginBottom:4}}>Note</div>
                  <input className="inp inp-sm" placeholder="What were you doing?" value={timeForm.note} onChange={e=>setTimeForm(f=>({...f,note:e.target.value}))}/>
                </div>
                <button className="btn btn-primary" style={{padding:"5px 12px"}} onClick={handleAddTime}>Add</button>
              </div>
            </div>

            {/* Log */}
            {(form.timeLog||[]).length===0?(
              <div style={{textAlign:"center",color:"#484f58",padding:24,fontSize:12}}>No time logged yet</div>
            ):(
              <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:8,overflow:"hidden"}}>
                <div style={{padding:"8px 12px",background:"#0d1117",borderBottom:"1px solid #21262d",display:"flex",justifyContent:"space-between",fontSize:11,color:"#8b949e",fontWeight:600}}>
                  <span>Time Log</span>
                  <span style={{fontFamily:"'JetBrains Mono'",color:"#14b8a6"}}>Total: {fmt(totalTime(form))}</span>
                </div>
                {(form.timeLog||[]).map((entry,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderBottom:i<form.timeLog.length-1?"1px solid #21262d":"none"}}>
                    <span style={{fontSize:11,fontFamily:"'JetBrains Mono'",color:"#8b949e",width:90}}>{entry.date}</span>
                    <span style={{fontSize:12,fontWeight:600,color:"#14b8a6",fontFamily:"'JetBrains Mono'",width:40}}>{fmt(entry.duration)}</span>
                    <span style={{fontSize:12,color:"#8b949e",flex:1}}>{entry.note||"—"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab==="subtasks"&&(
          <div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <input className="inp" placeholder="Add subtask..." value={newSub} onChange={e=>setNewSub(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addSubtask()}/>
              <button className="btn btn-primary" style={{flexShrink:0}} onClick={addSubtask}>Add</button>
            </div>
            {(form.subtasks||[]).length===0?(
              <div style={{textAlign:"center",color:"#484f58",padding:24,fontSize:12}}>No subtasks yet</div>
            ):(
              <div>
                <div style={{marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
                  <div className="pbar" style={{flex:1}}>
                    <div className="pfill" style={{width:`${form.subtasks.filter(s=>s.done).length/form.subtasks.length*100}%`,background:"#3fb950"}}/>
                  </div>
                  <span style={{fontSize:11,color:"#8b949e",fontFamily:"'JetBrains Mono'"}}>{form.subtasks.filter(s=>s.done).length}/{form.subtasks.length}</span>
                </div>
                {form.subtasks.map(s=>(
                  <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #21262d"}}>
                    <input type="checkbox" checked={s.done} onChange={()=>toggleSubtask(s.id)} style={{cursor:"pointer",accentColor:"#3fb950"}}/>
                    <span style={{flex:1,fontSize:13,color:s.done?"#484f58":"#e6edf3",textDecoration:s.done?"line-through":"none"}}>{s.text}</span>
                    <button className="btn" style={{padding:"2px 6px",background:"transparent",color:"#484f58",border:"none",fontSize:12}} onClick={()=>removeSubtask(s.id)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{display:"flex",gap:8,marginTop:20,paddingTop:16,borderTop:"1px solid #21262d"}}>
          <button className="btn btn-danger" style={{padding:"6px 14px"}} onClick={()=>onDelete(card.id)}>Delete</button>
          <div style={{flex:1}}/>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>onSave(form)}>Save Card</button>
        </div>
      </div>
    </div>
  );
}

// ─── Settings View ─────────────────────────────────────────────────────────

function SettingsView({notionConfig,setNotionConfig,syncToNotion,notionSyncing,notionStatus,lanes,setLanes,members,setMembers,cards}) {
  const [newMember,setNewMember] = useState({name:"",team:"Platform"});
  return (
    <div style={{flex:1,overflow:"auto",padding:20,display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,alignContent:"start"}}>
      {/* Notion sync */}
      <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:20,gridColumn:"span 2"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{width:32,height:32,background:"#ffffff11",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>N</div>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:"#e6edf3"}}>Notion Sync</div>
            <div style={{fontSize:11,color:"#8b949e"}}>Bi-directional sync with your Notion database via MCP</div>
          </div>
          {notionConfig.lastSync&&<div style={{marginLeft:"auto",fontSize:11,color:"#3fb950",fontFamily:"'JetBrains Mono'"}}>✓ Last sync: {new Date(notionConfig.lastSync).toLocaleTimeString()}</div>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"end"}}>
          <div>
            <div className="sl">Notion Database ID</div>
            <input className="inp" placeholder="32-character Notion database ID" value={notionConfig.databaseId} onChange={e=>setNotionConfig(prev=>({...prev,databaseId:e.target.value}))}/>
            <div style={{fontSize:10,color:"#484f58",marginTop:4}}>Find it in the URL: notion.so/workspace/[DATABASE_ID]?v=...</div>
          </div>
          <button className="btn btn-primary" style={{padding:"8px 20px",marginBottom:0}} onClick={syncToNotion} disabled={notionSyncing}>
            {notionSyncing?"⟳ Syncing...":"↑ Sync to Notion"}
          </button>
        </div>
        {notionStatus&&(
          <div style={{marginTop:12,padding:"10px 14px",borderRadius:6,background:notionStatus.type==="success"?"#1a3a1a":"#3a1a1a",border:`1px solid ${notionStatus.type==="success"?"#3fb950":"#da3633"}`,fontSize:12,color:notionStatus.type==="success"?"#3fb950":"#da3633"}}>
            {notionStatus.type==="success"?"✓ ":"✗ "}{notionStatus.msg}
          </div>
        )}
      </div>

      {/* Lane management */}
      <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:20}}>
        <div style={{fontSize:14,fontWeight:600,color:"#e6edf3",marginBottom:16}}>Lanes</div>
        {lanes.map(lane=>(
          <div key={lane.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:lane.color,flexShrink:0}}/>
            <input className="inp inp-sm" style={{flex:1}} value={lane.title} onChange={e=>setLanes(prev=>prev.map(l=>l.id===lane.id?{...l,title:e.target.value}:l))}/>
            <input className="inp inp-sm" type="number" min="0" max="20" style={{width:50}} value={lane.wipLimit} onChange={e=>setLanes(prev=>prev.map(l=>l.id===lane.id?{...l,wipLimit:parseInt(e.target.value)||0}:l))} title="WIP Limit (0=unlimited)"/>
          </div>
        ))}
      </div>

      {/* Team management */}
      <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:20}}>
        <div style={{fontSize:14,fontWeight:600,color:"#e6edf3",marginBottom:16}}>Team Members</div>
        {members.map(m=>(
          <div key={m.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <Ava name={m.name} size={24}/>
            <div style={{flex:1}}>
              <div style={{fontSize:12,color:"#e6edf3",fontWeight:500}}>{m.name}</div>
              <div style={{fontSize:10,color:"#484f58"}}>{m.team} · {cards.filter(c=>c.assignee===m.id).length} cards</div>
            </div>
            <button className="btn btn-ghost" style={{padding:"2px 6px",fontSize:11}} onClick={()=>setMembers(prev=>prev.filter(x=>x.id!==m.id))}>×</button>
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"1fr 100px auto",gap:6,marginTop:12}}>
          <input className="inp inp-sm" placeholder="Name" value={newMember.name} onChange={e=>setNewMember(f=>({...f,name:e.target.value}))}/>
          <select className="inp inp-sm" value={newMember.team} onChange={e=>setNewMember(f=>({...f,team:e.target.value}))}>
            {["Platform","AppSec","Infrastructure","Automation","Client"].map(t=><option key={t}>{t}</option>)}
          </select>
          <button className="btn btn-primary" style={{padding:"4px 10px"}} onClick={()=>{
            if(!newMember.name.trim()) return;
            setMembers(prev=>[...prev,{id:newMember.name.toLowerCase().replace(/\s+/g,"-"),name:newMember.name,team:newMember.team,avatar:newMember.name[0]}]);
            setNewMember({name:"",team:"Platform"});
          }}>Add</button>
        </div>
      </div>

      {/* Data management */}
      <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:20,gridColumn:"span 2"}}>
        <div style={{fontSize:14,fontWeight:600,color:"#e6edf3",marginBottom:12}}>Data Management</div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-ghost" onClick={()=>{const d=JSON.stringify({lanes,members,cards},null,2);const b=new Blob([d]);const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=`kanban-${Date.now()}.json`;a.click();}}>⬇ Export JSON</button>
          <button className="btn btn-ghost" onClick={()=>{const h="Name,Status,Priority,Labels,Assignee,Due,Points,Time\n"+cards.map(c=>`"${c.title}","${c.laneId}","${PL[c.priority]}","${c.labels.join(";")}","${c.assignee||""}","${c.dueDate||""}","${c.storyPoints||0}","${fmt(totalTime(c))}"`).join("\n");const b=new Blob([h],{type:"text/csv"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=`kanban-${Date.now()}.csv`;a.click();}}>⬇ Export CSV</button>
        </div>
      </div>
    </div>
  );
}

// ─── AI Panel ─────────────────────────────────────────────────────────────

function AIPanel({analysis,loading,onReanalyze,moveCard,cards}) {
  if(loading) return <div style={{padding:20,textAlign:"center",color:"#8b949e"}}><div style={{fontSize:20,marginBottom:8}}>◈</div>Analyzing board...</div>;
  if(!analysis) return null;
  return (
    <div style={{fontSize:12}}>
      <div style={{background:"#0d1117",border:"1px solid #21262d",borderRadius:8,padding:12,marginBottom:12,color:"#8b949e",lineHeight:1.6}}>{analysis.summary}</div>
      {analysis.riskAlerts?.length>0&&analysis.riskAlerts.map((r,i)=>(
        <div key={i} style={{background:"#3a1a1a",border:"1px solid #da363355",borderRadius:6,padding:"8px 10px",marginBottom:6,color:"#f0883e",fontSize:11}}>⚠ {r}</div>
      ))}
      {analysis.wipWarnings?.length>0&&<div style={{marginBottom:12}}>
        <div className="sl">WIP Warnings</div>
        {analysis.wipWarnings.map((w,i)=><div key={i} style={{color:"#d29922",padding:"4px 0",borderBottom:"1px solid #21262d",fontSize:11}}>• {w}</div>)}
      </div>}
      {analysis.weeklyFocus?.length>0&&<div style={{marginBottom:12}}>
        <div className="sl">This Week</div>
        {analysis.weeklyFocus.map((f,i)=><div key={i} style={{color:"#3fb950",padding:"4px 0",borderBottom:"1px solid #21262d",fontSize:11}}>→ {f}</div>)}
      </div>}
      {analysis.suggestedMoves?.length>0&&<div style={{marginBottom:12}}>
        <div className="sl">Suggested Moves</div>
        {analysis.suggestedMoves.map((m,i)=>{
          const card = cards.find(c=>c.title.toLowerCase().includes(m.cardTitle?.toLowerCase())||"");
          return (
            <div key={i} style={{background:"#0d1117",border:"1px solid #21262d",borderRadius:6,padding:"8px 10px",marginBottom:4}}>
              <div style={{fontWeight:600,color:"#e6edf3",marginBottom:2,fontSize:11}}>{m.cardTitle}</div>
              <div style={{color:"#8b949e",fontSize:10,marginBottom:6}}>{m.from} → {m.to}: {m.reason}</div>
              {card&&<button className="btn btn-primary" style={{padding:"3px 8px",fontSize:10}} onClick={()=>moveCard(card.id,LANES.find(l=>l.title.toLowerCase()===m.to?.toLowerCase())?.id||m.to)}>Apply</button>}
            </div>
          );
        })}
      </div>}
      {analysis.bottlenecks?.length>0&&<div>
        <div className="sl">Bottlenecks</div>
        {analysis.bottlenecks.map((b,i)=><div key={i} style={{color:"#8b5cf6",padding:"4px 0",fontSize:11}}>◈ {b}</div>)}
      </div>}
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────

export default function KanbanApp() {
  const [lanes, setLanes] = useState(LANES);
  const [cards, setCards] = useState(DEF_CARDS);
  const [members, setMembers] = useState(DEF_MEMBERS);
  const [sprints, setSprints] = useState(DEF_SPRINTS);
  const [activeSprintId, setActiveSprintId] = useState("sp1");

  const [activeTab, setActiveTab] = useState("board");
  const [boardView, setBoardView] = useState("board");
  const [swimlaneGroup, setSwimlaneGroup] = useState("none");
  const [showAI, setShowAI] = useState(false);
  const [filters, setFilters] = useState({search:"",label:"",assignee:"",priority:""});

  const [dragCardId, setDragCardId] = useState(null);
  const [dragOverLane, setDragOverLane] = useState(null);

  const [editCard, setEditCard] = useState(null);
  const [templatePickerLane, setTemplatePickerLane] = useState(null);

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [activeTimer, setActiveTimer] = useState(null);
  const [timerDisplay, setTimerDisplay] = useState("00:00");
  const timerRef = useRef(null);

  const [notionConfig, setNotionConfig] = useState({databaseId:"",lastSync:null});
  const [notionSyncing, setNotionSyncing] = useState(false);
  const [notionStatus, setNotionStatus] = useState(null);

  // Persist
  useEffect(()=>{try{const s=JSON.parse(localStorage.getItem(SK)||"{}");if(s.cards)setCards(s.cards);if(s.lanes)setLanes(s.lanes);if(s.members)setMembers(s.members);if(s.sprints)setSprints(s.sprints);if(s.notionConfig)setNotionConfig(s.notionConfig);}catch(e){}}, []);
  useEffect(()=>{localStorage.setItem(SK,JSON.stringify({lanes,cards,members,sprints,notionConfig}));}, [lanes,cards,members,sprints,notionConfig]);

  // Timer
  useEffect(()=>{
    if(activeTimer){timerRef.current=setInterval(()=>{const s=Math.floor((Date.now()-activeTimer.startTime)/1000);setTimerDisplay(`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`);},1000);}
    else{clearInterval(timerRef.current);setTimerDisplay("00:00");}
    return()=>clearInterval(timerRef.current);
  },[activeTimer]);

  // Card ops
  const addCard = (laneId,template)=>{
    const d=template?.defaults||{};
    const c={id:`c${Date.now()}`,laneId,title:"New Card",description:d.description||"",priority:d.priority||2,labels:d.labels||[],dueDate:null,estimate:d.estimate||"",assignee:null,subtasks:[],healthScore:null,repo:"",timeLog:[],sprintId:activeSprintId,storyPoints:1,createdAt:new Date().toISOString().split("T")[0]};
    setCards(prev=>[...prev,c]); setEditCard(c); setTemplatePickerLane(null);
  };
  const updateCard=(u)=>{setCards(prev=>prev.map(c=>c.id===u.id?u:c));setEditCard(null);};
  const deleteCard=(id)=>{setCards(prev=>prev.filter(c=>c.id!==id));setEditCard(null);};
  const moveCard=(cardId,laneId)=>setCards(prev=>prev.map(c=>c.id===cardId?{...c,laneId}:c));

  // Timer ops
  const startTimer=(cardId)=>setActiveTimer({cardId,startTime:Date.now()});
  const stopTimer=(cardId)=>{
    if(!activeTimer||activeTimer.cardId!==cardId) return;
    const dur=Math.max(1,Math.floor((Date.now()-activeTimer.startTime)/60000));
    setCards(prev=>prev.map(c=>c.id===cardId?{...c,timeLog:[...(c.timeLog||[]),{date:new Date().toISOString().split("T")[0],duration:dur,note:"Tracked session"}]}:c));
    setActiveTimer(null);
  };
  const addTimeEntry=(cardId,duration,date,note)=>setCards(prev=>prev.map(c=>c.id===cardId?{...c,timeLog:[...(c.timeLog||[]),{date,duration:parseInt(duration)||0,note}]}:c));

  // Filters
  const filteredCards = cards.filter(c=>{
    if(filters.search&&!c.title.toLowerCase().includes(filters.search.toLowerCase()))return false;
    if(filters.label&&!c.labels.includes(filters.label))return false;
    if(filters.assignee&&c.assignee!==filters.assignee)return false;
    if(filters.priority&&c.priority!==parseInt(filters.priority))return false;
    return true;
  });

  // Swimlane groups
  const groups = (()=>{
    if(swimlaneGroup==="none") return [{id:"all",name:null}];
    const seen=new Map();
    cards.forEach(c=>{
      if(swimlaneGroup==="assignee"){const k=c.assignee||"unassigned";if(!seen.has(k))seen.set(k,members.find(m=>m.id===k)?.name||k);}
      else if(swimlaneGroup==="label"){if(c.labels.length===0){if(!seen.has("unlabeled"))seen.set("unlabeled","Unlabeled");}else c.labels.forEach(l=>{if(!seen.has(l))seen.set(l,l);});}
      else if(swimlaneGroup==="priority"){const k=String(c.priority);if(!seen.has(k))seen.set(k,`P${k} — ${PL[c.priority]}`);}
    });
    return Array.from(seen.entries()).map(([id,name])=>({id,name}));
  })();

  const getCards=(swimId,laneId)=>filteredCards.filter(c=>{
    if(c.laneId!==laneId)return false;
    if(swimlaneGroup==="none")return true;
    if(swimlaneGroup==="assignee")return(c.assignee||"unassigned")===swimId;
    if(swimlaneGroup==="label"){if(swimId==="unlabeled")return c.labels.length===0;return c.labels.includes(swimId);}
    if(swimlaneGroup==="priority")return String(c.priority)===swimId;
    return true;
  });

  // AI
  const runAI=async()=>{
    setAiLoading(true);setShowAI(true);
    try{
      const summary={lanes:lanes.map(l=>({lane:l.title,count:cards.filter(c=>c.laneId===l.id).length,wip:l.wipLimit})),overdue:cards.filter(c=>c.dueDate&&new Date(c.dueDate)<new Date()).map(c=>c.title),blocked:cards.filter(c=>c.laneId==="blocked").map(c=>c.title),highPriority:cards.filter(c=>c.priority>=4).map(c=>({title:c.title,lane:c.laneId}))};
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,messages:[{role:"user",content:`Analyze this Kanban board JSON and return ONLY valid JSON (no markdown, no explanation):\n${JSON.stringify(summary)}\n\nReturn: {"summary":"2-sentence overview","wipWarnings":[],"suggestedMoves":[{"cardTitle":"","from":"","to":"","reason":""}],"bottlenecks":[],"weeklyFocus":[],"riskAlerts":[]}`}]})});
      const data=await res.json();
      const txt=data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"{}";
      setAiAnalysis(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    }catch(e){setAiAnalysis({summary:"Analysis unavailable — check API.",wipWarnings:[],suggestedMoves:[],bottlenecks:[],weeklyFocus:[],riskAlerts:[]});}
    setAiLoading(false);
  };

  // Notion sync
  const syncToNotion=async()=>{
    if(!notionConfig.databaseId){setNotionStatus({type:"error",msg:"Enter a Notion database ID first"});return;}
    setNotionSyncing(true);setNotionStatus(null);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,messages:[{role:"user",content:`Sync these Kanban cards to Notion database: ${notionConfig.databaseId}\n\nCards: ${JSON.stringify(cards.map(c=>({title:c.title,status:lanes.find(l=>l.id===c.laneId)?.title||c.laneId,priority:PL[c.priority],labels:c.labels,assignee:c.assignee,due:c.dueDate})))}\n\nCreate or update pages in the Notion database. Report how many cards were synced.`}],mcp_servers:[{type:"url",url:"https://mcp.notion.com/mcp",name:"notion-mcp"}]})});
      const data=await res.json();
      const result=data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"Sync completed";
      setNotionConfig(prev=>({...prev,lastSync:new Date().toISOString()}));
      setNotionStatus({type:"success",msg:result.slice(0,200)});
    }catch(e){setNotionStatus({type:"error",msg:"Sync failed: "+e.message});}
    setNotionSyncing(false);
  };

  const isWipOver=(lane)=>lane.wipLimit>0&&cards.filter(c=>c.laneId===lane.id).length>lane.wipLimit;

  return (
    <div style={{fontFamily:"'Outfit',sans-serif",background:"#0d1117",color:"#e6edf3",minHeight:"100vh",display:"flex",flexDirection:"column",fontSize:14}}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{background:"#161b22",borderBottom:"1px solid #21262d",padding:"10px 16px",display:"flex",alignItems:"center",gap:12,flexShrink:0,flexWrap:"wrap",gap:10}}>
        <div style={{fontWeight:700,fontSize:14,fontFamily:"'JetBrains Mono'",color:"#e6edf3",display:"flex",alignItems:"center",gap:6}}>
          <span style={{color:"#388bfd",fontSize:16}}>◆</span> Kanban
        </div>
        <div style={{display:"flex",gap:3,background:"#0d1117",borderRadius:8,padding:3}}>
          {[["board","Board"],["burndown","Burndown"],["settings","⚙ Settings"]].map(([id,label])=>(
            <button key={id} className="tab-pill" onClick={()=>setActiveTab(id)} style={{background:activeTab===id?"#21262d":"transparent",color:activeTab===id?"#e6edf3":"#8b949e",border:"none"}}>
              {label}
            </button>
          ))}
        </div>
        <div style={{flex:1}}/>
        <select className="inp" style={{width:"auto",padding:"4px 8px",fontSize:12}} value={activeSprintId} onChange={e=>setActiveSprintId(e.target.value)}>
          {sprints.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {activeTimer&&(
          <div style={{background:"#0c2a0c",border:"1px solid #3fb950",borderRadius:6,padding:"4px 10px",fontSize:12,color:"#3fb950",fontFamily:"'JetBrains Mono'",display:"flex",alignItems:"center",gap:6}}>
            ● {timerDisplay}
            <button className="btn btn-danger" style={{padding:"2px 6px",fontSize:10}} onClick={()=>stopTimer(activeTimer.cardId)}>Stop</button>
          </div>
        )}
        <button className="btn btn-ghost" style={{border:`1px solid ${showAI?"#388bfd":"#30363d"}`,color:showAI?"#388bfd":"#8b949e",background:showAI?"#0d2240":"transparent"}}
          onClick={()=>{if(!aiAnalysis&&!aiLoading)runAI();else setShowAI(v=>!v);}}>
          ◈ AI
        </button>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

          {activeTab==="board"&&(
            <>
              {/* Controls */}
              <div style={{padding:"8px 16px",borderBottom:"1px solid #21262d",display:"flex",alignItems:"center",gap:8,flexShrink:0,flexWrap:"wrap"}}>
                <input className="inp inp-sm" placeholder="🔍 Search..." style={{width:180}} value={filters.search} onChange={e=>setFilters(f=>({...f,search:e.target.value}))}/>
                <select className="inp inp-sm" style={{width:"auto"}} value={filters.label} onChange={e=>setFilters(f=>({...f,label:e.target.value}))}>
                  <option value="">All Labels</option>{Object.keys(LC).map(l=><option key={l}>{l}</option>)}
                </select>
                <select className="inp inp-sm" style={{width:"auto"}} value={filters.assignee} onChange={e=>setFilters(f=>({...f,assignee:e.target.value}))}>
                  <option value="">All Assignees</option>{members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <select className="inp inp-sm" style={{width:"auto"}} value={filters.priority} onChange={e=>setFilters(f=>({...f,priority:e.target.value}))}>
                  <option value="">All Priorities</option>{[1,2,3,4,5].map(p=><option key={p} value={p}>P{p} {PL[p]}</option>)}
                </select>
                <div style={{flex:1}}/>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:11,color:"#8b949e"}}>Group:</span>
                  <select className="inp inp-sm" style={{width:"auto"}} value={swimlaneGroup} onChange={e=>setSwimlaneGroup(e.target.value)}>
                    <option value="none">None</option>
                    <option value="assignee">Assignee</option>
                    <option value="label">Label</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
                <div style={{display:"flex",border:"1px solid #30363d",borderRadius:6,overflow:"hidden"}}>
                  {[["board","⊞"],["list","☰"]].map(([v,icon])=>(
                    <button key={v} className="btn" onClick={()=>setBoardView(v)} style={{borderRadius:0,padding:"4px 10px",background:boardView===v?"#21262d":"transparent",color:boardView===v?"#e6edf3":"#8b949e",border:"none"}}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {boardView==="board"?(
                <BoardView lanes={lanes} cards={filteredCards} members={members}
                  swimlaneGroup={swimlaneGroup} groups={groups} getCards={getCards}
                  dragCardId={dragCardId} setDragCardId={setDragCardId}
                  dragOverLane={dragOverLane} setDragOverLane={setDragOverLane}
                  moveCard={moveCard} onCardClick={setEditCard} onAddCard={(laneId)=>setTemplatePickerLane(laneId)}
                  activeTimer={activeTimer}/>
              ):(
                <ListView cards={filteredCards} lanes={lanes} members={members} onCardClick={setEditCard}/>
              )}
            </>
          )}

          {activeTab==="burndown"&&<BurndownView sprints={sprints} activeSprint={activeSprintId} setActiveSprint={setActiveSprintId} setSprints={setSprints} cards={cards}/>}

          {activeTab==="settings"&&<SettingsView notionConfig={notionConfig} setNotionConfig={setNotionConfig} syncToNotion={syncToNotion} notionSyncing={notionSyncing} notionStatus={notionStatus} lanes={lanes} setLanes={setLanes} members={members} setMembers={setMembers} cards={cards}/>}
        </div>

        {/* AI Panel */}
        {showAI&&(
          <div style={{width:300,borderLeft:"1px solid #21262d",background:"#161b22",overflow:"auto",padding:16,flexShrink:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <span style={{fontWeight:700,fontSize:13,color:"#e6edf3"}}>◈ AI Analysis</span>
              <button className="btn btn-ghost" style={{padding:"2px 7px"}} onClick={()=>setShowAI(false)}>✕</button>
            </div>
            <AIPanel analysis={aiAnalysis} loading={aiLoading} onReanalyze={runAI} moveCard={moveCard} cards={cards}/>
            <button className="btn btn-primary" style={{width:"100%",marginTop:12}} onClick={runAI} disabled={aiLoading}>
              {aiLoading?"Analyzing...":"↺ Re-analyze"}
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {templatePickerLane&&<TemplatePicker onSelect={(t)=>addCard(templatePickerLane,t)} onClose={()=>setTemplatePickerLane(null)}/>}
      {editCard&&<CardModal card={editCard} lanes={lanes} members={members}
        onSave={updateCard} onDelete={deleteCard} onClose={()=>setEditCard(null)}
        activeTimer={activeTimer} startTimer={startTimer} stopTimer={stopTimer}
        timerDisplay={timerDisplay} addTimeEntry={addTimeEntry}/>}
    </div>
  );
}
