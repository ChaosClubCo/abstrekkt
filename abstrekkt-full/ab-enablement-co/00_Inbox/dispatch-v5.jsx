import { useState, useEffect, useRef, useCallback } from "react";

// ── Grounded constants ──────────────────────────────────────────────────────
// LinkedIn: hard cap 3000 chars, optimal zone 1300-1900 (AuthoredUp, 372k posts)
// X: hard cap 280 chars, engagement peaks <100 chars; target 270 to stay safe
const LI_OPTIMAL_LOW  = 1300;
const LI_OPTIMAL_HIGH = 1900;
const LI_HARD_CAP     = 3000;
const X_TARGET        = 270;

const PROJECTS = [
  { id: "flashfusion", label: "FlashFusion", emoji: "⚡", safe: true },
  { id: "ai-learning", label: "AI / Tooling", emoji: "🧠", safe: true },
  { id: "intinc",      label: "Intinc (NDA)", emoji: "🔒", safe: false },
];

const TONES = [
  { id: "raw",        label: "Raw / Real" },
  { id: "technical",  label: "Technical"  },
  { id: "reflective", label: "Reflective" },
];

const FIELDS = [
  { key: "built",   label: "What I built / did",      placeholder: "e.g. Mapped 7 buyer personas to Wix store collections...", required: true  },
  { key: "broke",   label: "What broke or was hard",  placeholder: "e.g. updateDeliveryCarrier API silently rejects appId...", required: false },
  { key: "learned", label: "What I actually learned", placeholder: "e.g. Wix V1 Catalog has a completely different API surface...", required: false },
  { key: "next",    label: "What's next",             placeholder: "e.g. Manual shipping config — no REST endpoints for this...", required: false },
];

// Expanded TONE_MAP with explicit prohibitions — reduces hallucinated filler
const TONE_MAP = {
  raw: `Direct, honest, like a senior engineer texting a peer. Short punchy sentences. Admits when things went sideways. No spin.
PROHIBIT: "I'm grateful", "this journey", "I'm excited to share", passive voice, vague lessons not tied to the actual work.`,
  technical: `Technically precise. Use specific tool names, API names, error codes, and architecture decisions. Credible to engineers who would fact-check.
PROHIBIT: "AI-powered" without naming the specific model or API, broad lessons from narrow findings, abstracting away the specific details.`,
  reflective: `Connects this specific technical event to a broader pattern. Direct — not preachy, not motivational.
PROHIBIT: Philosophical tangents not grounded in the actual work, rhetorical questions as decoration, ending with a quote or aphorism.`
};

const DRIVE_MCP = { type: "url", url: "https://drivemcp.googleapis.com/mcp/v1", name: "google-drive" };
const MODEL = "claude-sonnet-4-6"; // retired: claude-sonnet-4-20250514

// ── Helpers ─────────────────────────────────────────────────────────────────
const extractJSON = (raw) => {
  const s = raw.indexOf("{"), e = raw.lastIndexOf("}");
  if (s === -1 || e === -1) throw new Error("No JSON in response");
  return JSON.parse(raw.substring(s, e + 1));
};

const callAPI = async (messages, { maxTokens = 1000, mcpServers } = {}) => {
  const body = { model: MODEL, max_tokens: maxTokens, messages };
  if (mcpServers) body.mcp_servers = mcpServers;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return res.json();
};

// Lightweight NDA heuristic: flag capitalized proper-noun + corporate suffix
const scanNDA = (text) => {
  const pat = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Inc\.?|LLC|Corp\.?|Ltd\.?|Co\.?|Group|Solutions|Services|Technologies|Systems|Management|Associates)\b/g;
  return [...text.matchAll(pat)].map(m => m[0]).filter(m => !["FlashFusion","Abstrekkt"].includes(m.split(" ")[0]));
};

// LinkedIn engagement zone (AuthoredUp 2026 data: optimal = 1300-1900)
const liZone = (n) => {
  if (n < 800)                      return { label: "TOO SHORT",  color: "#ef4444" };
  if (n < LI_OPTIMAL_LOW)           return { label: "BUILDING",   color: "#A855F7" };
  if (n <= LI_OPTIMAL_HIGH)         return { label: "OPTIMAL ✓",  color: "#22D3EE" };
  if (n <= 2500)                    return { label: "LONG",        color: "#A855F7" };
  if (n <= LI_HARD_CAP)             return { label: "NEAR LIMIT", color: "#EC4899" };
  return                                   { label: "OVER LIMIT", color: "#ef4444" };
};

// X engagement zone (target <100 chars for best engagement per research)
const xZone = (n) => {
  if (n === 0)        return { label: "EMPTY",  color: "#4a3880" };
  if (n <= 100)       return { label: "PUNCHY", color: "#22D3EE" };
  if (n <= 200)       return { label: "GOOD",   color: "#A855F7" };
  if (n <= X_TARGET)  return { label: "OK",     color: "#A855F7" };
  return                     { label: "OVER",   color: "#ef4444" };
};

const BASE_BTN = {
  fontFamily: "'Geist Mono', 'Courier New', monospace",
  cursor: "pointer",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  minHeight: "44px",
  transition: "all 0.15s",
};

// ── Sub-components ───────────────────────────────────────────────────────────

function Toast({ message, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2600); return () => clearTimeout(t); }, [onDone]);
  const c = {
    success: { bg: "rgba(34,211,238,0.1)", border: "rgba(16,185,129,0.3)", text: "#22D3EE" },
    error:   { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", text: "#f87171" },
    info:    { bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)", text: "#fbbf24" },
  }[type] || {};
  return (
    <div role="status" aria-live="polite" aria-atomic="true"
      style={{ position:"fixed", bottom:"24px", right:"24px", padding:"10px 16px", borderRadius:"4px",
        background:c.bg, border:`1px solid ${c.border}`, color:c.text,
        fontSize:"12px", fontFamily:"'Geist Mono', 'Courier New', monospace", letterSpacing:"0.06em",
        zIndex:9999, animation:"slideIn 0.2s ease", maxWidth:"320px" }}>
      {message}
    </div>
  );
}

function SuggestionCard({ s, index, selected, loading, onSelect }) {
  const summary = s.summary?.length > 110 ? s.summary.substring(0, 107) + "..." : s.summary;
  return (
    <button type="button" onClick={() => onSelect(index)} aria-pressed={selected}
      style={{ width:"100%", textAlign:"left", display:"block", padding:"14px 16px",
        background: selected ? "rgba(168,85,247,0.06)" : "#0f0f1c",
        border: selected ? "1px solid rgba(168,85,247,0.5)" : "1px solid #16122e",
        borderRadius:"3px", cursor: loading ? "not-allowed" : "pointer",
        fontFamily:"'Geist Mono', 'Courier New', monospace", transition:"all 0.15s", minHeight:"auto", opacity: loading ? 0.5 : 1 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
        <span style={{ fontSize:"10px", color: selected ? "#A855F7" : "#4a3880", letterSpacing:"0.1em", textTransform:"uppercase" }}>
          {selected ? "✓ SELECTED" : `OPTION ${index + 1}`}
        </span>
        <span style={{ fontSize:"10px", color:"#221840", textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.type || "doc"}</span>
      </div>
      <p style={{ margin:"0 0 4px", fontSize:"13px", color: selected ? "#f5f0ff" : "#c4b5fd",
        fontFamily:"'Geist', system-ui, sans-serif", lineHeight:"1.4", textTransform:"none", letterSpacing:"normal" }}>
        {s.title}
      </p>
      {summary && (
        <p style={{ margin:"0 0 4px", fontSize:"11px", color:"#8b7cc0",
          fontFamily:"'Geist', system-ui, sans-serif", lineHeight:"1.4", textTransform:"none", letterSpacing:"normal" }}>
          {summary}
        </p>
      )}
      <p style={{ margin:0, fontSize:"11px", color:"#6b5fa0", fontFamily:"'Geist Mono', 'Courier New', monospace",
        lineHeight:"1.5", textTransform:"none", letterSpacing:"normal", fontStyle:"italic" }}>
        → {s.angle}
      </p>
    </button>
  );
}

function PostCard({ platform, content, isLI, onCopy, ndaWarnings }) {
  const charCount = content?.length || 0;
  const zone = isLI ? liZone(charCount) : xZone(charCount);
  const limit = isLI ? LI_HARD_CAP : X_TARGET;
  const optimalNote = isLI
    ? `Optimal: ${LI_OPTIMAL_LOW.toLocaleString()}–${LI_OPTIMAL_HIGH.toLocaleString()} · Hard cap: ${LI_HARD_CAP.toLocaleString()}`
    : "Target: <100 chars for best engagement · Hard cap: 270";

  return (
    <article aria-label={`${platform} post`} className="post-card"
      style={{ background:"#0f0f1c", border:"1px solid #16122e", borderRadius:"3px",
        padding:"20px", borderLeft:`2px solid ${zone.color}40` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <h3 style={{ margin:0, fontSize:"10px", color:"#A855F7", letterSpacing:"0.15em",
            fontFamily:"'Geist Mono', 'Courier New', monospace", textTransform:"uppercase" }}>{platform}</h3>
          <span style={{ fontSize:"9px", color: zone.color, letterSpacing:"0.1em",
            fontFamily:"'Geist Mono', 'Courier New', monospace", textTransform:"uppercase",
            padding:"2px 6px", background:`${zone.color}12`, borderRadius:"2px", border:`1px solid ${zone.color}30` }}>
            {zone.label}
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <span style={{ fontSize:"10px", color: charCount > limit ? "#ef4444" : "#4a3880",
            fontFamily:"'Geist Mono', 'Courier New', monospace" }}>
            {charCount.toLocaleString()} / {limit.toLocaleString()}
          </span>
          <button onClick={() => onCopy(content, platform)} aria-label={`Copy ${platform} post`}
            className="btn-hover"
            style={{ ...BASE_BTN, padding:"4px 12px", borderRadius:"3px", border:"1px solid #221840",
              background:"transparent", color:"#8b7cc0", fontSize:"11px", minHeight:"32px" }}>
            COPY
          </button>
        </div>
      </div>
      {/* LinkedIn char progress bar */}
      {isLI && (
        <div aria-hidden="true" style={{ height:"2px", background:"#16122e", borderRadius:"1px", marginBottom:"6px", position:"relative" }}>
          <div style={{
            position:"absolute", left:0, top:0, height:"100%", borderRadius:"1px",
            width:`${Math.min(charCount / LI_HARD_CAP * 100, 100)}%`,
            background: zone.color, transition:"width 0.3s ease"
          }} />
          {/* Optimal zone markers */}
          <div style={{ position:"absolute", left:`${LI_OPTIMAL_LOW/LI_HARD_CAP*100}%`, top:"-3px", width:"1px", height:"8px", background:"#22D3EE50" }} />
          <div style={{ position:"absolute", left:`${LI_OPTIMAL_HIGH/LI_HARD_CAP*100}%`, top:"-3px", width:"1px", height:"8px", background:"#22D3EE50" }} />
        </div>
      )}
      <p style={{ fontSize:"11px", color:"#4a3880", fontFamily:"'Geist Mono', 'Courier New', monospace",
        letterSpacing:"0.04em", margin:"0 0 12px" }}>
        {optimalNote}
      </p>
      <p style={{ fontSize:"14px", lineHeight:"1.75", color:"#c4b5fd", margin:0,
        whiteSpace:"pre-wrap", fontFamily:"'Geist', system-ui, sans-serif" }}>
        {content}
      </p>
      {ndaWarnings?.length > 0 && (
        <div role="alert" style={{ marginTop:"10px", padding:"8px 12px",
          background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.2)",
          borderRadius:"3px", fontSize:"10px", color:"#f87171", fontFamily:"'Geist Mono', 'Courier New', monospace", letterSpacing:"0.04em" }}>
          ⚠ Possible NDA exposure: {ndaWarnings.join(", ")} — review before posting
        </div>
      )}
    </article>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function Dispatch() {
  const [inputMode, setInputMode] = useState("manual");
  const [project,   setProject]   = useState("ai-learning");
  const [tone,      setTone]      = useState("raw");
  const [fields,    setFields]    = useState({ built:"", broke:"", learned:"", next:"" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [output,    setOutput]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [toast,     setToast]     = useState(null);
  const [history,   setHistory]   = useState([]);
  const [driveSource, setDriveSource] = useState(null); // {title, angle, clarifiers[]}

  // Drive state — two-phase: search → select → clarify
  const [searchHint,      setSearchHint]      = useState("");
  const [driveStatus,     setDriveStatus]     = useState("idle");
  const [suggestions,     setSuggestions]     = useState([]);
  const [selectedIdx,     setSelectedIdx]     = useState(null);
  const [clarifiers,      setClarifiers]      = useState([]);  // [{question, answer}]
  const [clarifierStatus, setClarifierStatus] = useState("idle"); // idle|loading|ready|error

  const firstFieldRef = useRef(null);
  const outputRef     = useRef(null);
  const liveRef       = useRef(null);
  const selectedProject = PROJECTS.find(p => p.id === project);

  // Persist draft + history
  useEffect(() => {
    const d = localStorage.getItem("dispatch-draft");
    if (d) { try { setFields(JSON.parse(d)); } catch {} }
    const h = localStorage.getItem("dispatch-history");
    if (h) { try { setHistory(JSON.parse(h)); } catch {} }
  }, []);
  useEffect(() => {
    if (Object.values(fields).some(v => v)) localStorage.setItem("dispatch-draft", JSON.stringify(fields));
  }, [fields]);
  useEffect(() => {
    if (history.length) localStorage.setItem("dispatch-history", JSON.stringify(history.slice(0, 8)));
  }, [history]);

  const announce = (msg) => { if (liveRef.current) liveRef.current.textContent = msg; };

  const copyToClipboard = useCallback(async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ message: `✓ ${label} copied`, type: "success" });
      announce(`${label} copied`);
    } catch {
      setToast({ message: "Copy failed — select text manually", type: "error" });
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const h = (e) => {
      if (!e.target.matches("textarea, input")) {
        if (e.key === "1") setProject("flashfusion");
        if (e.key === "2") setProject("ai-learning");
        if (e.key === "3") setProject("intinc");
        if (e.key === "r" || e.key === "R") setTone("raw");
        if (e.key === "t" || e.key === "T") setTone("technical");
        if (e.key === "f" || e.key === "F") setTone("reflective");
      }
      if ((e.metaKey||e.ctrlKey) && e.key==="Enter")        { e.preventDefault(); if (!loading && inputMode==="manual") handleGenerate(); }
      if ((e.metaKey||e.ctrlKey) && e.shiftKey && e.key==="C") { e.preventDefault(); reset(); }
      if ((e.metaKey||e.ctrlKey) && e.shiftKey && e.key==="L") { e.preventDefault(); if (output?.linkedin) copyToClipboard(output.linkedin,"LinkedIn"); }
      if ((e.metaKey||e.ctrlKey) && e.shiftKey && e.key==="X") { e.preventDefault(); if (output?.twitter) copyToClipboard(output.twitter,"X/Twitter"); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [loading, output, inputMode, copyToClipboard, fields, project, tone, driveSource]);

  // ── Phase 1: Drive search — returns 3 suggestions only ───────────────────
  const runDriveSearch = async () => {
    setDriveStatus("searching");
    setSuggestions([]); setSelectedIdx(null); setClarifiers([]); setClarifierStatus("idle");
    announce("Searching Google Drive...");

    const prompt = `You have access to Kyle's Google Drive. Search for recent files and documents.
Active project context: ${selectedProject.label}${searchHint ? `\nSearch focus: "${searchHint}"` : ""}

Search broadly — look at recently modified docs, session notes, build logs, planning docs. Return ONLY this exact JSON (no markdown, no extra text):
{"suggestions":[
  {"title":"exact file or doc name","summary":"one sentence: what this document actually contains","angle":"one sentence: why this specific content makes good building-in-public post material","type":"doc/sheet/note/other"},
  {"title":"...","summary":"...","angle":"...","type":"..."},
  {"title":"...","summary":"...","angle":"...","type":"..."}
]}`;

    try {
      let messages = [{ role: "user", content: prompt }];
      let finalText = null;
      for (let round = 0; round < 6; round++) {
        const data = await callAPI(messages, { maxTokens: 1500, mcpServers: [DRIVE_MCP] });
        const tb = data.content?.find(b => b.type === "text");
        if (tb && tb.text.includes('"suggestions"')) { finalText = tb.text; break; }
        const hasToolUse = data.content?.some(b => b.type==="tool_use" || b.type==="mcp_tool_use");
        if (hasToolUse || data.stop_reason==="tool_use") {
          messages.push({ role:"assistant", content: data.content });
          const results = (data.content||[])
            .filter(b => b.type==="tool_use"||b.type==="mcp_tool_use")
            .map(b => ({ type:"tool_result", tool_use_id:b.id, content:b.content||"executed" }));
          if (results.length) messages.push({ role:"user", content:results });
          continue;
        }
        if (tb && round < 4) {
          messages.push({ role:"assistant", content:data.content });
          messages.push({ role:"user", content:"Now respond with ONLY the JSON object described above." });
          continue;
        }
        break;
      }
      if (!finalText) throw new Error("No suggestions returned");
      const parsed = extractJSON(finalText);
      setSuggestions(parsed.suggestions || []);
      setDriveStatus("ready");
      announce(`Found ${parsed.suggestions?.length||0} Drive suggestions. Select one to generate specific clarifiers.`);
    } catch (err) {
      console.error(err);
      setDriveStatus("error");
      announce("Drive search failed.");
    }
  };

  // ── Phase 2: Generate clarifiers for the selected suggestion ─────────────
  const generateClarifiers = async (idx) => {
    const s = suggestions[idx];
    if (!s) return;
    setSelectedIdx(idx);
    setClarifierStatus("loading");
    setClarifiers([]);
    announce(`Loading clarifiers for "${s.title}"...`);

    const prompt = `Kyle selected a Google Drive document as source for a building-in-public post.

Document: "${s.title}"
Contains: ${s.summary}
Planned angle: ${s.angle}
Project context: ${selectedProject.label}

Generate exactly 4 clarifying questions specific to THIS document — not generic post questions. Make them concrete: ask about specific decisions made, what was unexpected, who the audience is for this insight, and what context is missing from the summary.

Respond ONLY with JSON: {"clarifiers":["Q1?","Q2?","Q3?","Q4?"]}`;

    try {
      const data = await callAPI([{ role:"user", content:prompt }], { maxTokens:400 });
      const raw = data.content?.find(b => b.type==="text")?.text || "";
      const parsed = extractJSON(raw);
      setClarifiers((parsed.clarifiers || []).map(q => ({ question:q, answer:"" })));
      setClarifierStatus("ready");
      announce("4 clarifiers ready. Answer them, then apply to fields.");
    } catch {
      setClarifierStatus("error");
      announce("Clarifier generation failed.");
    }
  };

  // ── Apply Drive suggestion → manual fields ────────────────────────────────
  const applySuggestion = () => {
    if (selectedIdx === null) return;
    const s = suggestions[selectedIdx];
    const answeredClarifiers = clarifiers.filter(c => c.answer.trim()).map(c => ({ q:c.question, a:c.answer }));
    setFields({ built: s.title, broke: "", learned: s.angle, next: "" });
    setDriveSource({ title:s.title, angle:s.angle, suggestion:s, clarifiers:answeredClarifiers });
    setInputMode("manual");
    setOutput(null);
    announce("Fields pre-filled from Drive suggestion. Now in Manual mode — review and generate.");
    setTimeout(() => firstFieldRef.current?.focus(), 100);
  };

  // ── Validate manual fields ────────────────────────────────────────────────
  const validate = () => {
    const errors = {};
    if (!fields.built.trim())               errors.built = "Required.";
    else if (fields.built.trim().length < 10) errors.built = "Too short — add more detail.";
    setFieldErrors(errors);
    return !Object.keys(errors).length;
  };

  // ── Generate posts ────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!validate()) { firstFieldRef.current?.focus(); return; }
    setLoading(true); setOutput(null);
    announce("Generating dispatch posts...");

    const ndaNote = !selectedProject.safe
      ? "CRITICAL NDA FILTER: strip all client names, org names, internal tool names, proprietary system names. Keep only the universal engineering pattern."
      : "";

    const filled = Object.entries(fields)
      .filter(([,v]) => v.trim())
      .map(([k,v]) => `${k.toUpperCase()}: ${v}`)
      .join("\n");

    // Structured Drive context — passed as clean JSON, not appended to fields
    const driveCtx = driveSource
      ? `\n\nDRIVE_SOURCE: "${driveSource.title}"\nSELECTED_ANGLE: "${driveSource.angle}"` +
        (driveSource.clarifiers?.length
          ? `\nCONTEXT_ANSWERS: ${driveSource.clarifiers.map(c=>`${c.q} → ${c.a}`).join(" | ")}`
          : "")
      : "";

    const prompt = `Write building-in-public posts for Kyle, a Staff Engineer and AI builder (AppSec, Platform, full-stack, AI tooling).

VOICE: ${TONE_MAP[tone]}
PROJECT: ${selectedProject.label}
${ndaNote}

CONTENT:
${filled}${driveCtx}

Generate TWO posts as JSON:

POST 1 — LINKEDIN
Target: 1,300–1,600 characters (optimal engagement zone per AuthoredUp 2026 analysis of 372k posts)
Hook: First 140 characters must stand alone — this is what mobile users see before "See More". Make it the sharpest line.
Structure: Hook → specific context → what you actually learned → one question
Opening: Start with an action, observation, or specific outcome. NEVER start with a pronoun or "Today" or "Excited" or "I".
Voice prohibitions: No "excited to share". No "today I learned". No "Spoiler:". No em-dashes as decoration. No humble-brag. No rhetorical questions as openers.
Close: ONE genuine, direct question that invites real replies from peers — not rhetorical.
Hashtags: Max 2, placed after the question on a new line, only if genuinely relevant.

POST 2 — X/TWITTER
HARD 270-character limit — count every character including spaces and punctuation.
Target: Aim for 100–200 characters where content allows (higher engagement at shorter lengths).
Format: Single punchy atomic observation. Can start mid-thought. No hashtags. No "thread below".

Respond ONLY with: {"linkedin":"...","twitter":"..."}`;

    try {
      const data = await callAPI([{ role:"user", content:prompt }], { maxTokens:1200 });
      const raw = data.content?.find(b => b.type==="text")?.text || "";
      const parsed = extractJSON(raw);

      // NDA scan on output
      if (!selectedProject.safe) {
        const combined = (parsed.linkedin||"") + " " + (parsed.twitter||"");
        const warnings = scanNDA(combined);
        if (warnings.length) parsed._ndaWarnings = warnings;
      }

      setOutput(parsed);
      const entry = {
        id: Date.now(),
        project: selectedProject.label, tone,
        built: fields.built.substring(0,55) + (fields.built.length>55?"...":""),
        linkedin: parsed.linkedin, twitter: parsed.twitter,
        ts: new Date().toLocaleTimeString(),
        fromDrive: driveSource ? driveSource.title.substring(0,40) : null
      };
      setHistory(h => [entry, ...h].slice(0,8));
      localStorage.removeItem("dispatch-draft");
      announce("Posts ready.");
      setTimeout(() => {
        outputRef.current?.focus();
        outputRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });
      }, 100);
    } catch {
      setOutput({ error:true, message:"Generation failed. Check connection and retry." });
    }
    setLoading(false);
  };

  const handleRegenerate = () => { if (!loading) handleGenerate(); };

  const reset = () => {
    setFields({ built:"", broke:"", learned:"", next:"" });
    setOutput(null); setFieldErrors({}); setDriveSource(null);
    // Also reset Drive state so stale results don't show on next visit
    setDriveStatus("idle"); setSuggestions([]); setSelectedIdx(null);
    setClarifiers([]); setClarifierStatus("idle"); setSearchHint("");
    localStorage.removeItem("dispatch-draft");
    setToast({ message:"Cleared", type:"info" });
    setTimeout(() => firstFieldRef.current?.focus(), 50);
  };

  // ── Style helpers ─────────────────────────────────────────────────────────
  const sLabel = { fontSize:"10px", color:"#4a3880", letterSpacing:"0.15em", textTransform:"uppercase", display:"block", marginBottom:"10px" };
  const fLabel = (err) => ({ fontSize:"10px", color: err ? "#ef4444" : "#6b5fa0", letterSpacing:"0.12em", textTransform:"uppercase", display:"block", marginBottom:"6px" });
  const ta = (val, err) => ({
    width:"100%", background:"#0f0f1c",
    border: err ? "1px solid rgba(239,68,68,0.5)" : val ? "1px solid #3d1f6e" : "1px solid #16122e",
    borderRadius:"3px", padding:"10px 14px", color:"#ddd6fe",
    fontSize:"13px", resize:"vertical", boxSizing:"border-box",
    fontFamily:"'Geist Mono', 'Courier New', monospace", lineHeight:"1.6", minHeight:"44px"
  });
  const inputStyle = (hasVal) => ({
    width:"100%", background:"#0f0f1c",
    border: hasVal ? "1px solid #3d1f6e" : "1px solid #16122e",
    borderRadius:"3px", padding:"10px 14px", color:"#ddd6fe",
    fontSize:"13px", boxSizing:"border-box",
    fontFamily:"'Geist Mono', 'Courier New', monospace", minHeight:"44px"
  });
  const spinner = (
    <span style={{ display:"inline-block", width:"10px", height:"10px",
      border:"2px solid #4a3880", borderTopColor:"#A855F7",
      borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;700&display=swap');
        @keyframes blink  {0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}
        @keyframes spin   {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .post-card{animation:fadeUp 0.25s ease forwards}
        .btn-hover:hover{opacity:0.75!important}
        .btn-mode:hover{background:rgba(168,85,247,0.04)!important}
        .btn-ctx:hover{border-color:rgba(168,85,247,0.3)!important;color:#a993e8!important}
        .btn-primary:hover:not(:disabled){filter:brightness(1.08)}
        *:focus-visible{outline:3px solid rgba(168,85,247,0.6)!important;outline-offset:2px!important}
        textarea:focus,input:focus{outline:3px solid rgba(168,85,247,0.5)!important;border-color:#A855F7!important}
        textarea::placeholder,input::placeholder{color:#2a1d4a}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#221840;border-radius:2px}
      `}</style>

      <a href="#main" style={{ position:"absolute",top:"-80px",left:"16px",background:"#A855F7",color:"#0B0B14",
        padding:"8px 16px",borderRadius:"3px",fontSize:"12px",fontFamily:"'Geist Mono', 'Courier New', monospace",
        fontWeight:"700",zIndex:10000,transition:"top 0.15s" }}
        onFocus={e=>{e.target.style.top="16px"}} onBlur={e=>{e.target.style.top="-80px"}}>
        Skip to main content
      </a>
      <div ref={liveRef} aria-live="assertive" aria-atomic="true"
        style={{position:"absolute",width:"1px",height:"1px",overflow:"hidden",clip:"rect(0,0,0,0)"}} />
      {toast && <Toast message={toast.message} type={toast.type} onDone={()=>setToast(null)} />}

      <div style={{ minHeight:"100vh", background:"#0B0B14", color:"#ede9fe", fontFamily:"'Geist', system-ui, sans-serif" }}>
        <div aria-hidden="true" style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,
          backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px)"}} />

        <div id="main" style={{ position:"relative",zIndex:1,maxWidth:"720px",margin:"0 auto",padding:"40px 20px 80px" }}>

          {/* ── Header ────────────────────────────────────────────── */}
          <header style={{ marginBottom:"32px", borderBottom:"1px solid #16122e", paddingBottom:"22px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"6px" }}>
              <div aria-hidden="true" style={{ width:"6px",height:"6px",borderRadius:"50%",background:"#A855F7",boxShadow:"0 0 10px #A855F7" }} />
              <span style={{ fontSize:"10px",letterSpacing:"0.2em",color:"#4a3880",textTransform:"uppercase" }}>DISPATCH // BUILDING IN PUBLIC</span>
            </div>
            <h1 style={{ fontSize:"28px",fontWeight:"400",margin:"0 0 3px",color:"#f5f0ff",letterSpacing:"-0.01em",fontFamily:"'Instrument Serif', Georgia, serif" }}>
              Kyle's Dispatch
              <span aria-hidden="true" style={{ display:"inline-block",width:"7px",height:"14px",background:"#A855F7",marginLeft:"3px",verticalAlign:"middle",animation:"blink 1s step-end infinite",boxShadow:"0 0 8px #A855F7" }} />
            </h1>
            <p style={{ fontSize:"11px",color:"#6b5fa0",margin:0,letterSpacing:"0.04em",fontFamily:"'Geist', system-ui, sans-serif" }}>What you built → LinkedIn + X, ready to post</p>
          </header>

          <main id="main-content">

            {/* ── Mode toggle ───────────────────────────────────── */}
            <div role="group" aria-label="Input mode" style={{ display:"flex",marginBottom:"28px",border:"1px solid #16122e",borderRadius:"3px",overflow:"hidden" }}>
              {[{id:"manual",label:"✏ Manual"},{id:"drive",label:"📂 From Drive"}].map((m,i)=>(
                <button key={m.id} type="button" onClick={()=>setInputMode(m.id)} aria-pressed={inputMode===m.id}
                  className="btn-mode"
                  style={{ ...BASE_BTN, flex:1, padding:"11px 16px", border:"none",
                    borderRight: i===0?"1px solid #16122e":"none",
                    background: inputMode===m.id ? "rgba(168,85,247,0.08)":"#0f0f1c",
                    color: inputMode===m.id ? "#A855F7":"#4a3880", fontSize:"12px" }}>
                  {m.label}
                </button>
              ))}
            </div>

            {/* Project + tone — always visible regardless of mode */}
            <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap", marginBottom:"24px",
              padding:"8px 14px", background:"#0f0f1c", border:"1px solid #16122e", borderRadius:"3px" }}>
              <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", flex:1 }}>
                {PROJECTS.map(p=>(
                  <button key={p.id} type="button" onClick={()=>setProject(p.id)} aria-pressed={project===p.id}
                    className="btn-ctx"
                    style={{ ...BASE_BTN, padding:"4px 10px", borderRadius:"2px", minHeight:"28px", fontSize:"11px",
                      border: project===p.id?"1px solid rgba(168,85,247,0.5)":"1px solid #16122e",
                      background: project===p.id?"rgba(168,85,247,0.06)":"transparent",
                      color: project===p.id?"#A855F7":"#6b5fa0" }}>
                    <span aria-hidden="true">{p.emoji}</span> {p.label}
                  </button>
                ))}
              </div>
              <div style={{ display:"flex", gap:"4px", flexShrink:0 }}>
                {TONES.map(t=>(
                  <button key={t.id} type="button" onClick={()=>setTone(t.id)} aria-pressed={tone===t.id}
                    className="btn-ctx"
                    style={{ ...BASE_BTN, padding:"4px 10px", borderRadius:"2px", minHeight:"28px", fontSize:"10px",
                      border: tone===t.id?"1px solid rgba(168,85,247,0.4)":"1px solid #16122e",
                      background: tone===t.id?"rgba(168,85,247,0.04)":"transparent",
                      color: tone===t.id?"#9333EA":"#6b5fa0" }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            {!selectedProject.safe && (
              <div role="status" style={{ marginBottom:"16px", padding:"8px 14px",
                background:"rgba(168,85,247,0.04)", border:"1px solid rgba(168,85,247,0.15)",
                borderRadius:"3px", fontSize:"11px", color:"#6b3fa0", letterSpacing:"0.03em" }}>
                ⚠ NDA filter active — client/org names stripped before generation. Output will be scanned.
              </div>
            )}

            <form onSubmit={e=>{e.preventDefault();handleGenerate();}} noValidate aria-label="Dispatch generator">

              {/* ════ DRIVE PANEL ═══════════════════════════════ */}
              {inputMode==="drive" && (
                <section aria-labelledby="drive-h">
                  <h2 id="drive-h" style={{...sLabel, marginBottom:"8px"}}>Search Google Drive</h2>
                  <p style={{ fontSize:"11px", color:"#4a3880", marginBottom:"16px", lineHeight:"1.5",
                    fontFamily:"'Geist', system-ui, sans-serif", textTransform:"none", letterSpacing:"normal" }}>
                    Claude will search your Drive for recent work related to the active project, suggest 3 relevant docs, then generate 4 post-specific clarifiers after you pick one.
                  </p>

                  {/* Search input + button */}
                  <div style={{ display:"flex", gap:"8px", marginBottom:"16px" }}>
                    <div style={{ flex:1 }}>
                      <label htmlFor="hint" style={fLabel(false)}>Search hint (optional)</label>
                      <input id="hint" type="text" value={searchHint} onChange={e=>setSearchHint(e.target.value)}
                        onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();runDriveSearch();}}}
                        placeholder='"this week", "Wix", "FlashFusion", "session notes"'
                        style={inputStyle(searchHint)} />
                    </div>
                    <div style={{ display:"flex", alignItems:"flex-end" }}>
                      <button type="button" onClick={runDriveSearch} disabled={driveStatus==="searching"}
                        style={{ ...BASE_BTN, padding:"0 20px", height:"44px", border:"none",
                          background: driveStatus==="searching"?"#16122e":"linear-gradient(135deg,#7C3AED,#A855F7)",
                          color: driveStatus==="searching"?"#4a3880":"#0B0B14",
                          fontSize:"12px", borderRadius:"3px", fontWeight:"700", whiteSpace:"nowrap" }}>
                        {driveStatus==="searching"
                          ? <span style={{ display:"flex", alignItems:"center", gap:"8px" }}>{spinner} SEARCHING</span>
                          : "SEARCH DRIVE"}
                      </button>
                    </div>
                  </div>

                  {/* Drive error */}
                  {driveStatus==="error" && (
                    <div role="alert" style={{ padding:"12px 14px", background:"rgba(239,68,68,0.05)",
                      border:"1px solid rgba(239,68,68,0.2)", borderRadius:"3px", marginBottom:"16px",
                      display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:"11px", color:"#f87171", fontFamily:"'Geist Mono', 'Courier New', monospace" }}>
                        ✗ Drive search failed — check Google Drive connection
                      </span>
                      <button type="button" onClick={runDriveSearch}
                        style={{ ...BASE_BTN, padding:"4px 12px", background:"transparent",
                          border:"1px solid rgba(239,68,68,0.3)", borderRadius:"3px",
                          color:"#f87171", fontSize:"10px", minHeight:"32px" }}>
                        RETRY
                      </button>
                    </div>
                  )}

                  {/* Suggestions — pick one to load its clarifiers */}
                  {driveStatus==="ready" && suggestions.length>0 && (
                    <>
                      <div style={{...sLabel, marginTop:"8px"}}>3 Suggestions — click one to load specific clarifiers</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginBottom:"24px" }}>
                        {suggestions.map((s,i)=>(
                          <SuggestionCard key={i} s={s} index={i}
                            selected={selectedIdx===i}
                            loading={clarifierStatus==="loading" && selectedIdx!==i}
                            onSelect={generateClarifiers} />
                        ))}
                      </div>

                      {/* Clarifiers — load after selection */}
                      {selectedIdx !== null && (
                        <div style={{ padding:"16px", background:"rgba(15,12,30,0.6)",
                          border:"1px solid #16122e", borderRadius:"3px", marginBottom:"20px" }}>
                          <div style={{...sLabel, marginBottom:"12px"}}>
                            Clarifiers for Option {selectedIdx+1}
                          </div>

                          {clarifierStatus==="loading" && (
                            <div style={{ display:"flex", alignItems:"center", gap:"10px",
                              fontSize:"11px", color:"#6b5fa0", fontFamily:"'Geist Mono', 'Courier New', monospace" }}>
                              {spinner} Generating clarifiers for this document...
                            </div>
                          )}
                          {clarifierStatus==="error" && (
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                              <span style={{ fontSize:"11px", color:"#f87171" }}>✗ Clarifier generation failed</span>
                              <button type="button" onClick={()=>generateClarifiers(selectedIdx)}
                                style={{ ...BASE_BTN, padding:"4px 12px", background:"transparent",
                                  border:"1px solid rgba(239,68,68,0.3)", borderRadius:"3px",
                                  color:"#f87171", fontSize:"10px", minHeight:"32px" }}>
                                RETRY
                              </button>
                            </div>
                          )}
                          {clarifierStatus==="ready" && (
                            <>
                              <div style={{ display:"flex", flexDirection:"column", gap:"12px", marginBottom:"16px" }}>
                                {clarifiers.map((c,i)=>(
                                  <div key={i}>
                                    <label htmlFor={`cl-${i}`} style={fLabel(false)}>{`${i+1}. ${c.question}`}</label>
                                    <input id={`cl-${i}`} type="text" value={c.answer}
                                      onChange={e=>setClarifiers(cs=>cs.map((x,j)=>j===i?{...x,answer:e.target.value}:x))}
                                      placeholder="Your answer..."
                                      style={inputStyle(c.answer)} />
                                  </div>
                                ))}
                              </div>
                              <button type="button" onClick={applySuggestion}
                                className="btn-primary"
                                style={{ ...BASE_BTN, width:"100%", padding:"12px", border:"none",
                                  background:"linear-gradient(135deg,#7C3AED,#A855F7)",
                                  color:"#0B0B14", fontSize:"12px", fontWeight:"700", borderRadius:"3px" }}>
                                APPLY OPTION {selectedIdx+1} → FILL MANUAL FIELDS
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </section>
              )}

              {/* ════ MANUAL PANEL ══════════════════════════════ */}
              {inputMode==="manual" && (
                <>
                  {/* Drive source badge — persistent after pre-fill */}
                  {driveSource && (
                    <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"18px",
                      padding:"8px 14px", background:"rgba(34,211,238,0.04)",
                      border:"1px solid rgba(34,211,238,0.15)", borderRadius:"3px" }}>
                      <span style={{ fontSize:"9px", color:"#22D3EE", letterSpacing:"0.1em",
                        textTransform:"uppercase", whiteSpace:"nowrap" }}>PRE-FILLED FROM DRIVE</span>
                      <span style={{ fontSize:"11px", color:"#8b7cc0", fontFamily:"'Geist', system-ui, sans-serif",
                        textTransform:"none", letterSpacing:"normal", overflow:"hidden",
                        textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {driveSource.title}
                      </span>
                      <button type="button" onClick={()=>setDriveSource(null)}
                        aria-label="Clear Drive source"
                        style={{ ...BASE_BTN, marginLeft:"auto", padding:"2px 8px", background:"transparent",
                          border:"1px solid rgba(34,211,238,0.2)", borderRadius:"2px",
                          color:"#22D3EE", fontSize:"9px", minHeight:"24px", flexShrink:0 }}>
                        CLEAR
                      </button>
                    </div>
                  )}

                  {/* Fields */}
                  <fieldset style={{ border:"none", padding:0, margin:"0 0 24px" }}>
                    <legend style={sLabel}>WHAT HAPPENED</legend>
                    <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                      {FIELDS.map(({key,label,placeholder,required},i)=>{
                        const err = fieldErrors[key];
                        return (
                          <div key={key}>
                            <label htmlFor={`f-${key}`} style={fLabel(err)}>
                              <span aria-hidden="true">&gt; </span>{label}
                              {required
                                ? <span aria-hidden="true" style={{ color:"#A855F7",marginLeft:"4px" }}>*</span>
                                : <span style={{ color:"#221840",marginLeft:"8px",fontSize:"9px" }}>OPTIONAL</span>}
                            </label>
                            <textarea id={`f-${key}`} ref={i===0?firstFieldRef:undefined}
                              value={fields[key]}
                              onChange={e=>{
                                setFields(f=>({...f,[key]:e.target.value}));
                                if(fieldErrors[key]) setFieldErrors(fe=>({...fe,[key]:null}));
                              }}
                              placeholder={placeholder} rows={2}
                              required={required} aria-required={required}
                              aria-describedby={err?`err-${key}`:undefined} aria-invalid={!!err}
                              style={ta(fields[key],err)} />
                            {err && <p id={`err-${key}`} role="alert" style={{ margin:"4px 0 0",fontSize:"10px",color:"#ef4444",letterSpacing:"0.04em",fontFamily:"'Geist Mono', 'Courier New', monospace" }}>✗ {err}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div style={{ display:"flex", gap:"10px", marginBottom:"32px" }}>
                    <button type="submit" disabled={loading}
                      className="btn-primary"
                      style={{ ...BASE_BTN, flex:1, padding:"14px", border:"none",
                        background: loading?"#16122e":"linear-gradient(135deg,#7C3AED,#A855F7)",
                        color: loading?"#4a3880":"#0B0B14",
                        fontSize:"13px", fontWeight:"700", borderRadius:"3px",
                        cursor: loading?"not-allowed":"pointer" }}>
                      {loading ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"10px"}}>{spinner} TRANSMITTING...</span> : "▶ GENERATE DISPATCH"}
                    </button>
                    <button type="button" onClick={reset} aria-label="Clear all fields"
                      className="btn-hover"
                      style={{ ...BASE_BTN, padding:"14px 18px", border:"1px solid #221840",
                        background:"transparent", color:"#a993e8", fontSize:"11px", borderRadius:"3px" }}>
                      CLR
                    </button>
                  </div>
                </>
              )}
            </form>

            {/* ── Output ──────────────────────────────────────── */}
            {output && !output.error && (
              <section aria-labelledby="out-h" ref={outputRef} tabIndex={-1} style={{outline:"none"}}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <span aria-hidden="true" style={{ color:"#A855F7" }}>●</span>
                    <h2 id="out-h" style={{ margin:0, fontSize:"10px", color:"#4a3880",
                      letterSpacing:"0.15em", textTransform:"uppercase",
                      fontFamily:"'Geist Mono', 'Courier New', monospace", fontWeight:"normal" }}>OUTPUT READY</h2>
                  </div>
                  <button type="button" onClick={handleRegenerate} disabled={loading}
                    aria-label="Regenerate with same inputs"
                    className="btn-hover"
                    style={{ ...BASE_BTN, padding:"6px 14px", border:"1px solid #16122e",
                      background:"transparent", color:"#6b5fa0", fontSize:"11px", borderRadius:"3px",
                      minHeight:"36px", cursor: loading?"not-allowed":"pointer" }}>
                    ↺ REGENERATE
                  </button>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                  <PostCard platform="LINKEDIN" content={output.linkedin} isLI={true}
                    onCopy={copyToClipboard}
                    ndaWarnings={output._ndaWarnings} />
                  <PostCard platform="X / TWITTER" content={output.twitter} isLI={false}
                    onCopy={copyToClipboard} />
                </div>
                <div style={{ marginTop:"10px", padding:"10px 14px",
                  background:"rgba(15,12,30,0.4)", border:"1px solid #16122e", borderRadius:"3px",
                  fontSize:"10px", color:"#4a3880", letterSpacing:"0.06em" }}>
                  Keys: ⌘⇧L / ⌘⇧X = copy · Adjust fields + regenerate for a different angle
                </div>
              </section>
            )}

            {/* Generate error */}
            {output?.error && (
              <div role="alert" style={{ padding:"16px", borderRadius:"3px",
                background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.2)",
                display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ color:"#f87171", fontSize:"12px", fontFamily:"'Geist Mono', 'Courier New', monospace",
                  letterSpacing:"0.05em" }}>✗ {output.message}</span>
                <button type="button" onClick={handleGenerate} disabled={loading}
                  style={{ ...BASE_BTN, padding:"6px 14px", background:"transparent",
                    border:"1px solid rgba(239,68,68,0.3)", borderRadius:"3px",
                    color:"#f87171", fontSize:"11px", minHeight:"36px" }}>
                  RETRY
                </button>
              </div>
            )}

            {/* ── Session history ──────────────────────────────── */}
            {history.length>0 && (
              <section aria-labelledby="hist-h" style={{ marginTop:"44px" }}>
                <div style={{ display:"flex", alignItems:"baseline", gap:"12px", marginBottom:"10px" }}>
                  <h2 id="hist-h" style={{...sLabel, margin:0}}>SESSION HISTORY</h2>
                  <span style={{ fontSize:"9px", color:"#221840", fontFamily:"'Geist Mono', 'Courier New', monospace",
                    letterSpacing:"0.06em", textTransform:"uppercase" }}>
                    {history.length} entries · persists across reloads
                  </span>
                </div>
                <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:"6px" }}>
                  {history.map(h=>(
                    <li key={h.id} style={{ padding:"10px 14px", background:"#0f0f1c",
                      border:"1px solid #16122e", borderRadius:"3px",
                      display:"flex", justifyContent:"space-between", alignItems:"center", gap:"12px" }}>
                      <div style={{ minWidth:0, flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"2px" }}>
                          <span style={{ fontSize:"10px", color:"#A855F7", letterSpacing:"0.08em" }}>{h.project}</span>
                          <span style={{ fontSize:"9px", color:"#221840" }}>·</span>
                          <span style={{ fontSize:"9px", color:"#4a3880", letterSpacing:"0.06em" }}>{h.tone}</span>
                          {h.fromDrive && <span style={{ fontSize:"9px", color:"#22D3EE", letterSpacing:"0.05em" }}>· 📂 {h.fromDrive}</span>}
                        </div>
                        <span style={{ fontSize:"11px", color:"#6b5fa0", fontFamily:"'Geist Mono', 'Courier New', monospace",
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block" }}>
                          {h.built}
                        </span>
                      </div>
                      <div style={{ display:"flex", gap:"6px", flexShrink:0 }}>
                        {[["LI",h.linkedin,"LinkedIn"],["X",h.twitter,"X/Twitter"]].map(([lbl,txt,full])=>(
                          <button key={lbl} onClick={()=>copyToClipboard(txt,full)}
                            aria-label={`Copy ${full} from ${h.ts}`}
                            style={{ ...BASE_BTN, padding:"4px 8px", background:"transparent",
                              border:"1px solid #16122e", borderRadius:"3px", color:"#4a3880",
                              fontSize:"9px", minHeight:"36px", minWidth:"36px" }}>
                            {lbl}
                          </button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </main>

          <footer style={{ marginTop:"60px", paddingTop:"20px", borderTop:"1px solid #0d0b20",
            display:"flex", justifyContent:"space-between",
            fontSize:"10px", color:"#16122e", letterSpacing:"0.1em" }}>
            <span>DISPATCH v5.0 — LI 1,300–1,900 optimal · X target 270</span>
            <span>KYLE // BUILDING IN PUBLIC</span>
          </footer>
        </div>
      </div>
    </>
  );
}

