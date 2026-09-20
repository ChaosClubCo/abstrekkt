# MCP Apps & Connectors Guide

**Last Updated:** December 2025  
**Scope:** Model Context Protocol (MCP), pre-built Apps, custom servers, Apps SDK

---

## Terminology Update (December 17, 2025)

**"Connectors" → "Apps"**

OpenAI renamed Connectors to **Apps** for unified experience across ChatGPT ecosystem.

**Old Term → New Term:**
- Connectors → Apps
- Connected accounts → Connected apps
- Connector actions → App operations

**This guide uses "Apps" terminology** (current as of December 2025)

---

## Overview

**MCP (Model Context Protocol)** is an open standard enabling LLMs to connect with external data sources and tools. Think of it as USB for AI—a universal interface for integrations.

**Key Concepts:**
- **MCP Server** - Provides tools/resources (your API, database, SaaS)
- **MCP Client** - Consumes tools/resources (ChatGPT, Claude, custom apps)
- **Protocol** - Standardized JSON-RPC 2.0 messages over SSE or HTTP
- **Apps** - Pre-built MCP servers (Gmail, GitHub, Slack, 100+)

**Availability:**
- **Pre-built Apps:** Plus, Team, Business, Enterprise, Edu
- **Custom MCP Servers:** Business, Enterprise, Edu (Developer Mode beta)
- **Write Operations:** Business, Enterprise, Edu only (with manual confirmation)

---

## MCP Protocol Specification

### Core Components

**1. Resources (Read)**
Static or dynamic content the LLM can access:
- Documents (Notion pages, Google Docs)
- Data (database records, API responses)
- Files (PDFs, CSVs, images)

**2. Tools (Write)**
Functions the LLM can invoke:
- Create/update/delete operations
- API calls with side effects
- Complex workflows

**3. Prompts (Templates)**
Reusable prompt templates with variables:
- "Analyze sales data for {region}"
- "Generate report for {quarter}"

### Transport Layers

**Server-Sent Events (SSE):**
- One-way server-to-client streaming
- Used for: Long-running operations, progress updates
- Example: File uploads, batch processing

```javascript
// Server sends events
res.write('data: {"progress": 50}\n\n');
res.write('data: {"progress": 100, "done": true}\n\n');
```

**Streaming HTTP:**
- Bidirectional, persistent connection
- Used for: Real-time chat, interactive workflows
- Example: Multi-turn conversations with state

```javascript
// Client sends/receives JSON-RPC messages
POST /mcp HTTP/1.1
{"jsonrpc": "2.0", "method": "tools/call", "params": {...}}
```

### Authentication

**Supported Methods:**
1. **OAuth 2.0** - User-specific access (recommended for SaaS)
2. **API Key** - Service-level access
3. **None** - Public/internal servers

### Message Format (JSON-RPC 2.0)

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "tools/call",
  "params": {
    "name": "create_issue",
    "arguments": {
      "title": "Bug report",
      "body": "Description..."
    }
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Issue created: https://github.com/org/repo/issues/123"
      }
    ]
  }
}
```

**Error:**
```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "error": {
    "code": -32600,
    "message": "Invalid request",
    "data": {"details": "Missing required field: title"}
  }
}
```

---

## Pre-Built Apps (100+)

### Communication & Collaboration

**Gmail**
- Read/search emails
- Send messages
- Manage labels and filters
- **Auth:** OAuth 2.0

**Slack**
- Search messages and channels
- Send messages
- Manage workspace (Business/Enterprise)
- **Auth:** OAuth 2.0

**Microsoft Teams**
- Search chats and channels
- Post messages
- Manage teams (Business/Enterprise)
- **Auth:** OAuth 2.0

**Google Calendar**
- View events
- Create/update meetings
- Check availability
- **Auth:** OAuth 2.0

**Zoom**
- Schedule meetings
- List recordings
- Get meeting details
- **Auth:** OAuth 2.0

### Development & Code

**GitHub**
- Search repositories and issues
- Create/update issues and PRs
- Read code files
- Run workflows (Business/Enterprise)
- **Auth:** OAuth 2.0

**Linear**
- Search issues
- Create/update tasks
- Manage projects
- **Auth:** OAuth 2.0

**Jira (Atlassian Rovo)**
- Search issues
- Create/transition tickets
- Project management
- **Auth:** OAuth 2.0

**GitLab**
- Repository operations
- Issue tracking
- CI/CD pipeline access
- **Auth:** OAuth 2.0

### Productivity & Docs

**Notion**
- Search pages and databases
- Create/update pages
- Query databases
- **Auth:** OAuth 2.0

**Google Drive**
- Search files
- Read/write documents
- Manage folders
- **Auth:** OAuth 2.0

**Dropbox**
- File search and access
- Upload/download
- Sharing
- **Auth:** OAuth 2.0

**Microsoft OneDrive**
- File operations
- SharePoint integration
- **Auth:** OAuth 2.0

### Data & Analytics

**Google Sheets**
- Read/write data
- Query ranges
- Create charts
- **Auth:** OAuth 2.0

**Amplitude**
- Query analytics data
- User behavior analysis
- Cohort analysis
- **Auth:** API Key

**Hex**
- Run SQL queries
- Access notebooks
- Data visualization
- **Auth:** API Key

**Snowflake** (via Custom MCP)
- Data warehouse queries
- Table access
- **Auth:** API Key

### Business Tools

**Salesforce**
- CRM data access
- Lead/opportunity management
- Reports and dashboards
- **Auth:** OAuth 2.0

**HubSpot**
- Contact management
- Deal tracking
- Marketing automation
- **Auth:** OAuth 2.0

**Stripe**
- Payment lookup
- Customer data
- Subscription management
- **Auth:** API Key

**Shopify**
- Product catalog
- Order management
- Inventory tracking
- **Auth:** OAuth 2.0

### Cloud & Infrastructure

**Vercel**
- Deployment management
- Project analytics
- Domain configuration
- **Auth:** OAuth 2.0

**Cloudflare**
- DNS management
- Analytics
- Security settings
- **Auth:** API Key

**AWS** (via Custom MCP)
- EC2, S3, Lambda access
- CloudWatch logs
- **Auth:** API Key

### Project Management

**Monday.com**
- Board access
- Task management
- Workflow automation
- **Auth:** OAuth 2.0

**Asana**
- Project tracking
- Task creation/updates
- Team collaboration
- **Auth:** OAuth 2.0

**ClickUp**
- Workspace access
- Task management
- Time tracking
- **Auth:** OAuth 2.0

### Other

**Fireflies**
- Meeting transcriptions
- AI notes and summaries
- **Auth:** API Key

**Egnyte**
- Enterprise file management
- Secure collaboration
- **Auth:** OAuth 2.0

**Canva**
- Design operations
- Template access (read-only)
- **Auth:** OAuth 2.0

**Intercom**
- Customer support data
- Conversation history
- **Auth:** OAuth 2.0

**Sentry**
- Error tracking
- Performance monitoring
- **Auth:** API Key

---

## Connecting Pre-Built Apps

### Step 1: Enable Developer Mode (Business/Enterprise/Edu Only)

1. **ChatGPT Settings** → **Beta Features**
2. Enable **Developer Mode**
3. Apps section appears in sidebar

### Step 2: Connect App

1. **Apps** sidebar → **Connect apps**
2. Browse catalog or search
3. Click **Connect** on desired app
4. **Authorize** (OAuth flow or enter API key)
5. Grant permissions
6. Confirm connection

**Example (Gmail):**
```
1. Click "Connect apps"
2. Search "Gmail"
3. Click "Connect"
4. Redirected to Google OAuth
5. Select account
6. Grant permissions (read, send, labels)
7. Redirected back → "Gmail connected ✓"
```

### Step 3: Use in Conversation

**Read Operations (All Plans):**
```
User: "Find emails from john@example.com about the Q4 report"
ChatGPT: [Searches Gmail via MCP]
Result: "Found 3 emails:
1. Subject: Q4 Report Draft (Dec 15)
2. Subject: Re: Q4 Numbers (Dec 18)
3. Subject: Final Q4 Report (Dec 20)"
```

**Write Operations (Business/Enterprise/Edu Only):**
```
User: "Send an email to team@example.com saying the meeting is moved to 3pm"
ChatGPT: [Confirms] "I'll send this email:
To: team@example.com
Subject: Meeting Time Change
Body: The meeting has been moved to 3pm today.

Confirm? Yes / Edit / Cancel"
User: "Yes"
ChatGPT: [Sends via Gmail MCP] "Email sent ✓"
```

### Permissions & RBAC (Enterprise/Edu)

**Admin Controls:**
- Approve/deny app connections per user or group
- Audit log for all MCP operations
- Require multi-factor auth for write operations
- Set data retention policies

**User Permissions:**
- Read-only vs read-write access
- Resource-level permissions (e.g., specific Slack channels)
- Time-based access (temporary grants)

---

## Building Custom MCP Servers

### When to Build Custom

**Use Pre-Built Apps When:**
- Integration already exists (Gmail, GitHub, Slack, etc.)
- Standard functionality is sufficient
- No customization needed

**Build Custom Server When:**
- Internal/proprietary systems (company databases, APIs)
- Specialized workflows (multi-step processes, business logic)
- Need fine-grained control (custom auth, data transformations)
- Pre-built app doesn't exist for your tool

### Architecture

```
┌─────────────────┐
│   ChatGPT       │
│   (MCP Client)  │
└────────┬────────┘
         │ JSON-RPC 2.0
         │ (SSE or HTTP)
         ▼
┌─────────────────┐
│   Your MCP      │
│   Server        │
│   (Node.js/     │
│    Python)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Your API/DB   │
│   (PostgreSQL,  │
│    REST API,    │
│    etc.)        │
└─────────────────┘
```

### Node.js Example (Using MCP SDK)

**Installation:**
```bash
npm install @modelcontextprotocol/sdk
```

**Server Implementation:**
```javascript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Initialize MCP server
const server = new Server(
  {
    name: "my-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {}, // Supports tool calling
      resources: {}, // Supports resource reading
    },
  }
);

// Define a tool
server.setRequestHandler("tools/list", async () => {
  return {
    tools: [
      {
        name: "get_user",
        description: "Fetch user data by ID",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID to fetch",
            },
          },
          required: ["user_id"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "get_user") {
    const userId = request.params.arguments.user_id;
    
    // Call your API/database
    const user = await fetchUserFromDB(userId);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(user, null, 2),
        },
      ],
    };
  }
  
  throw new Error(`Unknown tool: ${request.params.name}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("MCP server running...");
}

main().catch(console.error);
```

### Python Example (Using FastMCP)

**Installation:**
```bash
pip install fastmcp
```

**Server Implementation:**
```python
from fastmcp import FastMCP
import httpx

mcp = FastMCP("my-mcp-server")

@mcp.tool()
async def get_user(user_id: str) -> str:
    """Fetch user data by ID."""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://api.example.com/users/{user_id}")
        response.raise_for_status()
        return response.json()

@mcp.tool()
async def create_user(name: str, email: str) -> str:
    """Create a new user."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.example.com/users",
            json={"name": name, "email": email}
        )
        response.raise_for_status()
        return f"User created: {response.json()['id']}"

if __name__ == "__main__":
    mcp.run()
```

### Configuration File

**config.json:**
```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["path/to/server.js"],
      "env": {
        "API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**For Python:**
```json
{
  "mcpServers": {
    "my-server": {
      "command": "python",
      "args": ["-m", "fastmcp", "path/to/server.py"],
      "env": {
        "API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### OAuth 2.0 Integration

**For user-specific data access:**

```javascript
import { OAuthProvider } from "@modelcontextprotocol/sdk/oauth/index.js";

const oauthProvider = new OAuthProvider({
  authorizationUrl: "https://provider.com/oauth/authorize",
  tokenUrl: "https://provider.com/oauth/token",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: "https://your-server.com/oauth/callback",
  scopes: ["read:data", "write:data"],
});

// Handle OAuth callback
app.get("/oauth/callback", async (req, res) => {
  const code = req.query.code;
  const tokens = await oauthProvider.exchangeCode(code);
  
  // Store tokens (associate with user)
  await storeTokens(req.session.userId, tokens);
  
  res.send("Authorization successful! You can close this window.");
});

// Use tokens in tool execution
server.setRequestHandler("tools/call", async (request, context) => {
  const userId = context.userId; // From ChatGPT request
  const tokens = await getTokens(userId);
  
  // Call API with access token
  const response = await fetch("https://api.provider.com/data", {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });
  
  // Auto-refresh if expired
  if (response.status === 401) {
    tokens = await oauthProvider.refreshToken(tokens.refresh_token);
    await storeTokens(userId, tokens);
    // Retry request...
  }
  
  return { content: [{ type: "text", text: await response.text() }] };
});
```

---

## Apps SDK (Beta)

**Purpose:** Package and distribute MCP servers as ChatGPT Apps (like pre-built apps)

**Status:** Beta (Business/Enterprise/Edu early access)

### Creating an App Package

**1. Implement MCP Server** (Node.js or Python)

**2. Create App Manifest** (`app.json`):
```json
{
  "name": "My Custom App",
  "version": "1.0.0",
  "description": "Integrates with My Service",
  "author": {
    "name": "Your Company",
    "email": "support@example.com"
  },
  "homepage": "https://example.com",
  "icon": "icon.png",
  "mcp": {
    "server": {
      "command": "node",
      "args": ["dist/server.js"]
    },
    "auth": {
      "type": "oauth2",
      "authorizationUrl": "https://example.com/oauth/authorize",
      "tokenUrl": "https://example.com/oauth/token",
      "scopes": ["read", "write"]
    }
  },
  "capabilities": {
    "tools": true,
    "resources": true
  }
}
```

**3. Package:**
```bash
# Bundle server code + manifest
npm run build
zip -r my-app.zip dist/ app.json icon.png
```

**4. Submit to OpenAI:**
- Developer Dashboard → Apps SDK → Submit App
- Upload package
- Review process (1-2 weeks)
- Approval → Listed in App Directory

**5. Distribution:**
- Users install from App Directory
- Auto-updates via OpenAI infrastructure
- Analytics provided (usage, errors)

---

## Company Knowledge (Enterprise/Edu)

**Feature:** Sync internal documents for semantic search in ChatGPT

**Supported Sources:**
- Google Drive (Docs, Sheets, PDFs)
- Microsoft SharePoint
- Notion workspaces
- Confluence
- Custom document repositories (via MCP)

**Setup:**
1. Admin enables Company Knowledge in Enterprise settings
2. Connect data sources (OAuth or service accounts)
3. Select folders/spaces to sync
4. ChatGPT indexes content (embeddings generated)
5. Users query: "Find our Q3 sales strategy"
6. ChatGPT searches Company Knowledge + cites sources

**Security:**
- Respects existing permissions (users only see what they have access to)
- Encrypted at rest and in transit
- Opt-in (users can disable)
- Audit logs for all access

---

## Security & Compliance

### Data Handling

**Read Operations:**
- Data fetched in real-time (not stored long-term)
- Cached for conversation duration only
- Respects user permissions (OAuth scopes)

**Write Operations:**
- Manual confirmation required (Business/Enterprise/Edu)
- Audit logs for all writes
- Rollback capability (if API supports)

### OAuth Security

**Token Storage:**
- Encrypted at rest (AES-256)
- Stored per user per app
- Auto-refreshed before expiration
- Revocable by user anytime

**Scopes:**
- Request minimal scopes (principle of least privilege)
- User sees permissions before granting
- Can revoke access in ChatGPT Settings → Apps

### API Key Security

**Best Practices:**
- Rotate keys every 90 days
- Use read-only keys when possible
- Store in secrets manager (not hardcoded)
- Monitor for unusual activity

### RBAC (Enterprise/Edu)

**Admin Controls:**
- Approve/deny app connections per user/group
- Set default permissions (read-only, read-write)
- Require multi-factor auth for sensitive operations
- Data loss prevention (DLP) policies

**Example:**
```yaml
Policies:
  - App: GitHub
    Users: engineering@company.com
    Permissions: read-write
    MFA Required: true
    Audit: all operations
  
  - App: Salesforce
    Users: sales@company.com
    Permissions: read-only
    MFA Required: false
    Audit: writes only
```

---

## Troubleshooting

### App Not Connecting

**Symptoms:** "Failed to connect to [App]" error

**Causes:**
- OAuth flow interrupted
- Invalid credentials
- Permissions not granted

**Fixes:**
1. Disconnect app (Settings → Apps → Disconnect)
2. Clear browser cache/cookies
3. Retry connection
4. Ensure correct account selected (Google, Microsoft, etc.)
5. Grant all requested permissions

### Tool Not Triggering

**Symptoms:** ChatGPT doesn't use MCP tool despite relevant query

**Causes:**
- Tool description unclear
- Query too vague
- Multiple similar tools (ambiguous)

**Fixes:**
- Improve tool `description` (be specific about when to use)
- Test with explicit query ("Use the GitHub tool to...")
- Add examples in tool schema

### Authentication Expired

**Symptoms:** "Authentication failed" mid-conversation

**Causes:**
- OAuth token expired and refresh failed
- API key revoked

**Fixes:**
- Reconnect app (auto-refreshes token)
- Rotate API key and update in app settings
- Check API rate limits (may look like auth error)

### Slow Responses

**Symptoms:** MCP calls take >10 seconds

**Causes:**
- API latency (external service slow)
- Complex queries (database joins)
- Network issues

**Fixes:**
- Optimize API endpoints (caching, indexing)
- Use pagination (don't fetch all results at once)
- Implement timeouts (fail fast, retry)
- Monitor API performance (NewRelic, Datadog)

---

## Best Practices

### Tool Design

**DO:**
✅ Clear, specific names (`create_github_issue` not `do_thing`)
✅ Detailed descriptions (when to use, what it does, side effects)
✅ Input validation (type checking, bounds, enums)
✅ Error handling (meaningful error messages)
✅ Idempotency (safe to retry, no duplicate side effects)

**DON'T:**
❌ Generic tool names (`execute`, `run_command`)
❌ Vague descriptions ("Does stuff")
❌ Accept arbitrary strings without validation
❌ Return raw stack traces (security risk)
❌ Duplicate tools (consolidate similar functions)

### Performance

**Latency Goals:**
- Read operations: <2 seconds
- Write operations: <5 seconds
- Timeout: 60 seconds (hard limit)

**Optimization:**
- Cache frequent queries (Redis, Memcached)
- Use pagination (don't fetch all data at once)
- Implement rate limiting (prevent abuse)
- Monitor slow queries (APM tools)

### Testing

**Unit Tests:**
```javascript
// Test tool logic (mock external APIs)
test("get_user returns user data", async () => {
  const result = await tools.get_user({ user_id: "123" });
  expect(result.content[0].text).toContain("John Doe");
});
```

**Integration Tests:**
```javascript
// Test with real APIs (staging environment)
test("create_issue creates GitHub issue", async () => {
  const result = await tools.create_issue({
    title: "Test issue",
    body: "Test body",
  });
  expect(result.content[0].text).toContain("Issue created");
});
```

**E2E Tests:**
```javascript
// Test MCP protocol end-to-end (simulate ChatGPT)
test("MCP server handles tool call", async () => {
  const request = {
    jsonrpc: "2.0",
    method: "tools/call",
    params: { name: "get_user", arguments: { user_id: "123" } },
    id: "1",
  };
  const response = await mcpServer.handleRequest(request);
  expect(response.result.content[0].text).toContain("John Doe");
});
```

---

## MCP Ecosystem

**Official Implementations:**
- **MCP SDK (Node.js):** https://github.com/modelcontextprotocol/sdk
- **FastMCP (Python):** https://github.com/modelcontextprotocol/fastmcp

**Community Servers:**
- **Filesystem MCP:** Local file access
- **PostgreSQL MCP:** Database queries
- **Puppeteer MCP:** Browser automation
- **Weather MCP:** Weather APIs
- **1,400+ servers:** https://github.com/topics/mcp-server

**Compatible Clients:**
- ChatGPT (OpenAI)
- Claude (Anthropic, desktop apps)
- Custom clients (via MCP SDK)

**Learning Resources:**
- MCP Docs: https://modelcontextprotocol.io
- Quickstart: https://modelcontextprotocol.io/quickstart
- Tutorials: https://modelcontextprotocol.io/tutorials
- Spec: https://spec.modelcontextprotocol.io

---

## Comparison: Apps vs Actions

| Feature | MCP Apps | GPT Actions |
|---------|----------|-------------|
| **Use Case** | Complex workflows, file ops, real-time | Simple REST API calls |
| **Protocol** | MCP (JSON-RPC) | OpenAPI 3.0/3.1 |
| **Transport** | SSE, Streaming HTTP | HTTP (request-response) |
| **State** | Stateful (multi-turn) | Stateless (per request) |
| **Files** | Upload/download support | No native support |
| **Auth** | OAuth, API key | OAuth, API key |
| **Write Ops** | Manual confirmation (Business+) | Auto-executed |
| **Models** | All (GPT-4o, o3, o4-mini, etc.) | GPT-4o, GPT-4.1 only |
| **Availability** | Business/Enterprise/Edu (Developer Mode) | Plus, Team, Business, Enterprise |
| **Pre-Built** | 100+ apps (Gmail, GitHub, etc.) | None (custom only) |

**When to use Apps:** Complex systems, file handling, real-time, pre-built integrations exist

**When to use Actions:** Simple API calls, custom endpoints, no pre-built app available

---

**End of MCP Apps & Connectors Guide**
