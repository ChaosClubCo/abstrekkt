"""
Tests for lib.metadata_enricher -- auto_tag, detect_related_skills,
estimate_complexity, enrich_skill.

Covers:
  - auto_tag return type, content, and deduplication
  - detect_related_skills with explicit name lists
  - estimate_complexity (the enricher version, distinct from platform_tuning)
  - enrich_skill computed fields
  - Edge cases: empty input, minimal input, missing keys
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from lib.metadata_enricher import (
    auto_tag,
    detect_related_skills,
    enrich_skill,
    estimate_complexity,
)

# ---------------------------------------------------------------------------
# auto_tag
# ---------------------------------------------------------------------------

class TestAutoTag:
    """Tests for auto_tag()."""

    def test_returns_list_of_strings(self, sample_skill):
        tags = auto_tag(sample_skill)
        assert isinstance(tags, list)
        assert all(isinstance(t, str) for t in tags)

    def test_includes_category_as_tag(self, sample_skill):
        tags = auto_tag(sample_skill)
        assert sample_skill["category"] in tags

    def test_includes_name_parts(self):
        skill = {
            "name": "api-development",
            "category": "technical",
            "body": "Simple body text.",
        }
        tags = auto_tag(skill)
        assert "api" in tags
        assert "development" in tags

    def test_detects_domain_keywords_in_body(self):
        skill = {
            "name": "test-skill",
            "category": "technical",
            "body": "This skill covers testing and deployment strategies.",
        }
        tags = auto_tag(skill)
        assert "testing" in tags
        assert "deployment" in tags

    def test_tags_are_sorted(self, sample_skill):
        tags = auto_tag(sample_skill)
        assert tags == sorted(tags)

    def test_tags_are_lowercased(self):
        skill = {
            "name": "My-SKILL",
            "category": "Technical",
            "body": "",
        }
        tags = auto_tag(skill)
        for tag in tags:
            assert tag == tag.lower()

    def test_empty_skill_returns_empty_or_minimal(self):
        tags = auto_tag({"name": "", "category": "", "body": ""})
        # With all-empty input, there should be no tags (or at most empty strings filtered)
        assert isinstance(tags, list)

    def test_short_name_parts_excluded(self):
        """Name parts with 2 or fewer characters are excluded."""
        skill = {
            "name": "a-bc-def",
            "category": "technical",
            "body": "",
        }
        tags = auto_tag(skill)
        # "a" (1 char) and "bc" (2 chars) should be excluded; "def" included
        assert "def" in tags
        assert "a" not in tags
        assert "bc" not in tags


# ---------------------------------------------------------------------------
# detect_related_skills
# ---------------------------------------------------------------------------

class TestDetectRelatedSkills:
    """Tests for detect_related_skills()."""

    def test_returns_list(self, sample_skill):
        all_names = ["api-development", "code-review", "unit-testing"]
        related = detect_related_skills(sample_skill, all_skill_names=all_names)
        assert isinstance(related, list)

    def test_does_not_include_self(self, sample_skill):
        all_names = ["api-development", "code-review", "api-gateway"]
        related = detect_related_skills(sample_skill, all_skill_names=all_names)
        assert sample_skill["name"] not in related

    def test_max_five_results(self, sample_skill):
        # Provide many names to ensure the cap is respected
        all_names = [f"skill-{i}" for i in range(50)]
        related = detect_related_skills(sample_skill, all_skill_names=all_names)
        assert len(related) <= 5

    def test_body_mention_boosts_relevance(self):
        """A skill name mentioned in the body should appear in results."""
        skill = {
            "name": "api-development",
            "category": "technical",
            "body": "This skill works well with code-review for quality assurance.",
        }
        all_names = ["code-review", "market-analysis", "content-writer"]
        related = detect_related_skills(skill, all_skill_names=all_names)
        assert "code-review" in related

    def test_empty_names_returns_empty(self, sample_skill):
        related = detect_related_skills(sample_skill, all_skill_names=[])
        assert related == []


# ---------------------------------------------------------------------------
# estimate_complexity (enricher version)
# ---------------------------------------------------------------------------

class TestEstimateComplexity:
    """Tests for the enricher's estimate_complexity function.

    Note: metadata_enricher imports estimate_complexity from
    platform_tuning, so it takes a skill data dict (not a raw string).
    """

    def test_returns_valid_label(self):
        body = "## Overview\nSome content.\n" * 50
        result = estimate_complexity({"body": body})
        assert result in {"simple", "moderate", "complex"}

    def test_empty_body_is_simple(self):
        assert estimate_complexity({"body": ""}) == "simple"

    def test_short_body_is_simple(self):
        body = "## Section\nLine.\n" * 10
        assert estimate_complexity({"body": body}) == "simple"

    def test_long_body_with_many_sections_is_complex(self):
        sections = "\n".join(f"## Section {i}\nContent paragraph.\n" for i in range(15))
        body = sections + "\n```python\ncode\n```\n" * 5
        body += "\nfiller line\n" * 300
        result = estimate_complexity({"body": body})
        assert result == "complex"


# ---------------------------------------------------------------------------
# enrich_skill
# ---------------------------------------------------------------------------

class TestEnrichSkill:
    """Tests for enrich_skill() computed fields."""

    def test_returns_dict_with_enrichment_keys(self, sample_skill):
        enriched = enrich_skill(sample_skill, all_skill_names=[])
        expected_keys = {
            "tags", "complexity", "token_estimate", "related_skills",
            "platform_capabilities", "version", "last_updated",
            "sections", "has_examples", "has_templates",
            "has_code_blocks", "line_count",
        }
        assert expected_keys.issubset(set(enriched.keys()))

    def test_preserves_original_keys(self, sample_skill):
        enriched = enrich_skill(sample_skill, all_skill_names=[])
        for key in ("name", "description", "body", "path", "category"):
            assert key in enriched
            assert enriched[key] == sample_skill[key]

    def test_token_estimate_is_positive_int(self, sample_skill):
        enriched = enrich_skill(sample_skill, all_skill_names=[])
        assert isinstance(enriched["token_estimate"], int)
        assert enriched["token_estimate"] > 0

    def test_version_is_1_0_0(self, sample_skill):
        enriched = enrich_skill(sample_skill, all_skill_names=[])
        assert enriched["version"] == "1.0.0"

    def test_platform_capabilities_has_all_platforms(self, sample_skill):
        enriched = enrich_skill(sample_skill, all_skill_names=[])
        caps = enriched["platform_capabilities"]
        for platform in ("gemini", "codex", "copilot", "claude"):
            assert platform in caps
            assert isinstance(caps[platform], dict)
