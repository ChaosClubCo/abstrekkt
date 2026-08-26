#!/usr/bin/env bash

# Test script for print_figma_prompts.js
#
# This script invokes the print_figma_prompts.js script and ensures
# that it outputs the Figma prompts. If the output is empty or the
# script fails, an error message is printed and the exit status is
# non‑zero.

set -euo pipefail

# Run the print_figma_prompts script and capture its output. Using
# command substitution preserves newlines.
OUTPUT=$(node "$(dirname "$0")/../scripts/print_figma_prompts.js")

# Verify that the output is not empty. If empty, report failure.
if [[ -z "$OUTPUT" ]]; then
  echo "Figma prompts file is empty or failed to load." >&2
  exit 1
fi

# Print the prompts to stdout so the caller can see them. Piping
# directly to stdout preserves formatting.
printf '%s\n' "$OUTPUT"