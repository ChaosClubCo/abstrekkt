# Agent Roles & Policies

Single source of truth for which agent does what, what it may touch, and where a
human must approve. Reconstructed from the AI-Forward Charter source chat.

## Authority Matrix

| Agent | Zone-1 Autonomous | Zone-2 Gated (human approval) | Zone-3 Forbidden |
|---|---|---|---|
| AntiGravity IDE (orchestrator) | dispatch jobs, monitor, aggregate | trigger deploys | mutate prod data |
| Claude Code CLI (architect) | design, multi-file edits, draft PRs, run tests | merge to protected branch, schema migration | delete prod data, change billing |
| Gemini CLI (integrator) | research, cross-service wiring in branch | external API credential use (via Vault) | rotate/exfiltrate secrets |
| GitHub Copilot (executor) | in-IDE completions, small fixes | — | commit to protected branch directly |
| Codex / OpenAI CLI | scoped generation in branch | — | infra changes |
| CI/CD (GitHub Actions) | run review + tests | gated deploys | bypass required checks |

## Per-Agent Detail

### AntiGravity IDE — Mission Control
- **Role:** orchestrates parallel agent jobs; owns the dispatch + monitoring dashboard.
- **Boundaries:** never directly mutates production; delegates and observes.
- **Parallel-job limit:** treat 50+ concurrent agents as UNVERIFIED — throttle via
  the CLI router until the real ceiling is benchmarked (open claim).

### Claude Code CLI — Chief Architect
- **Capabilities:** architecture, multi-file refactors, test authoring, PR drafting.
- **Approval gates:** any merge to a protected branch or DB schema migration
  requires human sign-off through CI/CD + Atlantis.
- **Error handling:** on repeated failure, stop and hand off — do not loop.

### Gemini CLI — Systems Integrator
- **Capabilities:** connect services (Supabase/Firebase/AWS/n8n), research grounded
  approaches.
- **Boundaries:** all third-party credentials come from the Vault broker, never
  inline; cannot rotate or read raw secrets.

### GitHub Copilot — Code Executor
- **Capabilities:** continuous in-IDE completion, small local fixes.
- **Boundaries:** cannot push to protected branches; output flows through PRs.

## Handoff Protocol (agent → agent)
1. Producing agent writes a handoff note (goal, files touched, open questions).
2. CLI router releases the file lease (prevents two agents editing one file).
3. Receiving agent reads note + lease before acting.

## Conflict Resolution
- File-lease in the CLI router: one writer per file at a time; others queue.
- Merge conflicts on AI PRs escalate to the human reviewer, never auto-resolved.

## Quota Monitoring & Emergency Protocols
- `cost-monitoring.yml` polls spend per agent; trips a **kill switch** on threshold.
- **Runaway agent:** kill switch revokes the agent's token and pauses its queue.
- **Agent hallucination detected:** quarantine its PR, flag for human review.
- **AntiGravity downtime:** agents fall back to direct CLI with reduced concurrency.

## Version History
- v2.0.0 — consolidated authority matrix + three-zone governance (this charter).
