#!/usr/bin/env bash
# ============================================================
#  Skills Library Pipeline
#  Run: ./run-pipeline.sh
# ============================================================
#
#  What it does:
#    Runs the full update pipeline (quality fixes, platform sync,
#    bundle population) in order. Takes ~2-5 minutes.
#
#  Options (pass as arguments):
#    --dry-run              Preview without changing files
#    --skip quality         Skip quality fixes
#    --skip populate        Skip bundle population
#    --only sync            Run only the sync step
#
#  Examples:
#    ./run-pipeline.sh
#    ./run-pipeline.sh --dry-run
#    ./run-pipeline.sh --only sync
#
# ============================================================

set -e

# Move to project root (where this script lives)
cd "$(dirname "$0")"

# Set encoding for consistency
export PYTHONIOENCODING=utf-8

# Check Python is available
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo ""
    echo "ERROR: Python not found. Install Python 3.10+ from https://python.org"
    echo ""
    exit 1
fi

# Use python3 if available, otherwise python
PYTHON=$(command -v python3 || command -v python)

echo ""
echo "Starting Skills Library Pipeline..."
echo ""

"$PYTHON" scripts/pipeline.py "$@"

echo ""
echo "Pipeline complete!"
echo ""
