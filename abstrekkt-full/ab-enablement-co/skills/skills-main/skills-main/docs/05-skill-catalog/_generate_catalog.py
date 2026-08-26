#!/usr/bin/env python3
"""
Skill Catalog Generator

Walks _master-skills/ to extract all SKILL.md files and generates three
catalog documents:
  - full-catalog.md    : All skills sorted alphabetically in one table
  - by-category.md     : Skills grouped by category with counts
  - by-complexity.md   : Skills grouped by estimated complexity level

Usage:
    python docs/05-skill-catalog/_generate_catalog.py
"""

import os
import re
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MASTER_DIR = os.path.normpath(os.path.join(SCRIPT_DIR, "..", "..", "_master-skills"))
OUTPUT_DIR = SCRIPT_DIR

CATEGORY_ORDER = [
    "ai-agents",
    "technical",
    "strategy",
    "creative",
    "operations",
    "industry",
]


def parse_frontmatter(filepath):
    """Extract name and description from YAML frontmatter without PyYAML."""
    try:
        with open(filepath, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()
    except OSError:
        return None, None

    match = re.match(r"^---\s*\n(.*?)\n---", content, re.DOTALL)
    if not match:
        return None, None

    block = match.group(1)
    name = None
    description = None

    for line in block.splitlines():
        if line.startswith("name:"):
            name = line.split(":", 1)[1].strip().strip("\"'")
        elif line.startswith("description:"):
            description = line.split(":", 1)[1].strip().strip("\"'")

    return name, description


def count_sections(filepath):
    """Count markdown heading lines (## or ###) in the file body."""
    try:
        with open(filepath, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()
    except OSError:
        return 0

    # Strip frontmatter
    stripped = re.sub(r"^---\s*\n.*?\n---\s*\n?", "", content, count=1, flags=re.DOTALL)
    return len(re.findall(r"^#{2,3}\s+", stripped, re.MULTILINE))


def estimate_complexity(slug, description, section_count):
    """Estimate skill complexity as simple, moderate, or complex.

    Thresholds are calibrated to the actual distribution of skills:
    - Description median ~271 chars, range 114-497
    - Section count median ~28, range 1-139
    This produces roughly 30% simple, 40% moderate, 30% complex.
    """
    score = 0

    # Description length (median ~271, so use higher thresholds)
    desc_len = len(description) if description else 0
    if desc_len > 350:
        score += 2
    elif desc_len > 250:
        score += 1

    # Section count (median ~28, so use percentile-based thresholds)
    if section_count >= 40:
        score += 2
    elif section_count >= 20:
        score += 1

    # Compound slug names suggest specialized/complex topics
    parts = slug.split("-")
    if len(parts) >= 3:
        score += 1

    if score >= 4:
        return "complex"
    elif score >= 2:
        return "moderate"
    return "simple"


def truncate(text, max_len=100):
    """Truncate text to max_len, adding ellipsis if needed."""
    if not text:
        return ""
    text = text.replace("\n", " ").strip()
    if len(text) <= max_len:
        return text
    return text[: max_len - 3].rstrip() + "..."


def discover_skills():
    """Walk _master-skills/ and collect skill metadata."""
    skills = []

    if not os.path.isdir(MASTER_DIR):
        print(f"ERROR: Master skills directory not found: {MASTER_DIR}", file=sys.stderr)
        sys.exit(1)

    for category in sorted(os.listdir(MASTER_DIR)):
        cat_path = os.path.join(MASTER_DIR, category)
        if not os.path.isdir(cat_path) or category.startswith("."):
            continue

        for slug in sorted(os.listdir(cat_path)):
            skill_dir = os.path.join(cat_path, slug)
            skill_file = os.path.join(skill_dir, "SKILL.md")
            if not os.path.isfile(skill_file):
                continue

            name, description = parse_frontmatter(skill_file)
            section_count = count_sections(skill_file)
            complexity = estimate_complexity(slug, description, section_count)

            skills.append(
                {
                    "slug": slug,
                    "name": name or slug,
                    "category": category,
                    "description": description or "",
                    "complexity": complexity,
                    "section_count": section_count,
                }
            )

    return skills


def write_full_catalog(skills):
    """Generate full-catalog.md with all skills in one alphabetical table."""
    sorted_skills = sorted(skills, key=lambda s: s["slug"].lower())
    lines = [
        "# Full Skill Catalog",
        "",
        f"Total skills: **{len(sorted_skills)}**",
        "",
        "| # | Name | Category | Description | Complexity |",
        "|---|------|----------|-------------|------------|",
    ]

    for i, s in enumerate(sorted_skills, 1):
        desc = truncate(s["description"])
        lines.append(f"| {i} | {s['slug']} | {s['category']} | {desc} | {s['complexity']} |")

    lines.append("")
    path = os.path.join(OUTPUT_DIR, "full-catalog.md")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"  Written: {path} ({len(sorted_skills)} skills)")


def write_by_category(skills):
    """Generate by-category.md with skills grouped by category."""
    by_cat = {}
    for s in skills:
        by_cat.setdefault(s["category"], []).append(s)

    lines = [
        "# Skills by Category",
        "",
        f"Total skills: **{len(skills)}** across **{len(by_cat)}** categories",
        "",
        "## Summary",
        "",
        "| Category | Count |",
        "|----------|-------|",
    ]
    for cat in CATEGORY_ORDER:
        if cat in by_cat:
            lines.append(f"| {cat} | {len(by_cat[cat])} |")
    # Include any categories not in the predefined order
    for cat in sorted(by_cat.keys()):
        if cat not in CATEGORY_ORDER:
            lines.append(f"| {cat} | {len(by_cat[cat])} |")

    lines.append("")

    ordered_cats = [c for c in CATEGORY_ORDER if c in by_cat]
    ordered_cats += [c for c in sorted(by_cat.keys()) if c not in CATEGORY_ORDER]

    for cat in ordered_cats:
        cat_skills = sorted(by_cat[cat], key=lambda s: s["slug"].lower())
        lines.append(f"## {cat} ({len(cat_skills)})")
        lines.append("")
        lines.append("| # | Name | Description | Complexity |")
        lines.append("|---|------|-------------|------------|")
        for i, s in enumerate(cat_skills, 1):
            desc = truncate(s["description"])
            lines.append(f"| {i} | {s['slug']} | {desc} | {s['complexity']} |")
        lines.append("")

    path = os.path.join(OUTPUT_DIR, "by-category.md")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"  Written: {path} ({len(by_cat)} categories)")


def write_by_complexity(skills):
    """Generate by-complexity.md with skills grouped by complexity level."""
    by_cx = {"simple": [], "moderate": [], "complex": []}
    for s in skills:
        by_cx[s["complexity"]].append(s)

    lines = [
        "# Skills by Complexity",
        "",
        f"Total skills: **{len(skills)}**",
        "",
        "## Summary",
        "",
        "| Complexity | Count |",
        "|------------|-------|",
    ]
    for level in ("simple", "moderate", "complex"):
        lines.append(f"| {level} | {len(by_cx[level])} |")

    lines.append("")

    for level in ("simple", "moderate", "complex"):
        group = sorted(by_cx[level], key=lambda s: s["slug"].lower())
        lines.append(f"## {level.capitalize()} ({len(group)})")
        lines.append("")
        lines.append("| # | Name | Category | Description |")
        lines.append("|---|------|----------|-------------|")
        for i, s in enumerate(group, 1):
            desc = truncate(s["description"])
            lines.append(f"| {i} | {s['slug']} | {s['category']} | {desc} |")
        lines.append("")

    path = os.path.join(OUTPUT_DIR, "by-complexity.md")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"  Written: {path} (3 levels)")


def main():
    print(f"Scanning: {MASTER_DIR}")
    skills = discover_skills()

    if not skills:
        print("No skills found. Check that _master-skills/ exists and contains SKILL.md files.")
        sys.exit(1)

    print(f"Found {len(skills)} skills across {len(set(s['category'] for s in skills))} categories")
    print("Generating catalog files...")

    write_full_catalog(skills)
    write_by_category(skills)
    write_by_complexity(skills)

    # Summary stats
    by_cx = {}
    for s in skills:
        by_cx[s["complexity"]] = by_cx.get(s["complexity"], 0) + 1
    print("\nComplexity distribution:")
    for level in ("simple", "moderate", "complex"):
        print(f"  {level}: {by_cx.get(level, 0)}")

    by_cat = {}
    for s in skills:
        by_cat[s["category"]] = by_cat.get(s["category"], 0) + 1
    print("\nCategory counts:")
    for cat in sorted(by_cat.keys()):
        print(f"  {cat}: {by_cat[cat]}")

    print(f"\nDone. {len(skills)} skills cataloged.")


if __name__ == "__main__":
    main()
