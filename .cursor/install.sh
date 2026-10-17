#!/usr/bin/env bash
# Abstrekkt Cloud Agent install.
#
# Prepares Node dependencies for the repository's runnable, secret-free Node
# projects so a fresh Cloud Agent can build and run them immediately:
#   - rendered/                       markdown -> print-ready HTML publishing renderer
#   - Unicorn-maybe/flashfusion-web/  Next.js marketing site (frontend-only MVP)
#
# Idempotent: uses `npm ci` against each project's committed lockfile when
# present, falling back to `npm install`. Runs no build, no dev server, and
# regenerates no committed output. Projects that require secrets (e.g.
# a2alayer/a2a-layer) are intentionally excluded from automatic bootstrap.
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

install_project() {
  local dir="$1"
  local path="$repo_root/$dir"
  if [ ! -f "$path/package.json" ]; then
    echo ">> skip $dir (no package.json)"
    return 0
  fi
  if [ -f "$path/package-lock.json" ]; then
    echo ">> npm ci in $dir"
    (cd "$path" && npm ci --no-audit --no-fund)
  else
    echo ">> npm install in $dir"
    (cd "$path" && npm install --no-audit --no-fund)
  fi
}

install_project "rendered"
install_project "Unicorn-maybe/flashfusion-web"

echo ">> Abstrekkt install complete"
