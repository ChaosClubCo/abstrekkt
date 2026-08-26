/**
 * Claude Enablement Suite — 06: Objection Handler
 * Design: Reading Room at Midnight — Variant B
 * Stateless — no storage. Pre-loaded Q&A + Claude API.
 */
import { useState, useEffect, useRef } from "react";

const T={bg:"#0c0c0b",surface:"#111110",card:"#181815",border:"#232320",borderHi:"#303030",accent:"#d4893a",accentHi:"#e8a050",text:"#ddd8ce",text2:"#807c74",text3:"#3a3835",mono:"#7ab878",mono2:"#78afc8",red:"#c05050",green:"#5a9c5a",tag:"#1e1e1a"};
const CSS=`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}::selection{background:rgba(212,137,58,0.25)}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0c0c0b}::-webkit-scrollbar-thumb{background:#303030;border-radius:3px}`;
const sf={sans:{fontFamily:"'IBM Plex Sans', sans-serif"},mono:{fontFamily:"'IBM Plex Mono', monospace"},head:{fontFamily:"'Playfair Display', serif",fontWeight:700}};

function Eyebrow({children,color,style={}}){return <div style={{...sf.mono,fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:color||T.accent,...style}}>{children}</div>;}
function Mono({children,size=11,color,style={}}){return <span style={{...sf.mono,fontSize:size,color:color||T.text2,lineHeight:1,...style}}>{children}</span>;}
function Tag({children,color}){return <span style={{background:T.tag,border:`1px solid ${T.borderHi}`,borderRadius:2,...sf.mono,fontSize:9.5,color:color||T.text2,padding:"2px 7px",display:"inline-block"}}>{children}</span>;}
function Card({children,style={}}){return <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:3,padding:"16px 20px",...style}}>{children}</div>;}

const QA=[
  {id:"s1",cat:"Security & Data",q:"Does Anthropic train on our data?",a:"No. On Pro, Team, Enterprise, and API, conversations are not used for training. Free users may have data used by default. See anthropic.com/legal/privacy.",tags:["privacy","training"]},
  {id:"s2",cat:"Security & Data",q:"What about confidential data?",a:"On Pro+ and API, conversations are not used for training. Treat Claude like any cloud service. Enterprise offers SOC 2 Type II and configurable retention.",tags:["confidential","compliance"]},
  {id:"s3",cat:"Security & Data",q:"Is Claude SOC 2 compliant?",a:"Yes \u2014 Anthropic holds SOC 2 Type II for Enterprise plan with audit controls, SSO/SAML. Verify at trust.anthropic.com.",tags:["SOC2","enterprise"]},
  {id:"s4",cat:"Security & Data",q:"Can Claude leak data between users?",a:"No. Sessions isolated. No cross-user access. Projects and memory are per-account. Enterprise adds group segmentation.",tags:["isolation"]},
  {id:"r1",cat:"Reliability",q:"What if Claude makes things up?",a:"Claude does hallucinate, less than earlier models. Use as fast first draft, not source of truth. Web search and file uploads reduce risk.",tags:["hallucination","accuracy"]},
  {id:"r2",cat:"Reliability",q:"Results aren't good enough.",a:"Usually a prompting issue. Fix: add role context, specify format, give examples. The prompt package we build is designed to close this gap.",tags:["quality","prompting"]},
  {id:"r3",cat:"Reliability",q:"Claude keeps refusing normal requests.",a:"Refusals have improved. Try rephrasing with professional context. Claude also says 'I don't know' instead of guessing, which can read as refusal.",tags:["refusals","safety"]},
  {id:"j1",cat:"Job Concerns",q:"Is this replacing my job?",a:"Claude replaces tasks within jobs, not jobs themselves. Employees who use AI to do more, faster have the most to gain. This program puts you in that group.",tags:["replacement"]},
  {id:"j2",cat:"Job Concerns",q:"Manager will think I'm not doing my work.",a:"AI-assisted work is still your work. Frame as productivity multiplier. If org hasn't set AI norms, raise it proactively.",tags:["attribution"]},
  {id:"j3",cat:"Job Concerns",q:"I don't want to become dependent.",a:"Goal is augmentation, not dependency. Claude handles mechanical cognitive work so you focus on judgment, relationships, creative work.",tags:["dependency"]},
  {id:"c1",cat:"vs. Competitors",q:"I already use ChatGPT.",a:"Claude advantages: 200K context, Projects + persistent instructions, MCP connectors (Drive, Notion, Slack), Claude Code, better instruction-following.",tags:["ChatGPT"]},
  {id:"c2",cat:"vs. Competitors",q:"We pay for Microsoft Copilot.",a:"Copilot for in-Office actions. Claude for standalone reasoning, large doc analysis, cross-platform, Claude Code. Many orgs run both.",tags:["Copilot"]},
  {id:"c3",cat:"vs. Competitors",q:"What about Gemini?",a:"Gemini integrates well into Google Workspace. Claude: stronger instruction-following, Claude Code, more mature MCP ecosystem, better long-context retrieval.",tags:["Gemini"]},
  {id:"m1",cat:"Cost & ROI",q:"Is $20/month worth it?",a:"If Claude saves 30 min/week, that's 26 hr/year. At $30/hr loaded cost, break-even is under 8 hours. The program ensures consistent usage.",tags:["cost","ROI"]},
  {id:"m2",cat:"Cost & ROI",q:"Tried it once, wasn't impressed.",a:"Out-of-box Claude is decent. Configured Claude with Projects, instructions, memory, and prompt packages is a different tool. Compare in 2 weeks.",tags:["first impression"]},
  {id:"t1",cat:"Technical",q:"How do I know what's real vs. made up?",a:"Claude flags uncertainty. Enable web search for cited sources. Upload source docs for direct quotes instead of training data.",tags:["accuracy"]},
  {id:"t2",cat:"Technical",q:"Can Claude see my files automatically?",a:"Only via Settings \u2192 Connectors with your OAuth. No passive access. Permission to look up when asked, not continuous monitoring.",tags:["connectors","access"]},
  {id:"t3",cat:"Technical",q:"Claude.ai vs API?",a:"Claude.ai: chat interface with Projects, Memory, Connectors for daily use. API: programmatic integration for developers building tools.",tags:["API"]},
  {id:"t4",cat:"Technical",q:"What are MCP connectors?",a:"Model Context Protocol lets Claude read from your tools: Drive, Notion, Slack, 50+ others. Claude answers from your actual documents.",tags:["MCP"]},
  {id:"t5",cat:"Technical",q:"What's Claude Code?",a:"Terminal-based coding agent. Reads your codebase, makes multi-file changes, runs tests. Highest-leverage tool for developers and technical IT.",tags:["Claude Code"]},
];

const CATS=[...new Set(QA.map(q=>q.cat))];
const AI_SYS=`You are an expert Claude enablement trainer. Answer adoption objections. Audience: skeptical employees. Tone: direct, honest, no hype. 2-4 sentences. Knowledge: claude.ai, Claude Code, Projects, Memory, Connectors, MCP, API, plans. Pro $20/mo. SOC 2 Type II.`;

export default function ObjectionHandler(){
  const[query,setQuery]=useState("");const[cat,setCat]=useState("all");const[expanded,setExpanded]=useState({});
  const[aiInput,setAiInput]=useState("");const[aiMsgs,setAiMsgs]=useState([]);const[loading,setLoading]=useState(false);const[tab,setTab]=useState("library");
  const abortRef=useRef(null);const histRef=useRef([]);const msgRef=useRef(null);

  useEffect(()=>{if(msgRef.current)msgRef.current.scrollTop=msgRef.current.scrollHeight;},[aiMsgs]);
  useEffect(()=>()=>abortRef.current?.abort(),[]);

  const results=QA.filter(item=>{if(cat!=="all"&&item.cat!==cat)return false;if(!query.trim())return true;const q=query.toLowerCase();return item.q.toLowerCase().includes(q)||item.a.toLowerCase().includes(q)||item.tags.some(t=>t.toLowerCase().includes(q));});

  async function askAI(){const text=aiInput.trim();if(!text||loading)return;setAiInput("");setLoading(true);
  const um={role:"user",content:text};histRef.current=[...histRef.current,um];setAiMsgs(p=>[...p,um]);
  abortRef.current=new AbortController();
  try{const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",signal:abortRef.current.signal,headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:600,system:AI_SYS,messages:histRef.current.map(m=>({role:m.role,content:m.content}))})});
  if(!resp.ok){const e=await resp.json().catch(()=>({}));throw new Error(e.error?.message||`HTTP ${resp.status}`);}
  const data=await resp.json();const reply=data.content?.[0]?.text||"No response.";const am={role:"assistant",content:reply};histRef.current=[...histRef.current,am];setAiMsgs(p=>[...p,am]);}
  catch(err){if(err.name==="AbortError")return;histRef.current=histRef.current.slice(0,-1);setAiMsgs(p=>[...p,{role:"assistant",content:`Error: ${err.message}`,error:true}]);}
  finally{setLoading(false);}}

  return (<><style>{CSS}</style>
  <div style={{minHeight:"100vh",background:T.bg,...sf.sans,fontSize:13.5,color:T.text}}>
  <header style={{padding:"22px 40px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
  <div><Eyebrow style={{marginBottom:6}}>Objection Handler</Eyebrow><div style={{...sf.head,fontSize:22}}>Address Pushback</div></div>
  <div style={{display:"flex",borderRadius:2,overflow:"hidden",border:`1px solid ${T.borderHi}`}}>
  {[["library","Library"],["ai","Ask AI"]].map(([id,label])=>(
  <button key={id} onClick={()=>setTab(id)} style={{padding:"5px 14px",border:"none",cursor:"pointer",...sf.mono,fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",background:tab===id?T.accent+"20":"transparent",color:tab===id?T.accentHi:T.text3,transition:"all 0.15s"}}>{label}</button>
  ))}</div></header>

  <main style={{padding:"24px 40px",maxWidth:780}}>
  {tab==="library"&&(<>
  <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search objections, keywords..." style={{width:"100%",padding:"8px 12px",borderRadius:2,border:`1px solid ${T.borderHi}`,...sf.sans,fontSize:12,background:T.bg,color:T.text,outline:"none",marginBottom:12}}/>
  <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap"}}>
  {["all",...CATS].map(c=>(
  <button key={c} onClick={()=>setCat(c)} style={{padding:"3px 10px",borderRadius:2,border:`1px solid ${cat===c?T.accent:T.border}`,background:cat===c?T.accent+"15":"transparent",color:cat===c?T.accent:T.text2,...sf.sans,fontSize:11,cursor:"pointer"}}>{c==="all"?`All (${QA.length})`:`${c} (${QA.filter(q=>q.cat===c).length})`}</button>
  ))}</div>

  {!results.length?(<Card style={{textAlign:"center",padding:30}}><Mono color={T.text3}>no matches</Mono><div style={{marginTop:12}}><button onClick={()=>{setAiInput(query);setTab("ai");}} style={{...sf.mono,fontSize:10,padding:"5px 14px",borderRadius:2,border:`1px solid ${T.accent}`,background:"transparent",color:T.accent,cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase"}}>Ask AI {"\u2192"}</button></div></Card>
  ):results.map(item=>{const isOpen=expanded[item.id];return (
  <Card key={item.id} style={{marginBottom:6,padding:0,overflow:"hidden",cursor:"pointer"}}>
  <div onClick={()=>setExpanded(p=>({...p,[item.id]:!p[item.id]}))} style={{padding:"12px 16px",display:"flex",alignItems:"flex-start",gap:10}}>
  <Tag color={T.mono2}>{item.cat}</Tag>
  <div style={{flex:1}}><div style={{fontWeight:500,fontSize:13,color:T.text,lineHeight:1.4}}>{item.q}</div>{!isOpen&&<div style={{fontSize:11,color:T.text3,marginTop:3}}>{item.a.substring(0,80)}...</div>}</div>
  <Mono size={10} color={T.text3}>{isOpen?"\u25B2":"\u25BC"}</Mono></div>
  {isOpen&&(<div style={{padding:"0 16px 14px",borderTop:`1px solid ${T.border}`,paddingTop:10}}>
  <div style={{fontSize:12,color:T.text2,lineHeight:1.65,marginBottom:10}}>{item.a}</div>
  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{item.tags.map(t=><button key={t} onClick={e=>{e.stopPropagation();setQuery(t);setExpanded({});}} style={{...sf.mono,fontSize:9,padding:"1px 6px",background:T.bg,color:T.text3,borderRadius:2,border:`1px solid ${T.border}`,cursor:"pointer"}}>#{t}</button>)}</div>
  </div>)}</Card>);})}
  </>)}

  {tab==="ai"&&(
  <Card style={{overflow:"hidden",padding:0}}>
  <div style={{padding:"10px 16px",borderBottom:`1px solid ${T.border}`}}>
  <Eyebrow color={T.text3}>AI Assistant</Eyebrow>
  <div style={{fontSize:12,color:T.text3,marginTop:2}}>Questions not in the library</div></div>
  <div ref={msgRef} style={{height:360,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:8}}>
  {!aiMsgs.length&&<div style={{color:T.text3,fontSize:12,textAlign:"center",marginTop:30}}>Ask about Claude adoption, objections, or how to respond.</div>}
  {aiMsgs.map((m,i)=>(
  <div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"85%"}}>
  <div style={{padding:"8px 10px",borderRadius:3,fontSize:12,lineHeight:1.6,background:m.role==="user"?T.accent+"12":T.surface,border:`1px solid ${m.role==="user"?T.accent+"33":m.error?T.red+"44":T.border}`,color:m.error?T.red:T.text}}>{m.content}</div></div>))}
  {loading&&<div style={{alignSelf:"flex-start",padding:"8px 10px",borderRadius:3,fontSize:12,background:T.surface,border:`1px solid ${T.border}`,color:T.text3}}>{"\u25CC"} thinking...</div>}
  </div>
  <div style={{padding:"10px 14px",borderTop:`1px solid ${T.border}`,display:"flex",gap:8}}>
  <input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")askAI();}} placeholder="Ask about any objection..." style={{flex:1,padding:"7px 10px",borderRadius:2,border:`1px solid ${T.borderHi}`,...sf.sans,fontSize:12,background:T.bg,color:T.text,outline:"none"}}/>
  <button onClick={askAI} disabled={!aiInput.trim()||loading} style={{padding:"7px 14px",borderRadius:2,border:`1px solid ${!aiInput.trim()||loading?T.border:T.accent}`,background:"transparent",color:!aiInput.trim()||loading?T.text3:T.accent,...sf.mono,fontSize:10,cursor:!aiInput.trim()||loading?"not-allowed":"pointer"}}>{"\u2192"}</button>
  </div></Card>)}
  </main></div></>);
}
