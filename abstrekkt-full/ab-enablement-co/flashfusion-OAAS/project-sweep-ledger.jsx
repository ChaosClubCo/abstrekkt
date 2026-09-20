import { useState, useEffect, useCallback } from "react";

// ── PROJECT SWEEP LEDGER ─────────────────────────────────────────
// Persists via window.storage (survives sessions + project moves,
// because the artifact lives in this chat, not in any project).
// Protocol: on every project move, Claude sweeps + outputs a JSON
// entry → paste into Import. Storage key: single batched key.

const KEY = "sweep-ledger-v1";

const SEED = [
  {
    id: 1,
    project: "Original project (multi-MCP audit)",
    date: "2026-06-06 AM",
    chatsSearched: "Project-scoped + cross-refs",
    filesRead: "90+ project files indexed",
    mcpsProbed: "Notion · Base44 (both apps) · Drive · Todoist · GitHub-via-Notion · n8n (tools didn't surface)",
    coverage: 85,
    answers: "All 6 Cowork wikis read in full · Anthropic intel page (40+ entries) confirmed reachable · Fusion AI = 102 schemas, 0 records · Google/OpenAI/MS intel pages DON'T EXIST · June 15 deadlines surfaced",
    openQuestions: "Linear/Slack never queried · consulting-ops app record counts unchecked",
    mapVersion: "v2 baseline"
  },
  {
    id: 2,
    project: "New project #1",
    date: "2026-06-06 mid",
    chatsSearched: "40 chats (May 15 → Jun 6)",
    filesRead: "0 — project had zero files",
    mcpsProbed: "None re-run (chat-derived state only)",
    coverage: 60,
    answers: "4 v2 blind spots resolved (memoir skeleton, intel tracker, n8n runbook, public-presence docs) · plain-text API keys in Drive · June 5 Drive folder spray · skill persistence question · flashnframe unverified",
    openQuestions: "Repo count contradiction (591 vs 628) · NotebookLM consolidation status",
    mapVersion: "v3"
  },
  {
    id: 3,
    project: "New project #2 (current)",
    date: "2026-06-06 late",
    chatsSearched: "20 new-scope chats (18 unseen by sweep #2)",
    filesRead: "0 — project has zero files",
    mcpsProbed: "None re-run; findings from logged live audits (B44 full portfolio Jun 4, Composio GitHub Jun 4, n8n credentials Jun 2)",
    coverage: 70,
    answers: "Revenue funnel = ZERO end-to-end (0 clients/submissions/enrollments/orders, Calendly unpublished) · 741 repos counted (632+109), contradiction killed · n8n 0/7 pipeline credentials · AgentOS passes 6–12 unexecuted · rifts.to secretly live (227 responses)",
    openQuestions: "skills-pipeline vs 259-skill queue · Fusion AI→SparkAcademy course migration · TESSA deletion (UI-only)",
    mapVersion: "v4"
  }
];

const C = {
  bg: "#0b0d10", panel: "#13161b", panel2: "#181c22", line: "#242a32",
  txt: "#e7ebf0", dim: "#8b95a3", faint: "#5a6470",
  amber: "#e8a33d", ok: "#4cc38a", red: "#ff5d5d", blue: "#5d8fdb"
};
const mono = "'IBM Plex Mono', 'Courier New', monospace";
const sans = "'Archivo', system-ui, sans-serif";

function covColor(p) { return p >= 75 ? C.ok : p >= 45 ? C.amber : C.red; }

export default function SweepLedger() {
  const [entries, setEntries] = useState(null);
  const [err, setErr] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [importTxt, setImportTxt] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [toast, setToast] = useState("");

  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 2200); };

  const persist = useCallback(async (list) => {
    try { await window.storage.set(KEY, JSON.stringify(list)); }
    catch (e) { setErr("Storage write failed — use Export as backup."); }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(KEY);
        setEntries(r && r.value ? JSON.parse(r.value) : SEED);
        if (!r || !r.value) { try { await window.storage.set(KEY, JSON.stringify(SEED)); } catch {} }
      } catch {
        setEntries(SEED);
        try { await window.storage.set(KEY, JSON.stringify(SEED)); } catch {}
      }
    })();
  }, []);

  const doImport = async () => {
    setErr("");
    try {
      const raw = importTxt.trim();
      const slice = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
      const obj = JSON.parse(slice.startsWith("{") ? slice : raw);
      const arr = Array.isArray(obj) ? obj : [obj];
      const maxId = Math.max(0, ...entries.map(e => e.id || 0));
      const cleaned = arr.map((o, i) => ({
        id: maxId + i + 1,
        project: String(o.project || "Untitled project"),
        date: String(o.date || new Date().toISOString().slice(0, 10)),
        chatsSearched: String(o.chatsSearched || "—"),
        filesRead: String(o.filesRead || "—"),
        mcpsProbed: String(o.mcpsProbed || "—"),
        coverage: Math.max(0, Math.min(100, Number(o.coverage) || 0)),
        answers: String(o.answers || ""),
        openQuestions: String(o.openQuestions || ""),
        mapVersion: String(o.mapVersion || "—")
      }));
      const next = [...entries, ...cleaned];
      setEntries(next); await persist(next);
      setImportTxt(""); setShowImport(false);
      flash(`Logged ${cleaned.length} entr${cleaned.length === 1 ? "y" : "ies"}`);
    } catch (e) { setErr("Couldn't parse that JSON — paste exactly what Claude output."); }
  };

  const del = async (id) => {
    const next = entries.filter(e => e.id !== id);
    setEntries(next); await persist(next); flash("Entry removed");
  };

  const copyAll = () => {
    const ta = document.createElement("textarea");
    ta.value = JSON.stringify(entries, null, 2);
    document.body.appendChild(ta); ta.select();
    document.execCommand("copy"); document.body.removeChild(ta);
    flash("Full ledger copied — back it up somewhere external");
  };

  const reset = async () => {
    if (!window.confirm("Reset ledger to seed entries? Export first if you need a backup.")) return;
    setEntries(SEED); await persist(SEED); flash("Reset to seed");
  };

  const askClaude = () => {
    if (typeof sendPrompt === "function") {
      sendPrompt("Generate a Project Sweep Ledger JSON entry for the CURRENT project state — fields: project, date, chatsSearched, filesRead, mcpsProbed, coverage (0-100), answers, openQuestions, mapVersion. Output ONLY the JSON object in a code block so I can paste it into the ledger's Import box.");
    } else flash("sendPrompt unavailable here — ask Claude in chat for a ledger entry");
  };

  if (!entries) return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: C.dim, fontFamily: mono, fontSize: 13 }}>
      loading ledger…
    </div>
  );

  const avg = entries.length ? Math.round(entries.reduce((a, e) => a + (e.coverage || 0), 0) / entries.length) : 0;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.txt, fontFamily: sans, padding: "28px 22px 70px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 980, margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, borderBottom: `1px solid ${C.line}`, paddingBottom: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.5px", textTransform: "uppercase" }}>
              Project Sweep <span style={{ color: C.amber }}>Ledger</span>
            </div>
            <div style={{ fontFamily: mono, fontSize: 11, color: C.dim, marginTop: 5 }}>
              one entry per project move · how deep each scope was actually searched · 6-month YC runway
            </div>
          </div>
          <div style={{ fontFamily: mono, fontSize: 11, color: C.faint, textAlign: "right" }}>
            {entries.length} sweeps · avg depth <span style={{ color: covColor(avg) }}>{avg}%</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
          <Btn onClick={askClaude} primary>⌁ Ask Claude for current entry</Btn>
          <Btn onClick={() => setShowImport(s => !s)}>{showImport ? "× Close import" : "+ Paste JSON entry"}</Btn>
          <Btn onClick={copyAll}>⎘ Export all</Btn>
          <Btn onClick={reset} danger>Reset</Btn>
        </div>

        {err && <div style={{ fontFamily: mono, fontSize: 12, color: C.red, background: "rgba(255,93,93,.08)", border: `1px solid rgba(255,93,93,.3)`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>{err}</div>}

        {showImport && (
          <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
            <div style={{ fontFamily: mono, fontSize: 11, color: C.dim, marginBottom: 8 }}>
              Paste the JSON entry Claude output after a sweep (single object or array):
            </div>
            <textarea value={importTxt} onChange={e => setImportTxt(e.target.value)} rows={7} spellCheck={false}
              style={{ width: "100%", background: C.bg, color: C.txt, border: `1px solid ${C.line}`, borderRadius: 8, padding: 12, fontFamily: mono, fontSize: 12, resize: "vertical", boxSizing: "border-box" }}
              placeholder='{"project":"...","date":"...","chatsSearched":"...","filesRead":"...","mcpsProbed":"...","coverage":70,"answers":"...","openQuestions":"...","mapVersion":"v5"}' />
            <div style={{ marginTop: 10 }}><Btn onClick={doImport} primary>Log entry</Btn></div>
          </div>
        )}

        {[...entries].reverse().map((e, idx) => {
          const open = expanded === e.id;
          const latest = idx === 0;
          return (
            <div key={e.id} onClick={() => setExpanded(open ? null : e.id)}
              style={{ background: latest ? C.panel2 : C.panel, border: `1px solid ${latest ? "rgba(232,163,61,.35)" : C.line}`, borderRadius: 10, padding: "16px 18px", marginBottom: 12, cursor: "pointer", transition: "border-color .15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: mono, fontSize: 10, color: C.faint }}>#{e.id}</span>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{e.project}</span>
                  {latest && <span style={{ fontFamily: mono, fontSize: 9.5, color: C.amber, border: `1px solid rgba(232,163,61,.4)`, borderRadius: 999, padding: "2px 9px", letterSpacing: ".5px" }}>CURRENT</span>}
                  <span style={{ fontFamily: mono, fontSize: 10.5, color: C.faint }}>{e.date}</span>
                  <span style={{ fontFamily: mono, fontSize: 10.5, color: C.blue }}>map {e.mapVersion}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 90, height: 5, background: "#1f242b", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${e.coverage}%`, height: "100%", background: covColor(e.coverage), borderRadius: 3 }} />
                  </div>
                  <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 600, color: covColor(e.coverage), minWidth: 36, textAlign: "right" }}>{e.coverage}%</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "6px 18px", marginTop: 12, fontFamily: mono, fontSize: 11, color: C.dim }}>
                <div><span style={{ color: C.faint }}>chats </span>{e.chatsSearched}</div>
                <div><span style={{ color: C.faint }}>files </span>{e.filesRead}</div>
                <div><span style={{ color: C.faint }}>mcps </span>{e.mcpsProbed}</div>
              </div>

              {open && (
                <div style={{ marginTop: 14, borderTop: `1px solid ${C.line}`, paddingTop: 14 }} onClick={ev => ev.stopPropagation()}>
                  <Field label="ANSWERS THIS PROJECT GAVE" color={C.ok} text={e.answers} />
                  <Field label="STILL OPEN" color={C.red} text={e.openQuestions} />
                  <button onClick={() => del(e.id)}
                    style={{ marginTop: 8, background: "transparent", border: `1px solid rgba(255,93,93,.3)`, color: C.red, fontFamily: mono, fontSize: 10.5, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>
                    delete entry
                  </button>
                </div>
              )}
            </div>
          );
        })}

        <div style={{ marginTop: 30, fontFamily: mono, fontSize: 10.5, color: C.faint, lineHeight: 1.8, borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>
          PROTOCOL (stored in Claude's memory #16): move chat → Claude sweeps new scope → updates blind-spot map → outputs JSON entry → paste here.
          Storage = window.storage (survives sessions; artifact lives in the chat, not the project). Export regularly — storage is durable but not sacred.
        </div>
        {toast && <div style={{ position: "fixed", bottom: 22, left: "50%", transform: "translateX(-50%)", background: C.panel2, border: `1px solid ${C.line}`, color: C.txt, fontFamily: mono, fontSize: 12, borderRadius: 999, padding: "9px 20px" }}>{toast}</div>}
      </div>
    </div>
  );
}

function Btn({ children, onClick, primary, danger }) {
  return (
    <button onClick={onClick}
      style={{
        background: primary ? C.txt : "transparent",
        color: primary ? C.bg : danger ? C.red : C.dim,
        border: `1px solid ${primary ? C.txt : danger ? "rgba(255,93,93,.35)" : C.line}`,
        fontFamily: mono, fontSize: 12, fontWeight: primary ? 600 : 400,
        borderRadius: 999, padding: "8px 18px", cursor: "pointer"
      }}>{children}</button>
  );
}

function Field({ label, color, text }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: "1.5px", color, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, color: C.txt, lineHeight: 1.6 }}>{text || "—"}</div>
    </div>
  );
}
