import { useState, useMemo } from "react";

// ── ABSTREKKT DESIGN TOKENS ─────────────────────────────────────────────────
const T = {
  bgDeep:    "#0d0c0a",
  bgBase:    "#111008",
  bgSurface: "#17140e",
  bgRaised:  "#1e1a12",
  text1:     "#ede8df",
  text2:     "#b8ad9a",
  text3:     "#7a7468",
  text4:     "#4a4640",
  brass:     "#c8a86a",
  brassDim:  "#8b7548",
  brassFaint:"rgba(200,168,106,0.08)",
  rule:      "#252520",
  ruleHi:    "#363530",
  fontDisplay: "'Fraunces', Georgia, serif",
  fontBody:    "'Crimson Pro', Georgia, serif",
  fontMono:    "'JetBrains Mono', monospace",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Crimson+Pro:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=JetBrains+Mono:wght@400;500&display=swap');`;

// ── HELPERS ─────────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const m = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return "255,255,255";
  return `${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)}`;
}

// ── DATA ────────────────────────────────────────────────────────────────────
const DOMAINS = ["All", "Technical", "Creative", "Leadership", "Personal"];

const ASSESS = [
  { key:"avoiding",    label:"Avoiding",    color:"#e07070", note:"I tend to resist this tension" },
  { key:"working",     label:"Working On",  color:"#c8a86a", note:"Aware, still developing" },
  { key:"integrating", label:"Integrating", color:"#7aaa7a", note:"Active in my practice" },
];

const PARADOXES = [
  {
    id:1, emoji:"⚡", color:"#9d8fce",
    name:"The Socratic Paradox",
    pole1:"Knowing", pole2:"Not Knowing",
    tagline:"Expertise is comfort with uncertainty",
    corNote:"The architecture broke. The instinct didn't.",
    domains:["Leadership","Technical","Personal"],
    insight:"The deeper your knowledge in any domain, the more vividly the gaps become visible. This isn't failure — it's the signature of genuine understanding. Masters don't know more than beginners; they navigate the unknown with more confidence.",
    practices:[
      "End each study session by listing 3 things you now realize you don't know",
      "Seek the edges of your mental models — where do they crack under pressure?",
      "Cultivate beginner's mind deliberately, even in your strongest domains",
    ],
    workshop:{
      time:"15 min",
      question:"What's a belief you hold with high confidence in your domain? What would have to be true for you to be wrong about it?",
      exercise:"Known Unknown Map — write 3 things you know well, 3 you know you don't know, and 1 blind spot you're guessing exists. Share and compare the third column.",
      note:"The goal isn't to expose ignorance — it's to make the unknown feel navigable. Reframe gaps as terrain, not deficits. Listen for defensiveness when someone's third column is challenged.",
    }
  },
  {
    id:2, emoji:"🔄", color:"#6a9fd8",
    name:"The Teaching Paradox",
    pole1:"Learning", pole2:"Teaching",
    tagline:"Teach before you're ready — gaps become your roadmap",
    corNote:"I teach people who have what I never had.",
    domains:["Leadership","Creative","Technical"],
    insight:"Explaining forces your brain to build clean, transferable structures. Teach before you feel qualified — the places your explanation breaks down are precisely what you need to learn next. Creation before full consumption is often the faster path.",
    practices:[
      "Write a 'rubber duck explanation' aimed at an imaginary 10-year-old",
      "Publish content about something you just learned — gaps become fuel",
      "Explain a concept publicly before you've mastered it privately",
    ],
    workshop:{
      time:"20 min",
      question:"What's something you understand well enough to do but couldn't explain to a new hire in 5 minutes without jargon?",
      exercise:"2-Minute Teach — each person explains their current project to someone with zero context. No jargon. The places where you hedge or stumble are your next learning agenda.",
      note:"Listen for hedging language: 'basically', 'kind of', 'you know what I mean'. These are the seams where understanding is thin. Don't smooth over them — map them.",
    }
  },
  {
    id:3, emoji:"🌊", color:"#5aaa88",
    name:"The Forgetting Paradox",
    pole1:"Remembering", pole2:"Forgetting",
    tagline:"Strategic forgetting strengthens long-term memory",
    corNote:"The documentation isn't organization — it's the place I keep things when my head won't.",
    domains:["Technical","Personal"],
    insight:"Memory isn't storage — it's reconstruction. Every retrieval rebuilds the neural connection stronger. Letting knowledge fade slightly before retrieving it is the mechanism of lasting mastery, not a failure of attention.",
    practices:[
      "Use spaced repetition: review at growing intervals — 1 day, 3 days, 1 week, 1 month",
      "Test yourself before reviewing — retrieve before you re-read",
      "Trust the fade: resist immediately re-reading when something feels fuzzy",
    ],
    workshop:{
      time:"10 min",
      question:"What's the most critical knowledge your team relies on that only exists in someone's head — with no retrieval system?",
      exercise:"Memory Audit — list the 5 most important things your team needs to retain. For each: Is there a retrieval trigger? A review schedule? Or just hope?",
      note:"The question isn't 'what do we know?' — it's 'what's our system for knowing it again when we need it?' Most teams have zero answer to the second question. That's the real risk surface.",
    }
  },
  {
    id:4, emoji:"🔥", color:"#c87070",
    name:"The Failure Paradox",
    pole1:"Success", pole2:"Failure",
    tagline:"Mistakes are the mechanism of mastery",
    corNote:"Hope score: 27. Readiness to change: 10 out of 10. Willingness without hope — that's where the build started.",
    domains:["Technical","Creative","Leadership","Personal"],
    insight:"Struggle is not a signal to stop — it's the signal that learning is actually happening. Cognitive scientists call it 'desirable difficulty': making tasks harder on purpose accelerates durable skill formation. Ease is the enemy.",
    practices:[
      "Work at the edge of competence, not safely inside your comfort zone",
      "Treat errors as data points, not verdicts on your capability",
      "Actively seek problems you can't yet solve — not ones you already can",
    ],
    workshop:{
      time:"25 min",
      question:"What's the last mistake in your work you learned something specific from — not just 'I should be more careful'?",
      exercise:"Error Log — share 3 recent failures. For each: What did you try? What happened? What's the single clearest, most specific lesson you can write as a rule you'll actually use?",
      note:"Watch for abstract lessons ('communicate better', 'be more thorough'). Push until the lesson is specific enough to apply in a named situation. Abstractions don't transfer — specifics do.",
    }
  },
  {
    id:5, emoji:"⏳", color:"#c8a86a",
    name:"The Speed Paradox",
    pole1:"Fast", pole2:"Slow",
    tagline:"Slowing down is how you actually accelerate",
    corNote:"Not optimism. Willingness. Different engine, much lower floor.",
    domains:["Technical","Personal"],
    insight:"The urgency to consume more, faster, is almost always the enemy of real learning. Depth compounds; volume doesn't. One concept truly integrated into how you think beats ten concepts grazed and forgotten.",
    practices:[
      "Choose one concept to understand deeply rather than ten to understand shallowly",
      "Build something with what you've learned before moving to the next idea",
      "Read difficult things slowly — the friction is the feature, not the bug",
    ],
    workshop:{
      time:"15 min",
      question:"What are you currently consuming — courses, articles, content — that you haven't actually built anything with yet?",
      exercise:"Depth Audit — list the last 10 things you 'learned'. Mark each Applied/Built or Just Consumed. Calculate your ratio. What would it take to flip one item from Consumed to Applied this week?",
      note:"The goal isn't to shame passive consumption — it's to make the transition from input to use a deliberate choice rather than an indefinitely deferred intention.",
    }
  },
  {
    id:6, emoji:"🏗️", color:"#5aaac8",
    name:"The Structure Paradox",
    pole1:"Structure", pole2:"Chaos",
    tagline:"Constraints are the engine of creativity",
    corNote:"I don't break rules. I find frameworks that allow me.",
    domains:["Creative","Technical","Leadership"],
    insight:"Total freedom paralyzes. Total structure suffocates. The sweet spot is constrained exploration — a scaffold strong enough to support you, loose enough to surprise you. The sonnet is a constraint. So is the sprint.",
    practices:[
      "Set hard time constraints on open-ended learning or creative sessions",
      "Impose an artificial limitation on your next project to see what it unlocks",
      "Build a skeleton structure first — then deliberately deviate from it",
    ],
    workshop:{
      time:"20 min",
      question:"When has a hard deadline, word limit, or tight budget produced better work than an open-ended scope would have?",
      exercise:"Constraint Sprint — give the group a problem. Rules: 5 minutes only, must fit on one index card, explain to someone with no background. Compare outputs and trace how the specific constraint shaped each person's choices.",
      note:"Creative insight doesn't come from the constraint itself — it comes from the decision-making pressure the constraint creates. Help the group name the decisions they made, not just the outputs they produced.",
    }
  },
  {
    id:7, emoji:"∞", color:"#aa7acc",
    name:"The Complexity Paradox",
    pole1:"Simple", pole2:"Complex",
    tagline:"The simple contains infinite depth",
    corNote:"Built out of non-standard materials, using a process I'm still inventing while I live inside it.",
    domains:["Technical","Leadership"],
    insight:"Mastery moves in two directions simultaneously: toward deeper complexity (discovering what you didn't know was there) and toward radical simplicity (seeing the elegant core beneath the noise). Both are always available. Neither is ever final.",
    practices:[
      "Ask: 'What's the simplest true version of this?'",
      "Then ask: 'What important complexity did I just hide by simplifying?'",
      "Seek models simple enough to use daily and honest enough to trust under pressure",
    ],
    workshop:{
      time:"15 min",
      question:"What's something in your domain that most people explain too simply? What complexity do they usually hide — and does hiding it actually matter?",
      exercise:"Two-Direction Explanation — each person explains their expertise first in one sentence, then in one paragraph. Group: What's lost in the sentence? What's clarified? What does the gap reveal about what you value?",
      note:"The one-sentence version reveals values — what you prioritize when forced to cut. The paragraph version reveals assumptions — what you add back because you think it matters. Both are worth naming explicitly.",
    }
  },
  {
    id:8, emoji:"◐", color:"#c8885a",
    name:"The Presence Paradox",
    pole1:"In It", pole2:"Above It",
    tagline:"Reading the room is a way of not being in it",
    corNote:"The systems saved me and keep me at arm's length from the thing that broke me. Both are true.",
    domains:["Personal","Leadership"],
    insight:"The diagnostic instinct — reading a room, a process, a system — is the same skill that can hold you at observer distance from your own life. Pattern recognition is not the same as presence. Sometimes the thing that saves you from chaos also keeps you safely outside the thing you actually needed to feel.",
    practices:[
      "Notice when you're diagnosing a moment instead of being in it — the two feel different",
      "Ask: is this skill protecting me right now, or distancing me from something I need?",
      "The system does its best work when you're also in the room, not just running it",
    ],
    workshop:{
      time:"20 min",
      question:"When has your strongest professional skill — the thing you're best at — created distance from something you actually needed to be present for?",
      exercise:"The Distance Map — each person names one domain where their strongest skill functions as both their greatest asset and their most sophisticated avoidance strategy. Share the specific mechanism, not just the pattern.",
      note:"This is the hardest module to facilitate. The diagnostic instinct is ego-syntonic — it doesn't feel like avoidance because it looks like competence. The shift is recognizing the difference between reading a room to serve it and reading a room to stay safe inside the read.",
    }
  },
];

const COR_FRAMING = `Recovery assumes returning to a previous state. There was nothing to return to. So I built. The distinction matters: recovery is a story about getting something back. Construction is a story about making something that never existed in the form you need. Different project. Different materials. Different definition of done. Each of these paradoxes is a structural principle from that build — not a lesson about what was lost, but a load-bearing element of what was made. You don't resolve the tension. You learn to build with it.`;

// ── COMPONENT ────────────────────────────────────────────────────────────────
export default function ParadoxLearningFramework() {
  const [tab,         setTab]         = useState("Explore");
  const [domain,      setDomain]      = useState("All");
  const [openId,      setOpenId]      = useState(null);
  const [assessments, setAssessments] = useState({});
  const [showCOR,     setShowCOR]     = useState(false);

  const toggle = (id) => setOpenId(p => p === id ? null : id);
  const rate   = (id, level) => setAssessments(p => ({ ...p, [id]: level }));

  const filtered = useMemo(
    () => domain === "All" ? PARADOXES : PARADOXES.filter(p => p.domains.includes(domain)),
    [domain]
  );

  const summary = useMemo(() => {
    const c = { avoiding:0, working:0, integrating:0, unset:0 };
    PARADOXES.forEach(p => { const a = assessments[p.id]; a ? c[a]++ : c.unset++; });
    return c;
  }, [assessments]);

  const avoided    = PARADOXES.filter(p => assessments[p.id] === "avoiding");
  const totalRated = PARADOXES.length - summary.unset;

  // ── micro-components ──
  const MonoLabel = ({ children, color, style={} }) => (
    <span style={{
      fontFamily: T.fontMono, fontSize:"0.6rem", letterSpacing:"0.2em",
      textTransform:"uppercase", fontWeight:500, color: color || T.brassDim, ...style
    }}>{children}</span>
  );

  const TensionBar = ({ p }) => (
    <div style={{ display:"flex", alignItems:"center", gap:"0.7rem", marginBottom:"0.85rem" }}>
      <span style={{ fontFamily:T.fontDisplay, fontWeight:500, fontSize:"0.95rem", color:T.text1, whiteSpace:"nowrap" }}>{p.pole1}</span>
      <div style={{ flex:1, height:2, position:"relative" }}>
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(90deg,${p.color}cc,${p.color}22,${p.color}cc)`, borderRadius:4 }} />
        <div style={{
          position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          width:8, height:8, borderRadius:"50%",
          background: T.bgBase, border:`1.5px solid ${p.color}`, boxShadow:`0 0 10px ${p.color}88`
        }} />
      </div>
      <span style={{ fontFamily:T.fontDisplay, fontWeight:500, fontSize:"0.95rem", color:T.text1, whiteSpace:"nowrap" }}>{p.pole2}</span>
    </div>
  );

  return (
    <>
      <style>{`${FONTS}*{box-sizing:border-box}::selection{background:rgba(200,168,106,0.25);color:#ede8df}`}</style>

      <div style={{
        background: `linear-gradient(160deg, ${T.bgDeep} 0%, ${T.bgBase} 55%, ${T.bgDeep} 100%)`,
        minHeight:"100vh", fontFamily:T.fontBody, color:T.text1,
        padding:"3rem 1.5rem 5rem", boxSizing:"border-box"
      }}>

        {/* ══ HEADER ══ */}
        <div style={{ textAlign:"center", maxWidth:680, margin:"0 auto 2.5rem" }}>
          <span style={{
            display:"inline-block",
            fontFamily:T.fontMono, fontSize:"0.58rem", letterSpacing:"0.32em",
            color:T.brass, textTransform:"uppercase", fontWeight:500,
            padding:"0.38rem 1.1rem",
            border:`1px solid rgba(200,168,106,0.22)`,
            borderRadius:2, background:T.brassFaint, marginBottom:"1.5rem"
          }}>◈ A Learning Philosophy ◈</span>

          <h1 style={{
            fontFamily:T.fontDisplay, fontWeight:400,
            fontStyle:"italic",
            fontSize:"clamp(2.4rem, 6vw, 4.2rem)",
            background:`linear-gradient(135deg, ${T.text1} 0%, ${T.brass} 55%, ${T.brassDim} 100%)`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            margin:"0 0 1.1rem", lineHeight:1.05, letterSpacing:"-0.02em"
          }}>The Paradox<br />Learning Framework</h1>

          <p style={{
            fontFamily:T.fontBody, fontStyle:"italic",
            color:T.text3, fontSize:"1.1rem", lineHeight:1.8, margin:"0 0 1.5rem"
          }}>
            Profound learning doesn't happen <em style={{color:T.text2}}>despite</em> contradictions.
            <br />It happens <em style={{color:T.text2}}>through</em> them.
          </p>

          {/* CoR toggle */}
          <button onClick={() => setShowCOR(p => !p)} style={{
            background: showCOR ? T.brassFaint : "transparent",
            border:`1px solid rgba(200,168,106,0.2)`, color:T.brassDim,
            borderRadius:2, padding:"0.38rem 0.9rem",
            fontFamily:T.fontMono, fontSize:"0.65rem", letterSpacing:"0.1em",
            cursor:"pointer", fontWeight:500, transition:"all 0.2s"
          }}>
            {showCOR ? "▼" : "▶"} Construction over Recovery framing
          </button>

          {showCOR && (
            <div style={{
              marginTop:"0.75rem", background:T.brassFaint,
              border:`1px solid rgba(200,168,106,0.14)`,
              borderLeft:`2px solid ${T.brassDim}`,
              padding:"1.25rem 1.5rem", textAlign:"left"
            }}>
              <MonoLabel style={{ display:"block", marginBottom:"0.65rem" }}>Construction over Recovery</MonoLabel>
              <p style={{ fontFamily:T.fontBody, color:T.text2, fontSize:"0.95rem", lineHeight:1.85, margin:0 }}>
                {COR_FRAMING.split("Construction is a story about making something that never existed in the form you need.").map((part, i) =>
                  i === 0
                    ? <span key={i}>{part}<em style={{color:T.text1, fontStyle:"italic"}}>Construction is a story about making something that never existed in the form you need.</em></span>
                    : <span key={i}>{part}</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* ══ TABS ══ */}
        <div style={{ display:"flex", gap:"0.5rem", justifyContent:"center", marginBottom:"2rem", flexWrap:"wrap" }}>
          {[{id:"Explore",icon:"◫"},{id:"Self-Assessment",icon:"◈"},{id:"Workshop",icon:"◆"}].map(({ id, icon }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding:"0.42rem 1.15rem", borderRadius:2, cursor:"pointer",
              fontFamily:T.fontMono, fontSize:"0.68rem", letterSpacing:"0.1em",
              fontWeight:500, border:"1px solid", transition:"all 0.2s",
              background: tab===id ? T.brassFaint : "transparent",
              borderColor: tab===id ? `rgba(200,168,106,0.35)` : T.rule,
              color: tab===id ? T.brass : T.text4
            }}>{icon} {id}</button>
          ))}
        </div>

        {/* ══════════════════════════════
            TAB: EXPLORE
        ══════════════════════════════ */}
        {tab === "Explore" && (
          <>
            {/* Domain filter */}
            <div style={{ display:"flex", gap:"0.4rem", justifyContent:"center", marginBottom:"1.75rem", flexWrap:"wrap" }}>
              {DOMAINS.map(d => (
                <button key={d} onClick={() => setDomain(d)} style={{
                  padding:"0.28rem 0.8rem", borderRadius:2, cursor:"pointer",
                  fontFamily:T.fontMono, fontSize:"0.62rem", letterSpacing:"0.12em",
                  fontWeight:500, border:"1px solid", transition:"all 0.2s",
                  background: domain===d ? T.brassFaint : "transparent",
                  borderColor: domain===d ? `rgba(200,168,106,0.3)` : T.rule,
                  color: domain===d ? T.brass : T.text4
                }}>{d}</button>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:"1px", maxWidth:1050, margin:"0 auto 4rem", background:T.rule, border:`1px solid ${T.rule}` }}>
              {filtered.map(p => {
                const isOpen = openId === p.id;
                const rgb    = hexToRgb(p.color);
                return (
                  <div key={p.id} onClick={() => toggle(p.id)} style={{
                    background: isOpen ? `rgba(${rgb},0.06)` : T.bgSurface,
                    padding:"1.5rem", cursor:"pointer", transition:"background 0.2s",
                    position:"relative", overflow:"hidden"
                  }}>
                    {isOpen && (
                      <div style={{
                        position:"absolute", top:-40, right:-40, width:180, height:180,
                        background:`radial-gradient(circle,rgba(${rgb},0.1) 0%,transparent 70%)`,
                        pointerEvents:"none"
                      }} />
                    )}

                    {/* Card header */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1rem" }}>
                      <MonoLabel color={p.color}>{p.name}</MonoLabel>
                      <span style={{ fontSize:"1.2rem", lineHeight:1 }}>{p.emoji}</span>
                    </div>

                    <TensionBar p={p} />

                    <p style={{
                      fontFamily:T.fontBody, fontStyle:"italic",
                      color:T.text4, fontSize:"0.88rem", margin:"0 0 0.65rem", lineHeight:1.55
                    }}>{p.tagline}</p>

                    {/* CoR note */}
                    {showCOR && (
                      <p style={{
                        fontFamily:T.fontBody, fontStyle:"italic",
                        color:T.brassDim, fontSize:"0.78rem", margin:"0 0 0.7rem",
                        lineHeight:1.5
                      }}>◈ {p.corNote}</p>
                    )}

                    {/* Domain chips */}
                    <div style={{ display:"flex", gap:"0.3rem", flexWrap:"wrap" }}>
                      {p.domains.map(d => (
                        <span key={d} style={{
                          fontFamily:T.fontMono, fontSize:"0.52rem", letterSpacing:"0.12em",
                          color:T.text4, border:`1px solid ${T.rule}`,
                          padding:"0.12rem 0.45rem", textTransform:"uppercase"
                        }}>{d}</span>
                      ))}
                    </div>

                    {/* Expanded */}
                    {isOpen && (
                      <div style={{
                        marginTop:"1.3rem", paddingTop:"1.3rem",
                        borderTop:`1px solid rgba(${rgb},0.18)`
                      }}>
                        <p style={{
                          fontFamily:T.fontBody,
                          color:T.text2, fontSize:"0.95rem", lineHeight:1.85, marginBottom:"1.3rem"
                        }}>{p.insight}</p>

                        <MonoLabel color={p.color} style={{ display:"block", marginBottom:"0.7rem" }}>Practice</MonoLabel>

                        <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
                          {p.practices.map((text, i) => (
                            <div key={i} style={{ display:"flex", gap:"0.75rem", alignItems:"flex-start" }}>
                              <div style={{
                                fontFamily:T.fontMono, width:18, height:18, minWidth:18,
                                border:`1px solid rgba(${rgb},0.4)`,
                                background:`rgba(${rgb},0.08)`,
                                display:"flex", alignItems:"center", justifyContent:"center",
                                fontSize:"0.55rem", color:p.color, fontWeight:500, marginTop:3
                              }}>{i+1}</div>
                              <span style={{ fontFamily:T.fontBody, color:T.text3, fontSize:"0.9rem", lineHeight:1.65 }}>{text}</span>
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

        {/* ══════════════════════════════
            TAB: SELF-ASSESSMENT
        ══════════════════════════════ */}
        {tab === "Self-Assessment" && (
          <div style={{ maxWidth:800, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:"2rem" }}>
              <p style={{ fontFamily:T.fontBody, fontStyle:"italic", color:T.text2, fontSize:"1rem", lineHeight:1.7, margin:"0 0 0.4rem" }}>
                For each paradox, mark where you honestly are right now.
              </p>
              <p style={{ fontFamily:T.fontMono, color:T.text4, fontSize:"0.62rem", letterSpacing:"0.1em", margin:0 }}>
                Not where you want to be — where you actually are.
              </p>
            </div>

            {/* Summary */}
            {totalRated > 0 && (
              <div style={{
                background:T.bgSurface, border:`1px solid ${T.ruleHi}`,
                borderLeft:`2px solid ${T.brass}`,
                padding:"1.25rem 1.5rem", marginBottom:"1.25rem"
              }}>
                <div style={{ display:"flex", gap:"2rem", justifyContent:"center", flexWrap:"wrap" }}>
                  {ASSESS.map(l => (
                    <div key={l.key} style={{ textAlign:"center" }}>
                      <div style={{ fontFamily:T.fontDisplay, fontSize:"2rem", fontWeight:400, color:l.color, lineHeight:1 }}>{summary[l.key]}</div>
                      <MonoLabel color={T.text4} style={{ marginTop:"0.25rem", display:"block" }}>{l.label}</MonoLabel>
                    </div>
                  ))}
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:T.fontDisplay, fontSize:"2rem", fontWeight:400, color:T.text4, lineHeight:1 }}>{summary.unset}</div>
                    <MonoLabel color={T.text4} style={{ marginTop:"0.25rem", display:"block" }}>Unrated</MonoLabel>
                  </div>
                </div>

                {avoided.length > 0 && (
                  <div style={{ marginTop:"1rem", paddingTop:"1rem", borderTop:`1px solid ${T.rule}`, textAlign:"center" }}>
                    <p style={{ fontFamily:T.fontMono, color:"#c87070", fontSize:"0.7rem", letterSpacing:"0.08em", fontWeight:500, margin:"0 0 0.35rem" }}>
                      Priority focus → {avoided.map(p => p.pole1 + " ↔ " + p.pole2).join(" · ")}
                    </p>
                    <p style={{ fontFamily:T.fontBody, fontStyle:"italic", color:T.text4, fontSize:"0.82rem", margin:0 }}>
                      The tensions you avoid most are usually doing the most work against you.
                    </p>
                  </div>
                )}

                {totalRated === PARADOXES.length && avoided.length === 0 && summary.working === 0 && (
                  <div style={{ marginTop:"1rem", paddingTop:"1rem", borderTop:`1px solid ${T.rule}`, textAlign:"center" }}>
                    <p style={{ fontFamily:T.fontBody, fontStyle:"italic", color:T.text3, fontSize:"0.85rem", margin:0 }}>
                      Everything integrating? Revisit your hardest paradox and ask whether you're being honest — or optimistic.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:"1px", background:T.rule, border:`1px solid ${T.rule}` }}>
              {PARADOXES.map(p => {
                const current = assessments[p.id];
                const lvl = ASSESS.find(l => l.key === current);
                return (
                  <div key={p.id} style={{
                    background: current ? `rgba(${hexToRgb(lvl.color)},0.04)` : T.bgSurface,
                    padding:"1rem 1.4rem"
                  }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"0.75rem" }}>
                      <div>
                        <MonoLabel color={p.color} style={{ display:"block", marginBottom:"0.2rem" }}>{p.name}</MonoLabel>
                        <span style={{ fontFamily:T.fontDisplay, fontWeight:400, fontSize:"0.9rem", color:T.text2 }}>
                          {p.pole1} <span style={{color:T.text4}}>↔</span> {p.pole2}
                        </span>
                      </div>
                      <div style={{ display:"flex", gap:"0.35rem", flexShrink:0 }}>
                        {ASSESS.map(l => (
                          <button key={l.key}
                            onClick={e => { e.stopPropagation(); rate(p.id, l.key); }}
                            title={l.note}
                            style={{
                              padding:"0.28rem 0.6rem", borderRadius:2, cursor:"pointer",
                              fontFamily:T.fontMono, fontSize:"0.6rem", letterSpacing:"0.08em",
                              fontWeight:500, border:"1px solid", transition:"all 0.2s",
                              background: current===l.key ? `rgba(${hexToRgb(l.color)},0.14)` : "transparent",
                              borderColor: current===l.key ? `${l.color}66` : T.rule,
                              color: current===l.key ? l.color : T.text4
                            }}>{l.label}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════
            TAB: WORKSHOP
        ══════════════════════════════ */}
        {tab === "Workshop" && (
          <div style={{ maxWidth:860, margin:"0 auto" }}>
            <div style={{
              background:T.bgSurface, borderLeft:`2px solid ${T.brass}`,
              border:`1px solid ${T.ruleHi}`,
              padding:"1.25rem 1.5rem", marginBottom:"2rem"
            }}>
              <MonoLabel style={{ display:"block", marginBottom:"0.5rem" }}>Facilitator Overview</MonoLabel>
              <p style={{ fontFamily:T.fontBody, color:T.text2, fontSize:"0.95rem", lineHeight:1.8, margin:0 }}>
                Each module is standalone at 10–25 minutes. Run one per session for sustained impact, or 3–4 for a half-day workshop.
                Start with the <em style={{color:T.text1}}>Failure Paradox</em> for teams with psychological safety.
                Start with the <em style={{color:T.text1}}>Socratic Paradox</em> for groups where expertise creates hierarchy.
              </p>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:"1px", background:T.rule, border:`1px solid ${T.rule}` }}>
              {PARADOXES.map(p => {
                const isOpen = openId === p.id;
                const rgb    = hexToRgb(p.color);
                return (
                  <div key={p.id} style={{
                    background: isOpen ? `rgba(${rgb},0.05)` : T.bgSurface,
                  }}>
                    {/* Row header */}
                    <div onClick={() => toggle(p.id)} style={{
                      padding:"1.1rem 1.4rem", cursor:"pointer",
                      display:"flex", justifyContent:"space-between", alignItems:"center",
                      borderLeft: isOpen ? `2px solid ${p.color}` : `2px solid transparent`,
                      transition:"border-color 0.2s"
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
                        <span style={{ fontSize:"1.1rem" }}>{p.emoji}</span>
                        <div>
                          <MonoLabel color={p.color} style={{ display:"block", marginBottom:"0.15rem" }}>{p.name}</MonoLabel>
                          <span style={{ fontFamily:T.fontDisplay, fontWeight:400, fontSize:"0.88rem", color:T.text2 }}>
                            {p.pole1} <span style={{color:T.text4}}>↔</span> {p.pole2}
                          </span>
                        </div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.7rem" }}>
                        <span style={{
                          fontFamily:T.fontMono, fontSize:"0.6rem", color:T.text4,
                          border:`1px solid ${T.rule}`, padding:"0.18rem 0.5rem", letterSpacing:"0.08em"
                        }}>⏱ {p.workshop.time}</span>
                        <span style={{ fontFamily:T.fontMono, color:T.text4, fontSize:"0.8rem" }}>{isOpen ? "▲" : "▼"}</span>
                      </div>
                    </div>

                    {/* Expanded content */}
                    {isOpen && (
                      <div style={{
                        padding:"0 1.4rem 1.4rem",
                        paddingTop:"1.2rem",
                        borderTop:`1px solid rgba(${rgb},0.15)`
                      }}>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:"1px", background:T.rule, marginBottom:"1px" }}>
                          <div style={{ background:T.bgRaised, padding:"1rem" }}>
                            <MonoLabel color="#6a9fd8" style={{ display:"block", marginBottom:"0.6rem" }}>💬 Discussion Prompt</MonoLabel>
                            <p style={{ fontFamily:T.fontBody, fontStyle:"italic", color:T.text1, fontSize:"0.9rem", lineHeight:1.75, margin:0 }}>
                              "{p.workshop.question}"
                            </p>
                          </div>
                          <div style={{ background:T.bgRaised, padding:"1rem" }}>
                            <MonoLabel color="#5aaa88" style={{ display:"block", marginBottom:"0.6rem" }}>🎯 Exercise</MonoLabel>
                            <p style={{ fontFamily:T.fontBody, color:T.text2, fontSize:"0.9rem", lineHeight:1.75, margin:0 }}>
                              {p.workshop.exercise}
                            </p>
                          </div>
                        </div>
                        <div style={{
                          background:T.brassFaint,
                          borderLeft:`2px solid ${T.brassDim}`,
                          padding:"0.9rem 1rem"
                        }}>
                          <MonoLabel color={T.brass} style={{ display:"block", marginBottom:"0.45rem" }}>🔑 Facilitator Note</MonoLabel>
                          <p style={{ fontFamily:T.fontBody, color:T.text3, fontSize:"0.9rem", lineHeight:1.7, margin:0 }}>
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
        <div style={{
          maxWidth:600, margin:"5rem auto 0",
          textAlign:"center", paddingTop:"2.5rem",
          borderTop:`1px solid ${T.rule}`
        }}>
          <p style={{
            fontFamily:T.fontDisplay, fontStyle:"italic", fontWeight:300,
            color:T.text3, fontSize:"1.15rem", lineHeight:1.7, margin:"0 0 0.6rem"
          }}>
            "Recovery assumes returning to a previous state.
            <br />There was nothing to return to.
            <br /><em style={{ color:T.text2, fontWeight:400 }}>So I built.</em>"
          </p>
          <MonoLabel color={T.text4} style={{ display:"block", marginBottom:"2rem" }}>
            The Construction Manifesto · v3
          </MonoLabel>

          <p style={{
            fontFamily:T.fontBody, fontStyle:"italic",
            color:T.text4, fontSize:"0.82rem", lineHeight:1.75,
            paddingTop:"1.25rem", borderTop:`1px solid ${T.rule}`, margin:0
          }}>
            "The test of a first-rate intelligence is the ability to hold two opposed ideas in mind at the same time and still retain the ability to function."
            <span style={{
              display:"block", marginTop:"0.5rem",
              fontFamily:T.fontMono, fontStyle:"normal",
              fontSize:"0.58rem", letterSpacing:"0.2em", textTransform:"uppercase"
            }}>F. Scott Fitzgerald</span>
          </p>
        </div>

      </div>
    </>
  );
}
