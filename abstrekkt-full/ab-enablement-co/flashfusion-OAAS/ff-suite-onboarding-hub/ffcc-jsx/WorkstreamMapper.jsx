import { useState, useRef, useEffect } from "react";

const WS = {
  epb:    { label: "EPB Platform",     status: "Launch ready",   color: "#10B981" },
  invelo: { label: "InVelo",           status: "Repositioning",  color: "#F59E0B" },
  skills: { label: "Skills Library",   status: "Phase 1 active", color: "#7C3AED" },
  repo:   { label: "Repo / Knowledge", status: "Pre-execution",  color: "#6B7280" },
  humanx: { label: "HumanX Deck",      status: "Ready",          color: "#10B981" },
  intos:  { label: "INT OS / Dotty",   status: "In dev",         color: "#3B82F6" },
};

const PM = {
  P0: { label: "P0 — This week",   dot: "#EF4444", bg: "#7F1D1D22", bd: "#EF444455", tx: "#FCA5A5" },
  P1: { label: "P1 — This sprint", dot: "#F59E0B", bg: "#78350F22", bd: "#F59E0B55", tx: "#FCD34D" },
  P2: { label: "P2 — Next sprint", dot: "#3B82F6", bg: "#1E3A5F22", bd: "#3B82F655", tx: "#93C5FD" },
  P3: { label: "P3 — Backlog",     dot: "#6B7280", bg: "#1F293722", bd: "#6B728055", tx: "#D1D5DB" },
};

const TAG_COLOR = {
  config:       { bg: "#064E3B", c: "#6EE7B7" },
  reliability:  { bg: "#064E3B", c: "#6EE7B7" },
  velocity:     { bg: "#064E3B", c: "#6EE7B7" },
  efficiency:   { bg: "#064E3B", c: "#6EE7B7" },
  architecture: { bg: "#2D1B69", c: "#C4B5FD" },
  quality:      { bg: "#2D1B69", c: "#C4B5FD" },
  demo:         { bg: "#2D1B69", c: "#C4B5FD" },
  "sales tool": { bg: "#78350F", c: "#FCD34D" },
  positioning:  { bg: "#1E3A5F", c: "#93C5FD" },
  product:      { bg: "#1E3A5F", c: "#93C5FD" },
  presentation: { bg: "#1E3A5F", c: "#93C5FD" },
  gating:       { bg: "#7F1D1D", c: "#FCA5A5" },
  alignment:    { bg: "#1F2937", c: "#D1D5DB" },
};

const ITEMS = [
  { id:"e1", p:"P0", ws:"epb",   tag:"config",       ef:"1 day",
    cap:"Effort controls (GA) — cost router",
    bk:"Hardcoded model strings on every EPB API call. No routing by complexity. Paying Opus rates on permission checks.",
    ub:"medium Opus 4.6 = Sonnet 4.5 quality at 76% fewer tokens. Four tiers, no beta header.",
    ns:"Replace hardcoded strings: low for permission checks, medium for persona tasks, high for complex reasoning, max for security audits." },
  { id:"i1", p:"P0", ws:"invelo",tag:"positioning",  ef:"1 day",
    cap:"Week 4 deliverable → org-wide skills deployment",
    bk:"Week 4 handoff is a governance policy doc. Not tangible enough for $25K. Fails the why-not-DIY test.",
    ub:"Live org-wide skills deployment as the handoff. Verifiable, client-owned, Anthropic-native.",
    ns:"Rewrite InVelo scope doc: replace Governance Policy with Org-Wide Skills Library, deployed, tested, client-administered. Update battle cards." },
  { id:"e2", p:"P1", ws:"epb",   tag:"architecture", ef:"3–5 days",
    cap:"Skills API as EPB control plane",
    bk:"Custom deployment scripts for 72 personas. Not Anthropic-native. Hard to version or audit.",
    ub:"/v1/skills endpoints for programmatic deploy, version, and manage all 72 personas as skill bundles.",
    ns:"Implement Skills API wrapper as EPB control plane. Replaces all custom deployment scripts. Do before GA launch." },
  { id:"e3", p:"P1", ws:"epb",   tag:"config",       ef:"0.5 days",
    cap:"Adaptive thinking (GA) — drop budget_tokens",
    bk:"Fixed reasoning depth regardless of complexity. Deprecated budget_tokens in some EPB configs breaks on Opus 4.6.",
    ub:"Claude allocates thinking dynamically. Fast on simple tasks, deep on complex. Zero per-request config.",
    ns:"Update all EPB API calls to thinking type adaptive. Audit codebase for budget_tokens references and remove." },
  { id:"e4", p:"P1", ws:"epb",   tag:"reliability",  ef:"1 day",
    cap:"Context compaction (beta) — agent sessions",
    bk:"Finance/Legal persona approval chains hit context limits mid-session. State loss forces restarts.",
    ub:"Effectively infinite sessions via server-side summarization. Older context compressed not dropped.",
    ns:"Enable compaction for EPB agent sessions. Trigger at 50K tokens. Priority: Finance VP and Legal personas." },
  { id:"i2", p:"P1", ws:"invelo",tag:"sales tool",   ef:"2–3 days",
    cap:"Effort controls → CFO cost modeling tool",
    bk:"No credible cost prediction before clients sign. CFOs blocking budget approvals.",
    ub:"Effort tiers give exact cost-per-task modeling. Builds a defensible CFO business case.",
    ns:"Build React artifact: input team size and task distribution, output monthly AI cost at low/medium/high effort tiers. Ship before HumanX." },
  { id:"r1", p:"P1", ws:"repo",  tag:"gating",       ef:"Request today",
    cap:"1M token context (beta) — gating item",
    bk:"Repo analysis requires chunking and multiple passes. Cross-chunk context loss means missed semantic patterns.",
    ub:"Ingest 5 to 10 full repos in a single prompt. Real semantic analysis not just file listing.",
    ns:"Request 1M context beta access today. Submit before starting the 20-30 repo POC so it is available at scale." },
  { id:"i3", p:"P1", ws:"invelo",tag:"positioning",  ef:"0.5 days",
    cap:"Agent skills open standard — anti-lock-in pitch",
    bk:"INT positioned as proprietary vendor. Procurement invoking lock-in concerns during evaluation.",
    ub:"Skills are an open standard, portable across Claude, ChatGPT, Cursor. Clients own their skills.",
    ns:"Update InVelo pitch: you own the capability not a dependency on us. Revise battle cards." },
  { id:"e5", p:"P2", ws:"epb",   tag:"quality",      ef:"1 day",
    cap:"128K output — persona documentation regen",
    bk:"72 persona guides required multi-call stitching at 64K. Stitching introduces gaps.",
    ub:"Complete documents in a single response. Eliminates all stitching logic.",
    ns:"Regenerate all 72 persona implementation guides as single-pass 128K outputs during next maintenance window." },
  { id:"h1", p:"P2", ws:"humanx",tag:"presentation", ef:"0.5 days",
    cap:"Deck refresh — model strings and two new slides",
    bk:"Deck references outdated model strings. Missing Agent Skills and Effort Controls ROI as differentiation hooks.",
    ub:"Two new slides strengthen the story for Dave, Jackie, clients, and HumanX audience.",
    ns:"Update model strings to claude-opus-4-6. Add portable org skills slide and effort controls cost routing ROI slide." },
  { id:"s1", p:"P2", ws:"skills",tag:"velocity",     ef:"Spike: 2–5x tokens",
    cap:"Agent teams (research preview) — parallel skill build",
    bk:"259-skill build is sequential. Estimated 10-14 sessions at current pace.",
    ub:"Parallel agent instances reduce to 2-3 sessions. Lead assigns batches; subagents build and validate.",
    ns:"Enable CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1. Run cost spike on 5-10 skills first. 2-5x token cost, budget this." },
  { id:"r2", p:"P2", ws:"repo",  tag:"reliability",  ef:"0.5 days",
    cap:"Context compaction — multi-day Cowork sessions",
    bk:"Cowork sessions lose context between runs. Day 1 decisions gone by Day 3.",
    ub:"Org context persists across multi-day sessions. Day 5 still knows what Day 1 decided.",
    ns:"Set compaction threshold at 50K tokens for Cowork sessions. Start 20-30 repo POC with compaction enabled." },
  { id:"i4", p:"P2", ws:"invelo",tag:"efficiency",   ef:"1 day",
    cap:"Partner skills directory — integration shortcut",
    bk:"Building Notion/Canva/Figma/Atlassian integrations from scratch per engagement.",
    ub:"Pre-built partner skills plug into most client tool stacks. About 60% reduction in per-engagement build time.",
    ns:"Audit 3 most common client tool stacks. Map available partner skills to each InVelo tier." },
  { id:"i5", p:"P2", ws:"invelo",tag:"product",      ef:"Pilot first",
    cap:"Cowork for non-dev clients",
    bk:"No solution for non-technical client staff. Every ops workflow requires custom dev.",
    ub:"Cowork gives non-developers autonomous file and task execution without dev headcount.",
    ns:"Pilot Cowork on one internal INT workflow first. If validated, add to InVelo Week 3." },
  { id:"r3", p:"P3", ws:"repo",  tag:"velocity",     ef:"2–3 day design spike",
    cap:"Agent teams — parallel repo analysis",
    bk:"Sequential repo analysis. 500 repos is months at current linear pace.",
    ub:"Multiple agents process repo batches simultaneously. Estimated 5-10x throughput.",
    ns:"After 1M context beta confirmed: design repo agent team. Lead assigns batches, subagents process, lead synthesizes." },
  { id:"e6", p:"P3", ws:"epb",   tag:"demo",         ef:"3–5 days",
    cap:"Org-wide skills admin UI — sales demo",
    bk:"Enterprise demo relies on architecture diagrams. No live admin flow for persona deployment.",
    ub:"Show enterprise admin deploying persona skills to 500+ employees from one screen.",
    ns:"Build Org Skills admin screen: select personas, assign by dept, publish, confirm. Use for Dave/Jackie meeting." },
  { id:"o1", p:"P3", ws:"intos", tag:"alignment",    ef:"1 day prep",
    cap:"INT OS / Dotty — skills and effort capability map",
    bk:"INT OS in dev with Dave/Jackie. New capabilities not mapped to INT OS architecture.",
    ub:"Agent Skills Open Standard and Effort Controls are natural building blocks for Dotty.",
    ns:"When Dave/Jackie meeting rescheduled: bring 1-page capability map showing how Skills API and Effort Controls slot into INT OS." },
];

const ASSISTANT_SYS = "You are Kyle Rosebrook's AI workstream assistant for INT Inc. Active workstreams: EPB Platform (launch ready, 72 personas, Skills 2.0, ReAct/HITL), InVelo (AI consulting $5K-$250K, Week 4 needs rewrite to org-wide skills deployment), Skills Library (33+259 to build), Repo/Knowledge (500+ repos, gating on 1M context beta), HumanX Deck (model string updates + 2 slides), INT OS/Dotty (Dave/Jackie, rescheduled meeting is most important blocker). Platform updates: Effort Controls GA, Adaptive Thinking GA, Skills API GA, Context Compaction Beta, 1M Context Beta, 128K Output, Agent Teams Research Preview. Answer directly under 200 words.";

const PROMPT_SYS = "You generate production-ready context-engineered prompts for INT Inc. AI platform team. Stack: TypeScript strict, React 18/19, Next.js App Router, Supabase RLS, n8n, Vercel, Anthropic API. Platform: EPB with 72 persona skills, Skills 2.0, ReAct/HITL, OpenTelemetry. Services: InVelo time-boxed consulting, 330+ skills library, INT OS/Dotty. Capabilities: Effort Controls (low/medium/high/max), Adaptive Thinking (type:adaptive replaces budget_tokens), Skills API (/v1/skills), Context Compaction (beta), Agent Teams (Claude Code, CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1, 2-5x cost). Security: no client-side API keys, RLS enforced, input validation, rate limiting, audit logging. Generate ONE context-engineered prompt for the given capability and next step. Include: role, INT stack context, precise task with API/file references, security constraints, exact output spec. Rules: self-contained, under 400 words, TypeScript strict for code, include error handling. Return ONLY the prompt text starting with You are or Act as.";

const T = {
  bg0:"#0A0A0F", bg1:"#0F0F18", bg2:"#12121A", bg3:"#1A1A26",
  border:"#1E1E2E", border2:"#2A2A3A",
  text:"#F0F0F8", muted:"#9CA3AF", dim:"#6B7280",
};

const s = {
  root:{ fontFamily:"'Inter',system-ui,sans-serif", background:T.bg0, minHeight:"100vh", color:T.text, fontSize:14 },
  header:{ background:T.bg2, borderBottom:`1px solid ${T.border}`, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 },
  statsBar:{ background:T.bg1, borderBottom:`1px solid ${T.border}`, padding:"8px 16px", display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" },
  body:{ padding:14 },
  navBtn:{ padding:"5px 12px", borderRadius:6, border:`1px solid ${T.border2}`, background:"transparent", color:T.muted, cursor:"pointer", fontSize:12, fontWeight:500, fontFamily:"inherit" },
  genBtn:{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:6, border:`1px solid ${T.border2}`, background:"transparent", color:T.muted, cursor:"pointer", fontSize:11, fontWeight:500, fontFamily:"inherit" },
  copyBtn:{ display:"inline-flex", alignItems:"center", gap:4, padding:"4px 8px", borderRadius:5, border:`1px solid ${T.border2}`, background:"transparent", color:T.dim, cursor:"pointer", fontSize:11, fontFamily:"inherit" },
  filterBtn:{ padding:"4px 9px", borderRadius:5, border:`1px solid ${T.border2}`, background:"transparent", color:T.muted, cursor:"pointer", fontSize:11, fontWeight:500, fontFamily:"inherit" },
  input:{ flex:1, background:T.bg2, border:`1px solid ${T.border2}`, borderRadius:7, padding:"9px 12px", color:T.text, fontSize:13, outline:"none", fontFamily:"inherit" },
  sendBtn:{ background:"#4C1D95", color:"#C4B5FD", border:"none", borderRadius:7, padding:"9px 16px", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit" },
  promptBox:{ fontSize:11.5, lineHeight:1.55, padding:"8px 10px", borderRadius:6, background:T.bg1, border:`1px solid ${T.border2}`, color:T.text, fontFamily:"'SF Mono','Fira Code',monospace", whiteSpace:"pre-wrap", wordBreak:"break-word", maxHeight:180, overflowY:"auto" },
  errBox:{ fontSize:11, lineHeight:1.5, padding:"7px 9px", borderRadius:6, background:"#7F1D1D22", border:"1px solid #EF444455", color:"#FCA5A5", fontFamily:"monospace", whiteSpace:"pre-wrap", wordBreak:"break-word" },
};

async function callClaude(system, userMsg) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system, messages:[{ role:"user", content:userMsg }] }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${data?.error?.message || JSON.stringify(data)}`);
  const text = data.content?.find(b => b.type === "text")?.text;
  if (!text) throw new Error("No text block in response");
  return text;
}

function TagPill({ tag }) {
  const tc = TAG_COLOR[tag] || { bg:"#1F2937", c:"#D1D5DB" };
  return <span style={{ fontSize:10, fontWeight:500, padding:"2px 6px", borderRadius:4, background:tc.bg, color:tc.c }}>{tag}</span>;
}

function Card({ item, showWs, prompts, errors, generating, onGen }) {
  const [open, setOpen] = useState(false);
  const pm = PM[item.p];
  const pt = prompts[item.id];
  const er = errors[item.id];
  const g = generating[item.id];

  const copyText = async (text) => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  return (
    <div onClick={() => setOpen(o => !o)} style={{ borderRadius:7, border:`1px solid ${open ? pm.bd : T.border2}`, cursor:"pointer", overflow:"hidden", background:open ? T.bg3 : T.bg1, transition:"border-color .12s,background .12s" }}>
      <div style={{ padding:"9px 10px", display:"flex", alignItems:"flex-start", gap:7 }}>
        <span style={{ width:7, height:7, borderRadius:"50%", background:pm.dot, flexShrink:0, marginTop:5, display:"inline-block" }} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12, fontWeight:600, color:T.text, lineHeight:1.4 }}>{item.cap}</div>
          <div style={{ display:"flex", gap:5, marginTop:4, flexWrap:"wrap", alignItems:"center" }}>
            {showWs && <span style={{ fontSize:10, color:T.muted }}>{WS[item.ws].label}</span>}
            <TagPill tag={item.tag} />
            <span style={{ fontSize:10, color:T.dim }}>⏱ {item.ef}</span>
            {pt && <span style={{ fontSize:10, color:"#10B981" }}>✓ prompt</span>}
            {er && <span style={{ fontSize:10, color:"#EF4444" }}>⚠ error</span>}
          </div>
        </div>
        <span style={{ fontSize:10, color:T.dim, flexShrink:0, transform:open?"rotate(90deg)":"rotate(0deg)", transition:"transform .12s" }}>▶</span>
      </div>

      {open && (
        <div onClick={e => e.stopPropagation()} style={{ padding:"0 10px 10px", display:"flex", flexDirection:"column", gap:6 }}>
          {[["Was blocked", item.bk, "#EF4444"], ["Now unblocked", item.ub, "#10B981"], ["Next step", item.ns, "#3B82F6"]].map(([lbl, txt, c]) => (
            <div key={lbl}>
              <div style={{ fontSize:10, fontWeight:700, color:T.dim, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:3 }}>{lbl}</div>
              <div style={{ fontSize:12, lineHeight:1.5, padding:"6px 8px", borderRadius:6, background:c+"18", border:`1px solid ${c}33`, color:c+"EE" }}>{txt}</div>
            </div>
          ))}

          <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:8, marginTop:2 }}>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:6 }}>
              <button style={{ ...s.genBtn, ...(g ? { opacity:.5, cursor:"not-allowed" } : {}) }} disabled={!!g} onClick={() => onGen(item.id)}>
                {g ? "⏳ Generating…" : pt ? "↺ Regenerate" : "✦ Generate prompt"}
              </button>
              {pt && <button style={s.copyBtn} onClick={() => copyText(pt)}>⎘ Copy</button>}
            </div>
            {g && <div style={{ fontSize:11, color:T.muted, fontStyle:"italic" }}>Generating context-engineered prompt…</div>}
            {er && !g && <div style={s.errBox}><b>Error:</b> {er}</div>}
            {pt && !g && <div style={s.promptBox}>{pt}</div>}
            {!pt && !g && !er && <div style={{ fontSize:11, color:T.dim, fontStyle:"italic" }}>Not yet generated</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function BoardView({ prompts, errors, generating, onGen }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:10 }}>
      {["P0","P1","P2","P3"].map(p => {
        const pm = PM[p];
        const items = ITEMS.filter(i => i.p === p);
        return (
          <div key={p} style={{ background:T.bg2, borderRadius:9, border:`1px solid ${pm.bd}`, overflow:"hidden" }}>
            <div style={{ padding:"9px 12px", borderBottom:`1px solid ${pm.bd}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:pm.bg }}>
              <span style={{ fontSize:11, fontWeight:600, color:pm.tx }}>{pm.label}</span>
              <span style={{ fontSize:10, color:pm.tx, padding:"1px 7px", borderRadius:10, border:`1px solid ${pm.bd}` }}>{items.length}</span>
            </div>
            <div style={{ padding:8, display:"flex", flexDirection:"column", gap:6 }}>
              {items.map(i => <Card key={i.id} item={i} showWs prompts={prompts} errors={errors} generating={generating} onGen={onGen} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WorkstreamsView({ wsFilter, setWsFilter, prompts, errors, generating, onGen }) {
  const ids = Object.keys(WS).filter(id => wsFilter === "all" || wsFilter === id);
  return (
    <>
      <div style={{ display:"flex", gap:5, marginBottom:10, flexWrap:"wrap" }}>
        {[["all","All"], ...Object.entries(WS).map(([id,w]) => [id, w.label])].map(([id,lbl]) => (
          <button key={id} style={{ ...s.filterBtn, ...(wsFilter === id ? { borderColor:"#7C3AED", background:"#2D1B69", color:"#C4B5FD" } : {}) }} onClick={() => setWsFilter(id)}>{lbl}</button>
        ))}
      </div>
      {ids.map(id => {
        const w = WS[id];
        const items = ITEMS.filter(i => i.ws === id);
        const p0 = items.filter(i => i.p === "P0").length;
        const p1 = items.filter(i => i.p === "P1").length;
        return (
          <div key={id} style={{ background:T.bg2, borderRadius:9, border:`1px solid ${T.border}`, overflow:"hidden", marginBottom:10 }}>
            <div style={{ padding:"10px 14px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              <span style={{ fontSize:13, fontWeight:600 }}>{w.label}</span>
              <span style={{ fontSize:10, color:w.color, background:w.color+"22", border:`1px solid ${w.color}44`, borderRadius:10, padding:"2px 8px" }}>{w.status}</span>
              <div style={{ marginLeft:"auto", display:"flex", gap:5 }}>
                {p0 > 0 && <span style={{ fontSize:10, color:"#EF4444", background:"#7F1D1D44", border:"1px solid #EF444433", borderRadius:4, padding:"1px 6px" }}>P0 ×{p0}</span>}
                {p1 > 0 && <span style={{ fontSize:10, color:"#F59E0B", background:"#78350F44", border:"1px solid #F59E0B33", borderRadius:4, padding:"1px 6px" }}>P1 ×{p1}</span>}
                <span style={{ fontSize:11, color:T.dim }}>{items.length} items</span>
              </div>
            </div>
            <div style={{ padding:8, display:"flex", flexDirection:"column", gap:5 }}>
              {["P0","P1","P2","P3"].flatMap(p => items.filter(i => i.p === p).map(i => <Card key={i.id} item={i} prompts={prompts} errors={errors} generating={generating} onGen={onGen} />))}
            </div>
          </div>
        );
      })}
    </>
  );
}

function PromptsView({ prompts, errors, generating, onGen, onGenAll, genAllRunning, genAllDone, genAllTotal }) {
  const done = Object.keys(prompts).length;
  const total = ITEMS.length;
  const pct = Math.round(done / total * 100);
  const rem = total - done;

  const copyText = async (text) => { try { await navigator.clipboard.writeText(text); } catch {} };

  return (
    <>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, padding:"10px 12px", background:T.bg2, borderRadius:8, border:`1px solid ${T.border}`, flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:140 }}>
          <div style={{ fontSize:11, color:T.muted, marginBottom:5 }}>
            {done} of {total} prompts generated{genAllRunning ? ` — generating ${genAllDone}/${genAllTotal}…` : ""}
          </div>
          <div style={{ height:4, background:T.bg0, borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:4, background:"#10B981", borderRadius:2, width:`${pct}%`, transition:"width .4s" }} />
          </div>
        </div>
        <button style={{ ...s.genBtn, padding:"7px 14px", fontSize:12, ...(genAllRunning ? { opacity:.5, cursor:"not-allowed" } : {}) }} disabled={genAllRunning} onClick={onGenAll}>
          {genAllRunning ? `⏳ Generating ${genAllDone}/${genAllTotal}…` : rem > 0 ? `✦ Generate remaining ${rem}` : "↺ Regenerate all"}
        </button>
      </div>

      {["P0","P1","P2","P3"].map(p => {
        const pm = PM[p];
        const items = ITEMS.filter(i => i.p === p);
        const pdone = items.filter(i => prompts[i.id]).length;
        return (
          <div key={p} style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:600, color:pm.tx, background:pm.bg, borderRadius:6, display:"inline-flex", alignItems:"center", gap:6, padding:"4px 10px", marginBottom:8 }}>
              {pm.label} <span style={{ opacity:.65 }}>{pdone}/{items.length}</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {items.map(item => {
                const pt = prompts[item.id];
                const er = errors[item.id];
                const g = generating[item.id];
                return (
                  <div key={item.id} style={{ background:T.bg2, borderRadius:7, border:`1px solid ${pt ? T.border2 : er ? "#EF444433" : T.border}`, padding:"10px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:pt||er||g ? 8 : 0 }}>
                      <span style={{ width:7, height:7, borderRadius:"50%", background:pm.dot, flexShrink:0, display:"inline-block" }} />
                      <span style={{ fontSize:12, fontWeight:500, flex:1, minWidth:0 }}>{item.cap}</span>
                      <span style={{ fontSize:10, color:T.dim }}>{WS[item.ws].label}</span>
                      <button style={{ ...s.genBtn, fontSize:10, padding:"3px 8px", ...(g ? { opacity:.5, cursor:"not-allowed" } : {}) }} disabled={!!g} onClick={() => onGen(item.id)}>
                        {g ? "⏳" : pt ? "↺" : "✦"} {g ? "Generating…" : pt ? "Regen" : "Generate"}
                      </button>
                      {pt && <button style={{ ...s.copyBtn, fontSize:10 }} onClick={() => copyText(pt)}>⎘ Copy</button>}
                    </div>
                    {g && <div style={{ fontSize:11, color:T.muted, fontStyle:"italic" }}>Generating…</div>}
                    {er && !g && <div style={s.errBox}>{er}</div>}
                    {pt && !g && <div style={s.promptBox}>{pt}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

function AskView({ msgs, loading, inputVal, setInputVal, onSend }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, loading]);

  const SUGS = ["Fastest win right now?","What unblocks InVelo sales?","Biggest P1 cost impact?","What to ship before HumanX?","Agent Teams token cost breakdown?"];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 180px)", maxWidth:660, margin:"0 auto" }}>
      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:8, padding:"4px 0 12px" }}>
        {msgs.length === 0 ? (
          <div style={{ textAlign:"center", padding:"40px 16px" }}>
            <div style={{ fontSize:28, marginBottom:10 }}>✦</div>
            <div style={{ fontSize:13, color:T.muted, marginBottom:18 }}>Ask anything about workstreams, capabilities, or next steps</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center" }}>
              {SUGS.map(s => <button key={s} style={{ ...s, padding:"5px 12px", borderRadius:20, border:`1px solid ${T.border2}`, background:"transparent", color:T.muted, cursor:"pointer", fontSize:11, fontFamily:"inherit" }} onClick={() => setInputVal(s)}>{s}</button>)}
            </div>
          </div>
        ) : msgs.map((m, i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            <div style={{ maxWidth:"82%", padding:"9px 12px", fontSize:13, lineHeight:1.65, whiteSpace:"pre-wrap", borderRadius:m.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px", background:m.role==="user"?"#2D1B69":"#1A1A26", color:m.role==="user"?"#C4B5FD":T.text }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", justifyContent:"flex-start" }}>
            <div style={{ padding:"9px 12px", borderRadius:"12px 12px 12px 4px", background:"#1A1A26", color:T.muted, fontSize:13 }}>Thinking…</div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div style={{ display:"flex", gap:8, paddingTop:10, borderTop:`1px solid ${T.border}` }}>
        <input value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key==="Enter" && !e.shiftKey && onSend()} placeholder="Ask about workstreams, priorities, next steps…" style={s.input} />
        <button onClick={onSend} disabled={!inputVal.trim() || loading} style={{ ...s.sendBtn, opacity:(!inputVal.trim()||loading)?0.4:1, cursor:(!inputVal.trim()||loading)?"not-allowed":"pointer" }}>Send</button>
      </div>
    </div>
  );
}

export default function WorkstreamMapper() {
  const [view, setView] = useState("board");
  const [wsFilter, setWsFilter] = useState("all");
  const [prompts, setPrompts] = useState({});
  const [errors, setErrors] = useState({});
  const [generating, setGenerating] = useState({});
  const [genAllRunning, setGenAllRunning] = useState(false);
  const [genAllDone, setGenAllDone] = useState(0);
  const [genAllTotal, setGenAllTotal] = useState(0);
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const genPrompt = async (id) => {
    if (generating[id]) return;
    const item = ITEMS.find(i => i.id === id);
    if (!item) return;
    setGenerating(g => ({ ...g, [id]: true }));
    setErrors(e => { const n = {...e}; delete n[id]; return n; });
    try {
      const text = await callClaude(PROMPT_SYS,
        `Capability: ${item.cap}\nWorkstream: ${WS[item.ws].label} (${item.p})\nTag: ${item.tag}\nEffort: ${item.ef}\nBlocked: ${item.bk}\nUnblocked: ${item.ub}\nNext step: ${item.ns}`
      );
      setPrompts(p => ({ ...p, [id]: text }));
    } catch (err) {
      setErrors(e => ({ ...e, [id]: err.message }));
    }
    setGenerating(g => { const n = {...g}; delete n[id]; return n; });
  };

  const genAll = async () => {
    if (genAllRunning) return;
    const targets = ITEMS.filter(i => !prompts[i.id]);
    if (!targets.length) {
      setPrompts({});
      return;
    }
    setGenAllRunning(true);
    setGenAllDone(0);
    setGenAllTotal(targets.length);
    for (let i = 0; i < targets.length; i++) {
      await genPrompt(targets[i].id);
      setGenAllDone(i + 1);
    }
    setGenAllRunning(false);
  };

  const sendMsg = async () => {
    if (!inputVal.trim() || loading) return;
    const txt = inputVal.trim();
    setInputVal("");
    const newMsgs = [...msgs, { role:"user", content:txt }];
    setMsgs(newMsgs);
    setLoading(true);
    try {
      const text = await callClaude(ASSISTANT_SYS, newMsgs.map(m => `${m.role}: ${m.content}`).join("\n\n"));
      setMsgs(m => [...m, { role:"assistant", content:text }]);
    } catch (err) {
      setMsgs(m => [...m, { role:"assistant", content:`Error: ${err.message}` }]);
    }
    setLoading(false);
  };

  const pdone = Object.keys(prompts).length;
  const p0 = ITEMS.filter(i => i.p==="P0").length;
  const p1 = ITEMS.filter(i => i.p==="P1").length;
  const p2 = ITEMS.filter(i => i.p==="P2").length;
  const p3 = ITEMS.filter(i => i.p==="P3").length;

  const navStyle = (v) => ({ ...s.navBtn, ...(view===v ? { borderColor:"#7C3AED", background:"#2D1B69", color:"#C4B5FD" } : {}) });

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div>
          <div style={{ fontSize:15, fontWeight:700, letterSpacing:"-0.3px" }}>Claude Platform Update Mapper</div>
          <div style={{ fontSize:11, color:T.dim, marginTop:2 }}>Feb 2026 · INT Inc. · {ITEMS.length} capabilities · {Object.keys(WS).length} workstreams{pdone > 0 ? ` · ${pdone} prompts` : ""}</div>
        </div>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          <button style={navStyle("board")} onClick={() => setView("board")}>Priority board</button>
          <button style={navStyle("ws")} onClick={() => setView("ws")}>Workstreams</button>
          <button style={navStyle("prompts")} onClick={() => setView("prompts")}>{pdone > 0 ? `Prompts (${pdone})` : "Prompts"}</button>
          <button style={navStyle("ask")} onClick={() => setView("ask")}>Ask Claude ✦</button>
        </div>
      </div>

      <div style={s.statsBar}>
        {[[p0,"P0",PM.P0.dot],[p1,"P1",PM.P1.dot],[p2,"P2",PM.P2.dot],[p3,"P3",PM.P3.dot]].map(([n,lbl,c]) => (
          <div key={lbl} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ fontSize:18, fontWeight:700, color:c }}>{n}</span>
            <span style={{ fontSize:10, color:T.dim }}>{lbl}</span>
          </div>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", gap:10 }}>
          {Object.entries(WS).map(([id, w]) => {
            const hot = ITEMS.filter(i => i.ws===id && (i.p==="P0"||i.p==="P1")).length;
            return <span key={id} style={{ fontSize:11, color:T.dim }}>{w.label.split(" ")[0]} <span style={{ color:hot>0?"#F59E0B":T.dim, fontWeight:hot>0?600:400 }}>{hot}</span></span>;
          })}
        </div>
      </div>

      <div style={s.body}>
        {view === "board"   && <BoardView prompts={prompts} errors={errors} generating={generating} onGen={genPrompt} />}
        {view === "ws"      && <WorkstreamsView wsFilter={wsFilter} setWsFilter={setWsFilter} prompts={prompts} errors={errors} generating={generating} onGen={genPrompt} />}
        {view === "prompts" && <PromptsView prompts={prompts} errors={errors} generating={generating} onGen={genPrompt} onGenAll={genAll} genAllRunning={genAllRunning} genAllDone={genAllDone} genAllTotal={genAllTotal} />}
        {view === "ask"     && <AskView msgs={msgs} loading={loading} inputVal={inputVal} setInputVal={setInputVal} onSend={sendMsg} />}
      </div>
    </div>
  );
}
