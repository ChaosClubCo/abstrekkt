# System Overview — Ops Autopilot Architecture

> **Audience:** ENG, LEAD | **Phase:** MVP (Week 1)

---

## Design Philosophy

1. **Customer data stays in the customer environment.** Control plane never sees plaintext secrets, PII, or business data.
2. **Every privileged action requires human approval.** Immutable audit trail for all decisions.
3. **Isolation is structural, not just logical.** Each customer runs own n8n instance. RLS at database level.

---

## System Boundaries

```
┌─────────────────────────────────────────────────────────┐
│                  CUSTOMER ENVIRONMENT                    │
│  ┌──────────────┐    ┌────────────────────────────────┐  │
│  │  Teams Bot    │───▶│  n8n Instance (self-hosted)    │  │
│  │  (Copilot     │    │  ┌─────────┐  ┌────────────┐  │  │
│  │   Studio)     │    │  │ Workflow │  │ Local Vault │  │  │
│  └──────────────┘    │  │ Engine   │  │ (AES-256)   │  │  │
│  ┌──────────────┐    │  └────┬────┘  └────────────┘  │  │
│  │  Slack Bot    │───▶│  ┌────▼────┐  ┌────────────┐  │  │
│  │  (Approvals)  │    │  │ Bull     │  │ Redis      │  │  │
│  └──────────────┘    │  │ Queue    │  │ (job state) │  │  │
│                       │  └────┬────┘  └────────────┘  │  │
│                       └───────┼────────────────────────┘  │
└───────────────────────────────┼────────────────────────────┘
                    Cloudflare Tunnel (TLS 1.3 + mTLS + WAF)
┌───────────────────────────────┼────────────────────────────┐
│              INTINC CONTROL PLANE (SaaS)                    │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ API Gateway  │──│ Approval     │──│ Policy Engine     │  │
│  │ (Vercel+Next)│  │ Engine       │  │ (rule matching)   │  │
│  └──────┬──────┘  └──────┬───────┘  └───────────────────┘  │
│  ┌──────▼──────┐  ┌──────▼───────┐  ┌───────────────────┐  │
│  │ Run/Step DB │  │ Audit Log    │  │ Observability     │  │
│  │ (Supabase)  │  │ (immutable)  │  │ (Prom+Loki+Jaeger)│  │
│  └─────────────┘  └──────────────┘  └───────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Secrets Registry (hashes only — zero-knowledge)     │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

## Component Inventory

### Control Plane

| Component | Technology | Responsibility | Scaling |
|-----------|-----------|----------------|---------|
| API Gateway | Vercel + Next.js | Auth, routing, rate limiting | Serverless auto-scale |
| Run/Step DB | Supabase Postgres 15 | Run status, step results | Vertical scaling |
| Approval Engine | Custom TypeScript | Policy matching, TTL | Stateless |
| Policy Engine | Custom TypeScript | Rule evaluation, rate limits | In-memory cache |
| Audit Log | Supabase (dedicated) | Immutable HMAC-signed log | Append-only, partitioned |
| Secrets Registry | Supabase (hashes) | Rotation tracking | Never stores plaintext |
| Observability | Prometheus+Loki+Jaeger | Metrics, logs, traces | Grafana Cloud |
| Alerting | PagerDuty | SLO breach, incidents | Managed SaaS |

### Execution Plane (Per Customer)

| Component | Technology | Responsibility |
|-----------|-----------|----------------|
| n8n Instance | Docker self-hosted | Workflow execution, connectors |
| Local Vault | n8n built-in AES-256 | API keys, tokens, credentials |
| Bull Queue | Bull + Redis | Job scheduling, retry, DLQ |
| Teams Bot | Copilot Studio | User-facing interface |
| Slack Bot | Slack API | Approval modals, notifications |

## Data Flow: Workflow Execution

```
1. TRIGGER — User submits via Teams/Slack → n8n webhook → JSON schema validation
2. RUN CREATION — n8n → POST /api/v1/runs → idempotency check → Run created
3. STEP EXECUTION — Per step:
   a. Policy engine: approval required?
   b. If yes: create Approval, send modal, pause
   c. Execute connector action
   d. Report completion to control plane
4. COMPLETION — Final status, HMAC-signed audit entry, notification
5. OBSERVABILITY — Metrics→Prometheus, Logs→Loki, Traces→Jaeger
```

## Technology Decisions

| Decision | Choice | Rationale | Alternatives Considered |
|----------|--------|-----------|------------------------|
| Control plane | Vercel (serverless) | Zero-ops, auto-scale | AWS ECS, Railway |
| Database | Supabase Postgres | Built-in RLS, auth | PlanetScale, Neon |
| Workflow engine | n8n self-hosted | Open-source, 400+ connectors | Temporal, Prefect |
| Queue | Bull + Redis | Battle-tested, DLQ | RabbitMQ, SQS |
| Tunnel | Cloudflare Tunnel | Zero-trust, no open ports | WireGuard, ngrok |
| Auth | Supabase Auth + JWT | Native integration | Auth0, Clerk |
| Observability | Prometheus+Loki+Jaeger | Open-source ecosystem | Datadog, New Relic |

## Capacity Limits Per Tier

| Resource | Starter ($49) | Growth ($149) | Enterprise ($500+) |
|----------|---------------|---------------|---------------------|
| Concurrent workflows | 10 | 50 | 200 |
| Workflows/day | 100 | 1,000 | Unlimited |
| n8n deployment | Single Docker | Docker + Redis | Cluster (3+) |
| Data retention | 1 year | 3 years | 7 years |

## Failure Modes

| Failure | Detection | Auto Response | Manual Recovery |
|---------|-----------|--------------|-----------------|
| Control plane down | Vercel health check | Auto-restart | Rollback deploy |
| n8n crash | Health check (5min) | Pause runs, alert | Restart Docker |
| Redis OOM | Memory >80% | Evict expired | Scale Redis |
| Tunnel drop | Health metric | Reconnect (3x) | Re-establish |
| Azure AD 429 | Connector response | Backoff 2s/4s/8s→DLQ | Reschedule |
| Approval timeout | Cron (5min) | Remind→escalate→reject | Manager retries |

## Extension Points

1. **New connectors:** Add n8n nodes — no control plane changes
2. **New workflows:** Import JSON into n8n, register in catalog
3. **Custom policies:** Add rules to Policy table — no code
4. **Notification channels:** Add webhook targets to approval engine
5. **Customer logic:** n8n Code nodes (sandboxed)
