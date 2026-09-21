import { useState, useEffect } from "react";

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
  { id:"please-dad", title:"Please Dad I Need You", tag:"SONG", content:null },
  { id:"please-daddy", title:"Please Daddy I Need You", tag:"SONG", content:null },
  { id:"dear-dad", title:"Dear Dad", tag:"SONG", content:null },
  { id:"i-learned-this", title:"I Learned This From You", tag:"SONG", content:null },
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
  { id:"hold-on-dad", title:"Hold On, Dad", tag:"SONG", content:"[Full text in separate artifact — confirmed as Kinsley-addressed piece. Vault note: dates to period post-turnaround. Cross-reference with memoir Thread 4.]" },
];

const MEMOIR_DOCS = [
  { id:"wall-scene", title:"The Wall (Scene II — locked)", tag:"SCENE", content:`The notes have been on the wall by my door for over a year.

Not stuck there temporarily. Taped up with the specific permanence of things that are doing a job — the same job every day.

My handwriting is in black marker, all-caps, on notebook paper. Three notes.

CHECK YOUR NOTEBOOK!!! YOU PROBABLY FORGOT SOMETHING.
CHANGE YOUR PATTERNS = CHANGE YOUR HABITS.
FOCUS ON THE SHIT THAT WORKS.

Written like an equation. I understand systems better than I understand myself, so I wrote the self-help line in the language of systems. The engineer's version of a mantra.` },
  { id:"card-table", title:"Card Table (Scene I — locked)", tag:"SCENE", content:"[LOCKED. Confirmed: Phillis → Sedona → Soaring Bear → card table → screenshot method → Chaos Club origin. Do not draft further until excavation sequence confirmed.]" },
  { id:"construction-scan", title:"Construction Scan Draft (assembled)", tag:"SCENE", content:null },
  { id:"part-ii-homelessness", title:"Part II — Homelessness Chapters", tag:"SCENE", content:null },
];

const ARCHIVE_DOCS = [
  { id:"primary-archive", title:"Primary Source Archive (895 lines)", tag:"ARCHIVE", content:`Transcribed April 12, 2026. Handwritten journal (11 pages), printed poems (3), printed songs/raps with annotations (4+), life coach emails (2), CBT worksheet (1), self-care note (1), partial binder pages (2).

KEY JOURNAL FRAGMENTS (Michael relationship):
"From the beginning I told her the truth about everything no matter what, often it being twisted so that whatever was wrong was my fault alone."

"I was trying to avoid her all the time, even my daughter's B.Day party. I wanted to avoid the condescending, RUDE, made to make me feel inferior comments and having my memories distorted."

"I would literally sit there and stare at the countertop not doing anything but complying."

SELF-CARE MIND-MAP (yellow lined paper):
Work on something new 15 min / Meditation / Balance dreams & mind / Healthier eating / Journaling / Work on something uncomfortable / Read about something new / Learn about my emotions

UNTITLED RAP (Image 2, batch 1 — titled "Lyrical maneuver OR reach me"):
"My words vocally capture your secret tattered but intact / welcoming tradition, old-word verse easily rewritten / mystery bound devoted, wonderin where your gold goddess went / It's possible to do it with a pacifistic no contact / My rhetoric alone accomplishes the task at hand."

NOTE: "LOVE SEEDS" circled in printed song. Timing marks on annotated song: "TR M 2:59 / #5 9:11 / #7 2:26" — suggests this was recorded/tracked. Song not yet in Vault inventory.` },
  { id:"clinical-timeline", title:"Rogers BH / Clinical Timeline", tag:"CLINICAL", content:null },
  { id:"amen-eval", title:"Amen Clinics Evaluation (Jul 2022)", tag:"CLINICAL", content:"Processing Speed: 99th percentile. Recall Memory: 12th percentile. Flexibility: 17th. Resilience: 2nd. DATE CONFLICT: p2 'summer 2020' vs p3 'Oct 2021' for hypoxia event — treat as memoir material, not error to resolve. Physicians: Michael Easton MD (eval), Shane Creado MD (scan)." },
  { id:"america-song", title:"'America' (untitled, from archive — undated)", tag:"ARCHIVE", content:`NOTE: Found in primary source archive. NOT in main song vault. Needs dating and cataloguing.

We stood our ground and our blood was spilt, since the birth of our nation.
We fought fiercely and protected our freedom, by stopping the British invasion.

So what does it mean to be an American?
It should surely be anything but greed.
We're now remembered for this constant flaw, although I'm sure most would disagree.

[Heavy annotations. Circled: "WERE YOU THINKING." Timing marks suggest this was recorded.]

Late verses:
"Just a ruse to an illusionary door / tellin' em who they are / Deceivingly better than others / experienced in the art of war / Saw all the loop holes in this inconsistent fuckin' piece of shit system of ours"

Final lines:
"Are freemen no matter what color you are / You ever even think of those who had the courage exchange their life for yours / only wanting you to pause before you inevitably waste yours — AN IRREVERSIBLY BEAUTIFUL — TIME ON THIS EARTH"` },
];

const ALL_ITEMS = [...SONGS, ...MEMOIR_DOCS, ...ARCHIVE_DOCS];

// ── API CALLS ──────────────────────────────────────────────────────────────
const SYS_EXCAVATION = `You are a memoir excavation assistant for Kyle Rosebrook's literary memoir "Construction, Not Recovery" — a letter to his daughter Kinsley. Thesis: diagnostic instinct (reading rooms → reading processes → reading systems) survived addiction, overdose, TBI, and cognitive disruption and became the construction foundation. Frame: construction, not recovery. No epiphanies. No recovery language. Generate 3 excavation questions that pull specific memory, sensory detail, and circumstance. Each question under 25 words. Direct. No therapy language.`;

const SYS_DECODE = `You are a personal memoir decoder for Kyle Rosebrook. He writes in coded language — initials, nicknames, metaphors for real people and events. He will provide the actual lyrics/text AND a personal key explaining what the coded terms mean. Your job: translate the piece line by line into plain autobiography using ONLY the key provided. No psychological interpretation. No added meaning. Just translation. Output format: verse/section header, then the decoded plain-language version of that section. Preserve his voice. Construction, not recovery. No epiphanies.`;

async function callAPI(system, userMsg) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system,
      messages: [{ role: "user", content: userMsg }]
    })
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return d.content?.[0]?.text || "No response.";
}

// ── COLORS ─────────────────────────────────────────────────────────────────
const TAG_COLOR = { SONG:"#c9a84c", SCENE:"#4ca9c9", ARCHIVE:"#c94c6a", CLINICAL:"#9a84c9" };
const C = {
  bg:"#12100c", surface:"#0e0c09", border:"#1e1c18", border2:"#2a2520",
  text:"#e8e0d0", dim:"#9a9085", muted:"#6a6255",
  gold:"#c9a84c", teal:"#4ca9c9", rose:"#c94c6a", purple:"#9a84c9",
};

// ── MAIN ───────────────────────────────────────────────────────────────────
export default function Vault() {
  const [active, setActive] = useState(SONGS[0]);
  const [flagged, setFlagged] = useState({});
  const [dates, setDates] = useState({});
  const [decodes, setDecodes] = useState({});
  const [excavations, setExcavations] = useState({});

  const [panel, setPanel] = useState("read"); // "read" | "decode" | "excavate"
  const [decodeKey, setDecodeKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState({ songs:true, memoir:false, archive:false });

  // Load persisted state
  useEffect(() => {
    (async () => {
      try {
        const [f, d, dc, ex] = await Promise.all([
          window.storage?.get("v-flagged"),
          window.storage?.get("v-dates"),
          window.storage?.get("v-decodes"),
          window.storage?.get("v-excavations"),
        ]);
        if (f?.value) setFlagged(JSON.parse(f.value));
        if (d?.value) setDates(JSON.parse(d.value));
        if (dc?.value) setDecodes(JSON.parse(dc.value));
        if (ex?.value) setExcavations(JSON.parse(ex.value));
      } catch(e) {}
    })();
  }, []);

  const persist = async (key, obj) => {
    try { await window.storage?.set(key, JSON.stringify(obj)); } catch(e) {}
  };

  const toggleFlag = async () => {
    if (!active) return;
    const next = { ...flagged, [active.id]: !flagged[active.id] };
    setFlagged(next);
    persist("v-flagged", next);
  };

  const saveDate = async (id, val) => {
    const next = { ...dates, [id]: val };
    setDates(next);
    persist("v-dates", next);
  };

  const runExcavation = async () => {
    if (!active) return;
    setLoading(true);
    const hasContent = active.content && !active.content.startsWith("[");
    const msg = hasContent
      ? `Piece titled "${active.title}" (${active.tag}):\n\n${active.content.slice(0,1800)}\n\nGenerate 3 excavation questions to surface the specific memory behind this piece.`
      : `A piece titled "${active.title}" (${active.tag}) written by someone processing addiction, TBI, father wounds, and identity reconstruction. Generate 3 excavation questions specific to the title.`;
    try {
      const result = await callAPI(SYS_EXCAVATION, msg);
      const next = { ...excavations, [active.id]: result };
      setExcavations(next);
      persist("v-excavations", next);
      setPanel("excavate");
    } catch(e) { alert("API error: " + e.message); }
    setLoading(false);
  };

  const runDecode = async () => {
    if (!active || !decodeKey.trim()) return;
    setLoading(true);
    const content = active.content && !active.content.startsWith("[") ? active.content : "[Lyrics not yet loaded — translation based on title and key only]";
    const msg = `PIECE: "${active.title}" (${active.tag})\n\nLYRICS/TEXT:\n${content.slice(0,2000)}\n\nPERSONAL KEY (provided by the author — what each coded term actually means):\n${decodeKey}\n\nTranslate this piece section by section into plain autobiography using only the key above.`;
    try {
      const result = await callAPI(SYS_DECODE, msg);
      const next = { ...decodes, [active.id]: { key: decodeKey, result } };
      setDecodes(next);
      persist("v-decodes", next);
      setPanel("read");
    } catch(e) { alert("API error: " + e.message); }
    setLoading(false);
  };

  const selectItem = (item) => {
    setActive(item);
    setPanel("read");
    if (decodes[item.id]) setDecodeKey(decodes[item.id].key);
    else setDecodeKey("");
  };

  const filter = (items) => query ? items.filter(i => i.title.toLowerCase().includes(query.toLowerCase())) : items;
  const flagCount = Object.values(flagged).filter(Boolean).length;
  const decodeCount = Object.keys(decodes).length;

  const Rail = ({ label, key2, items, color }) => (
    <div style={{ borderBottom:`1px solid ${C.border}` }}>
      <div
        onClick={() => setOpen(o => ({...o,[key2]:!o[key2]}))}
        style={{ padding:"8px 14px 4px", fontFamily:"monospace", fontSize:10, letterSpacing:".14em",
          textTransform:"uppercase", color, cursor:"pointer", display:"flex", justifyContent:"space-between", userSelect:"none" }}
      >
        <span>{label}</span>
        <span style={{color:C.muted}}>{filter(items).length} {open[key2]?"▾":"▸"}</span>
      </div>
      {open[key2] && filter(items).map(item => {
        const isActive = active?.id === item.id;
        const tc = TAG_COLOR[item.tag] || "#888";
        return (
          <div key={item.id} onClick={() => selectItem(item)}
            style={{ padding:"5px 14px 5px 20px", fontSize:12.5, cursor:"pointer", lineHeight:1.35,
              background: isActive ? "#1a1810" : "transparent",
              color: isActive ? C.text : C.dim,
              borderLeft: `2px solid ${isActive ? tc : "transparent"}`,
              display:"flex", alignItems:"center", gap:5 }}
          >
            {flagged[item.id] && <span style={{color:C.gold,fontSize:9}}>◆</span>}
            {decodes[item.id] && <span style={{color:C.purple,fontSize:9}}>⊕</span>}
            <span style={{flex:1}}>{item.title}</span>
            {dates[item.id] && <span style={{fontFamily:"monospace",fontSize:9,color:C.muted}}>{dates[item.id]}</span>}
          </div>
        );
      })}
    </div>
  );

  const Btn = ({ children, color, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled || loading}
      style={{ fontFamily:"monospace", fontSize:10, letterSpacing:".1em", textTransform:"uppercase",
        padding:"5px 12px", border:`1px solid ${color}`, cursor:"pointer", background:"transparent",
        color, opacity: (disabled || loading) ? .4 : 1, transition:"opacity .15s" }}
    >{children}</button>
  );

  return (
    <div style={{ display:"flex", height:"100vh", background:C.bg, color:C.text, fontFamily:"Georgia, serif", overflow:"hidden" }}>

      {/* RAIL */}
      <div style={{ width:230, minWidth:230, background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"14px 14px 8px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ fontFamily:"monospace", fontSize:10, letterSpacing:".18em", textTransform:"uppercase", color:C.gold, marginBottom:3 }}>The Vault</div>
          <div style={{ fontFamily:"monospace", fontSize:9, color:C.muted, lineHeight:1.6 }}>
            {ALL_ITEMS.length} pieces · {flagCount} flagged · {decodeCount} decoded
          </div>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="search..."
            style={{ marginTop:7, background:"#1a1810", border:`1px solid ${C.border2}`, color:C.text,
              fontFamily:"monospace", fontSize:11, padding:"5px 8px", outline:"none", width:"100%", boxSizing:"border-box" }} />
        </div>
        <div style={{ overflowY:"auto", flex:1 }}>
          <Rail label="Songs & Lyrics" key2="songs" items={SONGS} color={C.gold} />
          <Rail label="Memoir Scenes" key2="memoir" items={MEMOIR_DOCS} color={C.teal} />
          <Rail label="Archive & Clinical" key2="archive" items={ARCHIVE_DOCS} color={C.rose} />
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* TOP BAR */}
        {active && (
          <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"8px 18px",
            display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            <span style={{ fontFamily:"monospace", fontSize:9, letterSpacing:".14em", textTransform:"uppercase",
              padding:"2px 7px", border:`1px solid ${TAG_COLOR[active.tag]}`, color:TAG_COLOR[active.tag] }}>{active.tag}</span>
            <span style={{ flex:1, fontSize:14.5 }}>{active.title}</span>

            {/* Date field */}
            <input
              value={dates[active.id] || ""}
              onChange={e => saveDate(active.id, e.target.value)}
              placeholder="date written..."
              title="Enter when this was written (year, period, etc.)"
              style={{ background:"#1a1810", border:`1px solid ${C.border2}`, color:C.dim,
                fontFamily:"monospace", fontSize:10, padding:"4px 8px", outline:"none", width:120 }} />

            <Btn color={flagged[active.id] ? C.gold : C.muted} onClick={toggleFlag}>
              {flagged[active.id] ? "◆ flagged" : "◇ flag"}
            </Btn>
            <Btn color={C.purple} onClick={() => setPanel(panel==="decode" ? "read" : "decode")}>
              ⊕ decode
            </Btn>
            <Btn color={C.teal} onClick={runExcavation} disabled={loading}>
              {loading ? "..." : "⟡ excavate"}
            </Btn>
          </div>
        )}

        {/* PANEL TABS */}
        {(excavations[active?.id] || decodes[active?.id]) && (
          <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 18px",
            display:"flex", gap:0 }}>
            {["read","decode","excavate"].map(p => (
              <button key={p} onClick={() => setPanel(p)}
                style={{ fontFamily:"monospace", fontSize:9, letterSpacing:".12em", textTransform:"uppercase",
                  padding:"7px 14px", border:"none", background:"transparent", cursor:"pointer",
                  color: panel===p ? C.text : C.muted,
                  borderBottom: panel===p ? `2px solid ${C.gold}` : "2px solid transparent" }}
              >{p}{p==="decode" && decodes[active?.id] ? " ●" : ""}{p==="excavate" && excavations[active?.id] ? " ●" : ""}</button>
            ))}
          </div>
        )}

        {/* CONTENT AREA */}
        <div style={{ flex:1, overflow:"auto", padding:"24px 32px 60px" }}>
          <div style={{ maxWidth:660 }}>

            {/* READ PANEL */}
            {panel === "read" && active && (
              <>
                {active.content && !active.content.startsWith("[")
                  ? <pre style={{ whiteSpace:"pre-wrap", fontFamily:"Georgia,serif", fontSize:15, lineHeight:1.85, color:"#d0c8b8", margin:0 }}>{active.content}</pre>
                  : active.content?.startsWith("[")
                    ? <div style={{ fontFamily:"monospace", fontSize:12, color:C.rose, padding:"12px 16px", border:`1px solid ${C.border2}`, background:C.surface }}>{active.content}</div>
                    : <div style={{ fontFamily:"monospace", fontSize:12, color:C.muted, padding:"12px 16px", border:`1px dashed ${C.border}` }}>
                        Content not yet loaded.<br/>
                        <span style={{color:C.dim}}>Use ⟡ Excavate to generate questions from the title, or ⊕ Decode to translate.</span>
                      </div>
                }
                {decodes[active.id] && (
                  <div style={{ marginTop:24, padding:"14px 18px", background:C.surface, border:`1px solid ${C.border2}`, borderLeft:`3px solid ${C.purple}` }}>
                    <div style={{ fontFamily:"monospace", fontSize:9, letterSpacing:".14em", textTransform:"uppercase", color:C.purple, marginBottom:8 }}>Decoded version exists — click "decode" tab</div>
                  </div>
                )}
              </>
            )}

            {/* DECODE PANEL */}
            {panel === "decode" && active && (
              <div>
                <div style={{ fontFamily:"monospace", fontSize:10, letterSpacing:".14em", textTransform:"uppercase", color:C.purple, marginBottom:12 }}>
                  ⊕ Personal Decode — {active.title}
                </div>
                <div style={{ fontSize:12, color:C.dim, marginBottom:10, lineHeight:1.6 }}>
                  Enter the key: who are the nicknames, what do the metaphors mean, what events are referenced. Plain language. One entry per line works fine.
                </div>
                <textarea
                  value={decodeKey}
                  onChange={e => setDecodeKey(e.target.value)}
                  placeholder={`Examples:\nD = Dre (Kinsley's mom)\nMichael = abusive partner (she/her, not he)\nglory hole = AA meetings\nfortress = sobriety/stability\nrummage sale = my family after the OD\n\nWrite whatever you know. More is better.`}
                  style={{ width:"100%", minHeight:180, background:"#0a0908", border:`1px solid ${C.border2}`,
                    color:C.text, fontFamily:"monospace", fontSize:12, padding:"12px", outline:"none",
                    resize:"vertical", lineHeight:1.7, boxSizing:"border-box" }}
                />
                <div style={{ marginTop:10, display:"flex", gap:10, alignItems:"center" }}>
                  <Btn color={C.purple} onClick={runDecode} disabled={!decodeKey.trim() || loading}>
                    {loading ? "Decoding..." : "Run Decode →"}
                  </Btn>
                  {decodes[active.id] && <span style={{fontFamily:"monospace",fontSize:9,color:C.muted}}>Previous decode saved — running again will overwrite</span>}
                </div>

                {decodes[active.id]?.result && (
                  <div style={{ marginTop:24 }}>
                    <div style={{ fontFamily:"monospace", fontSize:9, letterSpacing:".14em", textTransform:"uppercase", color:C.purple, marginBottom:10 }}>Decoded</div>
                    <pre style={{ whiteSpace:"pre-wrap", fontFamily:"Georgia,serif", fontSize:14, lineHeight:1.8, color:"#c8c0b0", background:C.surface, padding:"16px 20px", border:`1px solid ${C.border2}` }}>
                      {decodes[active.id].result}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* EXCAVATION PANEL */}
            {panel === "excavate" && excavations[active?.id] && (
              <div>
                <div style={{ fontFamily:"monospace", fontSize:10, letterSpacing:".14em", textTransform:"uppercase", color:C.teal, marginBottom:12 }}>
                  ⟡ Excavation Questions — {active?.title}
                </div>
                <pre style={{ whiteSpace:"pre-wrap", fontFamily:"Georgia,serif", fontSize:14.5, lineHeight:1.85,
                  color:"#b8b0a0", background:C.surface, padding:"16px 20px", border:`1px solid ${C.border2}` }}>
                  {excavations[active.id]}
                </pre>
                <div style={{ marginTop:14 }}>
                  <Btn color={C.teal} onClick={runExcavation} disabled={loading}>Regenerate</Btn>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
