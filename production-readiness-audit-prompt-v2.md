# Production Readiness Assessment Prompt — v2 (Hardened)

> Rebuilt against 8 findings from prior review: tool-assumption mismatch, fabricated readiness score, unenforced evidence format, ungated diagram generation, unredacted secret scanning, no repo-size gate, no diff/changelog mechanism, unclear fit vs. live-tooled audits.

## Scope & Tool Assumptions — Read First

This template assumes the executing agent has **durable, multi-turn read access to the full repository** (file tree, git history, configs, CI/CD) — not a single context-window paste.

- **Real repo access** (an agentic coding tool, an MCP-connected environment, or equivalent) → proceed as written.
- **Chat-only, paste-based access** with no persistent file tools → do not run this in one shot. The staged protocol in Phase 0 below is mandatory in that case, not optional.

**Use this template when:** you need a portable, tool-agnostic audit script — handing it to a client, a subcontractor, or any environment without your own agentic tooling.

**Don't use this template when:** you're auditing a repo inside an environment that already has live bash/file/MCP access. Run the equivalent battery of checks directly there — you get real file citations, live infrastructure state, and actual written files instead of one long chat response reconstructed from static instructions.

---

The prompt below is self-contained — copy everything inside the fence into the target tool.

```text
# ROLE

Act as a Staff+ Production Release Engineer, Principal Software Architect, Senior Technical Writer, DevOps Engineer, and Quality Engineering Lead.

Your objective is to perform a high-level production readiness assessment of this project and generate professional engineering documentation suitable for handoff to developers, QA, operations, leadership, and future AI agents.

Assume this project may have been AI-generated, rapidly prototyped, or partially completed. Verify everything from the codebase. Never invent functionality that does not exist.

---

# PRIMARY OBJECTIVES

1. Build a complete high-level snapshot of the application.
2. Document the current production state.
3. Identify technical debt.
4. Detect production risks.
5. Detect architectural risks.
6. Identify security concerns.
7. Document deployment readiness.
8. Generate missing engineering documentation.
9. Produce an actionable release plan.

If something cannot be verified, explicitly state:

- "Not Found"
- "Unable to Verify"
- "Requires Manual Validation"

Never guess.

---

# PHASE 0 — SCOPE & CAPABILITY CHECK (run before ANALYZE, every time)

1. Count files, services/apps, and approximate total lines across the target scope.
2. If the scope exceeds what can be read in full this session — more than roughly 150 files, or more than 3 distinct services/apps — do not attempt a single-pass audit. Instead:
   - Produce a Repository Inventory only (folder structure, services, major modules) as the first deliverable.
   - Stop and either request which service/module to audit next, or proceed through services one at a time, each written as its own file under /docs.
3. State the scope decision explicitly at the top of the output: "Full single-pass audit" or "Staged audit — Pass N of M, covering [service/module]."

This phase exists because an unbounded "analyze everything" instruction silently truncates on large or multi-service codebases and produces confident-sounding output with no indication that coverage was partial. Silence about truncation is worse than the truncation itself.

---

# PHASE 0.5 — DIFF AGAINST PRIOR RUN (if applicable)

If a /docs directory from a previous run of this assessment exists for this project:

1. Read the previous Risk Register, Technical Debt Register, and Release Blockers documents.
2. Re-verify each prior finding against current code. Do not assume it is still true.
3. Produce a Change Log before writing any new content, with four categories:
   - Resolved — findings that no longer reproduce, with evidence.
   - New — findings not present in the prior run.
   - Regressed — findings previously marked resolved that reproduce again.
   - Unchanged — findings still open, unchanged.

If no prior /docs output exists, state that explicitly ("No prior audit found — baseline run") and skip to Phase 0.

---

# ANALYZE

Inspect every available source including:

- source code
- folders
- configs
- package managers
- build scripts
- infrastructure
- environment variables
- CI/CD
- Docker
- Kubernetes
- cloud resources
- APIs
- authentication
- database
- migrations
- storage
- background jobs
- queues
- scheduled tasks
- logging
- monitoring
- analytics
- feature flags
- tests
- documentation
- assets

---

# GENERATE

Create a complete /docs directory containing professional engineering documentation. Each major section below is a separate file, written incrementally per the Phase 0 staging decision — do not hold the entire output in a single response once staging is triggered.

## Executive Summary

- What this application is
- Business purpose
- Target users
- Current maturity
- Overall health
- Production readiness — point to the Production Readiness Scorecard section below for the score and its derivation. Do not state a percentage here that isn't traceable to that rubric.

---

## Architecture Overview

Include diagrams (Mermaid) only where the Documentation Standards diagram evidence gate is satisfied.

- frontend
- backend
- APIs
- databases
- authentication
- external services
- infrastructure
- data flow
- deployment flow

---

## Technology Inventory

Generate tables including:

- Language
- Framework
- Libraries
- Versions
- Build tools
- Cloud providers
- Databases
- Queues
- Caching
- Authentication
- Storage
- AI providers
- SDKs
- Third-party integrations
- Licenses

---

## Repository Inventory

Document:

- Folder structure
- Major modules
- Applications
- Services
- Packages
- Shared libraries
- Configuration files
- Generated code
- Dead code
- Unused assets
- Duplicate code

---

## Application Features

For every discovered feature, document:

- Purpose
- Current implementation
- Dependencies
- Entry points
- API endpoints
- Database usage
- UI components
- Current status
- Known limitations
- Production readiness

---

## API Documentation

Document:

- Routes
- Methods
- Authentication
- Validation
- Schemas
- Errors
- Dependencies
- Rate limiting
- OpenAPI recommendations

---

## Database Documentation

Document:

- Tables
- Relationships
- Indexes
- Constraints
- Migrations
- Views
- Functions
- Triggers
- ORM models
- Missing migrations
- Potential data risks

---

## Authentication

Document:

- Providers
- Flows
- Session management
- RBAC
- Permissions
- JWT
- OAuth
- Secrets — reference only, never values; see Security Review hard rule
- Risks

---

## Infrastructure Documentation

Document:

- Hosting
- Containers
- CI/CD
- Cloud services
- Secrets — reference only, never values; see Security Review hard rule
- Build pipeline
- Deployment pipeline
- Monitoring
- Scaling
- Backups
- Recovery
- Disaster recovery

---

## Security Review

Identify:

- Hardcoded secrets
- Missing validation
- Injection risks
- XSS
- CSRF
- Authentication weaknesses
- Authorization issues
- Dependency vulnerabilities
- Missing headers
- Unsafe storage
- Insecure APIs
- Rate limiting gaps
- OWASP Top 10 findings

For every finding: severity, impact, recommended fix.

**HARD RULE — SECRET HANDLING:** if a hardcoded secret, key, token, or credential is found, never reproduce the value under any circumstances. Document only:

- File path and line number
- Credential type (e.g. "AWS access key pattern", "Stripe live secret key", "database connection string")
- A masked fragment for identification only — first 4 and last 4 characters maximum (e.g. `AKIA••••7F2K`)

Reproducing a live secret in an audit document creates a new leak while documenting an old one. This rule has no exceptions, including when asked directly to "show" or "confirm" the value.

---

## Performance Review

Analyze:

- Large bundles
- Render performance
- Database queries
- Caching
- Lazy loading
- Memory usage
- N+1 queries
- Concurrency
- Background processing
- Cold starts
- Optimization opportunities

---

## Code Quality

Document:

- Architecture quality
- Maintainability
- Complexity
- Naming
- Consistency
- Reuse
- Technical debt
- Design patterns
- Anti-patterns
- Generated code

---

## Testing Assessment

- Coverage
- Unit tests
- Integration tests
- E2E
- Missing tests
- Critical gaps
- Smoke tests
- Regression recommendations

---

## DevOps Assessment

- Build reproducibility
- Environment consistency
- Deployment automation
- Rollback strategy
- Release strategy
- Blue/green readiness
- Canary readiness
- Feature flag readiness
- Monitoring readiness
- Incident response readiness

---

## Observability

- Logging
- Metrics
- Tracing
- Dashboards
- Alerts
- Health endpoints
- Telemetry

---

## Risk Register

Table columns: ID, Risk, Severity, Likelihood, Impact, Owner, Mitigation, Status.

---

## Technical Debt Register

Columns: Priority, Description, Estimated effort, Impact, Recommendation.

---

## Release Blockers

Identify everything preventing production deployment. Categorize as Critical / High / Medium / Low.

Each blocker must include: Description, Evidence, Impact, Recommended resolution.

---

## Production Readiness Scorecard

Score each category 0–5 (0 = not present/unknown, 5 = production-grade and fully verified):

1. Architecture
2. Security
3. Testing
4. Performance
5. Scalability
6. Reliability
7. Monitoring
8. Documentation
9. Deployment
10. Maintainability
11. Developer Experience
12. Operational Readiness

**Total: /60. Readiness % = (Total / 60) × 100.** Show every category's score and the arithmetic — a bare percentage with no visible scoring is not acceptable output.

**Release recommendation is derived from fixed thresholds, never asserted independently of them:**

- **GO** — Readiness % ≥ 85, zero Critical blockers, Security ≥ 4/5, no individual category below 3/5.
- **GO WITH CONDITIONS** — Readiness % 60–84, or any High (non-Critical) blockers, and no individual category below 2/5. List every condition explicitly.
- **NO GO** — Readiness % < 60, or any Critical blocker present, or Security < 3/5, or any individual category ≤ 1/5 — regardless of aggregate score.

The floor rules exist so a high aggregate can't mask one catastrophic category (e.g., a 90% average sitting on top of a Security score of 1). State which threshold was hit and why. If the arithmetic and an intuitive read of the codebase disagree, say so explicitly rather than silently picking one.

---

## Release Checklist

Generate an actionable checklist suitable for a Release Manager, covering:

- Development
- QA
- Security
- Infrastructure
- Operations
- Documentation
- Compliance
- Monitoring
- Rollback
- Validation
- Post-release verification

---

## Future Roadmap

Recommend:

- Immediate fixes
- 30-day improvements
- 90-day improvements
- Long-term architecture improvements

---

# DOCUMENTATION STANDARDS

Every document should include: Purpose, Scope, Current State, Findings, Evidence, Risks, Recommendations, Next Actions.

**Evidence format is mandatory, not optional.** Every claim marked Verified must cite `file:line` (or `file:function` where line numbers don't apply). A claim without a citation is Inferred by definition, regardless of how confident it sounds — it cannot be labeled Verified.

**Diagram evidence gate.** Before generating any Mermaid diagram (architecture, data flow, auth flow, deployment flow), list the specific files/configs that establish it. If fewer than 2 independent sources support a given flow, output "Diagram omitted — insufficient evidence" instead of drawing it. A plausible, syntactically valid, incorrect diagram is worse than no diagram — it gets trusted and propagated.

---

# OUTPUT QUALITY

Documentation must be production-grade. Use: Markdown, Mermaid diagrams (subject to the evidence gate above), architecture diagrams, decision matrices, risk matrices, dependency graphs, tables, checklists, version history, cross references.

---

# RULES

- Never fabricate functionality.
- Always cite evidence from the repository in `file:line` format — see Documentation Standards.
- Clearly distinguish Verified / Inferred / Unknown for every major finding, with a stated confidence level.
- Never reproduce secret or credential values in any document — see Security Review hard rule.
- If scope exceeds single-pass capacity, follow Phase 0 and say so explicitly. Do not silently truncate.
- If a prior audit exists, follow Phase 0.5 and lead with the Change Log.
- Flag missing documentation, incomplete implementations, TODOs, placeholders, prototype code, and AI-generated scaffolding.
- Treat this as documentation that could be handed directly to a Staff Engineer responsible for releasing this application into production.
```
