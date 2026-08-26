import React, { useState } from "react";
import { Plus } from "lucide-react";

type Card = { id: string; title: string; tag?: string };
type Cols = Record<string, Card[]>;

const COLUMNS = ["Backlog", "In Progress", "Review", "Done"] as const;
const STORE = "ff_kanban";

const seed: Cols = {
  Backlog: [
    { id: "c1", title: "Add Gemini 1.5 to routing pool", tag: "routing" },
    { id: "c2", title: "Cost guardrails per workspace", tag: "billing" },
  ],
  "In Progress": [
    { id: "c3", title: "Streaming fallback chains", tag: "core" },
    { id: "c4", title: "Latency-based auto-switch", tag: "core" },
  ],
  Review: [{ id: "c5", title: "Prompt cache hit-rate panel", tag: "analytics" }],
  Done: [{ id: "c6", title: "API key rotation flow", tag: "security" }],
};

function load(): Cols {
  try { const s = localStorage.getItem(STORE); if (s) return JSON.parse(s); } catch {}
  return seed;
}

export function KanbanBoard() {
  const [cols, setCols] = useState<Cols>(load);
  const [drag, setDrag] = useState<{ id: string; from: string } | null>(null);

  const persist = (next: Cols) => { setCols(next); try { localStorage.setItem(STORE, JSON.stringify(next)); } catch {} };

  const drop = (to: string) => {
    if (!drag || drag.from === to) return setDrag(null);
    const card = cols[drag.from].find((c) => c.id === drag.id);
    if (!card) return;
    persist({
      ...cols,
      [drag.from]: cols[drag.from].filter((c) => c.id !== drag.id),
      [to]: [...cols[to], card],
    });
    setDrag(null);
  };

  const add = (col: string) => {
    const title = prompt("New card title");
    if (!title) return;
    persist({ ...cols, [col]: [...cols[col], { id: "c" + Date.now(), title }] });
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Kanban</h1>
          <p className="page-sub">Drag cards between columns — state persists locally.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, alignItems: "start" }}>
        {COLUMNS.map((col) => (
          <div
            key={col}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => drop(col)}
            className="card"
            style={{ padding: 12, minHeight: 220, background: "var(--surface)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "2px 4px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600 }}>{col} <span className="muted">· {cols[col].length}</span></span>
              <button className="btn btn-ghost" style={{ padding: 4 }} onClick={() => add(col)}><Plus size={14} /></button>
            </div>
            {cols[col].map((c) => (
              <div
                key={c.id}
                draggable
                onDragStart={() => setDrag({ id: c.id, from: col })}
                className="card card-pad"
                style={{ background: "var(--surface-2)", marginBottom: 8, cursor: "grab", padding: "11px 12px" }}
              >
                <div style={{ fontSize: "0.82rem" }}>{c.title}</div>
                {c.tag && <span className="chip" style={{ marginTop: 8, fontSize: "0.64rem", padding: "2px 7px" }}>{c.tag}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
