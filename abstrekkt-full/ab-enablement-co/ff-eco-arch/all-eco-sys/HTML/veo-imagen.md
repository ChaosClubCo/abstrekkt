# Veo & Imagen - Video & Image Generation Guide

**Last Updated:** December 2025  
**Scope:** Veo 3/3.1/3 Fast, Imagen 4, Nano Banana (Gemini 2.5 Flash Image)

---

## TL;DR

**Veo** is Google's video generation model (1080p, synchronized audio, up to 2 minutes). **Imagen** is the text-to-image model (photorealistic, stylized, editing). **Nano Banana** (Gemini 2.5 Flash Image) enables iterative image editing within Gemini conversations. All three offer production-ready quality for creative workflows.

---

## Veo - Video Generation

### Model Variants

**Veo 3** (December 2025)
- **Resolution:** 1080p (1920×1080)
- **Duration:** Up to 2 minutes
- **Audio:** Synchronized music, sound effects, voice
- **Quality:** Photorealistic, cinematic
- **Use case:** High-quality video production

**Veo 3.1** (November 2025)
- **Resolution:** 1080p
- **Duration:** Up to 90 seconds
- **Audio:** Music, ambient sounds
- **Quality:** Improved coherence, better motion
- **Use case:** Marketing videos, demos

**Veo 3 Fast** (Preview - December 2025)
- **Resolution:** 720p (1280×720)
- **Duration:** Up to 30 seconds
- **Audio:** Basic soundtrack
- **Speed:** 5× faster generation
- **Use case:** Rapid prototyping, social media

---

### Capabilities

**Video Styles:**
- Photorealistic (documentary, news)
- Cinematic (film-like, bokeh, lighting)
- Animated (cartoon, 3D, stop-motion)
- Abstract (artistic, experimental)

**Camera Controls:**
- Pan, tilt, zoom
- Dolly in/out
- Aerial shots
- First-person POV
- Time-lapse

**Audio Features:**
- **Synchronized sound:** Footsteps match movement, doors close with sound
- **Music generation:** Background scores, mood-matched
- **Voice:** Basic dialogue (experimental)
- **Sound effects:** Ambient, foley, action sounds

**Editing:**
- Extend clips (add 10-60s to existing video)
- Modify elements (change color, add objects)
- Style transfer (apply artistic style to video)

---

### How to Use

**Access:**
- [Google AI Test Kitchen](https://aitestkitchen.withgoogle.com) (preview)
- [Vertex AI](https://cloud.google.com/vertex-ai) (enterprise)
- API (limited beta)

**Generate Video:**
```
1. Go to AI Test Kitchen → Veo
2. Enter text prompt:
   "A golden retriever running through a sunflower field at sunset, 
    cinematic camera following from behind, warm lighting, gentle breeze"
3. Select:
   - Model: Veo 3
   - Duration: 10 seconds (start short)
   - Audio: Enabled
   - Aspect ratio: 16:9
4. Click "Generate"
5. Wait ~5-10 minutes
6. Review, download, or regenerate
```

**API (Preview):**
```python
from google.cloud import aiplatform

aiplatform.init(project="your-project-id")

video = aiplatform.VideoGenerationModel("veo-3")
result = video.generate(
    prompt="A serene lake at dawn with mist rising",
    duration_seconds=10,
    audio=True,
    aspect_ratio="16:9"
)

video_url = result.video_url
print(f"Video: {video_url}")
```

---

### Prompting Best Practices

**Good Prompts:**
```
✅ "Close-up of raindrops on window, camera slowly pulls back to reveal 
   cityscape, soft piano music"
   
✅ "Time-lapse of flower blooming over 24 hours, warm sunlight, 
   bees visiting, natural sounds"
   
✅ "Aerial drone shot circling around mountain peak at sunrise, 
   dramatic clouds, epic orchestral music"
```

**Poor Prompts:**
```
❌ "Cool video" (too vague)
❌ "Make a video about nature" (no specifics)
❌ "Video with lots of action" (unclear what action)
```

**Prompt Formula:**
```
[Subject] + [Action] + [Setting] + [Camera movement] + [Lighting] + [Audio style]

Example:
Subject: "A chef"
Action: "plating a gourmet dish"
Setting: "in a modern kitchen"
Camera: "overhead shot, slowly zooming in"
Lighting: "soft natural light from window"
Audio: "gentle cooking sounds, sizzling"

Final: "A chef plating a gourmet dish in a modern kitchen, overhead shot 
slowly zooming in, soft natural light from window, gentle cooking sounds and sizzling"
```

---

### Pricing

| Model | Duration | Resolution | Price |
|-------|----------|------------|-------|
| **Veo 3** | 2 min max | 1080p | $0.50/second generated |
| **Veo 3.1** | 90s max | 1080p | $0.40/second |
| **Veo 3 Fast** | 30s max | 720p | $0.20/second |

**Examples:**
- 10-second Veo 3 clip: $5.00
- 30-second Veo 3 Fast: $6.00
- 60-second Veo 3.1: $24.00

**Free Tier (AI Test Kitchen):**
- 10 generations per day
- Max 10 seconds each
- 720p resolution

---

### Limitations

**Content Restrictions:**
- No real public figures (celebrities, politicians)
- No copyrighted characters (Disney, Marvel, etc.)
- No harmful/violent content
- No sexually explicit content
- No misinformation (fake news, deepfakes)

**Technical Limits:**
- Max 2 minutes per generation
- No frame-by-frame control
- Limited text rendering (avoid text in videos)
- Occasional physics inconsistencies
- Audio may not perfectly match for complex actions

---

## Imagen 4 - Image Generation

### Model Variants

**Imagen 4 Ultra** (December 2025)
- **Resolution:** 4K (4096×4096)
- **Quality:** Photorealistic, high detail
- **Speed:** ~30 seconds
- **Price:** $0.10 per image
- **Use case:** Print, professional photography

**Imagen 4 Standard** (September 2025)
- **Resolution:** 2K (2048×2048)
- **Quality:** Balanced quality/speed
- **Speed:** ~10 seconds
- **Price:** $0.04 per image
- **Use case:** Web graphics, social media

**Imagen 4 Fast** (August 2025)
- **Resolution:** 1K (1024×1024)
- **Quality:** Good, optimized for speed
- **Speed:** ~3 seconds
- **Price:** $0.02 per image
- **Use case:** Rapid iteration, thumbnails

---

### Capabilities

**Styles:**
- Photorealistic (camera-like)
- Digital art (concept art, matte painting)
- Oil painting, watercolor, sketch
- 3D render (Blender, Unreal Engine style)
- Anime, manga, comic book
- Vintage (70s, 80s, retro)

**Features:**
- Text rendering (readable text in images)
- Fine details (textures, reflections, shadows)
- Accurate hands, faces (improved over v3)
- Complex compositions (multiple subjects, depth)
- Inpainting (edit specific regions)
- Outpainting (extend image beyond borders)
- Style transfer (apply style to existing image)

---

### How to Use

**Access:**
- [ImageFX](https://aitestkitchen.withgoogle.com/tools/image-fx) (web UI)
- [Vertex AI](https://cloud.google.com/vertex-ai) (API)
- Google AI Studio (integrated)

**Generate Image:**
```
1. Go to ImageFX
2. Enter prompt:
   "A cozy coffee shop on a rainy evening, warm lighting through windows,
    people reading books, steam rising from coffee cups, illustrated style"
3. Select:
   - Model: Imagen 4 Standard
   - Aspect ratio: 1:1 (square), 16:9 (landscape), 9:16 (portrait)
   - Safety filter: Medium
4. Click "Generate"
5. Wait ~10 seconds
6. Download, regenerate, or edit
```

**API:**
```python
from google.cloud import aiplatform

model = aiplatform.ImageGenerationModel("imagen-4-standard")
response = model.generate_images(
    prompt="Futuristic cityscape at night, neon lights, flying cars",
    number_of_images=4,
    aspect_ratio="16:9"
)

for i, image in enumerate(response.images):
    image.save(f"cityscape_{i}.png")
```

---

### Prompting Best Practices

**Good Prompts:**
```
✅ "Portrait of elderly woman with kind eyes, wrinkles showing wisdom,
   soft natural lighting, Rembrandt style, oil painting"
   
✅ "Isometric view of fantasy tavern interior, wooden furniture,
   glowing lanterns, adventurers gathered around table, warm colors"
   
✅ "Product photo of sleek smartphone on marble surface, studio lighting,
   reflections visible, minimalist composition, professional photography"
```

**Prompt Structure:**
```
[Subject] + [Details] + [Style] + [Lighting] + [Composition] + [Quality modifiers]

Subject: "Mountain landscape"
Details: "snow-capped peaks, alpine lake, pine forest"
Style: "National Geographic photography"
Lighting: "golden hour, dramatic clouds"
Composition: "wide angle, rule of thirds"
Quality: "8K, sharp focus, vivid colors"

Final: "Mountain landscape with snow-capped peaks, alpine lake, and pine forest,
National Geographic photography style, golden hour lighting with dramatic clouds,
wide angle composition following rule of thirds, 8K resolution, sharp focus, vivid colors"
```

---

### Editing Features

**Inpainting (Edit Region):**
```
1. Upload image
2. Select area to edit (mask)
3. Describe change: "Replace flower with butterfly"
4. Generate
```

**Outpainting (Extend):**
```
1. Upload image
2. Extend canvas (left, right, up, down)
3. Describe what to add: "More sky with clouds"
4. Generate
```

**Style Transfer:**
```
1. Upload photo
2. Select style: "Van Gogh Starry Night"
3. Adjust strength (0-100%)
4. Generate
```

---

### Pricing

| Model | Resolution | Price | Speed |
|-------|------------|-------|-------|
| **Imagen 4 Ultra** | 4K (4096×4096) | $0.10/image | ~30s |
| **Imagen 4 Standard** | 2K (2048×2048) | $0.04/image | ~10s |
| **Imagen 4 Fast** | 1K (1024×1024) | $0.02/image | ~3s |

**Batch Discounts:**
- 100-1,000 images: 10% off
- 1,000-10,000 images: 20% off
- 10,000+ images: 30% off

**Free Tier (ImageFX):**
- 100 images per day
- Standard quality
- Watermarked

---

## Nano Banana (Gemini 2.5 Flash Image)

### What It Is

**Nano Banana** = Gemini 2.5 Flash with image generation/editing
- **Integrated:** Works inside Gemini chat
- **Iterative:** Edit images through conversation
- **Multimodal:** Combine text + image generation
- **Fast:** Real-time adjustments

---

### Use Cases

**Iterative Design:**
```
User: "Generate a logo for coffee shop called 'Morning Brew'"
[Nano Banana generates logo]
User: "Make the text brown and add a coffee cup icon"
[Nano Banana edits logo]
User: "Perfect! Now create a matching business card"
[Nano Banana creates card design]
```

**Image Analysis + Generation:**
```
User: [uploads sketch] "Turn this sketch into a polished illustration"
[Nano Banana generates clean version]
User: "Add color, vintage poster style"
[Nano Banana applies style]
```

**Data Visualization:**
```
User: "Create infographic showing climate change data from 1900-2024"
[Nano Banana generates chart]
User: "Make it more colorful and add icons for key events"
[Nano Banana refines]
```

---

### How to Use

**In Gemini Chat:**
```
1. Open Gemini (gemini.google.com)
2. Type: "Generate an image of [description]"
3. Review result
4. Continue conversation to refine:
   - "Change the color to blue"
   - "Add a sunset in background"
   - "Make it more realistic"
   - "Create a variation with different composition"
```

**API:**
```python
import google.generativeai as genai

model = genai.GenerativeModel("gemini-2.5-flash-image")
response = model.generate_content("Create logo for tech startup")

# Image is included in response
for part in response.parts:
    if hasattr(part, 'inline_data'):
        image_data = part.inline_data.data
        with open("logo.png", "wb") as f:
            f.write(image_data)
```

---

### Pricing

**Included in Gemini:**
- Free tier: 10 image generations per day
- AI Pro ($19.99/mo): 100 images/day
- AI Ultra ($249.99/mo): 500 images/day

**API Pricing:**
- $0.05 per image (input to generate)
- $0.10 per image (output from model)

---

## Comparison Matrix

| Feature | Veo 3 | Imagen 4 | Nano Banana |
|---------|-------|----------|-------------|
| **Medium** | Video | Image | Image |
| **Quality** | Cinematic | Photorealistic | Good |
| **Speed** | 5-10 min | 10-30s | 3-5s |
| **Resolution** | 1080p | Up to 4K | 1K-2K |
| **Editing** | Limited | Inpaint, outpaint | Conversational |
| **Audio** | ✅ Synced | ❌ | ❌ |
| **Iteration** | Regenerate | Edit tools | Chat-based |
| **Price** | $0.50/sec | $0.02-$0.10 | $0.05-$0.10 |
| **Best For** | Video production | Print, web | Quick iterations |

---

## Best Practices

### For Video (Veo)
1. **Start short:** 5-10 seconds, then extend
2. **Specific actions:** "Walking toward camera" vs "moving"
3. **Camera language:** Use film terms (dolly, pan, close-up)
4. **Audio cues:** Mention sounds you want synchronized
5. **Iterate:** Generate multiple versions, pick best

### For Images (Imagen/Nano Banana)
1. **Detail matters:** More descriptive = better results
2. **Style references:** Mention artists, movements, mediums
3. **Lighting:** Specify time of day, mood, direction
4. **Composition:** Rule of thirds, symmetry, depth
5. **Iterate:** Use Nano Banana for quick adjustments

### Quality Control
1. **Review outputs:** Check for artifacts, physics errors
2. **Multiple generations:** Try 3-5 variations
3. **Combine tools:** Imagen for static, Veo for motion
4. **Post-process:** Use editing software for final polish
5. **Test at scale:** Verify quality before bulk generation

---

## Safety & Content Policy

**Prohibited Content:**
- Real people (celebrities, politicians, private individuals)
- Copyrighted characters (without license)
- Violence, gore, shocking content
- Sexual/NSFW content
- Misinformation (fake news, deepfakes)
- Harmful stereotypes

**Allowed:**
- Original characters
- Historical figures (educational context)
- Generic people (not resembling real individuals)
- Artistic nudity (classical art style, non-sexual)
- Fictional violence (cartoon, fantasy, clearly not real)

**Watermarking:**
- All generated content includes SynthID (invisible watermark)
- Detectable by Google tools
- Helps prevent misuse, deepfakes

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIM:** Veo 3 supports up to 2 minutes of video  
**SOURCE:** [blog.google/technology/ai/veo-3](https://blog.google/technology/ai/veo-3/)  
**STATUS:** Verified December 2025

**CLAIM:** Imagen 4 produces 4K resolution (Ultra tier)  
**SOURCE:** [blog.google/technology/ai/imagen-4](https://blog.google/technology/ai/imagen-4/)  
**STATUS:** Verified December 2025

**CLAIM:** Nano Banana is Gemini 2.5 Flash with image generation  
**SOURCE:** [deepmind.google/gemini/2.5](https://deepmind.google/gemini/2.5/)  
**STATUS:** Verified September 2025

**COUNTEREXAMPLE:** Veo cannot generate videos with readable text - avoid text-heavy scenes

**CONTRADICTION:** Some sources list different Veo pricing - always verify current rates at [ai.google.dev/pricing](https://ai.google.dev/pricing)
