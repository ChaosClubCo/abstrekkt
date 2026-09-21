import { useState, useEffect, useCallback } from "react";

// ── STORAGE ─────────────────────────────────────────────────────────────────
const S = {
  async get(k) { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } },
  async set(k, v) { try { await window.storage.set(k, JSON.stringify(v)); return true; } catch { return false; } },
};

// ── DATA: CHAPTERS ──────────────────────────────────────────────────────────
const OUTLINE = [
  { part: "PROLOGUE", ch: "Prologue", title: "The Wrong Beginning", status: "seed", notes: "Age oscillation, failed first book. Opens trying to tell AI his story — can't locate the beginning." },
  { part: "I", ch: "Ch 1", title: "Reading the Room", status: "excavated", notes: "O'Toole's. Diagnostic instinct origin. Sensory inventory complete Mar 25." },
  { part: "I", ch: "Ch 2", title: "The Permission", status: "seed", notes: "Couch scene. 'You don't have to.' Emotional architecture confirmed, specific details not." },
  { part: "I", ch: "Ch 3", title: "Counting Streetlights", status: "unverified", notes: "Age 17 walk. Real memory or AI extrapolation? Kyle hasn't confirmed." },
  { part: "II", ch: "Ch 4", title: "Hardware Failure", status: "protected", notes: "Injury, addiction, or both. Kyle discloses on his terms." },
  { part: "II", ch: "Ch 5", title: "The Noise That Stopped", status: "protected", notes: "What relief was FROM. Connects to relief line." },
  { part: "III", ch: "Ch 6", title: "First Tools", status: "not-started", notes: "Session 3 Tool Archaeology NOT done. Needs chronological mapping." },
  { part: "III", ch: "Ch 7", title: "Learning to Think in a New Architecture", status: "not-started", notes: "Screenshot method, card table, self-teaching cascade." },
  { part: "III", ch: "Ch 8", title: "The Arsenal", status: "not-started", notes: "240+ tools as prosthetic cognition. External memory as survival." },
  { part: "IV", ch: "Ch 9", title: "The Monitor Reflection", status: "seed", notes: "Dark screen to lit screen. Demoted from prologue to mid-book. First tech job moment." },
  { part: "IV", ch: "Ch 10", title: "The Wrong Book, The Right Failure", status: "seed", notes: "FlashFusion. The founder attempt that taught limits." },
  { part: "V", ch: "Ch 11", title: "Shoes On, Kiddo", status: "locked", notes: "Card table sequence LOCKED Apr 2026. Through-line: Crisis → Bear → work → card table → cascade → Chaos Club." },
  { part: "V", ch: "Ch 12", title: "Welcome to the Chaos Club", status: "not-started", notes: "The platform as artifact of the story. Book and business same project." },
  { part: "EPILOGUE", ch: "Epilogue", title: "The Distinction", status: "not-started", notes: "Construction vs. recovery. The final framing." },
];

// ── DATA: PEOPLE ────────────────────────────────────────────────────────────
const PEOPLE = [
  { name: "Kinsley", role: "Daughter", status: "mapped", notes: "Friday pickup 3:25pm. Emotional north star. Book's recipient. Present as Kyle sees her — no scenes excavated yet.", priority: "core" },
  { name: "Phillis Rosebrook", role: "Mother", status: "partial", notes: "Arranged Sedona trip to Bear. Lifeline intervention. Hinge point of turnaround. Found Amen Clinics.", priority: "core" },
  { name: "Soaring Bear", role: "Life Coach", status: "partial", notes: "Sacred Spiritual Healing Journeys, Sedona. Ongoing. Helped with website build. Sent assignments through FlashFusion ticket system. Almost no documented material.", priority: "core" },
  { name: "Corey", role: "Brother", status: "minimal", notes: "Age 35. Depression + anxiety. Minimal excavation.", priority: "secondary" },
  { name: "Matt Horne", role: "The Five", status: "partial", notes: "Left in Trump Tower photo, black suit. Married Stephanie. Two girls. Came to Kinsley's 5th birthday. Reconnected after Kyle reached out.", priority: "five" },
  { name: "Tom Ropel", role: "The Five", status: "not-excavated", notes: "Right in photo. Best friend growing up. 'An entire chapter by itself.' Married, two kids. Oliver came to Kinsley's 5th. NOT YET EXCAVATED.", priority: "five" },
  { name: "Dave Datt", role: "The Five", status: "not-excavated", notes: "Not in photo — was in India. Pharmacist school, flunked out. Died brain aneurysm, 20s/30s. Funeral NOT excavated. Parallel failure arc.", priority: "five" },
  { name: "Ryan [surname unknown]", role: "The Five", status: "not-excavated", notes: "Forgotten until count forced retrieval. Now CLC counselor. Puerto Rican grandmother — empanadas, blue kitchen. No contact 10+ years.", priority: "five" },
  { name: "Stephanie Horne", role: "Matt's wife", status: "minimal", notes: "Took Trump Tower photo. Part of Five's orbit. Came to Kinsley's 5th birthday.", priority: "secondary" },
  { name: "Michael", role: "Relationship", status: "protected", notes: "Coercive control dynamics. Primary source journals archived. HIGH narrative value — not a side story. Attorney before publish.", priority: "protected" },
  { name: "Dre/Dreana", role: "Kinsley's mother", status: "protected", notes: "Custody dynamics documented in primary source archive.", priority: "protected" },
];

// ── DATA: SCENE SEEDS ───────────────────────────────────────────────────────
const SEEDS = [
  { id: 1, title: "The Age Oscillation", status: "confirmed", notes: "19 or 21, three corrections. The uncertainty IS the thesis. Opens the book." },
  { id: 2, title: "Relief Line", status: "confirmed", notes: "'No one tells you that relief is the most addictive feeling of all.' Passes voice test. Seven words that might explain 18 years." },
  { id: 3, title: "Late-Night Walk, Age 17", status: "unverified", notes: "Counting streetlights. Pattern-seeking before it had a name. Real memory or AI extrapolation? Kyle hasn't confirmed." },
  { id: 4, title: "The Couch Permission", status: "confirmed", notes: "'You don't have to.' Not pressure — permission. Emotional architecture confirmed, specific details not." },
  { id: 5, title: "The Monitor Reflection", status: "confirmed", notes: "Dark screen to lit screen. Demoted from prologue to mid-book scene element." },
];

// ── DATA: EXCAVATION THREADS ────────────────────────────────────────────────
const THREADS = [
  { id: "t1", title: "Tom Ropel", priority: "high", status: "open", prompt: "Memoir excavation — Tom Ropel. Kyle said 'an entire chapter by itself.' Best friend growing up. Now married with two kids, came to Kinsley's 5th birthday. What happened between then and now? Start with: what's the earliest specific memory of Tom?" },
  { id: "t2", title: "Dave Datt's Funeral", priority: "high", status: "open", prompt: "Memoir excavation — Dave Datt. Died of a brain aneurysm. Both flunked out — Dave from pharmacy school in India, Kyle domestically. Same crew, same pattern, different continent. What year was the funeral? What was Kyle like when he walked in?" },
  { id: "t3", title: "NIU Expulsion 2016", priority: "high", status: "open", prompt: "Memoir excavation — NIU expulsion, 2016. Kicked out for not keeping grades up. Kyle flagged this as needing fuller excavation. What was happening? What were the grades? What was the spiral?" },
  { id: "t4", title: "Session 3: Tool Archaeology", priority: "high", status: "open", prompt: "Memoir Session 3 — Tool Archaeology. Chronological mapping of the tool adoption as archaeological evidence of cognitive reconstruction. Each tool marks a moment when organic function was unreliable and needed external scaffolding. Start with: what was the first tool/system after the break that actually helped? Not the first you tried — the first that worked." },
  { id: "t5", title: "15 Open Memoir Clarifiers", priority: "high", status: "open", prompt: "Memoir excavation — returning to the 15 open clarifiers from April 16. Especially: the Amen eval date conflict (p2 says summer 2020, p3 says Oct 2021), and the summer 2020 OD context. Was the summer 2020 OD accidental?" },
  { id: "t6", title: "The Car Hit (2014/15)", priority: "medium", status: "open", prompt: "Memoir excavation — the hit-by-car incident, 2014 or 2015. Walking to a girl's house on Xanax because parents wouldn't let Kyle use the car. Broke wrist. Where was the girl's house? What happened at the hospital? What was the Xanax situation at that point?" },
  { id: "t7", title: "$50K Spending Spree", priority: "medium", status: "open", prompt: "Memoir excavation — the settlement money arc. $50K from insurance, spent in 3-4 months. What was the car? What were the drugs? When did Kyle realize it was gone? Was there a specific moment or was it gradual?" },
  { id: "t8", title: "Ryan at CLC", priority: "medium", status: "open", prompt: "Memoir excavation — Ryan at CLC. The 'focused or something else' look. The unanswered outreach. One of Kyle's five is a counselor at the institution Kyle wants to partner with. They lost touch during the years the book is about. What does Kyle think happened?" },
  { id: "t9", title: "Couch Permission — Specifics", priority: "medium", status: "open", prompt: "Memoir excavation — the couch permission scene. Emotional architecture confirmed. Was there an actual couch? A specific person? A specific first time that felt like permission rather than pressure? Or is this emotional truth wearing a constructed scene?" },
  { id: "t10", title: "Rogers Behavioral Health", priority: "medium", status: "open", prompt: "Memoir excavation — Rogers Behavioral Health, summer 2020. 1.5 months. What happened there? What was the program? What did Kyle learn or not learn? How does it connect to the later construction?" },
  { id: "t11", title: "Kinsley's 5th Birthday — Scene Detail", priority: "medium", status: "open", prompt: "Memoir excavation — Kinsley's 5th birthday party. The reunion scene. Matt, Stephanie, two girls. Tom and Oliver. The settlement-money crew holding juice boxes instead of bottles. What did it feel like to have them there? Did they know what Kyle had been through?" },
  { id: "t12", title: "Streetlights Walk — Verification", priority: "low", status: "open", prompt: "Memoir verification — the late-night walk, age 17. 'Counting streetlights. If I don't find a way to quiet my head, it's going to tear me apart.' Does this walk feel like a real memory? Physical recognition? Or emotional truth wearing a scene that never happened? Both are usable — the book needs to know which." },
  { id: "t13", title: "Meditation Pivot", priority: "low", status: "open", prompt: "Memoir excavation — the meditation pivot. From dismissing it as 'bullshit' to calling it 'transformative.' When did it enter the picture? What was the specific shift from 'I want this to work' to 'I am open to this helping'?" },
];

// ── DATA: SONGS ─────────────────────────────────────────────────────────────
const SONGS = [
  "HOW_MANY", "ECHO_OF_THE_LESSONS", "MESHED_UP", "LITTLE_BLUE_HALOS", "TWISTED_WORDS",
  "ONE_PERCENT_OF_THE_TEMPORARY", "QUESTION_WITHOUT_A_FRAME", "TAX_THE_DAMAGE",
  "PLEASE_DAD_I_NEED_YOU", "SOURCE-CODE_SCARS", "PLEASE_DADDY_I_NEED_YOU",
  "THERES_BEEN_AN_ACCIDENT", "IGNITABLE_CANDOR", "GOLD_IN_THE_STATIC", "LOCKDOWN_MAZE",
  "ZOMBIELAND_STATIC", "DEAR_DAD", "IT_S_DEFINETELY_MY_FAULT", "FEEDBACK_LOOP",
  "I_LEARNED_THIS_FROM_YOU", "IVORY_RUIN_AND_GLITTERING_WOOD", "NEON_EXORCIST",
  "NO_ONE_FUCKIN_CARES", "WAKE_UP_INSIDE_A_COLOR_I_CAN_T_NAME",
  "LITTLE_WORLD_FROM_WHERE_YOU_STAND", "DONT_BE_BASHFUL", "A_LETTER_AWAY",
  "ONE_BREATH_AT_A_TIME", "I_CHOOSE_TO_STAY", "FINGERPRINT_CONFESSION",
  "THE_BREAK_THROUGH", "TRUST_ME", "BLACKLIGHT_FRACTURE", "MIRRORS_AND_MUZZLE_FLASHES",
  "WATCHU_WANT_FROM_ME",
];

// ── DATA: CLINICAL ──────────────────────────────────────────────────────────
const CLINICAL = {
  totalBrain: { date: "July 2022", scores: [
    { metric: "Processing Speed", pct: 99 }, { metric: "Focus", pct: 59 },
    { metric: "Planning", pct: 46 }, { metric: "Stress Control", pct: 27 },
    { metric: "Flexibility", pct: 17 }, { metric: "Recall Memory", pct: 12 },
    { metric: "Resilience", pct: 2 },
  ]},
  amenEval: { physicians: "Michael Easton MD (eval), Shane Creado MD (sleep/scan)", dateConflict: "p2 says hypoxia 'summer 2020,' p3 says 'Oct 2021' — likely conflating two events. The clinical record itself demonstrates the memory confusion the book is about." },
  cpt3: { date: "7/7/2022", summary: "No atypical T-scores. No ADHD pattern. Possible sustained attention issue." },
};

// ── DATA: VOICE ─────────────────────────────────────────────────────────────
const VOICE_EXAMPLES = [
  "I've tried at the bottom and I'm still down in this fucking hole. I was wrong about those being the answer, let's try the opposite because I seriously have nothing fucking left.",
  "Not because I'm organized. Because I can't afford not to be.",
  "No one tells you that relief is the most addictive feeling of all.",
  "Memory doesn't fail gracefully. It doesn't give you an error code or a stack trace. One day you just reach for something that should be there — and it isn't.",
  "The Sunday goodbye isn't grief. It's a specific kind of system failure — every routine you built together over the weekend decompiles in the 15 minutes between 'shoes on, kiddo' and the rearview mirror.",
];
const VOICE_NEVER = [
  "And that's when I realized...",
  "Looking back, I can see that...",
  "It was then that everything changed...",
  "Rock bottom became the solid foundation...",
  "Grateful for the journey",
  "Any sentence that makes meaning too available too fast",
  "Any sentence that could appear in a self-help book unchanged",
  "Epiphanies. Kyle doesn't have epiphanies. He has incremental recalibrations.",
];

// ── DATA: SESSIONS ──────────────────────────────────────────────────────────
const SESSIONS = [
  { date: "Mar 25, 2026", focus: "O'Toole's Excavation", output: "Sensory inventory complete. 5 scene seeds confirmed. Dual-track state, Fran & Stewart, Kylie & Tony. Performance face documented." },
  { date: "Apr 14, 2026", focus: "Title Lock + Hub Build", output: "Title '240 Ways to Remember' locked. Memoir-hub-v3 built. Interactive excavation interface." },
  { date: "Apr 16, 2026", focus: "The Five / Settlement / Card Table", output: "Chapter 11 card table sequence LOCKED. The Five excavated (Matt, Tom, Dave, Ryan). Settlement money arc. Ryan's grandmother's kitchen. Memory mechanics demonstrated in real time. NIU flagged." },
  { date: "Apr 24, 2026", focus: "Project Instructions Update", output: "Custom project instructions expanded. Evidence board v2. 15 clarifiers outstanding." },
];

// ── DATA: REJECTED ──────────────────────────────────────────────────────────
const REJECTED = [
  { item: "Breathe Through the Bullshit", reason: "Chaos Club Book 1 title — belongs there, not the memoir" },
  { item: "Built, Not Recovered", reason: "Accurate but less accessible" },
  { item: "Obstacle-overcoming frame", reason: "Recovery arc — wrong thesis" },
  { item: "Dr. Eleanor Chen", reason: "AI-fabricated character — never existed" },
  { item: '"Eliza"', reason: "AI-invented name for Kinsley's mother" },
  { item: "TEDx Talk chapter", reason: "AI hallucination — never happened" },
  { item: '"Staff Engineer" as Kyle\'s title', reason: "Claude operating persona from loaded skill — NOT Kyle's real title" },
];

// ── THEME ───────────────────────────────────────────────────────────────────
const T = {
  bg: "#0f0f0f", surface: "#1a1a1a", card: "#222", border: "#333",
  text: "#e0d6c8", dim: "#8a7f72", accent: "#d4a057", accentDim: "#a67c3d",
  green: "#5a9a6b", red: "#c4554d", blue: "#5b8fb9", purple: "#8b6fb0",
  mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
  serif: "'Playfair Display', 'Georgia', serif",
  sans: "'DM Sans', 'Segoe UI', sans-serif",
};

const statusColor = (s) => ({
  locked: T.green, excavated: T.green, confirmed: T.green,
  partial: T.blue, mapped: T.blue, seed: T.accent,
  unverified: T.red, "not-started": T.dim, "not-excavated": T.red,
  protected: T.purple, minimal: T.dim, open: T.accent, done: T.green,
}[s] || T.dim);

const statusLabel = (s) => ({
  locked: "LOCKED", excavated: "EXCAVATED", confirmed: "CONFIRMED",
  partial: "PARTIAL", mapped: "MAPPED", seed: "SEED ONLY",
  unverified: "UNVERIFIED", "not-started": "NOT STARTED", "not-excavated": "NOT EXCAVATED",
  protected: "PROTECTED", minimal: "MINIMAL", open: "OPEN", done: "DONE",
}[s] || s.toUpperCase());

// ── COMPONENTS ──────────────────────────────────────────────────────────────
const Badge = ({ status, small }) => (
  <span style={{
    display: "inline-block", padding: small ? "1px 6px" : "2px 8px",
    background: statusColor(status) + "22", color: statusColor(status),
    border: `1px solid ${statusColor(status)}44`, borderRadius: 3,
    fontSize: small ? 9 : 10, fontFamily: T.mono, letterSpacing: "0.05em",
    textTransform: "uppercase", fontWeight: 600,
  }}>{statusLabel(status)}</span>
);

const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{
    background: T.card, border: `1px solid ${T.border}`, borderRadius: 6,
    padding: "14px 16px", marginBottom: 10, cursor: onClick ? "pointer" : "default",
    transition: "border-color 0.2s", ...style,
  }} onMouseEnter={e => { if (onClick) e.currentTarget.style.borderColor = T.accent; }}
     onMouseLeave={e => { if (onClick) e.currentTarget.style.borderColor = T.border; }}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 style={{ fontFamily: T.serif, color: T.accent, fontSize: 16, margin: "18px 0 10px", fontWeight: 400, letterSpacing: "0.02em" }}>{children}</h3>
);

const Stat = ({ label, value, color }) => (
  <div style={{ textAlign: "center", flex: 1 }}>
    <div style={{ fontFamily: T.mono, fontSize: 28, color: color || T.accent, fontWeight: 700 }}>{value}</div>
    <div style={{ fontFamily: T.sans, fontSize: 10, color: T.dim, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
  </div>
);

// ── TAB: DASHBOARD ──────────────────────────────────────────────────────────
const Dashboard = () => {
  const drafted = OUTLINE.filter(c => c.status === "locked").length;
  const excavated = OUTLINE.filter(c => ["excavated","locked"].includes(c.status)).length;
  const seeds = OUTLINE.filter(c => c.status === "seed").length;
  const notStarted = OUTLINE.filter(c => c.status === "not-started").length;
  const highThreads = THREADS.filter(t => t.priority === "high").length;

  return (
    <div>
      <div style={{ fontFamily: T.serif, fontSize: 22, color: T.text, marginBottom: 4 }}>Construction, Not Recovery</div>
      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.dim, marginBottom: 16 }}>
        Literary memoir · Letter to Kinsley · Spine: Diagnostic Instinct
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <Stat label="Chapters" value="14" />
        <Stat label="Locked" value={drafted} color={T.green} />
        <Stat label="Excavated" value={excavated} color={T.blue} />
        <Stat label="Seeds" value={seeds} color={T.accent} />
        <Stat label="Not Started" value={notStarted} color={T.dim} />
      </div>

      <Card style={{ borderLeft: `3px solid ${T.accent}` }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, marginBottom: 6 }}>WORKING THESIS</div>
        <div style={{ fontFamily: T.serif, fontSize: 14, color: T.text, lineHeight: 1.5, fontStyle: "italic" }}>
          "How does a person whose mind has been broken — by choice, by injury, by circumstance — rebuild agency not through recovery of what was lost, but through construction of what never existed?"
        </div>
      </Card>

      <SectionTitle>Blockers & Next Moves</SectionTitle>
      {[
        { icon: "🔴", text: "Session 3: Tool Archaeology — NOT done. Chronological mapping of tools to cognitive gaps.", action: "t4" },
        { icon: "🔴", text: "Tom Ropel — 'an entire chapter by itself.' Not excavated.", action: "t1" },
        { icon: "🔴", text: "Dave Datt's funeral — year, what Kyle was like, parallel failure arc.", action: "t2" },
        { icon: "🔴", text: "15 open memoir clarifiers — awaiting Kyle's answers.", action: "t5" },
        { icon: "🟡", text: "Title conflict: Title card says '240 Ways to Remember' (Apr 14). Project instructions say 'Construction, Not Recovery' (Apr 24). Resolve.", action: null },
        { icon: "🟡", text: "Amen eval date conflict — p2 vs p3. Narratively useful, but needs Kyle's input.", action: null },
        { icon: "🟢", text: "Chapter 11 card table sequence — LOCKED.", action: null },
      ].map((item, i) => (
        <Card key={i} onClick={item.action ? () => { const t = THREADS.find(x => x.id === item.action); if (t) sendPrompt(t.prompt); } : undefined}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <span style={{ fontSize: 12 }}>{item.icon}</span>
            <div style={{ fontFamily: T.sans, fontSize: 12, color: T.text, lineHeight: 1.4 }}>
              {item.text}
              {item.action && <span style={{ fontFamily: T.mono, fontSize: 9, color: T.accent, marginLeft: 6 }}>TAP TO EXCAVATE</span>}
            </div>
          </div>
        </Card>
      ))}

      <SectionTitle>Key Distinctions</SectionTitle>
      {[
        ["Recovery vs. Construction", "Recovery = returning to baseline. Construction = building what never existed. Kyle didn't recover. He built."],
        ["Memory Uncertainty as Content", "Oscillating timelines and gaps are the book's subject matter, not writing flaws."],
        ["Tools as Prosthetics", "Systems address specific cognitive gaps. Prosthetics for a brain that can't be trusted."],
        ["Surrender as Strategy", "'I was wrong about those being the answer, let's try the opposite because I seriously have nothing fucking left.'"],
      ].map(([title, desc], i) => (
        <Card key={i}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, marginBottom: 4 }}>{title}</div>
          <div style={{ fontFamily: T.sans, fontSize: 12, color: T.dim, lineHeight: 1.4 }}>{desc}</div>
        </Card>
      ))}
    </div>
  );
};

// ── TAB: ARCHITECTURE ───────────────────────────────────────────────────────
const Architecture = () => {
  const [expanded, setExpanded] = useState(null);
  const parts = ["PROLOGUE", "I", "II", "III", "IV", "V", "EPILOGUE"];
  const partNames = { PROLOGUE: "Prologue", I: "Before the Break", II: "The Rupture", III: "The Construction Project", IV: "Late-Life Emergence", V: "Parallel Constructions", EPILOGUE: "Epilogue" };

  return (
    <div>
      <div style={{ fontFamily: T.serif, fontSize: 18, color: T.text, marginBottom: 4 }}>Narrative Architecture</div>
      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.dim, marginBottom: 16 }}>Locked outline · 5 parts + prologue/epilogue · 14 chapters</div>

      {parts.map(part => {
        const chapters = OUTLINE.filter(c => c.part === part);
        return (
          <div key={part} style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {part === "PROLOGUE" || part === "EPILOGUE" ? part : `Part ${part}`} — {partNames[part]}
            </div>
            {chapters.map((ch, i) => (
              <Card key={i} onClick={() => setExpanded(expanded === ch.ch ? null : ch.ch)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: T.dim, marginRight: 8 }}>{ch.ch}</span>
                    <span style={{ fontFamily: T.sans, fontSize: 13, color: T.text }}>{ch.title}</span>
                  </div>
                  <Badge status={ch.status} small />
                </div>
                {expanded === ch.ch && (
                  <div style={{ fontFamily: T.sans, fontSize: 11, color: T.dim, marginTop: 8, lineHeight: 1.5, borderTop: `1px solid ${T.border}`, paddingTop: 8 }}>
                    {ch.notes}
                  </div>
                )}
              </Card>
            ))}
          </div>
        );
      })}

      <SectionTitle>Unplaced Threads</SectionTitle>
      {[
        "The Five / settlement money arc / Dave Datt / the photo",
        "Tom Ropel — 'an entire chapter'",
        "NIU expulsion 2016",
        "CLC as layered site (failure, Ryan, Kyle's return as teacher)",
        "The Sedona / Bear sequence",
        "Card table / screenshot method / learning cascade",
        "Kinsley's 5th birthday reunion",
        "The $50K spending arc + hit-by-car origin",
        "Amen eval date conflict as narrative device",
        "Primary source archive material (Michael, journals, songs)",
        "The Michael relationship — 'Attack on the Hardware'",
      ].map((t, i) => (
        <div key={i} style={{ fontFamily: T.sans, fontSize: 11, color: T.dim, padding: "4px 0", borderBottom: `1px solid ${T.border}11` }}>
          <span style={{ color: T.red, marginRight: 6, fontFamily: T.mono, fontSize: 9 }}>UNPLACED</span> {t}
        </div>
      ))}
    </div>
  );
};

// ── TAB: PEOPLE ─────────────────────────────────────────────────────────────
const People = () => {
  const [expanded, setExpanded] = useState(null);
  const groups = { core: "Core", five: "The Five", secondary: "Secondary", protected: "Protected" };

  return (
    <div>
      <div style={{ fontFamily: T.serif, fontSize: 18, color: T.text, marginBottom: 4 }}>Character Map</div>
      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.dim, marginBottom: 16 }}>
        {PEOPLE.length} people · {PEOPLE.filter(p => p.status === "not-excavated").length} not excavated
      </div>

      {Object.entries(groups).map(([key, label]) => {
        const group = PEOPLE.filter(p => p.priority === key);
        if (!group.length) return null;
        return (
          <div key={key}>
            <SectionTitle>{label}</SectionTitle>
            {group.map((p, i) => (
              <Card key={i} onClick={() => setExpanded(expanded === p.name ? null : p.name)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontFamily: T.sans, fontSize: 13, color: T.text, fontWeight: 600 }}>{p.name}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: T.dim, marginLeft: 8 }}>{p.role}</span>
                  </div>
                  <Badge status={p.status} small />
                </div>
                {expanded === p.name && (
                  <div style={{ fontFamily: T.sans, fontSize: 11, color: T.dim, marginTop: 8, lineHeight: 1.5, borderTop: `1px solid ${T.border}`, paddingTop: 8 }}>
                    {p.notes}
                  </div>
                )}
              </Card>
            ))}
          </div>
        );
      })}
    </div>
  );
};

// ── TAB: MATERIAL ───────────────────────────────────────────────────────────
const Material = () => {
  const [sub, setSub] = useState("seeds");

  return (
    <div>
      <div style={{ fontFamily: T.serif, fontSize: 18, color: T.text, marginBottom: 12 }}>Material Bank</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {[["seeds","Scene Seeds"],["clinical","Clinical"],["songs","Songs/Lyrics"],["sources","Primary Sources"],["rejected","Rejected"]].map(([k,l]) => (
          <button key={k} onClick={() => setSub(k)} style={{
            background: sub === k ? T.accent + "22" : "transparent", border: `1px solid ${sub === k ? T.accent : T.border}`,
            color: sub === k ? T.accent : T.dim, borderRadius: 4, padding: "4px 10px",
            fontFamily: T.mono, fontSize: 10, cursor: "pointer",
          }}>{l}</button>
        ))}
      </div>

      {sub === "seeds" && SEEDS.map((s, i) => (
        <Card key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.dim }}>SEED {s.id}</span>
            <Badge status={s.status} small />
          </div>
          <div style={{ fontFamily: T.sans, fontSize: 13, color: T.text, fontWeight: 600 }}>{s.title}</div>
          <div style={{ fontFamily: T.sans, fontSize: 11, color: T.dim, marginTop: 4, lineHeight: 1.4 }}>{s.notes}</div>
        </Card>
      ))}

      {sub === "clinical" && (
        <>
          <SectionTitle>Total Brain Assessment — {CLINICAL.totalBrain.date}</SectionTitle>
          <Card>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.dim, marginBottom: 8 }}>THESIS IN DATA: Engine at full speed, storage empty → tools as prosthetic memory</div>
            {CLINICAL.totalBrain.scores.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontFamily: T.sans, fontSize: 11, color: T.dim, width: 120 }}>{s.metric}</div>
                <div style={{ flex: 1, background: T.border, borderRadius: 2, height: 14, position: "relative", overflow: "hidden" }}>
                  <div style={{
                    width: `${s.pct}%`, height: "100%", borderRadius: 2,
                    background: s.pct >= 80 ? T.green : s.pct >= 40 ? T.blue : T.red,
                  }} />
                </div>
                <div style={{ fontFamily: T.mono, fontSize: 11, color: T.text, width: 40, textAlign: "right" }}>{s.pct}th</div>
              </div>
            ))}
          </Card>

          <SectionTitle>Amen Clinics Evaluation</SectionTitle>
          <Card style={{ borderLeft: `3px solid ${T.red}` }}>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.red, marginBottom: 4 }}>DATE CONFLICT — NARRATIVELY USEFUL</div>
            <div style={{ fontFamily: T.sans, fontSize: 11, color: T.dim, lineHeight: 1.5 }}>{CLINICAL.amenEval.dateConflict}</div>
            <div style={{ fontFamily: T.sans, fontSize: 11, color: T.dim, marginTop: 6 }}>Physicians: {CLINICAL.amenEval.physicians}</div>
          </Card>

          <SectionTitle>Conners CPT 3 — {CLINICAL.cpt3.date}</SectionTitle>
          <Card>
            <div style={{ fontFamily: T.sans, fontSize: 11, color: T.dim, lineHeight: 1.5 }}>{CLINICAL.cpt3.summary}</div>
          </Card>
        </>
      )}

      {sub === "songs" && (
        <>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.dim, marginBottom: 10 }}>{SONGS.length} songs/lyrics in project</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {SONGS.map((s, i) => (
              <span key={i} style={{
                fontFamily: T.mono, fontSize: 9, color: T.dim, background: T.surface,
                border: `1px solid ${T.border}`, borderRadius: 3, padding: "3px 6px",
              }}>{s.replace(/_/g, " ")}</span>
            ))}
          </div>
        </>
      )}

      {sub === "sources" && (
        <>
          <Card>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, marginBottom: 4 }}>PRIMARY SOURCE ARCHIVE</div>
            <div style={{ fontFamily: T.sans, fontSize: 11, color: T.dim, lineHeight: 1.5 }}>
              895 lines transcribed from physical documents (April 12, 2026). Handwritten journals, printed poems/songs, emails, worksheets. Includes the Michael relationship journal, song lyrics, poems, therapy worksheets, a letter never sent.
            </div>
          </Card>
          <Card>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, marginBottom: 4 }}>SUDOWRITE STORY BIBLE</div>
            <div style={{ fontFamily: T.sans, fontSize: 11, color: T.dim }}>Braindump, synopsis, characters, worldbuilding, voice — ready for import.</div>
          </Card>
          <Card>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, marginBottom: 4 }}>SUDOWRITE MANUSCRIPT</div>
            <div style={{ fontFamily: T.sans, fontSize: 11, color: T.dim }}>Construction Manifesto finished prose + chapter shells.</div>
          </Card>
          <Card>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, marginBottom: 4 }}>CLINICAL RECORDS</div>
            <div style={{ fontFamily: T.sans, fontSize: 11, color: T.dim }}>Amen eval PDF, SPECT brain images (4 views), CPT 3 report, lab orders, brain system handout.</div>
          </Card>
          <Card>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, marginBottom: 4 }}>PHOTO ARCHIVE</div>
            <div style={{ fontFamily: T.sans, fontSize: 11, color: T.dim }}>Trump Tower photo (3 men, ~2015/2016). Card table 1:30am photo (referenced, Chapter 11 anchor).</div>
          </Card>
        </>
      )}

      {sub === "rejected" && REJECTED.map((r, i) => (
        <Card key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: T.sans, fontSize: 12, color: T.red, textDecoration: "line-through" }}>{r.item}</span>
          </div>
          <div style={{ fontFamily: T.sans, fontSize: 11, color: T.dim, marginTop: 2 }}>{r.reason}</div>
        </Card>
      ))}
    </div>
  );
};

// ── TAB: EXCAVATION ─────────────────────────────────────────────────────────
const Excavation = () => {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? THREADS : THREADS.filter(t => t.priority === filter);

  return (
    <div>
      <div style={{ fontFamily: T.serif, fontSize: 18, color: T.text, marginBottom: 4 }}>Excavation Queue</div>
      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.dim, marginBottom: 12 }}>
        {THREADS.length} threads · {THREADS.filter(t => t.priority === "high").length} high priority · Tap to launch
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[["all","All"],["high","High"],["medium","Medium"],["low","Low"]].map(([k,l]) => (
          <button key={k} onClick={() => setFilter(k)} style={{
            background: filter === k ? T.accent + "22" : "transparent", border: `1px solid ${filter === k ? T.accent : T.border}`,
            color: filter === k ? T.accent : T.dim, borderRadius: 4, padding: "4px 10px",
            fontFamily: T.mono, fontSize: 10, cursor: "pointer",
          }}>{l}</button>
        ))}
      </div>

      {filtered.map(t => (
        <Card key={t.id} onClick={() => sendPrompt(t.prompt)} style={{
          borderLeft: `3px solid ${t.priority === "high" ? T.red : t.priority === "medium" ? T.accent : T.dim}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
            <span style={{ fontFamily: T.sans, fontSize: 13, color: T.text, fontWeight: 600 }}>{t.title}</span>
            <span style={{ fontFamily: T.mono, fontSize: 9, color: statusColor(t.status) }}>{t.priority.toUpperCase()}</span>
          </div>
          <div style={{ fontFamily: T.sans, fontSize: 11, color: T.dim, lineHeight: 1.4 }}>
            {t.prompt.substring(0, 120)}...
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.accent, marginTop: 6 }}>TAP TO START EXCAVATION →</div>
        </Card>
      ))}
    </div>
  );
};

// ── TAB: VOICE ──────────────────────────────────────────────────────────────
const Voice = () => (
  <div>
    <div style={{ fontFamily: T.serif, fontSize: 18, color: T.text, marginBottom: 4 }}>Voice DNA</div>
    <div style={{ fontFamily: T.mono, fontSize: 10, color: T.dim, marginBottom: 16 }}>
      Kyle's natural register · Bartender who learned to code
    </div>

    <SectionTitle>What Works</SectionTitle>
    {VOICE_EXAMPLES.map((v, i) => (
      <Card key={i} style={{ borderLeft: `3px solid ${T.green}` }}>
        <div style={{ fontFamily: T.serif, fontSize: 13, color: T.text, lineHeight: 1.5, fontStyle: "italic" }}>"{v}"</div>
      </Card>
    ))}

    <SectionTitle>Never Use</SectionTitle>
    {VOICE_NEVER.map((v, i) => (
      <Card key={i} style={{ borderLeft: `3px solid ${T.red}` }}>
        <div style={{ fontFamily: T.sans, fontSize: 12, color: T.red, textDecoration: i < 5 ? "line-through" : "none" }}>
          {i < 5 ? `"${v}"` : v}
        </div>
      </Card>
    ))}

    <SectionTitle>Voice Rules</SectionTitle>
    {[
      "Declarative observations — let readers draw conclusions",
      "Technical descriptions of emotional states",
      "Admissions of uncertainty about memory/meaning",
      "Humor that doesn't defuse tension prematurely",
      "Short sentences for impact. Longer ones for complexity. Short again.",
      "Contradictions held, not resolved. Both true. Prose doesn't choose.",
      "Profanity lands on the beat of the sentence. Not edgy, not frequent.",
      "Engineering metaphors are not decoration — they're how the brain processes after the injury.",
    ].map((r, i) => (
      <div key={i} style={{ fontFamily: T.sans, fontSize: 11, color: T.dim, padding: "4px 0", borderBottom: `1px solid ${T.border}11`, lineHeight: 1.4 }}>{r}</div>
    ))}

    <SectionTitle>Comparable Works</SectionTitle>
    {[
      ["The Noonday Demon", "Andrew Solomon — depression as systems failure, intellectual rigor"],
      ["In the Realm of Hungry Ghosts", "Gabor Maté — addiction without moralism"],
      ["Brain on Fire", "Susannah Cahalan — cognitive disruption from inside"],
      ["The Body Keeps the Score", "van der Kolk — less clinical, more personal"],
    ].map(([t, a], i) => (
      <Card key={i}>
        <span style={{ fontFamily: T.serif, fontSize: 13, color: T.text, fontStyle: "italic" }}>{t}</span>
        <span style={{ fontFamily: T.sans, fontSize: 11, color: T.dim, marginLeft: 8 }}>— {a}</span>
      </Card>
    ))}

    <Card style={{ borderLeft: `3px solid ${T.accent}`, marginTop: 16 }}>
      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, marginBottom: 4 }}>THE TEST</div>
      <div style={{ fontFamily: T.serif, fontSize: 13, color: T.text, lineHeight: 1.5, fontStyle: "italic" }}>
        If someone reads this and thinks "what a brave recovery story," the book failed. If someone reads this and thinks "he rebuilt the whole thing from scratch and it's still not done and he knows that," the book worked.
      </div>
    </Card>
  </div>
);

// ── TAB: SESSIONS ───────────────────────────────────────────────────────────
const SessionLog = () => (
  <div>
    <div style={{ fontFamily: T.serif, fontSize: 18, color: T.text, marginBottom: 4 }}>Session History</div>
    <div style={{ fontFamily: T.mono, fontSize: 10, color: T.dim, marginBottom: 16 }}>
      {SESSIONS.length} sessions logged · Earliest: {SESSIONS[0].date}
    </div>

    {[...SESSIONS].reverse().map((s, i) => (
      <Card key={i}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.accent }}>{s.date}</span>
        </div>
        <div style={{ fontFamily: T.sans, fontSize: 13, color: T.text, fontWeight: 600, marginBottom: 4 }}>{s.focus}</div>
        <div style={{ fontFamily: T.sans, fontSize: 11, color: T.dim, lineHeight: 1.5 }}>{s.output}</div>
      </Card>
    ))}

    <SectionTitle>Carry Forward</SectionTitle>
    {[
      "Card table 1:30am photo — referenced but not uploaded",
      "Whatever huge memory surfaced April 16 — verify if Kyle captured it",
      "The draft opening Kyle wrote",
      "Locked sequence: Crisis → mother's lifeline → Bear → work → card table → cascade → Chaos Club",
      "Tom Ropel as next excavation target",
      "15 open clarifiers from April 16",
    ].map((c, i) => (
      <div key={i} style={{ fontFamily: T.sans, fontSize: 11, color: T.dim, padding: "6px 0", borderBottom: `1px solid ${T.border}11`, lineHeight: 1.4 }}>
        <span style={{ color: T.accent, marginRight: 6 }}>→</span> {c}
      </div>
    ))}
  </div>
);

// ── MAIN ────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "dash", label: "Dashboard", icon: "◆" },
  { key: "arch", label: "Architecture", icon: "▤" },
  { key: "people", label: "People", icon: "◎" },
  { key: "material", label: "Material", icon: "▣" },
  { key: "dig", label: "Excavation", icon: "⛏" },
  { key: "voice", label: "Voice", icon: "¶" },
  { key: "log", label: "Sessions", icon: "◷" },
];

export default function MemoirCommandCenter() {
  const [tab, setTab] = useState("dash");

  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.text, fontFamily: T.sans }}>
      {/* Header */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent }} />
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.accent, letterSpacing: "0.1em" }}>MEMOIR COMMAND CENTER</span>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{
        display: "flex", overflowX: "auto", background: T.surface,
        borderBottom: `1px solid ${T.border}`, padding: "0 8px",
      }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            background: "transparent", border: "none", padding: "10px 12px",
            color: tab === t.key ? T.accent : T.dim, cursor: "pointer",
            fontFamily: T.mono, fontSize: 10, whiteSpace: "nowrap",
            borderBottom: tab === t.key ? `2px solid ${T.accent}` : "2px solid transparent",
            transition: "all 0.2s",
          }}>
            <span style={{ marginRight: 4, fontSize: 12 }}>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "16px", maxWidth: 680, margin: "0 auto" }}>
        {tab === "dash" && <Dashboard />}
        {tab === "arch" && <Architecture />}
        {tab === "people" && <People />}
        {tab === "material" && <Material />}
        {tab === "dig" && <Excavation />}
        {tab === "voice" && <Voice />}
        {tab === "log" && <SessionLog />}
      </div>

      {/* Footer */}
      <div style={{ padding: "20px 16px", textAlign: "center", borderTop: `1px solid ${T.border}` }}>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.dim }}>
          Last updated: May 8, 2026 · Phase: Early Excavation · 0 chapters drafted
        </div>
      </div>
    </div>
  );
}
