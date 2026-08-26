import React, { useState, useMemo } from 'react';
import { Briefcase, Box, BookOpen, Lamp, AlertTriangle, RotateCcw } from 'lucide-react';

// LANE ALLOCATOR — v2, rebased 2026-06-10. Four lanes. Day job (~45 hrs, managed IT firm,
// never named) sits outside this budget. Bio-cognitive carried assumptions: Wednesday is
// the protected writing day; 7-11am is peak cognition. See cognitive-schedule-mapper
// (companion, pending merge into this tool) for the hour-grid version.

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
*{box-sizing:border-box}
:root{--bg:#0b0b10;--bg2:#14141c;--bg3:#1c1c27;--fg:#e8e9ed;--dim:#8a8f9a;--mute:#555a65;--border:#22222e;
--ff:#7c3aed;--prod:#34d399;--mem:#b89968;--rr:#C8A86A;--warn:#f59e0b;--bad:#ef4444}
body,.root{margin:0;background:var(--bg);color:var(--fg);font-family:'Inter',sans-serif;font-size:14px;line-height:1.55}
.root{min-height:100vh;padding:40px 24px 80px}
.container{max-width:1080px;margin:0 auto}
.kicker{font-size:10px;text-transform:uppercase;letter-spacing:.24em;color:var(--dim);font-family:'JetBrains Mono',monospace;margin:0 0 10px}
h1{font-size:30px;font-weight:700;letter-spacing:-.02em;margin:0 0 6px}
.sub{font-size:13px;color:var(--dim);max-width:70ch;margin:0 0 28px;line-height:1.65}
.lanes{display:grid;gap:12px;margin-bottom:24px}
.lane{border:1px solid var(--border);background:var(--bg2);border-left:3px solid var(--lc);padding:16px 18px;display:grid;grid-template-columns:auto 1fr auto;gap:16px;align-items:center}
.lane-icon{width:34px;height:34px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--lc)}
.lane-name{font-weight:600;font-size:14px}
.lane-note{font-size:11.5px;color:var(--dim);margin-top:2px}
.modes{display:flex;gap:6px}
.mode{padding:7px 14px;font-size:11px;font-family:'JetBrains Mono',monospace;letter-spacing:.08em;border:1px solid var(--border);background:var(--bg3);color:var(--dim);cursor:pointer;user-select:none}
.mode.active{border-color:var(--lc);color:var(--lc);background:transparent;font-weight:600}
.summary{border:1px solid var(--border);background:var(--bg2);padding:20px 22px;margin-bottom:20px}
.sum-row{display:grid;grid-template-columns:1fr auto;gap:16px;align-items:center;margin-bottom:14px}
.sum-total{font-family:'JetBrains Mono',monospace;font-size:26px;font-weight:600}
.sum-band{font-size:11px;font-family:'JetBrains Mono',monospace;letter-spacing:.12em;text-transform:uppercase;padding:5px 12px;border:1px solid}
.bar{height:24px;background:var(--bg3);display:flex;overflow:hidden}
.bar-seg{height:100%;transition:width .3s}
.legend{display:flex;gap:18px;margin-top:10px;flex-wrap:wrap}
.leg{font-size:11px;color:var(--dim);display:flex;align-items:center;gap:6px;font-family:'JetBrains Mono',monospace}
.dot{width:8px;height:8px}
.banner{display:flex;gap:10px;align-items:flex-start;padding:12px 16px;border:1px solid;font-size:12px;line-height:1.6;margin-bottom:20px}
.peaks{border:1px solid var(--border);background:var(--bg2);padding:18px 20px;margin-bottom:20px}
.peaks h3{font-size:11px;text-transform:uppercase;letter-spacing:.18em;font-family:'JetBrains Mono',monospace;color:var(--dim);margin:0 0 12px}
.peak{display:grid;grid-template-columns:auto 1fr;gap:12px;padding:8px 0;border-bottom:1px solid var(--border);font-size:12.5px}
.peak:last-child{border-bottom:none}
.peak-tag{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--lc2);min-width:120px;letter-spacing:.06em}
.claims{margin-top:28px;padding:20px;border:1px solid var(--border);background:var(--bg2);font-size:12px;color:var(--dim);line-height:1.75}
.claims h4{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.22em;color:var(--fg);text-transform:uppercase;margin:0 0 10px}
.claims ul{margin:4px 0;padding-left:18px}.claims li{margin-bottom:5px}
.claims strong{color:var(--fg)}
.reset{display:inline-flex;gap:6px;align-items:center;font-size:11px;color:var(--dim);border:1px solid var(--border);background:none;padding:6px 12px;cursor:pointer;font-family:'JetBrains Mono',monospace}
@media(max-width:760px){.lane{grid-template-columns:1fr}.modes{flex-wrap:wrap}}
`;

const LANES = [
  { id:'ff', name:'FlashFusion', icon:Briefcase, color:'var(--ff)', hex:'#7c3aed',
    note:'Revenue critical path. Art active + Ryan case-study trade + CLC/Union pipeline. Exam owns July.',
    full:24, maint:8 },
  { id:'prod', name:'Abstrekkt Products', icon:Box, color:'var(--prod)', hex:'#34d399',
    note:'244-plugin distribution + Ample/FissionPrompt definition gates. Interim accent pending brand v1.',
    full:12, maint:4 },
  { id:'mem', name:'Memoir', icon:BookOpen, color:'var(--mem)', hex:'#b89968',
    note:'Construction over Recovery. Excavation → draft. Wednesday is the protected writing day.',
    full:12, maint:4 },
  { id:'rr', name:'Reading Room', icon:Lamp, color:'var(--rr)', hex:'#C8A86A',
    note:'Load-Bearing newsletter spine. Weekly cadence is the unit of survival — maintenance still ships.',
    full:6, maint:3 },
];
const MODES = [ {id:'full',label:'FULL'}, {id:'maint',label:'MAINT'}, {id:'pause',label:'PAUSE'} ];
const hoursFor = (lane,mode) => mode==='full'?lane.full:mode==='maint'?lane.maint:0;

const PEAKS = [
  { tag:'FF · M2 (Jul)', text:'CCA-F exam Jul 20 + Art showing validation + Ryan delivery. Cross-lane peak: Products launch ships light, Memoir drops to maintenance, RR pre-writes two posts.' },
  { tag:'FF · M3 (Aug)', text:'First paid audit close + two case studies. FF Full mandatory; capacity-cap decision due before CLC + Union both land.' },
  { tag:'PROD · M2 W1 (Jul)', text:'Plugins-plus launch day — deliberately light (post + outreach only). Exam wins any conflict.' },
  { tag:'MEM · M4 (Sep)', text:'Opening chapter drafting — voice lock requires Full or honest deferral; half-attention drafting poisons the voice.' },
  { tag:'RR · M1 (Jun)', text:'Platform decision + first posts. Cheap to start now, expensive to restart later.' },
  { tag:'ALL · M12 (May 27)', text:'Four lane retros + Y2 locks stack in one month. Pre-stagger: Products M11, RR M11 W4.' },
];

export default function LaneAllocator() {
  const [modes, setModes] = useState({ ff:'full', prod:'maint', mem:'maint', rr:'maint' });
  const total = useMemo(()=>LANES.reduce((s,l)=>s+hoursFor(l,modes[l.id]),0),[modes]);
  const band = total<=30?{label:'LIGHT',color:'var(--prod)'}:total<=45?{label:'BALANCED',color:'var(--warn)'}:total<=55?{label:'AGGRESSIVE',color:'var(--bad)'}:{label:'FICTION',color:'var(--bad)'};
  const ffPaused = modes.ff==='pause';
  const allFull = Object.values(modes).every(m=>m==='full');
  return (<>
    <style>{STYLE}</style>
    <div className="root"><div className="container">
      <p className="kicker">Execution layer // Lane Allocator · v2 · 4 lanes · rebased Jun 2026</p>
      <h1>Where do the hours go this cycle?</h1>
      <p className="sub">Side-project budget on top of a ~45-hour day job (managed IT firm — never named in lane copy). Default posture: FlashFusion Full, everything else Maintenance = 35 hrs, Balanced. Wednesday belongs to the Memoir; 7-11am is peak cognition — spend it on creation, not email.</p>
      <div className="lanes">
        {LANES.map(l=>{const I=l.icon;return (
          <div key={l.id} className="lane" style={{'--lc':l.color}}>
            <div className="lane-icon"><I size={16}/></div>
            <div><div className="lane-name">{l.name} <span style={{fontFamily:'JetBrains Mono',fontSize:10,color:'var(--mute)'}}>· full {l.full}h · maint {l.maint}h</span></div><div className="lane-note">{l.note}</div></div>
            <div className="modes">{MODES.map(m=>(
              <div key={m.id} className={`mode ${modes[l.id]===m.id?'active':''}`} style={{'--lc':l.color}} onClick={()=>setModes(p=>({...p,[l.id]:m.id}))}>{m.label}</div>
            ))}</div>
          </div>);})}
      </div>
      <div className="summary">
        <div className="sum-row">
          <div className="sum-total">{total} <span style={{fontSize:13,color:'var(--dim)'}}>hrs/week side-project load</span></div>
          <div className="sum-band" style={{color:band.color,borderColor:band.color}}>{band.label}</div>
        </div>
        <div className="bar">{LANES.map(l=>{const h=hoursFor(l,modes[l.id]);return h>0&&<div key={l.id} className="bar-seg" style={{width:`${(h/Math.max(total,1))*100}%`,background:l.hex}}/>;})}</div>
        <div className="legend">{LANES.map(l=>(<div key={l.id} className="leg"><div className="dot" style={{background:l.hex}}/>{l.name} {hoursFor(l,modes[l.id])}h</div>))}</div>
      </div>
      {ffPaused && <div className="banner" style={{borderColor:'var(--bad)',color:'var(--bad)'}}><AlertTriangle size={16}/><div><strong>FlashFusion is paused.</strong> It is the revenue critical path with two live engagements (Art, Ryan) and two institutions in motion (CLC, Union). Pausing it needs a written reason, not a mood.</div></div>}
      {allFull && <div className="banner" style={{borderColor:'var(--warn)',color:'var(--warn)'}}><AlertTriangle size={16}/><div><strong>All four lanes Full = 54 hrs on top of the day job.</strong> That is the Aggressive ceiling. Historical pattern says this posture collapses into all-lane stall within 3 weeks. Pick what drops.</div></div>}
      <div className="peaks">
        <h3>Known peak collisions (rebased Jun 2026 → May 2027)</h3>
        {PEAKS.map((p,i)=>(<div key={i} className="peak"><div className="peak-tag" style={{'--lc2':'var(--dim)'}}>{p.tag}</div><div>{p.text}</div></div>))}
      </div>
      <button className="reset" onClick={()=>setModes({ff:'full',prod:'maint',mem:'maint',rr:'maint'})}><RotateCcw size={12}/> Reset to default posture</button>
      <div className="claims">
        <h4>Claims, gaps, assumptions</h4>
        <ul>
          <li><strong>[GENERATED] Hour budgets are planning estimates,</strong> not measured actuals. Full/Maint numbers carry from the May model; revise after 4 weeks of real tracking.</li>
          <li><strong>[CARRIED] Bio-cognitive schedule</strong> (Wednesday writing day, 7-11am peak) carries from the prior project description; reconfirm it still matches reality.</li>
          <li><strong>Day job is genericized by rule</strong> — "managed IT firm," never named, in every lane surface. ~45 hrs assumed, not tracked here.</li>
          <li><strong>Maintenance ≠ pause.</strong> RR maintenance still ships weekly (cadence is the lane's survival unit); Memoir maintenance is notes-capture only; Products maintenance is marketplace triage only.</li>
          <li><strong>Pending merge:</strong> cognitive-schedule-mapper (hour-grid energy model) merges into this tool — it fills the energy-variation gap this allocator names but does not model.</li>
          <li><strong>Not modeled:</strong> day-job overtime spikes, family weeks, the five-concurrent-client scenario (that is the FF M3 cap decision), exam-week zero-output reality.</li>
        </ul>
      </div>
    </div></div>
  </>);
}
