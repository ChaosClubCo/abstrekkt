#!/usr/bin/env bash
# Compatibility entrypoint. Source selection and copying are fail-closed in Python.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
exec python3 "$REPO_ROOT/scripts/extract_subtree.py" "$@"
