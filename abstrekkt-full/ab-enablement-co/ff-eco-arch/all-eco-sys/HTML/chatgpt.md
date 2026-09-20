# ChatGPT MCP & Apps SDK Setup Guide

**Complete setup for ChatGPT Developer Mode (MCP), Apps SDK, and Connectors**

## Table of Contents

1. [Overview](#overview)
2. [Developer Mode (MCP Support)](#developer-mode-mcp-support)
3. [Apps SDK](#apps-sdk)
4. [Connectors](#connectors)
5. [OpenAI Agents SDK](#openai-agents-sdk)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Overview

ChatGPT offers **full MCP support** via Developer Mode (beta) plus additional integration methods:

- **Developer Mode**: Full MCP protocol (read + write actions)
- **Apps SDK**: Custom widgets with `window.openai` runtime
- **Connectors**: Read-only integrations (Google Workspace, Microsoft 365, etc.)
- **App Directory**: 100+ public apps marketplace
- **OpenAI Agents SDK**: MCP integration for custom agents

**Total ecosystem**: 115+ integrations (15 connectors + 100+ apps)

---

## Developer Mode (MCP Support)

### What is Developer Mode?

**Beta feature** that enables full MCP protocol support in ChatGPT with:
- ✅ Read AND write actions (not just read-only)
- ✅ SSE (Server-Sent Events) protocol
- ✅ Streaming HTTP protocol
- ✅ OAuth, no-auth, and mixed authentication
- ✅ Write action confirmations with `readOnlyHint`

### Enable Developer Mode

1. Go to: https://platform.openai.com/settings/developer-mode
2. Click "Enable Developer Mode" (requires OpenAI account with API access)
3. Complete beta signup form
4. Wait for approval email (usually 1-3 business days)

### MCP Server Configuration

Once approved, create MCP server configuration:

```json
{
  "name": "my-mcp-server",
  "version": "1.0.0",
  "protocol": {
    "type": "sse",  // or "streaming-http"
    "url": "https://your-server.com/mcp"
  },
  "authentication": {
    "type": "oauth",  // or "none" or "mixed"
    "authorizationUrl": "https://your-auth.com/oauth/authorize",
    "tokenUrl": "https://your-auth.com/oauth/token",
    "clientId": "${OAUTH_CLIENT_ID}",
    "scopes": ["read", "write"]
  },
  "capabilities": {
    "tools": {
      "supportsReadOnly": true,
      "supportsWrite": true
    }
  }
}
```

### SSE Protocol Example

```typescript
// mcp-server-sse.ts
import express from 'express';
import { MCPServer } from '@openai/mcp-sdk';

const app = express();
const mcpServer = new MCPServer({
  name: 'custom-tools',
  version: '1.0.0'
});

// Register tools
mcpServer.tool({
  name: 'analyze_code',
  description: 'Analyzes code for issues',
  parameters: {
    type: 'object',
    properties: {
      code: { type: 'string' },
      language: { type: 'string' }
    },
    required: ['code']
  },
  readOnlyHint: false  // Write action (requires confirmation)
}, async (params) => {
  const analysis = await analyzeCode(params.code, params.language);
  return { result: analysis };
});

// SSE endpoint
app.get('/mcp', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  mcpServer.handleSSE(req, res);
});

app.listen(3000, () => {
  console.log('MCP server running on http://localhost:3000/mcp');
});
```

### Streaming HTTP Protocol Example

```typescript
// mcp-server-streaming.ts
import { MCPServer } from '@openai/mcp-sdk';

const server = new MCPServer({
  name: 'streaming-tools',
  version: '1.0.0',
  protocol: 'streaming-http'
});

server.tool({
  name: 'search_database',
  description: 'Searches database and streams results',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string' }
    }
  },
  readOnlyHint: true  // Read-only (no confirmation needed)
}, async function* (params) {
  const results = await searchDatabase(params.query);
  
  for (const result of results) {
    yield { data: result };  // Stream each result
    await sleep(100);  // Throttle for demo
  }
});

server.listen(3001);
```

### Write Action Confirmations

ChatGPT prompts users to confirm write actions (when `readOnlyHint: false`):

```typescript
mcpServer.tool({
  name: 'deploy_app',
  description: 'Deploys application to production',
  parameters: {
    type: 'object',
    properties: {
      environment: { type: 'string', enum: ['staging', 'production'] }
    }
  },
  readOnlyHint: false  // ⚠️ Triggers confirmation dialog
}, async (params) => {
  // User must click "Confirm" in ChatGPT UI
  const result = await deploy(params.environment);
  return { deploymentUrl: result.url, status: 'success' };
});
```

**User sees:**
```
⚠️ This action will modify external data.
Action: deploy_app
Environment: production
[Cancel] [Confirm]
```

---

## Apps SDK

### What is Apps SDK?

Build custom widgets that render inside ChatGPT with access to `window.openai` runtime:

- ✅ React/Vue/vanilla JS support
- ✅ Access to chat context
- ✅ Send messages to ChatGPT
- ✅ Render custom UI (charts, forms, interactive elements)
- ✅ OAuth authentication
- ✅ Persistent state

### Quickstart

```bash
npm create openai-app my-chatgpt-app
cd my-chatgpt-app
npm install
npm run dev
```

### App Configuration

`app.json`:

```json
{
  "name": "Code Analyzer",
  "description": "Analyzes code with interactive visualizations",
  "version": "1.0.0",
  "author": "Your Name",
  "icon": "https://your-cdn.com/icon.png",
  
  "runtime": {
    "url": "https://your-app.com/widget",
    "width": 600,
    "height": 400,
    "resizable": true
  },
  
  "authentication": {
    "type": "oauth",
    "authorizationUrl": "https://auth.your-app.com/oauth/authorize",
    "tokenUrl": "https://auth.your-app.com/oauth/token",
    "clientId": "${OAUTH_CLIENT_ID}",
    "scopes": ["read", "write"]
  },
  
  "capabilities": {
    "chat": true,
    "state": true,
    "commands": [
      {
        "name": "analyze",
        "description": "Analyze code",
        "parameters": ["code", "language"]
      }
    ]
  },
  
  "privacy": {
    "dataCollection": "anonymized",
    "termsOfService": "https://your-app.com/terms",
    "privacyPolicy": "https://your-app.com/privacy"
  }
}
```

### Widget Example (React)

```tsx
// widget.tsx
import React, { useState, useEffect } from 'react';

export default function CodeAnalyzer() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Access window.openai runtime
  useEffect(() => {
    if (window.openai) {
      // Get current chat context
      const context = window.openai.getContext();
      console.log('Chat context:', context);
      
      // Listen for messages from ChatGPT
      window.openai.onMessage((message) => {
        if (message.command === 'analyze') {
          analyzeCode(message.params);
        }
      });
    }
  }, []);
  
  async function analyzeCode(params) {
    setLoading(true);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.openai.getToken()}`
        },
        body: JSON.stringify(params)
      });
      
      const result = await response.json();
      setAnalysis(result);
      
      // Send result back to ChatGPT
      window.openai.sendMessage({
        type: 'analysis_complete',
        data: result
      });
      
    } catch (error) {
      window.openai.sendMessage({
        type: 'error',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="code-analyzer">
      <h2>Code Analysis</h2>
      
      {loading && <div className="spinner">Analyzing...</div>}
      
      {analysis && (
        <div className="results">
          <h3>Security Issues: {analysis.security.length}</h3>
          <ul>
            {analysis.security.map((issue, i) => (
              <li key={i} className={`severity-${issue.severity}`}>
                <strong>{issue.type}</strong>: {issue.message}
                <code>{issue.snippet}</code>
              </li>
            ))}
          </ul>
          
          <h3>Performance Issues: {analysis.performance.length}</h3>
          <ul>
            {analysis.performance.map((issue, i) => (
              <li key={i}>
                <strong>{issue.type}</strong>: {issue.message}
              </li>
            ))}
          </ul>
          
          <button onClick={() => {
            window.openai.sendMessage({
              type: 'request_fix',
              issues: analysis.security
            });
          }}>
            Fix Security Issues
          </button>
        </div>
      )}
    </div>
  );
}
```

### window.openai API Reference

```typescript
interface WindowOpenAI {
  // Get current chat context
  getContext(): ChatContext;
  
  // Get OAuth token
  getToken(): string;
  
  // Send message to ChatGPT
  sendMessage(message: any): void;
  
  // Listen for messages from ChatGPT
  onMessage(callback: (message: any) => void): void;
  
  // Get/set persistent state
  getState(key: string): any;
  setState(key: string, value: any): void;
  
  // Request user action
  requestAction(action: Action): Promise<ActionResult>;
}

interface ChatContext {
  conversationId: string;
  messageId: string;
  userId: string;
  model: string;
  messages: Message[];
}
```

### Publishing to App Directory

```bash
# Test locally
npm run build
npm run preview

# Deploy to hosting
vercel deploy --prod
# or
netlify deploy --prod

# Submit to App Directory
# 1. Go to: https://platform.openai.com/apps
# 2. Click "Submit App"
# 3. Provide app.json URL
# 4. Complete review process (1-2 weeks)
```

---

## Connectors

### Official Connectors (Read-Only)

ChatGPT provides **15 official connectors** for read-only access:

| Connector | Description | Setup |
|-----------|-------------|-------|
| **Google Workspace** | Gmail, Drive, Calendar, Docs | OAuth via Google |
| **Microsoft 365** | Outlook, OneDrive, Teams | OAuth via Microsoft |
| **Notion** | Databases, pages, blocks | Notion integration |
| **Slack** | Messages, channels, files | Slack app install |
| **GitHub** | Repos, issues, PRs, code | GitHub OAuth |
| **Salesforce** | CRM data, reports | Salesforce OAuth |
| **Jira** | Issues, projects, sprints | Atlassian OAuth |
| **Confluence** | Pages, spaces | Atlassian OAuth |
| **Asana** | Tasks, projects | Asana OAuth |
| **Trello** | Boards, cards | Trello OAuth |
| **Dropbox** | Files, folders | Dropbox OAuth |
| **Box** | Files, folders | Box OAuth |
| **Airtable** | Bases, tables | Airtable OAuth |
| **HubSpot** | CRM, marketing | HubSpot OAuth |
| **Zendesk** | Tickets, users | Zendesk OAuth |

### Enable Connectors

1. Go to: https://chatgpt.com/settings/data-controls
2. Click "Manage connections"
3. Select connector (e.g., "Google Drive")
4. Click "Connect"
5. Complete OAuth flow
6. Grant permissions

### Using Connectors

Once connected, ChatGPT can access data automatically:

```
User: "Find my Q4 budget spreadsheet in Google Drive"

ChatGPT: [automatically searches Google Drive]
I found your Q4 2024 Budget spreadsheet. It shows:
- Revenue: $2.5M
- Expenses: $1.8M
- Profit margin: 28%

Would you like me to analyze any specific section?
```

**Limitations:**
- Read-only access (no modifications)
- Rate limits apply
- Some data types excluded (e.g., shared drives in Google)

---

## OpenAI Agents SDK

### What is OpenAI Agents SDK?

**Framework for building custom agents** with MCP integration:

```bash
npm install openai-agents
```

### MCP Integration Example

```typescript
// agent-with-mcp.ts
import { Agent } from 'openai-agents';
import { MCPServerStdio, MCPServerSSE } from 'openai-agents/mcp';

const agent = new Agent({
  name: 'code-assistant',
  model: 'gpt-4o',
  instructions: 'You are a senior developer assistant',
  
  tools: [
    // MCP server via stdio
    new MCPServerStdio({
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-github'],
      env: {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN
      }
    }),
    
    // MCP server via SSE
    new MCPServerSSE({
      url: 'https://mcp.example.com/sse',
      auth: {
        type: 'oauth',
        token: process.env.OAUTH_TOKEN
      }
    }),
    
    // Custom tool
    {
      name: 'run_tests',
      description: 'Runs test suite',
      parameters: {
        type: 'object',
        properties: {
          framework: { type: 'string', enum: ['jest', 'pytest', 'mocha'] }
        }
      },
      execute: async (params) => {
        const result = await runTests(params.framework);
        return { passed: result.passed, failed: result.failed };
      }
    }
  ]
});

// Run agent
const result = await agent.run({
  messages: [
    { role: 'user', content: 'Analyze the code in main.ts and run tests' }
  ]
});

console.log(result.messages);
```

### Hosted MCP Tools

Use external MCP servers as tools:

```typescript
import { HostedMCPTool } from 'openai-agents/mcp';

const githubTool = new HostedMCPTool({
  name: 'github',
  url: 'https://mcp.github.com/sse',
  auth: {
    type: 'bearer',
    token: process.env.GITHUB_TOKEN
  }
});

const agent = new Agent({
  tools: [githubTool]
});
```

---

## Best Practices

### Security

1. **OAuth over API keys** (when possible)
   ```json
   {
     "authentication": {
       "type": "oauth",  // ✅ Preferred
       "scopes": ["read"]  // Least privilege
     }
   }
   ```

2. **Validate all inputs**
   ```typescript
   mcpServer.tool({
     name: 'execute',
     parameters: { /* ... */ }
   }, async (params) => {
     // ✅ Validate before execution
     if (!isValidCommand(params.command)) {
       throw new Error('Invalid command');
     }
     return execute(params.command);
   });
   ```

3. **Use readOnlyHint correctly**
   ```typescript
   // Read-only = no confirmation needed
   { name: 'search', readOnlyHint: true }
   
   // Write action = requires user confirmation
   { name: 'deploy', readOnlyHint: false }
   ```

4. **Rate limiting**
   ```typescript
   const limiter = new RateLimiter({
     max: 100,  // requests
     window: 3600000  // per hour
   });
   
   await limiter.check(userId);
   ```

### Performance

1. **Stream large responses**
   ```typescript
   async function* streamResults(query) {
     const results = await fetchBatch(query);
     for (const item of results) {
       yield item;
     }
   }
   ```

2. **Cache expensive operations**
   ```typescript
   const cache = new Map();
   
   async function getAnalysis(code) {
     const key = hash(code);
     if (cache.has(key)) return cache.get(key);
     
     const result = await analyze(code);
     cache.set(key, result);
     return result;
   }
   ```

3. **Timeout long operations**
   ```typescript
   const result = await Promise.race([
     longOperation(),
     timeout(30000)
   ]);
   ```

### User Experience

1. **Clear tool descriptions**
   ```typescript
   {
     name: 'analyze_code',
     description: 'Analyzes code for security vulnerabilities (OWASP Top 10), performance issues, and code style. Returns detailed report with severity levels and fix suggestions.',
     // NOT: 'analyzes code'
   }
   ```

2. **Structured responses**
   ```typescript
   return {
     summary: 'Found 3 critical issues',
     details: {
       security: [...],
       performance: [...],
       style: [...]
     },
     actions: [
       { name: 'Fix All', command: 'fix_issues' },
       { name: 'Ignore', command: 'ignore' }
     ]
   };
   ```

3. **Error handling with context**
   ```typescript
   try {
     return await deploy();
   } catch (error) {
     return {
       success: false,
       error: {
         message: 'Deployment failed',
         cause: error.message,
         fix: 'Check logs at https://logs.example.com',
         retry: 'Run /deploy again after fixing issues'
       }
     };
   }
   ```

---

## Troubleshooting

### Developer Mode Not Available

**Symptom:** Can't find Developer Mode in settings

**Fix:**
1. Ensure OpenAI account has API access
2. Check email for beta approval
3. Contact OpenAI support if pending >5 days

### MCP Server Connection Failed

**Symptom:** "Failed to connect to MCP server" error

**Causes:**
1. Server not running
2. Wrong URL/port
3. Authentication failed
4. CORS issues (for SSE)

**Fix:**
```bash
# Test server directly
curl https://your-server.com/mcp

# Check CORS headers
curl -I -X OPTIONS https://your-server.com/mcp \
  -H "Origin: https://chatgpt.com"

# Verify authentication
curl https://your-server.com/mcp \
  -H "Authorization: Bearer $TOKEN"
```

### Widget Not Rendering

**Symptom:** Blank widget or loading spinner

**Causes:**
1. Runtime URL incorrect
2. CORS not configured
3. JavaScript error
4. Missing window.openai

**Fix:**
```javascript
// Add error boundary
window.onerror = (msg, url, line) => {
  console.error('Widget error:', msg, url, line);
  if (window.openai) {
    window.openai.sendMessage({
      type: 'error',
      error: { message: msg, line }
    });
  }
};

// Check CORS
// Server must return:
Access-Control-Allow-Origin: https://chatgpt.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Authorization, Content-Type
```

### OAuth Flow Fails

**Symptom:** OAuth redirect fails or token invalid

**Causes:**
1. Redirect URI mismatch
2. Client ID/secret incorrect
3. Scopes not granted

**Fix:**
```json
{
  "authentication": {
    "authorizationUrl": "https://auth.example.com/oauth/authorize",
    "tokenUrl": "https://auth.example.com/oauth/token",
    "redirectUri": "https://chatgpt.com/oauth/callback",  // Must match exactly
    "clientId": "${CLIENT_ID}",  // Check in OAuth provider dashboard
    "scopes": ["read", "write"]  // Must be approved by provider
  }
}
```

### Rate Limit Errors

**Symptom:** "Rate limit exceeded" errors

**Fix:**
```typescript
// Implement exponential backoff
async function requestWithRetry(url, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (error.status === 429) {
        const delay = Math.min(1000 * Math.pow(2, i), 30000);
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
}
```

---

## Next Steps

1. **Enable Developer Mode**: Request beta access
2. **Create MCP server**: Use template in `../examples/chatgpt-mcp/`
3. **Build Apps SDK widget**: Use `npm create openai-app`
4. **Connect services**: Enable official connectors
5. **Read comprehensive guide**: `../AI-ECOSYSTEM-COMPREHENSIVE-GUIDE.md`

## Resources

- **Apps SDK docs**: https://developers.openai.com/apps-sdk
- **Developer Mode guide**: https://platform.openai.com/docs/guides/developer-mode
- **OpenAI Agents SDK**: https://github.com/openai/openai-agents
- **App Directory**: https://chatgpt.com/gpts
- **Community**: https://community.openai.com

---

**Pro Tips:**
- Use Apps SDK for rich interactive experiences
- Use MCP for backend tool integrations
- Use Connectors for quick read-only access
- Test with `readOnlyHint: true` first (no confirmations)
- Cache aggressively (ChatGPT may retry requests)
- Monitor usage in OpenAI dashboard
