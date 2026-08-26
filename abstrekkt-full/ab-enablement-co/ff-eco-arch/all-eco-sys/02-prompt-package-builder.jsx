/**
 * Claude Enablement Suite — 2/7: Prompt Package Builder
 *
 * Takes role + use cases → Claude API → tailored prompt package.
 * Packages are editable, saveable, and copyable for delivery in the session.
 * The facilitator opens this before (or during) the "Prompt Package Delivery"
 * node in the enablement flowchart.
 *
 * Reads intake records from "intake-records-v1" to pre-fill fields.
 * Stores packages in "prompt-packages-v1" (object keyed by employeeId).
 */

import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  primary: "#156082", accent: "#E97132", done: "#15803d",
  navy: "#0E2841", muted: "#64748b", border: "#e2e8f0", bg: "#f8fafc",
  active: "#7c3aed",
};

const ROLE_PRESETS = [
  "Service Desk Technician",  "IT Manager",          "Operations Manager",
  "HR / People Manager",      "Executive / VP / C-Suite", "Account Manager / Sales",
  "Marketing Manager",        "Software Engineer",   "Data Analyst",
  "Project Manager",          "Customer Success",    "Finance / Accounting",
  "Legal / Compliance",       "Product Manager",     "Content Writer / Editor",
];

const USECASE_LIBRARY = {
  "Writing & Communication": [
    "Draft professional emails from bullet points",
    "Rewrite emails to be more concise and clear",
    "Summarize long email threads into key decisions",
    "Draft Slack/Teams announcements",
    "Write meeting agendas and follow-up notes",
  ],
  "Documents & Reports": [
    "Convert notes into structured reports or SOPs",
    "Draft executive summaries from long documents",
    "Create project status updates",
    "Generate templates for recurring document types",
    "Proofread and improve document quality",
  ],
  "Research & Analysis": [
    "Research a topic and summarize key findings",
    "Compare options with a structured pros/cons analysis",
    "Extract key data points from uploaded documents",
    "Synthesize information from multiple sources",
    "Fact-check and verify claims",
  ],
  "Planning & Organization": [
    "Break down a project into actionable tasks",
    "Build a meeting agenda from a topic list",
    "Create a week-by-week plan for a goal",
    "Prioritize a backlog using a framework",
    "Draft OKRs or goals from a strategy description",
  ],
  "Technical (Dev/IT)": [
    "Write or debug code with explanation",
    "Generate test cases for a function",
    "Document a codebase or API",
    "Draft runbook steps for an incident type",
    "Explain a technical concept to a non-technical audience",
  ],
  "Customer & Stakeholder": [
    "Draft responses to customer complaints",
    "Create a FAQ from a knowledge base",
    "Prepare talking points for a difficult conversation",
    "Write a change management communication",
    "Summarize a customer call for CRM notes",
  ],
};

const SYSTEM_PROMPT = (role, useCases, painPoints, tools, literacyLevel) => `
You are a Claude prompt engineering expert. Generate a tailored prompt package for an employee.

EMPLOYEE PROFILE:
- Role: ${role}
- AI Literacy: ${literacyLevel}
- Tools they use: ${tools.join(", ") || "General office tools"}
- Primary use cases: ${useCases.join(", ")}
- Biggest pain points: ${painPoints.join(", ")}

Generate exactly 6 prompts tailored to this employee's role and use cases.

For each prompt:
1. Give it a short, descriptive name (≤6 words)
2. Write the category (e.g. "Writing", "Research", "Technical", "Planning")
3. Write the full prompt text the employee should copy into Claude
4. Write a 1-sentence description of when to use it
5. Note 1-2 customization tips (what to swap out per-use)

Make prompts:
- Role-specific, not generic
- Immediately usable without modification
- Include XML tags where structure helps
- Calibrated to ${literacyLevel} literacy (${literacyLevel === "none" || literacyLevel === "casual" ? "simpler, more guided" : "more sophisticated, leverage Claude's capabilities"})
- Cover the pain points listed above

Respond ONLY with valid JSON, no markdown fences:
{
  "prompts": [
    {
      "name": "Prompt Name",
      "category": "Category",
      "prompt": "Full prompt text here...",
      "description": "One sentence on when to use.",
      "tips": ["Tip 1", "Tip 2"]
    }
  ]
}`;

export default function PromptPackageBuilder() {
  const [intakes,     setIntakes]     = useState([]);
  const [packages,    setPackages]    = useState({});
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [view,        setView]        = useState("setup");  // setup | generating | review | packages
  const [form, setForm] = useState({
    name: "", role: "", literacy: "regular", tools: [], useCases: [], painPoints: [],
  });
  const [generatedPkg, setGeneratedPkg] = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [editIdx,     setEditIdx]     = useState(null);
  const [saveLabel,   setSaveLabel]   = useState("💾 Save Package");
  const abortRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const [ir, pr] = await Promise.allSettled([
          window.storage.get("intake-records-v1"),
          window.storage.get("prompt-packages-v1"),
        ]);
        if (ir.status === "fulfilled" && ir.value) setIntakes(JSON.parse(ir.value.value));
        if (pr.status === "fulfilled" && pr.value) setPackages(JSON.parse(pr.value.value));
      } catch (e) { console.error(e); }
    })();
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  function loadFromIntake(rec) {
    setSelectedEmp(rec);
    setForm({
      name: rec.name,
      role: rec.role,
      literacy: rec.literacy || "regular",
      tools: rec.tools || [],
      useCases: rec.painPoints || [],
      painPoints: rec.painPoints || [],
    });
  }

  function toggleUseCase(uc) {
    setForm(prev => ({
      ...prev,
      useCases: prev.useCases.includes(uc) ? prev.useCases.filter(x => x !== uc) : [...prev.useCases, uc],
    }));
  }

  async function generate() {
    if (!form.name || !form.role) return;
    setLoading(true);
    setError(null);
    setView("generating");
    abortRef.current = new AbortController();

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        signal: abortRef.current.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4000,
          messages: [{
            role: "user",
            content: SYSTEM_PROMPT(form.role, form.useCases, form.painPoints, form.tools, form.literacy),
          }],
        }),
      });
      if (!resp.ok) {
        const e = await resp.json().catch(() => ({}));
        throw new Error(e.error?.message || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      const text = data.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setGeneratedPkg({ ...parsed, employeeName: form.name, role: form.role, createdAt: new Date().toISOString() });
      setView("review");
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message);
      setView("setup");
    } finally {
      setLoading(false);
    }
  }

  const savePackage = useCallback(async (pkg) => {
    const next = { ...packages, [pkg.employeeName + "-" + Date.now()]: pkg };
    setPackages(next);
    try {
      await window.storage.set("prompt-packages-v1", JSON.stringify(next));
      setSaveLabel("✓ Saved");
      setTimeout(() => setSaveLabel("💾 Save Package"), 2000);
    } catch (e) {
      setSaveLabel("⚠ Failed");
      setTimeout(() => setSaveLabel("💾 Save Package"), 3000);
    }
  }, [packages]);

  function copyPackage(pkg) {
    const lines = [`# Prompt Package — ${pkg.employeeName} (${pkg.role})`, ""];
    pkg.prompts.forEach((p, i) => {
      lines.push(`## ${i + 1}. ${p.name}`, `Category: ${p.category}`, `Use when: ${p.description}`, "", p.prompt, "", `Tips: ${p.tips?.join(" | ")}`, "");
    });
    navigator.clipboard.writeText(lines.join("\n")).catch(() => {});
  }

  // ── Views ──

  if (view === "generating") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 14 }}>⚡</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Building prompt package…</div>
          <div style={{ fontSize: 12, color: C.muted }}>Generating 6 tailored prompts for {form.name}</div>
          <div style={{ marginTop: 20, display: "flex", gap: 6, justifyContent: "center" }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.primary, animation: `bounce ${0.6 + i * 0.15}s infinite alternate` }}/>
            ))}
          </div>
        </div>
        <style>{`@keyframes bounce { from { opacity: 0.3; transform: translateY(0); } to { opacity: 1; transform: translateY(-6px); }}`}</style>
      </div>
    );
  }

  if (view === "review" && generatedPkg) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui" }}>
        <div style={{ background: C.navy, color: "#fff", padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: "#60a5fa" }}>📦 Prompt Package — {generatedPkg.employeeName}</span>
          <div style={{ flex: 1 }}/>
          <button onClick={() => copyPackage(generatedPkg)} style={{ ...btn, background: "#334155" }}>📋 Copy All</button>
          <button onClick={() => savePackage(generatedPkg)} style={{ ...btn, background: C.done }}>{saveLabel}</button>
          <button onClick={() => { setView("setup"); setGeneratedPkg(null); }} style={{ ...btn, background: "#334155" }}>← Rebuild</button>
        </div>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 18px" }}>
          <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{generatedPkg.employeeName}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{generatedPkg.role} · {generatedPkg.prompts.length} prompts · {new Date(generatedPkg.createdAt).toLocaleDateString()}</div>
            </div>
            <span style={{ fontSize: 11, padding: "2px 8px", background: C.done + "22", color: C.done, borderRadius: 3, fontWeight: 700 }}>Ready to deliver</span>
          </div>

          {generatedPkg.prompts.map((p, i) => (
            <div key={i} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8, gap: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{i + 1}. {p.name}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{p.description}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, padding: "2px 7px", background: C.primary + "11", color: C.primary, borderRadius: 3, fontWeight: 700 }}>{p.category}</span>
                  <button onClick={() => setEditIdx(editIdx === i ? null : i)} style={{ ...btn, background: "#e2e8f0", color: "#475569", fontSize: 10, padding: "2px 7px" }}>
                    {editIdx === i ? "Done" : "Edit"}
                  </button>
                  <button onClick={() => navigator.clipboard.writeText(p.prompt).catch(() => {})} style={{ ...btn, background: C.primary + "11", color: C.primary, fontSize: 10, padding: "2px 7px" }}>
                    Copy
                  </button>
                </div>
              </div>

              {editIdx === i ? (
                <textarea value={p.prompt}
                  onChange={e => {
                    const newPrompts = [...generatedPkg.prompts];
                    newPrompts[i] = { ...p, prompt: e.target.value };
                    setGeneratedPkg(prev => ({ ...prev, prompts: newPrompts }));
                  }}
                  style={{ width: "100%", height: 140, padding: "8px 10px", borderRadius: 4, border: `1px solid ${C.primary}`, fontSize: 12, fontFamily: "monospace", outline: "none", resize: "vertical" }}
                />
              ) : (
                <div style={{ background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: 4, padding: "10px 12px", fontSize: 12, fontFamily: "monospace", whiteSpace: "pre-wrap", lineHeight: 1.6, color: "#334155", maxHeight: 160, overflowY: "auto" }}>
                  {p.prompt}
                </div>
              )}

              {p.tips?.length > 0 && (
                <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {p.tips.map((tip, ti) => (
                    <div key={ti} style={{ fontSize: 11, color: "#78350f", background: "#fffbeb", border: "1px solid #f59e0b", borderRadius: 3, padding: "2px 8px" }}>
                      💡 {tip}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "packages") {
    const pkgList = Object.entries(packages);
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui" }}>
        <div style={{ background: C.navy, color: "#fff", padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: "#60a5fa" }}>📦 Saved Packages</span>
          <div style={{ flex: 1 }}/>
          <button onClick={() => setView("setup")} style={{ ...btn, background: C.done }}>+ Build New</button>
        </div>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 18px" }}>
          {!pkgList.length
            ? <div style={{ color: C.muted, fontSize: 13, textAlign: "center", marginTop: 40 }}>No packages saved yet.</div>
            : pkgList.map(([key, pkg]) => (
              <div key={key} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 6, padding: "12px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{pkg.employeeName}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{pkg.role} · {pkg.prompts?.length} prompts · {new Date(pkg.createdAt).toLocaleDateString()}</div>
                </div>
                <button onClick={() => { setGeneratedPkg(pkg); setView("review"); }} style={{ ...btn, background: C.primary }}>View →</button>
                <button onClick={() => copyPackage(pkg)} style={{ ...btn, background: "#334155" }}>📋 Copy</button>
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  // SETUP VIEW
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui" }}>
      <div style={{ background: C.navy, color: "#fff", padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: "#60a5fa" }}>⚡ Prompt Package Builder</span>
        <div style={{ flex: 1 }}/>
        {Object.keys(packages).length > 0 && (
          <button onClick={() => setView("packages")} style={{ ...btn, background: "#334155" }}>📦 Saved ({Object.keys(packages).length})</button>
        )}
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 18px" }}>
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 6, padding: 12, marginBottom: 14, fontSize: 12, color: C.accent }}>
            ⚠ {error}
          </div>
        )}

        {/* Load from intake */}
        {intakes.length > 0 && (
          <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", marginBottom: 8 }}>Load from Intake</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {intakes.slice(0, 8).map(rec => (
                <button key={rec.id} onClick={() => loadFromIntake(rec)}
                  style={{ padding: "5px 10px", borderRadius: 4, border: `1px solid ${selectedEmp?.id === rec.id ? C.primary : C.border}`, background: selectedEmp?.id === rec.id ? C.primary + "11" : "#fff", color: selectedEmp?.id === rec.id ? C.primary : "#334155", fontSize: 11, cursor: "pointer", fontFamily: "system-ui", fontWeight: selectedEmp?.id === rec.id ? 700 : 400 }}>
                  {rec.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Employee info */}
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.navy, marginBottom: 12 }}>Employee</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 14px" }}>
            <div>
              <div style={labelStyle}>Name *</div>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} placeholder="Jane Smith"/>
            </div>
            <div>
              <div style={labelStyle}>Role *</div>
              <input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={inputStyle} placeholder="Or pick below" list="roles"/>
              <datalist id="roles">{ROLE_PRESETS.map(r => <option key={r} value={r}/>)}</datalist>
            </div>
            <div>
              <div style={labelStyle}>AI Literacy</div>
              <select value={form.literacy} onChange={e => setForm(p => ({ ...p, literacy: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="none">None</option>
                <option value="casual">Casual</option>
                <option value="regular">Regular</option>
                <option value="power">Power</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Use cases */}
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.navy, marginBottom: 4 }}>Use Cases to Cover</div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>Select the use cases to build prompts around. Mix categories for a well-rounded package.</div>
          {Object.entries(USECASE_LIBRARY).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: "uppercase", marginBottom: 5, letterSpacing: "0.4px" }}>{cat}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {items.map(uc => {
                  const sel = form.useCases.includes(uc);
                  return (
                    <button key={uc} onClick={() => toggleUseCase(uc)}
                      style={{ padding: "4px 8px", borderRadius: 4, border: `1px solid ${sel ? C.primary : C.border}`, background: sel ? C.primary + "11" : "#fff", color: sel ? C.primary : "#475569", fontSize: 11, cursor: "pointer", fontFamily: "system-ui", fontWeight: sel ? 700 : 400, transition: "all 0.1s" }}>
                      {sel ? "✓ " : ""}{uc}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>{form.useCases.length} use cases selected — Claude will generate 6 prompts covering these.</div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={generate} disabled={!form.name || !form.role || loading}
            style={{ ...btn, background: form.name && form.role && !loading ? C.accent : "#e2e8f0", color: form.name && form.role && !loading ? "#fff" : C.muted, cursor: form.name && form.role && !loading ? "pointer" : "not-allowed", padding: "10px 24px", fontSize: 13, fontWeight: 700 }}>
            ⚡ Generate Package for {form.name || "Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}

const btn = { padding: "5px 12px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "system-ui", color: "#fff" };
const labelStyle = { fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 4 };
const inputStyle = { width: "100%", padding: "7px 9px", borderRadius: 4, border: `1px solid ${C.border}`, fontSize: 12, fontFamily: "system-ui", outline: "none", marginBottom: 10 };
