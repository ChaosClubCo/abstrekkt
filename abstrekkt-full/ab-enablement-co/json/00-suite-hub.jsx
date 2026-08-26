import { useState, useEffect, useCallback } from "react";

// ── Design system: Reading Room at Midnight — Variant B ──────────────────────
const T = {
  bg:"#0c0c0b",surface:"#111110",card:"#181815",border:"#232320",
  borderHi:"#303030",accent:"#d4893a",accentHi:"#e8a050",text:"#ddd8ce",
  text2:"#807c74",text3:"#3a3835",green:"#5a9c5a",mono:"#7ab878",
  mono2:"#78afc8",red:"#c05050",tag:"#1e1e1a",
};
const F = { serif:"'Playfair Display',Georgia,serif", sans:"'IBM Plex Sans',sans-serif", mono:"'IBM Plex Mono',monospace" };
const radius = "2px";
const tr = "0.15s";

const TOOLS = [
  { id:"flowchart", num:null, label:"Enablement Flowchart", description:"Session delivery flowchart — INT brand", store:null, sync:false, status:"delivery" },
  { id:"intake",    num:"01", label:"Pre-Session Intake",   description:"Employee profile → session brief",     store:"intake-records-v1",   sync:true,  status:"before" },
  { id:"prompts",   num:"02", label:"Prompt Package Builder",description:"AI-generated tailored prompt packages", store:"prompt-packages-v1",  sync:false, status:"before" },
  { id:"selfguide", num:"03", label:"Employee Self-Service", description:"15-step setup guide, self-directed",   store:"self-setup-v1",       sync:false, status:"employee" },
  { id:"outcomes",  num:"04", label:"Session Outcome Tracker",description:"Outcome log, QC gate, open gaps",    store:"outcome-records-v1",  sync:true,  status:"after" },
  { id:"checkins",  num:"05", label:"Accountability Tracker",description:"Weekly employee check-ins",           store:"checkin-records-v1",  sync:true,  status:"between" },
  { id:"objections",num:"06", label:"Objection Handler",     description:"AI answers to custom objections",     store:null,                  sync:false, status:"during" },
  { id:"report",    num:"07", label:"Program Health Report",  description:"AI-generated stakeholder narrative",  store:null,                  sync:false, status:"reporting" },
];

const SYNC_STORES = ["intake-records-v1","outcome-records-v1","checkin-records-v1"];

const PHASE_COLORS = {
  before:  T.mono2,
  delivery:T.accent,
  during:  T.accent,
  after:   T.mono,
  between: T.text2,
  employee:T.mono2,
  reporting:T.text2,
};

export default function SuiteHub() {
  const [counts, setCounts]   = useState({});
  const [syncing, setSyncing] = useState({});
  const [syncLog, setSyncLog] = useState([]);
  const [error, setError]     = useState(null);
  const [activePhase, setActivePhase] = useState("all");

  // ── inject fonts + root vars ──────────────────────────────────────────────
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `*{box-sizing:border-box;margin:0;padding:0}body{background:${T.bg};color:${T.text};font-family:${F.sans}}`;
    document.head.appendChild(style);
  }, []);

  // ── load storage counts ───────────────────────────────────────────────────
  const loadCounts = useCallback(async () => {
    const next = {};
    for (const store of SYNC_STORES) {
      try {
        const result = await window.storage.get(store);
        if (result) {
          const parsed = JSON.parse(result.value);
          next[store] = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length;
        } else {
          next[store] = 0;
        }
      } catch {
        next[store] = 0;
      }
    }
    // prompt packages
    try {
      const r = await window.storage.get("prompt-packages-v1");
      next["prompt-packages-v1"] = r ? Object.keys(JSON.parse(r.value)).length : 0;
    } catch { next["prompt-packages-v1"] = 0; }
    setCounts(next);
  }, []);

  useEffect(() => { loadCounts(); }, [loadCounts]);

  // ── notion sync ───────────────────────────────────────────────────────────
  const syncToNotion = useCallback(async (store) => {
    setSyncing(s => ({ ...s, [store]: true }));
    setError(null);
    const ctrl = new AbortController();
    try {
      let storeData = null;
      try {
        const r = await window.storage.get(store);
        storeData = r ? JSON.parse(r.value) : [];
      } catch { storeData = []; }

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Summarize the following store data for a Notion sync confirmation. Store: ${store}. Record count: ${Array.isArray(storeData) ? storeData.length : Object.keys(storeData).length}. Respond in 1-2 sentences confirming what was synced.`
          }]
        })
      });
      if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
      const data = await res.json();
      const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
      setSyncLog(l => [{ store, text, ts: new Date().toLocaleTimeString() }, ...l.slice(0,9)]);
    } catch (e) {
      if (e.name !== "AbortError") setError(`Sync failed for ${store}: ${e.message}`);
    } finally {
      setSyncing(s => ({ ...s, [store]: false }));
    }
  }, []);

  const phases = ["all","before","during","after","between","employee","reporting"];
  const visibleTools = activePhase === "all" ? TOOLS : TOOLS.filter(t => t.status === activePhase);

  // ── styles ────────────────────────────────────────────────────────────────
  const s = {
    root:  { minHeight:"100vh", background:T.bg, padding:"32px 28px", fontFamily:F.sans },
    hdr:   { borderBottom:`1px solid ${T.border}`, paddingBottom:"20px", marginBottom:"28px" },
    title: { fontFamily:F.serif, fontSize:"26px", fontWeight:700, color:T.text, letterSpacing:"-0.5px" },
    sub:   { fontSize:"12px", fontFamily:F.mono, color:T.text2, marginTop:"4px", letterSpacing:"0.04em" },
    tabs:  { display:"flex", gap:"0", marginBottom:"24px", borderBottom:`1px solid ${T.border}` },
    tab:   (active) => ({
      padding:"8px 14px", fontSize:"11px", fontFamily:F.mono, letterSpacing:"0.06em",
      color: active ? T.accent : T.text2, background:"transparent", border:"none",
      borderBottom: active ? `1px solid ${T.accent}` : "1px solid transparent",
      cursor:"pointer", textTransform:"uppercase",
      transition:`color ${tr}, border-color ${tr}`, marginBottom:"-1px",
    }),
    grid:  { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"12px" },
    card:  (hover) => ({
      background: hover ? T.surface : T.card,
      border:`1px solid ${hover ? T.borderHi : T.border}`,
      borderRadius:radius, padding:"16px", cursor:"pointer",
      transition:`background ${tr}, border-color ${tr}`,
    }),
    cardNum:  { fontFamily:F.mono, fontSize:"10px", color:T.text3, marginBottom:"6px" },
    cardTitle:{ fontFamily:F.serif, fontSize:"15px", fontWeight:600, color:T.text, marginBottom:"4px" },
    cardDesc: { fontSize:"12px", color:T.text2, lineHeight:"1.5", marginBottom:"10px" },
    badge:  (color) => ({
      display:"inline-block", fontFamily:F.mono, fontSize:"10px",
      color:color, background:T.tag, padding:"2px 6px", borderRadius:radius,
      letterSpacing:"0.04em",
    }),
    storeRow:{ display:"flex", alignItems:"center", justifyContent:"space-between",
               padding:"10px 0", borderBottom:`1px solid ${T.border}` },
    storeLabel:{ fontFamily:F.mono, fontSize:"11px", color:T.text2 },
    storeCount:{ fontFamily:F.mono, fontSize:"11px", color:T.mono },
    syncBtn: (loading) => ({
      fontFamily:F.mono, fontSize:"10px", letterSpacing:"0.06em",
      color: loading ? T.text3 : T.accent, background:"transparent",
      border:`1px solid ${loading ? T.border : T.accent}`,
      borderRadius:radius, padding:"3px 8px", cursor: loading ? "not-allowed" : "pointer",
      transition:`color ${tr}, border-color ${tr}`,
    }),
    section:{ marginTop:"28px" },
    sectionTitle:{ fontFamily:F.mono, fontSize:"10px", letterSpacing:"0.08em",
                   color:T.text3, textTransform:"uppercase", marginBottom:"12px" },
    logItem:{ fontFamily:F.sans, fontSize:"12px", color:T.text2, padding:"6px 0",
              borderBottom:`1px solid ${T.border}`, lineHeight:"1.4" },
    logTs:  { fontFamily:F.mono, fontSize:"10px", color:T.text3, marginRight:"8px" },
    err:    { background:T.tag, border:`1px solid ${T.red}`, borderRadius:radius,
              padding:"10px 14px", fontSize:"12px", color:T.red, marginBottom:"16px",
              fontFamily:F.mono },
  };

  return (
    <div style={s.root}>
      {/* Header */}
      <div style={s.hdr}>
        <div style={s.title}>◆ Claude Enablement Suite</div>
        <div style={s.sub}>SUITE HUB · v2.0 · claude-sonnet-4-6</div>
      </div>

      {error && <div style={s.err}>✗ {error}</div>}

      {/* Phase filter tabs */}
      <div style={s.tabs}>
        {phases.map(p => (
          <button key={p} style={s.tab(activePhase===p)} onClick={() => setActivePhase(p)}>
            {p}
          </button>
        ))}
      </div>

      {/* Tool grid */}
      <div style={s.grid}>
        {visibleTools.map(tool => {
          const [hov, setHov] = useState(false);
          const count = counts[tool.store];
          return (
            <div key={tool.id} style={s.card(hov)}
                 onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
              <div style={s.cardNum}>{tool.num ? `ARTIFACT ${tool.num}` : "DELIVERY"}</div>
              <div style={s.cardTitle}>{tool.label}</div>
              <div style={s.cardDesc}>{tool.description}</div>
              <div style={{ display:"flex", gap:"6px", alignItems:"center", flexWrap:"wrap" }}>
                <span style={s.badge(PHASE_COLORS[tool.status])}>{tool.status}</span>
                {tool.store && count !== undefined && (
                  <span style={s.badge(T.text3)}>{count} records</span>
                )}
                {tool.sync && <span style={s.badge(T.mono)}>◆ notion sync</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Notion Sync */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Notion Sync — 3 Managed Stores</div>
        {SYNC_STORES.map(store => (
          <div key={store} style={s.storeRow}>
            <span style={s.storeLabel}>{store}</span>
            <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
              <span style={s.storeCount}>{counts[store] ?? "—"} records</span>
              <button style={s.syncBtn(!!syncing[store])}
                      disabled={!!syncing[store]}
                      onClick={() => syncToNotion(store)}>
                {syncing[store] ? "syncing…" : "↑ sync"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sync log */}
      {syncLog.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionTitle}>Sync Log</div>
          {syncLog.map((entry, i) => (
            <div key={i} style={s.logItem}>
              <span style={s.logTs}>{entry.ts}</span>
              <span style={{ color:T.text3, marginRight:"6px" }}>[{entry.store}]</span>
              {entry.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
