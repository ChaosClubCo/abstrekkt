#!/usr/bin/env bash
set -euo pipefail

# Run Lighthouse CI against a local preview server
# Usage: ./scripts/lighthouse-check.sh [url]

URL="${1:-http://localhost:4173}"

echo "Running Lighthouse against $URL..."

npx @lhci/cli@0.14.x autorun \
  --collect.url="$URL" \
  --collect.numberOfRuns=3 \
  --assert.preset=lighthouse:recommended \
  --assert.assertions.categories:pwa=error \
  --assert.assertions.categories:performance=warn \
  --upload.target=temporary-public-storage

echo "Lighthouse check complete."
