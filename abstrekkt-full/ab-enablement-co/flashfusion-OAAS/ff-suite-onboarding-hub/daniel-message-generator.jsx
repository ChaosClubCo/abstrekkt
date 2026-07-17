import { useState, useEffect, useRef } from "react";

// ── Topic definitions ──────────────────────────────────────────────────
const TOPICS = [
  {
    id: "work-account",
    label: "Work M365 Account",
    icon: "🏢",
    subtitle: "Intinc tenant access",
    color: "#00FF88",
    ctx: "requesting his work Microsoft 365 account be provisioned to access Copilot Studio, Azure AI Foundry, Teams, SharePoint, and the Intinc tenant. This is required to build the INT OS AI deployment practice — Intinc's paid, repeatable MSP service tier for enterprise AI agent deployments.",
    urgency: "Every other INT OS item is blocked until this exists.",
  },
  {
    id: "azure-sub",
    label: "Azure Subscription",
    icon: "☁",
    subtitle: "Work subscription access",
    color: "#4D9EFF",
    ctx: "requesting access to an Intinc Azure subscription (or a new one created for INT OS). This is required to provision Azure AI Foundry, deploy GPT-4o models, set up Key Vault for secret storage, and build the infrastructure layer that all INT OS client deployments run on.",
    urgency: "Cannot deploy any AI models or build the Foundry hub without this.",
  },
  {
    id: "frontier",
    label: "Frontier Program",
    icon: "⬡",
    subtitle: "Tenant early-access opt-in",
    color: "#A67BFF",
    ctx: "requesting the Intinc M365 tenant be opted into the Microsoft Frontier Program. This unlocks GPT-5 preview models, Agent 365 governance, and Computer Use — capabilities needed for INT OS Scale and Enterprise tier client demonstrations and production deployments.",
    urgency: "Competitors are already demoing these features. INT OS needs to be ahead of the curve on Frontier capabilities.",
  },
  {
    id: "copilot",
    label: "M365 Copilot License",
    icon: "✦",
    subtitle: "Copilot + Copilot Studio",
    color: "#FF9D3D",
    ctx: "requesting one Microsoft 365 Copilot license. This unlocks Tenant graph grounding for SharePoint knowledge sources, GPT-4.1 in production agents, 200MB knowledge file support, and the full Copilot Studio enterprise feature set — all required to build and demo INT OS Pilot tier agents for clients.",
    urgency: "Current Copilot Studio access is limited without this license — cannot demonstrate the full INT OS value prop.",
  },
  {
    id: "claude-account",
    label: "Work Claude Account",
    icon: "◈",
    subtitle: "Anthropic Claude Pro / API",
    color: "#FF7EC5",
    ctx: "requesting a work-provisioned Claude account (Claude Pro or Anthropic API access) under Intinc. Claude has specific capabilities that complement Microsoft Copilot — particularly for building INT OS agent templates, knowledge architecture design, complex automation scripts, and long-context document work. Having both tools available at work would meaningfully accelerate INT OS development without replacing Copilot for day-to-day M365 workflows.",
    urgency: "INT OS development work would move faster with access to Claude alongside Copilot — different strengths, different use cases, better output.",
  },
];

const TONES = [
  { id: "direct",    label: "Direct",       desc: "Professional, no filler" },
  { id: "urgent",    label: "Urgent",        desc: "Time-sensitive framing" },
  { id: "strategic", label: "Strategic",     desc: "Business case emphasis" },
];

// ── Main component ────────────────────────────────────────────────────
export default function DanielMessageGen() {
  const [topic,    setTopic]    = useState("work-account");
  const [tone,     setTone]     = useState("direct");
  const [msg,      setMsg]      = useState("");
  const [loading,  setLoading]  = useState(false);
  const [copied,   setCopied]   = useState(false);
  const [edited,   setEdited]   = useState(false);
  const [history,  setHistory]  = useState([]);  // [{topic, tone, msg}]
  const [showHist, setShowHist] = useState(false);
  const textRef = useRef(null);

  const selected = TOPICS.find(t => t.id === topic);

  // Inject fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
    const st = document.createElement("style");
    st.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :focus-visible { outline: 2px solid #00FF88; outline-offset: 3px; border-radius: 3px; }
      textarea:focus { outline: none; box-shadow: 0 0 0 2px rgba(0,255,136,.3) !important; }
      @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
      @keyframes shimmer{ 0%{background-position:200% center} 100%{background-position:-200% center} }
      .fade-up { animation: fadeUp .3s ease both; }
      .cursor-blink { animation: pulse 1s step-end infinite; }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
      }
    `;
    document.head.appendChild(st);
    return () => { try { document.head.removeChild(link); document.head.removeChild(st); } catch {} };
  }, []);

  const generate = async () => {
    if (loading) return;
    setLoading(true); setMsg(""); setEdited(false);
    const toneCtx = tone === "direct"
      ? "Tone: direct and professional. No filler, no qualifiers. State the ask, justify it in one sentence, one urgency line."
      : tone === "urgent"
      ? "Tone: professionally urgent. Signal that delay has a real cost. Not dramatic — practical."
      : "Tone: strategic and business-focused. Lead with the INT OS business case. Frame the ask as an investment in a billable practice, not a personal tool.";
    const body = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 250,
      system: `You write concise, professional Microsoft Teams messages. Output ONLY the message body — no subject line, no greeting beyond 'Hey Daniel' or 'Hi Daniel', no preamble, no markdown. Plain text only. Maximum 120 words. End with one clear action request.`,
      messages: [{
        role: "user",
        content: `Write a Teams message from Kyle (Service Desk Manager, Intinc) to Daniel (his manager) ${selected.ctx}\n\nUrgency context: ${selected.urgency}\n\n${toneCtx}\n\nKyle is building INT OS — a paid, repeatable MSP service tier for AI agent deployments. Every item he's requesting directly unblocks billable client work.`,
      }],
    };
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const d = await r.json();
      const text = d.content?.[0]?.text?.trim() || "Generation failed — try again.";
      setMsg(text);
      setHistory(h => [{ id: Date.now(), topic: selected.label, tone, msg: text }, ...h].slice(0, 8));
    } catch {
      setMsg("Connection error. Try again.");
    }
    setLoading(false);
  };

  const copy = () => {
    const text = textRef.current?.value || msg;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const restore = (h) => { setMsg(h.msg); setTopic(h.topic === TOPICS.find(t=>t.label===h.topic)?.label ? TOPICS.find(t=>t.label===h.topic)?.id : topic); setShowHist(false); setEdited(false); };

  // ── Palette ──────────────────────────────────────────────────────────
  const BG    = "#07090D";
  const SURF  = "#0D1017";
  const BORD  = "#1A1F2E";
  const TEXT  = "#E8EFF8";
  const MUTED = "#3A4A5E";
  const ACC   = selected?.color || "#00FF88";

  return (
    <div style={{ background: BG, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(12px,4vw,32px)", fontFamily: "'Syne', sans-serif" }}>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 560, background: SURF, border: `1px solid ${BORD}`, borderRadius: 16, overflow: "hidden", boxShadow: `0 0 60px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.03)` }}>

        {/* Header bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${ACC}, transparent)`, transition: "background .4s" }} aria-hidden="true" />
        <div style={{ padding: "20px 24px 16px", borderBottom: `1px solid ${BORD}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(13px,2.5vw,15px)", fontWeight: 700, color: TEXT, letterSpacing: 2, textTransform: "uppercase" }}>
                <span style={{ color: ACC }}>✦</span> Message to Daniel
              </h1>
              <p style={{ fontSize: 11, color: MUTED, marginTop: 3, fontFamily: "'Space Mono', monospace" }}>Teams-ready · INT OS · Copy and send</p>
            </div>
            <button onClick={() => setShowHist(o => !o)} aria-expanded={showHist} aria-label="Toggle message history"
              style={{ padding: "5px 12px", background: "transparent", border: `1px solid ${showHist ? ACC + "40" : BORD}`, borderRadius: 6, color: showHist ? ACC : MUTED, fontSize: 11, fontFamily: "'Space Mono', monospace", cursor: "pointer", transition: "all .18s", minHeight: 32 }}>
              History {history.length > 0 && `(${history.length})`}
            </button>
          </div>
        </div>

        <div style={{ padding: "20px 24px" }}>

          {/* History panel */}
          {showHist && history.length > 0 && (
            <div className="fade-up" style={{ marginBottom: 20, background: BG, border: `1px solid ${BORD}`, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "9px 14px", borderBottom: `1px solid ${BORD}` }}>
                <span style={{ fontSize: 10, color: MUTED, fontFamily: "'Space Mono', monospace", letterSpacing: 1, textTransform: "uppercase" }}>Recent generations</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0 }} role="list" aria-label="Message history">
                {history.map((h, i) => (
                  <li key={h.id}>
                    <button onClick={() => restore(h)} style={{ width: "100%", textAlign: "left", padding: "11px 14px", background: "transparent", border: "none", borderBottom: i < history.length - 1 ? `1px solid ${BORD}` : "none", cursor: "pointer", display: "flex", gap: 10, alignItems: "flex-start", transition: "background .15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#0F1420"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <span style={{ fontSize: 9, color: MUTED, fontFamily: "'Space Mono', monospace", marginTop: 2, flexShrink: 0 }}>{i + 1}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", gap: 6, marginBottom: 3 }}>
                          <span style={{ fontSize: 9, color: ACC, background: `${ACC}12`, border: `1px solid ${ACC}25`, borderRadius: 3, padding: "1px 6px", fontFamily: "'Space Mono', monospace" }}>{h.topic}</span>
                          <span style={{ fontSize: 9, color: MUTED, fontFamily: "'Space Mono', monospace" }}>{h.tone}</span>
                        </div>
                        <p style={{ fontSize: 11, color: TEXT, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{h.msg}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {showHist && history.length === 0 && (
            <div style={{ marginBottom: 20, padding: "14px", background: BG, border: `1px solid ${BORD}`, borderRadius: 10, textAlign: "center" }}>
              <p style={{ fontSize: 11, color: MUTED, fontFamily: "'Space Mono', monospace" }}>No history yet — generate a message first.</p>
            </div>
          )}

          {/* Topic selector */}
          <fieldset style={{ border: "none", padding: 0, marginBottom: 18 }}>
            <legend style={{ fontSize: 10, color: MUTED, fontFamily: "'Space Mono', monospace", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10, display: "block" }}>Request topic</legend>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }} role="radiogroup" aria-label="Select request topic">
              {TOPICS.map(t => {
                const sel = topic === t.id;
                return (
                  <label key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 9, border: `1px solid ${sel ? t.color + "50" : BORD}`, background: sel ? `${t.color}08` : "transparent", cursor: "pointer", transition: "all .18s", minHeight: 48 }}>
                    <input type="radio" name="topic" value={t.id} checked={sel} onChange={() => { setTopic(t.id); setMsg(""); setEdited(false); }} style={{ display: "none" }} />
                    <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }} aria-hidden="true">{t.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: sel ? t.color : TEXT }}>{t.label}</span>
                      <span style={{ display: "block", fontSize: 10, color: MUTED, fontFamily: "'Space Mono', monospace", marginTop: 1 }}>{t.subtitle}</span>
                    </div>
                    {sel && <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, boxShadow: `0 0 8px ${t.color}`, flexShrink: 0 }} aria-hidden="true" />}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Tone selector */}
          <fieldset style={{ border: "none", padding: 0, marginBottom: 20 }}>
            <legend style={{ fontSize: 10, color: MUTED, fontFamily: "'Space Mono', monospace", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10, display: "block" }}>Tone</legend>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }} role="radiogroup" aria-label="Select message tone">
              {TONES.map(t => {
                const sel = tone === t.id;
                return (
                  <label key={t.id} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 20, border: `1px solid ${sel ? ACC + "55" : BORD}`, background: sel ? `${ACC}12` : "transparent", cursor: "pointer", transition: "all .18s", minHeight: 36 }}>
                    <input type="radio" name="tone" value={t.id} checked={sel} onChange={() => { setTone(t.id); setMsg(""); setEdited(false); }} style={{ display: "none" }} />
                    <div>
                      <span style={{ display: "block", fontSize: 12, color: sel ? ACC : TEXT, fontWeight: sel ? 600 : 400 }}>{t.label}</span>
                      <span style={{ display: "block", fontSize: 9, color: MUTED, fontFamily: "'Space Mono', monospace" }}>{t.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Generate button */}
          <button onClick={generate} disabled={loading} aria-busy={loading}
            style={{ width: "100%", padding: "13px", background: loading ? `${ACC}25` : `${ACC}`, border: "none", borderRadius: 9, color: "#07090D", fontSize: 13, fontWeight: 700, fontFamily: "'Space Mono', monospace", cursor: loading ? "wait" : "pointer", letterSpacing: 1, textTransform: "uppercase", boxShadow: loading ? "none" : `0 0 24px ${ACC}40`, transition: "all .2s", minHeight: 50, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading
              ? <><span className="cursor-blink" style={{ fontSize: 16 }}>▌</span> Generating…</>
              : <><span>✍</span> {msg ? "Regenerate" : "Generate"}</>}
          </button>

          {/* Generated message */}
          {msg && (
            <div className="fade-up" style={{ marginTop: 16 }}>
              <div style={{ background: BG, border: `1px solid ${ACC}30`, borderRadius: 10, overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${ACC}60, transparent)` }} aria-hidden="true" />
                <div style={{ padding: "10px 14px 8px", borderBottom: `1px solid ${BORD}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 9, color: ACC, fontFamily: "'Space Mono', monospace", letterSpacing: 1, textTransform: "uppercase" }}>Teams message</span>
                    {edited && <span style={{ fontSize: 9, color: MUTED, fontFamily: "'Space Mono', monospace" }}>· edited</span>}
                  </div>
                  <span style={{ fontSize: 9, color: MUTED, fontFamily: "'Space Mono', monospace" }}>{selected.label} · {TONES.find(t => t.id === tone)?.label}</span>
                </div>
                <textarea ref={textRef} value={msg} onChange={e => { setMsg(e.target.value); setEdited(true); }}
                  aria-label="Generated Teams message — editable"
                  style={{ display: "block", width: "100%", background: "transparent", border: "none", padding: "14px", color: TEXT, fontSize: 13, lineHeight: 1.8, fontFamily: "'Syne', sans-serif", resize: "vertical", minHeight: 140 }} />
                <div style={{ padding: "10px 14px", borderTop: `1px solid ${BORD}`, display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
                  <button onClick={() => { setMsg(""); setEdited(false); }}
                    style={{ padding: "6px 14px", background: "transparent", border: `1px solid ${BORD}`, borderRadius: 6, color: MUTED, fontSize: 11, fontFamily: "'Space Mono', monospace", cursor: "pointer", minHeight: 34 }}>
                    Clear
                  </button>
                  <button onClick={copy} aria-label={copied ? "Message copied" : "Copy message to clipboard"}
                    style={{ padding: "6px 18px", background: copied ? `${ACC}20` : `${ACC}15`, border: `1px solid ${copied ? ACC : ACC + "30"}`, borderRadius: 6, color: copied ? ACC : TEXT, fontSize: 11, fontFamily: "'Space Mono', monospace", cursor: "pointer", minHeight: 34, transition: "all .18s", fontWeight: copied ? 700 : 400 }}>
                    {copied ? "✓ Copied" : "📋 Copy"}
                  </button>
                </div>
              </div>
              <p style={{ fontSize: 10, color: MUTED, fontFamily: "'Space Mono', monospace", marginTop: 8, textAlign: "center" }}>
                Editable above — paste directly into Teams after copying
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
