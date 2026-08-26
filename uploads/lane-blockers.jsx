import React, { useState, useMemo } from 'react';
import { Plus, Trash2, AlertTriangle, CheckCircle2, Eye } from 'lucide-react';

// LANE BLOCKERS — v2, 2026-06-10. WSJF-ranked blocker queue across four lanes.
// WSJF = (Lane Strategic Value + Time Criticality + Risk Reduction) / Job Size, Fibonacci 1-13.
// Seed list rebuilt from the Jun 10 state: Continuum + Base44 resolved, LLC/E&O/exam/Art/Ryan/
// CLC/Union/capacity live. Lafu reframed: warm pipeline (cstmprnt ERP, Joe decides), not partnership.
// Absorbs wsjf-prioritizer's function — that tool is deprecated-pending-merge.

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
*{box-sizing:border-box}
:root{--bg:#0b0b10;--bg2:#14141c;--bg3:#1c1c27;--fg:#e8e9ed;--dim:#8a8f9a;--mute:#555a65;--border:#22222e;
--ff:#7c3aed;--prod:#34d399;--mem:#b89968;--rr:#C8A86A;--x:#94a3b8;--warn:#f59e0b;--bad:#ef4444;--ok:#34d399}
body,.root{margin:0;background:var(--bg);color:var(--fg);font-family:'Inter',sans-serif;font-size:14px;line-height:1.5}
.root{min-height:100vh;padding:40px 24px 80px}
.container{max-width:1100px;margin:0 auto}
.kicker{font-size:10px;text-transform:uppercase;letter-spacing:.24em;color:var(--dim);font-family:'JetBrains Mono',monospace;margin:0 0 10px}
h1{font-size:30px;font-weight:700;letter-spacing:-.02em;margin:0 0 6px}
.sub{font-size:13px;color:var(--dim);max-width:74ch;margin:0 0 22px;line-height:1.6}
.row{border:1px solid var(--border);background:var(--bg2);border-left:3px solid var(--lc);padding:13px 16px;display:grid;grid-template-columns:64px 1fr auto;gap:14px;margin-bottom:8px;align-items:start}
.row.resolved{opacity:.45;border-left-color:var(--ok)}
.row.monitor{border-left-style:dashed}
.score{font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:600;color:var(--lc)}
.score-sub{font-size:9px;color:var(--mute);font-family:'JetBrains Mono',monospace;letter-spacing:.08em;margin-top:2px}
.b-title{font-size:13.5px;font-weight:600;line-height:1.4}
.b-lane{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.14em;color:var(--lc);margin-right:8px}
.b-detail{font-size:12px;color:var(--dim);margin-top:5px;line-height:1.6}
.b-detail strong{color:var(--fg)}
.btns{display:flex;gap:6px}
.ibtn{width:30px;height:30px;border:1px solid var(--border);background:var(--bg3);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--mute)}
.ibtn:hover{color:var(--fg)}
.section{font-size:11px;text-transform:uppercase;letter-spacing:.2em;font-family:'JetBrains Mono',monospace;color:var(--dim);margin:26px 0 12px}
.addbar{display:grid;grid-template-columns:1fr repeat(4,86px) auto auto;gap:8px;margin-bottom:8px}
.inp,.sel{background:var(--bg2);border:1px solid var(--border);color:var(--fg);padding:9px 12px;font-size:12.5px;font-family:'Inter',sans-serif}
.sel{font-family:'JetBrains Mono',monospace;font-size:11px}
.abtn{background:var(--bg3);border:1px solid var(--border);color:var(--fg);padding:9px 16px;font-size:12px;cursor:pointer;display:flex;gap:6px;align-items:center}
.claims{margin-top:26px;padding:20px;border:1px solid var(--border);background:var(--bg2);font-size:12px;color:var(--dim);line-height:1.75}
.claims h4{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.22em;color:var(--fg);text-transform:uppercase;margin:0 0 10px}
.claims ul{margin:4px 0;padding-left:18px}.claims li{margin-bottom:5px}
.claims strong{color:var(--fg)}
@media(max-width:860px){.addbar{grid-template-columns:1fr 1fr}.row{grid-template-columns:52px 1fr}}
`;

const LANE_COLORS = { FF:'var(--ff)', PROD:'var(--prod)', MEM:'var(--mem)', RR:'var(--rr)', CROSS:'var(--x)' };
const wsjf = b => b.status==='monitor' ? null : +( (b.lsv+b.tc+b.rr)/b.size ).toFixed(1);

const SEED = [
  { id:1, lane:'CROSS', title:'Form the LLC — this week', lsv:8, tc:13, rr:13, size:2, status:'open',
    detail:'IL Articles of Organization, file online: <strong>$150 fee, 5-10 business days processing</strong> (IL SOS). Registered agent required — self-service permitted. First annual report <strong>$75, due before the anniversary month: Jun 2026 formation → due May 31, 2027</strong>. No IL franchise tax for LLCs. Skip the $25 name reservation — search the database and file same-day. (Sources: llc.org, smallbizhandbook.com, fileforms.com, accessed 2026-06-10.) Gates every contract signature.' },
  { id:2, lane:'CROSS', title:'Bind E&O with affirmative AI coverage — this week, before any paid contract', lsv:8, tc:13, rr:13, size:3, status:'open',
    detail:'<strong>Standard Tech E&O no longer covers this business.</strong> Major carriers (Chubb, Travelers, CNA) implemented absolute AI exclusions across standard forms in 2026; regulators approved 80%+ of exclusion requests. Coverage requires an <strong>affirmative-AI rider or standalone AI liability policy</strong> — providers include Munich Re, Armilla, Mayflower Specialty, Embroker ($2M-$50M limits). Underwriters expect documented AI risk-management posture; unmet rider conditions can void coverage at claim time. (Sources: Honigman, Policyholder Pulse, Insuriam, Roots.ai, Embroker, accessed 2026-06-10.)' },
  { id:3, lane:'FF', title:'Union VP outreach — message goes out today', lsv:13, tc:8, rr:5, size:1, status:'open',
    detail:'Largest single potential engagement in the pipeline; path runs through board approval. Today\\'s message opens the path; the follow-up cadence belongs to FF M1 W2-W4.' },
  { id:4, lane:'FF', title:'CLC formal confirmation — email goes out today', lsv:8, tc:8, rr:5, size:1, status:'open',
    detail:'Verbal go in hand; formal confirmation expected. The email converts verbal to written. Workshop scoping starts only after written confirmation.' },
  { id:5, lane:'FF', title:'Concurrent-engagement capacity cap — decide before CLC + Union both land', lsv:8, tc:8, rr:13, size:2, status:'open',
    detail:'Five potential concurrent engagements (Art, Ryan, CLC, Union, warm list) against ~24 FF hrs/wk on top of the day job. Recommendation carried into FF arc M3: <strong>cap at 3 active</strong>. Deciding after they land isn\\'t deciding — it\\'s triage.' },
  { id:6, lane:'FF', title:'Art deliverables — created + scoped, validate in a real showing', lsv:13, tc:8, rr:8, size:3, status:'open',
    detail:'Champion #1, real estate. Deliverables exist and are scoped per Jun 10. Remaining: live-showing validation (FF M2 W4). Hard rules: anonymous publicly, GUI/web only.' },
  { id:7, lane:'FF', title:'Ryan deliverables — created + scoped; write the boundary doc', lsv:8, tc:8, rr:8, size:3, status:'open',
    detail:'Free audit + profile build as case-study trade, conversion gate to paid services. Deliverables scoped per Jun 10. <strong>Boundary doc still owed (FF M1 W3):</strong> scope edges, what conversion looks like, what the trade does NOT include. This is documented exception #2 against the $4,500 floor — the doc is what keeps it an exception.' },
  { id:8, lane:'FF', title:'CCA-F exam — July 20, hard deadline', lsv:8, tc:13, rr:8, size:8, status:'open',
    detail:'Score 3.6 ranks low because prep is a big job — but <strong>hard-deadline items override the sort</strong>. No credential claims anywhere until passed. M2 is built around this; client delivery flexes, the exam date doesn\\'t.' },
  { id:9, lane:'MEM', title:'Michael journal attorney review — M11 trigger, do not draft public-facing', lsv:8, tc:3, rr:13, size:3, status:'open',
    detail:'Highest legal risk in the memoir. Non-negotiable before any publication or query letter. Until then, journal material stays out of every public surface.' },
  { id:10, lane:'RR', title:'Load-Bearing platform decision — Substack / Ghost / self-hosted', lsv:5, tc:5, rr:5, size:2, status:'open',
    detail:'RR M1 W1-W2. Cheap to decide now, expensive to migrate later. Criteria: ownership of list, cost at 1K subs, friction per weekly post.' },
  { id:11, lane:'PROD', title:'claude-code-plugins-plus distribution decision', lsv:8, tc:5, rr:5, size:3, status:'open',
    detail:'244 plugins built, distribution pending. Products M1: decide marketplace listing vs launch post vs community seeding — criteria written before choosing. Framing rule: plugins catalogued, never "tools mastered."' },
  { id:12, lane:'PROD', title:'Abstrekkt brand identity — color, type, voice all undefined', lsv:5, tc:3, rr:8, size:5, status:'open',
    detail:'Blocks the Lane-2 permanent accent (emerald is interim), any parent-org external surface, and product page coherence. Products M3 owns it.' },
  { id:13, lane:'FF', title:'Floor integrity monitor — $4,500, exception list = Ryan only', lsv:0, tc:0, rr:0, size:1, status:'monitor',
    detail:'Standing monitor, not a task. Any discount conversation = stop, write the exception doc first or hold the floor. Lafu is <strong>warm pipeline</strong> (cstmprnt ERP interest; Joe decides) — a future paid prospect at the floor, not a partnership and not an exception.' },
  { id:14, lane:'PROD', title:'Continuum Supabase bill', lsv:0, tc:0, rr:0, size:1, status:'resolved',
    detail:'Resolved per Kyle, Jun 10. Kept for history.' },
  { id:15, lane:'CROSS', title:'Base44 connector + app verification', lsv:0, tc:0, rr:0, size:1, status:'resolved',
    detail:'Verified Jun 10: connector healthy, 49 apps listed; <strong>audit</strong> (audit.flashfusion.co), <strong>Continuum</strong>, and <strong>FlashFusion</strong> apps all present and reachable.' },
];

export default function LaneBlockers() {
  const [items, setItems] = useState(SEED);
  const [draft, setDraft] = useState({ title:'', lane:'FF', lsv:5, tc:5, rr:5, size:3 });
  const open = useMemo(()=>items.filter(i=>i.status==='open').sort((a,b)=>wsjf(b)-wsjf(a)),[items]);
  const monitors = items.filter(i=>i.status==='monitor');
  const resolved = items.filter(i=>i.status==='resolved');
  const add = () => { if(!draft.title.trim()) return;
    setItems(p=>[...p,{...draft,id:Date.now(),status:'open',detail:'Added in-session.'}]);
    setDraft({title:'',lane:'FF',lsv:5,tc:5,rr:5,size:3}); };
  const resolve = id => setItems(p=>p.map(i=>i.id===id?{...i,status:'resolved'}:i));
  const remove = id => setItems(p=>p.filter(i=>i.id!==id));
  const fib = [1,2,3,5,8,13];
  const Row = ({b}) => (
    <div className={`row ${b.status}`} style={{'--lc':LANE_COLORS[b.lane]}}>
      <div><div className="score">{b.status==='open'?wsjf(b):b.status==='monitor'?'—':'✓'}</div><div className="score-sub">{b.status==='open'?`(${b.lsv}+${b.tc}+${b.rr})/${b.size}`:b.status.toUpperCase()}</div></div>
      <div><div className="b-title"><span className="b-lane">{b.lane}</span>{b.title}</div><div className="b-detail" dangerouslySetInnerHTML={{__html:b.detail}}/></div>
      <div className="btns">
        {b.status==='open'&&<div className="ibtn" title="Resolve" onClick={()=>resolve(b.id)}><CheckCircle2 size={14}/></div>}
        <div className="ibtn" title="Remove" onClick={()=>remove(b.id)}><Trash2 size={14}/></div>
      </div>
    </div>);
  return (<>
    <style>{STYLE}</style>
    <div className="root"><div className="container">
      <p className="kicker">Execution layer // Lane Blockers · v2 · WSJF-ranked · seed rebuilt Jun 10 2026</p>
      <h1>What's actually in the way?</h1>
      <p className="sub">WSJF = (Strategic Value + Time Criticality + Risk Reduction) / Job Size, Fibonacci 1-13. Sorted by score — but hard-deadline items (the exam) override the sort, and monitors never leave the board. This tool absorbed the standalone WSJF prioritizer.</p>
      <div className="section"><AlertTriangle size={11} style={{verticalAlign:'-1px',marginRight:6}}/>Open — work top-down ({open.length})</div>
      {open.map(b=><Row key={b.id} b={b}/>)}
      <div className="section"><Eye size={11} style={{verticalAlign:'-1px',marginRight:6}}/>Standing monitors ({monitors.length})</div>
      {monitors.map(b=><Row key={b.id} b={b}/>)}
      <div className="section"><CheckCircle2 size={11} style={{verticalAlign:'-1px',marginRight:6}}/>Resolved ({resolved.length})</div>
      {resolved.map(b=><Row key={b.id} b={b}/>)}
      <div className="section">Add blocker</div>
      <div className="addbar">
        <input className="inp" placeholder="Blocker title…" value={draft.title} onChange={e=>setDraft(d=>({...d,title:e.target.value}))}/>
        <select className="sel" value={draft.lane} onChange={e=>setDraft(d=>({...d,lane:e.target.value}))}>{Object.keys(LANE_COLORS).map(l=><option key={l}>{l}</option>)}</select>
        {['lsv','tc','rr','size'].map(k=>(
          <select key={k} className="sel" value={draft[k]} onChange={e=>setDraft(d=>({...d,[k]:+e.target.value}))}>{fib.map(f=><option key={f} value={f}>{k.toUpperCase()} {f}</option>)}</select>))}
        <button className="abtn" onClick={add}><Plus size={13}/>Add</button>
      </div>
      <div className="claims">
        <h4>Claims, gaps, assumptions</h4>
        <ul>
          <li><strong>[SOURCED]</strong> LLC mechanics (IL SOS via llc.org / smallbizhandbook / fileforms) and E&O AI-exclusion landscape (Honigman, Policyholder Pulse, Insuriam, Roots.ai, Embroker) — all accessed 2026-06-10, cited inline above.</li>
          <li><strong>[GENERATED]</strong> All WSJF component scores are Kyle-judgment placeholders encoded by Claude from the Jun 10 state — adjust in-session; the formula is the contract, the numbers are opinions.</li>
          <li><strong>Status provenance:</strong> Continuum resolved + Ryan confirmed + deliverables-scoped statuses are Kyle-stated (Jun 10). Base44 health is tool-verified (Jun 10, 49 apps).</li>
          <li><strong>Lafu reframing is deliberate:</strong> the prior "partnership formalization" blocker encoded a co-founder that doesn\\'t exist. Current ruling: client/contact; cstmprnt ERP interest; Joe is the decision maker.</li>
          <li><strong>Not modeled:</strong> Union board timeline (external), CLC procurement speed, E&O underwriting turnaround, what happens if the exam and an E&O documentation request collide in July.</li>
          <li>State is local — resolved items vanish on reload. This is a triage surface, not a database.</li>
        </ul>
      </div>
    </div></div>
  </>);
}
