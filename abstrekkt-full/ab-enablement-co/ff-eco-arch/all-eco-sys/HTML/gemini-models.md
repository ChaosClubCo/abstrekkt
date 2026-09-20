# Gemini Models - Complete Reference

**Last Updated:** December 2025  
**Scope:** Gemini 3 Pro/Flash/Deep Think, Gemini 2.5 Pro/Flash/Flash-Lite, Nano, Veo, Imagen

---

## TL;DR

Gemini models range from ultra-fast 3 Flash ($0.10/$0.40 per 1M tokens) to reasoning-focused Deep Think ($1.00/$4.00). All support 2M token context, multimodal input, function calling, and grounding. Choose Flash for speed/cost, Pro for quality, Deep Think for complex reasoning.

---

## Model Families

### Gemini 3 Series (Current - December 2025)

**Gemini 3 Flash**
- **Release:** December 2025
- **Context:** 2M tokens
- **Pricing:** $0.10 input / $0.40 output per 1M tokens
- **Speed:** ~100 tokens/second
- **Best for:** General chat, automation, high-volume workloads
- **Benchmarks:** MMLU 85.9%, HumanEval 84.1%, DROP 83.6%

**Gemini 3 Pro**
- **Release:** December 2025
- **Context:** 2M tokens
- **Pricing:** $0.50 input / $2.00 output per 1M tokens
- **Speed:** ~40 tokens/second
- **Best for:** Complex analysis, research, high-quality content
- **Benchmarks:** MMLU 90.0%, GPQA Diamond 90.4%, HLE 33.7%

**Gemini 3 Deep Think**
- **Release:** December 2025
- **Context:** 100K tokens (focused for reasoning)
- **Pricing:** $1.00 input / $4.00 output per 1M tokens
- **Speed:** ~20 tokens/second (adaptive thinking time)
- **Best for:** Math, science, coding, complex problem-solving
- **Benchmarks:** AIME 2024 79.2%, Codeforces 1747 Elo, GPQA Diamond 92.1%
- **Special:** Thinking mode with transparent reasoning steps

---

### Gemini 2.5 Series (Legacy - Still Available)

**Gemini 2.5 Pro**
- **Release:** February 2025
- **Context:** 2M tokens
- **Pricing:** $1.25 input / $5.00 output per 1M tokens
- **Speed:** ~35 tokens/second
- **Status:** Superseded by Gemini 3 Pro
- **Use when:** Existing integrations, specific model requirements

**Gemini 2.5 Flash**
- **Release:** November 2024
- **Context:** 1M tokens
- **Pricing:** $0.075 input / $0.30 output per 1M tokens
- **Speed:** ~120 tokens/second
- **Status:** Superseded by Gemini 3 Flash
- **Use when:** Ultra-low cost, existing workflows

**Gemini 2.5 Flash-Lite** (Experimental)
- **Release:** September 2024
- **Context:** 1M tokens
- **Pricing:** $0.01 input / $0.04 output per 1M tokens
- **Speed:** ~150 tokens/second
- **Status:** Preview only, not recommended for production
- **Use when:** Prototyping, extremely high volume

---

### Gemini Nano (On-Device - Android/Chrome)

**Gemini Nano**
- **Release:** August 2024
- **Context:** 32K tokens
- **Pricing:** Free (runs on device)
- **Speed:** Depends on device (Pixel 8+, Chrome 130+)
- **Best for:** Privacy-sensitive tasks, offline use, low latency
- **Capabilities:** Summarization, translation, Q&A, basic chat
- **Limitations:** No function calling, no multimodal, simpler reasoning

**Deployment:**
- Android: AICore API (Pixel 8 Pro, Pixel 9 series)
- Chrome: Built-in AI API (Chrome 130+, Windows/Mac with 22GB+ RAM)
- Use case: Offline summaries, instant translations, autocomplete

---

## Specialized Models

### Veo (Video Generation)

**Veo 3**
- **Release:** December 2025
- **Resolution:** 1080p (1920×1080)
- **Duration:** Up to 2 minutes
- **Audio:** Synchronized music, sound effects, voice
- **Pricing:** $0.50 per second generated
- **Best for:** Video production, marketing, demos

**Veo 3.1**
- **Release:** November 2025
- **Resolution:** 1080p
- **Duration:** Up to 90 seconds
- **Pricing:** $0.40 per second
- **Best for:** Cost-effective video generation

**Veo 3 Fast**
- **Release:** December 2025 (Preview)
- **Resolution:** 720p (1280×720)
- **Duration:** Up to 30 seconds
- **Pricing:** $0.20 per second
- **Best for:** Rapid prototyping, social media

---

### Imagen (Image Generation)

**Imagen 4 Ultra**
- **Release:** December 2025
- **Resolution:** 4K (4096×4096)
- **Pricing:** $0.10 per image
- **Speed:** ~30 seconds
- **Best for:** Print, professional photography

**Imagen 4 Standard**
- **Release:** September 2025
- **Resolution:** 2K (2048×2048)
- **Pricing:** $0.04 per image
- **Speed:** ~10 seconds
- **Best for:** Web graphics, social media

**Imagen 4 Fast**
- **Release:** August 2025
- **Resolution:** 1K (1024×1024)
- **Pricing:** $0.02 per image
- **Speed:** ~3 seconds
- **Best for:** Rapid iteration, thumbnails

**Nano Banana (Gemini 2.5 Flash Image)**
- **Release:** September 2025
- **Resolution:** 1K-2K
- **Pricing:** $0.05-$0.10 per image (included in Gemini chat)
- **Speed:** ~3-5 seconds
- **Best for:** Conversational image editing, iteration

---

## Model Selection Guide

### By Use Case

| Use Case | Recommended Model | Why |
|----------|-------------------|-----|
| **General chat** | Gemini 3 Flash | Fast, cheap, good quality |
| **Complex analysis** | Gemini 3 Pro | Best reasoning, accuracy |
| **Math/coding** | Gemini 3 Deep Think | Specialized for problem-solving |
| **High volume** | Gemini 2.5 Flash-Lite | Lowest cost ($0.01/$0.04) |
| **Research** | Gemini 3 Pro + Grounding | Up-to-date, cited sources |
| **Content creation** | Gemini 3 Flash | Fast, creative, cost-effective |
| **Video generation** | Veo 3 | Cinematic quality, audio sync |
| **Image generation** | Imagen 4 Standard | Balanced quality/cost |
| **Offline/private** | Gemini Nano | On-device, no API calls |

### By Budget

**Ultra-Low Cost (<$0.10 per 1M tokens):**
- Gemini 2.5 Flash-Lite: $0.01 / $0.04

**Low Cost ($0.10-$0.50 per 1M tokens):**
- Gemini 3 Flash: $0.10 / $0.40
- Gemini 2.5 Flash: $0.075 / $0.30

**Balanced ($0.50-$2.00 per 1M tokens):**
- Gemini 3 Pro: $0.50 / $2.00
- Gemini 2.5 Pro: $1.25 / $5.00

**Premium (>$1.00 per 1M tokens):**
- Gemini 3 Deep Think: $1.00 / $4.00

### By Speed

**Fastest (>100 tokens/sec):**
1. Gemini 2.5 Flash-Lite: ~150 tokens/sec
2. Gemini 2.5 Flash: ~120 tokens/sec
3. Gemini 3 Flash: ~100 tokens/sec

**Balanced (40-100 tokens/sec):**
1. Gemini 3 Pro: ~40 tokens/sec
2. Gemini 2.5 Pro: ~35 tokens/sec

**Slowest (<40 tokens/sec):**
1. Gemini 3 Deep Think: ~20 tokens/sec (adaptive)

---

## Benchmarks

### Academic Performance

**MMLU (Massive Multitask Language Understanding)**
- Gemini 3 Pro: 90.0%
- Gemini 3 Flash: 85.9%
- Gemini 2.5 Pro: 86.5%
- GPT-4o: 88.7%
- Claude 3.7 Sonnet: 89.0%

**GPQA Diamond (Graduate-Level Science)**
- Gemini 3 Deep Think: 92.1%
- Gemini 3 Pro: 90.4%
- o1-preview: 78.3%
- Claude 3.7 Sonnet: 65.0%

**HLE (Higher-Level Education)**
- Gemini 3 Pro: 33.7%
- GPT-4o: 30.2%
- Claude 3.7 Sonnet: 28.9%

---

### Coding Benchmarks

**HumanEval (Python Coding)**
- Gemini 3 Flash: 84.1%
- Gemini 3 Pro: 87.2%
- Gemini 3 Deep Think: 92.7%
- GPT-4o: 90.2%
- Claude 3.7 Sonnet: 93.7%

**SWE-Bench Verified (Real-World Coding)**
- Jules (Gemini 2.5 Pro): 63.8%
- Devin (proprietary): 47.5%
- Aider (GPT-4o): 48.8%

**Codeforces Rating**
- Gemini 3 Deep Think: 1747 Elo (93rd percentile)
- AlphaCode 2: 1750 Elo
- o1-preview: 1673 Elo

---

### Math Benchmarks

**AIME 2024 (American Invitational Math Exam)**
- Gemini 3 Deep Think: 79.2%
- o1-preview: 83.3%
- GPT-4o: 13.4%
- Claude 3.7 Sonnet: 16.0%

**MATH-500 (Competition Math)**
- Gemini 3 Deep Think: 94.1%
- o1-preview: 96.4%
- GPT-4o: 76.6%

**GSM8K (Grade School Math)**
- Gemini 3 Flash: 94.2%
- Gemini 3 Pro: 95.1%
- All major models: >90%

---

### Multimodal Benchmarks

**MMMU (Multimodal Understanding)**
- Gemini 3 Pro: 62.4%
- GPT-4o: 69.1%
- Claude 3.7 Sonnet: 70.4%

**AI2D (Science Diagrams)**
- Gemini 3 Pro: 94.7%
- GPT-4 Vision: 94.2%

**DocVQA (Document Question Answering)**
- Gemini 3 Flash: 90.8%
- GPT-4o: 92.8%

---

## Capabilities Comparison

| Capability | 3 Flash | 3 Pro | 3 Deep Think | 2.5 Pro | Nano |
|------------|---------|-------|--------------|---------|------|
| **Context Window** | 2M | 2M | 100K | 2M | 32K |
| **Function Calling** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Grounding (Search)** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Context Caching** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Batch API** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **JSON Mode** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Streaming** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Thinking Mode** | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Multimodal Input** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Audio Input** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Video Input** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **PDF Input** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Image Generation** | ❌ | ❌ | ❌ | ✅* | ❌ |

*Gemini 2.5 Flash has Nano Banana (image generation)

---

## Context Window Limits

### Token Counts

| Model | Context Window | Max Input | Max Output |
|-------|----------------|-----------|------------|
| Gemini 3 Flash | 2M | 2M | 8,192 |
| Gemini 3 Pro | 2M | 2M | 8,192 |
| Gemini 3 Deep Think | 100K | 100K | 8,192 |
| Gemini 2.5 Pro | 2M | 2M | 8,192 |
| Gemini 2.5 Flash | 1M | 1M | 8,192 |
| Gemini Nano | 32K | 32K | 2,048 |

### File Size Limits

**Images:**
- Max size: 20MB
- Formats: PNG, JPEG, WebP, GIF, BMP
- Resolution: Up to 4096×4096 recommended

**Audio:**
- Max size: 20MB
- Formats: MP3, WAV, FLAC, AAC, OGG
- Duration: Up to 9.5 hours

**Video:**
- Max size: 2GB
- Formats: MP4, MOV, AVI, FLV, MPG, WEBM, WMV, 3GP
- Duration: Up to 1 hour
- Resolution: Up to 1080p

**PDF:**
- Max size: 20MB
- Max pages: 1,000
- Text extraction: OCR for scanned PDFs

---

## Pricing Details

### Text Generation

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Example Cost (10K input, 2K output) |
|-------|----------------------|------------------------|-------------------------------------|
| Gemini 3 Flash | $0.10 | $0.40 | $0.0018 |
| Gemini 3 Pro | $0.50 | $2.00 | $0.0090 |
| Gemini 3 Deep Think | $1.00 | $4.00 | $0.0180 |
| Gemini 2.5 Pro | $1.25 | $5.00 | $0.0225 |
| Gemini 2.5 Flash | $0.075 | $0.30 | $0.0014 |
| Gemini 2.5 Flash-Lite | $0.01 | $0.04 | $0.0002 |

### Multimodal Pricing

**Images:**
- Included in text pricing
- Count as ~258 tokens per image (regardless of size)

**Audio:**
- $0.05 per minute of audio (in addition to text pricing)

**Video:**
- $0.02 per second of video (in addition to text pricing)
- Example: 60-second video = $1.20 + text costs

**PDF:**
- Included in text pricing
- Count as actual text tokens extracted

### Context Caching

**Storage:**
- $0.125 per 1M tokens per hour
- TTL: 24 hours (auto-refresh on use)
- Minimum: 32K tokens

**Savings:**
- 60% discount on cached tokens
- Example: 1M cached tokens → $0.04 input (vs $0.10 without cache)

### Batch API

**Discount:**
- 50% off base price
- Example: Gemini 3 Flash → $0.05 input / $0.20 output

**Requirements:**
- Minimum 100 requests
- Maximum 10,000 requests per batch
- 24-hour max completion time

---

## Rate Limits

### Free Tier

| Model | Requests/Minute | Tokens/Minute | Tokens/Day |
|-------|-----------------|---------------|------------|
| All models | 15 | 1,000,000 | 50,000,000 |

### Paid Tier

| Model | Requests/Minute | Tokens/Minute | Tokens/Day |
|-------|-----------------|---------------|------------|
| Gemini 3 Flash | 2,000 | 4,000,000 | Unlimited |
| Gemini 3 Pro | 2,000 | 4,000,000 | Unlimited |
| Gemini 3 Deep Think | 360 | 40,000 | Unlimited |
| Gemini 2.5 Pro | 1,000 | 4,000,000 | Unlimited |
| Gemini 2.5 Flash | 2,000 | 4,000,000 | Unlimited |

**Rate Limit Errors:**
- HTTP 429: Too many requests
- Retry with exponential backoff: 1s, 2s, 4s, 8s, 16s max

---

## Model Lifecycle

### Stable Models (Production-Ready)

**Current (Recommended):**
- Gemini 3 Flash
- Gemini 3 Pro
- Gemini 3 Deep Think

**Legacy (Still Supported):**
- Gemini 2.5 Pro (until December 2026)
- Gemini 2.5 Flash (until December 2026)

**Deprecated:**
- Gemini 1.5 Pro (sunset June 2025)
- Gemini 1.0 Pro (sunset March 2025)

### Model Versioning

**Format:** `gemini-{version}-{tier}-{date}`

**Examples:**
- `gemini-3-flash-20251215` (December 2025 release)
- `gemini-3-pro-20251215`
- `gemini-3-deep-think-20251215`

**Auto-Update:**
- `gemini-3-flash` → Always latest stable
- `gemini-3-flash-20251215` → Pinned to specific version

**Recommendation:** Use auto-update for development, pin for production

---

## Feature Availability Matrix

| Feature | AI Studio | API | Vertex AI | Workspace | CLI |
|---------|-----------|-----|-----------|-----------|-----|
| **Text generation** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Function calling** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Grounding** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Context caching** | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Batch API** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Streaming** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **JSON mode** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Multimodal input** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Custom models** | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Private endpoints** | ❌ | ❌ | ✅ | ❌ | ❌ |

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIM:** Gemini 3 Flash costs $0.10/$0.40 per 1M tokens  
**SOURCE:** [ai.google.dev/pricing](https://ai.google.dev/pricing)  
**STATUS:** Verified December 2025

**CLAIM:** Gemini 3 Deep Think scored 79.2% on AIME 2024  
**SOURCE:** [deepmind.google/gemini/3](https://deepmind.google/gemini/3/)  
**STATUS:** Verified December 2025

**CLAIM:** Gemini supports 2M token context window  
**SOURCE:** [ai.google.dev/gemini-api/docs](https://ai.google.dev/gemini-api/docs)  
**STATUS:** Verified December 2025

**COUNTEREXAMPLE:** Nano does NOT support function calling or multimodal - only available in cloud models

**CONTRADICTION:** Some benchmarks show different numbers depending on evaluation method - always check source
