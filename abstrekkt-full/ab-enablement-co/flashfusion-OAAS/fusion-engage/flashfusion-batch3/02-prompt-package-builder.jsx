import { useState, useEffect, useCallback, useRef } from "react";

const T = {
  bg:"#0c0c0b",surface:"#111110",card:"#181815",border:"#232320",
  borderHi:"#303030",accent:"#d4893a",accentHi:"#e8a050",text:"#ddd8ce",
  text2:"#807c74",text3:"#3a3835",green:"#5a9c5a",mono:"#7ab878",
  mono2:"#78afc8",red:"#c05050",tag:"#1e1e1a",
};
const F = { serif:"'Playfair Display',Georgia,serif", sans:"'IBM Plex Sans',sans-serif", mono:"'IBM Plex Mono',monospace" };
const radius = "2px";
const tr = "0.15s";

const SYSTEM_PROMPT = `You are an expert Claude enablement facilitator. Generate a tailored prompt package for an employee based on their intake profile.

Output ONLY a valid JSON object (no markdown fences, no preamble) with this structure:
{
  "summary": "2-sentence overview of the package rationale",
  "prompts": [
    {
      "title": "Short label",
      "category": "one of: productivity | writing | analysis | coding | research | creative",
      "prompt": "The full prompt text the employee can copy and use immediately",
      "notes": "1 sentence on when/why to use this"
    }
  ]
}

Rules:
- Generate exactly 6 prompts
- Each prompt must be immediately usable — no [PLACEHOLDER] fields
- Tailor specifically to the employee's role, department, experience level, and stated goals
- Prompts should build from simple to more sophisticated
- No generic prompts that could apply to any employee unchanged`;

export default function PromptPackageBuilder() {
  const [intakeRecords, setIntakeRecords]   = useState([]);
  const [packages, setPackages]             = useState({});
  const [selectedId, setSelectedId]         = useState(null);
  const [generating, setGenerating]         = useState(false);
  const [error, setError]                   = useState(null);
  const [activePackageId, setActivePackageId] = useState(null);
  const [copiedIdx, setCopiedIdx]           = useState(null);
  const [view, setView]                     = useState("generate"); // "generate" | "packages"
  const abortRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `*{box-sizing:border-box;margin:0;padding:0}body{background:${T.bg};color:${T.text};font-family:${F.sans}}`;
    document.head.appendChild(style);
  }, []);

  const loadData = useCallback(async () => {
    try {
      const r = await window.storage.get("intake-records-v1");
      setIntakeRecords(r ? JSON.parse(r.value) : []);
    } catch { setIntakeRecords([]); }
    try {
      const r = await window.storage.get("prompt-packages-v1");
      setPackages(r ? JSON.parse(r.value) : {});
    } catch { setPackages({}); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const generate = async () => {
    const intake = intakeRecords.find(r => r.id === selectedId);
    if (!intake) { setError("Select an intake record first."); return; }

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setGenerating(true); setError(null);

    try {
      const userMsg = `Employee profile:
Name: ${intake.name}
Role: ${intake.role}
Department: ${intake.department}
AI Experience: ${intake.experience}
Session Goals: ${intake.sessionGoals.join(", ")}
Additional Context: ${intake.notes || "none"}

Generate a tailored prompt package for this employee.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        signal: abortRef.current.signal,
        body: JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:4000,
          system: SYSTEM_PROMPT,
          messages:[{ role:"user", content: userMsg }]
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(`API ${res.status}: ${errData.error?.message || res.statusText}`);
      }

      const data = await res.json();
      const raw = data.content.filter(b => b.type==="text").map(b => b.text).join("");
      let parsed;
      try {
        parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      } catch {
        throw new Error("Model returned invalid JSON. Raw: " + raw.slice(0,200));
      }

      if (!parsed.prompts || parsed.prompts.length !== 6) {
        throw new Error("Expected 6 prompts, got: " + (parsed.prompts?.length ?? 0));
      }

      const pkgId = `pkg-${intake.id}-${Date.now()}`;
      const pkg = { id:pkgId, intakeId: intake.id, employeeName: intake.name,
                    role: intake.role, department: intake.department,
                    ts: new Date().toISOString(), ...parsed };

      const nextPkgs = { ...packages, [pkgId]: pkg };
      const result = await window.storage.set("prompt-packages-v1", JSON.stringify(nextPkgs));
      if (!result) throw new Error("Storage write failed.");

      setPackages(nextPkgs);
      setActivePackageId(pkgId);
      setView("packages");
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const copyPrompt = (text, idx) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  const CATEGORY_COLORS = {
    productivity: T.mono, writing: T.mono2, analysis: T.accent,
    coding: T.green, research: T.text2, creative: T.accentHi,
  };

  const s = {
    root:  { minHeight:"100vh", background:T.bg, padding:"32px 28px", fontFamily:F.sans },
    hdr:   { borderBottom:`1px solid ${T.border}`, paddingBottom:"20px", marginBottom:"28px" },
    title: { fontFamily:F.serif, fontSize:"26px", fontWeight:700, color:T.text, letterSpacing:"-0.5px" },
    sub:   { fontSize:"12px", fontFamily:F.mono, color:T.text2, marginTop:"4px" },
    tabs:  { display:"flex", marginBottom:"24px", borderBottom:`1px solid ${T.border}` },
    tab:   (a) => ({
      padding:"8px 14px", fontSize:"11px", fontFamily:F.mono, letterSpacing:"0.06em",
      color: a ? T.accent : T.text2, background:"transparent", border:"none",
      borderBottom: a ? `1px solid ${T.accent}` : "1px solid transparent",
      cursor:"pointer", textTransform:"uppercase", marginBottom:"-1px",
      transition:`color ${tr}, border-color ${tr}`,
    }),
    select: { background:T.surface, border:`1px solid ${T.border}`, borderRadius:radius,
              padding:"10px 12px", fontSize:"13px", color:T.text, fontFamily:F.sans,
              outline:"none", width:"100%", cursor:"pointer", marginBottom:"16px" },
    btn: (dis) => ({
      padding:"10px 20px", fontSize:"12px", fontFamily:F.mono, letterSpacing:"0.06em",
      textTransform:"uppercase", color: dis ? T.text3 : T.bg,
      background: dis ? T.border : T.accent,
      border:"none", borderRadius:radius, cursor: dis ? "not-allowed" : "pointer",
      transition:`background ${tr}`,
    }),
    err: { background:T.tag, border:`1px solid ${T.red}`, borderRadius:radius,
           padding:"10px 14px", fontSize:"12px", color:T.red, marginBottom:"16px", fontFamily:F.mono },
    pkgCard:{ background:T.card, border:`1px solid ${T.border}`, borderRadius:radius,
              padding:"14px", marginBottom:"10px", cursor:"pointer",
              transition:`border-color ${tr}` },
    pkgActive:{ border:`1px solid ${T.borderHi}` },
    promptCard:{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:radius,
                 padding:"14px", marginBottom:"10px" },
    promptTitle:{ fontFamily:F.serif, fontSize:"14px", color:T.text, marginBottom:"6px" },
    promptBody:{ fontFamily:F.mono, fontSize:"12px", color:T.mono, lineHeight:"1.6",
                 background:T.bg, border:`1px solid ${T.border}`, borderRadius:radius,
                 padding:"10px", marginBottom:"8px", whiteSpace:"pre-wrap" },
    notes: { fontSize:"12px", color:T.text2, marginBottom:"8px" },
    copyBtn:(copied) => ({
      fontFamily:F.mono, fontSize:"10px", letterSpacing:"0.06em",
      color: copied ? T.green : T.accent, background:"transparent",
      border:`1px solid ${copied ? T.green : T.accent}`,
      borderRadius:radius, padding:"3px 8px", cursor:"pointer",
      transition:`color ${tr}, border-color ${tr}`,
    }),
    badge:(c) => ({
      display:"inline-block", fontFamily:F.mono, fontSize:"10px",
      color:c, background:T.tag, padding:"2px 6px", borderRadius:radius,
      marginRight:"6px",
    }),
    summary:{ fontFamily:F.sans, fontSize:"13px", color:T.text2, lineHeight:"1.6",
              background:T.surface, border:`1px solid ${T.border}`, borderRadius:radius,
              padding:"12px", marginBottom:"16px" },
  };

  const activePackage = activePackageId ? packages[activePackageId] : null;

  return (
    <div style={s.root}>
      <div style={s.hdr}>
        <div style={s.title}>◆ Prompt Package Builder</div>
        <div style={s.sub}>ARTIFACT 02 · claude-sonnet-4-6 · 4,000 max tokens</div>
      </div>

      <div style={s.tabs}>
        {["generate","packages"].map(v => (
          <button key={v} style={s.tab(view===v)} onClick={() => setView(v)}>
            {v === "generate" ? "Generate" : `Packages (${Object.keys(packages).length})`}
          </button>
        ))}
      </div>

      {view === "generate" && (
        <>
          {error && <div style={s.err}>✗ {error}</div>}

          {intakeRecords.length === 0 ? (
            <div style={{ fontFamily:F.mono, fontSize:"12px", color:T.text3 }}>
              ◌ No intake records found. Complete Artifact 01 first.
            </div>
          ) : (
            <>
              <div style={{ fontSize:"11px", fontFamily:F.mono, color:T.text2, textTransform:"uppercase",
                            letterSpacing:"0.06em", marginBottom:"6px" }}>
                Select Intake Record
              </div>
              <select value={selectedId || ""} style={s.select}
                      onChange={e => setSelectedId(e.target.value)}>
                <option value="">Choose an employee…</option>
                {intakeRecords.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.role} ({r.department}) · {new Date(r.ts).toLocaleDateString()}
                  </option>
                ))}
              </select>

              {selectedId && (() => {
                const rec = intakeRecords.find(r => r.id === selectedId);
                return rec ? (
                  <div style={{ ...s.summary, marginBottom:"20px" }}>
                    <strong style={{ fontFamily:F.mono, fontSize:"10px", color:T.text3 }}>PROFILE BRIEF</strong>
                    <div style={{ marginTop:"6px" }}>
                      <strong style={{ color:T.text }}>{rec.name}</strong> · {rec.role} · {rec.department}
                    </div>
                    <div style={{ marginTop:"4px", color:T.text2, fontSize:"12px" }}>
                      {rec.experience} · Goals: {rec.sessionGoals.join(", ")}
                    </div>
                    {rec.notes && <div style={{ marginTop:"4px", fontSize:"12px", color:T.text3 }}>{rec.notes}</div>}
                  </div>
                ) : null;
              })()}

              <button style={s.btn(generating || !selectedId)}
                      disabled={generating || !selectedId}
                      onClick={generate}>
                {generating ? "Generating 6 prompts…" : "◆ Generate Prompt Package"}
              </button>
            </>
          )}
        </>
      )}

      {view === "packages" && (
        <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:"20px" }}>
          {/* Package list */}
          <div>
            {Object.keys(packages).length === 0 ? (
              <div style={{ fontFamily:F.mono, fontSize:"12px", color:T.text3 }}>◌ No packages yet.</div>
            ) : (
              Object.values(packages).sort((a,b) => b.ts.localeCompare(a.ts)).map(pkg => (
                <div key={pkg.id}
                     style={{ ...s.pkgCard, ...(activePackageId===pkg.id ? s.pkgActive : {}) }}
                     onClick={() => setActivePackageId(pkg.id)}>
                  <div style={{ fontFamily:F.serif, fontSize:"14px", color:T.text }}>{pkg.employeeName}</div>
                  <div style={{ fontFamily:F.mono, fontSize:"11px", color:T.text2, marginTop:"3px" }}>
                    {pkg.role} · {pkg.department}
                  </div>
                  <div style={{ fontFamily:F.mono, fontSize:"10px", color:T.text3, marginTop:"4px" }}>
                    {new Date(pkg.ts).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Package detail */}
          <div>
            {activePackage ? (
              <>
                <div style={s.summary}>{activePackage.summary}</div>
                {activePackage.prompts.map((p, i) => (
                  <div key={i} style={s.promptCard}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"8px" }}>
                      <div style={s.promptTitle}>{p.title}</div>
                      <div>
                        <span style={s.badge(CATEGORY_COLORS[p.category] || T.text2)}>{p.category}</span>
                        <button style={s.copyBtn(copiedIdx===i)} onClick={() => copyPrompt(p.prompt, i)}>
                          {copiedIdx===i ? "◆ copied" : "copy"}
                        </button>
                      </div>
                    </div>
                    <div style={s.promptBody}>{p.prompt}</div>
                    <div style={s.notes}>{p.notes}</div>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ fontFamily:F.mono, fontSize:"12px", color:T.text3 }}>◌ Select a package to view.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
