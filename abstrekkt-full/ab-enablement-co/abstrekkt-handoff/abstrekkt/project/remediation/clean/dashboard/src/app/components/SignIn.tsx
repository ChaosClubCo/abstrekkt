import React, { useState } from "react";
import { GitBranch, Lock } from "lucide-react";

export function SignIn({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState("jordan@flashfusion.co");
  const [pw, setPw] = useState("");
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "var(--app-bg)" }}>
      <div className="card" style={{ width: 400, maxWidth: "100%", padding: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#5e6ad2,#8b5cf6)" }}><GitBranch size={17} color="#fff" /></div>
          <strong style={{ fontSize: "1.05rem", letterSpacing: "-0.02em" }}>Sign in to FlashFusion</strong>
        </div>
        <label className="field-label">Work email</label>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: 14 }} />
        <label className="field-label">Password</label>
        <input className="input" type="password" value={pw} placeholder="••••••••" onChange={(e) => setPw(e.target.value)} style={{ marginBottom: 18 }} />
        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: 10 }} onClick={onAuth}><Lock size={13} /> Sign in</button>
        <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={onAuth}>Continue with demo workspace</button>
        <p className="muted" style={{ fontSize: "0.72rem", textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
          Authentication is handled server-side; no secret keys touch the browser.
        </p>
      </div>
    </div>
  );
}
