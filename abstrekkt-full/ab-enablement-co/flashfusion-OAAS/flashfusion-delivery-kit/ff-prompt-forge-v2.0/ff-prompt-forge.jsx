import { useState, useEffect, useRef } from "react";

// ── FlashFusion brand tokens ──────────────────────────────────────────────────
const F = {
  bg:"#0F0618", sf:"#150a26", sf2:"#1d1031", sf3:"#2a1848",
  b:"#2d1a4d", b2:"#3f2766", b3:"#5b3a8a",
  t:"#ede4ff", t2:"#a99bcc", t3:"#6f5e94",
  ac:"#A855F7", pk:"#F472B6", cy:"#22D3EE",
  gn:"#34d399", rd:"#f87171", yw:"#fbbf24",
  acS:"rgba(168,85,247,.14)", pkS:"rgba(244,114,182,.12)",
  cyS:"rgba(34,211,238,.12)", gnS:"rgba(52,211,153,.12)",
};
const mono = { fontFamily:"'Geist Mono','JetBrains Mono',ui-monospace,monospace" };
const sans = { fontFamily:"'Inter',system-ui,-apple-system,sans-serif" };

// ── Storage helpers ───────────────────────────────────────────────────────────
const sget = async k => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } };
const sset = async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} };

// ── API ───────────────────────────────────────────────────────────────────────
const api = async (msgs, max = 2000, sys = null, model = "claude-sonnet-4-6") => {
  const b = { model, max_tokens: max, messages: msgs };
  if (sys) b.system = sys;
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error?.message || `HTTP ${r.status}`);
  return d.content.filter(b => b.type === "text").map(b => b.text).join("");
};

// ── Shared primitives ─────────────────────────────────────────────────────────
const GF = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:${F.b2};border-radius:3px}`;

function Btn({ children, onClick, disabled, accent, sm, style = {} }) {
  const c = disabled ? F.t3 : accent ? F.ac : F.t2;
  const bc = disabled ? F.b : accent ? F.b3 : F.b2;
  return <button onClick={onClick} disabled={disabled} style={{
    background: "transparent", border: `1px solid ${bc}`, borderRadius: 6,
    color: c, ...mono, fontSize: sm ? 10 : 11, letterSpacing: "0.06em",
    textTransform: "uppercase", padding: sm ? "3px 9px" : "6px 14px",
    cursor: disabled ? "not-allowed" : "pointer", transition: "all .15s",
    opacity: disabled ? 0.4 : 1, ...style,
  }}>{children}</button>;
}
function Tag({ children, color }) {
  return <span style={{ background: F.sf3, border: `1px solid ${F.b2}`, borderRadius: 4, ...mono, fontSize: 9, padding: "2px 6px", color: color || F.t3 }}>{children}</span>;
}
function Inp({ value, onChange, placeholder, type = "text", style = {}, mono: useMono }) {
  return <input value={value} onChange={onChange} placeholder={placeholder} type={type}
    style={{ width: "100%", padding: "7px 10px", borderRadius: 5, border: `1px solid ${F.b2}`, fontSize: 12, background: F.sf2, color: F.t, outline: "none", marginBottom: 7, ...(useMono ? mono : sans), ...style }} />;
}
function Lbl({ children }) {
  return <div style={{ ...mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: F.t3, marginBottom: 4 }}>{children}</div>;
}
function Area({ value, onChange, placeholder, rows = 4, mono: useMono }) {
  return <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
    style={{ width: "100%", padding: "7px 10px", borderRadius: 5, border: `1px solid ${F.b2}`, fontSize: 12, background: F.sf2, color: F.t, outline: "none", resize: "vertical", fontFamily: useMono ? "'Geist Mono',monospace" : "'Inter',sans-serif", marginBottom: 7, lineHeight: 1.55 }} />;
}
function Card({ children, style = {} }) {
  return <div style={{ background: F.sf, border: `1px solid ${F.b}`, borderRadius: 8, padding: "12px 14px", marginBottom: 8, ...style }}>{children}</div>;
}
function Sh({ children }) {
  return <div style={{ fontWeight: 600, fontSize: 13, color: F.t, marginBottom: 7 }}>{children}</div>;
}
function AiBadge({ loading, onClick, label = "AI Fill" }) {
  return <button onClick={onClick} disabled={loading} style={{ background: F.acS, border: `1px solid ${F.b3}`, borderRadius: 4, color: loading ? F.t3 : F.ac, ...mono, fontSize: 9, padding: "2px 7px", cursor: loading ? "not-allowed" : "pointer", marginBottom: 4 }}>
    {loading ? "◌ thinking…" : `✦ ${label}`}
  </button>;
}

// ── MODELS ────────────────────────────────────────────────────────────────────
const MODELS = {
  "claude-sonnet-4-6": { name: "Sonnet 4.6", $/in: 3, $/out: 15, ctx: "1M" },
  "claude-opus-4-7": { name: "Opus 4.7", $/in: 5, $/out: 25, ctx: "1M" },
  "claude-haiku-4-5-20251001": { name: "Haiku 4.5", $/in: 0.80, $/out: 4, ctx: "200K" },
};

// ── STUDIO TAB ────────────────────────────────────────────────────────────────
const STUDIO_BLANK = {
  mission: "", role: "", context: "", audience: "", task: "",
  constraints: [], antirefs: [], format: "", schema: "", length: "",
  reasoning: "none", prefill: "", variables: [],
  toggles: { quoteFirst: false, saySoIfDontKnow: true, draftReview: false, logicFirst: false },
  model: "claude-sonnet-4-6",
};

function StudioTab({ library, onSave }) {
  const [form, setForm] = useState({ ...STUDIO_BLANK });
  const [compiled, setCompiled] = useState("");
  const [fillLoading, setFillLoading] = useState({});
  const [cascading, setCascading] = useState(false);
  const [result, setResult] = useState("");
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState("build");
  const sf = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const togT = k => setForm(p => ({ ...p, toggles: { ...p.toggles, [k]: !p.toggles[k] } }));
  const addItem = k => setForm(p => ({ ...p, [k]: [...(p[k] || []), ""] }));
  const setItem = (k, i, v) => setForm(p => { const a = [...p[k]]; a[i] = v; return { ...p, [k]: a }; });
  const rmItem = (k, i) => setForm(p => ({ ...p, [k]: p[k].filter((_, j) => j !== i) }));

  const aiFill = async field => {
    if (!form.mission.trim()) return;
    setFillLoading(p => ({ ...p, [field]: true }));
    const labels = { role: "role definition (1-2 sentences)", context: "background context", audience: "target audience", task: "step-by-step task instructions", format: "output format instructions", schema: "output schema or template", length: "length constraint" };
    try {
      const v = await api([{ role: "user", content: `Based on this mission: "${form.mission}"\n\nWrite the ${labels[field] || field} for a Claude system prompt. Be specific and concrete. Output only the field value — no labels, no explanation.` }], 400);
      sf(field, v.trim());
    } catch {}
    setFillLoading(p => ({ ...p, [field]: false }));
  };

  const smartFill = async () => {
    if (!form.mission.trim()) return;
    setCascading(true);
    const fields = ["role", "context", "audience", "task", "format"];
    for (const field of fields) {
      setFillLoading(p => ({ ...p, [field]: true }));
      try {
        const v = await api([{ role: "user", content: `Mission: "${form.mission}"\n\nWrite the ${field} for a Claude system prompt. Output only the field value — no labels.` }], 400);
        setForm(p => ({ ...p, [field]: v.trim() }));
      } catch {}
      setFillLoading(p => ({ ...p, [field]: false }));
    }
    setCascading(false);
  };

  const compile = () => {
    const f = form;
    let out = "";
    if (f.role) out += `<role>\n${f.role}\n</role>\n\n`;
    if (f.context) out += `<context>\n${f.context}\n</context>\n\n`;
    if (f.audience) out += `<audience>\n${f.audience}\n</audience>\n\n`;
    if (f.task) out += `<task>\n${f.task}\n</task>\n\n`;
    if (f.constraints?.filter(Boolean).length) out += `<constraints>\n${f.constraints.filter(Boolean).map(c => `- ${c}`).join("\n")}\n</constraints>\n\n`;
    if (f.antirefs?.filter(Boolean).length) out += `<anti_patterns>\n${f.antirefs.filter(Boolean).map(c => `- ${c}`).join("\n")}\n</anti_patterns>\n\n`;
    if (f.format) out += `<output_format>\n${f.format}${f.schema ? "\n\n" + f.schema : ""}\n</output_format>\n\n`;
    if (f.length) out += `<length>${f.length}</length>\n\n`;
    if (f.reasoning !== "none") out += `<reasoning>Use ${f.reasoning} thinking before responding.</reasoning>\n\n`;
    const flags = Object.entries(f.toggles).filter(([, v]) => v).map(([k]) => ({ quoteFirst: "Quote the most important context before answering.", saySoIfDontKnow: "Say 'I don't know' rather than guessing.", draftReview: "Draft a response, review it against the task, then output the improved version.", logicFirst: "State your logic before your conclusion." }[k])).filter(Boolean);
    if (flags.length) out += `<directives>\n${flags.map(f => `- ${f}`).join("\n")}\n</directives>\n\n`;
    if (f.prefill) out += `\nStart your response with: "${f.prefill}"`;
    setCompiled(out.trim());
    setTab("preview");
  };

  const run = async () => {
    if (!compiled) return;
    setRunning(true); setResult("");
    try { const r = await api([{ role: "user", content: form.mission || "Test this prompt." }], 1500, compiled, form.model); setResult(r); }
    catch (e) { setResult("Error: " + e.message); }
    setRunning(false);
  };

  const save = () => {
    if (!form.mission.trim() || !compiled) return;
    const rec = { id: Date.now(), name: form.mission.slice(0, 50), mission: form.mission, prompt: compiled, model: form.model, tags: [], createdAt: new Date().toISOString() };
    onSave(rec);
  };

  const TTABS = [["build", "Build"], ["preview", "Preview"], ["run", "Test"]];
  return <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
    <div style={{ display: "flex", borderBottom: `1px solid ${F.b}`, padding: "0 16px", flexShrink: 0, alignItems: "center", gap: 10 }}>
      {TTABS.map(([id, l]) => <button key={id} onClick={() => setTab(id)} style={{ background: "none", border: "none", borderBottom: `2px solid ${tab === id ? F.ac : "transparent"}`, cursor: "pointer", ...sans, fontSize: 12, fontWeight: 500, padding: "8px 10px", color: tab === id ? F.t : F.t2, marginBottom: -1, transition: ".15s" }}>{l}</button>)}
      <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
        {tab === "build" && <Btn sm onClick={smartFill} disabled={!form.mission.trim() || cascading} accent>✦ Smart Fill</Btn>}
        {tab === "build" && <Btn sm onClick={compile} disabled={!form.mission.trim()}>Compile →</Btn>}
        {tab === "preview" && <><Btn sm onClick={run} disabled={!compiled || running} accent>{running ? "◌ Running…" : "▶ Test"}</Btn><Btn sm onClick={save} disabled={!compiled}>Save</Btn><Btn sm onClick={() => navigator.clipboard.writeText(compiled).catch(() => {})}>Copy</Btn></>}
      </div>
    </div>
    <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
      {tab === "build" && <div style={{ maxWidth: 700 }}>
        <Card>
          <Lbl>Mission (seed for Smart Fill)</Lbl>
          <Area value={form.mission} onChange={e => sf("mission", e.target.value)} placeholder="What do you actually need Claude to do? Be specific." rows={2} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
            <div><div style={{ display: "flex", justifyContent: "space-between" }}><Lbl>Role</Lbl><AiBadge loading={fillLoading.role} onClick={() => aiFill("role")} /></div><Area value={form.role} onChange={e => sf("role", e.target.value)} placeholder="You are a…" rows={2} /></div>
            <div><div style={{ display: "flex", justifyContent: "space-between" }}><Lbl>Audience</Lbl><AiBadge loading={fillLoading.audience} onClick={() => aiFill("audience")} /></div><Area value={form.audience} onChange={e => sf("audience", e.target.value)} placeholder="Who reads the output?" rows={2} /></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><Lbl>Context</Lbl><AiBadge loading={fillLoading.context} onClick={() => aiFill("context")} /></div>
          <Area value={form.context} onChange={e => sf("context", e.target.value)} placeholder="Background info Claude needs before starting." rows={3} />
          <div style={{ display: "flex", justifyContent: "space-between" }}><Lbl>Task</Lbl><AiBadge loading={fillLoading.task} onClick={() => aiFill("task")} /></div>
          <Area value={form.task} onChange={e => sf("task", e.target.value)} placeholder="Step-by-step instructions. Number them." rows={4} />
        </Card>
        <Card>
          <Lbl>Constraints</Lbl>
          {(form.constraints || []).map((c, i) => <div key={i} style={{ display: "flex", gap: 5, marginBottom: 4 }}>
            <input value={c} onChange={e => setItem("constraints", i, e.target.value)} style={{ flex: 1, padding: "5px 8px", borderRadius: 4, border: `1px solid ${F.b2}`, fontSize: 12, background: F.sf2, color: F.t, outline: "none", ...sans }} placeholder="e.g. Output under 300 words" />
            <Btn sm onClick={() => rmItem("constraints", i)}>✕</Btn>
          </div>)}
          <Btn sm onClick={() => addItem("constraints")}>+ Add</Btn>
        </Card>
        <Card>
          <Lbl>Anti-patterns (what NOT to do)</Lbl>
          {(form.antirefs || []).map((c, i) => <div key={i} style={{ display: "flex", gap: 5, marginBottom: 4 }}>
            <input value={c} onChange={e => setItem("antirefs", i, e.target.value)} style={{ flex: 1, padding: "5px 8px", borderRadius: 4, border: `1px solid ${F.b2}`, fontSize: 12, background: F.sf2, color: F.t, outline: "none", ...sans }} placeholder="e.g. Never say 'I recommend'" />
            <Btn sm onClick={() => rmItem("antirefs", i)}>✕</Btn>
          </div>)}
          <Btn sm onClick={() => addItem("antirefs")}>+ Add</Btn>
        </Card>
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
            <div><div style={{ display: "flex", justifyContent: "space-between" }}><Lbl>Output Format</Lbl><AiBadge loading={fillLoading.format} onClick={() => aiFill("format")} /></div><Area value={form.format} onChange={e => sf("format", e.target.value)} placeholder="markdown / JSON / prose…" rows={2} /></div>
            <div><Lbl>Length</Lbl><Inp value={form.length} onChange={e => sf("length", e.target.value)} placeholder="Under 500 words / 3 bullets" /></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><Lbl>Output Schema</Lbl><AiBadge loading={fillLoading.schema} onClick={() => aiFill("schema")} /></div>
          <Area value={form.schema} onChange={e => sf("schema", e.target.value)} placeholder="# Section\n## Sub-section\n- item" rows={3} mono />
        </Card>
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <Lbl>Reasoning</Lbl>
              <div style={{ display: "flex", gap: 4 }}>
                {[["none", "Off"], ["brief", "Brief"], ["extended", "Extended"]].map(([id, l]) => <button key={id} onClick={() => sf("reasoning", id)} style={{ flex: 1, background: "transparent", border: `1px solid ${form.reasoning === id ? F.ac : F.b2}`, borderRadius: 4, color: form.reasoning === id ? F.ac : F.t2, ...mono, fontSize: 9, padding: "4px 0", cursor: "pointer" }}>{l}</button>)}
              </div>
            </div>
            <div>
              <Lbl>Model</Lbl>
              <select value={form.model} onChange={e => sf("model", e.target.value)} style={{ width: "100%", padding: "6px 8px", borderRadius: 4, border: `1px solid ${F.b2}`, fontSize: 11, background: F.sf2, color: F.t, outline: "none", ...mono }}>
                {Object.entries(MODELS).map(([k, v]) => <option key={k} value={k}>{v.name} · ${v["$/in"]}/${v["$/out"]}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginTop: 8 }}>
            {Object.entries({ quoteFirst: "Quote first", saySoIfDontKnow: "Say if unsure", draftReview: "Draft → review", logicFirst: "Logic first" }).map(([k, l]) => <label key={k} onClick={() => togT(k)} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", padding: "5px 8px", borderRadius: 4, border: `1px solid ${form.toggles[k] ? F.ac : F.b}`, background: form.toggles[k] ? F.acS : "transparent", transition: ".12s" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${form.toggles[k] ? F.ac : F.t3}`, background: form.toggles[k] ? F.ac : "transparent", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: form.toggles[k] ? F.t : F.t2 }}>{l}</span>
            </label>)}
          </div>
        </Card>
      </div>}
      {tab === "preview" && <div style={{ maxWidth: 720 }}>
        {compiled ? <div style={{ background: F.sf2, border: `1px solid ${F.b2}`, borderRadius: 8, padding: "14px 16px" }}>
          <pre style={{ ...mono, fontSize: 11, color: F.t, whiteSpace: "pre-wrap", lineHeight: 1.65 }}>{compiled}</pre>
        </div> : <div style={{ textAlign: "center", color: F.t3, padding: 40, ...mono, fontSize: 11 }}>Build and Compile first.</div>}
      </div>}
      {tab === "run" && <div style={{ maxWidth: 720 }}>
        <Card><span style={{ ...mono, fontSize: 9, color: F.t3 }}>Running compiled prompt on: {form.mission || "(no mission set)"} · model: {MODELS[form.model]?.name}</span></Card>
        {running && <div style={{ padding: "16px", textAlign: "center", ...mono, fontSize: 11, color: F.ac }}>◌ Generating…</div>}
        {result && <div style={{ background: F.sf2, border: `1px solid ${F.b2}`, borderRadius: 8, padding: "14px 16px" }}>
          <pre style={{ fontSize: 12, color: F.t, whiteSpace: "pre-wrap", lineHeight: 1.65, ...sans }}>{result}</pre>
        </div>}
      </div>}
    </div>
  </div>;
}

// ── AGENT SPEC TAB ────────────────────────────────────────────────────────────
const SPEC_BLANK = { name: "", goal: "", trigger: "", inputs: "", tools: [], guardrails: [], success: [], observability: "" };
function AgentSpecTab({ library, onSave }) {
  const [form, setForm] = useState({ ...SPEC_BLANK });
  const [result, setResult] = useState(""); const [loading, setLoading] = useState(false);
  const sf = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const addItem = k => setForm(p => ({ ...p, [k]: [...(p[k] || []), ""] }));
  const setItem = (k, i, v) => setForm(p => { const a = [...p[k]]; a[i] = v; return { ...p, [k]: a }; });
  const rmItem = (k, i) => setForm(p => ({ ...p, [k]: p[k].filter((_, j) => j !== i) }));
  const generate = async () => {
    setLoading(true); setResult("");
    const sys = `You are an AI agent architect. Generate precise, production-ready agent specs. Use this exact format:\n\n# Agent Spec: {name}\n\n## Purpose\n## Trigger\n## Inputs Schema (JSON)\n## Tools Available (name · rate limit · cost/call)\n## System Prompt (XML-structured, ≤1200 tokens)\n## Guardrails & Abuse Vectors (3+ vectors)\n## Success Criteria (measurable, numeric)\n## Observability & Alerting\n## Cost Model (daily ceiling)\n\nBe specific. No vague placeholders.`;
    const msg = `Build an agent spec for:\n\nName: ${form.name || "unnamed agent"}\nGoal: ${form.goal}\nTrigger: ${form.trigger || "webhook"}\nInputs: ${form.inputs || "user query"}\nTools: ${(form.tools || []).filter(Boolean).join(", ") || "web search, file read"}\nGuardrails needed: ${(form.guardrails || []).filter(Boolean).join(", ") || "standard"}\nSuccess criteria: ${(form.success || []).filter(Boolean).join(", ") || "accuracy, latency"}\nObservability: ${form.observability || "standard logging"}`;
    try { const r = await api([{ role: "user", content: msg }], 2500, sys, "claude-sonnet-4-6"); setResult(r); }
    catch (e) { setResult("Error: " + e.message); }
    setLoading(false);
  };
  const save = () => { if (!form.goal.trim() || !result) return; onSave({ id: Date.now(), name: form.name || form.goal.slice(0, 40), mission: form.goal, prompt: result, tags: ["agent-spec"], createdAt: new Date().toISOString() }); };
  return <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
    <div style={{ width: 340, flexShrink: 0, borderRight: `1px solid ${F.b}`, overflowY: "auto", padding: 14 }}>
      <Sh>Agent Spec Builder</Sh>
      <p style={{ fontSize: 11, color: F.t2, marginBottom: 12 }}>Define what the agent does, what it can touch, and how to know it's working.</p>
      <Lbl>Agent Name</Lbl><Inp value={form.name} onChange={e => sf("name", e.target.value)} placeholder="e.g. Enablement Intake Processor" />
      <Lbl>Goal *</Lbl><Area value={form.goal} onChange={e => sf("goal", e.target.value)} placeholder="What does this agent accomplish? Be specific." rows={3} />
      <Lbl>Trigger</Lbl><Inp value={form.trigger} onChange={e => sf("trigger", e.target.value)} placeholder="webhook / schedule / user action" />
      <Lbl>Input Schema</Lbl><Area value={form.inputs} onChange={e => sf("inputs", e.target.value)} placeholder='{"name":"string","plan":"enum","role":"string"}' rows={2} mono />
      <Lbl>Tools Available</Lbl>
      {(form.tools || []).map((t, i) => <div key={i} style={{ display: "flex", gap: 4, marginBottom: 4 }}><input value={t} onChange={e => setItem("tools", i, e.target.value)} style={{ flex: 1, padding: "5px 8px", borderRadius: 4, border: `1px solid ${F.b2}`, fontSize: 11, background: F.sf2, color: F.t, outline: "none", ...sans }} placeholder="Notion write · 10/min · $0.001/call" /><Btn sm onClick={() => rmItem("tools", i)}>✕</Btn></div>)}
      <Btn sm onClick={() => addItem("tools")}>+ Tool</Btn>
      <div style={{ marginTop: 8 }}><Lbl>Guardrails / Abuse Vectors</Lbl>
        {(form.guardrails || []).map((g, i) => <div key={i} style={{ display: "flex", gap: 4, marginBottom: 4 }}><input value={g} onChange={e => setItem("guardrails", i, e.target.value)} style={{ flex: 1, padding: "5px 8px", borderRadius: 4, border: `1px solid ${F.b2}`, fontSize: 11, background: F.sf2, color: F.t, outline: "none", ...sans }} placeholder="e.g. Prompt injection via user input" /><Btn sm onClick={() => rmItem("guardrails", i)}>✕</Btn></div>)}
        <Btn sm onClick={() => addItem("guardrails")}>+ Guardrail</Btn>
      </div>
      <div style={{ marginTop: 8 }}><Lbl>Success Criteria</Lbl>
        {(form.success || []).map((s, i) => <div key={i} style={{ display: "flex", gap: 4, marginBottom: 4 }}><input value={s} onChange={e => setItem("success", i, e.target.value)} style={{ flex: 1, padding: "5px 8px", borderRadius: 4, border: `1px solid ${F.b2}`, fontSize: 11, background: F.sf2, color: F.t, outline: "none", ...sans }} placeholder="e.g. < 3s latency on 95th pct" /><Btn sm onClick={() => rmItem("success", i)}>✕</Btn></div>)}
        <Btn sm onClick={() => addItem("success")}>+ Criterion</Btn>
      </div>
      <div style={{ marginTop: 14, display: "flex", gap: 6 }}>
        <Btn onClick={generate} disabled={!form.goal.trim() || loading} accent>{loading ? "◌ Generating…" : "Generate Spec →"}</Btn>
        {result && <Btn onClick={save}>Save</Btn>}
      </div>
    </div>
    <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
      {result ? <div style={{ background: F.sf2, border: `1px solid ${F.b2}`, borderRadius: 8, padding: "14px 16px" }}>
        {result.split("\n").map((line, i) => {
          const h1 = line.startsWith("# "); const h2 = line.startsWith("## "); const bullet = line.trim().startsWith("- ");
          if (h1) return <div key={i} style={{ fontWeight: 700, fontSize: 15, color: F.t, marginBottom: 8, marginTop: 4, fontFamily: "'Inter',sans-serif" }}>{line.replace("# ", "")}</div>;
          if (h2) return <div key={i} style={{ fontWeight: 600, fontSize: 13, color: F.ac, marginTop: 14, marginBottom: 5, fontFamily: "'Inter',sans-serif" }}>{line.replace("## ", "")}</div>;
          if (bullet) return <div key={i} style={{ fontSize: 12, color: F.t2, marginBottom: 3, paddingLeft: 12, display: "flex", gap: 6 }}><span style={{ color: F.cy }}>◆</span>{line.replace(/^-\s*/, "")}</div>;
          if (!line.trim()) return <div key={i} style={{ height: 5 }} />;
          return <div key={i} style={{ fontSize: 12, color: F.t2, lineHeight: 1.6, marginBottom: 3, fontFamily: "'Inter',sans-serif" }}>{line}</div>;
        })}
        <div style={{ display: "flex", gap: 5, marginTop: 12 }}>
          <Btn sm onClick={() => navigator.clipboard.writeText(result).catch(() => {})}>Copy Markdown</Btn>
        </div>
      </div> : <div style={{ textAlign: "center", color: F.t3, padding: 60, ...mono, fontSize: 11 }}>{loading ? "◌ Generating agent spec…" : "Fill in the form and click Generate Spec →"}</div>}
    </div>
  </div>;
}

// ── SYSTEM DESIGNER TAB ───────────────────────────────────────────────────────
const SYS_BLANK = { appName: "", purpose: "", persona: "", capabilities: [], prohibited: [], format: "", edgeCases: "", tone: "direct", model: "claude-sonnet-4-6" };
function SysDesignerTab({ onSave }) {
  const [form, setForm] = useState({ ...SYS_BLANK });
  const [result, setResult] = useState(""); const [loading, setLoading] = useState(false); const [testing, setTesting] = useState(false); const [testInput, setTestInput] = useState(""); const [testResult, setTestResult] = useState("");
  const sf = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const addItem = k => setForm(p => ({ ...p, [k]: [...(p[k] || []), ""] }));
  const setItem = (k, i, v) => setForm(p => { const a = [...p[k]]; a[i] = v; return { ...p, [k]: a }; });
  const rmItem = (k, i) => setForm(p => ({ ...p, [k]: p[k].filter((_, j) => j !== i) }));
  const generate = async () => {
    setLoading(true); setResult("");
    const sys = `You are a system prompt engineer specializing in production Claude deployments. Write tight, effective system prompts. Use XML tags. No filler. Every line earns its place. Output only the system prompt — no explanation, no markdown wrapper.`;
    const msg = `Write a production system prompt for:\n\nApp: ${form.appName || "unnamed app"}\nPurpose: ${form.purpose}\nPersona: ${form.persona || "expert assistant"}\nCapabilities: ${(form.capabilities || []).filter(Boolean).join("; ") || "general"}\nProhibited: ${(form.prohibited || []).filter(Boolean).join("; ") || "standard restrictions"}\nOutput format: ${form.format || "conversational prose"}\nTone: ${form.tone}\nEdge cases to handle: ${form.edgeCases || "standard"}\n\nWrite it tight. XML-structured. Under 800 tokens.`;
    try { const r = await api([{ role: "user", content: msg }], 1200, sys); setResult(r); }
    catch (e) { setResult("Error: " + e.message); }
    setLoading(false);
  };
  const test = async () => {
    if (!result || !testInput.trim()) return;
    setTesting(true); setTestResult("");
    try { const r = await api([{ role: "user", content: testInput }], 800, result, form.model); setTestResult(r); }
    catch (e) { setTestResult("Error: " + e.message); }
    setTesting(false);
  };
  const save = () => { if (!form.purpose.trim() || !result) return; onSave({ id: Date.now(), name: form.appName || form.purpose.slice(0, 40), mission: form.purpose, prompt: result, tags: ["system-prompt"], createdAt: new Date().toISOString() }); };
  return <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", height: "100%", overflow: "hidden" }}>
    <div style={{ borderRight: `1px solid ${F.b}`, overflowY: "auto", padding: 14 }}>
      <Sh>System Prompt Designer</Sh>
      <p style={{ fontSize: 11, color: F.t2, marginBottom: 12 }}>Design production system prompts for apps, agents, and deployments.</p>
      <Lbl>App / Agent Name</Lbl><Inp value={form.appName} onChange={e => sf("appName", e.target.value)} placeholder="e.g. FlashFusion Intake Bot" />
      <Lbl>Purpose *</Lbl><Area value={form.purpose} onChange={e => sf("purpose", e.target.value)} placeholder="What does this app do? Who uses it?" rows={2} />
      <Lbl>Persona</Lbl><Inp value={form.persona} onChange={e => sf("persona", e.target.value)} placeholder="e.g. Senior AI enablement specialist" />
      <Lbl>Capabilities (what it CAN do)</Lbl>
      {(form.capabilities || []).map((c, i) => <div key={i} style={{ display: "flex", gap: 4, marginBottom: 4 }}><input value={c} onChange={e => setItem("capabilities", i, e.target.value)} style={{ flex: 1, padding: "5px 8px", borderRadius: 4, border: `1px solid ${F.b2}`, fontSize: 11, background: F.sf2, color: F.t, outline: "none", ...sans }} /><Btn sm onClick={() => rmItem("capabilities", i)}>✕</Btn></div>)}
      <Btn sm onClick={() => addItem("capabilities")}>+ Capability</Btn>
      <div style={{ marginTop: 8 }}><Lbl>Prohibited (what it must NOT do)</Lbl>
        {(form.prohibited || []).map((p, i) => <div key={i} style={{ display: "flex", gap: 4, marginBottom: 4 }}><input value={p} onChange={e => setItem("prohibited", i, e.target.value)} style={{ flex: 1, padding: "5px 8px", borderRadius: 4, border: `1px solid ${F.b2}`, fontSize: 11, background: F.sf2, color: F.t, outline: "none", ...sans }} /><Btn sm onClick={() => rmItem("prohibited", i)}>✕</Btn></div>)}
        <Btn sm onClick={() => addItem("prohibited")}>+ Rule</Btn>
      </div>
      <div style={{ marginTop: 8 }}>
        <Lbl>Output Format</Lbl><Inp value={form.format} onChange={e => sf("format", e.target.value)} placeholder="conversational prose / structured JSON / markdown" />
        <Lbl>Tone</Lbl>
        <div style={{ display: "flex", gap: 4, marginBottom: 7 }}>{["direct", "warm", "formal", "technical"].map(t => <button key={t} onClick={() => sf("tone", t)} style={{ flex: 1, background: "transparent", border: `1px solid ${form.tone === t ? F.ac : F.b2}`, borderRadius: 4, color: form.tone === t ? F.ac : F.t2, ...mono, fontSize: 9, padding: "4px 0", cursor: "pointer", textTransform: "capitalize" }}>{t}</button>)}</div>
        <Lbl>Edge Cases</Lbl><Area value={form.edgeCases} onChange={e => sf("edgeCases", e.target.value)} placeholder="Ambiguous input, off-topic requests, empty responses…" rows={2} />
        <Lbl>Model</Lbl>
        <select value={form.model} onChange={e => sf("model", e.target.value)} style={{ width: "100%", padding: "6px 8px", borderRadius: 4, border: `1px solid ${F.b2}`, fontSize: 11, background: F.sf2, color: F.t, outline: "none", ...mono, marginBottom: 7 }}>
          {Object.entries(MODELS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <Btn onClick={generate} disabled={!form.purpose.trim() || loading} accent>{loading ? "◌ Generating…" : "Generate →"}</Btn>
        {result && <Btn onClick={save} sm>Save</Btn>}
      </div>
    </div>
    <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
      {result && <><div style={{ background: F.sf2, border: `1px solid ${F.b2}`, borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <Tag color={F.ac}>SYSTEM PROMPT</Tag>
          <Btn sm onClick={() => navigator.clipboard.writeText(result).catch(() => {})}>Copy</Btn>
        </div>
        <pre style={{ ...mono, fontSize: 11, color: F.t, whiteSpace: "pre-wrap", lineHeight: 1.65 }}>{result}</pre>
      </div>
      <Card>
        <Sh>Live Test</Sh>
        <Area value={testInput} onChange={e => setTestInput(e.target.value)} placeholder="Send a message to this system prompt…" rows={3} />
        <Btn onClick={test} disabled={!testInput.trim() || testing} accent sm>{testing ? "◌ Testing…" : "Send →"}</Btn>
        {testResult && <div style={{ marginTop: 10, background: F.sf3, borderRadius: 6, padding: "10px 12px", fontSize: 12, color: F.t2, lineHeight: 1.6, whiteSpace: "pre-wrap", ...sans }}>{testResult}</div>}
      </Card></>}
      {!result && !loading && <div style={{ textAlign: "center", color: F.t3, padding: 60, ...mono, fontSize: 11 }}>Define your app and click Generate →</div>}
      {loading && <div style={{ textAlign: "center", color: F.ac, padding: 60, ...mono, fontSize: 11 }}>◌ Designing system prompt…</div>}
    </div>
  </div>;
}

// ── LIBRARY TAB ───────────────────────────────────────────────────────────────
function LibraryTab({ library, onDelete }) {
  const [q, setQ] = useState(""); const [tag, setTag] = useState("all"); const [copied, setCopied] = useState("");
  const allTags = ["all", ...new Set(library.flatMap(p => p.tags || []))];
  const res = library.filter(p => (tag === "all" || (p.tags || []).includes(tag)) && (!q || p.name.toLowerCase().includes(q.toLowerCase()) || p.mission?.toLowerCase().includes(q.toLowerCase())));
  const copy = (id, txt) => { navigator.clipboard.writeText(txt).catch(() => {}); setCopied(id); setTimeout(() => setCopied(""), 1500); };
  return <div style={{ padding: 14, maxWidth: 820, overflowY: "auto", height: "100%" }}>
    <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search library…" style={{ padding: "6px 10px", borderRadius: 5, border: `1px solid ${F.b2}`, fontSize: 12, background: F.sf2, color: F.t, outline: "none", width: 220, ...sans }} />
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{allTags.map(t => <button key={t} onClick={() => setTag(t)} style={{ background: "transparent", border: `1px solid ${tag === t ? F.ac : F.b}`, borderRadius: 4, color: tag === t ? F.ac : F.t2, ...mono, fontSize: 9, padding: "3px 8px", cursor: "pointer" }}>{t}</button>)}</div>
      <span style={{ ...mono, fontSize: 9, color: F.t3, marginLeft: "auto" }}>{res.length} prompts</span>
    </div>
    {!res.length && <div style={{ textAlign: "center", color: F.t3, padding: 40, ...mono, fontSize: 11 }}>No prompts saved yet. Build prompts in Studio, Agent Spec, or System Designer, then save them here.</div>}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {res.map(p => <div key={p.id} style={{ background: F.sf, border: `1px solid ${F.b}`, borderRadius: 8, padding: "10px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
          <div><div style={{ fontWeight: 500, fontSize: 12, color: F.t }}>{p.name}</div><div style={{ ...mono, fontSize: 9, color: F.t3, marginTop: 1 }}>{new Date(p.createdAt).toLocaleDateString()}</div></div>
          <div style={{ display: "flex", gap: 4 }}>
            <Btn sm onClick={() => copy(p.id, p.prompt)}>{copied === p.id ? "✓" : "Copy"}</Btn>
            <Btn sm onClick={() => onDelete(p.id)}>✕</Btn>
          </div>
        </div>
        {p.mission && <div style={{ fontSize: 11, color: F.t2, marginBottom: 6, lineHeight: 1.5 }}>{p.mission.slice(0, 100)}{p.mission.length > 100 ? "…" : ""}</div>}
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{(p.tags || []).map(t => <Tag key={t}>{t}</Tag>)}</div>
        <div style={{ marginTop: 6, background: F.sf2, borderRadius: 4, padding: "5px 7px", ...mono, fontSize: 9, color: F.t3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.prompt?.slice(0, 80)}…</div>
      </div>)}
    </div>
  </div>;
}

// ── EVALUATOR TAB ─────────────────────────────────────────────────────────────
function EvaluatorTab({ library }) {
  const [sel, setSel] = useState(""); const [scenarios, setScenarios] = useState([""]); const [rubric, setRubric] = useState(["Accuracy", "Conciseness", "Format adherence", "Tone", "Actionability"]);
  const [results, setResults] = useState([]); const [loading, setLoading] = useState(false);
  const selPkg = library.find(p => String(p.id) === sel);
  const addScn = () => setScenarios(p => [...p, ""]);
  const setScn = (i, v) => setScenarios(p => { const a = [...p]; a[i] = v; return a; });
  const rmScn = i => setScenarios(p => p.filter((_, j) => j !== i));
  const evaluate = async () => {
    if (!selPkg || !scenarios.filter(Boolean).length) return;
    setLoading(true); setResults([]);
    const evalSys = `You are a prompt evaluator. Evaluate the AI response against the rubric. Return ONLY valid JSON: {"scores":{"criterion":score},"overall":number,"feedback":"one paragraph","issues":["issue1"]}. Scores 1-5. No fences.`;
    const newResults = [];
    for (const scenario of scenarios.filter(Boolean)) {
      try {
        const response = await api([{ role: "user", content: scenario }], 800, selPkg.prompt);
        const evalMsg = `Prompt:\n${selPkg.prompt}\n\nScenario: ${scenario}\n\nResponse:\n${response}\n\nRubric: ${rubric.filter(Boolean).join(", ")}\n\nEvaluate.`;
        const evalRaw = await api([{ role: "user", content: evalMsg }], 600, evalSys);
        const evalParsed = JSON.parse(evalRaw.replace(/```json|```/g, "").trim());
        newResults.push({ scenario, response, ...evalParsed });
      } catch (e) { newResults.push({ scenario, response: "Error: " + e.message, scores: {}, overall: 0, feedback: "Evaluation failed.", issues: [] }); }
    }
    setResults(newResults);
    setLoading(false);
  };
  return <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", height: "100%", overflow: "hidden" }}>
    <div style={{ borderRight: `1px solid ${F.b}`, overflowY: "auto", padding: 14 }}>
      <Sh>Prompt Evaluator</Sh>
      <p style={{ fontSize: 11, color: F.t2, marginBottom: 12 }}>Test a saved prompt against multiple scenarios. Score it against your rubric.</p>
      <Lbl>Select Prompt</Lbl>
      <select value={sel} onChange={e => setSel(e.target.value)} style={{ width: "100%", padding: "6px 9px", borderRadius: 5, border: `1px solid ${F.b2}`, fontSize: 12, background: F.sf2, color: F.t, outline: "none", ...sans, marginBottom: 10 }}>
        <option value="">— select from library —</option>
        {library.map(p => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
      </select>
      <Lbl>Test Scenarios</Lbl>
      {scenarios.map((s, i) => <div key={i} style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", gap: 4 }}>
          <textarea value={s} onChange={e => setScn(i, e.target.value)} rows={2} style={{ flex: 1, padding: "5px 8px", borderRadius: 4, border: `1px solid ${F.b2}`, fontSize: 11, background: F.sf2, color: F.t, outline: "none", resize: "vertical", ...sans }} placeholder={`Scenario ${i + 1}…`} />
          <Btn sm onClick={() => rmScn(i)}>✕</Btn>
        </div>
      </div>)}
      <Btn sm onClick={addScn}>+ Scenario</Btn>
      <div style={{ marginTop: 12 }}>
        <Lbl>Rubric Criteria</Lbl>
        {rubric.map((r, i) => <div key={i} style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          <input value={r} onChange={e => { const a = [...rubric]; a[i] = e.target.value; setRubric(a); }} style={{ flex: 1, padding: "5px 8px", borderRadius: 4, border: `1px solid ${F.b2}`, fontSize: 11, background: F.sf2, color: F.t, outline: "none", ...sans }} />
          <Btn sm onClick={() => setRubric(p => p.filter((_, j) => j !== i))}>✕</Btn>
        </div>)}
        <Btn sm onClick={() => setRubric(p => [...p, ""])}>+ Criterion</Btn>
      </div>
      <div style={{ marginTop: 14 }}>
        <Btn onClick={evaluate} disabled={!selPkg || !scenarios.filter(Boolean).length || loading} accent>{loading ? "◌ Evaluating…" : `Evaluate ${scenarios.filter(Boolean).length} scenario(s) →`}</Btn>
      </div>
    </div>
    <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
      {!results.length && !loading && <div style={{ textAlign: "center", color: F.t3, padding: 60, ...mono, fontSize: 11 }}>Select a prompt, add scenarios, and click Evaluate.</div>}
      {loading && <div style={{ textAlign: "center", color: F.ac, padding: 60, ...mono, fontSize: 11 }}>◌ Running scenarios and evaluating…</div>}
      {results.map((r, ri) => <div key={ri} style={{ background: F.sf, border: `1px solid ${F.b}`, borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
        <div style={{ ...mono, fontSize: 9, color: F.t3, marginBottom: 5 }}>SCENARIO {ri + 1}</div>
        <div style={{ fontSize: 11, color: F.t2, marginBottom: 8, fontStyle: "italic" }}>"{r.scenario}"</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          {Object.entries(r.scores || {}).map(([k, v]) => <div key={k} style={{ background: F.sf2, borderRadius: 4, padding: "4px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: v >= 4 ? F.gn : v >= 3 ? F.yw : F.rd }}>{v}</div>
            <div style={{ ...mono, fontSize: 8, color: F.t3 }}>{k.slice(0, 12)}</div>
          </div>)}
          <div style={{ background: F.acS, border: `1px solid ${F.b3}`, borderRadius: 4, padding: "4px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: F.ac }}>{r.overall}/5</div>
            <div style={{ ...mono, fontSize: 8, color: F.t3 }}>OVERALL</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: F.t2, lineHeight: 1.6, marginBottom: 8 }}>{r.feedback}</div>
        {r.issues?.length > 0 && <div>{r.issues.map((iss, ii) => <div key={ii} style={{ display: "flex", gap: 6, fontSize: 11, color: F.rd, marginBottom: 2 }}><span>⚠</span>{iss}</div>)}</div>}
        <details style={{ marginTop: 8 }}>
          <summary style={{ ...mono, fontSize: 9, color: F.t3, cursor: "pointer" }}>Response ↓</summary>
          <div style={{ marginTop: 6, background: F.sf2, borderRadius: 4, padding: "8px 10px", fontSize: 11, color: F.t2, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{r.response}</div>
        </details>
      </div>)}
    </div>
  </div>;
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function PromptForge() {
  const [tab, setTab] = useState("studio");
  const [library, setLibrary] = useState([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { sget("ff-prompt-forge-v1").then(d => { setLibrary(d || []); setReady(true); }); }, []);
  const savePrompt = async rec => {
    const next = [rec, ...library];
    setLibrary(next);
    await sset("ff-prompt-forge-v1", next);
  };
  const deletePrompt = async id => {
    const next = library.filter(p => p.id !== id);
    setLibrary(next);
    await sset("ff-prompt-forge-v1", next);
  };
  const TABS = [["studio", "Studio"], ["agent", "Agent Spec"], ["system", "System Designer"], ["library", `Library${library.length ? ` (${library.length})` : ""}`], ["eval", "Evaluator"]];
  return <>
    <style>{GF}</style>
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: F.bg, color: F.t, ...sans, fontSize: 13, overflow: "hidden" }}>
      <header style={{ background: F.sf, borderBottom: `1px solid ${F.b}`, padding: "0 20px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0, height: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, background: "linear-gradient(135deg,#A855F7 0%,#F472B6 55%,#22D3EE 100%)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", ...mono, fontSize: 10, fontWeight: 700, color: "white" }}>FF</div>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Prompt Forge</span>
          <span style={{ background: F.acS, border: `1px solid ${F.b3}`, borderRadius: 3, ...mono, fontSize: 8, padding: "2px 6px", color: F.ac }}>FLASHFUSION</span>
        </div>
        <nav style={{ display: "flex", flex: 1 }}>
          {TABS.map(([id, l]) => <button key={id} onClick={() => setTab(id)} style={{ background: "none", border: "none", borderBottom: `2px solid ${tab === id ? F.ac : "transparent"}`, cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 500, padding: "0 12px", height: 48, color: tab === id ? F.t : F.t2, transition: ".15s" }}>{l}</button>)}
        </nav>
        <div style={{ ...mono, fontSize: 9, color: F.t3 }}>claude-sonnet-4-6 · {!ready ? "loading…" : library.length + " saved"}</div>
      </header>
      <div style={{ flex: 1, overflow: "hidden" }}>
        {ready && tab === "studio" && <StudioTab library={library} onSave={savePrompt} />}
        {ready && tab === "agent" && <AgentSpecTab library={library} onSave={savePrompt} />}
        {ready && tab === "system" && <SysDesignerTab onSave={savePrompt} />}
        {ready && tab === "library" && <LibraryTab library={library} onDelete={deletePrompt} />}
        {ready && tab === "eval" && <EvaluatorTab library={library} />}
        {!ready && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", ...mono, fontSize: 11, color: F.t3 }}>Loading…</div>}
      </div>
    </div>
  </>;
}
