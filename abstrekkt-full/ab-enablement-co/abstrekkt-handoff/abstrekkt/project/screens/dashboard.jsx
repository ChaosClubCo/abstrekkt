// Dashboard — KPI strip, model health, controls map, recent assessments, alerts.

function DashboardArtboard(){
  const kpis = [
    { label:'MODELS TRACKED', value:'142', delta:'+6 this wk', color:'#FFBF00', spark:[12,14,18,17,20,22,25,28,30,33,38,42], tone:'progress' },
    { label:'OPEN FINDINGS',  value:'27',  delta:'-4 vs Mon',  color:'#FBBC00', spark:[42,40,38,36,34,33,33,31,30,29,28,27], tone:'flagged' },
    { label:'ATTESTATION SLO', value:'99.94%', delta:'+0.02%', color:'#A9C7FF', spark:[99.7,99.7,99.8,99.8,99.9,99.9,99.9,99.92,99.93,99.94,99.94,99.94], tone:'progress' },
    { label:'BLOCKED DEPLOYS', value:'3',   delta:'≤ threshold', color:'#10B981', spark:[5,4,6,4,3,4,3,3,2,3,3,3], tone:'success' },
  ];

  return (
    <AppFrame
      active="dashboard"
      title="Workspace overview"
      crumbs={['Abstrekkt / AX','Aurelium Trust Co.','Dashboard']}
      actions={<>
        <Btn kind="ghost" icon="filter" size="sm">Quarter</Btn>
        <Btn kind="ghost" icon="refresh" size="sm">Refresh · 04s ago</Btn>
        <Btn kind="primary" icon="plus" size="sm">New assessment</Btn>
      </>}
    >
      {/* KPI strip */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {kpis.map(k => (
          <Card key={k.label} pad={16} style={{position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',inset:0,opacity:.4,background:`radial-gradient(220px 80px at 100% 0%, ${k.color}22, transparent 70%)`,pointerEvents:'none'}}/>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,position:'relative'}}>
              <div>
                <div style={{fontFamily:'var(--mono)',fontSize:10,letterSpacing:'.14em',color:'var(--muted)'}}>{k.label}</div>
                <div style={{fontFamily:'var(--mono)',fontSize:28,fontWeight:600,letterSpacing:'-.02em',marginTop:8,color:k.color}}>{k.value}</div>
                <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',marginTop:4,letterSpacing:'.04em'}}>{k.delta}</div>
              </div>
              <Spark data={k.spark} color={k.color} width={92} height={36}/>
            </div>
          </Card>
        ))}
      </div>

      {/* Main grid: assessments queue + sidebar (controls + alerts) */}
      <div style={{display:'grid',gridTemplateColumns:'1.55fr 1fr',gap:14,flex:1,minHeight:0}}>
        {/* Assessments in flight */}
        <Card pad={0} style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <div style={{padding:'14px 18px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.14em',color:'var(--muted)'}}>QUEUE · LIVE</div>
              <div style={{fontFamily:'var(--mono)',fontSize:14,fontWeight:600,marginTop:2}}>Assessments in flight</div>
            </div>
            <div style={{display:'flex',gap:6}}>
              <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',padding:'4px 8px',border:'1px solid var(--border)',borderRadius:6}}>Auto · 30s</span>
              <IconBtn icon="more" size={28}/>
            </div>
          </div>

          {/* Column headers */}
          <div style={{display:'grid',gridTemplateColumns:'1.8fr 1.2fr 0.9fr 0.9fr 0.7fr',gap:12,padding:'10px 18px',borderBottom:'1px dashed var(--border)',fontFamily:'var(--mono)',fontSize:10,letterSpacing:'.14em',color:'var(--muted)'}}>
            <span>SUBJECT MODEL</span><span>FRAMEWORK</span><span>STATUS</span><span>PROGRESS</span><span style={{textAlign:'right'}}>SEV</span>
          </div>

          <div style={{flex:1,overflow:'auto'}}>
            {[
              { id:'A‑2814', model:'gpt-vendor‑legal · prod', owner:'Orion B.',  fw:'EU AI Act · Art. 14',     status:'progress',   sLabel:'Evidence collection', pct:62, sev:'High',    glow:'#FFBF00' },
              { id:'A‑2807', model:'rag‑contracts‑v2 · stage',owner:'Mira K.',   fw:'NIST AI RMF · GOVERN‑1.2',status:'flagged',    sLabel:'Awaiting attest',    pct:88, sev:'Critical',glow:'#FBBC00' },
              { id:'A‑2802', model:'forecast‑rev‑q3 · prod',  owner:'Theo R.',   fw:'SOC 2 · CC7.2',           status:'progress',   sLabel:'Bias scan running',  pct:34, sev:'Medium',  glow:'#FFBF00' },
              { id:'A‑2799', model:'sales‑copilot‑v4 · prod', owner:'Halima O.', fw:'ISO 42001 · 6.1.4',       status:'completed',  sLabel:'Signed · 12m ago',   pct:100,sev:'Low',     glow:'#10B981' },
              { id:'A‑2786', model:'hire‑rank‑v0 · sandbox',  owner:'Marko V.',  fw:'EEOC · Pre‑use',          status:'danger',     sLabel:'Blocked · gate',     pct:12, sev:'Critical',glow:'#EF4444' },
              { id:'A‑2772', model:'docs‑extract‑v1 · prod',  owner:'Suri W.',   fw:'HIPAA · §164.312(b)',     status:'progress',   sLabel:'Red‑team queued',    pct:48, sev:'Medium',  glow:'#FFBF00' },
            ].map((row,i)=>(
              <div key={row.id} style={{
                display:'grid',gridTemplateColumns:'1.8fr 1.2fr 0.9fr 0.9fr 0.7fr',gap:12,alignItems:'center',
                padding:'14px 18px',borderBottom: i===5?'none':'1px solid var(--border)',
                fontSize:13,position:'relative',
              }}>
                <span style={{position:'absolute',left:0,top:8,bottom:8,width:2,background:row.glow,boxShadow:`0 0 8px ${row.glow}`,opacity:.7,borderRadius:2}}/>
                <div style={{display:'flex',flexDirection:'column',gap:3,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',letterSpacing:'.04em'}}>{row.id}</span>
                    <span style={{color:'var(--text)',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{row.model}</span>
                  </div>
                  <span style={{fontSize:11.5,color:'var(--muted)'}}>Owner · {row.owner}</span>
                </div>
                <div style={{fontFamily:'var(--mono)',fontSize:11.5,color:'var(--text)'}}>{row.fw}</div>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  <Badge kind={row.status}>{row.status}</Badge>
                  <span style={{fontSize:11,color:'var(--muted)'}}>{row.sLabel}</span>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  <div style={{height:5,borderRadius:99,background:'rgba(255,255,255,.05)',overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${row.pct}%`,borderRadius:99,background:`linear-gradient(90deg, ${row.glow}, ${row.glow}88)`,boxShadow:`0 0 8px ${row.glow}aa`}}/>
                  </div>
                  <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)'}}>{row.pct}%</span>
                </div>
                <div style={{textAlign:'right'}}><Severity level={row.sev}/></div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right column */}
        <div style={{display:'flex',flexDirection:'column',gap:14,minHeight:0}}>
          {/* Controls coverage */}
          <Card pad={18} style={{position:'relative',overflow:'hidden'}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
              <div>
                <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.14em',color:'var(--muted)'}}>COVERAGE · ALL FRAMEWORKS</div>
                <div style={{fontFamily:'var(--mono)',fontSize:14,fontWeight:600,marginTop:2}}>Control health</div>
              </div>
              <Badge kind="progress">live · 04s</Badge>
            </div>

            <div style={{display:'flex',alignItems:'center',gap:18,marginTop:18}}>
              {/* Donut */}
              <svg width="124" height="124" viewBox="0 0 124 124" style={{flex:'none'}}>
                <defs>
                  <linearGradient id="dgV" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFBF00"/><stop offset="100%" stopColor="#FBBC00"/>
                  </linearGradient>
                </defs>
                <circle cx="62" cy="62" r="48" stroke="rgba(255,255,255,.05)" strokeWidth="14" fill="none"/>
                {/* 71% pass */}
                <circle cx="62" cy="62" r="48" stroke="url(#dgV)" strokeWidth="14" fill="none"
                  strokeDasharray={`${2*Math.PI*48*0.71} ${2*Math.PI*48}`} strokeDashoffset={2*Math.PI*48*0.25} strokeLinecap="round"
                  style={{filter:'drop-shadow(0 0 8px rgba(255,191,0,.5))'}}/>
                {/* 14% flagged */}
                <circle cx="62" cy="62" r="48" stroke="#FBBC00" strokeWidth="14" fill="none" opacity=".7"
                  strokeDasharray={`${2*Math.PI*48*0.14} ${2*Math.PI*48}`} strokeDashoffset={2*Math.PI*48*(0.25 - 0.71)} strokeLinecap="round"/>
                <text x="62" y="60" textAnchor="middle" fill="#E5E1E4" fontFamily="var(--mono)" fontWeight="600" fontSize="22" letterSpacing="-.02em">71%</text>
                <text x="62" y="76" textAnchor="middle" fill="#9C8F78" fontFamily="var(--mono)" fontSize="9" letterSpacing=".14em">PASSING</text>
              </svg>

              <div style={{flex:1,display:'flex',flexDirection:'column',gap:8}}>
                {[
                  ['Passing', 712, '#FFBF00'],
                  ['Flagged', 138, '#FBBC00'],
                  ['Stale',    74, '#F59E0B'],
                  ['Blocked',  26, '#EF4444'],
                ].map(([l,n,c])=>(
                  <div key={l} style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{width:8,height:8,borderRadius:2,background:c,boxShadow:`0 0 6px ${c}`,flex:'none'}}/>
                    <span style={{fontSize:12,color:'var(--text)',flex:1}}>{l}</span>
                    <span style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--muted)'}}>{n}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Alerts feed */}
          <Card pad={0} style={{flex:1,minHeight:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>
            <div style={{padding:'14px 18px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.14em',color:'var(--muted)'}}>SIGNALS · LAST 24H</div>
                <div style={{fontFamily:'var(--mono)',fontSize:14,fontWeight:600,marginTop:2}}>Risk feed</div>
              </div>
              <Btn kind="ghost" size="sm">View all</Btn>
            </div>
            <div style={{flex:1,overflow:'auto'}}>
              {[
                { t:'12:04', tone:'#EF4444', tag:'BLOCK',   text:'hire‑rank‑v0 failed disparate‑impact gate (race · 4/5ths)', meta:'gate · pre‑deploy' },
                { t:'11:47', tone:'#F59E0B', tag:'DRIFT',   text:'sales‑copilot‑v4 · refusal‑rate ↑ 3.1% over baseline window', meta:'monitor · prod' },
                { t:'11:12', tone:'#FFBF00', tag:'ATTEST',  text:'Theo R. signed attestation for forecast‑rev‑q3 (CC7.2)', meta:'rule · soc2' },
                { t:'10:58', tone:'#FBBC00', tag:'FLAG',    text:'New CVE for upstream embedding model · text‑embed‑01‑t', meta:'supply chain' },
                { t:'09:21', tone:'#A9C7FF', tag:'EVIDENCE',text:'17 prompt logs captured for rag‑contracts‑v2', meta:'evidence · auto' },
                { t:'08:40', tone:'#FFBF00', tag:'RUN',     text:'Quarterly bias suite started · 142 models, 9 protected classes', meta:'scheduled' },
              ].map((a,i)=>(
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'13px 18px',borderBottom:i===5?'none':'1px solid var(--border)'}}>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,flex:'none',marginTop:2}}>
                    <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)'}}>{a.t}</span>
                    <span style={{width:6,height:6,borderRadius:99,background:a.tone,boxShadow:`0 0 8px ${a.tone}`}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:3}}>
                      <span style={{fontFamily:'var(--mono)',fontSize:9.5,padding:'1px 6px',borderRadius:4,color:a.tone,border:`1px solid ${a.tone}55`,background:`${a.tone}14`,letterSpacing:'.08em'}}>{a.tag}</span>
                    </div>
                    <div style={{fontSize:12.5,color:'var(--text)',lineHeight:1.4}}>{a.text}</div>
                    <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',marginTop:3,letterSpacing:'.04em'}}>{a.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppFrame>
  );
}

Object.assign(window, { DashboardArtboard });
