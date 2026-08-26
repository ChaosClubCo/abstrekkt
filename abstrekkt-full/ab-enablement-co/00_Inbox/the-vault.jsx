import { useState, useEffect, useRef, useCallback } from "react";

// ── ALL KNOWN CONTEXT ABOUT KYLE ───────────────────────────────────────────
const KYLE_CONTEXT = `You are working with Kyle Rosebrook, 40, Grayslake IL. You have deep knowledge of his memoir project and personal history. Use this context to decode or excavate his songs — he should not have to explain himself.

MEMOIR THESIS: "Construction, Not Recovery" — letter to his daughter Kinsley. Diagnostic instinct (reading rooms at O'Toole's → reading processes in QC → reading systems in engineering) survived addiction, overdose-induced TBI, and cognitive disruption. Construction over recovery. No epiphanies. No arc resolution. Technical descriptions of emotional states.

PEOPLE:
- Kinsley: Kyle's daughter. Friday custody. The memoir is written for her. She appears in very few excavated scenes.
- Kyle's father: Complicated, largely unexcavated. KEY FACT: Kyle's own father told him Kyle is THE FIRST PERSON IN THE FAMILY LINEAGE who did not beat his child. This is a confirmed multi-generational pattern that Kyle broke. This is the construction thesis as biographical fact — something was never modeled, and Kyle built it anyway.
- THE FOUR "DAD" SONGS: "Please Dad I Need You," "Please Daddy I Need You," "Dear Dad," "I Learned This From You," and "Hold On, Dad" are ALL written in KINSLEY'S VOICE, addressed to Kyle as her father. The "dad" is Kyle, not Kyle's father.
- "I Learned This From You": Kinsley's voice. Surface narrative: she learned toxic, self-destructive behaviors from him. NARRATIVE FLIP: revealed that Kyle was the abused one — he was beaten. He has never and would never hit Kinsley. The song lives in the gap between what was passed down and what was broken. His father's confirmation of the lineage break is the pivot.
- One of the "Please Dad" songs: Based on a suicide note Kyle wrote. Written in Kinsley's voice — her telling him not to, because of what he'd miss, because she wants to grow up with him. The note was real. The song is her answer to it.
- Michael: Kyle's abusive ex-partner. She/her pronouns despite male name. Gaslighting, moving the goalposts, Xanax relapse trigger. Pattern: reproduced Kyle's family rescue/chaos cycle. "She pays for an Uber at 3-4am for him to come stay in the shed." Represents recognized-while-trapped-in-it dynamic.
- D or Dre: Kinsley's mother. Relationship deteriorated during Milwaukee period.
- Pete: Salvation Army roommate → construction work partner → relapsed → overdosed and died. Parallel failure arc. Unexcavated.
- Tom Ropel: Kyle's best friend growing up. Married Stephanie. Son Oliver at Kinsley's 5th birthday. "An entire chapter by itself." Never excavated.
- Dave Datt: Died of brain aneurysm in his 20s or 30s. Kyle attended funeral. Unexcavated.
- Ryan: CLC counselor. Puerto Rican grandmother, empanadas. Kyle reached out once, no reply.
- Phillis: Kyle's mother. Found Amen Clinics. Arranged Sedona trip.
- Soaring Bear: Life coach, Sedona, Sacred Spiritual Healing Journeys. Sent assignments through Kyle's own FlashFusion ticket system. Kyle built his website on a card table — origin of the self-teaching method.
- Corey: Kyle's brother, 38.

TIMELINE:
- Childhood: Family dynamics — choices always overridden, micromanaged. "Never exceptional at anything." Pre-break origin, unexcavated.
- 2006–2011: O'Toole's bartending, management. Diagnostic instinct forms in chaos.
- QC period: Reading processes. Engineering work.
- NIU: Expelled for grades. Car accident settlement ~$50K → spent on drugs/car/Trump Tower weekend.
- Milwaukee: Relationship with Dre deteriorates.
- Rogers Behavioral Health: ~1.5 months, summer 2020.
- TBI: Hypoxia from overdose. ~2020–21 (exact date in conflict — treat as memoir material).
- 2020–2022: The gap year. Confirmed empty. Rupture period. Songs may be the ONLY primary source from this window.
- Michael relationship: Post-TBI. Gaslighting. Xanax relapse.
- Sedona: Phillis arranged. Soaring Bear. Card table. Screenshot method. Origin of self-teaching.
- July 2022: AMEN Clinics eval. Processing Speed 99th percentile, Recall Memory 12th, Flexibility 17th, Resilience 2nd. Engine full speed, storage empty. Tools as prosthetic memory.
- O'Toole's: 4 years bartending stabilization.
- Late emergence: Self-taught engineer, AI tools as external cognition for rebuilt brain.

KNOWN CODED LANGUAGE:
- "glory hole" in recovery-adjacent lyrics = likely AA/NA meetings
- "fortress" = sobriety, stability
- "rivals" = people from the using life
- "ninja turtle shell" = defensive operating mode, emotional armor
- "rockstars" = people who burned out at the same life Kyle was living
- "rummage sale" / family dissolution imagery = aftermath of the overdose/chaos period
- "gold goddess" = likely refers to Dre, or the idealized relationship
- "love seeds" (circled in archive) = unknown — excavation needed
- "America" in archive = political/identity piece, possibly written during a period of disillusionment; heavy annotations suggest personal investment beyond the political

COGNITIVE PROFILE CONTEXT: Processing speed intact, recall devastated. External tools (notes, systems, written records) compensate for what memory can't hold. The 31 songs ARE the memory. They predate the systematic tool-building.`;

// ── DATA ───────────────────────────────────────────────────────────────────
const SONGS = [
  { id:"a-letter-away", title:"A Letter Away", tag:"SONG", content:`[INTRO]
Everything you are bears the result of a thousand lives,
After all the people that passed before your very eyes.
Stand up against the flow, give a bit of effort and try,
Stop thinking in terms of just I's.

[VERSE 1]
Look like flies, standin' around who, what, where, how and why.
I'll leave you on the ground, face down,
Bled to the bone while rivals drive by,
All because you merely forgot to say hi.

[PRE-CHORUS]
Try a little harder in this new gentle soul,
Temptations wait in every glory hole.
Show a little self-control, don't enter a new pitfall,
Stand up for the right, don't be anyone's fuckin' cue ball.

[CHORUS]
You're just a letter away,
From becoming part of the fortress.
One bad step, one wrong play,
And you won't record this.

[VERSE 2]
Last life you were all about yourself to a slight avail,
Hard life, fast lane, watch the rockstars bail.
Rolls of hundreds, ties too tight, not frail—they're stale.
Watch your back, they know you're about to set sail.

[BRIDGE]
Even with a strong gale, you're slower than a sea snail.
You're a split rail, no longer tighter than the whole diatonic scale.

[VERSE 3]
They remember your heroic tales, once tough as a stud nail.
Now your family splits possessions like a rummage sale.

[OUTRO]
Force yourself to excel, get out the ninja turtle shell.
Give yourself a real story to tell.
Bid your old way of life a long, long farewell.` },
  { id:"please-dad", title:"Please Dad I Need You", tag:"SONG", content:"[KINSLEY'S VOICE — addressed to Kyle. One of the two 'Please Dad' songs is based on a real suicide note Kyle wrote; the song is her answer: don't, because of what you'd miss, because I want to grow up with you. CONFIRM which of the two this is. Primary source from the gap year — dating this song dates the note.]" },
  { id:"please-daddy", title:"Please Daddy I Need You", tag:"SONG", content:"[KINSLEY'S VOICE — addressed to Kyle. Companion piece to 'Please Dad I Need You.' One of the two is the suicide-note answer song. CONFIRM which.]" },
  { id:"dear-dad", title:"Dear Dad", tag:"SONG", content:"[KINSLEY'S VOICE — addressed to Kyle as her father, NOT about Kyle's own dad. Lyrics not yet loaded.]" },
  { id:"i-learned-this", title:"I Learned This From You", tag:"SONG", content:"[KINSLEY'S VOICE. Surface narrative: she learned the toxic, self-destructive behaviors from Kyle. NARRATIVE FLIP: Kyle was the one who was abused and beaten — and has never and would never lay a hand on her. Written after Kyle's father told him he is the first person in the family lineage who didn't beat their child. The song lives in the gap between what was passed down and what was broken. This is the construction thesis as a single song — CHAPTER-SHAPED.]" },
  { id:"hold-on-dad", title:"Hold On, Dad", tag:"SONG", content:"[Addressed to the future version of Kyle from Kinsley's perspective — confirms dad arc is unresolved and load-bearing]" },
  { id:"twisted-words", title:"Twisted Words", tag:"SONG", content:null },
  { id:"theres-been-accident", title:"There's Been An Accident", tag:"SONG", content:null },
  { id:"its-my-fault", title:"It's Definitely My Fault", tag:"SONG", content:null },
  { id:"feedback-loop", title:"Feedback Loop", tag:"SONG", content:null },
  { id:"no-one-cares", title:"No One Fuckin' Cares", tag:"SONG", content:null },
  { id:"tax-the-damage", title:"Tax the Damage", tag:"SONG", content:null },
  { id:"source-code-scars", title:"Source Code Scars", tag:"SONG", content:null },
  { id:"ignitable-candor", title:"Ignitable Candor", tag:"SONG", content:null },
  { id:"gold-in-static", title:"Gold in the Static", tag:"SONG", content:null },
  { id:"lockdown-maze", title:"Lockdown Maze", tag:"SONG", content:null },
  { id:"zombieland-static", title:"Zombieland Static", tag:"SONG", content:null },
  { id:"neon-exorcist", title:"Neon Exorcist", tag:"SONG", content:null },
  { id:"ivory-ruin", title:"Ivory Ruin and Glittering Wood", tag:"SONG", content:null },
  { id:"wake-up-color", title:"Wake Up Inside a Color I Can't Name", tag:"SONG", content:null },
  { id:"little-world", title:"Little World From Where You Stand", tag:"SONG", content:null },
  { id:"dont-be-bashful", title:"Don't Be Bashful", tag:"SONG", content:null },
  { id:"one-breath", title:"One Breath at a Time", tag:"SONG", content:null },
  { id:"i-choose-stay", title:"I Choose to Stay", tag:"SONG", content:null },
  { id:"fingerprint-confession", title:"Fingerprint Confession", tag:"SONG", content:null },
  { id:"the-breakthrough", title:"The Breakthrough", tag:"SONG", content:null },
  { id:"trust-me", title:"Trust Me", tag:"SONG", content:null },
  { id:"blacklight-fracture", title:"Blacklight Fracture", tag:"SONG", content:null },
  { id:"mirrors-muzzle", title:"Mirrors and Muzzle Flashes", tag:"SONG", content:null },
  { id:"watchu-want", title:"Watchu Want From Me", tag:"SONG", content:null },
  { id:"one-percent", title:"One Percent of the Temporary", tag:"SONG", content:null },
  { id:"question-no-frame", title:"Question Without a Frame", tag:"SONG", content:null },
];

const MEMOIR_DOCS = [
  { id:"wall-scene", title:"The Wall (Scene II)", tag:"SCENE", content:`The notes have been on the wall by my door for over a year.

CHECK YOUR NOTEBOOK!!! YOU PROBABLY FORGOT SOMETHING.
CHANGE YOUR PATTERNS = CHANGE YOUR HABITS.
FOCUS ON THE SHIT THAT WORKS.

Written in black marker, all-caps, on notebook paper. Taped up with the specific permanence of things doing a job every day. The engineer's version of a mantra — because I understand systems better than I understand myself.` },
  { id:"card-table", title:"Card Table (Scene I — locked)", tag:"SCENE", content:"[LOCKED. Confirmed: Phillis → Sedona → Soaring Bear → card table → screenshot method → Chaos Club. Do not draft further until excavation sequence confirmed.]" },
  { id:"construction-scan", title:"Construction Scan (assembled draft)", tag:"SCENE", content:null },
  { id:"part-ii-homelessness", title:"Part II — Homelessness Chapters", tag:"SCENE", content:null },
];

const ARCHIVE_DOCS = [
  { id:"primary-archive", title:"Primary Source Archive", tag:"ARCHIVE", content:`JOURNAL — Michael relationship:
"From the beginning I told her the truth about everything no matter what, often it being twisted so that whatever was wrong was my fault alone."
"I was trying to avoid her all the time, even my daughter's B.Day party."
"I would literally sit there and stare at the countertop not doing anything but complying with what she said."

SELF-CARE MIND-MAP (yellow lined paper):
Work on something new 15 min / Meditation / Healthier eating / Journaling / Work on something uncomfortable / Read about something new / Learn about my emotions

UNTITLED RAP ("Lyrical maneuver OR reach me"):
"My words vocally capture your secret tattered but intact / welcoming tradition, old-word verse easily rewritten / wondering where your gold goddess went / It's possible to do it with a pacifistic no contact / My rhetoric alone accomplishes the task at hand."` },
  { id:"america-song", title:"'America' (archive — undated, uncatalogued)", tag:"ARCHIVE", content:`NOT in the main 31-song vault. Found in primary source archive. Needs dating.

We stood our ground and our blood was spilt, since the birth of our nation...
So what does it mean to be an American? It should surely be anything but greed.

[Later verses, heavily annotated:]
"Just a ruse to an illusionary door / tellin' em who they are / Saw all the loop holes in this inconsistent fuckin' piece of shit system of ours"

Final lines:
"Are freemen no matter what color you are / only wanting you to pause before you inevitably waste yours — AN IRREVERSIBLY BEAUTIFUL — TIME ON THIS EARTH"

[Timing marks: TR M 2:59 / #5 9:11 / #7 2:26 — suggests this was recorded]` },
  { id:"amen-eval", title:"Amen Clinics Evaluation (Jul 2022)", tag:"CLINICAL", content:"Processing Speed: 99th percentile. Recall Memory: 12th. Flexibility: 17th. Resilience: 2nd. DATE CONFLICT: p2 'summer 2020' vs p3 'Oct 2021' for hypoxia event — memoir material, not error." },
];

const ALL_ITEMS = [...SONGS, ...MEMOIR_DOCS, ...ARCHIVE_DOCS];

// ── API ────────────────────────────────────────────────────────────────────
async function callAPI(system, userMsg) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1200,
      system, messages:[{role:"user", content:userMsg}] })
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return d.content?.[0]?.text || "";
}

const SYS_DECODE = KYLE_CONTEXT + `

YOUR TASK: Decode this piece. Using everything you know about Kyle's life, people, and coded language — translate what the lyrics actually mean autobiographically. Go verse by verse or section by section. Be specific. Use names when you know them. Flag uncertainties with [?]. No recovery language. No psychological interpretation. Just: this line is about X, this metaphor means Y.`;

const SYS_EXCAVATE = KYLE_CONTEXT + `

YOUR TASK: Generate 3 excavation questions for this piece that will surface the specific memory, person, or event behind it. Use what you know about Kyle's timeline and people to ask targeted, specific questions — not generic prompts. Each question under 25 words. Direct. Numbered.`;

const SYS_AUGMENT = KYLE_CONTEXT + `

YOUR TASK: The user has an existing decode or excavation result. They are providing additional context or a correction. Merge the new information into the existing result, revising or extending it. Be surgical — keep what's right, fix what's wrong, add what's new.`;

// ── COLORS ─────────────────────────────────────────────────────────────────
const C = {
  bg:"#12100c", surface:"#0e0c09", border:"#1e1c18", border2:"#2a2520",
  text:"#e8e0d0", dim:"#9a9085", muted:"#6a6255",
  gold:"#c9a84c", teal:"#4ca9c9", rose:"#c94c6a", purple:"#9a84c9",
};
const TAG_COLOR = { SONG:C.gold, SCENE:C.teal, ARCHIVE:C.rose, CLINICAL:C.purple };

// ── EDITABLE TEXT ──────────────────────────────────────────────────────────
function EditableResult({ value, onChange, placeholder, color }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width:"100%", minHeight:220, background:"#0a0908",
        border:`1px solid ${color}33`, color:"#c8c0b0",
        fontFamily:"Georgia, serif", fontSize:14, padding:"14px 16px",
        outline:"none", resize:"vertical", lineHeight:1.8,
        boxSizing:"border-box", transition:"border-color .2s"
      }}
      onFocus={e => e.target.style.borderColor = color + "88"}
      onBlur={e => e.target.style.borderColor = color + "33"}
    />
  );
}

// ── AUGMENT BAR ────────────────────────────────────────────────────────────
function AugmentBar({ onAugment, loading }) {
  const [note, setNote] = useState("");
  return (
    <div style={{display:"flex", gap:8, marginTop:10}}>
      <input
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Add context, correct something, or say what you remember..."
        onKeyDown={e => { if(e.key==="Enter" && note.trim()){ onAugment(note); setNote(""); }}}
        style={{ flex:1, background:"#1a1810", border:`1px solid ${C.border2}`, color:C.text,
          fontFamily:"monospace", fontSize:11, padding:"6px 10px", outline:"none" }}
      />
      <button
        disabled={!note.trim() || loading}
        onClick={() => { onAugment(note); setNote(""); }}
        style={{ fontFamily:"monospace", fontSize:10, letterSpacing:".1em", textTransform:"uppercase",
          padding:"6px 14px", border:`1px solid ${C.purple}`, cursor:"pointer",
          background:"transparent", color:C.purple, opacity:(!note.trim()||loading)?.4:1 }}
      >{loading?"...":"Augment →"}</button>
    </div>
  );
}

// ── MAIN ───────────────────────────────────────────────────────────────────
export default function Vault() {
  const [active, setActive] = useState(SONGS[0]);
  const [panel, setPanel] = useState("read");
  const [flagged, setFlagged] = useState({});
  const [dates, setDates] = useState({});
  const [decodes, setDecodes] = useState({});    // id → editable string
  const [excavates, setExcavates] = useState({}); // id → editable string
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState({songs:true, memoir:false, archive:false});
  const saveTimer = useRef({});

  useEffect(() => {
    (async () => {
      try {
        const keys = ["v2-flagged","v2-dates","v2-decodes","v2-excavates"];
        const results = await Promise.all(keys.map(k => window.storage?.get(k).catch(()=>null)));
        const [f,d,dc,ex] = results;
        if (f?.value) setFlagged(JSON.parse(f.value));
        if (d?.value) setDates(JSON.parse(d.value));
        if (dc?.value) setDecodes(JSON.parse(dc.value));
        if (ex?.value) setExcavates(JSON.parse(ex.value));
      } catch(e){}
    })();
  }, []);

  // Debounced persist
  const persist = useCallback((key, obj) => {
    clearTimeout(saveTimer.current[key]);
    saveTimer.current[key] = setTimeout(() => {
      window.storage?.set(key, JSON.stringify(obj)).catch(()=>{});
    }, 600);
  }, []);

  const updateDecode = (id, val) => {
    setDecodes(prev => { const n={...prev,[id]:val}; persist("v2-decodes",n); return n; });
  };
  const updateExcavate = (id, val) => {
    setExcavates(prev => { const n={...prev,[id]:val}; persist("v2-excavates",n); return n; });
  };
  const updateDate = (id, val) => {
    setDates(prev => { const n={...prev,[id]:val}; persist("v2-dates",n); return n; });
  };
  const toggleFlag = () => {
    if (!active) return;
    setFlagged(prev => { const n={...prev,[active.id]:!prev[active.id]}; persist("v2-flagged",n); return n; });
  };

  const buildContext = (item) => {
    const c = item.content && !item.content.startsWith("[") ? item.content.slice(0,2000) : null;
    return c
      ? `PIECE: "${item.title}" (${item.tag})\n\nCONTENT:\n${c}`
      : `PIECE: "${item.title}" (${item.tag})\n\n[Full lyrics not yet loaded — work from title, known context, and the song's place in Kyle's story]`;
  };

  const runDecode = async () => {
    if (!active) return;
    setLoading(true);
    try {
      const result = await callAPI(SYS_DECODE, buildContext(active));
      updateDecode(active.id, result);
      setPanel("decode");
    } catch(e) { alert(e.message); }
    setLoading(false);
  };

  const runExcavate = async () => {
    if (!active) return;
    setLoading(true);
    try {
      const result = await callAPI(SYS_EXCAVATE, buildContext(active));
      updateExcavate(active.id, result);
      setPanel("excavate");
    } catch(e) { alert(e.message); }
    setLoading(false);
  };

  const augmentDecode = async (note) => {
    if (!active) return;
    setLoading(true);
    try {
      const existing = decodes[active.id] || "";
      const msg = `PIECE: "${active.title}"\n\nEXISTING DECODE:\n${existing}\n\nNEW CONTEXT FROM KYLE:\n${note}\n\nRevise and extend the decode incorporating this new information.`;
      const result = await callAPI(SYS_AUGMENT, msg);
      updateDecode(active.id, result);
    } catch(e) { alert(e.message); }
    setLoading(false);
  };

  const augmentExcavate = async (note) => {
    if (!active) return;
    setLoading(true);
    try {
      const existing = excavates[active.id] || "";
      const msg = `PIECE: "${active.title}"\n\nEXISTING QUESTIONS:\n${existing}\n\nNEW CONTEXT FROM KYLE:\n${note}\n\nRevise the excavation questions incorporating this context. Keep what's sharp, replace what's now off-target.`;
      const result = await callAPI(SYS_AUGMENT, msg);
      updateExcavate(active.id, result);
    } catch(e) { alert(e.message); }
    setLoading(false);
  };

  const filter = (items) => query ? items.filter(i => i.title.toLowerCase().includes(query.toLowerCase())) : items;
  const flagCount = Object.values(flagged).filter(Boolean).length;
  const decodeCount = Object.keys(decodes).length;
  const tc = TAG_COLOR[active?.tag] || C.gold;

  const Rail = ({label, key2, items, color}) => (
    <div style={{borderBottom:`1px solid ${C.border}`}}>
      <div onClick={() => setOpen(o=>({...o,[key2]:!o[key2]}))}
        style={{padding:"8px 14px 4px", fontFamily:"monospace", fontSize:10, letterSpacing:".14em",
          textTransform:"uppercase", color, cursor:"pointer", display:"flex", justifyContent:"space-between", userSelect:"none"}}>
        <span>{label}</span>
        <span style={{color:C.muted}}>{filter(items).length} {open[key2]?"▾":"▸"}</span>
      </div>
      {open[key2] && filter(items).map(item => {
        const isAct = active?.id === item.id;
        const tc2 = TAG_COLOR[item.tag] || "#888";
        return (
          <div key={item.id} onClick={() => { setActive(item); setPanel("read"); }}
            style={{padding:"5px 14px 5px 18px", fontSize:12.5, cursor:"pointer", lineHeight:1.35,
              background: isAct?"#1a1810":"transparent", color:isAct?C.text:C.dim,
              borderLeft:`2px solid ${isAct?tc2:"transparent"}`, display:"flex", alignItems:"center", gap:5}}>
            {flagged[item.id] && <span style={{color:C.gold,fontSize:9}}>◆</span>}
            {decodes[item.id] && <span style={{color:C.purple,fontSize:9}}>⊕</span>}
            {excavates[item.id] && <span style={{color:C.teal,fontSize:9}}>⟡</span>}
            <span style={{flex:1}}>{item.title}</span>
            {dates[item.id] && <span style={{fontFamily:"monospace",fontSize:9,color:C.muted,flexShrink:0}}>{dates[item.id]}</span>}
          </div>
        );
      })}
    </div>
  );

  const Btn = ({children, color, onClick, active: isActive}) => (
    <button onClick={onClick} disabled={loading}
      style={{fontFamily:"monospace", fontSize:10, letterSpacing:".1em", textTransform:"uppercase",
        padding:"5px 12px", border:`1px solid ${isActive?color:C.border2}`, cursor:"pointer",
        background: isActive?color+"22":"transparent", color:isActive?color:C.muted,
        opacity:loading?.5:1, transition:"all .15s"}}>
      {children}
    </button>
  );

  return (
    <div style={{display:"flex", height:"100vh", background:C.bg, color:C.text, fontFamily:"Georgia,serif", overflow:"hidden"}}>

      {/* RAIL */}
      <div style={{width:230, minWidth:230, background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column"}}>
        <div style={{padding:"14px 14px 8px", borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"monospace", fontSize:10, letterSpacing:".18em", textTransform:"uppercase", color:C.gold, marginBottom:3}}>The Vault</div>
          <div style={{fontFamily:"monospace", fontSize:9, color:C.muted, lineHeight:1.6}}>
            {ALL_ITEMS.length} pieces · {flagCount} flagged · {decodeCount} decoded
          </div>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="search..."
            style={{marginTop:7, background:"#1a1810", border:`1px solid ${C.border2}`, color:C.text,
              fontFamily:"monospace", fontSize:11, padding:"5px 8px", outline:"none", width:"100%", boxSizing:"border-box"}} />
        </div>
        <div style={{overflowY:"auto", flex:1}}>
          <Rail label="Songs" key2="songs" items={SONGS} color={C.gold}/>
          <Rail label="Memoir" key2="memoir" items={MEMOIR_DOCS} color={C.teal}/>
          <Rail label="Archive" key2="archive" items={ARCHIVE_DOCS} color={C.rose}/>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1, display:"flex", flexDirection:"column", overflow:"hidden"}}>

        {/* TOP BAR */}
        {active && (
          <div style={{background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"8px 18px",
            display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", minHeight:46}}>
            <span style={{fontFamily:"monospace", fontSize:9, letterSpacing:".12em", textTransform:"uppercase",
              padding:"2px 7px", border:`1px solid ${tc}`, color:tc, flexShrink:0}}>{active.tag}</span>
            <span style={{flex:1, fontSize:14.5, minWidth:100}}>{active.title}</span>
            <input value={dates[active.id]||""} onChange={e=>updateDate(active.id,e.target.value)}
              placeholder="when written..."
              style={{background:"#1a1810", border:`1px solid ${C.border2}`, color:C.dim,
                fontFamily:"monospace", fontSize:10, padding:"4px 8px", outline:"none", width:110}} />
            <Btn color={C.gold} onClick={toggleFlag} active={!!flagged[active.id]}>
              {flagged[active.id]?"◆ flagged":"◇ flag"}
            </Btn>
            <Btn color={C.purple} onClick={runDecode} active={!!decodes[active.id]}>
              {loading && panel==="decode"?"...":"⊕ decode"}
            </Btn>
            <Btn color={C.teal} onClick={runExcavate} active={!!excavates[active.id]}>
              {loading && panel==="excavate"?"...":"⟡ excavate"}
            </Btn>
          </div>
        )}

        {/* TABS */}
        <div style={{background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 18px",
          display:"flex", gap:0}}>
          {[
            {key:"read", label:"read"},
            {key:"decode", label:`decode${decodes[active?.id]?" ●":""}`},
            {key:"excavate", label:`excavate${excavates[active?.id]?" ●":""}`},
          ].map(({key,label}) => (
            <button key={key} onClick={() => setPanel(key)}
              style={{fontFamily:"monospace", fontSize:9, letterSpacing:".12em", textTransform:"uppercase",
                padding:"7px 14px", border:"none", background:"transparent", cursor:"pointer",
                color:panel===key?C.text:C.muted,
                borderBottom:panel===key?`2px solid ${C.gold}`:"2px solid transparent"}}>
              {label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{flex:1, overflow:"auto", padding:"24px 32px 60px"}}>
          <div style={{maxWidth:660}}>

            {panel==="read" && active && (
              active.content && !active.content.startsWith("[")
                ? <pre style={{whiteSpace:"pre-wrap", fontFamily:"Georgia,serif", fontSize:15, lineHeight:1.85, color:"#d0c8b8", margin:0}}>{active.content}</pre>
                : <div style={{fontFamily:"monospace", fontSize:12, color:active.content?.startsWith("[")? C.rose:C.muted,
                    padding:"12px 16px", border:`1px solid ${C.border2}`, background:C.surface, lineHeight:1.7}}>
                    {active.content || "Lyrics not yet loaded. Click ⊕ decode or ⟡ excavate to work from what's known."}
                  </div>
            )}

            {panel==="decode" && active && (
              <div>
                <div style={{fontFamily:"monospace", fontSize:9, letterSpacing:".14em", textTransform:"uppercase",
                  color:C.purple, marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <span>⊕ Decode — {active.title}</span>
                  {!decodes[active.id] && <span style={{color:C.muted}}>click ⊕ decode above to generate</span>}
                </div>
                <EditableResult
                  value={decodes[active.id] || ""}
                  onChange={val => updateDecode(active.id, val)}
                  placeholder="Decode will appear here. You can edit directly — changes save automatically."
                  color={C.purple}
                />
                {decodes[active.id] && <AugmentBar onAugment={augmentDecode} loading={loading}/>}
              </div>
            )}

            {panel==="excavate" && active && (
              <div>
                <div style={{fontFamily:"monospace", fontSize:9, letterSpacing:".14em", textTransform:"uppercase",
                  color:C.teal, marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <span>⟡ Excavation — {active.title}</span>
                  {!excavates[active.id] && <span style={{color:C.muted}}>click ⟡ excavate above to generate</span>}
                </div>
                <EditableResult
                  value={excavates[active.id] || ""}
                  onChange={val => updateExcavate(active.id, val)}
                  placeholder="Excavation questions will appear here. Edit, add your own, or delete what doesn't fit."
                  color={C.teal}
                />
                {excavates[active.id] && <AugmentBar onAugment={augmentExcavate} loading={loading}/>}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
