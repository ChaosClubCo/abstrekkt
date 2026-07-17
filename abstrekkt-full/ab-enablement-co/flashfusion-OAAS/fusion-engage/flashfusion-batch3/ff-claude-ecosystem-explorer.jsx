import { useState, useMemo, useEffect } from "react";

const handleKeyActivate = (fn) => (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); }
};

const focusRing = {
  outline: "2px solid #A855F7",
  outlineOffset: "2px",
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

const ecosystemData = {
  "Claude.ai": {
    icon: "💬",
    color: "#A855F7",
    description: "Consumer & team platform for chat, creation, and collaboration",
    audience: ["all"],
    features: [
      { name: "Chat Interface", desc: "Multi-turn conversations with model selection (Opus 4.7, Opus 4.6, Sonnet 4.6, Haiku 4.5)", audience: "all", tier: "Free+" },
      { name: "Web Search", desc: "Real-time search with cited sources. Deep Research mode for multi-step investigation.", audience: "all", tier: "Free+" },
      { name: "Artifacts", desc: "Side-by-side interactive panel for code, docs, diagrams, visualizations, and apps. Persistent storage, publish & share, remix.", audience: "all", tier: "Free+" },
      { name: "Projects", desc: "Organize conversations with custom instructions and pinned knowledge files. Separate memory per project.", audience: "power", tier: "Pro+" },
      { name: "Memory", desc: "Claude remembers preferences and context across conversations. User-editable via Settings.", audience: "all", tier: "Pro+" },
      { name: "Styles", desc: "Customize Claude's writing voice — presets or custom instructions for brand voice, tone, formality.", audience: "all", tier: "Free+" },
      { name: "File Handling", desc: "Upload images, PDFs, CSVs, code. Create Word, PowerPoint, Excel, PDF files directly.", audience: "all", tier: "Free+" },
      { name: "Voice", desc: "Spoken conversation mode on mobile with transcript. Hands-free workflows.", audience: "all", tier: "Free+" },
      { name: "Connectors (MCP)", desc: "50+ one-click integrations: Notion, Drive, Slack, GitHub, Jira, Salesforce, Stripe, and more. Custom MCP server URLs.", audience: "power", tier: "Pro+" },
      { name: "Keyboard Shortcuts", desc: "Cmd/Ctrl+K (search), Cmd/Ctrl+J (new chat), Cmd/Ctrl+Enter (send), Escape (close panels).", audience: "power", tier: "Free+" },
    ]
  },
  "Claude API": {
    icon: "⚡",
    color: "#EC4899",
    description: "Developer platform for building AI-powered applications",
    audience: ["developer", "enterprise"],
    features: [
      { name: "Messages API", desc: "Core endpoint for text, images, PDFs, tool use, structured output. Streaming via SSE.", audience: "developer", tier: "API" },
      { name: "Models", desc: "Opus 4.7 (flagship, new tokenizer), Opus 4.6, Sonnet 4.6 (balanced), Haiku 4.5 (fastest). 200K–1M context.", audience: "developer", tier: "API" },
      { name: "Tool Use", desc: "JSON Schema function calling. Sequential, parallel, nested chains. Built-in: web search, code exec, computer use.", audience: "developer", tier: "API" },
      { name: "Prompt Caching", desc: "Cache static content across calls. 5-min (1.25× input) or 1-hr (2× input) TTL. Hits at 90% discount.", audience: "developer", tier: "API" },
      { name: "Batch Processing", desc: "Async bulk requests at 50% cost reduction. Ideal for data processing, evals, bulk generation.", audience: "developer", tier: "API" },
      { name: "Structured Outputs", desc: "Force JSON schema compliance. Guaranteed format for API integrations and data extraction.", audience: "developer", tier: "API" },
      { name: "Vision & Multimodal", desc: "Image analysis, native PDF understanding, multi-image input. Charts, screenshots, handwriting. Opus 4.7 supports 2576px / 3.75MP.", audience: "developer", tier: "API" },
      { name: "Extended Thinking", desc: "Configurable thinking budgets for deeper reasoning. Transparent chain-of-thought. Billed as output tokens.", audience: "developer", tier: "API" },
      { name: "Citations", desc: "Character-level source references from provided documents. RAG, compliance, and research applications.", audience: "developer", tier: "API" },
      { name: "SDKs", desc: "Python (anthropic) and TypeScript (@anthropic-ai/sdk). Full feature support including streaming and tools.", audience: "developer", tier: "API" },
      { name: "Agent SDK", desc: "Framework for building production AI agents with orchestration, tool use, and multi-step reasoning.", audience: "developer", tier: "API" },
      { name: "Managed Agents", desc: "Anthropic-hosted agent runtime. $0.08/session-hour + standard token costs. Handles orchestration, persistence, tool execution.", audience: "developer", tier: "API" },
      { name: "Files API", desc: "Upload files for reuse across multiple API calls. Persistent references without re-uploading.", audience: "developer", tier: "API" },
      { name: "Admin API", desc: "Usage tracking, cost analytics, org management, Claude Code analytics. Programmatic administration.", audience: "enterprise", tier: "API" },
    ]
  },
  "Claude Code": {
    icon: "🖥️",
    color: "#22D3EE",
    description: "Terminal-native AI coding agent for professional development workflows",
    audience: ["developer"],
    features: [
      { name: "Codebase Understanding", desc: "Indexes and reasons about entire project structure, dependencies, and patterns across files.", audience: "developer", tier: "Pro+" },
      { name: "Multi-Session GUI (Desktop)", desc: "Parallel sessions in Claude Desktop. Each isolated via git worktrees. Local + remote + SSH.", audience: "developer", tier: "Pro+" },
      { name: "PR Workflows", desc: "Create branches, commits, PRs. CI monitoring with auto-fix and auto-merge. GitHub CLI integration.", audience: "developer", tier: "Pro+" },
      { name: "CLAUDE.md Config", desc: "Project-level instructions file — persistent system prompt for the codebase. Global + project scopes.", audience: "developer", tier: "Pro+" },
      { name: "Skills & Plugins", desc: "SKILL.md packages for reusable knowledge. Plugin marketplace. Community-shared capabilities.", audience: "developer", tier: "Pro+" },
      { name: "Slash Commands", desc: "Built-in (/fix, /test, /doc) and custom commands. Team-standardized automation workflows.", audience: "developer", tier: "Pro+" },
      { name: "Subagents & Agent Teams", desc: "Delegate specialized tasks to focused agents. Opus 4.6+ supports multi-agent parallel workflows.", audience: "developer", tier: "Pro+" },
      { name: "Hooks", desc: "Event-driven automation: PreToolUse, PostToolUse, Stop, SessionStart, UserPromptSubmit.", audience: "developer", tier: "Pro+" },
      { name: "Headless Mode", desc: "Run Claude Code programmatically. CI/CD integration, automation bots, scheduled tasks.", audience: "developer", tier: "Pro+" },
      { name: "GitHub Actions", desc: "Automated code review, issue triage, PR generation directly in GitHub workflows.", audience: "developer", tier: "Pro+" },
      { name: "VS Code & JetBrains Extensions", desc: "IDE integration with one-click session launches. Manage tasks in parallel from the editor.", audience: "developer", tier: "Pro+" },
      { name: "Enterprise Deploy", desc: "AWS Bedrock, Google Vertex AI, Azure AI Foundry, proxy/SSL config, LLM Gateway, OpenTelemetry.", audience: "enterprise", tier: "Enterprise" },
      { name: "Cowork (Desktop)", desc: "Agentic capabilities for non-developers. File management, research synthesis, document generation.", audience: "all", tier: "Pro+" },
      { name: "Fast Mode", desc: "Up to 6× faster Opus output. Research preview. Same intelligence, faster inference.", audience: "developer", tier: "API/Max" },
    ]
  },
  "MCP (Model Context Protocol)": {
    icon: "🔌",
    color: "#8B5CF6",
    description: "Open standard connecting AI to external tools and data — 'USB-C for AI'",
    audience: ["developer", "power"],
    features: [
      { name: "Architecture", desc: "MCP Servers expose tools. MCP Clients (Claude) connect. SSE-based transport with async support. Open standard by Anthropic.", audience: "developer", tier: "Pro+" },
      { name: "Connectors Directory", desc: "50+ pre-built: Notion, Slack, GitHub, Jira, Salesforce, Stripe, HubSpot, Figma, Zapier, Linear, and more.", audience: "power", tier: "Pro+" },
      { name: "Custom MCP Servers", desc: "Build with Python (FastMCP) or Node/TypeScript (MCP SDK). Define tools, handle auth (OAuth 2.0), deploy anywhere.", audience: "developer", tier: "Pro+" },
      { name: "API Integration", desc: "Pass mcp_servers parameter in API calls. Artifacts can connect to services. Full programmatic access.", audience: "developer", tier: "API" },
      { name: "Desktop Extensions", desc: ".mcpb packages for one-click installation. Built-in Node.js runtime. No manual config needed.", audience: "power", tier: "Pro+" },
      { name: "Claude in Chrome", desc: "Browser automation connector. Navigate, click, fill forms, read console logs from Claude Desktop.", audience: "power", tier: "Max" },
    ]
  },
  "Prompting & Best Practices": {
    icon: "📝",
    color: "#A855F7",
    description: "Techniques for getting the best results from Claude across all surfaces",
    audience: ["all"],
    features: [
      { name: "XML Structure", desc: "Use tags like <instructions>, <context>, <examples> to organize complex prompts. Claude follows these precisely.", audience: "all", tier: "Free+" },
      { name: "System Prompts", desc: "Set Claude's role, constraints, and behavior. Persistent via Projects or API system parameter.", audience: "power", tier: "Free+" },
      { name: "Multishot Examples", desc: "Provide input/output pairs to demonstrate desired behavior. More examples = more consistent output.", audience: "all", tier: "Free+" },
      { name: "Extended Thinking", desc: "Toggle for complex reasoning. Set thinking budgets. Shows transparent chain-of-thought.", audience: "developer", tier: "Pro+" },
      { name: "Prompt Chaining", desc: "Break complex workflows into sequential prompts. Each step's output feeds the next.", audience: "power", tier: "Free+" },
      { name: "Prefilling", desc: "Start Claude's response with specific text to guide format, language, or structure.", audience: "developer", tier: "API" },
    ]
  },
  "Enterprise & Security": {
    icon: "🔒",
    color: "#EC4899",
    description: "Compliance, deployment, and administration for organizations",
    audience: ["enterprise"],
    features: [
      { name: "SSO/SAML", desc: "Single sign-on with SAML 2.0. Domain capture. Centralized authentication.", audience: "enterprise", tier: "Enterprise" },
      { name: "SCIM Provisioning", desc: "Automated user provisioning and deprovisioning. Sync with identity providers.", audience: "enterprise", tier: "Enterprise" },
      { name: "Admin Console", desc: "Manage users, connectors, desktop extensions, usage analytics. Organization-wide controls.", audience: "enterprise", tier: "Team+" },
      { name: "Data Retention", desc: "Configurable retention policies. No training on API/Enterprise data. SOC 2 Type II certified.", audience: "enterprise", tier: "Enterprise" },
      { name: "Deployment Options", desc: "Direct API, AWS Bedrock, Google Vertex AI, Azure AI Foundry. US-only inference available.", audience: "enterprise", tier: "API/Enterprise" },
      { name: "Enterprise Analytics API", desc: "Programmatic access to usage and engagement data for Claude and Claude Code Remote.", audience: "enterprise", tier: "Enterprise" },
      { name: "Self-Serve Enterprise", desc: "Purchase Enterprise plan directly — no sales conversation required. Single seat type with full access.", audience: "enterprise", tier: "Enterprise" },
    ]
  }
};

const audienceLabels = {
  all: { label: "Everyone", color: "#22D3EE", bg: "rgba(34,211,238,0.08)" },
  power: { label: "Power User", color: "#A855F7", bg: "rgba(168,85,247,0.08)" },
  developer: { label: "Developer", color: "#EC4899", bg: "rgba(236,72,153,0.08)" },
  enterprise: { label: "Enterprise", color: "#8B5CF6", bg: "rgba(139,92,246,0.08)" }
};

const tierColors = {
  "Free+": { bg: "rgba(255,255,255,0.06)", text: "#C7C7D1" },
  "Pro+": { bg: "rgba(168,85,247,0.15)", text: "#A855F7" },
  "Max": { bg: "rgba(236,72,153,0.15)", text: "#EC4899" },
  "API": { bg: "rgba(34,211,238,0.15)", text: "#22D3EE" },
  "API/Max": { bg: "rgba(34,211,238,0.15)", text: "#22D3EE" },
  "Team+": { bg: "rgba(168,85,247,0.15)", text: "#A855F7" },
  "Enterprise": { bg: "rgba(139,92,246,0.15)", text: "#8B5CF6" },
  "API/Enterprise": { bg: "rgba(139,92,246,0.15)", text: "#8B5CF6" },
};

export default function EcosystemExplorer() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [expandedFeature, setExpandedFeature] = useState(null);
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? "none" : "all 0.2s";

  const categories = Object.keys(ecosystemData);

  const filteredFeatures = useMemo(() => {
    if (!selectedCategory) return [];
    const cat = ecosystemData[selectedCategory];
    return cat.features.filter(f => {
      const matchesSearch = !search || 
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.desc.toLowerCase().includes(search.toLowerCase());
      const matchesAudience = audienceFilter === "all" || f.audience === "all" || f.audience === audienceFilter;
      return matchesSearch && matchesAudience;
    });
  }, [selectedCategory, search, audienceFilter]);

  const totalFeatures = Object.values(ecosystemData).reduce((sum, cat) => sum + cat.features.length, 0);

  return (
    <div style={{ 
      fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
      background: "#0B0B14",
      minHeight: "100vh",
      color: "#fff",
      padding: "24px"
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ 
            fontSize: 28, 
            fontWeight: 700, 
            margin: 0,
            letterSpacing: "-0.5px",
            background: "linear-gradient(135deg, #A855F7 0%, #EC4899 55%, #22D3EE 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Claude Ecosystem Explorer
          </h1>
          <p style={{ color: "#8A8A96", fontSize: 14, marginTop: 6 }}>
            {totalFeatures} features across {categories.length} product surfaces — tap to explore
          </p>
          <div style={{ fontSize: 11, color: "#7E7E8A", marginTop: 4, fontFamily: "'Geist Mono', monospace" }}>
            FlashFusion · Claude Ecosystem Intelligence
          </div>
        </div>

        {/* Filters */}
        <div style={{ 
          display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", justifyContent: "center" 
        }}>
          <input
            type="text"
            placeholder="Search features..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid rgba(139,92,246,0.12)",
              background: "#13131F",
              color: "#fff",
              fontSize: 14,
              width: 220,
              outline: "none",
              fontFamily: "'Geist', sans-serif"
            }}
          />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.entries(audienceLabels).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setAudienceFilter(key)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: audienceFilter === key ? `2px solid ${val.color}` : "1px solid rgba(139,92,246,0.12)",
                  background: audienceFilter === key ? val.bg : "#13131F",
                  color: audienceFilter === key ? val.color : "#8A8A96",
                  fontSize: 13,
                  fontWeight: audienceFilter === key ? 600 : 400,
                  cursor: "pointer",
                  transition: transition,
                  fontFamily: "'Geist', sans-serif"
                }}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Cards */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", 
          gap: 12,
          marginBottom: 28
        }}>
          {categories.map(cat => {
            const data = ecosystemData[cat];
            const isSelected = selectedCategory === cat;
            const matchCount = data.features.filter(f => {
              const ms = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.desc.toLowerCase().includes(search.toLowerCase());
              const ma = audienceFilter === "all" || f.audience === "all" || f.audience === audienceFilter;
              return ms && ma;
            }).length;
            return (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(isSelected ? null : cat); setExpandedFeature(null); }}
                style={{
                  padding: "16px 12px",
                  borderRadius: 10,
                  border: isSelected ? `2px solid ${data.color}` : "1px solid rgba(139,92,246,0.12)",
                  background: isSelected 
                    ? `rgba(${data.color === "#A855F7" ? "168,85,247" : data.color === "#EC4899" ? "236,72,153" : data.color === "#22D3EE" ? "34,211,238" : "139,92,246"},0.1)` 
                    : "rgba(19,19,31,0.8)",
                  backdropFilter: "blur(12px)",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: transition,
                  transform: isSelected ? "scale(1.02)" : "scale(1)",
                  fontFamily: "'Geist', sans-serif"
                }}
              >
                <div style={{ fontSize: 28 }}>{data.icon}</div>
                <div style={{ 
                  fontSize: 13, fontWeight: 600, 
                  color: isSelected ? data.color : "#C7C7D1",
                  marginTop: 6
                }}>{cat}</div>
                <div style={{ fontSize: 11, color: "#7E7E8A", marginTop: 4 }}>
                  {matchCount} feature{matchCount !== 1 ? "s" : ""}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feature List */}
        {selectedCategory && (
          <div style={{
            background: "rgba(19,19,31,0.8)",
            backdropFilter: "blur(12px)",
            borderRadius: 12,
            border: `1px solid ${ecosystemData[selectedCategory].color}33`,
            overflow: "hidden"
          }}>
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(139,92,246,0.12)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <span style={{ fontSize: 20, marginRight: 10 }}>{ecosystemData[selectedCategory].icon}</span>
                <span style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>{selectedCategory}</span>
                <p style={{ color: "#8A8A96", fontSize: 13, margin: "4px 0 0 0" }}>
                  {ecosystemData[selectedCategory].description}
                </p>
              </div>
              <span style={{ 
                background: `${ecosystemData[selectedCategory].color}1A`,
                color: ecosystemData[selectedCategory].color,
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600
              }}>
                {filteredFeatures.length} features
              </span>
            </div>
            
            {filteredFeatures.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#7E7E8A" }}>
                No features match your current filters
              </div>
            ) : (
              <div>
                {filteredFeatures.map((f, i) => {
                  const isExpanded = expandedFeature === f.name;
                  const aud = audienceLabels[f.audience];
                  const tier = tierColors[f.tier] || tierColors["Free+"];
                  return (
                    <div
                      key={f.name}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      aria-label={`${f.name} — ${f.tier} — ${aud.label}`}
                      onClick={() => setExpandedFeature(isExpanded ? null : f.name)}
                      onKeyDown={handleKeyActivate(() => setExpandedFeature(isExpanded ? null : f.name))}
                      style={{
                        padding: "16px 20px",
                        borderBottom: i < filteredFeatures.length - 1 ? "1px solid rgba(139,92,246,0.08)" : "none",
                        cursor: "pointer",
                        transition: prefersReducedMotion ? "none" : "background 0.15s",
                        background: isExpanded ? "rgba(139,92,246,0.06)" : "transparent",
                      }}
                      onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = "rgba(139,92,246,0.04)"; }}
                      onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = "transparent"; }}
                      onFocus={e => { Object.assign(e.currentTarget.style, focusRing); }}
                      onBlur={e => { e.currentTarget.style.outline = "none"; }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#C7C7D1" }}>{f.name}</span>
                          <span style={{
                            fontSize: 10, padding: "2px 8px", borderRadius: 4,
                            background: tier.bg, color: tier.text, fontWeight: 600, whiteSpace: "nowrap",
                            fontFamily: "'Geist Mono', monospace"
                          }}>{f.tier}</span>
                          <span style={{
                            fontSize: 10, padding: "2px 8px", borderRadius: 4,
                            background: aud.bg, color: aud.color, fontWeight: 500, whiteSpace: "nowrap"
                          }}>{aud.label}</span>
                        </div>
                        <span style={{ color: "#7E7E8A", fontSize: 12, transition: prefersReducedMotion ? "none" : "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                      </div>
                      {isExpanded && (
                        <div style={{ marginTop: 10 }}>
                          <p style={{ color: "#8A8A96", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                          <p style={{ margin: "8px 0 0", fontSize: 11, fontFamily: "'Geist Mono', monospace" }}>
                            <span style={{ color: "#A855F7" }}>→</span>
                            <span style={{ color: "#7E7E8A", marginLeft: 4 }}>
                              {f.tier === "API" || f.tier === "API/Max" || f.tier === "API/Enterprise" 
                                ? "platform.claude.com/docs" 
                                : f.audience === "developer" 
                                  ? "code.claude.com/docs" 
                                  : "support.claude.com"}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Quick Reference Strip */}
        {!selectedCategory && (
          <div style={{
            marginTop: 8,
            padding: "16px 24px",
            background: "rgba(19,19,31,0.8)",
            backdropFilter: "blur(12px)",
            borderRadius: 12,
            border: "1px solid rgba(139,92,246,0.12)",
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "baseline"
          }}>
            {[
              { label: "Plans", value: "Free · Pro $20 · Max $100–200 · Team $25–150/seat · Enterprise" },
              { label: "Models", value: "Opus 4.7 · 4.6 · Sonnet 4.6 · Haiku 4.5" },
              { label: "Context", value: "200K → 1M flat rate" },
              { label: "API", value: "$1–$5/MTok input · $5–$25 output" },
            ].map((stat, i, arr) => (
              <div key={stat.label} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#A855F7", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "'Geist Mono', monospace", fontWeight: 600 }}>{stat.label}</span>
                <span style={{ fontSize: 13, color: "#C7C7D1" }}>{stat.value}</span>
                {i < arr.length - 1 && <span style={{ color: "rgba(139,92,246,0.2)", marginLeft: 16, fontSize: 16 }}>│</span>}
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#7E7E8A", fontFamily: "'Geist Mono', monospace" }}>
          FlashFusion · Claude Ecosystem Intelligence · Updated May 2026 · Verified against docs.claude.com
        </div>
      </div>
    </div>
  );
}
