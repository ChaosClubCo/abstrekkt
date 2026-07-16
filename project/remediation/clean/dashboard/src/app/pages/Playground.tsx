import React, { useState } from "react";
import { Play, Cpu } from "lucide-react";

export function Playground() {
  const [prompt, setPrompt] = useState("Summarize this support ticket and suggest a reply.");
  const [out, setOut] = useState<{ model: string; ms: number; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const run = () => {
    setBusy(true); setOut(null);
    const p = prompt.toLowerCase();
    const model = p.length > 240 ? "Claude Sonnet 4.5" : (p.includes("image") || p.includes("vision")) ? "GPT-4o" : p.length < 60 ? "Claude Haiku 4" : "Claude Sonnet 4.5";
    setTimeout(() => {
      setBusy(false);
      setOut({ model, ms: 180 + Math.floor(Math.random() * 260), text: `Routed to ${model}. (Demo) The router selected this model by prompt length, tags, and current latency. In production this returns the live completion via your server-side proxy.` });
    }, 700);
  };

  return (
    <div className="page" style={{ maxWidth: 980 }}>
      <div className="page-head"><div><h1 className="page-title">Playground</h1><p className="page-sub">Send a prompt through the router and see which model handles it.</p></div></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        <div className="card card-pad">
          <label className="field-label">Prompt</label>
          <textarea className="textarea" value={prompt} onChange={(e) => setPrompt(e.target.value)} style={{ minHeight: 200, marginBottom: 12 }} />
          <button className="btn btn-primary" onClick={run} disabled={busy}><Play size={13} /> {busy ? "Routing…" : "Route prompt"}</button>
        </div>
        <div className="card card-pad" style={{ minHeight: 260 }}>
          <label className="field-label">Result</label>
          {!out && !busy && <div className="muted" style={{ padding: "40px 0", textAlign: "center", fontSize: "0.85rem" }}>Run a prompt to see routing.</div>}
          {busy && <div className="muted" style={{ padding: "40px 0", textAlign: "center", fontSize: "0.85rem" }}>Selecting model…</div>}
          {out && (
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <span className="chip" style={{ color: "var(--indigo)", borderColor: "var(--indigo)" }}><Cpu size={12} /> {out.model}</span>
                <span className="chip mono">{out.ms} ms</span>
              </div>
              <p style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "var(--text-dim)" }}>{out.text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
