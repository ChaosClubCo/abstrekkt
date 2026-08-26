import { useState, useRef, useEffect, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────
const B = {
  bg:'#0f172a', surface:'#1e293b', s2:'#273549', border:'#334155',
  text:'#e2e8f0', muted:'#94a3b8', primary:'#7c3aed', accent:'#a78bfa',
  done:'#166534', doneT:'#86efac', active:'#6d28d9', blocked:'#dc2626',
  esc:'#ea580c', yellow:'#ca8a04', bypass:'#78350f',
};
const NW = { terminal:200, process:200, decision:160, escalation:200, checklist:200 };
const NH = { terminal:50,  process:65,  decision:70,  escalation:65,  checklist:65  };
const SC = { todo:'#475569', active:'#6d28d9', done:'#166534', blocked:'#dc2626', bypassed:'#78350f' };
const SK = 'cs-flow-v2';
const DC = { orgName:'', agentName:'', platformUrl:'make.preview.microsoft.com', channel:'Microsoft Teams', tools:'', escalation:'', failures:'', facts:'' };
const TABS = ['details','ai','notes','progress','config'];
const TL   = { details:'≡ Detail', ai:'✦ AI', notes:'✐ Notes', progress:'◑ Prog', config:'⚙ Config' };
// Input style at module scope so it's stable across renders
const IS = { width:'100%', background:B.s2, border:`1px solid ${B.border}`, borderRadius:4, color:B.text, fontSize:11, padding:'6px 8px', boxSizing:'border-box', outline:'none' };

// ─── Default data ─────────────────────────────────────────────
const DN = [
  { id:'start', type:'terminal', label:'Define Agent Purpose & Scope', x:350, y:40, status:'todo', expectedMins:10, bypassable:false,
    detail:{ w:['Identify the business problem this agent solves','Define end users and how they access the agent','List the top 5–10 tasks the agent must handle','Write the scope fence: what the agent must NOT do'], u:['Vague scope = scope creep. Write it down before touching Studio.'], c:['Purpose written in one sentence','Audience and channel confirmed','Scope fence documented'], i:['Channel options: Teams, SharePoint, public web, custom — check licensing'] }},
  { id:'instructions', type:'process', label:'Write Agent Instructions', x:350, y:155, status:'todo', expectedMins:15, bypassable:false,
    detail:{ w:['Overview > Instructions > Edit','Write 6 sections: Role, Scope, Behavior Rules, Process Logic, Output Format, Fallback','Token-check — aim for ≤400 tokens'], u:['No step-by-step procedures here — those go in Topics','Use ## headers + imperative bullets, not prose'], c:['Instructions ≤400 tokens (verified)','All 6 sections present'], i:['Token estimate: ~4 chars/token. 400 tokens ≈ 1,600 chars','Tokenizer: platform.openai.com/tokenizer'] }},
  { id:'knowledge', type:'checklist', label:'Configure Knowledge Sources', x:350, y:290, status:'todo', expectedMins:20, bypassable:false,
    checklist:[
      { id:'k1', label:'SharePoint site or document library', critical:true  },
      { id:'k2', label:'Uploaded file group (runbooks, SLAs, reference docs)', critical:true  },
      { id:'k3', label:'Dataverse table (structured/live data)', critical:false },
      { id:'k4', label:'Public website (org-owned domain only)', critical:false },
      { id:'k5', label:'Teams/Outlook knowledge — verify scope before enabling', critical:false },
    ],
    detail:{ w:['Overview > Knowledge > Add knowledge','Each source needs a unique name AND detailed description field','For file groups: enable grouping toggle, add instructions'], u:['Source description field = how the orchestrator selects this source. Vague = wrong source.','Public websites: org-owned domains only. 25 limit (gen orchestration), 4 (classic).'], c:['All ★ critical sources added with detailed descriptions'], i:['Tenant graph grounding requires: auth = Authenticate with Microsoft + M365 Copilot license'] }},
  { id:'topics', type:'process', label:'Author Topics & Suggested Prompts', x:350, y:435, status:'todo', expectedMins:30, bypassable:false,
    detail:{ w:['Create a topic for each major use case','Set trigger = "The agent chooses" + write a descriptive trigger condition','Overview > Suggested Prompts > add up to 10'], u:['Trigger condition description = most critical field in gen orchestration','Always create an escalation topic and a fallback/out-of-scope topic'], c:['Topics created with descriptive trigger conditions','8–10 suggested prompts added','Fallback and escalation topics tested'], i:['Suggested prompts appear on Teams/M365 welcome screen — not visible in Studio test chat'] }},
  { id:'tools', type:'process', label:'Add Tools & Integrations', x:350, y:560, status:'todo', expectedMins:20, bypassable:false,
    detail:{ w:['Overview > Tools > Add a tool','Add connectors for required systems (Teams, Outlook, Dataverse, REST APIs)','Each tool: write a clear purpose description'], u:['Tool description = mini system prompt for the orchestrator. Vague = wrong tool called.','Max 25–30 tools for performance'], c:['All required tools added with clear purpose descriptions','Auth configured and tested for each tool'], i:['Custom REST API: never hardcode API keys — use Power Platform environment variables'] }},
  { id:'integration_dec', type:'decision', label:'External System Integration Required?', x:370, y:690, status:'todo', expectedMins:3, bypassable:false,
    detail:{ w:['Check if agent needs to read/write an external system','Verify if a Power Platform connector exists for that system'], u:['No native connector = custom REST API connector needed (PP Admin required)'], c:['Confirmed: YES or NO'], i:['Connector catalog: PP admin center > Data > Connectors'] }},
  { id:'config_integration', type:'process', label:'Configure External System Integration', x:650, y:830, status:'todo', expectedMins:25, bypassable:false,
    detail:{ w:['Tools > Add tool > New tool > REST API','Set base URL, required endpoints, auth method','Auth: source API key from PP environment variable — NEVER hardcode'], u:['SECURITY: hardcoded API keys = secrets in source. Use PP env vars only.'], c:['Integration tool created and tested','Test call confirms connectivity'], i:['PP env vars: PP admin center > Environments > [Env] > Settings > Environment variables'] }},
  { id:'integration_blocker', type:'escalation', label:'ESCALATE: Integration Blocker — Admin Required', x:100, y:830, status:'todo', expectedMins:0, bypassable:false,
    detail:{ w:['Document: system name, base URL, required endpoints, auth type','Submit to Power Platform Admin or system owner','Interim: Dataverse staging table while waiting'], u:['Blocker — automated integration incomplete without this'], c:['Escalation submitted with full integration spec','Interim workaround documented'], i:['Targets: PP Admin (connector), System Admin (API credentials)'] }},
  { id:'triggers', type:'process', label:'Configure Event Triggers', x:350, y:980, status:'todo', expectedMins:20, bypassable:true, bypassReason:'Skip if agent will be interactive-only — no autonomous/unattended operation needed',
    detail:{ w:['Overview > Triggers > Add trigger','Add: Dataverse row changes, incoming emails, Teams messages, recurrence','Set payload instructions to extract required fields'], u:['CRITICAL: triggers use maker credentials. Use a dedicated service account — not personal creds.','Each trigger delivery = 1 Copilot Studio message (billing impact)','Generative orchestration must be ON — triggers do not appear otherwise'], c:['Triggers configured with service account auth','Test trigger fires in Activity > Run history'], i:['Service account format: svc-[agentname]@yourdomain.com'] }},
  { id:'auth_dec', type:'decision', label:'Auth & Licensing Confirmed?', x:370, y:1115, status:'todo', expectedMins:3, bypassable:false,
    detail:{ w:['Verify auth method: Settings > Security > Authentication','Verify all required licenses assigned','Verify service account permissions for connectors and triggers'], u:['Auth = Authenticate with Microsoft unlocks tenant graph grounding','Missing license = features silently unavailable'], c:['Auth method confirmed','Licenses assigned','Service account permissions confirmed'], i:['Tenant graph grounding: Authenticate with Microsoft + M365 Copilot license'] }},
  { id:'auth_blocker', type:'escalation', label:'ESCALATE: Auth or License Blocker', x:100, y:1255, status:'todo', expectedMins:0, bypassable:false,
    detail:{ w:['Document what is missing: auth method, license, service account permissions','Submit to IT Admin / PP Admin / License Admin'], u:['Do not publish to production until resolved'], c:['Escalation submitted','Workaround confirmed before proceeding'], i:['License check: M365 admin center > Billing > Licenses'] }},
  { id:'security', type:'process', label:'Security & Channel Configuration', x:350, y:1400, status:'todo', expectedMins:15, bypassable:false,
    detail:{ w:['Settings > Security > Authentication → Authenticate with Microsoft','Publish > Channels → add primary channel','Do NOT publish to public web unless explicitly approved','Verify permissions with a low-privilege test user'], u:['Public web = internet-accessible. Avoid for internal agents.'], c:['Auth method confirmed','Primary channel configured and tested','No unintended channels enabled','Permission-scoped knowledge verified'], i:['Channels: Publish > Channels in Copilot Studio left nav'] }},
  { id:'qc_gate', type:'checklist', label:'QC Gate — Pre-Publish', x:350, y:1540, status:'todo', expectedMins:20, bypassable:false, qcGate:true,
    checklist:[
      { id:'qc1', label:'Generative orchestration enabled (if required)',           critical:true  },
      { id:'qc2', label:'Service account on trigger auth — not personal creds',     critical:true  },
      { id:'qc3', label:'Instructions ≤400 tokens — verified with tokenizer',       critical:true  },
      { id:'qc4', label:'Scope fence tested — out-of-scope questions rejected',     critical:true  },
      { id:'qc5', label:'Knowledge source descriptions are detailed',               critical:true  },
      { id:'qc6', label:'All escalation paths tested end-to-end',                   critical:false },
      { id:'qc7', label:'All 10 suggested prompts configured',                      critical:false },
      { id:'qc8', label:'Day-7 analytics review scheduled',                         critical:false },
    ],
    detail:{ w:['★ critical = must pass before publishing','○ recommended = complete if time allows'], u:['Token check: platform.openai.com/tokenizer','Scope fence test: send 3 out-of-scope messages, verify rejection'], c:['All ★ critical items = pass','Ready to Publish banner visible'], i:['Tokenizer: platform.openai.com/tokenizer'] }},
  { id:'publish', type:'process', label:'Publish & Test', x:350, y:1700, status:'todo', expectedMins:20, bypassable:false,
    detail:{ w:['Publish agent (top right of Studio)','Deploy to primary channel','Run 5 test scenarios: main use case, edge case, escalation, out-of-scope, empty input'], u:['Teams: type "hello" to trigger Greeting — ConversationStart does NOT auto-fire','Stale responses: /debug clearstate in Teams chat forces session reset'], c:['All 5 scenarios produce correct output','Escalation paths route correctly','Out-of-scope rejection works'], i:['Activity tab in Studio traces each run end-to-end'] }},
  { id:'end', type:'terminal', label:'Agent Live — Monitor & Iterate', x:350, y:1850, status:'todo', expectedMins:5, bypassable:false,
    detail:{ w:['Overview > Analytics — verify data flows after first real conversations','Set 7-day reminder for unanswered questions review','Schedule monthly prompt refinement'], u:['Unanswered questions theme analysis activates after 50+ weekly questions'], c:['Analytics data flowing','Refinement review scheduled','Agent documented in internal KB'], i:['Analytics refresh: near-real-time (autonomous), ~24h (conversational)'] }},
];

const DE = [
  { id:'e1',  from:'start',               to:'instructions'       },
  { id:'e2',  from:'instructions',         to:'knowledge'          },
  { id:'e3',  from:'knowledge',            to:'topics'             },
  { id:'e4',  from:'topics',               to:'tools'              },
  { id:'e5',  from:'tools',                to:'integration_dec'    },
  { id:'e6',  from:'integration_dec',      to:'config_integration', label:'YES' },
  { id:'e7',  from:'integration_dec',      to:'integration_blocker',label:'NO'  },
  { id:'e8',  from:'config_integration',   to:'triggers'           },
  { id:'e9',  from:'integration_blocker',  to:'triggers',           label:'resolved' },
  { id:'e10', from:'triggers',             to:'auth_dec'           },
  { id:'e11', from:'auth_dec',             to:'security',           label:'YES' },
  { id:'e12', from:'auth_dec',             to:'auth_blocker',       label:'NO'  },
  { id:'e13', from:'auth_blocker',         to:'security',           label:'resolved' },
  { id:'e14', from:'security',             to:'qc_gate'            },
  { id:'e15', from:'qc_gate',              to:'publish'            },
  { id:'e16', from:'publish',              to:'end'                },
];

// ─── Generation schema ────────────────────────────────────────
const GS = `You are generating a Microsoft Copilot Studio process flowchart. Return ONLY a valid JSON object — no markdown, no explanation, no preamble.
STRUCTURE:
{"nodes":[{"id":"snake_id","type":"terminal|process|decision|escalation|checklist","label":"max 38 chars","x":350,"y":40,"status":"todo","expectedMins":5,"bypassable":false,"bypassReason":"only if bypassable=true","qcGate":false,"checklist":[{"id":"c1","label":"item","critical":true}],"detail":{"w":["walk-up step"],"u":["during"],"c":["completion criterion"],"i":["org info"]}}],"edges":[{"id":"e1","from":"node_id","to":"node_id","label":"optional"}]}
LAYOUT: main spine x=350 (decisions x=370), right branch x=650, left/escalation x=100. Start y=40, +140 per spine step. Branch y = decision_y+140. Converge ~140px below branches.
REQUIREMENTS: 8–18 nodes. Terminal start+end. ≥1 decision with YES/NO edges. ≥1 escalation on NO path. ≥1 checklist with qcGate:true near end. Bypassable nodes include bypassReason. Detail arrays: 2–4 items each. Return ONLY the JSON object.`;

// ─── Utilities ────────────────────────────────────────────────
async function sGet(k) { try { const r = await window.storage?.get(k); return r?.value ? JSON.parse(r.value) : null; } catch { return null; } }
async function sSet(k, v) { try { await window.storage?.set(k, JSON.stringify(v)); } catch(e) { console.warn('Storage write failed:', e); } }

const nB = n => { const w = NW[n.type]||200, h = NH[n.type]||65; return { x:n.x, y:n.y, w, h, cx:n.x+w/2, cy:n.y+h/2 }; };

function ePath(s, t) {
  const a = nB(s), b = nB(t), dx = b.cx - a.cx;
  if (Math.abs(dx) < 80) return `M${a.cx},${a.y+a.h}C${a.cx},${a.y+a.h+70}${b.cx},${b.y-70}${b.cx},${b.y}`;
  if (dx > 0) return `M${a.x+a.w},${a.cy}C${a.x+a.w+75},${a.cy}${b.x-75},${b.cy}${b.x},${b.cy}`;
  return `M${a.x},${a.cy}C${a.x-75},${a.cy}${b.x+b.w+75},${b.cy}${b.x+b.w},${b.cy}`;
}

function wrap(t, max = 20) {
  const ws = t.split(' '); const ls = []; let l = '';
  for (const w of ws) {
    if ((l + ' ' + w).trim().length > max) { if (l) ls.push(l); l = w; }
    else l = (l + ' ' + w).trim();
  }
  if (l) ls.push(l);
  return ls.length ? ls : [t]; // FIX: never return empty array
}

function fmt(s) { return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }

function buildSys(cfg, node) {
  return [
    'You are an embedded assistant inside a Copilot Studio process flowchart tool.',
    `ORG: ${cfg.orgName || '(not set — configure in Config tab)'}`,
    `AGENT: ${cfg.agentName || '(not set)'}`,
    `PLATFORM: ${cfg.platformUrl || 'make.preview.microsoft.com'}`,
    `CHANNEL: ${cfg.channel || 'Microsoft Teams'}`,
    cfg.tools       && `TOOLS: ${cfg.tools}`,
    cfg.escalation  && `ESCALATION: ${cfg.escalation}`,
    cfg.failures    && `FAILURE MODES: ${cfg.failures}`,
    cfg.facts       && `ENV FACTS: ${cfg.facts}`,
    `ACTIVE NODE: ${node ? `${node.label} (${node.status})` : 'none'}`,
    'TONE: Mid-task operator. Direct. Lead with most likely fix. Exhaust current options before escalating.',
  ].filter(Boolean).join('\n');
}

function extractJSON(raw) {
  // FIX: robust extraction — find outermost { } pair instead of fragile regex
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) throw new Error('No JSON object found in model response');
  return raw.slice(start, end + 1);
}

function validateGenerated(parsed) {
  // FIX: validate + auto-repair generated structure before applying to canvas
  if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) throw new Error('Missing nodes or edges array');
  if (parsed.nodes.length < 2) throw new Error('Too few nodes generated');
  const validTypes = new Set(['terminal','process','decision','escalation','checklist']);
  const ids = new Set();
  for (const n of parsed.nodes) {
    if (!n.id || typeof n.id !== 'string') throw new Error('Node missing valid id');
    if (ids.has(n.id)) throw new Error(`Duplicate node ID: ${n.id}`);
    ids.add(n.id);
    if (!validTypes.has(n.type)) n.type = 'process';                          // coerce invalid type
    if (typeof n.x !== 'number' || isNaN(n.x)) n.x = 350;                     // coerce invalid coords
    if (typeof n.y !== 'number' || isNaN(n.y)) n.y = 40;
    if (!n.label || typeof n.label !== 'string') n.label = n.id;
    if (!n.status) n.status = 'todo';
    if (typeof n.expectedMins !== 'number') n.expectedMins = 5;
    if (!n.detail || typeof n.detail !== 'object') n.detail = { w:[], u:[], c:[], i:[] };
    ['w','u','c','i'].forEach(k => { if (!Array.isArray(n.detail[k])) n.detail[k] = []; });
    if (n.type === 'checklist' && !Array.isArray(n.checklist)) n.checklist = [];
    delete n.bypassReason; // clean up if bypassable:false but reason was included
    if (n.bypassable && n.bypassReason === undefined) n.bypassReason = 'Optional — skip if not applicable';
  }
  // FIX: remove edges referencing non-existent nodes silently
  parsed.edges = parsed.edges.filter(e =>
    e.id && ids.has(e.from) && ids.has(e.to) && e.from !== e.to
  );
  return parsed;
}

// ─── Main component ───────────────────────────────────────────
export default function CopilotFlow() {
  const [nodes,    setNodes]    = useState(DN);
  const [edges,    setEdges]    = useState(DE);
  const [sel,      setSel]      = useState(null);
  const [tab,      setTab]      = useState('details');
  const [editMode, setEditMode] = useState(false);
  const [session,  setSession]  = useState(null);
  const [elapsed,  setElapsed]  = useState(0);
  const [msgs,     setMsgs]     = useState([]);
  const [aiQ,      setAiQ]      = useState('');
  const [aiLoad,   setAiLoad]   = useState(false);
  const [aiEdit,   setAiEdit]   = useState(false);
  const [notes,    setNotes]    = useState({});
  const [noteIn,   setNoteIn]   = useState('');
  const [log,      setLog]      = useState([]);
  const [tf,       setTf]       = useState({ x:80, y:10, s:0.52 });
  const [panStart, setPanStart] = useState(null);
  const [dragNode, setDragNode] = useState(null);
  const [bypassM,  setBypassM]  = useState(null);
  const [bypassR,  setBypassR]  = useState('');
  const [downM,    setDownM]    = useState(null);
  const [cls,      setCls]      = useState({});
  const [nodeTs,   setNodeTs]   = useState({});
  const [cfg,      setCfg]      = useState(DC);
  const [genPr,    setGenPr]    = useState('');
  const [genLoad,  setGenLoad]  = useState(false);
  const [genErr,   setGenErr]   = useState('');
  const [genPrev,  setGenPrev]  = useState(null);
  const [copied,   setCopied]   = useState(false);  // FIX: copy feedback

  const cvs  = useRef(null);
  const nOff = useRef(null);
  const tfRef = useRef(tf);                          // FIX: stable ref for passive wheel handler

  const sn = sel ? nodes.find(n => n.id === sel) : null;

  // ─── Storage load ──────────────────────────────────────────
  useEffect(() => {
    sGet(SK).then(d => {
      if (!d) return;
      if (d.nodes)   setNodes(d.nodes);
      if (d.edges)   setEdges(d.edges);
      if (d.session) {
        setSession(d.session);
        setElapsed(Math.floor((Date.now() - d.session) / 1000)); // FIX: restore elapsed on reload
      }
      if (d.notes)   setNotes(d.notes);
      if (d.log)     setLog(d.log);
      if (d.cls)     setCls(d.cls);
      if (d.nodeTs)  setNodeTs(d.nodeTs);
      if (d.cfg)     setCfg({ ...DC, ...d.cfg });
    });
  }, []);

  // ─── Keep tfRef in sync ────────────────────────────────────
  useEffect(() => { tfRef.current = tf; }, [tf]);

  // ─── Passive wheel listener ────────────────────────────────
  // FIX: React's synthetic onWheel is passive in some environments — attach manually
  useEffect(() => {
    const el = cvs.current;
    if (!el) return;
    const handler = e => {
      e.preventDefault();
      const r  = el.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      const d  = e.deltaY < 0 ? 1.1 : 0.9;
      const t  = tfRef.current;
      const ns = Math.min(2.5, Math.max(0.15, t.s * d));
      setTf({ x: mx - (mx - t.x) * (ns / t.s), y: my - (my - t.y) * (ns / t.s), s: ns });
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []); // empty deps — tfRef always has current value

  // ─── Session timer ─────────────────────────────────────────
  useEffect(() => {
    if (!session) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - session) / 1000)), 1000);
    return () => clearInterval(t);
  }, [session]);

  // ─── Auto-save ─────────────────────────────────────────────
  useEffect(() => {
    sSet(SK, { nodes, edges, session, notes, log, cls, nodeTs, cfg });
  }, [nodes, edges, session, notes, log, cls, nodeTs, cfg]);

  // ─── Escape to close modals ────────────────────────────────
  // FIX: keyboard dismissal for modals
  useEffect(() => {
    const h = e => {
      if (e.key !== 'Escape') return;
      if (bypassM) setBypassM(null);
      if (downM)   setDownM(null);
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [bypassM, downM]);

  const cfgSet = (k, v) => setCfg(c => ({ ...c, [k]: v }));

  // ─── Downstream BFS ────────────────────────────────────────
  function downstream(id) {
    const vis = new Set(), q = [id], aff = [];
    while (q.length) {
      const c = q.shift();
      if (vis.has(c)) continue;
      vis.add(c);
      edges.filter(e => e.from === c).forEach(e => {
        const n = nodes.find(x => x.id === e.to);
        if (n && (n.status === 'active' || n.status === 'done') && !vis.has(e.to)) { aff.push(n); q.push(e.to); }
      });
    }
    return aff;
  }

  function setStatus(id, status, opts = {}) {
    const n = nodes.find(x => x.id === id);
    if (!n) return;
    if (status === 'done' && !opts.confirmed) {
      const aff = downstream(id);
      if (aff.length) { setDownM({ id, aff, status }); return; }
    }
    const ts = new Date().toLocaleTimeString();
    setLog(l => [...l, { ts, msg: `[${n.label}] → ${status}${opts.reason ? ` (${opts.reason})` : ''}` }]);
    if (status === 'active') setNodeTs(t => ({ ...t, [id]: Date.now() }));
    setNodes(ns => ns.map(x => x.id === id ? { ...x, status, ...(opts.bp !== undefined ? { bypassed: opts.bp } : {}) } : x));
    if (downM?.id === id) setDownM(null);
  }

  // FIX: guard against expectedMins=0 triggering overtime immediately
  function isOvertime(node) {
    if (node.status !== 'active' || !node.expectedMins) return false;
    const t = nodeTs[node.id];
    if (!t) return false;
    return (Date.now() - t) > node.expectedMins * 2 * 60 * 1000;
  }

  // ─── Canvas interaction ────────────────────────────────────
  function onCMD(e) {
    if (e.button !== 0) return;
    // FIX: null-safe closest for SVG elements
    if (e.target?.closest?.('[data-nid]')) return;
    setPanStart({ x: e.clientX - tf.x, y: e.clientY - tf.y });
  }
  function onCMM(e) {
    if (panStart) setTf(t => ({ ...t, x: e.clientX - panStart.x, y: e.clientY - panStart.y }));
    if (dragNode && editMode) {
      const r  = cvs.current.getBoundingClientRect();
      const x  = (e.clientX - r.left  - tf.x) / tf.s - (nOff.current?.ox || 0);
      const y  = (e.clientY - r.top   - tf.y - 44) / tf.s - (nOff.current?.oy || 0);
      setNodes(ns => ns.map(n => n.id === dragNode ? { ...n, x: Math.round(x), y: Math.round(y) } : n));
    }
  }
  function onCMU() { setPanStart(null); setDragNode(null); }

  function onNMD(e, node) {
    if (!editMode) return;
    e.stopPropagation();
    const r = cvs.current.getBoundingClientRect();
    nOff.current = { ox: (e.clientX - r.left - tf.x) / tf.s - node.x, oy: (e.clientY - r.top - tf.y - 44) / tf.s - node.y };
    setDragNode(node.id);
  }
  function onNC(e, node) { e.stopPropagation(); if (editMode) return; setSel(node.id); setTab('details'); }

  // ─── AI chat ───────────────────────────────────────────────
  async function sendAI() {
    if (!aiQ.trim() || aiLoad) return;
    const q = aiQ.trim(); setAiQ('');
    setMsgs(m => [...m, { role:'user', content:q }]); setAiLoad(true);
    try {
      const sys = aiEdit
        ? buildSys(cfg, sn) + `\n\nFLOWCHART STATE:\n${JSON.stringify(nodes.map(n => ({ id:n.id, label:n.label, status:n.status })))}`
        : buildSys(cfg, sn);
      const r = await fetch('https://api.anthropic.com/v1/messages', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:800, system:sys, messages:[...msgs, { role:'user', content:q }] }) });
      const d = await r.json();
      setMsgs(m => [...m, { role:'assistant', content: d.content?.find(c => c.type==='text')?.text || 'No response.' }]);
    } catch(err) { setMsgs(m => [...m, { role:'assistant', content:`Error: ${err.message}` }]); }
    setAiLoad(false);
  }

  // ─── AI generation ─────────────────────────────────────────
  async function generate() {
    if (!genPr.trim() || genLoad) return;
    setGenLoad(true); setGenErr(''); setGenPrev(null);
    try {
      const ctx = [cfg.orgName && `Org: ${cfg.orgName}`, cfg.tools && `Tools: ${cfg.tools}`, cfg.channel && `Channel: ${cfg.channel}`].filter(Boolean).join('. ');
      const r = await fetch('https://api.anthropic.com/v1/messages', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:4000,
          system: GS + (ctx ? `\n\nORG CONTEXT FOR detail.i FIELDS: ${ctx}` : ''),
          messages: [{ role:'user', content:`Generate a Copilot Studio flowchart for:\n\n${genPr.trim()}` }] }) });
      const d = await r.json();
      const raw = d.content?.find(c => c.type==='text')?.text || '';
      if (!raw) throw new Error('Empty response from model');
      const parsed = JSON.parse(extractJSON(raw));   // FIX: robust extraction
      validateGenerated(parsed);                      // FIX: validate + repair
      setGenPrev(parsed);
    } catch(err) { setGenErr(`Generation failed: ${err.message}`); }
    setGenLoad(false);
  }

  function applyGen() {
    if (!genPrev) return;
    setNodes(genPrev.nodes); setEdges(genPrev.edges);
    setCls({}); setNodeTs({}); setLog([]); setSel(null);
    setGenPrev(null); setGenPr(''); setTab('details');
  }

  // FIX: confirmation before destructive resets
  function resetToDefault() {
    if (!window.confirm('Reset all progress and restore the default template? This cannot be undone.')) return;
    setNodes(DN); setEdges(DE); setCls({}); setNodeTs({}); setLog([]);
    setSession(null); setElapsed(0); setSel(null);
  }

  // FIX: copy feedback
  function copyTicket() {
    const done = nodes.filter(n => n.status === 'done' || n.bypassed);
    const out  = `${cfg.agentName||'CS Build'} — ${new Date().toLocaleString()}\n\n${done.map(n=>`✓ ${n.label}${n.bypassed?' [SKIPPED]':''}`).join('\n')}\n\nLog:\n${log.map(l=>`${l.ts} ${l.msg}`).join('\n')}`;
    navigator.clipboard?.writeText(out).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  // ─── SVG node renderer (called as function, not <Component/>) ──
  // FIX: calling inner render helpers as functions avoids full remount on every parent re-render
  function RNode(node) {
    const w = NW[node.type]||200, h = NH[node.type]||65;
    const s  = node.bypassed ? 'bypassed' : node.status;
    const isSel = sel === node.id, isOt = isOvertime(node);
    const bc = SC[s] || B.border, bg = node.type === 'escalation' ? '#3b0a00' : B.s2;
    const tc = s === 'done' ? B.doneT : s === 'blocked' ? '#fca5a5' : B.text;

    if (node.type === 'decision') {
      const cx = node.x+w/2, cy = node.y+h/2;
      const pts = `${cx},${node.y} ${node.x+w},${cy} ${cx},${node.y+h} ${node.x},${cy}`;
      return (
        <g key={node.id} data-nid={node.id} style={{cursor:editMode?'grab':'pointer'}}
           onClick={e=>onNC(e,node)} onMouseDown={e=>onNMD(e,node)}>
          {isOt && <polygon points={pts} fill="none" stroke={B.yellow} strokeWidth={2.5} strokeDasharray="5,3"/>}
          <polygon points={pts} fill={bg} stroke={isSel?B.primary:bc} strokeWidth={isSel?2.5:1.5}/>
          {isSel && <polygon points={pts} fill={B.primary} opacity={0.1}/>}
          {wrap(node.label, 15).map((ln,i,arr) => (
            <text key={i} x={cx} y={cy+(i-(arr.length-1)/2)*13} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill={tc} style={{pointerEvents:'none'}}>{ln}</text>
          ))}
        </g>
      );
    }
    const rx = node.type === 'terminal' ? 25 : 6;
    return (
      <g key={node.id} data-nid={node.id} style={{cursor:editMode?'grab':'pointer'}}
         onClick={e=>onNC(e,node)} onMouseDown={e=>onNMD(e,node)}>
        {isOt && <rect x={node.x-5} y={node.y-5} width={w+10} height={h+10} rx={rx+3} fill="none" stroke={B.yellow} strokeWidth={2} strokeDasharray="5,3"/>}
        <rect x={node.x} y={node.y} width={w} height={h} rx={rx} fill={bg} stroke={isSel?B.primary:bc} strokeWidth={isSel?2.5:1.5}/>
        {isSel && <rect x={node.x} y={node.y} width={w} height={h} rx={rx} fill={B.primary} opacity={0.08}/>}
        <rect x={node.x} y={node.y+3} width={5} height={h-6} rx={2} fill={bc}/>
        {node.type==='escalation' && <rect x={node.x} y={node.y} width={w} height={5} rx={rx} fill={B.esc} opacity={0.9}/>}
        {node.type==='checklist'  && <text x={node.x+w-14} y={node.y+16} fontSize={12} fill={B.muted} style={{pointerEvents:'none'}}>☑</text>}
        {node.bypassable && s!=='done' && s!=='bypassed' && <text x={node.x+w-13} y={node.y+h-6} fontSize={9} fill="#ca8a04" style={{pointerEvents:'none'}}>↷</text>}
        {wrap(node.label, 21).map((ln,i,arr) => (
          <text key={i} x={node.x+w/2} y={node.y+h/2+(i-(arr.length-1)/2)*13} textAnchor="middle" dominantBaseline="middle" fontSize={11} fill={tc} style={{pointerEvents:'none'}}>{ln}</text>
        ))}
        {node.bypassed && <text x={node.x+w/2} y={node.y+h-5} textAnchor="middle" fontSize={8} fill={B.muted} style={{pointerEvents:'none'}}>SKIPPED</text>}
      </g>
    );
  }

  function REdge(edge) {
    const src = nodes.find(n => n.id === edge.from), tgt = nodes.find(n => n.id === edge.to);
    if (!src || !tgt) return null;
    const d = ePath(src, tgt), a = nB(src), b = nB(tgt), mx = (a.cx+b.cx)/2, my = (a.cy+b.cy)/2;
    return (
      <g key={edge.id}>
        <path d={d} fill="none" stroke="#4a5568" strokeWidth={1.5} markerEnd="url(#arr)"/>
        {edge.label && (<>
          <rect x={mx-22} y={my-8} width={44} height={14} rx={3} fill={B.surface}/>
          <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill={B.muted}>{edge.label}</text>
        </>)}
      </g>
    );
  }

  // ─── Checklist widget ──────────────────────────────────────
  function RCL(node) {
    if (!node.checklist) return null;
    const state = cls[node.id] || {};
    const upd = (iid, st) => setCls(c => ({ ...c, [node.id]: { ...(c[node.id]||{}), [iid]: st } }));
    const critDone = node.checklist.filter(i => i.critical).every(i => (state[i.id]||'todo') === 'done');
    return (
      <div>
        <div style={{fontSize:11,color:critDone?B.doneT:B.muted,marginBottom:8,fontWeight:600}}>
          {critDone ? '✓ All critical done' : '★ Critical items pending'}
        </div>
        {node.checklist.map(item => {
          const ist = state[item.id] || 'todo';
          return (
            <div key={item.id} style={{display:'flex',alignItems:'center',gap:7,marginBottom:5,padding:'5px 7px',background:B.surface,borderRadius:4,border:`1px solid ${B.border}`}}>
              <span style={{color:item.critical?'#fbbf24':B.muted,fontSize:12,minWidth:14,flexShrink:0}}>{item.critical?'★':'○'}</span>
              <span style={{flex:1,fontSize:11,lineHeight:1.4,color:ist==='done'?B.doneT:ist==='fail'?'#fca5a5':B.text,textDecoration:ist==='skip'?'line-through':'none'}}>{item.label}</span>
              <div style={{display:'flex',gap:3,flexShrink:0}}>
                {['pass','fail','skip'].map(st => (
                  <button key={st} onClick={() => upd(item.id, st==='pass'?'done':st)}
                    style={{fontSize:9,padding:'2px 5px',borderRadius:3,border:'none',cursor:'pointer',
                      background:ist===(st==='pass'?'done':st)?(st==='pass'?B.done:st==='fail'?B.blocked:'#78350f'):'#374151',color:B.text}}>{st}</button>
                ))}
              </div>
            </div>
          );
        })}
        {/* FIX: removed hardcoded 'qc_gate' ID — use qcGate flag from node data instead */}
        {critDone && node.qcGate && (
          <div style={{marginTop:10,padding:'9px 12px',background:'#14532d',border:`1px solid ${B.done}`,borderRadius:6,textAlign:'center',color:B.doneT,fontWeight:700,fontSize:13}}>
            ✓ Ready to Publish
          </div>
        )}
      </div>
    );
  }

  // ─── Field component ───────────────────────────────────────
  function Fld({ label, k, multi, rows=2, ph }) {
    return (
      <div style={{marginBottom:10}}>
        <div style={{fontSize:10,color:B.muted,fontWeight:700,textTransform:'uppercase',marginBottom:4,letterSpacing:'0.05em'}}>{label}</div>
        {multi
          ? <textarea value={cfg[k]||''} onChange={e=>cfgSet(k,e.target.value)} rows={rows} placeholder={ph} style={{...IS,resize:'vertical'}}/>
          : <input    value={cfg[k]||''} onChange={e=>cfgSet(k,e.target.value)}            placeholder={ph} style={IS}/>}
      </div>
    );
  }

  // ─── Panel: Details ────────────────────────────────────────
  function Details() {
    if (!sn) return (
      <div style={{padding:16,color:B.muted,fontSize:12,lineHeight:2.2}}>
        Select a node to view details.<br/>
        <span style={{fontSize:10,color:'#4a5568'}}>Scroll to zoom · Drag background to pan<br/>Click node to select · Start Session to track time<br/>
          <span style={{color:B.yellow}}>⚙ Config tab</span> → set org details + generate new flowchart</span>
      </div>
    );
    const n = sn, s = n.bypassed ? 'bypassed' : n.status;
    return (
      <div style={{padding:12,overflowY:'auto',flex:1}}>
        <div style={{fontWeight:700,fontSize:13,marginBottom:6,lineHeight:1.4}}>{n.label}</div>
        <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:10}}>
          <span style={{fontSize:9,padding:'2px 7px',borderRadius:10,background:SC[s]||B.border,color:'#fff'}}>{s.toUpperCase()}</span>
          <span style={{fontSize:9,padding:'2px 7px',borderRadius:10,background:B.surface,border:`1px solid ${B.border}`,color:B.muted}}>{n.type}</span>
          <span style={{fontSize:9,padding:'2px 7px',borderRadius:10,background:B.surface,border:`1px solid ${B.border}`,color:B.muted}}>~{n.expectedMins}m</span>
        </div>
        <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:10}}>
          {['todo','active','done','blocked'].map(st => (
            <button key={st} type="button" onClick={()=>setStatus(n.id,st)}
              style={{fontSize:9,padding:'3px 8px',borderRadius:10,border:'none',cursor:'pointer',background:s===st?SC[st]:'#374151',color:'#fff'}}>{st}</button>
          ))}
          {n.bypassable && !n.bypassed && s!=='done' && (
            <button type="button" onClick={()=>{setBypassM(n);setBypassR('');}}
              style={{fontSize:9,padding:'3px 8px',borderRadius:10,border:'none',cursor:'pointer',background:B.bypass,color:'#fff'}}>Skip ↷</button>
          )}
          {n.bypassed && (
            <button type="button" onClick={()=>setNodes(ns=>ns.map(x=>x.id===n.id?{...x,bypassed:false,status:'todo'}:x))}
              style={{fontSize:9,padding:'3px 8px',borderRadius:10,border:`1px solid ${B.border}`,cursor:'pointer',background:'transparent',color:B.muted}}>Undo skip</button>
          )}
        </div>
        {n.type==='escalation' && (
          <button type="button" onClick={()=>setStatus(n.id,'done')}
            style={{width:'100%',marginBottom:12,padding:'7px',background:B.done,border:'none',borderRadius:4,color:'#fff',cursor:'pointer',fontSize:11,fontWeight:700}}>
            ↩ Resolved — Return to flow
          </button>
        )}
        {n.type==='checklist' && n.checklist && (
          <div style={{marginBottom:12}}>
            <div style={{fontSize:10,color:B.muted,fontWeight:700,textTransform:'uppercase',marginBottom:6}}>Checklist</div>
            {RCL(n)}
          </div>
        )}
        {n.detail && [['Walk-up / Prep',n.detail.w],['During',n.detail.u],['Completion Criteria',n.detail.c],['Org Info',n.detail.i]].map(([lbl,items]) =>
          items?.length > 0 && (
            <div key={lbl} style={{marginBottom:12}}>
              <div style={{fontSize:10,fontWeight:700,color:B.muted,textTransform:'uppercase',marginBottom:5,letterSpacing:'0.05em'}}>{lbl}</div>
              {items.map((item,i) => (
                <div key={i} style={{fontSize:11,color:B.text,marginBottom:5,paddingLeft:10,borderLeft:`2px solid ${B.border}`,lineHeight:1.6}}>{item}</div>
              ))}
            </div>
          )
        )}
      </div>
    );
  }

  // ─── Panel: AI ─────────────────────────────────────────────
  function AITab() {
    return (
      <div style={{display:'flex',flexDirection:'column',flex:1,padding:12,overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10,flexShrink:0}}>
          <span style={{fontSize:10,color:B.muted}}>Edit Mode</span>
          <div onClick={()=>setAiEdit(e=>!e)} style={{width:30,height:16,borderRadius:8,background:aiEdit?B.primary:'#374151',position:'relative',cursor:'pointer',transition:'background 0.15s'}}>
            <div style={{position:'absolute',top:1,left:aiEdit?14:2,width:14,height:14,borderRadius:7,background:'#fff',transition:'left 0.15s'}}/>
          </div>
          <span style={{fontSize:9,color:B.muted}}>{aiEdit?'JSON injected':'Context only'}</span>
        </div>
        <div style={{flex:1,overflowY:'auto',marginBottom:8,display:'flex',flexDirection:'column',gap:8}}>
          {msgs.length===0 && (
            <div style={{color:B.muted,fontSize:11,lineHeight:1.9}}>
              Ask about the current step, troubleshoot a blocker, or get escalation guidance.<br/><br/>
              <span style={{fontSize:10,color:cfg.orgName?B.text:B.yellow}}>{cfg.orgName?`Org: ${cfg.orgName}`:'⚙ Set org details in Config tab for better answers.'}</span><br/>
              <span style={{fontSize:10,color:sn?B.accent:B.muted}}>{sn?`Active: ${sn.label}`:'Select a node for context.'}</span>
            </div>
          )}
          {msgs.map((m,i) => (
            <div key={i} style={{padding:'8px 10px',borderRadius:6,fontSize:11,lineHeight:1.6,
              background:m.role==='user'?B.s2:B.surface,border:`1px solid ${B.border}`,
              color:m.role==='user'?B.accent:B.text,
              alignSelf:m.role==='user'?'flex-end':'flex-start',maxWidth:'93%',whiteSpace:'pre-wrap'}}>{m.content}</div>
          ))}
          {aiLoad && <div style={{color:B.muted,fontSize:11}}>↻ Thinking...</div>}
        </div>
        <div style={{display:'flex',gap:6,flexShrink:0}}>
          <input value={aiQ} onChange={e=>setAiQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendAI()}
            placeholder={sn?`Ask about: ${sn.label.slice(0,25)}...`:'Ask anything...'}
            style={{...IS,flex:1}}/>
          <button type="button" onClick={sendAI} disabled={aiLoad}
            style={{padding:'0 13px',background:aiLoad?'#374151':B.primary,border:'none',borderRadius:4,color:'#fff',cursor:aiLoad?'not-allowed':'pointer',fontSize:14,fontWeight:700}}>→</button>
        </div>
      </div>
    );
  }

  // ─── Panel: Notes ──────────────────────────────────────────
  function NotesTab() {
    const nn  = sel ? (notes[sel]||[]) : [];
    const add = () => {
      if (!noteIn.trim() || !sel) return;
      const ts = new Date().toLocaleTimeString();
      setNotes(n => ({ ...n, [sel]: [...(n[sel]||[]), { ts, text:noteIn.trim() }] }));
      setNoteIn('');
    };
    return (
      <div style={{display:'flex',flexDirection:'column',flex:1,padding:12,overflow:'hidden'}}>
        {!sel ? <div style={{color:B.muted,fontSize:12}}>Select a node to add notes.</div> : (<>
          <div style={{fontSize:11,color:B.muted,marginBottom:8,flexShrink:0}}>Notes: <span style={{color:B.text}}>{sn?.label}</span></div>
          <div style={{flex:1,overflowY:'auto',marginBottom:8}}>
            {nn.length===0 && <div style={{color:B.muted,fontSize:11}}>No notes yet.</div>}
            {nn.map((n,i) => (
              <div key={i} style={{marginBottom:7,padding:8,background:B.surface,borderRadius:4,border:`1px solid ${B.border}`}}>
                <div style={{fontSize:9,color:'#475569',marginBottom:3}}>{n.ts}</div>
                <div style={{fontSize:11,lineHeight:1.5}}>{n.text}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:6,flexShrink:0}}>
            <textarea value={noteIn} onChange={e=>setNoteIn(e.target.value)} onKeyDown={e=>e.key==='Enter'&&e.ctrlKey&&add()}
              placeholder="Add note… (Ctrl+Enter to save)" rows={2} style={{...IS,flex:1,resize:'none'}}/>
            <button type="button" onClick={add} style={{padding:'0 10px',background:B.primary,border:'none',borderRadius:4,color:'#fff',cursor:'pointer',fontSize:11}}>Add</button>
          </div>
        </>)}
        <div style={{marginTop:10,flexShrink:0}}>
          <div style={{fontSize:10,color:B.muted,fontWeight:700,textTransform:'uppercase',marginBottom:5}}>Session Log</div>
          <div style={{maxHeight:110,overflowY:'auto'}}>
            {log.length===0
              ? <div style={{fontSize:10,color:B.muted}}>No activity yet.</div>
              : log.map((l,i) => <div key={i} style={{fontSize:9,color:B.muted,marginBottom:2}}><span style={{color:'#475569'}}>{l.ts}</span> {l.msg}</div>)}
          </div>
        </div>
      </div>
    );
  }

  // ─── Panel: Progress ───────────────────────────────────────
  function ProgressTab() {
    const tot = nodes.length;
    const dn  = nodes.filter(n => n.status==='done' || n.bypassed).length;
    const act = nodes.filter(n => n.status==='active').length;
    const blk = nodes.filter(n => n.status==='blocked').length;
    const pct = tot > 0 ? Math.round(dn/tot*100) : 0; // FIX: guard against division by zero
    return (
      <div style={{flex:1,overflowY:'auto',padding:12}}>
        <div style={{marginBottom:12}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4,fontSize:11}}>
            <span style={{color:B.muted}}>Overall</span><span>{dn}/{tot} ({pct}%)</span>
          </div>
          <div style={{height:6,background:'#374151',borderRadius:3}}>
            <div style={{height:'100%',width:`${pct}%`,background:B.done,borderRadius:3,transition:'width 0.3s'}}/>
          </div>
        </div>
        <div style={{display:'flex',gap:6,marginBottom:12}}>
          {[['Active',act,B.active],['Blocked',blk,B.blocked],['Done',dn,B.done]].map(([l,c,col]) => (
            <div key={l} style={{flex:1,background:B.surface,borderRadius:5,padding:'6px 4px',border:`1px solid ${B.border}`,textAlign:'center'}}>
              <div style={{fontSize:20,fontWeight:700,color:col}}>{c}</div>
              <div style={{fontSize:9,color:B.muted}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:10,color:B.muted,fontWeight:700,textTransform:'uppercase',marginBottom:6}}>All Steps</div>
        {nodes.map(n => {
          const s = n.bypassed ? 'bypassed' : n.status;
          return (
            <div key={n.id} onClick={()=>{setSel(n.id);setTab('details');}}
              style={{display:'flex',alignItems:'center',gap:7,padding:'4px 6px',marginBottom:2,borderRadius:4,cursor:'pointer',background:sel===n.id?B.s2:'transparent'}}>
              <div style={{width:8,height:8,flexShrink:0,borderRadius:n.type==='decision'?2:4,background:SC[s]||B.border,transform:n.type==='decision'?'rotate(45deg)':'none'}}/>
              <span style={{flex:1,fontSize:10,color:s==='done'?B.doneT:B.text,textDecoration:n.bypassed?'line-through':'none'}}>{n.label}</span>
              <span style={{fontSize:9,color:B.muted,flexShrink:0}}>{n.expectedMins}m</span>
            </div>
          );
        })}
        <button type="button" onClick={resetToDefault}
          style={{marginTop:12,width:'100%',padding:'6px',background:'transparent',border:`1px solid ${B.border}`,borderRadius:4,color:B.muted,cursor:'pointer',fontSize:10}}>
          ↺ Reset to Default Template
        </button>
      </div>
    );
  }

  // ─── Panel: Config ─────────────────────────────────────────
  function ConfigTab() {
    return (
      <div style={{flex:1,overflowY:'auto',padding:12}}>
        <div style={{fontSize:11,color:B.muted,marginBottom:14,lineHeight:1.7}}>Configure your environment. These fields personalize the AI assistant and feed into generated flowcharts.</div>
        {Fld({label:'Org / Client Name', k:'orgName', ph:'Intinc, Acme Corp...'})}
        {Fld({label:'Agent Name',        k:'agentName', ph:'Service Desk Triage Agent...'})}
        {Fld({label:'Platform URL',      k:'platformUrl', ph:'make.preview.microsoft.com'})}
        {Fld({label:'Primary Channel',   k:'channel', ph:'Microsoft Teams, SharePoint, Web...'})}
        {Fld({label:'Tools in Use',      k:'tools',      multi:true, rows:2, ph:'FreshService REST API, Dataverse, Teams connector...'})}
        {Fld({label:'Escalation Contacts', k:'escalation', multi:true, rows:3, ph:'PP Admin → connectors, service accounts\nSystem Admin → API credentials'})}
        {Fld({label:'Common Failure Modes',k:'failures',   multi:true, rows:3, ph:'Personal creds on trigger auth\nInstructions >400 tokens\nGen orchestration not enabled'})}
        {Fld({label:'Environment Facts',   k:'facts',      multi:true, rows:3, ph:'API endpoints, license requirements, known gotchas...'})}

        <div style={{marginTop:16,paddingTop:14,borderTop:`1px solid ${B.border}`}}>
          <div style={{fontWeight:700,fontSize:12,color:B.accent,marginBottom:4}}>⚡ AI Generate Flowchart</div>
          <div style={{fontSize:11,color:B.muted,marginBottom:10,lineHeight:1.6}}>
            Describe your process. AI generates a full flowchart with nodes, decisions, escalations, and QC gate — using your org context above.
          </div>
          <textarea value={genPr} onChange={e=>setGenPr(e.target.value)} rows={4}
            placeholder="e.g. Build an agent that monitors incoming support emails, classifies by severity, routes to the right team in ServiceNow, and posts a summary card in Teams..."
            style={{...IS,resize:'vertical',marginBottom:8}}/>
          {genErr && (
            <div style={{fontSize:11,color:'#fca5a5',marginBottom:8,padding:'6px 8px',background:'#3b0000',borderRadius:4,border:`1px solid ${B.blocked}`}}>{genErr}</div>
          )}
          {genPrev && (
            <div style={{marginBottom:10,padding:10,background:'#14532d',border:`1px solid ${B.done}`,borderRadius:6}}>
              <div style={{fontSize:11,color:B.doneT,fontWeight:700,marginBottom:6}}>✓ Generated: {genPrev.nodes.length} nodes, {genPrev.edges.length} edges</div>
              <div style={{fontSize:10,color:'#6ee7b7',marginBottom:8,lineHeight:1.6}}>
                {genPrev.nodes.slice(0,5).map(n=>n.label).join(' → ')}{genPrev.nodes.length>5?` → +${genPrev.nodes.length-5} more`:''}
              </div>
              <div style={{display:'flex',gap:8}}>
                <button type="button" onClick={applyGen}
                  style={{flex:1,padding:'6px',background:B.done,border:'none',borderRadius:4,color:'#fff',cursor:'pointer',fontSize:11,fontWeight:700}}>Apply to Canvas</button>
                <button type="button" onClick={()=>setGenPrev(null)}
                  style={{padding:'6px 10px',background:'transparent',border:`1px solid ${B.border}`,borderRadius:4,color:B.muted,cursor:'pointer',fontSize:11}}>Discard</button>
              </div>
            </div>
          )}
          <button type="button" onClick={generate} disabled={genLoad||!genPr.trim()}
            style={{width:'100%',padding:'8px',background:genLoad||!genPr.trim()?'#374151':B.primary,border:'none',borderRadius:4,color:'#fff',
              cursor:genLoad||!genPr.trim()?'not-allowed':'pointer',fontSize:12,fontWeight:700}}>
            {genLoad ? '↻ Generating...' : '⚡ Generate Flowchart'}
          </button>
          <div style={{marginTop:14,paddingTop:12,borderTop:`1px solid ${B.border}`}}>
            <div style={{fontSize:10,color:B.muted,fontWeight:700,textTransform:'uppercase',marginBottom:8}}>Templates</div>
            <button type="button" onClick={resetToDefault}
              style={{width:'100%',padding:'6px',background:'transparent',border:`1px solid ${B.border}`,borderRadius:4,color:B.muted,cursor:'pointer',fontSize:11}}>
              ↺ Restore Generic CS Build Template
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────
  return (
    <div style={{display:'flex',height:'100vh',background:B.bg,color:B.text,fontFamily:'system-ui',overflow:'hidden',userSelect:'none'}}>

      {/* Canvas */}
      <div ref={cvs} style={{flex:1,position:'relative',overflow:'hidden',cursor:panStart?'grabbing':'default'}}
        onMouseDown={onCMD} onMouseMove={onCMM} onMouseUp={onCMU} onMouseLeave={onCMU}>

        {/* Top bar */}
        <div style={{position:'absolute',top:0,left:0,right:0,zIndex:10,height:44,background:'#0d1525',borderBottom:`1px solid ${B.border}`,
                     display:'flex',alignItems:'center',padding:'0 14px',gap:10}}>
          <div style={{fontWeight:800,fontSize:12,color:B.accent,letterSpacing:'-0.01em',whiteSpace:'nowrap'}}>
            ⬡ {cfg.agentName || 'Copilot Studio Flow'}
          </div>
          {cfg.orgName && <div style={{fontSize:10,color:'#475569',flexShrink:0}}>{cfg.orgName}</div>}
          <div style={{width:1,height:18,background:B.border,flexShrink:0}}/>
          {session && <div style={{fontSize:11,color:B.muted,fontVariantNumeric:'tabular-nums',flexShrink:0}}>⏱ {fmt(elapsed)}</div>}
          <div style={{flex:1}}/>
          {!session
            ? <button type="button" onClick={()=>{setSession(Date.now());setLog(l=>[...l,{ts:new Date().toLocaleTimeString(),msg:'Session started'}]);}}
                style={{fontSize:11,padding:'5px 12px',borderRadius:4,border:'none',cursor:'pointer',background:B.primary,color:'#fff',fontWeight:600,flexShrink:0}}>
                Start Session
              </button>
            : <div style={{fontSize:11,padding:'5px 10px',borderRadius:4,background:'#14532d',color:B.doneT,fontWeight:600,flexShrink:0}}>● Live</div>}
          <button type="button" onClick={()=>setEditMode(e=>!e)}
            style={{fontSize:11,padding:'5px 9px',borderRadius:4,border:`1px solid ${editMode?B.primary:B.border}`,cursor:'pointer',
                    background:editMode?B.s2:'transparent',color:editMode?B.accent:B.muted,flexShrink:0}}>
            {editMode ? '✎ ON' : '⊹'}
          </button>
          {/* FIX: copy feedback */}
          <button type="button" onClick={copyTicket}
            style={{fontSize:11,padding:'5px 9px',borderRadius:4,border:`1px solid ${copied?B.done:B.border}`,cursor:'pointer',
                    background:copied?'#14532d':'transparent',color:copied?B.doneT:B.muted,flexShrink:0,transition:'all 0.2s'}}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        {/* SVG canvas — FIX: no onWheel here, handled by passive listener in useEffect */}
        <svg width="100%" height="100%" style={{position:'absolute',top:0,left:0}}>
          <defs>
            <marker id="arr-cs" markerWidth={8} markerHeight={8} refX={6} refY={3} orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#4a5568"/>
            </marker>
          </defs>
          <g transform={`translate(${tf.x},${tf.y+44})scale(${tf.s})`}>
            {edges.map(e => REdge(e))}
            {nodes.map(n => RNode(n))}
          </g>
        </svg>
      </div>

      {/* Right panel */}
      <div style={{width:330,background:B.surface,borderLeft:`1px solid ${B.border}`,display:'flex',flexDirection:'column',flexShrink:0}}>
        <div style={{display:'flex',borderBottom:`1px solid ${B.border}`,flexShrink:0}}>
          {TABS.map(t => (
            <button key={t} type="button" onClick={()=>setTab(t)}
              style={{flex:1,padding:'11px 1px',fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.04em',border:'none',cursor:'pointer',
                background:tab===t?B.s2:'transparent',
                color:tab===t?(t==='config'?B.yellow:B.accent):B.muted,
                borderBottom:tab===t?`2px solid ${t==='config'?B.yellow:B.primary}`:'2px solid transparent'}}>
              {TL[t]}
            </button>
          ))}
        </div>
        <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>
          {tab==='details'  && Details()}
          {tab==='ai'       && AITab()}
          {tab==='notes'    && NotesTab()}
          {tab==='progress' && ProgressTab()}
          {tab==='config'   && ConfigTab()}
        </div>
      </div>

      {/* Bypass modal */}
      {bypassM && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:B.surface,border:`1px solid ${B.border}`,borderRadius:8,padding:20,width:330}}>
            <div style={{fontWeight:700,marginBottom:4,fontSize:13}}>Skip ↷</div>
            <div style={{fontSize:12,color:B.text,marginBottom:4,fontWeight:600}}>{bypassM.label}</div>
            <div style={{fontSize:11,color:B.muted,marginBottom:12}}>{bypassM.bypassReason}</div>
            <textarea value={bypassR} onChange={e=>setBypassR(e.target.value)}
              placeholder="Reason for skipping (required)..." rows={2} style={{...IS,resize:'none'}}/>
            <div style={{fontSize:10,color:B.muted,marginTop:4,marginBottom:10}}>Press Esc to cancel</div>
            <div style={{display:'flex',gap:8}}>
              <button type="button" onClick={()=>setBypassM(null)}
                style={{flex:1,padding:'7px',border:`1px solid ${B.border}`,borderRadius:4,background:'transparent',color:B.muted,cursor:'pointer'}}>Cancel</button>
              <button type="button" disabled={!bypassR.trim()}
                onClick={()=>{if(!bypassR.trim())return;setStatus(bypassM.id,'bypassed',{bp:true,reason:bypassR});setBypassM(null);}}
                style={{flex:1,padding:'7px',border:'none',borderRadius:4,background:bypassR.trim()?B.bypass:'#374151',
                        color:'#fff',cursor:bypassR.trim()?'pointer':'not-allowed',fontWeight:600}}>Skip ↷</button>
            </div>
          </div>
        </div>
      )}

      {/* Downstream alert modal */}
      {downM && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:B.surface,border:`1px solid ${B.border}`,borderRadius:8,padding:20,width:360}}>
            <div style={{fontWeight:700,marginBottom:6,color:'#fbbf24',fontSize:13}}>⚠ Downstream Alert</div>
            <div style={{fontSize:12,color:B.text,marginBottom:10}}>Marking done affects {downM.aff.length} step(s) already in progress:</div>
            {downM.aff.map(n => (
              <div key={n.id} style={{fontSize:11,padding:'3px 8px',borderLeft:`2px solid ${SC[n.status]}`,color:B.muted,marginBottom:4}}>
                {n.label} <span style={{color:SC[n.status]}}>[{n.status}]</span>
              </div>
            ))}
            <div style={{fontSize:10,color:B.muted,marginTop:8,marginBottom:4}}>Press Esc to cancel</div>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <button type="button" onClick={()=>setDownM(null)}
                style={{flex:1,padding:'7px',border:`1px solid ${B.border}`,borderRadius:4,background:'transparent',color:B.muted,cursor:'pointer'}}>Cancel</button>
              <button type="button" onClick={()=>setStatus(downM.id,downM.status,{confirmed:true})}
                style={{flex:1,padding:'7px',border:'none',borderRadius:4,background:B.blocked,color:'#fff',cursor:'pointer',fontWeight:600}}>Proceed Anyway</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
