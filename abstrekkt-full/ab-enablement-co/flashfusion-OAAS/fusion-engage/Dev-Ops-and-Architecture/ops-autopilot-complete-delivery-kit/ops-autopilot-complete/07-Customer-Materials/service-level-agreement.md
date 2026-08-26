# Service Level Agreement (SLA)

> **Audience:** CUST, SALES | **Phase:** Beta

---

## Service Availability

| Tier | Availability Target | Measurement |
|------|-------------------|-------------|
| Starter | 99.0% monthly | Control plane API uptime |
| Growth | 99.5% monthly | Control plane + workflow execution |
| Enterprise | 99.9% monthly | End-to-end including approval engine |

**Exclusions:** Scheduled maintenance (48hr advance notice), customer n8n instance failures, third-party connector outages (Azure AD, Okta, Slack, Jira), force majeure.

## Support Response Times

| Severity | Definition | Starter | Growth | Enterprise |
|----------|-----------|---------|--------|------------|
| Critical | Service unusable, data at risk | 4 hours | 1 hour | 15 min |
| High | Feature broken, workaround unavailable | 8 hours | 4 hours | 1 hour |
| Medium | Feature degraded, workaround available | 24 hours | 8 hours | 4 hours |
| Low | Question, feature request, cosmetic | 48 hours | 24 hours | 8 hours |

## Support Channels

| Channel | Starter | Growth | Enterprise |
|---------|---------|--------|------------|
| Email | ✅ | ✅ | ✅ |
| Slack channel | ❌ | ✅ | ✅ |
| Phone | ❌ | ❌ | ✅ |
| Dedicated engineer | ❌ | ❌ | ✅ |

## Service Credits

If monthly availability falls below target:

| Availability | Credit |
|-------------|--------|
| 99.0–99.5% (Growth/Enterprise) | 10% of monthly fee |
| 98.0–99.0% | 25% of monthly fee |
| 95.0–98.0% | 50% of monthly fee |
| <95.0% | 100% of monthly fee |

Credits applied to next invoice. Must be claimed within 30 days.

## Responsibilities

**Intinc provides:** Control plane operation, workflow maintenance, connector updates, security patches, monitoring, incident response.

**Customer provides:** n8n instance hosting and maintenance, network connectivity, service account credentials, timely approval decisions, reporting issues via support channels.
