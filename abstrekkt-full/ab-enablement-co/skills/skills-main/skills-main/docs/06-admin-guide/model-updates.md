# Model Updates

When AI platform providers release new models or deprecate old ones, the Skills Library model mappings must be updated. All model names are centralized in `lib/config.py`, with platform-specific logic in `lib/platform_tuning.py`.

## Where Models Are Defined

### Primary Configuration: `lib/config.py`

All model constants live in `lib/config.py`. This is the single source of truth.

#### Gemini Models

```python
GEMINI_MODELS: Dict[str, str] = {
    "simple": "gemini-2.5-flash",
    "moderate": "gemini-2.5-flash",
    "complex": "gemini-2.5-pro",
}
```

Used by: `convert_to_gems.py`, `sync-skills.py` (gemini target), `populate_all.py` (Gemini bundles and agents).

#### Codex (OpenAI) Models

```python
CODEX_MODELS: Dict[str, str] = {
    "simple": "gpt-4.1-mini",
    "moderate": "gpt-4.1",
    "complex": "o4-mini",
}
```

Used by: `convert_to_codex_responses.py`, `sync-skills.py` (codex target).

There is also a category-level model map for Codex:

```python
CODEX_CATEGORY_MODELS: Dict[str, str] = {
    "technical": "gpt-4.1",
    "ai-agents": "gpt-4.1",
    "strategy": "o4-mini",
    "creative": "gpt-4.1",
    "operations": "gpt-4.1-mini",
    "industry": "gpt-4.1",
}
```

Used by: `populate_all.py`, `convert_to_codex_responses.py`.

#### Claude Models

```python
CLAUDE_MODELS: Dict[str, str] = {
    "simple": "claude-sonnet-4-5-20250929",
    "moderate": "claude-sonnet-4-5-20250929",
    "complex": "claude-opus-4-6",
}
```

Used by: `lib/platform_tuning.py` (get_claude_settings), `sync-skills.py` (claude target).

### Platform Tuning: `lib/platform_tuning.py`

This module imports models from `lib/config.py` and builds the `COMPLEXITY_MODEL_MAP`:

```python
COMPLEXITY_MODEL_MAP: Dict[str, Dict[str, str]] = {
    "gemini": GEMINI_MODELS,
    "codex": _CODEX_MODELS,
    "claude": CLAUDE_MODELS,
}
```

The four `get_*_settings()` functions use this map:

| Function | Platform | Returns |
|----------|----------|---------|
| `get_gemini_settings(skill_data)` | Gemini | `model`, `temperature`, `safetySettings` |
| `get_codex_settings(skill_data)` | Codex/OpenAI | `model`, `tools`, `response_format` |
| `get_copilot_settings(skill_data)` | GitHub Copilot | `applyTo`, `scope`, `priority` |
| `get_claude_settings(skill_data)` | Claude | `model`, `max_tokens`, `tool_hints` |

Note: `get_copilot_settings()` does not use models (Copilot model selection is handled by GitHub).

---

## How to Update Models

### Step 1: Edit `lib/config.py`

Open `lib/config.py` and update the relevant model dictionary.

Example: updating Gemini models when `gemini-2.5-pro` is replaced by `gemini-3.0-pro`:

```python
# Before
GEMINI_MODELS: Dict[str, str] = {
    "simple": "gemini-2.5-flash",
    "moderate": "gemini-2.5-flash",
    "complex": "gemini-2.5-pro",
}

# After
GEMINI_MODELS: Dict[str, str] = {
    "simple": "gemini-2.5-flash",
    "moderate": "gemini-2.5-flash",
    "complex": "gemini-3.0-pro",
}
```

If the category-level model map also needs updating (Codex only):

```python
# Before
CODEX_CATEGORY_MODELS: Dict[str, str] = {
    "technical": "gpt-4.1",
    ...
}

# After
CODEX_CATEGORY_MODELS: Dict[str, str] = {
    "technical": "gpt-4.5",
    ...
}
```

### Step 2: Check for Hardcoded Model Names

Some scripts have inline fallback model names used when `lib/` is not importable. Search for the old model name:

```bash
grep -r "gemini-2.5-pro" --include="*.py" --include="*.js" .
grep -r "gpt-4.1" --include="*.py" --include="*.js" .
grep -r "claude-sonnet" --include="*.py" --include="*.js" .
```

Update any hardcoded references found in:

- `populate_all.py` -- `select_model_gemini()` function has inline model names
- `sync-skills.py` -- `_fallback_estimate_complexity()` and fallback settings
- `convert_to_gems.py` -- may have inline defaults
- `convert_to_codex_responses.py` -- may have inline defaults

### Step 3: Verify `lib/platform_tuning.py` Imports

Open `lib/platform_tuning.py` and verify it imports the updated constants from `lib/config.py`:

```python
from lib.config import (
    CATEGORY_TEMPERATURES as CATEGORY_TEMPERATURE_MAP,
    GEMINI_MODELS,
    CODEX_MODELS as _CODEX_MODELS,
    CLAUDE_MODELS,
    GEMINI_HARM_CATEGORIES,
)
```

No changes needed here unless the import names changed.

### Step 4: Test

Run a single skill through conversion to verify the new model names appear in output:

```bash
export PYTHONIOENCODING=utf-8

# Test Gemini output
python sync-skills.py --skill technical/api-development --targets gemini
cat Gemini/GeminiSkills/gems/technical/api-development.json | grep model

# Test Codex output
python sync-skills.py --skill technical/api-development --targets codex
find Codex/CodexSkills -name "*api-development*" -exec grep -l "model" {} \;

# Test Claude output
python sync-skills.py --skill technical/api-development --targets claude
```

### Step 5: Full Re-sync

Once verified, re-sync all skills and regenerate bundles:

```bash
python sync-skills.py --targets all
python populate_all.py --phase bundles
```

---

## Complexity-to-Model Mapping Logic

The `estimate_complexity()` function in `lib/platform_tuning.py` determines which model tier a skill gets. It scores skills on:

| Factor | Scoring |
|--------|---------|
| Line count < 100 | +1 |
| Line count 100-300 | +2 |
| Line count > 300 | +3 |
| Section count > 5 | +1 |
| Section count > 10 | +2 |
| Has code blocks | +1 |
| Has templates (`{{...}}`) | +1 |
| Has framework keywords | +1 |

Score mapping:

| Score | Complexity | Typical Model (Gemini) | Typical Model (Codex) | Typical Model (Claude) |
|-------|-----------|----------------------|---------------------|----------------------|
| 0-2 | simple | gemini-2.5-flash | gpt-4.1-mini | claude-sonnet-4-5 |
| 3-5 | moderate | gemini-2.5-flash | gpt-4.1 | claude-sonnet-4-5 |
| 6+ | complex | gemini-2.5-pro | o4-mini | claude-opus-4-6 |

---

## Temperature Ranges

Temperatures are set per category in `lib/config.py` (`CATEGORY_TEMPERATURES`) and do not vary by model:

| Category | Temperature |
|----------|------------|
| technical | 0.3 |
| operations | 0.4 |
| industry | 0.4 |
| strategy | 0.5 |
| ai-agents | 0.5 |
| creative | 0.7 |

To adjust temperatures, edit `CATEGORY_TEMPERATURES` in `lib/config.py`.

---

## Related Documents

- [Config Reference](../07-reference/config-reference.md) -- full configuration details
- [Model Mappings](../07-reference/model-mappings.md) -- current model table
- [Pipeline Operations](pipeline-operations.md) -- running the full pipeline
