import { useState, useMemo } from "react";

const skills = [
  // ── USER ────────────────────────────────────────────────────────────────
  { name: "advanced-ux-patterns", source: "user", size: "14K", tags: ["design", "ux"], desc: "WCAG 2.2, interaction patterns, user research methods, and usability principles for accessible, user-centered designs." },
  { name: "advanced-visual-design", source: "user", size: "46K", tags: ["design"], desc: "Typography systems, color theory, grid-based layouts, visual hierarchy, and composition principles for high-quality visual designs." },
  { name: "ai-solution-architecture", source: "user", size: "37K", tags: ["ai", "architecture"], desc: "Pre-sales technical architectures for AI/ML solutions — reference architectures, integration patterns, infrastructure sizing, and technical proposals." },
  { name: "anchor", source: "user", size: "50K", tags: ["wellness"], desc: "Calm, adaptive anxiety companion for daily support between therapy sessions. Check-ins, grounding, journaling, and mood tracking." },
  { name: "applying-sparc-methodology", source: "user", size: "25K", tags: ["code", "architecture"], desc: "Full SPARC coach: Specification → Pseudocode → Architecture → Refinement → Completion. TDD-first, scope-gated, adversarial review." },
  { name: "code-auditor", source: "user", size: "8K", tags: ["code"], desc: "Comprehensive codebase analysis — architecture, code quality, security, performance, testing, and maintainability health checks." },
  { name: "code-transfer", source: "user", size: "18K", tags: ["code"], desc: "Transfer code between files with line-based precision. Move functions, extract blocks, insert at specific line numbers." },
  { name: "create-agent-skills", source: "user", size: "192K", tags: ["ai", "skills"], desc: "Expert guidance for creating, writing, building, and refining Claude Code Skills and SKILL.md files." },
  { name: "create-meta-prompts", source: "user", size: "97K", tags: ["ai"], desc: "Create optimized prompts for Claude-to-Claude pipelines — research, planning, and execution stages in multi-step workflows." },
  { name: "create-subagents", source: "user", size: "124K", tags: ["ai"], desc: "Expert guidance for Claude Code subagents and the Task tool — agent configs, task delegation, and parallel agent runs." },
  { name: "debug-like-expert", source: "user", size: "72K", tags: ["code"], desc: "Deep analysis debugging mode. Methodical investigation: evidence gathering, hypothesis testing, rigorous root cause analysis." },
  { name: "design-system-builder", source: "user", size: "79K", tags: ["design"], desc: "Build cohesive design systems — design tokens, component libraries, Storybook, Style Dictionary, governance, and contribution workflows." },
  { name: "developing-skills", source: "user", size: "86K", tags: ["skills", "ai"], desc: "Authoritative guidance for creating and managing Claude skills — YAML frontmatter, trigger density, gerund naming, progressive disclosure." },
  { name: "drafting-multi-format-content", source: "user", size: "81K", tags: ["content"], desc: "Production-ready templates: video/audio scripts, threaded long-form social (LinkedIn, X, IG), and FlashFusion customer lifecycle comms." },
  { name: "elite-ui-design", source: "user", size: "81K", tags: ["design", "ux"], desc: "End-to-end product design orchestrator. Experience thesis, design systems, interaction models, component architecture, anti-slop audit." },
  { name: "enforcing-output-formats", source: "user", size: "14K", tags: ["content"], desc: "Enforces industry-standard formatting for songs, scripts, screenplays, emails, legal docs, resumes, recipes, lead sheets, and more." },
  { name: "engineering-staff-workflows", source: "user", size: "37K", tags: ["code", "architecture"], desc: "Security-first Staff Engineer workflow — SCOPE_MODE gating, WSJF prioritization, AppSec threat modeling, full-stack to edge/AI pipelines." },
  { name: "fixing-tests", source: "user", size: "13K", tags: ["code"], desc: "Systematically fix all failing tests using smart error grouping. Works across test suites; handles cascading failures." },
  { name: "generating-intinc-documents", source: "user", size: "1.2M", tags: ["docs"], desc: "Structured .docx generation engine for Intinc employees — INT brand standards, reference guides, onboarding docs, SOPs, runbooks." },
  { name: "generating-kb-articles", source: "user", size: "1.4M", tags: ["docs"], desc: "Professionally formatted .docx KB articles following INT brand template — SOPs, troubleshooting guides, process docs." },
  { name: "generating-msm-documents", source: "user", size: "110K", tags: ["docs"], desc: "MSM (Multimedia Sales & Marketing) branded .docx documents — deployment guides, SOPs, runbooks, onboarding, checklists." },
  { name: "generating-social-posts", source: "user", size: "30K", tags: ["content"], desc: "Platform-optimized social posts in Kyle Rosebrook's voice — LinkedIn, Twitter/X, Threads, Blog, Audio Script. Zero fluff." },
  { name: "implementing-review-feedback", source: "user", size: "14K", tags: ["code"], desc: "Process and implement code review feedback systematically. Handles PR comments, reviewer notes, and multi-reviewer suggestions." },
  { name: "kb-screenshot-automator", source: "user", size: "40K", tags: ["docs", "automation"], desc: "Automate screenshot capture and insertion for Scribe-formatted KB articles. Uses Claude in Chrome to navigate live apps." },
  { name: "managing-design-briefs", source: "user", size: "95K", tags: ["design"], desc: "Design briefs with anti-slop gates and locked design tokens. Switchable profiles: INT (enterprise-clean) and FlashFusion (neon-glass)." },
  { name: "orchestrating-ai-agents", source: "user", size: "84K", tags: ["ai", "automation"], desc: "Build AI agents and automation workflows. MCP servers, LangChain, CrewAI, multi-LLM, GitHub, Notion, Zapier, Make, Vercel, and more." },
  { name: "organizing-projects", source: "user", size: "129K", tags: ["code", "architecture"], desc: "Repo structure audits, convention enforcement, migration planning, new project scaffolding, and structural debt identification." },
  { name: "packaging-skills", source: "user", size: "52K", tags: ["skills"], desc: "Packages Claude skills into production-ready .skill zips with full March 2026 Anthropic spec compliance, YAML verification, and exclusion artifacts." },
  { name: "producing-ai-newsletter", source: "user", size: "94K", tags: ["content", "ai"], desc: "Multi-config AI newsletter production — research, draft, edit, format, deliver. INT and FlashFusion brand profiles." },
  { name: "producing-graphics", source: "user", size: "23K", tags: ["design"], desc: "Export-ready graphics for web, print, and social media — proper formats, color spaces, resolution, and optimization." },
  { name: "professional-web-design", source: "user", size: "67K", tags: ["design", "code"], desc: "Industry-standard web design: responsive, mobile-first, Core Web Vitals, CSS Grid, container queries, WCAG, pre-launch audit." },
  { name: "project-bootstrapper", source: "user", size: "8K", tags: ["code"], desc: "Sets up new projects with dev best practices — tooling, documentation, workflow automation, and professional structure." },
  { name: "prototyping-testing", source: "user", size: "16K", tags: ["design", "ux"], desc: "Prototyping strategy, usability test planning, heuristic evaluation, A/B experiment design, tree testing, and research metrics." },
  { name: "refactoring-code", source: "user", size: "14K", tags: ["code"], desc: "Bulk refactoring — rename across files, replace deprecated patterns, update API calls, and make consistent multi-location changes." },
  { name: "reminding-skill-usage", source: "user", size: "22K", tags: ["skills"], desc: "Analyzes your task and suggests which skills from your library would be most helpful for the current work." },
  { name: "roi-calculator-building", source: "user", size: "30K", tags: ["business", "ai"], desc: "AI implementation ROI models for B2B enterprise sales — cost savings, revenue impact, TCO, payback period, value engineering." },
  { name: "running-drive-automation", source: "user", size: "60K", tags: ["automation", "ai"], desc: "Drive Automation Chain 1+2 — multi-agent Google Drive classification and routing pipeline with Supabase audit trail." },
  { name: "social-post-generator", source: "user", size: "30K", tags: ["content"], desc: "Social posts and audio scripts in Kyle Rosebrook's voice. 10 content types, 5 platforms, 4–5 clarifiers before generating." },
  { name: "task-decomposition", source: "user", size: "16K", tags: ["code", "architecture"], desc: "Decompose complex multi-part requests into parallel workstreams with dependency tracking and integration planning." },
  { name: "tracking-personal-challenges", source: "user", size: "14K", tags: ["wellness"], desc: "Track personal challenges — learning, fitness, building, creative, habit domains. Check-ins, progress logs, cross-challenge patterns." },
  { name: "troubleshooting-skills", source: "user", size: "42K", tags: ["skills"], desc: "Diagnose and fix Claude skill pack issues — corrupted zips, path errors, upload failures, structure problems, YAML errors." },
  { name: "ui-component-library", source: "user", size: "54K", tags: ["code", "design"], desc: "Advanced UI component patterns for React, Vue, vanilla JS — compound components, headless hooks, virtualized lists, rich text editor." },
  { name: "unifying-service-desk", source: "user", size: "171K", tags: ["business"], desc: "Multi-tier IT support (L0–L4) with automatic escalation routing — incident triage, troubleshooting, root cause analysis, vendor coordination." },
  { name: "workflow-automation", source: "user", size: "59K", tags: ["automation"], desc: "Build automated workflows in n8n, Zapier, Make/Integromat — connect SaaS tools, orchestrate multi-step business processes." },
  { name: "writing-shell-scripts", source: "user", size: "28K", tags: ["code", "automation"], desc: "Production-ready Bash .sh and PowerShell .ps1 scripts — adversarial audit gate, MSP-grade error handling, idempotency, structured logging." },

  // ── PUBLIC ───────────────────────────────────────────────────────────────
  { name: "docx", source: "public", size: "1.2M", tags: ["docs"], desc: "Create, read, edit, or manipulate Word .docx files — ToC, headings, page numbers, letterheads, find-and-replace, tracked changes." },
  { name: "file-reading", source: "public", size: "15K", tags: ["tools"], desc: "Router skill: tells you which tool to use for each file type (pdf, docx, xlsx, csv, json, images, archives) at /mnt/user-data/uploads." },
  { name: "frontend-design", source: "public", size: "15K", tags: ["design", "code"], desc: "Distinctive, production-grade frontend interfaces — avoids generic AI aesthetics, commits to bold aesthetic direction with intentionality." },
  { name: "pdf", source: "public", size: "61K", tags: ["docs"], desc: "Anything with PDF files — read, extract, combine, split, rotate, watermark, create, fill forms, encrypt, OCR, extract images." },
  { name: "pdf-reading", source: "public", size: "19K", tags: ["docs"], desc: "Read, inspect, or extract content from PDFs — content inventory, text extraction, page rasterization, embedded images, tables, forms." },
  { name: "pptx", source: "public", size: "1.2M", tags: ["docs"], desc: "Any .pptx file — create decks, extract text, edit presentations, combine/split slides, templates, layouts, speaker notes." },
  { name: "product-self-knowledge", source: "public", size: "3.5K", tags: ["tools"], desc: "Verify facts about Anthropic products before responding — Claude Code install, API function calling, pricing, models, plan limits." },
  { name: "xlsx", source: "public", size: "1.1M", tags: ["docs"], desc: "Spreadsheet work — open, read, edit, fix, create, convert .xlsx, .xlsm, .csv, .tsv. Formulas, charts, cleaning, restructuring." },

  // ── EXAMPLES ─────────────────────────────────────────────────────────────
  { name: "algorithmic-art", source: "examples", size: "62K", tags: ["design", "code"], desc: "Algorithmic art using p5.js with seeded randomness, interactive parameter exploration, flow fields, and particle systems." },
  { name: "brand-guidelines", source: "examples", size: "15K", tags: ["design"], desc: "Applies Anthropic's official brand colors and typography to any artifact — look-and-feel, visual formatting, company design standards." },
  { name: "canvas-design", source: "examples", size: "5.4M", tags: ["design"], desc: "Beautiful visual art in .png and .pdf using design philosophy — posters, illustrations, original designs. No copyright violations." },
  { name: "doc-coauthoring", source: "examples", size: "16K", tags: ["docs", "content"], desc: "Structured co-authoring workflow for documentation, proposals, technical specs, and decision docs — context transfer, iterative refinement." },
  { name: "internal-comms", source: "examples", size: "25K", tags: ["content", "business"], desc: "Internal communications in company formats — status reports, leadership updates, newsletters, FAQs, incident reports, project updates." },
  { name: "mcp-builder", source: "examples", size: "124K", tags: ["ai", "code"], desc: "Create high-quality MCP servers — Python (FastMCP) or Node/TypeScript (MCP SDK). Tool design, auth, deployment, testing." },
  { name: "skill-creator", source: "examples", size: "227K", tags: ["skills", "ai"], desc: "Create, improve, and evaluate Claude skills from scratch — edit existing, run evals, benchmark performance, optimize trigger accuracy." },
  { name: "slack-gif-creator", source: "examples", size: "46K", tags: ["content"], desc: "Create animated GIFs optimized for Slack — constraints, validation tools, animation concepts, Slack-safe dimensions." },
  { name: "theme-factory", source: "examples", size: "147K", tags: ["design"], desc: "10 pre-set themes (colors/fonts) for artifacts — slides, docs, reports, landing pages. Apply or generate new themes on-the-fly." },
  { name: "web-artifacts-builder", source: "examples", size: "47K", tags: ["code", "design"], desc: "Elaborate multi-component Claude.ai HTML artifacts using React, Tailwind CSS, shadcn/ui — complex state, routing, advanced interactions." },
];

const TAG_COLORS = {
  design:       { bg: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.4)", text: "#C4B5FD" },
  code:         { bg: "rgba(6,182,212,0.12)",  border: "rgba(6,182,212,0.35)", text: "#67E8F9" },
  ai:           { bg: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.4)", text: "#C4B5FD" },
  content:      { bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.35)",text: "#34D399" },
  docs:         { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.35)",text: "#FBBF24" },
  automation:   { bg: "rgba(6,182,212,0.12)",  border: "rgba(6,182,212,0.35)", text: "#67E8F9" },
  architecture: { bg: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.4)", text: "#C4B5FD" },
  business:     { bg: "rgba(248,113,113,0.12)",border: "rgba(248,113,113,0.35)",text:"#F87171" },
  ux:           { bg: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.4)", text: "#C4B5FD" },
  skills:       { bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.35)",text: "#34D399" },
  wellness:     { bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.35)",text: "#34D399" },
  tools:        { bg: "rgba(148,163,184,0.12)",border: "rgba(148,163,184,0.3)",text: "#94A3B8" },
};

const SOURCE_META = {
  user:     { label: "Your Skills",    color: "#8B5CF6", glow: "rgba(139,92,246,0.3)"  },
  public:   { label: "Public",         color: "#06B6D4", glow: "rgba(6,182,212,0.25)"  },
  examples: { label: "Examples",       color: "#34D399", glow: "rgba(52,211,153,0.2)"  },
};

const ALL_TAGS = [...new Set(skills.flatMap(s => s.tags))].sort();

export default function SkillBrowser() {
  const [search, setSearch]         = useState("");
  const [sourceFilter, setSource]   = useState("all");
  const [tagFilter, setTag]         = useState(null);
  const [expanded, setExpanded]     = useState(null);
  const [installing, setInstalling] = useState(null);
  const [installed, setInstalled]   = useState(new Set());

  const filtered = useMemo(() => {
    return skills.filter(s => {
      if (sourceFilter !== "all" && s.source !== sourceFilter) return false;
      if (tagFilter && !s.tags.includes(tagFilter)) return false;
      if (search) {
        const q = search.toLowerCase();
        return s.name.includes(q) || s.desc.toLowerCase().includes(q) || s.tags.some(t => t.includes(q));
      }
      return true;
    });
  }, [search, sourceFilter, tagFilter]);

  const handleInstall = (skill) => {
    setInstalling(skill.name);
    setTimeout(() => {
      setInstalling(null);
      setInstalled(prev => new Set([...prev, skill.name]));
      if (typeof sendPrompt === "function") {
        sendPrompt(`__skill_install:${skill.source}:${skill.name}`);
      }
    }, 600);
  };

  const counts = {
    all: skills.length,
    user: skills.filter(s => s.source === "user").length,
    public: skills.filter(s => s.source === "public").length,
    examples: skills.filter(s => s.source === "examples").length,
  };

  return (
    <div style={{
      background: "linear-gradient(180deg,#0A0A0F 0%,#141328 100%)",
      minHeight: "100vh",
      fontFamily: "'DM Mono', 'Fira Code', monospace",
      color: "#F8FAFC",
      padding: "28px 20px",
    }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
          <div style={{
            width:8, height:8, borderRadius:"50%",
            background:"#8B5CF6",
            boxShadow:"0 0 12px rgba(139,92,246,0.8)",
          }}/>
          <span style={{ fontSize:11, letterSpacing:"0.2em", color:"#94A3B8", textTransform:"uppercase" }}>
            cowork · skill registry
          </span>
        </div>
        <h1 style={{ fontSize:26, fontWeight:700, margin:"0 0 4px", letterSpacing:"-0.02em" }}>
          Skill Browser
        </h1>
        <p style={{ fontSize:13, color:"#94A3B8", margin:0 }}>
          {skills.length} skills across {Object.keys(SOURCE_META).length} sources — search, filter, install
        </p>
      </div>

      {/* Search */}
      <div style={{ position:"relative", marginBottom:16 }}>
        <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#94A3B8", fontSize:14 }}>⌕</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search skills, tags, descriptions…"
          style={{
            width:"100%", boxSizing:"border-box",
            background:"rgba(20,19,40,0.8)",
            border:"1px solid rgba(196,181,253,0.15)",
            borderRadius:8, padding:"10px 12px 10px 34px",
            color:"#F8FAFC", fontSize:13,
            outline:"none",
          }}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{
            position:"absolute", right:10, top:"50%", transform:"translateY(-50%)",
            background:"none", border:"none", color:"#94A3B8", cursor:"pointer", fontSize:14,
          }}>✕</button>
        )}
      </div>

      {/* Source tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
        {["all","user","public","examples"].map(src => {
          const active = sourceFilter === src;
          const meta = src === "all" ? { label:"All", color:"#F8FAFC" } : SOURCE_META[src];
          return (
            <button key={src} onClick={() => setSource(src)} style={{
              padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:600,
              cursor:"pointer", transition:"all 0.15s",
              background: active ? (src === "all" ? "rgba(248,250,252,0.12)" : `rgba(${src === "user" ? "139,92,246" : src === "public" ? "6,182,212" : "52,211,153"},0.2)`) : "transparent",
              border: `1px solid ${active ? meta.color : "rgba(196,181,253,0.15)"}`,
              color: active ? meta.color : "#94A3B8",
              boxShadow: active && src !== "all" ? `0 0 10px ${SOURCE_META[src].glow}` : "none",
            }}>
              {meta.label} <span style={{ opacity:0.6, fontWeight:400 }}>
                {counts[src]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tag pills */}
      <div style={{ display:"flex", gap:5, marginBottom:20, flexWrap:"wrap" }}>
        {ALL_TAGS.map(t => {
          const c = TAG_COLORS[t] || TAG_COLORS.tools;
          const active = tagFilter === t;
          return (
            <button key={t} onClick={() => setTag(active ? null : t)} style={{
              padding:"3px 10px", borderRadius:12, fontSize:11, fontWeight:500,
              cursor:"pointer", transition:"all 0.12s",
              background: active ? c.bg : "transparent",
              border: `1px solid ${active ? c.border : "rgba(196,181,253,0.1)"}`,
              color: active ? c.text : "#94A3B8",
            }}>
              {t}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <div style={{ fontSize:11, color:"#94A3B8", marginBottom:14, letterSpacing:"0.05em" }}>
        {filtered.length} {filtered.length === 1 ? "skill" : "skills"} shown
        {tagFilter && <span> · tag: <span style={{ color: TAG_COLORS[tagFilter]?.text || "#C4B5FD" }}>{tagFilter}</span></span>}
      </div>

      {/* Skill grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:12 }}>
        {filtered.map(skill => {
          const srcMeta = SOURCE_META[skill.source];
          const isExpanded = expanded === skill.name;
          const isDone = installed.has(skill.name);
          const isBusy = installing === skill.name;

          return (
            <div key={skill.name} style={{
              background:"linear-gradient(135deg,rgba(10,10,15,0.7) 0%,rgba(20,19,40,0.5) 100%)",
              backdropFilter:"blur(12px)",
              border:`1px solid rgba(196,181,253,${isExpanded ? "0.25" : "0.1"})`,
              borderRadius:10,
              padding:"14px 16px",
              transition:"all 0.2s",
              cursor:"pointer",
              boxShadow: isExpanded ? `0 0 30px rgba(139,92,246,0.1), 0 4px 20px rgba(0,0,0,0.4)` : "0 2px 8px rgba(0,0,0,0.3)",
            }}
              onClick={() => setExpanded(isExpanded ? null : skill.name)}
            >
              {/* Card header */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#F8FAFC", marginBottom:3, letterSpacing:"-0.01em" }}>
                    {skill.name}
                  </div>
                  <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                    <span style={{
                      fontSize:10, padding:"1px 7px", borderRadius:8,
                      background:`rgba(${skill.source === "user" ? "139,92,246" : skill.source === "public" ? "6,182,212" : "52,211,153"},0.15)`,
                      border:`1px solid ${srcMeta.color}44`,
                      color: srcMeta.color,
                      letterSpacing:"0.05em",
                    }}>
                      {srcMeta.label}
                    </span>
                    <span style={{ fontSize:10, color:"#94A3B8", padding:"1px 0" }}>{skill.size}</span>
                  </div>
                </div>
                <span style={{ color:"#94A3B8", fontSize:12, marginLeft:8, flexShrink:0, marginTop:2 }}>
                  {isExpanded ? "▲" : "▼"}
                </span>
              </div>

              {/* Description — truncated unless expanded */}
              <p style={{
                fontSize:12, color:"#94A3B8", margin:"0 0 10px", lineHeight:"1.5",
                display:"-webkit-box", WebkitLineClamp: isExpanded ? "unset" : 2,
                WebkitBoxOrient:"vertical", overflow: isExpanded ? "visible" : "hidden",
              }}>
                {skill.desc}
              </p>

              {/* Tags */}
              <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom: isExpanded ? 12 : 0 }}>
                {skill.tags.map(t => {
                  const c = TAG_COLORS[t] || TAG_COLORS.tools;
                  return (
                    <span key={t} style={{
                      fontSize:10, padding:"2px 8px", borderRadius:10,
                      background:c.bg, border:`1px solid ${c.border}`, color:c.text,
                    }}
                      onClick={e => { e.stopPropagation(); setTag(tagFilter === t ? null : t); }}
                    >
                      {t}
                    </span>
                  );
                })}
              </div>

              {/* Install button — only show when expanded */}
              {isExpanded && (
                <button
                  onClick={e => { e.stopPropagation(); handleInstall(skill); }}
                  disabled={isBusy || isDone}
                  style={{
                    width:"100%", padding:"8px", borderRadius:7,
                    fontSize:12, fontWeight:600, cursor: isDone ? "default" : "pointer",
                    transition:"all 0.15s",
                    background: isDone
                      ? "rgba(52,211,153,0.15)"
                      : isBusy
                      ? "rgba(139,92,246,0.2)"
                      : "rgba(139,92,246,0.2)",
                    border: isDone
                      ? "1px solid rgba(52,211,153,0.4)"
                      : `1px solid rgba(139,92,246,0.5)`,
                    color: isDone ? "#34D399" : "#C4B5FD",
                    boxShadow: isDone ? "0 0 12px rgba(52,211,153,0.15)" : "0 0 12px rgba(139,92,246,0.15)",
                  }}
                >
                  {isDone ? "✓ Downloading…" : isBusy ? "Preparing…" : "↓ Install Skill"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:"center", padding:"60px 20px", color:"#94A3B8" }}>
          <div style={{ fontSize:28, marginBottom:8 }}>⌀</div>
          <div style={{ fontSize:14 }}>No skills match "{search}"</div>
        </div>
      )}

      <div style={{ marginTop:32, textAlign:"center", fontSize:11, color:"rgba(148,163,184,0.4)", letterSpacing:"0.1em" }}>
        FLASHFUSION · SKILL REGISTRY · {new Date().getFullYear()}
      </div>
    </div>
  );
}
