import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Search, LayoutDashboard, ListChecks, FileText, Zap, Code2, Settings as Cog, CornerDownLeft, Route as RouteIcon, FlaskConical, TrendingUp, Plug, DollarSign, Users } from "lucide-react";

interface Props { open: boolean; onClose: () => void; }

const ACTIONS = [
  { label: "Go to Dashboard", to: "/app", icon: LayoutDashboard },
  { label: "Go to Routes", to: "/app/routes", icon: RouteIcon },
  { label: "Go to Playground", to: "/app/playground", icon: FlaskConical },
  { label: "Go to Analytics", to: "/app/analytics", icon: TrendingUp },
  { label: "Go to Workflow builder", to: "/app/workflow", icon: Zap },
  { label: "Go to Code", to: "/app/code", icon: Code2 },
  { label: "Go to Integrations", to: "/app/integrations", icon: Plug },
  { label: "Go to Billing", to: "/app/billing", icon: DollarSign },
  { label: "Go to Team", to: "/app/team", icon: Users },
  { label: "Go to Kanban", to: "/app/kanban", icon: ListChecks },
  { label: "Go to Docs", to: "/app/docs", icon: FileText },
  { label: "Go to Settings", to: "/app/settings", icon: Cog },
];

export function CommandPalette({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const results = ACTIONS.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => { if (open) { setQ(""); setSel(0); } }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && results[sel]) { navigate(results[sel].to); onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, sel, navigate, onClose]);

  if (!open) return null;

  return (
    <div onClick={onClose} className="app-scope" style={{ position: "fixed", inset: 0, zIndex: 210, background: "rgba(4,5,10,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "14vh" }}>
      <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: 520, maxWidth: "92vw", background: "var(--surface)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", borderBottom: "1px solid var(--border)" }}>
          <Search size={15} color="var(--muted)" />
          <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} placeholder="Type a command or search…"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: "0.9rem", fontFamily: "var(--app-font)" }} />
          <span className="chip mono" style={{ fontSize: "0.6rem" }}>ESC</span>
        </div>
        <div style={{ maxHeight: 320, overflowY: "auto", padding: 6 }}>
          {results.length === 0 && <div className="muted" style={{ padding: 24, textAlign: "center", fontSize: "0.84rem" }}>No matches</div>}
          {results.map((a, i) => {
            const Icon = a.icon;
            return (
              <button key={a.to} onMouseEnter={() => setSel(i)} onClick={() => { navigate(a.to); onClose(); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 7, border: "none", cursor: "pointer", textAlign: "left", color: "var(--text)", background: i === sel ? "var(--surface-2)" : "transparent" }}>
                <Icon size={15} color="var(--muted)" />
                <span style={{ flex: 1, fontSize: "0.85rem" }}>{a.label}</span>
                {i === sel && <CornerDownLeft size={13} color="var(--muted)" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
