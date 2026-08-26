#!/usr/bin/env bash
# scripts/import-repo.sh
# Import ONE GitHub repository into the monorepo.
# Usage: ./import-repo.sh <github-url> <target-directory> [priority]
#
# SAFETY (this kit's hardening over the source sketch):
#  - Imported code is treated as UNTRUSTED. We rsync source WITHOUT .git and
#    never run its build/postinstall. Run `pnpm install --ignore-scripts` after.
#  - CONSOLIDATION_LOG.md is append-only.
#  - Set PRESERVE_HISTORY=true to keep git history via git-filter-repo (P0 only).
set -euo pipefail

REPO_URL="${1:-}"
TARGET_DIR="${2:-}"
PRIORITY="${3:-P3}"
MONOREPO_ROOT="$(git rev-parse --show-toplevel)"

if [ -z "$REPO_URL" ] || [ -z "$TARGET_DIR" ]; then
  echo "Usage: ./import-repo.sh <github-url> <target-directory> [priority]" >&2
  exit 1
fi

REPO_NAME="$(basename "$REPO_URL" .git)"
TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/monorepo-import-XXXXXX")"
trap 'rm -rf "$TMP_DIR"' EXIT

echo "==> Importing $REPO_NAME to $TARGET_DIR (priority: $PRIORITY)"

if [ -e "$MONOREPO_ROOT/$TARGET_DIR" ] && [ -n "$(ls -A "$MONOREPO_ROOT/$TARGET_DIR" 2>/dev/null | grep -v '.gitkeep' || true)" ]; then
  echo "    Refusing: $TARGET_DIR already has content. Remove it or pick a new target." >&2
  exit 2
fi

echo "    Cloning..."
git clone --depth 1 "$REPO_URL" "$TMP_DIR/$REPO_NAME"

if [ "${PRESERVE_HISTORY:-false}" = "true" ]; then
  echo "    Preserving git history (git filter-repo)..."
  ( cd "$TMP_DIR/$REPO_NAME" \
    && git fetch --unshallow 2>/dev/null || true \
    && git filter-repo --to-subdirectory-filter "$TARGET_DIR" --force )
fi

echo "    Copying source (excluding .git)..."
mkdir -p "$MONOREPO_ROOT/$TARGET_DIR"
rsync -a --exclude='.git' "$TMP_DIR/$REPO_NAME/" "$MONOREPO_ROOT/$TARGET_DIR/"

# Normalize package.json name/version and record provenance.
PKG="$MONOREPO_ROOT/$TARGET_DIR/package.json"
if [ -f "$PKG" ] && command -v jq >/dev/null 2>&1; then
  echo "    Patching package.json (name, version, original_repo)..."
  jq --arg name "$REPO_NAME" --arg url "$REPO_URL" '
    .name = $name
    | .version = "0.0.0-monorepo"
    | .original_repo = $url
  ' "$PKG" > "$PKG.tmp.$$" && mv "$PKG.tmp.$$" "$PKG"
fi

echo "    Logging import (append-only)..."
printf '| %s | import | %s | %s | %s | imported |\n' \
  "$(date +%Y-%m-%d)" "$REPO_NAME" "$TARGET_DIR" "$PRIORITY" \
  >> "$MONOREPO_ROOT/CONSOLIDATION_LOG.md"

echo "==> Done: $REPO_NAME -> $TARGET_DIR"
echo "    Next: review the code, then 'pnpm install --ignore-scripts' before any build."
