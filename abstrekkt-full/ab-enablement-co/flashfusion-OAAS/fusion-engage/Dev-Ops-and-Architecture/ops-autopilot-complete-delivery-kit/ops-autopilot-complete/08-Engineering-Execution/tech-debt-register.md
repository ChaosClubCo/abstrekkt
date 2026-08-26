# Tech Debt Register

> **Audience:** ENG, LEAD | **Phase:** Beta

---

## Known Shortcuts (MVP)

| # | Debt | Severity | Incurred | Cleanup Plan | Target |
|---|------|----------|----------|-------------|--------|
| TD-1 | Keyword classifier instead of ML for ticket routing | Low | Week 4 | Replace with fine-tuned classifier when >1000 tickets trained | GA |
| TD-2 | Single Redis instance per customer (no clustering) | Medium | Week 1 | Implement Redis Cluster for Enterprise tier | Beta W8 |
| TD-3 | Manual n8n provisioning (Docker Compose) | Medium | Week 3 | Build automated provisioning API (Terraform or Pulumi) | GA |
| TD-4 | No database partitioning (audit_log) | Low | Week 2 | Partition by month when >10M rows | GA |
| TD-5 | Hard-coded connector schemas (not registry-driven) | Medium | Week 3 | Move to dynamic connector registry with versioning | Beta W12 |
| TD-6 | Approval UI in Slack only (Teams deferred) | Medium | Week 2 | Build Teams Adaptive Card approval flow | Beta W6 |
| TD-7 | No automated compliance report generation | Low | Week 2 | Build monthly auto-report cron job | GA |
| TD-8 | Error sanitization regex-based (not ML) | Low | Week 2 | Add ML-based PII detection as secondary layer | GA+ |
| TD-9 | No webhook retry from control plane → n8n | Medium | Week 1 | Implement webhook retry with exponential backoff | Beta W5 |
| TD-10 | PostHog analytics not fully integrated | Low | Week 1 | Complete event tracking for all user actions | Beta W8 |

---

## Cleanup Priority

**Phase 1 (Beta W5–8):** TD-2, TD-6, TD-9, TD-10
**Phase 2 (Beta W9–12):** TD-5
**Phase 3 (GA):** TD-1, TD-3, TD-4, TD-7
**Phase 4 (Post-GA):** TD-8

## Debt Budget

Allocate 20% of engineering time to tech debt cleanup during beta. Track ratio: features vs debt in sprint planning.
