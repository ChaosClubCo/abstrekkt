
// Claude Kanban Board v2 — All 5 enhancements
import { useState, useEffect, useRef } from "react";

const SK = "claude_kanban_v2";
const PC = {1:"#3fb950",2:"#d29922",3:"#f0883e",4:"#da3633",5:"#8b5cf6"};
const PL = {1:"Low",2:"Med",3:"High",4:"Crit",5:"Urgent"};
const LC = {bug:"#da3633",feature:"#388bfd","tech-debt":"#d29922",migration:"#f0883e",urgent:"#8b5cf6",security:"#ec4899",automation:"#14b8a6",client:"#10b981",internal:"#6366f1",research:"#84cc16"};

const LANES = [
  {id:"backlog",title:"Backlog",wipLimit:0,color:"#484f58"},
  {id:"todo",title:"To Do",wipLimit:5,color:"#388bfd"},
  {id:"inprogress",title:"In Progress",wipLimit:3,color:"#d29922"},
  {id:"review",title:"Review",wipLimit:3,color:"#f0883e"},
  {id:"blocked",title:"Blocked",wipLimit:0,color:"#da3633"},
  {id:"done",title:"Done",wipLimit:0,color:"#3fb950"},
];

const TEMPLATES = [
  {id:"bug",name:"Bug Report",icon:"🐛",defaults:{priority:4,labels:["bug"],estimate:"2h",description:"**Steps to reproduce:**\n1. \n\n**Expected:**\n**Actual:**"}},
  {id:"feature",name:"Feature",icon:"✨",defaults:{priority:2,labels:["feature"],estimate:"1d",description:"**User Story:**\nAs a [user], I want [feature] so that [benefit].\n\n**Acceptance Criteria:**\n- [ ] "}},
  {id:"techdebt",name:"Tech Debt",icon:"⚙️",defaults:{priority:2,labels:["tech-debt"],estimate:"4h",description:"**Problem:**\n**Solution:**\n**Impact if ignored:**"}},
  {id:"migration",name:"Migration",icon:"🚀",defaults:{priority:3,labels:["migration"],estimate:"2d",description:"**From:**\n**To:**\n**Steps:**\n1. Backup\n2. \n3. Validate\n\n**Rollback:**"}},
  {id:"security",name:"Security",icon:"🔒",defaults:{priority:4,labels:["security"],estimate:"1d",description:"**Scope:**\n- [ ] Input validation\n- [ ] Auth checks\n- [ ] RLS policies\n- [ ] Secrets scan"}},
  {id:"research",name:"Research",icon:"🔬",defaults:{priority:2,labels:["research"],estimate:"4h",description:"**Question:**\n**Timebox:**\n**Output:** Decision doc / PoC"}},
  {id:"release",name:"Release",icon:"📦",defaults:{priority:3,labels:["internal"],estimate:"2h",description:"- [ ] Tests passing\n- [ ] Changelog updated\n- [ ] Staging validated"}},
  {id:"blank",name:"Blank",icon:"📝",defaults:{priority:2,labels:[],estimate:"",description:""}},
];

const DEF_MEMBERS = [
  {id:"kyle",name:"Kyle",team:"Platform",avatar:"K"},
  {id:"team",name:"Team",team:"Eng",avatar:"T"},
];

const DEF_CARDS = [
  {id:"c1",laneId:"inprogress",title:"Migrate Base44 Fusion AI → Vercel",description:"Move enterprise AI platform from Base44 to production Vercel",priority:4,labels:["migration","urgent"],dueDate:"2026-03-28",estimate:"3d",assignee:"kyle",subtasks:[{id:"s1",text:"Export schema",done:true},{id:"s2",text:"Set up Vercel project",done:false},{id:"s3",text:"Configure env vars",done:false}],healthScore:62,repo:"ChaosClubCo/fusion-ai",timeLog:[{date:"2026-03-20",duration:90,note:"Initial setup & discovery"}],sprintId:"sp1",storyPoints:8,createdAt:"2026-03-15"},
  {id:"c2",laneId:"inprogress",title:"RLS Audit — Supabase",description:"Proactive row-level security audit across all multi-tenant tables",priority:5,labels:["security"],dueDate:"2026-03-26",estimate:"1d",assignee:"kyle",subtasks:[{id:"s4",text:"Identify all policies",done:true},{id:"s5",text:"Test tenant isolation",done:true},{id:"s6",text:"Document findings",done:false}],healthScore:88,repo:"intinc/supabase",timeLog:[],sprintId:"sp1",storyPoints:5,createdAt:"2026-03-18"},
  {id:"c3",laneId:"review",title:"Daily Dispatch — Chaos Club",description:"Morning mental health check-in feature",priority:3,labels:["feature"],dueDate:"2026-03-29",estimate:"2d",assignee:"kyle",subtasks:[],healthScore:75,repo:"ChaosClubCo/app",timeLog:[],sprintId:"sp1",storyPoints:3,createdAt:"2026-03-17"},
  {id:"c4",laneId:"blocked",title:"Fix 90 Dependabot PRs",description:"Resolve dependency vulnerabilities flagged by Dependabot",priority:3,labels:["tech-debt"],dueDate:null,estimate:"4h",assignee:null,subtasks:[],healthScore:45,repo:"Krosebrook/continuum",timeLog:[],sprintId:"sp1",storyPoints:2,createdAt:"2026-03-19"},
  {id:"c5",laneId:"todo",title:"Firebase MVP — Chaos Club",description:"Build the Firebase MVP for peer support platform",priority:4,labels:["feature"],dueDate:null,estimate:"5d",assignee:"kyle",subtasks:[{id:"s7",text:"Auth setup",done:false},{id:"s8",text:"Firestore schema",done:false}],healthScore:80,repo:"ChaosClubCo/app",timeLog:[],sprintId:"sp1",storyPoints:13,createdAt:"2026-03-10"},
  {id:"c6",laneId:"backlog",title:"Kinsley's World PWA",description:"Voice-powered educational sandbox for Kinsley",priority:2,labels:["internal"],dueDate:null,estimate:"2w",assignee:"kyle",subtasks:[],healthScore:90,repo:"ChaosClubCo/kidcreator",timeLog:[],sprintId:null,storyPoints:20,createdAt:"2026-03-01"},
  {id:"c7",laneId:"done",title:"INT Institutional Hub v1.0",description:"Launch completed",priority:4,labels:["client"],dueDate:"2026-03-20",estimate:"1w",assignee:"kyle",subtasks:[],healthScore:95,repo:"intinc/hub",timeLog:[{date:"2026-03-20",duration:180,note:"Final deploy & validation"}],sprintId:"sp1",storyPoints:5,createdAt:"2026-03-01"},
];

const DEF_SPRINTS = [
  {id:"sp1",name:"Sprint 9",startDate:"2026-03-16",endDate:"2026-03-30",totalPoints:40,
   burndown:[{d:0,i:40,a:40},{d:1,i:37.1,a:38},{d:2,i:34.3,a:36},{d:3,i:31.4,a:33},{d:4,i:28.6,a:29},
     {d:5,i:25.7,a:26},{d:6,i:22.9,a:24},{d:7,i:20,a:21},{d:8,i:17.1,a:18},{d:9,i:14.3,a:14},
     {d:10,i:11.4,a:null},{d:11,i:8.6,a:null},{d:12,i:5.7,a:null},{d:13,i:2.9,a:null},{d:14,i:0,a:null}]},
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:#0d1117}
::-webkit-scrollbar-thumb{background:#30363d;border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:#484f58}
.btn{cursor:pointer;border:none;border-radius:6px;font-family:inherit;font-size:12px;font-weight:500;padding:6px 12px;transition:all 0.15s;display:inline-flex;align-items:center;gap:4px}
.btn:hover{filter:brightness(1.15)}
.btn-primary{background:#388bfd;color:white}
.btn-ghost{background:transparent;color:#8b949e;border:1px solid #30363d}
.btn-ghost:hover{color:#e6edf3;border-color:#484f58;background:#161b22}
.btn-danger{background:#da3633;color:white}
.btn-success{background:#238636;color:white}
.inp{background:#0d1117;border:1px solid #30363d;border-radius:6px;color:#e6edf3;font-family:inherit;font-size:13px;padding:6px 10px;outline:none;width:100%}
.inp:focus{border-color:#388bfd}
.inp-sm{padding:4px 8px;font-size:12px}
textarea.inp{resize:vertical;min-height:80px}
.tag{display:inline-flex;align-items:center;font-size:10px;font-weight:600;padding:2px 7px;border-radius:100px;text-transform:uppercase;letter-spacing:0.4px;white-space:nowrap}
.card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:10px;cursor:pointer;transition:all 0.15s;user-select:none}
.card:hover{border-color:#484f58;background:#1c2128}
.card.dragging{opacity:0.3;transform:rotate(1deg)}
.drop-target{background:#1c2128!important;border-color:#388bfd!important;border-style:dashed!important}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px}
.modal{background:#161b22;border:1px solid #30363d;border-radius:12px;padding:24px;width:680px;max-width:100%;max-height:88vh;overflow-y:auto}
.sl{font-size:10px;font-weight:700;color:#8b949e;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px}
.pbar{height:3px;background:#21262d;border-radius:2px;overflow:hidden}
.pfill{height:100%;border-radius:2px;transition:width 0.3s}
.tab-pill{padding:4px 12px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;border:none;font-family:inherit}
.swimlane-header{padding:8px 12px;background:#0d1117;border:1px solid #21262d;border-radius:6px;margin-bottom:8px;font-size:12px;font-weight:600;color:#8b949e;display:flex;align-items:center;gap:8px}
.wip-warning{background:#3d1c1c;border-color:#da3633!important}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────

const fmt = (min) => min >= 60 ? `${Math.floor(min/60)}h${min%60?` ${min%60}m`:""}` : `${min}m`;
const isOverdue = (d) => d && new Date(d) < new Date();
const totalTime = (card) => (card.timeLog||[]).reduce((s,e)=>s+e.duration,0);
const getMember = (members, id) => members.find(m=>m.id===id);

function Lbl({text}) {
  const c = LC[text] || "#8b949e";
  return <span className="tag" style={{background:c+"22",color:c,border:`1px solid ${c}44`}}>{text}</span>;
}

function Ava({name,size=22}) {
  const c = ["#388bfd","#3fb950","#d29922","#f0883e","#8b5cf6"][name?.charCodeAt(0)%5||0];
  return <div style={{width:size,height:size,borderRadius:"50%",background:c+"33",border:`1px solid ${c}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.45,fontWeight:700,color:c,flexShrink:0,fontFamily:"'JetBrains Mono'"}}>{name?.[0]?.toUpperCase()||"?"}</div>;
}

// ─── Card Item ─────────────────────────────────────────────────────────────

function CardItem({card,members,onClick,onDragStart,onDragEnd,activeTimer,isDragging}) {
  const tt = totalTime(card);
  const done = card.subtasks?.filter(s=>s.done).length||0;
  const total = card.subtasks?.length||0;
  const isTimerActive = activeTimer?.cardId === card.id;
  const overdue = isOverdue(card.dueDate);
  return (
    <div className={`card${isDragging?" dragging":""}`}
      style={{borderLeft:`3px solid ${PC[card.priority]}`,marginBottom:6}}
      draggable onClick={()=>onClick(card)}
      onDragStart={(e)=>{e.dataTransfer.effectAllowed="move";onDragStart(card.id);}}
      onDragEnd={onDragEnd}>
      <div style={{fontSize:13,fontWeight:500,color:"#e6edf3",lineHeight:1.4,marginBottom:6}}>{card.title}</div>
      {card.labels.length>0&&<div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:6}}>{card.labels.map(l=><Lbl key={l} text={l}/>)}</div>}
      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
        {card.assignee && <Ava name={getMember(members,card.assignee)?.name||card.assignee} size={18}/>}
        {card.dueDate&&<span style={{fontSize:10,color:overdue?"#da3633":"#8b949e",fontFamily:"'JetBrains Mono'"}}>
          {overdue?"⚠":"📅"} {card.dueDate}</span>}
        {total>0&&<span style={{fontSize:10,color:done===total?"#3fb950":"#8b949e",fontFamily:"'JetBrains Mono'"}}>{done}/{total}</span>}
        {tt>0&&<span style={{fontSize:10,color:"#14b8a6",fontFamily:"'JetBrains Mono'"}}>⏱{fmt(tt)}</span>}
        {isTimerActive&&<span style={{fontSize:10,color:"#3fb950",fontFamily:"'JetBrains Mono'",animation:"pulse 1s infinite"}}>● REC</span>}
        {card.storyPoints&&<span style={{fontSize:10,color:"#8b949e",marginLeft:"auto",fontFamily:"'JetBrains Mono'"}}>{card.storyPoints}pt</span>}
      </div>
    </div>
  );
}

// ─── Lane ──────────────────────────────────────────────────────────────────

function Lane({lane,cards,members,onAddCard,onCardClick,onDragOver,onDrop,onDragLeave,isOver,isWipOver,activeTimer,dragCardId}) {
  return (
    <div style={{width:240,flexShrink:0,display:"flex",flexDirection:"column",maxHeight:"calc(100vh - 200px)"}}>
      <div style={{padding:"8px 10px",borderRadius:"8px 8px 0 0",background:"#161b22",border:`1px solid ${isWipOver?"#da3633":"#30363d"}`,borderBottom:"none",display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:lane.color,flexShrink:0}}/>
        <span style={{fontSize:12,fontWeight:600,color:"#e6edf3",flex:1}}>{lane.title}</span>
        <span style={{fontSize:11,fontFamily:"'JetBrains Mono'",color:isWipOver?"#da3633":"#8b949e"}}>
          {cards.length}{lane.wipLimit>0?`/${lane.wipLimit}`:""}
        </span>
        <button className="btn" style={{padding:"1px 6px",fontSize:14,background:"transparent",color:"#8b949e",border:"none"}}
          onClick={()=>onAddCard(lane.id)}>+</button>
      </div>
      <div className={`${isOver?"drop-target":""}`}
        style={{flex:1,overflowY:"auto",padding:8,background:"#0d1117",border:`1px solid ${isOver?"#388bfd":isWipOver?"#da3633":"#30363d"}`,borderTop:"none",borderRadius:"0 0 8px 8px",minHeight:80}}
        onDragOver={(e)=>{e.preventDefault();onDragOver(lane.id);}}
        onDrop={(e)=>{e.preventDefault();onDrop(lane.id);}}
        onDragLeave={onDragLeave}>
        {cards.map(card=>(
          <CardItem key={card.id} card={card} members={members}
            onClick={onCardClick} activeTimer={activeTimer}
            isDragging={dragCardId===card.id}
            onDragStart={(id)=>{}} onDragEnd={()=>{}}
          />
        ))}
        {cards.length===0&&<div style={{textAlign:"center",color:"#484f58",fontSize:11,padding:"20px 0"}}>Drop here</div>}
      </div>
    </div>
  );
}

// ─── Board View ────────────────────────────────────────────────────────────

function BoardView({lanes,cards,members,swimlaneGroup,groups,getCards,dragCardId,setDragCardId,dragOverLane,setDragOverLane,moveCard,onCardClick,onAddCard,activeTimer}) {
  const handleDragStart = (cardId) => setDragCardId(cardId);
  const handleDrop = (laneId) => { if(dragCardId) moveCard(dragCardId,laneId); setDragCardId(null); setDragOverLane(null); };
  const getLaneCount = (laneId) => cards.filter(c=>c.laneId===laneId).length;
  const isWipOver = (lane) => lane.wipLimit>0 && getLaneCount(lane.id)>lane.wipLimit;

  return (
    <div style={{flex:1,overflow:"auto",padding:"12px 16px"}}>
      {groups.map(group=>(
        <div key={group.id} style={{marginBottom:group.name?24:0}}>
          {group.name&&(
            <div className="swimlane-header">
              <span style={{color:"#388bfd"}}>◈</span>
              <span>{group.name}</span>
              <span style={{marginLeft:"auto",fontFamily:"'JetBrains Mono'",fontSize:11}}>
                {lanes.reduce((s,l)=>s+getCards(group.id,l.id).length,0)} cards
              </span>
            </div>
          )}
          <div style={{display:"flex",gap:10,minWidth:"max-content"}}>
            {lanes.map(lane=>{
              const laneCards = getCards(group.id, lane.id);
              // We need to override the card onClick with drag events in context
              return (
                <div key={lane.id} style={{width:240,flexShrink:0,display:"flex",flexDirection:"column"}}>
                  <div style={{padding:"8px 10px",borderRadius:"8px 8px 0 0",background:"#161b22",border:`1px solid ${isWipOver(lane)?"#da3633":"#30363d"}`,borderBottom:"none",display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:lane.color,flexShrink:0}}/>
                    <span style={{fontSize:12,fontWeight:600,color:"#e6edf3",flex:1}}>{lane.title}</span>
                    <span style={{fontSize:11,fontFamily:"'JetBrains Mono'",color:isWipOver(lane)?"#da3633":"#8b949e"}}>
                      {getLaneCount(lane.id)}{lane.wipLimit>0?`/${lane.wipLimit}`:""}
                    </span>
                    <button className="btn" style={{padding:"0px 5px",fontSize:14,background:"transparent",color:"#484f58",border:"none"}} onClick={()=>onAddCard(lane.id)}>+</button>
                  </div>
                  <div style={{flex:1,overflowY:"auto",padding:8,background:"#0d1117",border:`1px solid ${dragOverLane===lane.id?"#388bfd":isWipOver(lane)?"#da3633":"#21262d"}`,borderTop:"none",borderRadius:"0 0 8px 8px",minHeight:100,transition:"border-color 0.1s"}}
                    onDragOver={(e)=>{e.preventDefault();setDragOverLane(lane.id);}}
                    onDrop={()=>handleDrop(lane.id)}
                    onDragLeave={()=>setDragOverLane(null)}>
                    {laneCards.map(card=>(
                      <div key={card.id} className={`card${dragCardId===card.id?" dragging":""}`}
                        style={{borderLeft:`3px solid ${PC[card.priority]}`,marginBottom:6}}
                        draggable
                        onClick={()=>onCardClick(card)}
                        onDragStart={(e)=>{e.dataTransfer.effectAllowed="move";handleDragStart(card.id);}}
                        onDragEnd={()=>{setDragCardId(null);setDragOverLane(null);}}>
                        <div style={{fontSize:12,fontWeight:500,color:"#e6edf3",lineHeight:1.4,marginBottom:5}}>{card.title}</div>
                        {card.labels.length>0&&<div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:5}}>{card.labels.map(l=><Lbl key={l} text={l}/>)}</div>}
                        <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                          {card.assignee&&<Ava name={getMember(members,card.assignee)?.name||card.assignee} size={16}/>}
                          {card.dueDate&&<span style={{fontSize:10,color:isOverdue(card.dueDate)?"#da3633":"#484f58",fontFamily:"'JetBrains Mono'"}}>{card.dueDate}</span>}
                          {(card.subtasks||[]).length>0&&<span style={{fontSize:10,color:"#484f58",fontFamily:"'JetBrains Mono'"}}>{card.subtasks.filter(s=>s.done).length}/{card.subtasks.length}</span>}
                          {totalTime(card)>0&&<span style={{fontSize:10,color:"#14b8a6",fontFamily:"'JetBrains Mono'"}}>⏱{fmt(totalTime(card))}</span>}
                          {activeTimer?.cardId===card.id&&<span style={{fontSize:10,color:"#3fb950",fontFamily:"'JetBrains Mono'"}}>●REC</span>}
                          {card.storyPoints&&<span style={{fontSize:10,color:"#484f58",marginLeft:"auto",fontFamily:"'JetBrains Mono'"}}>{card.storyPoints}pt</span>}
                        </div>
                      </div>
                    ))}
                    {laneCards.length===0&&<div style={{textAlign:"center",color:"#30363d",fontSize:11,padding:"16px 0",fontStyle:"italic"}}>Drop here</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── List View ─────────────────────────────────────────────────────────────

function ListView({cards,lanes,members,onCardClick}) {
  const [sortBy,setSortBy] = useState("priority");
  const sorted = [...cards].sort((a,b)=>{
    if(sortBy==="priority") return b.priority-a.priority;
    if(sortBy==="due") return (a.dueDate||"9")>(b.dueDate||"9")?1:-1;
    if(sortBy==="health") return (b.healthScore||0)-(a.healthScore||0);
    return 0;
  });
  const cols = ["Status","Title","Priority","Labels","Assignee","Due","Time","Points"];
  return (
    <div style={{flex:1,overflow:"auto",padding:"12px 16px"}}>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        {["priority","due","health"].map(s=>(
          <button key={s} className="btn btn-ghost" style={{padding:"4px 10px",background:sortBy===s?"#21262d":"transparent",color:sortBy===s?"#e6edf3":"#8b949e"}} onClick={()=>setSortBy(s)}>Sort: {s}</button>
        ))}
      </div>
      <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:8,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"120px 1fr 80px 150px 80px 100px 70px 60px",gap:0,background:"#0d1117",borderBottom:"1px solid #30363d",padding:"8px 12px"}}>
          {cols.map(c=><div key={c} style={{fontSize:11,color:"#8b949e",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.6px"}}>{c}</div>)}
        </div>
        {sorted.map((card,i)=>(
          <div key={card.id} style={{display:"grid",gridTemplateColumns:"120px 1fr 80px 150px 80px 100px 70px 60px",gap:0,padding:"9px 12px",borderBottom:i<sorted.length-1?"1px solid #21262d":"none",cursor:"pointer",transition:"background 0.1s"}}
            onMouseEnter={e=>e.currentTarget.style.background="#1c2128"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            onClick={()=>onCardClick(card)}>
            <div><span style={{fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:4,background:lanes.find(l=>l.id===card.laneId)?.color+"22",color:lanes.find(l=>l.id===card.laneId)?.color}}>{lanes.find(l=>l.id===card.laneId)?.title||card.laneId}</span></div>
            <div style={{fontSize:12,color:"#e6edf3",fontWeight:500,paddingRight:8}}>{card.title}</div>
            <div><span style={{fontSize:11,fontWeight:700,color:PC[card.priority]}}>{PL[card.priority]}</span></div>
            <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{card.labels.slice(0,2).map(l=><Lbl key={l} text={l}/>)}</div>
            <div>{card.assignee&&<Ava name={getMember(members,card.assignee)?.name||""} size={20}/>}</div>
            <div style={{fontSize:11,color:isOverdue(card.dueDate)?"#da3633":"#8b949e",fontFamily:"'JetBrains Mono'"}}>{card.dueDate||"—"}</div>
            <div style={{fontSize:11,color:"#14b8a6",fontFamily:"'JetBrains Mono'"}}>{totalTime(card)>0?fmt(totalTime(card)):"—"}</div>
            <div style={{fontSize:11,color:"#8b949e",fontFamily:"'JetBrains Mono'"}}>{card.storyPoints||"—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Burndown View ─────────────────────────────────────────────────────────

function BurndownView({sprints,activeSprint,setActiveSprint,setSprints,cards}) {
  const sprint = sprints.find(s=>s.id===activeSprint)||sprints[0];
  const [editing,setEditing] = useState(false);
  const [form,setForm] = useState({name:sprint.name,startDate:sprint.startDate,endDate:sprint.endDate,totalPoints:sprint.totalPoints});

  const sprintCards = cards.filter(c=>c.sprintId===sprint.id);
  const completed = sprintCards.filter(c=>c.laneId==="done").reduce((s,c)=>s+(c.storyPoints||0),0);
  const remaining = sprintCards.reduce((s,c)=>s+(c.storyPoints||0),0) - completed;

  // SVG chart
  const W=520,H=200,PAD={l:40,r:20,t:10,b:30};
  const chartW = W-PAD.l-PAD.r, chartH = H-PAD.t-PAD.b;
  const maxDay = sprint.burndown.length-1;
  const maxPts = sprint.totalPoints;
  const xScale = (d) => PAD.l + (d/maxDay)*chartW;
  const yScale = (p) => PAD.t + chartH - (p/maxPts)*chartH;

  const idealPath = sprint.burndown.map((pt,i)=>`${i===0?"M":"L"}${xScale(pt.d)},${yScale(pt.i)}`).join(" ");
  const actualPoints = sprint.burndown.filter(pt=>pt.a!==null);
  const actualPath = actualPoints.map((pt,i)=>`${i===0?"M":"L"}${xScale(pt.d)},${yScale(pt.a)}`).join(" ");

  return (
    <div style={{flex:1,overflow:"auto",padding:20}}>
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        {sprints.map(s=>(
          <button key={s.id} className="btn btn-ghost" style={{background:activeSprint===s.id?"#21262d":"transparent",color:activeSprint===s.id?"#388bfd":"#8b949e",borderColor:activeSprint===s.id?"#388bfd":"#30363d"}} onClick={()=>setActiveSprint(s.id)}>{s.name}</button>
        ))}
        <button className="btn btn-ghost" style={{marginLeft:"auto"}} onClick={()=>setSprints(prev=>[...prev,{id:`sp${Date.now()}`,name:`Sprint ${prev.length+9}`,startDate:"",endDate:"",totalPoints:40,burndown:[{d:0,i:40,a:40}]}])}>+ New Sprint</button>
      </div>

      {/* Sprint stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {label:"Sprint",value:sprint.name,sub:`${sprint.startDate} → ${sprint.endDate}`},
          {label:"Total Points",value:sprint.totalPoints,sub:"committed"},
          {label:"Completed",value:completed+"pt",sub:`${sprint.totalPoints>0?Math.round(completed/sprint.totalPoints*100):0}% done`},
          {label:"Remaining",value:remaining+"pt",sub:remaining<0?"ahead of target":"to go"},
        ].map(stat=>(
          <div key={stat.label} style={{background:"#161b22",border:"1px solid #30363d",borderRadius:8,padding:"12px 16px"}}>
            <div style={{fontSize:10,color:"#8b949e",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.6px",marginBottom:4}}>{stat.label}</div>
            <div style={{fontSize:22,fontWeight:700,color:"#e6edf3",fontFamily:"'JetBrains Mono'"}}>{stat.value}</div>
            <div style={{fontSize:11,color:"#484f58",marginTop:2}}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:"16px 0 8px",marginBottom:16}}>
        <div style={{padding:"0 16px",marginBottom:12,display:"flex",alignItems:"center",gap:16}}>
          <span style={{fontSize:13,fontWeight:600,color:"#e6edf3"}}>Burndown Chart</span>
          <div style={{display:"flex",gap:12}}>
            <span style={{fontSize:11,color:"#484f58",display:"flex",alignItems:"center",gap:4}}><span style={{display:"inline-block",width:20,height:2,background:"#484f58",borderRadius:1}}/> Ideal</span>
            <span style={{fontSize:11,color:"#388bfd",display:"flex",alignItems:"center",gap:4}}><span style={{display:"inline-block",width:20,height:2,background:"#388bfd",borderRadius:1}}/> Actual</span>
          </div>
        </div>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible"}}>
          {/* Grid lines */}
          {[0,0.25,0.5,0.75,1].map(p=>(
            <g key={p}>
              <line x1={PAD.l} y1={yScale(maxPts*p)} x2={W-PAD.r} y2={yScale(maxPts*p)} stroke="#21262d" strokeWidth="1"/>
              <text x={PAD.l-6} y={yScale(maxPts*p)+4} fontSize="9" fill="#484f58" textAnchor="end">{Math.round(maxPts*p)}</text>
            </g>
          ))}
          {/* X axis labels */}
          {[0,3,6,9,12,14].map(d=>(
            <text key={d} x={xScale(d)} y={H-5} fontSize="9" fill="#484f58" textAnchor="middle">D{d}</text>
          ))}
          {/* Ideal line */}
          <path d={idealPath} fill="none" stroke="#484f58" strokeWidth="1.5" strokeDasharray="4,3"/>
          {/* Actual line */}
          {actualPath&&<path d={actualPath} fill="none" stroke="#388bfd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>}
          {/* Actual dots */}
          {actualPoints.map(pt=>(
            <circle key={pt.d} cx={xScale(pt.d)} cy={yScale(pt.a)} r="3.5" fill="#388bfd" stroke="#0d1117" strokeWidth="1.5"/>
          ))}
        </svg>
      </div>

      {/* Sprint cards list */}
      <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:8,overflow:"hidden"}}>
        <div style={{padding:"10px 14px",borderBottom:"1px solid #21262d",fontSize:12,fontWeight:600,color:"#8b949e"}}>Cards in Sprint ({sprintCards.length})</div>
        {sprintCards.length===0?<div style={{padding:20,textAlign:"center",color:"#484f58",fontSize:12}}>No cards in this sprint</div>:(
          sprintCards.map((card,i)=>(
            <div key={card.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",borderBottom:i<sprintCards.length-1?"1px solid #21262d":"none"}}>
              <span style={{width:3,height:32,background:PC[card.priority],borderRadius:2,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:"#e6edf3",fontWeight:500}}>{card.title}</div>
                <div style={{fontSize:10,color:"#484f58"}}>{card.labels.join(", ")}</div>
              </div>
              <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:4,background:LANES.find(l=>l.id===card.laneId)?.color+"22",color:LANES.find(l=>l.id===card.laneId)?.color,fontFamily:"'JetBrains Mono'"}}>{LANES.find(l=>l.id===card.laneId)?.title||card.laneId}</span>
              <span style={{fontSize:11,fontWeight:600,color:"#8b949e",fontFamily:"'JetBrains Mono'",width:30,textAlign:"right"}}>{card.storyPoints||0}pt</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Template Picker ────────────────────────────────────────────────────────

function TemplatePicker({onSelect,onClose}) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:12,padding:24,width:480,maxWidth:"95vw"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontSize:15,fontWeight:700,color:"#e6edf3"}}>Choose a Template</div>
          <button className="btn btn-ghost" style={{padding:"3px 8px"}} onClick={onClose}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {TEMPLATES.map(t=>(
            <button key={t.id} className="btn btn-ghost" style={{padding:"12px 14px",textAlign:"left",height:"auto",flexDirection:"column",alignItems:"flex-start",gap:4}}
              onClick={()=>onSelect(t)}>
              <div style={{fontSize:18}}>{t.icon}</div>
              <div style={{fontSize:12,fontWeight:600,color:"#e6edf3"}}>{t.name}</div>
              <div style={{fontSize:10,color:"#8b949e"}}>{t.defaults.labels.join(", ")||"No labels"} · {t.defaults.estimate||"No estimate"}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Card Modal ────────────────────────────────────────────────────────────

function CardModal({card,lanes,members,onSave,onDelete,onClose,activeTimer,startTimer,stopTimer,timerDisplay,addTimeEntry}) {
  const [form,setForm] = useState(card);
  const [tab,setTab] = useState("details");
  const [newSub,setNewSub] = useState("");
  const [timeForm,setTimeForm] = useState({duration:"",date:new Date().toISOString().split("T")[0],note:""});
  const isTimerActive = activeTimer?.cardId===card.id;
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const toggleLabel = (l) => {
    const ls = form.labels.includes(l) ? form.labels.filter(x=>x!==l) : [...form.labels,l];
    set("labels",ls);
  };
  const addSubtask = () => {
    if(!newSub.trim()) return;
    set("subtasks",[...(form.subtasks||[]),{id:`s${Date.now()}`,text:newSub.trim(),done:false}]);
    setNewSub("");
  };
  const toggleSubtask = (id) => set("subtasks",form.subtasks.map(s=>s.id===id?{...s,done:!s.done}:s));
  const removeSubtask = (id) => set("subtasks",form.subtasks.filter(s=>s.id!==id));
  const handleAddTime = () => {
    if(!timeForm.duration) return;
    const entry = {date:timeForm.date,duration:parseInt(timeForm.duration)||0,note:timeForm.note};
    addTimeEntry(card.id, timeForm.duration, timeForm.date, timeForm.note);
    setForm(f=>({...f, timeLog:[...(f.timeLog||[]), entry]}));
    setTimeForm({duration:"",date:new Date().toISOString().split("T")[0],note:""});
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16}}>
          <div style={{width:4,height:36,background:PC[form.priority],borderRadius:2,flexShrink:0,marginTop:2}}/>
          <input className="inp" style={{flex:1,fontSize:15,fontWeight:600,background:"transparent",border:"none",padding:"4px 0",borderRadius:0,borderBottom:"1px solid #30363d"}}
            value={form.title} onChange={e=>set("title",e.target.value)}/>
          <button className="btn btn-ghost" style={{padding:"4px 8px",flexShrink:0}} onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,marginBottom:16,borderBottom:"1px solid #21262d",paddingBottom:0}}>
          {[["details","Details"],["time","⏱ Time"],["subtasks","Subtasks"]].map(([id,label])=>(
            <button key={id} className="tab-pill" onClick={()=>setTab(id)}
              style={{background:tab===id?"#21262d":"transparent",color:tab===id?"#e6edf3":"#8b949e",border:"none",borderBottom:tab===id?"2px solid #388bfd":"2px solid transparent",borderRadius:"4px 4px 0 0"}}>
              {label}{id==="subtasks"&&form.subtasks?.length>0?` (${form.subtasks.length})`:""}{id==="time"&&totalTime(form)>0?` ${fmt(totalTime(form))}`:""}
            </button>
          ))}
        </div>

        {tab==="details"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div>
              <div className="sl">Lane</div>
              <select className="inp" value={form.laneId} onChange={e=>set("laneId",e.target.value)}>
                {lanes.map(l=><option key={l.id} value={l.id}>{l.title}</option>)}
              </select>
            </div>
            <div>
              <div className="sl">Priority</div>
              <select className="inp" value={form.priority} onChange={e=>set("priority",parseInt(e.target.value))}>
                {[1,2,3,4,5].map(p=><option key={p} value={p}>P{p} — {PL[p]}</option>)}
              </select>
            </div>
            <div>
              <div className="sl">Assignee</div>
              <select className="inp" value={form.assignee||""} onChange={e=>set("assignee",e.target.value||null)}>
                <option value="">Unassigned</option>
                {members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <div className="sl">Due Date</div>
              <input className="inp" type="date" value={form.dueDate||""} onChange={e=>set("dueDate",e.target.value||null)}/>
            </div>
            <div>
              <div className="sl">Estimate</div>
              <input className="inp" placeholder="2h, 1d, 1w..." value={form.estimate||""} onChange={e=>set("estimate",e.target.value)}/>
            </div>
            <div>
              <div className="sl">Story Points</div>
              <input className="inp" type="number" min="1" max="100" value={form.storyPoints||1} onChange={e=>set("storyPoints",parseInt(e.target.value)||1)}/>
            </div>
            <div style={{gridColumn:"span 2"}}>
              <div className="sl">Description</div>
              <textarea className="inp" style={{minHeight:100}} value={form.description||""} onChange={e=>set("description",e.target.value)}/>
            </div>
            <div style={{gridColumn:"span 2"}}>
              <div className="sl">Labels</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {Object.keys(LC).map(l=>{
                  const active = form.labels.includes(l);
                  return <button key={l} className="tag" style={{cursor:"pointer",background:active?LC[l]+"33":LC[l]+"11",color:LC[l],border:`1px solid ${LC[l]}${active?"":"33"}`,opacity:active?1:0.6}} onClick={()=>toggleLabel(l)}>{l}</button>;
                })}
              </div>
            </div>
            <div>
              <div className="sl">Repo</div>
              <input className="inp" placeholder="org/repo" value={form.repo||""} onChange={e=>set("repo",e.target.value)}/>
            </div>
            <div>
              <div className="sl">Health Score</div>
              <input className="inp" type="number" min="0" max="100" value={form.healthScore||""} onChange={e=>set("healthScore",parseInt(e.target.value)||null)} placeholder="0-100"/>
            </div>
          </div>
        )}

        {tab==="time"&&(
          <div>
            {/* Timer */}
            <div style={{background:"#0d1117",border:"1px solid #30363d",borderRadius:8,padding:16,marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontFamily:"'JetBrains Mono'",fontSize:28,fontWeight:700,color:isTimerActive?"#3fb950":"#e6edf3",flex:1}}>{isTimerActive?timerDisplay:"00:00"}</div>
              {isTimerActive?(
                <button className="btn btn-danger" onClick={()=>stopTimer(card.id,"Session")}>⏹ Stop & Log</button>
              ):(
                <button className="btn btn-success" onClick={()=>startTimer(card.id)}>▶ Start Timer</button>
              )}
            </div>

            {/* Manual entry */}
            <div style={{background:"#0d1117",border:"1px solid #30363d",borderRadius:8,padding:14,marginBottom:16}}>
              <div className="sl" style={{marginBottom:10}}>Log Time Manually</div>
              <div style={{display:"grid",gridTemplateColumns:"80px 1fr 1fr auto",gap:8,alignItems:"end"}}>
                <div>
                  <div style={{fontSize:10,color:"#484f58",marginBottom:4}}>Minutes</div>
                  <input className="inp inp-sm" type="number" min="1" placeholder="60" value={timeForm.duration} onChange={e=>setTimeForm(f=>({...f,duration:e.target.value}))}/>
                </div>
                <div>
                  <div style={{fontSize:10,color:"#484f58",marginBottom:4}}>Date</div>
                  <input className="inp inp-sm" type="date" value={timeForm.date} onChange={e=>setTimeForm(f=>({...f,date:e.target.value}))}/>
                </div>
                <div>
                  <div style={{fontSize:10,color:"#484f58",marginBottom:4}}>Note</div>
                  <input className="inp inp-sm" placeholder="What were you doing?" value={timeForm.note} onChange={e=>setTimeForm(f=>({...f,note:e.target.value}))}/>
                </div>
                <button className="btn btn-primary" style={{padding:"5px 12px"}} onClick={handleAddTime}>Add</button>
              </div>
            </div>

            {/* Log */}
            {(form.timeLog||[]).length===0?(
              <div style={{textAlign:"center",color:"#484f58",padding:24,fontSize:12}}>No time logged yet</div>
            ):(
              <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:8,overflow:"hidden"}}>
                <div style={{padding:"8px 12px",background:"#0d1117",borderBottom:"1px solid #21262d",display:"flex",justifyContent:"space-between",fontSize:11,color:"#8b949e",fontWeight:600}}>
                  <span>Time Log</span>
                  <span style={{fontFamily:"'JetBrains Mono'",color:"#14b8a6"}}>Total: {fmt(totalTime(form))}</span>
                </div>
                {(form.timeLog||[]).map((entry,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderBottom:i<form.timeLog.length-1?"1px solid #21262d":"none"}}>
                    <span style={{fontSize:11,fontFamily:"'JetBrains Mono'",color:"#8b949e",width:90}}>{entry.date}</span>
                    <span style={{fontSize:12,fontWeight:600,color:"#14b8a6",fontFamily:"'JetBrains Mono'",width:40}}>{fmt(entry.duration)}</span>
                    <span style={{fontSize:12,color:"#8b949e",flex:1}}>{entry.note||"—"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab==="subtasks"&&(
          <div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <input className="inp" placeholder="Add subtask..." value={newSub} onChange={e=>setNewSub(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addSubtask()}/>
              <button className="btn btn-primary" style={{flexShrink:0}} onClick={addSubtask}>Add</button>
            </div>
            {(form.subtasks||[]).length===0?(
              <div style={{textAlign:"center",color:"#484f58",padding:24,fontSize:12}}>No subtasks yet</div>
            ):(
              <div>
                <div style={{marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
                  <div className="pbar" style={{flex:1}}>
                    <div className="pfill" style={{width:`${form.subtasks.filter(s=>s.done).length/form.subtasks.length*100}%`,background:"#3fb950"}}/>
                  </div>
                  <span style={{fontSize:11,color:"#8b949e",fontFamily:"'JetBrains Mono'"}}>{form.subtasks.filter(s=>s.done).length}/{form.subtasks.length}</span>
                </div>
                {form.subtasks.map(s=>(
                  <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #21262d"}}>
                    <input type="checkbox" checked={s.done} onChange={()=>toggleSubtask(s.id)} style={{cursor:"pointer",accentColor:"#3fb950"}}/>
                    <span style={{flex:1,fontSize:13,color:s.done?"#484f58":"#e6edf3",textDecoration:s.done?"line-through":"none"}}>{s.text}</span>
                    <button className="btn" style={{padding:"2px 6px",background:"transparent",color:"#484f58",border:"none",fontSize:12}} onClick={()=>removeSubtask(s.id)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{display:"flex",gap:8,marginTop:20,paddingTop:16,borderTop:"1px solid #21262d"}}>
          <button className="btn btn-danger" style={{padding:"6px 14px"}} onClick={()=>onDelete(card.id)}>Delete</button>
          <div style={{flex:1}}/>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>onSave(form)}>Save Card</button>
        </div>
      </div>
    </div>
  );
}

// ─── Settings View ─────────────────────────────────────────────────────────

function SettingsView({notionConfig,setNotionConfig,syncToNotion,notionSyncing,notionStatus,lanes,setLanes,members,setMembers,cards}) {
  const [newMember,setNewMember] = useState({name:"",team:"Platform"});
  return (
    <div style={{flex:1,overflow:"auto",padding:20,display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,alignContent:"start"}}>
      {/* Notion sync */}
      <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:20,gridColumn:"span 2"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{width:32,height:32,background:"#ffffff11",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>N</div>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:"#e6edf3"}}>Notion Sync</div>
            <div style={{fontSize:11,color:"#8b949e"}}>Bi-directional sync with your Notion database via MCP</div>
          </div>
          {notionConfig.lastSync&&<div style={{marginLeft:"auto",fontSize:11,color:"#3fb950",fontFamily:"'JetBrains Mono'"}}>✓ Last sync: {new Date(notionConfig.lastSync).toLocaleTimeString()}</div>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"end"}}>
          <div>
            <div className="sl">Notion Database ID</div>
            <input className="inp" placeholder="32-character Notion database ID" value={notionConfig.databaseId} onChange={e=>setNotionConfig(prev=>({...prev,databaseId:e.target.value}))}/>
            <div style={{fontSize:10,color:"#484f58",marginTop:4}}>Find it in the URL: notion.so/workspace/[DATABASE_ID]?v=...</div>
          </div>
          <button className="btn btn-primary" style={{padding:"8px 20px",marginBottom:0}} onClick={syncToNotion} disabled={notionSyncing}>
            {notionSyncing?"⟳ Syncing...":"↑ Sync to Notion"}
          </button>
        </div>
        {notionStatus&&(
          <div style={{marginTop:12,padding:"10px 14px",borderRadius:6,background:notionStatus.type==="success"?"#1a3a1a":"#3a1a1a",border:`1px solid ${notionStatus.type==="success"?"#3fb950":"#da3633"}`,fontSize:12,color:notionStatus.type==="success"?"#3fb950":"#da3633"}}>
            {notionStatus.type==="success"?"✓ ":"✗ "}{notionStatus.msg}
          </div>
        )}
      </div>

      {/* Lane management */}
      <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:20}}>
        <div style={{fontSize:14,fontWeight:600,color:"#e6edf3",marginBottom:16}}>Lanes</div>
        {lanes.map(lane=>(
          <div key={lane.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:lane.color,flexShrink:0}}/>
            <input className="inp inp-sm" style={{flex:1}} value={lane.title} onChange={e=>setLanes(prev=>prev.map(l=>l.id===lane.id?{...l,title:e.target.value}:l))}/>
            <input className="inp inp-sm" type="number" min="0" max="20" style={{width:50}} value={lane.wipLimit} onChange={e=>setLanes(prev=>prev.map(l=>l.id===lane.id?{...l,wipLimit:parseInt(e.target.value)||0}:l))} title="WIP Limit (0=unlimited)"/>
          </div>
        ))}
      </div>

      {/* Team management */}
      <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:20}}>
        <div style={{fontSize:14,fontWeight:600,color:"#e6edf3",marginBottom:16}}>Team Members</div>
        {members.map(m=>(
          <div key={m.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <Ava name={m.name} size={24}/>
            <div style={{flex:1}}>
              <div style={{fontSize:12,color:"#e6edf3",fontWeight:500}}>{m.name}</div>
              <div style={{fontSize:10,color:"#484f58"}}>{m.team} · {cards.filter(c=>c.assignee===m.id).length} cards</div>
            </div>
            <button className="btn btn-ghost" style={{padding:"2px 6px",fontSize:11}} onClick={()=>setMembers(prev=>prev.filter(x=>x.id!==m.id))}>×</button>
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"1fr 100px auto",gap:6,marginTop:12}}>
          <input className="inp inp-sm" placeholder="Name" value={newMember.name} onChange={e=>setNewMember(f=>({...f,name:e.target.value}))}/>
          <select className="inp inp-sm" value={newMember.team} onChange={e=>setNewMember(f=>({...f,team:e.target.value}))}>
            {["Platform","AppSec","Infrastructure","Automation","Client"].map(t=><option key={t}>{t}</option>)}
          </select>
          <button className="btn btn-primary" style={{padding:"4px 10px"}} onClick={()=>{
            if(!newMember.name.trim()) return;
            setMembers(prev=>[...prev,{id:newMember.name.toLowerCase().replace(/\s+/g,"-"),name:newMember.name,team:newMember.team,avatar:newMember.name[0]}]);
            setNewMember({name:"",team:"Platform"});
          }}>Add</button>
        </div>
      </div>

      {/* Data management */}
      <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:20,gridColumn:"span 2"}}>
        <div style={{fontSize:14,fontWeight:600,color:"#e6edf3",marginBottom:12}}>Data Management</div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-ghost" onClick={()=>{const d=JSON.stringify({lanes,members,cards},null,2);const b=new Blob([d]);const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=`kanban-${Date.now()}.json`;a.click();}}>⬇ Export JSON</button>
          <button className="btn btn-ghost" onClick={()=>{const h="Name,Status,Priority,Labels,Assignee,Due,Points,Time\n"+cards.map(c=>`"${c.title}","${c.laneId}","${PL[c.priority]}","${c.labels.join(";")}","${c.assignee||""}","${c.dueDate||""}","${c.storyPoints||0}","${fmt(totalTime(c))}"`).join("\n");const b=new Blob([h],{type:"text/csv"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=`kanban-${Date.now()}.csv`;a.click();}}>⬇ Export CSV</button>
        </div>
      </div>
    </div>
  );
}

// ─── AI Panel ─────────────────────────────────────────────────────────────

function AIPanel({analysis,loading,onReanalyze,moveCard,cards}) {
  if(loading) return <div style={{padding:20,textAlign:"center",color:"#8b949e"}}><div style={{fontSize:20,marginBottom:8}}>◈</div>Analyzing board...</div>;
  if(!analysis) return null;
  return (
    <div style={{fontSize:12}}>
      <div style={{background:"#0d1117",border:"1px solid #21262d",borderRadius:8,padding:12,marginBottom:12,color:"#8b949e",lineHeight:1.6}}>{analysis.summary}</div>
      {analysis.riskAlerts?.length>0&&analysis.riskAlerts.map((r,i)=>(
        <div key={i} style={{background:"#3a1a1a",border:"1px solid #da363355",borderRadius:6,padding:"8px 10px",marginBottom:6,color:"#f0883e",fontSize:11}}>⚠ {r}</div>
      ))}
      {analysis.wipWarnings?.length>0&&<div style={{marginBottom:12}}>
        <div className="sl">WIP Warnings</div>
        {analysis.wipWarnings.map((w,i)=><div key={i} style={{color:"#d29922",padding:"4px 0",borderBottom:"1px solid #21262d",fontSize:11}}>• {w}</div>)}
      </div>}
      {analysis.weeklyFocus?.length>0&&<div style={{marginBottom:12}}>
        <div className="sl">This Week</div>
        {analysis.weeklyFocus.map((f,i)=><div key={i} style={{color:"#3fb950",padding:"4px 0",borderBottom:"1px solid #21262d",fontSize:11}}>→ {f}</div>)}
      </div>}
      {analysis.suggestedMoves?.length>0&&<div style={{marginBottom:12}}>
        <div className="sl">Suggested Moves</div>
        {analysis.suggestedMoves.map((m,i)=>{
          const card = cards.find(c=>c.title.toLowerCase().includes(m.cardTitle?.toLowerCase())||"");
          return (
            <div key={i} style={{background:"#0d1117",border:"1px solid #21262d",borderRadius:6,padding:"8px 10px",marginBottom:4}}>
              <div style={{fontWeight:600,color:"#e6edf3",marginBottom:2,fontSize:11}}>{m.cardTitle}</div>
              <div style={{color:"#8b949e",fontSize:10,marginBottom:6}}>{m.from} → {m.to}: {m.reason}</div>
              {card&&<button className="btn btn-primary" style={{padding:"3px 8px",fontSize:10}} onClick={()=>moveCard(card.id,LANES.find(l=>l.title.toLowerCase()===m.to?.toLowerCase())?.id||m.to)}>Apply</button>}
            </div>
          );
        })}
      </div>}
      {analysis.bottlenecks?.length>0&&<div>
        <div className="sl">Bottlenecks</div>
        {analysis.bottlenecks.map((b,i)=><div key={i} style={{color:"#8b5cf6",padding:"4px 0",fontSize:11}}>◈ {b}</div>)}
      </div>}
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────

export default function KanbanApp() {
  const [lanes, setLanes] = useState(LANES);
  const [cards, setCards] = useState(DEF_CARDS);
  const [members, setMembers] = useState(DEF_MEMBERS);
  const [sprints, setSprints] = useState(DEF_SPRINTS);
  const [activeSprintId, setActiveSprintId] = useState("sp1");

  const [activeTab, setActiveTab] = useState("board");
  const [boardView, setBoardView] = useState("board");
  const [swimlaneGroup, setSwimlaneGroup] = useState("none");
  const [showAI, setShowAI] = useState(false);
  const [filters, setFilters] = useState({search:"",label:"",assignee:"",priority:""});

  const [dragCardId, setDragCardId] = useState(null);
  const [dragOverLane, setDragOverLane] = useState(null);

  const [editCard, setEditCard] = useState(null);
  const [templatePickerLane, setTemplatePickerLane] = useState(null);

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [activeTimer, setActiveTimer] = useState(null);
  const [timerDisplay, setTimerDisplay] = useState("00:00");
  const timerRef = useRef(null);

  const [notionConfig, setNotionConfig] = useState({databaseId:"",lastSync:null});
  const [notionSyncing, setNotionSyncing] = useState(false);
  const [notionStatus, setNotionStatus] = useState(null);

  // Persist
  useEffect(()=>{try{const s=JSON.parse(localStorage.getItem(SK)||"{}");if(s.cards)setCards(s.cards);if(s.lanes)setLanes(s.lanes);if(s.members)setMembers(s.members);if(s.sprints)setSprints(s.sprints);if(s.notionConfig)setNotionConfig(s.notionConfig);}catch(e){}}, []);
  useEffect(()=>{localStorage.setItem(SK,JSON.stringify({lanes,cards,members,sprints,notionConfig}));}, [lanes,cards,members,sprints,notionConfig]);

  // Timer
  useEffect(()=>{
    if(activeTimer){timerRef.current=setInterval(()=>{const s=Math.floor((Date.now()-activeTimer.startTime)/1000);setTimerDisplay(`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`);},1000);}
    else{clearInterval(timerRef.current);setTimerDisplay("00:00");}
    return()=>clearInterval(timerRef.current);
  },[activeTimer]);

  // Card ops
  const addCard = (laneId,template)=>{
    const d=template?.defaults||{};
    const c={id:`c${Date.now()}`,laneId,title:"New Card",description:d.description||"",priority:d.priority||2,labels:d.labels||[],dueDate:null,estimate:d.estimate||"",assignee:null,subtasks:[],healthScore:null,repo:"",timeLog:[],sprintId:activeSprintId,storyPoints:1,createdAt:new Date().toISOString().split("T")[0]};
    setCards(prev=>[...prev,c]); setEditCard(c); setTemplatePickerLane(null);
  };
  const updateCard=(u)=>{setCards(prev=>prev.map(c=>c.id===u.id?u:c));setEditCard(null);};
  const deleteCard=(id)=>{setCards(prev=>prev.filter(c=>c.id!==id));setEditCard(null);};
  const moveCard=(cardId,laneId)=>setCards(prev=>prev.map(c=>c.id===cardId?{...c,laneId}:c));

  // Timer ops
  const startTimer=(cardId)=>setActiveTimer({cardId,startTime:Date.now()});
  const stopTimer=(cardId)=>{
    if(!activeTimer||activeTimer.cardId!==cardId) return;
    const dur=Math.max(1,Math.floor((Date.now()-activeTimer.startTime)/60000));
    setCards(prev=>prev.map(c=>c.id===cardId?{...c,timeLog:[...(c.timeLog||[]),{date:new Date().toISOString().split("T")[0],duration:dur,note:"Tracked session"}]}:c));
    setActiveTimer(null);
  };
  const addTimeEntry=(cardId,duration,date,note)=>setCards(prev=>prev.map(c=>c.id===cardId?{...c,timeLog:[...(c.timeLog||[]),{date,duration:parseInt(duration)||0,note}]}:c));

  // Filters
  const filteredCards = cards.filter(c=>{
    if(filters.search&&!c.title.toLowerCase().includes(filters.search.toLowerCase()))return false;
    if(filters.label&&!c.labels.includes(filters.label))return false;
    if(filters.assignee&&c.assignee!==filters.assignee)return false;
    if(filters.priority&&c.priority!==parseInt(filters.priority))return false;
    return true;
  });

  // Swimlane groups
  const groups = (()=>{
    if(swimlaneGroup==="none") return [{id:"all",name:null}];
    const seen=new Map();
    cards.forEach(c=>{
      if(swimlaneGroup==="assignee"){const k=c.assignee||"unassigned";if(!seen.has(k))seen.set(k,members.find(m=>m.id===k)?.name||k);}
      else if(swimlaneGroup==="label"){if(c.labels.length===0){if(!seen.has("unlabeled"))seen.set("unlabeled","Unlabeled");}else c.labels.forEach(l=>{if(!seen.has(l))seen.set(l,l);});}
      else if(swimlaneGroup==="priority"){const k=String(c.priority);if(!seen.has(k))seen.set(k,`P${k} — ${PL[c.priority]}`);}
    });
    return Array.from(seen.entries()).map(([id,name])=>({id,name}));
  })();

  const getCards=(swimId,laneId)=>filteredCards.filter(c=>{
    if(c.laneId!==laneId)return false;
    if(swimlaneGroup==="none")return true;
    if(swimlaneGroup==="assignee")return(c.assignee||"unassigned")===swimId;
    if(swimlaneGroup==="label"){if(swimId==="unlabeled")return c.labels.length===0;return c.labels.includes(swimId);}
    if(swimlaneGroup==="priority")return String(c.priority)===swimId;
    return true;
  });

  // AI
  const runAI=async()=>{
    setAiLoading(true);setShowAI(true);
    try{
      const summary={lanes:lanes.map(l=>({lane:l.title,count:cards.filter(c=>c.laneId===l.id).length,wip:l.wipLimit})),overdue:cards.filter(c=>c.dueDate&&new Date(c.dueDate)<new Date()).map(c=>c.title),blocked:cards.filter(c=>c.laneId==="blocked").map(c=>c.title),highPriority:cards.filter(c=>c.priority>=4).map(c=>({title:c.title,lane:c.laneId}))};
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Analyze this Kanban board JSON and return ONLY valid JSON (no markdown, no explanation):\n${JSON.stringify(summary)}\n\nReturn: {"summary":"2-sentence overview","wipWarnings":[],"suggestedMoves":[{"cardTitle":"","from":"","to":"","reason":""}],"bottlenecks":[],"weeklyFocus":[],"riskAlerts":[]}`}]})});
      const data=await res.json();
      const txt=data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"{}";
      setAiAnalysis(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    }catch(e){setAiAnalysis({summary:"Analysis unavailable — check API.",wipWarnings:[],suggestedMoves:[],bottlenecks:[],weeklyFocus:[],riskAlerts:[]});}
    setAiLoading(false);
  };

  // Notion sync
  const syncToNotion=async()=>{
    if(!notionConfig.databaseId){setNotionStatus({type:"error",msg:"Enter a Notion database ID first"});return;}
    setNotionSyncing(true);setNotionStatus(null);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Sync these Kanban cards to Notion database: ${notionConfig.databaseId}\n\nCards: ${JSON.stringify(cards.map(c=>({title:c.title,status:lanes.find(l=>l.id===c.laneId)?.title||c.laneId,priority:PL[c.priority],labels:c.labels,assignee:c.assignee,due:c.dueDate})))}\n\nCreate or update pages in the Notion database. Report how many cards were synced.`}],mcp_servers:[{type:"url",url:"https://mcp.notion.com/mcp",name:"notion-mcp"}]})});
      const data=await res.json();
      const result=data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"Sync completed";
      setNotionConfig(prev=>({...prev,lastSync:new Date().toISOString()}));
      setNotionStatus({type:"success",msg:result.slice(0,200)});
    }catch(e){setNotionStatus({type:"error",msg:"Sync failed: "+e.message});}
    setNotionSyncing(false);
  };

  const isWipOver=(lane)=>lane.wipLimit>0&&cards.filter(c=>c.laneId===lane.id).length>lane.wipLimit;

  return (
    <div style={{fontFamily:"'Outfit',sans-serif",background:"#0d1117",color:"#e6edf3",minHeight:"100vh",display:"flex",flexDirection:"column",fontSize:14}}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{background:"#161b22",borderBottom:"1px solid #21262d",padding:"10px 16px",display:"flex",alignItems:"center",gap:12,flexShrink:0,flexWrap:"wrap",gap:10}}>
        <div style={{fontWeight:700,fontSize:14,fontFamily:"'JetBrains Mono'",color:"#e6edf3",display:"flex",alignItems:"center",gap:6}}>
          <span style={{color:"#388bfd",fontSize:16}}>◆</span> Kanban
        </div>
        <div style={{display:"flex",gap:3,background:"#0d1117",borderRadius:8,padding:3}}>
          {[["board","Board"],["burndown","Burndown"],["settings","⚙ Settings"]].map(([id,label])=>(
            <button key={id} className="tab-pill" onClick={()=>setActiveTab(id)} style={{background:activeTab===id?"#21262d":"transparent",color:activeTab===id?"#e6edf3":"#8b949e",border:"none"}}>
              {label}
            </button>
          ))}
        </div>
        <div style={{flex:1}}/>
        <select className="inp" style={{width:"auto",padding:"4px 8px",fontSize:12}} value={activeSprintId} onChange={e=>setActiveSprintId(e.target.value)}>
          {sprints.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {activeTimer&&(
          <div style={{background:"#0c2a0c",border:"1px solid #3fb950",borderRadius:6,padding:"4px 10px",fontSize:12,color:"#3fb950",fontFamily:"'JetBrains Mono'",display:"flex",alignItems:"center",gap:6}}>
            ● {timerDisplay}
            <button className="btn btn-danger" style={{padding:"2px 6px",fontSize:10}} onClick={()=>stopTimer(activeTimer.cardId)}>Stop</button>
          </div>
        )}
        <button className="btn btn-ghost" style={{border:`1px solid ${showAI?"#388bfd":"#30363d"}`,color:showAI?"#388bfd":"#8b949e",background:showAI?"#0d2240":"transparent"}}
          onClick={()=>{if(!aiAnalysis&&!aiLoading)runAI();else setShowAI(v=>!v);}}>
          ◈ AI
        </button>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

          {activeTab==="board"&&(
            <>
              {/* Controls */}
              <div style={{padding:"8px 16px",borderBottom:"1px solid #21262d",display:"flex",alignItems:"center",gap:8,flexShrink:0,flexWrap:"wrap"}}>
                <input className="inp inp-sm" placeholder="🔍 Search..." style={{width:180}} value={filters.search} onChange={e=>setFilters(f=>({...f,search:e.target.value}))}/>
                <select className="inp inp-sm" style={{width:"auto"}} value={filters.label} onChange={e=>setFilters(f=>({...f,label:e.target.value}))}>
                  <option value="">All Labels</option>{Object.keys(LC).map(l=><option key={l}>{l}</option>)}
                </select>
                <select className="inp inp-sm" style={{width:"auto"}} value={filters.assignee} onChange={e=>setFilters(f=>({...f,assignee:e.target.value}))}>
                  <option value="">All Assignees</option>{members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <select className="inp inp-sm" style={{width:"auto"}} value={filters.priority} onChange={e=>setFilters(f=>({...f,priority:e.target.value}))}>
                  <option value="">All Priorities</option>{[1,2,3,4,5].map(p=><option key={p} value={p}>P{p} {PL[p]}</option>)}
                </select>
                <div style={{flex:1}}/>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:11,color:"#8b949e"}}>Group:</span>
                  <select className="inp inp-sm" style={{width:"auto"}} value={swimlaneGroup} onChange={e=>setSwimlaneGroup(e.target.value)}>
                    <option value="none">None</option>
                    <option value="assignee">Assignee</option>
                    <option value="label">Label</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
                <div style={{display:"flex",border:"1px solid #30363d",borderRadius:6,overflow:"hidden"}}>
                  {[["board","⊞"],["list","☰"]].map(([v,icon])=>(
                    <button key={v} className="btn" onClick={()=>setBoardView(v)} style={{borderRadius:0,padding:"4px 10px",background:boardView===v?"#21262d":"transparent",color:boardView===v?"#e6edf3":"#8b949e",border:"none"}}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {boardView==="board"?(
                <BoardView lanes={lanes} cards={filteredCards} members={members}
                  swimlaneGroup={swimlaneGroup} groups={groups} getCards={getCards}
                  dragCardId={dragCardId} setDragCardId={setDragCardId}
                  dragOverLane={dragOverLane} setDragOverLane={setDragOverLane}
                  moveCard={moveCard} onCardClick={setEditCard} onAddCard={(laneId)=>setTemplatePickerLane(laneId)}
                  activeTimer={activeTimer}/>
              ):(
                <ListView cards={filteredCards} lanes={lanes} members={members} onCardClick={setEditCard}/>
              )}
            </>
          )}

          {activeTab==="burndown"&&<BurndownView sprints={sprints} activeSprint={activeSprintId} setActiveSprint={setActiveSprintId} setSprints={setSprints} cards={cards}/>}

          {activeTab==="settings"&&<SettingsView notionConfig={notionConfig} setNotionConfig={setNotionConfig} syncToNotion={syncToNotion} notionSyncing={notionSyncing} notionStatus={notionStatus} lanes={lanes} setLanes={setLanes} members={members} setMembers={setMembers} cards={cards}/>}
        </div>

        {/* AI Panel */}
        {showAI&&(
          <div style={{width:300,borderLeft:"1px solid #21262d",background:"#161b22",overflow:"auto",padding:16,flexShrink:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <span style={{fontWeight:700,fontSize:13,color:"#e6edf3"}}>◈ AI Analysis</span>
              <button className="btn btn-ghost" style={{padding:"2px 7px"}} onClick={()=>setShowAI(false)}>✕</button>
            </div>
            <AIPanel analysis={aiAnalysis} loading={aiLoading} onReanalyze={runAI} moveCard={moveCard} cards={cards}/>
            <button className="btn btn-primary" style={{width:"100%",marginTop:12}} onClick={runAI} disabled={aiLoading}>
              {aiLoading?"Analyzing...":"↺ Re-analyze"}
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {templatePickerLane&&<TemplatePicker onSelect={(t)=>addCard(templatePickerLane,t)} onClose={()=>setTemplatePickerLane(null)}/>}
      {editCard&&<CardModal card={editCard} lanes={lanes} members={members}
        onSave={updateCard} onDelete={deleteCard} onClose={()=>setEditCard(null)}
        activeTimer={activeTimer} startTimer={startTimer} stopTimer={stopTimer}
        timerDisplay={timerDisplay} addTimeEntry={addTimeEntry}/>}
    </div>
  );
}
