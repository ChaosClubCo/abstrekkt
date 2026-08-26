# File 02 — Enterprise Profile Builder · consolidation manifest

## Canonical tree = ROOT (verified by import wiring)
`App.tsx → contexts/* → components/layout/MainLayout → components/ContentViewer`,
which imports `../features/*` and `./sections/*`. **Nothing imports `/src/*`.**
The entire `/src/*` subtree is an abandoned duplicate — including the dangerous
in-browser Claude client (`/src/lib/api/claude-client.ts`).

## DELETE — duplicate `/src` tree (dead)
```
src/features/**          # parallel copies of deployment / operations / roi
src/components/**         # duplicate ui/Badge, ui/ProgressBar
src/contexts/**           # duplicate NavigationContext
src/hooks/**              # duplicate useLocalStorage, useRouter
src/lib/**                # incl. lib/api/claude-client.ts (browser SDK + key — DANGEROUS)
src/utils/**              # duplicate analytics / search / storage
src/types/**              # duplicate types
src/docs/**               # phase-log markdown
src/CURRENT_ROADMAP.md
```

## DE-DUPLICATE types → one file
Three+ copies exist: `/types.ts`, `/types/index.ts`, `/types/domain.ts`,
`/types/ui.ts`, plus `/src/types/index.ts`. Keep a single `/types/index.ts`
(re-export domain + ui from it) and update imports to `@/types`.

## KEEP — canonical
```
App.tsx, contexts/*, components/* (layout, ui, sections, common, controls)
features/* (dashboard, deployment, operations, library, ecosystem, integrations,
            agents, roles, governance, comparison, compliance, roi, strategy,
            assessment, search, settings, faq, knowledge-base, best-practices)
data/*, hooks/*, lib/* (root), providers/*, services/*, styles/*
supabase/functions/server/*   ← use the HARDENED index.tsx from remediation/
```

## SECURITY follow-through (from the remediation package)
- Delete `/src/lib/api/claude-client.ts` (gone with `/src`). If the canonical app
  needs Claude, use `remediation/enterprise/src/lib/api/claude-client.ts` (keyless proxy).
- Replace `supabase/functions/server/index.tsx` with the hardened version.
- The 616-line `security/prompt-injection-defense.ts` returns a **mock** and is
  bypassed by the live client → **delete it** or wire `executeSafely` to the proxy.
  Do not ship it as-is; it manufactures false confidence.

## DOCS — evict ~40 phase-logs
Keep `README.md` + one `docs/ARCHITECTURE.md`. Delete the rest
(`PHASES*.md`, `PHASE_*_*.md`, `*_COMPLETE*.md`, `AUDIT_*`, `MASTER_INDEX.md`,
`IMPLEMENTATION_*`, etc.).

## IDENTITY
Pick one name. Code currently says **INT Inc.** (sidebar + footer), thumbnail says
**FF Inc.**, title says **Enterprise Claude Profile Builder**. Choose, then
find-replace across the repo.
