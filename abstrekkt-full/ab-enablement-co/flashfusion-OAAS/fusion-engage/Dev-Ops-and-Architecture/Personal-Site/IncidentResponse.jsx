import { useState, useEffect, useRef } from "react";

/* ── palette ── */
const P="#1d4ed8",AC="#f59e0b",GR="#15803d",AV="#7c3aed",RD="#dc2626",OR="#ea580c";
const SK="apex-incident-v1";

/* ── helpers ── */
const sz=n=>n.type==="decision"?[160,90]:n.type==="terminal"?[200,50]:[220,60];
const dur=ms=>{if(!ms||ms<0)return"0s";const s=Math.floor(ms/1e3),m=Math.floor(s/60),h=Math.floor(m/60);return h?`${h}h ${m%60}m`:m?`${m}m ${s%60}s`:`${s}s`};
const Btn=({onClick,bg,children,disabled})=>(
  <button onClick={onClick} disabled={!!disabled} style={{padding:"4px 11px",background:bg||"rgba(255,255,255,0.15)",color:"#fff",border:"none",borderRadius:6,cursor:disabled?"not-allowed":"pointer",fontSize:12,fontWeight:600,whiteSpace:"nowrap",opacity:disabled?0.6:1,lineHeight:"1.4"}}>
    {children}
  </button>
);

/* ── node data ── */
const BN=[
  {id:"n1",type:"terminal",label:"Alert Received",x:260,y:20,exp:2,
   w:["Verify alert source — PagerDuty, Datadog, or customer report","Confirm not a false positive (check PD silence rules)","Note exact trigger time and source system"],
   u:["Datadog monitors: metrics.apex.io","Review recent PD incidents for duplicates"],
   c:["Incident confirmed as real — not a test or duplicate"],
   i:["PagerDuty: ops.apex.io/pd","Datadog: metrics.apex.io","On-call rotation: #on-call Slack"]},

  {id:"n2",type:"process",label:"Triage & Classify",x:250,y:120,exp:10,
   w:["Open Datadog service health dashboard","Check error rate, p99, 5xx rate, active user count","Identify which service or region triggered first"],
   u:["Service Map: metrics.apex.io/service-map","Query: SELECT service, error_rate FROM metrics WHERE time > NOW()-15m","Check Intercom for customer reports: intercom.apex.io"],
   c:["Severity assigned (SEV-1/2/3)","Affected services and blast radius identified"],
   i:["SEV-1: >10% users or data loss risk","SEV-2: Degraded, <10% affected","SEV-3: Minor/cosmetic","Runbooks: wiki.apex.io/runbooks"]},

  {id:"n3",type:"decision",label:"SEV-1?",x:280,y:250,exp:2,
   w:["Is >10% of users unable to use core features?","Is there data loss, corruption, or security risk?","Are auth, billing, or API gateway fully down?"],
   u:[],
   c:["Severity confirmed — SEV-1 triggers IC page"],
   i:["SEV-1 = IC page + war room required","SEV-2/3 = solo manageable initially"]},

  {id:"n4",type:"process",label:"Page Incident Commander",x:500,y:290,exp:5,bypassable:true,bypassOwner:"SEV-2/3 — skip if solo-manageable",
   w:["Confirm SEV-1 before paging IC","Have: severity, affected systems, initial hypothesis ready"],
   u:["/pd escalate in Slack","Alex Chen @alex.chen (primary) | Jamie Park @jamie.park (backup)","Include: severity, affected systems, status, your plan"],
   c:["IC acknowledged in Slack or PagerDuty","IC joining war room channel"],
   i:["PD escalation policy: apex-incident-commanders","Alex Chen: @alex.chen | Jamie Park: @jamie.park"]},

  {id:"n5",type:"process",label:"Create War Room Channel",x:250,y:390,exp:5,
   w:["Open Slack, follow naming convention","Have incident doc template link ready"],
   u:["Create: #inc-YYYY-MM-DD-description","Invite: IC (SEV-1), CX lead @sarah.kim, on-call engineers","Post: severity, systems, time, initial hypothesis"],
   c:["Channel created with team assembled","Incident doc pinned in channel","Status page acknowledged"],
   i:["Naming: #inc-2025-04-25-api-degraded","CX Lead: Sarah Kim @sarah.kim","Doc template: wiki.apex.io/incident-template","Status page login: 1Password → ops@apex.io"]},

  {id:"n6",type:"process",label:"Identify Affected Systems",x:250,y:510,exp:15,
   w:["Open Datadog service map","Check all downstream services of affected component","Verify customer-facing vs internal impact"],
   u:["Service map: metrics.apex.io/service-map","Check DB connection pool metrics (common blast radius amplifier)","Verify CDN: status.fastly.com","Tag Datadog incident with affected service names"],
   c:["Affected services documented in #inc channel","Blast radius quantified (% users, regions)","DB impact assessed"],
   i:["Core services: api-gateway, auth-service, billing-service, worker-queue","DB: db.apex.internal (ro: db-ro.apex.internal)","CDN: Fastly — check status.fastly.com"]},

  {id:"n7",type:"decision",label:"Recent Deployment?",x:280,y:640,exp:5,
   w:["Check deploy log for past 2 hours","Include infra changes: Terraform, k8s, config updates","Cross-reference with incident start time"],
   u:["Deploy history: deploys.apex.io","ArgoCD (k8s): argocd.apex.internal","GitHub Actions: github.com/apex-saas → Actions"],
   c:["Deploy correlation confirmed or ruled out"],
   i:["Most common failure: memory leak in api-gateway post-deploy","Check config changes too — not just code deploys"]},

  {id:"n8",type:"decision",label:"Safe to Roll Back?",x:480,y:760,exp:5,
   w:["Does deploy include DB migrations?","Is migration forward-only (irreversible)?","Would rollback cause data inconsistency?"],
   u:["Check migration files in deploy SHA: db/migrations/","If migration ran → do NOT roll back — hotfix instead","Confirm with IC before any destructive action"],
   c:["Rollback safety confirmed with IC and lead engineer"],
   i:["RULE: Never roll back if migration ran and is not reversible","Uncertain = non-rollbackable → proceed to hotfix"]},

  {id:"n9",type:"process",label:"Execute Rollback",x:680,y:870,exp:20,
   w:["Confirm rollback target SHA with IC","Ensure ArgoCD or GitHub Actions accessible","Have monitoring dashboard open before starting"],
   u:["gh workflow run rollback.yml -f sha=<previous-sha>","ArgoCD: set desired version to previous image tag","Watch pipeline — cancel if new errors emerge","Monitor error rate in real time during rollback"],
   c:["Previous version running in production","Error rate returning to baseline (<0.5%)","No new error types introduced by rollback"],
   i:["Rollback workflow: .github/workflows/rollback.yml","ArgoCD: argocd.apex.internal","Max safe rollback: 5 commits","Full pod rotation takes ~8 min"]},

  {id:"n10",type:"process",label:"Apply Hotfix",x:480,y:870,exp:45,
   w:["Confirm root cause from logs and distributed traces","Branch from main — NOT from the bad deploy SHA","Keep the fix minimal — this is not refactoring time"],
   u:["git checkout -b hotfix/incident-YYYY-MM-DD","Fast-track review: 1 reviewer min from @tech-leads","CI fast-path: set HOTFIX=true to skip slow tests","Deploy to staging first if even 5 min available"],
   c:["Fix merged to main","Deployed to production via auto-deploy pipeline","Error rate declining in Datadog"],
   i:["Required reviewer: @tech-leads team","HOTFIX=true skips slow CI tests","Auto-deploy on merge to main (~6 min)"]},

  {id:"n11",type:"decision",label:"Vendor / Infra Issue?",x:280,y:980,exp:5,
   w:["Check AWS service health dashboard","Check all third-party service status pages","Isolate: apex code vs upstream dependency"],
   u:["AWS: status.aws.amazon.com","Stripe: status.stripe.com | Twilio: status.twilio.com","Fastly: status.fastly.com","Search Datadog traces for vendor-specific error codes"],
   c:["Vendor/infra root cause confirmed or ruled out"],
   i:["AWS: Business tier — 1hr production-down SLA","Common: Stripe webhook lag, Fastly cache poisoning","DB connection exhaustion looks like infra but is usually our code"]},

  {id:"n12",type:"escalation",label:"Vendor Escalation",x:500,y:1080,exp:60,returnTo:"n13",
   w:["Gather: timestamps, error codes, affected region, sample request IDs","Prepare 3-sentence summary: what, when, impact"],
   u:["Open support ticket with P1/Critical severity","Include AWS request IDs or Stripe charge IDs as evidence","Post ticket link in #inc channel for async tracking","Check their status page first — may already have ETA"],
   c:["Vendor acknowledges with ETA or workaround","Fix deployed or workaround identified"],
   i:["AWS Support PIN: 1Password → 'AWS Support'","Stripe emergency: +1-888-963-8777 (24/7)","AWS Business tier SLA: 1hr for production-down","Include #inc-channel link in vendor ticket"]},

  {id:"n13",type:"process",label:"Monitor Recovery",x:250,y:1200,exp:20,
   w:["Open recovery dashboard: dashboards.apex.io/incident-recovery","Set up real-time: error rate + p99 + active sessions","Begin 10-min update cadence in #inc channel"],
   u:["Target: error rate <0.1%, p99 <500ms for 5 consecutive minutes","Post customer update to status.apex.io if impact >15min","Update #inc every 10 min: 'Status: recovering, error rate at X%'"],
   c:["All metrics at baseline for 10+ consecutive minutes","No new error spikes","Customer update posted if applicable"],
   i:["Recovery dashboard: dashboards.apex.io/incident-recovery","Status page: status.apex.io (ops@apex.io / 1Password)","Customer update template: wiki.apex.io/customer-update-template"]},

  {id:"n14",type:"process",label:"Resolution Checklist",x:250,y:1350,exp:10,isQCGate:true,
   checklist:[
     {id:"c1",label:"Error rate at baseline for 10+ consecutive minutes",critical:true},
     {id:"c2",label:"p99 latency within normal range",critical:true},
     {id:"c3",label:"No active alerts firing in Datadog",critical:true},
     {id:"c4",label:"Customer status page updated with resolution",critical:true},
     {id:"c5",label:"Root cause identified (preliminary OK)",critical:true},
     {id:"c6",label:"Incident channel summary posted",critical:false},
     {id:"c7",label:"PIR scheduled within 48 hours (SEV-1)",critical:false},
     {id:"c8",label:"Alert thresholds reviewed to catch earlier",critical:false},
   ],
   w:["Complete all ★ critical items before declaring resolved","Verify metrics are stable — not just a temporary dip"],
   u:[],
   c:["All ★ critical checklist items passed","Ready to declare resolved"],
   i:["PIR template: wiki.apex.io/pir-template","PIR within 48h for SEV-1","Resolution template: wiki.apex.io/resolution-template"]},

  {id:"n15",type:"terminal",label:"Resolved · PIR Scheduled",x:260,y:1510,exp:5,
   w:["Post final resolution message in #inc channel (use template)","Archive Slack channel — do NOT delete","Close PagerDuty incident as resolved"],
   u:["Archive: Channel settings → Archive channel","PD: ops.apex.io/pd → resolve incident","Post summary to #engineering if SEV-1"],
   c:["PagerDuty incident resolved","Slack channel archived","PIR date confirmed with calendar invite"],
   i:["Resolution message: wiki.apex.io/resolution-template","Archive not delete — we need history","PIR invite: use @incident-response-team alias"]},
];

/* ── edge data ──
   Decision nodes: idx=0 exits BOTTOM (default/No), idx=1 exits RIGHT (branch/Yes)
*/
const BE=[
  {id:"e1",from:"n1",to:"n2",label:""},
  {id:"e2",from:"n2",to:"n3",label:""},
  {id:"e3",from:"n3",to:"n5",label:"SEV-2/3"},    // idx 0 → bottom
  {id:"e4",from:"n3",to:"n4",label:"SEV-1"},      // idx 1 → right
  {id:"e5",from:"n4",to:"n5",label:""},
  {id:"e6",from:"n5",to:"n6",label:""},
  {id:"e7",from:"n6",to:"n7",label:""},
  {id:"e8",from:"n7",to:"n11",label:"no deploy"}, // idx 0 → bottom
  {id:"e9",from:"n7",to:"n8",label:"deploy found"},// idx 1 → right
  {id:"e10",from:"n8",to:"n10",label:"no"},       // idx 0 → bottom
  {id:"e11",from:"n8",to:"n9",label:"yes"},       // idx 1 → right
  {id:"e12",from:"n9",to:"n13",label:""},
  {id:"e13",from:"n10",to:"n11",label:""},
  {id:"e14",from:"n11",to:"n13",label:"no"},      // idx 0 → bottom
  {id:"e15",from:"n11",to:"n12",label:"yes"},     // idx 1 → right
  {id:"e16",from:"n12",to:"n13",label:"↩ resolved"},
  {id:"e17",from:"n13",to:"n14",label:""},
  {id:"e18",from:"n14",to:"n15",label:""},
];

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export default function IncidentFlowchart() {
  const [nodes,setNodes]=useState(BN);
  const [edges,setEdges]=useState(BE);
  const [sel,setSel]=useState(null);
  const [tab,setTab]=useState("details");
  const [nSt,setNSt]=useState({});         // id → status
  const [nT0,setNT0]=useState({});         // id → start timestamp
  const [sessOn,setSessOn]=useState(false);
  const [sessTs,setSessTs]=useState(null);
  const [pan,setPan]=useState({x:30,y:8});
  const [zoom,setZoom]=useState(0.55);
  const [arrMode,setArrMode]=useState(false);
  const [panDg,setPanDg]=useState(null);
  const [nodeDg,setNodeDg]=useState(null);
  const [notes,setNotes]=useState({});
  const [log,setLog]=useState([]);
  const [downM,setDownM]=useState(null);
  const [bypassM,setBypassM]=useState(null);
  const [bypassR,setBypassR]=useState("");
  const [aiMsgs,setAiMsgs]=useState([]);
  const [aiIn,setAiIn]=useState("");
  const [aiLoad,setAiLoad]=useState(false);
  const [aiEdit,setAiEdit]=useState(false);
  const [pendE,setPendE]=useState(null);
  const [editN,setEditN]=useState(null);
  const [editV,setEditV]=useState("");
  const [tick,setTick]=useState(Date.now());
  const [chk,setChk]=useState({});
  const [saved,setSaved]=useState(false);

  const svgRef=useRef(null);
  const zR=useRef(zoom),pR=useRef(pan);
  useEffect(()=>{zR.current=zoom;},[zoom]);
  useEffect(()=>{pR.current=pan;},[pan]);

  const selNode=nodes.find(n=>n.id===sel)||null;

  // ── timer ──────────────────────────────────────────────────────────
  useEffect(()=>{const id=setInterval(()=>setTick(Date.now()),1000);return()=>clearInterval(id);},[]);

  // ── non-passive wheel zoom ─────────────────────────────────────────
  useEffect(()=>{
    const el=svgRef.current;if(!el)return;
    const fn=e=>{
      e.preventDefault();
      const z=zR.current,p=pR.current;
      const r=el.getBoundingClientRect();
      const cx=e.clientX-r.left,cy=e.clientY-r.top;
      const f=e.deltaY<0?1.1:0.9;
      const nz=Math.max(0.12,Math.min(3,z*f));
      const wx=(cx-p.x)/z,wy=(cy-p.y)/z;
      setPan({x:cx-wx*nz,y:cy-wy*nz});
      setZoom(nz);
    };
    el.addEventListener("wheel",fn,{passive:false});
    return()=>el.removeEventListener("wheel",fn);
  },[]);

  // ── load from storage ──────────────────────────────────────────────
  useEffect(()=>{
    (async()=>{
      try{
        const r=await window.storage.get(SK);
        if(r?.value){
          const d=JSON.parse(r.value);
          if(d.nodes)setNodes(d.nodes);
          if(d.edges)setEdges(d.edges);
          if(d.nSt)setNSt(d.nSt);
          if(d.nT0)setNT0(d.nT0);
          if(d.notes)setNotes(d.notes);
          if(d.log)setLog(d.log);
          if(d.chk)setChk(d.chk);
          if(d.sessOn){setSessOn(true);setSessTs(d.sessTs);}
        }
      }catch(e){console.error("Load failed:",e);}
    })();
  },[]);

  // ── save ────────────────────────────────────────────────────────────
  const save=async()=>{
    try{
      await window.storage.set(SK,JSON.stringify({nodes,edges,nSt,nT0,notes,log,chk,sessOn,sessTs}));
      setSaved(true);setTimeout(()=>setSaved(false),2000);
    }catch(e){console.error("Save failed:",e);}
  };

  const addLog=msg=>{const ts=new Date().toLocaleTimeString();setLog(p=>[{ts,msg},...p].slice(0,100));};

  // ── downstream detection ───────────────────────────────────────────
  const downstream=id=>{
    const vis=new Set(),q=[id],res=[];
    while(q.length){
      const c=q.shift();if(vis.has(c))continue;vis.add(c);
      edges.filter(e=>e.from===c).forEach(e=>{if(!vis.has(e.to)){res.push(e.to);q.push(e.to);}});
    }
    return res;
  };

  const setStatus=(id,ns)=>{
    if(ns==="done"||ns==="blocked"){
      const aff=downstream(id).filter(nid=>nSt[nid]==="active"||nSt[nid]==="done");
      if(aff.length){setDownM({id,ns,aff});return;}
    }
    applyStatus(id,ns);
  };

  const applyStatus=(id,ns)=>{
    setNSt(p=>({...p,[id]:ns}));
    if(ns==="active"&&!nT0[id])setNT0(p=>({...p,[id]:Date.now()}));
    const n=nodes.find(x=>x.id===id);
    addLog(`${n?.label||id} → ${ns}`);
    setDownM(null);
  };

  // ── QC gate ─────────────────────────────────────────────────────────
  const qcOk=node=>{
    if(!node.isQCGate||!node.checklist)return true;
    const nc=chk[node.id]||{};
    return node.checklist.filter(i=>i.critical).every(i=>nc[i.id]==="pass");
  };

  // ── copy ticket ─────────────────────────────────────────────────────
  const copyTicket=()=>{
    const lines=[
      "=== APEX SAAS INCIDENT TICKET ===",
      `Session started: ${sessTs?new Date(sessTs).toLocaleString():"N/A"}`,
      `Duration: ${sessTs?dur(tick-sessTs):"N/A"}`,
      "","--- STEPS ---",
      ...nodes.filter(n=>nSt[n.id]).sort((a,b)=>(nT0[a.id]||0)-(nT0[b.id]||0))
        .map(n=>`[${(nSt[n.id]||"todo").toUpperCase()}] ${n.label}${nT0[n.id]?" @ "+new Date(nT0[n.id]).toLocaleTimeString():""}`),
      "","--- NOTES ---",
      ...Object.entries(notes).filter(([,v])=>v).map(([id,v])=>{const n=nodes.find(x=>x.id===id);return`${n?.label||id}: ${v}`;}),
      "","--- LOG ---",...log.map(l=>`${l.ts}  ${l.msg}`)
    ];
    navigator.clipboard.writeText(lines.join("\n")).catch(()=>{});
    addLog("Ticket copied to clipboard");
  };

  // ── SVG mouse handlers ─────────────────────────────────────────────
  const onSvgDown=e=>{
    if(nodeDg)return;
    if(e.target===svgRef.current||e.target.tagName==="svg")
      setPanDg({sx:e.clientX,sy:e.clientY,px:pan.x,py:pan.y});
  };
  const onSvgMove=e=>{
    if(panDg&&!nodeDg)setPan({x:panDg.px+(e.clientX-panDg.sx),y:panDg.py+(e.clientY-panDg.sy)});
    if(nodeDg){
      const r=svgRef.current?.getBoundingClientRect();if(!r)return;
      const wx=(e.clientX-r.left-pan.x)/zoom,wy=(e.clientY-r.top-pan.y)/zoom;
      setNodes(p=>p.map(n=>n.id===nodeDg.id?{...n,x:wx-nodeDg.ox,y:wy-nodeDg.oy}:n));
    }
  };
  const onSvgUp=()=>{setPanDg(null);setNodeDg(null);};
  const onNDown=(e,node)=>{
    e.stopPropagation();
    if(arrMode){
      const r=svgRef.current?.getBoundingClientRect();if(!r)return;
      const wx=(e.clientX-r.left-pan.x)/zoom,wy=(e.clientY-r.top-pan.y)/zoom;
      setNodeDg({id:node.id,ox:wx-node.x,oy:wy-node.y});
    }else setSel(node.id);
  };

  // ── edge render ────────────────────────────────────────────────────
  const renderEdge=edge=>{
    const src=nodes.find(n=>n.id===edge.from),tgt=nodes.find(n=>n.id===edge.to);
    if(!src||!tgt)return null;
    const [sw,sh]=sz(src),[tw]=sz(tgt);
    const scx=src.x+sw/2,scy=src.y+sh/2,tcx=tgt.x+tw/2;
    const outs=edges.filter(e=>e.from===src.id);
    const idx=outs.findIndex(e=>e.id===edge.id);
    let ex,ey;
    if(src.type==="decision"&&outs.length===2){
      if(idx===0){ex=scx;ey=src.y+sh;}else{ex=src.x+sw;ey=scy;}
    }else{ex=scx;ey=src.y+sh;}
    const tx=tcx,ty=tgt.y;
    const dy=ty-ey;
    let c1x,c1y,c2x,c2y;
    if(dy>=0){
      const k=Math.max(40,Math.abs(dy)*0.45);
      c1x=ex;c1y=ey+k;c2x=tx;c2y=ty-k;
    }else{
      c1x=ex+60;c1y=ey+50;c2x=tx+60;c2y=ty-50;
    }
    const d=`M ${ex} ${ey} C ${c1x} ${c1y} ${c2x} ${c2y} ${tx} ${ty}`;
    const done=(nSt[edge.from]||"todo")==="done";
    const col=done?"#4ade80":"#94a3b8";
    const mx=0.125*ex+0.375*c1x+0.375*c2x+0.125*tx;
    const my=0.125*ey+0.375*c1y+0.375*c2y+0.125*ty-6;
    return(
      <g key={edge.id}>
        <path d={d} fill="none" stroke={col} strokeWidth={1.5} markerEnd={`url(#${done?"ad":"a"})`}/>
        {edge.label&&<text x={mx} y={my} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="system-ui" style={{pointerEvents:"none",userSelect:"none"}}>{edge.label}</text>}
      </g>
    );
  };

  // ── node render ────────────────────────────────────────────────────
  const renderNode=node=>{
    const [w,h]=sz(node);
    const cx=node.x+w/2,cy=node.y+h/2;
    const st=nSt[node.id]||"todo";
    const sT=nT0[node.id];
    const el=sT?tick-sT:0;
    const ot=st==="active"&&sT&&el>node.exp*60000*2;
    const isSel=sel===node.id;
    let stk=P,fill="#fff",tf="#1e293b";
    if(node.type==="decision")stk=st==="todo"?AC:P;
    if(node.type==="escalation"){stk=st==="todo"?OR:P;fill="#fff7ed";}
    if(st==="active"){stk=AV;fill="#f5f3ff";tf="#4c1d95";}
    if(st==="done"){stk=GR;fill="#f0fdf4";tf="#14532d";}
    if(st==="blocked"){stk=RD;fill="#fef2f2";tf="#7f1d1d";}
    const dc=st==="active"?AV:st==="done"?GR:st==="blocked"?RD:"#cbd5e1";
    const E=[];
    // overtime ring
    if(ot)E.push(<rect key="ot" x={node.x-5} y={node.y-5} width={w+10} height={h+10} rx={node.type==="terminal"?30:8} fill="none" stroke={AC} strokeWidth={2} strokeDasharray="5,4"/>);
    // selection ring
    if(isSel)E.push(<rect key="sel" x={node.x-3} y={node.y-3} width={w+6} height={h+6} rx={node.type==="terminal"?28:7} fill="none" stroke={P} strokeWidth={2}/>);
    // QC gate outer dashed border
    if(node.isQCGate)E.push(<rect key="qcr" x={node.x-1} y={node.y-1} width={w+2} height={h+2} rx={7} fill="none" stroke={GR} strokeWidth={1.5} strokeDasharray="4,3" opacity={0.7}/>);
    // shape
    if(node.type==="decision"){
      E.push(<polygon key="sh" points={`${cx},${node.y} ${node.x+w},${cy} ${cx},${node.y+h} ${node.x},${cy}`} fill={fill} stroke={stk} strokeWidth={isSel?2:1.5} style={{cursor:arrMode?"move":"pointer"}}/>);
    }else{
      E.push(<rect key="sh" x={node.x} y={node.y} width={w} height={h} rx={node.type==="terminal"?24:6} fill={fill} stroke={stk} strokeWidth={isSel?2:1.5} style={{cursor:arrMode?"move":"pointer"}}/>);
    }
    // status dot
    E.push(<circle key="dt" cx={node.x+w-10} cy={node.y+10} r={4} fill={dc}/>);
    // bypassable badge
    if(node.bypassable)E.push(<text key="bp" x={node.x+8} y={node.y+13} fontSize={9} fill="#94a3b8" style={{pointerEvents:"none"}}>↷</text>);
    // inline label edit
    if(editN===node.id){
      E.push(
        <foreignObject key="fo" x={node.x+8} y={cy-11} width={w-20} height={22}>
          <input value={editV}
            onChange={e=>setEditV(e.target.value)}
            onBlur={()=>{setNodes(p=>p.map(n=>n.id===node.id?{...n,label:editV}:n));setEditN(null);}}
            onKeyDown={e=>{if(e.key==="Enter")e.target.blur();if(e.key==="Escape")setEditN(null);}}
            style={{width:"100%",border:`1px solid ${P}`,borderRadius:3,padding:"1px 4px",fontSize:11,outline:"none",fontFamily:"system-ui"}}
            autoFocus/>
        </foreignObject>
      );
    }else{
      const mC=node.type==="decision"?12:20;
      const wds=node.label.split(" ");const lns=[];let ln="";
      for(const wd of wds){if(ln&&(ln+wd).length>mC){lns.push(ln.trimEnd());ln=wd+" ";}else ln+=wd+" ";}
      if(ln.trim())lns.push(ln.trimEnd());
      const lh=13,tot=lns.length*lh,ty0=cy-tot/2+lh/2;
      lns.forEach((l,i)=>E.push(
        <text key={`t${i}`} x={cx} y={ty0+i*lh} textAnchor="middle" dominantBaseline="middle"
          fontSize={11} fontWeight={500} fill={tf} fontFamily="system-ui"
          style={{pointerEvents:"none",userSelect:"none"}}>{l}</text>
      ));
    }
    // active timer
    if(st==="active"&&sT)E.push(
      <text key="tm" x={node.x+6} y={node.y+h-5} fontSize={8} fill={ot?AC:"#94a3b8"}
        fontFamily="system-ui" style={{pointerEvents:"none"}}>⏱{dur(el)}/{node.exp}m</text>
    );
    return(
      <g key={node.id}
        onMouseDown={e=>onNDown(e,node)}
        onDoubleClick={()=>arrMode?(setEditN(node.id),setEditV(node.label)):(setSel(node.id),setTab("details"))}>
        {E}
      </g>
    );
  };

  // ── Details panel ──────────────────────────────────────────────────
  const renderDetails=()=>{
    if(!selNode)return(
      <div style={{padding:24,textAlign:"center",color:"#94a3b8",fontSize:13}}>
        <div style={{fontSize:30,marginBottom:8}}>🗺</div>
        Click a node to view details
      </div>
    );
    const st=nSt[selNode.id]||"todo";
    const el=nT0[selNode.id]?tick-nT0[selNode.id]:0;
    const isQC=selNode.isQCGate;
    return(
      <div style={{padding:13,fontSize:13}}>
        {/* status header */}
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
          <span style={{padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:700,letterSpacing:"0.05em",
            background:st==="active"?AV:st==="done"?GR:st==="blocked"?RD:"#e2e8f0",
            color:st==="todo"?"#475569":"#fff"}}>
            {st.toUpperCase()}
          </span>
          <span style={{fontSize:11,color:"#94a3b8"}}>exp {selNode.exp}m</span>
          {nT0[selNode.id]&&<span style={{marginLeft:"auto",fontSize:11,color:el>selNode.exp*60000*2?AC:"#94a3b8"}}>{dur(el)}</span>}
        </div>

        {/* status buttons */}
        <div style={{display:"flex",gap:4,marginBottom:13,flexWrap:"wrap"}}>
          {["todo","active","done","blocked"].map(s=>{
            const isDoneDisabled=isQC&&s==="done"&&!qcOk(selNode);
            return(
              <button key={s} onClick={()=>!isDoneDisabled&&setStatus(selNode.id,s)}
                style={{padding:"3px 10px",fontSize:11,borderRadius:4,cursor:isDoneDisabled?"not-allowed":"pointer",fontWeight:500,
                  border:`1px solid ${s==="active"?AV:s==="done"?GR:s==="blocked"?RD:"#d1d5db"}`,
                  background:st===s?(s==="active"?AV:s==="done"?GR:s==="blocked"?RD:"#e2e8f0"):"#fff",
                  color:(st===s&&s!=="todo")?"#fff":"#374151",
                  opacity:isDoneDisabled?0.35:1}}>
                {isDoneDisabled?"✓ done (locked)":s}
              </button>
            );
          })}
          {selNode.bypassable&&(
            <button onClick={()=>{setBypassM(selNode.id);setBypassR("");}}
              style={{padding:"3px 10px",fontSize:11,borderRadius:4,cursor:"pointer",border:"1px solid #d1d5db",background:"#fff",color:"#64748b"}}>
              Skip ↷
            </button>
          )}
          {selNode.type==="escalation"&&(
            <button onClick={()=>{applyStatus(selNode.id,"done");if(selNode.returnTo)setSel(selNode.returnTo);}}
              style={{padding:"3px 10px",fontSize:11,borderRadius:4,cursor:"pointer",border:`1px solid ${OR}`,background:"#fff7ed",color:OR,fontWeight:600}}>
              ↩ Resolved
            </button>
          )}
        </div>

        {/* QC gate checklist */}
        {isQC&&selNode.checklist&&(
          <div style={{marginBottom:14,background:"#f8fafc",borderRadius:8,padding:"10px 12px",border:"1px solid #e2e8f0"}}>
            <div style={{fontWeight:700,fontSize:12,color:"#1e293b",marginBottom:8}}>Resolution Checklist</div>
            {selNode.checklist.map(item=>{
              const v=(chk[selNode.id]||{})[item.id]||null;
              return(
                <div key={item.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                  <span style={{color:item.critical?RD:"#94a3b8",fontSize:11,minWidth:12}}>{item.critical?"★":"○"}</span>
                  <span style={{flex:1,fontSize:12,color:v==="pass"?GR:v==="fail"?RD:"#374151",textDecoration:v==="skip"?"line-through":"none"}}>{item.label}</span>
                  {["pass","fail","skip"].map(val=>(
                    <button key={val} onClick={()=>setChk(p=>({...p,[selNode.id]:{...(p[selNode.id]||{}),[item.id]:v===val?null:val}}))}
                      style={{padding:"1px 5px",fontSize:10,borderRadius:3,cursor:"pointer",
                        border:`1px solid ${val==="pass"?GR:val==="fail"?RD:"#d1d5db"}`,
                        background:v===val?(val==="pass"?GR:val==="fail"?RD:"#e2e8f0"):"#fff",
                        color:v===val&&val!=="skip"?"#fff":"#374151",fontWeight:v===val?700:400}}>
                      {val}
                    </button>
                  ))}
                </div>
              );
            })}
            {qcOk(selNode)&&(
              <div style={{marginTop:8,padding:"6px 10px",background:"#f0fdf4",border:`1px solid ${GR}`,borderRadius:6,fontSize:12,color:GR,fontWeight:700,textAlign:"center"}}>
                ✓ Ready to hand off
              </div>
            )}
          </div>
        )}

        {/* content sections */}
        {[{k:"w",lb:"Before You Start",ic:"◻",cl:"#64748b"},{k:"u",lb:"During",ic:"→",cl:P},{k:"c",lb:"Done When",ic:"✓",cl:GR},{k:"i",lb:"Reference",ic:"◈",cl:P,mono:true}]
          .map(({k,lb,ic,cl,mono})=>{
            const items=selNode[k]||[];if(!items.length)return null;
            return(
              <div key={k} style={{marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,color:cl,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:5}}>{ic} {lb}</div>
                {items.map((item,i)=>(
                  <div key={i} style={{display:"flex",gap:6,marginBottom:3}}>
                    <span style={{color:"#cbd5e1",minWidth:8,marginTop:1,fontSize:12,flexShrink:0}}>·</span>
                    <span style={{color:"#334155",fontFamily:mono?"'SF Mono','Fira Code',monospace":"inherit",fontSize:mono?11:12,wordBreak:"break-all",background:mono?"#f1f5f9":"transparent",padding:mono?"2px 4px":"0",borderRadius:mono?3:0,lineHeight:1.5}}>{item}</span>
                  </div>
                ))}
              </div>
            );
          })
        }
      </div>
    );
  };

  // ── AI send ────────────────────────────────────────────────────────
  const sendAI=async()=>{
    if(!aiIn.trim()||aiLoad)return;
    const msg=aiIn.trim();setAiIn("");setAiLoad(true);
    const sys=`You are an expert incident response assistant for Apex SaaS. Engineer is mid-incident — be concise, lead with most likely fix. Exhaust L1/L2 options before escalating.

Environment:
- PagerDuty: ops.apex.io/pd | On-call: #on-call Slack
- Datadog: metrics.apex.io | Recovery: dashboards.apex.io/incident-recovery
- ArgoCD: argocd.apex.internal | GitHub: github.com/apex-saas
- DB: db.apex.internal (ro: db-ro.apex.internal) | CDN: Fastly
- AWS Support: Business tier — 1hr production-down SLA
- Stripe emergency: +1-888-963-8777 (24/7)

IC: Alex Chen @alex.chen → Jamie Park @jamie.park (backup)
CX Lead: Sarah Kim @sarah.kim

Failure causes (likelihood order):
1. Memory leak in api-gateway post-deploy
2. DB connection pool exhaustion
3. Stripe webhook processing backlog
4. Fastly CDN cache poisoning

Escalation routing:
- Infra → @devops-oncall
- Security → @security-oncall
- Database → @dba-oncall
- Billing/payments → @billing-team + Stripe support

Credentials: 1Password "Incident Response" vault
Runbooks: wiki.apex.io/runbooks
Current step: ${selNode?.label||"unknown"}
${aiEdit?`\n=== EDIT MODE ===\nFlowchart JSON:\n${JSON.stringify({nodes,edges})}\n\nFor flowchart changes output:\n[FLOWCHART_CHANGE]{"actions":[...]}[/FLOWCHART_CHANGE]\nAction types:\n- add_node: {id, nodeType, label, x, y, exp, removeEdge}\n- remove_node: {id}\n- update_node_label: {id, label}\n- update_exp: {id, exp}\n- add_edge: {from, to, label}\n- remove_edge: {id}\nadd_node.removeEdge = edge id being split (required for insertion)`:""}`
    ;
    const msgs=[...aiMsgs.map(m=>({role:m.role,content:m.text})),{role:"user",content:msg}];
    setAiMsgs(p=>[...p,{role:"user",text:msg}]);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:sys,messages:msgs})
      });
      const data=await res.json();
      const text=data.content?.[0]?.text||`API error: ${JSON.stringify(data.error||data)}`;
      setAiMsgs(p=>[...p,{role:"assistant",text}]);
      const m=text.match(/\[FLOWCHART_CHANGE\]([\s\S]*?)\[\/FLOWCHART_CHANGE\]/);
      if(m){try{setPendE(JSON.parse(m[1]));}catch(e){console.error("Parse edit failed:",e);}}
    }catch(err){setAiMsgs(p=>[...p,{role:"assistant",text:`Network error: ${err.message}`}]);}
    setAiLoad(false);
  };

  // ── apply AI edit ──────────────────────────────────────────────────
  const applyEdit=edit=>{
    (edit.actions||[]).forEach(a=>{
      if(a.type==="add_node"){
        setNodes(p=>[...p,{id:a.id,type:a.nodeType||"process",label:a.label,x:a.x||400,y:a.y||400,exp:a.exp||10,w:[],u:[],c:[],i:[]}]);
        if(a.removeEdge){
          const old=edges.find(e=>e.id===a.removeEdge);
          if(old)setEdges(p=>[...p.filter(e=>e.id!==a.removeEdge),{id:`e-${Date.now()}a`,from:old.from,to:a.id,label:""},{id:`e-${Date.now()}b`,from:a.id,to:old.to,label:""}]);
        }
      }else if(a.type==="remove_node"){setNodes(p=>p.filter(n=>n.id!==a.id));setEdges(p=>p.filter(e=>e.from!==a.id&&e.to!==a.id));}
      else if(a.type==="update_node_label")setNodes(p=>p.map(n=>n.id===a.id?{...n,label:a.label}:n));
      else if(a.type==="update_exp")setNodes(p=>p.map(n=>n.id===a.id?{...n,exp:a.exp}:n));
      else if(a.type==="add_edge")setEdges(p=>[...p,{id:`e-${Date.now()}`,from:a.from,to:a.to,label:a.label||""}]);
      else if(a.type==="remove_edge")setEdges(p=>p.filter(e=>e.id!==a.id));
    });
    setPendE(null);
    addLog("AI flowchart edit applied");
    // check downstream
    const affected=[];
    (edit.actions||[]).forEach(a=>{
      if(a.type==="remove_node"||a.type==="remove_edge"){
        const ds=downstream(a.id);
        ds.filter(nid=>nSt[nid]==="active"||nSt[nid]==="done").forEach(nid=>affected.push(nid));
      }
    });
    if(affected.length)addLog(`⚠ Edit affected ${affected.length} active/done step(s)`);
  };

  const tot=nodes.filter(n=>n.type!=="terminal").length;
  const doneN=nodes.filter(n=>nSt[n.id]==="done").length;
  const actN=nodes.filter(n=>nSt[n.id]==="active").length;

  /* ═══ RENDER ═══════════════════════════════════════════════════════ */
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",fontFamily:"system-ui,-apple-system,sans-serif",background:"#f1f5f9",overflow:"hidden",position:"relative"}}>

      {/* ── Top bar ── */}
      <div style={{background:P,padding:"0 14px",height:50,display:"flex",alignItems:"center",gap:10,flexShrink:0,boxShadow:"0 2px 8px rgba(0,0,0,0.2)",zIndex:10}}>
        <span style={{fontWeight:700,fontSize:14,color:"#fff",letterSpacing:"-0.02em",whiteSpace:"nowrap"}}>🚨 Incident Response</span>
        <span style={{fontSize:11,color:"rgba(255,255,255,0.5)",display:"none"}}>Apex SaaS</span>
        {/* progress bar */}
        <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
          <div style={{width:70,height:4,background:"rgba(255,255,255,0.2)",borderRadius:2}}>
            <div style={{height:"100%",background:"#4ade80",borderRadius:2,width:`${tot?doneN/tot*100:0}%`,transition:"width 0.4s"}}/>
          </div>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.65)"}}>{doneN}/{tot}</span>
        </div>
        {sessOn&&sessTs&&(
          <div style={{background:"rgba(255,255,255,0.12)",padding:"2px 9px",borderRadius:10,fontSize:11,color:"#fff",display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:"#4ade80",display:"inline-block"}}/>
            {dur(tick-sessTs)}
          </div>
        )}
        <div style={{marginLeft:"auto",display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
          <Btn onClick={()=>{if(!sessOn){setSessOn(true);setSessTs(Date.now());addLog("Session started");}else{setSessOn(false);addLog("Session ended");}}} bg={sessOn?"#dc2626":"#16a34a"}>{sessOn?"⏹ End":"▶ Start"}</Btn>
          <Btn onClick={()=>setArrMode(a=>!a)} bg={arrMode?AC:"rgba(255,255,255,0.15)"}>{arrMode?"✏ ON":"✏ Arrange"}</Btn>
          <Btn onClick={save} bg={saved?"#16a34a":"rgba(255,255,255,0.15)"}>{saved?"✓ Saved":"💾 Save"}</Btn>
          <Btn onClick={copyTicket} bg="rgba(255,255,255,0.15)">📋 Ticket</Btn>
          <Btn onClick={()=>window.print()} bg="rgba(255,255,255,0.15)">🖨</Btn>
          <Btn onClick={()=>{if(window.confirm("Reset all progress and data?")){setNodes(BN);setEdges(BE);setNSt({});setNT0({});setNotes({});setLog([]);setChk({});setSessOn(false);setSessTs(null);setSel(null);addLog("Reset to defaults");}}} bg="rgba(220,38,38,0.35)">↺ Reset</Btn>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>

        {/* SVG Canvas */}
        <div style={{flex:1,overflow:"hidden",position:"relative",background:"#f8fafc",backgroundImage:"radial-gradient(#e2e8f0 1px,transparent 1px)",backgroundSize:"20px 20px"}}>
          <svg ref={svgRef} width="100%" height="100%"
            style={{display:"block",cursor:nodeDg?"grabbing":panDg?"grabbing":arrMode?"default":"grab"}}
            onMouseDown={onSvgDown} onMouseMove={onSvgMove} onMouseUp={onSvgUp} onMouseLeave={onSvgUp}
            onClick={e=>{if(e.target===svgRef.current||e.target.tagName==="svg")setSel(null);}}>
            <defs>
              <marker id="a" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0,8 3,0 6" fill="#94a3b8"/>
              </marker>
              <marker id="ad" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0,8 3,0 6" fill="#4ade80"/>
              </marker>
            </defs>
            <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
              {edges.map(renderEdge)}
              {nodes.map(renderNode)}
            </g>
          </svg>

          {/* zoom controls */}
          <div style={{position:"absolute",bottom:14,left:14,display:"flex",gap:4,alignItems:"center"}}>
            {[["−",0.8],["+",1.25],["⊡",null]].map(([l,f])=>(
              <button key={l} onClick={()=>f===null?(setZoom(0.55),setPan({x:30,y:8})):setZoom(z=>Math.max(0.12,Math.min(3,z*f)))}
                style={{width:26,height:26,background:"#fff",border:"1px solid #e2e8f0",borderRadius:4,cursor:"pointer",fontSize:l==="⊡"?11:15,fontWeight:700,color:"#374151",boxShadow:"0 1px 3px rgba(0,0,0,0.07)"}}>
                {l}
              </button>
            ))}
            <span style={{fontSize:10,color:"#64748b",marginLeft:3}}>{Math.round(zoom*100)}%</span>
          </div>

          {/* legend */}
          <div style={{position:"absolute",bottom:14,right:4,background:"rgba(255,255,255,0.92)",border:"1px solid #e2e8f0",borderRadius:8,padding:"5px 9px",fontSize:10,color:"#475569"}}>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",maxWidth:260}}>
              {[[AV,"active"],[GR,"done"],[RD,"blocked"],["#cbd5e1","todo"],[AC,"overtime"],[OR,"escalation"]].map(([c,l])=>(
                <span key={l} style={{display:"flex",alignItems:"center",gap:2}}><span style={{color:c,fontSize:11}}>●</span>{l}</span>
              ))}
            </div>
          </div>

          {arrMode&&<div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",background:AC,color:"#fff",padding:"4px 14px",borderRadius:20,fontSize:12,fontWeight:600,pointerEvents:"none",whiteSpace:"nowrap"}}>✏ Arrange — drag nodes · double-click to rename</div>}
        </div>

        {/* ── Right panel ── */}
        <div style={{width:355,background:"#fff",borderLeft:"1px solid #e2e8f0",display:"flex",flexDirection:"column",flexShrink:0}}>

          {/* tabs */}
          <div style={{display:"flex",borderBottom:"1px solid #e2e8f0",flexShrink:0,background:"#f8fafc"}}>
            {[["details","📋 Details"],["ai","🤖 AI Help"],["notes","📝 Notes"],["progress","📊 Progress"]].map(([t,lb])=>(
              <button key={t} onClick={()=>setTab(t)}
                style={{flex:1,padding:"9px 2px",border:"none",cursor:"pointer",fontSize:11,fontWeight:500,background:tab===t?"#fff":"transparent",color:tab===t?P:"#64748b",borderBottom:`2px solid ${tab===t?P:"transparent"}`,transition:"all 0.15s"}}>
                {lb}
              </button>
            ))}
          </div>

          {/* selected node strip */}
          {selNode&&(
            <div style={{padding:"7px 12px",background:"#eff6ff",borderBottom:"1px solid #dbeafe",fontSize:12,fontWeight:600,color:P,display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
              <span style={{fontSize:13}}>{selNode.type==="decision"?"◇":selNode.type==="terminal"?"⬭":selNode.type==="escalation"?"⚠":"□"}</span>
              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selNode.label}</span>
              {selNode.isQCGate&&<span style={{marginLeft:"auto",fontSize:10,color:GR,fontWeight:700}}>★ QC GATE</span>}
            </div>
          )}

          {/* tab content */}
          {tab!=="ai"&&(
            <div style={{flex:1,overflowY:"auto"}}>
              {tab==="details"&&renderDetails()}

              {tab==="notes"&&(
                <div style={{padding:13}}>
                  {selNode&&(
                    <div style={{marginBottom:14}}>
                      <div style={{fontWeight:600,fontSize:12,color:"#1e293b",marginBottom:6}}>Notes — {selNode.label}</div>
                      <textarea value={notes[selNode.id]||""} onChange={e=>setNotes(p=>({...p,[selNode.id]:e.target.value}))}
                        placeholder="Add step-specific notes..."
                        style={{width:"100%",minHeight:90,border:"1px solid #d1d5db",borderRadius:6,padding:"7px 9px",fontSize:12,resize:"vertical",outline:"none",fontFamily:"system-ui",boxSizing:"border-box"}}/>
                    </div>
                  )}
                  <div style={{borderTop:"1px solid #e2e8f0",paddingTop:12}}>
                    <div style={{fontWeight:600,fontSize:12,color:"#1e293b",marginBottom:7}}>Session Log</div>
                    {log.length===0&&<div style={{color:"#94a3b8",fontSize:12}}>No events yet.</div>}
                    {log.map((l,i)=>(
                      <div key={i} style={{display:"flex",gap:7,marginBottom:3,fontSize:11,borderBottom:"1px solid #f1f5f9",paddingBottom:3}}>
                        <span style={{color:"#94a3b8",minWidth:54,flexShrink:0}}>{l.ts}</span>
                        <span style={{color:"#334155",wordBreak:"break-word"}}>{l.msg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab==="progress"&&(
                <div style={{padding:13}}>
                  <div style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                      <span style={{fontWeight:600,fontSize:13,color:"#1e293b"}}>Overall Progress</span>
                      <span style={{fontSize:12,color:"#64748b"}}>{doneN} done · {actN} active</span>
                    </div>
                    <div style={{background:"#e2e8f0",borderRadius:8,height:9,overflow:"hidden"}}>
                      <div style={{height:"100%",background:GR,borderRadius:8,width:`${tot?doneN/tot*100:0}%`,transition:"width 0.4s"}}/>
                    </div>
                  </div>
                  <div style={{marginBottom:14}}>
                    <div style={{fontWeight:600,fontSize:12,color:"#1e293b",marginBottom:5}}>Session</div>
                    <div style={{fontSize:13,color:sessOn?P:"#94a3b8",fontWeight:sessOn?600:400}}>
                      {sessOn&&sessTs?`▶ Active · ${dur(tick-sessTs)}`:"Not started"}
                    </div>
                  </div>
                  <div>
                    <div style={{fontWeight:600,fontSize:12,color:"#1e293b",marginBottom:6}}>All Steps</div>
                    {nodes.map(n=>{
                      const st=nSt[n.id]||"todo",sT=nT0[n.id],el=sT?tick-sT:0,ot=st==="active"&&sT&&el>n.exp*60000*2;
                      return(
                        <div key={n.id} onClick={()=>{setSel(n.id);setTab("details");}}
                          style={{display:"flex",alignItems:"center",gap:7,padding:"5px 7px",marginBottom:2,borderRadius:6,cursor:"pointer",
                            background:sel===n.id?"#eff6ff":"transparent",border:`1px solid ${sel===n.id?"#bfdbfe":"transparent"}`}}>
                          <span style={{fontSize:10,color:"#94a3b8",flexShrink:0}}>{n.type==="terminal"?"⬭":n.type==="decision"?"◇":n.type==="escalation"?"⚠":"□"}</span>
                          <span style={{flex:1,fontSize:12,color:"#334155",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.label}</span>
                          {ot&&<span style={{fontSize:10,color:AC,flexShrink:0}}>⏱!</span>}
                          <span style={{fontSize:10,fontWeight:600,minWidth:44,textAlign:"right",flexShrink:0,color:st==="active"?AV:st==="done"?GR:st==="blocked"?RD:"#94a3b8"}}>
                            {st.toUpperCase()}
                          </span>
                          <span style={{fontSize:10,color:"#94a3b8",minWidth:28,textAlign:"right",flexShrink:0}}>
                            {sT?dur(el):`${n.exp}m`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI tab - separate flex layout for proper scroll */}
          {tab==="ai"&&(
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{padding:"7px 12px",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
                <span style={{fontSize:11,color:"#64748b"}}>Full env context injected</span>
                <label style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#64748b",cursor:"pointer"}}>
                  <input type="checkbox" checked={aiEdit} onChange={e=>setAiEdit(e.target.checked)}/>
                  Edit mode
                </label>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:10,display:"flex",flexDirection:"column",gap:7}}>
                {aiMsgs.length===0&&(
                  <div style={{color:"#94a3b8",fontSize:12,textAlign:"center",marginTop:28}}>
                    <div style={{fontSize:28,marginBottom:6}}>🤖</div>
                    Ask anything about this incident.<br/>Full environment context is pre-loaded.
                  </div>
                )}
                {aiMsgs.map((m,i)=>(
                  <div key={i} style={{padding:"8px 10px",borderRadius:8,fontSize:12,lineHeight:1.55,
                    background:m.role==="user"?"#eff6ff":"#f8fafc",
                    border:`1px solid ${m.role==="user"?"#bfdbfe":"#e2e8f0"}`,
                    alignSelf:m.role==="user"?"flex-end":"flex-start",
                    maxWidth:"90%",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                    {m.text.replace(/\[FLOWCHART_CHANGE\][\s\S]*?\[\/FLOWCHART_CHANGE\]/g,"[📊 Flowchart change proposed — see panel below]")}
                  </div>
                ))}
                {aiLoad&&(
                  <div style={{padding:"8px 10px",borderRadius:8,fontSize:12,background:"#f8fafc",border:"1px solid #e2e8f0",color:"#94a3b8",alignSelf:"flex-start"}}>⋯ thinking</div>
                )}
              </div>
              {pendE&&(
                <div style={{margin:"0 10px 8px",padding:"9px 11px",background:"#fffbeb",border:`1px solid ${AC}`,borderRadius:8,fontSize:12,flexShrink:0}}>
                  <div style={{fontWeight:700,color:"#92400e",marginBottom:5}}>📊 Proposed flowchart changes:</div>
                  {(pendE.actions||[]).map((a,i)=>(
                    <div key={i} style={{color:"#374151",marginBottom:2}}>
                      · <b>{a.type.replace(/_/g," ")}</b>{a.label?` — ${a.label}`:a.id?` — ${a.id}`:""}
                    </div>
                  ))}
                  <div style={{display:"flex",gap:6,marginTop:8}}>
                    <button onClick={()=>applyEdit(pendE)} style={{flex:1,padding:"5px 8px",background:GR,color:"#fff",border:"none",borderRadius:5,cursor:"pointer",fontSize:12,fontWeight:700}}>Apply</button>
                    <button onClick={()=>setPendE(null)} style={{flex:1,padding:"5px 8px",background:"#f3f4f6",color:"#374151",border:"1px solid #d1d5db",borderRadius:5,cursor:"pointer",fontSize:12}}>Dismiss</button>
                  </div>
                </div>
              )}
              <div style={{padding:"7px 10px",borderTop:"1px solid #e2e8f0",display:"flex",gap:6,flexShrink:0}}>
                <input value={aiIn} onChange={e=>setAiIn(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendAI();}}}
                  placeholder={selNode?`Ask about "${selNode.label}"...`:"Select a node first..."}
                  style={{flex:1,border:"1px solid #d1d5db",borderRadius:6,padding:"6px 9px",fontSize:12,outline:"none",fontFamily:"system-ui"}}/>
                <button onClick={sendAI} disabled={aiLoad}
                  style={{padding:"6px 13px",background:P,color:"#fff",border:"none",borderRadius:6,cursor:aiLoad?"not-allowed":"pointer",fontSize:13,fontWeight:600,opacity:aiLoad?0.6:1}}>
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Downstream modal ── */}
      {downM&&(
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50}}>
          <div style={{background:"#fff",borderRadius:12,padding:22,width:380,maxWidth:"90vw",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
            <div style={{fontWeight:700,fontSize:15,color:"#1e293b",marginBottom:8}}>⚠ Downstream Steps Affected</div>
            <div style={{fontSize:13,color:"#64748b",marginBottom:11}}>
              Marking <b>{nodes.find(n=>n.id===downM.id)?.label}</b> as <b>{downM.ns}</b> affects:
            </div>
            {downM.aff.map(nid=>(
              <div key={nid} style={{padding:"4px 10px",background:"#fef3c7",borderRadius:4,fontSize:12,color:"#92400e",marginBottom:3,border:"1px solid #fcd34d"}}>
                {nodes.find(n=>n.id===nid)?.label||nid} <span style={{opacity:0.65}}>({nSt[nid]})</span>
              </div>
            ))}
            <div style={{display:"flex",gap:8,marginTop:16}}>
              <button onClick={()=>applyStatus(downM.id,downM.ns)}
                style={{flex:1,padding:"9px",background:P,color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:13,fontWeight:600}}>
                Proceed Anyway
              </button>
              <button onClick={()=>setDownM(null)}
                style={{flex:1,padding:"9px",background:"#f1f5f9",color:"#374151",border:"1px solid #d1d5db",borderRadius:7,cursor:"pointer",fontSize:13}}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bypass modal ── */}
      {bypassM&&(
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50}}>
          <div style={{background:"#fff",borderRadius:12,padding:22,width:360,maxWidth:"90vw",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
            <div style={{fontWeight:700,fontSize:15,color:"#1e293b",marginBottom:7}}>Skip ↷ Step</div>
            <div style={{fontSize:13,color:"#64748b",marginBottom:4}}>
              Skipping: <b>{nodes.find(n=>n.id===bypassM)?.label}</b>
            </div>
            {nodes.find(n=>n.id===bypassM)?.bypassOwner&&(
              <div style={{fontSize:12,color:"#94a3b8",marginBottom:11}}>
                Owner note: {nodes.find(n=>n.id===bypassM)?.bypassOwner}
              </div>
            )}
            <textarea value={bypassR} onChange={e=>setBypassR(e.target.value)}
              placeholder="Reason for skipping (required)..."
              style={{width:"100%",height:78,border:"1px solid #d1d5db",borderRadius:6,padding:"7px 9px",fontSize:12,resize:"none",outline:"none",fontFamily:"system-ui",boxSizing:"border-box",marginBottom:11}}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{
                if(!bypassR.trim())return;
                applyStatus(bypassM,"done");
                addLog(`SKIPPED: ${nodes.find(n=>n.id===bypassM)?.label} — ${bypassR}`);
                setBypassM(null);setBypassR("");
              }} style={{flex:1,padding:"9px",background:AC,color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:13,fontWeight:600}}>
                Confirm Skip
              </button>
              <button onClick={()=>setBypassM(null)}
                style={{flex:1,padding:"9px",background:"#f1f5f9",color:"#374151",border:"1px solid #d1d5db",borderRadius:7,cursor:"pointer",fontSize:13}}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
