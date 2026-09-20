function LoginArtboard(){
  return (
    <div style={{display:'flex',width:'100%',height:'100%',background:'var(--bg)',fontFamily:'var(--sans)',color:'var(--text)',position:'relative',overflow:'hidden'}}>
      {/* Atmospheric background */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',background:
        'radial-gradient(800px 500px at 18% 30%, rgba(255,191,0,.22), transparent 60%),'+
        'radial-gradient(700px 500px at 80% 80%, rgba(251,188,0,.16), transparent 60%),'+
        'radial-gradient(900px 600px at 50% 110%, rgba(169,199,255,.12), transparent 60%)'
      }}/>
      {/* Grid pattern */}
      <div style={{position:'absolute',inset:0,opacity:.25,backgroundImage:
        'linear-gradient(rgba(255,191,0,.06) 1px, transparent 1px),'+
        'linear-gradient(90deg, rgba(255,191,0,.06) 1px, transparent 1px)',
        backgroundSize:'48px 48px',
        maskImage:'radial-gradient(ellipse at 50% 50%, #000, transparent 75%)',
      }}/>

      {/* Left panel — brand */}
      <div style={{flex:1,padding:'48px 56px',display:'flex',flexDirection:'column',justifyContent:'space-between',position:'relative',zIndex:1}}>
        <Logo size={26}/>
        <div>
          <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.18em',color:'#A9C7FF'}}>// ABSTREKKT / AX · GOVERNANCE</div>
          <div style={{fontFamily:'var(--mono)',fontSize:56,lineHeight:1.05,letterSpacing:'-.03em',fontWeight:600,marginTop:14,maxWidth:560}}>
            <span style={{color:'#fff'}}>Ship AI.</span><br/>
            <span style={{background:'linear-gradient(90deg,#FBBC00 10%,#FFBF00 60%,#A9C7FF)',WebkitBackgroundClip:'text',color:'transparent'}}>Audit chaos.</span>
          </div>
          <div style={{maxWidth:480,marginTop:18,color:'var(--muted)',lineHeight:1.6,fontSize:14}}>
            Continuous assessment, evidence collection and rule-based controls for every model your company deploys — across Ops, Finance, HR, and Legal.
          </div>

          <div style={{display:'flex',gap:12,marginTop:32,flexWrap:'wrap'}}>
            {[
              ['142','models tracked','#FFBF00'],
              ['8.7k','controls evaluated · 24h','#FBBC00'],
              ['99.94%','attestation SLO','#A9C7FF'],
            ].map(([n,l,c])=>(
              <div key={l} style={{padding:'14px 18px',border:'1px solid var(--border)',borderRadius:12,background:'rgba(28,27,29,.5)',backdropFilter:'blur(8px)'}}>
                <div style={{fontFamily:'var(--mono)',fontSize:22,fontWeight:600,color:c,letterSpacing:'-.02em'}}>{n}</div>
                <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--muted)',letterSpacing:'.08em',textTransform:'uppercase',marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:18,color:'var(--muted)',fontFamily:'var(--mono)',fontSize:11}}>
          <span>SOC 2 TYPE II</span>
          <span style={{opacity:.4}}>·</span>
          <span>ISO 27001</span>
          <span style={{opacity:.4}}>·</span>
          <span>EU AI ACT READY</span>
          <span style={{opacity:.4}}>·</span>
          <span>HIPAA</span>
        </div>
      </div>

      {/* Right — login card */}
      <div style={{flex:'0 0 480px',padding:48,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',zIndex:1}}>
        <Card pad={32} glow style={{width:'100%',maxWidth:400,position:'relative'}}>
          <div style={{position:'absolute',top:-1,left:24,right:24,height:1,background:'linear-gradient(90deg,transparent,#FFBF00,transparent)',boxShadow:'0 0 12px #FFBF00'}}/>
          <div style={{fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'.14em',color:'var(--muted)'}}>// SIGN IN</div>
          <div style={{fontFamily:'var(--mono)',fontSize:24,fontWeight:600,marginTop:6,letterSpacing:'-.01em'}}>Welcome back.</div>
          <div style={{fontSize:13,color:'var(--muted)',marginTop:6,lineHeight:1.5}}>Use your corporate SSO or work email to access the workspace.</div>

          {/* SSO */}
          <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:22}}>
            <button style={{display:'flex',alignItems:'center',gap:12,padding:'11px 14px',borderRadius:10,background:'rgba(255,255,255,.04)',border:'1px solid var(--border)',color:'var(--text)',fontFamily:'var(--mono)',fontSize:12.5,cursor:'pointer'}}>
              <span style={{width:18,height:18,borderRadius:5,background:'linear-gradient(135deg,#FFBF00,#FBBC00)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Icon name="bolt" size={10} style={{color:'#fff'}}/>
              </span>
              <span style={{flex:1,textAlign:'left'}}>Continue with Okta SSO</span>
              <Icon name="arrowR" size={13} style={{color:'var(--muted)'}}/>
            </button>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              <button style={{padding:'10px',borderRadius:10,background:'rgba(255,255,255,.03)',border:'1px solid var(--border)',color:'var(--muted)',fontFamily:'var(--mono)',fontSize:11,cursor:'pointer'}}>Google</button>
              <button style={{padding:'10px',borderRadius:10,background:'rgba(255,255,255,.03)',border:'1px solid var(--border)',color:'var(--muted)',fontFamily:'var(--mono)',fontSize:11,cursor:'pointer'}}>Microsoft</button>
            </div>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:10,margin:'22px 0',color:'var(--muted)'}}>
            <div style={{flex:1,height:1,background:'var(--border)'}}/>
            <span style={{fontFamily:'var(--mono)',fontSize:10,letterSpacing:'.12em'}}>OR EMAIL</span>
            <div style={{flex:1,height:1,background:'var(--border)'}}/>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <Field label="Email" icon="mail" value="orion@abstrekkt.ax"/>
            <Field label="Password" icon="lock" placeholder="••••••••••••" focused/>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:-2}}>
              <label style={{display:'inline-flex',alignItems:'center',gap:8,fontSize:12,color:'var(--muted)',cursor:'pointer'}}>
                <span style={{width:14,height:14,borderRadius:4,border:'1px solid var(--border)',background:'rgba(255,191,0,.12)',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
                  <Icon name="check" size={9} style={{color:'#FFBF00'}}/>
                </span>
                Remember device 30d
              </label>
              <a style={{fontFamily:'var(--mono)',fontSize:11,color:'#FBBC00',textDecoration:'none'}}>Forgot?</a>
            </div>
            <Btn kind="primary" size="lg" icon="arrowR" full>Enter workspace</Btn>
          </div>

          <div style={{marginTop:18,padding:'10px 12px',border:'1px dashed var(--border)',borderRadius:10,fontSize:11.5,color:'var(--muted)',display:'flex',alignItems:'center',gap:8}}>
            <Icon name="shield" size={13} style={{color:'#A9C7FF'}}/>
            Protected by hardware-key MFA. New devices require admin approval.
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { LoginArtboard });
