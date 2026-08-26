---
title: "PRD: Multi-Provider AI Integration for Claude Checklists Dashboard"
version: 1.0.0
status: draft
created: 2026-03-15
author: Kyle + Claude
---

# PRD: Multi-Provider AI Integration

## Overview
Extend the Claude Checklists dashboard to support live API chat with Gemini, Codex (OpenAI), and GitHub Copilot alongside the existing Claude integration. Include a local proxy server option for secure key management.

---

## Current State (v1.0)

| Provider | Status | Auth | Interaction |
|----------|--------|------|-------------|
| Claude (Anthropic) | **Live** | sessionStorage paste | Full chat, tool use, model auto-select, loading status bar |
| Gemini (Google) | Placeholder | — | Compose + copy to clipboard |
| Codex (OpenAI) | Placeholder | — | Compose + copy to clipboard |
| Copilot (GitHub) | Placeholder | — | Compose + copy to clipboard |

### Claude Models (current as of 2026-03-16)
| Label | Model ID | Auto-select trigger |
|-------|----------|-------------------|
| Haiku 4.5 | `claude-haiku-4-5-20251001` | Short prompts, status checks |
| Sonnet 4.6 | `claude-sonnet-4-6-20250514` | Default balanced |
| Opus 4.6 | `claude-opus-4-6-20250514` | Audit, architecture, complex reasoning |

---

## Target State (v2.0)

### P0: Gemini Integration

**API**: Google AI Studio / Vertex AI
**Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
**Auth**: API key (same sessionStorage pattern as Claude)
**Models**:
- `gemini-2.0-flash` — fast, default for simple tasks
- `gemini-2.0-pro` — complex reasoning
- Auto-select logic mirrors Claude (length + keyword heuristics)

**Implementation**:
```javascript
async function callGemini(userMsg) {
  const key = sessionStorage.getItem('gemini_key');
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: messages
      })
    }
  );
  // Parse: data.candidates[0].content.parts[0].text
}
```

**Key bar**: Same pattern — paste per session, `gemini_key` in sessionStorage.

---

### P1: OpenAI / Codex Integration

**API**: OpenAI Chat Completions
**Endpoint**: `https://api.openai.com/v1/chat/completions`
**Auth**: API key in sessionStorage (`openai_key`)
**Models**:
- `gpt-4o` — default balanced
- `gpt-4o-mini` — fast/cheap
- `o3` — complex reasoning
- Auto-select: simple → mini, balanced → 4o, complex → o3

**Implementation**:
```javascript
async function callOpenAI(userMsg) {
  const key = sessionStorage.getItem('openai_key');
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: systemPrompt }, ...messages]
    })
  });
  // Parse: data.choices[0].message.content
}
```

---

### P1: GitHub Copilot Integration

**Challenge**: Copilot doesn't have a direct public REST API for chat. Options:

**Option A: Copilot Extensions API** (if available)
- Register as a Copilot Extension
- Requires GitHub App + OAuth flow
- Complex but native

**Option B: GitHub Models API** (recommended)
- Endpoint: `https://models.inference.ai.azure.com/chat/completions`
- Auth: GitHub Personal Access Token (PAT) with `copilot` scope
- Models: `gpt-4o`, `o3-mini`, `claude-sonnet-4-6` (via GitHub Models)
- Same OpenAI-compatible format

**Option C: VS Code Integration**
- Generate a `.vscode/tasks.json` that pipes context to Copilot Chat
- Not inline, but leverages existing Copilot subscription
- Lowest effort

**Recommendation**: Start with Option B (GitHub Models API), fall back to Option C for users without API access.

---

## P2: Local Proxy Server

### Why
- Eliminates per-session key pasting
- Keys stored in `.env` on disk, never in browser
- Enables CORS-free API calls
- Single point for rate limiting, cost tracking, logging

### Architecture
```
Browser (dashboard.html)
  ↓ fetch('http://localhost:3141/api/chat')
  ↓ { provider: 'claude', model: 'auto', message: '...', context: '...' }
Local Proxy (Node.js, ~100 lines)
  ↓ reads .env for ANTHROPIC_API_KEY, GEMINI_API_KEY, etc.
  ↓ routes to correct provider API
  ↓ returns streamed response
Browser renders response
```

### Implementation

**Server** (`proxy-server.js`):
```javascript
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
config();

const app = express();
app.use(cors({ origin: 'null' })); // file:// origin
app.use(express.json());

const PROVIDERS = {
  claude: {
    url: 'https://api.anthropic.com/v1/messages',
    key: process.env.ANTHROPIC_API_KEY,
    transform: (body) => ({ /* ... */ })
  },
  gemini: {
    url: 'https://generativelanguage.googleapis.com/v1beta/models/',
    key: process.env.GEMINI_API_KEY,
    transform: (body) => ({ /* ... */ })
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    key: process.env.OPENAI_API_KEY,
    transform: (body) => ({ /* ... */ })
  },
  copilot: {
    url: 'https://models.inference.ai.azure.com/chat/completions',
    key: process.env.GITHUB_TOKEN,
    transform: (body) => ({ /* ... */ })
  }
};

app.post('/api/chat', async (req, res) => {
  const { provider, model, message, context, history } = req.body;
  const p = PROVIDERS[provider];
  if (!p?.key) return res.status(400).json({ error: `No key for ${provider}` });
  // Route to provider, stream response back
});

app.listen(3141, () => console.log('Proxy on :3141'));
```

**Dashboard detection**: On load, dashboard pings `http://localhost:3141/health`. If it responds, switch to proxy mode (hide key bars, show "Connected to local proxy" badge). If not, fall back to direct browser API calls.

### `.env` template
```
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AI...
OPENAI_API_KEY=sk-...
GITHUB_TOKEN=ghp_...
```

---

## P3: Streaming Responses

All providers support SSE/streaming. Implement for:
- Claude: `stream: true` → SSE with `content_block_delta` events
- Gemini: `streamGenerateContent` endpoint
- OpenAI: `stream: true` → SSE with `choices[0].delta`
- Renders tokens as they arrive instead of waiting for full response

---

## P3: Cost Tracking

- Track tokens per request (input + output)
- Store in localStorage: `{ provider, model, input_tokens, output_tokens, timestamp }`
- Dashboard widget showing daily/weekly spend estimate per provider
- Pricing table (hardcoded, updated periodically):
  - Claude Haiku 4.5: $0.80/$4 per MTok
  - Claude Sonnet 4.6: $3/$15 per MTok
  - Claude Opus 4.6: $15/$75 per MTok
  - Gemini Flash: $0.075/$0.30 per MTok
  - GPT-4o: $2.50/$10 per MTok

---

## Milestones

| Phase | What | Effort | Depends On |
|-------|------|--------|------------|
| v1.0 (done) | Claude live + clipboard fallback | — | — |
| v1.1 | Gemini live API | 2-3 hours | Gemini API key |
| v1.2 | OpenAI/Codex live API | 2-3 hours | OpenAI API key |
| v1.3 | Copilot via GitHub Models | 3-4 hours | GitHub PAT |
| v2.0 | Local proxy server | 4-6 hours | Node.js |
| v2.1 | Streaming responses | 4-6 hours | v1.1-1.3 |
| v2.2 | Cost tracking widget | 2-3 hours | v1.1-1.3 |
| v3.0 | Copilot Frontier / Extensions | TBD | API availability |

---

## Open Questions

1. Should each provider get its own system prompt, or share one?
2. Should chat history sync across providers (so Gemini can see what Claude said)?
3. Rate limiting strategy: per-provider or global?
4. Should the proxy server support WebSocket for true bidirectional streaming?
5. Copilot Frontier — is there a separate API, or does it use the same GitHub Models endpoint with a different model ID?
