# Install Guide — Gemini Custom Instructions & Gems

This kit targets **Google Gemini** (Gemini Apps personalization and Gems), not Claude.

## 1. Where each artifact goes

| Artifact | Surface in Gemini | How to get there |
|---|---|---|
| `instructions/01-personal-context-SAFE.md` | **Saved info** ("Your instructions for Gemini") | gemini.google.com → Settings → **Saved info** → paste → **Save** |
| `instructions/02-personal-context-COMPREHENSIVE.md` | A **custom Gem** (too long for Saved info) | Explore Gems → New Gem → paste into Instructions |
| `instructions/03-four-part-framework-GEM.md` | Template for any **custom Gem** | Explore Gems → New Gem |
| `gems/super-gems.md` | One **Gem each** | Explore Gems → New Gem → paste Name + Instructions → **Preview** → **Save** |

> Saved info personalizes *every* chat. Gems are task-specific assistants you select before chatting.

## 2. Character limit (important)

- The Saved info field has a **practical limit observed around ~1,500 characters** (varies by tier/region; not officially documented).
- `01-personal-context-SAFE.md` is sized to ~1,450 chars to fit.
- If you exceed it, Gemini may show **"Something went wrong (3)"** with no length message. Trim, then re-save. See `SAFETY-FILTER-FIXES.md`.

## 3. Pro vs Ultra tier (source-reported snapshot — verify before relying)

| | **Pro — $19.99/mo** | **Ultra — $29.99/mo** |
|---|---|---|
| Prompts | ~1,500/day | Unlimited |
| Context window | ~128k | **1M tokens** |
| Deep Research | ~5 reports/mo | Unlimited |
| Image generation | ~100/day | Unlimited |
| Audio overviews | ~20/mo | Unlimited |
| Model access | Gemini 2.5 Pro | Gemini 3 Pro early access |

Source: chat `0204f841`. Pricing/quotas drift — confirm at the current Google One / Gemini pricing page.

## 4. Memory mechanics (so you know what the instructions actually do)

- **Saved info + chat history** personalize tone/preferences and recall past context. They do **not** enlarge the token window — a single prompt still must fit input + output + retrieved content within the cap.
- Toggle Saved info and Gemini Apps Activity on/off in Settings at any time.

## 5. Install checklist

1. [ ] Paste `01-personal-context-SAFE.md` into Saved info → Save (confirm no error).
2. [ ] Run the two validation prompts in `VALIDATION.md`.
3. [ ] Create the Gems you'll actually use (start with Codebase Scaffolder, Automation Creator, Security Auditor).
4. [ ] **Preview each Gem** before saving (use the right-side preview box).
5. [ ] Organize Gems into categories: Engineering / Documentation / Security / Automation / Operations.
6. [ ] Edit stack/role/company specifics to your own (avoid over-fitting to the source author).

## 6. Workspace ecosystem usage

In chat prompts, tag the source you want Gemini to act on:
- `@Gmail` — email analysis, summaries, triage (Gemini's strongest integration).
- `@Drive` — document search/processing.
- `@Calendar` — scheduling/time.
- Use **NotebookLM** for multi-source synthesis, **Deep Research** for analysis, **AI Studio** for prototyping.

The instructions tell Gemini to *prefer* these; you still tag at prompt time.
