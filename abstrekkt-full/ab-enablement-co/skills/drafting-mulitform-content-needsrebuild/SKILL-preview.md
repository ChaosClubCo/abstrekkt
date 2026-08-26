---
name: drafting-multi-format-content
description: Draft production-ready content templates across video/audio scripts, threaded long-form social posts (LinkedIn/X threads, IG carousels), and FlashFusion Customization Service customer lifecycle templates. Use whenever the user asks to script a video, script a podcast, write a voice note, draft a thread, build a LinkedIn thread, build an X/Twitter thread, write a carousel, or generate customer-facing templates for custom orders (intake, quote, proof, production, shipping, fulfillment, post-sale). Also triggers on reorder template, customization intake, design brief, proof approval, rush order, bulk inquiry, order amendment, rejection letter, case study, testimonial request, Lyria prompt, Gemini audio prompt, voiceover script, explainer video, tutorial video, short-form video, Reels script, TikTok script, Shorts script, or any request to template content in these three formats. Do NOT use for short social captions, blog posts, KB articles, SOPs, or The Prompt newsletter editions — those are covered by other templates or are lane-specific. Specifically: the threaded-social templates here are DISTINCT from short-form social captions (too long for a caption) AND from blog long-form (different beat structure, thread cadence, engagement mechanics).
---

# Drafting multi-format content

Three template libraries in one skill. Each library has a different voice, structure, and acceptance criteria.

## When each library applies

| Format family | Use when | File |
|---|---|---|
| Video/audio scripts | The deliverable is spoken, narrated, or audio-first | `templates/video-audio.md` |
| Threaded long-form social | The deliverable is a multi-post thread on LinkedIn, X, Threads, or an IG carousel — longer than a caption, shorter and more episodic than a blog | `templates/threaded-social.md` |
| FlashFusion Customization Service | The deliverable is a customer-facing comm or form for a custom-order workflow (intake, quote, proof, production, shipping, post-sale) | `templates/ff-customization.md` |

## Scope gates before drafting

Before writing any template body, confirm three things:

1. **Lane.** Which of Kyle's lanes does this serve? (FlashFusion, chaosclub, The Prompt, Intinc, or a new lane.) Lane drives voice.
2. **Surface.** Where does this publish? (LinkedIn, X, Substack, Wix, internal.) Surface drives constraints.
3. **Persona.** Who reads it? (One of the 7 FF personas, a chaosclub subscriber, an Intinc client, a mixed public audience.) Persona drives density and jargon level.

If any of the three is missing, ask before drafting. Do not guess the lane from topic alone — a thread about AI agents could be FlashFusion (persona drop), The Prompt (ecosystem take), or chaosclub (never — wrong lane).

## Default guardrails (apply to every template in this skill)

Pulled from Kyle's established anti-sycophancy and anti-slop defaults. These are non-negotiable across all three libraries.

- **No hype adjectives.** No "game-changer," "revolutionary," "unlock," "leverage," "power of." If the claim needs a hype adjective to land, the claim isn't strong enough.
- **One claim per line in short-form, one argument per beat in long-form.** Stacked claims dilute each other.
- **Evidence before adjective.** If you want to call something fast, give the number.
- **No AI tells.** No "in today's fast-paced world," no "in conclusion," no "it's important to note," no triple-parallel structure ("it empowers, enables, and elevates"), no rhetorical "but here's the thing." These are AI-generation fingerprints.
- **Sentence case in titles and headings.** Never Title Case.
- **No emoji unless the platform demands it** (IG carousels, sometimes TikTok captions — see per-template notes). Never in Intinc or chaosclub. Sparingly in FF / The Prompt.
- **CLAIMS / GAPS footer on anything making testable claims.** Applies to opinion threads, case studies, post-mortems, and The Prompt INT tier. Skip on pure narrative (chaosclub voice notes) and procedural (FF forms).
- **[SOURCED] vs [GENERATED] labels on any piece citing data or claiming facts.**

See `references/voice-guardrails.md` for the full anti-slop checklist.

## How to use this skill

1. User describes what they want to template or draft.
2. Identify format family → open the matching template file.
3. Run the scope gates (lane, surface, persona).
4. Select the closest template by use-case match, not by name fit.
5. Fill slots. Apply default guardrails. Add lane-specific voice overrides from the template's voice notes.
6. Run the acceptance criteria listed on the template before returning.
7. Append CLAIMS / GAPS footer if the template makes claims.

## What this skill does NOT cover

- Short-form social captions (single post, <=280 chars on X, <=3 lines on LinkedIn) — these live in the lane-specific short templates from the main content template system.
- Blog long-form (single-author essay, single-URL, >800 words) — different beat structure, different platform constraints.
- KB articles, SOPs, runbooks — Intinc-only, covered separately.
- The Prompt newsletter editions — three-tier structure covered by the newsletter skill.
- Persona-specific product listings — Wix catalog templates live in the FlashFusion short-format library.
- Chaosclub lyric + liner note entries — different skill, needs the Firestore schema from `references/chaosclub-firestore-schema.md`.

## Related references

- `references/voice-guardrails.md` — full anti-slop checklist
- `references/chaosclub-firestore-schema.md` — finalized schema for chaosclub data model (used by the chaosclub voice-note template and for any chaosclub structured entry)
