# v0.dev Development Discipline + Lint/Format/Validation Stack (ZIP_SPEC)

> Reconstructed from source chat
> `V0.app development discipline and lint stack setup` (uuid `382da365…`, batch-0001).
> The source captured a v0.app / Next.js development-discipline protocol (5 pillars:
> strict TypeScript, React patterns, Tailwind/shadcn, server actions, project
> discipline) and then iterated a **drop-in lint/format/validation stack** —
> type-aware ESLint, Prettier with Tailwind class sorting, a Zod runtime-validation
> base (`lib/schema.ts` with `parseOrThrow` + `zFetch`), App Router examples,
> GitHub Actions CI, Husky + lint-staged, and VS Code settings. This package
> materializes every artifact as a working, internally-consistent scaffold plus the
> written discipline guide.

## 1. Executive Summary

A **drop-in tooling layer** that mechanically enforces a strict Next.js (App
Router) + TypeScript development discipline. It bundles:

- **Type-aware ESLint** (`recommended-type-checked` + `stylistic-type-checked`)
  that bans `any`, enforces `unknown`-then-validate, deterministic import order,
  arrow-function components, Tailwind class order, and "named exports everywhere
  except Next route files".
- **Prettier** with `prettier-plugin-tailwindcss` so `className` order is always
  sorted and diffs are noise-free.
- **A Zod validation base** (`lib/schema.ts`): reusable primitives, an
  `ApiErrorSchema` envelope, `parseOrThrow` / `safeParse`, and a typed `zFetch`
  helper that validates responses at the I/O edge and never leaks raw upstream
  errors.
- **Two worked App Router examples** (a validated `GET` route handler and a
  validated server action) demonstrating "validate only at boundaries".
- **CI + commit gates**: a GitHub Actions `lint.yml` (typecheck → lint → format
  check) and a Husky `pre-commit` running `lint-staged`.

The design philosophy carried verbatim from source: **validation lives only at
I/O edges** (request/response, `FormData`, `searchParams`, `env`) so inner layers
stay zero-overhead, and **strict booleans/no-enums** push you toward safer,
tree-shakeable code. Versions are pinned (see §6) to prevent dependency drift.

## 2. Build (setup steps)

The reusable files live under `config/`. Copy them to your Next.js repo root
(`config/lib/schema.ts` → `<repo>/lib/schema.ts`, etc.; the `app/` examples are
optional). Then:

```bash
# 1) Install the toolchain (pinned versions are in config/package.json)
pnpm add -D eslint@8.57.1 @typescript-eslint/parser@7.18.0 \
  @typescript-eslint/eslint-plugin@7.18.0 eslint-config-next@14.2.15 \
  eslint-config-prettier@9.1.0 eslint-plugin-import@2.31.0 \
  eslint-import-resolver-typescript@3.6.3 eslint-plugin-unused-imports@3.2.0 \
  eslint-plugin-react@7.37.1 eslint-plugin-react-hooks@4.6.2 \
  eslint-plugin-jsx-a11y@6.10.0 eslint-plugin-tailwindcss@3.17.5 \
  eslint-plugin-prettier@5.2.1 prettier@3.3.3 prettier-plugin-tailwindcss@0.6.8 \
  husky@9.1.6 lint-staged@15.2.10
pnpm add zod@3.23.8

# 2) Merge the scripts + lint-staged block from config/package.json
#    into your existing package.json (see config/package.json).

# 3) Wire commit hooks
pnpm exec husky init          # creates .husky/ ; replace pre-commit with ours
#   (or copy config/.husky/pre-commit verbatim)

# 4) Confirm @/ alias exists in tsconfig.json:
#    "baseUrl": ".", "paths": { "@/*": ["./*"] }   (already set in config/tsconfig.json)
```

npm/yarn equivalents work too — swap `pnpm add -D` for `npm i -D` / `yarn add -D`
and update `lint.yml` accordingly.

## 3. Output (file tree)

```
v0-dev-discipline-lint-stack/
├── README.md                         (this file)
├── docs/
│   └── DEVELOPMENT-DISCIPLINE.md     the written 5-pillar discipline guide
└── config/                           drop-in files → copy to your repo root
    ├── package.json                  scripts + lint-staged + PINNED deps
    ├── .eslintrc.json                type-aware, strict, no-any, import order, tailwind
    ├── .eslintignore
    ├── .prettierrc                   + prettier-plugin-tailwindcss
    ├── .prettierignore
    ├── .editorconfig                 whitespace/EOL parity with Prettier
    ├── .lintstagedrc.json
    ├── .env.example                  USER_SERVICE_URL for the examples
    ├── tsconfig.json                 strict:true, @/* alias
    ├── tsconfig.eslint.json          tight includes (type-aware perf)
    ├── .vscode/
    │   └── settings.json             format-on-save + eslint fix-all
    ├── .husky/
    │   └── pre-commit                runs lint-staged
    ├── .github/workflows/
    │   └── lint.yml                  CI: typecheck → lint → prettier -c
    ├── lib/
    │   └── schema.ts                 Zod base: parseOrThrow, safeParse, zFetch
    └── app/
        ├── api/users/route.ts        validated GET example (I/O edge)
        └── actions/create-user.ts    validated server action example
```

## 4. Implementation Considerations

- **Type-aware ESLint is CPU-heavy.** `tsconfig.eslint.json` keeps `include`
  tight (only source folders) so ESLint never crawls `node_modules`/`.next`. CI
  caches pnpm to offset the cost.
- **No `any` migration path:** type the value `unknown`, then
  `parseOrThrow(schema, value)` at the boundary. The inner code is typed for free.
- **Default exports:** allowed only in `app/**/page.tsx|layout.tsx|route.ts` and
  `pages/**` via an override; named exports everywhere else for tree-shaking.
- **Enums → `as const` maps** (`no-restricted-syntax` on `TSEnumDeclaration`) for
  better DCE and narrowing; an example `ROLE` map ships in `schema.ts`.
- **Two house styles existed in the source.** This kit implements the v0.app
  rules (arrow components, named exports). A second MUI/TanStack skill in the same
  chat preferred `React.FC` + default exports — that is *not* applied here. Choose
  one per repo; do not mix (see CLAIMS CHECK → contradictions).

## 5. Performance / Security Notes

- **Validation cost stays at the edges** — request/response JSON, `FormData`,
  `searchParams`, `env`. Inner layers consume typed data with zero Zod overhead.
- **No raw upstream errors to users.** `zFetch` normalizes failures through
  `ApiErrorSchema` and throws user-safe messages; the original body is never
  rendered.
- **Strict boolean expressions** block accidental truthiness bugs (e.g.
  `if (arr)` when an empty array is truthy) — a common source of broken auth gates.
- **Untrusted input / secrets:** the only credential surface is
  `USER_SERVICE_URL` in `.env.example` (a placeholder, not a real secret). No real
  secrets are present. Keep `.env.local` out of git (Next.js ignores it by
  default). **Do not run the example `app/` files against a real service until you
  have set a value you trust** — they perform live `fetch`. This package executes
  no extracted code automatically.
- **Dependency drift:** versions are pinned exactly (no `^`/`~`). Bump
  deliberately and re-run `pnpm check`. `pnpm install --frozen-lockfile` in CI
  prevents silent upgrades.

## 6. Recommended Next Steps

1. Copy `config/` files into your repo root; run `pnpm install && pnpm check`.
2. If `@/` aliases aren't set, copy the `paths` block from `config/tsconfig.json`.
3. Keep or delete the example `app/` files (they need `USER_SERVICE_URL`).
4. Migrate real `fetch`/actions to `zFetch` + `parseOrThrow` schemas.
5. Add a Zod env module (`lib/env.ts` = `z.object({...}).parse(process.env)`) and
   fail fast on boot.
6. Split domain schemas into `lib/schema/<feature>.ts`, re-export from
   `lib/schema.ts`.
7. Require the "Lint & Typecheck" check for PR merges (branch protection).
8. Add integration tests (Vitest + undici) for the routes — **the source shipped
   zero tests** (see risk checklist).

## 7. Smoke Test

After copying files + installing:

```bash
pnpm typecheck     # expect: no output, exit 0 (strict:true compiles clean)
pnpm lint          # expect: no errors; "--max-warnings=0" => warnings fail too
pnpm format:check  # expect: "All matched files use Prettier code style!"
pnpm check         # runs all three in sequence; the single gate
```

Negative checks (prove the rules bite):

- Add `const x: any = 1;` to any `.ts` → `pnpm lint` fails with
  `@typescript-eslint/no-explicit-any`.
- Add `export default function foo() {}` to a non-route `.ts` → fails with
  `import/no-default-export`.
- Scramble Tailwind class order in JSX → `pnpm format:check` fails until
  `pnpm format` re-sorts.
- Commit a badly-formatted `.ts` → Husky `pre-commit` auto-fixes via lint-staged.

## 8. Troubleshooting

- **"ESLint couldn't find tsconfig / parserOptions.project"** — ensure
  `tsconfig.eslint.json` exists at repo root and your source dirs are in its
  `include`.
- **Linting is slow** — tighten `include` in `tsconfig.eslint.json`; exclude
  build artifacts; ensure `.next`/`dist` aren't being typed.
- **`@/...` import unresolved** — add the `@/*` → `./*` `paths` mapping to
  `tsconfig.json` (and `baseUrl: "."`).
- **Zod datetime rejects upstream dates** — `ISODate` requires ISO-8601 *with
  offset*; coerce/normalize upstream values before validating, or relax the
  schema.
- **Examples error with `ECONNREFUSED` / undefined URL** — set `USER_SERVICE_URL`
  in `.env.local`, or delete `app/api/users/route.ts` + `app/actions/create-user.ts`.
- **`eslint.useFlatConfig` warning** — this kit uses the legacy `.eslintrc.json`
  (set `false`). Migrating to flat config (`eslint.config.js`) requires rewriting
  the config and is out of scope here.

## 9. Acceptance Criteria

- [ ] `pnpm check` passes locally and in CI.
- [ ] No `any`; code compiles with `strict: true`.
- [ ] Imports are deterministically ordered; no unused imports.
- [ ] API routes/server actions validate inputs **and** outputs with Zod.
- [ ] Tailwind classes are consistently sorted by Prettier.
- [ ] Default exports appear only in Next route/page/layout files.
- [ ] Husky `pre-commit` blocks unformatted/lint-failing commits.
- [ ] No real secrets present; `.env.example` is a placeholder only.

## 10. Rollback Notes

This layer is additive (config + a `lib/` file + optional examples); rollback is
clean:

1. `git revert` (or delete) the added config files: `.eslintrc.json`,
   `tsconfig.eslint.json`, `.prettierrc*`, `.eslintignore`, `.editorconfig`,
   `.lintstagedrc.json`, `.vscode/settings.json`, `.github/workflows/lint.yml`,
   `.husky/pre-commit`.
2. Remove the added `scripts` + `lint-staged` keys from `package.json`.
3. Uninstall the devDependencies (and `zod` if unused elsewhere):
   `pnpm remove eslint prettier husky lint-staged @typescript-eslint/parser ...`.
4. Delete `lib/schema.ts` and the example `app/` files **only** if nothing imports
   them — grep for `@/lib/schema`, `zFetch`, `parseOrThrow` first.
5. `rm -rf .husky` to drop the git hook entirely.

No data migrations, no runtime/infra changes — nothing to undo server-side.

## 11. Risk Checklist

- **Dependency drift** — *Mitigated.* Versions pinned exactly in
  `config/package.json`; CI uses `--frozen-lockfile`. Bumps must be deliberate.
- **Missing tests** — *Open.* The source shipped **no tests**. The lint stack is
  the only automated gate. Add Vitest integration tests for the routes/actions
  (Next Step #8) before relying on this for correctness, not just style.
- **Observability** — *Out of scope.* No logging/tracing here; `zFetch` throws
  but does not report. Wire Sentry/structured logging separately.
- **Unclear ownership** — *Flagged.* Two conflicting house styles in the source
  (v0.app arrow/named-export vs. a MUI/TanStack `React.FC`/default-export skill).
  This kit picks v0.app; a team must ratify one or the configs will fight real code.
- **Secrets handling** — *Mitigated.* Only a placeholder `USER_SERVICE_URL`; no
  credentials. `.env.local` stays gitignored.
- **Auth gaps / tenant isolation / rate limiting** — *N/A* to a lint layer; the
  example route has no auth and is illustrative only — do not ship it as-is.
- **Untrusted code execution** — *Mitigated.* Nothing auto-runs; example `fetch`
  files are inert until you configure a URL and invoke them.

## 12. CLAIMS CHECK

- **Verified (in source):** the 5-pillar discipline guide; the full
  `.eslintrc.json` (type-aware, `no-explicit-any`, no-unsafe family,
  `strict-boolean-expressions`, import/order groups, `import/no-default-export`
  with route overrides, tailwind order, no-enums); `.prettierrc` with
  `prettier-plugin-tailwindcss`; `tsconfig.eslint.json` tight includes;
  `lib/schema.ts` with `Id/ISODate/NonEmptyString/ApiErrorSchema/UserSchema/`
  `PaginatedSchema/parseOrThrow/safeParse/zFetch/UsersQuerySchema/CreateUserInput`;
  the `app/api/users/route.ts` and `app/actions/create-user.ts` examples;
  `.vscode/settings.json`; the `.github/workflows/lint.yml` CI; Husky pre-commit +
  lint-staged globs; package.json scripts (`lint/format/typecheck/check`); pnpm,
  Next.js 14+ App Router, `@/* → ./*` alias.
- **Inferred (this kit):** exact pinned dependency versions (source gave package
  names, not versions — pinned to a known-good Next 14.2.x / ESLint 8.57 /
  typescript-eslint 7.18 / Zod 3.23 set); `.editorconfig` (source mentioned it
  conceptually under "Add .eslintrc, .prettierrc, and pre-commit hooks" but did
  not materialize one); `.lintstagedrc.json` extracted from the inline package.json
  block; the standalone `tsconfig.json`; `.env.example`; full TS type annotations
  on `zFetch`/`parseOrThrow` (the source's pasted `schema.ts` had several generics
  rendered as bare `z.infer` / `Promise>` due to markdown angle-bracket stripping —
  reconstructed to compile); the file tree layout and all §7–§11 sections.
- **Unresolved / caveats:** the source's `zFetch` used a `(e as any).details` /
  `@ts-expect-error` hack to attach debug context — this kit drops the `any` to
  satisfy its own `no-explicit-any` rule (debug detail no longer attached to the
  thrown Error; revisit if you need it). The example route/action require
  `USER_SERVICE_URL` and have no auth — illustrative, not production. No web "best
  practices" were re-fetched during reconstruction. The kit was not executed
  (`pnpm check` not run here); configs are reconstructed to be internally
  consistent but should be validated in a real Next.js repo.
- **Contradictions:** the source contained **two incompatible house styles** — the
  v0.app rules (functional arrow components, *avoid* `React.FC`, named exports,
  default export at bottom forbidden) and a separately-pasted MUI/TanStack frontend
  skill (use `React.FC<Props>`, default export at bottom, `~types`/`~components`
  aliases). They cannot both hold. This kit implements the **v0.app** rules (the
  primary request) and flags the conflict rather than silently merging them.
