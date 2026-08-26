import { useState, useEffect, useRef } from "react";

const T = {
  bg:"#0c0c0b",surface:"#111110",card:"#181815",border:"#232320",
  borderHi:"#303030",accent:"#d4893a",accentHi:"#e8a050",text:"#ddd8ce",
  text2:"#807c74",text3:"#3a3835",green:"#5a9c5a",mono:"#7ab878",
  mono2:"#78afc8",red:"#c05050",tag:"#1e1e1a",
};
const F = { serif:"'Playfair Display',Georgia,serif", sans:"'IBM Plex Sans',sans-serif", mono:"'IBM Plex Mono',monospace" };
const radius = "2px";
const tr = "0.15s";

const SYSTEM_PROMPT = `You are a Claude enablement facilitator handling employee objections about using Claude at work. Your role is to give honest, non-hype responses to real concerns.

Rules:
- Be direct. No corporate fluff.
- Acknowledge legitimate concerns honestly before addressing them.
- Don't oversell. If something is genuinely uncertain, say so.
- Keep responses under 200 words.
- Use plain language — not AI marketing speak.
- Structure: acknowledge → address → practical suggestion.

Context: You're in a 1:1 enablement session. The facilitator needs a solid response to give the employee right now, verbally.`;

const PRESET_OBJECTIONS = [
  { label:"Privacy & data", q:"My work data — will Anthropic use it to train future models?" },
  { label:"Job replacement", q:"If Claude can do my job, why should the company keep me?" },
  { label:"Accuracy trust", q:"I've seen it make things up. How can I trust it for real work?" },
  { label:"Too complex", q:"I don't have time to learn a new tool. My workflow already works." },
  { label:"IT policy", q:"Is this even approved for use by IT? What if it violates policy?" },
  { label:"Output quality", q:"The output is generic. It never matches how I actually write or think." },
  { label:"Security", q:"I work with confidential client data. Is it safe to put that in Claude?" },
  { label:"No use case", q:"I understand it helps writers and coders. But I do [other work]. It's not relevant to me." },
];

export default function ObjectionHandler() {
  const [input, setInput]   = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [history, setHistory]   = useState([]);
  const [focusedField, setFocusedField] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `*{box-sizing:border-box;margin:0;padding:0}body{background:${T.bg};color:${T.text};font-family:${F.sans}}`;
    document.head.appendChild(style);
  }, []);

  const handleSubmit = async (question) => {
    const q = (question || input).trim();
    if (!q) { setError("Enter an objection."); return; }

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true); setError(null); setResponse(null);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        signal: abortRef.current.signal,
        body: JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:600,
          system: SYSTEM_PROMPT,
          messages:[{ role:"user", content:`Objection: "${q}"\n\nGive me a facilitator response I can say verbally right now.` }]
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(`API ${res.status}: ${errData.error?.message || res.statusText}`);
      }

      const data = await res.json();
      const text = data.content.filter(b => b.type==="text").map(b => b.text).join("");
      setResponse(text);
      setHistory(h => [{ q, r:text, ts: new Date().toLocaleTimeString() }, ...h.slice(0,9)]);
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const s = {
    root:  { minHeight:"100vh", background:T.bg, padding:"32px 28px", fontFamily:F.sans },
    hdr:   { borderBottom:`1px solid ${T.border}`, paddingBottom:"20px", marginBottom:"28px" },
    title: { fontFamily:F.serif, fontSize:"26px", fontWeight:700, color:T.text, letterSpacing:"-0.5px" },
    sub:   { fontSize:"12px", fontFamily:F.mono, color:T.text2, marginTop:"4px" },
    layout:{ display:"grid", gridTemplateColumns:"240px 1fr", gap:"24px" },
    presetLabel:{ fontFamily:F.mono, fontSize:"10px", letterSpacing:"0.08em", textTransform:"uppercase",
                  color:T.text3, marginBottom:"10px" },
    presetBtn:(active) => ({
      display:"block", width:"100%", textAlign:"left",
      padding:"8px 10px", fontSize:"12px", fontFamily:F.sans,
      background: active ? T.tag : "transparent",
      border:`1px solid ${active ? T.accent : T.border}`,
      borderRadius:radius, color: active ? T.accent : T.text2, cursor:"pointer",
      marginBottom:"5px", transition:`color ${tr}, border-color ${tr}, background ${tr}`,
    }),
    textarea:{ background:T.surface, border:`1px solid ${focusedField ? T.borderHi : T.border}`,
               borderRadius:radius, padding:"10px 12px", fontSize:"13px",
               color:T.text, fontFamily:F.sans, outline:"none", width:"100%",
               resize:"vertical", minHeight:"90px", transition:`border-color ${tr}`, marginBottom:"12px" },
    btn:(dis) => ({
      padding:"10px 20px", fontSize:"12px", fontFamily:F.mono, letterSpacing:"0.06em",
      textTransform:"uppercase", color: dis ? T.text3 : T.bg,
      background: dis ? T.border : T.accent,
      border:"none", borderRadius:radius, cursor: dis ? "not-allowed" : "pointer",
      transition:`background ${tr}`,
    }),
    err:{ background:T.tag, border:`1px solid ${T.red}`, borderRadius:radius,
          padding:"10px 14px", fontSize:"12px", color:T.red, marginBottom:"16px", fontFamily:F.mono },
    responseBox:{ background:T.surface, border:`1px solid ${T.borderHi}`, borderRadius:radius,
                  padding:"16px", marginTop:"16px" },
    responseLabel:{ fontFamily:F.mono, fontSize:"10px", letterSpacing:"0.08em", textTransform:"uppercase",
                    color:T.accent, marginBottom:"10px" },
    responseText:{ fontSize:"14px", color:T.text, lineHeight:"1.7", whiteSpace:"pre-wrap" },
    historyItem:{ background:T.card, border:`1px solid ${T.border}`, borderRadius:radius,
                  padding:"12px", marginBottom:"8px" },
    histQ:{ fontFamily:F.mono, fontSize:"11px", color:T.accent, marginBottom:"6px", lineHeight:"1.4" },
    histR:{ fontSize:"12px", color:T.text2, lineHeight:"1.5" },
    histTs:{ fontFamily:F.mono, fontSize:"10px", color:T.text3, marginTop:"6px" },
    loading:{ display:"flex", alignItems:"center", gap:"8px", marginTop:"16px",
              fontFamily:F.mono, fontSize:"12px", color:T.text2 },
  };

  return (
    <div style={s.root}>
      <div style={s.hdr}>
        <div style={s.title}>◆ Objection Handler</div>
        <div style={s.sub}>ARTIFACT 06 · claude-sonnet-4-6 · 600 max tokens · stateless</div>
      </div>

      <div style={s.layout}>
        {/* Preset objections */}
        <div>
          <div style={s.presetLabel}>Common Objections</div>
          {PRESET_OBJECTIONS.map((p, i) => (
            <button key={i}
                    style={s.presetBtn(input === p.q)}
                    onClick={() => { setInput(p.q); setResponse(null); }}>
              {p.label}
            </button>
          ))}
          {history.length > 0 && (
            <div style={{ marginTop:"20px" }}>
              <div style={s.presetLabel}>Session History</div>
              {history.map((h, i) => (
                <div key={i} style={s.historyItem}>
                  <div style={s.histQ}>"{h.q.length > 60 ? h.q.slice(0,60)+"…" : h.q}"</div>
                  <div style={s.histR}>{h.r.slice(0,120)}…</div>
                  <div style={s.histTs}>{h.ts}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main input/response */}
        <div>
          {error && <div style={s.err}>✗ {error}</div>}

          <div style={{ fontSize:"11px", fontFamily:F.mono, color:T.text2,
                        textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"6px" }}>
            Employee Objection
          </div>
          <textarea
            value={input}
            style={s.textarea}
            placeholder="Type the employee's objection or concern — verbatim if possible…"
            onFocus={() => setFocusedField(true)} onBlur={() => setFocusedField(false)}
            onChange={e => { setInput(e.target.value); setResponse(null); }}
            onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit(); }}
          />
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <button style={s.btn(loading || !input.trim())} disabled={loading || !input.trim()}
                    onClick={() => handleSubmit()}>
              {loading ? "Thinking…" : "◆ Get Response"}
            </button>
            {input && !loading && (
              <button style={{ fontFamily:F.mono, fontSize:"11px", color:T.text3, background:"transparent",
                               border:"none", cursor:"pointer" }}
                      onClick={() => { setInput(""); setResponse(null); }}>
                ✗ clear
              </button>
            )}
            <span style={{ fontFamily:F.mono, fontSize:"11px", color:T.text3, marginLeft:"auto" }}>
              ⌘↵ to submit
            </span>
          </div>

          {loading && (
            <div style={s.loading}>
              <span>◌</span> Generating facilitator response…
            </div>
          )}

          {response && (
            <div style={s.responseBox}>
              <div style={s.responseLabel}>◆ Facilitator Response</div>
              <div style={s.responseText}>{response}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
