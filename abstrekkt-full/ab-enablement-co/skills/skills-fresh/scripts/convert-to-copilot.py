#!/usr/bin/env python3
"""
convert_to_copilot.py - Thin wrapper for Copilot conversion

This is a Python replacement for convert-to-copilot.js that delegates to
the CopilotConverter in sync-skills.py.

IMPORTANT: This wrapper only creates the custom-instructions format (1 of 3).
The JS converter creates 3 formats:
  1. custom-instructions/{category}/{slug}.md        - ✓ Created by this wrapper
  2. agent-skills/{category}/{slug}/SKILL.md         - ✗ Not created (JS only)
  3. instructions/{category}-{slug}.instructions.md  - ✗ Not created (JS only)

To create all 3 formats, use the original JS converter:
    node convert-to-copilot.js

Usage:
    python convert_to_copilot.py                    # Convert all skills
    python convert_to_copilot.py --dry-run          # Preview changes
    python convert_to_copilot.py --validate         # Run validation
    python convert_to_copilot.py --stats            # Show statistics
    python convert_to_copilot.py --skill technical/api-development
    python convert_to_copilot.py --category ai-agents

This wrapper uses the shared Python infrastructure in sync-skills.py,
enabling integration with lib/ modules (platform_tuning, metadata_enricher,
skill_validator) that the JS converter cannot access.
"""

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))


def main():
    """Parse arguments and delegate to sync-skills.py with copilot target."""
    parser = argparse.ArgumentParser(
        description="Convert master skills to GitHub Copilot format (wrapper for sync-skills.py)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
examples:
  python convert_to_copilot.py
  python convert_to_copilot.py --dry-run
  python convert_to_copilot.py --validate --stats
  python convert_to_copilot.py --skill technical/api-development
  python convert_to_copilot.py --category ai-agents

This script is a thin wrapper that calls:
  python sync-skills.py --targets copilot [options]
        """,
    )

    parser.add_argument(
        "--skill",
        help="Convert a specific skill (e.g., technical/api-development)",
    )
    parser.add_argument(
        "--category",
        help="Convert a specific category (e.g., ai-agents)",
    )
    parser.add_argument(
        "--validate",
        action="store_true",
        help="Run skill validation before converting",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be converted without writing files",
    )
    parser.add_argument(
        "--stats",
        action="store_true",
        help="Show conversion statistics",
    )

    args = parser.parse_args()

    # Import and use sync-skills.py's infrastructure
    try:
        # Add project root to path to import sync-skills module
        current_dir = Path(__file__).parent.parent.resolve()
        sys.path.insert(0, str(current_dir))

        # Import the syncer (sync-skills module)
        # We can't import it directly as "sync-skills" due to the hyphen,
        # so we'll use importlib
        import importlib.util
        sync_skills_path = current_dir / "scripts" / "sync-skills.py"

        if not sync_skills_path.exists():
            print(f"Error: sync-skills.py not found at {sync_skills_path}", file=sys.stderr)
            print("This wrapper requires sync-skills.py to be in the scripts/ directory.", file=sys.stderr)
            sys.exit(1)

        spec = importlib.util.spec_from_file_location("sync_skills", sync_skills_path)
        sync_skills = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(sync_skills)

    except Exception as e:
        print(f"Error loading sync-skills.py: {e}", file=sys.stderr)
        sys.exit(1)

    # Create syncer instance
    syncer = sync_skills.SkillsSyncer(current_dir)
    targets = ['copilot']

    # Print header
    print("=" * 60)
    print("  GitHub Copilot Skill Converter (Python)")
    print("=" * 60)
    print("  Using: sync-skills.py CopilotConverter")
    print(f"  Output: {current_dir / 'platforms' / 'github-copilot' / 'copilot-skills'}")
    print(f"  Format: custom-instructions/{'{category}'}/{'{slug}'}.md")
    print()
    print("  Note: This creates only custom-instructions format.")
    print("        For agent-skills and path-specific instructions,")
    print("        use: node convert-to-copilot.js")
    print()

    # Common kwargs for sync methods
    common_kwargs = {
        'validate': args.validate,
        'dry_run': args.dry_run,
        'show_stats': args.stats,
    }

    # Dispatch to appropriate sync method
    try:
        if args.skill:
            syncer.sync_skill(args.skill, targets, **common_kwargs)
        elif args.category:
            syncer.sync_category(args.category, targets, **common_kwargs)
        else:
            syncer.sync_all(targets, **common_kwargs)
    except Exception as e:
        print(f"Error during conversion: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)

    print()
    print("  Conversion complete.")
    print()


if __name__ == "__main__":
    main()
