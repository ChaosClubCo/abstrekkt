import { useState } from "react";

// ─── Voice Rules (from 03-style.md + KYLE_DESIGN.md) ───────────────────────
const RULES = [
  {
    id: "01",
    rule: "Open by reading the room",
    detail: "Start with the problem the reader is already feeling. Not your thesis. Not an announcement.",
    strong: "\"I've built fifty of them. The number sounds impressive until you look at what actually happened.\"",
    drift: "\"The argument against vibe-coded apps is wrong.\" → Opens with your position, not the reader's problem.",
    fix: "Start in the tension. What's the reader already carrying into this piece?"
  },
  {
    id: "02",
    rule: "End with observation, not summary",
    detail: "Closer order: Paradox → Reframe → The plus move → Declarative. Never warm. Never summarizing.",
    strong: "\"The factory is the failure pattern, not the planning session.\"",
    drift: "A closer that re-explains the argument. If it could appear under a takeaway bullet, rewrite it.",
    fix: "Last sentence should make the reader sit, not nod."
  },
  {
    id: "03",
    rule: "Technical precision carries emotional weight",
    detail: "Feelings described with the specificity of a bug report. No adjectives. Find the system metaphor.",
    strong: "\"The documentation isn't organization. It's the place I keep things when my head won't.\"",
    drift: "Describing emotional states with emotional words instead of system failures.",
    fix: "Find the system. Remove the feeling word. Let the metaphor carry it."
  },
  {
    id: "04",
    rule: "Short. Then longer. Short to close.",
    detail: "Sentence length is punctuation. If your paragraph runs at the same pace throughout, it's broken.",
    strong: "\"Recovery assumes returning to a previous state. There was nothing to return to. So I built.\"",
    drift: "Long uniform paragraphs — every sentence at the same weight, no variation.",
    fix: "Find your longest sentence. Does it earn its space? Find your current closer. Is it the shortest?"
  },
  {
    id: "05",
    rule: "No editorial tells",
    detail: "Don't signal what's coming. Don't explain the structure. The signpost IS the problem.",
    strong: "Showing the pattern directly without naming that you're about to show it.",
    drift: "\"Here's what actually happened:\" cuts trust immediately. So does \"Looking back...\"",
    fix: "Delete the tell. Start the next sentence. The paragraph works without it."
  },
  {
    id: "06",
    rule: "Same skill, different substrate",
    detail: "The diagnostic instinct applied to a new domain. Show the transfer, don't name it.",
    strong: "\"The diagnostic instinct I developed reading drunks at the bar worked on processes in QC. Same instinct. Different substrate.\"",
    drift: "Claiming the insight without showing the parallel. Naming the transfer instead of performing it.",
    fix: "Put the original context and the new one in the same sentence. Let the parallel do the work."
  }
];

const BANS = [
  "in today's world", "leverage AI", "harness the power of", "game-changer",
  "paradigm shift", "at the end of the day", "and that's when I realized",
  "I hope this helps", "let's dive in", "unpacking", "food for thought",
  "it goes without saying", "unlock your potential", "looking back",
  "rock bottom became", "grateful for the journey", "here's what actually happened"
];

const DRIFT_FINDINGS = [
  {
    title: "The Announcement Opener",
    source: "\"The Floor Isn't the Code\" — May 2026",
    quote: "\"The argument against vibe-coded apps is wrong.\"",
    problem: "Opens with your thesis as a declaration. The rule: open with the problem the reader is already feeling, not your position on it. The reader hasn't agreed to care yet.",
    fix: "The skills essay does this better: \"I've built fifty of them. The number sounds impressive until you look at what actually happened.\" That's tension before thesis. Model from that.",
    severity: "medium"
  },
  {
    title: "The Editorial Tell",
    source: "\"The Floor Isn't the Code\" — May 2026",
    quote: "\"Here's what actually happened:\"",
    problem: "Signals you're about to explain what the reader just missed. It implies the reader needed a tour guide. Cuts trust. Your documented voice doesn't need signposting — it shows the thing.",
    fix: "Delete the tell entirely. Start the next sentence. The paragraph is stronger without the preamble.",
    severity: "high"
  },
  {
    title: "Register Break (Marketing into Editorial)",
    source: "Mid-article FlashFusion CTA",
    quote: "\"AI implementation without the gap between capability and judgment — that's what FlashFusion is built around.\"",
    problem: "Marketing copy inserted into editorial voice. A different register. The reader felt the shift even if they couldn't name it.",
    fix: "Match the voice: \"That gap is what FlashFusion exists to close.\" Flatter. Plainer. Still sells. Or cut it — the piece earned the mention through the argument itself.",
    severity: "high"
  }
];

// ─── API Audit Prompt ────────────────────────────────────────────────────────
const VOICE_PROMPT = `You are auditing writing against Kyle Rosebrook's documented voice. Kyle is a self-taught engineer (bartender → QC → service desk → founder). His memoir is titled "Construction, Not Recovery." He writes Load-Bearing (newsletter) and hot takes for FlashFusion.

VOICE:
Declarative. Specific. No ascent. Short sentences. Then a longer one that earns its space. Then short again. Pattern detected → stated flat → implication left to reader.

RULES:
1. Open by reading the room — start with the problem the reader is already feeling. NOT an announcement or thesis declaration.
2. End with observation only — paradox, reframe, declarative. Never summary. Never "here's what I learned."
3. Technical precision carries emotional weight — describe feelings as system failures, not adjectives.
4. Short. Then longer. Short to close. Sentence length is punctuation.
5. No editorial tells — "Here's what actually happened:" / "Looking back..." / "And that's when I realized..."
6. Same-skill-different-substrate — show the transfer of diagnostic instinct across domains.

NEVER: "in today's world" / "leverage AI" / "harness the power of" / "game-changer" / "paradigm shift" / "at the end of the day" / "and that's when I realized" / "I hope this helps" / "let's dive in" / "unpacking" / "food for thought" / opener that begins with a question / closer that summarizes / performed emotion / soft landing

STRONG EXAMPLES from actual writing:
- "Recovery assumes returning to a previous state. There was nothing to return to. So I built."
- "The documentation isn't organization. It's the place I keep things when my head won't."
- "If you've earned the judgment, AI makes you faster. If you haven't, it makes you wrong faster."
- "The skill is a file. The library is the judgment layer."
- "The factory is the failure pattern, not the planning session."
- "Bad routing makes good knowledge useless."

Audit the pasted text. Return EXACTLY this — no markdown headers, no bullets, use these labels verbatim:

SCORE: [X/10] — one sentence saying what the number reflects, specific to this text.

WHAT'S WORKING:
[exact quote] — one sentence on why this is in voice.
[exact quote] — one sentence on why this is in voice.

WHAT'S DRIFTING:
[exact quote] → [ONE-LINE REWRITE in voice] — one sentence on why.
[exact quote] → [ONE-LINE REWRITE in voice] — one sentence on why.

SINGLE BEST FIX:
One specific, actionable change. Not a general principle — a concrete edit you could make in the next five minutes.`;

// ─── Component ───────────────────────────────────────────────────────────────
export default function VoiceAudit() {
  const [tab, setTab] = useState("rules");
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedRule, setExpandedRule] = useState(null);

  async function runAudit() {
    if (text.trim().length < 60) {
      setError("Paste at least a paragraph before auditing.");
      return;
    }
    setError("");
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: `${VOICE_PROMPT}\n\nTEXT TO AUDIT:\n\n${text}` }]
        })
      });
      const data = await res.json();
      const out = data.content?.find(b => b.type === "text")?.text || "No response returned.";
      setResult(out);
    } catch {
      setError("Connection failed. Check network and try again.");
    }
    setLoading(false);
  }

  return (
    <div style={s.root}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div>
            <div style={s.eyebrow}>KYLE ROSEBROOK · WRITING TOOLS</div>
            <h1 style={s.title}>Voice Audit</h1>
          </div>
          <div style={s.tagline}>Reading Room at Midnight</div>
        </div>
      </header>

      {/* Tabs */}
      <nav style={s.tabs}>
        {[
          { id: "rules", label: "Voice Rules" },
          { id: "drift", label: "Drift Findings" },
          { id: "audit", label: "Paste & Audit" }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{ ...s.tabBtn, ...(tab === t.id ? s.tabBtnActive : {}) }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main style={s.main}>

        {/* ── RULES TAB ── */}
        {tab === "rules" && (
          <div>
            <p style={s.lead}>Your documented voice, sourced from 03-style.md and KYLE_DESIGN.md — with examples from your own writing.</p>

            {RULES.map(r => (
              <div key={r.id} style={s.ruleCard}>
                <button
                  onClick={() => setExpandedRule(expandedRule === r.id ? null : r.id)}
                  style={s.ruleHeader}
                >
                  <span style={s.ruleNum}>{r.id}</span>
                  <span style={s.ruleName}>{r.rule}</span>
                  <span style={{ ...s.ruleChevron, transform: expandedRule === r.id ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                </button>
                {expandedRule === r.id && (
                  <div style={s.ruleBody}>
                    <p style={s.ruleDetail}>{r.detail}</p>
                    <div style={s.exRow}>
                      <div style={s.exBlock}>
                        <div style={s.exLabel2}>FROM YOUR WRITING — IN VOICE</div>
                        <div style={s.exGood}>{r.strong}</div>
                      </div>
                      <div style={s.exBlock}>
                        <div style={s.exLabel2}>DRIFT PATTERN</div>
                        <div style={s.exBad}>{r.drift}</div>
                      </div>
                    </div>
                    <div style={s.fixRow}>
                      <span style={s.fixLabel}>FIX ›</span>
                      <span style={s.fixText}>{r.fix}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Hard bans */}
            <div style={s.bansCard}>
              <div style={s.bansTitle}>Hard Bans — Zero Tolerance</div>
              <div style={s.bansGrid}>
                {BANS.map(b => (
                  <span key={b} style={s.banTag}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── DRIFT TAB ── */}
        {tab === "drift" && (
          <div>
            <p style={s.lead}>Three specific patterns found reading your actual writing — not generic feedback.</p>

            {DRIFT_FINDINGS.map((d, i) => (
              <div key={i} style={{ ...s.driftCard, borderLeftColor: d.severity === "high" ? "#8b2020" : "#7a5a1c" }}>
                <div style={s.driftHead}>
                  <div style={s.driftTitle}>{d.title}</div>
                  <div style={{ ...s.driftBadge, background: d.severity === "high" ? "rgba(139,32,32,0.25)" : "rgba(122,90,28,0.25)", color: d.severity === "high" ? "#e09090" : "#d4b870" }}>
                    {d.severity === "high" ? "High priority" : "Medium priority"}
                  </div>
                </div>
                <div style={s.driftSource}>{d.source}</div>
                <div style={s.driftQuote}>"{d.quote}"</div>
                <p style={s.driftProblem}>{d.problem}</p>
                <div style={s.driftFixBlock}>
                  <span style={s.driftFixLabel}>FIX</span>
                  <span style={s.driftFixText}>{d.fix}</span>
                </div>
              </div>
            ))}

            {/* Positive call-out */}
            <div style={s.strengthCard}>
              <div style={s.strengthLabel}>STRONGEST PIECE IN THE PROJECT</div>
              <div style={s.strengthTitle}>Essay 07 — "Fifty Skills and What They Actually Taught Me"</div>
              <p style={s.strengthBody}>
                Most consistent voice throughout. The CLAIMS/GAPS footer is genuinely distinctive — nobody else does this. Closers hit hard ("The factory is the failure pattern, not the planning session." / "The skill is a file. The library is the judgment layer."). No editorial tells. No announcement opener. Use this as the baseline template for everything else going forward.
              </p>
            </div>
          </div>
        )}

        {/* ── AUDIT TAB ── */}
        {tab === "audit" && (
          <div>
            <p style={s.lead}>Paste any piece — memoir scene, blog draft, newsletter section, social post. Get line-by-line feedback against your specific voice rules.</p>

            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={"Paste here. Paragraph, section, full draft — anything.\nMemoired scenes, hot takes, Load-Bearing essays, social posts — all fair game."}
              style={s.textarea}
            />

            <div style={s.auditRow}>
              <span style={s.charCount}>{text.length} characters</span>
              <button onClick={runAudit} disabled={loading} style={{ ...s.auditBtn, ...(loading ? s.auditBtnDisabled : {}) }}>
                {loading ? "Auditing..." : "Run Audit →"}
              </button>
            </div>

            {error && <div style={s.errorMsg}>{error}</div>}

            {loading && (
              <div style={s.loadingCard}>
                <div style={s.loadingDot} />
                <span style={s.loadingText}>Reading the room...</span>
              </div>
            )}

            {result && !loading && (
              <div style={s.resultCard}>
                <div style={s.resultLabel}>AUDIT RESULT</div>
                <div style={s.resultDivider} />
                <pre style={s.resultText}>{result}</pre>
              </div>
            )}

            <div style={s.auditNote}>
              The audit prompt includes your full voice rules, hard bans, and five specific examples from your own writing as the standard.
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const INK = "#0a0907";
const PAPER = "#f2efe9";
const BRASS = "#c4935a";
const DIM = "#a09888";
const FAINT = "#6b6557";
const RULE = "rgba(255,255,255,0.07)";
const RULE2 = "rgba(255,255,255,0.04)";

const s = {
  root: {
    background: INK, color: PAPER,
    fontFamily: "'Georgia', 'Times New Roman', serif",
    minHeight: "100vh", fontSize: 15, lineHeight: 1.72
  },
  header: {
    padding: "1.4rem 1.5rem 1.2rem",
    borderBottom: `1px solid ${RULE}`
  },
  headerInner: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-end",
    maxWidth: 740, margin: "0 auto"
  },
  eyebrow: {
    fontFamily: "monospace", fontSize: 9, letterSpacing: "0.12em",
    textTransform: "uppercase", color: FAINT, marginBottom: 4
  },
  title: {
    fontFamily: "'Georgia', serif", fontSize: 22, fontWeight: 400,
    color: PAPER, margin: 0, letterSpacing: "-0.02em"
  },
  tagline: {
    fontFamily: "monospace", fontSize: 9, letterSpacing: "0.1em",
    textTransform: "uppercase", color: FAINT
  },
  tabs: {
    display: "flex", borderBottom: `1px solid ${RULE}`,
    background: INK
  },
  tabBtn: {
    fontFamily: "monospace", fontSize: 10, letterSpacing: "0.09em",
    textTransform: "uppercase", padding: "0.8rem 1.4rem",
    background: "none", border: "none", borderBottom: "2px solid transparent",
    color: FAINT, cursor: "pointer", transition: "all 0.18s"
  },
  tabBtnActive: { color: BRASS, borderBottomColor: BRASS },
  main: { maxWidth: 740, margin: "0 auto", padding: "2rem 1.5rem 5rem" },
  lead: { color: DIM, fontSize: 13, fontStyle: "italic", marginBottom: "1.75rem", lineHeight: 1.7 },

  // Rules
  ruleCard: {
    border: `1px solid ${RULE}`, borderRadius: 4,
    marginBottom: "0.6rem", overflow: "hidden"
  },
  ruleHeader: {
    display: "flex", alignItems: "center", gap: "0.85rem",
    width: "100%", background: "none", border: "none",
    padding: "0.85rem 1rem", cursor: "pointer", textAlign: "left"
  },
  ruleNum: {
    fontFamily: "monospace", fontSize: 9, color: FAINT,
    letterSpacing: "0.05em", minWidth: 20, flexShrink: 0
  },
  ruleName: { color: PAPER, fontSize: 14, fontWeight: 400, flex: 1 },
  ruleChevron: {
    fontFamily: "monospace", color: BRASS, fontSize: 14,
    transition: "transform 0.18s", flexShrink: 0
  },
  ruleBody: {
    padding: "0 1rem 1.1rem 3rem",
    borderTop: `1px solid ${RULE2}`
  },
  ruleDetail: { color: DIM, fontSize: 13, marginBottom: "1rem", marginTop: "0.85rem" },
  exRow: { display: "flex", gap: "0.75rem", marginBottom: "0.85rem", flexWrap: "wrap" },
  exBlock: { flex: "1 1 200px" },
  exLabel2: {
    fontFamily: "monospace", fontSize: 8, letterSpacing: "0.1em",
    textTransform: "uppercase", color: FAINT, marginBottom: 5
  },
  exGood: {
    background: "rgba(196,147,90,0.07)", border: "1px solid rgba(196,147,90,0.18)",
    padding: "0.55rem 0.8rem", borderRadius: 3,
    color: PAPER, fontSize: 12, fontStyle: "italic", lineHeight: 1.65
  },
  exBad: {
    background: "rgba(139,32,32,0.08)", border: "1px solid rgba(139,32,32,0.2)",
    padding: "0.55rem 0.8rem", borderRadius: 3,
    color: PAPER, fontSize: 12, fontStyle: "italic", lineHeight: 1.65
  },
  fixRow: { display: "flex", alignItems: "flex-start", gap: "0.6rem" },
  fixLabel: { fontFamily: "monospace", fontSize: 9, color: BRASS, letterSpacing: "0.08em", flexShrink: 0, paddingTop: 2 },
  fixText: { color: DIM, fontSize: 13 },

  // Bans
  bansCard: {
    background: "rgba(139,32,32,0.05)", border: "1px solid rgba(139,32,32,0.14)",
    borderRadius: 4, padding: "1.1rem", marginTop: "0.75rem"
  },
  bansTitle: {
    fontFamily: "monospace", fontSize: 9, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "#c07070", marginBottom: "0.75rem"
  },
  bansGrid: { display: "flex", flexWrap: "wrap", gap: "0.4rem" },
  banTag: {
    fontFamily: "monospace", fontSize: 10,
    background: "rgba(139,32,32,0.1)", border: "1px solid rgba(139,32,32,0.18)",
    color: "#b08080", padding: "2px 8px", borderRadius: 3
  },

  // Drift
  driftCard: {
    background: "rgba(255,255,255,0.02)", border: `1px solid ${RULE}`,
    borderLeft: "3px solid",
    borderRadius: "0 4px 4px 0", padding: "1.1rem 1.25rem",
    marginBottom: "1rem"
  },
  driftHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  driftTitle: { fontSize: 14, fontWeight: 400, color: PAPER },
  driftBadge: {
    fontFamily: "monospace", fontSize: 8, letterSpacing: "0.08em",
    textTransform: "uppercase", padding: "2px 8px", borderRadius: 3
  },
  driftSource: { fontFamily: "monospace", fontSize: 9, color: FAINT, letterSpacing: "0.04em", marginBottom: 10 },
  driftQuote: {
    background: "rgba(139,32,32,0.07)", border: "1px solid rgba(139,32,32,0.16)",
    padding: "0.6rem 0.85rem", borderRadius: 3,
    color: PAPER, fontSize: 13, fontStyle: "italic", lineHeight: 1.7, marginBottom: 10
  },
  driftProblem: { color: DIM, fontSize: 13, marginBottom: 10, marginTop: 0 },
  driftFixBlock: { display: "flex", gap: "0.6rem", alignItems: "flex-start" },
  driftFixLabel: {
    fontFamily: "monospace", fontSize: 9, color: BRASS,
    letterSpacing: "0.08em", flexShrink: 0, paddingTop: 2
  },
  driftFixText: { color: PAPER, fontSize: 13 },

  strengthCard: {
    background: "rgba(196,147,90,0.05)", border: "1px solid rgba(196,147,90,0.18)",
    borderRadius: 4, padding: "1.25rem", marginTop: "0.5rem"
  },
  strengthLabel: {
    fontFamily: "monospace", fontSize: 8, letterSpacing: "0.12em",
    textTransform: "uppercase", color: BRASS, marginBottom: 5
  },
  strengthTitle: { fontSize: 14, color: PAPER, marginBottom: 8 },
  strengthBody: { color: DIM, fontSize: 13, lineHeight: 1.75 },

  // Audit
  textarea: {
    width: "100%", minHeight: 180,
    background: "rgba(255,255,255,0.025)", border: `1px solid ${RULE}`,
    color: PAPER, fontFamily: "'Georgia', serif", fontSize: 14, lineHeight: 1.75,
    padding: "0.9rem", borderRadius: 3, resize: "vertical",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s"
  },
  auditRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginTop: "0.75rem", marginBottom: "1.1rem"
  },
  charCount: { fontFamily: "monospace", fontSize: 10, color: FAINT },
  auditBtn: {
    background: BRASS, color: INK, fontFamily: "monospace", fontSize: 10,
    letterSpacing: "0.1em", textTransform: "uppercase",
    border: "none", padding: "0.6rem 1.4rem", borderRadius: 3,
    cursor: "pointer", fontWeight: 700
  },
  auditBtnDisabled: { opacity: 0.55, cursor: "not-allowed" },
  errorMsg: { color: "#c07070", fontFamily: "monospace", fontSize: 11, marginBottom: "1rem" },
  loadingCard: {
    display: "flex", alignItems: "center", gap: "0.75rem",
    padding: "1.1rem", border: `1px solid ${RULE}`, borderRadius: 4
  },
  loadingDot: {
    width: 6, height: 6, borderRadius: "50%",
    background: BRASS, animation: "pulse 1.2s ease-in-out infinite"
  },
  loadingText: { fontFamily: "monospace", fontSize: 10, color: FAINT, letterSpacing: "0.06em" },
  resultCard: {
    background: "rgba(255,255,255,0.02)", border: `1px solid ${RULE}`,
    borderRadius: 4, padding: "1.25rem"
  },
  resultLabel: {
    fontFamily: "monospace", fontSize: 8, letterSpacing: "0.12em",
    textTransform: "uppercase", color: BRASS, marginBottom: "0.6rem"
  },
  resultDivider: { height: 1, background: RULE, marginBottom: "1rem" },
  resultText: {
    fontFamily: "'Georgia', serif", fontSize: 14,
    color: PAPER, lineHeight: 1.78, whiteSpace: "pre-wrap", margin: 0
  },
  auditNote: {
    color: FAINT, fontFamily: "monospace", fontSize: 9,
    letterSpacing: "0.04em", marginTop: "1.25rem", lineHeight: 1.7
  }
};
