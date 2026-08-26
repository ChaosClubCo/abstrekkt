import React, { useState } from 'react';
import { Shuffle, ShieldAlert, Check, X } from 'lucide-react';

// LANE BALANCE — v2, 2026-06-10. Four lanes = 12 directed voice pairs + structural
// integrity checks. New this version: retired-brand leak check, credential-claim check,
// Ryan free-trade exception check. Day job genericized throughout.

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
*{box-sizing:border-box}
:root{--bg:#0b0b10;--bg2:#14141c;--bg3:#1c1c27;--fg:#e8e9ed;--dim:#8a8f9a;--mute:#555a65;--border:#22222e;
--ff:#7c3aed;--prod:#34d399;--mem:#b89968;--rr:#C8A86A;--warn:#f59e0b;--bad:#ef4444;--ok:#34d399}
body,.root{margin:0;background:var(--bg);color:var(--fg);font-family:'Inter',sans-serif;font-size:14px;line-height:1.55}
.root{min-height:100vh;padding:40px 24px 80px}
.container{max-width:1080px;margin:0 auto}
.kicker{font-size:10px;text-transform:uppercase;letter-spacing:.24em;color:var(--dim);font-family:'JetBrains Mono',monospace;margin:0 0 10px}
h1{font-size:30px;font-weight:700;letter-spacing:-.02em;margin:0 0 6px}
.sub{font-size:13px;color:var(--dim);max-width:72ch;margin:0 0 26px;line-height:1.65}
.section{font-size:11px;text-transform:uppercase;letter-spacing:.2em;font-family:'JetBrains Mono',monospace;color:var(--dim);margin:30px 0 12px}
.pairs{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pair{border:1px solid var(--border);background:var(--bg2);padding:14px 16px}
.pair-head{display:flex;align-items:center;gap:8px;margin-bottom:8px;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600}
.pair-arrow{color:var(--mute)}
.pair-risk{font-size:12px;color:var(--dim);line-height:1.6;margin-bottom:8px}
.pair-check{font-size:12px;line-height:1.55;padding:8px 10px;background:var(--bg3);border-left:2px solid var(--warn)}
.pair-check strong{font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--warn);display:block;margin-bottom:3px;font-family:'JetBrains Mono',monospace}
.checks{display:grid;gap:10px}
.check{border:1px solid var(--border);background:var(--bg2);padding:14px 16px;display:grid;grid-template-columns:1fr auto;gap:14px;align-items:center}
.check-q{font-size:13px;line-height:1.55}
.check-q strong{color:var(--fg)}
.check-sub{font-size:11px;color:var(--dim);margin-top:4px;line-height:1.5}
.check-btns{display:flex;gap:6px}
.cbtn{width:34px;height:34px;border:1px solid var(--border);background:var(--bg3);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--mute)}
.cbtn.pass{border-color:var(--ok);color:var(--ok);background:rgba(52,211,153,.08)}
.cbtn.fail{border-color:var(--bad);color:var(--bad);background:rgba(239,68,68,.08)}
.verdict{margin-top:20px;padding:16px 20px;border:1px solid;font-size:13px;line-height:1.6;display:flex;gap:10px;align-items:flex-start}
.claims{margin-top:28px;padding:20px;border:1px solid var(--border);background:var(--bg2);font-size:12px;color:var(--dim);line-height:1.75}
.claims h4{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.22em;color:var(--fg);text-transform:uppercase;margin:0 0 10px}
.claims strong{color:var(--fg)}
@media(max-width:820px){.pairs{grid-template-columns:1fr}}
`;

const L = { ff:{n:'FF',c:'var(--ff)'}, prod:{n:'PRODUCTS',c:'var(--prod)'}, mem:{n:'MEMOIR',c:'var(--mem)'}, rr:{n:'READING ROOM',c:'var(--rr)'} };

const PAIRS = [
  { a:'ff',b:'prod', risk:'Consulting authority bleeding into product copy — products start sounding like service pitches with feature lists.', check:'Does the product copy sell capability the product has, or expertise Kyle has?' },
  { a:'prod',b:'ff', risk:'Builder casualness bleeding into client deliverables — "shipped it, works on my machine" energy in a $4,500 audit.', check:'Would a stranger paying the floor read this as rigor?' },
  { a:'ff',b:'mem', risk:'Consultant framing colonizing the memoir — life events narrated as case studies with takeaways.', check:'Does this page have a lesson where it should have a scene?' },
  { a:'mem',b:'ff', risk:'Memoir interiority leaking into client copy — vulnerability as marketing. The construction story is not a sales asset.', check:'Is any client-facing line trading on the recovery-adjacent story?' },
  { a:'ff',b:'rr', risk:'Newsletter becoming a funnel — every essay bending toward "and that\\'s why audits matter."', check:'Could a reader finish this with zero idea Kyle sells anything?' },
  { a:'rr',b:'ff', risk:'Essayist hedging infecting proposals — "it depends, here are twelve angles" where a client needs one recommendation.', check:'Does the deliverable end in a decision?' },
  { a:'prod',b:'mem', risk:'Shipping cadence applied to chapters — word-count sprints producing draft-shaped filler.', check:'Was this written to be true or written to be done?' },
  { a:'mem',b:'prod', risk:'Literary preciousness applied to release notes and READMEs — three days on a changelog sentence.', check:'Is this surface load-bearing enough to deserve craft time?' },
  { a:'prod',b:'rr', risk:'Launch-thread voice in the newsletter — emoji cadence, hype verbs, "huge news" register.', check:'Does this read like the room or like a launch?' },
  { a:'rr',b:'prod', risk:'Essay-length explanation where a product needs a one-line value prop.', check:'Can the landing page be read in eight seconds?' },
  { a:'mem',b:'rr', risk:'Kinsley-frame intimacy leaking into public essays — addressing readers like family, oversharing past the line the memoir deliberately holds.', check:'Is anything here written for one reader appearing in front of hundreds?' },
  { a:'rr',b:'mem', risk:'Public-essay polish flattening the memoir — performing insight instead of excavating it.', check:'Does the chapter risk anything the newsletter wouldn\\'t?' },
];

const CHECKS = [
  { q:'Retired-brand leak: has ChaosClubCo or Chaos Collective appeared in ANY new external copy this cycle?', sub:'Hard rule. The names live in the history folder only. One leak = audit every surface shipped this cycle.' },
  { q:'Credential claim: has any surface claimed or implied CCA certification before a confirmed pass?', sub:'Exam is Jul 20. Until the pass is confirmed, the only honest phrasing is "preparing for" — nothing else ships.' },
  { q:'Floor integrity: is the exception list still exactly one entry (Ryan — free audit + profile, case-study trade, documented, conversion gate in writing)?', sub:'$4,500 floor. Two undocumented inches become a broken floor. Any new exception requires its own written boundary doc before work starts.' },
  { q:'Day-job separation: does any external surface name the employer, colleagues, or internal systems?', sub:'"A managed IT firm" is the ceiling. Applies to FF copy, newsletter, memoir, product pages, case studies — everything.' },
  { q:'Art anonymity: is the real-estate champion still vertical-described, never named, in every external mention?', sub:'Hard rule from the engagement terms. Includes screenshots, testimonials, and case-study drafts.' },
  { q:'Kinsley frame: has the letter-to-Kinsley register stayed inside the manuscript?', sub:'The frame is the memoir\\'s spine. It does not appear in the newsletter, FF content, or product surfaces.' },
  { q:'Peer-support drift: is the memoir still construction, not recovery testimony?', sub:'No recovery-community language, no sobriety-arc framing, no testimony register. Construction over Recovery is the thesis, not a euphemism.' },
];

export default function LaneBalance() {
  const [state, setState] = useState({});
  const set = (i,v) => setState(p=>({...p,[i]:p[i]===v?null:v}));
  const fails = Object.values(state).filter(v=>v==='fail').length;
  const answered = Object.values(state).filter(Boolean).length;
  return (<>
    <style>{STYLE}</style>
    <div className="root"><div className="container">
      <p className="kicker">Execution layer // Lane Balance · v2 · 12 voice pairs · 7 structural checks</p>
      <h1>Is each lane still itself?</h1>
      <p className="sub">Four lanes, four registers. Run monthly, or after any week where one lane went Full and the others starved. The voice pairs catch bleed; the structural checks catch rule violations. A fail isn't shame — it's a flag with a fix.</p>
      <div className="section">Directed voice pairs — where does A's register contaminate B?</div>
      <div className="pairs">
        {PAIRS.map((p,i)=>(
          <div key={i} className="pair">
            <div className="pair-head"><span style={{color:L[p.a].c}}>{L[p.a].n}</span><Shuffle size={11} className="pair-arrow"/><span style={{color:L[p.b].c}}>{L[p.b].n}</span></div>
            <div className="pair-risk">{p.risk}</div>
            <div className="pair-check"><strong>Check</strong>{p.check}</div>
          </div>))}
      </div>
      <div className="section">Structural integrity checks — pass/fail, no partial credit</div>
      <div className="checks">
        {CHECKS.map((c,i)=>(
          <div key={i} className="check">
            <div><div className="check-q">{c.q}</div><div className="check-sub">{c.sub}</div></div>
            <div className="check-btns">
              <div className={`cbtn ${state[i]==='pass'?'pass':''}`} onClick={()=>set(i,'pass')}><Check size={15}/></div>
              <div className={`cbtn ${state[i]==='fail'?'fail':''}`} onClick={()=>set(i,'fail')}><X size={15}/></div>
            </div>
          </div>))}
      </div>
      {answered===CHECKS.length && (
        <div className="verdict" style={{borderColor:fails?'var(--bad)':'var(--ok)',color:fails?'var(--bad)':'var(--ok)'}}>
          <ShieldAlert size={16}/>
          <div>{fails===0
            ? <span><strong>All structural checks pass.</strong> The lanes are themselves. Log the date and move.</span>
            : <span><strong>{fails} structural failure{fails>1?'s':''}.</strong> Each fail gets a same-week fix: identify the leaked surface, correct it, note what let it through. Structural fails outrank new output.</span>}</div>
        </div>)}
      <div className="claims">
        <h4>Claims, gaps, assumptions</h4>
        <strong>[GENERATED]</strong> Voice-pair risk descriptions are predictive, not observed — written from the lane registers, to be replaced by real examples as bleed actually happens. <strong>[SOURCED]</strong> Structural checks encode the June 2026 project rules verbatim in spirit: retired-brand ban, credential embargo until pass, $4,500 floor with single documented exception, day-job genericization, Art anonymity, Kinsley frame containment, construction-not-recovery thesis. New checks this version: retired-brand leak, credential claim. State is local; results belong in the quarterly briefing, not in this artifact.
      </div>
    </div></div>
  </>);
}
