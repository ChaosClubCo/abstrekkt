import { useState, useEffect, useRef, useCallback } from "react";

const PROJECTS = [
  { id: "flashfusion", label: "FlashFusion", emoji: "⚡", safe: true },
  { id: "ai-learning", label: "AI / Tooling", emoji: "🧠", safe: true },
  { id: "intinc", label: "Intinc (NDA)", emoji: "🔒", safe: false },
];

const TONES = [
  { id: "raw", label: "Raw / Real" },
  { id: "technical", label: "Technical" },
  { id: "reflective", label: "Reflective" },
];

const FIELDS = [
  { key: "built", label: "What I built / did", placeholder: "e.g. Mapped 7 buyer personas to Wix store collections...", required: true },
  { key: "broke", label: "What broke or was hard", placeholder: "e.g. updateDeliveryCarrier API silently rejects appId...", required: false },
  { key: "learned", label: "What I actually learned", placeholder: "e.g. Wix V1 Catalog has completely different API surface...", required: false },
  { key: "next", label: "What's next", placeholder: "e.g. Manual shipping config — no REST endpoints...", required: false },
];

const TONE_MAP = {
  raw: "Direct, honest, like a senior engineer texting a peer. Short punchy sentences. No spin.",
  technical: "Technically precise. Specific tool names, API behavior, architecture decisions.",
  reflective: "Thoughtful, connects technical work to a broader pattern. Still direct, not preachy."
};

const DRIVE_MCP = { type: "url", url: "https://drivemcp.googleapis.com/mcp/v1", name: "google-drive" };

const BASE_BTN = {
  fontFamily: "'Courier New', monospace",
  cursor: "pointer",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  minHeight: "44px",
  transition: "all 0.15s",
};

function Toast({ message, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, [onDone]);
  const c = {
    success: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", text: "#34d399" },
    error: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", text: "#f87171" },
    info: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", text: "#fbbf24" },
  }[type] || {};
  return (
    <div role="status" aria-live="polite" aria-atomic="true" style={{
      position: "fixed", bottom: "24px", right: "24px",
      padding: "10px 16px", borderRadius: "4px",
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      fontSize: "12px", fontFamily: "'Courier New', monospace",
      letterSpacing: "0.06em", zIndex: 9999,
      animation: "slideIn 0.2s ease", maxWidth: "300px"
    }}>{message}</div>
  );
}

function SuggestionCard({ s, index, selected, onSelect }) {
  return (
    <button type="button" onClick={() => onSelect(index)} aria-pressed={selected}
      style={{
        width: "100%", textAlign: "left", display: "block",
        padding: "14px 16px",
        background: selected ? "rgba(245,158,11,0.06)" : "#080c10",
        border: selected ? "1px solid rgba(245,158,11,0.5)" : "1px solid #0e1a26",
        borderRadius: "3px", cursor: "pointer",
        fontFamily: "'Courier New', monospace", transition: "all 0.15s",
        minHeight: "auto"
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <span style={{ fontSize: "10px", color: selected ? "#f59e0b" : "#2a4a6a", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {selected ? "✓ SELECTED" : `OPTION ${index + 1}`}
        </span>
        <span style={{ fontSize: "10px", color: "#1e2d40", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.type || "doc"}</span>
      </div>
      <p style={{ margin: "0 0 4px", fontSize: "13px", color: selected ? "#e8f0f8" : "#8aa4bc", fontFamily: "system-ui, sans-serif", lineHeight: "1.4", textTransform: "none", letterSpacing: "normal" }}>
        {s.title}
      </p>
      <p style={{ margin: 0, fontSize: "11px", color: "#3a5a7a", fontFamily: "'Courier New', monospace", lineHeight: "1.5", textTransform: "none", letterSpacing: "normal" }}>
        {s.angle}
      </p>
    </button>
  );
}

function PostCard({ platform, content, charCount, limit, onCopy }) {
  return (
    <article aria-label={`${platform} post`} className="post-card"
      style={{ background: "#080c10", border: "1px solid #0e1a26", borderRadius: "3px", padding: "20px", borderLeft: "2px solid rgba(245,158,11,0.4)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <h3 style={{ margin: 0, fontSize: "10px", color: "#f59e0b", letterSpacing: "0.15em", fontFamily: "'Courier New', monospace", textTransform: "uppercase" }}>{platform}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "10px", color: charCount > limit ? "#ef4444" : "#2a4a6a", fontFamily: "'Courier New', monospace" }}>{charCount}/{limit}</span>
          <button onClick={() => onCopy(content, platform)} aria-label={`Copy ${platform} post`}
            style={{ ...BASE_BTN, padding: "5px 12px", borderRadius: "3px", border: "1px solid #1e2d40", background: "transparent", color: "#64748b", fontSize: "11px", minHeight: "36px" }}>
            COPY
          </button>
        </div>
      </div>
      <p style={{ fontSize: "14px", lineHeight: "1.75", color: "#8aa4bc", margin: 0, whiteSpace: "pre-wrap", fontFamily: "system-ui, sans-serif" }}>{content}</p>
    </article>
  );
}

export default function Dispatch() {
  const [inputMode, setInputMode] = useState("manual");
  const [project, setProject] = useState("ai-learning");
  const [tone, setTone] = useState("raw");
  const [fields, setFields] = useState({ built: "", broke: "", learned: "", next: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [history, setHistory] = useState([]);

  const [searchHint, setSearchHint] = useState("");
  const [driveStatus, setDriveStatus] = useState("idle");
  const [suggestions, setSuggestions] = useState([]);
  const [clarifiers, setClarifiers] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const firstFieldRef = useRef(null);
  const outputRef = useRef(null);
  const liveRef = useRef(null);
  const selectedProject = PROJECTS.find(p => p.id === project);

  useEffect(() => {
    const saved = localStorage.getItem("dispatch-draft");
    if (saved) { try { setFields(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    if (Object.values(fields).some(v => v)) localStorage.setItem("dispatch-draft", JSON.stringify(fields));
  }, [fields]);

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

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.matches("textarea, input")) {
        if (e.key === "1") setProject("flashfusion");
        if (e.key === "2") setProject("ai-learning");
        if (e.key === "3") setProject("intinc");
        if (e.key === "r" || e.key === "R") setTone("raw");
        if (e.key === "t" || e.key === "T") setTone("technical");
        if (e.key === "f" || e.key === "F") setTone("reflective");
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); if (!loading && inputMode === "manual") handleGenerate(); }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "C") { e.preventDefault(); reset(); }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "L") { e.preventDefault(); if (output?.linkedin) copyToClipboard(output.linkedin, "LinkedIn"); }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "X") { e.preventDefault(); if (output?.twitter) copyToClipboard(output.twitter, "X/Twitter"); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [loading, output, inputMode, copyToClipboard]);

  const runDriveSearch = async () => {
    setDriveStatus("searching");
    setSuggestions([]);
    setClarifiers([]);
    setSelectedSuggestion(null);
    announce("Searching Google Drive...");

    const prompt = `You have access to Kyle's Google Drive. Search for recent files and documents related to his work: FlashFusion AI consultancy, AI tooling experiments, software builds, session notes, or any recent work documents.${searchHint ? ` Focus on: "${searchHint}".` : ""}

Search the drive, then respond ONLY with this exact JSON (no markdown, no fences, no extra text):
{"suggestions":[{"title":"exact file name","summary":"one sentence what this doc contains","angle":"one sentence why this makes good building-in-public content","type":"doc/sheet/note"},{"title":"...","summary":"...","angle":"...","type":"..."},{"title":"...","summary":"...","angle":"...","type":"..."}],"clarifiers":["Question 1?","Question 2?","Question 3?","Question 4?"]}`;

    try {
      let messages = [{ role: "user", content: prompt }];
      let finalText = null;

      for (let round = 0; round < 6; round++) {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000, messages, mcp_servers: [DRIVE_MCP] })
        });
        const data = await res.json();

        const textBlock = data.content?.find(b => b.type === "text");
        if (textBlock && textBlock.text.includes('"suggestions"')) { finalText = textBlock.text; break; }

        const hasToolUse = data.content?.some(b => b.type === "tool_use" || b.type === "mcp_tool_use");
        if (hasToolUse || data.stop_reason === "tool_use") {
          messages.push({ role: "assistant", content: data.content });
          const results = (data.content || [])
            .filter(b => b.type === "tool_use" || b.type === "mcp_tool_use")
            .map(b => ({ type: "tool_result", tool_use_id: b.id, content: b.content || "executed" }));
          if (results.length > 0) messages.push({ role: "user", content: results });
          continue;
        }

        if (textBlock && round < 4) {
          messages.push({ role: "assistant", content: data.content });
          messages.push({ role: "user", content: "Now respond with only the JSON object. No other text." });
          continue;
        }
        break;
      }

      if (!finalText) throw new Error("No JSON returned");
      const clean = finalText.replace(/```json|```/g, "").trim();
      const start = clean.indexOf("{"), end = clean.lastIndexOf("}");
      const parsed = JSON.parse(clean.substring(start, end + 1));
      setSuggestions(parsed.suggestions || []);
      setClarifiers((parsed.clarifiers || []).map(q => ({ question: q, answer: "" })));
      setDriveStatus("ready");
      announce(`Found ${parsed.suggestions?.length || 0} Drive suggestions. Answer clarifiers below.`);
    } catch (err) {
      console.error(err);
      setDriveStatus("error");
      announce("Drive search failed.");
    }
  };

  const applySuggestion = (idx) => {
    const s = suggestions[idx];
    if (!s) return;
    const ctx = clarifiers.filter(c => c.answer.trim()).map(c => `${c.question} → ${c.answer}`).join(". ");
    setFields({ built: `${s.title} — ${s.summary}`, broke: "", learned: s.angle + (ctx ? `. ${ctx}` : ""), next: "" });
    setInputMode("manual");
    setOutput(null);
    setToast({ message: "Fields pre-filled. Review then generate.", type: "info" });
    announce("Fields pre-filled from Drive suggestion.");
    setTimeout(() => firstFieldRef.current?.focus(), 100);
  };

  const validate = () => {
    const errors = {};
    if (!fields.built.trim()) errors.built = "Required.";
    else if (fields.built.trim().length < 10) errors.built = "Too short.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validate()) { firstFieldRef.current?.focus(); return; }
    setLoading(true); setOutput(null);
    announce("Generating dispatch posts...");
    const ndaNote = !selectedProject.safe ? "CRITICAL NDA: strip all client names, org names, internal tools, proprietary systems. Keep only the universal engineering pattern." : "";
    const filled = Object.entries(fields).filter(([, v]) => v.trim()).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join("\n");
    const prompt = `Write building-in-public posts for Kyle, a Staff Engineer and AI builder (AppSec, Platform, full-stack, AI tooling).
VOICE: ${TONE_MAP[tone]}
RULES: No motivational filler. No humble-brag. No "excited to share". Write like a human. ${ndaNote}
Project: ${selectedProject.label}
${filled}

Generate TWO posts.
POST 1 — LINKEDIN (max 150 words, end with ONE genuine question, max 2 hashtags, do NOT start with "I")
POST 2 — X/TWITTER (HARD 270 char limit, no hashtags, sharpest punchy line)
Respond ONLY with: {"linkedin":"...","twitter":"..."}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      const raw = data.content?.find(b => b.type === "text")?.text || "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setOutput(parsed);
      setHistory(h => [{ id: Date.now(), project: selectedProject.label, tone, built: fields.built.substring(0, 55) + (fields.built.length > 55 ? "..." : ""), linkedin: parsed.linkedin, twitter: parsed.twitter, ts: new Date().toLocaleTimeString() }, ...h].slice(0, 5));
      localStorage.removeItem("dispatch-draft");
      announce("Posts ready.");
      setTimeout(() => outputRef.current?.focus(), 100);
    } catch {
      setOutput({ error: true, message: "Generation failed. Retry." });
    }
    setLoading(false);
  };

  const reset = () => {
    setFields({ built: "", broke: "", learned: "", next: "" });
    setOutput(null); setFieldErrors({});
    localStorage.removeItem("dispatch-draft");
    setToast({ message: "Cleared", type: "info" });
    setTimeout(() => firstFieldRef.current?.focus(), 50);
  };

  const chipStyle = (active) => ({
    ...BASE_BTN, padding: "8px 14px", borderRadius: "3px",
    border: active ? "1px solid #f59e0b" : "1px solid #0e1a26",
    background: active ? "rgba(245,158,11,0.08)" : "rgba(14,26,38,0.4)",
    color: active ? "#f59e0b" : "#3a5a7a", fontSize: "12px",
  });

  const sLabel = { fontSize: "10px", color: "#2a4a6a", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "10px" };
  const fieldLabel = (err) => ({ fontSize: "10px", color: err ? "#ef4444" : "#3a5a7a", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: "6px" });
  const taStyle = (val, err) => ({
    width: "100%", background: "#080c10",
    border: err ? "1px solid rgba(239,68,68,0.5)" : val ? "1px solid #1e3a5a" : "1px solid #0e1a26",
    borderRadius: "3px", padding: "10px 14px", color: "#a0b8cc",
    fontSize: "13px", resize: "vertical", boxSizing: "border-box",
    fontFamily: "'Courier New', monospace", lineHeight: "1.6", minHeight: "44px"
  });

  return (
    <>
      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .post-card{animation:fadeUp 0.25s ease forwards}
        *:focus-visible{outline:3px solid rgba(245,158,11,0.6)!important;outline-offset:2px!important}
        textarea:focus{outline:3px solid rgba(245,158,11,0.5)!important;border-color:#f59e0b!important}
        textarea::placeholder,input::placeholder{color:#1a2a3a}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#1e2d40;border-radius:2px}
      `}</style>

      <a href="#main" style={{ position:"absolute",top:"-80px",left:"16px",background:"#f59e0b",color:"#060a0e",padding:"8px 16px",borderRadius:"3px",fontSize:"12px",fontFamily:"'Courier New',monospace",fontWeight:"700",zIndex:10000,transition:"top 0.15s" }}
        onFocus={e=>{e.target.style.top="16px"}} onBlur={e=>{e.target.style.top="-80px"}}>
        Skip to main content
      </a>

      <div ref={liveRef} aria-live="assertive" aria-atomic="true" style={{position:"absolute",width:"1px",height:"1px",overflow:"hidden",clip:"rect(0,0,0,0)"}} />
      {toast && <Toast message={toast.message} type={toast.type} onDone={()=>setToast(null)} />}

      <div style={{ minHeight:"100vh", background:"#060a0e", color:"#c9d5e0", fontFamily:"'Courier New',Courier,monospace" }}>
        <div aria-hidden="true" style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px)"}} />

        <div id="main" style={{ position:"relative",zIndex:1,maxWidth:"720px",margin:"0 auto",padding:"40px 20px 80px" }}>

          {/* Header */}
          <header style={{ marginBottom:"32px", borderBottom:"1px solid #0e1a26", paddingBottom:"22px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"6px" }}>
              <div aria-hidden="true" style={{ width:"6px",height:"6px",borderRadius:"50%",background:"#f59e0b",boxShadow:"0 0 10px #f59e0b" }} />
              <span style={{ fontSize:"10px",letterSpacing:"0.2em",color:"#2a4a6a",textTransform:"uppercase" }}>DISPATCH // BUILDING IN PUBLIC</span>
            </div>
            <h1 style={{ fontSize:"26px",fontWeight:"700",margin:"0 0 3px",color:"#e8f0f8",letterSpacing:"-0.02em" }}>
              Kyle's Dispatch
              <span aria-hidden="true" style={{ display:"inline-block",width:"7px",height:"14px",background:"#f59e0b",marginLeft:"3px",verticalAlign:"middle",animation:"blink 1s step-end infinite" }} />
            </h1>
            <p style={{ fontSize:"11px",color:"#2a4a6a",margin:0,letterSpacing:"0.04em" }}>What you built → LinkedIn + X, ready to post</p>
          </header>

          <main id="main-content">
            {/* Mode toggle */}
            <div role="group" aria-label="Input mode" style={{ display:"flex",marginBottom:"28px",border:"1px solid #0e1a26",borderRadius:"3px",overflow:"hidden" }}>
              {[{id:"manual",label:"✏  Manual"},{id:"drive",label:"📂  From Drive"}].map((m,i)=>(
                <button key={m.id} type="button" onClick={()=>setInputMode(m.id)} aria-pressed={inputMode===m.id}
                  style={{ ...BASE_BTN, flex:1, padding:"11px 16px", border:"none",
                    borderRight: i===0?"1px solid #0e1a26":"none",
                    background: inputMode===m.id ? "rgba(245,158,11,0.08)":"#080c10",
                    color: inputMode===m.id ? "#f59e0b":"#2a4a6a", fontSize:"12px" }}>
                  {m.label}
                </button>
              ))}
            </div>

            <form onSubmit={e=>{e.preventDefault();handleGenerate();}} noValidate aria-label="Dispatch generator">

              {/* DRIVE PANEL */}
              {inputMode==="drive" && (
                <section aria-labelledby="drive-h" style={{ marginBottom:"28px" }}>
                  <h2 id="drive-h" style={sLabel}>Search Google Drive</h2>

                  <div style={{ display:"flex",gap:"8px",marginBottom:"16px" }}>
                    <div style={{ flex:1 }}>
                      <label htmlFor="hint" style={fieldLabel(false)}>Search hint (optional)</label>
                      <input id="hint" type="text" value={searchHint} onChange={e=>setSearchHint(e.target.value)}
                        onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();runDriveSearch();}}}
                        placeholder='"this week", "Wix", "FlashFusion", "session notes"'
                        style={{ width:"100%",background:"#080c10",border:"1px solid #0e1a26",borderRadius:"3px",padding:"10px 14px",color:"#a0b8cc",fontSize:"13px",boxSizing:"border-box",fontFamily:"'Courier New',monospace",minHeight:"44px" }} />
                    </div>
                    <div style={{ display:"flex",alignItems:"flex-end" }}>
                      <button type="button" onClick={runDriveSearch} disabled={driveStatus==="searching"}
                        style={{ ...BASE_BTN, padding:"0 20px", height:"44px", border:"none",
                          background: driveStatus==="searching"?"#0e1a26":"linear-gradient(135deg,#b45309,#f59e0b)",
                          color: driveStatus==="searching"?"#2a4a6a":"#060a0e",
                          fontSize:"12px", borderRadius:"3px", fontWeight:"700", whiteSpace:"nowrap" }}>
                        {driveStatus==="searching"
                          ? <span style={{ display:"flex",alignItems:"center",gap:"8px" }}>
                              <span style={{ display:"inline-block",width:"10px",height:"10px",border:"2px solid #2a4a6a",borderTopColor:"#f59e0b",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />
                              SEARCHING
                            </span>
                          : "SEARCH DRIVE"}
                      </button>
                    </div>
                  </div>

                  {driveStatus==="error" && (
                    <div role="alert" style={{ padding:"12px 14px",background:"rgba(239,68,68,0.05)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:"3px",fontSize:"11px",color:"#f87171",fontFamily:"'Courier New',monospace",marginBottom:"16px" }}>
                      ✗ Drive search failed — check Google Drive connection and retry.
                    </div>
                  )}

                  {driveStatus==="ready" && suggestions.length>0 && (
                    <>
                      <div style={{ ...sLabel, marginTop:"8px" }}>3 Suggestions — pick one</div>
                      <div style={{ display:"flex",flexDirection:"column",gap:"8px",marginBottom:"24px" }}>
                        {suggestions.map((s,i)=>(
                          <SuggestionCard key={i} s={s} index={i} selected={selectedSuggestion===i} onSelect={setSelectedSuggestion} />
                        ))}
                      </div>

                      <div style={sLabel}>4 Clarifiers — answer to sharpen the post</div>
                      <div style={{ display:"flex",flexDirection:"column",gap:"14px",marginBottom:"20px" }}>
                        {clarifiers.map((c,i)=>(
                          <div key={i}>
                            <label htmlFor={`cl-${i}`} style={fieldLabel(false)}>{`${i+1}. ${c.question}`}</label>
                            <input id={`cl-${i}`} type="text" value={c.answer}
                              onChange={e=>setClarifiers(cs=>cs.map((x,j)=>j===i?{...x,answer:e.target.value}:x))}
                              placeholder="Your answer..."
                              style={{ width:"100%",background:"#080c10",border:c.answer?"1px solid #1e3a5a":"1px solid #0e1a26",borderRadius:"3px",padding:"9px 14px",color:"#a0b8cc",fontSize:"13px",boxSizing:"border-box",fontFamily:"'Courier New',monospace",minHeight:"44px" }} />
                          </div>
                        ))}
                      </div>

                      <button type="button"
                        onClick={()=>selectedSuggestion!==null?applySuggestion(selectedSuggestion):setToast({message:"Select a suggestion first",type:"info"})}
                        style={{ ...BASE_BTN, width:"100%", padding:"12px",
                          background: selectedSuggestion!==null?"rgba(245,158,11,0.1)":"rgba(14,26,38,0.4)",
                          border: selectedSuggestion!==null?"1px solid rgba(245,158,11,0.4)":"1px solid #0e1a26",
                          borderRadius:"3px",
                          color: selectedSuggestion!==null?"#f59e0b":"#2a4a6a",
                          fontSize:"12px", fontWeight:"700" }}>
                        {selectedSuggestion!==null
                          ? `USE OPTION ${selectedSuggestion+1} → FILL FIELDS`
                          : "SELECT A SUGGESTION ABOVE FIRST"}
                      </button>
                    </>
                  )}
                </section>
              )}

              {/* MANUAL PANEL */}
              {inputMode==="manual" && (
                <>
                  <fieldset style={{ border:"none",padding:0,margin:"0 0 24px" }}>
                    <legend style={sLabel}>01 / PROJECT</legend>
                    <div style={{ display:"flex",gap:"8px",flexWrap:"wrap" }}>
                      {PROJECTS.map((p,i)=>(
                        <button key={p.id} type="button" onClick={()=>setProject(p.id)} aria-pressed={project===p.id} title={`Press ${i+1}`} style={chipStyle(project===p.id)}>
                          <span aria-hidden="true">{p.emoji}</span> {p.label}
                        </button>
                      ))}
                    </div>
                    {!selectedProject.safe && (
                      <div role="alert" style={{ marginTop:"8px",padding:"8px 12px",background:"rgba(245,158,11,0.04)",border:"1px solid rgba(245,158,11,0.12)",borderRadius:"3px",fontSize:"11px",color:"#8a6a2a",letterSpacing:"0.03em" }}>
                        ⚠ NDA filter active — client names, org names, proprietary systems stripped before generation
                      </div>
                    )}
                  </fieldset>

                  <fieldset style={{ border:"none",padding:0,margin:"0 0 24px" }}>
                    <legend style={sLabel}>02 / VOICE</legend>
                    <div style={{ display:"flex",gap:"8px" }}>
                      {TONES.map(t=>(
                        <button key={t.id} type="button" onClick={()=>setTone(t.id)} aria-pressed={tone===t.id}
                          style={{ ...BASE_BTN, padding:"7px 14px", borderRadius:"3px",
                            border: tone===t.id?"1px solid rgba(245,158,11,0.5)":"1px solid #0e1a26",
                            background: tone===t.id?"rgba(245,158,11,0.05)":"transparent",
                            color: tone===t.id?"#c07a20":"#2a4a6a", fontSize:"11px" }}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset style={{ border:"none",padding:0,margin:"0 0 24px" }}>
                    <legend style={sLabel}>03 / WHAT HAPPENED</legend>
                    <div style={{ display:"flex",flexDirection:"column",gap:"14px" }}>
                      {FIELDS.map(({key,label,placeholder,required},i)=>{
                        const err=fieldErrors[key];
                        return (
                          <div key={key}>
                            <label htmlFor={`f-${key}`} style={fieldLabel(err)}>
                              &gt; {label}
                              {required ? <span aria-hidden="true" style={{ color:"#f59e0b",marginLeft:"4px" }}>*</span>
                                : <span style={{ color:"#1e2d40",marginLeft:"8px",fontSize:"9px" }}>OPTIONAL</span>}
                            </label>
                            <textarea id={`f-${key}`} ref={i===0?firstFieldRef:undefined}
                              value={fields[key]}
                              onChange={e=>{setFields(f=>({...f,[key]:e.target.value}));if(fieldErrors[key])setFieldErrors(fe=>({...fe,[key]:null}));}}
                              placeholder={placeholder} rows={2}
                              required={required} aria-required={required}
                              aria-describedby={err?`err-${key}`:undefined} aria-invalid={!!err}
                              style={taStyle(fields[key],err)} />
                            {err && <p id={`err-${key}`} role="alert" style={{ margin:"4px 0 0",fontSize:"10px",color:"#ef4444",letterSpacing:"0.04em",fontFamily:"'Courier New',monospace" }}>✗ {err}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div style={{ display:"flex",gap:"10px",marginBottom:"32px" }}>
                    <button type="submit" disabled={loading} style={{ ...BASE_BTN, flex:1, padding:"14px", border:"none",
                      background: loading?"#0e1a26":"linear-gradient(135deg,#b45309,#f59e0b)",
                      color: loading?"#2a4a6a":"#060a0e",
                      fontSize:"13px", fontWeight:"700", borderRadius:"3px" }}>
                      {loading ? "TRANSMITTING..." : "▶ GENERATE DISPATCH"}
                    </button>
                    <button type="button" onClick={reset} aria-label="Clear all fields"
                      style={{ ...BASE_BTN, padding:"14px 18px", border:"1px solid #0e1a26", background:"transparent", color:"#2a4a6a", fontSize:"11px", borderRadius:"3px" }}>
                      CLR
                    </button>
                  </div>
                </>
              )}
            </form>

            {/* Output */}
            {output && !output.error && (
              <section aria-labelledby="out-h" ref={outputRef} tabIndex={-1} style={{ outline:"none" }}>
                <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"14px" }}>
                  <span aria-hidden="true" style={{ color:"#f59e0b" }}>●</span>
                  <h2 id="out-h" style={{ margin:0,fontSize:"10px",color:"#2a4a6a",letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"'Courier New',monospace",fontWeight:"normal" }}>OUTPUT READY</h2>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:"14px" }}>
                  <PostCard platform="LINKEDIN" content={output.linkedin} charCount={output.linkedin?.length||0} limit={700} onCopy={copyToClipboard} />
                  <PostCard platform="X / TWITTER" content={output.twitter} charCount={output.twitter?.length||0} limit={280} onCopy={copyToClipboard} />
                </div>
                <div style={{ marginTop:"10px",padding:"10px 14px",background:"rgba(14,26,38,0.4)",border:"1px solid #0e1a26",borderRadius:"3px",fontSize:"10px",color:"#2a4a6a",letterSpacing:"0.06em" }}>
                  Tip: Adjust "What I learned" → regenerate for a different angle. NDA content — scan output before posting.
                </div>
              </section>
            )}
            {output?.error && (
              <div role="alert" style={{ padding:"16px",borderRadius:"3px",background:"rgba(239,68,68,0.05)",border:"1px solid rgba(239,68,68,0.2)",color:"#f87171",fontSize:"12px",fontFamily:"'Courier New',monospace",letterSpacing:"0.05em" }}>
                ✗ {output.message}
              </div>
            )}

            {/* History */}
            {history.length>0 && (
              <section aria-labelledby="hist-h" style={{ marginTop:"44px" }}>
                <h2 id="hist-h" style={{ ...sLabel, marginBottom:"10px" }}>SESSION HISTORY ({history.length})</h2>
                <ul style={{ listStyle:"none",margin:0,padding:0,display:"flex",flexDirection:"column",gap:"6px" }}>
                  {history.map(h=>(
                    <li key={h.id} style={{ padding:"10px 14px",background:"#080c10",border:"1px solid #0e1a26",borderRadius:"3px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px" }}>
                      <div style={{ minWidth:0 }}>
                        <span style={{ fontSize:"10px",color:"#f59e0b",letterSpacing:"0.08em",marginRight:"8px" }}>{h.project}</span>
                        <span style={{ fontSize:"11px",color:"#3a5a7a",fontFamily:"'Courier New',monospace" }}>{h.built}</span>
                      </div>
                      <div style={{ display:"flex",gap:"6px",flexShrink:0 }}>
                        {[["LI",h.linkedin,"LinkedIn"],["X",h.twitter,"X/Twitter"]].map(([lbl,txt,full])=>(
                          <button key={lbl} onClick={()=>copyToClipboard(txt,full)} aria-label={`Copy ${full} from ${h.ts}`}
                            style={{ ...BASE_BTN,padding:"4px 8px",background:"transparent",border:"1px solid #0e1a26",borderRadius:"3px",color:"#2a4a6a",fontSize:"9px",minHeight:"36px",minWidth:"36px" }}>
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

          <footer style={{ marginTop:"60px",paddingTop:"20px",borderTop:"1px solid #0a1420",display:"flex",justifyContent:"space-between",fontSize:"10px",color:"#0e1a26",letterSpacing:"0.1em" }}>
            <span>DISPATCH v3.0 — WCAG 2.2 AA</span>
            <span>KYLE // BUILDING IN PUBLIC</span>
          </footer>
        </div>
      </div>
    </>
  );
}
