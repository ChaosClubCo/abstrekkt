import React, { useState } from 'react';
import { FileText, Users, Copy } from 'lucide-react';

// QUARTERLY SELF-BRIEFING — v2, 2026-06-10. Reading Room at Midnight aesthetic.
// Adapter system rebuilt: Self + 5 audience archetypes. The prior "Lafu — FF technical
// co-founder" adapter is removed: the FRAMING was wrong (Kyle is solo founder; Lafu is a
// client/contact — cstmprnt ERP interest, Joe decides), not the person. Live relationships
// map to archetypes: Art → Champion, Ryan → Case-Study, CLC → Institution, Union → Org-Board,
// Kelan → Partner-Candidate. DAVID: live per Kyle (Jun 10) but unidentified in project
// sources — assign an archetype when his engagement type is known. Not invented here.

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Crimson+Pro:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box}
:root{--bg:#1a1a1d;--bg2:#222226;--bg3:#2a2a2f;--fg:#e9e4da;--dim:#9a948a;--mute:#5f5a52;--border:#33322f;--brass:#C8A86A;--brass-dim:#8a7448}
body,.root{margin:0;background:var(--bg);color:var(--fg);font-family:'Crimson Pro',serif;font-size:16px;line-height:1.6}
.root{min-height:100vh;padding:48px 24px 90px;background:radial-gradient(ellipse 60% 35% at 50% -5%,rgba(200,168,106,.05),transparent 60%),var(--bg)}
.container{max-width:920px;margin:0 auto}
.kicker{font-family:'JetBrains Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:.26em;color:var(--brass);margin:0 0 14px}
h1{font-family:'Fraunces',serif;font-size:clamp(34px,4.6vw,52px);font-weight:400;letter-spacing:-.015em;margin:0 0 8px;line-height:1.05}
h1 em{color:var(--brass);font-style:italic}
.sub{font-size:15px;color:var(--dim);max-width:64ch;margin:0 0 30px;line-height:1.7}
.adapters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:26px}
.adapter{padding:9px 16px;border:1px solid var(--border);background:var(--bg2);font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.08em;color:var(--dim);cursor:pointer;user-select:none}
.adapter.active{border-color:var(--brass);color:var(--brass);background:rgba(200,168,106,.07)}
.card{border:1px solid var(--border);background:var(--bg2);padding:26px 30px;margin-bottom:14px}
.card-label{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:var(--brass-dim);margin-bottom:10px}
.card h3{font-family:'Fraunces',serif;font-size:21px;font-weight:600;margin:0 0 8px}
.card p{font-size:14.5px;color:var(--dim);line-height:1.75;margin:0 0 10px}
.card p strong{color:var(--fg)}
.sections{display:grid;gap:2px}
.sec{padding:14px 18px;background:var(--bg3);display:grid;grid-template-columns:26px 1fr;gap:14px;align-items:start}
.sec-n{font-family:'Fraunces',serif;font-style:italic;font-size:18px;color:var(--brass)}
.sec-t{font-size:14px;font-weight:600;font-family:'Fraunces',serif}
.sec-d{font-size:13px;color:var(--dim);margin-top:3px;line-height:1.65}
.note{margin-top:6px;padding:12px 16px;border-left:2px solid var(--brass-dim);background:var(--bg3);font-size:13px;color:var(--dim);font-style:italic;line-height:1.7}
.claims{margin-top:30px;padding:22px 26px;border:1px solid var(--border);background:var(--bg2);font-size:13px;color:var(--dim);line-height:1.8}
.claims h4{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.22em;color:var(--fg);text-transform:uppercase;margin:0 0 10px}
.claims ul{margin:4px 0;padding-left:18px}.claims li{margin-bottom:6px}
.claims strong{color:var(--fg)}
`;

const ADAPTERS = {
  self: { name:'SELF', who:'Kyle → Kyle, quarterly', register:'Unsparing. Numbers before narrative. The briefing exists to prevent self-deception, not to motivate.',
    sections:[
      ['Lane scorecard','Four lanes, gate pass/fail against the dashboard. No partial credit, no "basically done."'],
      ['Money, honestly','Revenue actual vs the carried $222K target. Floor integrity: exception list still = Ryan only? Pipeline real vs imagined.'],
      ['Rule audit','Run the seven structural checks from lane-balance. Any retired-brand leak, credential claim, day-job mention, anonymity break.'],
      ['Capacity truth','Hours actually spent per lane vs the allocator posture. Where the bio-cognitive schedule held and where it collapsed.'],
      ['Next quarter\\'s single bet','One sentence per lane. If a lane can\\'t produce the sentence, that\\'s the finding.'],
    ],
    note:'The Self briefing reads like the Reading Room at Midnight: a lamp, a ledger, no audience. Write it before reading any lane\\'s arc so memory testifies before the record corrects it.' },
  champion: { name:'CHAMPION', who:'Active delivery client — domain expert, AI novice. Live: Art (real estate; anonymous publicly; GUI/web only).', register:'Plain language, zero jargon. Capability framing: what they can now do that they couldn\\'t. Their business, not Kyle\\'s methods.',
    sections:[
      ['What you can now do','Capabilities gained this quarter, stated in their vertical\\'s language — listings, showings, clients. Not tools, outcomes.'],
      ['What we built together','Deliverables recap with the champion as co-author, because they were.'],
      ['Where you\\'re self-sufficient','The exit-the-dependency line: what no longer needs Kyle. Said proudly, not nervously.'],
      ['Next capability','One next skill or tool, scoped small. The champion chooses; Kyle recommends.'],
      ['The ask','Referral or testimonial ask, one sentence, only if the quarter earned it.'],
    ],
    note:'Hard rules ride along: Art is never named externally; deliverables stay GUI/web. The champion briefing is also the case-study draft in disguise — write it so anonymizing it takes ten minutes.' },
  casestudy: { name:'CASE-STUDY', who:'Trade engagement — free work for a named story. Live: Ryan / Iron Horse (audit + profile, conversion gate to paid).', register:'Generous but bounded. Every update restates scope edges politely. Conversion path visible, never pushy.',
    sections:[
      ['Delivered vs scoped','What shipped against the boundary doc. Anything outside scope is named as outside scope — even when given freely.'],
      ['The story so far','Case-study material captured this quarter: before/after, numbers, quotes. Permission status.'],
      ['What paid looks like','The conversion picture: what Iron Horse gets as a paying client that the trade doesn\\'t include. Stated every briefing, lightly.'],
      ['Boundary check','Scope-creep audit. The trade is documented exception #2 against the floor — the briefing is where it stays an exception.'],
      ['Next step','Either toward conversion or toward a clean, warm close. Both are wins; drift is the only loss.'],
    ],
    note:'If the boundary doc (FF M1 W3) isn\\'t written yet, the first section of this briefing cannot be filled honestly. That\\'s the tell.' },
  institution: { name:'INSTITUTION', who:'Education / training org. Live: College of Lake County (verbal go → formal confirmation).', register:'Outcomes and logistics. Cohort language. Procurement-friendly: deliverables, dates, costs, renewal path.',
    sections:[
      ['Outcomes delivered','Workshop/cohort results in their metrics: attendance, completion, skills demonstrated.'],
      ['What participants said','Curated feedback, verbatim where strong. Institutions renew on participant voice.'],
      ['Logistics record','Dates held, materials delivered, invoices clean. Boring on purpose — boring is trustworthy.'],
      ['Renewal path','Next cohort / next semester options with per-cohort and per-seat pricing stated plainly.'],
      ['Champion inside','Who at the institution is becoming the internal AI champion — the model travels here too.'],
    ],
    note:'CLC is also the template: this briefing format becomes the institutional product\\'s reporting layer. Write the first one as if it will be reused, because it will.' },
  board: { name:'ORG-BOARD', who:'Organization with board approval path. Live: Union (VP contact; member-value framing).', register:'Member value, risk posture, budget clarity. Short. Boards approve clarity, not enthusiasm.',
    sections:[
      ['Member value, one paragraph','What members gain, in members\\' terms. The only section that truly matters.'],
      ['Cost and structure','Pricing, schedule, commitment shape. No ranges where a number can stand.'],
      ['Risk and posture','Insurance status (E&O with affirmative AI coverage), entity status, data handling. Pre-answer the cautious board member.'],
      ['Proof','Case studies #1-2 (anonymous champion + named trade) and credential status — only what\\'s earned and claimable.'],
      ['The decision being asked','One explicit ask with a date. Boards stall on implied asks.'],
    ],
    note:'Until the CCA-F pass is confirmed, the Proof section says "preparing for certification" — nothing stronger ships. After Jul 20 (if passed), update everywhere at once.' },
  partner: { name:'PARTNER-CANDIDATE', who:'Potential collaborator under evaluation. Live: Kelan (per Kyle, Jun 10).', register:'Candid, structural, unromantic. Division of labor before vision. Prerequisites before commitments.',
    sections:[
      ['What the lanes are','Honest current state of all four lanes — a candidate evaluating in deserves the real picture, including the boring parts.'],
      ['The gap a partner fills','Specific functions, hours, and decisions a partner would own. If this can\\'t be written specifically, the conversation is premature.'],
      ['Prerequisites checklist','What must be true before anything formalizes: entity formed, engagement terms drafted, trial collaboration completed, exit terms sketched first.'],
      ['What this is not yet','Explicit non-commitments. Solo-founder status holds until a written agreement says otherwise.'],
      ['Next checkpoint','A dated next conversation with a defined question to answer.'],
    ],
    note:'The structure remembers the lesson: the prior briefing system encoded a co-founder who wasn\\'t one. Archetype first, title only after paper.' },
};

export default function QuarterlySelfBriefing() {
  const [active, setActive] = useState('self');
  const a = ADAPTERS[active];
  return (<>
    <style>{STYLE}</style>
    <div className="root"><div className="container">
      <p className="kicker">Execution layer // Quarterly Briefing · v2 · Self + 5 archetypes</p>
      <h1>The quarterly <em>briefing</em>.</h1>
      <p className="sub">One ritual, six registers. The Self briefing runs every quarter without exception; audience variants generate per relationship from the archetype that fits. Live mappings: Art → Champion, Ryan → Case-Study, CLC → Institution, Union → Org-Board, Kelan → Partner-Candidate.</p>
      <div className="adapters">
        {Object.entries(ADAPTERS).map(([k,v])=>(
          <div key={k} className={`adapter ${active===k?'active':''}`} onClick={()=>setActive(k)}>{v.name}</div>))}
      </div>
      <div className="card">
        <div className="card-label"><Users size={9} style={{verticalAlign:'-1px',marginRight:5}}/>Audience + register</div>
        <h3>{a.name}</h3>
        <p><strong>Who:</strong> {a.who}</p>
        <p><strong>Register:</strong> {a.register}</p>
      </div>
      <div className="card">
        <div className="card-label"><FileText size={9} style={{verticalAlign:'-1px',marginRight:5}}/>Template sections</div>
        <div className="sections">
          {a.sections.map((s,i)=>(
            <div key={i} className="sec"><div className="sec-n">{i+1}</div><div><div className="sec-t">{s[0]}</div><div className="sec-d">{s[1]}</div></div></div>))}
        </div>
        <div className="note">{a.note}</div>
      </div>
      <div className="claims">
        <h4>Claims, gaps, assumptions</h4>
        <ul>
          <li><strong>Why the Lafu adapter was removed:</strong> it framed Lafu as "FF technical co-founder." Current ruling (June project instructions): Kyle is solo founder; Lafu is a client/contact — cstmprnt ERP interest, Joe is the decision maker. The person stays in the pipeline (see lane-blockers floor monitor); the title was the error. If a collaboration ever formalizes on paper, the Partner-Candidate archetype is the on-ramp.</li>
          <li><strong>[GAP — David:</strong> named live by Kyle (Jun 10) but unidentified in any project source. No archetype assigned, no identity invented. When his engagement type is known — client vertical? institution? collaborator? — he maps to an existing archetype or earns a new one.]</li>
          <li><strong>[GENERATED]</strong> Archetype section structures are Claude-drafted from the engagement shapes; refine each after its first real use. Kelan\\'s "live" status is Kyle-stated (Jun 10) — the Partner-Candidate prerequisites checklist applies before any formalization.</li>
          <li>Aesthetic is Reading Room at Midnight by design — the content aesthetic, used internally; not a product surface.</li>
        </ul>
      </div>
    </div></div>
  </>);
}
