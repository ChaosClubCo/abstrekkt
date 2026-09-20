import React from "react";

function spark(data: number[], w: number, h: number) {
  const max = Math.max(...data), min = Math.min(...data);
  return data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * h}`).join(" ");
}

const COST: [string, number, string][] = [
  ["Claude Sonnet 4.5", 842, "#5e6ad2"],
  ["Claude Haiku 4", 214, "#8b5cf6"],
  ["GPT-4o", 561, "#22c55e"],
  ["Llama 3.1", 90, "#e0a23b"],
];

export function Analytics() {
  const reqs = [12, 18, 15, 22, 19, 28, 24, 31, 27, 35, 30, 38];
  const total = COST.reduce((s, c) => s + c[1], 0);
  return (
    <div className="page">
      <div className="page-head">
        <div><h1 className="page-title">Analytics</h1><p className="page-sub">Volume, latency, and cost across routes.</p></div>
        <div style={{ display: "flex", gap: 6 }}>{["24h", "7d", "30d"].map((t, i) => <span key={t} className="chip" style={{ cursor: "pointer", background: i === 1 ? "var(--indigo)" : "var(--surface-2)", borderColor: i === 1 ? "var(--indigo)" : "var(--border-2)", color: i === 1 ? "#fff" : "var(--text-dim)" }}>{t}</span>)}</div>
      </div>
      <div className="grid grid-4" style={{ marginBottom: 14 }}>
        {[["Requests", "248k"], ["p50 latency", "291 ms"], ["p95 latency", "742 ms"], ["Cache hit-rate", "63%"]].map((s) => (
          <div key={s[0]} className="card card-pad stat"><span className="label">{s[0]}</span><div className="value">{s[1]}</div></div>
        ))}
      </div>
      <div className="grid grid-2">
        <div className="card card-pad">
          <div style={{ fontSize: "0.82rem", fontWeight: 600, marginBottom: 14 }}>Request volume · 7d</div>
          <svg viewBox="0 0 300 90" style={{ width: "100%", height: 120 }}>
            <defs><linearGradient id="ffspark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5e6ad2" /><stop offset="1" stopColor="#5e6ad2" stopOpacity="0" /></linearGradient></defs>
            <polyline fill="url(#ffspark)" stroke="none" points={`0,90 ${spark(reqs, 300, 80)} 300,90`} opacity={0.18} />
            <polyline fill="none" stroke="#5e6ad2" strokeWidth={2} points={spark(reqs, 300, 80)} />
          </svg>
        </div>
        <div className="card card-pad">
          <div style={{ fontSize: "0.82rem", fontWeight: 600, marginBottom: 14 }}>Cost by model · MTD</div>
          {COST.map((c) => (
            <div key={c[0]} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 5 }}><span>{c[0]}</span><span className="muted mono">${c[1]}</span></div>
              <div className="bar"><span style={{ width: (c[1] / total * 100) + "%", background: c[2] }} /></div>
            </div>
          ))}
          <div className="muted mono" style={{ fontSize: "0.72rem", textAlign: "right", marginTop: 10 }}>total ${total}</div>
        </div>
      </div>
    </div>
  );
}
