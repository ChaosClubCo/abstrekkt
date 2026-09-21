# RISK REGISTER

| ID | Risk Description | Likelihood | Impact | Mitigation | Owner | Recommended Artifact |
|---|---|---|---|---|---|---|
| R-001 | Revenue focus diluted by speculative SaaS work | Medium | High | Use consulting-led productization and weekly action-yield review. | Revenue Owner | business/revenue-model.md |
| R-002 | Repository fragmentation causes lost work | High | High | Canonical repo boundaries, archives, validation script, migration plan. | Architecture Owner | docs/architecture/repository-boundaries.md |
| R-003 | Unsupported claims damage credibility | Medium | High | Claims review, evidence tags, certification policy. | Compliance Owner | compliance/certification-disclaimer-policy.md |
| R-004 | Paid work leaks into free proof-of-value | High | Medium | Proof-of-value scope and pricing guard. | Revenue Owner | business/pricing.md |
| R-005 | Client IP expectations conflict with productization | Medium | High | Standard IP ownership language. | Delivery Owner | business/ip-ownership-language.md |
| R-006 | RLS misconfiguration exposes tenant data | Medium | Critical | RLS-first schema and access tests. | Security Owner | database/schema.sql |
| R-007 | Agent prompt injection leaks context | Medium | High | Scoped retrieval, approved chunks, human review. | AI Owner | compliance/ai-governance-policy.md |
| R-008 | Agent cost overruns | Medium | Medium | Budget policy, telemetry, approval above threshold. | AI Owner | agents/router.config.json |
| R-009 | Base44 repo binding breaks production flow | Medium | Medium | Treat Base44 as generator; PR into canonical repo. | Architecture Owner | operations/runbooks/base44-migration.md |
| R-010 | Notion dependency expires or fragments source of truth | Medium | Medium | Remove Notion from canonical architecture. | Operations Owner | TARGET-STATE-BLUEPRINT.md |
| R-011 | No direct uploaded corpus available in current reconstruction | High | Medium | Source limitation file and evidence tags. | Project Owner | SOURCE-LIMITATIONS.md |
| R-012 | Security incidents from unauthenticated endpoints | Medium | Critical | No unauthenticated mutation/execution endpoints; threat model. | Security Owner | security/threat-model.md |
| R-013 | Weak workshop positioning creates low-value leads | Medium | Medium | Offer ladder and workshop follow-up path. | Revenue Owner | business/workshop-offers.md |
| R-014 | Over-custom consulting prevents reusable product assets | High | High | Productization loop and artifact extraction. | Product Owner | business/client-engagement-playbook.md |
| R-015 | Observability delayed until failures occur | Medium | High | Instrument event taxonomy and staged tools. | DevOps Owner | analytics/event-taxonomy.md |
| R-016 | Data deletion conflicts with audit provenance | Low | Medium | Retention policy and provenance records. | Compliance Owner | compliance/data-retention.md |
| R-017 | Credential date becomes stale | Medium | Medium | Manual credential verification gate after July 20, 2026. | Compliance Owner | compliance/certification-disclaimer-policy.md |
| R-018 | AI outputs use jargon instead of client language | Medium | Medium | Delivery prompts enforce domain language. | Delivery Owner | prompts/client-audit-prompt.md |
| R-019 | Schedules create noise rather than action | High | Medium | Pause rule and weekly business review. | Operations Owner | operations/weekly-business-review.md |
| R-020 | Raw file storage remains unrecoverable after loss events | Medium | High | Metadata/provenance memory and non-destructive indexing. | Data Owner | docs/architecture/data-architecture.md |
| R-021 | Strategic risk: insufficient maturity controls for stage 1 | Medium | Medium | Use generated strategic artifact controls, review cadence, and owner accountability. | Strategic Owner | research/risk-scans/strategic.md |
| R-022 | Architecture risk: insufficient maturity controls for stage 2 | Medium | Medium | Use generated architecture artifact controls, review cadence, and owner accountability. | Architecture Owner | research/risk-scans/architecture.md |
| R-023 | Product risk: insufficient maturity controls for stage 3 | Medium | Medium | Use generated product artifact controls, review cadence, and owner accountability. | Product Owner | research/risk-scans/product.md |
| R-024 | Business risk: insufficient maturity controls for stage 4 | Medium | Medium | Use generated business artifact controls, review cadence, and owner accountability. | Business Owner | research/risk-scans/business.md |
| R-025 | Security risk: insufficient maturity controls for stage 5 | Medium | Medium | Use generated security artifact controls, review cadence, and owner accountability. | Security Owner | research/risk-scans/security.md |
| R-026 | Operations risk: insufficient maturity controls for stage 6 | Medium | Medium | Use generated operations artifact controls, review cadence, and owner accountability. | Operations Owner | research/risk-scans/operations.md |
| R-027 | Scalability risk: insufficient maturity controls for stage 7 | Medium | Medium | Use generated scalability artifact controls, review cadence, and owner accountability. | Scalability Owner | research/risk-scans/scalability.md |
| R-028 | AI Governance risk: insufficient maturity controls for stage 8 | Medium | Medium | Use generated ai governance artifact controls, review cadence, and owner accountability. | AI Governance Owner | research/risk-scans/ai-governance.md |
| R-029 | Compliance risk: insufficient maturity controls for stage 9 | Medium | Medium | Use generated compliance artifact controls, review cadence, and owner accountability. | Compliance Owner | research/risk-scans/compliance.md |
| R-030 | Organizational risk: insufficient maturity controls for stage 10 | Medium | Medium | Use generated organizational artifact controls, review cadence, and owner accountability. | Organizational Owner | research/risk-scans/organizational.md |
| R-031 | Strategic risk: insufficient maturity controls for stage 11 | Medium | Medium | Use generated strategic artifact controls, review cadence, and owner accountability. | Strategic Owner | research/risk-scans/strategic.md |
| R-032 | Architecture risk: insufficient maturity controls for stage 12 | Medium | Medium | Use generated architecture artifact controls, review cadence, and owner accountability. | Architecture Owner | research/risk-scans/architecture.md |
| R-033 | Product risk: insufficient maturity controls for stage 13 | Medium | Medium | Use generated product artifact controls, review cadence, and owner accountability. | Product Owner | research/risk-scans/product.md |
| R-034 | Business risk: insufficient maturity controls for stage 14 | Medium | Medium | Use generated business artifact controls, review cadence, and owner accountability. | Business Owner | research/risk-scans/business.md |
| R-035 | Security risk: insufficient maturity controls for stage 15 | Medium | Medium | Use generated security artifact controls, review cadence, and owner accountability. | Security Owner | research/risk-scans/security.md |
| R-036 | Operations risk: insufficient maturity controls for stage 16 | Medium | Medium | Use generated operations artifact controls, review cadence, and owner accountability. | Operations Owner | research/risk-scans/operations.md |
| R-037 | Scalability risk: insufficient maturity controls for stage 17 | Medium | Medium | Use generated scalability artifact controls, review cadence, and owner accountability. | Scalability Owner | research/risk-scans/scalability.md |
| R-038 | AI Governance risk: insufficient maturity controls for stage 18 | Medium | Medium | Use generated ai governance artifact controls, review cadence, and owner accountability. | AI Governance Owner | research/risk-scans/ai-governance.md |
| R-039 | Compliance risk: insufficient maturity controls for stage 19 | Medium | Medium | Use generated compliance artifact controls, review cadence, and owner accountability. | Compliance Owner | research/risk-scans/compliance.md |
| R-040 | Organizational risk: insufficient maturity controls for stage 20 | Medium | Medium | Use generated organizational artifact controls, review cadence, and owner accountability. | Organizational Owner | research/risk-scans/organizational.md |
| R-041 | Strategic risk: insufficient maturity controls for stage 21 | Medium | Medium | Use generated strategic artifact controls, review cadence, and owner accountability. | Strategic Owner | research/risk-scans/strategic.md |
| R-042 | Architecture risk: insufficient maturity controls for stage 22 | Medium | Medium | Use generated architecture artifact controls, review cadence, and owner accountability. | Architecture Owner | research/risk-scans/architecture.md |
| R-043 | Product risk: insufficient maturity controls for stage 23 | Medium | Medium | Use generated product artifact controls, review cadence, and owner accountability. | Product Owner | research/risk-scans/product.md |
| R-044 | Business risk: insufficient maturity controls for stage 24 | Medium | Medium | Use generated business artifact controls, review cadence, and owner accountability. | Business Owner | research/risk-scans/business.md |
| R-045 | Security risk: insufficient maturity controls for stage 25 | Medium | Medium | Use generated security artifact controls, review cadence, and owner accountability. | Security Owner | research/risk-scans/security.md |
| R-046 | Operations risk: insufficient maturity controls for stage 26 | Medium | Medium | Use generated operations artifact controls, review cadence, and owner accountability. | Operations Owner | research/risk-scans/operations.md |
| R-047 | Scalability risk: insufficient maturity controls for stage 27 | Medium | Medium | Use generated scalability artifact controls, review cadence, and owner accountability. | Scalability Owner | research/risk-scans/scalability.md |
| R-048 | AI Governance risk: insufficient maturity controls for stage 28 | Medium | Medium | Use generated ai governance artifact controls, review cadence, and owner accountability. | AI Governance Owner | research/risk-scans/ai-governance.md |
| R-049 | Compliance risk: insufficient maturity controls for stage 29 | Medium | Medium | Use generated compliance artifact controls, review cadence, and owner accountability. | Compliance Owner | research/risk-scans/compliance.md |
| R-050 | Organizational risk: insufficient maturity controls for stage 30 | Medium | Medium | Use generated organizational artifact controls, review cadence, and owner accountability. | Organizational Owner | research/risk-scans/organizational.md |
