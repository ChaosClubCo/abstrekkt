# Runbook: Deployment Failure

> **Severity:** MEDIUM-HIGH | **Detection:** CI/CD failure, customer n8n provisioning failure

## Control Plane Deployment Failure (Vercel)

**Symptoms:** GitHub Actions reports failure, Vercel deployment stuck/errored

**Recovery:**
1. Check GitHub Actions logs: which step failed? (build, test, deploy)
2. If test failure: fix test, do not deploy
3. If build failure: check for dependency issue (`npm ci` errors)
4. If Vercel deploy failure: check Vercel dashboard for error
5. Rollback: Vercel instant rollback to previous deployment
6. Verify: health check passes, 5 API calls succeed

## n8n Provisioning Failure (Customer Onboarding)

**Symptoms:** Docker Compose fails, n8n doesn't start, connectors won't configure

**Common causes + fixes:**

| Cause | Fix |
|-------|-----|
| Port conflict (5678 in use) | Change n8n port in docker-compose.yaml |
| Docker not installed | Walk customer through Docker installation |
| Insufficient memory (<2GB) | Recommend 4GB+ for n8n + Redis |
| Firewall blocking outbound | Open HTTPS (443) for Cloudflare Tunnel |
| DNS resolution failure | Check customer's DNS settings |
| SSL certificate mismatch | Regenerate Cloudflare Tunnel certificate |

**Rollback:** Remove containers: `docker-compose down -v`, fix issue, re-deploy: `docker-compose up -d`

## Prevention
- Docker Compose template tested monthly on clean VM
- Onboarding checklist includes pre-flight checks (Docker version, memory, ports, network)
- Automated provisioning test in CI: spin up n8n, import workflows, verify health
