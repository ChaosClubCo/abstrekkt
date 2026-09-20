/**
 * Claude Enablement Suite — 4/7: Session Outcome Tracker
 *
 * Cohort-level dashboard. Records session outcomes after each enablement session.
 * Shows who's been seen, plan status, completion rates, open gaps, next sessions.
 * Reads intake records from "intake-records-v1" for employee context.
 * Stores outcome records in "outcome-records-v1" (array of outcome objects).
 * The program health report (artifact 7) reads from this store.
 */

const { useState, useEffect, useCallback } = React;

/* ===== inlined notion-sync module ===== */
/**
 * notion-sync.js — Shared durable-mirror module for the Enablement Suite
 * ----------------------------------------------------------------------
 * WHY THIS EXISTS
 * The suite stores everything in window.storage. window.storage is:
 *   - per published-artifact, per user
 *   - PERMANENTLY DELETED on unpublish (no recovery)
 *   - invisible to the n8n automation layer
 * This module mirrors every record into a Notion database via the
 * Anthropic Messages API + Notion MCP server, so there is a durable
 * system of record that survives unpublish and that n8n can query.
 *
 * DESIGN: Strategy A — fire-and-forget mirror.
 *   1. window.storage write happens first and is authoritative.
 *   2. Notion mirror runs after, async, NON-BLOCKING.
 *   3. Failure is flagged on the record (_notionSync) — never silent —
 *      and is manually retryable. The session is never blocked on network.
 *
 * SECURITY: No Notion token anywhere. The Anthropic proxy handles auth;
 * the Notion MCP server handles its own OAuth. Zero secrets in this bundle.
 *
 * USAGE (identical in 01, 04, 05):
 *   import { getNotionConfig, setNotionConfig, mirrorToNotion,
 *            SYNC, NotionConfigPanel } from "./notion-sync";
 *   // after a successful window.storage.set(...):
 *   mirrorToNotion("intake", rec, setRecords, allRecords, "intake-records-v1");
 */



/* ---- config (parameterized destination — no hardcoded DB id) ---------- */

const CFG_KEY = "enablement-notion-config-v1";

const SYNC = {
  UNCONFIGURED: "unconfigured", // no Notion target set — storage-only
  PENDING:      "pending",      // mirror in flight
  SYNCED:       "synced",       // confirmed in Notion
  FAILED:       "failed",       // mirror failed — retryable, NOT silent
};

async function getNotionConfig() {
  try {
    const r = await window.storage.get(CFG_KEY);
    return r ? JSON.parse(r.value) : null;
  } catch { return null; }
}

async function setNotionConfig(cfg) {
  // cfg = { databaseId: string, label: string }
  await window.storage.set(CFG_KEY, JSON.stringify(cfg));
  return cfg;
}

/* ---- the mirror call -------------------------------------------------- */

/**
 * Mirror one record into Notion. Non-blocking by contract: callers do NOT
 * await this for UX-critical paths. It patches the record's _notionSync
 * field in storage + state so status is always visible and recoverable.
 *
 * @param recordType  "intake" | "outcome" | "checkin"
 * @param record      the single record just written
 * @param setRecords  React setter for the records collection (array)
 * @param allRecords  current records array (already includes `record`)
 * @param storageKey  the window.storage key the collection lives under
 */
async function mirrorToNotion(recordType, record, setRecords, allRecords, storageKey) {
  const cfg = await getNotionConfig();

  const patch = (status, extra = {}) => {
    setRecords(prev => {
      const next = prev.map(r =>
        r.id === record.id ? { ...r, _notionSync: status, ...extra } : r
      );
      window.storage.set(storageKey, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  if (!cfg?.databaseId) { patch(SYNC.UNCONFIGURED); return SYNC.UNCONFIGURED; }

  patch(SYNC.PENDING);

  // Build a flat, human-readable property map. Notion MCP creates the page;
  // we pass title + a JSON blob so no schema migration is ever required.
  const title = recordTitle(recordType, record);
  const payload = JSON.stringify(record, null, 2);

  const prompt =
    `Use the Notion MCP server to create ONE new page in the Notion ` +
    `database with id "${cfg.databaseId}". ` +
    `Set the page title to: ${title}\n` +
    `Add a code block containing exactly this JSON (do not alter it):\n` +
    "```json\n" + payload + "\n```\n" +
    `Also add these top-level properties if the database has matching ` +
    `columns, otherwise skip silently: ` +
    `Type="${recordType}", RecordId="${record.id}". ` +
    `Reply with exactly the word DONE on success, or ERROR: <reason> on failure.`;

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
        mcp_servers: [
          { type: "url", url: "https://mcp.notion.com/mcp", name: "notion" },
        ],
      }),
    });

    if (!resp.ok) {
      const e = await resp.json().catch(() => ({}));
      throw new Error(e.error?.message || `HTTP ${resp.status}`);
    }

    const data = await resp.json();
    const text = (data.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join(" ")
      .trim();

    if (/(^|\b)DONE(\b|$)/.test(text) && !/ERROR:/i.test(text)) {
      patch(SYNC.SYNCED, { _notionSyncedAt: new Date().toISOString() });
      return SYNC.SYNCED;
    }
    throw new Error(text.slice(0, 160) || "Notion MCP returned no confirmation");
  } catch (err) {
    patch(SYNC.FAILED, { _notionError: String(err.message || err).slice(0, 200) });
    return SYNC.FAILED;
  }
}

/** Retry every record not yet confirmed in Notion. */
async function retryUnsynced(recordType, setRecords, allRecords, storageKey) {
  const pending = allRecords.filter(
    r => r._notionSync !== SYNC.SYNCED
  );
  for (const r of pending) {
    // sequential on purpose — avoids hammering the MCP server in parallel
    // eslint-disable-next-line no-await-in-loop
    await mirrorToNotion(recordType, r, setRecords, allRecords, storageKey);
  }
}

function recordTitle(type, r) {
  if (type === "intake")  return `Intake — ${r.name || "Unknown"} (${r.role || "?"})`;
  if (type === "outcome") return `Outcome — ${r.employeeName || r.name || "Unknown"}`;
  if (type === "checkin") return `Check-in — ${r.employeeName || r.name || "Unknown"} ${r.weekLabel || ""}`.trim();
  return `Record ${r.id}`;
}

/* ---- drop-in config + status UI -------------------------------------- */

const UI = {
  navy: "#1A0B2E", primary: "#A855F7", muted: "#64748b",
  border: "rgba(168,85,247,0.2)", red: "#FB7185", green: "#34D399", amber: "#FBBF24",
};

/** One-time Notion destination config. Render near the top of each tool. */
function NotionConfigPanel() {
  const [cfg, setCfg]   = useState(null);
  const [dbId, setDbId] = useState("");
  const [lbl, setLbl]   = useState("");
  const [open, setOpen] = useState(false);
  const [msg, setMsg]   = useState("");

  useEffect(() => { getNotionConfig().then(c => { if (c) { setCfg(c); setDbId(c.databaseId); setLbl(c.label || ""); } }); }, []);

  async function save() {
    const id = dbId.trim();
    if (!id) { setMsg("Database ID required"); return; }
    const saved = await setNotionConfig({ databaseId: id, label: lbl.trim() });
    setCfg(saved); setOpen(false); setMsg("");
  }

  const configured = !!cfg?.databaseId;

  return (
    <div style={{
      background: configured ? "rgba(52,211,153,0.10)" : "rgba(251,191,36,0.08)",
      border: `1px solid ${configured ? UI.green : UI.amber}`,
      borderRadius: 6, padding: "8px 12px", marginBottom: 12, fontSize: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontWeight: 700, color: configured ? UI.green : UI.amber }}>
          {configured ? "● Durable mirror ON" : "▲ Storage-only — no backup"}
        </span>
        <span style={{ color: UI.muted, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {configured ? (cfg.label || cfg.databaseId) : "Records lost if this artifact is unpublished"}
        </span>
        <button onClick={() => setOpen(o => !o)} style={{
          padding: "3px 9px", borderRadius: 4, border: "none", cursor: "pointer",
          fontSize: 11, fontWeight: 600, color: "#F8FAFC",
          background: configured ? UI.primary : UI.amber,
        }}>
          {configured ? "Change" : "Configure Notion"}
        </button>
      </div>
      {open && (
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          <input
            value={dbId} onChange={e => setDbId(e.target.value)}
            placeholder="Notion database ID (32-char id from the DB URL)"
            style={{ padding: "6px 9px", borderRadius: 4, border: `1px solid ${UI.border}`, fontSize: 12, fontFamily: "system-ui" }}
          />
          <input
            value={lbl} onChange={e => setLbl(e.target.value)}
            placeholder="Label (optional, e.g. 'INT Enablement DB')"
            style={{ padding: "6px 9px", borderRadius: 4, border: `1px solid ${UI.border}`, fontSize: 12, fontFamily: "system-ui" }}
          />
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={save} style={{ padding: "5px 12px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, color: "#F8FAFC", background: UI.green }}>Save</button>
            {msg && <span style={{ color: UI.red, fontSize: 11 }}>{msg}</span>}
            <span style={{ color: UI.muted, fontSize: 11 }}>
              The Notion connector must be enabled in this Claude account.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/** Tiny per-record status badge. Render in list rows. */
function SyncBadge({ status }) {
  const map = {
    [SYNC.SYNCED]:       { t: "✓ Notion",  c: UI.green },
    [SYNC.PENDING]:      { t: "⟳ syncing", c: UI.primary },
    [SYNC.FAILED]:       { t: "⚠ unsynced", c: UI.red },
    [SYNC.UNCONFIGURED]: { t: "○ local",   c: UI.muted },
  };
  const s = map[status] || map[SYNC.UNCONFIGURED];
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color: s.c, padding: "1px 6px", borderRadius: 3, border: `1px solid ${s.c}33`, whiteSpace: "nowrap" }}>
      {s.t}
    </span>
  );
}

/* ===== end notion-sync ===== */


const C = {
  primary: "#A855F7", accent: "#F472B6", done: "#34D399",
  navy: "#1A0B2E", muted: "#64748b", border: "rgba(168,85,247,0.2)", bg: "#0F0618",
  blocked: "#FB7185", active: "#7c3aed",
};

const PLAN_COLORS = { free: "#94a3b8", pro: C.active, max: C.accent, team: C.primary, enterprise: C.navy, unknown: "#94a3b8" };

const STATUS_OPTIONS = ["Completed", "In Progress", "Scheduled", "Needs Follow-up", "No Show"];
const STATUS_COLORS  = { "Completed": C.done, "In Progress": C.active, "Scheduled": C.primary, "Needs Follow-up": C.accent, "No Show": C.blocked };

const QC_ITEMS = [
  { id: "q1", label: "Can log into claude.ai independently",        critical: true  },
  { id: "q2", label: "1+ Project with custom instructions created", critical: true  },
  { id: "q3", label: "Memory configured with role context",         critical: true  },
  { id: "q4", label: "Prompt package delivered and understood",     critical: true  },
  { id: "q5", label: "1+ connector connected",                      critical: false },
  { id: "q6", label: "Identified #1 weekly use case",               critical: false },
  { id: "q7", label: "Next session date agreed",                    critical: false },
];

const EMPTY_OUTCOME = {
  employeeName: "", role: "", plan: "pro", sessionDate: new Date().toISOString().split("T")[0],
  sessionNumber: 1, status: "Completed", sessionType: "first",
  qc: {}, openGaps: "", nextSessionDate: "", nextSessionFocus: "", notes: "",
};

function OutcomeTracker() {
  useEffect(() => {
    if (document.getElementById("ff-fonts")) return;
    var l = document.createElement("link");
    l.id = "ff-fonts"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500&display=swap";
    document.head.appendChild(l);
    if(!document.getElementById("ff-font-rule")){var st=document.createElement("style");st.id="ff-font-rule";st.textContent='*{font-family:Inter,system-ui,sans-serif}[style*="font-weight: 700"],[style*="font-weight:700"],[style*="font-weight: 800"],[style*="font-weight:800"]{font-family:Poppins,system-ui,sans-serif}input,select,textarea{color:#F8FAFC}input::placeholder,textarea::placeholder{color:#64748B}select option{background:#1A0B2E;color:#F8FAFC}';document.head.appendChild(st);}
  }, []);

  const [outcomes,    setOutcomes]    = useState([]);
  const [intakes,     setIntakes]     = useState([]);
  const [view,        setView]        = useState("dashboard");  // dashboard | log | detail
  const [form,        setForm]        = useState(EMPTY_OUTCOME);
  const [selectedRec, setSelectedRec] = useState(null);
  const [saveLabel,   setSaveLabel]   = useState("💾 Save Outcome");
  const [filter,      setFilter]      = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const [or, ir] = await Promise.allSettled([
          window.storage.get("outcome-records-v1"),
          window.storage.get("intake-records-v1"),
        ]);
        if (or.status === "fulfilled" && or.value) setOutcomes(JSON.parse(or.value.value));
        if (ir.status === "fulfilled" && ir.value) setIntakes(JSON.parse(ir.value.value));
      } catch (e) { console.error(e); }
    })();
  }, []);

  const save = useCallback(async (recs) => {
    try {
      await window.storage.set("outcome-records-v1", JSON.stringify(recs));
      setSaveLabel("✓ Saved");
      setTimeout(() => setSaveLabel("💾 Save Outcome"), 2000);
    } catch (e) {
      setSaveLabel("⚠ Failed");
      setTimeout(() => setSaveLabel("💾 Save Outcome"), 3000);
    }
  }, []);

  function loadFromIntake(rec) {
    setForm(prev => ({ ...prev, employeeName: rec.name, role: rec.role, plan: rec.plan || "pro", sessionType: rec.firstSession ? "first" : "followup" }));
  }

  function setQC(id, val) {
    setForm(prev => ({ ...prev, qc: { ...prev.qc, [id]: val === prev.qc[id] ? null : val } }));
  }

  async function submitOutcome() {
    if (!form.employeeName) return;
    const rec = { ...form, id: Date.now(), createdAt: new Date().toISOString() };
    const next = [rec, ...outcomes];
    setOutcomes(next);
    await save(next);
    mirrorToNotion("outcome", rec, setOutcomes, next, "outcome-records-v1");
    setView("dashboard");
    setForm(EMPTY_OUTCOME);
  }

  const filtered = filter === "all" ? outcomes : outcomes.filter(o => o.status === filter);

  // ── Dashboard stats ──
  const total      = outcomes.length;
  const completed  = outcomes.filter(o => o.status === "Completed").length;
  const onPro      = outcomes.filter(o => ["pro","max","team","enterprise"].includes(o.plan)).length;
  const needsFollowup = outcomes.filter(o => o.status === "Needs Follow-up").length;
  const criticalPassed = outcomes.filter(o => {
    const criticals = QC_ITEMS.filter(i => i.critical);
    return criticals.every(i => o.qc?.[i.id] === "pass");
  }).length;

  const completionRate = total ? Math.round((completed / total) * 100) : 0;
  const proRate        = total ? Math.round((onPro / total) * 100)     : 0;

  // ── Log view (form) ──
  if (view === "log") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui" }}>
        <div style={{ background: C.navy, color: "#F8FAFC", padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: "#A855F7" }}>📝 Log Session Outcome</span>
          <div style={{ flex: 1 }}/>
          <button onClick={() => setView("dashboard")} style={btn}>← Dashboard</button>
        </div>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 18px" }}>

          {/* Load from intake */}
          {intakes.length > 0 && (
            <div style={{ background: "rgba(26,11,46,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, marginBottom: 14 }}>
              <div style={sectionLabel}>Load from Intake</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {intakes.slice(0, 8).map(rec => (
                  <button key={rec.id} onClick={() => loadFromIntake(rec)}
                    style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${C.border}`, background: "rgba(26,11,46,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", color: "#CBD5E1", fontSize: 11, cursor: "pointer", fontFamily: "system-ui" }}>
                    {rec.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Basic info */}
          <div style={{ background: "rgba(26,11,46,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
            <div style={sectionLabel}>Session Info</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 12px" }}>
              {[
                ["Employee Name *", "employeeName", "text", "Jane Smith"],
                ["Role", "role", "text", "Service Desk Mgr"],
                ["Session Date", "sessionDate", "date", ""],
              ].map(([label, field, type, ph]) => (
                <div key={field}>
                  <div style={labelStyle}>{label}</div>
                  <input value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} type={type} style={inputStyle} placeholder={ph}/>
                </div>
              ))}
              <div>
                <div style={labelStyle}>Plan</div>
                <select value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                  {["free","pro","max","team","enterprise","unknown"].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <div style={labelStyle}>Session #</div>
                <input value={form.sessionNumber} onChange={e => setForm(p => ({ ...p, sessionNumber: +e.target.value }))} type="number" min="1" style={inputStyle}/>
              </div>
              <div>
                <div style={labelStyle}>Status</div>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* QC Gate */}
          <div style={{ background: "rgba(26,11,46,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
            <div style={sectionLabel}>QC Gate Results</div>
            {QC_ITEMS.map(item => {
              const val = form.qc[item.id];
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, padding: "5px 8px", borderRadius: 4, background: val === "pass" ? "rgba(52,211,153,0.10)" : val === "fail" ? "#fef2f2" : C.bg }}>
                  <span style={{ fontSize: 11, color: item.critical ? "#FBBF24" : C.muted, flexShrink: 0 }}>{item.critical ? "★" : "○"}</span>
                  <span style={{ flex: 1, fontSize: 11, color: "#CBD5E1" }}>{item.label}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {["pass","fail","skip","n/a"].map(v => (
                      <button key={v} onClick={() => setQC(item.id, v)}
                        style={{ padding: "3px 7px", borderRadius: 3, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, fontFamily: "system-ui",
                          background: val === v ? (v === "pass" ? C.done : v === "fail" ? C.blocked : "#64748b") : "rgba(168,85,247,0.2)",
                          color: val === v ? "#F8FAFC" : "#64748b" }}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Open gaps + next session */}
          <div style={{ background: "rgba(26,11,46,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
            <div style={sectionLabel}>Follow-up</div>
            <div style={{ marginBottom: 10 }}>
              <div style={labelStyle}>Open Gaps / Action Items</div>
              <textarea value={form.openGaps} onChange={e => setForm(p => ({ ...p, openGaps: e.target.value }))}
                style={{ ...inputStyle, height: 60, resize: "vertical" }} placeholder="What was left incomplete or needs follow-up?"/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
              <div>
                <div style={labelStyle}>Next Session Date</div>
                <input value={form.nextSessionDate} onChange={e => setForm(p => ({ ...p, nextSessionDate: e.target.value }))} type="date" style={inputStyle}/>
              </div>
              <div>
                <div style={labelStyle}>Next Session Focus</div>
                <input value={form.nextSessionFocus} onChange={e => setForm(p => ({ ...p, nextSessionFocus: e.target.value }))} style={inputStyle} placeholder="e.g. Connectors + prompt package"/>
              </div>
            </div>
            <div>
              <div style={labelStyle}>Facilitator Notes</div>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                style={{ ...inputStyle, height: 60, resize: "vertical" }} placeholder="Context, observations, or flags"/>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={submitOutcome} disabled={!form.employeeName}
              style={{ padding: "10px 24px", borderRadius: 4, border: "none", cursor: form.employeeName ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 700, fontFamily: "system-ui", background: form.employeeName ? C.done : "rgba(168,85,247,0.2)", color: form.employeeName ? "#F8FAFC" : C.muted }}>
              {saveLabel}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──
  const statCards = [
    { label: "Sessions Logged",  value: total,           color: C.navy },
    { label: "Completed",        value: completed,        color: C.done,    sub: `${completionRate}%` },
    { label: "On Pro+",          value: onPro,            color: C.primary,  sub: `${proRate}%` },
    { label: "Needs Follow-up",  value: needsFollowup,    color: C.accent },
    { label: "QC Gate Passed",   value: criticalPassed,   color: C.active },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui" }}>
      <div style={{ background: C.navy, color: "#F8FAFC", padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: "#A855F7" }}>📊 Session Outcome Tracker</span>
        <div style={{ flex: 1 }}/>
        <button onClick={() => setView("log")} style={{ ...btn, background: C.done }}>+ Log Session</button>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 18px" }}>
        <NotionConfigPanel />

        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
          {statCards.map(s => (
            <div key={s.label} style={{ flex: 1, minWidth: 120, background: "rgba(26,11,46,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 6, padding: 12, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
              {s.sub && <div style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.sub}</div>}
              <div style={{ fontSize: 10, color: C.muted, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
          {["all", ...STATUS_OPTIONS].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${filter === f ? (STATUS_COLORS[f] || C.primary) : C.border}`, background: filter === f ? ((STATUS_COLORS[f] || C.primary) + "11") : "#F8FAFC", color: filter === f ? (STATUS_COLORS[f] || C.primary) : "#CBD5E1", fontSize: 11, cursor: "pointer", fontFamily: "system-ui", fontWeight: filter === f ? 700 : 400 }}>
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>

        {/* Records */}
        {!filtered.length ? (
          <div style={{ background: "rgba(26,11,46,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 8, padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>📋</div>
            <div style={{ color: C.muted, fontSize: 13 }}>No sessions logged yet.</div>
            <button onClick={() => setView("log")} style={{ ...btn, background: C.done, marginTop: 12, padding: "8px 16px", fontSize: 12 }}>Log first session</button>
          </div>
        ) : (
          <div style={{ background: "rgba(26,11,46,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1.5fr auto", gap: 0, borderBottom: `1px solid ${C.border}`, padding: "8px 14px", background: C.bg }}>
              {["Employee", "Role", "Plan", "Status", "QC / Next Session", ""].map(h => (
                <div key={h} style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.4px" }}>{h}</div>
              ))}
            </div>
            {filtered.map((rec, i) => {
              const criticals = QC_ITEMS.filter(qi => qi.critical);
              const qcPassed  = criticals.filter(qi => rec.qc?.[qi.id] === "pass").length;
              const statusColor = STATUS_COLORS[rec.status] || C.muted;
              return (
                <div key={rec.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1.5fr auto", gap: 0, padding: "10px 14px", borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 12, color: "#F8FAFC" }}>{rec.employeeName}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>Session #{rec.sessionNumber} · {new Date(rec.sessionDate).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#CBD5E1" }}>{rec.role}</div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 3, background: (PLAN_COLORS[rec.plan] || "#94a3b8") + "22", color: PLAN_COLORS[rec.plan] || "#94a3b8", display: "inline-block" }}>
                    {rec.plan?.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 3, background: statusColor + "22", color: statusColor, display: "inline-block" }}>
                    {rec.status}
                  </span>
                  <div>
                    <div style={{ fontSize: 11, color: qcPassed === criticals.length ? C.done : C.accent, fontWeight: 600 }}>
                      QC: {qcPassed}/{criticals.length} ★
                    </div>
                    {rec.nextSessionDate && <div style={{ fontSize: 10, color: C.muted }}>Next: {new Date(rec.nextSessionDate).toLocaleDateString()}</div>}
                  </div>
                  <button onClick={() => { setSelectedRec(rec); setView("detail"); }}
                    style={{ padding: "3px 8px", borderRadius: 3, border: `1px solid ${C.border}`, background: "rgba(26,11,46,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", fontSize: 10, cursor: "pointer", color: C.primary, fontFamily: "system-ui" }}>
                    View
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const btn = { padding: "5px 12px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "system-ui", color: "#F8FAFC", background: "#CBD5E1" };
const sectionLabel = { fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 10 };
const labelStyle   = { fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 4 };
const inputStyle   = { width: "100%", padding: "7px 9px", borderRadius: 4, border: `1px solid ${C.border}`, fontSize: 12, fontFamily: "system-ui", outline: "none", marginBottom: 10 };

export default OutcomeTracker;
