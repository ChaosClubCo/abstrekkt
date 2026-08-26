#!/usr/bin/env bash
# Enterprise Profile Builder — remove the abandoned /src duplicate tree + phase-logs.
# Run from the repo root. Review `git status` before committing.
set -euo pipefail

echo "Removing duplicate /src tree (canonical app lives at repo root)…"
rm -rf \
  src/features src/components src/contexts src/hooks \
  src/lib src/utils src/types src/docs \
  src/CURRENT_ROADMAP.md

echo "Removing security theatre (mock pipeline that is bypassed in the live path)…"
# Keep ONLY if you wire executeSafely() to the real proxy. Otherwise delete:
rm -f security/prompt-injection-defense.ts security/prompt-injection-defense.test.ts

echo "Evicting phase-log markdown (keep README + docs/ARCHITECTURE.md)…"
find . -maxdepth 2 -type f \( \
  -name 'PHASE*_*.md' -o -name 'PHASES*.md' -o -name '*_COMPLETE*.md' \
  -o -name 'AUDIT_*.md' -o -name 'COMPLETE_*.md' -o -name 'IMPLEMENTATION_*.md' \
  -o -name 'MASTER_INDEX.md' -o -name 'PHASES_7_TO_11_*.md' \
\) ! -path './node_modules/*' -print -delete

echo "Done. Next:"
echo "  1) Consolidate types into one /types/index.ts and fix imports."
echo "  2) Drop in remediation/enterprise/supabase/functions/server/index.tsx"
echo "  3) Settle the product name (INT Inc. / FF Inc. / Claude Profile Builder)."
