# Connector Strategy — Ops Autopilot

> **Audience:** ENG, LEAD | **Phase:** MVP (Week 3)

---

## Connector Tiers

### Tier 1: Included (All Plans)

| Connector | Actions | Rate Limits |
|-----------|---------|-------------|
| **Azure AD** | create/disable user, assign/remove group, reset password | 1,000 req/min |
| **Okta** | assign/revoke app, create session, suspend user | 100 req/sec |
| **Jira** | create/update/transition ticket, add comment | 100 req/min |
| **Slack** | send message/modal, update message, create channel | 1 msg/sec/channel |
| **Teams** | send message/adaptive card, create channel | 30 msg/sec/app |
| **Email** | send email/template (SMTP/SendGrid) | 100/min |

### Tier 2: Opt-In (Growth + Enterprise)
ServiceNow, Zendesk, FortiNet VPN, Workday, AWS IAM, GCP IAM, Azure RBAC

### Tier 3: Custom (Enterprise)
Webhook-based (customer HTTPS endpoint), n8n Code nodes (sandboxed), API gateway forwarding, custom n8n nodes

## Connector Interface

Every connector implements: actions with input/output JSON schemas, auth type (oauth2/api_key/bearer), rate limits, health check endpoint, retry policy (exponential backoff 2s/4s/8s, max 3), idempotency checks per action.

## Error Handling (Unified)

| HTTP | Action |
|------|--------|
| 200-299 | Record output hash, advance |
| 400 | Fail step (bad input) |
| 401 | Fail + alert: secret rotation needed |
| 409 | Check idempotency (may already exist) |
| 429 | Retry with backoff → DLQ |
| 5xx | Retry with backoff → DLQ |

## Adding a Connector

**Tier 1/2 (INT engineer):** ~3–5 days. Build n8n node + schemas + error handling + idempotency + tests (25 cases) + docs.
**Tier 3 webhook (customer):** ~0.5–1 day. Customer provides URL + schema, INT configures HTTP node.
**Tier 3 custom node:** ~5–10 days. Professional services engagement.

## Health Monitoring

Health check every 5 minutes per connector. 3 consecutive failures → DEGRADED. 5 failures → DOWN + alert. Prometheus metrics: `connector_health_status`, `connector_health_latency_ms`, `connector_error_total`.
