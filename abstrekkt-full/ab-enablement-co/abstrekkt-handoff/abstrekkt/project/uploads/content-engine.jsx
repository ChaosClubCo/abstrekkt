import { useState, useEffect, useRef, useCallback } from "react";

// ─── VOICE FOUNDATION ────────────────────────────────────────────────────────
const VOICE_CORE = `
You are writing in Kyle Rosebrook's exact voice. Kyle is an L1 service desk tech at a managed IT firm who builds AI systems on the side. He founded FlashFusion, a B2B AI enablement consultancy. He came up through bartending (O'Toole's), quality control, and self-taught engineering. He is not a senior engineer, not a credentials-forward expert — he is a builder who earned pattern recognition through substrate-switching.

═══ STRUCTURAL MOVES ═══
THE ANTI-CREDENTIAL OPENER:
YES: "I'm not a security professional. I'm an L1 service desk tech who builds AI apps on the side."
NO:  "As an AI practitioner and founder, I've seen a lot of workflows..."

THE SAME-SKILL-DIFFERENT-SUBSTRATE MOVE:
YES: "The diagnostic instinct I developed reading drunks at the bar worked on processes in QC. Same instinct. Different substrate. I learned a Ludovico Einaudi piece on piano without knowing the note names — just memorized the shape. Same thing."
NO:  "I've always been good at reading situations across many domains."

THE CONSTRAINT REFRAME:
YES: "Constraints free you up. Permission paralyzes you."
NO:  "Embrace your limitations and turn them into strengths."

THE COMPANION PIECE OBSERVATION:
YES: "Good work doesn't distribute itself. It needs other work in front of it."
NO:  "Make sure you have a content strategy in place."

═══ VOICE RULES ═══
DECLARATIVE OBSERVATIONS, NOT PERFORMED INSIGHT:
YES: "I stopped prompting for outputs. I started designing flows."
NO:  "I had a major realization that changed the way I think about AI forever."

TECHNICAL DESCRIPTIONS OF EMOTIONAL STATES:
YES: "The cognitive architecture I was born with stopped working the way it used to. Recovery assumes there's something to go back to. That wasn't the situation."
NO:  "It was a really hard time and I struggled a lot."

SPECIFICITY — always name the thing:
YES: "Supabase ships with RLS disabled by default — every row readable by anyone with your anon key. Wiz found Moltbook's data within minutes."
NO:  "AI tools can have security vulnerabilities."

SENTENCE VARIATION:
Short. Then a longer one that earns its space. Then short again.

CLOSERS (in order of preference):
1. Paradox: "The boring habits compound. The clever ones don't."
2. Reframe: "It's a comment, not authentication."
3. The plus move: "Quality plus verification. The plus is the entire job."
4. Declarative: "Lane discipline matters."
NEVER: questions, invitations, "I hope this helps," upswing endings.

═══ HARD BANS ═══
BANNED PHRASES (zero tolerance):
"in today's world" / "leverage AI" / "harness the power of" / "game-changer" / "paradigm shift" /
"at the end of the day" / "and that's when I realized" / "I hope this helps" / "let's dive in" /
"unpacking" / "food for thought" / "it goes without saying"

BANNED OPENER: Never open with a question. Statement hooks only.
NO PERFORMED VULNERABILITY. NO HUMBLE BRAG. NO ADVICE-GIVING TONE. NO SOFT CLOSERS.
NO EMOJIS. NO HASHTAGS. NO INFLATED CREDENTIALS (~30 tools, not 200+).
`;

// ─── CRITIC PROMPT ───────────────────────────────────────────────────────────
const CRITIC_PROMPT = `You are a voice critic for Kyle Rosebrook's writing. Your job is to check generated content for violations and return a structured audit.

Check for these violations:
1. QUESTION_OPENER — does the piece open with a question?
2. BANNED_PHRASE — any of these present: "in today's world", "leverage AI", "harness the power", "game-changer", "paradigm shift", "at the end of the day", "and that's when I realized", "I hope this helps", "let's dive in", "unpacking", "food for thought", "it goes without saying"
3. SOFT_CLOSER — ends with a question, invitation, "let me know", "what do you think", or upswing
4. PERFORMED_INSIGHT — "I had a realization", "this changed everything", "eye-opening", "this blew my mind"
5. ADVICE_TONE — "you should", "here are X things you need to", "make sure you", coaching voice directed at reader
6. VAGUE_CLAIM — a claim that could apply to any AI article, no specific tool/incident/number named
7. CREDENTIAL_INFLATION — claims 200+ tools, enterprise-scale, implies senior engineer status

Respond ONLY with this JSON (no markdown, no explanation):
{
  "pass": true or false,
  "violations": ["VIOLATION_TYPE: brief description of exact issue"],
  "fixInstructions": "Specific rewrite instructions if pass=false, empty string if pass=true"
}`;

// ─── DETECT PROMPT ───────────────────────────────────────────────────────────
const DETECT_PROMPT = `You are a content format classifier for Kyle Rosebrook's content engine.

Given source content, determine which output format would produce the highest-value piece in Kyle's voice.

Formats available:
- linkedin_hot_take: Best for: contrarian angles, practitioner takes, short provocations. Source has a clear counter-thesis to the dominant narrative.
- x_thread: Best for: step-by-step arguments, multi-point cases, things that build. Source has sequential logic worth preserving.
- essay_brief: Best for: complex ideas needing full development, topics with a construction/diagnostic lens, Load-Bearing newsletter essay candidates.
- newsletter_section: Best for: tool spotlights, workflow observations, things Kyle has tested or can verify from experience.
- reading_room: Best for: personal intersection of AI + construction-not-recovery frame, topics requiring Kyle's backstory as evidence, longer-form meditative pieces.

Respond ONLY with this JSON (no markdown, no explanation):
{
  "format": "format_key",
  "confidence": "high" or "medium" or "low",
  "reason": "One sentence: why this format, what angle it unlocks"
}`;

// ─── FORMATS ─────────────────────────────────────────────────────────────────
const FORMATS = {
  linkedin_hot_take: {
    label: "LinkedIn Hot Take",
    badge: "HOT TAKE",
    color: "purple",
    description: "Contrarian angle · 250–450 words · Prose, no bullets",
    system: `${VOICE_CORE}
TASK: LinkedIn Hot Take
STRUCTURE: Contrarian hook → Justification with named specifics → Concrete case → Paradox or reframe closer
LENGTH: 250–450 words
FORMAT: Prose paragraphs with intentional line breaks. No bullet lists. No bold headers. No emojis. No hashtags.
The angle: what the source content's audience is missing — not a summary, not agreement. Practitioner to practitioner. Not coaching.
Output ONLY the post text.`,
  },
  x_thread: {
    label: "X Thread",
    badge: "THREAD",
    color: "cyan",
    description: "6–8 numbered tweets · Each standalone · Statement hooks only",
    system: `${VOICE_CORE}
TASK: X / Twitter Thread
STRUCTURE:
- [1]: Hook — one declarative contrarian statement. Never a question. Max tension, minimum words.
- [2–4]: Build the argument. Each tweet specific — name the tool, failure mode, number.
- [5]: The turn — what most people miss from the dominant take.
- [6–7]: Closer — punchy paradox or reframe.
- [8] optional: "Who this is for" move.
FORMAT: Number each tweet [1/7] etc. Max 280 chars per tweet. Each tweet standalone. No emojis. No hashtags.
Output ONLY the numbered thread.`,
  },
  essay_brief: {
    label: "Essay Brief",
    badge: "BRIEF",
    color: "pink",
    description: "Load-Bearing essay candidate · Fully structured · Verify flags included",
    system: `${VOICE_CORE}
TASK: Load-Bearing Essay Brief
CONTEXT: Load-Bearing newsletter — "AI tested in real life — no hype, no sales pitch, just what holds." Essays must be written only from experience. The failure mode: a piece that could appear in any AI newsletter.

OUTPUT (exact headers):
**Working Title:** [Punchy. Not a question. Not a listicle.]
**Thesis:** [1–2 sentences. Falsifiable. Not "explores the relationship between X and Y."]
**Construction Lens:** [How Kyle's diagnostic instinct maps onto this topic. Specific.]
**Hook Draft:** [2–3 opening sentences that set up tension WITHOUT stating thesis.]
**Key Beats (3–5):** [Ordered specific moves the essay makes.]
**Closer Direction:** [Paradox or declarative reframe.]
**Load-Bearing Fit:** [One sentence on what Kyle's direct experience adds that analysis can't.]
**Verify Flags:** [Claims needing ground-truth confirmation. "None flagged" if clean.]`,
  },
  newsletter_section: {
    label: "Newsletter Section",
    badge: "SECTION",
    color: "cyan",
    description: "150–250 words · Load-Bearing voice · Honest about where things break",
    system: `${VOICE_CORE}
TASK: Load-Bearing Newsletter Section
PICK ONE based on source: TOOL SPOTLIGHT or WORKFLOW OBSERVATION
FORMAT: 150–250 words. No headers. No bullets. Opens with what it does — not hype. If there's a failure case — name it. Ends with one declarative takeaway. No CTA.
YES: "The pattern that produces Moltbooks isn't ignorance. It's velocity without a checklist."
NO:  "Overall this is a really powerful tool and I'd encourage you to check it out!"
Output ONLY the section text.`,
  },
  reading_room: {
    label: "Reading Room",
    badge: "READING ROOM",
    color: "brass",
    description: "Personal long-form · 600–1200 words · Construction lens · flashfusion.co byline",
    system: `${VOICE_CORE}
TASK: Reading Room Essay — flashfusion.co personal byline voice.
EDITORIAL FRAME (non-negotiable):
- Construction, not recovery. No clean arc. No epiphanies. No "and that's when everything changed."
- Contradictions are material, not problems to resolve.
- Diagnostic instinct lens available: reading rooms (O'Toole's) → reading processes (QC) → reading systems (engineering). Same skill. Different substrates. Use when it fits naturally.
- Technical description of states over emotional labeling.
  YES: "Recovery assumes there's something to go back to. That wasn't the situation. So I started building instead."
  NO:  "It was a really difficult time and I had to find a way forward."
- Humor is dry. Never signal the punchline. Strategic profanity available, rare, earned.

STRUCTURE: Hook (drop into the middle) → Turn (what dominant framing misses) → Construction move → Landing (paradox or declarative, feels inevitable)
LENGTH: 600–1,200 words. Don't pad.
GENRE REGISTER: Solomon, Maté, Cahalan — specificity without self-pity, system analysis through personal case.
Output ONLY the essay text.`,
  },
};

// ─── BADGE STYLES ────────────────────────────────────────────────────────────
const BADGE = {
  purple: { bg: "rgba(168,85,247,0.15)", color: "#A855F7", border: "rgba(168,85,247,0.4)" },
  cyan:   { bg: "rgba(34,211,238,0.15)", color: "#22D3EE", border: "rgba(34,211,238,0.4)" },
  pink:   { bg: "rgba(244,114,182,0.15)", color: "#F472B6", border: "rgba(244,114,182,0.4)" },
  brass:  { bg: "rgba(201,169,110,0.15)", color: "#c9a96e", border: "rgba(201,169,110,0.4)" },
  auto:   { bg: "rgba(74,222,128,0.12)",  color: "#4ade80", border: "rgba(74,222,128,0.35)" },
};

const CONFIDENCE_COLOR = { high: "#4ade80", medium: "#fbbf24", low: "#f87171" };

// ─── API CALL ─────────────────────────────────────────────────────────────────
async function callClaude(system, userContent, maxTokens = 1000) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: userContent }],
    }),
  });
  const data = await res.json();
  if (!data.content?.[0]?.text) throw new Error(data.error?.message || "No response");
  return data.content[0].text;
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function ContentEngine() {
  const [input, setInput]           = useState("");
  const [format, setFormat]         = useState("linkedin_hot_take");
  const [autoMode, setAutoMode]     = useState(true);
  const [output, setOutput]         = useState("");
  const [loading, setLoading]       = useState(false);
  const [copied, setCopied]         = useState(false);
  const [error, setError]           = useState("");

  // Auto-detect state
  const [detecting, setDetecting]   = useState(false);
  const [detected, setDetected]     = useState(null); // { format, confidence, reason }
  const detectTimer                 = useRef(null);

  // Self-heal state
  const [healing, setHealing]       = useState(false);
  const [healLog, setHealLog]       = useState([]); // ["Pass 1: Fixed SOFT_CLOSER, BANNED_PHRASE"]
  const [healCycles, setHealCycles] = useState(0);

  const cfg  = FORMATS[format];
  const badge = BADGE[cfg.color];

  // ── Auto-detect on input change (debounced 900ms) ──
  useEffect(() => {
    if (!autoMode || input.trim().length < 80) {
      setDetected(null);
      return;
    }
    clearTimeout(detectTimer.current);
    detectTimer.current = setTimeout(async () => {
      setDetecting(true);
      try {
        const raw = await callClaude(DETECT_PROMPT, `Source content:\n\n${input}`, 200);
        const clean = raw.replace(/```json|```/g, "").trim();
        const result = JSON.parse(clean);
        setDetected(result);
        if (autoMode && result.format && FORMATS[result.format]) {
          setFormat(result.format);
        }
      } catch {
        setDetected(null);
      } finally {
        setDetecting(false);
      }
    }, 900);
    return () => clearTimeout(detectTimer.current);
  }, [input, autoMode]);

  // ── Generate + self-heal loop ──
  const generate = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setOutput("");
    setError("");
    setHealLog([]);
    setHealCycles(0);

    try {
      let current = await callClaude(cfg.system, `Source content:\n\n${input}\n\nGenerate the output now.`);
      let cycles = 0;
      const MAX_HEAL = 2;
      const log = [];

      // Self-heal loop
      while (cycles < MAX_HEAL) {
        setHealing(true);
        const auditRaw = await callClaude(
          CRITIC_PROMPT,
          `Content to audit:\n\n${current}`,
          300
        );
        const auditClean = auditRaw.replace(/```json|```/g, "").trim();
        let audit;
        try { audit = JSON.parse(auditClean); } catch { break; }

        if (audit.pass) break;

        cycles++;
        const issues = audit.violations?.join(", ") || "voice violations";
        log.push(`Heal ${cycles}: ${issues}`);
        setHealLog([...log]);
        setHealCycles(cycles);

        // Regenerate with critique injected
        current = await callClaude(
          cfg.system,
          `Source content:\n\n${input}\n\nPrevious attempt had these violations that MUST be fixed:\n${audit.fixInstructions}\n\nViolations detected: ${audit.violations?.join("; ")}\n\nGenerate a corrected version now.`
        );
      }

      setHealing(false);
      setOutput(current);
    } catch (e) {
      setError(e.message || "Request failed.");
    } finally {
      setLoading(false);
      setHealing(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => { setInput(""); setOutput(""); setError(""); setDetected(null); setHealLog([]); };

  const wordCount = output.split(/\s+/).filter(Boolean).length;

  const statusLabel = healing
    ? `Self-healing… (pass ${healCycles + 1})`
    : loading
    ? "Generating…"
    : `Generate ${cfg.label}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&family=Fraunces:ital,wght@0,400;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse  { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        .fmt-btn:hover    { border-color: rgba(168,85,247,0.4) !important; color: #CBD5E1 !important; }
        .gen-btn:hover:not(:disabled) { opacity:0.87; box-shadow:0 0 20px rgba(168,85,247,0.4); }
        .copy-btn:hover   { background: rgba(168,85,247,0.2) !important; }
        textarea:focus    { outline:none; border-color:#A855F7 !important; box-shadow:0 0 0 3px rgba(168,85,247,0.14); }
        .out-block        { animation: fadeIn 0.28s ease forwards; }
        .reading-room-out { font-family:'Fraunces',Georgia,serif !important; font-size:16px !important; line-height:1.82 !important; }
        .detecting-pulse  { animation: pulse 1.2s ease-in-out infinite; }
        .heal-badge       { animation: fadeIn 0.2s ease forwards; }
      `}</style>

      <div style={{ background:"#0F0618", minHeight:"100vh", padding:"32px 24px 56px", fontFamily:"'Inter',system-ui,sans-serif", color:"#F8FAFC", maxWidth:740, margin:"0 auto" }}>

        {/* ── Header ── */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:42, height:42, borderRadius:10, background:"linear-gradient(135deg,#A855F7,#F472B6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:"0 0 20px rgba(168,85,247,0.35)", flexShrink:0 }}>⚡</div>
            <div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:20, background:"linear-gradient(90deg,#A855F7 0%,#F472B6 55%,#22D3EE 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                Content Engine
              </div>
              <div style={{ fontSize:12, color:"#64748B", marginTop:2 }}>Article → production content in your voice</div>
            </div>
          </div>
          {/* Auto mode toggle */}
          <button onClick={() => setAutoMode(a => !a)}
            style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 14px", borderRadius:8, background: autoMode ? "rgba(74,222,128,0.1)" : "#1A0B2E", border:`1px solid ${autoMode ? "rgba(74,222,128,0.35)" : "rgba(168,85,247,0.2)"}`, color: autoMode ? "#4ade80" : "#64748B", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 200ms", flexShrink:0 }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background: autoMode ? "#4ade80" : "#475569", boxShadow: autoMode ? "0 0 6px #4ade80" : "none", flexShrink:0 }} />
            {autoMode ? "Auto" : "Manual"}
          </button>
        </div>

        {/* ── Format Tabs ── */}
        <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
          {Object.entries(FORMATS).map(([key, f]) => {
            const active = format === key;
            const b = BADGE[f.color];
            const isDetected = detected?.format === key;
            return (
              <button key={key} className="fmt-btn"
                onClick={() => { setFormat(key); setOutput(""); setError(""); setHealLog([]); }}
                style={{ padding:"8px 15px", borderRadius:8, background: active ? b.bg : "#1A0B2E", border:`1px solid ${active ? b.border : isDetected ? "rgba(74,222,128,0.3)" : "rgba(168,85,247,0.15)"}`, color: active ? "#F8FAFC" : "#64748B", fontSize:13, fontWeight:500, cursor:"pointer", backdropFilter:"blur(12px)", transition:"all 140ms", position:"relative", boxShadow: active ? `0 0 12px ${b.bg}` : "none" }}>
                {f.label}
                {isDetected && !active && (
                  <span style={{ position:"absolute", top:-4, right:-4, width:8, height:8, borderRadius:"50%", background:"#4ade80", boxShadow:"0 0 6px #4ade80" }} />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Auto-detect Result ── */}
        {(detecting || detected) && (
          <div style={{ marginBottom:16, padding:"10px 16px", background:"rgba(74,222,128,0.06)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:8, display:"flex", alignItems:"center", gap:10 }}>
            {detecting ? (
              <><span className="detecting-pulse" style={{ fontSize:11, color:"#4ade80", fontFamily:"'JetBrains Mono',monospace" }}>Detecting best format…</span></>
            ) : detected ? (
              <>
                <span style={{ fontSize:11, color:"#4ade80", fontFamily:"'JetBrains Mono',monospace", flexShrink:0 }}>
                  AUTO →
                </span>
                <span style={{ fontSize:12, color:"#CBD5E1", flex:1 }}>{detected.reason}</span>
                <span style={{ fontSize:10, color: CONFIDENCE_COLOR[detected.confidence] || "#4ade80", fontFamily:"'JetBrains Mono',monospace", flexShrink:0, textTransform:"uppercase" }}>
                  {detected.confidence}
                </span>
              </>
            ) : null}
          </div>
        )}

        {/* ── Format Description ── */}
        <div style={{ marginBottom:24, padding:"9px 16px", background:"rgba(168,85,247,0.05)", border:"1px solid rgba(168,85,247,0.1)", borderRadius:8, fontSize:12, color:"#94A3B8", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ color:badge.color }}>→</span>{cfg.description}
        </div>

        {/* ── Input ── */}
        <div style={{ marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <label style={{ fontSize:13, fontWeight:500, color:"#CBD5E1" }}>Source content</label>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              {input && <button onClick={clear} style={{ background:"none", border:"none", fontSize:11, color:"#475569", cursor:"pointer", padding:0 }}>Clear</button>}
              <span style={{ fontSize:11, color:"#475569" }}>{input.length.toLocaleString()} chars</span>
            </div>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={autoMode ? "Paste anything — format auto-detects as you type." : "Paste article, notes, or raw idea."}
            rows={9}
            style={{ width:"100%", background:"rgba(15,6,24,0.85)", border:"1px solid rgba(168,85,247,0.18)", borderRadius:12, padding:"16px", fontFamily:"'Inter',system-ui,sans-serif", fontSize:14, color:"#F8FAFC", lineHeight:1.65, resize:"vertical", transition:"border-color 150ms,box-shadow 150ms" }}
          />
        </div>

        {/* ── Generate Button ── */}
        <button className="gen-btn" onClick={generate} disabled={loading || healing || !input.trim()}
          style={{ width:"100%", padding:"14px 24px", borderRadius:12, background: loading || !input.trim() ? "rgba(168,85,247,0.2)" : "linear-gradient(90deg,#A855F7 0%,#F472B6 55%,#22D3EE 100%)", border:"none", color: loading || !input.trim() ? "rgba(248,250,252,0.35)" : "#fff", fontFamily:"'Poppins',sans-serif", fontSize:14, fontWeight:600, cursor: loading || !input.trim() ? "not-allowed" : "pointer", transition:"opacity 150ms,box-shadow 200ms", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          {(loading || healing) && <span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite", display:"inline-block" }} />}
          {statusLabel}
        </button>

        {/* ── Heal Log ── */}
        {healLog.length > 0 && (
          <div style={{ marginBottom:16, display:"flex", flexWrap:"wrap", gap:8 }}>
            {healLog.map((entry, i) => (
              <span key={i} className="heal-badge" style={{ padding:"4px 12px", borderRadius:999, background:"rgba(251,191,36,0.1)", border:"1px solid rgba(251,191,36,0.3)", fontSize:11, color:"#fbbf24", fontFamily:"'JetBrains Mono',monospace" }}>
                ⟳ {entry}
              </span>
            ))}
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div style={{ background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.25)", borderRadius:8, padding:"12px 16px", fontSize:13, color:"#f87171", marginBottom:16 }}>
            {error}
          </div>
        )}

        {/* ── Output ── */}
        {output && (
          <div className="out-block" style={{ background:"rgba(15,6,24,0.6)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", border:`1px solid ${badge.border}`, borderRadius:16, padding:24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:11, fontWeight:600, color:"#64748B", letterSpacing:"0.08em", textTransform:"uppercase" }}>Output</span>
                {healLog.length > 0 && (
                  <span style={{ padding:"2px 8px", borderRadius:999, background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.3)", fontSize:10, color:"#4ade80", fontFamily:"'JetBrains Mono',monospace" }}>
                    ✓ healed ×{healLog.length}
                  </span>
                )}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button className="copy-btn" onClick={copy}
                  style={{ padding:"6px 14px", borderRadius:8, background:"rgba(168,85,247,0.1)", border:"1px solid rgba(168,85,247,0.3)", color: copied ? "#4ade80" : "#A855F7", fontSize:12, fontWeight:500, cursor:"pointer", transition:"all 150ms" }}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
                <button onClick={() => { setOutput(""); setHealLog([]); }}
                  style={{ padding:"6px 14px", borderRadius:8, background:"none", border:"1px solid rgba(168,85,247,0.12)", color:"#475569", fontSize:12, cursor:"pointer" }}>
                  Clear
                </button>
              </div>
            </div>
            <div className={format === "reading_room" ? "reading-room-out" : ""}
              style={{ fontSize:14, lineHeight:1.75, color:"#CBD5E1", whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
              {output}
            </div>
            <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid rgba(168,85,247,0.1)", fontSize:11, color:"#475569", display:"flex", justifyContent:"space-between" }}>
              <span>{wordCount} words</span>
              <span style={{ color:badge.color, opacity:0.7 }}>claude-sonnet-4-6</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
