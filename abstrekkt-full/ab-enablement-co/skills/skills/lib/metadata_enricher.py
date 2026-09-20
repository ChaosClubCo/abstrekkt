"""
Metadata Enrichment Module for Skills.

Auto-enriches skill data with computed metadata fields including tags,
complexity scores, token estimates, related skills, platform capabilities,
and structural analysis.

Usage:
    python lib/metadata_enricher.py --all
    python lib/metadata_enricher.py --skill technical/api-development
    python lib/metadata_enricher.py --export enriched_metadata.json
"""

import argparse
import json
import os
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

# Default master skills directory (sibling to lib/)
_DEFAULT_MASTER_DIR = Path(__file__).resolve().parent.parent / "_master-skills"

# Domain keywords to detect in skill body text
DOMAIN_KEYWORDS: List[str] = [
    "testing",
    "deployment",
    "security",
    "data",
    "frontend",
    "backend",
    "devops",
    "design",
    "marketing",
    "finance",
    "compliance",
    "automation",
    "integration",
    "analytics",
    "documentation",
    "architecture",
    "performance",
    "monitoring",
    "workflow",
    "collaboration",
]

# Platform detection keywords mapped to capability flags
_PLATFORM_KEYWORDS: Dict[str, Dict[str, List[str]]] = {
    "gemini": {
        "grounding": ["search", "web", "grounding", "google", "real-time", "current"],
        "code_execution": ["code execution", "run code", "execute", "script", "runtime"],
        "multimodal": ["image", "video", "audio", "multimodal", "vision", "visual"],
        "vertex_ai": ["vertex", "gcp", "google cloud", "bigquery", "cloud run"],
    },
    "codex": {
        "code_interpreter": ["code", "python", "javascript", "programming", "script", "algorithm"],
        "web_search": ["search", "web", "browse", "internet", "online", "url"],
        "file_search": ["file", "document", "pdf", "upload", "attachment", "spreadsheet"],
        "function_calling": ["api", "function", "tool", "endpoint", "webhook", "integration"],
    },
    "copilot": {
        "workspace_context": ["workspace", "project", "repository", "codebase", "repo"],
        "terminal_access": ["terminal", "command line", "cli", "shell", "bash", "powershell"],
        "file_patterns": ["file", "pattern", "glob", "path", "directory", "folder"],
        "chat_participants": ["chat", "participant", "mention", "team", "collaborate", "conversation"],
    },
    "claude": {
        "mcp_tools": ["mcp", "tool", "server", "integration", "plugin", "extension"],
        "subagents": ["agent", "subagent", "delegation", "orchestration", "multi-agent", "pipeline"],
        "artifacts": ["artifact", "document", "template", "output", "deliverable", "generate"],
        "long_context": ["long", "comprehensive", "detailed", "extensive", "thorough", "in-depth"],
    },
}


# ---------------------------------------------------------------------------
# Parsing helpers
# ---------------------------------------------------------------------------

def _parse_frontmatter(text: str) -> Dict[str, str]:
    """Extract YAML frontmatter fields from skill markdown text.

    Parses the block between the opening and closing ``---`` markers and
    returns a dict of key-value pairs.  Only simple ``key: value`` lines are
    supported (no nested YAML).

    Args:
        text: Full markdown text of a SKILL.md file.

    Returns:
        Dict with frontmatter keys (e.g. ``name``, ``description``).
    """
    match = re.match(r"^---\s*\n(.*?)\n---", text, re.DOTALL)
    if not match:
        return {}
    frontmatter: Dict[str, str] = {}
    for line in match.group(1).splitlines():
        if ":" in line:
            key, _, value = line.partition(":")
            frontmatter[key.strip()] = value.strip()
    return frontmatter


def _count_sections(body: str) -> List[str]:
    """Return a list of markdown section headings found in *body*.

    Matches lines beginning with one or more ``#`` characters followed by
    a space and heading text.

    Args:
        body: Markdown body text.

    Returns:
        List of heading strings (without the leading ``#`` characters).
    """
    return re.findall(r"^#{1,6}\s+(.+)$", body, re.MULTILINE)


def _count_code_blocks(body: str) -> int:
    """Count fenced code blocks (triple-backtick) in *body*.

    Args:
        body: Markdown body text.

    Returns:
        Number of fenced code blocks found.
    """
    return len(re.findall(r"^```", body, re.MULTILINE)) // 2


def _estimate_tokens(text: str) -> int:
    """Estimate the token count for *text*.

    Uses a simple heuristic of ~4 characters per token, which is a
    reasonable average for English prose and code.

    Args:
        text: Arbitrary text.

    Returns:
        Estimated number of tokens.
    """
    if not text:
        return 0
    return max(1, len(text) // 4)


def _load_skill_file(skill_path: Path) -> Optional[Dict[str, str]]:
    """Load a SKILL.md file and return a structured dict.

    Args:
        skill_path: Absolute path to a SKILL.md file.

    Returns:
        Dict with keys ``name``, ``description``, ``body``, ``path``, and
        ``category``, or ``None`` if the file cannot be read.
    """
    try:
        text = skill_path.read_text(encoding="utf-8", errors="replace")
    except (OSError, UnicodeDecodeError):
        return None

    frontmatter = _parse_frontmatter(text)

    # Strip frontmatter to get body
    body_match = re.match(r"^---\s*\n.*?\n---\s*\n?(.*)", text, re.DOTALL)
    body = body_match.group(1) if body_match else text

    # Derive category and skill name from path
    # Expected: _master-skills/{category}/{skill-name}/SKILL.md
    parts = skill_path.parts
    category = ""
    skill_name = frontmatter.get("name", "")
    if len(parts) >= 3:
        category = parts[-3]  # category folder
        if not skill_name:
            skill_name = parts[-2]  # skill folder name

    return {
        "name": skill_name,
        "description": frontmatter.get("description", ""),
        "body": body,
        "path": str(skill_path),
        "category": category,
    }


def _discover_skills(master_dir: Path) -> List[Path]:
    """Discover all SKILL.md files under *master_dir*.

    Args:
        master_dir: Root directory containing category sub-folders.

    Returns:
        Sorted list of Paths to SKILL.md files.
    """
    return sorted(master_dir.rglob("SKILL.md"))


def _all_skill_names(master_dir: Path) -> List[str]:
    """Return a list of all skill names derived from directory structure.

    Args:
        master_dir: Root directory containing category sub-folders.

    Returns:
        List of skill directory names (e.g. ``["api-development", ...]``).
    """
    names: List[str] = []
    for skill_path in _discover_skills(master_dir):
        # parent is the skill folder
        names.append(skill_path.parent.name)
    return names


# ---------------------------------------------------------------------------
# Complexity estimation - imported from platform_tuning
# ---------------------------------------------------------------------------

# Import estimate_complexity from platform_tuning module as primary implementation
try:
    from lib.platform_tuning import estimate_complexity
except ImportError:
    # Fallback implementation if platform_tuning is unavailable
    def estimate_complexity(skill_data: dict) -> str:
        """Estimate the complexity of a skill based on its body content.

        Fallback implementation when platform_tuning is unavailable.
        Uses a simple 3-factor average approach.

        Args:
            skill_data: Dict with at least a ``body`` key (or body as string for compat).

        Returns:
            One of ``"simple"``, ``"moderate"``, or ``"complex"``.
        """
        # Support both dict (new API) and string (legacy API)
        body = skill_data.get("body", "") if isinstance(skill_data, dict) else skill_data

        # Line count indicator
        line_count = len(body.splitlines())
        if line_count < 100:
            line_score = 0
        elif line_count <= 300:
            line_score = 1
        else:
            line_score = 2

        # Section count indicator
        sections = re.findall(r"^#{1,6}\s+(.+)$", body, re.MULTILINE)
        section_count = len(sections)
        if section_count < 3:
            section_score = 0
        elif section_count <= 6:
            section_score = 1
        else:
            section_score = 2

        # Code block count indicator
        code_block_count = len(re.findall(r"^```", body, re.MULTILINE)) // 2
        if code_block_count == 0:
            code_score = 0
        elif code_block_count <= 3:
            code_score = 1
        else:
            code_score = 2

        # Average and map back to label
        avg = (line_score + section_score + code_score) / 3.0
        if avg < 0.67:
            return "simple"
        elif avg < 1.34:
            return "moderate"
        else:
            return "complex"


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def auto_tag(skill_data: Dict[str, str]) -> List[str]:
    """Generate tags automatically from skill content analysis.

    Tags are derived from three sources:

    1. **Category** -- the skill's category becomes a tag.
    2. **Name parts** -- the skill name is split on hyphens and each part
       longer than two characters becomes a tag.
    3. **Domain keywords** -- the body is scanned for occurrences of known
       domain keywords (e.g. *testing*, *security*, *devops*).

    Results are deduplicated, lowercased, and returned sorted.

    Args:
        skill_data: Dict with at least ``name``, ``category``, and ``body``.

    Returns:
        Sorted list of unique tag strings.
    """
    tags: set = set()

    # 1. Extract from category
    category = skill_data.get("category", "").strip().lower()
    if category:
        tags.add(category)

    # 2. Extract from skill name parts
    name = skill_data.get("name", "")
    for part in re.split(r"[-_\s]+", name):
        part_lower = part.strip().lower()
        if len(part_lower) > 2:
            tags.add(part_lower)

    # 3. Detect domain keywords in body
    body_lower = skill_data.get("body", "").lower()
    for keyword in DOMAIN_KEYWORDS:
        if keyword in body_lower:
            tags.add(keyword)

    return sorted(tags)


def detect_related_skills(
    skill_data: Dict[str, str],
    all_skill_names: Optional[List[str]] = None,
) -> List[str]:
    """Find skills related to the given skill.

    Relatedness is scored using three signals:

    - **Body mentions**: other skill names that appear verbatim in the
      skill body text (highest weight).
    - **Tag overlap**: skills sharing tags with the current skill.
    - **Category proximity**: skills in the same category.

    The function requires *all_skill_names* to search against.  If it is
    ``None`` the function attempts to discover names from the default
    master directory.

    Args:
        skill_data: Dict with at least ``name``, ``body``, ``category``,
            and optionally ``tags``.
        all_skill_names: List of all known skill names.

    Returns:
        Up to 5 most related skill names, sorted by relevance score
        (descending).
    """
    if all_skill_names is None:
        all_skill_names = _all_skill_names(_DEFAULT_MASTER_DIR)

    current_name = skill_data.get("name", "")
    body_lower = skill_data.get("body", "").lower()
    current_tags = set(skill_data.get("tags", auto_tag(skill_data)))
    current_category = skill_data.get("category", "").lower()

    scores: Dict[str, float] = {}

    for other_name in all_skill_names:
        if other_name == current_name:
            continue

        score = 0.0

        # Body mentions (weight: 3)
        # Check if the skill name appears in the body text
        if other_name.lower() in body_lower:
            score += 3.0

        # Tag overlap (weight: 1 per shared tag)
        other_name_tags = set()
        for part in re.split(r"[-_\s]+", other_name):
            part_lower = part.strip().lower()
            if len(part_lower) > 2:
                other_name_tags.add(part_lower)
        shared_tags = current_tags & other_name_tags
        score += len(shared_tags) * 1.0

        # Category proximity (weight: 0.5)
        # We infer category from the skill path if available; otherwise
        # we give a small bonus to skills whose name-derived tags overlap
        # with the current category.
        if current_category and current_category in other_name_tags:
            score += 0.5

        if score > 0:
            scores[other_name] = score

    # Sort by score descending, then alphabetically for ties
    ranked = sorted(scores.items(), key=lambda item: (-item[1], item[0]))
    return [name for name, _ in ranked[:5]]


def assess_platform_capabilities(skill_data: Dict[str, str]) -> Dict[str, Dict[str, bool]]:
    """Assess what each AI platform can leverage from this skill.

    For each platform (Gemini, Codex, Copilot, Claude), evaluates a set
    of capability flags based on keyword presence in the skill body and
    category.

    Args:
        skill_data: Dict with at least ``body`` and ``category``.

    Returns:
        Nested dict mapping platform names to capability dicts, e.g.::

            {
                "gemini": {"grounding": True, ...},
                "codex": {...},
                "copilot": {...},
                "claude": {...},
            }
    """
    body_lower = skill_data.get("body", "").lower()
    category_lower = skill_data.get("category", "").lower()
    combined_text = body_lower + " " + category_lower

    result: Dict[str, Dict[str, bool]] = {}

    for platform, capabilities in _PLATFORM_KEYWORDS.items():
        platform_caps: Dict[str, bool] = {}
        for cap_name, keywords in capabilities.items():
            detected = any(kw in combined_text for kw in keywords)
            platform_caps[cap_name] = detected
        result[platform] = platform_caps

    return result




def enrich_skill(
    skill_data: Dict[str, str],
    all_skill_names: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """Enrich a skill dict with computed metadata fields.

    This is the main entry point for single-skill enrichment.  It takes a
    skill dict and returns a new dict with all original keys plus the
    following computed fields:

    - ``tags`` -- auto-generated tags from content analysis
    - ``complexity`` -- ``"simple"``, ``"moderate"``, or ``"complex"``
    - ``token_estimate`` -- estimated token count
    - ``related_skills`` -- detected related skill names (up to 5)
    - ``platform_capabilities`` -- per-platform capability flags
    - ``version`` -- always ``"1.0.0"``
    - ``last_updated`` -- ISO date from file mtime or current date
    - ``sections`` -- detected section headings
    - ``has_examples`` -- whether examples are present
    - ``has_templates`` -- whether templates are present
    - ``has_code_blocks`` -- whether code blocks are present
    - ``line_count`` -- number of lines in the body

    Args:
        skill_data: Dict with keys ``name``, ``description``, ``body``,
            ``path``, and ``category``.
        all_skill_names: Optional list of all skill names for relatedness
            detection.  If ``None``, names are discovered automatically.

    Returns:
        New dict with original keys plus all enrichment fields.
    """
    enriched: Dict[str, Any] = dict(skill_data)
    body = skill_data.get("body", "")
    body.lower()
    path_str = skill_data.get("path", "")

    # Tags
    enriched["tags"] = auto_tag(skill_data)

    # Complexity (pass full skill_data dict for compatibility with platform_tuning)
    enriched["complexity"] = estimate_complexity(skill_data)

    # Token estimate (over full content: description + body)
    full_text = skill_data.get("description", "") + "\n" + body
    enriched["token_estimate"] = _estimate_tokens(full_text)

    # Related skills
    enriched["related_skills"] = detect_related_skills(skill_data, all_skill_names)

    # Platform capabilities
    enriched["platform_capabilities"] = assess_platform_capabilities(skill_data)

    # Version
    enriched["version"] = "1.0.0"

    # Last updated -- try file mtime, fall back to current date
    last_updated = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    if path_str:
        try:
            mtime = os.path.getmtime(path_str)
            last_updated = datetime.fromtimestamp(mtime, tz=timezone.utc).strftime("%Y-%m-%d")
        except OSError:
            pass
    enriched["last_updated"] = last_updated

    # Sections
    enriched["sections"] = _count_sections(body)

    # Content detection flags
    enriched["has_examples"] = bool(
        re.search(r"(?i)\bexample[s]?\b", body)
        or re.search(r"(?i)^#{1,6}\s+.*example", body, re.MULTILINE)
        or re.search(r"(?i)\be\.g\.\b", body)
    )
    enriched["has_templates"] = bool(
        re.search(r"(?i)\btemplate[s]?\b", body)
        or re.search(r"(?i)^#{1,6}\s+.*template", body, re.MULTILINE)
    )
    enriched["has_code_blocks"] = _count_code_blocks(body) > 0

    # Line count
    enriched["line_count"] = len(body.splitlines())

    return enriched


def enrich_all(master_dir: Optional[Path] = None) -> Dict[str, Any]:
    """Enrich all skills under *master_dir* and return summary statistics.

    Discovers every SKILL.md file, enriches each one, and computes
    aggregate statistics.

    Args:
        master_dir: Root directory containing category sub-folders.
            Defaults to the ``_master-skills`` directory adjacent to this
            module.

    Returns:
        Dict with keys:

        - ``total_skills`` -- number of skills enriched
        - ``tag_frequency`` -- dict mapping each tag to its occurrence count
        - ``complexity_distribution`` -- dict mapping complexity labels to
          counts
        - ``average_token_estimate`` -- mean token estimate across all skills
        - ``skills`` -- list of all enriched skill dicts
    """
    if master_dir is None:
        master_dir = _DEFAULT_MASTER_DIR

    skill_paths = _discover_skills(master_dir)
    all_names = [p.parent.name for p in skill_paths]

    enriched_skills: List[Dict[str, Any]] = []
    tag_counter: Counter = Counter()
    complexity_counter: Counter = Counter()
    total_tokens = 0

    for skill_path in skill_paths:
        skill_data = _load_skill_file(skill_path)
        if skill_data is None:
            continue

        enriched = enrich_skill(skill_data, all_skill_names=all_names)
        enriched_skills.append(enriched)

        # Accumulate stats
        for tag in enriched["tags"]:
            tag_counter[tag] += 1
        complexity_counter[enriched["complexity"]] += 1
        total_tokens += enriched["token_estimate"]

    total_skills = len(enriched_skills)
    avg_tokens = total_tokens // total_skills if total_skills > 0 else 0

    return {
        "total_skills": total_skills,
        "tag_frequency": dict(tag_counter.most_common()),
        "complexity_distribution": dict(complexity_counter),
        "average_token_estimate": avg_tokens,
        "skills": enriched_skills,
    }


# ---------------------------------------------------------------------------
# CLI interface
# ---------------------------------------------------------------------------

def _print_skill_summary(enriched: Dict[str, Any]) -> None:
    """Pretty-print a single enriched skill to stdout."""
    print(f"Skill: {enriched.get('name', 'unknown')}")
    print(f"  Category:       {enriched.get('category', 'N/A')}")
    print(f"  Complexity:     {enriched.get('complexity', 'N/A')}")
    print(f"  Token Estimate: {enriched.get('token_estimate', 0)}")
    print(f"  Line Count:     {enriched.get('line_count', 0)}")
    print(f"  Version:        {enriched.get('version', 'N/A')}")
    print(f"  Last Updated:   {enriched.get('last_updated', 'N/A')}")
    print(f"  Tags:           {', '.join(enriched.get('tags', []))}")
    print(f"  Sections:       {len(enriched.get('sections', []))}")
    print(f"  Has Examples:   {enriched.get('has_examples', False)}")
    print(f"  Has Templates:  {enriched.get('has_templates', False)}")
    print(f"  Has Code:       {enriched.get('has_code_blocks', False)}")
    related = enriched.get("related_skills", [])
    if related:
        print(f"  Related Skills: {', '.join(related)}")
    caps = enriched.get("platform_capabilities", {})
    if caps:
        print("  Platform Capabilities:")
        for platform, flags in caps.items():
            active = [k for k, v in flags.items() if v]
            if active:
                print(f"    {platform}: {', '.join(active)}")


def _print_stats(result: Dict[str, Any]) -> None:
    """Pretty-print aggregate enrichment stats to stdout."""
    print("=" * 60)
    print("SKILL ENRICHMENT SUMMARY")
    print("=" * 60)
    print(f"Total skills enriched:    {result['total_skills']}")
    print(f"Average token estimate:   {result['average_token_estimate']}")
    print()

    print("Complexity Distribution:")
    for level in ("simple", "moderate", "complex"):
        count = result["complexity_distribution"].get(level, 0)
        pct = (count / result["total_skills"] * 100) if result["total_skills"] else 0
        bar = "#" * int(pct / 2)
        print(f"  {level:<10} {count:>4}  ({pct:5.1f}%)  {bar}")
    print()

    print("Top 20 Tags:")
    tag_items = sorted(result["tag_frequency"].items(), key=lambda x: -x[1])
    for tag, count in tag_items[:20]:
        print(f"  {tag:<25} {count:>4}")
    print("=" * 60)


def main() -> None:
    """CLI entry point for the metadata enricher."""
    parser = argparse.ArgumentParser(
        description="Enrich skill metadata with computed fields.",
        epilog="Examples:\n"
               "  python lib/metadata_enricher.py --all\n"
               "  python lib/metadata_enricher.py --skill technical/api-development\n"
               "  python lib/metadata_enricher.py --export enriched_metadata.json\n",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Enrich all skills and print summary stats.",
    )
    parser.add_argument(
        "--skill",
        type=str,
        metavar="CATEGORY/SKILL-NAME",
        help="Enrich and display a single skill (e.g. technical/api-development).",
    )
    parser.add_argument(
        "--export",
        type=str,
        metavar="OUTPUT_FILE",
        help="Export all enriched metadata as JSON to the given file.",
    )
    parser.add_argument(
        "--master-dir",
        type=str,
        default=None,
        help="Override the master skills directory path.",
    )

    args = parser.parse_args()
    master_dir = Path(args.master_dir) if args.master_dir else _DEFAULT_MASTER_DIR

    if not master_dir.is_dir():
        print(f"Error: Master skills directory not found: {master_dir}")
        raise SystemExit(1)

    if args.skill:
        # Enrich a single skill
        skill_path = master_dir / args.skill / "SKILL.md"
        if not skill_path.is_file():
            print(f"Error: Skill file not found: {skill_path}")
            raise SystemExit(1)
        skill_data = _load_skill_file(skill_path)
        if skill_data is None:
            print(f"Error: Could not read skill file: {skill_path}")
            raise SystemExit(1)
        all_names = _all_skill_names(master_dir)
        enriched = enrich_skill(skill_data, all_skill_names=all_names)
        _print_skill_summary(enriched)

    elif args.export:
        # Export all enriched metadata as JSON
        result = enrich_all(master_dir)
        # Remove body from exported data to keep file size manageable
        export_skills = []
        for skill in result["skills"]:
            skill_copy = {k: v for k, v in skill.items() if k != "body"}
            export_skills.append(skill_copy)
        export_data = {
            "total_skills": result["total_skills"],
            "tag_frequency": result["tag_frequency"],
            "complexity_distribution": result["complexity_distribution"],
            "average_token_estimate": result["average_token_estimate"],
            "skills": export_skills,
        }
        output_path = Path(args.export)
        output_path.write_text(json.dumps(export_data, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"Exported enriched metadata for {result['total_skills']} skills to {output_path}")

    elif args.all:
        # Enrich all and print stats
        result = enrich_all(master_dir)
        _print_stats(result)

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
