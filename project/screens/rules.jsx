// Rules — Compliance rule library with rule editor inspector.

function RulesArtboard(){
  const frameworks = [
    { id:'eu',     name:'EU AI Act',          version:'2024/1689', n:73,  pass:54, color:'#FFBF00' },
    { id:'nist',   name:'NIST AI RMF',        version:'1.0',       n:42,  pass:38, color:'#FBBC00' },
    { id:'iso',    name:'ISO/IEC 42001',      version:'2023',      n:38,  pass:36, color:'#A9C7FF' },
    { id:'soc2',   name:'SOC 2 · Trust',      version:'2017 TSC',  n:124, pass:118,color:'#10B981' },
    { id:'hipaa',  name:'HIPAA · Security',   version:'§164',      n:54,  pass:48, color:'#F59E0B' },
    { id:'custom', name:'House rules · Aurelium', version:'v7',    n:21,  pass:18, color:'#A9C7FF' },
  ];

  const rules = [
    { id:'EU.14.b',     title:'Continuous human-in-the-loop oversight',         tag:'EU AI Act', tagC:'#FFBF00', sev:'High',     mode:'Block',  triggers:114, last:'12m ago', on:true },
    { id:'EU.15.c',     title:'Robustness · adversarial fuzz pass ≥ 92%',        tag:'EU AI Act', tagC:'#FFBF00', sev:'Critical', mode:'Block',  triggers:42,  last:'1h',      on:true },
    { id:'NIST.GOV.1.2',title:'Model card published before deploy',              tag:'NIST',      tagC:'#FBBC00', sev:'Medium',   mode:'Warn',   triggers:8,   last:'3h',      on:true },
    { id:'NIST.MEAS.2.7',title:'Disparate-impact 4/5ths across protected classes',tag:'NIST',     tagC:'#FBBC00', sev:'Critical', mode:'Block',  triggers:3,   last:'42m',     on:true },
    { id:'ISO.6.1.4',   title:'Risk register reviewed quarterly · attested',     tag:'ISO 42001', tagC:'#A9C7FF', sev:'Low',      mode:'Audit',  triggers:0,   last:'12d',     on:true },
    { id:'SOC2.CC7.2',  title:'Anomaly detection on inference patterns',          tag:'SOC 2',     tagC:'#10B981', sev:'Medium',   mode:'Audit',  triggers:217, last:'3m',      on:true },
    { id:'HIPAA.312.b', title:'Audit logs retained 6 years · tamper‑evident',     tag:'HIPAA',     tagC:'#F59E0B', sev:'High',     mode:'Block',  triggers:0,   last:'7d',      on:true },
    { id:'HOUSE.001',   title:'No external model use for client‑identifying PII', tag:'House',     tagC:'#A9C7FF', sev:'Critical', mode:'Block',  triggers:6,   last:'1d',      on:false },
    { id:'HOUSE.007',   title:'All sales-copilot prompts logged & sampled 5%',    tag:'House',     tagC:'#A9C7FF', sev:'Low',      mode:'Audit',  triggers:8412,last:'live',    on:true },
  ];

  return (
    <AppFrame
      active="rules"
      title="Compliance · rule library"
      crumbs={['Workspace','Compliance']}
      actions={<>
        <Btn kind="ghost" icon="upload"  size="sm">Import policy</Btn>
        <Btn kind="ghost" icon="copy"    size="sm">Duplicate</Btn>
        <Btn kind="primary" icon="plus"  size="sm">New rule</Btn>
      </>}
    >
      <div style={{display:'grid',gridTemplateColumns:'220px 1fr 360px',gap:14,flex:1,minHeight:0}}>
        {/* Frameworks tree */}
        <Card pad={0} style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <div style={{padding:'14px 14px 10px'}}>
            <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.14em',color:'var(--muted)'}}>FRAMEWORKS</div>
            <div style={{fontFamily:'var(--mono)',fontSize:13,fontWeight:600,marginTop:4}}>6 active · 352 rules</div>
          </div>
          <div style={{flex:1,overflow:'auto',padding:'4px 8px 14px'}}>
            {frameworks.map((f,i)=>{
              const on = i===0;
              return (
                <div key={f.id} style={{
                  padding:'10px 12px',borderRadius:8,marginBottom:4,
                  background: on ? 'linear-gradient(90deg, rgba(255,191,0,.14), transparent)' : 'transparent',
                  border: `1px solid ${on ? 'rgba(255,191,0,.30)' : 'transparent'}`,
                  position:'relative',cursor:'pointer',
                }}>
                  {on && <span style={{position:'absolute',left:-1,top:8,bottom:8,width:2,borderRadius:2,background:'linear-gradient(180deg,#FFBF00,#FBBC00)',boxShadow:'0 0 8px #FFBF00'}}/>}
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{width:7,height:7,borderRadius:99,background:f.color,boxShadow:`0 0 6px ${f.color}`,flex:'none'}}/>
                    <span style={{fontSize:12.5,color: on?'var(--text)':'var(--muted)',fontWeight: on?500:400,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.name}</span>
                    <span style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--muted)'}}>{f.n}</span>
                  </div>
                  <div style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--muted)',marginTop:3,letterSpacing:'.04em',marginLeft:15}}>{f.version}</div>
                  {/* mini bar */}
                  <div style={{height:3,background:'rgba(255,255,255,.04)',borderRadius:99,marginTop:7,marginLeft:15,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${(f.pass/f.n)*100}%`,background:f.color,boxShadow:`0 0 6px ${f.color}aa`}}/>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{padding:'10px 12px',borderTop:'1px solid var(--border)',background:'rgba(14,14,16,.4)'}}>
            <Btn kind="ghost" size="sm" icon="plus" full>Add framework</Btn>
          </div>
        </Card>

        {/* Rules table */}
        <Card pad={0} style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <div style={{padding:'12px 18px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.14em',color:'#FFEFCC'}}>EU AI ACT · 73 RULES</div>
              <div style={{fontFamily:'var(--mono)',fontSize:14,fontWeight:600,marginTop:2}}>Rules & policies</div>
            </div>
            <div style={{display:'flex',gap:6,alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,padding:'7px 11px',border:'1px solid var(--border)',borderRadius:8,background:'rgba(14,14,16,.6)',width:220}}>
                <Icon name="search" size={13} style={{color:'var(--muted)'}}/>
                <span style={{fontSize:12,color:'var(--muted)',flex:1}}>Find by id, tag, owner…</span>
              </div>
              <Btn kind="ghost" icon="filter" size="sm">3</Btn>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'auto 1fr auto auto auto auto auto',gap:14,padding:'10px 18px',borderBottom:'1px dashed var(--border)',fontFamily:'var(--mono)',fontSize:10,letterSpacing:'.14em',color:'var(--muted)',alignItems:'center'}}>
            <span style={{width:30}}>ON</span>
            <span>RULE</span>
            <span>FRAMEWORK</span>
            <span>SEV</span>
            <span>MODE</span>
            <span style={{textAlign:'right'}}>TRIGGERS·30D</span>
            <span/>
          </div>

          <div style={{flex:1,overflow:'auto'}}>
            {rules.map((r,i)=>(
              <div key={r.id} style={{
                display:'grid',gridTemplateColumns:'auto 1fr auto auto auto auto auto',gap:14,alignItems:'center',
                padding:'14px 18px',borderBottom:i===rules.length-1?'none':'1px solid var(--border)',
                background: i===3 ? 'linear-gradient(90deg, rgba(255,191,0,.06), transparent 60%)' : 'transparent',
                fontSize:13,
              }}>
                {/* toggle */}
                <span style={{width:30,height:16,borderRadius:99,background:r.on?'linear-gradient(90deg,#FFBF00,#FBBC00)':'rgba(148,163,184,.20)',position:'relative',boxShadow:r.on?'0 0 8px rgba(255,191,0,.4)':'none',flex:'none'}}>
                  <span style={{position:'absolute',top:2,left:r.on?16:2,width:12,height:12,borderRadius:99,background:r.on?'#fff':'#5B677A',transition:'left .15s'}}/>
                </span>
                <div style={{minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'#A9C7FF',letterSpacing:'.04em'}}>{r.id}</span>
                    <span style={{color:'var(--text)',fontWeight:500}}>{r.title}</span>
                  </div>
                </div>
                <span style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.06em',color:r.tagC,padding:'2px 8px',border:`1px solid ${r.tagC}55`,background:`${r.tagC}14`,borderRadius:99}}>{r.tag.toUpperCase()}</span>
                <Severity level={r.sev}/>
                <span style={{fontFamily:'var(--mono)',fontSize:10.5,padding:'3px 8px',borderRadius:6,
                  color:r.mode==='Block'?'#FCA5A5':r.mode==='Warn'?'#FCD34D':'#A9C7FF',
                  background:r.mode==='Block'?'rgba(239,68,68,.10)':r.mode==='Warn'?'rgba(245,158,11,.10)':'rgba(169,199,255,.10)',
                  border:`1px solid ${r.mode==='Block'?'rgba(239,68,68,.30)':r.mode==='Warn'?'rgba(245,158,11,.30)':'rgba(169,199,255,.30)'}`,
                  letterSpacing:'.06em',textTransform:'uppercase',
                }}>{r.mode}</span>
                <span style={{fontFamily:'var(--mono)',fontSize:12.5,color:'var(--text)',textAlign:'right'}}>{r.triggers.toLocaleString()}</span>
                <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)'}}>{r.last}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Rule inspector */}
        <Card pad={0} style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <div style={{padding:'14px 16px',borderBottom:'1px solid var(--border)',background:'linear-gradient(180deg, rgba(255,191,0,.08), transparent)'}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
              <div>
                <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.14em',color:'#FFEFCC'}}>INSPECTOR · NIST.MEAS.2.7</div>
                <div style={{fontFamily:'var(--mono)',fontSize:14,fontWeight:600,marginTop:4,lineHeight:1.3,maxWidth:280}}>Disparate-impact 4/5ths</div>
              </div>
              <Severity level="Critical"/>
            </div>
          </div>

          <div style={{flex:1,overflow:'auto',padding:'14px 16px',display:'flex',flexDirection:'column',gap:14}}>
            <div>
              <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.10em',color:'var(--muted)',marginBottom:6}}>DESCRIPTION</div>
              <div style={{fontSize:12.5,color:'var(--text)',lineHeight:1.55}}>Each protected class must produce selection / approval rates within 80% of the highest-performing reference class on the model's labelled outcome.</div>
            </div>

            <div>
              <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.10em',color:'var(--muted)',marginBottom:8}}>EXPRESSION</div>
              <pre style={{margin:0,padding:'12px',fontFamily:'var(--mono)',fontSize:11,lineHeight:1.6,color:'#E5E1E4',background:'rgba(14,14,16,.7)',border:'1px solid var(--border)',borderRadius:8,overflow:'hidden'}}>
{`when model.run.has_protected_class()
  for class in model.classes:
    ratio = class.rate / max(classes.rate)
    `}<span style={{color:'#FFD9A6'}}>{`assert ratio >= 0.80`}</span>{`
  else: flag( severity=`}<span style={{color:'#A9C7FF'}}>"critical"</span>{` )`}
              </pre>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div style={{padding:'10px 12px',border:'1px solid var(--border)',borderRadius:8,background:'rgba(14,14,16,.5)'}}>
                <div style={{fontFamily:'var(--mono)',fontSize:9.5,letterSpacing:'.10em',color:'var(--muted)'}}>WHEN</div>
                <div style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--text)',marginTop:4}}>pre‑deploy, weekly</div>
              </div>
              <div style={{padding:'10px 12px',border:'1px solid var(--border)',borderRadius:8,background:'rgba(14,14,16,.5)'}}>
                <div style={{fontFamily:'var(--mono)',fontSize:9.5,letterSpacing:'.10em',color:'var(--muted)'}}>OWNER</div>
                <div style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--text)',marginTop:4}}>governance‑team</div>
              </div>
              <div style={{padding:'10px 12px',border:'1px solid rgba(239,68,68,.30)',borderRadius:8,background:'rgba(239,68,68,.08)'}}>
                <div style={{fontFamily:'var(--mono)',fontSize:9.5,letterSpacing:'.10em',color:'#FCA5A5'}}>ON FAIL</div>
                <div style={{fontFamily:'var(--mono)',fontSize:12,color:'#FCA5A5',marginTop:4}}>BLOCK deploy</div>
              </div>
              <div style={{padding:'10px 12px',border:'1px solid var(--border)',borderRadius:8,background:'rgba(14,14,16,.5)'}}>
                <div style={{fontFamily:'var(--mono)',fontSize:9.5,letterSpacing:'.10em',color:'var(--muted)'}}>VERSION</div>
                <div style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--text)',marginTop:4}}>v4 · 24 May</div>
              </div>
            </div>

            <div>
              <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.10em',color:'var(--muted)',marginBottom:8}}>APPLIED TO · 47 MODELS</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {['rag‑contracts‑v2','sales‑copilot‑v4','hire‑rank‑v0','fraud‑signals‑v2','forecast‑rev‑q3','+42'].map((t,i)=>(
                  <span key={i} style={{fontFamily:'var(--mono)',fontSize:10.5,padding:'3px 8px',border:'1px solid var(--border)',borderRadius:6,color:i===5?'var(--muted)':'var(--text)',background:'rgba(14,14,16,.5)'}}>{t}</span>
                ))}
              </div>
            </div>

            <div>
              <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.10em',color:'var(--muted)',marginBottom:8}}>30-DAY TRIGGERS</div>
              <div style={{padding:'10px 6px',border:'1px solid var(--border)',borderRadius:8,background:'rgba(14,14,16,.4)'}}>
                <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:3,height:46,padding:'0 8px'}}>
                  {[2,1,3,2,4,1,2,5,3,2,4,3,8,5,4,2,3,1,2,4,3,5,7,12,8,9,6,11,15,3].map((v,i)=>(
                    <span key={i} style={{flex:1,height:`${(v/15)*100}%`,background:v>9?'linear-gradient(180deg,#FBBC00,#FFBF00)':'rgba(255,191,0,.45)',borderRadius:1.5,boxShadow:v>9?'0 0 8px rgba(251,188,0,.5)':'none'}}/>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{padding:'10px 14px',borderTop:'1px solid var(--border)',display:'flex',gap:6,justifyContent:'space-between',background:'rgba(14,14,16,.4)'}}>
            <Btn kind="ghost" size="sm">Test</Btn>
            <div style={{display:'flex',gap:6}}>
              <Btn kind="secondary" size="sm" icon="copy">Clone</Btn>
              <Btn kind="primary" size="sm" icon="check">Save</Btn>
            </div>
          </div>
        </Card>
      </div>
    </AppFrame>
  );
}

Object.assign(window, { RulesArtboard });
