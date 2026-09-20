import { useState, useEffect, useRef, useCallback, useId, createContext, useContext } from "react";

// ─── THEMES ──────────────────────────────────────────────────────────────────
const THEMES = {
  "Carbon Noir": {
    bg:"#080604",bgMid:"#100d08",surface:"#1a1510",surfaceHi:"#231c11",
    border:"#2e2214",borderLit:"#c47c30",
    accent:"#d4884a",accent2:"#b86828",warm:"#e8a450",danger:"#d44a3a",blue:"#4a9cc4",
    text:"#ece0ca",textSec:"#b89a78",textMuted:"#7a6848",
    gridColor:"rgba(212,136,74,0.05)",orb1:"rgba(196,124,48,0.10)",orb2:"rgba(232,164,80,0.06)",
  },
  "Blueprint": {
    bg:"#030811",bgMid:"#05101c",surface:"#081828",surfaceHi:"#0c2038",
    border:"#102840",borderLit:"#2484b8",
    accent:"#34a4d8",accent2:"#1878b0",warm:"#74c4ec",danger:"#d84840",blue:"#44ecc0",
    text:"#c4dcf0",textSec:"#84acc4",textMuted:"#486880",
    gridColor:"rgba(52,164,216,0.06)",orb1:"rgba(24,120,176,0.12)",orb2:"rgba(52,164,216,0.07)",
  },
  "Midnight Stack": {
    bg:"#020704",bgMid:"#041008",surface:"#07180c",surfaceHi:"#0b2212",
    border:"#102c18",borderLit:"#24b030",
    accent:"#38cc44",accent2:"#24a030",warm:"#84e890",danger:"#cc3c3c",blue:"#44a0cc",
    text:"#c4e8c8",textSec:"#84b888",textMuted:"#446848",
    gridColor:"rgba(56,204,68,0.05)",orb1:"rgba(36,160,48,0.11)",orb2:"rgba(56,204,68,0.06)",
  },
};

const ThemeCtx = createContext(null);
const useTheme = () => useContext(ThemeCtx);

// ─── DATA ────────────────────────────────────────────────────────────────────
const ARCS = [
  { id:"diagnostic",name:"The Diagnostic Instinct",sym:"⬡",colorKey:"accent",
    tagline:"Reading rooms. Reading processes. Reading systems. Reading music.",
    badges:["Spine","Through-Line","Confirmed"],
    explorer:"Kyle has one skill that survived every version of him: the ability to read a room. At O'Toole's, that meant knowing which customer needed distance. In QC, spotting process failures before they compounded. In engineering, diagnosing system failures the same way. On the piano — he spent a year learning Nuvole Bianche by Ludovico Einaudi without reading a single note. Never knew the key names. Just memorized the shape: the order, the arpeggios, where the syncopation falls. Pattern before content. The book is about how that instinct survived a brain injury — and became the thread holding the reconstruction together.",
    poweruser:"The diagnostic instinct connects four domains (hospitality → QC → engineering → music) through a common pattern: recognition under uncertainty, without declarative knowledge. The piano example is the clearest proof of the mechanism — the medium was completely foreign, the storage was irrelevant, the processor ran the same way. Post-injury, this became explicit rather than implicit. The eval data supports it: Processing Speed 99th percentile, Recall Memory 12th. The processor survived; the storage didn't.",
    admin:"Every claim about rebuilding depends on this through-line being legible across the bartender → engineer arc. The piano beat is available as a non-technical concrete example if a scene needs it. Any scene that doesn't connect to it is a candidate for cutting. Test: can a reader trace the same cognitive pattern through O'Toole's, QC gap detection, the card table build, and Nuvole Bianche?",
    useCases:["O'Toole's customer reads","QC process gap detection","Engineering system diagnosis","Piano — Nuvole Bianche by shape not notes","Memoir self-diagnosis"],
    mockInput:"How does the diagnostic instinct survive cognitive disruption?",
    mockOutput:`The instinct doesn't live in explicit memory.

Processing Speed: 99th percentile.
Recall Memory: 12th percentile.

The hardware that runs pattern recognition
isn't the same hardware that stores the results.

When the storage got damaged, the processor kept running.

At O'Toole's I could read who was about to get cut off
before they knew it themselves.
After the injury, I couldn't tell you what I had for breakfast.
But I could still walk into a failing deployment
and find the wrong assumption in under an hour.

That's a kind of knowing that lives below the level
where the damage happened.

The book isn't about how I got the ability back.
It's about how I figured out that's what I had.`,
  },
  { id:"otooles",name:"O'Toole's",sym:"≡",colorKey:"warm",
    tagline:"The origin. Before the break. Five scene seeds confirmed.",
    badges:["Part I","Excavated","5 Seeds"],
    explorer:"O'Toole's is where the book begins and the diagnostic instinct first gets named. Kyle worked there at 19 — or 21, or somewhere between. That uncertainty IS the thesis. The scenes are about how dependency starts not with pressure but with permission: 'You don't have to.' And a late-night walk, age 17, counting streetlights.",
    poweruser:"Five confirmed scene seeds: (1) Age oscillation — 19 or 21, corrected three times, uncertainty is thesis. (2) 'Relief is the most addictive feeling of all' — dependency origin line, survives voice test. (3) Late-night walk — counting streetlights at 17, NEEDS VERIFICATION as real vs AI extrapolation. (4) Couch permission scene — 'You don't have to,' emotional architecture confirmed, specific details unverified. (5) Monitor reflection — demoted from prologue to mid-book.",
    admin:"Scene status: Seeds 1-2 confirmed, deployable. Seeds 3-4 emotionally true, need verification before draft. Seed 5 repositioned — do not use as chapter opener. None are interchangeable; each maps to a distinct narrative function.",
    useCases:["Part I opening sequence","Dependency origin","Diagnostic instinct introduction","Memory unreliability motif"],
    mockInput:"How old was Kyle when he started at O'Toole's?",
    mockOutput:`He says 19.
Then corrects to 21.
Then: "I don't know. Somewhere in there."

That's not a mistake in the manuscript.
That's the manuscript.

The age oscillation is the first evidence.
Memory doesn't degrade gracefully.
It doesn't give you an error code.
One day you reach for something that should be there
and it isn't.

Or worse: you find something, it's wrong,
and you don't know it's wrong
until someone asks a second time.

The uncertainty IS the thesis.`,
  },
  { id:"rupture",name:"The Rupture",sym:"∅",colorKey:"danger",
    tagline:"Hardware failure. The recursive trap.",
    badges:["Part II","Core","Reframed Apr 2026"],
    explorer:"The break wasn't one event. Addiction caused the brain injury, the injury made escape harder, which deepened the addiction. Heroin OD September 2021. Hypoxia event the summer before. The $50K settlement spent in three months. No bottom — just a floor that kept lowering.",
    poweruser:"Reframe confirmed April 2026: Brain injury caused BY addiction (hypoxia from OD), not external trauma. Recursive trap: addiction → injury → harder to escape → deeper addiction. Amen eval date conflict: p2 says 'summer 2020,' p3+physician says 'Oct 2021.' DO NOT RESOLVE — the physician's own record has the same memory confusion as the patient. Most powerful structural device.",
    admin:"The rupture is not the book's climax — it's its premise. The clinical record's internal date conflict validates the unreliable narrator by demonstrating the unreliability is documented at the source.",
    useCases:["Part II opening","Recursive trap argument","Clinical record as evidence","Memory confusion as theme"],
    mockInput:"What caused the brain injury?",
    mockOutput:`Not what you'd expect.

Not a car accident — though there was a car.
Not a fall. Not a fight.

The injury came from the thing he was using
to manage the pain he thought was the problem.

Addiction → hypoxia → reduced cognitive function
→ harder to stop → more dependency.

The clinical record says "summer 2020" on page two.
Page three says "October 2021."

The physician's own notes have the same confusion
as the patient.

That's not an error to correct.
That's evidence.

The unreliable narrator isn't a literary device.
It's the diagnosis.`,
  },
  { id:"cardtable",name:"The Card Table",sym:"□",colorKey:"blue",
    tagline:"Crisis → Bear → the work → website → Chaos Club.",
    badges:["Ch 11","Locked Apr 2026","Anchor Scene"],
    explorer:"The card table is where everything started. Not a desk — a folding card table. Kyle built Bear's website on it. Not correctly. Obviously-wrong-way-to-do-it energy. The screenshot method he used to teach himself is where the entire self-teaching arc begins. At 1:30am, he took a photo. That photo is the chapter's anchor image.",
    poweruser:"Sequence locked April 2026: Phillis arranges Sedona → Bear → surrender as strategy ('I was wrong about those being the answer, let's try the opposite because I seriously have nothing fucking left') → card table website build + associate's degree simultaneously → screenshot method → learning cascade → Chaos Club. The 1:30am photo exists as a physical artifact.",
    admin:"Chapter 11 is the hinge of the entire book. The card table must stay physical, specific, real — never metaphorical. 'Obviously wrong way to do it' energy is essential: this is not a competence story. The screenshot method isn't impressive — it's necessary.",
    useCases:["Chapter 11 anchor scene","Self-teaching origin","Bear/Sedona connection","Chaos Club genesis"],
    mockInput:"Describe the card table scene.",
    mockOutput:`1:30am.

The table is a folding card table.
Not a desk. Not a setup.
A card table — the kind for poker or Thanksgiving overflow.

The screenshot method is:
take a picture of what you're looking at,
open it in another window,
copy what you see.

It's obviously the wrong way to do it.
He knows it's the wrong way.
He does it anyway because it's the only way
his brain, right now, at 1:30am, can move forward.

This is not a productivity story.
This is a prosthetics story.

The 1:30am photo exists.
In it you can see the tools
before he knew they were tools.`,
  },
  { id:"arsenal",name:"The Arsenal",sym:"⟁",colorKey:"accent",
    tagline:"Tools as prosthetics. Not productivity — survival.",
    badges:["Ch 8","Session 3 Pending","Cognitive Scaffold"],
    explorer:"Kyle uses tools the way other people use memory. Not because he's organized — because he can't afford not to be. The ~30 tools he actually uses are prosthetics for a brain that can't be trusted to store information. Session 3 (Tool Archaeology) has not yet been done.",
    poweruser:"Cognitive profile: Processing Speed 99th percentile, Recall Memory 12th percentile. Tools fill the gap between a fast processor and damaged storage. ~30 tools hands-on; 240+ total catalogued (catalogued ≠ mastered). Session 3 (Tool Archaeology) — NOT completed as of April 2026.",
    admin:"The arsenal chapter must not become a tool list. Each tool needs a cognitive function it serves. The chapter fails if a reader thinks 'impressive toolset.' It succeeds if they think 'oh — that's what the tools are for.'",
    useCases:["Chapter 8 core","Cognitive prosthetics argument","Tool archaeology excavation","Counter to productivity framing"],
    mockInput:"Why does Kyle use so many tools?",
    mockOutput:`Not because he's organized.

"Not because I'm organized. Because I can't afford not to be."

Processing Speed: 99th percentile.
Recall Memory: 12th percentile.

The engine works. The storage doesn't.

Every tool in the arsenal is filling a gap
between what the brain generates
and what the brain can hold onto.

n8n isn't automation. It's memory offload.
Notion isn't a wiki. It's an external hippocampus.
GitHub isn't version control. It's a record of decisions
made by a previous version of him
that the current version can't access any other way.

The tools aren't impressive.
They're load-bearing.`,
  },
  { id:"thefive",name:"The Five",sym:"∷",colorKey:"warm",
    tagline:"Settlement money. Trump Tower. The photo with three in it.",
    badges:["Part IV","Excavating","Dave Datt"],
    explorer:"Kyle remembered five people in a photo. Uploaded it — three were in it. Matt Horne (left), Tom Ropel (right, 'an entire chapter'), Dave Datt (died of a brain aneurysm), and Ryan (forgotten until the count forced retrieval — now a counselor at CLC). Kyle paid for the Trump Tower weekend. All of it.",
    poweruser:"Memory mechanics April 2026: Kyle said five. Photo showed three. Ryan surfaced by associative chain: count → gap → name → grandmother → blue kitchen → empanadas → furniture protectors → sofa. Memory retrieves by chain, not direct access. Emotional truth preceded factual truth. $50K settlement: hit by car 2014/15 on Xanax, spent in 3-4 months.",
    admin:"Four characters, four endings: Matt = reconnected. Tom = reconnected, 'an entire chapter' — NOT EXCAVATED. Dave = dead (brain aneurysm, funeral attended, year unknown — NEEDS EXCAVATION). Ryan = lost contact, counselor at CLC, outreach ignored. The cost ledger of the chaos years.",
    useCases:["Settlement money arc","Memory mechanics demonstration","Dave Datt eulogy scene","Ryan/CLC thread"],
    mockInput:"How many people were in the Trump Tower photo?",
    mockOutput:`Kyle said five.

The weekend at Trump Tower — he paid for everything.
Matt. Tom. Dave. Ryan. And Kyle.

Then he uploaded the photo.

Three.

Count (4, not 5) → gap → who's missing →
association → Puerto Rican grandmother → blue kitchen →
empanadas (rice and beef) → gutters → the sofa
facing at an angle in a one-person apartment.

Ryan surfaced not by name
but by a blue kitchen wall
and furniture protectors on a couch
that had never seen company.

That's not a memory failure.
That's how memory actually works.`,
  },
  { id:"letter",name:"The Letter",sym:"◇",colorKey:"warm",
    tagline:"A letter to Kinsley. The frame. Friday at 3:25pm.",
    badges:["Frame","Kinsley","Epilogue"],
    explorer:"The whole book is a letter to Kinsley. Not a recovery story for her — a construction story. So she understands not what her father overcame, but what he built. The Sunday goodbye ('shoes on, kiddo') is not grief — it's a specific kind of system failure that deconstructs every week.",
    poweruser:"Kinsley is the memoir's reader and emotional north star — not a developed character. The Sunday goodbye: 15 minutes between 'shoes on, kiddo' and the rearview mirror as system decompilation. Friday pickup: 3:25pm, Kyle leaves work at 1pm. Final question: 'What does Kinsley need to know that Kyle couldn't have known during the events?'",
    admin:"Every chapter must pass the Kinsley test — would a 20-year-old Kinsley understand what it cost to build the person who shows up at 3:25pm every Friday? The letter frame is architecture, not sentimentality. The epilogue ('The Distinction') completes the frame.",
    useCases:["Frame device","Epilogue anchor","Sunday goodbye scene","Stakes-setting for all scenes"],
    mockInput:"Who is the book written for?",
    mockOutput:`Kinsley.

Not the version of her who exists now —
though that version is why Friday matters,
why 3:25pm is non-negotiable.

For the version who will read it later.

The book isn't:
Here is what I overcame.

The book is:
Here is what I built so you would have a father.

There was no "what he was" worth returning to.

So instead:
Here is the card table.
Here is the screenshot method.
Here is what the diagnostic instinct is called
now that it has a name.

That's the letter.`,
  },
  { id:"chaosclub",name:"Chaos Club Co.",sym:"◈",colorKey:"blue",
    tagline:"The memoir's artifact. The platform as the argument deployed.",
    badges:["Ch 12","Platform","Same Project"],
    explorer:"Chaos Club isn't separate from Kyle's story — it's an artifact of it. Crisis → Bear → the work → website → learning cascade → Chaos Club. A mental health platform built by someone in the middle of their own mental health story. The book and the business may be the same project.",
    poweruser:"Platform status: Firestore schema finalized (10 collections), R2 signed-URL premium gating, Stripe webhook idempotency, soft-delete. Base44 Chaos Club app currently 0 data. The platform and memoir share an argument: mental health infrastructure for people who have never had access to one.",
    admin:"Chaos Club is simultaneously Chapter 12's subject and the book's living proof-of-concept. If the memoir succeeds, it creates the user base. If the platform launches, it demonstrates the memoir's argument. They are the same thesis deployed in two formats.",
    useCases:["Chapter 12","Book-platform connection","15 brand pillars","Mental health infrastructure argument"],
    mockInput:"What is Chaos Club and why does it appear in a memoir?",
    mockOutput:`Because it's the same project.

Card table → screenshot method → learning cascade →
FlashFusion → Chaos Club.

The line is unbroken.

He didn't build it because he recovered.
He built it because he didn't —
and he needed somewhere to put that.

"Welcome to the Chaos Club:
where no one has to pretend —
but everyone understands."

Same author. Same argument. Different format.

That's why Chapter 12 exists.`,
  },
];

const STEPS = [
  { num:"01",title:"Orient",
    explorer:"Start every session by getting your bearings. Where are we in the book? Which chapter? What's the goal — digging for raw material, drafting prose, or revising what exists?",
    poweruser:"Session init: (1) current phase (excavation/drafting/revision), (2) chapter/section target, (3) last session output status, (4) any new memories since last session.",
    admin:"Sessions without orientation drift into scope-bleed. Chapter status must be explicitly confirmed before work begins. Unresolved threads take priority unless Kyle overrides.",
    action:"$ memoir orient\n> Phase: Excavation\n> Target: Chapter 11 — The Card Table\n> Status: Anchor scene LOCKED Apr 2026\n> New material since last session: [none/describe]",
    tip:"If Kyle says 'just keep going,' prompt for the current chapter anyway. Scope drift is the most common session failure mode.",
  },
  { num:"02",title:"Surface",
    explorer:"Before writing anything, pull out raw material. Not themes — specifics. What did the room look like? What was the temperature? What did Kyle notice first? Surface before shaping.",
    poweruser:"Raw material extraction: (1) sensory details before meaning, (2) what Kyle doesn't remember as much as what he does, (3) contradictions held not resolved, (4) specific over universal, (5) never mark as done unless Kyle confirms.",
    admin:"Content integrity gate: no prose generation from project instructions alone. Every claim verified against ground truth before drafting. Unverifiable claims → ask before writing. Non-negotiable.",
    action:"$ memoir surface --chapter=11\n> Prompt: 'What did the card table look like at 1:30am?'\n> Capture: [Kyle's answer verbatim]\n> Flag: [anything that needs verification]",
    tip:"Ask about what Kyle DOESN'T remember. Gaps are as important as recalls. Memory absence is thematic material, not a writing problem.",
  },
  { num:"03",title:"Excavate",
    explorer:"Once the surface details are out, go deeper. Follow the associative chains. What does remembering the table lead to? Follow the chain, don't force the recall.",
    poweruser:"Memory retrieves by associative chain, not direct access. Prompt chains rather than direct questions. Use the Ryan example: count → gap → name → grandmother → kitchen → empanadas → sofa. Emotional truth precedes factual truth — record both, label the difference.",
    admin:"Record raw material without editorializing. Contradictions are content. Date conflicts are narrative devices. Certainty level is part of the evidence.",
    action:"$ memoir excavate --chain\n> Seed: 'card table'\n> Chain: table → lamp? → cups? → what was on screen? →\n         sound? → time? → what came next?\n> Capture: [follow the chain verbatim]",
    tip:"If Kyle stops and says 'I don't know,' that's a real answer. Mark it: MEMORY GAP at [scene][moment]. Don't skip past it.",
  },
  { num:"04",title:"Shape",
    explorer:"Take the raw material and start building structure. Skeleton first. Then flesh it out with sensory details. Then a polish pass for voice. Draft in passes — never try to write the finished version first.",
    poweruser:"Drafting protocol: (1) skeleton — what happens, in order, no prose, (2) flesh — sensory details, direct quotes, specific objects, (3) voice pass — Kyle's register (bartender who learned to code, engineering metaphors, profanity on the beat, no epiphanies). Flag when prose smooths rough edges.",
    admin:"Voice governance: never use 'and that's when I realized,' 'looking back I can see,' 'rock bottom became the foundation,' or anything a LinkedIn influencer would post. No epiphanies. Incremental recalibrations only.",
    action:"$ memoir draft --pass=skeleton --chapter=11\n> SKELETON:\n> [1] Card table. 1:30am.\n> [2] Screenshot method. Obviously wrong.\n> [3] Does it anyway.\n> [4] Photo of the table.\n> [5] This is where it starts.",
    tip:"Never write the finished version in the first pass. Skeleton → flesh → polish. Each pass is a separate session.",
  },
  { num:"05",title:"Verify",
    explorer:"Before treating anything as done, check it. Is this actually something Kyle experienced, or something that sounds true? Is the voice right? Does it connect to the diagnostic instinct? Would it pass the Kinsley test?",
    poweruser:"Verification gate: (1) Ground truth — every specific claim traceable to confirmed source, (2) Voice — no self-help patterns, (3) Spine — connection to diagnostic instinct legible, (4) Kinsley test — would a 20-year-old understand what this cost? Status: CONFIRMED / NEEDS VERIFICATION / UNVERIFIABLE.",
    admin:"Drafts are marked DRAFT until Kyle confirms. Three states: discussed (session), planned (approved direction), executed (Kyle confirmed). Never conflate them.",
    action:"$ memoir verify --chapter=11\n> Ground truth: CONFIRMED (card table, 1:30am photo exists)\n> Voice: PASS (no self-help patterns)\n> Spine: PASS (connects to screenshot → learning arc)\n> Kinsley: PASS (stakes legible)\n> Status: DRAFT → pending Kyle confirmation",
    tip:"The verify step is epistemological, not editorial. Is this true? Is this verified? Is this Kyle's actual experience or a plausible reconstruction?",
  },
];

const CHECKLIST_ITEMS = [
  { id:"c1",priority:"critical",title:"O'Toole's Seeds 3 & 4 — Verification Required",owner:"Kyle",done:false,note:"Seed 3 (streetlights walk): real memory or AI extrapolation? Seed 4 (couch): specific person confirmed?" },
  { id:"c2",priority:"critical",title:"Amen Eval Date Conflict — Document, Don't Resolve",owner:"Claude",done:true,note:"p2 says summer 2020, p3+physician says Oct 2021. Confirmed narratively useful. DO NOT resolve prematurely." },
  { id:"c3",priority:"critical",title:"Session 3: Tool Archaeology — NOT STARTED",owner:"Kyle+Claude",done:false,note:"Chapter 8 (The Arsenal) needs its own excavation. Maps cognitive gaps to specific tools. Not started Apr 2026." },
  { id:"h1",priority:"high",title:"Tom Ropel — 'An Entire Chapter By Itself'",owner:"Kyle",done:false,note:"Best friend growing up. What happened? Married, two kids, Oliver at birthday party. NOT YET EXCAVATED." },
  { id:"h2",priority:"high",title:"Dave Datt Funeral — Year, Scene, Kyle's State",owner:"Kyle",done:false,note:"Died of brain aneurysm. Kyle attended funeral. What year? What was Kyle like walking in? Parallel failure arc." },
  { id:"h3",priority:"high",title:"NIU Expulsion 2016 — Full Arc",owner:"Kyle",done:false,note:"Kicked out for not keeping grades up. What was Kyle doing? What was the spiral?" },
  { id:"h4",priority:"high",title:"Card Table Sequence — Anchor Scene",owner:"Kyle+Claude",done:true,note:"LOCKED April 2026. Confirmed: Phillis → Sedona → Bear → card table → screenshot method → Chaos Club." },
  { id:"m1",priority:"medium",title:"$50K Spending Spree — Detail Pass",owner:"Kyle",done:false,note:"More detail on the 3-4 months. What was the car? When did Kyle realize the money was gone?" },
  { id:"m2",priority:"medium",title:"Ryan at CLC — The Unanswered Outreach",owner:"Kyle",done:false,note:"Ryan looked 'focused or something else.' Kyle reached out once, nothing back. Now a counselor at CLC." },
  { id:"m3",priority:"medium",title:"Rogers Behavioral Health — Summer 2020",owner:"Kyle",done:false,note:"1.5 months. What happened there? Specific scenes? What worked, what didn't?" },
  { id:"m4",priority:"medium",title:"Kinsley's 5th Birthday — Scene Detail Pass",owner:"Kyle",done:false,note:"More scene detail needed. Did Matt and Tom know what Kyle had been through?" },
  { id:"l1",priority:"low",title:"Song Archive Dating — 28 Songs Need Written-On Dates",owner:"Kyle",done:false,note:"28 unique songs post-dedup. No written-on dates. Structural problem for memoir use." },
  { id:"l2",priority:"low",title:"Journal Entries Batch — Incoming",owner:"Kyle",done:false,note:"Referenced, not yet received. Batch for memoir use when available." },
];


// ─── HELPERS ─────────────────────────────────────────────────────────────────
function Label({ children, color }) {
  const { theme } = useTheme();
  return <span style={{ fontFamily:"Orbitron,monospace",fontSize:9,letterSpacing:2,textTransform:"uppercase",fontWeight:600,color:color||theme.textMuted }}>{children}</span>;
}

function Term({ content, color, sx = {} }) {
  const { theme } = useTheme();
  const c = color || theme.accent;
  return (
    <div style={{ background:"#020508",border:`1px solid ${c}25`,borderRadius:8,padding:"14px 16px",position:"relative",overflow:"hidden",fontFamily:"'Fira Code',monospace",fontSize:12,color:theme.textSec,lineHeight:1.7,...sx }}>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${c}50,transparent)` }} />
      <pre style={{ margin:0,whiteSpace:"pre-wrap",wordBreak:"break-word" }}>{content}</pre>
    </div>
  );
}

// ─── ACCORDION ────────────────────────────────────────────────────────────────
function AccordionCard({ title, subtitle, icon, color, defaultOpen=false, badge, children, id:propId }) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(defaultOpen);
  const uid = useId();
  const panelId = propId ? `panel-${propId}` : `panel-${uid}`;
  const headId = propId ? `hdr-${propId}` : `hdr-${uid}`;
  const c = color || theme.accent;
  const toggle = () => setOpen(o => !o);

  return (
    <div style={{ border:`1px solid ${open?c+"60":theme.border}`,borderRadius:10,overflow:"hidden",transition:"border-color .22s,box-shadow .22s",boxShadow:open?`0 0 20px ${c}15`:"none",background:`linear-gradient(135deg,${theme.surface},${theme.bgMid})` }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=c+"80"; e.currentTarget.style.boxShadow=`0 0 18px ${c}20`; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=open?c+"60":theme.border; e.currentTarget.style.boxShadow=open?`0 0 20px ${c}15`:"none"; }}>
      <button id={headId} aria-expanded={open} aria-controls={panelId}
        onClick={toggle} onKeyDown={e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); toggle(); } }}
        style={{ width:"100%",display:"flex",alignItems:"center",gap:12,padding:"14px 18px",minHeight:52,background:"transparent",border:"none",cursor:"pointer",textAlign:"left",color:theme.text }}>
        {icon && <span style={{ width:32,height:32,borderRadius:8,background:`${c}20`,border:`1px solid ${c}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:c,flexShrink:0 }}>{icon}</span>}
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap" }}>
            <span style={{ fontFamily:"Barlow,sans-serif",fontWeight:600,fontSize:14,color:theme.text }}>{title}</span>
            {badge && <span style={{ fontFamily:"Orbitron,monospace",fontSize:8,letterSpacing:1.5,textTransform:"uppercase",fontWeight:700,color:c,background:`${c}18`,border:`1px solid ${c}40`,padding:"2px 7px",borderRadius:4 }}>{badge}</span>}
          </div>
          {subtitle && <div style={{ fontFamily:"Barlow,sans-serif",fontSize:12,color:theme.textMuted,marginTop:2 }}>{subtitle}</div>}
        </div>
        <span style={{ color:theme.textMuted,fontSize:16,flexShrink:0,transform:open?"rotate(180deg)":"rotate(0deg)",transition:"transform .22s",display:"inline-block" }}>▾</span>
      </button>
      <div id={panelId} role="region" aria-labelledby={headId} hidden={!open} style={{ borderTop:`1px solid ${theme.border}`,padding:"16px 18px" }}>
        {children}
      </div>
    </div>
  );
}

// ─── POP CARD ─────────────────────────────────────────────────────────────────
function PopCard({ arc, onClose, triggerRef }) {
  const { theme } = useTheme();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const uid = useId();
  const c = theme[arc.colorKey] || theme.accent;

  useEffect(() => {
    closeRef.current?.focus();
    return () => { triggerRef?.current?.focus(); };
  }, []);

  useEffect(() => {
    const trap = e => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "Tab" && dialogRef.current) {
        const els = Array.from(dialogRef.current.querySelectorAll('button,[href],input,[tabindex]:not([tabindex="-1"])')).filter(x=>!x.disabled);
        if (!els.length) return;
        const [first, last] = [els[0], els[els.length-1]];
        if (e.shiftKey) { if (document.activeElement===first) { e.preventDefault(); last.focus(); } }
        else { if (document.activeElement===last) { e.preventDefault(); first.focus(); } }
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [onClose]);

  return (
    <div onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}
      style={{ position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={`pc-${uid}`}
        style={{ background:theme.surface,border:`1px solid ${c}50`,borderRadius:14,maxWidth:680,width:"100%",maxHeight:"85vh",overflowY:"auto",boxShadow:`0 0 60px ${c}20,0 40px 80px rgba(0,0,0,.6)`,position:"relative" }}>
        <div style={{ height:3,background:`linear-gradient(90deg,transparent,${c},transparent)`,borderRadius:"14px 14px 0 0" }} />
        <div style={{ padding:"20px 24px 0" }}>
          <div style={{ display:"flex",alignItems:"flex-start",gap:14,marginBottom:12 }}>
            <div style={{ width:44,height:44,borderRadius:10,background:`${c}20`,border:`1px solid ${c}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:c,flexShrink:0 }}>{arc.sym}</div>
            <div style={{ flex:1 }}>
              <div id={`pc-${uid}`} style={{ fontFamily:"Orbitron,monospace",fontSize:15,fontWeight:700,color:theme.text }}>{arc.name}</div>
              <div style={{ fontFamily:"Barlow,sans-serif",fontSize:13,color:theme.textMuted,marginTop:4 }}>{arc.tagline}</div>
            </div>
            <button ref={closeRef} onClick={onClose} aria-label="Close"
              style={{ background:"transparent",border:`1px solid ${theme.border}`,borderRadius:6,color:theme.textMuted,cursor:"pointer",padding:"4px 10px",fontSize:14,minHeight:30,minWidth:44 }}>✕</button>
          </div>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:16 }}>
            {arc.badges.map(b=><span key={b} style={{ fontFamily:"Orbitron,monospace",fontSize:8,letterSpacing:1.5,textTransform:"uppercase",fontWeight:700,color:c,background:`${c}18`,border:`1px solid ${c}35`,padding:"3px 8px",borderRadius:4 }}>{b}</span>)}
          </div>
        </div>
        <div style={{ padding:"0 24px 24px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }} className="two-col">
          <div>
            <Label color={c}>Scene Arc</Label>
            <p style={{ fontFamily:"Barlow,sans-serif",fontSize:13,color:theme.textSec,lineHeight:1.7,marginTop:8,marginBottom:12 }}>{arc.explorer}</p>
            <Label color={c}>Use Cases</Label>
            <div style={{ marginTop:8,display:"flex",flexDirection:"column",gap:4 }}>
              {arc.useCases.map(u=><div key={u} style={{ display:"flex",alignItems:"center",gap:8,fontFamily:"Barlow,sans-serif",fontSize:12,color:theme.textSec }}><span style={{ color:c,fontSize:8 }}>▶</span>{u}</div>)}
            </div>
          </div>
          <div>
            <Label color={c}>Sample Output</Label>
            <Term content={arc.mockOutput} color={c} sx={{ marginTop:8,fontSize:11,lineHeight:1.65 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS DRAWER ──────────────────────────────────────────────────────────
function SettingsDrawer({ settings, setSettings, onClose }) {
  const { theme } = useTheme();
  const [showKey, setShowKey] = useState(false);
  const uid = useId();
  const upd = (k,v) => setSettings(s=>({...s,[k]:v}));

  useEffect(() => {
    const h = e => { if(e.key==="Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:800,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(6px)" }} />
      <div role="dialog" aria-modal="true" aria-label="Settings"
        style={{ position:"fixed",top:0,right:0,bottom:0,zIndex:900,width:"min(100%,340px)",height:"100vh",overflowY:"auto",background:theme.surface,borderLeft:`1px solid ${theme.border}`,padding:24,display:"flex",flexDirection:"column",gap:20 }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <Label color={theme.accent}>Settings</Label>
          <button onClick={onClose} aria-label="Close settings" style={{ background:"transparent",border:`1px solid ${theme.border}`,borderRadius:6,color:theme.textMuted,cursor:"pointer",padding:"4px 10px",fontSize:13,minHeight:30,minWidth:44 }}>✕</button>
        </div>
        <fieldset style={{ border:`1px solid ${theme.border}`,borderRadius:8,padding:"12px 14px" }}>
          <legend style={{ fontFamily:"Orbitron",fontSize:9,letterSpacing:2,color:theme.textMuted,padding:"0 4px" }}>THEME</legend>
          {Object.keys(THEMES).map(name=>(
            <label key={name} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8,cursor:"pointer",fontFamily:"Barlow,sans-serif",fontSize:13,color:theme.textSec }}>
              <input type="radio" name={`th-${uid}`} checked={settings.theme===name} onChange={()=>upd("theme",name)} style={{ cursor:"pointer" }} />
              <span style={{ width:14,height:14,borderRadius:3,background:THEMES[name].accent,display:"inline-block",border:`1px solid ${THEMES[name].borderLit}40` }} />
              {name}
            </label>
          ))}
        </fieldset>
        <fieldset style={{ border:`1px solid ${theme.border}`,borderRadius:8,padding:"12px 14px" }}>
          <legend style={{ fontFamily:"Orbitron",fontSize:9,letterSpacing:2,color:theme.textMuted,padding:"0 4px" }}>PERSONA</legend>
          {[["explorer","Explorer"],["poweruser","Power User"],["admin","Admin"]].map(([v,l])=>(
            <label key={v} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8,cursor:"pointer",fontFamily:"Barlow,sans-serif",fontSize:13,color:theme.textSec }}>
              <input type="radio" name={`ps-${uid}`} checked={settings.persona===v} onChange={()=>upd("persona",v)} style={{ cursor:"pointer" }} />{l}
            </label>
          ))}
        </fieldset>
        <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
          <label htmlFor={`ak-${uid}`} style={{ fontFamily:"Orbitron",fontSize:9,letterSpacing:2,color:theme.textMuted }}>API KEY (SESSION ONLY)</label>
          <div style={{ display:"flex",gap:6 }}>
            <input id={`ak-${uid}`} type={showKey?"text":"password"} value={settings.apiKey} onChange={e=>upd("apiKey",e.target.value)} placeholder="sk-ant-..."
              style={{ flex:1,background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:6,padding:"8px 10px",color:theme.text,fontFamily:"Fira Code,monospace",fontSize:11,outline:"none" }} />
            <button onClick={()=>setShowKey(s=>!s)} aria-label={showKey?"Hide key":"Show key"}
              style={{ background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:6,color:theme.textMuted,cursor:"pointer",padding:"0 10px",minHeight:36,minWidth:44 }}>{showKey?"○":"●"}</button>
          </div>
        </div>
        <div style={{ opacity:0.4,display:"flex",flexDirection:"column",gap:6 }}>
          <label style={{ fontFamily:"Orbitron",fontSize:9,letterSpacing:2,color:theme.textMuted }}>AZURE ENDPOINT (UNAVAILABLE)</label>
          <input disabled placeholder="Available after provisioning" style={{ background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:6,padding:"8px 10px",color:theme.textMuted,fontFamily:"Barlow,sans-serif",fontSize:12 }} />
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
          <label htmlFor={`tmp-${uid}`} style={{ fontFamily:"Orbitron",fontSize:9,letterSpacing:2,color:theme.textMuted }}>TEMPERATURE — {settings.temperature.toFixed(2)}</label>
          <input id={`tmp-${uid}`} type="range" min={0} max={2} step={0.01} value={settings.temperature} onChange={e=>upd("temperature",parseFloat(e.target.value))} aria-describedby={`tmp-d-${uid}`} style={{ width:"100%",accentColor:theme.accent }} />
          <div id={`tmp-d-${uid}`} style={{ fontFamily:"Barlow",fontSize:11,color:theme.textMuted }}>0 = focused · 2 = creative</div>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
          <label htmlFor={`mt-${uid}`} style={{ fontFamily:"Orbitron",fontSize:9,letterSpacing:2,color:theme.textMuted }}>MAX TOKENS — {settings.maxTokens}</label>
          <input id={`mt-${uid}`} type="range" min={100} max={2000} step={50} value={settings.maxTokens} onChange={e=>upd("maxTokens",parseInt(e.target.value))} style={{ width:"100%",accentColor:theme.accent }} />
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          <Label color={theme.textMuted}>OPTIONS</Label>
          {[["showTips","Show AI Tips"],["forceMock","Force Mock Mode"],["compact","Compact Navigation"]].map(([k,l])=>(
            <label key={k} style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontFamily:"Barlow,sans-serif",fontSize:13,color:theme.textSec }}>
              <input type="checkbox" checked={settings[k]} onChange={e=>upd(k,e.target.checked)} style={{ cursor:"pointer",accentColor:theme.accent }} />{l}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}


// ─── AI PANEL ─────────────────────────────────────────────────────────────────
function AIPanel({ settings, open, onClose }) {
  const { theme } = useTheme();
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const msgRef = useRef(null);
  const uid = useId();

  const SUGGESTED = [
    "How does the diagnostic instinct connect bartending to engineering?",
    "What's the difference between recovery and construction in Kyle's story?",
    "How does the card table scene anchor Chapter 11?",
    "What makes Kyle's voice different from typical recovery memoirs?",
  ];

  const SYSTEM = `You are a literary memoir consultant for "Construction, Not Recovery" by Kyle Rosebrook.
Key facts:
1. Amen Clinic eval (July 2022): Processing Speed 99th percentile, Recall Memory 12th. Engine works; storage doesn't.
2. Book thesis: Construction (building what never existed) vs Recovery (returning to what was lost). Recovery assumes a prior baseline — there is none.
3. The card table (1:30am, screenshot method) is the physical anchor of Chapter 11. Origin of the self-teaching arc that leads to Chaos Club.
4. The diagnostic instinct (reading rooms → processes → systems → music: learned Nuvole Bianche by Einaudi by shape, not note names) is the book's spine. Survived the brain injury. Pattern before content. Same processor, every substrate.
5. The book is addressed as a letter to Kyle's daughter Kinsley.
Voice rules: No "and that's when I realized," no epiphanies, no self-help patterns. Kyle has incremental recalibrations. Be specific to this book.`;

  const MOCKS = [
    `The diagnostic instinct doesn't live in explicit memory.

At O'Toole's: pattern recognition — which customer is two drinks from a problem.
At QC: same skill applied to process.
In engineering: same thing, larger system.

The cognitive disruption changed the storage, not the processor.
Pattern recognition survived because it operates below the level where the damage happened.

That's not recovery. That's the instinct outlasting the injury.`,
    `Recovery implies a previous state worth returning to.
Construction doesn't.

The memoir argues there was no functional baseline before the injury, the addiction, the financial implosion.

So the question isn't "how do I get back?"
It's "what can I build from here, with what I actually have,
in the configuration my brain is currently in?"

That's a fundamentally different project. And it requires different tools.`,
    `The card table is the hinge.

Everything before it is rupture and premise.
Everything after it is construction.

The scene works because it's specific and undignified:
not a desk, a folding card table.
The screenshot method is wrong. He knows it's wrong. He does it anyway.

That's the memoir's argument in a single scene:
you build with what you have, in the only way your current brain can move forward,
without waiting for the right moment.`,
  ];

  const send = useCallback(async (text) => {
    const t = text.trim();
    if (!t || loading) return;
    const userMsg = { role:"user", content:t };
    setMsgs(m => [...m, userMsg]);
    setInput("");
    setLoading(true);
    const isMock = settings.forceMock || !settings.apiKey;
    if (isMock) {
      await new Promise(r=>setTimeout(r,600));
      const mockText = MOCKS[msgs.length % MOCKS.length];
      let out = "";
      setMsgs(m => [...m, { role:"assistant", content:"" }]);
      for (const ch of mockText) {
        out += ch;
        await new Promise(r=>setTimeout(r,8));
        setMsgs(m => { const c=[...m]; c[c.length-1]={ role:"assistant",content:out }; return c; });
      }
    } else {
      try {
        const history = [...msgs, userMsg].slice(-6);
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST",
          headers:{ "Content-Type":"application/json","x-api-key":settings.apiKey,"anthropic-version":"2023-06-01" },
          body:JSON.stringify({ model:"claude-sonnet-4-6",max_tokens:600,system:SYSTEM,messages:history }),
        });
        const data = await res.json();
        setMsgs(m => [...m, { role:"assistant",content:data.content?.[0]?.text||"No response." }]);
      } catch {
        setMsgs(m => [...m, { role:"assistant",content:"Error reaching API. Check your key in Settings or enable Force Mock Mode." }]);
      }
    }
    setLoading(false);
  }, [msgs, loading, settings]);

  useEffect(() => {
    if (msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight;
  }, [msgs]);

  const panelStyle = { position:"fixed",bottom:80,right:20,zIndex:700,width:340,maxHeight:480,background:theme.surface,border:`1px solid ${theme.accent}50`,borderRadius:14,boxShadow:`0 0 40px ${theme.accent}20`,display:"flex",flexDirection:"column",opacity:open?1:0,transform:open?"translateY(0) scale(1)":"translateY(16px) scale(0.97)",pointerEvents:open?"auto":"none",transition:"opacity .25s,transform .25s" };

  return (
    <div style={panelStyle}>
      <div style={{ height:2,background:`linear-gradient(90deg,transparent,${theme.accent},transparent)`,borderRadius:"14px 14px 0 0" }} />
      <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${theme.border}` }}>
        <div style={{ fontFamily:"Orbitron",fontSize:10,letterSpacing:2,color:theme.accent }}>MEMOIR ASSISTANT</div>
        <button onClick={onClose} aria-label="Close assistant" style={{ background:"transparent",border:"none",color:theme.textMuted,cursor:"pointer",fontSize:14,minHeight:30,minWidth:30 }}>✕</button>
      </div>
      {msgs.length===0 && (
        <div style={{ padding:"12px 16px",display:"flex",flexDirection:"column",gap:8 }}>
          <div style={{ fontFamily:"Barlow",fontSize:12,color:theme.textMuted,marginBottom:4 }}>Try asking:</div>
          {SUGGESTED.map(s=>(
            <button key={s} onClick={()=>send(s)} style={{ background:`${theme.accent}10`,border:`1px solid ${theme.accent}30`,borderRadius:8,padding:"8px 12px",textAlign:"left",fontFamily:"Barlow,sans-serif",fontSize:12,color:theme.textSec,cursor:"pointer",lineHeight:1.4,minHeight:44 }}>{s}</button>
          ))}
        </div>
      )}
      <div ref={msgRef} aria-live="polite" style={{ flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:10 }}>
        {msgs.map((m,i)=>(
          <div key={i} style={{ alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"85%",background:m.role==="user"?`${theme.accent}20`:theme.bgMid,border:`1px solid ${m.role==="user"?theme.accent+"40":theme.border}`,borderRadius:m.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px",padding:"8px 12px",fontFamily:"Barlow,sans-serif",fontSize:12,color:theme.textSec,lineHeight:1.6,whiteSpace:"pre-wrap" }}>
            {m.content}{loading&&i===msgs.length-1&&m.role==="assistant"&&<span style={{ color:theme.accent }}>▌</span>}
          </div>
        ))}
        {loading&&msgs[msgs.length-1]?.role!=="assistant"&&(
          <div style={{ alignSelf:"flex-start",padding:"8px 12px",background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:"12px 12px 12px 4px",fontFamily:"Fira Code",fontSize:12,color:theme.accent }}>▌</div>
        )}
      </div>
      <div style={{ padding:"12px 16px",borderTop:`1px solid ${theme.border}`,display:"flex",gap:8 }}>
        <label htmlFor={`ai-in-${uid}`} style={{ position:"absolute",left:-9999,width:1,height:1,overflow:"hidden" }}>Message</label>
        <textarea id={`ai-in-${uid}`} value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send(input); } }}
          placeholder="Ask about the memoir..." rows={1}
          style={{ flex:1,resize:"none",background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:8,padding:"8px 10px",color:theme.text,fontFamily:"Barlow,sans-serif",fontSize:12,outline:"none" }} />
        <button onClick={()=>send(input)} disabled={!input.trim()||loading} aria-label="Send"
          style={{ background:theme.accent,border:"none",borderRadius:8,color:"#000",cursor:"pointer",padding:"0 14px",fontSize:14,opacity:!input.trim()||loading?0.4:1,minHeight:36,minWidth:44 }}>→</button>
      </div>
    </div>
  );
}

// ─── PARALLAX BG ──────────────────────────────────────────────────────────────
function ParallaxBG() {
  const { theme } = useTheme();
  const [m, setM] = useState({ x:0,y:0 });
  const raf = useRef(null);

  useEffect(() => {
    const onMove = e => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(()=>{
        setM({ x:(e.clientX/window.innerWidth-0.5)*2, y:(e.clientY/window.innerHeight-0.5)*2 });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div style={{ position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none" }}>
      <div style={{ position:"absolute",inset:0,transform:`translate(${m.x*10}px,${m.y*10}px)`,transition:"transform .4s ease-out" }}>
        <div style={{ position:"absolute",top:"20%",left:"10%",width:600,height:600,borderRadius:"50%",background:`radial-gradient(circle,${theme.orb1} 0%,transparent 70%)`,transform:"translate(-50%,-50%)" }} />
        <div style={{ position:"absolute",bottom:"10%",right:"15%",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${theme.orb2} 0%,transparent 70%)`,transform:"translate(50%,50%)" }} />
      </div>
      <div style={{ position:"absolute",inset:0,transform:`translate(${m.x*6}px,${m.y*6}px) rotate(${m.x*0.3}deg)`,transition:"transform .5s ease-out",backgroundImage:`linear-gradient(${theme.gridColor} 1px,transparent 1px),linear-gradient(90deg,${theme.gridColor} 1px,transparent 1px)`,backgroundSize:"48px 48px" }} />
      <div style={{ position:"absolute",top:"50%",left:"50%",transform:`translate(-50%,-50%) translate(${m.x*24}px,${m.y*24}px)`,transition:"transform .2s ease-out",animation:"cardFloat 10s ease-in-out infinite",opacity:0.07 }}>
        <svg width="320" height="240" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="60" width="280" height="90" rx="4" stroke={theme.accent} strokeWidth="1.5" fill="none"/>
          <rect x="20" y="60" width="280" height="9" rx="4" fill={theme.accent} opacity="0.3"/>
          <line x1="44" y1="69" x2="32" y2="208" stroke={theme.accent} strokeWidth="1.5"/>
          <line x1="276" y1="69" x2="288" y2="208" stroke={theme.accent} strokeWidth="1.5"/>
          <line x1="32" y1="195" x2="288" y2="195" stroke={theme.accent} strokeWidth="1" opacity="0.4"/>
          <rect x="95" y="72" width="130" height="68" rx="3" stroke={theme.accent} strokeWidth="1.5" fill="none"/>
          <rect x="85" y="138" width="150" height="7" rx="3" stroke={theme.accent} strokeWidth="1" fill="none"/>
          <line x1="107" y1="87" x2="195" y2="87" stroke={theme.accent} strokeWidth="1" opacity="0.5"/>
          <line x1="107" y1="97" x2="180" y2="97" stroke={theme.accent} strokeWidth="1" opacity="0.5"/>
          <line x1="107" y1="107" x2="188" y2="107" stroke={theme.accent} strokeWidth="1" opacity="0.5"/>
          <line x1="107" y1="117" x2="170" y2="117" stroke={theme.accent} strokeWidth="1" opacity="0.5"/>
          <ellipse cx="56" cy="98" rx="12" ry="4" stroke={theme.accent} strokeWidth="1" fill="none"/>
          <line x1="44" y1="98" x2="46" y2="135" stroke={theme.accent} strokeWidth="1"/>
          <line x1="68" y1="98" x2="66" y2="135" stroke={theme.accent} strokeWidth="1"/>
          <ellipse cx="56" cy="135" rx="10" ry="3" stroke={theme.accent} strokeWidth="1" fill="none"/>
          <rect x="235" y="74" width="46" height="60" rx="2" stroke={theme.accent} strokeWidth="1" fill="none" opacity="0.7"/>
          <line x1="242" y1="88" x2="274" y2="88" stroke={theme.accent} strokeWidth="0.8" opacity="0.4"/>
          <line x1="242" y1="96" x2="274" y2="96" stroke={theme.accent} strokeWidth="0.8" opacity="0.4"/>
          <line x1="242" y1="104" x2="274" y2="104" stroke={theme.accent} strokeWidth="0.8" opacity="0.4"/>
          <text x="225" y="128" fontFamily="monospace" fontSize="11" fill={theme.accent} opacity="0.8">1:30</text>
        </svg>
      </div>
      <div style={{ position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px)" }} />
    </div>
  );
}


// ─── SECTION: OVERVIEW ────────────────────────────────────────────────────────
function SectionOverview({ settings }) {
  const { theme } = useTheme();
  const [openCard, setOpenCard] = useState(null);
  const cardRefs = useRef({});
  const p = settings.persona;

  const heroText = {
    explorer:"A memoir about building a mind from scratch. Not recovery — construction. Kyle spent years trying to get back to who he was. This book is about the moment he realized there was nowhere to go back to, and what he built instead.",
    poweruser:"Literary nonfiction framed as a letter to Kyle's daughter Kinsley. Thesis: how does a person whose mind has been broken rebuild agency not through recovery of what was lost, but through construction of what never existed? Spine: The Diagnostic Instinct (hospitality → QC → engineering).",
    admin:"Architecture: PROLOGUE → BEFORE THE BREAK → THE RUPTURE → THE CONSTRUCTION PROJECT → LATE-LIFE EMERGENCE → EPILOGUE. Frame: letter to Kinsley. Spine: Diagnostic Instinct through-line. All chapter content gated on Kyle's explicit confirmation.",
  };

  const arcColors = arc => theme[arc.colorKey] || theme.accent;

  return (
    <div>
      <div style={{ marginBottom:40,textAlign:"center" }}>
        <div style={{ fontFamily:"Orbitron,monospace",fontSize:9,letterSpacing:4,textTransform:"uppercase",color:theme.accent,marginBottom:12 }}>LITERARY MEMOIR — ACTIVE EXCAVATION</div>
        <h1 style={{ fontFamily:"Orbitron,monospace",fontSize:"clamp(18px,3.5vw,28px)",fontWeight:900,margin:"0 0 16px",background:`linear-gradient(110deg,${theme.accent},${theme.accent2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Construction, Not Recovery</h1>
        <p style={{ fontFamily:"Barlow,sans-serif",fontSize:14,color:theme.textSec,maxWidth:560,margin:"0 auto",lineHeight:1.8 }}>{heroText[p]||heroText.explorer}</p>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16,marginBottom:32 }}>
        {ARCS.map((arc,i)=>{
          const c = arcColors(arc);
          return (
            <div key={arc.id} tabIndex={0} role="button" aria-label={`Open ${arc.name} details`}
              ref={el=>{ cardRefs.current[arc.id]=el; }}
              onClick={()=>setOpenCard(arc)}
              onKeyDown={e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); setOpenCard(arc); } }}
              className="fade-up"
              style={{ background:`linear-gradient(135deg,${theme.surface},${theme.bgMid})`,border:`1px solid ${theme.border}`,borderRadius:12,padding:18,cursor:"pointer",transition:"border-color .22s,box-shadow .22s,transform .15s",animationDelay:`${i*0.05}s` }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=c+"70"; e.currentTarget.style.boxShadow=`0 0 24px ${c}20`; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=theme.border; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                <div style={{ width:36,height:36,borderRadius:8,background:`${c}18`,border:`1px solid ${c}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:c }}>{arc.sym}</div>
                <div>
                  <div style={{ fontFamily:"Barlow,sans-serif",fontWeight:700,fontSize:13,color:theme.text }}>{arc.name}</div>
                  <div style={{ fontFamily:"Barlow,sans-serif",fontSize:11,color:theme.textMuted,lineHeight:1.4 }}>{arc.tagline}</div>
                </div>
              </div>
              <div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>
                {arc.badges.slice(0,2).map(b=><span key={b} style={{ fontFamily:"Orbitron",fontSize:7,letterSpacing:1.5,textTransform:"uppercase",fontWeight:700,color:c,background:`${c}18`,border:`1px solid ${c}30`,padding:"2px 6px",borderRadius:3 }}>{b}</span>)}
              </div>
            </div>
          );
        })}
      </div>

      <AccordionCard title="Narrative Architecture" subtitle="Five-part memoir structure" icon="⬡" color={theme.accent} badge="LOCKED">
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          {[
            ["PROLOGUE","The Wrong Beginning","Age oscillation at O'Toole's. The failed first book. Memory's first evidence."],
            ["PART I","Before the Break","O'Toole's. The Permission. Counting Streetlights. The diagnostic instinct emerges."],
            ["PART II","The Rupture","Hardware failure. Addiction. The recursive trap. The injury caused by the escape."],
            ["PART III","The Construction Project","First Tools. Learning in a new architecture. The Arsenal. The card table."],
            ["PART IV","Late-Life Emergence","The Monitor Reflection. The Wrong Book. FlashFusion. The Five. The reunion."],
            ["EPILOGUE","The Distinction","Recovery vs. Construction. The letter completed. What Kinsley gets."],
          ].map(([part,title,desc])=>(
            <div key={part} style={{ display:"flex",gap:12,padding:"10px 12px",background:theme.bgMid,borderRadius:8,border:`1px solid ${theme.border}` }}>
              <div style={{ fontFamily:"Orbitron",fontSize:8,letterSpacing:1.5,color:theme.accent,whiteSpace:"nowrap",marginTop:2 }}>{part}</div>
              <div>
                <div style={{ fontFamily:"Barlow",fontWeight:600,fontSize:13,color:theme.text }}>{title}</div>
                <div style={{ fontFamily:"Barlow",fontSize:12,color:theme.textMuted,lineHeight:1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </AccordionCard>

      {settings.showTips && (
        <div style={{ marginTop:20,padding:"14px 16px",background:`${theme.accent}08`,border:`1px solid ${theme.accent}30`,borderRadius:10,borderLeft:`3px solid ${theme.accent}` }}>
          <Label color={theme.accent}>AI TIP</Label>
          <p style={{ fontFamily:"Barlow,sans-serif",fontSize:13,color:theme.textSec,margin:"6px 0 0",lineHeight:1.6 }}>
            Use the Memoir Assistant (✦ button) to ask questions about any chapter arc, voice guidelines, or excavation protocols. It knows the thesis, Kyle's cognitive profile, and the Kinsley test.
          </p>
        </div>
      )}

      {openCard && <PopCard arc={openCard} onClose={()=>setOpenCard(null)} triggerRef={{ current:cardRefs.current[openCard.id] }} />}
    </div>
  );
}

// ─── SECTION: ARCS ────────────────────────────────────────────────────────────
function SectionArcs({ settings, goPlayground }) {
  const { theme } = useTheme();
  const [openCard, setOpenCard] = useState(null);
  const cardRefs = useRef({});
  const p = settings.persona;

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <Label color={theme.accent}>MEMOIR ARCS</Label>
        <h2 style={{ fontFamily:"Orbitron",fontSize:16,fontWeight:700,color:theme.text,margin:"8px 0 4px" }}>Chapter Arcs & Scene Seeds</h2>
        <p style={{ fontFamily:"Barlow",fontSize:13,color:theme.textMuted }}>All excavated material, confirmed scene seeds, and narrative status by chapter arc.</p>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        {ARCS.map(arc=>{
          const c = theme[arc.colorKey]||theme.accent;
          return (
            <AccordionCard key={arc.id} id={arc.id} title={arc.name} subtitle={arc.tagline} icon={arc.sym} color={c} badge={arc.badges[0]}>
              <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
                <p style={{ fontFamily:"Barlow",fontSize:13,color:theme.textSec,lineHeight:1.7,margin:0 }}>{arc[p]||arc.explorer}</p>
                <div>
                  <Label color={c}>Use Cases</Label>
                  <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginTop:6 }}>
                    {arc.useCases.map(u=><span key={u} style={{ background:`${c}12`,border:`1px solid ${c}30`,borderRadius:6,padding:"4px 10px",fontFamily:"Barlow",fontSize:11,color:theme.textSec }}>{u}</span>)}
                  </div>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }} className="two-col">
                  <div><Label color={c}>Sample Input</Label><Term content={arc.mockInput} color={c} sx={{ marginTop:6,fontSize:11 }} /></div>
                  <div><Label color={c}>Sample Output</Label><Term content={arc.mockOutput} color={c} sx={{ marginTop:6,fontSize:11,lineHeight:1.6 }} /></div>
                </div>
                <div style={{ display:"flex",gap:8 }}>
                  <button ref={el=>{ cardRefs.current[arc.id]=el; }} onClick={()=>setOpenCard(arc)}
                    style={{ background:`${c}18`,border:`1px solid ${c}40`,borderRadius:8,padding:"8px 14px",cursor:"pointer",fontFamily:"Barlow",fontSize:12,color:c,minHeight:36 }}>Full Details</button>
                  <button onClick={()=>goPlayground({ input:arc.mockInput, sys:`You are a memoir writing assistant for "Construction, Not Recovery," focusing on the "${arc.name}" arc.` })}
                    style={{ background:"transparent",border:`1px solid ${theme.border}`,borderRadius:8,padding:"8px 14px",cursor:"pointer",fontFamily:"Barlow",fontSize:12,color:theme.textMuted,minHeight:36 }}>Try in Playground →</button>
                </div>
              </div>
            </AccordionCard>
          );
        })}
      </div>
      {openCard && <PopCard arc={openCard} onClose={()=>setOpenCard(null)} triggerRef={{ current:cardRefs.current[openCard.id] }} />}
    </div>
  );
}

// ─── SECTION: PLAYGROUND ─────────────────────────────────────────────────────
function SectionPlayground({ settings, playground }) {
  const { theme } = useTheme();
  const [sys, setSys] = useState(`You are a literary memoir writing assistant for "Construction, Not Recovery" by Kyle Rosebrook.\nVoice: Direct. Engineering metaphors. No epiphanies. No self-help patterns.\nThesis: construction (building new) not recovery (returning to old).`);
  const [userP, setUserP] = useState("");
  const [resp, setResp] = useState("");
  const [loading, setLoading] = useState(false);
  const [temp, setTemp] = useState(settings.temperature);
  const [mt, setMt] = useState(settings.maxTokens);
  const uid = useId();

  useEffect(() => {
    if (playground?.input) setUserP(playground.input);
    if (playground?.sys) setSys(playground.sys);
  }, [playground]);

  const isMock = settings.forceMock || !settings.apiKey;
  const MOCK = `Memory doesn't fail gracefully.

It doesn't give you an error code or a stack trace.
One day you reach for something that should be there —
and it isn't.

Or worse: it's there, but wrong,
and you don't know it's wrong
until someone asks a second time.

The clinical record says summer 2020 on page two.
Page three says October 2021.

The physician's own notes have the same confusion
as the patient.

That's not a documentation error.
That's the book's argument, documented.`;

  const run = async () => {
    if (!userP.trim() || loading) return;
    setLoading(true); setResp("");
    if (isMock) {
      let out = "";
      for (const ch of MOCK) { out+=ch; await new Promise(r=>setTimeout(r,8)); setResp(out); }
    } else {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST",
          headers:{ "Content-Type":"application/json","x-api-key":settings.apiKey,"anthropic-version":"2023-06-01" },
          body:JSON.stringify({ model:"claude-sonnet-4-6",max_tokens:mt,temperature:temp,system:sys,messages:[{ role:"user",content:userP }] }),
        });
        const data = await res.json();
        setResp(data.content?.[0]?.text||"No response.");
      } catch { setResp("Error reaching API. Check your key in Settings or enable Force Mock Mode."); }
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <Label color={theme.accent}>PLAYGROUND</Label>
        <h2 style={{ fontFamily:"Orbitron",fontSize:16,fontWeight:700,color:theme.text,margin:"8px 0 4px" }}>AI Writing Lab</h2>
        <div style={{ display:"flex",alignItems:"center",gap:8 }} role="status" aria-label={isMock?"Mock mode active":"Live mode active"}>
          <div style={{ width:8,height:8,borderRadius:"50%",background:isMock?theme.warm:theme.blue,boxShadow:`0 0 8px ${isMock?theme.warm:theme.blue}`,animation:"pulse 2s infinite" }} />
          <Label color={isMock?theme.warm:theme.blue}>{isMock?"MOCK MODE":"LIVE MODE"}</Label>
        </div>
      </div>

      <AccordionCard title="System Prompt" subtitle="Memoir writing context" icon="⟁" color={theme.accent}>
        <label htmlFor={`sp-${uid}`} style={{ position:"absolute",left:-9999,width:1,height:1,overflow:"hidden" }}>System prompt</label>
        <textarea id={`sp-${uid}`} value={sys} onChange={e=>setSys(e.target.value)} rows={5}
          style={{ width:"100%",boxSizing:"border-box",background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:8,padding:"10px 12px",color:theme.text,fontFamily:"Fira Code,monospace",fontSize:11,lineHeight:1.6,resize:"vertical",outline:"none" }} />
      </AccordionCard>

      <div style={{ marginTop:12 }}>
        <AccordionCard title="Model Parameters" subtitle="Temperature and token controls" icon="◈" color={theme.blue}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }} className="two-col">
            <div>
              <label htmlFor={`t-${uid}`} style={{ fontFamily:"Orbitron",fontSize:9,letterSpacing:2,color:theme.textMuted,display:"block",marginBottom:8 }}>TEMPERATURE — {temp.toFixed(2)}</label>
              <input id={`t-${uid}`} type="range" min={0} max={2} step={0.01} value={temp} onChange={e=>setTemp(parseFloat(e.target.value))} style={{ width:"100%",accentColor:theme.blue }} />
            </div>
            <div>
              <label htmlFor={`m-${uid}`} style={{ fontFamily:"Orbitron",fontSize:9,letterSpacing:2,color:theme.textMuted,display:"block",marginBottom:8 }}>MAX TOKENS — {mt}</label>
              <input id={`m-${uid}`} type="range" min={100} max={2000} step={50} value={mt} onChange={e=>setMt(parseInt(e.target.value))} style={{ width:"100%",accentColor:theme.blue }} />
            </div>
          </div>
        </AccordionCard>
      </div>

      <div style={{ marginTop:16 }}>
        <label htmlFor={`up-${uid}`} style={{ fontFamily:"Orbitron",fontSize:9,letterSpacing:2,color:theme.textMuted,display:"block",marginBottom:8 }}>USER PROMPT</label>
        <textarea id={`up-${uid}`} value={userP} onChange={e=>setUserP(e.target.value)} rows={4} placeholder="Write the opening of the card table scene in Kyle's voice..."
          style={{ width:"100%",boxSizing:"border-box",background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:8,padding:"10px 12px",color:theme.text,fontFamily:"Barlow,sans-serif",fontSize:13,lineHeight:1.6,resize:"vertical",outline:"none" }} />
      </div>
      <div style={{ display:"flex",gap:10,marginTop:12 }}>
        <button onClick={run} disabled={!userP.trim()||loading}
          style={{ background:theme.accent,border:"none",borderRadius:8,color:"#000",cursor:"pointer",padding:"10px 20px",fontFamily:"Barlow",fontWeight:700,fontSize:13,opacity:!userP.trim()||loading?0.4:1,minHeight:44 }}>{loading?"Running...":"Run"}</button>
        <button onClick={()=>{ setUserP(""); setResp(""); }}
          style={{ background:"transparent",border:`1px solid ${theme.border}`,borderRadius:8,color:theme.textMuted,cursor:"pointer",padding:"10px 20px",fontFamily:"Barlow",fontSize:13,minHeight:44 }}>Clear</button>
      </div>

      {(resp||loading) && (
        <div style={{ marginTop:20 }}>
          <Label color={theme.accent}>RESPONSE</Label>
          <div aria-live="polite" style={{ marginTop:8,background:"#020508",border:`1px solid ${theme.accent}25`,borderRadius:8,padding:"16px 18px",fontFamily:"Barlow,sans-serif",fontSize:13,color:theme.textSec,lineHeight:1.8,whiteSpace:"pre-wrap",minHeight:80,position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${theme.accent}40,transparent)` }} />
            {resp}{loading&&<span style={{ color:theme.accent }}>▌</span>}
          </div>
        </div>
      )}
    </div>
  );
}


// ─── SECTION: EXCAVATION ─────────────────────────────────────────────────────
function SectionExcavation({ settings }) {
  const { theme } = useTheme();
  const [step, setStep] = useState(0);
  const p = settings.persona;
  const cur = STEPS[step];
  const desc = p==="explorer"?cur.explorer:p==="poweruser"?cur.poweruser:cur.admin;

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <Label color={theme.accent}>EXCAVATION PROTOCOL</Label>
        <h2 style={{ fontFamily:"Orbitron",fontSize:16,fontWeight:700,color:theme.text,margin:"8px 0 4px" }}>Session Framework</h2>
        <p style={{ fontFamily:"Barlow",fontSize:13,color:theme.textMuted }}>The five-step excavation protocol for each memoir session.</p>
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:28,flexWrap:"wrap" }}>
        {STEPS.map((s,i)=>(
          <button key={i} onClick={()=>setStep(i)} aria-label={`Step ${s.num}: ${s.title}`} aria-current={i===step?"true":undefined}
            style={{ display:"flex",alignItems:"center",gap:8,background:i===step?`${theme.accent}20`:"transparent",border:`1px solid ${i===step?theme.accent+"70":theme.border}`,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontFamily:"Barlow",fontSize:12,color:i===step?theme.accent:theme.textMuted,minHeight:44,transition:"all .2s" }}>
            <span style={{ fontFamily:"Orbitron",fontSize:9 }}>{s.num}</span>
            <span className="hide-sm">{s.title}</span>
          </button>
        ))}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }} className="two-col">
        <div>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
            <div style={{ width:44,height:44,borderRadius:10,background:`${theme.accent}18`,border:`1px solid ${theme.accent}40`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Orbitron",fontSize:14,fontWeight:700,color:theme.accent }}>{cur.num}</div>
            <div style={{ fontFamily:"Orbitron",fontSize:13,fontWeight:700,color:theme.text }}>{cur.title}</div>
          </div>
          <p style={{ fontFamily:"Barlow",fontSize:13,color:theme.textSec,lineHeight:1.7,margin:"0 0 16px" }}>{desc}</p>
          <div style={{ padding:"10px 14px",background:`${theme.warm}08`,border:`1px solid ${theme.warm}30`,borderLeft:`3px solid ${theme.warm}`,borderRadius:8 }}>
            <Label color={theme.warm}>SESSION TIP</Label>
            <p style={{ fontFamily:"Barlow",fontSize:12,color:theme.textSec,margin:"6px 0 0",lineHeight:1.6 }}>{cur.tip}</p>
          </div>
        </div>
        <div>
          <Label color={theme.accent}>EXAMPLE COMMAND</Label>
          <Term content={cur.action} color={theme.accent} sx={{ marginTop:8,fontSize:11 }} />
        </div>
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",marginTop:24 }}>
        <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}
          style={{ background:"transparent",border:`1px solid ${theme.border}`,borderRadius:8,padding:"8px 16px",cursor:"pointer",fontFamily:"Barlow",fontSize:13,color:theme.textMuted,opacity:step===0?0.3:1,minHeight:44 }}>← Back</button>
        <button onClick={()=>setStep(s=>Math.min(STEPS.length-1,s+1))} disabled={step===STEPS.length-1}
          style={{ background:theme.accent,border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontFamily:"Barlow",fontWeight:700,fontSize:13,color:"#000",opacity:step===STEPS.length-1?0.3:1,minHeight:44 }}>Next →</button>
      </div>
    </div>
  );
}

// ─── SECTION: VOICE ───────────────────────────────────────────────────────────
function SectionVoice({ settings }) {
  const { theme } = useTheme();
  const LAYERS = [
    { name:"Frame Layer",color:theme.warm,access:"Letter to Kinsley. Stakes-setting. The why.",
      desc:"The frame layer governs every scene. Everything is written to the 20-year-old Kinsley who will read this later. Not the child who exists now — the adult who will need to understand what it cost to build the person who shows up at 3:25pm every Friday.",
      items:["The Kinsley test on every scene","Stakes must be legible to a future reader","Not sentiment — architecture","Epilogue completes the frame"],
    },
    { name:"Spine Layer",color:theme.accent,access:"Diagnostic Instinct. Through-line. Credibility.",
      desc:"The spine layer holds the book together. The diagnostic instinct — reading rooms, processes, systems, and music (Nuvole Bianche by shape not note names) — must be legible across the bartender → QC → engineering arc. Any scene that doesn't connect to it is a candidate for cutting.",
      items:["Pattern recognition in O'Toole's scenes","Process gap detection in QC arc","System diagnosis in engineering arc","Explicit in the Arsenal chapter"],
    },
    { name:"Scene Layer",color:theme.blue,access:"Confirmed excavated material only. Ground truth.",
      desc:"The scene layer is the ground truth gate. No scene is deployable until Kyle confirms it. Emotional truth and factual truth are tracked separately. Memory gaps are content, not problems.",
      items:["CONFIRMED: Card table (Chapter 11)","CONFIRMED: O'Toole's seeds 1-2","NEEDS VERIFICATION: Seeds 3-4","EXCAVATING: Tom Ropel, Dave Datt, NIU"],
    },
  ];

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <Label color={theme.accent}>VOICE & ARCHITECTURE</Label>
        <h2 style={{ fontFamily:"Orbitron",fontSize:16,fontWeight:700,color:theme.text,margin:"8px 0 4px" }}>Narrative Layers</h2>
        <p style={{ fontFamily:"Barlow",fontSize:13,color:theme.textMuted }}>Three-layer narrative governance: frame, spine, scene.</p>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:28 }}>
        {LAYERS.map(r=>(
          <AccordionCard key={r.name} title={r.name} subtitle={r.access} icon="◇" color={r.color}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }} className="two-col">
              <p style={{ fontFamily:"Barlow",fontSize:13,color:theme.textSec,lineHeight:1.7,margin:0 }}>{r.desc}</p>
              <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                {r.items.map(it=>(
                  <div key={it} style={{ display:"flex",alignItems:"flex-start",gap:8,fontFamily:"Barlow",fontSize:12,color:theme.textSec,lineHeight:1.5 }}>
                    <span style={{ color:r.color,marginTop:1,fontSize:8,flexShrink:0 }}>▶</span>{it}
                  </div>
                ))}
              </div>
            </div>
          </AccordionCard>
        ))}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24 }} className="two-col">
        <AccordionCard title="What Works" subtitle="Kyle's natural register" icon="✓" color={theme.blue} defaultOpen>
          {["Declarative observations — let readers conclude","Technical descriptions of emotional states","Admissions of uncertainty about memory/meaning","Humor that doesn't defuse tension prematurely","Paragraphs ending on an image or question, not a summary","Contradictions held, not resolved","Short sentences for impact. Longer for complexity. Short again"].map(r=>(
            <div key={r} style={{ display:"flex",gap:8,marginBottom:8,fontFamily:"Barlow",fontSize:12,color:theme.textSec }}>
              <span style={{ color:theme.blue,fontSize:10 }}>✓</span>{r}
            </div>
          ))}
        </AccordionCard>
        <AccordionCard title="Never Use" subtitle="Voice failure patterns" icon="✗" color={theme.danger} defaultOpen>
          {[`"And that's when I realized..."`,`"Looking back, I can see that..."`,`"Rock bottom became the foundation..."`,`"Grateful for the journey"`,"Sentences that make meaning too fast","Anything a LinkedIn influencer would post","Epiphanies — Kyle has incremental recalibrations"].map(r=>(
            <div key={r} style={{ display:"flex",gap:8,marginBottom:8,fontFamily:"Barlow",fontSize:12,color:theme.textSec }}>
              <span style={{ color:theme.danger,fontSize:10 }}>✗</span>{r}
            </div>
          ))}
        </AccordionCard>
      </div>
      <div>
        <Label color={theme.accent}>WORKING EXAMPLES</Label>
        <div style={{ display:"flex",flexDirection:"column",gap:8,marginTop:10 }}>
          {[
            `"I've tried at the bottom and I'm still down in this fucking hole. I was wrong about those being the answer, let's try the opposite because I seriously have nothing fucking left."`,
            `"Not because I'm organized. Because I can't afford not to be."`,
            `"No one tells you that relief is the most addictive feeling of all."`,
            `"The Sunday goodbye isn't grief. It's a specific kind of system failure — every routine you built together over the weekend decompiles in the 15 minutes between 'shoes on, kiddo' and the rearview mirror."`,
          ].map((ex,i)=>(
            <div key={i} style={{ padding:"12px 16px",borderLeft:`3px solid ${theme.accent}60`,background:`${theme.accent}06`,borderRadius:"0 8px 8px 0",fontFamily:"Barlow,sans-serif",fontSize:13,color:theme.textSec,fontStyle:"italic",lineHeight:1.6 }}>{ex}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SECTION: CHECKLIST ───────────────────────────────────────────────────────
function SectionChecklist({ settings }) {
  const { theme } = useTheme();
  const [done, setDone] = useState(()=>{ const d={}; CHECKLIST_ITEMS.forEach(i=>{ d[i.id]=i.done; }); return d; });
  const [msgTopic, setMsgTopic] = useState("card_table");
  const [msgOut, setMsgOut] = useState("");
  const [msgLoading, setMsgLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const uid = useId();

  const total = CHECKLIST_ITEMS.length;
  const completed = Object.values(done).filter(Boolean).length;
  const pct = Math.round((completed/total)*100);
  const gColors = { critical:theme.danger,high:theme.warm,medium:theme.accent,low:theme.textMuted };

  const MSG_TOPICS = [
    { id:"card_table",label:"Card Table — ready for draft" },
    { id:"dave",label:"Dave Datt — excavation needed" },
    { id:"tool_arch",label:"Session 3 Tool Archaeology" },
    { id:"kinsley",label:"Kinsley test — chapter review" },
    { id:"voice",label:"Voice check — submission ready?" },
  ];
  const MOCK_MSGS = {
    card_table:`CARD TABLE — STATUS: DRAFT\nSequence confirmed Apr 2026. Anchor scene locked.\nPhillis → Bear → card table → screenshot → Chaos Club.\n\nReady for prose pass. Kyle needs to confirm:\n— What was on the screen at 1:30am?\n— What sound was in the room?\n— What came next after the photo?\n\nNext: skeleton → flesh → polish.`,
    dave:`DAVE DATT — STATUS: NEEDS EXCAVATION\nDied of brain aneurysm in his 20s or 30s. Kyle attended funeral.\n\nRequired material:\n— Year of death\n— What was Kyle like walking in?\n— Parallel: both flunked out, different outcomes\n\nDo not draft until excavation complete.`,
    tool_arch:`SESSION 3: TOOL ARCHAEOLOGY — NOT STARTED\nChapter 8 (The Arsenal) needs its own excavation session.\n\nGoal: Map each tool to the cognitive function it serves.\n— n8n → memory offload\n— Notion → external hippocampus\n— GitHub → decision version control\n\nNote: ~30 tools hands-on. 240+ catalogued ≠ mastered.`,
    kinsley:`KINSLEY TEST — CHAPTER REVIEW\nEvery chapter must answer: would a 20-year-old Kinsley understand what this cost?\n\nStakes must be legible. Not sentiment — architecture.\nFailure mode: chapter ends on a realization.\nPass: chapter ends on an image or an open question.`,
    voice:`VOICE CHECK — SUBMISSION READINESS\nBefore any chapter is marked submission-ready:\n\n□ No self-help patterns\n□ No epiphanies — only incremental recalibrations\n□ Every claim traceable to confirmed source\n□ Engineering metaphors grounded, not decorative\n□ Uncertainty labeled — not resolved prematurely\n□ Kinsley test: PASS\n□ Spine connection: LEGIBLE`,
  };

  const generateMsg = async () => {
    setMsgLoading(true); setMsgOut("");
    const isMock = settings.forceMock || !settings.apiKey;
    if (isMock) {
      const text = MOCK_MSGS[msgTopic]||"No mock for this topic.";
      let out="";
      for (const ch of text) { out+=ch; await new Promise(r=>setTimeout(r,8)); setMsgOut(out); }
    } else {
      try {
        const topic = MSG_TOPICS.find(t=>t.id===msgTopic);
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST",
          headers:{ "Content-Type":"application/json","x-api-key":settings.apiKey,"anthropic-version":"2023-06-01" },
          body:JSON.stringify({ model:"claude-sonnet-4-6",max_tokens:400,system:`You are a memoir project manager for "Construction, Not Recovery." Generate a concise status update for the topic. Direct, no fluff.`,messages:[{ role:"user",content:`Generate a status message for: ${topic?.label}` }] }),
        });
        const data = await res.json();
        setMsgOut(data.content?.[0]?.text||"No response.");
      } catch { setMsgOut("Error. Use mock mode."); }
    }
    setMsgLoading(false);
  };

  const copyMsg = () => {
    navigator.clipboard.writeText(msgOut).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); });
  };

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <Label color={theme.accent}>CHECKLIST</Label>
        <h2 style={{ fontFamily:"Orbitron",fontSize:16,fontWeight:700,color:theme.text,margin:"8px 0 4px" }}>Excavation Progress</h2>
      </div>
      <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
          <Label color={theme.textMuted}>COMPLETION</Label>
          <Label color={theme.accent}>{completed}/{total} — {pct}%</Label>
        </div>
        <div style={{ height:6,background:theme.bgMid,borderRadius:3,border:`1px solid ${theme.border}`,overflow:"hidden" }}>
          <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
            style={{ height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${theme.accent2},${theme.accent})`,transition:"width .5s ease",borderRadius:3 }} />
        </div>
      </div>

      <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:28 }}>
        {["critical","high","medium","low"].map(g=>{
          const items = CHECKLIST_ITEMS.filter(i=>i.priority===g);
          const c = gColors[g];
          const doneCount = items.filter(i=>done[i.id]).length;
          return (
            <AccordionCard key={g} title={g.toUpperCase()} subtitle={`${doneCount}/${items.length} complete`} icon="◇" color={c} defaultOpen={g==="critical"}>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {items.map(item=>(
                  <label key={item.id} style={{ display:"flex",alignItems:"flex-start",gap:12,cursor:"pointer",padding:"10px 12px",borderRadius:8,background:done[item.id]?`${c}08`:theme.bgMid,border:`1px solid ${done[item.id]?c+"30":theme.border}`,transition:"all .2s",minHeight:44 }}>
                    <input type="checkbox" checked={done[item.id]} onChange={e=>setDone(d=>({...d,[item.id]:e.target.checked}))} style={{ marginTop:2,accentColor:c,flexShrink:0 }} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"Barlow",fontWeight:600,fontSize:13,color:done[item.id]?theme.textMuted:theme.text,textDecoration:done[item.id]?"line-through":"none" }}>{item.title}</div>
                      <div style={{ fontFamily:"Barlow",fontSize:11,color:theme.textMuted,marginTop:4,lineHeight:1.5 }}>{item.note}</div>
                      <div style={{ fontFamily:"Orbitron",fontSize:8,color:c,marginTop:4,letterSpacing:1 }}>OWNER: {item.owner}</div>
                    </div>
                  </label>
                ))}
              </div>
            </AccordionCard>
          );
        })}
      </div>

      <AccordionCard title="Status Message Generator" subtitle="Generate project status updates" icon="◈" color={theme.accent} defaultOpen>
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <fieldset style={{ border:`1px solid ${theme.border}`,borderRadius:8,padding:"12px 14px" }}>
            <legend style={{ fontFamily:"Orbitron",fontSize:9,letterSpacing:2,color:theme.textMuted,padding:"0 4px" }}>TOPIC</legend>
            {MSG_TOPICS.map(t=>(
              <label key={t.id} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8,cursor:"pointer",fontFamily:"Barlow",fontSize:13,color:theme.textSec }}>
                <input type="radio" name={`mt-${uid}`} checked={msgTopic===t.id} onChange={()=>setMsgTopic(t.id)} style={{ cursor:"pointer",accentColor:theme.accent }} />{t.label}
              </label>
            ))}
          </fieldset>
          <button onClick={generateMsg} disabled={msgLoading}
            style={{ background:theme.accent,border:"none",borderRadius:8,color:"#000",cursor:"pointer",padding:"10px 20px",fontFamily:"Barlow",fontWeight:700,fontSize:13,opacity:msgLoading?0.5:1,minHeight:44,alignSelf:"flex-start" }}>{msgLoading?"Generating...":"Generate"}</button>
          {(msgOut||msgLoading) && (
            <div>
              <div aria-live="polite" style={{ background:"#020508",border:`1px solid ${theme.accent}25`,borderRadius:8,padding:"14px 16px",position:"relative",fontFamily:"Fira Code,monospace",fontSize:11,color:theme.textSec,lineHeight:1.7,whiteSpace:"pre-wrap",minHeight:60 }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${theme.accent}40,transparent)` }} />
                {msgOut}{msgLoading&&<span style={{ color:theme.accent }}>▌</span>}
              </div>
              {msgOut && (
                <button onClick={copyMsg} style={{ marginTop:8,background:"transparent",border:`1px solid ${theme.border}`,borderRadius:8,padding:"6px 14px",cursor:"pointer",fontFamily:"Barlow",fontSize:12,color:copied?theme.accent:theme.textMuted,minHeight:36 }}>{copied?"Copied!":"Copy to clipboard"}</button>
              )}
            </div>
          )}
        </div>
      </AccordionCard>
    </div>
  );
}


// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const NAV = [
  { id:"overview",label:"01 Overview" },
  { id:"arcs",label:"02 Arcs" },
  { id:"playground",label:"03 Playground" },
  { id:"excavation",label:"04 Excavation" },
  { id:"voice",label:"05 Voice" },
  { id:"checklist",label:"06 Checklist" },
];

export default function App() {
  const [settings, setSettings] = useState({
    theme:"Carbon Noir",persona:"poweruser",apiKey:"",
    temperature:0.8,maxTokens:1000,showTips:true,forceMock:false,compact:false,
  });
  const [section, setSection] = useState("overview");
  const [showSettings, setShowSettings] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [playground, setPlayground] = useState(null);

  const theme = THEMES[settings.theme] || THEMES["Carbon Noir"];

  useEffect(() => {
    const id = "memoir-css";
    if (document.getElementById(id)) { document.getElementById(id).remove(); }
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Barlow:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap');
      *{box-sizing:border-box;}
      .skip-link{position:absolute;left:-9999px;}
      .skip-link:focus{left:0;top:0;z-index:9999;background:#000;color:#fff;padding:8px 16px;}
      *:focus-visible{outline:3px solid ${theme.accent};outline-offset:3px;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
      @keyframes cardFloat{0%,100%{transform:translate(-50%,-50%) rotate(0deg)}33%{transform:translate(-50%,-53%) rotate(1.5deg)}66%{transform:translate(-50%,-47%) rotate(-1deg)}}
      .fade-up{animation:fadeUp .35s ease both;}
      @media(max-width:640px){
        .two-col{grid-template-columns:1fr!important;}
        .hide-sm{display:none!important;}
        .main-pad{padding:20px 14px!important;}
      }
      @media(max-width:768px){
        .three-col{grid-template-columns:1fr 1fr!important;}
      }
    `;
    document.head.appendChild(s);
  }, [settings.theme, theme.accent]);

  const goPlayground = (data) => { setPlayground(data); setSection("playground"); };

  return (
    <ThemeCtx.Provider value={{ theme, themeName:settings.theme }}>
      <div style={{ minHeight:"100vh",background:theme.bg,color:theme.text,fontFamily:"Barlow,sans-serif",position:"relative" }}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ParallaxBG />

        {/* Header */}
        <header role="banner" style={{ position:"sticky",top:0,zIndex:500,background:`${theme.bg}e8`,backdropFilter:"blur(14px)",borderBottom:`1px solid ${theme.border}`,padding:"0 24px" }}>
          <div style={{ maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:56 }}>
            <div style={{ fontFamily:"Orbitron",fontWeight:900,fontSize:13,background:`linear-gradient(110deg,${theme.accent},${theme.accent2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
              CONSTRUCTION, NOT RECOVERY
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <div style={{ fontFamily:"Orbitron",fontSize:8,letterSpacing:1.5,color:theme.textMuted,padding:"3px 8px",border:`1px solid ${theme.border}`,borderRadius:4 }} className="hide-sm">
                {settings.persona.toUpperCase()}
              </div>
              <button onClick={()=>setShowSettings(s=>!s)} aria-label="Open settings"
                style={{ background:"transparent",border:`1px solid ${theme.border}`,borderRadius:8,color:theme.textMuted,cursor:"pointer",padding:"0 12px",fontSize:16,minHeight:36,minWidth:44 }}>⚙</button>
            </div>
          </div>
        </header>

        {/* Nav */}
        <nav role="navigation" aria-label="Sections" style={{ position:"sticky",top:56,zIndex:400,background:`${theme.bg}e0`,backdropFilter:"blur(10px)",borderBottom:`1px solid ${theme.border}` }}>
          <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 24px" }}>
            <div style={{ display:"flex",gap:4,overflowX:"auto",padding:"8px 0",WebkitOverflowScrolling:"touch" }}>
              {NAV.map(item=>(
                <button key={item.id} onClick={()=>setSection(item.id)} aria-current={section===item.id?"page":undefined}
                  style={{ background:section===item.id?`${theme.accent}18`:"transparent",border:`1px solid ${section===item.id?theme.accent+"50":"transparent"}`,borderRadius:7,padding:"6px 12px",fontFamily:"Orbitron",fontSize:9,letterSpacing:1.5,fontWeight:600,textTransform:"uppercase",color:section===item.id?theme.accent:theme.textMuted,cursor:"pointer",transition:"all .15s",whiteSpace:"nowrap",minHeight:34 }}>{item.label}</button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main */}
        <main id="main-content" tabIndex={-1} style={{ position:"relative",zIndex:1 }}>
          <div style={{ maxWidth:1100,margin:"0 auto",padding:"40px 24px" }} className="main-pad">
            {section==="overview" && <SectionOverview settings={settings} />}
            {section==="arcs" && <SectionArcs settings={settings} goPlayground={goPlayground} />}
            {section==="playground" && <SectionPlayground settings={settings} playground={playground} />}
            {section==="excavation" && <SectionExcavation settings={settings} />}
            {section==="voice" && <SectionVoice settings={settings} />}
            {section==="checklist" && <SectionChecklist settings={settings} />}
          </div>
        </main>

        {/* FAB cluster */}
        <div style={{ position:"fixed",bottom:20,right:20,zIndex:600,display:"flex",flexDirection:"column",gap:8 }}>
          <button onClick={()=>setShowAI(s=>!s)} aria-label="Open memoir assistant"
            style={{ width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${theme.accent},${theme.accent2})`,border:"none",cursor:"pointer",color:"#000",fontSize:18,fontWeight:700,boxShadow:`0 0 20px ${theme.accent}50`,animation:showAI?"none":"pulse 2s infinite" }}>✦</button>
          <button onClick={()=>setShowSettings(s=>!s)} aria-label="Settings"
            style={{ width:44,height:44,borderRadius:"50%",background:theme.surface,border:`1px solid ${theme.border}`,cursor:"pointer",color:theme.textMuted,fontSize:16 }}>⚙</button>
        </div>

        <AIPanel settings={settings} open={showAI} onClose={()=>setShowAI(false)} />
        {showSettings && <SettingsDrawer settings={settings} setSettings={setSettings} onClose={()=>setShowSettings(false)} />}
      </div>
    </ThemeCtx.Provider>
  );
}
