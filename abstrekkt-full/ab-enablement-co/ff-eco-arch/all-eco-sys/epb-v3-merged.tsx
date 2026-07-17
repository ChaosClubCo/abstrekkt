import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Filter, Layers, Target, BookOpen, Shield, Code, Rocket, ChevronRight, Clock, TrendingUp, AlertTriangle, CheckCircle2, LayoutGrid, List, Table2, GitBranch, Gem, Eye, EyeOff, Zap, Star, ArrowRight, ChevronDown, ChevronUp, Lightbulb, Lock, Cpu, Database, FileText, Globe, Wand2, BrainCircuit, DollarSign, Download, ExternalLink, Settings, Terminal, Info } from 'lucide-react';

// ============ HIDDEN GEMS DATA ============
const HIDDEN_GEMS = {
  developer: [
    { title: "Extended Thinking for Debugging", desc: "Claude's extended thinking mode lets you watch the model's step-by-step reasoning chain. Feed it a stack trace and ask it to think through root causes.", features: ["Extended Thinking", "Claude Code"], rarity: "rare" },
    { title: "Bash + File Ops in Claude Code", desc: "Claude Code can execute arbitrary bash commands and manipulate your filesystem directly. Chain git operations, run test suites, and refactor across files.", features: ["Claude Code", "Bash tool", "File ops"], rarity: "uncommon" },
    { title: "MCP Server Chaining", desc: "Connect multiple MCP servers in one conversation — pull from GitHub, cross-reference Notion docs, and push updates to Linear.", features: ["MCP Protocol", "Tool chaining"], rarity: "rare" },
    { title: "Artifact Persistent Storage API", desc: "Artifacts can read/write key-value data that persists across sessions. Build trackers, journals, leaderboards, or stateful tools.", features: ["Artifacts", "Storage API"], rarity: "very_rare" },
  ],
  pm: [
    { title: "Claude Projects as Living Specs", desc: "Pin PRDs, wireframes, and API docs to a Claude Project. Every conversation inherits that context.", features: ["Projects", "Custom Instructions"], rarity: "uncommon" },
    { title: "PPTX Skill for Stakeholder Decks", desc: "Claude can generate fully formatted PowerPoint presentations — complete with branded slides, charts, and speaker notes.", features: ["PPTX Skill", "Computer Use"], rarity: "rare" },
    { title: "Conversation Memory for Product Context", desc: "Claude remembers key product decisions, user personas, and technical constraints across conversations.", features: ["Memory System", "Projects"], rarity: "rare" },
  ],
  executive: [
    { title: "Deep Research for Due Diligence", desc: "Claude's deep research mode autonomously investigates topics across dozens of sources, synthesizing findings into structured reports.", features: ["Deep Research", "Web Search"], rarity: "rare" },
    { title: "Claude in Excel for Financial Modeling", desc: "Claude can operate directly inside Excel spreadsheets — building formulas, running scenarios, and annotating cells.", features: ["Claude in Excel", "XLSX Skill"], rarity: "very_rare" },
    { title: "Gamma MCP for Board Decks", desc: "Connect the Gamma MCP server and Claude will create polished presentation decks from your briefing notes.", features: ["Gamma MCP", "Presentations"], rarity: "very_rare" },
  ],
  ops: [
    { title: "n8n MCP for Workflow Orchestration", desc: "Connect your n8n instance via MCP and let Claude trigger, monitor, and debug automation workflows conversationally.", features: ["n8n MCP", "Automation"], rarity: "rare" },
    { title: "Computer Use for Legacy System Ops", desc: "Claude can operate a full browser and desktop — click through legacy admin panels, fill forms, extract data.", features: ["Computer Use", "Browser Agent"], rarity: "very_rare" },
    { title: "Sentry MCP for Incident Response", desc: "Connect Sentry and Claude can pull error trends, identify regression patterns, and draft incident reports.", features: ["Sentry MCP", "Error Analysis"], rarity: "rare" },
  ],
  security: [
    { title: "Claude Code for Security Scanning", desc: "Run SAST/DAST-style checks through Claude Code — it reads your codebase, identifies OWASP Top 10 vulnerabilities.", features: ["Claude Code", "Security Analysis"], rarity: "uncommon" },
    { title: "Prompt Injection Testing", desc: "Use Claude to adversarially test your own AI deployments. It can generate sophisticated injection attempts.", features: ["Red Teaming", "Security Testing"], rarity: "rare" },
    { title: "Compliance Doc Generation", desc: "Claude's DOCX skill can generate SOC2 evidence artifacts, policy documents, and audit reports.", features: ["DOCX Skill", "Compliance"], rarity: "uncommon" },
  ],
  data: [
    { title: "Code Execution for Data Analysis", desc: "Claude can write and execute Python code in-conversation — run pandas transformations, generate matplotlib charts.", features: ["Code Execution", "Python"], rarity: "uncommon" },
    { title: "Supabase MCP for Live Queries", desc: "Connect Supabase via MCP and Claude can query your production database, analyze schemas, write migrations.", features: ["Supabase MCP", "SQL"], rarity: "rare" },
  ],
  support: [
    { title: "Intercom MCP for Ticket Context", desc: "Connect Intercom via MCP and Claude pulls conversation history, user attributes, and previous tickets.", features: ["Intercom MCP", "Support"], rarity: "rare" },
    { title: "Memory-Powered Customer Context", desc: "Claude's memory system can track customer-specific preferences, past issues, and communication style.", features: ["Memory System", "Personalization"], rarity: "uncommon" },
  ]
};

const INDUSTRY_GEMS = {
  technology: { title: "GitHub + Linear + Vercel MCP Stack", desc: "Chain all three MCP servers for a full dev lifecycle in one conversation.", rarity: "very_rare" },
  financial: { title: "Plaid MCP for Financial Data", desc: "Connect Plaid via MCP for real-time financial data access — account balances, transaction categorization.", rarity: "very_rare" },
  healthcare: { title: "Scholar Gateway MCP for Medical Research", desc: "Connect Scholar Gateway to search academic databases — clinical trials, systematic reviews.", rarity: "very_rare" },
  retail: { title: "HubSpot MCP for Customer Intelligence", desc: "Connect HubSpot and Claude can analyze deal pipelines, draft outreach sequences.", rarity: "rare" },
  professional: { title: "Fireflies MCP for Meeting Intelligence", desc: "Connect Fireflies and Claude can search meeting transcripts, extract action items.", rarity: "rare" },
};

// ============ SHADOW AI CONFIG ============
const SHADOW_AI_CONFIG = {
  dataSensitivity: {
    weight: 0.40,
    options: [
      { value: 'public', label: 'Public data only', score: 10 },
      { value: 'internal', label: 'Internal/confidential', score: 30 },
      { value: 'pii', label: 'PII (names, emails)', score: 60 },
      { value: 'phi', label: 'PHI/Financial/Regulated', score: 90 },
      { value: 'ip', label: 'Trade secrets/IP', score: 85 }
    ]
  },
  policyStatus: {
    weight: 0.35,
    options: [
      { value: 'none', label: 'No AI policy', score: 100 },
      { value: 'informal', label: 'Informal guidelines', score: 70 },
      { value: 'documented', label: 'Documented policy', score: 40 },
      { value: 'enforced', label: 'Enforced with tooling', score: 10 }
    ]
  },
  aiEmployees: {
    weight: 0.25,
    options: [
      { value: '1-25', label: '1-25 employees', score: 15 },
      { value: '26-100', label: '26-100 employees', score: 35 },
      { value: '101-500', label: '101-500 employees', score: 60 },
      { value: '500+', label: '500+ employees', score: 90 }
    ]
  }
};

const getRiskTier = (score) => {
  if (score >= 70) return { tier: 'Critical', bg: 'bg-red-500', text: 'text-red-500', light: 'bg-red-50', border: 'border-red-200', desc: 'Immediate governance action required' };
  if (score >= 50) return { tier: 'High', bg: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-50', border: 'border-orange-200', desc: 'Prioritize policy + tooling rollout' };
  if (score >= 30) return { tier: 'Moderate', bg: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-50', border: 'border-amber-200', desc: 'Document and train' };
  return { tier: 'Low', bg: 'bg-emerald-500', text: 'text-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-200', desc: 'Optimize existing controls' };
};

// ============ SKILLS & MCP DATABASE ============
const SKILLS_DB = {
  'Claude Code': { setup: 'npm install -g @anthropic-ai/claude-code' },
  'DOCX Skill': { setup: 'Settings → Skills → Enable' },
  'PDF Skill': { setup: 'Settings → Skills → Enable' },
  'PPTX Skill': { setup: 'Settings → Skills → Enable' },
  'Web Search': { setup: 'Enabled by default' },
  'Memory System': { setup: 'Settings → Memory → Enable' },
  'Projects': { setup: 'Create via sidebar' }
};

const MCP_DB = {
  'GitHub': { url: 'mcp.github.com', auth: 'PAT' },
  'Linear': { url: 'mcp.linear.app', auth: 'OAuth' },
  'Notion': { url: 'mcp.notion.com', auth: 'OAuth' },
  'Supabase': { url: 'mcp.supabase.com', auth: 'API Key' },
  'Sentry': { url: 'mcp.sentry.dev', auth: 'API Key' },
  'n8n': { url: 'your-n8n.app.n8n.cloud/mcp', auth: 'API Key' },
  'Slack': { url: 'mcp.slack.com', auth: 'OAuth' }
};

// ============ MAIN COMPONENT ============
const EPBUseCaseDiscoveryV3 = () => {
  const [filters, setFilters] = useState({ role: '', industry: '', maturity: '', domain: 'all' });
  const [shadowAI, setShadowAI] = useState({ data: '', policy: '', employees: '' });
  const [outputFormat, setOutputFormat] = useState('cards');
  const [audienceTier, setAudienceTier] = useState('tech');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showGems, setShowGems] = useState(true);
  const [showShadowAI, setShowShadowAI] = useState(false);
  const [expandedGem, setExpandedGem] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const resultsRef = useRef(null);

  const roles = [
    { value: 'developer', label: 'Developer / Engineer' },
    { value: 'pm', label: 'Product Manager' },
    { value: 'executive', label: 'Executive / C-Suite' },
    { value: 'ops', label: 'Operations / IT' },
    { value: 'security', label: 'Security / Compliance' },
    { value: 'data', label: 'Data / Analytics' },
    { value: 'support', label: 'Customer Success' }
  ];

  const industries = [
    { value: 'technology', label: 'Technology / SaaS' },
    { value: 'financial', label: 'Financial Services' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'retail', label: 'Retail / E-commerce' },
    { value: 'professional', label: 'Professional Services' }
  ];

  const maturities = [
    { value: 'startup', label: 'Startup (1-50)' },
    { value: 'smb', label: 'SMB (50-200)' },
    { value: 'midmarket', label: 'Mid-Market (200-1K)' },
    { value: 'enterprise', label: 'Enterprise (1K+)' }
  ];

  const domains = [
    { value: 'all', label: 'All', icon: Layers },
    { value: 'implementation', label: 'Implementation', icon: Rocket },
    { value: 'prompts', label: 'Prompts', icon: Code },
    { value: 'governance', label: 'Governance', icon: Shield },
    { value: 'training', label: 'Training', icon: BookOpen }
  ];

  const calcShadowScore = () => {
    if (!shadowAI.data || !shadowAI.policy || !shadowAI.employees) return null;
    const d = SHADOW_AI_CONFIG.dataSensitivity.options.find(o => o.value === shadowAI.data)?.score || 0;
    const p = SHADOW_AI_CONFIG.policyStatus.options.find(o => o.value === shadowAI.policy)?.score || 0;
    const e = SHADOW_AI_CONFIG.aiEmployees.options.find(o => o.value === shadowAI.employees)?.score || 0;
    return Math.round(d * 0.4 + p * 0.35 + e * 0.25);
  };

  const shadowScore = calcShadowScore();
  const riskTier = shadowScore ? getRiskTier(shadowScore) : null;

  const currentGems = [...(HIDDEN_GEMS[filters.role] || []), ...(INDUSTRY_GEMS[filters.industry] ? [INDUSTRY_GEMS[filters.industry]] : [])];

  const getRarityStyle = (r) => ({
    uncommon: { bg: 'bg-emerald-900/20', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Uncommon' },
    rare: { bg: 'bg-sky-900/20', border: 'border-sky-500/30', text: 'text-sky-400', dot: 'bg-sky-400', label: 'Rare' },
    very_rare: { bg: 'bg-amber-900/20', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400', label: 'Very Rare' }
  }[r] || { bg: 'bg-gray-800', text: 'text-gray-400', dot: 'bg-gray-400', label: 'Common' });

  const generateUseCases = async () => {
    if (!filters.role || !filters.industry || !filters.maturity) { setError('Select role, industry, and company stage'); return; }
    setLoading(true); setError(null);

    const tierDesc = { enduser: 'Plain English, business outcomes', tech: 'Implementation details, setup steps', ai: 'Architecture-level, code snippets, MCP configs' };
    const prompt = `You are an Anthropic ecosystem expert for the EPB platform.

CONTEXT: Role: ${roles.find(r=>r.value===filters.role)?.label}, Industry: ${industries.find(i=>i.value===filters.industry)?.label}, Size: ${maturities.find(m=>m.value===filters.maturity)?.label}
${shadowScore ? `Shadow AI Risk: ${shadowScore}/100 (${riskTier.tier})` : ''}
AUDIENCE: ${tierDesc[audienceTier]}

Generate 8 use cases. Each must include:
- title, description, domain (implementation|prompts|governance|training), trending (bool), priority, effort, impact
- timeframe: Quick Win (<1 week)|Short-term (1-4 weeks)|Medium-term (1-3 months)|Long-term (3+ months)
- claudeFeatures: array, risks: string, quickStart: string
- roiEstimate: { costReductionPerMonth: number, hoursSavedPerWeek: number, riskMitigationValue: string, timeToValue: string }
- skillsPrescription: { skills: string[], mcpConnectors: string[], setupNotes: string }

Respond ONLY with valid JSON: {"contextSummary":"...","useCases":[...]}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 3500, messages: [{ role: "user", content: prompt }] })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResults(JSON.parse(data.content[0].text.replace(/```json\n?|```/g, '').trim()));
    } catch { setResults(getFallback()); }
    setLoading(false);
  };

  const getFallback = () => ({
    contextSummary: `For a ${filters.role} in ${filters.industry}, the Anthropic ecosystem offers opportunities across implementation, workflows, governance, and training.`,
    useCases: [
      { title: "Automated Code Review", domain: "implementation", trending: true, priority: "High", effort: "Medium", impact: "High", timeframe: "Short-term (1-4 weeks)", claudeFeatures: ["Claude Code", "GitHub"], risks: "Requires criteria", quickStart: "Install Claude Code CLI", roiEstimate: { costReductionPerMonth: 4500, hoursSavedPerWeek: 12, timeToValue: "2 weeks" }, skillsPrescription: { skills: ["Claude Code"], mcpConnectors: ["GitHub", "Linear"], setupNotes: "npm install -g claude-code" } },
      { title: "Multi-Agent Document Processing", domain: "prompts", trending: true, priority: "High", effort: "High", impact: "High", timeframe: "Medium-term (1-3 months)", claudeFeatures: ["Multi-agent", "PDF Skill"], risks: "Complex handoffs", quickStart: "Map top 3 doc types", roiEstimate: { costReductionPerMonth: 8000, hoursSavedPerWeek: 20, timeToValue: "6 weeks" }, skillsPrescription: { skills: ["PDF Skill", "DOCX Skill"], mcpConnectors: ["Google Drive"], setupNotes: "Enable skills in settings" } },
      { title: "Shadow AI Governance", domain: "governance", trending: true, priority: "High", effort: "Medium", impact: "High", timeframe: "Short-term (1-4 weeks)", claudeFeatures: ["Audit trails"], risks: "Change management", quickStart: "Survey 10 power users", roiEstimate: { costReductionPerMonth: 3000, hoursSavedPerWeek: 5, timeToValue: "2 weeks" }, skillsPrescription: { skills: ["DOCX Skill"], mcpConnectors: ["Slack"], setupNotes: "Define data classification" } },
      { title: "Prompt Library", domain: "prompts", trending: false, priority: "Medium", effort: "Low", impact: "Medium", timeframe: "Quick Win (<1 week)", claudeFeatures: ["Projects", "Memory"], risks: "Needs curation", quickStart: "Collect top 5 prompts", roiEstimate: { costReductionPerMonth: 1500, hoursSavedPerWeek: 8, timeToValue: "3 days" }, skillsPrescription: { skills: ["Projects"], mcpConnectors: ["Notion"], setupNotes: "Create project per team" } },
      { title: "Compliance Reporting", domain: "governance", trending: false, priority: "Medium", effort: "Medium", impact: "High", timeframe: "Medium-term (1-3 months)", claudeFeatures: ["DOCX Skill", "XLSX Skill"], risks: "Validate artifacts", quickStart: "Export control matrix", roiEstimate: { costReductionPerMonth: 6000, hoursSavedPerWeek: 15, timeToValue: "8 weeks" }, skillsPrescription: { skills: ["DOCX Skill", "XLSX Skill"], mcpConnectors: [], setupNotes: "Map controls to evidence" } },
      { title: "Claude Certification", domain: "training", trending: true, priority: "Medium", effort: "Low", impact: "Medium", timeframe: "Short-term (1-4 weeks)", claudeFeatures: ["Anthropic courses"], risks: "Evolving capabilities", quickStart: "Enroll team leads", roiEstimate: { costReductionPerMonth: 2000, hoursSavedPerWeek: 4, timeToValue: "2 weeks" }, skillsPrescription: { skills: [], mcpConnectors: [], setupNotes: "Start with prompt engineering course" } },
      { title: "Support Copilot", domain: "implementation", trending: false, priority: "High", effort: "Medium", impact: "High", timeframe: "Short-term (1-4 weeks)", claudeFeatures: ["MCP", "Web Search", "Memory"], risks: "Tone tuning", quickStart: "Export top 20 ticket types", roiEstimate: { costReductionPerMonth: 5500, hoursSavedPerWeek: 25, timeToValue: "3 weeks" }, skillsPrescription: { skills: ["Web Search", "Memory"], mcpConnectors: ["Intercom", "Slack"], setupNotes: "Connect support platform" } },
      { title: "Executive Briefings", domain: "training", trending: false, priority: "Low", effort: "Low", impact: "Medium", timeframe: "Quick Win (<1 week)", claudeFeatures: ["Web Search", "PPTX Skill"], risks: "Validate before distributing", quickStart: "Draft one manually first", roiEstimate: { costReductionPerMonth: 1000, hoursSavedPerWeek: 3, timeToValue: "2 days" }, skillsPrescription: { skills: ["PPTX Skill", "Web Search"], mcpConnectors: [], setupNotes: "Create template format" } }
    ]
  });

  const filtered = results?.useCases?.filter(uc => filters.domain === 'all' || uc.domain === filters.domain) || [];
  const highPriority = filtered.filter(uc => uc.priority === 'High');
  const roi = {
    monthly: highPriority.reduce((s, uc) => s + (uc.roiEstimate?.costReductionPerMonth || 2000), 0),
    hours: highPriority.reduce((s, uc) => s + (uc.roiEstimate?.hoursSavedPerWeek || 8), 0)
  };

  const exportProposal = () => {
    let md = `# AI Implementation Proposal\n\n## Executive Summary\n${results?.contextSummary}\n\n`;
    if (shadowScore) md += `## Shadow AI Risk: ${shadowScore}/100 (${riskTier.tier})\n${riskTier.desc}\n\n`;
    md += `## ROI (High Priority)\n- Monthly: $${roi.monthly.toLocaleString()}\n- Hours/week: ${roi.hours}\n- Annual: $${(roi.monthly*12).toLocaleString()}\n\n`;
    md += `## Use Cases\n`;
    filtered.forEach((uc, i) => { md += `### ${i+1}. ${uc.title}\n${uc.description || ''}\n**Quick Start:** ${uc.quickStart}\n\n`; });
    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `AI-Proposal-${new Date().toISOString().split('T')[0]}.md`; a.click();
  };

  const getDomainStyle = (d) => ({ implementation: 'bg-cyan-50 text-cyan-700 border-cyan-200', prompts: 'bg-violet-50 text-violet-700 border-violet-200', governance: 'bg-amber-50 text-amber-700 border-amber-200', training: 'bg-teal-50 text-teal-700 border-teal-200' }[d] || 'bg-gray-50 text-gray-700');

  const toggleCard = (i) => setExpandedCards(p => ({ ...p, [i]: !p[i] }));

  return (
    <div className="min-h-screen bg-[#f8f9fb] p-4 md:p-6" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="text-center pt-2 pb-1">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
            <BrainCircuit className="w-3 h-3" /> EPB Platform v3
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Use Case Discovery</h1>
          <p className="text-gray-400 text-sm">AI-powered discovery with ROI, governance scoring, and implementation guidance</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[{ k: 'role', l: 'Role', o: roles }, { k: 'industry', l: 'Industry', o: industries }, { k: 'maturity', l: 'Company Stage', o: maturities }].map(f => (
              <div key={f.k}>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">{f.l} *</label>
                <select value={filters[f.k]} onChange={e => setFilters({...filters, [f.k]: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                  <option value="">Select...</option>
                  {f.o.map(x => <option key={x.value} value={x.value}>{x.label}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {domains.map(d => (
              <button key={d.value} onClick={() => setFilters({...filters, domain: d.value})} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filters.domain === d.value ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <d.icon className="w-3 h-3" />{d.label}
              </button>
            ))}
          </div>

          {/* Shadow AI Scorer */}
          <div className="border border-amber-200 rounded-xl overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50">
            <button onClick={() => setShowShadowAI(!showShadowAI)} className="w-full px-4 py-3 flex items-center justify-between hover:bg-amber-100/50">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-sm text-gray-900">Shadow AI Risk Assessment</span>
                <span className="text-xs text-amber-700">38% share sensitive data via unapproved AI</span>
              </div>
              <div className="flex items-center gap-2">
                {shadowScore && <span className={`${riskTier.bg} text-white text-xs font-bold px-2 py-0.5 rounded`}>{shadowScore}/100</span>}
                {showShadowAI ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>
            {showShadowAI && (
              <div className="px-4 pb-4 pt-2 border-t border-amber-200 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Data Sensitivity (40%)</label>
                  <select value={shadowAI.data} onChange={e => setShadowAI({...shadowAI, data: e.target.value})} className="w-full px-2 py-1.5 border rounded text-sm mt-1">
                    <option value="">Select...</option>
                    {SHADOW_AI_CONFIG.dataSensitivity.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Policy Status (35%)</label>
                  <select value={shadowAI.policy} onChange={e => setShadowAI({...shadowAI, policy: e.target.value})} className="w-full px-2 py-1.5 border rounded text-sm mt-1">
                    <option value="">Select...</option>
                    {SHADOW_AI_CONFIG.policyStatus.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">AI-Enabled Staff (25%)</label>
                  <select value={shadowAI.employees} onChange={e => setShadowAI({...shadowAI, employees: e.target.value})} className="w-full px-2 py-1.5 border rounded text-sm mt-1">
                    <option value="">Select...</option>
                    {SHADOW_AI_CONFIG.aiEmployees.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                {shadowScore && (
                  <div className={`md:col-span-3 ${riskTier.light} border ${riskTier.border} rounded-lg p-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl font-black ${riskTier.text}`}>{shadowScore}</span>
                      <div>
                        <div className={`font-bold ${riskTier.text}`}>{riskTier.tier} Risk</div>
                        <div className="text-xs text-gray-600">{riskTier.desc}</div>
                      </div>
                    </div>
                    {shadowScore >= 50 && (
                      <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Learn about SafeStart <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Output + Audience */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t">
            <div className="flex gap-1">
              {[{ v: 'cards', i: LayoutGrid }, { v: 'roadmap', i: GitBranch }, { v: 'matrix', i: Table2 }, { v: 'hybrid', i: List }].map(f => (
                <button key={f.v} onClick={() => setOutputFormat(f.v)} className={`p-2 rounded-lg ${outputFormat === f.v ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-500'}`}><f.i className="w-4 h-4" /></button>
              ))}
            </div>
            <div className="flex gap-1 border-l pl-4">
              {[{ v: 'enduser', l: 'End User' }, { v: 'tech', l: 'Tech' }, { v: 'ai', l: 'AI Team' }].map(t => (
                <button key={t.v} onClick={() => setAudienceTier(t.v)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${audienceTier === t.v ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{t.l}</button>
              ))}
            </div>
            <button onClick={generateUseCases} disabled={loading} className="ml-auto bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Discovering...</> : <><Wand2 className="w-4 h-4" />Discover</>}
            </button>
          </div>
          {error && <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}
        </div>

        {/* Hidden Gems */}
        {currentGems.length > 0 && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-5 py-3 flex items-center justify-between border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-white text-sm">Hidden Gems</span>
                <span className="text-slate-400 text-xs">Lesser-known capabilities</span>
              </div>
              <button onClick={() => setShowGems(!showGems)} className="text-slate-400 hover:text-white">{showGems ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
            {showGems && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentGems.map((g, i) => {
                  const rs = getRarityStyle(g.rarity);
                  return (
                    <button key={i} onClick={() => setExpandedGem(expandedGem === i ? null : i)} className={`text-left rounded-lg border p-3 transition ${expandedGem === i ? `${rs.bg} ${rs.border}` : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${rs.dot}`} />
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${rs.text}`}>{rs.label}</span>
                      </div>
                      <h4 className="font-semibold text-white text-sm">{g.title}</h4>
                      {expandedGem === i && <p className="text-slate-300 text-xs mt-2">{g.desc}</p>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {results && (
          <div ref={resultsRef} className="space-y-4">
            {/* ROI Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 text-white">
                <DollarSign className="w-5 h-5 mb-1 opacity-80" />
                <div className="text-2xl font-black">${roi.monthly.toLocaleString()}</div>
                <div className="text-emerald-100 text-xs">Monthly Savings</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
                <Clock className="w-5 h-5 mb-1 opacity-80" />
                <div className="text-2xl font-black">{roi.hours}h</div>
                <div className="text-blue-100 text-xs">Weekly Hours Saved</div>
              </div>
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-4 text-white">
                <TrendingUp className="w-5 h-5 mb-1 opacity-80" />
                <div className="text-2xl font-black">${(roi.monthly * 12).toLocaleString()}</div>
                <div className="text-violet-100 text-xs">Annual Projection</div>
              </div>
              <div className="bg-slate-900 rounded-xl p-4 text-white flex flex-col justify-between">
                <Target className="w-5 h-5 mb-1 opacity-80" />
                <div className="text-sm text-slate-300 leading-snug">{results.contextSummary?.slice(0, 100)}...</div>
              </div>
            </div>

            {/* SafeStart CTA */}
            {shadowScore >= 50 && (
              <div className={`${riskTier.light} border ${riskTier.border} rounded-xl p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <Shield className={`w-6 h-6 ${riskTier.text}`} />
                  <div>
                    <div className="font-bold text-gray-900">Address Shadow AI Risk</div>
                    <div className="text-sm text-gray-600">Score: {shadowScore}/100 ({riskTier.tier}). Consider a 4-week governance assessment.</div>
                  </div>
                </div>
                <a href="#" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-1">
                  Learn About SafeStart <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* Use Cases */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="px-5 py-3 flex items-center justify-between border-b">
                <h3 className="font-bold text-gray-900 text-sm">{filtered.length} Use Cases</h3>
                <button onClick={exportProposal} className="flex items-center gap-1 text-sm text-slate-700 hover:text-slate-900 font-medium bg-gray-100 px-3 py-1.5 rounded-lg">
                  <Download className="w-4 h-4" /> Export Proposal
                </button>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map((uc, i) => (
                    <div key={i} className="bg-white rounded-xl border hover:shadow-lg transition-all p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex gap-1.5 flex-wrap">
                          {uc.trending && <span className="bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><TrendingUp className="w-2.5 h-2.5" />Trending</span>}
                          <span className={`text-[9px] px-2 py-0.5 rounded-full border ${getDomainStyle(uc.domain)}`}>{uc.domain}</span>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${uc.priority === 'High' ? 'bg-red-100 text-red-700' : uc.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{uc.priority}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{uc.title}</h4>
                      <p className="text-xs text-gray-500 mb-2">{uc.description || `${uc.title} implementation for ${filters.industry}.`}</p>
                      {uc.quickStart && (
                        <div className="bg-amber-50 rounded-lg p-2 mb-2 flex items-start gap-1.5">
                          <Zap className="w-3 h-3 text-amber-600 mt-0.5" />
                          <span className="text-[10px] text-amber-800"><b>Quick start:</b> {uc.quickStart}</span>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2 text-[10px] bg-gray-50 rounded-lg p-2 mb-2">
                        <div><DollarSign className="w-3 h-3 inline text-green-600" /> ${uc.roiEstimate?.costReductionPerMonth?.toLocaleString() || '2,000'}/mo</div>
                        <div><Clock className="w-3 h-3 inline text-blue-600" /> {uc.roiEstimate?.hoursSavedPerWeek || 8}h/week</div>
                      </div>
                      {/* Skills Prescription */}
                      <button onClick={() => toggleCard(i)} className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
                        <Settings className="w-3 h-3" /> Skills & Setup {expandedCards[i] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                      {expandedCards[i] && (
                        <div className="mt-2 space-y-2 text-xs">
                          <div><b>Skills:</b> {uc.skillsPrescription?.skills?.join(', ') || uc.claudeFeatures?.join(', ')}</div>
                          {uc.skillsPrescription?.mcpConnectors?.length > 0 && <div><b>MCP:</b> {uc.skillsPrescription.mcpConnectors.join(', ')}</div>}
                          {audienceTier !== 'enduser' && <div className="bg-gray-100 rounded p-2 text-[10px]">{uc.skillsPrescription?.setupNotes || 'Enable required skills in Settings'}</div>}
                          {audienceTier === 'ai' && (
                            <pre className="bg-slate-900 text-green-400 rounded p-2 text-[9px] overflow-x-auto">
{`// MCP Config
"mcpServers": {
${(uc.skillsPrescription?.mcpConnectors || []).map(m => `  "${m.toLowerCase()}": { "url": "${MCP_DB[m]?.url || 'mcp.example.com'}" }`).join(',\n')}
}`}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center text-[9px] text-gray-300 py-2">EPB Platform v3 — Enterprise Playbook for Anthropic Ecosystem</div>
      </div>
    </div>
  );
};

export default EPBUseCaseDiscoveryV3;