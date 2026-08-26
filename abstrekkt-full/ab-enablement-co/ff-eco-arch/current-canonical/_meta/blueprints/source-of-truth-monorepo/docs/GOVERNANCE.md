# Governance Model — Source-of-Truth Monorepo

Reconstructed from the source chat's governance section. Establish in Phase 3.

## Ownership (CODEOWNERS)

Ownership is assigned by directory (see `monorepo/CODEOWNERS`). Caveat: every
`@team` must exist in the GitHub org or the rule silently no-ops and no review is
requested. Create the teams (`@core-team`, `@app-team`, `@tools-team`,
`@ai-team`, `@devops-team`, `@security-team`) before turning on
"require review from Code Owners."

## Branch protection

**`main`**
- Require pull request with >= 1 approval
- Require CI/CD to pass (the `build-test` + `codeql` jobs)
- Require Code Owner review on owned paths
- Require linear history; block force pushes
- Block merge on critical security findings (Dependabot/CodeQL/Snyk)

**`staging`**
- Require CI/CD to pass
- Allow force push (for rebasing) — staging is disposable

**`feature/*`**
- No restrictions

## Release process

1. Feature branch -> `staging` via PR
2. Staging validation: automated tests + manual QA
3. `staging` -> `main` via release PR (weekly cadence)
4. Tag releases with semantic versioning (`vMAJOR.MINOR.PATCH`)

## Dependency management

- **Renovate** — auto-create PRs for minor/patch updates
- **Dependabot** — security alerts only (critical)
- **Review cadence** — weekly for minor/patch; immediate for critical

## Health checks (weekly)

- CI/CD pipeline green
- No circular workspace dependencies
- All workspaces installable (`pnpm install` clean)
- Docs up to date; security audits passing
- Coverage >= 70% (aspirational — current baseline unknown)

## Metrics: report measured, not assumed

The source listed these as "Unknown -> Target." Do not present targets as results.
Measure after Phase 1, then report:

| Metric | Source baseline | Source target |
|--------|-----------------|---------------|
| Active repos | 385 | ~130 (65% reduction) |
| Build time (full) | Unknown | < 15 min |
| Incremental build | Unknown | ~2 min |
| CI build | Unknown | ~5 min (remote cache) |
| CI success rate | Unknown | >= 95% |
| Code coverage | Unknown | >= 70% |
| Onboarding time | 2-3 weeks | < 1 day |
| MTTR | Unknown | < 30 min |

## Cost figures — reconcile before quoting

The source gives two different annual savings numbers: **$51,300/year** (portfolio
overview) and **$30K/year** (board deck table). Both are estimates at a $100/hr
blended labor rate. Reconcile against actual subscription invoices (Base44 ~$200/mo
and Bolt ~$200/mo were cancelled) before presenting a single figure.
