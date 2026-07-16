#!/usr/bin/env bash
# FlashFusion Website — keep apps/site (Next.js); remove the abandoned Vite app
# and the off-domain audio marketplace. Run from the repo root.
set -euo pipefail

echo "Removing abandoned root Vite app…"
rm -rf src/core src/lib lib/env.ts lib/config.ts \
  components/landing components/ui packages/config \
  styles/figma-enhancements.css styles/accessibility-fixes.css \
  utils/accessibility-checker.ts

echo "Removing off-domain audio marketplace components…"
rm -rf components/studio

echo "Evicting narration docs (keep README + one deploy guide)…"
find . -maxdepth 2 -type f \( \
  -name '*_ADDED.md' -o -name '*_COMPLETE*.md' -o -name 'FIGMA_*.md' \
  -o -name '*_FIX_*.md' -o -name 'PHASE_*.md' -o -name 'OPTIMIZATION_*.md' \
  -o -name 'FLASHFUSION_*_PROMPT.md' -o -name '*_GUIDE.md' \
\) ! -path './node_modules/*' ! -path './apps/*' -print -delete

echo "Applying code fixes…"
echo "  • copy remediation/cleanup/website/actions.ts        -> apps/site/app/actions.ts"
echo "  • copy remediation/website/apps/site/middleware.ts   -> apps/site/middleware.ts"
echo "  • copy remediation/website/.env.example              -> .env.example"

echo "Done. With one app left, update turbo.json/root package.json"
echo "or flatten apps/site/* to the repo root."
