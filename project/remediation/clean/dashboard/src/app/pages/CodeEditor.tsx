import React, { useState } from "react";
import { File, Folder, Play } from "lucide-react";

const FILES: Record<string, string> = {
  "route.ts": `import { defineRoute } from "@flashfusion/sdk";

// Route reasoning-heavy prompts to Sonnet, fall back to Haiku on overload.
export default defineRoute({
  name: "support-triage",
  match: { tags: ["support"], maxTokens: 4000 },
  pool: [
    { model: "claude-sonnet-4-5", timeoutMs: 8000 },
    { model: "claude-haiku-4" },          // fallback
  ],
  cache: { systemPrompt: true },
});
`,
  "handler.ts": `import { ff } from "@flashfusion/sdk";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const res = await ff.run("support-triage", { prompt });
  return Response.json({ text: res.content, model: res.model });
}
`,
  "guard.ts": `// Lightweight input guard before routing.
export function guard(input: string) {
  if (input.length > 50_000) throw new Error("prompt too large");
  return input.trim();
}
`,
};

export function CodeEditor() {
  const [active, setActive] = useState("route.ts");
  const [code, setCode] = useState<Record<string, string>>(FILES);
  const lines = code[active].split("\n").length;

  return (
    <div className="page" style={{ maxWidth: 1240 }}>
      <div className="page-head">
        <div>
          <h1 className="page-title">Code</h1>
          <p className="page-sub">Edit routing logic — changes are local to this demo.</p>
        </div>
        <button className="btn btn-primary"><Play size={13} /> Run</button>
      </div>

      <div className="card" style={{ display: "grid", gridTemplateColumns: "200px 1fr", overflow: "hidden", minHeight: 420 }}>
        <div style={{ borderRight: "1px solid var(--border)", padding: 10, background: "var(--surface)" }}>
          <div className="muted" style={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 6, padding: "4px 6px" }}>
            <Folder size={12} /> src/routes
          </div>
          {Object.keys(code).map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className="btn btn-ghost"
              style={{ width: "100%", justifyContent: "flex-start", gap: 7, padding: "6px 8px", fontSize: "0.78rem", fontFamily: "var(--mono)", color: active === f ? "var(--text)" : "var(--muted)", background: active === f ? "var(--surface-2)" : "transparent" }}
            >
              <File size={12} /> {f}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
            <span className="chip mono" style={{ fontSize: "0.66rem" }}>{active}</span>
            <span className="muted mono" style={{ fontSize: "0.66rem", marginLeft: "auto" }}>{lines} lines · TypeScript</span>
          </div>
          <textarea
            className="textarea mono"
            spellCheck={false}
            value={code[active]}
            onChange={(e) => setCode({ ...code, [active]: e.target.value })}
            style={{ flex: 1, border: "none", borderRadius: 0, background: "#0b0c15", minHeight: 360, fontSize: "0.8rem", lineHeight: 1.7, padding: "14px 16px" }}
          />
          <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)", background: "#0b0c15" }}>
            <span className="muted mono" style={{ fontSize: "0.7rem" }}>▸ ready — press Run to simulate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
