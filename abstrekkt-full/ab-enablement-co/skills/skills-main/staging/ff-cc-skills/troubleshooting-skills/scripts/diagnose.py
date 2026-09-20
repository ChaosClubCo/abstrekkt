#!/usr/bin/env python3
"""
diagnose.py — Quick diagnostic for Claude skill pack issues

Usage:
  python scripts/diagnose.py skill.zip
  python scripts/diagnose.py skill.skill
  python scripts/diagnose.py /path/to/skill-directory/

Checks:
  - Valid zip/skill file
  - Single top-level folder
  - SKILL.md present at correct level
  - YAML frontmatter valid
  - Name is kebab-case, under 64 chars
  - Description under 1024 chars, no angle brackets
  - No phantom references (files mentioned but missing)
"""

import zipfile
import sys
import re
import os
from pathlib import Path

try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False


def diagnose_directory(skill_path):
    """Diagnose a skill directory (not zipped)."""
    skill_path = Path(skill_path)
    issues = []

    skill_md = skill_path / 'SKILL.md'
    if not skill_md.exists():
        issues.append("SKILL.md not found in directory")
        return issues

    content = skill_md.read_text()
    issues.extend(_validate_frontmatter(content))
    issues.extend(_check_phantoms(skill_path, content))

    return issues if issues else ["No issues detected - skill looks valid"]


def diagnose_zip(zip_path):
    """Diagnose a skill zip/skill file."""
    issues = []

    if not Path(zip_path).exists():
        return ["File not found"]

    if not zipfile.is_zipfile(zip_path):
        return ["Not a valid zip file - may be corrupted or wrong extension"]

    with zipfile.ZipFile(zip_path, 'r') as zipf:
        names = zipf.namelist()
        top_level = set(n.split('/')[0] for n in names if n and '/' in n)

        if len(top_level) == 0:
            issues.append("Zip is empty or has no folder structure")
            return issues
        elif len(top_level) > 1:
            issues.append(f"Multiple top-level folders: {sorted(top_level)}")

        folder = sorted(top_level)[0] if top_level else None
        if folder:
            skill_md_path = f"{folder}/SKILL.md"
            if skill_md_path not in names:
                issues.append(f"SKILL.md not found at {skill_md_path}")
                found = [n for n in names if n.endswith('SKILL.md')]
                if found:
                    issues.append(f"Found SKILL.md at: {found[0]} (wrong level)")
            else:
                content = zipf.read(skill_md_path).decode('utf-8')
                issues.extend(_validate_frontmatter(content))

    return issues if issues else ["No issues detected - skill pack looks valid"]


def _validate_frontmatter(content):
    """Validate YAML frontmatter in SKILL.md content."""
    issues = []

    if not content.startswith('---'):
        issues.append("Missing YAML frontmatter (no --- delimiter)")
        return issues

    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        issues.append("Invalid frontmatter format (missing closing ---)")
        return issues

    if not HAS_YAML:
        issues.append("WARNING: pyyaml not installed, skipping YAML validation")
        return issues

    try:
        fm = yaml.safe_load(match.group(1))
    except yaml.YAMLError as e:
        issues.append(f"Invalid YAML: {e}")
        return issues

    if not isinstance(fm, dict):
        issues.append("Frontmatter must be a YAML dictionary")
        return issues

    # Check allowed keys
    allowed = {'name', 'description', 'license', 'allowed-tools', 'metadata', 'compatibility'}
    unexpected = set(fm.keys()) - allowed
    if unexpected:
        issues.append(f"Unexpected frontmatter keys: {sorted(unexpected)}")

    # Name validation
    name = fm.get('name', '')
    if not name:
        issues.append("Missing 'name' in frontmatter")
    elif not re.match(r'^[a-z0-9-]+$', name):
        issues.append(f"Name '{name}' is not kebab-case (lowercase, digits, hyphens only)")
    elif name.startswith('-') or name.endswith('-') or '--' in name:
        issues.append(f"Name '{name}' has invalid hyphens (no leading/trailing/consecutive)")
    elif len(name) > 64:
        issues.append(f"Name is {len(name)} chars (max 64)")

    # Description validation
    desc = fm.get('description', '')
    if not desc:
        issues.append("Missing 'description' in frontmatter")
    else:
        if len(desc) > 1024:
            issues.append(f"Description is {len(desc)} chars (max 1024)")
        if '<' in desc or '>' in desc:
            issues.append("Description contains angle brackets (not allowed)")

    # Line count
    lines = len(content.splitlines())
    if lines > 500:
        issues.append(f"SKILL.md is {lines} lines (recommend under 500)")

    return issues


def _check_phantoms(skill_path, content):
    """Check for phantom references in SKILL.md."""
    issues = []
    for m in re.finditer(r'`((?:scripts|references|assets|templates|workflows)/[a-zA-Z0-9_./-]+)`', content):
        ref = m.group(1)
        if not (skill_path / ref).exists():
            issues.append(f"Phantom reference: {ref} (file does not exist)")
    return issues


def main():
    if len(sys.argv) != 2:
        print("Usage: python diagnose.py <skill.zip | skill.skill | skill-directory/>")
        sys.exit(1)

    target = sys.argv[1]
    print(f"Diagnosing: {target}")
    print()

    if Path(target).is_dir():
        results = diagnose_directory(target)
    else:
        results = diagnose_zip(target)

    for r in results:
        icon = "✅" if "No issues" in r or "valid" in r.lower() else "❌"
        if "WARNING" in r:
            icon = "⚠️"
        print(f"  {icon} {r}")

    has_errors = any("No issues" not in r and "WARNING" not in r and "valid" not in r.lower() for r in results)
    sys.exit(1 if has_errors else 0)


if __name__ == '__main__':
    main()
