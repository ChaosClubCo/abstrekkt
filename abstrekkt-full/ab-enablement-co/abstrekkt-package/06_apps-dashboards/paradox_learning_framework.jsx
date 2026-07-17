import { useState, useMemo } from "react";

function hexToRgb(hex) {
  const m = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return "255,255,255";
  return `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}`;
}

const DOMAINS = ["All", "Technical", "Creative", "Leadership", "Personal"];

const ASSESS = [
  { key: "avoiding",    label: "Avoiding",     color: "#f87171", note: "I tend to resist this tension" },
  { key: "working",     label: "Working On",   color: "#fbbf24", note: "Aware, still developing" },
  { key: "integrating", label: "Integrating",  color: "#34d399", note: "Active in my practice" }
];

const PARADOXES = [
  {
    id: 1, emoji: "⚡", color: "#818cf8",
    name: "The Socratic Paradox",
    pole1: "Knowing", pole2: "Not Knowing",
    tagline: "Expertise is comfort with uncertainty",
    corNote: "The architecture broke. The instinct didn't.",
    domains: ["Leadership","Technical","Personal"],
    insight: "The deeper your knowledge in any domain, the more vividly the gaps become visible. This isn't failure — it's the signature of genuine understanding. Masters don't know more than beginners; they navigate the unknown with more confidence.",
    practices: [
      "End each study session by listing 3 things you now realize you don't know",
      "Seek the edges of your mental models — where do they crack under pressure?",
      "Cultivate beginner's mind deliberately, even in your strongest domains"
    ],
    workshop: {
      time: "15 min",
      question: "What's a belief you hold with high confidence in your domain? What would have to be true for you to be wrong about it?",
      exercise: "Known Unknown Map — write 3 things you know well, 3 you know you don't know, and 1 blind spot you're guessing exists. Share and compare the third column.",
      note: "The goal isn't to expose ignorance — it's to make the unknown feel navigable. Reframe gaps as terrain, not deficits. Listen for defensiveness when someone's third column is challenged."
    }
  },
  {
    id: 2, emoji: "🔄", color: "#60a5fa",
    name: "The Teaching Paradox",
    pole1: "Learning", pole2: "Teaching",
    tagline: "Teach before you're ready — gaps become your roadmap",
    corNote: "I teach people who have what I never had.",
    domains: ["Leadership","Creative","Technical"],
    insight: "Explaining forces your brain to build clean, transferable structures. Teach before you feel qualified — the places your explanation breaks down are precisely what you need to learn next. Creation before full consumption is often the faster path.",
    practices: [
      "Write a 'rubber duck explanation' aimed at an imaginary 10-year-old",
      "Publish content about something you just learned — gaps become fuel",
      "Explain a concept publicly before you've mastered it privately"
    ],
    workshop: {
      time: "20 min",
      question: "What's something you understand well enough to do but couldn't explain to a new hire in 5 minutes without jargon?",
      exercise: "2-Minute Teach — each person explains their current project to someone with zero context. No jargon. The places where you hedge or stumble are your next learning agenda.",
      note: "Listen for hedging language: 'basically', 'kind of', 'you know what I mean'. These are the seams where understanding is thin. Don't smooth over them — map them."
    }
  },
  {
    id: 3, emoji: "🌊", color: "#34d399",
    name: "The Forgetting Paradox",
    pole1: "Remembering", pole2: "Forgetting",
    tagline: "Strategic forgetting strengthens long-term memory",
    corNote: "The documentation isn't organization — it's the place I keep things when my head won't.",
    domains: ["Technical","Personal"],
    insight: "Memory isn't storage — it's reconstruction. Every retrieval rebuilds the neural connection stronger. Letting knowledge fade slightly before retrieving it is the mechanism of lasting mastery, not a failure of attention.",
    practices: [
      "Use spaced repetition: review at growing intervals — 1 day, 3 days, 1 week, 1 month",
      "Test yourself before reviewing — retrieve before you re-read",
      "Trust the fade: resist immediately re-reading when something feels fuzzy"
    ],
    workshop: {
      time: "10 min",
      question: "What's the most critical knowledge your team relies on that only exists in someone's head — with no retrieval system?",
      exercise: "Memory Audit — list the 5 most important things your team needs to retain. For each: Is there a retrieval trigger? A review schedule? Or just hope?",
      note: "The question isn't 'what do we know?' — it's 'what's our system for knowing it again when we need it?' Most teams have zero answer to the second question. That's the real risk surface."
    }
  },
  {
    id: 4, emoji: "🔥", color: "#f87171",
    name: "The Failure Paradox",
    pole1: "Success", pole2: "Failure",
    tagline: "Mistakes are the mechanism of mastery",
    corNote: "Hope score: 27. Readiness to change: 10 out of 10. Willingness without hope — that's where the build started.",
    domains: ["Technical","Creative","Leadership","Personal"],
    insight: "Struggle is not a signal to stop — it's the signal that learning is actually happening. Cognitive scientists call it 'desirable difficulty': making tasks harder on purpose accelerates durable skill formation. Ease is the enemy.",
    practices: [
      "Work at the edge of competence, not safely inside your comfort zone",
      "Treat errors as data points, not verdicts on your capability",
      "Actively seek problems you can't yet solve — not ones you already can"
    ],
    workshop: {
      time: "25 min",
      question: "What's the last mistake in your work you learned something specific from — not just 'I should be more careful'?",
      exercise: "Error Log — share 3 recent failures. For each: What did you try? What happened? What's the single clearest, most specific lesson you can write as a rule you'll actually use?",
      note: "Watch for abstract lessons ('communicate better', 'be more thorough'). Push until the lesson is specific enough to apply in a named situation. Abstractions don't transfer — specifics do."
    }
  },
  {
    id: 5, emoji: "⏳", color: "#fbbf24",
    name: "The Speed Paradox",
    pole1: "Fast", pole2: "Slow",
    tagline: "Slowing down is how you actually accelerate",
    corNote: "Not optimism. Willingness. Different engine, much lower floor.",
    domains: ["Technical","Personal"],
    insight: "The urgency to consume more, faster, is almost always the enemy of real learning. Depth compounds; volume doesn't. One concept truly integrated into how you think beats ten concepts grazed and forgotten.",
    practices: [
      "Choose one concept to understand deeply rather than ten to understand shallowly",
      "Build something with what you've learned before moving to the next idea",
      "Read difficult things slowly — the friction is the feature, not the bug"
    ],
    workshop: {
      time: "15 min",
      question: "What are you currently consuming — courses, articles, content — that you haven't actually built anything with yet?",
      exercise: "Depth Audit — list the last 10 things you 'learned'. Mark each Applied/Built or Just Consumed. Calculate your ratio. What would it take to flip one item from Consumed to Applied this week?",
      note: "The goal isn't to shame passive consumption — it's to make the transition from input to use a deliberate choice rather than an indefinitely deferred intention."
    }
  },
  {
    id: 6, emoji: "🏗️", color: "#38bdf8",
    name: "The Structure Paradox",
    pole1: "Structure", pole2: "Chaos",
    tagline: "Constraints are the engine of creativity",
    corNote: "I don't break rules. I find frameworks that allow me.",
    domains: ["Creative","Technical","Leadership"],
    insight: "Total freedom paralyzes. Total structure suffocates. The sweet spot is constrained exploration — a scaffold strong enough to support you, loose enough to surprise you. The sonnet is a constraint. So is the sprint.",
    practices: [
      "Set hard time constraints on open-ended learning or creative sessions",
      "Impose an artificial limitation on your next project to see what it unlocks",
      "Build a skeleton structure first — then deliberately deviate from it"
    ],
    workshop: {
      time: "20 min",
      question: "When has a hard deadline, word limit, or tight budget produced better work than an open-ended scope would have?",
      exercise: "Constraint Sprint — give the group a problem. Rules: 5 minutes only, must fit on one index card, explain to someone with no background. Compare outputs and trace how the specific constraint shaped each person's choices.",
      note: "Creative insight doesn't come from the constraint itself — it comes from the decision-making pressure the constraint creates. Help the group name the decisions they made, not just the outputs they produced."
    }
  },
  {
    id: 7, emoji: "∞", color: "#c084fc",
    name: "The Complexity Paradox",
    pole1: "Simple", pole2: "Complex",
    tagline: "The simple contains infinite depth",
    corNote: "Built out of non-standard materials, using a process I'm still inventing while I live inside it.",
    domains: ["Technical","Leadership"],
    insight: "Mastery moves in two directions simultaneously: toward deeper complexity (discovering what you didn't know was there) and toward radical simplicity (seeing the elegant core beneath the noise). Both are always available. Neither is ever final.",
    practices: [
      "Ask: 'What's the simplest true version of this?'",
      "Then ask: 'What important complexity did I just hide by simplifying?'",
      "Seek models simple enough to use daily and honest enough to trust under pressure"
    ],
    workshop: {
      time: "15 min",
      question: "What's something in your domain that most people explain too simply? What complexity do they usually hide — and does hiding it actually matter?",
      exercise: "Two-Direction Explanation — each person explains their expertise first in one sentence, then in one paragraph. Group: What's lost in the sentence? What's clarified? What does the gap between them reveal about what you value?",
      note: "The one-sentence version reveals values — what you prioritize when forced to cut. The paragraph version reveals assumptions — what you add back because you think it matters. Both are worth naming explicitly."
    }
  }
  ,{
    id: 8, emoji: "◐", color: "#fb923c",
    name: "The Presence Paradox",
    pole1: "In It", pole2: "Above It",
    tagline: "Reading the room is a way of not being in it",
    corNote: "The systems saved me and keep me at arm's length from the thing that broke me. Both are true.",
    domains: ["Personal","Leadership"],
    insight: "The diagnostic instinct — reading a room, a process, a system — is the same skill that can hold you at observer distance from your own life. Pattern recognition is not the same as presence. Sometimes the thing that saves you from chaos also keeps you safely outside the thing you actually needed to feel.",
    practices: [
      "Notice when you're diagnosing a moment instead of being in it — the two feel different",
      "Ask: is this skill protecting me right now, or distancing me from something I need?",
      "The system does its best work when you're also in the room, not just running it"
    ],
    workshop: {
      time: "20 min",
      question: "When has your strongest professional skill — the thing you're best at — created distance from something you actually needed to be present for?",
      exercise: "The Distance Map — each person names one domain where their strongest skill functions as both their greatest asset and their most sophisticated avoidance strategy. Share the specific mechanism, not just the pattern.",
      note: "This is the hardest module to facilitate. The diagnostic instinct is ego-syntonic — it doesn't feel like avoidance because it looks like competence. The shift is recognizing the difference between reading a room to serve it and reading a room to stay safe inside the read. Watch for people who are very articulate about the pattern but can't name the specific thing they're avoiding."
    }
  }
];

const COR_FRAMING = `Recovery assumes returning to a previous state. There was nothing to return to. So I built. The distinction matters: recovery is a story about getting something back. Construction is a story about making something that never existed in the form you need. Different project. Different materials. Different definition of done. Each of these paradoxes is a structural principle from that build — not a lesson about what was lost, but a load-bearing element of what was made. You don't resolve the tension. You learn to build with it.`;

export default function ParadoxLearningFramework() {
  const [tab,        setTab]        = useState("Explore");
  const [domain,     setDomain]     = useState("All");
  const [openId,     setOpenId]     = useState(null);
  const [assessments,setAssessments]= useState({});
  const [showCOR,    setShowCOR]    = useState(false);

  const toggle = (id) => setOpenId(p => p === id ? null : id);
  const rate   = (id, level) => setAssessments(p => ({ ...p, [id]: level }));

  const filtered = useMemo(
    () => domain === "All" ? PARADOXES : PARADOXES.filter(p => p.domains.includes(domain)),
    [domain]
  );

  const summary = useMemo(() => {
    const c = { avoiding: 0, working: 0, integrating: 0, unset: 0 };
    PARADOXES.forEach(p => { const a = assessments[p.id]; a ? c[a]++ : c.unset++; });
    return c;
  }, [assessments]);

  const avoided      = PARADOXES.filter(p => assessments[p.id] === "avoiding");
  const totalRated   = PARADOXES.length - summary.unset;

  // ── tiny reusable pieces
  const Pill = ({ children, active, onClick, color }) => (
    <button onClick={onClick} style={{
      padding: "0.32rem 0.85rem", borderRadius: 100, cursor: "pointer",
      fontSize: "0.72rem", fontWeight: 600, border: "1px solid",
      transition: "all 0.2s",
      background: active ? (color ? `${color}22` : "rgba(99,102,241,0.18)") : "transparent",
      borderColor: active ? (color || "rgba(99,102,241,0.5)") : "rgba(255,255,255,0.08)",
      color: active ? (color || "#a5b4fc") : "#475569"
    }}>{children}</button>
  );

  const TensionBar = ({ p }) => {
    const rgb = hexToRgb(p.color);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.85rem" }}>
        <span style={{ fontWeight: 700, fontSize: "0.93rem", color: "#f8fafc", whiteSpace: "nowrap" }}>{p.pole1}</span>
        <div style={{ flex: 1, height: 3, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg,${p.color}cc,${p.color}18,${p.color}cc)`, borderRadius: 4 }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: 10, height: 10, borderRadius: "50%",
            background: "#090916", border: `1.5px solid ${p.color}`, boxShadow: `0 0 14px ${p.color}99`
          }} />
        </div>
        <span style={{ fontWeight: 700, fontSize: "0.93rem", color: "#f8fafc", whiteSpace: "nowrap" }}>{p.pole2}</span>
      </div>
    );
  };

  return (
    <div style={{
      background: "linear-gradient(160deg, #05050e 0%, #090916 55%, #05050e 100%)",
      minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif",
      color: "#e2e8f0", padding: "3rem 1.5rem 5rem", boxSizing: "border-box"
    }}>

      {/* ══ HEADER ══ */}
      <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 2.5rem" }}>
        <span style={{
          display: "inline-block", fontSize: "0.6rem", letterSpacing: "0.32em",
          color: "#818cf8", textTransform: "uppercase", fontWeight: 700,
          padding: "0.38rem 1.1rem", border: "1px solid rgba(129,140,248,0.22)",
          borderRadius: 100, background: "rgba(129,140,248,0.06)", marginBottom: "1.4rem"
        }}>◈ A Learning Philosophy ◈</span>

        <h1 style={{
          fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)", fontWeight: 800,
          background: "linear-gradient(135deg, #f8fafc 0%, #c7d2fe 45%, #818cf8 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          margin: "0 0 1rem", lineHeight: 1.08, letterSpacing: "-0.04em"
        }}>The Paradox<br />Learning Framework</h1>

        <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: 1.8, margin: "0 0 1.5rem" }}>
          Profound learning doesn't happen <em>despite</em> contradictions.
          <br />It happens <em>through</em> them.
        </p>

        {/* CoR toggle */}
        <button onClick={() => setShowCOR(p => !p)} style={{
          background: showCOR ? "rgba(129,140,248,0.1)" : "transparent",
          border: "1px solid rgba(129,140,248,0.2)", color: "#6366f1",
          borderRadius: 8, padding: "0.38rem 0.9rem", fontSize: "0.72rem",
          cursor: "pointer", fontWeight: 600, letterSpacing: "0.05em", transition: "all 0.2s"
        }}>
          {showCOR ? "▼" : "▶"} Construction over Recovery framing
        </button>

        {showCOR && (
          <div style={{
            marginTop: "0.75rem", background: "rgba(99,102,241,0.07)",
            border: "1px solid rgba(99,102,241,0.16)", borderRadius: 12,
            padding: "1.2rem 1.5rem", textAlign: "left"
          }}>
            <p style={{ color: "#818cf8", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.6rem" }}>
              Construction over Recovery
            </p>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.8, margin: 0 }}>
              {COR_FRAMING.split("Construction builds forward from wherever you are.").map((part, i) =>
                i === 0 ? <span key={i}>{part}<strong style={{ color: "#c7d2fe" }}>Construction builds forward from wherever you are.</strong></span> : <span key={i}>{part}</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* ══ TABS ══ */}
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "2rem", flexWrap: "wrap" }}>
        {[
          { id: "Explore",         icon: "🗺" },
          { id: "Self-Assessment", icon: "📊" },
          { id: "Workshop",        icon: "🎯" }
        ].map(({ id, icon }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "0.45rem 1.15rem", borderRadius: 100, cursor: "pointer",
            fontSize: "0.78rem", fontWeight: 600, border: "1px solid", transition: "all 0.2s",
            background: tab === id ? "rgba(129,140,248,0.15)" : "transparent",
            borderColor: tab === id ? "rgba(129,140,248,0.4)" : "rgba(255,255,255,0.1)",
            color: tab === id ? "#c7d2fe" : "#64748b"
          }}>{icon} {id}</button>
        ))}
      </div>

      {/* ══════════════════════════════════════
          TAB: EXPLORE
      ══════════════════════════════════════ */}
      {tab === "Explore" && (
        <>
          {/* Domain filter */}
          <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", marginBottom: "1.75rem", flexWrap: "wrap" }}>
            {DOMAINS.map(d => (
              <Pill key={d} active={domain === d} onClick={() => setDomain(d)}>{d}</Pill>
            ))}
          </div>

          {filtered.length === 0 && (
            <p style={{ textAlign: "center", color: "#334155", fontSize: "0.875rem" }}>
              No paradoxes match that filter.
            </p>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px,1fr))", gap: "1rem", maxWidth: 1050, margin: "0 auto 4rem" }}>
            {filtered.map(p => {
              const isOpen = openId === p.id;
              const rgb    = hexToRgb(p.color);
              return (
                <div key={p.id} onClick={() => toggle(p.id)} style={{
                  background: isOpen ? `rgba(${rgb},0.05)` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isOpen ? p.color + "44" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 18, padding: "1.6rem", cursor: "pointer",
                  transition: "all 0.25s",
                  boxShadow: isOpen ? `0 0 60px rgba(${rgb},0.08),inset 0 1px 0 rgba(255,255,255,0.05)` : "inset 0 1px 0 rgba(255,255,255,0.03)",
                  position: "relative", overflow: "hidden"
                }}>
                  {isOpen && (
                    <div style={{
                      position: "absolute", top: -50, right: -50, width: 200, height: 200,
                      background: `radial-gradient(circle,rgba(${rgb},0.14) 0%,transparent 70%)`,
                      pointerEvents: "none"
                    }} />
                  )}

                  {/* Header row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
                    <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, color: p.color }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{p.emoji}</span>
                  </div>

                  <TensionBar p={p} />

                  <p style={{ color: "#475569", fontSize: "0.79rem", margin: "0 0 0.7rem", fontStyle: "italic", lineHeight: 1.55 }}>
                    {p.tagline}
                  </p>

                  {/* CoR note */}
                  {showCOR && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.7rem" }}>
                      <span style={{ color: "#6366f155", fontSize: "0.6rem" }}>◈</span>
                      <span style={{ color: "#6366f1", fontSize: "0.72rem", fontStyle: "italic" }}>{p.corNote}</span>
                    </div>
                  )}

                  {/* Domain chips */}
                  <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                    {p.domains.map(d => (
                      <span key={d} style={{
                        fontSize: "0.56rem", letterSpacing: "0.1em", color: "#334155",
                        border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4,
                        padding: "0.15rem 0.5rem", textTransform: "uppercase", fontWeight: 600
                      }}>{d}</span>
                    ))}
                  </div>

                  {/* Expanded body */}
                  {isOpen && (
                    <div style={{ marginTop: "1.4rem", paddingTop: "1.4rem", borderTop: `1px solid rgba(${rgb},0.15)` }}>
                      <p style={{ color: "#cbd5e1", fontSize: "0.875rem", lineHeight: 1.82, marginBottom: "1.4rem" }}>{p.insight}</p>
                      <p style={{ fontSize: "0.58rem", letterSpacing: "0.2em", color: p.color, textTransform: "uppercase", fontWeight: 700, marginBottom: "0.8rem" }}>
                        Practice
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        {p.practices.map((text, i) => (
                          <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                            <div style={{
                              width: 18, height: 18, minWidth: 18, borderRadius: "50%",
                              border: `1px solid ${p.color}55`, background: `rgba(${rgb},0.1)`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "0.58rem", color: p.color, fontWeight: 800, marginTop: 2
                            }}>{i + 1}</div>
                            <span style={{ color: "#94a3b8", fontSize: "0.84rem", lineHeight: 1.65 }}>{text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════
          TAB: SELF-ASSESSMENT
      ══════════════════════════════════════ */}
      {tab === "Self-Assessment" && (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.7, margin: "0 0 0.4rem" }}>
              For each paradox, mark where you honestly are right now.
            </p>
            <p style={{ color: "#334155", fontSize: "0.78rem", margin: 0 }}>
              Not where you want to be — where you actually are.
            </p>
          </div>

          {/* Summary bar */}
          {totalRated > 0 && (
            <div style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: "1.25rem 1.5rem", marginBottom: "1.5rem"
            }}>
              <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
                {ASSESS.map(l => (
                  <div key={l.key} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: l.color, lineHeight: 1 }}>
                      {summary[l.key]}
                    </div>
                    <div style={{ fontSize: "0.62rem", color: "#475569", marginTop: "0.2rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {l.label}
                    </div>
                  </div>
                ))}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "#334155", lineHeight: 1 }}>{summary.unset}</div>
                  <div style={{ fontSize: "0.62rem", color: "#334155", marginTop: "0.2rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Unrated</div>
                </div>
              </div>

              {avoided.length > 0 && (
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.04)", textAlign: "center" }}>
                  <p style={{ color: "#f87171", fontSize: "0.78rem", fontWeight: 600, margin: "0 0 0.3rem", letterSpacing: "0.06em" }}>
                    Priority focus → {avoided.map(p => p.pole1 + " ↔ " + p.pole2).join(" · ")}
                  </p>
                  <p style={{ color: "#475569", fontSize: "0.73rem", margin: 0, fontStyle: "italic" }}>
                    The tensions you avoid most are usually doing the most work against you.
                  </p>
                </div>
              )}

              {totalRated === PARADOXES.length && summary.avoiding === 0 && summary.working === 0 && (
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.04)", textAlign: "center" }}>
                  <p style={{ color: "#34d399", fontSize: "0.78rem", fontWeight: 600, margin: "0 0 0.3rem" }}>
                    Everything integrating?
                  </p>
                  <p style={{ color: "#475569", fontSize: "0.73rem", margin: 0, fontStyle: "italic" }}>
                    Revisit your hardest paradox and ask whether you're being honest — or optimistic.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Assessment rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {PARADOXES.map(p => {
              const current = assessments[p.id];
              const currentLevel = ASSESS.find(l => l.key === current);
              return (
                <div key={p.id} style={{
                  background: current ? `rgba(${hexToRgb(currentLevel.color)},0.04)` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${current ? currentLevel.color + "33" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 14, padding: "1.1rem 1.4rem"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                    <div>
                      <div style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, color: p.color, marginBottom: "0.2rem" }}>
                        {p.name}
                      </div>
                      <div style={{ color: "#64748b", fontSize: "0.82rem" }}>
                        <strong style={{ color: "#f8fafc" }}>{p.pole1}</strong>
                        <span style={{ color: "#334155", margin: "0 0.4rem" }}>↔</span>
                        <strong style={{ color: "#f8fafc" }}>{p.pole2}</strong>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.35rem", flexShrink: 0 }}>
                      {ASSESS.map(l => (
                        <button key={l.key}
                          onClick={(e) => { e.stopPropagation(); rate(p.id, l.key); }}
                          title={l.note}
                          style={{
                            padding: "0.32rem 0.65rem", borderRadius: 8, cursor: "pointer",
                            fontSize: "0.68rem", fontWeight: 600, border: "1px solid",
                            transition: "all 0.2s",
                            background: current === l.key ? `${l.color}22` : "transparent",
                            borderColor: current === l.key ? `${l.color}66` : "rgba(255,255,255,0.08)",
                            color: current === l.key ? l.color : "#475569"
                          }}
                        >{l.label}</button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB: WORKSHOP
      ══════════════════════════════════════ */}
      {tab === "Workshop" && (
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{
            background: "rgba(129,140,248,0.05)", border: "1px solid rgba(129,140,248,0.12)",
            borderRadius: 14, padding: "1.25rem 1.5rem", marginBottom: "2rem"
          }}>
            <p style={{ color: "#818cf8", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.5rem" }}>
              Facilitator Overview
            </p>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.75, margin: 0 }}>
              Each module is standalone at 10–25 minutes. Run one per session for sustained impact, or 3–4 for a half-day workshop. Start with the <strong style={{ color: "#c7d2fe" }}>Failure Paradox</strong> for teams with psychological safety. Start with the <strong style={{ color: "#c7d2fe" }}>Socratic Paradox</strong> for groups where expertise creates hierarchy.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {PARADOXES.map(p => {
              const isOpen = openId === p.id;
              const rgb    = hexToRgb(p.color);
              return (
                <div key={p.id} style={{
                  background: isOpen ? `rgba(${rgb},0.05)` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isOpen ? p.color + "44" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 16, overflow: "hidden",
                  boxShadow: isOpen ? `0 0 40px rgba(${rgb},0.06)` : "none"
                }}>
                  {/* Row header */}
                  <div onClick={() => toggle(p.id)} style={{
                    padding: "1.2rem 1.5rem", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ fontSize: "1.2rem" }}>{p.emoji}</span>
                      <div>
                        <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, color: p.color, marginBottom: "0.18rem" }}>
                          {p.name}
                        </div>
                        <div style={{ color: "#64748b", fontSize: "0.82rem" }}>
                          <strong style={{ color: "#cbd5e1" }}>{p.pole1}</strong>
                          <span style={{ color: "#334155", margin: "0 0.4rem" }}>↔</span>
                          <strong style={{ color: "#cbd5e1" }}>{p.pole2}</strong>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{
                        fontSize: "0.65rem", color: "#475569",
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 6, padding: "0.2rem 0.55rem", fontWeight: 600
                      }}>⏱ {p.workshop.time}</span>
                      <span style={{ color: "#334155", fontSize: "0.85rem" }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isOpen && (
                    <div style={{ padding: "0 1.5rem 1.5rem", paddingTop: "1.25rem", borderTop: `1px solid rgba(${rgb},0.12)` }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1rem", marginBottom: "1rem" }}>
                        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "1rem" }}>
                          <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#60a5fa", fontWeight: 700, marginBottom: "0.6rem" }}>
                            💬 Discussion Prompt
                          </p>
                          <p style={{ color: "#cbd5e1", fontSize: "0.84rem", lineHeight: 1.72, margin: 0, fontStyle: "italic" }}>
                            "{p.workshop.question}"
                          </p>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "1rem" }}>
                          <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#34d399", fontWeight: 700, marginBottom: "0.6rem" }}>
                            🎯 Exercise
                          </p>
                          <p style={{ color: "#94a3b8", fontSize: "0.84rem", lineHeight: 1.72, margin: 0 }}>
                            {p.workshop.exercise}
                          </p>
                        </div>
                      </div>
                      <div style={{ background: `rgba(${rgb},0.06)`, border: `1px solid rgba(${rgb},0.14)`, borderRadius: 10, padding: "0.9rem 1rem" }}>
                        <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: p.color, fontWeight: 700, marginBottom: "0.5rem" }}>
                          🔑 Facilitator Note
                        </p>
                        <p style={{ color: "#94a3b8", fontSize: "0.84rem", lineHeight: 1.65, margin: 0 }}>
                          {p.workshop.note}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ FOOTER ══ */}
      <div style={{ maxWidth: 620, margin: "4rem auto 0", textAlign: "center", paddingTop: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <p style={{ color: "#1e293b", fontSize: "1rem", lineHeight: 1.7, fontStyle: "italic", margin: "0 0 0.75rem" }}>
          "Recovery assumes returning to a previous state.<br />
          There was nothing to return to.<br />
          <strong style={{ color: "#374151", fontStyle: "normal" }}>So I built.</strong>"
          <span style={{ display: "block", marginTop: "0.65rem", fontSize: "0.62rem", letterSpacing: "0.24em", textTransform: "uppercase", fontStyle: "normal", color: "#1e293b" }}>
            The Construction Manifesto · v3
          </span>
        </p>
        <p style={{ color: "#111827", fontSize: "0.78rem", lineHeight: 1.7, fontStyle: "italic", margin: "1.5rem 0 0", borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: "1.25rem" }}>
          "The test of a first-rate intelligence is the ability to hold two opposed ideas in mind at the same time and still retain the ability to function."
          <span style={{ display: "block", marginTop: "0.5rem", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", fontStyle: "normal", color: "#0f172a" }}>
            F. Scott Fitzgerald
          </span>
        </p>
      </div>

    </div>
  );
}
