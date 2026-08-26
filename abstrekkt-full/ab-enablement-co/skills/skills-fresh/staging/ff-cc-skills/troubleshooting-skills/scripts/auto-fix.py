#!/usr/bin/env python3
"""
auto-fix.py — Attempt to automatically fix common skill pack issues

Usage:
  python scripts/auto-fix.py broken-skill.zip
  python scripts/auto-fix.py broken-skill.skill

Fixes attempted:
  - Files at root level (wraps in a folder)
  - Extra nesting (flattens to single top-level folder)
  - Multiple top-level items (wraps in a folder)
  - .DS_Store and __MACOSX removal
  - Folder name mismatch with YAML name field

Output:
  Creates {name}-fixed.skill in the current directory
"""

import zipfile
import shutil
import re
import sys
from pathlib import Path

try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False


def auto_fix(zip_path):
    zip_path = Path(zip_path)
    if not zip_path.exists():
        print(f"File not found: {zip_path}")
        return False

    if not zipfile.is_zipfile(str(zip_path)):
        print(f"Not a valid zip file: {zip_path}")
        return False

    temp_dir = Path(f"_fix_temp_{zip_path.stem}")
    if temp_dir.exists():
        shutil.rmtree(temp_dir)
    temp_dir.mkdir()

    try:
        # Extract
        print(f"Extracting {zip_path}...")
        with zipfile.ZipFile(str(zip_path), 'r') as zipf:
            zipf.extractall(str(temp_dir))

        # Remove junk files
        for junk in temp_dir.rglob('.DS_Store'):
            junk.unlink()
        for junk in temp_dir.rglob('__MACOSX'):
            if junk.is_dir():
                shutil.rmtree(junk)

        # Find SKILL.md
        skill_md_paths = list(temp_dir.rglob('SKILL.md'))
        if not skill_md_paths:
            print("SKILL.md not found anywhere in archive — cannot fix")
            return False

        skill_md = skill_md_paths[0]
        skill_dir = skill_md.parent
        print(f"Found SKILL.md at: {skill_md.relative_to(temp_dir)}")

        # Read name from frontmatter
        content = skill_md.read_text()
        skill_name = skill_dir.name  # default to directory name
        match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
        if match and HAS_YAML:
            try:
                fm = yaml.safe_load(match.group(1))
                if fm and 'name' in fm:
                    skill_name = fm['name']
                    print(f"Skill name from frontmatter: {skill_name}")
            except yaml.YAMLError:
                pass

        # Create correctly structured output
        output_dir = Path(f"_fix_output_{skill_name}")
        if output_dir.exists():
            shutil.rmtree(output_dir)
        target = output_dir / skill_name
        shutil.copytree(str(skill_dir), str(target))

        # Verify structure
        if not (target / 'SKILL.md').exists():
            print("ERROR: SKILL.md not at correct level after fix")
            return False

        # Create fixed archive
        fixed_name = f"{skill_name}-fixed.skill"
        with zipfile.ZipFile(fixed_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for file_path in target.rglob('*'):
                if file_path.is_file() and not file_path.name.startswith('.'):
                    arcname = file_path.relative_to(output_dir)
                    zipf.write(str(file_path), str(arcname))
                    print(f"  Added: {arcname}")

        # Verify
        with zipfile.ZipFile(fixed_name, 'r') as zipf:
            names = zipf.namelist()
            top = set(n.split('/')[0] for n in names)
            skill_md_check = f"{skill_name}/SKILL.md"
            if len(top) == 1 and skill_md_check in names:
                print(f"\n✅ Fixed archive created: {fixed_name}")
                print(f"   Top-level folder: {list(top)[0]}")
                print(f"   Files: {len(names)}")
                return True
            else:
                print(f"\n❌ Fix verification failed")
                return False

    finally:
        # Cleanup temp dirs
        if temp_dir.exists():
            shutil.rmtree(temp_dir)
        output_dir = Path(f"_fix_output_{skill_name}" if 'skill_name' in dir() else "_fix_output_unknown")
        if output_dir.exists():
            shutil.rmtree(output_dir)


def main():
    if len(sys.argv) != 2:
        print("Usage: python auto-fix.py <broken-skill.zip>")
        sys.exit(1)

    success = auto_fix(sys.argv[1])
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
