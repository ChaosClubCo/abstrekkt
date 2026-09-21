# START HERE — Codex Launch Audit

Audit the currently checked-out FlashFusion release candidate using the prompt package in this repository.

## Required workflow

1. Read `prompts/00_shared_operating_policy.md`.
2. Run `prompts/01_release_manifest_agent.md`.
3. Save the manifest under `docs/launch-readiness/<release-id>/release-manifest.json`.
4. Run these five specialists independently and in parallel:
   - `prompts/03_ux_readiness_agent.md`
   - `prompts/04_security_readiness_agent.md`
   - `prompts/05_growth_readiness_agent.md`
   - `prompts/06_ai_readiness_agent.md`
   - `prompts/07_infrastructure_readiness_agent.md`
5. Give every specialist the same manifest and read-only repository access.
6. Require both Markdown and JSON reports.
7. Validate every JSON report using:
   - `prompts/08_report_validator_agent.md`
   - `schemas/specialist-report.schema.json`
8. Reject and rerun invalid specialist reports.
9. Run:

```bash
node scripts/evaluate-launch.mjs docs/launch-readiness/<release-id>
```

10. Invoke `prompts/09_final_launch_readiness_gate.md` using the five validated reports and deterministic policy result.
11. Save:
   - `final-report.md`
   - `final-decision.json`
12. Do not modify production code during this audit.
13. End with:
   - Verdict
   - Adjusted score
   - Weighted confidence
   - Exact blockers
   - Files created
   - Verification commands
   - Recommended remediation order

## Approval threshold

Require:

- Overall adjusted score ≥ 85
- UX ≥ 80
- Security ≥ 90
- Growth ≥ 75
- AI ≥ 85
- Infrastructure ≥ 85
- Confidence ≥ 80%
- No open critical blockers
- No unresolved high security or AI-safety blockers
- Verified tenant isolation
- Tested rollback
- Tested backup restoration
- Passed core user journeys
- Validated core analytics
