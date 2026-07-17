# Deployment Rollback Runbook

    _Generated: 2026-06-21. Reconstruction confidence is bounded by accessible project memory/context and the current chat session._


1. Identify failed release and impacted surface.
2. Roll back Vercel deployment or revert release commit.
3. If migration is involved, apply tested rollback migration or forward fix.
4. Run smoke tests.
5. Communicate status.
6. Record corrective action.
