#!/usr/bin/env python3
"""
Fix claude-skills-desktop structure.

This script:
1. Backs up the broken claude-skills-desktop directory
2. Deletes the old broken structure
3. Regenerates claude-skills-desktop with the correct structure

Run with: python scripts/fix-claude-desktop.py
"""

import shutil
import sys
from pathlib import Path

# Add project root to path for imports
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import importlib.util

_spec = importlib.util.spec_from_file_location("populate_all", Path(__file__).parent / "populate-all.py")
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)

discover_all_skills = _mod.discover_all_skills
populate_claude_desktop = _mod.populate_claude_desktop
CLAUDE_DESKTOP = _mod.CLAUDE_DESKTOP


def main():
    print("=" * 70)
    print("claude-skills-desktop Structure Fix")
    print("=" * 70)

    # Check if broken structure exists
    if not CLAUDE_DESKTOP.exists():
        print(f"\n❌ claude-skills-desktop not found at: {CLAUDE_DESKTOP}")
        print("Nothing to fix!")
        return

    # Backup old broken directory
    backup_path = CLAUDE_DESKTOP.parent / "claude-skills-desktop.broken-backup"
    if backup_path.exists():
        print(f"\n⚠️  Backup already exists at: {backup_path}")
        response = input("Delete existing backup? (y/N): ")
        if response.lower() != 'y':
            print("Aborted.")
            return
        shutil.rmtree(backup_path)

    print(f"\n📦 Backing up broken structure to: {backup_path.name}")
    shutil.move(str(CLAUDE_DESKTOP), str(backup_path))
    print("✓ Backup complete")

    # Discover all skills
    print("\n🔍 Discovering skills from _master-skills/...")
    skills = discover_all_skills()
    print(f"✓ Found {len(skills)} skills")

    # Regenerate with fixed structure
    print("\n🔧 Regenerating claude-skills-desktop with fixed structure...")
    count = populate_claude_desktop(skills, dry_run=False)
    print(f"✓ Created {count} skills")

    # Verify the fix
    print("\n✅ Verification:")

    # Check root plugin.json
    root_plugin = CLAUDE_DESKTOP / "plugin.json"
    if root_plugin.exists():
        print(f"  ✓ Root plugin.json exists: {root_plugin}")
    else:
        print("  ❌ Root plugin.json missing!")

    # Check a sample skill structure
    skills_dir = CLAUDE_DESKTOP / ".claude-plugin" / "skills"
    sample_skills = list(skills_dir.glob("*"))[:3]

    print("\n  Sample skill structures (first 3):")
    for skill_dir in sample_skills:
        skill_md = skill_dir / "SKILL.md"
        nested_plugin = skill_dir / ".claude-plugin"

        if skill_md.exists():
            print(f"    ✓ {skill_dir.name}/SKILL.md")
        else:
            print(f"    ❌ {skill_dir.name}/SKILL.md MISSING")

        if nested_plugin.exists():
            print(f"    ⚠️  {skill_dir.name}/.claude-plugin STILL EXISTS (should not!)")

    print("\n" + "=" * 70)
    print("Fix complete!")
    print("=" * 70)
    print(f"\nOld broken structure backed up at: {backup_path}")
    print(f"New correct structure at: {CLAUDE_DESKTOP}")
    print("\nExpected structure:")
    print("  claude-skills-desktop/")
    print("    plugin.json")
    print("    .claude-plugin/")
    print("      skills/")
    print("        {slug}/")
    print("          SKILL.md")


if __name__ == "__main__":
    main()
