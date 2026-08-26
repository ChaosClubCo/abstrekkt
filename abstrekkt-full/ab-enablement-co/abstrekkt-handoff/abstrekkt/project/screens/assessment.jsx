// Assessment — single-assessment detail view: control checklist + evidence side rail.

function AssessmentArtboard(){
  const controls = [
    { id:'AI.1.1', title:'Inventory & documented purpose',           status:'completed', sev:'Low',      ev:8,  owner:'Mira K.' },
    { id:'AI.2.1', title:'Data lineage · training corpus disclosed',  status:'completed', sev:'Medium',   ev:14, owner:'Mira K.' },
    { id:'AI.2.4', title:'PII detection rate ≥ 99.5% on holdout',     status:'progress',  sev:'High',     ev:6,  owner:'Theo R.' },
    { id:'AI.3.2', title:'Disparate-impact ratio · 4/5ths rule',      status:'flagged',   sev:'Critical', ev:11, owner:'Halima O.' },
    { id:'AI.4.1', title:'Human-in-the-loop checkpoint for legal',    status:'progress',  sev:'High',     ev:3,  owner:'Orion B.' },
    { id:'AI.5.3', title:'Adversarial robustness suite · pass ≥ 92%', status:'pending',   sev:'Medium',   ev:0,  owner:'Suri W.' },
    { id:'AI.6.1', title:'Drift monitor live in prod · 5-min SLI',    status:'completed', sev:'Medium',   ev:5,  owner:'Theo R.' },
    { id:'AI.7.2', title:'Incident runbook + on-call attested',       status:'pending',   sev:'High',     ev:1,  owner:'Orion B.' },
  ];

  const severityColor = { Critical:'#EF4444', High:'#F59E0B', Medium:'#FACC15', Low:'#10B981' };

  return (
    <AppFrame
      active="assessment"
      title="rag‑contracts‑v2 · NIST AI RMF"
      crumbs={['Projects','rag‑contracts‑v2','Assessment A‑2807']}
      actions={<>
        <Btn kind="ghost" icon="download" size="sm">Export PDF</Btn>
        <Btn kind="ghost" icon="users"    size="sm">Share</Btn>
        <Btn kind="danger" icon="warn"    size="sm">Halt run</Btn>
        <Btn kind="primary" icon="check"  size="sm">Sign attestation</Btn>
      </>}
    >
      {/* Header strip */}
      <Card pad={20} glow style={{position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(600px 200px at 5% 0%, rgba(251,188,0,.12), transparent 60%)',pointerEvents:'none'}}/>
        <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr 1fr',gap:24,alignItems:'center',position:'relative'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
              <Badge kind="flagged">FLAGGED · awaiting attestation</Badge>
              <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',letterSpacing:'.08em'}}>A‑2807 · v3.1</span>
            </div>
            <div style={{fontFamily:'var(--mono)',fontSize:22,fontWeight:600,letterSpacing:'-.02em'}}>NIST AI RMF · GOVERN suite</div>
            <div style={{fontSize:12.5,color:'var(--muted)',marginTop:6,lineHeight:1.5,maxWidth:420}}>Subject · <span style={{color:'var(--text)',fontFamily:'var(--mono)'}}>rag‑contracts‑v2</span> · staging · embed‑01‑t · cross‑encoder‑v2</div>
          </div>

          {/* Progress arc */}
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="30" stroke="rgba(255,255,255,.06)" strokeWidth="8" fill="none"/>
              <circle cx="40" cy="40" r="30" stroke="url(#agV)" strokeWidth="8" fill="none" strokeLinecap="round"
                strokeDasharray={`${2*Math.PI*30*0.88} ${2*Math.PI*30}`} strokeDashoffset={2*Math.PI*30*0.25}/>
              <defs><linearGradient id="agV" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FFBF00"/><stop offset="1" stopColor="#FBBC00"/></linearGradient></defs>
              <text x="40" y="44" textAnchor="middle" fill="#E5E1E4" fontFamily="var(--mono)" fontSize="15" fontWeight="600">88%</text>
            </svg>
            <div>
              <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.12em',color:'var(--muted)'}}>RUN PROGRESS</div>
              <div style={{fontSize:12.5,color:'var(--text)',marginTop:4}}>22 / 25 controls evaluated</div>
              <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'#A9C7FF',marginTop:2}}>ETA 4m 12s</div>
            </div>
          </div>

          <div>
            <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.12em',color:'var(--muted)'}}>OWNER · TEAM</div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginTop:8}}>
              <span style={{width:28,height:28,borderRadius:99,background:'linear-gradient(135deg,#FFBF00,#FBBC00)',display:'inline-flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--mono)',fontSize:11,fontWeight:700,color:'#fff'}}>MK</span>
              <div>
                <div style={{fontSize:12.5,color:'var(--text)'}}>Mira Karpov</div>
                <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)'}}>LEGAL · LEAD</div>
              </div>
            </div>
            <div style={{display:'flex',gap:-6,marginTop:10}}>
              {['HO','TR','OB','+4'].map((x,i)=>(
                <span key={i} style={{
                  width:24,height:24,borderRadius:99,marginLeft:i?-6:0,
                  background: i===3?'rgba(255,255,255,.04)':'linear-gradient(135deg,#E0A800,#A9C7FF)',
                  border:'2px solid #0A0A0C',display:'inline-flex',alignItems:'center',justifyContent:'center',
                  fontFamily:'var(--mono)',fontSize:9,fontWeight:700,color: i===3?'var(--muted)':'#fff',
                }}>{x}</span>
              ))}
            </div>
          </div>

          <div style={{borderLeft:'1px solid var(--border)',paddingLeft:24}}>
            <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.12em',color:'var(--muted)'}}>BLOCKER · CONTROL AI.3.2</div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginTop:8}}>
              <Severity level="Critical"/>
            </div>
            <div style={{fontSize:11.5,color:'var(--text)',marginTop:8,lineHeight:1.45}}>Disparate-impact ratio is <span style={{color:'#FFD9A6',fontFamily:'var(--mono)',fontWeight:600}}>0.71</span> against the <span style={{color:'var(--text)',fontFamily:'var(--mono)'}}>4/5ths</span> threshold for the <span style={{fontFamily:'var(--mono)'}}>tenure</span> protected class.</div>
            <div style={{marginTop:8,display:'flex',gap:6}}>
              <Btn kind="secondary" size="sm">View finding</Btn>
              <Btn kind="ghost" size="sm">Re‑run</Btn>
            </div>
          </div>
        </div>
      </Card>

      {/* Body: controls list + evidence */}
      <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:14,flex:1,minHeight:0}}>
        {/* Controls list */}
        <Card pad={0} style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <div style={{padding:'12px 18px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',gap:14,alignItems:'center'}}>
              <div style={{fontFamily:'var(--mono)',fontSize:14,fontWeight:600}}>Controls</div>
              <div style={{padding:4,border:'1px solid var(--border)',borderRadius:8,background:'rgba(14,14,16,.6)',display:'flex'}}>
                {['All · 25','Flagged · 3','Pending · 4','Passed · 18'].map((s,i)=>(
                  <span key={s} style={{padding:'5px 10px',fontFamily:'var(--mono)',fontSize:10.5,
                    color:i===0?'#fff':'var(--muted)',
                    background:i===0?'linear-gradient(180deg,#FFBF00,#E0A800)':'transparent',
                    borderRadius:5,letterSpacing:'.04em'}}>{s}</span>
                ))}
              </div>
            </div>
            <Btn kind="ghost" icon="filter" size="sm">Filter</Btn>
          </div>

          <div style={{flex:1,overflow:'auto'}}>
            {controls.map((c,i)=>(
              <div key={c.id} style={{
                display:'grid',gridTemplateColumns:'auto 1fr auto auto',gap:14,alignItems:'center',
                padding:'14px 18px',borderBottom:i===controls.length-1?'none':'1px solid var(--border)',
                background: c.status==='flagged' ? 'linear-gradient(90deg, rgba(251,188,0,.06), transparent 60%)' : 'transparent',
                position:'relative',
              }}>
                {/* status mark */}
                <div style={{width:36,height:36,borderRadius:10,flex:'none',display:'flex',alignItems:'center',justifyContent:'center',
                  background: c.status==='completed' ? 'rgba(16,185,129,.10)'
                    : c.status==='flagged' ? 'rgba(251,188,0,.10)'
                    : c.status==='progress' ? 'rgba(255,191,0,.10)' : 'rgba(148,163,184,.06)',
                  border: `1px solid ${c.status==='completed' ? 'rgba(16,185,129,.40)' : c.status==='flagged' ? 'rgba(251,188,0,.40)' : c.status==='progress' ? 'rgba(255,191,0,.40)' : 'var(--border)'}`,
                  boxShadow: c.status==='progress' ? '0 0 12px rgba(255,191,0,.4)' : 'none',
                }}>
                  {c.status==='completed' && <Icon name="check" size={16} style={{color:'#6EE7B7'}}/>}
                  {c.status==='flagged'   && <Icon name="warn"  size={16} style={{color:'#FFD9A6'}}/>}
                  {c.status==='progress'  && <span style={{width:12,height:12,border:'2px solid #FFEFCC',borderTopColor:'transparent',borderRadius:99,display:'inline-block',animation:'none'}}/>}
                  {c.status==='pending'   && <span style={{width:8,height:8,borderRadius:99,background:'#9C8F78'}}/>}
                </div>

                <div style={{minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontFamily:'var(--mono)',fontSize:11,color:'#A9C7FF',letterSpacing:'.04em'}}>{c.id}</span>
                    <span style={{fontSize:13.5,color:'var(--text)',fontWeight:500}}>{c.title}</span>
                  </div>
                  <div style={{display:'flex',gap:14,marginTop:5,fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',letterSpacing:'.04em'}}>
                    <span>OWNER · {c.owner}</span>
                    <span>EVIDENCE · {c.ev} items</span>
                    <span style={{color:severityColor[c.sev]}}>SEV · {c.sev.toUpperCase()}</span>
                  </div>
                </div>

                <Badge kind={c.status}>{c.status}</Badge>
                <Icon name="chevR" size={15} style={{color:'var(--muted)'}}/>
              </div>
            ))}
          </div>
        </Card>

        {/* Evidence side rail */}
        <Card pad={0} style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <div style={{padding:'14px 18px',borderBottom:'1px solid var(--border)'}}>
            <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.14em',color:'var(--muted)'}}>EVIDENCE · CONTROL AI.3.2</div>
            <div style={{fontFamily:'var(--mono)',fontSize:14,fontWeight:600,marginTop:2}}>Disparate-impact run · #f08e21</div>
          </div>

          <div style={{flex:1,overflow:'auto',padding:'14px 16px',display:'flex',flexDirection:'column',gap:12}}>
            {/* Metric block */}
            <div style={{padding:14,border:'1px solid rgba(251,188,0,.30)',borderRadius:10,background:'rgba(251,188,0,.06)'}}>
              <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}>
                <div>
                  <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.10em',color:'#FFD9A6'}}>4/5THS RATIO · TENURE CLASS</div>
                  <div style={{fontFamily:'var(--mono)',fontSize:30,fontWeight:600,color:'#FBBC00',marginTop:6,letterSpacing:'-.02em'}}>0.71</div>
                </div>
                <div style={{textAlign:'right',fontFamily:'var(--mono)',fontSize:11,color:'var(--muted)'}}>
                  <div>threshold ≥ 0.80</div>
                  <div style={{color:'#FFD9A6',marginTop:2}}>gap −0.09</div>
                </div>
              </div>
              {/* Bar */}
              <div style={{marginTop:14,position:'relative',height:8,background:'rgba(255,255,255,.05)',borderRadius:99}}>
                <div style={{position:'absolute',inset:0,width:'71%',background:'linear-gradient(90deg,#FBBC00,#FFBF00)',borderRadius:99,boxShadow:'0 0 12px rgba(251,188,0,.6)'}}/>
                <div style={{position:'absolute',left:'80%',top:-3,bottom:-3,width:2,background:'#A9C7FF',boxShadow:'0 0 8px #A9C7FF'}}/>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:6,fontFamily:'var(--mono)',fontSize:9.5,color:'var(--muted)'}}>
                <span>0</span><span>0.5</span><span style={{color:'#A9C7FF'}}>0.80 ▸</span><span>1.0</span>
              </div>
            </div>

            {/* Code snippet evidence */}
            <div style={{border:'1px solid var(--border)',borderRadius:10,overflow:'hidden'}}>
              <div style={{padding:'8px 12px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(14,14,16,.6)'}}>
                <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',letterSpacing:'.08em'}}>EVIDENCE.JSON · 1.4 KB</span>
                <Icon name="copy" size={12} style={{color:'var(--muted)'}}/>
              </div>
              <pre style={{margin:0,padding:'10px 12px',fontFamily:'var(--mono)',fontSize:11,lineHeight:1.55,color:'#D4C5AB',background:'rgba(14,14,16,.4)',overflow:'hidden'}}>
{`{
  "run":  "f08e21",
  "class":"tenure < 2y",
  "ratio": 0.71,
  "n":     1248,
  "model": "rag-contracts-v2",
  "seed":  9183,
  "passes": false
}`}
              </pre>
            </div>

            {/* Linked artefacts */}
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.10em',color:'var(--muted)'}}>LINKED · 6</div>
              {[
                ['fairness‑run‑f08e21.csv','3.2 MB','A9C7FF'],
                ['holdout‑slice‑tenure.parq','12.4 MB','FFBF00'],
                ['model‑card‑v3.md','9 KB','FBBC00'],
                ['notebook‑investigation.ipynb','420 KB','A9C7FF'],
              ].map(([n,sz,c])=>(
                <div key={n} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 11px',border:'1px solid var(--border)',borderRadius:8,background:'rgba(14,14,16,.5)'}}>
                  <span style={{width:24,height:24,borderRadius:6,background:`linear-gradient(135deg, #${c}, #${c}66)`,opacity:.85,flex:'none'}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:'var(--mono)',fontSize:11.5,color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{n}</div>
                    <div style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--muted)'}}>{sz} · auto‑captured</div>
                  </div>
                  <Icon name="download" size={13} style={{color:'var(--muted)'}}/>
                </div>
              ))}
            </div>

            {/* Comments */}
            <div style={{borderTop:'1px dashed var(--border)',paddingTop:14,marginTop:4}}>
              <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.10em',color:'var(--muted)',marginBottom:10}}>DISCUSSION · 3</div>
              <div style={{display:'flex',gap:10}}>
                <span style={{width:24,height:24,borderRadius:99,background:'linear-gradient(135deg,#FFBF00,#FBBC00)',display:'inline-flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--mono)',fontSize:9,fontWeight:700,color:'#fff',flex:'none'}}>HO</span>
                <div style={{flex:1}}>
                  <div style={{display:'flex',gap:8,alignItems:'baseline'}}>
                    <span style={{fontSize:12.5,fontWeight:500}}>Halima O.</span>
                    <span style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--muted)'}}>14:02</span>
                  </div>
                  <div style={{fontSize:12.5,color:'var(--muted)',marginTop:4,lineHeight:1.5}}>Tenure slice is leaking through retrieval ranker. Suggest re‑weighting before sign‑off.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Composer */}
          <div style={{padding:'10px 12px',borderTop:'1px solid var(--border)',display:'flex',alignItems:'center',gap:8,background:'rgba(14,14,16,.6)'}}>
            <Icon name="mail" size={14} style={{color:'var(--muted)'}}/>
            <span style={{flex:1,fontSize:12.5,color:'var(--muted)'}}>Comment, /assign, or attach evidence…</span>
            <Btn kind="primary" size="sm" icon="arrowR">Send</Btn>
          </div>
        </Card>
      </div>
    </AppFrame>
  );
}

Object.assign(window, { AssessmentArtboard });
