import { useState, useRef } from "react";

// ── STYLES ───────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:#0d1117}
  ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}

  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes slideIn{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:translateX(0)}}

  .btn:hover{filter:brightness(1.12);transform:translateY(-1px)}
  .btn:active{transform:translateY(0)}
  textarea:focus,input:focus{outline:none!important;border-color:#6366f155!important;box-shadow:0 0 0 2px #6366f111}
  .field-card:hover{border-color:#1e293b!important}
  .tag-pill:hover{background:#1e293b!important;color:#94a3b8!important}
  .nav-item{transition:all .15s;border-left:2px solid transparent}
  .nav-item:hover{background:#0d1525!important;color:#94a3b8!important;border-left-color:#334155!important}
  .nav-item.active{background:#0d1525!important;color:#6366f1!important;border-left-color:#6366f1!important}
  .remove-btn{opacity:0;transition:opacity .15s}
  .field-card:hover .remove-btn{opacity:1}
  .drop-zone{transition:all .2s}
  .drop-zone.drag-over{border-color:#6366f1!important;background:#6366f108!important}
  .shimmer-text{background:linear-gradient(90deg,#6366f1,#a78bfa,#6366f1);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 2s linear infinite}
  .lock-badge{display:inline-flex;align-items:center;gap:3px;font-size:9px;padding:2px 7px;border-radius:10px;background:#ef444422;color:#ef4444;border:1px solid #ef444444;font-family:'Space Mono',monospace}
  select{-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23475569'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center}
`;

// ── STATUS + PRIORITY COLORS ─────────────────────────────────────────────────
const STATUS_META = {
  shipped:    { bg:"#052e16", text:"#4ade80",  border:"#166534", label:"shipped"    },
  live:       { bg:"#052e16", text:"#34d399",  border:"#065f46", label:"live"       },
  pilot:      { bg:"#042f2e", text:"#2dd4bf",  border:"#0f766e", label:"pilot"      },
  deployed:   { bg:"#042f2e", text:"#34d399",  border:"#065f46", label:"deployed"   },
  "in-progress":{ bg:"#082f49",text:"#38bdf8", border:"#0369a1", label:"in-progress"},
  spec:       { bg:"#1e1b4b", text:"#a5b4fc",  border:"#3730a3", label:"spec"       },
  planning:   { bg:"#1c1917", text:"#78716c",  border:"#292524", label:"planning"   },
  unbuilt:    { bg:"#431407", text:"#fb923c",  border:"#9a3412", label:"unbuilt"    },
  deprecated: { bg:"#0c0a09", text:"#57534e",  border:"#1c1917", label:"deprecated" },
  draft:      { bg:"#1c1917", text:"#a8a29e",  border:"#292524", label:"draft"      },
};

const PRIORITY_META = {
  high:   { bg:"#450a0a", text:"#f87171", border:"#7f1d1d" },
  medium: { bg:"#422006", text:"#fb923c", border:"#7c2d12" },
  low:    { bg:"#042f2e", text:"#5eead4", border:"#0f766e" },
};

const LANE_META = {
  "Intinc":                { color:"#2dd4bf", bg:"#042f2e" },
  "Customization Service": { color:"#fb923c", bg:"#431407" },
  "Kinsley":               { color:"#a78bfa", bg:"#2e1065" },
  "Personal":              { color:"#94a3b8", bg:"#1e293b" },
  "Other":                 { color:"#64748b", bg:"#0f172a" },
};

// ── EXAMPLE SEED (meta: this capsule describing itself) ───────────────────────
const SESSION_SEED = {
  meta: {
    schema: "context-capsule-v2",
    sessionTitle: "Context Capsule v2 — Canonical Build + Migration Plan",
    projectLane: "Personal",
    sourceProject: "Flash-n-Frame / Claude Ecosystem (multi-project)",
    destinationProject: "",
    date: new Date().toISOString().split("T")[0],
    version: "1.0",
    owner: "Kyle Rosebrook",
  },
  built: [
    {
      id: "b1",
      name: "Context Capsule v1 (base)",
      type: "artifact",
      file: "context-capsule__4_.jsx",
      description: "Session handoff tool. Structured JSON export: built artifacts, key decisions, open threads, project knowledge, AI-generated cold-start primer. Best base version includes drag+drop import, paste import, shimmer, better nav states.",
      status: "shipped",
      track: "Migration Infrastructure",
      nextMilestone: "Superseded by v2",
      blockers: "",
    },
    {
      id: "b2",
      name: "INT Context Capsule",
      type: "artifact",
      file: "int-context-capsule.jsx",
      description: "INT-specific variant with extended schema: assets (track, nextMilestone, blockers), locked decisions, metrics dashboard, teal palette. Most evolved schema — absorbed into v2 canonical.",
      status: "shipped",
      track: "Migration Infrastructure",
      nextMilestone: "Migrate to v2 INT seed variant",
      blockers: "",
    },
    {
      id: "b3",
      name: "Context Capsule v2",
      type: "artifact",
      file: "context-capsule-v2.jsx",
      description: "Canonical blank-slate. Unified schema absorbing INT fields (track, nextMilestone, blockers, locked). Meta example seed. Top-bar import. Risk flags AI generation. projectLane badge. v1 backward compat shim. One component, variant seeds only.",
      status: "in-progress",
      track: "Migration Infrastructure",
      nextMilestone: "Ship this session",
      blockers: "",
    },
  ],
  decisions: [
    {
      id: "d1",
      decision: "Extend base schema (Option B) — absorb INT fields as optional",
      rationale: "track / nextMilestone / blockers are universally useful, not INT-specific. Backward compatible: missing fields render empty. One schema ends 8-variant drift.",
      alternatives: "Keep base and INT schemas separate (Option A). Add project-type selector that morphs schema (Option C — deferred to v3).",
      locked: true,
    },
    {
      id: "d2",
      decision: "Variants are seeds only — no forked component files",
      rationale: "Root cause of 8 diverged files was copy-file-change-seed pattern. v2 fixes this: one ContextCapsuleV2 component, INT/CS variants are separate seed objects that wrap it.",
      alternatives: "Continue forking per project.",
      locked: true,
    },
    {
      id: "d3",
      decision: "Example seed = meta (capsule describing itself)",
      rationale: "Self-documenting, demonstrates every field with real meaning, recursive fit. Better than generic/fictional (hollow) or real project data (bleeds in shareable artifact).",
      alternatives: "Blank slate with placeholder text. Generic fictional project. Most recent real session.",
      locked: false,
    },
  ],
  openThreads: [
    {
      id: "t1",
      thread: "INT Capsule v2 seed variant",
      priority: "high",
      context: "int-context-capsule.jsx needs to be migrated to v2 schema. Component stays canonical; INT_SEED_V2 is a separate file with projectLane: 'Intinc', owner: 'Kyle Rosebrook — Staff Engineer', and INT-specific built/decisions pre-populated.",
      nextAction: "Build INT_SEED_V2 wrapper after v2 ships",
    },
    {
      id: "t2",
      thread: "Customization Service seed variant",
      priority: "medium",
      context: "CS_SEED_V2 needed for InVelo / Flash-n-Frame sessions. projectLane: 'Customization Service'. Pre-fill with CS-relevant template fields.",
      nextAction: "Build after INT seed variant",
    },
    {
      id: "t3",
      thread: "Past v1 capsule migration",
      priority: "low",
      context: "8 v1 capsule JSONs exist. v2 import shim handles them (missing fields render empty). No immediate action needed — migrate when revisiting those sessions.",
      nextAction: "Export v1 → import into v2 as needed. No batch migration required.",
    },
  ],
  projectKnowledge: [
    {
      id: "k1",
      file: "context-capsule__4_.jsx",
      relevance: "high",
      keyInsights: "Best base version. Has drag+drop import, paste import, FileReader, importFromJSON(), shimmer/spin animations, remove-btn hover opacity, .nav-item active border-left, drop-zone drag-over state.",
      usedFor: "v2 starting point — all UI patterns ported from here",
    },
    {
      id: "k2",
      file: "int-context-capsule.jsx",
      relevance: "high",
      keyInsights: "Extended schema: assets[] with track/nextMilestone/blockers, decisions[].locked boolean, metrics dashboard (liveCount/blockedCount/highCount), STATUS_META color registry, PRIORITY_META.",
      usedFor: "Schema extensions absorbed into v2 canonical",
    },
  ],
  nextSessionPrimer: "",
  tags: ["context-capsule", "migration-infrastructure", "v2", "meta", "session-handoff"],
};

// ── BLANK SEED (for New Capsule) ─────────────────────────────────────────────
const BLANK_SEED = {
  meta: {
    schema: "context-capsule-v2",
    sessionTitle: "",
    projectLane: "Personal",
    sourceProject: "",
    destinationProject: "",
    date: new Date().toISOString().split("T")[0],
    version: "1.0",
    owner: "",
  },
  built: [],
  decisions: [],
  openThreads: [],
  projectKnowledge: [],
  nextSessionPrimer: "",
  tags: [],
};

// ── HELPERS ──────────────────────────────────────────────────────────────────
function migrateV1(parsed) {
  // Backward compat shim: v1 → v2
  return {
    meta: {
      schema: "context-capsule-v2",
      sessionTitle: parsed.meta?.sessionTitle || "",
      projectLane: parsed.meta?.projectLane || "Personal",
      sourceProject: parsed.meta?.sourceProject || "",
      destinationProject: parsed.meta?.destinationProject || "",
      date: parsed.meta?.date || new Date().toISOString().split("T")[0],
      version: parsed.meta?.version || "1.0",
      owner: parsed.meta?.owner || "",
    },
    built: (parsed.built || []).map(b => ({
      ...b,
      track: b.track || "",
      nextMilestone: b.nextMilestone || "",
      blockers: b.blockers || "",
    })),
    decisions: (parsed.decisions || []).map(d => ({
      ...d,
      locked: d.locked ?? false,
    })),
    openThreads: parsed.openThreads || [],
    projectKnowledge: parsed.projectKnowledge || [],
    nextSessionPrimer: parsed.nextSessionPrimer || "",
    tags: parsed.tags || [],
  };
}

// ── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function SectionHeader({ icon, label, count }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
      <span style={{ fontSize:15 }}>{icon}</span>
      <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#e2e8f0", fontSize:15, letterSpacing:"-.3px" }}>{label}</span>
      {count !== undefined && (
        <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"#1e293b", color:"#475569", fontFamily:"'Space Mono',monospace" }}>{count}</span>
      )}
    </div>
  );
}

function StatusBadge({ s }) {
  const m = STATUS_META[s] || STATUS_META.draft;
  return (
    <span style={{ fontSize:9, padding:"2px 8px", borderRadius:10, background:m.bg, color:m.text, border:`1px solid ${m.border}`, fontFamily:"'Space Mono',monospace", whiteSpace:"nowrap" }}>
      {m.label}
    </span>
  );
}

function PriorityBadge({ p }) {
  const m = PRIORITY_META[p] || PRIORITY_META.medium;
  return (
    <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:m.bg, color:m.text, border:`1px solid ${m.border}`, fontFamily:"'Space Mono',monospace" }}>{p}</span>
  );
}

function EditableText({ value, onChange, rows=2, mono=false, placeholder="" }) {
  return (
    <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder}
      style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:6,
        padding:"8px 10px", color:"#94a3b8", fontSize:12, lineHeight:1.6, resize:"vertical",
        fontFamily:mono?"'Space Mono',monospace":"'Syne',sans-serif", transition:"border-color .2s" }}
    />
  );
}

function FieldLabel({ children, color="#334155" }) {
  return <div style={{ fontSize:10, color, fontFamily:"'Space Mono',monospace", letterSpacing:1, marginBottom:5 }}>{children}</div>;
}

function AddButton({ onClick, label }) {
  return (
    <button className="btn" onClick={onClick}
      style={{ background:"transparent", border:"1px dashed #1e293b", borderRadius:10, padding:"11px",
        color:"#334155", cursor:"pointer", fontSize:12, fontFamily:"'Space Mono',monospace",
        width:"100%", transition:"all .2s" }}>
      {label}
    </button>
  );
}

function MetricCard({ label, value, sub, color="#6366f1" }) {
  return (
    <div style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"14px 18px", flex:1, minWidth:0 }}>
      <div style={{ fontSize:22, fontFamily:"'Space Mono',monospace", color, fontWeight:700, marginBottom:2 }}>{value}</div>
      <div style={{ fontSize:11, color:"#e2e8f0", fontFamily:"'Syne',sans-serif", fontWeight:600 }}>{label}</div>
      {sub && <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginTop:2 }}>{sub}</div>}
    </div>
  );
}

function PasteImport({ onImport }) {
  const [text, setText] = useState("");
  return (
    <div style={{ marginTop:10 }}>
      <FieldLabel>PASTE JSON</FieldLabel>
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={6}
        placeholder={'{\n  "meta": { "sessionTitle": "...", "projectLane": "Personal" },\n  "built": [...],\n  "decisions": [...]\n}'}
        style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:6,
          padding:"8px 10px", color:"#94a3b8", fontSize:11, lineHeight:1.6, resize:"vertical",
          fontFamily:"'Space Mono',monospace", transition:"border-color .2s" }}
      />
      <button className="btn" onClick={()=>{ if(text.trim()) onImport(text); }}
        style={{ marginTop:8, background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none",
          borderRadius:7, padding:"8px 18px", color:"#fff", cursor:"pointer", fontSize:12,
          fontFamily:"'Syne',sans-serif", fontWeight:700, transition:"all .2s" }}>
        Load Capsule
      </button>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function ContextCapsuleV2() {
  const [capsule, setCapsule]             = useState(SESSION_SEED);
  const [activeSection, setActiveSection] = useState("overview");
  const [copied, setCopied]               = useState(false);
  const [exported, setExported]           = useState(false);
  const [primerGenerated, setPrimerGenerated] = useState(false);
  const [generatingPrimer, setGeneratingPrimer] = useState(false);
  const [generatingRisk, setGeneratingRisk] = useState(false);
  const [riskFlags, setRiskFlags]         = useState("");
  const [importError, setImportError]     = useState("");
  const [importSuccess, setImportSuccess] = useState(false);
  const [importWasMigrated, setImportWasMigrated] = useState(false);
  const [isDragOver, setIsDragOver]       = useState(false);
  const [showOtherLane, setShowOtherLane] = useState(false);
  const fileInputRef = useRef(null);

  // ── State helpers ──
  function update(path, value) {
    setCapsule(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = next;
      for (let i=0; i<keys.length-1; i++) obj = obj[keys[i]];
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
    if (tag && !capsule.tags.includes(tag)) {
      setCapsule(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  }

  function removeTag(tag) {
    setCapsule(prev => ({ ...prev, tags: prev.tags.filter(t=>t!==tag) }));
  }

  // ── Import ──
  function importFromJSON(text) {
    setImportError("");
    setImportWasMigrated(false);
    try {
      const parsed = JSON.parse(text);
      if (!parsed.meta || !Array.isArray(parsed.built)) throw new Error("Invalid capsule — missing meta or built[]");
      const isV1 = !parsed.meta.schema || parsed.meta.schema === "context-capsule-v1";
      const migrated = migrateV1(parsed);
      setCapsule(migrated);
      setPrimerGenerated(!!migrated.nextSessionPrimer);
      setRiskFlags("");
      setImportSuccess(true);
      setImportWasMigrated(isV1);
      setActiveSection("overview");
      setTimeout(() => { setImportSuccess(false); setImportWasMigrated(false); }, 4000);
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
    handleFileUpload(e.dataTransfer.files[0]);
  }

  // ── AI: Primer ──
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
1. Establishes what was built and the current state
2. Flags the most important open thread to execute first
3. Lists 3 specific things Claude should do proactively in the new session
4. Notes any locked decisions NOT to re-litigate

Session title: ${capsule.meta.sessionTitle}
Project lane: ${capsule.meta.projectLane}
Built: ${capsule.built.map(b=>b.name+": "+b.description.slice(0,100)).join(" | ")}
Locked decisions: ${capsule.decisions.filter(d=>d.locked).map(d=>d.decision).join(" | ")}
Top open threads: ${capsule.openThreads.filter(t=>t.priority==="high").map(t=>t.thread+": "+t.context.slice(0,120)).join(" | ")}
Tags: ${capsule.tags.join(", ")}

Write as a direct instruction to the next Claude instance. Terse, no filler, no preamble.`
          }]
        })
      });
      const d = await r.json();
      const txt = d.content?.filter(b=>b.type==="text").map(b=>b.text).join("") || "";
      update("nextSessionPrimer", txt);
      setPrimerGenerated(true);
    } catch {
      update("nextSessionPrimer", "Generation failed — write manually.");
    }
    setGeneratingPrimer(false);
  }

  // ── AI: Risk Flags ──
  async function generateRiskFlags() {
    if (capsule.openThreads.length === 0) return;
    setGeneratingRisk(true);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:600,
          messages:[{ role:"user", content:
`You are a staff engineer reviewing a project's open threads and built artifacts for systemic risk.

Identify 3-5 specific risk flags — things the person may have normalized or not seen because they're too close to the work. Look for: sequencing risks, blockers that compound, gaps between what was built and what's needed, threads that conflict, and execution risks given the stated priorities.

Be direct and specific. Name the actual risk, not a category.

Project: ${capsule.meta.sessionTitle} (${capsule.meta.projectLane})
Open threads: ${capsule.openThreads.map(t=>`[${t.priority}] ${t.thread}: ${t.context.slice(0,150)}`).join("\n")}
Built: ${capsule.built.map(b=>`${b.name} [${b.status}]${b.blockers ? " — BLOCKED: "+b.blockers : ""}`).join(", ")}

Return only a numbered list. No preamble. No closing summary.`
          }]
        })
      });
      const d = await r.json();
      const txt = d.content?.filter(b=>b.type==="text").map(b=>b.text).join("") || "";
      setRiskFlags(txt);
    } catch {
      setRiskFlags("Generation failed.");
    }
    setGeneratingRisk(false);
  }

  // ── Export ──
  function exportJSON() {
    const payload = { ...capsule, meta: { ...capsule.meta, exportedAt: new Date().toISOString(), schema:"context-capsule-v2" } };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `capsule-${capsule.meta.sessionTitle.slice(0,28).replace(/\s+/g,"-").toLowerCase()}-${capsule.meta.date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(()=>setExported(false), 2000);
  }

  function copyJSON() {
    const payload = { ...capsule, meta: { ...capsule.meta, exportedAt: new Date().toISOString(), schema:"context-capsule-v2" } };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  }

  // ── Computed ──
  const NAV = [
    { id:"overview",  label:"Overview",         icon:"◈" },
    { id:"built",     label:"Built",             icon:"📦", count:capsule.built.length },
    { id:"decisions", label:"Decisions",         icon:"⚖️", count:capsule.decisions.length },
    { id:"threads",   label:"Open Threads",      icon:"🧵", count:capsule.openThreads.length },
    { id:"knowledge", label:"Project Knowledge", icon:"📚", count:capsule.projectKnowledge.length },
    { id:"primer",    label:"Next Session Primer",icon:"🚀" },
    { id:"import",    label:"Import",            icon:"⬆" },
    { id:"export",    label:"Export",            icon:"⬇" },
  ];

  const completenessChecks = [
    !!capsule.meta.sessionTitle,
    !!capsule.meta.projectLane,
    capsule.built.length > 0,
    capsule.decisions.length > 0,
    capsule.openThreads.length > 0,
    !!capsule.nextSessionPrimer,
  ];
  const pct = Math.round((completenessChecks.filter(Boolean).length / completenessChecks.length) * 100);

  const liveCount    = capsule.built.filter(b=>["live","pilot","deployed","shipped"].includes(b.status)).length;
  const blockedCount = capsule.built.filter(b=>b.blockers && b.blockers.trim()).length;
  const highCount    = capsule.openThreads.filter(t=>t.priority==="high").length;
  const lockedCount  = capsule.decisions.filter(d=>d.locked).length;

  const laneMeta = LANE_META[capsule.meta.projectLane] || LANE_META["Other"];

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight:"100vh", background:"#020817", fontFamily:"'Syne',sans-serif", color:"#e2e8f0",
        display:"flex", flexDirection:"column",
        backgroundImage:"radial-gradient(#0d1525 1px, transparent 1px)", backgroundSize:"24px 24px" }}>

        {/* ── TOP BAR ── */}
        <div style={{ padding:"10px 18px", borderBottom:"1px solid #0d1525", background:"#030912dd",
          backdropFilter:"blur(8px)", position:"sticky", top:0, zIndex:100,
          display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>

          {/* Logo + Title */}
          <div style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0 }}>
            <div style={{ fontSize:10, letterSpacing:3, color:"#6366f1", fontFamily:"'Space Mono',monospace", flexShrink:0 }}>◈ CAPSULE v2</div>
            {capsule.meta.projectLane && (
              <span style={{ fontSize:9, padding:"2px 9px", borderRadius:10, background:laneMeta.bg,
                color:laneMeta.color, border:`1px solid ${laneMeta.color}44`,
                fontFamily:"'Space Mono',monospace", flexShrink:0 }}>
                {capsule.meta.projectLane}
              </span>
            )}
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#e2e8f0", fontSize:13,
              whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
              {capsule.meta.sessionTitle || "Untitled Session"}
            </div>
          </div>

          {/* Status indicators */}
          <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
            {importSuccess && (
              <span style={{ fontSize:10, color:"#10b981", fontFamily:"'Space Mono',monospace", animation:"slideIn .3s ease" }}>
                {importWasMigrated ? "✓ migrated v1→v2" : "✓ loaded"}
              </span>
            )}
            {/* Completeness bar */}
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:72, height:3, background:"#1e293b", borderRadius:2 }}>
                <div style={{ width:`${pct}%`, height:"100%", background:pct===100?"#10b981":"#6366f1", borderRadius:2, transition:"width .4s ease" }}/>
              </div>
              <span style={{ fontSize:10, color:pct===100?"#10b981":"#475569", fontFamily:"'Space Mono',monospace" }}>{pct}%</span>
            </div>

            {/* Import quick-button */}
            <button className="btn" onClick={()=>setActiveSection("import")}
              style={{ background:"transparent", border:"1px solid #1e293b", borderRadius:7,
                padding:"5px 11px", color:"#475569", cursor:"pointer", fontSize:10,
                fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
              ⬆ import
            </button>

            <button className="btn" onClick={copyJSON}
              style={{ background:"transparent", border:"1px solid #1e293b", borderRadius:7,
                padding:"5px 11px", color:copied?"#10b981":"#64748b", cursor:"pointer", fontSize:10,
                fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
              {copied ? "✓ copied" : "⎘ copy"}
            </button>
            <button className="btn" onClick={exportJSON}
              style={{ background:exported?"#10b98122":"linear-gradient(135deg,#4f46e5,#7c3aed)",
                border:"none", borderRadius:7, padding:"5px 13px",
                color:exported?"#10b981":"#fff", cursor:"pointer", fontSize:10,
                fontFamily:"'Syne',sans-serif", fontWeight:700, transition:"all .2s" }}>
              {exported ? "✓ exported" : "⬇ Export JSON"}
            </button>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

          {/* Sidebar */}
          <div style={{ width:186, flexShrink:0, borderRight:"1px solid #0d1525", padding:"14px 10px",
            display:"flex", flexDirection:"column", gap:2, overflowY:"auto" }}>
            {NAV.map(n => (
              <button key={n.id} onClick={()=>setActiveSection(n.id)}
                className={`nav-item${activeSection===n.id?" active":""}`}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:0,
                  background:"transparent", border:"none", borderLeft:"2px solid transparent",
                  color:"#475569", cursor:"pointer", fontSize:12, fontFamily:"'Syne',sans-serif",
                  fontWeight:activeSection===n.id?600:400, textAlign:"left", width:"100%" }}>
                <span style={{ fontSize:12 }}>{n.icon}</span>
                <span style={{ flex:1 }}>{n.label}</span>
                {n.count !== undefined && (
                  <span style={{ fontSize:9, color:"#334155", fontFamily:"'Space Mono',monospace" }}>{n.count}</span>
                )}
              </button>
            ))}

            {/* New Capsule button */}
            <div style={{ marginTop:"auto", paddingTop:12, borderTop:"1px solid #0d1525" }}>
              <button className="btn" onClick={()=>{ setCapsule(BLANK_SEED); setRiskFlags(""); setPrimerGenerated(false); setActiveSection("overview"); }}
                style={{ width:"100%", background:"transparent", border:"1px dashed #1e293b", borderRadius:7,
                  padding:"7px 10px", color:"#334155", cursor:"pointer", fontSize:10,
                  fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
                + new capsule
              </button>
            </div>
          </div>

          {/* Content area */}
          <div style={{ flex:1, overflow:"auto", padding:"24px 28px", animation:"fadeUp .3s ease" }}>

            {/* ── OVERVIEW ── */}
            {activeSection==="overview" && (
              <div style={{ maxWidth:660 }}>
                <SectionHeader icon="◈" label="Session Overview"/>

                {/* Metrics row */}
                <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
                  <MetricCard label="Built" value={capsule.built.length} sub="artifacts / items" color="#6366f1"/>
                  <MetricCard label="Live/Shipped" value={liveCount} sub="deployed or done" color="#10b981"/>
                  <MetricCard label="Blocked" value={blockedCount} sub="have blockers" color="#f87171"/>
                  <MetricCard label="High Threads" value={highCount} sub="execute first" color="#f59e0b"/>
                  <MetricCard label="Locked" value={lockedCount} sub="don't re-litigate" color="#a78bfa"/>
                </div>

                {/* Meta fields */}
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[
                    { label:"SESSION TITLE", key:"meta.sessionTitle", placeholder:"e.g. Beta Tester Army — Build + Template System" },
                    { label:"SOURCE PROJECT", key:"meta.sourceProject", placeholder:"Where this session took place" },
                    { label:"DESTINATION PROJECT", key:"meta.destinationProject", placeholder:"Where you're migrating next →" },
                    { label:"OWNER", key:"meta.owner", placeholder:"e.g. Kyle Rosebrook" },
                  ].map(f => (
                    <div key={f.key} className="field-card"
                      style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"13px 16px", transition:"border-color .2s" }}>
                      <FieldLabel>{f.label}</FieldLabel>
                      <input value={f.key.split(".").reduce((o,k)=>o[k],capsule)}
                        onChange={e=>update(f.key,e.target.value)} placeholder={f.placeholder}
                        style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:6,
                          padding:"7px 10px", color:"#e2e8f0", fontSize:13, fontFamily:"'Syne',sans-serif",
                          transition:"border-color .2s" }}
                      />
                    </div>
                  ))}

                  {/* Project Lane */}
                  <div className="field-card" style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"13px 16px", transition:"border-color .2s" }}>
                    <FieldLabel>PROJECT LANE</FieldLabel>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      {["Intinc","Customization Service","Kinsley","Personal","Other"].map(lane => {
                        const m = LANE_META[lane] || LANE_META["Other"];
                        const active = capsule.meta.projectLane === lane;
                        return (
                          <button key={lane} className="btn" onClick={()=>{ update("meta.projectLane", lane); setShowOtherLane(lane==="Other"); }}
                            style={{ padding:"5px 13px", borderRadius:20, border:`1px solid ${active?m.color+"66":"#1e293b"}`,
                              background:active?m.bg:"transparent", color:active?m.color:"#475569",
                              cursor:"pointer", fontSize:11, fontFamily:"'Space Mono',monospace", transition:"all .15s" }}>
                            {lane}
                          </button>
                        );
                      })}
                    </div>
                    {(showOtherLane || (capsule.meta.projectLane && !["Intinc","Customization Service","Kinsley","Personal","Other"].includes(capsule.meta.projectLane))) && (
                      <input value={capsule.meta.projectLane} onChange={e=>update("meta.projectLane",e.target.value)}
                        placeholder="Custom lane name..." style={{ marginTop:8, width:"100%", background:"#080e1c",
                          border:"1px solid #1a2744", borderRadius:6, padding:"7px 10px", color:"#e2e8f0",
                          fontSize:12, fontFamily:"'Space Mono',monospace" }}/>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="field-card" style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"13px 16px", transition:"border-color .2s" }}>
                    <FieldLabel>TAGS</FieldLabel>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
                      {capsule.tags.map(tag => (
                        <span key={tag} className="tag-pill" onClick={()=>removeTag(tag)} title="click to remove"
                          style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:"#1a2744",
                            color:"#64748b", cursor:"pointer", border:"1px solid #1e293b", transition:"all .15s" }}>
                          #{tag} ×
                        </span>
                      ))}
                    </div>
                    <input placeholder="Add tag + Enter"
                      onKeyDown={e=>{ if(e.key==="Enter"){ addTag(e.target.value.trim().replace(/\s+/g,"-").toLowerCase()); e.target.value=""; }}}
                      style={{ background:"#080e1c", border:"1px solid #1a2744", borderRadius:6,
                        padding:"6px 10px", color:"#64748b", fontSize:12, fontFamily:"'Space Mono',monospace", width:160 }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── BUILT ── */}
            {activeSection==="built" && (
              <div style={{ maxWidth:700 }}>
                <SectionHeader icon="📦" label="What Was Built" count={capsule.built.length}/>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {capsule.built.map(item => (
                    <div key={item.id} className="field-card"
                      style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"16px 18px", transition:"border-color .2s", position:"relative" }}>
                      {/* Row 1: name + status + remove */}
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                        <input value={item.name} onChange={e=>updateArrayItem("built",item.id,"name",e.target.value)}
                          style={{ flex:1, background:"transparent", border:"none", color:"#e2e8f0", fontSize:14,
                            fontFamily:"'Syne',sans-serif", fontWeight:700 }}/>
                        <select value={item.status} onChange={e=>updateArrayItem("built",item.id,"status",e.target.value)}
                          style={{ background:"#0d1425", border:"1px solid #1e293b", borderRadius:6, padding:"3px 24px 3px 8px",
                            color:"#64748b", fontSize:11, cursor:"pointer", fontFamily:"'Space Mono',monospace" }}>
                          {Object.keys(STATUS_META).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <StatusBadge s={item.status}/>
                        <button className="remove-btn btn" onClick={()=>removeItem("built",item.id)}
                          style={{ background:"transparent", border:"none", color:"#334155", cursor:"pointer", fontSize:16, lineHeight:1 }}>×</button>
                      </div>
                      {/* Row 2: type + file + track */}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr 1fr", gap:8, marginBottom:10 }}>
                        <div>
                          <FieldLabel>TYPE</FieldLabel>
                          <input value={item.type} onChange={e=>updateArrayItem("built",item.id,"type",e.target.value)}
                            style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:5,
                              padding:"5px 8px", color:"#64748b", fontSize:11, fontFamily:"'Space Mono',monospace" }}/>
                        </div>
                        <div>
                          <FieldLabel>FILE / ARTIFACT</FieldLabel>
                          <input value={item.file} onChange={e=>updateArrayItem("built",item.id,"file",e.target.value)}
                            style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:5,
                              padding:"5px 8px", color:"#64748b", fontSize:11, fontFamily:"'Space Mono',monospace" }}/>
                        </div>
                        <div>
                          <FieldLabel>TRACK</FieldLabel>
                          <input value={item.track} onChange={e=>updateArrayItem("built",item.id,"track",e.target.value)}
                            placeholder="workstream…"
                            style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:5,
                              padding:"5px 8px", color:"#64748b", fontSize:11, fontFamily:"'Space Mono',monospace" }}/>
                        </div>
                      </div>
                      {/* Description */}
                      <FieldLabel>DESCRIPTION</FieldLabel>
                      <EditableText value={item.description} rows={3} onChange={v=>updateArrayItem("built",item.id,"description",v)}/>
                      {/* Milestone + Blockers */}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:8 }}>
                        <div>
                          <FieldLabel color="#22d3ee">NEXT MILESTONE</FieldLabel>
                          <EditableText value={item.nextMilestone} rows={2} onChange={v=>updateArrayItem("built",item.id,"nextMilestone",v)} placeholder="What ships next…"/>
                        </div>
                        <div>
                          <FieldLabel color={item.blockers?.trim() ? "#f87171" : "#334155"}>
                            {item.blockers?.trim() ? "⚠ BLOCKERS" : "BLOCKERS"}
                          </FieldLabel>
                          <EditableText value={item.blockers} rows={2} onChange={v=>updateArrayItem("built",item.id,"blockers",v)} placeholder="None"/>
                        </div>
                      </div>
                    </div>
                  ))}
                  <AddButton onClick={()=>addItem("built",{ name:"New Item", type:"artifact", file:"", description:"", status:"in-progress", track:"", nextMilestone:"", blockers:"" })} label="+ add item"/>
                </div>
              </div>
            )}

            {/* ── DECISIONS ── */}
            {activeSection==="decisions" && (
              <div style={{ maxWidth:700 }}>
                <SectionHeader icon="⚖️" label="Key Decisions" count={capsule.decisions.length}/>
                <div style={{ fontSize:11, color:"#334155", marginBottom:14, fontFamily:"'Space Mono',monospace" }}>
                  Lock a decision to mark it final — won't be re-litigated in the next session.
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {capsule.decisions.map(d => (
                    <div key={d.id} className="field-card"
                      style={{ background:"#060c1a", border:"1px solid #0d1525",
                        borderLeft:`3px solid ${d.locked?"#ef4444":"#6366f1"}`, borderRadius:10, padding:"16px 18px",
                        transition:"border-color .2s", position:"relative" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                        <input value={d.decision} onChange={e=>updateArrayItem("decisions",d.id,"decision",e.target.value)}
                          style={{ flex:1, background:"transparent", border:"none", color:"#e2e8f0",
                            fontSize:13, fontFamily:"'Syne',sans-serif", fontWeight:600 }}/>
                        {/* Lock toggle */}
                        <button className="btn" title={d.locked?"Unlock decision":"Lock decision — don't re-litigate"}
                          onClick={()=>updateArrayItem("decisions",d.id,"locked",!d.locked)}
                          style={{ background:"transparent", border:"none", cursor:"pointer",
                            fontSize:13, color:d.locked?"#ef4444":"#334155", transition:"color .15s", padding:"0 4px" }}>
                          {d.locked ? "🔒" : "🔓"}
                        </button>
                        {d.locked && <span className="lock-badge">🔒 locked</span>}
                        <button className="remove-btn btn" onClick={()=>removeItem("decisions",d.id)}
                          style={{ background:"transparent", border:"none", color:"#334155", cursor:"pointer", fontSize:16, lineHeight:1 }}>×</button>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                        <div>
                          <FieldLabel color="#10b981">RATIONALE</FieldLabel>
                          <EditableText value={d.rationale} rows={2} onChange={v=>updateArrayItem("decisions",d.id,"rationale",v)}/>
                        </div>
                        <div>
                          <FieldLabel color={d.locked?"#475569":"#f59e0b"}>
                            {d.locked ? "ALTERNATIVES (CLOSED)" : "ALTERNATIVES CONSIDERED"}
                          </FieldLabel>
                          <EditableText value={d.alternatives} rows={2} onChange={v=>updateArrayItem("decisions",d.id,"alternatives",v)}/>
                        </div>
                      </div>
                    </div>
                  ))}
                  <AddButton onClick={()=>addItem("decisions",{ decision:"New Decision", rationale:"", alternatives:"", locked:false })} label="+ add decision"/>
                </div>
              </div>
            )}

            {/* ── OPEN THREADS ── */}
            {activeSection==="threads" && (
              <div style={{ maxWidth:700 }}>
                <SectionHeader icon="🧵" label="Open Threads" count={capsule.openThreads.length}/>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                  <div style={{ fontSize:11, color:"#334155", fontFamily:"'Space Mono',monospace" }}>
                    Sorted high → low. High priority = execute first next session.
                  </div>
                  {/* Risk flags generator */}
                  <button className="btn" onClick={generateRiskFlags} disabled={generatingRisk || capsule.openThreads.length===0}
                    style={{ background:generatingRisk?"transparent":"linear-gradient(135deg,#7c2d12,#dc2626)",
                      border:generatingRisk?"1px solid #334155":"none", borderRadius:7, padding:"6px 13px",
                      color:generatingRisk?"#475569":"#fff", cursor:"pointer", fontSize:10,
                      fontFamily:"'Space Mono',monospace", transition:"all .2s", display:"flex", alignItems:"center", gap:6 }}>
                    {generatingRisk ? (
                      <><div style={{ width:10, height:10, border:"2px solid #33415544", borderTopColor:"#ef4444", borderRadius:"50%", animation:"spin .7s linear infinite" }}/> scanning…</>
                    ) : "⚠ AI Risk Flags"}
                  </button>
                </div>

                {riskFlags && (
                  <div style={{ background:"#1c0505", border:"1px solid #7f1d1d", borderRadius:10, padding:"14px 16px", marginBottom:16, animation:"fadeUp .3s ease" }}>
                    <FieldLabel color="#f87171">AI RISK FLAGS — Read before next session</FieldLabel>
                    <pre style={{ color:"#fca5a5", fontSize:12, lineHeight:1.7, fontFamily:"'Space Mono',monospace", whiteSpace:"pre-wrap", marginTop:6 }}>{riskFlags}</pre>
                    <button onClick={()=>setRiskFlags("")} style={{ marginTop:8, background:"transparent", border:"none", color:"#7f1d1d", cursor:"pointer", fontSize:10, fontFamily:"'Space Mono',monospace" }}>dismiss</button>
                  </div>
                )}

                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[...capsule.openThreads]
                    .sort((a,b)=>({high:0,medium:1,low:2}[a.priority]-{high:0,medium:1,low:2}[b.priority]))
                    .map(t => (
                    <div key={t.id} className="field-card"
                      style={{ background:"#060c1a", border:"1px solid #0d1525",
                        borderLeft:`3px solid ${PRIORITY_META[t.priority]?.text||"#6366f1"}`, borderRadius:10, padding:"16px 18px",
                        transition:"border-color .2s", position:"relative" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                        <input value={t.thread} onChange={e=>updateArrayItem("openThreads",t.id,"thread",e.target.value)}
                          style={{ flex:1, background:"transparent", border:"none", color:"#e2e8f0",
                            fontSize:13, fontFamily:"'Syne',sans-serif", fontWeight:600 }}/>
                        <select value={t.priority} onChange={e=>updateArrayItem("openThreads",t.id,"priority",e.target.value)}
                          style={{ background:"#0d1425", border:"1px solid #1e293b", borderRadius:6, padding:"3px 22px 3px 8px",
                            color:"#64748b", fontSize:11, cursor:"pointer", fontFamily:"'Space Mono',monospace" }}>
                          <option value="high">high</option>
                          <option value="medium">medium</option>
                          <option value="low">low</option>
                        </select>
                        <PriorityBadge p={t.priority}/>
                        <button className="remove-btn btn" onClick={()=>removeItem("openThreads",t.id)}
                          style={{ background:"transparent", border:"none", color:"#334155", cursor:"pointer", fontSize:16, lineHeight:1 }}>×</button>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:10 }}>
                        <div>
                          <FieldLabel>CONTEXT</FieldLabel>
                          <EditableText value={t.context} rows={3} onChange={v=>updateArrayItem("openThreads",t.id,"context",v)}/>
                        </div>
                        <div>
                          <FieldLabel color="#22d3ee">NEXT ACTION</FieldLabel>
                          <EditableText value={t.nextAction} rows={3} onChange={v=>updateArrayItem("openThreads",t.id,"nextAction",v)}/>
                        </div>
                      </div>
                    </div>
                  ))}
                  <AddButton onClick={()=>addItem("openThreads",{ thread:"New Thread", priority:"medium", context:"", nextAction:"" })} label="+ add thread"/>
                </div>
              </div>
            )}

            {/* ── PROJECT KNOWLEDGE ── */}
            {activeSection==="knowledge" && (
              <div style={{ maxWidth:700 }}>
                <SectionHeader icon="📚" label="Project Knowledge Used" count={capsule.projectKnowledge.length}/>
                <div style={{ fontSize:11, color:"#334155", marginBottom:14, fontFamily:"'Space Mono',monospace" }}>
                  Which files from the source project were most useful — so the next session can find them.
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {capsule.projectKnowledge.map(k => (
                    <div key={k.id} className="field-card"
                      style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"16px 18px",
                        transition:"border-color .2s", position:"relative" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                        <input value={k.file} onChange={e=>updateArrayItem("projectKnowledge",k.id,"file",e.target.value)}
                          style={{ flex:1, background:"transparent", border:"none", color:"#94a3b8",
                            fontSize:12, fontFamily:"'Space Mono',monospace" }} placeholder="filename or description"/>
                        <select value={k.relevance} onChange={e=>updateArrayItem("projectKnowledge",k.id,"relevance",e.target.value)}
                          style={{ background:"#0d1425", border:"1px solid #1e293b", borderRadius:6, padding:"3px 22px 3px 8px",
                            color:"#64748b", fontSize:11, cursor:"pointer", fontFamily:"'Space Mono',monospace" }}>
                          <option value="high">high</option>
                          <option value="medium">medium</option>
                          <option value="low">low</option>
                        </select>
                        <button className="remove-btn btn" onClick={()=>removeItem("projectKnowledge",k.id)}
                          style={{ background:"transparent", border:"none", color:"#334155", cursor:"pointer", fontSize:16, lineHeight:1 }}>×</button>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:10 }}>
                        <div>
                          <FieldLabel>KEY INSIGHTS</FieldLabel>
                          <EditableText value={k.keyInsights} rows={3} onChange={v=>updateArrayItem("projectKnowledge",k.id,"keyInsights",v)}/>
                        </div>
                        <div>
                          <FieldLabel color="#6366f1">USED FOR</FieldLabel>
                          <EditableText value={k.usedFor} rows={3} onChange={v=>updateArrayItem("projectKnowledge",k.id,"usedFor",v)}/>
                        </div>
                      </div>
                    </div>
                  ))}
                  <AddButton onClick={()=>addItem("projectKnowledge",{ file:"", relevance:"high", keyInsights:"", usedFor:"" })} label="+ add file"/>
                </div>
              </div>
            )}

            {/* ── PRIMER ── */}
            {activeSection==="primer" && (
              <div style={{ maxWidth:660 }}>
                <SectionHeader icon="🚀" label="Next Session Primer"/>
                <div style={{ fontSize:12, color:"#475569", marginBottom:16, lineHeight:1.6 }}>
                  A dense cold-start message for the next Claude instance. Paste as your first message in the new project — eliminates re-deriving context.
                </div>
                <div style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"20px" }}>
                  {!capsule.nextSessionPrimer && !generatingPrimer && (
                    <div style={{ textAlign:"center", padding:"24px 0" }}>
                      <div style={{ color:"#334155", fontSize:12, marginBottom:16, fontFamily:"'Space Mono',monospace" }}>No primer generated yet.</div>
                      <button className="btn" onClick={generatePrimer}
                        style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none",
                          borderRadius:8, padding:"10px 22px", color:"#fff", cursor:"pointer",
                          fontSize:13, fontFamily:"'Syne',sans-serif", fontWeight:700, transition:"all .2s" }}>
                        ✨ Generate AI Primer
                      </button>
                    </div>
                  )}
                  {generatingPrimer && (
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"20px 0", color:"#6366f1",
                      fontSize:12, fontFamily:"'Space Mono',monospace" }}>
                      <div style={{ width:14, height:14, border:"2px solid #6366f133", borderTopColor:"#6366f1",
                        borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
                      Synthesizing session context…
                    </div>
                  )}
                  {capsule.nextSessionPrimer && (
                    <>
                      <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace",
                        marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span>PRIMER TEXT {primerGenerated && <span style={{ color:"#10b981" }}>· AI GENERATED</span>}</span>
                        <button className="btn" onClick={generatePrimer}
                          style={{ background:"transparent", border:"none", color:"#6366f1", cursor:"pointer",
                            fontSize:10, fontFamily:"'Space Mono',monospace" }}>
                          ↺ regenerate
                        </button>
                      </div>
                      <EditableText value={capsule.nextSessionPrimer} rows={10}
                        onChange={v=>update("nextSessionPrimer",v)}
                        placeholder="Write or generate a cold-start primer for the next session…"/>
                      <button className="btn"
                        onClick={()=>{ navigator.clipboard.writeText(capsule.nextSessionPrimer); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
                        style={{ marginTop:10, background:"transparent", border:"1px solid #1e293b", borderRadius:6,
                          padding:"6px 14px", color:copied?"#10b981":"#64748b", cursor:"pointer",
                          fontSize:11, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
                        {copied ? "✓ copied" : "⎘ copy primer text"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── IMPORT ── */}
            {activeSection==="import" && (
              <div style={{ maxWidth:600 }}>
                <SectionHeader icon="⬆" label="Import Capsule"/>
                <div style={{ fontSize:12, color:"#475569", marginBottom:16, lineHeight:1.6 }}>
                  Load a previously exported JSON. v1 capsules are automatically migrated to v2 schema — new fields (track, nextMilestone, blockers, locked) will be empty.
                </div>

                {/* Drag + Drop zone */}
                <div
                  className={`drop-zone${isDragOver?" drag-over":""}`}
                  onDragOver={e=>{ e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={()=>setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={()=>fileInputRef.current?.click()}
                  style={{ background:"#060c1a", border:"2px dashed #1e293b", borderRadius:12,
                    padding:"32px", textAlign:"center", cursor:"pointer", marginBottom:16 }}>
                  <div style={{ fontSize:24, marginBottom:8 }}>⬆</div>
                  <div style={{ color:"#475569", fontSize:13, marginBottom:4 }}>Drop a capsule JSON here</div>
                  <div style={{ color:"#334155", fontSize:11, fontFamily:"'Space Mono',monospace" }}>or click to browse</div>
                  <input ref={fileInputRef} type="file" accept=".json" style={{ display:"none" }}
                    onChange={e=>handleFileUpload(e.target.files[0])}/>
                </div>

                <PasteImport onImport={importFromJSON}/>

                {importError && (
                  <div style={{ marginTop:12, padding:"10px 14px", background:"#1c0505", border:"1px solid #7f1d1d",
                    borderRadius:8, color:"#f87171", fontSize:12, fontFamily:"'Space Mono',monospace" }}>
                    ✕ {importError}
                  </div>
                )}
                {importSuccess && (
                  <div style={{ marginTop:12, padding:"10px 14px", background:"#052e16", border:"1px solid #166534",
                    borderRadius:8, color:"#4ade80", fontSize:12, fontFamily:"'Space Mono',monospace", animation:"slideIn .3s ease" }}>
                    ✓ {importWasMigrated ? "Migrated from v1 → v2. New fields (track, nextMilestone, blockers, locked) are empty — fill as needed." : "Capsule loaded successfully."}
                  </div>
                )}
              </div>
            )}

            {/* ── EXPORT ── */}
            {activeSection==="export" && (
              <div style={{ maxWidth:580 }}>
                <SectionHeader icon="⬇" label="Export Capsule"/>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[
                    { label:"JSON File", desc:"Full structured capsule. Import back into this tool or feed directly to Claude API.", action:exportJSON, btn:"⬇ Download JSON", color:"linear-gradient(135deg,#1d4ed8,#0ea5e9)" },
                    { label:"Copy to Clipboard", desc:"Paste directly into the next Claude session as context. Best combined with the primer.", action:copyJSON, btn:copied?"✓ Copied":"⎘ Copy JSON", color:"linear-gradient(135deg,#4f46e5,#7c3aed)" },
                  ].map(opt => (
                    <div key={opt.label} style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10,
                      padding:"20px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
                      <div>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#e2e8f0", fontSize:14, marginBottom:4 }}>{opt.label}</div>
                        <div style={{ color:"#475569", fontSize:12, lineHeight:1.5 }}>{opt.desc}</div>
                      </div>
                      <button className="btn" onClick={opt.action}
                        style={{ background:opt.color, border:"none", borderRadius:8, padding:"10px 18px",
                          color:"#fff", cursor:"pointer", fontSize:12, fontFamily:"'Syne',sans-serif",
                          fontWeight:700, flexShrink:0, transition:"all .2s" }}>
                        {opt.btn}
                      </button>
                    </div>
                  ))}

                  {/* Schema preview */}
                  <div style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"16px 18px" }}>
                    <FieldLabel>JSON SCHEMA — v2</FieldLabel>
                    <pre style={{ color:"#334155", fontSize:11, lineHeight:1.7, fontFamily:"'Space Mono',monospace", overflow:"auto", marginTop:8 }}>
{`{
  "meta": { sessionTitle, projectLane, sourceProject,
            destinationProject, owner, date, schema },
  "built": [{ name, type, file, description, status,
              track, nextMilestone, blockers }],
  "decisions": [{ decision, rationale, alternatives, locked }],
  "openThreads": [{ thread, priority, context, nextAction }],
  "projectKnowledge": [{ file, relevance, keyInsights, usedFor }],
  "nextSessionPrimer": "...",
  "tags": []
}`}
                    </pre>
                  </div>

                  {/* Migration checklist */}
                  <div style={{ background:"#031a0f", border:"1px solid #10b98133", borderRadius:10, padding:"16px 18px" }}>
                    <FieldLabel color="#10b981">MIGRATION CHECKLIST</FieldLabel>
                    {[
                      ["Session title filled in",       !!capsule.meta.sessionTitle],
                      ["Project lane selected",          !!capsule.meta.projectLane],
                      ["Destination project named",      !!capsule.meta.destinationProject],
                      ["Built artifacts documented",     capsule.built.length > 0],
                      ["Key decisions recorded",         capsule.decisions.length > 0],
                      ["Open threads prioritized",       capsule.openThreads.length > 0],
                      ["Primer generated",               !!capsule.nextSessionPrimer],
                      ["JSON exported",                  exported],
                    ].map(([item, done], i) => (
                      <div key={i} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:5 }}>
                        <span style={{ color:done?"#10b981":"#1e293b", fontSize:12 }}>{done?"✓":"○"}</span>
                        <span style={{ color:done?"#6ee7b7":"#334155", fontSize:12 }}>{item}</span>
                      </div>
                    ))}
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
