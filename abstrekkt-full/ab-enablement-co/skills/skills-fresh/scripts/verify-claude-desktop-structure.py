#!/usr/bin/env python3
"""
Verify claude-skills-desktop structure without making changes.

This script checks the current structure and reports issues.
"""

from pathlib import Path

CLAUDE_DESKTOP = Path("D:/03_Development/Skills/platforms/claude/claude-skills-desktop")


def verify_structure():
    print("=" * 70)
    print("claude-skills-desktop Structure Verification")
    print("=" * 70)

    if not CLAUDE_DESKTOP.exists():
        print(f"\n❌ claude-skills-desktop not found at: {CLAUDE_DESKTOP}")
        return

    # Check root plugin.json
    root_plugin = CLAUDE_DESKTOP / "plugin.json"
    print("\n1. Root plugin.json")
    if root_plugin.exists():
        print(f"   ✓ EXISTS: {root_plugin}")
        import json
        with open(root_plugin, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"   Content: {json.dumps(data, indent=2)}")
    else:
        print(f"   ❌ MISSING: {root_plugin}")
        print("   Expected: plugin.json at root with skills_dir metadata")

    # Check skills directory
    skills_dir = CLAUDE_DESKTOP / ".claude-plugin" / "skills"
    print("\n2. Skills directory structure")

    if not skills_dir.exists():
        print(f"   ❌ Skills dir missing: {skills_dir}")
        return

    all_skills = list(skills_dir.glob("*"))
    print(f"   ✓ Found {len(all_skills)} skill directories")

    # Sample 5 skills
    sample_skills = all_skills[:5]

    print("\n3. Sample skill structures (first 5):")

    issues = []

    for skill_dir in sample_skills:
        if not skill_dir.is_dir():
            continue

        skill_name = skill_dir.name
        skill_md = skill_dir / "SKILL.md"
        nested_plugin_dir = skill_dir / ".claude-plugin"

        # Check for correct structure
        correct = skill_md.exists() and not nested_plugin_dir.exists()

        if correct:
            print(f"   ✓ {skill_name}/")
            print("       SKILL.md: EXISTS")
        else:
            print(f"   ❌ {skill_name}/")

            if skill_md.exists():
                print("       SKILL.md: EXISTS")
            else:
                print("       SKILL.md: MISSING")

            if nested_plugin_dir.exists():
                print("       .claude-plugin/: EXISTS (WRONG! Should not be here)")
                nested_skill_md = nested_plugin_dir / "skills" / "SKILL.md"
                if nested_skill_md.exists():
                    print("       .claude-plugin/skills/SKILL.md: EXISTS (nested too deep!)")
                    issues.append(f"{skill_name}: nested .claude-plugin structure")

    # Check if any broken structure
    broken_skills = [d for d in all_skills if (d / ".claude-plugin").exists()]

    print("\n" + "=" * 70)
    print("Summary:")
    print("=" * 70)

    if not root_plugin.exists():
        print("❌ Root plugin.json is MISSING")
        issues.append("Root plugin.json missing")

    if broken_skills:
        print(f"❌ Found {len(broken_skills)} skills with broken nested structure")
        print(f"   Example: {broken_skills[0].name}/.claude-plugin/skills/SKILL.md")
        print(f"   Should be: {broken_skills[0].name}/SKILL.md")
    else:
        print("✓ All skills have correct flat structure")

    if issues:
        print(f"\n🔧 Issues found: {len(issues)}")
        for issue in issues:
            print(f"   - {issue}")
        print("\n💡 Run scripts/fix-claude-desktop.py to fix these issues")
    else:
        print("\n✅ Structure is correct!")


if __name__ == "__main__":
    verify_structure()
