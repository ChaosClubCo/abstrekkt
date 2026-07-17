# Capacity Planning — Ops Autopilot

> **Audience:** ENG, LEAD | **Phase:** Beta (Week 5)

---

## n8n Instance Sizing

### Per-Customer Resource Requirements

| Tier | CPU | Memory | Disk | Redis | Max Concurrent |
|------|-----|--------|------|-------|----------------|
| Starter | 1 vCPU | 2GB | 10GB | 256MB | 10 workflows |
| Growth | 2 vCPU | 4GB | 20GB | 1GB | 50 workflows |
| Enterprise | 4+ vCPU | 8GB+ | 50GB+ | 4GB cluster | 200 workflows |

### Scaling Thresholds

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| CPU usage | >70% sustained 15m | >90% sustained 5m | Scale up vCPU |
| Memory usage | >75% | >90% | Scale memory or restart |
| Disk usage | >80% | >95% | Clear logs, expand disk |
| Redis memory | >70% | >85% | Evict + scale |
| Queue depth | >50 | >200 | Investigate bottleneck |
| Concurrent runs | >80% of limit | >95% of limit | Upgrade tier or optimize |

---

## Control Plane Sizing

### Supabase (Database)

| Customers | Plan | Connections | Storage | Cost |
|-----------|------|-------------|---------|------|
| 1–10 | Pro ($25/mo) | 60 | 8GB | $25/mo |
| 10–50 | Pro | 60 (with pooling) | 20GB | $25/mo |
| 50–200 | Team ($599/mo) | 200 | 100GB | $599/mo |
| 200+ | Enterprise | Custom | Custom | Negotiate |

**Connection pooling:** PgBouncer (included in Supabase). Max 60 direct + 200 pooled connections on Pro.

**Query optimization triggers:**
- Any query >500ms in production
- Any table >1M rows: add indexes, consider partitioning
- audit_log >10M rows: partition by month

### Vercel (API)

| Customers | Plan | Functions | Bandwidth | Cost |
|-----------|------|-----------|-----------|------|
| 1–50 | Pro ($20/mo) | 1000/day | 1TB | $20/mo |
| 50–200 | Pro | May need Enterprise | — | $20–100/mo |
| 200+ | Enterprise | Custom | Custom | Negotiate |

Vercel auto-scales serverless functions. Main concern is cold start latency (~200ms) and concurrent execution limits.

---

## Growth Projections

| Phase | Customers | Runs/Day | DB Rows/Month | Storage Growth |
|-------|-----------|----------|---------------|----------------|
| MVP (W4) | 2 | 50 | 7,500 | 5MB |
| Closed Beta (W8) | 10 | 500 | 75,000 | 50MB |
| Open Beta (W12) | 30 | 2,000 | 300,000 | 200MB |
| GA (W17) | 100 | 10,000 | 1,500,000 | 1GB |
| Y1 End | 500 | 50,000 | 7,500,000 | 5GB |

**Assumptions:** Average 5 steps per run, 3 audit events per step, 1KB per row.

---

## Cost Projections (Infrastructure Only)

| Phase | Vercel | Supabase | Redis (total) | Monitoring | Total |
|-------|--------|----------|---------------|------------|-------|
| MVP | $20 | $25 | $10 | $0 | $55 |
| Closed Beta | $20 | $25 | $100 | $50 | $195 |
| Open Beta | $50 | $75 | $300 | $100 | $525 |
| GA | $100 | $200 | $1,000 | $200 | $1,500 |
| Y1 End | $200 | $599 | $5,000 | $500 | $6,299 |

**Note:** Customer n8n hosting is customer-paid. Redis cost scales linearly with customer count ($10/mo Starter, $20/mo Growth, $50/mo Enterprise per customer).

---

## Load Testing Plan

| Test | Target | Tool | When |
|------|--------|------|------|
| Single workflow throughput | 100 runs in 10 min | k6 / Artillery | Week 4 |
| Concurrent workflows | 50 simultaneous | k6 | Week 8 |
| Approval engine stress | 100 pending approvals | Custom script | Week 8 |
| Database load | 1M rows, complex queries <500ms | pgbench | Week 12 |
| Full system load | 1000 concurrent (GA target) | k6 + custom | Week 15 |

## Scaling Decision Tree

```
Performance degrading?
├── API latency >5s P95?
│   ├── DB slow? → Scale Supabase, add indexes
│   └── Function cold starts? → Enable Vercel edge functions
├── Workflows queuing?
│   ├── n8n overloaded? → Scale customer instance
│   └── Redis full? → Scale Redis, evict expired
├── Connector errors?
│   ├── Rate limited? → Add backoff, stagger requests
│   └── Auth failing? → Check secret rotation
└── Storage growing fast?
    ├── Audit log? → Partition by month, archive old
    └── Redis? → Evict completed jobs, tune TTL
```
