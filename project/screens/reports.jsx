// Reports — analytics overview with multiple chart types.

function ReportsArtboard(){
  // Findings by framework (stacked area)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'];
  const series = [
    { name:'EU AI Act', color:'#FFBF00', data:[12, 14, 18, 17, 22, 28, 24, 31, 27] },
    { name:'NIST RMF',  color:'#FBBC00', data:[8,  10, 12, 14, 16, 14, 18, 21, 19] },
    { name:'SOC 2',     color:'#A9C7FF', data:[18, 16, 22, 20, 24, 26, 28, 26, 30] },
    { name:'ISO 42001', color:'#10B981', data:[4,  6,  8,  7,  9,  11, 10, 13, 12] },
  ];
  const stacked = months.map((_,i)=> series.reduce((a,s)=>a+s.data[i],0));
  const maxStack = Math.max(...stacked);
  const W = 580, H = 220;

  // Severity distribution donut
  const sev = [
    { label:'Critical', n:8,  c:'#EF4444' },
    { label:'High',     n:21, c:'#F59E0B' },
    { label:'Medium',   n:36, c:'#FACC15' },
    { label:'Low',      n:54, c:'#10B981' },
  ];
  const sevTotal = sev.reduce((a,s)=>a+s.n,0);

  return (
    <AppFrame
      active="reports"
      title="Reports · governance posture"
      crumbs={['Workspace','Reports','Posture']}
      actions={<>
        <Btn kind="ghost" icon="filter"   size="sm">Q3 · all teams</Btn>
        <Btn kind="ghost" icon="download" size="sm">Export PDF</Btn>
        <Btn kind="primary" icon="plus"   size="sm">New report</Btn>
      </>}
    >
      {/* KPI strip */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:14}}>
        {[
          ['POSTURE',   '87',  '/100', '+4', '#FFBF00'],
          ['ATTESTED',  '94%', '',     '+1.2%', '#10B981'],
          ['MTTR · DAYS','2.4', '',    '−0.6', '#A9C7FF'],
          ['BLOCKS',    '12',  '',     '−4', '#FBBC00'],
          ['SPEND · USD','41K','/mo',  '+8%', '#F59E0B'],
        ].map(([l,v,u,d,c])=>(
          <Card key={l} pad={14}>
            <div style={{fontFamily:'var(--mono)',fontSize:10,letterSpacing:'.14em',color:'var(--muted)'}}>{l}</div>
            <div style={{display:'flex',alignItems:'baseline',gap:4,marginTop:8}}>
              <div style={{fontFamily:'var(--mono)',fontSize:26,fontWeight:600,letterSpacing:'-.02em',color:c}}>{v}</div>
              <div style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--muted)'}}>{u}</div>
            </div>
            <div style={{fontFamily:'var(--mono)',fontSize:10.5,color: d.startsWith('-') || d.startsWith('−') ? '#6EE7B7' : '#FFD9A6',marginTop:4,letterSpacing:'.04em'}}>{d} vs prev period</div>
          </Card>
        ))}
      </div>

      {/* Main: stacked findings + severity donut */}
      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:14}}>
        <Card pad={20}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.14em',color:'var(--muted)'}}>FINDINGS · BY FRAMEWORK</div>
              <div style={{fontFamily:'var(--mono)',fontSize:15,fontWeight:600,marginTop:4}}>9-month trend</div>
            </div>
            <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
              {series.map(s=>(
                <span key={s.name} style={{display:'inline-flex',alignItems:'center',gap:6,fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',letterSpacing:'.04em'}}>
                  <span style={{width:10,height:3,background:s.color,boxShadow:`0 0 6px ${s.color}`,borderRadius:99}}/>
                  {s.name.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* SVG stacked area */}
          <svg viewBox={`0 0 ${W} ${H+36}`} style={{width:'100%',height:'auto',marginTop:18,display:'block'}}>
            <defs>
              {series.map(s=>(
                <linearGradient key={s.name} id={`g${s.name.replace(/[^a-z]/gi,'')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity=".55"/>
                  <stop offset="100%" stopColor={s.color} stopOpacity="0"/>
                </linearGradient>
              ))}
            </defs>

            {/* gridlines */}
            {[0,1,2,3,4].map(i=>{
              const y = (i/4)*H;
              return <line key={i} x1="36" x2={W} y1={y} y2={y} stroke="rgba(255,255,255,.05)"/>;
            })}
            {[0,1,2,3,4].map(i=>(
              <text key={i} x="30" y={(i/4)*H + 4} textAnchor="end" fontFamily="var(--mono)" fontSize="9" fill="#9C8F78">{Math.round(maxStack*(1-i/4))}</text>
            ))}

            {/* stacked areas */}
            {(()=>{
              const layers = [];
              let cum = months.map(()=>0);
              for (let s of series) {
                const top = months.map((_,i)=> cum[i] + s.data[i]);
                const pts = months.map((_,i)=>{
                  const x = 36 + (i/(months.length-1))*(W-40);
                  return [x, H - (top[i]/maxStack)*H];
                });
                const ptsBot = months.map((_,i)=>{
                  const x = 36 + (i/(months.length-1))*(W-40);
                  return [x, H - (cum[i]/maxStack)*H];
                }).reverse();
                const d = pts.map((p,i)=>(i?'L':'M')+p[0]+' '+p[1]).join(' ') + ' ' +
                          ptsBot.map(p=>'L'+p[0]+' '+p[1]).join(' ') + ' Z';
                layers.push(<path key={s.name+'a'} d={d} fill={`url(#g${s.name.replace(/[^a-z]/gi,'')})`}/>);
                layers.push(<path key={s.name+'l'} d={pts.map((p,i)=>(i?'L':'M')+p[0]+' '+p[1]).join(' ')} stroke={s.color} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>);
                cum = top;
              }
              return layers;
            })()}

            {/* x axis */}
            {months.map((m,i)=>(
              <text key={m} x={36+(i/(months.length-1))*(W-40)} y={H+18} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="#9C8F78" letterSpacing=".06em">{m.toUpperCase()}</text>
            ))}

            {/* highlight last */}
            <line x1={W} x2={W} y1="0" y2={H} stroke="#FFBF00" strokeWidth="1" strokeDasharray="2 3" opacity=".5"/>
            <circle cx={W} cy={H - (stacked[stacked.length-1]/maxStack)*H} r="5" fill="#FFBF00" style={{filter:'drop-shadow(0 0 6px #FFBF00)'}}/>
            <text x={W-8} y={H - (stacked[stacked.length-1]/maxStack)*H - 10} textAnchor="end" fontFamily="var(--mono)" fontSize="11" fontWeight="600" fill="#FFEFCC">{stacked[stacked.length-1]} this mo.</text>
          </svg>
        </Card>

        {/* Severity donut + breakdown */}
        <Card pad={20}>
          <div>
            <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.14em',color:'var(--muted)'}}>SEVERITY MIX · OPEN</div>
            <div style={{fontFamily:'var(--mono)',fontSize:15,fontWeight:600,marginTop:4}}>119 open findings</div>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:18,marginTop:20}}>
            <svg width="150" height="150" viewBox="0 0 150 150" style={{flex:'none'}}>
              <circle cx="75" cy="75" r="55" stroke="rgba(255,255,255,.05)" strokeWidth="18" fill="none"/>
              {(()=>{
                let off = 0;
                return sev.map(s=>{
                  const frac = s.n/sevTotal;
                  const dash = 2*Math.PI*55*frac;
                  const rem = 2*Math.PI*55 - dash;
                  const el = (
                    <circle key={s.label} cx="75" cy="75" r="55" stroke={s.c} strokeWidth="18" fill="none"
                      strokeDasharray={`${dash} ${rem}`} strokeDashoffset={-off}
                      style={{filter:`drop-shadow(0 0 6px ${s.c})`}}/>
                  );
                  off += dash;
                  return el;
                });
              })()}
              <text x="75" y="72" textAnchor="middle" fill="#E5E1E4" fontFamily="var(--mono)" fontWeight="600" fontSize="22" letterSpacing="-.02em">{sevTotal}</text>
              <text x="75" y="90" textAnchor="middle" fill="#9C8F78" fontFamily="var(--mono)" fontSize="9" letterSpacing=".14em">OPEN</text>
            </svg>

            <div style={{flex:1,display:'flex',flexDirection:'column',gap:10}}>
              {sev.map(s=>(
                <div key={s.label}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                    <span style={{width:7,height:7,borderRadius:2,background:s.c,boxShadow:`0 0 5px ${s.c}`}}/>
                    <span style={{fontSize:12.5,color:'var(--text)',flex:1}}>{s.label}</span>
                    <span style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--muted)'}}>{s.n}</span>
                  </div>
                  <div style={{height:3,background:'rgba(255,255,255,.04)',borderRadius:99,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${(s.n/sevTotal)*100}%`,background:s.c,boxShadow:`0 0 6px ${s.c}aa`}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom row: team perf + heatmap */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1.3fr',gap:14}}>
        <Card pad={20}>
          <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.14em',color:'var(--muted)'}}>TEAM · MTTR (DAYS, LOWER BETTER)</div>
          <div style={{fontFamily:'var(--mono)',fontSize:15,fontWeight:600,marginTop:4}}>Resolution velocity</div>
          <div style={{marginTop:16,display:'flex',flexDirection:'column',gap:12}}>
            {[
              ['Legal',     2.1, '#FFBF00'],
              ['Finance',   2.8, '#FBBC00'],
              ['GTM',       3.3, '#A9C7FF'],
              ['Risk',      1.7, '#10B981'],
              ['People',    4.6, '#F59E0B'],
              ['Ops',       2.0, '#A9C7FF'],
            ].map(([n,v,c])=>{
              const pct = Math.min(100, (v/5)*100);
              return (
                <div key={n} style={{display:'grid',gridTemplateColumns:'90px 1fr auto',gap:12,alignItems:'center'}}>
                  <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--muted)',letterSpacing:'.04em',textTransform:'uppercase'}}>{n}</span>
                  <div style={{height:10,background:'rgba(255,255,255,.04)',borderRadius:99,overflow:'hidden',position:'relative'}}>
                    <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg, ${c}, ${c}aa)`,boxShadow:`0 0 10px ${c}aa`,borderRadius:99}}/>
                    {/* target marker */}
                    <div style={{position:'absolute',left:'48%',top:-2,bottom:-2,width:1,background:'rgba(255,255,255,.4)'}}/>
                  </div>
                  <span style={{fontFamily:'var(--mono)',fontSize:13,fontWeight:500,color:'var(--text)',textAlign:'right',minWidth:32}}>{v}d</span>
                </div>
              );
            })}
            <div style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--muted)',marginTop:4,letterSpacing:'.04em'}}>target ≤ 2.4d · marker shown at 2.4</div>
          </div>
        </Card>

        <Card pad={20}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
            <div>
              <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.14em',color:'var(--muted)'}}>COVERAGE × HEAT</div>
              <div style={{fontFamily:'var(--mono)',fontSize:15,fontWeight:600,marginTop:4}}>Rule × dept matrix</div>
            </div>
            <div style={{display:'flex',gap:6,alignItems:'center',fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',letterSpacing:'.04em'}}>
              cold
              <span style={{display:'inline-flex',gap:2}}>
                {['rgba(255,191,0,.12)','rgba(255,191,0,.28)','rgba(255,191,0,.5)','rgba(251,188,0,.65)','#FBBC00'].map((c,i)=>(
                  <span key={i} style={{width:14,height:10,background:c,borderRadius:2,boxShadow:i>2?'0 0 4px rgba(251,188,0,.5)':'none'}}/>
                ))}
              </span>
              hot
            </div>
          </div>

          {(()=>{
            const cols = ['Legal','Finance','GTM','Risk','People','Ops','Support','Internal'];
            const rows = ['EU.14.b','EU.15.c','NIST.GOV.1.2','NIST.MEAS.2.7','ISO.6.1.4','SOC2.CC7.2','HIPAA.312.b','HOUSE.001'];
            const heat = [
              [2,1,0,3,1,2,0,1],
              [4,2,1,2,0,2,1,0],
              [1,3,2,1,1,3,0,2],
              [3,0,1,4,3,2,2,1],
              [1,2,2,1,0,1,1,3],
              [4,4,3,4,4,4,2,3],
              [2,3,0,2,1,2,0,0],
              [3,2,4,3,2,2,1,1],
            ];
            const palette = ['rgba(255,191,0,.10)','rgba(255,191,0,.24)','rgba(255,191,0,.42)','rgba(251,188,0,.55)','#FBBC00'];
            return (
              <div style={{marginTop:18}}>
                <div style={{display:'grid',gridTemplateColumns:`90px repeat(${cols.length}, 1fr)`,gap:3,alignItems:'center'}}>
                  <span/>
                  {cols.map(c=>(
                    <span key={c} style={{fontFamily:'var(--mono)',fontSize:9.5,color:'var(--muted)',letterSpacing:'.04em',textTransform:'uppercase',textAlign:'center'}}>{c}</span>
                  ))}
                  {rows.map((r,ri)=>(
                    <React.Fragment key={r}>
                      <span style={{fontFamily:'var(--mono)',fontSize:9.5,color:'var(--muted)',letterSpacing:'.04em',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r}</span>
                      {cols.map((c,ci)=>{
                        const lvl = heat[ri][ci];
                        return (
                          <span key={ci} style={{
                            height:22,borderRadius:3,background:palette[lvl],
                            border:'1px solid rgba(255,255,255,.04)',
                            boxShadow: lvl>2 ? '0 0 6px rgba(251,188,0,.4)' : 'none',
                          }}/>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })()}
        </Card>
      </div>
    </AppFrame>
  );
}

Object.assign(window, { ReportsArtboard });
