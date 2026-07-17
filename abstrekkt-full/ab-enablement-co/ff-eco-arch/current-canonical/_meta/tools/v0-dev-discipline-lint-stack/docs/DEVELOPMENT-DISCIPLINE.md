# v0.app — Development Discipline Guide

> Reconstructed from the source chat's "Development Discipline Guide" (5 pillars +
> implementation considerations). This is the *human* contract the tooling enforces
> mechanically. Read it once; the lint stack keeps you honest after that.

**Mantra:** Be concise. Plan before you implement. Make undefined/null an error to
fix at the root, not a value to tolerate.

---

## 1. TypeScript & Strictness First

- Always write TypeScript. `tsconfig.json` runs with `"strict": true` (plus
  `noUncheckedIndexedAccess`).
- **Never `any`.** If a type is genuinely unknown, type it `unknown` and validate
  with Zod at the boundary, then work with the parsed, typed result.
- Validate every API response (and form/query/env input) with Zod.
- Enforced by ESLint: `@typescript-eslint/no-explicit-any`, the `no-unsafe-*`
  family, `strict-boolean-expressions`, `prefer-nullish-coalescing`.

**Why:** prevents runtime errors, keeps behavior predictable, ships production-grade.

## 2. React & Component Patterns

- Functional components only: `const Component = () => {}`. No `function`
  declarations for components; no `React.FC`.
- Composition over inheritance; small, reusable components.
- Don't overuse `useState`/`useEffect` — derive values in render or compute state.
- `useMemo`/`useCallback` only when there's a measured need.
- Enforced by ESLint: `react/function-component-definition` (arrow-function),
  `react-hooks/rules-of-hooks`, `react-hooks/exhaustive-deps`.

> Note: the source chat contained a *second*, conflicting house style (a
> MUI/TanStack skill that prefers `React.FC` + a default export at the bottom).
> This kit follows the **v0.app rules** (arrow components, named exports). See the
> CLAIMS CHECK in the README. Pick one per repo and delete the other.

## 3. Styling & UI Consistency

- Tailwind CSS by default; shadcn/ui components where available.
- Keep styles colocated with components; follow project tokens/spacing.
- Enforced by Prettier (`prettier-plugin-tailwindcss` sorts classes) and ESLint
  (`tailwindcss/classnames-order`).

## 4. Data Fetching & Server Actions

- Prefer Server Components (Next.js App Router).
- Use server actions + `useActionState` for mutations; fall back to `fetch` +
  route handlers when needed.
- **Always validate data crossing a boundary** — incoming and outgoing.
- Pattern: `zFetch(url, { schema })` for reads, `parseOrThrow(Schema, input)` for
  action inputs. See `lib/schema.ts`.

## 5. Project-Level Discipline

- Colocate components with their usage.
- Look for existing patterns before introducing new ones.
- Treat `undefined`/`null` as bugs to fix at the source, not optional states.
- Default exports allowed **only** in `app/**/page.tsx`, `layout.tsx`,
  `route.ts`, and `pages/**` (Next.js requires them there). Everywhere else use
  named exports for tree-shaking and clarity (`import/no-default-export`).
- Prefer `as const` maps + union literals over `enum` (`no-restricted-syntax`).

---

## Import order (deterministic, enforced)

Groups, blank line between each, alphabetized within group:

```ts
// builtin / framework
import { NextResponse } from 'next/server';
// external
import React from 'react';
// internal (@/components/**, then @/lib/**)
import { Button } from '@/components/ui/button';
import { zFetch } from '@/lib/schema';
// parent / sibling / index
import { helper } from './helper';
// type imports last
import type { UsersPage } from '@/lib/schema';
```

## Validation belongs at I/O edges only

Validate at: request/response JSON, `FormData`, `searchParams`, and
`process.env`. Do **not** re-validate inside hot loops or inner domain logic —
once parsed, data is typed and trusted. This keeps Zod's cost off the hot path.

## Error envelopes

All upstream errors normalize through `ApiErrorSchema` (`code`, `message`,
`details?`). Never render a raw upstream error body to a user — map to a
user-safe message.

## Definition of done (per change)

- `pnpm check` is green (typecheck + lint + format).
- No `any`; no unused imports; imports ordered.
- Every new boundary validates with Zod.
- Tailwind classes sorted by Prettier.
