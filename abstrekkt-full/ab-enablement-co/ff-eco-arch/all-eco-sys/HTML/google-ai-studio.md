# Google AI Studio - Complete Guide

**Last Updated:** December 2025  
**Scope:** Web playground, Interactions API, batch processing, grounding, tools

---

## TL;DR

**Google AI Studio** is a free, web-based IDE for rapid prototyping with Gemini models. It provides **prompt engineering tools**, **batch processing**, **structured output testing**, **grounding with Google Search/Maps**, and **the Interactions API (beta)** for building conversational workflows—all without requiring a Google Cloud account.

---

## What Is Google AI Studio?

**Google AI Studio** is Google's equivalent to OpenAI Playground or Anthropic Console—a web-based interface for:

- **Testing Gemini models** interactively
- **Building prompts** with templates and examples
- **Processing batches** of data (CSV/JSON)
- **Grounding responses** with Google Search or Google Maps
- **Generating API code** (Python, JavaScript, REST)
- **Managing API keys** for production deployment

**Access:** [aistudio.google.com](https://aistudio.google.com)  
**Requirements:** Google account (free tier available)  
**Cost:** Free for testing; pay-as-you-go for production API

---

## Core Features

### 1. Prompt Types

**Freeform Prompt** - Open-ended chat
- **Use case:** Conversational exploration, ideation
- **Interface:** Chat-style input/output
- **Features:** Multi-turn, edit history, model comparison

**Structured Prompt** - Template with variables
- **Use case:** Reusable patterns (email drafts, summaries, translations)
- **Interface:** Template editor with `{{variable}}` syntax
- **Features:** Test data, batch mode, code export

**Chat Prompt** - System + few-shot examples
- **Use case:** Chatbots, assistants, role-play
- **Interface:** System instruction + user/model example pairs
- **Features:** Temperature tuning, safety settings, function calling

**Batch Prompt** - Process CSV/JSON datasets
- **Use case:** Data labeling, classification, bulk summarization
- **Interface:** Upload CSV → map columns → process → download results
- **Features:** Parallel processing, progress tracking, cost estimation

---

### 2. Model Configuration

#### Available Models

```
Gemini 3 Pro              (frontier reasoning)
Gemini 3 Flash            (default, best value)
Gemini 3 Deep Think       (extended reasoning)
Gemini 2.5 Pro            (agentic coding)
Gemini 2.5 Flash          (high-volume)
Gemini 2.5 Flash-Lite     (cost-optimized)
Gemini 2.5 Flash Image    (Nano Banana)
```

#### Generation Settings

**Temperature:** 0.0–2.0 (default: 1.0)
- 0.0 = Deterministic, factual
- 1.0 = Balanced creativity
- 2.0 = Maximum creativity

**Top-K:** 1–40 (default: 40)
- Limits token sampling to K most likely tokens

**Top-P:** 0.0–1.0 (default: 0.95)
- Nucleus sampling threshold

**Max Output Tokens:** 1–65,536 (model-dependent)

**Stop Sequences:** Custom strings to halt generation
- Example: `["---", "END", "\n\n\n"]`

#### Safety Settings

Per-category controls:
- Harassment
- Hate Speech
- Sexually Explicit
- Dangerous Content

**Levels:** BLOCK_NONE, BLOCK_ONLY_HIGH, BLOCK_MEDIUM_AND_ABOVE, BLOCK_LOW_AND_ABOVE  
**Default:** BLOCK_MEDIUM_AND_ABOVE

---

### 3. Multimodal Input

| Type | Formats | Max Size | Use Case |
|------|---------|----------|----------|
| **Text** | Plain, Markdown | 1M tokens | Documents, code |
| **Image** | PNG, JPEG, WebP, HEIC | 20MB | Screenshots, diagrams |
| **Audio** | WAV, MP3, AIFF, AAC, OGG | 20MB | Transcription, analysis |
| **Video** | MOV, MPEG, MP4, MPG, AVI | 2GB or 1hr | Clips, tutorials |
| **PDF** | PDF | 20MB or 1K pages | Reports, papers |

**Upload Methods:**
1. Drag-and-drop into chat
2. File picker (📎 icon)
3. Google Drive integration
4. URL reference (images only)

---

### 4. Grounding with Google Search

**What It Does:**
- Queries Google Search for up-to-date information
- Cites sources with URLs
- Reduces hallucinations on factual queries

**When to Use:**
- Current events, news
- Product specs, pricing
- Scientific papers (recent)
- Location-based queries (with Maps)

**How to Enable:**
1. Open prompt settings (⚙️)
2. Toggle **"Grounding with Google Search"**
3. (Optional) Enable **"Grounding with Google Maps"**

**API Example:**
```python
from google.generativeai.types import Tool

search_tool = Tool(google_search={})

response = model.generate_content(
  "Latest AI benchmarks December 2025?",
  tools=[search_tool]
)

print(response.text)
print(response.grounding_metadata)
```

**Limitations:**
- Not available on all models
- Adds latency (~1-3 seconds)
- Free tier: 10 grounded requests/day

---

### 5. Function Calling (Tools)

**What It Does:**
- Lets models invoke external functions/APIs
- Model decides when to call based on conversation
- You provide function signatures

**Use Cases:**
- Database queries (get user data)
- External APIs (weather, stock prices)
- Multi-step workflows (search → analyze → summarize)

**Function Schema Example:**
```json
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name or zip code"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"]
      }
    },
    "required": ["location"]
  }
}
```

**API Implementation:**
```python
import google.generativeai as genai

def get_weather(location: str, unit: str = "celsius"):
    return {"temperature": 22, "condition": "Partly cloudy"}

model = genai.GenerativeModel(
  model_name="gemini-3-flash",
  tools=[get_weather]
)

chat = model.start_chat()
response = chat.send_message("What's the weather in Tokyo?")

if response.parts[0].function_call:
    function_call = response.parts[0].function_call
    result = get_weather(**function_call.args)
    
    response = chat.send_message(
        genai.protos.Content(
            parts=[genai.protos.Part(
                function_response=genai.protos.FunctionResponse(
                    name=function_call.name,
                    response={"result": result}
                )
            )]
        )
    )

print(response.text)
```

**Calling Modes:**
- **AUTO** (default): Model decides when to call
- **ANY**: Model must call at least one function
- **NONE**: Disable function calling

---

### 6. Batch Processing

**What It Does:**
- Process large datasets (CSV, JSON, JSONL)
- Parallel execution for speed
- 50% cost discount

**Use Cases:**
- Label 10K customer reviews
- Translate 5K product descriptions
- Summarize 1K research papers
- Extract entities from 20K documents

**How to Use (UI):**
1. Create Structured/Chat Prompt
2. Click **"Run batch"**
3. Upload CSV/JSON
4. Map columns to variables
5. Review cost estimate
6. Start batch
7. Download results

**CSV Example:**
```csv
review_text,star_rating
"Great product!",5
"Poor quality",1
```

**Prompt Template:**
```
Classify this review:
Review: {{review_text}}
Rating: {{star_rating}}

Classification:
```

**Output:**
```csv
review_text,star_rating,output
"Great product!",5,"Positive"
"Poor quality",1,"Negative"
```

**Batch Pricing:**
- **50% discount** vs real-time API
- Gemini 3 Flash: $0.05/1M input tokens
- Completion time: 24 hours max (usually 2-6 hours)

---

### 7. Structured Outputs (JSON Mode)

**What It Does:**
- Force model to output **valid JSON**
- Define **schema** for expected structure
- Validate response format automatically

**Use Cases:**
- API integrations
- Data extraction
- Classification with confidence scores

**How to Enable:**
1. Select **"Response MIME type"** → **"application/json"**
2. (Optional) Provide JSON schema

**Example:**
```python
import google.generativeai as genai

schema = {
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "email": {"type": "string", "format": "email"},
    "phone": {"type": "string"}
  },
  "required": ["name", "email"]
}

model = genai.GenerativeModel(
    model_name="gemini-3-flash",
    generation_config={
        "response_mime_type": "application/json",
        "response_schema": schema
    }
)

response = model.generate_content("Extract: John Doe, john@acme.com")
data = json.loads(response.text)  # Guaranteed valid JSON
```

---

### 8. Code Export

**Languages Supported:**
- Python
- JavaScript/TypeScript
- REST (curl)

**How to Use:**
1. Test prompt in AI Studio
2. Click **"Get code"** (</> icon)
3. Select language
4. Copy to your project

**Python Example:**
```python
import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")

model = genai.GenerativeModel(
    model_name="gemini-3-flash",
    generation_config={
        "temperature": 1.0,
        "max_output_tokens": 8192,
    }
)

response = model.generate_content("Explain photosynthesis")
print(response.text)
```

---

### 9. API Key Management

**Creating API Keys:**
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **"Get API key"**
3. Choose:
   - Create in new project (testing)
   - Create in existing project (Google Cloud)
4. Copy key (starts with `AIza...`)

**Security Best Practices:**
- ✅ Store in environment variables
- ✅ Rotate keys quarterly
- ✅ Use separate keys for dev/staging/prod
- ✅ Restrict keys to specific IPs
- ✅ Enable API key quotas
- ❌ Never commit to Git
- ❌ Never share publicly

**Restricting Keys (Google Cloud Console):**
1. Go to [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
2. Find API key
3. Click **"Edit API key"**
4. Set restrictions:
   - **Application:** HTTP referrers, IP addresses
   - **API:** Limit to Generative Language API

**Monitoring Usage:**
- View requests/day
- Track tokens/day
- See cost estimates
- Monitor error rates

---

## Advanced Features

### Context Caching (Beta)

**What It Does:**
- Cache system prompts or large documents
- Reuse cached content across requests
- 60% cost savings

**API Example:**
```python
# Cache system prompt
cached_content = genai.caching.CachedContent.create(
    model="gemini-3-flash",
    system_instruction="You are a helpful coding assistant.",
    ttl=3600  # 1 hour
)

# Use cached content
model = genai.GenerativeModel.from_cached_content(cached_content)
response = model.generate_content("Write a Python function")
```

**Pricing:**
- **Storage:** $0.125/1M tokens per hour
- **Cache hits:** 60% discount on input tokens

**Limitations:**
- Minimum: 32,000 tokens
- Maximum TTL: 24 hours
- LRU eviction

---

### Live API (Audio Streaming)

**What It Does:**
- Real-time audio input/output streaming
- Low-latency voice conversations
- Function calling during streaming

**Supported Models:**
- Gemini 2.5 Flash Native Audio (preview)

**API Example:**
```python
import google.generativeai as genai

model = genai.GenerativeModel(
    "gemini-2.5-flash-native-audio-preview-12-2025"
)

stream = model.start_stream()

for audio_chunk in microphone_input():
    stream.send_audio(audio_chunk)
    
    for response_chunk in stream.receive_audio():
        speaker_output(response_chunk)

stream.close()
```

**Features:**
- Interruption handling
- Function calling
- Emotion detection (experimental)
- <500ms latency

---

### Thinking Mode (Gemini 2.5+)

**What It Does:**
- Shows reasoning steps before final answer
- Improves accuracy on complex problems
- Transparent decision-making

**Configuration:**
```python
generation_config = {
    "thinking_budget": "auto",  # none, low, medium, high
    "include_thinking_steps": True
}
```

**When to Use:**
- Math proofs, logic puzzles
- Code debugging
- Multi-step research
- Strategic planning

---

## Best Practices

### Prompt Engineering
1. Be specific with constraints
2. Provide few-shot examples
3. Set word limits, format requirements
4. Iterate and compare results
5. Use templates for consistency

### Performance Optimization
1. Enable caching for repeated prompts
2. Use batch API for non-urgent tasks
3. Stream responses for better UX
4. Right-size models (Flash vs Pro)
5. Minimize context sent

### Safety & Compliance
1. Set safety filters appropriately
2. Validate outputs (don't trust JSON alone)
3. Rate limit users
4. Log requests for monitoring
5. Review grounding sources

### Cost Management
1. Monitor usage dashboard
2. Set budget alerts
3. Use Flash-Lite for simple tasks
4. Batch similar requests
5. Optimize prompt length

---

## Troubleshooting

**API key not valid:**
- Verify key starts with `AIza`
- Check key is enabled for Generative Language API
- Ensure project billing is active

**Rate limit exceeded:**
- Free tier: 15 requests/minute
- Implement exponential backoff
- Request quota increase

**Model not available:**
- Check model name spelling
- Verify regional availability
- Use stable version, not preview

**Grounding not working:**
- Ensure model supports grounding
- Check grounding is enabled
- Free tier: 10 grounded requests/day limit

**Function calling not triggered:**
- Verify function schema is valid JSON
- Add clear description field
- Use explicit user intent

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIM:** AI Studio is free for testing  
**SOURCE:** [ai.google.dev/pricing](https://ai.google.dev/pricing)  
**STATUS:** Verified December 2025

**CLAIM:** Batch API offers 50% discount  
**SOURCE:** [ai.google.dev/docs/batch_predict](https://ai.google.dev/docs/batch_predict)  
**STATUS:** Verified December 2025

**CLAIM:** Interactions API is in beta  
**SOURCE:** [ai.google.dev/docs/interactions](https://ai.google.dev/docs/interactions)  
**STATUS:** Beta (API subject to change)

**COUNTEREXAMPLE:** Some OpenAI Playground features (code interpreter) not available - use function calling to external runtimes instead
