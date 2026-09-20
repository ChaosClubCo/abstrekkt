import { useState, useRef } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0d1117}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes glow{0%,100%{box-shadow:0 0 8px #6366f133}50%{box-shadow:0 0 20px #6366f166}}
  .btn:hover{filter:brightness(1.12);transform:translateY(-1px)}.btn:active{transform:translateY(0)}
  textarea:focus,input:focus{outline:none!important;border-color:#6366f155!important;box-shadow:0 0 0 2px #6366f111}
  .field-card:hover{border-color:#1e293b!important}
  .tag-pill:hover{background:#1e293b!important;color:#94a3b8!important}
  .copy-flash{animation:pulse .3s ease}
`;

// ── SEED DATA (this session) ────────────────────────────────────────────────
const SESSION_SEED = {
  meta: {
    sessionTitle: "Skills Library — 2025 Arch Compliance Audit + Deployment Prep",
    sourceProject: "Intinc Claude Skills Library (D:\\03_Development\\Skills)",
    destinationProject: "",
    date: new Date().toISOString().split("T")[0],
    version: "1.0",
  },
  built: [
    {
      id: "b1",
      name: "Phase 1+2 Skills (50 production-ready)",
      type: "skill-pack",
      file: "D:\\03_Development\\Skills\\INT-Skills\\intinc-business-skills\\ + intinc-strategy-skills\\",
      description: "50 skills built to production-ready standard following 2025 Anthropic Skills Architecture. Categories: business (ops, sales, CS, marketing, HR) and strategy. Gerund-first kebab-case naming. Compliance against 2025 spec is the primary open risk — description triggers, version nesting, and allowed-tools coverage must be validated before deployment.",
      status: "shipped",
    },
    {
      id: "b2",
      name: "Pipeline Tooling Suite",
      type: "scripts",
      file: "skill_validator.py, fix-skills-unified.py, sync-skills.py, populate-all.py, run-convert.bat",
      description: "Automation scripts for validation, remediation, sync, and batch population of skills. Lives in D:\\03_Development\\Skills. skill_validator.py is the primary compliance gate. fix-skills-unified.py handles batch frontmatter remediation. These are the levers for the 4 compliance gaps.",
      status: "shipped",
    },
    {
      id: "b3",
      name: "Chris Butler 5-Skill Suite",
      type: "skill-pack",
      file: "INT-Int-Specd-skills\\chris-butler-*",
      description: "Five-skill suite for INT Inc.'s Business Development Specialist. Covers both outward-facing (prospect research, proposal generation, outreach sequencing) and inward-facing (pipeline reporting, activity logging) roles. Client-specific customization proof of concept for the Customization Service.",
      status: "shipped",
    },
    {
      id: "b4",
      name: "LastPass-to-Bitwarden Migration Agent",
      type: "agent",
      file: "Microsoft Copilot Studio + Claude knowledge base",
      description: "Teams-embedded chatbot with comprehensive knowledge base for guiding LastPass-to-Bitwarden migration. Uses Claude for KB and Microsoft Copilot Studio as the deployment surface. In development — knowledge base built, Teams integration pending validation.",
      status: "in-progress",
    },
    {
      id: "b5",
      name: "intinc-skills-analysis.md",
      type: "document",
      file: "intinc-skills-analysis.md (project knowledge)",
      description: "Full architecture doc: 259-skill plan, 6-category structure, dependency map (Layers 0-4), gap analysis (130+ missing skills for B2B AIaaS platform), phase breakdown (5 phases, 12 weeks), per-skill quality checklist, and business impact metrics. Authoritative reference for build sequencing.",
      status: "shipped",
    },
  ],
  decisions: [
    {
      id: "d1",
      decision: "2025 Anthropic Skills Architecture is the governing spec — supersedes all prior patterns",
      rationale: "Anthropic published updated standards in 2025 that differ materially from what was built against. Triggers/hooks are Claude Code-only (invalid on claude.ai uploads). Version nests under metadata, not top-level. Description is the primary discovery mechanism, not trigger objects. Any skill not conforming will fail silently on claude.ai.",
      alternatives: "Continue with prior arch patterns — rejected because claude.ai rejects triggers: and hooks: objects outright",
    },
    {
      id: "d2",
      decision: "Gerund-first kebab-case naming convention locked (e.g., qualifying-leads, not lead-qualification)",
      rationale: "Consistent with 2025 Anthropic naming guidance and action-oriented discovery. Already applied across 50 Phase 1+2 skills. Renaming now would break any downstream references and delay deployment.",
      alternatives: "Noun-first (lead-qualification) — rejected, not aligned with 2025 spec",
    },
    {
      id: "d3",
      decision: "claude.ai and Claude Code are separate build targets with incompatible formats",
      rationale: "claude.ai rejects triggers: objects, hooks: objects, and skill-rules.json files — these are Claude Code-only features. Skills must be audited against their intended deployment surface before packaging. Mixing formats causes silent failures on upload.",
      alternatives: "Single format for both — technically impossible given Anthropic's platform split",
    },
    {
      id: "d4",
      decision: "Description field is the primary (and on claude.ai, only) skill discovery mechanism",
      rationale: "Weak descriptions = skills that never activate. Each description must include explicit 'Use when...' trigger phrases matching real user intent. This is the highest-leverage compliance fix — it affects whether deployed skills actually get used.",
      alternatives: "Rely on triggers: objects for discovery — invalid on claude.ai; not viable for the primary deployment target",
    },
    {
      id: "d5",
      decision: "500-line hard limit on SKILL.md — progressive disclosure via references/ directory",
      rationale: "Anthropic's progressive disclosure architecture: metadata (~100 tokens at startup), full SKILL.md (<5k tokens on activation), bundled resources (loaded only as needed). Skills over 500 lines degrade context efficiency. Overflow goes to references/*.md files.",
      alternatives: "No line limit, everything in SKILL.md — rejected, violates progressive disclosure and context budget",
    },
    {
      id: "d6",
      decision: "allowed-tools implements least privilege — each skill declares only tools it actually needs",
      rationale: "Security posture: skills should not have access to tools they don't use. Undeclared allowed-tools falls back to standard permission model (acceptable), but explicitly over-permissioned skills are an AppSec risk. Priority for security-sensitive skills (file ops, code execution, network calls).",
      alternatives: "Omit allowed-tools entirely for simplicity — acceptable for low-risk skills, not for security-sensitive ones",
    },
    {
      id: "d7",
      decision: "6-category library architecture: business, strategy, technical, creative, industry, ai-ops (50 each = 300 total)",
      rationale: "intinc-ai-ops-skills added as 6th category for clean separation of AI product management, MLOps/AI engineering, governance, and customer enablement concerns. Original 259-skill plan grows to 300 with this category. Cleaner separation of concerns than stuffing AI ops into strategy or technical.",
      alternatives: "5 categories (fit AI ops into strategy or technical) — rejected, too broad for an AIaaS department mandate",
    },
    {
      id: "d8",
      decision: "Compliance remediation before Tier 1 enhancements — fix before expand",
      rationale: "69-skill Tier 1 enhancement plan exists but starts after deployment. Deploying non-compliant skills to Intinc team first and discovering silent failures wastes credibility. The 4 compliance gaps (description triggers, version nesting, hooks stripping, allowed-tools) must be resolved across all 50 Phase 1+2 skills before any user-facing deployment.",
      alternatives: "Enhance first, remediate later — rejected, shipping broken skills to internal users undermines the whole AI practice mandate",
    },
  ],
  openThreads: [
    {
      id: "t1",
      thread: "COMPLIANCE: Strip triggers/hooks from all claude.ai-targeted skills",
      priority: "high",
      context: "triggers: objects and hooks: objects in YAML frontmatter are Claude Code-only. Any skill intended for claude.ai upload that contains these fields will fail on upload or activate silently. Must audit all 50 Phase 1+2 skills. Use fix-skills-unified.py to batch-strip. Confirm deployment target (claude.ai vs Claude Code) per skill before touching.",
      nextAction: "Run skill_validator.py against all 50 skills, pipe output to identify triggers/hooks violations. Batch fix with fix-skills-unified.py.",
    },
    {
      id: "t2",
      thread: "COMPLIANCE: Rewrite weak descriptions — add 'Use when...' trigger phrases to all 50 skills",
      priority: "high",
      context: "Description field is the only discovery mechanism on claude.ai. Skills with generic descriptions (e.g., 'Analyze Excel spreadsheets') will not activate reliably. Every description must include: what the skill does (action-oriented, third-person) + explicit 'Use when...' phrases that match user intent. Max 1024 chars. This is the highest-leverage fix for post-deployment adoption.",
      nextAction: "Audit all 50 skill descriptions. Flag any without 'Use when...' language. Rewrite flagged ones with specificity — include user-intent phrases, not just capability descriptions.",
    },
    {
      id: "t3",
      thread: "COMPLIANCE: Nest version field under metadata in all YAML frontmatter",
      priority: "high",
      context: "2025 spec: version is not a top-level YAML field. It nests under metadata: { version: '1.0.0' }. Top-level version fields are ignored or may cause parse issues depending on the runtime. Only permitted top-level fields are: name, description, license, allowed-tools, compatibility, metadata. Everything else goes under metadata.",
      nextAction: "grep -r '^version:' D:\\03_Development\\Skills to find all violations. Use fix-skills-unified.py or a targeted sed/yq script to migrate version to metadata.version across all affected files.",
    },
    {
      id: "t4",
      thread: "COMPLIANCE: Implement allowed-tools least privilege on security-sensitive skills",
      priority: "high",
      context: "Skills with file ops, code execution, network calls, or credential handling must declare allowed-tools with only the tools they need. Omitting allowed-tools is acceptable for low-risk skills but not for anything touching Bash, Write, or network tools. Priority targets: any skill in the pipeline that touches the filesystem, executes code, or handles auth flows. Claude Code only — this field has no effect on claude.ai.",
      nextAction: "Identify skills that use Bash, Write, WebFetch, or similar high-risk tools. Add allowed-tools declaration with minimum required set. Document rationale per skill.",
    },
    {
      id: "t5",
      thread: "Deploy Phase 1+2 skills to Intinc team (Daniel, Dave, Gwen, Jackie)",
      priority: "high",
      context: "Internal deployment is the 30-day definition of done — skills actively used at Intinc. Persona-specific skill packages needed per team member. Deployment is blocked by compliance remediation (t1-t4). Once compliant: package per persona, deliver via skill-packager, validate activation with each team member. Jackie and Gwen are likely different personas from Daniel and Dave.",
      nextAction: "Blocked on t1-t4. Once compliance gaps resolved: define persona packages per team member, package with skill-packager, pilot with one team member first.",
    },
    {
      id: "t6",
      thread: "Tier 1 Enhancement Plan (69 skills) — execute after deployment",
      priority: "medium",
      context: "69-skill enhancement plan exists and is scoped but not started. Intentionally deferred until Phase 1+2 skills are deployed and the team is actively using them. Usage data from initial deployment should inform which enhancements are highest priority. Do not start Tier 1 until at least one Intinc team member has run a skill in production.",
      nextAction: "After deployment validation, review Tier 1 list against actual usage patterns. Execute highest-leverage enhancements first.",
    },
    {
      id: "t7",
      thread: "Complete remaining 209 skills (4 categories: technical, creative, industry, ai-ops)",
      priority: "medium",
      context: "Per intinc-skills-analysis.md: intinc-technical-skills (50), intinc-strategy-skills (50, partially built), intinc-creative-skills (50), intinc-industry-skills (50), intinc-ai-ops-skills (50 across AI PM, MLOps, governance, customer enablement). Phase 3-5 per the 12-week plan. Not started. Blocked by Phase 1+2 deployment.",
      nextAction: "Sequence: technical (Phase 3, Weeks 5-6) → industry + creative (Phase 4, Weeks 7-8) → completion pass (Phase 5, Weeks 9-12).",
    },
    {
      id: "t8",
      thread: "First client-ready bundle for Customization Service",
      priority: "medium",
      context: "Second half of the 30-day definition of done: first client-ready bundle packaged for the Customization Service targeting Tech/SaaS companies. Chris Butler 5-skill suite is the proof of concept. Target: $300K-$500K Y1 revenue, 50-80% margins, 45 products. Bundle must be packaged, documented, and priced before any client conversations.",
      nextAction: "After internal deployment validated: refine Chris Butler suite as template, define pricing model, package as Customization Service v1 deliverable.",
    },
    {
      id: "t9",
      thread: "LastPass-to-Bitwarden migration agent — Teams integration",
      priority: "medium",
      context: "Knowledge base is built. Microsoft Copilot Studio is the deployment surface. Teams-embedded chatbot pending validation. This is an Intinc-specific technical deliverable, not part of the Skills Library per se — but it runs on Claude and demonstrates the AIaaS model internally.",
      nextAction: "Validate Teams embedding in Copilot Studio. Test KB retrieval quality. Ship to first Intinc user.",
    },
    {
      id: "t10",
      thread: "skills.sh publication + MCP integration for Windows",
      priority: "low",
      context: "Post-deployment external distribution. skills.sh is the community marketplace. MCP integration for Windows system would make skills available as MCP tools — broader distribution model. Not on the critical path to internal deployment or first client bundle.",
      nextAction: "After internal deployment and client bundle are shipped. Evaluate skills.sh submission criteria first.",
    },
  ],
  projectKnowledge: [
    {
      id: "k1",
      file: "intinc-skills-analysis.md (project knowledge)",
      relevance: "high",
      keyInsights: "259→300 skill plan across 6 categories. Dependency map: Layer 0 (AI ops foundations) → Layer 4 (specialized vertical). Phase breakdown: Phase 1 (strategy, 20 skills) → Phase 5 (completion + integration, Weeks 9-12). Per-skill quality checklist with 20+ gates. Business impact targets: 30% faster deal close, 40% faster onboarding, 70% faster AI incident response.",
      usedFor: "Build sequencing, compliance checklist design, category architecture decisions",
    },
    {
      id: "k2",
      file: "2025 Anthropic Skills Architecture spec (session-provided)",
      relevance: "high",
      keyInsights: "YAML frontmatter: only name, description, license, allowed-tools, compatibility, metadata permitted at top level. version nests under metadata. triggers: and hooks: are Claude Code-only — invalid on claude.ai. Description is primary discovery mechanism (max 1024 chars). 500-line SKILL.md limit. Progressive disclosure: 3-layer loading pattern.",
      usedFor: "Identified all 4 compliance gaps. Governs all future skill builds and remediation work.",
    },
    {
      id: "k3",
      file: "Pipeline scripts: skill_validator.py, fix-skills-unified.py, sync-skills.py",
      relevance: "high",
      keyInsights: "skill_validator.py = primary compliance gate (YAML parse, field validation, line count). fix-skills-unified.py = batch frontmatter remediation (can strip invalid fields, restructure YAML). sync-skills.py = syncs between local and deployment targets. All at D:\\03_Development\\Skills.",
      usedFor: "Executing compliance gap remediation at scale across 50+ skills",
    },
    {
      id: "k4",
      file: "User preferences framework (personal, loaded in session)",
      relevance: "medium",
      keyInsights: "Three project lanes: Intinc (Staff Engineer + AI practice), Customization Service (AIaaS client revenue), Kinsley Apps (personal). No context bleeding between lanes. Execution > planning. Complete production-ready outputs, no placeholders. Security-first defaults. Architecture-first before features.",
      usedFor: "Session prioritization, output format, deciding to fix before expand",
    },
  ],
  nextSessionPrimer: "",
  tags: ["skills-library", "intinc", "compliance-audit", "2025-arch", "claude-ai-deployment", "yaml-frontmatter", "allowed-tools", "deployment-prep", "phase-1-2"],
};

// ── COMPONENTS ──────────────────────────────────────────────────────────────
function SectionHeader({ icon, label, count }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
      <span style={{ fontSize:16 }}>{icon}</span>
      <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#e2e8f0", fontSize:15 }}>{label}</span>
      {count !== undefined && (
        <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"#1e293b", color:"#475569", fontFamily:"'Space Mono',monospace" }}>{count}</span>
      )}
    </div>
  );
}

function PriorityBadge({ p }) {
  const c = p==="high"?"#ef4444":p==="medium"?"#f59e0b":"#22d3ee";
  return <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:c+"22", color:c, border:`1px solid ${c}44`, fontFamily:"'Space Mono',monospace" }}>{p}</span>;
}

function StatusBadge({ s }) {
  const c = s==="shipped"?"#10b981":s==="in-progress"?"#22d3ee":"#6366f1";
  return <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:c+"22", color:c, fontFamily:"'Space Mono',monospace" }}>{s}</span>;
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

// ── MAIN ────────────────────────────────────────────────────────────────────
export default function ContextCapsule() {
  const [capsule, setCapsule] = useState(SESSION_SEED);
  const [activeSection, setActiveSection] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);
  const [primerGenerated, setPrimerGenerated] = useState(false);
  const [generatingPrimer, setGeneratingPrimer] = useState(false);

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
    if (tag && !capsule.tags.includes(tag)) {
      setCapsule(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  }

  function removeTag(tag) {
    setCapsule(prev => ({ ...prev, tags: prev.tags.filter(t=>t!==tag) }));
  }

  async function generatePrimer() {
    setGeneratingPrimer(true);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{ role:"user", content:
            `You are writing a cold-start primer for the NEXT Claude instance that will receive this session handoff.

Write a dense, efficient 150-200 word primer that:
1. Establishes what was built and the current state
2. Flags the most important open thread to execute first
3. Lists 3 specific things Claude should do proactively in the new session
4. Notes any key constraints or decisions NOT to re-litigate

Session built: ${capsule.built.map(b=>b.name+": "+b.description).join(" | ")}
Key decisions: ${capsule.decisions.map(d=>d.decision).join(" | ")}
Top open thread: ${capsule.openThreads.filter(t=>t.priority==="high").map(t=>t.thread+": "+t.context).join(" | ")}
Tags: ${capsule.tags.join(", ")}

Write as a direct instruction to the next Claude instance. Terse, no filler.`
          }]
        })
      });
      const d = await r.json();
      const txt = d.content?.filter(b=>b.type==="text").map(b=>b.text).join("") || "";
      update("nextSessionPrimer", txt);
      setPrimerGenerated(true);
    } catch(e) {
      update("nextSessionPrimer", "Failed to generate — write manually.");
    }
    setGeneratingPrimer(false);
  }

  function exportJSON() {
    const payload = {
      ...capsule,
      meta: { ...capsule.meta, exportedAt: new Date().toISOString(), schema: "context-capsule-v1" }
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `context-capsule-${capsule.meta.sessionTitle.slice(0,30).replace(/\s+/g,"-").toLowerCase()}-${capsule.meta.date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(()=>setExported(false), 2000);
  }

  function copyJSON() {
    const payload = { ...capsule, meta: { ...capsule.meta, exportedAt: new Date().toISOString(), schema: "context-capsule-v1" } };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  }

  const NAV = [
    { id:"overview", label:"Overview", icon:"◈" },
    { id:"built", label:"Built", icon:"📦", count: capsule.built.length },
    { id:"decisions", label:"Decisions", icon:"⚖️", count: capsule.decisions.length },
    { id:"threads", label:"Open Threads", icon:"🧵", count: capsule.openThreads.length },
    { id:"knowledge", label:"Project Knowledge", icon:"📚", count: capsule.projectKnowledge.length },
    { id:"primer", label:"Next Session Primer", icon:"🚀" },
    { id:"export", label:"Export", icon:"⬇" },
  ];

  const completeness = [
    capsule.meta.sessionTitle,
    capsule.meta.destinationProject,
    capsule.built.length > 0,
    capsule.decisions.length > 0,
    capsule.openThreads.length > 0,
    capsule.nextSessionPrimer,
  ].filter(Boolean).length;

  const pct = Math.round((completeness / 6) * 100);

  // ── LAYOUT ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight:"100vh", background:"#020817", fontFamily:"'Syne',sans-serif", color:"#e2e8f0",
        display:"flex", flexDirection:"column",
        backgroundImage:"radial-gradient(#0d1525 1px, transparent 1px)", backgroundSize:"24px 24px" }}>

        {/* Top Bar */}
        <div style={{ padding:"12px 20px", borderBottom:"1px solid #1a2744", background:"#030912cc",
          backdropFilter:"blur(8px)", position:"sticky", top:0, zIndex:100,
          display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0 }}>
            <div style={{ fontSize:10, letterSpacing:3, color:"#6366f1", fontFamily:"'Space Mono',monospace", flexShrink:0 }}>◈ CAPSULE</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#e2e8f0", fontSize:14, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
              {capsule.meta.sessionTitle || "Untitled Session"}
            </div>
          </div>
          {/* Completeness */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <div style={{ width:80, height:3, background:"#1e293b", borderRadius:2 }}>
              <div style={{ width:`${pct}%`, height:"100%", background: pct===100?"#10b981":"#6366f1", borderRadius:2, transition:"width .4s ease" }}/>
            </div>
            <span style={{ fontSize:10, color: pct===100?"#10b981":"#475569", fontFamily:"'Space Mono',monospace" }}>{pct}%</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button className="btn" onClick={copyJSON} style={{ background:"transparent", border:"1px solid #1e293b", borderRadius:7, padding:"6px 12px", color: copied?"#10b981":"#64748b", cursor:"pointer", fontSize:11, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
              {copied ? "✓ copied" : "⎘ copy"}
            </button>
            <button className="btn" onClick={exportJSON} style={{ background: exported?"#10b98122":"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", borderRadius:7, padding:"6px 14px", color: exported?"#10b981":"#fff", cursor:"pointer", fontSize:11, fontFamily:"'Syne',sans-serif", fontWeight:700, transition:"all .2s" }}>
              {exported ? "✓ exported" : "⬇ Export JSON"}
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          {/* Sidebar */}
          <div style={{ width:180, flexShrink:0, borderRight:"1px solid #0d1525", padding:"16px 12px", display:"flex", flexDirection:"column", gap:2 }}>
            {NAV.map(n => (
              <button key={n.id} onClick={()=>setActiveSection(n.id)} style={{
                display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8,
                background: activeSection===n.id ? "#1e293b" : "transparent",
                border:`1px solid ${activeSection===n.id?"#6366f133":"transparent"}`,
                color: activeSection===n.id ? "#e2e8f0" : "#475569",
                cursor:"pointer", fontSize:12, fontFamily:"'Syne',sans-serif",
                fontWeight: activeSection===n.id ? 600 : 400, transition:"all .15s", textAlign:"left"
              }}>
                <span style={{ fontSize:13 }}>{n.icon}</span>
                <span style={{ flex:1 }}>{n.label}</span>
                {n.count !== undefined && <span style={{ fontSize:9, color:"#334155", fontFamily:"'Space Mono',monospace" }}>{n.count}</span>}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex:1, overflow:"auto", padding:"24px 28px", animation:"fadeUp .3s ease" }}>

            {/* ── OVERVIEW ── */}
            {activeSection==="overview" && (
              <div style={{ maxWidth:640 }}>
                <SectionHeader icon="◈" label="Session Overview"/>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {[
                    { label:"SESSION TITLE", key:"meta.sessionTitle", placeholder:"e.g. Beta Tester Army — Build + Template System" },
                    { label:"SOURCE PROJECT", key:"meta.sourceProject", placeholder:"Where this session took place" },
                    { label:"DESTINATION PROJECT", key:"meta.destinationProject", placeholder:"Where you're migrating next →" },
                  ].map(f => (
                    <div key={f.key} className="field-card" style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"14px 16px", transition:"border-color .2s" }}>
                      <label style={{ display:"block", fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", letterSpacing:1, marginBottom:8 }}>{f.label}</label>
                      <input value={f.key.split(".").reduce((o,k)=>o[k],capsule)} onChange={e=>update(f.key,e.target.value)}
                        placeholder={f.placeholder}
                        style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:6, padding:"8px 10px", color:"#e2e8f0", fontSize:13, fontFamily:"'Syne',sans-serif", transition:"border-color .2s" }}
                      />
                    </div>
                  ))}
                  {/* Tags */}
                  <div className="field-card" style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"14px 16px", transition:"border-color .2s" }}>
                    <label style={{ display:"block", fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", letterSpacing:1, marginBottom:10 }}>TAGS</label>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                      {capsule.tags.map(tag => (
                        <span key={tag} className="tag-pill" onClick={()=>removeTag(tag)} title="click to remove"
                          style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:"#1a2744", color:"#64748b", cursor:"pointer", border:"1px solid #1e293b", transition:"all .15s" }}>
                          #{tag} ×
                        </span>
                      ))}
                    </div>
                    <input placeholder="Add tag + Enter" onKeyDown={e=>{ if(e.key==="Enter"){ addTag(e.target.value.trim().replace(/\s+/g,"-").toLowerCase()); e.target.value=""; }}}
                      style={{ background:"#080e1c", border:"1px solid #1a2744", borderRadius:6, padding:"6px 10px", color:"#64748b", fontSize:12, fontFamily:"'Space Mono',monospace", width:160, transition:"border-color .2s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── BUILT ── */}
            {activeSection==="built" && (
              <div style={{ maxWidth:680 }}>
                <SectionHeader icon="📦" label="What Was Built" count={capsule.built.length}/>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {capsule.built.map(item => (
                    <div key={item.id} style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"16px 18px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <input value={item.name} onChange={e=>updateArrayItem("built",item.id,"name",e.target.value)}
                          style={{ flex:1, background:"transparent", border:"none", color:"#e2e8f0", fontSize:14, fontFamily:"'Syne',sans-serif", fontWeight:700 }}/>
                        <StatusBadge s={item.status}/>
                        <button onClick={()=>removeItem("built",item.id)} style={{ background:"transparent", border:"none", color:"#334155", cursor:"pointer", fontSize:14 }}>×</button>
                      </div>
                      <div style={{ display:"flex", gap:10, marginBottom:10 }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>TYPE</div>
                          <input value={item.type} onChange={e=>updateArrayItem("built",item.id,"type",e.target.value)}
                            style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:5, padding:"5px 8px", color:"#64748b", fontSize:11, fontFamily:"'Space Mono',monospace" }}/>
                        </div>
                        <div style={{ flex:2 }}>
                          <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>FILE / ARTIFACT</div>
                          <input value={item.file} onChange={e=>updateArrayItem("built",item.id,"file",e.target.value)}
                            style={{ width:"100%", background:"#080e1c", border:"1px solid #1a2744", borderRadius:5, padding:"5px 8px", color:"#64748b", fontSize:11, fontFamily:"'Space Mono',monospace" }}/>
                        </div>
                      </div>
                      <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>DESCRIPTION</div>
                      <EditableText value={item.description} rows={3} onChange={v=>updateArrayItem("built",item.id,"description",v)}/>
                    </div>
                  ))}
                  <button className="btn" onClick={()=>addItem("built",{ name:"New Item", type:"artifact", file:"", description:"", status:"in-progress" })}
                    style={{ background:"transparent", border:"1px dashed #1e293b", borderRadius:10, padding:"12px", color:"#334155", cursor:"pointer", fontSize:12, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
                    + add item
                  </button>
                </div>
              </div>
            )}

            {/* ── DECISIONS ── */}
            {activeSection==="decisions" && (
              <div style={{ maxWidth:680 }}>
                <SectionHeader icon="⚖️" label="Key Decisions" count={capsule.decisions.length}/>
                <div style={{ fontSize:12, color:"#334155", marginBottom:14, fontFamily:"'Space Mono',monospace" }}>
                  Decisions not to re-litigate in the next session.
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {capsule.decisions.map(d => (
                    <div key={d.id} style={{ background:"#060c1a", border:"1px solid #0d1525", borderLeft:"3px solid #6366f1", borderRadius:10, padding:"16px 18px" }}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:10 }}>
                        <input value={d.decision} onChange={e=>updateArrayItem("decisions",d.id,"decision",e.target.value)}
                          style={{ flex:1, background:"transparent", border:"none", color:"#e2e8f0", fontSize:13, fontFamily:"'Syne',sans-serif", fontWeight:600 }}/>
                        <button onClick={()=>removeItem("decisions",d.id)} style={{ background:"transparent", border:"none", color:"#334155", cursor:"pointer", fontSize:14, flexShrink:0 }}>×</button>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                        <div>
                          <div style={{ fontSize:10, color:"#10b981", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>RATIONALE</div>
                          <EditableText value={d.rationale} rows={2} onChange={v=>updateArrayItem("decisions",d.id,"rationale",v)}/>
                        </div>
                        <div>
                          <div style={{ fontSize:10, color:"#f59e0b", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>ALTERNATIVES CONSIDERED</div>
                          <EditableText value={d.alternatives} rows={2} onChange={v=>updateArrayItem("decisions",d.id,"alternatives",v)}/>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="btn" onClick={()=>addItem("decisions",{ decision:"New Decision", rationale:"", alternatives:"" })}
                    style={{ background:"transparent", border:"1px dashed #1e293b", borderRadius:10, padding:"12px", color:"#334155", cursor:"pointer", fontSize:12, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
                    + add decision
                  </button>
                </div>
              </div>
            )}

            {/* ── OPEN THREADS ── */}
            {activeSection==="threads" && (
              <div style={{ maxWidth:680 }}>
                <SectionHeader icon="🧵" label="Open Threads" count={capsule.openThreads.length}/>
                <div style={{ fontSize:12, color:"#334155", marginBottom:14, fontFamily:"'Space Mono',monospace" }}>
                  What needs to happen in the next session. High priority = execute first.
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[...capsule.openThreads].sort((a,b)=>{ const o={high:0,medium:1,low:2}; return o[a.priority]-o[b.priority]; }).map(t => (
                    <div key={t.id} style={{ background:"#060c1a", border:"1px solid #0d1525", borderLeft:`3px solid ${t.priority==="high"?"#ef4444":t.priority==="medium"?"#f59e0b":"#22d3ee"}`, borderRadius:10, padding:"16px 18px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <input value={t.thread} onChange={e=>updateArrayItem("openThreads",t.id,"thread",e.target.value)}
                          style={{ flex:1, background:"transparent", border:"none", color:"#e2e8f0", fontSize:13, fontFamily:"'Syne',sans-serif", fontWeight:600 }}/>
                        <select value={t.priority} onChange={e=>updateArrayItem("openThreads",t.id,"priority",e.target.value)}
                          style={{ background:"#0d1425", border:"1px solid #1e293b", borderRadius:6, padding:"3px 8px", color:"#64748b", fontSize:11, cursor:"pointer" }}>
                          <option value="high">high</option>
                          <option value="medium">medium</option>
                          <option value="low">low</option>
                        </select>
                        <PriorityBadge p={t.priority}/>
                        <button onClick={()=>removeItem("openThreads",t.id)} style={{ background:"transparent", border:"none", color:"#334155", cursor:"pointer", fontSize:14 }}>×</button>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:10 }}>
                        <div>
                          <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>CONTEXT</div>
                          <EditableText value={t.context} rows={3} onChange={v=>updateArrayItem("openThreads",t.id,"context",v)}/>
                        </div>
                        <div>
                          <div style={{ fontSize:10, color:"#22d3ee", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>NEXT ACTION</div>
                          <EditableText value={t.nextAction} rows={3} onChange={v=>updateArrayItem("openThreads",t.id,"nextAction",v)}/>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="btn" onClick={()=>addItem("openThreads",{ thread:"New Thread", priority:"medium", context:"", nextAction:"" })}
                    style={{ background:"transparent", border:"1px dashed #1e293b", borderRadius:10, padding:"12px", color:"#334155", cursor:"pointer", fontSize:12, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
                    + add thread
                  </button>
                </div>
              </div>
            )}

            {/* ── PROJECT KNOWLEDGE ── */}
            {activeSection==="knowledge" && (
              <div style={{ maxWidth:680 }}>
                <SectionHeader icon="📚" label="Project Knowledge Used" count={capsule.projectKnowledge.length}/>
                <div style={{ fontSize:12, color:"#334155", marginBottom:14, fontFamily:"'Space Mono',monospace" }}>
                  Which files from the source project were most useful — so the next project can search for them.
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {capsule.projectKnowledge.map(k => (
                    <div key={k.id} style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"16px 18px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <input value={k.file} onChange={e=>updateArrayItem("projectKnowledge",k.id,"file",e.target.value)}
                          style={{ flex:1, background:"transparent", border:"none", color:"#94a3b8", fontSize:12, fontFamily:"'Space Mono',monospace" }}/>
                        <select value={k.relevance} onChange={e=>updateArrayItem("projectKnowledge",k.id,"relevance",e.target.value)}
                          style={{ background:"#0d1425", border:"1px solid #1e293b", borderRadius:6, padding:"3px 8px", color:"#64748b", fontSize:11, cursor:"pointer" }}>
                          <option value="high">high</option>
                          <option value="medium">medium</option>
                          <option value="low">low</option>
                        </select>
                        <button onClick={()=>removeItem("projectKnowledge",k.id)} style={{ background:"transparent", border:"none", color:"#334155", cursor:"pointer", fontSize:14 }}>×</button>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:10 }}>
                        <div>
                          <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>KEY INSIGHTS</div>
                          <EditableText value={k.keyInsights} rows={3} onChange={v=>updateArrayItem("projectKnowledge",k.id,"keyInsights",v)}/>
                        </div>
                        <div>
                          <div style={{ fontSize:10, color:"#6366f1", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>USED FOR</div>
                          <EditableText value={k.usedFor} rows={3} onChange={v=>updateArrayItem("projectKnowledge",k.id,"usedFor",v)}/>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="btn" onClick={()=>addItem("projectKnowledge",{ file:"", relevance:"medium", keyInsights:"", usedFor:"" })}
                    style={{ background:"transparent", border:"1px dashed #1e293b", borderRadius:10, padding:"12px", color:"#334155", cursor:"pointer", fontSize:12, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
                    + add file
                  </button>
                </div>
              </div>
            )}

            {/* ── PRIMER ── */}
            {activeSection==="primer" && (
              <div style={{ maxWidth:640 }}>
                <SectionHeader icon="🚀" label="Next Session Primer"/>
                <div style={{ fontSize:12, color:"#475569", marginBottom:16, lineHeight:1.6 }}>
                  A dense cold-start message for the next Claude instance. Paste this as your first message in the new project — it eliminates re-derivation of context.
                </div>
                <div style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"20px" }}>
                  {!capsule.nextSessionPrimer && !generatingPrimer && (
                    <div style={{ textAlign:"center", padding:"24px 0" }}>
                      <div style={{ color:"#334155", fontSize:13, marginBottom:16 }}>No primer generated yet.</div>
                      <button className="btn" onClick={generatePrimer}
                        style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", borderRadius:8, padding:"10px 20px", color:"#fff", cursor:"pointer", fontSize:13, fontFamily:"'Syne',sans-serif", fontWeight:700, transition:"all .2s" }}>
                        ✨ Generate AI Primer
                      </button>
                    </div>
                  )}
                  {generatingPrimer && (
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"20px 0", color:"#6366f1", fontSize:12, fontFamily:"'Space Mono',monospace" }}>
                      <div style={{ width:14, height:14, border:"2px solid #6366f133", borderTopColor:"#6366f1", borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
                      Synthesizing session context...
                    </div>
                  )}
                  {capsule.nextSessionPrimer && (
                    <>
                      <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:8, display:"flex", justifyContent:"space-between" }}>
                        <span>PRIMER TEXT {primerGenerated && <span style={{ color:"#10b981" }}>· AI GENERATED</span>}</span>
                        <button className="btn" onClick={generatePrimer} style={{ background:"transparent", border:"none", color:"#6366f1", cursor:"pointer", fontSize:10, fontFamily:"'Space Mono',monospace" }}>↺ regenerate</button>
                      </div>
                      <EditableText value={capsule.nextSessionPrimer} rows={10} onChange={v=>update("nextSessionPrimer",v)}
                        placeholder="Write or generate a cold-start primer for the next session..."/>
                      <button className="btn" onClick={()=>{ navigator.clipboard.writeText(capsule.nextSessionPrimer); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
                        style={{ marginTop:10, background:"transparent", border:"1px solid #1e293b", borderRadius:6, padding:"6px 14px", color:"#64748b", cursor:"pointer", fontSize:11, fontFamily:"'Space Mono',monospace", transition:"all .2s" }}>
                        {copied?"✓ copied":"⎘ copy primer text"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── EXPORT ── */}
            {activeSection==="export" && (
              <div style={{ maxWidth:580 }}>
                <SectionHeader icon="⬇" label="Export Capsule"/>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[
                    { label:"JSON File", desc:"Full structured capsule. Import back into this tool or feed directly to Claude API / Flash-n-Frame.", action: exportJSON, btn:"⬇ Download JSON", color:"linear-gradient(135deg,#1d4ed8,#0ea5e9)" },
                    { label:"Copy to Clipboard", desc:"Paste directly into the next Claude session as context. Best combined with the primer text.", action: copyJSON, btn: copied?"✓ Copied":"⎘ Copy JSON", color:"linear-gradient(135deg,#4f46e5,#7c3aed)" },
                  ].map(opt => (
                    <div key={opt.label} style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"20px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
                      <div>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#e2e8f0", fontSize:14, marginBottom:4 }}>{opt.label}</div>
                        <div style={{ color:"#475569", fontSize:12, lineHeight:1.5 }}>{opt.desc}</div>
                      </div>
                      <button className="btn" onClick={opt.action} style={{ background:opt.color, border:"none", borderRadius:8, padding:"10px 18px", color:"#fff", cursor:"pointer", fontSize:12, fontFamily:"'Syne',sans-serif", fontWeight:700, flexShrink:0, transition:"all .2s" }}>
                        {opt.btn}
                      </button>
                    </div>
                  ))}

                  {/* Schema preview */}
                  <div style={{ background:"#060c1a", border:"1px solid #0d1525", borderRadius:10, padding:"16px 18px" }}>
                    <div style={{ fontSize:10, color:"#334155", fontFamily:"'Space Mono',monospace", marginBottom:10, letterSpacing:1 }}>JSON SCHEMA PREVIEW</div>
                    <pre style={{ color:"#475569", fontSize:11, lineHeight:1.6, fontFamily:"'Space Mono',monospace", overflow:"auto" }}>
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

                  {/* Migration checklist */}
                  <div style={{ background:"#031a0f", border:"1px solid #10b98133", borderRadius:10, padding:"16px 18px" }}>
                    <div style={{ fontSize:10, color:"#10b981", fontFamily:"'Space Mono',monospace", marginBottom:10 }}>MIGRATION CHECKLIST</div>
                    {[
                      "Session title filled in",
                      "Destination project named",
                      "All built artifacts documented",
                      "Key decisions recorded (don't re-litigate these)",
                      "Open threads prioritized",
                      "Primer generated and copied",
                      "JSON exported",
                    ].map((item, i) => {
                      const checks = [
                        !!capsule.meta.sessionTitle,
                        !!capsule.meta.destinationProject,
                        capsule.built.length > 0,
                        capsule.decisions.length > 0,
                        capsule.openThreads.length > 0,
                        !!capsule.nextSessionPrimer,
                        exported,
                      ];
                      return (
                        <div key={i} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                          <span style={{ color: checks[i] ? "#10b981" : "#1e293b", fontSize:12 }}>{checks[i]?"✓":"○"}</span>
                          <span style={{ color: checks[i] ? "#6ee7b7" : "#334155", fontSize:12 }}>{item}</span>
                        </div>
                      );
                    })}
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
