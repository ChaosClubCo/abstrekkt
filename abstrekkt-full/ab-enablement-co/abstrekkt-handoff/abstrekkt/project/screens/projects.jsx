// Projects — AI project / model registry list view.

function ProjectsArtboard(){
  const rows = [
    { id:'P‑0142', name:'sales‑copilot‑v4', dept:'GTM',     tier:'High',     stage:'Production', owner:'Halima O.', last:'2h ago', open:0, attest:'Active',  glow:'#10B981', logo:'#FFBF00' },
    { id:'P‑0140', name:'rag‑contracts‑v2', dept:'Legal',   tier:'Critical', stage:'Staging',   owner:'Mira K.',   last:'42m',    open:3, attest:'Pending', glow:'#FBBC00', logo:'#FBBC00' },
    { id:'P‑0138', name:'forecast‑rev‑q3',  dept:'Finance', tier:'High',     stage:'Production', owner:'Theo R.',   last:'5h',     open:1, attest:'Active',  glow:'#FFBF00', logo:'#A9C7FF' },
    { id:'P‑0135', name:'gpt‑vendor‑legal', dept:'Procurement', tier:'Medium', stage:'Production', owner:'Orion B.', last:'1d',  open:2, attest:'Active',  glow:'#FFBF00', logo:'#FFBF00' },
    { id:'P‑0132', name:'hire‑rank‑v0',     dept:'People',  tier:'Critical', stage:'Blocked',    owner:'Marko V.',  last:'5m',     open:7, attest:'Revoked', glow:'#EF4444', logo:'#EF4444' },
    { id:'P‑0129', name:'docs‑extract‑v1',  dept:'Ops',     tier:'Medium',   stage:'Production', owner:'Suri W.',   last:'3h',     open:1, attest:'Active',  glow:'#FFBF00', logo:'#F59E0B' },
    { id:'P‑0124', name:'support‑router‑v3',dept:'Support', tier:'Low',      stage:'Production', owner:'Anwar L.',  last:'4d',     open:0, attest:'Active',  glow:'#10B981', logo:'#A9C7FF' },
    { id:'P‑0119', name:'detect‑churn‑v6',  dept:'GTM',     tier:'High',     stage:'Sandbox',    owner:'Iris D.',   last:'12h',    open:0, attest:'—',       glow:'#9C8F78', logo:'#FFBF00' },
    { id:'P‑0117', name:'fraud‑signals‑v2', dept:'Risk',    tier:'Critical', stage:'Production', owner:'Halima O.', last:'18m',    open:2, attest:'Active',  glow:'#FBBC00', logo:'#FBBC00' },
    { id:'P‑0112', name:'agent‑onboarder',  dept:'Internal',tier:'Low',      stage:'Sandbox',    owner:'Tanvi P.',  last:'2d',     open:0, attest:'—',       glow:'#9C8F78', logo:'#A9C7FF' },
  ];
  const tierMap = { Critical:'danger', High:'warning', Medium:'progress', Low:'neutral' };
  const stageMap = { Production:'#10B981', Staging:'#A9C7FF', Sandbox:'#9C8F78', Blocked:'#EF4444' };

  return (
    <AppFrame
      active="projects"
      title="Projects · model registry"
      crumbs={['Aurelium Trust Co.','Projects']}
      actions={<>
        <Btn kind="ghost"  icon="upload"  size="sm">Import CSV</Btn>
        <Btn kind="ghost"  icon="download" size="sm">Export</Btn>
        <Btn kind="primary" icon="plus"   size="sm">Register model</Btn>
      </>}
    >
      {/* Filter ribbon */}
      <Card pad={14}>
        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'7px 11px',border:'1px solid var(--border)',borderRadius:8,background:'rgba(14,14,16,.6)',flex:'1 1 280px',minWidth:240}}>
            <Icon name="search" size={14} style={{color:'var(--muted)'}}/>
            <span style={{fontSize:12.5,color:'var(--muted)',flex:1}}>Filter by name, owner, framework, tag…</span>
            <span style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--muted)',padding:'1px 6px',border:'1px solid var(--border)',borderRadius:5}}>/</span>
          </div>
          {[
            ['Tier',     '4 · all'],
            ['Stage',    'Prod, Stage'],
            ['Owner',    '12 people'],
            ['Framework','EU AI · NIST'],
            ['Tag',      '—'],
          ].map(([k,v])=>(
            <div key={k} style={{display:'flex',alignItems:'center',gap:7,padding:'7px 11px',border:'1px solid var(--border)',borderRadius:8,fontFamily:'var(--mono)',fontSize:11,background:'rgba(14,14,16,.4)'}}>
              <span style={{color:'var(--muted)',letterSpacing:'.08em'}}>{k}</span>
              <span style={{color:'var(--text)'}}>{v}</span>
              <Icon name="chevD" size={11} style={{color:'var(--muted)'}}/>
            </div>
          ))}
          <div style={{marginLeft:'auto',display:'flex',gap:6}}>
            <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',alignSelf:'center',marginRight:6}}>VIEW</span>
            <IconBtn icon="list" active size={30}/>
            <IconBtn icon="grid" size={30}/>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card pad={0} style={{flex:1,minHeight:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{padding:'12px 18px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <span style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--text)',fontWeight:500}}>142 projects</span>
            <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--muted)'}}>· 23 critical · 47 high</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',marginRight:4}}>SORT</span>
            <span style={{fontFamily:'var(--mono)',fontSize:11,color:'#FFEFCC',padding:'4px 8px',border:'1px solid rgba(255,191,0,.35)',background:'rgba(255,191,0,.08)',borderRadius:6,display:'inline-flex',alignItems:'center',gap:6}}>Risk · desc <Icon name="arrowDn" size={11}/></span>
            <IconBtn icon="more" size={28}/>
          </div>
        </div>

        {/* Header row */}
        <div style={{display:'grid',gridTemplateColumns:'24px 1.8fr 0.9fr 0.9fr 1fr 1fr 0.7fr 0.9fr 32px',gap:10,padding:'10px 18px',borderBottom:'1px dashed var(--border)',fontFamily:'var(--mono)',fontSize:10,letterSpacing:'.14em',color:'var(--muted)',alignItems:'center'}}>
          <span/>
          <span>MODEL</span>
          <span>DEPT</span>
          <span>RISK TIER</span>
          <span>STAGE</span>
          <span>OWNER</span>
          <span style={{textAlign:'right'}}>FINDINGS</span>
          <span>ATTEST</span>
          <span/>
        </div>

        <div style={{flex:1,overflow:'auto'}}>
          {rows.map((r,i)=>(
            <div key={r.id} style={{
              display:'grid',gridTemplateColumns:'24px 1.8fr 0.9fr 0.9fr 1fr 1fr 0.7fr 0.9fr 32px',gap:10,alignItems:'center',
              padding:'14px 18px',borderBottom:i===rows.length-1?'none':'1px solid var(--border)',
              fontSize:13,background: i===1 ? 'linear-gradient(90deg, rgba(251,188,0,.04), transparent)' : 'transparent',
            }}>
              <span style={{width:14,height:14,borderRadius:4,border:'1px solid var(--border)',background:'rgba(14,14,16,.6)'}}/>
              <div style={{display:'flex',alignItems:'center',gap:10,minWidth:0}}>
                <span style={{width:28,height:28,borderRadius:8,flex:'none',background:`linear-gradient(135deg, ${r.logo}, ${r.logo}66)`,boxShadow:`0 0 12px ${r.logo}44`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--mono)',fontSize:10,fontWeight:700,color:'#fff'}}>{r.name.slice(0,2).toUpperCase()}</span>
                <div style={{minWidth:0}}>
                  <div style={{fontFamily:'var(--mono)',fontSize:13,fontWeight:500,color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.name}</div>
                  <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',letterSpacing:'.04em'}}>{r.id} · last run {r.last}</div>
                </div>
              </div>
              <span style={{color:'var(--muted)',fontSize:12.5}}>{r.dept}</span>
              <Badge kind={tierMap[r.tier]}>{r.tier}</Badge>
              <span style={{display:'inline-flex',alignItems:'center',gap:8,fontFamily:'var(--mono)',fontSize:11.5,color:'var(--text)'}}>
                <span style={{width:6,height:6,borderRadius:99,background:stageMap[r.stage],boxShadow:`0 0 6px ${stageMap[r.stage]}`}}/>{r.stage}
              </span>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{width:22,height:22,borderRadius:99,background:'linear-gradient(135deg,#FFBF00,#FBBC00)',display:'inline-flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--mono)',fontSize:9,fontWeight:700,color:'#fff'}}>{r.owner.split(' ').map(x=>x[0]).join('')}</span>
                <span style={{fontSize:12.5,color:'var(--text)'}}>{r.owner}</span>
              </div>
              <div style={{textAlign:'right',fontFamily:'var(--mono)',fontSize:13,color: r.open>0 ? '#FFD9A6' : 'var(--muted)',fontWeight:500}}>{r.open === 0 ? '—' : r.open}</div>
              <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:r.attest==='Active'?'#6EE7B7':r.attest==='Pending'?'#FCD34D':r.attest==='Revoked'?'#FCA5A5':'var(--muted)',letterSpacing:'.06em',textTransform:'uppercase'}}>{r.attest}</span>
              <IconBtn icon="more" size={28}/>
            </div>
          ))}
        </div>

        <div style={{padding:'10px 18px',borderTop:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(14,14,16,.4)'}}>
          <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)'}}>Showing 10 of 142</span>
          <div style={{display:'flex',gap:4,alignItems:'center'}}>
            {['‹','1','2','3','…','15','›'].map((n,i)=>(
              <span key={i} style={{
                minWidth:24,height:24,padding:'0 6px',display:'inline-flex',alignItems:'center',justifyContent:'center',
                fontFamily:'var(--mono)',fontSize:11,borderRadius:5,
                color: i===1?'#fff':'var(--muted)',
                background: i===1?'linear-gradient(180deg,#FFBF00,#E0A800)':'transparent',
                border: i===1?'1px solid rgba(255,191,0,.5)':'1px solid var(--border)',
                boxShadow: i===1?'0 4px 12px -4px rgba(255,191,0,.6)':'none',
              }}>{n}</span>
            ))}
          </div>
        </div>
      </Card>
    </AppFrame>
  );
}

Object.assign(window, { ProjectsArtboard });
