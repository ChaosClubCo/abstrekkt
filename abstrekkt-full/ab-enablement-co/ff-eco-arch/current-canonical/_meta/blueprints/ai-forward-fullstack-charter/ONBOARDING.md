# Onboarding Guide — AI-Augmented Development

Day 1–5 path for a new human contributor (and the reference AI agents read too).

## Day 1: Environment setup
1. Clone the repo; `npm ci`.
2. Authenticate to Vault (AppRole) — you never get raw provider keys.
3. Configure your IDE + the CLI router config (`cli-router/README.md`).

## Day 2: Read the docs
- `ARCHITECTURE.md` — the three-zone governance model.
- `docs/agents/AGENTS.md` — who does what, the authority matrix.
- `docs/agents/CLAUDE.md` + `GEMINI.md` — per-agent guidance.

## Day 3: First contribution
- Pick a Zone 1 task. Let Claude Code draft; you review.
- Open a PR; watch `ai-commit-review` run; address findings.

## Day 4–5: Shadow a senior dev
- Observe a Zone 2 change (gated deploy / migration through Atlantis).
- Run the rollback runbook against staging once, end to end.

## Working with AI agents — do / don't
**Do:** give one clear outcome; review every AI PR; check the audit trail.
**Don't:** let an agent loop on failure; merge AI changes to protected branches
without CI; paste secrets into prompts.

## When to ask for help
Anything touching money, auth, infra, or production data → human in the loop.

## Key files to know
`ARCHITECTURE.md`, `docs/agents/*`, `cli-router/`, `runbooks/rollback.md`,
`.github/workflows/`.
