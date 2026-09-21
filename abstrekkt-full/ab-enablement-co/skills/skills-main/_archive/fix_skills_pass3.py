#!/usr/bin/env python3
"""
DEPRECATED: This script has been superseded by fix_skills_unified.py.
Please use fix_skills_unified.py instead:

    python fix_skills_unified.py --all --pass 3        # Run pass 3 only
    python fix_skills_unified.py --all                  # Run all 3 passes

--- Original docstring ---
Third-pass fixer: name slugification, description trimming, and additional structural fixes.

Fixes:
1. Names with spaces/capitals -> lowercase-hyphenated slugs
2. Descriptions > 500 chars -> truncated at sentence boundary
3. Skills with h2 headings but no Core Workflow equivalent -> add heading
"""

import re
import sys
from pathlib import Path
from typing import List, Tuple

from lib.config import CATEGORIES, MASTER_DIR

CORE_SECTION_NAMES = {
    "core workflow", "instructions", "core processes", "core process",
    "workflow", "quick start", "how to use", "getting started",
    "steps", "step", "usage", "implementation", "process", "guide",
    "overview", "methodology", "framework", "approach", "procedure",
    "how it works", "implementation guide", "key capabilities",
    "primary functions", "main features", "configuration",
}


def slugify(name: str) -> str:
    """Convert 'My Skill Name' to 'my-skill-name'."""
    s = name.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def truncate_description(desc: str, max_len: int = 490) -> str:
    """Truncate description at sentence boundary, under max_len."""
    if len(desc) <= max_len:
        return desc
    # Try to cut at a sentence boundary
    truncated = desc[:max_len]
    last_period = truncated.rfind(". ")
    if last_period > max_len // 2:
        return truncated[:last_period + 1].strip()
    # Fall back to word boundary
    last_space = truncated.rfind(" ")
    if last_space > max_len // 2:
        return truncated[:last_space].strip().rstrip(",;:") + "."
    return truncated.strip() + "."


def has_core_section(body: str) -> bool:
    """Check if body has a recognized core section heading."""
    headings = re.findall(r"^##\s+(.+)$", body, re.MULTILINE)
    for h in headings:
        if h.strip().lower() in CORE_SECTION_NAMES:
            return True
    return False


def fix_skill(skill_path: Path, dry_run: bool = False) -> Tuple[str, List[str]]:
    content = skill_path.read_text(encoding="utf-8", errors="replace")
    original = content
    fixes = []

    fm_match = re.match(r"^(---\s*\n)(.*?)(\n---\s*\n)(.*)$", content, re.DOTALL)
    if not fm_match:
        return "SKIP", []

    fm_open = fm_match.group(1)
    fm_body = fm_match.group(2)
    fm_close = fm_match.group(3)
    body = fm_match.group(4)

    # Parse frontmatter fields
    fm_lines = fm_body.split("\n")
    fm = {}
    for line in fm_lines:
        if ":" in line:
            k, v = line.split(":", 1)
            fm[k.strip()] = v.strip().strip("\"'")

    changed_fm = False

    # Fix 1: Slugify name
    name = fm.get("name", "")
    if name and not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", name):
        new_name = slugify(name)
        if new_name != name:
            fm["name"] = new_name
            fixes.append(f"Slugified name: '{name}' -> '{new_name}'")
            changed_fm = True

    # Fix 2: Trim long description
    desc = fm.get("description", "")
    if len(desc) > 500:
        new_desc = truncate_description(desc)
        fm["description"] = new_desc
        fixes.append(f"Trimmed description: {len(desc)} -> {len(new_desc)} chars")
        changed_fm = True

    # Rebuild frontmatter if changed
    if changed_fm:
        new_fm_body = f"name: {fm.get('name', '')}\ndescription: {fm.get('description', '')}"
        content = fm_open + new_fm_body + fm_close + body

    # Fix 3: Add Core Workflow heading for skills that have h2 headings but no core section
    fm_match2 = re.match(r"^(---\s*\n.*?\n---\s*\n)(.*)$", content, re.DOTALL)
    if fm_match2:
        front = fm_match2.group(1)
        body2 = fm_match2.group(2)
        has_h2 = bool(re.search(r"^##\s", body2, re.MULTILINE))

        if has_h2 and not has_core_section(body2):
            # Find first ## heading and add Core Workflow before it
            lines = body2.split("\n")
            for i, line in enumerate(lines):
                if re.match(r"^##\s", line):
                    # Check if this heading has numbered steps after it
                    rest = "\n".join(lines[i:])
                    has_steps = bool(re.search(r"^\d+\.\s", rest, re.MULTILINE))
                    heading = "## Core Workflow" if has_steps else "## Overview"
                    lines.insert(i, heading + "\n")
                    body2 = "\n".join(lines)
                    content = front + body2
                    fixes.append(f"Added '{heading}' before first h2")
                    break

    if content == original:
        return "NO_CHANGE", []

    if dry_run:
        return "WOULD_FIX", fixes

    skill_path.write_text(content, encoding="utf-8")
    return "FIXED", fixes


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Pass-3 fixes: names, descriptions, structure")
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if not args.all:
        parser.print_help()
        sys.exit(1)

    skills = []
    for cat in CATEGORIES:
        skills.extend(sorted((MASTER_DIR / cat).glob("*/SKILL.md")))

    print(f"{'[DRY RUN] ' if args.dry_run else ''}Processing {len(skills)} skills (pass-3 fixes)...")
    print("=" * 60)

    stats = {"FIXED": 0, "NO_CHANGE": 0, "SKIP": 0, "WOULD_FIX": 0, "ERROR": 0}

    for skill_path in skills:
        rel = f"{skill_path.parent.parent.name}/{skill_path.parent.name}"
        try:
            status, fixes = fix_skill(skill_path, dry_run=args.dry_run)
            stats[status] = stats.get(status, 0) + 1
            if fixes:
                icon = {"FIXED": "FIX", "WOULD_FIX": "DRY"}.get(status, "---")
                print(f"  [{icon}] {rel}")
                for f in fixes:
                    print(f"        - {f}")
        except Exception as e:
            stats["ERROR"] += 1
            print(f"  [ERR] {rel}: {e}")

    print("\n" + "=" * 60)
    print(f"  Fixed:     {stats.get('FIXED', 0) + stats.get('WOULD_FIX', 0)}")
    print(f"  No change: {stats['NO_CHANGE']}")
    print(f"  Errors:    {stats['ERROR']}")


if __name__ == "__main__":
    main()
