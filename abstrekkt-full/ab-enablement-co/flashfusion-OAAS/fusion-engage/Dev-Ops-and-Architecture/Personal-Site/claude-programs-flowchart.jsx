import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════
const STORAGE_KEY = "claude-programs-v1";
const C_PRIMARY = "#5436DA";
const C_DONE = "#15803d";
const C_ACTIVE = "#7c3aed";
const C_BLOCKED = "#dc2626";
const C_TODO = "#334155";
const C_ESC = "#c2410c";
const C_ACCENT = "#E8A020";

const STATUS_COLOR = { todo: C_TODO, active: C_ACTIVE, done: C_DONE, blocked: C_BLOCKED };
const STATUS_BG = { todo: "#0f172a", active: "#1e1040", done: "#052e16", blocked: "#300a0a" };

const NW = 152, NH = 50, NRX = 5;
const TW = 164, TH = 48;
const EW = 152, EH = 50;
const DS = 50;

// ═══════════════════════════════════════════════════════════════
// NODE & EDGE DATA
// ═══════════════════════════════════════════════════════════════
const NODES_DEF = [
  { id: "start", type: "terminal", label: "Start\nClaude Programs Sprint", x: 400, y: 44, exp: 5,
    detail: { w: ["Open this tracker", "Review Week 1 plan doc", "Have Playbook ready in another tab"],
      u: ["Execute Monday + Tuesday steps minimum", "Applications are free and short — no excuse to skip"],
      c: ["Tracker open", "Plan reviewed", "Session started"],
      i: ["Source: Kyle's Action Playbook v1.0 — March 2026", "Minimum viable week: Mon + Tue applications only"] } },
  { id: "campus_check", type: "decision", label: "Enrolled\nStudent?", x: 400, y: 164, exp: 1,
    detail: { w: ["Confirm enrollment status"], u: [], c: ["Status confirmed → hard skip"],
      i: ["Campus Ambassador = enrolled students only, managed via Wasserman Next Gen", "URL: claude.com/programs/campus"] } },
  { id: "campus_skip", type: "terminal", label: "Campus Ambassador\n— SKIP ENTIRELY", x: 660, y: 164, exp: 1,
    bypass: true, bypassOwner: "Self — hard no, not eligible",
    detail: { w: ["Not eligible. Do not apply."], u: [], c: ["Permanently bypassed"],
      i: ["Kyle is not an enrolled student. Do not burn time on this."] } },
  { id: "apply_community", type: "process", label: "Apply:\nCommunity Ambassador", x: 400, y: 304, exp: 45,
    detail: {
      w: ["Open: claude.com/community/ambassadors", "Load Master Meta-Prompt into Claude first", "Load Community Ambassador Application Prompt"],
      u: ["Milwaukee / Lake County = underserved vs. Chicago city density — use this explicitly",
        "Emphasize: security-first practitioner, not enthusiast",
        "Proof of community building: teaching senior engineers at Intinc",
        "Real Claude experience: LastPass→Bitwarden agent, 50+ MCP connectors, production builds",
        "Have 2 specific Milwaukee event ideas ready (Format B Builder Workshop + Format C Hackathon)",
        "Frame as: I'm already doing this — I want Anthropic's resources to scale it",
        "AVOID: 'I'm passionate about AI', any buzzword without specific evidence"],
      c: ["Application submitted", "Confirmation email received"],
      i: ["URL: claude.com/community/ambassadors", "Est: 45 min", "Day: Monday",
        "What they want: proven organizer + real Claude Code XP + specific event ideas + honest feedback giver"] } },
  { id: "apply_partner", type: "process", label: "Apply:\nPartner Network", x: 400, y: 424, exp: 30,
    detail: {
      w: ["Open: anthropic.com/news/claude-partner-network", "Load Partner Network Application Prompt", "Draft 2-sentence positioning statement first"],
      u: ["Frame as: AI implementation PARTNER — not developer hobbyist",
        "Lead with: FlashFusion catalog + production deployments (LastPass agent, Copilot Studio builds)",
        "Differentiator: AppSec background solves the compliance concern that blocks enterprise Claude adoption",
        "Target clients: 50-500 employee tech/SaaS companies",
        "Revenue model: 50-80% margin consulting, $300K-$500K Y1 target",
        "RED FLAG: anything that sounds like 'I use Claude daily' rather than 'I deploy Claude for clients'"],
      c: ["Application submitted", "Confirmation received"],
      i: ["URL: anthropic.com/news/claude-partner-network", "Est: 30 min", "Day: Tuesday",
        "Services Partner Directory listing is the core goal — enterprise buyers find you here"] } },
  { id: "ai_fluency", type: "process", label: "AI Fluency Course\n(Free, ~2 hrs)", x: 400, y: 544, exp: 120,
    detail: {
      w: ["Open: claude.ai/learn", "Free — no credit card", "Launched July 2025"],
      u: ["Complete all modules in one session if possible", "Note vocabulary for teaching use", "Strengthens both applications"],
      c: ["Completion badge earned", "Certificate downloadable"],
      i: ["Day: Wednesday", "Establishes shared vocabulary before Architect exam", "Useful to reference when teaching Tier 1/2 sessions"] } },
  { id: "event_draft", type: "process", label: "Draft Milwaukee\nEvent Concept", x: 400, y: 664, exp: 60,
    detail: {
      w: ["Use Event Planning Prompt from Playbook", "Pick Format B (Builder Workshop 3hrs) as anchor", "Identify venue: CLC is #1 option"],
      u: ["CLC professor = warm contact → activate this explicitly, not via cold outreach",
        "All hands-on activities must work on free claude.ai — no Pro/API requirement",
        "Draft pre-event + post-event email templates using Playbook prompts",
        "Specify: date range, target audience (devs 8-20 ppl)"],
      c: ["1-page event concept doc complete", "Venue option identified", "Draft agenda ready"],
      i: ["CLC = College of Lake County, Lake County IL", "Luma for event listing",
        "Anthropic sponsorship range: $500-$2K per community event"] } },
  { id: "linkedin_post", type: "process", label: "Write LinkedIn Post\n(Security-First Claude)", x: 400, y: 784, exp: 45,
    bypass: true, bypassOwner: "Self — skip if Mon/Tue apps not yet submitted",
    detail: {
      w: ["Use Thought Leadership Content Prompt", "Pillar 1: Security-first Claude deployments", "Angle: '5 security mistakes when deploying Claude in production'"],
      u: ["Hook: 2 lines max, stop the scroll", "No AI hype language whatsoever",
        "One concrete example from real production work", "Evidence over assertion — same bar as your code reviews"],
      c: ["Post published on LinkedIn"],
      i: ["Day: Friday", "Tags: #Claude #AIEngineering #AppSec", "Positioning: practitioner, not influencer"] } },
  { id: "await_decisions", type: "process", label: "Await Application\nDecisions", x: 400, y: 924, exp: 14400,
    detail: {
      w: ["Monitor email for both decisions", "Typical response: 1-2 weeks"],
      u: ["Do NOT follow up before 2 weeks", "Continue cert prep in parallel during wait"],
      c: ["Both decisions received"],
      i: ["Continue AI Fluency + event draft work during wait window"] } },
  { id: "apps_check", type: "decision", label: "Application(s)\nAccepted?", x: 400, y: 1064, exp: 5,
    detail: { w: ["Review decision emails"],
      u: [],
      c: ["At least one acceptance confirmed"],
      i: ["Even one acceptance allows cert + event track to proceed"] } },
  { id: "followup_esc", type: "escalation", label: "Application\nFollow-Up", x: 660, y: 1064, exp: 60,
    detail: {
      w: ["Review rejection reason if provided", "Identify weakest section: event specificity vs. community proof vs. deployment track record"],
      u: ["Reapply with stronger positioning", "Partner: ensure framing is implementer not power user",
        "Community: CLC institutional pitch can strengthen community evidence"],
      c: ["Reapplication submitted or 90-day pause decision made"],
      i: ["Anthropic contact: via program pages", "Warm CLC relationship is an asset for re-app evidence"] } },
  { id: "partner_portal", type: "process", label: "Partner Portal +\nAcademy Access", x: 400, y: 1204, exp: 60,
    detail: {
      w: ["Log into Partner Portal (link in acceptance email)", "Access Anthropic Academy training modules", "Download internal sales playbooks"],
      u: ["Complete Academy modules before Architect exam", "Start Services Partner Directory listing setup"],
      c: ["Portal confirmed", "Academy modules visible", "Directory profile started"],
      i: ["Unlocks: co-marketing, dedicated applied AI engineers, priority cert access"] } },
  { id: "architect_exam", type: "process", label: "Claude Certified\nArchitect Exam", x: 400, y: 1344, exp: 180,
    detail: {
      w: ["Complete all Academy modules first", "Study known gaps: Agent SDK (Task tool, hooks, fork_session), CLAUDE.md hierarchy, MCP scoping, Message Batches API"],
      u: ["Domain 1 (Agentic Architecture) = 27% weight — study this hardest",
        "Study order: TL;DR → analogy → concrete example → technical definition",
        "Review all four hands-on exercises",
        "Use NotebookLM with Anthropic docs as sources"],
      c: ["Score ≥ 720/1000", "Certificate issued and shareable on LinkedIn"],
      i: ["Passing score: 720/1000", "Early-adopter window is OPEN — almost no one holds this cert yet",
        "Unlocks: Builders Council, pre-release features, strongest Services Directory credential"] } },
  { id: "cert_check", type: "decision", label: "Score\n≥ 720?", x: 400, y: 1484, exp: 5,
    detail: { w: ["Check exam score report"], u: [], c: ["Pass or retake decision made"],
      i: ["Passing: 720/1000", "Domain weights: Domain 1 (Agentic) 27%, others TBD"] } },
  { id: "study_gap", type: "escalation", label: "Study Gap\nFill", x: 660, y: 1484, exp: 480,
    detail: {
      w: ["Pull score report — identify failed domains", "Known gaps: Agent SDK, CLAUDE.md hierarchy, MCP scoping, Message Batches API"],
      u: ["Load Anthropic docs into NotebookLM", "Study order: TL;DR → analogy → example → definition",
        "Recreate all four hands-on exercises from scratch"],
      c: ["All identified gaps addressed", "Ready to retake"],
      i: ["Google ML Eng ramp is separate — 3-6 months estimated",
        "SecAI+ gap: OWASP LLM Top 10, MITRE ATLAS, NIST AI RMF"] } },
  { id: "first_event", type: "process", label: "Plan + Execute\nFirst Milwaukee Event", x: 400, y: 1624, exp: 300,
    detail: {
      w: ["Activate CLC professor contact for venue (warm — do this first)", "Use Event Planning Prompt for full agenda",
        "Post to Luma", "Request Anthropic sponsorship ($500-$2K)"],
      u: ["Format B: Builder Workshop, 3 hrs, 8-20 devs",
        "Every hands-on activity: free claude.ai ONLY — no Pro/API",
        "Send pre-event email 1 week out",
        "Collect: attendance, hands-on completion rate, top 3 questions, feedback quotes"],
      c: ["Event executed", "≥ 10 attendees", "Impact data collected"],
      i: ["CLC: College of Lake County, IL — math professor is warm contact",
        "Lake County = 1hr north of Chicago, underserved vs. city meetup density"] } },
  { id: "handoff", type: "terminal", label: "Submit Impact Report\n+ Establish Cadence", x: 400, y: 1784, exp: 30, isHandoff: true,
    detail: {
      w: ["Use Post-Event Impact Report Prompt", "250-400 words", "Include: attendance, hands-on completion %, top questions, product feedback"],
      u: ["Show community growth signal — not just headcount",
        "Be honest about what failed — Anthropic values candor over cheerleading",
        "Request next event sponsorship in same email"],
      c: ["Report submitted to Anthropic", "Next event on calendar", "Ongoing ambassador cadence established"],
      i: ["Minimum viable outcome: 1 program accepted, cert in progress, 1 event executed"] } },
];

const EDGES_DEF = [
  { id: "e1", from: "start", to: "campus_check" },
  { id: "e2", from: "campus_check", to: "campus_skip", label: "Yes →\nskip" },
  { id: "e3", from: "campus_check", to: "apply_community", label: "No →\nproceed" },
  { id: "e4", from: "campus_skip", to: "apply_community", label: "rejoin" },
  { id: "e5", from: "apply_community", to: "apply_partner" },
  { id: "e6", from: "apply_partner", to: "ai_fluency" },
  { id: "e7", from: "ai_fluency", to: "event_draft" },
  { id: "e8", from: "event_draft", to: "linkedin_post" },
  { id: "e9", from: "linkedin_post", to: "await_decisions" },
  { id: "e10", from: "await_decisions", to: "apps_check" },
  { id: "e11", from: "apps_check", to: "followup_esc", label: "No" },
  { id: "e12", from: "apps_check", to: "partner_portal", label: "Yes" },
  { id: "e13", from: "followup_esc", to: "partner_portal", label: "↩ Resolved" },
  { id: "e14", from: "partner_portal", to: "architect_exam" },
  { id: "e15", from: "architect_exam", to: "cert_check" },
  { id: "e16", from: "cert_check", to: "study_gap", label: "No" },
  { id: "e17", from: "cert_check", to: "first_event", label: "Yes ≥720" },
  { id: "e18", from: "study_gap", to: "architect_exam", label: "↩ Retake" },
  { id: "e19", from: "first_event", to: "handoff" },
];

const HANDOFF_ITEMS = [
  { id: "h1", text: "Community Ambassador application submitted", critical: true },
  { id: "h2", text: "Partner Network application submitted", critical: true },
  { id: "h3", text: "AI Fluency Course completed", critical: true },
  { id: "h4", text: "At least one application accepted", critical: true },
  { id: "h5", text: "Milwaukee event concept document drafted", critical: false },
  { id: "h6", text: "LinkedIn thought leadership post published", critical: false },
  { id: "h7", text: "Architect exam registered or scheduled", critical: false },
];

const AI_SYSTEM = `You are an embedded AI assistant inside a process flowchart tool helping Kyle Rosebrook execute his Claude Programs application sprint (Community Ambassador + Claude Partner Network).

KYLE'S PROFILE:
- Role: AI Integration Strategist & Automation Expert at Intinc (50-200 engineer org)
- Personal brand: FlashFusion — AI platform, digital product catalog, SMB consulting
- Pursuing: Claude Community Ambassador (Milwaukee/Lake County IL) + Claude Partner Network
- Production stack: Claude API, Copilot Studio, n8n, Supabase, Cloudflare Workers, 50+ MCP connectors
- Real builds: LastPass→Bitwarden migration agent deployed as Teams chatbot, production AI systems daily
- Differentiators: AppSec background (security-first, not demo-grade), teaching track record with senior engineers, Milwaukee/Lake County = underserved market (1hr north of Chicago, less saturated than city meetup scene)

APPLICATION URLS:
- Community Ambassador: claude.com/community/ambassadors
- Partner Network: anthropic.com/news/claude-partner-network
- AI Fluency (free): claude.ai/learn
- Campus Ambassador (skip): claude.com/programs/campus — student-only, Kyle is NOT eligible

ARCHITECT EXAM:
- Passing score: 720/1000
- Domain 1 (Agentic Architecture) = 27% weight — highest priority
- Known gaps: Agent SDK (Task tool, hooks, fork_session), CLAUDE.md hierarchy, MCP scoping, Message Batches API, four hands-on exercises
- Study approach: TL;DR → analogy → concrete example → technical definition

MOST COMMON FAILURE CAUSES (in order):
1. Applications rejected: under-specific event ideas, no proof of organizing (not just attending), framed as power user not implementer
2. Cert failed: agentic domain gaps, hands-on exercises not practiced
3. Event low attendance: insufficient pre-promotion, CLC venue not activated

KEY CONTACTS / RESOURCES:
- CLC: College of Lake County — math professor (warm relationship) = #1 venue option for first event
- Luma: event listing platform
- NotebookLM: structured self-study system for cert prep
- Playbook prompts: Master Meta-Prompt, Community App Prompt, Partner App Prompt, Event Planning Prompt, Thought Leadership Prompt, Impact Report Prompt

TONE: Be concise — Kyle is mid-task. Lead with the most actionable fix. Exhaust all options before suggesting pause or escalation. Push back if Kyle is over-planning instead of executing. No filler.`;

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function getNodeCenter(node) {
  if (node.type === "decision") return { x: node.x, y: node.y };
  return { x: node.x, y: node.y };
}

function getBounds(node) {
  if (node.type === "decision") return { x: node.x - DS, y: node.y - DS, w: DS * 2, h: DS * 2 };
  if (node.type === "terminal") return { x: node.x - TW / 2, y: node.y - TH / 2, w: TW, h: TH };
  return { x: node.x - NW / 2, y: node.y - NH / 2, w: NW, h: NH };
}

function edgeEndpoints(fromNode, toNode) {
  const fb = getBounds(fromNode), tb = getBounds(toNode);
  const fx = fromNode.x, fy = fromNode.y;
  const tx = toNode.x, ty = toNode.y;
  const dx = tx - fx, dy = ty - fy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = dx / len, ny = dy / len;
  let sx = fx, sy = fy, ex = tx, ey = ty;
  const fh = fb.h / 2 + 4, fw = fb.w / 2 + 4;
  if (Math.abs(ny) > Math.abs(nx)) {
    sy = fy + Math.sign(ny) * fh;
  } else {
    sx = fx + Math.sign(nx) * fw;
  }
  const th = tb.h / 2 + 4, tw2 = tb.w / 2 + 4;
  if (Math.abs(ny) > Math.abs(nx)) {
    ey = ty - Math.sign(ny) * th;
  } else {
    ex = tx - Math.sign(nx) * tw2;
  }
  return { sx, sy, ex, ey };
}

function fmtDur(ms) {
  if (!ms) return "—";
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [nodes, setNodes] = useState(() => NODES_DEF.map(n => ({ ...n })));
  const [statuses, setStatuses] = useState({});
  const [notes, setNotes] = useState({});
  const [sessionLog, setSessionLog] = useState([]);
  const [nodeNotes, setNodeNotes] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [tab, setTab] = useState("details");
  const [zoom, setZoom] = useState(0.56);
  const [pan, setPan] = useState({ x: 260, y: 18 });
  const [editMode, setEditMode] = useState(false);
  const [sessionStart, setSessionStart] = useState(null);
  const [tick, setTick] = useState(0);
  const [nodeStartTimes, setNodeStartTimes] = useState({});
  const [aiMsgs, setAiMsgs] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiEditMode, setAiEditMode] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);
  const [downstreamModal, setDownstreamModal] = useState(null);
  const [bypassModal, setBypassModal] = useState(null);
  const [bypassReason, setBypassReason] = useState("");
  const [handoffItems, setHandoffItems] = useState(
    () => HANDOFF_ITEMS.reduce((a, it) => ({ ...a, [it.id]: "none" }), {})
  );
  const [editingLabel, setEditingLabel] = useState(null);
  const [nodeTimerNote, setNodeTimerNote] = useState("");

  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const stateRef = useRef({});
  stateRef.current = { nodes, statuses, notes, sessionLog, nodeNotes, sessionStart, nodeStartTimes, handoffItems };

  const activeNode = activeId ? nodes.find(n => n.id === activeId) : null;
  const activeStatus = activeId ? (statuses[activeId] || "todo") : "todo";

  // Timer
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Load
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res?.value) {
          const d = JSON.parse(res.value);
          if (d.nodes) setNodes(d.nodes);
          if (d.statuses) setStatuses(d.statuses);
          if (d.notes) setNotes(d.notes);
          if (d.sessionLog) setSessionLog(d.sessionLog);
          if (d.nodeNotes) setNodeNotes(d.nodeNotes);
          if (d.sessionStart) setSessionStart(d.sessionStart);
          if (d.nodeStartTimes) setNodeStartTimes(d.nodeStartTimes);
          if (d.handoffItems) setHandoffItems(d.handoffItems);
        }
      } catch {}
    })();
  }, []);

  // Save
  const save = useCallback(async (patch = {}) => {
    const s = { ...stateRef.current, ...patch };
    try { await window.storage.set(STORAGE_KEY, JSON.stringify(s)); } catch {}
  }, []);

  useEffect(() => { save(); }, [statuses, notes, sessionLog, nodeNotes, sessionStart, nodeStartTimes, handoffItems, nodes]);

  // Downstream detection
  function getDownstreamActive(nodeId) {
    const visited = new Set(), queue = [nodeId];
    while (queue.length) {
      const cur = queue.shift();
      EDGES_DEF.forEach(e => {
        if (e.from === cur && !visited.has(e.to)) {
          visited.add(e.to);
          queue.push(e.to);
        }
      });
    }
    visited.delete(nodeId);
    return [...visited].filter(id => statuses[id] === "active" || statuses[id] === "done");
  }

  function setStatus(id, newStatus, force = false) {
    const node = nodes.find(n => n.id === id);
    if (!force && (newStatus === "done" || newStatus === "active")) {
      const downstream = getDownstreamActive(id);
      if (downstream.length > 0) {
        setDownstreamModal({ id, newStatus, downstream });
        return;
      }
    }
    setStatuses(prev => ({ ...prev, [id]: newStatus }));
    const now = Date.now();
    if (newStatus === "active") {
      setNodeStartTimes(prev => ({ ...prev, [id]: now }));
      addLog(`▶ Started: ${node?.label?.replace("\n", " ")}`);
    } else if (newStatus === "done") {
      addLog(`✓ Done: ${node?.label?.replace("\n", " ")}`);
    } else if (newStatus === "blocked") {
      addLog(`⚠ Blocked: ${node?.label?.replace("\n", " ")}`);
    }
  }

  function addLog(msg) {
    const entry = { ts: Date.now(), msg };
    setSessionLog(prev => [...prev, entry]);
  }

  function handleBypass(node) {
    if (bypassModal) {
      setBypassModal(null);
      const reason = bypassReason.trim() || "No reason given";
      setStatuses(prev => ({ ...prev, [node.id]: "done" }));
      addLog(`↷ Bypassed: ${node.label.replace("\n", " ")} — ${reason}`);
      setBypassReason("");
    }
  }

  // SVG pan/zoom
  function onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom(z => Math.min(2, Math.max(0.25, z + delta)));
  }

  function onSvgMouseDown(e) {
    if (editMode && dragRef.current?.nodeId) return;
    dragRef.current = { type: "pan", startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
  }

  function onSvgMouseMove(e) {
    if (!dragRef.current) return;
    if (dragRef.current.type === "pan") {
      setPan({ x: dragRef.current.panX + (e.clientX - dragRef.current.startX), y: dragRef.current.panY + (e.clientY - dragRef.current.startY) });
    } else if (dragRef.current.type === "node" && editMode) {
      const nid = dragRef.current.nodeId;
      const dx = (e.clientX - dragRef.current.startX) / zoom;
      const dy = (e.clientY - dragRef.current.startY) / zoom;
      setNodes(prev => prev.map(n => n.id === nid ? { ...n, x: dragRef.current.origX + dx, y: dragRef.current.origY + dy } : n));
    }
  }

  function onSvgMouseUp() { dragRef.current = null; }

  function onNodeMouseDown(e, node) {
    e.stopPropagation();
    if (editMode) {
      dragRef.current = { type: "node", nodeId: node.id, startX: e.clientX, startY: e.clientY, origX: node.x, origY: node.y };
    }
  }

  function onNodeClick(e, node) {
    e.stopPropagation();
    setActiveId(node.id);
    setTab("details");
  }

  function onNodeDblClick(e, node) {
    e.stopPropagation();
    if (editMode) setEditingLabel({ id: node.id, value: node.label });
  }

  // Overtime check
  function isOvertime(node) {
    if (!nodeStartTimes[node.id]) return false;
    const elapsed = (Date.now() - nodeStartTimes[node.id]) / 60000; // minutes
    return elapsed > node.exp * 2;
  }

  // Copy ticket
  function copyTicket() {
    const done = nodes.filter(n => statuses[n.id] === "done").sort((a, b) => (nodeStartTimes[a.id] || 0) - (nodeStartTimes[b.id] || 0));
    const lines = ["=== Claude Programs Sprint Ticket ===", `Session: ${sessionStart ? new Date(sessionStart).toLocaleString() : "Not started"}`, ""];
    done.forEach(n => { lines.push(`[DONE] ${n.label.replace("\n", " ")} (${fmtTime(nodeStartTimes[n.id] || 0)})`); });
    const active = nodes.filter(n => statuses[n.id] === "active");
    active.forEach(n => { lines.push(`[ACTIVE] ${n.label.replace("\n", " ")}`); });
    const blocked = nodes.filter(n => statuses[n.id] === "blocked");
    blocked.forEach(n => { lines.push(`[BLOCKED] ${n.label.replace("\n", " ")}`); });
    if (sessionLog.length) { lines.push("", "=== Session Log ==="); sessionLog.forEach(e => lines.push(`${fmtTime(e.ts)} ${e.msg}`)); }
    navigator.clipboard?.writeText(lines.join("\n")).catch(() => {});
  }

  async function sendAI() {
    if (!aiInput.trim() || aiLoading) return;
    const userMsg = aiInput.trim();
    setAiInput("");
    const newMsgs = [...aiMsgs, { role: "user", content: userMsg }];
    setAiMsgs(newMsgs);
    setAiLoading(true);

    let systemContent = AI_SYSTEM;
    if (activeNode) {
      systemContent += `\n\nCURRENT NODE CONTEXT:\nNode: ${activeNode.label.replace("\n", " ")}\nStatus: ${statuses[activeNode.id] || "todo"}\nExpected time: ${activeNode.exp} min\nWalk-up checklist: ${(activeNode.detail?.w || []).join("; ")}\nOrg-specific info: ${(activeNode.detail?.i || []).join("; ")}`;
    }
    if (aiEditMode) {
      systemContent += `\n\nEDIT MODE ACTIVE. If making flowchart changes, output a [FLOWCHART_CHANGE]{...}[/FLOWCHART_CHANGE] block with JSON actions. Available action types: add_node, remove_node, update_node_label, update_node_detail, add_edge, remove_edge. Include add_node fields: id, type, label, x, y, exp. For add_node that replaces an edge, include removeEdge field.`;
      systemContent += `\n\nCURRENT FLOWCHART JSON:\n${JSON.stringify({ nodes, edges: EDGES_DEF }, null, 2)}`;
    }

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: systemContent,
          messages: newMsgs,
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "No response.";

      // Parse flowchart changes
      const changeMatch = text.match(/\[FLOWCHART_CHANGE\]([\s\S]*?)\[\/FLOWCHART_CHANGE\]/);
      if (changeMatch && aiEditMode) {
        try {
          const change = JSON.parse(changeMatch[1].trim());
          setPendingChange({ raw: text.replace(changeMatch[0], "").trim(), change });
        } catch {}
      }

      setAiMsgs([...newMsgs, { role: "assistant", content: text }]);
    } catch (err) {
      setAiMsgs([...newMsgs, { role: "assistant", content: `Error: ${err.message}` }]);
    }
    setAiLoading(false);
  }

  function applyChange(change) {
    if (!change) return;
    const actions = Array.isArray(change) ? change : [change];
    setNodes(prev => {
      let updated = [...prev];
      actions.forEach(a => {
        if (a.action === "add_node") updated = [...updated, { id: a.id, type: a.type || "process", label: a.label, x: a.x || 400, y: a.y || 400, exp: a.exp || 30, detail: a.detail || { w: [], u: [], c: [], i: [] } }];
        if (a.action === "remove_node") updated = updated.filter(n => n.id !== a.id);
        if (a.action === "update_node_label") updated = updated.map(n => n.id === a.id ? { ...n, label: a.label } : n);
        if (a.action === "update_node_detail") updated = updated.map(n => n.id === a.id ? { ...n, detail: { ...n.detail, ...a.detail } } : n);
      });
      return updated;
    });
    setPendingChange(null);
    addLog(`🔧 AI edit applied`);
  }

  // Handoff gate
  const criticalItems = HANDOFF_ITEMS.filter(i => i.critical);
  const criticalPassed = criticalItems.every(i => handoffItems[i.id] === "pass");

  // Progress stats
  const total = nodes.length;
  const doneCount = nodes.filter(n => statuses[n.id] === "done").length;
  const activeCount = nodes.filter(n => statuses[n.id] === "active").length;
  const blockedCount = nodes.filter(n => statuses[n.id] === "blocked").length;

  // Session elapsed
  const sessionElapsed = sessionStart ? Date.now() - sessionStart : 0;

  // ─── RENDER HELPERS ──────────────────────────────────────────
  function renderEdge(edge) {
    const fn = nodes.find(n => n.id === edge.from);
    const tn = nodes.find(n => n.id === edge.to);
    if (!fn || !tn) return null;
    const { sx, sy, ex, ey } = edgeEndpoints(fn, tn);
    const mx = (sx + ex) / 2, my = (sy + ey) / 2;
    const dx = ex - sx, dy = ey - sy;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const color = "#334155";
    return (
      <g key={edge.id}>
        <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={color} strokeWidth={1.5} markerEnd="url(#arrow)" />
        {edge.label && (
          <text x={mx} y={my - 6} fontSize={9} fill="#64748b" textAnchor="middle" style={{ fontFamily: "'JetBrains Mono',monospace", whiteSpace: "pre" }}>
            {edge.label}
          </text>
        )}
      </g>
    );
  }

  function renderNode(node) {
    const status = statuses[node.id] || "todo";
    const sc = STATUS_COLOR[status];
    const bg = STATUS_BG[status];
    const isSelected = activeId === node.id;
    const overtime = status === "active" && isOvertime(node);
    const selOutline = isSelected ? C_PRIMARY : "transparent";
    const lb = node.label.split("\n");

    const common = {
      style: { cursor: editMode ? "grab" : "pointer" },
      onClick: (e) => onNodeClick(e, node),
      onMouseDown: (e) => onNodeMouseDown(e, node),
      onDoubleClick: (e) => onNodeDblClick(e, node),
    };

    let shape = null;
    if (node.type === "terminal") {
      shape = (
        <g {...common} key={node.id}>
          {overtime && <rect x={node.x - TW / 2 - 5} y={node.y - TH / 2 - 5} width={TW + 10} height={TH + 10} rx={30} fill="none" stroke={C_ACCENT} strokeWidth={2} strokeDasharray="6 4" opacity={0.7} />}
          {isSelected && <rect x={node.x - TW / 2 - 3} y={node.y - TH / 2 - 3} width={TW + 6} height={TH + 6} rx={27} fill="none" stroke={selOutline} strokeWidth={2} />}
          <rect x={node.x - TW / 2} y={node.y - TH / 2} width={TW} height={TH} rx={24} fill={bg} stroke={sc} strokeWidth={isSelected ? 2 : 1.5} />
          {lb.map((line, i) => (
            <text key={i} x={node.x} y={node.y + (lb.length === 1 ? 4 : i === 0 ? -4 : 10)} textAnchor="middle" fill="#e2e8f0" fontSize={10} style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{line}</text>
          ))}
          <circle cx={node.x + TW / 2 - 10} cy={node.y - TH / 2 + 8} r={4} fill={sc} />
        </g>
      );
    } else if (node.type === "decision") {
      const pts = `${node.x},${node.y - DS} ${node.x + DS},${node.y} ${node.x},${node.y + DS} ${node.x - DS},${node.y}`;
      shape = (
        <g {...common} key={node.id}>
          {overtime && <polygon points={`${node.x},${node.y - DS - 6} ${node.x + DS + 6},${node.y} ${node.x},${node.y + DS + 6} ${node.x - DS - 6},${node.y}`} fill="none" stroke={C_ACCENT} strokeWidth={2} strokeDasharray="6 4" opacity={0.7} />}
          {isSelected && <polygon points={`${node.x},${node.y - DS - 4} ${node.x + DS + 4},${node.y} ${node.x},${node.y + DS + 4} ${node.x - DS - 4},${node.y}`} fill="none" stroke={selOutline} strokeWidth={2} />}
          <polygon points={pts} fill={bg} stroke={sc} strokeWidth={isSelected ? 2 : 1.5} />
          {lb.map((line, i) => (
            <text key={i} x={node.x} y={node.y + (lb.length === 1 ? 4 : i === 0 ? -4 : 10)} textAnchor="middle" fill="#e2e8f0" fontSize={9.5} style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{line}</text>
          ))}
          <circle cx={node.x + DS - 5} cy={node.y - DS + 5} r={4} fill={sc} />
        </g>
      );
    } else if (node.type === "escalation") {
      shape = (
        <g {...common} key={node.id}>
          {overtime && <rect x={node.x - NW / 2 - 5} y={node.y - NH / 2 - 5} width={NW + 10} height={NH + 10} rx={NRX + 3} fill="none" stroke={C_ACCENT} strokeWidth={2} strokeDasharray="6 4" opacity={0.7} />}
          {isSelected && <rect x={node.x - NW / 2 - 3} y={node.y - NH / 2 - 3} width={NW + 6} height={NH + 6} rx={NRX + 2} fill="none" stroke={selOutline} strokeWidth={2} />}
          <rect x={node.x - NW / 2} y={node.y - NH / 2} width={NW} height={NH} rx={NRX} fill={isSelected ? "#2a1006" : "#1a0a04"} stroke={C_ESC} strokeWidth={isSelected ? 2 : 1.5} />
          <rect x={node.x - NW / 2} y={node.y - NH / 2} width={5} height={NH} rx={NRX} fill={C_ESC} />
          {lb.map((line, i) => (
            <text key={i} x={node.x + 4} y={node.y + (lb.length === 1 ? 4 : i === 0 ? -4 : 10)} textAnchor="middle" fill="#fca882" fontSize={10} style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{line}</text>
          ))}
          <circle cx={node.x + NW / 2 - 10} cy={node.y - NH / 2 + 8} r={4} fill={C_ESC} />
        </g>
      );
    } else {
      // process
      shape = (
        <g {...common} key={node.id}>
          {overtime && <rect x={node.x - NW / 2 - 5} y={node.y - NH / 2 - 5} width={NW + 10} height={NH + 10} rx={NRX + 3} fill="none" stroke={C_ACCENT} strokeWidth={2} strokeDasharray="6 4" opacity={0.7} />}
          {isSelected && <rect x={node.x - NW / 2 - 3} y={node.y - NH / 2 - 3} width={NW + 6} height={NH + 6} rx={NRX + 2} fill="none" stroke={selOutline} strokeWidth={2} />}
          <rect x={node.x - NW / 2} y={node.y - NH / 2} width={NW} height={NH} rx={NRX} fill={bg} stroke={sc} strokeWidth={isSelected ? 2 : 1.5} />
          {lb.map((line, i) => (
            <text key={i} x={node.x} y={node.y + (lb.length === 1 ? 4 : i === 0 ? -4 : 10)} textAnchor="middle" fill={status === "todo" ? "#94a3b8" : "#e2e8f0"} fontSize={10} style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 500 }}>{line}</text>
          ))}
          {node.bypass && <text x={node.x - NW / 2 + 6} y={node.y + NH / 2 - 4} fontSize={8} fill="#64748b" style={{ fontFamily: "system-ui" }}>↷ bypassable</text>}
          <circle cx={node.x + NW / 2 - 10} cy={node.y - NH / 2 + 8} r={4} fill={sc} />
        </g>
      );
    }
    return shape;
  }

  // ─── RIGHT PANEL CONTENT ─────────────────────────────────────
  function renderDetails() {
    if (!activeNode) return (
      <div style={{ color: "#475569", textAlign: "center", marginTop: 40, fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>
        ← Select a node to view details
      </div>
    );
    const status = statuses[activeNode.id] || "todo";
    const sc = STATUS_COLOR[status];
    const d = activeNode.detail || {};
    const expStart = nodeStartTimes[activeNode.id];
    const elapsed = expStart ? Math.floor((Date.now() - expStart) / 60000) : null;

    if (activeNode.isHandoff) {
      return renderHandoffGate();
    }

    return (
      <div style={{ padding: "12px 14px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
        {/* Header */}
        <div style={{ marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #1e293b" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.3 }}>{activeNode.label.replace("\n", " ")}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ background: sc + "22", color: sc, padding: "2px 8px", borderRadius: 4, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${sc}44` }}>{status.toUpperCase()}</span>
            <span style={{ color: "#64748b", fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }}>exp {activeNode.exp}m</span>
            {elapsed !== null && <span style={{ color: elapsed > activeNode.exp * 2 ? C_ACCENT : "#64748b", fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }}>elapsed {elapsed}m {elapsed > activeNode.exp * 2 ? "⚠ overtime" : ""}</span>}
          </div>
        </div>

        {/* Status buttons */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          {["todo", "active", "done", "blocked"].map(s => (
            <button key={s} onClick={() => setStatus(activeNode.id, s)}
              style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${STATUS_COLOR[s]}44`, background: status === s ? STATUS_COLOR[s] + "33" : "#0f172a", color: STATUS_COLOR[s], fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>
              {s}
            </button>
          ))}
          {activeNode.type === "escalation" && status !== "done" && (
            <button onClick={() => setStatus(activeNode.id, "done")}
              style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${C_ESC}44`, background: "#2a1006", color: "#fca882", fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>
              ↩ Resolved
            </button>
          )}
          {activeNode.bypass && status !== "done" && (
            <button onClick={() => setBypassModal(activeNode)}
              style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid #47556933", background: "#0f172a", color: "#64748b", fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>
              Skip ↷
            </button>
          )}
        </div>

        {/* Detail sections */}
        {[["Walk-up", d.w], ["During", d.u], ["Completion criteria", d.c], ["Org-specific info", d.i]].map(([label, items]) =>
          items?.length > 0 && (
            <div key={label} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, color: "#475569", fontFamily: "'JetBrains Mono',monospace", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
              {items.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4, alignItems: "flex-start" }}>
                  <span style={{ color: "#334155", marginTop: 1, flexShrink: 0, fontSize: 10 }}>›</span>
                  <span style={{ color: "#94a3b8", fontSize: 11, lineHeight: 1.45, fontFamily: "system-ui" }}>{item}</span>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    );
  }

  function renderHandoffGate() {
    return (
      <div style={{ padding: "12px 14px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", fontFamily: "'JetBrains Mono',monospace", marginBottom: 4 }}>Handoff Gate</div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 14, fontFamily: "system-ui" }}>All ★ critical items must pass before marking done.</div>
        {criticalPassed && (
          <div style={{ background: "#052e16", border: "1px solid #15803d", borderRadius: 6, padding: "8px 12px", marginBottom: 12, color: "#4ade80", fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }}>
            ✓ READY TO HAND OFF
          </div>
        )}
        {HANDOFF_ITEMS.map(item => {
          const val = handoffItems[item.id];
          return (
            <div key={item.id} style={{ marginBottom: 10, padding: "8px 10px", background: "#0f172a", borderRadius: 5, border: "1px solid #1e293b" }}>
              <div style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 6 }}>
                <span style={{ color: item.critical ? C_ACCENT : "#475569", fontSize: 11, flexShrink: 0 }}>{item.critical ? "★" : "○"}</span>
                <span style={{ color: "#94a3b8", fontSize: 11, fontFamily: "system-ui", lineHeight: 1.4 }}>{item.text}</span>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                {["pass", "fail", "skip"].map(v => (
                  <button key={v} onClick={() => setHandoffItems(prev => ({ ...prev, [item.id]: v }))}
                    style={{ padding: "3px 9px", borderRadius: 3, border: `1px solid ${v === "pass" ? C_DONE : v === "fail" ? C_BLOCKED : "#334155"}44`, background: val === v ? (v === "pass" ? C_DONE + "33" : v === "fail" ? C_BLOCKED + "33" : "#33415533") : "transparent", color: v === "pass" ? "#4ade80" : v === "fail" ? "#f87171" : "#64748b", fontSize: 9, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        {criticalPassed && (
          <button onClick={() => setStatus(activeId, "done")}
            style={{ width: "100%", padding: "8px", borderRadius: 5, border: "none", background: C_DONE, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, marginTop: 8 }}>
            Mark Done — Sprint Complete
          </button>
        )}
      </div>
    );
  }

  function renderAI() {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ padding: "8px 12px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono',monospace" }}>AI Help — Claude Sonnet</span>
          <label style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
            <span style={{ fontSize: 9, color: aiEditMode ? C_ACCENT : "#475569", fontFamily: "'JetBrains Mono',monospace" }}>Edit Mode</span>
            <div onClick={() => setAiEditMode(!aiEditMode)}
              style={{ width: 28, height: 14, borderRadius: 7, background: aiEditMode ? C_ACCENT : "#1e293b", border: "1px solid #334155", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff", position: "absolute", top: 1, left: aiEditMode ? 15 : 1, transition: "left 0.2s" }} />
            </div>
          </label>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
          {aiMsgs.length === 0 && (
            <div style={{ color: "#334155", fontSize: 11, fontFamily: "system-ui", textAlign: "center", marginTop: 20 }}>
              Ask about this step, application strategy, cert prep, or Milwaukee event planning.
            </div>
          )}
          {aiMsgs.map((m, i) => (
            <div key={i} style={{ padding: "8px 10px", borderRadius: 5, background: m.role === "user" ? "#1e293b" : "#0d1117", border: `1px solid ${m.role === "user" ? "#334155" : "#1e293b"}`, fontSize: 11, color: m.role === "user" ? "#e2e8f0" : "#94a3b8", fontFamily: "system-ui", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
              {m.role === "user" && <span style={{ color: C_PRIMARY, fontSize: 9, fontFamily: "'JetBrains Mono',monospace", display: "block", marginBottom: 3 }}>YOU</span>}
              {m.role === "assistant" && <span style={{ color: "#475569", fontSize: 9, fontFamily: "'JetBrains Mono',monospace", display: "block", marginBottom: 3 }}>CLAUDE</span>}
              {m.content.replace(/\[FLOWCHART_CHANGE\][\s\S]*?\[\/FLOWCHART_CHANGE\]/g, "[flowchart change queued]")}
            </div>
          ))}
          {aiLoading && (
            <div style={{ padding: "8px 10px", borderRadius: 5, background: "#0d1117", border: "1px solid #1e293b", color: "#475569", fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }}>
              ···
            </div>
          )}
          {pendingChange && (
            <div style={{ padding: "10px 12px", borderRadius: 5, background: "#1a1000", border: `1px solid ${C_ACCENT}44` }}>
              <div style={{ fontSize: 10, color: C_ACCENT, fontFamily: "'JetBrains Mono',monospace", marginBottom: 6 }}>PENDING FLOWCHART CHANGE</div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "system-ui", marginBottom: 8 }}>{pendingChange.raw}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => applyChange(pendingChange.change)} style={{ padding: "4px 12px", borderRadius: 4, border: "none", background: C_DONE, color: "#fff", fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>Apply</button>
                <button onClick={() => setPendingChange(null)} style={{ padding: "4px 12px", borderRadius: 4, border: "1px solid #334155", background: "transparent", color: "#64748b", fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>Dismiss</button>
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: "8px 12px", borderTop: "1px solid #1e293b", display: "flex", gap: 6 }}>
          <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendAI()}
            placeholder="Ask about this step…"
            style={{ flex: 1, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 4, padding: "6px 10px", color: "#e2e8f0", fontSize: 11, fontFamily: "system-ui", outline: "none" }} />
          <button onClick={sendAI} disabled={aiLoading || !aiInput.trim()}
            style={{ padding: "6px 12px", borderRadius: 4, border: "none", background: aiLoading ? "#1e293b" : C_PRIMARY, color: "#fff", fontSize: 11, cursor: aiLoading ? "default" : "pointer", fontFamily: "'JetBrains Mono',monospace" }}>
            ↑
          </button>
        </div>
      </div>
    );
  }

  function renderNotes() {
    const nodeNote = activeId ? (nodeNotes[activeId] || "") : "";
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "10px 12px", boxSizing: "border-box", gap: 10 }}>
        {activeNode && (
          <div>
            <div style={{ fontSize: 9, color: "#475569", fontFamily: "'JetBrains Mono',monospace", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>Node Note — {activeNode.label.replace("\n", " ")}</div>
            <textarea value={nodeNote}
              onChange={e => setNodeNotes(prev => ({ ...prev, [activeId]: e.target.value }))}
              placeholder="Notes for this step…"
              style={{ width: "100%", height: 90, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 4, color: "#94a3b8", fontSize: 11, fontFamily: "system-ui", padding: "6px 8px", resize: "none", boxSizing: "border-box", outline: "none" }} />
          </div>
        )}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: 9, color: "#475569", fontFamily: "'JetBrains Mono',monospace", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Session Log</div>
          {sessionLog.length === 0 && <div style={{ color: "#334155", fontSize: 11, fontFamily: "system-ui" }}>No events yet.</div>}
          {[...sessionLog].reverse().map((entry, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, alignItems: "flex-start" }}>
              <span style={{ color: "#334155", fontSize: 9, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0, marginTop: 1 }}>{fmtTime(entry.ts)}</span>
              <span style={{ color: "#64748b", fontSize: 11, fontFamily: "system-ui", lineHeight: 1.4 }}>{entry.msg}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderProgress() {
    return (
      <div style={{ padding: "10px 12px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono',monospace" }}>Overall Progress</span>
            <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono',monospace" }}>{doneCount}/{total}</span>
          </div>
          <div style={{ height: 6, background: "#1e293b", borderRadius: 3 }}>
            <div style={{ height: 6, background: C_DONE, borderRadius: 3, width: `${(doneCount / total) * 100}%`, transition: "width 0.3s" }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            {[["active", activeCount, C_ACTIVE], ["blocked", blockedCount, C_BLOCKED], ["done", doneCount, C_DONE]].map(([label, count, color]) => (
              <div key={label} style={{ fontSize: 10, color, fontFamily: "'JetBrains Mono',monospace" }}>{count} {label}</div>
            ))}
          </div>
        </div>
        {/* Session timer */}
        <div style={{ marginBottom: 14, padding: "8px 10px", background: "#0f172a", borderRadius: 5, border: "1px solid #1e293b" }}>
          <div style={{ fontSize: 9, color: "#475569", fontFamily: "'JetBrains Mono',monospace", marginBottom: 3, textTransform: "uppercase" }}>Session</div>
          <div style={{ fontSize: 14, color: "#e2e8f0", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{fmtDur(sessionElapsed)}</div>
          {!sessionStart ? (
            <button onClick={() => { setSessionStart(Date.now()); addLog("⚡ Session started"); }}
              style={{ marginTop: 6, padding: "4px 10px", borderRadius: 4, border: "none", background: C_PRIMARY, color: "#fff", fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>
              Start Session
            </button>
          ) : (
            <button onClick={() => { setSessionStart(null); addLog("■ Session ended"); }}
              style={{ marginTop: 6, padding: "4px 10px", borderRadius: 4, border: "1px solid #334155", background: "transparent", color: "#64748b", fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>
              End Session
            </button>
          )}
        </div>
        {/* Node list */}
        <div style={{ fontSize: 9, color: "#475569", fontFamily: "'JetBrains Mono',monospace", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>All Nodes</div>
        {nodes.map(n => {
          const s = statuses[n.id] || "todo";
          return (
            <div key={n.id} onClick={() => { setActiveId(n.id); setTab("details"); }}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", marginBottom: 2, borderRadius: 4, background: activeId === n.id ? "#1e293b" : "transparent", cursor: "pointer", borderLeft: `3px solid ${STATUS_COLOR[s]}` }}>
              <span style={{ fontSize: 10, color: STATUS_COLOR[s], fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>{s === "done" ? "✓" : s === "active" ? "▶" : s === "blocked" ? "✗" : "○"}</span>
              <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "system-ui", lineHeight: 1.3 }}>{n.label.replace("\n", " ")}</span>
              {isOvertime(n) && <span style={{ color: C_ACCENT, fontSize: 9 }}>⚠</span>}
            </div>
          );
        })}
      </div>
    );
  }

  const tabContent = { details: renderDetails(), ai: renderAI(), notes: renderNotes(), progress: renderProgress() };

  // ─── MAIN RENDER ─────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#020617", color: "#e2e8f0", fontFamily: "system-ui" }}>
      {/* Top bar */}
      <div style={{ height: 44, background: "#0a0e1a", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", padding: "0 14px", gap: 12, flexShrink: 0 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: C_PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>⬡</div>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 12, color: "#e2e8f0", letterSpacing: "0.02em" }}>Claude Programs Sprint</span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#475569", marginRight: "auto" }}>v1.0 · March 2026</span>
        <span style={{ fontSize: 10, color: "#475569", fontFamily: "'JetBrains Mono',monospace" }}>zoom {Math.round(zoom * 100)}%</span>
        <button onClick={() => setEditMode(!editMode)}
          style={{ padding: "3px 10px", borderRadius: 4, border: `1px solid ${editMode ? C_PRIMARY : "#334155"}`, background: editMode ? C_PRIMARY + "22" : "transparent", color: editMode ? C_PRIMARY : "#475569", fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>
          {editMode ? "✓ Edit Mode" : "Edit/Arrange"}
        </button>
        <button onClick={copyTicket}
          style={{ padding: "3px 10px", borderRadius: 4, border: "1px solid #334155", background: "transparent", color: "#64748b", fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>
          Copy Ticket
        </button>
        <button onClick={() => window.print()}
          style={{ padding: "3px 10px", borderRadius: 4, border: "1px solid #334155", background: "transparent", color: "#64748b", fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>
          Print
        </button>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* SVG Canvas */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative", background: "#020617" }}
          onWheel={onWheel} onMouseMove={onSvgMouseMove} onMouseUp={onSvgMouseUp} onMouseLeave={onSvgMouseUp}>
          {/* Legend */}
          <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10, background: "#0a0e1aee", border: "1px solid #1e293b", borderRadius: 6, padding: "8px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
            {[["terminal", "Milestone", "#94a3b8"], ["process", "Step", "#94a3b8"], ["decision", "Decision", "#94a3b8"], ["escalation", "Escalation", "#fca882"]].map(([type, label, color]) => (
              <div key={type} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, color, fontFamily: "'JetBrains Mono',monospace" }}>
                <div style={{ width: 12, height: type === "decision" ? 10 : 8, background: type === "escalation" ? "#1a0a04" : "#0f172a", border: `1.5px solid ${type === "escalation" ? C_ESC : "#334155"}`, borderRadius: type === "terminal" ? 4 : type === "decision" ? 0 : 1, transform: type === "decision" ? "rotate(45deg)" : "none" }} />
                {label}
              </div>
            ))}
            <div style={{ borderTop: "1px solid #1e293b", paddingTop: 4, marginTop: 2, display: "flex", flexDirection: "column", gap: 3 }}>
              {[["todo", "○"], ["active", "▶"], ["done", "✓"], ["blocked", "✗"]].map(([s, icon]) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, color: STATUS_COLOR[s], fontFamily: "'JetBrains Mono',monospace" }}>
                  <span>{icon}</span>{s}
                </div>
              ))}
            </div>
          </div>

          <svg ref={svgRef} width="100%" height="100%"
            onMouseDown={onSvgMouseDown}
            style={{ cursor: editMode ? "crosshair" : "grab", userSelect: "none" }}>
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#334155" />
              </marker>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="0" cy="0" r="0.6" fill="#1e293b" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {EDGES_DEF.map(e => renderEdge(e))}
              {nodes.map(n => renderNode(n))}
              {/* Inline label edit */}
              {editingLabel && (() => {
                const n = nodes.find(x => x.id === editingLabel.id);
                if (!n) return null;
                return (
                  <foreignObject x={n.x - 70} y={n.y - 14} width={140} height={28}>
                    <input value={editingLabel.value} autoFocus
                      onChange={e => setEditingLabel(prev => ({ ...prev, value: e.target.value }))}
                      onBlur={() => { setNodes(prev => prev.map(x => x.id === editingLabel.id ? { ...x, label: editingLabel.value } : x)); setEditingLabel(null); }}
                      onKeyDown={e => e.key === "Enter" && e.target.blur()}
                      style={{ width: "100%", background: "#1e293b", border: `1px solid ${C_PRIMARY}`, color: "#e2e8f0", fontSize: 10, fontFamily: "'JetBrains Mono',monospace", padding: "2px 4px", borderRadius: 3, outline: "none" }} />
                  </foreignObject>
                );
              })()}
            </g>
          </svg>
        </div>

        {/* Right panel */}
        <div style={{ width: 320, background: "#0a0e1a", borderLeft: "1px solid #1e293b", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: "1px solid #1e293b", flexShrink: 0 }}>
            {[["details", "Details"], ["ai", "AI Help"], ["notes", "Notes"], ["progress", "Progress"]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                style={{ flex: 1, padding: "9px 4px", border: "none", borderBottom: tab === key ? `2px solid ${C_PRIMARY}` : "2px solid transparent", background: "transparent", color: tab === key ? "#e2e8f0" : "#475569", fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: tab === key ? 700 : 400 }}>
                {label}
              </button>
            ))}
          </div>
          {/* Tab content */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            {tabContent[tab]}
          </div>
        </div>
      </div>

      {/* Downstream Modal */}
      {downstreamModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000000aa", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#0a0e1a", border: `1px solid ${C_ACCENT}44`, borderRadius: 8, padding: 20, maxWidth: 360, width: "90%" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C_ACCENT, fontFamily: "'JetBrains Mono',monospace", marginBottom: 8 }}>⚠ Downstream Alert</div>
            <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: "system-ui", marginBottom: 12, lineHeight: 1.5 }}>
              Marking this step <strong style={{ color: "#e2e8f0" }}>{downstreamModal.newStatus}</strong> affects {downstreamModal.downstream.length} downstream step(s):
            </div>
            {downstreamModal.downstream.map(id => {
              const n = nodes.find(x => x.id === id);
              return <div key={id} style={{ fontSize: 11, color: STATUS_COLOR[statuses[id]], fontFamily: "'JetBrains Mono',monospace", marginBottom: 4 }}>• {n?.label.replace("\n", " ")} ({statuses[id]})</div>;
            })}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button onClick={() => { setStatus(downstreamModal.id, downstreamModal.newStatus, true); setDownstreamModal(null); }}
                style={{ flex: 1, padding: "7px", borderRadius: 5, border: "none", background: C_PRIMARY, color: "#fff", fontSize: 11, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>
                Proceed Anyway
              </button>
              <button onClick={() => setDownstreamModal(null)}
                style={{ flex: 1, padding: "7px", borderRadius: 5, border: "1px solid #334155", background: "transparent", color: "#64748b", fontSize: 11, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bypass Modal */}
      {bypassModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000000aa", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#0a0e1a", border: "1px solid #33415580", borderRadius: 8, padding: 20, maxWidth: 360, width: "90%" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", fontFamily: "'JetBrains Mono',monospace", marginBottom: 4 }}>Skip ↷ Bypass</div>
            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "system-ui", marginBottom: 10 }}>Owner: {bypassModal.bypassOwner}</div>
            <input value={bypassReason} onChange={e => setBypassReason(e.target.value)}
              placeholder="Reason for bypassing this step…"
              style={{ width: "100%", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 4, color: "#e2e8f0", fontSize: 11, fontFamily: "system-ui", padding: "7px 10px", boxSizing: "border-box", outline: "none", marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => handleBypass(bypassModal)}
                style={{ flex: 1, padding: "7px", borderRadius: 5, border: "none", background: C_TODO, color: "#94a3b8", fontSize: 11, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>
                Confirm Skip ↷
              </button>
              <button onClick={() => { setBypassModal(null); setBypassReason(""); }}
                style={{ flex: 1, padding: "7px", borderRadius: 5, border: "1px solid #334155", background: "transparent", color: "#64748b", fontSize: 11, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
