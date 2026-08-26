import { useState, useCallback } from "react";

/* ─── FF v3 Design Tokens ──────────────────────────────────────────────────── */
const T = {
  void:    "#000000",
  s1:      "#0B0B14",
  s2:      "#13131F",
  border:  "rgba(139,92,246,0.12)",
  borderS: "rgba(139,92,246,0.35)",
  violet:  "#8B5CF6",
  violetH: "#A855F7",
  magenta: "#EC4899",
  cyan:    "#22D3EE",
  text1:   "#FFFFFF",
  text2:   "#C7C7D1",
  text3:   "#8A8A96",
  text4:   "#5A5A64",
  grad:    "linear-gradient(135deg, #A855F7 0%, #EC4899 55%, #22D3EE 100%)",
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const DIMS = [
  { id:"rhythm",        label:"Rhythm",    L:"Percussive",  R:"Flowing"    },
  { id:"tone",          label:"Tone",      L:"Dry / Ironic", R:"Sincere"   },
  { id:"pov",           label:"POV",       L:"Confessional", R:"Observational" },
  { id:"register",      label:"Register",  L:"Street-level", R:"Literary"  },
  { id:"imagery",       label:"Imagery",   L:"Abstract",    R:"Concrete"   },
  { id:"pacing",        label:"Pacing",    L:"Meditative",  R:"Propulsive" },
  { id:"exposure",      label:"Exposure",  L:"Armored",     R:"Unguarded"  },
  { id:"edge",          label:"Edge",      L:"Gentle",      R:"Sharp"      },
];

const PRESET = {
  rhythm: 38, tone: 30, pov: 55, register: 45,
  imagery: 72, pacing: 80, exposure: 28, edge: 70,
};

const ESSAY_PRELOAD = `This is not a pitch for new work. This is a demonstration that work already completed validates what the market is demanding—and that formalizing Kyle's involvement accelerates INT's ability to capture it.

Consultants provide frameworks and analysis. Conferences provide market ground truth. The highest-confidence strategic decisions require both.

External consulting gives INT analysis. HumanX gives INT evidence. Together, they give INT certainty.

INT's moat is operationalization expertise, not AI tools. Tools are commoditizing; operationalization is not.

We're building a secure multi-tenant data vault for MSP operations. We call it Data Venue. I'd love to understand how your architecture handles tenant isolation—we're currently using AWS with row-level security and I'm benchmarking against enterprise alternatives.

Problems are not the enemy. Hidden problems are the enemy.`;

const LANES = [
  { id:"memoir",  label:"Memoir",       ph:"A paragraph from your memoir — raw draft preferred." },
  { id:"lyrics",  label:"Lyrics",       ph:"A lyric, verse, or fragment you've written." },
  { id:"essay",   label:"Essay / Blog", ph:"A passage from a post or essay.", preload: ESSAY_PRELOAD },
  { id:"other",   label:"Other",        ph:"A journal entry, a note — anything that feels real." },
];

/* ─── Radar ────────────────────────────────────────────────────────────────── */
function Radar({ vals }) {
  const n = DIMS.length, cx = 130, cy = 130, r = 88;
  const pt = (i, p) => {
    const a = (2 * Math.PI * i / n) - Math.PI / 2;
    return { x: cx + p * r * Math.cos(a), y: cy + p * r * Math.sin(a) };
  };
  const gridPcts = [0.25, 0.5, 0.75, 1];
  const shape = DIMS.map((d, i) => pt(i, (vals[d.id] ?? 50) / 100));
  const shapePath = shape.map((p, i) =>
    `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`
  ).join(" ") + "Z";

  return (
    <svg width="260" height="260" viewBox="0 0 260 260" aria-label="Voice dimension radar chart">
      <defs>
        <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#A855F7" stopOpacity="0.25" />
          <stop offset="55%"  stopColor="#EC4899" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.20" />
        </linearGradient>
        <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#A855F7" />
          <stop offset="55%"  stopColor="#EC4899" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>

      {gridPcts.map((pct, gi) => {
        const pts = DIMS.map((_, i) => pt(i, pct));
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + "Z";
        return <path key={gi} d={d} fill="none" stroke={T.border} strokeWidth="1" />;
      })}

      {DIMS.map((_, i) => {
        const e = pt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={e.x.toFixed(1)} y2={e.y.toFixed(1)} stroke="rgba(139,92,246,0.08)" strokeWidth="1" />;
      })}

      <path d={shapePath} fill="url(#radarFill)" stroke="url(#radarStroke)" strokeWidth="2" strokeLinejoin="round" />
      {shape.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="4" fill={T.violetH} />
      ))}

      {DIMS.map((d, i) => {
        const lp = pt(i, 1.42);
        return (
          <text key={i} x={lp.x.toFixed(1)} y={lp.y.toFixed(1)}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="8.5" fill={T.text3}
            fontFamily="'Geist Mono',monospace"
            style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ─── Markdown renderer ────────────────────────────────────────────────────── */
function Md({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  const out = []; let bullets = []; let k = 0;
  const flush = () => {
    if (bullets.length) {
      out.push(
        <ul key={k++} style={{ paddingLeft: 20, marginBottom: 18, color: T.text2 }}>
          {[...bullets]}
        </ul>
      );
      bullets = [];
    }
  };
  const inl = (s) => {
    const parts = s.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") && p.endsWith("**")
        ? <strong key={i} style={{ color: T.text1, fontWeight: 600 }}>{p.slice(2, -2)}</strong>
        : p
    );
  };

  for (const raw of lines) {
    if (/^#{1,3}\s/.test(raw)) {
      flush();
      const h = raw.replace(/^#+\s/, "");
      const isGem = /gem|surprise|hidden/i.test(h);
      out.push(
        <div key={k++} style={{
          fontFamily: "'Geist Mono',monospace", fontSize: 10,
          letterSpacing: "0.22em", textTransform: "uppercase",
          background: isGem ? `linear-gradient(90deg, ${T.cyan}, ${T.magenta})` : `linear-gradient(90deg, ${T.violetH}, ${T.magenta})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginTop: 32, marginBottom: 14,
        }}>
          {h}
        </div>
      );
    } else if (/^[-*]\s/.test(raw)) {
      const c = raw.replace(/^[-*]\s/, "");
      bullets.push(
        <li key={k++} style={{ marginBottom: 9, lineHeight: 1.85, color: T.text2 }}>
          {inl(c)}
        </li>
      );
    } else if (!raw.trim()) {
      flush();
      out.push(<div key={k++} style={{ height: 4 }} />);
    } else {
      flush();
      out.push(
        <p key={k++} style={{ marginBottom: 14, lineHeight: 1.9, color: T.text2 }}>
          {inl(raw)}
        </p>
      );
    }
  }
  flush();
  return <>{out}</>;
}

/* ─── Slider ───────────────────────────────────────────────────────────────── */
function Slider({ dim, value, onChange }) {
  const pct = value;
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: "1.1rem", fontWeight: 400, color: T.text1 }}>
          {dim.label}
        </span>
        <span style={{
          fontFamily: "'Geist Mono',monospace", fontSize: 10,
          color: T.violetH, letterSpacing: "0.05em",
          background: `${T.violetH}18`, padding: "2px 8px", borderRadius: 2,
        }}>
          {value}
        </span>
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between", fontSize: 9,
        letterSpacing: "0.1em", textTransform: "uppercase", color: T.text4, marginBottom: 8,
      }}>
        <span>{dim.L}</span><span>{dim.R}</span>
      </div>
      <input
        type="range" min={0} max={100} step={1} value={value}
        onChange={e => onChange(+e.target.value)}
        aria-label={`${dim.label} slider`}
        style={{
          width: "100%", cursor: "pointer",
          appearance: "none", WebkitAppearance: "none",
          height: 2, borderRadius: 2, outline: "none",
          background: `linear-gradient(to right, ${T.violetH} ${pct}%, rgba(139,92,246,0.15) ${pct}%)`,
        }}
      />
    </div>
  );
}

/* ─── Notice ───────────────────────────────────────────────────────────────── */
function Notice({ children }) {
  return (
    <div style={{
      background: `${T.violetH}0D`, border: `1px solid ${T.border}`,
      borderLeft: `2px solid ${T.violetH}`,
      borderRadius: 4, padding: "12px 16px", marginBottom: 28,
      fontSize: 11, color: T.text3, lineHeight: 1.8,
    }}>
      {children}
    </div>
  );
}

/* ─── Skeleton loader ──────────────────────────────────────────────────────── */
function Skeleton() {
  const bar = (w, mt = 0) => (
    <div style={{
      height: 12, borderRadius: 2,
      background: `linear-gradient(90deg, ${T.s2} 25%, rgba(139,92,246,0.08) 50%, ${T.s2} 75%)`,
      backgroundSize: "400% 100%",
      animation: "shimmer 1.4s infinite",
      width: w, marginTop: mt,
    }} />
  );
  return (
    <div style={{ padding: "8px 0" }}>
      <style>{`@keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:-100% 0} }`}</style>
      <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: T.text4, marginBottom: 24 }}>
        Analyzing voice patterns...
      </div>
      {[["60%",0],["80%",12],["45%",8],["70%",28],["55%",12],["75%",8],["50%",28],["65%",12]].map(([w,mt],i)=>
        <div key={i}>{bar(w, mt)}</div>
      )}
    </div>
  );
}

/* ─── Panel wrapper ────────────────────────────────────────────────────────── */
function Panel({ children, style = {} }) {
  return (
    <div style={{
      background: "rgba(19,19,31,0.7)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: `1px solid ${T.border}`,
      borderRadius: 6, padding: "24px",
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── Label ────────────────────────────────────────────────────────────────── */
function Label({ children, muted = false }) {
  return (
    <div style={{
      fontFamily: "'Geist Mono',monospace", fontSize: 9,
      letterSpacing: "0.22em", textTransform: "uppercase",
      color: muted ? T.text4 : T.violetH, marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

/* ─── Tab Button ───────────────────────────────────────────────────────────── */
function TabBtn({ active, disabled, onClick, children }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        background: "none", border: "none",
        borderBottom: `2px solid ${active ? T.violetH : "transparent"}`,
        padding: "10px 22px 12px", marginBottom: -1,
        fontFamily: "'Geist Mono',monospace", fontSize: 9,
        letterSpacing: "0.2em", textTransform: "uppercase",
        cursor: disabled ? "default" : "pointer",
        color: disabled ? T.text4 : active ? T.violetH : T.text3,
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────────── */
export default function VoiceMap() {
  const [tab, setTab]     = useState("dims");
  const [vals, setVals]   = useState({ ...PRESET });
  const [samps, setSamps] = useState(
    Object.fromEntries(LANES.map(l => [l.id, l.preload || ""]))
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const setV = useCallback((id, v) => setVals(p => ({ ...p, [id]: v })), []);
  const setS = useCallback((id, v) => setSamps(p => ({ ...p, [id]: v })), []);
  const filled = LANES.filter(l => samps[l.id].trim());

  const buildPrompt = () => {
    const dimSummary = DIMS.map(d => {
      const v = vals[d.id];
      const pos = v < 25 ? `strongly ${d.L}` : v < 45 ? `leaning ${d.L}` : v < 55 ? "balanced" : v < 75 ? `leaning ${d.R}` : `strongly ${d.R}`;
      return `${d.label}: ${pos} (${v}/100)`;
    }).join("\n");

    const tensions = [["exposure","tone"],["pov","edge"],["register","imagery"],["rhythm","pacing"]]
      .filter(([a, b]) => { const va = vals[a], vb = vals[b]; return (va < 40 && vb > 60) || (va > 60 && vb < 40); })
      .map(([a, b]) => {
        const da = DIMS.find(d => d.id === a), db = DIMS.find(d => d.id === b);
        return `${da.label} (${vals[a] < 50 ? da.L : da.R}) vs ${db.label} (${vals[b] < 50 ? db.L : db.R})`;
      });

    const sampleBlock = filled.length
      ? filled.map(l => `[${l.label.toUpperCase()}]\n"${samps[l.id]}"`).join("\n\n")
      : "(No samples — work from dimension profile only.)";

    return `You are a literary voice analyst — rigorous, pattern-obsessed, allergic to flattery. Surface what is actually distinctive and surprising about this writer's voice.

CONTEXT: The essay/blog sample is drawn from professional strategic documents — conference playbooks, executive briefings, product positioning. This is his most developed and public-facing voice. The memoir and lyric lanes may be empty — if so, note what you'd expect those voices to need based on the essay patterns.

A writer is at the "I don't know what my voice is yet" stage, writing across memoir, lyrics, essays, and personal writing. Find what they cannot see from inside it.

DIMENSION SELF-ASSESSMENT:
${dimSummary}
${tensions.length ? `\nDETECTED TENSIONS:\n${tensions.map(t => `- ${t}`).join("\n")}\n` : ""}
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
  };

  const generate = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt() }],
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.error?.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const text = data?.content?.find(b => b.type === "text")?.text;
      if (!text) throw new Error("Empty response from API");
      setResult(text);
      setTab("result");
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: T.s1, minHeight: "100vh",
      padding: "48px 32px 96px",
      fontFamily: "'Geist',sans-serif",
      color: T.text2, maxWidth: 920, margin: "0 auto",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500&family=Geist+Mono:wght@300;400;500&display=swap');
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%;
          background: ${T.violetH}; cursor: pointer;
          box-shadow: 0 0 0 3px ${T.s1}, 0 0 0 5px ${T.violetH}40;
          transition: transform .15s, box-shadow .15s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.25);
          box-shadow: 0 0 0 3px ${T.s1}, 0 0 0 7px ${T.violetH}60;
        }
        input[type=range]::-moz-range-thumb {
          width: 16px; height: 16px; border-radius: 50%;
          background: ${T.violetH}; border: none; cursor: pointer;
        }
        textarea { transition: border-color 0.2s; }
        textarea:focus { border-color: ${T.violetH} !important; outline: none; box-shadow: 0 0 0 3px ${T.violetH}18; }
        textarea::placeholder { color: ${T.text4}; }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
        ::selection { background: ${T.violetH}44; color: #fff; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: 44 }}>
        <div style={{
          fontFamily: "'Geist Mono',monospace", fontSize: 9,
          letterSpacing: "0.3em", textTransform: "uppercase",
          color: T.text4, marginBottom: 14,
        }}>
          FlashFusion — Voice Development System
        </div>
        <h1 style={{
          fontFamily: "'Instrument Serif',serif",
          fontSize: "clamp(2.4rem,5vw,3.6rem)",
          fontWeight: 400, lineHeight: 1.0, letterSpacing: "-0.02em",
          color: T.text1, margin: 0,
        }}>
          Map Your<br />Writing Voice
        </h1>
        <div style={{
          width: 40, height: 2, marginTop: 20,
          background: "linear-gradient(90deg, #A855F7, #EC4899)",
        }} />
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, marginBottom: 40 }}>
        <TabBtn active={tab === "dims"} onClick={() => setTab("dims")}>Dimensions</TabBtn>
        <TabBtn active={tab === "samps"} onClick={() => setTab("samps")}>
          Samples {filled.length > 0 && `(${filled.length})`}
        </TabBtn>
        <TabBtn active={tab === "result"} disabled={!result} onClick={() => result && setTab("result")}>
          Voice Map
        </TabBtn>
      </div>

      {/* ── Dimensions ── */}
      {tab === "dims" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 52, alignItems: "start" }}>
          <div>
            <Notice>
              Sliders pre-calibrated from your project docs — strategic playbooks, exec briefings, product positioning.
              Adjust anything that feels off, then add memoir and lyric samples for the full picture.
            </Notice>
            <Label>Calibrate your dimensions</Label>
            <div style={{ marginTop: 24 }}>
              {DIMS.map(d => (
                <Slider key={d.id} dim={d} value={vals[d.id]} onChange={v => setV(d.id, v)} />
              ))}
            </div>
            <button
              onClick={() => setTab("samps")}
              style={{
                width: "100%", padding: "13px 0", marginTop: 8,
                background: "none", border: `1px solid ${T.border}`,
                borderRadius: 4, color: T.text3, cursor: "pointer",
                fontFamily: "'Geist Mono',monospace", fontSize: 9,
                letterSpacing: "0.22em", textTransform: "uppercase",
                transition: "all 0.2s",
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = T.violetH; e.currentTarget.style.color = T.text1; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text3; }}
            >
              Add Samples →
            </button>
          </div>

          <div style={{ position: "sticky", top: 24 }}>
            <Panel style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "28px 20px" }}>
              <Label muted>Live Fingerprint</Label>
              <Radar vals={vals} />
              <div style={{ fontSize: 10, color: T.text4, textAlign: "center", lineHeight: 1.8, letterSpacing: "0.02em" }}>
                Shape updates in real time
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* ── Samples ── */}
      {tab === "samps" && (
        <div>
          <Notice>
            <strong style={{ color: T.text2 }}>Essay / Blog</strong> is pre-loaded from your project docs.
            Add <strong style={{ color: T.text2 }}>Memoir</strong> and <strong style={{ color: T.text2 }}>Lyrics</strong> to unlock
            the Hidden Gems cross-lane analysis.
          </Notice>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {LANES.map(l => {
              const has = samps[l.id].trim();
              return (
                <div key={l.id}>
                  <div style={{
                    fontFamily: "'Geist Mono',monospace", fontSize: 9,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: has ? T.violetH : T.text4,
                    marginBottom: 10, display: "flex", alignItems: "center", gap: 7,
                  }}>
                    {has && <span style={{ color: T.cyan }}>✓</span>}
                    {l.label}
                    {l.id === "essay" && (
                      <span style={{ fontSize: 8, color: T.text4 }}>— pre-loaded</span>
                    )}
                  </div>
                  <textarea
                    value={samps[l.id]}
                    onChange={e => setS(l.id, e.target.value)}
                    placeholder={l.ph}
                    style={{
                      width: "100%",
                      minHeight: l.id === "essay" ? 160 : 100,
                      background: T.s2,
                      border: `1px solid ${has ? `${T.violetH}40` : T.border}`,
                      borderRadius: 4, color: T.text1, padding: "14px 16px",
                      fontFamily: "'Instrument Serif',serif", fontSize: "1rem",
                      lineHeight: 1.8, resize: "vertical", display: "block",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {error && (
            <div style={{
              background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.3)",
              borderRadius: 4, padding: "12px 16px", marginTop: 20, marginBottom: 4,
              fontSize: 11, color: "#FDA4AF", lineHeight: 1.75,
            }}>
              ⚠ {error}
            </div>
          )}

          <button
            onClick={generate}
            disabled={loading}
            style={{
              width: "100%", padding: "15px 0", marginTop: 24,
              background: loading ? T.s2 : "linear-gradient(135deg, #A855F7, #EC4899 60%, #22D3EE)",
              color: loading ? T.text3 : T.void,
              border: loading ? `1px solid ${T.border}` : "none",
              borderRadius: 4, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Geist Mono',monospace", fontSize: 9,
              letterSpacing: "0.22em", textTransform: "uppercase",
              fontWeight: 500, transition: "opacity 0.2s",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Analyzing — finding what you can't see from inside it..."
              : `Generate Voice Map (${filled.length} lane${filled.length !== 1 ? "s" : ""}) →`}
          </button>
        </div>
      )}

      {/* ── Result ── */}
      {tab === "result" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
            <Label>Voice Map</Label>
            <button
              onClick={() => { setTab("dims"); setResult(null); setError(null); }}
              style={{
                background: "none", border: `1px solid ${T.border}`, color: T.text4,
                padding: "7px 16px", fontFamily: "'Geist Mono',monospace", fontSize: 9,
                letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer",
                borderRadius: 4, transition: "all 0.2s",
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = T.violetH; e.currentTarget.style.color = T.text2; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text4; }}
            >
              Recalibrate
            </button>
          </div>

          {loading && <Skeleton />}

          {result && (
            <>
              <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: "1.05rem", lineHeight: 1.9 }}>
                <Md text={result} />
              </div>
              <Panel style={{ marginTop: 52 }}>
                <Label muted>Next step</Label>
                <p style={{ fontSize: 13, color: T.text3, lineHeight: 1.85, margin: "10px 0 0" }}>
                  The essay lane is your most developed voice. Memoir and lyrics will likely surprise you —
                  add those and regenerate to see where your professional voice ends and your personal voice begins.
                  That gap is where the most interesting development lives.
                </p>
              </Panel>
            </>
          )}
        </div>
      )}
    </div>
  );
}
