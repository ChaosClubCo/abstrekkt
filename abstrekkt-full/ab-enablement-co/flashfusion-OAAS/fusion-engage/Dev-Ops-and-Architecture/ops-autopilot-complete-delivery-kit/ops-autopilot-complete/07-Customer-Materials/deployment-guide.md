# Deployment Guide — Ops Autopilot

> **Audience:** CUST (IT Admin) | **Phase:** MVP

---

## Prerequisites

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Docker | 20.10+ | Latest stable |
| Docker Compose | 2.0+ | Latest stable |
| RAM | 2GB | 4GB |
| Disk | 10GB | 20GB |
| OS | Ubuntu 20.04+, Windows Server 2019+ | Ubuntu 22.04 |
| Network | Outbound HTTPS (443) | Dedicated subnet |
| Azure AD | App registration with User.ReadWrite.All | + Group.ReadWrite.All |
| Slack | Bot token with chat:write, users:write | + channels:manage |

## Step 1: Deploy n8n + Redis

```bash
# Download the Ops Autopilot Docker Compose template
curl -O https://deploy.opsautopilot.com/docker-compose.yaml

# Set environment variables
cp .env.example .env
# Edit .env with your settings (see below)

# Start services
docker-compose up -d

# Verify health
curl http://localhost:5678/healthz
# Expected: {"status":"ok"}
```

**Required .env variables:**
```
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=<generate-strong-password>
N8N_ENCRYPTION_KEY=<generate-32-char-key>
REDIS_PASSWORD=<generate-strong-password>
OPS_AUTOPILOT_API_KEY=<provided-by-intinc>
OPS_AUTOPILOT_CUSTOMER_ID=<provided-by-intinc>
```

## Step 2: Configure Cloudflare Tunnel

```bash
# Install cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x cloudflared

# Authenticate (Intinc provides tunnel token)
./cloudflared tunnel --token <tunnel-token-from-intinc>

# Verify tunnel is active
# Check: https://dash.cloudflare.com → tunnels → your tunnel shows "Healthy"
```

## Step 3: Configure Connectors

In n8n web UI (http://localhost:5678):

1. **Azure AD:** Settings → Credentials → Add "Microsoft OAuth2" → Enter client_id, client_secret, tenant_id
2. **Slack:** Settings → Credentials → Add "Slack Bot" → Enter bot_token
3. **Jira:** Settings → Credentials → Add "Jira API" → Enter email, API token, domain

## Step 4: Import Workflows

```bash
# Workflows are auto-imported during first boot
# Verify in n8n: Workflows tab should show your purchased workflows

# If manual import needed:
curl -X POST http://localhost:5678/api/v1/workflows \
  -H "Authorization: Bearer <n8n-api-key>" \
  -d @workflow-ticket-routing.json
```

## Step 5: End-to-End Test

1. Open Teams → send test message to Ops Autopilot bot: "Test ticket: VPN not working"
2. Verify: Jira ticket created, agent notified in Slack, you receive confirmation
3. Check dashboard: https://app.opsautopilot.com → your run should show COMPLETED

## Troubleshooting

| Issue | Fix |
|-------|-----|
| n8n won't start | Check Docker logs: `docker-compose logs n8n` |
| Tunnel not connecting | Verify outbound 443 is open, check token |
| Azure AD 401 | Verify app registration permissions, re-enter credentials |
| Slack messages not sending | Check bot token scope includes chat:write |
| Workflows not appearing | Re-import from template, check n8n API key |

## Support
- Email: support@opsautopilot.com
- Slack: #ops-autopilot-support (invite sent during onboarding)
- Response time: 4 hours (Growth), 1 hour (Enterprise)
