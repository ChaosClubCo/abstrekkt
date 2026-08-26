import { useState, useEffect } from "react";

const FONT = "'Courier New', monospace";
const SANS = "'Georgia', serif";

const C = {
  bg: "#0a0c10",
  surface: "#111318",
  card: "#161921",
  border: "#1e222d",
  borderHover: "#2a3040",
  accent: "#c48a40",
  accentDim: "rgba(196,138,64,.15)",
  green: "#4ca876",
  greenDim: "rgba(76,168,118,.12)",
  red: "#c45040",
  redDim: "rgba(196,80,64,.12)",
  purple: "#8a55c4",
  purpleDim: "rgba(138,85,196,.1)",
  blue: "#4080c4",
  blueDim: "rgba(64,128,196,.12)",
  text: "#d8dce8",
  textDim: "#6a7a94",
  textMuted: "#3a4a60",
};

const mono = { fontFamily: FONT, letterSpacing: ".06em" };
const serif = { fontFamily: SANS };

// ─── PROJECT DATA ───────────────────────────────────────────
const PROJECTS = {
  memoir: {
    title: "Literary Memoir",
    status: "EARLY EXCAVATION",
    statusColor: C.accent,
    thesis: "How does a person whose mind has been broken—by choice, by injury, by circumstance—rebuild agency not through recovery of what was lost, but through construction of what never existed?",
    threads: [
      { name: "Before the Break", status: "excavation-needed", detail: "O'Toole's sensory inventory, hospitality years, diagnostic instinct origin" },
      { name: "The Rupture", status: "protected", detail: "TBI, addiction — Kyle discloses on his terms" },
      { name: "The Construction Project", status: "excavation-needed", detail: "First tools, external cognition, learning to code as new architecture" },
      { name: "Late-Life Emergence", status: "mapped", detail: "Staff Engineer, FlashFusion failure, Intinc" },
      { name: "Parallel Constructions", status: "mapped", detail: "Kinsley, Chaos Club, the memoir itself" },
    ],
    scenes: [
      { name: "Age Oscillation", confirmed: true, note: "Opens trying to tell AI his story — can't locate the beginning" },
      { name: "The Couch Permission", confirmed: true, note: '"You don\'t have to." Relief as most addictive feeling.' },
      { name: "Counting Streetlights", confirmed: "verify", note: "Age 17 walk. Real memory or AI extrapolation absorbed as true?" },
      { name: "The Relief Line", confirmed: true, note: '"No one tells you that relief is the most addictive feeling."' },
      { name: "Monitor Reflection", confirmed: true, note: "First day — dark screen shows reflection, screen lights up, reflection disappears into work" },
    ],
    openQuestions: [
      "What does pre-injury Kyle feel like to remember?",
      "When did old strategies first stop working?",
      "What was the first tool/system that actually helped?",
      "What would 240+ tools look like mapped chronologically?",
      "Where does systems-builder identity protect from feeling?",
      "What does Kinsley see? What will she understand later?",
    ],
    nextMoves: [
      "Session 3: Tool Archaeology — chronological mapping of 240+ tools",
      "First excavation: hospitality years (Before the Break)",
      "Clarify Lee Chong Ming pitch status",
      "Draft three chapter openings (test voice)",
    ],
  },
  book1: {
    title: "Breathe Through the BS",
    status: "MANUSCRIPT RECOVERY",
    statusColor: C.green,
    chapters: [
      { num: "Intro", title: "Your Brain is a Dumpster Fire", status: "recovered" },
      { num: "1", title: "Meditation Myths That Need to Die", status: "recovered" },
      { num: "2", title: "The BREATHE System", status: "recovered" },
      { num: "3", title: "The Starter Pack", status: "recovered" },
      { num: "4", title: "The Science Behind Why This Works", status: "recovered" },
      { num: "5", title: "Dealing with Obstacles", status: "recovered" },
      { num: "6", title: "Building Your Toolkit", status: "recovered" },
      { num: "7", title: "Response Awareness", status: "missing" },
      { num: "8", title: "Why We React", status: "missing" },
      { num: "9", title: "Three Steps", status: "missing" },
      { num: "10", title: "Practicing in Real Life", status: "missing" },
      { num: "11", title: "The Perks", status: "missing" },
      { num: "12", title: "When It Feels Impossible", status: "missing" },
      { num: "C1", title: "Conclusion Part 1", status: "recovered" },
      { num: "C2", title: "Conclusion Part 2", status: "missing" },
      { num: "Ack", title: "Acknowledgments", status: "missing" },
      { num: "Res", title: "Resources", status: "missing" },
    ],
  },
  chaosApp: {
    title: "Chaos Club Co. App",
    status: "SPEC COMPLETE / BUILD PENDING",
    statusColor: C.purple,
    decision: "PWA micro-app vs. B2B/EAP — NOT YET DECIDED",
    features: [
      { name: "Daily Dispatch", built: true },
      { name: "Rebel AI Companion", built: false },
      { name: "Community Circles", built: true },
      { name: "The Arsenal Library", built: true },
      { name: "PuppyChow Gamification", built: true },
      { name: "Session Simulator", built: false },
      { name: "Crisis Resources", built: true },
    ],
    blockers: ["Legal foundation needed before dev", "Firebase Studio MVP not started", "Brand voice AI training not started"],
  },
  flashfusion: {
    title: "FlashFusion Skills Library",
    status: "4 COMPLIANCE GAPS",
    statusColor: C.red,
    gaps: [
      "Description fields missing 'Use when...' trigger phrases",
      "Version fields not nested under metadata",
      "triggers/hooks present on claude.ai-targeted skills",
      "allowed-tools not implementing least privilege",
    ],
    stats: { skillsBuilt: 50, pipeline: "complete", chrisButler: "5-skill suite done" },
  },
};

// ─── COMPONENTS ─────────────────────────────────────────────

function Badge({ color, children }) {
  return (
    <span style={{
      ...mono, fontSize: 9, letterSpacing: ".12em", color,
      background: color + "18", padding: "3px 8px", borderRadius: 3,
      textTransform: "uppercase", fontWeight: 600,
    }}>{children}</span>
  );
}

function ProgressBar({ filled, total, color = C.accent }) {
  const pct = Math.round((filled / total) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width .5s" }} />
      </div>
      <span style={{ ...mono, fontSize: 10, color: C.textDim }}>{filled}/{total}</span>
    </div>
  );
}

function Section({ title, badge, badgeColor, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 12, overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{
        padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: open ? `1px solid ${C.border}` : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ ...serif, fontSize: 15, color: C.text, fontWeight: 600 }}>{title}</span>
          {badge && <Badge color={badgeColor}>{badge}</Badge>}
        </div>
        <span style={{ color: C.textMuted, fontSize: 12, transform: open ? "rotate(90deg)" : "none", transition: "transform .2s" }}>▶</span>
      </div>
      {open && <div style={{ padding: "14px 18px" }}>{children}</div>}
    </div>
  );
}

// ─── TABS ───────────────────────────────────────────────────

function MemoirTab() {
  const m = PROJECTS.memoir;
  return (
    <div>
      <div style={{ background: C.accentDim, border: `1px solid ${C.accent}30`, borderRadius: 8, padding: "16px 18px", marginBottom: 16 }}>
        <div style={{ ...mono, fontSize: 9, color: C.accent, letterSpacing: ".12em", marginBottom: 8 }}>GOVERNING THESIS</div>
        <div style={{ ...serif, fontSize: 14, color: C.text, lineHeight: 1.7, fontStyle: "italic" }}>{m.thesis}</div>
      </div>

      <Section title="Narrative Threads" badge={m.status} badgeColor={m.statusColor}>
        {m.threads.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < m.threads.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <span style={{
              ...mono, fontSize: 8, padding: "2px 6px", borderRadius: 3, marginTop: 2,
              color: t.status === "protected" ? C.red : t.status === "mapped" ? C.green : C.accent,
              background: t.status === "protected" ? C.redDim : t.status === "mapped" ? C.greenDim : C.accentDim,
            }}>{t.status.toUpperCase()}</span>
            <div>
              <div style={{ ...serif, fontSize: 13, color: C.text, fontWeight: 600 }}>{t.name}</div>
              <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{t.detail}</div>
            </div>
          </div>
        ))}
      </Section>

      <Section title="Confirmed Scene Seeds" badge={`${m.scenes.filter(s => s.confirmed === true).length} CONFIRMED`} badgeColor={C.green}>
        {m.scenes.map((s, i) => (
          <div key={i} style={{ padding: "8px 0", borderBottom: i < m.scenes.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>{s.confirmed === true ? "✓" : s.confirmed === "verify" ? "?" : "○"}</span>
              <span style={{ ...serif, fontSize: 13, color: C.text }}>{s.name}</span>
              {s.confirmed === "verify" && <Badge color={C.accent}>NEEDS VERIFICATION</Badge>}
            </div>
            <div style={{ fontSize: 11, color: C.textDim, marginLeft: 22, marginTop: 3, fontStyle: "italic" }}>{s.note}</div>
          </div>
        ))}
      </Section>

      <Section title="Open Questions" defaultOpen={false}>
        {m.openQuestions.map((q, i) => (
          <div key={i} style={{ padding: "6px 0", fontSize: 12, color: C.textDim, borderLeft: `2px solid ${C.accent}30`, paddingLeft: 12, marginBottom: 6 }}>
            {q}
          </div>
        ))}
      </Section>

      <Section title="Next Moves" defaultOpen={false}>
        {m.nextMoves.map((n, i) => (
          <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", fontSize: 12 }}>
            <span style={{ ...mono, color: C.accent, fontSize: 10 }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ color: C.text }}>{n}</span>
          </div>
        ))}
      </Section>
    </div>
  );
}

function Book1Tab() {
  const b = PROJECTS.book1;
  const recovered = b.chapters.filter(c => c.status === "recovered").length;
  const missing = b.chapters.filter(c => c.status === "missing").length;

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, background: C.greenDim, border: `1px solid ${C.green}30`, borderRadius: 8, padding: 14, textAlign: "center" }}>
          <div style={{ ...mono, fontSize: 24, color: C.green }}>{recovered}</div>
          <div style={{ ...mono, fontSize: 9, color: C.green, letterSpacing: ".1em" }}>RECOVERED</div>
        </div>
        <div style={{ flex: 1, background: C.redDim, border: `1px solid ${C.red}30`, borderRadius: 8, padding: 14, textAlign: "center" }}>
          <div style={{ ...mono, fontSize: 24, color: C.red }}>{missing}</div>
          <div style={{ ...mono, fontSize: 9, color: C.red, letterSpacing: ".1em" }}>MISSING</div>
        </div>
      </div>

      <ProgressBar filled={recovered} total={b.chapters.length} color={C.green} />

      <div style={{ marginTop: 16 }}>
        {b.chapters.map((ch, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 2,
            background: ch.status === "missing" ? C.redDim : "transparent", borderRadius: 4,
            borderLeft: `3px solid ${ch.status === "recovered" ? C.green : C.red}`,
          }}>
            <span style={{ ...mono, fontSize: 10, color: C.textMuted, minWidth: 32 }}>{ch.num}</span>
            <span style={{ fontSize: 12, color: ch.status === "recovered" ? C.text : C.red, flex: 1 }}>{ch.title}</span>
            <span style={{ ...mono, fontSize: 8, color: ch.status === "recovered" ? C.green : C.red }}>
              {ch.status === "recovered" ? "✓" : "LOST"}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: 14, background: C.accentDim, border: `1px solid ${C.accent}30`, borderRadius: 8 }}>
        <div style={{ ...mono, fontSize: 9, color: C.accent, letterSpacing: ".12em", marginBottom: 6 }}>RECOVERY PATH</div>
        <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>
          Chapters 7-12, Conclusion Pt 2, Acknowledgments, and Resources were only in the uploaded .docx 
          that wasn't backed up to Drive. Re-upload the source file or recreate from the original ChatGPT/Claude sessions 
          where the content was first generated.
        </div>
      </div>
    </div>
  );
}

function ChaosAppTab() {
  const a = PROJECTS.chaosApp;
  const built = a.features.filter(f => f.built).length;
  return (
    <div>
      <div style={{ background: C.purpleDim, border: `1px solid ${C.purple}30`, borderRadius: 8, padding: 14, marginBottom: 16 }}>
        <div style={{ ...mono, fontSize: 9, color: C.purple, letterSpacing: ".12em", marginBottom: 4 }}>PENDING DECISION</div>
        <div style={{ fontSize: 13, color: C.text }}>{a.decision}</div>
      </div>

      <Section title="Feature Status" badge={`${built}/${a.features.length} BUILT`} badgeColor={C.green}>
        {a.features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
            <span style={{ fontSize: 14, color: f.built ? C.green : C.textMuted }}>{f.built ? "●" : "○"}</span>
            <span style={{ fontSize: 12, color: f.built ? C.text : C.textDim }}>{f.name}</span>
          </div>
        ))}
      </Section>

      <Section title="Blockers" badge={`${a.blockers.length}`} badgeColor={C.red}>
        {a.blockers.map((b, i) => (
          <div key={i} style={{ fontSize: 12, color: C.red, padding: "6px 0", borderLeft: `2px solid ${C.red}40`, paddingLeft: 12, marginBottom: 4 }}>
            {b}
          </div>
        ))}
      </Section>
    </div>
  );
}

function SkillsTab() {
  const f = PROJECTS.flashfusion;
  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, background: C.greenDim, border: `1px solid ${C.green}30`, borderRadius: 8, padding: 14, textAlign: "center" }}>
          <div style={{ ...mono, fontSize: 24, color: C.green }}>{f.stats.skillsBuilt}</div>
          <div style={{ ...mono, fontSize: 9, color: C.green, letterSpacing: ".1em" }}>SKILLS BUILT</div>
        </div>
        <div style={{ flex: 1, background: C.redDim, border: `1px solid ${C.red}30`, borderRadius: 8, padding: 14, textAlign: "center" }}>
          <div style={{ ...mono, fontSize: 24, color: C.red }}>{f.gaps.length}</div>
          <div style={{ ...mono, fontSize: 9, color: C.red, letterSpacing: ".1em" }}>COMPLIANCE GAPS</div>
        </div>
      </div>

      <Section title="Compliance Gaps (Gating Deployment)" badge="FIX BEFORE EXPAND" badgeColor={C.red}>
        {f.gaps.map((g, i) => (
          <div key={i} style={{ display: "flex", gap: 8, padding: "8px 0", fontSize: 12, color: C.text, borderBottom: i < f.gaps.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ color: C.red, fontWeight: 700 }}>✕</span>
            <span>{g}</span>
          </div>
        ))}
      </Section>

      <Section title="Deployment Pipeline" defaultOpen={false}>
        <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.7 }}>
          <div><span style={{ color: C.green }}>✓</span> 50 Phase 1+2 production-ready skills</div>
          <div><span style={{ color: C.green }}>✓</span> Pipeline tooling scripts complete</div>
          <div><span style={{ color: C.green }}>✓</span> Chris Butler 5-skill suite complete</div>
          <div><span style={{ color: C.accent }}>→</span> Teams-embedded migration agent in progress</div>
          <div><span style={{ color: C.red }}>✕</span> 4 compliance gaps block Intinc deployment</div>
        </div>
      </Section>
    </div>
  );
}

function TimelineTab() {
  const events = [
    { date: "Mar 12", label: "Book 1 content audit + missing sections identified", color: C.green },
    { date: "Mar 13", label: "Book 1 conclusion, acknowledgments, resources written", color: C.green },
    { date: "Mar 13", label: "Build script created (lost to session reset)", color: C.red },
    { date: "Mar 13", label: "Memoir project instructions updated", color: C.accent },
    { date: "Mar 13", label: "PROJECT_STATE.md created", color: C.accent },
    { date: "Mar 25", label: "O'Toole's excavation complete", color: C.purple },
    { date: "Mar 25", label: "5 scene seeds confirmed as real memory", color: C.purple },
    { date: "Apr 14", label: "Manuscript recovery from project files", color: C.green },
    { date: "Apr 14", label: "Interactive project hub built", color: C.blue },
    { date: "NEXT", label: "Session 3: Tool Archaeology", color: C.textMuted },
    { date: "NEXT", label: "Fix 4 Skills Library compliance gaps", color: C.textMuted },
    { date: "NEXT", label: "Recover or recreate missing Book 1 chapters", color: C.textMuted },
  ];

  return (
    <div>
      {events.map((e, i) => (
        <div key={i} style={{ display: "flex", gap: 14, marginBottom: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 60 }}>
            <span style={{ ...mono, fontSize: 9, color: e.color, letterSpacing: ".08em" }}>{e.date}</span>
            {i < events.length - 1 && <div style={{ width: 1, flex: 1, background: C.border, margin: "4px 0" }} />}
          </div>
          <div style={{
            fontSize: 12, color: e.date === "NEXT" ? C.textDim : C.text,
            padding: "4px 0 14px", fontStyle: e.date === "NEXT" ? "italic" : "normal",
          }}>
            {e.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────

const TABS = [
  { id: "memoir", label: "Memoir", icon: "◆" },
  { id: "book1", label: "Book 1", icon: "◇" },
  { id: "chaos", label: "Chaos App", icon: "◈" },
  { id: "skills", label: "Skills Lib", icon: "▣" },
  { id: "timeline", label: "Timeline", icon: "│" },
];

export default function ProjectHub() {
  const [tab, setTab] = useState("memoir");

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, padding: "0" }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${C.surface} 0%, ${C.bg} 100%)`,
        borderBottom: `1px solid ${C.border}`, padding: "20px 24px 16px",
      }}>
        <div style={{ ...mono, fontSize: 9, color: C.accent, letterSpacing: ".2em", marginBottom: 6 }}>
          KYLE ROSEBROOK — PROJECT COMMAND
        </div>
        <div style={{ ...serif, fontSize: 20, color: C.text, fontWeight: 600, lineHeight: 1.3 }}>
          Construction, Not Recovery
        </div>
        <div style={{ ...mono, fontSize: 9, color: C.textMuted, marginTop: 6, letterSpacing: ".08em" }}>
          UPDATED APR 14, 2026 — SESSION ACTIVE
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{
        display: "flex", borderBottom: `1px solid ${C.border}`, background: C.surface,
        overflowX: "auto", WebkitOverflowScrolling: "touch",
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            ...mono, fontSize: 10, letterSpacing: ".08em", padding: "12px 16px",
            background: "none", border: "none", cursor: "pointer",
            color: tab === t.id ? C.accent : C.textMuted,
            borderBottom: tab === t.id ? `2px solid ${C.accent}` : "2px solid transparent",
            transition: "all .2s", whiteSpace: "nowrap",
          }}>
            <span style={{ marginRight: 6 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "16px 20px 40px", maxWidth: 640, margin: "0 auto" }}>
        {tab === "memoir" && <MemoirTab />}
        {tab === "book1" && <Book1Tab />}
        {tab === "chaos" && <ChaosAppTab />}
        {tab === "skills" && <SkillsTab />}
        {tab === "timeline" && <TimelineTab />}
      </div>
    </div>
  );
}
