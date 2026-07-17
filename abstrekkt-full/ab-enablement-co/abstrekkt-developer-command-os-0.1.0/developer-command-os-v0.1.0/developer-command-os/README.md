# Developer Command OS

A production-oriented TypeScript foundation for the 200-command AI Developer Command OS.

## What is implemented

- Authoritative, versioned TypeScript registry for all 200 commands.
- 36 reusable capability primitives.
- `/audit`, `/repair`, and `/ship` reference pipeline DAGs.
- Environment manifest detection with secret-name-only handling.
- Platform capability routing.
- Composable prompt compiler with versioned fragments.
- External risk and approval policy.
- Structured `CommandResult` envelope.
- Regression and evaluation suite with three repository fixtures.
- Production-readiness gates that require automated evidence and human review.

## Quick start

```bash
npm install
npm run validate
npm run cli -- validate
npm run cli -- env --root fixtures/nextjs-app
npm run cli -- compile /audit --root fixtures/nextjs-app
npm run cli -- plan /ship
```

## Source-of-truth policy

`src/registry/commands.generated.ts`, `src/registry/primitives.ts`, and `src/registry/pipelines.ts` are authoritative. The Word document under `docs/human-spec/` is the human-facing v1 specification. Generated Markdown under `docs/generated/` must be regenerated from the TypeScript registry and must not be edited manually.

## Production status

All 200 commands are `experimental`; the three reference pipelines are `beta`. No command may be labeled `production` until schema, alias, compiler, policy, environment-matrix, pipeline, and qualified human-review gates pass.
