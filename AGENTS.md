# AGENTS.md

## Startup bootstrap

Before changing anything in this repository:

1. Read `REPOSITORY.md`.
2. Read `repository-registry.yaml`.
3. Resolve the requested path to an authority domain.
4. If the path is under `project/`, read `project/CANON.md` and the nearest scoped guidance.
5. Check `docs/export/MIGRATION_CONTRADICTIONS.md` when ownership, migration, deployment, publication, or supersession is relevant.
6. Inspect the exact current branch/commit before mutation.

## Hard stops

### Loxihart freeze

Do not add, edit, or delete runtime/product files under `loxihart/` in this repository.

Canonical Loxihart product/runtime ownership is `ChaosClubCo/Loxihart`.

Allowed work here is limited to migration/evidence artifacts outside the frozen subtree, such as `docs/migrations/loxihart/`, source/target hash receipts, and later separately reviewed archive/removal changes after migration verification.

### Cross-lane exclusions

- INT/Intinc material is out of scope and must not be promoted, republished, or treated as Abstrekkt-owned implementation.
- Private memoir, clinical, family, custody, or similar restricted source is not public by default.
- Vendored/imported code is noncanonical unless an explicit authority decision says otherwise.

## Canonicality

Repository-level authority comes from `REPOSITORY.md` + `repository-registry.yaml`.

`project/CANON.md` remains binding only inside the legacy `project/` content/design corpus. Its artifact rules do not supersede repository ownership.

When evidence conflicts, preserve the contradiction and escalate to the owning authority. Do not resolve conflicts by filename, path age, repeated references, or apparent polish.

## Change workflow

1. Bind work to an exact base SHA.
2. Use a dedicated branch/PR for non-trivial changes.
3. Keep changes inside one authority domain when possible.
4. Record source revision/hash for migrations and provenance-sensitive changes.
5. Run repository integrity checks.
6. Read back remote files after mutation.
7. Require target verification before destructive cleanup.

## Engineering constraints

- Keep every code file below 400 LOC. Refactor before crossing the limit.
- Preserve complete behavior when refactoring; do not drop logic to satisfy the limit.
- Prefer deterministic, machine-readable evidence over prose-only completion claims.
- Treat generated deployment packages as generated outputs; mutate their canonical source instead unless a documented regeneration step owns the output.
- Never commit credentials, private keys, bearer tokens, service-account material, or deployment secrets.

## Verification

For repository-governance changes, verify at minimum:

- required root authority files exist;
- stale root handoff claims are absent;
- the registry identifies Loxihart as external canonical product/runtime authority;
- no changed path under `loxihart/` bypasses the freeze;
- changed text files pass lightweight secret-pattern screening;
- the PR diff contains only intended authority-domain changes.

## Base44 dev environment

The runnable web app is `Unicorn-maybe/flashfusion-web/` — a frontend-only Next.js 16 marketing site (React 19, Three.js, Tailwind). No database, no external services, no secrets required.

- **Compose:** `docker-compose.base44.yml` runs `node:22`, bind-mounts `Unicorn-maybe/flashfusion-web/` to `/app`, installs deps with `npm ci`, and starts `next dev -H 0.0.0.0 -p 3000`.
- **Preview origin:** `next.config.mjs` sets `allowedDevOrigins` from `BASE44_PUBLIC_HOST_SUFFIX` so the preview proxy can load dev assets/HMR.
- **Healthcheck:** `node -e "fetch('http://localhost:3000/')..."` — probes the dev server, no custom endpoint.
- **Verify:** `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/` should return 200.
- The `rendered/` directory is a separate static HTML build tool, not the preview app.
