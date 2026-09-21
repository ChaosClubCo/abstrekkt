# Rollback Runbook

Every deploy must have an automated revert path (closes the "no rollback" gap).
**Test this against a deliberately bad deploy before scaling agent count.**

## Register a rollback point (on every deploy)
`runbooks/scripts/register-rollback-point.sh` records: git SHA, deploy ID,
DB migration version, and timestamp.

## Frontend (Vercel)
```bash
# Instant: promote the previous good deployment
npx vercel rollback <previous-deployment-url> --token "$VERCEL_TOKEN"
```

## Backend (Replit)
```bash
git checkout <last-good-sha>
./scripts/replit-deploy.sh        # redeploy known-good
```

## Database migrations
- Forward-only migrations preferred; keep a reversible down-migration for the last N.
- If a migration is bad: restore from the pre-migration snapshot (taken by the
  rollback-point script), then redeploy the matching app SHA.

## Decision flow
```
Bad deploy detected (alert / error spike)
├─ app-only regression → roll back app to last-good SHA
└─ schema involved → restore DB snapshot + roll back app together (must match)
```

## After rollback
- Post-incident note: what shipped, what broke, how detected, time-to-revert.
- File the fix as a normal gated PR; never hot-patch prod directly.
