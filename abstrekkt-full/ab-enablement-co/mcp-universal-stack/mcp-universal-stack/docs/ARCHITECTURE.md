# Universal MCP Stack — Architecture Document

**Author:** Kyle R. / Tessa (merged mastercontext)  
**Version:** 2.0.0  
**Date:** 2025-12-14  
**Classification:** [PROD] Full Implementation

---

## TL;DR

Unified MCP orchestration layer combining 31 native Claude.ai MCPs + 9 custom HTTP bridges + n8n workflow engine, with centralized health checks, RBAC namespaces, and env-first secrets management.

---

## Analogy: Airport Terminal

Think of this architecture like an international airport terminal:

| Airport Component | MCP Equivalent |
|-------------------|----------------|
| **Terminal Building** | Claude.ai platform |
| **Gates (A1-A31)** | Native MCP connectors (Stripe, Notion, etc.) |
| **Private Jet Terminal** | Custom HTTP bridges (ports 7811-7819) |
| **Air Traffic Control** | n8n orchestration layer |
| **Security Checkpoints** | RBAC namespaces |
| **Baggage Handling** | Data transformation layer |
| **Flight Status Board** | Health check dashboard |

**The Goal:** All passengers (requests) arrive at unified security (RBAC), get routed to the right gate (MCP/bridge), and ATC (n8n) handles complex multi-hop journeys.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLAUDE.AI PLATFORM                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                    NATIVE MCP CONNECTORS (31)                          │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │ │
│  │  │ Stripe  │ │ Notion  │ │ Vercel  │ │  n8n    │ │ Linear  │ ...      │ │
│  │  │  MCP    │ │  MCP    │ │  MCP    │ │  MCP    │ │  MCP    │          │ │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘          │ │
│  └───────┼──────────┼──────────┼──────────┼──────────┼───────────────────┘ │
│          │          │          │          │          │                      │
│  ┌───────▼──────────▼──────────▼──────────▼──────────▼───────────────────┐ │
│  │                    ORCHESTRATION LAYER (n8n)                           │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐       │ │
│  │  │ Health     │  │ Routing    │  │ Transform  │  │ Aggregate  │       │ │
│  │  │ Monitor    │  │ Logic      │  │ Pipeline   │  │ Results    │       │ │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                    CUSTOM HTTP BRIDGES (9)                             │ │
│  │                                                                         │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │ │
│  │  │ GitHub  │ │Supabase │ │Firebase │ │Postgres │ │  Slack  │          │ │
│  │  │ :7811   │ │ :7812   │ │ :7813   │ │ :7814   │ │ :7815   │          │ │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘          │ │
│  │       │          │          │          │          │                    │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                      │ │
│  │  │ OpenAI  │ │Anthropic│ │ Google  │ │Filesys  │                      │ │
│  │  │ :7816   │ │ :7817   │ │ :7818   │ │ :7819   │                      │ │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘                      │ │
│  └───────┼──────────┼──────────┼──────────┼──────────────────────────────┘ │
│          │          │          │          │                                 │
└──────────┼──────────┼──────────┼──────────┼─────────────────────────────────┘
           │          │          │          │
           ▼          ▼          ▼          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES                                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ GitHub  │ │Supabase │ │Firebase │ │Postgres │ │  Slack  │ │ OpenAI  │  │
│  │   API   │ │   API   │ │   API   │ │   DB    │ │   API   │ │   API   │  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Inventory

### Native Claude.ai MCPs (31) — Use As-Is

| # | Server | Category | Use Case |
|---|--------|----------|----------|
| 1 | Atlassian | Project Mgmt | Jira/Confluence integration |
| 2 | Cloudflare | Infrastructure | Workers, Pages, DNS |
| 3 | Stripe | Payments | FlashFusion transactions |
| 4 | Canva | Design | Asset generation |
| 5 | Notion | Knowledge | Documentation, wikis |
| 6 | Sentry | Observability | Error tracking |
| 7 | Intercom | Support | Customer messaging |
| 8 | Plaid | Finance | Banking APIs |
| 9 | Invideo | Media | Video generation |
| 10 | Zapier | Automation | No-code workflows |
| 11 | Netlify | Deployment | Static sites |
| 12 | Hugging Face | ML | Model inference |
| 13 | Jam | QA | Bug reporting |
| 14 | Vercel | Deployment | FlashFusion hosting |
| 15 | Fireflies | Meetings | Transcription |
| 16 | Close | CRM | Sales tracking |
| 17 | Cloudinary | Media | Image/video CDN |
| 18 | Daloopa | Finance | Financial data |
| 19 | HubSpot | Marketing | CRM + automation |
| 20 | Stytch | Auth | Identity provider |
| 21 | monday.com | Project Mgmt | Task tracking |
| 22 | Playwright | Testing | Browser automation |
| 23 | Melon | Analytics | - |
| 24 | GoDaddy | Domains | DNS management |
| 25 | CData Connect | Data | Universal connectors |
| 26 | Scholar Gateway | Research | Academic search |
| 27 | Fellow.ai | Meetings | Meeting notes |
| 28 | n8n | Orchestration | Workflow engine |
| 29 | Linear | Engineering | Issue tracking |
| 30 | Figma | Design | UI/UX collaboration |
| 31 | Learning Commons | Knowledge | Knowledge graph |

### Custom HTTP Bridges (9) — Must Build

| # | Bridge | Port | Priority | Why Needed |
|---|--------|------|----------|------------|
| 1 | GitHub | 7811 | 🔴 Critical | Workflow failures, PR automation |
| 2 | Supabase | 7812 | 🔴 Critical | FlashFusion core DB |
| 3 | Firebase | 7813 | 🟡 Medium | Legacy/backup auth |
| 4 | PostgreSQL | 7814 | 🔴 Critical | Direct SQL for RLS audits |
| 5 | Slack | 7815 | 🟠 High | INTINC team comms |
| 6 | OpenAI | 7816 | 🟡 Medium | GPT fallback |
| 7 | Anthropic | 7817 | 🟡 Medium | Claude API direct |
| 8 | Google | 7818 | 🟡 Medium | Workspace/AI APIs |
| 9 | Filesystem | 7819 | 🟠 High | Local file access |

---

## RBAC Namespace Design

```yaml
namespaces:
  # Read-only operations (safe for automation)
  read-only:
    servers:
      - notion
      - github (read scope only)
      - supabase (SELECT only)
      - filesystem (read only)
    permissions:
      - read
      - list
      - search
    
  # Deployment operations (CI/CD)
  deploy:
    servers:
      - vercel
      - cloudflare
      - netlify
      - github (workflow dispatch)
    permissions:
      - read
      - write
      - deploy
      - rollback
    
  # Data administration (elevated)
  data-admin:
    servers:
      - supabase (full)
      - postgres (full)
      - stripe (live mode)
      - firebase
    permissions:
      - read
      - write
      - delete
      - migrate
    requires:
      - mfa_verified: true
      - approval: team_lead
    
  # AI model operations
  ai-ops:
    servers:
      - openai
      - anthropic
      - google
      - huggingface
    permissions:
      - inference
      - fine_tune (approval required)
    rate_limits:
      requests_per_minute: 60
      tokens_per_day: 1_000_000
    
  # Communication channels
  comms:
    servers:
      - slack
      - intercom
    permissions:
      - read
      - post
      - dm (restricted)
```

---

## Data Flow Patterns

### Pattern 1: Simple Read (Single MCP)
```
Request → Native MCP → External API → Response
```

### Pattern 2: Bridge Proxy (HTTP Bridge)
```
Request → Health Check → Bridge Auth → External API → Transform → Response
```

### Pattern 3: Orchestrated Multi-Step (n8n)
```
Request → n8n Trigger → [GitHub MCP] → [Supabase MCP] → [Slack MCP] → Response
```

### Pattern 4: Fallback Chain (Resilience)
```
Request → Primary (Supabase) ─[fail]→ Secondary (Firebase) ─[fail]→ Error Handler
```

---

## Security Architecture

### Layer 1: Network Boundary
- All bridges listen on localhost only (127.0.0.1)
- External access via reverse proxy (nginx/Caddy) with TLS
- IP allowlisting for production bridges

### Layer 2: Authentication
- Env-first secrets with input prompt fallback
- JWT validation on bridge endpoints
- API key rotation every 90 days

### Layer 3: Authorization
- RBAC namespace enforcement
- Least privilege per operation
- Audit logging (immutable, 90-day retention)

### Layer 4: Data Protection
- TLS 1.3 for all external connections
- PII encryption at rest (Supabase RLS)
- No secrets in logs (masking enabled)

### Layer 5: Monitoring
- Health check interval: 30 seconds
- Alert thresholds: >1% error rate for 2 min
- Incident response: PagerDuty integration

---

## Port Allocation

| Port | Service | Protocol | Notes |
|------|---------|----------|-------|
| 5678 | n8n | HTTP | Orchestration UI |
| 7811 | GitHub Bridge | HTTP | MCP proxy |
| 7812 | Supabase Bridge | HTTP | MCP proxy |
| 7813 | Firebase Bridge | HTTP | MCP proxy |
| 7814 | PostgreSQL Bridge | HTTP | MCP proxy |
| 7815 | Slack Bridge | HTTP | MCP proxy |
| 7816 | OpenAI Bridge | HTTP | MCP proxy |
| 7817 | Anthropic Bridge | HTTP | MCP proxy |
| 7818 | Google Bridge | HTTP | MCP proxy |
| 7819 | Filesystem Bridge | HTTP | MCP proxy |
| 8080 | Health Dashboard | HTTP | Monitoring UI |

---

## Failure Modes & Recovery

| Failure | Detection | Recovery | RTO |
|---------|-----------|----------|-----|
| Bridge crash | Health check fails | Auto-restart (systemd) | <30s |
| API rate limit | 429 response | Exponential backoff | Variable |
| Auth token expired | 401 response | Auto-refresh or prompt | <5s |
| Network partition | Timeout | Retry with fallback | <60s |
| Database connection | Pool exhausted | Scale pool + queue | <2min |

---

## Deployment Topology

### Development
```
┌─────────────────────────────────┐
│        Local Machine            │
│  ┌─────────┐   ┌─────────┐     │
│  │  n8n    │   │ Bridges │     │
│  │ Docker  │   │  (9x)   │     │
│  └─────────┘   └─────────┘     │
│         │           │          │
│         └─────┬─────┘          │
│               ▼                │
│      ┌─────────────────┐       │
│      │ Claude Desktop  │       │
│      │   (MCP Client)  │       │
│      └─────────────────┘       │
└─────────────────────────────────┘
```

### Production
```
┌─────────────────────────────────────────────────────┐
│                     Railway/Fly.io                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   n8n       │  │  Bridges    │  │   Health    │ │
│  │  (scaled)   │  │  (3 replicas│  │   Monitor   │ │
│  │             │  │   each)     │  │             │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │
│         │                │                │        │
│         └────────────────┼────────────────┘        │
│                          │                         │
│                   ┌──────▼──────┐                  │
│                   │   Caddy     │                  │
│                   │ (TLS + Auth)│                  │
│                   └──────┬──────┘                  │
└──────────────────────────┼──────────────────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Claude.ai   │
                    │ (Consumer)  │
                    └─────────────┘
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-08-28 | Initial Tessa doc |
| 2.0.0 | 2025-12-14 | Merged with Kyle's 31 MCPs, added n8n orchestration |

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- Native Claude.ai MCPs should be preferred over bridges for duplicated functionality (Stripe, Notion, Vercel)
- RBAC namespaces provide defense-in-depth when combined with per-service auth
- n8n orchestration enables complex multi-MCP workflows without custom code

**COUNTEREXAMPLE:**
- If Claude.ai native MCP has a bug or feature gap, bridge fallback may be necessary
- RBAC adds latency; high-frequency operations may need bypass paths

**CONTRADICTIONS:**
- Original Tessa doc assumed local bridges for Stripe/Notion/Vercel; this version removes redundancy
- Port 7811 was GitHub Copilot in Tessa; now it's GitHub Bridge (Copilot uses HTTPS endpoint)
