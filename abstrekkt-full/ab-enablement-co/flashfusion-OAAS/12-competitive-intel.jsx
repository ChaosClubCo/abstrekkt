import { useState } from "react";
const T={bg:"#0c0c0b",sf:"#111110",c:"#181815",b:"#232320",h:"#303030",a:"#d4893a",t:"#ddd8ce",t2:"#807c74",t3:"#3a3835",g:"#5a9c5a",m:"#78afc8",r:"#c05050",tg:"#1e1e1a"};
const mn={fontFamily:"'IBM Plex Mono',monospace"};
const MODELS=[
  {name:"Claude Opus 4.7",vendor:"Anthropic",price:"$5/$25",ctx:"1M",swe:"82%+",features:["Extended thinking","MCP connectors","Projects + memory","1M context","SOC 2 Type II","No training on data (Team+)"],edge:"Highest SWE-bench score. Open MCP standard. Best for complex reasoning.",warn:"Opus-specific API breaking changes (budget_tokens removed, temperature returns 400)."},
  {name:"Claude Sonnet 4.6",vendor:"Anthropic",price:"$3/$15",ctx:"1M",swe:"~72%",features:["Best price/performance","1M context","Projects + memory","MCP connectors","SOC 2 Type II"],edge:"Primary workhorse. Best cost-to-quality ratio for enablement programs.",warn:""},
  {name:"Claude Haiku 4.5",vendor:"Anthropic",price:"$0.80/$4",ctx:"200K",swe:"~40%",features:["Fastest","Cheapest","200K context","Good for classification/routing"],edge:"Use for high-volume, low-complexity tasks. Triage, routing, simple transforms.",warn:"200K context vs 1M for Sonnet/Opus."},
  {name:"GPT-5.4",vendor:"OpenAI",price:"$15/$60",ctx:"128K",swe:"~57.7%",features:["Plugins (closed)","GPTs","DALL-E integration","128K context"],edge:"Brand recognition. Good image generation.",warn:"3-5x more expensive than Sonnet. Closed plugin system vs open MCP. Lower SWE-bench."},
  {name:"GPT-4o",vendor:"OpenAI",price:"$2.50/$10",ctx:"128K",swe:"~49%",features:["Multimodal","128K context","Real-time voice"],edge:"Good for multimodal use cases. Voice mode is strong.",warn:"128K context limit. No equivalent to Claude Projects."},
  {name:"Gemini 2.5 Pro",vendor:"Google",price:"$1.25/$10",ctx:"1M",swe:"~63.8%",features:["1M context","Grounding with Search","Code execution","Google ecosystem"],edge:"Cheap with large context. Best if deep in Google ecosystem.",warn:"Data handling policies less clear than Anthropic. No equivalent to Projects/Memory."},
];
const OBJECTIONS={
  "ChatGPT is free":{claude:"Claude Free exists too. Pro ($20/mo) unlocks Projects, Memory, Connectors. ChatGPT Plus ($20/mo) gives GPTs and plugins. The real difference: Claude Projects persist context across conversations. ChatGPT doesn't.",data:"Projects = persistent custom instructions + knowledge. ChatGPT custom GPTs don't retain conversation memory across sessions."},
  "GPT is more popular":{claude:"Market share ≠ best fit. Claude leads on SWE-bench (82%+ vs 57.7%), has 8x the context window (1M vs 128K), and costs 3-5x less at the frontier tier. For B2B enablement, privacy guarantees matter more than consumer popularity.",data:"SWE-bench verified May 2026. Pricing verified May 2026."},
  "Gemini is cheaper":{claude:"Gemini 2.5 Pro is cheaper per token. But: no Projects equivalent, no Memory system, no MCP connector ecosystem. For enablement programs where persistent context matters, the per-token savings don't offset the workflow cost.",data:"Gemini 2.5 Pro: $1.25/$10 per 1M tokens. Claude Sonnet 4.6: $3/$15. Delta: ~$1.75/$5 per 1M tokens."},
  "We already use Copilot":{claude:"Copilot is code-focused. Claude covers writing, research, operations, and code. For non-engineering teams (ops, marketing, sales, CS), Claude's general capabilities are broader. For engineering teams, Claude's SWE-bench scores are higher.",data:"GitHub Copilot: $19/mo individual, $39/mo business. Focuses on code completion. Claude Pro: $20/mo, covers all knowledge work."},
};
function Bar({pct,color,label,value}){return<div style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,color:T.t2}}>{label}</span><span style={{...mn,fontSize:10,color}}>{value}</span></div><div style={{height:6,background:T.tg,borderRadius:3}}><div style={{height:6,background:color,borderRadius:3,width:Math.min(100,pct)+"%",transition:"width .4s"}} /></div></div>;}
export default function CompetitiveIntel(){
  const [tab,setTab]=useState("compare");const [objSel,setObjSel]=useState("");
  const TABS=[["compare","Model Comparison"],["objections","Objection Responses"],["pricing","Pricing Matrix"]];
  return<><style>{"@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:wght@700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0c0c0b}::-webkit-scrollbar-thumb{background:#303030;border-radius:2px}"}</style>
  <div style={{minHeight:"100vh",background:T.bg,color:T.t,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13}}>
    <div style={{padding:"11px 18px 8px",borderBottom:`1px solid ${T.b}`}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>Competitive Intel</div>
      <div style={{...mn,fontSize:9,color:T.t2,marginTop:2}}>◆ Claude vs GPT vs Gemini · verified May 2026 · objection-ready</div>
    </div>
    <div style={{display:"flex",borderBottom:`1px solid ${T.b}`,padding:"0 18px"}}>{TABS.map(([id,l])=><button key={id} onClick={()=>setTab(id)} style={{background:"none",border:"none",borderBottom:`2px solid ${tab===id?T.a:"transparent"}`,cursor:"pointer",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,fontWeight:500,padding:"8px 11px",color:tab===id?T.t:T.t2,marginBottom:-1,transition:".12s"}}>{l}</button>)}</div>
    <div style={{padding:"14px 18px",maxWidth:900,overflowY:"auto"}}>
      {tab==="compare"&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
        {MODELS.filter(m=>["Claude Opus 4.7","GPT-5.4","Gemini 2.5 Pro"].includes(m.name)).map(m=>{const isC=m.vendor==="Anthropic";const col=isC?T.a:m.vendor==="OpenAI"?T.m:"#34d399";
        return<div key={m.name} style={{background:T.c,border:`1px solid ${isC?"rgba(212,137,58,.3)":T.b}`,borderRadius:3,padding:"12px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,color:col}}>{m.name}</div><div style={{...mn,fontSize:9,color:T.t3,marginTop:1}}>{m.vendor}</div></div>
            <div style={{...mn,fontSize:11,color:col}}>{m.price}</div>
          </div>
          <Bar label="SWE-bench" value={m.swe} pct={parseFloat(m.swe)} color={col} />
          <Bar label="Context" value={m.ctx} pct={m.ctx==="1M"?100:m.ctx==="200K"?20:12.8} color={col} />
          <div style={{...mn,fontSize:9,color:T.t3,marginBottom:5,marginTop:4}}>FEATURES</div>
          {m.features.map((f,i)=><div key={i} style={{display:"flex",gap:6,fontSize:11,color:T.t2,marginBottom:2}}><span style={{color:col}}>◆</span>{f}</div>)}
          <div style={{marginTop:8,borderTop:`1px solid ${T.b}`,paddingTop:6}}><div style={{...mn,fontSize:9,color:col,marginBottom:2}}>EDGE</div><div style={{fontSize:11,color:T.t2,lineHeight:1.5}}>{m.edge}</div></div>
          {m.warn&&<div style={{marginTop:6,fontSize:10,color:T.r}}>{m.warn}</div>}
        </div>;})}
      </div>}
      {tab==="objections"&&<div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
          {Object.keys(OBJECTIONS).map(k=><button key={k} onClick={()=>setObjSel(k===objSel?"":k)} style={{background:"transparent",border:`1px solid ${objSel===k?T.a:T.b}`,borderRadius:2,color:objSel===k?T.a:T.t2,...mn,fontSize:10,padding:"4px 10px",cursor:"pointer"}}>{k}</button>)}
        </div>
        {objSel&&OBJECTIONS[objSel]&&<div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:"14px 16px"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:8,color:T.a}}>"{objSel}"</div>
          <div style={{...mn,fontSize:9,color:T.g,marginBottom:3}}>RESPONSE</div>
          <div style={{fontSize:12,color:T.t2,lineHeight:1.65,marginBottom:10}}>{OBJECTIONS[objSel].claude}</div>
          <div style={{...mn,fontSize:9,color:T.m,marginBottom:3}}>SUPPORTING DATA</div>
          <div style={{fontSize:11,color:T.t3,lineHeight:1.55}}>{OBJECTIONS[objSel].data}</div>
          <div style={{marginTop:8}}><button onClick={()=>navigator.clipboard.writeText(`Objection: "${objSel}"\n\nResponse: ${OBJECTIONS[objSel].claude}\n\nData: ${OBJECTIONS[objSel].data}`).catch(()=>{})} style={{background:"transparent",border:`1px solid ${T.h}`,borderRadius:2,color:T.t2,...mn,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>Copy Response</button></div>
        </div>}
        {!objSel&&<div style={{color:T.t3,...mn,fontSize:11,textAlign:"center",padding:20}}>Select an objection above to see the response framework.</div>}
      </div>}
      {tab==="pricing"&&<div style={{background:T.c,border:`1px solid ${T.b}`,borderRadius:3,padding:0,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Model","Vendor","Input/1M","Output/1M","Context","SWE-bench"].map(h=><th key={h} style={{...mn,fontSize:9,textTransform:"uppercase",letterSpacing:"0.08em",color:T.t2,textAlign:"left",padding:"8px 10px",borderBottom:`1px solid ${T.b}`,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
          <tbody>{MODELS.map((m,i)=>{const isC=m.vendor==="Anthropic";return<tr key={i} style={{background:isC?T.sf:"transparent"}}>{[m.name,m.vendor,m.price.split("/")[0],m.price.split("/")[1]||"—",m.ctx,m.swe].map((v,j)=><td key={j} style={{padding:"7px 10px",borderBottom:`1px solid ${T.tg}`,fontSize:12,color:j===0?T.t:T.t2,fontWeight:j===0?500:400,...(j>=2?mn:{})}}>{v}</td>)}</tr>;})}</tbody>
        </table>
      </div>}
    </div>
  </div></>;
}
