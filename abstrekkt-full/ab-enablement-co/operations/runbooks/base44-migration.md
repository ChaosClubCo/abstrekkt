# Base44 Migration Runbook

    _Generated: 2026-06-21. Reconstruction confidence is bounded by accessible project memory/context and the current chat session._


## Goal

Preserve Base44 velocity without letting Base44 repository binding control production.

## Steps

1. Identify Base44-generated repo and current binding.
2. If original repo must be restored, transfer it back to the personal account only when that is the required reconnect path.
3. Export code changes into a controlled branch.
4. Open PR into canonical repo.
5. Run CI and security checks.
6. Deploy through canonical Vercel pipeline.
7. Record generated-source provenance.
