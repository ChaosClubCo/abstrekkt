// Audit — Tamper-evident audit log timeline with detail pane.

function AuditArtboard(){
  const events = [
    { t:'14:08:21', who:'Theo R.',      role:'Engineering', act:'ATTEST',   res:'forecast-rev-q3 · CC7.2',          ip:'10.4.18.92',  c:'#FFBF00', hash:'a91f0e' },
    { t:'14:02:11', who:'Halima O.',    role:'Engineering', act:'COMMENT',  res:'A‑2807 · control AI.3.2',          ip:'10.4.18.81',  c:'#A9C7FF', hash:'bb39d2' },
    { t:'13:58:04', who:'system · run', role:'—',           act:'GATE',     res:'hire-rank-v0 · disparate-impact FAIL',ip:'svc.gate',   c:'#EF4444', hash:'2f72c4', alert:true },
    { t:'13:42:30', who:'Mira K.',      role:'Governance',  act:'UPDATE',   res:'rule NIST.MEAS.2.7 → v4',          ip:'10.4.18.103', c:'#FBBC00', hash:'90b1ee' },
    { t:'13:11:09', who:'Orion B.',     role:'Admin',       act:'ROLE',     res:'iris@ext-consult.co · Contractor', ip:'10.4.18.7',   c:'#F59E0B', hash:'7f223a' },
    { t:'12:48:55', who:'system · scim',role:'—',           act:'PROVISION',res:'3 users from Okta · group=GTM',    ip:'svc.scim',    c:'#A9C7FF', hash:'118ad0' },
    { t:'12:14:02', who:'Marko V.',     role:'Engineering', act:'AUTH',     res:'login · new device (mac/safari)',  ip:'74.219.4.18', c:'#F59E0B', hash:'cc4e91', alert:true },
    { t:'11:47:23', who:'system · drift',role:'—',          act:'SIGNAL',   res:'sales-copilot-v4 refusal-rate ↑3.1%',ip:'svc.monitor',c:'#FBBC00', hash:'4501ab' },
    { t:'11:12:00', who:'Theo R.',      role:'Engineering', act:'RUN',      res:'forecast-rev-q3 · weekly suite',   ip:'10.4.18.92',  c:'#FFBF00', hash:'e2f10c' },
    { t:'10:58:41', who:'system · cve', role:'—',           act:'FLAG',     res:'text-embed-01-t · CVE-2026-7841',  ip:'svc.intel',   c:'#FBBC00', hash:'33b9aa' },
    { t:'10:21:50', who:'Suri W.',      role:'Governance',  act:'EXPORT',   res:'evidence pack · A-2799 (12 MB)',   ip:'10.4.18.44',  c:'#A9C7FF', hash:'870e22' },
    { t:'09:21:12', who:'system · cron',role:'—',           act:'RUN',      res:'quarterly bias suite · 142 models',ip:'svc.sched',   c:'#FFBF00', hash:'5a8c11' },
  ];

  const actBg = {
    ATTEST:    { c:'#FFBF00', bg:'rgba(255,191,0,.10)', bd:'rgba(255,191,0,.30)' },
    COMMENT:   { c:'#A9C7FF', bg:'rgba(169,199,255,.08)',  bd:'rgba(169,199,255,.30)' },
    GATE:      { c:'#EF4444', bg:'rgba(239,68,68,.10)',   bd:'rgba(239,68,68,.30)' },
    UPDATE:    { c:'#FBBC00', bg:'rgba(251,188,0,.10)', bd:'rgba(251,188,0,.30)' },
    ROLE:      { c:'#F59E0B', bg:'rgba(245,158,11,.10)',  bd:'rgba(245,158,11,.30)' },
    PROVISION: { c:'#A9C7FF', bg:'rgba(103,232,249,.08)', bd:'rgba(103,232,249,.30)' },
    AUTH:      { c:'#F59E0B', bg:'rgba(245,158,11,.10)',  bd:'rgba(245,158,11,.30)' },
    SIGNAL:    { c:'#FBBC00', bg:'rgba(251,188,0,.10)', bd:'rgba(251,188,0,.30)' },
    RUN:       { c:'#FFBF00', bg:'rgba(255,191,0,.08)',  bd:'rgba(255,191,0,.30)' },
    FLAG:      { c:'#FBBC00', bg:'rgba(251,188,0,.10)', bd:'rgba(251,188,0,.30)' },
    EXPORT:    { c:'#A9C7FF', bg:'rgba(169,199,255,.08)',  bd:'rgba(169,199,255,.30)' },
  };

  return (
    <AppFrame
      active="audit"
      title="Audit log · tamper-evident"
      crumbs={['Workspace','Audit','Live']}
      actions={<>
        <Btn kind="ghost" icon="filter"   size="sm">Today · all</Btn>
        <Btn kind="ghost" icon="download" size="sm">Export · JSONL</Btn>
        <Btn kind="primary" icon="check"  size="sm">Verify chain</Btn>
      </>}
    >
      {/* Header strip */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        <Card pad={14} style={{position:'relative',overflow:'hidden'}}>
          <div style={{fontFamily:'var(--mono)',fontSize:10,letterSpacing:'.14em',color:'var(--muted)'}}>EVENTS · 24H</div>
          <div style={{fontFamily:'var(--mono)',fontSize:22,fontWeight:600,letterSpacing:'-.02em',marginTop:8,color:'#FFBF00'}}>3,184</div>
          <Spark data={[20,28,32,45,38,52,48,61,72,68,84,90]} color="#FFBF00" width="100%" height={28} />
        </Card>
        <Card pad={14}>
          <div style={{fontFamily:'var(--mono)',fontSize:10,letterSpacing:'.14em',color:'var(--muted)'}}>CHAIN INTEGRITY</div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginTop:8}}>
            <Icon name="shield" size={18} style={{color:'#6EE7B7'}}/>
            <div style={{fontFamily:'var(--mono)',fontSize:18,fontWeight:600,color:'#10B981'}}>VERIFIED</div>
          </div>
          <div style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--muted)',marginTop:4}}>last anchor 14:08:24 · merkle ok</div>
        </Card>
        <Card pad={14}>
          <div style={{fontFamily:'var(--mono)',fontSize:10,letterSpacing:'.14em',color:'var(--muted)'}}>HIGH-RISK EVENTS</div>
          <div style={{fontFamily:'var(--mono)',fontSize:22,fontWeight:600,marginTop:8,color:'#FFD9A6'}}>12</div>
          <div style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--muted)',marginTop:4}}>4 require attention</div>
        </Card>
        <Card pad={14}>
          <div style={{fontFamily:'var(--mono)',fontSize:10,letterSpacing:'.14em',color:'var(--muted)'}}>RETENTION</div>
          <div style={{fontFamily:'var(--mono)',fontSize:22,fontWeight:600,marginTop:8,color:'#A9C7FF'}}>6.0y</div>
          <div style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--muted)',marginTop:4}}>WORM · R2 · §164.312(b)</div>
        </Card>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.55fr 1fr',gap:14,flex:1,minHeight:0}}>
        {/* Timeline */}
        <Card pad={0} style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <div style={{padding:'12px 18px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{width:8,height:8,borderRadius:99,background:'#10B981',boxShadow:'0 0 8px #10B981'}}/>
              <div style={{fontFamily:'var(--mono)',fontSize:14,fontWeight:600}}>Live event stream</div>
              <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)'}}>· hash-linked · append-only</span>
            </div>
            <div style={{display:'flex',gap:6}}>
              <Btn kind="ghost" icon="search" size="sm">Find</Btn>
              <Btn kind="ghost" icon="filter" size="sm">Filter</Btn>
            </div>
          </div>

          <div style={{flex:1,overflow:'auto',position:'relative'}}>
            {/* vertical timeline rail */}
            <div style={{position:'absolute',left:84,top:0,bottom:0,width:1,background:'linear-gradient(180deg, transparent, var(--border) 5%, var(--border) 95%, transparent)'}}/>

            {events.map((e,i)=>{
              const ab = actBg[e.act];
              const sel = i===2;
              return (
                <div key={i} style={{
                  display:'grid',gridTemplateColumns:'72px 24px 1fr auto',gap:10,alignItems:'flex-start',
                  padding:'14px 18px 14px 12px',
                  borderBottom:i===events.length-1?'none':'1px solid var(--border)',
                  background: sel ? 'linear-gradient(90deg, rgba(255,191,0,.10), transparent 60%)' : 'transparent',
                  position:'relative',
                }}>
                  {sel && <span style={{position:'absolute',left:0,top:14,bottom:14,width:2,background:'linear-gradient(180deg,#FFBF00,#FBBC00)',boxShadow:'0 0 8px #FFBF00',borderRadius:2}}/>}
                  <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',letterSpacing:'.04em',marginTop:3,textAlign:'right'}}>{e.t}</span>
                  <div style={{display:'flex',justifyContent:'center',marginTop:4}}>
                    <span style={{width:11,height:11,borderRadius:99,background:e.c,boxShadow:`0 0 10px ${e.c}`,border:'2px solid #0A0A0C'}}/>
                  </div>
                  <div style={{minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                      <span style={{fontFamily:'var(--mono)',fontSize:10.5,padding:'2px 7px',borderRadius:4,color:ab.c,background:ab.bg,border:`1px solid ${ab.bd}`,letterSpacing:'.06em',fontWeight:600}}>{e.act}</span>
                      <span style={{fontSize:13,color:'var(--text)',fontWeight:500}}>{e.who}</span>
                      <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)'}}>· {e.role}</span>
                      {e.alert && <span style={{fontFamily:'var(--mono)',fontSize:9.5,padding:'1px 6px',borderRadius:4,color:'#FFD9A6',background:'rgba(251,188,0,.10)',border:'1px solid rgba(251,188,0,.30)',letterSpacing:'.08em'}}>REVIEW</span>}
                    </div>
                    <div style={{fontSize:12.5,color:'var(--muted)',marginTop:6,lineHeight:1.45}}>{e.res}</div>
                    <div style={{display:'flex',gap:14,marginTop:6,fontFamily:'var(--mono)',fontSize:10,color:'var(--muted)',letterSpacing:'.04em'}}>
                      <span>IP · {e.ip}</span>
                      <span style={{color:'#A9C7FF'}}>hash · {e.hash}</span>
                    </div>
                  </div>
                  <Icon name="chevR" size={13} style={{color:'var(--muted)',marginTop:6}}/>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Detail pane */}
        <Card pad={0} style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <div style={{padding:'14px 18px',borderBottom:'1px solid var(--border)',background:'linear-gradient(180deg, rgba(239,68,68,.10), transparent)'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <Icon name="warn" size={16} style={{color:'#FCA5A5'}}/>
              <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.14em',color:'#FCA5A5'}}>EVENT DETAIL · 13:58:04</div>
            </div>
            <div style={{fontFamily:'var(--mono)',fontSize:15,fontWeight:600,marginTop:6}}>GATE · disparate-impact FAIL</div>
            <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',marginTop:4}}>hash · 2f72c4 · linked from a91f0e</div>
          </div>

          <div style={{flex:1,overflow:'auto',padding:'14px 16px',display:'flex',flexDirection:'column',gap:14}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,fontFamily:'var(--mono)',fontSize:11}}>
              {[
                ['ACTOR','system · gate svc'],
                ['SUBJECT','hire-rank-v0'],
                ['NS','aurelium.prod'],
                ['VERSION','v0.4.2'],
                ['SESSION','sess_9a31'],
                ['OUTCOME','BLOCK'],
              ].map(([k,v])=>(
                <div key={k} style={{padding:'8px 10px',border:'1px solid var(--border)',borderRadius:8,background:'rgba(14,14,16,.5)'}}>
                  <div style={{fontSize:9.5,color:'var(--muted)',letterSpacing:'.10em'}}>{k}</div>
                  <div style={{fontSize:12,color:'var(--text)',marginTop:3}}>{v}</div>
                </div>
              ))}
            </div>

            {/* JSON payload */}
            <div style={{border:'1px solid var(--border)',borderRadius:10,overflow:'hidden'}}>
              <div style={{padding:'8px 12px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(14,14,16,.6)'}}>
                <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',letterSpacing:'.08em'}}>PAYLOAD · 712 B</span>
                <Icon name="copy" size={12} style={{color:'var(--muted)'}}/>
              </div>
              <pre style={{margin:0,padding:'12px',fontFamily:'var(--mono)',fontSize:11,lineHeight:1.6,background:'rgba(14,14,16,.4)',color:'#E5E1E4',overflow:'hidden'}}>
{`{
  "event":   "gate.block",
  "rule":    "NIST.MEAS.2.7",
  "model":   "hire-rank-v0",
  "metric":  { "name":"4_5ths_ratio", "value": `}<span style={{color:'#FCA5A5'}}>0.71</span>{`, "min":0.80 },
  "class":   "tenure_lt_2y",
  "deploy":  "blocked",
  "links":   ["A-2786","f08e21"],
  "prev_hash":"a91f0e",
  "hash":    "`}<span style={{color:'#A9C7FF'}}>2f72c4</span>{`"
}`}
              </pre>
            </div>

            {/* Chain visual */}
            <div>
              <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.10em',color:'var(--muted)',marginBottom:10}}>HASH CHAIN · ±3 BLOCKS</div>
              <div style={{display:'flex',flexDirection:'column',gap:2,fontFamily:'var(--mono)',fontSize:11}}>
                {[
                  ['bb39d2','prev · COMMENT', false],
                  ['2f72c4','THIS · GATE BLOCK', true],
                  ['90b1ee','next · UPDATE', false],
                  ['7f223a','+2 · ROLE', false],
                ].map(([h,d,sel],i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',border:`1px solid ${sel?'rgba(251,188,0,.4)':'var(--border)'}`,borderRadius:8,background:sel?'rgba(251,188,0,.08)':'rgba(14,14,16,.4)'}}>
                    <span style={{width:6,height:6,borderRadius:99,background:sel?'#FBBC00':'#9C8F78',boxShadow:sel?'0 0 6px #FBBC00':'none'}}/>
                    <span style={{color:sel?'#FFD9A6':'#A9C7FF',fontWeight:600,letterSpacing:'.04em'}}>{h}</span>
                    <span style={{color:'var(--muted)',flex:1,fontSize:10.5,letterSpacing:'.04em'}}>{d}</span>
                    <Icon name="check" size={12} style={{color:'#6EE7B7'}}/>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{padding:'10px 14px',borderTop:'1px solid var(--border)',display:'flex',gap:6,justifyContent:'space-between',background:'rgba(14,14,16,.4)'}}>
            <Btn kind="ghost" size="sm">Open assessment</Btn>
            <div style={{display:'flex',gap:6}}>
              <Btn kind="secondary" size="sm" icon="copy">Share link</Btn>
              <Btn kind="primary" size="sm" icon="download">Forensic bundle</Btn>
            </div>
          </div>
        </Card>
      </div>
    </AppFrame>
  );
}

Object.assign(window, { AuditArtboard });
