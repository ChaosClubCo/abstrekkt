import { useState } from "react";

const PROJECTS = [
  { id: "flashfusion", label: "FlashFusion", emoji: "⚡", safe: true, hint: "Wix store, personas, AI platform builds" },
  { id: "ai-learning", label: "AI / Tooling", emoji: "🧠", safe: true, hint: "General learning, tools, patterns" },
  { id: "intinc", label: "Intinc (filtered)", emoji: "🔒", safe: false, hint: "NDA-safe — client + org details stripped" },
];

const FIELDS = [
  { key: "built", label: "What I built / did", placeholder: "e.g. Mapped 7 buyer personas to Wix store collections and coupon logic..." },
  { key: "broke", label: "What broke or was hard", placeholder: "e.g. updateDeliveryCarrier API silently rejects appId — undocumented V1 bug..." },
  { key: "learned", label: "What I actually learned", placeholder: "e.g. Wix V1 Catalog has completely different API surface than V3 docs suggest..." },
  { key: "next", label: "What's next", placeholder: "e.g. Manual shipping config + click tracking — no REST endpoints for either..." },
];

const TONES = [
  { id: "raw", label: "Raw / Real" },
  { id: "technical", label: "Technical" },
  { id: "reflective", label: "Reflective" },
];

function CursorBlink() {
  return (
    <span style={{
      display: "inline-block",
      width: "8px",
      height: "15px",
      background: "#f59e0b",
      marginLeft: "2px",
      verticalAlign: "middle",
      animation: "blink 1s step-end infinite"
    }} />
  );
}

function CopyButton({ text, label }) {
  const [state, setState] = useState("idle");
  const copy = () => {
    navigator.clipboard.writeText(text);
    setState("copied");
    setTimeout(() => setState("idle"), 2000);
  };
  return (
    <button onClick={copy} style={{
      padding: "5px 12px",
      borderRadius: "4px",
      border: state === "copied" ? "1px solid #f59e0b" : "1px solid #1e2d40",
      background: state === "copied" ? "rgba(245,158,11,0.1)" : "transparent",
      color: state === "copied" ? "#f59e0b" : "#64748b",
      fontSize: "11px",
      fontFamily: "'Courier New', monospace",
      cursor: "pointer",
      letterSpacing: "0.05em",
      transition: "all 0.15s",
      textTransform: "uppercase"
    }}>
      {state === "copied" ? "✓ COPIED" : `COPY ${label}`}
    </button>
  );
}

export default function Dispatch() {
  const [project, setProject] = useState("ai-learning");
  const [tone, setTone] = useState("raw");
  const [fields, setFields] = useState({ built: "", broke: "", learned: "", next: "" });
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState({ linkedin: 0, twitter: 0 });

  const selectedProject = PROJECTS.find(p => p.id === project);
  const hasMinInput = fields.built.trim().length > 0;

  const toneMap = {
    raw: "Direct, honest, like a senior engineer texting a peer. Short punchy sentences. Admits when things went sideways. No spin.",
    technical: "Technically precise. Specific tool names, API behavior, architecture decisions. Credible to engineers who would fact-check it.",
    reflective: "Thoughtful, connecting the technical work to a broader insight or pattern. Still direct, not preachy."
  };

  const generate = async () => {
    if (!hasMinInput) return;
    setLoading(true);
    setOutput(null);

    const ndaNote = !selectedProject.safe
      ? `CRITICAL: This content is from an NDA-protected workplace. You MUST strip: all client names, org names, internal tool names, proprietary system names, headcounts, revenue figures, specific team structures. Keep only the technical concept or pattern as a universal engineering lesson.`
      : "";

    const filledFields = Object.entries(fields)
      .filter(([, v]) => v.trim())
      .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
      .join("\n");

    const prompt = `You are writing "building in public" posts for a Staff Engineer and AI builder named Kyle. He has a background in AppSec and Platform engineering, builds full-stack apps, and works across AI tooling, automation, and product engineering.

VOICE: ${toneMap[tone]}
Kyle's hard rules: No motivational filler. No humble-brag structure. No "excited to share". No "lessons learned:" headers. Write like a human, not a LinkedIn influencer.

${ndaNote}

Project: ${selectedProject.label}
${filledFields}

Generate exactly TWO posts.

POST 1 — LINKEDIN
- Max 150 words
- Can use line breaks for readability
- End with ONE honest question to the audience (not rhetorical, actually curious)
- Max 2 hashtags at the very end if genuinely relevant, otherwise zero
- Do NOT start with "I" as the first word

POST 2 — X/TWITTER  
- Max 270 characters hard limit
- No hashtags
- Most punchy line from the LinkedIn post, sharpened
- Can start mid-thought, like a hot take or observation

Respond ONLY with valid JSON. No markdown fences. No explanation. No preamble.
{"linkedin":"...","twitter":"..."}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const raw = data.content?.find(b => b.type === "text")?.text || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setOutput(parsed);
      setCharCount({
        linkedin: parsed.linkedin?.length || 0,
        twitter: parsed.twitter?.length || 0
      });
    } catch {
      setOutput({ error: true, message: "Generation failed. Check inputs and retry." });
    }
    setLoading(false);
  };

  const reset = () => {
    setFields({ built: "", broke: "", learned: "", next: "" });
    setOutput(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060a0e",
      color: "#c9d5e0",
      fontFamily: "'Courier New', Courier, monospace",
      padding: "0"
    }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scan { 0%{top:-100%} 100%{top:100%} }
        textarea:focus { outline: none !important; border-color: #f59e0b !important; }
        textarea::placeholder { color: #2a3a4a; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: #060a0e; }
        ::-webkit-scrollbar-thumb { background: #1e2d40; border-radius: 2px; }
        .post-card { animation: fadeUp 0.3s ease forwards; }
      `}</style>

      {/* Scanline overlay */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: "none", zIndex: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)"
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: "40px", borderBottom: "1px solid #0e1a26", paddingBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#f59e0b",
              boxShadow: "0 0 12px #f59e0b, 0 0 24px rgba(245,158,11,0.4)"
            }} />
            <span style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#2a4a6a", textTransform: "uppercase" }}>
              DISPATCH // BUILDING IN PUBLIC
            </span>
          </div>
          <h1 style={{
            fontSize: "28px", fontWeight: "700", margin: "0 0 4px",
            color: "#e8f0f8", letterSpacing: "-0.02em",
            fontFamily: "'Courier New', monospace"
          }}>
            Kyle's Dispatch<CursorBlink />
          </h1>
          <p style={{ fontSize: "12px", color: "#2a4a6a", margin: 0, letterSpacing: "0.05em" }}>
            What you built → LinkedIn + X, ready to post
          </p>
        </div>

        {/* Project selector */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ fontSize: "10px", color: "#2a4a6a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>
            01 / PROJECT
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {PROJECTS.map(p => (
              <button
                key={p.id}
                onClick={() => setProject(p.id)}
                title={p.hint}
                style={{
                  padding: "8px 16px",
                  borderRadius: "3px",
                  border: project === p.id ? "1px solid #f59e0b" : "1px solid #0e1a26",
                  background: project === p.id ? "rgba(245,158,11,0.08)" : "rgba(14,26,38,0.4)",
                  color: project === p.id ? "#f59e0b" : "#3a5a7a",
                  fontSize: "12px",
                  fontFamily: "'Courier New', monospace",
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                  transition: "all 0.15s"
                }}
              >
                {p.emoji} {p.label}
              </button>
            ))}
          </div>
          {!selectedProject.safe && (
            <div style={{
              marginTop: "8px", padding: "8px 12px",
              background: "rgba(245,158,11,0.05)",
              border: "1px solid rgba(245,158,11,0.15)",
              borderRadius: "3px", fontSize: "11px", color: "#8a6a2a",
              letterSpacing: "0.03em"
            }}>
              ⚠ NDA filter active — client names, org details, proprietary systems will be stripped
            </div>
          )}
        </div>

        {/* Tone selector */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ fontSize: "10px", color: "#2a4a6a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>
            02 / VOICE
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {TONES.map(t => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "3px",
                  border: tone === t.id ? "1px solid rgba(245,158,11,0.5)" : "1px solid #0e1a26",
                  background: tone === t.id ? "rgba(245,158,11,0.05)" : "transparent",
                  color: tone === t.id ? "#c07a20" : "#2a4a6a",
                  fontSize: "11px",
                  fontFamily: "'Courier New', monospace",
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                  transition: "all 0.15s",
                  textTransform: "uppercase"
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input fields */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ fontSize: "10px", color: "#2a4a6a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>
            03 / WHAT HAPPENED
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {FIELDS.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={{
                  display: "block",
                  fontSize: "10px", color: "#3a5a7a",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  marginBottom: "6px"
                }}>
                  {`> ${label}`}
                  {key !== "built" && <span style={{ color: "#1e2d40", marginLeft: "8px" }}>optional</span>}
                </label>
                <textarea
                  value={fields[key]}
                  onChange={e => setFields(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  rows={2}
                  style={{
                    width: "100%",
                    background: "#080c10",
                    border: fields[key] ? "1px solid #1e3a5a" : "1px solid #0e1a26",
                    borderRadius: "3px",
                    padding: "10px 14px",
                    color: "#a0b8cc",
                    fontSize: "13px",
                    resize: "vertical",
                    boxSizing: "border-box",
                    fontFamily: "'Courier New', monospace",
                    lineHeight: "1.6",
                    transition: "border-color 0.15s"
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "36px" }}>
          <button
            onClick={generate}
            disabled={loading || !hasMinInput}
            style={{
              flex: 1,
              padding: "13px",
              borderRadius: "3px",
              border: "none",
              background: loading || !hasMinInput
                ? "#0e1a26"
                : "linear-gradient(135deg, #b45309, #f59e0b)",
              color: loading || !hasMinInput ? "#2a4a6a" : "#060a0e",
              fontSize: "13px",
              fontWeight: "700",
              fontFamily: "'Courier New', monospace",
              cursor: loading || !hasMinInput ? "not-allowed" : "pointer",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              transition: "all 0.2s"
            }}
          >
            {loading ? "TRANSMITTING..." : "▶ GENERATE DISPATCH"}
          </button>
          {(output || Object.values(fields).some(v => v)) && (
            <button
              onClick={reset}
              style={{
                padding: "13px 20px",
                borderRadius: "3px",
                border: "1px solid #0e1a26",
                background: "transparent",
                color: "#2a4a6a",
                fontSize: "11px",
                fontFamily: "'Courier New', monospace",
                cursor: "pointer",
                letterSpacing: "0.1em",
                textTransform: "uppercase"
              }}
            >
              CLR
            </button>
          )}
        </div>

        {/* Output */}
        {output && !output.error && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{
              fontSize: "10px", color: "#2a4a6a",
              letterSpacing: "0.15em", textTransform: "uppercase",
              marginBottom: "4px",
              display: "flex", alignItems: "center", gap: "8px"
            }}>
              <span style={{ color: "#f59e0b" }}>●</span> OUTPUT READY
            </div>

            {[
              { key: "linkedin", label: "LINKEDIN", limit: 150, charKey: "linkedin" },
              { key: "twitter", label: "X / TWITTER", limit: 270, charKey: "twitter" }
            ].map(({ key, label, limit, charKey }) => (
              <div key={key} className="post-card" style={{
                background: "#080c10",
                border: "1px solid #0e1a26",
                borderRadius: "3px",
                padding: "20px",
                borderLeft: "2px solid rgba(245,158,11,0.4)"
              }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: "14px"
                }}>
                  <span style={{
                    fontSize: "10px", color: "#f59e0b",
                    letterSpacing: "0.15em", fontWeight: "700"
                  }}>
                    {label}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{
                      fontSize: "10px",
                      color: charCount[charKey] > limit * 1.2 ? "#ef4444" : "#2a4a6a",
                      letterSpacing: "0.05em"
                    }}>
                      {charCount[charKey]} chars
                    </span>
                    <CopyButton text={output[key]} label={label} />
                  </div>
                </div>
                <p style={{
                  fontSize: "14px", lineHeight: "1.7",
                  color: "#8aa4bc", margin: 0,
                  whiteSpace: "pre-wrap", fontFamily: "system-ui, sans-serif"
                }}>
                  {output[key]}
                </p>
              </div>
            ))}

            <div style={{
              padding: "10px 14px",
              background: "rgba(14,26,38,0.4)",
              border: "1px solid #0e1a26",
              borderRadius: "3px",
              fontSize: "10px", color: "#2a4a6a",
              letterSpacing: "0.08em"
            }}>
              NOT HAPPY? Adjust the "What I learned" field for a different angle → regenerate.
              NDA project? Check output carefully before posting.
            </div>
          </div>
        )}

        {output?.error && (
          <div style={{
            padding: "16px", borderRadius: "3px",
            background: "rgba(239,68,68,0.05)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#7a2a2a", fontSize: "12px",
            fontFamily: "'Courier New', monospace",
            letterSpacing: "0.05em"
          }}>
            ✗ {output.message}
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: "60px", paddingTop: "20px",
          borderTop: "1px solid #0a1420",
          display: "flex", justifyContent: "space-between",
          fontSize: "10px", color: "#162030",
          letterSpacing: "0.1em"
        }}>
          <span>CLAUDE DISPATCH v1.0</span>
          <span>KYLE // BUILDING IN PUBLIC</span>
        </div>
      </div>
    </div>
  );
}
