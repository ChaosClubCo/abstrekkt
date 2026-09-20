/*
 * FlashFusion App Ops Center — v2.0.0
 * Rebuilt: 2026-06-24
 *
 * ARCHITECTURALLY INCOMPATIBLE PRO MOVES: none.
 * All directives from the rebuild spec are implemented.
 *
 * TRADEOFF DECISIONS (explicit):
 * [T1] API key is session-only (state, not storage). Deliberate: security > convenience.
 *      Users re-enter on reload. Accepted cost: UX friction on refresh.
 * [T2] clientMode strips FlashFusion branding but reuses the same component tree.
 *      Alternative (separate component) rejected: maintenance surface doubles.
 * [T3] Auto-fallback to MOCK on API failure uses last-known demo data, not live state.
 *      Reason: live state may be partial/corrupt mid-request; demo data is always valid.
 * [T4] Retry backoff is per-request (500 → 1000 → 2000ms). Bulk triage retries independently
 *      per app, not as a batch. Reason: one bad app should not stall the rest.
 */

import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ─── CONFIG — All brand/project/env strings isolated here ──────────────────────
// To white-label: change CONFIG.brand.* and CONFIG.neutral.* only.
const CONFIG = {
  version: "2.0.0",
  model: "claude-sonnet-4-6",
  apiEndpoint: "https://api.anthropic.com/v1/messages",
  storageKeys: {
    apps:    "ff-ops-apps-v2",
    meta:    "ff-ops-meta-v2",
    project: "ff-ops-proj-v2",
    keyFlag: "ff-ops-key-set",             // boolean flag only — never store the key
  },
  brand: {
    name:    "FlashFusion App Ops",
    tagline: "Portfolio Intelligence",
    accent:  "#A855F7",
  },
  neutral: {                               // clientMode values — swapped in when ?client=true
    name:    "App Ops Center",
    tagline: "Portfolio Management",
    accent:  "#6366F1",
  },
};

// ─── TOKENS — v3.1 FlashFusion (solid cards, no blur on content panels) ────────
const V = {
  void:    "#000000",
  s1:      "#0B0B14",   // surface-base
  s2:      "#13131F",   // surface-raised — card bg
  s3:      "#1C1C2E",   // surface-elevated — inputs, hover
  s4:      "#232336",
  border:  "rgba(139,92,246,0.12)",
  borderHi:"rgba(139,92,246,0.35)",
  borderAc:"rgba(139,92,246,0.60)",
  violet:  "#A855F7",
  magenta: "#EC4899",
  cyan:    "#22D3EE",
  t1:      "#FFFFFF",
  t2:      "#C7C7D1",
  t3:      "#8A8A96",
  t4:      "#4A4A58",
  green:   "#22C55E",
  red:     "#EF4444",
  amber:   "#F59E0B",
  orange:  "#FB923C",
  greenBg: "rgba(34,197,94,0.10)",
  redBg:   "rgba(239,68,68,0.10)",
  amberBg: "rgba(245,158,11,0.10)",
};

// ─── DEMO DATA — seed for DEMO mode (no API key required) ──────────────────────
const DEMO_APPS = [
  { id:"d1", n:"audit",            dn:"Audit Platform",       p:"b44", l:"ff",  s:"prod",   v:null, e:null,  url:"https://audit.flashfusion.co",   f:["primary"] },
  { id:"d2", n:"client-os",        dn:"FlashFusion Client OS",p:"b44", l:"ff",  s:"parked", v:null, e:null,  url:"https://client.flashfusion.co",  f:["decision-pending"] },
  { id:"d3", n:"sparkacademy",     dn:"SparkAcademy",         p:"b44", l:"ff",  s:"active", v:null, e:null,  url:null,                              f:[] },
  { id:"d4", n:"fusion-ai",        dn:"Fusion AI",            p:"b44", l:"ff",  s:"prod",   v:null, e:null,  url:"https://app.flashfusion.co",     f:["primary"] },
  { id:"d5", n:"webnflow",         dn:"WebnfloW",             p:"b44", l:"ff",  s:"active", v:null, e:null,  url:"https://sites.flashfusion.co",   f:[] },
  { id:"d6", n:"conduit",          dn:"ConduitConduit (Fusionomics)",p:"b44",l:"exp",s:"active",v:null,e:null,url:null,f:["unconfigured"] },
  { id:"d7", n:"affordablestuff",  dn:"AffordableStuffStore", p:"other",l:"afs", s:"zombie", v:null, e:null,  url:"https://affordablestuffstore.com",f:["dns-broken","zombie"] },
  { id:"d8", n:"tessa",            dn:"TESSA",                p:"b44", l:"park",s:"zombie", v:null, e:null,  url:null,                              f:["delete-flagged"] },
  { id:"d9", n:"beta-tester-army", dn:"Beta Tester Army",     p:"b44", l:"cc",  s:"active", v:null, e:null,  url:"https://betatestersarmy.com",    f:[] },
  { id:"d10",n:"inner-odyssey",    dn:"Inner Odyssey",        p:"b44", l:"exp", s:"active", v:null, e:null,  url:null,                              f:[] },
  { id:"d11",n:"flowstate",        dn:"FlowState",            p:"b44", l:"exp", s:"active", v:null, e:null,  url:null,                              f:[] },
  { id:"d12",n:"skysync",          dn:"SkySync",              p:"b44", l:"exp", s:"active", v:null, e:null,  url:null,                              f:[] },
];

const DEMO_META = {
  d1:  { decision:"keep",    priority:"P0", lane:"ff",   migration:false, wsjf:21, notes:"Revenue-generating platform. Primary client surface." },
  d2:  { decision:"investigate",priority:"P1",lane:"ff", migration:false, wsjf:8,  notes:"Kill vs. repurpose as ops.flashfusion.co — decision pending." },
  d3:  { decision:"keep",    priority:"P1", lane:"ff",   migration:false, wsjf:13, notes:"32 courses, 26 published, zero enrollments. Needs monetization." },
  d4:  { decision:"keep",    priority:"P0", lane:"ff",   migration:false, wsjf:21, notes:"Primary agent orchestration surface." },
  d5:  { decision:"keep",    priority:"P2", lane:"ff",   migration:false, wsjf:8,  notes:"Active. Review cadence needed." },
  d6:  { decision:"investigate",priority:"P2",lane:"exp",migration:false, wsjf:5,  notes:"7 credentials unconfigured. Blocked until n8n wired." },
  d7:  { decision:"archive", priority:"P1", lane:"afs",  migration:false, wsjf:13, notes:"DNS broken. OpenAI key broken. Fix DNS first, then assess." },
  d8:  { decision:"archive", priority:"P0", lane:"park", migration:false, wsjf:21, notes:"Flagged for manual deletion. Contains harmful UGC." },
  d9:  { decision:"keep",    priority:"P2", lane:"cc",   migration:false, wsjf:5,  notes:"72 entities. Active." },
  d10: { decision:null,      priority:null, lane:"exp",  migration:false, wsjf:null, notes:"" },
  d11: { decision:null,      priority:null, lane:"exp",  migration:false, wsjf:null, notes:"" },
  d12: { decision:null,      priority:null, lane:"exp",  migration:false, wsjf:null, notes:"" },
};

// ─── LANE / PLATFORM / DECISION MAPS ────────────────────────────────────────────
const FF_LANES = {
  ff:   { label:"FF Consulting",    color:V.violet,  bg:"rgba(168,85,247,0.12)" },
  cc:   { label:"Chaos Club",       color:V.magenta, bg:"rgba(236,72,153,0.12)" },
  afs:  { label:"AffordableStuff",  color:V.cyan,    bg:"rgba(34,211,238,0.12)" },
  int:  { label:"INT/Internal",     color:"#818CF8", bg:"rgba(129,140,248,0.12)" },
  exp:  { label:"Experimental",     color:V.amber,   bg:"rgba(245,158,11,0.12)" },
  park: { label:"Parked/Archive",   color:V.t4,      bg:"rgba(74,74,88,0.15)" },
};
const DEFAULT_LANES = {
  core:   { label:"Core / Prod",   color:V.violet, bg:"rgba(168,85,247,0.12)" },
  active: { label:"Active Dev",    color:V.green,  bg:"rgba(34,197,94,0.12)" },
  exp:    { label:"Experimental",  color:V.amber,  bg:"rgba(245,158,11,0.12)" },
  park:   { label:"Parked",        color:V.t4,     bg:"rgba(74,74,88,0.15)" },
};
const DECISIONS = {
  keep:        { label:"Keep",        color:V.green,  bg:V.greenBg },
  archive:     { label:"Archive",     color:V.red,    bg:V.redBg },
  migrate:     { label:"Migrate",     color:V.cyan,   bg:"rgba(34,211,238,0.10)" },
  investigate: { label:"Investigate", color:V.amber,  bg:V.amberBg },
};
const PRIORITIES = {
  P0:{ color:V.red,    bg:"rgba(239,68,68,0.18)" },
  P1:{ color:V.orange, bg:"rgba(251,146,60,0.18)" },
  P2:{ color:V.amber,  bg:"rgba(245,158,11,0.18)" },
  P3:{ color:V.t3,     bg:"rgba(138,138,150,0.18)" },
};
const PLATFORMS = {
  b44:    { label:"Base44",  color:V.violet },
  lv:     { label:"Lovable", color:V.cyan },
  next:   { label:"Next.js", color:"#E2E8F0" },
  vercel: { label:"Vercel",  color:"#94A3B8" },
  gh:     { label:"GitHub",  color:"#94A3B8" },
  other:  { label:"Other",   color:V.t3 },
};
const STATUS_COLOR = { prod:V.violet, active:V.green, zombie:V.red, parked:V.t4, unknown:V.t4 };

// ─── ENV DETECTION ───────────────────────────────────────────────────────────────
function detectClientMode() {
  try {
    return new URLSearchParams(window.location.search).get("client") === "true";
  } catch {
    return false;
  }
}

function detectViewport() {
  return window.innerWidth < 768 ? "mobile" : "desktop";
}

// ─── RETRY UTILITY (exponential backoff, max 3 attempts) ────────────────────────
async function withRetry(fn, maxAttempts = 3, baseDelay = 500) {
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < maxAttempts) {
        await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, attempt - 1)));
      }
    }
  }
  throw lastErr;
}

// ─── API LAYER ───────────────────────────────────────────────────────────────────
// apiKey stays in React state — never logged, never rendered to DOM, never in storage.
async function callClaudeRaw(prompt, apiKey, maxTokens = 1200) {
  const res = await fetch(CONFIG.apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: CONFIG.model,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
  if (!text) throw new Error("Empty response from API");
  return text;
}

async function callClaude(prompt, apiKey, maxTokens, onFallback) {
  try {
    return await withRetry(() => callClaudeRaw(prompt, apiKey, maxTokens));
  } catch (err) {
    console.error("[AppOpsCenter] API call failed after 3 attempts:", err.message);
    if (onFallback) onFallback(err.message);
    throw err;
  }
}

function parseJSON(text) {
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─── AI FUNCTIONS ────────────────────────────────────────────────────────────────
async function aiTriage(app, meta, lanes, projectName, apiKey, onFallback) {
  const laneList = Object.entries(lanes).map(([k, v]) => `${k}=${v.label}`).join(", ");
  const prompt = `You are an app portfolio consultant for "${projectName}".

App: ${app.dn} (slug: ${app.n})
Platform: ${app.p} | Status: ${app.s}
${app.v != null ? `Traffic: ${app.v} visitors/30d` : ""}${app.e != null ? ` | Edits: ${app.e}` : ""}
${app.url ? `URL: ${app.url}` : ""}
${(app.f || []).length ? `Flags: ${app.f.join(", ")}` : ""}
Current lane: ${meta.lane} | Current decision: ${meta.decision || "none"}

Available lanes: ${laneList}

Return ONLY valid JSON (no markdown, no explanation):
{"decision":"keep|archive|migrate|investigate","priority":"P0|P1|P2|P3","lane":"one_of_lane_keys","wsjf":1-21,"reasoning":"1 sentence max"}`;
  const text = await callClaude(prompt, apiKey, 300, onFallback);
  return parseJSON(text);
}

async function aiChain(app, meta, lanes, projectName, apiKey, onFallback) {
  const lane = lanes[meta.lane]?.label || meta.lane;
  const prompt = `Generate a 5-prompt GitHub Copilot agent chain for this app.

Project: ${projectName}
App: ${app.dn} | Platform: ${app.p} | Lane: ${lane} | Status: ${app.s}
${app.url ? `URL: ${app.url}` : ""}${meta.migration ? " | MIGRATION TARGET: Next.js 15 + Supabase + Vercel" : ""}
${meta.decision ? `Decision: ${meta.decision}` : ""}${meta.notes ? `\nNotes: ${meta.notes}` : ""}

Produce a focused, specific 5-prompt chain. Each prompt in triple backticks, specific to this app's context.
PROMPT 1 — Codebase Orientation
PROMPT 2 — Security & Quality Audit
PROMPT 3 — Architecture Evaluation
PROMPT 4 — ${meta.migration ? "Migration Plan" : "Implementation Plan"}
PROMPT 5 — Test Coverage`;
  return await callClaude(prompt, apiKey, 1400, onFallback);
}

async function aiParseApps(rawText, projectName, apiKey, onFallback) {
  const prompt = `Parse this app/project list for "${projectName}" into a JSON array.

For each item extract or infer:
- id: unique slug (lowercase, hyphens)
- n: short slug
- dn: human-readable display name
- p: "b44"|"lv"|"next"|"vercel"|"gh"|"other"
- l: "core"|"active"|"exp"|"park"
- v: visitors_30d (number or null)
- e: edit_count (number or null)
- url: string or null
- s: "prod"|"active"|"parked"|"zombie"
- f: flags array

Input:
${rawText}

Return ONLY a valid JSON array. No explanation, no markdown.`;
  const text = await callClaude(prompt, apiKey, 2000, onFallback);
  const parsed = parseJSON(text);
  return Array.isArray(parsed) ? parsed : parsed.apps || [];
}

async function aiSprintPlan(apps, meta, lanes, projectName, apiKey, onFallback, n = 5) {
  const context = apps.map(a => {
    const m = meta[a.id] || {};
    return `- ${a.dn} [${a.p}/${a.s}] decision:${m.decision || "none"} priority:${m.priority || "none"} wsjf:${m.wsjf || "?"} migrate:${m.migration ? "yes" : "no"}`;
  }).join("\n");
  const prompt = `Sprint planner for "${projectName}". Portfolio:\n${context}\n\nTop ${n} highest-leverage items. For each: app + action, why it's priority, effort (S/M/L/XL), WSJF 1-21, acceptance criteria. Numbered list, concise.`;
  return await callClaude(prompt, apiKey, 1000, onFallback);
}

// ─── ERROR BOUNDARY ───────────────────────────────────────────────────────────────
import React from "react";

class PanelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(err) {
    return { hasError: true, message: err?.message || "Unexpected error" };
  }
  componentDidCatch(err) {
    console.error("[AppOpsCenter] Panel crashed:", err.message);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: V.redBg, border: `1px solid ${V.red}44`,
          borderRadius: 10, padding: "20px 16px", textAlign: "center"
        }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>
            <i className="ph ph-warning" style={{ color: V.red }} aria-hidden="true" />
          </div>
          <div style={{ fontSize: 13, color: V.red, fontWeight: 600, marginBottom: 4 }}>Panel error</div>
          <div style={{ fontSize: 11, color: V.t3, marginBottom: 12 }}>{this.state.message}</div>
          <button
            onClick={() => this.setState({ hasError: false, message: "" })}
            style={btnStyle(V.red, "rgba(239,68,68,0.15)")}
            aria-label="Retry this panel"
          >
            <i className="ph ph-arrow-clockwise" aria-hidden="true" /> Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── SHARED STYLE FACTORIES ───────────────────────────────────────────────────────
// Solid card — v3.1 (no blur, no rgba background)
const card = (extra = {}) => ({
  background: V.s2,
  border: `1px solid ${V.border}`,
  borderRadius: 10,
  padding: "14px 16px",
  ...extra,
});

const inp = (extra = {}) => ({
  background: V.s3,
  border: `1px solid ${V.border}`,
  borderRadius: 6,
  color: V.t2,
  fontSize: 12,
  padding: "6px 10px",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
  ...extra,
});

function btnStyle(color, bg, extra = {}) {
  return {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "6px 14px", borderRadius: 7,
    border: `1px solid ${color}44`, background: bg,
    color, fontSize: 12, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit",
    ...extra,
  };
}

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────────
// Flag tooltips — human-readable explanation for every known flag value
const FLAG_TOOLTIPS = {
  "primary":          "Primary production app for this portfolio",
  "decision-pending": "Kill vs. repurpose decision has not been made",
  "dns-broken":       "Domain DNS misconfigured — site is unreachable",
  "delete-flagged":   "Flagged for manual deletion",
  "unconfigured":     "Has unconfigured dependencies (credentials or integrations missing)",
  "zombie":           "No recent activity — likely dead or abandoned",
  "duplicate":        "Potential duplicate of another app in this portfolio",
  "high-traffic":     "High visitor volume — changes carry production risk",
  "migration-target": "Scheduled to migrate to a new stack",
  "orphaned":         "Exists in platform but has no linked engagement or owner",
};

const STATUS_TOOLTIPS = {
  prod:    "Live in production — has real users or revenue",
  active:  "Under active development",
  parked:  "Intentionally paused — may be revived",
  zombie:  "No activity detected — candidate for archival",
  unknown: "Status has not been assessed",
};

// Pill — label + optional category shown as native tooltip on hover/focus
const Pill = ({ label, color, bg, size = 11, category, tooltip }) => {
  const tip = category
    ? `${category}: ${label}${tooltip ? ` — ${tooltip}` : ""}`
    : (tooltip || label);
  return (
    <span
      title={tip}
      aria-label={tip}
      style={{
        display: "inline-flex", alignItems: "center",
        padding: "2px 7px", borderRadius: 99,
        fontSize: size, fontWeight: 500,
        color, background: bg, lineHeight: 1.4, whiteSpace: "nowrap",
        cursor: "default",
      }}
    >
      {label}
    </span>
  );
};

// PillGroup — labelled cluster of related pills so users can tell what category they're looking at
const PillGroup = ({ label, icon, children, compact = false }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: compact ? 2 : 3, alignItems: "flex-start" }}>
    <span style={{
      fontSize: 9, color: V.t4, letterSpacing: "0.08em", textTransform: "uppercase",
      display: "flex", alignItems: "center", gap: 3, lineHeight: 1,
    }}>
      {icon && <i className={`ph ${icon}`} style={{ fontSize: 9 }} aria-hidden="true" />}
      {label}
    </span>
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{children}</div>
  </div>
);

const Spinner = ({ size = 10 }) => (
  <span style={{
    display: "inline-block", width: size, height: size,
    border: `1.5px solid ${V.t4}`, borderTop: `1.5px solid ${V.violet}`,
    borderRadius: "50%", animation: "ff-spin 0.7s linear infinite",
    flexShrink: 0,
  }} role="status" aria-label="Loading" />
);

// ─── MODE BADGE — LIVE/MOCK/DEMO with accessible tooltip ──────────────────────────
function ModeBadge({ mode, onConfigure }) {
  const [showTip, setShowTip] = useState(false);
  const cfg = {
    LIVE: { color: V.green,  bg: V.greenBg,  tip: "Connected to Anthropic API. All AI features active." },
    MOCK: { color: V.amber,  bg: V.amberBg,  tip: "API unreachable after 3 attempts. Using cached demo data. Check your key and network, then reload." },
    DEMO: { color: V.t3,     bg: "rgba(138,138,150,0.10)", tip: "No API key configured. AI features disabled. Click to configure." },
  }[mode] || { color: V.t3, bg: "transparent", tip: "" };

  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <button
        onClick={mode === "DEMO" ? onConfigure : undefined}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        onFocus={() => setShowTip(true)}
        onBlur={() => setShowTip(false)}
        aria-label={`Mode: ${mode}. ${cfg.tip}`}
        aria-describedby="mode-tooltip"
        style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "3px 10px", borderRadius: 99,
          border: `1px solid ${cfg.color}44`, background: cfg.bg,
          color: cfg.color, fontSize: 11, fontWeight: 700,
          cursor: mode === "DEMO" ? "pointer" : "default",
          fontFamily: "inherit", letterSpacing: "0.06em",
        }}
      >
        <span style={{
          width: 6, height: 6, borderRadius: "50%", background: cfg.color,
          animation: mode === "LIVE" ? "ff-pulse 2s ease-in-out infinite" : "none",
          flexShrink: 0,
        }} aria-hidden="true" />
        {mode}
      </button>
      {showTip && (
        <div
          id="mode-tooltip"
          role="tooltip"
          style={{
            position: "absolute", top: "calc(100% + 6px)", right: 0,
            background: V.s4, border: `1px solid ${V.border}`,
            borderRadius: 7, padding: "8px 10px",
            fontSize: 11, color: V.t2, width: 220, zIndex: 200,
            lineHeight: 1.5, boxShadow: "0 4px 16px rgba(0,0,0,0.6)",
          }}
        >
          {cfg.tip}
          {mode === "DEMO" && (
            <span style={{ display: "block", marginTop: 4, color: V.violet, fontWeight: 600 }}>
              Click to configure API key →
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── API KEY GATE — presence indicator, never renders the key ─────────────────────
function ApiKeyGate({ hasKey, onSet, onClear, onClose }) {
  const [draft, setDraft] = useState("");
  const [err, setErr]     = useState("");
  const inputRef           = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSet = () => {
    const trimmed = draft.trim();
    if (!trimmed.startsWith("sk-ant-")) {
      setErr("Key must start with sk-ant-. Check for copy/paste whitespace.");
      return;
    }
    if (trimmed.length < 40) {
      setErr("Key appears too short. Verify you copied the full key.");
      return;
    }
    setErr("");
    setDraft("");          // clear draft immediately after passing to parent
    onSet(trimmed);        // key lives in parent state only
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 300, padding: 20,
    }}
      role="dialog" aria-modal="true" aria-label="Configure API key"
    >
      <div style={card({ maxWidth: 420, width: "100%", boxShadow: "0 8px 32px rgba(0,0,0,0.7)" })}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: V.t1 }}>Configure API key</div>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: V.t4, padding: 4 }}>
            <i className="ph ph-x" style={{ fontSize: 16 }} aria-hidden="true" />
          </button>
        </div>

        {hasKey ? (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: V.greenBg, border: `1px solid ${V.green}44`, borderRadius: 7, marginBottom: 12 }}>
              <i className="ph ph-check-circle" style={{ color: V.green }} aria-hidden="true" />
              <span style={{ fontSize: 12, color: V.green, fontWeight: 600 }}>API key configured</span>
            </div>
            <p style={{ fontSize: 11, color: V.t3, marginBottom: 12 }}>
              Key is held in session memory only — it clears on page refresh. The value is never displayed, logged, or stored.
            </p>
            <button onClick={onClear} style={btnStyle(V.red, V.redBg, { width: "100%", justifyContent: "center" })} aria-label="Clear API key">
              <i className="ph ph-trash" aria-hidden="true" /> Clear key and switch to DEMO mode
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 11, color: V.t3, marginBottom: 12, lineHeight: 1.6 }}>
              Paste your Anthropic API key. It is held in React state for this session only — never logged, never stored.
            </p>
            <label htmlFor="api-key-input" style={{ fontSize: 10, color: V.t4, display: "block", marginBottom: 4 }}>
              Anthropic API key (sk-ant-…)
            </label>
            <input
              id="api-key-input"
              ref={inputRef}
              type="password"
              value={draft}
              onChange={e => { setDraft(e.target.value); setErr(""); }}
              onKeyDown={e => e.key === "Enter" && handleSet()}
              placeholder="sk-ant-api03-…"
              style={inp({ marginBottom: 8, fontFamily: "monospace" })}
              autoComplete="off"
              spellCheck={false}
            />
            {err && <div style={{ fontSize: 11, color: V.red, marginBottom: 8 }} role="alert">{err}</div>}
            <button
              onClick={handleSet}
              disabled={!draft.trim()}
              style={btnStyle(V.violet, "rgba(168,85,247,0.12)", { width: "100%", justifyContent: "center", opacity: draft.trim() ? 1 : 0.5 })}
              aria-label="Activate API key and switch to LIVE mode"
            >
              <i className="ph ph-lightning" aria-hidden="true" /> Activate — switch to LIVE mode
            </button>
          </>
        )}

        <p style={{ marginTop: 12, fontSize: 10, color: V.t4, lineHeight: 1.6 }}>
          Get a key at console.anthropic.com. Requires claude-sonnet-4-6 access.
        </p>
      </div>
    </div>
  );
}

// ─── MODE FALLBACK BANNER ─────────────────────────────────────────────────────────
function ModeFallbackBanner({ reason, onConfigure }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div
      role="alert"
      style={{
        background: V.amberBg, border: `1px solid ${V.amber}44`,
        borderRadius: 8, padding: "8px 14px", marginBottom: 12,
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
      }}
    >
      <i className="ph ph-warning" style={{ color: V.amber, flexShrink: 0 }} aria-hidden="true" />
      <span style={{ flex: 1, fontSize: 11, color: V.amber }}>
        <strong>Switched to MOCK mode</strong> — {reason}. AI features show demo responses.
      </span>
      <button onClick={onConfigure} style={btnStyle(V.amber, "rgba(245,158,11,0.12)", { flexShrink: 0 })}>
        <i className="ph ph-gear" aria-hidden="true" /> Reconfigure
      </button>
      <button onClick={() => setDismissed(true)} aria-label="Dismiss" style={{ background: "none", border: "none", cursor: "pointer", color: V.t4, padding: 2 }}>
        <i className="ph ph-x" style={{ fontSize: 14 }} aria-hidden="true" />
      </button>
    </div>
  );
}

// ─── VERSION LABEL ────────────────────────────────────────────────────────────────
function VersionLabel() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(`v${CONFIG.version}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      aria-label={`Version ${CONFIG.version}. Click to copy.`}
      style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: 10, color: V.t4, fontFamily: "inherit",
        padding: "2px 4px", borderRadius: 4,
        transition: "color 150ms",
      }}
    >
      {copied ? "copied" : `v${CONFIG.version}`}
    </button>
  );
}

// ─── EXPORT GENERATOR ────────────────────────────────────────────────────────────
function genCleanup(apps, getMeta, projectName) {
  const lines = [`# ${projectName} — Cleanup Action List`, `Generated: ${new Date().toLocaleDateString()}`, ""];
  Object.entries(DECISIONS).forEach(([d, cfg]) => {
    const list = apps.filter(a => getMeta(a.id).decision === d);
    if (!list.length) return;
    lines.push(`## ${cfg.label.toUpperCase()} (${list.length})`);
    list.forEach(a => {
      const m = getMeta(a.id);
      lines.push(`- **${a.dn}** [${a.p}/${a.s}]${m.priority ? ` · ${m.priority}` : ""}${m.migration ? " · MIGRATE" : ""}`);
      if (m.notes) lines.push(`  > ${m.notes}`);
      if (a.url) lines.push(`  ${a.url}`);
    });
    lines.push("");
  });
  const und = apps.filter(a => !getMeta(a.id).decision);
  if (und.length) { lines.push(`## UNDECIDED (${und.length})`); und.forEach(a => lines.push(`- ${a.dn}`)); }
  return lines.join("\n");
}

function genSprintBacklog(apps, getMeta, projectName) {
  const scored = [...apps].filter(a => getMeta(a.id).wsjf).sort((a, b) => (getMeta(b.id).wsjf || 0) - (getMeta(a.id).wsjf || 0));
  const lines = [
    `# ${projectName} — Sprint Backlog`, `Generated: ${new Date().toLocaleDateString()}`, "",
    "| # | App | Platform | Priority | WSJF | Decision | Migrate |",
    "|---|-----|----------|----------|------|----------|---------|",
  ];
  scored.forEach((a, i) => {
    const m = getMeta(a.id);
    lines.push(`| ${i + 1} | ${a.dn} | ${a.p} | ${m.priority || "—"} | ${m.wsjf || "—"} | ${m.decision || "—"} | ${m.migration ? "Yes" : "No"} |`);
  });
  return lines.join("\n");
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────────
export default function AppOpsCenter() {
  // ── Security: API key in state only. Never logged. Never rendered. ──────────────
  const [apiKey,     setApiKey]     = useState("");
  const [hasKey,     setHasKey]     = useState(false);

  // ── Mode system ─────────────────────────────────────────────────────────────────
  const [mode,       setMode]       = useState("DEMO");   // LIVE | MOCK | DEMO
  const [fallbackReason, setFallbackReason] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);

  // ── Environment ─────────────────────────────────────────────────────────────────
  const [clientMode, setClientMode] = useState(false);
  const [viewport,   setViewport]   = useState("desktop");

  // ── App state ───────────────────────────────────────────────────────────────────
  const [project,    setProject]    = useState({ name: "My Portfolio", description: "", lanePreset: "ff" });
  const [lanes,      setLanes]      = useState(FF_LANES);
  const [apps,       setApps]       = useState([]);
  const [meta,       setMeta]       = useState({});
  const [tab,        setTab]        = useState("dashboard");
  const [filters,    setFilters]    = useState({ platform: "all", lane: "all", status: "all", decision: "all", q: "" });
  const [modal,      setModal]      = useState(null);
  const [loading,    setLoading]    = useState({});
  const [saved,      setSaved]      = useState(false);
  const [importText, setImportText] = useState("");
  const [importErr,  setImportErr]  = useState("");
  const [addForm,    setAddForm]    = useState({ n: "", dn: "", p: "other", l: "active", url: "", s: "active", v: "", e: "" });
  const [sprintPlan, setSprintPlan] = useState("");
  const [copied,     setCopied]     = useState(false);

  // ── Environment init on mount ───────────────────────────────────────────────────
  useEffect(() => {
    // Phosphor icons — regular weight
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css";
    document.head.appendChild(link);

    // Google Fonts — Geist + Instrument Serif
    const fonts = document.createElement("link");
    fonts.rel = "stylesheet";
    fonts.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap";
    document.head.appendChild(fonts);

    // Global animation keyframes
    const style = document.createElement("style");
    style.textContent = `
      @keyframes ff-spin  { to { transform: rotate(360deg); } }
      @keyframes ff-pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      * { box-sizing: border-box; }
      ::-webkit-scrollbar { width: 4px; height: 4px; }
      ::-webkit-scrollbar-track { background: ${V.s1}; }
      ::-webkit-scrollbar-thumb { background: ${V.border}; border-radius: 2px; }
    `;
    document.head.appendChild(style);

    // clientMode from URL param
    const cm = detectClientMode();
    setClientMode(cm);

    // Viewport
    const vp = detectViewport();
    setViewport(vp);
    const onResize = () => setViewport(detectViewport());
    window.addEventListener("resize", onResize);

    // Mode: DEMO until key is set (key is never in storage)
    const resolvedMode = "DEMO";

    // Log resolved environment — no sensitive values
    console.log("[AppOpsCenter] env:", {
      mode: resolvedMode,
      clientMode: cm,
      viewport: vp,
      version: CONFIG.version,
      model: CONFIG.model,
    });

    // Load persisted app/meta/project data (not the key)
    async function load() {
      try {
        const [pa, pm, pp] = await Promise.all([
          window.storage.get(CONFIG.storageKeys.apps),
          window.storage.get(CONFIG.storageKeys.meta),
          window.storage.get(CONFIG.storageKeys.project),
        ]);
        let loadedApps = false;
        if (pa)  { setApps(JSON.parse(pa.value)); loadedApps = true; }
        if (pm)  { setMeta(JSON.parse(pm.value)); }
        if (pp)  { const p = JSON.parse(pp.value); setProject(p.project); setLanes(p.lanes); }
        // If no stored apps, seed with demo data
        if (!loadedApps) { setApps(DEMO_APPS); setMeta(DEMO_META); }
      } catch {
        // Storage unavailable — fall back to demo data silently
        setApps(DEMO_APPS);
        setMeta(DEMO_META);
      }
    }
    load();

    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Key management ─────────────────────────────────────────────────────────────
  const handleSetKey = useCallback((key) => {
    // key stays in state only — [T1] session-only deliberate tradeoff
    setApiKey(key);
    setHasKey(true);
    setMode("LIVE");
    setFallbackReason("");
    // Store a boolean flag only — never the key
    window.storage.set(CONFIG.storageKeys.keyFlag, "true").catch(() => {});
  }, []);

  const handleClearKey = useCallback(() => {
    setApiKey("");
    setHasKey(false);
    setMode("DEMO");
    setFallbackReason("");
    window.storage.delete(CONFIG.storageKeys.keyFlag).catch(() => {});
  }, []);

  // When an API call fails after retries, auto-fallback to MOCK
  const handleApiFallback = useCallback((reason) => {
    setMode(prev => prev === "LIVE" ? "MOCK" : prev);
    setFallbackReason(reason || "API unreachable");
  }, []);

  // ── Storage persistence ─────────────────────────────────────────────────────────
  const persist = useCallback(async (nextApps, nextMeta, nextProj, nextLanes) => {
    try {
      await Promise.all([
        window.storage.set(CONFIG.storageKeys.apps,    JSON.stringify(nextApps    ?? apps)),
        window.storage.set(CONFIG.storageKeys.meta,    JSON.stringify(nextMeta    ?? meta)),
        window.storage.set(CONFIG.storageKeys.project, JSON.stringify({ project: nextProj ?? project, lanes: nextLanes ?? lanes })),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {
      // Storage failure is non-fatal — in-memory state is still correct
    }
  }, [apps, meta, project, lanes]);

  // ── Meta helpers ───────────────────────────────────────────────────────────────
  const getMeta = useCallback((id) =>
    meta[id] || { decision: null, priority: null, lane: Object.keys(lanes)[0], migration: false, notes: "", wsjf: null },
    [meta, lanes]);

  const updateMeta = useCallback((id, patch) => {
    setMeta(prev => {
      const next = { ...prev, [id]: { ...getMeta(id), ...patch } };
      persist(null, next);
      return next;
    });
  }, [getMeta, persist]);

  const setLoad = (id, val) => setLoading(l => ({ ...l, [id]: val }));

  // ── App CRUD ──────────────────────────────────────────────────────────────────
  const addApp = () => {
    if (!addForm.n.trim() && !addForm.dn.trim()) return;
    const id = `app-${Date.now()}`;
    const newApp = {
      id, n: addForm.n.trim() || addForm.dn.trim().toLowerCase().replace(/\s+/g, "-"),
      dn: addForm.dn.trim() || addForm.n.trim(), p: addForm.p, l: addForm.l,
      url: addForm.url || null, s: addForm.s,
      v: addForm.v ? parseInt(addForm.v) : null,
      e: addForm.e ? parseInt(addForm.e) : null, f: [],
    };
    const nextApps = [...apps, newApp];
    const nextMeta = { ...meta, [id]: getMeta(id) };
    setApps(nextApps); setMeta(nextMeta);
    persist(nextApps, nextMeta);
    setAddForm({ n: "", dn: "", p: "other", l: Object.keys(lanes)[0], url: "", s: "active", v: "", e: "" });
  };

  const removeApp = (id) => {
    const nextApps = apps.filter(a => a.id !== id);
    const nextMeta = { ...meta }; delete nextMeta[id];
    setApps(nextApps); setMeta(nextMeta);
    persist(nextApps, nextMeta);
  };

  // ── AI actions ─────────────────────────────────────────────────────────────────
  const guardLive = (action) => {
    if (!hasKey) { setShowKeyModal(true); return false; }
    return true;
  };

  const handleTriage = async (app) => {
    if (!guardLive()) return;
    setLoad(app.id + "_triage", true);
    try {
      const result = await aiTriage(app, getMeta(app.id), lanes, project.name, apiKey, handleApiFallback);
      updateMeta(app.id, { decision: result.decision, priority: result.priority, lane: result.lane, wsjf: result.wsjf, notes: result.reasoning });
    } catch (e) {
      console.error("[AppOpsCenter] Triage failed:", e.message);
      setModal({ type: "error", title: "Triage failed", content: `Could not triage "${app.dn}". ${e.message}\n\nCheck your API key and network connection, then retry.` });
    }
    setLoad(app.id + "_triage", false);
  };

  const handleBulkTriage = async () => {
    if (!guardLive()) return;
    const untriaged = apps.filter(a => !meta[a.id]?.decision);
    for (const app of untriaged.slice(0, 10)) {
      setLoad(app.id + "_triage", true);
      try {
        const result = await aiTriage(app, getMeta(app.id), lanes, project.name, apiKey, handleApiFallback);
        updateMeta(app.id, { decision: result.decision, priority: result.priority, lane: result.lane, wsjf: result.wsjf, notes: result.reasoning });
      } catch (e) {
        console.error("[AppOpsCenter] Bulk triage skipped:", app.dn, e.message);
      }
      setLoad(app.id + "_triage", false);
    }
  };

  const handleChain = async (app) => {
    if (!guardLive()) return;
    setLoad(app.id + "_chain", true);
    try {
      const chain = await aiChain(app, getMeta(app.id), lanes, project.name, apiKey, handleApiFallback);
      setModal({ type: "text", title: `Agent Chain — ${app.dn}`, content: chain });
    } catch (e) {
      console.error("[AppOpsCenter] Chain gen failed:", e.message);
      setModal({ type: "error", title: "Chain generation failed", content: `${e.message}\n\nRetry or check API status.` });
    }
    setLoad(app.id + "_chain", false);
  };

  const handleImport = async () => {
    if (!importText.trim()) return;
    if (!guardLive()) return;
    setLoad("import", true); setImportErr("");
    try {
      const parsed = await aiParseApps(importText, project.name, apiKey, handleApiFallback);
      const withIds = parsed.map((a, i) => ({ ...a, id: a.id || `imported-${Date.now()}-${i}` }));
      const nextApps = [...apps, ...withIds];
      const nextMeta = { ...meta };
      withIds.forEach(a => { if (!nextMeta[a.id]) nextMeta[a.id] = getMeta(a.id); });
      setApps(nextApps); setMeta(nextMeta);
      persist(nextApps, nextMeta);
      setImportText(""); setTab("dashboard");
    } catch (e) {
      console.error("[AppOpsCenter] Import parse failed:", e.message);
      setImportErr(`Parse failed — ${e.message}. Try a cleaner list or paste raw JSON.`);
    }
    setLoad("import", false);
  };

  const handleSprintPlan = async () => {
    if (!guardLive()) return;
    setLoad("sprint", true);
    try {
      const plan = await aiSprintPlan(apps, meta, lanes, project.name, apiKey, handleApiFallback);
      setSprintPlan(plan);
    } catch (e) {
      console.error("[AppOpsCenter] Sprint plan failed:", e.message);
      setSprintPlan(`Sprint plan failed — ${e.message}\n\nCheck API key and retry.`);
    }
    setLoad("sprint", false);
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // ── Derived state ──────────────────────────────────────────────────────────────
  const filt = useMemo(() => apps.filter(a => {
    const m = getMeta(a.id);
    if (filters.platform !== "all" && a.p !== filters.platform) return false;
    if (filters.lane     !== "all" && m.lane !== filters.lane)   return false;
    if (filters.status   !== "all" && a.s !== filters.status)    return false;
    if (filters.decision !== "all") {
      if (filters.decision === "null" && m.decision)              return false;
      if (filters.decision !== "null" && m.decision !== filters.decision) return false;
    }
    if (filters.q && !a.dn.toLowerCase().includes(filters.q.toLowerCase()) &&
        !a.n.toLowerCase().includes(filters.q.toLowerCase())) return false;
    return true;
  }), [apps, filters, meta, getMeta]);

  const stats = useMemo(() => ({
    total:   apps.length,
    decided: apps.filter(a => getMeta(a.id).decision).length,
    flagged: apps.filter(a => (a.f || []).length > 0).length,
    archived:apps.filter(a => getMeta(a.id).decision === "archive").length,
  }), [apps, meta, getMeta]);

  // ── Brand resolution (clientMode strips FF brand) ──────────────────────────────
  const brand = clientMode ? CONFIG.neutral : CONFIG.brand;

  // ── Responsive layout values ───────────────────────────────────────────────────
  const isMobile = viewport === "mobile";
  const gridCols = isMobile ? "1fr" : "1fr 1fr";

  // ── Shared input style ─────────────────────────────────────────────────────────
  const inputStyle = inp();
  const selectStyle = { ...inputStyle, cursor: "pointer" };

  // ── RENDER ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: V.s1, minHeight: "100vh", fontFamily: "'Geist', system-ui, sans-serif", color: V.t1, fontSize: 13 }}>

      {/* ── FLOATING NAV PILL — only element with blur ─────────────────────────── */}
      <nav
        aria-label="Main navigation"
        style={{
          position: "sticky", top: 0, zIndex: 100,
          display: "flex", alignItems: "center", gap: 0,
          background: "rgba(11,11,20,0.85)",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid ${V.border}`,
          padding: isMobile ? "10px 16px" : "10px 24px",
          flexWrap: isMobile ? "wrap" : "nowrap",
          gap: isMobile ? 8 : 0,
        }}
      >
        {/* Brand — stripped in clientMode */}
        {!clientMode && (
          <div style={{ fontSize: 14, fontWeight: 700, color: V.t1, marginRight: 24, fontFamily: "'Instrument Serif', Georgia, serif", letterSpacing: "-0.01em" }}>
            {brand.name}
          </div>
        )}
        {clientMode && (
          <div style={{ fontSize: 14, fontWeight: 600, color: V.t1, marginRight: 24 }}>
            {brand.name}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, flex: 1 }} role="tablist">
          {[
            { id: "dashboard", label: "Dashboard", icon: "ph-squares-four" },
            { id: "setup",     label: "Setup",     icon: "ph-sliders" },
            { id: "sprint",    label: "Sprint",     icon: "ph-lightning" },
          ].map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "5px 12px", borderRadius: 6, border: "none",
                background: tab === t.id ? `${V.violet}22` : "transparent",
                color: tab === t.id ? V.violet : V.t3,
                fontWeight: tab === t.id ? 600 : 400,
                fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                transition: "all 150ms",
              }}
            >
              <i className={`ph ${t.icon}`} style={{ fontSize: 14 }} aria-hidden="true" />
              {!isMobile && t.label}
            </button>
          ))}
        </div>

        {/* Right rail */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 12 }}>
          {saved && <span style={{ fontSize: 10, color: V.green }} aria-live="polite">saved</span>}
          {mode === "MOCK" && <ModeFallbackBanner reason={fallbackReason} onConfigure={() => setShowKeyModal(true)} />}
          <ModeBadge mode={mode} onConfigure={() => setShowKeyModal(true)} />
          <VersionLabel />
          <button
            onClick={() => setShowKeyModal(true)}
            aria-label="Configure API key"
            style={{ background: "none", border: `1px solid ${V.border}`, borderRadius: 6, cursor: "pointer", color: V.t3, padding: "4px 8px", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}
          >
            <i className="ph ph-key" style={{ fontSize: 14 }} aria-hidden="true" />
            {!isMobile && (hasKey ? "Key ✓" : "Add key")}
          </button>
        </div>
      </nav>

      {/* ── MOBILE: mode fallback banner below nav ─────────────────────────────── */}
      {mode === "MOCK" && isMobile && (
        <div style={{ padding: "8px 16px 0" }}>
          <ModeFallbackBanner reason={fallbackReason} onConfigure={() => setShowKeyModal(true)} />
        </div>
      )}

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────────── */}
      <main style={{ padding: isMobile ? "16px" : "20px 24px", maxWidth: 1200, margin: "0 auto" }}>

        {/* ── DASHBOARD TAB ──────────────────────────────────────────────────── */}
        {tab === "dashboard" && (
          <PanelErrorBoundary>
            <>
              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
                {[
                  { label: "Total apps",  value: stats.total,    color: V.t1 },
                  { label: "Decided",     value: `${stats.decided}/${stats.total}`, color: stats.decided === stats.total ? V.green : V.amber },
                  { label: "Flagged",     value: stats.flagged,  color: stats.flagged > 0 ? V.red : V.green },
                  { label: "To archive",  value: stats.archived, color: stats.archived > 0 ? V.magenta : V.t3 },
                ].map(s => (
                  <div key={s.label} style={card()}>
                    <div style={{ fontSize: 10, color: V.t4, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "'Geist Mono', monospace" }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div style={card({ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", padding: "10px 14px" })}>
                <i className="ph ph-funnel" style={{ color: V.t4, fontSize: 14 }} aria-hidden="true" />
                <input
                  value={filters.q}
                  onChange={e => setFilters(f => ({ ...f, q: e.target.value }))}
                  placeholder="Search apps…"
                  style={{ ...inputStyle, width: isMobile ? "100%" : 160 }}
                  aria-label="Search apps by name"
                />
                {[
                  { key: "platform", label: "Platform", opts: [["all","All platforms"],...Object.entries(PLATFORMS).map(([k,v])=>[k,v.label])] },
                  { key: "lane",     label: "Lane",     opts: [["all","All lanes"],...Object.entries(lanes).map(([k,v])=>[k,v.label])] },
                  { key: "status",   label: "Status",   opts: [["all","All statuses"],["prod","prod"],["active","active"],["parked","parked"],["zombie","zombie"]] },
                  { key: "decision", label: "Decision", opts: [["all","All decisions"],["null","Undecided"],...Object.entries(DECISIONS).map(([k,v])=>[k,v.label])] },
                ].map(f => (
                  <select
                    key={f.key}
                    value={filters[f.key]}
                    onChange={e => setFilters(ff => ({ ...ff, [f.key]: e.target.value }))}
                    style={{ ...selectStyle, width: isMobile ? "calc(50% - 4px)" : 140 }}
                    aria-label={`Filter by ${f.label}`}
                  >
                    {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                ))}
                <button
                  onClick={handleBulkTriage}
                  disabled={!hasKey || loading.bulk}
                  style={btnStyle(V.cyan, "rgba(34,211,238,0.08)", {
                    marginLeft: "auto", opacity: hasKey ? 1 : 0.5,
                  })}
                  title={hasKey ? "AI triage all undecided apps" : "Add API key to enable"}
                  aria-label="Bulk triage undecided apps with AI"
                >
                  {loading.bulk ? <Spinner /> : <i className="ph ph-robot" style={{ fontSize: 14 }} aria-hidden="true" />}
                  {!isMobile && "Bulk triage"}
                </button>
                <button
                  onClick={() => setModal({ type: "legend", title: "Badge & Label Legend" })}
                  style={btnStyle(V.t4, "transparent", { padding: "5px 8px" })}
                  aria-label="Show badge and label legend"
                  title="What do all these badges mean?"
                >
                  <i className="ph ph-question" style={{ fontSize: 14 }} aria-hidden="true" />
                </button>
              </div>

              {/* App list — empty state */}
              {filt.length === 0 && (
                <div style={card({ textAlign: "center", padding: "48px 20px", borderStyle: "dashed", borderColor: V.violet + "44" })}>
                  <i className="ph ph-squares-four" style={{ fontSize: 40, color: V.t4, display: "block", margin: "0 auto 12px" }} aria-hidden="true" />
                  <div style={{ color: V.t2, fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
                    {apps.length === 0 ? "No apps yet" : "No apps match this filter"}
                  </div>
                  <div style={{ color: V.t4, fontSize: 12, marginBottom: 16 }}>
                    {apps.length === 0
                      ? "Add apps manually or use AI import in Setup"
                      : "Clear a filter to see more results"}
                  </div>
                  {apps.length === 0 && (
                    <button onClick={() => setTab("setup")} style={btnStyle(V.violet, "rgba(168,85,247,0.10)")}>
                      Go to Setup <i className="ph ph-arrow-right" aria-hidden="true" />
                    </button>
                  )}
                  {apps.length > 0 && (
                    <button onClick={() => setFilters({ platform:"all",lane:"all",status:"all",decision:"all",q:"" })}
                      style={btnStyle(V.t3, "rgba(138,138,150,0.10)")} aria-label="Clear all filters">
                      Clear filters
                    </button>
                  )}
                </div>
              )}

              {/* App cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filt.map(a => {
                  const m = getMeta(a.id);
                  const dc = DECISIONS[m.decision];
                  const lc = lanes[m.lane];
                  const pc = PRIORITIES[m.priority];
                  const isLoadingTriage = loading[a.id + "_triage"];
                  const isLoadingChain  = loading[a.id + "_chain"];
                  return (
                    <PanelErrorBoundary key={a.id}>
                      <div style={card({ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 10, alignItems: isMobile ? "flex-start" : "center" })}>
                        {/* Identity */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 600, fontSize: 13, color: V.t1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: isMobile ? "100%" : 200 }}>{a.dn}</span>
                          </div>
                          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-start", marginBottom: 4 }}>
                            <PillGroup label="Platform" icon="ph-stack" compact>
                              <Pill
                                label={PLATFORMS[a.p]?.label || a.p}
                                color={PLATFORMS[a.p]?.color || V.t3}
                                bg={`${PLATFORMS[a.p]?.color || V.t3}18`}
                                category="Platform"
                                tooltip={`Hosting platform for ${a.dn}`}
                              />
                            </PillGroup>
                            <PillGroup label="Status" icon="ph-circle-half" compact>
                              <Pill
                                label={a.s}
                                color={STATUS_COLOR[a.s] || V.t4}
                                bg={`${STATUS_COLOR[a.s] || V.t4}18`}
                                category="Status"
                                tooltip={STATUS_TOOLTIPS[a.s] || "Status unknown"}
                              />
                            </PillGroup>
                            {(a.f || []).length > 0 && (
                              <PillGroup label="Flags" icon="ph-warning" compact>
                                {(a.f || []).map(f => (
                                  <Pill
                                    key={f}
                                    label={f}
                                    color={V.red}
                                    bg={V.redBg}
                                    category="Flag"
                                    tooltip={FLAG_TOOLTIPS[f] || `Issue: ${f}`}
                                  />
                                ))}
                              </PillGroup>
                            )}
                          </div>
                          {a.url && (
                            <a href={a.url} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: V.t4, display: "flex", alignItems: "center", gap: 3 }} aria-label={`Open ${a.dn} in new tab`}>
                              <i className="ph ph-arrow-square-out" style={{ fontSize: 11 }} aria-hidden="true" />
                              {a.url.replace(/^https?:\/\//, "").slice(0, 40)}
                            </a>
                          )}
                        </div>

                        {/* Lane + Decision + Priority — grouped with labels */}
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-start" }}>
                          {lc && (
                            <PillGroup label="Lane" icon="ph-path" compact>
                              <Pill
                                label={lc.label}
                                color={lc.color}
                                bg={lc.bg}
                                category="Lane"
                                tooltip="Which portfolio lane this app belongs to"
                              />
                            </PillGroup>
                          )}
                          {dc && (
                            <PillGroup label="Decision" icon="ph-check-square" compact>
                              <Pill
                                label={dc.label}
                                color={dc.color}
                                bg={dc.bg}
                                category="Decision"
                                tooltip={
                                  m.decision === "keep"        ? "Retain and continue investing in this app" :
                                  m.decision === "archive"     ? "Shut down and archive — no further investment" :
                                  m.decision === "migrate"     ? "Migrate to a new stack (Next.js 15 + Supabase + Vercel)" :
                                  m.decision === "investigate" ? "Needs further review before a decision can be made" :
                                  "Decision pending"
                                }
                              />
                            </PillGroup>
                          )}
                          {pc && m.priority && (
                            <PillGroup label="Priority" icon="ph-flag" compact>
                              <Pill
                                label={m.priority}
                                color={pc.color}
                                bg={pc.bg}
                                category="Priority"
                                tooltip={
                                  m.priority === "P0" ? "Critical — act immediately" :
                                  m.priority === "P1" ? "High — next sprint" :
                                  m.priority === "P2" ? "Medium — this quarter" :
                                  "Low — backlog"
                                }
                              />
                            </PillGroup>
                          )}
                          {m.wsjf && (
                            <PillGroup label="WSJF" icon="ph-chart-bar" compact>
                              <span
                                title={`WSJF score: ${m.wsjf}/21 — higher = higher priority. Weighted Shortest Job First: (business value + time criticality + risk) ÷ job size.`}
                                style={{ fontSize: 11, color: V.violet, fontFamily: "monospace", fontWeight: 700, cursor: "default" }}
                              >
                                {m.wsjf}
                              </span>
                            </PillGroup>
                          )}
                          {m.migration && (
                            <PillGroup label="Migration" icon="ph-arrows-merge" compact>
                              <Pill
                                label="MIGRATE"
                                color={V.cyan}
                                bg="rgba(34,211,238,0.10)"
                                category="Migration"
                                tooltip="Scheduled for migration to Next.js 15 + Supabase + Vercel"
                              />
                            </PillGroup>
                          )}
                        </div>

                        {/* Inline decision editor */}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                          <select
                            value={m.decision || ""}
                            onChange={e => updateMeta(a.id, { decision: e.target.value || null })}
                            style={{ ...selectStyle, width: 110, fontSize: 11 }}
                            aria-label={`Decision for ${a.dn}`}
                          >
                            <option value="">— decide —</option>
                            {Object.entries(DECISIONS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                          </select>
                          <select
                            value={m.priority || ""}
                            onChange={e => updateMeta(a.id, { priority: e.target.value || null })}
                            style={{ ...selectStyle, width: 72, fontSize: 11 }}
                            aria-label={`Priority for ${a.dn}`}
                          >
                            <option value="">—</option>
                            {Object.keys(PRIORITIES).map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                          <button
                            onClick={() => handleTriage(a)}
                            disabled={isLoadingTriage}
                            style={btnStyle(V.violet, "rgba(168,85,247,0.08)", { padding: "4px 10px" })}
                            title={hasKey ? "AI triage this app" : "Add API key to enable AI triage"}
                            aria-label={`AI triage ${a.dn}`}
                          >
                            {isLoadingTriage ? <Spinner /> : <i className="ph ph-robot" style={{ fontSize: 13 }} aria-hidden="true" />}
                          </button>
                          <button
                            onClick={() => handleChain(a)}
                            disabled={isLoadingChain}
                            style={btnStyle(V.cyan, "rgba(34,211,238,0.08)", { padding: "4px 10px" })}
                            title={hasKey ? "Generate agent chain" : "Add API key to enable"}
                            aria-label={`Generate agent chain for ${a.dn}`}
                          >
                            {isLoadingChain ? <Spinner /> : <i className="ph ph-code" style={{ fontSize: 13 }} aria-hidden="true" />}
                          </button>
                          <button
                            onClick={() => updateMeta(a.id, { migration: !m.migration })}
                            style={btnStyle(m.migration ? V.cyan : V.t4, m.migration ? "rgba(34,211,238,0.10)" : "transparent", { padding: "4px 10px" })}
                            aria-label={`Toggle migration flag for ${a.dn}. Currently: ${m.migration ? "on" : "off"}`}
                            aria-pressed={m.migration}
                          >
                            <i className="ph ph-arrows-merge" style={{ fontSize: 13 }} aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => removeApp(a.id)}
                            style={btnStyle(V.t4, "transparent", { padding: "4px 8px" })}
                            aria-label={`Remove ${a.dn} from portfolio`}
                          >
                            <i className="ph ph-trash" style={{ fontSize: 13 }} aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {/* Notes row */}
                      {(m.notes || true) && (
                        <div style={{ marginTop: -6, paddingLeft: 16, paddingBottom: 6 }}>
                          <input
                            value={m.notes || ""}
                            onChange={e => updateMeta(a.id, { notes: e.target.value })}
                            placeholder="Notes…"
                            style={{ ...inputStyle, fontSize: 11, padding: "4px 8px", width: isMobile ? "100%" : 400, color: V.t3 }}
                            aria-label={`Notes for ${a.dn}`}
                          />
                        </div>
                      )}
                    </PanelErrorBoundary>
                  );
                })}
              </div>

              {/* Export row */}
              {apps.length > 0 && (
                <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                  <button onClick={() => copy(genCleanup(apps, getMeta, project.name))} style={btnStyle(V.violet, "rgba(168,85,247,0.10)")} aria-label="Copy cleanup action list to clipboard">
                    <i className="ph ph-clipboard-text" aria-hidden="true" /> {copied ? "Copied!" : "Copy cleanup list"}
                  </button>
                  <button onClick={() => copy(genSprintBacklog(apps, getMeta, project.name))} style={btnStyle(V.cyan, "rgba(34,211,238,0.10)")} aria-label="Copy sprint backlog table to clipboard">
                    <i className="ph ph-table" aria-hidden="true" /> Copy sprint backlog
                  </button>
                  <button
                    onClick={() => { setApps(DEMO_APPS); setMeta(DEMO_META); persist(DEMO_APPS, DEMO_META); }}
                    style={btnStyle(V.t4, "transparent")}
                    aria-label="Reset to demo data"
                  >
                    <i className="ph ph-arrow-counter-clockwise" aria-hidden="true" /> Reset to demo
                  </button>
                </div>
              )}
            </>
          </PanelErrorBoundary>
        )}

        {/* ── SETUP TAB ──────────────────────────────────────────────────────── */}
        {tab === "setup" && (
          <PanelErrorBoundary>
            <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: 14 }}>
              {/* Project config */}
              <div style={card({ gridColumn: "1 / -1" })}>
                <div style={{ fontSize: 12, fontWeight: 600, color: V.t2, marginBottom: 12, display: "flex", gap: 6, alignItems: "center" }}>
                  <i className="ph ph-gear" style={{ color: V.violet }} aria-hidden="true" /> Project Config
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
                  <div>
                    <label htmlFor="project-name" style={{ fontSize: 10, color: V.t4, display: "block", marginBottom: 4 }}>Project name</label>
                    <input id="project-name" value={project.name} onChange={e => { const p = { ...project, name: e.target.value }; setProject(p); persist(null, null, p); }} style={inputStyle} placeholder="My Portfolio" />
                  </div>
                  <div>
                    <label htmlFor="project-desc" style={{ fontSize: 10, color: V.t4, display: "block", marginBottom: 4 }}>Description</label>
                    <input id="project-desc" value={project.description} onChange={e => setProject(p => ({ ...p, description: e.target.value }))} style={inputStyle} placeholder="Optional description" />
                  </div>
                  <div>
                    <label htmlFor="lane-preset" style={{ fontSize: 10, color: V.t4, display: "block", marginBottom: 4 }}>Lane preset</label>
                    <select id="lane-preset" style={selectStyle} value={project.lanePreset} onChange={e => {
                      const preset = e.target.value;
                      const nextLanes = preset === "ff" ? FF_LANES : DEFAULT_LANES;
                      const p = { ...project, lanePreset: preset };
                      setProject(p); setLanes(nextLanes); persist(null, null, p, nextLanes);
                    }}>
                      <option value="ff">FlashFusion (FF/CC/AFS/INT/Exp/Park)</option>
                      <option value="default">Generic (Core/Active/Exp/Park)</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {Object.values(lanes).map(l => <Pill key={l.label} label={l.label} color={l.color} bg={l.bg} />)}
                </div>
              </div>

              {/* Manual add */}
              <div style={card()}>
                <div style={{ fontSize: 12, fontWeight: 600, color: V.t2, marginBottom: 12, display: "flex", gap: 6, alignItems: "center" }}>
                  <i className="ph ph-plus-circle" style={{ color: V.violet }} aria-hidden="true" /> Add App Manually
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                  {[
                    { id: "add-dn", label: "Display name*", key: "dn", placeholder: "My App" },
                    { id: "add-n",  label: "Slug (auto)",   key: "n",  placeholder: "my-app" },
                  ].map(f => (
                    <div key={f.key}>
                      <label htmlFor={f.id} style={{ fontSize: 10, color: V.t4, display: "block", marginBottom: 3 }}>{f.label}</label>
                      <input id={f.id} value={addForm[f.key]} onChange={e => setAddForm(ff => ({ ...ff, [f.key]: e.target.value }))} style={inputStyle} placeholder={f.placeholder} />
                    </div>
                  ))}
                  {[
                    { id: "add-p", label: "Platform", key: "p", opts: Object.entries(PLATFORMS).map(([k,v])=>[k,v.label]) },
                    { id: "add-s", label: "Status",   key: "s", opts: [["prod","prod"],["active","active"],["parked","parked"],["zombie","zombie"]] },
                    { id: "add-l", label: "Lane",     key: "l", opts: Object.entries(lanes).map(([k,v])=>[k,v.label]) },
                  ].map(f => (
                    <div key={f.key}>
                      <label htmlFor={f.id} style={{ fontSize: 10, color: V.t4, display: "block", marginBottom: 3 }}>{f.label}</label>
                      <select id={f.id} style={selectStyle} value={addForm[f.key]} onChange={e => setAddForm(ff => ({ ...ff, [f.key]: e.target.value }))}>
                        {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                  ))}
                  <div>
                    <label htmlFor="add-url" style={{ fontSize: 10, color: V.t4, display: "block", marginBottom: 3 }}>URL</label>
                    <input id="add-url" value={addForm.url} onChange={e => setAddForm(ff => ({ ...ff, url: e.target.value }))} style={inputStyle} placeholder="https://…" />
                  </div>
                  <div>
                    <label htmlFor="add-v" style={{ fontSize: 10, color: V.t4, display: "block", marginBottom: 3 }}>Visitors/30d</label>
                    <input id="add-v" type="number" value={addForm.v} onChange={e => setAddForm(ff => ({ ...ff, v: e.target.value }))} style={inputStyle} placeholder="—" min="0" />
                  </div>
                </div>
                <button onClick={addApp} disabled={!addForm.dn.trim() && !addForm.n.trim()} style={btnStyle(V.violet, "rgba(168,85,247,0.10)", { width: "100%", justifyContent: "center" })} aria-label="Add app to portfolio">
                  <i className="ph ph-plus" aria-hidden="true" /> Add App
                </button>
              </div>

              {/* AI Bulk Import */}
              <div style={card()}>
                <div style={{ fontSize: 12, fontWeight: 600, color: V.cyan, marginBottom: 4, display: "flex", gap: 6, alignItems: "center" }}>
                  <i className="ph ph-cpu" aria-hidden="true" /> AI Bulk Import
                </div>
                <div style={{ fontSize: 11, color: V.t4, marginBottom: 10 }}>
                  Paste anything — app names, JSON, spreadsheet dump, URLs. Claude parses it.
                  {!hasKey && <span style={{ color: V.amber }}> Requires API key.</span>}
                </div>
                <textarea
                  value={importText}
                  onChange={e => setImportText(e.target.value)}
                  placeholder={"audit — consulting platform, Base44, production\ncortex-ff — AI second brain, Lovable, 13 visitors\n…"}
                  style={{ ...inputStyle, height: 120, resize: "vertical", fontFamily: "monospace", fontSize: 11, lineHeight: 1.6, marginBottom: 8 }}
                  aria-label="Paste app list for AI import"
                />
                {importErr && <div style={{ fontSize: 11, color: V.red, marginBottom: 8 }} role="alert">{importErr}</div>}
                <button
                  onClick={handleImport}
                  disabled={!!loading.import || !importText.trim() || !hasKey}
                  style={btnStyle(V.cyan, "rgba(34,211,238,0.08)", {
                    width: "100%", justifyContent: "center",
                    opacity: (!importText.trim() || !hasKey) ? 0.5 : 1,
                  })}
                  aria-label={hasKey ? "Parse and import apps with AI" : "Add API key to enable AI import"}
                >
                  {loading.import ? <><Spinner /> Parsing…</> : <><i className="ph ph-cpu" aria-hidden="true" /> AI Parse & Import</>}
                </button>
              </div>

              {/* Loaded apps mini-list */}
              {apps.length > 0 && (
                <div style={card({ gridColumn: "1 / -1", maxHeight: 280, overflow: "hidden", display: "flex", flexDirection: "column" })}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: V.t2, marginBottom: 10 }}>Loaded Apps ({apps.length})</div>
                  <div style={{ overflowY: "auto", flex: 1 }} role="list" aria-label="Loaded apps">
                    {apps.map(a => (
                      <div key={a.id} role="listitem" style={{ display: "flex", gap: 8, alignItems: "center", padding: "5px 0", borderBottom: `1px solid ${V.border}33`, fontSize: 11 }}>
                        <span style={{ flex: 1, color: V.t1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.dn}</span>
                        <Pill
                          label={PLATFORMS[a.p]?.label || a.p}
                          color={PLATFORMS[a.p]?.color || V.t3}
                          bg={`${PLATFORMS[a.p]?.color || V.t3}18`}
                          category="Platform"
                          tooltip={`Hosting platform for ${a.dn}`}
                        />
                        <Pill
                          label={a.s}
                          color={STATUS_COLOR[a.s] || V.t4}
                          bg={`${STATUS_COLOR[a.s] || V.t4}18`}
                          category="Status"
                          tooltip={STATUS_TOOLTIPS[a.s] || "Status unknown"}
                        />
                        {a.url && <a href={a.url} target="_blank" rel="noreferrer" style={{ color: V.t4 }} aria-label={`Open ${a.dn}`}><i className="ph ph-arrow-square-out" style={{ fontSize: 11 }} aria-hidden="true" /></a>}
                        <button onClick={() => removeApp(a.id)} style={{ color: V.t4, background: "none", border: "none", cursor: "pointer", padding: "2px 4px" }} aria-label={`Remove ${a.dn}`}>
                          <i className="ph ph-x" style={{ fontSize: 11 }} aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                    <button onClick={() => setTab("dashboard")} style={btnStyle(V.violet, "rgba(168,85,247,0.10)", { flex: 1, justifyContent: "center" })}>
                      Go to Dashboard <i className="ph ph-arrow-right" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => { if (window.confirm("Clear all apps? This cannot be undone.")) { setApps([]); setMeta({}); persist([], {}); } }}
                      style={btnStyle(V.red, V.redBg)}
                      aria-label="Clear all apps"
                    >
                      <i className="ph ph-trash" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </PanelErrorBoundary>
        )}

        {/* ── SPRINT TAB ─────────────────────────────────────────────────────── */}
        {tab === "sprint" && (
          <PanelErrorBoundary>
            <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: 14 }}>
              <div style={card({ gridColumn: "1 / -1" })}>
                <div style={{ fontSize: 12, fontWeight: 600, color: V.t2, marginBottom: 4, display: "flex", gap: 6, alignItems: "center" }}>
                  <i className="ph ph-lightning" style={{ color: V.amber }} aria-hidden="true" /> Sprint Planner
                </div>
                <p style={{ fontSize: 11, color: V.t4, marginBottom: 12 }}>
                  AI ranks the top 5 highest-leverage items across your portfolio using WSJF and decision state.
                  {!hasKey && <span style={{ color: V.amber }}> Requires API key.</span>}
                </p>
                <button
                  onClick={handleSprintPlan}
                  disabled={!!loading.sprint || !hasKey || apps.length === 0}
                  style={btnStyle(V.amber, "rgba(245,158,11,0.10)", {
                    marginBottom: 14,
                    opacity: (!hasKey || apps.length === 0) ? 0.5 : 1,
                  })}
                  aria-label="Generate AI sprint plan"
                >
                  {loading.sprint ? <><Spinner /> Planning…</> : <><i className="ph ph-lightning" aria-hidden="true" /> Generate Sprint Plan</>}
                </button>

                {apps.length === 0 && (
                  <div style={{ color: V.t4, fontSize: 11 }}>Add apps in Setup to generate a sprint plan.</div>
                )}

                {sprintPlan && (
                  <div style={{ background: V.s3, borderRadius: 8, padding: "14px 16px", fontSize: 12, color: V.t2, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
                    {sprintPlan}
                  </div>
                )}
                {sprintPlan && (
                  <button onClick={() => copy(sprintPlan)} style={btnStyle(V.violet, "rgba(168,85,247,0.10)", { marginTop: 10 })} aria-label="Copy sprint plan to clipboard">
                    <i className="ph ph-copy" aria-hidden="true" /> {copied ? "Copied!" : "Copy plan"}
                  </button>
                )}
              </div>

              {/* WSJF Leaderboard */}
              <div style={card({ gridColumn: "1 / -1" })}>
                <div style={{ fontSize: 12, fontWeight: 600, color: V.t2, marginBottom: 12 }}>WSJF Leaderboard</div>
                {apps.filter(a => getMeta(a.id).wsjf).length === 0 ? (
                  <div style={{ color: V.t4, fontSize: 11 }}>No WSJF scores yet. Run AI triage on apps to generate scores.</div>
                ) : (
                  <div role="list" aria-label="WSJF ranked apps">
                    {[...apps].filter(a => getMeta(a.id).wsjf).sort((a, b) => (getMeta(b.id).wsjf || 0) - (getMeta(a.id).wsjf || 0)).map((a, i) => {
                      const m = getMeta(a.id);
                      const dc = DECISIONS[m.decision];
                      const maxW = 21;
                      return (
                        <div key={a.id} role="listitem" style={{ display: "flex", gap: 10, alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${V.border}33` }}>
                          <span style={{ fontSize: 10, color: V.t4, width: 18, textAlign: "right", fontFamily: "monospace", flexShrink: 0 }}>{i + 1}</span>
                          <span style={{ flex: 1, fontSize: 12, color: V.t1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.dn}</span>
                          <div style={{ width: isMobile ? 60 : 100, height: 4, background: V.s3, borderRadius: 2, flexShrink: 0 }}>
                            <div style={{ width: `${(m.wsjf / maxW) * 100}%`, height: "100%", background: V.violet, borderRadius: 2, transition: "width 300ms" }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: V.violet, fontFamily: "monospace", width: 20, textAlign: "right", flexShrink: 0 }}>{m.wsjf}</span>
                          {dc && (
                            <Pill
                              label={dc.label}
                              color={dc.color}
                              bg={dc.bg}
                              category="Decision"
                              tooltip={
                                m.decision === "keep"        ? "Retain and continue investing" :
                                m.decision === "archive"     ? "Shut down and archive" :
                                m.decision === "migrate"     ? "Migrate to new stack" :
                                m.decision === "investigate" ? "Needs further review" :
                                ""
                              }
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </PanelErrorBoundary>
        )}
      </main>

      {/* ── API KEY MODAL ─────────────────────────────────────────────────────── */}
      {showKeyModal && (
        <ApiKeyGate
          hasKey={hasKey}
          onSet={handleSetKey}
          onClear={handleClearKey}
          onClose={() => setShowKeyModal(false)}
        />
      )}

      {/* ── GENERIC MODAL (text / error) ──────────────────────────────────────── */}
      {modal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 20 }}
          role="dialog"
          aria-modal="true"
          aria-label={modal.title}
          onClick={e => { if (e.target === e.currentTarget) setModal(null); }}
        >
          <div style={card({ maxWidth: modal.type === "legend" ? 620 : 560, width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 32px rgba(0,0,0,0.7)" })}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: modal.type === "error" ? V.red : V.t1, display: "flex", gap: 6, alignItems: "center" }}>
                {modal.type === "error"  && <i className="ph ph-warning"  style={{ color: V.red }}    aria-hidden="true" />}
                {modal.type === "legend" && <i className="ph ph-question" style={{ color: V.violet }} aria-hidden="true" />}
                {modal.title}
              </div>
              <button onClick={() => setModal(null)} aria-label="Close dialog" style={{ background: "none", border: "none", cursor: "pointer", color: V.t4, padding: 4 }}>
                <i className="ph ph-x" style={{ fontSize: 16 }} aria-hidden="true" />
              </button>
            </div>

            {modal.type === "legend" ? (
              <div style={{ overflowY: "auto", flex: 1 }}>
                {[
                  {
                    heading: "Platform",
                    icon: "ph-stack",
                    desc: "Where the app is hosted or built.",
                    rows: Object.entries(PLATFORMS).map(([k, v]) => ({ label: v.label, color: v.color, bg: `${v.color}18`, tip: `Platform key: ${k}` })),
                  },
                  {
                    heading: "Status",
                    icon: "ph-circle-half",
                    desc: "Current lifecycle state of the app.",
                    rows: [
                      { label: "prod",    color: V.violet, bg: `${V.violet}18`, tip: STATUS_TOOLTIPS.prod },
                      { label: "active",  color: V.green,  bg: V.greenBg,       tip: STATUS_TOOLTIPS.active },
                      { label: "parked",  color: V.t4,     bg: "rgba(74,74,88,0.18)", tip: STATUS_TOOLTIPS.parked },
                      { label: "zombie",  color: V.red,    bg: V.redBg,         tip: STATUS_TOOLTIPS.zombie },
                    ],
                  },
                  {
                    heading: "Decision",
                    icon: "ph-check-square",
                    desc: "What you've decided to do with this app.",
                    rows: Object.entries(DECISIONS).map(([k, v]) => ({
                      label: v.label, color: v.color, bg: v.bg,
                      tip: k === "keep" ? "Retain and invest" : k === "archive" ? "Shut down, no further work" : k === "migrate" ? "Move to Next.js 15 + Supabase + Vercel" : "Needs investigation before deciding",
                    })),
                  },
                  {
                    heading: "Priority",
                    icon: "ph-flag",
                    desc: "Action urgency. Set manually or by AI triage.",
                    rows: [
                      { label: "P0", color: V.red,    bg: "rgba(239,68,68,0.18)",   tip: "Critical — act immediately" },
                      { label: "P1", color: V.orange, bg: "rgba(251,146,60,0.18)",  tip: "High — next sprint" },
                      { label: "P2", color: V.amber,  bg: "rgba(245,158,11,0.18)",  tip: "Medium — this quarter" },
                      { label: "P3", color: V.t3,     bg: "rgba(138,138,150,0.18)", tip: "Low — backlog" },
                    ],
                  },
                  {
                    heading: "Flags",
                    icon: "ph-warning",
                    desc: "Issues or special conditions attached to an app.",
                    rows: Object.entries(FLAG_TOOLTIPS).map(([k, tip]) => ({ label: k, color: V.red, bg: V.redBg, tip })),
                  },
                  {
                    heading: "WSJF Score",
                    icon: "ph-chart-bar",
                    desc: "Weighted Shortest Job First (1–21). Higher = prioritize sooner. Calculated as (business value + time criticality + risk reduction) ÷ job size. Generated by AI triage.",
                    rows: [],
                  },
                ].map(section => (
                  <div key={section.heading} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <i className={`ph ${section.icon}`} style={{ color: V.violet, fontSize: 14 }} aria-hidden="true" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: V.t1 }}>{section.heading}</span>
                    </div>
                    {section.desc && <p style={{ fontSize: 11, color: V.t3, marginBottom: 8, marginLeft: 20 }}>{section.desc}</p>}
                    {section.rows.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginLeft: 20 }}>
                        {section.rows.map(r => (
                          <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Pill label={r.label} color={r.color} bg={r.bg} />
                            <span style={{ fontSize: 11, color: V.t3 }}>{r.tip}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ height: 1, background: V.border, marginTop: 14 }} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ overflowY: "auto", flex: 1, fontSize: 12, color: V.t2, whiteSpace: "pre-wrap", lineHeight: 1.7, fontFamily: "monospace", background: V.s3, borderRadius: 7, padding: 14 }}>
                {modal.content}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
              {modal.type !== "legend" && (
                <button onClick={() => copy(modal.content)} style={btnStyle(V.violet, "rgba(168,85,247,0.10)")} aria-label="Copy to clipboard">
                  <i className="ph ph-copy" aria-hidden="true" /> {copied ? "Copied!" : "Copy"}
                </button>
              )}
              <button onClick={() => setModal(null)} style={btnStyle(V.t3, "rgba(138,138,150,0.10)")} aria-label="Close">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
