# Prompt Scoring Rubric — building-character-prompts

8-dimension rubric for evaluating a CHARACTER_DESCRIPTION prompt before image generation.
Minimum passing score: 70/100. Prompts scoring below 70 are returned to the user with specific fixes.

---

## Scoring Dimensions

### D1 — WHO Completeness (15 points)

| Score | Criteria |
|-------|----------|
| 15 | Species + age bracket + archetype all present and unambiguous |
| 10 | Two of three present; third is inferable from context |
| 5 | Only one element present; significant ambiguity |
| 0 | WHO field missing entirely |

**Examiner note:** Archetype can be implicit ("a cheerful fox child" implies child archetype = kid sidekick/hero). Do not penalize clear implicit archetypes.

---

### D2 — TRAITS Specificity (15 points)

| Score | Criteria |
|-------|----------|
| 15 | At least 2 physical features AND 1 personality visual signal present |
| 10 | 2+ physical features OR personality signal, not both |
| 5 | Only 1 physical feature, no personality signal |
| 0 | TRAITS field missing or contains only abstract adjectives ("cute", "cool") |

**Penalty:** Deduct 3 points for each abstract adjective not translated to a visual equivalent (max −6).

---

### D3 — OUTFIT Coherence (15 points)

| Score | Criteria |
|-------|----------|
| 15 | Genre + garment + max 2 accessories; color palette ≤3 colors; no pure white |
| 10 | Genre + garment present; accessories or color palette incomplete |
| 5 | Garment mentioned but no genre or style context |
| 0 | OUTFIT missing or only "cool clothes" / equally vague |

**Penalty:** Deduct 5 points if pure white outfit is specified (Style Lock conflict).

---

### D4 — EXPRESSION Precision (15 points)

| Score | Criteria |
|-------|----------|
| 15 | Both face expression and body posture phrases present; no face-blocking poses |
| 10 | Face expression present; body posture missing or generic ("standing") |
| 5 | Expression described abstractly ("looks happy") without face phrase |
| 0 | EXPRESSION field missing |

**Penalty:** Deduct 5 points for any pose that blocks the face (hand over mouth, looking away, crouching).

---

### D5 — PROPS Validity (10 points)

| Score | Criteria |
|-------|----------|
| 10 | Max 2 props; each prop is role-appropriate, sized appropriately, no text elements |
| 7 | Props present but one is ambiguous in color or size |
| 3 | More than 2 props listed |
| 0 | Props field absent (acceptable — field is optional; score 10 if field explicitly omitted) |

**Note:** If no props are included, score this dimension 10/10 — absence is valid and often preferable.

---

### D6 — Style Lock Compatibility (15 points)

| Score | Criteria |
|-------|----------|
| 15 | No conflicts with any of the 6 Style Lock constraints |
| 10 | 1 minor conflict present (e.g., slight pose ambiguity) — flagged but not blocking |
| 5 | 1 major conflict (e.g., specific background color requested, non-Pixar style named) |
| 0 | 2+ conflicts or direct contradiction of Style Lock (e.g., "photorealistic", "dark background") |

**Style Lock constraints (from style-lock-spec.md):**
1. White background — no alternatives
2. Soft studio lighting — no dramatic shadows
3. Full body visible — no bust crops
4. Character centered — no extreme off-center framing
5. Slight 3/4 angle — no full frontal or full profile only
6. Pixar/Disney 3D style — no anime, pixel art, or photorealism

---

### D7 — Prompt Length (10 points)

| Score | Criteria |
|-------|----------|
| 10 | Final assembled prompt is 80–200 words |
| 7 | 60–79 words (slightly thin) or 201–250 words (slightly long) |
| 3 | Below 60 words or 251–300 words |
| 0 | Below 40 words or over 300 words |

**Examiner note:** Count words in the user-facing CHARACTER_DESCRIPTION only, before the Style Lock block is appended. The Style Lock block adds approximately 45 words and is not scored.

---

### D8 — Originality and Distinctiveness (5 points)

| Score | Criteria |
|-------|----------|
| 5 | Character has at least 1 distinguishing detail that separates it from a generic version of the archetype |
| 3 | Generic archetype with no distinguishing detail — functional but forgettable |
| 0 | Appears to be a copy of a named IP character (e.g., "Simba from Lion King") |

**Penalty:** Deduct 5 points if a named copyrighted character is referenced without sufficient transformation.

---

## Score Thresholds

| Score | Outcome |
|-------|---------|
| 90–100 | ✅ PASS — Excellent. Deliver with confidence. |
| 70–89 | ✅ PASS — Good. Minor issues noted in delivery. |
| 50–69 | ⚠️ ADVISORY PASS — Functional but weak. Deliver with specific improvement suggestions. |
| 0–49 | ❌ FAIL — Return to user with required fixes before proceeding. |

---

## Score Report Format

When delivering the prompt package, include the score report in this format:

```
## Prompt Score: [SCORE]/100 — [PASS / ADVISORY PASS / FAIL]

| Dimension | Score | Max | Notes |
|-----------|-------|-----|-------|
| D1 WHO Completeness | _ | 15 | |
| D2 TRAITS Specificity | _ | 15 | |
| D3 OUTFIT Coherence | _ | 15 | |
| D4 EXPRESSION Precision | _ | 15 | |
| D5 PROPS Validity | _ | 10 | |
| D6 Style Lock Compatibility | _ | 15 | |
| D7 Prompt Length | _ | 10 | |
| D8 Originality | _ | 5 | |
| **TOTAL** | **_** | **100** | |

**Issues requiring action:**
- [List each issue with its dimension and fix]

**Issues advisory only (no fix required):**
- [List minor notes]
```

---

## Common Failure Patterns and Fixes

| Failure | Dimension | Typical score loss | Fix |
|---------|-----------|-------------------|-----|
| "Photorealistic" in prompt | D6 | −15 | Remove; add "Pixar/Disney 3D render style" |
| Abstract adjectives only in TRAITS | D2 | −10 | Translate to visual specifics |
| Pure white outfit | D3 | −5 | Change to off-white, ivory, or cream |
| Face-blocking pose | D4 | −5 | Replace with open-stance pose |
| 3+ props | D5 | −7 | Cut to 2; keep most role-distinctive |
| Named copyrighted IP | D8 | −5 | Remove name; retain descriptors |
| Prompt over 300 words | D7 | −10 | Trim; move detail to TRAITS and OUTFIT |

