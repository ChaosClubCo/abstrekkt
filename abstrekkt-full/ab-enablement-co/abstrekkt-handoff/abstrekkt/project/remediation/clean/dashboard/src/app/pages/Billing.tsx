import React from "react";
import { DollarSign } from "lucide-react";

const INV: [string, string, string][] = [
  ["Jun 2026", "$1,847", "paid"],
  ["May 2026", "$1,612", "paid"],
  ["Apr 2026", "$1,403", "paid"],
];

export function Billing() {
  return (
    <div className="page">
      <div className="page-head"><div><h1 className="page-title">Billing &amp; usage</h1><p className="page-sub">Plan, spend caps, and invoices.</p></div><button className="btn"><DollarSign size={13} /> Manage plan</button></div>
      <div className="grid grid-2" style={{ marginBottom: 14 }}>
        <div className="card card-pad">
          <div className="muted" style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Current plan</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 650, margin: "8px 0 4px" }}>Scale</div>
          <div className="muted" style={{ fontSize: "0.82rem" }}>$0.0008 / 1k routed tokens · pooled</div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}><button className="btn btn-primary">Upgrade</button><button className="btn">Invoices</button></div>
        </div>
        <div className="card card-pad">
          <div className="muted" style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>This month</div>
          <div style={{ marginBottom: 14 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 5 }}><span>Spend</span><span className="muted mono">$1,847 / $2,500 cap</span></div><div className="bar"><span style={{ width: "74%" }} /></div></div>
          <div><div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 5 }}><span>Requests</span><span className="muted mono">248k / 400k</span></div><div className="bar"><span style={{ width: "62%" }} /></div></div>
        </div>
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="card-pad" style={{ fontSize: "0.82rem", fontWeight: 600, borderBottom: "1px solid var(--border)" }}>Invoices</div>
        {INV.map((iv, i) => (
          <div key={iv[0]} style={{ display: "flex", alignItems: "center", padding: "13px 20px", borderTop: i ? "1px solid var(--border)" : "none" }}>
            <span style={{ flex: 1, fontSize: "0.85rem" }}>{iv[0]}</span>
            <span className="mono" style={{ fontSize: "0.82rem", marginRight: 18 }}>{iv[1]}</span>
            <span className="chip" style={{ color: "var(--green)", borderColor: "currentColor", fontSize: "0.64rem" }}>{iv[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
