# Model Context Protocol (MCP) - Complete Guide

**Last Updated:** January 2025  
**Scope:** MCP protocol, 1,200+ servers, integration guide

---

## TL;DR

**MCP (Model Context Protocol)** is Anthropic's open standard for connecting Claude to external tools and data sources. Over 1,200 servers available covering filesystems, databases, APIs, cloud services, and more. Works with Claude Desktop and Claude Code CLI. Think of it as "plugins for Claude" but with a universal, standardized protocol.

---

## What Is MCP?

**Model Context Protocol (MCP)** = Universal API for AI-tool integrations

**Analogy:** Just like HTTP standardized web communication, MCP standardizes how AI models connect to tools.

**Key Concepts:**
- **MCP Server:** Program that exposes tools, resources, and prompts
- **MCP Client:** Claude Desktop or Claude Code that connects to servers
- **Tools:** Functions Claude can call (e.g., "create_file", "search_github")
- **Resources:** Data sources Claude can read (e.g., files, databases, APIs)
- **Prompts:** Pre-configured prompt templates

---

## Why MCP?

### Before MCP (The Problem)
- Every AI tool needed custom integration
- 100 AI assistants × 100 tools = 10,000 integrations
- No standardization
- Fragmented ecosystem

### With MCP (The Solution)
- One standard protocol
- Any MCP client works with any MCP server
- 1,200+ servers work across all MCP clients
- Open source, community-driven

---

## How MCP Works

### Architecture

```
┌─────────────────┐
│  Claude Desktop │
│   (MCP Client)  │
└────────┬────────┘
         │
         │ MCP Protocol
         │
    ┌────┴─────────────────────────────────┐
    │                                       │
┌───▼───────┐  ┌──────────┐  ┌──────────┐
│ Filesystem│  │  GitHub  │  │  Notion  │
│   Server  │  │  Server  │  │  Server  │
└───────────┘  └──────────┘  └──────────┘
```

**Flow:**
1. User asks Claude: "Search my GitHub repos for auth code"
2. Claude Desktop sends MCP request to GitHub server
3. GitHub server executes search → returns results
4. Claude receives data → formulates response
5. User sees answer with context from GitHub

---

## Setting Up MCP

### Prerequisites

**Claude Desktop:**
- Download from [claude.ai/download](https://claude.ai/download)
- macOS 11+ or Windows 10+

**Node.js (for most servers):**
```bash
# Install Node.js 18+
brew install node  # macOS
# or download from nodejs.org
```

### Configuration

**Config File Location:**
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

**Basic Configuration:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/username/Documents"]
    }
  }
}
```

**Multiple Servers:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/username/Documents"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
    }
  }
}
```

**Restart Required:**  
After editing config, restart Claude Desktop to load servers.

---

## Official MCP Servers (by Anthropic)

### Filesystem
**Package:** `@modelcontextprotocol/server-filesystem`  
**Capabilities:** Read/write local files and directories  
**Use Cases:** Document editing, code generation, data analysis

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/username/workspace"]
  }
}
```

**Tools:**
- `read_file`: Read file contents
- `read_multiple_files`: Read multiple files at once
- `write_file`: Create or overwrite file
- `create_directory`: Create new directory
- `list_directory`: List directory contents
- `move_file`: Move or rename file
- `search_files`: Search for files by name
- `get_file_info`: Get file metadata

---

### GitHub
**Package:** `@modelcontextprotocol/server-github`  
**Capabilities:** Repository management, issues, PRs, code search  
**Use Cases:** Code review, issue tracking, PR creation

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
    }
  }
}
```

**Tools:**
- `create_repository`: Create new repo
- `create_issue`: Create issue
- `create_pull_request`: Create PR
- `push_files`: Push files to repo
- `search_repositories`: Search repos
- `search_code`: Search code across repos
- `get_file_contents`: Read file from repo
- `list_commits`: List commit history

**Getting Token:**  
GitHub → Settings → Developer settings → Personal access tokens → Generate new token

---

### Google Drive
**Package:** `@modelcontextprotocol/server-gdrive`  
**Capabilities:** File search, document access, upload  
**Use Cases:** Document management, research, data retrieval

```json
{
  "gdrive": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-gdrive"],
    "env": {
      "GDRIVE_CLIENT_ID": "your_client_id",
      "GDRIVE_CLIENT_SECRET": "your_client_secret"
    }
  }
}
```

---

### PostgreSQL
**Package:** `@modelcontextprotocol/server-postgres`  
**Capabilities:** SQL queries, schema inspection  
**Use Cases:** Database analysis, data extraction, reporting

```json
{
  "postgres": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:pass@localhost/dbname"]
  }
}
```

---

### Slack
**Package:** `@modelcontextprotocol/server-slack`  
**Capabilities:** Message search, channel access, posting  
**Use Cases:** Team communication, information retrieval

```json
{
  "slack": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-slack"],
    "env": {
      "SLACK_BOT_TOKEN": "xoxb-xxxxxxxxxxxx"
    }
  }
}
```

---

### Memory
**Package:** `@modelcontextprotocol/server-memory`  
**Capabilities:** Persistent key-value storage across sessions  
**Use Cases:** User preferences, context retention, state management

```json
{
  "memory": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-memory"]
  }
}
```

---

## Community MCP Servers (Top 50)

### Development & Coding

**1. Linear** - Project management, issues, workflows  
**2. Jira** - Issue tracking, project management  
**3. GitLab** - Repository management, CI/CD  
**4. Bitbucket** - Git repository hosting  
**5. Docker** - Container management  
**6. Kubernetes** - Container orchestration  
**7. AWS** - Cloud services (EC2, S3, Lambda)  
**8. Azure** - Microsoft cloud services  
**9. GCP** - Google Cloud Platform  
**10. Vercel** - Deployment, serverless functions

### Productivity

**11. Notion** - Knowledge base, databases  
**12. Confluence** - Team documentation  
**13. Evernote** - Note-taking  
**14. Todoist** - Task management  
**15. Trello** - Kanban boards  
**16. Asana** - Project management  
**17. Monday.com** - Work management  
**18. ClickUp** - All-in-one productivity  
**19. Airtable** - Spreadsheet-database hybrid  
**20. Coda** - Collaborative documents

### Communication

**21. Discord** - Community chat  
**22. Microsoft Teams** - Enterprise chat  
**23. Zoom** - Video conferencing  
**24. Gmail** - Email management  
**25. Outlook** - Email and calendar  
**26. Telegram** - Messaging  
**27. WhatsApp Business** - Messaging API  
**28. Intercom** - Customer messaging  
**29. Zendesk** - Customer support  
**30. Freshdesk** - Help desk

### Data & Analytics

**31. MySQL** - Relational database  
**32. MongoDB** - NoSQL database  
**33. Redis** - In-memory database  
**34. Snowflake** - Data warehouse  
**35. BigQuery** - Data analytics  
**36. Tableau** - Data visualization  
**37. Looker** - Business intelligence  
**38. Elasticsearch** - Search engine  
**39. Supabase** - Backend-as-a-service  
**40. Firebase** - App development platform

### Marketing & Sales

**41. Salesforce** - CRM  
**42. HubSpot** - Marketing automation  
**43. Mailchimp** - Email marketing  
**44. Shopify** - E-commerce  
**45. Stripe** - Payment processing  
**46. Google Analytics** - Web analytics  
**47. Mixpanel** - Product analytics  
**48. Segment** - Customer data platform  
**49. Twilio** - Communications API  
**50. SendGrid** - Email delivery

**Full catalog:** [mcp.run](https://mcp.run) or [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)

---

## Building Custom MCP Servers

### Quick Start (Python)

```python
from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
import mcp.server.stdio
import mcp.types as types

# Create server instance
server = Server("my-custom-server")

# Define a tool
@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="get_weather",
            description="Get current weather for a location",
            inputSchema={
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            }
        )
    ]

# Implement tool
@server.call_tool()
async def handle_call_tool(
    name: str, arguments: dict | None
) -> list[types.TextContent]:
    if name == "get_weather":
        location = arguments.get("location")
        # Fetch weather data
        weather_data = f"Sunny, 72°F in {location}"
        return [types.TextContent(type="text", text=weather_data)]
    raise ValueError(f"Unknown tool: {name}")

# Run server
async def main():
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="my-custom-server",
                server_version="1.0.0",
                capabilities=server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={},
                )
            )
        )

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

### Quick Start (TypeScript)

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Create server
const server = new Server(
  {
    name: "my-custom-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_weather",
        description: "Get current weather for a location",
        inputSchema: {
          type: "object",
          properties: {
            location: { type: "string" },
          },
          required: ["location"],
        },
      },
    ],
  };
});

// Call tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_weather") {
    const location = request.params.arguments?.location;
    return {
      content: [
        {
          type: "text",
          text: `Sunny, 72°F in ${location}`,
        },
      ],
    };
  }
  throw new Error(`Unknown tool: ${request.params.name}`);
});

// Run server
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Publishing MCP Server

**1. Package:**
```json
{
  "name": "@yourname/mcp-server-weather",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "mcp-server-weather": "./dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0"
  }
}
```

**2. Publish:**
```bash
npm publish --access public
```

**3. Use:**
```json
{
  "weather": {
    "command": "npx",
    "args": ["-y", "@yourname/mcp-server-weather"]
  }
}
```

---

## Best Practices

### Security

**1. Least Privilege:**
- Only grant necessary permissions
- Restrict filesystem access to specific directories
- Use read-only tokens when possible

**2. Secrets Management:**
- Store tokens in environment variables
- Never commit credentials to config
- Rotate tokens regularly

**3. Validation:**
- Validate all inputs in tool implementations
- Sanitize file paths
- Check authentication before operations

### Performance

**1. Caching:**
- Cache frequently accessed data
- Use MCP's built-in caching mechanisms
- Implement TTL for stale data

**2. Rate Limiting:**
- Respect API rate limits
- Implement backoff strategies
- Queue requests if needed

**3. Lazy Loading:**
- Load resources on-demand
- Don't fetch all data upfront
- Use pagination for large datasets

### Error Handling

**1. Graceful Failures:**
- Return meaningful error messages
- Include troubleshooting hints
- Log errors for debugging

**2. Retries:**
- Implement exponential backoff
- Detect transient vs permanent failures
- Set max retry limits

---

## Troubleshooting

### MCP Server Not Appearing

**Check:**
1. Config file syntax (valid JSON)
2. Server package installed (`npx` will auto-install)
3. Claude Desktop restarted after config change
4. Server command executable (check PATH)

**Debug:**
```bash
# Test server manually
npx -y @modelcontextprotocol/server-filesystem /path

# Check Claude Desktop logs
# macOS: ~/Library/Logs/Claude/
# Windows: %APPDATA%\Claude\Logs\
```

### Authentication Errors

**Common Issues:**
- Expired tokens → Regenerate
- Invalid scopes → Check required permissions
- Wrong environment variable names → Match server docs

### Tool Calls Failing

**Check:**
1. Tool input schema matches arguments
2. Network connectivity for API calls
3. Permissions (filesystem, database, API)
4. Error logs in Claude Desktop

---

## MCP vs Other Integration Methods

| Feature | MCP | Custom API | Plugins |
|---------|-----|------------|---------|
| **Standardization** | ✅ Universal | ❌ Custom per tool | ❌ Platform-specific |
| **Setup Complexity** | Low | High | Medium |
| **Reusability** | ✅ Any MCP client | ❌ One-off | ❌ Platform-locked |
| **Community Support** | ✅ 1,200+ servers | ❌ DIY | ✅ Varies |
| **Security** | ✅ Controlled | ❌ Varies | ✅ Sandboxed |
| **Performance** | Fast (local) | Depends | Fast |

---

## Future of MCP

**Roadmap (2025):**
- More official servers (Microsoft 365, Zoom, Figma)
- Enhanced security (OAuth, SSO)
- GUI for MCP configuration (no JSON editing)
- MCP marketplace (discover, install, rate servers)
- Multi-modal support (image/audio tools)
- Server-to-server communication

**Community Growth:**
- 1,200+ servers (January 2025)
- Growing ecosystem of tools
- Enterprise adoption increasing
- Open-source contributions welcome

---

## Resources

**Official:**
- MCP Spec: [spec.modelcontextprotocol.io](https://spec.modelcontextprotocol.io)
- SDK Docs: [github.com/modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk)
- Server Catalog: [mcp.run](https://mcp.run)

**Community:**
- Discord: [discord.gg/anthropic](https://discord.gg/anthropic)
- GitHub: [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)
- Reddit: [r/ClaudeAI](https://reddit.com/r/ClaudeAI)

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIM:** Over 1,200 MCP servers available  
**SOURCE:** [mcp.run](https://mcp.run)  
**STATUS:** Verified January 2025

**CLAIM:** MCP is an open protocol by Anthropic  
**SOURCE:** [anthropic.com/news/model-context-protocol](https://anthropic.com/news/model-context-protocol)  
**STATUS:** Verified November 2024

**CLAIM:** MCP works with Claude Desktop and Claude Code  
**SOURCE:** [docs.anthropic.com/mcp](https://docs.anthropic.com/mcp)  
**STATUS:** Verified January 2025

**COUNTEREXAMPLE:** MCP does NOT work with Claude mobile apps - Desktop and CLI only

**CONTRADICTION:** Server count may vary - check [mcp.run](https://mcp.run) for current number
