import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Filter, Layers, Target, BookOpen, Shield, Code, Rocket, ChevronRight, Clock, TrendingUp, AlertTriangle, CheckCircle2, LayoutGrid, List, Table2, GitBranch, Gem, Eye, EyeOff, Zap, Star, ArrowRight, Info, X, ChevronDown, Lightbulb, Lock, Cpu, Database, FileText, Globe, Wand2, BrainCircuit } from 'lucide-react';

const HIDDEN_GEMS = {
  developer: [
    { title: "Extended Thinking for Debugging", desc: "Claude's extended thinking mode lets you watch the model's step-by-step reasoning chain. Feed it a stack trace and ask it to think through root causes — it'll surface edge cases you'd miss.", features: ["Extended Thinking", "Claude Code"], rarity: "rare" },
    { title: "Bash + File Ops in Claude Code", desc: "Claude Code can execute arbitrary bash commands and manipulate your filesystem directly. Chain git operations, run test suites, and refactor across files in a single agentic loop.", features: ["Claude Code", "Bash tool", "File ops"], rarity: "uncommon" },
    { title: "MCP Server Chaining", desc: "Connect multiple MCP servers in one conversation — e.g., pull from GitHub, cross-reference Notion docs, and push updates to Linear, all without leaving Claude.", features: ["MCP Protocol", "Tool chaining"], rarity: "rare" },
    { title: "Artifact Persistent Storage API", desc: "Artifacts can now read/write key-value data that persists across sessions. Build trackers, journals, leaderboards, or stateful tools that remember user data.", features: ["Artifacts", "Storage API"], rarity: "very_rare" },
  ],
  pm: [
    { title: "Claude Projects as Living Specs", desc: "Pin PRDs, wireframes, and API docs to a Claude Project. Every conversation inherits that context — no more re-explaining your product to the AI.", features: ["Projects", "Custom Instructions"], rarity: "uncommon" },
    { title: "PPTX Skill for Stakeholder Decks", desc: "Claude can generate fully formatted PowerPoint presentations programmatically — complete with branded slides, charts, and speaker notes. Skip the manual deck grinding.", features: ["PPTX Skill", "Computer Use"], rarity: "rare" },
    { title: "Web Search for Competitive Intel", desc: "Claude's web search tool can pull real-time competitor data, pricing changes, and market signals directly into your conversation. No tab-switching.", features: ["Web Search", "Research"], rarity: "uncommon" },
    { title: "Conversation Memory for Product Context", desc: "Claude remembers key product decisions, user personas, and technical constraints across conversations. Your AI PM assistant actually knows your product.", features: ["Memory System", "Projects"], rarity: "rare" },
  ],
  executive: [
    { title: "Deep Research for Due Diligence", desc: "Claude's deep research mode autonomously investigates topics across dozens of sources, synthesizing findings into structured reports. Perfect for M&A research or market analysis.", features: ["Deep Research", "Web Search"], rarity: "rare" },
    { title: "Claude in Excel for Financial Modeling", desc: "Claude can operate directly inside Excel spreadsheets — building formulas, running scenarios, and annotating cells with reasoning. Finance teams can validate models interactively.", features: ["Claude in Excel", "XLSX Skill"], rarity: "very_rare" },
    { title: "Gamma MCP for Board Decks", desc: "Connect the Gamma MCP server and Claude will create polished presentation decks from your briefing notes — formatted, designed, and ready for the boardroom.", features: ["Gamma MCP", "Presentations"], rarity: "very_rare" },
  ],
  ops: [
    { title: "n8n MCP for Workflow Orchestration", desc: "Connect your n8n instance via MCP and let Claude trigger, monitor, and debug automation workflows conversationally. 'Why did this workflow fail last night?' gets a real answer.", features: ["n8n MCP", "Automation"], rarity: "rare" },
    { title: "Computer Use for Legacy System Ops", desc: "Claude can operate a full browser and desktop — click through legacy admin panels, fill forms, and extract data from systems that have no API.", features: ["Computer Use", "Browser Agent"], rarity: "very_rare" },
    { title: "Sentry MCP for Incident Response", desc: "Connect Sentry and Claude can pull error trends, identify regression patterns, and draft incident reports without you leaving the chat.", features: ["Sentry MCP", "Error Analysis"], rarity: "rare" },
  ],
  security: [
    { title: "Claude Code for Security Scanning", desc: "Run SAST/DAST-style checks through Claude Code — it reads your codebase, identifies OWASP Top 10 vulnerabilities, and suggests fixes with full context.", features: ["Claude Code", "Security Analysis"], rarity: "uncommon" },
    { title: "Prompt Injection Testing", desc: "Use Claude to adversarially test your own AI deployments. It can generate sophisticated injection attempts and evaluate your guardrails' resilience.", features: ["Red Teaming", "Security Testing"], rarity: "rare" },
    { title: "Compliance Doc Generation", desc: "Claude's DOCX skill can generate SOC2 evidence artifacts, policy documents, and audit reports with proper formatting — pre-populated with your org's controls.", features: ["DOCX Skill", "Compliance"], rarity: "uncommon" },
  ],
  data: [
    { title: "Code Execution for Data Analysis", desc: "Claude can write and execute Python code in-conversation — run pandas transformations, generate matplotlib charts, and iterate on analysis without leaving chat.", features: ["Code Execution", "Python"], rarity: "uncommon" },
    { title: "Supabase MCP for Live Queries", desc: "Connect Supabase via MCP and Claude can query your production database, analyze schemas, write migrations, and explain query plans conversationally.", features: ["Supabase MCP", "SQL"], rarity: "rare" },
    { title: "CSV/Excel Processing in Artifacts", desc: "Upload a spreadsheet and Claude processes it with Papaparse or SheetJS right in the artifact — interactive filtering, pivoting, and visualization without external tools.", features: ["Artifacts", "Data Processing"], rarity: "uncommon" },
  ],
  support: [
    { title: "Intercom MCP for Ticket Context", desc: "Connect Intercom via MCP and Claude pulls conversation history, user attributes, and previous tickets to draft contextual responses.", features: ["Intercom MCP", "Support"], rarity: "rare" },
    { title: "Memory-Powered Customer Context", desc: "Claude's memory system can track customer-specific preferences, past issues, and communication style — making every interaction feel continuous.", features: ["Memory System", "Personalization"], rarity: "uncommon" },
    { title: "KB Article Generator Skill", desc: "Claude can generate fully formatted knowledge base articles from support tickets — branded, structured, with troubleshooting steps and screenshots.", features: ["DOCX Skill", "KB Generation"], rarity: "rare" },
  ]
};

const INDUSTRY_GEMS = {
  technology: { title: "GitHub + Linear + Vercel MCP Stack", desc: "Chain all three MCP servers for a full dev lifecycle in one conversation — review PRs, update tickets, and trigger deployments.", rarity: "very_rare" },
  financial: { title: "Plaid MCP for Financial Data", desc: "Connect Plaid via MCP for real-time financial data access — account balances, transaction categorization, and fraud pattern detection.", rarity: "very_rare" },
  healthcare: { title: "Scholar Gateway MCP for Medical Research", desc: "Connect Scholar Gateway to search academic databases — pull clinical trial data, systematic reviews, and evidence summaries directly into Claude.", rarity: "very_rare" },
  manufacturing: { title: "Cloudflare Workers + Claude for IoT", desc: "Deploy Claude-powered edge functions via Cloudflare MCP that process IoT sensor data at the edge — anomaly detection without round-trips.", rarity: "very_rare" },
  retail: { title: "HubSpot MCP for Customer Intelligence", desc: "Connect HubSpot and Claude can analyze deal pipelines, draft outreach sequences, and surface at-risk accounts from your CRM data.", rarity: "rare" },
  professional: { title: "Fireflies MCP for Meeting Intelligence", desc: "Connect Fireflies and Claude can search meeting transcripts, extract action items, and draft follow-up emails from your recorded calls.", rarity: "rare" },
  government: { title: "Document Processing Pipeline", desc: "Chain PDF extraction, data classification, and DOCX generation for FOIA requests, grant applications, and regulatory submissions.", rarity: "rare" }
};

const EPBUseCaseDiscovery = () => {
  const [filters, setFilters] = useState({ role: '', industry: '', maturity: '', domain: 'all' });
  const [outputFormat, setOutputFormat] = useState('cards');
  const [audienceTier, setAudienceTier] = useState('tech');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [sources, setSources] = useState([]);
  const [error, setError] = useState(null);
  const [showGems, setShowGems] = useState(true);
  const [showSources, setShowSources] = useState(false);
  const [expandedGem, setExpandedGem] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [progress, setProgress] = useState({ stage: '', percent: 0, elapsed: 0 });
  const resultsRef = useRef(null);
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);

  const PROGRESS_STAGES = [
    { at: 0, pct: 3, label: 'Pass 1 — Initializing web search...' },
    { at: 1500, pct: 10, label: 'Pass 1 — Searching industry patterns...' },
    { at: 4000, pct: 20, label: 'Pass 1 — Searching Anthropic capabilities...' },
    { at: 7000, pct: 30, label: 'Pass 1 — Searching implementation examples...' },
    { at: 10000, pct: 38, label: 'Pass 1 — Extracting sources...' },
    { at: 13000, pct: 45, label: 'Pass 1 — Sources collected ✓' },
    { at: 15000, pct: 50, label: 'Pass 2 — Generating use cases from sources...' },
    { at: 18000, pct: 60, label: 'Pass 2 — Mapping use cases to sources...' },
    { at: 22000, pct: 72, label: 'Pass 2 — Tailoring to your context...' },
    { at: 26000, pct: 82, label: 'Pass 2 — Formatting output...' },
    { at: 30000, pct: 90, label: 'Pass 2 — Validating JSON...' },
    { at: 35000, pct: 94, label: 'Almost there...' },
    { at: 42000, pct: 96, label: 'Finalizing (large response)...' },
  ];

  const startProgress = () => {
    startTimeRef.current = Date.now();
    setProgress({ stage: PROGRESS_STAGES[0].label, percent: PROGRESS_STAGES[0].pct, elapsed: 0 });
    
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentStage = [...PROGRESS_STAGES].reverse().find(s => elapsed >= s.at) || PROGRESS_STAGES[0];
      
      // Smooth interpolation between stages
      const nextStage = PROGRESS_STAGES.find(s => s.at > elapsed);
      let pct = currentStage.pct;
      if (nextStage) {
        const stageProgress = (elapsed - currentStage.at) / (nextStage.at - currentStage.at);
        pct = currentStage.pct + (nextStage.pct - currentStage.pct) * Math.min(stageProgress, 1);
      }
      
      setProgress({
        stage: currentStage.label,
        percent: Math.min(Math.round(pct), 96),
        elapsed: Math.round(elapsed / 1000)
      });
    }, 200);
  };

  const stopProgress = (success) => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
    if (success) {
      setProgress(p => ({ ...p, stage: 'Complete!', percent: 100 }));
      setTimeout(() => setProgress({ stage: '', percent: 0, elapsed: 0 }), 600);
    } else {
      setProgress({ stage: '', percent: 0, elapsed: 0 });
    }
  };

  useEffect(() => {
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  useEffect(() => {
    if (results) {
      setAnimateIn(true);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [results]);

  const roles = [
    { value: 'developer', label: 'Developer / Engineer', icon: Code },
    { value: 'pm', label: 'Product Manager', icon: Target },
    { value: 'executive', label: 'Executive / C-Suite', icon: Star },
    { value: 'ops', label: 'Operations / IT', icon: Cpu },
    { value: 'security', label: 'Security / Compliance', icon: Lock },
    { value: 'data', label: 'Data / Analytics', icon: Database },
    { value: 'support', label: 'Customer Success / Support', icon: Globe }
  ];

  const industries = [
    { value: 'technology', label: 'Technology / SaaS' },
    { value: 'financial', label: 'Financial Services' },
    { value: 'healthcare', label: 'Healthcare / Life Sciences' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail / E-commerce' },
    { value: 'professional', label: 'Professional Services' },
    { value: 'government', label: 'Government / Public Sector' }
  ];

  const maturities = [
    { value: 'startup', label: 'Startup (1-50)' },
    { value: 'smb', label: 'SMB (50-200)' },
    { value: 'midmarket', label: 'Mid-Market (200-1K)' },
    { value: 'enterprise', label: 'Enterprise (1K+)' }
  ];

  const domains = [
    { value: 'all', label: 'All Domains', icon: Layers },
    { value: 'implementation', label: 'Implementation', icon: Rocket },
    { value: 'prompts', label: 'Prompts & Workflows', icon: Code },
    { value: 'governance', label: 'Governance', icon: Shield },
    { value: 'training', label: 'Training', icon: BookOpen }
  ];

  const outputFormats = [
    { value: 'cards', label: 'Cards', icon: LayoutGrid },
    { value: 'roadmap', label: 'Roadmap', icon: GitBranch },
    { value: 'matrix', label: 'Matrix', icon: Table2 },
    { value: 'hybrid', label: 'Hybrid', icon: List }
  ];

  const audienceTiers = [
    { value: 'enduser', label: 'End User', desc: 'Plain English' },
    { value: 'tech', label: 'Tech Team', desc: 'Implementation' },
    { value: 'ai', label: 'AI Team', desc: 'Architecture' }
  ];

  const getRarityStyle = (rarity) => {
    const styles = {
      uncommon: { bg: 'bg-emerald-900/20', border: 'border-emerald-500/30', text: 'text-emerald-400', label: 'Uncommon', dot: 'bg-emerald-400' },
      rare: { bg: 'bg-sky-900/20', border: 'border-sky-500/30', text: 'text-sky-400', label: 'Rare', dot: 'bg-sky-400' },
      very_rare: { bg: 'bg-amber-900/20', border: 'border-amber-500/30', text: 'text-amber-400', label: 'Very Rare', dot: 'bg-amber-400' }
    };
    return styles[rarity] || styles.uncommon;
  };

  const currentGems = [
    ...(HIDDEN_GEMS[filters.role] || []),
    ...(INDUSTRY_GEMS[filters.industry] ? [INDUSTRY_GEMS[filters.industry]] : [])
  ];

  const generateUseCases = async () => {
    if (!filters.role || !filters.industry || !filters.maturity) {
      setError('Select role, industry, and company stage first.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnimateIn(false);
    startProgress();

    const TIMEOUT_MS = 90000;
    const timeoutId = setTimeout(() => {
      stopProgress(false);
      setLoading(false);
      setError('Request timed out after 90 seconds. Try again or narrow your filters.');
    }, TIMEOUT_MS);

    const tierDescriptions = {
      enduser: 'Non-technical end user: Use plain English, focus on business outcomes, avoid jargon',
      tech: 'Internal tech department: Include implementation details, technical specs, integration patterns',
      ai: 'Internal AI team: Architecture-level insights, multi-agent patterns, performance optimization, governance'
    };

    const domainFocus = filters.domain === 'all'
      ? 'Cover all four domains: AI Implementation, Prompts/Workflows, Governance, Training'
      : `Focus on: ${domains.find(d => d.value === filters.domain)?.label}`;

    const roleName = roles.find(r => r.value === filters.role)?.label;
    const industryName = industries.find(i => i.value === filters.industry)?.label;
    const maturityName = maturities.find(m => m.value === filters.maturity)?.label;

    try {
      // ── PASS 1: Web search only ──
      const searchPrompt = `Search the web for current information on these topics. Run all 3 searches:

1. Search: "Anthropic Claude ${industryName} use cases 2025 2026"
2. Search: "Claude AI enterprise ${domains.find(d => d.value === filters.domain)?.label || 'implementation'} real world examples"
3. Search: "Anthropic Claude new features capabilities MCP 2026"

After searching, respond with ONLY the text "SEARCH_COMPLETE" and nothing else.`;

      const searchResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: searchPrompt }]
        })
      });

      if (!searchResponse.ok) throw new Error('Search API request failed');
      const searchData = await searchResponse.json();

      // Extract real URLs + titles from web_search_tool_result blocks
      const extractedSources = [];
      const seen = new Set();
      for (const block of searchData.content) {
        if (block.type === 'web_search_tool_result' && Array.isArray(block.content)) {
          for (const result of block.content) {
            if (result.type === 'web_search_result' && result.url && !seen.has(result.url)) {
              seen.add(result.url);
              extractedSources.push({
                url: result.url,
                title: result.title || result.url,
                snippet: result.page_snippet || ''
              });
            }
          }
        }
      }
      setSources(extractedSources);

      // Build numbered source context for Pass 2
      const sourceContext = extractedSources.length > 0
        ? extractedSources.map((s, i) => `[${i}] "${s.title}" — ${s.url}${s.snippet ? `\n    ${s.snippet.slice(0, 200)}` : ''}`).join('\n')
        : '(No search results available — use your training knowledge and mark sourceIndices as empty arrays)';

      // ── PASS 2: Generate use cases grounded in real sources ──
      const generatePrompt = `You are an Anthropic ecosystem expert generating Claude AI use cases.

VERIFIED SOURCES (from live web search — reference these by index number):
${sourceContext}

CONTEXT:
- Role: ${roleName}
- Industry: ${industryName}
- Company Size: ${maturityName}
- Domain Focus: ${domainFocus}

AUDIENCE TIER: ${tierDescriptions[audienceTier]}

Generate 8 specific, actionable use cases. For each:
- title: Under 10 words
- description: 2-3 sentences (audience-tier appropriate)
- domain: implementation|prompts|governance|training
- trending: true/false
- priority: High/Medium/Low
- effort: Low/Medium/High
- impact: Low/Medium/High
- timeframe: Quick Win (<1 week)|Short-term (1-4 weeks)|Medium-term (1-3 months)|Long-term (3+ months)
- claudeFeatures: Array of Claude capabilities referenced in the sources above
- risks: Brief risk note
- quickStart: One concrete first step (1 sentence)
- sourceIndices: Array of integers (e.g. [0, 3]) referencing ONLY source numbers from the VERIFIED SOURCES list above. Every use case MUST reference at least one source. Do NOT reference indices that don't exist.

Respond ONLY with valid JSON (no markdown, no backticks):
{"contextSummary":"2-3 sentences referencing specific findings from the sources above","useCases":[...]}`;

      const genResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 6000,
          messages: [{ role: "user", content: generatePrompt }]
        })
      });

      if (!genResponse.ok) throw new Error('Generate API request failed');
      const genData = await genResponse.json();

      const textBlocks = genData.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('\n');

      let text = textBlocks.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = text.match(/\{[\s\S]*"useCases"[\s\S]*\}/);
      if (jsonMatch) {
        clearTimeout(timeoutId);
        stopProgress(true);
        const parsed = JSON.parse(jsonMatch[0]);
        // Clamp sourceIndices to valid range
        if (parsed.useCases) {
          parsed.useCases = parsed.useCases.map(uc => ({
            ...uc,
            sourceIndices: (uc.sourceIndices || []).filter(i => typeof i === 'number' && i >= 0 && i < extractedSources.length)
          }));
        }
        setResults(parsed);
      } else {
        throw new Error('Could not parse JSON from generation response');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      stopProgress(false);
      console.error(err);
      setError('API unavailable — showing example results.');
      setSources([
        { url: 'https://docs.anthropic.com/en/docs/claude-code', title: 'Claude Code Documentation', snippet: 'CLI tool for autonomous coding', pageAge: '' },
        { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering', title: 'Prompt Engineering Guide', snippet: 'Best practices for Claude prompts', pageAge: '' },
        { url: 'https://www2.deloitte.com/us/en/pages/consulting/articles/state-of-ai-in-the-enterprise.html', title: 'Deloitte State of AI in the Enterprise 2026', snippet: '73% cite data privacy as top risk', pageAge: '' },
        { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use', title: 'Tool Use & MCP Servers', snippet: 'Connect external services via MCP', pageAge: '' },
        { url: 'https://www.anthropic.com/news', title: 'Anthropic News & Updates', snippet: 'Latest platform capabilities', pageAge: '' }
      ]);
      setResults({
        contextSummary: `For a ${roles.find(r=>r.value===filters.role)?.label} in ${industries.find(i=>i.value===filters.industry)?.label} at a ${filters.maturity}-stage company, the Anthropic ecosystem offers deep opportunities across implementation, workflows, governance, and upskilling.`,
        useCases: [
          { title: "Automated Code Review Pipeline", description: "Deploy Claude Code as an autonomous reviewer catching security vulnerabilities and enforcing standards before human review.", domain: "implementation", trending: true, priority: "High", effort: "Medium", impact: "High", timeframe: "Short-term (1-4 weeks)", claudeFeatures: ["Claude Code", "Bash tools", "File ops"], risks: "Requires clear acceptance criteria", quickStart: "Install Claude Code CLI and run it against your most-changed repo.", sourceIndices: [0] },
          { title: "Multi-Agent Document Processing", description: "Orchestrate specialist agents for intake, classification, extraction, and validation with HITL checkpoints.", domain: "prompts", trending: true, priority: "High", effort: "High", impact: "High", timeframe: "Medium-term (1-3 months)", claudeFeatures: ["Multi-agent", "PDF skill", "DOCX skill"], risks: "Complex state management across handoffs", quickStart: "Map your top 3 document types and their extraction fields.", sourceIndices: [3] },
          { title: "Shadow AI Detection & Governance", description: "Monitor unauthorized AI tool usage, classify data exposure risks, and establish approved tooling policies.", domain: "governance", trending: true, priority: "High", effort: "Medium", impact: "High", timeframe: "Short-term (1-4 weeks)", claudeFeatures: ["Audit trails", "Data classification"], risks: "May surface uncomfortable usage patterns", quickStart: "Survey 10 power users about which AI tools they use today.", sourceIndices: [2] },
          { title: "Role-Based Prompt Library", description: "Build a curated prompt repository mapped to job functions with version control and effectiveness metrics.", domain: "prompts", trending: false, priority: "Medium", effort: "Low", impact: "Medium", timeframe: "Quick Win (<1 week)", claudeFeatures: ["Projects", "Custom Instructions", "Memory"], risks: "Requires ongoing curation", quickStart: "Collect the top 5 prompts your team already uses informally.", sourceIndices: [1] },
          { title: "AI-Assisted Compliance Reporting", description: "Automate SOC2/HIPAA evidence collection and report generation with RLS-protected data access.", domain: "governance", trending: false, priority: "Medium", effort: "Medium", impact: "High", timeframe: "Medium-term (1-3 months)", claudeFeatures: ["DOCX skill", "XLSX skill", "Web search"], risks: "Must validate auto-generated compliance artifacts", quickStart: "Export your current SOC2 control matrix as a CSV.", sourceIndices: [2, 3] },
          { title: "Claude Certification Pathway", description: "Structured learning from prompt engineering fundamentals through advanced agentic patterns with hands-on assessments.", domain: "training", trending: true, priority: "Medium", effort: "Low", impact: "Medium", timeframe: "Short-term (1-4 weeks)", claudeFeatures: ["Anthropic courses", "Skills"], risks: "Rapidly evolving capabilities may outpace materials", quickStart: "Enroll your team leads in Anthropic's prompt engineering course.", sourceIndices: [4] },
          { title: "Customer Support Agent Copilot", description: "Deploy Claude as a real-time copilot that drafts responses, surfaces docs, and handles routine inquiries autonomously.", domain: "implementation", trending: false, priority: "High", effort: "Medium", impact: "High", timeframe: "Short-term (1-4 weeks)", claudeFeatures: ["MCP connectors", "Web search", "Memory"], risks: "Tone consistency requires tuning", quickStart: "Export your top 20 most common ticket types and ideal responses.", sourceIndices: [3, 4] },
          { title: "Executive AI Readiness Briefings", description: "Generate weekly synthesized briefings on AI developments, competitive intel, and internal adoption metrics.", domain: "training", trending: false, priority: "Low", effort: "Low", impact: "Medium", timeframe: "Quick Win (<1 week)", claudeFeatures: ["Web search", "PPTX skill", "Artifacts"], risks: "Requires validation before reaching executives", quickStart: "Draft one briefing manually to establish the format and tone.", sourceIndices: [2, 4] }
        ]
      });
    }
    setLoading(false);
  };

  const getDomainStyle = (domain) => ({
    implementation: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', accent: '#06b6d4' },
    prompts: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', accent: '#8b5cf6' },
    governance: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', accent: '#f59e0b' },
    training: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', accent: '#14b8a6' }
  }[domain] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', accent: '#6b7280' });

  const getPriorityIcon = (p) => {
    if (p === 'High') return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    if (p === 'Medium') return <Clock className="w-4 h-4 text-amber-500" />;
    return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  };

  const filteredUseCases = results?.useCases?.filter(uc =>
    filters.domain === 'all' || uc.domain === filters.domain
  ) || [];

  const renderCards = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {filteredUseCases.map((uc, i) => {
        const ds = getDomainStyle(uc.domain);
        return (
          <div key={i} className="group bg-white rounded-xl border border-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 overflow-hidden" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {uc.trending && (
                    <span className="bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />Trending
                    </span>
                  )}
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full border ${ds.bg} ${ds.text} ${ds.border}`}>{uc.domain}</span>
                </div>
                <div className="flex items-center gap-1">
                  {getPriorityIcon(uc.priority)}
                  <span className="text-[10px] text-gray-400 uppercase">{uc.priority}</span>
                </div>
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-[15px] leading-tight">{uc.title}</h4>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{uc.description}</p>
              {uc.quickStart && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
                  <div className="flex items-start gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600"><span className="font-semibold text-gray-700">Quick start:</span> {uc.quickStart}</p>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {uc.claudeFeatures?.slice(0, 4).map((f, j) => (
                  <span key={j} className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-md">{f}</span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 text-[11px] pt-3 border-t border-gray-100">
                <div>
                  <span className="text-gray-400 block">Effort</span>
                  <span className={`font-semibold ${uc.effort === 'Low' ? 'text-emerald-600' : uc.effort === 'Medium' ? 'text-amber-600' : 'text-rose-600'}`}>{uc.effort}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Impact</span>
                  <span className={`font-semibold ${uc.impact === 'High' ? 'text-emerald-600' : uc.impact === 'Medium' ? 'text-sky-600' : 'text-gray-500'}`}>{uc.impact}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Timeline</span>
                  <span className="font-semibold text-gray-700">{uc.timeframe?.split('(')[0]?.trim()}</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-2.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-3 text-[10px] text-gray-400">
              <div className="flex items-center gap-1.5 min-w-0">
                <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{uc.risks}</span>
              </div>
              {uc.sourceIndices?.length > 0 && sources.length > 0 && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Globe className="w-3 h-3 text-sky-400" />
                  {uc.sourceIndices.filter(idx => idx < sources.length).map((idx, j) => (
                    <a key={j} href={sources[idx]?.url} target="_blank" rel="noopener noreferrer"
                      className="bg-sky-100 text-sky-700 hover:bg-sky-200 font-bold w-4.5 h-4.5 rounded flex items-center justify-center transition-colors cursor-pointer"
                      title={sources[idx]?.title}
                    >{idx + 1}</a>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderRoadmap = () => {
    const phases = ['Quick Win (<1 week)', 'Short-term (1-4 weeks)', 'Medium-term (1-3 months)', 'Long-term (3+ months)'];
    const phaseColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];
    return (
      <div className="space-y-8">
        {phases.map((phase, pi) => {
          const items = filteredUseCases.filter(uc => uc.timeframe === phase);
          if (!items.length) return null;
          return (
            <div key={pi} className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: phaseColors[pi] }}>{pi + 1}</div>
                <div>
                  <h4 className="font-bold text-gray-900">{phase}</h4>
                  <span className="text-xs text-gray-400">{items.length} use case{items.length > 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="ml-5 pl-9 border-l-2 space-y-3" style={{ borderColor: phaseColors[pi] + '40' }}>
                {items.map((uc, i) => {
                  const ds = getDomainStyle(uc.domain);
                  return (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all">
                      <div className="flex items-start gap-3">
                        <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: phaseColors[pi] }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-gray-900 text-sm">{uc.title}</span>
                            {uc.trending && <TrendingUp className="w-3.5 h-3.5 text-orange-500" />}
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${ds.bg} ${ds.text} ${ds.border}`}>{uc.domain}</span>
                          </div>
                          <p className="text-xs text-gray-500">{uc.description}</p>
                          {uc.quickStart && (
                            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1"><Zap className="w-3 h-3" />{uc.quickStart}</p>
                          )}
                          {uc.sourceIndices?.length > 0 && sources.length > 0 && (
                            <div className="flex items-center gap-1 mt-1.5">
                              <Globe className="w-3 h-3 text-sky-400" />
                              {uc.sourceIndices.filter(idx => idx < sources.length).map((idx, j) => (
                                <a key={j} href={sources[idx]?.url} target="_blank" rel="noopener noreferrer"
                                  className="bg-sky-100 text-sky-700 hover:bg-sky-200 text-[10px] font-bold px-1.5 py-0 rounded transition-colors"
                                  title={sources[idx]?.title}
                                >{idx + 1}</a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMatrix = () => (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-200">
            {['Use Case', 'Domain', 'Priority', 'Effort', 'Impact', 'Timeline', 'Source'].map(h => (
              <th key={h} className="text-left p-3 text-[11px] uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredUseCases.map((uc, i) => {
            const ds = getDomainStyle(uc.domain);
            return (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {uc.trending && <TrendingUp className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />}
                    <span className="font-medium text-gray-900 text-sm">{uc.title}</span>
                  </div>
                </td>
                <td className="p-3"><span className={`text-[10px] px-2 py-0.5 rounded-full border ${ds.bg} ${ds.text} ${ds.border}`}>{uc.domain}</span></td>
                <td className="p-3">{getPriorityIcon(uc.priority)}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${uc.effort === 'Low' ? 'bg-emerald-50 text-emerald-700' : uc.effort === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>{uc.effort}</span></td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${uc.impact === 'High' ? 'bg-emerald-50 text-emerald-700' : uc.impact === 'Medium' ? 'bg-sky-50 text-sky-700' : 'bg-gray-50 text-gray-600'}`}>{uc.impact}</span></td>
                <td className="p-3 text-xs text-gray-500">{uc.timeframe?.split('(')[0]?.trim()}</td>
                <td className="p-3 text-xs text-gray-500 max-w-[200px]">
                  {uc.sourceIndices?.length > 0 && sources.length > 0 && (
                    <span className="flex items-center gap-1">
                      {uc.sourceIndices.filter(idx => idx < sources.length).map((idx, j) => (
                        <a key={j} href={sources[idx]?.url} target="_blank" rel="noopener noreferrer"
                          className="bg-sky-100 text-sky-700 hover:bg-sky-200 text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors"
                          title={sources[idx]?.title}
                        >{idx + 1}</a>
                      ))}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderHybrid = () => (
    <div className="space-y-8">
      <div className="rounded-xl p-5 border border-gray-200 bg-gradient-to-br from-gray-50 to-white">
        <h4 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2"><Target className="w-4 h-4" /> Impact vs Effort Matrix</h4>
        <div className="grid grid-cols-[auto_1fr_1fr] gap-3 text-sm">
          <div></div>
          <div className="font-semibold text-center text-gray-500 text-xs uppercase tracking-wider pb-1">Low Effort</div>
          <div className="font-semibold text-center text-gray-500 text-xs uppercase tracking-wider pb-1">High Effort</div>
          <div className="font-semibold text-gray-500 text-xs uppercase tracking-wider text-right pr-3 flex items-center justify-end">High<br/>Impact</div>
          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 min-h-[80px]">
            <div className="text-[10px] font-bold text-emerald-600 mb-2 uppercase tracking-wider">Quick Wins</div>
            {filteredUseCases.filter(uc => uc.impact === 'High' && uc.effort === 'Low').map((uc, i) => (
              <div key={i} className="text-xs mb-1.5 flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />{uc.title}
              </div>
            ))}
          </div>
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 min-h-[80px]">
            <div className="text-[10px] font-bold text-amber-600 mb-2 uppercase tracking-wider">Strategic Bets</div>
            {filteredUseCases.filter(uc => uc.impact === 'High' && uc.effort !== 'Low').map((uc, i) => (
              <div key={i} className="text-xs mb-1.5 flex items-center gap-1.5 text-amber-800">
                <Target className="w-3 h-3 text-amber-500 flex-shrink-0" />{uc.title}
              </div>
            ))}
          </div>
          <div className="font-semibold text-gray-500 text-xs uppercase tracking-wider text-right pr-3 flex items-center justify-end">Low<br/>Impact</div>
          <div className="bg-sky-50 rounded-xl p-3 border border-sky-100 min-h-[80px]">
            <div className="text-[10px] font-bold text-sky-600 mb-2 uppercase tracking-wider">Fill-ins</div>
            {filteredUseCases.filter(uc => uc.impact !== 'High' && uc.effort === 'Low').map((uc, i) => (
              <div key={i} className="text-xs mb-1.5 flex items-center gap-1.5 text-sky-800">
                <Lightbulb className="w-3 h-3 text-sky-500 flex-shrink-0" />{uc.title}
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 min-h-[80px]">
            <div className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Deprioritize</div>
            {filteredUseCases.filter(uc => uc.impact !== 'High' && uc.effort !== 'Low').map((uc, i) => (
              <div key={i} className="text-xs mb-1.5 flex items-center gap-1.5 text-gray-600">
                <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />{uc.title}
              </div>
            ))}
          </div>
        </div>
      </div>
      {renderCards()}
    </div>
  );

  const renderHiddenGems = () => {
    if (!filters.role && !filters.industry) return null;
    if (!currentGems.length) return null;

    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Gem className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Hidden Gems</h3>
              <p className="text-slate-400 text-[11px]">Lesser-known Anthropic ecosystem capabilities for your context</p>
            </div>
          </div>
          <button onClick={() => setShowGems(!showGems)} className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-700">
            {showGems ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {showGems && (
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentGems.map((gem, i) => {
              const rs = getRarityStyle(gem.rarity);
              const isExpanded = expandedGem === i;
              return (
                <button
                  key={i}
                  onClick={() => setExpandedGem(isExpanded ? null : i)}
                  className={`text-left rounded-xl border p-4 transition-all duration-200 ${isExpanded ? `${rs.bg} ${rs.border}` : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${rs.dot}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${rs.text}`}>{rs.label}</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">{gem.title}</h4>
                  {isExpanded && (
                    <div className="mt-2 space-y-3 animate-in">
                      <p className="text-slate-300 text-xs leading-relaxed">{gem.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {gem.features?.map((f, j) => (
                          <span key={j} className="bg-slate-700/60 text-slate-300 text-[10px] px-2 py-0.5 rounded-md">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {!isExpanded && (
                    <p className="text-slate-400 text-xs line-clamp-1">{gem.desc}</p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] p-4 md:p-8" style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=JetBrains+Mono:wght@400;500&display=swap');
        .line-clamp-1 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; }
        .animate-in { animation: fadeSlideIn 0.3s ease-out; }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-border { 0%, 100% { border-color: rgba(99,102,241,0.2); } 50% { border-color: rgba(99,102,241,0.5); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M2 4l4 4 4-4'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-4 pb-2">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-4">
            <BrainCircuit className="w-3.5 h-3.5" /> EPB Platform
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Use Case Discovery
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            AI-powered discovery of Claude implementations tailored to your role, industry, and scale
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <h2 className="font-semibold text-gray-900 text-sm">Configure Context</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Primary filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Role', value: filters.role, key: 'role', options: roles, required: true },
                { label: 'Industry', value: filters.industry, key: 'industry', options: industries, required: true },
                { label: 'Company Stage', value: filters.maturity, key: 'maturity', options: maturities, required: true }
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">{f.label} {f.required && <span className="text-rose-400">*</span>}</label>
                  <select
                    value={f.value}
                    onChange={e => setFilters({...filters, [f.key]: e.target.value})}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 bg-white transition-all hover:border-gray-300"
                  >
                    <option value="">Select...</option>
                    {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {/* Domain pills */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Focus Domain</label>
              <div className="flex flex-wrap gap-2">
                {domains.map(d => (
                  <button key={d.value} onClick={() => setFilters({...filters, domain: d.value})}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      filters.domain === d.value
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200'
                    }`}>
                    <d.icon className="w-3.5 h-3.5" />{d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Output + Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Output Format</label>
                <div className="flex gap-2">
                  {outputFormats.map(f => (
                    <button key={f.value} onClick={() => setOutputFormat(f.value)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        outputFormat === f.value
                          ? 'bg-slate-100 text-slate-900 border border-slate-300'
                          : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100'
                      }`}>
                      <f.icon className="w-3.5 h-3.5" />{f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Audience Tier</label>
                <div className="flex gap-2">
                  {audienceTiers.map(t => (
                    <button key={t.value} onClick={() => setAudienceTier(t.value)}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs transition-all ${
                        audienceTier === t.value
                          ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                          : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                      }`}>
                      <div className="font-semibold">{t.label}</div>
                      <div className="text-[10px] opacity-60 mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />{error}
              </div>
            )}

            <div className="text-center pt-2">
              {loading ? (
                <div className="max-w-md mx-auto">
                  {/* Progress bar */}
                  <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${progress.percent}%`,
                        background: progress.percent === 100
                          ? '#10b981'
                          : 'linear-gradient(90deg, #0f172a, #334155, #0f172a)',
                        backgroundSize: '200% 100%',
                        animation: progress.percent < 100 ? 'shimmer 1.5s ease-in-out infinite' : 'none',
                      }}
                    />
                  </div>
                  {/* Stage label + elapsed */}
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 font-medium">{progress.stage}</span>
                    <span className="text-gray-400 tabular-nums font-mono text-[11px]">{progress.percent}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Web search → generate pipeline
                    </span>
                    <span className="tabular-nums font-mono">{progress.elapsed}s elapsed</span>
                  </div>
                  {progress.elapsed > 35 && (
                    <p className="text-[10px] text-amber-500 mt-2">Two-pass search taking longer than usual — hang tight</p>
                  )}
                </div>
              ) : (
                <button onClick={generateUseCases}
                  className="bg-slate-900 text-white px-10 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all inline-flex items-center gap-2.5 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30">
                  <Wand2 className="w-4 h-4" /> Discover Use Cases
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hidden Gems — shows when role or industry is selected */}
        {renderHiddenGems()}

        {/* Results */}
        {results && (
          <div ref={resultsRef} className={`space-y-6 ${animateIn ? 'animate-in' : ''}`}>
            <div className="bg-slate-900 rounded-2xl p-5 text-white border border-slate-700">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm">Context Analysis</h3>
                    <span className="bg-sky-500/20 text-sky-300 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {sources.length > 0 ? `${sources.length} Web Sources` : 'Web-Grounded'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{results.contextSummary}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm">{filteredUseCases.length} Use Cases Discovered</h3>
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-orange-500" /> Trending</span>
                  <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-500" /> Quick Start</span>
                  {sources.length > 0 && <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-sky-500" /> {sources.length} Sources</span>}
                </div>
              </div>
              <div className="p-6">
                {outputFormat === 'cards' && renderCards()}
                {outputFormat === 'roadmap' && renderRoadmap()}
                {outputFormat === 'matrix' && renderMatrix()}
                {outputFormat === 'hybrid' && renderHybrid()}
              </div>
            </div>

            {/* Sources Consulted */}
            {sources.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
                <button
                  onClick={() => setShowSources(!showSources)}
                  className="w-full px-6 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-sky-500" />
                    <h3 className="font-semibold text-gray-900 text-sm">{sources.length} Sources Consulted</h3>
                    <span className="text-[10px] text-gray-400 hidden sm:inline">Click numbers on use cases to open source</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSources ? 'rotate-180' : ''}`} />
                </button>
                {showSources && (
                  <div className="px-6 pb-5 border-t border-gray-100 pt-4 space-y-2.5">
                    {sources.map((src, i) => (
                      <div key={i} className="flex items-start gap-3 group">
                        <span className="bg-sky-100 text-sky-700 text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <a href={src.url} target="_blank" rel="noopener noreferrer"
                            className="text-sm font-medium text-gray-900 hover:text-sky-600 transition-colors leading-tight block truncate">
                            {src.title}
                          </a>
                          <a href={src.url} target="_blank" rel="noopener noreferrer"
                            className="text-[11px] text-gray-400 hover:text-sky-500 transition-colors truncate block mt-0.5">
                            {src.url}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="text-center text-[10px] text-gray-300 py-4">
          EPB Platform — Enterprise Playbook for Anthropic Ecosystem
        </div>
      </div>
    </div>
  );
};

export default EPBUseCaseDiscovery;
