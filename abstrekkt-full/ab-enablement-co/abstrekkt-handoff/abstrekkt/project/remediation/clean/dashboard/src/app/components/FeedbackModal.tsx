import React, { useState } from "react";
import { X, MessageSquarePlus } from "lucide-react";

interface Props { open: boolean; onClose: () => void; }

const CATS = ["Bug", "Idea", "Routing", "Other"];

export function FeedbackModal({ open, onClose }: Props) {
  const [cat, setCat] = useState("Idea");
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  if (!open) return null;

  const submit = () => { if (!text.trim()) return; setSent(true); setTimeout(() => { setSent(false); setText(""); onClose(); }, 1100); };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(4,5,10,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} className="card app-scope" style={{ width: 440, maxWidth: "100%", background: "var(--surface)", padding: 22 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <strong style={{ fontSize: "0.95rem", display: "flex", alignItems: "center", gap: 8 }}><MessageSquarePlus size={16} color="var(--indigo)" /> Send feedback</strong>
          <button className="btn btn-ghost" style={{ padding: 5 }} onClick={onClose}><X size={16} /></button>
        </div>

        {sent ? (
          <div style={{ padding: "30px 0", textAlign: "center", color: "var(--green)", fontSize: "0.9rem" }}>Thanks — feedback received.</div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              {CATS.map((c) => (
                <button key={c} onClick={() => setCat(c)} className="chip" style={{ cursor: "pointer", background: cat === c ? "var(--indigo)" : "var(--surface-2)", borderColor: cat === c ? "var(--indigo)" : "var(--border-2)", color: cat === c ? "#fff" : "var(--text-dim)" }}>{c}</button>
              ))}
            </div>
            <textarea className="textarea" placeholder="What's on your mind?" value={text} onChange={(e) => setText(e.target.value)} style={{ marginBottom: 16, minHeight: 110 }} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="btn" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={submit}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
