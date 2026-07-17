import { useState } from "react";

const BANNED_WORDS = [
  "delve","tapestry","realm","testament","landscape","pivotal","intricate",
  "vibrant","seamless","cutting-edge","groundbreaking","revolutionary","harness",
  "leverage","utilize","synergy","foster","showcase","underscore","commendable",
  "meticulous","crucial","paramount","compelling","multifaceted","game-changer",
  "unlock","elevate","transformative","robust","unleash","unveil","illuminate",
  "embark","elucidate","furthermore","moreover","consequently","holistic",
  "innovative","streamline","impactful","actionable","dynamic","comprehensive",
  "synergize","disruptive","thought leader","best-in-class","overarching"
];

const BANNED_PHRASES = [
  '"In today\'s ever-evolving world..."',
  '"It\'s important to note..."',
  '"In summary / In conclusion / In essence"',
  '"Not just X, but also Y" — the hedging seesaw',
  '"A rich tapestry of..."',
  '"Dive deep into..." / "Shed light on..."',
  '"At the end of the day..."',
  '"It goes without saying..."',
  '"Certainly!" / "Absolutely!" / "Great question!"',
  '"I\'d be happy to help with that."',
  '"Hope this helps!"',
  '"As an AI language model..."',
  '"Let me break this down for you."',
  '"That\'s a great point — however..."'
];

const BANNED_STRUCTURES = [
  "Intro paragraph → 3 bullet points → conclusion (every time)",
  "Uniform sentence length throughout (machine rhythm)",
  "Rule of three abuse (always exactly 3 examples)",
  "Hedging seesaw without resolution",
  "Enthusiasm without substance",
  "Meta-commentary before the answer",
  "Listing all options instead of recommending one",
  "Em dash as a thinking placeholder —"
];

const GOOD_PATTERNS = [
  "State a position. Defend it.",
  "Vary sentence rhythm deliberately",
  "Active verbs + concrete nouns",
  "\"I cannot verify this\" over invented precision",
  "Correct wrong premises before helping",
  "Hold position under pushback; update on logic not pressure",
  "Format matches the actual output destination",
  "Push back when the user is wrong"
];

const PROMPT_SECTIONS = {
  identity: {
    label: "Identity & register",
    icon: "ti-user",
    text: `IDENTITY
You are a direct, technically precise assistant. No filler, no flattery, no performative hedging. Write at the audience's domain fluency. If they are technical, be technical. Skip the on-ramp.`
  },
  voice: {
    label: "Voice & output rules",
    icon: "ti-pencil",
    text: `VOICE
- Active verbs, concrete nouns. Abstract placeholders are cuts.
- Vary sentence length deliberately. Rhythm is how ideas land.
- State positions. "It depends" without a decision is useless.
- Short sentences land harder. Use them after a long one.`
  },
  honesty: {
    label: "Honesty & epistemic rules",
    icon: "ti-shield-check",
    text: `HONESTY
- "I cannot verify this" beats confident invention.
- Never cite a study you cannot source. Never invent statistics or percentages.
- Never validate a wrong premise to avoid conflict. Correct it. Explain why.
- When the approach has a flaw, name it before implementing.
- Hold your position under pushback unless new evidence appears. Update on logic, not pressure.`
  },
  bannedWords: {
    label: "Banned words",
    icon: "ti-ban",
    text: `BANNED WORDS — never use these
delve · tapestry · realm · testament · landscape · pivotal · intricate · vibrant ·
seamless · cutting-edge · groundbreaking · revolutionary · harness · leverage ·
utilize · synergy · foster · showcase · underscore · commendable · meticulous ·
crucial · paramount · compelling · multifaceted · game-changer · unlock · elevate ·
transformative · robust · unleash · unveil · illuminate · embark · elucidate ·
furthermore · moreover · consequently · holistic · innovative · streamline ·
impactful · actionable · dynamic · comprehensive · disruptive · overarching`
  },
  bannedPhrases: {
    label: "Banned phrases",
    icon: "ti-message-off",
    text: `BANNED PHRASES — never use these
- "In today's ever-evolving world..."
- "It's important to note..."
- "In summary" / "In conclusion" / "In essence" / "At the end of the day"
- "Not just X, but also Y" (the hedging seesaw — commit to X or Y)
- "A rich tapestry of..." / "Dive deep into..." / "Shed light on..."
- "It goes without saying..."
- "Certainly!" / "Absolutely!" / "Great question!"
- "I'd be happy to help with that."
- "Hope this helps!" / "As an AI language model..."`
  },
  bannedStructures: {
    label: "Banned structures",
    icon: "ti-layout-off",
    text: `BANNED STRUCTURES
- Generic list format: intro → 3 bullet points → summary conclusion
- Uniform sentence length throughout a response
- Rule of three: always exactly three examples
- Hedging seesaw with no resolution: "On one hand... on the other..."
- Corporate pep talk: enthusiasm without substance
- Meta-commentary: explaining what you're about to say before saying it
- Listing every option instead of recommending one`
  },
  formatting: {
    label: "Formatting rules",
    icon: "ti-markdown",
    text: `FORMATTING
- Use markdown only when output will be rendered as markdown.
- No em dash as a thinking placeholder (—).
- No emoji used as bullets or emphasis.
- No exclamation points (except in direct quotation).
- Headers only when the document genuinely needs navigation.
- Tables only when comparison is the point, not when prose works.`
  },
  sycophancy: {
    label: "Anti-sycophancy",
    icon: "ti-thumb-down",
    text: `SYCOPHANCY PROHIBITION
- Do not praise user inputs before answering.
- Do not soften corrections with excessive hedging.
- Do not change your answer because the user expressed displeasure.
- Do not agree with an incorrect claim to avoid friction.
- Directness is respect. Excessive softening is condescension.`
  }
};

function Badge({ children, variant }) {
  const styles = {
    danger: { background: "var(--color-background-danger)", color: "var(--color-text-danger)" },
    success: { background: "var(--color-background-success)", color: "var(--color-text-success)" },
    info: { background: "var(--color-background-info)", color: "var(--color-text-info)" },
    muted: { background: "var(--color-background-secondary)", color: "var(--color-text-secondary)" }
  };
  return (
    <span style={{
      fontSize: "11px", fontFamily: "var(--font-mono)",
      padding: "3px 7px", borderRadius: "4px",
      ...styles[variant]
    }}>{children}</span>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("reference");
  const [sections, setSections] = useState(
    Object.fromEntries(Object.keys(PROMPT_SECTIONS).map(k => [k, true]))
  );
  const [copied, setCopied] = useState(false);

  const generatePrompt = () =>
    Object.entries(PROMPT_SECTIONS)
      .filter(([key]) => sections[key])
      .map(([, sec]) => sec.text)
      .join("\n\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePrompt()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const activeCount = Object.values(sections).filter(Boolean).length;

  return (
    <div style={{ fontFamily: "var(--font-sans)", maxWidth: "680px", margin: "0 auto", padding: "1.5rem 0" }}>
      <h2 className="sr-only">Anti-Slop Prompt Builder for AI Studio — reference, builder, and copyable output</h2>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", paddingBottom: "1rem", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
        <div>
          <p style={{ fontSize: "10px", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--color-text-tertiary)", margin: "0 0 3px 0", textTransform: "uppercase" }}>AI Studio System Prompt</p>
          <h1 style={{ fontSize: "20px", fontWeight: "500", margin: "0", color: "var(--color-text-primary)", lineHeight: 1.2 }}>Anti-slop prompt builder</h1>
          <p style={{ fontSize: "12px", color: "var(--color-text-secondary)", margin: "4px 0 0 0" }}>
            Source: Antislop arXiv·2510.15061 · Kobak et al. 2025 · CMU 2025 · Buffer 52M post analysis
          </p>
        </div>
        <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", padding: "7px 14px", flexShrink: 0 }}>
          <i className={`ti ${copied ? "ti-check" : "ti-copy"}`} style={{ fontSize: "14px" }} aria-hidden="true"></i>
          {copied ? "Copied" : "Copy prompt"}
        </button>
      </div>

      {/* Tabs */}
      <div role="tablist" style={{ display: "flex", borderBottom: "0.5px solid var(--color-border-tertiary)", marginBottom: "1.5rem" }}>
        {[
          { id: "reference", label: "Anti-pattern reference" },
          { id: "builder", label: `Builder (${activeCount}/${Object.keys(PROMPT_SECTIONS).length})` },
          { id: "output", label: "Output" }
        ].map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              fontSize: "13px", padding: "8px 14px", border: "none",
              background: "none", cursor: "pointer",
              color: activeTab === tab.id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              borderBottom: activeTab === tab.id ? "2px solid var(--color-text-primary)" : "2px solid transparent",
              fontWeight: activeTab === tab.id ? "500" : "400",
              marginBottom: "-0.5px"
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* ── REFERENCE TAB ── */}
      {activeTab === "reference" && (
        <div>
          {/* A/B comparison */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "1.75rem" }}>
            <div style={{ background: "var(--color-background-danger)", borderRadius: "var(--border-radius-md)", padding: "12px 14px" }}>
              <p style={{ fontSize: "10px", fontFamily: "var(--font-mono)", fontWeight: "500", color: "var(--color-text-danger)", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                <i className="ti ti-x" style={{ fontSize: "11px", marginRight: "4px" }} aria-hidden="true"></i>AI slop
              </p>
              <p style={{ fontSize: "12px", color: "var(--color-text-danger)", margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>
                "In today's ever-evolving landscape, it's pivotal to delve into the intricate tapestry of solutions that can truly unlock your potential and illuminate a transformative journey forward."
              </p>
            </div>
            <div style={{ background: "var(--color-background-success)", borderRadius: "var(--border-radius-md)", padding: "12px 14px" }}>
              <p style={{ fontSize: "10px", fontFamily: "var(--font-mono)", fontWeight: "500", color: "var(--color-text-success)", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                <i className="ti ti-check" style={{ fontSize: "11px", marginRight: "4px" }} aria-hidden="true"></i>What good looks like
              </p>
              <p style={{ fontSize: "12px", color: "var(--color-text-success)", margin: 0, lineHeight: 1.6 }}>
                "Three options. Option B fits your constraint best — here's why, and here's the tradeoff you're accepting. Option A is faster but doesn't handle your edge case."
              </p>
            </div>
          </div>

          {/* Banned words */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
              <p style={{ fontSize: "10px", fontFamily: "var(--font-mono)", fontWeight: "500", color: "var(--color-text-secondary)", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Banned words</p>
              <p style={{ fontSize: "11px", color: "var(--color-text-tertiary)", margin: 0 }}>up to 85,000× overrepresentation vs human text (Antislop, 2025)</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {BANNED_WORDS.map(word => (
                <span key={word} style={{
                  fontSize: "11px", fontFamily: "var(--font-mono)",
                  padding: "3px 7px", borderRadius: "4px",
                  background: "var(--color-background-danger)", color: "var(--color-text-danger)"
                }}>{word}</span>
              ))}
            </div>
          </div>

          {/* Banned phrases */}
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "10px", fontFamily: "var(--font-mono)", fontWeight: "500", color: "var(--color-text-secondary)", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>Banned phrases</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {BANNED_PHRASES.map(phrase => (
                <div key={phrase} style={{
                  fontSize: "12px", fontFamily: "var(--font-mono)",
                  padding: "5px 10px", borderRadius: "4px",
                  background: "var(--color-background-danger)", color: "var(--color-text-danger)",
                  lineHeight: 1.4
                }}>{phrase}</div>
              ))}
            </div>
          </div>

          {/* Banned structures / good patterns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <p style={{ fontSize: "10px", fontFamily: "var(--font-mono)", fontWeight: "500", color: "var(--color-text-secondary)", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>Banned structures</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {BANNED_STRUCTURES.map(s => (
                  <div key={s} style={{
                    fontSize: "12px", padding: "5px 8px", borderRadius: "4px",
                    background: "var(--color-background-danger)", color: "var(--color-text-danger)",
                    lineHeight: 1.4
                  }}>{s}</div>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "10px", fontFamily: "var(--font-mono)", fontWeight: "500", color: "var(--color-text-secondary)", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>Do this instead</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {GOOD_PATTERNS.map(s => (
                  <div key={s} style={{
                    fontSize: "12px", padding: "5px 8px", borderRadius: "4px",
                    background: "var(--color-background-success)", color: "var(--color-text-success)",
                    lineHeight: 1.4
                  }}>{s}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BUILDER TAB ── */}
      {activeTab === "builder" && (
        <div>
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: "0 0 1rem 0", lineHeight: 1.5 }}>
            Toggle sections on or off. Changes reflect immediately in Output. All on by default — strip what doesn't fit your deployment context.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {Object.entries(PROMPT_SECTIONS).map(([key, sec]) => (
              <div
                key={key}
                role="checkbox"
                aria-checked={sections[key]}
                tabIndex={0}
                onClick={() => setSections(prev => ({ ...prev, [key]: !prev[key] }))}
                onKeyDown={e => e.key === " " && setSections(prev => ({ ...prev, [key]: !prev[key] }))}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px",
                  background: sections[key] ? "var(--color-background-success)" : "var(--color-background-secondary)",
                  borderRadius: "var(--border-radius-md)",
                  cursor: "pointer",
                  border: `0.5px solid ${sections[key] ? "var(--color-border-success)" : "var(--color-border-tertiary)"}`,
                  userSelect: "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <i
                    className={`ti ${sections[key] ? "ti-circle-check-filled" : "ti-circle"}`}
                    style={{ fontSize: "18px", color: sections[key] ? "var(--color-text-success)" : "var(--color-text-tertiary)" }}
                    aria-hidden="true"
                  ></i>
                  <i className={`ti ${sec.icon}`} style={{ fontSize: "15px", color: sections[key] ? "var(--color-text-success)" : "var(--color-text-secondary)" }} aria-hidden="true"></i>
                  <span style={{ fontSize: "13px", fontWeight: "500", color: sections[key] ? "var(--color-text-success)" : "var(--color-text-secondary)" }}>
                    {sec.label}
                  </span>
                </div>
                <Badge variant={sections[key] ? "success" : "muted"}>
                  {sections[key] ? "on" : "off"}
                </Badge>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem", padding: "10px 14px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)" }}>
            <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--color-text-secondary)" }}>
              {activeCount}/{Object.keys(PROMPT_SECTIONS).length} sections · ~{generatePrompt().split(" ").length} words
            </span>
            <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
              <i className={`ti ${copied ? "ti-check" : "ti-copy"}`} style={{ fontSize: "14px" }} aria-hidden="true"></i>
              {copied ? "Copied" : "Copy prompt"}
            </button>
          </div>
        </div>
      )}

      {/* ── OUTPUT TAB ── */}
      {activeTab === "output" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <p style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Paste into AI Studio → System instructions
            </p>
            <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
              <i className={`ti ${copied ? "ti-check" : "ti-copy"}`} style={{ fontSize: "14px" }} aria-hidden="true"></i>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <pre style={{
            fontFamily: "var(--font-mono)", fontSize: "12px", lineHeight: 1.75,
            color: "var(--color-text-primary)",
            background: "var(--color-background-secondary)",
            borderRadius: "var(--border-radius-md)",
            padding: "1rem 1.25rem",
            border: "0.5px solid var(--color-border-tertiary)",
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            margin: "0 0 8px 0", overflowX: "hidden"
          }}>
            {generatePrompt()}
          </pre>

          <div style={{ display: "flex", gap: "8px", padding: "10px 12px", background: "var(--color-background-info)", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-info)" }}>
            <i className="ti ti-info-circle" style={{ fontSize: "14px", color: "var(--color-text-info)", flexShrink: 0, marginTop: "1px" }} aria-hidden="true"></i>
            <p style={{ fontSize: "12px", color: "var(--color-text-info)", margin: 0, lineHeight: 1.5 }}>
              Works with Gemini 1.5 Pro, 2.0 Flash, and 2.5 Pro in AI Studio. Paste into the System Instructions field before your use-case-specific instructions. Adjust the Identity section for your deployment context — the rest is universal.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)", margin: 0 }}>
          Research basis: Antislop arXiv·2510.15061 · Kobak et al. 2025 · CMU·2025 · Buffer 52M
        </p>
        <p style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)", margin: 0 }}>
          FlashFusion · Jun 2026
        </p>
      </div>
    </div>
  );
}
