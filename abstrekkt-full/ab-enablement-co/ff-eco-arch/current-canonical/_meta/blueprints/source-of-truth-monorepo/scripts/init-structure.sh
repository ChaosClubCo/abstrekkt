#!/usr/bin/env bash
# scripts/init-structure.sh
# Creates the empty source-of-truth-monorepo directory skeleton + bootstrap files.
# Idempotent: safe to re-run. Creates nothing destructive.
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

echo "Initializing monorepo skeleton in: $ROOT"

DIRS=(
  "projects/krosebrook/core"
  "projects/krosebrook/apps"
  "projects/krosebrook/tools"
  "projects/krosebrook/ai"
  "projects/krosebrook/automation"
  "projects/krosebrook/creative"
  "projects/krosebrook/business"
  "projects/krosebrook/infrastructure"
  "projects/krosebrook/security"
  "projects/krosebrook/mcp"
  "projects/krosebrook/shared"
  "projects/flashfusionv1"
  "projects/chaosclubco"
  "templates"
  "infrastructure/terraform"
  "infrastructure/kubernetes"
  "infrastructure/security"
  "docs/architecture"
  "docs/guides"
  "docs/api"
  "docs/tutorials"
  "archive"
  ".github/workflows"
)

for d in "${DIRS[@]}"; do
  mkdir -p "$d"
  # .gitkeep so empty workspace dirs are tracked (pnpm globs tolerate empties)
  [ -e "$d/.gitkeep" ] || touch "$d/.gitkeep"
done

# Append-only ledger files — create only if absent so we never clobber history.
[ -f CONSOLIDATION_LOG.md ] || cat > CONSOLIDATION_LOG.md <<'EOF'
# Consolidation Log

Append-only ledger of every import and archive. Do not edit prior lines.

| date | action | repo | target / archive path | priority | notes |
|------|--------|------|------------------------|----------|-------|
EOF

[ -f .env.example ] || cat > .env.example <<'EOF'
# Copy to .env and fill in. NEVER commit .env.
# Turborepo remote cache (optional)
TURBO_TOKEN=
TURBO_TEAM=
# GitHub CLI auth is read from `gh auth login`, not from here.
EOF

echo "Done. Directory skeleton + CONSOLIDATION_LOG.md + .env.example ready."
echo "Next: pnpm install   (then) python3 scripts/consolidate.py --plan IMPORT_PLAN.csv --dry-run"
