# AI Agents & Automation Workflow Skill - Installation Guide

## What This Skill Provides

A comprehensive framework for building production-ready AI agents and automation workflows across the modern AI ecosystem, including:

**Architectures**:
- MCP Servers (Claude-native tool integration)
- LangChain Agents (Python ecosystem, single agent)
- CrewAI Workflows (Multi-agent collaboration)
- Multi-LLM Orchestration (Cost/speed optimization)
- No-Code Integrations (Zapier, Make)

**Integrations**: GitHub, Notion, HubSpot, Sentry, Vercel, Cloudflare, Playwright, Canva, Cloudinary, Google ecosystem, Hugging Face

**Features**:
- Security-first templates with input validation, rate limiting, auth
- Pre-built integration recipes (GitHub PR review, Notion RAG, etc.)
- Deployment guides for Vercel, Cloudflare Workers, Docker
- Testing & validation scripts

## Installation

1. **Download** `ai-agents-workflow.zip`

2. **Extract to Skills Directory**:

   **macOS/Linux**:
   ```bash
   unzip ai-agents-workflow.zip -d ~/.claude/skills/
   ```

   **Windows**:
   ```powershell
   Expand-Archive ai-agents-workflow.zip -DestinationPath %APPDATA%\Claude\skills\
   ```

3. **Restart Claude** (desktop or web app)

4. **Verify**: Ask Claude "Can you help me build an MCP server?" - it should automatically use this skill

## Quick Start Examples

### Example 1: Build an MCP Server

**You**: "Create an MCP server that integrates with GitHub to review pull requests"

**Claude will**:
1. Read `references/mcp-servers.md` for patterns
2. Run `scripts/init_mcp_server.py github-reviewer`
3. Generate server code with security checks
4. Provide `.env.example` with required tokens
5. Give installation instructions

### Example 2: Create a Multi-Agent Workflow

**You**: "Build a CrewAI workflow where one agent researches topics and another writes blog posts"

**Claude will**:
1. Read `references/agent-frameworks.md` § CrewAI
2. Run `scripts/init_crewai_workflow.py blog-pipeline`
3. Define Researcher and Writer agents
4. Set up task dependencies
5. Provide deployment options

### Example 3: Set Up Smart LLM Routing

**You**: "I want to route simple questions to GPT-4o-mini and complex coding tasks to Claude Sonnet"

**Claude will**:
1. Read `references/multi-llm-patterns.md`
2. Implement task-based routing logic
3. Show cost comparison
4. Provide caching strategy
5. Give Vercel deployment code

## Skill Structure

```
ai-agents-workflow/
├── SKILL.md                          # Main orchestration guide
├── references/
│   ├── mcp-servers.md                # Full MCP development guide
│   ├── multi-llm-patterns.md         # LLM routing strategies
│   ├── tool-integrations.md          # API integration recipes
│   ├── agent-frameworks.md           # LangChain/CrewAI patterns
│   ├── deployment.md                 # Platform deployment guides
│   └── security-checklist.md         # Security requirements
├── scripts/
│   ├── init_mcp_server.py            # Generate MCP server boilerplate
│   ├── init_langchain_agent.py       # Generate LangChain agent
│   ├── init_crewai_workflow.py       # Generate CrewAI workflow
│   ├── validate_workflow.py          # Security validation
│   └── test_integration.py           # Integration testing
└── assets/
    ├── mcp-templates/                # MCP server templates
    ├── workflow-templates/           # Zapier/Make JSONs
    ├── agent-configs/                # Agent configurations
    └── deployment-configs/           # Platform configs
```

## When This Skill Triggers

Claude will automatically use this skill when you:
- Mention "MCP server", "automation", "agent", "workflow"
- Reference tools like "Zapier", "Make", "LangChain", "CrewAI"
- Ask to integrate with "GitHub", "Notion", "HubSpot", "Sentry", etc.
- Request "multi-LLM", "LLM routing", or "cost optimization"
- Need "deployment" to Vercel, Cloudflare, etc.

## Key Patterns

### Pattern 1: MCP Server
**Best for**: Claude desktop/web tool integration  
**Use**: `scripts/init_mcp_server.py <name>`  
**Reference**: `references/mcp-servers.md`

### Pattern 2: LangChain Agent
**Best for**: Python ecosystem, single agent with tools  
**Use**: `scripts/init_langchain_agent.py <name>`  
**Reference**: `references/agent-frameworks.md` § LangChain

### Pattern 3: CrewAI Workflow
**Best for**: Multi-agent collaboration  
**Use**: `scripts/init_crewai_workflow.py <name>`  
**Reference**: `references/agent-frameworks.md` § CrewAI

### Pattern 4: Multi-LLM Router
**Best for**: Cost/speed/capability optimization  
**Reference**: `references/multi-llm-patterns.md`

### Pattern 5: No-Code (Zapier/Make)
**Best for**: Non-technical stakeholder modifications  
**Reference**: `references/tool-integrations.md` § No-Code

## Security Features

All templates include:
- ✅ Input validation (type checks, bounds, whitelists)
- ✅ Secrets via environment variables only
- ✅ Rate limiting (prevent abuse)
- ✅ Auth/permissions (least privilege)
- ✅ Error handling (cause→fix→retry pattern)
- ✅ `.env.example` with placeholders
- ✅ Validation script (`scripts/validate_workflow.py`)

## Integration Coverage

**LLMs**: Claude (Anthropic), GPT (OpenAI), Gemini (Google)  
**Frameworks**: LangChain, LangGraph, CrewAI, AutoGen  
**No-Code**: Zapier, Make  
**Deployment**: Vercel, Cloudflare Workers, Railway, Docker  
**APIs**: GitHub, Notion, HubSpot, Sentry, Slack, Google Workspace  
**Automation**: Playwright (browser), Cloudinary (assets), Canva  
**Data**: Pinecone, Weaviate, Chroma (vector DBs)

## Troubleshooting

**Skill not triggering?**
- Restart Claude after installation
- Use trigger keywords: "MCP", "agent", "automation", "workflow"

**Scripts not executable?**
```bash
chmod +x ~/.claude/skills/ai-agents-workflow/scripts/*.py
```

**Need more examples?**
- See `references/tool-integrations.md` for 10+ API recipes
- See `references/agent-frameworks.md` for framework examples

## Next Steps

1. **Try a quick start**: Ask Claude "Create an MCP server for [your use case]"
2. **Explore references**: Each reference file has detailed patterns and examples
3. **Customize templates**: Modify scripts in `assets/` for your specific needs
4. **Build complex workflows**: Combine multiple patterns (e.g., MCP + Playwright + Notion)

## Support

- **Questions**: Ask Claude - it has access to all skill documentation
- **Updates**: Download latest version from skill creator
- **Customization**: Edit reference files to add your own patterns

---

**Built with**: skill-creator skill  
**Version**: 1.0  
**Maintained by**: Claude & You
