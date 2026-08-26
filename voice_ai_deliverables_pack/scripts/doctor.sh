#!/usr/bin/env bash
set -euo pipefail

echo "== Claude Code CLI Doctor (non-destructive) =="
echo "Date: $(date)"
echo "PWD:  $(pwd)"
echo "User: $(whoami)"
echo

echo "== Tools =="
command -v git >/dev/null 2>&1 && echo "git: $(git --version)" || echo "git: NOT FOUND"
command -v node >/dev/null 2>&1 && echo "node: $(node --version)" || echo "node: NOT FOUND"
command -v python >/dev/null 2>&1 && echo "python: $(python --version 2>&1 | head -n 1)" || echo "python: NOT FOUND"
command -v claude >/dev/null 2>&1 && echo "claude: $(claude --version 2>&1 || true)" || echo "claude: NOT FOUND on PATH (check install/PATH)"
echo

echo "== Filesystem write test (local ./ .tmp only) =="
TMP_DIR="./.tmp/claude_doctor"
mkdir -p "$TMP_DIR"
TEST_FILE="$TMP_DIR/write_test.txt"
echo "ok $(date)" > "$TEST_FILE"
echo "Wrote: $TEST_FILE"
echo "Read back:"
cat "$TEST_FILE"
echo

echo "== Permissions snapshot =="
ls -la "$TMP_DIR" | sed -n '1,20p'
echo
echo "Doctor completed successfully."
