# Risk Register

| ID | Domain | Description | Likelihood | Impact | Mitigation | Owner | Artifact |
|---|---|---|---|---|---|---|---|
| RSK-001 | Strategic | Product becomes too broad | Medium | High | PRD scope gates | Product Lead | product/prd.md |
| RSK-002 | Architecture | Graph model underfits complex relationships | Medium | Medium | Graph export boundary | Architecture Lead | docs/architecture/data-architecture.md |
| RSK-003 | Product | Users distrust generated artifacts | High | High | Provenance and validation | AI Lead | prompts/evaluation-rubrics.md |
| RSK-004 | Business | Market sees generic summarizer | Medium | High | Position on repository export | GTM Lead | marketing/positioning.md |
| RSK-005 | Security | Cross-tenant data leak | Low | Critical | RLS, authz tests, audit | Security Lead | security/threat-model.md |
| RSK-006 | Operations | Long jobs fail mid-export | Medium | High | Idempotent durable jobs | Platform Lead | workflows/idempotency.md |
| RSK-007 | Scalability | Model costs spike | High | High | Budgets, caching, routing | AI Lead | operations/alerting.md |
| RSK-008 | AI Governance | Prompt injection corrupts artifacts | High | High | Untrusted boundary, output validation | AI Safety Lead | security/ai-safety-policy.md |
| RSK-009 | Compliance | Sources include regulated data | Medium | High | Sensitivity labels, retention | Compliance Lead | compliance/dpia.md |
| RSK-010 | Organizational | No owner after export | Medium | Medium | CODEOWNERS and ownership map | Engineering Lead | CODEOWNERS |
| RSK-011 | Security | Secrets leak into model prompts | Medium | Critical | Secret scanning/redaction | Security Lead | security/secrets-management.md |
| RSK-012 | Architecture | LLM provider lock-in | Medium | Medium | Provider abstraction | AI Lead | adr/ADR-0004-ai-provider-abstraction.md |
| RSK-013 | Operations | Validation false positives block users | Medium | Medium | Severity taxonomy | Ops Lead | validation/VALIDATION-REPORT.md |
| RSK-014 | Business | Enterprise requires private deployment | Medium | High | Container-first architecture | Business Lead | business/pricing.md |
| RSK-015 | Product | Corrections not fed into graph | Medium | Medium | Review/update workflow | Product Lead | product/user-flows.md |
| RSK-016 | Security | Generated dependencies unsafe | Medium | High | Dependency scans and CI | Security Lead | devops/github-actions/ci.yml |
| RSK-017 | Compliance | Deletion misses exports | Low | High | Retention/export revocation | Compliance Lead | compliance/data-retention.md |
| RSK-018 | Scalability | Large imports bottleneck workers | Medium | Medium | Chunking and queue isolation | Platform Lead | operations/monitoring.md |
| RSK-019 | AI Governance | Eval data not representative | Medium | Medium | Golden fixtures | AI Lead | prompts/evaluation-rubrics.md |
| RSK-020 | Strategic | Brand changes when new assets found | Medium | Low | Name migration ADR path | Product Lead | docs/migration/legacy-name-migration.md |
