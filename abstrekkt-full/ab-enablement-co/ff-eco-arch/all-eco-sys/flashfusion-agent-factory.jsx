import { useState, useCallback, useRef, useMemo, useEffect } from "react";

// ── FlashFusion v3 Design Tokens ─────────────────────────────────────
const V = "#8B5CF6";
const VH = "#A855F7";
const MG = "#EC4899";
const CY = "#22D3EE";
const S1 = "#0B0B14";
const S2 = "#13131F";
const T1 = "#FFFFFF";
const T2 = "#C7C7D1";
const T3 = "#8A8A96";
const T4 = "#5A5A64";
const BD = "rgba(139,92,246,0.12)";
const GR = "linear-gradient(135deg, #A855F7, #EC4899, #22D3EE)";
const GR2 = "linear-gradient(135deg, #A855F7, #EC4899)";
const serif = "Georgia, 'Times New Roman', serif";
const sans = "system-ui, -apple-system, sans-serif";
const mono = "'SF Mono', 'Fira Code', 'Consolas', monospace";

// ── Styles ───────────────────────────────────────────────────────────
const card = {
  background: `${S1}cc`,
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: `1px solid ${BD}`,
  borderRadius: 14,
};
const pill = (bg, fg, brd) => ({
  padding: "10px 20px",
  borderRadius: 100,
  border: `1px solid ${brd || BD}`,
  background: bg,
  color: fg,
  fontSize: 11,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: mono,
  textTransform: "uppercase",
  letterSpacing: 0.8,
  minHeight: 44,
  lineHeight: 1,
});
const badge = (c, bg) => ({
  display: "inline-flex",
  padding: "4px 10px",
  borderRadius: 100,
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: 0.5,
  color: c,
  background: bg,
  textTransform: "uppercase",
  lineHeight: "14px",
});
const inp = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 14px",
  borderRadius: 10,
  border: `1px solid ${BD}`,
  background: "rgba(0,0,0,0.5)",
  color: T2,
  fontSize: 13,
  outline: "none",
  fontFamily: sans,
};
const mn = { fontFamily: mono, fontSize: 11, letterSpacing: -0.2 };
const lbl = { display: "block", fontSize: 10, color: T4, marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: mono };

// ── Status + Risk maps ───────────────────────────────────────────────
const ST = {
  queued: { c: T3, bg: `${T4}22`, l: "Queued" },
  running: { c: CY, bg: "rgba(6,182,212,0.15)", l: "Running" },
  waiting_approval: { c: "#fbbf24", bg: "rgba(161,98,7,0.15)", l: "Awaiting" },
  completed: { c: "#34d399", bg: "rgba(5,150,105,0.15)", l: "Complete" },
  failed: { c: "#f87171", bg: "rgba(220,38,38,0.15)", l: "Failed" },
  cancelled: { c: T4, bg: `${T4}22`, l: "Cancelled" },
};
const RK = {
  low: { c: "#34d399", bg: "rgba(5,150,105,0.15)" },
  medium: { c: "#fbbf24", bg: "rgba(161,98,7,0.15)" },
  high: { c: "#fb923c", bg: "rgba(194,65,12,0.15)" },
  critical: { c: "#f87171", bg: "rgba(220,38,38,0.15)" },
};

// ── Helpers ──────────────────────────────────────────────────────────
const fmt = (c) => "$" + (c / 100).toFixed(2);
const pct = (n, d) => (d > 0 ? Math.round((n / d) * 100) : 0);
const ago = (iso) => {
  if (!iso) return "—";
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "now";
  if (m < 60) return m + "m";
  const h = Math.floor(m / 60);
  return h < 24 ? h + "h" : Math.floor(h / 24) + "d";
};
const dur = (a, b) => {
  const s = Math.floor((new Date(b) - new Date(a)) / 1000);
  return s < 60 ? s + "s" : Math.floor(s / 60) + "m " + (s % 60) + "s";
};
const mask = (s) =>
  String(s || "")
    .replace(/sk_live_\w+/g, "sk_live_••••")
    .replace(/ghp_\w+/g, "ghp_••••")
    .replace(/AKIA\w+/g, "AKIA••••");
const shortM = (m) => (m || "").replace("claude-", "").replace("-20250514", "");
const dayK = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

// ── Seed Data ────────────────────────────────────────────────────────
const RUNS = [
  { id: "run_8a3d2f", status: "waiting_approval", input: { task: "Send Q2 campaign to 1,247 subscribers" }, cost_cents: 624, cost_ceiling_cents: 50000, model_policy: { model: "claude-opus-4-20250514" }, token_usage: { input: 12400, output: 3200 }, created_at: "2026-05-25T09:12:00Z", updated_at: "2026-05-25T09:14:22Z" },
  { id: "run_5e9c1b", status: "waiting_approval", input: { task: "Migrate user_preferences schema" }, cost_cents: 315, cost_ceiling_cents: 50000, model_policy: { model: "claude-opus-4-20250514" }, token_usage: { input: 8900, output: 2100 }, created_at: "2026-05-25T08:45:00Z", updated_at: "2026-05-25T08:47:11Z" },
  { id: "run_7f2e8d", status: "waiting_approval", input: { task: "Deploy auth hotfix to production" }, cost_cents: 189, cost_ceiling_cents: 50000, model_policy: { model: "claude-sonnet-4-20250514" }, token_usage: { input: 4200, output: 1800 }, created_at: "2026-05-25T07:30:00Z", updated_at: "2026-05-25T07:32:45Z" },
  { id: "run_c3d4e5", status: "running", input: { task: "Analyze customer churn from Stripe" }, cost_cents: 210, cost_ceiling_cents: 50000, model_policy: { model: "claude-opus-4-20250514" }, token_usage: { input: 5100, output: 1400 }, created_at: "2026-05-25T10:02:00Z", updated_at: "2026-05-25T10:02:00Z" },
  { id: "run_a1b2c3", status: "completed", input: { task: "Research Acme Inc competitive landscape" }, cost_cents: 842, cost_ceiling_cents: 50000, model_policy: { model: "claude-opus-4-20250514" }, token_usage: { input: 18200, output: 6400 }, created_at: "2026-05-24T14:20:00Z", updated_at: "2026-05-24T14:28:33Z" },
  { id: "run_d4e5f6", status: "completed", input: { task: "Generate monthly analytics report" }, cost_cents: 289, cost_ceiling_cents: 50000, model_policy: { model: "claude-sonnet-4-20250514" }, token_usage: { input: 6100, output: 3800 }, created_at: "2026-05-24T11:00:00Z", updated_at: "2026-05-24T11:04:12Z" },
  { id: "run_g7h8i9", status: "completed", input: { task: "Summarize 47 support tickets" }, cost_cents: 156, cost_ceiling_cents: 50000, model_policy: { model: "claude-sonnet-4-20250514" }, token_usage: { input: 3400, output: 2200 }, created_at: "2026-05-23T09:15:00Z", updated_at: "2026-05-23T09:17:45Z" },
  { id: "run_j1k2l3", status: "failed", input: { task: "Sync CRM contacts with Mailchimp" }, cost_cents: 78, cost_ceiling_cents: 50000, model_policy: { model: "claude-sonnet-4-20250514" }, token_usage: { input: 1200, output: 400 }, created_at: "2026-05-22T16:40:00Z", updated_at: "2026-05-22T16:41:02Z" },
  { id: "run_m4n5o6", status: "completed", input: { task: "Draft investor update email" }, cost_cents: 445, cost_ceiling_cents: 50000, model_policy: { model: "claude-opus-4-20250514" }, token_usage: { input: 9800, output: 4600 }, created_at: "2026-05-21T10:00:00Z", updated_at: "2026-05-21T10:06:18Z" },
  { id: "run_p7q8r9", status: "completed", input: { task: "Audit RLS policies" }, cost_cents: 312, cost_ceiling_cents: 50000, model_policy: { model: "claude-opus-4-20250514" }, token_usage: { input: 7200, output: 2800 }, created_at: "2026-05-20T13:30:00Z", updated_at: "2026-05-20T13:34:22Z" },
  { id: "run_s1t2u3", status: "completed", input: { task: "Refactor auth middleware" }, cost_cents: 567, cost_ceiling_cents: 50000, model_policy: { model: "claude-opus-4-20250514" }, token_usage: { input: 14100, output: 5200 }, created_at: "2026-05-20T09:00:00Z", updated_at: "2026-05-20T09:08:41Z" },
  { id: "run_v4w5x6", status: "cancelled", input: { task: "Social media content calendar" }, cost_cents: 34, cost_ceiling_cents: 50000, model_policy: { model: "claude-sonnet-4-20250514" }, token_usage: { input: 800, output: 200 }, created_at: "2026-05-19T15:20:00Z", updated_at: "2026-05-19T15:20:45Z" },
];
const TCS = [
  { id: "tc1", run_id: "run_8a3d2f", tool_name: "send_email_bulk", risk_level: "critical", input: { recipients: 1247, subject: "Q2 Launch — 50% Early Access" }, status: "pending", cost_estimate_cents: 624, created_at: "2026-05-25T09:13:00Z" },
  { id: "tc2", run_id: "run_5e9c1b", tool_name: "execute_sql_write", risk_level: "critical", input: { query: "ALTER TABLE user_preferences ADD COLUMN theme jsonb", rows_affected: 15000 }, status: "pending", cost_estimate_cents: 10, created_at: "2026-05-25T08:46:00Z" },
  { id: "tc3", run_id: "run_7f2e8d", tool_name: "deploy_vercel", risk_level: "critical", input: { environment: "production", commits: 3, lines_added: 124, tests: "92/92" }, status: "pending", cost_estimate_cents: 5, created_at: "2026-05-25T07:31:00Z" },
  { id: "tc4", run_id: "run_a1b2c3", tool_name: "web_search", risk_level: "low", input: { query: "Acme Inc competitors 2026" }, status: "completed", cost_estimate_cents: 5, created_at: "2026-05-24T14:21:00Z" },
];
const APRS = [
  { id: "ap1", run_id: "run_8a3d2f", tc_id: "tc1", status: "pending", created_at: "2026-05-25T09:13:05Z", reviewed_at: null, reviewed_by: null, reason: null },
  { id: "ap2", run_id: "run_5e9c1b", tc_id: "tc2", status: "pending", created_at: "2026-05-25T08:46:05Z", reviewed_at: null, reviewed_by: null, reason: null },
  { id: "ap3", run_id: "run_7f2e8d", tc_id: "tc3", status: "pending", created_at: "2026-05-25T07:31:05Z", reviewed_at: null, reviewed_by: null, reason: null },
];
const AUDS = [
  { id: "au1", actor: "agent", action: "tool_call.requested", target: "tc1", created_at: "2026-05-25T09:13:05Z" },
  { id: "au2", actor: "system", action: "cost_check.passed", target: "run_8a3d2f", created_at: "2026-05-25T09:12:01Z" },
  { id: "au3", actor: "agent", action: "run.completed", target: "run_a1b2c3", created_at: "2026-05-24T14:28:33Z" },
  { id: "au4", actor: "system", action: "eval.passed", target: "eval_001", created_at: "2026-05-24T14:28:30Z" },
  { id: "au5", actor: "agent", action: "run.failed", target: "run_j1k2l3", created_at: "2026-05-22T16:41:02Z" },
];
const AGENTS = [
  { id: "ag1", name: "Research Agent", desc: "Company research & analysis", autonomy: "autonomous", ceiling: 10000, runs: 8, rate: 95, tools: 2 },
  { id: "ag2", name: "Code Agent", desc: "Code review & refactoring", autonomy: "semi_autonomous", ceiling: 25000, runs: 14, rate: 88, tools: 3 },
  { id: "ag3", name: "Report Agent", desc: "Analytics & summarization", autonomy: "semi_autonomous", ceiling: 15000, runs: 6, rate: 100, tools: 2 },
  { id: "ag4", name: "Email Agent", desc: "Email drafting & campaigns", autonomy: "manual", ceiling: 50000, runs: 3, rate: 67, tools: 2 },
];

// ═════════════════════════════════════════════════════════════════════
export default function AgentFactory() {
  const [tab, setTab] = useState("dashboard");
  const [runs, setRuns] = useState(RUNS);
  const [approvals, setApprovals] = useState(APRS);
  const [tcs, setTcs] = useState(TCS);
  const [audit, setAudit] = useState(AUDS);
  const [agents, setAgents] = useState(AGENTS);
  const [toast, setToast] = useState(null);
  const [drawer, setDrawer] = useState(null);
  const [rFilter, setRFilter] = useState("all");
  const [rSearch, setRSearch] = useState("");
  const [rPage, setRPage] = useState(0);
  const [aFilter, setAFilter] = useState("pending");
  const [reasons, setReasons] = useState({});
  const [showModal, setShowModal] = useState(false);
  const tRef = useRef(null);

  const fire = useCallback((msg, type) => {
    setToast({ msg, type: type || "success" });
    clearTimeout(tRef.current);
    tRef.current = setTimeout(() => setToast(null), 4000);
  }, []);

  // Escape closes overlays
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") {
        setDrawer(null);
        setShowModal(false);
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  // ── Derived ──
  const pending = useMemo(() => approvals.filter((a) => a.status === "pending"), [approvals]);
  const now = Date.now();
  const recent = useMemo(() => runs.filter((r) => new Date(r.created_at) > now - 7 * 86400000), [runs]);
  const cost7d = recent.reduce((s, r) => s + r.cost_cents, 0);
  const doneCt = recent.filter((r) => r.status === "completed").length;
  const failCt = recent.filter((r) => r.status === "failed").length;
  const rate = pct(doneCt, doneCt + failCt);
  const liveCount = runs.filter((r) => r.status === "running").length;
  const orgCeiling = 500000;
  const cPct = pct(cost7d, orgCeiling);

  const costByDay = useMemo(() => {
    const m = {};
    for (let i = 6; i >= 0; i--) m[dayK(new Date(now - i * 86400000).toISOString())] = 0;
    recent.forEach((r) => {
      const k = dayK(r.created_at);
      if (k in m) m[k] += r.cost_cents;
    });
    return Object.entries(m).map(([day, cents]) => ({ day, cents }));
  }, [recent]);
  const maxC = Math.max(...costByDay.map((d) => d.cents), 1);

  const filteredRuns = useMemo(() => {
    return runs
      .filter((r) => rFilter === "all" || r.status === rFilter)
      .filter((r) => !rSearch || r.input.task.toLowerCase().includes(rSearch.toLowerCase()) || r.id.includes(rSearch));
  }, [runs, rFilter, rSearch]);
  const pp = 6;
  const totalPages = Math.ceil(filteredRuns.length / pp);
  const pageRuns = filteredRuns.slice(rPage * pp, (rPage + 1) * pp);
  const fAppr = useMemo(() => approvals.filter((a) => aFilter === "all" || a.status === aFilter), [approvals, aFilter]);

  // ── Actions ──
  const doApproval = useCallback(
    (id, ok, reason) => {
      const ap = approvals.find((a) => a.id === id);
      if (!ap || ap.status !== "pending") return;
      if (!ok && !(reason || "").trim()) {
        fire("Reason required when denying", "error");
        return;
      }
      const ts = new Date().toISOString();
      setApprovals((p) =>
        p.map((a) =>
          a.id === id ? { ...a, status: ok ? "approved" : "denied", reviewed_by: "kyle", reason: reason || null, reviewed_at: ts } : a
        )
      );
      const tc = tcs.find((t) => t.id === ap.tc_id);
      if (tc) {
        setTcs((p) => p.map((t) => (t.id === tc.id ? { ...t, status: ok ? "completed" : "denied" } : t)));
        setRuns((p) => p.map((r) => (r.id === ap.run_id ? { ...r, status: ok ? "completed" : "failed", updated_at: ts } : r)));
      }
      setAudit((p) => [
        { id: "au_" + Date.now(), actor: "human", action: "approval." + (ok ? "approved" : "denied"), target: id, created_at: ts },
        ...p,
      ]);
      fire(ok ? "Approved — agent proceeding" : "Denied — run halted", ok ? "success" : "warning");
    },
    [approvals, tcs, fire]
  );

  const drawerRun = drawer ? runs.find((r) => r.id === drawer) : null;
  const drawerTc = drawer ? tcs.filter((t) => t.run_id === drawer) : [];

  // ── Row component ──
  const Row = ({ children, onClick, ariaLabel }) => {
    const [hov, setHov] = useState(false);
    return (
      <tr
        tabIndex={0}
        role="button"
        aria-label={ariaLabel}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ borderBottom: "1px solid " + BD, cursor: "pointer", background: hov ? S2 + "88" : "transparent" }}
      >
        {children}
      </tr>
    );
  };

  return (
    <div style={{ maxWidth: 1060, margin: "0 auto", fontFamily: sans, color: T1, padding: "0 16px" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        *:focus-visible { outline: 2px solid ${VH}; outline-offset: 2px; border-radius: 6px; }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; } }
        button:hover { filter: brightness(1.08); }
        button:active { transform: scale(0.98); }
        ::selection { background: ${V}44; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${V}33; border-radius: 100px; }
      `}</style>

      {/* ── Toast ── */}
      {toast && (
        <div
          role="status"
          aria-live="assertive"
          style={{
            position: "fixed", top: 20, right: 20, zIndex: 1000, padding: "12px 20px", borderRadius: 12, maxWidth: 380,
            display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 500,
            background: toast.type === "error" ? "rgba(220,38,38,0.9)" : toast.type === "warning" ? "rgba(161,98,7,0.9)" : "rgba(5,150,105,0.9)",
            color: "#fff", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span aria-hidden="true">{toast.type === "error" ? "✕" : toast.type === "warning" ? "⚠" : "✓"}</span>
          <span style={{ flex: 1 }}>{toast.msg}</span>
          <button onClick={() => setToast(null)} aria-label="Dismiss" style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", opacity: 0.6, padding: 4, fontSize: 14 }}>✕</button>
        </div>
      )}

      {/* ── Cost ceiling ── */}
      {cPct >= 80 && (
        <div role="alert" style={{ ...card, padding: "12px 18px", marginBottom: 16, fontSize: 13, fontWeight: 500, background: cPct >= 100 ? "rgba(220,38,38,0.15)" : "rgba(161,98,7,0.15)", color: cPct >= 100 ? "#f87171" : "#fbbf24", borderColor: cPct >= 100 ? "rgba(220,38,38,0.3)" : "rgba(161,98,7,0.3)" }}>
          {cPct >= 100 ? "Cost ceiling reached — runs halted" : cPct + "% of cost ceiling (" + fmt(cost7d) + " / " + fmt(orgCeiling) + ")"}
        </div>
      )}

      {/* ── Header ── */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 4, color: T4, fontWeight: 600, margin: "0 0 8px", fontFamily: mono }}>FlashFusion</p>
          <h1 style={{ fontSize: 28, fontWeight: 400, margin: 0, fontFamily: serif }}>
            <span style={{ background: GR, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Agent Factory</span>
          </h1>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {liveCount > 0 && <span style={{ ...badge(CY, "rgba(6,182,212,0.15)"), border: "1px solid rgba(6,182,212,0.25)" }}>{liveCount} LIVE</span>}
          <div aria-hidden="true" style={{ width: 36, height: 36, borderRadius: "50%", background: GR2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, fontFamily: mono }}>K</div>
        </div>
      </header>

      {/* ── KPIs ── */}
      <section aria-label="Key metrics" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { l: "PENDING", v: pending.length, c: pending.length > 0 ? "#fbbf24" : T4, s: "approval queue" },
          { l: "COST 7D", v: fmt(cost7d), c: VH, s: fmt(Math.round(cost7d / 7)) + "/day" },
          { l: "COMPLETED", v: doneCt, c: "#34d399", s: recent.length + " total runs" },
          { l: "SUCCESS", v: rate + "%", c: rate >= 90 ? "#34d399" : rate >= 70 ? "#fbbf24" : "#f87171", s: failCt + " failed" },
        ].map((k, i) => (
          <article key={i} style={{ ...card, padding: "20px 16px", textAlign: "center" }} aria-label={k.l + ": " + k.v}>
            <p style={{ ...lbl, margin: "0 0 12px", textAlign: "center" }}>{k.l}</p>
            <p style={{ fontSize: 30, fontWeight: 400, color: k.c, letterSpacing: -1.5, lineHeight: 1, margin: 0, fontFamily: serif }}>{k.v}</p>
            <p style={{ fontSize: 11, color: T4, margin: "10px 0 0" }}>{k.s}</p>
          </article>
        ))}
      </section>

      {/* ── Tabs ── */}
      <nav aria-label="Sections">
        <div role="tablist" style={{ display: "flex", gap: 4, borderBottom: "1px solid " + BD, marginBottom: 24, overflowX: "auto" }}>
          {["dashboard", "approvals", "runs", "agents", "settings"].map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => { setTab(t); setRPage(0); }}
              style={{ background: "none", border: "none", padding: "12px 20px", cursor: "pointer", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2, fontFamily: mono, color: tab === t ? T1 : T4, borderBottom: tab === t ? "2px solid " + VH : "2px solid transparent", minHeight: 44, whiteSpace: "nowrap" }}>
              {t}{t === "approvals" && pending.length > 0 ? " (" + pending.length + ")" : ""}
            </button>
          ))}
        </div>
      </nav>

      <main id="main-content">

        {/* ═══ DASHBOARD ═══ */}
        {tab === "dashboard" && (
          <div style={{ display: "grid", gap: 16 }}>
            {/* Cost chart */}
            <section style={{ ...card, padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontSize: 12, color: T3, margin: 0, fontWeight: 500 }}>Daily spend</h2>
                <span style={{ ...mn, color: T4 }}>PEAK {fmt(Math.max(...costByDay.map((d) => d.cents)))}</span>
              </div>
              <div role="img" aria-label={"7-day cost chart"} style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 130 }}>
                {costByDay.map((d, i) => {
                  const isMax = d.cents === Math.max(...costByDay.map((x) => x.cents)) && d.cents > 0;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <span style={{ ...mn, fontSize: 10, color: d.cents > 0 ? (isMax ? MG : VH) : "transparent" }}>{fmt(d.cents)}</span>
                      <div style={{ width: "100%", borderRadius: 6, minHeight: 3, height: Math.max((d.cents / maxC) * 100, 2) + "%", background: isMax ? GR2 : V + "55" }} />
                      <span style={{ ...mn, fontSize: 10, color: T4 }}>{d.day.split(" ")[1]}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Recent runs */}
            <section style={{ ...card, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid " + BD, display: "flex", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 12, color: T3, margin: 0, fontWeight: 500 }}>Recent runs</h2>
                <button onClick={() => setTab("runs")} style={{ background: "none", border: "none", color: VH, fontSize: 11, cursor: "pointer", fontWeight: 600, fontFamily: mono, textTransform: "uppercase", letterSpacing: 0.5, minHeight: 28 }}>VIEW ALL →</button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <tbody>
                  {runs.slice(0, 7).map((r) => (
                    <Row key={r.id} onClick={() => setDrawer(r.id)} ariaLabel={"View " + r.input.task}>
                      <td style={{ padding: "12px 20px", color: T2, maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.input.task}</td>
                      <td style={{ padding: "12px 8px" }}><span style={badge(ST[r.status].c, ST[r.status].bg)}>{ST[r.status].l}</span></td>
                      <td style={{ padding: "12px 8px", color: T3 }}>{fmt(r.cost_cents)}</td>
                      <td style={{ padding: "12px 8px", ...mn, color: T4 }}>{shortM(r.model_policy.model)}</td>
                      <td style={{ padding: "12px 20px", ...mn, color: T4, textAlign: "right" }}>{ago(r.created_at)}</td>
                    </Row>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* ═══ APPROVALS ═══ */}
        {tab === "approvals" && (
          <div>
            <div role="group" aria-label="Filter" style={{ display: "flex", gap: 6, marginBottom: 18 }}>
              {["pending", "approved", "denied", "all"].map((f) => (
                <button key={f} onClick={() => setAFilter(f)} aria-pressed={aFilter === f}
                  style={{ ...pill(aFilter === f ? S2 : "transparent", aFilter === f ? T1 : T4, BD), padding: "8px 16px", minHeight: 36, fontSize: 10 }}>
                  {f.toUpperCase()}{f === "pending" ? " (" + pending.length + ")" : ""}
                </button>
              ))}
            </div>

            {fAppr.length === 0 && <div style={{ ...card, padding: "48px 20px", textAlign: "center" }}><p style={{ fontSize: 24, margin: "0 0 8px", color: "#34d399" }}>✓</p><p style={{ color: T3, margin: 0 }}>{aFilter === "pending" ? "Queue clear" : "No results"}</p></div>}

            {fAppr.map((a) => {
              const tc = tcs.find((t) => t.id === a.tc_id);
              const r = runs.find((x) => x.id === a.run_id);
              const isPending = a.status === "pending";
              return (
                <article key={a.id} style={{ ...card, padding: "20px 24px", marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <p style={{ fontSize: 16, fontWeight: 400, margin: 0, fontFamily: serif }}>{r ? r.input.task : a.run_id}</p>
                      <p style={{ ...mn, color: T4, margin: "6px 0 0" }}>{a.run_id}</p>
                    </div>
                    {tc && <span style={badge(RK[tc.risk_level].c, RK[tc.risk_level].bg)}>{tc.risk_level}</span>}
                  </div>

                  {tc && (
                    <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 16, marginBottom: 16, border: "1px solid " + BD }}>
                      <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12, margin: 0 }}>
                        <div><dt style={{ color: T4, display: "inline" }}>Tool </dt><dd style={{ display: "inline", margin: 0, ...mn, color: T2 }}>{tc.tool_name}</dd></div>
                        <div><dt style={{ color: T4, display: "inline" }}>Cost </dt><dd style={{ display: "inline", margin: 0, color: VH }}>{fmt(tc.cost_estimate_cents)}</dd></div>
                        {tc.input.recipients != null && <div><dt style={{ color: T4, display: "inline" }}>Recipients </dt><dd style={{ display: "inline", margin: 0, color: T2 }}>{tc.input.recipients.toLocaleString()}</dd></div>}
                        {tc.input.rows_affected != null && <div><dt style={{ color: T4, display: "inline" }}>Rows </dt><dd style={{ display: "inline", margin: 0, color: T2 }}>~{tc.input.rows_affected.toLocaleString()}</dd></div>}
                        {tc.input.environment && <div><dt style={{ color: T4, display: "inline" }}>Env </dt><dd style={{ display: "inline", margin: 0, color: tc.input.environment === "production" ? "#f87171" : T2, fontWeight: 600 }}>{tc.input.environment}</dd></div>}
                        {tc.input.tests && <div><dt style={{ color: T4, display: "inline" }}>Tests </dt><dd style={{ display: "inline", margin: 0, color: "#34d399" }}>{tc.input.tests}</dd></div>}
                        {tc.input.query && <div style={{ gridColumn: "1/-1" }}><dt style={{ color: T4, display: "inline" }}>Query </dt><dd style={{ display: "inline", margin: 0, ...mn, color: T3 }}>{mask(tc.input.query)}</dd></div>}
                        {tc.input.subject && <div style={{ gridColumn: "1/-1" }}><dt style={{ color: T4, display: "inline" }}>Subject </dt><dd style={{ display: "inline", margin: 0, fontStyle: "italic", color: T2 }}>"{tc.input.subject}"</dd></div>}
                      </dl>
                    </div>
                  )}

                  <p style={{ fontSize: 11, color: T4, margin: "0 0 16px" }}>Requested {ago(a.created_at)}{a.reviewed_at ? " · Reviewed " + ago(a.reviewed_at) + " by " + a.reviewed_by : ""}</p>

                  {isPending ? (
                    <div>
                      <label htmlFor={"r-" + a.id} style={lbl}>REASON</label>
                      <input id={"r-" + a.id} type="text" value={reasons[a.id] || ""} onChange={(e) => setReasons((p) => ({ ...p, [a.id]: e.target.value }))} placeholder="Required for deny" style={{ ...inp, marginBottom: 12 }} />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => doApproval(a.id, true, reasons[a.id])} style={{ ...pill("rgba(5,150,105,0.15)", "#34d399", "rgba(5,150,105,0.3)"), flex: 1 }}>APPROVE</button>
                        <button onClick={() => doApproval(a.id, false, reasons[a.id])} style={{ ...pill("rgba(220,38,38,0.15)", "#f87171", "rgba(220,38,38,0.3)"), flex: 1 }}>DENY</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: "10px 16px", borderRadius: 100, fontSize: 11, fontWeight: 600, textAlign: "center", fontFamily: mono, textTransform: "uppercase", letterSpacing: 0.5, background: a.status === "approved" ? "rgba(5,150,105,0.15)" : "rgba(220,38,38,0.15)", color: a.status === "approved" ? "#34d399" : "#f87171" }}>
                      {a.status}{a.reason ? " — " + a.reason : ""}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* ═══ RUNS ═══ */}
        {tab === "runs" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input type="search" placeholder="Search task or ID…" value={rSearch} onChange={(e) => { setRSearch(e.target.value); setRPage(0); }} aria-label="Search runs" style={{ ...inp, flex: 1 }} />
              <select value={rFilter} onChange={(e) => { setRFilter(e.target.value); setRPage(0); }} aria-label="Filter by status" style={{ ...inp, width: "auto", minWidth: 120, cursor: "pointer" }}>
                <option value="all">All</option>
                {Object.entries(ST).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}
              </select>
            </div>
            <div style={{ ...card, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid " + BD }}>
                    {["ID", "Task", "Status", "Cost", "Model", "When"].map((h) => (
                      <th key={h} scope="col" style={{ textAlign: h === "When" ? "right" : "left", padding: "10px 16px", color: T4, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, fontFamily: mono }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageRuns.length === 0 && <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: T4 }}>No runs match</td></tr>}
                  {pageRuns.map((r) => (
                    <Row key={r.id} onClick={() => setDrawer(r.id)} ariaLabel={r.input.task + ", " + ST[r.status].l}>
                      <td style={{ padding: "12px 16px", ...mn, color: T4 }}>{r.id.slice(4, 10)}</td>
                      <td style={{ padding: "12px 16px", color: T2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }}>{r.input.task}</td>
                      <td style={{ padding: "12px 10px" }}><span style={badge(ST[r.status].c, ST[r.status].bg)}>{ST[r.status].l}</span></td>
                      <td style={{ padding: "12px 10px", color: T3 }}>{fmt(r.cost_cents)}</td>
                      <td style={{ padding: "12px 10px", ...mn, color: T4 }}>{shortM(r.model_policy.model)}</td>
                      <td style={{ padding: "12px 16px", ...mn, color: T4, textAlign: "right" }}>{ago(r.created_at)}</td>
                    </Row>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <nav aria-label="Pagination" style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
                <button disabled={rPage === 0} onClick={() => setRPage((p) => p - 1)} style={{ ...pill("transparent", rPage === 0 ? T4 : T2, BD), padding: "8px 14px", minHeight: 36, fontSize: 10 }}>← PREV</button>
                <span style={{ ...mn, color: T4, alignSelf: "center" }}>{rPage + 1} / {totalPages}</span>
                <button disabled={rPage >= totalPages - 1} onClick={() => setRPage((p) => p + 1)} style={{ ...pill("transparent", rPage >= totalPages - 1 ? T4 : T2, BD), padding: "8px 14px", minHeight: 36, fontSize: 10 }}>NEXT →</button>
              </nav>
            )}
          </div>
        )}

        {/* ═══ AGENTS ═══ */}
        {tab === "agents" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <p style={{ ...mn, color: T4, margin: 0 }}>{agents.length} CONFIGURED</p>
              <button onClick={() => setShowModal(true)} style={pill(GR2, "#fff", VH)}>+ NEW AGENT</button>
            </div>
            <div style={{ display: "grid", gap: 14 }}>
              {agents.map((a) => (
                <article key={a.id} style={{ ...card, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 400, margin: 0, fontFamily: serif }}>{a.name}</h3>
                      <p style={{ fontSize: 12, color: T3, margin: "6px 0 0" }}>{a.desc}</p>
                    </div>
                    <span style={badge(a.autonomy === "autonomous" ? "#34d399" : a.autonomy === "semi_autonomous" ? "#fbbf24" : T3, a.autonomy === "autonomous" ? "rgba(5,150,105,0.15)" : a.autonomy === "semi_autonomous" ? "rgba(161,98,7,0.15)" : T4 + "22")}>{a.autonomy.replace("_", " ")}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, fontSize: 12 }}>
                    {[
                      { l: "CEILING", v: fmt(a.ceiling), c: VH },
                      { l: "RUNS", v: a.runs, c: T2 },
                      { l: "SUCCESS", v: a.rate + "%", c: a.rate >= 90 ? "#34d399" : a.rate >= 70 ? "#fbbf24" : "#f87171" },
                      { l: "TOOLS", v: a.tools, c: T3 },
                    ].map((x, i) => (
                      <div key={i}>
                        <p style={{ ...lbl, margin: "0 0 6px" }}>{x.l}</p>
                        <p style={{ color: x.c, margin: 0, fontWeight: 500 }}>{x.v}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ═══ SETTINGS ═══ */}
        {tab === "settings" && (
          <div style={{ display: "grid", gap: 16 }}>
            <section style={{ ...card, padding: 22 }}>
              <h2 style={{ fontSize: 17, fontWeight: 400, margin: "0 0 18px", fontFamily: serif }}>Organization</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, fontSize: 12 }}>
                {[{ l: "NAME", v: "FlashFusion" }, { l: "CEILING", v: fmt(orgCeiling), c: VH }, { l: "ROUTING", v: "Manual" }, { l: "MEMBERS", v: "1 (Kyle)" }].map((x, i) => (
                  <div key={i}><p style={{ ...lbl, margin: "0 0 6px" }}>{x.l}</p><p style={{ color: x.c || T2, margin: 0, fontWeight: 500 }}>{x.v}</p></div>
                ))}
              </div>
            </section>

            <section style={{ ...card, padding: 22 }}>
              <h2 style={{ fontSize: 17, fontWeight: 400, margin: "0 0 18px", fontFamily: serif }}>Tool Policies</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr style={{ borderBottom: "1px solid " + BD }}>
                  {["Tool", "Risk", "Approval", "Auto"].map((h) => (
                    <th key={h} scope="col" style={{ textAlign: "left", padding: "8px 0", color: T4, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, fontFamily: mono }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {[
                    { t: "web_search", r: "low", a: false, au: "Always" },
                    { t: "read_file", r: "low", a: false, au: "< 10MB" },
                    { t: "write_file", r: "high", a: true, au: "—" },
                    { t: "send_email", r: "critical", a: true, au: "—" },
                    { t: "execute_sql_read", r: "low", a: false, au: "SELECT" },
                    { t: "execute_sql_write", r: "critical", a: true, au: "—" },
                    { t: "deploy_vercel", r: "critical", a: true, au: "—" },
                  ].map((p, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid " + BD }}>
                      <td style={{ padding: "10px 0", ...mn, color: T3 }}>{p.t}</td>
                      <td style={{ padding: "10px 0" }}><span style={{ ...badge(RK[p.r].c, RK[p.r].bg), fontSize: 9 }}>{p.r}</span></td>
                      <td style={{ padding: "10px 0", color: p.a ? "#fbbf24" : "#34d399", fontWeight: 600, ...mn }}>{p.a ? "REQUIRED" : "AUTO"}</td>
                      <td style={{ padding: "10px 0", color: T4 }}>{p.au}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section style={{ ...card, padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h2 style={{ fontSize: 17, fontWeight: 400, margin: 0, fontFamily: serif }}>Audit Log</h2>
                <button onClick={() => {
                  const csv = "Time,Actor,Action,Target\n" + audit.map((a) => a.created_at + "," + a.actor + "," + a.action + "," + a.target).join("\n");
                  const b = new Blob([csv], { type: "text/csv" });
                  const u = URL.createObjectURL(b);
                  const el = document.createElement("a");
                  el.href = u;
                  el.download = "audit.csv";
                  el.click();
                  URL.revokeObjectURL(u);
                  fire("Exported");
                }} style={{ ...pill("transparent", T3, BD), padding: "7px 14px", minHeight: 36, fontSize: 10 }}>EXPORT CSV</button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <tbody>
                  {audit.map((a) => (
                    <tr key={a.id} style={{ borderBottom: "1px solid " + BD }}>
                      <td style={{ padding: "10px 0" }}><span style={badge(a.actor === "human" ? "#60a5fa" : a.actor === "agent" ? VH : T3, a.actor === "human" ? "rgba(29,78,216,0.15)" : a.actor === "agent" ? V + "22" : T4 + "22")}>{a.actor}</span></td>
                      <td style={{ padding: "10px 8px", color: T2 }}>{a.action}</td>
                      <td style={{ padding: "10px 8px", ...mn, color: T4 }}>{a.target.slice(0, 12)}</td>
                      <td style={{ padding: "10px 0", ...mn, color: T4, textAlign: "right" }}>{ago(a.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}
      </main>

      {/* ═══ DRAWER ═══ */}
      {drawerRun && (
        <div style={{ position: "fixed", inset: 0, zIndex: 90 }} role="dialog" aria-modal="true" aria-label={drawerRun.input.task}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(3px)" }} onClick={() => setDrawer(null)} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "100%", maxWidth: 460, background: S1 + "f8", backdropFilter: "blur(20px)", borderLeft: "1px solid " + BD, padding: "28px 24px", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 400, margin: 0, fontFamily: serif, lineHeight: 1.3 }}>{drawerRun.input.task}</h2>
                <p style={{ ...mn, color: T4, margin: "8px 0 0" }}>{drawerRun.id}</p>
              </div>
              <button onClick={() => setDrawer(null)} aria-label="Close" style={{ background: "none", border: "none", color: T3, fontSize: 20, cursor: "pointer", padding: 8, minWidth: 36, minHeight: 36 }}>✕</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              {[
                { l: "STATUS", v: ST[drawerRun.status].l, c: ST[drawerRun.status].c },
                { l: "COST", v: fmt(drawerRun.cost_cents), c: VH },
                { l: "TOKENS", v: (drawerRun.token_usage.input + drawerRun.token_usage.output).toLocaleString() },
                { l: "DURATION", v: dur(drawerRun.created_at, drawerRun.updated_at) },
                { l: "MODEL", v: shortM(drawerRun.model_policy.model) },
                { l: "CEILING", v: fmt(drawerRun.cost_ceiling_cents) },
              ].map((x, i) => (
                <div key={i}><p style={{ ...lbl, margin: "0 0 6px" }}>{x.l}</p><p style={{ color: x.c || T2, margin: 0, fontWeight: 500 }}>{x.v}</p></div>
              ))}
            </div>

            {/* Token bars */}
            <div style={{ ...card, padding: 16, marginBottom: 20 }}>
              <p style={{ ...lbl, margin: "0 0 12px" }}>TOKEN USAGE</p>
              <div style={{ display: "flex", gap: 14 }}>
                {[{ l: "Input", v: drawerRun.token_usage.input, c: V }, { l: "Output", v: drawerRun.token_usage.output, c: VH }].map((t) => (
                  <div key={t.l} style={{ flex: 1 }}>
                    <p style={{ color: T3, margin: "0 0 6px", fontSize: 12 }}>{t.l}</p>
                    <div style={{ height: 5, borderRadius: 100, background: T4 + "22", overflow: "hidden" }} role="progressbar" aria-valuenow={t.v} aria-valuemax={drawerRun.token_usage.input + drawerRun.token_usage.output}>
                      <div style={{ height: "100%", width: pct(t.v, drawerRun.token_usage.input + drawerRun.token_usage.output) + "%", background: t.c, borderRadius: 100 }} />
                    </div>
                    <p style={{ ...mn, color: t.c, margin: "6px 0 0" }}>{t.v.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tool calls */}
            {drawerTc.length > 0 && (
              <div>
                <p style={{ ...lbl, margin: "0 0 12px" }}>TOOL CALLS ({drawerTc.length})</p>
                {drawerTc.map((t) => (
                  <div key={t.id} style={{ ...card, padding: "14px 16px", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ ...badge(RK[t.risk_level].c, RK[t.risk_level].bg), fontSize: 9 }}>{t.risk_level}</span>
                        <span style={{ ...mn, color: T2 }}>{t.tool_name}</span>
                      </div>
                      <span style={badge(ST[t.status] ? ST[t.status].c : T3, ST[t.status] ? ST[t.status].bg : T4 + "22")}>{t.status}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", ...mn, color: T4 }}>
                      <span>{fmt(t.cost_estimate_cents)}</span>
                      <span>{ago(t.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ CREATE MODAL ═══ */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }} role="dialog" aria-modal="true" aria-label="Create agent">
          <div style={{ ...card, padding: 28, width: "100%", maxWidth: 440 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 400, fontFamily: serif }}>New Agent</h2>
              <button onClick={() => setShowModal(false)} aria-label="Close" style={{ background: "none", border: "none", color: T3, fontSize: 18, cursor: "pointer", padding: 8, minWidth: 36, minHeight: 36 }}>✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              setAgents((p) => [...p, { id: "ag_" + Date.now(), name: fd.get("name"), desc: fd.get("task"), autonomy: fd.get("autonomy"), ceiling: parseInt(fd.get("ceiling")) * 100, runs: 0, rate: 0, tools: 0 }]);
              setShowModal(false);
              fire("Agent created");
            }}>
              {[
                { n: "name", l: "AGENT NAME", p: "Research Agent" },
                { n: "task", l: "TASK DESCRIPTION", p: "Company research & analysis" },
                { n: "ceiling", l: "COST CEILING ($)", p: "500", t: "number" },
              ].map((f) => (
                <div key={f.n} style={{ marginBottom: 18 }}>
                  <label htmlFor={"c-" + f.n} style={lbl}>{f.l}</label>
                  <input id={"c-" + f.n} name={f.n} type={f.t || "text"} placeholder={f.p} required style={inp} />
                </div>
              ))}
              <div style={{ marginBottom: 22 }}>
                <label htmlFor="c-auto" style={lbl}>AUTONOMY</label>
                <select id="c-auto" name="autonomy" defaultValue="semi_autonomous" style={{ ...inp, cursor: "pointer" }}>
                  <option value="manual">Manual</option>
                  <option value="semi_autonomous">Semi-autonomous</option>
                  <option value="autonomous">Autonomous</option>
                </select>
              </div>
              <button type="submit" style={{ ...pill(GR2, "#fff", VH), width: "100%", padding: 14, fontSize: 13 }}>CREATE AGENT</button>
            </form>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer style={{ textAlign: "center", padding: "36px 0 16px" }}>
        <p style={{ fontSize: 10, color: T4, letterSpacing: 3, margin: 0, fontFamily: mono }}>FLASHFUSION · AGENT FACTORY · PHASE 1</p>
        <div style={{ width: 60, height: 2, background: GR2, margin: "12px auto 0", borderRadius: 100 }} />
      </footer>
    </div>
  );
}
