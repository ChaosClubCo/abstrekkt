import { useState } from "react";

const KYLE_VOICE = `WRITER IDENTITY:
Kyle Rosebrook. Self-taught builder, solo founder. Former bartender, QC tech, service desk tech. Now building FlashFusion (B2B AI enablement) and writing Load-Bearing newsletter. Based in Grayslake, IL.

Core diagnostic instinct: reads rooms, reads processes, reads systems. That instinct transfers across every domain he writes about. The move is: same skill, different substrate.

VOICE DNA:
Declarative. Specific. No ascent at the end. Short sentences. Then a longer one that earns its space. Then short again. Pattern detected → stated flat → implication left to reader. Technical precision deployed for emotional clarity. Earned authority — no credentials cited. Authority comes from building and surviving it.

OPENING RULE:
Start with the problem the reader is already feeling. NOT a thesis declaration. NOT an announcement. The reader hasn't agreed to care yet. Start in their tension, not yours.

CLOSING RULE:
End with observation only. Paradox → Reframe → Declarative. Never summary. Never "here's what I learned." Last sentence should make the reader sit, not nod.

STRUCTURAL RULES:
- Sentence length IS punctuation. Short for impact. Longer for complexity. Short to close.
- One grounded metaphor beats five paragraphs of explanation.
- Prose only — no bullet points, no numbered lists in written output.
- No headers inside paragraphs.
- CLAIMS / GAPS footer on research-heavy output: label what's sourced vs generated.

NEVER USE IN ANY OUTPUT:
"in today's world" / "leverage AI" / "harness the power of" / "game-changer" / "paradigm shift" / "at the end of the day" / "and that's when I realized" / "I hope this helps" / "let's dive in" / "unpacking" / "food for thought" / "it goes without saying" / "unlock your potential" / "looking back" / "rock bottom" / "grateful for the journey" / "Here's what actually happened:" / "The truth is..." / "In conclusion" / "To summarize" / any bullet points / any numbered list as prose

STRONG EXAMPLES (from actual writing):
"Recovery assumes returning to a previous state. There was nothing to return to. So I built."
"The documentation isn't organization. It's the place I keep things when my head won't."
"If you've earned the judgment, AI makes you faster. If you haven't, it makes you wrong faster."
"The skill is a file. The library is the judgment layer."
"The factory is the failure pattern, not the planning session."
"Bad routing makes good knowledge useless."`;

const SYSTEM = `You are a NotebookLM configuration architect for a specific writer. Given a notebook topic and list of Studio outputs needed, you generate two things:
1. CONFIGURE CHAT — a block of instructions to paste into NotebookLM's Configure Chat field (Custom mode). Max 8,000 characters. Voice rules weighted highest.
2. STUDIO PROMPTS — one per Studio tool requested, each ready to paste into that tool's prompt field before generating.

${KYLE_VOICE}

OUTPUT FORMAT (follow exactly — no extra commentary):

=== CONFIGURE CHAT ===
[The full Configure Chat instruction block. Opens with role/context. Then voice rules (most important section). Then hard bans. Then format defaults specific to this notebook's topic. Max 8,000 chars. Prose instructions throughout — no bullet points inside the config block itself.]

=== AUDIO OVERVIEW ===
[If requested: 1–3 sentence prompt for the "What should AI hosts focus on?" field. Themes + angle + what to avoid. Under 200 words.]

=== VIDEO OVERVIEW ===
[If requested: 1–3 sentence prompt for the video focus field. Themes and narrative angle. Under 150 words.]

=== MIND MAP ===
[If requested: Chat pre-analysis prompt to run BEFORE generating the Mind Map. Tell the user this is a chat prompt, not a Mind Map prompt field — Mind Map has no direct prompt field.]

=== FLASHCARDS ===
[If requested: Topic focus prompt for the Flashcard tool field. Specify concept cluster and difficulty weighting.]

=== QUIZ ===
[If requested: Topic + tiered difficulty prompt for the Quiz field.]

=== REPORT ===
[If requested: Full prompt for the Report tool — this is the most voice-sensitive Studio output. Specify format, structure, voice requirements, and what the output should NOT do. Be explicit about prose vs bullets, observation-style ending, no summary.]

=== INFOGRAPHIC ===
[If requested: Prompt for the infographic field. Cover: what data to prioritize, framing angle, audience, suggested style direction.]

=== SLIDE DECK ===
[If requested: Narrative arc + structure prompt for Slide Deck. Include hook/problem/evidence/implication structure. Specify slide title word limit and speaker notes format if relevant.]

=== DATA TABLE ===
[If requested: Column definitions for structured extraction. Be explicit about what each column should capture.]

End with:
=== NOTES ===
[2–3 sentences max on anything the user should know about this specific notebook configuration — gotchas, recommended source count, anything unusual.]`;

const TOOLS = [
  { id: "audio", label: "Audio Overview", color: "#7c4dca" },
  { id: "video", label: "Video Overview", color: "#c4472a" },
  { id: "mindmap", label: "Mind Map", color: "#2a7a4a" },
  { id: "flashcards", label: "Flashcards", color: "#a06020" },
  { id: "quiz", label: "Quiz", color: "#1a5e8a" },
  { id: "report", label: "Report", color: "#4a4a9c" },
  { id: "infographic", label: "Infographic", color: "#1a7a70" },
  { id: "slidedeck", label: "Slide Deck", color: "#8a3a1a" },
  { id: "datatable", label: "Data Table", color: "#3a5a2a" },
];

function CopyBtn({ text, label }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  return (
    <button onClick={copy} style={s.copyBtn}>
      {copied ? "✓ Copied" : `Copy ${label}`}
    </button>
  );
}

function Section({ title, content, color }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ ...s.section, borderColor: (color || "#c4935a") + "30" }}>
      <button onClick={() => setOpen(o => !o)} style={s.sectionHead}>
        <span style={{ ...s.sectionTitle, color: color || "#c4935a" }}>{title}</span>
        <div style={s.sectionRight}>
          <CopyBtn text={content} label="" />
          <span style={{ color: "#6b6557", fontSize: 13 }}>{open ? "▾" : "▸"}</span>
        </div>
      </button>
      {open && <pre style={s.sectionBody}>{content}</pre>}
    </div>
  );
}

function parseOutput(raw) {
  const sections = {};
  const markers = [
    "=== CONFIGURE CHAT ===",
    "=== AUDIO OVERVIEW ===",
    "=== VIDEO OVERVIEW ===",
    "=== MIND MAP ===",
    "=== FLASHCARDS ===",
    "=== QUIZ ===",
    "=== REPORT ===",
    "=== INFOGRAPHIC ===",
    "=== SLIDE DECK ===",
    "=== DATA TABLE ===",
    "=== NOTES ===",
  ];
  for (let i = 0; i < markers.length; i++) {
    const start = raw.indexOf(markers[i]);
    if (start === -1) continue;
    const contentStart = start + markers[i].length;
    const end = i + 1 < markers.length ? raw.indexOf(markers[i + 1]) : raw.length;
    sections[markers[i]] = raw.slice(contentStart, end === -1 ? raw.length : end).trim();
  }
  return sections;
}

export default function NotebookLMConfig() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [sourceDesc, setSourceDesc] = useState("");
  const [selectedTools, setSelectedTools] = useState(new Set(["audio", "report"]));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [parsed, setParsed] = useState(null);

  function toggleTool(id) {
    setSelectedTools(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function generate() {
    if (!topic.trim()) { setError("Add a notebook topic first."); return; }
    setError(""); setLoading(true); setResult(""); setParsed(null);

    const toolList = TOOLS.filter(t => selectedTools.has(t.id)).map(t => t.label).join(", ");
    const userMsg = `Notebook topic: ${topic.trim()}
${audience ? `Target audience: ${audience.trim()}` : ""}
${sourceDesc ? `Sources in this notebook: ${sourceDesc.trim()}` : ""}
Studio outputs needed: ${toolList || "All tools"}

Generate the Configure Chat instructions and Studio prompts.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: SYSTEM,
          messages: [{ role: "user", content: userMsg }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      setResult(text);
      setParsed(parseOutput(text));
    } catch {
      setError("Connection failed.");
    }
    setLoading(false);
  }

  const toolColorMap = Object.fromEntries(TOOLS.map(t => [t.label, t.color]));

  return (
    <div style={s.root}>
      <header style={s.header}>
        <div style={s.headerInner}>
          <div>
            <div style={s.eyebrow}>NOTEBOOKLM · ULTRA</div>
            <h1 style={s.title}>Config Generator</h1>
          </div>
          <div style={s.tagline}>Configure Chat + 9 Studio Prompts</div>
        </div>
      </header>

      <main style={s.main}>
        {/* FORM */}
        <div style={s.formBlock}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Notebook topic *</label>
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. AI adoption patterns in SMB manufacturing, 2025–2026"
              style={s.input}
            />
          </div>

          <div style={s.fieldRow}>
            <div style={{ ...s.fieldGroup, flex: 1 }}>
              <label style={s.label}>Target audience</label>
              <input
                value={audience}
                onChange={e => setAudience(e.target.value)}
                placeholder="e.g. Load-Bearing newsletter readers, FlashFusion prospects"
                style={s.input}
              />
            </div>
            <div style={{ ...s.fieldGroup, flex: 1 }}>
              <label style={s.label}>Sources in this notebook (brief)</label>
              <input
                value={sourceDesc}
                onChange={e => setSourceDesc(e.target.value)}
                placeholder="e.g. 8 trade articles, 3 LinkedIn posts, 2 case studies"
                style={s.input}
              />
            </div>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>Studio outputs to configure</label>
            <div style={s.toolGrid}>
              {TOOLS.map(t => (
                <button
                  key={t.id}
                  onClick={() => toggleTool(t.id)}
                  style={{
                    ...s.toolChip,
                    background: selectedTools.has(t.id) ? t.color + "22" : "rgba(255,255,255,0.02)",
                    borderColor: selectedTools.has(t.id) ? t.color : "rgba(255,255,255,0.08)",
                    color: selectedTools.has(t.id) ? t.color : "#6b6557"
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {error && <div style={s.error}>{error}</div>}

          <button onClick={generate} disabled={loading} style={{ ...s.genBtn, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Generating..." : "Generate Config →"}
          </button>
        </div>

        {/* RESULTS */}
        {parsed && !loading && (
          <div style={s.results}>
            <div style={s.resultsHeader}>
              <span style={s.resultsLabel}>OUTPUT — paste directly into NotebookLM</span>
              <CopyBtn text={result} label="All" />
            </div>

            {parsed["=== CONFIGURE CHAT ==="] && (
              <Section
                title="Configure Chat"
                content={parsed["=== CONFIGURE CHAT ==="]}
                color="#c4935a"
              />
            )}

            {TOOLS.filter(t => selectedTools.has(t.id)).map(t => {
              const key = `=== ${t.label.toUpperCase()} ===`;
              const content = parsed[key];
              if (!content) return null;
              return (
                <Section key={t.id} title={t.label} content={content} color={t.color} />
              );
            })}

            {parsed["=== NOTES ==="] && (
              <div style={s.notes}>
                <span style={s.notesLabel}>NOTES</span>
                <span style={s.notesBody}>{parsed["=== NOTES ==="]}</span>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div style={s.loadingBlock}>
            <div style={s.loadingDot} />
            <span style={s.loadingText}>Building your Configure Chat and Studio prompts...</span>
          </div>
        )}

        <div style={s.footer}>
          <div style={s.footerItem}>
            <span style={s.footerIcon}>▸</span>
            <span><strong style={{ color: "#f2efe9" }}>Configure Chat:</strong> Slider icon → Chat panel → Custom mode → paste</span>
          </div>
          <div style={s.footerItem}>
            <span style={s.footerIcon}>▸</span>
            <span><strong style={{ color: "#f2efe9" }}>Studio prompts:</strong> Click › beside each tool tile → paste into the prompt field before generating</span>
          </div>
          <div style={s.footerItem}>
            <span style={s.footerIcon}>▸</span>
            <span><strong style={{ color: "#f2efe9" }}>Mind Map:</strong> No prompt field — paste the Mind Map section into Chat first, then generate from the mind map panel</span>
          </div>
        </div>
      </main>
    </div>
  );
}

const INK = "#0a0907";
const PAPER = "#f2efe9";
const BRASS = "#c4935a";
const DIM = "#a09888";
const FAINT = "#6b6557";
const RULE = "rgba(255,255,255,0.07)";

const s = {
  root: { background: INK, color: PAPER, fontFamily: "'Georgia','Times New Roman',serif", minHeight: "100vh", fontSize: 14 },
  header: { padding: "1.2rem 1.4rem", borderBottom: `1px solid ${RULE}` },
  headerInner: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", maxWidth: 760, margin: "0 auto" },
  eyebrow: { fontFamily: "monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: FAINT, marginBottom: 3 },
  title: { fontFamily: "Georgia,serif", fontSize: 20, fontWeight: 400, color: PAPER, margin: 0, letterSpacing: "-0.02em" },
  tagline: { fontFamily: "monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: FAINT },
  main: { maxWidth: 760, margin: "0 auto", padding: "1.75rem 1.4rem 4rem" },

  formBlock: { marginBottom: "2rem" },
  fieldGroup: { marginBottom: "1rem" },
  fieldRow: { display: "flex", gap: "1rem", marginBottom: "1rem" },
  label: { fontFamily: "monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: FAINT, display: "block", marginBottom: 6 },
  input: {
    width: "100%", background: "rgba(255,255,255,0.03)", border: `1px solid ${RULE}`,
    color: PAPER, fontFamily: "Georgia,serif", fontSize: 13, padding: "0.65rem 0.9rem",
    borderRadius: 3, outline: "none", boxSizing: "border-box", lineHeight: 1.5
  },
  toolGrid: { display: "flex", flexWrap: "wrap", gap: "0.4rem" },
  toolChip: {
    fontFamily: "monospace", fontSize: 10, letterSpacing: "0.06em",
    border: "1px solid", borderRadius: 3, padding: "4px 10px",
    cursor: "pointer", transition: "all 0.15s", background: "none"
  },
  error: { color: "#e08080", fontFamily: "monospace", fontSize: 11, marginBottom: "0.75rem" },
  genBtn: {
    background: BRASS, color: INK, fontFamily: "monospace", fontSize: 10,
    letterSpacing: "0.1em", textTransform: "uppercase", border: "none",
    padding: "0.7rem 1.75rem", borderRadius: 3, cursor: "pointer", fontWeight: 700,
    marginTop: "0.5rem"
  },

  results: { marginBottom: "1.5rem" },
  resultsHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: "0.75rem"
  },
  resultsLabel: { fontFamily: "monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: FAINT },
  section: {
    border: "1px solid", borderRadius: 3, marginBottom: "0.6rem", overflow: "hidden"
  },
  sectionHead: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    width: "100%", background: "rgba(255,255,255,0.025)", border: "none",
    padding: "0.75rem 1rem", cursor: "pointer", gap: "0.75rem"
  },
  sectionTitle: { fontFamily: "monospace", fontSize: 10, letterSpacing: "0.09em", textTransform: "uppercase", fontWeight: 700 },
  sectionRight: { display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 },
  sectionBody: {
    fontFamily: "Georgia,serif", fontSize: 13, color: DIM, lineHeight: 1.75,
    whiteSpace: "pre-wrap", margin: 0, padding: "0.85rem 1rem",
    borderTop: `1px solid ${RULE}`
  },
  copyBtn: {
    fontFamily: "monospace", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase",
    background: "rgba(196,147,90,0.1)", border: "1px solid rgba(196,147,90,0.25)",
    color: BRASS, padding: "3px 10px", borderRadius: 3, cursor: "pointer"
  },
  notes: {
    background: "rgba(196,147,90,0.05)", border: "1px solid rgba(196,147,90,0.18)",
    borderRadius: 3, padding: "0.85rem 1rem", marginTop: "0.25rem"
  },
  notesLabel: { fontFamily: "monospace", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: BRASS, marginRight: 10 },
  notesBody: { fontSize: 12, color: DIM, lineHeight: 1.7 },

  loadingBlock: {
    display: "flex", alignItems: "center", gap: "0.75rem",
    padding: "1rem", border: `1px solid ${RULE}`, borderRadius: 3
  },
  loadingDot: { width: 6, height: 6, borderRadius: "50%", background: BRASS },
  loadingText: { fontFamily: "monospace", fontSize: 10, color: FAINT, letterSpacing: "0.06em" },

  footer: {
    marginTop: "1.75rem", paddingTop: "1.25rem",
    borderTop: `1px solid ${RULE}`, display: "flex", flexDirection: "column", gap: "0.5rem"
  },
  footerItem: { display: "flex", gap: "0.6rem", fontSize: 12, color: FAINT, lineHeight: 1.6 },
  footerIcon: { color: BRASS, flexShrink: 0, paddingTop: 1 }
};
