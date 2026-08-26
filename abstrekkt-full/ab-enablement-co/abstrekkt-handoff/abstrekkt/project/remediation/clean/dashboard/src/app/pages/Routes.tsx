import React, { useState } from "react";
import { Route as RouteIcon, Cpu, Plus } from "lucide-react";

type R = { id: string; status: "live" | "paused"; reqs: string; pool: string[]; tags: string[] };

const ROUTES: R[] = [
  { id: "support-triage", status: "live", reqs: "18.2k", pool: ["Claude Sonnet 4.5", "Claude Haiku 4"], tags: ["support"] },
  { id: "docs-summarize", status: "live", reqs: "9.4k", pool: ["Claude Haiku 4", "GPT-4o"], tags: ["content"] },
  { id: "vision-extract", status: "paused", reqs: "2.1k", pool: ["GPT-4o", "Claude Sonnet 4.5"], tags: ["vision"] },
  { id: "code-review", status: "live", reqs: "6.7k", pool: ["Claude Sonnet 4.5"], tags: ["code"] },
];

export function Routes() {
  const [sel, setSel] = useState<string | null>(null);
  const r = ROUTES.find((x) => x.id === sel);

  if (r) return (
    <div className="page" style={{ maxWidth: 840 }}>
      <div className="page-head">
        <div>
          <button className="btn btn-ghost" style={{ padding: "2px 0", marginBottom: 8 }} onClick={() => setSel(null)}>← All routes</button>
          <h1 className="page-title mono" style={{ fontSize: "1.3rem" }}>{r.id}</h1>
        </div>
        <span className="chip" style={{ color: r.status === "live" ? "var(--green)" : "var(--amber)", borderColor: "currentColor" }}>{r.status}</span>
      </div>
      <div className="card card-pad" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: "0.82rem", fontWeight: 600, marginBottom: 14 }}>Model pool · ordered fallback</div>
        {r.pool.map((m, i) => (
          <div key={m} className="card card-pad" style={{ background: "var(--surface-2)", marginBottom: 8, display: "flex", alignItems: "center", gap: 12, padding: "11px 13px" }}>
            <span className="chip mono" style={{ fontSize: "0.62rem" }}>{i === 0 ? "primary" : "fallback " + i}</span>
            <span style={{ fontSize: "0.85rem", flex: 1 }}>{m}</span>
            <Cpu size={14} color="var(--muted)" />
          </div>
        ))}
        <button className="btn" style={{ marginTop: 6 }}><Plus size={13} /> Add fallback</button>
      </div>
      <div className="grid grid-2">
        <div className="card card-pad"><div className="muted" style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Match tags</div><div style={{ marginTop: 10, display: "flex", gap: 6 }}>{r.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div></div>
        <div className="card card-pad"><div className="muted" style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Requests (24h)</div><div style={{ fontSize: "1.5rem", fontWeight: 650, marginTop: 8 }}>{r.reqs}</div></div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="page-head"><div><h1 className="page-title">Routes</h1><p className="page-sub">Model pools and fallback chains.</p></div><button className="btn btn-primary"><Plus size={14} /> New route</button></div>
      <div className="card" style={{ overflow: "hidden" }}>
        {ROUTES.map((r, i) => (
          <button key={r.id} onClick={() => setSel(r.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", border: "none", borderTop: i ? "1px solid var(--border)" : "none", background: "transparent", cursor: "pointer", textAlign: "left", color: "var(--text)" }}>
            <RouteIcon size={16} color="var(--indigo)" />
            <span className="mono" style={{ fontSize: "0.85rem", flex: 1 }}>{r.id}</span>
            <span className="muted" style={{ fontSize: "0.76rem" }}>{r.pool.length} models</span>
            <span className="muted mono" style={{ fontSize: "0.76rem", width: 60, textAlign: "right" }}>{r.reqs}</span>
            <span className="chip" style={{ color: r.status === "live" ? "var(--green)" : "var(--amber)", borderColor: "currentColor", fontSize: "0.64rem" }}>{r.status}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
