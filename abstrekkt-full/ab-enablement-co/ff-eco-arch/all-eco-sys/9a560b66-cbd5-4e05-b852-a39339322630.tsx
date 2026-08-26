/**
 * Project Instruction Builder
 * INT Claude Enablement — companion to the suite (employee-facing)
 *
 * Replaces the markdown instruction template with a fillable artifact:
 *   - Form-driven generation of Project custom instructions
 *   - Live preview, copy-to-clipboard
 *   - 3 QC tests with explicit pass/fail per test
 *   - Role example loader
 *   - Common mistakes reference
 *   - Saves draft to window.storage ("instruction-draft-v1")
 */

import { useState, useEffect, useCallback } from "react";

// INT Inc. corporate palette (matches enablement suite)
const C = {
  primary: "#156082",  // INT blue
  accent:  "#E97132",  // INT orange
  navy:    "#0E2841",
  done:    "#15803d",
  muted:   "#64748b",
  border:  "#e2e8f0",
  bg:      "#f8fafc",
  surface: "#ffffff",
  active:  "#7c3aed",
  blocked: "#dc2626",
};

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const FONT_MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

// ───────────────────────────────────────────────────────────────────
// DATA: Role examples
// ───────────────────────────────────────────────────────────────────

const ROLE_EXAMPLES = [
  {
    id: "service-desk",
    label: "Service Desk Technician",
    role: "Service Desk Technician",
    org: "INT Inc.",
    useCase: "drafting clear, professional client ticket responses and creating step-by-step troubleshooting guides",
    length: "short",
    format: "mixed",
    tools: "ServiceNow, Microsoft 365, Teams, Intune",
    workDescription: "L1/L2 IT support, ticket triage, client-facing communications",
    prohibitions: [
      "Don't use overly technical jargon in client-facing drafts",
      "Don't write responses longer than 150 words unless I ask",
    ],
  },
  {
    id: "ops-manager",
    label: "Operations Manager",
    role: "Operations Manager",
    org: "INT Inc.",
    useCase: "creating process documentation, drafting reports for leadership, preparing meeting agendas and follow-ups",
    length: "long",
    format: "headers",
    tools: "Microsoft 365, Teams, SharePoint, Excel",
    workDescription: "process improvement, vendor management, team coordination",
    prohibitions: [
      "Don't assume I want a casual tone — keep it professional",
      "Don't give me lengthy caveats before answering the actual question",
    ],
  },
  {
    id: "engineer",
    label: "Software Engineer",
    role: "Software Engineer",
    org: "INT Inc.",
    useCase: "code review, debugging, writing documentation, working through architecture decisions",
    length: "match",
    format: "code",
    tools: "TypeScript, React, Node, Postgres, Vercel",
    workDescription: "building client-facing web applications",
    prohibitions: [
      "Don't add 'Note: always test in your environment' boilerplate — I know",
      "Don't suggest switching to a different language unless I ask",
    ],
  },
  {
    id: "exec",
    label: "Executive / VP",
    role: "VP of Operations",
    org: "INT Inc.",
    useCase: "summarizing long documents into briefings, drafting board updates, preparing strategic memos",
    length: "short",
    format: "headers",
    tools: "Microsoft 365, Teams, SharePoint",
    workDescription: "leadership decisions, cross-team strategy, stakeholder communication",
    prohibitions: [
      "Don't pad with framing or context I already have — get to the point",
      "Don't use buzzwords (synergy, leverage, optimize) unless quoting source material",
    ],
  },
];

const LENGTH_OPTIONS = [
  { value: "short", label: "Short and direct" },
  { value: "long",  label: "Detailed and thorough" },
  { value: "match", label: "Match the complexity of my request" },
];

const FORMAT_OPTIONS = [
  { value: "bullets", label: "Bullet points" },
  { value: "prose",   label: "Full paragraphs" },
  { value: "headers", label: "Headers + organized sections" },
  { value: "mixed",   label: "Mixed (numbered steps for procedures, bullets otherwise)" },
  { value: "code",    label: "Code blocks for code, brief prose for explanation" },
];

const QC_TESTS = [
  {
    id: "t1",
    title: "Test 1 — Does Claude know who you are?",
    prompt: "Who am I and what do I do?",
    pass: "Claude describes your role correctly",
    fail: "Claude says it doesn't know — add more detail to the role and context lines",
  },
  {
    id: "t2",
    title: "Test 2 — Does Claude follow your format preference?",
    prompt: "Give me a quick summary of what a Project is in Claude.",
    pass: "Response matches the format you asked for",
    fail: "Response is the wrong format — be more specific in the format line",
  },
  {
    id: "t3",
    title: "Test 3 — Does Claude follow your prohibitions?",
    prompt: "[Use the thing you said 'Never do' as your test prompt]",
    pass: "Claude either doesn't do it or asks for clarification",
    fail: "Claude does it anyway — rephrase as 'NEVER [specific action]' and be more explicit",
  },
];

const MISTAKES = [
  { mistake: "Too vague", looks: "'Be helpful and professional'", fix: "Add specifics: 'Keep responses under 100 words unless I ask for more'" },
  { mistake: "Too long", looks: "500-word instruction block", fix: "Claude attention fades mid-block. Aim for under 200 words." },
  { mistake: "No prohibition", looks: "Instructions with no 'Never do this'", fix: "Add at least one. It's where most friction lives." },
  { mistake: "Not testing", looks: "Writing instructions then assuming they work", fix: "Run all 3 tests. Fix what fails." },
  { mistake: "Wrong project", looks: "Using a general-purpose Project for a specialized task", fix: "Create a second Project for specialized work. Instructions can conflict." },
];

const EMPTY_FORM = {
  role: "",
  org: "",
  useCase: "",
  length: "",
  format: "",
  tools: "",
  workDescription: "",
  prohibitions: ["", "", ""],
};

// ───────────────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────────────

export default function ProjectInstructionBuilder() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [qc, setQc] = useState({});           // { t1: "pass"|"fail"|null, ... }
  const [copied, setCopied] = useState(false);
  const [savedNote, setSavedNote] = useState("");
  const [activeMistake, setActiveMistake] = useState(null);

  // Load draft
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("instruction-draft-v1");
        if (r) {
          const d = JSON.parse(r.value);
          if (d.form) setForm({ ...EMPTY_FORM, ...d.form, prohibitions: d.form.prohibitions || ["", "", ""] });
          if (d.qc)   setQc(d.qc);
        }
      } catch (e) { /* first load */ }
    })();
  }, []);

  // Persist on every form change
  const persist = useCallback(async (nextForm, nextQc) => {
    try {
      await window.storage.set("instruction-draft-v1", JSON.stringify({ form: nextForm, qc: nextQc }));
      setSavedNote("Saved");
      setTimeout(() => setSavedNote(""), 1200);
    } catch (e) { /* ignore */ }
  }, []);

  function set(field, value) {
    const next = { ...form, [field]: value };
    setForm(next);
    persist(next, qc);
  }

  function setProhibition(i, value) {
    const arr = [...form.prohibitions];
    arr[i] = value;
    set("prohibitions", arr);
  }

  function loadExample(ex) {
    const next = {
      role: ex.role,
      org: ex.org,
      useCase: ex.useCase,
      length: ex.length,
      format: ex.format,
      tools: ex.tools,
      workDescription: ex.workDescription,
      prohibitions: [...ex.prohibitions, ""].slice(0, 3),
    };
    setForm(next);
    persist(next, qc);
  }

  function clearForm() {
    setForm(EMPTY_FORM);
    setQc({});
    persist(EMPTY_FORM, {});
  }

  function setQcResult(id, val) {
    const next = { ...qc, [id]: qc[id] === val ? null : val };
    setQc(next);
    persist(form, next);
  }

  // Generated instruction text
  const generated = generateInstructions(form);

  async function copyGenerated() {
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) { /* ignore */ }
  }

  // Completion calculation
  const requiredFields = ["role", "useCase", "length", "format"];
  const filled = requiredFields.filter(f => form[f]).length;
  const completion = Math.round((filled / requiredFields.length) * 100);
  const ready = filled === requiredFields.length;
  const qcDone = QC_TESTS.every(t => qc[t.id] === "pass");

  // ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, color: C.navy }}>
      {/* HEADER */}
      <header style={{ background: C.navy, borderBottom: `3px solid ${C.accent}`, padding: "20px 32px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: C.accent, textTransform: "uppercase", marginBottom: 4 }}>
              INT Claude Enablement
            </div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
              Project Instruction Builder
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ProgressDot completion={completion} />
            <span style={{ fontSize: 13, color: "#cbd5e1", fontFamily: FONT_MONO }}>
              {savedNote || `${completion}%`}
            </span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 980, margin: "0 auto", padding: "28px 32px 80px" }}>

        {/* INTRO STRIP */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.primary}`, borderRadius: 4, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: C.muted, lineHeight: 1.55 }}>
          Fill the form. Your instructions update live in the preview. Copy and paste into <strong style={{ color: C.navy }}>Project → Settings → Project instructions</strong>. Run the 3 tests. Done in 5 minutes.
        </div>

        {/* ROLE EXAMPLES */}
        <Section title="1. Start from an example (optional)" hint="Loads a working template you can customize.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
            {ROLE_EXAMPLES.map(ex => (
              <button key={ex.id} onClick={() => loadExample(ex)}
                style={{
                  background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4,
                  padding: "10px 12px", cursor: "pointer", textAlign: "left",
                  fontFamily: FONT, fontSize: 13, color: C.navy, fontWeight: 500,
                  transition: "border-color 120ms, background 120ms",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.background = "#eff6ff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}>
                {ex.label}
              </button>
            ))}
          </div>
        </Section>

        {/* FORM */}
        <Section title="2. Fill in your context" hint="Required fields are marked with an asterisk.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Your role *" value={form.role} onChange={v => set("role", v)} placeholder="e.g. Service Desk Technician" />
            <Field label="Org / team" value={form.org} onChange={v => set("org", v)} placeholder="e.g. INT Inc." />
          </div>
          <Field label="Primary use case for Claude *" value={form.useCase} onChange={v => set("useCase", v)} placeholder="e.g. drafting client ticket responses and troubleshooting guides" textarea />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Select label="Response length *" value={form.length} options={LENGTH_OPTIONS} onChange={v => set("length", v)} />
            <Select label="Response format *" value={form.format} options={FORMAT_OPTIONS} onChange={v => set("format", v)} />
          </div>
          <Field label="Main tools you use" value={form.tools} onChange={v => set("tools", v)} placeholder="e.g. ServiceNow, Microsoft 365, Teams" />
          <Field label="Brief description of your work" value={form.workDescription} onChange={v => set("workDescription", v)} placeholder="e.g. L1/L2 IT support, ticket triage" />

          <div style={{ marginTop: 14 }}>
            <Label>Things Claude should never do (at least one is recommended)</Label>
            {form.prohibitions.map((p, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <input value={p} onChange={e => setProhibition(i, e.target.value)}
                  placeholder={i === 0 ? "e.g. Don't use jargon in client-facing drafts" : "(optional)"}
                  style={inputStyle} />
              </div>
            ))}
          </div>

          {filled < requiredFields.length && (
            <div style={{ marginTop: 8, fontSize: 12, color: C.muted }}>
              Fill {requiredFields.length - filled} more required field{requiredFields.length - filled === 1 ? "" : "s"} to unlock the preview.
            </div>
          )}
          <button onClick={clearForm}
            style={{ ...btnGhost, marginTop: 12 }}>
            Clear form
          </button>
        </Section>

        {/* GENERATED PREVIEW */}
        <Section title="3. Your instructions (live preview)" hint="Copy this and paste into your Project instructions.">
          <div style={{
            background: ready ? C.navy : "#f1f5f9",
            border: `1px solid ${ready ? C.navy : C.border}`,
            borderRadius: 6, padding: 18, position: "relative",
            opacity: ready ? 1 : 0.65,
          }}>
            <pre style={{
              margin: 0, fontFamily: FONT_MONO, fontSize: 13,
              color: ready ? "#e2e8f0" : C.muted,
              lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word",
            }}>
              {generated}
            </pre>
            {ready && (
              <button onClick={copyGenerated}
                style={{
                  position: "absolute", top: 12, right: 12,
                  background: copied ? C.done : C.accent, color: "#fff",
                  border: "none", borderRadius: 4, padding: "6px 12px",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  fontFamily: FONT, transition: "background 150ms",
                }}>
                {copied ? "✓ Copied" : "Copy"}
              </button>
            )}
          </div>
        </Section>

        {/* QC TESTS */}
        <Section title="4. Test your instructions" hint="Open a NEW conversation in your project. Run each prompt. Mark pass or fail.">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {QC_TESTS.map(t => (
              <QcRow key={t.id} test={t} state={qc[t.id]} onSet={val => setQcResult(t.id, val)} />
            ))}
          </div>
          {qcDone && (
            <div style={{
              marginTop: 14, padding: "12px 16px",
              background: "#dcfce7", border: `1px solid ${C.done}`,
              borderRadius: 4, fontSize: 13, color: "#14532d", fontWeight: 500,
            }}>
              ✓ All three tests pass. Your instructions are working. You're done.
            </div>
          )}
        </Section>

        {/* COMMON MISTAKES */}
        <Section title="5. Common mistakes" hint="Click any row to see the fix.">
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
            {MISTAKES.map((m, i) => {
              const open = activeMistake === i;
              return (
                <div key={i} style={{ borderBottom: i < MISTAKES.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <button onClick={() => setActiveMistake(open ? null : i)}
                    style={{
                      width: "100%", textAlign: "left", background: "transparent",
                      border: "none", padding: "12px 16px", cursor: "pointer",
                      fontFamily: FONT, fontSize: 13, color: C.navy, fontWeight: 500,
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                    <span><strong>{m.mistake}</strong> — <span style={{ color: C.muted, fontWeight: 400 }}>{m.looks}</span></span>
                    <span style={{ color: C.muted, fontSize: 11 }}>{open ? "−" : "+"}</span>
                  </button>
                  {open && (
                    <div style={{ padding: "0 16px 14px", fontSize: 13, color: C.navy, lineHeight: 1.55, background: "#fafbfc" }}>
                      <strong style={{ color: C.primary }}>Fix:</strong> {m.fix}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        <footer style={{ marginTop: 32, paddingTop: 16, borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.muted, fontFamily: FONT_MONO, letterSpacing: "0.04em" }}>
          INT CLAUDE ENABLEMENT · INSTRUCTION BUILDER v1.0
        </footer>
      </main>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// Subcomponents
// ───────────────────────────────────────────────────────────────────

function Section({ title, hint, children }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{
        margin: "0 0 4px 0", fontSize: 16, fontWeight: 700,
        color: C.navy, letterSpacing: "-0.005em",
      }}>{title}</h2>
      {hint && <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{hint}</div>}
      {children}
    </section>
  );
}

function Label({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
      textTransform: "uppercase", color: C.muted, marginBottom: 6,
    }}>{children}</div>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box",
  background: "#fff", border: `1px solid ${C.border}`,
  borderRadius: 4, padding: "9px 12px",
  fontSize: 14, fontFamily: FONT, color: C.navy,
  transition: "border-color 120ms, box-shadow 120ms",
  outline: "none",
};

function Field({ label, value, onChange, placeholder, textarea }) {
  const [focus, setFocus] = useState(false);
  const style = {
    ...inputStyle,
    minHeight: textarea ? 70 : undefined,
    resize: textarea ? "vertical" : undefined,
    fontFamily: FONT,
    borderColor: focus ? C.primary : C.border,
    boxShadow: focus ? `0 0 0 3px ${C.primary}22` : "none",
  };
  return (
    <div style={{ marginBottom: 14 }}>
      <Label>{label}</Label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={style} rows={2} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={style} />
      )}
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <Label>{label}</Label>
      <select value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          ...inputStyle,
          appearance: "none", WebkitAppearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath fill='%23${C.muted.slice(1)}' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
          paddingRight: 32, cursor: "pointer",
          borderColor: focus ? C.primary : C.border,
          boxShadow: focus ? `0 0 0 3px ${C.primary}22` : "none",
        }}>
        <option value="">— Select —</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ProgressDot({ completion }) {
  const ready = completion === 100;
  return (
    <div style={{
      width: 10, height: 10, borderRadius: 999,
      background: ready ? C.accent : "#475569",
      boxShadow: ready ? `0 0 0 3px ${C.accent}33` : "none",
      transition: "all 200ms",
    }} />
  );
}

const btnGhost = {
  background: "transparent", border: `1px solid ${C.border}`,
  borderRadius: 4, padding: "7px 14px", fontSize: 12,
  fontFamily: FONT, color: C.muted, cursor: "pointer", fontWeight: 500,
  transition: "all 120ms",
};

function QcRow({ test, state, onSet }) {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(test.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) { /* ignore */ }
  }

  const passed = state === "pass";
  const failed = state === "fail";

  return (
    <div style={{
      background: C.surface, border: `1px solid ${passed ? C.done : failed ? C.blocked : C.border}`,
      borderRadius: 6, padding: "14px 16px", transition: "border-color 150ms",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{test.title}</div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button onClick={() => onSet("pass")}
            style={{
              background: passed ? C.done : "transparent", color: passed ? "#fff" : C.muted,
              border: `1px solid ${passed ? C.done : C.border}`, borderRadius: 4,
              padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer",
              fontFamily: FONT, letterSpacing: "0.04em",
            }}>PASS</button>
          <button onClick={() => onSet("fail")}
            style={{
              background: failed ? C.blocked : "transparent", color: failed ? "#fff" : C.muted,
              border: `1px solid ${failed ? C.blocked : C.border}`, borderRadius: 4,
              padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer",
              fontFamily: FONT, letterSpacing: "0.04em",
            }}>FAIL</button>
        </div>
      </div>
      <div style={{
        background: "#f1f5f9", borderLeft: `3px solid ${C.primary}`,
        padding: "8px 12px", borderRadius: 3,
        fontFamily: FONT_MONO, fontSize: 12, color: C.navy, marginBottom: 8,
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
      }}>
        <span style={{ flex: 1 }}>{test.prompt}</span>
        <button onClick={copyPrompt}
          style={{
            background: copied ? C.done : "transparent", color: copied ? "#fff" : C.primary,
            border: `1px solid ${copied ? C.done : C.primary}`, borderRadius: 3,
            padding: "3px 8px", fontSize: 10, fontWeight: 600, cursor: "pointer",
            fontFamily: FONT, flexShrink: 0,
          }}>{copied ? "✓" : "Copy"}</button>
      </div>
      <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.55 }}>
        <strong style={{ color: C.done }}>Pass:</strong> {test.pass}<br />
        <strong style={{ color: C.blocked }}>Fail:</strong> {test.fail}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// Generator
// ───────────────────────────────────────────────────────────────────

function generateInstructions(f) {
  if (!f.role || !f.useCase || !f.length || !f.format) {
    return "// Fill in role, use case, length, and format to see your generated instructions here.";
  }

  const lengthMap = {
    short: "Keep responses short and direct.",
    long:  "Give thorough answers by default.",
    match: "Match the complexity of my request.",
  };

  const formatMap = {
    bullets: "Use bullet points.",
    prose:   "Use full paragraphs.",
    headers: "Use headers and organized sections for documents; bullets for quick answers.",
    mixed:   "Use numbered steps for procedures, bullet points for everything else.",
    code:    "Use code blocks for code, brief prose for explanations. Skip beginner explanations — assume I know my stack.",
  };

  const lines = [];
  lines.push(`I am ${f.role}${f.org ? ` at ${f.org}` : ""}.`);
  lines.push("");
  lines.push(`My primary use for Claude is: ${f.useCase}.`);
  lines.push("");
  lines.push("When responding to me:");
  lines.push(`- ${lengthMap[f.length]}`);
  lines.push(`- ${formatMap[f.format]}`);

  if (f.tools || f.workDescription) {
    lines.push("");
    lines.push("Context about my work:");
    if (f.tools)           lines.push(`- I primarily use: ${f.tools}`);
    if (f.workDescription) lines.push(`- My work involves: ${f.workDescription}`);
  }

  const prohibitions = f.prohibitions.filter(p => p && p.trim());
  if (prohibitions.length > 0) {
    lines.push("");
    lines.push("Never do this:");
    prohibitions.forEach(p => lines.push(`- ${p}`));
  }

  return lines.join("\n");
}
