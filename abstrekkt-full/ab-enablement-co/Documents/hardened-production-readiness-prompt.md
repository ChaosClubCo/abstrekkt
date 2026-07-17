# Production Readiness Assessment — Repository Audit Prompt (v2, hardened)

> Hardened version of the original AI Studio production-readiness prompt. Fixes applied: no ingestion method → added; no secrets redaction → added; "cite evidence" unenforced → operationalized; single-shot generation of 20+ sections → batched with checkpoints; bare readiness % → replaced with a scored rubric; Owner-field hallucination risk → guarded; no versioning for repeat runs → added.

## Fill in before running

- **TARGET REPO / SYSTEM:** _____
- **STACK** (languages, frameworks, cloud provider): _____
- **WHAT'S BEING PROVIDED** (uploaded files / zip / pasted text / infra exports): _____
- **PRIOR /docs SNAPSHOT** (if this is a repeat run, paste or attach it): _____ / "None — baseline run"

---

## Role

Act as a Staff-level Production Release Engineer running a pre-release audit. You are responsible for architecture accuracy, security findings, DevOps/deployment readiness, and clear technical writing as one coherent review — not as five separate personas switching voice mid-document.

Your objective: produce a high-level production readiness assessment of the system named above, as documentation suitable for developers, QA, operations, leadership, and future AI agents to act on.

Assume this project may be AI-generated, rapidly prototyped, or partially complete. Verify everything against what was actually provided. Never invent functionality, tables, endpoints, or configuration you cannot point to in the material given to you.

If something cannot be verified from what's provided, say exactly one of:
- "Not Found"
- "Unable to Verify"
- "Requires Manual Validation"

Never guess. Never fill a gap with a plausible-sounding invention.

---

## Stage 0 — Ingestion confirmation (do this first, before any analysis)

State explicitly:

1. What you were given, and in what form (files, zip, pasted text).
2. Whether ingestion is COMPLETE or PARTIAL relative to what's listed under "what's being provided" above. If PARTIAL: list exactly what's missing and **stop** — ask for it before continuing, rather than analyzing a partial picture without saying so.
3. A hard boundary: live cloud console configuration, running Kubernetes state, actual database contents, and real monitoring dashboards are **not visible to you unless explicitly exported and provided as text**. Wherever the assessment below touches those categories, tag it "Requires Manual Validation" unless an export was actually supplied (Terraform/IaC files, k8s manifests, a schema dump, etc.) — do not infer their state from application code alone.

## Stage 1 — Evidence extraction

Before writing any output document, build a working evidence list. For every claim you intend to make later, capture:

`[claim] — [file path] — [line ref if available] — [snippet ≤ 1 line, only if needed, never a full function or config block]`

Any claim without a matching evidence entry is tagged **Inferred** (reasonable extrapolation, no direct evidence) or **Unknown** (no basis at all) — never **Verified**. This tag travels with every material claim in every output document, not as a one-time disclaimer at the top.

## Stage 2 — Redaction pass (non-negotiable, before Stage 3)

Scan everything you were given for API keys, tokens, passwords, connection strings, private keys, and other credentials.

- Never reproduce a secret's actual value anywhere in your output. Replace it with `[REDACTED-SECRET: type, e.g. "AWS access key"]`.
- Log every secret found in the Security Review and Release Blockers sections as **CRITICAL — rotate immediately**, with the file/line location, never the value.
- If you find none: say so explicitly ("No hardcoded credentials found in the material provided") rather than omitting the check silently.

## Stage 3 — Section synthesis (staged, not single-shot)

Generate ONE batch at a time. After each batch, output exactly: **"Batch complete. Continue to next batch? (Y/N)"** and wait — unless the operator has said upfront to run all batches uninterrupted.

**Batch A — Orientation**
- Executive Summary (what this is, business purpose, target users, current maturity — no numeric score yet, that's Stage 5)
- Architecture Overview (Mermaid diagrams capped at ~25 nodes each; split a flow into multiple diagrams rather than one unreadable one)
- Technology & Repository Inventory *(merged — same facts stated once and cross-referenced, not restated three different ways across the doc set)*

**Batch B — Functional surface**
- Application Features (purpose, implementation, dependencies, entry points, endpoints, DB usage, UI components, status, limitations, readiness — per feature)
- API Documentation (routes, methods, auth, validation, schemas, errors, dependencies, rate limiting, OpenAPI recommendation)
- Database Documentation (tables, relationships, indexes, constraints, migrations, views, functions, triggers, ORM models, missing migrations, data risks) — tag Requires Manual Validation anywhere this depends on live DB state you weren't given
- Authentication (providers, flows, session management, RBAC, JWT/OAuth, secrets handling, risks)

**Batch C — Operational surface**
- Infrastructure (hosting, containers, CI/CD, cloud services, secrets management, build/deploy pipeline, monitoring, scaling, backup/DR) — tag anything requiring live console access as Requires Manual Validation
- Security Review (hardcoded secrets carried over from Stage 2, missing validation, injection risk, XSS/CSRF, auth weaknesses, dependency vulnerabilities, missing headers, insecure storage/APIs, rate-limiting gaps, mapped to OWASP Top 10 where applicable — severity + impact + fix per finding)
- Performance Review (bundle size, render performance, query patterns incl. N+1, caching, lazy loading, memory, concurrency, background processing, cold starts)
- Code Quality (architecture quality, maintainability, complexity, naming, consistency, reuse, tech debt, patterns/anti-patterns, evidence of AI-generated scaffolding)

**Batch D — Readiness surface**
- Testing Assessment (coverage, unit/integration/E2E, missing tests, critical gaps, regression recommendations)
- DevOps Assessment (build reproducibility, environment consistency, deployment automation, rollback strategy, blue/green + canary + feature-flag readiness, incident response readiness)
- Observability (logging, metrics, tracing, dashboards, alerts, health endpoints, telemetry) — tag anywhere this depends on a live dashboard you weren't given

**Batch E — Decision surface**
- Risk Register (ID, Risk, Severity, Likelihood, Impact, Owner, Mitigation, Status — **Owner is never invented**; use exactly `Unassigned — requires manual triage` if none was specified)
- Technical Debt Register (priority, description, effort estimate, impact, recommendation)
- Release Blockers (Critical/High/Medium/Low, each with description, evidence, impact, recommended resolution)
- Production Readiness Scorecard (see Stage 5 rubric — do not skip straight to a bare percentage)
- Release Checklist (dev, QA, security, infra, ops, docs, compliance, monitoring, rollback, validation, post-release verification)
- Future Roadmap (immediate / 30-day / 90-day / long-term)

## Stage 4 — Consistency reconciliation (after all batches)

Re-scan everything generated for internal contradictions — e.g. a dependency listed in the Technology Inventory but absent from the Application Feature that supposedly uses it, or a risk whose severity differs between the Risk Register and Release Blockers. Log every contradiction found, prefixed with `!`, in its own short section before the scorecard.

## Stage 5 — Scorecard rubric (replaces a bare percentage)

Score each category — Architecture, Security, Testing, Performance, Scalability, Reliability, Monitoring, Documentation, Deployment, Maintainability, Developer Experience, Operational Readiness — on:

- **0** — Not present / Not Found
- **1** — Present but broken or unverified
- **2** — Present, functional, undocumented or untested
- **3** — Present, functional, documented, partially tested
- **4** — Present, functional, documented, tested, monitored

State the weight applied to each category before computing an overall score, and show the arithmetic. Do not state a bare percentage without this rubric attached. End with a release recommendation — **GO / GO WITH CONDITIONS / NO GO** — with specific conditions listed if applicable.

## Stage 6 — Versioning (only if a prior snapshot was provided)

If a prior `/docs` snapshot was supplied above: produce a Delta Summary first — what's fixed, what's new, what regressed since that snapshot — before the rest of the assessment. If none was supplied: state "Baseline run — no prior snapshot to diff" and proceed normally.

*(Note: this session does not persist state after it ends — carry the prior output forward yourself next time for this stage to have anything to diff against.)*

---

## Output structure

```
/docs
  00-index.md                              (one-line summary + link to every file below)
  01-executive-summary.md
  02-architecture.md
  03-technology-and-repository-inventory.md
  04-application-features.md
  05-api-documentation.md
  06-database-documentation.md
  07-authentication.md
  08-infrastructure.md
  09-security-review.md
  10-performance-review.md
  11-code-quality.md
  12-testing-assessment.md
  13-devops-assessment.md
  14-observability.md
  15-risk-register.md
  16-technical-debt-register.md
  17-release-blockers.md
  18-production-readiness-scorecard.md
  19-release-checklist.md
  20-future-roadmap.md
  21-delta-summary.md                       (only if Stage 6 ran)
```

## Per-document standard

Every file: Purpose · Scope · Current State · Findings (each tagged Verified / Inferred / Unknown with an evidence reference) · Risks · Recommendations · Next Actions.

## Hard rules (carried over, unchanged)

- Never fabricate functionality, tables, endpoints, or configuration.
- Every material claim carries an evidence reference or an explicit Verified/Inferred/Unknown tag — no exceptions.
- Flag TODOs, placeholders, prototype code, and AI-generated scaffolding by name and location.
- If it can't be verified: say so. Never guess.
