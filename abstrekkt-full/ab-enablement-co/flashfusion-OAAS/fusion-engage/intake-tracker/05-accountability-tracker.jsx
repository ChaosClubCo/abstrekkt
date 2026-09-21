/**
 * Claude Enablement Suite — 5/7: Between-Session Accountability Tracker
 *
 * Weekly check-in form for employees. Logs usage, wins, blockers.
 * Facilitator reviews before each session to inform next-session focus.
 * Stores check-ins in "checkin-records-v1".
 * Reads intake records for employee pre-fill.
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

const FREQUENCY_OPTIONS = [
  { value: "daily",    label: "Daily",        emoji: "🔥" },
  { value: "few_week", label: "Few times/wk", emoji: "⚡" },
  { value: "once_week",label: "Once a week",  emoji: "👍" },
  { value: "once_few", label: "Once in a few weeks", emoji: "🙂" },
  { value: "not_yet",  label: "Not yet this week", emoji: "😬" },
];

const USE_CASE_TAGS = [
  "Email drafting", "Document writing", "Summarizing", "Research",
  "Meeting prep", "Code / technical", "Process docs", "Data analysis",
  "Planning", "Customer comms", "Learning something new", "Other",
];

const BLOCKER_TAGS = [
  "Forgot it exists", "Didn't know how to start", "Prompt didn't work well",
  "Too busy", "Results weren't useful", "Concerns about accuracy",
  "Technical issue / error", "No use case came up", "Other",
];

const EMPTY_FORM = {
  name: "", weekOf: getMonday(), frequency: "", useCases: [], blockers: [],
  biggestWin: "", stuckOn: "", nextWeekGoal: "", confidence: 3,
};

function getMonday() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().split("T")[0];
}

function toggleArr(arr, val) {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
}

function AccountabilityTracker() {
  useEffect(() => {
    if (document.getElementById("ff-fonts")) return;
    var l = document.createElement("link");
    l.id = "ff-fonts"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500&display=swap";
    document.head.appendChild(l);
    if(!document.getElementById("ff-font-rule")){var st=document.createElement("style");st.id="ff-font-rule";st.textContent='*{font-family:Inter,system-ui,sans-serif}[style*="font-weight: 700"],[style*="font-weight:700"],[style*="font-weight: 800"],[style*="font-weight:800"]{font-family:Poppins,system-ui,sans-serif}input,select,textarea{color:#F8FAFC}input::placeholder,textarea::placeholder{color:#64748B}select option{background:#1A0B2E;color:#F8FAFC}';document.head.appendChild(st);}
  }, []);

  const [checkins,  setCheckins]  = useState([]);
  const [intakes,   setIntakes]   = useState([]);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [view,      setView]      = useState("checkin");   // checkin | log | facilitator
  const [submitted, setSubmitted] = useState(false);
  const [filterName,setFilterName]= useState("all");

  useEffect(() => {
    (async () => {
      try {
        const [cr, ir] = await Promise.allSettled([
          window.storage.get("checkin-records-v1"),
          window.storage.get("intake-records-v1"),
        ]);
        if (cr.status === "fulfilled" && cr.value) setCheckins(JSON.parse(cr.value.value));
        if (ir.status === "fulfilled" && ir.value) setIntakes(JSON.parse(ir.value.value));
      } catch (e) { console.error(e); }
    })();
  }, []);

  const save = useCallback(async (recs) => {
    try { await window.storage.set("checkin-records-v1", JSON.stringify(recs)); } catch (e) { console.error(e); }
  }, []);

  function set(field, val) { setForm(prev => ({ ...prev, [field]: val })); }

  async function submit() {
    if (!form.name || !form.frequency) return;
    const rec = { ...form, id: Date.now(), createdAt: new Date().toISOString() };
    const next = [rec, ...checkins];
    setCheckins(next);
    await save(next);
    mirrorToNotion("checkin", rec, setCheckins, next, "checkin-records-v1");
    setSubmitted(true);
  }

  function newCheckin() { setForm({ ...EMPTY_FORM, weekOf: getMonday() }); setSubmitted(false); setView("checkin"); }

  const employeeNames = [...new Set(checkins.map(c => c.name))];
  const filtered = filterName === "all" ? checkins : checkins.filter(c => c.name === filterName);

  // ── Submitted confirmation ──
  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 400, padding: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>✅</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.done, marginBottom: 8 }}>Check-in submitted!</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Thanks {form.name}. Your facilitator will review this before your next session.</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={newCheckin} style={{ ...btn, background: C.primary, padding: "8px 16px", fontSize: 12 }}>Submit another</button>
            <button onClick={() => setView("log")} style={{ ...btn, background: "#CBD5E1", padding: "8px 16px", fontSize: 12 }}>View my history</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Facilitator view ──
  if (view === "facilitator") {
    const byEmployee = {};
    checkins.forEach(c => {
      if (!byEmployee[c.name]) byEmployee[c.name] = [];
      byEmployee[c.name].push(c);
    });
    const empList = Object.entries(byEmployee);

    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui" }}>
        <div style={{ background: C.navy, color: "#F8FAFC", padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: "#A855F7" }}>🔍 Facilitator View</span>
          <div style={{ flex: 1 }}/>
          <button onClick={() => setView("checkin")} style={btn}>← Check-in Form</button>
        </div>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 18px" }}>
          <NotionConfigPanel />
          {!empList.length
            ? <div style={{ color: C.muted, fontSize: 13, textAlign: "center", marginTop: 40 }}>No check-ins yet.</div>
            : empList.map(([name, recs]) => {
              const latest = recs[0];
              const freqColor = latest.frequency === "daily" || latest.frequency === "few_week" ? C.done : latest.frequency === "not_yet" ? C.blocked : C.accent;
              const avgConfidence = Math.round(recs.reduce((acc, r) => acc + r.confidence, 0) / recs.length * 10) / 10;
              return (
                <div key={name} style={{ background: "rgba(26,11,46,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "#F8FAFC" }}>{name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{recs.length} check-in{recs.length !== 1 ? "s" : ""} · Latest: {new Date(latest.weekOf).toLocaleDateString()}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ textAlign: "center", padding: "6px 10px", background: freqColor + "11", borderRadius: 4, border: `1px solid ${freqColor}33` }}>
                        <div style={{ fontSize: 14 }}>{FREQUENCY_OPTIONS.find(f => f.value === latest.frequency)?.emoji}</div>
                        <div style={{ fontSize: 9, color: freqColor, fontWeight: 700, textTransform: "uppercase" }}>This week</div>
                      </div>
                      <div style={{ textAlign: "center", padding: "6px 10px", background: C.primary + "11", borderRadius: 4, border: `1px solid ${C.primary}22` }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>{avgConfidence}</div>
                        <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase" }}>Avg conf.</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                    {latest.biggestWin && (
                      <div style={{ background: "rgba(52,211,153,0.10)", border: "1px solid #bbf7d0", borderRadius: 4, padding: 8 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.done, marginBottom: 4, textTransform: "uppercase" }}>Latest Win</div>
                        <div style={{ fontSize: 11, color: "#134e4a" }}>{latest.biggestWin}</div>
                      </div>
                    )}
                    {latest.stuckOn && (
                      <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 4, padding: 8 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, marginBottom: 4, textTransform: "uppercase" }}>Stuck On</div>
                        <div style={{ fontSize: 11, color: "#7c2d12" }}>{latest.stuckOn}</div>
                      </div>
                    )}
                  </div>

                  {latest.nextWeekGoal && (
                    <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 4, padding: 8, marginBottom: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.primary, marginBottom: 3, textTransform: "uppercase" }}>Their next goal → your session focus</div>
                      <div style={{ fontSize: 11, color: "#1e3a8a" }}>{latest.nextWeekGoal}</div>
                    </div>
                  )}

                  {latest.blockers.length > 0 && (
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {latest.blockers.map((b, i) => (
                        <span key={i} style={{ fontSize: 10, padding: "2px 7px", background: "#fef2f2", color: C.blocked, borderRadius: 3, border: "1px solid #fca5a5" }}>{b}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

  // ── Log view ──
  if (view === "log") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui" }}>
        <div style={{ background: C.navy, color: "#F8FAFC", padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: "#A855F7" }}>📋 Check-in History</span>
          <div style={{ flex: 1 }}/>
          <button onClick={() => setView("facilitator")} style={{ ...btn, background: "#CBD5E1" }}>🔍 Facilitator View</button>
          <button onClick={newCheckin} style={{ ...btn, background: C.done }}>+ Check In</button>
        </div>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 18px" }}>
          {employeeNames.length > 1 && (
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {["all", ...employeeNames].map(n => (
                <button key={n} onClick={() => setFilterName(n)}
                  style={{ padding: "3px 10px", borderRadius: 4, border: `1px solid ${filterName === n ? C.primary : C.border}`, background: filterName === n ? C.primary + "11" : "#F8FAFC", color: filterName === n ? C.primary : "#CBD5E1", fontSize: 11, cursor: "pointer", fontFamily: "system-ui" }}>
                  {n === "all" ? "All" : n}
                </button>
              ))}
            </div>
          )}
          {!filtered.length
            ? <div style={{ color: C.muted, fontSize: 13, textAlign: "center", marginTop: 40 }}>No check-ins yet.</div>
            : filtered.map(rec => {
              const freq = FREQUENCY_OPTIONS.find(f => f.value === rec.frequency);
              return (
                <div key={rec.id} style={{ background: "rgba(26,11,46,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 6, padding: "12px 14px", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>{freq?.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: "#F8FAFC" }}>{rec.name} · Week of {new Date(rec.weekOf).toLocaleDateString()}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{freq?.label} · Confidence: {rec.confidence}/5</div>
                    </div>
                  </div>
                  {rec.biggestWin && <div style={{ fontSize: 11, color: "#134e4a", background: "rgba(52,211,153,0.10)", padding: "4px 8px", borderRadius: 3, marginBottom: 4 }}>✅ {rec.biggestWin}</div>}
                  {rec.stuckOn && <div style={{ fontSize: 11, color: "#7c2d12", background: "#fff7ed", padding: "4px 8px", borderRadius: 3 }}>⚠ {rec.stuckOn}</div>}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

  // ── CHECK-IN FORM ──
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui" }}>
      <div style={{ background: C.navy, color: "#F8FAFC", padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: "#A855F7" }}>⚡ Weekly Claude Check-In</span>
        <div style={{ flex: 1 }}/>
        {checkins.length > 0 && <button onClick={() => setView("facilitator")} style={{ ...btn, background: "#CBD5E1" }}>🔍 Facilitator View</button>}
        {checkins.length > 0 && <button onClick={() => setView("log")} style={{ ...btn, background: "#CBD5E1" }}>📋 History</button>}
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 18px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: C.muted }}>
            Takes about 2 minutes. Helps your facilitator prepare for your next session.
          </div>
        </div>

        {/* Name + week */}
        <div style={{ background: "rgba(26,11,46,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
            <div>
              <div style={labelStyle}>Your Name *</div>
              {intakes.length > 0 ? (
                <select value={form.name} onChange={e => set("name", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">Select name…</option>
                  {[...new Set(intakes.map(i => i.name))].map(n => <option key={n} value={n}>{n}</option>)}
                  <option value="__custom__">Other (type below)</option>
                </select>
              ) : (
                <input value={form.name} onChange={e => set("name", e.target.value)} style={inputStyle} placeholder="Your name"/>
              )}
              {form.name === "__custom__" && <input value="" onChange={e => set("name", e.target.value)} style={inputStyle} placeholder="Type your name"/>}
            </div>
            <div>
              <div style={labelStyle}>Week of</div>
              <input value={form.weekOf} onChange={e => set("weekOf", e.target.value)} type="date" style={inputStyle}/>
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div style={{ background: "rgba(26,11,46,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 12 }}>How often did you use Claude this week? *</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {FREQUENCY_OPTIONS.map(f => (
              <button key={f.value} onClick={() => set("frequency", f.value)}
                style={{ padding: "8px 14px", borderRadius: 6, border: `2px solid ${form.frequency === f.value ? C.primary : C.border}`, background: form.frequency === f.value ? C.primary + "11" : "#F8FAFC", cursor: "pointer", fontFamily: "system-ui", transition: "all 0.1s" }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>{f.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: form.frequency === f.value ? C.primary : "#CBD5E1" }}>{f.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Use cases this week */}
        <div style={{ background: "rgba(26,11,46,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>What did you use it for?</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {USE_CASE_TAGS.map(tag => {
              const sel = form.useCases.includes(tag);
              return (
                <button key={tag} onClick={() => set("useCases", toggleArr(form.useCases, tag))}
                  style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${sel ? C.done : C.border}`, background: sel ? C.done + "11" : "#F8FAFC", color: sel ? C.done : "#CBD5E1", fontSize: 11, cursor: "pointer", fontFamily: "system-ui", fontWeight: sel ? 700 : 400 }}>
                  {sel ? "✓ " : ""}{tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Win */}
        <div style={{ background: "rgba(26,11,46,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>Biggest win this week</div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>A task Claude helped with, time saved, or something that worked well.</div>
          <textarea value={form.biggestWin} onChange={e => set("biggestWin", e.target.value)}
            style={{ ...inputStyle, height: 60, resize: "vertical", marginBottom: 0 }} placeholder="e.g. 'Drafted the Q3 update email in 5 minutes instead of 30'"/>
        </div>

        {/* Blockers */}
        <div style={{ background: "rgba(26,11,46,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>What got in the way?</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {BLOCKER_TAGS.map(tag => {
              const sel = form.blockers.includes(tag);
              return (
                <button key={tag} onClick={() => set("blockers", toggleArr(form.blockers, tag))}
                  style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${sel ? C.blocked : C.border}`, background: sel ? "#fef2f2" : "#F8FAFC", color: sel ? C.blocked : "#CBD5E1", fontSize: 11, cursor: "pointer", fontFamily: "system-ui", fontWeight: sel ? 700 : 400 }}>
                  {tag}
                </button>
              );
            })}
          </div>
          <textarea value={form.stuckOn} onChange={e => set("stuckOn", e.target.value)} style={{ ...inputStyle, height: 50, resize: "vertical", marginTop: 8, marginBottom: 0 }} placeholder="What specifically were you trying to do when it didn't work?"/>
        </div>

        {/* Confidence + goal */}
        <div style={{ background: "rgba(26,11,46,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Confidence using Claude: {form.confidence}/5</div>
            <input type="range" min="1" max="5" value={form.confidence} onChange={e => set("confidence", +e.target.value)}
              style={{ width: "100%", accentColor: C.primary }}/>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted, marginTop: 2 }}>
              <span>1 — Still learning</span><span>3 — Getting it</span><span>5 — Confident</span>
            </div>
          </div>
          <div>
            <div style={labelStyle}>What do you want to try next week?</div>
            <textarea value={form.nextWeekGoal} onChange={e => set("nextWeekGoal", e.target.value)}
              style={{ ...inputStyle, height: 50, resize: "vertical", marginBottom: 0 }} placeholder="e.g. 'I want to try connecting Notion and searching my docs through Claude'"/>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={submit} disabled={!form.name || !form.frequency}
            style={{ padding: "10px 24px", borderRadius: 4, border: "none", cursor: form.name && form.frequency ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 700, fontFamily: "system-ui", background: form.name && form.frequency ? C.done : "rgba(168,85,247,0.2)", color: form.name && form.frequency ? "#F8FAFC" : C.muted }}>
            Submit Check-In →
          </button>
        </div>
      </div>
    </div>
  );
}

const btn        = { padding: "5px 12px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "system-ui", color: "#F8FAFC" };
const labelStyle = { fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 4 };
const inputStyle = { width: "100%", padding: "7px 9px", borderRadius: 4, border: `1px solid ${C.border}`, fontSize: 12, fontFamily: "system-ui", outline: "none", color: "#F8FAFC", marginBottom: 10 };

export default AccountabilityTracker;
