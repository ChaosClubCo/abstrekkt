import { useState, useEffect, useRef, useCallback } from "react";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const P = "#7c3aed";
const A = "#f59e0b";
const C_DONE = "#15803d";
const C_ACTIVE = "#7c3aed";
const C_BLOCKED = "#dc2626";
const C_ESC = "#ea580c";
const C_TODO = "#475569";
const BG = "#0c0918";
const SURF = "#130e20";
const BORDER = "#241b47";
const STORAGE_KEY = "fusion-ai-orchestrator-v1";

const AI_SYS = `You are an ops assistant embedded in the Fusion AI Orchestrator. Operator is mid-task — be concise. Exhaust local fixes before escalating. Lead with most likely cause.

ENVIRONMENT
- Base44 App ID: 68dd8e79ca073475565c8e16 | 101 entities | SOC2-hardened (tenant isolation, RLS, AuditEvent, TokenBudget, WebhookBridge, FeatureFlag)
- n8n: krosebrook.app.n8n.cloud | 11 workflows BLOCKED (need Base44 Bearer creds + SCH-02 lane field)
- Blocked WIR IDs: rCVu2glYrnROgipT, xHJO7htByEd07ZGp, vTzMuNpichJO871n, QPf2SqTRVEOKyeQV
- 4 orphan WIR-01 dupes exist — delete before activating any of the above
- 7 OAI workflows also blocked
- Bearer token: Base44 → Settings → Integrations → API → Bearer Token
- n8n creds path: n8n → Settings → Credentials → Base44 HTTP Header Auth

COMMON FAILURES (ranked by likelihood)
1. Bearer token missing/expired in n8n credential store
2. SCH-02 lane field null on AgentTask (task.lane not set)
3. Orphan WIR-01 dupe activated instead of correct workflow
4. TokenBudget.max_tokens exceeded — usually a looping agent
5. WebhookBridge.target_url stale after workflow ID change
6. FeatureFlag disabled for agent type
7. tenant_id missing on Base44 write — causes silent 422

ESCALATION
- Base44 platform issues → Base44 support
- n8n cloud issues → n8n cloud admin (krosebrook.app.n8n.cloud)
- Schema/entity issues → self (log + defer, do not block)

When AI EDIT MODE is active you may emit [FLOWCHART_CHANGE]{...}[/FLOWCHART_CHANGE] blocks.
Actions: add_node, remove_node, update_node_label, update_node_detail, update_exp, add_edge, remove_edge.
Include a top-level "summary" string describing the change in plain English.
add_node must include a "removeEdge" field with the id of the edge being split.`;

// ── NODE & EDGE DATA ──────────────────────────────────────────────────────────
const MX = 430;
const EX = 700;

const NODES0 = [
  { id: "start", type: "terminal", label: "Session Start", x: MX, y: 70, exp: 1,
    detail: { w: ["Open Base44 app 68dd8e79ca073475565c8e16", "Confirm n8n reachable: krosebrook.app.n8n.cloud", "Verify Bearer token available in API Settings"], u: ["Record session context", "Confirm active tenant ID"], c: ["All systems reachable", "Credentials confirmed"], i: ["Base44 App ID: 68dd8e79ca073475565c8e16", "n8n: krosebrook.app.n8n.cloud", "101 entities in schema"] } },
  { id: "trigger", type: "process", label: "Inbound Trigger", x: MX, y: 185, exp: 2,
    detail: { w: ["Confirm webhook URL is correct", "Check Bearer token present in request headers", "Verify payload structure matches schema"], u: ["Monitor Base44 incoming event log", "Check n8n webhook node for receipt confirmation"], c: ["HTTP 200 returned", "Trigger ID logged in AuditEvent"], i: ["Webhook base: krosebrook.app.n8n.cloud", "Auth header: Bearer <token from Base44 → Settings → Integrations>"] } },
  { id: "auth_check", type: "decision", label: "Auth Valid?", x: MX, y: 300, exp: 1,
    detail: { w: ["Check Bearer token format and expiry", "Inspect auth middleware response code"], u: ["Test token against Base44 API directly", "Check n8n credential store for stale entry"], c: ["Auth passes — 200 returned", "Proceed to routing"], i: ["Token location: Base44 → Settings → API → Integrations"] } },
  { id: "auth_fail", type: "escalation", label: "Auth Failure", x: EX, y: 300, exp: 2, originNode: "auth_check",
    detail: { w: ["Locate token: Base44 → Settings → Integrations", "Check n8n credential store for stale token"], u: ["Log 401 to AuditEvent", "Rotate token if expired"], c: ["New token issued", "Re-auth returns 200"], i: ["Token rotation does not require app restart", "n8n creds path: Settings → Credentials → Base44 HTTP Header Auth"] } },
  { id: "route_check", type: "decision", label: "Route Identified?", x: MX, y: 420, exp: 2,
    detail: { w: ["Check AgentConfig entity for matching route key", "Verify SCH-02 lane field not null on task"], u: ["Inspect AgentTask.lane field value", "Cross-ref ScheduleConfig entity list"], c: ["Route key resolved", "Matched to active AgentConfig record"], i: ["SCH-02: task.lane must not be null", "AgentConfig entity in Base44"] } },
  { id: "route_fail", type: "escalation", label: "Route Not Found", x: EX, y: 420, exp: 3, originNode: "route_check",
    detail: { w: ["Inspect AgentConfig entity list in Base44", "Confirm SCH-02 lane field is populated on task"], u: ["Set task.lane via Base44 entity editor", "Re-queue task after lane assignment"], c: ["Route resolved", "AgentTask re-queued with correct lane"], i: ["Blocked WIR IDs (need Bearer + SCH-02 before activation):", "rCVu2glYrnROgipT, xHJO7htByEd07ZGp", "vTzMuNpichJO871n, QPf2SqTRVEOKyeQV"] } },
  { id: "sch02", type: "process", label: "SCH-02 Lane Assignment", x: MX, y: 540, exp: 2,
    detail: { w: ["Confirm task.lane is populated", "Verify lane matches an active ScheduleConfig record"], u: ["Set lane field on AgentTask entity via Base44 API", "Check for WIR-01 orphan dupes (4 known)"], c: ["task.lane set and validated", "No orphan dupe detected"], i: ["Orphan WIR-01 IDs to delete before activating:", "rCVu2glYrnROgipT, xHJO7htByEd07ZGp", "vTzMuNpichJO871n, QPf2SqTRVEOKyeQV"] } },
  { id: "token_check", type: "decision", label: "Token Budget OK?", x: MX, y: 660, exp: 1,
    detail: { w: ["Check TokenBudget entity: used_tokens vs max_tokens", "Confirm tenant_id matches current context"], u: ["Query TokenBudget record in Base44", "Soft warn at 80% usage, hard stop at 100%"], c: ["used_tokens < max_tokens", "Budget check passes — proceed"], i: ["Base44 → TokenBudget entity", "Fields: used_tokens, max_tokens, tenant_id"] } },
  { id: "token_exceed", type: "escalation", label: "Budget Exceeded", x: EX, y: 660, exp: 3, originNode: "token_check",
    detail: { w: ["Identify runaway agent or retry loop", "Check TokenBudget.used_tokens spike pattern"], u: ["Pause agent dispatch immediately", "Reset/reallocate TokenBudget in Base44 entity editor"], c: ["Budget reset or max_tokens increased", "Task cleared to proceed"], i: ["Root cause: usually looping agent or misconfigured retry", "Edit: Base44 → TokenBudget → select record → edit max_tokens"] } },
  { id: "dispatch", type: "process", label: "Agent Dispatch", x: MX, y: 780, exp: 3,
    detail: { w: ["Confirm AgentConfig.is_active = true", "Verify FeatureFlag enabled for this agent type"], u: ["POST task payload to agent endpoint", "Monitor AgentTask.status field in Base44"], c: ["AgentTask.status = 'running'", "dispatched_at timestamp logged on record"], i: ["AgentTask fields: status, agent_id, lane, dispatched_at, tenant_id", "FeatureFlag entity controls per-agent feature gates"] } },
  { id: "webhook_bridge", type: "process", label: "WebhookBridge Emit", x: MX, y: 900, exp: 2,
    detail: { w: ["Verify WebhookBridge.target_url is current", "Confirm target n8n workflow is active (not paused)"], u: ["Emit event via WebhookBridge entity", "Check n8n execution log for receipt within 5s"], c: ["n8n execution triggered — visible in Executions tab", "WebhookBridge.last_emit_at updated"], i: ["WebhookBridge fields: target_url, event_type, tenant_id, last_emit_at", "WARNING: 11 n8n workflows currently blocked — need Bearer creds + SCH-02"] } },
  { id: "n8n_exec", type: "process", label: "n8n Workflow Execute", x: MX, y: 1020, exp: 5, bypass: true, bypassOwner: "n8n cloud — 11 workflows blocked pending Bearer creds + SCH-02 lane field",
    detail: { w: ["Confirm target workflow is active in n8n cloud", "Verify Base44 Bearer creds in n8n credential store", "Confirm SCH-02 lane field present in webhook payload"], u: ["Monitor execution in n8n Executions tab", "Check for OAI workflow conflicts (7 known inactive)"], c: ["Execution status: success", "Output payload returned to WebhookBridge callback"], i: ["n8n: krosebrook.app.n8n.cloud", "Blocked WIRs: rCVu2glYrnROgipT, xHJO7htByEd07ZGp, vTzMuNpichJO871n, QPf2SqTRVEOKyeQV", "7 OAI workflows also blocked", "Creds: n8n → Settings → Credentials → Base44 HTTP Header Auth"] } },
  { id: "b44_write", type: "process", label: "Base44 Write", x: MX, y: 1140, exp: 3,
    detail: { w: ["Confirm entity schema matches outgoing payload", "Verify tenant_id present in all records"], u: ["POST result to target Base44 entity", "Verify field mapping against 101-entity schema"], c: ["Record created/updated — no 422 errors", "tenant_id present and RLS-validated"], i: ["Base44 App: 68dd8e79ca073475565c8e16", "101 entities", "SOC2: tenant_id required on every write — RLS enforced"] } },
  { id: "audit_log", type: "process", label: "AuditEvent Log", x: MX, y: 1260, exp: 1,
    detail: { w: ["Confirm AuditEvent entity is configured in Base44", "Verify event_type and actor fields are populated"], u: ["Write AuditEvent record to Base44", "Fields: event_type, actor, tenant_id, timestamp, payload_hash, resource_id"], c: ["AuditEvent record created", "Visible in Base44 audit trail"], i: ["AuditEvent required for SOC2 compliance trail", "resource_id must link back to the AgentTask.id"] } },
  { id: "status_return", type: "process", label: "Status Return", x: MX, y: 1380, exp: 1,
    detail: { w: ["Prepare success/failure response payload", "Include task ID and execution duration ms"], u: ["Return status to original caller", "Update AgentTask.status to completed or failed"], c: ["HTTP response sent with task ID", "AgentTask.status updated from 'running'"], i: ["Success: AgentTask.status = 'completed'", "Failure: AgentTask.status = 'failed', error field populated", "Include execution_ms in response for observability"] } },
  { id: "qc_gate", type: "process", label: "QC / Handoff Gate", x: MX, y: 1500, exp: 5, isQC: true,
    qcItems: [
      { id: "qc1", label: "AuditEvent record present and complete", critical: true },
      { id: "qc2", label: "AgentTask.status = 'completed'", critical: true },
      { id: "qc3", label: "TokenBudget within limits (used < max)", critical: true },
      { id: "qc4", label: "No orphan WIR-01 dupes created this session", critical: true },
      { id: "qc5", label: "tenant_id present on all written records", critical: true },
      { id: "qc6", label: "WebhookBridge.last_emit_at updated this session", critical: false },
      { id: "qc7", label: "n8n execution success (or bypassed with logged reason)", critical: false },
    ],
    detail: { w: [], u: [], c: ["All ★ critical items passing", "Ready to hand off"], i: [] } },
  { id: "end", type: "terminal", label: "Task Complete", x: MX, y: 1620, exp: 0,
    detail: { w: [], u: [], c: ["All QC items passed", "Session closed and fully logged"], i: [] } },
];

const EDGES0 = [
  { id: "e1", from: "start", to: "trigger" },
  { id: "e2", from: "trigger", to: "auth_check" },
  { id: "e3", from: "auth_check", to: "route_check", label: "Yes" },
  { id: "e4", from: "auth_check", to: "auth_fail", label: "No" },
  { id: "e5", from: "auth_fail", to: "auth_check", resolved: true },
  { id: "e6", from: "route_check", to: "sch02", label: "Yes" },
  { id: "e7", from: "route_check", to: "route_fail", label: "No" },
  { id: "e8", from: "route_fail", to: "route_check", resolved: true },
  { id: "e9", from: "sch02", to: "token_check" },
  { id: "e10", from: "token_check", to: "dispatch", label: "Yes" },
  { id: "e11", from: "token_check", to: "token_exceed", label: "No" },
  { id: "e12", from: "token_exceed", to: "token_check", resolved: true },
  { id: "e13", from: "dispatch", to: "webhook_bridge" },
  { id: "e14", from: "webhook_bridge", to: "n8n_exec" },
  { id: "e15", from: "n8n_exec", to: "b44_write" },
  { id: "e16", from: "b44_write", to: "audit_log" },
  { id: "e17", from: "audit_log", to: "status_return" },
  { id: "e18", from: "status_return", to: "qc_gate" },
  { id: "e19", from: "qc_gate", to: "end" },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function dims(type) {
  if (type === "terminal") return { w: 130, h: 42, rx: 21 };
  if (type === "decision") return { w: 140, h: 68, rx: 0 };
  return { w: 172, h: 44, rx: 6 };
}

function borderPt(n, tx, ty) {
  const { w, h } = dims(n.type);
  const dx = tx - n.x, dy = ty - n.y;
  if (!dx && !dy) return { x: n.x, y: n.y };
  if (n.type === "decision") {
    const hw = w / 2, hh = h / 2;
    const s = Math.abs(dx) * hh > Math.abs(dy) * hw
      ? hw / Math.abs(dx) : hh / Math.abs(dy);
    return { x: n.x + dx * s, y: n.y + dy * s };
  }
  const hw = w / 2, hh = h / 2;
  const s = Math.min(hw / Math.abs(dx || 0.001), hh / Math.abs(dy || 0.001));
  return { x: n.x + dx * s, y: n.y + dy * s };
}

function sColor(st) {
  return { done: C_DONE, active: C_ACTIVE, blocked: C_BLOCKED, todo: C_TODO, skip: "#475569" }[st] || C_TODO;
}

function fmt(ms) {
  const s = Math.floor(ms / 1000), m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

// ── SVG EDGE ──────────────────────────────────────────────────────────────────
function Edge({ edge, nodes }) {
  const f = nodes.find(n => n.id === edge.from);
  const t = nodes.find(n => n.id === edge.to);
  if (!f || !t) return null;
  const fp = borderPt(f, t.x, t.y);
  const tp = borderPt(t, f.x, f.y);
  const isDiag = Math.abs(t.x - f.x) > 30;
  const ang = Math.atan2(tp.y - fp.y, tp.x - fp.x);
  const ar = 7, aa = 0.42;
  const ax1 = tp.x - ar * Math.cos(ang - aa), ay1 = tp.y - ar * Math.sin(ang - aa);
  const ax2 = tp.x - ar * Math.cos(ang + aa), ay2 = tp.y - ar * Math.sin(ang + aa);
  let d;
  if (isDiag && edge.resolved) {
    d = `M${fp.x},${fp.y} C${fp.x + 50},${fp.y + 20} ${tp.x + 50},${tp.y - 20} ${tp.x},${tp.y}`;
  } else if (isDiag) {
    d = `M${fp.x},${fp.y} C${fp.x},${fp.y + 50} ${tp.x},${tp.y - 50} ${tp.x},${tp.y}`;
  } else {
    d = `M${fp.x},${fp.y} L${tp.x},${tp.y}`;
  }
  const col = edge.resolved ? "#3a2a68" : "#3d2e70";
  const lx = (fp.x + tp.x) / 2 + (isDiag ? 10 : 8);
  const ly = (fp.y + tp.y) / 2 + (isDiag ? 0 : -4);
  return (
    <g>
      <path d={d} fill="none" stroke={col} strokeWidth={1.5} strokeDasharray={edge.resolved ? "5,4" : undefined} />
      <polygon points={`${tp.x},${tp.y} ${ax1},${ay1} ${ax2},${ay2}`} fill={col} />
      {edge.label && <text x={lx} y={ly} fontSize={10} fill="#4a3880" fontFamily="system-ui">{edge.label}</text>}
    </g>
  );
}

// ── SVG NODE ──────────────────────────────────────────────────────────────────
function NodeShape({ node, selected, overtime, status, onSelect, onDragStart, arrangeMode }) {
  const { x, y, type, label, id, bypass } = node;
  const { w, h, rx } = dims(type);
  const sc = sColor(status || "todo");
  const bord = selected ? "#a78bfa" : type === "escalation" ? C_ESC : (status === "todo" ? "#2e2258" : sc);
  const fill = selected
    ? "rgba(124,58,237,0.18)"
    : type === "escalation" ? "rgba(234,88,12,0.08)"
    : type === "decision" ? "rgba(245,158,11,0.07)"
    : "rgba(19,14,32,0.97)";
  const sw = selected ? 2.5 : 1.5;
  const fs = label.length > 20 ? 9.5 : label.length > 15 ? 10.5 : 11;

  function handleMD(e) {
    e.stopPropagation();
    if (arrangeMode) { onDragStart(e, id); return; }
    onSelect(id);
  }

  // word-wrap
  const words = label.split(" ");
  let lines = [], cur = "";
  for (const w2 of words) {
    if (cur && (cur + " " + w2).length > 19) { lines.push(cur); cur = w2; }
    else cur = cur ? cur + " " + w2 : w2;
  }
  if (cur) lines.push(cur);
  const lh = 13;
  const ty0 = y - (lines.length - 1) * lh / 2;

  let shape;
  if (type === "decision") {
    const pts = `${x},${y - h / 2} ${x + w / 2},${y} ${x},${y + h / 2} ${x - w / 2},${y}`;
    shape = <polygon points={pts} fill={fill} stroke={bord} strokeWidth={sw} />;
  } else {
    shape = <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={rx} fill={fill} stroke={bord} strokeWidth={sw} />;
  }

  return (
    <g style={{ cursor: arrangeMode ? "move" : "pointer" }} onMouseDown={handleMD} onClick={e => { e.stopPropagation(); if (!arrangeMode) onSelect(id); }}>
      {overtime && <rect x={x - w / 2 - 6} y={y - h / 2 - 6} width={w + 12} height={h + 12} rx={rx + 4} fill="none" stroke={A} strokeWidth={2} strokeDasharray="7,4" opacity={0.85} />}
      {shape}
      <circle cx={x + w / 2 - 9} cy={y - h / 2 + 9} r={4.5} fill={sc} />
      {lines.map((l, i) => (
        <text key={i} x={x} y={ty0 + i * lh} textAnchor="middle" dominantBaseline="middle" fontSize={fs} fontFamily="system-ui" fill="#ddd6fe" fontWeight={500} style={{ pointerEvents: "none", userSelect: "none" }}>{l}</text>
      ))}
      {bypass && <text x={x} y={y + h / 2 - 4} textAnchor="middle" fontSize={8} fill="#5b4a8e" style={{ pointerEvents: "none" }}>⤷ bypassable</text>}
      {type === "escalation" && status !== "done" && <text x={x} y={y + h / 2 + 13} textAnchor="middle" fontSize={9} fill={C_ESC} style={{ pointerEvents: "none" }}>↩ esc</text>}
    </g>
  );
}

// ── SECTION BLOCK ─────────────────────────────────────────────────────────────
function Sec({ title, items, mono }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontWeight: 700, color: P, fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 5 }}>{title}</div>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4, color: mono ? "#8878b8" : "#c4b5fd", fontSize: mono ? 10 : 11, fontFamily: mono ? "'Courier New',monospace" : "system-ui", lineHeight: 1.45 }}>
          <span style={{ color: "#2e2258", flexShrink: 0 }}>▸</span><span>{it}</span>
        </div>
      ))}
    </div>
  );
}

// ── DETAILS TAB ───────────────────────────────────────────────────────────────
function DetailsTab({ node, status, setStatus, qcStateMap, setQcState, onBypass, onResolve, bypassReason, elap }) {
  if (!node) return <div style={{ padding: 16, color: "#2e2258", fontSize: 12, fontFamily: "system-ui" }}>← Select a node</div>;
  const { detail, type, exp, isQC, qcItems, bypass, originNode, id } = node;
  const st = status || "todo";
  const isEsc = type === "escalation";
  const critOk = isQC ? (qcItems || []).filter(q => q.critical).every(q => (qcStateMap[id] || {})[q.id] === "pass") : true;
  const allOk = isQC ? (qcItems || []).every(q => ["pass", "skip"].includes((qcStateMap[id] || {})[q.id])) : true;

  const Sb = ({ s, label, col }) => (
    <button onClick={() => setStatus(id, s)} style={{ padding: "4px 10px", borderRadius: 4, border: "none", cursor: "pointer", background: st === s ? col : "#1a1332", color: st === s ? "#fff" : "#4a3880", fontSize: 10, fontWeight: 700, transition: "all .15s" }}>{label}</button>
  );

  return (
    <div style={{ padding: "12px 14px", fontFamily: "system-ui", fontSize: 12, color: "#c4b5fd", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
      <div style={{ display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap" }}>
        <Sb s="todo" label="Todo" col={C_TODO} />
        <Sb s="active" label="▶ Active" col={C_ACTIVE} />
        <Sb s="done" label="✓ Done" col={C_DONE} />
        <Sb s="blocked" label="✕ Blocked" col={C_BLOCKED} />
        {bypass && <button onClick={() => onBypass(id)} style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${A}33`, cursor: "pointer", background: "transparent", color: A, fontSize: 10, fontWeight: 700 }}>⤷ Skip</button>}
        {isEsc && <button onClick={() => onResolve(id, originNode)} style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${C_ESC}44`, cursor: "pointer", background: "transparent", color: C_ESC, fontSize: 10, fontWeight: 700 }}>↩ Resolved</button>}
      </div>

      {exp > 0 && elap !== undefined && (
        <div style={{ marginBottom: 10, padding: "6px 10px", borderRadius: 4, background: "#0d0919", border: `1px solid ${elap > exp * 60000 * 2 ? A + "44" : "#1e1635"}` }}>
          <span style={{ color: "#3a2a68", fontSize: 10 }}>Elapsed: </span>
          <span style={{ color: elap > exp * 60000 * 2 ? A : "#9d87d4", fontWeight: 700 }}>{fmt(elap)}</span>
          <span style={{ color: "#2e2258", fontSize: 10 }}> / {exp}m expected</span>
          {elap > exp * 60000 * 2 && <span style={{ color: A, fontSize: 10 }}> ⚠ overtime</span>}
        </div>
      )}

      {bypassReason && <div style={{ marginBottom: 8, padding: "6px 10px", borderRadius: 4, background: `${A}11`, border: `1px solid ${A}33`, fontSize: 11, color: A }}>⤷ Bypassed: {bypassReason}</div>}

      {isQC ? (
        <div>
          <div style={{ fontWeight: 700, color: "#ddd6fe", marginBottom: 8, fontSize: 12 }}>QC Checklist</div>
          {(qcItems || []).map(item => {
            const iv = (qcStateMap[id] || {})[item.id] || "";
            return (
              <div key={item.id} style={{ marginBottom: 7, padding: "8px 10px", borderRadius: 4, background: "#0d0919", border: `1px solid ${iv === "pass" ? C_DONE + "44" : iv === "fail" ? C_BLOCKED + "44" : "#1e1635"}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 5 }}>
                  <span style={{ color: item.critical ? A : "#3a2a68", fontSize: 11, marginTop: 1, flexShrink: 0 }}>{item.critical ? "★" : "○"}</span>
                  <span style={{ flex: 1, color: "#c4b5fd", fontSize: 11, lineHeight: 1.4 }}>{item.label}</span>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {["pass", "fail", "skip"].map(v => (
                    <button key={v} onClick={() => setQcState(id, item.id, v)} style={{ padding: "3px 9px", borderRadius: 3, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, background: iv === v ? (v === "pass" ? C_DONE : v === "fail" ? C_BLOCKED : "#475569") : "#1a1332", color: iv === v ? "#fff" : "#4a3880" }}>
                      {v === "pass" ? "✓ Pass" : v === "fail" ? "✕ Fail" : "↷ Skip"}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          {critOk && allOk && (
            <>
              <div style={{ marginTop: 12, padding: "10px", borderRadius: 6, background: `${C_DONE}22`, border: `1px solid ${C_DONE}55`, textAlign: "center", color: "#4ade80", fontWeight: 700, fontSize: 13 }}>✓ Ready to Hand Off</div>
              <button onClick={() => setStatus(id, "done")} style={{ marginTop: 8, width: "100%", padding: "9px", borderRadius: 5, border: "none", cursor: "pointer", background: C_DONE, color: "#fff", fontWeight: 700, fontSize: 12 }}>Mark Done</button>
            </>
          )}
        </div>
      ) : (
        <>
          <Sec title="Walk-Up" items={detail?.w} />
          <Sec title="During" items={detail?.u} />
          <Sec title="Completion Criteria" items={detail?.c} />
          <Sec title="Org Info" items={detail?.i} mono />
        </>
      )}
    </div>
  );
}

// ── AI TAB ────────────────────────────────────────────────────────────────────
function AITab({ node, msgs, setMsgs, editMode, setEditMode, nodes, edges, setNodes, setEdges }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(null);
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const hist = [...msgs, userMsg];
    setMsgs(hist);
    setInput("");
    setLoading(true);
    try {
      let sys = AI_SYS;
      if (node) sys += `\n\nCURRENT NODE: ${node.label} (id: ${node.id}, type: ${node.type}, exp: ${node.exp}m)`;
      if (editMode) sys += `\n\nEDIT MODE ACTIVE. Full flowchart JSON:\n${JSON.stringify({ nodes, edges })}`;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800, system: sys, messages: hist })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.type === "text" ? b.text : "").join("") || "Error: no response";
      const m = text.match(/\[FLOWCHART_CHANGE\]([\s\S]*?)\[\/FLOWCHART_CHANGE\]/);
      if (m) {
        try { setPending(JSON.parse(m[1])); } catch {}
      }
      const display = text.replace(/\[FLOWCHART_CHANGE\][\s\S]*?\[\/FLOWCHART_CHANGE\]/g, "[⬡ Edit proposal — see below]");
      setMsgs([...hist, { role: "assistant", content: display }]);
    } catch (e) {
      setMsgs([...hist, { role: "assistant", content: "API error: " + e.message }]);
    }
    setLoading(false);
  }

  function applyChange(c) {
    let ns = [...nodes], es = [...edges];
    for (const a of (c.actions || [])) {
      if (a.action === "add_node") { if (a.removeEdge) es = es.filter(e => e.id !== a.removeEdge); ns = [...ns, a.node]; }
      else if (a.action === "remove_node") { ns = ns.filter(n => n.id !== a.nodeId); es = es.filter(e => e.from !== a.nodeId && e.to !== a.nodeId); }
      else if (a.action === "update_node_label") ns = ns.map(n => n.id === a.nodeId ? { ...n, label: a.label } : n);
      else if (a.action === "update_node_detail") ns = ns.map(n => n.id === a.nodeId ? { ...n, detail: { ...(n.detail || {}), ...a.detail } } : n);
      else if (a.action === "update_exp") ns = ns.map(n => n.id === a.nodeId ? { ...n, exp: a.exp } : n);
      else if (a.action === "add_edge") es = [...es, a.edge];
      else if (a.action === "remove_edge") es = es.filter(e => e.id !== a.edgeId);
    }
    setNodes(ns); setEdges(es); setPending(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "system-ui" }}>
      <div style={{ padding: "7px 12px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "#3a2a68" }}>Context: {node?.label || "none"}</span>
        <label style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 10, color: editMode ? A : "#3a2a68" }}>
          <input type="checkbox" checked={editMode} onChange={e => setEditMode(e.target.checked)} style={{ accentColor: A }} />
          Edit Mode
        </label>
      </div>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        {msgs.length === 0 && <div style={{ color: "#2e2258", fontSize: 11, textAlign: "center", marginTop: 24 }}>Ask about this node or the Fusion AI platform.</div>}
        {msgs.map((m, i) => (
          <div key={i} style={{ padding: "8px 10px", borderRadius: 6, background: m.role === "user" ? `${P}22` : "rgba(19,14,32,0.9)", border: `1px solid ${m.role === "user" ? "#2e2258" : "#1a1332"}`, fontSize: 11, color: m.role === "user" ? "#ddd6fe" : "#b0a0d8", lineHeight: 1.55, alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "93%", whiteSpace: "pre-wrap" }}>
            {m.content}
          </div>
        ))}
        {loading && <div style={{ color: "#3a2a68", fontSize: 11 }}>⬡ thinking…</div>}
        {pending && (
          <div style={{ padding: "10px", borderRadius: 6, border: `1px solid ${A}44`, background: `${A}0d` }}>
            <div style={{ color: A, fontSize: 11, fontWeight: 700, marginBottom: 5 }}>⚡ Proposed Change</div>
            <div style={{ color: "#c4b5fd", fontSize: 11, marginBottom: 8 }}>{pending.summary || "Flowchart modification detected."}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => applyChange(pending)} style={{ padding: "4px 12px", borderRadius: 4, border: "none", cursor: "pointer", background: A, color: "#000", fontSize: 11, fontWeight: 700 }}>Apply</button>
              <button onClick={() => setPending(null)} style={{ padding: "4px 12px", borderRadius: 4, border: `1px solid ${BORDER}`, cursor: "pointer", background: "transparent", color: "#4a3880", fontSize: 11 }}>Dismiss</button>
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: "10px 12px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 6 }}>
        <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Ask AI… (Enter to send)" rows={2} style={{ flex: 1, padding: "7px 10px", borderRadius: 5, border: `1px solid ${BORDER}`, background: "#0d0919", color: "#ddd6fe", fontSize: 11, fontFamily: "system-ui", outline: "none", resize: "none", lineHeight: 1.4 }} />
        <button onClick={send} disabled={loading} style={{ padding: "7px 12px", borderRadius: 5, border: "none", cursor: "pointer", background: P, color: "#fff", fontSize: 12, fontWeight: 700, opacity: loading ? .5 : 1, alignSelf: "flex-end" }}>→</button>
      </div>
    </div>
  );
}

// ── NOTES TAB ─────────────────────────────────────────────────────────────────
function NotesTab({ nodeId, nodeNotes, setNodeNotes, sessionLog, addLog }) {
  const [inp, setInp] = useState("");
  const nNotes = (nodeNotes[nodeId] || []);
  function addNote() {
    if (!inp.trim()) return;
    const ts = new Date().toLocaleTimeString();
    setNodeNotes(p => ({ ...p, [nodeId]: [...(p[nodeId] || []), { ts, text: inp }] }));
    addLog(`[${nodeId}] ${inp}`);
    setInp("");
  }
  return (
    <div style={{ padding: "12px 14px", fontFamily: "system-ui", fontSize: 12, color: "#c4b5fd", display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box", gap: 0 }}>
      {nodeId && <>
        <div style={{ fontWeight: 700, color: P, fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>Node Notes — {nodeId}</div>
        <div style={{ flex: 1, overflowY: "auto", marginBottom: 8, minHeight: 60 }}>
          {nNotes.length === 0 ? <div style={{ color: "#2e2258", fontSize: 11 }}>No notes for this node.</div>
            : nNotes.map((n, i) => <div key={i} style={{ marginBottom: 5, padding: "5px 8px", borderRadius: 4, background: "#0d0919", border: `1px solid ${BORDER}` }}><span style={{ color: "#2e2258", fontSize: 9 }}>{n.ts}  </span><span>{n.text}</span></div>)}
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && addNote()} placeholder="Add note…" style={{ flex: 1, padding: "6px 9px", borderRadius: 4, border: `1px solid ${BORDER}`, background: "#0d0919", color: "#ddd6fe", fontSize: 11, outline: "none" }} />
          <button onClick={addNote} style={{ padding: "6px 11px", borderRadius: 4, border: "none", cursor: "pointer", background: P, color: "#fff", fontSize: 11, fontWeight: 700 }}>+</button>
        </div>
      </>}
      <div style={{ fontWeight: 700, color: P, fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>Session Log</div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {sessionLog.length === 0 ? <div style={{ color: "#2e2258", fontSize: 11 }}>No entries yet.</div>
          : [...sessionLog].reverse().map((e, i) => <div key={i} style={{ marginBottom: 3, fontSize: 10, color: "#4a3880", borderLeft: `2px solid ${BORDER}`, paddingLeft: 7 }}><span style={{ color: "#2e2258" }}>{e.ts}  </span>{e.text}</div>)}
      </div>
    </div>
  );
}

// ── PROGRESS TAB ──────────────────────────────────────────────────────────────
function ProgressTab({ nodes, statuses, nodeStartTimes, now, session }) {
  const total = nodes.length;
  const done = nodes.filter(n => statuses[n.id] === "done" || statuses[n.id] === "skip").length;
  const pct = Math.round(done / total * 100);
  const sessionElap = session.started ? (now - session.startTime) : 0;
  return (
    <div style={{ padding: "12px 14px", fontFamily: "system-ui", fontSize: 12, color: "#c4b5fd", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontWeight: 700, color: "#ddd6fe", fontSize: 13 }}>{done}/{total} complete</span>
          <span style={{ color: P, fontWeight: 800, fontSize: 13 }}>{pct}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: "#1a1332", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${P},#a78bfa)`, transition: "width .4s", borderRadius: 3 }} />
        </div>
        {session.started && <div style={{ marginTop: 6, fontSize: 11, color: "#3a2a68" }}>Session running: <span style={{ color: A, fontWeight: 700 }}>{fmt(sessionElap)}</span></div>}
      </div>
      {nodes.map(n => {
        const st = statuses[n.id] || "todo";
        const sc = sColor(st);
        const el = nodeStartTimes[n.id] ? (now - nodeStartTimes[n.id]) : 0;
        const ot = el > 0 && n.exp > 0 && el > n.exp * 60000 * 2;
        return (
          <div key={n.id} style={{ marginBottom: 5, padding: "6px 10px", borderRadius: 4, background: "#0d0919", border: `1px solid ${st === "done" ? C_DONE + "22" : st === "active" ? P + "22" : BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: sc, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 11, color: "#b0a0d8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.label}</span>
            {el > 0 && <span style={{ fontSize: 10, color: ot ? A : "#2e2258", flexShrink: 0 }}>{fmt(el)}</span>}
            <span style={{ fontSize: 9, color: sc, textTransform: "uppercase", fontWeight: 700, flexShrink: 0, letterSpacing: ".04em" }}>{st}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── MODAL WRAPPER ─────────────────────────────────────────────────────────────
function Modal({ children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: SURF, border: `1px solid #3d2e70`, borderRadius: 9, padding: 22, maxWidth: 420, width: "92%", boxShadow: "0 24px 80px rgba(0,0,0,0.9)", fontFamily: "system-ui" }}>{children}</div>
    </div>
  );
}

// ── TOP BAR BUTTON ────────────────────────────────────────────────────────────
function Btn({ children, onClick, active, col = BORDER }) {
  return (
    <button onClick={onClick} style={{ padding: "5px 10px", borderRadius: 4, border: `1px solid ${active ? col : "#1e1635"}`, cursor: "pointer", background: active ? col + "22" : "transparent", color: active ? col : "#3a2a68", fontSize: 10, fontWeight: 700, transition: "all .15s", whiteSpace: "nowrap" }}>
      {children}
    </button>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [nodes, setNodes] = useState(NODES0);
  const [edges, setEdges] = useState(EDGES0);
  const [statuses, setStatuses] = useState({});
  const [qcStateMap, setQcStateMap] = useState({});
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("details");
  const [pan, setPan] = useState({ x: 90, y: 30 });
  const [zoom, setZoom] = useState(0.60);
  const [arrangeMode, setArrangeMode] = useState(false);
  const [session, setSession] = useState({ started: false, startTime: null });
  const [nodeStartTimes, setNodeStartTimes] = useState({});
  const [now, setNow] = useState(Date.now());
  const [aiEditMode, setAiEditMode] = useState(false);
  const [aiConvos, setAiConvos] = useState({});
  const [bypassReasons, setBypassReasons] = useState({});
  const [nodeNotes, setNodeNotes] = useState({});
  const [sessionLog, setSessionLog] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [downstreamModal, setDownstreamModal] = useState(null);
  const [bypassModal, setBypassModal] = useState(null);
  const [bypassInput, setBypassInput] = useState("");

  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const panRef = useRef(null);

  const selectedNode = nodes.find(n => n.id === selected) || null;
  const msgs = aiConvos[selected] || [];
  const elap = nodeStartTimes[selected] ? (now - nodeStartTimes[selected]) : undefined;

  // tick
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  // load
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        if (r?.value) {
          const d = JSON.parse(r.value);
          if (d.nodes) setNodes(d.nodes);
          if (d.edges) setEdges(d.edges);
          if (d.statuses) setStatuses(d.statuses);
          if (d.qcStateMap) setQcStateMap(d.qcStateMap);
          if (d.session) setSession(d.session);
          if (d.nodeStartTimes) setNodeStartTimes(d.nodeStartTimes);
          if (d.bypassReasons) setBypassReasons(d.bypassReasons);
          if (d.nodeNotes) setNodeNotes(d.nodeNotes);
          if (d.sessionLog) setSessionLog(d.sessionLog);
          if (d.aiConvos) setAiConvos(d.aiConvos);
          if (d.pan) setPan(d.pan);
          if (d.zoom) setZoom(d.zoom);
        }
      } catch { }
      setLoaded(true);
    })();
  }, []);

  // save
  const persist = useCallback(async () => {
    try { await window.storage.set(STORAGE_KEY, JSON.stringify({ nodes, edges, statuses, qcStateMap, session, nodeStartTimes, bypassReasons, nodeNotes, sessionLog, aiConvos, pan, zoom })); } catch { }
  }, [nodes, edges, statuses, qcStateMap, session, nodeStartTimes, bypassReasons, nodeNotes, sessionLog, aiConvos, pan, zoom]);

  useEffect(() => { if (loaded) persist(); }, [statuses, qcStateMap, nodeNotes, sessionLog, nodes, edges, bypassReasons, loaded]);

  function addLog(text) {
    const ts = new Date().toLocaleTimeString();
    setSessionLog(p => [...p, { ts, text }]);
  }

  function getDownstream(nodeId) {
    const visited = new Set(), queue = [nodeId], result = [];
    while (queue.length) {
      const cur = queue.shift();
      edges.filter(e => e.from === cur).forEach(e => { if (!visited.has(e.to)) { visited.add(e.to); result.push(e.to); queue.push(e.to); } });
    }
    return result;
  }

  function applyStatus(id, s) {
    setStatuses(p => ({ ...p, [id]: s }));
    if (s === "active" && !nodeStartTimes[id]) setNodeStartTimes(p => ({ ...p, [id]: Date.now() }));
    addLog(`${id} → ${s}`);
  }

  function setStatus(id, s) {
    if (s === "done" || s === "active") {
      const affected = getDownstream(id).filter(nid => ["active", "done"].includes(statuses[nid]));
      if (affected.length > 0) { setDownstreamModal({ nodeId: id, s, affected }); return; }
    }
    applyStatus(id, s);
  }

  function setQcState(nodeId, itemId, val) {
    setQcStateMap(p => ({ ...p, [nodeId]: { ...(p[nodeId] || {}), [itemId]: val } }));
  }

  function handleBypass(id) { setBypassInput(""); setBypassModal(id); }

  function confirmBypass() {
    if (!bypassInput.trim()) return;
    setBypassReasons(p => ({ ...p, [bypassModal]: bypassInput }));
    setStatuses(p => ({ ...p, [bypassModal]: "skip" }));
    addLog(`Bypassed ${bypassModal}: ${bypassInput}`);
    setBypassModal(null);
  }

  function handleResolve(escId, originId) {
    setStatuses(p => ({ ...p, [escId]: "done", [originId]: "active" }));
    addLog(`Resolved ${escId} → back to ${originId}`);
    setSelected(originId);
  }

  function toggleSession() {
    if (!session.started) {
      const s = { started: true, startTime: Date.now() };
      setSession(s); addLog("Session started");
    } else {
      setSession({ started: false, startTime: null }); addLog("Session ended");
    }
  }

  function copyTicket() {
    const lines = nodes
      .filter(n => statuses[n.id] === "done" || statuses[n.id] === "skip")
      .map(n => {
        const t = nodeStartTimes[n.id] ? new Date(nodeStartTimes[n.id]).toLocaleTimeString() : "--";
        const sk = statuses[n.id] === "skip" ? ` [SKIP: ${bypassReasons[n.id] || ""}]` : "";
        return `[${t}] ${statuses[n.id] === "done" ? "✓" : "↷"} ${n.label}${sk}`;
      });
    navigator.clipboard.writeText(lines.join("\n") || "No completed steps.");
    addLog("Ticket copied to clipboard");
  }

  function resetAll() {
    setStatuses({}); setQcStateMap({}); setNodeStartTimes({}); setBypassReasons({});
    setSessionLog([]); setNodeNotes({}); setAiConvos({}); setSession({ started: false, startTime: null });
    setNodes(NODES0); setEdges(EDGES0);
  }

  // pan/zoom
  function handleWheel(e) {
    e.preventDefault();
    const rect = svgRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? 0.88 : 1.12;
    const nz = Math.min(2.5, Math.max(0.2, zoom * delta));
    setPan(p => ({ x: cx - (cx - p.x) * nz / zoom, y: cy - (cy - p.y) * nz / zoom }));
    setZoom(nz);
  }

  function handleSVGDown(e) {
    if (e.target === svgRef.current || e.target.tagName === "svg") {
      panRef.current = { sx: e.clientX, sy: e.clientY, ox: pan.x, oy: pan.y };
    }
  }

  function handleMouseMove(e) {
    if (panRef.current) setPan({ x: panRef.current.ox + e.clientX - panRef.current.sx, y: panRef.current.oy + e.clientY - panRef.current.sy });
    if (dragRef.current && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const cx = (e.clientX - rect.left - pan.x) / zoom;
      const cy = (e.clientY - rect.top - pan.y) / zoom;
      setNodes(ns => ns.map(n => n.id === dragRef.current.id ? { ...n, x: cx + dragRef.current.ox, y: cy + dragRef.current.oy } : n));
    }
  }

  function handleMouseUp() {
    panRef.current = null;
    if (dragRef.current) { addLog(`Repositioned ${dragRef.current.id}`); dragRef.current = null; persist(); }
  }

  function startDrag(e, id) {
    const n = nodes.find(x => x.id === id);
    if (!n || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left - pan.x) / zoom;
    const cy = (e.clientY - rect.top - pan.y) / zoom;
    dragRef.current = { id, ox: n.x - cx, oy: n.y - cy };
  }

  function isOvertime(n) {
    if (!n.exp || n.exp === 0) return false;
    const el = nodeStartTimes[n.id] ? (now - nodeStartTimes[n.id]) : 0;
    return el > n.exp * 60000 * 2;
  }

  const sessionElap = session.started ? (now - session.startTime) : 0;

  if (!loaded) return (
    <div style={{ background: BG, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#2e2258", fontFamily: "system-ui" }}>
      Loading…
    </div>
  );

  return (
    <div style={{ background: BG, height: "100vh", display: "flex", flexDirection: "column", fontFamily: "system-ui", color: "#ddd6fe", overflow: "hidden" }}
      onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>

      {/* TOP BAR */}
      <div style={{ height: 46, background: SURF, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", padding: "0 14px", gap: 8, flexShrink: 0, zIndex: 10 }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: "#a78bfa", letterSpacing: ".04em", marginRight: 4 }}>⬡ FUSION AI</div>
        <div style={{ fontSize: 9, color: "#2e2258", letterSpacing: ".06em", textTransform: "uppercase", marginRight: 8 }}>Orchestrator</div>
        <div style={{ flex: 1 }} />
        {session.started && <div style={{ fontSize: 11, color: A, fontWeight: 700, marginRight: 4 }}>⏱ {fmt(sessionElap)}</div>}
        <Btn onClick={toggleSession} active={session.started} col={session.started ? C_BLOCKED : C_DONE}>{session.started ? "■ End" : "▶ Start"}</Btn>
        <Btn onClick={() => setArrangeMode(a => !a)} active={arrangeMode} col={P}>{arrangeMode ? "✓ Arrange" : "⊹ Arrange"}</Btn>
        <Btn onClick={copyTicket}>⎘ Copy</Btn>
        <Btn onClick={() => window.print()}>⎙ Print</Btn>
        <Btn onClick={resetAll} col={C_BLOCKED}>↺</Btn>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* SVG CANVAS */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          <svg ref={svgRef} width="100%" height="100%"
            style={{ display: "block", cursor: arrangeMode ? "crosshair" : "grab" }}
            onWheel={handleWheel} onMouseDown={handleSVGDown}
            onClick={() => { if (!arrangeMode) setSelected(null); }}>
            <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
              {edges.map(e => <Edge key={e.id} edge={e} nodes={nodes} />)}
              {nodes.map(n => (
                <NodeShape key={n.id} node={n} selected={selected === n.id}
                  overtime={isOvertime(n)} status={statuses[n.id] || "todo"}
                  onSelect={id => { setSelected(id); setTab("details"); }}
                  onDragStart={startDrag} arrangeMode={arrangeMode} />
              ))}
            </g>
          </svg>
          <div style={{ position: "absolute", bottom: 10, left: 10, fontSize: 10, color: "#2e2258", background: "rgba(12,9,24,0.85)", padding: "3px 8px", borderRadius: 4, border: `1px solid ${BORDER}` }}>
            {Math.round(zoom * 100)}% · scroll to zoom · drag to pan
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width: 358, background: SURF, borderLeft: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          {/* header */}
          <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0, minHeight: 52 }}>
            {selectedNode ? (
              <div>
                <div style={{ fontWeight: 700, fontSize: 12, color: "#ddd6fe", marginBottom: 2 }}>{selectedNode.label}</div>
                <div style={{ fontSize: 10, color: "#2e2258", display: "flex", gap: 10 }}>
                  <span style={{ color: sColor(statuses[selectedNode.id] || "todo"), textTransform: "uppercase", fontWeight: 700 }}>{statuses[selectedNode.id] || "todo"}</span>
                  <span>{selectedNode.type}</span>
                  {selectedNode.exp > 0 && <span>exp {selectedNode.exp}m</span>}
                </div>
              </div>
            ) : <div style={{ fontSize: 11, color: "#2e2258" }}>No node selected — click to inspect</div>}
          </div>

          {/* tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
            {[["details", "Details"], ["ai", "AI Help"], ["notes", "Notes"], ["progress", "Progress"]].map(([t, lbl]) => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "8px 0", border: "none", cursor: "pointer", background: tab === t ? "#1a1332" : SURF, color: tab === t ? "#a78bfa" : "#2e2258", fontSize: 9.5, fontWeight: tab === t ? 800 : 400, letterSpacing: ".06em", textTransform: "uppercase", borderBottom: tab === t ? `2px solid ${P}` : "2px solid transparent", transition: "all .15s" }}>
                {lbl}
              </button>
            ))}
          </div>

          {/* tab body */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {tab === "details" && <DetailsTab node={selectedNode} status={statuses[selected]} setStatus={setStatus} qcStateMap={qcStateMap} setQcState={setQcState} onBypass={handleBypass} onResolve={handleResolve} bypassReason={bypassReasons[selected]} elap={elap} />}
            {tab === "ai" && <AITab node={selectedNode} msgs={msgs}
              setMsgs={m => setAiConvos(p => ({ ...p, [selected]: typeof m === "function" ? m(p[selected] || []) : m }))}
              editMode={aiEditMode} setEditMode={setAiEditMode} nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges} />}
            {tab === "notes" && <NotesTab nodeId={selected} nodeNotes={nodeNotes} setNodeNotes={setNodeNotes} sessionLog={sessionLog} addLog={addLog} />}
            {tab === "progress" && <ProgressTab nodes={nodes} statuses={statuses} nodeStartTimes={nodeStartTimes} now={now} session={session} />}
          </div>
        </div>
      </div>

      {/* DOWNSTREAM MODAL */}
      {downstreamModal && (
        <Modal>
          <div style={{ fontWeight: 700, color: "#f87171", marginBottom: 8, fontSize: 13 }}>⚠ Downstream Nodes Affected</div>
          <div style={{ fontSize: 12, color: "#c4b5fd", marginBottom: 10 }}>
            Marking <strong style={{ color: "#ddd6fe" }}>{nodes.find(n => n.id === downstreamModal.nodeId)?.label}</strong> as{" "}
            <strong style={{ color: sColor(downstreamModal.s) }}>{downstreamModal.s}</strong> affects:
          </div>
          <div style={{ marginBottom: 14 }}>
            {downstreamModal.affected.map(id => (
              <div key={id} style={{ fontSize: 11, color: A, padding: "3px 0" }}>▸ {nodes.find(n => n.id === id)?.label} <span style={{ color: sColor(statuses[id]) }}>({statuses[id]})</span></div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { applyStatus(downstreamModal.nodeId, downstreamModal.s); setDownstreamModal(null); }} style={{ flex: 1, padding: "9px", borderRadius: 5, border: "none", cursor: "pointer", background: P, color: "#fff", fontWeight: 700, fontSize: 12 }}>Proceed</button>
            <button onClick={() => setDownstreamModal(null)} style={{ flex: 1, padding: "9px", borderRadius: 5, border: `1px solid ${BORDER}`, cursor: "pointer", background: "transparent", color: "#4a3880", fontSize: 12 }}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* BYPASS MODAL */}
      {bypassModal && (
        <Modal>
          <div style={{ fontWeight: 700, color: A, marginBottom: 8, fontSize: 13 }}>⤷ Skip / Bypass</div>
          <div style={{ fontSize: 12, color: "#c4b5fd", marginBottom: 4 }}>{nodes.find(n => n.id === bypassModal)?.bypassOwner || "Skipping this step."}</div>
          <div style={{ fontSize: 10, color: "#3a2a68", marginBottom: 10 }}>Provide a reason before skipping:</div>
          <input value={bypassInput} onChange={e => setBypassInput(e.target.value)} onKeyDown={e => e.key === "Enter" && confirmBypass()} placeholder="Reason for skipping…" style={{ width: "100%", padding: "8px 10px", borderRadius: 5, border: `1px solid ${BORDER}`, background: "#0d0919", color: "#ddd6fe", fontSize: 12, marginBottom: 12, boxSizing: "border-box", outline: "none" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={confirmBypass} disabled={!bypassInput.trim()} style={{ flex: 1, padding: "9px", borderRadius: 5, border: "none", cursor: "pointer", background: A, color: "#000", fontWeight: 700, fontSize: 12, opacity: bypassInput.trim() ? 1 : .45 }}>Confirm Skip</button>
            <button onClick={() => setBypassModal(null)} style={{ flex: 1, padding: "9px", borderRadius: 5, border: `1px solid ${BORDER}`, cursor: "pointer", background: "transparent", color: "#4a3880", fontSize: 12 }}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
