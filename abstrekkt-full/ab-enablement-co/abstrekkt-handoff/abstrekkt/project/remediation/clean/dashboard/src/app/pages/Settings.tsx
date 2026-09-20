import React, { useState } from "react";
import { User, Cpu, Bell, KeyRound, Check } from "lucide-react";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "models", label: "Models", icon: Cpu },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "api", label: "API", icon: KeyRound },
];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-pressed={on} style={{ width: 38, height: 22, borderRadius: 999, border: "none", cursor: "pointer", background: on ? "var(--indigo)" : "var(--surface-3)", position: "relative", transition: "background .15s" }}>
      <span style={{ position: "absolute", top: 3, left: on ? 19 : 3, width: 16, height: 16, borderRadius: 999, background: "#fff", transition: "left .15s" }} />
    </button>
  );
}

export function Settings() {
  const [tab, setTab] = useState("profile");
  const [toggles, setToggles] = useState<Record<string, boolean>>({ routeAlerts: true, budget: true, weekly: false, sonnet: true, haiku: true, gpt: false });
  const flip = (k: string) => setToggles((t) => ({ ...t, [k]: !t[k] }));

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Workspace preferences and credentials.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20, alignItems: "start" }}>
        <div className="card card-pad">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start", gap: 9, padding: "8px 10px", marginBottom: 2, fontSize: "0.82rem", color: tab === t.id ? "var(--text)" : "var(--muted)", background: tab === t.id ? "var(--surface-2)" : "transparent" }}>
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="card card-pad" style={{ minHeight: 320 }}>
          {tab === "profile" && (
            <div style={{ maxWidth: 440 }}>
              <h3 style={{ marginTop: 0, fontSize: "1rem" }}>Profile</h3>
              <label className="field-label">Display name</label>
              <input className="input" defaultValue="Jordan Lee" style={{ marginBottom: 14 }} />
              <label className="field-label">Workspace</label>
              <input className="input" defaultValue="growth" style={{ marginBottom: 14 }} />
              <label className="field-label">Email</label>
              <input className="input" defaultValue="jordan@flashfusion.co" style={{ marginBottom: 18 }} />
              <button className="btn btn-primary"><Check size={14} /> Save changes</button>
            </div>
          )}

          {tab === "models" && (
            <div>
              <h3 style={{ marginTop: 0, fontSize: "1rem" }}>Enabled models</h3>
              {[
                { k: "sonnet", name: "Claude Sonnet 4.5", note: "reasoning · default primary" },
                { k: "haiku", name: "Claude Haiku 4", note: "fast · default fallback" },
                { k: "gpt", name: "GPT-4o", note: "vision" },
              ].map((m) => (
                <div key={m.k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontSize: "0.85rem" }}>{m.name}</div>
                    <div className="muted" style={{ fontSize: "0.72rem" }}>{m.note}</div>
                  </div>
                  <Toggle on={toggles[m.k]} onClick={() => flip(m.k)} />
                </div>
              ))}
            </div>
          )}

          {tab === "notifications" && (
            <div>
              <h3 style={{ marginTop: 0, fontSize: "1rem" }}>Notifications</h3>
              {[
                { k: "routeAlerts", label: "Route fallback alerts" },
                { k: "budget", label: "Budget threshold warnings" },
                { k: "weekly", label: "Weekly usage digest" },
              ].map((n) => (
                <div key={n.k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "0.85rem" }}>{n.label}</span>
                  <Toggle on={toggles[n.k]} onClick={() => flip(n.k)} />
                </div>
              ))}
            </div>
          )}

          {tab === "api" && (
            <div style={{ maxWidth: 480 }}>
              <h3 style={{ marginTop: 0, fontSize: "1rem" }}>API keys</h3>
              <p className="muted" style={{ fontSize: "0.8rem", lineHeight: 1.6 }}>
                Keys are stored <strong style={{ color: "var(--text-dim)" }}>server-side only</strong> and never exposed to the browser. The value is shown once at creation.
              </p>
              <label className="field-label">Publishable key</label>
              <input className="input mono" readOnly value="pk_live_ff_••••••••••••4a9c" style={{ marginBottom: 14 }} />
              <label className="field-label">Secret key</label>
              <input className="input mono" readOnly value="sk_live_••••••••••••••••••••" style={{ marginBottom: 16 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary"><KeyRound size={13} /> Rotate key</button>
                <button className="btn">Reveal once</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
