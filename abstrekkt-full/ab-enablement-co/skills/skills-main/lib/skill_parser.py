"""
Canonical YAML Frontmatter Parser for SKILL.md Files
=====================================================

This module provides unified parsing utilities for SKILL.md files across the
entire project. It consolidates 8+ independent parser implementations into a
single, well-tested, canonical parser.

Usage:
    from lib.skill_parser import parse_skill_file, discover_all_skills

    # Parse a single skill
    skill = parse_skill_file(Path("_master-skills/technical/api-dev/SKILL.md"))
    print(skill["name"], skill["description"])

    # Parse all skills
    all_skills = discover_all_skills(Path("_master-skills"))
    print(f"Found {len(all_skills)} skills")

Key Features:
    - Primary parser uses yaml.safe_load() with regex fallback
    - Handles multi-line YAML descriptions (folded/literal scalars)
    - Extracts category from file path (parent.parent.name)
    - Extracts slug from directory name (parent.name), NOT from slugify(name)
    - Handles the 5 known cross-category slug collision groups
    - Gracefully handles missing or malformed frontmatter
    - Returns consistent dict structure across all use cases
"""

from __future__ import annotations

import re
from collections import Counter
from pathlib import Path
from typing import Any, Dict, List, Optional

# Try to import yaml, fall back to regex-only parsing if unavailable
try:
    import yaml
    _HAS_YAML = True
except ImportError:
    _HAS_YAML = False


# ---------------------------------------------------------------------------
# Known slug collision groups (5 cross-category duplicates)
# ---------------------------------------------------------------------------
# These skill directory names appear in multiple categories and need
# category prefixes to avoid overwriting each other during conversion.

_SLUG_COLLISION_GROUPS = frozenset({
    "packaging-design",
    "podcast-production",
    "presentation-design",
    "vendor-management",
    "inventory-management",
})


# ---------------------------------------------------------------------------
# Low-level frontmatter parsing
# ---------------------------------------------------------------------------

def parse_frontmatter(text: str) -> Dict[str, Any]:
    """Parse YAML frontmatter from a markdown text string.

    This is the lowest-level parser function. It extracts the YAML block
    between ``---`` markers and attempts to parse it using ``yaml.safe_load``.
    If YAML parsing fails (or PyYAML is unavailable), it falls back to a
    simple regex-based key:value parser.

    Args:
        text: Full markdown text starting with ``---`` frontmatter block.

    Returns:
        Dict of frontmatter fields. Returns empty dict if no frontmatter is
        found or if parsing fails entirely.

    Examples:
        >>> text = "---\\nname: Example\\ndescription: Test\\n---\\nBody here"
        >>> fm = parse_frontmatter(text)
        >>> fm["name"]
        'Example'
    """
    # Extract the block between --- markers
    match = re.match(r"^---\s*\n(.*?)\n---", text, re.DOTALL)
    if not match:
        return {}

    frontmatter_block = match.group(1)

    # Try yaml.safe_load first (handles multi-line scalars, lists, etc.)
    if _HAS_YAML:
        try:
            parsed = yaml.safe_load(frontmatter_block)
            if isinstance(parsed, dict):
                # Clean up string values (strip quotes, whitespace)
                cleaned = {}
                for key, value in parsed.items():
                    if isinstance(value, str):
                        cleaned[key] = value.strip().strip("\"'")
                    else:
                        cleaned[key] = value
                return cleaned
        except Exception:
            # Fall through to regex parser
            pass

    # Fallback: simple line-by-line key:value parser
    frontmatter: Dict[str, Any] = {}
    current_key: Optional[str] = None
    current_value: List[str] = []

    for line in frontmatter_block.splitlines():
        # Multi-line continuation (indented line)
        if line.startswith(" ") or line.startswith("\t"):
            if current_key:
                current_value.append(line.strip())
            continue

        # Flush previous key
        if current_key and current_value:
            frontmatter[current_key] = " ".join(current_value).strip().strip("\"'")
            current_value = []

        # New key:value line
        if ":" in line:
            key, _, value = line.partition(":")
            current_key = key.strip()
            current_value = [value.strip()]

    # Flush final key
    if current_key and current_value:
        frontmatter[current_key] = " ".join(current_value).strip().strip("\"'")

    return frontmatter


# ---------------------------------------------------------------------------
# Mid-level: parse a single skill file
# ---------------------------------------------------------------------------

def parse_skill_file(path: Path) -> Dict[str, Any]:
    """Parse a SKILL.md file and return structured data.

    This is the primary entry point for parsing a single skill file. It
    reads the file, extracts frontmatter and body, and derives category
    and slug from the file path.

    File path structure (expected):
        _master-skills/{category}/{skill-slug}/SKILL.md

    Slug extraction:
        The slug is the directory name (``path.parent.name``), NOT derived
        from the frontmatter ``name`` field. This prevents slug collisions
        from skills that happen to have similar names.

    Category extraction:
        The category is ``path.parent.parent.name`` (the category folder).

    Args:
        path: Absolute path to a SKILL.md file.

    Returns:
        Dict with keys:
        - ``name`` (str): Skill name from frontmatter (or slug if missing)
        - ``description`` (str): Description from frontmatter (or empty string)
        - ``body`` (str): Markdown content after the closing ``---``
        - ``path`` (str): Absolute path as string
        - ``category`` (str): Category folder name
        - ``slug`` (str): Skill directory name

    Raises:
        FileNotFoundError: If the file does not exist.
        UnicodeDecodeError: If the file is not valid UTF-8.

    Examples:
        >>> skill = parse_skill_file(Path("_master-skills/ai-agents/ceo/SKILL.md"))
        >>> skill["category"]
        'ai-agents'
        >>> skill["slug"]
        'ceo'
    """
    # Read file content
    try:
        content = path.read_text(encoding="utf-8", errors="replace")
    except FileNotFoundError:
        raise FileNotFoundError(f"SKILL.md file not found: {path}")
    except UnicodeDecodeError as exc:
        raise UnicodeDecodeError(
            exc.encoding, exc.object, exc.start, exc.end,
            f"SKILL.md file is not valid UTF-8: {path}"
        )

    # Parse frontmatter
    frontmatter = parse_frontmatter(content)

    # Extract body (content after closing ---)
    body_match = re.match(r"^---\s*\n.*?\n---\s*\n?(.*)", content, re.DOTALL)
    body = body_match.group(1).strip() if body_match else content.strip()

    # Derive slug and category from path
    # Expected structure: _master-skills/{category}/{slug}/SKILL.md
    slug = path.parent.name
    category = path.parent.parent.name

    # Extract name (use frontmatter if present, else slug)
    name = frontmatter.get("name", slug)

    # Extract description
    description = frontmatter.get("description", "")

    return {
        "name": name,
        "description": description,
        "body": body,
        "path": str(path),
        "category": category,
        "slug": slug,
    }


# ---------------------------------------------------------------------------
# High-level: discover and parse all skills
# ---------------------------------------------------------------------------

def discover_all_skills(master_dir: Path) -> List[Dict[str, Any]]:
    """Discover and parse all SKILL.md files under a master directory.

    This function:
    1. Finds all SKILL.md files recursively under ``master_dir``
    2. Parses each one using ``parse_skill_file``
    3. Detects slug collisions (5 known cross-category duplicate slugs)
    4. Applies ``{category}--{slug}`` dedup prefix where needed
    5. Returns a list of all parsed skill dicts

    Slug collision handling:
        Some skill directory names appear in multiple categories (e.g.
        ``content-strategy`` exists in both ``strategy/`` and ``creative/``).
        For these skills, we add a category prefix to the slug:
        ``strategy--content-strategy``, ``creative--content-strategy``.

        The collision groups are defined in ``_SLUG_COLLISION_GROUPS``.

    Args:
        master_dir: Root directory containing category subdirectories
            (e.g. ``_master-skills/``).

    Returns:
        List of skill dicts (see ``parse_skill_file`` for dict structure).
        Each dict will have a ``_dedup_slug`` key if the slug was modified
        for deduplication.

    Examples:
        >>> skills = discover_all_skills(Path("_master-skills"))
        >>> len(skills)
        508
        >>> collisions = [s for s in skills if "_dedup_slug" in s]
        >>> len(collisions)
        10
    """
    # Discover all SKILL.md files
    skill_paths = sorted(master_dir.rglob("SKILL.md"))

    # Parse all skills
    skills: List[Dict[str, Any]] = []
    for path in skill_paths:
        try:
            skill = parse_skill_file(path)
            skills.append(skill)
        except (FileNotFoundError, UnicodeDecodeError) as exc:
            # Log error but continue (don't let one bad file break the whole pipeline)
            print(f"[WARN] Failed to parse {path}: {exc}")
            continue

    # Detect slug collisions
    slug_counts = Counter(s["slug"] for s in skills)

    # Apply dedup prefix to collision groups
    for skill in skills:
        slug = skill["slug"]
        category = skill["category"]

        # Type 1: slug appears in multiple categories (known collision groups)
        if slug in _SLUG_COLLISION_GROUPS:
            skill["_dedup_slug"] = f"{category}--{slug}"

        # Type 2: slug appears more than once in the entire skill set
        # (this catches both known and unknown collisions)
        elif slug_counts[slug] > 1:
            skill["_dedup_slug"] = f"{category}--{slug}"

    return skills


# ---------------------------------------------------------------------------
# Utility: get effective slug (with dedup prefix if present)
# ---------------------------------------------------------------------------

def get_effective_slug(skill: Dict[str, Any]) -> str:
    """Return the effective slug for a skill, with dedup prefix if present.

    Use this function when you need the slug that should be used for output
    file names, database keys, etc. It returns ``_dedup_slug`` if present,
    otherwise falls back to ``slug``.

    Args:
        skill: Skill dict (from ``parse_skill_file`` or ``discover_all_skills``).

    Returns:
        Effective slug string (may include category prefix).

    Examples:
        >>> skill = {"slug": "content-strategy", "_dedup_slug": "strategy--content-strategy"}
        >>> get_effective_slug(skill)
        'strategy--content-strategy'
        >>> skill = {"slug": "api-development"}
        >>> get_effective_slug(skill)
        'api-development'
    """
    return skill.get("_dedup_slug", skill.get("slug", ""))


# ---------------------------------------------------------------------------
# Utility: validate frontmatter keys
# ---------------------------------------------------------------------------

def validate_frontmatter_keys(
    frontmatter: Dict[str, Any],
    required: Optional[List[str]] = None,
    optional: Optional[List[str]] = None,
) -> List[str]:
    """Validate that frontmatter contains required keys and no unknown keys.

    This is a simple validator that checks for missing required keys and
    warns about unexpected keys. It does NOT validate value types or content
    quality (use ``lib.skill_validator`` for that).

    Args:
        frontmatter: Parsed frontmatter dict.
        required: List of required key names. Defaults to ``["name", "description"]``.
        optional: List of optional key names. Defaults to common keys like
            ``version``, ``tags``, ``license``, etc.

    Returns:
        List of error messages (empty list if validation passes).

    Examples:
        >>> fm = {"name": "Test", "unknown": "value"}
        >>> errors = validate_frontmatter_keys(fm)
        >>> len(errors)
        2
        >>> "missing required key 'description'" in errors[0].lower()
        True
    """
    if required is None:
        required = ["name", "description"]

    if optional is None:
        optional = [
            "version", "tags", "license", "author", "created", "updated",
            "complexity", "category", "platform", "model", "max_tokens",
            "temperature", "synced_at",
        ]

    errors: List[str] = []
    allowed = set(required) | set(optional)

    # Check for missing required keys
    for key in required:
        if key not in frontmatter:
            errors.append(f"Missing required key '{key}' in frontmatter.")

    # Check for unknown keys
    for key in frontmatter.keys():
        if key not in allowed:
            errors.append(
                f"Unknown frontmatter key '{key}'. "
                f"Allowed keys: {', '.join(sorted(allowed))}"
            )

    return errors


# ---------------------------------------------------------------------------
# Module-level test helper (for development/debugging)
# ---------------------------------------------------------------------------

def _test_parser() -> None:
    """Quick test of the parser against the live skill directory.

    This is a development/debugging helper. Run it via:
        python -c "from lib.skill_parser import _test_parser; _test_parser()"
    """
    master_dir = Path(__file__).resolve().parent.parent / "_master-skills"
    if not master_dir.is_dir():
        print(f"Error: Master skills directory not found: {master_dir}")
        return

    print("Testing skill parser...")
    print(f"Master directory: {master_dir}")
    print()

    # Test 1: Parse all skills
    print("[1/3] Discovering all skills...")
    skills = discover_all_skills(master_dir)
    print(f"  Found {len(skills)} skills")
    print()

    # Test 2: Check for dedup slugs
    print("[2/3] Checking for slug collisions...")
    dedup_skills = [s for s in skills if "_dedup_slug" in s]
    print(f"  {len(dedup_skills)} skills have dedup prefix")
    if dedup_skills:
        print("  Examples:")
        for skill in dedup_skills[:5]:
            print(f"    {skill['slug']} -> {skill['_dedup_slug']}")
    print()

    # Test 3: Parse a single known skill
    print("[3/3] Testing single skill parse...")
    test_path = master_dir / "ai-agents" / "ceo" / "SKILL.md"
    if test_path.is_file():
        skill = parse_skill_file(test_path)
        print(f"  Name:        {skill['name']}")
        print(f"  Category:    {skill['category']}")
        print(f"  Slug:        {skill['slug']}")
        print(f"  Description: {skill['description'][:80]}...")
        print(f"  Body length: {len(skill['body'])} chars")
    else:
        print(f"  Test file not found: {test_path}")
    print()

    print("Parser test complete.")


if __name__ == "__main__":
    _test_parser()
