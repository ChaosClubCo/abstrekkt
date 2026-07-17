#!/usr/bin/env python3
"""
Convert SKILL.md files from _master-skills into Gemini Gem JSON format.

DEPRECATED: This standalone script is maintained for backward compatibility.
Prefer using the unified pipeline instead:
    python sync-skills.py --targets gemini
    python sync-skills.py --targets gemini --category technical --dry-run

The sync-skills.py pipeline uses the same GeminiConverter class with
platform tuning, metadata enrichment, and skill validation support.

This script will attempt to delegate to sync-skills.py's GeminiConverter
when importable; otherwise it falls back to its own inline logic.

Legacy usage (still supported):
    python convert_to_gems.py
    python convert_to_gems.py --category technical
    python convert_to_gems.py --category strategy --model-override gemini-2.5-pro
    python convert_to_gems.py --dry-run
    python convert_to_gems.py --category creative --dry-run
"""

import argparse
import json
import re
import sys
import warnings
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

# Ensure project root is on sys.path so lib.* imports resolve correctly
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# ---------------------------------------------------------------------------
# Configuration (shared constants imported from lib.config)
# ---------------------------------------------------------------------------

from lib.config import (
    CATEGORIES,
    CATEGORY_TEMPERATURES,
    GROUNDING_CATEGORIES,
    GROUNDING_PREFIX,
)
from lib.config import (
    GEMINI_SAFETY_SETTINGS as SAFETY_SETTINGS,
)
from lib.config import (
    MASTER_DIR as _MASTER_DIR,
)

# Graceful import of shared platform tuning module
_HAS_PLATFORM_TUNING = False
try:
    from lib.platform_tuning import CATEGORY_TEMPERATURE_MAP, estimate_complexity, get_gemini_settings
    _HAS_PLATFORM_TUNING = True
except ImportError:
    pass

SOURCE_DIR = _MASTER_DIR
TARGET_DIR = Path(__file__).resolve().parent.parent / "platforms" / "gemini" / "gemini-skills" / "gems"

# Common stop-words excluded from keyword extraction
_STOP_WORDS = frozenset(
    "a an the and or but in on at to for of with by from is are was were be "
    "been being have has had do does did will would shall should may might can "
    "could this that these those it its you your we our they their he she his "
    "her not no nor so if as up out about into over after all also each how "
    "more most other some such than too very when where which while who whom "
    "what why use using used uses include includes including like make makes "
    "well just even new get set see way need one two three first second third "
    "based best key ensure create provide follow work next step steps any".split()
)

# ---------------------------------------------------------------------------
# Model selection
# ---------------------------------------------------------------------------

def select_model(body: str, category: str = "") -> str:
    """Choose a Gemini model based on the line count of the body.

    Uses shared platform_tuning module if available, otherwise falls back
    to inline logic.
    """
    if _HAS_PLATFORM_TUNING:
        settings = get_gemini_settings({"body": body, "category": category})
        return settings.get("model", "gemini-2.5-flash")

    # Original fallback logic
    line_count = body.count("\n") + 1
    if line_count > 300:
        return "gemini-2.5-pro"
    # <= 300 lines (both <100 and 100-300 ranges)
    return "gemini-2.5-flash"


def classify_complexity(body: str) -> str:
    """Return a complexity label based on body length.

    Uses shared platform_tuning module if available, otherwise falls back
    to inline logic.
    """
    if _HAS_PLATFORM_TUNING:
        complexity = estimate_complexity({"body": body})
        # Map shared module's labels to local convention
        if complexity == "simple":
            return "basic"
        elif complexity == "complex":
            return "advanced"
        return "moderate"

    # Original fallback logic
    line_count = body.count("\n") + 1
    if line_count < 100:
        return "basic"
    if line_count <= 300:
        return "moderate"
    return "advanced"

# ---------------------------------------------------------------------------
# Tag extraction
# ---------------------------------------------------------------------------

def extract_tags(category: str, skill_name: str, body: str, max_keywords: int = 5) -> list[str]:
    """
    Generate tags from:
      1. The category itself
      2. Parts of the skill-name (split on hyphens)
      3. Top keywords found in the body text
    Duplicates are removed while preserving order.
    """
    tags: list[str] = []
    seen: set[str] = set()

    def _add(tag: str) -> None:
        t = tag.lower().strip()
        if t and t not in seen and len(t) > 2:
            seen.add(t)
            tags.append(t)

    # Category
    _add(category)

    # Skill-name parts
    for part in skill_name.split("-"):
        _add(part)

    # Body keyword extraction: take the most common meaningful words
    words = re.findall(r"[a-zA-Z]{3,}", body.lower())
    freq = Counter(w for w in words if w not in _STOP_WORDS and len(w) > 3)
    for word, _ in freq.most_common(max_keywords + 10):
        if len(tags) >= max_keywords + len(skill_name.split("-")) + 1:
            break
        _add(word)

    return tags

# ---------------------------------------------------------------------------
# Frontmatter / SKILL.md parsing
# ---------------------------------------------------------------------------

def _strip_quotes(value: str) -> str:
    """Remove surrounding single or double quotes."""
    if len(value) >= 2:
        if (value[0] == '"' and value[-1] == '"') or (value[0] == "'" and value[-1] == "'"):
            return value[1:-1]
    return value


def _parse_yaml_tags(frontmatter_text: str) -> list[str]:
    """Extract tags from YAML-style frontmatter (list items under 'tags:')."""
    tags: list[str] = []
    in_tags = False
    for line in frontmatter_text.splitlines():
        stripped = line.strip()
        if stripped.startswith("tags:"):
            in_tags = True
            # Inline value? e.g. tags: [a, b]
            inline = stripped[5:].strip()
            if inline.startswith("["):
                items = inline.strip("[]").split(",")
                tags.extend(i.strip().strip("'\"") for i in items if i.strip())
                in_tags = False
            continue
        if in_tags:
            if stripped.startswith("- "):
                tags.append(stripped[2:].strip().strip("'\""))
            elif stripped and not stripped.startswith("-"):
                # Next key encountered -- stop
                in_tags = False
    return tags


def parse_skill_md(file_path: Path) -> dict | None:
    """Parse a SKILL.md file and extract name, description, tags, and body.

    Delegates to the canonical ``lib.skill_parser`` when available,
    with inline fallback for backward compatibility.
    """
    try:
        from lib.skill_parser import parse_skill_file
        skill = parse_skill_file(file_path)
        if skill is None:
            return None
        # Extract tags from frontmatter text for gem-specific tag generation
        content = file_path.read_text(encoding="utf-8", errors="replace")
        match = re.match(r"^---\s*\n(.*?)\n---", content, re.DOTALL)
        fm_tags = _parse_yaml_tags(match.group(1)) if match else []
        return {
            "name": skill["name"],
            "description": skill["description"] or f"Skill for {skill['name']}",
            "body": skill["body"],
            "fm_tags": fm_tags,
            "version": skill.get("version", "1.0.0"),
        }
    except ImportError:
        pass

    # Inline fallback
    try:
        content = file_path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return None

    match = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", content, re.DOTALL)
    if not match:
        return None

    fm_text = match.group(1)
    body = match.group(2).strip()

    name_m = re.search(r"^name:\s*(.+)$", fm_text, re.MULTILINE)
    name = _strip_quotes(name_m.group(1).strip()) if name_m else file_path.parent.name

    desc_m = re.search(
        r"^description:\s*>?\s*\n?(.*?)(?=\n[a-zA-Z_-]+:|\Z)",
        fm_text,
        re.MULTILINE | re.DOTALL,
    )
    if desc_m:
        description = " ".join(desc_m.group(1).split())
        description = _strip_quotes(description)
    else:
        description = f"Skill for {name}"

    fm_tags = _parse_yaml_tags(fm_text)

    ver_m = re.search(r"^version:\s*(.+)$", fm_text, re.MULTILINE)
    version = _strip_quotes(ver_m.group(1).strip()) if ver_m else "1.0.0"

    return {
        "name": name,
        "description": description,
        "body": body,
        "fm_tags": fm_tags,
        "version": version,
    }

# ---------------------------------------------------------------------------
# Gem JSON builder
# ---------------------------------------------------------------------------

def build_gem_json(
    skill_data: dict,
    category: str,
    skill_slug: str,
    model_override: str | None = None,
) -> dict:
    """Construct the enhanced Gem JSON structure."""
    body = skill_data["body"]
    name = skill_data["name"]
    description = skill_data["description"]

    # Model
    model = model_override if model_override else select_model(body, category)

    # Temperature (use shared module if available)
    if _HAS_PLATFORM_TUNING:
        temperature = CATEGORY_TEMPERATURE_MAP.get(category, 0.5)
    else:
        temperature = CATEGORY_TEMPERATURES.get(category, 0.5)

    # Complexity
    complexity = classify_complexity(body)

    # System instruction with optional grounding prefix
    if category in GROUNDING_CATEGORIES:
        system_instruction = GROUNDING_PREFIX + body
    else:
        system_instruction = body

    # Tags: merge frontmatter tags + auto-extracted tags, deduplicated
    auto_tags = extract_tags(category, skill_slug, body)
    combined_tags: list[str] = []
    seen: set[str] = set()
    for t in skill_data.get("fm_tags", []) + auto_tags:
        tl = t.lower()
        if tl not in seen:
            seen.add(tl)
            combined_tags.append(tl)

    return {
        "name": name,
        "description": description,
        "systemInstruction": system_instruction,
        "context": {
            "files": [],
            "knowledgeBase": [],
        },
        "settings": {
            "temperature": temperature,
            "model": model,
            "topP": 0.95,
            "topK": 40,
            "maxOutputTokens": 8192,
        },
        "safetySettings": SAFETY_SETTINGS,
        "metadata": {
            "category": category,
            "version": skill_data.get("version", "1.0.0"),
            "source": "master-skills",
            "complexity": complexity,
            "tags": combined_tags,
        },
    }

# ---------------------------------------------------------------------------
# Category conversion
# ---------------------------------------------------------------------------

def convert_category(
    category: str,
    *,
    model_override: str | None = None,
    dry_run: bool = False,
) -> list[dict]:
    """
    Convert all skills in a single category.
    Returns a list of summary dicts: {slug, name, description, model, complexity, file}.
    """
    source_path = SOURCE_DIR / category
    target_path = TARGET_DIR / category
    results: list[dict] = []

    if not source_path.exists():
        print(f"  [SKIP] Source directory not found: {source_path}")
        return results

    skill_files = sorted(source_path.rglob("SKILL.md"))

    for skill_file in skill_files:
        # Only handle direct children: {category}/{skill-name}/SKILL.md
        relative = skill_file.relative_to(source_path)
        if len(relative.parts) != 2:
            continue

        skill_slug = skill_file.parent.name

        skill_data = parse_skill_md(skill_file)
        if skill_data is None:
            print(f"  [FAIL] Could not parse: {skill_file}")
            results.append({"slug": skill_slug, "status": "error"})
            continue

        gem = build_gem_json(skill_data, category, skill_slug, model_override)

        output_file = target_path / f"{skill_slug}.gem.json"

        if dry_run:
            line_count = skill_data["body"].count("\n") + 1
            print(
                f"  [DRY ] {skill_slug:<45} "
                f"model={gem['settings']['model']:<20} "
                f"temp={gem['settings']['temperature']}  "
                f"lines={line_count:<5} "
                f"tags={len(gem['metadata']['tags'])}"
            )
        else:
            target_path.mkdir(parents=True, exist_ok=True)
            try:
                output_file.write_text(
                    json.dumps(gem, indent=2, ensure_ascii=False),
                    encoding="utf-8",
                )
                print(
                    f"  [ OK ] {skill_slug:<45} -> {gem['settings']['model']:<20} "
                    f"temp={gem['settings']['temperature']}  "
                    f"complexity={gem['metadata']['complexity']}"
                )
            except Exception as exc:
                print(f"  [FAIL] {skill_slug}: {exc}")
                results.append({"slug": skill_slug, "status": "error"})
                continue

        results.append({
            "slug": skill_slug,
            "name": gem["name"],
            "description": gem["description"],
            "model": gem["settings"]["model"],
            "temperature": gem["settings"]["temperature"],
            "complexity": gem["metadata"]["complexity"],
            "tags": gem["metadata"]["tags"],
            "file": str(output_file),
            "status": "ok",
        })

    return results

# ---------------------------------------------------------------------------
# Index & README generation
# ---------------------------------------------------------------------------

def generate_index(all_results: dict[str, list[dict]], dry_run: bool = False) -> None:
    """
    Write gems/INDEX.json  (global index)
    and   gems/{category}/README.md  (per-category summary).
    """
    # ---- INDEX.json ----
    index: dict = {
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "generator": "convert_to_gems.py",
        "totalGems": 0,
        "categories": {},
    }

    total = 0
    for cat in CATEGORIES:
        entries = [r for r in all_results.get(cat, []) if r.get("status") == "ok"]
        total += len(entries)
        index["categories"][cat] = {
            "count": len(entries),
            "gems": [
                {
                    "slug": e["slug"],
                    "name": e["name"],
                    "model": e["model"],
                    "complexity": e["complexity"],
                }
                for e in entries
            ],
        }
    index["totalGems"] = total

    if dry_run:
        print(f"\n  [DRY ] Would write INDEX.json  ({total} gems)")
    else:
        TARGET_DIR.mkdir(parents=True, exist_ok=True)
        index_path = TARGET_DIR / "INDEX.json"
        index_path.write_text(
            json.dumps(index, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        print(f"\n  [IDX ] Wrote {index_path}  ({total} gems)")

    # ---- Per-category README.md ----
    for cat in CATEGORIES:
        entries = [r for r in all_results.get(cat, []) if r.get("status") == "ok"]
        if not entries:
            continue

        lines: list[str] = [
            f"# {cat.replace('-', ' ').title()} Gems",
            "",
            f"> Auto-generated by `convert_to_gems.py` on "
            f"{datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
            "",
            f"**{len(entries)}** gems in this category.",
            "",
            "| Gem | Model | Temp | Complexity | Tags |",
            "|-----|-------|------|------------|------|",
        ]
        for e in sorted(entries, key=lambda x: x["slug"]):
            tag_str = ", ".join(e.get("tags", [])[:5])
            lines.append(
                f"| [{e['slug']}](./{e['slug']}.gem.json) "
                f"| {e['model']} "
                f"| {e['temperature']} "
                f"| {e['complexity']} "
                f"| {tag_str} |"
            )
        lines.append("")

        readme_text = "\n".join(lines)

        if dry_run:
            print(f"  [DRY ] Would write {cat}/README.md  ({len(entries)} entries)")
        else:
            readme_path = TARGET_DIR / cat / "README.md"
            readme_path.parent.mkdir(parents=True, exist_ok=True)
            readme_path.write_text(readme_text, encoding="utf-8")
            print(f"  [IDX ] Wrote {readme_path}")

# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Convert SKILL.md files to Gemini Gem JSON format.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  python convert_to_gems.py\n"
            "  python convert_to_gems.py --category technical\n"
            "  python convert_to_gems.py --category strategy --model-override gemini-2.5-pro\n"
            "  python convert_to_gems.py --dry-run\n"
        ),
    )
    parser.add_argument(
        "--category",
        choices=CATEGORIES,
        default=None,
        help="Process only this category (default: all).",
    )
    parser.add_argument(
        "--model-override",
        default=None,
        metavar="MODEL",
        help="Force a specific model for every gem (e.g. gemini-2.5-pro).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview what would be generated without writing files.",
    )
    return parser

# ---------------------------------------------------------------------------
# Sync-skills.py delegation helpers
# ---------------------------------------------------------------------------

_HAS_SYNCER = False
try:
    # Import converter classes from the unified pipeline so this script can
    # delegate to them, producing output identical to ``sync-skills.py --targets gemini``.
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    from importlib import import_module as _import_module
    _sync_mod = _import_module("sync-skills")
    _SyncSkillParser = _sync_mod.SkillParser
    _SyncGeminiConverter = _sync_mod.GeminiConverter
    _SyncSkillsSyncer = _sync_mod.SkillsSyncer
    _HAS_SYNCER = True
except Exception:
    _SyncSkillParser = None
    _SyncGeminiConverter = None
    _SyncSkillsSyncer = None


def _run_via_syncer(args) -> bool:
    """Attempt to run via sync-skills.py's SkillsSyncer.

    Returns True if delegation succeeded, False if caller should fall back
    to inline logic.
    """
    if not _HAS_SYNCER or _SyncSkillsSyncer is None:
        return False

    # model-override is a feature unique to this standalone script;
    # the unified pipeline does not support it.  Fall back to inline
    # logic when the user requests a model override.
    if getattr(args, "model_override", None):
        print("  (model-override requested; using standalone converter logic)\n")
        return False

    base_dir = Path(__file__).resolve().parent.parent
    syncer = _SyncSkillsSyncer(base_dir)

    common_kwargs = dict(
        targets=["gemini"],
        dry_run=args.dry_run,
        show_stats=True,
    )

    if args.category:
        syncer.sync_category(args.category, **common_kwargs)
    else:
        syncer.sync_all(**common_kwargs)

    return True


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def _main_standalone(args) -> None:
    """Original standalone conversion logic (used as fallback)."""
    categories_to_run = [args.category] if args.category else CATEGORIES

    mode_label = "DRY RUN" if args.dry_run else "LIVE"
    override_label = f"  model override: {args.model_override}" if args.model_override else ""

    print("=" * 72)
    print("  SKILL.md -> Gemini Gem JSON Converter  (standalone / fallback)")
    print("=" * 72)
    print(f"  Mode       : {mode_label}")
    print(f"  Source      : {SOURCE_DIR}")
    print(f"  Target      : {TARGET_DIR}")
    print(f"  Categories  : {', '.join(categories_to_run)}")
    if override_label:
        print(override_label)
    print("=" * 72)

    all_results: dict[str, list[dict]] = {}
    grand_ok = 0
    grand_fail = 0

    for category in categories_to_run:
        print(f"\n{'-' * 72}")
        temp = CATEGORY_TEMPERATURES.get(category, 0.5)
        grounding = " +grounding" if category in GROUNDING_CATEGORIES else ""
        print(f"  Category: {category}  (temp={temp}{grounding})")
        print(f"{'-' * 72}")

        results = convert_category(
            category,
            model_override=args.model_override,
            dry_run=args.dry_run,
        )

        ok_count = sum(1 for r in results if r.get("status") == "ok")
        fail_count = sum(1 for r in results if r.get("status") == "error")
        grand_ok += ok_count
        grand_fail += fail_count
        all_results[category] = results

        print(f"  --- {category}: {ok_count} converted, {fail_count} failed")

    # Generate index and per-category README
    print(f"\n{'-' * 72}")
    print("  Generating index and README files")
    print(f"{'-' * 72}")
    generate_index(all_results, dry_run=args.dry_run)

    # Summary
    print(f"\n{'=' * 72}")
    print("  CONVERSION COMPLETE")
    print(f"{'=' * 72}")
    print(f"  Total converted : {grand_ok}")
    print(f"  Total failed    : {grand_fail}")
    print(f"  Output location : {TARGET_DIR}")

    if args.dry_run:
        print("\n  (Dry run -- no files were written.)")

    print()


def main() -> None:
    warnings.warn(
        "convert_to_gems.py is deprecated. "
        "Use 'python sync-skills.py --targets gemini' instead.",
        DeprecationWarning,
        stacklevel=2,
    )
    print(
        "NOTE: This script is deprecated. "
        "Prefer: python sync-skills.py --targets gemini\n"
    )

    parser = build_parser()
    args = parser.parse_args()

    # Try to delegate to the unified sync-skills.py pipeline
    if _run_via_syncer(args):
        return

    # Fallback: run the original standalone logic
    _main_standalone(args)


if __name__ == "__main__":
    main()
