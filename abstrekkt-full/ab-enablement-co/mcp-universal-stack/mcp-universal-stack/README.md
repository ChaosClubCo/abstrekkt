# MCP Universal Stack

**Production-ready MCP infrastructure: 31 native Claude.ai MCPs + 9 custom HTTP bridges with orchestration, monitoring, and automated workflows.**

## TL;DR

One unified system connecting Claude.ai to all your tools via native MCPs (Notion, Stripe, Vercel, etc.) and custom bridges (GitHub, Supabase, PostgreSQL, Slack, AI APIs).

---

## Quick Start

```bash
# 1. Clone and setup
cd mcp-universal-stack
cp .env.example .env
# Edit .env with your credentials

# 2. Install and build
cd bridges/github-bridge && npm install && npm run build
cd ../supabase-bridge && npm install && npm run build
cd ../postgres-bridge && npm install && npm run build
cd ../slack-bridge && npm install && npm run build
# Repeat for other bridges...

# 3. Start everything
docker-compose up -d

# 4. Verify health
./scripts/health-check.sh --verbose

# 5. Import n8n workflows
n8n import:workflow --input=n8n-workflows/health-monitor.json
n8n import:workflow --input=n8n-workflows/github-pr-review.json
n8n import:workflow --input=n8n-workflows/incident-response.json
n8n import:workflow --input=n8n-workflows/data-sync.json
```

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              Claude.ai Interface                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                     31 Native Claude.ai MCPs                            │ │
│  │  Notion, Stripe, Vercel, Sentry, Figma, Linear, HubSpot, monday.com,   │ │
│  │  Cloudflare, Canva, Intercom, Zapier, Netlify, Hugging Face, etc.      │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                          │
│                                    ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                        n8n Orchestration Layer                          │ │
│  │         Health Monitor │ PR Review │ Incident Response │ Data Sync      │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                          │
│                                    ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                         9 Custom HTTP Bridges                           │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │  │ GitHub   │ │ Supabase │ │PostgreSQL│ │  Slack   │ │ OpenAI   │      │ │
│  │  │  :7811   │ │  :7812   │ │  :7814   │ │  :7815   │ │  :7816   │      │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                   │ │
│  │  │Anthropic │ │  Google  │ │ Firebase │ │Filesystem│                   │ │
│  │  │  :7817   │ │  :7818   │ │  :7813   │ │  :7819   │                   │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘                   │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
              ┌─────────────────────────────────────────────┐
              │               External Services              │
              │  GitHub API, Supabase, PostgreSQL, Slack,   │
              │  OpenAI, Anthropic, Google AI, Firebase     │
              └─────────────────────────────────────────────┘
```

---

## Components

### Native MCPs (31 total)

These work directly with Claude.ai—no bridge needed:

| Category | MCPs |
|----------|------|
| **Project Management** | Notion, Linear, monday.com, Atlassian |
| **Development** | Vercel, Netlify, Cloudflare, GitHub* |
| **Payments** | Stripe, Plaid |
| **Communication** | Intercom, Fireflies |
| **Design** | Figma, Canva |
| **Monitoring** | Sentry |
| **CRM/Sales** | HubSpot, Close |
| **AI/ML** | Hugging Face |
| **Automation** | Zapier, n8n |
| **Other** | Cloudinary, GoDaddy, Stytch, Scholar Gateway, etc. |

*GitHub native MCP has limited functionality—use bridge for full API access.

### Custom Bridges (9 total)

| Bridge | Port | Priority | Purpose |
|--------|------|----------|---------|
| GitHub | 7811 | Critical | Full GitHub API (repos, issues, PRs, actions) |
| Supabase | 7812 | Critical | Database, RLS, storage, RPC |
| Firebase | 7813 | Medium | Firestore, Auth, Storage |
| PostgreSQL | 7814 | Critical | Direct SQL with injection protection |
| Slack | 7815 | High | Messages, channels, search, threads |
| OpenAI | 7816 | Medium | GPT, embeddings, DALL-E, assistants |
| Anthropic | 7817 | Medium | Claude API, vision, tool use |
| Google | 7818 | Medium | Gemini, Vertex AI |
| Filesystem | 7819 | High | Secure file access with allowlisting |

---

## Bridge API Reference

### GitHub Bridge (:7811)

```bash
# Health check
curl http://localhost:7811/health

# List repositories
curl -X POST http://localhost:7811/mcp/repos/list \
  -H "Content-Type: application/json" \
  -d '{"per_page": 10}'

# Create issue
curl -X POST http://localhost:7811/mcp/issues/create \
  -H "Content-Type: application/json" \
  -d '{"owner": "user", "repo": "repo", "title": "Bug report", "body": "Description"}'

# Trigger workflow
curl -X POST http://localhost:7811/mcp/actions/dispatch \
  -H "Content-Type: application/json" \
  -d '{"owner": "user", "repo": "repo", "workflow_id": "ci.yml", "ref": "main"}'
```

### Supabase Bridge (:7812)

```bash
# Query with filters
curl -X POST http://localhost:7812/mcp/query \
  -H "Content-Type: application/json" \
  -d '{"table": "users", "select": "*", "filters": [{"column": "status", "op": "eq", "value": "active"}]}'

# Insert record
curl -X POST http://localhost:7812/mcp/insert \
  -H "Content-Type: application/json" \
  -d '{"table": "events", "data": {"name": "Test Event", "created_at": "2024-01-01"}}'

# RLS audit
curl -X POST http://localhost:7812/mcp/rls/audit \
  -H "Content-Type: application/json" \
  -d '{"table": "users"}'
```

### PostgreSQL Bridge (:7814)

```bash
# Read-only query
curl -X POST http://localhost:7814/mcp/query \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM users WHERE status = $1", "params": ["active"]}'

# Write query (requires confirmation)
curl -X POST http://localhost:7814/mcp/execute \
  -H "Content-Type: application/json" \
  -d '{"sql": "UPDATE users SET status = $1 WHERE id = $2", "params": ["inactive", 123], "confirm_write": true}'

# Query plan analysis
curl -X POST http://localhost:7814/mcp/explain \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM orders WHERE created_at > NOW() - INTERVAL '\''1 day'\''", "analyze": true}'
```

### Slack Bridge (:7815)

```bash
# Post message
curl -X POST http://localhost:7815/mcp/messages/post \
  -H "Content-Type: application/json" \
  -d '{"channel": "#general", "text": "Hello from MCP!"}'

# Search messages
curl -X POST http://localhost:7815/mcp/search \
  -H "Content-Type: application/json" \
  -d '{"query": "project deadline", "sort": "timestamp"}'
```

### OpenAI Bridge (:7816)

```bash
# Chat completion
curl -X POST http://localhost:7816/mcp/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-4o", "messages": [{"role": "user", "content": "Hello!"}]}'

# Generate embeddings
curl -X POST http://localhost:7816/mcp/embeddings \
  -H "Content-Type: application/json" \
  -d '{"model": "text-embedding-3-small", "input": "Search query text"}'
```

### Anthropic Bridge (:7817)

```bash
# Claude message
curl -X POST http://localhost:7817/mcp/messages \
  -H "Content-Type: application/json" \
  -d '{"model": "claude-sonnet-4-20250514", "messages": [{"role": "user", "content": "Analyze this code..."}]}'

# Structured extraction
curl -X POST http://localhost:7817/mcp/tools/extract \
  -H "Content-Type: application/json" \
  -d '{"content": "John is 30 years old", "schema": {"type": "object", "properties": {"name": {"type": "string"}, "age": {"type": "number"}}}}'
```

### Filesystem Bridge (:7819)

```bash
# Read file
curl -X POST http://localhost:7819/mcp/read \
  -H "Content-Type: application/json" \
  -d '{"path": "/home/claude/projects/app/config.json"}'

# List directory
curl -X POST http://localhost:7819/mcp/list \
  -H "Content-Type: application/json" \
  -d '{"path": "/home/claude/projects", "recursive": true, "maxDepth": 2}'

# Search files
curl -X POST http://localhost:7819/mcp/search \
  -H "Content-Type: application/json" \
  -d '{"pattern": "**/*.ts", "cwd": "/home/claude/projects"}'
```

---

## n8n Workflows

### Health Monitor
- **Trigger:** Every 30 seconds
- **Action:** Checks all 9 bridges, alerts on failure
- **Output:** Slack notification, Google Sheets log

### GitHub PR Review
- **Trigger:** GitHub webhook (PR opened)
- **Action:** AI-powered code review via Anthropic bridge
- **Output:** PR comment with review, Slack notification

### Incident Response
- **Trigger:** Webhook from monitoring (Sentry, custom)
- **Action:** Classify severity, alert Slack, create PagerDuty incident, AI analysis
- **Output:** Incident logged to Supabase, escalation if P0/P1

### Data Sync
- **Trigger:** Hourly schedule or manual webhook
- **Action:** Sync GitHub repos/issues, Slack channels to Supabase
- **Output:** Sync summary in Slack, log to database

---

## Configuration

### Environment Variables

See `.env.example` for full list. Key variables:

```bash
# GitHub Bridge
GITHUB_TOKEN=ghp_xxxx          # repo, workflow scopes

# Supabase Bridge
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc... # Service role, NOT anon

# PostgreSQL Bridge
POSTGRES_CONNECTION_STRING=postgresql://user:pass@host:5432/db

# Slack Bridge
SLACK_BOT_TOKEN=xoxb-xxxx      # channels:read, chat:write, etc.

# AI Bridges
OPENAI_API_KEY=sk-xxxx
ANTHROPIC_API_KEY=sk-ant-xxxx

# Filesystem Bridge
FILESYSTEM_ALLOWED_PATHS=/home/claude/projects,/home/claude/documents

# n8n
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=xxxx
N8N_ENCRYPTION_KEY=xxxx        # openssl rand -hex 32
```

### MCP Configuration

Add to `~/.mcp/config.json`:

```json
{
  "mcps": {
    "github": { "url": "http://localhost:7811" },
    "supabase": { "url": "http://localhost:7812" },
    "postgres": { "url": "http://localhost:7814" },
    "slack": { "url": "http://localhost:7815" },
    "openai": { "url": "http://localhost:7816" },
    "anthropic": { "url": "http://localhost:7817" },
    "filesystem": { "url": "http://localhost:7819" }
  }
}
```

---

## Security

### Access Control (RBAC)

| Namespace | Permissions | Rate Limit |
|-----------|-------------|------------|
| `read-only` | GET endpoints only | 200/min |
| `deploy` | CI/CD triggers | 20/min |
| `data-admin` | Database writes | 50/min |
| `ai-ops` | AI API calls | 60/min |
| `comms` | Slack messages | 100/min |

### Security Checklist

- [x] All bridges localhost-only (127.0.0.1)
- [x] Secrets in environment variables only
- [x] SQL injection prevention (parameterized queries + pattern detection)
- [x] Path traversal prevention (allowlist + symlink checks)
- [x] Rate limiting per bridge
- [x] Request logging with PII redaction
- [x] Health check alerts for failures
- [x] Input validation via Zod schemas

---

## Monitoring

### Health Checks

```bash
# Quick check all bridges
./scripts/health-check.sh

# Verbose with troubleshooting
./scripts/health-check.sh --verbose

# JSON output for automation
./scripts/health-check.sh --json
```

### Alerts

- **Slack:** #ops-alerts for warnings, #incidents for P0/P1
- **PagerDuty:** Auto-escalation for critical bridge failures
- **Logs:** 90-day retention, JSON format, request IDs

---

## Development

### Adding a New Bridge

1. Create directory: `bridges/new-bridge/`
2. Copy template: `cp bridges/github-bridge/package.json bridges/new-bridge/`
3. Implement server: Follow patterns in existing bridges
4. Add Dockerfile: Copy and modify port
5. Update docker-compose.yml
6. Add to health-check.sh
7. Document endpoints in README

### Testing

```bash
cd bridges/github-bridge
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Local Development

```bash
# Start individual bridge in dev mode
cd bridges/github-bridge
npm run dev

# Or start all via docker-compose
docker-compose up -d
docker-compose logs -f github-bridge
```

---

## Troubleshooting

### Bridge Won't Start

```
Cause: Missing environment variable
Fix: Check .env file, ensure all required vars are set
Verify: echo $GITHUB_TOKEN (should show value, not empty)
```

### Connection Refused

```
Cause: Bridge not running or wrong port
Fix: docker-compose ps (check status), docker-compose restart <service>
Verify: curl http://localhost:7811/health
```

### 401 Unauthorized

```
Cause: Invalid or expired API token
Fix: Regenerate token, update .env, restart bridge
Verify: Test token directly with API (curl to GitHub, etc.)
```

### Rate Limited (429)

```
Cause: Too many requests
Fix: Wait for window reset, implement caching, reduce frequency
Verify: Check rate limit headers in response
```

---

## Files

```
mcp-universal-stack/
├── docs/
│   └── ARCHITECTURE.md          # System design
├── configs/
│   └── universal.mcp.json       # Unified MCP config
├── bridges/
│   ├── github-bridge/           # GitHub API bridge
│   ├── supabase-bridge/         # Supabase bridge
│   ├── postgres-bridge/         # PostgreSQL bridge
│   ├── slack-bridge/            # Slack bridge
│   ├── openai-bridge/           # OpenAI bridge
│   ├── anthropic-bridge/        # Anthropic bridge
│   └── filesystem-bridge/       # Filesystem bridge
├── n8n-workflows/
│   ├── health-monitor.json      # Health monitoring
│   ├── github-pr-review.json    # AI PR reviews
│   ├── incident-response.json   # Incident management
│   └── data-sync.json           # Cross-platform sync
├── scripts/
│   └── health-check.sh          # Health automation
├── docker-compose.yml           # Container orchestration
├── .env.example                 # Environment template
└── README.md                    # This file
```

---

## License

MIT

---

## Author

Kyle R. / Staff Platform Engineer
