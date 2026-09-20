#!/usr/bin/env python3
"""
DEPRECATED: This script has been superseded by fix_skills_unified.py.
Please use fix_skills_unified.py instead:

    python fix_skills_unified.py --all --pass 2        # Run pass 2 only
    python fix_skills_unified.py --all                  # Run all 3 passes

--- Original docstring ---
Second-pass structural fixer for SKILL.md files.

Fixes:
1. Add "## Instructions" / "## Core Workflow" heading when body has content but no recognized section
2. Promote # headings to ## where body uses # instead of ##
3. Add minimal structure to short-but-not-empty files

Usage:
    python fix_skills_structure.py --all
    python fix_skills_structure.py --dry-run --all
"""

import argparse
import re
import sys
from pathlib import Path
from typing import List, Tuple

from lib.config import CATEGORIES, MASTER_DIR

WORKFLOW_PATTERNS = [
    r"^##\s*Core Workflow", r"^##\s*Instructions", r"^##\s*Core Process",
    r"^##\s*Workflow", r"^##\s*How to Use", r"^##\s*Getting Started",
    r"^##\s*Quick Start", r"^##\s*Steps?\b", r"^##\s*Usage",
    r"^##\s*Implementation", r"^##\s*Process", r"^##\s*Guide",
    r"^##\s*Overview", r"^##\s*Methodology", r"^##\s*Framework",
    r"^##\s*Approach", r"^##\s*Procedure",
]


def has_workflow_section(body: str) -> bool:
    for pat in WORKFLOW_PATTERNS:
        if re.search(pat, body, re.IGNORECASE | re.MULTILINE):
            return True
    return False


def has_h2_headings(body: str) -> bool:
    return bool(re.search(r"^##\s", body, re.MULTILINE))


def fix_structure(skill_path: Path, dry_run: bool = False) -> Tuple[str, List[str]]:
    content = skill_path.read_text(encoding="utf-8", errors="replace")
    original = content
    fixes = []

    # Parse frontmatter and body
    fm_match = re.match(r"^(---\s*\n.*?\n---\s*\n)(.*)$", content, re.DOTALL)
    if not fm_match:
        return "NO_FM", ["No frontmatter - run fix_skills.py first"]

    frontmatter = fm_match.group(1)
    body = fm_match.group(2)

    # Skip truly empty bodies
    if len(body.strip()) < 20:
        return "SKIP_EMPTY", ["Body too short for structural fixes"]

    # Fix: If body has # headings but no ## headings, this might be using
    # # Title as section headers. Add ## prefix where appropriate.
    if not has_h2_headings(body) and re.search(r"^#\s", body, re.MULTILINE):
        lines = body.split("\n")
        new_lines = []
        first_h1_seen = False
        for line in lines:
            if re.match(r"^#\s", line) and not re.match(r"^##", line):
                if not first_h1_seen:
                    # Keep first # as the title
                    first_h1_seen = True
                    new_lines.append(line)
                else:
                    # Promote subsequent # to ##
                    new_lines.append("#" + line)
                    fixes.append(f"Promoted heading to ##: {line.strip()[:50]}")
            else:
                new_lines.append(line)
        body = "\n".join(new_lines)

    # Fix: Add "## Instructions" section if no workflow section detected
    if not has_workflow_section(body) and len(body.strip()) > 100:
        lines = body.split("\n")

        # Find where the main content starts (after title and description)
        insert_idx = 0
        blank_count = 0
        in_title = False

        for i, line in enumerate(lines):
            stripped = line.strip()
            if stripped.startswith("# ") and not stripped.startswith("## "):
                in_title = True
                insert_idx = i + 1
                continue
            if in_title and stripped == "":
                blank_count += 1
                if blank_count >= 1:
                    insert_idx = i + 1
                    break
            elif in_title and stripped.startswith(">"):
                insert_idx = i + 1
                continue
            elif stripped and in_title:
                insert_idx = i
                break

        # Check if there are numbered steps (1. 2. 3.) that indicate a workflow
        has_steps = bool(re.search(r"^\d+\.\s", body, re.MULTILINE))

        if has_steps:
            heading = "## Core Workflow\n\n"
        else:
            heading = "## Instructions\n\n"

        # Only insert if we're not already right after a ## heading
        if insert_idx < len(lines):
            next_non_empty = ""
            for j in range(insert_idx, min(insert_idx + 3, len(lines))):
                if lines[j].strip():
                    next_non_empty = lines[j].strip()
                    break

            if not next_non_empty.startswith("##"):
                lines.insert(insert_idx, heading)
                body = "\n".join(lines)
                fixes.append(f"Added '{heading.strip()}' section heading")

    content = frontmatter + body

    if content == original:
        return "NO_CHANGE", []

    if dry_run:
        return "WOULD_FIX", fixes

    skill_path.write_text(content, encoding="utf-8")
    return "FIXED", fixes


def main():
    parser = argparse.ArgumentParser(description="Fix SKILL.md structural issues")
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--category", help="Fix one category")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    if not (args.all or args.category):
        parser.print_help()
        sys.exit(1)

    skills = []
    categories = [args.category] if args.category else CATEGORIES
    for cat in categories:
        skills.extend(sorted((MASTER_DIR / cat).glob("*/SKILL.md")))

    print(f"{'[DRY RUN] ' if args.dry_run else ''}Processing {len(skills)} skills (structural fixes)...")
    print("=" * 60)

    stats = {"FIXED": 0, "NO_CHANGE": 0, "SKIP_EMPTY": 0, "WOULD_FIX": 0, "NO_FM": 0, "ERROR": 0}

    for skill_path in skills:
        rel = f"{skill_path.parent.parent.name}/{skill_path.parent.name}"
        try:
            status, fixes = fix_structure(skill_path, dry_run=args.dry_run)
            stats[status] = stats.get(status, 0) + 1
            if (status in ("FIXED", "WOULD_FIX") and fixes) or args.verbose:
                icon = {"FIXED": "FIX", "WOULD_FIX": "DRY", "NO_CHANGE": " OK"}.get(status, "---")
                if fixes:
                    print(f"  [{icon}] {rel}")
                    for f in fixes:
                        print(f"        - {f}")
        except Exception as e:
            stats["ERROR"] += 1
            print(f"  [ERR] {rel}: {e}")

    print("\n" + "=" * 60)
    print(f"  Fixed:     {stats.get('FIXED', 0) + stats.get('WOULD_FIX', 0)}")
    print(f"  No change: {stats['NO_CHANGE']}")
    print(f"  Skipped:   {stats.get('SKIP_EMPTY', 0) + stats.get('NO_FM', 0)}")
    print(f"  Errors:    {stats['ERROR']}")


if __name__ == "__main__":
    main()
