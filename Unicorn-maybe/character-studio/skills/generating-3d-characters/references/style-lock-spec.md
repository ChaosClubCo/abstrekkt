# Style Lock Specification

The Style Lock defines six immutable render constraints enforced on every image generation
call. These constraints exist to ensure output is immediately usable in product contexts
without post-processing.

## Constraint Detail

### 1. Background: Pure White
- Value: `#FFFFFF`, no gradients, no drop shadows, no floor reflection
- Why: Characters must be compositable onto any brand surface
- Edge case: If user requests "transparent background", generate white and note that
  removal requires a separate tool (not in scope for this skill)

### 2. Lighting: Soft Studio
- Value: Even, diffuse illumination from slightly above and front
- Why: Eliminates harsh shadows that obscure outfit or expression detail
- Edge case: "Dramatic lighting" requests should be declined — redirect to white studio

### 3. Framing: Full Body, Centered
- Value: Head to feet visible, character occupies 60–70% of frame height
- Why: Characters used for merchandise, UI, and marketing need full silhouette
- Edge case: If DALL-E crops the legs, add "full body, feet visible" to prompt and regenerate

### 4. Angle: Slight 3/4 Turn
- Value: Character faces 10–20° off dead-center, toward viewer's left or right
- Why: 3/4 angle conveys depth and personality better than flat front view
- Edge case: Never generate a pure profile (90°) — always some face visible

### 5. Aesthetic: Pixar/Disney 3D
- Value: Smooth plastic-like surfaces, large expressive eyes, clean geometric forms
- Why: Style is immediately recognizable, on-brand for child-safe and family products
- Edge case: "Anime style", "realistic", "flat 2D" requests — redirect to the appropriate
  style, inform user this skill is Pixar/Disney 3D only

### 6. Output: 1024×1024, No Text
- Value: Square format, no embedded labels, titles, or UI chrome
- Why: Square is compositable to any aspect ratio; text in image is not editable
- Edge case: Never add character name or brand name as image text — deliver those as
  separate metadata in the report

## Violation Recovery

| Violation | Recovery Action |
|---|---|
| Gray or gradient background | Add "pure white background, no shadows, no gradients" explicitly |
| Cropped at waist | Add "full body visible, feet on ground" |
| Dead-on front angle | Add "slight 3/4 angle, turned slightly to viewer's right" |
| Text appears in render | Add "no text, no labels, no captions" |
| Wrong style (anime, realistic) | Add "Pixar/Disney 3D animation style, smooth surfaces, expressive cartoon eyes" |
