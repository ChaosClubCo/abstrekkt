#!/usr/bin/env python3
"""
Convert all SKILL.md files from _master-skills to OpenAI Responses API format.
Replaces the deprecated Assistants API format (sunset Aug 2026).

DEPRECATED: This standalone script is maintained for backward compatibility.
Prefer using the unified pipeline instead:
    python sync-skills.py --targets codex
    python sync-skills.py --targets codex --category technical --dry-run

The sync-skills.py pipeline uses the same CodexResponsesConverter class with
platform tuning, metadata enrichment, and skill validation support.

This script will attempt to delegate to sync-skills.py's CodexResponsesConverter
when importable; otherwise it falls back to its own inline logic.

Note: This standalone script generates 5 formats (responses, gpts, agents,
system-prompts, cli/AGENTS.md) while sync-skills.py generates 3 (responses,
gpts, system-prompts). The agent.json and cli/AGENTS.md formats are unique
to this script. When delegation is active, this script runs the syncer for
the core 3 formats, then supplements with agent.json and cli/AGENTS.md.

Legacy usage (still supported):
    python convert_to_codex_responses.py
    python convert_to_codex_responses.py --category technical
    python convert_to_codex_responses.py --skill api-development
    python convert_to_codex_responses.py --dry-run
"""

import argparse
import json
import re
import sys
import warnings
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from lib.config import (
    CATEGORIES,
)
from lib.config import (
    CATEGORY_TEMPERATURES as TEMPERATURE_MAP,
)
from lib.config import (
    CODEX_CATEGORY_MODELS as MODEL_MAP,
)
from lib.config import (
    CODEX_TOOLS as TOOLS_MAP,
)
from lib.config import (
    MASTER_DIR as _MASTER_DIR,
)

# Graceful import of shared platform tuning module
_HAS_PLATFORM_TUNING = False
try:
    from lib.platform_tuning import get_codex_settings
    _HAS_PLATFORM_TUNING = True
except ImportError:
    pass

SOURCE_DIR = _MASTER_DIR
TARGET_DIR = Path(__file__).resolve().parent.parent / "platforms" / "codex" / "codex-skills"

# Capabilities for GPT Builder format
CAPABILITIES_MAP = {
    "technical": {"web_browsing": False, "code_interpreter": True, "image_generation": False, "file_upload": True},
    "strategy": {"web_browsing": True, "code_interpreter": True, "image_generation": False, "file_upload": True},
    "creative": {"web_browsing": False, "code_interpreter": True, "image_generation": True, "file_upload": True},
    "industry": {"web_browsing": True, "code_interpreter": True, "image_generation": False, "file_upload": True},
    "operations": {"web_browsing": False, "code_interpreter": True, "image_generation": False, "file_upload": True},
    "ai-agents": {"web_browsing": True, "code_interpreter": True, "image_generation": False, "file_upload": True},
}

AGENT_LOOP_PREFIX = """You are an autonomous agent. Follow these operating principles:
1. Break complex tasks into discrete, verifiable steps.
2. Use your tools to gather information before generating responses.
3. Verify your work at each step before proceeding.
4. If uncertain, state your confidence level and reasoning.
5. Provide structured, actionable output.

"""

# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------


def slugify(name: str) -> str:
    """Convert a name to a URL-safe slug."""
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def parse_skill_md(file_path: Path) -> Optional[Dict[str, Any]]:
    """Parse a SKILL.md file and return structured data."""
    try:
        content = file_path.read_text(encoding="utf-8", errors="replace")
    except Exception as e:
        print(f"  ERROR reading {file_path}: {e}")
        return None

    frontmatter_match = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", content, re.DOTALL)
    if not frontmatter_match:
        print(f"  WARN: No frontmatter in {file_path}")
        return None

    fm_text = frontmatter_match.group(1)
    body = frontmatter_match.group(2).strip()

    # Extract name
    name = file_path.parent.name
    name_match = re.search(r"^name:\s*(.+)$", fm_text, re.MULTILINE)
    if name_match:
        name = name_match.group(1).strip().strip("\"'")

    # Extract description
    description = f"Skill for {name}"
    desc_match = re.search(r"^description:\s*(.+?)(?=\n[a-zA-Z_-]+:|$)", fm_text, re.MULTILINE | re.DOTALL)
    if desc_match:
        description = " ".join(desc_match.group(1).strip().strip("\"'").split())

    category = file_path.parent.parent.name

    return {
        "name": name,
        "description": description,
        "body": body,
        "category": category,
        "slug": file_path.parent.name,
        "path": str(file_path),
        "line_count": len(body.splitlines()),
    }


def generate_starters(name: str, description: str, category: str) -> List[str]:
    """Generate 4 contextual conversation starters for a skill."""
    clean_name = name.replace("-", " ").title()

    # Category-specific starter templates
    templates = {
        "technical": [
            f"Help me implement {clean_name} in my project",
            f"Review my current {clean_name} setup and suggest improvements",
            f"What are the best practices for {clean_name}?",
            f"Debug an issue I'm having with {clean_name}",
        ],
        "strategy": [
            f"Create a {clean_name} plan for my business",
            f"Analyze my current {clean_name} approach",
            f"What frameworks work best for {clean_name}?",
            f"Help me present {clean_name} findings to stakeholders",
        ],
        "creative": [
            f"Help me design a {clean_name} concept",
            f"Review my {clean_name} work and give feedback",
            f"What are current trends in {clean_name}?",
            f"Create a {clean_name} brief for my project",
        ],
        "industry": [
            f"Guide me through {clean_name} compliance requirements",
            f"Create a {clean_name} assessment for my organization",
            f"What are the key regulations for {clean_name}?",
            f"Build a {clean_name} implementation roadmap",
        ],
        "operations": [
            f"Optimize my {clean_name} processes",
            f"Create KPIs for {clean_name}",
            f"Identify bottlenecks in my {clean_name} workflow",
            f"Build a {clean_name} improvement plan",
        ],
        "ai-agents": [
            f"Help me set up {clean_name} automation",
            f"Design a {clean_name} workflow",
            f"What tools integrate best with {clean_name}?",
            f"Troubleshoot my {clean_name} implementation",
        ],
    }

    return templates.get(category, templates["technical"])


# ---------------------------------------------------------------------------
# Converters
# ---------------------------------------------------------------------------


def make_response_json(skill: Dict[str, Any]) -> Dict[str, Any]:
    """Create Responses API format.

    Uses shared platform_tuning module if available, otherwise falls back
    to inline MODEL_MAP and TOOLS_MAP.
    """
    cat = skill["category"]

    if _HAS_PLATFORM_TUNING:
        settings = get_codex_settings({"category": cat, "body": skill["body"]})
        model = settings.get("model", "gpt-4.1")
        tools_list = settings.get("tools", ["code_interpreter"])
        tools = [{"type": t} for t in tools_list]
    else:
        model = MODEL_MAP.get(cat, "gpt-4.1")
        tools = TOOLS_MAP.get(cat, [{"type": "code_interpreter"}])

    return {
        "model": model,
        "instructions": skill["body"],
        "tools": tools,
        "metadata": {
            "skill_name": skill["name"],
            "category": cat,
            "version": "1.0.0",
            "source": "master-skills",
        },
        "temperature": TEMPERATURE_MAP.get(cat, 0.5),
        "top_p": 1.0,
        "max_output_tokens": 4096,
    }


def make_gpt_json(skill: Dict[str, Any]) -> Dict[str, Any]:
    """Create GPT Builder format."""
    cat = skill["category"]
    return {
        "name": skill["name"].replace("-", " ").title(),
        "description": skill["description"],
        "instructions": skill["body"],
        "conversation_starters": generate_starters(skill["name"], skill["description"], cat),
        "capabilities": CAPABILITIES_MAP.get(cat, CAPABILITIES_MAP["technical"]),
        "category": cat,
    }


def make_agent_json(skill: Dict[str, Any]) -> Dict[str, Any]:
    """Create Agent Builder format.

    Uses shared platform_tuning module if available, otherwise falls back
    to inline MODEL_MAP and TOOLS_MAP.
    """
    cat = skill["category"]

    if _HAS_PLATFORM_TUNING:
        settings = get_codex_settings({"category": cat, "body": skill["body"]})
        model = settings.get("model", "gpt-4.1")
        tools_list = settings.get("tools", ["code_interpreter"])
        tools = [{"type": t} for t in tools_list]
    else:
        model = MODEL_MAP.get(cat, "gpt-4.1")
        tools = TOOLS_MAP.get(cat, [{"type": "code_interpreter"}])

    # Truncate handoff_description intelligently at sentence boundary
    handoff = skill["description"]
    if len(handoff) > 500:
        # Find last period before 500 char limit
        truncated = handoff[:500]
        last_period = truncated.rfind('.')
        if last_period > 0:
            handoff = truncated[:last_period + 1] + "..."
        else:
            # No period found, just truncate with ellipsis
            handoff = truncated + "..."

    return {
        "name": f"{skill['name'].replace('-', ' ').title()} Agent",
        "description": skill["description"],
        "instructions": AGENT_LOOP_PREFIX + skill["body"],
        "model": model,
        "tools": tools,
        "handoff_description": handoff,
        "metadata": {
            "category": cat,
            "version": "1.0.0",
        },
    }


def make_agents_md(skill: Dict[str, Any]) -> str:
    """Create AGENTS.md for Codex CLI."""
    title = skill["name"].replace("-", " ").title()
    tools_section = "- Code interpreter for executing code"
    cat = skill["category"]
    if cat in ("strategy", "industry", "ai-agents"):
        tools_section += "\n- Web search for current information"
    if cat == "technical":
        tools_section += "\n- File operations for reading and writing files"
    tools_section += "\n- Sandbox execution for code verification"

    return f"""# {title}

> {skill['description']}

## Instructions

{skill['body']}

## Tools

{tools_section}
"""


# ---------------------------------------------------------------------------
# Main conversion
# ---------------------------------------------------------------------------


def convert_skill(skill: Dict[str, Any], target_dir: Path, dry_run: bool = False) -> Dict[str, int]:
    """Convert a single skill to all Codex formats. Returns counts by format."""
    slug = skill["slug"]
    cat = skill["category"]
    counts = {}

    outputs = [
        ("responses", f"responses/{cat}/{slug}.response.json", json.dumps(make_response_json(skill), indent=2, ensure_ascii=False)),
        ("gpts", f"gpts/{cat}/{slug}.gpt.json", json.dumps(make_gpt_json(skill), indent=2, ensure_ascii=False)),
        ("agents", f"agents/{cat}/{slug}.agent.json", json.dumps(make_agent_json(skill), indent=2, ensure_ascii=False)),
        ("system-prompts", f"system-prompts/{cat}/{slug}.txt", skill["body"]),
        ("cli", f"cli/{cat}/{slug}/AGENTS.md", make_agents_md(skill)),
    ]

    for fmt, rel_path, content in outputs:
        out_path = target_dir / rel_path
        if dry_run:
            print(f"    [DRY-RUN] Would write: {out_path}")
        else:
            out_path.parent.mkdir(parents=True, exist_ok=True)
            out_path.write_text(content, encoding="utf-8")
        counts[fmt] = counts.get(fmt, 0) + 1

    return counts


def convert_category(category: str, source_dir: Path, target_dir: Path,
                     skill_filter: Optional[str] = None, dry_run: bool = False) -> Tuple[int, int, Dict[str, int]]:
    """Convert all skills in a category. Returns (success, errors, format_counts)."""
    cat_dir = source_dir / category
    if not cat_dir.exists():
        print(f"  Category directory not found: {cat_dir}")
        return 0, 0, {}

    success = 0
    errors = 0
    format_counts: Dict[str, int] = {}

    for skill_dir in sorted(cat_dir.iterdir()):
        if not skill_dir.is_dir():
            continue

        # Filter to specific skill if requested
        if skill_filter and skill_dir.name != skill_filter:
            continue

        skill_file = skill_dir / "SKILL.md"
        if not skill_file.exists():
            continue

        skill = parse_skill_md(skill_file)
        if skill is None:
            errors += 1
            continue

        try:
            counts = convert_skill(skill, target_dir, dry_run)
            for fmt, count in counts.items():
                format_counts[fmt] = format_counts.get(fmt, 0) + count
            success += 1
        except Exception as e:
            print(f"  ERROR converting {skill_dir.name}: {e}")
            errors += 1

    return success, errors, format_counts


# ---------------------------------------------------------------------------
# Sync-skills.py delegation helpers
# ---------------------------------------------------------------------------

_HAS_SYNCER = False
try:
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    from importlib import import_module as _import_module
    _sync_mod = _import_module("sync-skills")
    _SyncSkillParser = _sync_mod.SkillParser
    _SyncCodexConverter = _sync_mod.CodexResponsesConverter
    _SyncSkillsSyncer = _sync_mod.SkillsSyncer
    _HAS_SYNCER = True
except Exception:
    _SyncSkillParser = None
    _SyncCodexConverter = None
    _SyncSkillsSyncer = None


def _run_via_syncer(args) -> bool:
    """Attempt to run the core codex conversion via sync-skills.py.

    The unified pipeline produces responses, gpts, and system-prompt files.
    This function then supplements with agent.json and cli/AGENTS.md which
    are unique to this standalone script.

    Returns True if delegation succeeded, False to fall back to inline logic.
    """
    if not _HAS_SYNCER or _SyncSkillsSyncer is None:
        return False

    # If the user overrides --source or --target away from defaults, the
    # syncer cannot honour that (it derives paths from base_dir).
    if args.source != SOURCE_DIR or args.target != TARGET_DIR:
        print("  (custom --source/--target detected; using standalone converter logic)\n")
        return False

    base_dir = Path(__file__).resolve().parent.parent
    syncer = _SyncSkillsSyncer(base_dir)

    common_kwargs = dict(
        targets=["codex"],
        dry_run=args.dry_run,
        show_stats=True,
    )

    # Run core conversion via syncer (responses, gpts, system-prompts)
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
            return True
    elif args.category:
        syncer.sync_category(args.category, **common_kwargs)
    else:
        syncer.sync_all(**common_kwargs)

    # Supplement with agent.json and cli/AGENTS.md (unique to this script)
    print("\n  Supplementing with agent.json and cli/AGENTS.md formats...")
    categories = [args.category] if args.category else CATEGORIES
    supplement_count = 0

    for category in categories:
        cat_dir = args.source / category
        if not cat_dir.exists():
            continue
        for skill_dir in sorted(cat_dir.iterdir()):
            if not skill_dir.is_dir():
                continue
            if args.skill and skill_dir.name != args.skill:
                continue
            skill_file = skill_dir / "SKILL.md"
            if not skill_file.exists():
                continue
            skill = parse_skill_md(skill_file)
            if skill is None:
                continue
            slug = skill["slug"]
            cat = skill["category"]

            # agent.json
            agent_path = args.target / "agents" / cat / f"{slug}.agent.json"
            agent_content = json.dumps(make_agent_json(skill), indent=2, ensure_ascii=False)

            # cli/AGENTS.md
            cli_path = args.target / "cli" / cat / slug / "AGENTS.md"
            cli_content = make_agents_md(skill)

            if args.dry_run:
                print(f"    [DRY-RUN] Would write: {agent_path}")
                print(f"    [DRY-RUN] Would write: {cli_path}")
            else:
                agent_path.parent.mkdir(parents=True, exist_ok=True)
                agent_path.write_text(agent_content, encoding="utf-8")
                cli_path.parent.mkdir(parents=True, exist_ok=True)
                cli_path.write_text(cli_content, encoding="utf-8")

            supplement_count += 1

    print(f"  Supplemented {supplement_count} skills with agent.json + cli/AGENTS.md")
    return True


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def _main_standalone(args) -> None:
    """Original standalone conversion logic (used as fallback)."""
    print("=" * 60)
    print("Converting SKILL.md to OpenAI Responses API Formats  (standalone / fallback)")
    print("=" * 60)
    print(f"Source: {args.source}")
    print(f"Target: {args.target}")
    if args.dry_run:
        print("MODE: DRY RUN (no files will be written)")
    print()

    categories = [args.category] if args.category else CATEGORIES
    total_success = 0
    total_errors = 0
    total_formats: Dict[str, int] = {}

    for category in categories:
        print(f"Processing: {category}")
        print("-" * 40)

        success, errors, fmt_counts = convert_category(
            category, args.source, args.target,
            skill_filter=args.skill, dry_run=args.dry_run,
        )

        total_success += success
        total_errors += errors
        for fmt, count in fmt_counts.items():
            total_formats[fmt] = total_formats.get(fmt, 0) + count

        print(f"  Skills converted: {success}")
        if errors:
            print(f"  Errors: {errors}")
        print()

    print("=" * 60)
    print("CONVERSION COMPLETE")
    print("=" * 60)
    print(f"Total skills: {total_success}")
    print(f"Total errors: {total_errors}")
    print()
    print("Files by format:")
    for fmt, count in sorted(total_formats.items()):
        print(f"  {fmt}: {count}")
    print(f"\nOutput: {args.target}")


def main():
    warnings.warn(
        "convert_to_codex_responses.py is deprecated. "
        "Use 'python sync-skills.py --targets codex' instead.",
        DeprecationWarning,
        stacklevel=2,
    )
    print(
        "NOTE: This script is deprecated. "
        "Prefer: python sync-skills.py --targets codex\n"
    )

    parser = argparse.ArgumentParser(description="Convert skills to OpenAI Responses API format")
    parser.add_argument("--source", type=Path, default=SOURCE_DIR, help="Source master-skills directory")
    parser.add_argument("--target", type=Path, default=TARGET_DIR, help="Output directory")
    parser.add_argument("--category", help="Convert only this category")
    parser.add_argument("--skill", help="Convert only this skill name")
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing files")
    args = parser.parse_args()

    # Try to delegate to the unified sync-skills.py pipeline
    if _run_via_syncer(args):
        return

    # Fallback: run the original standalone logic
    _main_standalone(args)


if __name__ == "__main__":
    main()
