# Audit Evidence Log

> Companion to `readiness-audit-checklist.md`. The audit is only as good as its
> evidence. For each category, record **what was checked, by whom, on what date,
> and the proof** (a console screenshot reference, a config export name, a test
> result — never a raw secret). This is the artifact you hand to security/legal,
> and the reason this kit does not let the deployment self-grade.

## Audit run metadata

| Field | Value |
|-------|-------|
| Organization | FlashFusion |
| Audit date | |
| Auditor(s) | |
| Claude plan/tier | (Team / Enterprise / Enterprise+ZDR) |
| Scope (waves covered) | |
| Reconciled taxonomy version | (see `enterprise-claude-profile-builder`) |

## Evidence entries

Copy this block per category (1–12).

```
### Category N: <name>
- Result: PASS | PARTIAL | FAIL
- Gate items pass: yes | no
- Checked by: <name>     Date: <YYYY-MM-DD>
- Evidence:
  - <e.g., admin-console export "rbac-2026-06.csv" shows Sales has Code Execution OFF>
  - <e.g., test transcript: asked baseline-version question, got expected answer>
- Gaps / follow-ups:
  - <open item> — owner: <name> — due: <date>
- SECRETS CHECK: confirmed no API keys / tokens / internal URLs recorded here
```

## Empirical-verification log (claims the source asserted but did not prove)

These three must be tested, not assumed. Record the actual test.

| Claim (from source) | Test performed | Result | Verified by / date |
|---------------------|----------------|--------|--------------------|
| "Memory isolation: Sales can't see Finance memories" | Create test users in two roles; confirm one cannot retrieve the other's memory entries | | |
| "All interactions logged to Sentry" | Trigger an interaction; confirm it appears in the named log sink | | |
| "ZDR enabled for all roles" | Confirm ZDR terms in contract + admin setting; record retention window | | |

## Compliance mapping (framing → real controls)

The source named SOC 2 / HIPAA / GDPR / PCI-DSS. Naming is not attesting. Fill in
the real control owner and most recent attestation date, or mark "framing only."

| Framework | Applicable? | Control owner | Last attestation date | Status |
|-----------|-------------|---------------|----------------------|--------|
| SOC 2 (Anthropic) | | | | framing / attested |
| HIPAA (BAA in place?) | | | | framing / attested |
| GDPR (DPA in place?) | | | | framing / attested |
| PCI-DSS | | | | framing / N/A |

## Sign-off

| Role | Name | Decision (ready / not ready) | Date |
|------|------|------------------------------|------|
| Audit owner | | | |
| Security (InfoSec) | | | |
| Data/Legal | | | |
| Executive sponsor | | | |
