import React, { useState } from 'react';
import { ChevronRight, Box, Flag, AlertCircle } from 'lucide-react';

// THE ABSTREKKT PRODUCTS ARC — v1, 2026-06-10
// Forward lane for the software portfolio under Abstrekkt (parent, est. Jun 2026):
// claude-code-plugins-plus (244 plugins, built, distribution pending), Ample, FissionPrompt.
// LINEAGE: this lane absorbed the ChaosClubCo arc. That artifact is preserved byte-identical
// in /03-history/ as a historical record per Kyle's ruling — the retired name does not
// appear in forward planning or any new external copy.
// ACCENT: emerald #34d399 is INTERIM. Abstrekkt brand identity (color/type/voice) is an
// open decision; replace this accent when the brand system exists.
// EXCLUDED: kidcreator/StoryWeaver — personal gift project, never marketed, not portfolio.

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
* { box-sizing: border-box; }
:root { --bg:#0a0f0d; --bg-2:#121a17; --bg-3:#1a2420; --fg:#e6ede9; --fg-dim:#8a988f; --fg-mute:#56625b; --border:#1e2a25; --border-bright:#2b3a33; --accent:#34d399; --accent-soft:#6ee7b7; --accent-bg:rgba(52,211,153,0.06); --gate:#a7f3d0; }
body,.root { margin:0; background:var(--bg); color:var(--fg); font-family:'Geist',sans-serif; font-size:14px; line-height:1.55; }
.root { min-height:100vh; background:radial-gradient(ellipse 70% 40% at 50% -10%, rgba(52,211,153,0.05), transparent 60%), var(--bg); padding:48px 24px 96px; }
.container { max-width:1180px; margin:0 auto; }
.header-grid { display:grid; grid-template-columns:1fr auto; gap:32px; align-items:end; padding-bottom:32px; border-bottom:1px solid var(--border); margin-bottom:36px; }
.kicker { font-size:11px; text-transform:uppercase; letter-spacing:0.24em; color:var(--accent); margin:0 0 16px; display:flex; align-items:center; gap:8px; font-family:'Geist Mono',monospace; }
.title-serif { font-family:'Instrument Serif',serif; font-size:clamp(44px,5.8vw,72px); line-height:0.96; letter-spacing:-0.02em; margin:0; font-weight:400; }
.title-serif em { color:var(--accent); font-style:italic; }
.title-sub { font-size:14.5px; color:var(--fg-dim); margin:18px 0 0; max-width:64ch; line-height:1.65; }
.meta { text-align:right; font-size:11px; color:var(--fg-dim); text-transform:uppercase; letter-spacing:0.14em; font-family:'Geist Mono',monospace; }
.meta strong { color:var(--fg); font-weight:500; }
.strip { display:grid; grid-template-columns:repeat(5,1fr); gap:1px; background:var(--border); border:1px solid var(--border); margin-bottom:36px; }
.strip-cell { padding:16px 18px; background:var(--bg-2); display:grid; gap:6px; }
.strip-label { font-size:9px; letter-spacing:0.2em; text-transform:uppercase; color:var(--fg-mute); font-family:'Geist Mono',monospace; }
.strip-value { font-family:'Instrument Serif',serif; font-style:italic; font-size:26px; color:var(--accent); line-height:1; }
.strip-note { font-size:11px; color:var(--fg-dim); line-height:1.45; }
.tradeoff { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--border); border:1px solid var(--border); margin-bottom:20px; }
.tradeoff-cell { padding:22px 24px; background:var(--bg-2); }
.tradeoff-label { font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--accent); margin-bottom:12px; font-family:'Geist Mono',monospace; }
.tradeoff-text { font-size:14px; line-height:1.7; }
.tradeoff-text strong { font-weight:600; }
.principle { margin-bottom:36px; padding:16px 24px; border:1px dashed var(--border-bright); background:var(--accent-bg); font-family:'Instrument Serif',serif; font-style:italic; font-size:18px; color:var(--accent-soft); line-height:1.5; }
.principle-label { font-family:'Geist Mono',monospace; font-style:normal; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:var(--accent); margin-bottom:8px; display:block; }
.progress-wrap { margin-bottom:28px; padding:14px 20px; background:var(--bg-2); border:1px solid var(--border); position:sticky; top:20px; z-index:5; display:grid; grid-template-columns:1fr auto; gap:20px; align-items:center; }
.progress-bar { height:6px; background:var(--bg-3); position:relative; }
.progress-fill { position:absolute; inset:0 auto 0 0; background:var(--accent); transition:width 0.4s; }
.progress-meta { font-family:'Geist Mono',monospace; font-size:11px; color:var(--fg-dim); letter-spacing:0.1em; }
.progress-meta strong { color:var(--accent); font-weight:600; }
.quarters { display:grid; gap:14px; }
.quarter { border:1px solid var(--border); background:var(--bg-2); border-left:3px solid var(--accent); }
.quarter-head { padding:14px 20px; display:grid; grid-template-columns:auto 1fr auto; gap:16px; align-items:center; border-bottom:1px solid var(--border); cursor:pointer; user-select:none; }
.quarter-num { font-family:'Instrument Serif',serif; font-style:italic; font-size:30px; color:var(--accent); line-height:1; }
.quarter-title { font-size:15px; font-weight:600; }
.quarter-sub { font-size:11.5px; color:var(--fg-dim); margin-top:3px; }
.quarter-chevron { color:var(--fg-mute); transition:transform 0.2s; }
.quarter.open .quarter-chevron { transform:rotate(90deg); }
.month { padding:14px 20px; border-top:1px solid var(--border); }
.month-head { display:grid; grid-template-columns:auto 1fr auto; gap:14px; align-items:start; cursor:pointer; }
.month-num { font-family:'Instrument Serif',serif; font-style:italic; font-size:22px; color:var(--accent-soft); min-width:44px; }
.month-gate-label { font-family:'Geist Mono',monospace; font-size:9px; letter-spacing:0.2em; text-transform:uppercase; color:var(--gate); margin-bottom:4px; }
.month-gate-text { font-family:'Instrument Serif',serif; font-style:italic; font-size:16px; line-height:1.4; }
.month-check { width:18px; height:18px; border:1.5px solid var(--fg-mute); cursor:pointer; margin-top:4px; display:flex; align-items:center; justify-content:center; }
.month-check.done { background:var(--accent); border-color:var(--accent); color:var(--bg); }
.weeks { display:grid; gap:6px; margin-top:12px; padding-left:58px; }
.week { display:grid; grid-template-columns:32px 1fr 16px; gap:12px; align-items:start; padding:8px 10px; background:var(--bg-3); cursor:pointer; border-left:2px solid transparent; }
.week:hover { background:var(--bg); }
.week.done { border-left-color:var(--accent); opacity:0.65; }
.week.done .week-text { text-decoration:line-through; }
.week-label { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.12em; color:var(--accent); font-weight:600; }
.week-text { font-size:12.5px; line-height:1.5; }
.week-check { width:14px; height:14px; border:1.5px solid var(--fg-mute); display:flex; align-items:center; justify-content:center; }
.week.done .week-check { background:var(--accent); border-color:var(--accent); }
.claims { margin-top:40px; padding:24px; border:1px solid var(--border); background:var(--bg-2); font-size:12px; color:var(--fg-dim); line-height:1.75; }
.claims h4 { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.22em; color:var(--fg); text-transform:uppercase; margin:0 0 12px; }
.claims ul { margin:6px 0; padding-left:20px; }
.claims li { margin-bottom:6px; }
.claims strong { color:var(--fg); font-weight:600; }
@media (max-width:880px) { .strip{grid-template-columns:1fr 1fr;} .tradeoff,.header-grid{grid-template-columns:1fr;} .meta{text-align:left;} .weeks{padding-left:0;} }
`;

const QUARTERS = [
  { num:'Q1', title:'Distribution + brand identity', sub:'Jun → Aug 2026 · 244 plugins find their audience · Abstrekkt gets a face',
    months:[
      { m:1, gate:'claude-code-plugins-plus distribution path decided · launch sequence locked',
        weeks:[
          'Repo state audit: confirm all 244 plugins installable post any spec drift.',
          'Distribution path decision: marketplace listing vs launch post vs community seeding. Criteria written before choosing.',
          'README + landing polish for the chosen path. Demo flow recorded.',
          'Launch sequence drafted, outreach list built, date locked.',
        ]},
      { m:2, gate:'Launch executed · first 100 installs · feedback loop live',
        weeks:[
          'Launch day. Coordinated post + outreach + community shares. (Note: shares FF M2 exam-month bandwidth — keep launch ops light.)',
          'Metrics review: installs, install-to-active ratio.',
          'Feedback wave 1 triaged. Top 5 plugin issues identified.',
          'Top issues patched. Second outreach wave.',
        ]},
      { m:3, gate:'Abstrekkt brand identity v1: color system, type system, voice doc',
        weeks:[
          'Brand brief: what Abstrekkt is (parent holding identity, not a product brand). Mood + references gathered.',
          'Color + type system drafted. Replaces interim emerald across artifacts.',
          'Voice doc v1: parent-org register distinct from FlashFusion, Load-Bearing, Memoir.',
          'Q1 retro: distribution honest numbers, brand v1 shipped, contribution path open or deferred.',
        ]},
    ]},
  { num:'Q2', title:'Ample: definition before build', sub:'Sep → Nov 2026 · no product definition exists — define or kill before building',
    months:[
      { m:4, gate:'Ample product definition exists: problem, user, wedge — or a documented kill',
        weeks:[
          'Definition gate: no available product definition exists. Write the one-pager: problem, user, wedge, why-now.',
          'Market sanity pass: does anything validate the wedge. Honest, not hopeful.',
          'Define/kill decision. A kill here is a valid, cheap outcome.',
          'If defined: v1 scope locked, everything optional cut. If killed: bandwidth reallocates to flagship candidate.',
        ]},
      { m:5, gate:'Ample MVP core flow shipped to 5 closed-beta users (if defined)',
        weeks:[
          'Build W1: foundation + auth.',
          'Build W2: primary user flow end-to-end.',
          'Build W3: feedback capture built in.',
          '5 closed-beta invites. Loop live.',
        ]},
      { m:6, gate:'Mid-cycle: Ample stable or killed-with-learning · marketplace 500+ installs check',
        weeks:[
          'Beta feedback triage, top 3 bugs.',
          'Fixes + polish.',
          'Marketplace 500-install gate check, honest trajectory.',
          'Mid-cycle retro: portfolio shape honest read.',
        ]},
    ]},
  { num:'Q3', title:'FissionPrompt: same gate, second product', sub:'Dec 2026 → Feb 2027 · definition-before-build, sequenced after Ample',
    months:[
      { m:7, gate:'FissionPrompt definition exists or documented kill · sequencing honest vs bandwidth',
        weeks:[
          'Definition gate: write the one-pager or kill. Repo dormant since Nov 2025 — dormancy is data.',
          'Sequencing decision: only proceed if Ample is stable or killed. Two parallel builds is fiction at this bandwidth.',
          'If defined: v0.2 scope locked.',
          'Build kickoff or formal deferral.',
        ]},
      { m:8, gate:'Closed alpha + 3 public examples (if proceeding)',
        weeks:[
          'Alpha W1: core pipeline.',
          'Alpha W2: 3 examples shipped publicly.',
          '3 trusted testers onboarded.',
          'Feedback triage.',
        ]},
      { m:9, gate:'Portfolio thesis verdict: flagship visible or portfolio rejected honestly',
        weeks:[
          'Three products evaluated: use, distribution, revenue, leverage.',
          'Flagship candidate named with evidence.',
          'Verdict documented for the project file.',
          'Q3 retro.',
        ]},
    ]},
  { num:'Q4', title:'Concentration + Y2', sub:'Mar → May 2027 · 70% to the flagship, the rest to maintenance or sunset',
    months:[
      { m:10, gate:'Investment concentration executed: 70% flagship / 30% maintenance',
        weeks:[
          'Concentration decision applied to actual weekly hours.',
          'Sunset plan for the weakest product (archive with dignity, learning captured).',
          'Flagship roadmap v1.',
          'Brand v1 → v1.1 revisions from six months of real use.',
        ]},
      { m:11, gate:'Flagship compounding · distribution rhythm sustainable',
        weeks:[
          'Flagship feature/distribution sprint.',
          'Cross-feed check: Load-Bearing + FF case studies referencing products where honest.',
          'Flagship sprint cont.',
          'Y2 product strategy draft.',
        ]},
      { m:12, gate:'Y2 product strategy locked · lane retrospective',
        weeks:[
          'Y2 strategy reviewed vs FF + Memoir + Reading Room bandwidth.',
          'Lane discipline retro: any retired-brand leakage into external copy this year (target: zero).',
          'Abstrekkt identity statement finalized.',
          'Y2 locked. Closing reflection.',
        ]},
    ]},
];

export default function AbstrekktProductsArc() {
  const [openQ, setOpenQ] = useState('Q1');
  const [openM, setOpenM] = useState(1);
  const [doneMonths, setDoneMonths] = useState(new Set());
  const [doneWeeks, setDoneWeeks] = useState(new Set());
  const pct = Math.round((doneWeeks.size/48)*100);
  const tM = m => setDoneMonths(p=>{const n=new Set(p); n.has(m)?n.delete(m):n.add(m); return n;});
  const tW = k => setDoneWeeks(p=>{const n=new Set(p); n.has(k)?n.delete(k):n.add(k); return n;});
  return (<>
    <style>{STYLE}</style>
    <div className="root"><div className="container">
      <div className="header-grid">
        <div>
          <p className="kicker"><Box size={12}/> Abstrekkt Products // Software Portfolio · interim accent pending brand v1</p>
          <h1 className="title-serif">The <em>Abstrekkt Products</em> Arc.</h1>
          <p className="title-sub">The software portfolio under the parent: claude-code-plugins-plus (244 plugins, built, distribution pending), Ample and FissionPrompt (no product definitions yet — definition gates before any build). This lane absorbed its predecessor; that arc is preserved in history, and the retired name does not travel forward. kidcreator stays out: gift, not portfolio.</p>
        </div>
        <div className="meta">
          <div>Lane <strong>Abstrekkt Products</strong></div>
          <div style={{marginTop:4}}>Horizon <strong>Jun 2026 → May 2027</strong></div>
          <div style={{marginTop:4}}>Shipped <strong>244 plugins</strong> · distribution pending</div>
          <div style={{marginTop:4}}>Accent <strong>#34d399 INTERIM</strong></div>
        </div>
      </div>
      <div className="strip">
        <div className="strip-cell"><div className="strip-label">Q1</div><div className="strip-value">Distribute</div><div className="strip-note">+ brand identity v1</div></div>
        <div className="strip-cell"><div className="strip-label">Q2</div><div className="strip-value">Define</div><div className="strip-note">Ample: define or kill</div></div>
        <div className="strip-cell"><div className="strip-label">Q3</div><div className="strip-value">Verdict</div><div className="strip-note">FissionPrompt + portfolio thesis</div></div>
        <div className="strip-cell"><div className="strip-label">Q4</div><div className="strip-value">70/30</div><div className="strip-note">flagship concentration</div></div>
        <div className="strip-cell"><div className="strip-label">Excluded</div><div className="strip-value">kidcreator</div><div className="strip-note">gift · never marketed</div></div>
      </div>
      <div className="tradeoff">
        <div className="tradeoff-cell"><div className="tradeoff-label">What you gain</div><div className="tradeoff-text"><strong>A real distribution test</strong> for the one product that actually exists. <strong>Definition gates</strong> that make killing cheap — Ample and FissionPrompt earn build time or die as one-pagers, not as six-month sunk costs. <strong>Brand identity</strong> for the parent, finally, with the interim accent forcing the decision.</div></div>
        <div className="tradeoff-cell"><div className="tradeoff-label">What you give up</div><div className="tradeoff-text"><strong>The fantasy of three products.</strong> At ~12 hrs/wk full pace, this lane supports one build at a time plus marketplace maintenance. <strong>Naming continuity</strong> — the lane's history lives in the archive, not in forward copy. <strong>Q1 launch glory</strong> — the M2 launch shares a month with the CCA-F exam; it ships light by design.</div></div>
      </div>
      <div className="principle"><span className="principle-label">Operating principle</span>Define before building, distribute before polishing, kill cheap and early. A product without a written definition is a hobby with a repo.</div>
      <div className="progress-wrap"><div className="progress-bar"><div className="progress-fill" style={{width:`${pct}%`}}/></div><div className="progress-meta"><strong>{doneWeeks.size}</strong> / 48 weeks · {pct}%</div></div>
      <div className="quarters">
        {QUARTERS.map(q=>{const o=openQ===q.num; return (
          <div key={q.num} className={`quarter ${o?'open':''}`}>
            <div className="quarter-head" onClick={()=>setOpenQ(o?null:q.num)}>
              <div className="quarter-num">{q.num}</div>
              <div><div className="quarter-title">{q.title}</div><div className="quarter-sub">{q.sub}</div></div>
              <ChevronRight size={18} className="quarter-chevron"/>
            </div>
            {o && q.months.map(mo=>{const mOpen=openM===mo.m; return (
              <div key={mo.m} className="month">
                <div className="month-head" onClick={()=>setOpenM(mOpen?null:mo.m)}>
                  <div className="month-num">M{mo.m}</div>
                  <div><div className="month-gate-label">Gate</div><div className="month-gate-text">{mo.gate}</div></div>
                  <div className={`month-check ${doneMonths.has(mo.m)?'done':''}`} onClick={e=>{e.stopPropagation();tM(mo.m);}}>{doneMonths.has(mo.m)&&<Flag size={11}/>}</div>
                </div>
                {mOpen && <div className="weeks">{mo.weeks.map((w,wi)=>{const k=`${mo.m}-${wi+1}`;const d=doneWeeks.has(k);return (
                  <div key={wi} className={`week ${d?'done':''}`} onClick={()=>tW(k)}>
                    <div className="week-label">W{wi+1}</div><div className="week-text">{w}</div>
                    <div className="week-check">{d&&<Flag size={9}/>}</div>
                  </div>);})}</div>}
              </div>);})}
          </div>);})}
      </div>
      <div className="claims">
        <h4><AlertCircle size={10} style={{display:'inline',marginRight:6,verticalAlign:'middle'}}/>Claims, gaps, assumptions</h4>
        <ul>
          <li><strong>Lineage:</strong> this lane structurally replaces the predecessor arc, which is preserved byte-identical in the history folder per Kyle\\'s ruling (history matters; the name stays retired in forward work). The predecessor\\'s M9 brand-decision gate is resolved: Abstrekkt answered it.</li>
          <li><strong>[GENERATED] The emerald accent is interim.</strong> No Abstrekkt brand identity exists (open decision). M3 produces v1; every artifact carrying the interim accent gets swapped then.</li>
          <li><strong>Ample and FissionPrompt have no available product definitions</strong> — they cannot be positioned, planned, or built around until the definition gates produce one-pagers. The Q2/Q3 structure makes definition the deliverable, not the build. A kill at M4 or M7 is success, not failure.</li>
          <li><strong>The M2 launch deliberately shares July with the CCA-F exam.</strong> Launch ops are scoped light (post + outreach, no live events). If exam prep demands it, launch slips to M3 W1 — exam wins.</li>
          <li><strong>"240+" framing rule:</strong> 244 = plugins catalogued and installable, never presented as tools mastered. Hands-on count is ~30. Every external surface this lane produces obeys that line.</li>
          <li><strong>Not modeled:</strong> marketplace platform-policy changes, contributor moderation load if the contribution path opens, the scenario where the marketplace itself becomes the flagship and Q2-Q3 definition gates both produce kills (valid path — the lane becomes marketplace + brand only).</li>
        </ul>
      </div>
    </div></div>
  </>);
}
