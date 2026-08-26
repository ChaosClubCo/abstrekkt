import React, { useState } from "react";
import { Github, MessageSquare, FileText, ListChecks, DollarSign, Plug } from "lucide-react";

const ITEMS: [string, string, React.ElementType, string][] = [
  ["github", "GitHub", Github, "Repos, PRs, issues"],
  ["slack", "Slack", MessageSquare, "Alerts & notifications"],
  ["notion", "Notion", FileText, "Docs & databases"],
  ["linear", "Linear", ListChecks, "Issues & sprints"],
  ["stripe", "Stripe", DollarSign, "Billing events"],
  ["webhooks", "Webhooks", Plug, "Custom HTTP triggers"],
];

const SEED: Record<string, boolean> = { github: true, slack: true, notion: false, linear: false, stripe: true, webhooks: false };

export function Integrations() {
  const [on, setOn] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem("ff_integ") || "") || SEED; } catch { return SEED; }
  });
  const flip = (k: string) => { const n = { ...on, [k]: !on[k] }; setOn(n); try { localStorage.setItem("ff_integ", JSON.stringify(n)); } catch {} };

  return (
    <div className="page">
      <div className="page-head"><div><h1 className="page-title">Integrations</h1><p className="page-sub">Connect the tools your routes trigger.</p></div></div>
      <div className="grid grid-2">
        {ITEMS.map(([k, name, Icon, desc]) => (
          <div key={k} className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 38, height: 38, borderRadius: 9, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={17} color={on[k] ? "var(--indigo)" : "var(--muted)"} />
            </span>
            <div style={{ flex: 1 }}><div style={{ fontSize: "0.88rem", fontWeight: 500 }}>{name}</div><div className="muted" style={{ fontSize: "0.74rem" }}>{desc}</div></div>
            <button className="btn" style={{ background: on[k] ? "transparent" : "var(--indigo)", borderColor: on[k] ? "var(--border-2)" : "var(--indigo)", color: on[k] ? "var(--muted)" : "#fff" }} onClick={() => flip(k)}>{on[k] ? "Connected" : "Connect"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
