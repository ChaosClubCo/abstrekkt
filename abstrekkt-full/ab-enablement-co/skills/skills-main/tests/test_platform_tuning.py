"""
Tests for lib.platform_tuning -- platform-specific settings and complexity estimation.

Covers:
  - estimate_complexity return values and edge cases
  - estimate_complexity with ``sections`` as list vs int (was a TypeError bug)
  - get_gemini_settings structure and keys
  - get_codex_settings structure and tools list
  - get_copilot_settings structure and scope/priority
  - get_claude_settings structure and model/token selection
  - COMPLEXITY_MODEL_MAP model name correctness
  - CATEGORY_TEMPERATURE_MAP completeness
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from lib.config import CATEGORY_TEMPERATURES as CATEGORY_TEMPERATURE_MAP
from lib.platform_tuning import (
    COMPLEXITY_MODEL_MAP,
    estimate_complexity,
    get_claude_settings,
    get_codex_settings,
    get_copilot_settings,
    get_gemini_settings,
)

# ---------------------------------------------------------------------------
# estimate_complexity
# ---------------------------------------------------------------------------

class TestEstimateComplexity:
    """Tests for estimate_complexity()."""

    def test_returns_valid_label(self, sample_skill):
        result = estimate_complexity(sample_skill)
        assert result in {"simple", "moderate", "complex"}

    def test_simple_skill_is_simple_or_moderate(self, simple_skill):
        result = estimate_complexity(simple_skill)
        assert result in {"simple", "moderate"}

    def test_complex_skill_is_moderate_or_complex(self, complex_skill):
        result = estimate_complexity(complex_skill)
        assert result in {"moderate", "complex"}

    def test_empty_body_is_simple(self):
        result = estimate_complexity({"body": ""})
        assert result == "simple"

    def test_sections_as_list_no_typeerror(self, sample_skill):
        """Passing sections as a list must not raise TypeError.

        This was a real bug: ``int(["Overview", "Core"])`` raises
        TypeError. The fix is ``len(sections) if isinstance(sections, list)
        else int(sections or 0)``.
        """
        skill = dict(sample_skill)
        skill["sections"] = ["Overview", "Core Processes", "Tools", "Metrics"]
        # Must not raise
        result = estimate_complexity(skill)
        assert result in {"simple", "moderate", "complex"}

    def test_sections_as_int(self, sample_skill):
        """Passing sections as an int should work normally."""
        skill = dict(sample_skill)
        skill["sections"] = 12
        result = estimate_complexity(skill)
        assert result in {"simple", "moderate", "complex"}

    def test_sections_as_zero(self):
        """sections=0 should fall through to line-based detection."""
        skill = {"body": "line\n" * 50, "sections": 0}
        result = estimate_complexity(skill)
        assert result in {"simple", "moderate", "complex"}


# ---------------------------------------------------------------------------
# get_gemini_settings
# ---------------------------------------------------------------------------

class TestGetGeminiSettings:
    """Tests for get_gemini_settings()."""

    def test_returns_dict_with_required_keys(self, sample_skill):
        settings = get_gemini_settings(sample_skill)
        assert isinstance(settings, dict)
        assert "model" in settings
        assert "temperature" in settings
        assert "safetySettings" in settings

    def test_safety_settings_is_list(self, sample_skill):
        settings = get_gemini_settings(sample_skill)
        assert isinstance(settings["safetySettings"], list)
        assert len(settings["safetySettings"]) > 0
        # Each entry should have category and threshold
        for entry in settings["safetySettings"]:
            assert "category" in entry
            assert "threshold" in entry

    def test_model_is_gemini_variant(self, sample_skill):
        settings = get_gemini_settings(sample_skill)
        assert settings["model"].startswith("gemini-")


# ---------------------------------------------------------------------------
# get_codex_settings
# ---------------------------------------------------------------------------

class TestGetCodexSettings:
    """Tests for get_codex_settings()."""

    def test_returns_dict_with_required_keys(self, sample_skill):
        settings = get_codex_settings(sample_skill)
        assert isinstance(settings, dict)
        assert "model" in settings
        assert "tools" in settings
        assert "response_format" in settings

    def test_tools_always_includes_code_interpreter(self, sample_skill):
        settings = get_codex_settings(sample_skill)
        assert "code_interpreter" in settings["tools"]

    def test_strategy_category_adds_web_search(self):
        skill = {
            "body": "line\n" * 100,
            "category": "strategy",
        }
        settings = get_codex_settings(skill)
        assert "web_search" in settings["tools"]


# ---------------------------------------------------------------------------
# get_copilot_settings
# ---------------------------------------------------------------------------

class TestGetCopilotSettings:
    """Tests for get_copilot_settings()."""

    def test_returns_dict_with_required_keys(self, sample_skill):
        settings = get_copilot_settings(sample_skill)
        assert isinstance(settings, dict)
        assert "applyTo" in settings
        assert "scope" in settings
        assert "priority" in settings

    def test_technical_category_has_workspace_scope(self):
        settings = get_copilot_settings({"category": "technical"})
        assert settings["scope"] == "workspace"

    def test_creative_category_has_global_scope(self):
        settings = get_copilot_settings({"category": "creative"})
        assert settings["scope"] == "global"


# ---------------------------------------------------------------------------
# get_claude_settings
# ---------------------------------------------------------------------------

class TestGetClaudeSettings:
    """Tests for get_claude_settings()."""

    def test_returns_dict_with_required_keys(self, sample_skill):
        settings = get_claude_settings(sample_skill)
        assert isinstance(settings, dict)
        assert "model" in settings
        assert "max_tokens" in settings
        assert "tool_hints" in settings

    def test_model_is_claude_variant(self, sample_skill):
        settings = get_claude_settings(sample_skill)
        assert "claude" in settings["model"]


# ---------------------------------------------------------------------------
# COMPLEXITY_MODEL_MAP
# ---------------------------------------------------------------------------

class TestComplexityModelMap:
    """Tests for the COMPLEXITY_MODEL_MAP constant."""

    def test_has_gemini_platform(self):
        assert "gemini" in COMPLEXITY_MODEL_MAP

    def test_has_codex_platform(self):
        assert "codex" in COMPLEXITY_MODEL_MAP

    def test_has_claude_platform(self):
        assert "claude" in COMPLEXITY_MODEL_MAP

    def test_gemini_models_are_correct(self):
        gemini = COMPLEXITY_MODEL_MAP["gemini"]
        assert gemini["simple"] == "gemini-2.5-flash"
        assert gemini["complex"] == "gemini-2.5-pro"

    def test_codex_models_include_gpt41(self):
        codex = COMPLEXITY_MODEL_MAP["codex"]
        # At least one complexity level should map to gpt-4.1 or variant
        model_values = list(codex.values())
        assert any("gpt-4.1" in m for m in model_values)


# ---------------------------------------------------------------------------
# CATEGORY_TEMPERATURE_MAP
# ---------------------------------------------------------------------------

class TestCategoryTemperatureMap:
    """Tests for the CATEGORY_TEMPERATURE_MAP constant."""

    def test_has_all_six_categories(self):
        expected = {"technical", "strategy", "creative", "operations", "industry", "ai-agents"}
        assert expected.issubset(set(CATEGORY_TEMPERATURE_MAP.keys()))

    def test_values_are_floats_in_range(self):
        for category, temp in CATEGORY_TEMPERATURE_MAP.items():
            assert isinstance(temp, float), f"{category} temperature is not a float"
            assert 0.0 <= temp <= 1.0, f"{category} temperature {temp} out of range"
