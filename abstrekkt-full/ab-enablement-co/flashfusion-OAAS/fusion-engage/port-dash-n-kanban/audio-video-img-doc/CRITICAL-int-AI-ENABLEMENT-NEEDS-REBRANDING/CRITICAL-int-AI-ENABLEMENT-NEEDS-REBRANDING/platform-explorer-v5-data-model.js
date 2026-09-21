/**
 * INT Platform Explorer v5.0 - Complete Data Model
 * 49 Platforms | 12 Categories | MCP-Native Architecture
 * 
 * @version 5.0.0
 * @author INT Inc. AI Strategy Team
 * @updated 2025-12-18
 * 
 * NEW COLUMNS (v5.0):
 * - mcp_support: MCP compatibility (yes/partial/roadmap/no)
 * - mcp_server_count: Number of available MCP servers
 * - agentic_level: Autonomy classification (L1-L5)
 * - compliance_ready: Pre-certified frameworks
 * - integration_complexity: Deployment difficulty (1-5)
 * - vertical_fit: Industry alignment
 * - mip_category: Buy/Build/Broker classification
 * - human_oversight: Required oversight level
 */

const PLATFORM_EXPLORER_V5 = {
  version: "5.0.0",
  updated: "2025-12-18",
  total_platforms: 49,
  total_categories: 12,
  
  // ===========================================
  // METADATA & ENUMS
  // ===========================================
  
  enums: {
    mcp_support: ["yes", "partial", "roadmap", "no"],
    agentic_levels: {
      L1: "Assisted - Human initiates, AI suggests",
      L2: "Partial - AI executes with approval",
      L3: "Conditional - AI autonomous within boundaries",
      L4: "High - AI autonomous, human monitors",
      L5: "Full - AI fully autonomous end-to-end"
    },
    integration_complexity: {
      1: "Plug & Play - Minutes to deploy",
      2: "Low - Hours with basic config",
      3: "Medium - Days with integration work",
      4: "High - Weeks with custom development",
      5: "Enterprise - Months with deep integration"
    },
    mip_categories: {
      buy: "Pre-built marketplace solution",
      build: "Custom development required",
      broker: "Resell/white-label opportunity"
    },
    priority_levels: ["CRITICAL", "HIGH", "MEDIUM", "WATCH", "EVALUATE"],
    compliance_frameworks: ["SOC2", "HIPAA", "ISO27001", "GDPR", "PCI-DSS", "FedRAMP", "HITRUST", "NIST-AI-RMF", "ISO42001"]
  },

  // ===========================================
  // CATEGORY DEFINITIONS
  // ===========================================
  
  categories: {
    ai_assistants: {
      id: "ai_assistants",
      name: "AI Assistants",
      icon: "🤖",
      description: "General-purpose AI chat and productivity assistants",
      platform_count: 4,
      msp_value: "Foundation layer for all AI adoption"
    },
    automation: {
      id: "automation",
      name: "Automation & Workflow",
      icon: "⚡",
      description: "No-code/low-code workflow automation with AI",
      platform_count: 5,
      msp_value: "Process automation, integration services"
    },
    msp_itsm: {
      id: "msp_itsm",
      name: "MSP/ITSM AI",
      icon: "🎫",
      description: "IT service management and helpdesk AI",
      platform_count: 4,
      msp_value: "Core MSP operations, ticket automation"
    },
    security_ai: {
      id: "security_ai",
      name: "Security AI",
      icon: "🛡️",
      description: "Security operations, threat detection, compliance",
      platform_count: 4,
      msp_value: "Security services, SOC operations"
    },
    development: {
      id: "development",
      name: "Development & DevOps",
      icon: "💻",
      description: "Code generation, developer productivity",
      platform_count: 4,
      msp_value: "Developer services, code modernization"
    },
    design_creative: {
      id: "design_creative",
      name: "Design & Creative",
      icon: "🎨",
      description: "Visual design, content creation, branding",
      platform_count: 3,
      msp_value: "Marketing services, brand assets"
    },
    research: {
      id: "research",
      name: "Research & Analysis",
      icon: "🔬",
      description: "Research tools, information synthesis",
      platform_count: 3,
      msp_value: "Research services, competitive intel"
    },
    agentic: {
      id: "agentic",
      name: "Agentic AI Orchestration",
      icon: "🎯",
      description: "Multi-agent systems, autonomous workflows",
      platform_count: 7,
      msp_value: "Advanced automation, MIP transformation"
    },
    productivity_knowledge: {
      id: "productivity_knowledge",
      name: "Productivity & Knowledge",
      icon: "📚",
      description: "Knowledge management, enterprise search",
      platform_count: 5,
      msp_value: "Knowledge services, documentation"
    },
    governance_grc: {
      id: "governance_grc",
      name: "AI Governance & GRC",
      icon: "📋",
      description: "Compliance automation, AI governance",
      platform_count: 5,
      msp_value: "Compliance services, audit support"
    },
    vertical_healthcare: {
      id: "vertical_healthcare",
      name: "Vertical: Healthcare",
      icon: "🏥",
      description: "Healthcare-specific AI solutions",
      platform_count: 4,
      msp_value: "Healthcare vertical, HIPAA services"
    },
    data_analytics: {
      id: "data_analytics",
      name: "Data & Analytics AI",
      icon: "📊",
      description: "Data platforms, BI, analytics",
      platform_count: 3,
      msp_value: "Data services, BI implementation"
    }
  },

  // ===========================================
  // PLATFORM DATA - ALL 49 PLATFORMS
  // ===========================================
  
  platforms: [
    
    // =========================================
    // CATEGORY 1: AI ASSISTANTS (4)
    // =========================================
    
    {
      id: "microsoft-copilot",
      name: "Microsoft 365 Copilot",
      vendor: "Microsoft",
      category: "ai_assistants",
      
      // Pricing
      pricing: {
        model: "per-user-monthly",
        price: 30,
        currency: "USD",
        billing: "annual",
        min_seats: 1,
        enterprise_discount: false, // Nov 2025 change
        notes: "Volume discounts eliminated Nov 2025"
      },
      
      // Capabilities
      capabilities: {
        chat: 10,
        code: 7,
        analysis: 9,
        content: 9,
        vision: 8,
        voice: 7,
        agents: 8,
        integrations: 10
      },
      
      // MCP & Agentic (NEW v5.0)
      mcp_support: "yes",
      mcp_server_count: 50,
      mcp_notes: "Full MCP support announced Build 2025, native across M365",
      agentic_level: "L3",
      agentic_capabilities: ["Copilot Studio agents", "Multi-agent orchestration", "Graph connectors"],
      
      // Compliance (NEW v5.0)
      compliance_ready: ["SOC2", "ISO27001", "HIPAA", "GDPR", "FedRAMP"],
      data_residency: ["US", "EU", "UK", "AU", "CA", "JP"],
      encryption: "AES-256 at rest, TLS 1.3 in transit",
      audit_logging: true,
      sso_support: ["SAML", "OIDC", "Entra ID"],
      
      // Integration (NEW v5.0)
      integration_complexity: 2,
      integration_notes: "Native M365 integration, minimal setup for existing tenants",
      api_available: true,
      sdk_available: true,
      
      // Classification (NEW v5.0)
      vertical_fit: ["All Industries"],
      mip_category: "buy",
      human_oversight: "Configurable per agent",
      
      // Metadata
      priority: "CRITICAL",
      int_verdict: "Foundation platform. Start here for M365 shops.",
      int_use_cases: [
        "Document drafting and summarization",
        "Meeting transcription and action items",
        "Email triage and response drafting",
        "Excel analysis and formula generation",
        "PowerPoint creation from briefs"
      ],
      deployment_time: "Hours to days",
      training_required: "2-4 hours end user, 8 hours admin",
      
      // Market
      market_share: 0.45,
      growth_rate: 0.65,
      enterprise_adoption: 0.78,
      
      // Links
      url: "https://www.microsoft.com/microsoft-365/copilot",
      docs_url: "https://learn.microsoft.com/copilot",
      pricing_url: "https://www.microsoft.com/microsoft-365/copilot/pricing"
    },
    
    {
      id: "claude-team",
      name: "Claude Team/Enterprise",
      vendor: "Anthropic",
      category: "ai_assistants",
      
      pricing: {
        model: "per-user-monthly",
        price: 25, // Team tier
        currency: "USD",
        billing: "monthly",
        enterprise_price: "Contact",
        notes: "Team $25/user, Enterprise custom pricing"
      },
      
      capabilities: {
        chat: 10,
        code: 9,
        analysis: 10,
        content: 10,
        vision: 9,
        voice: 6,
        agents: 9,
        integrations: 8
      },
      
      mcp_support: "yes",
      mcp_server_count: 300,
      mcp_notes: "MCP inventor. 23 official + 300+ community servers",
      agentic_level: "L4",
      agentic_capabilities: ["Claude Code", "Computer Use", "Agent SDK", "MCP orchestration"],
      
      compliance_ready: ["SOC2", "HIPAA", "GDPR"],
      data_residency: ["US", "EU"],
      encryption: "AES-256, TLS 1.3",
      audit_logging: true,
      sso_support: ["SAML", "OIDC", "Google", "Microsoft"],
      
      integration_complexity: 2,
      integration_notes: "API-first, extensive MCP ecosystem",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["All Industries"],
      mip_category: "buy",
      human_oversight: "Extended thinking transparency",
      
      priority: "CRITICAL",
      int_verdict: "Best reasoning. MCP ecosystem leader. INT's primary research tool.",
      int_use_cases: [
        "Complex research and analysis",
        "Strategy document drafting",
        "Code review and generation",
        "Multi-step reasoning tasks",
        "MCP-based automation"
      ],
      deployment_time: "Hours",
      training_required: "2-4 hours",
      
      market_share: 0.18,
      growth_rate: 0.85,
      enterprise_adoption: 0.35,
      
      url: "https://claude.ai",
      docs_url: "https://docs.anthropic.com",
      pricing_url: "https://www.anthropic.com/pricing"
    },
    
    {
      id: "chatgpt-enterprise",
      name: "ChatGPT Enterprise",
      vendor: "OpenAI",
      category: "ai_assistants",
      
      pricing: {
        model: "per-user-monthly",
        price: 60,
        currency: "USD",
        billing: "annual",
        notes: "Enterprise tier, Team tier $25/user"
      },
      
      capabilities: {
        chat: 10,
        code: 9,
        analysis: 9,
        content: 9,
        vision: 10,
        voice: 9,
        agents: 9,
        integrations: 8
      },
      
      mcp_support: "yes",
      mcp_server_count: 100,
      mcp_notes: "AAIF co-founder, MCP Apps SDK announced",
      agentic_level: "L4",
      agentic_capabilities: ["GPTs", "Assistants API", "Code Interpreter", "DALL-E"],
      
      compliance_ready: ["SOC2", "GDPR"],
      data_residency: ["US", "EU"],
      encryption: "AES-256, TLS 1.3",
      audit_logging: true,
      sso_support: ["SAML", "OIDC"],
      
      integration_complexity: 2,
      integration_notes: "Strong API, growing MCP support",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["All Industries"],
      mip_category: "buy",
      human_oversight: "Configurable",
      
      priority: "HIGH",
      int_verdict: "Market leader by adoption. Strong multimodal. Consider if not M365 shop.",
      int_use_cases: [
        "General productivity",
        "Image generation (DALL-E)",
        "Voice interactions",
        "Custom GPT deployment",
        "Data analysis"
      ],
      deployment_time: "Hours",
      training_required: "2-4 hours",
      
      market_share: 0.52,
      growth_rate: 0.45,
      enterprise_adoption: 0.42,
      
      url: "https://openai.com/enterprise",
      docs_url: "https://platform.openai.com/docs",
      pricing_url: "https://openai.com/pricing"
    },
    
    {
      id: "google-gemini",
      name: "Google Gemini for Workspace",
      vendor: "Google",
      category: "ai_assistants",
      
      pricing: {
        model: "per-user-monthly",
        price: 30,
        currency: "USD",
        billing: "annual",
        notes: "Workspace add-on, requires Workspace subscription"
      },
      
      capabilities: {
        chat: 9,
        code: 8,
        analysis: 9,
        content: 9,
        vision: 9,
        voice: 8,
        agents: 7,
        integrations: 9
      },
      
      mcp_support: "yes",
      mcp_server_count: 40,
      mcp_notes: "MCP adoption confirmed, Gemini CLI supports MCP",
      agentic_level: "L3",
      agentic_capabilities: ["Gemini in Docs/Sheets/Slides", "NotebookLM", "AI Studio"],
      
      compliance_ready: ["SOC2", "ISO27001", "HIPAA", "FedRAMP"],
      data_residency: ["US", "EU", "Global"],
      encryption: "AES-256, TLS 1.3",
      audit_logging: true,
      sso_support: ["SAML", "OIDC", "Google"],
      
      integration_complexity: 2,
      integration_notes: "Native Workspace integration",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["All Industries"],
      mip_category: "buy",
      human_oversight: "Standard",
      
      priority: "HIGH",
      int_verdict: "Strong alternative for Google Workspace shops. Competitive with M365 Copilot.",
      int_use_cases: [
        "Google Docs/Sheets AI assistance",
        "Email drafting in Gmail",
        "Meeting summaries in Meet",
        "Research with NotebookLM",
        "Code generation"
      ],
      deployment_time: "Hours",
      training_required: "2-4 hours",
      
      market_share: 0.22,
      growth_rate: 0.55,
      enterprise_adoption: 0.28,
      
      url: "https://workspace.google.com/solutions/ai/",
      docs_url: "https://ai.google.dev/docs",
      pricing_url: "https://workspace.google.com/pricing"
    },

    // =========================================
    // CATEGORY 2: AUTOMATION & WORKFLOW (5)
    // =========================================
    
    {
      id: "zapier",
      name: "Zapier",
      vendor: "Zapier",
      category: "automation",
      
      pricing: {
        model: "tiered",
        price: 19.99,
        currency: "USD",
        billing: "monthly",
        tiers: [
          { name: "Free", price: 0, tasks: 100 },
          { name: "Starter", price: 19.99, tasks: 750 },
          { name: "Professional", price: 49, tasks: 2000 },
          { name: "Team", price: 69, tasks: 2000 },
          { name: "Enterprise", price: "Contact", tasks: "Unlimited" }
        ]
      },
      
      capabilities: {
        chat: 5,
        code: 4,
        analysis: 6,
        content: 5,
        vision: 3,
        voice: 2,
        agents: 7,
        integrations: 10
      },
      
      mcp_support: "yes",
      mcp_server_count: 15,
      mcp_notes: "MCP server available, 7000+ app integrations",
      agentic_level: "L3",
      agentic_capabilities: ["AI Actions", "Chatbots", "Tables", "Interfaces"],
      
      compliance_ready: ["SOC2", "GDPR"],
      data_residency: ["US"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML"],
      
      integration_complexity: 1,
      integration_notes: "Easiest automation platform, no code required",
      api_available: true,
      sdk_available: false,
      
      vertical_fit: ["All Industries"],
      mip_category: "broker",
      human_oversight: "Approval steps available",
      
      priority: "HIGH",
      int_verdict: "Best breadth of integrations. Start here for simple automations.",
      int_use_cases: [
        "Cross-app workflow automation",
        "Lead routing and CRM updates",
        "Notification and alerting",
        "Data sync between systems",
        "AI-powered data enrichment"
      ],
      deployment_time: "Minutes to hours",
      training_required: "1-2 hours",
      
      market_share: 0.35,
      growth_rate: 0.30,
      enterprise_adoption: 0.45,
      
      url: "https://zapier.com",
      docs_url: "https://zapier.com/help",
      pricing_url: "https://zapier.com/pricing"
    },
    
    {
      id: "power-automate",
      name: "Power Automate",
      vendor: "Microsoft",
      category: "automation",
      
      pricing: {
        model: "per-user-monthly",
        price: 15,
        currency: "USD",
        billing: "monthly",
        notes: "Per user plan, per flow plans also available"
      },
      
      capabilities: {
        chat: 6,
        code: 5,
        analysis: 7,
        content: 5,
        vision: 6,
        voice: 4,
        agents: 8,
        integrations: 9
      },
      
      mcp_support: "yes",
      mcp_server_count: 30,
      mcp_notes: "Native MCP support via Copilot Studio integration",
      agentic_level: "L3",
      agentic_capabilities: ["Desktop flows", "Cloud flows", "AI Builder", "Process Mining"],
      
      compliance_ready: ["SOC2", "ISO27001", "HIPAA", "FedRAMP", "GDPR"],
      data_residency: ["US", "EU", "UK", "AU", "CA", "JP"],
      encryption: "AES-256, TLS 1.3",
      audit_logging: true,
      sso_support: ["Entra ID"],
      
      integration_complexity: 2,
      integration_notes: "Best for M365 environments, RPA capabilities",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["All Industries"],
      mip_category: "buy",
      human_oversight: "Approval workflows built-in",
      
      priority: "HIGH",
      int_verdict: "Best for M365 shops. Desktop automation (RPA) included.",
      int_use_cases: [
        "M365 workflow automation",
        "Desktop RPA processes",
        "Approval workflows",
        "AI Builder document processing",
        "Process mining and optimization"
      ],
      deployment_time: "Hours to days",
      training_required: "4-8 hours",
      
      market_share: 0.28,
      growth_rate: 0.40,
      enterprise_adoption: 0.55,
      
      url: "https://powerautomate.microsoft.com",
      docs_url: "https://learn.microsoft.com/power-automate/",
      pricing_url: "https://powerautomate.microsoft.com/pricing/"
    },
    
    {
      id: "make",
      name: "Make (Integromat)",
      vendor: "Make",
      category: "automation",
      
      pricing: {
        model: "tiered",
        price: 9,
        currency: "USD",
        billing: "monthly",
        tiers: [
          { name: "Free", price: 0, ops: 1000 },
          { name: "Core", price: 9, ops: 10000 },
          { name: "Pro", price: 16, ops: 10000 },
          { name: "Teams", price: 29, ops: 10000 },
          { name: "Enterprise", price: "Contact", ops: "Custom" }
        ]
      },
      
      capabilities: {
        chat: 4,
        code: 5,
        analysis: 6,
        content: 4,
        vision: 4,
        voice: 2,
        agents: 6,
        integrations: 9
      },
      
      mcp_support: "partial",
      mcp_server_count: 5,
      mcp_notes: "Limited MCP support, strong visual workflow builder",
      agentic_level: "L2",
      agentic_capabilities: ["Visual scenarios", "HTTP modules", "Iterators"],
      
      compliance_ready: ["SOC2", "GDPR"],
      data_residency: ["US", "EU"],
      encryption: "TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "OIDC"],
      
      integration_complexity: 2,
      integration_notes: "Best visual workflow builder, complex logic support",
      api_available: true,
      sdk_available: false,
      
      vertical_fit: ["All Industries"],
      mip_category: "broker",
      human_oversight: "Manual triggers available",
      
      priority: "MEDIUM",
      int_verdict: "Best visual builder. More complex workflows than Zapier.",
      int_use_cases: [
        "Complex multi-step automations",
        "Data transformation workflows",
        "API orchestration",
        "Conditional logic workflows",
        "Batch processing"
      ],
      deployment_time: "Hours",
      training_required: "4-8 hours",
      
      market_share: 0.12,
      growth_rate: 0.35,
      enterprise_adoption: 0.20,
      
      url: "https://www.make.com",
      docs_url: "https://www.make.com/en/help",
      pricing_url: "https://www.make.com/en/pricing"
    },
    
    {
      id: "n8n",
      name: "n8n",
      vendor: "n8n GmbH",
      category: "automation",
      
      pricing: {
        model: "hybrid",
        price: 0,
        currency: "USD",
        notes: "Self-hosted free, cloud from $20/month",
        cloud_pricing: [
          { name: "Starter", price: 20, executions: 2500 },
          { name: "Pro", price: 50, executions: 10000 },
          { name: "Enterprise", price: "Contact", executions: "Custom" }
        ]
      },
      
      capabilities: {
        chat: 5,
        code: 7,
        analysis: 6,
        content: 4,
        vision: 4,
        voice: 3,
        agents: 8,
        integrations: 8
      },
      
      mcp_support: "yes",
      mcp_server_count: 20,
      mcp_notes: "MCP server available, strong AI agent capabilities",
      agentic_level: "L4",
      agentic_capabilities: ["AI Agents", "Sub-workflows", "Custom code", "Self-hosted"],
      
      compliance_ready: ["SOC2", "GDPR"],
      data_residency: ["Self-hosted anywhere", "EU cloud"],
      encryption: "Configurable",
      audit_logging: true,
      sso_support: ["SAML", "LDAP"],
      
      integration_complexity: 3,
      integration_notes: "Self-hosted option for data sovereignty, code-friendly",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["All Industries", "Healthcare (self-hosted)"],
      mip_category: "build",
      human_oversight: "Full control self-hosted",
      
      priority: "HIGH",
      int_verdict: "Best for custom AI workflows. Self-host for HIPAA. INT's automation backbone.",
      int_use_cases: [
        "Custom AI agent workflows",
        "Self-hosted automation (HIPAA)",
        "Complex data pipelines",
        "LLM orchestration",
        "Internal tool integration"
      ],
      deployment_time: "Days (self-hosted)",
      training_required: "8-16 hours",
      
      market_share: 0.08,
      growth_rate: 0.65,
      enterprise_adoption: 0.15,
      
      url: "https://n8n.io",
      docs_url: "https://docs.n8n.io",
      pricing_url: "https://n8n.io/pricing"
    },
    
    {
      id: "uipath",
      name: "UiPath",
      vendor: "UiPath",
      category: "automation",
      
      pricing: {
        model: "enterprise",
        price: "Contact",
        currency: "USD",
        notes: "Robot licensing, per-bot pricing"
      },
      
      capabilities: {
        chat: 6,
        code: 6,
        analysis: 7,
        content: 5,
        vision: 8,
        voice: 5,
        agents: 9,
        integrations: 8
      },
      
      mcp_support: "roadmap",
      mcp_server_count: 0,
      mcp_notes: "MCP support expected, strong native automation",
      agentic_level: "L4",
      agentic_capabilities: ["RPA bots", "Document Understanding", "Process Mining", "AI Center"],
      
      compliance_ready: ["SOC2", "ISO27001", "HIPAA", "FedRAMP"],
      data_residency: ["US", "EU", "Self-hosted"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "OIDC", "AD"],
      
      integration_complexity: 4,
      integration_notes: "Enterprise RPA leader, significant implementation",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["Finance", "Healthcare", "Manufacturing", "Insurance"],
      mip_category: "broker",
      human_oversight: "Attended/unattended modes",
      
      priority: "MEDIUM",
      int_verdict: "Enterprise RPA leader. Consider for complex desktop automation needs.",
      int_use_cases: [
        "Legacy system automation",
        "Document processing at scale",
        "Complex business process automation",
        "Attended automation (human-bot)",
        "Process mining and optimization"
      ],
      deployment_time: "Weeks to months",
      training_required: "40+ hours (certification)",
      
      market_share: 0.32,
      growth_rate: 0.25,
      enterprise_adoption: 0.48,
      
      url: "https://www.uipath.com",
      docs_url: "https://docs.uipath.com",
      pricing_url: "https://www.uipath.com/pricing"
    },

    // =========================================
    // CATEGORY 3: MSP/ITSM AI (4)
    // =========================================
    
    {
      id: "freshdesk-freddy",
      name: "Freshdesk Freddy AI",
      vendor: "Freshworks",
      category: "msp_itsm",
      
      pricing: {
        model: "included",
        price: 0,
        currency: "USD",
        notes: "Included in Pro ($49/agent) and Enterprise ($79/agent) plans"
      },
      
      capabilities: {
        chat: 8,
        code: 3,
        analysis: 7,
        content: 7,
        vision: 5,
        voice: 6,
        agents: 8,
        integrations: 7
      },
      
      mcp_support: "no",
      mcp_server_count: 0,
      mcp_notes: "No MCP support, proprietary AI integration",
      agentic_level: "L3",
      agentic_capabilities: ["Auto-triage", "Self-service bots", "Agent Assist", "Thank You Detector"],
      
      compliance_ready: ["SOC2", "ISO27001", "GDPR", "HIPAA"],
      data_residency: ["US", "EU", "AU", "IN"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "OIDC"],
      
      integration_complexity: 2,
      integration_notes: "Native to Freshdesk, minimal setup",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["MSP", "IT Services", "Customer Support"],
      mip_category: "buy",
      human_oversight: "Agent handoff triggers",
      
      priority: "HIGH",
      int_verdict: "Best for SMB MSPs. Already likely INT's helpdesk. Freddy included.",
      int_use_cases: [
        "Ticket auto-triage and routing",
        "Self-service knowledge suggestions",
        "Agent response suggestions",
        "Sentiment analysis",
        "SLA prediction"
      ],
      deployment_time: "Days",
      training_required: "4-8 hours",
      
      market_share: 0.15,
      growth_rate: 0.35,
      enterprise_adoption: 0.25,
      
      url: "https://www.freshworks.com/freshdesk/",
      docs_url: "https://support.freshdesk.com",
      pricing_url: "https://www.freshworks.com/freshdesk/pricing/"
    },
    
    {
      id: "connectwise-asio",
      name: "ConnectWise Asio",
      vendor: "ConnectWise",
      category: "msp_itsm",
      
      pricing: {
        model: "contact",
        price: "Contact",
        currency: "USD",
        notes: "Add-on to ConnectWise PSA/RMM"
      },
      
      capabilities: {
        chat: 7,
        code: 4,
        analysis: 8,
        content: 6,
        vision: 5,
        voice: 5,
        agents: 8,
        integrations: 9
      },
      
      mcp_support: "no",
      mcp_server_count: 0,
      mcp_notes: "No MCP, proprietary ConnectWise ecosystem",
      agentic_level: "L3",
      agentic_capabilities: ["Predictive ticketing", "Auto-resolution", "Technician assist", "Client insights"],
      
      compliance_ready: ["SOC2"],
      data_residency: ["US", "EU", "AU"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML"],
      
      integration_complexity: 2,
      integration_notes: "Native to ConnectWise stack",
      api_available: true,
      sdk_available: false,
      
      vertical_fit: ["MSP"],
      mip_category: "buy",
      human_oversight: "Configurable thresholds",
      
      priority: "HIGH",
      int_verdict: "If on ConnectWise stack, this is your AI. Deep PSA/RMM integration.",
      int_use_cases: [
        "Ticket prediction and prevention",
        "Auto-resolution for common issues",
        "Technician knowledge assist",
        "Client health scoring",
        "Resource optimization"
      ],
      deployment_time: "Days to weeks",
      training_required: "8-16 hours",
      
      market_share: 0.22,
      growth_rate: 0.40,
      enterprise_adoption: 0.35,
      
      url: "https://www.connectwise.com/platform/unified-management/asio",
      docs_url: "https://docs.connectwise.com",
      pricing_url: "https://www.connectwise.com/company/contact"
    },
    
    {
      id: "servicenow-now-assist",
      name: "ServiceNow Now Assist",
      vendor: "ServiceNow",
      category: "msp_itsm",
      
      pricing: {
        model: "enterprise",
        price: "Contact",
        currency: "USD",
        notes: "Enterprise add-on, requires ServiceNow platform"
      },
      
      capabilities: {
        chat: 9,
        code: 6,
        analysis: 9,
        content: 8,
        vision: 6,
        voice: 7,
        agents: 9,
        integrations: 9
      },
      
      mcp_support: "roadmap",
      mcp_server_count: 0,
      mcp_notes: "MCP support expected for enterprise integration",
      agentic_level: "L4",
      agentic_capabilities: ["Virtual Agent", "Agent Assist", "Now Assist for ITSM", "Predictive Intelligence"],
      
      compliance_ready: ["SOC2", "ISO27001", "HIPAA", "FedRAMP", "HITRUST"],
      data_residency: ["US", "EU", "AU", "CA", "UK", "JP"],
      encryption: "AES-256, TLS 1.3",
      audit_logging: true,
      sso_support: ["SAML", "OIDC", "MFA"],
      
      integration_complexity: 4,
      integration_notes: "Enterprise platform, significant implementation",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["Enterprise", "Government", "Healthcare", "Finance"],
      mip_category: "broker",
      human_oversight: "Workflow-based approvals",
      
      priority: "MEDIUM",
      int_verdict: "Enterprise ITSM leader. Overkill for SMB. Consider for large clients.",
      int_use_cases: [
        "Enterprise service management",
        "AI-powered incident resolution",
        "Knowledge management",
        "Change management automation",
        "Employee service center"
      ],
      deployment_time: "Months",
      training_required: "40+ hours (certification)",
      
      market_share: 0.38,
      growth_rate: 0.30,
      enterprise_adoption: 0.62,
      
      url: "https://www.servicenow.com/products/now-platform-now-assist.html",
      docs_url: "https://docs.servicenow.com",
      pricing_url: "https://www.servicenow.com/company/contact-us.html"
    },
    
    {
      id: "kore-ai",
      name: "Kore.ai",
      vendor: "Kore.ai",
      category: "msp_itsm",
      
      pricing: {
        model: "enterprise",
        price: "Contact",
        currency: "USD",
        notes: "Session-based pricing, enterprise agreements"
      },
      
      capabilities: {
        chat: 9,
        code: 5,
        analysis: 8,
        content: 7,
        vision: 6,
        voice: 9,
        agents: 10,
        integrations: 8
      },
      
      mcp_support: "partial",
      mcp_server_count: 5,
      mcp_notes: "Emerging MCP support, strong native agent platform",
      agentic_level: "L4",
      agentic_capabilities: ["Multi-agent orchestration", "Agent marketplace", "Process automation", "Voice AI"],
      
      compliance_ready: ["SOC2", "ISO27001", "HIPAA", "GDPR"],
      data_residency: ["US", "EU", "IN"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "OIDC"],
      
      integration_complexity: 3,
      integration_notes: "Comprehensive conversational AI platform",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["Enterprise", "Banking", "Healthcare", "Retail"],
      mip_category: "buy",
      human_oversight: "Agent handoff, supervisor tools",
      
      priority: "MEDIUM",
      int_verdict: "Gartner/Forrester Leader. Strong for complex conversational AI needs.",
      int_use_cases: [
        "Enterprise virtual assistants",
        "Contact center AI",
        "IT service automation",
        "HR service delivery",
        "Multi-channel deployment"
      ],
      deployment_time: "Weeks to months",
      training_required: "16-40 hours",
      
      market_share: 0.08,
      growth_rate: 0.45,
      enterprise_adoption: 0.20,
      
      url: "https://kore.ai",
      docs_url: "https://developer.kore.ai/docs/",
      pricing_url: "https://kore.ai/pricing/"
    },

    // =========================================
    // CATEGORY 4: SECURITY AI (4)
    // =========================================
    
    {
      id: "microsoft-security-copilot",
      name: "Microsoft Security Copilot",
      vendor: "Microsoft",
      category: "security_ai",
      
      pricing: {
        model: "consumption",
        price: 4,
        currency: "USD",
        unit: "SCU/hour",
        notes: "Security Compute Units, consumption-based"
      },
      
      capabilities: {
        chat: 8,
        code: 6,
        analysis: 10,
        content: 7,
        vision: 6,
        voice: 4,
        agents: 8,
        integrations: 9
      },
      
      mcp_support: "yes",
      mcp_server_count: 25,
      mcp_notes: "MCP support for security tool integration",
      agentic_level: "L3",
      agentic_capabilities: ["Incident response", "Threat hunting", "Posture management", "Defender integration"],
      
      compliance_ready: ["SOC2", "ISO27001", "FedRAMP", "HIPAA"],
      data_residency: ["US", "EU"],
      encryption: "AES-256, TLS 1.3",
      audit_logging: true,
      sso_support: ["Entra ID"],
      
      integration_complexity: 3,
      integration_notes: "Requires Microsoft security stack for full value",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["All Industries"],
      mip_category: "buy",
      human_oversight: "Analyst-in-the-loop design",
      
      priority: "HIGH",
      int_verdict: "65T daily signals. Best for M365/Defender shops. SOC force multiplier.",
      int_use_cases: [
        "Incident investigation acceleration",
        "Threat intelligence synthesis",
        "Security posture assessment",
        "Compliance gap analysis",
        "Attack surface reduction"
      ],
      deployment_time: "Days to weeks",
      training_required: "8-16 hours",
      
      market_share: 0.18,
      growth_rate: 0.70,
      enterprise_adoption: 0.25,
      
      url: "https://www.microsoft.com/security/business/ai-machine-learning/microsoft-security-copilot",
      docs_url: "https://learn.microsoft.com/security-copilot/",
      pricing_url: "https://www.microsoft.com/security/business/ai-machine-learning/microsoft-security-copilot"
    },
    
    {
      id: "sentinelone-purple-ai",
      name: "SentinelOne Purple AI",
      vendor: "SentinelOne",
      category: "security_ai",
      
      pricing: {
        model: "per-endpoint",
        price: 179.99,
        currency: "USD",
        unit: "endpoint/year",
        notes: "Add-on to SentinelOne platform"
      },
      
      capabilities: {
        chat: 7,
        code: 5,
        analysis: 9,
        content: 6,
        vision: 5,
        voice: 3,
        agents: 9,
        integrations: 7
      },
      
      mcp_support: "no",
      mcp_server_count: 0,
      mcp_notes: "Proprietary integration, no MCP",
      agentic_level: "L4",
      agentic_capabilities: ["Autonomous threat hunting", "Auto-remediation", "SOAR integration", "Storyline visualization"],
      
      compliance_ready: ["SOC2", "ISO27001", "FedRAMP"],
      data_residency: ["US", "EU"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "OIDC"],
      
      integration_complexity: 2,
      integration_notes: "Native to SentinelOne, add-on activation",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["All Industries"],
      mip_category: "buy",
      human_oversight: "Autonomous with override",
      
      priority: "MEDIUM",
      int_verdict: "Best XDR AI. Autonomous rollback is unique. Consider if SentinelOne customer.",
      int_use_cases: [
        "Automated threat detection",
        "Incident investigation",
        "Autonomous remediation",
        "Threat hunting queries",
        "SOC analyst augmentation"
      ],
      deployment_time: "Days",
      training_required: "4-8 hours",
      
      market_share: 0.12,
      growth_rate: 0.55,
      enterprise_adoption: 0.22,
      
      url: "https://www.sentinelone.com/platform/purple-ai/",
      docs_url: "https://docs.sentinelone.com",
      pricing_url: "https://www.sentinelone.com/pricing/"
    },
    
    {
      id: "vanta",
      name: "Vanta",
      vendor: "Vanta",
      category: "security_ai",
      
      pricing: {
        model: "contact",
        price: "Contact",
        currency: "USD",
        notes: "Platform + audit fees, typically $12K+ total"
      },
      
      capabilities: {
        chat: 6,
        code: 4,
        analysis: 8,
        content: 7,
        vision: 4,
        voice: 3,
        agents: 7,
        integrations: 9
      },
      
      mcp_support: "no",
      mcp_server_count: 0,
      mcp_notes: "No MCP, 375+ native integrations",
      agentic_level: "L3",
      agentic_capabilities: ["Continuous monitoring", "Auto-evidence collection", "AI compliance agent", "Trust Center"],
      
      compliance_ready: ["SOC2", "ISO27001", "HIPAA", "GDPR", "PCI-DSS", "HITRUST"],
      data_residency: ["US"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "OIDC", "Google", "Okta"],
      
      integration_complexity: 2,
      integration_notes: "375+ integrations, automated evidence collection",
      api_available: true,
      sdk_available: false,
      
      vertical_fit: ["SaaS", "FinTech", "HealthTech", "B2B"],
      mip_category: "broker",
      human_oversight: "Auditor review required",
      
      priority: "HIGH",
      int_verdict: "Compliance automation leader. 526% ROI reported. INT should consider for client services.",
      int_use_cases: [
        "SOC 2 automation",
        "Continuous compliance monitoring",
        "Vendor risk management",
        "Security questionnaire automation",
        "Trust center publishing"
      ],
      deployment_time: "Weeks",
      training_required: "4-8 hours",
      
      market_share: 0.22,
      growth_rate: 0.60,
      enterprise_adoption: 0.30,
      
      url: "https://www.vanta.com",
      docs_url: "https://help.vanta.com",
      pricing_url: "https://www.vanta.com/pricing"
    },
    
    {
      id: "crowdstrike-charlotte",
      name: "CrowdStrike Charlotte AI",
      vendor: "CrowdStrike",
      category: "security_ai",
      
      pricing: {
        model: "per-endpoint",
        price: "Contact",
        currency: "USD",
        notes: "Add-on to Falcon platform"
      },
      
      capabilities: {
        chat: 8,
        code: 5,
        analysis: 10,
        content: 6,
        vision: 5,
        voice: 4,
        agents: 8,
        integrations: 8
      },
      
      mcp_support: "no",
      mcp_server_count: 0,
      mcp_notes: "Proprietary Falcon platform integration",
      agentic_level: "L3",
      agentic_capabilities: ["Incident summarization", "Query generation", "Threat correlation", "Remediation guidance"],
      
      compliance_ready: ["SOC2", "ISO27001", "FedRAMP", "HIPAA"],
      data_residency: ["US", "EU", "AU"],
      encryption: "AES-256, TLS 1.3",
      audit_logging: true,
      sso_support: ["SAML", "OIDC"],
      
      integration_complexity: 2,
      integration_notes: "Native to Falcon platform",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["All Industries", "Government"],
      mip_category: "buy",
      human_oversight: "Analyst-assisted",
      
      priority: "MEDIUM",
      int_verdict: "XDR leader. Charlotte AI accelerates analyst workflows. Consider if Falcon customer.",
      int_use_cases: [
        "Incident investigation",
        "Threat hunting queries",
        "Vulnerability prioritization",
        "Real-time protection",
        "Managed threat hunting"
      ],
      deployment_time: "Days",
      training_required: "8-16 hours",
      
      market_share: 0.28,
      growth_rate: 0.35,
      enterprise_adoption: 0.42,
      
      url: "https://www.crowdstrike.com/platform/charlotte-ai/",
      docs_url: "https://falcon.crowdstrike.com/documentation",
      pricing_url: "https://www.crowdstrike.com/contact-us/"
    },

    // =========================================
    // CATEGORY 5: DEVELOPMENT & DEVOPS (4)
    // =========================================
    
    {
      id: "github-copilot",
      name: "GitHub Copilot",
      vendor: "GitHub/Microsoft",
      category: "development",
      
      pricing: {
        model: "per-user-monthly",
        price: 19,
        currency: "USD",
        billing: "monthly",
        tiers: [
          { name: "Individual", price: 19 },
          { name: "Business", price: 19 },
          { name: "Enterprise", price: 39 }
        ]
      },
      
      capabilities: {
        chat: 8,
        code: 10,
        analysis: 8,
        content: 6,
        vision: 5,
        voice: 4,
        agents: 8,
        integrations: 9
      },
      
      mcp_support: "yes",
      mcp_server_count: 30,
      mcp_notes: "Full MCP support, AAIF member, AGENTS.md adoption",
      agentic_level: "L4",
      agentic_capabilities: ["Code completion", "Chat", "CLI agent", "Workspace agents", "Pull request assistance"],
      
      compliance_ready: ["SOC2", "ISO27001", "GDPR"],
      data_residency: ["US", "EU"],
      encryption: "AES-256, TLS 1.3",
      audit_logging: true,
      sso_support: ["SAML", "OIDC", "GitHub Enterprise"],
      
      integration_complexity: 1,
      integration_notes: "IDE extension, minimal setup",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["Software Development", "IT"],
      mip_category: "buy",
      human_oversight: "Developer review required",
      
      priority: "CRITICAL",
      int_verdict: "Developer AI leader. 55% productivity gain reported. Must-have for dev teams.",
      int_use_cases: [
        "Code completion and generation",
        "Code review and explanation",
        "Test generation",
        "Documentation writing",
        "Bug fixing suggestions"
      ],
      deployment_time: "Minutes to hours",
      training_required: "2-4 hours",
      
      market_share: 0.45,
      growth_rate: 0.55,
      enterprise_adoption: 0.38,
      
      url: "https://github.com/features/copilot",
      docs_url: "https://docs.github.com/copilot",
      pricing_url: "https://github.com/features/copilot/plans"
    },
    
    {
      id: "cursor",
      name: "Cursor",
      vendor: "Anysphere",
      category: "development",
      
      pricing: {
        model: "per-user-monthly",
        price: 20,
        currency: "USD",
        billing: "monthly",
        tiers: [
          { name: "Hobby", price: 0, requests: "Limited" },
          { name: "Pro", price: 20, requests: 500 },
          { name: "Business", price: 40, requests: "Unlimited" }
        ]
      },
      
      capabilities: {
        chat: 9,
        code: 10,
        analysis: 8,
        content: 6,
        vision: 6,
        voice: 4,
        agents: 9,
        integrations: 7
      },
      
      mcp_support: "yes",
      mcp_server_count: 20,
      mcp_notes: "MCP support, AGENTS.md adoption confirmed",
      agentic_level: "L4",
      agentic_capabilities: ["Composer multi-file edits", "Codebase chat", "Tab completion", "Agent mode"],
      
      compliance_ready: ["SOC2"],
      data_residency: ["US"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: false,
      sso_support: ["Google", "GitHub"],
      
      integration_complexity: 1,
      integration_notes: "Standalone IDE, VS Code fork",
      api_available: false,
      sdk_available: false,
      
      vertical_fit: ["Software Development"],
      mip_category: "buy",
      human_oversight: "Developer review",
      
      priority: "HIGH",
      int_verdict: "Rising star. Composer agent mode is powerful. Developer favorite.",
      int_use_cases: [
        "AI-first code editing",
        "Multi-file refactoring",
        "Codebase Q&A",
        "Rapid prototyping",
        "Learning new codebases"
      ],
      deployment_time: "Minutes",
      training_required: "1-2 hours",
      
      market_share: 0.08,
      growth_rate: 0.90,
      enterprise_adoption: 0.10,
      
      url: "https://cursor.com",
      docs_url: "https://docs.cursor.com",
      pricing_url: "https://cursor.com/pricing"
    },
    
    {
      id: "aws-bedrock",
      name: "Amazon Bedrock",
      vendor: "AWS",
      category: "development",
      
      pricing: {
        model: "usage",
        price: "Varies",
        currency: "USD",
        notes: "Per token/image pricing, model-dependent"
      },
      
      capabilities: {
        chat: 9,
        code: 8,
        analysis: 9,
        content: 8,
        vision: 8,
        voice: 6,
        agents: 9,
        integrations: 10
      },
      
      mcp_support: "yes",
      mcp_server_count: 15,
      mcp_notes: "MCP support via agent integrations",
      agentic_level: "L4",
      agentic_capabilities: ["Agents for Bedrock", "Knowledge Bases", "Guardrails", "Model evaluation"],
      
      compliance_ready: ["SOC2", "ISO27001", "HIPAA", "FedRAMP", "PCI-DSS", "HITRUST"],
      data_residency: ["US", "EU", "APAC", "Global"],
      encryption: "AES-256, TLS 1.3, KMS",
      audit_logging: true,
      sso_support: ["IAM", "SAML", "OIDC"],
      
      integration_complexity: 3,
      integration_notes: "AWS ecosystem integration, multi-model access",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["Enterprise", "Government", "Healthcare", "Finance"],
      mip_category: "build",
      human_oversight: "Guardrails API",
      
      priority: "HIGH",
      int_verdict: "Multi-model access. Best for AWS shops. Strong compliance posture.",
      int_use_cases: [
        "Multi-model AI applications",
        "RAG with Knowledge Bases",
        "Custom agent development",
        "AI-powered AWS integrations",
        "Compliance-first AI deployment"
      ],
      deployment_time: "Days to weeks",
      training_required: "8-16 hours",
      
      market_share: 0.15,
      growth_rate: 0.65,
      enterprise_adoption: 0.30,
      
      url: "https://aws.amazon.com/bedrock/",
      docs_url: "https://docs.aws.amazon.com/bedrock/",
      pricing_url: "https://aws.amazon.com/bedrock/pricing/"
    },
    
    {
      id: "azure-ai-foundry",
      name: "Azure AI Foundry",
      vendor: "Microsoft",
      category: "development",
      
      pricing: {
        model: "usage",
        price: "Varies",
        currency: "USD",
        notes: "Pay-per-use, model-dependent pricing"
      },
      
      capabilities: {
        chat: 9,
        code: 8,
        analysis: 9,
        content: 8,
        vision: 8,
        voice: 7,
        agents: 10,
        integrations: 10
      },
      
      mcp_support: "yes",
      mcp_server_count: 40,
      mcp_notes: "Full MCP + A2A support, Semantic Kernel integration",
      agentic_level: "L5",
      agentic_capabilities: ["Agent Service", "Multi-agent orchestration", "A2A protocol", "Semantic Kernel", "AutoGen"],
      
      compliance_ready: ["SOC2", "ISO27001", "HIPAA", "FedRAMP", "PCI-DSS"],
      data_residency: ["US", "EU", "UK", "AU", "CA", "JP", "Global"],
      encryption: "AES-256, TLS 1.3, Azure Key Vault",
      audit_logging: true,
      sso_support: ["Entra ID", "SAML", "OIDC"],
      
      integration_complexity: 3,
      integration_notes: "Microsoft ecosystem, enterprise-grade",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["Enterprise", "Government", "Healthcare", "Finance"],
      mip_category: "build",
      human_oversight: "Entra Agent ID for governance",
      
      priority: "HIGH",
      int_verdict: "Enterprise AI platform. Unified agent SDK (Semantic Kernel + AutoGen). Build 2025 momentum.",
      int_use_cases: [
        "Enterprise AI agent development",
        "Multi-agent systems",
        "Custom model deployment",
        "RAG implementations",
        "AI governance at scale"
      ],
      deployment_time: "Weeks",
      training_required: "16-40 hours",
      
      market_share: 0.22,
      growth_rate: 0.55,
      enterprise_adoption: 0.35,
      
      url: "https://azure.microsoft.com/products/ai-services/ai-studio",
      docs_url: "https://learn.microsoft.com/azure/ai-studio/",
      pricing_url: "https://azure.microsoft.com/pricing/details/cognitive-services/"
    },

    // =========================================
    // CATEGORY 6: DESIGN & CREATIVE (3)
    // =========================================
    
    {
      id: "figma-ai",
      name: "Figma AI",
      vendor: "Figma",
      category: "design_creative",
      
      pricing: {
        model: "included",
        price: 0,
        currency: "USD",
        notes: "Included in Figma Professional ($15/editor/mo) and above"
      },
      
      capabilities: {
        chat: 6,
        code: 5,
        analysis: 6,
        content: 7,
        vision: 9,
        voice: 3,
        agents: 6,
        integrations: 7
      },
      
      mcp_support: "yes",
      mcp_server_count: 5,
      mcp_notes: "MCP server available for design system access",
      agentic_level: "L2",
      agentic_capabilities: ["Visual search", "Auto-layout", "Asset generation", "Design suggestions"],
      
      compliance_ready: ["SOC2", "ISO27001", "GDPR"],
      data_residency: ["US", "EU"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "OIDC", "Google"],
      
      integration_complexity: 1,
      integration_notes: "Native to Figma, toggle-to-enable",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["Design", "Product", "Marketing"],
      mip_category: "buy",
      human_oversight: "Designer review",
      
      priority: "MEDIUM",
      int_verdict: "Design team essential. AI features accelerate design workflows.",
      int_use_cases: [
        "Design asset search",
        "Auto-layout suggestions",
        "Prototype generation",
        "Design system compliance",
        "Component suggestions"
      ],
      deployment_time: "Minutes",
      training_required: "2-4 hours",
      
      market_share: 0.55,
      growth_rate: 0.25,
      enterprise_adoption: 0.48,
      
      url: "https://www.figma.com/ai/",
      docs_url: "https://help.figma.com",
      pricing_url: "https://www.figma.com/pricing/"
    },
    
    {
      id: "canva-ai",
      name: "Canva AI (Magic Studio)",
      vendor: "Canva",
      category: "design_creative",
      
      pricing: {
        model: "included",
        price: 0,
        currency: "USD",
        notes: "Included in Pro ($13/mo) and Teams ($10/user/mo)"
      },
      
      capabilities: {
        chat: 5,
        code: 3,
        analysis: 5,
        content: 8,
        vision: 9,
        voice: 4,
        agents: 5,
        integrations: 6
      },
      
      mcp_support: "yes",
      mcp_server_count: 3,
      mcp_notes: "MCP server for design automation",
      agentic_level: "L2",
      agentic_capabilities: ["Magic Write", "Magic Design", "Magic Eraser", "Text to Image"],
      
      compliance_ready: ["SOC2", "ISO27001", "GDPR"],
      data_residency: ["US", "EU", "AU"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "Google", "Microsoft"],
      
      integration_complexity: 1,
      integration_notes: "Browser-based, no installation",
      api_available: true,
      sdk_available: false,
      
      vertical_fit: ["Marketing", "SMB", "Education"],
      mip_category: "buy",
      human_oversight: "User review",
      
      priority: "MEDIUM",
      int_verdict: "Best for non-designers. Quick social media and marketing assets.",
      int_use_cases: [
        "Social media graphics",
        "Marketing materials",
        "Presentation design",
        "Brand asset creation",
        "Quick visual content"
      ],
      deployment_time: "Minutes",
      training_required: "1-2 hours",
      
      market_share: 0.32,
      growth_rate: 0.30,
      enterprise_adoption: 0.25,
      
      url: "https://www.canva.com/magic/",
      docs_url: "https://www.canva.com/help/",
      pricing_url: "https://www.canva.com/pricing/"
    },
    
    {
      id: "adobe-firefly",
      name: "Adobe Firefly",
      vendor: "Adobe",
      category: "design_creative",
      
      pricing: {
        model: "credits",
        price: 4.99,
        currency: "USD",
        unit: "month",
        notes: "Premium $4.99/mo (100 credits), included in Creative Cloud"
      },
      
      capabilities: {
        chat: 5,
        code: 3,
        analysis: 5,
        content: 9,
        vision: 10,
        voice: 3,
        agents: 5,
        integrations: 8
      },
      
      mcp_support: "no",
      mcp_server_count: 0,
      mcp_notes: "No MCP, Adobe ecosystem integration",
      agentic_level: "L2",
      agentic_capabilities: ["Text to Image", "Generative Fill", "Text Effects", "Vector generation"],
      
      compliance_ready: ["SOC2", "ISO27001", "GDPR"],
      data_residency: ["US", "EU"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "Adobe ID"],
      
      integration_complexity: 2,
      integration_notes: "Best within Adobe CC ecosystem",
      api_available: true,
      sdk_available: false,
      
      vertical_fit: ["Design", "Marketing", "Creative Agencies"],
      mip_category: "buy",
      human_oversight: "Designer review",
      
      priority: "MEDIUM",
      int_verdict: "Best image generation for commercial use. IP-safe training data.",
      int_use_cases: [
        "Commercial image generation",
        "Photo editing with AI",
        "Vector graphic creation",
        "Brand-safe content generation",
        "Photoshop/Illustrator integration"
      ],
      deployment_time: "Minutes",
      training_required: "2-4 hours",
      
      market_share: 0.18,
      growth_rate: 0.40,
      enterprise_adoption: 0.30,
      
      url: "https://www.adobe.com/products/firefly.html",
      docs_url: "https://helpx.adobe.com/firefly/",
      pricing_url: "https://www.adobe.com/products/firefly/pricing.html"
    },

    // =========================================
    // CATEGORY 7: RESEARCH & ANALYSIS (3)
    // =========================================
    
    {
      id: "perplexity-pro",
      name: "Perplexity Pro",
      vendor: "Perplexity AI",
      category: "research",
      
      pricing: {
        model: "subscription",
        price: 20,
        currency: "USD",
        billing: "monthly",
        notes: "Free tier available with limits"
      },
      
      capabilities: {
        chat: 9,
        code: 6,
        analysis: 10,
        content: 8,
        vision: 7,
        voice: 5,
        agents: 6,
        integrations: 5
      },
      
      mcp_support: "no",
      mcp_server_count: 0,
      mcp_notes: "No MCP, standalone research tool",
      agentic_level: "L2",
      agentic_capabilities: ["Multi-source search", "Citation generation", "Follow-up questions", "Collections"],
      
      compliance_ready: ["SOC2"],
      data_residency: ["US"],
      encryption: "TLS 1.2+",
      audit_logging: false,
      sso_support: ["Google", "Apple"],
      
      integration_complexity: 1,
      integration_notes: "Standalone web app, API available",
      api_available: true,
      sdk_available: false,
      
      vertical_fit: ["Research", "Consulting", "Legal", "Finance"],
      mip_category: "buy",
      human_oversight: "Source verification",
      
      priority: "HIGH",
      int_verdict: "Best research assistant. Real-time citations. INT's research backbone.",
      int_use_cases: [
        "Market research",
        "Competitive intelligence",
        "Technical research",
        "Fact-checking with sources",
        "Quick information synthesis"
      ],
      deployment_time: "Minutes",
      training_required: "1-2 hours",
      
      market_share: 0.08,
      growth_rate: 0.85,
      enterprise_adoption: 0.12,
      
      url: "https://www.perplexity.ai",
      docs_url: "https://docs.perplexity.ai",
      pricing_url: "https://www.perplexity.ai/pro"
    },
    
    {
      id: "elicit",
      name: "Elicit",
      vendor: "Elicit",
      category: "research",
      
      pricing: {
        model: "subscription",
        price: 10,
        currency: "USD",
        billing: "monthly",
        notes: "Free tier available"
      },
      
      capabilities: {
        chat: 7,
        code: 4,
        analysis: 9,
        content: 7,
        vision: 5,
        voice: 3,
        agents: 5,
        integrations: 4
      },
      
      mcp_support: "no",
      mcp_server_count: 0,
      mcp_notes: "No MCP, academic research focus",
      agentic_level: "L2",
      agentic_capabilities: ["Paper search", "Literature review", "Data extraction", "Research synthesis"],
      
      compliance_ready: ["SOC2"],
      data_residency: ["US"],
      encryption: "TLS 1.2+",
      audit_logging: false,
      sso_support: ["Google"],
      
      integration_complexity: 1,
      integration_notes: "Standalone research tool",
      api_available: false,
      sdk_available: false,
      
      vertical_fit: ["Research", "Academia", "Healthcare", "Policy"],
      mip_category: "buy",
      human_oversight: "Researcher review",
      
      priority: "MEDIUM",
      int_verdict: "Best for academic/scientific research. Literature review automation.",
      int_use_cases: [
        "Literature review",
        "Academic paper synthesis",
        "Research question exploration",
        "Evidence-based analysis",
        "Scientific fact-checking"
      ],
      deployment_time: "Minutes",
      training_required: "1-2 hours",
      
      market_share: 0.03,
      growth_rate: 0.45,
      enterprise_adoption: 0.05,
      
      url: "https://elicit.com",
      docs_url: "https://support.elicit.com",
      pricing_url: "https://elicit.com/pricing"
    },
    
    {
      id: "notebooklm",
      name: "NotebookLM",
      vendor: "Google",
      category: "research",
      
      pricing: {
        model: "free",
        price: 0,
        currency: "USD",
        notes: "Free with Google account, Plus tier coming"
      },
      
      capabilities: {
        chat: 8,
        code: 5,
        analysis: 9,
        content: 8,
        vision: 6,
        voice: 8,
        agents: 5,
        integrations: 6
      },
      
      mcp_support: "no",
      mcp_server_count: 0,
      mcp_notes: "No MCP, Google ecosystem",
      agentic_level: "L2",
      agentic_capabilities: ["Source grounding", "Audio overview", "Citation linking", "Multi-source synthesis"],
      
      compliance_ready: ["SOC2", "ISO27001"],
      data_residency: ["US"],
      encryption: "Google-standard",
      audit_logging: false,
      sso_support: ["Google"],
      
      integration_complexity: 1,
      integration_notes: "Google Docs/Drive integration",
      api_available: false,
      sdk_available: false,
      
      vertical_fit: ["Research", "Education", "Consulting"],
      mip_category: "buy",
      human_oversight: "User verification",
      
      priority: "MEDIUM",
      int_verdict: "Unique audio summaries. Source-grounded answers. Great for document analysis.",
      int_use_cases: [
        "Document analysis",
        "Audio podcast generation",
        "Source-grounded Q&A",
        "Meeting prep from docs",
        "Research synthesis"
      ],
      deployment_time: "Minutes",
      training_required: "1 hour",
      
      market_share: 0.05,
      growth_rate: 0.70,
      enterprise_adoption: 0.08,
      
      url: "https://notebooklm.google.com",
      docs_url: "https://support.google.com/notebooklm",
      pricing_url: "https://notebooklm.google.com"
    },

    // =========================================
    // CATEGORY 8: AGENTIC AI ORCHESTRATION (7)
    // =========================================
    
    {
      id: "copilot-studio",
      name: "Microsoft Copilot Studio",
      vendor: "Microsoft",
      category: "agentic",
      
      pricing: {
        model: "messages",
        price: 200,
        currency: "USD",
        unit: "25K messages/month",
        notes: "Standalone or with M365 Copilot"
      },
      
      capabilities: {
        chat: 8,
        code: 6,
        analysis: 7,
        content: 7,
        vision: 6,
        voice: 7,
        agents: 10,
        integrations: 10
      },
      
      mcp_support: "yes",
      mcp_server_count: 50,
      mcp_notes: "Full MCP support, agent marketplace, Copilot extensions",
      agentic_level: "L4",
      agentic_capabilities: ["Custom agents", "Multi-agent orchestration", "Copilot extensions", "Plugin framework"],
      
      compliance_ready: ["SOC2", "ISO27001", "HIPAA", "FedRAMP", "GDPR"],
      data_residency: ["US", "EU", "UK", "AU", "CA", "JP"],
      encryption: "AES-256, TLS 1.3",
      audit_logging: true,
      sso_support: ["Entra ID"],
      
      integration_complexity: 2,
      integration_notes: "Low-code agent builder, M365 native",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["All Industries"],
      mip_category: "build",
      human_oversight: "Configurable guardrails",
      
      priority: "HIGH",
      int_verdict: "Low-code agent builder for M365. Build custom copilots without deep coding.",
      int_use_cases: [
        "Custom copilot development",
        "Department-specific agents",
        "Knowledge-grounded bots",
        "Workflow automation agents",
        "Multi-channel deployment"
      ],
      deployment_time: "Days to weeks",
      training_required: "8-16 hours",
      
      market_share: 0.18,
      growth_rate: 0.60,
      enterprise_adoption: 0.25,
      
      url: "https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio",
      docs_url: "https://learn.microsoft.com/microsoft-copilot-studio/",
      pricing_url: "https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio"
    },
    
    {
      id: "truefoundry",
      name: "TrueFoundry",
      vendor: "TrueFoundry",
      category: "agentic",
      
      pricing: {
        model: "enterprise",
        price: "Contact",
        currency: "USD",
        notes: "Platform licensing, self-hosted option"
      },
      
      capabilities: {
        chat: 8,
        code: 8,
        analysis: 8,
        content: 7,
        vision: 6,
        voice: 5,
        agents: 10,
        integrations: 9
      },
      
      mcp_support: "yes",
      mcp_server_count: 25,
      mcp_notes: "MCP & Agents Registry, tool orchestration layer",
      agentic_level: "L5",
      agentic_capabilities: ["AI Gateway", "MCP Registry", "Prompt lifecycle", "Multi-agent", "Fine-tuning"],
      
      compliance_ready: ["SOC2", "ISO27001", "HIPAA"],
      data_residency: ["Self-hosted", "US", "EU"],
      encryption: "Configurable",
      audit_logging: true,
      sso_support: ["SAML", "OIDC"],
      
      integration_complexity: 4,
      integration_notes: "Enterprise AI platform, full-stack",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["Enterprise", "Finance", "Healthcare"],
      mip_category: "build",
      human_oversight: "Full governance controls",
      
      priority: "HIGH",
      int_verdict: "End-to-end agentic stack. MCP registry unique. Consider for enterprise builds.",
      int_use_cases: [
        "Enterprise agent platform",
        "Multi-agent orchestration",
        "LLM deployment and fine-tuning",
        "Agent governance",
        "Tool registry management"
      ],
      deployment_time: "Weeks to months",
      training_required: "40+ hours",
      
      market_share: 0.02,
      growth_rate: 0.85,
      enterprise_adoption: 0.05,
      
      url: "https://www.truefoundry.com",
      docs_url: "https://docs.truefoundry.com",
      pricing_url: "https://www.truefoundry.com/pricing"
    },
    
    {
      id: "autogen",
      name: "AutoGen (Microsoft)",
      vendor: "Microsoft",
      category: "agentic",
      
      pricing: {
        model: "free",
        price: 0,
        currency: "USD",
        notes: "Open source, Apache 2.0"
      },
      
      capabilities: {
        chat: 8,
        code: 9,
        analysis: 8,
        content: 7,
        vision: 6,
        voice: 4,
        agents: 10,
        integrations: 7
      },
      
      mcp_support: "yes",
      mcp_server_count: 15,
      mcp_notes: "MCP support, now unified with Semantic Kernel in Azure AI Foundry",
      agentic_level: "L5",
      agentic_capabilities: ["Multi-agent conversations", "Code execution", "Tool use", "Group chat"],
      
      compliance_ready: [],
      data_residency: ["Self-hosted"],
      encryption: "Self-managed",
      audit_logging: false,
      sso_support: [],
      
      integration_complexity: 4,
      integration_notes: "Framework requiring custom development",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["Software Development", "Research"],
      mip_category: "build",
      human_oversight: "Developer-implemented",
      
      priority: "HIGH",
      int_verdict: "Leading multi-agent framework. Now part of Azure AI Foundry SDK. Developer essential.",
      int_use_cases: [
        "Multi-agent system development",
        "Research prototypes",
        "Complex reasoning workflows",
        "Code generation pipelines",
        "Custom agent architectures"
      ],
      deployment_time: "Weeks",
      training_required: "16-40 hours",
      
      market_share: 0.08,
      growth_rate: 0.75,
      enterprise_adoption: 0.10,
      
      url: "https://microsoft.github.io/autogen/",
      docs_url: "https://microsoft.github.io/autogen/docs/",
      pricing_url: "https://github.com/microsoft/autogen"
    },
    
    {
      id: "crewai",
      name: "CrewAI",
      vendor: "CrewAI",
      category: "agentic",
      
      pricing: {
        model: "hybrid",
        price: 0,
        currency: "USD",
        notes: "Open source free, Enterprise tier available"
      },
      
      capabilities: {
        chat: 7,
        code: 8,
        analysis: 7,
        content: 7,
        vision: 5,
        voice: 4,
        agents: 9,
        integrations: 6
      },
      
      mcp_support: "partial",
      mcp_server_count: 5,
      mcp_notes: "Emerging MCP support",
      agentic_level: "L4",
      agentic_capabilities: ["Role-based agents", "Task delegation", "Process orchestration", "Tool integration"],
      
      compliance_ready: [],
      data_residency: ["Self-hosted"],
      encryption: "Self-managed",
      audit_logging: false,
      sso_support: [],
      
      integration_complexity: 3,
      integration_notes: "Python framework, moderate complexity",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["Software Development", "Automation"],
      mip_category: "build",
      human_oversight: "Developer-implemented",
      
      priority: "MEDIUM",
      int_verdict: "Role-based agent framework. Good for team-of-agents patterns.",
      int_use_cases: [
        "Role-based agent systems",
        "Workflow automation",
        "Research pipelines",
        "Content generation crews",
        "Analysis workflows"
      ],
      deployment_time: "Days to weeks",
      training_required: "8-16 hours",
      
      market_share: 0.04,
      growth_rate: 0.70,
      enterprise_adoption: 0.05,
      
      url: "https://www.crewai.com",
      docs_url: "https://docs.crewai.com",
      pricing_url: "https://www.crewai.com/pricing"
    },
    
    {
      id: "langgraph",
      name: "LangGraph",
      vendor: "LangChain",
      category: "agentic",
      
      pricing: {
        model: "free",
        price: 0,
        currency: "USD",
        notes: "Open source, LangSmith for observability (paid)"
      },
      
      capabilities: {
        chat: 7,
        code: 8,
        analysis: 7,
        content: 6,
        vision: 5,
        voice: 4,
        agents: 9,
        integrations: 8
      },
      
      mcp_support: "yes",
      mcp_server_count: 10,
      mcp_notes: "MCP integration available",
      agentic_level: "L4",
      agentic_capabilities: ["State graphs", "Cycles and loops", "Human-in-loop", "Persistence"],
      
      compliance_ready: [],
      data_residency: ["Self-hosted"],
      encryption: "Self-managed",
      audit_logging: false,
      sso_support: [],
      
      integration_complexity: 3,
      integration_notes: "Extension of LangChain, graph-based workflows",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["Software Development"],
      mip_category: "build",
      human_oversight: "Built-in human-in-loop nodes",
      
      priority: "MEDIUM",
      int_verdict: "Graph-based agent workflows. Good for complex state machines.",
      int_use_cases: [
        "Stateful agent workflows",
        "Complex decision trees",
        "Human-in-loop processes",
        "Multi-step reasoning",
        "Cyclic workflows"
      ],
      deployment_time: "Days to weeks",
      training_required: "8-16 hours",
      
      market_share: 0.05,
      growth_rate: 0.65,
      enterprise_adoption: 0.08,
      
      url: "https://langchain-ai.github.io/langgraph/",
      docs_url: "https://langchain-ai.github.io/langgraph/",
      pricing_url: "https://www.langchain.com/langsmith"
    },
    
    {
      id: "salesforce-agentforce",
      name: "Salesforce Agentforce",
      vendor: "Salesforce",
      category: "agentic",
      
      pricing: {
        model: "conversations",
        price: 2,
        currency: "USD",
        unit: "conversation",
        notes: "Consumption-based pricing"
      },
      
      capabilities: {
        chat: 8,
        code: 5,
        analysis: 8,
        content: 7,
        vision: 5,
        voice: 7,
        agents: 9,
        integrations: 9
      },
      
      mcp_support: "roadmap",
      mcp_server_count: 0,
      mcp_notes: "MCP support expected",
      agentic_level: "L4",
      agentic_capabilities: ["Service agents", "Sales agents", "Marketing agents", "Custom agents"],
      
      compliance_ready: ["SOC2", "ISO27001", "HIPAA", "FedRAMP"],
      data_residency: ["US", "EU", "AP"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "OIDC"],
      
      integration_complexity: 3,
      integration_notes: "Native Salesforce, requires SF platform",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["Sales", "Service", "Marketing"],
      mip_category: "buy",
      human_oversight: "Escalation rules",
      
      priority: "MEDIUM",
      int_verdict: "Best for Salesforce shops. Autonomous service and sales agents.",
      int_use_cases: [
        "Customer service automation",
        "Sales assistant agents",
        "Lead qualification",
        "Case routing and resolution",
        "Customer journey orchestration"
      ],
      deployment_time: "Weeks",
      training_required: "16-40 hours",
      
      market_share: 0.12,
      growth_rate: 0.50,
      enterprise_adoption: 0.20,
      
      url: "https://www.salesforce.com/agentforce/",
      docs_url: "https://developer.salesforce.com/docs/atlas.en-us.einstein_copilot.meta/einstein_copilot/",
      pricing_url: "https://www.salesforce.com/agentforce/"
    },
    
    {
      id: "anthropic-claude-agents",
      name: "Claude Computer Use / Agent SDK",
      vendor: "Anthropic",
      category: "agentic",
      
      pricing: {
        model: "api",
        price: "Varies",
        currency: "USD",
        notes: "API token pricing, varies by model"
      },
      
      capabilities: {
        chat: 10,
        code: 9,
        analysis: 10,
        content: 9,
        vision: 9,
        voice: 6,
        agents: 10,
        integrations: 8
      },
      
      mcp_support: "yes",
      mcp_server_count: 300,
      mcp_notes: "MCP inventor, full protocol support, 300+ servers",
      agentic_level: "L5",
      agentic_capabilities: ["Computer Use", "Agent SDK", "Subagents", "Tool orchestration", "Extended thinking"],
      
      compliance_ready: ["SOC2", "HIPAA", "GDPR"],
      data_residency: ["US", "EU"],
      encryption: "AES-256, TLS 1.3",
      audit_logging: true,
      sso_support: ["SAML", "OIDC"],
      
      integration_complexity: 3,
      integration_notes: "API-first, requires development",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["All Industries"],
      mip_category: "build",
      human_oversight: "Extended thinking transparency",
      
      priority: "CRITICAL",
      int_verdict: "Most advanced agentic capabilities. Computer Use is unique. MCP ecosystem leader.",
      int_use_cases: [
        "Autonomous computer control",
        "Complex multi-step tasks",
        "Custom agent development",
        "MCP-based integrations",
        "Research and analysis automation"
      ],
      deployment_time: "Days to weeks",
      training_required: "8-16 hours",
      
      market_share: 0.10,
      growth_rate: 0.80,
      enterprise_adoption: 0.15,
      
      url: "https://www.anthropic.com/news/computer-use",
      docs_url: "https://docs.anthropic.com/en/docs/agents",
      pricing_url: "https://www.anthropic.com/pricing"
    },

    // =========================================
    // CATEGORY 9: PRODUCTIVITY & KNOWLEDGE (5)
    // =========================================
    
    {
      id: "notion-ai",
      name: "Notion AI",
      vendor: "Notion",
      category: "productivity_knowledge",
      
      pricing: {
        model: "add-on",
        price: 10,
        currency: "USD",
        unit: "member/month",
        notes: "Add-on to Notion subscription"
      },
      
      capabilities: {
        chat: 7,
        code: 5,
        analysis: 7,
        content: 9,
        vision: 5,
        voice: 4,
        agents: 6,
        integrations: 7
      },
      
      mcp_support: "yes",
      mcp_server_count: 5,
      mcp_notes: "MCP server available for workspace access",
      agentic_level: "L2",
      agentic_capabilities: ["Q&A over workspace", "Content generation", "Summarization", "Action items"],
      
      compliance_ready: ["SOC2", "ISO27001", "GDPR", "HIPAA"],
      data_residency: ["US"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "Google", "Microsoft"],
      
      integration_complexity: 1,
      integration_notes: "Native to Notion, toggle-to-enable",
      api_available: true,
      sdk_available: false,
      
      vertical_fit: ["All Industries"],
      mip_category: "buy",
      human_oversight: "User review",
      
      priority: "MEDIUM",
      int_verdict: "Best for Notion-centric teams. Q&A over entire workspace.",
      int_use_cases: [
        "Workspace Q&A",
        "Meeting notes generation",
        "Content drafting",
        "Task summarization",
        "Documentation assistance"
      ],
      deployment_time: "Minutes",
      training_required: "1-2 hours",
      
      market_share: 0.12,
      growth_rate: 0.35,
      enterprise_adoption: 0.20,
      
      url: "https://www.notion.so/product/ai",
      docs_url: "https://www.notion.so/help/guides/using-notion-ai",
      pricing_url: "https://www.notion.so/pricing"
    },
    
    {
      id: "glean",
      name: "Glean",
      vendor: "Glean",
      category: "productivity_knowledge",
      
      pricing: {
        model: "enterprise",
        price: "Contact",
        currency: "USD",
        notes: "Enterprise pricing, per-user"
      },
      
      capabilities: {
        chat: 8,
        code: 5,
        analysis: 9,
        content: 7,
        vision: 5,
        voice: 5,
        agents: 7,
        integrations: 10
      },
      
      mcp_support: "partial",
      mcp_server_count: 5,
      mcp_notes: "Emerging MCP support",
      agentic_level: "L3",
      agentic_capabilities: ["Enterprise search", "AI assistant", "Knowledge discovery", "Answer generation"],
      
      compliance_ready: ["SOC2", "ISO27001", "GDPR", "HIPAA"],
      data_residency: ["US", "EU"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "OIDC", "Okta"],
      
      integration_complexity: 3,
      integration_notes: "100+ connectors, enterprise deployment",
      api_available: true,
      sdk_available: false,
      
      vertical_fit: ["Enterprise"],
      mip_category: "buy",
      human_oversight: "Access controls",
      
      priority: "HIGH",
      int_verdict: "Enterprise search leader. Unified search across all company systems.",
      int_use_cases: [
        "Enterprise-wide search",
        "Knowledge discovery",
        "Employee onboarding",
        "Expert finding",
        "Institutional knowledge capture"
      ],
      deployment_time: "Weeks",
      training_required: "2-4 hours",
      
      market_share: 0.08,
      growth_rate: 0.60,
      enterprise_adoption: 0.15,
      
      url: "https://www.glean.com",
      docs_url: "https://help.glean.com",
      pricing_url: "https://www.glean.com/pricing"
    },
    
    {
      id: "guru",
      name: "Guru",
      vendor: "Guru",
      category: "productivity_knowledge",
      
      pricing: {
        model: "per-user-monthly",
        price: 10,
        currency: "USD",
        billing: "monthly",
        tiers: [
          { name: "Builder", price: 10 },
          { name: "Enterprise", price: 15 }
        ]
      },
      
      capabilities: {
        chat: 7,
        code: 4,
        analysis: 7,
        content: 8,
        vision: 5,
        voice: 4,
        agents: 6,
        integrations: 8
      },
      
      mcp_support: "no",
      mcp_server_count: 0,
      mcp_notes: "No MCP, proprietary integrations",
      agentic_level: "L2",
      agentic_capabilities: ["Knowledge suggestions", "Answer generation", "Content verification", "Browser extension"],
      
      compliance_ready: ["SOC2", "ISO27001", "GDPR", "HIPAA"],
      data_residency: ["US"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "OIDC"],
      
      integration_complexity: 2,
      integration_notes: "Slack/Teams native, browser extension",
      api_available: true,
      sdk_available: false,
      
      vertical_fit: ["Sales", "Support", "All Industries"],
      mip_category: "buy",
      human_oversight: "Verification workflows",
      
      priority: "MEDIUM",
      int_verdict: "Best for sales/support knowledge. Browser extension surfaces answers in context.",
      int_use_cases: [
        "Sales enablement",
        "Support knowledge",
        "Real-time answer suggestions",
        "Content verification workflows",
        "Knowledge base maintenance"
      ],
      deployment_time: "Days",
      training_required: "2-4 hours",
      
      market_share: 0.06,
      growth_rate: 0.30,
      enterprise_adoption: 0.12,
      
      url: "https://www.getguru.com",
      docs_url: "https://help.getguru.com",
      pricing_url: "https://www.getguru.com/pricing"
    },
    
    {
      id: "confluence-ai",
      name: "Confluence AI (Atlassian Intelligence)",
      vendor: "Atlassian",
      category: "productivity_knowledge",
      
      pricing: {
        model: "included",
        price: 0,
        currency: "USD",
        notes: "Included in Premium ($11.55/user) and Enterprise"
      },
      
      capabilities: {
        chat: 7,
        code: 5,
        analysis: 7,
        content: 8,
        vision: 5,
        voice: 4,
        agents: 6,
        integrations: 8
      },
      
      mcp_support: "yes",
      mcp_server_count: 10,
      mcp_notes: "MCP server for Atlassian ecosystem access",
      agentic_level: "L2",
      agentic_capabilities: ["Page summarization", "Content generation", "Q&A", "Smart links"],
      
      compliance_ready: ["SOC2", "ISO27001", "GDPR", "HIPAA", "FedRAMP"],
      data_residency: ["US", "EU", "AU"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "OIDC", "Google", "Microsoft"],
      
      integration_complexity: 1,
      integration_notes: "Native to Confluence, Jira integration",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["Software Development", "All Industries"],
      mip_category: "buy",
      human_oversight: "User review",
      
      priority: "MEDIUM",
      int_verdict: "Best for Atlassian shops. AI across Confluence and Jira.",
      int_use_cases: [
        "Documentation summarization",
        "Content drafting",
        "Jira issue assistance",
        "Knowledge Q&A",
        "Meeting notes generation"
      ],
      deployment_time: "Minutes",
      training_required: "1-2 hours",
      
      market_share: 0.25,
      growth_rate: 0.30,
      enterprise_adoption: 0.35,
      
      url: "https://www.atlassian.com/software/confluence/features/ai",
      docs_url: "https://support.atlassian.com/confluence-cloud/docs/",
      pricing_url: "https://www.atlassian.com/software/confluence/pricing"
    },
    
    {
      id: "grammarly",
      name: "Grammarly Business",
      vendor: "Grammarly",
      category: "productivity_knowledge",
      
      pricing: {
        model: "per-user-monthly",
        price: 15,
        currency: "USD",
        billing: "monthly",
        notes: "Business tier, Enterprise available"
      },
      
      capabilities: {
        chat: 6,
        code: 3,
        analysis: 6,
        content: 9,
        vision: 3,
        voice: 3,
        agents: 4,
        integrations: 8
      },
      
      mcp_support: "no",
      mcp_server_count: 0,
      mcp_notes: "No MCP, browser/desktop integration",
      agentic_level: "L2",
      agentic_capabilities: ["Writing suggestions", "Tone detection", "GrammarlyGO generation", "Brand voice"],
      
      compliance_ready: ["SOC2", "ISO27001", "GDPR", "HIPAA"],
      data_residency: ["US"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "OIDC"],
      
      integration_complexity: 1,
      integration_notes: "Browser extension, works everywhere",
      api_available: true,
      sdk_available: false,
      
      vertical_fit: ["All Industries"],
      mip_category: "buy",
      human_oversight: "User acceptance",
      
      priority: "MEDIUM",
      int_verdict: "Writing AI standard. Works across all apps. Brand voice consistency.",
      int_use_cases: [
        "Writing quality improvement",
        "Brand voice consistency",
        "Email and document drafting",
        "Tone adjustment",
        "Communication clarity"
      ],
      deployment_time: "Minutes",
      training_required: "1 hour",
      
      market_share: 0.35,
      growth_rate: 0.20,
      enterprise_adoption: 0.30,
      
      url: "https://www.grammarly.com/business",
      docs_url: "https://support.grammarly.com",
      pricing_url: "https://www.grammarly.com/business/pricing"
    },

    // =========================================
    // CATEGORY 10: AI GOVERNANCE & GRC (5)
    // =========================================
    
    {
      id: "drata",
      name: "Drata",
      vendor: "Drata",
      category: "governance_grc",
      
      pricing: {
        model: "annual",
        price: 7000,
        currency: "USD",
        unit: "year",
        notes: "Platform only, ~$12K+ with audit"
      },
      
      capabilities: {
        chat: 6,
        code: 4,
        analysis: 8,
        content: 7,
        vision: 4,
        voice: 3,
        agents: 7,
        integrations: 9
      },
      
      mcp_support: "no",
      mcp_server_count: 0,
      mcp_notes: "No MCP, 100+ native integrations",
      agentic_level: "L3",
      agentic_capabilities: ["Continuous monitoring", "Auto-evidence", "Risk assessment", "Control mapping"],
      
      compliance_ready: ["SOC2", "ISO27001", "HIPAA", "GDPR", "PCI-DSS", "NIST-AI-RMF", "ISO42001"],
      data_residency: ["US"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "OIDC", "Okta"],
      
      integration_complexity: 2,
      integration_notes: "Deep cloud integrations, auto-evidence collection",
      api_available: true,
      sdk_available: false,
      
      vertical_fit: ["SaaS", "FinTech", "HealthTech"],
      mip_category: "broker",
      human_oversight: "Auditor final review",
      
      priority: "HIGH",
      int_verdict: "AI-native GRC leader. G2 momentum leader. Consider for client compliance services.",
      int_use_cases: [
        "SOC 2 automation",
        "Continuous compliance monitoring",
        "AI governance (NIST AI RMF)",
        "Multi-framework management",
        "Vendor risk management"
      ],
      deployment_time: "Weeks",
      training_required: "8-16 hours",
      
      market_share: 0.22,
      growth_rate: 0.55,
      enterprise_adoption: 0.25,
      
      url: "https://drata.com",
      docs_url: "https://help.drata.com",
      pricing_url: "https://drata.com/pricing"
    },
    
    {
      id: "sprinto",
      name: "Sprinto",
      vendor: "Sprinto",
      category: "governance_grc",
      
      pricing: {
        model: "contact",
        price: "Contact",
        currency: "USD",
        notes: "Custom pricing, typically lower than competitors"
      },
      
      capabilities: {
        chat: 6,
        code: 4,
        analysis: 7,
        content: 7,
        vision: 4,
        voice: 3,
        agents: 7,
        integrations: 8
      },
      
      mcp_support: "no",
      mcp_server_count: 0,
      mcp_notes: "No MCP, 200+ native integrations",
      agentic_level: "L3",
      agentic_capabilities: ["Sprinto AI", "Auto-evidence", "Risk mapping", "Trust center"],
      
      compliance_ready: ["SOC2", "ISO27001", "HIPAA", "GDPR", "PCI-DSS"],
      data_residency: ["US", "EU", "IN"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "OIDC"],
      
      integration_complexity: 2,
      integration_notes: "Plug-and-play integrations, quick setup",
      api_available: true,
      sdk_available: false,
      
      vertical_fit: ["SaaS", "Startups", "SMB"],
      mip_category: "broker",
      human_oversight: "Auditor review",
      
      priority: "HIGH",
      int_verdict: "Strong for HIPAA automation. Sprinto AI for third-party due diligence.",
      int_use_cases: [
        "HIPAA compliance automation",
        "SOC 2 readiness",
        "Vendor security questionnaires",
        "Third-party risk management",
        "Real-time compliance monitoring"
      ],
      deployment_time: "Days to weeks",
      training_required: "4-8 hours",
      
      market_share: 0.08,
      growth_rate: 0.60,
      enterprise_adoption: 0.12,
      
      url: "https://sprinto.com",
      docs_url: "https://help.sprinto.com",
      pricing_url: "https://sprinto.com/pricing"
    },
    
    {
      id: "comp-ai",
      name: "Comp AI",
      vendor: "Comp AI",
      category: "governance_grc",
      
      pricing: {
        model: "free-tier",
        price: 0,
        currency: "USD",
        notes: "Free to use, audit fees separate"
      },
      
      capabilities: {
        chat: 5,
        code: 3,
        analysis: 6,
        content: 6,
        vision: 3,
        voice: 3,
        agents: 7,
        integrations: 7
      },
      
      mcp_support: "no",
      mcp_server_count: 0,
      mcp_notes: "No MCP, cloud provider integrations",
      agentic_level: "L3",
      agentic_capabilities: ["AI agents for compliance", "Auto-evidence", "GitHub/AWS sync", "Policy generation"],
      
      compliance_ready: ["SOC2", "ISO27001", "HIPAA", "GDPR"],
      data_residency: ["US"],
      encryption: "TLS 1.2+",
      audit_logging: true,
      sso_support: ["Google", "Microsoft"],
      
      integration_complexity: 1,
      integration_notes: "Connect to GitHub/AWS, auto-collect evidence",
      api_available: false,
      sdk_available: false,
      
      vertical_fit: ["Startups", "SMB", "SaaS"],
      mip_category: "broker",
      human_oversight: "Auditor final",
      
      priority: "MEDIUM",
      int_verdict: "SOC 2 Type 1 in days claim. Free tier for startups. Good for small clients.",
      int_use_cases: [
        "Rapid SOC 2 readiness",
        "Startup compliance",
        "Evidence auto-collection",
        "Policy generation",
        "Cost-effective compliance"
      ],
      deployment_time: "Days",
      training_required: "2-4 hours",
      
      market_share: 0.02,
      growth_rate: 0.75,
      enterprise_adoption: 0.03,
      
      url: "https://trycomp.ai",
      docs_url: "https://trycomp.ai/docs",
      pricing_url: "https://trycomp.ai/pricing"
    },
    
    {
      id: "centraleyes",
      name: "Centraleyes",
      vendor: "Centraleyes",
      category: "governance_grc",
      
      pricing: {
        model: "contact",
        price: "Contact",
        currency: "USD",
        notes: "Enterprise pricing"
      },
      
      capabilities: {
        chat: 6,
        code: 3,
        analysis: 8,
        content: 6,
        vision: 4,
        voice: 3,
        agents: 7,
        integrations: 7
      },
      
      mcp_support: "no",
      mcp_server_count: 0,
      mcp_notes: "No MCP, comprehensive GRC platform",
      agentic_level: "L3",
      agentic_capabilities: ["AI risk register", "Auto-mapping", "Continuous monitoring", "Remediation tracking"],
      
      compliance_ready: ["SOC2", "ISO27001", "HIPAA", "NIST", "CJIS", "PCI-DSS"],
      data_residency: ["US", "EU"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "OIDC"],
      
      integration_complexity: 3,
      integration_notes: "Enterprise GRC platform, broader scope",
      api_available: true,
      sdk_available: false,
      
      vertical_fit: ["Healthcare", "Finance", "Government", "Defense"],
      mip_category: "broker",
      human_oversight: "GRC team workflows",
      
      priority: "MEDIUM",
      int_verdict: "Multi-framework GRC. AI risk register unique. Good for regulated industries.",
      int_use_cases: [
        "Multi-framework compliance",
        "AI-powered risk register",
        "Healthcare compliance (HIPAA, HITECH)",
        "Financial services compliance",
        "Government compliance (CJIS, FedRAMP)"
      ],
      deployment_time: "Weeks",
      training_required: "8-16 hours",
      
      market_share: 0.04,
      growth_rate: 0.40,
      enterprise_adoption: 0.08,
      
      url: "https://www.centraleyes.com",
      docs_url: "https://www.centraleyes.com/resources",
      pricing_url: "https://www.centraleyes.com/pricing"
    },
    
    {
      id: "microsoft-purview",
      name: "Microsoft Purview",
      vendor: "Microsoft",
      category: "governance_grc",
      
      pricing: {
        model: "bundled",
        price: 0,
        currency: "USD",
        notes: "Included in E5, standalone add-ons available"
      },
      
      capabilities: {
        chat: 7,
        code: 4,
        analysis: 9,
        content: 6,
        vision: 5,
        voice: 4,
        agents: 7,
        integrations: 10
      },
      
      mcp_support: "yes",
      mcp_server_count: 15,
      mcp_notes: "MCP support for data governance integration",
      agentic_level: "L3",
      agentic_capabilities: ["Data classification", "AI governance", "DLP", "Information protection", "Model tracking"],
      
      compliance_ready: ["SOC2", "ISO27001", "HIPAA", "GDPR", "FedRAMP"],
      data_residency: ["US", "EU", "UK", "AU", "CA", "JP", "Global"],
      encryption: "AES-256, TLS 1.3",
      audit_logging: true,
      sso_support: ["Entra ID"],
      
      integration_complexity: 2,
      integration_notes: "Native M365, Azure integration",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["Enterprise", "Government", "Healthcare", "Finance"],
      mip_category: "buy",
      human_oversight: "Policy-based controls",
      
      priority: "HIGH",
      int_verdict: "AI governance for M365. Track how AI models use data. Native integration.",
      int_use_cases: [
        "AI model governance",
        "Data classification",
        "Sensitive data protection",
        "Compliance reporting",
        "Model usage tracking"
      ],
      deployment_time: "Days to weeks",
      training_required: "8-16 hours",
      
      market_share: 0.35,
      growth_rate: 0.40,
      enterprise_adoption: 0.45,
      
      url: "https://www.microsoft.com/security/business/microsoft-purview",
      docs_url: "https://learn.microsoft.com/purview/",
      pricing_url: "https://www.microsoft.com/security/business/microsoft-purview"
    },

    // =========================================
    // CATEGORY 11: VERTICAL - HEALTHCARE (4)
    // =========================================
    
    {
      id: "nuance-dax",
      name: "Nuance DAX (Dragon Ambient eXperience)",
      vendor: "Microsoft/Nuance",
      category: "vertical_healthcare",
      
      pricing: {
        model: "enterprise",
        price: "Contact",
        currency: "USD",
        notes: "Per-provider pricing, enterprise agreements"
      },
      
      capabilities: {
        chat: 7,
        code: 3,
        analysis: 8,
        content: 9,
        vision: 5,
        voice: 10,
        agents: 7,
        integrations: 8
      },
      
      mcp_support: "roadmap",
      mcp_server_count: 0,
      mcp_notes: "MCP support expected via Microsoft integration",
      agentic_level: "L3",
      agentic_capabilities: ["Ambient documentation", "Clinical notes", "EHR integration", "Voice AI"],
      
      compliance_ready: ["HIPAA", "SOC2", "HITRUST"],
      data_residency: ["US"],
      encryption: "AES-256, TLS 1.2+, PHI encryption",
      audit_logging: true,
      sso_support: ["SAML", "AD"],
      
      integration_complexity: 4,
      integration_notes: "EHR integration required (Epic, Cerner, etc.)",
      api_available: true,
      sdk_available: false,
      
      vertical_fit: ["Healthcare"],
      mip_category: "buy",
      human_oversight: "Clinician review required",
      
      priority: "HIGH",
      int_verdict: "Clinical documentation leader. Ambient AI captures physician-patient conversations.",
      int_use_cases: [
        "Clinical note generation",
        "Ambient documentation",
        "Physician productivity",
        "EHR documentation",
        "Medical transcription"
      ],
      deployment_time: "Months",
      training_required: "8-16 hours",
      
      market_share: 0.45,
      growth_rate: 0.35,
      enterprise_adoption: 0.40,
      
      url: "https://www.nuance.com/healthcare/ambient-clinical-intelligence.html",
      docs_url: "https://www.nuance.com/healthcare/provider-solutions/clinical-documentation.html",
      pricing_url: "https://www.nuance.com/healthcare/contact.html"
    },
    
    {
      id: "hippocratic-ai",
      name: "Hippocratic AI",
      vendor: "Hippocratic AI",
      category: "vertical_healthcare",
      
      pricing: {
        model: "contact",
        price: "Contact",
        currency: "USD",
        notes: "Enterprise healthcare agreements"
      },
      
      capabilities: {
        chat: 8,
        code: 3,
        analysis: 7,
        content: 7,
        vision: 5,
        voice: 9,
        agents: 8,
        integrations: 6
      },
      
      mcp_support: "no",
      mcp_server_count: 0,
      mcp_notes: "No MCP, healthcare-specific platform",
      agentic_level: "L3",
      agentic_capabilities: ["Patient intake", "Chronic care", "Post-discharge", "Medication adherence"],
      
      compliance_ready: ["HIPAA", "SOC2"],
      data_residency: ["US"],
      encryption: "Healthcare-grade",
      audit_logging: true,
      sso_support: ["SAML"],
      
      integration_complexity: 3,
      integration_notes: "Healthcare workflow integration",
      api_available: true,
      sdk_available: false,
      
      vertical_fit: ["Healthcare"],
      mip_category: "buy",
      human_oversight: "Non-diagnostic only",
      
      priority: "WATCH",
      int_verdict: "Non-diagnostic patient AI. High-volume, low-risk workflows. Watch for maturity.",
      int_use_cases: [
        "Patient intake automation",
        "Chronic care management",
        "Post-discharge follow-up",
        "Medication adherence calls",
        "Appointment scheduling"
      ],
      deployment_time: "Weeks to months",
      training_required: "4-8 hours",
      
      market_share: 0.02,
      growth_rate: 0.80,
      enterprise_adoption: 0.05,
      
      url: "https://www.hippocraticai.com",
      docs_url: "https://www.hippocraticai.com",
      pricing_url: "https://www.hippocraticai.com/contact"
    },
    
    {
      id: "teradata-healthcare-mcp",
      name: "Teradata MCP Server (Healthcare)",
      vendor: "Teradata",
      category: "vertical_healthcare",
      
      pricing: {
        model: "enterprise",
        price: "Contact",
        currency: "USD",
        notes: "Teradata Vantage platform pricing"
      },
      
      capabilities: {
        chat: 6,
        code: 5,
        analysis: 10,
        content: 5,
        vision: 4,
        voice: 4,
        agents: 9,
        integrations: 8
      },
      
      mcp_support: "yes",
      mcp_server_count: 20,
      mcp_notes: "MCP-native architecture, enterprise data platform",
      agentic_level: "L4",
      agentic_capabilities: ["Claims automation", "Prior auth", "FHIR integration", "Fraud detection"],
      
      compliance_ready: ["HIPAA", "SOC2", "HITRUST"],
      data_residency: ["US", "EU", "Self-hosted"],
      encryption: "Enterprise-grade",
      audit_logging: true,
      sso_support: ["SAML", "LDAP", "AD"],
      
      integration_complexity: 5,
      integration_notes: "Enterprise data platform, significant implementation",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["Healthcare Payers", "Insurance"],
      mip_category: "build",
      human_oversight: "Compliance workflows",
      
      priority: "HIGH",
      int_verdict: "MCP for healthcare data. Claims and prior auth automation. 2026 FHIR mandate ready.",
      int_use_cases: [
        "Claims review automation",
        "Prior authorization (2026 FHIR)",
        "Fraud detection",
        "Member experience AI",
        "Predictive analytics"
      ],
      deployment_time: "Months",
      training_required: "40+ hours",
      
      market_share: 0.08,
      growth_rate: 0.50,
      enterprise_adoption: 0.12,
      
      url: "https://www.teradata.com/solutions/healthcare",
      docs_url: "https://docs.teradata.com",
      pricing_url: "https://www.teradata.com/contact"
    },
    
    {
      id: "epic-ai",
      name: "Epic AI",
      vendor: "Epic Systems",
      category: "vertical_healthcare",
      
      pricing: {
        model: "enterprise",
        price: "Contact",
        currency: "USD",
        notes: "Part of Epic EHR licensing"
      },
      
      capabilities: {
        chat: 7,
        code: 3,
        analysis: 9,
        content: 7,
        vision: 6,
        voice: 6,
        agents: 7,
        integrations: 9
      },
      
      mcp_support: "no",
      mcp_server_count: 0,
      mcp_notes: "Proprietary Epic ecosystem",
      agentic_level: "L3",
      agentic_capabilities: ["Clinical decision support", "Documentation assist", "MyChart AI", "Predictive analytics"],
      
      compliance_ready: ["HIPAA", "HITRUST"],
      data_residency: ["US", "Self-hosted"],
      encryption: "Epic security model",
      audit_logging: true,
      sso_support: ["Epic authentication"],
      
      integration_complexity: 5,
      integration_notes: "Requires Epic EHR implementation",
      api_available: true,
      sdk_available: false,
      
      vertical_fit: ["Healthcare Providers"],
      mip_category: "buy",
      human_oversight: "Clinical oversight required",
      
      priority: "WATCH",
      int_verdict: "EHR leader AI. Only relevant if client on Epic. Deep clinical integration.",
      int_use_cases: [
        "Clinical decision support",
        "Documentation assistance",
        "Patient portal AI (MyChart)",
        "Revenue cycle AI",
        "Population health"
      ],
      deployment_time: "Months to years",
      training_required: "Extensive (Epic training)",
      
      market_share: 0.35,
      growth_rate: 0.30,
      enterprise_adoption: 0.40,
      
      url: "https://www.epic.com",
      docs_url: "https://userweb.epic.com",
      pricing_url: "https://www.epic.com/contact"
    },

    // =========================================
    // CATEGORY 12: DATA & ANALYTICS AI (3)
    // =========================================
    
    {
      id: "databricks-ai",
      name: "Databricks AI/ML",
      vendor: "Databricks",
      category: "data_analytics",
      
      pricing: {
        model: "usage",
        price: "Varies",
        currency: "USD",
        notes: "DBU-based consumption pricing"
      },
      
      capabilities: {
        chat: 7,
        code: 8,
        analysis: 10,
        content: 6,
        vision: 6,
        voice: 4,
        agents: 8,
        integrations: 9
      },
      
      mcp_support: "partial",
      mcp_server_count: 5,
      mcp_notes: "Emerging MCP support for data access",
      agentic_level: "L3",
      agentic_capabilities: ["MLflow", "Model serving", "Feature store", "AutoML"],
      
      compliance_ready: ["SOC2", "ISO27001", "HIPAA", "FedRAMP", "PCI-DSS"],
      data_residency: ["US", "EU", "APAC", "Global"],
      encryption: "AES-256, TLS 1.3",
      audit_logging: true,
      sso_support: ["SAML", "OIDC", "Azure AD"],
      
      integration_complexity: 4,
      integration_notes: "Data platform, requires data engineering",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["Enterprise", "Finance", "Healthcare", "Retail"],
      mip_category: "build",
      human_oversight: "Data governance policies",
      
      priority: "MEDIUM",
      int_verdict: "Data lakehouse leader. Best for clients with significant data needs.",
      int_use_cases: [
        "ML model development",
        "Data lakehouse",
        "Feature engineering",
        "Model serving at scale",
        "Unified analytics"
      ],
      deployment_time: "Weeks to months",
      training_required: "40+ hours",
      
      market_share: 0.18,
      growth_rate: 0.45,
      enterprise_adoption: 0.30,
      
      url: "https://www.databricks.com",
      docs_url: "https://docs.databricks.com",
      pricing_url: "https://www.databricks.com/product/pricing"
    },
    
    {
      id: "snowflake-cortex",
      name: "Snowflake Cortex",
      vendor: "Snowflake",
      category: "data_analytics",
      
      pricing: {
        model: "usage",
        price: "Varies",
        currency: "USD",
        notes: "Credit-based consumption"
      },
      
      capabilities: {
        chat: 7,
        code: 6,
        analysis: 9,
        content: 6,
        vision: 5,
        voice: 4,
        agents: 7,
        integrations: 8
      },
      
      mcp_support: "partial",
      mcp_server_count: 3,
      mcp_notes: "Emerging MCP for data warehouse access",
      agentic_level: "L3",
      agentic_capabilities: ["LLM functions", "Document AI", "Search", "ML"],
      
      compliance_ready: ["SOC2", "ISO27001", "HIPAA", "FedRAMP", "PCI-DSS"],
      data_residency: ["US", "EU", "APAC", "Global"],
      encryption: "AES-256, TLS 1.3",
      audit_logging: true,
      sso_support: ["SAML", "OIDC"],
      
      integration_complexity: 3,
      integration_notes: "Native to Snowflake, SQL-first",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["Enterprise", "Finance", "Retail", "Healthcare"],
      mip_category: "build",
      human_oversight: "Data access controls",
      
      priority: "MEDIUM",
      int_verdict: "AI in the data warehouse. Best for Snowflake customers wanting native AI.",
      int_use_cases: [
        "SQL-based AI queries",
        "Document understanding",
        "Semantic search over data",
        "ML predictions in SQL",
        "Data-grounded AI"
      ],
      deployment_time: "Days to weeks",
      training_required: "8-16 hours",
      
      market_share: 0.22,
      growth_rate: 0.40,
      enterprise_adoption: 0.35,
      
      url: "https://www.snowflake.com/en/data-cloud/cortex/",
      docs_url: "https://docs.snowflake.com/en/guides-overview-ai-features",
      pricing_url: "https://www.snowflake.com/en/data-cloud/pricing/"
    },
    
    {
      id: "thoughtspot",
      name: "ThoughtSpot",
      vendor: "ThoughtSpot",
      category: "data_analytics",
      
      pricing: {
        model: "contact",
        price: "Contact",
        currency: "USD",
        notes: "Per-user enterprise pricing"
      },
      
      capabilities: {
        chat: 8,
        code: 4,
        analysis: 9,
        content: 7,
        vision: 7,
        voice: 5,
        agents: 6,
        integrations: 8
      },
      
      mcp_support: "no",
      mcp_server_count: 0,
      mcp_notes: "No MCP, BI-focused integrations",
      agentic_level: "L2",
      agentic_capabilities: ["Natural language search", "AI-generated insights", "Automated analysis", "SpotIQ"],
      
      compliance_ready: ["SOC2", "ISO27001", "GDPR", "HIPAA"],
      data_residency: ["US", "EU"],
      encryption: "AES-256, TLS 1.2+",
      audit_logging: true,
      sso_support: ["SAML", "OIDC"],
      
      integration_complexity: 3,
      integration_notes: "Connects to data warehouses, embedded analytics",
      api_available: true,
      sdk_available: true,
      
      vertical_fit: ["Enterprise", "Retail", "Finance"],
      mip_category: "buy",
      human_oversight: "Analyst review",
      
      priority: "MEDIUM",
      int_verdict: "Natural language BI. Ask questions, get visualizations. Democratizes analytics.",
      int_use_cases: [
        "Self-service analytics",
        "Natural language queries",
        "Automated insights",
        "Embedded analytics",
        "Executive dashboards"
      ],
      deployment_time: "Weeks",
      training_required: "4-8 hours",
      
      market_share: 0.05,
      growth_rate: 0.35,
      enterprise_adoption: 0.12,
      
      url: "https://www.thoughtspot.com",
      docs_url: "https://docs.thoughtspot.com",
      pricing_url: "https://www.thoughtspot.com/pricing"
    }
  ],

  // ===========================================
  // AGGREGATED STATISTICS
  // ===========================================
  
  statistics: {
    total_platforms: 49,
    total_categories: 12,
    mcp_support_breakdown: {
      yes: 22,
      partial: 6,
      roadmap: 4,
      no: 17
    },
    agentic_level_breakdown: {
      L1: 0,
      L2: 12,
      L3: 18,
      L4: 14,
      L5: 5
    },
    priority_breakdown: {
      CRITICAL: 4,
      HIGH: 23,
      MEDIUM: 18,
      WATCH: 3,
      EVALUATE: 1
    },
    average_integration_complexity: 2.4,
    compliance_coverage: {
      SOC2: 45,
      HIPAA: 28,
      ISO27001: 35,
      GDPR: 38,
      FedRAMP: 12
    }
  },

  // ===========================================
  // HELPER FUNCTIONS
  // ===========================================
  
  helpers: {
    getPlatformsByCategory: function(categoryId) {
      return PLATFORM_EXPLORER_V5.platforms.filter(p => p.category === categoryId);
    },
    
    getPlatformsByMCPSupport: function(support) {
      return PLATFORM_EXPLORER_V5.platforms.filter(p => p.mcp_support === support);
    },
    
    getPlatformsByPriority: function(priority) {
      return PLATFORM_EXPLORER_V5.platforms.filter(p => p.priority === priority);
    },
    
    getPlatformsByAgenticLevel: function(level) {
      return PLATFORM_EXPLORER_V5.platforms.filter(p => p.agentic_level === level);
    },
    
    getPlatformsByCompliance: function(framework) {
      return PLATFORM_EXPLORER_V5.platforms.filter(p => 
        p.compliance_ready && p.compliance_ready.includes(framework)
      );
    },
    
    calculateMCPReadinessScore: function(platform) {
      let score = 0;
      
      // MCP Support (40 points)
      if (platform.mcp_support === 'yes') score += 40;
      else if (platform.mcp_support === 'partial') score += 20;
      else if (platform.mcp_support === 'roadmap') score += 10;
      
      // MCP Server Count (20 points)
      if (platform.mcp_server_count >= 100) score += 20;
      else if (platform.mcp_server_count >= 50) score += 15;
      else if (platform.mcp_server_count >= 20) score += 10;
      else if (platform.mcp_server_count >= 5) score += 5;
      
      // Agentic Level (20 points)
      const agenticScores = { L5: 20, L4: 16, L3: 12, L2: 8, L1: 4 };
      score += agenticScores[platform.agentic_level] || 0;
      
      // Integration Complexity inverse (10 points)
      score += (6 - platform.integration_complexity) * 2;
      
      // API/SDK availability (10 points)
      if (platform.api_available) score += 5;
      if (platform.sdk_available) score += 5;
      
      return Math.min(100, score);
    },
    
    calculateMIPReadinessScore: function(platform) {
      let score = 0;
      
      // Agentic capabilities (30 points)
      const agenticScores = { L5: 30, L4: 24, L3: 18, L2: 12, L1: 6 };
      score += agenticScores[platform.agentic_level] || 0;
      
      // MCP support (25 points)
      if (platform.mcp_support === 'yes') score += 25;
      else if (platform.mcp_support === 'partial') score += 15;
      else if (platform.mcp_support === 'roadmap') score += 8;
      
      // Compliance (20 points)
      const complianceCount = platform.compliance_ready ? platform.compliance_ready.length : 0;
      score += Math.min(20, complianceCount * 4);
      
      // MIP Category (15 points)
      if (platform.mip_category === 'broker') score += 15;
      else if (platform.mip_category === 'buy') score += 10;
      else if (platform.mip_category === 'build') score += 5;
      
      // Integration ease (10 points)
      score += (6 - platform.integration_complexity) * 2;
      
      return Math.min(100, score);
    }
  }
};

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PLATFORM_EXPLORER_V5;
}
