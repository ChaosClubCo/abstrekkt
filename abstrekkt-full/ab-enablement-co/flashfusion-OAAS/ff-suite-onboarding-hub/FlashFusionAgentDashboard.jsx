import { useState, useReducer, useRef, useEffect, useMemo, useCallback, memo } from "react";

// ─── Keyframes + global CSS ──────────────────────────────────────────────────
const CSS_INJECTED = `
  @keyframes ff-spin-cw  { to { transform: rotate(360deg); } }
  @keyframes ff-spin-ccw { to { transform: rotate(-360deg); } }
  @keyframes ff-pulse-dot { 0%,100%{opacity:1} 50%{opacity:.35} }
  @media (prefers-reduced-motion: reduce) {
    .ff-spin-cw, .ff-spin-ccw, .ff-pulse-dot { animation: none !important; }
  }
  .ff-spin-cw  { animation: ff-spin-cw  18s linear infinite; }
  .ff-spin-ccw { animation: ff-spin-ccw 12s linear infinite; }
  .ff-pulse-dot { animation: ff-pulse-dot 2s ease-in-out infinite; }
  .ff-card { transition: transform .15s ease, border-color .15s ease; }
  .ff-card:hover { transform: translateY(-4px); }
  .ff-chevron { transition: transform .15s ease; }
  .ff-card:hover .ff-chevron { transform: translateX(4px); color: #fff; }
  .ff-progress { transition: width .7s cubic-bezier(.4,0,.2,1); }
  .ff-focus:focus-visible { outline: 2px solid rgba(103,232,249,.65); outline-offset: 3px; border-radius: 12px; }
  .ff-run-btn:disabled { cursor: not-allowed; }
  .ff-main-grid { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: start; }
  @media (min-width: 1024px) { .ff-main-grid { grid-template-columns: 1fr 420px; } }
  .ff-cards-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
  @media (min-width: 680px) { .ff-cards-grid { grid-template-columns: repeat(2, 1fr); } }
  * , *::before, *::after { box-sizing: border-box; }
`;

// ─── Constants ───────────────────────────────────────────────────────────────

/** @type {Record<string, string>} */
const ICONS = {
  activity: "◌", alert: "!", arrow: "→", brain: "◇", check: "✓",
  chevron: "›", code: "</>", cpu: "⌘", database: "▣", gauge: "◷",
  git: "⑂", layers: "▦", lock: "⌾", memory: "▧", play: "▶",
  refresh: "↻", search: "⌕", server: "▤", shield: "⬡", sparkles: "✦",
  terminal: "▹", workflow: "∞", zap: "⚡", flask: "⬡", x: "✕",
};

/**
 * @typedef {'idle'|'running'|'success'|'error'} AgentStatus
 * @typedef {'orchestration'|'memory'|'security'|'deployment'|'generation'} AgentCategory
 * @typedef {{
 *   id: string, title: string, subtitle: string,
 *   category: AgentCategory, status: AgentStatus,
 *   progress: number, latency: string, cost: string,
 *   endpoint: string, stack: string[], imageHint: string,
 *   logs: string[], persistentlyPaused: boolean
 * }} Agent
 */

/** @type {Record<AgentStatus, { label: string, badge: React.CSSProperties, dot: React.CSSProperties }>} */
const STATUS_META = {
  idle: {
    label: "Idle",
    badge: { background: "rgb(39,39,42)", color: "rgb(228,228,231)", border: "1px solid rgb(63,63,70)" },
    dot:   { background: "rgb(161,161,170)" },
  },
  running: {
    label: "Running",
    badge: { background: "rgba(8,51,68,.7)", color: "rgb(165,243,252)", border: "1px solid rgba(8,145,178,.6)" },
    dot:   { background: "rgb(103,232,249)" },
  },
  success: {
    label: "Healthy",
    badge: { background: "rgba(6,46,37,.7)", color: "rgb(167,243,208)", border: "1px solid rgba(16,185,129,.6)" },
    dot:   { background: "rgb(110,231,183)" },
  },
  error: {
    label: "Attention",
    badge: { background: "rgba(47,6,6,.7)", color: "rgb(253,164,175)", border: "1px solid rgba(244,63,94,.6)" },
    dot:   { background: "rgb(251,113,133)" },
  },
};

/** @type {Record<AgentCategory, { label: string, icon: string, glow: string, accentColor: string }>} */
const CATEGORY_META = {
  orchestration: {
    label: "Orchestration", icon: "workflow", accentColor: "rgb(253,186,116)",
    glow: "linear-gradient(135deg,rgba(249,115,22,.3),rgba(217,70,239,.2),rgba(6,182,212,.2))",
  },
  memory: {
    label: "Memory", icon: "brain", accentColor: "rgb(216,180,254)",
    glow: "linear-gradient(135deg,rgba(139,92,246,.3),rgba(6,182,212,.2),rgba(59,130,246,.2))",
  },
  security: {
    label: "Security", icon: "shield", accentColor: "rgb(110,231,183)",
    glow: "linear-gradient(135deg,rgba(16,185,129,.25),rgba(6,182,212,.2),rgba(113,113,122,.1))",
  },
  deployment: {
    label: "Deployment", icon: "server", accentColor: "rgb(103,232,249)",
    glow: "linear-gradient(135deg,rgba(6,182,212,.3),rgba(59,130,246,.2),rgba(249,115,22,.1))",
  },
  generation: {
    label: "Generation", icon: "sparkles", accentColor: "rgb(240,171,252)",
    glow: "linear-gradient(135deg,rgba(217,70,239,.3),rgba(249,115,22,.2),rgba(234,179,8,.1))",
  },
};

// ─── Seed data ───────────────────────────────────────────────────────────────

/** @type {Agent[]} */
const SEED_AGENTS = [
  {
    id: "orchestrator-core", category: "orchestration", status: "running",
    progress: 72, latency: "183ms", cost: "$0.18", persistentlyPaused: false,
    title: "Agent Orchestration Core",
    subtitle: "Routes work across specialized agents with fallback logic.",
    endpoint: "/api/agents/orchestrator/run",
    stack: ["LangGraph", "Supabase", "Queue"],
    imageHint: "Orange portal / central command core",
    logs: ["Intent classified: build_request", "Planner agent selected Feature-to-PR lane", "Security preflight passed", "Awaiting execution confirmation"],
  },
  {
    id: "persistent-memory", category: "memory", status: "success",
    progress: 94, latency: "96ms", cost: "$0.04", persistentlyPaused: false,
    title: "Persistent Context Layer",
    subtitle: "Stores durable user, project, and workflow context safely.",
    endpoint: "/api/memory/query",
    stack: ["pgvector", "RLS", "Embeddings"],
    imageHint: "Blue-violet memory cathedral",
    logs: ["Project scope embedded", "Duplicate context collapsed", "RLS policy checked", "Memory shard ready"],
  },
  {
    id: "security-guardian", category: "security", status: "idle",
    progress: 41, latency: "211ms", cost: "$0.02", persistentlyPaused: false,
    title: "Security Guardian",
    subtitle: "Scans prompts, secrets, repo changes, and execution boundaries.",
    endpoint: "/api/security/scan",
    stack: ["Zod", "RLS", "Audit Logs"],
    imageHint: "Green shield in dark command chamber",
    logs: ["Secret redaction enabled", "Rate limit policy loaded", "Abuse checks armed", "No active incidents"],
  },
  {
    id: "deployment-agent", category: "deployment", status: "error",
    progress: 33, latency: "—", cost: "$0.00", persistentlyPaused: true,
    title: "Deploy + Rollback Agent",
    subtitle: "Ships builds with checkpoints, smoke tests, and rollback paths.",
    endpoint: "/api/deploy/run",
    stack: ["Vercel", "GitHub", "CI"],
    imageHint: "Cyan server ring with warning beacon",
    logs: ["Build artifact missing: .env.example", "Rollback checkpoint exists", "Deployment paused safely", "Action required: run environment doctor"],
  },
  {
    id: "template-generator", category: "generation", status: "idle",
    progress: 64, latency: "147ms", cost: "$0.09", persistentlyPaused: false,
    title: "Universal Template Generator",
    subtitle: "Creates app templates, prompts, PRDs, and UI systems from a brief.",
    endpoint: "/api/generate/template",
    stack: ["Next.js", "Claude", "Artifacts"],
    imageHint: "Magenta-orange forge of interface cards",
    logs: ["Template families indexed", "Design tokens loaded", "Prompt compiler ready", "Awaiting user brief"],
  },
];

// ─── Reducer ─────────────────────────────────────────────────────────────────

const AGENT_ACTIONS = Object.freeze({ RUN_START: "RUN_START", RUN_COMPLETE: "RUN_COMPLETE" });

/**
 * @param {Agent[]} state
 * @param {{ type: string, agentId: string, nowLabel?: string }} action
 * @returns {Agent[]}
 */
function agentsReducer(state, action) {
  switch (action.type) {
    case AGENT_ACTIONS.RUN_START:
      return state.map((a) => a.id === action.agentId ? getAgentAfterRun(a, action.nowLabel) : a);
    case AGENT_ACTIONS.RUN_COMPLETE:
      return state.map((a) => a.id === action.agentId ? getAgentAfterCompletion(a) : a);
    default: return state;
  }
}

// ─── Pure functions ───────────────────────────────────────────────────────────

/** @param {unknown} v @returns {number} */
function clampProgress(v) {
  const n = Number.isFinite(Number(v)) ? Number(v) : 0;
  return Math.max(0, Math.min(n, 100));
}

/** @param {Agent} agent @param {string} [nowLabel] @returns {Agent} */
function getAgentAfterRun(agent, nowLabel = "now") {
  return {
    ...agent,
    status: "running",
    progress: Math.min(97, clampProgress(agent.progress) + 11),
    logs: [`Manual execution started at ${nowLabel}`, ...(agent.logs ?? []).slice(0, 4)],
  };
}

/** @param {Agent} agent @returns {Agent} */
function getAgentAfterCompletion(agent) {
  if (agent.persistentlyPaused) {
    return {
      ...agent, status: "error",
      progress: Math.min(38, clampProgress(agent.progress)),
      logs: ["Execution stopped safely: missing environment contract", "Rollback checkpoint preserved", ...(agent.logs ?? []).slice(0, 3)],
    };
  }
  return {
    ...agent, status: "success", progress: 100,
    logs: ["Execution completed successfully", "Audit log written", "Output artifact generated", ...(agent.logs ?? []).slice(0, 2)],
  };
}

/** @param {Agent[]} agents @param {string} query @param {string} filter @returns {Agent[]} */
function filterAgents(agents, query, filter) {
  if (!Array.isArray(agents)) return [];
  const q = String(query ?? "").trim().toLowerCase();
  const f = String(filter ?? "all");
  return agents.filter((a) => {
    const hay = `${a.title ?? ""} ${a.subtitle ?? ""} ${(a.stack ?? []).join(" ")}`.toLowerCase();
    return (!q || hay.includes(q)) && (f === "all" || a.category === f || a.status === f);
  });
}

/** @param {Agent[]} agents @returns {{ running: number, healthy: number, attention: number, avgProgress: number }} */
function getDashboardCounts(agents) {
  if (!Array.isArray(agents) || agents.length === 0) return { running: 0, healthy: 0, attention: 0, avgProgress: 0 };
  return {
    running:     agents.filter((a) => a.status === "running").length,
    healthy:     agents.filter((a) => a.status === "success").length,
    attention:   agents.filter((a) => a.status === "error").length,
    avgProgress: Math.round(agents.reduce((s, a) => s + clampProgress(a.progress), 0) / agents.length),
  };
}

// ─── Test suite ───────────────────────────────────────────────────────────────

/** @returns {{ name: string, passed: boolean, error: string|null }[]} */
function runTestSuite() {
  const results = [];
  function test(name, fn) {
    try { results.push({ name, passed: Boolean(fn()), error: null }); }
    catch (e) { results.push({ name, passed: false, error: e.message }); }
  }

  test("5 seed agents defined",                  () => SEED_AGENTS.length === 5);
  test("clampProgress: 120 → 100",               () => clampProgress(120) === 100);
  test("clampProgress: -10 → 0",                 () => clampProgress(-10) === 0);
  test("clampProgress: NaN → 0",                 () => clampProgress(NaN) === 0);

  const ran = getAgentAfterRun(SEED_AGENTS[0], "t0");
  test("getAgentAfterRun: status = running",      () => ran.status === "running");
  test("getAgentAfterRun: log contains label",    () => ran.logs[0].includes("t0"));
  test("getAgentAfterRun: progress ≤ 97",         () => ran.progress <= 97);

  const ok = getAgentAfterCompletion(SEED_AGENTS[0]);
  test("getAgentAfterCompletion: success",        () => ok.status === "success");
  test("getAgentAfterCompletion: progress = 100", () => ok.progress === 100);

  const dep = SEED_AGENTS.find((a) => a.id === "deployment-agent");
  const paused = getAgentAfterCompletion(dep);
  test("persistentlyPaused: error status",        () => paused.status === "error");
  test("persistentlyPaused: progress ≤ 38",       () => paused.progress <= 38);

  const pgMatch = filterAgents(SEED_AGENTS, "pgvector", "all");
  test("filterAgents: stack value match",         () => pgMatch.length === 1 && pgMatch[0].id === "persistent-memory");
  const errMatch = filterAgents(SEED_AGENTS, "", "error");
  test("filterAgents: status=error filter",       () => errMatch.length === 1 && errMatch[0].id === "deployment-agent");
  test("filterAgents: null input → []",           () => filterAgents(null, "", "all").length === 0);

  const c = getDashboardCounts(SEED_AGENTS);
  test("getDashboardCounts: running = 1",         () => c.running === 1);
  test("getDashboardCounts: healthy = 1",         () => c.healthy === 1);
  test("getDashboardCounts: attention = 1",       () => c.attention === 1);

  const z = getDashboardCounts([]);
  test("getDashboardCounts: empty → all zeros",   () => z.running === 0 && z.avgProgress === 0);

  return results;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useReducedMotion() {
  const [pref, setPref] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const h = (e) => setPref(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return pref;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * @param {{ name: string, style?: React.CSSProperties, label?: string, className?: string }} props
 */
const Glyph = memo(function Glyph({ name, style, label, className = "" }) {
  return (
    <span
      aria-hidden={label ? undefined : "true"}
      aria-label={label}
      role={label ? "img" : undefined}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
               fontWeight: 900, lineHeight: 1, userSelect: "none", ...style }}
    >
      {ICONS[name] ?? "•"}
    </span>
  );
});

/** @param {{ status: AgentStatus }} props */
const StatusBadge = memo(function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.idle;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 9999,
                   padding: "4px 12px", fontSize: 12, fontWeight: 500, flexShrink: 0, ...m.badge }}>
      <span aria-hidden="true" className={status === "running" ? "ff-pulse-dot" : ""}
            style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, ...m.dot }} />
      {m.label}
    </span>
  );
});

/** @param {{ value: number }} props */
const ProgressBar = memo(function ProgressBar({ value }) {
  const v = clampProgress(value);
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={v}
         aria-label={`Progress: ${v}%`}
         style={{ height: 8, borderRadius: 9999, overflow: "hidden", background: "rgb(39,39,42)" }}>
      <div className="ff-progress"
           style={{ height: "100%", borderRadius: 9999, width: `${v}%`,
                    background: "linear-gradient(to right,rgb(103,232,249),rgb(240,171,252),rgb(253,186,116))" }} />
    </div>
  );
});

/** @param {{ agent: Agent, large?: boolean }} props */
const AgentVisual = memo(function AgentVisual({ agent, large = false }) {
  const m = CATEGORY_META[agent.category] ?? CATEGORY_META.orchestration;
  const reduced = useReducedMotion();
  const ringBase = { position: "absolute", borderRadius: "50%", flexShrink: 0 };
  return (
    <div aria-hidden="true"
         style={{ position: "relative", overflow: "hidden", borderRadius: 16,
                  border: "1px solid rgba(255,255,255,.1)", background: "#050507",
                  height: large ? 288 : 176 }}>
      <div style={{ position: "absolute", inset: 0, background: m.glow }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.4,
                    background: "radial-gradient(circle at 20% 10%,rgba(255,255,255,.2),transparent 24%)," +
                                "radial-gradient(circle at 80% 20%,rgba(255,255,255,.14),transparent 22%)" }} />
      <div className={reduced ? "" : "ff-spin-cw"}
           style={{ ...ringBase, width: 160, height: 160, left: "50%", top: "50%",
                    marginLeft: -80, marginTop: -80, border: "1px solid rgba(255,255,255,.15)" }} />
      <div className={reduced ? "" : "ff-spin-ccw"}
           style={{ ...ringBase, width: 112, height: 112, left: "50%", top: "50%",
                    marginLeft: -56, marginTop: -56, border: "1px solid rgba(253,186,116,.3)" }} />
      <div style={{ ...ringBase, width: 56, height: 56, left: "50%", top: "50%",
                    marginLeft: -28, marginTop: -28,
                    border: "1px solid rgba(103,232,249,.3)", background: "rgba(0,0,0,.3)" }} />
      <div style={{ position: "absolute", inset: "auto 0 0 0", height: 96,
                    background: "linear-gradient(to top,rgba(0,0,0,.8),transparent)" }} />
      <div style={{ position: "absolute", left: 20, top: 20, display: "inline-flex", alignItems: "center",
                    gap: 8, borderRadius: 9999, border: "1px solid rgba(255,255,255,.1)",
                    background: "rgba(0,0,0,.4)", padding: "4px 12px", fontSize: 12,
                    color: "rgba(255,255,255,.8)", backdropFilter: "blur(8px)" }}>
        <Glyph name={m.icon} style={{ color: "rgb(103,232,249)", fontSize: 12 }} />
        {m.label}
      </div>
      <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8,
                      fontSize: 12, color: "rgb(212,212,216)", marginBottom: 8 }}>
          <Glyph name="sparkles" style={{ color: "rgb(253,186,116)", fontSize: 12 }} />
          {agent.imageHint}
        </div>
        <div style={{ height: 1, background: "linear-gradient(to right,transparent,rgba(255,255,255,.3),transparent)" }} />
      </div>
    </div>
  );
});

/**
 * @param {{ agent: Agent, selected: boolean,
 *   onSelect: (a: Agent) => void, onRun: (id: string) => void }} props
 */
const AgentCard = memo(function AgentCard({ agent, selected, onSelect, onRun }) {
  const isRunning = agent.status === "running";
  const statusLabel = STATUS_META[agent.status]?.label ?? "Unknown";
  return (
    <article className="ff-card"
             aria-label={`${agent.title} — ${statusLabel}`}
             style={{ borderRadius: 24, border: `1px solid ${selected ? "rgba(103,232,249,.6)" : "rgba(255,255,255,.1)"}`,
                      background: "rgba(9,9,11,.8)", padding: 12, cursor: "default",
                      boxShadow: "0 25px 50px -12px rgba(0,0,0,.5)" }}>
      <button type="button" onClick={() => onSelect(agent)}
              aria-label={`View details for ${agent.title}`}
              style={{ display: "block", width: "100%", background: "none", border: "none",
                       cursor: "pointer", padding: 0 }}>
        <AgentVisual agent={agent} />
      </button>
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 16 }}>
        <button type="button" onClick={() => onSelect(agent)}
                className="ff-focus"
                style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                         gap: 16, textAlign: "left", background: "none", border: "none",
                         cursor: "pointer", padding: 0, width: "100%" }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-.02em",
                         color: "#fff", margin: 0 }}>{agent.title}</h3>
            <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6, color: "rgb(161,161,170)", margin: "8px 0 0" }}>
              {agent.subtitle}
            </p>
          </div>
          <Glyph name="chevron" className="ff-chevron"
                 style={{ color: "rgb(113,113,122)", marginTop: 4, flexShrink: 0 }} />
        </button>
        <div role="list" aria-label="Technology stack"
             style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {(agent.stack ?? []).map((item) => (
            <span key={item} role="listitem"
                  style={{ borderRadius: 9999, border: "1px solid rgba(255,255,255,.1)",
                           background: "rgba(255,255,255,.03)", padding: "4px 10px",
                           fontSize: 12, color: "rgb(212,212,216)" }}>
              {item}
            </span>
          ))}
        </div>
        <ProgressBar value={agent.progress} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <StatusBadge status={agent.status} />
          <button type="button" onClick={() => onRun(agent.id)} disabled={isRunning}
                  className="ff-run-btn ff-focus"
                  aria-label={isRunning ? `${agent.title} is already running` : `Run ${agent.title}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8,
                           borderRadius: 9999, padding: "6px 12px", fontSize: 12, fontWeight: 600,
                           background: isRunning ? "rgb(63,63,70)" : "#fff",
                           color: isRunning ? "rgb(161,161,170)" : "rgb(9,9,11)",
                           border: "none", cursor: isRunning ? "not-allowed" : "pointer",
                           transition: "background .15s ease" }}>
            <Glyph name="play" style={{ fontSize: 10 }} />
            {isRunning ? "Running…" : "Run"}
          </button>
        </div>
      </div>
    </article>
  );
});

/** @param {{ icon: string, label: string, value: string|number }} props */
const Metric = memo(function Metric({ icon, label, value }) {
  return (
    <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.1)",
                  background: "rgba(255,255,255,.03)", padding: 12 }}>
      <Glyph name={icon} aria-hidden="true" style={{ color: "rgb(113,113,122)", display: "block", marginBottom: 12 }} />
      <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{value}</div>
      <div style={{ fontSize: 12, color: "rgb(113,113,122)" }}>{label}</div>
    </div>
  );
});

/** @param {{ agent: Agent, onRun: (id: string) => void }} props */
const DetailPanel = memo(function DetailPanel({ agent, onRun }) {
  const m = CATEGORY_META[agent.category] ?? CATEGORY_META.orchestration;
  const isRunning = agent.status === "running";
  return (
    <aside aria-label={`Detail panel: ${agent.title}`}
           style={{ borderRadius: 24, border: "1px solid rgba(255,255,255,.1)",
                    background: "rgba(9,9,11,.9)", padding: 20 }}>
      <AgentVisual agent={agent} large />
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: m.accentColor, marginBottom: 8 }}>{m.label}</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-.02em", color: "#fff", margin: 0 }}>{agent.title}</h2>
            <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6, color: "rgb(161,161,170)", margin: "8px 0 0" }}>
              {agent.subtitle}
            </p>
          </div>
          <StatusBadge status={agent.status} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          <Metric icon="gauge"    label="Progress" value={`${clampProgress(agent.progress)}%`} />
          <Metric icon="zap"      label="Latency"  value={agent.latency} />
          <Metric icon="database" label="Cost"     value={agent.cost} />
        </div>
        <section aria-label="Execution log"
                 style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.1)",
                          background: "rgba(0,0,0,.3)", padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                        gap: 12, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8,
                          fontSize: 14, fontWeight: 600, color: "#fff" }}>
              <Glyph name="terminal" aria-hidden="true" style={{ color: "rgb(103,232,249)" }} />
              Live execution log
            </div>
            <code style={{ fontSize: 11, color: "rgb(113,113,122)", overflow: "hidden",
                           textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>
              {agent.endpoint}
            </code>
          </div>
          <ol style={{ listStyle: "none", padding: 0, margin: 0,
                       display: "flex", flexDirection: "column", gap: 8,
                       maxHeight: 200, overflowY: "auto" }}>
            {(agent.logs ?? []).map((log, i) => (
              <li key={`${agent.id}-log-${i}`}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12,
                           borderRadius: 12, background: "rgba(255,255,255,.03)",
                           padding: "8px 12px", fontSize: 14, color: "rgb(212,212,216)" }}>
                <span aria-hidden="true"
                      style={{ width: 6, height: 6, borderRadius: "50%", background: "rgb(103,232,249)",
                               flexShrink: 0, marginTop: 6 }} />
                {log}
              </li>
            ))}
          </ol>
        </section>
        <div style={{ display: "flex", gap: 12 }}>
          <button type="button" onClick={() => onRun(agent.id)} disabled={isRunning}
                  className="ff-run-btn ff-focus"
                  aria-label={isRunning ? "Agent is already running" : `Execute ${agent.title}`}
                  style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center",
                           gap: 8, borderRadius: 16, padding: "12px 16px", fontSize: 14, fontWeight: 700,
                           background: isRunning ? "rgb(63,63,70)" : "#fff",
                           color: isRunning ? "rgb(161,161,170)" : "rgb(9,9,11)",
                           border: "none", cursor: isRunning ? "not-allowed" : "pointer",
                           transition: "background .15s ease" }}>
            <Glyph name="play" aria-hidden="true" />
            {isRunning ? "Running…" : "Execute Agent"}
          </button>
          <button type="button" className="ff-focus"
                  aria-label="Chain this agent"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                           borderRadius: 16, border: "1px solid rgba(255,255,255,.1)",
                           background: "rgba(255,255,255,.03)", padding: "12px 16px",
                           fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
            <Glyph name="git" aria-hidden="true" /> Chain
          </button>
        </div>
      </div>
    </aside>
  );
});

/** @param {{ icon: string, label: string, value: string|number, helper: string }} props */
const TopStat = memo(function TopStat({ icon, label, value, helper }) {
  const lid = `stat-${String(label).replace(/\s+/g, "-")}`;
  return (
    <div style={{ borderRadius: 24, border: "1px solid rgba(255,255,255,.1)",
                  background: "rgba(9,9,11,.7)", padding: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div id={lid} style={{ fontSize: 14, color: "rgb(113,113,122)" }}>{label}</div>
          <div aria-labelledby={lid} style={{ marginTop: 4, fontSize: 24, fontWeight: 700, color: "#fff" }}>{value}</div>
        </div>
        <div aria-hidden="true"
             style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.1)",
                      background: "rgba(255,255,255,.04)", padding: 8, color: "rgb(103,232,249)" }}>
          <Glyph name={icon} />
        </div>
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: "rgb(113,113,122)" }}>{helper}</div>
    </div>
  );
});

/** @param {{ active: boolean, onClick: () => void, label: string }} props */
const FilterPill = memo(function FilterPill({ active, onClick, label }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className="ff-focus"
            style={{ borderRadius: 9999,
                     border: `1px solid ${active ? "rgba(103,232,249,.6)" : "rgba(255,255,255,.1)"}`,
                     background: active ? "rgba(103,232,249,.1)" : "rgba(255,255,255,.03)",
                     color: active ? "rgb(207,250,254)" : "rgb(161,161,170)",
                     padding: "8px 12px", fontSize: 14, fontWeight: 500, cursor: "pointer",
                     transition: "all .15s ease" }}>
      {label}
    </button>
  );
});

/** @param {{ icon: string, title: string, body: string }} props */
const ContractCard = memo(function ContractCard({ icon, title, body }) {
  return (
    <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.1)",
                  background: "rgba(255,255,255,.03)", padding: 16 }}>
      <Glyph name={icon} aria-hidden="true"
             style={{ color: "rgb(103,232,249)", display: "block", marginBottom: 16 }} />
      <h3 style={{ fontWeight: 600, color: "#fff", margin: "0 0 8px", fontSize: 16 }}>{title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgb(161,161,170)", margin: 0 }}>{body}</p>
    </div>
  );
});

/** @param {{ onClose: () => void }} props */
function DiagnosticsPanel({ onClose }) {
  const results = useMemo(() => runTestSuite(), []);
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  return (
    <div role="dialog" aria-label="Test suite results"
         style={{ borderRadius: 24, border: "1px solid rgba(255,255,255,.1)",
                  background: "rgba(9,9,11,.95)", padding: 20, marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Glyph name="flask" style={{ color: "rgb(103,232,249)" }} />
          <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Test Suite</span>
          <span style={{ borderRadius: 9999, background: "rgba(16,185,129,.2)",
                         border: "1px solid rgba(16,185,129,.5)", padding: "2px 10px",
                         fontSize: 12, color: "rgb(110,231,183)" }}>
            {passed} passed
          </span>
          {failed > 0 && (
            <span style={{ borderRadius: 9999, background: "rgba(239,68,68,.2)",
                           border: "1px solid rgba(239,68,68,.5)", padding: "2px 10px",
                           fontSize: 12, color: "rgb(252,165,165)" }}>
              {failed} failed
            </span>
          )}
        </div>
        <button type="button" onClick={onClose} aria-label="Close diagnostics"
                style={{ background: "none", border: "none", cursor: "pointer",
                         color: "rgb(113,113,122)", fontSize: 18, lineHeight: 1, padding: 4 }}>
          {ICONS.x}
        </button>
      </div>
      <ol style={{ listStyle: "none", padding: 0, margin: 0,
                   display: "flex", flexDirection: "column", gap: 6,
                   maxHeight: 360, overflowY: "auto" }}>
        {results.map((r, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: 12,
                               borderRadius: 12, background: "rgba(255,255,255,.03)",
                               padding: "8px 12px", fontSize: 13 }}>
            <span aria-hidden="true" style={{ color: r.passed ? "rgb(110,231,183)" : "rgb(252,165,165)", flexShrink: 0 }}>
              {r.passed ? ICONS.check : ICONS.alert}
            </span>
            <span style={{ color: r.passed ? "rgb(212,212,216)" : "rgb(252,165,165)" }}>{r.name}</span>
            {r.error && (
              <span style={{ fontSize: 11, color: "rgba(252,165,165,.7)", marginLeft: "auto", flexShrink: 0 }}>{r.error}</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function FlashFusionAgentDashboard() {
  const [agents, dispatch] = useReducer(agentsReducer, SEED_AGENTS);
  const [selectedId, setSelectedId] = useState(SEED_AGENTS[0].id);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Timer registry — prevents double-trigger and leaks on unmount
  const timerRef = useRef(/** @type {Map<string, ReturnType<typeof setTimeout>>} */ (new Map()));
  // Stable agents ref for use inside stable callbacks
  const agentsRef = useRef(agents);
  useEffect(() => { agentsRef.current = agents; }, [agents]);

  // Cleanup all pending timers on unmount
  useEffect(() => {
    const t = timerRef.current;
    return () => { t.forEach(clearTimeout); t.clear(); };
  }, []);

  const selectedAgent = useMemo(
    () => agents.find((a) => a.id === selectedId) ?? (agents.length > 0 ? agents[0] : null),
    [agents, selectedId]
  );
  const filteredAgents = useMemo(() => filterAgents(agents, query, filter), [agents, query, filter]);
  const counts        = useMemo(() => getDashboardCounts(agents), [agents]);

  const runAgent = useCallback((/** @type {string} */ agentId) => {
    const target = agentsRef.current.find((a) => a.id === agentId);
    if (!target || target.status === "running") return;
    if (timerRef.current.has(agentId)) clearTimeout(timerRef.current.get(agentId));
    const nowLabel = new Date().toLocaleTimeString();
    dispatch({ type: AGENT_ACTIONS.RUN_START, agentId, nowLabel });
    const tid = setTimeout(() => {
      dispatch({ type: AGENT_ACTIONS.RUN_COMPLETE, agentId });
      timerRef.current.delete(agentId);
    }, 1200);
    timerRef.current.set(agentId, tid);
  }, []);

  const handleSelect = useCallback((/** @type {Agent} */ agent) => setSelectedId(agent.id), []);

  if (!selectedAgent) {
    return (
      <main style={{ minHeight: "100vh", background: "#050507", color: "#fff",
                     display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgb(161,161,170)" }}>No agents available.</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#050507", color: "#fff" }}>
      <style>{CSS_INJECTED}</style>

      {/* Atmospheric blobs */}
      <div aria-hidden="true"
           style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: "-20%", top: "-10%", width: 520, height: 520,
                      borderRadius: "50%", background: "rgba(249,115,22,.1)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", right: "-15%", top: "20%", width: 560, height: 560,
                      borderRadius: "50%", background: "rgba(6,182,212,.1)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "35%", width: 520, height: 520,
                      borderRadius: "50%", background: "rgba(217,70,239,.1)", filter: "blur(80px)" }} />
      </div>

      <section style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "32px 20px 80px" }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header style={{ marginBottom: 32, display: "flex", flexWrap: "wrap",
                         gap: 24, alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ maxWidth: 700, flex: "1 1 320px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 9999,
                          border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.04)",
                          padding: "4px 12px", fontSize: 14, color: "rgb(212,212,216)", marginBottom: 16 }}>
              <Glyph name="sparkles" aria-hidden="true" style={{ color: "rgb(253,186,116)" }} />
              FlashFusion Agent OS · Live Build Prototype
            </div>
            <h1 style={{ fontSize: "clamp(28px,5vw,60px)", fontWeight: 900, letterSpacing: "-.03em",
                         color: "#fff", margin: 0, lineHeight: 1.1 }}>
              Agent command center for executable AI systems.
            </h1>
            <p style={{ marginTop: 16, maxWidth: 640, fontSize: 16, lineHeight: 1.7, color: "rgb(161,161,170)" }}>
              Browse agents, inspect runtime state, trigger execution, view logs, and convert static learning cards into a real product control surface.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setShowDiagnostics((v) => !v)}
                    className="ff-focus"
                    aria-pressed={showDiagnostics}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 16,
                             border: `1px solid ${showDiagnostics ? "rgba(103,232,249,.6)" : "rgba(255,255,255,.1)"}`,
                             background: showDiagnostics ? "rgba(103,232,249,.1)" : "rgba(255,255,255,.04)",
                             color: showDiagnostics ? "rgb(207,250,254)" : "#fff",
                             padding: "12px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer",
                             transition: "all .15s ease" }}>
              <Glyph name="flask" aria-hidden="true" /> Tests
            </button>
            <button type="button" className="ff-focus"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 16,
                             border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.04)",
                             color: "#fff", padding: "12px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              <Glyph name="refresh" aria-hidden="true" /> Sync
            </button>
            <button type="button" className="ff-focus"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 16,
                             background: "#fff", color: "rgb(9,9,11)",
                             padding: "12px 16px", fontSize: 14, fontWeight: 700,
                             border: "none", cursor: "pointer" }}>
              Build Workflow <Glyph name="arrow" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* ── Diagnostics panel ──────────────────────────────────────────── */}
        {showDiagnostics && <DiagnosticsPanel onClose={() => setShowDiagnostics(false)} />}

        {/* ── Stats row ──────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                      gap: 16, marginBottom: 32 }}>
          <TopStat icon="activity" label="Running agents"  value={counts.running}           helper="Active work in progress" />
          <TopStat icon="check"    label="Healthy agents"  value={counts.healthy}            helper="Passed latest checks" />
          <TopStat icon="alert"    label="Needs attention" value={counts.attention}          helper="Paused with rollback available" />
          <TopStat icon="cpu"      label="Avg readiness"   value={`${counts.avgProgress}%`} helper="Composite capability readiness" />
        </div>

        {/* ── Search + filters ───────────────────────────────────────────── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12,
                      alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <label style={{ position: "relative", flex: "1 1 280px", maxWidth: 440 }}>
            <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden",
                           clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
              Search agents
            </span>
            <Glyph name="search" aria-hidden="true"
                   style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                            color: "rgb(113,113,122)", pointerEvents: "none", fontSize: 16 }} />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                   placeholder="Search agents, stacks, capabilities…"
                   style={{ width: "100%", borderRadius: 16, border: "1px solid rgba(255,255,255,.1)",
                            background: "rgba(9,9,11,.7)", padding: "12px 16px 12px 44px",
                            fontSize: 14, color: "#fff", outline: "none",
                            transition: "border-color .15s ease" }}
                   onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(103,232,249,.5)")}
                   onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,.1)")}
            />
          </label>
          <div role="group" aria-label="Filter agents by category or status"
               style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <FilterPill active={filter === "all"} onClick={() => setFilter("all")} label="All" />
            {Object.entries(CATEGORY_META).map(([k, m]) => (
              <FilterPill key={k} active={filter === k} onClick={() => setFilter(k)} label={m.label} />
            ))}
            <FilterPill active={filter === "error"} onClick={() => setFilter("error")} label="Attention" />
          </div>
        </div>

        {/* ── Main grid ──────────────────────────────────────────────────── */}
        <div className="ff-main-grid">
          <section aria-label="Agent cards">
            {filteredAgents.length > 0 ? (
              <div className="ff-cards-grid">
                {filteredAgents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent}
                             selected={selectedAgent.id === agent.id}
                             onSelect={handleSelect} onRun={runAgent} />
                ))}
              </div>
            ) : (
              <div style={{ borderRadius: 24, border: "1px solid rgba(255,255,255,.1)",
                            background: "rgba(9,9,11,.8)", padding: 32, color: "rgb(161,161,170)" }}>
                No agents match this search or filter combination.
              </div>
            )}
          </section>
          <div style={{ position: "sticky", top: 24 }}>
            <DetailPanel agent={selectedAgent} onRun={runAgent} />
          </div>
        </div>

        {/* ── Implementation contract ────────────────────────────────────── */}
        {!showDiagnostics && (
          <section aria-label="Implementation contract"
                   style={{ marginTop: 32, borderRadius: 24, border: "1px solid rgba(255,255,255,.1)",
                            background: "rgba(9,9,11,.7)", padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8,
                          fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#fff" }}>
              <Glyph name="layers" aria-hidden="true" style={{ color: "rgb(253,186,116)" }} />
              Implementation Contract
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
              <ContractCard icon="lock"   title="Security Gate"
                body="Every agent call requires schema validation, rate limiting, auth checks, audit logging, and secret redaction before execution." />
              <ContractCard icon="memory" title="Memory Gate"
                body="Project context is retrieved by scoped user/project IDs only. No global leakage, no cross-tenant retrieval, no raw secret persistence." />
              <ContractCard icon="code"   title="Build Gate"
                body="Generated changes produce checkpointed diffs, smoke tests, rollback metadata, and acceptance criteria before deployment." />
            </div>
          </section>
        )}

      </section>
    </main>
  );
}
