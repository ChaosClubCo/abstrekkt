import React, { useState } from 'react';
import { ChevronRight, Target, Flag, AlertCircle } from 'lucide-react';

// THE FLASHFUSION ARC — v2, rebased 2026-06-10
// M1 = June 2026. Built against live pipeline: Art (active), Ryan/Iron Horse (confirmed,
// free case-study trade), CLC (verbal go), Union VP (board path), warm list.
// Champion model: domain experts learn AI from Kyle, become AI champions in their verticals.
// Floor: $4,500 audits, hard. Builds: per-project. Training: per-cohort/per-seat.

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
* { box-sizing: border-box; }
:root { --bg:#09090f; --bg-2:#14141f; --bg-3:#1c1c2c; --fg:#e8e9ed; --fg-dim:#8a8f9a; --fg-mute:#555a65; --border:#1f1f2c; --border-bright:#2c2c3e; --accent:#7c3aed; --accent-soft:#a78bfa; --accent-bg:rgba(124,58,237,0.08); --gate:#f0abfc; }
body,.root { margin:0; background:var(--bg); color:var(--fg); font-family:'Inter',sans-serif; font-size:14px; line-height:1.55; }
.root { min-height:100vh; background:radial-gradient(ellipse 70% 40% at 50% -10%, rgba(124,58,237,0.06), transparent 60%), var(--bg); padding:48px 24px 96px; }
.container { max-width:1180px; margin:0 auto; }
.header-grid { display:grid; grid-template-columns:1fr auto; gap:32px; align-items:end; padding-bottom:32px; border-bottom:1px solid var(--border); margin-bottom:36px; }
.kicker { font-size:11px; text-transform:uppercase; letter-spacing:0.24em; color:var(--accent); margin:0 0 16px; display:flex; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; }
.title-serif { font-family:'DM Serif Display',serif; font-size:clamp(48px,6.2vw,76px); line-height:0.96; letter-spacing:-0.025em; margin:0; font-weight:400; }
.title-serif em { color:var(--accent); font-style:italic; }
.title-sub { font-size:14.5px; color:var(--fg-dim); margin:18px 0 0; max-width:64ch; line-height:1.65; }
.meta { text-align:right; font-size:11px; color:var(--fg-dim); text-transform:uppercase; letter-spacing:0.14em; font-family:'JetBrains Mono',monospace; }
.meta strong { color:var(--fg); font-weight:500; }
.strip { display:grid; grid-template-columns:repeat(5,1fr); gap:1px; background:var(--border); border:1px solid var(--border); margin-bottom:36px; }
.strip-cell { padding:16px 18px; background:var(--bg-2); display:grid; gap:6px; }
.strip-label { font-size:9px; letter-spacing:0.2em; text-transform:uppercase; color:var(--fg-mute); font-family:'JetBrains Mono',monospace; }
.strip-value { font-family:'DM Serif Display',serif; font-style:italic; font-size:26px; color:var(--accent); line-height:1; }
.strip-note { font-size:11px; color:var(--fg-dim); line-height:1.45; }
.tradeoff { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--border); border:1px solid var(--border); margin-bottom:20px; }
.tradeoff-cell { padding:22px 24px; background:var(--bg-2); }
.tradeoff-label { font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:var(--accent); margin-bottom:12px; font-family:'JetBrains Mono',monospace; }
.tradeoff-text { font-size:14px; line-height:1.7; }
.tradeoff-text strong { font-weight:600; }
.principle { margin-bottom:36px; padding:16px 24px; border:1px dashed var(--border-bright); background:var(--accent-bg); font-family:'DM Serif Display',serif; font-style:italic; font-size:18px; color:var(--accent-soft); line-height:1.5; }
.principle-label { font-family:'JetBrains Mono',monospace; font-style:normal; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:var(--accent); margin-bottom:8px; display:block; }
.progress-wrap { margin-bottom:28px; padding:14px 20px; background:var(--bg-2); border:1px solid var(--border); position:sticky; top:20px; z-index:5; display:grid; grid-template-columns:1fr auto; gap:20px; align-items:center; }
.progress-bar { height:6px; background:var(--bg-3); position:relative; }
.progress-fill { position:absolute; inset:0 auto 0 0; background:var(--accent); transition:width 0.4s; }
.progress-meta { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--fg-dim); letter-spacing:0.1em; }
.progress-meta strong { color:var(--accent); font-weight:600; }
.quarters { display:grid; gap:14px; }
.quarter { border:1px solid var(--border); background:var(--bg-2); border-left:3px solid var(--accent); }
.quarter-head { padding:14px 20px; display:grid; grid-template-columns:auto 1fr auto; gap:16px; align-items:center; border-bottom:1px solid var(--border); cursor:pointer; user-select:none; }
.quarter-num { font-family:'DM Serif Display',serif; font-style:italic; font-size:30px; color:var(--accent); line-height:1; }
.quarter-title { font-size:15px; font-weight:600; }
.quarter-sub { font-size:11.5px; color:var(--fg-dim); margin-top:3px; }
.quarter-chevron { color:var(--fg-mute); transition:transform 0.2s; }
.quarter.open .quarter-chevron { transform:rotate(90deg); }
.month { padding:14px 20px; border-top:1px solid var(--border); }
.month-head { display:grid; grid-template-columns:auto 1fr auto; gap:14px; align-items:start; cursor:pointer; }
.month-num { font-family:'DM Serif Display',serif; font-style:italic; font-size:22px; color:var(--accent-soft); min-width:44px; }
.month-gate-label { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:0.2em; text-transform:uppercase; color:var(--gate); margin-bottom:4px; }
.month-gate-text { font-family:'DM Serif Display',serif; font-style:italic; font-size:16px; line-height:1.4; }
.month-check { width:18px; height:18px; border:1.5px solid var(--fg-mute); cursor:pointer; margin-top:4px; display:flex; align-items:center; justify-content:center; }
.month-check.done { background:var(--accent); border-color:var(--accent); color:var(--bg); }
.weeks { display:grid; gap:6px; margin-top:12px; padding-left:58px; }
.week { display:grid; grid-template-columns:32px 1fr 16px; gap:12px; align-items:start; padding:8px 10px; background:var(--bg-3); cursor:pointer; border-left:2px solid transparent; }
.week:hover { background:var(--bg); }
.week.done { border-left-color:var(--accent); opacity:0.65; }
.week.done .week-text { text-decoration:line-through; }
.week-label { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.12em; color:var(--accent); font-weight:600; }
.week-text { font-size:12.5px; line-height:1.5; }
.week-check { width:14px; height:14px; border:1.5px solid var(--fg-mute); display:flex; align-items:center; justify-content:center; }
.week.done .week-check { background:var(--accent); border-color:var(--accent); }
.claims { margin-top:40px; padding:24px; border:1px solid var(--border); background:var(--bg-2); font-size:12px; color:var(--fg-dim); line-height:1.75; }
.claims h4 { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.22em; color:var(--fg); text-transform:uppercase; margin:0 0 12px; }
.claims ul { margin:6px 0; padding-left:20px; }
.claims li { margin-bottom:6px; }
.claims strong { color:var(--fg); font-weight:600; }
@media (max-width:880px) { .strip{grid-template-columns:1fr 1fr;} .tradeoff,.header-grid{grid-template-columns:1fr;} .meta{text-align:left;} .weeks{padding-left:0;} }
`;

const QUARTERS = [
  {
    num:'Q1', title:'Foundation + champion deliveries', sub:'Jun → Aug 2026 · entity + insurance + two champions in delivery + exam passed',
    months:[
      { m:1, gate:'LLC filed · E&O in motion · Art + Ryan deliverables scoped · CLC + Union outreach live',
        weeks:[
          'Absorbed (Jun W1): Ryan/Iron Horse confirmed go. CLC verbal go. Pipeline logged.',
          'File IL LLC online ($150, 5-10 biz days — IL SOS). E&O broker outreach: require affirmative-AI rider, standard Tech E&O now carries absolute AI exclusions. CLC email + Union message sent.',
          'Art deliverable set scoped + locked (champion capability map + working tool, GUI/web only). Ryan case-study scope locked IN WRITING: free trade, deliverable boundaries, conversion gate to paid services.',
          'E&O bound or final quotes compared. CLC formal confirmation chased. CCA-F study blocks protected on calendar.',
        ]},
      { m:2, gate:'CCA-F exam Jul 20 · Art validated in a real showing · Ryan audit + profile delivered',
        weeks:[
          'Exam prep peak (D1 27% / D3 20% / D4 20% focus). Art delivery session #1.',
          'Exam prep peak. Ryan audit fieldwork + profile build.',
          'CCA-F exam — Jul 20. No client delivery scheduled this week. Zero credential claims until pass confirmed.',
          'Ryan audit + profile delivered. Art tool validated in a live showing. If exam passed: credential claims unlock across all surfaces.',
        ]},
      { m:3, gate:'Case studies #1-2 drafted · first PAID audit signed at $4,500 · concurrent-engagement cap set',
        weeks:[
          'Art case study drafted (anonymous — hard rule). Ryan case study drafted + permission conversation.',
          'Paid discovery calls from warm list (Grand Appliance, O\\'Toole\\'s, brother\\'s boss, Lafu/Joe). Floor held at $4,500 without hedging.',
          'First paid audit signed at $4,500. Kickoff scheduled.',
          'Q1 retro: revenue actual, floor integrity audit (exception list = Ryan only), concurrent-engagement cap decided BEFORE CLC + Union both land.',
        ]},
    ]},
  {
    num:'Q2', title:'Paid motion + institutions', sub:'Sep → Nov 2026 · CLC delivered · Union board path · floor proven on strangers',
    months:[
      { m:4, gate:'CLC workshop delivered · paid audit #1 delivered · case study #3',
        weeks:[
          'CLC workshop scoped + materials built (champion model framing).',
          'CLC workshop delivered. Attendee → pipeline capture.',
          'Paid audit #1 delivered. Case study #3 drafted.',
          'Union board-path milestone: proposal or presentation submitted.',
        ]},
      { m:5, gate:'Paid audit #2 signed · champion playbook v1 · Ryan conversion attempt',
        weeks:[
          'Paid audit #2 discovery + signed at floor.',
          'Champion playbook v1: the repeatable train-one-expert method documented as IP.',
          'Ryan conversion conversation: free case study → paid services for Iron Horse. Outcome logged either way.',
          'Audit #2 delivery W1. Pipeline review vs revenue trajectory.',
        ]},
      { m:6, gate:'Mid-cycle: 3+ paid engagements cumulative · training offer formalized per-cohort/per-seat',
        weeks:[
          'Audit #2 delivered. Case study #4.',
          'Training contract offer page: per-cohort + per-seat pricing built from CLC actuals.',
          'Union decision expected window: board outcome logged, next step either way.',
          'Mid-cycle retro: revenue actual vs target, capacity cap honored or violated, floor integrity.',
        ]},
    ]},
  {
    num:'Q3', title:'Builds + training contracts', sub:'Dec 2026 → Feb 2027 · second revenue line live · recurring shape visible',
    months:[
      { m:7, gate:'First build signed (per-project fee) · training cohort #1 scheduled',
        weeks:[
          'Build offer scoped from audit upsells: fixed deliverable, per-project fee.',
          'First build discovery + scope negotiation. In/out discipline.',
          'Build #1 signed. Kickoff.',
          'Training cohort #1 (CLC or Union) scheduled + curriculum locked.',
        ]},
      { m:8, gate:'Training cohort #1 delivered · build #1 in delivery',
        weeks:[
          'Build #1 delivery W1-2.',
          'Training cohort #1 delivery.',
          'Cohort retro + testimonials. Per-seat economics measured.',
          'Build #1 delivery W3. Mid-build scope-creep gate.',
        ]},
      { m:9, gate:'Build #1 delivered · 2nd training contract in negotiation · Load-Bearing cross-feed measured',
        weeks:[
          'Build #1 delivered + handoff. Case study captured.',
          'Training contract #2 pipeline (Union expansion or new institution).',
          'Load-Bearing → FF attribution check: which clients came through the newsletter.',
          'Q3 retro: three revenue lines live? Floor integrity. Cap integrity.',
        ]},
    ]},
  {
    num:'Q4', title:'Scale decision + Y2', sub:'Mar → May 2027 · capacity model proven · pricing review · Y2 service mix locked',
    months:[
      { m:10, gate:'Capacity model proven at cap · referral share ≥50% of new pipeline',
        weeks:[
          'Pipeline source audit: referral vs outbound share measured.',
          'Capacity model review: actual hours per engagement type vs assumptions.',
          'Highest-fit-only outreach posture for remaining Y1.',
          'Champion alumni check-in: are past champions generating referrals.',
        ]},
      { m:11, gate:'Pricing review complete · floor raise decision · Y2 service mix drafted',
        weeks:[
          'Pricing review: floor raise from $4,500? Decide with delivery-cost data, not vibes.',
          'Y2 service mix draft: audit/build/training weighting from actual margins.',
          'Contractor/channel leverage assessment (scale via contractors, not partners — hard rule).',
          'Y2 mix reviewed against Products + Memoir + Reading Room bandwidth.',
        ]},
      { m:12, gate:'Revenue actual vs target measured honestly · Y2 strategy locked',
        weeks:[
          'Y1 revenue actual vs carried $222K target. Honest delta analysis.',
          'Y2 strategy draft v2 with Q1-Q4 gates.',
          'Lane discipline retrospective: any day-job-separation, floor, or voice violations across the year.',
          'Y2 locked. Year-one closing reflection captured.',
        ]},
    ]},
];

export default function FlashFusionArc() {
  const [openQ, setOpenQ] = useState('Q1');
  const [openM, setOpenM] = useState(1);
  const [doneMonths, setDoneMonths] = useState(new Set());
  const [doneWeeks, setDoneWeeks] = useState(new Set(['1-1']));
  const pct = Math.round((doneWeeks.size/48)*100);
  const tM = m => setDoneMonths(p=>{const n=new Set(p); n.has(m)?n.delete(m):n.add(m); return n;});
  const tW = k => setDoneWeeks(p=>{const n=new Set(p); n.has(k)?n.delete(k):n.add(k); return n;});
  return (<>
    <style>{STYLE}</style>
    <div className="root"><div className="container">
      <div className="header-grid">
        <div>
          <p className="kicker"><Target size={12}/> FlashFusion // Revenue + Champion Arc · v2 rebased Jun 2026</p>
          <h1 className="title-serif">The <em>FlashFusion</em> Arc.</h1>
          <p className="title-sub">Twelve months. Champion model: train the domain expert, exit the dependency. Live pipeline encoded: Art active (anonymous), Ryan/Iron Horse confirmed as free case-study trade with conversion gate, CLC verbal, Union board path, warm list behind them. Entity + insurance gate every signature. The floor holds at $4,500 — the Ryan trade is a documented exception that sets no precedent.</p>
        </div>
        <div className="meta">
          <div>Lane <strong>FlashFusion</strong></div>
          <div style={{marginTop:4}}>Horizon <strong>Jun 2026 → May 2027</strong></div>
          <div style={{marginTop:4}}>Floor <strong>$4,500</strong> · exceptions: 1 (Ryan, documented)</div>
          <div style={{marginTop:4}}>Y1 target <strong>$222K carried</strong> · recalibrate Q1 retro</div>
        </div>
      </div>
      <div className="strip">
        <div className="strip-cell"><div className="strip-label">Q1</div><div className="strip-value">Foundation</div><div className="strip-note">LLC · E&O · exam · 2 champions</div></div>
        <div className="strip-cell"><div className="strip-label">Q2</div><div className="strip-value">Paid</div><div className="strip-note">CLC + audits at floor</div></div>
        <div className="strip-cell"><div className="strip-label">Q3</div><div className="strip-value">3 lines</div><div className="strip-note">audits + builds + training</div></div>
        <div className="strip-cell"><div className="strip-label">Q4</div><div className="strip-value">Scale</div><div className="strip-note">pricing + Y2 mix</div></div>
        <div className="strip-cell"><div className="strip-label">Cap</div><div className="strip-value">3 max</div><div className="strip-note">concurrent engagements (M3 decision)</div></div>
      </div>
      <div className="tradeoff">
        <div className="tradeoff-cell"><div className="tradeoff-label">What you gain</div><div className="tradeoff-text"><strong>Revenue runway</strong> on a real pipeline instead of a projected one. <strong>Champion-model proof</strong> — Art and Ryan are the model working in two different verticals at once. <strong>Defensible foundation</strong> — entity, insurance with AI coverage, and certification all land in Q1, so nothing built after rests on sand.</div></div>
        <div className="tradeoff-cell"><div className="tradeoff-label">What you give up</div><div className="tradeoff-text"><strong>Two free engagements running simultaneously</strong> (Art + Ryan) while paid revenue is zero — Q1 is investment, not income. <strong>July bandwidth</strong> — exam prep owns M2 and client delivery flexes around it. <strong>Exception comfort</strong> — Ryan's free trade is the second documented exception after his original $3K scope; the list cannot reach three.</div></div>
      </div>
      <div className="principle"><span className="principle-label">Operating principle</span>FlashFusion doesn't install AI in your business — it installs an AI expert in your team. Sell the floor, deliver beyond it, exit the dependency. Free work exists only as documented trades with written conversion gates.</div>
      <div className="progress-wrap"><div className="progress-bar"><div className="progress-fill" style={{width:`${pct}%`}}/></div><div className="progress-meta"><strong>{doneWeeks.size}</strong> / 48 weeks · {pct}% · M1 in progress</div></div>
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
          <li><strong>[SOURCED] LLC mechanics:</strong> IL Articles of Organization $150, online processing 5-10 business days, registered agent required (self-service permitted), $75 annual report due before anniversary month — June 2026 formation → first report due May 31, 2027. No franchise tax for IL LLCs. (IL SOS via llc.org / smallbizhandbook / fileforms, accessed 2026-06-10.)</li>
          <li><strong>[SOURCED] E&O reality:</strong> major carriers (Chubb, Travelers, CNA) have implemented absolute AI exclusions across standard Tech E&O forms in 2026; coverage for AI consulting requires an affirmative-AI rider or a standalone AI liability policy (Munich Re, Armilla, Mayflower Specialty, Embroker among providers; limits $2M-$50M). Insurers expect a documented AI risk-management posture; rider conditions can void coverage if unmet. (Honigman, Policyholder Pulse, Insuriam, Roots.ai, accessed 2026-06-10.) Bind BEFORE the first paid contract, not after.</li>
          <li><strong>[GENERATED] The $222K target is carried from the May plan, not revalidated.</strong> The service mix changed (audits/builds/training vs audit/sprint/retainer ladder). Recalibrate at Q1 retro with actual conversion data; until then it is a directional target, not a commitment.</li>
          <li><strong>The Ryan trade is exception #2 in spirit.</strong> Original documented exception: $3K personal-audit scope. Current: free audit + profile build as case study with conversion gate. Write the new boundary doc in M1 W3 — scope, deliverables, what conversion looks like, what it does NOT include. Two undocumented inches become a broken floor.</li>
          <li><strong>Art is anonymous publicly — hard rule.</strong> The case study ships vertical-described, never named. GUI/web only constraint on all Art deliverables.</li>
          <li><strong>CCA-F (Jul 20) owns M2.</strong> No credential claims of any kind until passed. If failed: claims stay locked, retake path planned at M2 retro, client work continues unaffected — the certification is leverage, not a gate on delivery.</li>
          <li><strong>Passive-inbound-only accounts (Sole Revival, the print store) are intentionally absent</strong> from every sprint. They appear nowhere in outreach lists by design.</li>
          <li><strong>Not modeled:</strong> Union board timeline (outside Kyle\\'s control), CLC procurement cycle, exam-failure replanning detail, day-job schedule collisions, the five-concurrent capacity scenario if everything lands at once — that is the M3 cap decision\\'s job.</li>
        </ul>
      </div>
    </div></div>
  </>);
}
