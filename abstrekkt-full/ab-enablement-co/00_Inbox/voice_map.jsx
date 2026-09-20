// ARCHITECTURE NOTES — read before editing
//
// Pro Move "Persistent slider profiles across sessions": localStorage / sessionStorage are BLOCKED
// in Claude artifacts by the platform. State resets on reload. Copy Config exports to clipboard
// as the functional workaround; Restore Config reads from clipboard.
//
// Pro Move "PDF export": not available in the artifact sandbox. Copy Result (clipboard) is the
// functional alternative.
//
// Security posture: no API key is needed in this artifact — the Anthropic proxy handles auth.
// "API key in state" directive maps to: connectionStatus in state, never logged, never rendered.
// StatusBadge shows LIVE / MOCK without exposing credentials. No key, no risk.
//
// Contradiction — max_tokens: system prompt says "always set 1000, it's handled already."
// Original component had 1200; user directive says resolve toward quality.
// Decision: keep 1000 (system-managed cap). Tradeoff: possible truncation on long 2-lane runs.
// Recovery action for users: regenerate after shortening samples if output cuts off.
//
// Contradiction — clientMode token set: FF v3 (violet/magenta/cyan) vs neutral (indigo/slate).
// Decision: FF v3 is default; clientMode=true in CONFIG object swaps the full token set in one edit.

import React, { useState, useEffect, useRef, useCallback } from "react";

/* ─── Productization config — all brand/name strings live here, white-label in one edit ── */
const CONFIG = {
  version:     "2.1.0",
  name:        "Voice Map",
  orgName:     "FlashFusion",
  orgTagline:  "Voice Development System",
  clientMode:  false, // true → neutral tokens, no FF branding, internal panels hidden
};

/* ─── Token sets ─────────────────────────────────────────────────────────────────────── */
const FF_TOKENS = {
  bg:"#0B0B14", surf:"#13131F",
  border:"rgba(139,92,246,0.12)", borderS:"rgba(139,92,246,0.35)",
  primary:"#A855F7", secondary:"#EC4899", accent:"#22D3EE",
  text1:"#FFFFFF", text2:"#C7C7D1", text3:"#8A8A96", text4:"#5A5A64",
  grad:"linear-gradient(135deg,#A855F7 0%,#EC4899 55%,#22D3EE 100%)",
  gradText:"linear-gradient(90deg,#A855F7,#EC4899)",
  warn:"#F59E0B", warnBg:"rgba(245,158,11,0.08)", warnBorder:"rgba(245,158,11,0.25)",
  err:"#FDA4AF",  errBg:"rgba(236,72,153,0.08)",  errBorder:"rgba(236,72,153,0.3)",
};
const NEUTRAL_TOKENS = {
  bg:"#0A0A0F", surf:"#12121A",
  border:"rgba(99,102,241,0.12)", borderS:"rgba(99,102,241,0.3)",
  primary:"#6366F1", secondary:"#8B5CF6", accent:"#38BDF8",
  text1:"#F8FAFC", text2:"#CBD5E1", text3:"#94A3B8", text4:"#64748B",
  grad:"linear-gradient(135deg,#6366F1 0%,#8B5CF6 55%,#38BDF8 100%)",
  gradText:"linear-gradient(90deg,#6366F1,#8B5CF6)",
  warn:"#F59E0B", warnBg:"rgba(245,158,11,0.08)", warnBorder:"rgba(245,158,11,0.25)",
  err:"#FDA4AF",  errBg:"rgba(236,72,153,0.08)",  errBorder:"rgba(236,72,153,0.3)",
};
const T = CONFIG.clientMode ? NEUTRAL_TOKENS : FF_TOKENS;

/* ─── Data ───────────────────────────────────────────────────────────────────────────── */
const DIMS = [
  { id:"rhythm",   label:"Rhythm",   L:"Percussive",   R:"Flowing"       },
  { id:"tone",     label:"Tone",     L:"Dry / Ironic", R:"Sincere"       },
  { id:"pov",      label:"POV",      L:"Confessional", R:"Observational" },
  { id:"register", label:"Register", L:"Street-level", R:"Literary"      },
  { id:"imagery",  label:"Imagery",  L:"Abstract",     R:"Concrete"      },
  { id:"pacing",   label:"Pacing",   L:"Meditative",   R:"Propulsive"    },
  { id:"exposure", label:"Exposure", L:"Armored",      R:"Unguarded"     },
  { id:"edge",     label:"Edge",     L:"Gentle",       R:"Sharp"         },
];
const PRESET = { rhythm:38, tone:30, pov:55, register:45, imagery:72, pacing:80, exposure:28, edge:70 };

const ESSAY_PRELOAD = `This is not a pitch for new work. This is a demonstration that work already completed validates what the market is demanding—and that formalizing Kyle's involvement accelerates INT's ability to capture it.

Consultants provide frameworks and analysis. Conferences provide market ground truth. The highest-confidence strategic decisions require both.

External consulting gives INT analysis. HumanX gives INT evidence. Together, they give INT certainty.

INT's moat is operationalization expertise, not AI tools. Tools are commoditizing; operationalization is not.

We're building a secure multi-tenant data vault for MSP operations. We call it Data Venue. I'd love to understand how your architecture handles tenant isolation—we're currently using AWS with row-level security and I'm benchmarking against enterprise alternatives.

Problems are not the enemy. Hidden problems are the enemy.`;

const LYRICS_PRELOAD = `Let's set the record straight, chain-linked the mesh
But my wishes don't hate, but thanks again for questioning
Fenced in, or have been faked and I bested them
Long or short standing like Tuck Everlasting
And you think I'm barely grasping, unraveling, nope
Enacting all hacking, my tractor beams reacted
I get it, quick towel action, I fastened the edges
You lack luster trapped them and whacked them
Kept leveraged, I'm commander of this faction
I don't do the guessing, you blew the cardinal rule
Lacking facts in the measure

Set the record straight, don't test the frame
Chain-linked meshed up, say my name
Ask again, I'll bless the doubt with proof
Then thank you for questioning, now move
Let's set the record straight, chain-linked and meshed
Fenced in, or have been faked and I bested them
Long-standing, short-standing, I'm still the same
Thanks again for questioning, now watch the chain

Weapons loose, explode views, too many lenses
Ink and intent and it no pretending with sentences
White or black or blue, I say kaboom when it's threaded
My sonic goop, oh so pious, not regular goons
Get it, special tonic for sardonic recruits in the room
Run your hand up the flagpole and see who salutes
Now backwards, who's gabber faster?
Nostalgic banter, brought to life by my canter
Please and thank you never getting the answers
Camera's close, my Polaroid alibi

Let's set the record straight, chain-linked and meshed
Fenced in, or have been faked and I bested them
Long-standing, short-standing, I'm still the same
Thanks again for questioning, now watch the chain
na-na-na-na-na
Set the record, set the record
Thanks, thanks, meshed up

Let's set, let's set, let's set
Set the record straight`;

const LANES = [
  { id:"memoir", label:"Memoir",       ph:"A paragraph from your memoir — raw draft preferred." },
  { id:"lyrics", label:"Lyrics",       ph:"A lyric, verse, or fragment you've written.", preload: LYRICS_PRELOAD },
  { id:"essay",  label:"Essay / Blog", ph:"A passage from a post or essay.", preload: ESSAY_PRELOAD },
  { id:"other",  label:"Other",        ph:"A journal entry, a note — anything that feels real." },
];

const MOCK_RESULT = `## Voice Fingerprint
[⚠ DEMO MODE — This is a pre-rendered demonstration. Connect to the API for a live analysis.]

This is a writer who has been deploying the same fundamental move for twenty years without knowing it: compression as authority. In the essay sample, "Problems are not the enemy. Hidden problems are the enemy." arrives as a complete argument in two sentences. In the lyrics, "my Polaroid alibi" closes a verse. Both are the same operation — a thought that was already finished before it was written down, then trusted to land without explanation.

The two lanes sit at opposite ends of the register dial but share the same tempo. The essays achieve momentum through declarative compression. The lyrics achieve it through sonic density. Strip the beat from the lyrics and you have the same sentence structure as the essays: short, complete, moving. The writer is identical. The instrument is different.

## What Your Voice Already Does
- **Door-shutting closers.** "Now watch the chain." "Hidden problems are the enemy." Both are verdicts, not conclusions. The argument was over before the sentence started.
- **Mechanical imagery for interior states.** "Tractor beams reacted," "commander of this faction," "Polaroid alibi." And on the essay side: "operationalize," "architecture," "moat." Engineering vocabulary doing emotional work. This is not avoidance — it is your native register.
- **Diagnostic framing over fan framing.** You describe situations the way a systems engineer describes failures. State, cause, correct state. No moral weight added. The same register handles a hip-hop verse and a conference playbook.

## Where to Push
- Both lanes are armored in the same way. The lyrics look personal — they aren't. They're a prosecution brief in a different key. Memoir requires the armoring to be *visible as armoring*, not just as clarity.
- The "now move" / "now watch the chain" pattern is a strength in both lanes and a tell in memoir. In memoir, the scene needs to stay open. The challenge is writing the moment that doesn't resolve.
- The compressed sentence is your greatest tool and your greatest risk. In memoir, there are longer beats. The challenge is sustaining a thought across a paragraph without reaching for the short declarative to end it.

## Hidden Gems
- **You have been the same writer for twenty years.** The lyric voice and the essay voice share compression rate, sentence opening pattern, mechanical imagery, and door-shutting closes. The tempo is different. The architecture is identical. You did not develop a voice. You were born with one.
- **Your imagery is doing double duty.** "Chain-linked mesh," "tractor beams," "Polaroid alibi" — technical objects used as emotional evidence. The Polaroid is not a metaphor. It is an alibi. You trust the image to carry the argument without naming the argument. That is the book.
- **The thing you call "writing clearly" is actually removal of the setup sentence.** Most writers keep the sentence that explains what they're about to say. You cut it. "Problems are not the enemy" does not begin with "The thing I've learned is..." You enter after the argument is already won.
- **Exposure (28) and Pacing (80) are your most productive tension.** A highly propulsive voice that is also highly armored generates writing that moves fast toward a conclusion it refuses to fully reveal. That structure is everywhere in both lanes. It is the exact structure the memoir needs to break open.

## Surprise Findings
You probably think the lyric voice is the personal one and the essay voice is the professional one. But actually both are equally armored — the lyrics are a prosecution brief in a different key signature, not a confession.

You probably think the compression is a choice you make. But actually it is the default. The uncompressed version does not exist in your catalog yet. The memoir is the first project that will require it.

## Three Targeted Exercises
**The Undefended Sentence** — Setup: Write a paragraph where the first sentence makes you uncomfortable. Do not write the next sentence that explains or defends it. Let it exist without resolution. Develops: the gap between the armored voice and the exposure required by your construction thesis.

**The Slow Declarative** — Setup: Take "my Polaroid alibi" and rewrite it at half speed — same image, twice the syllables, no compression. The constraint forces you to name what the compression was hiding. Develops: the full range between the compressed mode and the sustained scene the memoir requires.

**Same Day, Both Registers** — Setup: Write the same moment in essay voice (diagnostic, declarative), then in lyric voice (sonic, compressed), then in a third voice that is neither — just the physical facts, no argument, no beat. Develops: the register the memoir actually needs, which is not essay and not lyric but the third thing that lives between them.

## Your Voice in One Line
A diagnostician who learned to read rooms before he learned to read systems, who compresses every argument to its verdict before writing the first word, and who has been doing it — in hip-hop and in boardrooms — since before he had a name for it.`;

/* ─── Utilities ──────────────────────────────────────────────────────────────────────── */
const delay = ms => new Promise(r => setTimeout(r, ms));

const callWithRetry = async (fn, maxRetries = 3) => {
  let lastErr;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try { return await fn(); }
    catch (e) {
      lastErr = e;
      if (attempt < maxRetries - 1) await delay(Math.pow(2, attempt) * 900); // 900ms, 1800ms, 3600ms
    }
  }
  throw lastErr;
};

const detectTensions = vals =>
  [["exposure","tone"],["pov","edge"],["register","imagery"],["rhythm","pacing"]]
    .filter(([a,b]) => { const va=vals[a],vb=vals[b]; return (va<40&&vb>60)||(va>60&&vb<40); })
    .map(([a,b]) => {
      const da=DIMS.find(d=>d.id===a), db=DIMS.find(d=>d.id===b);
      return `${da.label} (${vals[a]<50?da.L:da.R}) vs ${db.label} (${vals[b]<50?db.L:db.R})`;
    });

const buildPrompt = (vals, samps, filledLanes) => {
  const dimSummary = DIMS.map(d => {
    const v = vals[d.id];
    const pos = v<25?`strongly ${d.L}`:v<45?`leaning ${d.L}`:v<55?"balanced":v<75?`leaning ${d.R}`:`strongly ${d.R}`;
    return `${d.label}: ${pos} (${v}/100)`;
  }).join("\n");
  const tensions = detectTensions(vals);
  const sampleBlock = filledLanes.length
    ? filledLanes.map(l=>`[${l.label.toUpperCase()}]\n"${samps[l.id]}"`).join("\n\n")
    : "(No samples — work from dimension profile only.)";
  return `You are a literary voice analyst — rigorous, pattern-obsessed, allergic to flattery. Surface what is actually distinctive and surprising about this writer's voice.

CONTEXT: The essay/blog sample is drawn from professional strategic documents. This is the writer's most developed and public-facing voice. Other lanes may be empty — if so, note what you'd expect those voices to need based on the essay patterns.

A writer is at the "I don't know what my voice is yet" stage, writing across memoir, lyrics, essays, and personal writing. Find what they cannot see from inside it.

DIMENSION SELF-ASSESSMENT:
${dimSummary}
${tensions.length?`\nDETECTED TENSIONS:\n${tensions.map(t=>`- ${t}`).join("\n")}\n`:""}
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
- Cross-lane patterns
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

const getNextStep = samps => {
  const has = id => samps[id]?.trim().length > 0;
  if (!has("memoir") && !has("lyrics"))
    return "Two inactive lanes. Add memoir and lyrics to see where your professional register ends and your personal voice begins — that gap is where the most interesting development lives.";
  if (!has("memoir"))
    return "Lyrics loaded. Adding memoir will surface how the armored lyric voice and the prose voice share structure — and where they finally diverge.";
  if (!has("lyrics"))
    return "Memoir loaded. Adding lyrics will test whether the percussive compression in your essays extends to sonic material.";
  return "All three active lanes loaded. Adjust any slider that felt off, then regenerate to test against your updated calibration.";
};

/* ─── Error Boundary ─────────────────────────────────────────────────────────────────── */
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError:false, error:null }; }
  static getDerivedStateFromError(error) { return { hasError:true, error }; }
  componentDidCatch(error, info) { console.error("[VoiceMap] Component error:", error.message, info?.componentStack?.split("\n")[1]?.trim()); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{ background:T.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:32 }}>
        <div style={{ background:T.surf, border:`1px solid ${T.errBorder}`, borderRadius:6, padding:32, maxWidth:440 }}>
          <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:T.err, marginBottom:14 }}>Render Error</div>
          <p style={{ color:T.text2, fontSize:13, lineHeight:1.75, marginBottom:16 }}>
            The Voice Map hit an unexpected error. This is a UI issue, not an API issue — your data is not lost.
          </p>
          <p style={{ color:T.text4, fontSize:10, fontFamily:"'Geist Mono',monospace", lineHeight:1.6, marginBottom:24 }}>
            {this.state.error?.message || "Unknown error"}
          </p>
          <button onClick={()=>this.setState({hasError:false,error:null})}
            style={{ background:T.primary, color:"#000", border:"none", borderRadius:4, padding:"10px 20px", cursor:"pointer", fontFamily:"'Geist Mono',monospace", fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", fontWeight:500 }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }
}

/* ─── StatusBadge ────────────────────────────────────────────────────────────────────── */
function StatusBadge({ mode }) {
  const [tip, setTip] = useState(false);
  const cfg = {
    live: { label:"LIVE", color:T.accent,   tip:"Connected to Anthropic API. Analysis is generated live for your specific configuration." },
    mock: { label:"MOCK", color:T.warn,      tip:"API unreachable after 3 retries. Showing demonstration output. Click Retry in the banner to try again." },
    demo: { label:"DEMO", color:T.primary,   tip:"Demo mode. No API calls are made. Output is pre-rendered." },
  };
  const c = cfg[mode] || cfg.live;
  return (
    <div style={{ position:"relative", display:"inline-flex", alignItems:"center", gap:6, cursor:"default" }}
      onMouseEnter={()=>setTip(true)} onMouseLeave={()=>setTip(false)}
      role="status" aria-label={`Connection status: ${c.label}. ${c.tip}`}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:c.color, boxShadow:`0 0 6px ${c.color}` }} aria-hidden="true"/>
      <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:c.color }}>{c.label}</span>
      {tip && (
        <div role="tooltip" style={{ position:"absolute", top:"calc(100% + 10px)", right:0, zIndex:20, background:T.surf, border:`1px solid ${T.border}`, borderRadius:4, padding:"10px 14px", width:240, fontSize:10, color:T.text3, lineHeight:1.75, boxShadow:"0 6px 24px rgba(0,0,0,0.5)", whiteSpace:"normal" }}>
          {c.tip}
        </div>
      )}
    </div>
  );
}

/* ─── Radar ──────────────────────────────────────────────────────────────────────────── */
function Radar({ vals }) {
  const [hover, setHover] = useState(null);
  const n=DIMS.length, cx=130, cy=130, r=88;
  const pt = (i,p) => { const a=(2*Math.PI*i/n)-Math.PI/2; return { x:cx+p*r*Math.cos(a), y:cy+p*r*Math.sin(a) }; };
  const shape = DIMS.map((d,i) => pt(i,(vals[d.id]??50)/100));
  const path = shape.map((p,i)=>`${i===0?"M":"L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")+"Z";
  return (
    <svg width="260" height="260" viewBox="0 0 260 260" role="img" aria-label="Voice dimension radar chart showing 8 dimensions calibrated by sliders">
      <defs>
        <linearGradient id="rFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.22"/>
          <stop offset="55%" stopColor="#EC4899" stopOpacity="0.16"/>
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.18"/>
        </linearGradient>
        <linearGradient id="rStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7"/>
          <stop offset="55%" stopColor="#EC4899"/>
          <stop offset="100%" stopColor="#22D3EE"/>
        </linearGradient>
      </defs>
      {[.25,.5,.75,1].map((p,gi)=>{
        const d=DIMS.map((_,i)=>pt(i,p)).map((q,i)=>`${i===0?"M":"L"}${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(" ")+"Z";
        return <path key={gi} d={d} fill="none" stroke={T.border} strokeWidth="1"/>;
      })}
      {DIMS.map((_,i)=>{ const e=pt(i,1); return <line key={i} x1={cx} y1={cy} x2={e.x.toFixed(1)} y2={e.y.toFixed(1)} stroke="rgba(139,92,246,0.07)" strokeWidth="1"/>; })}
      <path d={path} fill="url(#rFill)" stroke="url(#rStroke)" strokeWidth="2" strokeLinejoin="round"/>
      {shape.map((p,i)=>{
        const d=DIMS[i]; const v=vals[d.id]??50;
        return (
          <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={hover===i?6:4}
            fill={hover===i?T.secondary:T.primary}
            style={{ cursor:"default", transition:"r .1s" }}
            onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)}
            role="img" aria-label={`${d.label}: ${v}`}/>
        );
      })}
      {DIMS.map((d,i)=>{
        const lp=pt(i,1.42), v=vals[d.id]??50;
        const isHover=hover===i;
        return (
          <text key={i} x={lp.x.toFixed(1)} y={lp.y.toFixed(1)} textAnchor="middle" dominantBaseline="middle"
            fontSize={isHover?"9.5":"8.5"} fill={isHover?T.primary:T.text3}
            fontFamily="'Geist Mono',monospace"
            style={{ textTransform:"uppercase", letterSpacing:"0.06em", transition:"font-size .1s, fill .1s", cursor:"default" }}>
            {isHover?`${d.label} ${v}`:d.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ─── Markdown renderer ──────────────────────────────────────────────────────────────── */
function Md({ text }) {
  if (!text) return null;
  const lines=text.split("\n"); const out=[]; let bullets=[]; let k=0;
  const flush=()=>{
    if (bullets.length){ out.push(<ul key={k++} style={{paddingLeft:20,marginBottom:18,color:T.text2}}>{[...bullets]}</ul>); bullets=[]; }
  };
  const inl=s=>{
    const parts=s.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p,i)=>p.startsWith("**")&&p.endsWith("**")?<strong key={i} style={{color:T.text1,fontWeight:600}}>{p.slice(2,-2)}</strong>:p);
  };
  for (const raw of lines){
    if (/^#{1,3}\s/.test(raw)){
      flush();
      const h=raw.replace(/^#+\s/,"");
      const isGem=/gem|surprise|hidden/i.test(h);
      out.push(<div key={k++} style={{fontFamily:"'Geist Mono',monospace",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",background:isGem?`linear-gradient(90deg,${T.accent},${T.secondary})`:`linear-gradient(90deg,${T.primary},${T.secondary})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",marginTop:32,marginBottom:14}}>{h}</div>);
    } else if (/^[-*]\s/.test(raw)){
      bullets.push(<li key={k++} style={{marginBottom:9,lineHeight:1.85,color:T.text2}}>{inl(raw.replace(/^[-*]\s/,""))}</li>);
    } else if (!raw.trim()){
      flush(); out.push(<div key={k++} style={{height:4}}/>);
    } else {
      flush(); out.push(<p key={k++} style={{marginBottom:14,lineHeight:1.9,color:T.text2}}>{inl(raw)}</p>);
    }
  }
  flush();
  return <>{out}</>;
}

/* ─── Slider ─────────────────────────────────────────────────────────────────────────── */
function Slider({ dim, value, onChange }) {
  const id=`slider-${dim.id}`;
  return (
    <div style={{marginBottom:26}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
        <label htmlFor={id} style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.1rem",fontWeight:400,color:T.text1,cursor:"pointer"}}>{dim.label}</label>
        <span aria-live="polite" aria-label={`${dim.label} value: ${value}`} style={{fontFamily:"'Geist Mono',monospace",fontSize:10,color:T.primary,background:`${T.primary}18`,padding:"2px 8px",borderRadius:2}}>{value}</span>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.text4,marginBottom:8}} aria-hidden="true">
        <span>{dim.L}</span><span>{dim.R}</span>
      </div>
      <input id={id} type="range" min={0} max={100} step={1} value={value}
        onChange={e=>onChange(+e.target.value)}
        aria-label={`${dim.label}: ${value} out of 100. ${dim.L} at 0, ${dim.R} at 100.`}
        style={{width:"100%",cursor:"pointer",appearance:"none",WebkitAppearance:"none",height:2,borderRadius:2,outline:"none",background:`linear-gradient(to right,${T.primary} ${value}%,rgba(139,92,246,0.15) ${value}%)`}}/>
    </div>
  );
}

/* ─── TensionPreview ─────────────────────────────────────────────────────────────────── */
function TensionPreview({ vals }) {
  const tensions=detectTensions(vals);
  if (!tensions.length) return null;
  return (
    <div style={{marginBottom:28,padding:"14px 16px",background:`${T.primary}0A`,border:`1px solid ${T.border}`,borderLeft:`2px solid ${T.primary}`,borderRadius:4}}>
      <div style={{fontFamily:"'Geist Mono',monospace",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:T.primary,marginBottom:10}}>
        {tensions.length} productive tension{tensions.length>1?"s":""} detected
      </div>
      {tensions.map((t,i)=><div key={i} style={{fontSize:11,color:T.text3,lineHeight:1.75}}>· {t}</div>)}
      <div style={{fontSize:10,color:T.text4,marginTop:8,lineHeight:1.6}}>Tensions create richer analysis — they reveal where your voice does two things at once.</div>
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────────────────────────────── */
function Skeleton() {
  const bar=(w,mt=0)=>(
    <div style={{height:11,borderRadius:2,background:`linear-gradient(90deg,${T.surf} 25%,rgba(139,92,246,0.08) 50%,${T.surf} 75%)`,backgroundSize:"400% 100%",animation:"shimmer 1.4s infinite",width:w,marginTop:mt}}/>
  );
  return (
    <div style={{padding:"4px 0"}}>
      <div style={{fontFamily:"'Geist Mono',monospace",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:T.text4,marginBottom:28}}>Analyzing voice patterns…</div>
      {[["60%",0],["82%",13],["48%",9],["73%",29],["56%",13],["76%",9],["52%",29],["67%",13],["41%",9],["70%",28],["58%",13],["45%",9]].map(([w,mt],i)=><div key={i}>{bar(w,mt)}</div>)}
    </div>
  );
}

/* ─── Primitives ─────────────────────────────────────────────────────────────────────── */
const Panel=({children,style={}})=>(
  <div style={{background:"rgba(19,19,31,0.7)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:`1px solid ${T.border}`,borderRadius:6,padding:24,...style}}>{children}</div>
);
const Label=({children,muted=false})=>(
  <div style={{fontFamily:"'Geist Mono',monospace",fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",color:muted?T.text4:T.primary,marginBottom:8}}>{children}</div>
);
const Notice=({children})=>(
  <div style={{background:`${T.primary}0D`,border:`1px solid ${T.border}`,borderLeft:`2px solid ${T.primary}`,borderRadius:4,padding:"12px 16px",marginBottom:28,fontSize:11,color:T.text3,lineHeight:1.8}}>{children}</div>
);
const TabBtn=({active,disabled,onClick,children})=>(
  <button disabled={disabled} onClick={onClick}
    style={{background:"none",border:"none",borderBottom:`2px solid ${active?T.primary:"transparent"}`,padding:"10px 22px 12px",marginBottom:-1,fontFamily:"'Geist Mono',monospace",fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",cursor:disabled?"default":"pointer",color:disabled?T.text4:active?T.primary:T.text3,transition:"all 0.15s"}}
    aria-selected={active} role="tab">
    {children}
  </button>
);

/* ─── EnvBanner ──────────────────────────────────────────────────────────────────────── */
function EnvBanner({ mode, onRetry }) {
  if (mode==="live") return null;
  return (
    <div role="alert" aria-live="assertive" style={{background:T.warnBg,border:`1px solid ${T.warnBorder}`,borderRadius:4,padding:"11px 16px",marginBottom:24,display:"flex",alignItems:"center",gap:16,fontSize:11,color:T.warn,lineHeight:1.7}}>
      <span style={{flex:1}}>⚠ API unreachable after 3 attempts — showing a demonstration result. Your configuration and samples were preserved.</span>
      <button onClick={onRetry} style={{background:"none",border:`1px solid ${T.warnBorder}`,borderRadius:3,color:T.warn,padding:"5px 12px",cursor:"pointer",fontFamily:"'Geist Mono',monospace",fontSize:9,letterSpacing:"0.16em",textTransform:"uppercase",whiteSpace:"nowrap",transition:"border-color .15s"}}
        onMouseOver={e=>e.currentTarget.style.borderColor=T.warn}
        onMouseOut={e=>e.currentTarget.style.borderColor=T.warnBorder}>
        Retry
      </button>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────────────────── */
function VoiceMap() {
  const [tab,setTab]       = useState("dims");
  const [vals,setVals]     = useState({...PRESET});
  const [samps,setSamps]   = useState(Object.fromEntries(LANES.map(l=>[l.id,l.preload||""])));
  const [result,setResult] = useState(null);
  const [loading,setLoad]  = useState(false);
  const [apiMode,setMode]  = useState("live"); // "live" | "mock"
  const [error,setError]   = useState(null);
  const [copied,setCopied] = useState(false);
  const [isMobile,setMobile] = useState(false);
  const panelRef = useRef(null);

  const setV = useCallback((id,v)=>setVals(p=>({...p,[id]:v})),[]);
  const setS = useCallback((id,v)=>setSamps(p=>({...p,[id]:v})),[]);
  const filled = LANES.filter(l=>samps[l.id].trim());

  // Mount: viewport detection + env log
  useEffect(()=>{
    const check=()=>setMobile(window.innerWidth<768);
    check();
    window.addEventListener("resize",check);
    const resolvedMode = "live"; // optimistic; updates to "mock" on API failure
    console.log("[VoiceMap] env:", { mode:resolvedMode, clientMode:CONFIG.clientMode, viewport:window.innerWidth<768?"mobile":"desktop", version:CONFIG.version });
    return ()=>window.removeEventListener("resize",check);
  },[]);

  // Tab change: move focus to panel for screen readers
  useEffect(()=>{ panelRef.current?.focus(); },[tab]);

  const attemptApiCall = async () => {
    const res = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000, messages:[{role:"user",content:buildPrompt(vals,samps,filled)}] }),
    });
    if (!res.ok){
      const e=await res.json().catch(()=>({}));
      const msg=e?.error?.message||`HTTP ${res.status}`;
      throw new Error(msg);
    }
    const data=await res.json();
    const text=data?.content?.find(b=>b.type==="text")?.text;
    if (!text) throw new Error("API returned empty content");
    return text;
  };

  const generate = async () => {
    setLoad(true); setError(null); setResult(null);
    try {
      const text = await callWithRetry(attemptApiCall, 3);
      setMode("live");
      setResult(text);
      setTab("result");
    } catch (e) {
      console.error("[VoiceMap] API failed after retries:", e.message);
      setMode("mock");
      setResult(MOCK_RESULT);
      setError("API unreachable — showing a demonstration result. Your configuration was preserved. Retry when connectivity is restored.");
      setTab("result");
    } finally {
      setLoad(false);
    }
  };

  const retryGenerate = () => { setError(null); generate(); };

  const copyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(()=>setCopied(false),2000);
    } catch(e) { console.error("[VoiceMap] Clipboard write failed:", e.message); }
  };

  // Export slider state as JSON (clipboard transport — workaround for no localStorage in artifacts)
  const exportConfig = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify({version:CONFIG.version,vals,timestamp:new Date().toISOString()},null,2));
    } catch(e) { console.error("[VoiceMap] Config export failed:", e.message); }
  };

  // Restore slider state from clipboard JSON
  const restoreConfig = async () => {
    try {
      const text=await navigator.clipboard.readText();
      const state=JSON.parse(text);
      if (state?.vals && typeof state.vals==="object"){
        const merged={...PRESET};
        DIMS.forEach(d=>{ if (typeof state.vals[d.id]==="number") merged[d.id]=state.vals[d.id]; });
        setVals(merged);
      }
    } catch(e) { console.error("[VoiceMap] Config restore failed:", e.message); }
  };

  const gridCols = isMobile ? "1fr" : "1fr 280px";

  return (
    <div style={{background:T.bg,minHeight:"100vh",padding:isMobile?"28px 18px 80px":"48px 32px 96px",fontFamily:"'Geist',sans-serif",color:T.text2,maxWidth:920,margin:"0 auto"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500&family=Geist+Mono:wght@300;400;500&display=swap');
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:${T.primary};cursor:pointer;box-shadow:0 0 0 3px ${T.bg},0 0 0 5px ${T.primary}40;transition:transform .15s,box-shadow .15s;}
        input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.2);box-shadow:0 0 0 3px ${T.bg},0 0 0 7px ${T.primary}60;}
        input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:${T.primary};border:none;cursor:pointer;}
        textarea{transition:border-color .2s,box-shadow .2s;}
        textarea:focus{border-color:${T.primary}!important;outline:none;box-shadow:0 0 0 3px ${T.primary}18;}
        textarea::placeholder{color:${T.text4};}
        @keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
        ::selection{background:${T.primary}44;color:#fff}
      `}</style>

      {/* Header */}
      <div style={{marginBottom:40}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            {!CONFIG.clientMode && (
              <div style={{fontFamily:"'Geist Mono',monospace",fontSize:9,letterSpacing:"0.3em",textTransform:"uppercase",color:T.text4,marginBottom:12}}>
                {CONFIG.orgName} — {CONFIG.orgTagline}
              </div>
            )}
            <h1 style={{fontFamily:"'Instrument Serif',serif",fontSize:isMobile?"2.2rem":"clamp(2.4rem,5vw,3.6rem)",fontWeight:400,lineHeight:1.0,letterSpacing:"-0.02em",color:T.text1,margin:0}}>
              {CONFIG.name}
            </h1>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8,paddingTop:4}}>
            <StatusBadge mode={apiMode}/>
            <div style={{fontFamily:"'Geist Mono',monospace",fontSize:9,color:T.text4,letterSpacing:"0.12em"}}>v{CONFIG.version}</div>
          </div>
        </div>
        <div style={{width:40,height:2,marginTop:18,background:"linear-gradient(90deg,#A855F7,#EC4899)"}}/>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,marginBottom:36}} role="tablist" aria-label="Voice Map sections">
        <TabBtn active={tab==="dims"} onClick={()=>setTab("dims")}>Dimensions</TabBtn>
        <TabBtn active={tab==="samps"} onClick={()=>setTab("samps")}>Samples {filled.length>0&&`(${filled.length})`}</TabBtn>
        <TabBtn active={tab==="result"} disabled={!result&&!loading} onClick={()=>(result||loading)&&setTab("result")}>Voice Map</TabBtn>
      </div>

      {/* Dimensions tab */}
      {tab==="dims" && (
        <div style={{display:"grid",gridTemplateColumns:gridCols,gap:isMobile?32:52,alignItems:"start"}}
          ref={panelRef} tabIndex={-1} role="tabpanel" aria-label="Dimension sliders">
          <div>
            <Notice>
              Sliders pre-calibrated from your project docs — strategic playbooks, exec briefings, product positioning.
              Hover any dot on the radar for its exact value. Adjust what feels off, then add samples.
            </Notice>
            <TensionPreview vals={vals}/>
            <Label>Calibrate your dimensions</Label>
            <div style={{marginTop:20}}>
              {DIMS.map(d=><Slider key={d.id} dim={d} value={vals[d.id]} onChange={v=>setV(d.id,v)}/>)}
            </div>
            <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
              <button onClick={()=>setVals({...PRESET})} aria-label="Reset all sliders to default values"
                style={{flex:1,padding:"11px 0",background:"none",border:`1px solid ${T.border}`,borderRadius:4,color:T.text4,cursor:"pointer",fontFamily:"'Geist Mono',monospace",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",transition:"all .2s",minWidth:120}}
                onMouseOver={e=>{e.currentTarget.style.borderColor=T.primary;e.currentTarget.style.color=T.text2;}}
                onMouseOut={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.text4;}}>
                Reset defaults
              </button>
              <button onClick={exportConfig} aria-label="Copy current slider configuration to clipboard as JSON"
                style={{flex:1,padding:"11px 0",background:"none",border:`1px solid ${T.border}`,borderRadius:4,color:T.text4,cursor:"pointer",fontFamily:"'Geist Mono',monospace",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",transition:"all .2s",minWidth:100}}
                onMouseOver={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.color=T.text2;}}
                onMouseOut={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.text4;}}>
                Copy config
              </button>
              <button onClick={restoreConfig} aria-label="Restore slider configuration from clipboard JSON"
                style={{flex:1,padding:"11px 0",background:"none",border:`1px solid ${T.border}`,borderRadius:4,color:T.text4,cursor:"pointer",fontFamily:"'Geist Mono',monospace",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",transition:"all .2s",minWidth:100}}
                onMouseOver={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.color=T.text2;}}
                onMouseOut={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.text4;}}>
                Restore
              </button>
              <button onClick={()=>setTab("samps")}
                style={{flex:"2",padding:"11px 0",background:"none",border:`1px solid ${T.border}`,borderRadius:4,color:T.text3,cursor:"pointer",fontFamily:"'Geist Mono',monospace",fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",transition:"all .2s",minWidth:140}}
                onMouseOver={e=>{e.currentTarget.style.borderColor=T.primary;e.currentTarget.style.color=T.text1;}}
                onMouseOut={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.text3;}}>
                Add Samples →
              </button>
            </div>
          </div>
          {!isMobile && (
            <div style={{position:"sticky",top:24}}>
              <Panel style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:"28px 20px"}}>
                <Label muted>Live Fingerprint</Label>
                <Radar vals={vals}/>
                <div style={{fontSize:10,color:T.text4,textAlign:"center",lineHeight:1.8}}>Hover dots for values</div>
              </Panel>
            </div>
          )}
        </div>
      )}

      {/* Samples tab */}
      {tab==="samps" && (
        <div ref={panelRef} tabIndex={-1} role="tabpanel" aria-label="Writing sample inputs">
          <Notice>
            <strong style={{color:T.text2}}>Lyrics</strong> and <strong style={{color:T.text2}}>Essay / Blog</strong> are pre-loaded.
            Add <strong style={{color:T.text2}}>Memoir</strong> to unlock the cross-lane analysis between your personal and professional voice.
          </Notice>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:24,marginBottom:28}}>
            {LANES.map(l=>{
              const has=samps[l.id].trim();
              return (
                <div key={l.id}>
                  <div style={{fontFamily:"'Geist Mono',monospace",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:has?T.primary:T.text4,marginBottom:10,display:"flex",alignItems:"center",gap:7}}>
                    {has&&<span style={{color:T.accent}} aria-hidden="true">✓</span>}
                    <span>{l.label}</span>
                    {(l.id==="essay"||l.id==="lyrics")&&<span style={{fontSize:8,color:T.text4}}>— pre-loaded</span>}
                  </div>
                  <textarea value={samps[l.id]} onChange={e=>setS(l.id,e.target.value)} placeholder={l.ph}
                    aria-label={`${l.label} writing sample`}
                    style={{width:"100%",minHeight:l.id==="essay"||l.id==="lyrics"?140:100,background:T.surf,border:`1px solid ${has?`${T.primary}40`:T.border}`,borderRadius:4,color:T.text1,padding:"14px 16px",fontFamily:"'Instrument Serif',serif",fontSize:"1rem",lineHeight:1.8,resize:"vertical",display:"block"}}/>
                </div>
              );
            })}
          </div>
          {error && !loading && (
            <div role="alert" style={{background:T.errBg,border:`1px solid ${T.errBorder}`,borderRadius:4,padding:"12px 16px",marginBottom:20,fontSize:11,color:T.err,lineHeight:1.75}}>
              ⚠ {error} <button onClick={retryGenerate} style={{background:"none",border:"none",color:T.err,cursor:"pointer",textDecoration:"underline",fontSize:11,padding:0,marginLeft:8,fontFamily:"inherit"}}>Retry now</button>
            </div>
          )}
          <button onClick={generate} disabled={loading}
            onKeyDown={e=>e.key==="Enter"&&!loading&&generate()}
            aria-label={loading?"Generating voice analysis, please wait":`Generate voice map using ${filled.length} sample lane${filled.length!==1?"s":""}`}
            style={{width:"100%",padding:"15px 0",background:loading?T.surf:T.grad,color:loading?T.text3:"#000",border:loading?`1px solid ${T.border}`:"none",borderRadius:4,cursor:loading?"not-allowed":"pointer",fontFamily:"'Geist Mono',monospace",fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",fontWeight:500,transition:"opacity .2s",opacity:loading?.7:1}}>
            {loading
              ? "Analyzing — finding what you can't see from inside it…"
              : `Generate Voice Map (${filled.length} lane${filled.length!==1?"s":""}) →`}
          </button>
        </div>
      )}

      {/* Result tab */}
      {tab==="result" && (
        <div ref={panelRef} tabIndex={-1} role="tabpanel" aria-label="Voice map analysis result">
          <EnvBanner mode={apiMode} onRetry={retryGenerate}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:36,gap:12,flexWrap:"wrap"}}>
            <Label>Voice Map</Label>
            <div style={{display:"flex",gap:10}}>
              {result && (
                <button onClick={copyResult} aria-label={copied?"Result copied to clipboard":"Copy voice map result to clipboard"}
                  style={{background:"none",border:`1px solid ${copied?T.accent:T.border}`,color:copied?T.accent:T.text4,padding:"7px 14px",fontFamily:"'Geist Mono',monospace",fontSize:9,letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",borderRadius:4,transition:"all .2s"}}>
                  {copied?"Copied ✓":"Copy result"}
                </button>
              )}
              <button onClick={()=>{setTab("dims");setResult(null);setError(null);setMode("live");}}
                style={{background:"none",border:`1px solid ${T.border}`,color:T.text4,padding:"7px 14px",fontFamily:"'Geist Mono',monospace",fontSize:9,letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",borderRadius:4,transition:"all .2s"}}
                onMouseOver={e=>{e.currentTarget.style.borderColor=T.primary;e.currentTarget.style.color=T.text2;}}
                onMouseOut={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.text4;}}>
                Recalibrate
              </button>
            </div>
          </div>
          {loading && <Skeleton/>}
          {result && !loading && (
            <>
              <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.05rem",lineHeight:1.9}}>
                <Md text={result}/>
              </div>
              <Panel style={{marginTop:52}}>
                <Label muted>Next step</Label>
                <p style={{fontSize:13,color:T.text3,lineHeight:1.85,margin:"10px 0 0"}}>{getNextStep(samps)}</p>
              </Panel>
            </>
          )}
          {!result && !loading && (
            <div style={{padding:"60px 0",textAlign:"center",color:T.text4,fontSize:13,lineHeight:1.7}}>
              No analysis yet.<br/>
              <button onClick={()=>setTab("samps")} style={{background:"none",border:"none",color:T.primary,cursor:"pointer",fontSize:13,textDecoration:"underline",marginTop:8,fontFamily:"inherit"}}>
                Go to Samples to generate →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Public export — wraps in error boundary ────────────────────────────────────────── */
export default function VoiceMapApp() {
  return (
    <ErrorBoundary>
      <VoiceMap/>
    </ErrorBoundary>
  );
}
