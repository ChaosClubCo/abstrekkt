# Extract Generator Prompt

## When This Runs

User has a completed brief and wants to extract a copy-paste prompt for v0,
AI Studio Build, or Claude Artifacts.

## Pre-Flight

1. Load the brief from `Briefs/`.
2. Run a quick completeness check (sections 1–7 filled, anti-slop gates passed).
   If incomplete, redirect to the check-brief.md reference guide first.

## Assembly Rules

### Structure

The generator prompt follows this exact skeleton:

```
Build a [product type] for [primary user] whose primary job is [primary job].

EXPERIENCE THESIS:
[First 5 seconds sentence from §2. Brand words. What this is NOT.]

VISUAL DIRECTION:
- Mood: [combination sentence from §3]
- Surface: [surface hex values from §4]
- Accent: [HSL value from §4] — [usage rule from §4]
- Text: [3-level hierarchy from §4]
- Type: [heading font] headings ([weight]), [body font] body ([weights]),
  [code font if applicable]. [Scale] scale — [specific sizes if defined].
- Layout: [nav model from §6], [primary layout], [max width],
  [sidebar decision from §6].

HARD RULES — do not break:
- [Generate from anti-slop gates — convert each to a negative constraint]
- Accent on max 10% of visible surface
- [Heading font] + [body font] only — no system fonts, no fallback
- Touch targets minimum 44px [64px for Kinsley]

THE ONE THING THAT MAKES THIS NOT GENERIC:
[Exact text from §2 — the one specific design decision]

[If AI content = yes:]
AI CONTENT STATES — required on every screen that shows AI output:
idle → processing (inline indicator) → streaming (cursor + partial text)
→ complete (result + confidence bar) → failed (specific error + recovery CTA)

BUILD — First screen:
[User describes what they want generated]
```

### Adaptation by Target

**v0 (Vercel):**
- Keep prompt under 2000 chars if possible — v0 performs better with concise prompts.
- Front-load the visual direction (v0 reads top-down and may truncate).
- Specify "use Tailwind CSS" and "use shadcn/ui components" if appropriate.

**AI Studio Build (Google):**
- Can handle longer prompts. Include full detail.
- Specify "Material Design 3" compatibility if needed, or explicitly say
  "Do NOT use Material Design defaults."

**Claude Artifacts:**
- Specify "single-file React component" or "single-file HTML."
- Include library constraints: "Only use Tailwind core utility classes."
- Reference available libraries (recharts, lucide-react, d3, etc.) if needed.

### Quality Gate

Before delivering the prompt, verify:
```
[ ] No vague language ("make it look good", "modern", "clean")
[ ] All hex/HSL values are specific numbers, not color names
[ ] Font names are exact (not "a geometric sans-serif")
[ ] HARD RULES section has at least 5 constraints
[ ] BUILD section describes a specific screen, not "the whole app"
[ ] The prompt would NOT work as-is for a completely different product
```

## Output

Deliver the prompt in a code block for easy copy-paste.
Note which generator it's optimized for.
Offer to adapt for a different generator if needed.
