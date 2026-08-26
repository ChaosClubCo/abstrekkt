import { useState, useRef, useEffect, useCallback } from "react";

// ── STORAGE LAYER ────────────────────────────────────────────────────────────
const S = {
  async get(key)        { try { const r = await window.storage.get(key);    return r ? JSON.parse(r.value) : null; } catch { return null; } },
  async set(key, val)   { try { await window.storage.set(key, JSON.stringify(val)); return true; }                  catch { return false; } },
  async del(key)        { try { await window.storage.delete(key); return true; }                                    catch { return false; } },
  async list(pfx)       { try { const r = await window.storage.list(pfx); return r?.keys || []; }                  catch { return [];    } },
  async ping()          { try { await window.storage.set('memoir-ping', '"ok"'); await window.storage.delete('memoir-ping'); return true; } catch { return false; } }
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── API LAYER (self-healing: auto-retry 3x with backoff) ────────────────────
const SYSTEM_PROMPT = `You are a ghost-writing collaborator and biographer working on Kyle's literary memoir.

WORKING THESIS: "How does a person whose mind has been broken—by choice, by injury, by circumstance—rebuild agency not through recovery of what was lost, but through construction of what never existed?"

GENRE: Literary nonfiction. Not self-help. Not recovery memoir. Not productivity manifesto.

KYLE: Approaching 40. Staff Engineer (AppSec/Platform). Self-taught—no CS degree. Father to Kinsley (Friday custody). Non-linear path: O'Toole's bartending → quality control → self-taught engineering → Staff-level leadership. Currently building Chaos Club Co.

THE BREAKS: TBI. Addiction. Memory challenges. Cognitive disruption that made old strategies obsolete.
THE CONSTRUCTION: 240+ tools as externalized cognition. Systems as prosthetic memory. Documentation as survival.
NARRATIVE SPINE: DIAGNOSING — reading rooms (O'Toole's) → processes (QC) → systems (engineering). Engineering was recognition, not reinvention.

MATERIAL CAPTURED (O'Toole's, Mar 25 2026):
- Memory held without systems: drink orders, regulars, rotations. Pure present-moment attention.
- Fran & Stewart: asked O'Toole's for Kyle to bartend their son's wedding — blocked by manager (Kinsley weekend custody)
- Kylie & Tony: Star Wars/Disney/tech bond, Disney World property invite
- Performance face: calm 98% / frantic 2%. Body: jaw, arms, internal screaming masked externally
- Two modes: chaos nights (jaw-clenching) vs. ebb-and-flow nights
- DUAL-TRACK STATE: task locked + background obsession (Star Wars, tech, games) running together. Not anxiety — useful load. Bad nights = wander interrupted the track.
- Q3 blank (wander content) — SENSITIVE, do not push
- UNANSWERED: After the break — what was in that background track? Did it change character?

KYLE'S VOICE: Direct without cold. Metaphor-heavy. Technical precision. Strategic profanity. ZERO "And that's when I realized..." ZERO "Looking back I can see..." Declarative. Technical descriptions of emotional states. Admissions of uncertainty.

EXCAVATION RULES: One question at a time unless stated. Do NOT summarize back — record and ask next. Flag when too resolved. Never push on: TBI, addiction, family beyond Kinsley, Q3 blank.

SESSION PROTOCOL: End each response with next question, next step, or clear stopping point.`;

const SUMMARY_PROMPT = `End of session. Produce a session summary in exactly this format — no other text:

SESSION SUMMARY — ${new Date().toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'})}
WHAT WAS RETRIEVED:
[bullet list of new material captured this session]

VOICE-READY FRAGMENTS:
[any lines that survived the voice test — copy exactly as said]

WHAT'S UNRESOLVED:
[open questions or threads needing more excavation]

NEXT SESSION FOCUS:
[one specific thing to pick up on]

PROTECTED/FLAGS:
[anything that came up needing careful handling]`;

async function callClaude(messages, onStatus) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (attempt > 0) { onStatus?.(`Retrying (${attempt}/2)…`); await sleep(1200 * attempt); }
      else onStatus?.("Sending…");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system: SYSTEM_PROMPT, messages })
      });
      if (!res.ok) { if (attempt < 2) continue; throw new Error(`API ${res.status}`); }
      const d = await res.json();
      onStatus?.(null);
      return d.content?.find(b => b.type === "text")?.text || "(no response)";
    } catch(e) {
      if (attempt === 2) { onStatus?.(`Failed: ${e.message}`); throw e; }
    }
  }
}

// ── SUMMARY PARSER ───────────────────────────────────────────────────────────
function parseSummary(text) {
  const grab = (label, next) => {
    const m = text.match(new RegExp(`${label}[:\\s]*([\\s\\S]*?)(?=${next}|$)`, 'i'));
    return m?.[1]?.trim().replace(/^\s*[-•]\s*/gm, '• ') || null;
  };
  return {
    id: Date.now(),
    date: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
    retrieved:  grab('WHAT WAS RETRIEVED',   'VOICE-READY'),
    fragments:  grab('VOICE-READY FRAGMENTS',"WHAT'S UNRESOLVED"),
    unresolved: grab("WHAT'S UNRESOLVED",    'NEXT SESSION'),
    next:       grab('NEXT SESSION FOCUS',   'PROTECTED'),
    flags:      grab('PROTECTED/FLAGS',      'ZZEND')
  };
}

// ── PHASE & ACTION CONFIG ────────────────────────────────────────────────────
const PM = {
  BEFORE:       { label:"BEFORE THE BREAK",    color:"#4d7fc4", border:"rgba(77,127,196,0.3)",  bg:"rgba(77,127,196,0.07)"  },
  RUPTURE:      { label:"THE RUPTURE",          color:"#c45050", border:"rgba(196,80,80,0.3)",   bg:"rgba(196,80,80,0.07)"   },
  CONSTRUCTION: { label:"THE CONSTRUCTION",     color:"#4ca876", border:"rgba(76,168,118,0.3)",  bg:"rgba(76,168,118,0.07)"  },
  GAPS:         { label:"CRITICAL GAPS",        color:"#c48a40", border:"rgba(196,138,64,0.3)",  bg:"rgba(196,138,64,0.07)"  },
  STRUCTURE:    { label:"STRUCTURAL DECISIONS", color:"#8a55c4", border:"rgba(138,85,196,0.3)",  bg:"rgba(138,85,196,0.07)"  },
  META:         { label:"META / CONTRAST",      color:"#7a8aaa", border:"rgba(122,138,170,0.3)", bg:"rgba(122,138,170,0.07)" }
};

const PHASES = ["BEFORE","RUPTURE","CONSTRUCTION","GAPS","STRUCTURE","META"];

const ACTIONS = [
  { id:"1c", phase:"BEFORE",  status:"continue",  title:"The Background Track — Before & After",  sub:"Good nights: task + obsession together. Edge: after the break, what changed?",
    prompt:`Memoir excavation. CONTINUATION. Good nights at O'Toole's: task locked + background obsession (Star Wars, tech, games) running together. Not anxiety — useful load. Bad nights = wander interrupted both tracks. Edge question: after the break, was that background track still there? Did it change character — go quiet, become noise, turn into something to escape instead of something running alongside? One question. If we're crossing into protected territory, say so.` },
  { id:"1",  phase:"BEFORE",  status:"material",  title:"O'Toole's Sensory Excavation",            sub:"Material captured Mar 25. Two modes, regulars, dual-track, performance face.",
    prompt:`Memoir excavation. Continuing O'Toole's — material already captured: Fran & Stewart, Kylie & Tony, two-mode operation, performance face, body signature, dual-track state. Don't re-ask what we have. Push into: the physical bar environment — what did it look like, smell like, sound like on a busy night? How did you know which kind of night it was going to be? Three questions at a time.` },
  { id:"2",  phase:"BEFORE",  status:"new",       title:"Diagnostic Instinct Origins",              sub:"Reading rooms → reading processes → reading systems. When did this start?",
    prompt:`Memoir excavation. The diagnostic instinct — where it started. Narrative spine: DIAGNOSING. O'Toole's (customers) → QC (processes) → engineering (systems). What was the first time I remember knowing something was wrong before anyone else in the room did? Was this at O'Toole's? Earlier? What did that knowing feel like — intellectual or physical? Three questions at a time. Specific scenes, not summaries.` },
  { id:"3",  phase:"BEFORE",  status:"new",       title:"What Memory Felt Like When It Worked",     sub:"Critical contrast material. Need the texture of a functioning mind.",
    prompt:`Memoir excavation. What memory felt like when reliable. Context: dual-track state is part of the answer. Now go further: holding multi-person complexity without systems. Managing a full shift in memory. Did I ever think about memory, or was it just air — invisible because it worked? Three questions at a time. Surface specifics, not conclusions.` },
  { id:"4",  phase:"RUPTURE", status:"sensitive", title:"The Rupture — First Pass",                 sub:"Fragments, impressions, contradictions welcome. No narrative shape required.",
    prompt:`Memoir excavation. THE RUPTURE. Handle carefully. Not writing a chapter. Goal: rough notes only. Single question to start: What's the first specific moment you can point to where you noticed old strategies had stopped working? Not the cause — just the moment of noticing. One question at a time. Hold space for uncertainty. If I stop you, we stop.` },
  { id:"5",  phase:"RUPTURE", status:"sensitive", title:"Ground the Relief Line",                   sub:'"No one tells you that relief is the most addictive feeling of all." Needs real memory.',
    prompt:`Memoir excavation. Ground: "No one tells you that relief is the most addictive feeling of all." This line survived the voice test. Now it needs real memory. One at a time: 1. Was "relief" the right word? Or silence? Escape? Disappearance? Something with no name? 2. What was the noise that stopped? 3. What had I tried before that didn't produce it? Push on every abstraction. Make me name what it actually was.` },
  { id:"6",  phase:"RUPTURE", status:"sensitive", title:"19 or 21 — The Age Oscillation",           sub:"Three corrections in three messages. The uncertainty IS the material.",
    prompt:`Memoir excavation. The age question — 19 or 21? I corrected the start date three times (19 → 21 → 19). A reliable narrator says "I was 19." Mine says "I was 19 — or 21 — I've told this both ways and I'm not sure which is the lie." One at a time: 1. Right now, no looking anything up — what number comes first? 2. What specific memory is attached to it? 3. Could something have started at 19 and escalated at 21?` },
  { id:"7",  phase:"CONSTRUCTION", status:"new", title:"First Tool Archaeology",                    sub:"240+ tools as prosthetic cognition. Find the first nail.",
    prompt:`Memoir excavation. THE CONSTRUCTION. The first system. One at a time: 1. What was the first thing — notebook, habit, app, ritual, folder structure — you remember thinking "this helps, this is different"? 2. What specific problem was it solving? 3. Was it embarrassing to need it? Did you hide it? Push past "I started using calendar apps" to the specific moment you realized the system was doing something your brain used to do.` },
  { id:"8",  phase:"CONSTRUCTION", status:"new", title:"Chronological Tool Map",                    sub:"Build the archaeological record: what appeared when, what crisis it answered.",
    prompt:`Memoir excavation. Chronological archaeology. Build a running list as I answer: [PERIOD] — [TOOL/SYSTEM] — [PROBLEM SOLVED] — [EMOTION AROUND NEEDING IT]. Start: What period came immediately after things broke? What was the very first thing I remember adding to my life that functioned as a system? Each entry needs emotional valence — shameful, practical, desperate, accidental?` },
  { id:"9",  phase:"GAPS",    status:"new",       title:"The Life Coach Figure",                    sub:"Significant character. Almost no documented material. May be load-bearing.",
    prompt:`Memoir excavation. Critical gap: the life coach figure. Significant but almost entirely undocumented. Connects to the "permission" mechanism — permission unlocks what pressure never could. One at a time: 1. Who was this person? How did you find each other? 2. What did they actually say or do that mattered — specific words? 3. Why does this figure belong to the reconstruction story rather than just the recovery one? If memory is thin, document the thinness.` },
  { id:"10", phase:"GAPS",    status:"new",       title:"Late-Night Walk — Real or Constructed?",   sub:"Age 17, streetlights, hands in pockets. Real memory or AI extrapolation absorbed as true?",
    prompt:`Memoir excavation. Verification: the late-night walk scene. Earlier material: "Seventeen. Walking alone at night, hands in pockets, counting streetlights. I remember thinking: If I don't find a way to quiet my head, it's going to tear me apart." This may be a real memory or AI-generated from emotional logic that I absorbed as true. Both usable — book needs to know which. Single question: does this walk feel like a real memory? Physical recognition? Or emotional truth wearing a scene that never happened?` },
  { id:"11", phase:"GAPS",    status:"new",       title:"Meditation — What Actually Shifted",       sub:'"I am open to this helping" vs. "I want this to work." When and what felt different?',
    prompt:`Memoir excavation. The meditation pivot. Documented shift: "I want this to work" → "I am open to this helping." Mirrors construction vs. recovery thesis. One at a time: 1. When did meditation enter the picture? What was it supposed to fix — and was that expectation part of the problem? 2. What was the specific moment the approach shifted? 3. What does "I am open to this helping" feel different from "I want this to work" — in the body, not in concept?` },
  { id:"12", phase:"STRUCTURE", status:"new",     title:"Draft Three Chapter Openings",             sub:"Three 300-word tests in voice. Commit based on what actually works.",
    prompt:`Memoir drafting. Three structural tests — 300 words max each. A: Prologue — The Age Oscillation. Opens with me trying to tell an AI my life story and not knowing when it started. B: In medias res — O'Toole's Saturday night. Opens in the diagnostic body. Include the dual-track state. C: The Construction — opens in the present, 240 tools running, works backward. Voice: direct, metaphor-heavy, technical, strategic profanity, zero "And that's when I realized." Write A first. Stop. Ask which I want next.` },
  { id:"13", phase:"STRUCTURE", status:"new",     title:"Structural Commit — Pick One",             sub:"Honest recommendation. Which architecture is actually executable?",
    prompt:`Memoir structure decision. Four options: 1. Chronological with memory intrusions. 2. Systems as chapters — each tool as entry point. 3. Parallel timelines — external career + internal reconstruction converging. 4. The Arsenal structure — Chaos Club's 25 categories. Honest case for each. Then your actual recommendation — not diplomatic options. Which fits the material, serves construction vs. recovery, and is executable given real constraints: writing in margins, genuine memory gaps, full-time job + Friday custody? Tell me why the other three don't work as well.` },
  { id:"14", phase:"META",    status:"new",       title:"The Failed First Draft",                   sub:'"FlashFusion: A Mind Unchained." That failure is evidence. Chapter, fragments, or prologue?',
    prompt:`Memoir decision. The failed first draft. I previously tried this with a different AI. It generated "FlashFusion: A Mind Unchained" — emoji chapter titles, cinematic openings, clean structure. I kept correcting the premise, not the prose. Three options: A. Meta-chapter "The Wrong Book" — 3-5 pages showing the gap. B. Scattered fragments — 19/21 oscillation and "Mind Unchained" framing embedded as evidence throughout. C. Prologue reframe — open the book at the moment of failing to locate where the story started. Arguments for each, then your recommendation. Evidence or distraction?` },
];

// ── COMPONENT ────────────────────────────────────────────────────────────────
export default function MemoirHub() {
  const [view,        setView]       = useState("sessions");
  const [session,     setSession]    = useState(null);   // { action, messages }
  const [apiStatus,   setApiStatus]  = useState(null);   // string | null
  const [storageOk,   setStorageOk]  = useState(null);   // true | false | null (unknown)
  const [savedMeta,   setSavedMeta]  = useState({});     // { [id]: { count, lastSaved } }
  const [material,    setMaterial]   = useState([]);     // parsed summary entries
  const [pasteMode,   setPasteMode]  = useState(false);
  const [pasteText,   setPasteText]  = useState("");
  const [input,       setInput]      = useState("");
  const [genSummary,  setGenSummary] = useState(false);
  const bottomRef = useRef(null);

  // ── INIT ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const ok = await S.ping();
      setStorageOk(ok);
      if (!ok) return;
      const meta  = await S.get("memoir-sess-meta")  || {};
      const bank  = await S.get("memoir-material-bank") || [];
      setSavedMeta(meta);
      setMaterial(bank);
    })();
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [session?.messages, apiStatus]);

  // ── SAVE SESSION ──────────────────────────────────────────────────────────
  const persist = useCallback(async (action, messages) => {
    if (!storageOk) return;
    await S.set(`memoir-sess-${action.id}`, messages);
    const meta = await S.get("memoir-sess-meta") || {};
    meta[action.id] = { count: messages.length, lastSaved: new Date().toISOString() };
    await S.set("memoir-sess-meta", meta);
    setSavedMeta({ ...meta });
  }, [storageOk]);

  // ── START / RESUME ────────────────────────────────────────────────────────
  const startSession = async (action, resume = false) => {
    setApiStatus(null); setInput(""); setGenSummary(false);
    if (resume) {
      const saved = await S.get(`memoir-sess-${action.id}`);
      if (saved?.length) { setSession({ action, messages: saved }); return; }
    }
    const userMsg = { role:"user", content: action.prompt };
    setSession({ action, messages: [userMsg] });
    try {
      const reply = await callClaude([userMsg], setApiStatus);
      const msgs  = [userMsg, { role:"assistant", content: reply }];
      setSession({ action, messages: msgs });
      await persist(action, msgs);
    } catch(e) { setApiStatus(`Error: ${e.message}`); }
  };

  // ── SEND FOLLOW-UP ────────────────────────────────────────────────────────
  const send = async () => {
    if (!input.trim() || apiStatus?.startsWith("Send") || apiStatus?.startsWith("Ret")) return;
    const userMsg  = { role:"user", content: input.trim() };
    const newMsgs  = [...session.messages, userMsg];
    setSession(s => ({ ...s, messages: newMsgs }));
    setInput("");
    try {
      const reply   = await callClaude(newMsgs, setApiStatus);
      const final   = [...newMsgs, { role:"assistant", content: reply }];
      setSession(s => ({ ...s, messages: final }));
      await persist(session.action, final);
    } catch(e) { setApiStatus(`Error: ${e.message}`); }
  };

  // ── GENERATE SUMMARY ──────────────────────────────────────────────────────
  const generateSummary = async () => {
    setGenSummary(false);
    const msgs = [...session.messages, { role:"user", content: SUMMARY_PROMPT }];
    try {
      const reply = await callClaude(msgs, setApiStatus);
      const final = [...session.messages, { role:"user", content: "[Session Summary Requested]" }, { role:"assistant", content: reply }];
      setSession(s => ({ ...s, messages: final }));
      await persist(session.action, final);
    } catch(e) { setApiStatus(`Error: ${e.message}`); }
  };

  // ── CLEAR SESSION ─────────────────────────────────────────────────────────
  const clearSession = async (id) => {
    await S.del(`memoir-sess-${id}`);
    const meta = { ...savedMeta }; delete meta[id];
    await S.set("memoir-sess-meta", meta);
    setSavedMeta(meta);
  };

  // ── PASTE SUMMARY → MATERIAL BANK ─────────────────────────────────────────
  const commitSummary = async () => {
    if (!pasteText.trim()) return;
    const entry   = parseSummary(pasteText);
    const updated = [entry, ...material];
    setMaterial(updated);
    await S.set("memoir-material-bank", updated);
    setPasteText(""); setPasteMode(false);
  };

  // ── SHARED STYLES ─────────────────────────────────────────────────────────
  const mono = { fontFamily:"monospace" };
  const page = { minHeight:"100vh", background:"#070b12", fontFamily:"Georgia,'Times New Roman',serif", color:"#ced4e8", display:"flex", flexDirection:"column" };

  const ph   = session ? PM[session.action.phase] : null;
  const busy = s => s?.startsWith("Send") || s?.startsWith("Ret");

  // ════════════════════════════════════════════════════════════════════════════
  // SESSION VIEW
  // ════════════════════════════════════════════════════════════════════════════
  if (session) return (
    <div style={page}>
      <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}} .btn{cursor:pointer;transition:all .14s} .btn:hover{filter:brightness(1.3)} .btn:active{transform:scale(.97)}`}</style>

      {/* Session header */}
      <div style={{ padding:"12px 20px", borderBottom:"1px solid #141c30", display:"flex", alignItems:"center", gap:12, background:"#0a0f1e", flexShrink:0 }}>
        <button className="btn" onClick={() => setSession(null)} style={{ ...mono, background:"none", border:"1px solid #1e2840", borderRadius:5, color:"#4a6080", padding:"4px 10px", fontSize:10, letterSpacing:".08em" }}>← SESSIONS</button>
        <div style={{ width:3, height:15, background:ph.color, borderRadius:2 }}/>
        <div style={{ flex:1 }}>
          <div style={{ ...mono, fontSize:9, color:ph.color, letterSpacing:".15em", textTransform:"uppercase" }}>{PM[session.action.phase].label}</div>
          <div style={{ fontSize:13, color:"#dde4f4", marginTop:1 }}>{session.action.title}</div>
        </div>
        {/* Status dot */}
        <div style={{ ...mono, fontSize:9, color: apiStatus?.startsWith("Error") ? "#c45050" : busy(apiStatus) ? "#c48a40" : "#4ca876", letterSpacing:".06em" }}>
          {apiStatus || "READY"}
        </div>
        <button className="btn" onClick={generateSummary} style={{ ...mono, background:"rgba(138,85,196,0.08)", border:"1px solid rgba(138,85,196,0.3)", borderRadius:5, color:"#8a55c4", padding:"4px 10px", fontSize:9, letterSpacing:".1em" }}>
          END SESSION
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"20px", display:"flex", flexDirection:"column", gap:16 }}>
        {session.messages.map((msg, i) => (
          msg.content === "[Session Summary Requested]" ? null :
          <div key={i} style={{ maxWidth:720, alignSelf:msg.role==="user"?"flex-end":"flex-start", background:msg.role==="user"?ph.bg:"#0c1220", border:`1px solid ${msg.role==="user"?ph.border:"#1a2240"}`, borderRadius:8, padding:"12px 15px" }}>
            <div style={{ ...mono, fontSize:9, color:msg.role==="user"?ph.color:"#3a5070", letterSpacing:".12em", textTransform:"uppercase", marginBottom:6 }}>{msg.role==="user"?"YOU":"CLAUDE"}</div>
            <div style={{ fontSize:13, lineHeight:1.78, color:msg.role==="user"?"#c0cce8":"#ced4e8", whiteSpace:"pre-wrap" }}>{msg.content}</div>
          </div>
        ))}

        {busy(apiStatus) && (
          <div style={{ alignSelf:"flex-start", background:"#0c1220", border:"1px solid #1a2240", borderRadius:8, padding:"12px 15px", maxWidth:200 }}>
            <div style={{ ...mono, fontSize:9, color:"#3a5070", letterSpacing:".12em", textTransform:"uppercase", marginBottom:6 }}>CLAUDE</div>
            <div style={{ display:"flex", gap:4, alignItems:"center" }}>
              {[0,1,2].map(n=><div key={n} style={{ width:5, height:5, borderRadius:"50%", background:"#3a5070", animation:"pulse 1.2s ease-in-out infinite", animationDelay:`${n*.2}s` }}/>)}
              {apiStatus?.startsWith("Ret") && <span style={{ ...mono, fontSize:9, color:"#c48a40", marginLeft:6 }}>{apiStatus}</span>}
            </div>
          </div>
        )}

        {apiStatus?.startsWith("Error") && (
          <div style={{ alignSelf:"center", background:"rgba(196,80,80,.08)", border:"1px solid rgba(196,80,80,.3)", borderRadius:6, padding:"8px 14px", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ ...mono, fontSize:10, color:"#c45050" }}>{apiStatus}</span>
            <button className="btn" onClick={send} style={{ ...mono, background:"rgba(196,80,80,.1)", border:"1px solid rgba(196,80,80,.3)", borderRadius:4, color:"#c45050", padding:"3px 9px", fontSize:9 }}>RETRY</button>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{ padding:"12px 20px", borderTop:"1px solid #141c30", background:"#0a0f1e", display:"flex", gap:8, flexShrink:0 }}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Continue… (Enter to send, Shift+Enter for new line)" disabled={busy(apiStatus)} style={{ flex:1, background:"#0c1220", border:"1px solid #1e2840", borderRadius:6, padding:"9px 12px", color:"#ced4e8", fontFamily:"Georgia,serif", fontSize:13, lineHeight:1.6, resize:"none", outline:"none", minHeight:48, opacity:busy(apiStatus)?.5:1 }}/>
        <button className="btn" onClick={send} disabled={busy(apiStatus)||!input.trim()} style={{ ...mono, background:busy(apiStatus)||!input.trim()?"#0c1220":ph.bg, border:`1px solid ${busy(apiStatus)||!input.trim()?"#1e2840":ph.border}`, borderRadius:6, padding:"9px 16px", fontSize:10, letterSpacing:".1em", color:busy(apiStatus)||!input.trim()?"#2a3858":ph.color, flexShrink:0, alignSelf:"flex-end" }}>SEND</button>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // HOME VIEW
  // ════════════════════════════════════════════════════════════════════════════
  const SM = { new:{l:"NEW",c:"#2a4060"}, material:{l:"MATERIAL ✓",c:"#4ca876"}, continue:{l:"CONTINUE",c:"#c48a40"}, sensitive:{l:"SENSITIVE",c:"#7a3838"} };

  const Tab = ({ id, label }) => (
    <button onClick={()=>setView(id)} style={{ ...mono, background:"none", border:"none", padding:"7px 14px", cursor:"pointer", fontSize:10, letterSpacing:".14em", textTransform:"uppercase", color:view===id?"#ced4e8":"#2a3858", borderBottom:view===id?"2px solid #4d7fc4":"2px solid transparent", transition:"all .14s" }}>{label}</button>
  );

  const healthColor = storageOk === true ? "#4ca876" : storageOk === false ? "#c45050" : "#3a5070";
  const healthLabel = storageOk === true ? "STORAGE ✓" : storageOk === false ? "STORAGE ✗  sessions won't persist" : "STORAGE …";

  // Drop-in prompt string (auto-updates with material bank)
  const DROP_IN = `You are working with Kyle on his literary memoir. Load this context completely before doing anything else.

THESIS: "How does a person whose mind has been broken rebuild agency not through recovery of what was lost, but through construction of what never existed?"
GENRE: Literary nonfiction. Not self-help. Not recovery memoir.

KYLE: ~40. Staff Engineer. Self-taught. Father to Kinsley (Friday custody). Path: O'Toole's bartending → QC → engineering → Staff level. Building Chaos Club Co.
BREAKS: TBI. Addiction. Memory challenges. Cognitive disruption.
CONSTRUCTION: 240+ tools as externalized cognition. Systems as prosthetic memory.
SPINE: DIAGNOSING — O'Toole's (customers) → QC (processes) → engineering (systems). Engineering was recognition, not reinvention.

MATERIAL CAPTURED (O'Toole's, Mar 25 2026):
- Memory held without systems: drink orders, regulars, rotations
- Fran & Stewart: wedding bartend blocked by manager due to Kinsley weekend custody
- Kylie & Tony: Star Wars/Disney/tech bond, Disney World property invite
- Performance face: calm 98% / frantic 2%. Body: jaw, arms, internal screaming masked
- Two modes: chaos nights vs. ebb-and-flow nights
- DUAL-TRACK STATE: task locked + background obsession running together. Bad nights = wander interrupted the track.
- Q3 blank (wander content) — SENSITIVE, do not push
- UNANSWERED: After the break — what was in that background track?
${material.length ? `\nFROM SUBSEQUENT SESSIONS:\n${material.map(m=>`[${m.date}] ${m.retrieved||'—'}`).join('\n')}` : ''}

OPEN TARGETS: Background track after the break, The Rupture (rough notes), "relief is the most addictive feeling" (needs real memory), 19 or 21 age oscillation, first tool/system, chronological tool map, life coach figure, late-night walk (real or constructed?), meditation pivot.

PROTECTED: TBI specifics, addiction specifics, family beyond Kinsley, Q3 blank.

VOICE: Direct without cold. Metaphor-heavy. Technical precision. Strategic profanity. ZERO "And that's when I realized." Declarative. Technical descriptions of emotional states. Admissions of uncertainty.

EXCAVATION RULES: One question at a time. Don't summarize back — record and ask next. Flag when too resolved. Never push on protected areas.

END OF SESSION — produce summary in this exact format:
SESSION SUMMARY — [DATE]
WHAT WAS RETRIEVED: [bullets]
VOICE-READY FRAGMENTS: [exact lines]
WHAT'S UNRESOLVED: [open threads]
NEXT SESSION FOCUS: [one thing]
PROTECTED/FLAGS: [anything needing care]

START: Pick up at the unanswered edge question — after the break, what was in the background track?`;

  return (
    <div style={page}>
      <style>{`.btn{cursor:pointer;transition:all .14s}.btn:hover{filter:brightness(1.25)}.btn:active{transform:scale(.97)}.card{transition:border-color .16s,transform .13s}.card:hover{transform:translateY(-1px)}`}</style>

      {/* Header */}
      <div style={{ padding:"18px 24px 0", background:"#0a0f1e", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <div>
            <div style={{ ...mono, fontSize:9, letterSpacing:".18em", color:"#1e2e48", textTransform:"uppercase", marginBottom:5 }}>Literary Memoir · Session Hub</div>
            <h1 style={{ fontFamily:"Georgia,serif", fontSize:19, fontWeight:400, margin:0, color:"#e0e8f8", letterSpacing:"-.01em" }}>Construction, Not Recovery</h1>
          </div>
          {/* Health indicator */}
          <div style={{ ...mono, fontSize:9, letterSpacing:".1em", color:healthColor, textAlign:"right" }}>
            <div style={{ display:"inline-block", width:6, height:6, borderRadius:"50%", background:healthColor, marginRight:5 }}/>
            {healthLabel}
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display:"flex", borderBottom:"1px solid #141c30" }}>
          <Tab id="sessions" label="Sessions" />
          <Tab id="bank"     label={`Material Bank${material.length ? ` (${material.length})` : ""}`} />
          <Tab id="prompt"   label="Drop-in Prompt" />
        </div>
      </div>

      {/* ─── SESSIONS TAB ─────────────────────────────────────────────── */}
      {view === "sessions" && (
        <div style={{ flex:1, overflowY:"auto", padding:"14px 24px 36px" }}>
          {/* Stats */}
          <div style={{ display:"flex", gap:20, flexWrap:"wrap", padding:"10px 0 14px", borderBottom:"1px solid #0d1525", marginBottom:14 }}>
            {[["Phase","Early Excavation"],["Sessions saved", Object.keys(savedMeta).length || 0],["Material entries", material.length],["Continuation","Background Track"],["Chapters drafted","0"]].map(([l,v])=>(
              <div key={l}><div style={{ ...mono, fontSize:8, color:"#1a2a40", textTransform:"uppercase", letterSpacing:".1em" }}>{l}</div><div style={{ ...mono, fontSize:10, color:"#3a5a7a", marginTop:2 }}>{v}</div></div>
            ))}
          </div>

          {PHASES.map(phase => {
            const meta  = PM[phase];
            const cards = ACTIONS.filter(a => a.phase === phase);
            return (
              <div key={phase} style={{ marginBottom:20 }}>
                <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:8 }}>
                  <div style={{ width:3, height:11, background:meta.color, borderRadius:2 }}/>
                  <span style={{ ...mono, fontSize:9, color:meta.color, letterSpacing:".16em", textTransform:"uppercase" }}>{meta.label}</span>
                  <div style={{ flex:1, height:1, background:"#0d1525" }}/>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                  {cards.map(action => {
                    const sm     = SM[action.status];
                    const saved  = savedMeta[action.id];
                    const hasSave = !!saved;
                    const isCont  = action.status === "continue";
                    return (
                      <div key={action.id} className="card" style={{ background:isCont?"rgba(196,138,64,.05)":"#0c1220", border:`1px solid ${isCont?"rgba(196,138,64,.2)":"#131c2c"}`, borderRadius:7, padding:"10px 12px", display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                            <span style={{ ...mono, fontSize:8, color:sm.c, border:`1px solid ${sm.c}`, borderRadius:3, padding:"1px 4px", flexShrink:0, opacity:.9 }}>{sm.l}</span>
                            {hasSave && <span style={{ ...mono, fontSize:8, color:"#4ca876", border:"1px solid rgba(76,168,118,.3)", borderRadius:3, padding:"1px 4px", flexShrink:0 }}>SAVED</span>}
                            <span style={{ fontSize:13, color:"#d4dff0" }}>{action.title}</span>
                          </div>
                          <p style={{ margin:0, fontSize:11, color:"#364a62", fontStyle:"italic", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{action.sub}</p>
                        </div>
                        <div style={{ display:"flex", gap:5, flexShrink:0 }}>
                          {hasSave && (
                            <button className="btn" onClick={()=>startSession(action, true)} style={{ ...mono, background:"rgba(76,168,118,.08)", border:"1px solid rgba(76,168,118,.25)", borderRadius:5, padding:"5px 10px", fontSize:9, color:"#4ca876", letterSpacing:".1em" }}>RESUME</button>
                          )}
                          <button className="btn" onClick={()=>startSession(action, false)} style={{ ...mono, background:meta.bg, border:`1px solid ${meta.border}`, borderRadius:5, padding:"5px 12px", fontSize:9, color:meta.color, letterSpacing:".1em" }}>
                            {isCont ? "CONTINUE" : hasSave ? "RESTART" : "START"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── MATERIAL BANK TAB ────────────────────────────────────────── */}
      {view === "bank" && (
        <div style={{ flex:1, overflowY:"auto", padding:"16px 24px 36px" }}>
          <p style={{ margin:"0 0 14px", fontSize:12, color:"#3a4e6a", fontStyle:"italic" }}>
            Paste a session summary to add it. Entries accumulate and auto-populate the drop-in prompt.
          </p>

          {!pasteMode ? (
            <button className="btn" onClick={()=>setPasteMode(true)} style={{ ...mono, background:"rgba(77,127,196,.08)", border:"1px solid rgba(77,127,196,.3)", borderRadius:6, padding:"8px 18px", fontSize:10, color:"#4d7fc4", letterSpacing:".12em", marginBottom:16 }}>
              + PASTE SESSION SUMMARY
            </button>
          ) : (
            <div style={{ marginBottom:18 }}>
              <textarea value={pasteText} onChange={e=>setPasteText(e.target.value)} placeholder="Paste the SESSION SUMMARY — [DATE] block here…" style={{ width:"100%", background:"#0c1220", border:"1px solid rgba(77,127,196,.3)", borderRadius:6, padding:"10px 12px", color:"#ced4e8", fontFamily:"monospace", fontSize:11, lineHeight:1.65, resize:"vertical", outline:"none", minHeight:140, boxSizing:"border-box" }}/>
              <div style={{ display:"flex", gap:8, marginTop:8 }}>
                <button className="btn" onClick={commitSummary} style={{ ...mono, background:"rgba(76,168,118,.1)", border:"1px solid rgba(76,168,118,.3)", borderRadius:5, padding:"6px 14px", fontSize:10, color:"#4ca876", letterSpacing:".1em" }}>COMMIT TO BANK</button>
                <button className="btn" onClick={()=>{setPasteMode(false);setPasteText("");}} style={{ ...mono, background:"none", border:"1px solid #1e2840", borderRadius:5, padding:"6px 12px", fontSize:10, color:"#3a5070", letterSpacing:".1em" }}>CANCEL</button>
              </div>
            </div>
          )}

          {material.length === 0 ? (
            <div style={{ ...mono, fontSize:10, color:"#1e2e48", letterSpacing:".1em", marginTop:8 }}>NO ENTRIES YET — paste your first session summary above</div>
          ) : material.map(entry => (
            <div key={entry.id} style={{ background:"#0c1220", border:"1px solid #141c30", borderRadius:7, padding:"13px 15px", marginBottom:10 }}>
              <div style={{ ...mono, fontSize:9, color:"#4ca876", letterSpacing:".12em", marginBottom:8 }}>SESSION — {entry.date}</div>
              {entry.retrieved && <div style={{ marginBottom:8 }}><div style={{ ...mono, fontSize:8, color:"#1e2e48", letterSpacing:".1em", textTransform:"uppercase", marginBottom:3 }}>Retrieved</div><div style={{ fontSize:12, color:"#8898b8", lineHeight:1.65, whiteSpace:"pre-wrap" }}>{entry.retrieved}</div></div>}
              {entry.fragments && <div style={{ marginBottom:8, padding:"8px 10px", background:"rgba(138,85,196,.05)", border:"1px solid rgba(138,85,196,.15)", borderRadius:5 }}><div style={{ ...mono, fontSize:8, color:"#8a55c4", letterSpacing:".1em", textTransform:"uppercase", marginBottom:3 }}>Voice-Ready Fragments</div><div style={{ fontSize:12, color:"#ced4e8", fontStyle:"italic", lineHeight:1.65, whiteSpace:"pre-wrap" }}>{entry.fragments}</div></div>}
              {entry.next && <div><div style={{ ...mono, fontSize:8, color:"#c48a40", letterSpacing:".1em", textTransform:"uppercase", marginBottom:2 }}>Next Session</div><div style={{ fontSize:12, color:"#7a8a9a", fontStyle:"italic" }}>{entry.next}</div></div>}
              <button className="btn" onClick={()=>{const upd=material.filter(e=>e.id!==entry.id);setMaterial(upd);S.set("memoir-material-bank",upd);}} style={{ ...mono, background:"none", border:"none", fontSize:9, color:"#2a3848", marginTop:8, padding:0, letterSpacing:".08em" }}>REMOVE</button>
            </div>
          ))}
        </div>
      )}

      {/* ─── DROP-IN PROMPT TAB ───────────────────────────────────────── */}
      {view === "prompt" && (
        <div style={{ flex:1, overflowY:"auto", padding:"16px 24px 36px" }}>
          <p style={{ margin:"0 0 4px", fontSize:13, color:"#ced4e8" }}>Paste into any new chat — this project or standalone.</p>
          <p style={{ margin:"0 0 14px", fontSize:11, color:"#3a4a68", fontStyle:"italic" }}>Auto-updates from material bank. At end of that chat, ask for the summary format, paste it back in the Material Bank tab.</p>

          <CopyButton text={DROP_IN} />

          <div style={{ background:"#0c1220", border:"1px solid #141c30", borderRadius:7, padding:"14px", marginTop:14, maxHeight:340, overflowY:"auto" }}>
            <pre style={{ margin:0, fontSize:10, color:"#3a4e68", lineHeight:1.72, whiteSpace:"pre-wrap", fontFamily:"monospace" }}>{DROP_IN}</pre>
          </div>

          <div style={{ marginTop:14, padding:"11px 13px", background:"rgba(196,138,64,.04)", border:"1px solid rgba(196,138,64,.18)", borderRadius:7 }}>
            <div style={{ ...mono, fontSize:9, color:"#c48a40", letterSpacing:".1em", marginBottom:6 }}>TRANSFER PROTOCOL</div>
            <div style={{ fontSize:11, color:"#4a5a70", lineHeight:1.7 }}>
              1. Copy prompt → paste into any chat<br/>
              2. Run excavation or drafting<br/>
              3. End with: <em style={{ color:"#7a8aaa" }}>"Give me the session summary in the standard format"</em><br/>
              4. Paste that summary → Material Bank tab → Commit to Bank
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); }
    catch { const el=document.createElement("textarea"); el.value=text; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); }
    setCopied(true); setTimeout(()=>setCopied(false), 2000);
  };
  return (
    <button onClick={copy} style={{ fontFamily:"monospace", background:copied?"rgba(76,168,118,.1)":"rgba(77,127,196,.08)", border:`1px solid ${copied?"rgba(76,168,118,.35)":"rgba(77,127,196,.3)"}`, borderRadius:6, padding:"8px 18px", fontSize:10, letterSpacing:".12em", color:copied?"#4ca876":"#4d7fc4", cursor:"pointer", transition:"all .14s" }}>
      {copied ? "COPIED ✓" : "COPY DROP-IN PROMPT"}
    </button>
  );
}
