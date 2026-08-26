# Model Mappings

Current model names used per platform and complexity tier. All values are defined in `lib/config.py`.

---

## Complexity-Based Model Selection

Models are assigned based on the skill's computed complexity level. Complexity is determined by `estimate_complexity()` in `lib/platform_tuning.py`.

| Complexity | Gemini | Codex (OpenAI) | Claude |
|-----------|--------|---------------|--------|
| simple | gemini-2.5-flash | gpt-4.1-mini | claude-sonnet-4-5-20250929 |
| moderate | gemini-2.5-flash | gpt-4.1 | claude-sonnet-4-5-20250929 |
| complex | gemini-2.5-pro | o4-mini | claude-opus-4-6 |

Note: GitHub Copilot does not use model selection in the Skills Library. Copilot model assignment is handled by GitHub's infrastructure.

---

## Category-Based Model Selection (Codex Only)

Codex also has a category-level model map used by `populate_all.py` and `convert_to_codex_responses.py`:

| Category | Model |
|----------|-------|
| technical | gpt-4.1 |
| ai-agents | gpt-4.1 |
| strategy | o4-mini |
| creative | gpt-4.1 |
| operations | gpt-4.1-mini |
| industry | gpt-4.1 |

---

## Temperature by Category

Temperatures are applied across all platforms (Gemini, Codex, Claude) and do not vary by complexity:

| Category | Temperature | Rationale |
|----------|------------|-----------|
| technical | 0.3 | Precise, deterministic code and architecture outputs |
| operations | 0.4 | Structured workflows with some flexibility |
| industry | 0.4 | Domain accuracy with moderate variation |
| strategy | 0.5 | Balanced analytical and creative thinking |
| ai-agents | 0.5 | Balanced agent orchestration responses |
| creative | 0.7 | Expressive, varied creative outputs |

---

## Claude Max Tokens by Complexity

Claude outputs include a `max_tokens` setting based on complexity (defined in `lib/platform_tuning.py`):

| Complexity | max_tokens |
|-----------|-----------|
| simple | 4,096 |
| moderate | 8,192 |
| complex | 16,384 |

---

## Complexity Scoring

The `estimate_complexity()` function scores skills on multiple factors:

| Factor | Condition | Score |
|--------|----------|-------|
| Line count | < 100 lines | +1 |
| Line count | 100-300 lines | +2 |
| Line count | > 300 lines | +3 |
| Section count | > 5 headings | +1 |
| Section count | > 10 headings | +2 |
| Code blocks | Has ``` fences | +1 |
| Templates | Has `{{...}}` patterns | +1 |
| Framework refs | Contains "framework", "architecture", "pattern", "pipeline" | +1 |

Score-to-complexity mapping:

| Total Score | Complexity |
|------------|-----------|
| 0-2 | simple |
| 3-5 | moderate |
| 6+ | complex |

---

## Gemini Generation Settings

Beyond the model name, Gemini outputs include these generation parameters (set in `populate_all.py` and `convert_to_gems.py`):

| Parameter | Value |
|-----------|-------|
| `topP` | 0.95 |
| `topK` | 40 |
| `maxOutputTokens` | 8,192 |

---

## Where to Update

All model names are centralized in `lib/config.py`. To update:

1. Edit the relevant dict in `lib/config.py` (`GEMINI_MODELS`, `CODEX_MODELS`, `CLAUDE_MODELS`, or `CODEX_CATEGORY_MODELS`)
2. Search for hardcoded model names in `populate_all.py` and converter scripts
3. Test with a single skill: `python sync-skills.py --skill technical/api-development --targets all`
4. Re-sync all: `python sync-skills.py --targets all`

See [Model Updates](../06-admin-guide/model-updates.md) for the full procedure.

---

## Related Documents

- [Model Updates](../06-admin-guide/model-updates.md) -- step-by-step update procedure
- [Config Reference](config-reference.md) -- all configuration constants
