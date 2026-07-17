"""
Integration smoke tests for the Skills Library pipeline.

Verifies that:
  - All 6 expected category directories contain at least one SKILL.md
  - The canonical skill parser loads a known skill correctly
  - The skill validator passes a known good skill (score >= 80)
  - Every SKILL.md in _master-skills parses without exceptions
  - Every SKILL.md has the required ``name`` and ``description`` frontmatter
"""

import sys
from pathlib import Path

import pytest

# ---------------------------------------------------------------------------
# Ensure the project root is on sys.path so ``lib.*`` imports resolve.
# ---------------------------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from lib.config import CATEGORIES, MASTER_DIR
from lib.skill_parser import discover_all_skills, parse_skill_file
from lib.skill_validator import SkillValidator, ValidationResult

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

EXPECTED_CATEGORIES = sorted(CATEGORIES)
# A known skill that should always exist and pass validation.
KNOWN_GOOD_SKILL = MASTER_DIR / "technical" / "api-development" / "SKILL.md"


def _all_skill_paths() -> list:
    """Return sorted list of every SKILL.md path under _master-skills."""
    return sorted(MASTER_DIR.rglob("SKILL.md"))


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


class TestAllCategoriesHaveSkills:
    """Verify each of the 6 category dirs in _master-skills has at least 1 SKILL.md."""

    @pytest.mark.parametrize("category", EXPECTED_CATEGORIES)
    def test_category_dir_exists(self, category: str):
        """Category directory must exist under _master-skills."""
        category_dir = MASTER_DIR / category
        assert category_dir.is_dir(), (
            f"Category directory not found: {category_dir}"
        )

    @pytest.mark.parametrize("category", EXPECTED_CATEGORIES)
    def test_category_has_at_least_one_skill(self, category: str):
        """Each category must contain at least one SKILL.md file."""
        category_dir = MASTER_DIR / category
        skill_files = list(category_dir.rglob("SKILL.md"))
        assert len(skill_files) >= 1, (
            f"Category '{category}' has no SKILL.md files"
        )


class TestSkillParserLoadsValidSkill:
    """Parse a known skill and verify it returns name, description, content."""

    def test_known_skill_file_exists(self):
        """Precondition: the known good skill file must exist on disk."""
        assert KNOWN_GOOD_SKILL.is_file(), (
            f"Known good skill not found: {KNOWN_GOOD_SKILL}"
        )

    def test_parsed_skill_has_name(self):
        """Parsed skill dict must contain a non-empty 'name' field."""
        skill = parse_skill_file(KNOWN_GOOD_SKILL)
        assert skill["name"], "Parsed skill 'name' is empty"

    def test_parsed_skill_has_description(self):
        """Parsed skill dict must contain a non-empty 'description' field."""
        skill = parse_skill_file(KNOWN_GOOD_SKILL)
        assert skill["description"], "Parsed skill 'description' is empty"

    def test_parsed_skill_has_body(self):
        """Parsed skill dict must contain a non-empty 'body' field."""
        skill = parse_skill_file(KNOWN_GOOD_SKILL)
        assert skill["body"], "Parsed skill 'body' is empty"

    def test_parsed_skill_has_category(self):
        """Parsed skill dict must contain the correct 'category' field."""
        skill = parse_skill_file(KNOWN_GOOD_SKILL)
        assert skill["category"] == "technical"

    def test_parsed_skill_has_slug(self):
        """Parsed skill dict must contain the correct 'slug' field."""
        skill = parse_skill_file(KNOWN_GOOD_SKILL)
        assert skill["slug"] == "api-development"


class TestSkillValidatorPassesValidSkill:
    """Validate a known good skill and verify score >= 80 and pass=True."""

    def test_validator_returns_validation_result(self):
        """validate() must return a ValidationResult instance."""
        skill = parse_skill_file(KNOWN_GOOD_SKILL)
        validator = SkillValidator()
        result = validator.validate(skill)
        assert isinstance(result, ValidationResult), (
            f"Expected ValidationResult, got {type(result).__name__}"
        )

    def test_known_good_skill_passes(self):
        """A known good skill must pass validation (no blocking errors)."""
        skill = parse_skill_file(KNOWN_GOOD_SKILL)
        validator = SkillValidator()
        result = validator.validate(skill)
        assert result.passed is True, (
            f"Known good skill failed validation. Errors: {result.errors}"
        )

    def test_known_good_skill_score_at_least_80(self):
        """A known good skill must score at least 80."""
        skill = parse_skill_file(KNOWN_GOOD_SKILL)
        validator = SkillValidator()
        result = validator.validate(skill)
        assert result.score >= 80, (
            f"Known good skill scored {result.score}, expected >= 80. "
            f"Errors: {result.errors}, Warnings: {result.warnings}"
        )


@pytest.mark.slow
class TestAllMasterSkillsParseable:
    """Iterate all SKILL.md files in _master-skills and verify they all parse
    without exceptions."""

    def test_at_least_one_skill_exists(self):
        """Precondition: there must be at least one SKILL.md in _master-skills."""
        skill_paths = _all_skill_paths()
        assert len(skill_paths) > 0, "No SKILL.md files found in _master-skills"

    def test_all_skills_parse_without_exception(self):
        """Every SKILL.md must parse via parse_skill_file without raising."""
        skill_paths = _all_skill_paths()
        failures = []
        for path in skill_paths:
            try:
                skill = parse_skill_file(path)
                # Sanity check: must return a dict with expected keys
                assert isinstance(skill, dict), f"Not a dict: {path}"
                assert "name" in skill, f"Missing 'name' key: {path}"
                assert "description" in skill, f"Missing 'description' key: {path}"
                assert "body" in skill, f"Missing 'body' key: {path}"
            except Exception as exc:
                failures.append(f"{path}: {exc}")

        assert not failures, (
            f"{len(failures)} skill(s) failed to parse:\n"
            + "\n".join(failures[:20])
        )

    def test_discover_all_skills_returns_expected_count(self):
        """discover_all_skills must find a reasonable number of skills (> 400)."""
        skills = discover_all_skills(MASTER_DIR)
        assert len(skills) > 400, (
            f"Expected > 400 skills, found {len(skills)}"
        )


@pytest.mark.slow
class TestFrontmatterHasRequiredFields:
    """Verify all skills have ``name`` and ``description`` in frontmatter."""

    def test_all_skills_have_name(self):
        """Every SKILL.md must have a non-empty 'name' after parsing."""
        skill_paths = _all_skill_paths()
        missing_name = []
        for path in skill_paths:
            try:
                skill = parse_skill_file(path)
                if not skill.get("name"):
                    missing_name.append(str(path))
            except Exception:
                missing_name.append(f"{path} (parse error)")

        assert not missing_name, (
            f"{len(missing_name)} skill(s) missing 'name':\n"
            + "\n".join(missing_name[:20])
        )

    def test_all_skills_have_description(self):
        """Every SKILL.md must have a non-empty 'description' after parsing."""
        skill_paths = _all_skill_paths()
        missing_desc = []
        for path in skill_paths:
            try:
                skill = parse_skill_file(path)
                if not skill.get("description"):
                    missing_desc.append(str(path))
            except Exception:
                missing_desc.append(f"{path} (parse error)")

        assert not missing_desc, (
            f"{len(missing_desc)} skill(s) missing 'description':\n"
            + "\n".join(missing_desc[:20])
        )

    def test_names_are_lowercase_hyphenated(self):
        """Every skill name must be a lowercase-hyphenated slug."""
        import re
        slug_pattern = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
        skill_paths = _all_skill_paths()
        bad_names = []
        for path in skill_paths:
            try:
                skill = parse_skill_file(path)
                name = skill.get("name", "")
                if name and not slug_pattern.match(name):
                    bad_names.append(f"{path}: '{name}'")
            except Exception:
                pass  # parse errors caught by other tests

        assert not bad_names, (
            f"{len(bad_names)} skill(s) have non-slug names:\n"
            + "\n".join(bad_names[:20])
        )
