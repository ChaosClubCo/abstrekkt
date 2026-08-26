# Repository Tree

```text
PROJECT-EXPORT
├── agents
│   ├── definitions
│   │   ├── architect.json
│   │   ├── delivery.json
│   │   ├── product.json
│   │   ├── prompt.json
│   │   ├── research.json
│   │   ├── revenue.json
│   │   ├── security.json
│   │   └── strategist.json
│   ├── agent-catalog.md
│   ├── evaluator.md
│   └── router.config.json
├── analytics
│   ├── dashboards.md
│   ├── event-taxonomy.md
│   ├── metrics-dictionary.md
│   └── posthog-plan.md
├── api
│   ├── contracts.md
│   ├── errors.md
│   ├── openapi.yaml
│   └── webhooks.md
├── archive
│   └── decisions
│       ├── ADR-0001-legacy-context.md
│       ├── ADR-0002-legacy-context.md
│       ├── ADR-0003-legacy-context.md
│       ├── ADR-0004-legacy-context.md
│       ├── ADR-0005-legacy-context.md
│       ├── ADR-0006-legacy-context.md
│       ├── ADR-0007-legacy-context.md
│       ├── ADR-0008-legacy-context.md
│       ├── ADR-0009-legacy-context.md
│       ├── ADR-0010-legacy-context.md
│       ├── ADR-0011-legacy-context.md
│       └── ADR-0012-legacy-context.md
├── backend
│   ├── src
│   │   ├── agent-policy.test.ts
│   │   ├── agent-policy.ts
│   │   ├── errors.ts
│   │   ├── schemas.ts
│   │   └── webhooks.ts
│   ├── package.json
│   └── README.md
├── business
│   ├── business-plan.md
│   ├── client-engagement-playbook.md
│   ├── gtm.md
│   ├── ip-ownership-language.md
│   ├── market-segmentation.md
│   ├── pricing.md
│   ├── revenue-model.md
│   └── workshop-offers.md
├── compliance
│   ├── ai-governance-policy.md
│   ├── certification-disclaimer-policy.md
│   ├── compliance-register.md
│   ├── data-retention.md
│   └── vendor-risk.md
├── database
│   ├── migrations
│   │   └── 0001_initial.sql
│   ├── erd.md
│   ├── schema.sql
│   └── seed.sql
├── design-system
│   ├── brand-guidelines.md
│   ├── components.md
│   ├── motion-guidelines.md
│   ├── tailwind.config.ts
│   ├── tokens.css
│   └── tokens.json
├── devops
│   ├── branching-strategy.md
│   ├── local-dev.md
│   ├── observability.md
│   └── release-process.md
├── docs
│   ├── adr
│   │   ├── ADR-0001.md
│   │   ├── ADR-0002.md
│   │   ├── ADR-0003.md
│   │   ├── ADR-0004.md
│   │   ├── ADR-0005.md
│   │   ├── ADR-0006.md
│   │   ├── ADR-0007.md
│   │   ├── ADR-0008.md
│   │   ├── ADR-0009.md
│   │   ├── ADR-0010.md
│   │   ├── ADR-0011.md
│   │   └── ADR-0012.md
│   └── architecture
│       ├── ai-architecture.md
│       ├── data-architecture.md
│       ├── dependency-map.md
│       ├── deployment-topology.md
│       ├── infrastructure-architecture.md
│       ├── ownership-map.md
│       ├── repository-boundaries.md
│       ├── security-architecture.md
│       ├── solution-architecture.md
│       └── system-architecture.md
├── frontend
│   ├── src
│   │   ├── app
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components
│   │   │   ├── evidence-badge.tsx
│   │   │   └── metric-card.tsx
│   │   └── lib
│   │       ├── authz.test.ts
│   │       ├── authz.ts
│   │       ├── claims.ts
│   │       ├── env.ts
│   │       └── pricing.ts
│   ├── next.config.ts
│   ├── package.json
│   ├── README.md
│   └── tsconfig.json
├── infrastructure
│   ├── deployment
│   │   ├── cloudflare.md
│   │   ├── supabase.md
│   │   └── vercel.md
│   ├── github-actions
│   │   ├── ci.yml
│   │   └── release.yml
│   ├── docker-compose.yml
│   └── env.example
├── marketing
│   ├── case-study-template.md
│   ├── content-calendar.md
│   ├── outreach-drafts.md
│   ├── positioning.md
│   └── website-copy.md
├── operations
│   ├── runbooks
│   │   ├── agent-failure.md
│   │   ├── base44-migration.md
│   │   ├── deployment-rollback.md
│   │   └── incident-response.md
│   ├── schedules
│   │   └── revenue-scanner.md
│   ├── alerting.md
│   ├── migration-plan.md
│   ├── monitoring.md
│   ├── service-catalog.md
│   └── weekly-business-review.md
├── product
│   ├── acceptance-criteria.md
│   ├── feature-catalog.md
│   ├── journey-maps.md
│   ├── personas.md
│   ├── prd.md
│   ├── roadmap.md
│   └── user-flows.md
├── prompts
│   ├── client-audit-prompt.md
│   ├── flashfusion-master-operating-prompt.md
│   ├── revenue-scanner-prompt.md
│   ├── system-prompt-library.md
│   └── workshop-generation-prompt.md
├── repositories
│   ├── flashfusion-agents
│   │   └── README.md
│   ├── flashfusion-commerce
│   │   └── README.md
│   ├── flashfusion-consulting
│   │   └── README.md
│   ├── flashfusion-core
│   │   └── README.md
│   ├── flashfusion-education
│   │   └── README.md
│   ├── flashfusion-studio
│   │   └── README.md
│   ├── dependency-map.json
│   └── deployment-topology.md
├── research
│   ├── risk-scans
│   │   ├── ai-governance.md
│   │   ├── architecture.md
│   │   ├── business.md
│   │   ├── compliance.md
│   │   ├── operations.md
│   │   ├── organizational.md
│   │   ├── product.md
│   │   ├── scalability.md
│   │   ├── security.md
│   │   └── strategic.md
│   ├── assumptions-register.md
│   ├── PROJECT-KNOWLEDGE-GRAPH.json
│   ├── RISK-REGISTER.md
│   └── source-map.md
├── scripts
│   └── validate_export.py
├── security
│   ├── data-classification.md
│   ├── incident-response.md
│   ├── permissions.sql
│   ├── privacy-rules.md
│   ├── rbac-matrix.md
│   ├── roles.json
│   ├── secrets-management.md
│   ├── security-controls.md
│   └── threat-model.md
├── shared-packages
│   ├── authz
│   │   ├── src
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── README.md
│   ├── config
│   │   ├── src
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── README.md
│   ├── prompts
│   │   ├── src
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── README.md
│   ├── schemas
│   │   ├── src
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── README.md
│   ├── telemetry
│   │   ├── src
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── README.md
│   └── ui
│       ├── src
│       │   └── index.ts
│       ├── package.json
│       └── README.md
├── testing
│   ├── acceptance-tests.md
│   ├── ai-evals.md
│   ├── playwright.config.ts
│   ├── smoke-test.ts
│   ├── test-strategy.md
│   ├── validation-report.md
│   └── vitest.config.ts
├── ux
│   ├── accessibility.md
│   ├── information-architecture.md
│   ├── interaction-patterns.md
│   ├── screen-inventory.md
│   └── wireframes.md
├── workflows
│   ├── audit-delivery.md
│   ├── education-workshop.md
│   ├── lead-intake.md
│   ├── opportunity-scanner.md
│   └── release.md
├── DECISIONS-REGISTER.md
├── MANIFEST.json
├── OPEN-LOOPS-RESOLVED.md
├── PROJECT-KNOWLEDGE-GRAPH.json
├── README.md
├── RISK-REGISTER.md
├── SOURCE-LIMITATIONS.md
└── TARGET-STATE-BLUEPRINT.md
```
