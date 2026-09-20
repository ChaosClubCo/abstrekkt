import React from "react";
import { TrendingUp, Zap, DollarSign, Activity, ArrowUpRight } from "lucide-react";

const STATS = [
  { label: "Requests today", value: "48,210", delta: "+12.4%", up: true, icon: Activity },
  { label: "Avg latency", value: "312 ms", delta: "-8.1%", up: true, icon: Zap },
  { label: "Spend (MTD)", value: "$1,847", delta: "+4.6%", up: false, icon: DollarSign },
  { label: "Active routes", value: "18", delta: "+2", up: true, icon: TrendingUp },
];

const ROUTING = [
  { model: "Claude Sonnet 4.5", share: 46, tag: "reasoning" },
  { model: "Claude Haiku 4", share: 31, tag: "fast" },
  { model: "GPT-4o", share: 14, tag: "vision" },
  { model: "Llama 3.1 70B", share: 9, tag: "local" },
];

const ACTIVITY = [
  { t: "2m ago", text: "Route “support-triage” switched fallback → Haiku 4", kind: "route" },
  { t: "18m ago", text: "Latency spike resolved on GPT-4o endpoint", kind: "ok" },
  { t: "1h ago", text: "Budget alert: 80% of monthly cap reached", kind: "warn" },
  { t: "3h ago", text: "New API key provisioned for workspace “growth”", kind: "info" },
];

const kindColor: Record<string, string> = { route: "#5e6ad2", ok: "#22c55e", warn: "#e0a23b", info: "#6b7094" };

export function Dashboard() {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Routing health across all models and workspaces.</p>
        </div>
        <button className="btn btn-primary"><Zap size={14} /> New route</button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 14 }}>
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card card-pad stat">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="label">{s.label}</span>
                <Icon size={15} color="#6b7094" />
              </div>
              <div className="value">{s.value}</div>
              <div className={`delta ${s.up ? "up" : "down"}`}>{s.delta} vs last week</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-2">
        <div className="card card-pad">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <strong style={{ fontSize: "0.95rem" }}>Model routing</strong>
            <span className="chip">last 24h</span>
          </div>
          {ROUTING.map((r) => (
            <div key={r.model} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: 6 }}>
                <span>{r.model} <span className="muted mono" style={{ fontSize: "0.7rem" }}>· {r.tag}</span></span>
                <span className="muted">{r.share}%</span>
              </div>
              <div className="bar"><span style={{ width: `${r.share}%` }} /></div>
            </div>
          ))}
        </div>

        <div className="card card-pad">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <strong style={{ fontSize: "0.95rem" }}>Recent activity</strong>
            <a className="muted" style={{ fontSize: "0.78rem", display: "inline-flex", alignItems: "center", gap: 4 }} href="#">View all <ArrowUpRight size={12} /></a>
          </div>
          {ACTIVITY.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: kindColor[a.kind], marginTop: 6, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.84rem" }}>{a.text}</div>
                <div className="muted mono" style={{ fontSize: "0.68rem", marginTop: 2 }}>{a.t}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
