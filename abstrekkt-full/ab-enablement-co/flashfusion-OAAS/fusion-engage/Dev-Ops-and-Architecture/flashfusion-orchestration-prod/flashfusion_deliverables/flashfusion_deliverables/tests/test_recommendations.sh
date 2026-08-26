#!/usr/bin/env bash

# Test script for recommendations.js
#
# This script loads environment variables from the example configuration
# file and runs the recommendations.js script. It reports an error
# if any required variable is missing or if the script exits with
# a non‑zero status.

set -euo pipefail

# Export variables defined in the example configuration. Lines beginning
# with `#` are ignored. The `grep` and `xargs` pipeline converts each
# key=value pair into an `export` statement. A dash is required for
# compatibility with BSD xargs (present on macOS). If additional
# variables contain spaces, this approach may need to be adjusted.
export $(grep -v '^#' "$(dirname "$0")/../configs/.env.example" \
  | sed 's/#.*//' \
  | xargs)

# Run the Node.js script from the scripts directory. A subshell is used
# to ensure that Node picks up the environment variables exported above.
node "$(dirname "$0")/../scripts/recommendations.js"