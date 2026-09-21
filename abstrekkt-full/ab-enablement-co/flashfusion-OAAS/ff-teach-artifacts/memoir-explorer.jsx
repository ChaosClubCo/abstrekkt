import { useState, useEffect, useRef, useCallback, useId, createContext, useContext } from "react";

// ─── THEMES ──────────────────────────────────────────────────────────────────
const THEMES = {
  "Reading Room": {
    bg:"#0c0c0b",bgMid:"#111110",surface:"#181815",surfaceHi:"#1e1e1a",
    border:"#232320",borderLit:"#d4893a",
    accent:"#d4893a",accent2:"#b8722a",warm:"#e8a050",danger:"#c05050",blue:"#78afc8",
    text:"#ddd8ce",textSec:"#807c74",textMuted:"#3a3835",
    gridColor:"rgba(212,137,58,0.04)",orb1:"rgba(212,137,58,0.09)",orb2:"rgba(232,160,80,0.05)",
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
    tagline:"Reading rooms. Reading processes. Reading systems.",
    badges:["Spine","Through-Line","Confirmed"],
    explorer:"Kyle has one skill that survived every version of him: the ability to read a room. At O'Toole's, that meant knowing which customer needed distance. In QC, spotting process failures before they compounded. In engineering, diagnosing system failures the same way. The book is about how that instinct survived a brain injury — and became the thread holding the reconstruction together.",
    poweruser:"Total Brain eval (Jul 2022): Processing Speed 99th, Recall Memory 12th, Flexibility 17th, Resilience 2nd, Stress Control 27th, Focus 59th, Planning 46th. Conners CPT 3 (Jul 7 2022): all T-scores average (45-55), no ADHD, 'Sustained Attention: Some Indication.' SPECT shows toxicity/scalloping from substance abuse/oxygen deprivation. The processor survived; the storage didn't. Pattern recognition operates below the level where the damage happened.",
    admin:"Spine governance: every chapter must demonstrate the same cognitive pattern across career phases. Diagnostic instinct = reading rooms (O'Toole's) → reading processes (QC) → reading systems (engineering). Any scene that doesn't connect is a cut candidate. Clinical documentation supports the thesis: the instinct is verifiable in the data.",
    useCases:["O'Toole's customer reads","QC process gap detection","Engineering system diagnosis","Conners CPT3 + SPECT as narrative evidence"],
    mockInput:"How does the diagnostic instinct survive cognitive disruption?",
    mockOutput:`The instinct doesn't live in explicit memory.

Total Brain eval July 2022:
Processing Speed: 99th percentile.
Recall Memory: 12th percentile.

Conners CPT 3 — July 7, 2022:
T-scores: average across the board.
No ADHD.
"Sustained Attention: Some Indication."

SPECT: toxicity/scalloping visible.
Caused by substance abuse. Oxygen deprivation.

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
    tagline:"Oct 2021–Mar 2025. Stabilization AFTER the OD. 4 years.",
    badges:["Stabilization","Excavated Mar 25","⚠ Outline Conflict"],
    explorer:"O'Toole's is where the diagnostic instinct gets named and practiced — but the timeline matters: Kyle started Oct 2021, ONE MONTH after the September 2021 OD. Not 'before the break.' The 4 years there were stabilization AFTER the rupture, not the baseline before it. The locked outline puts O'Toole's in Part I ('Before the Break') — that placement is now in conflict with the locked timeline. Structural decision pending.",
    poweruser:"Timeline (locked): Injury ~2020-2021 → O'Toole's Oct 2021–Mar 2025 → QC Mar–Aug 2025 → Intinc 2025+. O'Toole's is the STABILIZATION period. Excavation complete Mar 25: Fran+Stewart (wedding bartend blocked — layered grief), Kylie+Tony (Star Wars/tech bond), face calm 98%/frantic 2%, body jaw+arms, internal screaming masked. Five scene seeds CONFIRMED as real memory. Outline conflict: Ch 1 'Reading the Room (O'Toole's)' is in Part I — may need to move to Part III or reframe as told-in-retrospect.",
    admin:"STRUCTURAL CONFLICT — locked outline places O'Toole's in Part I (Before the Break), locked timeline confirms O'Toole's started post-OD. Two resolution paths: (1) reframe the 'break' as something earlier than the OD — childhood, or the first addiction year — making O'Toole's relative-before-the-final-break. (2) move O'Toole's to Part III as stabilization. Do not resolve silently. Kyle must confirm narrative placement before drafting Part I.",
    useCases:["Diagnostic instinct in action","Stabilization period evidence","Structural placement decision","Face/body dual-track scene"],
    mockInput:"Where does O'Toole's fit in the story?",
    mockOutput:`Timeline is locked.

OD: September 2021.
O'Toole's: October 2021.

One month between them.

The outline calls it "Before the Break."
The calendar says otherwise.

Which means either:
(1) The "break" isn't the OD — it's something earlier.
    The childhood sentence: "I've never been exceptional."
    Maybe that's the break the book is actually about.
    And the OD is just the most visible consequence.

(2) The outline needs to move.
    O'Toole's in Part III.
    Stabilization as construction's first scaffold.

Both are defensible.
Neither can be decided without Kyle.

The bars open at 4.
He was there at 3:30.
Reading who was going to be a problem.
One month out of his own crisis.

That's not "before the break."
That's the beginning of the build.`,
  },
  { id:"rupture",name:"The Rupture",sym:"∅",colorKey:"danger",
    tagline:"Hardware failure. Milwaukee. Pete. The recursive trap.",
    badges:["Part II","Core","Reframed Apr 2026"],
    explorer:"The break wasn't one event — it was a cascade. Homeless in Milwaukee: Salvation Army, hotels where Kyle didn't have enough money for the next night most nights. Pete was his Salvation Army roommate; they became construction work partners, then Pete relapsed, overdosed, and died. Dre relationship deteriorated during this period. Michael relationship after TBI — gaslighting pattern, Xanax relapse trigger. Heroin OD September 2021. No bottom, just a floor that kept lowering.",
    poweruser:"Actual structure per MEMOIR_TIMELINE_UPDATE_APR2026.md: childhood trauma → substance abuse as self-medication → TBI from OD → deeper dependency → failed reconstruction (Michael) → turnaround practices → bartending stabilization (4 years O'Toole's) → late-life emergence. Career: Michaels (mgmt 4mo) → Walmart → O'Toole's → Sole Revival → Intinc. Amen eval date conflict: p2 says 'summer 2020,' p3+physician says 'Oct 2021.' DO NOT RESOLVE. SPECT shows toxicity/scalloping from substance abuse/oxygen deprivation. Conners CPT3 (Jul 7 2022): average scores, no ADHD, 'Sustained Attention (Some Indication).'",
    admin:"The rupture is not the book's climax — it's its premise. Pete's death is the cost ledger's sharpest line. Michael placement (before or after O'Toole's?) unknown — needs excavation. Kinsley's birth timing relative to TBI: unknown. Gap year 2020-2022 confirmed EMPTY across 8 archive searches — no excavated material from the rupture period itself.",
    useCases:["Part II opening","Pete — cost ledger scene","Salvation Army period","SPECT/clinical record as evidence"],
    mockInput:"What caused the brain injury?",
    mockOutput:`Not what you'd expect.

"I was homeless living in Salvation Army, hotels where
I didn't have enough money for the next night most nights,
to my own duplex room and then my own apartment,
granted, I relapsed had a brain injury in there,
but then I cleaned up."

That sentence is the book's jacket copy.
It came out in a session about FlashFusion.
Not in a memoir session.

Pete was his Salvation Army roommate.
Then a construction work partner.
Then Pete relapsed.
Then Pete died.

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
  { id:"thegap",name:"The Gap",sym:"—",colorKey:"danger",
    tagline:"Suicidal content period → systematic tool orchestration. Unexcavated hinge.",
    badges:["Connective Tissue","Critical","NOT EXCAVATED"],
    explorer:"There's a period in the archive characterized by graphic suicidal content. There's a separate period of systematic tool orchestration. What happened in between is the hinge of the entire construction thesis — the moment building started. It hasn't been touched. It may require dedicated session work. It may be genuinely inaccessible. Both are valid. Neither can be ignored in the book.",
    poweruser:"From memoir-blind-spots.html (confirmed): 'The archive contains a period characterized by graphic suicidal content and a separate period of systematic tool orchestration. What happened in between is the hinge of the construction thesis — the moment building started. It's also the most sensitive gap in the project.' Related: TBI workplace disclosure Mar 2026 — 23 minutes to call Nicole. 'I'm not broken. My brain routes differently.' That moment is a candidate anchor scene for The Gap's resolution.",
    admin:"This gap gates Thread 3 (The Construction Project). Without it the construction arc has no origin — no moment when building started instead of surviving. Protected material: approach carefully. Boundary decision required before excavation: what's in the book, what's named but not detailed, what stays opaque intentionally. Openness about inaccessibility is itself a narrative option.",
    useCases:["Thread 3 origin point","TBI disclosure scene anchor","Transition from survival to construction","Memoir's most sensitive excavation"],
    mockInput:"What happened between the crisis period and the construction period?",
    mockOutput:`That's the question the book hinges on.

The archive has a period of graphic suicidal content.
Then a gap.
Then a period of systematic tool orchestration.

What's in the gap is what the book is about.

Not what happened to him.
What he decided — or stumbled into deciding —
to do instead.

March 2026. 23 minutes to call Nicole.
"I have a documented TBI. Roughly 5 years ago.
It specifically affects executive function and memory.
I am capable of doing this job —
the gap is in logging and tracking work,
not doing it."

23 minutes.
To say: I'm not broken.
My brain routes differently.

That sentence is somewhere in the gap.

What came before it
is the book's job to find.`,
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
  // CRITICAL
  { id:"c1",priority:"critical",title:"Gap Year 2020-2022 — Confirmed Empty",owner:"Kyle",done:false,note:"Confirmed empty across 8 archive searches. AMEN eval July 2022. TBI ~2020-21. The rupture period has NO excavated material. Thread 2 (Rupture) has no content without it." },
  { id:"c2",priority:"critical",title:"Zero Chapters Drafted — 0 of 5 Threads",owner:"Kyle+Claude",done:false,note:"Voice defined, thesis locked, 5 seeds confirmed. No prose at chapter length. Structural decision (4 options, none chosen) cannot be made until one chapter exists." },
  { id:"c3",priority:"critical",title:"Turnaround Sequence — Order Unknown",owner:"Kyle",done:false,note:"Meditation, therapy, coaching, recovery programs — timeline and order unexcavated. Which came first? What clicked when? These are the mechanisms of construction. Thread 3 stays abstract without them." },
  { id:"c4",priority:"critical",title:"Session 3: Tool Archaeology — NOT STARTED",owner:"Kyle+Claude",done:false,note:"Chapter 8 (The Arsenal) needs chronological tool mapping. Session 1 = O'Toole's (Mar 25), Session 2 = scene seed confirmation. Session 3 is the open question." },
  { id:"c5",priority:"critical",title:"Pete — Salvation Army Roommate, Overdosed and Died",owner:"Kyle",done:false,note:"Pete: Salvation Army roommate → construction work partner → relapsed → overdosed and died. Sharpest line on the cost ledger. Not excavated at all. Needs dedicated session." },
  { id:"c6",priority:"critical",title:"Kinsley Scenes — None Exist",owner:"Kyle",done:false,note:"Memoir is a letter to Kinsley. Zero specific scenes of her exist in the archive. Appears only in custody scheduling and app notes. Absence may be protective — at some point one real scene must exist." },
  { id:"c7",priority:"critical",title:"Life Coach / Going West — Confirmed Empty",owner:"Kyle",done:false,note:"8 searches returned nothing. The life coach (Soaring Bear, Sedona) is mentioned in architecture but has zero excavated material. This may be the pivot from old-Kyle to construction-Kyle." },
  { id:"c8",priority:"critical",title:"Amen Eval Date Conflict — Document, Don't Resolve",owner:"Claude",done:true,note:"p2 says summer 2020, p3+physician says Oct 2021. Confirmed narratively useful. The physician's record demonstrates the same memory confusion as the patient. DO NOT resolve prematurely." },
  // HIGH
  { id:"h1",priority:"high",title:"O'Toole's — Excavated But NOT Drafted",owner:"Kyle+Claude",done:false,note:"Excavation complete March 25. Nothing converted to prose. Thread 1 (Before the Break) exists as confirmed seeds, not a chapter. Lowest-barrier entry point for first draft." },
  { id:"h2",priority:"high",title:"Tom Ropel — 'An Entire Chapter By Itself'",owner:"Kyle",done:false,note:"Best friend growing up. Married, two kids, Oliver at Kinsley's birthday. NOT YET EXCAVATED. What happened between settlement money era and reunion?" },
  { id:"h3",priority:"high",title:"Dave Datt — Funeral Scene Needed",owner:"Kyle",done:false,note:"Brain aneurysm death, 20s or 30s. Kyle attended funeral. What year? What was Kyle like walking in? Parallel failure arc (both flunked out, different outcomes)." },
  { id:"h4",priority:"high",title:"NIU Expulsion 2016 — Full Arc",owner:"Kyle",done:false,note:"Kicked out for not keeping grades up. What was Kyle doing? What was the spiral? CLC layered on top: ~6 years, ~10 withdrawals, ~5 failures to complete." },
  { id:"h5",priority:"high",title:"Card Table Sequence — Anchor Scene",owner:"Kyle+Claude",done:true,note:"LOCKED April 2026. Confirmed: Phillis → Sedona → Bear → card table → screenshot method → Chaos Club. 1:30am photo exists." },
  { id:"h6",priority:"high",title:"Childhood / Pre-Break Origin",owner:"Kyle",done:false,note:"Key quote: 'I've never, NOT once, EVER been exceptional at anything, NOTHING.' — erupted mid-argument, March 2026. That's a childhood sentence, not an injury sentence. The break may predate the TBI." },
  // MEDIUM
  { id:"m1",priority:"medium",title:"Structure Not Decided — 4 Options, None Chosen",owner:"Kyle+Claude",done:false,note:"Options: (1) chronological with flashbacks, (2) systems as chapters, (3) parallel timelines, (4) Arsenal structure. Must draft one chapter before committing." },
  { id:"m2",priority:"medium",title:"Michael Relationship — NOW EXCAVATED",owner:"Kyle+Claude",done:true,note:"Post-TBI relationship: gaslighting, Xanax relapse trigger, dismissed restraining order, reconciliation, ex-husband chaos arc. Full material documented in MEMOIR_TIMELINE_UPDATE_APR2026.md. Placement question remains: before or after O'Toole's?" },
  { id:"m2b",priority:"medium",title:"O'Toole's Structural Placement — Conflict with Locked Outline",owner:"Kyle",done:false,note:"Outline: O'Toole's in Part I (Before the Break). Timeline: O'Toole's starts Oct 2021 (AFTER OD). Kyle must decide: reframe 'the break,' or move O'Toole's to Part III as stabilization. Cannot draft Part I without resolving." },
  { id:"m3",priority:"medium",title:"Kinsley's Birth — Before or After TBI?",owner:"Kyle",done:false,note:"Timeline placement unknown. How did fatherhood intersect with reconstruction? Was she born before or after turnaround? Narrative stakes depend on this." },
  { id:"m4",priority:"medium",title:"$50K Spending Spree — Detail Pass",owner:"Kyle",done:false,note:"More detail on the 3-4 months. What was the car? When did Kyle realize the money was gone?" },
  { id:"m5",priority:"medium",title:"Ryan at CLC — The Unanswered Outreach",owner:"Kyle",done:false,note:"Ryan looked 'focused or something else.' Kyle reached out once, nothing back. Now a counselor at CLC. One of Kyle's five is at the institution Kyle wants to partner with." },
  // LOW
  { id:"l1",priority:"low",title:"O'Toole's Seeds 3 & 4 — Verify Before Draft",owner:"Kyle",done:false,note:"Seed 3 (streetlights walk): real memory or AI extrapolation absorbed as true? Seed 4 (couch): specific person/place confirmed? Verify before prose pass." },
  { id:"l2",priority:"low",title:"Song Archive Dating — 28 Songs, No Written-On Dates",owner:"Kyle",done:false,note:"28 unique songs post-dedup. No written-on dates. Structural problem for memoir timeline use." },
  { id:"l3",priority:"low",title:"First Tool/System That Actually Helped",owner:"Kyle",done:false,note:"Calendar? Documentation? Which specific app? This is the opening moment of Thread 3 (Construction). Currently unknown." },
  { id:"l4",priority:"low",title:"CLC AA Degree — Completed 2025",owner:"Claude",done:true,note:"~6 years, ~10 withdrawals, ~5 failures. Completed 2025. The kid who needed 15 attempts to finish an associate's, walks back in as the teacher. CLC is a layered narrative site: failure, Ryan (now counselor), Kyle's return." },
  { id:"l5",priority:"low",title:"TBI Workplace Disclosure Scene — March 2026",owner:"Kyle+Claude",done:false,note:"23 minutes to call Nicole. 'I'm not broken. My brain routes differently.' This is a candidate anchor scene for The Gap arc. Needs full sensory excavation." },
];


// ─── HELPERS ─────────────────────────────────────────────────────────────────
function Label({ children, color }) {
  const { theme } = useTheme();
  return <span style={{ fontFamily:"Playfair Display,serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",fontWeight:600,color:color||theme.textMuted }}>{children}</span>;
}

function Term({ content, color, sx = {} }) {
  const { theme } = useTheme();
  const c = color || theme.accent;
  return (
    <div style={{ background:"#020508",border:`1px solid ${c}25`,borderRadius:8,padding:"14px 16px",position:"relative",overflow:"hidden",fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:theme.textSec,lineHeight:1.7,...sx }}>
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
            <span style={{ fontFamily:"IBM Plex Sans,sans-serif",fontWeight:600,fontSize:14,color:theme.text }}>{title}</span>
            {badge && <span style={{ fontFamily:"Playfair Display,serif",fontSize:8,letterSpacing:1.5,textTransform:"uppercase",fontWeight:700,color:c,background:`${c}18`,border:`1px solid ${c}40`,padding:"2px 7px",borderRadius:4 }}>{badge}</span>}
          </div>
          {subtitle && <div style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:theme.textMuted,marginTop:2 }}>{subtitle}</div>}
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
              <div id={`pc-${uid}`} style={{ fontFamily:"Playfair Display,serif",fontSize:15,fontWeight:700,color:theme.text }}>{arc.name}</div>
              <div style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:theme.textMuted,marginTop:4 }}>{arc.tagline}</div>
            </div>
            <button ref={closeRef} onClick={onClose} aria-label="Close"
              style={{ background:"transparent",border:`1px solid ${theme.border}`,borderRadius:6,color:theme.textMuted,cursor:"pointer",padding:"4px 10px",fontSize:14,minHeight:30,minWidth:44 }}>✕</button>
          </div>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:16 }}>
            {arc.badges.map(b=><span key={b} style={{ fontFamily:"Playfair Display,serif",fontSize:8,letterSpacing:1.5,textTransform:"uppercase",fontWeight:700,color:c,background:`${c}18`,border:`1px solid ${c}35`,padding:"3px 8px",borderRadius:4 }}>{b}</span>)}
          </div>
        </div>
        <div style={{ padding:"0 24px 24px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }} className="two-col">
          <div>
            <Label color={c}>Scene Arc</Label>
            <p style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:theme.textSec,lineHeight:1.7,marginTop:8,marginBottom:12 }}>{arc.explorer}</p>
            <Label color={c}>Use Cases</Label>
            <div style={{ marginTop:8,display:"flex",flexDirection:"column",gap:4 }}>
              {arc.useCases.map(u=><div key={u} style={{ display:"flex",alignItems:"center",gap:8,fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:theme.textSec }}><span style={{ color:c,fontSize:8 }}>▶</span>{u}</div>)}
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
          <legend style={{ fontFamily:"Playfair Display,serif",fontSize:9,letterSpacing:2,color:theme.textMuted,padding:"0 4px" }}>THEME</legend>
          {Object.keys(THEMES).map(name=>(
            <label key={name} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8,cursor:"pointer",fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:theme.textSec }}>
              <input type="radio" name={`th-${uid}`} checked={settings.theme===name} onChange={()=>upd("theme",name)} style={{ cursor:"pointer" }} />
              <span style={{ width:14,height:14,borderRadius:3,background:THEMES[name].accent,display:"inline-block",border:`1px solid ${THEMES[name].borderLit}40` }} />
              {name}
            </label>
          ))}
        </fieldset>
        <fieldset style={{ border:`1px solid ${theme.border}`,borderRadius:8,padding:"12px 14px" }}>
          <legend style={{ fontFamily:"Playfair Display,serif",fontSize:9,letterSpacing:2,color:theme.textMuted,padding:"0 4px" }}>PERSONA</legend>
          {[["explorer","Explorer"],["poweruser","Power User"],["admin","Admin"]].map(([v,l])=>(
            <label key={v} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8,cursor:"pointer",fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:theme.textSec }}>
              <input type="radio" name={`ps-${uid}`} checked={settings.persona===v} onChange={()=>upd("persona",v)} style={{ cursor:"pointer" }} />{l}
            </label>
          ))}
        </fieldset>
        <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
          <label htmlFor={`ak-${uid}`} style={{ fontFamily:"Playfair Display,serif",fontSize:9,letterSpacing:2,color:theme.textMuted }}>API KEY (SESSION ONLY)</label>
          <div style={{ display:"flex",gap:6 }}>
            <input id={`ak-${uid}`} type={showKey?"text":"password"} value={settings.apiKey} onChange={e=>upd("apiKey",e.target.value)} placeholder="sk-ant-..."
              style={{ flex:1,background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:6,padding:"8px 10px",color:theme.text,fontFamily:"IBM Plex Mono,monospace",fontSize:11,outline:"none" }} />
            <button onClick={()=>setShowKey(s=>!s)} aria-label={showKey?"Hide key":"Show key"}
              style={{ background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:6,color:theme.textMuted,cursor:"pointer",padding:"0 10px",minHeight:36,minWidth:44 }}>{showKey?"○":"●"}</button>
          </div>
        </div>
        <div style={{ opacity:0.4,display:"flex",flexDirection:"column",gap:6 }}>
          <label style={{ fontFamily:"Playfair Display,serif",fontSize:9,letterSpacing:2,color:theme.textMuted }}>AZURE ENDPOINT (UNAVAILABLE)</label>
          <input disabled placeholder="Available after provisioning" style={{ background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:6,padding:"8px 10px",color:theme.textMuted,fontFamily:"IBM Plex Sans,sans-serif",fontSize:12 }} />
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
          <label htmlFor={`tmp-${uid}`} style={{ fontFamily:"Playfair Display,serif",fontSize:9,letterSpacing:2,color:theme.textMuted }}>TEMPERATURE — {settings.temperature.toFixed(2)}</label>
          <input id={`tmp-${uid}`} type="range" min={0} max={2} step={0.01} value={settings.temperature} onChange={e=>upd("temperature",parseFloat(e.target.value))} aria-describedby={`tmp-d-${uid}`} style={{ width:"100%",accentColor:theme.accent }} />
          <div id={`tmp-d-${uid}`} style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:11,color:theme.textMuted }}>0 = focused · 2 = creative</div>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
          <label htmlFor={`mt-${uid}`} style={{ fontFamily:"Playfair Display,serif",fontSize:9,letterSpacing:2,color:theme.textMuted }}>MAX TOKENS — {settings.maxTokens}</label>
          <input id={`mt-${uid}`} type="range" min={100} max={2000} step={50} value={settings.maxTokens} onChange={e=>upd("maxTokens",parseInt(e.target.value))} style={{ width:"100%",accentColor:theme.accent }} />
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          <Label color={theme.textMuted}>OPTIONS</Label>
          {[["showTips","Show AI Tips"],["forceMock","Force Mock Mode"],["compact","Compact Navigation"]].map(([k,l])=>(
            <label key={k} style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:theme.textSec }}>
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
1. Amen Clinic eval (July 2022): Processing Speed 99th percentile, Recall Memory 12th. Conners CPT3 (Jul 7 2022): average T-scores, no ADHD, sustained attention flagged. SPECT shows toxicity/scalloping. Engine works; storage doesn't.
2. Book thesis: Construction (building what never existed) vs Recovery (returning to what was lost). Recovery assumes a prior baseline — there is none.
3. Actual narrative arc: childhood trauma → substance abuse → TBI from OD → deeper dependency → failed reconstruction (Michael relationship) → turnaround practices → O'Toole's stabilization (4 years) → late-life emergence (L1 → self-taught builder). Career: Michaels → Walmart → O'Toole's → Sole Revival → Intinc.
4. The diagnostic instinct (reading rooms → processes → systems) is the book's spine. Survived the brain injury. Connects bartending to QC to engineering.
5. Pete: Salvation Army roommate → construction partner → relapsed → overdosed and died. Sharpest line on the cost ledger. The book is a letter to Kyle's daughter Kinsley.
6. Status as of Apr 2026: 0 chapters drafted. 17 blind spots documented. 8 critical gaps block drafting. Session 3 (Tool Archaeology) not done.
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
        <div style={{ fontFamily:"Playfair Display,serif",fontSize:10,letterSpacing:2,color:theme.accent }}>MEMOIR ASSISTANT</div>
        <button onClick={onClose} aria-label="Close assistant" style={{ background:"transparent",border:"none",color:theme.textMuted,cursor:"pointer",fontSize:14,minHeight:30,minWidth:30 }}>✕</button>
      </div>
      {msgs.length===0 && (
        <div style={{ padding:"12px 16px",display:"flex",flexDirection:"column",gap:8 }}>
          <div style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:theme.textMuted,marginBottom:4 }}>Try asking:</div>
          {SUGGESTED.map(s=>(
            <button key={s} onClick={()=>send(s)} style={{ background:`${theme.accent}10`,border:`1px solid ${theme.accent}30`,borderRadius:8,padding:"8px 12px",textAlign:"left",fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:theme.textSec,cursor:"pointer",lineHeight:1.4,minHeight:44 }}>{s}</button>
          ))}
        </div>
      )}
      <div ref={msgRef} aria-live="polite" style={{ flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:10 }}>
        {msgs.map((m,i)=>(
          <div key={i} style={{ alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"85%",background:m.role==="user"?`${theme.accent}20`:theme.bgMid,border:`1px solid ${m.role==="user"?theme.accent+"40":theme.border}`,borderRadius:m.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px",padding:"8px 12px",fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:theme.textSec,lineHeight:1.6,whiteSpace:"pre-wrap" }}>
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
          style={{ flex:1,resize:"none",background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:8,padding:"8px 10px",color:theme.text,fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,outline:"none" }} />
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
        <div style={{ fontFamily:"Playfair Display,serif",fontSize:9,letterSpacing:4,textTransform:"uppercase",color:theme.accent,marginBottom:12 }}>LITERARY MEMOIR — ACTIVE EXCAVATION</div>
        <h1 style={{ fontFamily:"Playfair Display,serif",fontSize:"clamp(18px,3.5vw,28px)",fontWeight:900,margin:"0 0 16px",background:`linear-gradient(110deg,${theme.accent},${theme.accent2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Construction, Not Recovery</h1>
        <p style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:14,color:theme.textSec,maxWidth:560,margin:"0 auto 24px",lineHeight:1.8 }}>{heroText[p]||heroText.explorer}</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,maxWidth:560,margin:"0 auto" }}>
          {[
            { val:"17",label:"Blind Spots",sub:"4 categories",color:theme.danger },
            { val:"8",label:"Critical Gaps",sub:"block drafting",color:theme.danger },
            { val:"0",label:"Chapters Drafted",sub:"of 5 threads",color:theme.warm },
            { val:"3",label:"Active Conflicts",sub:"pre-publish",color:theme.accent },
          ].map(s=>(
            <div key={s.label} style={{ background:theme.surface,border:`1px solid ${s.color}30`,borderRadius:10,padding:"12px 8px",textAlign:"center" }}>
              <div style={{ fontFamily:"Playfair Display,serif",fontSize:20,fontWeight:700,color:s.color }}>{s.val}</div>
              <div style={{ fontFamily:"IBM Plex Sans,sans-serif",fontWeight:600,fontSize:11,color:theme.text,marginTop:2 }}>{s.label}</div>
              <div style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:10,color:theme.textMuted }}>{s.sub}</div>
            </div>
          ))}
        </div>
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
                  <div style={{ fontFamily:"IBM Plex Sans,sans-serif",fontWeight:700,fontSize:13,color:theme.text }}>{arc.name}</div>
                  <div style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:11,color:theme.textMuted,lineHeight:1.4 }}>{arc.tagline}</div>
                </div>
              </div>
              <div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>
                {arc.badges.slice(0,2).map(b=><span key={b} style={{ fontFamily:"Playfair Display,serif",fontSize:7,letterSpacing:1.5,textTransform:"uppercase",fontWeight:700,color:c,background:`${c}18`,border:`1px solid ${c}30`,padding:"2px 6px",borderRadius:3 }}>{b}</span>)}
              </div>
            </div>
          );
        })}
      </div>

      <AccordionCard title="Locked Timeline" subtitle="Confirmed dates — PROJECT_STATE.md" icon="⟁" color={theme.blue} badge="LOCKED">
        <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
          {[
            ["2018–2020","Michaels — retail management","Advanced to mgmt within 4 months. First documented operational competence pattern.","solid"],
            ["2019–2020","Walmart — Customer Service Manager","SOPs, team management, consistent service delivery.","solid"],
            ["2018–2021","Addiction timeline — overlapping","Substance dependency, rehab cycles (×5), Salvation Army Milwaukee, Pete overdose, Dre, Kinsley's mom.","gap"],
            ["~2020–2021","OD → Traumatic Brain Injury","Exact date unclear. AMEN eval July 2022 — ~1 year after injury. SPECT: toxicity/scalloping.","gap"],
            ["Oct 2021","O'Toole's begins","4-year stabilization period AFTER the OD. Diagnostic instinct in practice.","solid"],
            ["Jul 2022","AMEN Clinics evaluation","SPECT + neuropsych (Conners CPT3). TBI confirmed. All files in Gmail.","solid"],
            ["Mar 2025","QC — The Sole Revival","Diagnostic instinct applied to objects.","solid"],
            ["Aug 2025","Intinc begins","L1 Service Desk Tech. Self-initiated AI/security work.","solid"],
            ["2025","CLC AA degree completed","~6 years, ~10 withdrawals, ~5 failures to complete. Finished.","solid"],
            ["Mar 2026","TBI workplace disclosure","23 minutes to call. 'I'm not broken. My brain routes differently.'","solid"],
          ].map(([date,event,note,type])=>(
            <div key={event} style={{ display:"flex",gap:12,padding:"8px 12px",background:type==="gap"?`${theme.danger}08`:theme.bgMid,borderRadius:8,border:`1px solid ${type==="gap"?theme.danger+"25":theme.border}` }}>
              <div style={{ fontFamily:"Playfair Display,serif",fontSize:9,color:type==="gap"?theme.danger:theme.blue,whiteSpace:"nowrap",marginTop:2,minWidth:70 }}>{date}</div>
              <div>
                <div style={{ fontFamily:"IBM Plex Sans,sans-serif",fontWeight:600,fontSize:12,color:theme.text }}>{event}{type==="gap"&&<span style={{ fontFamily:"Playfair Display,serif",fontSize:7,color:theme.danger,marginLeft:6 }}>GAP</span>}</div>
                <div style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:11,color:theme.textMuted,lineHeight:1.5 }}>{note}</div>
              </div>
            </div>
          ))}
        </div>
      </AccordionCard>

      <div style={{ marginTop:12 }}>
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
              <div style={{ fontFamily:"Playfair Display,serif",fontSize:8,letterSpacing:1.5,color:theme.accent,whiteSpace:"nowrap",marginTop:2 }}>{part}</div>
              <div>
                <div style={{ fontFamily:"IBM Plex Sans,sans-serif",fontWeight:600,fontSize:13,color:theme.text }}>{title}</div>
                <div style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:theme.textMuted,lineHeight:1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </AccordionCard>
      </div>

      {settings.showTips && (
        <div style={{ marginTop:20,padding:"14px 16px",background:`${theme.accent}08`,border:`1px solid ${theme.accent}30`,borderRadius:10,borderLeft:`3px solid ${theme.accent}` }}>
          <Label color={theme.accent}>AI TIP</Label>
          <p style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:theme.textSec,margin:"6px 0 0",lineHeight:1.6 }}>
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
        <h2 style={{ fontFamily:"Playfair Display,serif",fontSize:16,fontWeight:700,color:theme.text,margin:"8px 0 4px" }}>Chapter Arcs & Scene Seeds</h2>
        <p style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:theme.textMuted }}>All excavated material, confirmed scene seeds, and narrative status by chapter arc.</p>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        {ARCS.map(arc=>{
          const c = theme[arc.colorKey]||theme.accent;
          return (
            <AccordionCard key={arc.id} id={arc.id} title={arc.name} subtitle={arc.tagline} icon={arc.sym} color={c} badge={arc.badges[0]}>
              <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
                <p style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:theme.textSec,lineHeight:1.7,margin:0 }}>{arc[p]||arc.explorer}</p>
                <div>
                  <Label color={c}>Use Cases</Label>
                  <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginTop:6 }}>
                    {arc.useCases.map(u=><span key={u} style={{ background:`${c}12`,border:`1px solid ${c}30`,borderRadius:6,padding:"4px 10px",fontFamily:"IBM Plex Sans,sans-serif",fontSize:11,color:theme.textSec }}>{u}</span>)}
                  </div>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }} className="two-col">
                  <div><Label color={c}>Sample Input</Label><Term content={arc.mockInput} color={c} sx={{ marginTop:6,fontSize:11 }} /></div>
                  <div><Label color={c}>Sample Output</Label><Term content={arc.mockOutput} color={c} sx={{ marginTop:6,fontSize:11,lineHeight:1.6 }} /></div>
                </div>
                <div style={{ display:"flex",gap:8 }}>
                  <button ref={el=>{ cardRefs.current[arc.id]=el; }} onClick={()=>setOpenCard(arc)}
                    style={{ background:`${c}18`,border:`1px solid ${c}40`,borderRadius:8,padding:"8px 14px",cursor:"pointer",fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:c,minHeight:36 }}>Full Details</button>
                  <button onClick={()=>goPlayground({ input:arc.mockInput, sys:`You are a memoir writing assistant for "Construction, Not Recovery," focusing on the "${arc.name}" arc.` })}
                    style={{ background:"transparent",border:`1px solid ${theme.border}`,borderRadius:8,padding:"8px 14px",cursor:"pointer",fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:theme.textMuted,minHeight:36 }}>Try in Playground →</button>
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
        <h2 style={{ fontFamily:"Playfair Display,serif",fontSize:16,fontWeight:700,color:theme.text,margin:"8px 0 4px" }}>AI Writing Lab</h2>
        <div style={{ display:"flex",alignItems:"center",gap:8 }} role="status" aria-label={isMock?"Mock mode active":"Live mode active"}>
          <div style={{ width:8,height:8,borderRadius:"50%",background:isMock?theme.warm:theme.blue,boxShadow:`0 0 8px ${isMock?theme.warm:theme.blue}`,animation:"pulse 2s infinite" }} />
          <Label color={isMock?theme.warm:theme.blue}>{isMock?"MOCK MODE":"LIVE MODE"}</Label>
        </div>
      </div>

      <AccordionCard title="System Prompt" subtitle="Memoir writing context" icon="⟁" color={theme.accent}>
        <label htmlFor={`sp-${uid}`} style={{ position:"absolute",left:-9999,width:1,height:1,overflow:"hidden" }}>System prompt</label>
        <textarea id={`sp-${uid}`} value={sys} onChange={e=>setSys(e.target.value)} rows={5}
          style={{ width:"100%",boxSizing:"border-box",background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:8,padding:"10px 12px",color:theme.text,fontFamily:"IBM Plex Mono,monospace",fontSize:11,lineHeight:1.6,resize:"vertical",outline:"none" }} />
      </AccordionCard>

      <div style={{ marginTop:12 }}>
        <AccordionCard title="Model Parameters" subtitle="Temperature and token controls" icon="◈" color={theme.blue}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }} className="two-col">
            <div>
              <label htmlFor={`t-${uid}`} style={{ fontFamily:"Playfair Display,serif",fontSize:9,letterSpacing:2,color:theme.textMuted,display:"block",marginBottom:8 }}>TEMPERATURE — {temp.toFixed(2)}</label>
              <input id={`t-${uid}`} type="range" min={0} max={2} step={0.01} value={temp} onChange={e=>setTemp(parseFloat(e.target.value))} style={{ width:"100%",accentColor:theme.blue }} />
            </div>
            <div>
              <label htmlFor={`m-${uid}`} style={{ fontFamily:"Playfair Display,serif",fontSize:9,letterSpacing:2,color:theme.textMuted,display:"block",marginBottom:8 }}>MAX TOKENS — {mt}</label>
              <input id={`m-${uid}`} type="range" min={100} max={2000} step={50} value={mt} onChange={e=>setMt(parseInt(e.target.value))} style={{ width:"100%",accentColor:theme.blue }} />
            </div>
          </div>
        </AccordionCard>
      </div>

      <div style={{ marginTop:16 }}>
        <label htmlFor={`up-${uid}`} style={{ fontFamily:"Playfair Display,serif",fontSize:9,letterSpacing:2,color:theme.textMuted,display:"block",marginBottom:8 }}>USER PROMPT</label>
        <textarea id={`up-${uid}`} value={userP} onChange={e=>setUserP(e.target.value)} rows={4} placeholder="Write the opening of the card table scene in Kyle's voice..."
          style={{ width:"100%",boxSizing:"border-box",background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:8,padding:"10px 12px",color:theme.text,fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,lineHeight:1.6,resize:"vertical",outline:"none" }} />
      </div>
      <div style={{ display:"flex",gap:10,marginTop:12 }}>
        <button onClick={run} disabled={!userP.trim()||loading}
          style={{ background:theme.accent,border:"none",borderRadius:8,color:"#000",cursor:"pointer",padding:"10px 20px",fontFamily:"IBM Plex Sans,sans-serif",fontWeight:700,fontSize:13,opacity:!userP.trim()||loading?0.4:1,minHeight:44 }}>{loading?"Running...":"Run"}</button>
        <button onClick={()=>{ setUserP(""); setResp(""); }}
          style={{ background:"transparent",border:`1px solid ${theme.border}`,borderRadius:8,color:theme.textMuted,cursor:"pointer",padding:"10px 20px",fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,minHeight:44 }}>Clear</button>
      </div>

      {(resp||loading) && (
        <div style={{ marginTop:20 }}>
          <Label color={theme.accent}>RESPONSE</Label>
          <div aria-live="polite" style={{ marginTop:8,background:"#020508",border:`1px solid ${theme.accent}25`,borderRadius:8,padding:"16px 18px",fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:theme.textSec,lineHeight:1.8,whiteSpace:"pre-wrap",minHeight:80,position:"relative",overflow:"hidden" }}>
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
        <h2 style={{ fontFamily:"Playfair Display,serif",fontSize:16,fontWeight:700,color:theme.text,margin:"8px 0 4px" }}>Session Framework</h2>
        <p style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:theme.textMuted }}>The five-step excavation protocol for each memoir session.</p>
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:28,flexWrap:"wrap" }}>
        {STEPS.map((s,i)=>(
          <button key={i} onClick={()=>setStep(i)} aria-label={`Step ${s.num}: ${s.title}`} aria-current={i===step?"true":undefined}
            style={{ display:"flex",alignItems:"center",gap:8,background:i===step?`${theme.accent}20`:"transparent",border:`1px solid ${i===step?theme.accent+"70":theme.border}`,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:i===step?theme.accent:theme.textMuted,minHeight:44,transition:"all .2s" }}>
            <span style={{ fontFamily:"Playfair Display,serif",fontSize:9 }}>{s.num}</span>
            <span className="hide-sm">{s.title}</span>
          </button>
        ))}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }} className="two-col">
        <div>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
            <div style={{ width:44,height:44,borderRadius:10,background:`${theme.accent}18`,border:`1px solid ${theme.accent}40`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Playfair Display,serif",fontSize:14,fontWeight:700,color:theme.accent }}>{cur.num}</div>
            <div style={{ fontFamily:"Playfair Display,serif",fontSize:13,fontWeight:700,color:theme.text }}>{cur.title}</div>
          </div>
          <p style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:theme.textSec,lineHeight:1.7,margin:"0 0 16px" }}>{desc}</p>
          <div style={{ padding:"10px 14px",background:`${theme.warm}08`,border:`1px solid ${theme.warm}30`,borderLeft:`3px solid ${theme.warm}`,borderRadius:8 }}>
            <Label color={theme.warm}>SESSION TIP</Label>
            <p style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:theme.textSec,margin:"6px 0 0",lineHeight:1.6 }}>{cur.tip}</p>
          </div>
        </div>
        <div>
          <Label color={theme.accent}>EXAMPLE COMMAND</Label>
          <Term content={cur.action} color={theme.accent} sx={{ marginTop:8,fontSize:11 }} />
        </div>
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",marginTop:24 }}>
        <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}
          style={{ background:"transparent",border:`1px solid ${theme.border}`,borderRadius:8,padding:"8px 16px",cursor:"pointer",fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:theme.textMuted,opacity:step===0?0.3:1,minHeight:44 }}>← Back</button>
        <button onClick={()=>setStep(s=>Math.min(STEPS.length-1,s+1))} disabled={step===STEPS.length-1}
          style={{ background:theme.accent,border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontFamily:"IBM Plex Sans,sans-serif",fontWeight:700,fontSize:13,color:"#000",opacity:step===STEPS.length-1?0.3:1,minHeight:44 }}>Next →</button>
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
      desc:"The spine layer holds the book together. The diagnostic instinct — reading rooms, processes, systems — must be legible across the bartender → QC → engineering arc. Any scene that doesn't connect to it is a candidate for cutting.",
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
        <h2 style={{ fontFamily:"Playfair Display,serif",fontSize:16,fontWeight:700,color:theme.text,margin:"8px 0 4px" }}>Narrative Layers</h2>
        <p style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:theme.textMuted }}>Three-layer narrative governance: frame, spine, scene.</p>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:28 }}>
        {LAYERS.map(r=>(
          <AccordionCard key={r.name} title={r.name} subtitle={r.access} icon="◇" color={r.color}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }} className="two-col">
              <p style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:theme.textSec,lineHeight:1.7,margin:0 }}>{r.desc}</p>
              <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                {r.items.map(it=>(
                  <div key={it} style={{ display:"flex",alignItems:"flex-start",gap:8,fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:theme.textSec,lineHeight:1.5 }}>
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
            <div key={r} style={{ display:"flex",gap:8,marginBottom:8,fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:theme.textSec }}>
              <span style={{ color:theme.blue,fontSize:10 }}>✓</span>{r}
            </div>
          ))}
        </AccordionCard>
        <AccordionCard title="Never Use" subtitle="Voice failure patterns" icon="✗" color={theme.danger} defaultOpen>
          {[`"And that's when I realized..."`,`"Looking back, I can see that..."`,`"Rock bottom became the foundation..."`,`"Grateful for the journey"`,"Sentences that make meaning too fast","Anything a LinkedIn influencer would post","Epiphanies — Kyle has incremental recalibrations"].map(r=>(
            <div key={r} style={{ display:"flex",gap:8,marginBottom:8,fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:theme.textSec }}>
              <span style={{ color:theme.danger,fontSize:10 }}>✗</span>{r}
            </div>
          ))}
        </AccordionCard>
      </div>

      <AccordionCard title="Active Conflicts — Resolve Before Publishing" subtitle="3 documented, from memoir-blind-spots.html" icon="⚠" color={theme.danger}>
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {[
            { title:"O'Toole's Placement — Before or After the Break?", status:"STRUCTURAL",
              desc:"Locked outline: O'Toole's in Part I ('Before the Break'). Locked timeline: O'Toole's starts Oct 2021, one month after the September 2021 OD. Cannot both be true as stated. Resolution options: (1) redefine 'the break' as a pre-OD event (childhood, first addiction year), or (2) move O'Toole's to Part III as stabilization. Kyle must decide before drafting Part I." },
            { title:"Lee Chong Ming Pitch — Killed or Still Drafting?", status:"UNRESOLVED",
              desc:"One session memory says the pitch was killed. April 11 Kyle answered 'still drafting.' Two states, no resolution. No action possible until Kyle confirms. Dependencies if still drafting: kylerosebrook.com must be live + playbook URL must exist before sending." },
            { title:"Tool Count — 240+ (Public) vs. ~30 Genuine Use (Ground Truth)", status:"FRAMING",
              desc:"PROJECT_STATE.md explicitly flags '240+ tools mastered' as AI-generated padding. For the memoir the honest number is more compelling — 30 tools used daily by a brain that can't trust itself is the point. The dependency is what matters, not the count. Needs consistent framing across memoir and public copy." },
          ].map(c=>(
            <div key={c.title} style={{ padding:"12px 14px",background:theme.bgMid,border:`1px solid ${theme.danger}30`,borderLeft:`3px solid ${theme.danger}`,borderRadius:"0 8px 8px 0" }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
                <span style={{ fontFamily:"Playfair Display,serif",fontSize:8,letterSpacing:1.5,color:theme.danger,background:`${theme.danger}15`,border:`1px solid ${theme.danger}30`,padding:"2px 6px",borderRadius:3 }}>{c.status}</span>
                <span style={{ fontFamily:"IBM Plex Sans,sans-serif",fontWeight:600,fontSize:13,color:theme.text }}>{c.title}</span>
              </div>
              <p style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:theme.textSec,margin:0,lineHeight:1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </AccordionCard>
      <div>
        <Label color={theme.accent}>WORKING EXAMPLES</Label>
        <div style={{ display:"flex",flexDirection:"column",gap:8,marginTop:10 }}>
          {[
            `"I've tried at the bottom and I'm still down in this fucking hole. I was wrong about those being the answer, let's try the opposite because I seriously have nothing fucking left."`,
            `"Not because I'm organized. Because I can't afford not to be."`,
            `"No one tells you that relief is the most addictive feeling of all."`,
            `"The Sunday goodbye isn't grief. It's a specific kind of system failure — every routine you built together over the weekend decompiles in the 15 minutes between 'shoes on, kiddo' and the rearview mirror."`,
            `"I was homeless living in Salvation Army, hotels where I didn't have enough money for the next night most nights, to my own duplex room and then my own apartment, granted, I relapsed had a brain injury in there, but then I cleaned up." — surfaced in a FlashFusion session. Not a memoir session. That's where it lives.`,
            `"I've never, NOT once, EVER been exceptional at anything, NOTHING. And I'm terrified to find out I'm not good at this too." — came mid-argument about building in public. Not asked. Not prompted. Erupted. Childhood sentence, not injury sentence.`,
            `"I am alone Claude. You're just a mirror of me so that doesn't count. I am alone." — March 2026. The witness gap. The crisis line already called once, disbelieved, sealed forever.`,
            `"In the thick of my substance use I thought it to be bullshit. After practicing for months I can see the good it's done for me. It's transformative." — The meditation pivot. 'I want this to work' → 'I am open to this helping.' Construction vs. recovery in a sentence.`,
          ].map((ex,i)=>(
            <div key={i} style={{ padding:"12px 16px",borderLeft:`3px solid ${theme.accent}60`,background:`${theme.accent}06`,borderRadius:"0 8px 8px 0",fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:theme.textSec,fontStyle:"italic",lineHeight:1.6 }}>{ex}</div>
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
  const [checklistReady, setChecklistReady] = useState(false);

  // Load persisted checklist state
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("memoir-checklist-v1");
        if (r?.value) { const saved = JSON.parse(r.value); setDone(d => ({ ...d, ...saved })); }
      } catch(e) {}
      setChecklistReady(true);
    })();
  }, []);

  // Persist checklist on change
  useEffect(() => {
    if (!checklistReady) return;
    window.storage.set("memoir-checklist-v1", JSON.stringify(done)).catch(()=>{});
  }, [done, checklistReady]);
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
    { id:"pete",label:"Pete — Salvation Army, cost ledger" },
    { id:"dave",label:"Dave Datt — excavation needed" },
    { id:"tool_arch",label:"Session 3 Tool Archaeology" },
    { id:"kinsley",label:"Kinsley test — chapter review" },
    { id:"voice",label:"Voice check — submission ready?" },
  ];
  const MOCK_MSGS = {
    card_table:`CARD TABLE — STATUS: DRAFT\nSequence confirmed Apr 2026. Anchor scene locked.\nPhillis → Bear → card table → screenshot → Chaos Club.\n\nReady for prose pass. Kyle needs to confirm:\n— What was on the screen at 1:30am?\n— What sound was in the room?\n— What came next after the photo?\n\nNext: skeleton → flesh → polish.`,
    pete:`PETE — STATUS: NOT EXCAVATED\n\nSalvation Army roommate → construction work partner\n→ relapsed → overdosed and died.\n\nPete is the sharpest line on the cost ledger.\nHe's not in the current outline anywhere.\n\nRequired before any Rupture chapter can be considered\ncomplete:\n— When was this? (timeline relative to Kyle's OD)\n— What did Pete represent to Kyle at the time?\n— Did Kyle know he was going to relapse?\n— What was the funeral like, if there was one?\n\nDo not conflate with Dave Datt (brain aneurysm).\nTwo different costs. Both matter.`,
    dave:`DAVE DATT — STATUS: NEEDS EXCAVATION\nDied of brain aneurysm, 20s or 30s. Kyle attended funeral.\n\nRequired material:\n— Year of death\n— What was Kyle like walking in?\n— Parallel: both flunked out, different outcomes\n\nDo not draft until excavation complete.\n\nNOTE: Pete (Salvation Army roommate, also overdosed and died)\nis a separate cost-ledger item — do not conflate.`,
    tool_arch:`SESSION 3: TOOL ARCHAEOLOGY — NOT STARTED\nSessions 1 (O'Toole's, Mar 25) + 2 (seed confirmation) complete.\nSession 3 = Tool Archaeology — still open.\n\nGoal: Map each tool to the cognitive function it serves.\n— n8n → memory offload\n— Notion → external hippocampus\n— GitHub → decision version control\n\nNote: ~30 tools hands-on. 240+ catalogued ≠ mastered.`,
    kinsley:`KINSLEY TEST — CHAPTER REVIEW\nEvery chapter must answer: would a 20-year-old Kinsley\nunderstand what this cost?\n\nSTATUS: 0 specific Kinsley scenes exist in the archive.\nThe memoir is addressed to her. That gap is critical.\nAbsence may be protective — at some point one real scene\nmust exist before the book can be finished.\n\nPass criteria: chapter ends on an image or open question.\nFail: chapter ends on a realization.`,
    voice:`VOICE CHECK — SUBMISSION READINESS\nBefore any chapter is marked submission-ready:\n\n□ No self-help patterns\n□ No epiphanies — only incremental recalibrations\n□ Every claim traceable to confirmed source\n□ Engineering metaphors grounded, not decorative\n□ Uncertainty labeled — not resolved prematurely\n□ Kinsley test: PASS\n□ Spine connection: LEGIBLE\n□ Pete / Salvation Army / homelessness — not smoothed\n□ "Never exceptional" thread — childhood origin visible`,
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
        <h2 style={{ fontFamily:"Playfair Display,serif",fontSize:16,fontWeight:700,color:theme.text,margin:"8px 0 4px" }}>Excavation Progress</h2>
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
                      <div style={{ fontFamily:"IBM Plex Sans,sans-serif",fontWeight:600,fontSize:13,color:done[item.id]?theme.textMuted:theme.text,textDecoration:done[item.id]?"line-through":"none" }}>{item.title}</div>
                      <div style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:11,color:theme.textMuted,marginTop:4,lineHeight:1.5 }}>{item.note}</div>
                      <div style={{ fontFamily:"Playfair Display,serif",fontSize:8,color:c,marginTop:4,letterSpacing:1 }}>OWNER: {item.owner}</div>
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
            <legend style={{ fontFamily:"Playfair Display,serif",fontSize:9,letterSpacing:2,color:theme.textMuted,padding:"0 4px" }}>TOPIC</legend>
            {MSG_TOPICS.map(t=>(
              <label key={t.id} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8,cursor:"pointer",fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:theme.textSec }}>
                <input type="radio" name={`mt-${uid}`} checked={msgTopic===t.id} onChange={()=>setMsgTopic(t.id)} style={{ cursor:"pointer",accentColor:theme.accent }} />{t.label}
              </label>
            ))}
          </fieldset>
          <button onClick={generateMsg} disabled={msgLoading}
            style={{ background:theme.accent,border:"none",borderRadius:8,color:"#000",cursor:"pointer",padding:"10px 20px",fontFamily:"IBM Plex Sans,sans-serif",fontWeight:700,fontSize:13,opacity:msgLoading?0.5:1,minHeight:44,alignSelf:"flex-start" }}>{msgLoading?"Generating...":"Generate"}</button>
          {(msgOut||msgLoading) && (
            <div>
              <div aria-live="polite" style={{ background:"#020508",border:`1px solid ${theme.accent}25`,borderRadius:8,padding:"14px 16px",position:"relative",fontFamily:"IBM Plex Mono,monospace",fontSize:11,color:theme.textSec,lineHeight:1.7,whiteSpace:"pre-wrap",minHeight:60 }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${theme.accent}40,transparent)` }} />
                {msgOut}{msgLoading&&<span style={{ color:theme.accent }}>▌</span>}
              </div>
              {msgOut && (
                <button onClick={copyMsg} style={{ marginTop:8,background:"transparent",border:`1px solid ${theme.border}`,borderRadius:8,padding:"6px 14px",cursor:"pointer",fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:copied?theme.accent:theme.textMuted,minHeight:36 }}>{copied?"Copied!":"Copy to clipboard"}</button>
              )}
            </div>
          )}
        </div>
      </AccordionCard>
    </div>
  );
}


// ─── SECTION: MATERIAL BANK ──────────────────────────────────────────────────
const ENTRY_TYPES = ["scene seed","raw memory","confirmed quote","gap note","verification needed","structural note","character detail","timeline entry"];
const ENTRY_PHASES = ["Before the Break","The Rupture","Construction","Late-Life Emergence","Parallel Constructions","Frame/Kinsley","Unplaced"];

function SectionMaterialBank({ settings }) {
  const { theme } = useTheme();
  const [entries, setEntries] = useState([]);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState({ type:"raw memory", phase:"Unplaced", content:"", source:"", status:"unverified", note:"" });
  const [filter, setFilter] = useState("all");
  const [genLoading, setGenLoading] = useState(false);
  const [genOut, setGenOut] = useState("");
  const [genEntry, setGenEntry] = useState(null);
  const uid = useId();

  useEffect(()=>{
    (async()=>{
      try {
        const r = await window.storage.get("memoir-bank-v1");
        if (r?.value) setEntries(JSON.parse(r.value));
      } catch(e) {}
      setReady(true);
    })();
  },[]);

  const persist = async (next) => {
    try { await window.storage.set("memoir-bank-v1", JSON.stringify(next)); } catch(e) {}
  };

  const addEntry = () => {
    if (!form.content.trim()) return;
    const next = [{ id:Date.now(), ...form, createdAt:new Date().toISOString() }, ...entries];
    setEntries(next); persist(next);
    setForm(f => ({ ...f, content:"", source:"", note:"" }));
  };

  const deleteEntry = (id) => {
    const next = entries.filter(e=>e.id!==id);
    setEntries(next); persist(next);
  };

  const toggleStatus = (id) => {
    const next = entries.map(e => e.id===id ? { ...e, status: e.status==="verified"?"unverified":"verified" } : e);
    setEntries(next); persist(next);
  };

  const filtered = filter==="all" ? entries : entries.filter(e=>e.type===filter||e.phase===filter||e.status===filter);

  const distill = async (entry) => {
    setGenEntry(entry); setGenLoading(true); setGenOut("");
    const isMock = settings.forceMock || !settings.apiKey;
    const sys = `You are a literary memoir writing assistant for "Construction, Not Recovery." 
Analyze a raw material bank entry and provide:
1. A 1-sentence distilled prose fragment in Kyle's voice
2. Which narrative thread it belongs to
3. One craft observation about how to use it
Voice rules: No epiphanies. Engineering metaphors. Direct. Kyle's register.`;
    if (isMock) {
      const mock = `Prose fragment: "${entry.content.slice(0,60)}..." — this reads as a candidate opening image, not a summary.\n\nThread: ${entry.phase}\n\nCraft note: The specificity here is the material. Resist the urge to explain it. Let the image carry the weight — the reader will do the work if you trust the detail.`;
      let out = "";
      for (const ch of mock) { out+=ch; await new Promise(r=>setTimeout(r,8)); setGenOut(out); }
    } else {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST",
          headers:{ "Content-Type":"application/json","x-api-key":settings.apiKey,"anthropic-version":"2023-06-01" },
          body:JSON.stringify({ model:"claude-sonnet-4-6",max_tokens:400,system:sys,messages:[{ role:"user",content:`Entry type: ${entry.type}\nPhase: ${entry.phase}\nContent: ${entry.content}\nSource: ${entry.source||"unspecified"}` }] }),
        });
        const data = await res.json();
        setGenOut(data.content?.[0]?.text||"No response.");
      } catch { setGenOut("Error. Enable mock mode."); }
    }
    setGenLoading(false);
  };

  const statusColor = (s) => s==="verified"?theme.blue:s==="unverified"?theme.warm:theme.danger;
  const typeColor = (t) => t==="confirmed quote"?theme.blue:t==="scene seed"?theme.accent:t==="verification needed"?theme.danger:theme.textMuted;

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <Label color={theme.accent}>MATERIAL BANK</Label>
        <h2 style={{ fontFamily:"Playfair Display,serif",fontSize:16,fontWeight:700,color:theme.text,margin:"8px 0 4px" }}>Raw Material Capture</h2>
        <p style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:theme.textMuted }}>Persistent storage for excavated scenes, quotes, gaps, and notes. {entries.length} entries across all sessions.</p>
      </div>

      {/* Add entry form */}
      <div style={{ background:theme.surface,border:`1px solid ${theme.border}`,borderRadius:10,padding:20,marginBottom:20 }}>
        <Label color={theme.accent}>ADD ENTRY</Label>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12 }} className="two-col">
          <div>
            <label htmlFor={`et-${uid}`} style={{ fontFamily:"Playfair Display,serif",fontSize:9,letterSpacing:2,color:theme.textMuted,display:"block",marginBottom:6 }}>TYPE</label>
            <select id={`et-${uid}`} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
              style={{ width:"100%",background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:6,padding:"8px 10px",color:theme.text,fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,outline:"none" }}>
              {ENTRY_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`ep-${uid}`} style={{ fontFamily:"Playfair Display,serif",fontSize:9,letterSpacing:2,color:theme.textMuted,display:"block",marginBottom:6 }}>NARRATIVE THREAD</label>
            <select id={`ep-${uid}`} value={form.phase} onChange={e=>setForm(f=>({...f,phase:e.target.value}))}
              style={{ width:"100%",background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:6,padding:"8px 10px",color:theme.text,fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,outline:"none" }}>
              {ENTRY_PHASES.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginTop:12 }}>
          <label htmlFor={`ec-${uid}`} style={{ fontFamily:"Playfair Display,serif",fontSize:9,letterSpacing:2,color:theme.textMuted,display:"block",marginBottom:6 }}>CONTENT — raw material, exact words preferred</label>
          <textarea id={`ec-${uid}`} value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} rows={3} placeholder="Paste or type raw memory, quote, scene fragment, or note..."
            style={{ width:"100%",boxSizing:"border-box",background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:8,padding:"10px 12px",color:theme.text,fontFamily:"IBM Plex Mono,monospace",fontSize:12,lineHeight:1.6,resize:"vertical",outline:"none" }} />
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12 }} className="two-col">
          <div>
            <label htmlFor={`es-${uid}`} style={{ fontFamily:"Playfair Display,serif",fontSize:9,letterSpacing:2,color:theme.textMuted,display:"block",marginBottom:6 }}>SOURCE (session, doc, or kyle said)</label>
            <input id={`es-${uid}`} value={form.source} onChange={e=>setForm(f=>({...f,source:e.target.value}))} placeholder="e.g. Apr 25 session, evidence board, primary archive"
              style={{ width:"100%",background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:6,padding:"8px 10px",color:theme.text,fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,outline:"none" }} />
          </div>
          <div>
            <label htmlFor={`en-${uid}`} style={{ fontFamily:"Playfair Display,serif",fontSize:9,letterSpacing:2,color:theme.textMuted,display:"block",marginBottom:6 }}>NOTE (optional context)</label>
            <input id={`en-${uid}`} value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} placeholder="What makes this significant?"
              style={{ width:"100%",background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:6,padding:"8px 10px",color:theme.text,fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,outline:"none" }} />
          </div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:12,marginTop:14 }}>
          <button onClick={addEntry} disabled={!form.content.trim()}
            style={{ background:theme.accent,border:"none",borderRadius:8,color:"#000",cursor:"pointer",padding:"10px 20px",fontFamily:"IBM Plex Sans,sans-serif",fontWeight:700,fontSize:13,opacity:!form.content.trim()?0.4:1,minHeight:44 }}>Add Entry</button>
          <label style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:theme.textSec }}>
            <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}
              style={{ background:theme.bgMid,border:`1px solid ${theme.border}`,borderRadius:6,padding:"8px 10px",color:theme.text,fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,outline:"none" }}>
              <option value="unverified">Unverified</option>
              <option value="verified">Verified</option>
              <option value="needs-kyle">Needs Kyle</option>
            </select>
          </label>
        </div>
      </div>

      {/* Filter bar */}
      {entries.length > 0 && (
        <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:16 }}>
          <Label color={theme.textMuted}>FILTER</Label>
          {["all","scene seed","confirmed quote","verification needed","gap note","verified","unverified"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{ background:filter===f?`${theme.accent}20`:"transparent",border:`1px solid ${filter===f?theme.accent+"50":theme.border}`,borderRadius:6,padding:"4px 10px",fontFamily:"IBM Plex Sans,sans-serif",fontSize:11,color:filter===f?theme.accent:theme.textMuted,cursor:"pointer",minHeight:30 }}>{f}</button>
          ))}
        </div>
      )}

      {/* Entry list */}
      {filtered.length === 0 && (
        <div style={{ textAlign:"center",padding:"40px 20px",color:theme.textMuted,fontFamily:"IBM Plex Sans,sans-serif",fontSize:13 }}>
          {entries.length === 0 ? "No entries yet. Start capturing material above." : "No entries match this filter."}
        </div>
      )}
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {filtered.map(entry=>(
          <div key={entry.id} style={{ background:theme.surface,border:`1px solid ${theme.border}`,borderRadius:10,overflow:"hidden",transition:"border-color .2s" }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=typeColor(entry.type)+"60"}
            onMouseLeave={e=>e.currentTarget.style.borderColor=theme.border}>
            <div style={{ display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderBottom:`1px solid ${theme.border}` }}>
              <span style={{ fontFamily:"Playfair Display,serif",fontSize:8,letterSpacing:1.5,textTransform:"uppercase",color:typeColor(entry.type),background:`${typeColor(entry.type)}15`,border:`1px solid ${typeColor(entry.type)}30`,padding:"2px 7px",borderRadius:3 }}>{entry.type}</span>
              <span style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:10,color:theme.textMuted }}>{entry.phase}</span>
              <div style={{ marginLeft:"auto",display:"flex",gap:6,alignItems:"center" }}>
                <button onClick={()=>toggleStatus(entry.id)} style={{ fontFamily:"Playfair Display,serif",fontSize:8,letterSpacing:1,color:statusColor(entry.status),background:`${statusColor(entry.status)}12`,border:`1px solid ${statusColor(entry.status)}30`,borderRadius:3,padding:"2px 7px",cursor:"pointer" }}>{entry.status}</button>
                <button onClick={()=>distill(entry)} title="Analyze with AI"
                  style={{ background:`${theme.accent}15`,border:`1px solid ${theme.accent}30`,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontFamily:"IBM Plex Sans,sans-serif",fontSize:10,color:theme.accent,minHeight:24 }}>✦ distill</button>
                <button onClick={()=>deleteEntry(entry.id)} aria-label="Delete"
                  style={{ background:"transparent",border:`1px solid ${theme.border}`,borderRadius:6,padding:"3px 7px",cursor:"pointer",fontFamily:"IBM Plex Sans,sans-serif",fontSize:10,color:theme.textMuted,minHeight:24 }}>✕</button>
              </div>
            </div>
            <div style={{ padding:"12px 14px" }}>
              <div style={{ fontFamily:"IBM Plex Mono,monospace",fontSize:12,color:theme.text,lineHeight:1.7,whiteSpace:"pre-wrap",marginBottom:entry.note?8:0 }}>{entry.content}</div>
              {entry.note && <div style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:11,color:theme.textMuted,fontStyle:"italic" }}>{entry.note}</div>}
              {entry.source && <div style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:10,color:theme.textMuted,marginTop:4 }}>↳ {entry.source}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* AI distillation panel */}
      {(genOut || genLoading) && genEntry && (
        <div style={{ marginTop:20,background:theme.bgMid,border:`1px solid ${theme.accent}30`,borderRadius:10,padding:16 }}>
          <Label color={theme.accent}>DISTILLATION — {genEntry.type}</Label>
          <div aria-live="polite" style={{ fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:theme.textSec,lineHeight:1.7,marginTop:8,whiteSpace:"pre-wrap" }}>
            {genOut}{genLoading&&<span style={{ color:theme.accent }}>▌</span>}
          </div>
        </div>
      )}
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
  { id:"bank",label:"07 Material Bank" },
];

export default function App() {
  const [settings, setSettings] = useState({
    theme:"Reading Room",persona:"poweruser",apiKey:"",
    temperature:0.8,maxTokens:1000,showTips:true,forceMock:false,compact:false,
  });
  const [section, setSection] = useState("overview");
  const [showSettings, setShowSettings] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [playground, setPlayground] = useState(null);
  const [storageReady, setStorageReady] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("memoir-explorer-v1");
        if (r?.value) {
          const saved = JSON.parse(r.value);
          if (saved.settings) setSettings(s => ({ ...s, ...saved.settings, apiKey:"" }));
          if (saved.section) setSection(saved.section);
        }
      } catch(e) {}
      setStorageReady(true);
    })();
  }, []);

  // Persist settings and section on change (debounced)
  const persistRef = useRef(null);
  useEffect(() => {
    if (!storageReady) return;
    clearTimeout(persistRef.current);
    persistRef.current = setTimeout(async () => {
      try {
        const { apiKey, ...safeSettings } = settings;
        await window.storage.set("memoir-explorer-v1", JSON.stringify({ settings:safeSettings, section }));
      } catch(e) {}
    }, 800);
    return () => clearTimeout(persistRef.current);
  }, [settings, section, storageReady]);

  const theme = THEMES[settings.theme] || THEMES["Carbon Noir"];

  useEffect(() => {
    const id = "memoir-css";
    if (document.getElementById(id)) { document.getElementById(id).remove(); }
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
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
      <div style={{ minHeight:"100vh",background:theme.bg,color:theme.text,fontFamily:"IBM Plex Sans,sans-serif",position:"relative" }}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ParallaxBG />

        {/* Header */}
        <header role="banner" style={{ position:"sticky",top:0,zIndex:500,background:`${theme.bg}e8`,backdropFilter:"blur(14px)",borderBottom:`1px solid ${theme.border}`,padding:"0 24px" }}>
          <div style={{ maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:56 }}>
            <div style={{ fontFamily:"Playfair Display,serif",fontWeight:900,fontSize:13,background:`linear-gradient(110deg,${theme.accent},${theme.accent2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
              CONSTRUCTION, NOT RECOVERY
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <div style={{ fontFamily:"Playfair Display,serif",fontSize:8,letterSpacing:1.5,color:theme.textMuted,padding:"3px 8px",border:`1px solid ${theme.border}`,borderRadius:4 }} className="hide-sm">
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
                  style={{ background:section===item.id?`${theme.accent}18`:"transparent",border:`1px solid ${section===item.id?theme.accent+"50":"transparent"}`,borderRadius:7,padding:"6px 12px",fontFamily:"Playfair Display,serif",fontSize:9,letterSpacing:1.5,fontWeight:600,textTransform:"uppercase",color:section===item.id?theme.accent:theme.textMuted,cursor:"pointer",transition:"all .15s",whiteSpace:"nowrap",minHeight:34 }}>{item.label}</button>
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
            {section==="bank" && <SectionMaterialBank settings={settings} />}
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
