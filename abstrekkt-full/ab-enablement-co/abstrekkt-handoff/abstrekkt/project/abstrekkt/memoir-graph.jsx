/* Construction, Not Recovery — memoir knowledge graph.
   Flat, non-hierarchical network with a force-directed layout.
   Adds: spread control, AI document-intake placement, manual add. */
const { useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback } = React;

const CAT = {
  thesis:   { label: "THESIS",          color: "var(--c-thesis)" },
  subject:  { label: "SUBJECT / FRAME", color: "var(--c-subject)" },
  evidence: { label: "EVIDENCE",        color: "var(--c-evidence)" },
  history:  { label: "HISTORY",         color: "var(--c-history)" },
  build:    { label: "BUILD",           color: "var(--c-build)" },
  craft:    { label: "CRAFT",           color: "var(--c-craft)" },
};
const CAT_HINT = "thesis = core argument; subject = person/frame; evidence = clinical or archival proof; history = past event/era; build = systems & platforms; craft = writing process";

// evidentiary standing → chip color + label
const STATUS = {
  verified:   { label: "VERIFIED",   color: "var(--blue)" },
  contested:  { label: "CONTESTED",  color: "var(--amber)" },
  unresolved: { label: "UNRESOLVED", color: "var(--error)" },
};
const fmtConf = (c) => c == null ? "unscored" : Math.round(c * 100) + "%";

// Rich schema. Beyond id/tag/cat/hub/label/blurb, nodes may carry:
//   status   verified | contested | unresolved  — evidentiary standing (chip)
//   conf     0..1 confidence, or null = deliberately unscored
//   era      date/period string (forensic metadata)
//   source   provenance — which scan, journal, document, or era
//   stakes   why this node matters to the book (thesis/throughline nodes)
//   refs     archive IDs (forensic scheme: SPECT-/COG-/JRN-/POE-/WKS-/DOC-)
//   beats    scene-level material — concrete moments, not summary
//   contradicts  [{with, note}] — specific conflicts (contradiction is content)
//   open     open questions still needing verification (working instrument)
//   chapters manuscript mapping → Narrative Outline parts (drafting tracker)
//   protect  sensitivity guardrail, rendered as an always-visible banner
const SEED_NODES = [
  { id: "construction", tag: "THS·00", cat: "thesis", hub: true, label: "Construction, Not Recovery",
    blurb: "Central thesis. After cognitive disruption, addiction, and brain injury, you don't return to a previous baseline — you build external systems to replace or scaffold lost internal function.",
    status: "verified", conf: 0.9, era: "2022 – present",
    stakes: "If recovery were possible the book wouldn't need to exist. Construction is the only honest verb — the alternative is pretending.",
    chapters: ["Throughline"],
    open: ["Name the mechanism without sliding into self-help or productivity register."] },
  { id: "memory", tag: "THS·01", cat: "thesis", hub: true, label: "Unreliable Memory",
    blurb: "Unreliable by design. Certain facts — including whether dependency began at 19 or 21 — can't be cleanly pinned. The clinical record itself can't keep the timeline straight, so the uncertainty isn't a flaw to smooth over; it's the subject.",
    status: "contested", conf: null, era: "onset window disputed",
    stakes: "The unreliability is the subject, not an obstacle to it. Smoothing it into a clean timeline would be the lie the book exists to refuse.",
    beats: ["The eval's own contradiction: page 2 dates the hypoxia event to 'summer of 2020,' page 3 and the physician section to 'October 2021.' The document that proves memory is broken can't keep its own dates straight.", "Recall memory measured at the 12th percentile — information arrives at full speed and evaporates."],
    contradicts: [{ with: "board", note: "The clinical record disputes itself on the hypoxia date (2020 vs 2021) — the proof of damage is internally inconsistent, which is exactly the point." }],
    chapters: ["III · Severance", "IV · The Evidence"],
    open: ["Decide in the text: pin 19-vs-21, or formally hold it open (current plan).", "Fix the sobriety date — 'maybe 22,' itself uncertain, consistent with 12th-percentile recall."] },
  { id: "external", tag: "THS·02", cat: "thesis", hub: true, label: "External Cognition",
    blurb: "Tools, documentation, workflows, automations, and systems become survival infrastructure for damaged memory — prosthetic recall for a processor that runs at the 99th percentile but stores at the 12th. Notion, Claude, n8n, GitHub, Vercel: an external hard drive for a brain that catches fire and then forgets it was burning. Not productivity optimization.",
    status: "verified", conf: 0.85, era: "post-injury – present",
    stakes: "This is how the work gets done at all. Framing it as optimization would misread necessity as choice.",
    beats: ["Documentation-as-prosthesis: writing it down because it will otherwise be gone.", "The pattern — systematize everything, document obsessively, build external rails — was already running before the tools; Lovable and Claude Code just gave it scale."],
    chapters: ["V · The Build"] },
  { id: "letter", tag: "FRM·01", cat: "subject", label: "Letter to Kinsley",
    blurb: "The book's form: a letter to Kyle's daughter. Kinsley is audience, grounding constraint, and the reason the reconstruction has to become accountable — protected as a person, not overdeveloped as a character.",
    status: "verified", era: "framing device",
    protect: "Kinsley is a person to protect, not a character to develop. She exists on the board through this frame only — no biographical detail, image, schedule, or attributed words.",
    stakes: "Accountability to a real reader is what keeps the reconstruction honest instead of self-serving.",
    chapters: ["VII · The Letter"],
    open: ["Hold the address consistent without turning her into a device."] },
  { id: "kyle", tag: "SBJ·01", cat: "subject", label: "Kyle Rosebrook",
    blurb: "Author and subject. A literary-nonfiction project — not recovery memoir, self-help, productivity manifesto, or addiction confessional.",
    status: "verified", era: "narrator / present tense",
    stakes: "The system under reconstruction is a person, not a metaphor — which is what earns the book the right to generalize.",
    chapters: ["Subject — all parts"] },
  { id: "preinjury", tag: "SBJ·02", cat: "subject", label: "Pre-Injury Kyle",
    blurb: "The earlier self and lost baseline — organic memory, social processing that needed no documentation, the diagnostic instinct in its unassisted form. Referenced, not romanticized: he wasn't unbroken, just unbroken differently (age 17, counting streetlights, “if I don't quiet my head it's going to tear me apart”). Structurally out of reach — which is why recovery isn't on the table.",
    status: "unresolved", conf: 0.4, era: "before the Loop",
    stakes: "The baseline is unverifiable — reconstructed only through others' accounts and thin records — which is itself the argument against 'returning' to it.",
    refs: ["char-pre-injury-kyle"],
    chapters: ["III · Severance"],
    open: ["Resist romanticizing; source claims about the earlier self rather than asserting them.", "Answer honestly: what would pre-injury Kyle think of constructed Kyle — impressed, or horrified they were necessary?"] },
  { id: "board", tag: "EVD·01", cat: "evidence", label: "Clinical Evidence Board",
    blurb: "Two SPECT scans at Amen Clinics Chicago (99mTc-HMPAO tracer): a concentration study July 7, 2022 and a baseline study July 11. Findings: decreased perfusion across temporal lobes, prefrontal, parietal, occipital cortex and cerebellum; a thalamus running severely hot; surface scalloping consistent with toxic exposure and anoxia. Clinical read: past brain injury and encephalopathic process.",
    status: "verified", conf: 1.0, era: "Jul 7 & 11, 2022", source: "Amen Clinics, Chicago · Dr. Michael Easton",
    refs: ["Rosebrook_K_Eval", "the-evidence-board-v2", "rogers-bh-clinical-timeline"],
    beats: ["Chief complaint at intake, two words: “Addiction, depression.” Occupation: bartender. Age 36. Living with parents.", "Getting the results weeks late and having already forgotten them — the scan that proves memory damage was itself forgotten."],
    chapters: ["IV · The Evidence"],
    open: ["Consider a follow-up scan four years on — a before/after would be the book's strongest visual evidence.", "The follow-up in 2022 never happened (chromium allergic reaction from the supplements) — decide whether that non-event is a scene."] },
  { id: "split", tag: "EVD·02", cat: "evidence", label: "99th / 12th Processing–Recall Split",
    blurb: "Total Brain / WebNeuro battery, July 7, 2022. Processing speed 99th percentile against recall memory 12th — the engine is elite, the storage nearly empty. The thesis in two data points: fast pattern recognition, damaged storage and retrieval. Flexibility 17th, resilience 2nd; readiness-to-change a maximum 10/10 against a “slight” hope score.",
    status: "verified", conf: 0.95, era: "Jul 7, 2022", source: "Total Brain / WebNeuro · Conners CPT3",
    refs: ["rosebrook_k_tbr_7-7-2022", "RosebrookK_CPT_20220707"],
    beats: ["The two numbers on one page — the fastest and the slowest thing about the same mind.", "The Conners CPT3 finding no classic ADHD pattern, despite years of diagnosis — the attention problem is downstream of the injury, not the injury itself."],
    chapters: ["IV · The Evidence"],
    contradicts: [{ with: "preinjury", note: "99th-percentile processing complicates any clean 'diminished self' story — this faculty is exceptional, not lost. What broke is storage, not speed." }],
    open: ["Retest recall to see whether it has shifted since 2022."] },
  { id: "archive", tag: "EVD·03", cat: "evidence", label: "Primary Source Archive",
    blurb: "Handwritten journals, printed poems and annotated songs, life-coach correspondence, CBT worksheets, self-care notes, and clinical PDFs — transcribed from Kyle's physical binder April 2026. Treated as evidence, never sensationalized.",
    status: "verified", conf: 0.8, era: "spanning the timeline", source: "Personal binder · transcribed Apr 12, 2026",
    refs: ["primary-source-archive", "Rosebrook_K_Eval", "song lyrics ×", "CBT worksheet", "Soaring Bear corr."],
    protect: "Reference materials by type and date. No raw excerpts land on the board unless the passage is already in the manuscript.",
    chapters: ["Feeds all parts"],
    open: ["Complete the inventory; digitize the handwritten journals before they degrade.", "Locate physical artifacts named in sessions (the September-2021 pajama bottoms; the unmatched train ticket)."] },
  { id: "michael", tag: "EVD·04", cat: "evidence", label: "Michael Relationship Journal",
    blurb: "A contemporaneous handwritten journal within the archive documenting coercive control and emotional abuse — first-person, present-tense, written under distress. A dated record that can corroborate or contradict memory.",
    status: "contested", conf: 0.9, era: "contemporaneous, dated", source: "Handwritten notebook · within the Primary Source Archive",
    refs: ["primary-source-archive §1"],
    protect: "Evidence, never spectacle. Board presence is limited to existence, evidentiary function, and the fact of the abuse pattern — no quotations, intimate specifics, or third-party identifying detail. (Michael here is the former partner, distinct from Dr. Michael Easton on the Evidence Board.)",
    contradicts: [{ with: "memory", note: "The journal explicitly names gaslighting exploiting Kyle's poor memory — recorded events “always different from what I saved.” A dated record set against damaged recall is the book's central evidentiary tension in miniature." }],
    chapters: ["IV · The Evidence"],
    open: ["Decide the quotable/summarized boundary before this appears in a draft.", "Confirm Kyle's readiness before any excavation beyond existence."] },
  { id: "loop", tag: "HIS·01", cat: "history", label: "Addiction / Brain Injury Loop",
    blurb: "The recursive trap: addiction caused the brain injury, and the injury then made escape harder — the prefrontal cortex that governs impulse control was already running at reduced capacity. Not a moral failure to think past; damaged hardware, visible on the scan. Culminated in a hypoxia event and four overdoses in 2021.",
    status: "contested", conf: 0.7, era: "onset 19 or 21 – ongoing", source: "Recall + SPECT corroboration",
    refs: ["Rosebrook_K_Eval", "rogers-bh-clinical-timeline"],
    beats: ["The recursive turn: the coping mechanism becomes the injury that weakens the capacity to stop.", "Rogers Behavioral Health, ~6 weeks residential — model resident. “Among the living dead, I was king.”"],
    contradicts: [{ with: "memory", note: "The Loop's own onset is a casualty of the memory it damaged — the eval logs the hypoxia event as both 2020 and 2021; the timeline can't fully audit itself." }],
    chapters: ["II · The Loop"],
    open: ["Excavate the three overdoses beyond the one the eval records (September 2021), when ready.", "Fix the boundary between clinically evidenced and reconstructed-from-recall."] },
  { id: "instinct", tag: "HIS·02", cat: "history", hub: true, label: "Diagnostic Instinct",
    blurb: "Reading rooms, systems, people, processes, and failures before the problem is formally named — the book's spine. It operates below conscious thought and transfers substrate to substrate: the bar, quality control, engineering, fatherhood, the manuscript. The one faculty every version of Kyle keeps.",
    status: "verified", conf: 0.85, era: "O'Toole's → present",
    stakes: "The faculty the injury left intact — 99th-percentile processing made concrete. It is the book's engine and the reason construction is even possible. Its shadow: diagnosing a moment can become a way of not being in it.",
    beats: ["Naming a failure on the floor before the ticket, the complaint, or the metric caught it.", "The same read transferring from a dining room to a codebase to a manuscript — input changes, processing doesn't."],
    refs: ["char-diagnostic-instinct"],
    chapters: ["I · O'Toole's", "V · The Build"],
    open: ["Find the earliest verifiable instance — does it predate O'Toole's (the age-17 streetlights night)?", "Surface the observer-effect tension: when does reading the room replace being in it?"] },
  { id: "otooles", tag: "HIS·03", cat: "history", label: "O'Toole's",
    blurb: "The bartending years (roughly Oct 2021 – Mar 2025) where the Diagnostic Instinct first manifests under live pressure — reading rooms and drunk strangers, five miles walked a shift. They never knew about the heroin.",
    status: "contested", conf: 0.6, era: "~Oct 2021 – Mar 2025", source: "Recall",
    beats: ["Reading a room's failure mid-service, before it surfaced as a complaint.", "The Rogers 'window girl' turning up as a customer who didn't remember him — the man with 12th-percentile recall remembers her."],
    chapters: ["I · O'Toole's"],
    open: ["Fix the date range against any external record (pay stubs, schedules).", "Did any coworker ever find out about the heroin?"] },
  { id: "engineering", tag: "BLD·01", cat: "build", label: "Self-Taught Engineering",
    blurb: "Self-taught code and systems — no CS degree. From bartender (2022) to L1 service-desk technician who builds enterprise-adjacent tools on his own time: ~30 tools used hands-on, 50 Claude skills, GitHub repos, n8n workflows. The processing speed is the engine; the tools are the storage.",
    status: "verified", conf: 0.9, era: "~2023 – present",
    beats: ["The first system built to remember something the mind no longer would.", "Code as prosthesis: the instinct diagnosing systems instead of dining rooms."],
    chapters: ["V · The Build"],
    open: ["The half-built things: PFC-linked follow-through (17th-percentile flexibility) means projects launch fast and stall — name this honestly rather than as a productivity story."] },
  { id: "chaos", tag: "BLD·02", cat: "build", label: "Chaos Club Co.",
    blurb: "A venture built on the same philosophy: no toxic positivity, no pretending — chaos acknowledged and organized rather than erased. “Welcome to the Chaos Club: where no one has to pretend — but everyone understands.”",
    status: "verified", era: "2025 – present", source: "Applied philosophy",
    beats: ["The operating principle: organize the chaos, don't deny it.", "Crisis protocols that “connect rather than save” — informed by four survived overdoses and the Sedona trip."],
    chapters: ["VI · The Platform"] },
  { id: "voice", tag: "CRF·01", cat: "craft", label: "Voice System",
    blurb: "The tonal guardrail: no recovery clichés, no self-help register, no false epiphany. Keeps the book honest about what it is.",
    status: "verified", era: "applies to every line",
    beats: ["Rejected: 'journey', 'rock bottom', the redemptive arc.", "Kept: forensic, contemplative, hard-edged — the letter's address as the tonal spine."],
    chapters: ["Governs all parts"],
    open: ["Codify the banned-register list so drafts can be checked against it."] },
  { id: "outline", tag: "CRF·02", cat: "craft", label: "Narrative Outline",
    blurb: "The book's structural map — how thesis, evidence, characters, and threads are sequenced into an argument.",
    status: "unresolved", era: "provisional sequence",
    stakes: "The parts below are the current working order (I–VII), not a locked structure. Nodes map to them so the board doubles as a drafting tracker.",
    chapters: ["I · O'Toole's", "II · The Loop", "III · Severance", "IV · The Evidence", "V · The Build", "VI · The Platform", "VII · The Letter"],
    open: ["Lock the part order.", "Decide where the clinical evidence lands — early proof, or delayed reveal."] },
  { id: "accelerator", tag: "CRF·03", cat: "craft", label: "Memoir Accelerator",
    blurb: "The drafting workflow that turns outline plus archive into pages — external cognition applied to the writing itself.",
    status: "verified", era: "drafting infrastructure",
    beats: ["Outline + archive in, drafted pages out — the writing method is itself an external-cognition system."],
    chapters: ["Produces all parts"] },
];

/* Canonical protections: pull the guardrail copy for mapped nodes from the ONE
   manifest (abstrekkt/protections.js) so policy edits happen in a single place
   and the graph can't drift from the search tool. */
(function applyManifest() {
  const M = typeof window !== "undefined" && window.ABSTREKKT_PROTECTIONS;
  if (!M) return;
  const map = {
    letter: M.people.kinsley && M.people.kinsley.note,
    michael: M.people.michael && ((M.threads["coercive-control"] || {}).reason
      ? M.people.michael.note + " " + M.threads["coercive-control"].reason
      : M.people.michael.note),
  };
  SEED_NODES.forEach((n) => { if (map[n.id]) n.protect = map[n.id]; });
})();

const SEED_EDGES = [
  { a: "construction", b: "memory", kind: "depends on", p: true, reason: "Construction depends on Unreliable Memory: the book refuses a clean origin story — it cannot recover a fixed past it can no longer verify." },
  { a: "construction", b: "external", kind: "depends on", p: true, reason: "Construction depends on External Cognition: the answer is to build systems, not to return to a vanished baseline." },
  { a: "letter", b: "construction", kind: "frames", p: true, reason: "The Letter to Kinsley frames the whole project as accountability to a real reader, rather than abstract self-analysis." },
  { a: "board", b: "memory", kind: "supports", p: true, evd: true, reason: "The Clinical Evidence Board supports Unreliable Memory through cognitive findings and contradictory timeline evidence." },
  { a: "split", b: "instinct", kind: "explains", p: true, evd: true, reason: "The 99th/12th split explains how the Diagnostic Instinct can survive while memory storage fails — processing speed intact, recall damaged." },
  { a: "instinct", b: "otooles", kind: "first manifests at", p: true, reason: "The Diagnostic Instinct first manifests at O'Toole's, reading rooms and failures during the hospitality years." },
  { a: "instinct", b: "engineering", kind: "translates into", p: true, reason: "The same Diagnostic Instinct later translates into Self-Taught Engineering — diagnosing systems instead of dining rooms." },
  { a: "engineering", b: "external", kind: "expands", p: true, reason: "Self-Taught Engineering expands External Cognition: code becomes a reconstruction tool, not a résumé line." },
  { a: "chaos", b: "construction", kind: "mirrors", p: true, reason: "Chaos Club Co. mirrors the thesis — it turns lived chaos into a practical platform instead of erasing it." },
  { a: "archive", b: "memory", kind: "compensates for", p: true, evd: true, reason: "The Primary Source Archive compensates for Unreliable Memory by preserving contemporaneous records." },
  { a: "voice", b: "construction", kind: "protects", p: true, reason: "The Voice System protects the book from recovery clichés, self-help tone, and false epiphany." },
  { a: "accelerator", b: "outline", kind: "operationalizes", p: true, reason: "The Memoir Accelerator operationalizes the Narrative Outline as a working drafting workflow." },
  { a: "kyle", b: "construction", kind: "is the system in", reason: "Kyle Rosebrook is the system under reconstruction — the thesis is his lived method, not a metaphor." },
  { a: "kyle", b: "instinct", kind: "carries", reason: "The Diagnostic Instinct is Kyle's core surviving capacity — the one faculty the injury left intact." },
  { a: "kyle", b: "loop", kind: "sustains", reason: "Kyle sustained the Addiction / Brain Injury Loop — the disruption that forced the entire project." },
  { a: "loop", b: "memory", kind: "damages into", evd: true, reason: "The Addiction / Brain Injury Loop damages storage and retrieval, producing the Unreliable Memory at the book's center." },
  { a: "loop", b: "preinjury", kind: "severs", reason: "The Loop severs Kyle from Pre-Injury Kyle — the baseline self he can no longer reach." },
  { a: "preinjury", b: "construction", kind: "necessitates", reason: "Because Pre-Injury Kyle is unreachable, there is nothing to recover to — only something to construct." },
  { a: "split", b: "board", kind: "is pinned to", evd: true, reason: "The 99th/12th split is the headline finding pinned to the Clinical Evidence Board." },
  { a: "board", b: "loop", kind: "evidences", evd: true, reason: "The Board's July 2022 SPECT scan evidences the brain-injury half of the Loop." },
  { a: "letter", b: "kyle", kind: "makes accountable", reason: "Kinsley is the reason the reconstruction must become accountable — she makes Kyle answerable for it." },
  { a: "michael", b: "archive", kind: "is part of", evd: true, reason: "The Michael Relationship Journal is one document within the Primary Source Archive." },
  { a: "michael", b: "memory", kind: "anchors", evd: true, reason: "The journal's dated entries anchor or contradict memory — including the kind of fact (19 vs 21) Kyle can't pin from recall alone." },
  { a: "chaos", b: "external", kind: "applies", reason: "Chaos Club Co. runs on the same External Cognition philosophy: chaos organized into systems, not pretended away." },
  { a: "voice", b: "letter", kind: "is voiced by", reason: "The letter-to-a-daughter address is the spine of the Voice System's tone." },
  { a: "outline", b: "construction", kind: "structures", reason: "The Narrative Outline structures the thesis into a book that argues construction over recovery." },
  { a: "accelerator", b: "archive", kind: "ingests", reason: "The Memoir Accelerator ingests the Primary Source Archive as raw drafting material." },
  { a: "engineering", b: "accelerator", kind: "builds", reason: "The Memoir Accelerator is itself a Self-Taught Engineering artifact — a tool built to draft the book." },
  { a: "engineering", b: "chaos", kind: "builds", reason: "Self-Taught Engineering built Chaos Club Co. — the platform is the skill made concrete." },
];

const hasAI = typeof window !== "undefined" && window.claude && typeof window.claude.complete === "function";

/* ---------- force simulation (reads live nodes/edges via refs) ---------- */
function nodeBox(compact) { return compact ? { w: 150, h: 70 } : { w: 188, h: 80 }; }

function seedPositions(P, nodes, w, h) {
  const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.36;
  nodes.forEach((n, i) => {
    const ang = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
    const r = n.hub ? R * 0.42 : R * (0.86 + (i % 3) * 0.07);
    P[n.id] = { x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r, vx: 0, vy: 0 };
  });
}

function simStep(P, nodes, edges, w, h, a, dragId, compact, spread) {
  const REST = (compact ? 150 : 212) * spread, KS = 0.028, KREP = (compact ? 12000 : 21000) * spread, KCEN = 0.011, DAMP = 0.85;
  const box = nodeBox(compact);
  // clamp so the CARD (positioned by its center) stays fully inside the board
  const PADX = box.w / 2 + 8, PADY = box.h / 2 + 8;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const A = P[nodes[i].id], B = P[nodes[j].id]; if (!A || !B) continue;
      let dx = A.x - B.x, dy = A.y - B.y;
      let d2 = dx * dx + dy * dy; if (d2 < 1) d2 = 1;
      const d = Math.sqrt(d2);
      const f = (KREP / d2) * a;
      A.vx += (dx / d) * f; A.vy += (dy / d) * f;
      B.vx -= (dx / d) * f; B.vy -= (dy / d) * f;
    }
  }
  edges.forEach((e) => {
    const A = P[e.a], B = P[e.b]; if (!A || !B) return;
    let dx = B.x - A.x, dy = B.y - A.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const f = (d - REST) * KS * a;
    A.vx += (dx / d) * f; A.vy += (dy / d) * f;
    B.vx -= (dx / d) * f; B.vy -= (dy / d) * f;
  });
  nodes.forEach((n) => {
    const A = P[n.id]; if (!A) return;
    const kc = KCEN * (n.hub ? 1.8 : 1) * a;
    A.vx += (w / 2 - A.x) * kc; A.vy += (h / 2 - A.y) * kc;
  });
  nodes.forEach((n) => {
    const A = P[n.id]; if (!A) return;
    if (dragId === n.id) { A.vx = 0; A.vy = 0; return; }
    A.vx *= DAMP; A.vy *= DAMP;
    A.x += A.vx; A.y += A.vy;
    A.x = Math.max(PADX, Math.min(w - PADX, A.x));
    A.y = Math.max(PADY, Math.min(h - PADY, A.y));
  });
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const A = P[nodes[i].id], B = P[nodes[j].id]; if (!A || !B) continue;
        const dx = B.x - A.x, dy = B.y - A.y;
        const ox = box.w - Math.abs(dx), oy = box.h - Math.abs(dy);
        if (ox > 0 && oy > 0) {
          if (ox < oy) { const s = (ox / 2) * (dx < 0 ? -1 : 1); if (dragId !== nodes[i].id) A.x -= s; if (dragId !== nodes[j].id) B.x += s; }
          else { const s = (oy / 2) * (dy < 0 ? -1 : 1); if (dragId !== nodes[i].id) A.y -= s; if (dragId !== nodes[j].id) B.y += s; }
        }
      }
    }
    // re-clamp after each collision pass so pushes don't stack nodes against the walls
    nodes.forEach((n) => {
      const A = P[n.id]; if (!A || dragId === n.id) return;
      A.x = Math.max(PADX, Math.min(w - PADX, A.x));
      A.y = Math.max(PADY, Math.min(h - PADY, A.y));
    });
  }
}

function useForce(dimRef, compactRef, nodesRef, edgesRef, spreadRef) {
  const pos = useRef({});
  const [, tick] = useState(0);
  const dragId = useRef(null);
  const alpha = useRef(1);
  const raf = useRef(null);
  const warmed = useRef(false);
  const lastBox = useRef({ w: 0, h: 0 });
  const lastSpread = useRef(spreadRef.current);

  // add positions for any nodes that don't have one yet (new nodes seed near anchor/center)
  const ensure = useCallback((anchor) => {
    const P = pos.current, nodes = nodesRef.current, { w, h } = dimRef.current;
    nodes.forEach((n) => {
      if (!P[n.id]) {
        const base = anchor && P[anchor] ? P[anchor] : { x: w / 2, y: h / 2 };
        P[n.id] = { x: base.x + (Math.random() - 0.5) * 80, y: base.y + (Math.random() - 0.5) * 80, vx: 0, vy: 0 };
      }
    });
  }, [dimRef, nodesRef]);

  // SYNCHRONOUS (re)settle in the render body — so the graph is laid out even if
  // requestAnimationFrame is throttled (e.g. offscreen preview iframes). Re-runs on
  // first paint and whenever the effective canvas resizes materially.
  const { w: cw, h: ch } = dimRef.current;
  if (cw > 200 && ch > 120) {
    const fresh = !warmed.current;
    const resized = Math.abs(cw - lastBox.current.w) > 30 || Math.abs(ch - lastBox.current.h) > 30;
    const spun = Math.abs(spreadRef.current - lastSpread.current) > 0.001;
    // A big width jump (e.g. the 320 fallback resolving to the real board width in a
    // throttled iframe) needs a full reseed + long anneal, not a gentle nudge.
    const bigGrow = cw > lastBox.current.w * 1.4;
    if (fresh || resized || spun) {
      if (fresh || bigGrow) seedPositions(pos.current, nodesRef.current, cw, ch);
      ensure();
      const deep = fresh || bigGrow;
      const steps = deep ? 240 : 100;
      for (let k = 0; k < steps; k++) simStep(pos.current, nodesRef.current, edgesRef.current, cw, ch, deep ? Math.max(0.25, 1 - k / 260) : 0.55, null, compactRef.current, spreadRef.current);
      alpha.current = 0.14; warmed.current = true; lastBox.current = { w: cw, h: ch }; lastSpread.current = spreadRef.current;
    }
  }

  useEffect(() => {
    let mounted = true;
    const loop = () => {
      if (!mounted) return;
      const { w, h } = dimRef.current;
      if (w > 200 && h > 120 && warmed.current) {
        ensure();
        simStep(pos.current, nodesRef.current, edgesRef.current, w, h, alpha.current, dragId.current, compactRef.current, spreadRef.current);
        alpha.current = Math.max(0.03, alpha.current * 0.99);
        tick((t) => (t + 1) % 1000000);
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { mounted = false; cancelAnimationFrame(raf.current); };
  }, [dimRef, compactRef, ensure, nodesRef, edgesRef, spreadRef]);

  const reheat = (v) => { alpha.current = v || 0.9; };
  const relayout = () => {
    const { w, h } = dimRef.current;
    seedPositions(pos.current, nodesRef.current, w, h);
    for (let k = 0; k < 220; k++) simStep(pos.current, nodesRef.current, edgesRef.current, w, h, Math.max(0.25, 1 - k / 240), null, compactRef.current, spreadRef.current);
    alpha.current = 0.4; lastBox.current = { w, h };
    tick((t) => (t + 1) % 1000000);
  };
  return { pos: pos.current, dragId, reheat, relayout, ensure };
}

/* ---------- AI / manual intake ---------- */
function stripJSON(s) {
  if (!s) return s;
  const m = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  let t = (m ? m[1] : s).trim();
  const f = t.indexOf("{"), l = t.lastIndexOf("}");
  if (f >= 0 && l > f) t = t.slice(f, l + 1);
  return t;
}

async function analyzeDoc(nodes, doc) {
  const list = nodes.map((n) => `${n.id} — ${n.label} [${CAT[n.cat].label}]`).join("\n");
  const prompt = `You are the "machine layer" of a FLAT (non-hierarchical) knowledge graph for the literary-nonfiction memoir "Construction, Not Recovery" by Kyle Rosebrook. A new source document is being filed into the graph. Read it and decide where it belongs.

EXISTING NODES (id — label [CATEGORY]):
${list}

CATEGORIES: ${CAT_HINT}

VOICE: archival, forensic, contemplative. No recovery clichés, no self-help tone, no false epiphany. Specific, not generic.

Return ONLY strict JSON (no markdown), shape:
{"label":"<=5 word node label","cat":"thesis|subject|evidence|history|build|craft","blurb":"one specific sentence","status":"verified|contested|unresolved","era":"date or period, or empty","source":"provenance (scan/journal/document/era), or empty","beats":["scene-level concrete moment"],"connections":[{"to":"<existing node id>","kind":"short verb phrase like supports / compensates for / mirrors / expands / complicates","reason":"one sentence naming the SPECIFIC reason these connect","evd":true|false}]}
Pick 1–3 of the most defensible connections. "evd" true only if this is clinical or archival evidence. "status": verified = documented fact; contested = sources disagree; unresolved = cannot be pinned. "beats": 0–2 concrete moments, forensic not summary, or omit.

DOCUMENT TITLE: ${doc.name}
DOCUMENT ${doc.text ? "CONTENT" : "NOTE"}:
${(doc.text || doc.note || "").slice(0, 5000)}`;
  const raw = await window.claude.complete({ messages: [{ role: "user", content: prompt }] });
  const data = JSON.parse(stripJSON(raw));
  // validate
  const ids = new Set(nodes.map((n) => n.id));
  data.cat = CAT[data.cat] ? data.cat : "evidence";
  data.status = STATUS[data.status] ? data.status : "unresolved";
  data.era = typeof data.era === "string" ? data.era.slice(0, 60) : "";
  data.source = typeof data.source === "string" ? data.source.slice(0, 80) : "";
  data.beats = Array.isArray(data.beats) ? data.beats.filter((b) => typeof b === "string" && b.trim()).slice(0, 3) : [];
  data.connections = (data.connections || []).filter((c) => ids.has(c.to)).slice(0, 3);
  return data;
}

/* ---------- publish-safe (shared manifest transform; view-only, mirrors the search tool) ---------- */
const PROT = (typeof window !== "undefined" && window.ABSTREKKT_PROTECTIONS) || null;
let PUBLISH_SAFE = false;
function psafe(x) { return PUBLISH_SAFE && PROT && PROT.publishSafe ? PROT.publishSafe(x) : x; }

/* ---------- app ---------- */
function App() {
  const boardRef = useRef(null);
  const canvasRef = useRef(null);
  const [dim, setDim] = useState({ w: 0, h: 0 });
  const [compact, setCompact] = useState(false);
  // width tracks the real board exactly (no dead margin); height keeps a floor so
  // short viewports scroll instead of clipping. Fall back to a direct DOM read when
  // async state hasn't landed yet (offscreen iframes throttle rAF *and* observers).
  const liveW = dim.w || (boardRef.current ? boardRef.current.clientWidth : 0);
  const liveH = dim.h || (boardRef.current ? boardRef.current.clientHeight : 0);
  const simW = Math.max(liveW, 320);
  const simH = Math.max(liveH, compact ? 720 : 560);
  const dimRef = useRef({ w: simW, h: simH }); dimRef.current = { w: simW, h: simH };
  const compactRef = useRef(compact); compactRef.current = compact;
  useLayoutEffect(() => {
    const el = boardRef.current; if (!el) return;
    let alive = true, tries = 0;
    const apply = (w, h) => { setDim({ w, h }); setCompact(w > 0 && w < 720); };
    // Poll on a timeout chain (NOT rAF — throttled when the iframe is offscreen)
    // until the board reports a real width, then let the observer take over.
    const settle = () => {
      if (!alive) return;
      const w = el.clientWidth, h = el.clientHeight;
      if (w > 0) { apply(w, h); }
      else if (tries++ < 120) { setTimeout(settle, 32); }
    };
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth, h = el.clientHeight;
      if (w > 0) apply(w, h);
    });
    ro.observe(el); settle();
    return () => { alive = false; ro.disconnect(); };
  }, []);

  const [nodes, setNodes] = useState(SEED_NODES);
  const [edges, setEdges] = useState(SEED_EDGES);
  const [spread, setSpread] = useState(1);
  const nodesRef = useRef(nodes), edgesRef = useRef(edges), spreadRef = useRef(spread);
  nodesRef.current = nodes; edgesRef.current = edges; spreadRef.current = spread;

  const NODE_BY = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const DEG = useMemo(() => { const d = {}; edges.forEach((e) => { d[e.a] = (d[e.a] || 0) + 1; d[e.b] = (d[e.b] || 0) + 1; }); return d; }, [edges]);

  const { pos, dragId, reheat, relayout, ensure } = useForce(dimRef, compactRef, nodesRef, edgesRef, spreadRef);
  // Mount ladder: explicitly drive the full reseed once the board reports its real
  // width. The passive ResizeObserver/poll can miss on first load in a throttled
  // iframe (no size CHANGE fires), so we set the real dims and call relayout()
  // directly — the same reseed+anneal path a resize would trigger.
  useEffect(() => {
    const el = boardRef.current; if (!el) return;
    let done = false;
    const kick = () => {
      if (done) return;
      const w = el.clientWidth, h = el.clientHeight;
      if (w > 320) {
        done = true;
        dimRef.current = { w, h: Math.max(h, compactRef.current ? 720 : 560) };
        setDim({ w, h });
        relayout();
      }
    };
    const timers = [0, 50, 150, 300, 600, 1000, 1600].map((d) => setTimeout(kick, d));
    return () => timers.forEach(clearTimeout);
  }, []);
  // actively re-settle into the box whenever the effective canvas changes
  useEffect(() => { if (simW > 200) reheat(0.7); }, [simW, simH]);
  const [sel, setSel] = useState(null);
  const [selEdge, setSelEdge] = useState(null);
  const [hoverEdge, setHoverEdge] = useState(null);
  const [intake, setIntake] = useState(false);
  const [help, setHelp] = useState(false);
  const [corpus, setCorpus] = useState(false);
  const [pubSafe, setPubSafe] = useState(false);
  PUBLISH_SAFE = pubSafe;
  const [dropping, setDropping] = useState(false);
  const moved = useRef(false);

  // re-energize sim when spread changes
  useEffect(() => { reheat(0.7); }, [spread]);

  const panelOpen = sel != null || selEdge != null;

  const neighbors = useMemo(() => {
    if (!sel) return null;
    const s = new Set();
    edges.forEach((e) => { if (e.a === sel) s.add(e.b); if (e.b === sel) s.add(e.a); });
    return s;
  }, [sel, edges]);

  const selConns = useMemo(() => {
    if (!sel) return [];
    return edges.map((e, i) => ({ e, i })).filter(({ e }) => e.a === sel || e.b === sel)
      .map(({ e, i }) => {
        const out = e.a === sel; const other = out ? e.b : e.a;
        return { i, other: NODE_BY[other], out, kind: e.kind, reason: e.reason, evd: e.evd, ai: e.ai };
      });
  }, [sel, edges, NODE_BY]);

  const onNodeDown = (id, ev) => {
    ev.stopPropagation();
    dragId.current = id; moved.current = false;
    const startX = ev.clientX, startY = ev.clientY;
    const move = (e) => {
      const cx = (e.touches ? e.touches[0].clientX : e.clientX);
      const cy = (e.touches ? e.touches[0].clientY : e.clientY);
      if (Math.abs(cx - startX) + Math.abs(cy - startY) > 4) moved.current = true;
      const rect = (canvasRef.current || boardRef.current).getBoundingClientRect();
      if (pos[id]) { pos[id].x = cx - rect.left; pos[id].y = cy - rect.top; }
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      if (!moved.current) { setSel(id); setSelEdge(null); }
      dragId.current = null; reheat(0.5);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const clearSel = () => { setSel(null); setSelEdge(null); };
  const edgeMid = (e) => { const A = pos[e.a], B = pos[e.b]; return { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }; };

  // commit a new node + edges from intake
  const commit = (node, conns) => {
    const anchor = conns[0] ? conns[0].to : null;
    setNodes((ns) => [...ns, node]);
    setEdges((es) => [...es, ...conns.map((c) => ({ a: node.id, b: c.to, kind: c.kind, reason: c.reason, evd: c.evd, ai: c.ai }))]);
    // place near anchor before sim runs
    requestAnimationFrame(() => { ensure(anchor); reheat(0.95); setSel(node.id); });
    setIntake(false);
  };

  const onDrop = (e) => {
    e.preventDefault(); setDropping(false);
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) setIntake({ file: f });
  };

  return (
    <div className={"shell" + (panelOpen ? " panel-open" : "")}>
      <div className="mast">
        <div className="mast-l">
          <div className="kick">MEMOIR SOURCE MAP · EVIDENCE BOARD</div>
          <h1>Construction, <em>Not Recovery</em></h1>
          <div className="sub">Kyle Rosebrook · {nodes.length} nodes · {edges.length} relations · a network, not a tree</div>
        </div>
        <div className="mast-r">
          <div className="spread">
            <span className="spread-l">SPREAD</span>
            <input type="range" min="0.6" max="2.4" step="0.05" value={spread}
              onChange={(e) => setSpread(parseFloat(e.target.value))} />
          </div>
          <button className="tool primary" onClick={() => setIntake(true)}>＋ Add source</button>
          <button className="tool" onClick={relayout}>↻ Re-tangle</button>
          <button className="tool" onClick={clearSel}>✕ Deselect</button>
          <button className="tool" onClick={() => setCorpus(true)} title="Corpus disposition ledger">▤ Corpus</button>
          <button className={"tool" + (pubSafe ? " on" : "")} onClick={() => setPubSafe((v) => !v)} title="Publish-safe: reduce living private individuals to initials for sharing">{pubSafe ? "◉" : "○"} Publish-safe</button>
          <button className="tool" onClick={() => setHelp(true)} title="Quick reference & manual">? Manual</button>
        </div>
      </div>

      <div className="main">
        <div className={"board" + (dropping ? " dropping" : "")} ref={boardRef}
          onPointerDown={clearSel}
          onDragOver={(e) => { e.preventDefault(); setDropping(true); }}
          onDragLeave={() => setDropping(false)}
          onDrop={onDrop}>
          <div className="canvas" ref={canvasRef} style={{ width: "100%", minWidth: simW, height: simH }}>
          <svg className="edges">
            {edges.map((e, i) => {
              const A = pos[e.a], B = pos[e.b]; if (!A || !B) return null;
              const lit = sel ? (e.a === sel || e.b === sel) : (selEdge === i || hoverEdge === i);
              const dm = (sel && !lit) || (selEdge != null && selEdge !== i && !lit);
              const cls = "edge-line" + (e.p ? " primary" : "") + (e.ai ? " ai" : "") + (lit ? " lit" : "") + (lit && e.evd ? " evd" : "") + (dm ? " dim" : "");
              return (
                <g key={i}>
                  <line className={cls} x1={A.x} y1={A.y} x2={B.x} y2={B.y} />
                  <line className="edge-hit" x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                    onPointerDown={(ev) => { ev.stopPropagation(); setSelEdge(i); setSel(null); }}
                    onMouseEnter={() => setHoverEdge(i)} onMouseLeave={() => setHoverEdge(null)} />
                </g>
              );
            })}
          </svg>

          {hoverEdge != null && selEdge == null && pos[edges[hoverEdge].a] && pos[edges[hoverEdge].b] && (() => {
            const e = edges[hoverEdge]; const m = edgeMid(e);
            return (
              <div className={"etip" + (e.evd ? " evd" : "")} style={{ left: m.x, top: m.y }}>
                <b>{psafe(NODE_BY[e.a].label)}</b> {e.kind} <b>{psafe(NODE_BY[e.b].label)}</b>
              </div>
            );
          })()}

          {nodes.map((n) => {
            const P = pos[n.id]; if (!P) return null;
            const isSel = sel === n.id;
            const isN = neighbors && neighbors.has(n.id);
            const faded = (sel && !isSel && !isN) || (selEdge != null && edges[selEdge].a !== n.id && edges[selEdge].b !== n.id);
            const cls = "node" + (n.hub ? " hub" : "") + (compact ? " small" : "") + (n.added ? " added" : "") + (isSel ? " sel" : "") + (dragId.current === n.id ? " dragging" : "") + (faded ? " faded" : "") + (isN ? " neighbor" : "");
            return (
              <div key={n.id} className={cls} style={{ left: P.x, top: P.y, "--cat": CAT[n.cat].color }}
                onPointerDown={(ev) => onNodeDown(n.id, ev)}>
                <div className="ntag"><span>{n.tag}{n.added ? " ✦" : ""}</span><span className="ndeg">{DEG[n.id] || 0} ◦</span></div>
                <div className="nlabel">{psafe(n.label)}</div>
              </div>
            );
          })}
          </div>

          {dropping && <div className="dropmsg"><div className="dropmsg-in">Drop document to file into the archive</div></div>}
        </div>

        {!panelOpen && !compact && (
          <div className="boardhint">
            <div className="bh-kick">HOW THE BOOK WORKS</div>
            <p className="bh-p">A flat, interconnected map of the memoir's system — thesis, evidence, characters, sources, threads, and workflow. No root, no hierarchy. Click a node for its connections; click a thread for why two things link. Drag to move; <b>Spread</b> stretches the web.</p>
            <button className="addbtn" onClick={() => setIntake(true)}>＋ Add a source document</button>
            <p className="bh-sub">Upload or drop a file — the machine layer reads it, classifies it, and proposes where it connects. You approve before it lands.</p>
            <div className="bh-legend">
              {Object.values(CAT).map((c) => (
                <span className="lg" key={c.label}><span className="sw" style={{ "--lc": c.color }} />{c.label}</span>
              ))}
            </div>
          </div>
        )}

        {panelOpen && (
          <Panel sel={sel ? NODE_BY[sel] : null} selConns={selConns}
            selEdge={selEdge != null ? edges[selEdge] : null} nodeBy={NODE_BY} edgeCount={edges.length}
            nodeCount={nodes.length} primaryCount={edges.filter((e) => e.p).length}
            onPickNode={(id) => { setSel(id); setSelEdge(null); }}
            onPickEdge={(i) => { setSelEdge(i); setSel(null); }}
            onBack={clearSel} onAdd={() => setIntake(true)} />
        )}
      </div>

      {intake && <Intake nodes={nodes} initialFile={intake.file} nodeBy={NODE_BY}
        onClose={() => setIntake(false)} onCommit={commit} />}
      {help && <HelpOverlay onClose={() => setHelp(false)} />}
      {corpus && <CorpusLedger onClose={() => setCorpus(false)} />}
    </div>
  );
}

function Panel({ sel, selConns, selEdge, nodeBy, onPickNode, onPickEdge, onBack, onAdd, nodeCount, edgeCount, primaryCount }) {
  if (selEdge) {
    return (
      <div className="panel">
        <button className="back" onClick={onBack}>← board</button>
        <div className={"en-kick" + (selEdge.evd ? " evd" : "")}>◆ RELATION · {selEdge.ai ? "MACHINE-PROPOSED" : selEdge.evd ? "EVIDENCE LINK" : (selEdge.p ? "PRIMARY LINK" : "CONNECTION")}</div>
        <div className="en-pair">
          <span className="en-chip" style={{ "--ec": CAT[nodeBy[selEdge.a].cat].color }} onClick={() => onPickNode(selEdge.a)}>{psafe(nodeBy[selEdge.a].label)}</span>
          <span className="en-rel">{selEdge.kind} →</span>
          <span className="en-chip" style={{ "--ec": CAT[nodeBy[selEdge.b].cat].color }} onClick={() => onPickNode(selEdge.b)}>{psafe(nodeBy[selEdge.b].label)}</span>
        </div>
        <p className="en-reason">{psafe(selEdge.reason)}</p>
      </div>
    );
  }
  if (sel) {
    return <NodePanel sel={sel} selConns={selConns} nodeBy={nodeBy} onPickEdge={onPickEdge} onPickNode={onPickNode} onBack={onBack} />;
  }
  return (
    <div className="panel panel-empty">
      <div className="pe-kick">HOW THE BOOK WORKS</div>
      <p>An interconnected map of the memoir's system — thesis, evidence, characters, source documents, narrative threads, contradictions, and drafting workflow. Deliberately flat: no root, no hierarchy.</p>
      <p style={{ color: "var(--outline)", fontSize: "13px" }}>Click any node to read its connections. Click a thread to read why two things are linked. Drag to rearrange; use <b style={{ color: "var(--ink-var)" }}>Spread</b> to stretch the web apart.</p>
      <button className="addbtn" onClick={onAdd}>＋ Add a source document</button>
      <p style={{ color: "var(--outline)", fontSize: "12px", marginTop: "10px" }}>Upload or drop a file — the machine layer reads it, classifies it, and proposes where it connects and why. You approve before anything lands.</p>
      <div className="counts">
        <div className="ct"><div className="n">{nodeCount}</div><div className="l">NODES</div></div>
        <div className="ct"><div className="n">{edgeCount}</div><div className="l">RELATIONS</div></div>
        <div className="ct"><div className="n">{primaryCount}</div><div className="l">PRIMARY</div></div>
      </div>
      <div className="legend">
        {Object.values(CAT).map((c) => (
          <div className="lg" key={c.label}><span className="sw" style={{ "--lc": c.color }} />{c.label}</div>
        ))}
      </div>
    </div>
  );
}

/* ---------- node panel: tabbed, carries the rich schema ---------- */
function NodePanel({ sel, selConns, nodeBy, onPickEdge, onPickNode, onBack }) {
  const [tab, setTab] = useState("overview");
  useEffect(() => { setTab("overview"); }, [sel && sel.id]);

  const hasEvidence = !!(sel.era || sel.source || (sel.refs && sel.refs.length) || (sel.beats && sel.beats.length) || sel.conf != null || sel.status);
  const hasContra = !!(sel.contradicts && sel.contradicts.length);
  const hasCraft = !!((sel.chapters && sel.chapters.length) || (sel.open && sel.open.length));
  const tabs = [
    ["overview", "Overview", true],
    ["evidence", "Evidence", hasEvidence],
    ["contra", "Contradictions", hasContra],
    ["craft", "Craft", hasCraft],
  ].filter((t) => t[2]);
  const st = sel.status ? STATUS[sel.status] : null;

  return (
    <div className="panel">
      <button className="back" onClick={onBack}>← board</button>
      <div className="np-head">
        <span className="np-tag" style={{ "--tc": CAT[sel.cat].color }}>{sel.tag}</span>
        {st && <span className="np-status" style={{ "--sc": st.color }}>{st.label}{sel.conf != null ? " · " + fmtConf(sel.conf) : ""}</span>}
      </div>
      <h2 className="np-title">{psafe(sel.label)}</h2>
      <div className="np-cat" style={{ "--tc": CAT[sel.cat].color }}>{CAT[sel.cat].label}{sel.era ? <span className="np-era"> · {sel.era}</span> : null}</div>

      {sel.protect && (
        <div className="np-protect">
          <span className="npp-kick">⚠ PROTECTED SOURCE</span>
          <p>{psafe(sel.protect)}</p>
        </div>
      )}

      <div className="np-tabs">
        {tabs.map(([k, label]) => (
          <button key={k} className={"np-tab" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>
            {label}{k === "contra" && hasContra ? <i className="np-badge">{sel.contradicts.length}</i> : null}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="np-body">
          <p className="np-blurb">{psafe(sel.blurb)}</p>
          {sel.stakes && <div className="np-stakes"><span className="nps-kick">WHY IT MATTERS</span><p>{psafe(sel.stakes)}</p></div>}
          <div className="conn-h">CONNECTIONS <span>{selConns.length}</span></div>
          <div className="np-conns">
            {selConns.map((c) => (
              <button key={c.i} className={"np-conn" + (c.evd ? " evd" : "") + (c.ai ? " ai" : "")} onClick={() => onPickEdge(c.i)}>
                <span className="npc-rel">{c.out ? "" : "← "}{c.kind}{c.out ? " →" : ""}</span>
                <span className="npc-other" style={{ "--oc": CAT[c.other.cat].color }}>{psafe(c.other.label)}</span>
                <span className="npc-reason">{psafe(c.reason)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "evidence" && (
        <div className="np-body">
          <div className="np-meta">
            {sel.source && <div className="npm"><span className="npm-k">SOURCE</span><span className="npm-v">{sel.source}</span></div>}
            {sel.era && <div className="npm"><span className="npm-k">ERA</span><span className="npm-v">{sel.era}</span></div>}
            {sel.conf != null && <div className="npm"><span className="npm-k">CONFIDENCE</span><span className="npm-v">{fmtConf(sel.conf)}</span></div>}
            {sel.conf === null && <div className="npm"><span className="npm-k">CONFIDENCE</span><span className="npm-v" style={{ color: "var(--error)" }}>unscored — by design</span></div>}
          </div>
          {sel.refs && sel.refs.length > 0 && (
            <div className="np-refs">
              <span className="npr-kick">ARCHIVE REFS</span>
              <div className="npr-list">{sel.refs.map((r) => <span key={r} className="npr">{r}</span>)}</div>
            </div>
          )}
          {sel.beats && sel.beats.length > 0 && (
            <>
              <div className="conn-h">KEY BEATS <span>{sel.beats.length}</span></div>
              <ul className="np-beats">{sel.beats.map((b, i) => <li key={i}>{psafe(b)}</li>)}</ul>
            </>
          )}
        </div>
      )}

      {tab === "contra" && (
        <div className="np-body">
          <p className="np-note">Contradiction is content, not error. These conflicts stay on the board unresolved where the thesis requires it.</p>
          {sel.contradicts.map((c, i) => {
            const other = nodeBy[c.with];
            return (
              <div className="np-contra" key={i}>
                <div className="npx-head">
                  <span className="npx-mark">≠</span>
                  {other
                    ? <button className="npx-with" style={{ "--oc": CAT[other.cat].color }} onClick={() => onPickNode(c.with)}>{psafe(other.label)}</button>
                    : <span className="npx-with">{psafe(c.with)}</span>}
                </div>
                <p className="npx-note">{psafe(c.note)}</p>
              </div>
            );
          })}
        </div>
      )}

      {tab === "craft" && (
        <div className="np-body">
          {sel.chapters && sel.chapters.length > 0 && (
            <>
              <div className="conn-h">APPEARS IN <span>{sel.chapters.length}</span></div>
              <div className="np-chaps">{sel.chapters.map((c) => <span key={c} className="np-chap">{c}</span>)}</div>
            </>
          )}
          {sel.open && sel.open.length > 0 && (
            <>
              <div className="conn-h">OPEN QUESTIONS <span>{sel.open.length}</span></div>
              <ul className="np-open">{sel.open.map((o, i) => <li key={i}>{psafe(o)}</li>)}</ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- help overlay (quick reference; full manual is a separate page) ---------- */
function HelpOverlay({ onClose }) {
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const rows = [
    ["Click a node", "its blurb + every connection, with reasons"],
    ["Click a thread", "why those two things are linked"],
    ["Drag a node", "reposition — the web re-settles live"],
    ["SPREAD", "stretch or compress the whole web"],
    ["↻ Re-tangle", "re-seed the layout (positions are ephemeral)"],
    ["＋ Add source / drop a file", "intake: analyze → review → commit — nothing lands without approval"],
    ["Esc / empty board", "deselect"],
  ];
  return (
    <div className="help-scrim" onClick={onClose}>
      <div className="help-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Quick reference">
        <div className="help-head">
          <span className="help-kick">QUICK REFERENCE</span>
          <button className="tool" onClick={onClose}>✕</button>
        </div>
        {rows.map(([k, v]) => (
          <div className="help-row" key={k}><span className="help-k">{k}</span><span className="help-v">{v}</span></div>
        ))}
        <div className="help-foot">
          <span>Threads: <b className="hp">bright</b> = primary · <b className="hb">blue</b> = evidence-backed · <b>dashed</b> = machine-filed</span>
          <a className="help-link" href="Source Map Manual.html">Open the full manual →</a>
        </div>
      </div>
    </div>
  );
}

/* ---------- corpus disposition ledger (layer B: file-hygiene audit of the 265-file corpus) ---------- */
const CORPUS_DISP = {
  total: 265, curated: 209, excluded: 56, autofixed: 40,
  actions: [
    { key: "KEEP_AS_IS", n: 135, color: "var(--blue)", note: "Clean of all nine contamination markers. Copied unchanged." },
    { key: "DECONTAMINATE_KEEP", n: 74, color: "var(--amber)", note: "Mechanical issue — 40 auto-patched (stale domain / deprecated model string); the rest flagged for a manual pass." },
    { key: "ARCHIVE_ONLY", n: 51, color: "var(--error)", note: "Excluded from curated: superseded duplicates, retired-brand structural files, confirmed contamination, or a hard-rule violation." },
    { key: "NEEDS_REVIEW", n: 5, color: "var(--outline)", note: "Reviewed and dispositioned — verdicts below (Jul 2026)." },
  ],
  autofixes: [
    "kylerosebrook.com → abstrekkt.com (canonical homepage, locked)",
    "claude-sonnet-4-20250514 → claude-sonnet-4-6 (deprecated model string, locked)",
  ],
  flagged: [
    "#e11d48 — retired ChaosClubCo red; no replacement chosen, not blind-replaced",
    "\"240+\" — ambiguous (tool count vs dollar/hour figure); needs eyes",
    "\"Staff/Senior/Principal Engineer\" titles — sometimes Kyle (forbidden), sometimes a third party in a template",
  ],
  nameFinding: "The daughter's name was found in ~30 memoir-lane files (expected, untouched) and 27 non-memoir files — business tools, blog posts, brand pages — where it has no place. Those 27 are archived out of the curated set. No passages were opened or quoted; only the string was detected.",
  review: [
    ["OpsHub.jsx", "KEEP", "The intended merge target — Kanban + Portfolio were folded into it (Jun 3, 2026). Archive PortfolioCommandCenter as the absorbed predecessor; patch the stale “peer support platform” seed text next time it's touched."],
    ["doc_connections.html", "ARCHIVE", "Superseded by this source-map graph. Keep cross_doc_connection_map.jsx as a reference prototype; retire doc_connections.html and doc_connection_map.html."],
    ["kylerosebrook-homepage.html", "REWRITE", "Editorial design is sound; the copy carried the retired peer-support / dead-domain framing. Rewritten on the same bones for abstrekkt.com with current framing."],
    ["next-7-arcs-series-7.jsx", "RELANE", "A business content-arc tool, not memoir source. Keep it in the business archive and scrub the daughter's-name reference per the firewall rule."],
    ["the-evidence-board.html", "ARCHIVE", "Superseded by the-evidence-board-v2.md (newer — adds the page-2/3 date contradiction and Source-Documents + Physicians provenance) and by this graph. Retain only as an interactive snapshot if wanted."],
  ],
};

function CorpusLedger({ onClose }) {
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const d = CORPUS_DISP;
  const max = Math.max(...d.actions.map((a) => a.n));
  return (
    <div className="help-scrim" onClick={onClose}>
      <div className="corpus-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Corpus disposition ledger">
        <div className="help-head">
          <span className="help-kick">CORPUS DISPOSITION · {d.total} FILES</span>
          <button className="tool" onClick={onClose}>✕</button>
        </div>
        <p className="corpus-lede">A file-hygiene audit of the full knowledge base — separate from the semantic map above. Curated set: <b>{d.curated}</b> re-uploadable · <b>{d.excluded}</b> excluded · <b>{d.autofixed}</b> mechanically patched. Full trail in <code>DISPOSITION_MANIFEST.csv</code>.</p>

        <div className="corpus-bars">
          {d.actions.map((a) => (
            <div className="cbar" key={a.key}>
              <div className="cbar-top"><span className="cbar-k" style={{ "--cc": a.color }}>{a.key.replace(/_/g, " ")}</span><span className="cbar-n mono">{a.n}</span></div>
              <div className="cbar-track"><span style={{ width: (a.n / max * 100) + "%", background: a.color }} /></div>
              <div className="cbar-note">{a.note}</div>
            </div>
          ))}
        </div>

        <div className="corpus-grid">
          <div className="corpus-col">
            <div className="corpus-h">AUTO-FIXED · mechanical, already-decided</div>
            <ul className="corpus-list">{d.autofixes.map((x, i) => <li key={i} className="cok">{x}</li>)}</ul>
            <div className="corpus-h">FLAGGED · not blind-replaced</div>
            <ul className="corpus-list">{d.flagged.map((x, i) => <li key={i} className="cwarn">{x}</li>)}</ul>
          </div>
          <div className="corpus-col">
            <div className="corpus-h alert">⚠ NAME-REFERENCE FINDING</div>
            <p className="corpus-finding">{d.nameFinding}</p>
            <div className="corpus-h">REVIEWED · disposition</div>
            <ul className="corpus-list">{d.review.map(([f, verdict, why], i) => <li key={i} className="creview"><div className="crv-top"><span className={"crv-chip crv-" + verdict.toLowerCase()}>{verdict}</span><b className="mono">{f}</b></div><span>{why}</span></li>)}</ul>
          </div>
        </div>

        <ProtectionsFooter />
      </div>
    </div>
  );
}

/* Governed-by section — reads the ONE canonical manifest so the ledger shows
   exactly what the search tool enforces. */
function ProtectionsFooter() {
  const M = typeof window !== "undefined" && window.ABSTREKKT_PROTECTIONS;
  if (!M) return null;
  const people = Object.values(M.people);
  const threads = Object.entries(M.threads);
  return (
    <div className="prot-foot">
      <div className="corpus-h alert">◆ GOVERNED BY PROTECTIONS MANIFEST · v{M.version}</div>
      <p className="corpus-finding">One canonical policy (<span className="mono">abstrekkt/protections.js</span>) enforced across the source map <i>and</i> the archive search — sealed material is absent by policy, not merely hidden. Updated {M.updated}.</p>
      <div className="prot-cols">
        <div>
          <div className="corpus-h">PROTECTED IDENTITIES</div>
          <ul className="corpus-list">{people.map((p, i) => (
            <li key={i} className="creview"><b className="mono">{p.label}</b><span>{p.policy.replace(/-/g, " ")}</span></li>
          ))}</ul>
        </div>
        <div>
          <div className="corpus-h">SEALED THREADS</div>
          <ul className="corpus-list">{threads.map(([k, t]) => (
            <li key={k} className="creview"><b className="mono">{t.label}</b><span>{t.state}</span></li>
          ))}</ul>
        </div>
      </div>
    </div>
  );
}
function Intake({ nodes, initialFile, nodeBy, onClose, onCommit }) {
  const [step, setStep] = useState("pick");   // pick | analyzing | review | manual | error
  const [doc, setDoc] = useState(null);       // {name, text, note}
  const [err, setErr] = useState("");
  const [prop, setProp] = useState(null);     // {label, cat, blurb, connections:[{to,kind,reason,evd,on}]}
  const fileRef = useRef(null);

  const ingest = (file) => {
    const isText = /^text\//.test(file.type) || /\.(txt|md|markdown|csv|json|rtf)$/i.test(file.name);
    if (isText) {
      const r = new FileReader();
      r.onload = () => setDoc({ name: file.name, text: String(r.result).slice(0, 6000), note: "" });
      r.readAsText(file);
    } else {
      setDoc({ name: file.name, text: null, note: "" });
    }
  };
  useEffect(() => { if (initialFile) ingest(initialFile); }, []);

  const run = async () => {
    if (!hasAI) { setStep("manual"); seedManual(); return; }
    setStep("analyzing"); setErr("");
    try {
      const data = await analyzeDoc(nodes, doc);
      setProp({ ...data, connections: (data.connections || []).map((c) => ({ ...c, ai: true, on: true })) });
      setStep("review");
    } catch (e) {
      setErr("The machine layer couldn't parse a placement. You can file it manually.");
      seedManual(); setStep("manual");
    }
  };

  const seedManual = () => {
    setProp((p) => p || { label: (doc && doc.name.replace(/\.[^.]+$/, "")) || "New source", cat: "evidence", blurb: (doc && doc.note) || "", status: "unresolved", era: "", source: "", beats: [], connections: [] });
  };

  const slug = (s) => "n" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 24) + "-" + Math.random().toString(36).slice(2, 5);

  const finalize = () => {
    const used = prop.connections.filter((c) => c.on && c.to);
    const catKey = CAT[prop.cat] ? prop.cat : "evidence";
    const tagPrefix = { thesis: "THS", subject: "SBJ", evidence: "EVD", history: "HIS", build: "BLD", craft: "CRF" }[catKey];
    const node = { id: slug(prop.label || "source"), tag: tagPrefix + "·✦", cat: catKey, added: true,
      label: prop.label || "New source", blurb: prop.blurb || "Filed source — awaiting a written blurb.",
      status: STATUS[prop.status] ? prop.status : "unresolved",
      era: (prop.era || "").trim() || undefined,
      source: (prop.source || "").trim() || undefined,
      beats: (prop.beats || []).map((b) => b.trim()).filter(Boolean) };
    if (!node.beats.length) delete node.beats;
    onCommit(node, used.map((c) => ({ to: c.to, kind: c.kind || "relates to", reason: c.reason || "Connected during intake.", evd: !!c.evd, ai: !!c.ai })));
  };

  const setConn = (i, patch) => setProp((p) => ({ ...p, connections: p.connections.map((c, k) => k === i ? { ...c, ...patch } : c) }));
  const addManualConn = () => setProp((p) => ({ ...p, connections: [...p.connections, { to: "", kind: "relates to", reason: "", evd: false, ai: false, on: true }] }));

  return (
    <div className="intake-scrim" onClick={onClose}>
      <div className="intake" onClick={(e) => e.stopPropagation()}>
        <div className="intake-head">
          <div className="intake-kick">◆ MACHINE LAYER · DOCUMENT INTAKE</div>
          <button className="iconbtn" onClick={onClose}>✕</button>
        </div>

        {step === "pick" && (
          <div>
            <p className="intake-lead">File a source into the archive. The machine layer reads it, classifies it, and proposes where it connects — with a written reason for each thread. You approve before it lands.</p>
            <div className="drop" onClick={() => fileRef.current && fileRef.current.click()}>
              <input ref={fileRef} type="file" hidden accept=".txt,.md,.markdown,.csv,.json,.rtf,.pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={(e) => e.target.files[0] && ingest(e.target.files[0])} />
              <div className="drop-g">⬓</div>
              <div className="drop-t">{doc ? doc.name : "Click to choose a file — or drop one on the board"}</div>
              <div className="drop-s">{doc ? (doc.text != null ? `${doc.text.length} chars read` : "binary file — add a note below") : "txt · md · csv · json read directly; others by note"}</div>
            </div>
            {doc && doc.text == null && (
              <div className="fld">
                <label>NOTE FOR THE MACHINE LAYER <span className="req">required for this file type</span></label>
                <textarea className="ta" placeholder="What is this document? e.g. 'Scanned SPECT report, July 2022, Amen Clinics — perfusion findings.'"
                  value={doc.note} onChange={(e) => setDoc({ ...doc, note: e.target.value })} />
              </div>
            )}
            <div className="intake-actions">
              <button className="tool" onClick={() => { setStep("manual"); seedManual(); }}>File manually</button>
              <button className="tool primary" disabled={!doc || (doc.text == null && !doc.note.trim())} onClick={run}>
                {hasAI ? "✦ Analyze & place" : "Continue"}
              </button>
            </div>
            {!hasAI && <p className="intake-note">Machine layer unavailable here — you'll place it by hand (same result, you pick the links).</p>}
          </div>
        )}

        {step === "analyzing" && (
          <div className="analyzing">
            <div className="scan" />
            <div className="analyzing-t">Reading <b>{doc.name}</b> against {nodes.length} nodes…</div>
            <div className="analyzing-s mono">classifying · finding connections · writing reasons</div>
          </div>
        )}

        {(step === "review" || step === "manual") && prop && (
          <div className="review">
            {step === "review" && <div className="review-flag">✦ Machine-proposed placement — edit anything before it lands.</div>}
            {step === "manual" && err && <div className="review-flag warn">{err}</div>}
            <div className="grid2">
              <div className="fld">
                <label>LABEL</label>
                <input className="in" value={prop.label} onChange={(e) => setProp({ ...prop, label: e.target.value })} />
              </div>
              <div className="fld">
                <label>CATEGORY</label>
                <select className="in" value={prop.cat} onChange={(e) => setProp({ ...prop, cat: e.target.value })}>
                  {Object.entries(CAT).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>
            <div className="fld">
              <label>BLURB</label>
              <textarea className="ta" value={prop.blurb} onChange={(e) => setProp({ ...prop, blurb: e.target.value })} />
            </div>

            <div className="grid2">
              <div className="fld">
                <label>STANDING</label>
                <select className="in" value={prop.status || "unresolved"} onChange={(e) => setProp({ ...prop, status: e.target.value })}>
                  {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className="fld">
                <label>ERA <span className="req">optional</span></label>
                <input className="in" value={prop.era || ""} placeholder="e.g. Jul 2022" onChange={(e) => setProp({ ...prop, era: e.target.value })} />
              </div>
            </div>
            <div className="fld">
              <label>SOURCE / PROVENANCE <span className="req">optional</span></label>
              <input className="in" value={prop.source || ""} placeholder="which scan, journal, or document" onChange={(e) => setProp({ ...prop, source: e.target.value })} />
            </div>
            <div className="fld">
              <label>KEY BEATS <span className="req">optional · one per line</span></label>
              <textarea className="ta" value={(prop.beats || []).join("\n")} placeholder="scene-level moments — concrete, not summary"
                onChange={(e) => setProp({ ...prop, beats: e.target.value.split("\n") })} />
            </div>

            <div className="conn-h">CONNECTIONS <span>{prop.connections.filter((c) => c.on && c.to).length} active</span></div>
            {prop.connections.map((c, i) => (
              <div key={i} className={"conn-edit" + (c.on ? "" : " off")}>
                <div className="conn-edit-top">
                  <label className="chk"><input type="checkbox" checked={c.on} onChange={(e) => setConn(i, { on: e.target.checked })} /> link to</label>
                  <select className="in sm" value={c.to} onChange={(e) => setConn(i, { to: e.target.value })}>
                    <option value="">— choose node —</option>
                    {nodes.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
                  </select>
                  {c.ai && <span className="ai-tag">✦</span>}
                </div>
                <div className="conn-edit-row">
                  <input className="in sm kind" value={c.kind} placeholder="relationship (e.g. supports)" onChange={(e) => setConn(i, { kind: e.target.value })} />
                  <label className="chk evd"><input type="checkbox" checked={!!c.evd} onChange={(e) => setConn(i, { evd: e.target.checked })} /> evidence</label>
                </div>
                <textarea className="ta reason" value={c.reason} placeholder="why these two connect — be specific" onChange={(e) => setConn(i, { reason: e.target.value })} />
              </div>
            ))}
            <button className="addconn" onClick={addManualConn}>＋ add connection</button>

            <div className="intake-actions">
              <button className="tool" onClick={onClose}>Cancel</button>
              <button className="tool primary" disabled={!prop.label.trim()} onClick={finalize}>Commit to board →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
