# OpenAI Ecosystem - Integration Map

**Last Updated:** December 2025  
**Purpose:** Visual guide to component connections, data flows, and integration patterns across the OpenAI ecosystem.

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Integration Patterns](#integration-patterns)
3. [Data Flow Diagrams](#data-flow-diagrams)
4. [Component Connectivity Matrix](#component-connectivity-matrix)
5. [Common Integration Scenarios](#common-integration-scenarios)
6. [Security Boundaries](#security-boundaries)
7. [API Integration Flows](#api-integration-flows)
8. [Troubleshooting Integration Issues](#troubleshooting-integration-issues)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        OpenAI Ecosystem                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  ChatGPT     │  │   Codex      │  │    Sora      │             │
│  │  Web/Mobile  │  │  CLI/IDE     │  │  Video Gen   │             │
│  └───────┬──────┘  └───────┬──────┘  └───────┬──────┘             │
│          │                  │                  │                     │
│          └──────────────────┼──────────────────┘                     │
│                             │                                        │
│                    ┌────────▼────────┐                              │
│                    │  OpenAI Models  │                              │
│                    ├─────────────────┤                              │
│                    │ • GPT-4o        │                              │
│                    │ • GPT-5 series  │                              │
│                    │ • o3/o4-mini    │                              │
│                    │ • GPT-4.1       │                              │
│                    │ • Codex models  │                              │
│                    └────────┬────────┘                              │
│                             │                                        │
│          ┌──────────────────┼──────────────────┐                    │
│          │                  │                  │                     │
│  ┌───────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐             │
│  │ Custom GPTs  │  │  MCP Apps    │  │   API        │             │
│  │ (Actions)    │  │ (Connectors) │  │ Integration  │             │
│  └───────┬──────┘  └───────┬──────┘  └───────┬──────┘             │
│          │                  │                  │                     │
│          └──────────────────┼──────────────────┘                     │
│                             │                                        │
│                    ┌────────▼────────┐                              │
│                    │ External Systems │                             │
│                    ├─────────────────┤                              │
│                    │ • GitHub        │                              │
│                    │ • Notion        │                              │
│                    │ • Slack         │                              │
│                    │ • Linear        │                              │
│                    │ • Stripe        │                              │
│                    │ • Vercel        │                              │
│                    │ • Databases     │                              │
│                    │ • Custom APIs   │                              │
│                    └─────────────────┘                              │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Components:**

1. **ChatGPT Interface**: Web/mobile chat interface with access to all models
2. **Codex**: CLI/IDE/Cloud coding assistant
3. **Sora**: Video generation service
4. **Custom GPTs**: User-created assistants with custom instructions and Actions
5. **MCP Apps**: Model Context Protocol servers for tool integration
6. **API**: Direct programmatic access to models and capabilities

---

## Integration Patterns

### 1. Direct API Integration

**Pattern**: Application → OpenAI API → Model → Response

```
Your Application
    ↓ HTTP Request (JSON)
OpenAI API
    ↓ Process & Route
Model (GPT-4o, o3, etc.)
    ↓ Generate Response
API Response (JSON)
    ↓ Parse & Use
Your Application
```

**Use Cases:**
- Chatbots and virtual assistants
- Content generation tools
- Code completion/generation
- Data analysis pipelines

**Auth**: API Key (Bearer token)  
**Latency**: 1-10s depending on model and complexity  
**Cost**: Pay per token

**Example Flow:**
```javascript
// 1. Your app sends request
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
});

// 2. OpenAI processes
// 3. Model generates response
// 4. Your app receives result
const data = await response.json();
console.log(data.choices[0].message.content);
```

### 2. Custom GPT + Actions

**Pattern**: ChatGPT → Custom GPT → Action (Your API) → External Service

```
User in ChatGPT
    ↓ Message
Custom GPT (with instructions)
    ↓ Determine Action Needed
GPT Action (OpenAPI spec)
    ↓ HTTP Request (OAuth/API Key)
Your API Server
    ↓ Process & Call
External Service (Database, API, etc.)
    ↓ Return Data
Your API Server
    ↓ Format Response (JSON)
Custom GPT
    ↓ Natural Language Response
User in ChatGPT
```

**Use Cases:**
- Customer support with CRM integration
- Personal assistants with calendar/email access
- Business tools with internal database queries
- E-commerce with order management

**Auth**: OAuth 2.0 or API Key  
**Latency**: 2-15s (GPT + your API + external service)  
**Cost**: ChatGPT subscription + your infrastructure

**Example Action Schema:**
```json
{
  "openapi": "3.1.0",
  "paths": {
    "/orders/{orderId}": {
      "get": {
        "operationId": "getOrder",
        "parameters": [
          { "name": "orderId", "in": "path", "required": true }
        ]
      }
    }
  }
}
```

### 3. MCP App Integration

**Pattern**: ChatGPT → MCP Protocol → Your MCP Server → External Service

```
User in ChatGPT
    ↓ Message
ChatGPT with MCP App
    ↓ MCP Protocol (SSE or HTTP streaming)
Your MCP Server
    ↓ Tool Execution
External Service (GitHub, Notion, etc.)
    ↓ Return Data
Your MCP Server
    ↓ MCP Response
ChatGPT
    ↓ Natural Language Response
User in ChatGPT
```

**Use Cases:**
- GitHub issue/PR management
- Notion database queries
- Slack message posting
- Custom internal tools
- Multi-service orchestration

**Auth**: OAuth 2.0 (user grants access)  
**Latency**: 2-20s (depending on tool complexity)  
**Cost**: ChatGPT subscription + MCP server hosting

**Write Operations**: Require manual user confirmation in Business/Enterprise/Edu plans

**Example MCP Tool:**
```javascript
{
  name: 'create_github_issue',
  description: 'Create an issue in GitHub repository',
  inputSchema: {
    type: 'object',
    properties: {
      repo: { type: 'string' },
      title: { type: 'string' },
      body: { type: 'string' }
    }
  }
}
```

### 4. Codex Integration

**Pattern**: Developer → Codex CLI/IDE → Codex Model → File System/Git

```
Developer (Terminal or IDE)
    ↓ Command or Chat
Codex CLI/Extension
    ↓ Analyze Codebase
GPT-5.2-Codex (or variant)
    ↓ Generate Code/Changes
Codex CLI/Extension
    ↓ Write Files / Execute Commands
File System / Git Repository
    ↓ Confirmation (if needed)
Developer
```

**Use Cases:**
- Code refactoring
- Bug fixing
- Test generation
- Documentation writing
- Multi-file changes

**Auth**: API Key or ChatGPT subscription  
**Latency**: 5-60s for complex tasks  
**Cost**: Included in Plus/Pro or pay-per-token

**Integration Points:**
- GitHub: Auto-create PRs, respond to @mentions
- Slack: DM or channel interactions
- Linear: Task management, auto-updates
- MCP: Custom tool integration

### 5. Sora Video Generation

**Pattern**: User → Sora Interface → Sora 2 Model → Video File

```
User (ChatGPT Plus/Pro)
    ↓ Text/Image Prompt
Sora Interface (Web)
    ↓ Process Prompt
Sora 2 Model
    ↓ Generate Video + Audio
Sora Service
    ↓ Encode & Store
Video File (Download Link)
    ↓ Download
User's Device
```

**Use Cases:**
- Marketing video creation
- Product demonstrations
- Social media content
- Concept visualization
- Educational materials

**Auth**: ChatGPT Plus/Pro subscription  
**Latency**: 30s - 8min (depends on resolution/length)  
**Cost**: Included in subscription (quota limits)

**Future**: API access coming 2026 for programmatic generation

---

## Data Flow Diagrams

### ChatGPT Conversation Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                     ChatGPT Conversation                          │
└──────────────────────────────────────────────────────────────────┘

User Input
    │
    ▼
┌─────────────────┐
│ Web/Mobile UI   │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐     ┌──────────────────┐
│ ChatGPT Backend │────▶│ Memory Service   │ (User preferences)
└────────┬────────┘     └──────────────────┘
         │
         ├──▶ Custom GPT Instructions? ──Yes──▶ Load Instructions
         │                               │
         │                               No
         │                               │
         ▼                               ▼
┌─────────────────────────────────────────────┐
│          Model Selection                    │
│  • GPT-4o (default)                        │
│  • o3 (reasoning)                          │
│  • GPT-5.x (if Pro)                        │
└────────┬────────────────────────────────────┘
         │
         ▼
Does conversation need tools?
    │
    ├──Yes──▶ Web Search? ──▶ Fetch web content
    │         │
    │         Custom GPT Action? ──▶ Call external API (OAuth)
    │         │
    │         MCP App? ──▶ Execute MCP tool
    │
    ├──No
    │
    ▼
┌─────────────────┐
│ Model Inference │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Format Output  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Return to User  │
└─────────────────┘
```

### Custom GPT Action Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    Custom GPT with Action                         │
└──────────────────────────────────────────────────────────────────┘

User: "What's the weather in SF?"
    │
    ▼
┌──────────────────────────┐
│ Custom GPT Instructions  │ (Analyze user intent)
└────────┬─────────────────┘
         │
         ▼
Needs external data? ──No──▶ Respond directly
         │
        Yes
         │
         ▼
┌──────────────────────────┐
│   Select Action          │ (Match to OpenAPI operation)
└────────┬─────────────────┘
         │
         ▼
Authentication Required?
    │
    ├──Yes──▶ OAuth Flow ──▶ Get Access Token ──▶ Cache Token
    │                                              │
    ├──API Key──▶ Use Stored API Key ──────────────┤
    │                                              │
    ├──None (public API) ──────────────────────────┤
    │                                              │
    ▼                                              ▼
┌──────────────────────────────────────────────────────┐
│            Execute HTTP Request                      │
│  • Method: GET/POST/PUT/DELETE                      │
│  • Headers: Auth, Content-Type                      │
│  • Body: JSON payload from GPT                      │
└────────┬─────────────────────────────────────────────┘
         │
         ▼
Your API Server
    │
    ├──▶ Validate Request
    ├──▶ Process Business Logic
    ├──▶ Query Database / External Service
    └──▶ Format Response (JSON)
         │
         ▼
┌──────────────────────────┐
│   Return to ChatGPT      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Format as Natural       │
│  Language Response       │
└────────┬─────────────────┘
         │
         ▼
User: "It's 72°F and sunny in San Francisco"
```

### MCP App Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                   MCP App (e.g., GitHub)                          │
└──────────────────────────────────────────────────────────────────┘

User: "Create an issue in my repo"
    │
    ▼
┌──────────────────────────┐
│   ChatGPT identifies     │ (Need to use GitHub MCP app)
│   relevant MCP app       │
└────────┬─────────────────┘
         │
         ▼
User has connected GitHub?
    │
    ├──No──▶ Prompt to connect ──▶ OAuth flow ──▶ Store token
    │                                             │
    ├──Yes (already connected) ───────────────────┤
    │                                             │
    ▼                                             ▼
┌──────────────────────────────────────────────────────┐
│         MCP Protocol (SSE or HTTP Streaming)         │
│  ChatGPT ──▶ MCP Server ──▶ GitHub API              │
└────────┬─────────────────────────────────────────────┘
         │
         ▼
MCP Server receives tool call:
{
  "tool": "create_issue",
  "arguments": {
    "repo": "user/repo",
    "title": "Bug: Login fails",
    "body": "Description..."
  }
}
    │
    ▼
┌──────────────────────────┐
│  Execute Tool            │
│  • Call GitHub API       │
│  • Create issue          │
│  • Return issue URL      │
└────────┬─────────────────┘
         │
         ▼
Is this a write operation?
    │
    ├──Yes ──▶ Enterprise/Edu/Business?
    │               │
    │               ├──Yes──▶ Request user confirmation
    │               │             │
    │               │            User confirms?
    │               │             │
    │               │            Yes──▶ Execute
    │               │             │
    │               │            No──▶ Abort
    │               │
    │               No (Plus/Pro) ──▶ Execute directly
    │
    ├──No (read operation) ──▶ Execute directly
    │
    ▼
┌──────────────────────────┐
│  Return to ChatGPT       │
└────────┬─────────────────┘
         │
         ▼
User: "Created issue #42: https://github.com/user/repo/issues/42"
```

### Codex Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│                   Codex CLI/IDE Workflow                          │
└──────────────────────────────────────────────────────────────────┘

Developer: `codex "refactor auth to use JWT"`
    │
    ▼
┌──────────────────────────┐
│  Codex CLI/Extension     │
└────────┬─────────────────┘
         │
         ▼
Analyze codebase:
  • Read relevant files
  • Understand dependencies
  • Build context (up to 196k tokens)
    │
    ▼
┌──────────────────────────┐
│  Send to Codex Model     │ (GPT-5.2-Codex)
└────────┬─────────────────┘
         │
         ▼
Model generates plan:
  1. Update auth middleware
  2. Add JWT library
  3. Modify login route
  4. Update tests
    │
    ▼
Execute plan (with approval):
    │
    ├──▶ Read-only mode? ──▶ Show plan, wait for approval
    │         │
    │        Approved? ──Yes──▶ Continue
    │         │
    │        No ──▶ Abort
    │
    ├──▶ Auto mode? ──▶ Auto-approve reads, ask for writes
    │
    ├──▶ Full mode? ──▶ Execute everything
    │
    ▼
For each step:
  • Edit files (str_replace pattern)
  • Run commands (npm install, git commit)
  • Execute tests
  • Verify changes
    │
    ▼
All steps complete?
    │
    ├──Yes──▶ Commit changes ──▶ Notify user
    │
    ├──No──▶ Error occurred?
                │
                ├──Yes──▶ Attempt fix or ask user
                │
                └──No──▶ Continue next step
```

---

## Component Connectivity Matrix

| Component | API | Custom GPT | MCP Apps | Codex | Sora | GitHub | Notion | Slack |
|-----------|-----|------------|----------|-------|------|--------|--------|-------|
| **API** | • | ✅ (Actions) | ✅ (Server) | ✅ (Auth) | ✅ (Future) | ✅ (SDK) | ✅ (SDK) | ✅ (SDK) |
| **Custom GPT** | ✅ | • | ✅ (Tools) | ❌ | ❌ | ✅ (Action) | ✅ (Action) | ✅ (Action) |
| **MCP Apps** | ✅ | ✅ | • | ✅ (CLI) | ❌ | ✅ (Built-in) | ✅ (Built-in) | ✅ (Built-in) |
| **Codex** | ✅ | ❌ | ✅ | • | ❌ | ✅ (@mentions) | ✅ (MCP) | ✅ (MCP) |
| **Sora** | ✅ (2026) | ❌ | ❌ | ❌ | • | ❌ | ❌ | ❌ |
| **GitHub** | ✅ | ✅ | ✅ | ✅ | ❌ | • | ❌ | ✅ (Notify) |
| **Notion** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | • | ✅ (Notify) |
| **Slack** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ (Notify) | ✅ (Notify) | • |

**Legend:**
- ✅ Direct integration available
- ❌ Not directly supported
- • Self (same component)

---

## Common Integration Scenarios

### Scenario 1: Customer Support Bot

**Goal**: Build a chatbot that answers questions and creates support tickets

**Architecture**:
```
Customer (Web/Mobile)
    ↓
Custom GPT (Support Assistant)
    ↓ Knowledge Base (uploaded PDFs)
    ├──▶ Answer from knowledge
    │
    ↓ Need to create ticket?
    │
Action: Create Ticket
    ↓ OAuth
Your API Server
    ↓
Ticketing System (Zendesk, Freshdesk, etc.)
    ↓ Confirmation
Customer receives ticket #
```

**Components**:
- **Custom GPT**: Instructions for support persona + FAQ knowledge
- **Action**: OpenAPI spec for ticket creation
- **Backend**: Node.js/Python API to interface with ticketing system
- **Auth**: OAuth 2.0 for secure access

**Latency**: 2-5 seconds  
**Cost**: $20/month (Plus) + hosting (~$10/month)

### Scenario 2: Code Review Automation

**Goal**: Automatically review PRs for security and best practices

**Architecture**:
```
Developer creates PR
    ↓
GitHub webhook
    ↓
Your Server (receives webhook)
    ↓
Call OpenAI API (gpt-4.1 or o3)
    ↓ Send PR diff
Model analyzes code
    ↓ Generate review comments
Your Server
    ↓ Post comments
GitHub PR (comments appear)
```

**Components**:
- **API**: Direct OpenAI API integration
- **Model**: o3 for complex reasoning or GPT-4.1 for long diffs
- **Backend**: Webhook handler + GitHub API client
- **Auth**: GitHub App or PAT

**Latency**: 10-30 seconds per PR  
**Cost**: API usage (~$0.50-$2 per review)

**Alternative with Codex**:
```
Developer: @codex review this PR for security
    ↓
GitHub mentions Codex
    ↓
Codex analyzes PR diff
    ↓
Posts review comments
```

### Scenario 3: Data Analysis Assistant

**Goal**: Answer questions about company data via natural language

**Architecture**:
```
Business User (ChatGPT)
    ↓
Custom GPT (Data Analyst)
    ↓
MCP App (Database Connector)
    ↓ OAuth
Your MCP Server
    ↓ SQL Query
Company Database (PostgreSQL)
    ↓ Results
MCP Server (format as JSON)
    ↓
Custom GPT (natural language summary)
    ↓
User sees: "Sales increased 15% last quarter"
```

**Components**:
- **Custom GPT**: Data analysis instructions
- **MCP Server**: Database query executor with safety guardrails
- **Database**: Read-only replica recommended
- **Auth**: OAuth 2.0 with granular permissions

**Security**:
- SQL injection prevention (parameterized queries)
- Row-level security (only show authorized data)
- Rate limiting (prevent abuse)
- Audit logging (track all queries)

**Latency**: 3-8 seconds  
**Cost**: $20/month (Plus) + server (~$20/month) + database

### Scenario 4: Content Generation Pipeline

**Goal**: Generate and publish marketing content automatically

**Architecture**:
```
Scheduler (cron/Zapier)
    ↓
Your Script
    ↓
OpenAI API (GPT-4o for content)
    ↓ Generate blog post
Your Script (validate/format)
    ↓
Notion/CMS API (publish)
    ↓
Optional: Sora API (2026) for video
    ↓
Social media APIs (share)
```

**Components**:
- **API**: Batch API for cost savings (50% off)
- **Model**: GPT-4o for fast, quality content
- **Storage**: Notion or headless CMS
- **Media**: Sora for video (when API available)

**Automation**:
- Run daily/weekly via cron
- Generate 5-10 posts per run
- Auto-publish to staging for review
- Notify team in Slack

**Latency**: 2-5 minutes per batch  
**Cost**: $10-30/month in API usage + storage

### Scenario 5: Personal Research Assistant

**Goal**: Research topics and compile reports with sources

**Architecture**:
```
User (ChatGPT Pro)
    ↓ "Research AI video generation market"
Custom GPT (Research Assistant)
    ↓ Enable web browsing
Web Search Tool
    ↓ Find relevant sources
Custom GPT reads sources
    ↓ Compile information
Generate report with citations
    ↓ Save to Notion?
MCP App (Notion connector)
    ↓ OAuth
Notion API (create database page)
```

**Components**:
- **Custom GPT**: Research methodology instructions
- **Web Browsing**: Built-in ChatGPT capability
- **MCP App**: Notion integration for saving results
- **Model**: o3 for deep analysis or GPT-4o for speed

**Workflow**:
1. User asks research question
2. GPT searches web (5-10 sources)
3. GPT reads and analyzes sources
4. GPT compiles report with citations
5. Optional: Save to Notion for future reference

**Latency**: 2-10 minutes (depends on depth)  
**Cost**: $200/month (Pro) for unlimited deep research

---

## Security Boundaries

### Authentication Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                     Authentication Flow                      │
└─────────────────────────────────────────────────────────────┘

User Authentication
    │
    ├──▶ ChatGPT Login ──▶ OpenAI Account (email/SSO)
    │
    ├──▶ API Key ──▶ Project-scoped or org-scoped
    │
    └──▶ OAuth Apps ──▶ User grants permission to external services

External Service Authentication
    │
    ├──▶ Custom GPT Actions ──▶ OAuth 2.0 or API Key
    │
    ├──▶ MCP Apps ──▶ OAuth 2.0 (user consent required)
    │
    └──▶ Codex Integrations ──▶ GitHub PAT, Slack token, etc.
```

**Key Points**:
- **API Keys**: Never expose in client-side code
- **OAuth Tokens**: Encrypted at rest, scoped to services
- **User Consent**: Required for all third-party access
- **Revocation**: Users can revoke access anytime

### Data Flow Boundaries

```
┌────────────────────┐
│   User Data        │ (Your prompts, conversations)
└─────────┬──────────┘
          │
          ▼
     Encrypted in transit (TLS 1.3)
          │
          ▼
┌────────────────────┐
│  OpenAI Servers    │ (Temporary processing)
└─────────┬──────────┘
          │
          ├──▶ Memory: Stored for personalization (user can disable)
          ├──▶ Training: NOT used for model training*
          └──▶ Logs: 30-day retention for abuse prevention

* API data opt-out by default; ChatGPT conversations opt-out available
```

**Data Retention**:
- **Conversations**: Indefinite (user can delete anytime)
- **API Requests**: 30 days (for abuse detection)
- **Memory**: Persistent (user controls, can delete)
- **Training**: Zero-data retention (ZDR) for Enterprise

### Permission Boundaries

**ChatGPT Plus/Pro (Consumer)**:
- Read access to connected services (MCP apps)
- Write access requires manual confirmation

**Business/Enterprise/Edu**:
- Admin controls over allowed MCP apps
- Write operations require user approval
- Audit logs for all actions
- SSO and RBAC support

**API**:
- Project-scoped keys (isolate environments)
- Rate limits per key
- Usage tracking and billing alerts

### Network Boundaries

```
┌─────────────────────────────────────────────────────────┐
│                    Network Security                      │
└─────────────────────────────────────────────────────────┘

Internet
    │
    ▼ (HTTPS only, TLS 1.3)
┌─────────────────────────────────────┐
│       OpenAI API Gateway            │ (DDoS protection, rate limiting)
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│    Model Inference Cluster          │ (Isolated, no internet access)
└─────────────────────────────────────┘
    │
    ▼ (For Actions/MCP only)
┌─────────────────────────────────────┐
│     External API Requests           │ (Egress firewall, IP allowlist)
└─────────────────────────────────────┘
```

**Protections**:
- **DDoS**: Cloudflare + custom mitigation
- **Rate Limiting**: Per-user, per-key, per-IP
- **Egress Control**: Only to verified external APIs
- **IP Allowlisting**: For sensitive integrations

---

## API Integration Flows

### Streaming vs Non-Streaming

**Non-Streaming (Default)**:
```javascript
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello!' }]
});
console.log(response.choices[0].message.content);
```
- **Latency**: Wait for full response (1-10s)
- **Use Case**: Batch processing, simple queries
- **Advantage**: Simpler code, easier error handling

**Streaming (Recommended for UI)**:
```javascript
const stream = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Write an essay' }],
  stream: true
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
```
- **Latency**: First token in <1s, stream continues
- **Use Case**: Chat interfaces, long responses
- **Advantage**: Better UX, perceived speed

### Function Calling (Tool Use)

```javascript
const functions = [
  {
    name: 'get_weather',
    description: 'Get current weather',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string' },
        unit: { type: 'string', enum: ['celsius', 'fahrenheit'] }
      },
      required: ['location']
    }
  }
];

const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'What's the weather in SF?' }],
  tools: functions.map(f => ({ type: 'function', function: f }))
});

if (response.choices[0].message.tool_calls) {
  const toolCall = response.choices[0].message.tool_calls[0];
  const args = JSON.parse(toolCall.function.arguments);
  
  // Call your function
  const weather = await getWeather(args.location, args.unit);
  
  // Send result back to model
  const finalResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'user', content: 'What's the weather in SF?' },
      response.choices[0].message,
      { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(weather) }
    ]
  });
}
```

**Use Cases**:
- External API calls
- Database queries
- File operations
- Calculations

---

## Troubleshooting Integration Issues

### Issue: "Authentication failed"

**Symptoms**:
- 401 Unauthorized errors
- "Invalid API key" messages
- OAuth redirects fail

**Diagnosis**:
```bash
# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Should return list of models
# If error, key is invalid or expired
```

**Solutions**:
1. **Invalid API Key**:
   - Regenerate key at https://platform.openai.com/api-keys
   - Update environment variable
   - Restart application

2. **OAuth Issues (Custom GPT/MCP)**:
   - Verify redirect URI matches exactly
   - Check OAuth client ID/secret
   - Ensure proper scopes requested
   - Test OAuth flow manually

3. **Expired Token**:
   - Implement token refresh logic
   - Cache tokens with expiration
   - Handle 401s with refresh attempts

### Issue: "Rate limit exceeded"

**Symptoms**:
- 429 errors
- "Requests per minute exceeded"
- Slow responses or timeouts

**Diagnosis**:
```bash
# Check rate limit headers
curl -I https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Look for:
# x-ratelimit-limit-requests: 10000
# x-ratelimit-remaining-requests: 9995
```

**Solutions**:
1. **Tier Upgrade**:
   - Check usage: https://platform.openai.com/usage
   - Upgrade tier if needed (automatic after $X spent)
   - Consider Enterprise for higher limits

2. **Implement Backoff**:
   ```javascript
   async function apiCallWithRetry(fn, retries = 3) {
     for (let i = 0; i < retries; i++) {
       try {
         return await fn();
       } catch (error) {
         if (error.status === 429 && i < retries - 1) {
           await sleep(2 ** i * 1000); // Exponential backoff
           continue;
         }
         throw error;
       }
     }
   }
   ```

3. **Batch API**:
   - Use for non-urgent requests (50% cheaper, 24hr turnaround)
   - No rate limits

### Issue: "Context length exceeded"

**Symptoms**:
- "This model's maximum context length is..." error
- Truncated responses
- Missing information in long conversations

**Diagnosis**:
```javascript
// Count tokens (approximate)
const estimate = text.length / 4; // Rough estimate
console.log(`Estimated tokens: ${estimate}`);

// More accurate with tiktoken
import { encoding_for_model } from 'tiktoken';
const enc = encoding_for_model('gpt-4o');
const tokens = enc.encode(text);
console.log(`Actual tokens: ${tokens.length}`);
```

**Solutions**:
1. **Use Larger Context Model**:
   - GPT-4o: 128k tokens
   - GPT-4.1: 1M tokens
   - o3: 200k tokens

2. **Summarize Previous Messages**:
   ```javascript
   if (messages.length > 20) {
     const summary = await summarizeConversation(messages.slice(0, -10));
     messages = [
       { role: 'system', content: `Previous conversation summary: ${summary}` },
       ...messages.slice(-10)
     ];
   }
   ```

3. **Chunking for Long Documents**:
   ```javascript
   // Split large document
   const chunks = splitIntoChunks(document, 100000);
   const summaries = await Promise.all(
     chunks.map(chunk => summarize(chunk))
   );
   const finalSummary = await summarize(summaries.join('\n'));
   ```

### Issue: "Custom GPT Action not working"

**Symptoms**:
- "Failed to call action" error
- No response from API
- Timeout errors

**Diagnosis**:
1. **Test OpenAPI Spec**:
   - Validate at https://editor.swagger.io/
   - Ensure all required fields present
   - Check parameter types match

2. **Test API Directly**:
   ```bash
   curl -X POST https://your-api.com/endpoint \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"param": "value"}'
   ```

**Solutions**:
1. **CORS Issues**:
   ```javascript
   // Enable CORS for ChatGPT
   app.use(cors({
     origin: [
       'https://chatgpt.com',
       'https://chat.openai.com'
     ],
     credentials: true
   }));
   ```

2. **Authentication**:
   - Verify OAuth flow completes successfully
   - Check API key is valid
   - Ensure tokens aren't expired

3. **Timeout**:
   - Optimize API response time (<30s recommended)
   - Implement async processing for long tasks
   - Return immediate confirmation, complete later

4. **Schema Mismatch**:
   ```json
   // Ensure GPT sends what API expects
   {
     "operationId": "getUser",
     "parameters": [
       {
         "name": "userId",
         "in": "path",
         "required": true,
         "schema": { "type": "string" }
       }
     ]
   }
   ```

### Issue: "MCP write operations not working"

**Symptoms**:
- Read operations work, writes fail
- "Permission denied" on write
- No confirmation prompt shown

**Solutions**:
1. **Plan Requirement**:
   - Write operations only work on Business/Enterprise/Edu
   - Plus/Pro: Read-only
   - Upgrade if writes needed

2. **User Confirmation**:
   - Enterprise admins must enable write confirmation
   - User must manually approve each write
   - Cannot be automated

3. **Permissions**:
   - Verify OAuth scopes include write access
   - Check MCP server has proper permissions
   - Ensure user granted necessary permissions

### Issue: "Codex not finding files"

**Symptoms**:
- "File not found" errors
- Codex can't read codebase
- Missing context in responses

**Solutions**:
1. **Working Directory**:
   ```bash
   # Ensure you're in project root
   cd /path/to/project
   codex chat
   ```

2. **Gitignore**:
   - Codex respects .gitignore by default
   - Use `--include-ignored` flag if needed
   - Check .gitignore isn't excluding important files

3. **Permissions**:
   ```bash
   # Ensure Codex can read files
   chmod +r src/**/*.ts
   ```

4. **Large Repos**:
   - Use `--file` flag to specify relevant files
   - Create project skills for common tasks
   - Consider using GPT-5.2-Codex for context compaction

### Issue: "Sora video generation fails"

**Symptoms**:
- "Generation failed" error
- Stuck in processing
- Poor video quality

**Solutions**:
1. **Content Policy Violation**:
   - Avoid copyrighted characters (except Disney partnership)
   - No violence, nudity, public figures
   - Rephrase prompt to be less specific about brands/people

2. **Prompt Too Complex**:
   - Simplify prompt
   - Break into multiple shorter generations
   - Use storyboards for complex narratives (Pro only)

3. **Quota Exceeded**:
   - Check usage in profile
   - Wait for monthly reset (1st of month)
   - Upgrade to Pro for 10x quota (50 → 500/month)

4. **Server Overload**:
   - Try off-peak hours (early morning US time)
   - Pro users get priority queue
   - Retry after a few minutes

---

**Last Updated**: December 27, 2025  
**Maintained By**: OpenAI Developer Relations  
**Feedback**: https://community.openai.com/
