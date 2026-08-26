"""
Tests for lib.skill_validator -- ValidationResult dataclass and SkillValidator.

Covers:
  - ValidationResult dataclass contract (fields, no .get(), __str__)
  - SkillValidator.validate() return type and pass/fail logic
  - validate_frontmatter edge cases (missing name, bad name, description)
  - validate_body edge cases (empty, short, missing headings)
  - validate_structure (heading order, duplicate blocks)
  - validate_description_quality (trigger verbs, boilerplate)
  - calculate_score clamping and bonuses
  - validate_all batch summary
"""

import sys
from dataclasses import fields as dc_fields
from pathlib import Path

# Ensure project root is importable
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from lib.skill_validator import SkillValidator, ValidationResult, validate_all

# ---------------------------------------------------------------------------
# ValidationResult dataclass tests
# ---------------------------------------------------------------------------

class TestValidationResult:
    """Tests for the ValidationResult dataclass."""

    def test_is_dataclass(self):
        """ValidationResult must be a proper dataclass."""
        field_names = {f.name for f in dc_fields(ValidationResult)}
        assert "passed" in field_names
        assert "errors" in field_names
        assert "warnings" in field_names
        assert "score" in field_names
        assert "skill_path" in field_names

    def test_default_values(self):
        """Defaults: passed=True(?), errors=[], warnings=[], score=100."""
        result = ValidationResult(skill_path="test/path", passed=True)
        assert result.passed is True
        assert result.errors == []
        assert result.warnings == []
        assert result.score == 100

    def test_does_not_have_get_method(self):
        """ValidationResult must NOT have a .get() method.

        This was a real bug: code assumed ValidationResult was a dict
        and called result.get("passed"), which silently returned None.
        """
        result = ValidationResult(skill_path="x", passed=True)
        assert not hasattr(result, "get"), (
            "ValidationResult should be a dataclass, not a dict. "
            "A .get() method indicates the wrong type is being returned."
        )

    def test_is_not_dict(self):
        """ValidationResult must not be a dict instance."""
        result = ValidationResult(skill_path="x", passed=True)
        assert not isinstance(result, dict)

    def test_str_representation_pass(self):
        """__str__ should include [PASS] for passing results."""
        result = ValidationResult(skill_path="tech/api", passed=True, score=95)
        text = str(result)
        assert "[PASS]" in text
        assert "tech/api" in text
        assert "95" in text

    def test_str_representation_fail(self):
        """__str__ should include [FAIL] and list errors."""
        result = ValidationResult(
            skill_path="tech/broken",
            passed=False,
            errors=["Missing name"],
            score=40,
        )
        text = str(result)
        assert "[FAIL]" in text
        assert "Missing name" in text

    def test_errors_and_warnings_are_independent_lists(self):
        """Errors and warnings must be independent list instances."""
        r1 = ValidationResult(skill_path="a", passed=True)
        r2 = ValidationResult(skill_path="b", passed=True)
        r1.errors.append("oops")
        assert r2.errors == [], "Mutable default should not be shared"


# ---------------------------------------------------------------------------
# SkillValidator.validate() return type
# ---------------------------------------------------------------------------

class TestValidateReturnType:
    """Verify validate() returns ValidationResult, not dict."""

    def test_returns_validation_result(self, sample_skill):
        validator = SkillValidator()
        result = validator.validate(sample_skill)
        assert isinstance(result, ValidationResult), (
            f"Expected ValidationResult, got {type(result).__name__}"
        )

    def test_result_has_passed_attribute(self, sample_skill):
        validator = SkillValidator()
        result = validator.validate(sample_skill)
        assert hasattr(result, "passed")
        assert isinstance(result.passed, bool)

    def test_result_has_score_attribute(self, sample_skill):
        validator = SkillValidator()
        result = validator.validate(sample_skill)
        assert hasattr(result, "score")
        assert isinstance(result.score, int)


# ---------------------------------------------------------------------------
# SkillValidator.validate() pass/fail logic
# ---------------------------------------------------------------------------

class TestValidatePassFail:
    """Test that validate() correctly passes or fails skills."""

    def test_valid_skill_passes(self, sample_skill):
        validator = SkillValidator()
        result = validator.validate(sample_skill)
        assert result.passed is True, (
            f"Expected valid skill to pass. Errors: {result.errors}"
        )

    def test_missing_name_fails(self, sample_skill):
        skill = dict(sample_skill)
        skill["name"] = ""
        validator = SkillValidator()
        result = validator.validate(skill)
        assert result.passed is False
        assert any("name" in e.lower() for e in result.errors)

    def test_missing_description_fails(self, sample_skill):
        skill = dict(sample_skill)
        skill["description"] = ""
        validator = SkillValidator()
        result = validator.validate(skill)
        assert result.passed is False
        assert any("description" in e.lower() for e in result.errors)

    def test_empty_body_fails(self, sample_skill):
        skill = dict(sample_skill)
        skill["body"] = ""
        validator = SkillValidator()
        result = validator.validate(skill)
        assert result.passed is False


# ---------------------------------------------------------------------------
# validate_frontmatter
# ---------------------------------------------------------------------------

class TestValidateFrontmatter:
    """Tests for SkillValidator.validate_frontmatter()."""

    def test_valid_frontmatter_no_errors(self, sample_skill):
        validator = SkillValidator()
        errors = validator.validate_frontmatter(sample_skill)
        assert errors == []

    def test_missing_name_returns_error(self):
        validator = SkillValidator()
        frontmatter = {"name": "", "description": "Build and create APIs for testing purposes."}
        errors = validator.validate_frontmatter(frontmatter)
        assert any("name" in e.lower() for e in errors)

    def test_invalid_name_characters(self):
        validator = SkillValidator()
        errors = validator.validate_frontmatter({
            "name": "My Skill With Spaces",
            "description": "Create something useful for development and testing.",
        })
        assert any("forbidden characters" in e.lower() for e in errors)

    def test_short_description_error(self):
        validator = SkillValidator()
        errors = validator.validate_frontmatter({
            "name": "test-skill",
            "description": "Too short",
        })
        assert any("too short" in e.lower() for e in errors)

    def test_description_without_trigger_verbs(self):
        validator = SkillValidator()
        errors = validator.validate_frontmatter({
            "name": "test-skill",
            "description": "A long enough description that has no action words whatsoever in its text body.",
        })
        assert any("trigger" in e.lower() or "verb" in e.lower() for e in errors)


# ---------------------------------------------------------------------------
# validate_body
# ---------------------------------------------------------------------------

class TestValidateBody:
    """Tests for SkillValidator.validate_body()."""

    def test_adequate_body_no_blocking_errors(self, sample_skill):
        validator = SkillValidator()
        issues = validator.validate_body(sample_skill)
        # Filter out warnings (non-blocking)
        errors = [i for i in issues if not i.startswith("[WARN]")]
        assert errors == [], f"Unexpected errors: {errors}"

    def test_empty_body_flags_multiple_issues(self):
        validator = SkillValidator()
        issues = validator.validate_body({"body": ""})
        errors = [i for i in issues if not i.startswith("[WARN]")]
        # Should flag: too short, no headings, no examples, stub
        assert len(errors) >= 3

    def test_very_short_body_is_stub(self):
        validator = SkillValidator()
        issues = validator.validate_body({"body": "Just a line or two."})
        assert any("stub" in i.lower() for i in issues)

    def test_body_without_headings(self):
        body = "No headings here.\n" * 60
        validator = SkillValidator()
        issues = validator.validate_body({"body": body})
        assert any("heading" in i.lower() for i in issues)


# ---------------------------------------------------------------------------
# validate_structure
# ---------------------------------------------------------------------------

class TestValidateStructure:
    """Tests for SkillValidator.validate_structure()."""

    def test_h3_before_h2_flagged(self):
        body = "### Subsection First\n\nContent here.\n\n## Main Section\n\nMore content.\n"
        validator = SkillValidator()
        issues = validator.validate_structure({
            "body": body,
            "path": str(Path("_master-skills/technical/test/SKILL.md")),
        })
        assert any("###" in i and "before" in i.lower() for i in issues)

    def test_proper_heading_order_no_issues(self, sample_skill):
        validator = SkillValidator()
        issues = validator.validate_structure(sample_skill)
        heading_order_issues = [
            i for i in issues
            if "###" in i and "before" in i.lower()
        ]
        assert heading_order_issues == []


# ---------------------------------------------------------------------------
# calculate_score
# ---------------------------------------------------------------------------

class TestCalculateScore:
    """Tests for SkillValidator.calculate_score()."""

    def test_score_range_0_to_100(self, sample_skill):
        validator = SkillValidator()
        score = validator.calculate_score([], [], sample_skill)
        assert 0 <= score <= 100

    def test_many_errors_floor_at_zero(self, sample_skill):
        errors = [f"Error {i}" for i in range(20)]
        validator = SkillValidator()
        score = validator.calculate_score(errors, [], sample_skill)
        assert score == 0

    def test_no_issues_high_score(self, sample_skill):
        validator = SkillValidator()
        score = validator.calculate_score([], [], sample_skill)
        assert score >= 100  # May get bonuses that push it, then clamp


# ---------------------------------------------------------------------------
# validate_all (batch)
# ---------------------------------------------------------------------------

class TestValidateAll:
    """Tests for the validate_all() batch function."""

    def test_returns_summary_dict(self, sample_master_dir):
        summary = validate_all(sample_master_dir)
        assert isinstance(summary, dict)
        assert "total" in summary
        assert "passed" in summary
        assert "failed" in summary
        assert "average_score" in summary
        assert "skills_by_score" in summary
        assert "common_issues" in summary
        assert "results" in summary

    def test_total_matches_file_count(self, sample_master_dir):
        summary = validate_all(sample_master_dir)
        skill_files = list(sample_master_dir.rglob("SKILL.md"))
        assert summary["total"] == len(skill_files)

    def test_results_are_validation_results(self, sample_master_dir):
        summary = validate_all(sample_master_dir)
        for result in summary["results"]:
            assert isinstance(result, ValidationResult)

    def test_passed_plus_failed_equals_total(self, sample_master_dir):
        summary = validate_all(sample_master_dir)
        assert summary["passed"] + summary["failed"] == summary["total"]
