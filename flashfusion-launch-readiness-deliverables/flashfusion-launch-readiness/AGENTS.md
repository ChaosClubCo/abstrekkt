# FlashFusion Repository Agent Instructions

When the user invokes a FlashFusion launch-readiness audit:

1. Read `prompts/00_shared_operating_policy.md`.
2. Read `prompts/02_orchestrator_controller.md`.
3. Freeze the candidate with the `release_manifest` custom agent.
4. Spawn `ux_readiness`, `security_readiness`, `growth_readiness`, `ai_readiness`, and `infrastructure_readiness` independently against the same manifest.
5. Keep specialist agents read-only and prevent them from seeing one another's conclusions before submission.
6. Validate each report with `report_validator`.
7. Run `node scripts/evaluate-launch.mjs docs/launch-readiness/<release-id>`.
8. Use `launch_readiness` only after deterministic evaluation succeeds.
9. Do not modify production code during the audit.
10. Do not approve a launch that fails any deterministic gate.

All audit artifacts belong under `docs/launch-readiness/<release-id>/`.
