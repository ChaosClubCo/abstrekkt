import { useState } from "react";

// ─── TOKENS (Abstrekkt "Reading Room at Midnight") ───────────────────────────
const T = {
  bg:         "#101216",
  surface:    "#181b20",
  sunken:     "#0a0b0d",
  border:     "#22262d",
  borderHi:   "#2f343c",
  text:       "#f2efe7",
  textSec:    "#939aa4",
  textMuted:  "#6b727d",
  accent:     "#cf5a32",
  accentText: "#de7449",
  error:      "#c8504a",
  success:    "#5a9e6f",
  warning:    "#c98a2e",
  info:       "#5a86b8",
};

const FONTS = {
  display: "'Fraunces', Georgia, serif",
  body:    "'Crimson Pro', Georgia, serif",
  mono:    "'JetBrains Mono', ui-monospace, monospace",
};

const GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :focus-visible { outline: 2px solid ${T.accentText}; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
`;

// ─── DATA: MEMOIR (sourced from memoir-command-center.jsx) ───────────────────
const CHAPTERS = [
  { part:"PROLOGUE", ch:"Prologue",  title:"The Wrong Beginning",                    status:"seed"        },
  { part:"I",        ch:"Ch 1",      title:"Reading the Room",                       status:"excavated"   },
  { part:"I",        ch:"Ch 2",      title:"The Permission",                         status:"seed"        },
  { part:"I",        ch:"Ch 3",      title:"Counting Streetlights",                  status:"unverified"  },
  { part:"II",       ch:"Ch 4",      title:"Hardware Failure",                       status:"protected"   },
  { part:"II",       ch:"Ch 5",      title:"The Noise That Stopped",                 status:"protected"   },
  { part:"III",      ch:"Ch 6",      title:"First Tools",                            status:"not-started" },
  { part:"III",      ch:"Ch 7",      title:"Learning to Think in a New Architecture",status:"not-started" },
  { part:"III",      ch:"Ch 8",      title:"The Arsenal",                            status:"not-started" },
  { part:"IV",       ch:"Ch 9",      title:"The Monitor Reflection",                 status:"seed"        },
  { part:"IV",       ch:"Ch 10",     title:"The Wrong Book, The Right Failure",      status:"seed"        },
  { part:"V",        ch:"Ch 11",     title:"Shoes On, Kiddo",                        status:"locked"      },
  { part:"V",        ch:"Ch 12",     title:"Welcome to the Chaos Club",              status:"not-started" },
  { part:"EPILOGUE", ch:"Epilogue",  title:"The Distinction",                        status:"not-started" },
];

const STATUS_META = {
  locked:      { label:"LOCKED",      color: T.success  },
  excavated:   { label:"EXCAVATED",   color: T.accentText},
  seed:        { label:"SEED",        color: T.warning  },
  unverified:  { label:"UNVERIFIED",  color: T.info     },
  protected:   { label:"PROTECTED",   color: T.error    },
  "not-started":{ label:"NOT STARTED",color: T.textMuted},
};

const EXCAVATION = [
  { id:"t1",  title:"Tom Ropel",              priority:"high",   note:"Best friend growing up. 'An entire chapter by itself.' NOT excavated." },
  { id:"t2",  title:"Dave Datt's Funeral",    priority:"high",   note:"Brain aneurysm. Parallel failure arc. Funeral not excavated." },
  { id:"t3",  title:"NIU Expulsion 2016",     priority:"high",   note:"Kicked out. The spiral needs fuller excavation." },
  { id:"t4",  title:"Session 3: Tool Archaeology", priority:"high", note:"Chronological tool mapping — earliest cognitive scaffolding. NOT done." },
  { id:"t5",  title:"15 Open Clarifiers (Apr 16)", priority:"high", note:"Amen eval date conflict, summer 2020 OD context." },
  { id:"t6",  title:"The Car Hit (2014/15)",  priority:"medium", note:"Walking to a girl's house on Xanax. Broke wrist." },
  { id:"t7",  title:"$50K Spending Spree",   priority:"medium", note:"Settlement money. Spent in 3–4 months. What was the car?" },
  { id:"t8",  title:"Ryan at CLC",           priority:"medium", note:"One of The Five is a counselor at Kyle's target partner org." },
];

// ─── DATA: PITCHES (sourced from pitch_console.html) ─────────────────────────
const PITCHES = [
  { num:"01", pub:"Sifted",                  brand:"FlashFusion",     status:"ready", subject:"Founder story — B2B AI consultancy built from an IT support day-job" },
  { num:"02", pub:"ADDitude Magazine",        brand:"Memoir / Personal",status:"ready", subject:"ADHD founder essay — what changes when you stop fighting the wiring" },
  { num:"03", pub:"Business Insider SG",     brand:"FlashFusion",     status:"draft", subject:"The Moltbook failure mode" },
  { num:"04", pub:"Narratively",             brand:"Personal",        status:"draft", subject:"The Personals: The Nod" },
  { num:"05", pub:"Fast Company",            brand:"FlashFusion",     status:"draft", subject:"Counter-data to AI rebellion narrative" },
  { num:"06", pub:"Fortune",                 brand:"FlashFusion",     status:"draft", subject:"Source tip — counter-narrative to AI rebellion piece" },
  { num:"07", pub:"Inc Magazine",            brand:"Memoir / Personal",status:"draft", subject:"ADHD founders — the constraint angle" },
  { num:"08", pub:"Arc Talent Blog",         brand:"Memoir / Personal",status:"draft", subject:"Self-taught dev coverage — IT support to working AI builds" },
  { num:"09", pub:"Lexington Herald-Leader", brand:"Memoir",          status:"draft", subject:"Peer-built support platform — JRN coverage angle" },
  { num:"10", pub:"DIY Genius",             brand:"Memoir / Personal",status:"draft", subject:"ADHD entrepreneurship — constraint angle" },
  { num:"11", pub:"Globe and Mail",          brand:"FlashFusion",     status:"draft", subject:"Bartender-to-AI-consultant — the vector nobody covers" },
];

const PITCH_STATUS = {
  ready: { label:"READY", color: T.success  },
  draft: { label:"DRAFT",  color: T.warning  },
  sent:  { label:"SENT",   color: T.info     },
  dead:  { label:"DEAD",   color: T.textMuted},
};

// ─── DATA: CONTENT ROUTING ────────────────────────────────────────────────────
const CONTENT_TYPES = [
  { type:"LinkedIn Hot Take",    badge:"HOT TAKE",     tool:"dispatch-v3.jsx",                   when:"Built something and have a 1-line insight. Under 200 words." },
  { type:"X Thread",             badge:"THREAD",       tool:"dispatch-v3.jsx",                   when:"Have 4–6 connected observations. Thread = argument, not list." },
  { type:"Essay Brief",          badge:"BRIEF",        tool:"content-engine.jsx",                when:"Want to write a Load-Bearing or FlashFusion essay. Start with the brief." },
  { type:"Newsletter Section",   badge:"SECTION",      tool:"content-engine.jsx",                when:"Writing a Load-Bearing edition. Hook + observation + tool test." },
  { type:"Reading Room",         badge:"READING ROOM", tool:"editorial-framework.html",          when:"A piece that sits in the Abstrekkt aesthetic — slower, literary." },
  { type:"Pitch Letter",         badge:"PITCH",        tool:"pitch_generator.html",              when:"Drafting a new journalist pitch. Use pitch_console.html as the target database." },
  { type:"Video Script",         badge:"VIDEO",        tool:"kyle-origin-video-scripts-v4.md",   when:"Recording origin story or explainer video content." },
  { type:"Voice Audit",          badge:"AUDIT",        tool:"voice-audit.jsx",                   when:"Finished a draft. Run before publishing." },
];

// ─── DATA: CANON REGISTRY (from CANON.md) ─────────────────────────────────────
const CANON_TABLE = [
  { lane:"Memoir",   file:"memoir-explorer.jsx",               what:"Visual/thematic scene explorer, multi-theme",          use:"Arc nav, scene browsing" },
  { lane:"Memoir",   file:"memoir-command-center.jsx",         what:"Chapter tracker, storage-backed, real chapter data",   use:"Status review, session handoffs" },
  { lane:"Memoir",   file:"memoir-hub-v3.jsx",                 what:"Writing collaborator, self-healing API, excavation",   use:"Active writing + excavation sessions" },
  { lane:"Memoir",   file:"book_command_center.html",          what:"Story overview + letters + excavation AI (HTML)",      use:"Quick story-state, letters-to-send" },
  { lane:"Pitch",    file:"pitch_console.html",                what:"Pitch database, 11 journalist entries, status",        use:"Target review, pitch status updates" },
  { lane:"Pitch",    file:"pitch_generator.html",              what:"Claude API pitch generator",                           use:"Drafting a pitch to a new target" },
  { lane:"Pitch",    file:"dispatch-v3.jsx",                   what:"Quick-post dispatcher, Drive MCP, tone control",       use:"Short FlashFusion/AI posts from build notes" },
  { lane:"Content",  file:"content-engine.jsx",                what:"Voice foundation + Claude API content generator",      use:"Essays and posts from scratch, voice-enforced" },
  { lane:"Content",  file:"editorial-framework.html",          what:"Editorial framework: types, rules, criteria",          use:"Planning, what's in-scope vs out" },
  { lane:"Content",  file:"publishing_command_center_v2.html", what:"5 publishing paths + 4 personas + pitch/letters",      use:"Path decision, persona targeting" },
  { lane:"Content",  file:"voice-audit.jsx",                   what:"Voice audit: paste draft, get alignment score",        use:"Final check before publishing" },
  { lane:"Ref",      file:"abstrekkt-tokens.css",              what:"Abstrekkt design tokens (midnight/ember)",              use:"Base for all new artifacts" },
  { lane:"Ref",      file:"design.md",                         what:"Load-Bearing design contract (5-screen newsletter)",   use:"Load-Bearing build reference" },
  { lane:"Ref",      file:"project-focus-evolution-v2.html",   what:"Career/project evolution timeline",                    use:"Narrative ref for pitches and About copy" },
  { lane:"Ref",      file:"char-diagnostic-instinct.md",       what:"The diagnostic instinct character profile",            use:"Voice/origin reference" },
  { lane:"Ref",      file:"kyle-origin-video-scripts-v4.md",   what:"Origin scripts v4 — YouTube/LinkedIn/TikTok",          use:"Video recording reference" },
];

const STALE = [
  { file:"memoir-project-hub.jsx",          why:"Superseded by memoir-command-center.jsx" },
  { file:"publishing_command_center.html",   why:"Superseded by v2 (fewer tabs, less content)" },
  { file:"project-focus-evolution.html",     why:"Superseded by v2 (token-aware, memoir section)" },
  { file:"pitch_console_bak.html",           why:"Pre-Jared backup — archive/delete" },
  { file:"dispatch-v2.jsx",                  why:"Superseded by v3 (Drive integration, toasts)" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const dot = (color) => ({
  display:"inline-block", width:7, height:7, borderRadius:"50%",
  background:color, flexShrink:0,
});

const mono = (extra={}) => ({
  fontFamily: FONTS.mono,
  fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase",
  ...extra,
});

const hairline = { borderBottom:`1px solid ${T.border}` };

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function Kicker({ children, color }) {
  return (
    <span style={{ ...mono(), color: color || T.accentText }}>
      {children}
    </span>
  );
}

function Row({ children, hover=true, style={} }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display:"flex", alignItems:"flex-start", gap:12, padding:"10px 0",
        ...hairline, cursor: hover ? "default" : undefined,
        background: h ? T.surface : "transparent",
        transition:"background 120ms",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHead({ children }) {
  return (
    <div style={{
      fontFamily:FONTS.display, fontSize:13, color:T.textMuted,
      letterSpacing:"0.04em", padding:"20px 0 8px",
      borderBottom:`1px solid ${T.borderHi}`, marginBottom:4,
      textTransform:"uppercase",
    }}>{children}</div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = ["MEMOIR","PITCH & PRESS","CONTENT","CANON"];

function TabBar({ active, onChange }) {
  return (
    <div style={{
      display:"flex", borderBottom:`1px solid ${T.border}`,
      background:T.sunken, padding:"0 24px", gap:0, overflowX:"auto",
    }}>
      {TABS.map(t => {
        const isActive = t === active;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            style={{
              ...mono({ fontSize:11, letterSpacing:"0.12em" }),
              background:"none", border:"none", cursor:"pointer",
              padding:"12px 16px",
              color: isActive ? T.text : T.textMuted,
              borderBottom: isActive ? `2px solid ${T.accentText}` : "2px solid transparent",
              marginBottom:"-1px", whiteSpace:"nowrap",
              transition:"color 120ms",
            }}
          >{t}</button>
        );
      })}
    </div>
  );
}

// ─── MEMOIR TAB ───────────────────────────────────────────────────────────────
function MemoirTab() {
  const locked    = CHAPTERS.filter(c => c.status === "locked").length;
  const excavated = CHAPTERS.filter(c => c.status === "excavated").length;
  const open      = CHAPTERS.filter(c => c.status === "not-started").length;
  const highPri   = EXCAVATION.filter(e => e.priority === "high").length;

  return (
    <div>
      {/* Stats strip */}
      <div style={{
        display:"flex", gap:24, padding:"16px 0 20px",
        borderBottom:`1px solid ${T.border}`,
      }}>
        {[
          { n: locked,    l:"Locked",      c: T.success   },
          { n: excavated, l:"Excavated",   c: T.accentText},
          { n: open,      l:"Not started", c: T.textMuted  },
          { n: highPri,   l:"High-pri queue", c: T.error   },
        ].map(({ n, l, c }) => (
          <div key={l} style={{ display:"flex", flexDirection:"column", gap:2 }}>
            <span style={{ fontFamily:FONTS.display, fontSize:28, color:c, lineHeight:1 }}>{n}</span>
            <Kicker color={T.textMuted}>{l}</Kicker>
          </div>
        ))}
      </div>

      {/* Chapter ledger */}
      <SectionHead>Chapter Status · {CHAPTERS.length} pieces</SectionHead>
      {CHAPTERS.map((ch, i) => {
        const s = STATUS_META[ch.status] || STATUS_META["not-started"];
        return (
          <Row key={i}>
            <span style={{ ...mono({ fontSize:10 }), color:T.textMuted, width:28, flexShrink:0, paddingTop:2 }}>{String(i).padStart(2,"0")}</span>
            <span style={{ ...mono({ fontSize:10, textTransform:"none", letterSpacing:0 }), color:T.textMuted, width:60, flexShrink:0, paddingTop:2 }}>{ch.part} · {ch.ch}</span>
            <span style={{ fontFamily:FONTS.body, fontSize:15, color:T.text, flex:1 }}>{ch.title}</span>
            <span style={{ ...mono({ fontSize:9 }), color:s.color, flexShrink:0, paddingTop:3 }}>{s.label}</span>
          </Row>
        );
      })}

      {/* Excavation queue */}
      <SectionHead>Excavation Queue — {EXCAVATION.filter(e=>e.priority==="high").length} high priority open</SectionHead>
      {EXCAVATION.map((e, i) => (
        <Row key={e.id}>
          <span style={{ ...mono({ fontSize:10 }), color:T.textMuted, width:24, flexShrink:0, paddingTop:2 }}>{i+1}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:FONTS.body, fontSize:15, color:e.priority==="high" ? T.text : T.textSec }}>{e.title}</div>
            <div style={{ fontFamily:FONTS.body, fontSize:13, color:T.textMuted, marginTop:2 }}>{e.note}</div>
          </div>
          <Kicker color={e.priority==="high" ? T.error : T.warning}>{e.priority}</Kicker>
        </Row>
      ))}

      {/* Tool routing */}
      <SectionHead>Memoir Tools</SectionHead>
      {[
        { file:"memoir-hub-v3.jsx",           when:"Active excavation or drafting session" },
        { file:"memoir-command-center.jsx",    when:"Chapter status review / session handoffs" },
        { file:"memoir-explorer.jsx",          when:"Visual arc nav, scene browsing" },
        { file:"book_command_center.html",     when:"Quick story-state, letters-to-send" },
      ].map(({ file, when }) => (
        <Row key={file}>
          <span style={{ fontFamily:FONTS.mono, fontSize:12, color:T.accentText, flex:"0 0 260px" }}>{file}</span>
          <span style={{ fontFamily:FONTS.body, fontSize:14, color:T.textSec }}>{when}</span>
        </Row>
      ))}
    </div>
  );
}

// ─── PITCH & PRESS TAB ────────────────────────────────────────────────────────
function PitchTab() {
  const ready = PITCHES.filter(p => p.status === "ready").length;
  const total = PITCHES.length;

  return (
    <div>
      <div style={{ display:"flex", gap:24, padding:"16px 0 20px", borderBottom:`1px solid ${T.border}` }}>
        {[
          { n: ready, l:"Ready to send", c: T.success  },
          { n: total - ready, l:"In draft", c: T.warning },
          { n: total, l:"Total targets", c: T.accentText },
        ].map(({ n, l, c }) => (
          <div key={l} style={{ display:"flex", flexDirection:"column", gap:2 }}>
            <span style={{ fontFamily:FONTS.display, fontSize:28, color:c, lineHeight:1 }}>{n}</span>
            <Kicker color={T.textMuted}>{l}</Kicker>
          </div>
        ))}
      </div>

      {/* Gate reminder */}
      <div style={{
        background: T.surface,
        border:`1px solid ${T.warning}`,
        borderRadius:4, padding:"10px 14px",
        margin:"16px 0",
        fontFamily:FONTS.body, fontSize:14, color:T.warning,
      }}>
        ⚠ Press send gate: Load-Bearing needs a live URL before any pitch sends. kyle@abstrekkt.com DNS must be verified (MX/SPF/DKIM/DMARC). Revenue-beat journalists (Breen, Sherry) hold until August.
      </div>

      <SectionHead>Pitch Ledger</SectionHead>
      <div style={{ ...mono({ fontSize:10, color:T.textMuted }), display:"grid", gridTemplateColumns:"32px 32px 1fr 120px 70px", gap:"0 12px", padding:"6px 0 6px", borderBottom:`1px solid ${T.borderHi}` }}>
        <span>#</span><span>NUM</span><span>PUBLICATION</span><span>BRAND</span><span>STATUS</span>
      </div>
      {PITCHES.map((p, i) => {
        const s = PITCH_STATUS[p.status];
        return (
          <div key={p.num} style={{
            display:"grid", gridTemplateColumns:"32px 32px 1fr 120px 70px",
            gap:"0 12px", padding:"9px 0", borderBottom:`1px solid ${T.border}`,
            alignItems:"start",
          }}>
            <span style={{ ...mono({ fontSize:10 }), color:T.textMuted }}>{String(i+1).padStart(2,"0")}</span>
            <span style={{ ...mono({ fontSize:10 }), color:T.textMuted }}>{p.num}</span>
            <div>
              <div style={{ fontFamily:FONTS.body, fontSize:15, color:T.text }}>{p.pub}</div>
              <div style={{ fontFamily:FONTS.body, fontSize:12, color:T.textMuted, marginTop:1 }}>{p.subject}</div>
            </div>
            <span style={{ ...mono({ fontSize:9 }), color:T.textMuted, paddingTop:3 }}>{p.brand}</span>
            <span style={{ ...mono({ fontSize:9 }), color:s.color, paddingTop:3 }}>{s.label}</span>
          </div>
        );
      })}

      <SectionHead>Pitch & Press Tools</SectionHead>
      {[
        { file:"pitch_console.html",        when:"Target review, status updates, Jared/journalist database" },
        { file:"pitch_generator.html",      when:"Drafting a pitch from scratch to a new target" },
        { file:"dispatch-v3.jsx",           when:"Quick FlashFusion/AI posts from build notes" },
        { file:"kyle-origin-video-scripts-v4.md", when:"Video recording reference (includes piano/pattern beat)" },
      ].map(({ file, when }) => (
        <Row key={file}>
          <span style={{ fontFamily:FONTS.mono, fontSize:12, color:T.accentText, flex:"0 0 280px" }}>{file}</span>
          <span style={{ fontFamily:FONTS.body, fontSize:14, color:T.textSec }}>{when}</span>
        </Row>
      ))}
    </div>
  );
}

// ─── CONTENT TAB ─────────────────────────────────────────────────────────────
function ContentTab() {
  return (
    <div>
      <SectionHead>Content Routing — What to use when</SectionHead>
      {CONTENT_TYPES.map(({ type, badge, tool, when }) => (
        <Row key={type}>
          <span style={{
            ...mono({ fontSize:9 }), color:T.sunken,
            background:T.accentText, borderRadius:2, padding:"2px 5px",
            flexShrink:0, marginTop:2,
          }}>{badge}</span>
          <div style={{ flex:1 }}>
            <span style={{ fontFamily:FONTS.body, fontSize:15, color:T.text }}>{type}</span>
            <div style={{ fontFamily:FONTS.body, fontSize:13, color:T.textMuted, marginTop:1 }}>{when}</div>
          </div>
          <span style={{ fontFamily:FONTS.mono, fontSize:11, color:T.accentText, textAlign:"right", flexShrink:0 }}>{tool}</span>
        </Row>
      ))}

      <SectionHead>Voice Rules (non-negotiable)</SectionHead>
      {[
        "No credential claims before CCA-F passes July 20 2026.",
        "Tool count: ~30 hands-on. '240+' = catalogued MCP configs. Never conflate.",
        "Day job ceiling: 'a managed IT firm.' Never name employer, colleagues, internal systems.",
        "No memoir-register lane-bleed in Reading Room / Load-Bearing content.",
        "No revenue claims before first paid audit closes (August target).",
        "Kinsley: never in any lane, plan, or deliverable.",
        "Art: never named externally. 'Real estate champion' only.",
        "ChaosClubCo / Chaos Collective: retired. Never in new external copy.",
      ].map((r, i) => (
        <div key={i} style={{
          display:"flex", gap:10, padding:"8px 0",
          borderBottom:`1px solid ${T.border}`,
          fontFamily:FONTS.body, fontSize:14, color:T.textSec,
        }}>
          <span style={{ ...mono({ fontSize:9 }), color:T.error, flexShrink:0, paddingTop:3 }}>HARD</span>
          <span>{r}</span>
        </div>
      ))}
    </div>
  );
}

// ─── CANON TAB ────────────────────────────────────────────────────────────────
function CanonTab() {
  const lanes = [...new Set(CANON_TABLE.map(r => r.lane))];
  return (
    <div>
      <div style={{
        fontFamily:FONTS.body, fontSize:14, color:T.textSec,
        padding:"14px 0 16px", borderBottom:`1px solid ${T.border}`,
        lineHeight:1.6,
      }}>
        <strong style={{ color:T.accentText }}>Convention:</strong> canonical file has NO version suffix. When replacing: rename old to <span style={{ fontFamily:FONTS.mono, fontSize:12 }}>[name]_archive_YYYY-MM.ext</span>, build new as <span style={{ fontFamily:FONTS.mono, fontSize:12 }}>[name].ext</span>, update this table. Never <span style={{ fontFamily:FONTS.mono, fontSize:12 }}>_bak</span>, never <span style={{ fontFamily:FONTS.mono, fontSize:12 }}>_v2</span> on the canonical.
      </div>

      {lanes.map(lane => (
        <div key={lane}>
          <SectionHead>Lane: {lane}</SectionHead>
          {CANON_TABLE.filter(r => r.lane === lane).map(({ file, what, use }) => (
            <Row key={file}>
              <span style={{ fontFamily:FONTS.mono, fontSize:11, color:T.accentText, flex:"0 0 280px", wordBreak:"break-all" }}>{file}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:FONTS.body, fontSize:14, color:T.text }}>{what}</div>
                <div style={{ fontFamily:FONTS.body, fontSize:13, color:T.textMuted, marginTop:1 }}>{use}</div>
              </div>
            </Row>
          ))}
        </div>
      ))}

      <SectionHead>Stale — archive or delete</SectionHead>
      {STALE.map(({ file, why }) => (
        <Row key={file} hover={false}>
          <span style={{ fontFamily:FONTS.mono, fontSize:11, color:T.textMuted, flex:"0 0 280px", textDecoration:"line-through", wordBreak:"break-all" }}>{file}</span>
          <span style={{ fontFamily:FONTS.body, fontSize:14, color:T.textMuted }}>{why}</span>
        </Row>
      ))}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function AuthorHub() {
  const [tab, setTab] = useState("MEMOIR");

  return (
    <>
      <style>{GLOBAL}</style>
      <div style={{ background:T.bg, minHeight:"100vh", fontFamily:FONTS.body, color:T.text }}>

        {/* Header */}
        <div style={{ background:T.sunken, borderBottom:`1px solid ${T.border}`, padding:"20px 24px 16px" }}>
          <div style={{ ...mono({ fontSize:10, color:T.accentText }), marginBottom:6 }}>
            ABSTREKKT · AUTHOR COMMAND CENTER
          </div>
          <h1 style={{
            fontFamily:FONTS.display, fontSize:28, fontWeight:500,
            letterSpacing:"-0.02em", color:T.text, margin:0, lineHeight:1.1,
          }}>
            The Reading Room
          </h1>
          <div style={{ fontFamily:FONTS.body, fontSize:15, color:T.textSec, marginTop:6 }}>
            Memoir · Pitch & Press · Content — one surface, canonical tools only.
          </div>
        </div>

        <TabBar active={tab} onChange={setTab} />

        {/* Content */}
        <div style={{ maxWidth:860, margin:"0 auto", padding:"8px 24px 64px" }}>
          {tab === "MEMOIR"        && <MemoirTab />}
          {tab === "PITCH & PRESS" && <PitchTab />}
          {tab === "CONTENT"       && <ContentTab />}
          {tab === "CANON"         && <CanonTab />}
        </div>
      </div>
    </>
  );
}
