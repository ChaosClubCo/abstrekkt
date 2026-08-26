"""
Skill Validation Module
=======================

Validates SKILL.md files against quality standards. Checks frontmatter,
body structure, description quality, cross-references, and calculates
an overall quality score for each skill.

Usage:
    python lib/skill_validator.py --all
    python lib/skill_validator.py --skill technical/artifacts-builder
    python lib/skill_validator.py --category ai-agents
    python lib/skill_validator.py --min-score 70
"""

from __future__ import annotations

import argparse
import re
import sys
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
from lib.config import MASTER_DIR

TRIGGER_VERBS = [
    "create", "analyze", "build", "manage", "optimize", "generate",
    "design", "develop", "implement", "configure", "deploy", "automate",
    "review", "audit", "plan", "monitor", "debug", "test", "transform",
    "validate", "migrate", "integrate", "document", "evaluate", "refactor",
    "maintain", "scale", "convert", "extract", "visualize", "streamline",
    "diagnose", "write", "assess", "produce", "compile", "format",
    "structure", "define", "establish", "enforce", "resolve", "track",
]

BOILERPLATE_PHRASES = [
    "this skill does things",
    "a general purpose skill",
    "use this for everything",
    "does stuff",
    "a skill for doing things",
]

ALLOWED_NAME_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")

# ANSI colour codes for terminal output
_RESET = "\033[0m"
_BOLD = "\033[1m"
_RED = "\033[91m"
_GREEN = "\033[92m"
_YELLOW = "\033[93m"
_CYAN = "\033[96m"
_DIM = "\033[2m"


# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------

@dataclass
class ValidationResult:
    """Outcome of validating a single SKILL.md file."""

    skill_path: str
    passed: bool
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    score: int = 100

    def __str__(self) -> str:
        status = "PASS" if self.passed else "FAIL"
        parts = [f"[{status}] {self.skill_path} (score: {self.score})"]
        for err in self.errors:
            parts.append(f"  ERROR: {err}")
        for warn in self.warnings:
            parts.append(f"  WARN:  {warn}")
        return "\n".join(parts)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _parse_skill_file(skill_md_path: Path) -> dict:
    """Parse a SKILL.md file into a skill data dict.

    Returns a dict with keys: name, description, body, path, category.
    The *body* is the markdown content after the closing ``---`` of the
    YAML frontmatter.
    """
    text = skill_md_path.read_text(encoding="utf-8", errors="replace")

    # --- frontmatter parsing (simple, no PyYAML dependency) ---
    name = ""
    description = ""
    body = text

    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            frontmatter_block = parts[1]
            body = parts[2].strip()

            for line in frontmatter_block.splitlines():
                line = line.strip()
                if line.lower().startswith("name:"):
                    name = line.split(":", 1)[1].strip().strip("\"'")
                elif line.lower().startswith("description:"):
                    description = line.split(":", 1)[1].strip().strip("\"'")

    # Derive category from path structure  _master-skills/{category}/{skill}/SKILL.md
    try:
        relative = skill_md_path.relative_to(MASTER_DIR)
        category = relative.parts[0] if len(relative.parts) > 1 else ""
    except ValueError:
        category = ""

    return {
        "name": name,
        "description": description,
        "body": body,
        "path": str(skill_md_path),
        "category": category,
    }


def _has_references_dir(skill_data: dict) -> bool:
    """Check whether a ``references/`` directory exists alongside the SKILL.md."""
    skill_path = Path(skill_data["path"])
    return (skill_path.parent / "references").is_dir()


def _extract_headings(body: str) -> List[Tuple[int, str]]:
    """Return a list of (level, title) tuples for markdown headings."""
    headings: List[Tuple[int, str]] = []
    for line in body.splitlines():
        m = re.match(r"^(#{1,6})\s+(.*)", line)
        if m:
            headings.append((len(m.group(1)), m.group(2).strip()))
    return headings


def _extract_paragraphs(body: str) -> List[str]:
    """Split body into paragraph-level blocks (ignoring code blocks)."""
    # Remove fenced code blocks first
    cleaned = re.sub(r"```[\s\S]*?```", "", body)
    paragraphs: List[str] = []
    current: List[str] = []
    for line in cleaned.splitlines():
        stripped = line.strip()
        if stripped == "":
            if current:
                paragraphs.append("\n".join(current))
                current = []
        else:
            current.append(stripped)
    if current:
        paragraphs.append("\n".join(current))
    return paragraphs


# ---------------------------------------------------------------------------
# Validator
# ---------------------------------------------------------------------------

class SkillValidator:
    """Validates skill data dicts against quality standards."""

    # -- Frontmatter --------------------------------------------------------

    def validate_frontmatter(self, skill_data: dict) -> List[str]:
        """Check frontmatter fields for completeness and correctness.

        Returns a list of error strings. An empty list means the
        frontmatter passed all checks.
        """
        errors: List[str] = []
        name = skill_data.get("name", "")
        description = skill_data.get("description", "")

        # --- name ---
        if not name:
            errors.append("Frontmatter: 'name' field is missing or empty.")
        elif not ALLOWED_NAME_PATTERN.match(name):
            errors.append(
                f"Frontmatter: 'name' contains forbidden characters "
                f"(got '{name}'). Only lowercase alphanumeric and hyphens "
                f"are allowed."
            )

        # --- description ---
        if not description:
            errors.append("Frontmatter: 'description' field is missing or empty.")
        else:
            desc_len = len(description)
            if desc_len < 20:
                errors.append(
                    f"Frontmatter: description is too short "
                    f"({desc_len} chars, minimum 20)."
                )
            elif desc_len > 500:
                errors.append(
                    f"Frontmatter: description is too long "
                    f"({desc_len} chars, maximum 500)."
                )

            # trigger-rich check
            desc_lower = description.lower()
            found_verbs = [v for v in TRIGGER_VERBS if v in desc_lower]
            if not found_verbs:
                errors.append(
                    "Frontmatter: description lacks action verbs "
                    "(trigger-rich requirement). Include verbs like "
                    "'create', 'analyze', 'build', etc."
                )

        return errors

    # -- Body ---------------------------------------------------------------

    def validate_body(self, skill_data: dict) -> List[str]:
        """Validate body content for length, structure, and substance.

        Returns a list of error/warning strings.  Strings prefixed with
        ``[WARN]`` are non-blocking warnings; all others are blocking
        errors.
        """
        issues: List[str] = []
        body = skill_data.get("body", "")
        lines = body.splitlines()
        line_count = len(lines)

        # --- line count ---
        if line_count < 50:
            issues.append(
                f"Body: too short ({line_count} lines, minimum 50)."
            )
        elif line_count < 200:
            issues.append(
                f"[WARN] Body: relatively short ({line_count} lines). "
                f"Consider expanding to at least 200 lines for depth."
            )

        if line_count > 2000:
            issues.append(
                f"Body: too long ({line_count} lines, maximum 2000). "
                f"Consider splitting into references."
            )

        # --- at least one ## heading ---
        headings = _extract_headings(body)
        h2_headings = [h for h in headings if h[0] == 2]
        if not h2_headings:
            issues.append("Body: no ## (h2) headings found.")

        # --- required sections ---
        heading_titles_lower = [h[1].lower() for h in headings]
        CORE_SECTION_NAMES = {
            "core workflow", "instructions", "core processes", "core process",
            "workflow", "quick start", "how to use", "getting started",
            "steps", "step", "usage", "implementation", "process", "guide",
            "overview", "methodology", "framework", "approach", "procedure",
            "how it works", "implementation guide", "key capabilities",
            "primary functions", "main features", "configuration",
        }
        has_core_section = any(
            t in CORE_SECTION_NAMES for t in heading_titles_lower
        )
        if not has_core_section:
            issues.append(
                "Body: missing a 'Core Workflow' or 'Instructions' section "
                "(or equivalent like 'Core Processes', 'Quick Start')."
            )

        # --- concrete examples ---
        has_code_block = "```" in body
        has_numbered_detail = bool(
            re.search(r"^\d+\.\s+\S.{20,}", body, re.MULTILINE)
        )
        if not has_code_block and not has_numbered_detail:
            issues.append(
                "Body: no concrete examples found. Include code blocks "
                "or detailed numbered lists."
            )

        # --- stub detection ---
        if len(body) < 500:
            issues.append(
                f"Body: appears to be a stub ({len(body)} chars). "
                f"Minimum substantive content is 500 characters."
            )

        return issues

    # -- Structure ----------------------------------------------------------

    def validate_structure(self, skill_data: dict) -> List[str]:
        """Validate structural quality: progressive disclosure, duplicates,
        heading order.

        Returns a list of issue strings (``[WARN]`` prefix for warnings).
        """
        issues: List[str] = []
        body = skill_data.get("body", "")
        lines = body.splitlines()
        line_count = len(lines)

        # --- progressive disclosure ---
        if line_count > 500 and not _has_references_dir(skill_data):
            issues.append(
                "[WARN] Structure: body exceeds 500 lines without a "
                "references/ directory. Consider splitting supporting "
                "material into reference files."
            )

        # --- duplicate content blocks ---
        paragraphs = _extract_paragraphs(body)
        # Normalise for comparison (strip whitespace, lowercase)
        normalised = [re.sub(r"\s+", " ", p).strip().lower() for p in paragraphs]
        # Only flag paragraphs that are substantial (> 80 chars)
        seen: Dict[str, int] = {}
        for np in normalised:
            if len(np) > 80:
                seen[np] = seen.get(np, 0) + 1
        duplicates = {k: v for k, v in seen.items() if v > 1}
        if duplicates:
            count = len(duplicates)
            issues.append(
                f"Structure: {count} duplicate content block(s) detected. "
                f"Remove repeated paragraphs."
            )

        # --- heading order: ## must appear before ### ---
        headings = _extract_headings(body)
        if headings:
            seen_h2 = False
            for level, title in headings:
                if level == 2:
                    seen_h2 = True
                elif level == 3 and not seen_h2:
                    issues.append(
                        f"Structure: ### heading '{title}' appears before "
                        f"any ## heading. Use ## before ###."
                    )
                    break  # one report is enough

        return issues

    # -- Description quality ------------------------------------------------

    def validate_description_quality(self, description: str) -> List[str]:
        """Deeper quality analysis of the description field.

        Returns a list of issue strings (``[WARN]`` prefix for warnings).
        """
        issues: List[str] = []
        if not description:
            return issues  # already caught by frontmatter validation

        desc_lower = description.lower()

        # --- trigger words ---
        found_verbs = [v for v in TRIGGER_VERBS if v in desc_lower]
        if len(found_verbs) < 2:
            issues.append(
                "[WARN] Description quality: only "
                f"{len(found_verbs)} trigger verb(s) found. "
                f"Aim for 2+ action verbs for discoverability."
            )

        # --- explains WHEN to use ---
        when_indicators = [
            "use when", "use for", "use this", "invoke when", "helpful for",
            "designed for", "ideal for", "best for", "suitable for",
            "when you need", "when you want",
        ]
        has_when = any(indicator in desc_lower for indicator in when_indicators)
        if not has_when:
            issues.append(
                "[WARN] Description quality: does not explain WHEN to use "
                "the skill. Add phrases like 'Use when ...', 'Use for ...', "
                "or 'Ideal for ...'."
            )

        # --- boilerplate detection ---
        for phrase in BOILERPLATE_PHRASES:
            if phrase in desc_lower:
                issues.append(
                    f"Description quality: contains boilerplate text "
                    f"('{phrase}'). Write a specific, actionable description."
                )
                break

        return issues

    # -- Cross-references ---------------------------------------------------

    # Paths and common words that are NOT skill references
    _NON_SKILL_WORDS = frozenset({
        "references", "scripts", "assets", "images", "docs", "examples",
        "templates", "config", "lib", "src", "test", "tests", "build",
        # Common English words that appear after "See:", "Use:", "Also:"
        "the", "a", "an", "this", "that", "how", "when", "where", "what",
        "not", "also", "using", "above", "below", "more", "here", "note",
        "if", "for", "all", "each", "any", "our", "your", "my",
        # Adjectives/descriptors that aren't skill names
        "calm", "natural", "high", "vibrant", "contrast", "low", "dark",
        "light", "bold", "weak", "strong", "simple", "complex", "new",
        "old", "best", "worst", "good", "bad", "optimism", "unprepared",
        "concerns", "dependencies", "following", "previous", "next",
    })

    def _looks_like_skill_slug(self, candidate: str) -> bool:
        """Return True if candidate looks like a valid skill slug name."""
        # Must be at least 3 chars
        if len(candidate) < 3:
            return False
        # Skip directory paths and common words
        if candidate in self._NON_SKILL_WORDS:
            return False
        # Prefer hyphenated names (multi-word slugs) - these are almost
        # certainly skill references. Single words are ambiguous.
        if "-" in candidate:
            return True
        # Single words: only accept if they match the strict slug pattern
        # and are long enough to not be a common English word
        if len(candidate) >= 6 and ALLOWED_NAME_PATTERN.match(candidate):
            return True
        return False

    def validate_cross_references(
        self,
        skill_data: dict,
        all_skills: List[dict],
    ) -> List[str]:
        """Check that referenced skills exist and there are no circular refs.

        Cross-references are detected by markdown links to sibling skill dirs
        (e.g. ``[name](../other-skill/)``) which are reliable indicators.
        Text patterns like ``See: skill-name`` are only matched when the
        candidate looks like a valid skill slug (hyphenated, not a common word).

        Returns a list of issue strings (prefixed with [WARN] for warnings).
        """
        issues: List[str] = []
        body = skill_data.get("body", "")
        current_name = skill_data.get("name", "")

        # Build set of known skill names
        known_names = {s.get("name", "") for s in all_skills if s.get("name")}

        # Pattern 1: Markdown links to sibling dirs (reliable)
        link_pattern = re.compile(r"\[([a-z0-9-]+)\]\(\.\./([a-z0-9-]+)/", re.I)
        # Pattern 2: Text references (only match hyphenated slugs)
        text_pattern = re.compile(
            r"(?:see|related\s+skill)\s*:\s*([a-z][a-z0-9]*(?:-[a-z0-9]+)+)", re.I
        )

        referenced: set = set()

        # Collect from markdown links (use group 2 - the directory name)
        for m in link_pattern.finditer(body):
            candidate = m.group(2).strip().lower()
            if self._looks_like_skill_slug(candidate) and candidate != current_name:
                referenced.add(candidate)

        # Collect from text references
        for m in text_pattern.finditer(body):
            candidate = m.group(1).strip().lower()
            if self._looks_like_skill_slug(candidate) and candidate != current_name:
                referenced.add(candidate)

        # Check existence - use warnings (not errors) for missing refs
        for ref in sorted(referenced):
            if ref not in known_names:
                issues.append(
                    f"[WARN] Cross-reference: referenced skill '{ref}' does not "
                    f"exist in the skills catalogue."
                )

        return issues

    # -- Score calculation --------------------------------------------------

    def calculate_score(
        self,
        errors: List[str],
        warnings: List[str],
        skill_data: dict,
    ) -> int:
        """Calculate a 0-100 quality score.

        Scoring rules:
        - Start at 100
        - -20 per error
        - -5 per warning
        - +10 if has examples (code blocks or detailed numbered lists)
        - +10 if has templates/frameworks section
        - +5 if has output format section
        - Clamped to 0-100
        """
        score = 100

        # Penalties
        actual_errors = [e for e in errors if not e.startswith("[WARN]")]
        actual_warnings = [e for e in errors if e.startswith("[WARN]")] + warnings
        score -= 20 * len(actual_errors)
        score -= 5 * len(actual_warnings)

        # Bonuses
        body = skill_data.get("body", "")
        headings_lower = [h[1].lower() for h in _extract_headings(body)]

        if "```" in body:
            score += 10
        elif re.search(r"^\d+\.\s+\S.{20,}", body, re.MULTILINE):
            score += 10

        template_keywords = ("template", "framework", "boilerplate", "scaffold")
        if any(kw in title for title in headings_lower for kw in template_keywords):
            score += 10

        output_keywords = ("output format", "output", "deliverable", "result format")
        if any(kw in title for title in headings_lower for kw in output_keywords):
            score += 5

        # Clamp
        return max(0, min(100, score))

    # -- Main validate entrypoint -------------------------------------------

    def validate(
        self,
        skill_data: dict,
        all_skills: Optional[List[dict]] = None,
    ) -> ValidationResult:
        """Run all validation checks against a skill data dict.

        Args:
            skill_data: Dict with keys name, description, body, path, category.
            all_skills: Optional list of all skill dicts for cross-reference
                validation.  If ``None``, cross-reference checks are skipped.

        Returns:
            A ``ValidationResult`` with aggregated errors, warnings, score,
            and pass/fail status.
        """
        all_issues: List[str] = []

        all_issues.extend(self.validate_frontmatter(skill_data))
        all_issues.extend(self.validate_body(skill_data))
        all_issues.extend(self.validate_structure(skill_data))
        all_issues.extend(
            self.validate_description_quality(skill_data.get("description", ""))
        )

        if all_skills is not None:
            all_issues.extend(
                self.validate_cross_references(skill_data, all_skills)
            )

        # Separate errors and warnings
        errors = [i for i in all_issues if not i.startswith("[WARN]")]
        warnings = [i.removeprefix("[WARN] ").strip() for i in all_issues if i.startswith("[WARN]")]

        score = self.calculate_score(all_issues, [], skill_data)
        passed = len(errors) == 0

        return ValidationResult(
            skill_path=skill_data.get("path", ""),
            passed=passed,
            errors=errors,
            warnings=warnings,
            score=score,
        )


# ---------------------------------------------------------------------------
# Batch validation
# ---------------------------------------------------------------------------

def validate_all(master_dir: Path) -> dict:
    """Validate every SKILL.md under *master_dir* and return a summary.

    Returns:
        A dict with keys:
        - ``total``: number of skills validated
        - ``passed``: number that passed
        - ``failed``: number that failed
        - ``average_score``: mean quality score
        - ``skills_by_score``: list of (path, score) sorted ascending
        - ``common_issues``: Counter of issue descriptions
        - ``results``: list of ``ValidationResult`` objects
    """
    skill_files = sorted(master_dir.rglob("SKILL.md"))

    # Parse all skills first (needed for cross-reference validation)
    all_skills: List[dict] = []
    for sf in skill_files:
        all_skills.append(_parse_skill_file(sf))

    validator = SkillValidator()
    results: List[ValidationResult] = []

    for skill_data in all_skills:
        result = validator.validate(skill_data, all_skills=all_skills)
        results.append(result)

    passed = sum(1 for r in results if r.passed)
    failed = sum(1 for r in results if not r.passed)
    total = len(results)
    avg_score = round(sum(r.score for r in results) / total, 1) if total else 0.0

    # Aggregate common issues
    issue_counter: Counter[str] = Counter()
    for r in results:
        for e in r.errors:
            issue_counter[e] += 1
        for w in r.warnings:
            issue_counter[w] += 1

    skills_by_score = sorted(
        [(r.skill_path, r.score) for r in results],
        key=lambda x: x[1],
    )

    return {
        "total": total,
        "passed": passed,
        "failed": failed,
        "average_score": avg_score,
        "skills_by_score": skills_by_score,
        "common_issues": issue_counter,
        "results": results,
    }


# ---------------------------------------------------------------------------
# CLI helpers
# ---------------------------------------------------------------------------

def _relative_skill_label(path_str: str) -> str:
    """Create a short label like ``ai-agents/brand-guidelines`` from a
    full path."""
    try:
        rel = Path(path_str).relative_to(MASTER_DIR)
        # Drop the trailing SKILL.md
        return str(rel.parent).replace("\\", "/")
    except (ValueError, TypeError):
        return path_str


def _print_table(results: List[ValidationResult], min_score: int = 0) -> None:
    """Pretty-print results as a coloured terminal table."""
    # Filter
    if min_score > 0:
        results = [r for r in results if r.score < min_score]

    if not results:
        print(f"{_GREEN}All skills meet the minimum score threshold.{_RESET}")
        return

    # Sort by score ascending (worst first)
    results = sorted(results, key=lambda r: r.score)

    # Column widths
    label_width = max(
        len(_relative_skill_label(r.skill_path)) for r in results
    )
    label_width = max(label_width, 30)

    # Header
    header = (
        f"{'Skill':<{label_width}}  {'Score':>5}  {'Status':<6}  "
        f"{'Errors':>6}  {'Warnings':>8}"
    )
    print(f"\n{_BOLD}{_CYAN}{header}{_RESET}")
    print(f"{_DIM}{'-' * len(header)}{_RESET}")

    for r in results:
        label = _relative_skill_label(r.skill_path)
        status = f"{_GREEN}PASS{_RESET}" if r.passed else f"{_RED}FAIL{_RESET}"

        if r.score >= 80:
            score_color = _GREEN
        elif r.score >= 50:
            score_color = _YELLOW
        else:
            score_color = _RED

        print(
            f"{label:<{label_width}}  "
            f"{score_color}{r.score:>5}{_RESET}  "
            f"{status}  "
            f"{len(r.errors):>6}  "
            f"{len(r.warnings):>8}"
        )

    print()


def _print_detail(result: ValidationResult) -> None:
    """Print detailed validation output for a single result."""
    label = _relative_skill_label(result.skill_path)
    status = f"{_GREEN}PASS{_RESET}" if result.passed else f"{_RED}FAIL{_RESET}"
    print(f"\n{_BOLD}{label}{_RESET}  [{status}]  score: {result.score}")

    if result.errors:
        print(f"\n  {_RED}Errors:{_RESET}")
        for e in result.errors:
            print(f"    - {e}")

    if result.warnings:
        print(f"\n  {_YELLOW}Warnings:{_RESET}")
        for w in result.warnings:
            print(f"    - {w}")

    if not result.errors and not result.warnings:
        print(f"  {_GREEN}No issues found.{_RESET}")

    print()


def _print_summary(summary: dict) -> None:
    """Print an aggregated summary."""
    print(f"\n{_BOLD}{_CYAN}=== Validation Summary ==={_RESET}")
    print(f"  Total skills:   {summary['total']}")
    print(f"  {_GREEN}Passed:{_RESET}         {summary['passed']}")
    print(f"  {_RED}Failed:{_RESET}         {summary['failed']}")
    print(f"  Average score:  {summary['average_score']}")

    if summary["common_issues"]:
        print(f"\n{_BOLD}Top issues:{_RESET}")
        for issue, count in summary["common_issues"].most_common(10):
            # Truncate long issue descriptions for the summary
            short = issue[:90] + "..." if len(issue) > 90 else issue
            print(f"  {count:>4}x  {short}")

    print()


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def main(argv: Optional[List[str]] = None) -> None:
    """Command-line interface for skill validation."""
    parser = argparse.ArgumentParser(
        description="Validate SKILL.md files against quality standards.",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Validate all skills under the master directory.",
    )
    parser.add_argument(
        "--skill",
        type=str,
        default=None,
        help=(
            "Validate a single skill by relative path "
            "(e.g. technical/artifacts-builder)."
        ),
    )
    parser.add_argument(
        "--category",
        type=str,
        default=None,
        help="Validate all skills in a specific category (e.g. ai-agents).",
    )
    parser.add_argument(
        "--min-score",
        type=int,
        default=0,
        dest="min_score",
        help="Only show skills scoring below this threshold.",
    )

    args = parser.parse_args(argv)

    # Determine which skills to validate
    if args.skill:
        skill_path = MASTER_DIR / args.skill / "SKILL.md"
        if not skill_path.is_file():
            print(f"{_RED}Error: Skill file not found: {skill_path}{_RESET}")
            sys.exit(1)
        skill_data = _parse_skill_file(skill_path)
        # For cross-reference checks, load all skills
        all_skills = [
            _parse_skill_file(sf) for sf in sorted(MASTER_DIR.rglob("SKILL.md"))
        ]
        validator = SkillValidator()
        result = validator.validate(skill_data, all_skills=all_skills)
        _print_detail(result)
        sys.exit(0 if result.passed else 1)

    elif args.category:
        category_dir = MASTER_DIR / args.category
        if not category_dir.is_dir():
            print(
                f"{_RED}Error: Category directory not found: "
                f"{category_dir}{_RESET}"
            )
            sys.exit(1)
        skill_files = sorted(category_dir.rglob("SKILL.md"))
        if not skill_files:
            print(
                f"{_YELLOW}No SKILL.md files found in "
                f"category '{args.category}'.{_RESET}"
            )
            sys.exit(0)
        # Parse all for cross-refs, but only report on this category
        all_skills = [
            _parse_skill_file(sf)
            for sf in sorted(MASTER_DIR.rglob("SKILL.md"))
        ]
        category_data = [
            _parse_skill_file(sf) for sf in skill_files
        ]
        validator = SkillValidator()
        results = [
            validator.validate(sd, all_skills=all_skills)
            for sd in category_data
        ]
        _print_table(results, min_score=args.min_score)
        _print_summary({
            "total": len(results),
            "passed": sum(1 for r in results if r.passed),
            "failed": sum(1 for r in results if not r.passed),
            "average_score": (
                round(sum(r.score for r in results) / len(results), 1)
                if results else 0.0
            ),
            "common_issues": Counter(
                issue
                for r in results
                for issue in r.errors + r.warnings
            ),
        })
        has_failures = any(not r.passed for r in results)
        sys.exit(1 if has_failures else 0)

    elif args.all:
        summary = validate_all(MASTER_DIR)
        _print_table(summary["results"], min_score=args.min_score)
        _print_summary(summary)
        sys.exit(1 if summary["failed"] > 0 else 0)

    else:
        parser.print_help()
        sys.exit(0)


if __name__ == "__main__":
    main()
