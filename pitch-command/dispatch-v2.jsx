import { useState, useEffect, useRef, useCallback } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────

const PROJECTS = [
  { id: "flashfusion", label: "FlashFusion", emoji: "⚡", safe: true, hint: "Wix store, personas, AI platform" },
  { id: "ai-learning", label: "AI / Tooling", emoji: "🧠", safe: true, hint: "General learning, tools, patterns" },
  { id: "intinc", label: "Intinc (NDA filtered)", emoji: "🔒", safe: false, hint: "Client + org details auto-stripped" },
];

const TONES = [
  { id: "raw", label: "Raw / Real", desc: "Direct, honest, no spin" },
  { id: "technical", label: "Technical", desc: "Specific tools, APIs, architecture" },
  { id: "reflective", label: "Reflective", desc: "Pattern + broader insight" },
];

const FIELDS = [
  { key: "built", label: "What I built / did", placeholder: "e.g. Mapped 7 buyer personas to Wix store collections...", required: true },
  { key: "broke", label: "What broke or was hard", placeholder: "e.g. updateDeliveryCarrier API silently rejects appId...", required: false },
  { key: "learned", label: "What I actually learned", placeholder: "e.g. Wix V1 Catalog has completely different API surface...", required: false },
  { key: "next", label: "What's next", placeholder: "e.g. Manual shipping config — no REST endpoints for this...", required: false },
];

const TONE_MAP = {
  raw: "Direct, honest, like a senior engineer texting a peer. Short punchy sentences. Admits when things went sideways. No spin.",
  technical: "Technically precise. Specific tool names, API behavior, architecture decisions. Credible to engineers who would fact-check it.",
  reflective: "Thoughtful, connecting technical work to a broader pattern or insight. Still direct, not preachy."
};

const SHORTCUTS = [
  { keys: ["⌘", "↵"], label: "Generate dispatch" },
  { keys: ["⌘", "⇧", "C"], label: "Clear all fields" },
  { keys: ["⌘", "⇧", "L"], label: "Copy LinkedIn" },
  { keys: ["⌘", "⇧", "X"], label: "Copy X/Twitter" },
  { keys: ["1", "2", "3"], label: "Switch project" },
  { keys: ["R", "T", "F"], label: "Switch voice tone" },
  { keys: ["?"], label: "Toggle shortcuts" },
  { keys: ["Esc"], label: "Close shortcuts / clear" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  const colors = {
    success: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", text: "#34d399" },
    error: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", text: "#f87171" },
    info: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", text: "#fbbf24" },
  };
  const c = colors[type] || colors.info;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "fixed", bottom: "24px", right: "24px",
        padding: "10px 16px",
        background: c.bg, border: `1px solid ${c.border}`,
        borderRadius: "4px", color: c.text,
        fontSize: "12px", fontFamily: "'Courier New', monospace",
        letterSpacing: "0.06em", zIndex: 9999,
        animation: "slideIn 0.2s ease",
        maxWidth: "280px"
      }}
    >
      {message}
    </div>
  );
}

function ShortcutsPanel({ onClose }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px"
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        style={{
          background: "#080c10",
          border: "1px solid #1e2d40",
          borderRadius: "4px",
          padding: "28px",
          width: "100%",
          maxWidth: "380px",
          outline: "none"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 id="shortcuts-title" style={{ margin: 0, fontSize: "13px", color: "#f59e0b", letterSpacing: "0.15em", fontFamily: "'Courier New', monospace", textTransform: "uppercase" }}>
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            aria-label="Close shortcuts panel"
            style={{
              background: "transparent", border: "1px solid #1e2d40",
              borderRadius: "3px", color: "#3a5a7a",
              padding: "4px 8px", cursor: "pointer",
              fontSize: "11px", fontFamily: "'Courier New', monospace"
            }}
          >
            ESC
          </button>
        </div>
        <dl style={{ margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
          {SHORTCUTS.map(({ keys, label }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <dt style={{ fontSize: "11px", color: "#3a5a7a", fontFamily: "'Courier New', monospace", letterSpacing: "0.04em" }}>{label}</dt>
              <dd style={{ margin: 0, display: "flex", gap: "4px" }}>
                {keys.map(k => (
                  <kbd key={k} style={{
                    padding: "2px 6px",
                    background: "#0e1a26", border: "1px solid #1e2d40",
                    borderRadius: "3px", fontSize: "10px",
                    color: "#6a8aaa", fontFamily: "'Courier New', monospace"
                  }}>{k}</kbd>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function PostCard({ platform, content, charCount, limit, onCopy }) {
  const overLimit = charCount > limit;
  const nearLimit = charCount > limit * 0.85;

  return (
    <article
      aria-label={`${platform} post output`}
      className="post-card"
      style={{
        background: "#080c10",
        border: "1px solid #0e1a26",
        borderRadius: "3px",
        padding: "20px",
        borderLeft: "2px solid rgba(245,158,11,0.4)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <h3 style={{ margin: 0, fontSize: "10px", color: "#f59e0b", letterSpacing: "0.15em", fontFamily: "'Courier New', monospace", textTransform: "uppercase" }}>
          {platform}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            aria-label={`${charCount} of ${limit} characters`}
            style={{
              fontSize: "10px",
              color: overLimit ? "#ef4444" : nearLimit ? "#f59e0b" : "#2a4a6a",
              letterSpacing: "0.05em",
              fontFamily: "'Courier New', monospace"
            }}
          >
            {charCount}/{limit}
          </span>
          <button
            onClick={() => onCopy(content, platform)}
            aria-label={`Copy ${platform} post to clipboard`}
            style={{
              padding: "5px 12px",
              borderRadius: "4px",
              border: "1px solid #1e2d40",
              background: "transparent",
              color: "#64748b",
              fontSize: "11px",
              fontFamily: "'Courier New', monospace",
              cursor: "pointer",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              transition: "all 0.15s",
              minWidth: "44px", minHeight: "44px",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
            onFocus={e => Object.assign(e.target.style, { outline: "3px solid rgba(245,158,11,0.5)", outlineOffset: "2px" })}
            onBlur={e => Object.assign(e.target.style, { outline: "none" })}
          >
            COPY
          </button>
        </div>
      </div>
      <p style={{
        fontSize: "14px", lineHeight: "1.75",
        color: "#8aa4bc", margin: 0,
        whiteSpace: "pre-wrap",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}>
        {content}
      </p>
    </article>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Dispatch() {
  const [project, setProject] = useState("ai-learning");
  const [tone, setTone] = useState("raw");
  const [fields, setFields] = useState({ built: "", broke: "", learned: "", next: "" });
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [history, setHistory] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});

  const generateRef = useRef(null);
  const firstFieldRef = useRef(null);
  const outputRef = useRef(null);
  const liveRegionRef = useRef(null);

  const selectedProject = PROJECTS.find(p => p.id === project);
  const hasMinInput = fields.built.trim().length > 10;

  // ─── Auto-save draft ──────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("dispatch-draft");
    if (saved) {
      try { setFields(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (Object.values(fields).some(v => v)) {
      localStorage.setItem("dispatch-draft", JSON.stringify(fields));
    }
  }, [fields]);

  // ─── Announce to screen reader ────────────────────────────────────────────
  const announce = (msg) => {
    if (liveRegionRef.current) liveRegionRef.current.textContent = msg;
  };

  // ─── Copy utility ─────────────────────────────────────────────────────────
  const copyToClipboard = useCallback(async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ message: `✓ ${label} copied`, type: "success" });
      announce(`${label} post copied to clipboard`);
    } catch {
      setToast({ message: "Copy failed — select text manually", type: "error" });
    }
  }, []);

  // ─── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      // ? = toggle shortcuts
      if (e.key === "?" && !e.target.matches("textarea, input")) {
        e.preventDefault();
        setShowShortcuts(s => !s);
        return;
      }
      // Esc = close shortcuts
      if (e.key === "Escape") {
        if (showShortcuts) { setShowShortcuts(false); return; }
      }
      // Number keys 1/2/3 = switch project
      if (!e.metaKey && !e.ctrlKey && !e.target.matches("textarea, input")) {
        if (e.key === "1") setProject("flashfusion");
        if (e.key === "2") setProject("ai-learning");
        if (e.key === "3") setProject("intinc");
        if (e.key === "r" || e.key === "R") setTone("raw");
        if (e.key === "t" || e.key === "T") setTone("technical");
        if (e.key === "f" || e.key === "F") setTone("reflective");
      }
      // Cmd/Ctrl + Enter = generate
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (hasMinInput && !loading) generate();
      }
      // Cmd/Ctrl + Shift + C = clear
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "C") {
        e.preventDefault();
        reset();
      }
      // Cmd/Ctrl + Shift + L = copy LinkedIn
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "L") {
        e.preventDefault();
        if (output?.linkedin) copyToClipboard(output.linkedin, "LinkedIn");
      }
      // Cmd/Ctrl + Shift + X = copy Twitter
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "X") {
        e.preventDefault();
        if (output?.twitter) copyToClipboard(output.twitter, "X/Twitter");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showShortcuts, hasMinInput, loading, output, copyToClipboard]);

  // ─── Validate ────────────────────────────────────────────────────────────
  const validate = () => {
    const errors = {};
    if (!fields.built.trim()) errors.built = "Required — at least tell me what you built.";
    else if (fields.built.trim().length < 10) errors.built = "Too short — give me a bit more to work with.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ─── Generate ────────────────────────────────────────────────────────────
  const generate = async () => {
    if (!validate()) {
      firstFieldRef.current?.focus();
      announce("Validation error. Check required field.");
      return;
    }
    setLoading(true);
    setOutput(null);
    announce("Generating your dispatch posts...");

    const ndaNote = !selectedProject.safe
      ? `CRITICAL: NDA content. Strip ALL: client names, org names, internal tool names, proprietary systems, headcounts, revenue figures, team structures. Keep only the universal engineering pattern or lesson.`
      : "";

    const filled = Object.entries(fields)
      .filter(([, v]) => v.trim())
      .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
      .join("\n");

    const prompt = `You are writing "building in public" posts for Kyle, a Staff Engineer and AI builder. AppSec and Platform Engineering background. Builds full-stack apps, AI tooling, automation, product engineering.

VOICE: ${TONE_MAP[tone]}
HARD RULES: No motivational filler. No humble-brag. No "excited to share". No "lessons learned:" headers. Write like a human, not a LinkedIn influencer. ${ndaNote}

Project context: ${selectedProject.label}
${filled}

Generate exactly TWO posts.

POST 1 — LINKEDIN (max 150 words)
- Can use line breaks
- End with ONE genuinely curious question to the audience
- Max 2 hashtags if relevant, otherwise zero
- Do NOT start with "I" as the first word

POST 2 — X/TWITTER (HARD limit: 270 characters — count carefully)
- No hashtags
- Sharpest, most punchy angle from the LinkedIn post
- Can start mid-thought or as a hot take

Respond ONLY with valid JSON. No markdown. No fences. No preamble.
{"linkedin":"...","twitter":"..."}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const raw = data.content?.find(b => b.type === "text")?.text || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setOutput(parsed);

      // Save to session history
      const entry = {
        id: Date.now(),
        project: selectedProject.label,
        tone,
        built: fields.built.substring(0, 60) + (fields.built.length > 60 ? "..." : ""),
        linkedin: parsed.linkedin,
        twitter: parsed.twitter,
        timestamp: new Date().toLocaleTimeString()
      };
      setHistory(h => [entry, ...h].slice(0, 5));
      localStorage.setItem("dispatch-draft", "");

      announce("Dispatch generated. LinkedIn and X posts ready.");
      setTimeout(() => outputRef.current?.focus(), 100);
    } catch {
      setOutput({ error: true, message: "Generation failed. Check connection and retry." });
      announce("Generation failed.");
    }
    setLoading(false);
  };

  const reset = () => {
    setFields({ built: "", broke: "", learned: "", next: "" });
    setOutput(null);
    setFieldErrors({});
    localStorage.removeItem("dispatch-draft");
    setToast({ message: "Fields cleared", type: "info" });
    announce("Fields cleared.");
    setTimeout(() => firstFieldRef.current?.focus(), 50);
  };

  const focusStyle = {
    outline: "3px solid rgba(245,158,11,0.6)",
    outlineOffset: "2px"
  };

  return (
    <>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
        .post-card { animation: fadeUp 0.25s ease forwards; }
        *:focus-visible {
          outline: 3px solid rgba(245,158,11,0.6) !important;
          outline-offset: 2px !important;
        }
        textarea:focus { outline: 3px solid rgba(245,158,11,0.5) !important; outline-offset: 0 !important; border-color: #f59e0b !important; }
        textarea::placeholder { color: #1a2a3a; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1e2d40; border-radius: 2px; }
        button:focus-visible { outline: 3px solid rgba(245,158,11,0.6) !important; outline-offset: 2px !important; }
      `}</style>

      {/* Skip link */}
      <a
        href="#main-content"
        style={{
          position: "absolute", top: "-100px", left: "16px",
          background: "#f59e0b", color: "#060a0e",
          padding: "8px 16px", borderRadius: "3px",
          fontSize: "12px", fontFamily: "'Courier New', monospace",
          fontWeight: "700", zIndex: 10000,
          transition: "top 0.15s"
        }}
        onFocus={e => { e.target.style.top = "16px"; }}
        onBlur={e => { e.target.style.top = "-100px"; }}
      >
        Skip to main content
      </a>

      {/* ARIA live region */}
      <div
        ref={liveRegionRef}
        aria-live="assertive"
        aria-atomic="true"
        style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)" }}
      />

      {/* Modals */}
      {showShortcuts && <ShortcutsPanel onClose={() => setShowShortcuts(false)} />}
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}

      <div style={{
        minHeight: "100vh",
        background: "#060a0e",
        color: "#c9d5e0",
        fontFamily: "'Courier New', Courier, monospace",
      }}>
        {/* Scanlines */}
        <div aria-hidden="true" style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.025) 2px, rgba(0,0,0,0.025) 4px)"
        }} />

        <div id="main-content" style={{ position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto", padding: "40px 20px 80px" }}>

          {/* Header */}
          <header style={{ marginBottom: "36px", borderBottom: "1px solid #0e1a26", paddingBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <div aria-hidden="true" style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: "#f59e0b",
                    boxShadow: "0 0 10px #f59e0b, 0 0 20px rgba(245,158,11,0.3)"
                  }} />
                  <span style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#2a4a6a", textTransform: "uppercase" }}>
                    DISPATCH // BUILDING IN PUBLIC
                  </span>
                </div>
                <h1 style={{ fontSize: "26px", fontWeight: "700", margin: "0 0 3px", color: "#e8f0f8", letterSpacing: "-0.02em" }}>
                  Kyle's Dispatch
                  <span aria-hidden="true" style={{
                    display: "inline-block", width: "7px", height: "14px",
                    background: "#f59e0b", marginLeft: "3px", verticalAlign: "middle",
                    animation: "blink 1s step-end infinite"
                  }} />
                </h1>
                <p style={{ fontSize: "11px", color: "#2a4a6a", margin: 0, letterSpacing: "0.04em" }}>
                  What you built → LinkedIn + X, ready to post
                </p>
              </div>

              <button
                onClick={() => setShowShortcuts(true)}
                aria-label="Show keyboard shortcuts (press ? anytime)"
                title="Keyboard shortcuts (?)"
                style={{
                  padding: "8px 12px",
                  background: "transparent",
                  border: "1px solid #0e1a26",
                  borderRadius: "3px",
                  color: "#2a4a6a",
                  fontSize: "11px",
                  fontFamily: "'Courier New', monospace",
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  minWidth: "44px", minHeight: "44px",
                  transition: "all 0.15s"
                }}
              >
                ?
              </button>
            </div>

            {/* Draft recovery notice */}
            {Object.values(fields).some(v => v) && !output && (
              <div
                role="status"
                style={{
                  marginTop: "12px", padding: "8px 12px",
                  background: "rgba(14,26,38,0.6)",
                  border: "1px solid #0e1a26",
                  borderRadius: "3px", fontSize: "10px",
                  color: "#2a4a6a", letterSpacing: "0.06em"
                }}
              >
                ↺ Draft auto-saved locally
              </div>
            )}
          </header>

          {/* Main form */}
          <main>
            <form
              onSubmit={e => { e.preventDefault(); generate(); }}
              noValidate
              aria-label="Dispatch post generator"
            >
              {/* Section 01: Project */}
              <fieldset style={{ border: "none", padding: 0, margin: "0 0 28px" }}>
                <legend style={{
                  fontSize: "10px", color: "#2a4a6a",
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  marginBottom: "10px", display: "block"
                }}>
                  01 / PROJECT
                </legend>
                <div role="group" aria-label="Select project" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {PROJECTS.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setProject(p.id); announce(`Project set to ${p.label}`); }}
                      aria-pressed={project === p.id}
                      title={`${p.hint} — press ${i + 1}`}
                      style={{
                        padding: "9px 16px",
                        borderRadius: "3px",
                        border: project === p.id ? "1px solid #f59e0b" : "1px solid #0e1a26",
                        background: project === p.id ? "rgba(245,158,11,0.08)" : "rgba(14,26,38,0.4)",
                        color: project === p.id ? "#f59e0b" : "#3a5a7a",
                        fontSize: "12px",
                        fontFamily: "'Courier New', monospace",
                        cursor: "pointer",
                        letterSpacing: "0.05em",
                        transition: "all 0.15s",
                        minHeight: "44px"
                      }}
                    >
                      <span aria-hidden="true">{p.emoji}</span> {p.label}
                    </button>
                  ))}
                </div>
                {!selectedProject.safe && (
                  <div
                    role="alert"
                    style={{
                      marginTop: "8px", padding: "8px 12px",
                      background: "rgba(245,158,11,0.04)",
                      border: "1px solid rgba(245,158,11,0.12)",
                      borderRadius: "3px", fontSize: "11px", color: "#8a6a2a",
                      letterSpacing: "0.03em"
                    }}
                  >
                    ⚠ NDA filter active — client names, org names, proprietary systems will be stripped before generation
                  </div>
                )}
              </fieldset>

              {/* Section 02: Tone */}
              <fieldset style={{ border: "none", padding: 0, margin: "0 0 28px" }}>
                <legend style={{
                  fontSize: "10px", color: "#2a4a6a",
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  marginBottom: "10px", display: "block"
                }}>
                  02 / VOICE
                </legend>
                <div role="group" aria-label="Select voice tone" style={{ display: "flex", gap: "8px" }}>
                  {TONES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => { setTone(t.id); announce(`Voice set to ${t.label}`); }}
                      aria-pressed={tone === t.id}
                      title={t.desc}
                      style={{
                        padding: "7px 14px",
                        borderRadius: "3px",
                        border: tone === t.id ? "1px solid rgba(245,158,11,0.5)" : "1px solid #0e1a26",
                        background: tone === t.id ? "rgba(245,158,11,0.05)" : "transparent",
                        color: tone === t.id ? "#c07a20" : "#2a4a6a",
                        fontSize: "11px",
                        fontFamily: "'Courier New', monospace",
                        cursor: "pointer",
                        letterSpacing: "0.08em",
                        transition: "all 0.15s",
                        textTransform: "uppercase",
                        minHeight: "44px"
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Section 03: Fields */}
              <fieldset style={{ border: "none", padding: 0, margin: "0 0 28px" }}>
                <legend style={{
                  fontSize: "10px", color: "#2a4a6a",
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  marginBottom: "16px", display: "block"
                }}>
                  03 / WHAT HAPPENED
                </legend>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {FIELDS.map(({ key, label, placeholder, required }, i) => {
                    const error = fieldErrors[key];
                    const inputId = `field-${key}`;
                    const errorId = `error-${key}`;
                    return (
                      <div key={key}>
                        <label
                          htmlFor={inputId}
                          style={{
                            display: "block",
                            fontSize: "10px",
                            color: error ? "#ef4444" : "#3a5a7a",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            marginBottom: "6px"
                          }}
                        >
                          &gt; {label}
                          {required
                            ? <span aria-hidden="true" style={{ color: "#f59e0b", marginLeft: "4px" }}>*</span>
                            : <span style={{ color: "#1e2d40", marginLeft: "8px", fontSize: "9px" }}>OPTIONAL</span>
                          }
                        </label>
                        <textarea
                          id={inputId}
                          ref={i === 0 ? firstFieldRef : undefined}
                          value={fields[key]}
                          onChange={e => {
                            setFields(f => ({ ...f, [key]: e.target.value }));
                            if (fieldErrors[key]) setFieldErrors(fe => ({ ...fe, [key]: null }));
                          }}
                          placeholder={placeholder}
                          rows={2}
                          required={required}
                          aria-required={required}
                          aria-describedby={error ? errorId : undefined}
                          aria-invalid={!!error}
                          style={{
                            width: "100%",
                            background: "#080c10",
                            border: error ? "1px solid rgba(239,68,68,0.5)" : fields[key] ? "1px solid #1e3a5a" : "1px solid #0e1a26",
                            borderRadius: "3px",
                            padding: "10px 14px",
                            color: "#a0b8cc",
                            fontSize: "13px",
                            resize: "vertical",
                            boxSizing: "border-box",
                            fontFamily: "'Courier New', monospace",
                            lineHeight: "1.6",
                            transition: "border-color 0.15s",
                            minHeight: "44px"
                          }}
                        />
                        {error && (
                          <p id={errorId} role="alert" style={{
                            margin: "5px 0 0",
                            fontSize: "10px", color: "#ef4444",
                            letterSpacing: "0.04em",
                            fontFamily: "'Courier New', monospace"
                          }}>
                            ✗ {error}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </fieldset>

              {/* Actions */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "36px" }} role="group" aria-label="Form actions">
                <button
                  type="submit"
                  ref={generateRef}
                  disabled={loading}
                  aria-disabled={loading}
                  aria-describedby="generate-hint"
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: "3px",
                    border: "none",
                    background: loading
                      ? "#0e1a26"
                      : "linear-gradient(135deg, #b45309, #f59e0b)",
                    color: loading ? "#2a4a6a" : "#060a0e",
                    fontSize: "13px",
                    fontWeight: "700",
                    fontFamily: "'Courier New', monospace",
                    cursor: loading ? "not-allowed" : "pointer",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    transition: "all 0.2s",
                    minHeight: "44px"
                  }}
                >
                  {loading ? "TRANSMITTING..." : "▶ GENERATE DISPATCH"}
                </button>
                <span id="generate-hint" style={{ display: "none" }}>
                  Keyboard shortcut: Command or Control plus Enter
                </span>

                <button
                  type="button"
                  onClick={reset}
                  aria-label="Clear all fields and reset"
                  style={{
                    padding: "14px 20px",
                    borderRadius: "3px",
                    border: "1px solid #0e1a26",
                    background: "transparent",
                    color: "#2a4a6a",
                    fontSize: "11px",
                    fontFamily: "'Courier New', monospace",
                    cursor: "pointer",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    minHeight: "44px"
                  }}
                >
                  CLR
                </button>
              </div>
            </form>

            {/* Output section */}
            {output && !output.error && (
              <section
                aria-labelledby="output-heading"
                ref={outputRef}
                tabIndex={-1}
                style={{ outline: "none" }}
              >
                <div style={{
                  fontSize: "10px", color: "#2a4a6a",
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  marginBottom: "14px",
                  display: "flex", alignItems: "center", gap: "8px"
                }}>
                  <span aria-hidden="true" style={{ color: "#f59e0b" }}>●</span>
                  <h2 id="output-heading" style={{ margin: 0, fontSize: "inherit", color: "inherit", letterSpacing: "inherit", fontWeight: "normal" }}>
                    OUTPUT READY
                  </h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <PostCard
                    platform="LINKEDIN"
                    content={output.linkedin}
                    charCount={output.linkedin?.length || 0}
                    limit={700}
                    onCopy={copyToClipboard}
                  />
                  <PostCard
                    platform="X / TWITTER"
                    content={output.twitter}
                    charCount={output.twitter?.length || 0}
                    limit={280}
                    onCopy={copyToClipboard}
                  />
                </div>

                <div
                  role="note"
                  style={{
                    marginTop: "12px", padding: "10px 14px",
                    background: "rgba(14,26,38,0.4)",
                    border: "1px solid #0e1a26",
                    borderRadius: "3px",
                    fontSize: "10px", color: "#2a4a6a",
                    letterSpacing: "0.06em"
                  }}
                >
                  Tip: Adjust "What I learned" to shift the angle, then regenerate. NDA projects — scan output before posting.
                </div>
              </section>
            )}

            {output?.error && (
              <div role="alert" style={{
                padding: "16px", borderRadius: "3px",
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171", fontSize: "12px",
                fontFamily: "'Courier New', monospace",
                letterSpacing: "0.05em"
              }}>
                ✗ {output.message}
              </div>
            )}

            {/* Session History */}
            {history.length > 0 && (
              <section aria-labelledby="history-heading" style={{ marginTop: "48px" }}>
                <h2 id="history-heading" style={{
                  fontSize: "10px", color: "#1a2a3a",
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  marginBottom: "12px"
                }}>
                  SESSION HISTORY ({history.length})
                </h2>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                  {history.map(h => (
                    <li
                      key={h.id}
                      style={{
                        padding: "10px 14px",
                        background: "#080c10",
                        border: "1px solid #0e1a26",
                        borderRadius: "3px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px"
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "10px", color: "#f59e0b", letterSpacing: "0.08em", marginRight: "8px" }}>
                          {h.project}
                        </span>
                        <span style={{ fontSize: "11px", color: "#3a5a7a", fontFamily: "'Courier New', monospace" }}>
                          {h.built}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                        <button
                          onClick={() => copyToClipboard(h.linkedin, "LinkedIn")}
                          aria-label={`Copy LinkedIn post from ${h.timestamp}`}
                          style={{
                            padding: "4px 8px",
                            background: "transparent",
                            border: "1px solid #0e1a26",
                            borderRadius: "3px",
                            color: "#2a4a6a",
                            fontSize: "9px",
                            fontFamily: "'Courier New', monospace",
                            cursor: "pointer",
                            textTransform: "uppercase",
                            minHeight: "44px", minWidth: "44px"
                          }}
                        >
                          LI
                        </button>
                        <button
                          onClick={() => copyToClipboard(h.twitter, "X/Twitter")}
                          aria-label={`Copy X post from ${h.timestamp}`}
                          style={{
                            padding: "4px 8px",
                            background: "transparent",
                            border: "1px solid #0e1a26",
                            borderRadius: "3px",
                            color: "#2a4a6a",
                            fontSize: "9px",
                            fontFamily: "'Courier New', monospace",
                            cursor: "pointer",
                            textTransform: "uppercase",
                            minHeight: "44px", minWidth: "44px"
                          }}
                        >
                          X
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </main>

          {/* Footer */}
          <footer style={{
            marginTop: "60px", paddingTop: "20px",
            borderTop: "1px solid #0a1420",
            display: "flex", justifyContent: "space-between",
            fontSize: "10px", color: "#0e1a26",
            letterSpacing: "0.1em"
          }}>
            <span>DISPATCH v2.0 — WCAG 2.2 AA</span>
            <span>KYLE // BUILDING IN PUBLIC</span>
          </footer>
        </div>
      </div>
    </>
  );
}
