import React, { useState, useRef } from 'react';
import { Sparkles, Filter, Layers, Target, BookOpen, Shield, Code, Rocket, ChevronRight, Clock, TrendingUp, AlertTriangle, CheckCircle2, LayoutGrid, List, Table2, GitBranch, AlertCircle, DollarSign, Download, ExternalLink, Zap, Users, FileText, Settings, Terminal, ChevronDown, ChevronUp } from 'lucide-react';

const EPBUseCaseDiscovery = () => {
  const [filters, setFilters] = useState({
    role: '',
    industry: '',
    maturity: '',
    domain: 'all'
  });
  const [shadowAI, setShadowAI] = useState({
    dataSensitivity: '',
    policyStatus: '',
    aiEnabledEmployees: ''
  });
  const [outputFormat, setOutputFormat] = useState('cards');
  const [audienceTier, setAudienceTier] = useState('tech');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showShadowAI, setShowShadowAI] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const resultsRef = useRef(null);

  const roles = [
    { value: 'developer', label: 'Developer / Engineer' },
    { value: 'pm', label: 'Product Manager' },
    { value: 'executive', label: 'Executive / C-Suite' },
    { value: 'ops', label: 'Operations / IT' },
    { value: 'security', label: 'Security / Compliance' },
    { value: 'data', label: 'Data / Analytics' },
    { value: 'support', label: 'Customer Success / Support' }
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
    { value: 'midmarket', label: 'Mid-Market (200-1000)' },
    { value: 'enterprise', label: 'Enterprise (1000+)' }
  ];

  const dataSensitivities = [
    { value: 'public', label: 'Public data only', score: 10 },
    { value: 'internal', label: 'Internal/confidential', score: 30 },
    { value: 'pii', label: 'PII (names, emails, etc.)', score: 60 },
    { value: 'phi', label: 'PHI/Financial/Regulated', score: 90 },
    { value: 'ip', label: 'Trade secrets/IP', score: 85 }
  ];

  const policyStatuses = [
    { value: 'none', label: 'No AI policy', score: 100 },
    { value: 'informal', label: 'Informal guidelines', score: 70 },
    { value: 'documented', label: 'Documented policy', score: 40 },
    { value: 'enforced', label: 'Enforced with tooling', score: 10 }
  ];

  const aiEmployeeCounts = [
    { value: '1-25', label: '1-25 employees', score: 15 },
    { value: '26-100', label: '26-100 employees', score: 35 },
    { value: '101-500', label: '101-500 employees', score: 60 },
    { value: '500+', label: '500+ employees', score: 90 }
  ];

  const domains = [
    { value: 'all', label: 'All Domains', icon: Layers },
    { value: 'implementation', label: 'AI Implementation', icon: Rocket },
    { value: 'prompts', label: 'Prompts & Workflows', icon: Code },
    { value: 'governance', label: 'AI Governance', icon: Shield },
    { value: 'training', label: 'Training & Certification', icon: BookOpen }
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

  const calculateShadowAIScore = () => {
    if (!shadowAI.dataSensitivity || !shadowAI.policyStatus || !shadowAI.aiEnabledEmployees) return null;
    const dataScore = dataSensitivities.find(d => d.value === shadowAI.dataSensitivity)?.score || 0;
    const policyScore = policyStatuses.find(p => p.value === shadowAI.policyStatus)?.score || 0;
    const employeeScore = aiEmployeeCounts.find(e => e.value === shadowAI.aiEnabledEmployees)?.score || 0;
    return Math.round((dataScore * 0.4) + (policyScore * 0.35) + (employeeScore * 0.25));
  };

  const getShadowAITier = (score) => {
    if (score >= 70) return { tier: 'Critical', color: 'red', bg: 'bg-red-500', desc: 'Immediate governance action required' };
    if (score >= 50) return { tier: 'High', color: 'orange', bg: 'bg-orange-500', desc: 'Significant exposure — prioritize controls' };
    if (score >= 30) return { tier: 'Moderate', color: 'yellow', bg: 'bg-yellow-500', desc: 'Manageable risk with proper oversight' };
    return { tier: 'Low', color: 'green', bg: 'bg-green-500', desc: 'Good foundation — optimize and scale' };
  };

  const generateUseCases = async () => {
    if (!filters.role || !filters.industry || !filters.maturity) {
      setError('Please select role, industry, and company maturity');
      return;
    }
    setLoading(true);
    setError(null);

    const tierInstructions = {
      enduser: 'Non-technical end user: Plain English, business outcomes, no jargon. For skillsPrescription: just list skill names. For implementation: describe what it does, not how.',
      tech: 'Internal tech team: Implementation details, setup steps, config hints. For skillsPrescription: include setup steps and configuration. For implementation: include integration patterns.',
      ai: 'Internal AI team: Architecture-level, multi-agent patterns, code snippets. For skillsPrescription: include full implementation snippets with example prompts/code. For implementation: include orchestration strategies.'
    };

    const shadowScore = calculateShadowAIScore();
    const shadowContext = shadowScore ? `Shadow AI Risk Score: ${shadowScore}/100 (${getShadowAITier(shadowScore).tier}). Factor this into governance recommendations.` : '';

    const prompt = `You are an Anthropic ecosystem expert for the EPB (Enterprise Profile Builder) platform.

CONTEXT:
- Role: ${roles.find(r => r.value === filters.role)?.label}
- Industry: ${industries.find(i => i.value === filters.industry)?.label}  
- Company Size: ${maturities.find(m => m.value === filters.maturity)?.label}
- Domain Focus: ${filters.domain === 'all' ? 'All domains' : domains.find(d => d.value === filters.domain)?.label}
${shadowContext}

AUDIENCE TIER: ${tierInstructions[audienceTier]}

ANTHROPIC ECOSYSTEM TO REFERENCE:
- Claude Code: CLI agentic development, ReAct loops, HITL controls, bash/file operations
- Multi-Agent: Coordinator patterns, specialist agents, handoffs, parallel execution
- Skills: docx, pdf, pptx, xlsx, frontend-design, MCP servers, artifacts, web search
- Governance: SOC2, RLS policies, audit trails, shadow AI detection, OWASP

Generate 8 tailored use cases. Each must include:
- title: Under 10 words
- description: 2-3 sentences (tailored to audience tier)
- domain: implementation|prompts|governance|training
- trending: boolean
- priority: High|Medium|Low
- effort: Low|Medium|High
- impact: High|Medium|Low
- timeframe: Quick Win (<1 week)|Short-term (1-4 weeks)|Medium-term (1-3 months)|Long-term (3+ months)
- claudeFeatures: array of Claude capabilities
- risks: brief risk note
- skillsPrescription: object with { skills: string[], mcpConnectors: string[], setupNotes: string (depth based on audience tier), implementationSnippet: string (only for AI team tier, otherwise empty) }
- roiEstimate: object with { costReductionPerMonth: number (USD), hoursSavedPerWeek: number, riskMitigationValue: string (Low/Medium/High), timeToValue: string }

Respond ONLY with valid JSON:
{
  "contextSummary": "2-3 sentences about their situation",
  "useCases": [...]
}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      if (!response.ok) throw new Error('API failed');
      const data = await response.json();
      let text = data.content[0].text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      setResults(JSON.parse(text));
    } catch (err) {
      console.error(err);
      setResults(getFallbackResults());
    }
    setLoading(false);
  };

  const getFallbackResults = () => ({
    contextSummary: `For a ${roles.find(r => r.value === filters.role)?.label} in ${industries.find(i => i.value === filters.industry)?.label}, the Anthropic ecosystem offers high-impact opportunities across implementation, workflows, governance, and training paths.`,
    useCases: [
      { title: "Automated Code Review Pipeline", description: "Deploy Claude Code for autonomous security scanning and code quality enforcement with human-in-the-loop approvals.", domain: "implementation", trending: true, priority: "High", effort: "Medium", impact: "High", timeframe: "Short-term (1-4 weeks)", claudeFeatures: ["Claude Code", "Bash tools", "File operations"], risks: "Requires clear acceptance criteria", skillsPrescription: { skills: ["Claude Code CLI"], mcpConnectors: ["GitHub", "Linear"], setupNotes: "Install via npm, configure with claude_desktop_config.json", implementationSnippet: "" }, roiEstimate: { costReductionPerMonth: 4500, hoursSavedPerWeek: 12, riskMitigationValue: "High", timeToValue: "2 weeks" } },
      { title: "Multi-Agent Document Processing", description: "Orchestrate specialist agents for document intake, classification, extraction, and validation workflows.", domain: "prompts", trending: true, priority: "High", effort: "High", impact: "High", timeframe: "Medium-term (1-3 months)", claudeFeatures: ["Multi-agent orchestration", "PDF skill", "DOCX skill"], risks: "Complex state management", skillsPrescription: { skills: ["pdf", "docx", "xlsx"], mcpConnectors: ["Google Drive", "Notion"], setupNotes: "Enable skills in Claude settings, configure MCP servers", implementationSnippet: "" }, roiEstimate: { costReductionPerMonth: 8000, hoursSavedPerWeek: 20, riskMitigationValue: "Medium", timeToValue: "6 weeks" } },
      { title: "Shadow AI Governance Framework", description: "Implement detection and policy enforcement for unauthorized AI tool usage across the organization.", domain: "governance", trending: true, priority: "High", effort: "Medium", impact: "High", timeframe: "Short-term (1-4 weeks)", claudeFeatures: ["Audit trails", "Policy enforcement"], risks: "Change management challenges", skillsPrescription: { skills: ["docx", "xlsx"], mcpConnectors: ["Slack", "Email"], setupNotes: "Define data classification tiers, create policy templates", implementationSnippet: "" }, roiEstimate: { costReductionPerMonth: 3000, hoursSavedPerWeek: 5, riskMitigationValue: "High", timeToValue: "2 weeks" } },
      { title: "Role-Based Prompt Library", description: "Build curated prompt repository mapped to job functions with version control and effectiveness tracking.", domain: "prompts", trending: false, priority: "Medium", effort: "Low", impact: "Medium", timeframe: "Quick Win (<1 week)", claudeFeatures: ["Projects", "Custom instructions", "Memory"], risks: "Requires ongoing curation", skillsPrescription: { skills: ["Projects feature"], mcpConnectors: ["Notion", "GitHub"], setupNotes: "Create project per department, add custom instructions", implementationSnippet: "" }, roiEstimate: { costReductionPerMonth: 1500, hoursSavedPerWeek: 8, riskMitigationValue: "Low", timeToValue: "3 days" } },
      { title: "Compliance Report Automation", description: "Automate SOC2/HIPAA evidence collection and report generation with RLS-protected data access.", domain: "governance", trending: false, priority: "Medium", effort: "Medium", impact: "High", timeframe: "Medium-term (1-3 months)", claudeFeatures: ["DOCX skill", "XLSX skill", "Web search"], risks: "Validate auto-generated artifacts", skillsPrescription: { skills: ["docx", "xlsx", "pdf"], mcpConnectors: ["Google Drive", "Jira"], setupNotes: "Map control requirements to evidence sources", implementationSnippet: "" }, roiEstimate: { costReductionPerMonth: 6000, hoursSavedPerWeek: 15, riskMitigationValue: "High", timeToValue: "8 weeks" } },
      { title: "Claude Certification Pathway", description: "Structured learning from prompt engineering basics through advanced agentic patterns with hands-on labs.", domain: "training", trending: true, priority: "Medium", effort: "Low", impact: "Medium", timeframe: "Short-term (1-4 weeks)", claudeFeatures: ["Anthropic courses", "Claude.ai", "Skills"], risks: "Capabilities evolve rapidly", skillsPrescription: { skills: ["All core skills"], mcpConnectors: [], setupNotes: "Start with Anthropic's official courses, progress to hands-on projects", implementationSnippet: "" }, roiEstimate: { costReductionPerMonth: 2000, hoursSavedPerWeek: 4, riskMitigationValue: "Medium", timeToValue: "2 weeks" } },
      { title: "Customer Support Copilot", description: "Deploy Claude as real-time agent assistant for response drafting, documentation lookup, and routine handling.", domain: "implementation", trending: false, priority: "High", effort: "Medium", impact: "High", timeframe: "Short-term (1-4 weeks)", claudeFeatures: ["MCP connectors", "Web search", "Memory"], risks: "Tone consistency tuning needed", skillsPrescription: { skills: ["Web search", "Memory"], mcpConnectors: ["Zendesk", "Intercom", "Slack"], setupNotes: "Connect support platform via MCP, create response templates", implementationSnippet: "" }, roiEstimate: { costReductionPerMonth: 5500, hoursSavedPerWeek: 25, riskMitigationValue: "Medium", timeToValue: "3 weeks" } },
      { title: "Executive AI Briefings", description: "Generate weekly synthesized briefings on AI developments, competitive intel, and adoption metrics.", domain: "training", trending: false, priority: "Low", effort: "Low", impact: "Medium", timeframe: "Quick Win (<1 week)", claudeFeatures: ["Web search", "PPTX skill", "Artifacts"], risks: "Validate before distribution", skillsPrescription: { skills: ["pptx", "Web search"], mcpConnectors: ["Google Drive", "Notion"], setupNotes: "Create briefing template, schedule weekly generation", implementationSnippet: "" }, roiEstimate: { costReductionPerMonth: 1000, hoursSavedPerWeek: 3, riskMitigationValue: "Low", timeToValue: "2 days" } }
    ]
  });

  const calculateTotalROI = () => {
    if (!results?.useCases) return null;
    const filtered = results.useCases.filter(uc => filters.domain === 'all' || uc.domain === filters.domain);
    const highPriority = filtered.filter(uc => uc.priority === 'High');
    return {
      totalMonthlySavings: highPriority.reduce((sum, uc) => sum + (uc.roiEstimate?.costReductionPerMonth || 0), 0),
      totalWeeklyHours: highPriority.reduce((sum, uc) => sum + (uc.roiEstimate?.hoursSavedPerWeek || 0), 0),
      annualProjection: highPriority.reduce((sum, uc) => sum + (uc.roiEstimate?.costReductionPerMonth || 0), 0) * 12
    };
  };

  const exportProposal = () => {
    const roi = calculateTotalROI();
    const shadowScore = calculateShadowAIScore();
    const filtered = results?.useCases?.filter(uc => filters.domain === 'all' || uc.domain === filters.domain) || [];
    
    let content = `# AI Implementation Proposal\n## Executive Summary\n\n`;
    content += `**Prepared for:** ${roles.find(r => r.value === filters.role)?.label} | ${industries.find(i => i.value === filters.industry)?.label} | ${maturities.find(m => m.value === filters.maturity)?.label}\n\n`;
    content += `**Context:** ${results?.contextSummary}\n\n`;
    if (shadowScore) {
      const tier = getShadowAITier(shadowScore);
      content += `**Shadow AI Risk Score:** ${shadowScore}/100 (${tier.tier}) - ${tier.desc}\n\n`;
    }
    content += `---\n\n## ROI Projections (High Priority Items)\n\n`;
    content += `| Metric | Value |\n|--------|-------|\n`;
    content += `| Monthly Cost Reduction | $${roi?.totalMonthlySavings?.toLocaleString()} |\n`;
    content += `| Weekly Hours Saved | ${roi?.totalWeeklyHours} hours |\n`;
    content += `| Annual Projection | $${roi?.annualProjection?.toLocaleString()} |\n\n`;
    content += `---\n\n## Implementation Roadmap\n\n`;
    ['Quick Win (<1 week)', 'Short-term (1-4 weeks)', 'Medium-term (1-3 months)', 'Long-term (3+ months)'].forEach((phase, i) => {
      const items = filtered.filter(uc => uc.timeframe === phase);
      if (items.length > 0) {
        content += `### Phase ${i + 1}: ${phase}\n`;
        items.forEach(uc => { content += `- **${uc.title}** (${uc.priority} priority) - Est. $${uc.roiEstimate?.costReductionPerMonth}/mo savings\n`; });
        content += `\n`;
      }
    });
    content += `---\n\n## Detailed Use Cases\n\n`;
    filtered.forEach((uc, i) => {
      content += `### ${i + 1}. ${uc.title}\n`;
      content += `**Domain:** ${uc.domain} | **Priority:** ${uc.priority} | **Effort:** ${uc.effort} | **Impact:** ${uc.impact}\n\n`;
      content += `${uc.description}\n\n`;
      content += `**Claude Features:** ${uc.claudeFeatures?.join(', ')}\n\n`;
      content += `**Skills Required:** ${uc.skillsPrescription?.skills?.join(', ')}\n`;
      content += `**MCP Connectors:** ${uc.skillsPrescription?.mcpConnectors?.join(', ') || 'None required'}\n`;
      content += `**Setup Notes:** ${uc.skillsPrescription?.setupNotes}\n\n`;
      content += `**ROI Estimate:** $${uc.roiEstimate?.costReductionPerMonth}/mo | ${uc.roiEstimate?.hoursSavedPerWeek} hrs/week saved | Time to value: ${uc.roiEstimate?.timeToValue}\n\n`;
      content += `**Risks:** ${uc.risks}\n\n---\n\n`;
    });
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI-Implementation-Proposal-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDomainColor = (domain) => {
    const colors = { implementation: 'bg-blue-100 text-blue-800', prompts: 'bg-purple-100 text-purple-800', governance: 'bg-amber-100 text-amber-800', training: 'bg-emerald-100 text-emerald-800' };
    return colors[domain] || 'bg-gray-100 text-gray-800';
  };

  const filteredUseCases = results?.useCases?.filter(uc => filters.domain === 'all' || uc.domain === filters.domain) || [];
  const shadowScore = calculateShadowAIScore();
  const shadowTier = shadowScore ? getShadowAITier(shadowScore) : null;
  const roi = calculateTotalROI();

  const toggleCardExpand = (i) => setExpandedCards(prev => ({ ...prev, [i]: !prev[i] }));

  const renderSkillsPrescription = (uc, i) => {
    const sp = uc.skillsPrescription;
    if (!sp) return null;
    return (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <button onClick={() => toggleCardExpand(i)} className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800">
          <Settings className="w-4 h-4" /> Skills & Setup {expandedCards[i] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedCards[i] && (
          <div className="mt-2 text-sm space-y-2">
            <div><span className="font-medium text-gray-700">Skills:</span> <span className="text-gray-600">{sp.skills?.join(', ')}</span></div>
            {sp.mcpConnectors?.length > 0 && <div><span className="font-medium text-gray-700">MCP:</span> <span className="text-gray-600">{sp.mcpConnectors.join(', ')}</span></div>}
            <div className="bg-gray-50 rounded p-2 text-xs text-gray-600">{sp.setupNotes}</div>
            {audienceTier === 'ai' && sp.implementationSnippet && (
              <pre className="bg-gray-900 text-green-400 rounded p-2 text-xs overflow-x-auto">{sp.implementationSnippet}</pre>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredUseCases.map((uc, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              {uc.trending && <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1"><TrendingUp className="w-3 h-3" />Trending</span>}
              <span className={`text-xs px-2 py-1 rounded-full ${getDomainColor(uc.domain)}`}>{uc.domain}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${uc.priority === 'High' ? 'bg-red-100 text-red-700' : uc.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{uc.priority}</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">{uc.title}</h4>
          <p className="text-sm text-gray-600 mb-3">{uc.description}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {uc.claudeFeatures?.slice(0, 3).map((f, j) => <span key={j} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded">{f}</span>)}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 rounded-lg p-2 mb-2">
            <div className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-green-600" /><span className="font-medium">${uc.roiEstimate?.costReductionPerMonth?.toLocaleString()}/mo</span></div>
            <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-blue-600" /><span className="font-medium">{uc.roiEstimate?.hoursSavedPerWeek}h/week</span></div>
          </div>
          {renderSkillsPrescription(uc, i)}
        </div>
      ))}
    </div>
  );

  const renderRoadmap = () => {
    const phases = ['Quick Win (<1 week)', 'Short-term (1-4 weeks)', 'Medium-term (1-3 months)', 'Long-term (3+ months)'];
    return (
      <div className="space-y-6">
        {phases.map((phase, pi) => {
          const items = filteredUseCases.filter(uc => uc.timeframe === phase);
          if (!items.length) return null;
          return (
            <div key={pi}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">{pi + 1}</div>
                <h4 className="font-semibold text-gray-900">{phase}</h4>
                <span className="text-sm text-gray-500">({items.length})</span>
              </div>
              <div className="ml-4 pl-6 border-l-2 border-indigo-200 space-y-2">
                {items.map((uc, i) => (
                  <div key={i} className="bg-white rounded-lg border p-3 flex items-center gap-3">
                    <ChevronRight className="w-4 h-4 text-indigo-500" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{uc.title}</div>
                      <div className="text-xs text-gray-500">${uc.roiEstimate?.costReductionPerMonth}/mo • {uc.roiEstimate?.hoursSavedPerWeek}h saved</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${getDomainColor(uc.domain)}`}>{uc.domain}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMatrix = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="bg-gray-50">
          <th className="text-left p-3">Use Case</th>
          <th className="text-center p-3">Priority</th>
          <th className="text-center p-3">Effort</th>
          <th className="text-center p-3">Impact</th>
          <th className="text-right p-3">$/Month</th>
          <th className="text-right p-3">Hrs/Wk</th>
          <th className="text-left p-3">Risk</th>
        </tr></thead>
        <tbody>
          {filteredUseCases.map((uc, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="p-3 font-medium">{uc.trending && <TrendingUp className="w-3 h-3 text-orange-500 inline mr-1" />}{uc.title}</td>
              <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded text-xs ${uc.priority === 'High' ? 'bg-red-100 text-red-700' : uc.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{uc.priority}</span></td>
              <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded text-xs ${uc.effort === 'Low' ? 'bg-green-100 text-green-700' : uc.effort === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{uc.effort}</span></td>
              <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded text-xs ${uc.impact === 'High' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{uc.impact}</span></td>
              <td className="p-3 text-right font-medium text-green-700">${uc.roiEstimate?.costReductionPerMonth?.toLocaleString()}</td>
              <td className="p-3 text-right">{uc.roiEstimate?.hoursSavedPerWeek}</td>
              <td className="p-3 text-xs text-gray-500 max-w-32 truncate">{uc.risks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderHybrid = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
        <h4 className="font-semibold text-gray-900 mb-3">Priority Quadrant</h4>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div></div><div className="text-center font-medium text-gray-600">Low Effort</div><div className="text-center font-medium text-gray-600">High Effort</div>
          <div className="text-right pr-2 font-medium text-gray-600">High Impact</div>
          <div className="bg-green-100 rounded p-2 min-h-12">{filteredUseCases.filter(u => u.impact === 'High' && u.effort === 'Low').map((u, i) => <div key={i}>✅ {u.title}</div>)}</div>
          <div className="bg-yellow-100 rounded p-2 min-h-12">{filteredUseCases.filter(u => u.impact === 'High' && u.effort === 'High').map((u, i) => <div key={i}>🎯 {u.title}</div>)}</div>
          <div className="text-right pr-2 font-medium text-gray-600">Low Impact</div>
          <div className="bg-blue-100 rounded p-2 min-h-12">{filteredUseCases.filter(u => u.impact !== 'High' && u.effort === 'Low').map((u, i) => <div key={i}>💡 {u.title}</div>)}</div>
          <div className="bg-gray-100 rounded p-2 min-h-12">{filteredUseCases.filter(u => u.impact !== 'High' && u.effort === 'High').map((u, i) => <div key={i}>⏸️ {u.title}</div>)}</div>
        </div>
      </div>
      {renderCards()}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-3">
            <Sparkles className="w-4 h-4" /> EPB Platform
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Anthropic Use Case Discovery</h1>
          <p className="text-gray-600 text-sm">Trending, best-practice Claude implementations tailored to your context</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select value={filters.role} onChange={e => setFilters({...filters, role: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm">
                <option value="">Select...</option>
                {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry *</label>
              <select value={filters.industry} onChange={e => setFilters({...filters, industry: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm">
                <option value="">Select...</option>
                {industries.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Size *</label>
              <select value={filters.maturity} onChange={e => setFilters({...filters, maturity: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm">
                <option value="">Select...</option>
                {maturities.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {domains.map(d => (
              <button key={d.value} onClick={() => setFilters({...filters, domain: d.value})} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filters.domain === d.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <d.icon className="w-3 h-3" />{d.label}
              </button>
            ))}
          </div>

          <button onClick={() => setShowShadowAI(!showShadowAI)} className="flex items-center gap-2 text-sm font-medium text-amber-700 bg-amber-50 px-3 py-2 rounded-lg hover:bg-amber-100 mb-4">
            <Shield className="w-4 h-4" /> Shadow AI Risk Assessment {showShadowAI ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showShadowAI && (
            <div className="bg-amber-50 rounded-lg p-4 mb-4 border border-amber-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Data Sensitivity</label>
                  <select value={shadowAI.dataSensitivity} onChange={e => setShadowAI({...shadowAI, dataSensitivity: e.target.value})} className="w-full px-2 py-1.5 border rounded text-sm">
                    <option value="">Select...</option>
                    {dataSensitivities.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">AI Policy Status</label>
                  <select value={shadowAI.policyStatus} onChange={e => setShadowAI({...shadowAI, policyStatus: e.target.value})} className="w-full px-2 py-1.5 border rounded text-sm">
                    <option value="">Select...</option>
                    {policyStatuses.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">AI-Enabled Employees</label>
                  <select value={shadowAI.aiEnabledEmployees} onChange={e => setShadowAI({...shadowAI, aiEnabledEmployees: e.target.value})} className="w-full px-2 py-1.5 border rounded text-sm">
                    <option value="">Select...</option>
                    {aiEmployeeCounts.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                  </select>
                </div>
              </div>
              {shadowScore && (
                <div className="mt-3 flex items-center gap-3">
                  <div className={`${shadowTier.bg} text-white px-3 py-1 rounded-full text-sm font-bold`}>{shadowScore}/100</div>
                  <div>
                    <div className="font-medium text-gray-900">{shadowTier.tier} Risk</div>
                    <div className="text-xs text-gray-600">{shadowTier.desc}</div>
                  </div>
                  {shadowScore >= 50 && (
                    <a href="#" className="ml-auto text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Learn about InVelo SafeStart
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-3 border-t">
            <div className="flex gap-1">
              {outputFormats.map(f => (
                <button key={f.value} onClick={() => setOutputFormat(f.value)} className={`p-2 rounded transition-all ${outputFormat === f.value ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:text-gray-600'}`} title={f.label}>
                  <f.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <div className="flex gap-1 border-l pl-4">
              {audienceTiers.map(t => (
                <button key={t.value} onClick={() => setAudienceTier(t.value)} className={`px-2 py-1 rounded text-xs transition-all ${audienceTier === t.value ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-500 hover:text-gray-700'}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={generateUseCases} disabled={loading} className="ml-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 flex items-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Discovering...</> : <><Sparkles className="w-4 h-4" /> Discover</>}
            </button>
          </div>
          {error && <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}
        </div>

        {results && (
          <div className="space-y-4" ref={resultsRef}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white md:col-span-2">
                <Target className="w-5 h-5 mb-2 opacity-80" />
                <p className="text-sm text-indigo-100">{results.contextSummary}</p>
              </div>
              {roi && (
                <>
                  <div className="bg-white rounded-xl border p-4">
                    <div className="text-xs text-gray-500 mb-1">Monthly Savings (High Priority)</div>
                    <div className="text-2xl font-bold text-green-600">${roi.totalMonthlySavings.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">${roi.annualProjection.toLocaleString()}/year</div>
                  </div>
                  <div className="bg-white rounded-xl border p-4">
                    <div className="text-xs text-gray-500 mb-1">Hours Saved Weekly</div>
                    <div className="text-2xl font-bold text-blue-600">{roi.totalWeeklyHours}h</div>
                    <div className="text-xs text-gray-400">{Math.round(roi.totalWeeklyHours * 52)} hours/year</div>
                  </div>
                </>
              )}
            </div>

            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{filteredUseCases.length} Use Cases</h3>
                <button onClick={exportProposal} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  <Download className="w-4 h-4" /> Export Proposal
                </button>
              </div>
              {outputFormat === 'cards' && renderCards()}
              {outputFormat === 'roadmap' && renderRoadmap()}
              {outputFormat === 'matrix' && renderMatrix()}
              {outputFormat === 'hybrid' && renderHybrid()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EPBUseCaseDiscovery;