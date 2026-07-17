import React, { useState } from "react";
import { Plus, Trash2, ArrowDown, Webhook, Cpu, Filter, Send } from "lucide-react";

type Step = { id: string; type: string };

const PALETTE = [
  { type: "Trigger", desc: "Incoming request / webhook", icon: Webhook, color: "#5e6ad2" },
  { type: "Route", desc: "Pick model by rule", icon: Cpu, color: "#8b5cf6" },
  { type: "Filter", desc: "Guard / transform", icon: Filter, color: "#e0a23b" },
  { type: "Respond", desc: "Return / forward", icon: Send, color: "#22c55e" },
];

const meta = (t: string) => PALETTE.find((p) => p.type === t)!;

export function WorkflowBuilder() {
  const [steps, setSteps] = useState<Step[]>([
    { id: "s1", type: "Trigger" },
    { id: "s2", type: "Route" },
    { id: "s3", type: "Respond" },
  ]);

  const add = (type: string) => setSteps((s) => [...s, { id: "s" + Date.now(), type }]);
  const remove = (id: string) => setSteps((s) => s.filter((x) => x.id !== id));

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Workflow builder</h1>
          <p className="page-sub">Chain triggers, routing, and responses into a pipeline.</p>
        </div>
        <button className="btn btn-primary"><Send size={14} /> Deploy</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 20, alignItems: "start" }}>
        <div className="card card-pad" style={{ minHeight: 380 }}>
          {steps.map((step, i) => {
            const m = meta(step.type);
            const Icon = m.icon;
            return (
              <div key={step.id}>
                <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--surface-2)", padding: "12px 14px" }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: m.color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={15} color={m.color} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 500 }}>{step.type}</div>
                    <div className="muted" style={{ fontSize: "0.72rem" }}>{m.desc}</div>
                  </div>
                  <span className="muted mono" style={{ fontSize: "0.66rem" }}>{String(i + 1).padStart(2, "0")}</span>
                  <button className="btn btn-ghost" style={{ padding: 5 }} onClick={() => remove(step.id)}><Trash2 size={13} /></button>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
                    <ArrowDown size={15} color="var(--muted-2)" />
                  </div>
                )}
              </div>
            );
          })}
          {steps.length === 0 && <div className="muted" style={{ textAlign: "center", padding: 40 }}>Add steps from the palette →</div>}
        </div>

        <div className="card card-pad">
          <div style={{ fontSize: "0.78rem", fontWeight: 600, marginBottom: 12 }}>Palette</div>
          {PALETTE.map((p) => {
            const Icon = p.icon;
            return (
              <button key={p.type} className="btn" style={{ width: "100%", justifyContent: "flex-start", marginBottom: 8, padding: "9px 11px" }} onClick={() => add(p.type)}>
                <Icon size={14} color={p.color} />
                <span style={{ flex: 1, textAlign: "left" }}>{p.type}</span>
                <Plus size={13} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
