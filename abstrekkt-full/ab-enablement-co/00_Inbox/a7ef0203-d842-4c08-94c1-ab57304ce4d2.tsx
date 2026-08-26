import { useState, useMemo } from "react";

const ROLES = [
  { value: "executive", label: "Executive / C-Suite" },
  { value: "security", label: "Security / Compliance" },
  { value: "engineering", label: "Engineering / IT" },
  { value: "sales", label: "Sales / Business Dev" },
  { value: "client-success", label: "Client Success / Account Mgmt" },
  { value: "marketing", label: "Marketing / Content" },
  { value: "operations", label: "Finance / HR / Operations" },
  { value: "data", label: "Data / Analytics" },
];

const INDUSTRIES = [
  { value: "technology", label: "Technology / SaaS" },
  { value: "healthcare", label: "Healthcare / Life Sciences" },
  { value: "financial", label: "Financial Services" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "retail", label: "Retail / E-commerce" },
  { value: "professional", label: "Professional Services" },
  { value: "government", label: "Government / Public Sector" },
  { value: "nonprofit", label: "Nonprofit" },
];

const STAGES = [
  { value: "startup", label: "Startup (1–50)" },
  { value: "smb", label: "SMB (50–200)" },
  { value: "midmarket", label: "Mid-Market (200–1K)" },
  { value: "enterprise", label: "Enterprise (1K+)" },
];

const DOMAINS = [
  { value: "all", label: "All Domains" },
  { value: "implementation", label: "Implementation" },
  { value: "prompts", label: "Prompts & Workflows" },
  { value: "governance", label: "Governance" },
  { value: "training", label: "Training" },
];

const PLATFORMS = {
  claude: { label: "Claude", color: "#7c3aed", bestFor: "Complex reasoning, long documents, code, research" },
  copilot: { label: "Microsoft Copilot", color: "#0078d4", bestFor: "M365-native tasks, Word/Excel/Teams integration" },
  gemini: { label: "Google Gemini", color: "#4285f4", bestFor: "Google Workspace workflows, multimodal" },
  chatgpt: { label: "ChatGPT", color: "#10a37f", bestFor: "General productivity, plugins, image generation" },
  n8n: { label: "n8n / Automation", color: "#ff6d00", bestFor: "Multi-system orchestration, workflow automation" },
  notebooklm: { label: "NotebookLM", color: "#34a853", bestFor: "Document analysis, audio summaries, source grounding" },
  perplexity: { label: "Perplexity", color: "#20808d", bestFor: "Research with citations, real-time web search" },
};

const FF_SERVICES = {
  audit: { label: "AI Setup Audit", price: "$0–$1,500", desc: "Scorecard assessment of AI readiness" },
  sprint: { label: "Enablement Sprint", price: "$4,500", desc: "6-week pilot with full config + governance" },
  retainer: { label: "Managed Retainer", price: "$2K/mo", desc: "Ongoing optimization + monthly check-ins" },
  vcaio: { label: "vCAIO Advisory", price: "Custom", desc: "Strategic AI roadmap + vendor oversight" },
};

const USE_CASES = [
  {
    id: "uc1", title: "Automated Code Review Pipeline", domain: "implementation", priority: "High", effort: "Medium", trending: true,
    roles: ["engineering", "security"], industries: ["technology", "financial", "healthcare"], stages: ["smb", "midmarket", "enterprise"],
    platforms: ["claude"], surface: "Claude Code",
    desc: {
      executive: "Reduce code defect rates and deployment incidents through AI-driven review — measurable quality improvements without growing headcount.",
      technical: "Deploy Claude Code as an autonomous reviewer catching OWASP Top 10 vulnerabilities and enforcing coding standards before human review. Integrate via GitHub Actions or pre-commit hooks.",
      operational: "AI checks every code change for common errors before a human looks at it — cutting review cycles and getting features shipped faster.",
    },
    quickStart: "Upload a code file to Claude and ask: 'Review this for security vulnerabilities, code quality issues, and suggest improvements with severity ratings.'",
    timeSaved: "8–12 hrs/week per team", ffService: "sprint",
  },
  {
    id: "uc2", title: "Strategic Decision Memo Generator", domain: "prompts", priority: "High", effort: "Low", trending: false,
    roles: ["executive"], industries: ["technology", "professional", "financial", "healthcare", "manufacturing", "retail", "government", "nonprofit"], stages: ["smb", "midmarket", "enterprise"],
    platforms: ["claude", "perplexity"], surface: "Claude.ai Web",
    desc: {
      executive: "Turn rough strategic thinking into structured decision memos with market context, risk analysis, and clear recommendations in minutes instead of days.",
      technical: "Use Deep Research + Web Search to gather market data, then Artifacts to produce a formatted memo with sections for context, options, risks, and recommendation.",
      operational: "AI drafts the memo structure, pulls supporting data, and formats it — you review and adjust. Cuts a 4-hour task to 30 minutes.",
    },
    quickStart: "Tell Claude: 'I need a decision memo on [topic]. Include market context, 3 options with tradeoffs, risk assessment, and your recommendation. Use web search for current data.'",
    timeSaved: "3–5 hrs/week", ffService: "audit",
  },
  {
    id: "uc3", title: "Compliance Gap Analysis Automation", domain: "governance", priority: "High", effort: "High", trending: true,
    roles: ["security", "operations"], industries: ["healthcare", "financial", "government"], stages: ["midmarket", "enterprise"],
    platforms: ["claude"], surface: "Claude.ai Web (Projects)",
    desc: {
      executive: "Accelerate compliance audits from weeks to days. Map current controls against HIPAA, PCI-DSS, SOC 2, or ISO 27001 frameworks with AI-assisted gap identification.",
      technical: "Upload policy documents to a Claude Project. Ask for framework-specific mapping with gap scoring by severity and remediation effort. Export as structured artifact.",
      operational: "AI reads your existing policies and maps them against compliance requirements, highlighting what's missing and prioritizing what to fix first.",
    },
    quickStart: "Create a Claude Project, upload your security policies, and ask: 'Map these against [HIPAA/SOC 2/PCI-DSS] requirements. Score each control as Implemented, Partial, or Missing. Prioritize gaps by risk.'",
    timeSaved: "20–40 hrs per audit cycle", ffService: "sprint",
  },
  {
    id: "uc4", title: "Client QBR Preparation", domain: "prompts", priority: "Medium", effort: "Low", trending: false,
    roles: ["client-success", "sales"], industries: ["technology", "professional"], stages: ["smb", "midmarket", "enterprise"],
    platforms: ["claude", "copilot"], surface: "Claude.ai Web or Copilot (PowerPoint)",
    desc: {
      executive: "Standardize QBR quality across all account managers. Every client gets the same caliber of analysis regardless of which CSM owns the relationship.",
      technical: "Pull usage metrics from CRM (HubSpot/Salesforce via MCP), synthesize with support ticket data, generate a structured QBR deck with wins, risks, and expansion opportunities.",
      operational: "AI builds your QBR slides from data you already have. You review, personalize, and present. No more starting from scratch each quarter.",
    },
    quickStart: "Paste your client notes and ask: 'Create a QBR outline with: key metrics, wins this quarter, open issues, expansion opportunities, and 3 questions to ask the client.'",
    timeSaved: "4–6 hrs per QBR", ffService: "audit",
  },
  {
    id: "uc5", title: "RFP Response Acceleration", domain: "prompts", priority: "High", effort: "Medium", trending: true,
    roles: ["sales"], industries: ["technology", "professional", "government"], stages: ["smb", "midmarket", "enterprise"],
    platforms: ["claude"], surface: "Claude.ai Web (Projects)",
    desc: {
      executive: "Win more deals by responding to RFPs faster and more comprehensively. AI extracts requirements, maps capabilities, and drafts section-by-section responses.",
      technical: "Upload the RFP to a Claude Project with your capability docs. Claude extracts every requirement, maps to your capabilities, identifies gaps, and generates a compliance matrix + draft responses.",
      operational: "Instead of 3 people spending 2 weeks on an RFP, AI does the extraction and first draft in hours. Your team reviews, refines, and adds client-specific differentiation.",
    },
    quickStart: "Upload an RFP and your company capabilities doc. Ask: 'Extract all requirements into a numbered list. For each, indicate if we can comply (Full/Partial/Gap) and draft a response.'",
    timeSaved: "15–25 hrs per RFP", ffService: "sprint",
  },
  {
    id: "uc6", title: "Multi-System Workflow Orchestration", domain: "implementation", priority: "Medium", effort: "High", trending: true,
    roles: ["engineering", "operations"], industries: ["technology", "retail", "manufacturing"], stages: ["midmarket", "enterprise"],
    platforms: ["n8n", "claude"], surface: "n8n + Claude API",
    desc: {
      executive: "Connect your CRM, ticketing, documentation, and communication tools into automated workflows that trigger based on business events — no manual handoffs.",
      technical: "Use n8n for orchestration with Claude API as the reasoning layer. Build trigger-based workflows: new ticket → classify → route → draft response → notify. MCP servers for direct tool integration.",
      operational: "When something happens in one system (new ticket, deal stage change, alert), the workflow automatically takes action across other systems without anyone copying and pasting.",
    },
    quickStart: "Start with one workflow: 'When a support ticket is created, classify its urgency, draft a response, and route to the right team.' Build in n8n with Claude as the classification engine.",
    timeSaved: "10–20 hrs/week (operations)", ffService: "sprint",
  },
  {
    id: "uc7", title: "Role-Specific AI Training Program", domain: "training", priority: "High", effort: "Medium", trending: false,
    roles: ["executive", "operations"], industries: ["technology", "professional", "healthcare", "financial", "manufacturing", "retail", "government", "nonprofit"], stages: ["smb", "midmarket", "enterprise"],
    platforms: ["claude", "copilot", "gemini"], surface: "Platform-agnostic",
    desc: {
      executive: "Generic AI training wastes budget — 77% of orgs offer it but only 21% see ROI. Role-specific training tied to actual workflows produces measurable productivity gains within 90 days.",
      technical: "Build prompt libraries per role, create Claude Projects per department with pre-loaded context, and establish a 6-week adoption tracking cadence with weekly office hours.",
      operational: "Each team gets training on THEIR workflows, not generic AI demos. Sales learns RFP acceleration. Engineering learns code review. Finance learns variance analysis. Measured at 30/60/90 days.",
    },
    quickStart: "Pick your highest-leverage department. Build 5 prompt templates for their top tasks. Run a 30-minute workshop. Track adoption weekly for 6 weeks.",
    timeSaved: "6.4 hrs/week per trained user (IDC/Microsoft 2025)", ffService: "sprint",
  },
  {
    id: "uc8", title: "Incident Response Playbook Generation", domain: "governance", priority: "High", effort: "Low", trending: false,
    roles: ["security"], industries: ["technology", "healthcare", "financial", "government"], stages: ["smb", "midmarket", "enterprise"],
    platforms: ["claude"], surface: "Claude.ai Web",
    desc: {
      executive: "Every organization needs IR playbooks. AI generates framework-compliant playbooks in hours instead of weeks, covering scenarios from phishing to ransomware to data breach.",
      technical: "Provide your environment details (tech stack, team structure, compliance requirements) and ask Claude to generate NIST-aligned IR playbooks for specific scenarios. Iterate with tabletop exercises.",
      operational: "AI builds the playbook structure, you validate against your actual environment. Covers: detection, containment, eradication, recovery, lessons learned.",
    },
    quickStart: "Ask Claude: 'Create an incident response playbook for a ransomware attack at a [company size] [industry] company. Include NIST CSF phases, team responsibilities, communication templates, and a 72-hour timeline.'",
    timeSaved: "15–30 hrs per playbook", ffService: "audit",
  },
  {
    id: "uc9", title: "Content Campaign Production", domain: "prompts", priority: "Medium", effort: "Low", trending: false,
    roles: ["marketing"], industries: ["technology", "professional", "retail", "nonprofit"], stages: ["startup", "smb", "midmarket"],
    platforms: ["claude", "chatgpt"], surface: "Claude.ai Web",
    desc: {
      executive: "Produce multi-channel campaign content (email, blog, social, landing page) at 3x the speed without proportional headcount increase.",
      technical: "Load brand voice guidelines into a Claude Project. Generate campaign variants per channel with A/B options. Use memory to maintain brand consistency across sessions.",
      operational: "Give AI your campaign brief and brand voice doc. Get back email copy, blog drafts, social posts, and design briefs in one session instead of a week of back-and-forth.",
    },
    quickStart: "Upload your brand guidelines and tell Claude: 'Create a content campaign for [product/announcement]. I need: 1 blog post outline, 3 email subject lines with body copy, 5 LinkedIn posts, and a design brief for the hero image.'",
    timeSaved: "8–15 hrs per campaign", ffService: "audit",
  },
  {
    id: "uc10", title: "Financial Variance Analysis", domain: "prompts", priority: "Medium", effort: "Low", trending: false,
    roles: ["operations"], industries: ["technology", "professional", "manufacturing", "retail"], stages: ["smb", "midmarket", "enterprise"],
    platforms: ["claude", "copilot"], surface: "Claude.ai Web or Copilot (Excel)",
    desc: {
      executive: "Monthly close analysis that used to take 2 days now takes 2 hours. AI identifies variances, explains likely causes, and flags items requiring leadership attention.",
      technical: "Upload P&L and budget files. Claude's code execution analyzes variances by line item, calculates percentage deviations, and generates a formatted report with visualizations.",
      operational: "Drop in your spreadsheets, get back a variance report with the top items flagged and explained. Review and adjust instead of building from scratch.",
    },
    quickStart: "Upload your P&L and budget spreadsheet. Ask: 'Compare actuals vs budget by line item. Flag anything with >10% variance. For each flag, suggest a likely cause and whether it needs CFO attention.'",
    timeSaved: "4–8 hrs/month", ffService: "audit",
  },
  {
    id: "uc11", title: "M365 Governance + Cross-Platform Reach", domain: "governance", priority: "Medium", effort: "High", trending: true,
    roles: ["engineering", "operations", "security"], industries: ["technology", "professional", "financial", "healthcare"], stages: ["midmarket", "enterprise"],
    platforms: ["copilot", "claude", "n8n"], surface: "Multi-platform",
    desc: {
      executive: "Microsoft Copilot excels inside M365 but stops at the Microsoft boundary. For cross-system governance, you need a multi-platform strategy: Copilot for M365-native, Claude for reasoning, n8n for orchestration.",
      technical: "Deploy Copilot for Teams/Word/Excel workflows. Use Claude for complex analysis, code review, and multi-document reasoning. Use n8n to bridge systems Microsoft doesn't reach (Slack, Notion, Linear, custom APIs).",
      operational: "Not every task belongs in the same tool. Email and docs → Copilot. Deep analysis → Claude. Connecting everything → automation. The right tool for the right job.",
    },
    quickStart: "Audit your top 10 workflows. For each, ask: is this M365-native (→ Copilot), complex reasoning (→ Claude), cross-system (→ n8n), or research (→ Perplexity)?",
    timeSaved: "Depends on workflow mix", ffService: "vcaio",
  },
  {
    id: "uc12", title: "Document Intelligence + Source Grounding", domain: "implementation", priority: "Medium", effort: "Low", trending: true,
    roles: ["executive", "data", "operations"], industries: ["professional", "financial", "government"], stages: ["smb", "midmarket", "enterprise"],
    platforms: ["notebooklm", "claude"], surface: "NotebookLM or Claude Projects",
    desc: {
      executive: "Turn large document sets (contracts, reports, policies) into searchable, queryable knowledge bases with source-grounded answers — no hallucination.",
      technical: "NotebookLM for audio overviews and source-pinned Q&A. Claude Projects for persistent multi-document analysis with citations. Both ground responses in uploaded sources.",
      operational: "Upload your documents. Ask questions. Get answers with exact page/section citations. No more reading 200-page reports to find the one paragraph you need.",
    },
    quickStart: "Upload 3–5 key documents to NotebookLM or a Claude Project. Ask: 'Summarize the key obligations in these contracts' or 'What are the top risks across these reports?'",
    timeSaved: "5–10 hrs/week for document-heavy roles", ffService: "audit",
  },
];

const HIDDEN_GEMS = [
  { name: "Claude Projects", desc: "Persistent workspaces with pre-loaded docs — like giving Claude a permanent desk with your files on it", roles: ["executive", "security", "engineering", "sales", "marketing"], rarity: "Common but underused" },
  { name: "Memory", desc: "Claude remembers preferences, projects, and context across conversations — stops you from repeating yourself", roles: ["executive", "client-success", "operations"], rarity: "Widely available, rarely configured" },
  { name: "MCP Servers", desc: "Direct connections to Notion, Slack, GitHub, HubSpot, etc. — Claude reads and writes to your actual tools", roles: ["engineering", "operations", "security"], rarity: "Power feature" },
  { name: "Deep Research", desc: "Multi-step research with 50+ sources, citations, and synthesis — replaces 4-hour research sprints", roles: ["executive", "sales", "marketing", "data"], rarity: "Underused" },
  { name: "Code Execution", desc: "Claude runs Python, analyzes data, creates charts — not just writes code but executes it", roles: ["engineering", "data", "security"], rarity: "Common" },
  { name: "Artifacts", desc: "Interactive outputs (dashboards, calculators, components) that render live in the conversation", roles: ["engineering", "marketing", "data"], rarity: "Common" },
  { name: "Claude Code (Terminal)", desc: "Full agentic coding from the command line — reads repos, writes files, runs tests, creates PRs", roles: ["engineering"], rarity: "Power feature" },
  { name: "Batch API", desc: "Process thousands of inputs at 50% cost — classification, extraction, analysis at scale", roles: ["data", "operations", "engineering"], rarity: "Rare" },
  { name: "Custom System Prompts", desc: "Pre-configure Claude's behavior per team — enforce brand voice, restrict topics, set output formats", roles: ["executive", "marketing", "security"], rarity: "Power feature" },
  { name: "Tool Use / Function Calling", desc: "Claude calls external APIs mid-conversation — check inventory, pull CRM data, trigger workflows", roles: ["engineering", "operations"], rarity: "Advanced" },
  { name: "Prompt Caching", desc: "Cache large documents or system prompts — 90% cost reduction on repeated context", roles: ["engineering", "data"], rarity: "Advanced" },
  { name: "Extended Thinking", desc: "Claude reasons step-by-step before answering — dramatically better for math, logic, and complex analysis", roles: ["engineering", "data", "security", "operations"], rarity: "Underused" },
];

const ROI_STATS = [
  { stat: "$3.70 return per $1 invested in AI training", src: "DataCamp AI ROI Report 2026", tag: "training" },
  { stat: "6.4 hours/week recovered per trained knowledge worker", src: "IDC / Microsoft Work Trend Index 2025", tag: "productivity" },
  { stat: "67% success rate for vendor-assisted implementations vs 33% DIY", src: "MIT GenAI Divide 2025", tag: "implementation" },
  { stat: "73% of organizations cite data privacy as #1 AI risk", src: "Deloitte State of Generative AI 2026", tag: "governance" },
  { stat: "40% of agentic AI projects will be cancelled by 2027", src: "Gartner 2026", tag: "governance" },
  { stat: "77% offer AI training, only 21% see significant ROI", src: "DataCamp / IDC 2025", tag: "training" },
  { stat: "$8,700 annual efficiency tax per untrained employee", src: "DataCamp AI ROI Report 2026", tag: "training" },
  { stat: "Top performers see $10.30 return per $1 in AI training", src: "DataCamp AI ROI Report 2026", tag: "training" },
];

function Badge({ text, bg, color }) {
  return <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: bg, color, fontWeight: 600, whiteSpace: "nowrap" }}>{text}</span>;
}

export default function UseCaseDiscovery() {
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [stage, setStage] = useState("");
  const [domain, setDomain] = useState("all");
  const [view, setView] = useState("cards");
  const [expanded, setExpanded] = useState(null);
  const [audience, setAudience] = useState("operational");
  const [showGems, setShowGems] = useState(false);
  const [showROI, setShowROI] = useState(false);

  const results = useMemo(() => {
    if (!role || !industry || !stage) return null;
    return USE_CASES.filter(uc =>
      uc.roles.includes(role) &&
      uc.industries.includes(industry) &&
      uc.stages.includes(stage) &&
      (domain === "all" || uc.domain === domain)
    ).sort((a, b) => (a.priority === "High" ? -1 : 1) - (b.priority === "High" ? -1 : 1));
  }, [role, industry, stage, domain]);

  const gems = useMemo(() => {
    if (!role) return [];
    return HIDDEN_GEMS.filter(g => g.roles.includes(role));
  }, [role]);

  const selectStyle = { padding: "8px 10px", borderRadius: 6, border: "1px solid #27272a", background: "#0a0a0f", color: "#fafafa", fontSize: 12, width: "100%", fontFamily: "inherit" };
  const domainColors = { implementation: "#7c3aed", prompts: "#2563eb", governance: "#dc2626", training: "#16a34a" };

  return (
    <div style={{ fontFamily: "'Geist', system-ui, sans-serif", background: "#09090f", color: "#fafafa", minHeight: "100vh", padding: "20px 16px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>FlashFusion</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Use Case Discovery Engine</h1>
          <p style={{ fontSize: 11, color: "#71717a", margin: "4px 0 0" }}>Role × Industry × Stage → prioritized AI use cases with multi-platform routing and ROI data</p>
        </div>

        {/* Config */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          <div><label style={{ fontSize: 10, color: "#71717a", fontWeight: 600 }}>Role *</label><select style={selectStyle} value={role} onChange={e => setRole(e.target.value)}><option value="">Select...</option>{ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}</select></div>
          <div><label style={{ fontSize: 10, color: "#71717a", fontWeight: 600 }}>Industry *</label><select style={selectStyle} value={industry} onChange={e => setIndustry(e.target.value)}><option value="">Select...</option>{INDUSTRIES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}</select></div>
          <div><label style={{ fontSize: 10, color: "#71717a", fontWeight: 600 }}>Company Stage *</label><select style={selectStyle} value={stage} onChange={e => setStage(e.target.value)}><option value="">Select...</option>{STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
        </div>

        {/* Controls row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {DOMAINS.map(d => <button key={d.value} onClick={() => setDomain(d.value)} style={{ padding: "4px 10px", borderRadius: 4, fontSize: 10, fontWeight: 600, cursor: "pointer", border: domain === d.value ? `1px solid ${domainColors[d.value] || "#7c3aed"}` : "1px solid #27272a", background: domain === d.value ? `${domainColors[d.value] || "#7c3aed"}20` : "transparent", color: domain === d.value ? (domainColors[d.value] || "#a78bfa") : "#71717a" }}>{d.label}</button>)}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <select value={audience} onChange={e => setAudience(e.target.value)} style={{ ...selectStyle, width: "auto", padding: "4px 8px", fontSize: 10 }}>
              <option value="executive">Executive framing</option>
              <option value="technical">Technical framing</option>
              <option value="operational">Operational framing</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {!results && <div style={{ textAlign: "center", padding: 40, color: "#3f3f46", fontSize: 13 }}>Select Role, Industry, and Company Stage to discover use cases</div>}

        {results && results.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#3f3f46", fontSize: 13 }}>No matching use cases for this combination. Try a different domain filter.</div>}

        {results && results.length > 0 && (
          <div style={{ display: "grid", gap: 10 }}>
            {results.map(uc => {
              const isExpanded = expanded === uc.id;
              return (
                <div key={uc.id} style={{ background: "#111116", border: "1px solid #27272a", borderRadius: 8, overflow: "hidden" }}>
                  <div onClick={() => setExpanded(isExpanded ? null : uc.id)} style={{ padding: "14px 16px", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                        {uc.trending && <Badge text="↑ Trending" bg="#7c3aed20" color="#a78bfa" />}
                        <Badge text={uc.domain} bg={`${domainColors[uc.domain]}20`} color={domainColors[uc.domain]} />
                        <Badge text={`${uc.effort} effort`} bg={uc.effort === "Low" ? "#05291a" : uc.effort === "Medium" ? "#1a1500" : "#290505"} color={uc.effort === "Low" ? "#22c55e" : uc.effort === "Medium" ? "#eab308" : "#ef4444"} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: uc.priority === "High" ? "#22c55e" : "#eab308" }} />
                        <span style={{ fontSize: 10, color: "#71717a" }}>{uc.priority}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fafafa", marginBottom: 4 }}>{uc.title}</div>
                    <div style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.5 }}>{uc.desc[audience]}</div>
                  </div>

                  {isExpanded && (
                    <div style={{ borderTop: "1px solid #1a1a1f", padding: "14px 16px" }}>
                      {/* Platform routing */}
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#71717a", textTransform: "uppercase", marginBottom: 6 }}>Recommended Platforms</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {uc.platforms.map(p => <span key={p} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, background: `${PLATFORMS[p].color}15`, color: PLATFORMS[p].color, border: `1px solid ${PLATFORMS[p].color}30` }}>{PLATFORMS[p].label}</span>)}
                          <span style={{ fontSize: 10, color: "#52525b", alignSelf: "center" }}>→ {uc.surface}</span>
                        </div>
                      </div>

                      {/* Quick start */}
                      <div style={{ background: "#052e16", border: "1px solid #14532d", borderRadius: 6, padding: 10, marginBottom: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", marginBottom: 4 }}>⚡ Quick Start Prompt</div>
                        <div style={{ fontSize: 11, color: "#86efac", lineHeight: 1.5 }}>{uc.quickStart}</div>
                      </div>

                      {/* Footer */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "#71717a" }}>Est. savings: <strong style={{ color: "#22c55e" }}>{uc.timeSaved}</strong></span>
                        <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: "#7c3aed15", color: "#a78bfa", border: "1px solid #7c3aed30" }}>FF: {FF_SERVICES[uc.ffService].label}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Hidden Gems */}
        {role && (
          <div style={{ marginTop: 20 }}>
            <button onClick={() => setShowGems(!showGems)} style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid #27272a", background: "#111116", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>💎</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fafafa" }}>Hidden Gems</span>
                <span style={{ fontSize: 10, color: "#71717a" }}>{gems.length} capabilities for your role</span>
              </div>
              <span style={{ color: "#71717a", fontSize: 12 }}>{showGems ? "▲" : "▼"}</span>
            </button>
            {showGems && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8 }}>
                {gems.map(g => (
                  <div key={g.name} style={{ background: "#111116", border: "1px solid #27272a", borderRadius: 6, padding: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#fafafa" }}>{g.name}</span>
                      <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: "#1e1b4b", color: "#a78bfa" }}>{g.rarity}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#a1a1aa", lineHeight: 1.5 }}>{g.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ROI Stats */}
        <div style={{ marginTop: 12 }}>
          <button onClick={() => setShowROI(!showROI)} style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid #27272a", background: "#111116", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>📊</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fafafa" }}>ROI Evidence Library</span>
              <span style={{ fontSize: 10, color: "#71717a" }}>{ROI_STATS.length} sourced data points</span>
            </div>
            <span style={{ color: "#71717a", fontSize: 12 }}>{showROI ? "▲" : "▼"}</span>
          </button>
          {showROI && (
            <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
              {ROI_STATS.map((s, i) => (
                <div key={i} style={{ background: "#111116", border: "1px solid #27272a", borderRadius: 6, padding: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#fafafa", fontWeight: 600, marginBottom: 2 }}>{s.stat}</div>
                    <div style={{ fontSize: 10, color: "#71717a" }}>Source: {s.src}</div>
                  </div>
                  <Badge text={s.tag} bg="#1e1b4b" color="#a78bfa" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 24, padding: "12px 0", borderTop: "1px solid #1a1a1f", fontSize: 10, color: "#3f3f46", display: "flex", justifyContent: "space-between" }}>
          <span>FlashFusion Use Case Discovery v1.0</span>
          <span>{results ? `${results.length} use cases matched` : "Configure to discover"}</span>
        </div>
      </div>
    </div>
  );
}
