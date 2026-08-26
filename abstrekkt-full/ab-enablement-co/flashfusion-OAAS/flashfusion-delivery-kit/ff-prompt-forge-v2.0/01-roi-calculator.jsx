import { useState } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const fmt=n=>n>=1e6?"$"+(n/1e6).toFixed(1)+"M":n>=1000?"$"+(n/1000).toFixed(0)+"K":"$"+Math.round(n).toLocaleString();
const fmtH=n=>n>=1000?(n/1000).toFixed(1)+"K hrs":Math.round(n)+" hrs";
const PLANS={free:{c:0,l:"Free"},pro:{c:20,l:"Pro"},max:{c:100,l:"Max"},team:{c:30,l:"Team"},ent:{c:0,l:"Enterprise"}};
const TIERS={smb:{b:99,u:.02,l:"SMB"},mid:{b:149,u:.03,l:"Mid-Market"},ent:{b:299,u:.05,l:"Enterprise"}};
function Stat({label,value,color}){return <div style={{background:T.sf,borderRadius:2,padding:"9px 10px",textAlign:"center"}}><div style={{fontSize:19,fontWeight:500,color:color||T.t}}>{value}</div><div style={{...mn,fontSize:9,textTransform:"uppercase",letterSpacing:"0.08em",color:T.t3,marginTop:3}}>{label}</div></div>;}
function Bar({pct,color}){return <div style={{height:5,background:T.tg,borderRadius:3,marginTop:6}}><div style={{height:5,background:color,borderRadius:3,width:Math.min(100,Math.max(0,pct))+"%",transition:"width .3s"}} /></div>;}
export default function ROICalc(){
  const [emp,setEmp]=useState(10);const [rate,setRate]=useState(75);const [hrs,setHrs]=useState(3);
  const [plan,setPlan]=useState("pro");const [tier,setTier]=useState("smb");
  const pc=PLANS[plan]?.c||0;const ti=TIERS[tier];
  const timeSaved=emp*hrs*52;const valueSaved=timeSaved*rate;
  const aiCost=emp*pc*12;const ffMo=ti.b+(emp*ti.u*1000);const ffAnn=ffMo*12;
  const total=aiCost+ffAnn;const net=valueSaved-total;const roiPct=total>0?Math.round(net/total*100):0;
  const payback=net>0?Math.round(total/(valueSaved/12)):0;const perEmp=Math.round(net/emp);
  const rc=net>0?T.g:T.r;
  const inp=(v,set,min,max,step=1)=><input type="range" min={min} max={max} step={step} value={v} onChange={e=>set(+e.target.value)} style={{width:"100%",accentColor:T.a,cursor:"pointer",margin:"4px 0"}} />;
  const Btn=({id,cur,set,label})=><button onClick={()=>set(id)} style={{flex:1,background:"transparent",border:`1px solid ${cur===id?T.a:T.h}`,borderRadius:2,color:cur===id?T.a:T.t2,...mn,fontSize:9,padding:"4px 0",cursor:"pointer"}}>{label}</button>;
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>ROI Calculator</div>
      <div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ FlashFusion AI Enablement · claude-sonnet-4-6</div>
    </div>
    <div style={{padding:"14px 18px",maxWidth:780}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
          {[["Employees Enrolled",emp,setEmp,1,200,1,T.a],["Avg Hourly Rate ($)",rate,setRate,20,300,5,T.m],["Hours Saved / Week / Employee",hrs,setHrs,0.5,20,0.5,T.t]].map(([l,v,set,mn2,mx,st,col])=><div key={l} style={{marginBottom:10}}><div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:2}}>{l}</div><div style={{display:"flex",alignItems:"center",gap:10}}>{inp(v,set,mn2,mx,st)}<span style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:col,minWidth:48,flexShrink:0}}>{l.includes("Rate")?"$"+v:l.includes("Hours")?v+"h":v}</span></div></div>)}
        </div>
        <div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
          <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:6}}>Claude Plan</div>
          <div style={{display:"flex",gap:4,marginBottom:12}}>{Object.entries(PLANS).map(([k,v])=><Btn key={k} id={k} cur={plan} set={setPlan} label={v.l} />)}</div>
          <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:6}}>FlashFusion Tier</div>
          <div style={{display:"flex",gap:4}}>{Object.entries(TIERS).map(([k,v])=><Btn key={k} id={k} cur={tier} set={setTier} label={v.l} />)}</div>
          <div style={{marginTop:14,background:T.sf,borderRadius:2,padding:"8px 10px"}}>
            <div style={{...mn,fontSize:9,color:T.t3,marginBottom:4}}>FLASHFUSION INVOICE</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:T.a}}>${Math.round(ffMo)}<span style={{fontSize:14,color:T.t2}}>/mo</span></div>
            <div style={{...mn,fontSize:9,color:T.t3,marginTop:2}}>{ti.l} · ${ti.b} base + ${ti.u} per action</div>
          </div>
        </div>
      </div>
      <div style={{background:T.c,border:`1px solid ${net>0?"rgba(90,156,90,.3)":"rgba(192,80,80,.3)"}`,borderRadius:3,padding:"12px 14px",marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div><div style={{...mn,fontSize:9,color:T.t3,marginBottom:3}}>◆ NET ANNUAL ROI</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:28,color:rc}}>{fmt(net)}</div><div style={{...mn,fontSize:10,color:rc,marginTop:2}}>{roiPct>0?"+":""}{roiPct}% return</div></div>
          <div style={{textAlign:"right"}}><div style={{...mn,fontSize:9,color:T.t3,marginBottom:3}}>Payback Period</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:T.a}}>{payback>0?payback+" mo":"< 1 mo"}</div><div style={{...mn,fontSize:9,color:T.t3,marginTop:2}}>{fmt(perEmp)} per employee</div></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7}}>
          <Stat label="Time Value" value={fmt(valueSaved)} color={T.g}/>
          <Stat label="Hours/Year" value={fmtH(timeSaved)} color={T.m}/>
          <Stat label="Total Cost" value={fmt(total)} color={T.t2}/>
          <Stat label="Break-even" value={payback>0?payback+" mo":"< 1 mo"} color={T.a}/>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        {[["Cost Breakdown",[["Claude Plans",aiCost,total,T.m],["FlashFusion",ffAnn,total,T.a]]],["Value Breakdown",[["Time Recovered",valueSaved,valueSaved,T.g],["Net After Costs",net,valueSaved,rc]]]].map(([title,rows])=><div key={title} style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"11px 14px"}}>
          <div style={{...mn,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:T.t3,marginBottom:8}}>{title}</div>
          {rows.map(([l,v,tot,col])=><div key={l} style={{marginBottom:9}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:11,color:T.t2}}>{l}</span><span style={{...mn,fontSize:10,color:col}}>{fmt(v)}</span></div><Bar pct={tot>0?v/tot*100:0} color={col} /></div>)}
        </div>)}
      </div>
      <div style={{background:T.c,border:`1px solid ${T.tg}`,borderRadius:3,padding:"8px 12px"}}><span style={{...mn,fontSize:9,color:T.t3}}>{hrs} hrs/wk × {emp} employees × ${rate}/hr × 52 weeks = {fmt(valueSaved)} recoverable value. FlashFusion {ti.l}: ${ti.b}/mo + ${ti.u}/action. Claude {PLANS[plan]?.l} × {emp} users.</span></div>
    </div>
  </div></>;
}
