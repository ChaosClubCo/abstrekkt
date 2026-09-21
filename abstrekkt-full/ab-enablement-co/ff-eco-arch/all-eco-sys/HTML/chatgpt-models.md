# ChatGPT Models Guide

**Last Updated:** December 2025  
**Scope:** Model families, capabilities, benchmarks, selection guidance

---

## Model Families Overview

OpenAI offers 6 active model families as of December 2025:

| Family | Latest Version | Context Window | Knowledge Cutoff | Primary Use Case |
|--------|---------------|----------------|------------------|------------------|
| **GPT-4o** | gpt-4o | 128,000 tokens | June 2024 | Fast general-purpose tasks |
| **GPT-5** | gpt-5.2 | 196,000 tokens | October 2024 | Professional work, complex reasoning |
| **o-series** | o3, o4-mini | 200,000 tokens | December 2024 | Deep reasoning, math, code |
| **GPT-4.1** | gpt-4.1 | 1,000,000 tokens | October 2024 | Long-context tasks, API-only |
| **Codex** | gpt-5.2-codex | 196,000 tokens | October 2024 | Autonomous coding, refactoring |
| **Sora** | sora-2 | N/A | N/A | Video generation (separate guide) |

**Deprecated Models:**
- GPT-4 → Retired April 2025 (replaced by GPT-4o)
- GPT-3.5 → Deprecated July 2025
- GPT-4.5 → Research preview deprecated July 2025 (superseded by GPT-4.1)
- o1, o1-mini → Deprecated November 2024 (replaced by o3/o4-mini)
- o3-mini → Deprecated January 2025 (replaced by o4-mini)

---

## GPT-4o (Omni)

### Overview
Fast, general-purpose model balancing speed and intelligence. Default for most ChatGPT users.

**Key Specs:**
- **Context:** 128,000 tokens (~96,000 words)
- **Output:** Up to 16,384 tokens
- **Knowledge Cutoff:** June 2024
- **Modalities:** Text, image input/output, audio (Advanced Voice)
- **Training:** Reinforcement learning from human feedback (RLHF)

### Capabilities
- Conversational AI (all topics)
- Image analysis and generation (DALL·E integration)
- Code writing and debugging (basic to intermediate)
- Web search with citations
- Document summarization (PDFs, images)
- Multilingual (50+ languages)
- Advanced Voice (natural intonation, real-time)

### Performance Benchmarks
- **MMLU:** 88.7% (general knowledge)
- **HumanEval:** 92.0% (Python coding)
- **DROP:** 83.4% (reading comprehension)
- **MATH:** 76.6% (grade-school math)
- **Multilingual:** 85.5% average (MGSM benchmark)

### Use Cases
✅ **Best for:**
- Customer support chatbots
- Content creation (blogs, emails, social media)
- Quick code generation (scripts, utilities)
- Image description and generation
- Voice assistants
- Rapid prototyping

❌ **Not ideal for:**
- Complex multi-step reasoning (use o3/o4-mini)
- Long-context documents >100k tokens (use GPT-4.1)
- Production code refactoring (use Codex)
- Research-grade math proofs (use o3-pro)

### Pricing
- **ChatGPT Free:** Limited (~20 messages per 3 hours)
- **ChatGPT Plus:** 80 messages per 3 hours ($20/month)
- **ChatGPT Pro:** Unlimited ($200/month)
- **API:** $2.50/1M input tokens, $10/1M output tokens

---

## GPT-5 Series

### GPT-5 Instant (gpt-5-instant)
**Fast variant for low-latency tasks.**

- **Context:** 196,000 tokens
- **Speed:** ~2x faster than GPT-5
- **Use Cases:** Real-time chat, quick queries, streaming responses
- **Availability:** Plus, Pro, Team, Business, Enterprise

### GPT-5 Auto (gpt-5-auto)
**Adaptive routing between GPT-5 and GPT-5 Instant.**

- **Behavior:** Automatically selects speed vs intelligence based on query complexity
- **Context:** 196,000 tokens
- **Use Cases:** General-purpose applications with variable complexity
- **Availability:** Plus, Pro, Team, Business, Enterprise

### GPT-5 Thinking (gpt-5-thinking)
**Extended reasoning variant with visible chain-of-thought.**

- **Context:** 196,000 tokens
- **Reasoning:** Shows internal reasoning steps (similar to o3)
- **Speed:** Slower than GPT-5 (10-30s for complex queries)
- **Use Cases:** Educational content, transparent decision-making, debugging logic
- **Availability:** Plus, Pro, Team, Business, Enterprise

### GPT-5.1 Pro (gpt-5.1-pro)
**Enhanced version for business workflows.**

- **Context:** 196,000 tokens
- **Improvements:** 15% better on business tasks (emails, reports, presentations)
- **Specialization:** Professional writing, data analysis, business logic
- **Availability:** Pro, Team, Business, Enterprise only

### GPT-5.2 (gpt-5.2)
**Most capable GPT-5 variant (December 2025 flagship).**

- **Context:** 196,000 tokens
- **Knowledge Cutoff:** October 2024
- **Improvements:**
  - 23% better on MMLU vs GPT-5
  - 18% improvement on coding benchmarks
  - Enhanced instruction-following
  - Better context retention at max window
- **Availability:** Pro, Team, Business, Enterprise only

**Benchmarks:**
- **MMLU:** 92.1% (state-of-the-art general knowledge)
- **HumanEval:** 94.8% (coding)
- **GPQA Diamond:** 78.2% (PhD-level science)
- **SimpleQA:** 47.3% (factual accuracy)

**API Pricing:**
- Input: $30/1M tokens
- Output: $120/1M tokens
- Batch (50% discount): $15/$60 per 1M tokens

---

## o-series (Reasoning Models)

### Overview
Specialized models using chain-of-thought reasoning for complex tasks. Spend more time "thinking" before responding.

### o3 (default reasoning model)
**Released:** December 2024  
**Training:** Reinforcement learning + self-play

**Key Specs:**
- **Context:** 200,000 tokens
- **Reasoning:** Up to 30 seconds for complex queries
- **Specialization:** Math, science, code, logic puzzles

**Benchmarks:**
- **AIME 2024:** 96.7% (math competition, human expert ~40%)
- **GPQA Diamond:** 87.7% (20% better than o1)
- **Codeforces:** 2727 Elo (89th percentile competitive programming)
- **SWE-bench Verified:** 71.7% (real-world GitHub issues)
- **Error Reduction:** 20% fewer mistakes than o1 on MMLU

**Use Cases:**
✅ Research-level math and science
✅ Competitive programming
✅ Complex debugging (multi-file codebases)
✅ Theorem proving
✅ Multi-step logical reasoning

**Availability:** Plus, Pro, Team, Business, Enterprise  
**API Pricing:** $15/1M input, $60/1M output

### o3-pro
**Enhanced reasoning model with 3 compute tiers.**

- **Low Compute:** Similar to o3 (faster, lower cost)
- **Medium Compute:** Default (balanced)
- **High Compute:** Extended reasoning (2-5 min for hardest queries)

**Benchmarks (High Compute):**
- **AIME 2024:** 96.7% (near-perfect)
- **GPQA Diamond:** 87.7%
- **Frontier Math:** 25.2% (vs 2.0% for o3, human PhD ~30%)
- **Codeforces:** 2727 Elo

**Use Cases:**
✅ Cutting-edge research (math, physics, CS theory)
✅ Novel algorithm design
✅ Proof verification
✅ Hardest competitive programming problems

**Availability:** Pro, Team, Business, Enterprise only  
**Pricing:** Included in Pro ($200/month), metered for API (TBD)

### o4-mini
**Fast reasoning model optimized for cost and speed.**

**Released:** December 2024 (replaces o3-mini, o1-mini)

**Key Specs:**
- **Context:** 200,000 tokens
- **Speed:** 5-10x faster than o3 (1-5 seconds reasoning)
- **Cost:** ~80% cheaper than o3

**Benchmarks:**
- **AIME 2024:** 74.8% (still exceeds human average)
- **AIME 2025:** 77.5% (best o-series performance on new test)
- **GPQA Diamond:** 72.3%
- **HumanEval:** 96.2% (beats o3 on coding)
- **Codeforces:** 2013 Elo (75th percentile)

**Use Cases:**
✅ Production reasoning tasks (customer support, technical Q&A)
✅ Code review and testing
✅ STEM tutoring (high school to undergrad level)
✅ Rapid prototyping with reasoning
✅ Scheduled tasks requiring reasoning

**Availability:** Plus, Pro, Team, Business, Enterprise  
**API Pricing:** $1.10/1M input, $4.40/1M output

---

## GPT-4.1 Series (Long-Context Specialist)

### Overview
API-only models with 1M token context window. Ideal for document processing and long-context tasks.

**Released:** October 2024  
**Availability:** API only (not in ChatGPT UI)

### GPT-4.1 (gpt-4.1)
**Flagship long-context model.**

- **Context:** 1,000,000 tokens (~750,000 words)
- **Output:** Up to 64,000 tokens
- **Knowledge Cutoff:** October 2024

**Benchmarks:**
- **SWE-bench Verified:** 57.0% (industry leader for coding)
- **HumanEval:** 95.3%
- **Long Context:** 87% accuracy on 1M token retrieval (RULER benchmark)
- **Instruction Following:** 18% better than GPT-4o

**Use Cases:**
✅ Entire codebase analysis (150k+ lines of code)
✅ Legal document review (contracts, case law)
✅ Academic research (multiple papers, books)
✅ Enterprise knowledge base Q&A
✅ Long conversation histories (500+ turn dialogues)

**API Pricing:**
- Input: $3/1M tokens
- Output: $15/1M tokens
- Cached input (50% discount): $1.50/1M tokens

### GPT-4.1-mini (gpt-4.1-mini)
**Cost-effective long-context variant.**

- **Context:** 1,000,000 tokens
- **Output:** Up to 64,000 tokens
- **Speed:** 2x faster than GPT-4.1

**Use Cases:**
✅ High-volume document processing
✅ Customer support with full ticket history
✅ Knowledge retrieval from large corpuses

**API Pricing:**
- Input: $0.40/1M tokens
- Output: $1.60/1M tokens

### GPT-4.1-nano (gpt-4.1-nano)
**Ultra-fast, ultra-cheap long-context model.**

- **Context:** 1,000,000 tokens
- **Output:** Up to 8,000 tokens
- **Speed:** 5x faster than GPT-4.1

**Use Cases:**
✅ Batch document classification
✅ Embedding generation from long texts
✅ Simple extraction from long contexts

**API Pricing:**
- Input: $0.15/1M tokens
- Output: $0.60/1M tokens

---

## Codex (Autonomous Coding Agents)

### GPT-5.2-Codex (default)
**Flagship coding model with context compaction and Windows support.**

**Released:** December 2024

**Key Features:**
- **Context Compaction:** Intelligently summarizes old conversation turns to stay within limits
- **Windows Support:** Native Windows compatibility (not just WSL)
- **Cybersecurity:** Enhanced vulnerability detection and secure coding patterns
- **Long Refactors:** Handles 10k+ line refactoring tasks

**Benchmarks:**
- **SWE-bench Verified:** 68.3% (vs 57% for GPT-4.1)
- **HumanEval:** 97.1%
- **Agentic Coding:** 15min average task completion (vs 25min for GPT-5-Codex)

**Availability:** Codex CLI, Codex IDE, Codex Cloud  
**API Pricing:** Same as GPT-5.2 ($30/$120 per 1M tokens)

### GPT-5-Codex
**General-purpose coding model.**

- **Context:** 196,000 tokens
- **Use Cases:** Standard development tasks, code review, debugging

**Benchmarks:**
- **SWE-bench Verified:** 63.2%
- **HumanEval:** 95.8%

### GPT-5-Codex-Mini
**Fast, cost-effective coding model.**

- **Context:** 128,000 tokens
- **Speed:** 3x faster than GPT-5-Codex
- **Use Cases:** Quick code generation, syntax completion, simple debugging

**Benchmarks:**
- **HumanEval:** 91.4%
- **Speed:** <5s for most tasks

**API Pricing:** $10/$40 per 1M tokens (estimated)

---

## Model Selection Guide

### Decision Tree

```
START: What's your primary task?

├─ Conversational AI / General queries
│  ├─ Free tier → GPT-4o (limited)
│  └─ Paid tier → GPT-5 Auto (adaptive) or GPT-4o (fast)

├─ Complex reasoning (math, logic, proofs)
│  ├─ Research-grade → o3-pro (high compute)
│  ├─ Standard complexity → o3
│  └─ Production/Cost-sensitive → o4-mini

├─ Coding
│  ├─ Autonomous agent (refactoring, multi-file) → GPT-5.2-Codex
│  ├─ Code review, debugging → GPT-5-Codex or o3
│  ├─ Quick scripts → GPT-4o or GPT-5-Codex-Mini
│  └─ Long codebase analysis → GPT-4.1

├─ Long documents (>100k tokens)
│  ├─ API access → GPT-4.1 (1M context)
│  ├─ Cost-sensitive → GPT-4.1-mini
│  └─ ChatGPT UI → GPT-5.2 or o3 (split document)

├─ Professional work (reports, analysis)
│  ├─ Business users → GPT-5.1-Pro or GPT-5.2
│  └─ General users → GPT-5 Auto

└─ Real-time / Voice
   └─ Advanced Voice → GPT-4o
```

### Feature Comparison Matrix

| Feature | GPT-4o | GPT-5.2 | o3 | o4-mini | GPT-4.1 | Codex |
|---------|--------|---------|----|---------|---------| ------|
| **Speed** | ⚡⚡⚡ | ⚡⚡ | ⚡ | ⚡⚡ | ⚡⚡ | ⚡⚡ |
| **Reasoning** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Coding** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Context** | 128k | 196k | 200k | 200k | 1M | 196k |
| **Cost (API)** | $ | $$$ | $$ | $ | $$ | $$$ |
| **Voice** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Image Input** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Image Output** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Web Search** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **ChatGPT Free** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **ChatGPT Plus** | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ |
| **ChatGPT Pro** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **API** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Advanced Capabilities

### Multimodal Support

**Image Input (All Models):**
- Max size: 20MB
- Formats: PNG, JPEG, WEBP, GIF (non-animated)
- Resolution: Up to 4096x4096
- Use cases: Document analysis, diagram interpretation, photo description

**Image Output (GPT-4o, GPT-5.x only):**
- DALL·E 3 integration
- Resolution: 1024x1024, 1024x1792, 1792x1024
- Styles: Natural, vivid
- Quality: Standard, HD
- Limits: 50 images/day (Plus), 100/day (Pro)

**Audio Input/Output (GPT-4o only):**
- Advanced Voice mode
- Languages: English, Spanish, French, German, Portuguese, Italian, Japanese, Korean, Mandarin
- Latency: <500ms (real-time)
- Use cases: Voice assistants, accessibility, language learning

### Web Search Integration

**All Models Support:**
- Real-time web search (Bing API)
- Citation-backed responses
- Image search (when relevant)
- News integration
- Automatic triggering (when knowledge cutoff is limiting)

**Best Practices:**
- Enable by default for current events
- Verify citations before relying on search results
- Use for fact-checking model responses

### Function Calling / Tool Use

**Supported Models:** All (GPT-4o, GPT-5.x, o-series, GPT-4.1, Codex)

**Capabilities:**
- Parallel function calling (up to 10 simultaneous)
- Structured output (JSON schema enforcement)
- Tool choice: Auto, None, Required, Specific function
- Streaming support

**Common Use Cases:**
- Database queries
- API integrations (weather, stock prices, CRM)
- Calculator functions
- External knowledge bases

---

## Rate Limits & Quotas

### ChatGPT Web/App

| Plan | GPT-4o | GPT-5.x | o3 | o4-mini | Codex |
|------|--------|---------|----|---------| ------|
| **Free** | 20 msgs/3hrs | N/A | N/A | N/A | N/A |
| **Plus** | 80 msgs/3hrs | N/A | 50 msgs/day | Unlimited | Included |
| **Pro** | Unlimited | Unlimited | Unlimited | Unlimited | Unlimited |
| **Team** | 100 msgs/3hrs | 50 msgs/3hrs | 100 msgs/day | Unlimited | Included |
| **Enterprise** | Custom | Custom | Custom | Unlimited | Unlimited |

**Notes:**
- Limits reset every 3 hours (GPT-4o) or daily (o3)
- Image generation counts toward message limits
- Advanced Voice has separate 15min/day limit (Plus), unlimited (Pro)

### API Rate Limits

**Tier-based system (auto-upgraded based on spend):**

| Tier | Spend | RPM (GPT-4o) | RPM (o3) | TPM (GPT-4.1) |
|------|-------|--------------|----------|---------------|
| **Free** | $0 | 3 | N/A | N/A |
| **Tier 1** | $5 | 500 | 100 | 2M |
| **Tier 2** | $50 | 5,000 | 500 | 10M |
| **Tier 3** | $1,000 | 10,000 | 1,000 | 50M |
| **Tier 4** | $5,000 | 80,000 | 5,000 | 300M |
| **Tier 5** | $50,000 | 10,000/day | 10,000 | 5B/day |

**Batch API:**
- 50% cost discount
- 24-hour completion window
- No rate limits (within daily quotas)
- Ideal for: Data labeling, content moderation, large-scale analysis

---

## Fine-Tuning Support

### Available Models
- **GPT-4o:** Full fine-tuning (supervised + DPO)
- **GPT-5.2:** Coming Q1 2026
- **o4-mini:** Coming Q2 2026
- **GPT-4.1:** Supervised fine-tuning only

### Methods

**Supervised Fine-Tuning (SFT):**
- Train on input-output examples
- Min dataset: 10 examples (recommend 50-100)
- Use cases: Domain adaptation, style transfer, instruction following

**Direct Preference Optimization (DPO):**
- Train on ranked outputs (preferred vs rejected)
- Min dataset: 25 pairs (recommend 100+)
- Use cases: Alignment, safety, output quality

### Pricing
- **Training:** $25/1M tokens (GPT-4o), $35/1M (GPT-5.2)
- **Inference:** 3x base model price
- **Storage:** $10/model/month

**Example:** Fine-tuned GPT-4o costs $7.50/$30 per 1M tokens (vs $2.50/$10 base)

---

## Safety & Alignment

### Content Filtering

**Moderation API (free):**
- Detects: Hate, harassment, self-harm, sexual, violence
- Scores: 0-1 for each category
- Latency: <100ms
- Use for: User input filtering, output validation

**Categories:**
- `hate` - Content promoting hate based on identity
- `harassment` - Bullying, intimidation
- `self-harm` - Suicide, self-injury
- `sexual` - Sexual content (not including education)
- `sexual/minors` - Sexual content involving minors (strictly prohibited)
- `violence` - Graphic violence, gore
- `violence/graphic` - Extremely graphic violence

### Refusal Behavior

**Models refuse to:**
- Generate illegal content (CSAM, bioweapons, explosives)
- Impersonate real individuals (deepfakes, identity theft)
- Provide medical/legal advice without disclaimers
- Bypass safety measures (jailbreaking attempts)
- Generate spam or malicious code

**Models allow:**
- Educational content (chemistry, history, controversial topics)
- Creative fiction (violence in storytelling context)
- Professional use cases (security research, red teaming with context)
- Sensitive topics with appropriate framing

### Red Teaming

**Availability:** Enterprise customers only

**Process:**
1. Submit use case to OpenAI Trust & Safety
2. Receive authorization token
3. Test against adversarial prompts
4. Report findings to OpenAI
5. Iterate on safety measures

---

## Embeddings Models

**Current:** text-embedding-3-small, text-embedding-3-large  
**Context:** 8,191 tokens  
**Output Dimensions:** 256-3072 (configurable)

**Use Cases:**
- Semantic search
- Clustering and classification
- Recommendation systems
- Anomaly detection
- RAG (Retrieval-Augmented Generation)

**Pricing:**
- Small: $0.02/1M tokens
- Large: $0.13/1M tokens

**Performance (MTEB benchmark):**
- Small: 62.3% average
- Large: 64.6% average

---

## Common Issues & Troubleshooting

### "Model Not Available" Error

**Causes:**
- Using deprecated model (GPT-4, GPT-3.5, o1)
- API tier too low for o3/GPT-5.2
- Region restrictions (Sora, Enterprise features)

**Fixes:**
- Update to current models (see deprecation list above)
- Upgrade API tier (check spend thresholds)
- Contact OpenAI Support for region access

### Rate Limit Exceeded

**Causes:**
- Sending too many requests per minute (RPM)
- Exceeding tokens per minute (TPM)
- Batch API quota exhausted

**Fixes:**
- Implement exponential backoff (wait 1s, 2s, 4s, 8s, 16s)
- Use Batch API for non-urgent tasks (50% discount, no rate limits)
- Upgrade API tier (auto-upgrades based on spend)
- Parallelize across multiple API keys (if allowed by plan)

### Context Length Exceeded

**Causes:**
- Conversation history too long
- Input document exceeds model's context window

**Fixes:**
- Truncate old messages (keep last 10-20 turns)
- Summarize long documents before feeding to model
- Use GPT-4.1 for >128k token tasks (1M context)
- Split document into chunks (semantic chunking preferred)

### Reasoning Timeout (o3, o4-mini)

**Causes:**
- Extremely complex query requiring >60s reasoning
- o3-pro on low compute tier

**Fixes:**
- Simplify query (break into sub-tasks)
- Use o3-pro with high compute tier (Pro plan)
- Increase API timeout to 120s

### Inconsistent Output Format

**Causes:**
- Model interpreting prompt differently across runs
- Temperature >0 causing variability

**Fixes:**
- Use structured outputs (JSON schema enforcement)
- Set temperature=0 for deterministic results
- Add explicit format examples in prompt
- Use few-shot prompting (3-5 examples)

---

## Roadmap & Upcoming Features

**Confirmed (Q1-Q2 2026):**
- GPT-5.2 fine-tuning support
- o4-mini fine-tuning
- GPT-4.1 context expansion (2M tokens)
- Sora 2 for Enterprise/Edu
- Codex IDE extension for JetBrains IDEs

**Speculated (H2 2026):**
- GPT-6 preview
- o5 reasoning model
- Multimodal o-series (image + audio reasoning)
- Real-time API (voice streaming)
- Embeddings v4 (better multilingual)

**Deprecated Soon:**
- Assistants API → Responses API (sunset mid-2026 after feature parity)

---

## Further Reading

**Official Docs:**
- Model Overview: https://platform.openai.com/docs/models
- API Reference: https://platform.openai.com/docs/api-reference
- Fine-Tuning Guide: https://platform.openai.com/docs/guides/fine-tuning
- Safety Best Practices: https://platform.openai.com/docs/guides/safety-best-practices

**Benchmarks:**
- o3 System Card: https://openai.com/index/o3-system-card
- GPT-4.1 Evals: https://openai.com/index/gpt-4-1
- SWE-bench Leaderboard: https://www.swebench.com

**Community:**
- OpenAI Developer Forum: https://community.openai.com
- OpenAI Cookbook (GitHub): https://github.com/openai/openai-cookbook

---

**End of ChatGPT Models Guide**
