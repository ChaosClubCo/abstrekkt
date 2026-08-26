import { useState, useCallback } from "react";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const CONTEXTS = [
  { id: "enterprise", label: "Enterprise / Org", icon: "◆", desc: "Teams, departments, client engagements" },
  { id: "education",  label: "Education",        icon: "◎", desc: "Students, teachers, researchers, tutors" },
  { id: "individual", label: "Individual",       icon: "●", desc: "Career changers, creators, hobbyists, learners" },
];

const ROLES = {
  enterprise: [
    {
      id: "executive", label: "Executive / Leadership", icon: "◆", color: "#52525b",
      description: "C-Suite, VPs, Directors — strategy, board prep, decision memos",
      tier: "Claude Team", tierNote: "$30/user/mo",
      features: ["Web Search", "Memory", "Artifacts", "Deep Research", "Files"],
      disabled: ["Code Execution", "Computer Use"],
      tools: ["Notion", "Slack", "Linear", "Gmail"],
      platforms: ["Claude.ai Web"],
      useCases: ["Strategic memo and board deck drafting","Meeting summary + action item extraction","Market and competitor research","Quarterly business review preparation","All-hands announcement drafting"],
      restrictions: ["No M&A or material non-public information","Board materials in Private Projects only","Personnel decisions require HR review","Financial disclosures require CFO + Legal"],
      quickWin: "Summarize your last 5 meeting notes and extract all open action items into a prioritized list.",
      timeSaved: "35-40%",
    },
    {
      id: "security", label: "Security / Compliance", icon: "◈", color: "#7c3aed",
      description: "InfoSec, compliance officers, risk analysts",
      tier: "Claude Team (Full)", tierNote: "$30/user/mo",
      features: ["Web Search", "Memory", "Artifacts", "Code Execution", "Computer Use", "Deep Research", "Files"],
      disabled: [],
      tools: ["GitHub", "Sentry", "Linear", "Notion", "Slack"],
      platforms: ["Claude.ai Web", "Claude Desktop", "Claude Code"],
      useCases: ["Security assessment reports (NIST, ISO 27001, SOC 2)","Code review for OWASP Top 10","Compliance gap analysis (HIPAA, PCI-DSS, GDPR)","Incident response playbook creation","Threat modeling and risk scoring"],
      restrictions: ["NEVER enter credentials, API keys, or secrets","Critical vulnerabilities (CVSS ≥9) — immediate escalation","Client network diagrams in Private Projects only"],
      quickWin: "Paste a code snippet and ask Claude to check for OWASP Top 10 vulnerabilities with severity ratings.",
      timeSaved: "40-50%",
    },
    {
      id: "engineering", label: "Engineering / IT", icon: "⚡", color: "#6d28d9",
      description: "Developers, DevOps, QA, IT",
      tier: "Claude Team (Full)", tierNote: "$30/user/mo",
      features: ["Web Search", "Memory", "Artifacts", "Code Execution", "Computer Use", "Files"],
      disabled: ["Deep Research"],
      tools: ["GitHub", "Sentry", "Linear", "Vercel", "Notion", "Slack"],
      platforms: ["Claude Code (primary)", "Claude Desktop", "Claude.ai Web"],
      useCases: ["Code generation and security review","Architecture design documents","Test case generation and automation","Performance optimization analysis","Infrastructure as code"],
      restrictions: ["No production database credentials in prompts","Security findings >medium require review","Production deploys require approval","Architecture decisions require design doc"],
      quickWin: "Upload a function and ask Claude to write unit tests with edge cases and assertion explanations.",
      timeSaved: "40-55%",
    },
    {
      id: "client-facing", label: "Client Success / Sales", icon: "●", color: "#0891b2",
      description: "CSMs, AEs, account managers",
      tier: "Claude Pro or Team", tierNote: "$20–30/user/mo",
      features: ["Web Search", "Memory", "Artifacts", "Files", "Deep Research"],
      disabled: ["Code Execution", "Computer Use"],
      tools: ["HubSpot", "Notion", "Slack", "Linear", "Stripe"],
      platforms: ["Claude.ai Web", "Claude Mobile"],
      useCases: ["QBR preparation and client health reports","RFP analysis and response generation","Renewal proposal drafting","Meeting recap and follow-up emails","Competitive battle cards"],
      restrictions: ["No client financial details or pricing in prompts","No contract terms in shared chats","Churn risk requires escalation"],
      quickWin: "After a client call, paste your notes and ask Claude to format a recap with action items.",
      timeSaved: "30-45%",
    },
    {
      id: "marketing", label: "Marketing / Content", icon: "◐", color: "#ea580c",
      description: "Content, brand, design, campaigns",
      tier: "Claude Team", tierNote: "$30/user/mo",
      features: ["Web Search", "Memory", "Artifacts", "Deep Research", "Files"],
      disabled: ["Code Execution", "Computer Use"],
      tools: ["Figma", "Notion", "HubSpot", "Canva"],
      platforms: ["Claude.ai Web"],
      useCases: ["Blog posts, case studies, whitepapers","Email campaign copy with variants","Competitive messaging analysis","Design brief creation","Campaign performance interpretation"],
      restrictions: ["Anonymize all client names","Competitive content is internal only","Brand claims must cite sources"],
      quickWin: "Give Claude your brand voice guidelines and ask it to draft 3 LinkedIn post variants.",
      timeSaved: "35-40%",
    },
    {
      id: "operations", label: "Finance / HR / Operations", icon: "■", color: "#16a34a",
      description: "Back-office — budgets, policy, process, vendors",
      tier: "Claude Pro", tierNote: "$20/user/mo",
      features: ["Web Search", "Memory", "Artifacts", "Files"],
      disabled: ["Code Execution", "Computer Use", "Deep Research"],
      tools: ["Notion", "Slack", "Stripe", "Linear"],
      platforms: ["Claude.ai Web"],
      useCases: ["Budget variance analysis","Job description and policy drafting","SOP and runbook creation","Vendor comparison matrices","Weekly status report automation"],
      restrictions: ["Finance: changes above threshold need CFO approval","HR: NO PII/PHI ever","HR: Policy changes require Legal review"],
      quickWin: "Finance: Upload a P&L for top 5 variances. HR: Generate 10 behavioral interview questions.",
      timeSaved: "25-35%",
    },
  ],

  education: [
    {
      id: "student-higher-ed", label: "Student — College / Grad", icon: "◎", color: "#2563eb",
      description: "Undergrad, graduate, professional students",
      tier: "Claude Pro", tierNote: "$20/mo",
      features: ["Web Search", "Memory", "Artifacts", "Files", "Deep Research"],
      disabled: ["Computer Use"],
      tools: ["Google Drive", "Notion", "Zotero (manual)", "Google Scholar (manual)"],
      platforms: ["Claude.ai Web", "NotebookLM (for research)", "Perplexity (for sourced research)"],
      useCases: ["Literature review synthesis across multiple papers","Concept explanation with source grounding","Research question refinement","Argument structure review for papers","Code help for data analysis (Python/R)","Interview prep and case study practice"],
      restrictions: ["Check your institution's AI use policy before any submission","Always verify citations — Claude can hallucinate sources","Disclose AI assistance as required by your program","Don't paste copyrighted paper text in full"],
      quickWin: "Upload 3-5 papers to a Claude Project or NotebookLM. Ask: 'What are the main arguments, where do they agree, and where do they conflict?'",
      timeSaved: "Significant for research synthesis and concept mastery",
      integrityNote: "AI Policy Varies: Some professors ban AI entirely. Some require disclosure. Some encourage it. Know your policy before every assignment.",
    },
    {
      id: "teacher-k12", label: "Teacher — K-12", icon: "◆", color: "#16a34a",
      description: "Elementary through high school educators",
      tier: "Claude Pro or Team (schools)", tierNote: "$20–30/mo",
      features: ["Web Search", "Memory", "Artifacts", "Files", "Deep Research"],
      disabled: ["Computer Use"],
      tools: ["Google Drive", "Google Classroom (manual)", "Notion", "Canva"],
      platforms: ["Claude.ai Web", "Claude Mobile"],
      useCases: ["Lesson plan creation for any grade level and subject","Differentiated materials (3 reading levels from one text)","Rubric and assessment design","Parent communication drafts","IEP accommodation suggestions (anonymized)","Class discussion question banks","Student feedback templates"],
      restrictions: ["Never include real student names, IDs, or personal details","Anonymize any student work before pasting","Don't use AI-generated content as final grades — always review","Check your district's AI policy before using with students directly"],
      quickWin: "Tell Claude: 'Create a 45-minute lesson plan for [grade] students on [topic]. Include an opening hook, 3 activities at different ability levels, and an exit ticket.'",
      timeSaved: "3-5 hrs/week on lesson prep and communication",
    },
    {
      id: "teacher-higher-ed", label: "Professor / Instructor", icon: "◆", color: "#7c3aed",
      description: "College faculty, adjuncts, corporate trainers",
      tier: "Claude Pro or Team", tierNote: "$20–30/mo",
      features: ["Web Search", "Memory", "Artifacts", "Files", "Deep Research", "Code Execution"],
      disabled: ["Computer Use"],
      tools: ["Google Drive", "Notion", "GitHub (for tech courses)"],
      platforms: ["Claude.ai Web", "NotebookLM (course materials)", "Claude Code (CS/data courses)"],
      useCases: ["Syllabus and course structure design","Assignment and rubric creation","Lecture note synthesis and slide outlines","Research literature scanning","Student AI literacy curriculum design","Policy drafting for AI use in your course","Grading rubric consistency checking"],
      restrictions: ["Never paste student submissions without consent","Anonymize any student work","Be transparent with students about your AI use","Citation verification required for any research output"],
      quickWin: "Upload your course learning objectives and ask: 'Design 3 assessments that test these objectives at different Bloom's Taxonomy levels. Make one AI-resistant.'",
      timeSaved: "4-6 hrs/week on course prep and admin",
    },
    {
      id: "researcher", label: "Academic Researcher", icon: "◈", color: "#0d9488",
      description: "Faculty researchers, PhD candidates, postdocs",
      tier: "Claude Pro", tierNote: "$20/mo",
      features: ["Web Search", "Memory", "Artifacts", "Files", "Deep Research", "Code Execution"],
      disabled: ["Computer Use"],
      tools: ["Google Drive", "Notion", "GitHub", "Zotero (manual)"],
      platforms: ["Claude.ai Web", "NotebookLM (source grounding)", "Perplexity (citations)", "Claude Code (data analysis)"],
      useCases: ["Literature synthesis across large paper sets","Research gap identification","Methodology review and critique","Abstract and grant proposal drafting","Code for data analysis (Python/R/MATLAB)","IRB protocol documentation","Peer review response drafting"],
      restrictions: ["Verify all citations independently — hallucinations are common on specific papers","Never paste confidential peer review materials","Check journal/funder AI disclosure requirements","IRB: participant data must be fully anonymized before any AI processing"],
      quickWin: "Load 10 papers into a Claude Project. Ask: 'What is the current consensus on [question]? Where are the main disagreements? What gaps exist that my research could address?'",
      timeSaved: "Significant for literature review and methodology work",
    },
    {
      id: "tutor-coach", label: "Tutor / Learning Coach", icon: "●", color: "#ea580c",
      description: "Private tutors, academic coaches, learning specialists",
      tier: "Claude Pro", tierNote: "$20/mo",
      features: ["Web Search", "Memory", "Artifacts", "Files"],
      disabled: ["Code Execution", "Computer Use", "Deep Research"],
      tools: ["Notion", "Google Drive"],
      platforms: ["Claude.ai Web", "Claude Mobile"],
      useCases: ["Personalized explanation generation for specific students","Practice problem sets by topic and difficulty","Progress tracking templates","Study plan creation","Parent update templates","Concept analogies for different learning styles","Accommodation-aware material modification"],
      restrictions: ["Never include real student names or identifiable details in prompts","Keep all session notes anonymized","Maintain your professional expertise — Claude supplements, doesn't replace your judgment"],
      quickWin: "Tell Claude: 'My student is in [grade], struggles with [specific concept], and learns best with [visual/verbal/kinesthetic] examples. Give me 3 ways to explain this differently.'",
      timeSaved: "2-3 hrs/week on material creation",
    },
  ],

  individual: [
    {
      id: "career-changer", label: "Career Changer", icon: "▲", color: "#7c3aed",
      description: "Transitioning to tech, design, data, or a new industry",
      tier: "Claude Pro", tierNote: "$20/mo",
      features: ["Web Search", "Memory", "Artifacts", "Files", "Code Execution", "Deep Research"],
      disabled: ["Computer Use"],
      tools: ["GitHub (learning)", "Notion (notes)", "Google Drive"],
      platforms: ["Claude.ai Web", "Claude Code (for tech transitions)", "NotebookLM (learning library)"],
      useCases: ["Self-directed learning curriculum for a new field","Resume and LinkedIn reframing for new industry","Portfolio project ideas and feedback","Interview prep with realistic practice questions","Skills gap analysis: where you are vs where you need to be","Cover letter personalization for career pivot roles"],
      restrictions: ["Don't submit AI-written cover letters as-is — personalize them","Verify factual claims about job market data — things change fast","Claude can help you practice but can't predict if you'll get hired"],
      quickWin: "Tell Claude: 'I'm transitioning from [current role] to [target role]. I have [years] of experience in [skills]. What's my transferable value and what's my biggest gap?'",
      timeSaved: "Compress months of confusion into days of clarity",
    },
    {
      id: "self-learner", label: "Self-Directed Learner", icon: "◎", color: "#2563eb",
      description: "Teaching yourself anything — coding, languages, skills, subjects",
      tier: "Claude Free or Pro", tierNote: "Free – $20/mo",
      features: ["Web Search", "Memory", "Artifacts", "Files", "Code Execution"],
      disabled: ["Computer Use", "Deep Research"],
      tools: ["Notion (notes)", "GitHub (if coding)"],
      platforms: ["Claude.ai Web", "Claude Mobile", "NotebookLM (study library)", "Perplexity (research)"],
      useCases: ["Concept explanation at any level (from ELI5 to expert)","Custom study plans with milestones","Practice problems and immediate feedback","'Teach it back to me' comprehension checks","Finding the best learning resources for a topic","Building projects to apply what you've learned"],
      restrictions: ["Don't use Claude as a crutch — struggle a bit before asking","Make sure you actually understand the answer, not just copied it","Verify technical information for anything you'll use in production"],
      quickWin: "Tell Claude: 'I want to learn [topic]. I'm a complete beginner. Give me a 4-week learning plan with daily tasks, free resources, and a project to build at the end.'",
      timeSaved: "Replace months of unfocused browsing with a real plan",
    },
    {
      id: "creator", label: "Creator / Writer / Maker", icon: "◑", color: "#ea580c",
      description: "Indie creators, writers, designers, solopreneurs, makers",
      tier: "Claude Pro", tierNote: "$20/mo",
      features: ["Web Search", "Memory", "Artifacts", "Files", "Deep Research"],
      disabled: ["Code Execution", "Computer Use"],
      tools: ["Notion", "Google Drive", "Figma (if design)"],
      platforms: ["Claude.ai Web", "Claude Mobile"],
      useCases: ["Content creation at scale (articles, scripts, social posts, newsletters)","Audience and niche research","Product idea validation and feedback","Brand voice development and consistency","Editing and feedback on long-form writing","Business model and pricing thinking","Email and community communication"],
      restrictions: ["Don't publish AI content without reading and editing it — your audience can tell","Fact-check anything factual","Be transparent about AI use where your audience expects it"],
      quickWin: "Upload your last 3 pieces of writing. Ask Claude: 'Identify my voice, my recurring themes, and 5 content angles I haven't explored yet.'",
      timeSaved: "2-4x content output without proportional time increase",
    },
    {
      id: "professional-dev", label: "Professional Development", icon: "◆", color: "#0891b2",
      description: "Mid-career professionals growing skills, preparing for promotion, or building expertise",
      tier: "Claude Pro", tierNote: "$20/mo",
      features: ["Web Search", "Memory", "Artifacts", "Files", "Deep Research"],
      disabled: ["Code Execution", "Computer Use"],
      tools: ["Notion", "LinkedIn (manual)", "Google Drive"],
      platforms: ["Claude.ai Web", "Claude Mobile", "NotebookLM (for books/courses)"],
      useCases: ["Performance review prep and self-assessment drafting","Skill development planning for promotion","Executive communication practice (emails, presentations)","Meeting prep and stakeholder analysis","Building expertise in adjacent domains","Networking message drafting","Speaking and writing for visibility"],
      restrictions: ["Don't include confidential company information","Don't paste colleague names and their specific behaviors into prompts","Review AI-drafted communications for tone before sending"],
      quickWin: "Tell Claude: 'I'm a [role] trying to get promoted to [next level]. Based on what I've told you about my work, what's my promotion narrative and what gaps should I address?'",
      timeSaved: "Clarity on direction saves more time than any efficiency tool",
    },
    {
      id: "curious", label: "Curious Person / Explorer", icon: "●", color: "#16a34a",
      description: "Using AI to understand the world better — no specific goal",
      tier: "Claude Free or Pro", tierNote: "Free – $20/mo",
      features: ["Web Search", "Memory", "Artifacts", "Files"],
      disabled: ["Code Execution", "Computer Use"],
      tools: [],
      platforms: ["Claude.ai Web", "Claude Mobile"],
      useCases: ["Deep dives on any topic that interests you","Understanding complex news and current events","Learning the history behind anything","'Explain how X actually works'","Philosophical conversations and thought experiments","Book recommendations with actual explanations why","Rabbit holes with a guide who doesn't get tired"],
      restrictions: ["Verify factual claims on important topics — Claude can be wrong","Web search helps but Claude isn't a real-time news feed","For medical/legal/financial questions, use Claude to get literate — then see a professional"],
      quickWin: "Pick any topic that's been in the back of your mind. Ask Claude: 'Give me the 30-minute deep dive. Start with the basics, get weird in the middle, and tell me what experts actually disagree about.'",
      timeSaved: "Not the point — this is about understanding",
    },
  ],
};

const MCP_CATALOG = [
  { id: "notion", label: "Notion", url: "https://mcp.notion.com/mcp" },
  { id: "slack", label: "Slack", url: "https://mcp.slack.com/mcp" },
  { id: "github", label: "GitHub", url: "https://mcp.github.com/sse" },
  { id: "linear", label: "Linear", url: "https://mcp.linear.app/mcp" },
  { id: "hubspot", label: "HubSpot", url: "https://mcp.hubspot.com/anthropic" },
  { id: "sentry", label: "Sentry", url: "https://mcp.sentry.dev/mcp" },
  { id: "figma", label: "Figma", url: "https://mcp.figma.com/mcp" },
  { id: "vercel", label: "Vercel", url: "https://mcp.vercel.com" },
  { id: "stripe", label: "Stripe", url: "https://mcp.stripe.com" },
  { id: "gmail", label: "Gmail", url: "https://gmailmcp.googleapis.com/mcp/v1" },
  { id: "gdrive", label: "Google Drive", url: "https://drivemcp.googleapis.com/mcp/v1" },
  { id: "gcal", label: "Google Calendar", url: "https://calendarmcp.googleapis.com/mcp/v1" },
  { id: "canva", label: "Canva", url: "https://mcp.canva.com/mcp" },
];

const CONTEXT_COLORS = { enterprise: "#7c3aed", education: "#0891b2", individual: "#16a34a" };

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

function Badge({ children, bg, color, border }) {
  return <span style={{ display: "inline-block", padding: "2px 7px", borderRadius: 3, fontSize: 10, fontWeight: 600, margin: "2px 2px", background: bg, color, border: `1px solid ${border || "transparent"}` }}>{children}</span>;
}

function EditModal({ role, onSave, onClose }) {
  const [form, setForm] = useState({
    ...role,
    useCases: [...role.useCases],
    restrictions: [...role.restrictions],
    tools: [...role.tools],
    features: [...role.features],
    disabled: [...role.disabled],
    platforms: [...(role.platforms || [])],
  });
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const updateList = (k, i, v) => { const a = [...form[k]]; a[i] = v; update(k, a); };
  const addItem = (k) => update(k, [...form[k], ""]);
  const removeItem = (k, i) => update(k, form[k].filter((_, j) => j !== i));

  const iStyle = { width: "100%", padding: "6px 8px", borderRadius: 4, border: "1px solid #3f3f46", background: "#27272a", color: "#fafafa", fontSize: 12, fontFamily: "inherit" };
  const lStyle = { fontSize: 10, fontWeight: 700, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4, display: "block" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: 32, overflowY: "auto" }}>
      <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12, padding: 24, width: "100%", maxWidth: 560, maxHeight: "88vh", overflowY: "auto", margin: "0 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ color: "#fafafa", fontSize: 15, margin: 0 }}>Edit: {form.label}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#71717a", fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <div><label style={lStyle}>Role Name</label><input style={iStyle} value={form.label} onChange={e => update("label", e.target.value)} /></div>
          <div><label style={lStyle}>Description</label><input style={iStyle} value={form.description} onChange={e => update("description", e.target.value)} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div><label style={lStyle}>Tier</label><input style={iStyle} value={form.tier} onChange={e => update("tier", e.target.value)} /></div>
            <div><label style={lStyle}>Time Saved / Value</label><input style={iStyle} value={form.timeSaved} onChange={e => update("timeSaved", e.target.value)} /></div>
          </div>
          <div><label style={lStyle}>Quick Win Prompt</label><textarea style={{ ...iStyle, minHeight: 48, resize: "vertical" }} value={form.quickWin} onChange={e => update("quickWin", e.target.value)} /></div>
          {[["useCases","Use Cases"],["restrictions","Restrictions / Guardrails"],["tools","Connected Tools"],["platforms","Recommended Platforms"]].map(([k, t]) => (
            <div key={k}>
              <label style={lStyle}>{t}</label>
              {form[k].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                  <input style={{ ...iStyle, flex: 1 }} value={item} onChange={e => updateList(k, i, e.target.value)} />
                  <button onClick={() => removeItem(k, i)} style={{ background: "none", border: "1px solid #3f3f46", borderRadius: 4, color: "#ef4444", cursor: "pointer", padding: "0 8px", fontSize: 12 }}>−</button>
                </div>
              ))}
              <button onClick={() => addItem(k)} style={{ background: "none", border: "1px dashed #3f3f46", borderRadius: 4, color: "#71717a", cursor: "pointer", padding: "4px 12px", fontSize: 11, width: "100%", marginTop: 2 }}>+ Add</button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "7px 14px", borderRadius: 6, border: "1px solid #3f3f46", background: "none", color: "#a1a1aa", fontSize: 12, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} style={{ padding: "7px 14px", borderRadius: 6, border: "none", background: "#7c3aed", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

export default function FlashFusionProfileBuilder() {
  const [context, setContext] = useState(null);
  const [roles, setRoles] = useState({});
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [copied, setCopied] = useState("");
  const [view, setView] = useState("builder");
  const [clientName, setClientName] = useState("");

  const activeRoles = context ? (roles[context] || ROLES[context]) : [];
  const role = activeRoles.find(r => r.id === selected);
  const ctxColor = context ? CONTEXT_COLORS[context] : "#7c3aed";

  const selectContext = (id) => {
    setContext(id);
    setSelected(null);
    if (!roles[id]) setRoles(prev => ({ ...prev, [id]: ROLES[id].map(r => ({ ...r })) }));
  };

  const handleSaveRole = useCallback((updated) => {
    setRoles(prev => ({ ...prev, [context]: prev[context].map(r => r.id === updated.id ? updated : r) }));
  }, [context]);

  const copy = (label, data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const iStyle = { padding: "6px 10px", borderRadius: 6, border: "1px solid #27272a", background: "#0a0a0f", color: "#fafafa", fontSize: 12, fontFamily: "inherit", width: "100%" };

  return (
    <div style={{ fontFamily: "'Geist', system-ui, sans-serif", background: "#09090f", color: "#fafafa", minHeight: "100vh", padding: "20px 16px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>FlashFusion</div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>AI Profile Builder</h1>
            <p style={{ fontSize: 11, color: "#71717a", margin: "4px 0 0" }}>Configure Claude for any role, in any context</p>
          </div>
          {context && (
            <div style={{ display: "flex", gap: 5 }}>
              {["builder", "matrix", "export"].map(v => (
                <button key={v} onClick={() => setView(v)} style={{ padding: "5px 12px", borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: "pointer", border: view === v ? `1px solid ${ctxColor}` : "1px solid #27272a", background: view === v ? `${ctxColor}20` : "transparent", color: view === v ? ctxColor : "#71717a" }}>
                  {v === "builder" ? "Builder" : v === "matrix" ? "RBAC" : "Export"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Context selector */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Who are we configuring for?</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {CONTEXTS.map(c => (
              <button key={c.id} onClick={() => selectContext(c.id)} style={{ padding: "12px 14px", borderRadius: 8, cursor: "pointer", textAlign: "left", border: context === c.id ? `2px solid ${CONTEXT_COLORS[c.id]}` : "1px solid #27272a", background: context === c.id ? `${CONTEXT_COLORS[c.id]}12` : "#111116", transition: "all 0.15s" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{c.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fafafa", marginBottom: 2 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: "#71717a" }}>{c.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {!context && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#3f3f46", fontSize: 13 }}>
            Select a context above to begin
          </div>
        )}

        {context && view === "builder" && (
          <>
            <input style={{ ...iStyle, marginBottom: 16 }} placeholder={context === "enterprise" ? "Client or organization name (optional)" : context === "education" ? "School, institution, or name (optional)" : "Your name or project (optional)"} value={clientName} onChange={e => setClientName(e.target.value)} />

            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 14 }}>
              {/* Role list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {activeRoles.map(r => (
                  <button key={r.id} onClick={() => setSelected(r.id)} style={{ padding: "10px 12px", borderRadius: 7, border: selected === r.id ? `2px solid ${r.color}` : "1px solid #27272a", background: selected === r.id ? `${r.color}12` : "#18181b", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                      <span style={{ color: r.color, fontSize: 13 }}>{r.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#fafafa" }}>{r.label}</span>
                    </div>
                    <div style={{ fontSize: 10, color: "#52525b", lineHeight: 1.3 }}>{r.description}</div>
                  </button>
                ))}
              </div>

              {/* Detail panel */}
              {role ? (
                <div style={{ background: "#111116", border: "1px solid #27272a", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ background: role.color, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: 16, marginRight: 8 }}>{role.icon}</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{role.label}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ background: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: 600, color: "#fff" }}>{role.tier}</span>
                      <span style={{ background: "rgba(255,255,255,0.1)", padding: "3px 8px", borderRadius: 10, fontSize: 10, color: "rgba(255,255,255,0.8)" }}>{role.tierNote}</span>
                      <button onClick={() => setEditing(role)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 5, color: "#fff", fontSize: 11, padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>Edit</button>
                    </div>
                  </div>

                  <div style={{ padding: 16 }}>
                    {/* Academic integrity alert */}
                    {role.integrityNote && (
                      <div style={{ background: "#1c1500", border: "1px solid #713f12", borderRadius: 6, padding: "8px 12px", marginBottom: 12, fontSize: 11, color: "#fbbf24" }}>
                        ⚠ {role.integrityNote}
                      </div>
                    )}

                    {/* Features */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Features</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                        {role.features.map(f => <Badge key={f} bg="rgba(34,197,94,0.12)" color="#22c55e" border="rgba(34,197,94,0.2)">✓ {f}</Badge>)}
                        {role.disabled.map(f => <Badge key={f} bg="rgba(239,68,68,0.08)" color="#ef4444" border="rgba(239,68,68,0.15)">✗ {f}</Badge>)}
                      </div>
                    </div>

                    {/* Platforms */}
                    {role.platforms && role.platforms.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Recommended Platforms</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {role.platforms.map(p => <Badge key={p} bg="#1e1b4b" color="#a78bfa" border="#312e81">{p}</Badge>)}
                        </div>
                      </div>
                    )}

                    {/* Tools (only for enterprise/education with real MCP) */}
                    {role.tools && role.tools.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Connected Tools</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {role.tools.map(t => <Badge key={t} bg="#0f172a" color="#94a3b8" border="#1e293b">{t}</Badge>)}
                        </div>
                      </div>
                    )}

                    {/* Use cases + restrictions */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Use Cases</div>
                        {role.useCases.map((u, i) => <div key={i} style={{ fontSize: 11, color: "#d4d4d8", lineHeight: 1.7, paddingLeft: 8, borderLeft: `2px solid ${role.color}40`, marginBottom: 3 }}>{u}</div>)}
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>⚠ Guardrails</div>
                        {role.restrictions.map((r, i) => <div key={i} style={{ fontSize: 11, color: "#fca5a5", lineHeight: 1.7, paddingLeft: 8, borderLeft: "2px solid #7f1d1d", marginBottom: 3 }}>{r}</div>)}
                      </div>
                    </div>

                    {/* Quick win */}
                    <div style={{ background: "#052e16", border: "1px solid #14532d", borderRadius: 6, padding: 10, marginBottom: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", marginBottom: 4 }}>⚡ Try This First</div>
                      <div style={{ fontSize: 11, color: "#86efac", lineHeight: 1.5 }}>{role.quickWin}</div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "#71717a" }}>{role.timeSaved}</span>
                      <button onClick={() => copy("role", { role: role.label, tier: role.tier, features: { enabled: role.features, disabled: role.disabled }, platforms: role.platforms, tools: role.tools, restrictions: role.restrictions })} style={{ padding: "6px 14px", borderRadius: 5, border: "none", background: ctxColor, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                        {copied === "role" ? "✓ Copied" : "Copy Config"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #27272a", borderRadius: 10, color: "#3f3f46", fontSize: 13 }}>
                  Select a role
                </div>
              )}
            </div>
          </>
        )}

        {/* RBAC Matrix — enterprise only (education/individual have no MCP matrix) */}
        {context === "enterprise" && view === "matrix" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr>
                  <th style={{ padding: "8px 10px", textAlign: "left", borderBottom: "1px solid #27272a", color: "#71717a", fontSize: 10 }}>Feature / Tool</th>
                  {activeRoles.map(r => <th key={r.id} style={{ padding: "8px 6px", textAlign: "center", borderBottom: "1px solid #27272a", color: r.color, fontSize: 10, minWidth: 72 }}>{r.label.split("/")[0].trim()}</th>)}
                </tr>
              </thead>
              <tbody>
                {["Web Search","Memory","Artifacts","Files","Code Execution","Computer Use","Deep Research"].map(feat => (
                  <tr key={feat}>
                    <td style={{ padding: "6px 10px", borderBottom: "1px solid #1a1a1f", color: "#a1a1aa" }}>{feat}</td>
                    {activeRoles.map(r => <td key={r.id} style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid #1a1a1f", color: r.features.includes(feat) ? "#22c55e" : "#2a2a2f" }}>{r.features.includes(feat) ? "✓" : "—"}</td>)}
                  </tr>
                ))}
                <tr><td colSpan={activeRoles.length + 1} style={{ padding: "8px 10px 4px", fontSize: 10, color: "#71717a", fontWeight: 700, textTransform: "uppercase" }}>MCP Servers</td></tr>
                {MCP_CATALOG.filter(m => activeRoles.some(r => r.tools.includes(m.label))).map(mcp => (
                  <tr key={mcp.id}>
                    <td style={{ padding: "6px 10px", borderBottom: "1px solid #1a1a1f", color: "#a1a1aa" }}>{mcp.label}</td>
                    {activeRoles.map(r => <td key={r.id} style={{ padding: "6px", textAlign: "center", borderBottom: "1px solid #1a1a1f", color: r.tools.includes(mcp.label) ? "#a78bfa" : "#27272a" }}>{r.tools.includes(mcp.label) ? "●" : "—"}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {context && context !== "enterprise" && view === "matrix" && (
          <div style={{ padding: 24, textAlign: "center", color: "#71717a", fontSize: 13, border: "1px dashed #27272a", borderRadius: 8 }}>
            RBAC matrix applies to enterprise deployments with MCP server access control.<br />
            <span style={{ fontSize: 11, color: "#52525b" }}>Education and individual contexts use personal Claude accounts without org-level RBAC.</span>
          </div>
        )}

        {/* Export */}
        {context && view === "export" && (
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ background: "#111116", border: "1px solid #27272a", borderRadius: 8, padding: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 4px", color: "#fafafa" }}>Full Configuration</h3>
              <p style={{ fontSize: 11, color: "#71717a", margin: "0 0 10px" }}>All roles for {clientName || "this configuration"}.</p>
              <button onClick={() => copy("full", { context, name: clientName, roles: activeRoles.map(r => ({ role: r.label, tier: r.tier, features: { enabled: r.features, disabled: r.disabled }, platforms: r.platforms, tools: r.tools, restrictions: r.restrictions })) })} style={{ padding: "8px 16px", borderRadius: 5, border: "none", background: ctxColor, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {copied === "full" ? "✓ Copied" : "Copy Full JSON"}
              </button>
            </div>
            {context === "enterprise" && (
              <div style={{ background: "#111116", border: "1px solid #27272a", borderRadius: 8, padding: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 4px", color: "#fafafa" }}>Claude Desktop MCP Config</h3>
                <p style={{ fontSize: 11, color: "#71717a", margin: "0 0 10px" }}>claude_desktop_config.json for all enterprise roles.</p>
                <button onClick={() => { const all = [...new Set(activeRoles.flatMap(r => r.tools))]; const cfg = { mcpServers: Object.fromEntries(all.map(t => { const m = MCP_CATALOG.find(mc => mc.label === t); return m ? [m.id, { type: "url", url: m.url, name: `${m.id}-mcp` }] : null; }).filter(Boolean)) }; copy("mcp", cfg); }} style={{ padding: "8px 16px", borderRadius: 5, border: "none", background: "#27272a", color: "#a1a1aa", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  {copied === "mcp" ? "✓ Copied" : "Copy MCP Config"}
                </button>
              </div>
            )}
            <div style={{ background: "#111116", border: "1px solid #27272a", borderRadius: 8, padding: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 8px", color: "#fafafa" }}>Per-Role Configs</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {activeRoles.map(r => (
                  <button key={r.id} onClick={() => copy(`role-${r.id}`, { role: r.label, tier: r.tier, features: { enabled: r.features, disabled: r.disabled }, platforms: r.platforms, tools: r.tools, restrictions: r.restrictions, quickWin: r.quickWin })} style={{ padding: "6px 12px", borderRadius: 5, border: `1px solid ${r.color}40`, background: `${r.color}10`, color: r.color, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                    {copied === `role-${r.id}` ? "✓" : r.icon} {r.label.split("/")[0].trim()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {editing && <EditModal role={editing} onSave={handleSaveRole} onClose={() => setEditing(null)} />}

        <div style={{ marginTop: 20, padding: "10px 0", borderTop: "1px solid #1a1a1f", display: "flex", justifyContent: "space-between", fontSize: 10, color: "#3f3f46" }}>
          <span>FlashFusion AI Profile Builder v2.0</span>
          <span>{context ? `${CONTEXTS.find(c => c.id === context)?.label} · ${activeRoles.length} roles` : "Select a context"}</span>
        </div>
      </div>
    </div>
  );
}
