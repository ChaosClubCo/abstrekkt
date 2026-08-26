#!/bin/bash
# model-string-updater.sh
# Find and replace deprecated Anthropic model strings across all project files
# Run BEFORE any Anthropic model deprecation deadline
# Usage: bash model-string-updater.sh [--dry-run]

set -euo pipefail

# ─────────────────────────────────────────────
# CONFIG — update these when models change
# ─────────────────────────────────────────────

declare -A MODEL_MAP=(
  # [deprecated]="replacement"
  ["claude-sonnet-4-20250514"]="claude-sonnet-4-6"
  ["claude-3-5-sonnet-20241022"]="claude-sonnet-4-6"
  ["claude-3-5-haiku-20241022"]="claude-haiku-4-5-20251001"
  ["claude-3-haiku-20240307"]="claude-haiku-4-5-20251001"
  ["claude-3-opus-20240229"]="claude-sonnet-4-6"
)

# File extensions to scan
EXTENSIONS=("js" "ts" "jsx" "tsx" "json" "md" "html" "py" "env")

# Directories to skip
SKIP_DIRS=("node_modules" ".git" ".next" "dist" "build" ".cache")

# ─────────────────────────────────────────────
# FLAGS
# ─────────────────────────────────────────────

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "🔍 DRY RUN MODE — no files will be modified"
fi

# ─────────────────────────────────────────────
# BUILD FIND COMMAND
# ─────────────────────────────────────────────

FIND_CMD="find . -type f"
for dir in "${SKIP_DIRS[@]}"; do
  FIND_CMD+=" ! -path './${dir}/*'"
done

EXT_EXPR=""
for i in "${!EXTENSIONS[@]}"; do
  if [ $i -eq 0 ]; then
    EXT_EXPR+=" -name '*.${EXTENSIONS[$i]}'"
  else
    EXT_EXPR+=" -o -name '*.${EXTENSIONS[$i]}'"
  fi
done
FIND_CMD+=" \( ${EXT_EXPR} \)"

# ─────────────────────────────────────────────
# SCAN + REPLACE
# ─────────────────────────────────────────────

TOTAL_REPLACEMENTS=0
AFFECTED_FILES=()

echo ""
echo "🤖 MODEL STRING UPDATER"
echo "─────────────────────────────────────────"

for OLD_MODEL in "${!MODEL_MAP[@]}"; do
  NEW_MODEL="${MODEL_MAP[$OLD_MODEL]}"

  # Find files containing the old model string
  while IFS= read -r file; do
    if grep -q "$OLD_MODEL" "$file" 2>/dev/null; then
      COUNT=$(grep -c "$OLD_MODEL" "$file" || true)
      echo "  Found: $file ($COUNT occurrence(s))"
      echo "    $OLD_MODEL → $NEW_MODEL"
      AFFECTED_FILES+=("$file")
      TOTAL_REPLACEMENTS=$((TOTAL_REPLACEMENTS + COUNT))

      if [ "$DRY_RUN" = false ]; then
        # macOS compatible sed
        if [[ "$OSTYPE" == "darwin"* ]]; then
          sed -i '' "s|${OLD_MODEL}|${NEW_MODEL}|g" "$file"
        else
          sed -i "s|${OLD_MODEL}|${NEW_MODEL}|g" "$file"
        fi
      fi
    fi
  done < <(eval "$FIND_CMD" 2>/dev/null)
done

# ─────────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────────

echo ""
echo "─────────────────────────────────────────"

if [ $TOTAL_REPLACEMENTS -eq 0 ]; then
  echo "✅ No deprecated model strings found."
else
  UNIQUE_FILES=$(printf '%s\n' "${AFFECTED_FILES[@]}" | sort -u | wc -l | tr -d ' ')
  if [ "$DRY_RUN" = true ]; then
    echo "🔍 Would replace $TOTAL_REPLACEMENTS string(s) across $UNIQUE_FILES file(s)"
    echo "   Run without --dry-run to apply changes"
  else
    echo "✅ Replaced $TOTAL_REPLACEMENTS string(s) across $UNIQUE_FILES file(s)"
  fi
fi

echo ""

# ─────────────────────────────────────────────
# PRO MOVE: Add this to CI/CD pre-deploy check:
#   bash scripts/model-string-updater.sh --dry-run
# Fail the build if any deprecated strings found.
# ─────────────────────────────────────────────
