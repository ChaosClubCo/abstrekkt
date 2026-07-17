import { useState, useRef, useEffect, useCallback } from "react";

// ─── Constants
const SK = "skill-deploy-flow-v1";
const NW = 160, NH = 52;
const P = {
  bg:"#060d1a",surf:"#0c1928",brd:"#152a42",card:"#0e2038",
  txt:"#8ab8e2",mut:"#2a4a6a",dim:"#111e30",
  blue:"#1a4ed8",blueL:"#3b7eff",amber:"#d97706",
  done:"#15803d",act:"#7c3aed",blk:"#dc2626",esc:"#ea580c",ai:"#0891b2",
};
const ST = {
  todo:   {b:"#1c3050",bg:"#060d1a",dot:"#253c5a",tx:"#3d5a7a",lb:"TODO"},
  active: {b:"#7c3aed",bg:"#10082e",dot:"#7c3aed",tx:"#c4b5fd",lb:"ACTIVE"},
  done:   {b:"#15803d",bg:"#031508",dot:"#22c55e",tx:"#4ade80",lb:"DONE"},
  blocked:{b:"#dc2626",bg:"#150404",dot:"#f87171",tx:"#fca5a5",lb:"BLOCKED"},
};
const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

// ─── Node Definitions
const NODES = [
  {id:"start",t:"terminal",lbl:"START",exp:0,x:350,y:28,
   d:{w:["Open terminal or Claude Cowork session","Confirm lane: Personal or Intinc — never mix"],
      u:["Verify Cowork session healthy — check for RPC error on open"],
      c:["Lane confirmed","Working directory identified"],
      i:["Local: D:\\03_Development\\Skills","Monorepo: Krosebrook/source-of-truth-monorepo (master, skills/ prefix)","Cowork deployed: /mnt/skills/user/ (44 active)"]}},
  {id:"backlog",t:"process",lbl:"Backlog Selection\n(WSJF)",exp:10,x:350,y:140,
   d:{w:["Open skills backlog","WSJF = (BV + TC + RR) ÷ Job Size","Candidate must score ≥ 2.5"],
      u:["Confirm skill not already in /mnt/skills/user/"],
      c:["One skill selected, WSJF ≥ 2.5 documented","Not already deployed"],
      i:["Queue: Learning/Teaching Framework (3.2), DB Optimizer (3.0)","289 total scope, 44 deployed","FF 50-skill suite: flashfusion-skills-v1.skill already packaged"]}},
  {id:"author",t:"process",lbl:"Author SKILL.md",exp:30,x:350,y:248,
   d:{w:["Read developing-skills SKILL.md first","Gerund-first kebab-case name","Description: 3+ trigger phrase clusters, pushy language","version: \"1.0.0\" at root level"],
      u:["Body ≤ 500 lines","No TODO/PLACEHOLDER/TBD","No hardcoded secrets","allowed-tools = minimum required","Large refs → references/ subdir"],
      c:["3+ distinct trigger phrases in description","Version field present","No forbidden literals"],
      i:["Templates: D:\\03_Development\\Skills\\_templates","Bare desc → ~20% activation | Pushy desc → ~90%","Description = sole trigger mechanism (no hook engine)"]}},
  {id:"new-or-update",t:"decision",lbl:"New or\nUpdate?",exp:2,x:350,y:352,
   d:{w:["Check GitHub: Krosebrook/source-of-truth-monorepo master","Look for: skills/<name>/SKILL.md"],
      u:["Update → retrieve file SHA first (required for Zapier push)","New → no SHA needed"],
      c:["Branch identified, SHA noted if update"],
      i:["Path: skills/<name>/SKILL.md on master","Zapier github_create_or_update_file requires SHA for updates"]}},
  {id:"audit",t:"process",lbl:"31-Check Audit\n(skill-audit.py)",exp:15,x:350,y:448,
   d:{w:["Run: python skill-audit.py <skill-name>","Review all 31 checks across 6 personas","Document blast-radius score"],
      u:["6 personas: Security, Architect, QA, Perf, DevOps, A11y/UX","Check: executables, outbound calls, unknown MCP servers","Adversarial critic step before accepting pass"],
      c:["Zero hard failures","Blast-radius score documented","Adversarial critic completed"],
      i:["skill-audit.py at /home/claude/ in Cowork | D:\\03_Development\\Skills\\scripts\\ locally","Intinc library: 39 skills at 0 hard failures","Hard fail = secret, forbidden literal, path traversal, broad permissions"]}},
  {id:"audit-pass",t:"decision",lbl:"Audit\nPassed?",exp:2,x:350,y:544,
   d:{w:["Review audit summary output"],
      u:["Zero tolerance for hard failures","Soft failures: document and accept or fix"],
      c:["0 hard failures confirmed"],
      i:["Hard fail = secret exposure, forbidden literal, path traversal, overly broad permissions"]}},
  {id:"fix-violations",t:"process",lbl:"Fix Violations",exp:20,x:590,y:544,
   d:{w:["Review each hard failure individually","Priority: secrets > forbidden literals > structure > naming"],
      u:["Do not batch-fix","Re-read developing-skills SKILL.md after structural fixes","Bump patch version after any body change"],
      c:["All hard failures resolved","No new violations","Version bumped"],
      i:["Common: wrong gerund, missing version, bare description, TODO literals"]}},
  {id:"package",t:"process",lbl:"Package Zip\n(vp.py)",exp:10,x:350,y:644,
   d:{w:["Run: python vp.py <skill-name>","Verify: unzip -l <file>.zip"],
      u:["Must exclude: .DS_Store, .mcpb-cache/","Zip = build artifact — NEVER commit to git"],
      c:["Zip in outputs/","No .DS_Store","No .mcpb-cache","Structure verified"],
      i:["vp.py at /home/claude/ in Cowork","Binary: Linux → /mnt/user-data/outputs/ → present_files → manual placement"]}},
  {id:"size-check",t:"decision",lbl:"SKILL.md\n> 3KB?",exp:2,x:350,y:748,
   d:{w:["PS: (Get-Item SKILL.md).Length","Bash: wc -c SKILL.md"],
      u:["Zapier handles ≤3KB reliably | >3KB times out"],
      c:["Size confirmed, push path selected"],
      i:["Zapier GitHub tool limit: ~3KB","SHA required for updates regardless of size"]}},
  {id:"zapier-push",t:"process",lbl:"Zapier GitHub\n(≤3KB)",exp:8,x:108,y:860,
   d:{w:["Zapier: github_create_or_update_file","Path: skills/<name>/SKILL.md","Include SHA if update","Abort if timeout >30s"],
      u:["Hangs >30s → abort immediately, switch to local push"],
      c:["File on GitHub at correct path","Commit: \"feat(skills): add <name> v1.0.0\""],
      i:["Repo: Krosebrook/source-of-truth-monorepo, branch: master","Path prefix skills/ required"]}},
  {id:"local-push",t:"process",lbl:"Local git push\n(>3KB)",exp:8,x:592,y:860,
   d:{w:["cd D:\\03_Development\\Skills","git add skills/<name>/SKILL.md","git commit -m \"feat(skills): add <name> v1.0.0\"","git push origin master"],
      u:["Confirm branch = master","NEVER push zip artifacts"],
      c:["Commit on GitHub","Working tree clean"],
      i:["Do NOT push to stale branch: copilot/build-documentation-for-end-users (delete pending)"]}},
  {id:"cowork-deploy",t:"process",lbl:"Deploy to Cowork\n/mnt/skills/user/",exp:10,x:350,y:972,
   d:{w:["Upload zip via Cowork skill install UI","Or copy to /mnt/skills/user/<name>/ in active session"],
      u:["Sessions are sandboxed — deploy fresh each session","Artifacts do NOT persist between sessions"],
      c:["Skill in /mnt/skills/user/","SKILL.md readable in session"],
      i:["44 skills active","Known RPC error: check status.anthropic.com"]}},
  {id:"rpc-check",t:"decision",lbl:"Cowork RPC\nError?",exp:2,x:350,y:1072,
   d:{w:["Check session health on open","Look for: useradd exit status 12"],
      u:["Known persistent infra issue"],
      c:["Session healthy OR fallback confirmed"],
      i:["Error: useradd exit status 12","Check: status.anthropic.com"]}},
  {id:"fallback",t:"escalation",lbl:"Fallback:\nClaude Code + VS Code",exp:15,x:590,y:1072,eRet:"smoke-test",
   d:{w:["Switch to Claude Code terminal","Open VS Code: D:\\03_Development\\Skills","Run vp.py and skill-audit.py locally from scripts/"],
      u:["Monitor status.anthropic.com for Cowork recovery","Claude.ai chat = planning only in fallback mode"],
      c:["Local tooling confirmed working","GitHub push path verified"],
      i:["Surfaces: Projects (strategy) | Cowork (exec) | Dispatch (mobile)","Fallback does not block smoke testing"]}},
  {id:"smoke-test",t:"process",lbl:"Smoke Test\n(Activation Check)",exp:15,
   cl:true,ci:[
     {id:"t1",lb:"Primary trigger phrase activates skill",crit:true},
     {id:"t2",lb:"Secondary trigger phrase activates skill",crit:true},
     {id:"t3",lb:"Edge-case phrasing activates skill",crit:false},
     {id:"t4",lb:"Unrelated prompt does NOT activate skill",crit:true},
     {id:"t5",lb:"Skill body executes without runtime errors",crit:true},
     {id:"t6",lb:"references/ files accessible (if used)",crit:false},
   ],
   x:350,y:1182,
   d:{w:["Prepare 3+ test prompts: primary, secondary, edge-case","Prepare 1 negative-case prompt (must NOT trigger)","Run each in fresh context"],
      u:["Record each result: trigger / no-trigger","Rate = successes ÷ total"],
      c:["All ★ critical items pass","Activation rate ≥ 90%"],
      i:["Target ≥90% | Bare desc baseline: ~20%","Test in same Cowork session skill was deployed to"]}},
  {id:"activation-check",t:"decision",lbl:"Activation\n≥ 90%?",exp:2,x:350,y:1298,
   d:{w:["Calculate: successes ÷ total test prompts"],
      u:["Below 90% → description field is the primary fix","Check: verb strength, phrase count, domain nouns"],
      c:["Activation rate documented"],
      i:["Description = sole trigger mechanism","Aim for 3+ trigger phrase clusters with verb variants"]}},
  {id:"tune-desc",t:"process",lbl:"Tune Description\nField",exp:15,x:590,y:1298,
   d:{w:["Rewrite with more trigger phrases","Add verb variants: create/generate/build/make/draft/produce","Add \"Even if someone just says X — use this skill\" language","Bump patch version: 1.0.0 → 1.0.1"],
      u:["Re-run audit after change"],
      c:["Description rewritten","Version bumped","Audit re-passed"],
      i:["Router SKILL.md: keep ≤100 lines with progressive disclosure"]}},
  {id:"chaos-push",t:"process",lbl:"ChaosClubCo\nSecondary Push",exp:8,
   byp:true,bypNote:"Skip unless skill is in a FlashFusion plugin domain (7 exist). Personal and Intinc skills always skip.",
   x:350,y:1420,
   d:{w:["Is this skill part of a FlashFusion plugin domain?","If yes: push to ChaosClubCo/skills"],
      u:["7 FF domains: revenue, ai-risk-ops, platform-eng, ai-product, growth-mktg, industry-verticals, personal"],
      c:["Pushed to ChaosClubCo/skills OR bypass logged"],
      i:["flashfusion-skills-v1.skill: 50-skill suite already packaged","ChaosClubCo = new FF additions only"]}},
  {id:"qc-gate",t:"process",lbl:"QC Handoff Gate",exp:10,
   cl:true,ci:[
     {id:"q1",lb:"All 31 audit checks passed (0 hard failures)",crit:true},
     {id:"q2",lb:"Activation rate ≥ 90% confirmed",crit:true},
     {id:"q3",lb:"No hardcoded secrets in SKILL.md",crit:true},
     {id:"q4",lb:"No TODO/PLACEHOLDER/TBD literals",crit:true},
     {id:"q5",lb:"Zip excludes .DS_Store and .mcpb-cache/",crit:true},
     {id:"q6",lb:"GitHub commit at skills/ prefix on master",crit:true},
     {id:"q7",lb:"ChaosClubCo push (FlashFusion only)",crit:false},
     {id:"q8",lb:"what-changed.md produced",crit:false},
   ],
   x:350,y:1530,
   d:{w:["Complete each checklist item","All ★ are ship blockers"],
      u:["\"Mark Done\" only when all ★ pass"],
      c:["All ★ critical items: PASS","Gate cleared"],
      i:["Production gate: 31-check + blast-radius + adversarial critic","Zero shortcuts on security"]}},
  {id:"log",t:"process",lbl:"Log to Skill\nAudit Trail",exp:5,x:350,y:1648,
   d:{w:["Log: name, version, lane, WSJF, activation rate, date","Note audit findings and bypass reasons","Update deployed count (44 → +1)"],
      u:["Update monorepo README if new domain"],
      c:["Audit trail entry created","Count updated"],
      i:["Total scope: 289 | Deployed: ~44","Next: Learning/Teaching (3.2), DB Optimizer (3.0)"]}},
  {id:"done",t:"terminal",lbl:"DONE",exp:0,x:350,y:1760,
   d:{w:["Session complete — record total duration"],
      u:[],
      c:["Skill live in /mnt/skills/user/","GitHub commit confirmed","Audit trail updated"],
      i:["Zip = build artifact, delete local copy","Cowork sandboxed: zip + download before closing"]}},
];

// ─── Edge Definitions
const EDGES = [
  {f:"start",t:"backlog"},
  {f:"backlog",t:"author"},
  {f:"author",t:"new-or-update"},
  {f:"new-or-update",t:"audit",lb:"Any"},
  {f:"audit",t:"audit-pass"},
  {f:"audit-pass",t:"package",lb:"Yes"},
  {f:"audit-pass",t:"fix-violations",lb:"No"},
  {f:"fix-violations",t:"audit",lb:"Retry",sp:"fix-retry"},
  {f:"package",t:"size-check"},
  {f:"size-check",t:"zapier-push",lb:"≤3KB",sp:"sz-left"},
  {f:"size-check",t:"local-push",lb:">3KB",sp:"sz-right"},
  {f:"zapier-push",t:"cowork-deploy"},
  {f:"local-push",t:"cowork-deploy"},
  {f:"cowork-deploy",t:"rpc-check"},
  {f:"rpc-check",t:"smoke-test",lb:"No"},
  {f:"rpc-check",t:"fallback",lb:"Yes"},
  {f:"fallback",t:"smoke-test",lb:"Resolved",sp:"fb-conv"},
  {f:"smoke-test",t:"activation-check"},
  {f:"activation-check",t:"chaos-push",lb:"Yes"},
  {f:"activation-check",t:"tune-desc",lb:"No"},
  {f:"tune-desc",t:"author",lb:"Rework",sp:"tune-retry"},
  {f:"chaos-push",t:"qc-gate"},
  {f:"qc-gate",t:"log",lb:"Pass"},
  {f:"log",t:"done"},
];

// ─── Geometry helpers
function nc(n) {
  const cx=n.x+NW/2, cy=n.y+NH/2;
  return {top:{x:cx,y:n.y},bot:{x:cx,y:n.y+NH},lft:{x:n.x,y:cy},rgt:{x:n.x+NW,y:cy},cx,cy};
}
function ep(edge,nm) {
  const fn=nm[edge.f],tn=nm[edge.t];
  if(!fn||!tn) return {d:"",lp:null};
  const fc=nc(fn),tc=nc(tn);
  switch(edge.sp){
    case"fix-retry":{
      const s=fc.rgt,e=nc({...nm.audit,x:nm.audit.x,y:nm.audit.y}).rgt;
      const rx=818;
      return{d:`M${s.x} ${s.y}L${rx} ${s.y}L${rx} ${e.y}L${e.x} ${e.y}`,lp:{x:rx+7,y:(s.y+e.y)/2}};
    }
    case"tune-retry":{
      const s=fc.rgt,e=nc(nm.author).rgt;
      const rx=840;
      return{d:`M${s.x} ${s.y}L${rx} ${s.y}L${rx} ${e.y}L${e.x} ${e.y}`,lp:{x:rx+7,y:(s.y+e.y)/2}};
    }
    case"sz-left":{
      const s=fc.lft,e=tc.top;
      return{d:`M${s.x} ${s.y}C${s.x-80} ${s.y} ${e.x} ${e.y-50} ${e.x} ${e.y}`,lp:{x:s.x-35,y:s.y+55}};
    }
    case"sz-right":{
      const s=fc.rgt,e=tc.top;
      return{d:`M${s.x} ${s.y}C${s.x+80} ${s.y} ${e.x} ${e.y-50} ${e.x} ${e.y}`,lp:{x:s.x+32,y:s.y+55}};
    }
    case"fb-conv":{
      const s=fc.bot,e=tc.rgt;
      return{d:`M${s.x} ${s.y}C${s.x} ${s.y+40} ${e.x+30} ${e.y} ${e.x} ${e.y}`,lp:{x:(s.x+e.x)/2+20,y:(s.y+e.y)/2}};
    }
    default: break;
  }
  // Same Y = horizontal
  if(Math.abs(fn.y-tn.y)<5){
    if(tn.x>fn.x) return{d:`M${fc.rgt.x} ${fc.rgt.y}L${tc.lft.x} ${tc.lft.y}`,lp:{x:(fc.rgt.x+tc.lft.x)/2,y:fc.rgt.y-10}};
    return{d:`M${fc.lft.x} ${fc.lft.y}L${tc.rgt.x} ${tc.rgt.y}`,lp:{x:(fc.lft.x+tc.rgt.x)/2,y:fc.lft.y-10}};
  }
  // Default: bottom → top
  const s=fc.bot,e=tc.top;
  if(Math.abs(s.x-e.x)<4) return{d:`M${s.x} ${s.y}L${e.x} ${e.y}`,lp:{x:s.x+7,y:(s.y+e.y)/2}};
  const cy1=s.y+(e.y-s.y)*0.4,cy2=e.y-(e.y-s.y)*0.4;
  return{d:`M${s.x} ${s.y}C${s.x} ${cy1} ${e.x} ${cy2} ${e.x} ${e.y}`,lp:{x:(s.x+e.x)/2,y:(s.y+e.y)/2}};
}

// ─── AI System Prompt
const AI_SYS=`You are an embedded troubleshooter for Kyle Rosebrook's Skills Library Deployment workflow. Mid-task support. Concise. Lead with the most likely fix. Exhaust local options before escalating. Solo project — no external escalation.

ENVIRONMENT:
- Local: D:\\03_Development\\Skills
- Cowork deployed: /mnt/skills/user/ (44 active, 289 total scope)
- GitHub: Krosebrook/source-of-truth-monorepo (master, skills/ prefix required)
- Secondary: ChaosClubCo/skills (FlashFusion plugin domains ONLY — 7 domains)
- Scripts: vp.py (packaging), skill-audit.py (31-check) — /home/claude/ in Cowork, D:\\03_Development\\Skills\\scripts\\ locally
- Queue: Learning/Teaching Framework (WSJF 3.2), DB Optimizer (3.0)

FAILURE MODES (by frequency):
1. Audit failure — wrong gerund name, missing version field, bare description (<20% activation), TODO literals
2. Zapier timeout — file >3KB → local git push immediately
3. Cowork RPC error (useradd exit status 12) — check status.anthropic.com, fallback to Claude Code + VS Code
4. Low activation (<90%) — description field is the ONLY trigger mechanism; rewrite with more verb clusters
5. Zip pollution — .DS_Store or .mcpb-cache/ included → regenerate with vp.py
6. SHA missing on Zapier update — retrieve SHA from GitHub first

RULES: Description = sole trigger (no hook engine). Body ≤500 lines. Gerund-first kebab-case. Never commit zips. Never mix lane contexts. Bitwarden = primary secrets. Keeper = LEGACY.`;

// ─── Main App
export default function App() {
  const nodeMap=Object.fromEntries(NODES.map(n=>[n.id,n]));
  const [nPos,setNPos]=useState(()=>Object.fromEntries(NODES.map(n=>[n.id,{x:n.x,y:n.y}])));
  const [statuses,setStatuses]=useState({});
  const [checks,setChecks]=useState({});
  const [bypasses,setBypasses]=useState({});
  const [sel,setSel]=useState(null);
  const [tab,setTab]=useState("details");
  const [notes,setNotes]=useState({});
  const [sLog,setSLog]=useState([]);
  const [sessStart,setSessStart]=useState(null);
  const [elapsed,setElapsed]=useState(0);
  const [nAct,setNAct]=useState({});
  const [nElap,setNElap]=useState({});
  const [pz,setPz]=useState({x:20,y:10,s:0.53});
  const [panSt,setPanSt]=useState(null);
  const [dragSt,setDragSt]=useState(null);
  const [editMode,setEditMode]=useState(false);
  const [aiMsgs,setAiMsgs]=useState([]);
  const [aiInput,setAiInput]=useState("");
  const [aiLoading,setAiLoading]=useState(false);
  const [noteInput,setNoteInput]=useState("");
  const [bypassModal,setBypassModal]=useState(null);
  const [bypassInput,setBypassInput]=useState("");
  const [dsModal,setDsModal]=useState(null);
  const [pendSt,setPendSt]=useState(null);
  const svgRef=useRef(null);

  const persist=useCallback(async(ov={})=>{
    try{await window.storage.set(SK,JSON.stringify({statuses,checks,bypasses,notes,sLog,sessStart,nPos,nAct,nElap,...ov}));}catch{}
  },[statuses,checks,bypasses,notes,sLog,sessStart,nPos,nAct,nElap]);

  useEffect(()=>{
    (async()=>{try{const r=await window.storage.get(SK);if(r){const d=JSON.parse(r.value);
      if(d.statuses)setStatuses(d.statuses);if(d.checks)setChecks(d.checks);
      if(d.bypasses)setBypasses(d.bypasses);if(d.notes)setNotes(d.notes);
      if(d.sLog)setSLog(d.sLog);if(d.sessStart)setSessStart(d.sessStart);
      if(d.nPos)setNPos(d.nPos);if(d.nAct)setNAct(d.nAct);if(d.nElap)setNElap(d.nElap);
    }}catch{}})();
  },[]);

  useEffect(()=>{
    if(!sessStart)return;
    const t=setInterval(()=>setElapsed(Math.floor((Date.now()-sessStart)/1000)),1000);
    return()=>clearInterval(t);
  },[sessStart]);

  useEffect(()=>{
    const t=setInterval(()=>{
      setNElap(prev=>{
        const u={...prev};
        Object.entries(statuses).forEach(([id,st])=>{if(st==="active"&&nAct[id])u[id]=Math.floor((Date.now()-nAct[id])/1000);});
        return u;
      });
    },4000);
    return()=>clearInterval(t);
  },[statuses,nAct]);

  const getSt=id=>statuses[id]||"todo";

  const getDownstream=id=>{
    const vis=new Set(),q=EDGES.filter(e=>e.f===id).map(e=>e.t);
    while(q.length){const c=q.shift();if(vis.has(c))continue;vis.add(c);EDGES.filter(e=>e.f===c).forEach(e=>q.push(e.t));}
    return[...vis];
  };

  const logEv=msg=>{setSLog(p=>[...p,{ts:Date.now(),msg}].slice(-60));};

  const doSetStatus=(id,ns,force=false)=>{
    if(!force&&ns==="done"){
      const af=getDownstream(id).filter(d=>["active","done"].includes(getSt(d)));
      if(af.length){setDsModal({id,ns,af});setPendSt({id,ns});return;}
    }
    setStatuses(p=>{
      const next={...p,[id]:ns};
      const nat=ns==="active"?{...nAct,[id]:Date.now()}:nAct;
      setNAct(nat);
      setTimeout(()=>persist({statuses:next,nAct:nat}),0);
      return next;
    });
    logEv(`${id} → ${ns.toUpperCase()}`);
  };

  const ckKey=(nid,iid)=>`${nid}_${iid}`;
  const getCk=(nid,iid)=>checks[ckKey(nid,iid)]||null;
  const setCk=(nid,iid,v)=>{setChecks(p=>{const n={...p,[ckKey(nid,iid)]:v};setTimeout(()=>persist({checks:n}),0);return n;});};

  const doBypass=(id,reason)=>{
    setBypasses(p=>{const n={...p,[id]:reason};setTimeout(()=>persist({bypasses:n}),0);return n;});
    logEv(`BYPASS: ${id} — ${reason}`);
    doSetStatus(id,"done",true);
    setBypassModal(null);setBypassInput("");
  };

  const startSess=()=>{const ts=Date.now();setSessStart(ts);logEv("Session started");setTimeout(()=>persist({sessStart:ts}),0);};
  const stopSess=()=>{logEv(`Session ended — ${fmt(elapsed)}`);setSessStart(null);setTimeout(()=>persist({sessStart:null}),0);};

  const onWheel=e=>{e.preventDefault();const d=e.deltaY>0?0.88:1.14;setPz(p=>({...p,s:Math.min(2.2,Math.max(0.18,p.s*d))}));};
  const onSvgMD=e=>{if(e.target.closest("[data-node]"))return;setPanSt({mx:e.clientX,my:e.clientY,px:pz.x,py:pz.y});};
  const onSvgMM=e=>{
    if(panSt)setPz(p=>({...p,x:panSt.px+(e.clientX-panSt.mx),y:panSt.py+(e.clientY-panSt.my)}));
    if(dragSt&&editMode&&svgRef.current){
      const r=svgRef.current.getBoundingClientRect();
      const mx=(e.clientX-r.left-pz.x)/pz.s,my=(e.clientY-r.top-pz.y)/pz.s;
      setNPos(p=>({...p,[dragSt.id]:{x:mx-dragSt.ox,y:my-dragSt.oy}}));
    }
  };
  const onSvgMU=()=>{if(dragSt)setTimeout(()=>persist(),0);setPanSt(null);setDragSt(null);};

  const onNodeMD=(e,id)=>{
    e.stopPropagation();setSel(id);setTab("details");
    if(editMode&&svgRef.current){
      const r=svgRef.current.getBoundingClientRect();
      const mx=(e.clientX-r.left-pz.x)/pz.s,my=(e.clientY-r.top-pz.y)/pz.s;
      const pos=nPos[id];
      setDragSt({id,ox:mx-pos.x,oy:my-pos.y});
    }
  };

  const sendAI=async()=>{
    if(!aiInput.trim()||aiLoading)return;
    const um=aiInput.trim();setAiInput("");
    const nm=[...aiMsgs,{role:"user",content:um}];setAiMsgs(nm);setAiLoading(true);
    const sn=sel?NODES.find(n=>n.id===sel):null;
    const ctx=sn?`\n\n[Current step: ${sn.lbl.replace(/\n/g," ")} | Status: ${getSt(sel)}]`:"";
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:AI_SYS+ctx,messages:nm})});
      const d=await r.json();
      const rep=d.content?.find(c=>c.type==="text")?.text||"No response.";
      setAiMsgs(p=>[...p,{role:"assistant",content:rep}]);
    }catch{setAiMsgs(p=>[...p,{role:"assistant",content:"API error — check connection."}]);}
    finally{setAiLoading(false);}
  };

  const copyTicket=()=>{
    const done=NODES.filter(n=>getSt(n.id)==="done").sort((a,b)=>(nAct[a.id]||0)-(nAct[b.id]||0));
    navigator.clipboard.writeText(done.map(n=>`✓ ${n.lbl.replace(/\n/g," ")}`).join("\n")||"(none)");
  };

  const nodesWithPos=NODES.map(n=>({...n,...nPos[n.id]||{x:n.x,y:n.y}}));
  const nmWithPos=Object.fromEntries(nodesWithPos.map(n=>[n.id,n]));
  const doneCount=NODES.filter(n=>getSt(n.id)==="done").length;
  const progress=Math.round(doneCount/NODES.length*100);
  const selNode=sel?NODES.find(n=>n.id===sel):null;
  const selSt=sel?getSt(sel):"todo";
  const selStC=ST[selSt];

  // ── Render node
  const renderNode=n=>{
    const st=getSt(n.id),sc=ST[st],isSel=sel===n.id;
    const isOT=st==="active"&&nAct[n.id]&&nElap[n.id]>(n.exp*60*2)&&n.exp>0;
    const stroke=isSel?"#ffffff":(n.t==="escalation"?P.esc:(n.byp?P.amber:sc.b));
    const sw=isSel?2:1.5;
    const cx=n.x+NW/2,cy=n.y+NH/2;
    const lines=n.lbl.split("\n");
    const txtEls=lines.map((line,i)=>(
      <text key={i} x={cx} y={cy+(i-(lines.length-1)/2)*14}
        textAnchor="middle" dominantBaseline="middle"
        fill={sc.tx} fontSize={10.5} fontFamily="system-ui,sans-serif" fontWeight={n.t==="terminal"?700:500}>{line}</text>
    ));
    const dot=<circle cx={n.x+NW-8} cy={n.y+8} r={3.5} fill={sc.dot}/>;
    const otRing=isOT?<rect x={n.x-3} y={n.y-3} width={NW+6} height={NH+6} rx={7} fill="none" stroke="#d97706" strokeWidth={1.5} strokeDasharray="5 3" opacity={0.9}/>:null;

    if(n.t==="decision"){
      const pts=`${cx},${n.y} ${n.x+NW},${cy} ${cx},${n.y+NH} ${n.x},${cy}`;
      return(
        <g key={n.id} data-node="1" cursor={editMode?"move":"pointer"} onMouseDown={e=>onNodeMD(e,n.id)}>
          {isOT&&<polygon points={`${cx},${n.y-4} ${n.x+NW+4},${cy} ${cx},${n.y+NH+4} ${n.x-4},${cy}`} fill="none" stroke="#d97706" strokeWidth={1.5} strokeDasharray="5 3" opacity={0.9}/>}
          <polygon points={pts} fill={sc.bg} stroke={stroke} strokeWidth={sw}/>
          {isSel&&<polygon points={`${cx},${n.y-4} ${n.x+NW+4},${cy} ${cx},${n.y+NH+4} ${n.x-4},${cy}`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1}/>}
          {txtEls}{dot}
        </g>
      );
    }
    const rx=n.t==="terminal"?NH/2:(n.t==="escalation"?5:4);
    return(
      <g key={n.id} data-node="1" cursor={editMode?"move":"pointer"} onMouseDown={e=>onNodeMD(e,n.id)}>
        {otRing}
        <rect x={n.x} y={n.y} width={NW} height={NH} rx={rx} fill={sc.bg} stroke={stroke} strokeWidth={sw} strokeDasharray={n.byp?"5 3":undefined}/>
        {n.t==="escalation"&&<rect x={n.x} y={n.y} width={3} height={NH} rx={1.5} fill={P.esc}/>}
        {n.cl&&<text x={n.x+NW-10} y={n.y+11} textAnchor="middle" fill={sc.tx} fontSize={9} opacity={0.6}>☑</text>}
        {isSel&&<rect x={n.x-2} y={n.y-2} width={NW+4} height={NH+4} rx={rx+2} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1}/>}
        {txtEls}{dot}
      </g>
    );
  };

  // ── Render edge
  const renderEdge=edge=>{
    const {d,lp}=ep(edge,nmWithPos);
    if(!d)return null;
    return(
      <g key={`${edge.f}-${edge.t}`}>
        <path d={d} fill="none" stroke="#1e3a5c" strokeWidth={1.5} markerEnd="url(#arr)"/>
        {edge.lb&&lp&&<text x={lp.x} y={lp.y} textAnchor="middle" fill="#2d4a6a" fontSize={9} fontFamily="system-ui">{edge.lb}</text>}
      </g>
    );
  };

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:P.bg,color:P.txt,fontFamily:"system-ui,sans-serif",userSelect:"none",overflow:"hidden"}}>

      {/* ── Top Bar */}
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"0 12px",height:44,background:P.surf,borderBottom:`1px solid ${P.brd}`,flexShrink:0,fontSize:12}}>
        <div style={{fontWeight:800,fontSize:13,color:"#5b9bd5",letterSpacing:"-0.02em"}}>⬡ SKILL DEPLOY</div>
        <div style={{color:P.mut,fontSize:10}}>Personal / FlashFusion</div>
        <div style={{flex:1}}/>
        <div style={{fontVariantNumeric:"tabular-nums",fontSize:12,color:sessStart?"#4ade80":P.mut,fontWeight:700,fontFamily:"monospace"}}>{fmt(elapsed)}</div>
        <button onClick={sessStart?stopSess:startSess}
          style={{padding:"3px 10px",background:sessStart?"#200606":"#071a0e",border:`1px solid ${sessStart?P.blk:P.done}`,color:sessStart?"#f87171":"#4ade80",borderRadius:4,cursor:"pointer",fontSize:10,fontWeight:700}}>
          {sessStart?"◾ Stop":"▶ Start"}
        </button>
        <div style={{width:1,background:P.brd,height:20}}/>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:72,height:4,background:P.dim,borderRadius:2}}>
            <div style={{width:`${progress}%`,height:"100%",background:P.done,borderRadius:2,transition:"width 0.4s"}}/>
          </div>
          <div style={{color:P.mut,fontSize:10}}>{doneCount}/{NODES.length}</div>
        </div>
        <div style={{width:1,background:P.brd,height:20}}/>
        <button onClick={()=>setEditMode(e=>!e)}
          style={{padding:"3px 8px",background:editMode?P.dim:"transparent",border:`1px solid ${editMode?P.blueL:P.brd}`,color:editMode?P.blueL:P.mut,borderRadius:4,cursor:"pointer",fontSize:9,fontWeight:600}}>
          {editMode?"✎ ARRANGE ON":"✎ ARRANGE OFF"}
        </button>
        <button onClick={copyTicket}
          style={{padding:"3px 8px",background:"transparent",border:`1px solid ${P.brd}`,color:P.mut,borderRadius:4,cursor:"pointer",fontSize:9}}>Copy Ticket</button>
        <button onClick={async()=>{try{await window.storage.delete(SK);}catch{}window.location.reload();}}
          style={{padding:"3px 8px",background:"transparent",border:`1px solid ${P.brd}`,color:P.mut,borderRadius:4,cursor:"pointer",fontSize:9}}>Reset</button>
      </div>

      {/* ── Body */}
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>

        {/* ── Canvas */}
        <div style={{flex:1,overflow:"hidden",position:"relative"}} onWheel={onWheel}>
          <svg ref={svgRef} style={{width:"100%",height:"100%",cursor:panSt?"grabbing":(editMode?"crosshair":"grab")}}
            onMouseDown={onSvgMD} onMouseMove={onSvgMM} onMouseUp={onSvgMU} onMouseLeave={onSvgMU}>
            <defs>
              <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#1e3a5c"/>
              </marker>
            </defs>
            <g transform={`translate(${pz.x},${pz.y}) scale(${pz.s})`}>
              {EDGES.map(e=>renderEdge(e))}
              {nodesWithPos.map(n=>renderNode(n))}
            </g>
          </svg>
          <div style={{position:"absolute",bottom:10,left:10,display:"flex",flexDirection:"column",gap:4}}>
            {[{l:"+",d:1.18},{l:"−",d:0.85},{l:"⊙",d:null}].map(({l,d})=>(
              <button key={l} onClick={()=>d?setPz(p=>({...p,s:Math.min(2.2,Math.max(0.18,p.s*d))})):setPz({x:20,y:10,s:0.53})}
                style={{width:26,height:26,background:P.surf,border:`1px solid ${P.brd}`,color:P.txt,borderRadius:4,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>{l}</button>
            ))}
          </div>
          <div style={{position:"absolute",bottom:10,right:8,color:P.mut,fontSize:9}}>{Math.round(pz.s*100)}%</div>
        </div>

        {/* ── Right Panel */}
        <div style={{width:308,background:P.surf,borderLeft:`1px solid ${P.brd}`,display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0}}>
          <div style={{display:"flex",borderBottom:`1px solid ${P.brd}`,flexShrink:0}}>
            {["details","ai","notes","progress"].map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                style={{flex:1,padding:"7px 0",background:tab===t?P.card:"transparent",border:"none",borderBottom:`2px solid ${tab===t?P.blueL:"transparent"}`,color:tab===t?P.txt:P.mut,cursor:"pointer",fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>
                {t==="ai"?"AI Help":t[0].toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
          <div style={{flex:1,overflowY:"auto",padding:10}}>
            {tab==="details"&&<DetailsTab node={selNode} st={selSt} stc={selStC} checks={checks} bypasses={bypasses} doSetStatus={doSetStatus} setCk={setCk} setBypassModal={setBypassModal}/>}
            {tab==="ai"&&<AITab msgs={aiMsgs} input={aiInput} setInput={setAiInput} onSend={sendAI} loading={aiLoading}/>}
            {tab==="notes"&&<NotesTab node={selNode} notes={notes} sLog={sLog} noteInput={noteInput} setNoteInput={setNoteInput} onSave={(id,txt)=>{setNotes(p=>{const n={...p,[id]:txt};setTimeout(()=>persist({notes:n}),0);return n;});}}/>}
            {tab==="progress"&&<ProgressTab nodes={NODES} statuses={statuses} nElap={nElap} elapsed={elapsed} getSt={getSt}/>}
          </div>
        </div>
      </div>

      {/* ── Bypass Modal */}
      {bypassModal&&(
        <Overlay title="Skip ↷ — Log Bypass Reason" onClose={()=>{setBypassModal(null);setBypassInput("");}}>
          <p style={{color:P.txt,fontSize:11,margin:"0 0 8px",lineHeight:1.5}}>{NODES.find(n=>n.id===bypassModal)?.bypNote||"Provide a reason for skipping."}</p>
          <textarea value={bypassInput} onChange={e=>setBypassInput(e.target.value)} placeholder="Reason..."
            style={{width:"100%",background:P.card,border:`1px solid ${P.brd}`,color:P.txt,borderRadius:4,padding:8,fontSize:11,resize:"none",height:72,boxSizing:"border-box",fontFamily:"system-ui"}}/>
          <div style={{display:"flex",gap:8,marginTop:8,justifyContent:"flex-end"}}>
            <Btn onClick={()=>{setBypassModal(null);setBypassInput("");}} muted>Cancel</Btn>
            <Btn onClick={()=>bypassInput.trim()&&doBypass(bypassModal,bypassInput.trim())} green>Skip ↷</Btn>
          </div>
        </Overlay>
      )}

      {/* ── Downstream Modal */}
      {dsModal&&(
        <Overlay title="⚠ Downstream Steps Affected" onClose={()=>{setDsModal(null);setPendSt(null);}}>
          <p style={{color:P.txt,fontSize:11,margin:"0 0 6px"}}>Marking <strong>{dsModal.id}</strong> done — these downstream steps are already active/done:</p>
          <ul style={{margin:"0 0 12px",padding:"0 0 0 14px",color:"#fbbf24",fontSize:11}}>
            {dsModal.af.map(id=><li key={id}>{id}</li>)}
          </ul>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <Btn onClick={()=>{setDsModal(null);setPendSt(null);}} muted>Cancel</Btn>
            <Btn onClick={()=>{if(pendSt)doSetStatus(pendSt.id,pendSt.ns,true);setDsModal(null);setPendSt(null);}} red>Mark Done Anyway</Btn>
          </div>
        </Overlay>
      )}
    </div>
  );
}

// ─── Sub-components
function Overlay({title,onClose,children}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}}>
      <div style={{background:"#0d1f35",border:"1px solid #162a42",borderRadius:8,padding:18,width:360,maxWidth:"90vw"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:12,color:"#8ab8e2"}}>{title}</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#2a4060",cursor:"pointer",fontSize:16,lineHeight:1}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Btn({children,onClick,muted,green,red}){
  return(
    <button onClick={onClick}
      style={{padding:"4px 12px",background:muted?"#111e30":(green?"#041508":(red?"#150404":"#111e30")),
        border:`1px solid ${muted?"#162a42":(green?"#15803d":(red?"#dc2626":"#162a42"))}`,
        color:muted?"#2a4060":(green?"#4ade80":(red?"#f87171":"#8ab8e2")),
        borderRadius:4,cursor:"pointer",fontSize:10,fontWeight:700}}>
      {children}
    </button>
  );
}

function DetailsTab({node,st,stc,checks,bypasses,doSetStatus,setCk,setBypassModal}){
  if(!node) return <div style={{color:"#2a4060",fontSize:11,textAlign:"center",paddingTop:36}}>Select a node to see details</div>;
  const ck=iid=>checks[`${node.id}_${iid}`]||null;
  const critItems=(node.ci||[]).filter(i=>i.crit);
  const allCritPass=critItems.length===0||critItems.every(i=>checks[`${node.id}_${i.id}`]==="pass");
  const isBypassed=!!bypasses[node.id];

  return(
    <div style={{fontSize:11}}>
      {/* Header */}
      <div style={{marginBottom:10,padding:"9px 10px",background:"#0e2038",borderRadius:6,border:"1px solid #162a42"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6,flexWrap:"wrap"}}>
          <span style={{fontWeight:700,fontSize:12,color:"#a8c4e0",lineHeight:1.3}}>{node.lbl.replace(/\n/g," ")}</span>
          <span style={{padding:"1px 5px",background:stc?.bg||"#060d1a",border:`1px solid ${stc?.b||"#1c3050"}`,color:stc?.tx||"#3d5a7a",borderRadius:3,fontSize:8,fontWeight:800,letterSpacing:"0.06em"}}>{stc?.lb||"TODO"}</span>
        </div>
        <div style={{display:"flex",gap:3,marginBottom:node.exp?4:0}}>
          {["todo","active","done","blocked"].map(s=>{
            const sc2=ST[s];
            const disabled=s==="done"&&node.cl&&!allCritPass&&!isBypassed;
            return(
              <button key={s} onClick={()=>!disabled&&doSetStatus(node.id,s)}
                style={{flex:1,padding:"3px 2px",background:st===s?(sc2?.bg||"#060d1a"):"#0c1928",
                  border:`1px solid ${st===s?(sc2?.b||"#1c3050"):"#152a42"}`,
                  color:st===s?(sc2?.tx||"#3d5a7a"):"#2a4060",
                  borderRadius:3,cursor:disabled?"not-allowed":"pointer",fontSize:8,fontWeight:700,opacity:disabled?0.4:1}}>
                {s.toUpperCase()}
              </button>
            );
          })}
        </div>
        {node.exp>0&&<div style={{color:"#2a4060",fontSize:9}}>Expected: {node.exp} min</div>}
        {isBypassed&&<div style={{color:"#d97706",fontSize:9,marginTop:3}}>↷ Bypassed: {bypasses[node.id]}</div>}
      </div>

      {node.byp&&!isBypassed&&(
        <button onClick={()=>setBypassModal(node.id)}
          style={{width:"100%",padding:5,background:"#160f00",border:"1px solid #d97706",color:"#d97706",borderRadius:4,cursor:"pointer",fontSize:10,fontWeight:700,marginBottom:8}}>
          Skip ↷  (Optional Step)
        </button>
      )}
      {node.t==="escalation"&&node.eRet&&(
        <button onClick={()=>{doSetStatus(node.id,"done",true);doSetStatus(node.eRet,"active");}}
          style={{width:"100%",padding:5,background:"#160800",border:"1px solid #ea580c",color:"#fb923c",borderRadius:4,cursor:"pointer",fontSize:10,fontWeight:700,marginBottom:8}}>
          ↩ Resolved — Return to {node.eRet.replace(/-/g," ")}
        </button>
      )}

      {/* Checklist */}
      {node.cl&&node.ci&&(
        <div style={{marginBottom:10}}>
          <div style={{fontWeight:800,fontSize:9,color:"#2a4a6a",letterSpacing:"0.08em",marginBottom:5}}>CHECKLIST</div>
          {node.ci.map(item=>{
            const v=ck(item.id);
            return(
              <div key={item.id} style={{display:"flex",alignItems:"center",gap:5,marginBottom:4,padding:"4px 7px",background:v==="pass"?"#031508":(v==="fail"?"#150404":"#0e2038"),borderRadius:4,border:`1px solid ${v==="pass"?"#15803d":(v==="fail"?"#dc2626":"#162a42")}`}}>
                <span style={{color:item.crit?"#fbbf24":"#2a4060",fontSize:10,width:10,flexShrink:0}}>{item.crit?"★":"○"}</span>
                <span style={{flex:1,color:v==="pass"?"#4ade80":(v==="fail"?"#f87171":"#6b8aaa"),fontSize:10,lineHeight:1.3}}>{item.lb}</span>
                {["pass","fail","skip"].map(sv=>(
                  <button key={sv} onClick={()=>setCk(node.id,item.id,v===sv?null:sv)}
                    style={{padding:"1px 5px",fontSize:8,borderRadius:3,cursor:"pointer",fontWeight:800,
                      background:v===sv?(sv==="pass"?"#031508":(sv==="fail"?"#150404":"#1a1208")):"#0c1928",
                      border:`1px solid ${v===sv?(sv==="pass"?"#15803d":(sv==="fail"?"#dc2626":"#78716c")):"#152a42"}`,
                      color:v===sv?(sv==="pass"?"#4ade80":(sv==="fail"?"#f87171":"#a8a29e")):"#2a4060"}}>
                    {sv==="pass"?"✓":sv==="fail"?"✗":"↷"}
                  </button>
                ))}
              </div>
            );
          })}
          {node.ci.some(i=>i.crit)&&(
            <div style={{padding:"6px 8px",borderRadius:4,marginTop:4,background:allCritPass?"#031508":"#150d02",border:`1px solid ${allCritPass?"#15803d":"#78350f"}`,color:allCritPass?"#4ade80":"#d97706",fontSize:10,textAlign:"center",fontWeight:800}}>
              {allCritPass?"✓ GATE CLEARED":"⚠ Waiting on ★ items"}
            </div>
          )}
        </div>
      )}

      {/* Detail sections */}
      {[{k:"w",lbl:"WALK-UP / BEFORE",col:"#2a4a6a"},{k:"u",lbl:"DURING",col:"#2a4060"},{k:"c",lbl:"COMPLETION CRITERIA",col:"#15803d"},{k:"i",lbl:"ENV-SPECIFIC INFO",col:"#1a4ed8"}].map(({k,lbl,col})=>{
        const items=node.d?.[k];if(!items?.length)return null;
        return(
          <div key={k} style={{marginBottom:9}}>
            <div style={{fontSize:8,fontWeight:800,color:col,letterSpacing:"0.08em",marginBottom:4}}>{lbl}</div>
            {items.map((item,i)=>(
              <div key={i} style={{display:"flex",gap:5,marginBottom:4}}>
                <span style={{color:col,fontSize:9,flexShrink:0,marginTop:1}}>·</span>
                <span style={{color:"#5a7a9a",fontSize:10,lineHeight:1.4}}>{item}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function AITab({msgs,input,setInput,onSend,loading}){
  const endRef=useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[msgs]);
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",gap:7}}>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:7,minHeight:0}}>
        {msgs.length===0&&<div style={{color:"#2a4060",fontSize:10,textAlign:"center",paddingTop:20,lineHeight:1.6}}>Ask about audit failures, Zapier limits, Cowork RPC errors, low activation rates, or any deployment issue.</div>}
        {msgs.map((m,i)=>(
          <div key={i} style={{padding:"7px 9px",borderRadius:5,background:m.role==="user"?"#0a1828":"#051420",border:`1px solid ${m.role==="user"?"#152a42":"#0c2535"}`,fontSize:10}}>
            <div style={{color:m.role==="user"?"#5b9bd5":"#0891b2",fontSize:8,fontWeight:800,marginBottom:3}}>{m.role==="user"?"YOU":"AI ASSIST"}</div>
            <div style={{color:"#8ab8e2",lineHeight:1.5,whiteSpace:"pre-wrap"}}>{m.content}</div>
          </div>
        ))}
        {loading&&<div style={{color:"#0891b2",fontSize:11,textAlign:"center",letterSpacing:"0.2em"}}>···</div>}
        <div ref={endRef}/>
      </div>
      <div style={{display:"flex",gap:5,flexShrink:0}}>
        <textarea value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();onSend();}}}
          placeholder="Ask anything about this workflow..."
          style={{flex:1,background:"#0e2038",border:"1px solid #152a42",color:"#8ab8e2",borderRadius:4,padding:"5px 7px",fontSize:10,resize:"none",height:52,fontFamily:"system-ui"}}/>
        <button onClick={onSend} disabled={loading||!input.trim()}
          style={{padding:"5px 9px",background:loading?"#0c1928":"#091830",border:`1px solid ${loading?"#152a42":"#1a4ed8"}`,color:loading?"#2a4060":"#5b9bd5",borderRadius:4,cursor:"pointer",fontSize:12,alignSelf:"flex-end"}}>↑</button>
      </div>
    </div>
  );
}

function NotesTab({node,notes,sLog,noteInput,setNoteInput,onSave}){
  const nodeNote=node?(notes[node.id]||""):"";
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {node&&(
        <div>
          <div style={{fontSize:8,fontWeight:800,color:"#2a4060",letterSpacing:"0.08em",marginBottom:5}}>NOTE FOR: {node.lbl.replace(/\n/g," ")}</div>
          <textarea value={noteInput!==undefined?noteInput:nodeNote}
            onChange={e=>setNoteInput(e.target.value)}
            placeholder="Add a note for this step..."
            style={{width:"100%",background:"#0e2038",border:"1px solid #152a42",color:"#8ab8e2",borderRadius:4,padding:7,fontSize:10,resize:"none",height:72,boxSizing:"border-box",fontFamily:"system-ui"}}/>
          <button onClick={()=>onSave(node.id,noteInput)}
            style={{marginTop:4,padding:"3px 10px",background:"#091830",border:"1px solid #1a4ed8",color:"#5b9bd5",borderRadius:4,cursor:"pointer",fontSize:9,fontWeight:700}}>Save Note</button>
          {notes[node.id]&&<div style={{marginTop:6,padding:"5px 7px",background:"#0a1828",borderRadius:4,fontSize:10,color:"#5a7a9a",lineHeight:1.4}}>Saved: {notes[node.id]}</div>}
        </div>
      )}
      <div>
        <div style={{fontSize:8,fontWeight:800,color:"#2a4060",letterSpacing:"0.08em",marginBottom:5}}>SESSION LOG</div>
        {sLog.length===0&&<div style={{color:"#2a4060",fontSize:10}}>No events yet.</div>}
        {[...sLog].reverse().slice(0,20).map((entry,i)=>(
          <div key={i} style={{display:"flex",gap:6,marginBottom:4,borderBottom:"1px solid #0e1a2a",paddingBottom:4}}>
            <span style={{color:"#1a4060",fontSize:9,flexShrink:0,fontFamily:"monospace"}}>
              {new Date(entry.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
            </span>
            <span style={{color:"#4a6a8a",fontSize:10}}>{entry.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressTab({nodes,statuses,nElap,elapsed,getSt}){
  const counts={todo:0,active:0,done:0,blocked:0};
  nodes.forEach(n=>counts[getSt(n.id)]++);
  const done=counts.done,total=nodes.length;
  return(
    <div style={{fontSize:10}}>
      <div style={{marginBottom:12,padding:"8px 10px",background:"#0e2038",borderRadius:6,border:"1px solid #152a42"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          <span style={{color:"#8ab8e2",fontWeight:700}}>Session Elapsed</span>
          <span style={{fontFamily:"monospace",color:"#5b9bd5",fontWeight:700}}>{fmt(elapsed)}</span>
        </div>
        <div style={{width:"100%",height:6,background:"#111e30",borderRadius:3,marginBottom:6}}>
          <div style={{width:`${Math.round(done/total*100)}%`,height:"100%",background:"#15803d",borderRadius:3,transition:"width 0.4s"}}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          {Object.entries(counts).map(([k,v])=>(
            <div key={k} style={{flex:1,textAlign:"center"}}>
              <div style={{fontWeight:800,fontSize:13,color:ST[k]?.tx||"#3d5a7a"}}>{v}</div>
              <div style={{fontSize:8,color:"#1a3050",letterSpacing:"0.06em"}}>{k.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
      {nodes.map(n=>{
        const st=getSt(n.id),sc=ST[st];
        const el=nElap[n.id];
        return(
          <div key={n.id} style={{display:"flex",alignItems:"center",gap:7,marginBottom:5,padding:"4px 8px",background:"#0a1828",borderRadius:4,border:`1px solid ${st!=="todo"?sc.b:"#0e1a2a"}`}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:sc.dot,flexShrink:0}}/>
            <div style={{flex:1,color:st!=="todo"?sc.tx:"#3d5a7a",fontSize:10,lineHeight:1.2}}>{n.lbl.replace(/\n/g," ")}</div>
            {el&&st==="active"&&<div style={{fontFamily:"monospace",fontSize:9,color:"#d97706"}}>{fmt(el)}</div>}
            {st==="done"&&<div style={{fontSize:9,color:"#4ade80"}}>✓</div>}
            {st==="blocked"&&<div style={{fontSize:9,color:"#f87171"}}>✗</div>}
          </div>
        );
      })}
    </div>
  );
}
