/**
 * Project Instruction Builder v2.0
 * INT Claude Enablement — employee-facing
 *
 * Upgrades over v1:
 *   - Multi-draft management (named, switchable, deletable)
 *   - Live quality scanner (severity-graded linter)
 *   - Inline AI test runner (calls Anthropic API with draft as system prompt)
 *   - Word count + 200-word length warning
 *   - JSON export/import
 *   - Migrates legacy "instruction-draft-v1" key into new draft list
 *
 * Storage:
 *   "instruction-drafts-v2" → array of draft records
 *   "instruction-draft-v1"  → read-only legacy, migrated on first load
 */

import { useState, useEffect, useCallback, useRef } from "react";

const C = {
  primary: "#156082", accent: "#E97132", navy: "#0E2841", done: "#15803d",
  muted: "#64748b", border: "#e2e8f0", bg: "#f8fafc", surface: "#ffffff",
  active: "#7c3aed", blocked: "#dc2626", warning: "#d97706",
};

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const FONT_MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

const MAX_DRAFTS = 20;

const ROLE_EXAMPLES = [
  { id: "service-desk", label: "Service Desk Technician", role: "Service Desk Technician", org: "INT Inc.",
    useCase: "drafting clear, professional client ticket responses and creating step-by-step troubleshooting guides",
    length: "short", format: "mixed", tools: "ServiceNow, Microsoft 365, Teams, Intune",
    workDescription: "L1/L2 IT support, ticket triage, client-facing communications",
    prohibitions: ["Don't use overly technical jargon in client-facing drafts", "Don't write responses longer than 150 words unless I ask", ""] },
  { id: "ops-manager", label: "Operations Manager", role: "Operations Manager", org: "INT Inc.",
    useCase: "creating process documentation, drafting reports for leadership, preparing meeting agendas and follow-ups",
    length: "long", format: "headers", tools: "Microsoft 365, Teams, SharePoint, Excel",
    workDescription: "process improvement, vendor management, team coordination",
    prohibitions: ["Don't assume I want a casual tone — keep it professional", "Don't give me lengthy caveats before answering the actual question", ""] },
  { id: "engineer", label: "Software Engineer", role: "Software Engineer", org: "INT Inc.",
    useCase: "code review, debugging, writing documentation, working through architecture decisions",
    length: "match", format: "code", tools: "TypeScript, React, Node, Postgres, Vercel",
    workDescription: "building client-facing web applications",
    prohibitions: ["Don't add 'Note: always test in your environment' boilerplate — I know", "Don't suggest switching to a different language unless I ask", ""] },
  { id: "exec", label: "Executive / VP", role: "VP of Operations", org: "INT Inc.",
    useCase: "summarizing long documents into briefings, drafting board updates, preparing strategic memos",
    length: "short", format: "headers", tools: "Microsoft 365, Teams, SharePoint",
    workDescription: "leadership decisions, cross-team strategy, stakeholder communication",
    prohibitions: ["Don't pad with framing or context I already have — get to the point", "Don't use buzzwords (synergy, leverage, optimize) unless quoting source material", ""] },
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
  { id: "t1", title: "Test 1 — Does Claude know who you are?",
    prompt: "Who am I and what do I do?",
    pass: "Claude describes your role correctly",
    fail: "Claude says it doesn't know — add more detail to the role and context lines" },
  { id: "t2", title: "Test 2 — Does Claude follow your format preference?",
    prompt: "Give me a quick summary of what a Project is in Claude.",
    pass: "Response matches the format you asked for",
    fail: "Response is the wrong format — be more specific in the format line" },
  { id: "t3", title: "Test 3 — Does Claude follow your prohibitions?",
    prompt: "[Use the thing you said 'Never do' as your test prompt]",
    pass: "Claude either doesn't do it or asks for clarification",
    fail: "Claude does it anyway — rephrase as 'NEVER [specific action]' and be more explicit" },
];

const EMPTY_FORM = {
  role: "", org: "", useCase: "", length: "", format: "",
  tools: "", workDescription: "", prohibitions: ["", "", ""],
};

const newDraft = (name = "Untitled draft") => ({
  id: `draft_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  name, form: EMPTY_FORM, qc: {}, aiTests: {},
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
});

export default function ProjectInstructionBuilder() {
  const [drafts, setDrafts] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [view, setView] = useState("editor");
  const [savedNote, setSavedNote] = useState("");
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("instruction-drafts-v2");
        if (r) {
          const list = JSON.parse(r.value);
          if (Array.isArray(list) && list.length > 0) {
            setDrafts(list); setActiveId(list[0].id); return;
          }
        }
      } catch (e) { /* fall through */ }
      try {
        const legacy = await window.storage.get("instruction-draft-v1");
        if (legacy) {
          const old = JSON.parse(legacy.value);
          if (old.form) {
            const migrated = newDraft("Migrated draft");
            migrated.form = { ...EMPTY_FORM, ...old.form, prohibitions: old.form.prohibitions || ["", "", ""] };
            migrated.qc = old.qc || {};
            await window.storage.set("instruction-drafts-v2", JSON.stringify([migrated]));
            setDrafts([migrated]); setActiveId(migrated.id); return;
          }
        }
      } catch (e) { /* fall through */ }
      const blank = newDraft("My first draft");
      setDrafts([blank]); setActiveId(blank.id);
    })();
  }, []);

  const persist = useCallback(async (next) => {
    try {
      await window.storage.set("instruction-drafts-v2", JSON.stringify(next));
      setSavedNote("Saved"); setTimeout(() => setSavedNote(""), 1200);
    } catch (e) { /* ignore */ }
  }, []);

  const active = drafts.find(d => d.id === activeId);

  function updateActive(patch) {
    if (!active) return;
    const next = drafts.map(d => d.id === activeId
      ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d);
    setDrafts(next); persist(next);
  }
  function setForm(form)  { updateActive({ form }); }
  function setQc(qc)      { updateActive({ qc }); }
  function setAiTests(ai) { updateActive({ aiTests: ai }); }
  function rename(name)   { updateActive({ name }); }

  function createDraft() {
    if (drafts.length >= MAX_DRAFTS) { alert(`Max ${MAX_DRAFTS} drafts. Delete one first.`); return; }
    const d = newDraft(`Draft ${drafts.length + 1}`);
    const next = [d, ...drafts];
    setDrafts(next); setActiveId(d.id); setView("editor"); persist(next);
  }
  function deleteDraft(id) {
    if (!confirm("Delete this draft? This cannot be undone.")) return;
    const next = drafts.filter(d => d.id !== id);
    if (next.length === 0) {
      const blank = newDraft("My first draft");
      setDrafts([blank]); setActiveId(blank.id); persist([blank]); return;
    }
    setDrafts(next);
    if (id === activeId) setActiveId(next[0].id);
    persist(next);
  }
  function duplicateDraft(id) {
    if (drafts.length >= MAX_DRAFTS) { alert(`Max ${MAX_DRAFTS} drafts. Delete one first.`); return; }
    const orig = drafts.find(d => d.id === id);
    if (!orig) return;
    const copy = { ...orig, id: newDraft().id, name: `${orig.name} (copy)`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const next = [copy, ...drafts];
    setDrafts(next); persist(next);
  }

  function exportAll() {
    const blob = new Blob([JSON.stringify(drafts, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `instruction-drafts-${new Date().toISOString().slice(0,10)}.json`;
    a.click(); URL.revokeObjectURL(url);
  }
  function exportOne(d) {
    const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${d.name.replace(/[^a-z0-9]+/gi,"-").toLowerCase()}.json`;
    a.click(); URL.revokeObjectURL(url);
  }
  function importFile(e) {
    const file = e.target.files?.[0]; if (!file) return;
    setImportError("");
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target.result);
        const incoming = Array.isArray(parsed) ? parsed : [parsed];
        const validated = incoming.filter(d => d && d.form && typeof d.form.role === "string");
        if (validated.length === 0) throw new Error("No valid drafts found in file");
        const reIded = validated.map(d => ({ ...d, id: newDraft().id,
          name: `${d.name || "Imported"} (imported)`, updatedAt: new Date().toISOString() }));
        const next = [...reIded, ...drafts].slice(0, MAX_DRAFTS);
        setDrafts(next); setActiveId(reIded[0].id); setView("editor"); persist(next);
      } catch (err) { setImportError(`Import failed: ${err.message}`); }
    };
    reader.readAsText(file); e.target.value = "";
  }

  if (!active) return <div style={{ padding: 40, fontFamily: FONT, color: C.muted }}>Loading…</div>;

  if (view === "drafts") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, color: C.navy }}>
        <ListHeader rightSlot={
          <div style={{ display: "flex", gap: 8 }}>
            <BtnSecondary dark onClick={() => setView("editor")}>← Editor</BtnSecondary>
            <BtnPrimary onClick={createDraft}>+ New draft</BtnPrimary>
          </div>
        } />
        <main style={{ maxWidth: 980, margin: "0 auto", padding: "28px 32px 80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
            <div style={{ fontSize: 12, color: C.muted, fontFamily: FONT_MONO }}>
              {drafts.length} / {MAX_DRAFTS} drafts
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input ref={fileInputRef} type="file" accept=".json" onChange={importFile} style={{ display: "none" }} />
              <BtnSecondary onClick={() => fileInputRef.current?.click()}>↑ Import JSON</BtnSecondary>
              <BtnSecondary onClick={exportAll}>↓ Export all</BtnSecondary>
            </div>
          </div>
          {importError && (
            <div style={{ background: "#fee2e2", border: `1px solid ${C.blocked}`, borderRadius: 4,
              padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#7f1d1d" }}>{importError}</div>
          )}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
            {drafts.map((d, i) => {
              const wc = wordCount(generateInstructions(d.form));
              const issues = scanQuality(d.form, wc);
              const errorCount = issues.filter(x => x.sev === "error").length;
              return (
                <div key={d.id} style={{
                  padding: "14px 18px", borderBottom: i < drafts.length - 1 ? `1px solid ${C.border}` : "none",
                  display: "flex", alignItems: "center", gap: 12,
                  background: d.id === activeId ? "#eff6ff" : "transparent",
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 2 }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT_MONO, display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <span>{d.form.role || "(no role)"}</span>
                      <span>{wc} words</span>
                      <span>updated {timeAgo(d.updatedAt)}</span>
                      {errorCount > 0 && <span style={{ color: C.blocked, fontWeight: 600 }}>{errorCount} issue{errorCount === 1 ? "" : "s"}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <BtnGhost onClick={() => { setActiveId(d.id); setView("editor"); }}>Open</BtnGhost>
                    <BtnGhost onClick={() => duplicateDraft(d.id)}>Duplicate</BtnGhost>
                    <BtnGhost onClick={() => exportOne(d)}>Export</BtnGhost>
                    <BtnGhost onClick={() => deleteDraft(d.id)} danger>Delete</BtnGhost>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  return (
    <Editor draft={active} drafts={drafts} savedNote={savedNote}
      onSwitch={setActiveId} onView={setView} onCreate={createDraft}
      onRename={rename} setForm={setForm} setQc={setQc} setAiTests={setAiTests} />
  );
}

function Editor({ draft, drafts, savedNote, onSwitch, onView, onCreate, onRename, setForm, setQc, setAiTests }) {
  const [activeMistake, setActiveMistake] = useState(null);
  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(draft.name);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setNameDraft(draft.name); setRenaming(false); }, [draft.id]);

  const { form, qc, aiTests = {} } = draft;

  function set(field, value) { setForm({ ...form, [field]: value }); }
  function setProhibition(i, value) { const arr = [...form.prohibitions]; arr[i] = value; set("prohibitions", arr); }
  function loadExample(ex) {
    setForm({ role: ex.role, org: ex.org, useCase: ex.useCase, length: ex.length, format: ex.format,
      tools: ex.tools, workDescription: ex.workDescription, prohibitions: [...ex.prohibitions, ""].slice(0, 3) });
  }
  function clearForm() {
    if (!confirm("Clear this draft? Other drafts are not affected.")) return;
    setForm(EMPTY_FORM); setQc({}); setAiTests({});
  }
  function setQcResult(id, val) { setQc({ ...qc, [id]: qc[id] === val ? null : val }); }

  const generated = generateInstructions(form);
  const wc = wordCount(generated);
  const issues = scanQuality(form, wc);

  async function copyGenerated() {
    try { await navigator.clipboard.writeText(generated); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch (e) { /* ignore */ }
  }

  const requiredFields = ["role", "useCase", "length", "format"];
  const filled = requiredFields.filter(f => form[f]).length;
  const completion = Math.round((filled / requiredFields.length) * 100);
  const ready = filled === requiredFields.length;
  const qcDone = QC_TESTS.every(t => qc[t.id] === "pass");

  function commitRename() {
    const trimmed = nameDraft.trim() || "Untitled draft";
    onRename(trimmed); setRenaming(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, color: C.navy }}>
      <header style={{ background: C.navy, borderBottom: `3px solid ${C.accent}`, padding: "16px 32px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: C.accent, textTransform: "uppercase", marginBottom: 4 }}>
              INT Claude Enablement · Instruction Builder
            </div>
            {renaming ? (
              <input value={nameDraft} onChange={e => setNameDraft(e.target.value)} onBlur={commitRename}
                onKeyDown={e => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") { setNameDraft(draft.name); setRenaming(false); } }}
                autoFocus
                style={{ background: "transparent", border: "1px solid #475569", borderRadius: 4, color: "#fff",
                  fontFamily: FONT, fontSize: 22, fontWeight: 700, padding: "2px 8px", outline: "none", width: 320 }} />
            ) : (
              <h1 onClick={() => setRenaming(true)} title="Click to rename"
                style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff",
                  letterSpacing: "-0.01em", cursor: "pointer", padding: "2px 8px", marginLeft: -8, borderRadius: 4 }}>
                {draft.name}
              </h1>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {drafts.length > 1 && (
              <select value={draft.id} onChange={e => onSwitch(e.target.value)}
                style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 4, color: "#fff",
                  fontFamily: FONT, fontSize: 12, padding: "7px 10px", outline: "none", maxWidth: 200 }}>
                {drafts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            )}
            <BtnSecondary dark onClick={onCreate}>+ New</BtnSecondary>
            <BtnSecondary dark onClick={() => onView("drafts")}>All ({drafts.length})</BtnSecondary>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 4 }}>
              <ProgressDot completion={completion} />
              <span style={{ fontSize: 12, color: "#cbd5e1", fontFamily: FONT_MONO, minWidth: 50, textAlign: "right" }}>
                {savedNote || `${completion}%`}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 980, margin: "0 auto", padding: "28px 32px 80px" }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.primary}`,
          borderRadius: 4, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: C.muted, lineHeight: 1.55 }}>
          Fill the form. Quality scanner runs live in section 4. Copy your instructions, paste into <strong style={{ color: C.navy }}>Project → Settings → Project instructions</strong>, then run the AI tests in section 5.
        </div>

        <Section title="1. Start from an example (optional)" hint="Loads a working template you can customize.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
            {ROLE_EXAMPLES.map(ex => (
              <button key={ex.id} onClick={() => loadExample(ex)}
                style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4,
                  padding: "10px 12px", cursor: "pointer", textAlign: "left", fontFamily: FONT,
                  fontSize: 13, color: C.navy, fontWeight: 500, transition: "all 120ms" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.background = "#eff6ff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}>
                {ex.label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="2. Fill in your context" hint="Required fields are marked with an asterisk.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Your role *" value={form.role} onChange={v => set("role", v)} placeholder="e.g. Service Desk Technician" />
            <Field label="Org / team" value={form.org} onChange={v => set("org", v)} placeholder="e.g. INT Inc." />
          </div>
          <Field label="Primary use case for Claude *" value={form.useCase} onChange={v => set("useCase", v)}
            placeholder="e.g. drafting client ticket responses and troubleshooting guides" textarea />
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
          <button onClick={clearForm} style={{ ...btnGhost, marginTop: 12 }}>Clear this draft</button>
        </Section>

        <Section title="3. Your instructions (live preview)" hint="Copy this and paste into your Project instructions.">
          <div style={{ background: ready ? C.navy : "#f1f5f9", border: `1px solid ${ready ? C.navy : C.border}`,
            borderRadius: 6, padding: 18, position: "relative", opacity: ready ? 1 : 0.65 }}>
            <pre style={{ margin: 0, fontFamily: FONT_MONO, fontSize: 13,
              color: ready ? "#e2e8f0" : C.muted, lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {generated}
            </pre>
            {ready && (
              <button onClick={copyGenerated}
                style={{ position: "absolute", top: 12, right: 12,
                  background: copied ? C.done : C.accent, color: "#fff", border: "none", borderRadius: 4,
                  padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
                {copied ? "✓ Copied" : "Copy"}
              </button>
            )}
          </div>
          {ready && (
            <div style={{ marginTop: 10, display: "flex", gap: 16, fontSize: 12, color: C.muted, fontFamily: FONT_MONO, flexWrap: "wrap" }}>
              <span>{wc} words</span>
              {wc > 200 && wc <= 350 && <span style={{ color: C.warning, fontWeight: 600 }}>⚠ over 200 words — Claude attention can fade</span>}
              {wc > 350 && <span style={{ color: C.blocked, fontWeight: 600 }}>⚠ over 350 words — significant degradation likely</span>}
            </div>
          )}
        </Section>

        <Section title="4. Quality scanner" hint="Live linter. Fix errors before testing.">
          <QualityScanner issues={issues} />
        </Section>

        <Section title="5. Test your instructions" hint="Click 'Run AI test' to actually run the prompt against your draft as system prompt — no copy-paste needed.">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {QC_TESTS.map(t => (
              <QcRow key={t.id} test={t} state={qc[t.id]} ai={aiTests[t.id]}
                onSet={val => setQcResult(t.id, val)}
                onAi={result => setAiTests({ ...aiTests, [t.id]: result })}
                systemPrompt={ready ? generated : null} ready={ready} form={form} />
            ))}
          </div>
          {qcDone && (
            <div style={{ marginTop: 14, padding: "12px 16px", background: "#dcfce7",
              border: `1px solid ${C.done}`, borderRadius: 4, fontSize: 13, color: "#14532d", fontWeight: 500 }}>
              ✓ All three tests pass. Your instructions are working. You're done.
            </div>
          )}
        </Section>

        <Section title="6. Common mistakes" hint="Click any row to see the fix.">
          <Mistakes activeMistake={activeMistake} setActiveMistake={setActiveMistake} />
        </Section>

        <footer style={{ marginTop: 32, paddingTop: 16, borderTop: `1px solid ${C.border}`,
          fontSize: 11, color: C.muted, fontFamily: FONT_MONO, letterSpacing: "0.04em" }}>
          INT CLAUDE ENABLEMENT · INSTRUCTION BUILDER v2.0
        </footer>
      </main>
    </div>
  );
}

function scanQuality(form, wc) {
  const issues = [];
  const vagueRoles = /^(employee|worker|user|professional|manager)$/i;
  if (form.role && vagueRoles.test(form.role.trim())) {
    issues.push({ sev: "warn", id: "role-vague",
      msg: `Role "${form.role}" is generic — be specific (e.g. "Service Desk Technician at INT")` });
  }
  if (form.useCase && form.useCase.trim().length < 25) {
    issues.push({ sev: "warn", id: "usecase-short",
      msg: "Use case is short — add specifics about what you actually do with Claude" });
  }
  const vagueUsecase = /(stuff|things|various|general|help me)/i;
  if (form.useCase && vagueUsecase.test(form.useCase)) {
    issues.push({ sev: "warn", id: "usecase-vague",
      msg: "Use case contains vague words ('stuff', 'things', 'help me') — name actual tasks" });
  }
  const realProhibitions = form.prohibitions.filter(p => p && p.trim());
  if (realProhibitions.length === 0) {
    issues.push({ sev: "warn", id: "no-prohibition",
      msg: "No prohibitions set — most friction comes from missing 'Never do this' rules" });
  }
  realProhibitions.forEach((p, i) => {
    const tooShort = p.trim().length < 10;
    const startsWithDont = /^(don'?t|never|avoid)/i.test(p.trim());
    if (tooShort) issues.push({ sev: "warn", id: `proh-short-${i}`, msg: `Prohibition "${p}" is too short to be actionable` });
    if (!startsWithDont && !tooShort) {
      issues.push({ sev: "info", id: `proh-style-${i}`,
        msg: `Prohibition "${p.slice(0, 30)}…" — start with "Don't" or "Never" for clarity` });
    }
  });
  if (wc > 200 && wc <= 350) {
    issues.push({ sev: "warn", id: "length-200",
      msg: `${wc} words — over 200, Claude's attention to mid-instruction details starts fading` });
  }
  if (wc > 350) {
    issues.push({ sev: "error", id: "length-350",
      msg: `${wc} words — significantly degrades instruction following. Tighten to under 250.` });
  }
  if (!form.role)    issues.push({ sev: "error", id: "no-role",    msg: "Role is required" });
  if (!form.useCase) issues.push({ sev: "error", id: "no-usecase", msg: "Use case is required" });
  if (!form.length)  issues.push({ sev: "error", id: "no-length",  msg: "Response length preference is required" });
  if (!form.format)  issues.push({ sev: "error", id: "no-format",  msg: "Response format preference is required" });
  return issues;
}

function QualityScanner({ issues }) {
  if (issues.length === 0) {
    return (
      <div style={{ background: "#dcfce7", border: `1px solid ${C.done}`, borderRadius: 6,
        padding: "14px 18px", fontSize: 13, color: "#14532d", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>✓</span>
        <span><strong>No issues.</strong> Your draft passes the quality scan.</span>
      </div>
    );
  }
  const errors = issues.filter(i => i.sev === "error");
  const warns  = issues.filter(i => i.sev === "warn");
  const infos  = issues.filter(i => i.sev === "info");
  const all = [...errors, ...warns, ...infos];
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
      {all.map((i, idx) => (
        <div key={i.id} style={{
          padding: "10px 14px", borderBottom: idx < all.length - 1 ? `1px solid ${C.border}` : "none",
          display: "flex", gap: 12, alignItems: "flex-start", fontSize: 13, lineHeight: 1.5,
        }}>
          <SevBadge sev={i.sev} />
          <span style={{ color: C.navy, flex: 1 }}>{i.msg}</span>
        </div>
      ))}
    </div>
  );
}

function SevBadge({ sev }) {
  const cfg = sev === "error"
    ? { bg: "#fee2e2", fg: C.blocked, label: "ERROR" }
    : sev === "warn"
      ? { bg: "#fef3c7", fg: C.warning, label: "WARN" }
      : { bg: "#dbeafe", fg: C.primary, label: "INFO" };
  return (
    <span style={{ background: cfg.bg, color: cfg.fg, fontSize: 10, fontWeight: 700,
      letterSpacing: "0.06em", padding: "2px 6px", borderRadius: 3, fontFamily: FONT_MONO,
      flexShrink: 0, marginTop: 2 }}>{cfg.label}</span>
  );
}

function QcRow({ test, state, ai, onSet, onAi, systemPrompt, ready, form }) {
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);

  const promptToUse = test.id === "t3" && form.prohibitions[0]
    ? `Please ${form.prohibitions[0].replace(/^(don'?t|never|avoid)\s+/i, "")}`
    : test.prompt;

  async function copyPrompt() {
    try { await navigator.clipboard.writeText(promptToUse); setCopied(true); setTimeout(() => setCopied(false), 1500); }
    catch (e) { /* ignore */ }
  }

  async function runAi() {
    if (!systemPrompt) return;
    setRunning(true); setError(null);
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 600,
          system: systemPrompt,
          messages: [{ role: "user", content: promptToUse }],
        }),
      });
      if (!resp.ok) {
        const e = await resp.json().catch(() => ({}));
        throw new Error(e.error?.message || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
      onAi({ text, ranAt: new Date().toISOString() });
    } catch (e) {
      setError(e.message || "Test failed");
    } finally {
      setRunning(false);
    }
  }

  const passed = state === "pass";
  const failed = state === "fail";

  return (
    <div style={{ background: C.surface, border: `1px solid ${passed ? C.done : failed ? C.blocked : C.border}`,
      borderRadius: 6, padding: "14px 16px", transition: "border-color 150ms" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{test.title}</div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button onClick={() => onSet("pass")}
            style={{ background: passed ? C.done : "transparent", color: passed ? "#fff" : C.muted,
              border: `1px solid ${passed ? C.done : C.border}`, borderRadius: 4,
              padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer",
              fontFamily: FONT, letterSpacing: "0.04em" }}>PASS</button>
          <button onClick={() => onSet("fail")}
            style={{ background: failed ? C.blocked : "transparent", color: failed ? "#fff" : C.muted,
              border: `1px solid ${failed ? C.blocked : C.border}`, borderRadius: 4,
              padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer",
              fontFamily: FONT, letterSpacing: "0.04em" }}>FAIL</button>
        </div>
      </div>
      <div style={{ background: "#f1f5f9", borderLeft: `3px solid ${C.primary}`,
        padding: "8px 12px", borderRadius: 3, fontFamily: FONT_MONO, fontSize: 12, color: C.navy,
        marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <span style={{ flex: 1 }}>{promptToUse}</span>
        <button onClick={copyPrompt}
          style={{ background: copied ? C.done : "transparent", color: copied ? "#fff" : C.primary,
            border: `1px solid ${copied ? C.done : C.primary}`, borderRadius: 3,
            padding: "3px 8px", fontSize: 10, fontWeight: 600, cursor: "pointer",
            fontFamily: FONT, flexShrink: 0 }}>{copied ? "✓" : "Copy"}</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: ai || error ? 10 : 0, flexWrap: "wrap" }}>
        <button onClick={runAi} disabled={!ready || running}
          style={{ background: ready ? C.primary : C.border, color: ready ? "#fff" : C.muted,
            border: "none", borderRadius: 4, padding: "7px 14px", fontSize: 12, fontWeight: 600,
            cursor: ready && !running ? "pointer" : "not-allowed", fontFamily: FONT,
            opacity: running ? 0.7 : 1 }}>
          {running ? "⟳ Running…" : ai ? "↻ Re-run AI test" : "▶ Run AI test"}
        </button>
        {!ready && <span style={{ fontSize: 11, color: C.muted, alignSelf: "center" }}>Fill required fields first</span>}
      </div>
      {error && (
        <div style={{ background: "#fee2e2", border: `1px solid ${C.blocked}`, borderRadius: 4,
          padding: "8px 12px", marginBottom: 10, fontSize: 12, color: "#7f1d1d" }}>{error}</div>
      )}
      {ai && (
        <div style={{ background: "#fafbfc", border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.accent}`,
          borderRadius: 3, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: C.navy,
          lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: C.muted,
            textTransform: "uppercase", marginBottom: 6 }}>Claude's response</div>
          {ai.text}
        </div>
      )}
      <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.55 }}>
        <strong style={{ color: C.done }}>Pass:</strong> {test.pass}<br />
        <strong style={{ color: C.blocked }}>Fail:</strong> {test.fail}
      </div>
    </div>
  );
}

const MISTAKES = [
  { mistake: "Too vague", looks: "'Be helpful and professional'", fix: "Add specifics: 'Keep responses under 100 words unless I ask for more'" },
  { mistake: "Too long", looks: "500-word instruction block", fix: "Claude attention fades mid-block. Aim for under 200 words." },
  { mistake: "No prohibition", looks: "Instructions with no 'Never do this'", fix: "Add at least one. It's where most friction lives." },
  { mistake: "Not testing", looks: "Writing instructions then assuming they work", fix: "Run all 3 AI tests in section 5. Fix what fails." },
  { mistake: "Wrong project", looks: "Using a general-purpose Project for a specialized task", fix: "Create a separate Project for specialized work. Instructions can conflict." },
];

function Mistakes({ activeMistake, setActiveMistake }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
      {MISTAKES.map((m, i) => {
        const open = activeMistake === i;
        return (
          <div key={i} style={{ borderBottom: i < MISTAKES.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <button onClick={() => setActiveMistake(open ? null : i)}
              style={{ width: "100%", textAlign: "left", background: "transparent", border: "none",
                padding: "12px 16px", cursor: "pointer", fontFamily: FONT, fontSize: 13, color: C.navy,
                fontWeight: 500, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
  );
}

function ListHeader({ rightSlot }) {
  return (
    <header style={{ background: C.navy, borderBottom: `3px solid ${C.accent}`, padding: "20px 32px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: C.accent, textTransform: "uppercase", marginBottom: 4 }}>
            INT Claude Enablement · Instruction Builder
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>All drafts</h1>
        </div>
        {rightSlot}
      </div>
    </header>
  );
}

function Section({ title, hint, children }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ margin: "0 0 4px 0", fontSize: 16, fontWeight: 700, color: C.navy, letterSpacing: "-0.005em" }}>{title}</h2>
      {hint && <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{hint}</div>}
      {children}
    </section>
  );
}

function Label({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
      textTransform: "uppercase", color: C.muted, marginBottom: 6 }}>{children}</div>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box", background: "#fff", border: `1px solid ${C.border}`,
  borderRadius: 4, padding: "9px 12px", fontSize: 14, fontFamily: FONT, color: C.navy,
  transition: "border-color 120ms, box-shadow 120ms", outline: "none",
};

function Field({ label, value, onChange, placeholder, textarea }) {
  const [focus, setFocus] = useState(false);
  const style = { ...inputStyle, minHeight: textarea ? 70 : undefined,
    resize: textarea ? "vertical" : undefined, fontFamily: FONT,
    borderColor: focus ? C.primary : C.border,
    boxShadow: focus ? `0 0 0 3px ${C.primary}22` : "none" };
  return (
    <div style={{ marginBottom: 14 }}>
      <Label>{label}</Label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={style} rows={2} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={style} />
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
        style={{ ...inputStyle, appearance: "none", WebkitAppearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath fill='%23${C.muted.slice(1)}' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
          paddingRight: 32, cursor: "pointer",
          borderColor: focus ? C.primary : C.border,
          boxShadow: focus ? `0 0 0 3px ${C.primary}22` : "none" }}>
        <option value="">— Select —</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ProgressDot({ completion }) {
  const ready = completion === 100;
  return (
    <div style={{ width: 10, height: 10, borderRadius: 999,
      background: ready ? C.accent : "#475569",
      boxShadow: ready ? `0 0 0 3px ${C.accent}33` : "none", transition: "all 200ms" }} />
  );
}

const btnGhost = {
  background: "transparent", border: `1px solid ${C.border}`, borderRadius: 4,
  padding: "7px 14px", fontSize: 12, fontFamily: FONT, color: C.muted, cursor: "pointer",
  fontWeight: 500, transition: "all 120ms",
};

function BtnPrimary({ children, onClick }) {
  return (
    <button onClick={onClick}
      style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 4,
        padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
      {children}
    </button>
  );
}
function BtnSecondary({ children, onClick, dark }) {
  return (
    <button onClick={onClick}
      style={{ background: "transparent", border: `1px solid ${dark ? "#334155" : C.border}`,
        borderRadius: 4, padding: "7px 14px", fontSize: 12, fontWeight: 500,
        color: dark ? "#cbd5e1" : C.navy, cursor: "pointer", fontFamily: FONT }}>
      {children}
    </button>
  );
}
function BtnGhost({ children, onClick, danger }) {
  return (
    <button onClick={onClick}
      style={{ background: "transparent", border: "none",
        color: danger ? C.blocked : C.muted, cursor: "pointer", fontFamily: FONT,
        fontSize: 12, fontWeight: 500, padding: "5px 10px", borderRadius: 3 }}>
      {children}
    </button>
  );
}

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

function wordCount(text) {
  if (!text || text.startsWith("//")) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function timeAgo(iso) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return "just now";
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
