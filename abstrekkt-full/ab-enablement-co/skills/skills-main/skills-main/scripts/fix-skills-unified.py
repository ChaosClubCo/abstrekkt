#!/usr/bin/env python3
"""
Unified multi-pass quality fixer for SKILL.md files.

Consolidates fix_skills.py (pass 1), fix_skills_structure.py (pass 2),
and fix_skills_pass3.py (pass 3) into a single script with shared I/O.

Pass 1: Frontmatter repair, description generation, trigger verbs, "Use when" phrases
Pass 2: Heading promotion (# -> ##), add workflow/instructions section headings
Pass 3: Name slugification, description trimming, add Core Workflow/Overview heading

Usage:
    python scripts/fix-skills-unified.py --all                     # Run all 3 passes (default)
    python scripts/fix-skills-unified.py --all --pass 1            # Run only pass 1
    python scripts/fix-skills-unified.py --all --pass 2            # Run only pass 2
    python scripts/fix-skills-unified.py --all --pass 3            # Run only pass 3
    python scripts/fix-skills-unified.py --category ai-agents
    python scripts/fix-skills-unified.py --skill ai-agents/ceo
    python scripts/fix-skills-unified.py --dry-run --all
    python scripts/fix-skills-unified.py --dry-run --all --verbose
"""

import argparse
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# Ensure project root is on sys.path for lib imports
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from lib.config import (
    CATEGORIES,
    CORE_SECTION_NAMES,
    MASTER_DIR,
    TRIGGER_VERBS,
    USE_WHEN_MAP,
    VERB_MAP,
    WORKFLOW_PATTERNS,
)
from lib.logger import create_error_tracker, setup_logger

# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------

def slugify_to_title(slug: str) -> str:
    """Convert a-slug-name to A Slug Name."""
    return slug.replace("-", " ").title()


def slugify(name: str) -> str:
    """Convert 'My Skill Name' to 'my-skill-name'."""
    s = name.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def has_valid_frontmatter(content: str) -> bool:
    """Check if content has valid --- frontmatter markers."""
    return bool(re.match(r"^---\s*\n.*?\n---\s*\n", content, re.DOTALL))


def parse_frontmatter(content: str) -> Tuple[Optional[str], Dict[str, str], str]:
    """
    Parse frontmatter and body from content.

    Returns (frontmatter_raw, fm_dict, body).
    frontmatter_raw is the full '---...---\\n' block or None if absent.
    """
    match = re.match(r"^(---\s*\n)(.*?)(\n---\s*\n)(.*)$", content, re.DOTALL)
    if match:
        fm_open = match.group(1)
        fm_text = match.group(2)
        fm_close = match.group(3)
        body = match.group(4)
        fm: Dict[str, str] = {}
        for line in fm_text.split("\n"):
            if ":" in line and not line.startswith(" ") and not line.startswith("\t"):
                key, val = line.split(":", 1)
                fm[key.strip()] = val.strip().strip("\"'")
        return fm_open + fm_text + fm_close, fm, body
    return None, {}, content


def parse_frontmatter_parts(content: str) -> Tuple[Optional[str], str, Optional[str], Dict[str, str], str]:
    """
    Parse frontmatter into open/close markers, fm dict, and body.

    Returns (fm_open, fm_text, fm_close, fm_dict, body).
    fm_open/fm_close are None if no frontmatter found.
    """
    match = re.match(r"^(---\s*\n)(.*?)(\n---\s*\n)(.*)$", content, re.DOTALL)
    if match:
        fm_open = match.group(1)
        fm_text = match.group(2)
        fm_close = match.group(3)
        body = match.group(4)
        fm: Dict[str, str] = {}
        for line in fm_text.split("\n"):
            if ":" in line and not line.startswith(" ") and not line.startswith("\t"):
                key, val = line.split(":", 1)
                fm[key.strip()] = val.strip().strip("\"'")
        return fm_open, fm_text, fm_close, fm, body
    return None, "", None, {}, content


def build_frontmatter(name: str, description: str) -> str:
    """Build a frontmatter block string."""
    return f"---\nname: {name}\ndescription: {description}\n---\n"


def has_core_section_by_pattern(body: str) -> bool:
    """Check if body has a recognized core section heading (regex-based, from WORKFLOW_PATTERNS)."""
    for pat in WORKFLOW_PATTERNS:
        if re.search(pat, body, re.IGNORECASE | re.MULTILINE):
            return True
    return False


def has_core_section_by_name(body: str) -> bool:
    """Check if body has a recognized core section heading (exact name match, from CORE_SECTION_NAMES)."""
    headings = re.findall(r"^##\s+(.+)$", body, re.MULTILINE)
    for h in headings:
        if h.strip().lower() in CORE_SECTION_NAMES:
            return True
    return False


def has_h2_headings(body: str) -> bool:
    """Check if body has any ## headings."""
    return bool(re.search(r"^##\s", body, re.MULTILINE))


# ---------------------------------------------------------------------------
# Pass 1: Frontmatter repair, description generation, trigger verbs
# ---------------------------------------------------------------------------

def extract_description_from_body(body: str, name: str) -> str:
    """Generate a description from the body content."""
    lines = body.strip().split("\n")
    desc_parts: List[str] = []
    for line in lines:
        line = line.strip()
        if not line or line.startswith("#"):
            if desc_parts:
                break
            continue
        if line.startswith(">"):
            return line.lstrip("> ").strip()
        if line.startswith("-") or line.startswith("*"):
            continue
        desc_parts.append(line)
        if len(" ".join(desc_parts)) > 100:
            break

    if desc_parts:
        desc = " ".join(desc_parts)[:300].strip()
        # Clean up markdown
        desc = re.sub(r"\*\*([^*]+)\*\*", r"\1", desc)
        desc = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", desc)
        return desc

    return f"Comprehensive guidance for {slugify_to_title(name).lower()} workflows and best practices."


def has_trigger_verbs(description: str, min_count: int = 2) -> bool:
    """Check if description has enough trigger verbs."""
    desc_lower = description.lower()
    count = sum(1 for v in TRIGGER_VERBS if v in desc_lower)
    return count >= min_count


def improve_description(description: str, name: str, category: str) -> str:
    """Improve a description to be more trigger-rich."""
    if not description or len(description) < 20:
        title = slugify_to_title(name).lower()
        verbs = VERB_MAP.get(category, ["manage", "create"])
        description = (
            f"Comprehensive toolkit to {verbs[0]} and {verbs[1]} {title} workflows. "
            f"{USE_WHEN_MAP.get(category, 'Use when working on related tasks.')}"
        )
        return description

    # Add "Use when..." if missing
    if "use when" not in description.lower() and "use for" not in description.lower():
        use_when = USE_WHEN_MAP.get(category, "Use when working on related tasks.")
        description = description.rstrip(".") + ". " + use_when

    # Add trigger verbs if too few
    if not has_trigger_verbs(description):
        verbs = VERB_MAP.get(category, ["manage", "optimize"])
        title = slugify_to_title(name).lower()
        prefix = f"Helps {verbs[0]} and {verbs[1]} {title} processes. "
        description = prefix + description

    return description


def run_pass1(content: str, skill_name: str, category: str) -> Tuple[str, List[str]]:
    """
    Pass 1: Fix frontmatter, generate/improve descriptions, add trigger verbs.
    Operates on content string in memory. Returns (new_content, fixes_list).
    """
    fixes: List[str] = []

    # Skip truly empty files
    if len(content.strip()) < 10:
        return content, ["SKIP_EMPTY: File is empty/stub - needs full rewrite"]

    # Fix 1: Add or repair frontmatter
    if not has_valid_frontmatter(content):
        if content.startswith("---"):
            # Has opening --- but might be malformed
            lines = content.split("\n")
            closing_idx = None
            for i, line in enumerate(lines[1:], 1):
                if line.strip() == "---":
                    closing_idx = i
                    break

            if closing_idx is None:
                # No closing --- found. Find where YAML ends and body begins
                body_start = 1
                for i, line in enumerate(lines[1:], 1):
                    stripped = line.strip()
                    if stripped.startswith("#") or (stripped == "" and i > 3):
                        body_start = i
                        break
                    # Check if line looks like YAML (key: value)
                    if ":" in stripped and not stripped.startswith("#"):
                        continue
                    body_start = i
                    break

                yaml_lines = lines[1:body_start]
                body_lines = lines[body_start:]

                # Extract name and description from YAML
                fm: Dict[str, str] = {}
                for line in yaml_lines:
                    if ":" in line and not line.startswith(" ") and not line.startswith("\t"):
                        key, val = line.split(":", 1)
                        fm[key.strip()] = val.strip().strip("\"'")

                name = fm.get("name", skill_name)
                desc = fm.get("description", "")
                body = "\n".join(body_lines).strip()

                if not desc:
                    desc = extract_description_from_body(body, name)

                desc = improve_description(desc, name, category)
                content = build_frontmatter(name, desc) + "\n" + body + "\n"
                fixes.append("Fixed malformed frontmatter (added closing ---)")
            else:
                # Has both --- markers, extract and potentially improve
                _, fm, body = parse_frontmatter(content)
                name = fm.get("name", skill_name)
                desc = fm.get("description", "")

                if not desc:
                    desc = extract_description_from_body(body, name)
                    fixes.append("Generated description from body content")

                desc = improve_description(desc, name, category)
                if desc != fm.get("description", ""):
                    fixes.append("Improved description quality")

                content = build_frontmatter(name, desc) + "\n" + body.strip() + "\n"
        else:
            # No frontmatter at all - add it
            body = content.strip()
            desc = extract_description_from_body(body, skill_name)
            desc = improve_description(desc, skill_name, category)
            content = build_frontmatter(skill_name, desc) + "\n" + body + "\n"
            fixes.append("Added missing frontmatter")
    else:
        # Has valid frontmatter - check description quality
        _, fm, body = parse_frontmatter(content)
        name = fm.get("name", skill_name)
        desc = fm.get("description", "")

        original_desc = desc
        if not desc or len(desc) < 20:
            desc = extract_description_from_body(body, name)
            fixes.append("Generated description from body content")

        desc = improve_description(desc, name, category)
        if desc != original_desc:
            content = build_frontmatter(name, desc) + "\n" + body.strip() + "\n"
            if "Generated description" not in str(fixes):
                fixes.append("Improved description with trigger verbs and 'Use when' phrase")

    # Fix 2: Note missing workflow section (informational only - Pass 2 handles actual insertion)
    fm_match = re.match(r"^---\s*\n.*?\n---\s*\n(.*)$", content, re.DOTALL)
    if fm_match:
        body = fm_match.group(1)
        if not has_core_section_by_pattern(body):
            has_numbered = bool(re.search(r"^\d+\.\s", body, re.MULTILINE))
            has_headings = bool(re.search(r"^##\s", body, re.MULTILINE))

            if has_numbered and has_headings:
                if len(body) > 200:
                    fixes.append("NOTE: Has structure but no 'Core Workflow' heading detected")
            elif not has_headings and len(body) > 100:
                fixes.append("NOTE: No ## headings found in body")

    return content, fixes


# ---------------------------------------------------------------------------
# Pass 2: Heading promotion, add workflow/instructions section headings
# ---------------------------------------------------------------------------

def run_pass2(content: str, skill_name: str, category: str) -> Tuple[str, List[str]]:
    """
    Pass 2: Promote # headings to ##, add Instructions/Core Workflow section.
    Operates on content string in memory. Returns (new_content, fixes_list).
    """
    fixes: List[str] = []

    # Parse frontmatter and body
    fm_raw, fm, body = parse_frontmatter(content)
    if fm_raw is None:
        return content, ["NO_FM: No frontmatter - run pass 1 first"]

    # Skip truly empty bodies
    if len(body.strip()) < 20:
        return content, ["SKIP_EMPTY: Body too short for structural fixes"]

    # Fix: If body has # headings but no ## headings, promote subsequent # to ##
    if not has_h2_headings(body) and re.search(r"^#\s", body, re.MULTILINE):
        lines = body.split("\n")
        new_lines: List[str] = []
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

    # Fix: Add "## Instructions" / "## Core Workflow" section if none detected
    if not has_core_section_by_pattern(body) and len(body.strip()) > 100:
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
        heading = "## Core Workflow\n\n" if has_steps else "## Instructions\n\n"

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

    content = fm_raw + body
    return content, fixes


# ---------------------------------------------------------------------------
# Pass 3: Name slugification, description trimming, additional structure
# ---------------------------------------------------------------------------

def truncate_description(desc: str, max_len: int = 490) -> str:
    """Truncate description at sentence boundary, under max_len."""
    if len(desc) <= max_len:
        return desc
    truncated = desc[:max_len]
    last_period = truncated.rfind(". ")
    if last_period > max_len // 2:
        return truncated[:last_period + 1].strip()
    # Fall back to word boundary
    last_space = truncated.rfind(" ")
    if last_space > max_len // 2:
        return truncated[:last_space].strip().rstrip(",;:") + "."
    return truncated.strip() + "."


def run_pass3(content: str, skill_name: str, category: str) -> Tuple[str, List[str]]:
    """
    Pass 3: Slugify names, trim descriptions, add Core Workflow/Overview heading.
    Operates on content string in memory. Returns (new_content, fixes_list).
    """
    fixes: List[str] = []

    fm_open, fm_text, fm_close, fm, body = parse_frontmatter_parts(content)
    if fm_open is None:
        return content, ["SKIP: No frontmatter"]

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

    # Fix 3: Add Core Workflow / Overview heading for skills with h2 but no core section
    fm_match2 = re.match(r"^(---\s*\n.*?\n---\s*\n)(.*)$", content, re.DOTALL)
    if fm_match2:
        front = fm_match2.group(1)
        body2 = fm_match2.group(2)
        has_h2 = bool(re.search(r"^##\s", body2, re.MULTILINE))

        if has_h2 and not has_core_section_by_name(body2):
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

    return content, fixes


# ---------------------------------------------------------------------------
# Orchestrator: single-file multi-pass
# ---------------------------------------------------------------------------

def fix_skill_file(
    skill_path: Path,
    passes: List[int],
    dry_run: bool = False,
) -> Tuple[str, List[str]]:
    """
    Fix a single skill file through the requested passes.

    Reads the file once, applies all selected passes in memory, and writes once.

    Returns (status, list_of_fixes).
    """
    content = skill_path.read_text(encoding="utf-8", errors="replace")
    original = content
    all_fixes: List[str] = []
    skill_name = skill_path.parent.name
    category = skill_path.parent.parent.name

    # Skip truly empty files early
    if len(content.strip()) < 10:
        return "SKIP_EMPTY", ["File is empty/stub - needs full rewrite"]

    # Run requested passes in order
    for pass_num in passes:
        if pass_num == 1:
            content, fixes = run_pass1(content, skill_name, category)
            skip_fixes = [f for f in fixes if f.startswith("SKIP_EMPTY:")]
            if skip_fixes:
                return "SKIP_EMPTY", [f.split(": ", 1)[1] for f in skip_fixes]
            all_fixes.extend(fixes)

        elif pass_num == 2:
            content, fixes = run_pass2(content, skill_name, category)
            real_fixes = [f for f in fixes if not f.startswith(("SKIP_EMPTY:", "NO_FM:"))]
            skip_fixes = [f for f in fixes if f.startswith(("SKIP_EMPTY:", "NO_FM:"))]
            if skip_fixes and not real_fixes and len(passes) == 1:
                return "SKIP", [f.split(": ", 1)[1] for f in skip_fixes]
            all_fixes.extend(real_fixes)

        elif pass_num == 3:
            content, fixes = run_pass3(content, skill_name, category)
            skip_fixes = [f for f in fixes if f.startswith("SKIP:")]
            real_fixes = [f for f in fixes if not f.startswith("SKIP:")]
            if skip_fixes and not real_fixes and len(passes) == 1:
                return "SKIP", [f.split(": ", 1)[1] for f in skip_fixes]
            all_fixes.extend(real_fixes)

    if content == original:
        return "NO_CHANGE", all_fixes if all_fixes else ["Already valid"]

    if dry_run:
        return "WOULD_FIX", all_fixes

    skill_path.write_text(content, encoding="utf-8")
    return "FIXED", all_fixes


# ---------------------------------------------------------------------------
# Skill discovery
# ---------------------------------------------------------------------------

def discover_skills(
    category: Optional[str] = None,
    skill: Optional[str] = None,
    run_all: bool = False,
) -> List[Path]:
    """Collect skill paths based on CLI arguments."""
    skills: List[Path] = []

    if skill:
        p = MASTER_DIR / skill / "SKILL.md"
        if p.exists():
            skills.append(p)
        else:
            print(f"Skill not found: {skill}")
            sys.exit(1)
    elif category:
        cat_dir = MASTER_DIR / category
        skills = sorted(cat_dir.glob("*/SKILL.md"))
    elif run_all:
        for cat in CATEGORIES:
            skills.extend(sorted((MASTER_DIR / cat).glob("*/SKILL.md")))

    return skills


# ---------------------------------------------------------------------------
# CLI and main
# ---------------------------------------------------------------------------

def parse_pass_arg(value: str) -> List[int]:
    """Parse the --pass argument into a list of pass numbers."""
    if value == "all":
        return [1, 2, 3]
    try:
        n = int(value)
        if n not in (1, 2, 3):
            raise ValueError
        return [n]
    except ValueError:
        print(f"Invalid --pass value: {value!r}. Must be 1, 2, 3, or 'all'.")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Unified multi-pass quality fixer for SKILL.md files",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Passes:\n"
            "  1    Frontmatter repair, description generation, trigger verbs\n"
            "  2    Heading promotion (# -> ##), add workflow section headings\n"
            "  3    Name slugification, description trimming, Core Workflow heading\n"
            "  all  Run all passes in sequence (default)\n"
            "\n"
            "Examples:\n"
            "  python scripts/fix-skills-unified.py --all                  # All skills, all passes\n"
            "  python scripts/fix-skills-unified.py --all --pass 1         # All skills, pass 1 only\n"
            "  python scripts/fix-skills-unified.py --category ai-agents   # One category\n"
            "  python scripts/fix-skills-unified.py --skill ai-agents/ceo  # One skill\n"
            "  python scripts/fix-skills-unified.py --dry-run --all        # Preview only\n"
        ),
    )
    parser.add_argument("--all", action="store_true", help="Fix all skills")
    parser.add_argument("--category", help="Fix skills in a specific category")
    parser.add_argument("--skill", help="Fix a specific skill (category/slug)")
    parser.add_argument("--dry-run", action="store_true", help="Preview fixes without writing")
    parser.add_argument("--verbose", action="store_true", help="Show all skills including unchanged")
    parser.add_argument(
        "--pass", dest="pass_selection", default="all",
        help="Which pass(es) to run: 1, 2, 3, or 'all' (default: all)",
    )
    args = parser.parse_args()

    if not (args.all or args.category or args.skill):
        parser.print_help()
        sys.exit(1)

    # Set up logging
    logger = setup_logger("fix_skills_unified", verbose=args.verbose)
    tracker = create_error_tracker()

    passes = parse_pass_arg(args.pass_selection)
    skills = discover_skills(category=args.category, skill=args.skill, run_all=args.all)

    pass_label = "all" if passes == [1, 2, 3] else str(passes[0])
    logger.info(
        f"{'[DRY RUN] ' if args.dry_run else ''}"
        f"Processing {len(skills)} skills (pass {pass_label})..."
    )

    stats = {
        "FIXED": 0, "NO_CHANGE": 0, "SKIP_EMPTY": 0, "SKIP": 0,
        "WOULD_FIX": 0, "ERROR": 0,
    }
    empty_skills: List[str] = []

    for skill_path in skills:
        rel = f"{skill_path.parent.parent.name}/{skill_path.parent.name}"
        try:
            status, fixes = fix_skill_file(skill_path, passes, dry_run=args.dry_run)
            stats[status] = stats.get(status, 0) + 1

            if status == "SKIP_EMPTY":
                empty_skills.append(rel)

            if status in ("FIXED", "WOULD_FIX"):
                icon = "FIX" if status == "FIXED" else "DRY"
                logger.info(f"  [{icon}] {rel}")
                for fix in fixes:
                    logger.info(f"        - {fix}")
            elif status == "ERROR":
                tracker.add_error(f"Failed: {fixes}", category=rel.split('/')[0], skill=rel.split('/')[-1])
            elif args.verbose:
                icon = {
                    "NO_CHANGE": " OK",
                    "SKIP_EMPTY": "SKIP",
                    "SKIP": "SKIP",
                }.get(status, "???")
                logger.debug(f"  [{icon}] {rel}")
                for fix in fixes:
                    logger.debug(f"        - {fix}")
        except Exception as e:
            stats["ERROR"] = stats.get("ERROR", 0) + 1
            tracker.add_error(str(e), category=rel.split('/')[0], skill=rel.split('/')[-1])
            logger.error(f"  [ERR] {rel}: {e}")

    # Summary
    logger.info("=" * 60)
    logger.info("SUMMARY")
    logger.info("=" * 60)
    logger.info(f"  Fixed:     {stats.get('FIXED', 0) + stats.get('WOULD_FIX', 0)}")
    logger.info(f"  No change: {stats['NO_CHANGE']}")
    logger.info(f"  Skipped:   {stats.get('SKIP_EMPTY', 0) + stats.get('SKIP', 0)}")
    logger.info(f"  Errors:    {stats['ERROR']}")

    if empty_skills:
        logger.warning(f"\nEmpty/stub skills that need full rewrites ({len(empty_skills)}):")
        for s in empty_skills:
            logger.warning(f"  - {s}")

    if tracker.has_errors():
        tracker.print_summary()

    sys.exit(tracker.get_exit_code())


if __name__ == "__main__":
    main()
