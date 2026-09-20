/* audit-views.jsx — Abstrekkt forensic audit of the 48-page journal corpus vs the Jun 6 state sweep.
   Three presentation treatments rendered as design-canvas artboards.
   Exports to window: AuditLedger, AuditTriage, AuditIndex, AUDIT. */

const T = {
  bg:'#0A0A0C', panel:'#131315', low:'#1c1b1d', card:'#201f21', high:'#2a2a2c',
  ivory:'#e5e1e4', warm:'#d4c5ab', outline:'#9c8f78', ghost:'rgba(80,69,50,.4)',
  amber:'#ffbf00', amberSoft:'#ffe2ab', blue:'#a9c7ff', cyan:'#00f0ff',
  error:'#ffb4ab', errFill:'#93000a',
  garamond:"'EB Garamond', Georgia, serif",
  lit:"'Literata', Georgia, serif",
  mono:"'JetBrains Mono', ui-monospace, monospace",
  grotesk:"'Space Grotesk', sans-serif",
};

const SEV = {
  HIGH: { c:T.error, label:'HIGH' },
  MED:  { c:T.amber, label:'MED' },
  LOW:  { c:T.blue,  label:'LOW' },
  CLEAR:{ c:T.outline, label:'CLEAR' },
};

const AUDIT = {
  date: '2026-06-23',
  ref: 'STATE SWEEP — JUN 6 2026',
  scanned: 95,
  corpus: 48,
  flagged: 20,
  clean: 28,
  categories: [
    {
      code: 'F-01', sev:'HIGH',
      title: 'kylerosebrook.com — dead domain',
      truth: 'Confirmed Jun 3: kylerosebrook.com does not exist. The personal byline resolves to abstrekkt.com. Every reference below points at a domain that returns nothing.',
      fix: 'Replace each kylerosebrook.com URL, label, and email with abstrekkt.com — or strike the link entirely.',
      groups: [
        { tag:'LIVE LINK · dead href', pages:[
            'The Logic You Outsource', 'Your AI Problem Isn\u2019t the Model', 'Regeneration Era Article' ] },
        { tag:'DEAD CONTACT · mailto:hello@', pages:[
            'Augmentors', 'Best Code Never Wrote', 'Moving to Base44', 'Pre-Flight Checklist',
            'Security Checklist', 'Seven Hidden Gems', 'Shipping in Public', 'Three Small Habits' ] },
        { tag:'STALE LABEL · footer / byline text', pages:[
            'Reading the Room', 'Reading the Process', 'Reading the System', 'Reading the Pattern',
            'Reading the Org', 'Knowledge Worker Reclassified', 'Still Behind in AI', 'The AI Race',
            'Security Checklist · /preflight' ] },
      ],
    },
    {
      code: 'F-02', sev:'MED',
      title: '\u201CChaos Club Co.\u201D / \u201Cpeer support\u201D — pre-rebrand framing',
      truth: 'Project has rebranded to Abstrekkt (the Regeneration Era bio already reads \u201CAbstrekkt Co.\u201D). The May 2026 pivot moved off the \u201Cpeer support platform\u201D framing in seed data.',
      fix: 'Reconcile the company name \u2192 Abstrekkt and decide whether the peer-support classification still describes the entity. Note: in the LLC kit the peer-support language is legally load-bearing (Illinois AI Mental Health Act) — change it with counsel, not blindly.',
      groups: [
        { tag:'IN CORPUS', pages:['The Logic You Outsource · bio \u201CAI enablement and peer support\u201D'] },
        { tag:'ADJACENT · toolkit', pages:['LLC Formation Kit · entire \u201CChaos Club Co. LLC\u201D track'] },
      ],
    },
    {
      code: 'F-03', sev:'MED',
      title: '\u201CSales team (Kelan) fully trained\u201D — stale person + claim',
      truth: 'Kelan is a stale co-founder / contact candidate (blind-spot map). No trained sales team is confirmed; presenting one overstates current state.',
      fix: 'Remove or soften — state actual sales readiness; drop the named, untrained \u201Cteam.\u201D',
      groups: [
        { tag:'ADJACENT · FlashFusion set', pages:['FlashFusion \u2014 Anthropic Partner Narrative'] },
      ],
    },
    {
      code: 'F-04', sev:'LOW',
      title: 'Skill / repo counts cited as canonical',
      truth: 'No canonical figure exists — skills appear as 50 / 53 / 65 / 132 across surfaces; repos as 591 / 628. The sweep\u2019s ruling: pick a per-surface number, stop citing one global figure.',
      fix: 'Soften to point-in-time / personal framing or \u201CX+\u201D. The Blueprint\u2019s \u201C50 skills\u201D is defensible as a personal count — just don\u2019t treat it as fact-of-record.',
      groups: [
        { tag:'IN CORPUS', pages:['Claude Code Blueprint · \u201C50 skills\u201D \u00D74', 'Regeneration Era Article · \u201C591\u201D repos'] },
      ],
    },
    {
      code: 'C-00', sev:'CLEAR',
      title: 'Cleared — checked, no change needed',
      truth: 'Flags that the scan raised but the read cleared. Logged so the next audit doesn\u2019t re-open them.',
      fix: '',
      groups: [
        { tag:'FALSE POSITIVE', pages:['Moving in Silence · \u201Cteach staff engineers\u201D = Kyle teaching them, not claiming the title'] },
        { tag:'CONTAINED', pages:['Chris Butler · purged from all 48 — lingers only in tools/11-client-dashboard.html (fix the tool; corpus is clean)'] },
        { tag:'ABSENT FROM CORPUS', pages:['INT \u201Cfirm okayed\u201D · not in any of the 48', 'Skill 53/65/132 + repo 628 · not in any of the 48'] },
      ],
    },
  ],
};

/* full roster of the 48, ordered, with the finding code(s) that hit each */
const ROSTER = [
  ['Augmentors','F-01'],['AI as a Search Engine',''],['Best Code Never Wrote','F-01'],
  ['Claude Code Blueprint','F-04'],['Claude Slot Machine',''],['HR Skills Intelligence',''],
  ['Knowledge Worker Reclassified','F-01'],['MSP AI Playbook Is Fiction',''],['Moving in Silence','C'],
  ['Moving to Base44','F-01'],['Multimodal AI',''],['Pre-Flight Checklist','F-01'],
  ['Prompt Engineering Diagnosis',''],['Reading the Org','F-01'],['Reading the Pattern','F-01'],
  ['Reading the Process','F-01'],['Reading the Room','F-01'],['Reading the System','F-01'],
  ['Sales Page vs Setup',''],['Security Checklist','F-01'],['Seven Hidden Gems','F-01'],
  ['Shipping in Public','F-01'],['Still Behind in AI','F-01'],['The AI Race','F-01'],
  ['The Floor Isn\u2019t the Code',''],['The Logic You Outsource','F-01·F-02'],['The Real MSP AI Moat',''],
  ['The U-Curve',''],['Three Small Habits','F-01'],['Vibe Coding',''],
  ['Your AI Problem Isn\u2019t the Model','F-01'],['Your Files Are a Mess',''],['48 Viral Prompts',''],
  ['KR Case · AI Is a Mirror',''],['KR Case · Blockbuster',''],['KR Case · Systems Over Hacks',''],
  ['KR Case · Theory of Explanatory Depth',''],['KR Essay · Build for Asymmetry',''],
  ['KR Essay · Mental Models',''],['KR Essay · Theory of Explanatory Depth',''],
  ['KR Essay · Shape of a Thought',''],['Load-Bearing · Ninety Days',''],['Load-Bearing · Make vs n8n',''],
  ['Load-Bearing · MCPs That Earned',''],['Load-Bearing · Stack Falls Over',''],
  ['Regeneration Era Article','F-01·F-04'],['Sedona · The Meditation Pivot',''],['KR Mentor · Setup & Security',''],
];

/* ---------- shared bits ---------- */
function Grain() {
  return (
    <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:.04,pointerEvents:'none',mixBlendMode:'overlay'}} aria-hidden="true">
      <filter id="agrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/></filter>
      <rect width="100%" height="100%" filter="url(#agrain)"/>
    </svg>
  );
}
function Pill({sev}) {
  const s = SEV[sev];
  return <span style={{fontFamily:T.mono,fontSize:10,letterSpacing:'.14em',color:s.c,
    border:`1px solid ${s.c}55`,padding:'2px 8px',borderRadius:9999,whiteSpace:'nowrap'}}>{s.label}</span>;
}
function Frame({children, w, pad=40}) {
  return (
    <div style={{width:w,background:T.bg,position:'relative',overflow:'hidden',
      fontFamily:T.lit,color:T.ivory,boxShadow:'inset 0 0 0 1px rgba(255,255,255,.06)'}}>
      <Grain/>
      <div style={{position:'relative',padding:pad}}>{children}</div>
    </div>
  );
}
function Kicker({children}) {
  return <div style={{fontFamily:T.mono,fontSize:11,letterSpacing:'.22em',textTransform:'uppercase',color:T.outline}}>{children}</div>;
}

/* ---------- VIEW A — THE LEDGER ---------- */
function AuditLedger() {
  return (
    <Frame w={1120} pad={48}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:24,
        borderBottom:`1px solid ${T.ghost}`,paddingBottom:22,marginBottom:30}}>
        <div>
          <Kicker>Forensic Audit · The Ledger</Kicker>
          <h1 style={{fontFamily:T.garamond,fontWeight:500,fontSize:42,lineHeight:1.05,letterSpacing:'-.02em',margin:'14px 0 8px',color:T.ivory}}>
            The 48, against current.</h1>
          <div style={{fontFamily:T.garamond,fontStyle:'italic',fontSize:18,color:T.warm,maxWidth:620}}>
            Every published journal page cross-examined against the June&nbsp;6 state sweep. Stale claims, dead links, pre-rebrand framing — flagged, with the correction.</div>
        </div>
        <div style={{textAlign:'right',fontFamily:T.mono,fontSize:11,color:T.outline,lineHeight:1.9,whiteSpace:'nowrap'}}>
          <div>REF · {AUDIT.ref}</div>
          <div>RUN · {AUDIT.date}</div>
          <div style={{color:T.warm}}>SCANNED · {AUDIT.scanned} pages</div>
          <div style={{color:T.amber}}>CORPUS · {AUDIT.corpus} · FLAGGED {AUDIT.flagged} · CLEAN {AUDIT.clean}</div>
        </div>
      </div>

      {AUDIT.categories.map((cat) => (
        <div key={cat.code} style={{display:'grid',gridTemplateColumns:'88px 1fr',gap:24,
          padding:'24px 0',borderTop:`1px solid ${T.ghost}`}}>
          <div>
            <div style={{fontFamily:T.mono,fontSize:13,color:cat.sev==='CLEAR'?T.outline:SEV[cat.sev].c,fontWeight:600}}>{cat.code}</div>
            <div style={{marginTop:8}}><Pill sev={cat.sev}/></div>
          </div>
          <div>
            <h2 style={{fontFamily:T.garamond,fontWeight:600,fontSize:24,letterSpacing:'-.01em',margin:'0 0 8px',color:cat.sev==='CLEAR'?T.warm:T.ivory}}>{cat.title}</h2>
            <p style={{fontFamily:T.lit,fontSize:15,lineHeight:1.6,color:T.warm,margin:'0 0 6px',maxWidth:880}}>{cat.truth}</p>
            {cat.fix && <p style={{fontFamily:T.lit,fontSize:15,lineHeight:1.6,margin:'0 0 16px',maxWidth:880}}>
              <span style={{fontFamily:T.mono,fontSize:11,letterSpacing:'.12em',color:T.amber,marginRight:10}}>FIX</span>
              <span style={{color:T.ivory}}>{cat.fix}</span></p>}
            <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:cat.fix?2:14}}>
              {cat.groups.map((g,i)=>(
                <div key={i} style={{display:'grid',gridTemplateColumns:'200px 1fr',gap:18,alignItems:'baseline'}}>
                  <div style={{fontFamily:T.mono,fontSize:10.5,letterSpacing:'.1em',color:T.outline,paddingTop:3}}>{g.tag}</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'7px 8px'}}>
                    {g.pages.map((p,j)=>(
                      <span key={j} style={{fontFamily:T.lit,fontSize:13.5,color:cat.sev==='CLEAR'?T.warm:T.ivory,
                        background:T.low,border:`1px solid ${T.ghost}`,borderRadius:4,padding:'4px 9px'}}>{p}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </Frame>
  );
}

/* ---------- VIEW B — TRIAGE DOSSIER ---------- */
function AuditTriage() {
  const order = [
    ['1','F-01','Purge kylerosebrook.com','HIGH','20 hits · global find-and-replace \u2192 abstrekkt.com'],
    ['2','F-03','Drop the \u201CKelan\u201D sales claim','MED','1 page · overstated, named, unverified'],
    ['3','F-02','Reconcile \u201CChaos Club\u201D \u2192 Abstrekkt','MED','2 surfaces · LLC kit needs counsel'],
    ['4','F-04','Soften skill / repo counts','LOW','2 pages · \u201CX+\u201D / point-in-time'],
  ];
  return (
    <Frame w={720} pad={44}>
      <Kicker>Triage Dossier</Kicker>
      <h1 style={{fontFamily:T.garamond,fontWeight:500,fontSize:38,lineHeight:1.05,letterSpacing:'-.02em',margin:'14px 0 18px'}}>
        What to fix, in order.</h1>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,background:T.ghost,
        border:`1px solid ${T.ghost}`,marginBottom:28}}>
        {[['SCANNED',AUDIT.scanned,T.warm],['FLAGGED',AUDIT.flagged,T.amber],['CLEAN',AUDIT.clean,T.blue]].map(([k,v,c],i)=>(
          <div key={i} style={{background:T.bg,padding:'18px 16px'}}>
            <div style={{fontFamily:T.garamond,fontSize:40,fontWeight:600,color:c,lineHeight:1}}>{v}</div>
            <div style={{fontFamily:T.mono,fontSize:10,letterSpacing:'.18em',color:T.outline,marginTop:6}}>{k}</div>
          </div>
        ))}
      </div>

      <div style={{fontFamily:T.mono,fontSize:10.5,letterSpacing:'.16em',color:T.outline,marginBottom:12}}>RECOMMENDED SEQUENCE</div>
      <div style={{display:'flex',flexDirection:'column'}}>
        {order.map((r,i)=>(
          <div key={i} style={{display:'grid',gridTemplateColumns:'34px 1fr auto',gap:14,alignItems:'center',
            padding:'15px 0',borderTop:`1px solid ${T.ghost}`}}>
            <div style={{fontFamily:T.garamond,fontSize:26,color:T.outline}}>{r[0]}</div>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontFamily:T.mono,fontSize:10.5,color:SEV[r[3]].c}}>{r[1]}</span>
                <span style={{fontFamily:T.garamond,fontSize:19,fontWeight:600,color:T.ivory}}>{r[2]}</span>
              </div>
              <div style={{fontFamily:T.lit,fontSize:13,color:T.warm,marginTop:3}}>{r[4]}</div>
            </div>
            <Pill sev={r[3]}/>
          </div>
        ))}
      </div>

      <div style={{marginTop:26,paddingTop:18,borderTop:`1px solid ${T.ghost}`,
        fontFamily:T.lit,fontSize:13.5,lineHeight:1.6,color:T.warm}}>
        <span style={{fontFamily:T.mono,fontSize:10.5,letterSpacing:'.12em',color:T.blue,marginRight:8}}>CLEARED</span>
        Butler is purged from all 48 (only the client-dashboard tool still names him). \u201CStaff engineer\u201D in <em>Moving in Silence</em> is teaching, not a self-title. INT \u201Cfirm okayed\u201D never reached the corpus.
      </div>
    </Frame>
  );
}

/* ---------- VIEW C — STATUS INDEX ---------- */
function AuditIndex() {
  const codeColor = (c)=> c==='' ? T.outline : c==='C' ? T.blue : c.startsWith('F-04') ? T.blue : T.error;
  const isClean = (c)=> c==='' || c==='C';
  return (
    <Frame w={940} pad={44}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:6}}>
        <Kicker>Per-Page Status Index</Kicker>
        <div style={{fontFamily:T.mono,fontSize:10.5,color:T.outline}}>
          <span style={{color:T.error}}>\u25A0</span> flagged&nbsp;&nbsp;
          <span style={{color:T.outline}}>\u25A1</span> clean
        </div>
      </div>
      <h1 style={{fontFamily:T.garamond,fontWeight:500,fontSize:34,letterSpacing:'-.02em',margin:'10px 0 22px'}}>
        The corpus, page by page.</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:T.ghost,border:`1px solid ${T.ghost}`}}>
        {ROSTER.map(([name,code],i)=>(
          <div key={i} style={{background:T.bg,padding:'10px 12px',display:'flex',justifyContent:'space-between',
            alignItems:'center',gap:8,minHeight:34}}>
            <span style={{display:'flex',alignItems:'center',gap:8,minWidth:0}}>
              <span style={{width:7,height:7,flexShrink:0,borderRadius:isClean(code)?9999:0,
                background:isClean(code)?'transparent':codeColor(code),
                border:isClean(code)?`1px solid ${T.outline}66`:'none'}}/>
              <span style={{fontFamily:T.lit,fontSize:12.5,color:isClean(code)?T.warm:T.ivory,
                whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{name}</span>
            </span>
            {code && code!=='C' && <span style={{fontFamily:T.mono,fontSize:9.5,letterSpacing:'.04em',color:codeColor(code),flexShrink:0}}>{code}</span>}
          </div>
        ))}
      </div>
      <div style={{marginTop:18,fontFamily:T.mono,fontSize:10.5,color:T.outline,lineHeight:1.8}}>
        F-01 dead domain · F-02 pre-rebrand naming · F-04 uncanonical count · 20 of 48 flagged
      </div>
    </Frame>
  );
}

Object.assign(window, { AuditLedger, AuditTriage, AuditIndex, AUDIT });
