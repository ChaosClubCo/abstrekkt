// Foundations: tokens, type, components catalogue.

function Swatch({ name, value, dark }){
  return (
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
      <div style={{height:64,borderRadius:10,background:value,border:'1px solid var(--border)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(255,255,255,.06),transparent 50%)'}}/>
      </div>
      <div style={{fontFamily:'var(--mono)',fontSize:11,letterSpacing:'.04em'}}>{name}</div>
      <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)'}}>{value}</div>
    </div>
  );
}

function FoundationsArtboard(){
  const palette = [
    ['bg', '#0A0A0C'],['surface', '#131315'],['surface-2','#1C1B1D'],['border','#2A2A2C'],
    ['violet (primary)','#FFBF00'],['pink (secondary)','#FBBC00'],['cyan (tertiary)','#A9C7FF'],
    ['text','#E5E1E4'],['muted','#9C8F78'],
    ['danger','#EF4444'],['warning','#F59E0B'],['success','#10B981'],
  ];
  const type = [
    ['Display / 48','Geist Mono · 600 · -0.02em',48,'mono'],
    ['Title / 28','Geist Mono · 600',28,'mono'],
    ['Heading / 18','Geist Mono · 600',18,'mono'],
    ['Body / 14','Inter · 400 · 1.55',14,'sans'],
    ['Caption / 12','Inter · 400 · 1.5',12,'sans'],
    ['Mono / 11','Geist Mono · 500 · .06em',11,'mono'],
  ];
  return (
    <div style={{padding:32,background:'var(--bg)',minHeight:'100%',display:'flex',flexDirection:'column',gap:28,fontFamily:'var(--sans)',color:'var(--text)'}}>
      {/* Brand strip */}
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',borderBottom:'1px solid var(--border)',paddingBottom:18}}>
        <div>
          <Logo size={28} label="Abstrekkt" />
          <div style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--muted)',letterSpacing:'.10em',marginTop:14}}>DESIGN SYSTEM · v3.1.0 · ABSTREKKT/AX</div>
          <div style={{fontFamily:'var(--mono)',fontSize:34,fontWeight:600,letterSpacing:'-.02em',marginTop:6}}>AI Assessment, Neon-glass dark.</div>
          <div style={{maxWidth:640,color:'var(--muted)',fontSize:13.5,marginTop:8,lineHeight:1.6}}>
            Sophisticated dark UI for high-trust enterprise workflows. Glow is reserved for active states and primary CTAs. Type is rhythmic: Geist Mono carries the system voice; Inter handles prose. No default Tailwind blues, no generic gray.
          </div>
        </div>
        <div style={{display:'flex',gap:10}}>
          <Btn kind="ghost" icon="copy">Copy tokens</Btn>
          <Btn kind="primary" icon="download">Download kit</Btn>
        </div>
      </div>

      {/* Tokens */}
      <Card pad={24}>
        <SectionTitle eyebrow="01 · TOKENS" title="Colors" right={<span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)'}}>HEX · OKLCH · TAILWIND VAR</span>}/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(6, 1fr)',gap:18,marginTop:18}}>
          {palette.map(([n,v]) => <Swatch key={n} name={n} value={v}/>)}
        </div>

        <div style={{height:1,background:'var(--border)',margin:'24px 0'}}/>

        <SectionTitle eyebrow="02 · TOKENS" title="Type scale" />
        <div style={{display:'flex',flexDirection:'column',gap:16,marginTop:16}}>
          {type.map(([label,meta,sz,fam])=>(
            <div key={label} style={{display:'flex',alignItems:'baseline',gap:24,borderBottom:'1px dashed var(--border)',paddingBottom:14}}>
              <div style={{width:160,fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',letterSpacing:'.08em'}}>{label}</div>
              <div style={{fontFamily:fam==='mono'?'var(--mono)':'var(--sans)',fontSize:sz,fontWeight: sz>=18 ? 600 : 400,letterSpacing: sz>=28?'-.02em':sz<=12?'.04em':'0',lineHeight:1.2}}>
                {fam==='mono' ? 'ABSTREKKT // GOVERNANCE' : 'Auditable AI for grown-up companies.'}
              </div>
              <div style={{marginLeft:'auto',fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)'}}>{meta}</div>
            </div>
          ))}
        </div>

        <div style={{height:1,background:'var(--border)',margin:'24px 0'}}/>

        <SectionTitle eyebrow="03 · TOKENS" title="Spacing / radii / shadow" />
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:24,marginTop:18}}>
          {/* Spacing */}
          <div>
            <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',marginBottom:12,letterSpacing:'.10em'}}>SPACING · 4PX BASE</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {[4,8,12,16,24,32,48].map(s=>(
                <div key={s} style={{display:'flex',alignItems:'center',gap:14}}>
                  <span style={{width:32,fontFamily:'var(--mono)',fontSize:11,color:'var(--muted)'}}>{s}</span>
                  <div style={{height:8,width:s*3,background:'linear-gradient(90deg,#FFBF00,#FBBC00)',borderRadius:2,boxShadow:'0 0 12px rgba(255,191,0,.4)'}}/>
                </div>
              ))}
            </div>
          </div>
          {/* Radii */}
          <div>
            <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',marginBottom:12,letterSpacing:'.10em'}}>RADIUS</div>
            <div style={{display:'flex',gap:10}}>
              {[{n:'sm',r:6},{n:'md',r:10},{n:'lg',r:14},{n:'xl',r:20},{n:'pill',r:999}].map(x=>(
                <div key={x.n} style={{flex:1,textAlign:'center'}}>
                  <div style={{height:54,background:'rgba(255,191,0,.10)',border:'1px solid rgba(255,191,0,.30)',borderRadius:x.r}}/>
                  <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',marginTop:6}}>{x.n} · {x.r===999?'∞':x.r}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Shadow */}
          <div>
            <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',marginBottom:12,letterSpacing:'.10em'}}>ELEVATION & GLOW</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div style={{height:64,borderRadius:10,background:'var(--surface)',border:'1px solid var(--border)',boxShadow:'0 10px 30px -20px rgba(0,0,0,.7)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)'}}>card</div>
              <div style={{height:64,borderRadius:10,background:'var(--surface)',border:'1px solid var(--border)',boxShadow:'0 20px 60px -20px rgba(0,0,0,.85), 0 1px 0 rgba(255,255,255,.04) inset',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)'}}>modal</div>
              <div style={{height:64,borderRadius:10,background:'var(--surface)',border:'1px solid rgba(255,191,0,.4)',boxShadow:'0 0 0 1px rgba(255,191,0,.25), 0 0 32px -4px rgba(255,191,0,.5)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--mono)',fontSize:10.5,color:'#FFEFCC'}}>glow / focus</div>
              <div style={{height:64,borderRadius:10,background:'var(--surface)',border:'1px solid rgba(251,188,0,.4)',boxShadow:'0 0 0 1px rgba(251,188,0,.20), 0 0 24px -4px rgba(251,188,0,.45)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--mono)',fontSize:10.5,color:'#FFD9A6'}}>flag glow</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Components catalogue */}
      <Card pad={24}>
        <SectionTitle eyebrow="04 · COMPONENTS" title="Buttons, badges, severity, status" />
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginTop:18}}>
          <div>
            <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',letterSpacing:'.10em',marginBottom:12}}>BUTTONS · States</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:10,alignItems:'center'}}>
              <Btn kind="primary" icon="bolt">Run assessment</Btn>
              <Btn kind="secondary" icon="plus">Add rule</Btn>
              <Btn kind="ghost" icon="filter">Filter</Btn>
              <Btn kind="danger" icon="warn">Revoke</Btn>
              <Btn kind="link">View detail →</Btn>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:10,marginTop:12}}>
              <Btn kind="primary" size="sm">SM</Btn>
              <Btn kind="primary" size="md">MD</Btn>
              <Btn kind="primary" size="lg">LG</Btn>
              <button disabled style={{padding:'9px 14px',borderRadius:10,fontFamily:'var(--mono)',fontSize:12,background:'rgba(255,255,255,.04)',border:'1px solid var(--border)',color:'var(--muted)',cursor:'not-allowed'}}>Disabled</button>
              <button style={{padding:'9px 14px',borderRadius:10,fontFamily:'var(--mono)',fontSize:12,background:'rgba(255,191,0,.10)',border:'1px solid rgba(255,191,0,.50)',color:'#FFEFCC',display:'inline-flex',alignItems:'center',gap:8}}>
                <span style={{width:10,height:10,border:'2px solid #FFEFCC',borderTopColor:'transparent',borderRadius:99,display:'inline-block'}}/>Loading
              </button>
            </div>
          </div>

          <div>
            <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',letterSpacing:'.10em',marginBottom:12}}>STATUS · BADGES</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              <Badge kind="pending">Pending</Badge>
              <Badge kind="progress">In Progress</Badge>
              <Badge kind="completed">Completed</Badge>
              <Badge kind="flagged">Flagged</Badge>
              <Badge kind="success">Attested</Badge>
              <Badge kind="warning">Stale</Badge>
              <Badge kind="danger">Blocked</Badge>
            </div>
            <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',letterSpacing:'.10em',margin:'18px 0 12px'}}>SEVERITY</div>
            <div style={{display:'flex',gap:18,flexWrap:'wrap'}}>
              <Severity level="Critical"/>
              <Severity level="High"/>
              <Severity level="Medium"/>
              <Severity level="Low"/>
            </div>
          </div>

          <div>
            <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',letterSpacing:'.10em',marginBottom:12}}>FORM · Field states</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <Field label="Default" placeholder="Project name" />
              <Field label="Focused" value="vendor-llm-eval" focused icon="search"/>
              <Field label="Filled" value="orion@abstrekkt.ax" icon="mail"/>
              <Field label="Error" value="b@d" error="Must be a corporate email." icon="mail"/>
            </div>
          </div>

          <div>
            <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',letterSpacing:'.10em',marginBottom:12}}>CONTROLS · Toggle / Radio / Select</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {/* Toggle */}
              <div style={{padding:12,border:'1px solid var(--border)',borderRadius:10,background:'rgba(14,14,16,.6)'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:12.5}}>Anonymize PII</span>
                  <span style={{width:34,height:18,borderRadius:99,background:'linear-gradient(90deg,#FFBF00,#FBBC00)',position:'relative',boxShadow:'0 0 10px rgba(255,191,0,.5)'}}>
                    <span style={{position:'absolute',top:2,left:18,width:14,height:14,borderRadius:99,background:'#fff'}}/>
                  </span>
                </div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:10}}>
                  <span style={{fontSize:12.5,color:'var(--muted)'}}>Auto-export to S3</span>
                  <span style={{width:34,height:18,borderRadius:99,background:'rgba(148,163,184,.20)',position:'relative'}}>
                    <span style={{position:'absolute',top:2,left:2,width:14,height:14,borderRadius:99,background:'#5B677A'}}/>
                  </span>
                </div>
              </div>
              {/* Segmented */}
              <div style={{padding:4,border:'1px solid var(--border)',borderRadius:10,background:'rgba(14,14,16,.6)',display:'flex'}}>
                {['Day','Week','Quarter','YTD'].map((s,i)=>(
                  <div key={s} style={{flex:1,padding:'8px 0',textAlign:'center',fontFamily:'var(--mono)',fontSize:11,
                    color:i===1?'#fff':'var(--muted)',
                    background: i===1 ? 'linear-gradient(180deg,#FFBF00,#E0A800)' : 'transparent',
                    borderRadius:7,
                    boxShadow: i===1?'0 6px 18px -6px rgba(255,191,0,.6)':'none',
                  }}>{s}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Handoff */}
      <Card pad={24}>
        <SectionTitle eyebrow="05 · HANDOFF" title="Next.js + Tailwind + shadcn/ui notes" />
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginTop:16,fontFamily:'var(--mono)',fontSize:11.5,lineHeight:1.7}}>
          <div style={{padding:14,border:'1px solid var(--border)',borderRadius:10,background:'rgba(14,14,16,.6)'}}>
            <div style={{color:'#A9C7FF',letterSpacing:'.08em',marginBottom:6}}>// tailwind.config.ts</div>
            <pre style={{margin:0,whiteSpace:'pre-wrap'}}>{`extend: {
  colors: {
    bg:        '#0A0A0C',
    surface:   '#131315',
    border:    '#2A2A2C',
    violet:    '#FFBF00',
    pink:      '#FBBC00',
    cyan:      '#A9C7FF',
    danger:    '#EF4444',
    warning:   '#F59E0B',
    success:   '#10B981',
    muted:     '#9C8F78',
  },
  fontFamily: {
    mono: ['Geist Mono', 'ui-monospace'],
    sans: ['Inter', 'system-ui'],
  },
  boxShadow: {
    glow: '0 0 0 1px rgba(255,191,0,.25), 0 0 32px -4px rgba(255,191,0,.5)',
  },
}`}</pre>
          </div>
          <div style={{padding:14,border:'1px solid var(--border)',borderRadius:10,background:'rgba(14,14,16,.6)'}}>
            <div style={{color:'#FFD9A6',letterSpacing:'.08em',marginBottom:6}}>// rules</div>
            <ul style={{margin:0,paddingLeft:18,color:'var(--text)'}}>
              <li>Server components by default. Mark interactive surfaces `use client`.</li>
              <li>Forms: react-hook-form + zod. Inline errors live in `Field`.</li>
              <li>Recharts theme overrides FlashFusion blues → tokens above.</li>
              <li>Focus rings: 3px violet halo @ 18% alpha, visible on dark bg.</li>
              <li>Glow only on: primary CTA, active nav, focused input, flagged states.</li>
              <li>Min contrast: text/bg ≥ 7:1, muted/bg ≥ 4.6:1 (WCAG 2.1 AA pass).</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { FoundationsArtboard });
