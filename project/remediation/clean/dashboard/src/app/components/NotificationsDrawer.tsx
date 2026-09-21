import React, { useState } from "react";
import { X, Bell } from "lucide-react";

interface Props { open: boolean; onClose: () => void; }

const SEED = [
  { id: 1, title: "Fallback triggered", body: "“support-triage” shifted to Haiku 4 (latency).", t: "2m", read: false },
  { id: 2, title: "Budget at 80%", body: "Workspace “growth” is near its monthly cap.", t: "1h", read: false },
  { id: 3, title: "Endpoint recovered", body: "GPT-4o latency back to baseline.", t: "3h", read: false },
  { id: 4, title: "New key provisioned", body: "A publishable key was created.", t: "1d", read: true },
];

export function NotificationsDrawer({ open, onClose }: Props) {
  const [items, setItems] = useState(SEED);
  const markAll = () => setItems((x) => x.map((i) => ({ ...i, read: true })));

  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 190, background: "rgba(4,5,10,0.5)" }} />}
      <div className="app-scope" style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 360, maxWidth: "90vw", zIndex: 195, background: "var(--surface)", borderLeft: "1px solid var(--border)", transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform .25s ease", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: "1px solid var(--border)" }}>
          <strong style={{ fontSize: "0.92rem", display: "flex", alignItems: "center", gap: 8 }}><Bell size={15} color="var(--indigo)" /> Notifications</strong>
          <button className="btn btn-ghost" style={{ padding: 5 }} onClick={onClose}><X size={16} /></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {items.map((n) => (
            <div key={n.id} style={{ display: "flex", gap: 10, padding: "14px 18px", borderBottom: "1px solid var(--border)", opacity: n.read ? 0.55 : 1 }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: n.read ? "var(--muted-2)" : "var(--indigo)", marginTop: 6, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.84rem", fontWeight: 500 }}>{n.title}</div>
                <div className="muted" style={{ fontSize: "0.76rem", marginTop: 2, lineHeight: 1.5 }}>{n.body}</div>
                <div className="muted mono" style={{ fontSize: "0.66rem", marginTop: 4 }}>{n.t} ago</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: 14, borderTop: "1px solid var(--border)" }}>
          <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={markAll}>Mark all as read</button>
        </div>
      </div>
    </>
  );
}
