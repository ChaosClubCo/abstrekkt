#!/usr/bin/env bash
set -euo pipefail

# 1) Docs lint
npm run docs:lint

# 2) Smoke curl
curl -sS http://localhost:${PORT:-5173}/health | grep '"ok":true'

# 3) JSON schema check
curl -sS http://localhost:${PORT:-5173}/api/generate/lesson -X POST       -H 'Content-Type: application/json'       -d '{"topic":"Photosynthesis","level":"Grade 6"}' | jq 'has("objectives")'

echo "Verification passed."
