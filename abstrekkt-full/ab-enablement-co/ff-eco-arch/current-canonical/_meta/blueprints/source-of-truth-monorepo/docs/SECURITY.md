# Security Notes — Consolidation Toolkit

The source chat pasted ~130 live URLs and said "use my credentials." This package
contains **no credentials** and assumes every imported repo is untrusted until
reviewed. The rules below are the safety model.

## 1. Imported code is untrusted

- `import-repo.sh` copies source with `rsync --exclude='.git'` and **does not run**
  the imported repo's build, tests, or `postinstall`.
- First install is always `pnpm install --ignore-scripts`. Only after a human
  reviews a package do you allow its lifecycle scripts to run.
- CI mirrors this: the `build-test` job installs with `--ignore-scripts`.
- Never `curl ... | bash` or auto-execute anything from an imported repo.

## 2. Secrets

- `.env` is git-ignored; `.env.example` is the only committed template
  (placeholders + comments, no values).
- `gh` auth and Turborepo `TURBO_TOKEN` come from the environment / CI secrets,
  never from files in the repo.
- Pre-commit secret scanning (e.g. gitleaks / `detect-secrets`) is recommended
  before the first push — many imported repos historically committed `.env` files.
- If an imported repo contains a real secret, **rotate it** and strip it from
  history before it lands in the monorepo.

## 3. Tenant isolation

- Multi-tenant apps (e.g. FlashFusion) depend on Supabase **Row-Level Security**.
  After importing, verify RLS policies are present and enforced — they don't
  travel automatically and an unguarded table is a cross-tenant leak.

## 4. Supply chain / dependency drift

- Single pnpm lockfile + Renovate (updates) + Dependabot (security alerts).
- `pnpm audit --audit-level=high` runs in CI; set branch protection so **critical
  findings block merge** (otherwise scanners are advisory only).
- CodeQL static analysis runs for JS/TS and Python.

## 5. Auth standardization

- Source carried 4 auth systems (Supabase Auth, NextAuth, + others). Target is
  Supabase Auth. Don't import 4 auth stacks — pick one on the way in. Use
  HTTP-only, Secure, SameSite cookies with short lifetimes; rotate provider tokens.

## 6. Rate limiting / abuse

- Import driver self-rate-limits GitHub clones (sequential + `--sleep`).
- App-level rate limiting on the imported services is **unverified per app** —
  audit each before exposing publicly.

## 7. What this toolkit will NOT do

- Will not delete a repo (archival = mirror clone + reversible GitHub archive).
- Will not archive on GitHub without an interactive confirmation.
- Will not rewrite `CONSOLIDATION_LOG.md` history.
- Will not run imported third-party code automatically.
