import React, { useState } from 'react';
import { Briefcase, Box, BookOpen, Lamp, Flag } from 'lucide-react';

// LANE DASHBOARD — v2, rebased 2026-06-10. Four lanes, 12 gates each, sourced from the
// four lane-arc artifacts (the-flashfusion-arc v2, the-abstrekkt-products-arc v1,
// the-memoir-arc patched, the-reading-room-arc patched). M1 = Jun 2026.

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
*{box-sizing:border-box}
:root{--bg:#0b0b10;--bg2:#14141c;--bg3:#1c1c27;--fg:#e8e9ed;--dim:#8a8f9a;--mute:#555a65;--border:#22222e;
--ff:#7c3aed;--prod:#34d399;--mem:#b89968;--rr:#C8A86A}
body,.root{margin:0;background:var(--bg);color:var(--fg);font-family:'Inter',sans-serif;font-size:14px;line-height:1.5}
.root{min-height:100vh;padding:40px 24px 80px}
.container{max-width:1240px;margin:0 auto}
.kicker{font-size:10px;text-transform:uppercase;letter-spacing:.24em;color:var(--dim);font-family:'JetBrains Mono',monospace;margin:0 0 10px}
h1{font-size:30px;font-weight:700;letter-spacing:-.02em;margin:0 0 6px}
.sub{font-size:13px;color:var(--dim);max-width:72ch;margin:0 0 14px;line-height:1.6}
.now{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.1em;color:var(--fg);border:1px solid var(--border);background:var(--bg2);padding:6px 14px;margin-bottom:26px}
.now strong{color:var(--ff)}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.lane{border:1px solid var(--border);background:var(--bg2);border-top:3px solid var(--lc)}
.lane-head{padding:14px 18px;display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;border-bottom:1px solid var(--border)}
.lane-icon{width:30px;height:30px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--lc)}
.lane-name{font-weight:600;font-size:13.5px}
.lane-meta{font-size:10.5px;color:var(--dim);margin-top:2px;font-family:'JetBrains Mono',monospace}
.lane-pct{font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:600;color:var(--lc)}
.bar{height:4px;background:var(--bg3)}
.fill{height:100%;background:var(--lc);transition:width .3s}
.gates{padding:8px 0;max-height:430px;overflow-y:auto}
.gate{display:grid;grid-template-columns:38px 1fr 18px;gap:10px;padding:8px 16px;cursor:pointer;border-left:2px solid transparent;align-items:start}
.gate:hover{background:var(--bg3)}
.gate.done{border-left-color:var(--lc);opacity:.6}
.gate.done .gate-text{text-decoration:line-through}
.gate.current{background:var(--bg3);border-left-color:var(--lc)}
.gate-m{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--lc);font-weight:600;padding-top:2px}
.gate-text{font-size:12px;line-height:1.5}
.gate-cal{font-size:9.5px;color:var(--mute);font-family:'JetBrains Mono',monospace;margin-top:2px}
.gate-check{width:14px;height:14px;border:1.5px solid var(--mute);display:flex;align-items:center;justify-content:center;margin-top:2px}
.gate.done .gate-check{background:var(--lc);border-color:var(--lc);color:var(--bg)}
.claims{margin-top:24px;padding:18px 20px;border:1px solid var(--border);background:var(--bg2);font-size:12px;color:var(--dim);line-height:1.7}
.claims h4{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.22em;color:var(--fg);text-transform:uppercase;margin:0 0 8px}
.claims strong{color:var(--fg)}
@media(max-width:920px){.grid{grid-template-columns:1fr}}
`;

const CAL = ['Jun 26','Jul 26','Aug 26','Sep 26','Oct 26','Nov 26','Dec 26','Jan 27','Feb 27','Mar 27','Apr 27','May 27'];

const LANES = [
  { id:'ff', name:'FlashFusion', icon:Briefcase, color:'var(--ff)', meta:'champion model · floor $4,500 · exam Jul 20', gates:[
    'LLC filed · E&O in motion · Art + Ryan deliverables scoped · CLC + Union outreach live',
    'CCA-F exam Jul 20 · Art validated in a real showing · Ryan audit + profile delivered',
    'Case studies #1-2 drafted · first PAID audit signed at $4,500 · concurrent cap set',
    'CLC workshop delivered · paid audit #1 delivered · case study #3',
    'Paid audit #2 signed · champion playbook v1 · Ryan conversion attempt',
    'Mid-cycle: 3+ paid engagements cumulative · training offer per-cohort/per-seat',
    'First build signed (per-project fee) · training cohort #1 scheduled',
    'Training cohort #1 delivered · build #1 in delivery',
    'Build #1 delivered · 2nd training contract negotiating · Load-Bearing cross-feed measured',
    'Capacity model proven at cap · referral share ≥50% of new pipeline',
    'Pricing review complete · floor raise decision · Y2 service mix drafted',
    'Revenue actual vs target measured honestly · Y2 strategy locked' ]},
  { id:'prod', name:'Abstrekkt Products', icon:Box, color:'var(--prod)', meta:'244 plugins · definition gates · interim accent', gates:[
    'claude-code-plugins-plus distribution path decided · launch sequence locked',
    'Launch executed · first 100 installs · feedback loop live',
    'Abstrekkt brand identity v1: color system, type system, voice doc',
    'Ample product definition exists: problem, user, wedge — or documented kill',
    'Ample MVP core flow shipped to 5 closed-beta users (if defined)',
    'Mid-cycle: Ample stable or killed-with-learning · marketplace 500+ installs check',
    'FissionPrompt definition exists or documented kill · sequencing honest vs bandwidth',
    'Closed alpha + 3 public examples (if proceeding)',
    'Portfolio thesis verdict: flagship visible or portfolio rejected honestly',
    'Investment concentration executed: 70% flagship / 30% maintenance',
    'Flagship compounding · distribution rhythm sustainable',
    'Y2 product strategy locked · lane retrospective' ]},
  { id:'mem', name:'Memoir', icon:BookOpen, color:'var(--mem)', meta:'Construction over Recovery · letter to Kinsley', gates:[
    'Session 3 Tool Archaeology complete — three chapters unblocked simultaneously',
    'Tom Ropel chapter excavated — best-friend material captured without forcing arc',
    'Dave Datt excavated · Tier-3 excavation tasks completed · Q1 retrospective',
    'Opening chapter drafted — voice locked, frame established, no recovery language',
    'Chapters 2-3 drafted · the recursive-trap framing tested in prose',
    'Mid-year: 5 chapters drafted · manuscript consolidated · cognitive-profile thesis tested',
    'Chapters 6-8 drafted — middle act from Tom Ropel + Dave Datt excavations',
    'Chapters 9-10 drafted — Sedona, Soaring Bear, the card-table-website origin',
    'First draft complete — every chapter rough · structure decision triggered',
    'Structural revision complete · chapter order locked · second draft begun',
    'Manuscript at submittable quality · attorney review for Michael journal triggered',
    'Agent submission path decided · Y2 plan locked · closing reflection' ]},
  { id:'rr', name:'Reading Room', icon:Lamp, color:'var(--rr)', meta:'Load-Bearing spine · weekly cadence · gates are projections', gates:[
    'Platform decision locked · cadence committed · voice doc separate from FF/Products/Memoir',
    'First 4 weekly posts shipped · 50 subscribers · cadence proven one month',
    'Essay series #1 concept locked · editorial calendar built · Q1 retro',
    'Essay series #1 publishing · 100 subscribers · cadence absorbing essay weeks',
    '150 subscribers · voice audit passed · cadence held through essay pressure',
    '200 subscribers · mid-year retro · the room is real',
    'Essay series #2 launching · first FF case-study cross-link without selling',
    '400 subscribers · first guest essay or syndication moment',
    '600 subscribers · editorial system mature · Q3 retro',
    'Surface options written · evaluation framework locked · decision in progress',
    'Paid tier OR sustained-free decision implemented · 800 subscribers',
    'Y2 editorial strategy locked · cross-lane attribution · year-one reflection' ]},
];

export default function LaneDashboard() {
  const [done, setDone] = useState({ ff:new Set(), prod:new Set(), mem:new Set(), rr:new Set() });
  const toggle = (lane,m) => setDone(p=>{const n=new Set(p[lane]); n.has(m)?n.delete(m):n.add(m); return {...p,[lane]:n};});
  const currentM = 1; // Jun 2026
  return (<>
    <style>{STYLE}</style>
    <div className="root"><div className="container">
      <p className="kicker">Execution layer // Lane Dashboard · v2 · 4 lanes · 48 gates</p>
      <h1>The whole year on one screen.</h1>
      <p className="sub">Twelve monthly gates per lane, sourced from the four arc artifacts. A gate is binary — it passed or it didn't. The dashboard doesn't negotiate.</p>
      <div className="now">NOW: <strong>M{currentM} · Jun 2026</strong> — LLC week · E&O motion · CLC email + Union message · Art/Ryan scoping · plugins distribution decision · RR platform decision</div>
      <div className="grid">
        {LANES.map(l=>{const I=l.icon;const pct=Math.round((done[l.id].size/12)*100);return (
          <div key={l.id} className="lane" style={{'--lc':l.color}}>
            <div className="lane-head">
              <div className="lane-icon"><I size={15}/></div>
              <div><div className="lane-name">{l.name}</div><div className="lane-meta">{l.meta}</div></div>
              <div className="lane-pct">{pct}%</div>
            </div>
            <div className="bar"><div className="fill" style={{width:`${pct}%`}}/></div>
            <div className="gates">
              {l.gates.map((g,i)=>{const m=i+1;const d=done[l.id].has(m);return (
                <div key={m} className={`gate ${d?'done':''} ${m===currentM&&!d?'current':''}`} onClick={()=>toggle(l.id,m)}>
                  <div><div className="gate-m">M{m}</div><div className="gate-cal">{CAL[i]}</div></div>
                  <div className="gate-text">{g}</div>
                  <div className="gate-check">{d&&<Flag size={9}/>}</div>
                </div>);})}
            </div>
          </div>);})}
      </div>
      <div className="claims">
        <h4>Claims, gaps, assumptions</h4>
        <strong>[SOURCED]</strong> Gate text pulled verbatim from the four arc artifacts (FF v2, Products v1, Memoir patched, Reading Room patched), calendar rebased M1 = Jun 2026. <strong>[GENERATED]</strong> RR subscriber numbers are projections, not commitments — the arcs say so and the dashboard repeats it. Memoir and RR gate <em>content</em> carried unchanged from the May plan; only calendar labels shifted. State is local to this artifact (no persistence) — it's a review surface, not a database. The day job's ~45 hrs and any day-job-side commitments are intentionally invisible here by the lane-separation rule.
      </div>
    </div></div>
  </>);
}
