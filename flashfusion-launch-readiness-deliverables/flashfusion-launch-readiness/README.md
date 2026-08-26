# FlashFusion Launch Readiness Prompt Package

This package converts the full launch-readiness conversation into an ordered, reusable multi-agent workflow.

## What to use first

### Codex — recommended immediate path

Copy these folders/files into the FlashFusion repository root:

```text
.codex/
AGENTS.md
prompts/
schemas/
config/
scripts/
docs/launch-readiness/
```

Open the repository in Codex and paste `tooling/codex/START_HERE.md` into a new task. Codex will discover the project-scoped agents in `.codex/agents/`.

### Claude Code

Copy:

```text
tooling/claude-code/.claude/
```

into the FlashFusion repository root as `.claude/`.

Also copy the shared runtime files:

```text
prompts/
schemas/
config/
scripts/
docs/launch-readiness/
```

Run:

```text
/launch-audit
```

The current implementation uses `.claude/skills/launch-audit/SKILL.md`. A legacy-compatible `.claude/commands/launch-audit.md` is also included.

### ChatGPT or Claude Project

Upload this package as project files and paste `tooling/codex/START_HERE.md`.

That provides an advisory audit when repository, browser, test, deployment, and telemetry access are incomplete. It should not be treated as a binding release gate without those evidence sources and deterministic enforcement.

## Sequential execution order

1. `prompts/00_shared_operating_policy.md`
2. `prompts/01_release_manifest_agent.md`
3. `prompts/02_orchestrator_controller.md`
4. Run in parallel:
   - `prompts/03_ux_readiness_agent.md`
   - `prompts/04_security_readiness_agent.md`
   - `prompts/05_growth_readiness_agent.md`
   - `prompts/06_ai_readiness_agent.md`
   - `prompts/07_infrastructure_readiness_agent.md`
5. `prompts/08_report_validator_agent.md`
6. `scripts/evaluate-launch.mjs`
7. `prompts/09_final_launch_readiness_gate.md`
8. If not `GO`: `prompts/10_remediation_planner.md`
9. After fixes: `prompts/11_focused_verification_agent.md`
10. After approval: `prompts/12_launch_day_monitoring_agent.md`

`prompts/13_high_level_snapshot.md` is optional and should be used only for fast triage before the full audit.

## Required repository placement

Recommended root layout:

```text
flashfusion/
├── .claude/                       # Claude Code only
├── config/
│   └── launch-policy.json
├── schemas/
│   ├── specialist-report.schema.json
│   └── final-decision.schema.json
├── scripts/
│   └── evaluate-launch.mjs
├── prompts/
│   ├── 00_shared_operating_policy.md
│   ├── 01_release_manifest_agent.md
│   ├── 02_orchestrator_controller.md
│   ├── 03_ux_readiness_agent.md
│   ├── 04_security_readiness_agent.md
│   ├── 05_growth_readiness_agent.md
│   ├── 06_ai_readiness_agent.md
│   ├── 07_infrastructure_readiness_agent.md
│   ├── 08_report_validator_agent.md
│   ├── 09_final_launch_readiness_gate.md
│   ├── 10_remediation_planner.md
│   ├── 11_focused_verification_agent.md
│   ├── 12_launch_day_monitoring_agent.md
│   └── 13_high_level_snapshot.md
└── docs/
    └── launch-readiness/
```

## CI usage

Run the deterministic policy engine after specialist reports exist:

```bash
node scripts/evaluate-launch.mjs docs/launch-readiness/<release-id>
```

Exit code 0 is not currently used as an approval signal; parse the generated `deterministic-policy-result.json` and enforce your desired CI behavior.

Recommended CI behavior:

- `GO`: allow promotion.
- `CONDITIONAL_GO`: require manual approval and constrained rollout.
- `NO_GO`: block deployment.
- `INSUFFICIENT_EVIDENCE`: block deployment.

## Important

The prompts produce evidence and judgment. The script enforces score math and hard gates. Do not let the final LLM override deterministic policy.
