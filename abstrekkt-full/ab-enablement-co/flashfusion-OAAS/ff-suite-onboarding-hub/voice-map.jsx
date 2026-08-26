import { useState, useCallback } from "react";

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#0B0D16",
  surf: "#131620",
  bdr: "#1E2238",
  txt: "#EDF0FF",
  txt2: "#8C96B8",
  muted: "#4A5272",
  muted2: "#2E3350",
  accent: "#6575F0",
  acc2: "#8591FF",
  gem: "#F09030",
  err: "#FF8080",
  errBg: "#2A0E0E",
  errBdr: "#5A1A1A",
};

// ── Essay sample from project docs ────────────────────────────────────────────
const ESSAY_PRELOAD = `This is not a pitch for new work. This is a demonstration that work already completed validates what the market is demanding—and that formalizing Kyle's involvement accelerates INT's ability to capture it.

Consultants provide frameworks and analysis. Conferences provide market ground truth. The highest-confidence strategic decisions require both.

External consulting gives INT analysis. HumanX gives INT evidence. Together, they give INT certainty.

INT's moat is operationalization expertise, not AI tools. Tools are commoditizing; operationalization is not.

We're building a secure multi-tenant data vault for MSP operations. We call it Data Venue. I'd love to understand how your architecture handles tenant isolation—we're currently using AWS with row-level security and I'm benchmarking against enterprise alternatives.

Problems are not the enemy. Hidden problems are the enemy.`;

// ── Dimension definitions ─────────────────────────────────────────────────────
const DIMS = [
  { id: "rhythm", label: "Rhythm", L: "Short & Percussive", R: "Long & Flowing" },
  { id: "tone", label: "Tone", L: "Dry / Ironic", R: "Raw / Sincere" },
  { id: "pov", label: "POV", L: "Confessional", R: "Observational" },
  { id: "register", label: "Register", L: "Street-level", R: "Literary" },
  { id: "imagery", label: "Imagery", L: "Abstract", R: "Concrete" },
  { id: "pacing", label: "Pacing", L: "Meditative", R: "Propulsive" },
  { id: "vulnerability", label: "Exposure", L: "Armored", R: "Unguarded" },
  { id: "edge", label: "Edge", L: "Gentle", R: "Sharp" },
];

const PRESET = {
  rhythm: 38,
  tone: 30,
  pov: 55,
  register: 45,
  imagery: 72,
  pacing: 80,
  vulnerability: 28,
  edge: 70,
};

const LANES = [
  { id: "memoir", label: "Memoir", ph: "A paragraph from your memoir — raw draft preferred." },
  { id: "lyrics", label: "Lyrics", ph: "A lyric, verse, or fragment you've written." },
  { id: "essay", label: "Essay / Blog", ph: "A passage from a post or essay.", preload: ESSAY_PRELOAD },
  { id: "other", label: "Other", ph: "A journal entry, a note — anything that feels real." },
];

const TENSION_PAIRS = [
  ["vulnerability", "tone"],
  ["pov", "edge"],
  ["register", "imagery"],
  ["rhythm", "pacing"],
];

// ── Radar Chart ───────────────────────────────────────────────────────────────
function Radar({ vals, size = 220 }) {
  const n = DIMS.length;
  const cx = size / 2, cy = size / 2, r = size * 0.33;

  const pt = (i, pct) => {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: cx + pct * r * Math.cos(a), y: cy + pct * r * Math.sin(a) };
  };

  const shape = DIMS.map((d, i) => pt(i, (vals[d.id] ?? 50) / 100));
  const path = shape.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + "Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      {[0.25, 0.5, 0.75, 1].map((pct, gi) => {
        const pts = DIMS.map((_, i) => pt(i, pct));
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + "Z";
        return <path key={gi} d={d} fill="none" stroke={C.bdr} strokeWidth="1" />;
      })}
      {DIMS.map((_, i) => {
        const e = pt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={e.x.toFixed(1)} y2={e.y.toFixed(1)} stroke={C.muted2} strokeWidth="1" />;
      })}
      <path d={path} fill={`${C.accent}28`} stroke={C.accent} strokeWidth="2" strokeLinejoin="round" />
      {shape.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="4" fill={C.accent} />
      ))}
      {DIMS.map((d, i) => {
        const lp = pt(i, 1.38);
        return (
          <text
            key={i}
            x={lp.x.toFixed(1)}
            y={lp.y.toFixed(1)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fill={C.txt2}
            fontFamily="'DM Mono',monospace"
            style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

// ── Markdown Renderer ─────────────────────────────────────────────────────────
function Md({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  const out = [];
  let li = [];
  let k = 0;

  const flush = () => {
    if (li.length) {
      out.push(
        <ul key={k++} style={{ paddingLeft: 20, marginBottom: 16, color: C.txt2 }}>
          {[...li]}
        </ul>
      );
      li = [];
    }
  };

  const inl = (s) => {
    const parts = s.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") && p.endsWith("**") ? (
        <strong key={i} style={{ color: C.txt, fontWeight: 600 }}>
          {p.slice(2, -2)}
        </strong>
      ) : (
        p
      )
    );
  };

  for (const raw of lines) {
    if (/^#{1,3}\s/.test(raw)) {
      flush();
      const h = raw.replace(/^#+\s/, "");
      const isGem = /gem|surprise|hidden/i.test(h);
      out.push(
        <div
          key={k++}
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: isGem ? C.gem : C.accent,
            marginTop: 32,
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {isGem && "✦"} {h}
        </div>
      );
    } else if (/^[-*]\s/.test(raw)) {
      const c = raw.replace(/^[-*]\s/, "");
      li.push(
        <li key={k++} style={{ marginBottom: 8, lineHeight: 1.8 }}>
          {inl(c)}
        </li>
      );
    } else if (!raw.trim()) {
      flush();
      out.push(<div key={k++} style={{ height: 6 }} />);
    } else {
      flush();
      out.push(
        <p key={k++} style={{ marginBottom: 12, lineHeight: 1.85, color: C.txt2 }}>
          {inl(raw)}
        </p>
      );
    }
  }
  flush();
  return <>{out}</>;
}

// ── Slider ────────────────────────────────────────────────────────────────────
function Slider({ dim, value, onChange }) {
  const pct = value;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "1.1rem",
            fontWeight: 500,
            color: C.txt,
          }}
        >
          {dim.label}
        </span>
        <span style={{ fontSize: 11, color: C.accent, fontVariantNumeric: "tabular-nums" }}>{value}</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: C.muted,
          marginBottom: 6,
        }}
      >
        <span>{dim.L}</span>
        <span>{dim.R}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={{
          width: "100%",
          cursor: "pointer",
          accentColor: C.accent,
          background: `linear-gradient(to right, ${C.accent} ${pct}%, ${C.muted2} ${pct}%)`,
          height: 2,
          WebkitAppearance: "none",
          appearance: "none",
          borderRadius: 2,
          outline: "none",
        }}
      />
    </div>
  );
}

// ── Notice ────────────────────────────────────────────────────────────────────
function Notice({ children }) {
  return (
    <div
      style={{
        background: `${C.accent}12`,
        border: `1px solid ${C.accent}30`,
        borderRadius: 3,
        padding: "12px 16px",
        marginBottom: 28,
        fontSize: 11,
        color: C.txt2,
        lineHeight: 1.75,
      }}
    >
      {children}
    </div>
  );
}

// ── Tab Button ────────────────────────────────────────────────────────────────
function TabBtn({ active, disabled, label, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        borderBottom: `2px solid ${active ? C.accent : "transparent"}`,
        padding: "10px 20px",
        fontFamily: "'DM Mono',monospace",
        fontSize: 10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        cursor: disabled ? "default" : "pointer",
        color: disabled ? C.muted2 : active ? C.accent : C.muted,
        transition: "all 0.15s",
        marginBottom: -1,
      }}
    >
      {label}
    </button>
  );
}

// ── Build Prompt ──────────────────────────────────────────────────────────────
function buildPrompt(vals, samps) {
  const filled = LANES.filter((l) => samps[l.id].trim());

  const dimSummary = DIMS.map((d) => {
    const v = vals[d.id];
    const pos =
      v < 25
        ? `strongly ${d.L}`
        : v < 45
        ? `leaning ${d.L}`
        : v < 55
        ? "balanced"
        : v < 75
        ? `leaning ${d.R}`
        : `strongly ${d.R}`;
    return `${d.label}: ${pos} (${v}/100)`;
  }).join("\n");

  const tensions = TENSION_PAIRS.filter(([a, b]) => {
    const va = vals[a],
      vb = vals[b];
    return (va < 40 && vb > 60) || (va > 60 && vb < 40);
  }).map(([a, b]) => {
    const da = DIMS.find((d) => d.id === a),
      db = DIMS.find((d) => d.id === b);
    return `${da.label} (${vals[a] < 50 ? da.L : da.R}) vs ${db.label} (${vals[b] < 50 ? db.L : db.R})`;
  });

  const sampleBlock = filled.length
    ? filled.map((l) => `[${l.label.toUpperCase()}]\n"${samps[l.id]}"`).join("\n\n")
    : "(No samples — work from dimension profile only.)";

  return `You are a literary voice analyst — rigorous, pattern-obsessed, allergic to flattery. Surface what is actually distinctive and surprising about this writer's voice.

CONTEXT: The essay/blog sample is drawn from professional strategic documents — conference playbooks, executive briefings, product positioning. This is his most developed and public-facing voice. The memoir and lyric lanes may be empty — if so, note what you'd expect those voices to need based on the essay patterns.

A writer is at the "I don't know what my voice is yet" stage, writing across memoir, lyrics, essays, and personal writing. Find what they cannot see from inside it.

DIMENSION SELF-ASSESSMENT:
${dimSummary}
${tensions.length ? `\nDETECTED TENSIONS:\n${tensions.map((t) => `- ${t}`).join("\n")}\n` : ""}
WRITING SAMPLES:
${sampleBlock}

Use EXACTLY these section headers:

## Voice Fingerprint
2–3 paragraphs. Specific portrait of what this voice sounds like. Reference actual dimensions and samples. Description not praise.

## What Your Voice Already Does
3 bullet points of genuine strengths specific to this profile.

## Where to Push
3 bullet points of productive growth edges for THIS profile. If memoir/lyric lanes are empty, speak to the specific challenge of a propulsive, armored professional voice learning to go slow and unguarded in personal writing.

## Hidden Gems
3–4 things the writer probably doesn't know about their own voice:
- Cross-lane patterns (or cross-register if only one lane)
- Tension features where opposing dimensions create something interesting
- Micro-habits in sentence structure: openings, closings, how they set up contrast
- The thing they probably think is just "how I write clearly" that is actually their sharpest stylistic tool

## Surprise Findings
2–3 contradictions. Format: "You probably think [X]. But actually [Y]."

## Three Targeted Exercises
**[Name]** — Setup: [2 sentences of what to do.] Develops: [what it builds for their specific voice.]

## Your Voice in One Line
One sentence logline. Specific enough it could only describe this writer.

Tone: direct, exacting, no flattery. Treat them as a serious writer.`;
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function VoiceMap() {
  const [tab, setTab] = useState("dims");
  const [vals, setVals] = useState({ ...PRESET });
  const [samps, setSamps] = useState(Object.fromEntries(LANES.map((l) => [l.id, l.preload || ""])));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setV = useCallback((id, v) => setVals((p) => ({ ...p, [id]: v })), []);
  const setS = useCallback((id, v) => setSamps((p) => ({ ...p, [id]: v })), []);
  const filled = LANES.filter((l) => samps[l.id].trim());

  const generate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const prompt = buildPrompt(vals, samps);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const text = data?.content?.find((b) => b.type === "text")?.text;
      if (!text) throw new Error("Empty response from API");
      setResult(text);
      setTab("result");
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sLabel = { fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent };
  const mLabel = { fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: C.muted };

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        padding: "40px 28px 80px",
        fontFamily: "'DM Mono','Courier New',monospace",
        color: C.txt,
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Mono:wght@400;500&display=swap');
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: ${C.accent};
          cursor: pointer;
          box-shadow: 0 0 8px ${C.accent}88;
          transition: transform .15s, box-shadow .15s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.4);
          box-shadow: 0 0 16px ${C.accent}CC;
        }
        input[type=range]::-moz-range-thumb {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: ${C.accent};
          border: none;
          cursor: pointer;
        }
        textarea:focus { border-color: ${C.accent} !important; outline: none; }
        textarea::placeholder { color: ${C.muted2}; }
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        button:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: 36, animation: "fadeIn 0.4s ease-out" }}>
        <div style={{ ...mLabel, marginBottom: 10 }}>Voice Development System</div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(2rem,5vw,3rem)",
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: C.txt,
          }}
        >
          Map Your
          <br />
          Writing Voice
        </div>
        <div style={{ width: 36, height: 2, background: C.accent, marginTop: 16 }} />
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.bdr}`, marginBottom: 36 }}>
        <TabBtn active={tab === "dims"} label="Dimensions" onClick={() => setTab("dims")} />
        <TabBtn active={tab === "samps"} label={`Samples (${filled.length})`} onClick={() => setTab("samps")} />
        <TabBtn active={tab === "result"} disabled={!result} label="Voice Map" onClick={() => result && setTab("result")} />
      </div>

      {/* ── Dimensions Tab ── */}
      {tab === "dims" && (
        <div style={{ animation: "fadeIn 0.3s ease-out" }}>
          <div style={{ display: "flex", gap: 48, alignItems: "start", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 400px", minWidth: 0 }}>
              <Notice>
                ✦ Sliders pre-set from analysis of your project docs — strategic playbooks, exec briefings, product
                positioning. Adjust anything that feels off, then add memoir and lyric samples for the full picture.
              </Notice>
              <div style={{ ...sLabel, marginBottom: 28 }}>Adjust where needed</div>
              {DIMS.map((d) => (
                <Slider key={d.id} dim={d} value={vals[d.id]} onChange={(v) => setV(d.id, v)} />
              ))}
              <button
                onClick={() => setTab("samps")}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  marginTop: 12,
                  background: "none",
                  border: `1px solid ${C.bdr}`,
                  borderRadius: 2,
                  color: C.txt2,
                  cursor: "pointer",
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = C.accent;
                  e.currentTarget.style.color = C.txt;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = C.bdr;
                  e.currentTarget.style.color = C.txt2;
                }}
              >
                Review Samples →
              </button>
            </div>
            <div
              style={{
                flex: "0 0 260px",
                position: "sticky",
                top: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={mLabel}>Live Fingerprint</div>
              <Radar vals={vals} />
              <div style={{ fontSize: 10, color: C.muted2, textAlign: "center", lineHeight: 1.7 }}>
                Shape updates as
                <br />
                you move sliders
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Samples Tab ── */}
      {tab === "samps" && (
        <div style={{ animation: "fadeIn 0.3s ease-out" }}>
          <div style={{ ...sLabel, marginBottom: 8 }}>Your writing samples</div>
          <Notice>
            ✦ <strong style={{ color: C.txt }}>Essay / Blog</strong> is pre-loaded from your project docs — the
            sharpest lines from the HumanX playbooks and AI cross-reference. Add{" "}
            <strong style={{ color: C.txt }}>Memoir</strong> and <strong style={{ color: C.txt }}>Lyrics</strong> to
            unlock the Hidden Gems analysis across lanes.
          </Notice>

          {LANES.map((l) => (
            <div key={l.id}>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: samps[l.id] ? C.accent : C.muted,
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {samps[l.id] && <span>✓</span>} {l.label}
                {l.id === "essay" && (
                  <span style={{ fontSize: 9, color: C.muted, letterSpacing: "0.1em" }}>
                    — pre-loaded from project docs
                  </span>
                )}
              </div>
              <textarea
                value={samps[l.id]}
                onChange={(e) => setS(l.id, e.target.value)}
                placeholder={l.ph}
                style={{
                  width: "100%",
                  minHeight: l.id === "essay" ? 180 : 100,
                  background: C.surf,
                  border: `1px solid ${samps[l.id] ? C.accent : C.bdr}`,
                  borderRadius: 3,
                  color: C.txt,
                  padding: "14px 16px",
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "1rem",
                  lineHeight: 1.78,
                  resize: "vertical",
                  marginBottom: 22,
                  display: "block",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
          ))}

          {error && (
            <div
              style={{
                background: C.errBg,
                border: `1px solid ${C.errBdr}`,
                borderRadius: 3,
                padding: "12px 16px",
                marginBottom: 16,
                fontSize: 11,
                color: C.err,
                lineHeight: 1.7,
              }}
            >
              ⚠ {error}
            </div>
          )}

          <button
            onClick={generate}
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px 0",
              background: loading ? C.surf : C.accent,
              color: loading ? C.muted : C.bg,
              border: "none",
              borderRadius: 2,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'DM Mono',monospace",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              transition: "background 0.2s",
            }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    border: `2px solid ${C.muted}`,
                    borderTopColor: C.accent,
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    display: "inline-block",
                  }}
                />
                Finding what you can't see from inside it
              </span>
            ) : (
              `Generate Voice Map (${filled.length} lane${filled.length !== 1 ? "s" : ""}) →`
            )}
          </button>
        </div>
      )}

      {/* ── Result Tab ── */}
      {tab === "result" && result && (
        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
            <div style={sLabel}>Your Voice Map</div>
            <button
              onClick={() => {
                setTab("dims");
                setResult(null);
                setError(null);
              }}
              style={{
                background: "none",
                border: `1px solid ${C.bdr}`,
                color: C.muted,
                padding: "7px 14px",
                fontFamily: "'DM Mono',monospace",
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 2,
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = C.accent;
                e.currentTarget.style.color = C.txt2;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = C.bdr;
                e.currentTarget.style.color = C.muted;
              }}
            >
              Recalibrate
            </button>
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.08rem" }}>
            <Md text={result} />
          </div>
          <div
            style={{
              marginTop: 52,
              padding: "22px 24px",
              background: C.surf,
              border: `1px solid ${C.bdr}`,
              borderRadius: 3,
            }}
          >
            <div style={{ ...mLabel, marginBottom: 10 }}>Next step</div>
            <p style={{ fontSize: 11, color: C.txt2, lineHeight: 1.85 }}>
              The essay lane is your most developed voice. Memoir and lyrics will likely surprise you — add those and
              regenerate to see where your professional voice ends and your personal voice begins. That gap is where
              the most interesting development lives.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
