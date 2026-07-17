# **AI Ecosystem Comprehensive Guide**
## **Claude, ChatGPT, Gemini, & GitHub Copilot**

**Version:** 1.0.0  
**Created:** December 26, 2025  
**Owner:** Staff Platform Engineer  
**Status:** Reference Guide

---

## **TL;DR**

This guide maps the **complete ecosystem** for all four major AI platforms: Claude (Anthropic), ChatGPT (OpenAI), Gemini (Google), and GitHub Copilot (Microsoft). Covers configuration files, plugins, MCPs, SDKs, agents, marketplaces, and integration patterns.

**Quick Comparison:**

| Feature | Claude | ChatGPT | Gemini | Copilot |
|---|---|---|---|---|
| **MCP Support** | ✅ Native | ✅ Via plugins | ⚠️ Limited | ❌ No |
| **Custom Agents** | ✅ Skills + Subagents | ✅ GPTs | ✅ Gems | ✅ Extensions |
| **Marketplace** | ✅ Skill Library | ✅ GPT Store | ✅ Gem Gallery | ✅ Extensions |
| **Code Execution** | ✅ Native | ✅ Code Interpreter | ✅ Native | ✅ Native |
| **Best For** | Security, Reasoning | Plugins, Integrations | Multimodal, Scale | Code Generation |

---

## **Table of Contents**

1. [Claude Ecosystem](#claude-ecosystem)
2. [ChatGPT Ecosystem](#chatgpt-ecosystem)
3. [Gemini Ecosystem](#gemini-ecosystem)
4. [GitHub Copilot Ecosystem](#github-copilot-ecosystem)
5. [Cross-Platform Comparison](#cross-platform-comparison)
6. [Integration Strategies](#integration-strategies)
7. [Multi-Platform Architecture](#multi-platform-architecture)
8. [Best Practices](#best-practices)

---

## **Claude Ecosystem**

### **Core Products**

| Product | Interface | Use Case | Access |
|---|---|---|---|
| **Claude.ai** | Web/Mobile | Chat, docs, code | Free + Pro ($20/mo) |
| **Claude Code** | CLI/Desktop | Agentic coding | Claude Pro required |
| **Claude API** | REST | Custom integrations | Pay-per-token |
| **Claude Desktop** | Native app | System integration | Free |

### **Configuration Files**

#### **1. SKILL.md (Agent Skills)**

**Location:** `.skills/your-skill/SKILL.md`

**Purpose:** Define reusable agent capabilities with triggers, examples, and workflows

**Structure:**

```markdown
---
name: code-security-audit
version: 1.0.0
author: your-team
category: security
triggers:
  keywords:
    - "security audit"
    - "find vulnerabilities"
  patterns:
    - "*.ts"
    - "*.tsx"
---

# Security Audit Skill

## Description
Performs comprehensive security audit on TypeScript codebases.

## Triggers
- User says "audit security" or "find vulnerabilities"
- Files with patterns: *.ts, *.tsx

## Examples

<example>
User: "Audit this code for security issues"
Assistant: [Runs security analysis using OWASP guidelines]
</example>

## Instructions

1. Scan for common vulnerabilities:
   - SQL injection
   - XSS
   - CSRF
   - Auth bypass
   
2. Check for:
   - Hardcoded secrets
   - Missing input validation
   - Unsafe dependencies

3. Output format:
   - Severity (Critical/High/Medium/Low)
   - Location (file:line)
   - Description
   - Fix recommendation

## Tools Required
- bash_tool (for dependency scanning)
- view (for code inspection)
```

**Real Example from Your Setup:**

```markdown
---
name: staff-engineer-v3
version: 3.0.0
triggers:
  keywords:
    - "build secure"
    - "production ready"
---

# Staff Engineer v3 Skill

Security-first workflow for production systems.

## Process
1. Clarify requirements
2. Select tech stack (justify escapes)
3. Plan architecture (modules, data model)
4. Implement with security gates
5. Document (README, .env.example, runbooks)
6. Critique (3 weaknesses + fixes)
```

#### **2. .skills/ Directory Structure**

```
.skills/
├── public/                    # Anthropic-provided skills
│   ├── docx/
│   │   ├── SKILL.md
│   │   └── examples/
│   ├── pptx/
│   ├── pdf/
│   └── xlsx/
├── user/                      # Your custom skills
│   ├── staff-engineer-v3/
│   │   ├── SKILL.md
│   │   └── templates/
│   ├── backend-dev-guidelines/
│   ├── frontend-dev-guidelines/
│   └── skill-developer/       # Meta-skill for creating skills
└── examples/                  # Example skills from community
    ├── mcp-builder/
    ├── theme-factory/
    └── doc-coauthoring/
```

#### **3. Agents Configuration**

**File:** `agents/config.json`

**Purpose:** Define subagents with specific roles and tool access

```json
{
  "agents": {
    "code-generator": {
      "name": "Code Generator Agent",
      "model": "claude-sonnet-4-5-20250514",
      "systemPrompt": "You are a senior software engineer specializing in TypeScript and React.",
      "tools": ["bash_tool", "create_file", "str_replace", "view"],
      "temperature": 0.7,
      "maxTokens": 8000,
      "skills": ["frontend-dev-guidelines", "backend-dev-guidelines"]
    },
    "security-auditor": {
      "name": "Security Audit Agent",
      "model": "claude-sonnet-4-5-20250514",
      "systemPrompt": "You are an AppSec expert. Audit code for OWASP Top 10 vulnerabilities.",
      "tools": ["bash_tool", "view"],
      "temperature": 0.2,
      "maxTokens": 4000,
      "skills": ["staff-engineer-v3"]
    },
    "documentation-writer": {
      "name": "Documentation Agent",
      "model": "claude-sonnet-4-5-20250514",
      "systemPrompt": "You write clear, comprehensive technical documentation.",
      "tools": ["create_file", "str_replace", "view"],
      "temperature": 0.5,
      "maxTokens": 8000,
      "skills": ["internal-comms", "doc-coauthoring"]
    }
  },
  "workflows": {
    "full-stack-feature": {
      "description": "Build a complete full-stack feature",
      "steps": [
        {
          "agent": "code-generator",
          "task": "Generate backend tRPC route with Zod validation"
        },
        {
          "agent": "security-auditor",
          "task": "Audit generated code for security issues"
        },
        {
          "agent": "code-generator",
          "task": "Generate frontend React component"
        },
        {
          "agent": "documentation-writer",
          "task": "Write API documentation and usage guide"
        }
      ]
    }
  }
}
```

#### **4. MCP Configuration**

**File:** `claude_desktop_config.json`

**Location:** 
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

**Purpose:** Configure Model Context Protocol servers for tool integration

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/projects"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "BSA_xxx"
      }
    },
    "notion": {
      "command": "node",
      "args": ["/path/to/notion-mcp/dist/index.js"],
      "env": {
        "NOTION_API_KEY": "secret_xxx"
      }
    },
    "custom-tools": {
      "command": "python",
      "args": ["-m", "mcp_server_custom"],
      "env": {
        "API_KEY": "xxx"
      }
    }
  },
  "globalShortcut": "CommandOrControl+Shift+Space"
}
```

**Available MCP Servers (90+ Official):**

| Category | Servers |
|---|---|
| **Development** | GitHub, GitLab, Linear, Sentry |
| **Productivity** | Notion, Google Drive, Slack, Gmail |
| **Data** | PostgreSQL, SQLite, Supabase, Airtable |
| **Cloud** | AWS, GCP, Cloudflare, Vercel |
| **Payments** | Stripe, PayPal |
| **Marketing** | HubSpot, Mailchimp, Zapier |
| **Design** | Figma, Canva |

**Custom MCP Server Example:**

```typescript
// mcp-server-custom/src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new Server({
  name: "custom-tools",
  version: "1.0.0",
});

// Define tools
server.setRequestHandler("tools/list", async () => {
  return {
    tools: [
      {
        name: "deploy_to_vercel",
        description: "Deploy current project to Vercel",
        inputSchema: {
          type: "object",
          properties: {
            environment: {
              type: "string",
              enum: ["production", "preview"],
              description: "Deployment environment",
            },
          },
          required: ["environment"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "deploy_to_vercel") {
    const { environment } = request.params.arguments;
    
    // Execute deployment
    const result = await execAsync(`vercel --${environment}`);
    
    return {
      content: [
        {
          type: "text",
          text: `Deployed to ${environment}: ${result.stdout}`,
        },
      ],
    };
  }
  
  throw new Error("Unknown tool");
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

#### **5. Slash Commands**

**File:** `.claude/commands.yaml`

**Purpose:** Define custom slash commands for common workflows

```yaml
commands:
  - name: /audit-security
    description: "Run security audit on current file"
    prompt: |
      Perform a comprehensive security audit on this file.
      Check for:
      1. SQL injection vulnerabilities
      2. XSS risks
      3. Authentication bypass
      4. Missing input validation
      5. Hardcoded secrets
      
      Output findings in this format:
      **[SEVERITY]** Issue description
      - Location: file:line
      - Fix: Specific recommendation
    
  - name: /generate-tests
    description: "Generate unit tests for current file"
    prompt: |
      Generate comprehensive unit tests for this file using Vitest.
      Include:
      - Happy path tests
      - Edge cases
      - Error handling
      - Mock external dependencies
      
      Follow our testing conventions in tests/README.md
    
  - name: /refactor-rls
    description: "Add Row-Level Security to database query"
    prompt: |
      Add Row-Level Security (RLS) to this Prisma query.
      Enforce: `where: { userId: ctx.session.user.id }`
      
      Preserve existing where conditions using AND.
    
  - name: /create-trpc-route
    description: "Generate new tRPC route with validation"
    prompt: |
      Create a new tRPC route with:
      1. Zod input validation
      2. RLS enforcement
      3. Error handling (Cause → Fix → Retry)
      4. TypeScript types
      5. JSDoc comments
      
      Use the pattern from src/server/routers/_app.ts
```

#### **6. Memory Configuration**

**File:** `.claude/memory.json`

**Purpose:** Persistent memory across conversations

```json
{
  "version": "1.0",
  "memories": [
    {
      "type": "preference",
      "content": "Always use TypeScript strict mode",
      "created": "2025-01-15T10:00:00Z"
    },
    {
      "type": "project",
      "content": "Current stack: Next.js 15, tRPC, Prisma, Supabase",
      "created": "2025-01-15T10:00:00Z"
    },
    {
      "type": "security",
      "content": "Always enforce RLS: userId === ctx.session.user.id",
      "created": "2025-01-15T10:00:00Z"
    },
    {
      "type": "workflow",
      "content": "For non-trivial work: TL;DR → Analogy → Plan → Code → Tests → Docs",
      "created": "2025-01-15T10:00:00Z"
    }
  ],
  "maxMemories": 100,
  "autoCleanup": {
    "enabled": true,
    "retentionDays": 90
  }
}
```

### **Plugin & Extension Ecosystem**

#### **Official Skills (Anthropic-Maintained)**

```
@modelcontextprotocol/skills-public/
├── docx              # Word document creation/editing
├── pptx              # PowerPoint presentations
├── pdf               # PDF manipulation
├── xlsx              # Excel spreadsheets
├── frontend-design   # UI/UX design patterns
└── product-self-knowledge  # Anthropic product info
```

#### **Community Skills**

**Skill Marketplace:** https://github.com/anthropics/mcp-skills (hypothetical)

**Popular Community Skills:**

| Skill | Author | Description | Stars |
|---|---|---|---|
| `workflow-automation` | @community | n8n, Zapier, Make integrations | 2.5K |
| `ai-agents-workflow` | @community | LangChain, CrewAI patterns | 1.8K |
| `mcp-builder` | @community | Build custom MCP servers | 1.2K |
| `staff-engineer-v3` | @community | Production architecture | 900 |

### **SDK & API**

#### **Anthropic SDK**

**Installation:**

```bash
# TypeScript/JavaScript
npm install @anthropic-ai/sdk

# Python
pip install anthropic

# Go
go get github.com/anthropics/anthropic-sdk-go
```

**Usage:**

```typescript
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.messages.create({
  model: "claude-sonnet-4-5-20250514",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: "Explain quantum computing in simple terms",
    },
  ],
});

console.log(message.content);
```

**Tool Use (Function Calling):**

```typescript
const message = await anthropic.messages.create({
  model: "claude-sonnet-4-5-20250514",
  max_tokens: 1024,
  tools: [
    {
      name: "get_weather",
      description: "Get current weather for a location",
      input_schema: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "City name",
          },
        },
        required: ["location"],
      },
    },
  ],
  messages: [
    {
      role: "user",
      content: "What's the weather in San Francisco?",
    },
  ],
});

// Claude will return tool_use block
if (message.stop_reason === "tool_use") {
  const toolUse = message.content.find((block) => block.type === "tool_use");
  
  // Execute tool
  const weatherData = await getWeather(toolUse.input.location);
  
  // Send result back to Claude
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "What's the weather in San Francisco?",
      },
      {
        role: "assistant",
        content: message.content,
      },
      {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: JSON.stringify(weatherData),
          },
        ],
      },
    ],
  });
}
```

### **Documentation Resources**

| Resource | URL | Description |
|---|---|---|
| **Official Docs** | https://docs.anthropic.com | Complete API reference |
| **Prompt Library** | https://docs.anthropic.com/prompts | Prompt engineering examples |
| **Cookbook** | https://github.com/anthropics/anthropic-cookbook | Code examples |
| **MCP Docs** | https://modelcontextprotocol.io | MCP specification |
| **Community Forum** | https://community.anthropic.com | Q&A, discussions |

### **Key Repositories**

```
anthropics/
├── anthropic-sdk-typescript    # Official TypeScript SDK
├── anthropic-sdk-python        # Official Python SDK
├── anthropic-cookbook          # Code examples
├── courses                     # Educational content
├── prompt-eng-interactive-tutorial  # Prompt engineering course
└── mcp-servers                 # Official MCP servers
```

---

## **ChatGPT Ecosystem**

### **Core Products**

| Product | Interface | Use Case | Access |
|---|---|---|---|
| **ChatGPT** | Web/Mobile/Desktop | General chat | Free + Plus ($20/mo) |
| **GPTs** | Web | Custom agents | ChatGPT Plus |
| **ChatGPT API** | REST | Custom integrations | Pay-per-token |
| **ChatGPT Code Interpreter** | Web | Data analysis | ChatGPT Plus |

### **Configuration Files**

#### **1. GPT Configuration (Custom GPTs)**

**Location:** Created via ChatGPT web interface

**Structure:**

```json
{
  "name": "Senior Full-Stack Engineer",
  "description": "Expert in TypeScript, React, Node.js, and PostgreSQL",
  "instructions": "You are a senior full-stack engineer with 10+ years of experience.\n\nAlways:\n- Use TypeScript with strict mode\n- Validate inputs with Zod\n- Enforce Row-Level Security in database queries\n- Include error handling with Cause → Fix → Retry pattern\n- Add JSDoc comments for exported functions\n\nNever:\n- Use 'any' type\n- Skip input validation\n- Store secrets in code",
  "conversationStarters": [
    "Generate a tRPC route with Zod validation",
    "Audit this code for security vulnerabilities",
    "Create a React component with TypeScript",
    "Write unit tests for this function"
  ],
  "knowledge": [
    "backend-patterns.md",
    "frontend-patterns.md",
    "security-checklist.md"
  ],
  "capabilities": {
    "webBrowsing": true,
    "codeInterpreter": true,
    "imageGeneration": false
  },
  "actions": [
    {
      "name": "Deploy to Vercel",
      "description": "Deploy the current project to Vercel",
      "schema": {
        "type": "openapi",
        "url": "https://api.vercel.com/openapi.json"
      },
      "authentication": {
        "type": "bearer",
        "token": "VERCEL_TOKEN"
      }
    }
  ]
}
```

#### **2. Actions Configuration (OpenAPI)**

**File:** `gpt-actions.yaml`

**Purpose:** Define custom actions (API integrations) for GPTs

```yaml
openapi: 3.0.0
info:
  title: Custom GPT Actions
  version: 1.0.0
servers:
  - url: https://api.yourapp.com/v1

paths:
  /deploy:
    post:
      operationId: deployToVercel
      summary: Deploy to Vercel
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                environment:
                  type: string
                  enum: [production, preview]
              required:
                - environment
      responses:
        '200':
          description: Deployment successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  deploymentUrl:
                    type: string
                  status:
                    type: string

  /security-audit:
    post:
      operationId: runSecurityAudit
      summary: Run security audit
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                code:
                  type: string
                language:
                  type: string
              required:
                - code
                - language
      responses:
        '200':
          description: Audit results
          content:
            application/json:
              schema:
                type: object
                properties:
                  vulnerabilities:
                    type: array
                    items:
                      type: object
                      properties:
                        severity:
                          type: string
                        description:
                          type: string
                        fix:
                          type: string
```

#### **3. Plugin Manifest (Legacy Plugins)**

**File:** `.well-known/ai-plugin.json`

**Purpose:** Define ChatGPT plugin (deprecated in favor of GPT Actions)

```json
{
  "schema_version": "v1",
  "name_for_human": "Code Security Auditor",
  "name_for_model": "code_security",
  "description_for_human": "Audit code for security vulnerabilities",
  "description_for_model": "Use this plugin when the user asks to audit code for security issues. It scans for common vulnerabilities like SQL injection, XSS, CSRF, and authentication bypass.",
  "auth": {
    "type": "service_http",
    "authorization_type": "bearer",
    "verification_tokens": {
      "openai": "your_verification_token"
    }
  },
  "api": {
    "type": "openapi",
    "url": "https://api.yourapp.com/openapi.yaml"
  },
  "logo_url": "https://yourapp.com/logo.png",
  "contact_email": "support@yourapp.com",
  "legal_info_url": "https://yourapp.com/legal"
}
```

### **Plugin & Extension Ecosystem**

#### **GPT Store**

**URL:** https://chat.openai.com/gpts

**Categories:**
- Writing & Content
- Productivity
- Research & Analysis
- Programming & Code
- Education
- Lifestyle

**Popular GPTs:**

| GPT | Creator | Description | Users |
|---|---|---|---|
| **Canva** | Canva | Create designs | 10M+ |
| **Scholar GPT** | Community | Academic research | 5M+ |
| **Code Copilot** | Community | Programming help | 3M+ |
| **Data Analyst** | OpenAI | Data analysis | 8M+ |

#### **ChatGPT Plugins (Deprecated)**

**Note:** Plugins are being phased out in favor of GPT Actions.

**Migration Path:**
1. Export plugin as OpenAPI spec
2. Convert to GPT Action
3. Publish as GPT in GPT Store

### **SDK & API**

#### **OpenAI SDK**

**Installation:**

```bash
# TypeScript/JavaScript
npm install openai

# Python
pip install openai

# Go
go get github.com/sashabaranov/go-openai
```

**Usage:**

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: "gpt-4-turbo-2024-04-09",
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
    {
      role: "user",
      content: "Explain quantum computing",
    },
  ],
});

console.log(completion.choices[0].message.content);
```

**Function Calling:**

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4-turbo-2024-04-09",
  messages: [
    {
      role: "user",
      content: "What's the weather in San Francisco?",
    },
  ],
  tools: [
    {
      type: "function",
      function: {
        name: "get_weather",
        description: "Get current weather",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "City name",
            },
          },
          required: ["location"],
        },
      },
    },
  ],
  tool_choice: "auto",
});

// Execute function
if (completion.choices[0].finish_reason === "tool_calls") {
  const toolCall = completion.choices[0].message.tool_calls[0];
  
  const weatherData = await getWeather(
    JSON.parse(toolCall.function.arguments).location
  );
  
  // Send result back
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-2024-04-09",
    messages: [
      ...messages,
      completion.choices[0].message,
      {
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(weatherData),
      },
    ],
  });
}
```

**Assistants API (Agents):**

```typescript
// Create assistant
const assistant = await openai.beta.assistants.create({
  name: "Code Security Auditor",
  instructions: "You are an AppSec expert. Audit code for vulnerabilities.",
  model: "gpt-4-turbo-2024-04-09",
  tools: [
    { type: "code_interpreter" },
    { type: "retrieval" },
  ],
});

// Create thread
const thread = await openai.beta.threads.create();

// Add message
await openai.beta.threads.messages.create(thread.id, {
  role: "user",
  content: "Audit this code: [code here]",
});

// Run assistant
const run = await openai.beta.threads.runs.create(thread.id, {
  assistant_id: assistant.id,
});

// Wait for completion
while (true) {
  const runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  
  if (runStatus.status === "completed") {
    const messages = await openai.beta.threads.messages.list(thread.id);
    console.log(messages.data[0].content[0].text.value);
    break;
  }
  
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
```

### **Documentation Resources**

| Resource | URL | Description |
|---|---|---|
| **Official Docs** | https://platform.openai.com/docs | Complete API reference |
| **GPT Store** | https://chat.openai.com/gpts | Browse custom GPTs |
| **Cookbook** | https://github.com/openai/openai-cookbook | Code examples |
| **Community Forum** | https://community.openai.com | Q&A, discussions |

### **Key Repositories**

```
openai/
├── openai-python              # Official Python SDK
├── openai-node                # Official Node SDK
├── openai-cookbook            # Code examples
├── gpt-4-vision-examples      # Vision API examples
└── tiktoken                   # Token counting
```

---

## **Gemini Ecosystem**

### **Core Products**

| Product | Interface | Use Case | Access |
|---|---|---|---|
| **Gemini** | Web/Mobile | General chat | Free + Advanced |
| **Gemini API** | REST | Custom integrations | Pay-per-token |
| **Vertex AI** | GCP Console | Enterprise AI | GCP account |
| **AI Studio** | Web | Prompt engineering | Free |

### **Configuration Files**

#### **1. Gem Configuration (Custom Gems)**

**Location:** Created via Gemini web interface

**Structure:**

```json
{
  "name": "Senior Backend Engineer",
  "description": "Expert in Node.js, TypeScript, PostgreSQL, and system design",
  "systemInstruction": "You are a senior backend engineer with expertise in:\n- Node.js and TypeScript\n- PostgreSQL database design\n- System architecture\n- API design (REST, GraphQL, tRPC)\n\nAlways:\n- Use TypeScript strict mode\n- Validate inputs\n- Handle errors gracefully\n- Write testable code\n\nNever:\n- Use 'any' type\n- Skip error handling\n- Store secrets in code",
  "tools": [
    {
      "type": "google_search",
      "enabled": true
    },
    {
      "type": "code_execution",
      "enabled": true
    }
  ],
  "grounding": {
    "sources": [
      {
        "type": "google_drive",
        "fileIds": ["doc_id_1", "doc_id_2"]
      },
      {
        "type": "web_search",
        "enabled": true
      }
    ]
  },
  "safetySettings": {
    "HARM_CATEGORY_HARASSMENT": "BLOCK_MEDIUM_AND_ABOVE",
    "HARM_CATEGORY_HATE_SPEECH": "BLOCK_MEDIUM_AND_ABOVE",
    "HARM_CATEGORY_SEXUALLY_EXPLICIT": "BLOCK_MEDIUM_AND_ABOVE",
    "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_MEDIUM_AND_ABOVE"
  }
}
```

#### **2. GEMINI.md (Project Context)**

**File:** `GEMINI.md`

**Purpose:** Project-specific instructions for Gemini

```markdown
# Project: AI Development Platform

## Tech Stack
- **Frontend:** Next.js 15, React, Tailwind CSS
- **Backend:** tRPC, Prisma, PostgreSQL
- **Auth:** Supabase Auth
- **AI:** Claude API, Gemini API
- **Hosting:** Vercel, Supabase

## Architecture
- Monorepo structure (pnpm workspaces)
- Server components by default
- tRPC for type-safe APIs
- Prisma for database access
- Row-Level Security (RLS) enforced

## Coding Standards
- TypeScript strict mode
- Zod for runtime validation
- ESLint + Prettier
- Vitest for testing
- Conventional commits

## Security Requirements
- Always enforce RLS: `userId === ctx.session.user.id`
- Never store secrets in code
- Validate all user inputs
- Use parameterized queries only
- Implement rate limiting

## Common Tasks
1. **Create tRPC route:**
   ```typescript
   export const myRouter = router({
     create: protectedProcedure
       .input(z.object({ name: z.string() }))
       .mutation(async ({ ctx, input }) => {
         return ctx.db.item.create({
           data: {
             ...input,
             userId: ctx.session.user.id, // RLS
           },
         });
       }),
   });
   ```

2. **Create React component:**
   ```typescript
   export function MyComponent() {
     const { data } = api.myRouter.list.useQuery();
     return <div>{data?.items.map(...)}</div>;
   }
   ```

## References
- API docs: `src/server/routers/README.md`
- DB schema: `prisma/schema.prisma`
- Testing: `tests/README.md`
```

#### **3. AI Studio Configuration**

**File:** `ai-studio-config.json`

**Purpose:** Configure prompts and model settings in AI Studio

```json
{
  "prompts": {
    "code-generation": {
      "model": "gemini-1.5-pro",
      "systemInstruction": "You are an expert TypeScript developer...",
      "temperature": 0.7,
      "topP": 0.95,
      "topK": 40,
      "maxOutputTokens": 8192,
      "examples": [
        {
          "input": "Create a tRPC route for user login",
          "output": "export const authRouter = router({..."
        }
      ]
    },
    "code-review": {
      "model": "gemini-1.5-flash",
      "systemInstruction": "You are a code reviewer focusing on security and best practices...",
      "temperature": 0.2,
      "topP": 0.8,
      "topK": 20,
      "maxOutputTokens": 4096
    }
  },
  "grounding": {
    "googleSearch": true,
    "customDocuments": [
      "gs://my-bucket/docs/backend-patterns.md",
      "gs://my-bucket/docs/frontend-patterns.md"
    ]
  }
}
```

### **Plugin & Extension Ecosystem**

#### **Gem Gallery (Google's Gem Store)**

**URL:** https://gemini.google.com/gems (hypothetical)

**Categories:**
- Coding & Development
- Writing & Content
- Research & Learning
- Productivity
- Creative

**Popular Gems:**

| Gem | Creator | Description |
|---|---|---|
| **Code Expert** | Google | Programming help |
| **Learning Coach** | Google | Educational tutor |
| **Creative Writing Partner** | Google | Story writing |

#### **Extensions (Google Workspace)**

**Built-in Extensions:**
- Gmail
- Google Drive
- Google Docs
- Google Calendar
- Google Maps
- YouTube
- Google Flights
- Google Hotels

**Usage:**

```
@Gmail find emails from john@example.com about the project

@Drive search for the Q3 roadmap document

@Docs summarize the strategy document and create action items
```

### **SDK & API**

#### **Google Generative AI SDK**

**Installation:**

```bash
# TypeScript/JavaScript
npm install @google/generative-ai

# Python
pip install google-generativeai

# Go
go get github.com/google/generative-ai-go
```

**Usage:**

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const result = await model.generateContent("Explain quantum computing");

console.log(result.response.text());
```

**Function Calling:**

```typescript
const functionDeclarations = [
  {
    name: "get_weather",
    description: "Get current weather for a location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "City name",
        },
      },
      required: ["location"],
    },
  },
];

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  tools: [{ functionDeclarations }],
});

const chat = model.startChat();

const result = await chat.sendMessage("What's the weather in Tokyo?");

const call = result.response.functionCalls()[0];

if (call) {
  const weatherData = await getWeather(call.args.location);
  
  const response = await chat.sendMessage([
    {
      functionResponse: {
        name: call.name,
        response: weatherData,
      },
    },
  ]);
  
  console.log(response.response.text());
}
```

**Multimodal (Vision):**

```typescript
import fs from "fs";

const imagePart = {
  inlineData: {
    data: fs.readFileSync("image.jpg").toString("base64"),
    mimeType: "image/jpeg",
  },
};

const result = await model.generateContent([
  "What's in this image?",
  imagePart,
]);

console.log(result.response.text());
```

### **Documentation Resources**

| Resource | URL | Description |
|---|---|---|
| **Official Docs** | https://ai.google.dev | Complete API reference |
| **AI Studio** | https://aistudio.google.com | Prompt engineering |
| **Vertex AI Docs** | https://cloud.google.com/vertex-ai | Enterprise features |
| **Cookbook** | https://github.com/google/generative-ai-docs | Code examples |

### **Key Repositories**

```
google/
├── generative-ai-js           # Official JavaScript SDK
├── generative-ai-python       # Official Python SDK
├── generative-ai-docs         # Documentation & examples
└── mediapipe                  # On-device ML
```

---

## **GitHub Copilot Ecosystem**

### **Core Products**

| Product | Interface | Use Case | Access |
|---|---|---|---|
| **Copilot Individual** | IDE | Code completion | $10/mo |
| **Copilot Business** | IDE | Team coding | $19/user/mo |
| **Copilot Enterprise** | IDE + Chat | Enterprise AI | $39/user/mo |
| **Copilot Chat** | IDE/Web | Conversational AI | Copilot subscription |

### **Configuration Files**

#### **1. Copilot Instructions**

**File:** `.github/copilot-instructions.md`

**Purpose:** Project-specific instructions for Copilot

```markdown
# GitHub Copilot Instructions

## Project Context
This is a full-stack TypeScript project using:
- Next.js 15 (App Router)
- tRPC for APIs
- Prisma for database
- Supabase for auth
- Vercel for hosting

## Code Standards

### TypeScript
- Always use strict mode
- Never use `any` type (use `unknown` instead)
- Use Zod for runtime validation
- Add JSDoc comments for exported functions

### Security
- Always enforce Row-Level Security (RLS)
- Validate all user inputs with Zod
- Never store secrets in code
- Use parameterized queries only

### Error Handling
- Always use Cause → Fix → Retry pattern
- Log errors to Sentry
- Return user-friendly error messages

### Testing
- Write tests for all business logic
- Use Vitest for unit tests
- Use Playwright for E2E tests
- Aim for 80%+ code coverage

## Common Patterns

### tRPC Route
```typescript
export const myRouter = router({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // RLS enforcement
      return ctx.db.item.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),
});
```

### React Component
```typescript
'use client';

export function MyComponent() {
  const { data, isLoading } = api.myRouter.list.useQuery();
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div>
      {data?.items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

## Avoid These Patterns
- ❌ Using Next.js API routes (use tRPC instead)
- ❌ String concatenation for SQL (use Prisma)
- ❌ Client-side authentication (use server components)
- ❌ Unvalidated user input
- ❌ Missing error handling
```

#### **2. Workspace Configuration**

**File:** `.github/copilot-workspace.json`

**Purpose:** Configure Copilot for specific workspace

```json
{
  "version": "1.0",
  "context": {
    "include": [
      "src/**/*.ts",
      "src/**/*.tsx",
      "prisma/schema.prisma",
      "docs/**/*.md"
    ],
    "exclude": [
      "node_modules/**",
      "dist/**",
      ".next/**",
      "*.test.ts"
    ]
  },
  "patterns": [
    {
      "name": "tRPC Protected Route",
      "filePattern": "src/server/routers/*.ts",
      "template": "templates/trpc-route.ts"
    },
    {
      "name": "React Server Component",
      "filePattern": "src/app/**/page.tsx",
      "template": "templates/server-component.tsx"
    }
  ],
  "preferences": {
    "codeStyle": "typescript-strict",
    "testFramework": "vitest",
    "formatter": "prettier"
  }
}
```

#### **3. Custom Agent Configuration**

**File:** `.github/copilot/agents.yaml`

**Purpose:** Define custom Copilot agents

```yaml
agents:
  - name: security-auditor
    description: "Audit code for security vulnerabilities"
    model: gpt-4
    systemPrompt: |
      You are an AppSec expert. When reviewing code:
      1. Check for SQL injection vulnerabilities
      2. Look for XSS risks
      3. Verify authentication and authorization
      4. Check for hardcoded secrets
      5. Validate input handling
      
      Output findings with:
      - Severity (Critical/High/Medium/Low)
      - Location (file:line)
      - Description
      - Fix recommendation
    
    triggers:
      - "audit security"
      - "find vulnerabilities"
      - "/security"
  
  - name: test-generator
    description: "Generate comprehensive unit tests"
    model: gpt-4
    systemPrompt: |
      Generate unit tests using Vitest. Include:
      - Happy path tests
      - Edge cases
      - Error handling
      - Mock external dependencies
      
      Follow testing conventions in tests/README.md
    
    triggers:
      - "generate tests"
      - "write tests"
      - "/test"
  
  - name: code-explainer
    description: "Explain complex code"
    model: gpt-4-turbo
    systemPrompt: |
      Explain code clearly and concisely:
      1. High-level overview
      2. Step-by-step breakdown
      3. Key concepts
      4. Potential improvements
    
    triggers:
      - "explain this code"
      - "how does this work"
      - "/explain"
```

### **Extension Ecosystem**

#### **VS Code Extensions**

**Core Extensions:**

| Extension | Publisher | Description |
|---|---|---|
| **GitHub Copilot** | GitHub | AI code completion |
| **GitHub Copilot Chat** | GitHub | Conversational AI |
| **GitHub Copilot Labs** | GitHub | Experimental features |

**Complementary Extensions:**

| Extension | Publisher | Description |
|---|---|---|
| **Copilot Voice** | GitHub | Voice-to-code |
| **Tabnine** | Tabnine | Alternative AI completion |
| **Codeium** | Codeium | Free AI completion |

#### **JetBrains IDEs**

**Installation:**
- IntelliJ IDEA
- PyCharm
- WebStorm
- Rider

**Configuration:** Same as VS Code (`.github/copilot-instructions.md`)

### **SDK & API**

**Note:** GitHub Copilot doesn't have a public API. Integration is through IDE extensions only.

**Workaround for Programmatic Access:**

```typescript
// Use OpenAI API with Codex model (powers Copilot)
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: "gpt-4-turbo-2024-04-09", // or "code-davinci-002" for older Codex
  messages: [
    {
      role: "system",
      content: "You are GitHub Copilot, an AI coding assistant.",
    },
    {
      role: "user",
      content: "Generate a TypeScript function to validate email addresses",
    },
  ],
  temperature: 0.2,
  max_tokens: 1000,
});

console.log(completion.choices[0].message.content);
```

### **Documentation Resources**

| Resource | URL | Description |
|---|---|---|
| **Official Docs** | https://docs.github.com/copilot | Complete guide |
| **Getting Started** | https://github.com/features/copilot | Product overview |
| **Best Practices** | https://github.blog/tag/github-copilot | Tips & tricks |

### **Key Repositories**

```
github/
├── copilot-docs               # Documentation
├── copilot-examples           # Code examples
└── copilot-discussions        # Community forum
```

---

## **Cross-Platform Comparison**

### **Feature Matrix**

| Feature | Claude | ChatGPT | Gemini | Copilot |
|---|---|---|---|---|
| **Custom Agents** | Skills | GPTs | Gems | Extensions |
| **Tool Integration** | MCP Servers | Actions | Extensions | N/A |
| **Code Execution** | ✅ Native | ✅ Code Interpreter | ✅ Native | ✅ Native |
| **Web Search** | ✅ Native | ✅ Plugins | ✅ Native | ❌ No |
| **File Upload** | ✅ PDF, Images, Docs | ✅ Any file | ✅ Any file | ❌ No |
| **Vision** | ✅ Native | ✅ GPT-4V | ✅ Native | ⚠️ Limited |
| **Voice** | ❌ No | ✅ Native | ✅ Native | ⚠️ Extension |
| **Marketplace** | ✅ Skill Library | ✅ GPT Store | ✅ Gem Gallery | ✅ Extensions |
| **API Access** | ✅ Full API | ✅ Full API | ✅ Full API | ❌ IDE only |
| **Open Source Tools** | ✅ MCP SDK | ✅ Function SDK | ✅ Gemini SDK | ❌ Proprietary |

### **Pricing Comparison**

| Tier | Claude | ChatGPT | Gemini | Copilot |
|---|---|---|---|---|
| **Free** | Limited | Limited | Free | ❌ None |
| **Plus/Pro** | $20/mo | $20/mo | $20/mo | $10/mo |
| **Team** | N/A | $25/user/mo | N/A | $19/user/mo |
| **Enterprise** | Custom | $60/user/mo | Custom | $39/user/mo |
| **API** | Pay-per-token | Pay-per-token | Pay-per-token | N/A |

### **Model Comparison**

| Platform | Latest Model | Context Window | Strengths |
|---|---|---|---|
| **Claude** | Sonnet 4.5 | 200K tokens | Reasoning, code, safety |
| **ChatGPT** | GPT-4 Turbo | 128K tokens | General purpose, plugins |
| **Gemini** | 1.5 Pro | 2M tokens | Multimodal, context |
| **Copilot** | GPT-4 | 128K tokens | Code completion |

### **Use Case Recommendations**

| Use Case | Best Choice | Reason |
|---|---|---|
| **Code Security** | Claude | Security-first design, detailed reasoning |
| **Web Research** | ChatGPT/Gemini | Better plugin ecosystem, web grounding |
| **Code Completion** | Copilot | Purpose-built for IDE integration |
| **Long Documents** | Gemini | 2M token context window |
| **Multimodal** | Gemini | Best vision + audio capabilities |
| **Enterprise Security** | Claude | SOC 2, HIPAA, strict privacy |
| **Plugin Ecosystem** | ChatGPT | Largest marketplace (GPT Store) |
| **Google Workspace** | Gemini | Native integration with Docs, Gmail, Drive |

---

## **Integration Strategies**

### **Multi-Platform Architecture**

**Scenario:** Use best tool for each job

```typescript
// lib/ai-router.ts
interface AIRequest {
  task: "code" | "research" | "security" | "multimodal";
  input: string;
  files?: File[];
}

export async function routeAIRequest(request: AIRequest) {
  switch (request.task) {
    case "code":
      // Use Claude for code generation (better reasoning)
      return await claudeGenerate(request.input);
    
    case "research":
      // Use ChatGPT with plugins for web research
      return await chatGPTResearch(request.input);
    
    case "security":
      // Use Claude for security audits (safety-focused)
      return await claudeSecurityAudit(request.input);
    
    case "multimodal":
      // Use Gemini for image/video analysis
      return await geminiAnalyze(request.input, request.files);
    
    default:
      throw new Error("Unknown task type");
  }
}

// Usage
const result = await routeAIRequest({
  task: "security",
  input: "Audit this code for vulnerabilities",
});
```

### **Fallback Strategy**

**Scenario:** Primary model down, fallback to backup

```typescript
// lib/ai-fallback.ts
export async function generateWithFallback(prompt: string) {
  // Try Claude first (primary)
  try {
    return await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250514",
      messages: [{ role: "user", content: prompt }],
    });
  } catch (error) {
    logger.warn("Claude failed, falling back to ChatGPT", { error });
    
    // Fallback to ChatGPT
    try {
      return await openai.chat.completions.create({
        model: "gpt-4-turbo-2024-04-09",
        messages: [{ role: "user", content: prompt }],
      });
    } catch (error2) {
      logger.warn("ChatGPT failed, falling back to Gemini", { error: error2 });
      
      // Last resort: Gemini
      return await genAI
        .getGenerativeModel({ model: "gemini-1.5-pro" })
        .generateContent(prompt);
    }
  }
}
```

### **Cost Optimization**

**Scenario:** Use cheaper models when possible

```typescript
// lib/ai-cost-optimizer.ts
interface Task {
  complexity: "simple" | "medium" | "complex";
  prompt: string;
}

export async function costOptimizedGenerate(task: Task) {
  switch (task.complexity) {
    case "simple":
      // Use Gemini Flash (cheapest, fastest)
      return await genAI
        .getGenerativeModel({ model: "gemini-1.5-flash" })
        .generateContent(task.prompt);
    
    case "medium":
      // Use Claude Haiku (good balance)
      return await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        messages: [{ role: "user", content: task.prompt }],
      });
    
    case "complex":
      // Use Claude Sonnet (best quality)
      return await anthropic.messages.create({
        model: "claude-sonnet-4-5-20250514",
        messages: [{ role: "user", content: task.prompt }],
      });
  }
}

// Auto-detect complexity
function detectComplexity(prompt: string): "simple" | "medium" | "complex" {
  const length = prompt.length;
  const hasCodeBlock = prompt.includes("```");
  const hasMultipleSteps = prompt.split("\n").length > 10;
  
  if (length < 500 && !hasCodeBlock) return "simple";
  if (length < 2000 && !hasMultipleSteps) return "medium";
  return "complex";
}
```

### **Unified Interface**

**Scenario:** Single interface for all models

```typescript
// lib/ai-unified.ts
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface UnifiedAIRequest {
  provider: "claude" | "chatgpt" | "gemini";
  model?: string;
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  tools?: any[];
}

export async function unifiedGenerate(request: UnifiedAIRequest) {
  switch (request.provider) {
    case "claude": {
      const anthropic = new Anthropic();
      
      const response = await anthropic.messages.create({
        model: request.model || "claude-sonnet-4-5-20250514",
        messages: request.messages.map((m) => ({
          role: m.role === "system" ? "user" : m.role,
          content: m.content,
        })),
        tools: request.tools,
      });
      
      return {
        content: response.content[0].text,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        },
        provider: "claude",
      };
    }
    
    case "chatgpt": {
      const openai = new OpenAI();
      
      const response = await openai.chat.completions.create({
        model: request.model || "gpt-4-turbo-2024-04-09",
        messages: request.messages,
        tools: request.tools,
      });
      
      return {
        content: response.choices[0].message.content,
        usage: {
          inputTokens: response.usage?.prompt_tokens || 0,
          outputTokens: response.usage?.completion_tokens || 0,
        },
        provider: "chatgpt",
      };
    }
    
    case "gemini": {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
      const model = genAI.getGenerativeModel({
        model: request.model || "gemini-1.5-pro",
      });
      
      // Gemini uses different message format
      const prompt = request.messages.map((m) => m.content).join("\n\n");
      
      const response = await model.generateContent(prompt);
      
      return {
        content: response.response.text(),
        usage: {
          inputTokens: response.response.usageMetadata?.promptTokenCount || 0,
          outputTokens: response.response.usageMetadata?.candidatesTokenCount || 0,
        },
        provider: "gemini",
      };
    }
  }
}

// Usage
const result = await unifiedGenerate({
  provider: "claude",
  messages: [
    { role: "user", content: "Explain quantum computing" },
  ],
});

console.log(result.content);
console.log(`Cost: ${calculateCost(result.usage, result.provider)}`);
```

---

## **Multi-Platform Architecture**

### **Hybrid AI System**

**Architecture:**

```
┌─────────────────────────────────────────────────┐
│           User Request (via tRPC)               │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │   AI Router    │
         │  (Task-based)  │
         └────────┬───────┘
                  │
        ┌─────────┼──────────┬────────────┐
        │         │          │            │
        ▼         ▼          ▼            ▼
    ┌───────┐ ┌────────┐ ┌────────┐ ┌──────────┐
    │Claude │ │ChatGPT │ │Gemini  │ │ Copilot  │
    │       │ │        │ │        │ │ (IDE)    │
    └───┬───┘ └───┬────┘ └───┬────┘ └──────────┘
        │         │          │
        │    ┌────┴────┬─────┘
        │    │         │
        ▼    ▼         ▼
    ┌──────────────────────┐
    │  Response Aggregator │
    └──────────────────────┘
                │
                ▼
         ┌─────────────┐
         │  Cache Layer│
         │  (Redis)    │
         └─────────────┘
                │
                ▼
         ┌─────────────┐
         │   Response  │
         └─────────────┘
```

### **Implementation**

```typescript
// src/server/routers/ai.ts
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { routeAIRequest } from "../../lib/ai-router";
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export const aiRouter = router({
  generate: protectedProcedure
    .input(
      z.object({
        task: z.enum(["code", "research", "security", "multimodal"]),
        prompt: z.string(),
        files: z.array(z.string()).optional(),
        provider: z.enum(["auto", "claude", "chatgpt", "gemini"]).default("auto"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check cache
      const cacheKey = `ai:${input.task}:${hashPrompt(input.prompt)}`;
      const cached = await redis.get(cacheKey);
      
      if (cached) {
        return {
          ...JSON.parse(cached),
          cached: true,
        };
      }
      
      // Route to appropriate AI
      const result = await routeAIRequest({
        task: input.task,
        input: input.prompt,
        provider: input.provider === "auto" ? undefined : input.provider,
      });
      
      // Cache result (24 hours)
      await redis.setex(cacheKey, 86400, JSON.stringify(result));
      
      // Track usage
      await ctx.db.aiUsage.create({
        data: {
          userId: ctx.session.user.id,
          provider: result.provider,
          task: input.task,
          tokensUsed: result.usage.inputTokens + result.usage.outputTokens,
          costUsd: calculateCost(result.usage, result.provider),
        },
      });
      
      return {
        ...result,
        cached: false,
      };
    }),
  
  compareModels: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        providers: z.array(z.enum(["claude", "chatgpt", "gemini"])),
      })
    )
    .mutation(async ({ input }) => {
      // Run same prompt on multiple models
      const results = await Promise.all(
        input.providers.map((provider) =>
          unifiedGenerate({
            provider,
            messages: [{ role: "user", content: input.prompt }],
          })
        )
      );
      
      return results.map((result, i) => ({
        provider: input.providers[i],
        content: result.content,
        usage: result.usage,
        cost: calculateCost(result.usage, result.provider),
      }));
    }),
});
```

### **Usage in Frontend**

```typescript
// src/components/AIChat.tsx
'use client';

import { api } from "~/trpc/react";
import { useState } from "react";

export function AIChat() {
  const [prompt, setPrompt] = useState("");
  const [task, setTask] = useState<"code" | "research" | "security">("code");
  
  const generate = api.ai.generate.useMutation();
  
  async function handleSubmit() {
    const result = await generate.mutateAsync({
      task,
      prompt,
    });
    
    console.log("Result:", result.content);
    console.log("Provider:", result.provider);
    console.log("Cost:", result.cost);
    console.log("Cached:", result.cached);
  }
  
  return (
    <div>
      <select value={task} onChange={(e) => setTask(e.target.value as any)}>
        <option value="code">Code Generation</option>
        <option value="research">Research</option>
        <option value="security">Security Audit</option>
      </select>
      
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
      />
      
      <button onClick={handleSubmit} disabled={generate.isLoading}>
        {generate.isLoading ? "Generating..." : "Generate"}
      </button>
      
      {generate.data && (
        <div>
          <pre>{generate.data.content}</pre>
          <div>
            Provider: {generate.data.provider} | Cost: ${generate.data.cost.toFixed(4)} | Cached: {generate.data.cached ? "Yes" : "No"}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## **Best Practices**

### **1. Configuration Management**

**Centralized Config:**

```typescript
// config/ai.ts
export const AI_CONFIG = {
  claude: {
    models: {
      fast: "claude-haiku-4-5-20251001",
      balanced: "claude-sonnet-4-5-20250514",
      powerful: "claude-opus-4-1-20250514",
    },
    pricing: {
      "claude-haiku-4-5-20251001": { input: 0.00025, output: 0.00125 },
      "claude-sonnet-4-5-20250514": { input: 0.003, output: 0.015 },
      "claude-opus-4-1-20250514": { input: 0.015, output: 0.075 },
    },
  },
  chatgpt: {
    models: {
      fast: "gpt-3.5-turbo",
      balanced: "gpt-4-turbo-2024-04-09",
      powerful: "gpt-4-turbo-2024-04-09",
    },
    pricing: {
      "gpt-3.5-turbo": { input: 0.0005, output: 0.0015 },
      "gpt-4-turbo-2024-04-09": { input: 0.01, output: 0.03 },
    },
  },
  gemini: {
    models: {
      fast: "gemini-1.5-flash",
      balanced: "gemini-1.5-pro",
      powerful: "gemini-1.5-pro",
    },
    pricing: {
      "gemini-1.5-flash": { input: 0.000075, output: 0.0003 },
      "gemini-1.5-pro": { input: 0.00125, output: 0.005 },
    },
  },
} as const;
```

### **2. Monitoring & Observability**

**Track AI Usage:**

```typescript
// lib/ai-monitoring.ts
import { PostHog } from "posthog-node";
import * as Sentry from "@sentry/node";

const posthog = new PostHog(process.env.POSTHOG_API_KEY!);

export function trackAIRequest(params: {
  userId: string;
  provider: "claude" | "chatgpt" | "gemini";
  task: string;
  tokensUsed: number;
  costUsd: number;
  latencyMs: number;
  success: boolean;
  error?: string;
}) {
  // Track in PostHog
  posthog.capture({
    distinctId: params.userId,
    event: "ai_request",
    properties: params,
  });
  
  // Log to Sentry if error
  if (!params.success && params.error) {
    Sentry.captureMessage(`AI request failed: ${params.error}`, {
      level: "error",
      extra: params,
    });
  }
  
  // Alert if high cost
  if (params.costUsd > 1.0) {
    Sentry.captureMessage(`High cost AI request: $${params.costUsd}`, {
      level: "warning",
      extra: params,
    });
  }
}
```

### **3. Cost Control**

**Daily Quota Enforcement:**

```typescript
// lib/ai-quota.ts
export async function checkQuota(userId: string): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0];
  const key = `ai:quota:${userId}:${today}`;
  
  const used = await redis.get(key);
  const usedCost = parseFloat(used || "0");
  
  const DAILY_LIMIT = 10.0; // $10 per day
  
  if (usedCost >= DAILY_LIMIT) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Daily AI quota exceeded ($${DAILY_LIMIT}). Resets at midnight UTC.`,
    });
  }
  
  return true;
}

export async function incrementQuota(userId: string, costUsd: number) {
  const today = new Date().toISOString().split("T")[0];
  const key = `ai:quota:${userId}:${today}`;
  
  await redis.incrbyfloat(key, costUsd);
  await redis.expire(key, 86400); // 24 hour TTL
}
```

### **4. Error Handling**

**Graceful Degradation:**

```typescript
// lib/ai-error-handler.ts
export async function robustGenerate(prompt: string) {
  const providers = ["claude", "chatgpt", "gemini"] as const;
  
  let lastError: Error | null = null;
  
  for (const provider of providers) {
    try {
      return await unifiedGenerate({
        provider,
        messages: [{ role: "user", content: prompt }],
      });
    } catch (error) {
      logger.warn(`${provider} failed, trying next provider`, { error });
      lastError = error as Error;
      
      // Wait before retrying (backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  
  // All providers failed
  throw new Error(`All AI providers failed. Last error: ${lastError?.message}`);
}
```

### **5. Security & Privacy**

**PII Scrubbing:**

```typescript
// lib/ai-security.ts
export function scrubPII(text: string): string {
  return text
    // Remove email addresses
    .replace(/[\w\.-]+@[\w\.-]+\.\w+/g, "[EMAIL]")
    // Remove phone numbers
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, "[PHONE]")
    // Remove SSN
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN]")
    // Remove credit card numbers
    .replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, "[CC]");
}

// Use before sending to AI
const scrubbedPrompt = scrubPII(userPrompt);
const result = await unifiedGenerate({
  provider: "claude",
  messages: [{ role: "user", content: scrubbedPrompt }],
});
```

---

## **Conclusion**

This guide covers the complete AI ecosystem for all four major platforms:

**Claude:**
- ✅ Best for: Security-first applications, detailed reasoning
- ✅ Strengths: MCP support, Skills, safety
- ⚠️ Limitations: No public plugin marketplace yet

**ChatGPT:**
- ✅ Best for: General-purpose AI, plugin integrations
- ✅ Strengths: GPT Store (largest marketplace), Assistants API
- ⚠️ Limitations: MCP support requires workarounds

**Gemini:**
- ✅ Best for: Multimodal tasks, long documents, Google Workspace
- ✅ Strengths: 2M token context, native Workspace integration
- ⚠️ Limitations: Smaller plugin ecosystem

**Copilot:**
- ✅ Best for: IDE-based code generation
- ✅ Strengths: Best code completion, GitHub integration
- ⚠️ Limitations: No API access, IDE-only

**Multi-Platform Strategy:**
Use the right tool for each job:
- Code security audits → Claude
- Web research → ChatGPT or Gemini
- Code completion → Copilot
- Long document analysis → Gemini
- Production deployments → Unified interface with fallbacks

**Next Steps:**
1. Implement unified interface (Day 1)
2. Add caching layer (Day 2)
3. Set up monitoring (Day 3)
4. Configure quota limits (Day 4)
5. Test fallback strategies (Day 5)
