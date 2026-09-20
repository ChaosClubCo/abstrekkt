import { useState, useRef } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:#0d1117}
  ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}

  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes glow{0%,100%{box-shadow:0 0 8px #6366f133}50%{box-shadow:0 0 20px #6366f166}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

  .btn:hover{filter:brightness(1.12);transform:translateY(-1px)}
  .btn:active{transform:translateY(0)}
  textarea:focus,input:focus{outline:none!important;border-color:#6366f155!important;box-shadow:0 0 0 2px #6366f111}
  .field-card:hover{border-color:#1e293b!important}
  .tag-pill:hover{background:#1e293b!important;color:#94a3b8!important}
  .nav-item:hover{background:#0d1525!important;color:#94a3b8!important}
  .nav-item.active{background:#0d1525;color:#6366f1!important;border-left:2px solid #6366f1}
  .remove-btn{opacity:0;transition:opacity .15s}
  .field-card:hover .remove-btn{opacity:1}
  .drop-zone{transition:all .2s}
  .drop-zone.drag-over{border-color:#6366f1!important;background:#6366f108!important}
`;

const SESSION_SEED = {
  meta: {
    sessionTitle: "Beta Tester Army — Build + Template System + Migration Strategy",
    sourceProject: "Flash-n-Frame / Claude Ecosystem Knowledge Project",
    destinationProject: "",
    date: new Date().toISOString().split("T")[0],
    version: "1.0",
  },
  built: [
    {
      id: "b1",
      name: "Beta Tester Army v1",
      type: "artifact",
      file: "beta-tester-army.jsx",
      description: "AI persona generator + parallel flow tester. Input: product name, description, flows, agent count. Output: parallel Claude API calls per persona, per-flow friction scores, verbatim quotes, drop-off points, sentiment, and synthesized intelligence brief.",
      status: "shipped",
    },
    {
      id: "b2",
      name: "Beta Tester Army v2",
      type: "artifact",
      file: "beta-tester-army-v2.jsx",
      description: "Extended v1 with full template system. 6 built-in templates (Web App, API/Dev Tool, Mobile, Landing Page, Physical Product, SOP/Process). Meta Template Generator (AI builds custom templates from a plain-English brief). Import/export as JSON. Template-aware persona generation and meta-prompt injection into test agents.",
      status: "shipped",
    },
  ],
  decisions: [
    {
      id: "d1",
      decision: "Export format is JSON, not plain prompt text",
      rationale: "JSON is importable back into the app, versionable in Git, feedable to the Flash-n-Frame API, and diffable. Flat prompt strings give none of that.",
      alternatives: "Plain prompt text (.txt or .md)",
    },
    {
      id: "d2",
      decision: "Templates contain: persona archetypes, pre-written flows, scoring rubric with weighted dimensions, and meta-prompt as a string field",
      rationale: "Meta-prompt as a field inside JSON = structured AND injectable. Rubric weights allow future scoring dimension calibration per product type.",
      alternatives: "Flat template with just flows and description",
    },
    {
      id: "d3",
      decision: "Path B (infrastructure-first) over Path A (template-first)",
      rationale: "Migration infrastructure compounds across every future project hop. The Agentic System template can be built in the next project using this capsule as grounding.",
      alternatives: "Path A: Ship Agentic template now, then migrate",
    },
    {
      id: "d4",
      decision: "Proactive + hybrid project knowledge surfacing",
      rationale: "Kyle wants project knowledge used without being asked when clearly relevant, silent otherwise. Pull from project docs when building agentic/Claude-specific content.",
      alternatives: "On-demand only",
    },
  ],
  openThreads: [
    {
      id: "t1",
      thread: "Agentic / Multi-Agent System template",
      priority: "high",
      context: "Highest-leverage next template. Should be grounded in project knowledge: orchestrator/worker patterns, HITL controls, context rot (95% threshold), T-Mux swim lanes for observability, zombie agent risk, adversarial researcher/fact-checker pairing. Personas: Skeptical Enterprise Architect, Vibe Coder Who Broke Prod, Security-First DevOps Lead, New Renaissance Developer, Budget-Conscious CTO.",
      nextAction: "Build in next project session using this capsule as context",
    },
    {
      id: "t2",
      thread: "Claude Code / Dev Tool template variant",
      priority: "medium",
      context: "More specific than the generic API template. Should cover: Skills (progressive disclosure, SKILL.md structure), subagent architecture (isolated context windows, task vs. role), MCP integration patterns, CLAUDE.md setup, ACI design principles.",
      nextAction: "Build after Agentic template",
    },
    {
      id: "t3",
      thread: "Flash-n-Frame integration path",
      priority: "medium",
      context: "Beta Tester Army was built for Flash-n-Frame's 10 persona user flows. The template + export system makes this portable as a Flash-n-Frame feature or standalone AIaaS tool. API key structure already designed (Anthropic/OpenAI passthrough).",
      nextAction: "Evaluate as Flash-n-Frame v4.x feature after standalone validation",
    },
    {
      id: "t4",
      thread: "Context capsule as recurring workflow",
      priority: "high",
      context: "This tool itself should become a habit: generate capsule before every project migration. Each hop the capsule gets richer. By project 3-4 it becomes a living architecture brief any Claude instance can cold-start from.",
      nextAction: "Use this capsule immediately. Refine schema after next migration.",
    },
  ],
  projectKnowledge: [
    {
      id: "k1",
      file: "vibe working & multi-agent orchestration docs (multiple)",
      relevance: "high",
      keyInsights: "Vibe Working = outcome-based orchestration vs task-based prompting. Human role shifts to Judgment + Taste. Agent swarm architecture: Lead Agent → Specialist Agents → Shared Task List. T-Mux swim lanes for observability. HITL as primary governance layer.",
      usedFor: "Informed Agentic template design strategy",
    },
    {
      id: "k2",
      file: "claude-skills-architecture-and-implementation-road-20260302.md",
      relevance: "high",
      keyInsights: "Skills = reusable instruction manuals. Progressive disclosure = only name+description in context until skill invoked. Stackable. Portability across workspace. .skll file format.",
      usedFor: "Claude Code template variant planning",
    },
    {
      id: "k3",
      file: "a-technical-analysis-of-claude-code-extensibility-20260302.docx",
      relevance: "high",
      keyInsights: "Sub-agents: isolated context windows, unique system prompts, specific tool permissions. Task vs. Role distinction critical. Context window pollution prevention. MCP integrations: Supabase, Chrome DevTools, Playwright, Stripe.",
      usedFor: "Agentic template persona and flow design",
    },
    {
      id: "k4",
      file: "technical-governance-framework-enterprise-agentic-20260302.docx",
      relevance: "medium",
      keyInsights: "Core Four: Context, Model, Tools, Safety. MRCV2 score: Opus 4.6 at 76% retrieval @ 1M tokens. Renaissance Developer archetype. 12-hour sandbox lifespan. Zombie agent fiscal risk.",
      usedFor: "Agentic template scoring rubric dimensions",
    },
  ],
  nextSessionPrimer: "",
  tags: ["beta-tester-army", "flash-n-frame", "template-system", "agentic", "vibe-working", "claude-code", "migration-infrastructure"],
};

// ── COMPONENTS ──────────────────────────────────────────────────────────────

function SectionHeader({ icon, label, count }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
      <span style={{ fontSize:16 }}>{icon}</span>
      <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#e2e8f0", fontSize:15, letterSpacing:.3 }}>{label}</span>
      {count !== undefined && (
        <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"#1e293b", color:"#475569", fontFamily:"'Space Mono',monospace" }}>{count}</span>
      )}
    </div>
  );
}

function PriorityBadge({ p }) {
  const c = p==="high"?"#ef4444":p==="medium"?"#f59e0b":"#22d3ee";
  return <span style={{ fontSize:9, padding:"2px 8px", borderRadius:10, background:c+"22", color:c, border:`1px solid ${c}33`, fontFamily:"'Space Mono',monospace", letterSpacing:.5 }}>{p.toUpperCase()}</span>;
}

function StatusBadge({ s }) {
  const c = s==="shipped"?"#10b981":s==="in-progress"?"#22d3ee":"#6366f1";
  return <span style={{ fontSize:9, padding:"2px 8px", borderRadius:10, background:c+"22", color:c, border:`1px solid ${c}33`, fontFamily:"'Space Mono',monospace", letterSpacing:.5 }}>{s.toUpperCase()}</span>;
}

function RelevanceBadge({ r }) {
  const c = r==="high"?"#a78bfa":r==="medium"?"#60a5fa":"#94a3b8";
  return <span style={{ fontSize:9, padding:"2px 8px", borderRadius:10, background:c+"22", color:c, border:`1px solid ${c}33`, fontFamily:"'Space Mono',monospace", letterSpacing:.5 }}>{r.toUpperCase()}</span>;
}

function EditableText({ value, onChange, rows=2, mono=false, placeholder="" }) {
  return (
    <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder}
      style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:6,
        padding:"8px 10px", color:"#94a3b8", fontSize:12, lineHeight:1.6, resize:"vertical",
        fontFamily: mono ? "'Space Mono',monospace" : "'Syne',sans-serif", transition:"border-color .2s" }}
    />
  );
}

function EditableInline({ value, onChange, placeholder="" }) {
  return (
    <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{ background:"#080e1c", border:"1px solid #1a2744", borderRadius:6,
        padding:"6px 10px", color:"#94a3b8", fontSize:12, fontFamily:"'Syne',sans-serif",
        width:"100%", transition:"border-color .2s" }}
    />
  );
}

function Label({ text }) {
  return <div style={{ fontSize:10, color:"#6366f1", fontFamily:"'Space Mono',monospace", marginBottom:4, letterSpacing:.8 }}>{text}</div>;
}

function Spinner() {
  return (
    <div style={{ width:14, height:14, border:"2px solid #6366f133", borderTopColor:"#6366f1",
      borderRadius:"50%", animation:"spin .7s linear infinite", flexShrink:0 }} />
  );
}

// ── MAIN ────────────────────────────────────────────────────────────────────
export default function ContextCapsule() {
  const [capsule, setCapsule] = useState(SESSION_SEED);
  const [activeSection, setActiveSection] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);
  const [primerGenerated, setPrimerGenerated] = useState(false);
  const [generatingPrimer, setGeneratingPrimer] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const tagInputRef = useRef(null);
  const [tagDraft, setTagDraft] = useState("");

  // ── State helpers ──
  function update(path, value) {
    setCapsule(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = next;
      for (let i=0;i<keys.length-1;i++) obj=obj[keys[i]];
      obj[keys[keys.length-1]] = value;
      return next;
    });
  }

  function updateArrayItem(arr, id, field, value) {
    setCapsule(prev => ({
      ...prev,
      [arr]: prev[arr].map(item => item.id===id ? {...item,[field]:value} : item)
    }));
  }

  function addItem(arr, template) {
    setCapsule(prev => ({ ...prev, [arr]: [...prev[arr], { ...template, id: arr[0]+Date.now() }] }));
  }

  function removeItem(arr, id) {
    setCapsule(prev => ({ ...prev, [arr]: prev[arr].filter(i=>i.id!==id) }));
  }

  function addTag(tag) {
    const t = tag.trim().toLowerCase().replace(/\s+/g,"-");
    if (t && !capsule.tags.includes(t)) {
      setCapsule(prev => ({ ...prev, tags: [...prev.tags, t] }));
    }
    setTagDraft("");
  }

  function removeTag(tag) {
    setCapsule(prev => ({ ...prev, tags: prev.tags.filter(t=>t!==tag) }));
  }

  // ── JSON Import (Phase 3 fix) ──
  function importFromJSON(text) {
    setImportError("");
    try {
      const parsed = JSON.parse(text);
      // Validate required shape
      if (!parsed.meta || !Array.isArray(parsed.built)) throw new Error("Invalid capsule schema — missing meta or built[]");
      setCapsule({
        meta: parsed.meta || SESSION_SEED.meta,
        built: parsed.built || [],
        decisions: parsed.decisions || [],
        openThreads: parsed.openThreads || [],
        projectKnowledge: parsed.projectKnowledge || [],
        nextSessionPrimer: parsed.nextSessionPrimer || "",
        tags: parsed.tags || [],
      });
      setPrimerGenerated(!!parsed.nextSessionPrimer);
      setImportSuccess(true);
      setActiveSection("overview");
      setTimeout(()=>setImportSuccess(false), 3000);
    } catch(e) {
      setImportError(e.message || "Could not parse JSON");
    }
  }

  function handleFileUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => importFromJSON(e.target.result);
    reader.readAsText(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }

  // ── AI Primer generation ──
  async function generatePrimer() {
    setGeneratingPrimer(true);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{ role:"user", content:
`You are writing a cold-start primer for the NEXT Claude instance receiving this session handoff.

Write a dense, efficient 150-200 word primer that:
1. Establishes what was built and current state
2. Flags the most critical open thread to execute first
3. Lists 3 specific proactive actions for the new session
4. Notes key decisions NOT to re-litigate

Session built: ${capsule.built.map(b=>b.name+": "+b.description).join(" | ")}
Key decisions: ${capsule.decisions.map(d=>d.decision).join(" | ")}
High-priority threads: ${capsule.openThreads.filter(t=>t.priority==="high").map(t=>t.thread+": "+t.context).join(" | ")}
Project knowledge: ${capsule.projectKnowledge.map(k=>k.file+" ("+k.relevance+")").join(", ")}
Tags: ${capsule.tags.join(", ")}

Write as direct instructions to the next Claude instance. Terse, no filler. Start with "SESSION HANDOFF:" on line 1.`
          }]
        })
      });
      const d = await r.json();
      const txt = d.content?.filter(b=>b.type==="text").map(b=>b.text).join("") || "";
      update("nextSessionPrimer", txt);
      setPrimerGenerated(true);
    } catch(e) {
      update("nextSessionPrimer", "API call failed — write primer manually.\n\nError: "+e.message);
    }
    setGeneratingPrimer(false);
  }

  // ── Export ──
  function exportJSON() {
    const payload = { ...capsule, meta: { ...capsule.meta, exportedAt: new Date().toISOString(), schema: "context-capsule-v1" }};
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `capsule-${capsule.meta.sessionTitle.slice(0,30).replace(/\s+/g,"-").toLowerCase()}-${capsule.meta.date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(()=>setExported(false), 2000);
  }

  function copyJSON() {
    const payload = { ...capsule, meta: { ...capsule.meta, exportedAt: new Date().toISOString(), schema: "context-capsule-v1" }};
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  }

  // ── Nav + completeness ──
  const NAV = [
    { id:"overview",   label:"Overview",          icon:"◈" },
    { id:"built",      label:"Built",             icon:"📦", count: capsule.built.length },
    { id:"decisions",  label:"Decisions",         icon:"⚖",  count: capsule.decisions.length },
    { id:"threads",    label:"Open Threads",      icon:"🧵", count: capsule.openThreads.length },
    { id:"knowledge",  label:"Project Knowledge", icon:"📚", count: capsule.projectKnowledge.length },
    { id:"primer",     label:"Session Primer",    icon:"🚀" },
    { id:"import",     label:"Import",            icon:"⬆" },
    { id:"export",     label:"Export",            icon:"⬇" },
  ];

  const completenessItems = [
    !!capsule.meta.sessionTitle,
    !!capsule.meta.destinationProject,
    capsule.built.length > 0,
    capsule.decisions.length > 0,
    capsule.openThreads.length > 0,
    !!capsule.nextSessionPrimer,
  ];
  const pct = Math.round((completenessItems.filter(Boolean).length / completenessItems.length) * 100);

  const cardStyle = {
    background:"#060c1a", border:"1px solid #0d1525", borderRadius:10,
    padding:"18px 20px", marginBottom:10, transition:"border-color .2s"
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight:"100vh", background:"#020817", fontFamily:"'Syne',sans-serif", color:"#e2e8f0",
        display:"flex", flexDirection:"column",
        backgroundImage:"radial-gradient(#0d1525 1px, transparent 1px)", backgroundSize:"24px 24px" }}>

        {/* ── TOP BAR ── */}
        <div style={{ padding:"12px 20px", borderBottom:"1px solid #1a2744", background:"#030912ee",
          display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50, backdropFilter:"blur(8px)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:28, height:28, background:"linear-gradient(135deg,#4f46e5,#7c3aed)",
              borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, animation:"glow 3s ease infinite" }}>⬡</div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, letterSpacing:.5 }}>CONTEXT CAPSULE</div>
              <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace" }}>v1.0 · session handoff tool</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {importSuccess && (
              <span style={{ fontSize:11, color:"#10b981", fontFamily:"'Space Mono',monospace", animation:"fadeUp .3s ease" }}>✓ capsule loaded</span>
            )}
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:120, height:4, background:"#1e293b", borderRadius:4, overflow:"hidden" }}>
                <div style={{ width:`${pct}%`, height:"100%", background:"linear-gradient(90deg,#4f46e5,#7c3aed)", borderRadius:4, transition:"width .4s ease" }}/>
              </div>
              <span style={{ fontSize:10, color:"#475569", fontFamily:"'Space Mono',monospace" }}>{pct}%</span>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ display:"flex", flex:1 }}>

          {/* ── SIDEBAR ── */}
          <div style={{ width:200, borderRight:"1px solid #0d1525", padding:"16px 0", flexShrink:0,
            background:"#020a14", position:"sticky", top:49, height:"calc(100vh - 49px)", overflowY:"auto" }}>
            {NAV.map(n => (
              <div key={n.id} className={`nav-item${activeSection===n.id?" active":""}`}
                onClick={()=>setActiveSection(n.id)}
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"9px 16px", cursor:"pointer", fontSize:12, color:"#475569",
                  transition:"all .15s", borderLeft:"2px solid transparent", fontWeight:600 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:13 }}>{n.icon}</span>
                  <span>{n.label}</span>
                </div>
                {n.count !== undefined && (
                  <span style={{ fontSize:10, padding:"1px 6px", borderRadius:10, background:"#1e293b",
                    color:"#334155", fontFamily:"'Space Mono',monospace" }}>{n.count}</span>
                )}
              </div>
            ))}

            {/* Tags */}
            <div style={{ padding:"16px 16px 8px", borderTop:"1px solid #0d1525", marginTop:8 }}>
              <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:8, letterSpacing:.8 }}>TAGS</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:8 }}>
                {capsule.tags.map(t => (
                  <span key={t} className="tag-pill" onClick={()=>removeTag(t)}
                    style={{ fontSize:10, padding:"2px 7px", borderRadius:10, background:"#0d1525", color:"#475569",
                      fontFamily:"'Space Mono',monospace", cursor:"pointer", transition:"all .15s" }} title="Click to remove">
                    {t}
                  </span>
                ))}
              </div>
              <input value={tagDraft} ref={tagInputRef} onChange={e=>setTagDraft(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter"||e.key===","){ e.preventDefault(); addTag(tagDraft); }}}
                placeholder="add tag…" style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744",
                  borderRadius:5, padding:"4px 8px", color:"#64748b", fontSize:11,
                  fontFamily:"'Space Mono',monospace" }}/>
            </div>
          </div>

          {/* ── MAIN PANEL ── */}
          <div style={{ flex:1, padding:"28px 32px", maxWidth:800, animation:"fadeUp .3s ease" }}>

            {/* OVERVIEW */}
            {activeSection==="overview" && (
              <div>
                <SectionHeader icon="◈" label="Session Overview"/>
                <div style={cardStyle}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                    {[
                      { label:"SESSION TITLE", path:"meta.sessionTitle", placeholder:"What did we build this session?" },
                      { label:"SOURCE PROJECT", path:"meta.sourceProject", placeholder:"Where are we coming from?" },
                      { label:"DESTINATION PROJECT", path:"meta.destinationProject", placeholder:"Where are we going?" },
                      { label:"DATE", path:"meta.date", placeholder:"YYYY-MM-DD" },
                    ].map(f => (
                      <div key={f.path}>
                        <Label text={f.label}/>
                        <EditableInline value={f.path.split(".").reduce((o,k)=>o[k],capsule)} onChange={v=>update(f.path,v)} placeholder={f.placeholder}/>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary cards */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginTop:16 }}>
                  {[
                    { label:"BUILT", value: capsule.built.length, color:"#10b981", nav:"built" },
                    { label:"DECISIONS", value: capsule.decisions.length, color:"#6366f1", nav:"decisions" },
                    { label:"OPEN THREADS", value: capsule.openThreads.length, color:"#f59e0b", nav:"threads" },
                    { label:"KNOWLEDGE FILES", value: capsule.projectKnowledge.length, color:"#22d3ee", nav:"knowledge" },
                  ].map(s => (
                    <div key={s.label} onClick={()=>setActiveSection(s.nav)}
                      style={{ ...cardStyle, marginBottom:0, cursor:"pointer", textAlign:"center", padding:"16px 12px" }}>
                      <div style={{ fontSize:28, fontWeight:800, color:s.color, fontFamily:"'Syne',sans-serif" }}>{s.value}</div>
                      <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginTop:4, letterSpacing:.8 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Checklist */}
                <div style={{ ...cardStyle, marginTop:16, background:"#031a0f", borderColor:"#10b98133" }}>
                  <Label text="MIGRATION READINESS"/>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginTop:4 }}>
                    {[
                      ["Session title set", !!capsule.meta.sessionTitle],
                      ["Destination project named", !!capsule.meta.destinationProject],
                      ["Artifacts documented", capsule.built.length > 0],
                      ["Decisions recorded", capsule.decisions.length > 0],
                      ["Open threads captured", capsule.openThreads.length > 0],
                      ["Primer generated", !!capsule.nextSessionPrimer],
                    ].map(([label, done]) => (
                      <div key={label} style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <span style={{ color:done?"#10b981":"#1e293b", fontSize:12 }}>{done?"✓":"○"}</span>
                        <span style={{ color:done?"#6ee7b7":"#334155", fontSize:12 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BUILT */}
            {activeSection==="built" && (
              <div>
                <SectionHeader icon="📦" label="Built This Session" count={capsule.built.length}/>
                {capsule.built.map(b => (
                  <div key={b.id} className="field-card" style={{ ...cardStyle, position:"relative" }}>
                    <button className="remove-btn btn" onClick={()=>removeItem("built",b.id)}
                      style={{ position:"absolute", top:12, right:12, background:"#1e293b", border:"none",
                        borderRadius:5, padding:"2px 8px", color:"#ef4444", cursor:"pointer", fontSize:11 }}>✕</button>
                    <div style={{ display:"grid", gap:12 }}>
                      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:12 }}>
                        <div><Label text="NAME"/><EditableInline value={b.name} onChange={v=>updateArrayItem("built",b.id,"name",v)}/></div>
                        <div>
                          <Label text="TYPE"/>
                          <select value={b.type} onChange={e=>updateArrayItem("built",b.id,"type",e.target.value)}
                            style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:6,
                              padding:"6px 10px", color:"#94a3b8", fontSize:12, fontFamily:"'Syne',sans-serif" }}>
                            {["artifact","component","document","script","template","other"].map(t=><option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <Label text="STATUS"/>
                          <select value={b.status} onChange={e=>updateArrayItem("built",b.id,"status",e.target.value)}
                            style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:6,
                              padding:"6px 10px", color:"#94a3b8", fontSize:12, fontFamily:"'Syne',sans-serif" }}>
                            {["shipped","in-progress","draft","abandoned"].map(s=><option key={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <div><Label text="FILE"/><EditableInline value={b.file} onChange={v=>updateArrayItem("built",b.id,"file",v)} placeholder="filename.ext"/></div>
                      <div><Label text="DESCRIPTION"/><EditableText value={b.description} rows={3} onChange={v=>updateArrayItem("built",b.id,"description",v)}/></div>
                      <div style={{ display:"flex", gap:8 }}>
                        <StatusBadge s={b.status}/>
                        <span style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", padding:"2px 8px", borderRadius:10, background:"#1e293b33" }}>{b.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="btn" onClick={()=>addItem("built",{ name:"", type:"artifact", file:"", description:"", status:"in-progress" })}
                  style={{ background:"transparent", border:"1px dashed #1e293b", borderRadius:10, padding:"12px 20px",
                    color:"#334155", cursor:"pointer", fontSize:12, fontFamily:"'Space Mono',monospace", transition:"all .2s", width:"100%" }}>
                  + add artifact
                </button>
              </div>
            )}

            {/* DECISIONS */}
            {activeSection==="decisions" && (
              <div>
                <SectionHeader icon="⚖" label="Key Decisions" count={capsule.decisions.length}/>
                <div style={{ fontSize:12, color:"#475569", marginBottom:14, lineHeight:1.6 }}>
                  Locked decisions — don't re-litigate these in the next session.
                </div>
                {capsule.decisions.map(d => (
                  <div key={d.id} className="field-card" style={{ ...cardStyle, position:"relative" }}>
                    <button className="remove-btn btn" onClick={()=>removeItem("decisions",d.id)}
                      style={{ position:"absolute", top:12, right:12, background:"#1e293b", border:"none",
                        borderRadius:5, padding:"2px 8px", color:"#ef4444", cursor:"pointer", fontSize:11 }}>✕</button>
                    <div style={{ display:"grid", gap:12 }}>
                      <div><Label text="DECISION"/><EditableText value={d.decision} rows={2} onChange={v=>updateArrayItem("decisions",d.id,"decision",v)}/></div>
                      <div><Label text="RATIONALE"/><EditableText value={d.rationale} rows={3} onChange={v=>updateArrayItem("decisions",d.id,"rationale",v)}/></div>
                      <div><Label text="ALTERNATIVES CONSIDERED"/><EditableInline value={d.alternatives} onChange={v=>updateArrayItem("decisions",d.id,"alternatives",v)}/></div>
                    </div>
                  </div>
                ))}
                <button className="btn" onClick={()=>addItem("decisions",{ decision:"", rationale:"", alternatives:"" })}
                  style={{ background:"transparent", border:"1px dashed #1e293b", borderRadius:10, padding:"12px 20px",
                    color:"#334155", cursor:"pointer", fontSize:12, fontFamily:"'Space Mono',monospace", transition:"all .2s", width:"100%" }}>
                  + add decision
                </button>
              </div>
            )}

            {/* OPEN THREADS */}
            {activeSection==="threads" && (
              <div>
                <SectionHeader icon="🧵" label="Open Threads" count={capsule.openThreads.length}/>
                {capsule.openThreads.map(t => (
                  <div key={t.id} className="field-card" style={{ ...cardStyle, position:"relative",
                    borderLeft: t.priority==="high"?"2px solid #ef444466":t.priority==="medium"?"2px solid #f59e0b66":"2px solid #0d1525" }}>
                    <button className="remove-btn btn" onClick={()=>removeItem("openThreads",t.id)}
                      style={{ position:"absolute", top:12, right:12, background:"#1e293b", border:"none",
                        borderRadius:5, padding:"2px 8px", color:"#ef4444", cursor:"pointer", fontSize:11 }}>✕</button>
                    <div style={{ display:"grid", gap:12 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <PriorityBadge p={t.priority}/>
                        <EditableInline value={t.thread} onChange={v=>updateArrayItem("openThreads",t.id,"thread",v)} placeholder="Thread name..."/>
                      </div>
                      <div>
                        <Label text="PRIORITY"/>
                        <select value={t.priority} onChange={e=>updateArrayItem("openThreads",t.id,"priority",e.target.value)}
                          style={{ background:"#080e1c", border:"1px solid #1a2744", borderRadius:6,
                            padding:"6px 10px", color:"#94a3b8", fontSize:12, fontFamily:"'Syne',sans-serif" }}>
                          {["high","medium","low"].map(p=><option key={p}>{p}</option>)}
                        </select>
                      </div>
                      <div><Label text="CONTEXT"/><EditableText value={t.context} rows={4} onChange={v=>updateArrayItem("openThreads",t.id,"context",v)}/></div>
                      <div><Label text="NEXT ACTION"/><EditableInline value={t.nextAction} onChange={v=>updateArrayItem("openThreads",t.id,"nextAction",v)} placeholder="What should the next session do first?"/></div>
                    </div>
                  </div>
                ))}
                <button className="btn" onClick={()=>addItem("openThreads",{ thread:"", priority:"medium", context:"", nextAction:"" })}
                  style={{ background:"transparent", border:"1px dashed #1e293b", borderRadius:10, padding:"12px 20px",
                    color:"#334155", cursor:"pointer", fontSize:12, fontFamily:"'Space Mono',monospace", transition:"all .2s", width:"100%" }}>
                  + add thread
                </button>
              </div>
            )}

            {/* PROJECT KNOWLEDGE */}
            {activeSection==="knowledge" && (
              <div>
                <SectionHeader icon="📚" label="Project Knowledge" count={capsule.projectKnowledge.length}/>
                {capsule.projectKnowledge.map(k => (
                  <div key={k.id} className="field-card" style={{ ...cardStyle, position:"relative" }}>
                    <button className="remove-btn btn" onClick={()=>removeItem("projectKnowledge",k.id)}
                      style={{ position:"absolute", top:12, right:12, background:"#1e293b", border:"none",
                        borderRadius:5, padding:"2px 8px", color:"#ef4444", cursor:"pointer", fontSize:11 }}>✕</button>
                    <div style={{ display:"grid", gap:12 }}>
                      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:12 }}>
                        <div><Label text="FILE"/><EditableInline value={k.file} onChange={v=>updateArrayItem("projectKnowledge",k.id,"file",v)} placeholder="filename or doc title"/></div>
                        <div>
                          <Label text="RELEVANCE"/><RelevanceBadge r={k.relevance}/>
                          <select value={k.relevance} onChange={e=>updateArrayItem("projectKnowledge",k.id,"relevance",e.target.value)}
                            style={{ background:"#080e1c", border:"1px solid #1a2744", borderRadius:6,
                              padding:"6px 10px", color:"#94a3b8", fontSize:12, fontFamily:"'Syne',sans-serif", marginTop:6, width:"100%" }}>
                            {["high","medium","low"].map(r=><option key={r}>{r}</option>)}
                          </select>
                        </div>
                      </div>
                      <div><Label text="KEY INSIGHTS"/><EditableText value={k.keyInsights} rows={3} onChange={v=>updateArrayItem("projectKnowledge",k.id,"keyInsights",v)}/></div>
                      <div><Label text="USED FOR"/><EditableText value={k.usedFor} rows={2} onChange={v=>updateArrayItem("projectKnowledge",k.id,"usedFor",v)}/></div>
                    </div>
                  </div>
                ))}
                <button className="btn" onClick={()=>addItem("projectKnowledge",{ file:"", relevance:"medium", keyInsights:"", usedFor:"" })}
                  style={{ background:"transparent", border:"1px dashed #1e293b", borderRadius:10, padding:"12px 20px",
                    color:"#334155", cursor:"pointer", fontSize:12, fontFamily:"'Space Mono',monospace", transition:"all .2s", width:"100%" }}>
                  + add file
                </button>
              </div>
            )}

            {/* PRIMER */}
            {activeSection==="primer" && (
              <div style={{ maxWidth:640 }}>
                <SectionHeader icon="🚀" label="Next Session Primer"/>
                <div style={{ fontSize:12, color:"#475569", marginBottom:16, lineHeight:1.6 }}>
                  Dense cold-start message for the next Claude instance. Paste as your first message — eliminates re-derivation of context.
                </div>
                <div style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"20px" }}>
                  {!capsule.nextSessionPrimer && !generatingPrimer && (
                    <div style={{ textAlign:"center", padding:"24px 0" }}>
                      <div style={{ color:"#334155", fontSize:13, marginBottom:16, fontFamily:"'Space Mono',monospace" }}>No primer yet.</div>
                      <button className="btn" onClick={generatePrimer}
                        style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", borderRadius:8,
                          padding:"10px 22px", color:"#fff", cursor:"pointer", fontSize:13,
                          fontFamily:"'Syne',sans-serif", fontWeight:700, transition:"all .2s" }}>
                        ✦ Generate AI Primer
                      </button>
                    </div>
                  )}
                  {generatingPrimer && (
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"20px 0",
                      color:"#6366f1", fontSize:12, fontFamily:"'Space Mono',monospace" }}>
                      <Spinner/> Synthesizing session context…
                    </div>
                  )}
                  {capsule.nextSessionPrimer && (
                    <>
                      <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:8,
                        display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span>PRIMER {primerGenerated && <span style={{ color:"#10b981" }}>· AI GENERATED</span>}</span>
                        <button className="btn" onClick={generatePrimer} disabled={generatingPrimer}
                          style={{ background:"transparent", border:"none", color:"#6366f1", cursor:"pointer",
                            fontSize:10, fontFamily:"'Space Mono',monospace", display:"flex", alignItems:"center", gap:6 }}>
                          {generatingPrimer ? <><Spinner/> regenerating</> : "↺ regenerate"}
                        </button>
                      </div>
                      <EditableText value={capsule.nextSessionPrimer} rows={12} mono={true}
                        onChange={v=>update("nextSessionPrimer",v)} placeholder="Write or generate a cold-start primer…"/>
                      <button className="btn" onClick={()=>{ navigator.clipboard.writeText(capsule.nextSessionPrimer); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
                        style={{ marginTop:10, background:"transparent", border:"1px solid #1e293b", borderRadius:6,
                          padding:"6px 14px", color:"#64748b", cursor:"pointer", fontSize:11,
                          fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
                        {copied?"✓ copied":"⎘ copy primer"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* IMPORT (Phase 3 — new section) */}
            {activeSection==="import" && (
              <div style={{ maxWidth:580 }}>
                <SectionHeader icon="⬆" label="Import Capsule"/>
                <div style={{ fontSize:12, color:"#475569", marginBottom:16, lineHeight:1.6 }}>
                  Load a previously exported capsule JSON. This replaces the current session — export first if you need to save it.
                </div>

                {/* Drop zone */}
                <div className={`drop-zone${isDragOver?" drag-over":""}`}
                  onDragOver={e=>{ e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={()=>setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={()=>fileInputRef.current?.click()}
                  style={{ border:"2px dashed #1e293b", borderRadius:12, padding:"40px 24px",
                    textAlign:"center", cursor:"pointer", marginBottom:16 }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>⬆</div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#475569", marginBottom:4 }}>Drop capsule JSON here</div>
                  <div style={{ fontSize:11, color:"#334155", fontFamily:"'Space Mono',monospace" }}>or click to browse</div>
                  <input ref={fileInputRef} type="file" accept=".json" style={{ display:"none" }}
                    onChange={e=>handleFileUpload(e.target.files[0])}/>
                </div>

                {/* Paste textarea */}
                <div style={{ ...cardStyle }}>
                  <Label text="OR PASTE JSON DIRECTLY"/>
                  <PasteImport onImport={importFromJSON}/>
                </div>

                {importError && (
                  <div style={{ background:"#1a0808", border:"1px solid #ef444433", borderRadius:8,
                    padding:"12px 16px", color:"#ef4444", fontSize:12, fontFamily:"'Space Mono',monospace", marginTop:10 }}>
                    ✕ {importError}
                  </div>
                )}
                {importSuccess && (
                  <div style={{ background:"#031a0f", border:"1px solid #10b98133", borderRadius:8,
                    padding:"12px 16px", color:"#10b981", fontSize:12, fontFamily:"'Space Mono',monospace", marginTop:10, animation:"fadeUp .3s ease" }}>
                    ✓ Capsule loaded successfully — check Overview
                  </div>
                )}
              </div>
            )}

            {/* EXPORT */}
            {activeSection==="export" && (
              <div style={{ maxWidth:580 }}>
                <SectionHeader icon="⬇" label="Export Capsule"/>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[
                    { label:"JSON File", desc:"Full structured capsule. Import back into this tool, feed to Claude API, or version in Git.", action: exportJSON, btn: exported?"✓ Downloaded":"⬇ Download JSON", color:"linear-gradient(135deg,#1d4ed8,#0ea5e9)" },
                    { label:"Copy to Clipboard", desc:"Paste into next Claude session as context. Best combined with the primer.", action: copyJSON, btn: copied?"✓ Copied":"⎘ Copy JSON", color:"linear-gradient(135deg,#4f46e5,#7c3aed)" },
                  ].map(opt => (
                    <div key={opt.label} style={{ ...cardStyle, display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
                      <div>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#e2e8f0", fontSize:14, marginBottom:4 }}>{opt.label}</div>
                        <div style={{ color:"#475569", fontSize:12, lineHeight:1.5 }}>{opt.desc}</div>
                      </div>
                      <button className="btn" onClick={opt.action}
                        style={{ background:opt.color, border:"none", borderRadius:8, padding:"10px 18px",
                          color:"#fff", cursor:"pointer", fontSize:12, fontFamily:"'Syne',sans-serif",
                          fontWeight:700, flexShrink:0, transition:"all .2s", whiteSpace:"nowrap" }}>
                        {opt.btn}
                      </button>
                    </div>
                  ))}

                  {/* Schema preview */}
                  <div style={{ ...cardStyle }}>
                    <Label text="JSON SCHEMA"/>
                    <pre style={{ color:"#475569", fontSize:11, lineHeight:1.6, fontFamily:"'Space Mono',monospace", overflow:"auto", marginTop:8 }}>
{`{
  "meta": { sessionTitle, sourceProject, destinationProject, date, schema },
  "built": [{ name, type, file, description, status }],
  "decisions": [{ decision, rationale, alternatives }],
  "openThreads": [{ thread, priority, context, nextAction }],
  "projectKnowledge": [{ file, relevance, keyInsights, usedFor }],
  "nextSessionPrimer": "...",
  "tags": []
}`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

// ── Paste import sub-component ──────────────────────────────────────────────
function PasteImport({ onImport }) {
  const [text, setText] = useState("");
  return (
    <div style={{ marginTop:8 }}>
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={6}
        placeholder={'{\n  "meta": { "sessionTitle": "...", ... },\n  "built": [...],\n  ...\n}'}
        style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:6,
          padding:"8px 10px", color:"#94a3b8", fontSize:11, lineHeight:1.6, resize:"vertical",
          fontFamily:"'Space Mono',monospace" }}/>
      <button className="btn" onClick={()=>{ if(text.trim()) onImport(text); }}
        style={{ marginTop:8, background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none",
          borderRadius:7, padding:"8px 18px", color:"#fff", cursor:"pointer", fontSize:12,
          fontFamily:"'Syne',sans-serif", fontWeight:700, transition:"all .2s" }}>
        Load Capsule
      </button>
    </div>
  );
}
