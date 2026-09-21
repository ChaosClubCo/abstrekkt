import { useState, useEffect, useRef, useCallback } from "react";

// ── Constants ──────────────────────────────────────────────────────────────────
const SK = 'orchestrator-ai-v1';
const PRIMARY = '#7c3aed';
const ESC_C = '#ea580c';
const BG = '#09090b', PBG = '#0f0f11', CBG = '#18181b', BD = '#27272a';
const TX = '#e4e4e7', MU = '#71717a';
const SC = {
  todo:    {b:'#3f3f46',f:'#18181b',t:'#a1a1aa'},
  active:  {b:'#7c3aed',f:'#180f35',t:'#c4b5fd'},
  done:    {b:'#16a34a',f:'#052e16',t:'#86efac'},
  blocked: {b:'#dc2626',f:'#1a0505',t:'#fca5a5'},
};
const PC = {Design:'#3b82f6',Build:'#7c3aed',Test:'#06b6d4',Deploy:'#10b981',Monitor:'#f59e0b'};
const NW = {terminal:155,process:165,decision:122,escalation:165,checklist:165};
const NH = {terminal:46,process:52,decision:68,escalation:52,checklist:52};
const nw = t => NW[t]||165, nh = t => NH[t]||52;
const nc = n => ({x:n.x+nw(n.type)/2, y:n.y+nh(n.type)/2});

// ── Edge geometry ──────────────────────────────────────────────────────────────
function getEP(fn,tn){
  const fc=nc(fn),tc=nc(tn);
  const dx=tc.x-fc.x,dy=tc.y-fc.y;
  const len=Math.hypot(dx,dy);
  if(len<1)return{sx:fc.x,sy:fc.y,ex:tc.x,ey:tc.y};
  const ux=dx/len,uy=dy/len;
  const t1=Math.min(ux?nw(fn.type)/2/Math.abs(ux):1e9, uy?nh(fn.type)/2/Math.abs(uy):1e9);
  const t2=Math.min(ux?nw(tn.type)/2/Math.abs(ux):1e9, uy?nh(tn.type)/2/Math.abs(uy):1e9);
  const cap=len*.44;
  return{sx:fc.x+ux*Math.min(t1,cap),sy:fc.y+uy*Math.min(t1,cap),ex:tc.x-ux*Math.min(t2,cap),ey:tc.y-uy*Math.min(t2,cap)};
}
function buildPath(fn,tn){
  const{sx,sy,ex,ey}=getEP(fn,tn);
  const dnx=tn.x-fn.x,dny=tn.y-fn.y;
  if(dny<-20&&Math.abs(dnx)<80){const ox=Math.min(fn.x,tn.x)-70;return`M${sx} ${sy} C${ox} ${sy} ${ox} ${ey} ${ex} ${ey}`;}
  if(dnx<-80){
    if(dny<-20){const rx=Math.max(sx,ex)+88;return`M${sx} ${sy} C${rx} ${sy} ${rx} ${ey} ${ex} ${ey}`;}
    return`M${sx} ${sy} C${sx+68} ${sy} ${ex+68} ${ey} ${ex} ${ey}`;
  }
  return`M${sx} ${sy} L${ex} ${ey}`;
}

// ── Node positions ─────────────────────────────────────────────────────────────
const MX=308, DX=330, RX=510;

// ── Node data ─────────────────────────────────────────────────────────────────
const INIT_NODES=[
  {id:'N01',type:'terminal',label:'Release Cycle\nStart',x:MX+5,y:20,exp:5,phase:'Design',
   detail:{w:['Confirm scope: entities affected, n8n workflows impacted'],u:['Review last Base44 release notes','Check TokenBudget before touching anything'],c:['Scope confirmed','All parties notified'],i:['App ID: 68dd8e79ca073475565c8e16','n8n: https://krosebrook.app.n8n.cloud']}},
  {id:'N02',type:'process',label:'Spec Feature /\nEntity Changes',x:MX,y:110,exp:30,phase:'Design',
   detail:{w:['List new/modified entities and field changes','Identify affected n8n workflows','Flag any breaking schema changes'],u:['Document in Base44 app notes','Cross-check 88-entity baseline'],c:['Entity list confirmed','Affected workflows named','Breaking changes flagged'],i:['88 entity baseline post-SOC2 refactor','Every entity must have: id, tenant_id, created_at, updated_at','AuditEvent required on all write ops']}},
  {id:'N03',type:'process',label:'TokenBudget\nBaseline Snapshot',x:MX,y:200,exp:5,phase:'Design',bypassable:true,bypassOwner:'Self — skip if budget checked in last 30 min',
   detail:{w:['Open TokenBudget entity in Base44','Record current used_tokens per tenant'],u:['Soft ceiling = 80% of limit_tokens','Save value to session notes before any build work'],c:['Baseline recorded','Soft ceiling confirmed'],i:['Fields: tenant_id, used_tokens, limit_tokens, period','Hard limit = workflow auto-pauses','80% = pre-deploy warning threshold']}},
  {id:'D01',type:'decision',label:'Schema\nValid?',x:DX,y:288,exp:5,phase:'Design',
   detail:{w:['Validate new entity fields against Base44 rules','Check tenant_id on all new entities','Verify RLS rules exist per entity'],u:['Common fail: missing tenant_id field on new entity'],c:['All entities have required fields','RLS confirmed on all new entities'],i:['Missing tenant_id = silent cross-tenant data leak','RLS must enforce tenant isolation per entity']}},
  {id:'N04',type:'process',label:'Build Entity Schema\nin Base44',x:MX,y:398,exp:45,phase:'Build',
   detail:{w:['Open Base44 app 68dd8e79ca073475565c8e16','Create/modify entities per spec','Apply RLS rules per entity','Add AuditEvent triggers on write ops'],u:['PascalCase entities, camelCase fields','All new entities: id, tenant_id, created_at, updated_at','WebhookBridge entity = the link between Base44 and n8n'],c:['All entities created','RLS applied','AuditEvent wired','Entity count incremented'],i:['Pre-release baseline: 88 entities (post SOC2 refactor)','Audit trail mandatory on all write ops (SOC2 requirement)']}},
  {id:'D02',type:'decision',label:'SCH-02 Lane\nField Present?',x:DX,y:488,exp:5,phase:'Build',
   detail:{w:['Check each WIR workflow entity for lane field (SCH-02)','Query: WIR entities where lane IS NULL'],u:['Base44 MCP: filter WorkflowEntity where type=WIR AND lane=null'],c:['All WIR entities have lane field populated','No null lane values'],i:['SCH-02 = hard blocker for all 4 WIR workflows','WIR IDs: rCVu2glYrnROgipT, xHJO7htByEd07ZGp, vTzMuNpichJO871n, QPf2SqTRVEOKyeQV']}},
  {id:'E01',type:'escalation',label:'Fix SCH-02\nLane Field',x:RX,y:488,exp:20,phase:'Build',originatesFrom:'D02',
   detail:{w:['Identify WIR entities with null lane field','Add lane field value to each in Base44'],u:['Base44 MCP: update_entity → add lane: <value>','Verify all 4 WIR IDs updated'],c:['All WIR entities have lane field','No null lane values remain'],i:['Canonical WIR IDs: rCVu2glYrnROgipT, xHJO7htByEd07ZGp, vTzMuNpichJO871n, QPf2SqTRVEOKyeQV','Hard blocks ALL 4 WIR workflow activations until fixed']}},
  {id:'N05',type:'process',label:'Wire\nWebhookBridge',x:MX,y:595,exp:20,phase:'Build',
   detail:{w:['Open WebhookBridge entity in Base44','Update n8n webhook URLs for all affected workflows','Confirm endpoints match current n8n cloud domain'],u:['n8n base: https://krosebrook.app.n8n.cloud','Each workflow has a unique webhook path','Verify URL live with curl before saving'],c:['WebhookBridge endpoints updated','All URLs verified reachable (200)'],i:['Stale webhook URL = #1 silent failure mode after Base44 redeploy','WebhookBridge stores: endpoint + auth header per workflow']}},
  {id:'D03',type:'decision',label:'Bearer Creds\nVerified?',x:DX,y:685,exp:5,phase:'Build',
   detail:{w:['Test n8n API auth with current Bearer token','Check token expiry date'],u:['Hit n8n health endpoint with Bearer token — expect 200 response'],c:['Bearer token: 200 response','Expiry not within 7 days'],i:['Missing/expired Bearer = ALL 11 workflows hard-blocked','4 WIR + 7 OAI workflows all use same Bearer pattern','Store: Base44 CredentialRegistry entity or .env']}},
  {id:'E02',type:'escalation',label:'Rotate / Verify\nBearer Creds',x:RX,y:685,exp:30,phase:'Build',originatesFrom:'D03',
   detail:{w:['Locate current Bearer token','Generate new token if expired','Update all 11 WebhookBridge auth headers in Base44'],u:['n8n: Settings → API → Regenerate key','Update all 11 workflow webhook headers with the new token'],c:['New Bearer token: 200 verified','All 11 webhook headers updated in Base44 WebhookBridge'],i:['Unblocks all 11 workflows at once when fixed','4 WIR + 7 OAI all share the same Bearer pattern']}},
  {id:'N06',type:'process',label:'Build / Update\nn8n Workflow',x:MX,y:790,exp:60,phase:'Build',
   detail:{w:['Open n8n at https://krosebrook.app.n8n.cloud','Locate or create the workflow','Wire nodes, credentials, webhook trigger','CHECK for orphan WIR-01 dupes FIRST before building'],u:['SDK pattern: workflow() → node({config}) → .to() chaining','Arrow functions BLOCKED in n8n SDK — use named functions only','Delete orphan WIR-01 dupes before building to avoid double-execution'],c:['Workflow built','No orphan dupes remain','Credentials wired','Webhook trigger configured and tested'],i:['4 orphan WIR-01 dupes exist — delete before activating any WIR workflow','Arrow function block is known n8n SDK issue — do not use =>']}},
  {id:'D04',type:'decision',label:'Webhook\nReachable?',x:DX,y:890,exp:5,phase:'Test',
   detail:{w:['Ping n8n webhook URL from Base44 test trigger or curl','Check HTTP response code'],u:['Expected: 200 response + execution queued in n8n log'],c:['200 response received','Execution appears in n8n log'],i:['Stale URL after Base44 redeploy: update WebhookBridge entity','Most common silent failure mode after any Base44 redeploy']}},
  {id:'N06b',type:'process',label:'Fix Webhook\nURL',x:RX,y:890,exp:10,phase:'Test',
   detail:{w:['Open WebhookBridge entity in Base44','Update endpoint URL to the current n8n path'],u:['Verify new URL manually (curl) before saving','Retest connectivity immediately after saving'],c:['Webhook URL updated','Reachability confirmed (200)'],i:['This is the #1 silent failure mode after any Base44 redeploy']}},
  {id:'N07',type:'process',label:'Run Workflow\nSmoke Test',x:MX,y:1005,exp:20,phase:'Test',
   detail:{w:['Trigger workflow manually in n8n','Pass minimal valid payload','Watch execution log in real time'],u:['All nodes should go green in execution log','Verify AuditEvent entity receives a write after execution'],c:['Full execution completes without errors','AuditEvent entry created with correct tenant_id, event_type, timestamp'],i:['n8n execution log: left sidebar → Executions tab','AuditEvent: verify tenant_id, event_type, entity_name, timestamp all populated']}},
  {id:'D05',type:'decision',label:'Test\nPassed?',x:DX,y:1095,exp:5,phase:'Test',
   detail:{w:['Review n8n execution result — all nodes green?','Check AuditEvent entries post-execution','Verify no orphan dupe triggered a second execution'],u:['All nodes green in execution log = pass','AuditEvent count = +1 per expected write op'],c:['Execution result: success','AuditEvent entries correct and unique'],i:['Common fail: orphan WIR-01 dupe fires a second execution','Filter n8n executions for duplicate workflow_id to check']}},
  {id:'N07b',type:'process',label:'Debug & Fix',x:RX,y:1095,exp:30,phase:'Test',
   detail:{w:['Check n8n execution error detail (click failing node)','Identify root cause','Cross-reference Base44 entity state'],u:['Top causes in order: SCH-02 null, stale webhook, orphan dupe, Bearer expired','Fix root cause — not just the symptom','Delete orphan WIR-01 dupes if found before retesting'],c:['Root cause identified and documented','Fix applied','Ready to retest smoke test'],i:['Canonical WIR IDs: rCVu2glYrnROgipT, xHJO7htByEd07ZGp, vTzMuNpichJO871n, QPf2SqTRVEOKyeQV','Any WIR workflow ID NOT in that list = orphan = delete it']}},
  {id:'N08',type:'checklist',label:'Audit Trail\nVerification',x:MX,y:1200,exp:15,phase:'Test',
   checklistItems:[
    {id:'a1',label:'AuditEvent fires on entity write',critical:true,status:null},
    {id:'a2',label:'Correct tenant_id on all events',critical:true,status:null},
    {id:'a3',label:'event_type field populated correctly',critical:true,status:null},
    {id:'a4',label:'No duplicate AuditEvent entries',critical:true,status:null},
    {id:'a5',label:'Timestamp within 5s of action',critical:false,status:null},
    {id:'a6',label:'AuditEvent count matches write ops',critical:false,status:null},
   ],
   detail:{w:['Spot-check 3 random AuditEvent records post-smoke-test','Verify all required fields populated on each record'],u:['Query Base44 AuditEvent entity, filter by current session timestamp'],c:['All ★ items pass','No duplicate events','Tenant isolation confirmed in logs'],i:['AuditEvent fields: id, tenant_id, event_type, entity_name, entity_id, actor_id, timestamp, payload','RLS must block cross-tenant audit reads']}},
  {id:'D06',type:'decision',label:'Token Budget\nWithin 80%?',x:DX,y:1310,exp:5,phase:'Deploy',
   detail:{w:['Check TokenBudget entity vs baseline snapshot from session start','Confirm usage < 80% of limit_tokens'],u:['Query Base44 TokenBudget for current tenant','Compare to baseline recorded at session start'],c:['Usage < 80% of hard limit','No budget alert firing'],i:['80% = soft warning threshold, pause and review before proceeding','100% = hard limit, workflow auto-pauses mid-run']}},
  {id:'E03',type:'escalation',label:'Trim or Raise\nToken Budget',x:RX,y:1310,exp:20,phase:'Deploy',originatesFrom:'D06',
   detail:{w:['Identify which operations consume excess tokens','Either optimize prompts OR raise the limit in Base44'],u:['Raise limit: Base44 TokenBudget entity → update limit_tokens field','Trim usage: reduce max_tokens in n8n AI nodes (currently set to 800/call per spec)'],c:['Budget usage < 80% of limit','Limit updated if raised, optimization documented if trimmed'],i:['Raising: update limit_tokens in TokenBudget entity via Base44 MCP']}},
  {id:'N09',type:'process',label:'Activate Workflow\nin n8n',x:MX,y:1420,exp:10,phase:'Deploy',
   detail:{w:['Open n8n workflow','Toggle Active switch to ON','Verify webhook endpoint goes live immediately'],u:['Confirm workflow appears in Active list','Test webhook with curl right after activation — do not assume it works'],c:['Workflow status: Active','Webhook live and returning 200','No immediate errors in n8n execution log'],i:['WIR IDs: rCVu2glYrnROgipT, xHJO7htByEd07ZGp, vTzMuNpichJO871n, QPf2SqTRVEOKyeQV','7 OAI workflows also require Bearer + SCH-02 before activation']}},
  {id:'N10',type:'process',label:'Post-Deploy\nVerification',x:MX,y:1510,exp:15,phase:'Deploy',
   detail:{w:['Trigger live workflow with a real (production) payload','Check Base44 entity state updated correctly','Verify AuditEvent entry created in production context'],u:['Use production tenant for this test — not a test tenant','Check n8n execution log for any warnings or slow nodes'],c:['Live execution succeeded without errors','Base44 entity state correct post-execution','Production AuditEvent logged','No orphan executions observed'],i:['This is the go/no-go gate before transitioning to Monitor phase','Any failure here triggers the Rollback decision immediately']}},
  {id:'D07',type:'decision',label:'Rollback\nNeeded?',x:DX,y:1600,exp:5,phase:'Deploy',
   detail:{w:['Review all post-deploy verification results','Check for any unexpected side effects on Base44 entities'],u:['Default to rollback if ANY ★ criterion failed in verification','Verify Base44 entity count unchanged (no ghost entities created)'],c:['All verification criteria met','Zero unexpected side effects','No rollback needed'],i:['Rollback triggers: failed live execution, wrong entity state, missing AuditEvent, unexpected dupe execution']}},
  {id:'N10b',type:'process',label:'Rollback',x:RX,y:1600,exp:20,phase:'Deploy',
   detail:{w:['Deactivate workflow in n8n immediately (toggle to inactive)','Revert schema changes in Base44 if safe to do so','Log rollback event in AuditEvent with event_type: ROLLBACK'],u:['n8n: toggle workflow Active switch to OFF','Base44 MCP: revert/delete new entities only if no data written','Document root cause in session notes before anything else'],c:['Workflow deactivated','Schema reverted or migration planned','Rollback AuditEvent entry logged with root cause'],i:['If schema rollback is destructive (data was written), STOP and plan a safe migration path first']}},
  {id:'N11',type:'process',label:'Monitor Token\nBudget',x:MX,y:1710,exp:10,phase:'Monitor',bypassable:true,bypassOwner:'Self — skip if headroom confirmed at deploy',
   detail:{w:['Query Base44 TokenBudget entity','Track usage trend vs previous release baseline'],u:['Alert threshold: 80% of limit_tokens','Compare to baseline recorded at session start'],c:['Budget trend stable across sessions','Not approaching hard limit'],i:['No native alerting in Base44 — manual check per release or build a scheduled n8n monitoring workflow','Pro move: n8n scheduled workflow that polls TokenBudget daily and alerts on >75%']}},
  {id:'N12',type:'process',label:'WIR-01 Dupe\nCleanup',x:MX,y:1800,exp:10,phase:'Monitor',bypassable:true,bypassOwner:'Self — skip if dupe check confirmed clean in Build phase',
   detail:{w:['Query n8n for ALL workflows with WIR in name or type','Identify any IDs not in the canonical 4-item list','Delete all orphan workflows immediately'],u:['Canonical IDs: rCVu2glYrnROgipT, xHJO7htByEd07ZGp, vTzMuNpichJO871n, QPf2SqTRVEOKyeQV','ANY other WIR-type workflow ID = orphan = delete it now'],c:['Only 4 canonical WIR workflows remain in n8n','No orphan WIR-01 dupes confirmed'],i:['4 orphan WIR-01 dupes confirmed existing as of last audit','Risk: two workflows respond to same trigger = double-execution, double AuditEvents, double entity writes']}},
  {id:'N13',type:'checklist',label:'QC / Handoff\nGate',x:MX,y:1895,exp:20,phase:'Monitor',
   checklistItems:[
    {id:'q1',label:'Schema valid — all entities have tenant_id',critical:true,status:null},
    {id:'q2',label:'All smoke tests passed without errors',critical:true,status:null},
    {id:'q3',label:'Audit trail verified (all ★ items pass)',critical:true,status:null},
    {id:'q4',label:'Token budget within limit at deploy time',critical:true,status:null},
    {id:'q5',label:'No orphan WIR-01 dupes remaining',critical:true,status:null},
    {id:'q6',label:'Live execution verified post-deploy',critical:true,status:null},
    {id:'q7',label:'Base44 changelog entry added',critical:false,status:null},
    {id:'q8',label:'n8n workflow descriptions updated',critical:false,status:null},
    {id:'q9',label:'Token budget trend documented in notes',critical:false,status:null},
   ],
   detail:{w:['Run all ★ critical items before marking done','Log any ○ recommended items skipped with reason'],u:['Gate: ALL 6 ★ items must pass before "Mark Done" button is enabled','Bypass only available for ○ recommended items'],c:['All 6 ★ items: pass','Ready to Hand Off banner visible'],i:['This is the final human-verified gate before the release is considered complete and handed off']}},
  {id:'N14',type:'terminal',label:'Release\nComplete',x:MX+5,y:2005,exp:2,phase:'Monitor',
   detail:{w:['Confirm all nodes are done or bypassed with documented reason'],u:['Archive session notes to Base44 or Google Drive','Copy Ticket text for handoff or post-mortem'],c:['All nodes: done or bypassed with reason','QC gate cleared (all ★ items passed)'],i:['Copy Ticket button → sorted completion log for handoff or incident record']}},
];

// ── Edge data ──────────────────────────────────────────────────────────────────
const INIT_EDGES=[
  {id:'e1', from:'N01',to:'N02',lbl:''},
  {id:'e2', from:'N02',to:'N03',lbl:''},
  {id:'e3', from:'N03',to:'D01',lbl:''},
  {id:'e4', from:'D01',to:'N04',lbl:'Yes'},
  {id:'e5', from:'D01',to:'N02',lbl:'No'},
  {id:'e6', from:'N04',to:'D02',lbl:''},
  {id:'e7', from:'D02',to:'N05',lbl:'Yes'},
  {id:'e8', from:'D02',to:'E01',lbl:'No'},
  {id:'e9', from:'E01',to:'D02',lbl:'↩'},
  {id:'e10',from:'N05',to:'D03',lbl:''},
  {id:'e11',from:'D03',to:'N06',lbl:'Yes'},
  {id:'e12',from:'D03',to:'E02',lbl:'No'},
  {id:'e13',from:'E02',to:'D03',lbl:'↩'},
  {id:'e14',from:'N06',to:'D04',lbl:''},
  {id:'e15',from:'D04',to:'N07',lbl:'Yes'},
  {id:'e16',from:'D04',to:'N06b',lbl:'No'},
  {id:'e17',from:'N06b',to:'D04',lbl:'↺'},
  {id:'e18',from:'N07',to:'D05',lbl:''},
  {id:'e19',from:'D05',to:'N08',lbl:'Yes'},
  {id:'e20',from:'D05',to:'N07b',lbl:'No'},
  {id:'e21',from:'N07b',to:'N07',lbl:'↺'},
  {id:'e22',from:'N08',to:'D06',lbl:''},
  {id:'e23',from:'D06',to:'N09',lbl:'Yes'},
  {id:'e24',from:'D06',to:'E03',lbl:'No'},
  {id:'e25',from:'E03',to:'D06',lbl:'↩'},
  {id:'e26',from:'N09',to:'N10',lbl:''},
  {id:'e27',from:'N10',to:'D07',lbl:''},
  {id:'e28',from:'D07',to:'N11',lbl:'No'},
  {id:'e29',from:'D07',to:'N10b',lbl:'Yes'},
  {id:'e30',from:'N10b',to:'N09',lbl:'↺'},
  {id:'e31',from:'N11',to:'N12',lbl:''},
  {id:'e32',from:'N12',to:'N13',lbl:''},
  {id:'e33',from:'N13',to:'N14',lbl:'Gate\nCleared'},
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function OrchestratorFlow(){
  const[nodes,setNodes]=useState(()=>INIT_NODES.map(n=>({...n})));
  const[edges,setEdges]=useState(INIT_EDGES);
  const[statuses,setStatuses]=useState({});
  const[clItems,setClItems]=useState({});
  const[sel,setSel]=useState(null);
  const[tab,setTab]=useState('details');
  const[pan,setPan]=useState({x:80,y:40});
  const[zoom,setZoom]=useState(0.52);
  const[arrange,setArrange]=useState(false);
  const[sessOn,setSessOn]=useState(false);
  const[sessT0,setSessT0]=useState(null);
  const[nodeT0,setNodeT0]=useState({});
  const[sessElapsed,setSessElapsed]=useState(0);
  const[nodeElapsed,setNodeElapsed]=useState({});
  const[notes,setNotes]=useState({});
  const[log,setLog]=useState([]);
  const[bypassLog,setBypassLog]=useState([]);
  const[ctimes,setCtimes]=useState({});
  const[aiMsgs,setAiMsgs]=useState([]);
  const[aiInput,setAiInput]=useState('');
  const[aiLoading,setAiLoading]=useState(false);
  const[aiEdit,setAiEdit]=useState(false);
  const[pendingChg,setPendingChg]=useState(null);
  const[dsModal,setDsModal]=useState(null);
  const[bpModal,setBpModal]=useState(null);
  const[bpReason,setBpReason]=useState('');

  const svgRef=useRef(null);
  const panning=useRef(false);
  const panAnchor=useRef({x:0,y:0,px:0,py:0});
  const dragging=useRef(null);
  const dragAnchor=useRef({x:0,y:0,nx:0,ny:0});
  const aiEnd=useRef(null);

  // Timers
  useEffect(()=>{
    if(!sessOn)return;
    const iv=setInterval(()=>{
      const now=Date.now();
      setSessElapsed(Math.floor((now-sessT0)/1000));
      setNodeElapsed(prev=>{
        const next={...prev};
        Object.entries(nodeT0).forEach(([id,t0])=>{next[id]=Math.floor((now-t0)/1000);});
        return next;
      });
    },1000);
    return()=>clearInterval(iv);
  },[sessOn,sessT0,nodeT0]);

  useEffect(()=>{ aiEnd.current?.scrollIntoView({behavior:'smooth'}); },[aiMsgs]);

  // Load storage
  useEffect(()=>{
    (async()=>{
      try{
        const r=await window.storage.get(SK);
        if(r?.value){
          const d=JSON.parse(r.value);
          if(d.nodes)setNodes(d.nodes);
          if(d.edges)setEdges(d.edges);
          if(d.statuses)setStatuses(d.statuses);
          if(d.clItems)setClItems(d.clItems);
          if(d.notes)setNotes(d.notes);
          if(d.log)setLog(d.log);
          if(d.bypassLog)setBypassLog(d.bypassLog);
          if(d.ctimes)setCtimes(d.ctimes);
        }
      }catch(e){}
    })();
  },[]);

  // Autosave
  useEffect(()=>{
    const t=setTimeout(async()=>{
      try{await window.storage.set(SK,JSON.stringify({nodes,edges,statuses,clItems,notes,log,bypassLog,ctimes}));}catch(e){}
    },900);
    return()=>clearTimeout(t);
  },[nodes,edges,statuses,clItems,notes,log,bypassLog,ctimes]);

  const gs=id=>statuses[id]||'todo';
  const addLog=useCallback(text=>setLog(p=>[...p,{ts:Date.now(),text}]),[]);

  const findDs=id=>{
    const visited=new Set(),q=[id];
    while(q.length){const cur=q.shift();edges.filter(e=>e.from===cur).forEach(e=>{if(!visited.has(e.to)){visited.add(e.to);q.push(e.to);}});}
    visited.delete(id);
    return[...visited].filter(nid=>['active','done'].includes(statuses[nid])).map(nid=>nodes.find(n=>n.id===nid)).filter(Boolean);
  };

  const applyStatus=(id,s)=>{
    setStatuses(p=>({...p,[id]:s}));
    if(s==='active')setNodeT0(p=>({...p,[id]:Date.now()}));
    if(s==='done'){setCtimes(p=>({...p,[id]:Date.now()}));addLog(`✓ ${nodes.find(n=>n.id===id)?.label?.replace('\n',' ')}`);}
    if(s==='blocked')addLog(`⊘ Blocked: ${nodes.find(n=>n.id===id)?.label?.replace('\n',' ')}`);
  };

  const setStatus=(id,s)=>{
    if(s==='done'){
      const node=nodes.find(n=>n.id===id);
      if(node?.type==='checklist'){
        const ci=clItems[id]||{};
        if(!(node.checklistItems?.filter(i=>i.critical)||[]).every(i=>ci[i.id]==='pass'))return;
      }
      const ds=findDs(id);
      if(ds.length){setDsModal({nodeId:id,affected:ds});return;}
    }
    applyStatus(id,s);
  };

  const handleResolved=id=>{
    const node=nodes.find(n=>n.id===id);
    applyStatus(id,'done');
    addLog(`↩ Resolved: ${node?.label?.replace('\n',' ')}`);
    if(node?.originatesFrom){setSel(node.originatesFrom);applyStatus(node.originatesFrom,'active');}
  };

  const confirmBypass=()=>{
    const{nodeId}=bpModal,reason=bpReason.trim()||'No reason given';
    setBypassLog(p=>[...p,{nodeId,reason,ts:Date.now()}]);
    applyStatus(nodeId,'done');
    addLog(`↷ Bypassed: ${nodes.find(n=>n.id===nodeId)?.label?.replace('\n',' ')} — ${reason}`);
    setBpModal(null);setBpReason('');
  };

  const onCvsMD=e=>{
    if(arrange)return;
    if(e.target===svgRef.current||e.target.tagName==='svg'){
      panning.current=true;
      panAnchor.current={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y};
    }
  };
  const onCvsMM=e=>{
    if(arrange&&dragging.current){
      const dx=(e.clientX-dragAnchor.current.x)/zoom,dy=(e.clientY-dragAnchor.current.y)/zoom;
      setNodes(p=>p.map(n=>n.id===dragging.current?{...n,x:dragAnchor.current.nx+dx,y:dragAnchor.current.ny+dy}:n));
    }
    if(panning.current)setPan({x:panAnchor.current.px+(e.clientX-panAnchor.current.x),y:panAnchor.current.py+(e.clientY-panAnchor.current.y)});
  };
  const onCvsMU=()=>{panning.current=false;dragging.current=null;};
  const onWheel=e=>{e.preventDefault();setZoom(z=>Math.max(.18,Math.min(2.5,z*(e.deltaY>0?0.9:1.1))));};

  const onNodeMD=(e,id)=>{
    e.stopPropagation();
    if(arrange){
      const n=nodes.find(n=>n.id===id);
      dragging.current=id;
      dragAnchor.current={x:e.clientX,y:e.clientY,nx:n.x,ny:n.y};
    }else{setSel(id);setTab('details');}
  };

  const isOT=n=>{
    const el=nodeElapsed[n.id]||0;
    return sessOn&&gs(n.id)==='active'&&el>n.exp*120;
  };

  const fmtT=s=>`${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  // AI send
  const sendAI=async()=>{
    if(!aiInput.trim()||aiLoading)return;
    const msg=aiInput.trim();setAiInput('');
    const newMsgs=[...aiMsgs,{role:'user',content:msg}];
    setAiMsgs(newMsgs);setAiLoading(true);
    const sn=nodes.find(n=>n.id===sel);
    const sys=`You are the AI assistant embedded in the Orchestrator AI Release Cycle flowchart. Operator: Kyle Rosebrook (solo system — no teammates).

ENVIRONMENT:
- Base44 app ID: 68dd8e79ca073475565c8e16 | n8n: https://krosebrook.app.n8n.cloud
- 88 entity baseline (post-SOC2 refactor, multi-tenancy, AuditEvent, TokenBudget, WebhookBridge, FeatureFlag all present)
- Canonical WIR workflow IDs: rCVu2glYrnROgipT, xHJO7htByEd07ZGp, vTzMuNpichJO871n, QPf2SqTRVEOKyeQV
- 7 OAI workflows also active
- All 11 workflows CURRENTLY BLOCKED: need Bearer creds + SCH-02 lane field on each WIR entity
- 4 orphan WIR-01 dupes exist in n8n — must delete before activating any WIR workflow
- n8n SDK: arrow functions BLOCKED — use named functions; pattern: workflow() → node({config}) → .to() chaining

CURRENT NODE: ${sn?`${sn.id} — ${sn.label?.replace('\n',' ')} (${sn.phase} phase)`:'None selected'}
SESSION: ${Object.entries(statuses).filter(([,v])=>v!=='todo').map(([k,v])=>`${k}:${v}`).join(', ')||'Not started'}

FAILURE MODES (most likely first):
1. Bearer creds missing/expired → ALL 11 workflows hard-blocked immediately
2. SCH-02 lane field null → WIR workflows fail silently, no error surfaced
3. Stale webhook URL after Base44 redeploy (WebhookBridge not updated)
4. Base44 entity drift (schema mismatch after refactor, missing tenant_id)
5. Token budget exceeded mid-run (workflow auto-pauses)
6. AuditEvent not firing (RLS misconfiguration or missing trigger)
7. Orphan WIR-01 dupe causes double-execution

CREDS:
- Bearer token: n8n Settings → API → OR Base44 CredentialRegistry entity
- All webhook auth headers: WebhookBridge entity in Base44 (one record per workflow)

${aiEdit?`EDIT MODE ACTIVE. Output changes inside [FLOWCHART_CHANGE]{...}[/FLOWCHART_CHANGE]. JSON must include: action (add_node|remove_node|update_node_label|update_node_detail|update_exp|add_edge|remove_edge) and relevant fields. add_node requires removeEdge (the edge being split).`:''}

Tone: exhaust current-step options before suggesting rollback or escalation. Lead with the most likely fix. Be concise — operator is mid-task and needs direct answers.`;

    try{
      const msgs=aiEdit
        ?[...newMsgs.slice(0,-1),{role:'user',content:msg+'\n\nCurrent flowchart:\n'+JSON.stringify({nodes,edges},null,2)}]
        :newMsgs;
      const res=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:800,system:sys,messages:msgs.map(m=>({role:m.role,content:m.content}))}),
      });
      const data=await res.json();
      const text=data.content?.find(c=>c.type==='text')?.text||'No response.';
      setAiMsgs([...newMsgs,{role:'assistant',content:text}]);
      const m=text.match(/\[FLOWCHART_CHANGE\]([\s\S]*?)\[\/FLOWCHART_CHANGE\]/);
      if(m){try{setPendingChg(JSON.parse(m[1]));}catch(e){}}
    }catch(e){
      setAiMsgs(p=>[...p,{role:'assistant',content:'⚠ API error: '+e.message}]);
    }
    setAiLoading(false);
  };

  const applyChg=chg=>{
    const{action:a}=chg;
    if(a==='add_node'){
      setNodes(p=>[...p,{...chg.node}]);
      if(chg.removeEdge)setEdges(p=>p.filter(e=>e.id!==chg.removeEdge));
      if(chg.addEdges)setEdges(p=>[...p,...chg.addEdges]);
    }else if(a==='remove_node'){setNodes(p=>p.filter(n=>n.id!==chg.nodeId));setEdges(p=>p.filter(e=>e.from!==chg.nodeId&&e.to!==chg.nodeId));}
    else if(a==='update_node_label')setNodes(p=>p.map(n=>n.id===chg.nodeId?{...n,label:chg.label}:n));
    else if(a==='update_node_detail')setNodes(p=>p.map(n=>n.id===chg.nodeId?{...n,detail:{...n.detail,...chg.detail}}:n));
    else if(a==='update_exp')setNodes(p=>p.map(n=>n.id===chg.nodeId?{...n,exp:chg.exp}:n));
    else if(a==='add_edge')setEdges(p=>[...p,chg.edge]);
    else if(a==='remove_edge')setEdges(p=>p.filter(e=>e.id!==chg.edgeId));
    addLog(`🔧 AI edit applied: ${a} on ${chg.nodeId||chg.edge?.id||''}`);
    setPendingChg(null);
  };

  const copyTicket=()=>{
    const lines=Object.entries(ctimes).sort((a,b)=>a[1]-b[1]).map(([id,ts])=>{
      const n=nodes.find(n=>n.id===id);
      const bp=bypassLog.find(b=>b.nodeId===id);
      return`[${new Date(ts).toLocaleTimeString()}] ${n?.label?.replace('\n',' ')}${bp?` ↷ ${bp.reason}`:''}`;
    });
    const notesLines=Object.entries(notes).filter(([,v])=>v?.trim()).map(([id,v])=>`[${nodes.find(n=>n.id===id)?.label?.replace('\n',' ')}]\n${v}`);
    const txt=`ORCHESTRATOR AI RELEASE CYCLE — ${new Date().toLocaleDateString()}\nSession: ${fmtT(sessElapsed)}\n\nCOMPLETED STEPS:\n${lines.join('\n')}\n\nSESSION LOG:\n${log.map(l=>`[${new Date(l.ts).toLocaleTimeString()}] ${l.text}`).join('\n')}${notesLines.length?'\n\nNODES WITH NOTES:\n'+notesLines.join('\n\n'):''}`;
    navigator.clipboard?.writeText(txt);
    addLog('📋 Ticket copied to clipboard');
  };

  const total=nodes.length,done=nodes.filter(n=>gs(n.id)==='done').length,pct=Math.round(done/total*100);
  const selNode=nodes.find(n=>n.id===sel),selSt=sel?gs(sel):'todo';

  // ── SVG node render ─────────────────────────────────────────────────────────
  const rNode=n=>{
    const{id,type,label,x,y}=n;
    const w=nw(type),h=nh(type),st=gs(id),c=SC[st]||SC.todo;
    const isSel=sel===id,ot=isOT(n);
    const bp=bypassLog.find(b=>b.nodeId===id);
    const cx=x+w/2,cy=y+h/2;
    const lines=label.split('\n');
    const fill=type==='escalation'?'#1c0900':c.f;
    const stroke=isSel?'#ffffff':type==='escalation'?ESC_C:c.b;
    const sw=isSel?2.5:1.5;
    const tf=type==='escalation'?'#fdba74':c.t;

    let shape;
    if(type==='terminal'){
      shape=<rect x={x} y={y} width={w} height={h} rx={23} fill={fill} stroke={stroke} strokeWidth={sw} style={{cursor:'pointer'}} onMouseDown={e=>onNodeMD(e,id)}/>;
    }else if(type==='decision'){
      const pts=`${cx},${y} ${x+w},${cy} ${cx},${y+h} ${x},${cy}`;
      shape=<polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} style={{cursor:'pointer'}} onMouseDown={e=>onNodeMD(e,id)}/>;
    }else{
      shape=<rect x={x} y={y} width={w} height={h} rx={5} fill={fill} stroke={stroke} strokeWidth={sw} style={{cursor:'pointer'}} onMouseDown={e=>onNodeMD(e,id)}/>;
    }

    const stripe=(type==='process'||type==='checklist')&&n.phase?(
      <rect x={x} y={y} width={w} height={4} rx={3} fill={PC[n.phase]||'#555'} opacity={.55} style={{pointerEvents:'none'}}/>
    ):null;

    const clProg=type==='checklist'&&n.checklistItems?(()=>{
      const ci=clItems[id]||{};
      const crit=n.checklistItems.filter(i=>i.critical).length;
      const critP=n.checklistItems.filter(i=>i.critical&&ci[i.id]==='pass').length;
      const total2=n.checklistItems.length;
      const passed=n.checklistItems.filter(i=>ci[i.id]==='pass').length;
      return{crit,critP,total2,passed};
    })():null;

    const dotC={todo:'#3f3f46',active:'#7c3aed',done:'#16a34a',blocked:'#dc2626'}[st];

    return(
      <g key={id}>
        {ot&&<rect x={x-5} y={y-5} width={w+10} height={h+10} rx={type==='terminal'?28:8} fill="none" stroke="#fbbf24" strokeWidth={2} strokeDasharray="7 3" style={{pointerEvents:'none'}}/>}
        {shape}
        {stripe}
        {lines.map((ln,i)=>(
          <text key={i} x={cx} y={cy+(i-(lines.length-1)/2)*13} fill={tf} fontSize={11} textAnchor="middle" dominantBaseline="middle" style={{pointerEvents:'none',userSelect:'none',fontFamily:'system-ui'}}>
            {ln}
          </text>
        ))}
        <circle cx={x+8} cy={y+8} r={3.5} fill={dotC} style={{pointerEvents:'none'}}/>
        {bp&&<text x={x+w-8} y={y+12} fill="#a78bfa" fontSize={11} textAnchor="middle" style={{pointerEvents:'none'}}>↷</text>}
        {clProg&&<text x={cx} y={y+h-6} fill={clProg.critP===clProg.crit?'#86efac':'#71717a'} fontSize={9} textAnchor="middle" style={{pointerEvents:'none',userSelect:'none'}}>{clProg.critP}/{clProg.crit} ★  {clProg.passed}/{clProg.total2}</text>}
      </g>
    );
  };

  // ── SVG edge render ─────────────────────────────────────────────────────────
  const rEdge=e=>{
    const fn=nodes.find(n=>n.id===e.from),tn=nodes.find(n=>n.id===e.to);
    if(!fn||!tn)return null;
    const d=buildPath(fn,tn);
    const{sx,sy,ex,ey}=getEP(fn,tn);
    const mx=(sx+ex)/2,my=(sy+ey)/2;
    const isRet=e.lbl==='↩'||e.lbl==='↺';
    const lblLines=e.lbl?e.lbl.split('\n'):[];
    const lox=isRet?18:0,loy=-5;
    return(
      <g key={e.id}>
        <path d={d} stroke={isRet?'#3d2d6a':'#3f3f46'} strokeWidth={isRet?1.2:1.5} fill="none" markerEnd={`url(#arr${isRet?'r':'f'})`} strokeDasharray={isRet?'4 2':undefined}/>
        {lblLines.map((ln,i)=>(
          <text key={i} x={mx+lox} y={my+loy+i*11} fill={isRet?'#4a3a6a':'#52525b'} fontSize={9} textAnchor="middle" style={{userSelect:'none'}}>{ln}</text>
        ))}
      </g>
    );
  };

  // ── Details tab ─────────────────────────────────────────────────────────────
  const rDetails=()=>{
    if(!selNode)return (<div style={{color:MU,padding:'24px 16px',textAlign:'center',fontSize:'12px',lineHeight:1.7}}>← Click any node on the canvas to view its details, checklist, and org-specific info.</div>);
    const st=selSt,c=SC[st]||SC.todo;
    const isEsc=selNode.type==='escalation',isCl=selNode.type==='checklist';
    const ci=clItems[sel]||{};
    const bp=bypassLog.find(b=>b.nodeId===sel);
    let gateOk=true;
    if(isCl&&selNode.checklistItems){
      gateOk=(selNode.checklistItems.filter(i=>i.critical)||[]).every(i=>ci[i.id]==='pass');
    }
    return(
      <div style={{padding:'12px',overflowY:'auto',height:'100%',boxSizing:'border-box'}}>
        {/* Status row */}
        <div style={{display:'flex',gap:'5px',flexWrap:'wrap',marginBottom:'10px'}}>
          {['todo','active','done','blocked'].map(s=>{
            const dis=s==='done'&&isCl&&!gateOk;
            return (<button key={s} onClick={()=>!dis&&setStatus(sel,s)}
              style={{padding:'4px 9px',borderRadius:'5px',fontSize:'11px',cursor:dis?'not-allowed':'pointer',
                border:`1px solid ${SC[s].b}`,background:st===s?SC[s].f:'transparent',
                color:st===s?SC[s].t:MU,opacity:dis?0.3:1}}>
              {s.charAt(0).toUpperCase()+s.slice(1)}
            </button>);
          })}
          {selNode.bypassable&&!bp&&<button onClick={()=>setBpModal({nodeId:sel})}
            style={{padding:'4px 9px',borderRadius:'5px',fontSize:'11px',cursor:'pointer',border:`1px solid ${PRIMARY}`,background:'transparent',color:'#a78bfa'}}>Skip ↷</button>}
          {isEsc&&<button onClick={()=>handleResolved(sel)}
            style={{padding:'4px 9px',borderRadius:'5px',fontSize:'11px',cursor:'pointer',border:'1px solid #16a34a',background:'#052e16',color:'#86efac'}}>↩ Resolved</button>}
        </div>
        {/* Alerts */}
        {bp&&<div style={{padding:'7px 10px',background:'#160d30',borderRadius:'5px',marginBottom:'8px',fontSize:'11px',color:'#a78bfa'}}>↷ Bypassed: {bp.reason}</div>}
        {sessOn&&st==='active'&&isOT(selNode)&&<div style={{padding:'7px 10px',background:'#1a1000',border:'1px solid #fbbf24',borderRadius:'5px',marginBottom:'8px',fontSize:'11px',color:'#fbbf24'}}>⚠ Overtime: {fmtT(nodeElapsed[sel]||0)} / expected {selNode.exp} min</div>}
        {sessOn&&st==='active'&&!isOT(selNode)&&<div style={{color:MU,fontSize:'11px',marginBottom:'8px'}}>⏱ Active: {fmtT(nodeElapsed[sel]||0)} / {selNode.exp} min est</div>}
        {/* Checklist */}
        {isCl&&selNode.checklistItems&&(
          <div style={{marginBottom:'12px'}}>
            <div style={{fontSize:'10px',fontWeight:700,color:MU,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:'6px'}}>Checklist</div>
            {selNode.checklistItems.map(item=>{
              const iv=ci[item.id]||null;
              return (<div key={item.id} style={{display:'flex',alignItems:'center',gap:'7px',padding:'5px 8px',background:CBG,borderRadius:'5px',marginBottom:'3px'}}>
                <span style={{fontSize:'12px',color:item.critical?'#fbbf24':MU,width:'12px',flexShrink:0,textAlign:'center'}}>{item.critical?'★':'○'}</span>
                <span style={{flex:1,fontSize:'11px',color:TX,lineHeight:1.35}}>{item.label}</span>
                <div style={{display:'flex',gap:'3px',flexShrink:0}}>
                  {['pass','fail','skip'].map(s=>(
                    <button key={s} onClick={()=>setClItems(p=>({...p,[sel]:{...(p[sel]||{}),[item.id]:iv===s?null:s}}))}
                      style={{width:'22px',height:'22px',borderRadius:'4px',fontSize:'11px',cursor:'pointer',border:'none',
                        background:iv===s?(s==='pass'?'#15803d':s==='fail'?'#dc2626':'#52525b'):'#27272a',
                        color:iv===s?'#fff':MU,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      {s==='pass'?'✓':s==='fail'?'✗':'—'}
                    </button>
                  ))}
                </div>
              </div>);
            })}
            <div style={{padding:'7px',background:gateOk?'#052e16':'#1a0505',border:`1px solid ${gateOk?'#16a34a':'#dc2626'}`,borderRadius:'5px',color:gateOk?'#86efac':'#fca5a5',fontSize:'11px',textAlign:'center',marginTop:'6px'}}>
              {gateOk?'✓ Gate cleared — Mark Done available':`${selNode.checklistItems.filter(i=>i.critical&&ci[i.id]!=='pass').length} ★ items remaining`}
            </div>
          </div>
        )}
        {/* W/U/C/I detail sections */}
        {selNode.detail&&[
          {k:'w',lbl:'Walk-up',col:TX},
          {k:'u',lbl:'During',col:TX},
          {k:'c',lbl:'Completion Criteria',col:'#86efac'},
          {k:'i',lbl:'Org Info',col:'#a78bfa'},
        ].map(({k,lbl,col})=>{
          const items=selNode.detail[k];
          if(!items?.length)return null;
          return (<div key={k} style={{marginBottom:'10px'}}>
            <div style={{fontSize:'10px',fontWeight:700,color:col,textTransform:'uppercase',letterSpacing:'.08em',opacity:.8,marginBottom:'5px'}}>{lbl}</div>
            {items.map((it,i)=><div key={i} style={{padding:'5px 8px',background:CBG,borderRadius:'4px',fontSize:'11px',color:TX,marginBottom:'3px',lineHeight:1.45}}>{it}</div>)}
          </div>);
        })}
      </div>
    );
  };

  // ── AI tab ──────────────────────────────────────────────────────────────────
  const rAI=()=>(
    <div style={{display:'flex',flexDirection:'column',height:'100%',padding:'10px',gap:'8px',boxSizing:'border-box'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <span style={{fontSize:'10px',color:MU}}>Claude Sonnet 4 · Orch context injected</span>
        <label style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'10px',color:MU,cursor:'pointer'}}>
          <input type="checkbox" checked={aiEdit} onChange={e=>setAiEdit(e.target.checked)} style={{accentColor:PRIMARY}}/>
          Edit mode
        </label>
      </div>
      <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:'7px'}}>
        {aiMsgs.length===0&&<div style={{color:MU,fontSize:'11px',textAlign:'center',marginTop:'20px',lineHeight:1.6}}>
          {selNode?`Ask about "${selNode.label?.replace('\n',' ')}" or anything in the Orch stack.`:'Select a node then ask for help.'}
        </div>}
        {aiMsgs.map((m,i)=>(
          <div key={i} style={{padding:'8px 10px',borderRadius:'8px',fontSize:'11px',lineHeight:1.55,whiteSpace:'pre-wrap',
            background:m.role==='user'?'#180f35':CBG,color:m.role==='user'?'#c4b5fd':TX,
            alignSelf:m.role==='user'?'flex-end':'flex-start',maxWidth:'92%',wordBreak:'break-word'}}>
            {m.content}
          </div>
        ))}
        {aiLoading&&<div style={{color:MU,fontSize:'11px',padding:'4px 0'}}>thinking…</div>}
        {pendingChg&&(
          <div style={{padding:'10px',background:'#180f35',border:`1px solid ${PRIMARY}`,borderRadius:'8px',flexShrink:0}}>
            <div style={{fontSize:'11px',color:'#c4b5fd',marginBottom:'6px',fontWeight:700}}>Proposed: {pendingChg.action}</div>
            <pre style={{fontSize:'9px',color:MU,background:BG,padding:'6px',borderRadius:'4px',overflow:'auto',maxHeight:'80px',margin:'0 0 8px 0'}}>{JSON.stringify(pendingChg,null,2)}</pre>
            <div style={{display:'flex',gap:'6px'}}>
              <button onClick={()=>applyChg(pendingChg)} style={{flex:1,padding:'5px',borderRadius:'4px',background:'#16a34a',border:'none',color:'#fff',fontSize:'11px',cursor:'pointer',fontWeight:600}}>Apply</button>
              <button onClick={()=>setPendingChg(null)} style={{flex:1,padding:'5px',borderRadius:'4px',background:BD,border:'none',color:TX,fontSize:'11px',cursor:'pointer'}}>Dismiss</button>
            </div>
          </div>
        )}
        <div ref={aiEnd}/>
      </div>
      <div style={{display:'flex',gap:'6px',flexShrink:0}}>
        <input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendAI()}
          placeholder={aiEdit?'Describe a change…':'Ask about this step…'}
          style={{flex:1,padding:'8px',borderRadius:'6px',border:`1px solid ${BD}`,background:CBG,color:TX,fontSize:'12px',outline:'none',fontFamily:'system-ui'}}/>
        <button onClick={sendAI} disabled={aiLoading||!aiInput.trim()}
          style={{padding:'8px 12px',borderRadius:'6px',background:PRIMARY,border:'none',color:'#fff',fontSize:'13px',cursor:'pointer',opacity:(aiLoading||!aiInput.trim())?0.5:1}}>→</button>
      </div>
    </div>
  );

  // ── Notes tab ───────────────────────────────────────────────────────────────
  const rNotes=()=>(
    <div style={{display:'flex',flexDirection:'column',height:'100%',padding:'12px',gap:'8px',boxSizing:'border-box'}}>
      {selNode&&<>
        <div style={{fontSize:'10px',fontWeight:700,color:MU,textTransform:'uppercase',letterSpacing:'.08em'}}>Notes: {selNode.label?.replace('\n',' ')}</div>
        <textarea value={notes[sel]||''} onChange={e=>setNotes(p=>({...p,[sel]:e.target.value}))}
          placeholder="Add step-specific notes…"
          style={{padding:'8px',borderRadius:'6px',border:`1px solid ${BD}`,background:CBG,color:TX,fontSize:'11px',resize:'none',height:'72px',outline:'none',fontFamily:'system-ui',flexShrink:0}}/>
      </>}
      <div style={{fontSize:'10px',fontWeight:700,color:MU,textTransform:'uppercase',letterSpacing:'.08em',marginTop:'4px'}}>Session Log</div>
      <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:'3px'}}>
        {log.length===0&&<div style={{color:MU,fontSize:'11px',textAlign:'center',marginTop:'12px'}}>No log entries yet — start the session</div>}
        {[...log].reverse().map((entry,i)=>(
          <div key={i} style={{padding:'5px 8px',background:CBG,borderRadius:'4px',fontSize:'11px',color:TX,lineHeight:1.4}}>
            <span style={{color:'#52525b',marginRight:'6px',fontFamily:'monospace',fontSize:'10px'}}>{new Date(entry.ts).toLocaleTimeString()}</span>
            {entry.text}
          </div>
        ))}
      </div>
    </div>
  );

  // ── Progress tab ─────────────────────────────────────────────────────────────
  const rProgress=()=>(
    <div style={{padding:'12px',overflowY:'auto',height:'100%',boxSizing:'border-box'}}>
      <div style={{marginBottom:'14px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
          <span style={{fontSize:'12px',color:TX,fontWeight:600}}>Overall Progress</span>
          <span style={{fontSize:'12px',color:MU}}>{done}/{total} ({pct}%)</span>
        </div>
        <div style={{height:'6px',background:BD,borderRadius:'3px',overflow:'hidden'}}>
          <div style={{height:'100%',width:`${pct}%`,background:PRIMARY,borderRadius:'3px',transition:'width 0.4s'}}/>
        </div>
      </div>
      {['Design','Build','Test','Deploy','Monitor'].map(phase=>{
        const pn=nodes.filter(n=>n.phase===phase);
        const pd=pn.filter(n=>gs(n.id)==='done').length;
        const pp=pn.length?Math.round(pd/pn.length*100):0;
        return (<div key={phase} style={{marginBottom:'10px'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
            <span style={{fontSize:'11px',color:PC[phase]||TX,fontWeight:600}}>{phase}</span>
            <span style={{fontSize:'11px',color:MU}}>{pd}/{pn.length}</span>
          </div>
          <div style={{height:'3px',background:BD,borderRadius:'2px',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${pp}%`,background:PC[phase]||PRIMARY,borderRadius:'2px',transition:'width 0.4s'}}/>
          </div>
        </div>);
      })}
      <div style={{marginTop:'14px'}}>
        <div style={{fontSize:'10px',fontWeight:700,color:MU,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:'8px'}}>All Nodes</div>
        {nodes.map(node=>{
          const s=gs(node.id),c=SC[s]||SC.todo;
          const el=nodeElapsed[node.id]||0;
          const bp=bypassLog.find(b=>b.nodeId===node.id);
          return (<div key={node.id} onClick={()=>{setSel(node.id);setTab('details');}}
            style={{display:'flex',alignItems:'center',gap:'8px',padding:'6px 8px',background:sel===node.id?'#180f35':CBG,borderRadius:'6px',marginBottom:'3px',cursor:'pointer',border:`1px solid ${sel===node.id?PRIMARY:'transparent'}`}}>
            <div style={{width:'7px',height:'7px',borderRadius:'50%',background:c.b,flexShrink:0}}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'11px',color:TX,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                {node.label?.replace('\n',' ')}{bp?' ↷':''}
              </div>
              <div style={{fontSize:'9px',color:MU}}>{node.phase} · {node.id} · {node.exp}m</div>
            </div>
            {s==='active'&&el>0&&<div style={{fontSize:'10px',color:isOT(node)?'#fbbf24':MU,flexShrink:0,fontFamily:'monospace'}}>{fmtT(el)}</div>}
            {s==='done'&&<div style={{fontSize:'10px',color:'#16a34a',flexShrink:0}}>✓</div>}
          </div>);
        })}
      </div>
    </div>
  );

  // ── Phase band definitions ───────────────────────────────────────────────────
  const phaseBands=[
    {phase:'Design',y:10,h:340},
    {phase:'Build', y:360,h:485},
    {phase:'Test',  y:855,h:400},
    {phase:'Deploy',y:1265,h:405},
    {phase:'Monitor',y:1680,h:395},
  ];

  // ── Render ──────────────────────────────────────────────────────────────────
  return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:BG,color:TX,fontFamily:'system-ui,-apple-system,sans-serif',overflow:'hidden',userSelect:'none'}}>
      {/* Top bar */}
      <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'7px 14px',background:PBG,borderBottom:`1px solid ${BD}`,flexShrink:0,flexWrap:'wrap'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px',flex:1,minWidth:0}}>
          <div style={{width:'7px',height:'7px',borderRadius:'50%',background:PRIMARY,flexShrink:0}}/>
          <span style={{fontSize:'13px',fontWeight:700,color:TX,letterSpacing:'-.01em',whiteSpace:'nowrap'}}>Orchestrator AI</span>
          <span style={{fontSize:'11px',color:MU,whiteSpace:'nowrap'}}>Release Cycle</span>
          {sessOn&&<span style={{fontSize:'12px',color:'#a78bfa',fontFamily:'monospace',fontVariantNumeric:'tabular-nums',marginLeft:'6px'}}>⏱ {fmtT(sessElapsed)}</span>}
        </div>
        <div style={{display:'flex',gap:'5px',alignItems:'center',flexWrap:'wrap'}}>
          {!sessOn
            ?<button onClick={()=>{setSessOn(true);setSessT0(Date.now());addLog('🚀 Session started');}}
               style={{padding:'5px 12px',borderRadius:'6px',background:PRIMARY,border:'none',color:'#fff',fontSize:'12px',cursor:'pointer',fontWeight:600}}>Start Session</button>
            :<button onClick={()=>{setSessOn(false);addLog('⏹ Session paused');}}
               style={{padding:'5px 10px',borderRadius:'6px',background:BD,border:'none',color:TX,fontSize:'12px',cursor:'pointer'}}>Pause</button>}
          <button onClick={()=>setArrange(a=>!a)}
            style={{padding:'5px 10px',borderRadius:'6px',background:arrange?'#180f35':BD,border:`1px solid ${arrange?PRIMARY:'transparent'}`,color:arrange?'#a78bfa':TX,fontSize:'12px',cursor:'pointer'}}>
            {arrange?'✓ Arrange':'Arrange'}
          </button>
          <button onClick={copyTicket} style={{padding:'5px 10px',borderRadius:'6px',background:BD,border:'none',color:TX,fontSize:'12px',cursor:'pointer'}}>Copy Ticket</button>
          <button onClick={()=>{if(confirm('Reset all session progress? Node positions and flowchart structure are preserved.')){setStatuses({});setClItems({});setCtimes({});setLog([]);setBypassLog([]);setNotes({});setNodeT0({});setSessOn(false);setSessElapsed(0);setNodeElapsed({});}}}
            style={{padding:'5px 10px',borderRadius:'6px',background:BD,border:'none',color:'#dc2626',fontSize:'12px',cursor:'pointer'}}>Reset</button>
        </div>
        {/* Progress bar */}
        <div style={{display:'flex',alignItems:'center',gap:'6px',flexShrink:0}}>
          <div style={{width:'55px',height:'5px',background:BD,borderRadius:'3px',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${pct}%`,background:PRIMARY,borderRadius:'3px',transition:'width .4s'}}/>
          </div>
          <span style={{fontSize:'11px',color:MU,minWidth:'28px'}}>{pct}%</span>
        </div>
      </div>

      {/* Main */}
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* Canvas */}
        <div style={{flex:1,overflow:'hidden',position:'relative',cursor:arrange?'default':(panning.current?'grabbing':'grab')}}
          onMouseDown={onCvsMD} onMouseMove={onCvsMM} onMouseUp={onCvsMU} onMouseLeave={onCvsMU} onWheel={onWheel}>
          <svg ref={svgRef} width="100%" height="100%" style={{display:'block'}}>
            <defs>
              <marker id="arrf" markerWidth="7" markerHeight="6" refX="6.5" refY="3" orient="auto">
                <polygon points="0 0, 7 3, 0 6" fill="#3f3f46"/>
              </marker>
              <marker id="arrr" markerWidth="7" markerHeight="6" refX="6.5" refY="3" orient="auto">
                <polygon points="0 0, 7 3, 0 6" fill="#3d2d6a"/>
              </marker>
            </defs>
            <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
              {/* Phase bands */}
              {phaseBands.map(({phase,y,h})=>(
                <g key={phase}>
                  <rect x={0} y={y} width={720} height={h} fill={PC[phase]||'#333'} opacity={.04} rx={4}/>
                  <text x={8} y={y+15} fill={PC[phase]||MU} fontSize={10} fontWeight={700} opacity={.5} style={{userSelect:'none'}}>{phase.toUpperCase()}</text>
                </g>
              ))}
              {/* Edges */}
              {edges.map(rEdge)}
              {/* Nodes */}
              {nodes.map(rNode)}
            </g>
          </svg>
          {/* Zoom controls */}
          <div style={{position:'absolute',bottom:'12px',right:'12px',display:'flex',flexDirection:'column',gap:'4px'}}>
            {[['+',1.2],['-',.8],['⌂',null]].map(([lbl,f])=>(
              <button key={lbl} onClick={()=>f?setZoom(z=>Math.max(.18,Math.min(2.5,z*f))):(setZoom(.52),setPan({x:80,y:40}))}
                style={{width:'28px',height:'28px',borderRadius:'6px',background:CBG,border:`1px solid ${BD}`,color:TX,fontSize:'13px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                {lbl}
              </button>
            ))}
          </div>
          {/* Legend */}
          <div style={{position:'absolute',bottom:'12px',left:'12px',background:PBG,border:`1px solid ${BD}`,borderRadius:'8px',padding:'8px 10px',display:'flex',flexDirection:'column',gap:'5px'}}>
            {[
              {c:'#3f3f46',lbl:'Todo'},
              {c:'#7c3aed',lbl:'Active'},
              {c:'#16a34a',lbl:'Done'},
              {c:'#dc2626',lbl:'Blocked'},
              {c:ESC_C,lbl:'Escalation'},
              {c:'#fbbf24',lbl:'Overtime',dash:true},
            ].map(({c,lbl,dash})=>(
              <div key={lbl} style={{display:'flex',alignItems:'center',gap:'6px'}}>
                <div style={{width:'14px',height:'3px',background:c,borderRadius:'2px',flexShrink:0,border:dash?`1px dashed ${c}`:'none'}}/>
                <span style={{fontSize:'9px',color:MU}}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{width:'360px',display:'flex',flexDirection:'column',background:PBG,borderLeft:`1px solid ${BD}`,flexShrink:0}}>
          {/* Node header */}
          <div style={{padding:'10px 12px',borderBottom:`1px solid ${BD}`,flexShrink:0,minHeight:'52px'}}>
            {selNode?(
              <div>
                <div style={{display:'flex',alignItems:'center',gap:'7px',flexWrap:'wrap'}}>
                  <div style={{width:'7px',height:'7px',borderRadius:'50%',background:SC[selSt]?.b||'#3f3f46',flexShrink:0}}/>
                  <span style={{fontSize:'13px',fontWeight:600,color:TX,lineHeight:1.2}}>{selNode.label?.replace('\n',' ')}</span>
                  {selNode.type==='escalation'&&<span style={{fontSize:'9px',padding:'2px 5px',borderRadius:'3px',background:'#1c0900',color:'#fb923c',border:'1px solid #ea580c'}}>ESC</span>}
                  {selNode.type==='checklist'&&<span style={{fontSize:'9px',padding:'2px 5px',borderRadius:'3px',background:'#0c1a0f',color:'#86efac',border:'1px solid #16a34a'}}>GATE</span>}
                  {selNode.bypassable&&<span style={{fontSize:'9px',padding:'2px 5px',borderRadius:'3px',background:'#160d30',color:'#a78bfa',border:`1px solid ${PRIMARY}`}}>BYPASSABLE</span>}
                </div>
                <div style={{fontSize:'10px',color:MU,marginTop:'3px'}}>{selNode.id} · {selNode.phase} · {selNode.exp} min est</div>
              </div>
            ):(
              <div style={{fontSize:'12px',color:MU,paddingTop:'4px'}}>No node selected</div>
            )}
          </div>
          {/* Tabs */}
          <div style={{display:'flex',borderBottom:`1px solid ${BD}`,flexShrink:0}}>
            {['details','ai','notes','progress'].map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                style={{flex:1,padding:'8px 4px',background:'none',border:'none',cursor:'pointer',fontSize:'11px',
                  color:tab===t?'#c4b5fd':MU,borderBottom:tab===t?`2px solid ${PRIMARY}`:'2px solid transparent',
                  fontWeight:tab===t?600:400,transition:'color .15s'}}>
                {t==='ai'?'AI Help':t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
          {/* Tab content */}
          <div style={{flex:1,overflow:'hidden'}}>
            {tab==='details'&&rDetails()}
            {tab==='ai'&&rAI()}
            {tab==='notes'&&rNotes()}
            {tab==='progress'&&rProgress()}
          </div>
        </div>
      </div>

      {/* Downstream modal */}
      {dsModal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}>
          <div style={{background:CBG,border:`1px solid ${BD}`,borderRadius:'12px',padding:'20px',width:'340px',maxWidth:'92vw'}}>
            <div style={{fontSize:'14px',fontWeight:700,color:'#fbbf24',marginBottom:'10px'}}>⚠ Downstream Alert</div>
            <div style={{fontSize:'12px',color:MU,marginBottom:'12px'}}>
              Marking <strong style={{color:TX}}>{nodes.find(n=>n.id===dsModal.nodeId)?.label?.replace('\n',' ')}</strong> done affects {dsModal.affected.length} active/done node{dsModal.affected.length>1?'s':''}:
            </div>
            {dsModal.affected.map(n=>(
              <div key={n.id} style={{padding:'5px 9px',background:PBG,borderRadius:'5px',marginBottom:'4px',fontSize:'11px',color:'#fca5a5'}}>
                {n.label?.replace('\n',' ')} ({gs(n.id)})
              </div>
            ))}
            <div style={{display:'flex',gap:'8px',marginTop:'14px'}}>
              <button onClick={()=>{applyStatus(dsModal.nodeId,'done');setDsModal(null);}}
                style={{flex:1,padding:'8px',borderRadius:'6px',background:'#dc2626',border:'none',color:'#fff',fontSize:'12px',cursor:'pointer',fontWeight:600}}>Proceed Anyway</button>
              <button onClick={()=>setDsModal(null)}
                style={{flex:1,padding:'8px',borderRadius:'6px',background:BD,border:'none',color:TX,fontSize:'12px',cursor:'pointer'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Bypass modal */}
      {bpModal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}>
          <div style={{background:CBG,border:`1px solid ${BD}`,borderRadius:'12px',padding:'20px',width:'340px',maxWidth:'92vw'}}>
            <div style={{fontSize:'14px',fontWeight:700,color:'#a78bfa',marginBottom:'6px'}}>Skip ↷</div>
            <div style={{fontSize:'12px',color:MU,marginBottom:'12px'}}>
              Bypassing: <strong style={{color:TX}}>{nodes.find(n=>n.id===bpModal.nodeId)?.label?.replace('\n',' ')}</strong>
            </div>
            <input value={bpReason} onChange={e=>setBpReason(e.target.value)} placeholder="Reason for skipping…"
              style={{width:'100%',padding:'8px',borderRadius:'6px',border:`1px solid ${BD}`,background:PBG,color:TX,fontSize:'12px',outline:'none',boxSizing:'border-box',marginBottom:'12px',fontFamily:'system-ui'}}/>
            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={confirmBypass}
                style={{flex:1,padding:'8px',borderRadius:'6px',background:PRIMARY,border:'none',color:'#fff',fontSize:'12px',cursor:'pointer',fontWeight:600}}>Confirm Skip</button>
              <button onClick={()=>setBpModal(null)}
                style={{flex:1,padding:'8px',borderRadius:'6px',background:BD,border:'none',color:TX,fontSize:'12px',cursor:'pointer'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
