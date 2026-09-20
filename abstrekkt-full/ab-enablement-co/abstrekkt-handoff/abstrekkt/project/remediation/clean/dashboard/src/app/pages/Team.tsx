import React, { useState } from "react";
import { Mail } from "lucide-react";

export function Team() {
  const [members, setMembers] = useState<[string, string, string][]>([
    ["Jordan Lee", "jordan@flashfusion.co", "Owner"],
    ["Sam Rivera", "sam@flashfusion.co", "Admin"],
    ["Avery Cho", "avery@flashfusion.co", "Member"],
  ]);
  const [email, setEmail] = useState("");
  const invite = () => { if (!email.trim()) return; setMembers((m) => [...m, [email.split("@")[0], email, "Member"]]); setEmail(""); };

  return (
    <div className="page" style={{ maxWidth: 820 }}>
      <div className="page-head"><div><h1 className="page-title">Team</h1><p className="page-sub">Members and roles for this workspace.</p></div></div>
      <div className="card card-pad" style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <input className="input" placeholder="teammate@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn btn-primary" onClick={invite}><Mail size={13} /> Invite</button>
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        {members.map((m, i) => (
          <div key={m[1]} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", borderTop: i ? "1px solid var(--border)" : "none" }}>
            <span style={{ width: 30, height: 30, borderRadius: 999, background: "linear-gradient(135deg,#5e6ad2,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.64rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>{m[0].split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase()}</span>
            <div style={{ flex: 1 }}><div style={{ fontSize: "0.85rem" }}>{m[0]}</div><div className="muted" style={{ fontSize: "0.74rem" }}>{m[1]}</div></div>
            <span className="chip" style={{ fontSize: "0.66rem", color: m[2] === "Owner" ? "var(--indigo)" : "var(--text-dim)" }}>{m[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
