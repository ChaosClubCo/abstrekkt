#!/usr/bin/env python3
"""
Unified pipeline script for the Skills Library.

Runs all three pipeline steps in order:
  1. quality  - fix-skills-unified.py --all
  2. sync     - sync-skills.py --targets all --validate --stats
  3. populate - populate-all.py --phase all

Usage:
    python scripts/pipeline.py                        # Full pipeline
    python scripts/pipeline.py --dry-run              # Preview all steps
    python scripts/pipeline.py --only sync            # Just sync step
    python scripts/pipeline.py --skip quality         # Skip quality fixes
    python scripts/pipeline.py --skip quality,populate # Skip multiple steps

Maintenance:
    This script is a thin orchestrator — it shells out to the real scripts
    as subprocesses. If it breaks, check:

    1. Script renamed or moved?  Update the "script" field in STEPS below.
    2. Script CLI changed?       Update the "args" list in STEPS below.
    3. New step needed?          Add a dict to STEPS in the correct order.
    4. Step removed?             Delete its dict from STEPS.
    5. --dry-run not working?    The sub-script must accept --dry-run as a flag.
    6. Encoding errors?          Set PYTHONIOENCODING=utf-8 (Windows).
    7. ModuleNotFoundError?      Run from the project root, not scripts/.

    When you change STEPS, also update:
    - .claude/CLAUDE.md          (Critical Scripts table + Key Commands)
    - docs/06-admin-guide/pipeline-operations.md  (step table + examples)
"""

import argparse
import subprocess
import sys
import time
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent

# === STEPS CONFIG ===
# To keep current: edit this list when scripts change.
# Also update: .claude/CLAUDE.md, docs/06-admin-guide/pipeline-operations.md
# Fields:
#   name        - used by --skip/--only flags (must be unique)
#   script      - filename in scripts/ dir (must exist, must accept --dry-run)
#   args        - default CLI args passed to the script
#   description - human label for console output
STEPS = [
    {
        "name": "quality",
        "script": "fix-skills-unified.py",
        "args": ["--all"],
        "description": "Quality fixes (frontmatter/structure repair)",
    },
    {
        "name": "sync",
        "script": "sync-skills.py",
        "args": ["--targets", "all", "--validate", "--stats"],
        "description": "Platform sync (master → all platform formats)",
    },
    {
        "name": "populate",
        "script": "populate-all.py",
        "args": ["--phase", "all"],
        "description": "Populate (bundles, variants, cleanup)",
    },
]

STEP_NAMES = [s["name"] for s in STEPS]


def parse_args():
    parser = argparse.ArgumentParser(
        description="Unified pipeline for the Skills Library.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Pass --dry-run to all sub-steps",
    )
    parser.add_argument(
        "--skip",
        type=str,
        default="",
        help="Comma-separated step names to skip (e.g. quality,populate)",
    )
    parser.add_argument(
        "--only",
        type=str,
        default="",
        help="Run only this single step (e.g. sync)",
    )
    return parser.parse_args()


def resolve_steps(args):
    """Return the list of steps to run based on --skip and --only flags."""
    if args.only:
        name = args.only.strip()
        if name not in STEP_NAMES:
            print(f"Error: unknown step '{name}'. Valid steps: {', '.join(STEP_NAMES)}")
            sys.exit(1)
        return [s for s in STEPS if s["name"] == name]

    if args.skip:
        skip_names = [n.strip() for n in args.skip.split(",")]
        for name in skip_names:
            if name not in STEP_NAMES:
                print(f"Error: unknown step '{name}'. Valid steps: {', '.join(STEP_NAMES)}")
                sys.exit(1)
        return [s for s in STEPS if s["name"] not in skip_names]

    return list(STEPS)


def run_step(step, dry_run=False):
    """Run a single pipeline step as a subprocess. Returns elapsed seconds."""
    script_path = SCRIPTS_DIR / step["script"]
    cmd = [sys.executable, str(script_path)] + step["args"]
    if dry_run:
        cmd.append("--dry-run")

    print(f"\n{'=' * 60}")
    print(f"  Step: {step['name']} — {step['description']}")
    print(f"  Command: {' '.join(cmd)}")
    print(f"{'=' * 60}\n")

    start = time.time()
    result = subprocess.run(cmd)
    elapsed = time.time() - start

    return result.returncode, elapsed


def main():
    args = parse_args()
    steps = resolve_steps(args)

    mode = " (dry-run)" if args.dry_run else ""
    print(f"\n>>> Skills Library Pipeline{mode}")
    print(f">>> Steps to run: {', '.join(s['name'] for s in steps)}\n")

    total_start = time.time()
    timings = []

    for step in steps:
        returncode, elapsed = run_step(step, dry_run=args.dry_run)
        timings.append((step["name"], elapsed))

        if returncode != 0:
            print(f"\n!!! Step '{step['name']}' failed with exit code {returncode}. Pipeline stopped.")
            sys.exit(returncode)

        print(f"\n--- Step '{step['name']}' completed in {elapsed:.1f}s ---")

    total_elapsed = time.time() - total_start

    print(f"\n{'=' * 60}")
    print("  Pipeline Summary")
    print(f"{'=' * 60}")
    for name, elapsed in timings:
        print(f"  {name:12s}  {elapsed:7.1f}s")
    print(f"  {'—' * 22}")
    print(f"  {'total':12s}  {total_elapsed:7.1f}s")
    print(f"{'=' * 60}\n")


if __name__ == "__main__":
    main()
