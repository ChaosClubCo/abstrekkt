// Shared primitives: Sidebar, Topbar, Badge, Logo, Icon, etc.
// All components in this file are exported to window at the bottom.

const ICONS = {
  // 1.5 stroke, currentColor — keep them lightweight
  bolt:    'M13 2 4 14h7l-1 8 9-12h-7l1-8z',
  shield:  'M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z',
  grid:    'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  list:    'M3 6h18M3 12h18M3 18h18',
  flow:    'M3 12h6m6 0h6M3 6h6m6 0h6M3 18h6m6 0h6',
  rules:   'M4 4h12l4 4v12H4zM8 12h8M8 16h6M8 8h4',
  chart:   'M4 20V8M10 20V4M16 20v-8M22 20H2',
  users:   'M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zM8 13a3 3 0 1 0-3-3 3 3 0 0 0 3 3zM2 20c0-3 2-5 6-5s6 2 6 5M14 20c0-2 2-4 4.5-4S22 18 22 20',
  audit:   'M4 4h12l4 4v12H4zm4 8h8m-8 4h6m-6-8h4',
  cog:     'M12 9a3 3 0 1 0 3 3 3 3 0 0 0-3-3zm9 3-2-1 1-2-2-2-2 1-1-2h-3l-1 2-2-1-2 2 1 2-2 1v3l2 1-1 2 2 2 2-1 1 2h3l1-2 2 1 2-2-1-2 2-1z',
  search:  'M11 4a7 7 0 1 1-7 7 7 7 0 0 1 7-7zm9 16-4.35-4.35',
  bell:    'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9zM10 21a2 2 0 0 0 4 0',
  plus:    'M12 5v14M5 12h14',
  chevR:   'M9 6l6 6-6 6',
  chevD:   'M6 9l6 6 6-6',
  arrowR:  'M5 12h14M13 6l6 6-6 6',
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
  arrowDn: 'M12 5v14M18 13l-6 6-6-6',
  check:   'M5 13l4 4L19 7',
  x:       'M6 6l12 12M18 6L6 18',
  dot:     'M12 12m-4 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0',
  warn:    'M12 3 2 21h20zM12 10v5M12 18v.5',
  fire:    'M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 1-5 1 1 1 2 3-3z',
  lock:    'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  mail:    'M3 6h18v12H3zM3 6l9 7 9-7',
  download:'M12 4v12M7 11l5 5 5-5M4 20h16',
  filter:  'M4 5h16l-6 8v6l-4-2v-4z',
  more:    'M5 12h.01M12 12h.01M19 12h.01',
  upload:  'M12 20V8M7 13l5-5 5 5M4 4h16',
  eye:     'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 3 3 3 3 0 0 0-3-3z',
  spark:   'M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8',
  refresh: 'M21 12a9 9 0 1 1-3-6.7M21 4v5h-5',
  copy:    'M9 9h11v11H9zM5 15H4V4h11v1',
};

function Icon({ name, size = 16, stroke = 1.5, fill = 'none', style }){
  const d = ICONS[name];
  if (!d) return null;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{flex:'none',display:'block',...style}}>
      <path d={d} />
    </svg>
  );
}

function Logo({ size = 22, label = 'Abstrekkt' }){
  // Abstrekkt mark: a fractured / chaotic ring — three arcs offset like a glitched circle.
  return (
    <div style={{display:'inline-flex',alignItems:'center',gap:10,fontFamily:'var(--mono)',color:'var(--text)',letterSpacing:'.04em'}}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="ccGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFBF00"/>
            <stop offset="60%" stopColor="#FBBC00"/>
            <stop offset="100%" stopColor="#A9C7FF"/>
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="9" stroke="url(#ccGlow)" strokeWidth="2" strokeDasharray="14 4 22 4" />
        <circle cx="12" cy="12" r="3" fill="url(#ccGlow)" />
      </svg>
      {label ? <span style={{fontSize:13,fontWeight:600}}>{label}<span style={{color:'var(--violet)'}}>/</span><span style={{color:'var(--muted)',fontWeight:400}}>ax</span></span> : null}
    </div>
  );
}

function Badge({ kind = 'pending', children, dot = true }){
  const map = {
    pending:    { fg:'#D4C5AB', bg:'rgba(148,163,184,.10)', bd:'rgba(148,163,184,.25)', dot:'#9C8F78' },
    progress:   { fg:'#A9C7FF', bg:'rgba(169,199,255,.10)',  bd:'rgba(169,199,255,.35)',  dot:'#A9C7FF' },
    completed:  { fg:'#FFE2AB', bg:'rgba(255,191,0,.12)',  bd:'rgba(255,191,0,.40)',  dot:'#FFBF00' },
    flagged:    { fg:'#FFD9A6', bg:'rgba(251,188,0,.12)', bd:'rgba(251,188,0,.40)', dot:'#FBBC00' },
    danger:     { fg:'#FCA5A5', bg:'rgba(239,68,68,.12)',   bd:'rgba(239,68,68,.40)',   dot:'#EF4444' },
    warning:    { fg:'#FCD34D', bg:'rgba(245,158,11,.12)',  bd:'rgba(245,158,11,.40)',  dot:'#F59E0B' },
    success:    { fg:'#6EE7B7', bg:'rgba(16,185,129,.12)',  bd:'rgba(16,185,129,.40)',  dot:'#10B981' },
    neutral:    { fg:'#E5E1E4', bg:'rgba(255,255,255,.04)', bd:'rgba(255,255,255,.10)', dot:'#9C8F78' },
  };
  const c = map[kind] || map.pending;
  return (
    <span style={{
      display:'inline-flex',alignItems:'center',gap:6,
      padding:'3px 8px',borderRadius:999,fontFamily:'var(--mono)',fontSize:10.5,fontWeight:500,
      letterSpacing:'.06em',textTransform:'uppercase',
      color:c.fg, background:c.bg, border:`1px solid ${c.bd}`,
    }}>
      {dot && <span style={{width:5,height:5,borderRadius:99,background:c.dot,boxShadow:`0 0 6px ${c.dot}`}}/>}
      {children}
    </span>
  );
}

function Severity({ level='Low' }){
  const m = {
    Critical:{ color:'#EF4444', fill:'rgba(239,68,68,.14)', n:4 },
    High:    { color:'#F59E0B', fill:'rgba(245,158,11,.14)', n:3 },
    Medium:  { color:'#FACC15', fill:'rgba(250,204,21,.14)', n:2 },
    Low:     { color:'#10B981', fill:'rgba(16,185,129,.14)', n:1 },
  }[level];
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:8,fontFamily:'var(--mono)',fontSize:11,color:m.color,letterSpacing:'.06em'}}>
      <span style={{display:'inline-flex',gap:2}}>
        {[0,1,2,3].map(i => (
          <span key={i} style={{
            width:3,height:10+i*2,borderRadius:1,
            background: i < m.n ? m.color : 'rgba(148,163,184,.18)',
            boxShadow: i < m.n ? `0 0 4px ${m.color}` : 'none',
          }}/>
        ))}
      </span>
      <span style={{textTransform:'uppercase',fontWeight:600}}>{level}</span>
    </span>
  );
}

function Btn({ kind='primary', size='md', icon, children, style, full }){
  const base = {
    display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,
    fontFamily:'var(--mono)',fontWeight:500,letterSpacing:'.04em',
    border:'1px solid transparent',cursor:'pointer',userSelect:'none',
    transition:'all .15s ease',width: full ? '100%' : 'auto',
  };
  const sizes = {
    sm:{ padding:'6px 10px', fontSize:11, borderRadius:8 },
    md:{ padding:'9px 14px', fontSize:12, borderRadius:10 },
    lg:{ padding:'12px 18px', fontSize:13, borderRadius:12 },
  }[size];
  const kinds = {
    primary:{
      color:'#fff',
      background:'linear-gradient(180deg, #FFD166, #E0A800)',
      borderColor:'rgba(255,191,0,.6)',
      boxShadow:'0 0 0 1px rgba(255,191,0,.2), 0 8px 24px -8px rgba(255,191,0,.6), inset 0 1px 0 rgba(255,255,255,.18)',
    },
    secondary:{
      color:'#FFEFCC',
      background:'rgba(255,191,0,.10)',
      borderColor:'rgba(255,191,0,.35)',
    },
    ghost:{
      color:'var(--text)',
      background:'rgba(255,255,255,.03)',
      borderColor:'rgba(255,255,255,.08)',
    },
    danger:{
      color:'#fff',
      background:'linear-gradient(180deg, #F47171, #DC3434)',
      borderColor:'rgba(239,68,68,.6)',
      boxShadow:'0 0 0 1px rgba(239,68,68,.2), 0 6px 18px -6px rgba(239,68,68,.55)',
    },
    link:{ color:'var(--violet)', background:'transparent', borderColor:'transparent', padding:0 },
  }[kind];
  return (
    <button style={{...base,...sizes,...kinds,...style}}>
      {icon && <Icon name={icon} size={size==='lg'?16:14} />}
      {children}
    </button>
  );
}

function IconBtn({ icon, title, active, size = 32 }){
  return (
    <button title={title} style={{
      width:size,height:size,display:'inline-flex',alignItems:'center',justifyContent:'center',
      borderRadius:8, cursor:'pointer',
      color: active ? '#FFEFCC' : 'var(--muted)',
      background: active ? 'rgba(255,191,0,.10)' : 'rgba(255,255,255,.02)',
      border: `1px solid ${active ? 'rgba(255,191,0,.35)' : 'rgba(255,255,255,.06)'}`,
    }}>
      <Icon name={icon} size={15} />
    </button>
  );
}

function Card({ children, style, pad = 18, glow=false }){
  return (
    <div style={{
      background:'linear-gradient(180deg, rgba(28,27,29,.85), rgba(19,19,21,.85))',
      border:'1px solid var(--border)',
      borderRadius:14,
      padding:pad,
      boxShadow: glow
        ? '0 0 0 1px rgba(255,191,0,.18), 0 20px 60px -20px rgba(255,191,0,.35)'
        : '0 1px 0 rgba(255,255,255,.02) inset, 0 10px 30px -20px rgba(0,0,0,.7)',
      ...style,
    }}>{children}</div>
  );
}

function Field({ label, value, placeholder, hint, error, icon, type='text', focused=false, style }){
  return (
    <label style={{display:'flex',flexDirection:'column',gap:6,fontFamily:'var(--sans)',...style}}>
      {label && <span style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.10em',textTransform:'uppercase',color:error ? '#FCA5A5' : 'var(--muted)'}}>{label}</span>}
      <div style={{
        display:'flex',alignItems:'center',gap:8,
        padding:'10px 12px',borderRadius:10,
        background:'rgba(14,14,16,.6)',
        border:`1px solid ${error ? 'rgba(239,68,68,.6)' : focused ? 'rgba(255,191,0,.55)' : 'var(--border)'}`,
        boxShadow: focused ? '0 0 0 3px rgba(255,191,0,.18), 0 0 24px -8px rgba(255,191,0,.5)' : (error ? '0 0 0 3px rgba(239,68,68,.15)' : 'none'),
      }}>
        {icon && <span style={{color:'var(--muted)'}}><Icon name={icon} size={14}/></span>}
        <span style={{fontSize:13,color: value ? 'var(--text)' : 'var(--muted)',flex:1,fontFamily: type==='code' ? 'var(--mono)' : 'var(--sans)'}}>
          {value || placeholder}
        </span>
        {focused && <span style={{width:1,height:14,background:'var(--violet)',animation:'none'}}/>}
      </div>
      {error && <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'#FCA5A5'}}>! {error}</span>}
      {!error && hint && <span style={{fontSize:11.5,color:'var(--muted)'}}>{hint}</span>}
    </label>
  );
}

// Sidebar — reused across all 8 app screens
function Sidebar({ active = 'dashboard', collapsed=false }){
  const items = [
    { id:'dashboard',  label:'Dashboard',     icon:'grid' },
    { id:'projects',   label:'Projects',      icon:'list' },
    { id:'assessment', label:'Assessments',   icon:'flow' },
    { id:'rules',      label:'Compliance',    icon:'rules' },
    { id:'reports',    label:'Reports',       icon:'chart' },
    { id:'admin',      label:'Users & Roles', icon:'users' },
    { id:'audit',      label:'Audit Log',     icon:'audit' },
  ];
  const W = collapsed ? 64 : 232;
  return (
    <aside style={{
      width:W,flex:`0 0 ${W}px`,
      background:'linear-gradient(180deg, #131315, #0E0E10)',
      borderRight:'1px solid var(--border)',
      display:'flex',flexDirection:'column',
      padding:'18px 12px',gap:18,
    }}>
      <div style={{padding:'4px 8px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Logo label={collapsed?'':'Abstrekkt'} />
        {!collapsed && <span style={{fontFamily:'var(--mono)',fontSize:9,color:'var(--muted)',padding:'2px 6px',border:'1px solid var(--border)',borderRadius:4}}>v3.1.0</span>}
      </div>

      {!collapsed && (
        <div style={{
          margin:'0 4px',padding:'10px 12px',
          background:'rgba(255,191,0,.06)',
          border:'1px solid rgba(255,191,0,.18)',borderRadius:10,
          display:'flex',alignItems:'center',gap:10,
        }}>
          <div style={{width:28,height:28,borderRadius:8,background:'linear-gradient(135deg,#FFBF00,#FBBC00)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--mono)',fontSize:11,fontWeight:700,color:'#fff'}}>OB</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,color:'var(--text)',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>Orion Brink</div>
            <div style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--muted)',letterSpacing:'.06em'}}>LEGAL · ADMIN</div>
          </div>
          <Icon name="chevD" size={12} style={{color:'var(--muted)'}} />
        </div>
      )}

      <div style={{display:'flex',flexDirection:'column',gap:2}}>
        {!collapsed && <div style={{fontFamily:'var(--mono)',fontSize:9.5,color:'var(--muted)',letterSpacing:'.14em',padding:'4px 10px 8px'}}>WORKSPACE</div>}
        {items.map(it => {
          const on = it.id === active;
          return (
            <div key={it.id} style={{
              display:'flex',alignItems:'center',gap:12,
              padding: collapsed ? '10px' : '9px 12px',
              borderRadius:10,
              justifyContent: collapsed?'center':'flex-start',
              color: on ? '#E5E1E4' : 'var(--muted)',
              background: on ? 'linear-gradient(90deg, rgba(255,191,0,.18), rgba(255,191,0,.02))' : 'transparent',
              border:`1px solid ${on ? 'rgba(255,191,0,.30)' : 'transparent'}`,
              position:'relative',
            }}>
              {on && <span style={{position:'absolute',left:-12,top:8,bottom:8,width:2,borderRadius:2,background:'linear-gradient(180deg,#FFBF00,#FBBC00)',boxShadow:'0 0 10px #FFBF00'}}/>}
              <Icon name={it.icon} size={16} />
              {!collapsed && <span style={{fontSize:13,fontWeight: on ? 500 : 400}}>{it.label}</span>}
              {!collapsed && it.id==='assessment' && <span style={{marginLeft:'auto',fontFamily:'var(--mono)',fontSize:10,color:'#A9C7FF',background:'rgba(169,199,255,.10)',padding:'1px 6px',borderRadius:99,border:'1px solid rgba(169,199,255,.30)'}}>12</span>}
              {!collapsed && it.id==='rules' && <span style={{marginLeft:'auto',fontFamily:'var(--mono)',fontSize:10,color:'#FFD9A6',background:'rgba(251,188,0,.10)',padding:'1px 6px',borderRadius:99,border:'1px solid rgba(251,188,0,.30)'}}>3</span>}
            </div>
          );
        })}
      </div>

      <div style={{marginTop:'auto',display:'flex',flexDirection:'column',gap:8}}>
        {!collapsed && (
          <div style={{margin:'0 4px',padding:'12px',border:'1px dashed var(--border)',borderRadius:10,background:'rgba(169,199,255,.04)'}}>
            <div style={{fontFamily:'var(--mono)',fontSize:10,color:'#A9C7FF',letterSpacing:'.10em'}}>EU AI ACT · Q3</div>
            <div style={{fontSize:12,color:'var(--text)',marginTop:4,lineHeight:1.4}}>4 controls require attestation by Aug 02.</div>
            <div style={{marginTop:8,display:'flex',gap:6}}>
              <Btn kind="secondary" size="sm">Review</Btn>
              <Btn kind="ghost" size="sm">Snooze</Btn>
            </div>
          </div>
        )}
        <div style={{display:'flex',alignItems:'center',justifyContent:collapsed?'center':'space-between',padding:'6px 8px',color:'var(--muted)'}}>
          {!collapsed && <span style={{fontFamily:'var(--mono)',fontSize:10}}>Help · Shortcuts</span>}
          <Icon name="cog" size={15} />
        </div>
      </div>
    </aside>
  );
}

function Topbar({ title, crumbs=[], actions, search='Search projects, rules, controls…' }){
  return (
    <div style={{
      display:'flex',alignItems:'center',gap:16,
      padding:'14px 22px',
      borderBottom:'1px solid var(--border)',
      background:'linear-gradient(180deg, rgba(28,27,29,.6), rgba(14,14,16,.2))',
    }}>
      <div style={{display:'flex',flexDirection:'column',gap:3,minWidth:0}}>
        {crumbs.length>0 && (
          <div style={{display:'flex',alignItems:'center',gap:6,fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',letterSpacing:'.06em'}}>
            {crumbs.map((c,i)=>(
              <React.Fragment key={i}>
                <span style={{color: i===crumbs.length-1?'var(--text)':'var(--muted)'}}>{c}</span>
                {i<crumbs.length-1 && <span>/</span>}
              </React.Fragment>
            ))}
          </div>
        )}
        <div style={{fontFamily:'var(--mono)',fontSize:18,fontWeight:600,letterSpacing:'-.01em'}}>{title}</div>
      </div>
      <div style={{flex:1,maxWidth:480,marginLeft:24}}>
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',border:'1px solid var(--border)',borderRadius:10,background:'rgba(14,14,16,.6)'}}>
          <Icon name="search" size={14} style={{color:'var(--muted)'}}/>
          <span style={{fontSize:12.5,color:'var(--muted)',flex:1}}>{search}</span>
          <span style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--muted)',padding:'2px 6px',border:'1px solid var(--border)',borderRadius:5}}>⌘K</span>
        </div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8,marginLeft:'auto'}}>
        {actions}
        <IconBtn icon="bell" title="Notifications" />
        <div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#FFBF00,#FBBC00)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--mono)',fontSize:11,fontWeight:700,color:'#fff'}}>OB</div>
      </div>
    </div>
  );
}

// Reusable app frame
function AppFrame({ active, title, crumbs, actions, children, search }){
  return (
    <div style={{display:'flex',width:'100%',height:'100%',fontFamily:'var(--sans)',color:'var(--text)',background:'var(--bg)'}}>
      <Sidebar active={active} />
      <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column'}}>
        <Topbar title={title} crumbs={crumbs} actions={actions} search={search}/>
        <div style={{flex:1,overflow:'hidden',padding:'22px 26px',display:'flex',flexDirection:'column',gap:18}}>
          {children}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, children, right }){
  return (
    <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:16}}>
      <div>
        {eyebrow && <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.14em',color:'var(--muted)',textTransform:'uppercase'}}>{eyebrow}</div>}
        <div style={{fontFamily:'var(--mono)',fontSize:15,fontWeight:600,marginTop:4}}>{title}</div>
        {children && <div style={{fontSize:13,color:'var(--muted)',marginTop:4,maxWidth:560,lineHeight:1.5}}>{children}</div>}
      </div>
      {right}
    </div>
  );
}

// Sparkline / mini chart used inside KPI cards
function Spark({ data, color='#FFBF00', height=36, width=120 }){
  const max = Math.max(...data), min = Math.min(...data);
  const span = Math.max(1, max-min);
  const pts = data.map((v,i)=>{
    const x = (i/(data.length-1))*width;
    const y = height - ((v-min)/span)*height;
    return [x,y];
  });
  const d = pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area = d + ` L ${width} ${height} L 0 ${height} Z`;
  const id = 'sg-'+color.replace('#','');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".45"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`}/>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

Object.assign(window, { Icon, ICONS, Logo, Badge, Severity, Btn, IconBtn, Card, Field, Sidebar, Topbar, AppFrame, SectionTitle, Spark });
