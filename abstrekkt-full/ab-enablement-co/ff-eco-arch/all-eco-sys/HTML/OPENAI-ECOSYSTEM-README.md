# OpenAI Ecosystem: Complete Integration Guide

**TL;DR:** Comprehensive guide to OpenAI's AI ecosystem covering ChatGPT models (GPT-4o, GPT-5, o-series), Custom GPTs, Actions, MCP integration, Sora video generation, and Codex coding agents.

**Last Updated:** December 2025 | **Ecosystem Status:** Production + Beta Features

---

## Executive Summary

OpenAI's ecosystem provides enterprise-grade AI capabilities across:
- **ChatGPT**: Conversational AI with 8+ model variants (GPT-4o, GPT-5, o3, o4-mini, GPT-4.1)
- **Custom GPTs**: No-code AI assistants with actions, knowledge bases, and tool calling
- **MCP Protocol**: Standardized integration for read/write operations with external tools
- **Apps (Connectors)**: Pre-built and custom integrations with 100+ services
- **Sora**: Video generation with audio (up to 20s, 1080p, Disney characters licensed)
- **Codex**: Autonomous coding agent (CLI, IDE, cloud) with GPT-5.2-Codex model
- **API Platform**: Programmatic access to all models, fine-tuning, embeddings

---

## 5-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ USER EXPERIENCE LAYER                                        │
│ ChatGPT Web | Mobile | Desktop | Sora App | Codex CLI/IDE   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ INTELLIGENCE LAYER                                           │
│ GPT-4o | GPT-5 | o3/o4-mini | GPT-4.1 | GPT-5.2-Codex       │
│ DALL·E 3 | Sora 2 | Whisper | Embeddings                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ INTEGRATION LAYER                                            │
│ Custom GPTs | Actions (OpenAPI) | MCP Servers (1,400+)      │
│ Apps (100+) | Apps SDK | Responses API | Tool Calling       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ DATA LAYER                                                   │
│ Knowledge Bases | Vector Search | File Search               │
│ GitHub | Google Drive | Notion | Slack | Linear             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ INFRASTRUCTURE LAYER                                         │
│ OpenAI API Platform | OAuth 2.0 | C2PA Watermarks           │
│ Rate Limits | Usage Credits | Audit Logs | Compliance       │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start Paths

### Path 1: Conversational AI (Fastest)
**Goal:** Start using ChatGPT for everyday tasks  
**Time:** 5 minutes  
**Plan:** Free → Plus → Pro  

1. Sign up at chatgpt.com (Free tier includes GPT-4o with limits)
2. Upgrade to Plus ($20/mo) for GPT-4o, o3, o4-mini, Sora access
3. Upgrade to Pro ($200/mo) for unlimited GPT-4o, o3-pro, advanced voice, deep research

**Use Cases:** Writing, research, coding help, data analysis, image generation

---

### Path 2: Custom GPTs (Build No-Code AI Assistants)
**Goal:** Create specialized AI assistants with custom knowledge  
**Time:** 30 minutes  
**Prerequisites:** ChatGPT Plus/Pro/Team/Enterprise  

1. Click "Explore GPTs" → "Create a GPT"
2. Configure: Name, description, instructions, conversation starters
3. Add Knowledge: Upload documents (PDF, DOCX, TXT, code)
4. Enable Capabilities: Web browsing, DALL·E, Code Interpreter, 4o Image Generation
5. Add Actions (optional): Connect to external APIs via OpenAPI schema
6. Publish: Share link, publish to GPT Store, or keep private

**Use Cases:** Customer support bots, domain experts, data analysts, writing assistants

**Documentation:** `docs/custom-gpts.md`

---

### Path 3: MCP Integration (Connect External Tools)
**Goal:** Enable ChatGPT to read/write to your tools and data  
**Time:** 1-2 hours  
**Prerequisites:** Business/Enterprise/Edu plan, Developer Mode enabled  

1. **Enable Developer Mode:** Workspace Settings → Permissions & Roles → Developer Mode
2. **Choose Integration:**
   - **Pre-built Apps:** Enable from App Directory (GitHub, Notion, Slack, Stripe, etc.)
   - **Custom MCP Server:** Build Node.js/Python server implementing MCP protocol
3. **Configure MCP Server:**
   - Expose tools (read/write operations)
   - Set up OAuth/API key authentication
   - Deploy to public URL or use SSE streaming
4. **Test in ChatGPT:** Developer Mode → Add MCP server → Test with prompts
5. **Publish:** Workspace admin approves and publishes to team

**Use Cases:** CRM integration, project management, data syncing, workflow automation

**Documentation:** `docs/mcp-apps-connectors.md`, `docs/api-integration.md`

---

### Path 4: Sora Video Generation
**Goal:** Create AI-generated videos with audio  
**Time:** 10 minutes  
**Prerequisites:** ChatGPT Plus/Pro (US, Canada, Japan, Korea, Thailand, Vietnam, Taiwan)  

1. Go to sora.com or open Sora app (iOS/Android)
2. Create video: Text prompt, image-to-video, or storyboard
3. Configure: Duration (5-20s), aspect ratio (16:9, 9:16, 1:1), resolution (480p-1080p)
4. Generate: Wait 30-60 seconds
5. Edit: Remix, blend, loop, stitch, add characters

**Limits:**
- **Plus:** 50 videos/month (480p) or fewer at 720p
- **Pro:** 500 videos/month (up to 1080p, 20s duration)

**Use Cases:** Social media content, marketing videos, storytelling, concept demos

**Documentation:** `docs/sora.md`

---

## Model Selection Guide

| Model | Speed | Cost | Best For | Context | Plan |
|-------|-------|------|----------|---------|------|
| **GPT-4o** | Fast | Low | General tasks, coding, analysis | 128k | Free (limited), Plus+ |
| **GPT-5** | Medium | Medium | Complex reasoning, long documents | 196k | Plus+ (3k msgs/week) |
| **o3** | Slow | High | Hard problems, multi-step reasoning | 200k | Plus/Pro/Team/Enterprise |
| **o4-mini** | Fast | Low | Math, coding, STEM, high volume | 200k | Plus+ |
| **GPT-4.1** | Medium | Medium | Coding, instruction following, 1M context | 1M | Plus+ (API only in ChatGPT) |
| **GPT-4.5** | Slow | Highest | Creative, nuanced, high EQ tasks | 128k | Pro/Enterprise (research preview) |
| **o3-pro** | Very Slow | Highest | Mission-critical, expert-level work | 200k | Pro/Team/Enterprise |
| **GPT-5.2-Codex** | Medium | Medium | Agentic coding, long refactors | 1M | Codex CLI/API |

**Decision Tree:**
- **Quick task?** → GPT-4o or o4-mini
- **Deep thinking?** → o3 or o3-pro
- **Long documents (100K+ tokens)?** → GPT-4.1 or GPT-5
- **Coding?** → GPT-4.1 or Codex (GPT-5.2-Codex)
- **Creative writing?** → GPT-4.5 or GPT-5

---

## Pricing (December 2025)

### ChatGPT Plans

| Plan | Price | Models | Limits | Best For |
|------|-------|--------|--------|----------|
| **Free** | $0 | GPT-4o (limited) | ~20 msgs/3hrs on 4o | Casual use |
| **Plus** | $20/mo | GPT-4o, o3, o4-mini, GPT-4.1 mini | 80 msgs/3hrs on 4o | Power users |
| **Pro** | $200/mo | All models (unlimited 4o, o3-pro) | Unlimited 4o, 5k o3 | Professionals |
| **Team** | $30/user/mo | All Plus models + admin tools | Higher limits | Small teams (2-149) |
| **Business** | $60/user/mo | Team + MCP write, Codex | Business limits | Teams (up to 149) |
| **Enterprise** | Custom | All models + SOC 2, SSO, SLA | Custom | 150+ users |

### API Pricing (per 1M tokens)

| Model | Input | Output | Batch (50% off) |
|-------|-------|--------|-----------------|
| GPT-4o | $2.50 | $10.00 | $1.25 / $5.00 |
| GPT-4o mini | $0.15 | $0.60 | $0.075 / $0.30 |
| o3 | $15.00 | $60.00 | $7.50 / $30.00 |
| o4-mini | $3.00 | $12.00 | $1.50 / $6.00 |
| GPT-4.1 | $3.00 | $15.00 | $1.50 / $7.50 |

### Sora Pricing
- **Plus:** Included (50 videos/month at 480p)
- **Pro:** Included (500 videos/month at 1080p)
- **Credits:** Buy additional usage ($10 for ~25 videos)

### Codex Pricing
- **ChatGPT Plans:** Included usage (Plus/Pro/Business/Enterprise)
- **API:** Same as GPT-5 ($30/$120 per 1M tokens)
- **Credits:** On-demand credits for extra usage

---

## Integration Capabilities

### 1. Custom GPTs (No-Code)
- **Knowledge Bases:** Upload up to 20 files (512 MB total)
- **Actions:** Connect to external APIs via OpenAPI schema
- **Tools:** Web browsing, DALL·E, Code Interpreter, 4o Image Generation
- **Model Selection:** Choose from GPT-4o, o3, o4-mini, GPT-4.1
- **Sharing:** Private, link-only, or GPT Store

### 2. Actions (API Integration)
- **Protocol:** OpenAPI 3.0/3.1 schema
- **Authentication:** None, API Key, OAuth 2.0
- **Methods:** GET, POST, PUT, DELETE, PATCH
- **Limitations:** GPTs with actions support GPT-4o and GPT-4.1 only (not o-series yet)

### 3. MCP Protocol (Full Integration)
- **Support:** Full read/write in Developer Mode (Business/Enterprise/Edu)
- **Protocols:** SSE (Server-Sent Events), Streaming HTTP
- **Auth:** OAuth 2.0, API keys
- **Tool Types:** Fetch, search, write, modify, delete
- **Confirmation:** Manual approval required for write actions
- **Pre-built Servers:** 1,400+ MCP servers available (GitHub, Notion, Stripe, etc.)

### 4. Apps (Pre-Built Connectors)
- **Directory:** 100+ apps (Gmail, Google Calendar, Slack, GitHub, Notion, Linear, etc.)
- **Types:** 
  - **Search/Fetch:** Read-only access to data
  - **Interactive UI:** Embedded experiences in chat
  - **Write Actions:** Modify data (requires Developer Mode)
- **Company Knowledge:** Sync internal docs for search/reference

### 5. Apps SDK
- **Build:** Custom apps with MCP-backed tools
- **Publish:** Submit to ChatGPT App Directory
- **Monetization:** TBD (not yet available)

---

## Key Features

### ChatGPT Capabilities
- **Advanced Voice:** Natural intonation, real-time conversation (Plus/Pro)
- **Canvas:** Collaborative editing interface (code and writing)
- **Deep Research:** Autonomous multi-source research with citations (Pro/Enterprise)
- **Projects:** Organize conversations with custom instructions and files
- **Memory:** Remember user preferences across chats
- **Scheduled Tasks:** Run prompts on a schedule (o3/o4-mini)
- **Search:** Web search with citations (all models)
- **ChatGPT Record:** Meeting transcription and summaries (Pro/Enterprise/Edu, macOS only)

### Sora Features
- **Generation:** Text-to-video, image-to-video, video-to-video
- **Duration:** 5-20 seconds (Plus: 10-15s, Pro: up to 25s with storyboard)
- **Resolution:** 480p, 720p, 1080p
- **Audio:** Synchronized dialogue, sound effects, music (automatic)
- **Characters:** Create cameos of yourself, pets, or original personas
- **Editing:** Remix, blend, stitch, loop, re-cut
- **Styles:** Thankful, Vintage, Comic, News, Musical, Selfie (6 presets)
- **Storyboard:** Frame-by-frame control (Pro users, web only)
- **Disney Characters:** 200+ licensed characters (early 2026)

### Codex Features
- **Codex CLI:** Terminal-based coding agent (open source, Rust)
- **IDE Extension:** VS Code, Cursor, Windsurf integration
- **Codex Cloud:** Autonomous multi-task agent with sandboxes
- **Skills:** Reusable instruction bundles ($skill-creator, $skill-installer)
- **MCP Integration:** Connect to external tools
- **GitHub Integration:** PR reviews, @codex mentions, automated workflows
- **Slack/Linear:** Assign tasks, get updates
- **Models:** GPT-5.2-Codex, GPT-5-Codex, GPT-5-Codex-Mini

---

## Security & Compliance

### Authentication
- **OAuth 2.0:** ChatGPT login for all products
- **API Keys:** Platform.openai.com for API access
- **SSO:** Enterprise plans (SAML, Okta, Azure AD)

### Data Protection
- **Encryption:** TLS 1.3 in transit, AES-256 at rest
- **Data Retention:** 30 days (API), opt-out training (Business/Enterprise)
- **Audit Logs:** Available for Enterprise/Edu
- **C2PA Metadata:** Watermarks on Sora videos, DALL·E images

### Compliance
- **SOC 2 Type 2:** Available for Enterprise
- **GDPR:** Data subject rights, export, deletion
- **HIPAA:** BAA available for Enterprise (API only)
- **Data Processing Addendum:** Available for all paid plans

### Safety Guardrails
- **Content Filters:** Blocks CSAM, violence, hate speech, illegal content
- **Deepfake Protection:** Explicit confirmation for cameos (Sora)
- **MCP Write Confirmation:** Manual approval for all write operations
- **Rate Limits:** Prevent abuse, ensure stability

---

## Documentation Structure

**Core Docs:**
1. `docs/chatgpt-models.md` - Model capabilities, selection guide
2. `docs/custom-gpts.md` - Building Custom GPTs, actions, knowledge
3. `docs/gpt-actions.md` - API integrations, OpenAPI schema, auth
4. `docs/mcp-apps-connectors.md` - MCP protocol, Apps, custom connectors
5. `docs/api-integration.md` - Responses API, Agents SDK, tool calling
6. `docs/sora.md` - Video generation, features, limits
7. `docs/codex.md` - CLI, IDE, cloud agent, skills
8. `docs/INTEGRATION-MAP.md` - Architecture, data flows, troubleshooting

**Config Files:**
- `configs/custom-gpt-template.json` - GPT configuration schema
- `configs/mcp-server-example.js` - Node.js MCP server template
- `configs/codex-config.toml` - Codex CLI configuration
- `configs/.env.example` - Environment variables

---

## Common Integration Patterns

### Pattern 1: Custom GPT with Knowledge Base
**Use Case:** Domain-specific expert (legal, medical, technical)  
**Components:** Custom GPT + knowledge files  
**Latency:** <2s  
**Security:** Private knowledge, no external APIs

### Pattern 2: Custom GPT with Actions
**Use Case:** CRM integration, booking systems  
**Components:** Custom GPT + OpenAPI actions  
**Latency:** 2-5s (API-dependent)  
**Security:** OAuth 2.0, API key rotation

### Pattern 3: MCP Full Write Integration
**Use Case:** Project management, data syncing  
**Components:** MCP server + Developer Mode  
**Latency:** 2-10s (write confirmation)  
**Security:** Manual approval, audit logs, RBAC

### Pattern 4: Apps + Company Knowledge
**Use Case:** Internal search, documentation  
**Components:** Pre-built apps + sync  
**Latency:** 1-3s  
**Security:** Read-only by default

### Pattern 5: Codex Autonomous Coding
**Use Case:** Feature development, refactoring  
**Components:** Codex Cloud + GitHub  
**Latency:** 1-30 minutes (async)  
**Security:** Sandboxed environments, PR review

---

## Getting Help

### Resources
- **Official Docs:** platform.openai.com/docs
- **Help Center:** help.openai.com
- **Developer Forum:** community.openai.com
- **API Status:** status.openai.com
- **GitHub:** github.com/openai

### Support Channels
- **Free/Plus:** Community forum, help center
- **Pro:** Email support (priority)
- **Business/Enterprise:** Dedicated support, Slack/MS Teams channel, SLA

### Common Issues
1. **MCP Connection Refused:** Verify URL, check OAuth scopes, validate server running
2. **Action Timeout:** Increase timeout, optimize API response, add retry logic
3. **Sora Queue Delays:** Pro users get priority; use off-peak hours
4. **Codex Approval Fatigue:** Use `--auto` mode in safe directories
5. **Rate Limit Exceeded:** Upgrade plan, use batch API, implement backoff

---

## What's Next?

**Coming Soon (Q1 2026):**
- Sora Disney characters (early 2026)
- GPT Store monetization (revenue sharing)
- Codex multi-agent workflows with mid-task guidance
- Advanced Data Analysis improvements
- GPT-5 Thinking generally available
- More MCP connectors (Salesforce, ServiceNow, etc.)

**Experimental (Beta):**
- Developer Mode (Business/Enterprise/Edu)
- GPT-5 series models
- Scheduled Tasks
- ChatGPT Record (macOS only)

---

## License & Terms

- **ChatGPT:** OpenAI Terms of Use (consumer or business)
- **API:** OpenAI API Terms, usage policies
- **Codex CLI:** MIT License (open source)
- **Sora:** Content ownership rights, C2PA watermarks required

**Training Opt-Out:**
- **Business/Enterprise:** Automatic opt-out
- **API:** Opt-out via platform settings
- **Consumer Plans:** Content may be used for training (opt-out available in settings)

---

**Questions?** See detailed docs in `docs/` folder or visit [OpenAI Platform Documentation](https://platform.openai.com/docs)
