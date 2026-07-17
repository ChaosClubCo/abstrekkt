# Operational Runbook

## Overview

This runbook provides step-by-step procedures for operating the orchestration library in production.

**On-Call Rotation**: 24/7 coverage  
**Escalation**: Tier 1 (5min) → Tier 2 (15min) → Tier 3 CTO (4hr)  
**SLA**: P0=4hr, P1=24hr, P2=1 week

## Health Checks

### Quick Health Check

```bash
# HTTP
curl https://orchestration.flashfusion.com/health

# Expected response
{
  "status": "healthy",
  "checks": {
    "memory": true,
    "circuitBreaker": true,
    "rateLimit": true
  },
  "uptime": 3600000,
  "timestamp": 1706832000000
}
```

### Detailed Metrics

```bash
curl https://orchestration.flashfusion.com/metrics

# Key metrics to watch
{
  "uptime": 3600000,
  "latency": {
    "p50": 15,
    "p95": 85,    # Alert if >100ms
    "p99": 180    # Alert if >1000ms
  },
  "errors": {
    "validation": 5,
    "system": 2   # Alert if >10/min
  },
  "memory": {
    "utilization": 0.65  # Alert if >0.9
  }
}
```

## Common Incidents

### 1. High Error Rate (P0)

**Symptoms**: >5% error rate, user reports of failures  
**Impact**: Service degradation, user-facing errors

**Investigation**:

```bash
# Check logs for errors
docker logs orchestration-prod | grep ERROR | tail -50

# Check circuit breaker state
curl https://orchestration.flashfusion.com/metrics | jq '.circuitBreaker'

# Check recent deployments
gh run list --workflow=ci.yml --limit 5
```

**Resolution**:

1. **If recent deployment**:
   ```bash
   # Rollback to previous version
   railway rollback orchestration-prod
   ```

2. **If external dependency**:
   ```bash
   # Check circuit breaker
   # Circuit should auto-open after 5 failures
   # Monitor recovery after 60s timeout
   ```

3. **If database issue**:
   ```bash
   # Check connection pool
   railway logs --service orchestration-prod | grep "connection"
   ```

**Post-Incident**: Create incident report, update runbook

---

### 2. High Latency (P1)

**Symptoms**: p95 >1000ms, slow user experience  
**Impact**: Degraded performance, potential timeouts

**Investigation**:

```bash
# Check CPU/memory
railway metrics orchestration-prod

# Check slow operations
docker logs orchestration-prod | grep -E "latency|slow"

# Profile live process
node --inspect dist/mcp/server.js
# Then connect chrome://inspect
```

**Resolution**:

1. **If memory leak**:
   ```bash
   # Restart service
   railway restart orchestration-prod
   
   # Investigate with heap snapshot
   node --inspect --expose-gc dist/mcp/server.js
   ```

2. **If CPU-bound**:
   ```bash
   # Scale horizontally
   railway scale orchestration-prod --replicas 3
   ```

3. **If rate limited**:
   ```bash
   # Check rate limit metrics
   curl /metrics | jq '.toolCalls'
   
   # Temporarily increase limits (if justified)
   # Edit src/security/rate-limiter.ts, deploy
   ```

---

### 3. Memory Leak (P1)

**Symptoms**: Gradual memory increase, eventual OOM crashes  
**Impact**: Service restarts, data loss

**Investigation**:

```bash
# Monitor memory over time
watch -n 5 'curl -s /metrics | jq ".memory.utilization"'

# Take heap snapshot
kill -USR2 <pid>  # Triggers heap dump if configured

# Analyze with Chrome DevTools
```

**Resolution**:

1. **Immediate**:
   ```bash
   # Restart to recover
   railway restart orchestration-prod
   ```

2. **Root cause**:
   ```bash
   # Check for:
   # - Unbounded caches (metrics.latencies array)
   # - Event listener leaks
   # - Unclosed connections
   
   # Run memory profiler locally
   pnpm perf:profile
   ```

3. **Fix and deploy**:
   ```bash
   # After identifying leak
   git commit -m "fix: memory leak in metrics collector"
   git push
   # CI/CD auto-deploys
   ```

---

### 4. Failed Health Checks (P0)

**Symptoms**: Kubernetes/Railway reports unhealthy, traffic stops  
**Impact**: Service unavailable

**Investigation**:

```bash
# Check service status
railway status orchestration-prod

# Check logs
railway logs orchestration-prod --tail 100

# Check dependencies
curl -I https://external-api.com/health
```

**Resolution**:

1. **If crashed**:
   ```bash
   # Railway auto-restarts, but check logs for crash reason
   railway logs orchestration-prod | grep -E "crash|fatal"
   ```

2. **If stuck**:
   ```bash
   # Force restart
   railway restart orchestration-prod
   ```

3. **If external dependency down**:
   ```bash
   # Circuit breaker should handle
   # Verify circuit is opening
   curl /metrics | jq '.circuitBreaker.state'
   # Should be "OPEN"
   ```

---

### 5. Rate Limit Exceeded (P2)

**Symptoms**: 429 errors, clients getting rate limited  
**Impact**: Degraded service for some users

**Investigation**:

```bash
# Check rate limit metrics
curl /metrics | jq '.toolCalls'

# Identify heavy users
railway logs orchestration-prod | grep "Rate limit exceeded" | \
  awk '{print $5}' | sort | uniq -c | sort -rn
```

**Resolution**:

1. **If legitimate traffic spike**:
   ```bash
   # Temporarily increase limits
   # Edit src/security/rate-limiter.ts
   # maxRequests: 100 → 200
   # Deploy via CI/CD
   ```

2. **If abuse**:
   ```bash
   # Block offending IPs/users
   # Add to rate limiter keyGenerator blacklist
   ```

3. **If incorrect limits**:
   ```bash
   # Review and adjust based on actual usage patterns
   # Update limits, add to CHANGELOG.md
   ```

## Deployment Procedures

### Standard Deployment

1. **Merge to main**: Triggers CI/CD
2. **Monitor CI**: https://github.com/flashfusion/orchestration/actions
3. **Wait for staging**: Auto-deploys to staging first
4. **Smoke test**: `curl https://staging.../health`
5. **Production deploy**: Auto-proceeds if staging passes
6. **Monitor 5min**: Auto-rollback if error rate >1%

### Emergency Rollback

```bash
# Via Railway CLI
railway rollback orchestration-prod

# Or via GitHub (redeploy previous commit)
git revert HEAD
git push  # Triggers CI/CD
```

### Manual Deployment (Break Glass)

```bash
# Build locally
pnpm build

# Deploy directly (use only in emergency)
railway up --service orchestration-prod --detach
```

## Monitoring & Alerts

### Alert Channels

- **P0**: PagerDuty → SMS + Call
- **P1**: Slack #incidents → Email
- **P2**: Slack #monitoring

### Alert Definitions

See `config/alerts.yml` for full definitions:

- **HighErrorRate**: >5% error rate → P0 → 5min acknowledge
- **HighLatency**: p95 >1000ms → P1 → 15min acknowledge
- **MemoryLeak**: >10MB growth/hour → P1
- **HealthCheckFailing**: 3 consecutive failures → P0

### Dashboards

- **Primary**: https://railway.app/project/orchestration
- **Metrics**: https://orchestration.../metrics (JSON)
- **Logs**: `railway logs orchestration-prod --follow`

## Maintenance Windows

**Schedule**: Sundays 2-4 AM UTC (lowest traffic)

**Process**:

1. Announce 48h ahead in #announcements
2. Enable maintenance mode (return 503)
3. Perform updates
4. Run smoke tests
5. Restore service
6. Monitor for 1 hour

## Backup & Recovery

**Data**: Library is stateless, no data backups needed  
**Config**: Stored in Git, auto-deployed  
**Secrets**: Stored in Railway/GitHub Secrets, rotated quarterly

**Recovery Time Objective (RTO)**: <15 minutes  
**Recovery Point Objective (RPO)**: 0 (stateless)

## Contacts

- **On-Call Engineer**: https://pagerduty.com/schedules/orchestration
- **Engineering Manager**: manager@flashfusion.com
- **CTO**: cto@flashfusion.com
- **Security**: security@flashfusion.com

## Runbook Maintenance

**Owner**: Platform Engineering Team  
**Review Cadence**: Quarterly or after major incidents  
**Last Updated**: 2025-02-04
