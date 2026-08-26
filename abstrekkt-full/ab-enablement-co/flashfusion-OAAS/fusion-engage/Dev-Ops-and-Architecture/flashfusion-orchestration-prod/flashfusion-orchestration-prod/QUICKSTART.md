# Quick Start Guide

Get the orchestration library running in production in 30 minutes.

## 1. Prerequisites (2 minutes)

```bash
# Check versions
node --version  # Must be >= 20.0.0
pnpm --version  # Must be >= 8.0.0

# If missing, install:
# Node: https://nodejs.org/
# pnpm: npm install -g pnpm
```

## 2. Install (3 minutes)

```bash
# Extract zip
unzip flashfusion-orchestration-prod.zip
cd flashfusion-orchestration-prod

# Install dependencies
pnpm install

# Verify installation
pnpm test  # Should see 84/84 tests passing
```

## 3. Local Development (5 minutes)

```bash
# Start MCP server with hot reload
pnpm dev

# In another terminal, test it:
echo '{"method":"health_check","params":{}}' | node dist/mcp/server.js
# Should return {"result":{"status":"healthy",...}}

# Run tests in watch mode
pnpm test:watch
```

## 4. Build & Validate (5 minutes)

```bash
# Build production bundle
pnpm build

# Run full test suite
pnpm test:coverage

# Security scan (requires setup, see below)
pnpm security:scan

# Check bundle size (should be <50KB)
ls -lh dist/index.js
```

## 5. Deploy to Production (15 minutes)

### Option A: Railway (Recommended)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create project
railway init

# Add environment variables
railway variables set NODE_ENV=production
railway variables set LOG_LEVEL=info

# Deploy
railway up

# Get URL
railway domain
```

### Option B: Docker

```bash
# Build image
docker build -f docker/Dockerfile -t orchestration:latest .

# Run container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  orchestration:latest

# Test health
curl http://localhost:3000/health
```

### Option C: AWS Fargate

```bash
# See docs/DEPLOYMENT_AWS.md
# Approximate cost: $8.85/month for 1 task
```

## 6. Verify Production Deployment

```bash
# Health check
curl https://your-domain.com/health

# Metrics
curl https://your-domain.com/metrics

# Load test (from local machine)
pnpm perf:load
```

## 7. Set Up Monitoring (Optional, 10 minutes)

### PagerDuty Integration

1. Create PagerDuty service
2. Add integration key to Railway: `railway variables set PAGERDUTY_KEY=<key>`
3. Configure alerts in `config/alerts.yml`

### Metrics Dashboard

```bash
# Railway provides built-in metrics
# Access at: https://railway.app/project/<your-project>/metrics

# Or export to external service:
# - Datadog: DATADOG_API_KEY
# - New Relic: NEW_RELIC_LICENSE_KEY
```

## 8. Set Up CI/CD (Optional, 15 minutes)

```bash
# Push to GitHub
git remote add origin https://github.com/your-org/orchestration.git
git push -u origin main

# Add secrets to GitHub:
# Settings > Secrets > Actions > New repository secret
# - RAILWAY_TOKEN (from railway.app)
# - SNYK_TOKEN (from snyk.io)
# - CODECOV_TOKEN (from codecov.io)

# Push triggers CI/CD pipeline automatically
```

## Common Issues & Solutions

### Issue: Tests failing on Windows

```bash
# Solution: Use pnpm instead of npm
pnpm install --frozen-lockfile
pnpm test
```

### Issue: Permission denied on server.js

```bash
# Solution: Make executable
chmod +x dist/mcp/server.js
# Or: node dist/mcp/server.js
```

### Issue: Rate limit errors in tests

```bash
# Solution: Tests reset rate limiters automatically
# If still failing, clear state:
rm -rf node_modules/.vitest
pnpm test
```

### Issue: Docker build fails

```bash
# Solution: Increase Docker memory
# Docker Desktop > Settings > Resources > Memory > 4GB

# Or: Build without tests
docker build --target production -f docker/Dockerfile .
```

### Issue: High memory usage

```bash
# Solution: Set memory limit
node --max-old-space-size=512 dist/mcp/server.js

# Or in Railway:
railway variables set NODE_OPTIONS=--max-old-space-size=512
```

## Next Steps

- **Read CONTRIBUTING.md** - Learn development workflow
- **Read RUNBOOK.md** - Operational procedures and troubleshooting
- **Read docs/COMPLIANCE.md** - SOC2/HIPAA control mapping
- **Read docs/COST_ANALYSIS.md** - Deployment cost breakdown
- **Join Slack #orchestration-dev** - Get help from team

## Security Setup (Production Checklist)

Before going to production:

- [ ] Rotate all secrets: `railway variables set SECRETS_KEY=$(openssl rand -hex 32)`
- [ ] Enable 2FA on deployment accounts
- [ ] Set up vulnerability scanning: `pnpm security:scan`
- [ ] Configure alerts: Edit `config/alerts.yml`
- [ ] Review audit logs: `railway logs --tail 1000`
- [ ] Run security audit: Contact security@flashfusion.com

## Cost Estimates

| Platform | Configuration | Cost/Month |
|----------|--------------|------------|
| Railway | 1 instance, 512MB | $17.50 |
| AWS Fargate | 1 task, 0.5 vCPU, 1GB | $8.85 |
| Digital Ocean | 1 droplet, $6/mo | $6.00 |

For 50 concurrent agents. Scales linearly.

## Support

- **Documentation**: All docs in `docs/` folder
- **Issues**: GitHub Issues
- **Security**: security@flashfusion.com
- **Slack**: #orchestration-dev

**Congratulations!** 🎉 Your production-grade orchestration library is now running.
