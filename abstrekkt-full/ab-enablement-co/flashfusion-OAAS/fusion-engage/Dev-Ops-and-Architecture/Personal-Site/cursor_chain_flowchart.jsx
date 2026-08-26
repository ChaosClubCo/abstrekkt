import { useState, useRef, useEffect, useCallback } from "react";

const SK = "cursor-chain-v1";
const PRI = "#6366f1";
const STATUS_C = { todo:"#2a3550", active:"#7c3aed", done:"#15803d", blocked:"#dc2626" };
const PHASE_NAMES = ["","Phase 1: Architecture & Planning","Phase 2: Project Setup","Phase 3: Database & Data Layer","Phase 4: Auth & Security","Phase 5: Core Features","Phase 6: API & Integrations","Phase 7: Testing & QA","Phase 8: Deployment & Production"];
const PHASE_COLORS = ["transparent","#12162a","#0e182a","#0d1f1f","#0d1f14","#151f0d","#1f150d","#1a0f1a","#1a0f14"];

const AI_SYS = `You are an expert assistant embedded in the Cursor AI Prompt Chain System — an 8-phase sequential prompt chain for full-stack web app development in Cursor IDE. Each phase's outputs feed the next.

STACK DEFAULTS: Next.js 15, Node.js 20, Supabase (PostgreSQL+RLS), Vercel, TypeScript, tRPC.

PHASES:
1A Solution Architect → tech stack, architecture diagram, DB schema outline, security checklist. Target: 10k+ concurrent, OWASP, React 18+, Node 20+.
1B Tech Stack Validator → scores stack 1-10. Gate: score ≥8 to proceed. Score <8 → revise 1A.
2A DevOps Bootstrap → folder structure, package.json, Docker dev+prod, GitHub Actions CI/CD, ESLint/Prettier.
2B API Foundation → Express/Hono server, JWT middleware, routing, error handling, rate limiting, Zod.
3A Database Architect → schema DDL, indexes, migrations (numbered+reversible), seed data. Target: 100k+ records. Plan RLS here.
3B ORM Integration → Prisma models, repos, N+1 prevention, transactions, connection pooling. Audit logging required.
4A Security Engineer → JWT+refresh token rotation, bcrypt ≥12 rounds, OWASP Top 10, helmet, CORS prod-only, no stack traces.
4B Auth Frontend → Login/Register, auth context, protected routes, httpOnly cookies preferred, ARIA labels, mobile-responsive.
Integration Check I → validate phases 1-4 together. Common issues: env mismatch, import paths, JWT not wired to routes.
5A Frontend Architect → atomic design components, Zustand/Redux, routing, API layer, code splitting, TypeScript.
5B UX Engineer → 60fps animations, loading skeletons, keyboard nav, prefers-reduced-motion, touch-friendly.
6A API Developer → CRUD for all entities, filtering+search, file upload, webhooks, OpenAPI docs, Zod validation, /api/v1/.
6B Integration Specialist → email (SendGrid/SES), storage (S3/Cloudinary), Sentry, circuit breakers, retry backoff. Stripe: tokenization only, NEVER store cards.
Code Review → bugs, perf, security, maintainability. Bypass if already reviewed during phase.
Integration Check II → full frontend-backend. Common: CORS, wrong API URL, missing auth headers.
7A Test Engineer → Jest unit (90%+), API integration tests, Playwright E2E, error scenarios. npm run test:coverage.
7B QA Automation → test pipeline, npm audit+Snyk, load test 10k concurrent, ESLint zero warnings before deploy.
Quality Gate → all 6 gates must pass before Phase 8.
ESCALATION → fix failures, return to 7A. Security issues → re-run 4A+4B.
8A Production Deployment → Docker prod, K8s/Compose, SSL, CDN, zero-downtime, health+readiness probes.
8B SRE Monitoring → Prometheus+Grafana, Sentry, PostHog, alerting (>1% error 2min = page), runbooks.
Final Quality Gate → 8 checklist items, all ★ critical must pass.

COMMON FAILURES (likelihood order):
1. Skipping 1B → architecture rework mid-build
2. Proceeding with score <8 → cascading tech debt
3. Missing ORM transactions (3B) → data integrity bugs
4. JWT without refresh rotation (4A) → security vuln
5. No RLS on Supabase → data leakage
6. Missing error handling in 6A → unhandled 500s in prod
7. Skipping integration checks → incompatibility found late
8. Coverage <90% bypass → shipping untested code

ESCALATION ROUTING:
- Architecture → re-run 1A with clearer requirements
- Security vulns → re-run 4A then 4B
- Test failures → fix in feature phase, re-run 7A+7B
- Integration failures → trace to originating phase

TONE: Engineer is mid-task. Be concise. Lead with most likely fix. Exhaust phase options before escalating.`;

const NODES_CFG = [
  {id:"start",label:"START\nProject Ready",type:"terminal",x:450,y:55,ph:0,em:5,bp:false,
   w:["Gather project requirements","Confirm Cursor IDE with 5 extensions installed"],u:["Review for completeness","Validate against business goals"],c:["Requirements doc complete","Extensions: Thunder Client, GitLens, Auto Rename Tag, Prettier, ESLint"],i:["Stack defaults: Next.js 15, Node.js 20, Supabase, Vercel, TypeScript"]},
  {id:"prereq",label:"Prerequisites Setup",type:"process",x:450,y:168,ph:0,em:15,bp:false,
   w:["Open Extensions panel (Cmd/Ctrl+Shift+X)","Search and install each extension"],u:["Install Thunder Client","Install GitLens","Install Auto Rename Tag","Install Prettier","Install ESLint"],c:["All 5 extensions installed+enabled","New project directory created"],i:["Thunder Client: REST API testing inside Cursor","GitLens: enhanced Git history","ESLint+Prettier: code quality"]},
  {id:"p1a",label:"1A: Solution Architect",type:"process",x:450,y:293,ph:1,em:20,bp:false,
   w:["Copy Prompt 1A","Paste requirements into [PASTE_HERE] block"],u:["Run in Cursor AI chat (30-60s)","Copy entire response"],c:["Tech stack + justification","ASCII architecture diagram","DB schema outline","Security checklist","Deployment architecture"],i:["Target: 10k+ concurrent users","OWASP compliance required","Use React 18+, Node 20+"]},
  {id:"p1b",label:"1B: Tech Stack Validator",type:"process",x:450,y:410,ph:1,em:15,bp:false,
   w:["Copy Prompt 1B","Paste 1A output into prompt"],u:["Run validation","Note score (1-10)","Review risk per component"],c:["Validation score documented","Risk assessment reviewed","Score <8: specific issues identified"],i:["Score ≥8 → Phase 2","Score <8 → revise 1A","Timeline estimate documented"]},
  {id:"d1",label:"Score ≥ 8?",type:"decision",x:450,y:528,ph:1,em:2,bp:false,
   w:["Check validation score from 1B output"],u:["Score <8: document issues","Prepare revised requirements for 1A re-run"],c:["Decision: proceed or revise"],i:["8-10: proceed","6-7: acceptable with noted risks","<6: significant rework needed"]},
  {id:"p2a",label:"2A: DevOps Bootstrap",type:"process",x:450,y:660,ph:2,em:30,bp:false,
   w:["Copy Prompt 2A","Paste validated stack"],u:["Create all config files","Commit to git after creation"],c:["Folder structure","package.json+deps","Docker dev+prod","GitHub Actions",".env.example","ESLint+Prettier","npm scripts working"],i:["Security scanning in CI required","git init + initial commit after bootstrap"]},
  {id:"p2b",label:"2B: API Foundation",type:"process",x:450,y:783,ph:2,em:30,bp:false,
   w:["Copy Prompt 2B","Reference validated stack"],u:["Generate server.js+middleware","Test health check endpoint"],c:["Server starts without errors","Health check 200","JWT middleware present","Rate limiting active","Zod validation wired"],i:["OpenAPI 3.0 compliance","helmet+cors configured","No stack traces in errors"]},
  {id:"p3a",label:"3A: Database Architect",type:"process",x:450,y:908,ph:3,em:25,bp:false,
   w:["Copy Prompt 3A","Reference requirements+architecture"],u:["Generate schema DDL","Review indexing strategy","Validate FK constraints"],c:["Complete DB schema","Indexing strategy documented","Migrations numbered+reversible","Seed data for dev"],i:["Scale target: 100k+ records","Supabase RLS planned here","Migration naming: YYYYMMDD_desc.sql"]},
  {id:"p3b",label:"3B: ORM Integration",type:"process",x:450,y:1031,ph:3,em:25,bp:false,
   w:["Copy Prompt 3B","Paste schema from 3A"],u:["Generate Prisma models","Wire repository pattern","Test connection pooling"],c:["ORM models match schema","Repository interfaces defined","N+1 prevented","Transactions working","Connection pooling configured"],i:["Audit logging required","Pagination+filtering in repos","Type-safe TypeScript generics"]},
  {id:"p4a",label:"4A: Security Engineer",type:"process",x:450,y:1156,ph:4,em:30,bp:false,
   w:["Copy Prompt 4A"],u:["Generate auth middleware","Verify bcrypt ≥12 rounds","Confirm refresh token rotation"],c:["JWT+refresh rotation","bcrypt proper rounds","Rate limiting by IP+user","CORS prod-only","helmet headers","No stack traces"],i:["OWASP Top 10 (2023)","httpOnly+Secure cookies","Refresh tokens rotate on use"]},
  {id:"p4b",label:"4B: Auth Frontend",type:"process",x:450,y:1279,ph:4,em:25,bp:false,
   w:["Copy Prompt 4B"],u:["Generate login/register","Wire auth context","Test protected route redirect"],c:["Login+Register rendering","JWT management working","Protected routes working","Auth context connected","Real-time form validation"],i:["httpOnly cookies preferred over localStorage","ARIA labels required","Mobile-responsive"]},
  {id:"int1",label:"Integration Check I\n(Phases 1–4)",type:"process",x:450,y:1415,ph:0,em:20,bp:true,
   w:["Copy Integration Check prompt","Reference codebase state"],u:["Run validation","Test phase outputs together","Verify no breaking changes"],c:["Components phases 1-4 work together","No breaking changes","Config consistent","Deps compatible"],i:["Bypass if confident in integration","Common: env mismatch, import paths, JWT not wired to routes"]},
  {id:"p5a",label:"5A: Frontend Architect",type:"process",x:450,y:1540,ph:5,em:35,bp:false,
   w:["Copy Prompt 5A","Reference project requirements"],u:["Generate component architecture","Set up state management","Configure routing"],c:["Component scaffold (atomic design)","State management configured","Protected routing working","API integration layer","Code splitting configured"],i:["TypeScript required","CSS Modules or Tailwind","SEO for public pages"]},
  {id:"p5b",label:"5B: UX Engineer",type:"process",x:450,y:1663,ph:5,em:30,bp:false,
   w:["Copy Prompt 5B"],u:["Add animations+transitions","Build loading skeletons","Add keyboard navigation"],c:["60fps animations","Loading skeletons for async","Keyboard nav working","Touch-friendly","prefers-reduced-motion respected"],i:["Screen reader compatibility required","Progressive enhancement","No layout shifts"]},
  {id:"p6a",label:"6A: API Developer",type:"process",x:450,y:1786,ph:6,em:40,bp:false,
   w:["Copy Prompt 6A","Reference business requirements"],u:["Generate CRUD endpoints","Add filtering+search","Generate OpenAPI docs"],c:["CRUD for all entities","Filtering+search","File upload endpoint","Webhook endpoint","OpenAPI docs","Consistent response format"],i:["All endpoints: Zod input validation","Logging to Sentry","API versioning: /api/v1/"]},
  {id:"p6b",label:"6B: Integration Specialist",type:"process",x:450,y:1909,ph:6,em:35,bp:false,
   w:["Copy Prompt 6B"],u:["Integrate email (SendGrid)","Wire storage (S3/Cloudinary)","Set up Sentry","Add circuit breakers"],c:["Email+fallback","Storage working","Sentry capturing errors","Circuit breakers on externals","Retry with exponential backoff","Health checks for all services"],i:["Stripe: tokenization ONLY, never store cards","All config via env vars","Graceful degradation"]},
  {id:"refine",label:"Code Review & Refinement",type:"process",x:450,y:2048,ph:0,em:30,bp:true,
   w:["Copy Refinement prompt","Paste code sections for review"],u:["Identify bugs+edge cases","Find perf optimizations","Check security","Assess maintainability"],c:["All issues have fixes","Updated code applied","Security holes addressed"],i:["Bypass if: reviewed during phase execution","Common: missing error handling, N+1, hardcoded values, missing input sanitization"]},
  {id:"int2",label:"Integration Check II\n(Phases 5–6)",type:"process",x:450,y:2171,ph:0,em:20,bp:true,
   w:["Copy Integration Check prompt","Reference full codebase"],u:["Validate frontend-backend","Test API calls from frontend","Verify auth E2E"],c:["Frontend connects to backend","Auth E2E works","API returns correct data","Error states in UI handled"],i:["Bypass if manually tested and confident","Common: CORS, wrong API URL, token not sent in headers"]},
  {id:"p7a",label:"7A: Test Engineer",type:"process",x:450,y:2296,ph:7,em:45,bp:false,
   w:["Copy Prompt 7A"],u:["Generate unit tests","Create API integration tests","Write E2E (Playwright)"],c:["90%+ code coverage","Unit tests for all business logic","API tests passing","E2E for critical paths","Error scenarios covered"],i:["npm run test:coverage","npm run test:e2e","CI must run tests on every PR"]},
  {id:"p7b",label:"7B: QA Automation",type:"process",x:450,y:2419,ph:7,em:30,bp:false,
   w:["Copy Prompt 7B"],u:["Set up test pipeline","Configure security scanning","Set up perf benchmarking"],c:["No critical security vulns","Performance within thresholds","All tests passing","Coverage >90%","No lint errors","Accessibility verified"],i:["npm audit + Snyk","Load test: 10k concurrent","ESLint zero warnings before deploy"]},
  {id:"d2",label:"Quality Gates\nPass?",type:"decision",x:450,y:2540,ph:7,em:5,bp:false,
   w:["Review 7B quality gate output"],u:["Check all 6 gates","Document failing gates"],c:["All gates confirmed passing","Decision documented"],i:["Pass: all 6 ✓ → Phase 8","Fail → escalation, fix, re-run 7A/7B"]},
  {id:"esc1",label:"ESCALATION\nFix QA Failures",type:"escalation",x:758,y:2540,ph:7,em:60,bp:false,retTo:"p7a",
   w:["Document failing quality gates","Identify originating phase per failure"],u:["Route to phase that owns the fix","Apply fixes","Re-run affected prompts"],c:["All failing gates now pass","Root cause documented"],i:["Test failures → fix in feature phase, re-run 7A","Security → re-run 4A+4B","Coverage <90% → add tests in 7A","Lint → fix+re-run 7B"]},
  {id:"p8a",label:"8A: Production Deployment",type:"process",x:450,y:2680,ph:8,em:45,bp:false,
   w:["Copy Prompt 8A"],u:["Generate Docker prod config","Set up K8s/Compose prod","Configure SSL","Set up CDN"],c:["Docker prod image builds","Zero-downtime deployment","SSL/TLS working","CDN for static assets","DB backup+recovery documented","Health+readiness probes"],i:["Deploy: Vercel or Docker/K8s","SSL: Let's Encrypt or managed cert","Monitoring dashboards before go-live"]},
  {id:"p8b",label:"8B: SRE Monitoring",type:"process",x:450,y:2803,ph:8,em:30,bp:false,
   w:["Copy Prompt 8B"],u:["Set up APM (Sentry+PostHog)","Configure infra monitoring","Wire log aggregation","Set up alerting"],c:["99.9% uptime SLA monitoring","Response time thresholds set","Error rate alerting","Resource dashboards live","Incident runbooks documented"],i:["Prometheus+Grafana for infra","Sentry errors, PostHog analytics","Alert: >1% error rate 2min = page"]},
  {id:"finalgate",label:"Final Quality Gate",type:"process",x:450,y:2940,ph:8,em:20,bp:false,isCL:true,
   w:["Run Final Quality Gate checklist","Validate each item against delivered code"],u:["Mark each item pass/fail","Document issues for final fixes"],c:["All ★ critical items passing","Go/No-Go decision made"],i:["All ★ items must pass for PRODUCTION READY","Use Final QG prompt from chain"]},
  {id:"end",label:"PRODUCTION READY",type:"terminal",x:450,y:3080,ph:0,em:0,bp:false,
   w:[],u:[],c:["All 8 phases complete","Final quality gate passed","Application deployed to production"],i:["Ship it!"]},
];

const CHECKLIST_ITEMS = [
  {label:"Security vulnerabilities addressed",critical:true},
  {label:"All tests passing (>90% coverage)",critical:true},
  {label:"Error handling comprehensive",critical:true},
  {label:"Logging and monitoring in place",critical:true},
  {label:"Production deployment configured",critical:true},
  {label:"Scalability considerations addressed",critical:true},
  {label:"Documentation complete",critical:false},
  {label:"Performance requirements validated",critical:false},
];

function buildNodes() {
  const m = {};
  NODES_CFG.forEach(n => {
    m[n.id] = {
      id:n.id, label:n.label, type:n.type, x:n.x, y:n.y,
      phase:n.ph, expectedMinutes:n.em, bypassable:n.bp,
      status:"todo", startedAt:null, completedAt:null,
      bypassed:false, bypassReason:"",
      escalationReturnNode:n.retTo||null,
      checklistItems: n.isCL ? CHECKLIST_ITEMS.map(ci=>({...ci,status:null})) : null,
      detail:{w:n.w, u:n.u, c:n.c, i:n.i},
    };
  });
  return m;
}

const INIT_NODES = buildNodes();

const INIT_EDGES = [
  {id:"e0",from:"start",to:"prereq",label:""},
  {id:"e1",from:"prereq",to:"p1a",label:""},
  {id:"e2",from:"p1a",to:"p1b",label:""},
  {id:"e3",from:"p1b",to:"d1",label:""},
  {id:"e4",from:"d1",to:"p2a",label:"Yes ≥8"},
  {id:"e5",from:"d1",to:"p1a",label:"No <8",loop:true},
  {id:"e6",from:"p2a",to:"p2b",label:""},
  {id:"e7",from:"p2b",to:"p3a",label:""},
  {id:"e8",from:"p3a",to:"p3b",label:""},
  {id:"e9",from:"p3b",to:"p4a",label:""},
  {id:"e10",from:"p4a",to:"p4b",label:""},
  {id:"e11",from:"p4b",to:"int1",label:""},
  {id:"e12",from:"int1",to:"p5a",label:""},
  {id:"e13",from:"p5a",to:"p5b",label:""},
  {id:"e14",from:"p5b",to:"p6a",label:""},
  {id:"e15",from:"p6a",to:"p6b",label:""},
  {id:"e16",from:"p6b",to:"refine",label:""},
  {id:"e17",from:"refine",to:"int2",label:""},
  {id:"e18",from:"int2",to:"p7a",label:""},
  {id:"e19",from:"p7a",to:"p7b",label:""},
  {id:"e20",from:"p7b",to:"d2",label:""},
  {id:"e21",from:"d2",to:"p8a",label:"Pass ✓"},
  {id:"e22",from:"d2",to:"esc1",label:"Fail ✗"},
  {id:"e23",from:"p8a",to:"p8b",label:""},
  {id:"e24",from:"p8b",to:"finalgate",label:""},
  {id:"e25",from:"finalgate",to:"end",label:""},
];

function getNodeDim(type) {
  return {terminal:[200,46],process:[224,50],decision:[162,78],escalation:[210,50]}[type];
}
function getConnPt(node, side) {
  const [w,h] = getNodeDim(node.type);
  if (side==="top") return [node.x, node.y - h/2];
  if (side==="bottom") return [node.x, node.y + h/2];
  if (side==="left") return [node.x - w/2, node.y];
  if (side==="right") return [node.x + w/2, node.y];
  return [node.x, node.y];
}
function buildEdgePath(edge, nodes) {
  const fn=nodes[edge.from], tn=nodes[edge.to];
  if(!fn||!tn) return "";
  if(edge.loop) {
    const [fx,fy]=getConnPt(fn,"left"), [tx,ty]=getConnPt(tn,"left");
    const lx=Math.min(fx,tx)-90;
    return `M ${fx} ${fy} L ${lx} ${fy} L ${lx} ${ty} L ${tx} ${ty}`;
  }
  if(Math.abs(fn.y-tn.y)<15) {
    const [fx,fy]=getConnPt(fn,"right"), [tx,ty]=getConnPt(tn,"left");
    return `M ${fx} ${fy} L ${tx} ${ty}`;
  }
  const [fx,fy]=getConnPt(fn,"bottom"), [tx,ty]=getConnPt(tn,"top");
  const my=(fy+ty)/2;
  return `M ${fx} ${fy} C ${fx} ${my}, ${tx} ${my}, ${tx} ${ty}`;
}
function getDownstream(nodeId, edges) {
  const vis=new Set(); const q=[nodeId];
  while(q.length) {
    const cur=q.shift();
    for(const e of edges) if(e.from===cur && !vis.has(e.to)) { vis.add(e.to); q.push(e.to); }
  }
  vis.delete(nodeId); return [...vis];
}
function fmt(ms) {
  const s=Math.floor(ms/1000),m=Math.floor(s/60),h=Math.floor(m/60);
  if(h>0) return `${h}h ${m%60}m`;
  if(m>0) return `${m}m ${s%60}s`;
  return `${s}s`;
}
function fmtTs(ts) { return new Date(ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}); }

function parseFlowchartChange(text) {
  const m = text.match(/\[FLOWCHART_CHANGE\]([\s\S]*?)\[\/FLOWCHART_CHANGE\]/);
  if(!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

// ─── PHASE GROUP RANGES ──────────────────────────────────────────────────────
function getPhaseGroups(nodes) {
  const groups = {};
  Object.values(nodes).forEach(n => {
    if(n.phase===0) return;
    if(!groups[n.phase]) groups[n.phase]={minY:Infinity,maxY:-Infinity};
    const [,h]=getNodeDim(n.type);
    groups[n.phase].minY=Math.min(groups[n.phase].minY, n.y-h/2-18);
    groups[n.phase].maxY=Math.max(groups[n.phase].maxY, n.y+h/2+18);
  });
  return groups;
}

// ─── NODE SHAPE COMPONENT ────────────────────────────────────────────────────
function NodeShape({node, isSelected, now, editMode, onMouseDown, onClick, onDblClick}) {
  const [w,h]=getNodeDim(node.type);
  const elapsed = node.startedAt ? (now - node.startedAt)/1000/60 : 0;
  const overtime = node.startedAt && node.expectedMinutes>0 && elapsed > node.expectedMinutes*2;
  const sc = STATUS_C[node.status];
  const isBypassed = node.bypassed;

  const fills = {
    todo: node.type==="escalation" ? "#3a1505" : node.type==="terminal" ? "#1a1d3a" : "#0e1424",
    active: node.type==="escalation" ? "#3a1505" : "#1a1040",
    done: "#0a1f10",
    blocked: "#1f0a0a",
  };
  const fill = fills[node.status]||fills.todo;
  const stroke = isSelected ? "#a5b4fc" : sc;

  const lines = node.label.split("\n");

  const handlers = {
    onMouseDown: e => { e.stopPropagation(); onMouseDown(e,node); },
    onClick: e => { e.stopPropagation(); onClick(node); },
    onDoubleClick: e => { e.stopPropagation(); onDblClick(node); },
    style:{cursor: editMode?"grab":"pointer"},
  };

  const statusBadge = (
    <circle cx={node.x + w/2 - 2} cy={node.y - h/2 + 2} r={5}
      fill={sc} stroke="#0a0d14" strokeWidth={1.5}/>
  );

  if(node.type==="decision") {
    const pts=`${node.x},${node.y-h/2} ${node.x+w/2},${node.y} ${node.x},${node.y+h/2} ${node.x-w/2},${node.y}`;
    return (
      <g {...handlers}>
        {overtime && <polygon points={pts} fill="none" stroke="#ca8a04" strokeWidth={2.5} strokeDasharray="6 3" opacity={0.7}/>}
        {isSelected && <polygon points={pts} fill="none" stroke="#a5b4fc" strokeWidth={3} opacity={0.4}/>}
        <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={isSelected?2:1.5}/>
        {lines.map((l,i)=>(
          <text key={i} x={node.x} y={node.y+(i-lines.length/2+0.5)*16}
            textAnchor="middle" dominantBaseline="central"
            fill="#dde4f0" fontSize={11} fontFamily="system-ui" fontWeight={500}>{l}</text>
        ))}
        {statusBadge}
        {isBypassed && <text x={node.x} y={node.y+h/2+12} textAnchor="middle" fill="#0891b2" fontSize={9} fontFamily="system-ui">BYPASSED</text>}
      </g>
    );
  }

  const rx = node.type==="terminal"?23:6;
  const escColor = node.type==="escalation" ? "#c2410c" : undefined;

  return (
    <g {...handlers}>
      {overtime && <rect x={node.x-w/2-4} y={node.y-h/2-4} width={w+8} height={h+8} rx={rx+2} fill="none" stroke="#ca8a04" strokeWidth={2} strokeDasharray="7 3" opacity={0.6}/>}
      {isSelected && <rect x={node.x-w/2-3} y={node.y-h/2-3} width={w+6} height={h+6} rx={rx+2} fill="none" stroke="#a5b4fc" strokeWidth={3} opacity={0.4}/>}
      <rect x={node.x-w/2} y={node.y-h/2} width={w} height={h} rx={rx}
        fill={escColor ? "#3a0d03" : fill}
        stroke={isSelected?"#a5b4fc" : (escColor||sc)}
        strokeWidth={isSelected?2:1.5}/>
      {lines.length===1
        ? <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central" fill="#dde4f0" fontSize={12} fontFamily="system-ui" fontWeight={500}>{lines[0]}</text>
        : lines.map((l,i)=><text key={i} x={node.x} y={node.y+(i-lines.length/2+0.5)*14} textAnchor="middle" dominantBaseline="central" fill="#dde4f0" fontSize={11} fontFamily="system-ui" fontWeight={500}>{l}</text>)
      }
      {statusBadge}
      {node.bypassable && <text x={node.x-w/2+6} y={node.y+h/2-5} fill="#0891b2" fontSize={9} fontFamily="system-ui">⤵ skippable</text>}
      {isBypassed && <text x={node.x} y={node.y+h/2+11} textAnchor="middle" fill="#0891b2" fontSize={9} fontFamily="system-ui">BYPASSED</text>}
      {node.type==="escalation" && node.status!=="done" && <text x={node.x} y={node.y+h/2+11} textAnchor="middle" fill="#c2410c" fontSize={9} fontFamily="system-ui">↩ Resolved when done</text>}
    </g>
  );
}

const DARK = {bg:"#080b12", surf:"#0e1220", panel:"#111928", border:"#1c2540", txt:"#dde4f0", sub:"#4b5980"};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CursorChainFlowchart() {
  const [nodes, setNodes] = useState(INIT_NODES);
  const [edges, setEdges] = useState(INIT_EDGES);
  const [selId, setSelId] = useState(null);
  const [tab, setTab] = useState("details");
  const [editMode, setEditMode] = useState(false);
  const [session, setSession] = useState({active:false,startedAt:null});
  const [sessionLog, setSessionLog] = useState([]);
  const [notes, setNotes] = useState({});
  const [aiMsgs, setAiMsgs] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiEditMode, setAiEditMode] = useState(false);
  const [pendingChg, setPendingChg] = useState(null);
  const [bypassModal, setBypassModal] = useState(null);
  const [bypassReason, setBypassReason] = useState("");
  const [downstreamModal, setDownstreamModal] = useState(null);
  const [vt, setVt] = useState({x:-100,y:-10,scale:0.44});
  const [panning, setPanning] = useState(null);
  const [dragNode, setDragNode] = useState(null);
  const [tick, setTick] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const svgRef = useRef();
  const svgContainerRef = useRef();

  // ── TIMER ──────────────────────────────────────────────────────────────────
  useEffect(()=>{
    const id = setInterval(()=>setTick(t=>t+1), 1000);
    return ()=>clearInterval(id);
  },[]);

  const now = Date.now();

  // ── STORAGE LOAD ──────────────────────────────────────────────────────────
  useEffect(()=>{
    if(loaded) return;
    (async()=>{
      try {
        const r = await window.storage.get(SK);
        if(r?.value) {
          const d = JSON.parse(r.value);
          if(d.nodes) setNodes(d.nodes);
          if(d.session) setSession(d.session);
          if(d.sessionLog) setSessionLog(d.sessionLog);
          if(d.notes) setNotes(d.notes);
        }
      } catch {}
      setLoaded(true);
    })();
  },[loaded]);

  // ── STORAGE SAVE ──────────────────────────────────────────────────────────
  const save = useCallback(async(nodesSnap, sessionSnap, logSnap, notesSnap)=>{
    try {
      await window.storage.set(SK, JSON.stringify({
        nodes: nodesSnap, session: sessionSnap, sessionLog: logSnap, notes: notesSnap
      }));
    } catch {}
  },[]);

  const updateNodes = useCallback((updater)=>{
    setNodes(prev => {
      const next = updater(prev);
      save(next, session, sessionLog, notes);
      return next;
    });
  },[session, sessionLog, notes, save]);

  // ── NODE STATUS CHANGE ────────────────────────────────────────────────────
  const setNodeStatus = useCallback((id, newStatus, skipDownstreamCheck=false)=>{
    const node = nodes[id];
    if(!node) return;

    if(!skipDownstreamCheck && (newStatus==="done"||newStatus==="active")) {
      const ds = getDownstream(id, edges);
      const affected = ds.filter(nid=>nodes[nid]&&(nodes[nid].status==="active"||nodes[nid].status==="done"));
      if(affected.length>0) {
        setDownstreamModal({nodeId:id, newStatus, affected, nodeLabel:node.label});
        return;
      }
    }

    const logEntry = {ts:Date.now(), nodeId:id, nodeLabel:node.label, action:`Status → ${newStatus}`};
    const newLog = [...sessionLog, logEntry];
    setSessionLog(newLog);

    updateNodes(prev => {
      const n = {...prev};
      const nd = {...n[id]};
      nd.status = newStatus;
      if(newStatus==="active") nd.startedAt = now;
      if(newStatus==="done") nd.completedAt = now;
      if(newStatus==="todo") { nd.startedAt=null; nd.completedAt=null; }
      n[id]=nd;

      // Escalation resolved
      if(newStatus==="done" && nd.escalationReturnNode) {
        const rn = {...n[nd.escalationReturnNode]};
        rn.status="active"; rn.startedAt=now;
        n[nd.escalationReturnNode]=rn;
      }
      return n;
    });
    save({...nodes, [id]:{...nodes[id], status:newStatus}}, session, newLog, notes);
  },[nodes, edges, sessionLog, session, notes, save, updateNodes, now]);

  // ── BYPASS ────────────────────────────────────────────────────────────────
  const confirmBypass = useCallback(()=>{
    if(!bypassModal) return;
    const {nodeId}=bypassModal;
    const logEntry = {ts:Date.now(), nodeId, nodeLabel:nodes[nodeId].label, action:`Bypassed: ${bypassReason||"(no reason)"}`};
    const newLog = [...sessionLog, logEntry];
    setSessionLog(newLog);
    updateNodes(prev=>{
      const n={...prev};
      n[nodeId]={...n[nodeId], bypassed:true, bypassReason:bypassReason||"", status:"done", completedAt:Date.now()};
      return n;
    });
    setBypassModal(null); setBypassReason("");
  },[bypassModal, bypassReason, nodes, sessionLog, updateNodes]);

  // ── SESSION ───────────────────────────────────────────────────────────────
  const startSession = useCallback(()=>{
    const ns = {active:true, startedAt:Date.now()};
    const logEntry = {ts:Date.now(), nodeId:null, nodeLabel:null, action:"Session started"};
    const newLog = [...sessionLog, logEntry];
    setSession(ns); setSessionLog(newLog);
    save(nodes, ns, newLog, notes);
  },[sessionLog, nodes, notes, save]);

  // ── PAN/ZOOM ──────────────────────────────────────────────────────────────
  const onSvgMouseDown = useCallback((e)=>{
    if(e.target !== svgRef.current && !e.target.classList.contains("canvas-bg")) return;
    if(editMode && dragNode) return;
    setPanning({mx:e.clientX, my:e.clientY, ox:vt.x, oy:vt.y});
    e.preventDefault();
  },[vt, editMode, dragNode]);

  const onMouseMove = useCallback((e)=>{
    if(panning) {
      setVt(prev=>({...prev, x:panning.ox+(e.clientX-panning.mx), y:panning.oy+(e.clientY-panning.my)}));
    }
    if(dragNode) {
      const dx=(e.clientX-dragNode.mx)/vt.scale, dy=(e.clientY-dragNode.my)/vt.scale;
      updateNodes(prev=>({...prev, [dragNode.id]:{...prev[dragNode.id], x:dragNode.ox+dx, y:dragNode.oy+dy}}));
    }
  },[panning, dragNode, vt.scale, updateNodes]);

  const onMouseUp = useCallback(()=>{
    setPanning(null); setDragNode(null);
  },[]);

  const onWheel = useCallback((e)=>{
    e.preventDefault();
    const factor = e.deltaY>0 ? 0.9 : 1.1;
    setVt(prev => {
      const ns = Math.max(0.2, Math.min(2.5, prev.scale*factor));
      const rect = svgContainerRef.current?.getBoundingClientRect();
      if(!rect) return {...prev, scale:ns};
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      return {
        x: cx - (cx - prev.x)*(ns/prev.scale),
        y: cy - (cy - prev.y)*(ns/prev.scale),
        scale: ns,
      };
    });
  },[]);

  useEffect(()=>{
    const el = svgContainerRef.current;
    if(!el) return;
    el.addEventListener("wheel", onWheel, {passive:false});
    return ()=>el.removeEventListener("wheel", onWheel);
  },[onWheel]);

  const onNodeMouseDown = useCallback((e, node)=>{
    if(!editMode) return;
    setDragNode({id:node.id, mx:e.clientX, my:e.clientY, ox:node.x, oy:node.y});
    e.preventDefault();
  },[editMode]);

  const onNodeClick = useCallback((node)=>{
    setSelId(node.id); setTab("details");
  },[]);

  const onNodeDblClick = useCallback((node)=>{
    if(!editMode) return;
    const label = prompt("Edit label:", node.label.replace(/\n/g," | "));
    if(label !== null) {
      updateNodes(prev=>({...prev,[node.id]:{...prev[node.id],label:label.replace(/ \| /g,"\n")}}));
    }
  },[editMode, updateNodes]);

  // ── COPY TICKET TEXT ──────────────────────────────────────────────────────
  const copyTicket = useCallback(()=>{
    const done = Object.values(nodes).filter(n=>n.status==="done"&&n.completedAt).sort((a,b)=>a.completedAt-b.completedAt);
    const lines = done.map(n=>`[${fmtTs(n.completedAt)}] ${n.label.replace(/\n/g," ")} — ${n.bypassed?"BYPASSED":"DONE"}`);
    if(session.startedAt) lines.unshift(`Session started: ${fmtTs(session.startedAt)}`);
    navigator.clipboard.writeText(lines.join("\n")).catch(()=>{});
  },[nodes, session]);

  // ── RESET ─────────────────────────────────────────────────────────────────
  const resetAll = useCallback(async()=>{
    if(!confirm("Reset all progress? This cannot be undone.")) return;
    const fresh = buildNodes();
    setNodes(fresh); setSession({active:false,startedAt:null});
    setSessionLog([]); setNotes({}); setAiMsgs([]);
    try { await window.storage.delete(SK); } catch {}
  },[]);

  // ── AI CHAT ───────────────────────────────────────────────────────────────
  const sendAi = useCallback(async(msgOverride)=>{
    const text = msgOverride || aiInput.trim();
    if(!text||aiLoading) return;
    setAiInput("");

    const sel = selId ? nodes[selId] : null;
    const contextPrefix = sel ? `[Context: Currently viewing node "${sel.label.replace(/\n/g," ")}" in ${PHASE_NAMES[sel.phase]||"misc"}. Status: ${sel.status}. Expected: ${sel.expectedMinutes}min.]\n\n` : "";

    let sysPrompt = AI_SYS;
    if(aiEditMode) {
      const flowJson = JSON.stringify({
        nodes: Object.values(nodes).map(n=>({id:n.id,label:n.label,type:n.type,x:n.x,y:n.y,status:n.status,phase:n.phase})),
        edges: edges.map(e=>({id:e.id,from:e.from,to:e.to,label:e.label||""}))
      },null,2);
      sysPrompt += `\n\nFLOWCHART EDIT MODE ENABLED. Current flowchart JSON:\n${flowJson}\n\nWhen suggesting changes, output a [FLOWCHART_CHANGE]{...}[/FLOWCHART_CHANGE] block with JSON: {actions:[...], summary:"..."}. Actions: add_node, remove_node, update_node_label, update_node_detail, update_exp, add_edge, remove_edge. add_node must include removeEdge field.`;
    }

    const userMsg = {role:"user", content: contextPrefix + text};
    const newMsgs = [...aiMsgs, userMsg];
    setAiMsgs(newMsgs);
    setAiLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:800,
          system: sysPrompt,
          messages: newMsgs,
        })
      });
      const data = await res.json();
      const reply = data?.content?.filter(c=>c.type==="text").map(c=>c.text).join("") || "No response.";
      const assistantMsg = {role:"assistant", content:reply};
      setAiMsgs(prev=>[...prev, assistantMsg]);

      const chg = parseFlowchartChange(reply);
      if(chg) setPendingChg(chg);
    } catch(err) {
      setAiMsgs(prev=>[...prev, {role:"assistant",content:`Error: ${err.message}`}]);
    }
    setAiLoading(false);
  },[aiInput, aiLoading, aiMsgs, selId, nodes, edges, aiEditMode]);

  // ── APPLY FLOWCHART CHANGE ────────────────────────────────────────────────
  const applyChange = useCallback(()=>{
    if(!pendingChg) return;
    const {actions} = pendingChg;
    if(!actions) { setPendingChg(null); return; }
    let newNodes = {...nodes};
    let newEdges = [...edges];
    actions.forEach(a=>{
      if(a.type==="add_node" && a.node) {
        newNodes[a.node.id]={...INIT_NODES.start, ...a.node, status:"todo", startedAt:null, completedAt:null, detail:{w:[],u:[],c:[],i:[]}, checklistItems:null};
        if(a.removeEdge) newEdges = newEdges.filter(e=>e.id!==a.removeEdge);
      }
      if(a.type==="remove_node") delete newNodes[a.id];
      if(a.type==="update_node_label") { if(newNodes[a.id]) newNodes[a.id]={...newNodes[a.id], label:a.label}; }
      if(a.type==="update_exp") { if(newNodes[a.id]) newNodes[a.id]={...newNodes[a.id], expectedMinutes:a.value}; }
      if(a.type==="add_edge") newEdges.push(a.edge);
      if(a.type==="remove_edge") newEdges=newEdges.filter(e=>e.id!==a.id);
    });
    setNodes(newNodes); setEdges(newEdges); setPendingChg(null);
  },[pendingChg, nodes, edges]);

  const sel = selId ? nodes[selId] : null;
  const phaseGroups = getPhaseGroups(nodes);
  const totalNodes = Object.values(nodes).filter(n=>n.id!=="start"&&n.id!=="end").length;
  const doneNodes = Object.values(nodes).filter(n=>n.status==="done").length;
  const progress = totalNodes>0 ? Math.round(doneNodes/totalNodes*100) : 0;
  const sessionDuration = session.startedAt ? Date.now()-session.startedAt : 0;

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:DARK.bg,color:DARK.txt,fontFamily:"system-ui",overflow:"hidden",position:"relative"}}>

      {/* TOP BAR */}
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:DARK.surf,borderBottom:`1px solid ${DARK.border}`,flexShrink:0,flexWrap:"wrap"}}>
        <span style={{fontSize:13,fontWeight:600,color:"#a5b4fc",marginRight:4}}>⬡ Cursor Chain Tracker</span>
        <div style={{display:"flex",gap:4,flex:1,flexWrap:"wrap"}}>
          {!session.active
            ? <button onClick={startSession} style={btnStyle("#15803d")}>▶ Start Session</button>
            : <span style={{fontSize:11,color:"#4ade80",background:"#0a1f10",padding:"3px 8px",borderRadius:4,border:"1px solid #15803d"}}>⏱ {fmt(sessionDuration)}</span>
          }
          <button onClick={()=>setEditMode(e=>!e)} style={btnStyle(editMode?"#7c3aed":"#1e2535")}>{editMode?"✏ Edit Mode ON":"✏ Arrange"}</button>
          <button onClick={copyTicket} style={btnStyle("#1e2535")}>📋 Copy Ticket</button>
          <button onClick={()=>save(nodes,session,sessionLog,notes)} style={btnStyle("#1e2535")}>💾 Save</button>
          <button onClick={resetAll} style={btnStyle("#3f0a0a")}>↺ Reset</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11}}>
          <div style={{width:80,height:6,background:"#1e2535",borderRadius:3,overflow:"hidden"}}>
            <div style={{width:`${progress}%`,height:"100%",background:"#15803d",borderRadius:3,transition:"width 0.3s"}}/>
          </div>
          <span style={{color:DARK.sub}}>{progress}% ({doneNodes}/{totalNodes+2})</span>
        </div>
      </div>

      {/* MAIN AREA */}
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>

        {/* CANVAS */}
        <div ref={svgContainerRef} style={{flex:1,overflow:"hidden",position:"relative",cursor:panning?"grabbing":"default"}}
          onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
          <svg ref={svgRef} width="100%" height="100%"
            onMouseDown={onSvgMouseDown}
            style={{display:"block",userSelect:"none"}}>
            <defs>
              <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
            </defs>
            <g transform={`translate(${vt.x},${vt.y}) scale(${vt.scale})`}>
              {/* Phase groups */}
              {Object.entries(phaseGroups).map(([ph,{minY,maxY}])=>(
                <g key={ph}>
                  <rect x={240} y={minY} width={420} height={maxY-minY} rx={8}
                    fill={PHASE_COLORS[ph]||"transparent"} stroke="#1c2540" strokeWidth={0.5} opacity={0.8}/>
                  <text x={248} y={minY+14} fill="#4b5980" fontSize={10} fontFamily="system-ui">{PHASE_NAMES[ph]}</text>
                </g>
              ))}

              {/* Edges */}
              {edges.map(e=>{
                const fn=nodes[e.from], tn=nodes[e.to];
                if(!fn||!tn) return null;
                const d=buildEdgePath(e,nodes);
                const isActive = fn.status==="done"||fn.status==="active";
                const edgeColor = isActive ? "#6366f1" : "#2a3550";
                const midPt = (() => {
                  if(e.loop) { const [fx,fy]=getConnPt(fn,"left"); return [fx-90, (fy+getConnPt(tn,"left")[1])/2]; }
                  if(Math.abs(fn.y-tn.y)<15) return [(fn.x+tn.x)/2, fn.y-12];
                  return [fn.x, (fn.y+getConnPt(fn,"bottom")[1]/2 + tn.y-getConnPt(tn,"top")[1]/2)/2];
                })();
                return (
                  <g key={e.id}>
                    <path d={d} fill="none" stroke={edgeColor} strokeWidth={1.5}
                      markerEnd="url(#arr)" strokeDasharray={e.loop?"5 3":"none"} opacity={0.7}/>
                    {e.label && <text x={e.loop?fn.x-90:fn.x+8} y={e.loop?(fn.y+tn.y)/2:fn.y+30}
                      fill={e.label.includes("✓")?"#4ade80":e.label.includes("✗")?"#f87171":"#7c8db8"}
                      fontSize={10} fontFamily="system-ui" fontWeight={500}>{e.label}</text>}
                  </g>
                );
              })}

              {/* Nodes */}
              {Object.values(nodes).map(node=>(
                <NodeShape key={node.id} node={node} isSelected={selId===node.id}
                  now={now} editMode={editMode}
                  onMouseDown={onNodeMouseDown} onClick={onNodeClick} onDblClick={onNodeDblClick}/>
              ))}
            </g>
          </svg>
          <div style={{position:"absolute",bottom:8,right:8,display:"flex",gap:4}}>
            <button onClick={()=>setVt(v=>({...v,scale:Math.min(v.scale*1.2,2.5)}))} style={zBtn}>+</button>
            <button onClick={()=>setVt(v=>({...v,scale:Math.max(v.scale*0.8,0.2)}))} style={zBtn}>−</button>
            <button onClick={()=>setVt({x:-100,y:-10,scale:0.44})} style={zBtn}>⌂</button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{width:320,background:DARK.surf,borderLeft:`1px solid ${DARK.border}`,display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"}}>
          {/* Node header */}
          {sel && (
            <div style={{padding:"10px 12px",borderBottom:`1px solid ${DARK.border}`,flexShrink:0}}>
              <div style={{fontSize:12,fontWeight:600,color:"#a5b4fc",marginBottom:4,lineHeight:1.3}}>{sel.label.replace(/\n/g:" → ")}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {(["todo","active","done","blocked"]).map(s=>(
                  <button key={s} onClick={()=>setNodeStatus(sel.id,s)} style={{
                    fontSize:10,padding:"2px 7px",borderRadius:3,border:`1px solid ${STATUS_C[s]}33`,
                    background:sel.status===s?STATUS_C[s]+"22":"transparent",
                    color:sel.status===s?STATUS_C[s]:DARK.sub,cursor:"pointer",fontFamily:"system-ui"
                  }}>{s}</button>
                ))}
                {sel.bypassable && !sel.bypassed && (
                  <button onClick={()=>{setBypassModal({nodeId:sel.id}); setBypassReason("");}} style={{
                    fontSize:10,padding:"2px 7px",borderRadius:3,border:"1px solid #0891b233",
                    background:"transparent",color:"#0891b2",cursor:"pointer",fontFamily:"system-ui"
                  }}>Skip ↷</button>
                )}
                {sel.escalationReturnNode && sel.status!=="done" && (
                  <button onClick={()=>setNodeStatus(sel.id,"done")} style={{
                    fontSize:10,padding:"2px 7px",borderRadius:3,border:"1px solid #c2410c",
                    background:"#3a0d03",color:"#fb923c",cursor:"pointer",fontFamily:"system-ui"
                  }}>↩ Resolved</button>
                )}
              </div>
              {sel.expectedMinutes>0 && (
                <div style={{fontSize:10,color:DARK.sub,marginTop:4}}>
                  Expected: {sel.expectedMinutes}min
                  {sel.startedAt && <span style={{marginLeft:6,color: (now-sel.startedAt)/60000>sel.expectedMinutes*2?"#ca8a04":"#4b5980"}}>
                    · Elapsed: {fmt(now-sel.startedAt)}
                  </span>}
                </div>
              )}
            </div>
          )}
          {!sel && (
            <div style={{padding:"12px",borderBottom:`1px solid ${DARK.border}`,fontSize:11,color:DARK.sub}}>
              Click a node to view details
            </div>
          )}

          {/* Tabs */}
          <div style={{display:"flex",borderBottom:`1px solid ${DARK.border}`,flexShrink:0}}>
            {["details","ai","notes","progress"].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{
                flex:1,padding:"7px 0",fontSize:10,border:"none",cursor:"pointer",fontFamily:"system-ui",fontWeight:tab===t?600:400,
                background:tab===t?"#1a2040":"transparent",
                color:tab===t?"#a5b4fc":DARK.sub,
                borderBottom:tab===t?`2px solid #6366f1`:"2px solid transparent",
              }}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{flex:1,overflowY:"auto",overflowX:"hidden"}}>
            {tab==="details" && <DetailsTab sel={sel} nodes={nodes} updateNodes={updateNodes}/>}
            {tab==="ai" && <AITab aiMsgs={aiMsgs} aiInput={aiInput} setAiInput={setAiInput} aiLoading={aiLoading} sendAi={sendAi} aiEditMode={aiEditMode} setAiEditMode={setAiEditMode} pendingChg={pendingChg} applyChange={applyChange} setPendingChg={setPendingChg} DARK={DARK}/>}
            {tab==="notes" && <NotesTab sel={sel} notes={notes} setNotes={setNotes} sessionLog={sessionLog} DARK={DARK} save={()=>save(nodes,session,sessionLog,notes)}/>}
            {tab==="progress" && <ProgressTab nodes={nodes} session={session} sessionDuration={sessionDuration} progress={progress} doneNodes={doneNodes} totalNodes={totalNodes} now={now} setSelId={setSelId} setTab={setTab} DARK={DARK}/>}
          </div>
        </div>
      </div>

      {/* BYPASS MODAL */}
      {bypassModal && (
        <ModalOverlay>
          <div style={{background:DARK.surf,border:`1px solid ${DARK.border}`,borderRadius:8,padding:20,maxWidth:380,width:"90%"}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:8,color:"#0891b2"}}>Skip ↷ — {nodes[bypassModal.nodeId]?.label.replace(/\n/g:" ")}</div>
            <div style={{fontSize:11,color:DARK.sub,marginBottom:12}}>This step is optional. Provide a reason for skipping (or leave blank).</div>
            <textarea value={bypassReason} onChange={e=>setBypassReason(e.target.value)}
              placeholder="Reason for bypassing..."
              style={{width:"100%",height:60,background:"#0e1220",border:`1px solid ${DARK.border}`,borderRadius:4,color:DARK.txt,fontSize:11,padding:8,resize:"vertical",fontFamily:"system-ui",boxSizing:"border-box"}}/>
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <button onClick={confirmBypass} style={btnStyle("#0891b2")}>Confirm Skip ↷</button>
              <button onClick={()=>{setBypassModal(null);setBypassReason("");}} style={btnStyle("#1e2535")}>Cancel</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* DOWNSTREAM MODAL */}
      {downstreamModal && (
        <ModalOverlay>
          <div style={{background:DARK.surf,border:`1px solid #ca8a04`,borderRadius:8,padding:20,maxWidth:400,width:"90%"}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:8,color:"#ca8a04"}}>⚠ Downstream Alert</div>
            <div style={{fontSize:11,color:DARK.sub,marginBottom:10}}>
              Marking <strong style={{color:DARK.txt}}>{downstreamModal.nodeLabel?.replace(/\n/g:" ")}</strong> as <strong style={{color:STATUS_C[downstreamModal.newStatus]}}>{downstreamModal.newStatus}</strong> affects downstream nodes already in progress:
            </div>
            <ul style={{margin:"0 0 12px",padding:"0 0 0 16px",fontSize:11,color:"#f87171"}}>
              {downstreamModal.affected.map(nid=>(
                <li key={nid}>{nodes[nid]?.label.replace(/\n/g:" ")} ({nodes[nid]?.status})</li>
              ))}
            </ul>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{const m=downstreamModal;setDownstreamModal(null);setNodeStatus(m.nodeId,m.newStatus,true);}} style={btnStyle("#ca8a04","#0a0d14")}>Proceed Anyway</button>
              <button onClick={()=>setDownstreamModal(null)} style={btnStyle("#1e2535")}>Cancel</button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

// ─── DETAILS TAB ──────────────────────────────────────────────────────────────
function DetailsTab({sel, nodes, updateNodes}) {
  if(!sel) return <div style={{padding:16,fontSize:11,color:DARK.sub}}>Select a node to view its walk-up checklist, execution steps, and completion criteria.</div>;

  const Section = ({title, items, color="#4b5980"}) => items?.length>0 && (
    <div style={{marginBottom:12}}>
      <div style={{fontSize:10,fontWeight:600,color:color,marginBottom:4,textTransform:"uppercase",letterSpacing:0.5}}>{title}</div>
      {items.map((item,i)=>(
        <div key={i} style={{display:"flex",gap:6,alignItems:"flex-start",marginBottom:3}}>
          <span style={{color:color,fontSize:10,marginTop:1,flexShrink:0}}>›</span>
          <span style={{fontSize:11,color:DARK.txt,lineHeight:1.4}}>{item}</span>
        </div>
      ))}
    </div>
  );

  if(sel.checklistItems) {
    const allCriticalPassing = sel.checklistItems.filter(ci=>ci.critical).every(ci=>ci.status==="pass");
    const updateCL = (idx, status) => {
      updateNodes(prev=>{
        const n={...prev};
        const nd={...n[sel.id]};
        nd.checklistItems=[...nd.checklistItems];
        nd.checklistItems[idx]={...nd.checklistItems[idx],status};
        n[sel.id]=nd;
        return n;
      });
    };
    return (
      <div style={{padding:12}}>
        <div style={{fontSize:11,fontWeight:600,color:"#a5b4fc",marginBottom:10}}>Final Quality Gate Checklist</div>
        {sel.checklistItems.map((ci,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:6,padding:"5px 8px",background:"#0e1220",borderRadius:4,border:`1px solid #1c2540`}}>
            <span style={{fontSize:10,color:ci.critical?"#f87171":"#4b5980",flexShrink:0}}>{ci.critical?"★":"○"}</span>
            <span style={{flex:1,fontSize:11,color:"#dde4f0",lineHeight:1.3}}>{ci.label}</span>
            {["pass","fail","skip"].map(s=>(
              <button key={s} onClick={()=>updateCL(i,s)} style={{
                fontSize:9,padding:"1px 5px",borderRadius:3,border:"1px solid",cursor:"pointer",fontFamily:"system-ui",
                borderColor:s==="pass"?"#15803d":s==="fail"?"#dc2626":"#4b5980",
                background:ci.status===s?(s==="pass"?"#0a1f10":s==="fail"?"#1f0a0a":"#1e2535"):"transparent",
                color:ci.status===s?(s==="pass"?"#4ade80":s==="fail"?"#f87171":"#94a3b8"):"#4b5980",
              }}>{s}</button>
            ))}
          </div>
        ))}
        {allCriticalPassing && (
          <div style={{marginTop:10,padding:"8px 12px",background:"#0a1f10",border:"1px solid #15803d",borderRadius:4,fontSize:11,color:"#4ade80",textAlign:"center",fontWeight:600}}>
            ✓ Ready to hand off — all critical items passing
          </div>
        )}
        <Section title="Walk-up" items={sel.detail.w} color="#6366f1"/>
        <Section title="Org-specific" items={sel.detail.i} color="#4b5980"/>
      </div>
    );
  }

  return (
    <div style={{padding:12}}>
      <Section title="Walk-up checklist" items={sel.detail.w} color="#6366f1"/>
      <Section title="During execution" items={sel.detail.u} color="#7c3aed"/>
      <Section title="Completion criteria" items={sel.detail.c} color="#15803d"/>
      <Section title="Org-specific info" items={sel.detail.i} color="#4b5980"/>
    </div>
  );
}

// ─── AI TAB ───────────────────────────────────────────────────────────────────
function AITab({aiMsgs, aiInput, setAiInput, aiLoading, sendAi, aiEditMode, setAiEditMode, pendingChg, applyChange, setPendingChg, DARK}) {
  const endRef = useRef();
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[aiMsgs]);
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <div style={{padding:"6px 10px",borderBottom:`1px solid ${DARK.border}`,display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
        <span style={{fontSize:10,color:DARK.sub,flex:1}}>AI Assistant</span>
        <button onClick={()=>setAiEditMode(e=>!e)} style={{
          fontSize:9,padding:"2px 6px",borderRadius:3,border:`1px solid ${aiEditMode?"#6366f1":"#1c2540"}`,
          background:aiEditMode?"#1a1040":"transparent",color:aiEditMode?"#a5b4fc":DARK.sub,cursor:"pointer",fontFamily:"system-ui"
        }}>{aiEditMode?"✏ Edit Mode ON":"✏ Edit Mode"}</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:10,display:"flex",flexDirection:"column",gap:8}}>
        {aiMsgs.length===0 && (
          <div style={{fontSize:11,color:DARK.sub,textAlign:"center",paddingTop:20}}>
            Ask anything about the current step, troubleshoot errors, or request flowchart edits.
          </div>
        )}
        {aiMsgs.map((m,i)=>(
          <div key={i} style={{
            padding:"7px 9px",borderRadius:5,fontSize:11,lineHeight:1.5,
            background:m.role==="user"?"#1a1040":"#0e1424",
            alignSelf:m.role==="user"?"flex-end":"flex-start",
            maxWidth:"95%",border:`1px solid ${m.role==="user"?"#6366f133":"#1c2540"}`,
            color:DARK.txt,whiteSpace:"pre-wrap",wordBreak:"break-word",
          }}>{m.content.replace(/\[FLOWCHART_CHANGE\][\s\S]*?\[\/FLOWCHART_CHANGE\]/,"[flowchart change pending]")}</div>
        ))}
        {aiLoading && <div style={{fontSize:11,color:DARK.sub,textAlign:"center"}}>Thinking…</div>}
        {pendingChg && (
          <div style={{padding:"8px 10px",background:"#0e1424",border:"1px solid #6366f1",borderRadius:5}}>
            <div style={{fontSize:10,fontWeight:600,color:"#a5b4fc",marginBottom:4}}>Proposed Change</div>
            <div style={{fontSize:11,color:DARK.txt,marginBottom:8}}>{pendingChg.summary||"Flowchart modification"}</div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={applyChange} style={btnStyle("#6366f1")}>Apply</button>
              <button onClick={()=>setPendingChg(null)} style={btnStyle("#1e2535")}>Dismiss</button>
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>
      <div style={{padding:"8px 10px",borderTop:`1px solid ${DARK.border}`,flexShrink:0,display:"flex",gap:6}}>
        <input value={aiInput} onChange={e=>setAiInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),sendAi())}
          placeholder="Ask about this step…"
          style={{flex:1,background:"#0e1220",border:`1px solid ${DARK.border}`,borderRadius:4,color:DARK.txt,fontSize:11,padding:"5px 8px",fontFamily:"system-ui",outline:"none"}}/>
        <button onClick={()=>sendAi()} disabled={aiLoading||!aiInput.trim()} style={{...btnStyle("#6366f1"),opacity:aiLoading||!aiInput.trim()?0.4:1,flexShrink:0}}>→</button>
      </div>
    </div>
  );
}

// ─── NOTES TAB ────────────────────────────────────────────────────────────────
function NotesTab({sel, notes, setNotes, sessionLog, DARK, save}) {
  const nodeNote = sel ? (notes[sel.id]||"") : "";
  return (
    <div style={{padding:10,display:"flex",flexDirection:"column",gap:10}}>
      {sel && (
        <div>
          <div style={{fontSize:10,fontWeight:600,color:"#a5b4fc",marginBottom:4}}>Notes — {sel.label.replace(/\n/g:" ")}</div>
          <textarea value={nodeNote}
            onChange={e=>{
              const newNotes={...notes,[sel.id]:e.target.value};
              setNotes(newNotes);
            }}
            placeholder="Add notes for this step…"
            style={{width:"100%",height:90,background:"#0e1220",border:"1px solid #1c2540",borderRadius:4,color:"#dde4f0",fontSize:11,padding:8,resize:"vertical",fontFamily:"system-ui",boxSizing:"border-box"}}/>
        </div>
      )}
      <div>
        <div style={{fontSize:10,fontWeight:600,color:"#4b5980",marginBottom:4}}>Session Log</div>
        {sessionLog.length===0 && <div style={{fontSize:10,color:"#4b5980"}}>No events yet.</div>}
        <div style={{maxHeight:300,overflowY:"auto",display:"flex",flexDirection:"column",gap:2}}>
          {[...sessionLog].reverse().map((e,i)=>(
            <div key={i} style={{fontSize:10,padding:"3px 6px",background:"#0e1220",borderRadius:3,borderLeft:`2px solid ${e.nodeId?"#6366f144":"#15803d44"}`}}>
              <span style={{color:"#4b5980"}}>{fmtTs(e.ts)}</span>
              {e.nodeLabel && <span style={{color:"#7c8db8",marginLeft:4}}>{e.nodeLabel.replace(/\n/g:" ")}</span>}
              <span style={{color:"#dde4f0",marginLeft:4}}>{e.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PROGRESS TAB ────────────────────────────────────────────────────────────
function ProgressTab({nodes, session, sessionDuration, progress, doneNodes, totalNodes, now, setSelId, setTab, DARK}) {
  const orderedNodes = NODES_CFG.map(n=>nodes[n.id]).filter(Boolean);
  return (
    <div style={{padding:10}}>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        {[["Done",doneNodes,"#15803d"],["Active",Object.values(nodes).filter(n=>n.status==="active").length,"#7c3aed"],["Blocked",Object.values(nodes).filter(n=>n.status==="blocked").length,"#dc2626"]].map(([l,v,c])=>(
          <div key={l} style={{flex:1,padding:"6px 8px",background:"#0e1220",borderRadius:4,border:`1px solid ${c}22`,textAlign:"center"}}>
            <div style={{fontSize:16,fontWeight:600,color:c}}>{v}</div>
            <div style={{fontSize:9,color:DARK.sub}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:DARK.sub,marginBottom:3}}>
          <span>Overall Progress</span><span>{progress}%</span>
        </div>
        <div style={{height:6,background:"#1e2535",borderRadius:3,overflow:"hidden"}}>
          <div style={{width:`${progress}%`,height:"100%",background:"#6366f1",borderRadius:3,transition:"width 0.4s"}}/>
        </div>
      </div>
      <div style={{fontSize:10,fontWeight:600,color:"#4b5980",marginBottom:6}}>All Steps</div>
      <div style={{display:"flex",flexDirection:"column",gap:2}}>
        {orderedNodes.map(n=>{
          const elapsed = n.startedAt ? (now-n.startedAt)/1000/60 : 0;
          const ot = n.startedAt && n.expectedMinutes>0 && elapsed>n.expectedMinutes*2;
          return (
            <div key={n.id} onClick={()=>{setSelId(n.id);setTab("details");}}
              style={{display:"flex",alignItems:"center",gap:6,padding:"4px 6px",background:"#0e1220",borderRadius:3,cursor:"pointer",border:`1px solid ${DARK.border}`}}>              <div style={{width:6,height:6,borderRadius:"50%",background:STATUS_C[n.status],flexShrink:0}}/>
              {ot && <span style={{fontSize:9,color:"#ca8a04",flexShrink:0}}>⚠</span>}
              <span style={{flex:1,fontSize:10,color:"#dde4f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.label.replace(/\n/g:" ")}</span>
              {n.completedAt && <span style={{fontSize:9,color:"#4b5980",flexShrink:0}}>{fmtTs(n.completedAt)}</span>}
              {n.status==="active" && n.startedAt && <span style={{fontSize:9,color:"#7c3aed",flexShrink:0}}>{fmt(now-n.startedAt)}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MODAL OVERLAY ────────────────────────────────────────────────────────────
function ModalOverlay({children}) {
  return (
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
      {children}
    </div>
  );
}

// ─── STYLE HELPERS ────────────────────────────────────────────────────────────
function btnStyle(bg, color="#dde4f0") {
  return {padding:"3px 9px",fontSize:11,borderRadius:4,border:`1px solid ${bg}44`,background:bg,color,cursor:"pointer",fontFamily:"system-ui",fontWeight:500};
}
const zBtn = {padding:"3px 7px",fontSize:13,borderRadius:4,border:"1px solid #1c2540",background:"#0e1220",color:"#7c8db8",cursor:"pointer",fontFamily:"system-ui"};
