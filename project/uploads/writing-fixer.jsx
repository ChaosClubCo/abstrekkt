import { useState, useEffect, useRef } from "react";

// ── PROVENANCE (locate specifics, never assert them) ────────────────────────
const PROVENANCE = `Kyle's real vantage point (use to LOCATE where a specific belongs — never to assert one):
- Day job: L1 service-desk tech at a managed IT firm (NEVER name the firm). Informally designated AI SME.
- Built FlashFusion (AI-enablement practice) at night — audit.flashfusion.co live.
- Runs an n8n / Base44 / Supabase / Vercel stack (counts vary — never assert a number).
- Diagnostic instinct origin: bartending at O'Toole's; later QC; self-taught engineering.
- Real lived material exists (a workflow that broke, an onboarding that failed on scoping, an early Shadow-AI call). He has the receipts; ask him to drop them in, don't invent them.`;

// ── DEFAULT VOICE PROFILE (seeded from Kyle's real writing) ──────────────────
const VOICE_DEFAULT = `KYLE'S VOICE — match THIS cadence, not generic "good writing":
- Rhythm: short declarative punches between longer technical sentences. Fragments are allowed and good when they land. Vary length hard — a three-word sentence after a long one is the signature move.
- Register: technical/clinical words for emotional material. Describe feeling like systems ("That's not a recovery problem. That's an engineering problem."). Plain over lyrical, every time.
- Profanity: rare, precise, load-bearing. One "fucking" that lands beats five that decorate. Never gratuitous.
- Ballast: real numbers, exact dates, specific percentiles carry the emotional weight. Don't editorialize on top of a specific — let it sit.
- Structure: section breaks as breaths between beats. Setups that flip ("Not the way you probably thought I meant"). Repetition for rhythm ("Then it happened. Then it happened again.").
- Refusals: no manufactured epiphany, no clean arc, no "I realized…", no recovery-narrative uplift, no inspirational close. End on the hard true thing, not the hopeful one.
- Branding frames — use ONLY where they already fit, never force: "Construction, not recovery." "Prosthetics, not amplifiers." "AI tested under load — no hype, just what holds." Flat delivery. Not slogans.
- Address: talking to one person, not an audience. Second person is fine.
Cadence comps: Denis Johnson's plainness, Leslie Jamison's precision — but Kyle is blunter than both.`;

const PUBLIC_WEAKNESSES = `
W1 — AI FINGERPRINT [high]: "seismic shift", "yawning chasm", "in today's landscape", bolded **nouns**, em-dash pile-ups, rhetorical-question closers, "Final Thought" sign-offs, tricolon padding. FIX: strip every tell; the piece must hold one moment only Kyle could write.
W2 — BORROWED AUTHORITY [high]: "As a strategist…", "industry data indicates", "on the frontlines". FIX: swap persona for provenance; where it leans on borrowed authority, insert [SPECIFIC NEEDED: …].
W3 — ABSTRACTION OVER SCENE [medium]: wall-to-wall category claims, no grounded incident. FIX: each section touches down on a time/place/error; where it floats, insert [SCENE NEEDED: …].
W4 — TEMPLATE STRUCTURE [watch]: listicle + bold hooks + CTA-question closer. FIX: flag it; suggest single-thread / teardown / failure-autopsy. Don't silently rewrite the whole shape.`;

const MEMOIR_WEAKNESSES = `
W5 — AUTHOR PERFORMING DEPTH [high]: manufactured epiphany, summarizing a moment's meaning, recovery-arc language, therapy vocabulary, sentences that announce their own significance. FIX: spoken syntax (could-I-say-this-across-a-bar). Plain over lyrical. No "I realized…". Cut any sentence whose only job is to sound deep.
W6 — VOICE DRIFT [medium]: words he wouldn't say out loud, over-smooth transitions, literary throat-clearing. FIX: pull back to his register; where a detail is missing, insert [DETAIL NEEDED: …] — never invent biographical fact.
INTEGRITY: memoir about real people. Never invent a scene, quote, place, or feeling. Mark the slot; don't fill it.`;

const SCHEMA = `Respond in EXACTLY this delimited format. No JSON. No markdown. No preamble. No text before ===DIAGNOSIS=== or after ===END===.

===DIAGNOSIS===
One block per weakness, blocks separated by a line containing only three dashes. Header line is pipe-delimited: ID | label | severity | present-or-absent
For PRESENT weaknesses add EVIDENCE: and NOTE: lines. For ABSENT weaknesses give only the header line.
Example:
W1 | AI fingerprint | high | present
EVIDENCE: an exact verbatim substring copied from the user's text
NOTE: one sentence specific to this text
---
W2 | borrowed authority | high | absent
===REWRITE===
The full reforged text, plain. Write freely — quotes, line breaks, em-dashes are all fine here, nothing needs escaping. Preserve the author's facts. Strip the tells you can strip honestly. Match the VOICE PROFILE's cadence. Where a real specific is required, insert a bracketed slot EXACTLY like [SPECIFIC NEEDED: name the workflow that broke] or [SCENE NEEDED: the moment a ticket went sideways] or [DETAIL NEEDED: what the room smelled like] — never fabricate the detail itself.
===CHANGES===
One per line, pipe-delimited: weakness-id | what you changed concretely | why (one sentence)
===FLAGS===
Optional. Non-text issues only (structure paralysis, listicle architecture). One per line. Leave empty if none.
===END===

Rules: EVIDENCE lines must be exact substrings from the user's text. Never invent a fact, number, date, name, or scene — bracket it instead. The rewrite must sound like the VOICE PROFILE, not like you.`;

function sysFor(lane, voiceBlock) {
  const base = lane === "memoir"
    ? `You are a line editor for Kyle Rosebrook's memoir "Construction, Not Recovery." ${PROVENANCE}\n\nDiagnose, then reforge against:\n${MEMOIR_WEAKNESSES}`
    : `You are a line editor for Kyle Rosebrook's public / FlashFusion writing. Thesis: authenticity — AI tested under real conditions, no hype. ${PROVENANCE}\n\nDiagnose, then reforge against:\n${PUBLIC_WEAKNESSES}`;
  return `${base}\n\n=== VOICE PROFILE (the rewrite MUST match this) ===\n${voiceBlock}\n\n${SCHEMA}`;
}

async function callAPI(lane, text, voiceBlock) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4096,
      system: sysFor(lane, voiceBlock), messages: [{ role: "user", content: `LANE: ${lane}\n\nTEXT:\n\n${text}` }] })
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return parseResponse((d.content || []).filter(b => b.type === "text").map(b => b.text).join(""));
}

function parseResponse(raw) {
  const re = /===\s*(DIAGNOSIS|REWRITE|CHANGES|FLAGS|END)\s*===/g;
  const marks = []; let m;
  while ((m = re.exec(raw)) !== null) marks.push({ name: m[1], start: m.index, bodyStart: re.lastIndex });
  const sec = {};
  for (let i = 0; i < marks.length; i++) { const cur = marks[i], next = marks[i + 1];
    sec[cur.name] = raw.slice(cur.bodyStart, next ? next.start : raw.length).trim(); }

  const diagnosis = [];
  if (sec.DIAGNOSIS) sec.DIAGNOSIS.split(/\n\s*---\s*\n/).forEach(block => {
    const lines = block.trim().split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) return;
    const head = lines[0].split("|").map(s => s.trim());
    if (head.length < 4) return;
    const [id, label, severity, presence] = head;
    diagnosis.push({ id, label, severity: (severity || "watch").toLowerCase(),
      present: /present|true|yes/i.test(presence),
      evidence: lines.filter(l => /^EVIDENCE:/i.test(l)).map(l => l.replace(/^EVIDENCE:/i, "").trim()),
      note: (lines.find(l => /^NOTE:/i.test(l)) || "").replace(/^NOTE:/i, "").trim() });
  });

  const changes = [];
  if (sec.CHANGES) sec.CHANGES.split("\n").forEach(l => { if (!l.includes("|")) return;
    const p = l.split("|").map(s => s.trim()); changes.push({ addresses: p[0], change: p[1] || "", why: p.slice(2).join(" | ") }); });

  const process_flags = sec.FLAGS ? sec.FLAGS.split("\n").map(s => s.trim()).filter(Boolean) : [];
  const rewrite = sec.REWRITE || "";
  if (!rewrite && !diagnosis.length) throw new Error("Could not parse model output. First 400 chars:\n" + raw.slice(0, 400));
  return { diagnosis, rewrite, changes, process_flags };
}

// ── FILE READING (txt / md native, docx via mammoth) ────────────────────────
async function readAnyFile(file) {
  const name = (file.name || "").toLowerCase();
  if (name.endsWith(".docx")) {
    try {
      const mod = await import("mammoth");
      const mammoth = mod.default || mod;
      const arrayBuffer = await file.arrayBuffer();
      const res = await mammoth.extractRawText({ arrayBuffer });
      return res.value;
    } catch (e) { throw new Error(".docx parsing unavailable here — paste the text, or save as .txt/.md."); }
  }
  if (name.endsWith(".pdf")) throw new Error("PDF not supported in-artifact. Export to .txt or paste the text.");
  return await file.text();
}

// ── LOCAL TELL-METER ────────────────────────────────────────────────────────
const TELLS = ["seismic shift","yawning chasm","sobering reality check","in today's landscape","in today's world","ever-evolving","ever-changing","game-changer","game changer","at the end of the day","it's important to note","it's worth noting","navigate the complexities","navigating the","unlock the power","unlock the potential","harness the power","delve into","dive deep","deep dive","robust","leverage","synergy","paradigm shift","in conclusion","final thought","so what does this mean","let's explore","the rise of","fast-paced","cutting-edge","tapestry","testament to","a world where","more than ever","double-edged sword"];
function scanTells(text) {
  const low = text.toLowerCase(); const hits = [];
  for (const t of TELLS) { let i = low.indexOf(t); while (i !== -1) { hits.push({ t, i }); i = low.indexOf(t, i + t.length); } }
  const tri = (text.match(/\b(\w+),\s+(\w+),\s+and\s+(\w+)\b/g) || []).length;
  return { hits, tricolons: tri };
}

const C = { paper:"#f4f0e6", ink:"#1c1a16", rust:"#b5481f", teal:"#1f5e54", gold:"#a87c1f", line:"#c9c2b2", card:"#fbf8f1", dim:"#5a554a", faint:"#7a7466", slab:"#13110d", slabText:"#ece4d3" };
const SEV = { high:C.rust, medium:C.gold, watch:C.teal };
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap');`;
const MONO = { fontFamily:"'IBM Plex Mono',monospace" };
const DISP = { fontFamily:"'Fraunces',serif" };
const F = { fontFamily:"'Source Serif 4',Georgia,serif" };
const SLOT_RE = /\[(SPECIFIC|SCENE|DETAIL) NEEDED:[^\]]*\]/g;

export default function WritingFixer() {
  const [lane, setLane] = useState("public");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [rewrite, setRewrite] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verify, setVerify] = useState(null);
  const [err, setErr] = useState("");
  const [toast, setToast] = useState("");
  const [saved, setSaved] = useState([]);
  const [drag, setDrag] = useState(false);
  // voice profile
  const [voiceSpec, setVoiceSpec] = useState(VOICE_DEFAULT);
  const [voiceSamples, setVoiceSamples] = useState([]);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const styleRef = useRef(false);
  const outRef = useRef(null);
  const inFileRef = useRef(null);
  const voiceFileRef = useRef(null);
  const specTimer = useRef(null);

  useEffect(() => {
    if (!styleRef.current) { const s = document.createElement("style"); s.textContent = FONTS; document.head.appendChild(s); styleRef.current = true; }
    (async () => {
      try { const r = await window.storage?.list("wf:"); if (r?.keys?.length) {
        const items = await Promise.all(r.keys.map(k => window.storage.get(k).catch(()=>null)));
        setSaved(items.filter(Boolean).map(i => ({ key:i.key, ...JSON.parse(i.value) }))); } } catch(e){}
      try { const sp = await window.storage?.get("wfvoice:spec"); if (sp?.value) setVoiceSpec(sp.value); } catch(e){}
      try { const sm = await window.storage?.get("wfvoice:samples"); if (sm?.value) setVoiceSamples(JSON.parse(sm.value)); } catch(e){}
    })();
  }, []);

  const flash = (msg) => { setToast(msg); setTimeout(()=>setToast(""), 1600); };

  const buildVoiceBlock = () => {
    let b = voiceSpec.trim();
    if (voiceSamples.length) {
      b += "\n\n=== REAL VOICE SAMPLES (ground truth — match this cadence above all) ===";
      voiceSamples.forEach((s,i) => { b += `\n\n[Sample ${i+1}${s.label?` — ${s.label}`:""}]\n${s.text.slice(0,1600)}`; });
    }
    return b;
  };

  const run = async () => {
    if (!text.trim()) return;
    setLoading(true); setErr(""); setResult(null); setVerify(null);
    try { const res = await callAPI(lane, text, buildVoiceBlock()); setResult(res); setRewrite(res.rewrite || ""); }
    catch (e) { setErr(e.message); }
    setLoading(false);
  };

  const runVerify = async () => {
    if (!rewrite.trim()) return;
    setVerifying(true); setVerify(null);
    try { const res = await callAPI(lane, rewrite, buildVoiceBlock()); setVerify((res.diagnosis||[]).filter(d=>d.present)); }
    catch (e) { setErr(e.message); }
    setVerifying(false);
  };

  // input file / drop
  const loadInputFile = async (file) => {
    if (!file) return;
    try { flash("reading…"); const t = await readAnyFile(file); setText(t); flash("loaded ✓"); }
    catch(e){ setErr(e.message); }
  };
  const onDrop = (e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer?.files?.[0]; if (f) loadInputFile(f); };

  // voice sample add
  const addVoiceSample = async (text, label) => {
    if (!text.trim()) return;
    const next = [...voiceSamples, { id: Date.now(), label: label || "", text: text.trim() }];
    setVoiceSamples(next);
    try { await window.storage?.set("wfvoice:samples", JSON.stringify(next)); } catch(e){}
    flash("voice sample added ✓");
  };
  const loadVoiceFile = async (file) => {
    if (!file) return;
    try { const t = await readAnyFile(file); await addVoiceSample(t, file.name); }
    catch(e){ setErr(e.message); }
  };
  const removeVoiceSample = async (id) => {
    const next = voiceSamples.filter(s => s.id !== id);
    setVoiceSamples(next);
    try { await window.storage?.set("wfvoice:samples", JSON.stringify(next)); } catch(e){}
  };
  const onSpecChange = (val) => {
    setVoiceSpec(val);
    clearTimeout(specTimer.current);
    specTimer.current = setTimeout(() => { window.storage?.set("wfvoice:spec", val).catch(()=>{}); }, 600);
  };
  const resetSpec = () => { setVoiceSpec(VOICE_DEFAULT); window.storage?.set("wfvoice:spec", VOICE_DEFAULT).catch(()=>{}); flash("voice reset to default"); };

  // copy / download / save
  const copy = async () => {
    try { await navigator.clipboard.writeText(rewrite); flash("copied ✓"); return; } catch(e){}
    try { const ta = document.createElement("textarea"); ta.value = rewrite; ta.style.position="fixed"; ta.style.opacity="0";
      document.body.appendChild(ta); ta.focus(); ta.select(); const ok = document.execCommand("copy"); document.body.removeChild(ta);
      flash(ok ? "copied ✓" : "select + ⌘C"); } catch(e){ flash("select + ⌘C"); }
  };
  const download = () => {
    try { const blob = new Blob([rewrite], { type:"text/plain" }); const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href=url; a.download=`reforged-${lane}-${Date.now()}.txt`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); flash("downloaded ✓"); }
    catch(e){ flash("download blocked"); }
  };
  const save = async () => {
    if (!result) return;
    const title = (rewrite.trim().split(/\s+/).slice(0,6).join(" ") || "untitled").slice(0,48);
    const key = "wf:" + Date.now();
    const payload = { title, lane, text, rewrite, diagnosis: result.diagnosis, ts: Date.now() };
    try { await window.storage?.set(key, JSON.stringify(payload)); setSaved(s => [{ key, ...payload }, ...s]); flash("saved ✓"); }
    catch(e){ flash("save unavailable"); }
  };
  const load = (item) => { setLane(item.lane); setText(item.text); setRewrite(item.rewrite);
    setResult({ diagnosis:item.diagnosis, changes:[], process_flags:[] }); setVerify(null); flash("loaded"); };
  const del = async (key) => { try { await window.storage?.delete(key); setSaved(s => s.filter(x => x.key !== key)); } catch(e){} };

  // slots
  const slots = [];
  if (rewrite) { let m; SLOT_RE.lastIndex = 0; while ((m = SLOT_RE.exec(rewrite)) !== null) slots.push({ start:m.index, end:m.index+m[0].length, text:m[0] }); }
  const jumpSlot = (slot) => { const ta = outRef.current; if (!ta) return; ta.focus(); ta.setSelectionRange(slot.start, slot.end);
    ta.scrollTop = (slot.start / Math.max(rewrite.length,1)) * ta.scrollHeight - ta.clientHeight/2; };

  const wc = (t) => t.trim() ? t.trim().split(/\s+/).length : 0;
  const present = (result?.diagnosis || []).filter(d => d.present);
  const tells = scanTells(text);
  const tellTotal = tells.hits.length + (lane==="public" ? Math.max(0,tells.tricolons-1) : 0);
  const voiceTuned = voiceSpec.trim() !== VOICE_DEFAULT.trim() || voiceSamples.length > 0;
  const btn = (bg, fg, extra={}) => ({ ...MONO, fontSize:10, letterSpacing:".08em", textTransform:"uppercase", padding:"5px 11px", cursor:"pointer", background:bg, border:`1px solid ${fg}`, color:fg, ...extra });

  return (
    <div style={{ minHeight:"100vh", background:C.paper, color:C.ink, ...F, backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 31px,rgba(28,26,22,.035) 31px,rgba(28,26,22,.035) 32px)" }}>
      <div style={{ maxWidth:1180, margin:"0 auto", padding:"40px 22px 90px" }}>

        <div style={{ borderBottom:`3px solid ${C.ink}`, paddingBottom:18, marginBottom:18 }}>
          <div style={{ ...MONO, fontSize:12, letterSpacing:".18em", textTransform:"uppercase", color:C.rust, marginBottom:9 }}>The Repair Bench · implements the first-pass diagnostic</div>
          <h1 style={{ ...DISP, fontWeight:700, fontSize:"clamp(26px,4.4vw,40px)", lineHeight:1.05, letterSpacing:"-.01em" }}>Paste or drop raw. Get it <em style={{ color:C.rust, fontStyle:"italic" }}>reforged</em> in your voice.</h1>
          <p style={{ marginTop:12, maxWidth:"68ch", fontSize:15.5, color:C.dim }}>Diagnoses against the seven weaknesses, rewrites to match your cadence, and marks a slot wherever a real specific is needed — it never invents one. Tune the voice profile below; it learns from samples you add.</p>
        </div>

        {/* VOICE PROFILE (collapsible) */}
        <div style={{ border:`1px solid ${C.line}`, marginBottom:16, background:C.card }}>
          <div onClick={()=>setVoiceOpen(o=>!o)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 16px", cursor:"pointer" }}>
            <div style={{ ...MONO, fontSize:11.5, letterSpacing:".12em", textTransform:"uppercase", color:C.ink }}>
              Voice profile <span style={{ color: voiceTuned?C.teal:C.faint, marginLeft:8 }}>{voiceTuned ? `● tuned${voiceSamples.length?` · ${voiceSamples.length} sample${voiceSamples.length!==1?"s":""}`:""}` : "○ default"}</span>
            </div>
            <span style={{ ...MONO, fontSize:13, color:C.faint }}>{voiceOpen ? "▾" : "▸"}</span>
          </div>
          {voiceOpen && (
            <div style={{ padding:"0 16px 16px", borderTop:`1px solid ${C.line}` }}>
              <div style={{ ...MONO, fontSize:10.5, color:C.faint, margin:"12px 0 6px", letterSpacing:".06em" }}>SPEC — editable. This is what the rewrite calibrates against.</div>
              <textarea value={voiceSpec} onChange={e=>onSpecChange(e.target.value)}
                style={{ width:"100%", minHeight:150, background:C.paper, border:`1px solid ${C.line}`, color:C.ink, ...MONO, fontSize:11.5, lineHeight:1.6, padding:"12px 14px", outline:"none", resize:"vertical", boxSizing:"border-box" }} />
              <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap", alignItems:"center" }}>
                <button onClick={()=>voiceFileRef.current?.click()} style={btn("transparent", C.teal)}>+ upload voice sample</button>
                <button onClick={()=>{ const t = prompt("Paste a chunk of your real writing (the realer the better):"); if(t) addVoiceSample(t, "pasted"); }} style={btn("transparent", C.teal)}>+ paste voice sample</button>
                <button onClick={resetSpec} style={btn("transparent", C.faint)}>reset spec</button>
                <input ref={voiceFileRef} type="file" accept=".txt,.md,.docx" style={{ display:"none" }} onChange={e=>{ loadVoiceFile(e.target.files?.[0]); e.target.value=""; }} />
              </div>
              {voiceSamples.length>0 && (
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:10 }}>
                  {voiceSamples.map(s => (
                    <span key={s.id} style={{ ...MONO, fontSize:10, color:C.teal, border:`1px solid ${C.teal}`, padding:"3px 8px", display:"flex", gap:6, alignItems:"center" }}>
                      {(s.label||"sample").slice(0,24)} · {wc(s.text)}w
                      <span onClick={()=>removeVoiceSample(s.id)} style={{ cursor:"pointer", color:C.faint }}>×</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* LANE */}
        <div style={{ display:"flex", gap:0, marginBottom:14, border:`1px solid ${C.line}`, width:"fit-content" }}>
          {[["public","Public / FlashFusion"],["memoir","Memoir"]].map(([k,label]) => (
            <button key={k} onClick={()=>{ setLane(k); setResult(null); setVerify(null); }}
              style={{ ...MONO, fontSize:12, letterSpacing:".08em", padding:"9px 18px", cursor:"pointer", border:"none", background: lane===k ? C.ink : "transparent", color: lane===k ? C.paper : C.dim }}>{label}</button>
          ))}
        </div>

        {/* INPUT (paste or drop) */}
        <div style={{ position:"relative" }}
          onDragOver={e=>{ e.preventDefault(); setDrag(true); }} onDragLeave={()=>setDrag(false)} onDrop={onDrop}>
          <textarea value={text} onChange={e=>setText(e.target.value)}
            placeholder={lane==="memoir" ? "Paste a passage, or drop a .txt / .md / .docx. Raw and unassisted is best." : "Paste a draft, or drop a .txt / .md / .docx file here…"}
            style={{ width:"100%", minHeight:180, background: drag ? "#efe7d4" : C.card, border:`1px solid ${drag?C.rust:C.line}`, borderLeft:`5px solid ${C.ink}`,
              color:C.ink, ...F, fontSize:16, lineHeight:1.6, padding:"18px 20px", outline:"none", resize:"vertical", boxSizing:"border-box", transition:"background .12s" }} />
          <div style={{ position:"absolute", bottom:12, right:16, display:"flex", gap:10, alignItems:"center" }}>
            <button onClick={()=>inFileRef.current?.click()} style={{ ...MONO, fontSize:10, letterSpacing:".08em", textTransform:"uppercase", padding:"4px 10px", cursor:"pointer", background:"transparent", border:`1px solid ${C.faint}`, color:C.dim }}>upload</button>
            <span style={{ ...MONO, fontSize:11, color:C.faint }}>{wc(text)} words</span>
          </div>
          <input ref={inFileRef} type="file" accept=".txt,.md,.docx" style={{ display:"none" }} onChange={e=>{ loadInputFile(e.target.files?.[0]); e.target.value=""; }} />
          {drag && <div style={{ position:"absolute", inset:0, border:`2px dashed ${C.rust}`, display:"flex", alignItems:"center", justifyContent:"center", ...MONO, fontSize:13, color:C.rust, pointerEvents:"none", background:"rgba(181,72,31,.04)" }}>drop to load</div>}
        </div>

        {/* TELL METER */}
        {text.trim() && (
          <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            <span style={{ ...MONO, fontSize:11, letterSpacing:".1em", textTransform:"uppercase", color: tellTotal===0?C.teal:tellTotal<3?C.gold:C.rust }}>
              {tellTotal===0 ? "no surface tells" : `${tellTotal} tell${tellTotal!==1?"s":""} detected`}</span>
            {[...new Set(tells.hits.map(h=>h.t))].slice(0,8).map((t,i)=>(<span key={i} style={{ ...MONO, fontSize:10.5, color:C.rust, background:"#f6e3da", padding:"2px 7px", border:`1px solid ${C.rust}` }}>{t}</span>))}
            {lane==="public" && tells.tricolons>1 && <span style={{ ...MONO, fontSize:10.5, color:C.gold, border:`1px solid ${C.gold}`, padding:"2px 7px" }}>{tells.tricolons} tricolons</span>}
          </div>
        )}

        <div style={{ display:"flex", alignItems:"center", gap:16, marginTop:14 }}>
          <button onClick={run} disabled={loading || !text.trim()}
            style={{ ...MONO, fontSize:13, letterSpacing:".1em", textTransform:"uppercase", padding:"12px 26px", cursor: loading||!text.trim()?"default":"pointer", background: loading||!text.trim()? C.line : C.rust, color: loading||!text.trim()? C.faint : C.paper, border:"none" }}>{loading ? "Reforging…" : "Diagnose & Reforge →"}</button>
          {result && <span style={{ ...MONO, fontSize:11.5, color:C.dim }}>{present.length} found · {slots.length} slot{slots.length!==1?"s":""} to fill</span>}
        </div>

        {err && <div style={{ ...MONO, fontSize:13, color:C.rust, background:"#f6e3da", border:`1px solid ${C.rust}`, padding:"12px 16px", marginTop:16, whiteSpace:"pre-wrap" }}>{err}</div>}

        {result && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1.25fr", gap:22, marginTop:28, alignItems:"start" }}>
            {/* LEFT */}
            <div>
              <SectionLabel>Diagnosis</SectionLabel>
              {present.length === 0 && <div style={{ fontSize:15, color:C.teal, padding:"14px 0" }}>Clean pass. Nothing tracked fired.</div>}
              {present.map(d => (
                <div key={d.id} style={{ background:C.card, border:`1px solid ${C.line}`, borderLeft:`5px solid ${SEV[d.severity]||C.ink}`, marginBottom:10, padding:"14px 16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:10 }}>
                    <span style={{ ...DISP, fontWeight:600, fontSize:16 }}>{d.label}</span>
                    <span style={{ ...MONO, fontSize:9.5, letterSpacing:".14em", textTransform:"uppercase", color:SEV[d.severity]||C.ink, border:"1px solid currentColor", padding:"3px 8px", whiteSpace:"nowrap" }}>{d.severity}</span>
                  </div>
                  {d.note && <p style={{ fontSize:13.5, color:C.dim, marginTop:6 }}>{d.note}</p>}
                  {(d.evidence||[]).map((q,i)=>(<div key={i} style={{ fontStyle:"italic", fontSize:13, color:C.dim, borderLeft:`3px solid ${C.line}`, padding:"5px 12px", margin:"8px 0 0", background:"rgba(28,26,22,.025)" }}>"{q}"</div>))}
                </div>
              ))}

              {(result.changes||[]).length>0 && <>
                <SectionLabel style={{ marginTop:24 }}>Operations log</SectionLabel>
                <div style={{ background:C.slab, padding:"14px 16px" }}>
                  {result.changes.map((c,i)=>(<div key={i} style={{ ...MONO, fontSize:12, lineHeight:1.55, color:C.slabText, paddingBottom:i<result.changes.length-1?12:0, marginBottom:i<result.changes.length-1?12:0, borderBottom:i<result.changes.length-1?"1px solid #2a2620":"none" }}>
                    <span style={{ color:"#e8b88a" }}>{c.addresses}</span> · {c.change}<div style={{ color:"#9b9484", marginTop:3 }}>↳ {c.why}</div></div>))}
                </div>
              </>}

              {(result.process_flags||[]).length>0 && <>
                <SectionLabel style={{ marginTop:24 }}>Process flags</SectionLabel>
                {result.process_flags.map((f,i)=>(<div key={i} style={{ fontSize:13.5, color:C.dim, borderLeft:`3px solid ${C.teal}`, padding:"6px 12px", marginBottom:8 }}>{f}</div>))}
              </>}

              <SectionLabel style={{ marginTop:24 }}>Verify pass</SectionLabel>
              <button onClick={runVerify} disabled={verifying || !rewrite.trim()} style={{ ...MONO, fontSize:11, letterSpacing:".1em", textTransform:"uppercase", padding:"9px 16px", cursor: verifying?"default":"pointer", background:"transparent", border:`1px solid ${C.teal}`, color:C.teal }}>{verifying ? "Re-checking…" : "Re-diagnose the edited version →"}</button>
              {verify && <div style={{ marginTop:10, ...MONO, fontSize:12, color: verify.length===0?C.teal:C.gold, lineHeight:1.5 }}>{verify.length===0 ? "✓ Clean — the tells are gone from your edited version." : `${verify.length} still firing: ${verify.map(v=>v.label).join(", ")}. Fill the slots and run again.`}</div>}
            </div>

            {/* RIGHT */}
            <div style={{ position:"sticky", top:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                <SectionLabel>Reforged <span style={{ color:C.faint, textTransform:"none", letterSpacing:0 }}>— editable</span></SectionLabel>
                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={copy} style={btn("transparent", C.ink)}>copy</button>
                  <button onClick={download} style={btn("transparent", C.ink)}>download</button>
                  <button onClick={save} style={btn("transparent", C.ink)}>save</button>
                </div>
              </div>
              {slots.length>0 && (
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
                  {slots.map((s,i)=>{ const kind = s.text.match(/\[(\w+)/)[1]; return (
                    <button key={i} onClick={()=>jumpSlot(s)} title={s.text} style={{ ...MONO, fontSize:9.5, letterSpacing:".06em", textTransform:"uppercase", padding:"3px 8px", cursor:"pointer", background:C.rust, color:C.paper, border:"none" }}>{kind} {i+1}</button>
                  );})}
                </div>
              )}
              <textarea ref={outRef} value={rewrite} onChange={e=>{ setRewrite(e.target.value); setVerify(null); }}
                style={{ width:"100%", minHeight:430, background:C.card, border:`1px solid ${C.line}`, borderLeft:`5px solid ${C.rust}`, color:C.ink, ...F, fontSize:15.5, lineHeight:1.7, padding:"18px 20px", outline:"none", resize:"vertical", boxSizing:"border-box" }} />
              {slots.length>0 && <p style={{ ...MONO, fontSize:11.5, color:C.rust, marginTop:8, lineHeight:1.5 }}>{slots.length} slot{slots.length!==1?"s":""} left. Click a chip to jump to it. These are the places only you can finish — the tool left them empty on purpose.</p>}
            </div>
          </div>
        )}

        {saved.length>0 && <>
          <SectionLabel style={{ marginTop:34 }}>Saved pieces</SectionLabel>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {saved.map(item=>(
              <div key={item.key} style={{ display:"flex", alignItems:"center", gap:12, background:C.card, border:`1px solid ${C.line}`, padding:"9px 14px" }}>
                <span style={{ ...MONO, fontSize:9.5, letterSpacing:".1em", textTransform:"uppercase", color: item.lane==="memoir"?C.teal:C.gold, border:"1px solid currentColor", padding:"2px 7px" }}>{item.lane}</span>
                <span style={{ flex:1, fontSize:14 }}>{item.title}…</span>
                <button onClick={()=>load(item)} style={btn("transparent", C.ink)}>load</button>
                <button onClick={()=>del(item.key)} style={btn("transparent", C.faint)}>×</button>
              </div>
            ))}
          </div>
        </>}
      </div>
      {toast && <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", ...MONO, fontSize:12, letterSpacing:".08em", background:C.ink, color:C.paper, padding:"10px 20px" }}>{toast}</div>}
    </div>
  );
}

function SectionLabel({ children, style }) {
  return <div style={{ ...MONO, fontSize:11, letterSpacing:".16em", textTransform:"uppercase", color:"#7a7466", marginBottom:12, ...style }}>{children}</div>;
}
