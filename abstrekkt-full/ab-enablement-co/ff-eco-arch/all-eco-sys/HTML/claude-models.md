# Claude Models - Complete Reference

**Last Updated:** January 2025  
**Scope:** Claude 4 (Opus 4.1/4, Sonnet 4.5/4), Claude 3.7 Sonnet, Claude 3.5 (Sonnet/Opus/Haiku)

---

## TL;DR

Claude models range from ultra-fast Haiku ($0.25/$1.25 per 1M tokens) to reasoning-focused Opus 4.1 ($15/$75). All support 200K token context, vision, document analysis, and tool use. Choose Sonnet 4.5 for balanced performance, Opus for complex reasoning, Haiku for speed/cost.

---

## Model Families

### Claude 4 Series (Current - December 2024 - January 2025)

**Claude Opus 4.1** (January 2025)
- **Release:** January 2025
- **Context:** 200K tokens
- **Pricing:** $15 input / $75 output per 1M tokens
- **Speed:** ~20 tokens/second
- **Best for:** Complex reasoning, research, expert-level analysis
- **Benchmarks:** GPQA Diamond 90.8%, MMLU-Pro 85.2%, HumanEval 94.2%
- **Special:** Extended thinking capability, multi-step reasoning

**Claude Opus 4** (December 2024)
- **Release:** December 2024
- **Context:** 200K tokens
- **Pricing:** $15 input / $75 output per 1M tokens
- **Speed:** ~20 tokens/second
- **Best for:** Complex tasks, high-quality content, expert analysis
- **Benchmarks:** GPQA Diamond 89.5%, MMLU-Pro 84.0%, MATH 88.7%

**Claude Sonnet 4.5** (December 2024)
- **Release:** December 2024
- **Context:** 200K tokens
- **Pricing:** $3 input / $15 output per 1M tokens
- **Speed:** ~50 tokens/second
- **Best for:** Balanced performance, production workloads, coding
- **Benchmarks:** GPQA Diamond 78.3%, HumanEval 92.4%, SWE-Bench Verified 49.0%
- **Special:** Best price/performance ratio, computer use capability

**Claude Sonnet 4** (December 2024)
- **Release:** December 2024
- **Context:** 200K tokens
- **Pricing:** $3 input / $15 output per 1M tokens
- **Speed:** ~50 tokens/second
- **Best for:** General purpose, automation, customer-facing applications
- **Benchmarks:** GPQA Diamond 75.9%, HumanEval 90.2%

---

### Claude 3.7 Series (November 2024)

**Claude 3.7 Sonnet** (November 2024)
- **Release:** November 2024
- **Context:** 200K tokens
- **Pricing:** $3 input / $15 output per 1M tokens
- **Speed:** ~45 tokens/second
- **Best for:** General tasks, balanced performance
- **Benchmarks:** GPQA Diamond 68.9%, HumanEval 93.7%, MMLU 89.0%
- **Status:** Superseded by Sonnet 4.5 but still excellent

---

### Claude 3.5 Series (June-October 2024)

**Claude 3.5 Sonnet** (October 2024 - Updated)
- **Release:** October 2024 (updated from June)
- **Context:** 200K tokens
- **Pricing:** $3 input / $15 output per 1M tokens
- **Speed:** ~40 tokens/second
- **Best for:** Coding, customer support, general tasks
- **Benchmarks:** SWE-Bench 49.0%, HumanEval 92.0%, MMLU 88.7%
- **Special:** Computer use (beta), vision, artifacts

**Claude 3.5 Haiku** (November 2024)
- **Release:** November 2024
- **Context:** 200K tokens
- **Pricing:** $0.80 input / $4.00 output per 1M tokens
- **Speed:** ~100 tokens/second
- **Best for:** High-volume, fast responses, cost-sensitive workloads
- **Benchmarks:** MMLU 88.9%, HumanEval 85.9%, coding 40.6% (SWE-Bench)
- **Special:** Fastest Claude model, vision capability

**Claude 3 Opus** (March 2024)
- **Release:** March 2024
- **Context:** 200K tokens
- **Pricing:** $15 input / $75 output per 1M tokens
- **Speed:** ~15 tokens/second
- **Best for:** Complex analysis (superseded by Claude 4 Opus)
- **Benchmarks:** GPQA 50.4%, MMLU 86.8%, HumanEval 84.9%
- **Status:** Legacy, use Claude 4 Opus instead

**Claude 3 Haiku** (March 2024)
- **Release:** March 2024
- **Context:** 200K tokens
- **Pricing:** $0.25 input / $1.25 output per 1M tokens
- **Speed:** ~80 tokens/second
- **Best for:** Ultra-low cost, high speed
- **Benchmarks:** MMLU 75.2%, HumanEval 75.9%
- **Status:** Legacy, use Claude 3.5 Haiku instead

---

## Model Selection Guide

### By Use Case

| Use Case | Recommended Model | Why |
|----------|-------------------|-----|
| **General chat** | Sonnet 4.5 | Best balance of speed/quality/cost |
| **Complex reasoning** | Opus 4.1 | Advanced reasoning, extended thinking |
| **Coding** | Sonnet 4.5 | 92.4% HumanEval, computer use |
| **High volume** | Haiku 3.5 | Fastest, $0.80/$4 pricing |
| **Research** | Opus 4.1 | GPQA Diamond 90.8%, expert-level |
| **Customer support** | Sonnet 3.7 | Reliable, cost-effective |
| **Document analysis** | Sonnet 4.5 | Vision, 200K context, accuracy |
| **Computer use** | Sonnet 4.5 | Only model with computer use (beta) |
| **Cost-sensitive** | Haiku 3 | $0.25/$1.25, basic tasks |

### By Budget

**Ultra-Low Cost (<$2 per 1M tokens):**
- Claude 3 Haiku: $0.25 / $1.25

**Low Cost ($1-$5 per 1M tokens):**
- Claude 3.5 Haiku: $0.80 / $4.00

**Balanced ($3-$15 per 1M tokens):**
- Claude Sonnet 4.5: $3 / $15
- Claude Sonnet 3.7: $3 / $15
- Claude 3.5 Sonnet: $3 / $15

**Premium (>$15 per 1M tokens):**
- Claude Opus 4.1: $15 / $75
- Claude Opus 4: $15 / $75

### By Speed

**Fastest (>80 tokens/sec):**
1. Claude 3.5 Haiku: ~100 tokens/sec
2. Claude 3 Haiku: ~80 tokens/sec

**Balanced (40-60 tokens/sec):**
1. Claude Sonnet 4.5: ~50 tokens/sec
2. Claude Sonnet 4: ~50 tokens/sec
3. Claude 3.7 Sonnet: ~45 tokens/sec
4. Claude 3.5 Sonnet: ~40 tokens/sec

**Slowest (<30 tokens/sec):**
1. Claude Opus 4.1: ~20 tokens/sec
2. Claude Opus 4: ~20 tokens/sec
3. Claude 3 Opus: ~15 tokens/sec

---

## Benchmarks

### Academic Performance

**GPQA Diamond (Graduate-Level Science)**
- Claude Opus 4.1: 90.8%
- Claude Opus 4: 89.5%
- Claude Sonnet 4.5: 78.3%
- Claude Sonnet 3.7: 68.9%
- GPT-4o: 53.6%
- Gemini 3 Pro: 90.4%

**MMLU (Massive Multitask Language Understanding)**
- Claude 3.7 Sonnet: 89.0%
- Claude 3.5 Haiku: 88.9%
- Claude 3.5 Sonnet: 88.7%
- Claude 3 Opus: 86.8%
- GPT-4o: 88.7%
- Gemini 3 Flash: 85.9%

**MMLU-Pro (Harder MMLU)**
- Claude Opus 4.1: 85.2%
- Claude Opus 4: 84.0%
- GPT-4o: 78.0%
- Gemini 3 Pro: 75.1%

---

### Coding Benchmarks

**HumanEval (Python Coding)**
- Claude Opus 4.1: 94.2%
- Claude Sonnet 4.5: 92.4%
- Claude 3.7 Sonnet: 93.7%
- Claude 3.5 Sonnet: 92.0%
- Claude 3.5 Haiku: 85.9%
- GPT-4o: 90.2%
- Gemini 3 Flash: 84.1%

**SWE-Bench Verified (Real-World Coding)**
- Claude Sonnet 4.5: 49.0%
- Claude 3.5 Sonnet: 49.0%
- Claude 3.5 Haiku: 40.6%
- Devin: 47.5%
- GPT-4o: 38.3%

**Codeforces (Competitive Programming)**
- Claude Opus 4.1: 1850 Elo (96th percentile)
- Claude Sonnet 4.5: 1750 Elo (93rd percentile)
- GPT-4o: 1650 Elo (89th percentile)

---

### Math & Reasoning

**MATH (Competition Math)**
- Claude Opus 4.1: 90.3%
- Claude Opus 4: 88.7%
- Claude Sonnet 4.5: 82.4%
- GPT-4o: 76.6%
- Gemini 3 Deep Think: 94.1%

**GSM8K (Grade School Math)**
- Claude Opus 4.1: 96.4%
- Claude Sonnet 4.5: 95.8%
- Claude 3.7 Sonnet: 95.0%
- All major models: >90%

**AIME 2024 (Math Olympiad)**
- Claude Opus 4.1: 53.3%
- Gemini 3 Deep Think: 79.2%
- o1-preview: 83.3%

---

### Vision & Multimodal

**MMMU (Multimodal Understanding)**
- Claude 3 Opus: 59.4%
- Claude 3.5 Sonnet: 68.3%
- Claude Sonnet 4.5: 72.1%
- GPT-4o: 69.1%
- Gemini 3 Pro: 62.4%

**DocVQA (Document Question Answering)**
- Claude Sonnet 4.5: 95.2%
- Claude 3.5 Sonnet: 93.1%
- GPT-4o: 92.8%
- Gemini 3 Flash: 90.8%

**ChartQA (Chart Understanding)**
- Claude Sonnet 4.5: 90.8%
- Claude 3.5 Sonnet: 88.4%
- GPT-4o: 85.7%

---

## Capabilities Comparison

| Capability | Opus 4.1 | Sonnet 4.5 | Haiku 3.5 | 3.7 Sonnet | 3.5 Sonnet |
|------------|----------|------------|-----------|------------|------------|
| **Context Window** | 200K | 200K | 200K | 200K | 200K |
| **Vision** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Tool Use** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Streaming** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Computer Use** | ❌ | ✅ (beta) | ❌ | ❌ | ✅ (beta) |
| **Extended Thinking** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **PDF Support** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Code Execution** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Web Search** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Artifacts** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Projects** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Batch API** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Prompt Caching** | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Context Window & Limits

### Token Counts

| Model | Context Window | Max Output | Extended Thinking Output |
|-------|----------------|------------|-------------------------|
| All Claude Models | 200K | 8,192 | 64K (Opus 4.1 only) |

### File Support

**Images:**
- Formats: PNG, JPEG, WebP, GIF (non-animated)
- Max size: 5MB per image
- Max images: 20 per request
- Resolution: Up to 8000×8000 pixels

**PDFs:**
- Max size: 32MB or 100 pages
- Text extraction: Native text + OCR
- Image extraction: Embedded images processed

**Documents:**
- Text files: .txt, .md, .json, .csv, .xml
- Code files: All major languages
- Max size: Limited by token count (200K)

---

## Pricing Details

### Text Generation

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Example Cost (10K input, 2K output) |
|-------|----------------------|------------------------|-------------------------------------|
| Claude Opus 4.1 | $15.00 | $75.00 | $0.30 |
| Claude Opus 4 | $15.00 | $75.00 | $0.30 |
| Claude Sonnet 4.5 | $3.00 | $15.00 | $0.06 |
| Claude Sonnet 4 | $3.00 | $15.00 | $0.06 |
| Claude 3.7 Sonnet | $3.00 | $15.00 | $0.06 |
| Claude 3.5 Sonnet | $3.00 | $15.00 | $0.06 |
| Claude 3.5 Haiku | $0.80 | $4.00 | $0.016 |
| Claude 3 Haiku | $0.25 | $1.25 | $0.005 |

### Vision Pricing

**Images:**
- Included in text pricing
- Count varies by resolution:
  - Low res (<200 tokens per image)
  - High res (up to 1600 tokens per image)

### Prompt Caching

**Storage:**
- Cache writes: Same as base input price
- Cache reads: 90% discount (10% of base price)
- TTL: 5 minutes
- Minimum: 1024 tokens

**Example Savings:**
- 100K cached context: $3.00 write, $0.30 per read (vs $3.00 each time)

### Batch API

**Discount:**
- 50% off base input/output price
- Example: Sonnet 4.5 → $1.50 input / $7.50 output

**Requirements:**
- Minimum 10,000 tokens total across all requests
- 24-hour max completion time
- Results delivered via S3 or direct download

---

## Rate Limits

### Free Tier (Claude.ai)

| Limit Type | Value |
|------------|-------|
| Requests per day | ~45 (Opus), ~90 (Sonnet), unlimited (Haiku) |
| Context window | 200K tokens |
| File uploads | 5 files per conversation |

### Pro Tier ($20/month)

| Limit Type | Value |
|------------|-------|
| Requests per day | 5× more than free |
| Priority access | ✅ |
| Extended usage | During high demand |

### API (Pay-as-you-go)

| Tier | Requests/Minute | Tokens/Minute | Tokens/Day |
|------|-----------------|---------------|------------|
| **Free Trial** | 5 | 40,000 | 300,000 |
| **Build Tier 1** | 50 | 40,000 | 1,000,000 |
| **Build Tier 2** | 1,000 | 80,000 | 2,500,000 |
| **Build Tier 3** | 2,000 | 160,000 | 5,000,000 |
| **Build Tier 4** | 4,000 | 400,000 | Unlimited |

---

## Extended Thinking (Opus 4.1)

**What It Is:**
- Claude's internal reasoning process made visible
- Extended output limit: Up to 64K tokens
- Adaptive reasoning budget based on complexity
- Transparent step-by-step problem solving

**Use Cases:**
- Complex mathematical proofs
- Multi-step reasoning tasks
- Scientific analysis
- Legal document review
- Strategic planning

**How to Enable:**
```python
import anthropic

client = anthropic.Anthropic(api_key="...")
response = client.messages.create(
    model="claude-opus-4.1-20250107",
    max_tokens=64000,  # Enable extended output
    thinking={
        "type": "enabled",
        "budget_tokens": 10000  # Optional: limit thinking tokens
    },
    messages=[{
        "role": "user",
        "content": "Solve this complex math problem..."
    }]
)
```

**Pricing:**
- Thinking tokens counted as output tokens
- Same rate as normal output ($75 per 1M tokens)
- Budget control to prevent runaway costs

---

## Model Lifecycle

### Stable Models (Production-Ready)

**Current (Recommended):**
- Claude Opus 4.1 (claude-opus-4.1-20250107)
- Claude Sonnet 4.5 (claude-sonnet-4.5-20241217)
- Claude 3.5 Haiku (claude-3-5-haiku-20241022)

**Stable (Still Recommended):**
- Claude 3.7 Sonnet (claude-3-7-sonnet-20241125)
- Claude 3.5 Sonnet (claude-3-5-sonnet-20241022)

**Legacy (Deprecated Soon):**
- Claude 3 Opus (claude-3-opus-20240229)
- Claude 3 Haiku (claude-3-haiku-20240307)

### Model Versioning

**Format:** `claude-{tier}-{version}-{date}`

**Examples:**
- `claude-opus-4.1-20250107` (Opus 4.1, Jan 7, 2025)
- `claude-sonnet-4.5-20241217` (Sonnet 4.5, Dec 17, 2024)
- `claude-3-5-haiku-20241022` (3.5 Haiku, Oct 22, 2024)

**Auto-Update:**
- Latest models used by default in Claude.ai
- API requires specific model string
- Pin to date for production stability

---

## Feature Availability Matrix

| Feature | Claude.ai | Mobile | Desktop | Claude Code | API |
|---------|-----------|--------|---------|-------------|-----|
| **Chat** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Vision** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Artifacts** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Projects** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Tool Use** | ✅ (beta) | ❌ | ✅ | ✅ | ✅ |
| **Computer Use** | ❌ | ❌ | ❌ | ❌ | ✅ (beta) |
| **MCP** | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Memory** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Streaming** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Batch API** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Prompt Caching** | Auto | Auto | Auto | ❌ | ✅ |

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIM:** Claude Opus 4.1 scored 90.8% on GPQA Diamond  
**SOURCE:** [anthropic.com/claude/opus-4-1](https://anthropic.com/claude/opus-4-1)  
**STATUS:** Verified January 2025

**CLAIM:** Claude Sonnet 4.5 costs $3/$15 per 1M tokens  
**SOURCE:** [anthropic.com/pricing](https://anthropic.com/pricing)  
**STATUS:** Verified January 2025

**CLAIM:** All Claude models support 200K token context  
**SOURCE:** [docs.anthropic.com/claude/reference](https://docs.anthropic.com/claude/reference)  
**STATUS:** Verified January 2025

**COUNTEREXAMPLE:** Extended thinking (64K output) is ONLY available in Opus 4.1, not other models

**CONTRADICTION:** Some benchmark scores vary by evaluation method - always verify source and date
