import { useState, useEffect, useRef } from "react";

const C = {
  primary: "#4338ca", accent: "#d97706", esc: "#c2410c",
  done: "#15803d", active: "#6d28d9", blocked: "#b91c1c", todo: "#475569",
  bg: "#080e1a", surface: "#0f1929", panel: "#0b1420",
  border: "#1a2840", text: "#e2eaf8", muted: "#5a6e88", sub: "#7a90aa",
};

function dims(type) {
  if (type === "terminal") return [168, 44];
  if (type === "decision") return [148, 80];
  if (type === "escalation") return [184, 44];
  return [208, 54];
}
function anc(node, dir) {
  const [w, h] = dims(node.type);
  return { t: [node.x, node.y - h / 2], b: [node.x, node.y + h / 2], l: [node.x - w / 2, node.y], r: [node.x + w / 2, node.y] }[dir];
}
function mkPath(e, nm) {
  const s = nm[e.from], t = nm[e.to];
  if (!s || !t) return "";
  const dx = t.x - s.x, dy = t.y - s.y;
  if (Math.abs(dx) < 80) {
    const [x1, y1] = anc(s, "b"), [x2, y2] = anc(t, "t"), cy = (y1 + y2) / 2;
    return `M${x1},${y1} C${x1},${cy} ${x2},${cy} ${x2},${y2}`;
  }
  if (dx > 80) {
    const [x1, y1] = anc(s, "r"), [x2, y2] = anc(t, "l"), cx = (x1 + x2) / 2;
    return `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`;
  }
  if (dy >= 0) {
    const [x1, y1] = anc(s, "b"), [x2, y2] = anc(t, "t");
    return `M${x1},${y1} C${x1},${y1 + 80} ${x2 + 100},${y2} ${x2},${y2}`;
  }
  const [x1, y1] = anc(s, "r"), [x2, y2] = anc(t, "r"), mx = Math.max(x1, x2) + 100;
  return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
}
function splitText(txt, max) {
  const words = txt.split(" "), lines = [];
  let cur = "";
  for (const w of words) { if (cur && (cur + " " + w).length > max) { lines.push(cur); cur = w; } else cur = cur ? cur + " " + w : w; }
  if (cur) lines.push(cur);
  return lines;
}
function fmtMs(ms) {
  if (!ms || ms <= 0) return "—";
  const s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60);
  if (h > 0) return `${h}h${m % 60}m`; if (m > 0) return `${m}m${s % 60}s`; return `${s}s`;
}

const NODES = [
  { id: "start", type: "terminal", label: "Deployment Start", x: 400, y: 80, exp: 5, details: { w: ["Confirm enterprise account in Supabase","Verify admin access to Profile Builder","Confirm Supabase Edge Function (Claude proxy) is live"], u: ["Record start time and stakeholder contacts","Confirm deployment scope and org tier"], c: ["Admin login confirmed","Edge function health check passes"], i: ["Repo: Krosebrook/Enterpriseprofilebuilder (229 TS files, Phase 11/12)","Claude API: NEVER direct from frontend — Supabase Edge Function only","Contact Kyle for project credentials"] } },
  { id: "org_setup", type: "process", label: "Organization Setup", x: 400, y: 220, exp: 20, details: { w: ["Admin → Organization Settings","Prepare: org name, domain, billing contact, data residency"], u: ["Set domain allowlist for invitations","EU data residency MUST be set before any user creation","Enable feature flags per org tier"], c: ["Org profile saved","Domain verified (up to 5 min)","Feature flags confirmed"], i: ["EU orgs: data residency MUST be EU before user creation — not retroactive","Feature flags matrix: ask Kyle","Org names are immutable after first user created"] } },
  { id: "sso_decision", type: "decision", label: "SSO/SAML Required?", x: 400, y: 380, exp: 5, details: { w: ["Check onboarding contract for SSO requirement","Confirm IdP vendor: Okta or Azure AD"], u: ["Yes → configure SSO/SAML (right)","No → proceed with email/password"], c: ["SSO requirement confirmed with stakeholder"], i: ["Most enterprise contracts require SSO","Only Okta and Azure AD are supported IdPs"] } },
  { id: "sso_fix", type: "escalation", label: "Configure SSO/SAML", x: 660, y: 380, exp: 30, details: { w: ["Get Entity ID + ACS URL: Admin → Identity → SSO/SAML","Share with client IdP admin; receive IdP metadata XML"], u: ["Upload metadata XML in SSO settings","Map attributes: email→email, displayName→name, groups→roles","Test SSO with pilot user"], c: ["SSO login succeeds for pilot user","Role mapping confirmed in user profile"], i: ["ACS URL: https://[project-ref].supabase.co/auth/v1/callback","Top failure: attribute casing mismatch (email vs Email)","Escalate to Sourabh if Supabase Auth SAML is inaccessible"] } },
  { id: "role_inventory", type: "process", label: "Role Inventory & Mapping", x: 400, y: 530, exp: 30, details: { w: ["Export org chart from HR system","Identify Claude use cases per role (drafting, analysis, coding)","Map to Profile Builder role categories"], u: ["Create role entries in Profile Builder","Tag each with primary use case and headcount"], c: ["All roles entered","Use cases documented","Stakeholder sign-off"], i: ["Min roles: Admin, Standard User, Read-Only","Max profiles per role: 3 (current tier)","Role names must be unique within org"] } },
  { id: "profile_builder", type: "process", label: "Build Claude Profiles", x: 400, y: 690, exp: 60, checklist: true, checklistItems: [{ id: "pb1", label: "System prompt written for each role", critical: true },{ id: "pb2", label: "Tone and format guidelines set", critical: false },{ id: "pb3", label: "Tool access configured per role", critical: true },{ id: "pb4", label: "Output length limits set", critical: false },{ id: "pb5", label: "Profiles saved and versioned (e.g. v1.0-legal)", critical: true }], details: { w: ["Profiles tab → select role → use guided template or write custom prompt"], u: ["Test with sample prompts before saving","Enable/disable tools per role (web search, code exec, file upload)","Version-tag each profile"], c: ["All roles have ≥1 active profile","Smoke test passes","Version tags applied"], i: ["Profile injected server-side via Edge Function — never in frontend","Anti-pattern: overly restrictive prompts block legitimate use cases","Profile inheritance: child roles inherit parent unless overridden"] } },
  { id: "mcp_catalog", type: "process", label: "Configure MCP Catalog", x: 400, y: 850, exp: 45, details: { w: ["Integration → MCP Catalog","Select servers: Slack, Jira, GitHub, Linear, Notion, etc.","For each: enter server URL and auth token"], u: ["Test each server with ping/health check","Assign servers to role profiles","Document token locations"], c: ["All selected servers show Connected","Assigned to correct profiles","Token locations documented"], i: ["Tokens: Supabase Secrets panel — NEVER in frontend","Stale status after token refresh → Settings → Manual Sync","~30 supported servers in catalog"] } },
  { id: "integration_marketplace", type: "process", label: "Integration Marketplace", x: 400, y: 1010, exp: 30, bypass: true, bypassReason: "Optional — skip if org has no supported integrations or defers to Phase 2.", details: { w: ["Integration → Marketplace","Browse connectors, OAuth-connect each needed service"], u: ["Map integration events to Claude triggers","Test end-to-end with sample event"], c: ["All required integrations connected","Sample event flow passes"], i: ["Marketplace = event/data connectors; MCP Catalog = tool calling — different layers","OAuth tokens: Supabase server-side only"] } },
  { id: "eu_ai_act", type: "process", label: "EU AI Act Compliance", x: 400, y: 1170, exp: 45, details: { w: ["Confirm Phase 10 deployed (tracker requires it)","Compliance → EU AI Act Tracker","Run auto-classification on each role's use case"], u: ["For each High-Risk flag: document mitigation","Attach evidence (policies, human oversight confirmation)","Complete and export risk register"], c: ["All use cases classified","High-Risk items have documented mitigations","Risk register exported"], i: ["High-Risk → mandatory legal review before proceeding — no exceptions","Common high-risk triggers: HR screening, credit scoring, access control","Tracker built in Phase 10 — confirm deployed first"] } },
  { id: "eu_compliance_decision", type: "decision", label: "Compliance Gaps?", x: 400, y: 1330, exp: 5, details: { w: ["Review EU AI Act Tracker summary","Check for unresolved High-Risk flags"], u: ["Yes → compliance fix node","No → proceed to agent builder"], c: ["All gaps identified and routed"], i: ["Do not proceed to pilot with unresolved ★ items"] } },
  { id: "compliance_fix", type: "escalation", label: "Resolve Compliance Gaps", x: 660, y: 1330, exp: 120, details: { w: ["Document each gap with tracker gap ID","Assign to Legal/Compliance contact"], u: ["Implement mitigations (human-in-loop, audit logging)","Update risk register and re-run classification"], c: ["All High-Risk flags resolved or formally accepted with written sign-off"], i: ["Escalate to: Legal/Compliance team","SLA: 5 business days standard","Written sign-off required — no verbal acceptances"] } },
  { id: "agent_builder", type: "process", label: "Configure ReAct Agents", x: 400, y: 1490, exp: 60, bypass: true, bypassReason: "Skip if org does not require automated agent workflows in Phase 1.", details: { w: ["Agents → Builder","Define agent goal and stopping conditions","Add tools from MCP Catalog to agent toolchain"], u: ["Set max iterations and timeout","Run dry-run mode (no side effects)","Assign agent to role profiles"], c: ["Agent dry-run passes all test cases","Max iterations + timeout configured","Agent assigned to profiles"], i: ["ReAct: Reason → Act → Observe, repeat until stopping condition","Top failure: missing tool permissions — check MCP server auth per tool","Malformed tool schema: silent loop exit — validate with dry-run first"] } },
  { id: "soc2_gate", type: "process", label: "SOC 2 Review Gate", x: 400, y: 1660, exp: 60, checklist: true, isGate: true, checklistItems: [{ id: "sg1", label: "Encryption at rest: Supabase AES-256 confirmed", critical: true },{ id: "sg2", label: "Encryption in transit: TLS 1.2+ confirmed", critical: true },{ id: "sg3", label: "RBAC configured for all roles", critical: true },{ id: "sg4", label: "Audit logging enabled for all admin actions", critical: true },{ id: "sg5", label: "API keys in Supabase Secrets — not in frontend code", critical: true },{ id: "sg6", label: "Incident response contact confirmed", critical: false },{ id: "sg7", label: "Data retention policy documented", critical: false },{ id: "sg8", label: "Employee access review scheduled", critical: false }], details: { w: ["Pull SOC 2 checklist for this deployment","Verify each ★ item vs. Supabase dashboard and code review"], u: ["Flag any gaps to Kyle or Sourabh immediately","Non-critical: accept or defer with documented reason"], c: ["All ★ critical items passing","Non-critical items reviewed"], i: ["SOC 2 gate MUST clear before pilot — no exceptions","Supabase: SOC 2 Type II for infra layer","App-layer items (RBAC, audit logs): deployment team responsibility"] } },
  { id: "pilot_deploy", type: "process", label: "Pilot Deployment", x: 400, y: 1820, exp: 30, details: { w: ["Invite pilot group: 5–20 users recommended","Send onboarding email with access instructions","Enable pilot feature flags"], u: ["Monitor Supabase logs first 48h","Set up Sentry/PostHog alerts for pilot org","Daily check-in with pilot lead"], c: ["Pilot users have accessed platform","No critical errors first 48h","Feedback mechanism confirmed"], i: ["Sentry org: flashfusion-co (confirm if separate for this product)","PostHog: tag pilot events with 'pilot' property","Pilot SLA: 2-week window before rollout decision"] } },
  { id: "pilot_decision", type: "decision", label: "Pilot Passed?", x: 400, y: 1980, exp: 5, details: { w: ["Review pilot feedback","Check Sentry error rates","Confirm pilot lead sign-off"], u: ["Score vs. acceptance criteria","Identify blocking P0 issues"], c: ["Stakeholder confirms go/no-go"], i: ["Pass: <2% error rate, >70% satisfaction, no P0 bugs"] } },
  { id: "iterate_profiles", type: "process", label: "Iterate from Pilot Feedback", x: 660, y: 1980, exp: 60, details: { w: ["Collect and categorize feedback","Prioritize: profile changes vs. bugs vs. UX","Update profiles in Profile Builder"], u: ["Re-test with pilot users","Document changes in version history"], c: ["All P0/P1 items addressed","Updated profiles approved by pilot lead"], i: ["Profile-only changes: no SOC 2 re-review needed","RBAC/data handling changes: SOC 2 re-review required","Max 2 iteration cycles before escalating timeline to PM"] } },
  { id: "full_rollout", type: "process", label: "Full Enterprise Rollout", x: 400, y: 2130, exp: 45, details: { w: ["Disable pilot flags, enable production flags","Send org-wide invitation emails","Publish internal user guide"], u: ["Monitor Supabase + Sentry first 24h","Confirm all roles provisioned correctly","Smoke test: 3 representative accounts"], c: ["All users provisioned","No critical errors first 24h","Smoke test passes"], i: ["Bulk import: Admin → Users → Import (CSV)","Sentry alert: >1% error rate","Rollout comms: from org's internal IT, not Intinc directly"] } },
  { id: "handoff", type: "terminal", label: "Deployment Complete", x: 400, y: 2270, exp: 10, details: { w: ["Export deployment summary report","Transfer admin credentials to org admin","Schedule 30-day check-in"], u: ["Document known issues and deferred items","Update Intinc project tracker"], c: ["Org admin has full access","Handoff doc delivered","30-day check-in scheduled"], i: ["Handoff doc template: ask Kyle","Archive deployment notes to Google Drive","Phase 12 of 12 — deployment closed"] } }
];

const EDGES = [
  { id: "e1", from: "start", to: "org_setup" },
  { id: "e2", from: "org_setup", to: "sso_decision" },
  { id: "e3", from: "sso_decision", to: "sso_fix", label: "Yes →" },
  { id: "e4", from: "sso_decision", to: "role_inventory", label: "No →" },
  { id: "e5", from: "sso_fix", to: "role_inventory", label: "↩ done" },
  { id: "e6", from: "role_inventory", to: "profile_builder" },
  { id: "e7", from: "profile_builder", to: "mcp_catalog" },
  { id: "e8", from: "mcp_catalog", to: "integration_marketplace" },
  { id: "e9", from: "integration_marketplace", to: "eu_ai_act" },
  { id: "e10", from: "eu_ai_act", to: "eu_compliance_decision" },
  { id: "e11", from: "eu_compliance_decision", to: "compliance_fix", label: "Yes →" },
  { id: "e12", from: "eu_compliance_decision", to: "agent_builder", label: "No →" },
  { id: "e13", from: "compliance_fix", to: "eu_ai_act", label: "↩ done" },
  { id: "e14", from: "agent_builder", to: "soc2_gate" },
  { id: "e15", from: "soc2_gate", to: "pilot_deploy" },
  { id: "e16", from: "pilot_deploy", to: "pilot_decision" },
  { id: "e17", from: "pilot_decision", to: "full_rollout", label: "Yes ✓" },
  { id: "e18", from: "pilot_decision", to: "iterate_profiles", label: "No →" },
  { id: "e19", from: "iterate_profiles", to: "profile_builder", label: "↩ iterate" },
  { id: "e20", from: "full_rollout", to: "handoff" },
];

const AI_SYS = `You are a deployment assistant for the Enterprise Claude Profile Builder — Intinc's enterprise Claude AI adoption platform (Phase 11/12).

STACK: React + TypeScript, Supabase Edge Functions (Claude API proxy), SOC 2 compliant. Repo: Krosebrook/Enterpriseprofilebuilder, 229 TS files.
CRITICAL: Claude API NEVER called from frontend — always via Supabase Edge Function only.

FAILURE CAUSES (order of likelihood):
1. SSO/SAML: attribute casing mismatch (email vs Email), wrong ACS URL
2. Role definitions missing before profile creation
3. EU AI Act: high-risk use case without documented mitigation
4. MCP server stale after token refresh → Settings → Manual Sync
5. ReAct agent: missing tool permissions or malformed tool schema
6. Pilot rejection: profile prompt too restrictive or permissive

ESCALATION: Kyle (AI SME, profile config, Claude API, agent builder) | Sourabh Rajput (Supabase, infra, integrations) | Legal (EU AI Act, SOC 2 gaps)

SECRETS: API keys → Supabase Edge Function Secrets panel | SSO config → Admin → Identity → SSO/SAML | MCP tokens → Supabase Secrets | ACS URL → https://[project-ref].supabase.co/auth/v1/callback

KNOWN ISSUES: Edge function redeployment blocked in long Supabase MCP sessions → use hardcoded fallback secrets workaround | MCP stale status → Manual Sync | EU AI Act high-risk → mandatory legal review before proceeding

Exhaust all options before suggesting escalation. Lead with the most likely fix. Be concise — operator is mid-deployment.`;

export default function ECPBFlowchart() {
  const [nodes, setNodes] = useState(() => NODES.map(n => ({ ...n, status: "todo" })));
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("details");
  const [pan, setPan] = useState({ x: 140, y: 20 });
  const [zoom, setZoom] = useState(0.42);
  const [session, setSession] = useState({ active: false, start: null });
  const [timers, setTimers] = useState({});
  const [notes, setNotes] = useState({});
  const [sessLog, setSessLog] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [aiMsgs, setAiMsgs] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [clState, setClState] = useState({});
  const [bypassModal, setBypassModal] = useState(null);
  const [bypassReason, setBypassReason] = useState("");
  const [dsModal, setDsModal] = useState(null);
  const [pendingChg, setPendingChg] = useState(null);
  const [arrangeMode, setArrangeMode] = useState(false);
  const [dragRef, setDragRef] = useState(null);
  const [now, setNow] = useState(Date.now());
  const svgRef = useRef(null);
  const didDrag = useRef(false);
  const inited = useRef(false);
  const aiEndRef = useRef(null);

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  useEffect(() => { aiEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [aiMsgs.length]);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("ecpb-v1");
        if (r?.value) {
          const d = JSON.parse(r.value);
          if (d.nodes) setNodes(d.nodes);
          if (d.notes) setNotes(d.notes);
          if (d.session) setSession(d.session);
          if (d.timers) setTimers(d.timers);
          if (d.sessLog) setSessLog(d.sessLog);
          if (d.clState) setClState(d.clState);
        }
      } catch {}
      inited.current = true;
    })();
  }, []);

  useEffect(() => {
    if (!inited.current) return;
    const t = setTimeout(async () => {
      try { await window.storage.set("ecpb-v1", JSON.stringify({ nodes, notes, session, timers, sessLog, clState })); }
      catch {}
    }, 600);
    return () => clearTimeout(t);
  }, [nodes, notes, session, timers, sessLog, clState]);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const handler = e => { e.preventDefault(); setZoom(z => Math.min(2.5, Math.max(0.18, z * (e.deltaY > 0 ? 0.9 : 1.11)))); };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const nm = Object.fromEntries(nodes.map(n => [n.id, n]));
  const sel = selected ? nm[selected] : null;
  const doneCnt = nodes.filter(n => n.status === "done").length;
  const progress = Math.round(doneCnt / nodes.length * 100);
  const sessElapsed = session.active && session.start ? now - session.start : 0;

  function addLog(msg) { setSessLog(p => [...p, { text: msg, ts: new Date().toLocaleTimeString() }]); }

  function overtime(node) {
    const t = timers[node.id];
    if (!t?.start) return false;
    return (t.end || now) - t.start > node.exp * 2 * 60000;
  }
  function nodeElapsed(id) {
    const t = timers[id];
    if (!t?.start) return null;
    return fmtMs((t.end || now) - t.start);
  }
  function getDown(id) {
    const vis = new Set(), q = [id];
    while (q.length) { const cur = q.shift(); EDGES.filter(e => e.from === cur).forEach(e => { if (!vis.has(e.to)) { vis.add(e.to); q.push(e.to); } }); }
    vis.delete(id); return [...vis];
  }
  function gateOK(node) {
    if (!node?.isGate || !node.checklistItems) return true;
    const st = clState[node.id] || {};
    return node.checklistItems.filter(i => i.critical).every(i => st[i.id] === "pass");
  }

  function applyStatus(id, status) {
    setNodes(p => p.map(n => n.id === id ? { ...n, status } : n));
    if (status === "active") { setTimers(p => ({ ...p, [id]: { start: Date.now(), end: null } })); addLog(`▶ ${nm[id]?.label}`); }
    if (status === "done") { setTimers(p => { const t = p[id]; return t && !t.end ? { ...p, [id]: { ...t, end: Date.now() } } : p; }); addLog(`✓ ${nm[id]?.label}`); }
    if (status === "blocked") addLog(`✗ BLOCKED: ${nm[id]?.label}`);
  }

  function handleStatus(id, newStatus) {
    const node = nm[id];
    if (!node) return;
    if (node.bypass && newStatus === "active") { setBypassModal({ nodeId: id }); return; }
    if (newStatus === "done") {
      const aff = getDown(id).filter(did => ["active", "done"].includes(nm[did]?.status));
      if (aff.length) { setDsModal({ nodeId: id, affected: aff }); return; }
    }
    applyStatus(id, newStatus);
  }

  function onSvgDown(e) {
    if (e.button !== 0) return;
    setDragRef({ type: "canvas", sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y });
  }
  function onNodeDown(e, id) {
    e.stopPropagation(); didDrag.current = false;
    if (arrangeMode) setDragRef({ type: "node", id, sx: e.clientX, sy: e.clientY, nx: nm[id].x, ny: nm[id].y });
  }
  function onMove(e) {
    if (!dragRef) return;
    const dx = e.clientX - dragRef.sx, dy = e.clientY - dragRef.sy;
    if (dragRef.type === "canvas") { setPan({ x: dragRef.px + dx, y: dragRef.py + dy }); }
    else { if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.current = true; setNodes(p => p.map(n => n.id === dragRef.id ? { ...n, x: dragRef.nx + dx / zoom, y: dragRef.ny + dy / zoom } : n)); }
  }
  function onUp() { setDragRef(null); }

  async function sendAI() {
    if (!aiInput.trim() || aiLoading) return;
    const msg = aiInput.trim(); setAiInput("");
    const msgs = [...aiMsgs, { role: "user", content: msg }];
    setAiMsgs(msgs); setAiLoading(true);
    const sys = AI_SYS + `\n\nCURRENT STEP: ${sel?.label || "None"} | Status: ${sel?.status || "N/A"} | Session: ${fmtMs(sessElapsed)}` +
      (editMode ? `\n\nFLOWCHART EDIT MODE — nodes: ${JSON.stringify(nodes.map(n => ({ id: n.id, label: n.label, type: n.type })))}\n\nOutput changes as: [FLOWCHART_CHANGE]{"action":"update_node_label"|"update_exp"|"add_node"|"remove_node","nodeId":"...","label":"...","type":"...","x":0,"y":0,"exp":0}[/FLOWCHART_CHANGE] with a plain-language summary before the block.` : "");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800, system: sys, messages: msgs }),
      });
      const d = await r.json();
      const text = (d.content || []).map(b => b.text || "").join("");
      setAiMsgs([...msgs, { role: "assistant", content: text }]);
      if (editMode) { const m = text.match(/\[FLOWCHART_CHANGE\]([\s\S]*?)\[\/FLOWCHART_CHANGE\]/); if (m) { try { setPendingChg({ summary: text.split("[FLOWCHART_CHANGE]")[0].trim(), change: JSON.parse(m[1]) }); } catch {} } }
    } catch (err) { setAiMsgs([...msgs, { role: "assistant", content: `Error: ${err.message}` }]); }
    setAiLoading(false);
  }

  function applyChg(change) {
    const { action } = change;
    if (action === "update_node_label") setNodes(p => p.map(n => n.id === change.nodeId ? { ...n, label: change.label } : n));
    else if (action === "update_exp") setNodes(p => p.map(n => n.id === change.nodeId ? { ...n, exp: change.exp } : n));
    else if (action === "add_node") setNodes(p => [...p, { id: change.nodeId || `n_${Date.now()}`, type: change.type || "process", label: change.label || "New Node", x: change.x || 400, y: change.y || 400, exp: change.exp || 30, status: "todo", details: { w: [], u: [], c: [], i: [] } }]);
    else if (action === "remove_node") setNodes(p => p.filter(n => n.id !== change.nodeId));
    addLog(`AI edit: ${action}`); setPendingChg(null);
  }

  function renderNode(node) {
    const [w, h] = dims(node.type);
    const isSel = selected === node.id;
    const ot = overtime(node);
    const fills = { todo: "#111827", active: "#1e0a4a", done: "#0a2818", blocked: "#2a0808" };
    const strokes = { todo: C.border, active: C.active, done: C.done, blocked: C.blocked };
    const fill = fills[node.status], stroke = isSel ? C.primary : (node.type === "escalation" ? C.esc : strokes[node.status]);
    const sw = isSel ? 2.5 : 1.5;

    const shape = node.type === "terminal" ? <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={fill} stroke={stroke} strokeWidth={sw} /> :
      node.type === "decision" ? <polygon points={`0,${-h / 2} ${w / 2},0 0,${h / 2} ${-w / 2},0`} fill={fill} stroke={stroke} strokeWidth={sw} /> :
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill={fill} stroke={stroke} strokeWidth={sw} />;

    const dotColor = { todo: C.todo, active: C.active, done: C.done, blocked: C.blocked }[node.status];
    const lines = splitText(node.label, node.type === "decision" ? 14 : 21);
    const lineH = 13;

    return (
      <g key={node.id} transform={`translate(${node.x},${node.y})`} data-node={node.id} style={{ cursor: arrangeMode ? "move" : "pointer" }}
        onMouseDown={e => onNodeDown(e, node.id)}
        onClick={() => { if (didDrag.current) return; setSelected(node.id === selected ? null : node.id); }}>
        {ot && <rect x={-w / 2 - 5} y={-h / 2 - 5} width={w + 10} height={h + 10} rx={node.type === "terminal" ? h / 2 + 5 : 9} fill="none" stroke={C.accent} strokeWidth={1.5} strokeDasharray="5,3" opacity={0.75} />}
        {shape}
        <circle cx={w / 2 - 8} cy={-h / 2 + 9} r={4} fill={dotColor} />
        {node.bypass && node.status !== "done" && <text x={-w / 2 + 5} y={h / 2 - 6} fontSize={8} fill={C.muted} fontFamily="system-ui">↷ skip</text>}
        {node.isGate && <text x={w / 2 - 16} y={h / 2 - 6} fontSize={8} fill={C.accent} fontFamily="system-ui">★</text>}
        {lines.map((l, i) => <text key={i} textAnchor="middle" dominantBaseline="middle" x={0} y={(i - (lines.length - 1) / 2) * lineH} fontSize={node.type === "decision" ? 10 : 11} fill={C.text} fontFamily="system-ui" fontWeight="500" style={{ pointerEvents: "none" }}>{l}</text>)}
        {node.type === "escalation" && node.status === "active" && (
          <g onClick={e => { e.stopPropagation(); applyStatus(node.id, "done"); addLog(`↩ Resolved: ${node.label}`); }} style={{ cursor: "pointer" }}>
            <rect x={-w / 2} y={h / 2 + 2} width={w} height={17} rx={4} fill={C.done} opacity={0.9} />
            <text textAnchor="middle" x={0} y={h / 2 + 14} fontSize={10} fill="#fff" fontFamily="system-ui">↩ Resolved</text>
          </g>
        )}
      </g>
    );
  }

  function renderEdge(edge) {
    const path = mkPath(edge, nm);
    if (!path) return null;
    const s = nm[edge.from], t = nm[edge.to];
    const lx = s && t ? (s.x + t.x) / 2 + (t.x > s.x ? 8 : 0) : 0;
    const ly = s && t ? (s.y + t.y) / 2 - 4 : 0;
    return (
      <g key={edge.id}>
        <path d={path} fill="none" stroke={C.border} strokeWidth={1.5} markerEnd="url(#arr)" />
        {edge.label && <text x={lx} y={ly} textAnchor="middle" fontSize={9} fill={C.sub} fontFamily="system-ui" style={{ pointerEvents: "none" }}>{edge.label}</text>}
      </g>
    );
  }

  const secs = [{ k: "w", label: "Pre-flight", icon: "→" }, { k: "u", label: "During", icon: "⚙" }, { k: "c", label: "Completion criteria", icon: "✓" }, { k: "i", label: "Org info", icon: "ℹ" }];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui", overflow: "hidden", userSelect: "none" }}>
      {/* Top bar */}
      <div style={{ height: 46, background: C.primary, display: "flex", alignItems: "center", padding: "0 14px", gap: 10, flexShrink: 0, boxShadow: "0 1px 12px rgba(0,0,0,0.4)" }}>
        <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.1em", color: "rgba(255,255,255,0.9)", background: "rgba(0,0,0,0.2)", borderRadius: 4, padding: "2px 7px", flexShrink: 0 }}>ECPB</span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", flexShrink: 0 }}>Deployment Flowchart · Phase 11/12</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
          <div style={{ width: 72, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 2 }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "#4ade80", borderRadius: 2, transition: "width 0.4s" }} />
          </div>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{progress}%</span>
        </div>
        <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 4, padding: "3px 8px", fontSize: 11, display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: session.active ? "#4ade80" : "#475569", display: "inline-block" }} />
          {session.active ? fmtMs(sessElapsed) : "Idle"}
        </div>
        <button onClick={() => { const ns = session.active ? { active: false, start: null } : { active: true, start: Date.now() }; setSession(ns); addLog(ns.active ? "Session started" : "Session paused"); }} style={{ background: session.active ? "#b91c1c" : "#15803d", border: "none", borderRadius: 4, padding: "3px 10px", color: "#fff", fontSize: 11, cursor: "pointer", flexShrink: 0 }}>{session.active ? "Pause" : "Start"}</button>
        <button onClick={() => setArrangeMode(!arrangeMode)} style={{ background: arrangeMode ? C.accent : "rgba(255,255,255,0.12)", border: "none", borderRadius: 4, padding: "3px 10px", color: "#fff", fontSize: 11, cursor: "pointer", flexShrink: 0 }}>{arrangeMode ? "✎ Arrange" : "Arrange"}</button>
        <button onClick={() => { const done = nodes.filter(n => n.status === "done").sort((a, b) => (timers[a.id]?.end || 0) - (timers[b.id]?.end || 0)); navigator.clipboard.writeText(done.map(n => `[✓] ${n.label}`).join("\n")).catch(() => {}); }} style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 4, padding: "3px 10px", color: "#fff", fontSize: 11, cursor: "pointer", flexShrink: 0 }}>Copy</button>
      </div>

      {/* Canvas + panel */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}>
        {/* SVG canvas */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <svg ref={svgRef} style={{ width: "100%", height: "100%", cursor: dragRef?.type === "canvas" ? "grabbing" : "grab" }} onMouseDown={onSvgDown}>
            <defs>
              <marker id="arr" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
                <polygon points="0,0 8,3 0,6" fill={C.border} />
              </marker>
              <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="0.7" fill={C.border} opacity={0.6} />
              </pattern>
            </defs>
            <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
              <rect x={-1500} y={-500} width={5000} height={6000} fill="url(#dots)" />
              {EDGES.map(renderEdge)}
              {nodes.map(renderNode)}
            </g>
          </svg>
          {/* Zoom controls */}
          <div style={{ position: "absolute", bottom: 14, left: 14, display: "flex", flexDirection: "column", gap: 4 }}>
            {[["+", 1.15], ["-", 0.87], ["⊙", null]].map(([lbl, d]) => (
              <button key={lbl} onClick={() => d === null ? (setZoom(0.42), setPan({ x: 140, y: 20 })) : setZoom(z => Math.min(2.5, Math.max(0.18, z * d)))} style={{ width: 30, height: 30, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: lbl === "⊙" ? 13 : 17, cursor: "pointer", lineHeight: 1 }}>{lbl}</button>
            ))}
          </div>
          {/* Legend */}
          <div style={{ position: "absolute", top: 12, right: sel ? 348 : 12, background: "rgba(8,14,26,0.9)", borderRadius: 8, padding: "8px 10px", border: `1px solid ${C.border}`, fontSize: 10 }}>
            {[["done", "Done"], ["active", "Active"], ["blocked", "Blocked"], ["todo", "To do"]].map(([s, l]) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4, color: C.sub }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: C[s], display: "inline-block" }} />{l}
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 4, paddingTop: 4, display: "flex", alignItems: "center", gap: 5, color: C.sub }}>
              <span style={{ width: 7, height: 7, border: `1px dashed ${C.accent}`, display: "inline-block" }} />Overtime
            </div>
          </div>
        </div>

        {/* Right panel */}
        {sel ? (
          <div style={{ width: 338, background: C.panel, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
            {/* Node header */}
            <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{sel.label}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sel.type} · {sel.exp}m est{nodeElapsed(sel.id) ? ` · ${nodeElapsed(sel.id)} elapsed` : ""}{sel.bypass ? " · bypassable" : ""}{sel.isGate ? " · SOC 2 gate" : ""}</div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 15, padding: 0, lineHeight: 1 }}>✕</button>
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 10, flexWrap: "wrap" }}>
                {["todo", "active", "done", "blocked"].map(s => (
                  <button key={s} onClick={() => { if (s === "done" && sel.isGate && !gateOK(sel)) return; handleStatus(sel.id, s); }} style={{ padding: "3px 9px", borderRadius: 4, fontSize: 11, cursor: "pointer", border: `1px solid ${sel.status === s ? C[s] : C.border}`, background: sel.status === s ? C[s] + "22" : "transparent", color: sel.status === s ? C[s] : C.muted, opacity: s === "done" && sel.isGate && !gateOK(sel) ? 0.35 : 1 }}>{s}</button>
                ))}
              </div>
            </div>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
              {["details", "ai", "notes", "progress"].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "8px 2px", background: "none", border: "none", borderBottom: `2px solid ${tab === t ? C.primary : "transparent"}`, color: tab === t ? C.text : C.muted, fontSize: 11, cursor: "pointer", fontFamily: "system-ui", textTransform: "capitalize" }}>{t}</button>
              ))}
            </div>
            {/* Tab content */}
            <div style={{ flex: 1, overflow: tab === "ai" ? "hidden" : "auto", padding: tab === "ai" ? 0 : "12px 14px" }}>
              {/* DETAILS */}
              {tab === "details" && (
                <div>
                  {secs.map(sec => (sel.details?.[sec.k] || []).length > 0 && (
                    <div key={sec.k} style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.sub, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>{sec.icon} {sec.label}</div>
                      {(sel.details[sec.k] || []).map((item, i) => <div key={i} style={{ fontSize: 12, color: "#c8d8ec", lineHeight: 1.55, marginBottom: 4, paddingLeft: 8, borderLeft: `2px solid ${C.border}` }}>{item}</div>)}
                    </div>
                  ))}
                  {sel.checklistItems && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.sub, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
                        ☑ Checklist {sel.isGate && !gateOK(sel) && <span style={{ color: C.accent, marginLeft: 5, fontWeight: 400, textTransform: "none" }}>gate locked</span>}
                      </div>
                      {sel.checklistItems.map(item => {
                        const val = (clState[sel.id] || {})[item.id] || "pending";
                        return (
                          <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 7, padding: "6px 8px", background: "#080e1a", borderRadius: 5 }}>
                            <span style={{ fontSize: 11, color: item.critical ? C.accent : C.muted, marginTop: 1, minWidth: 11, flexShrink: 0 }}>{item.critical ? "★" : "○"}</span>
                            <span style={{ flex: 1, fontSize: 11, color: "#c8d8ec", lineHeight: 1.4 }}>{item.label}</span>
                            <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                              {["pass", "fail", "skip"].map(v => (
                                <button key={v} onClick={() => setClState(p => ({ ...p, [sel.id]: { ...(p[sel.id] || {}), [item.id]: val === v ? "pending" : v } }))} style={{ padding: "2px 6px", borderRadius: 3, fontSize: 10, cursor: "pointer", border: "none", background: val === v ? (v === "pass" ? C.done : v === "fail" ? C.blocked : "#374151") : "#1a2840", color: val === v ? "#fff" : C.muted }}>
                                  {v === "pass" ? "✓" : v === "fail" ? "✗" : "↷"}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      {sel.isGate && (
                        <div style={{ padding: "8px 10px", borderRadius: 5, textAlign: "center", fontSize: 12, marginTop: 4, background: gateOK(sel) ? "#0a2818" : "#2a0808", color: gateOK(sel) ? "#4ade80" : "#fca5a5", border: `1px solid ${gateOK(sel) ? C.done : C.blocked}` }}>
                          {gateOK(sel) ? "✓ SOC 2 gate cleared — ready to proceed" : "⚠ Gate locked — all ★ items must pass"}
                        </div>
                      )}
                      {sel.isGate && gateOK(sel) && (
                        <button onClick={() => applyStatus(sel.id, "done")} style={{ width: "100%", marginTop: 8, padding: "9px", background: C.done, border: "none", borderRadius: 5, color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 700 }}>Mark Done ✓</button>
                      )}
                    </div>
                  )}
                </div>
              )}
              {/* AI */}
              {tab === "ai" && (
                <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "10px 14px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: C.muted }}>AI Help · {sel.label}</span>
                    <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: editMode ? C.accent : C.muted, cursor: "pointer" }}>
                      <input type="checkbox" checked={editMode} onChange={e => setEditMode(e.target.checked)} style={{ accentColor: C.accent }} />Edit mode
                    </label>
                  </div>
                  {editMode && <div style={{ padding: "5px 8px", background: "#1c1208", border: `1px solid ${C.accent}44`, borderRadius: 5, fontSize: 11, color: C.accent, marginBottom: 8, flexShrink: 0 }}>✎ AI can propose flowchart changes</div>}
                  <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 7 }}>
                    {aiMsgs.length === 0 && <div style={{ color: C.muted, fontSize: 12, textAlign: "center", marginTop: 28, lineHeight: 1.6 }}>Ask about this step or request deployment guidance.</div>}
                    {aiMsgs.map((m, i) => (
                      <div key={i} style={{ padding: "8px 10px", borderRadius: 7, fontSize: 12, lineHeight: 1.5, maxWidth: "93%", whiteSpace: "pre-wrap", background: m.role === "user" ? "#1a3060" : "#111827", color: m.role === "user" ? "#bfdbfe" : "#d4e0f0", alignSelf: m.role === "user" ? "flex-end" : "flex-start", borderLeft: m.role === "assistant" ? `2px solid ${C.primary}` : "none" }}>{m.content}</div>
                    ))}
                    {aiLoading && <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic", padding: "4px 0" }}>Thinking…</div>}
                    <div ref={aiEndRef} />
                  </div>
                  <div style={{ display: "flex", gap: 6, paddingTop: 8, flexShrink: 0 }}>
                    <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendAI()} placeholder="Ask about this step…" style={{ flex: 1, background: "#080e1a", border: `1px solid ${C.border}`, borderRadius: 5, padding: "6px 9px", color: C.text, fontSize: 12, outline: "none" }} />
                    <button onClick={sendAI} disabled={aiLoading || !aiInput.trim()} style={{ background: aiLoading ? C.surface : C.primary, border: "none", borderRadius: 5, padding: "6px 12px", color: "#fff", fontSize: 13, cursor: "pointer" }}>→</button>
                  </div>
                </div>
              )}
              {/* NOTES */}
              {tab === "notes" && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.sub, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Node notes</div>
                  {(notes[sel.id] || []).length === 0 && <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>No notes for this step.</div>}
                  {(notes[sel.id] || []).map((n, i) => (
                    <div key={i} style={{ padding: "6px 8px", background: "#080e1a", borderRadius: 5, marginBottom: 6 }}>
                      <div style={{ fontSize: 12, color: "#c8d8ec", lineHeight: 1.5 }}>{n.text}</div>
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{n.ts}</div>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <input value={noteInput} onChange={e => setNoteInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && noteInput.trim()) { const note = { text: noteInput.trim(), ts: new Date().toLocaleTimeString() }; setNotes(p => ({ ...p, [sel.id]: [...(p[sel.id] || []), note] })); addLog(`Note: "${noteInput.slice(0, 40)}"`); setNoteInput(""); } }} placeholder="Add note…" style={{ flex: 1, background: "#080e1a", border: `1px solid ${C.border}`, borderRadius: 5, padding: "6px 8px", color: C.text, fontSize: 12, outline: "none" }} />
                    <button onClick={() => { if (!noteInput.trim()) return; const note = { text: noteInput.trim(), ts: new Date().toLocaleTimeString() }; setNotes(p => ({ ...p, [sel.id]: [...(p[sel.id] || []), note] })); addLog(`Note: "${noteInput.slice(0, 40)}"`); setNoteInput(""); }} style={{ background: C.primary, border: "none", borderRadius: 5, padding: "6px 10px", color: "#fff", fontSize: 12, cursor: "pointer" }}>+</button>
                  </div>
                  {sessLog.length > 0 && (
                    <div style={{ marginTop: 18 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.sub, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Session log</div>
                      {[...sessLog].reverse().slice(0, 30).map((e, i) => (
                        <div key={i} style={{ fontSize: 11, color: C.muted, marginBottom: 3, lineHeight: 1.4 }}>
                          <span style={{ color: "#344455", marginRight: 4 }}>{e.ts}</span>{e.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {/* PROGRESS */}
              {tab === "progress" && (
                <div>
                  {(() => { const by = { todo: 0, active: 0, done: 0, blocked: 0 }; nodes.forEach(n => by[n.status]++); return (
                    <>
                      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                        {Object.entries(by).map(([s, c]) => (
                          <div key={s} style={{ flex: 1, minWidth: 56, padding: "8px 4px", background: "#080e1a", borderRadius: 5, textAlign: "center", border: `1px solid ${C[s]}33` }}>
                            <div style={{ fontSize: 20, fontWeight: 700, color: C[s], lineHeight: 1 }}>{c}</div>
                            <div style={{ fontSize: 10, color: C.muted, marginTop: 2, textTransform: "capitalize" }}>{s}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ height: 5, background: "#080e1a", borderRadius: 3, overflow: "hidden", display: "flex", marginBottom: 14 }}>
                        {Object.entries(by).map(([s, c]) => c > 0 && <div key={s} style={{ flex: c, background: C[s], transition: "flex 0.4s" }} />)}
                      </div>
                    </>
                  ); })()}
                  {nodes.map(n => (
                    <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 8px", background: "#080e1a", borderRadius: 4, marginBottom: 3, borderLeft: `3px solid ${C[n.status]}`, cursor: "pointer" }} onClick={() => { setSelected(n.id); setTab("details"); }}>
                      <div style={{ flex: 1, fontSize: 11, color: "#c8d8ec", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.label}</div>
                      {nodeElapsed(n.id) && <div style={{ fontSize: 10, color: C.muted, flexShrink: 0 }}>{nodeElapsed(n.id)}</div>}
                      <div style={{ fontSize: 10, color: C[n.status], textTransform: "capitalize", flexShrink: 0 }}>{n.status}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ width: 188, background: C.panel, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: C.muted, fontSize: 12, flexShrink: 0 }}>
            <div style={{ fontSize: 26, opacity: 0.25 }}>◈</div>
            <div style={{ fontWeight: 600, fontSize: 12 }}>Select a node</div>
            <div style={{ fontSize: 11, textAlign: "center", padding: "0 18px", lineHeight: 1.6, opacity: 0.6 }}>Click any step for details, AI help, notes, or status updates.</div>
          </div>
        )}
      </div>

      {/* Bypass modal */}
      {bypassModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setBypassModal(null)}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, width: 360 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Skip ↷ "{nm[bypassModal.nodeId]?.label}"</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>{nm[bypassModal.nodeId]?.bypassReason}</div>
            <textarea value={bypassReason} onChange={e => setBypassReason(e.target.value)} placeholder="Reason for skipping (required)…" style={{ width: "100%", height: 76, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 5, padding: 8, color: C.text, fontSize: 12, resize: "vertical", boxSizing: "border-box", outline: "none" }} />
            <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
              <button onClick={() => { setBypassModal(null); setBypassReason(""); }} style={{ padding: "6px 14px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 12, cursor: "pointer" }}>Cancel</button>
              <button disabled={!bypassReason.trim()} onClick={() => { addLog(`Skip: "${nm[bypassModal.nodeId]?.label}" — ${bypassReason}`); applyStatus(bypassModal.nodeId, "done"); setBypassModal(null); setBypassReason(""); }} style={{ padding: "6px 14px", background: bypassReason.trim() ? C.accent : "#374151", border: "none", borderRadius: 5, color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Confirm Skip</button>
            </div>
          </div>
        </div>
      )}

      {/* Downstream modal */}
      {dsModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setDsModal(null)}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, width: 380 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.accent, marginBottom: 8 }}>⚠ Downstream alert</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>Completing "{nm[dsModal.nodeId]?.label}" affects these steps:</div>
            {dsModal.affected.map(id => (
              <div key={id} style={{ fontSize: 12, color: C.text, marginBottom: 4, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ color: C[nm[id]?.status] || C.todo, fontSize: 9 }}>●</span>
                {nm[id]?.label} <span style={{ color: C[nm[id]?.status] || C.todo, marginLeft: 2 }}>({nm[id]?.status})</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
              <button onClick={() => setDsModal(null)} style={{ padding: "6px 14px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 12, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => { applyStatus(dsModal.nodeId, "done"); setDsModal(null); }} style={{ padding: "6px 14px", background: C.blocked, border: "none", borderRadius: 5, color: "#fff", fontSize: 12, cursor: "pointer" }}>Proceed anyway</button>
            </div>
          </div>
        </div>
      )}

      {/* AI change modal */}
      {pendingChg && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setPendingChg(null)}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, width: 400, maxWidth: "92vw" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>AI flowchart change</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>{pendingChg.summary}</div>
            <pre style={{ background: C.bg, borderRadius: 5, padding: 10, fontSize: 11, color: C.text, overflow: "auto", maxHeight: 130, margin: "0 0 14px", lineHeight: 1.4 }}>{JSON.stringify(pendingChg.change, null, 2)}</pre>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setPendingChg(null)} style={{ padding: "6px 14px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 12, cursor: "pointer" }}>Dismiss</button>
              <button onClick={() => applyChg(pendingChg.change)} style={{ padding: "6px 14px", background: C.primary, border: "none", borderRadius: 5, color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
