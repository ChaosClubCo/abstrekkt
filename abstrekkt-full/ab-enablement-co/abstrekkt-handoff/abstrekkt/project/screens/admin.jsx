// Admin — Users & roles management.

function AdminArtboard(){
  const roles = [
    { name:'Admin',         desc:'Full workspace · billing · roles',           n:3,  c:'#FFBF00', perms:['*'] },
    { name:'Governance',    desc:'Rules, attestations, all evidence',          n:7,  c:'#FBBC00', perms:['rules.*','assess.read','assess.sign'] },
    { name:'Engineering',   desc:'Owns projects, registers models, runs evals',n:42, c:'#A9C7FF', perms:['projects.*','assess.run'] },
    { name:'Auditor (RO)',  desc:'Read-only · evidence + audit log',           n:12, c:'#A9C7FF', perms:['*.read'] },
    { name:'Contractor',    desc:'Time-boxed scope · single project',          n:5,  c:'#F59E0B', perms:['projects.read'] },
  ];
  const users = [
    { id:1, n:'Orion Brink',    e:'orion@abstrekkt.ax',    role:'Admin',       team:'Governance', mfa:'Hardware', last:'4m',  status:'active'  },
    { id:2, n:'Mira Karpov',    e:'mira@abstrekkt.ax',     role:'Governance',  team:'Legal',      mfa:'TOTP',     last:'22m', status:'active'  },
    { id:3, n:'Theo Reyes',     e:'theo@abstrekkt.ax',     role:'Engineering', team:'Finance',    mfa:'TOTP',     last:'1h',  status:'active'  },
    { id:4, n:'Halima Okafor',  e:'halima@abstrekkt.ax',   role:'Engineering', team:'GTM',        mfa:'Hardware', last:'9m',  status:'active'  },
    { id:5, n:'Marko Veles',    e:'marko@abstrekkt.ax',    role:'Engineering', team:'People',     mfa:'TOTP',     last:'5m',  status:'pending', flag:'MFA escalation due' },
    { id:6, n:'Suri Wen',       e:'suri@abstrekkt.ax',     role:'Governance',  team:'Ops',        mfa:'Hardware', last:'3h',  status:'active'  },
    { id:7, n:'Anwar Lemay',    e:'anwar@abstrekkt.ax',    role:'Engineering', team:'Support',    mfa:'TOTP',     last:'2d',  status:'active'  },
    { id:8, n:'Iris Doher',     e:'iris@ext-consult.co',   role:'Contractor',  team:'GTM',        mfa:'TOTP',     last:'14d', status:'expiring',flag:'expires Aug 02' },
    { id:9, n:'Audit Co · 4',   e:'partner@kreon-audit.ax',role:'Auditor (RO)',team:'External',   mfa:'Hardware', last:'40m', status:'active'  },
  ];

  const statusMap = {
    active:    { l:'ACTIVE',    c:'#10B981', bg:'rgba(16,185,129,.10)', bd:'rgba(16,185,129,.30)' },
    pending:   { l:'PENDING',   c:'#F59E0B', bg:'rgba(245,158,11,.10)', bd:'rgba(245,158,11,.30)' },
    expiring:  { l:'EXPIRING',  c:'#FBBC00', bg:'rgba(251,188,0,.10)',bd:'rgba(251,188,0,.30)' },
  };

  return (
    <AppFrame
      active="admin"
      title="Users & roles"
      crumbs={['Workspace','Admin','Users']}
      actions={<>
        <Btn kind="ghost" icon="download" size="sm">Export users</Btn>
        <Btn kind="ghost" icon="upload" size="sm">SCIM sync</Btn>
        <Btn kind="primary" icon="plus" size="sm">Invite user</Btn>
      </>}
    >
      {/* Header / overview */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {[
          ['MEMBERS',  '69', '52 active · 12 RO · 5 contractor', '#FFBF00'],
          ['SSO COVERAGE','94%','64 of 69 via Okta SCIM',         '#A9C7FF'],
          ['HARDWARE MFA','41', '60% of admin + governance',      '#FBBC00'],
          ['ACCESS REVIEWS','12d','next due · 9 Sep',              '#F59E0B'],
        ].map(([l,v,s,c])=>(
          <Card key={l} pad={14}>
            <div style={{fontFamily:'var(--mono)',fontSize:10,letterSpacing:'.14em',color:'var(--muted)'}}>{l}</div>
            <div style={{fontFamily:'var(--mono)',fontSize:22,fontWeight:600,letterSpacing:'-.02em',marginTop:8,color:c}}>{v}</div>
            <div style={{fontSize:11.5,color:'var(--muted)',marginTop:4}}>{s}</div>
          </Card>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1.7fr',gap:14,flex:1,minHeight:0}}>
        {/* Roles panel */}
        <Card pad={0} style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <div style={{padding:'14px 18px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.14em',color:'var(--muted)'}}>ROLES · 5</div>
              <div style={{fontFamily:'var(--mono)',fontSize:14,fontWeight:600,marginTop:2}}>Permission packs</div>
            </div>
            <IconBtn icon="plus" size={28}/>
          </div>
          <div style={{flex:1,overflow:'auto'}}>
            {roles.map((r,i)=>(
              <div key={r.name} style={{
                padding:'14px 18px',borderBottom:i===roles.length-1?'none':'1px solid var(--border)',
                background: i===0 ? 'linear-gradient(90deg, rgba(255,191,0,.06), transparent)' : 'transparent',
                position:'relative',
              }}>
                {i===0 && <span style={{position:'absolute',left:0,top:14,bottom:14,width:2,background:'linear-gradient(180deg,#FFBF00,#FBBC00)',boxShadow:'0 0 8px #FFBF00',borderRadius:2}}/>}
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{width:10,height:10,borderRadius:3,background:r.c,boxShadow:`0 0 8px ${r.c}`}}/>
                    <span style={{fontSize:13.5,color:'var(--text)',fontWeight:500}}>{r.name}</span>
                    <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',padding:'1px 6px',border:'1px solid var(--border)',borderRadius:99}}>{r.n}</span>
                  </div>
                  <Icon name="chevR" size={13} style={{color:'var(--muted)'}}/>
                </div>
                <div style={{fontSize:12,color:'var(--muted)',marginTop:6,lineHeight:1.5}}>{r.desc}</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:4,marginTop:8}}>
                  {r.perms.slice(0,4).map((p,pi)=>(
                    <span key={pi} style={{fontFamily:'var(--mono)',fontSize:10,padding:'2px 6px',borderRadius:4,color:'#D4C5AB',background:'rgba(255,255,255,.03)',border:'1px solid var(--border)'}}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* User table */}
        <Card pad={0} style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <div style={{padding:'12px 18px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{fontFamily:'var(--mono)',fontSize:14,fontWeight:600}}>Members</div>
              <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--muted)'}}>· 69</span>
            </div>
            <div style={{display:'flex',gap:6,alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,padding:'7px 11px',border:'1px solid var(--border)',borderRadius:8,background:'rgba(14,14,16,.6)',width:220}}>
                <Icon name="search" size={13} style={{color:'var(--muted)'}}/>
                <span style={{fontSize:12,color:'var(--muted)',flex:1}}>Find user, role, team…</span>
              </div>
              <Btn kind="ghost" icon="filter" size="sm">All</Btn>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1.7fr 1fr 1fr 0.9fr 0.7fr 32px',gap:12,padding:'10px 18px',borderBottom:'1px dashed var(--border)',fontFamily:'var(--mono)',fontSize:10,letterSpacing:'.14em',color:'var(--muted)'}}>
            <span>USER</span><span>ROLE</span><span>TEAM</span><span>MFA</span><span style={{textAlign:'right'}}>LAST SEEN</span><span/>
          </div>

          <div style={{flex:1,overflow:'auto'}}>
            {users.map((u,i)=>{
              const s = statusMap[u.status];
              return (
                <div key={u.id} style={{
                  display:'grid',gridTemplateColumns:'1.7fr 1fr 1fr 0.9fr 0.7fr 32px',gap:12,alignItems:'center',
                  padding:'13px 18px',borderBottom:i===users.length-1?'none':'1px solid var(--border)',fontSize:13,
                }}>
                  <div style={{display:'flex',alignItems:'center',gap:10,minWidth:0}}>
                    <span style={{width:30,height:30,borderRadius:99,flex:'none',background:`linear-gradient(135deg,#FFBF00,#FBBC00)`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--mono)',fontSize:11,fontWeight:700,color:'#fff'}}>{u.n.split(' ').map(x=>x[0]).slice(0,2).join('')}</span>
                    <div style={{minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <span style={{color:'var(--text)',fontWeight:500,fontSize:13.5}}>{u.n}</span>
                        <span style={{fontFamily:'var(--mono)',fontSize:9.5,padding:'1px 6px',borderRadius:4,color:s.c,background:s.bg,border:`1px solid ${s.bd}`,letterSpacing:'.06em'}}>{s.l}</span>
                      </div>
                      <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{u.e}</div>
                      {u.flag && <div style={{fontFamily:'var(--mono)',fontSize:10,color:'#FFD9A6',marginTop:2,letterSpacing:'.04em'}}>! {u.flag}</div>}
                    </div>
                  </div>
                  <span style={{fontFamily:'var(--mono)',fontSize:11.5,color:'var(--text)',letterSpacing:'.04em'}}>{u.role}</span>
                  <span style={{fontSize:12.5,color:'var(--muted)'}}>{u.team}</span>
                  <span style={{display:'inline-flex',alignItems:'center',gap:6,fontFamily:'var(--mono)',fontSize:11,color:u.mfa==='Hardware'?'#A9C7FF':'var(--muted)'}}>
                    <Icon name={u.mfa==='Hardware'?'shield':'lock'} size={13}/>
                    {u.mfa}
                  </span>
                  <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--muted)',textAlign:'right'}}>{u.last}</span>
                  <IconBtn icon="more" size={28}/>
                </div>
              );
            })}
          </div>

          <div style={{padding:'10px 18px',borderTop:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(14,14,16,.4)'}}>
            <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)'}}>9 of 69 · paginate</span>
            <Btn kind="link" size="sm">Open access review →</Btn>
          </div>
        </Card>
      </div>
    </AppFrame>
  );
}

Object.assign(window, { AdminArtboard });
