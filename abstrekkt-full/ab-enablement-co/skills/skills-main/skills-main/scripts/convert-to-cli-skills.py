#!/usr/bin/env python3
"""
Universal CLI Skill Placer
Converts master skills into platform-specific CLI skill formats for
Claude CLI, Gemini CLI, Codex CLI, and GitHub Copilot CLI.

DEPRECATED: This standalone script is maintained for backward compatibility.
Prefer using the unified pipeline instead:
    python sync-skills.py --targets cli
    python sync-skills.py --targets cli --category technical --dry-run

The sync-skills.py pipeline uses the same CLISkillsConverter class with
platform tuning, metadata enrichment, and skill validation support.

This script will attempt to delegate to sync-skills.py's CLISkillsConverter
when importable; otherwise it falls back to its own inline logic.

Legacy usage (still supported):
    python convert_to_cli_skills.py --platforms all
    python convert_to_cli_skills.py --platforms claude,gemini
    python convert_to_cli_skills.py --platforms codex --category technical
    python convert_to_cli_skills.py --platforms all --skill api-development
    python convert_to_cli_skills.py --platforms all --dry-run

No external dependencies. Uses only pathlib, re, json, argparse.
"""

import argparse
import re
import sys
import warnings
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# ── Paths ──────────────────────────────────────────────────────────────────

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from lib.config import BASE_DIR, CATEGORIES, MASTER_DIR
from lib.skill_parser import discover_all_skills, get_effective_slug

# Graceful import of shared platform tuning module
_HAS_PLATFORM_TUNING = False
try:
    from lib.platform_tuning import estimate_complexity
    _HAS_PLATFORM_TUNING = True
except ImportError:
    pass

PLATFORM_OUTPUTS: Dict[str, Path] = {
    "claude":  BASE_DIR / "platforms" / "claude"        / "claude-skills-cli",
    "gemini":  BASE_DIR / "platforms" / "gemini"        / "gemini-skills-cli",
    "codex":   BASE_DIR / "platforms" / "codex"         / "codex-skills-cli",
    "copilot": BASE_DIR / "platforms" / "github-copilot" / "copilot-skills-cli",
}

ALL_PLATFORMS = list(PLATFORM_OUTPUTS.keys())

# ── Frontmatter Parsing ───────────────────────────────────────────────────

def parse_frontmatter(content: str) -> Tuple[Dict[str, str], str]:
    """Parse YAML frontmatter from markdown content.

    Returns (metadata_dict, body) where body is everything after the
    closing --- delimiter.  Only extracts 'name' and 'description' as
    flat strings; all other keys are silently kept as-is in the raw
    frontmatter block but not parsed into the dict.
    """
    metadata: Dict[str, str] = {}
    body = content

    match = re.match(r"^---\s*\n(.*?)\n---\s*\n?", content, re.DOTALL)
    if match:
        raw_fm = match.group(1)
        body = content[match.end():]

        # Extract name
        m = re.search(r"^name:\s*(.+)$", raw_fm, re.MULTILINE)
        if m:
            metadata["name"] = m.group(1).strip().strip("\"'")

        # Extract description (may be multi-line folded scalar)
        m = re.search(r"^description:\s*(.+)$", raw_fm, re.MULTILINE)
        if m:
            metadata["description"] = m.group(1).strip().strip("\"'")

    return metadata, body


def build_clean_frontmatter(name: str, description: str) -> str:
    """Build a minimal YAML frontmatter block."""
    # Escape any quotes in description for YAML safety
    desc_safe = description.replace('"', '\\"')
    return f'---\nname: {name}\ndescription: "{desc_safe}"\n---\n'


def skill_title_from_name(name: str) -> str:
    """Convert kebab-case skill name to Title Case."""
    return " ".join(word.capitalize() for word in name.split("-"))


# ── Skill Discovery ───────────────────────────────────────────────────────

def discover_skills(
    category_filter: Optional[str] = None,
    skill_filter: Optional[str] = None,
) -> List[Tuple[str, str, Path]]:
    """Return list of (category, skill_name, skill_path) tuples.

    Applies optional category and skill-name filters.
    """
    results: List[Tuple[str, str, Path]] = []

    categories = [category_filter] if category_filter else CATEGORIES

    for cat in categories:
        cat_dir = MASTER_DIR / cat
        if not cat_dir.is_dir():
            continue
        for skill_dir in sorted(cat_dir.iterdir()):
            if not skill_dir.is_dir():
                continue
            skill_md = skill_dir / "SKILL.md"
            if not skill_md.is_file():
                continue
            skill_name = skill_dir.name
            if skill_filter and skill_name != skill_filter:
                continue
            results.append((cat, skill_name, skill_md))

    return results


# ── Platform Formatters ───────────────────────────────────────────────────

def format_claude(content: str, metadata: Dict[str, str], body: str) -> str:
    """Claude CLI: direct copy with clean frontmatter (name + description)."""
    name = metadata.get("name", "unknown-skill")
    desc = metadata.get("description", "")
    return build_clean_frontmatter(name, desc) + "\n" + body.lstrip("\n")


def format_gemini(content: str, metadata: Dict[str, str], body: str) -> str:
    """Gemini CLI: copy with clean frontmatter plus Gemini-specific suffix."""
    name = metadata.get("name", "unknown-skill")
    desc = metadata.get("description", "")

    suffix = (
        "\n\n## Gemini-Specific Notes\n"
        "- Use `@` to reference files in the current workspace for context\n"
        "- Leverage Google Search grounding for up-to-date information when relevant\n"
        "- For code tasks, Gemini can execute code directly - ask it to run and verify\n"
    )

    return build_clean_frontmatter(name, desc) + "\n" + body.lstrip("\n") + suffix


def format_codex(content: str, metadata: Dict[str, str], body: str) -> str:
    """Codex CLI: restructured as AGENTS.md with instructions block."""
    name = metadata.get("name", "unknown-skill")
    desc = metadata.get("description", "")
    title = skill_title_from_name(name)

    suffix = (
        "\n\n## Codex Configuration\n"
        "- This agent can read and write files in the workspace\n"
        "- Use sandbox execution for code verification\n"
    )

    return (
        f"# {title}\n"
        f"> {desc}\n\n"
        f"## Instructions\n\n"
        f"{body.lstrip(chr(10))}"
        f"{suffix}"
    )


def format_copilot(content: str, metadata: Dict[str, str], body: str) -> str:
    """Copilot CLI: copy with clean frontmatter plus Copilot-specific suffix."""
    name = metadata.get("name", "unknown-skill")
    desc = metadata.get("description", "")

    suffix = (
        "\n\n## GitHub Copilot Integration\n"
        "- Use `@workspace` to reference project files and structure\n"
        "- Use `@terminal` for command execution context\n"
        "- Reference specific files with `#file:path/to/file` syntax\n"
    )

    return build_clean_frontmatter(name, desc) + "\n" + body.lstrip("\n") + suffix


FORMATTERS = {
    "claude":  format_claude,
    "gemini":  format_gemini,
    "codex":   format_codex,
    "copilot": format_copilot,
}

# Output filename per platform
OUTPUT_FILENAMES = {
    "claude":  "SKILL.md",
    "gemini":  "SKILL.md",
    "codex":   "AGENTS.md",
    "copilot": "SKILL.md",
}


# ── Complexity Detection ──────────────────────────────────────────────────

def get_complexity_label(body: str) -> str:
    """Estimate complexity of a skill.

    Uses shared platform_tuning module if available, otherwise falls back
    to a simple line-count heuristic.
    """
    if _HAS_PLATFORM_TUNING:
        return estimate_complexity({"body": body})

    # Fallback: simple line-count heuristic
    line_count = body.count("\n") + 1
    if line_count < 100:
        return "simple"
    elif line_count <= 300:
        return "moderate"
    return "complex"


# ── Root Config Generators ────────────────────────────────────────────────

def generate_root_config(
    platform: str,
    skills_by_category: Dict[str, List[Tuple[str, str]]],
    dry_run: bool = False,
) -> Optional[Path]:
    """Generate root-level config/index file for the given platform.

    skills_by_category maps category -> list of (skill_name, description).
    Returns the path written, or None for dry-run.
    """
    output_root = PLATFORM_OUTPUTS[platform]
    total = sum(len(v) for v in skills_by_category.values())

    # Build the category index block shared by all platforms
    index_lines: List[str] = []
    for cat in CATEGORIES:
        entries = skills_by_category.get(cat, [])
        if not entries:
            continue
        index_lines.append(f"\n### {skill_title_from_name(cat)} ({len(entries)} skills)")
        for sname, sdesc in sorted(entries):
            short_desc = sdesc[:120] + "..." if len(sdesc) > 120 else sdesc
            index_lines.append(f"- **{sname}** - {short_desc}")
    index_block = "\n".join(index_lines)

    # Platform-specific content
    if platform == "claude":
        dest = output_root / "CLAUDE.md"
        content = (
            f"# Claude CLI Skills Library\n\n"
            f"This directory contains {total} skills converted from the master "
            f"skills repository for use with Claude Code CLI.\n\n"
            f"## Usage\n\n"
            f"Skills are located in `skills/{{skill-name}}/SKILL.md`. "
            f"Claude Code automatically discovers skills in this structure.\n\n"
            f"## Skill Index\n"
            f"{index_block}\n"
        )

    elif platform == "gemini":
        dest = output_root / "GEMINI.md"
        content = (
            f"# Gemini CLI Skills Library\n\n"
            f"This directory contains {total} skills converted from the master "
            f"skills repository for use with Gemini CLI.\n\n"
            f"## Usage\n\n"
            f"Skills are located in `skills/{{skill-name}}/SKILL.md`. "
            f"Reference files in your workspace with `@` and leverage Google "
            f"Search grounding for up-to-date context.\n\n"
            f"## Skill Index\n"
            f"{index_block}\n"
        )

    elif platform == "codex":
        dest = output_root / "AGENTS.md"
        content = (
            f"# Codex CLI Agents Library\n\n"
            f"This directory contains {total} agent definitions converted from "
            f"the master skills repository for use with Codex CLI.\n\n"
            f"## Usage\n\n"
            f"Agents are located in `skills/{{skill-name}}/AGENTS.md`. "
            f"Each agent can read and write files in the workspace and use "
            f"sandbox execution for code verification.\n\n"
            f"## Agent Index\n"
            f"{index_block}\n"
        )

    elif platform == "copilot":
        dest = output_root / ".github" / "copilot-instructions.md"
        content = (
            f"# GitHub Copilot CLI Skills Library\n\n"
            f"This directory contains {total} skills converted from the master "
            f"skills repository for use with GitHub Copilot CLI.\n\n"
            f"## Usage\n\n"
            f"Skills are located in `skills/{{skill-name}}/SKILL.md`. "
            f"Use `@workspace` to reference project files, `@terminal` for "
            f"command context, and `#file:path` to reference specific files.\n\n"
            f"## Skill Index\n"
            f"{index_block}\n"
        )
    else:
        return None

    if dry_run:
        print(f"  [DRY-RUN] Would write root config: {dest}")
        return None

    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(content, encoding="utf-8")
    return dest


# ── Main Conversion Logic ─────────────────────────────────────────────────

def convert_skills(
    platforms: List[str],
    category_filter: Optional[str] = None,
    skill_filter: Optional[str] = None,
    dry_run: bool = False,
) -> Dict[str, int]:
    """Run the full conversion pipeline.

    Returns a dict mapping platform -> number of skills written.
    """
    skills = discover_skills(category_filter, skill_filter)

    if not skills:
        print("No matching skills found.")
        return {p: 0 for p in platforms}

    print(f"Found {len(skills)} master skill(s) to convert.")
    print(f"Target platforms: {', '.join(platforms)}\n")

    # Build dedup slug map using lib/skill_parser for collision handling
    _dedup_map: Dict[Tuple[str, str], str] = {}
    try:
        all_parsed = discover_all_skills(MASTER_DIR)
        for s in all_parsed:
            _dedup_map[(s["category"], s["slug"])] = get_effective_slug(s)
    except Exception:
        pass  # Fall back to bare skill names if discovery fails

    counts: Dict[str, int] = {p: 0 for p in platforms}

    # Track skills per category for root config generation
    skills_by_category: Dict[str, Dict[str, List[Tuple[str, str]]]] = {
        p: {} for p in platforms
    }

    for category, skill_name, skill_path in skills:
        content = skill_path.read_text(encoding="utf-8", errors="replace")
        metadata, body = parse_frontmatter(content)

        # Ensure name is set
        if "name" not in metadata:
            metadata["name"] = skill_name

        desc = metadata.get("description", "")

        # Use dedup slug to avoid cross-category collisions
        effective_slug = _dedup_map.get((category, skill_name), skill_name)

        for platform in platforms:
            formatter = FORMATTERS[platform]
            filename = OUTPUT_FILENAMES[platform]
            output_dir = PLATFORM_OUTPUTS[platform] / "skills" / effective_slug
            output_file = output_dir / filename

            formatted = formatter(content, metadata, body)

            if dry_run:
                print(f"  [DRY-RUN] {platform:>7} | {category}/{skill_name} -> {output_file}")
            else:
                output_dir.mkdir(parents=True, exist_ok=True)
                output_file.write_text(formatted, encoding="utf-8")
                print(f"  {platform:>7} | {category}/{skill_name} -> {output_file.name}")

            counts[platform] += 1

            # Record for root config
            cat_list = skills_by_category[platform].setdefault(category, [])
            cat_list.append((skill_name, desc))

    # Generate root config files
    print()
    for platform in platforms:
        cfg_path = generate_root_config(
            platform,
            skills_by_category[platform],
            dry_run=dry_run,
        )
        if cfg_path:
            print(f"  Root config written: {cfg_path}")

    return counts


# ── CLI ────────────────────────────────────────────────────────────────────

def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Universal CLI Skill Placer - converts master skills to "
                    "platform-specific CLI formats.",
    )
    parser.add_argument(
        "--platforms",
        default="all",
        help=(
            "Comma-separated list of target platforms: "
            "claude, gemini, codex, copilot, or 'all'. Default: all"
        ),
    )
    parser.add_argument(
        "--category",
        default=None,
        choices=CATEGORIES,
        help="Convert only skills from this category.",
    )
    parser.add_argument(
        "--skill",
        default=None,
        help="Convert only this specific skill (by directory name).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be done without writing any files.",
    )
    return parser.parse_args(argv)


def resolve_platforms(raw: str) -> List[str]:
    """Parse the --platforms argument into a validated list."""
    if raw.strip().lower() == "all":
        return ALL_PLATFORMS

    requested = [p.strip().lower() for p in raw.split(",") if p.strip()]
    invalid = [p for p in requested if p not in ALL_PLATFORMS]
    if invalid:
        print(f"Error: unknown platform(s): {', '.join(invalid)}")
        print(f"Valid platforms: {', '.join(ALL_PLATFORMS)}")
        sys.exit(1)
    return requested


# ---------------------------------------------------------------------------
# Sync-skills.py delegation helpers
# ---------------------------------------------------------------------------

_HAS_SYNCER = False
try:
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    from importlib import import_module as _import_module
    _sync_mod = _import_module("sync-skills")
    _SyncCLIConverter = _sync_mod.CLISkillsConverter
    _SyncSkillsSyncer = _sync_mod.SkillsSyncer
    _HAS_SYNCER = True
except Exception:
    _SyncCLIConverter = None
    _SyncSkillsSyncer = None


def _run_via_syncer(args) -> bool:
    """Attempt to run via sync-skills.py's SkillsSyncer.

    The unified pipeline's ``cli`` target writes all four platform CLI
    variants in a single pass. This function delegates to it when the
    user has not requested a platform subset (the syncer always writes
    all four).

    Returns True if delegation succeeded, False to fall back.
    """
    if not _HAS_SYNCER or _SyncSkillsSyncer is None:
        return False

    platforms = resolve_platforms(args.platforms)

    # The syncer's CLISkillsConverter always writes all four CLI
    # platforms in one pass.  If the user selected a subset, the syncer
    # cannot honour that, so we fall back to inline logic.
    if set(platforms) != set(ALL_PLATFORMS):
        print(
            f"  (platform subset requested: {', '.join(platforms)}; "
            f"using standalone converter logic)\n"
        )
        return False

    base_dir = Path(__file__).resolve().parent.parent
    syncer = _SyncSkillsSyncer(base_dir)

    common_kwargs = dict(
        targets=["cli"],
        dry_run=args.dry_run,
        show_stats=True,
    )

    if args.skill:
        # Need to find the category for the skill
        for cat in CATEGORIES:
            skill_ref = f"{cat}/{args.skill}"
            skill_path = base_dir / "_master-skills" / cat / args.skill / "SKILL.md"
            if skill_path.exists():
                syncer.sync_skill(skill_ref, **common_kwargs)
                break
        else:
            print(f"Skill not found: {args.skill}")
    elif args.category:
        syncer.sync_category(args.category, **common_kwargs)
    else:
        syncer.sync_all(**common_kwargs)

    return True


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def _main_standalone(argv: Optional[List[str]] = None) -> None:
    """Original standalone conversion logic (used as fallback)."""
    args = parse_args(argv)
    platforms = resolve_platforms(args.platforms)

    if args.dry_run:
        print("=== DRY RUN MODE ===\n")

    print("=" * 60)
    print("  Universal CLI Skill Placer  (standalone / fallback)")
    print("=" * 60)
    print(f"  Master source : {MASTER_DIR}")
    print(f"  Platforms     : {', '.join(platforms)}")
    if args.category:
        print(f"  Category      : {args.category}")
    if args.skill:
        print(f"  Skill         : {args.skill}")
    print("=" * 60)
    print()

    counts = convert_skills(
        platforms=platforms,
        category_filter=args.category,
        skill_filter=args.skill,
        dry_run=args.dry_run,
    )

    # Summary
    print()
    print("-" * 40)
    print("  Summary")
    print("-" * 40)
    for platform, count in counts.items():
        verb = "would place" if args.dry_run else "placed"
        print(f"  {platform:>7}: {count} skill(s) {verb}")
    total = sum(counts.values())
    print(f"  {'total':>7}: {total} file(s)")
    print("-" * 40)

    if args.dry_run:
        print("\nNo files were written (dry-run mode).")
    else:
        print("\nDone.")


def main(argv: Optional[List[str]] = None) -> None:
    warnings.warn(
        "convert_to_cli_skills.py is deprecated. "
        "Use 'python sync-skills.py --targets cli' instead.",
        DeprecationWarning,
        stacklevel=2,
    )
    print(
        "NOTE: This script is deprecated. "
        "Prefer: python sync-skills.py --targets cli\n"
    )

    args = parse_args(argv)

    # Try to delegate to the unified sync-skills.py pipeline
    if _run_via_syncer(args):
        return

    # Fallback: run the original standalone logic
    _main_standalone(argv)


if __name__ == "__main__":
    main()
