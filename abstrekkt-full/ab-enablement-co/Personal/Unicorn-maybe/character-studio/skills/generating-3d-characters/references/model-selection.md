# Model Selection Guide

## Decision Table

| Use Case | Model | Size | Notes |
|---|---|---|---|
| New character render | dall-e-3 | 1024×1024 | Best prompt adherence, highest quality |
| Character variation (from text only) | dall-e-3 | 1024×1024 | Use delta description |
| Image edit (source file provided) | dall-e-2 | 1024×1024 | Only model supporting inpainting |
| Speed-priority draft | dall-e-3 | 1024×1024 | No smaller option in Style Lock spec |
| Batch (cost-sensitive) | dall-e-3 | 1024×1024 | One call per character; no bulk discount |

## Model Characteristics

### DALL-E 3
- Best instruction following — Style Lock constraints are reliably applied
- Handles complex outfit and personality descriptions accurately
- Cannot edit existing images (generates from text only)
- ~$0.04 per 1024×1024 image (standard quality)

### DALL-E 2
- Required for `chatgpt_openai_create_image_edit` (inpainting)
- Weaker prompt adherence — keep edit prompts simple and specific
- Pass only the delta (what changed) not the full character description in edit mode
- Lower quality than DALL-E 3 for new generations; avoid for first renders

## Cost Guidance

| Volume | Estimated Cost (DALL-E 3 standard) |
|---|---|
| Single render | ~$0.04 |
| 5-character batch | ~$0.20 |
| 10-character set | ~$0.40 |
| 4 variations per character (edit mode) | ~$0.16 |

Always confirm batch size with user before running; costs are approximate and subject to
OpenAI pricing changes. The Zapier action abstracts the API call — billing flows through
the user's OpenAI key via Zapier.

## Zapier Tool Reference

**Generate (new render):**
- Tool: `chatgpt_openai_generate_an_image`
- Required params: `prompt`, `model` (dall-e-3), `size` (1024x1024), `results_number` (1)
- Optional: `instructions` (system context), `output_hint` (filename hint)

**Edit (existing image):**
- Tool: `chatgpt_openai_create_image_edit`
- Required params: `image` (URL or path), `prompt` (delta only), `model` (dall-e-2), `size` (1024x1024), `n` (1–4)
- Note: `image` must be a PNG under 4MB with no transparent regions
