# SOC2 Type II + PCI-DSS Control Mapping — FlashFusion

Maps the system-prompt/paved-road controls to the compliance obligations they
satisfy. Annual cadence.

## SOC2 Type II (Trust Services Criteria)

| TSC area | FlashFusion control | Evidence |
|----------|----------------|----------|
| **Security (CC6)** | RLS on every table; SSO/RBAC; pre-commit secret scan; SAST | CI logs, RLS test results |
| **Availability (A1)** | k8s readiness probes + auto-rollback; SLOs + error budgets | uptime dashboards, rollback logs |
| **Confidentiality (C1)** | AES-256 at rest; least-privilege scopes; Vault secrets | encryption config, Vault policy |
| **Processing integrity (PI1)** | ≥80% coverage gate; Cause→Fix→Retry error handling | CI coverage reports |
| **Change mgmt (CC8)** | AI PRs treated as untrusted; CODEOWNERS; plan-reviewed Terraform | PR history, Atlantis/plan logs |
| **Monitoring (CC7)** | Sentry + PostHog; immutable audit trail; PagerDuty alerting | alert configs, audit log samples |

**Audit cadence:** SOC2 Type II is a point-in-time attestation — re-attest
annually; never present a prior year's attestation as current.

## PCI-DSS (if cardholder data is in scope)

| Requirement | FlashFusion control |
|-------------|----------------|
| **Req 3 — protect stored data** | minimize CHD storage; AES-256; tokenize where possible |
| **Req 4 — encrypt in transit** | TLS everywhere (TIER 0 floor) |
| **Req 6 — secure development** | SAST + coverage gates + dependency audit in CI |
| **Req 8 — identify/authenticate** | JWT + rotation; SSO/RBAC |
| **Req 10 — log & monitor** | immutable audit trail → CloudWatch, 2-yr retention |
| **Req 11 — test security** | load + security test before prod; zero critical findings gate |

## What FlashFusion stores vs must protect

- **Stores:** operational data, user/tenant records (RLS-isolated), audit logs.
- **Must protect:** any PII/PHI/PCI — kept out of general chat; ZDR/enterprise
  tier only; logged + reviewed.

## Certification gate

**No production deployment with open critical security findings.** Compliance
certification is part of the release checklist, not an afterthought.
