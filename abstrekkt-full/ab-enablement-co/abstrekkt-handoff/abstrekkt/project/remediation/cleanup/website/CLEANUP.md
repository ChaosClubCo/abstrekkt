# File 03 — FlashFusion Website · cleanup manifest

## Three codebases shipped together. Keep ONE.
- **KEEP → `apps/site/**`** — the working Next.js App Router marketing site
  (own `package.json`, pages, server actions, middleware, tests).
- **DELETE → the abandoned root Vite app** (pre-monorepo-migration leftovers).
- **DELETE → `components/studio/**`** — an audio/music marketplace (samples,
  presets, payouts). Wrong product domain; imports `ui/*` primitives not present.

## DELETE — abandoned Vite app + off-domain code
```
src/core/**                 # FlashFusionCore + custom router/system (imports ~8 missing files)
components/studio/**         # off-domain audio marketplace, broken imports
components/landing/**        # VeteranLandingPage — part of the dead Vite app (apps/site has its own home)
components/ui/OptimizedImage.tsx   # belongs to the Vite app; apps/site has its own components
lib/env.ts                  # browser-secret leak (replaced — see remediation/website/lib/env.ts)
lib/config.ts               # Vite-app config
src/lib/env.ts
styles/figma-enhancements.css, styles/accessibility-fixes.css   # Vite-app styles
utils/accessibility-checker.ts
packages/config/**          # only needed if you keep a second app
```

## KEEP — product + repo hygiene
```
apps/site/**                          # the site (canonical)
.github/workflows/**                  # CodeQL, gitleaks, RLS, visual, deps — keep all
.gitleaks.toml
docs/events.contract.json, docs/repo-inventory.schema.json
supabase/tests/**                     # RLS tests
deploy/* , vercel-site.json, netlify.toml, render.yaml   # for apps/site
```

## CODE FIXES (drop-ins in remediation/)
```
apps/site/app/actions.ts     → remediation/cleanup/website/actions.ts   (client-side gtag fix)
apps/site/middleware.ts      → remediation/website/apps/site/middleware.ts (nonce CSP + HSTS)
```

## MONOREPO
With one app left, either:
- keep `apps/site` as the single workspace (update `turbo.json`/root `package.json`), or
- flatten `apps/site/*` to the repo root and drop turbo.

## DOCS — evict ~60 narration files
Delete the `*_ADDED.md` / `*_COMPLETE.md` pairs, `FIGMA_*`, `*_FIX_*`, `PHASE_*`,
`OPTIMIZATION_*`, `DEPLOYMENT_*` (keep one), `FLASHFUSION_*_PROMPT.md`, etc.
Keep one `README.md` + one deploy guide.
