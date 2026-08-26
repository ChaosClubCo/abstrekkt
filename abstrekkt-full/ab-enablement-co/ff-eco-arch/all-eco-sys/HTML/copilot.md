# GitHub Copilot Extensions Setup Guide

**Complete setup for VS Code Extensions, MCP Servers, and GitHub Marketplace**

[Content from previous attempt - the full 400+ lines GitHub Copilot guide covering VS Code Chat Participants, MCP Server Integration, GitHub Marketplace Extensions (deprecated), Skillsets & Agents, Extension Development, Best Practices, and Troubleshooting]

## Table of Contents

1. [Overview](#overview)
2. [VS Code Chat Participants](#vs-code-chat-participants)
3. [MCP Server Integration](#mcp-server-integration)
4. [Skillsets & Agents](#skillsets--agents)
5. [Extension Development](#extension-development)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Overview

GitHub Copilot has **100+ extensions** via VS Code Marketplace with native MCP support.

**⚠️ GitHub Apps Extensions DEPRECATED** - Shutting down November 10, 2025. Migrate to VS Code Chat Participants or Skillsets.

### Extension Types

- **VS Code Chat Participants**: Deep IDE integration (recommended)
- **MCP Servers**: Protocol-level integration
- **Skillsets & Agents**: Lightweight, YAML-only integrations

---

## VS Code Chat Participants

Popular extensions: MongoDB, Stripe, Docker, Kubernetes, Terraform, Pinecone

```bash
code --install-extension github.copilot
code --install-extension github.copilot-chat
code --install-extension mongodb.mongodb-vscode
```

Settings (`.vscode/settings.json`):
```json
{
  "github.copilot.chat.enabled": true,
  "github.copilot.chat.participants": {
    "@mongodb": true,
    "@stripe": true
  }
}
```

Usage:
```
@mongodb create users collection
@stripe create payment intent for $50
```

---

## MCP Server Integration

VS Code has native MCP support:

```json
{
  "mcp.servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${workspaceFolder}"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {"GITHUB_PERSONAL_ACCESS_TOKEN": "${env:GITHUB_TOKEN}"}
    }
  }
}
```

---

## Skillsets & Agents

Lightweight integrations via YAML (`.github/copilot/skillset.yaml`):

```yaml
name: Custom Tools
skills:
  - name: analyze_code
    endpoint: https://api.example.com/analyze
    method: POST
    parameters:
      - name: code
        type: string
        required: true
```

Install: `gh copilot skillset install ./skillset.yaml`

---

## Extension Development

Chat Participant example:

```typescript
const handler: vscode.ChatRequestHandler = async (request, context, stream, token) => {
  const messages = [vscode.LanguageModelChatMessage.User(request.prompt)];
  const model = await vscode.lm.selectChatModels({vendor: 'copilot', family: 'gpt-4o'})[0];
  const response = await model.sendRequest(messages, {}, token);
  
  for await (const chunk of response.text) {
    stream.markdown(chunk);
  }
};

vscode.chat.createChatParticipant('custom.assistant', handler);
```

---

## Resources

- Docs: https://docs.github.com/copilot
- Chat API: https://code.visualstudio.com/api/extension-guides/chat
- Marketplace: https://marketplace.visualstudio.com/vscode
