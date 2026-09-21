# Cursor AI Prompt Chain System
## Full-Stack Web App Development — Quick Reference

## What This Is

A sequential 8-phase prompt chain that uses role-specific AI personas to build a production-ready full-stack web app inside Cursor IDE. Each phase produces structured outputs that feed the next phase.

## Phase Map

```
Phase 1: Architecture & Planning
  1A → Senior Solution Architect (stack + security + deployment design)
  1B → Tech Stack Validator (validation score, risk assessment)

Phase 2: Project Setup
  2A → Senior DevOps (folder structure, Docker, CI/CD, ESLint)
  2B → Senior Backend Architect (Express server, auth middleware, routing)

Phase 3: Database
  3A → Senior Database Architect (schema, indexes, migrations, seed data)
  3B → Senior Backend Developer (ORM models, repository pattern, transactions)

Phase 4: Auth & Security
  4A → Senior Security Engineer (JWT, bcrypt, rate limiting, OWASP Top 10)
  4B → Senior Full-Stack Developer (auth UI, token management, protected routes)

Phase 5: Core Features
  5A → Senior Frontend Architect (component architecture, state management)
  5B → Senior UX Engineer (animations, interactions, mobile, accessibility)

Phase 6: API & Business Logic
  6A → Senior API Developer (CRUD, filtering, file upload, OpenAPI)
  6B → Senior Integration Specialist (email, storage, Sentry, payments)

Phase 7: Testing & QA
  7A → Senior Test Engineer (unit, integration, E2E, 90%+ coverage)
  7B → Senior QA Automation Engineer (CI gates, load testing, security scanning)

Phase 8: Deployment
  8A → Senior DevOps Engineer (Docker prod, Kubernetes, SSL, CDN, monitoring)
  8B → Senior SRE (APM, log aggregation, alerting, incident response)
```

## Execution Protocol

1. Run prompts **in order** — 1A → 1B → 2A → 2B → ...
2. Paste outputs from prior prompts into subsequent prompts where marked `[Reference from Phase X]`
3. Validate each output before proceeding
4. Use the **Refinement Prompt** if output quality is insufficient
5. Use the **Integration Validation Prompt** after each phase
6. Run the **Final Quality Gate** before shipping

## Handoff Block (Recommended Addition — [G])

Add this to the end of every prompt to improve context carry:

```xml
<handoff>
  <decisions_made>[list of choices made this phase]</decisions_made>
  <assumptions>[what was assumed, not specified]</assumptions>
  <open_questions>[unresolved items for next phase]</open_questions>
  <next_prompt_context>[paste this section into the next prompt]</next_prompt_context>
</handoff>
```

## Stack Defaults

| Layer | Default |
|---|---|
| Frontend | React 18+ TypeScript |
| Backend | Express.js on Node.js 20 |
| Database | PostgreSQL (Prisma/Mongoose/Sequelize) |
| Auth | JWT + refresh token rotation |
| Infra | Docker + GitHub Actions |
| Testing | Jest + Playwright/Cypress |
| Security | OWASP Top 10 (2023), helmet.js, bcrypt |

## Final Quality Gate Checklist

- [ ] Security vulnerabilities addressed
- [ ] Performance requirements met
- [ ] Error handling comprehensive
- [ ] Logging and monitoring in place
- [ ] Documentation complete
- [ ] Tests passing >90% coverage
- [ ] Production deployment ready
- [ ] Scalability considerations addressed

## Known Gaps

- Data model is project-specific — fill in Phase 3 before running 3A
- Deployment target not specified — configure Kubernetes manifests or Docker Compose in Phase 8
- No built-in observability hook — pair with the AI Observability Stack (see OBSERVABILITY_README.md)
