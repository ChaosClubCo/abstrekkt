# Gemini API Integration - Complete Guide

**Last Updated:** December 2025  
**Scope:** REST API, SDKs, authentication, best practices

---

## TL;DR

Gemini API provides **REST endpoints** and **SDKs** (Python, JavaScript, Go, Java) for integrating Gemini models into applications. Key features: **function calling**, **streaming**, **grounding**, **JSON mode**, **batch processing**, **context caching**—all with **simple API key auth** and **pay-as-you-go pricing**.

---

## Quick Start

### 1. Get API Key

```bash
# Visit aistudio.google.com
# Click "Get API key"
# Copy key (starts with AIza...)
export GEMINI_API_KEY="AIza..."
```

### 2. Install SDK

**Python:**
```bash
pip install google-generativeai
```

**JavaScript:**
```bash
npm install @google/generative-ai
```

**Go:**
```bash
go get github.com/google/generative-ai-go
```

### 3. Basic Request

**Python:**
```python
import google.generativeai as genai

genai.configure(api_key="AIza...")

model = genai.GenerativeModel("gemini-3-flash")
response = model.generate_content("Explain photosynthesis")
print(response.text)
```

**JavaScript:**
```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIza...");
const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });

const result = await model.generateContent("Explain photosynthesis");
console.log(result.response.text());
```

**REST (curl):**
```bash
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=AIza..." \
  -H "Content-Type: application/json" \
  -d '{"contents": [{"parts": [{"text": "Explain photosynthesis"}]}]}'
```

---

## SDK Reference

### Python SDK

**Installation:**
```bash
pip install google-generativeai --upgrade
```

**Configuration:**
```python
import google.generativeai as genai
import os

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
```

**Generate Content:**
```python
model = genai.GenerativeModel("gemini-3-flash")
response = model.generate_content("Write a haiku about code")
print(response.text)
```

**Chat Conversation:**
```python
chat = model.start_chat()
response = chat.send_message("Hello, how are you?")
print(response.text)
response = chat.send_message("Tell me a joke")
print(response.text)
```

**Streaming:**
```python
response = model.generate_content("Long story", stream=True)
for chunk in response:
    print(chunk.text, end="")
```

**Upload Files:**
```python
uploaded_file = genai.upload_file("document.pdf")
response = model.generate_content([uploaded_file, "Summarize this"])
print(response.text)

# Clean up
genai.delete_file(uploaded_file.name)
```

**Function Calling:**
```python
def get_weather(location: str):
    return {"temp": 72, "condition": "Sunny"}

model = genai.GenerativeModel(
    "gemini-3-flash",
    tools=[get_weather]
)

chat = model.start_chat()
response = chat.send_message("What's the weather in Tokyo?")

# Handle function call
if response.parts[0].function_call:
    fc = response.parts[0].function_call
    result = get_weather(**fc.args)
    response = chat.send_message(
        genai.protos.Content(
            parts=[genai.protos.Part(
                function_response=genai.protos.FunctionResponse(
                    name=fc.name,
                    response={"result": result}
                )
            )]
        )
    )
    print(response.text)
```

---

### JavaScript SDK

**Installation:**
```bash
npm install @google/generative-ai
```

**Configuration:**
```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
```

**Generate Content:**
```javascript
const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });
const result = await model.generateContent("Write a haiku");
console.log(result.response.text());
```

**Chat Conversation:**
```javascript
const chat = model.startChat();
let result = await chat.sendMessage("Hello");
console.log(result.response.text());

result = await chat.sendMessage("Tell me a joke");
console.log(result.response.text());
```

**Streaming:**
```javascript
const result = await model.generateContentStream("Long story");
for await (const chunk of result.stream) {
    process.stdout.write(chunk.text());
}
```

**Multimodal:**
```javascript
import fs from "fs";

const imageData = fs.readFileSync("image.jpg");
const imagePart = {
    inlineData: {
        data: Buffer.from(imageData).toString("base64"),
        mimeType: "image/jpeg"
    }
};

const result = await model.generateContent([
    "Describe this image",
    imagePart
]);
console.log(result.response.text());
```

---

## REST API

### Base URL
```
https://generativelanguage.googleapis.com/v1beta
```

### Authentication
```bash
# Query parameter
?key=AIza...

# Or header
-H "x-goog-api-key: AIza..."
```

### Generate Content
```bash
POST /models/{model}:generateContent

# Example
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=AIza..." \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{"text": "Explain quantum computing"}]
    }]
  }'
```

**Response:**
```json
{
  "candidates": [{
    "content": {
      "parts": [{"text": "Quantum computing..."}],
      "role": "model"
    },
    "finishReason": "STOP",
    "safetyRatings": [...]
  }],
  "usageMetadata": {
    "promptTokenCount": 4,
    "candidatesTokenCount": 150,
    "totalTokenCount": 154
  }
}
```

### Stream Content
```bash
POST /models/{model}:streamGenerateContent

curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:streamGenerateContent?key=AIza..." \
  -H "Content-Type: application/json" \
  -d '{"contents": [{"parts": [{"text": "Long story"}]}]}' \
  --no-buffer
```

### Chat
```bash
# Same endpoint, include history in "contents"
{
  "contents": [
    {"role": "user", "parts": [{"text": "Hello"}]},
    {"role": "model", "parts": [{"text": "Hi! How can I help?"}]},
    {"role": "user", "parts": [{"text": "Tell me a joke"}]}
  ]
}
```

---

## Advanced Features

### Function Calling

**Define Function:**
```json
{
  "tools": [{
    "functionDeclarations": [{
      "name": "get_weather",
      "description": "Get current weather",
      "parameters": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "City name"
          }
        },
        "required": ["location"]
      }
    }]
  }]
}
```

**Model Response (Function Call):**
```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "functionCall": {
          "name": "get_weather",
          "args": {"location": "Tokyo"}
        }
      }]
    }
  }]
}
```

**Send Function Result:**
```json
{
  "contents": [
    {"parts": [{"text": "What's the weather in Tokyo?"}]},
    {"parts": [{"functionCall": {"name": "get_weather", "args": {"location": "Tokyo"}}}]},
    {"parts": [{"functionResponse": {
      "name": "get_weather",
      "response": {"temp": 72, "condition": "Sunny"}
    }}]}
  ]
}
```

---

### Grounding with Google Search

**Python:**
```python
from google.generativeai.types import Tool

search_tool = Tool(google_search={})
response = model.generate_content(
    "Latest AI news December 2025",
    tools=[search_tool]
)

print(response.text)
print(response.grounding_metadata)
```

**REST:**
```json
{
  "contents": [{
    "parts": [{"text": "Latest AI news"}]
  }],
  "tools": [{
    "googleSearch": {}
  }]
}
```

---

### JSON Mode

**Python:**
```python
model = genai.GenerativeModel(
    "gemini-3-flash",
    generation_config={
        "response_mime_type": "application/json"
    }
)

response = model.generate_content("Extract: Name: John, Age: 30")
data = json.loads(response.text)
```

**REST:**
```json
{
  "contents": [{
    "parts": [{"text": "Extract data"}]
  }],
  "generationConfig": {
    "responseMimeType": "application/json"
  }
}
```

---

### Batch API

**Create Batch:**
```python
batch = genai.create_batch(
    model="gemini-3-flash",
    input_file="requests.jsonl",
    output_format="jsonl"
)
```

**Check Status:**
```python
status = genai.get_batch(batch.name)
print(status.state)  # PROCESSING, COMPLETED
```

**Download Results:**
```python
result_file = genai.download_file(batch.output_file)
```

---

### Context Caching

**Python:**
```python
cached_content = genai.caching.CachedContent.create(
    model="gemini-3-flash",
    system_instruction="You are a helpful assistant",
    ttl=3600
)

model = genai.GenerativeModel.from_cached_content(cached_content)
response = model.generate_content("Write code")
```

**Pricing:**
- Storage: $0.125/1M tokens per hour
- Cache hit: 60% discount on input tokens

---

## Rate Limits & Quotas

| Tier | Requests/Min | Tokens/Min |
|------|--------------|------------|
| **Free** | 15 | 1M |
| **Paid** | 2,000 | 4M |
| **Vertex AI** | Custom | Custom |

**Handle Rate Limits:**
```python
import time
from google.api_core import retry

@retry.Retry(predicate=retry.if_exception_type(ResourceExhausted))
def generate_with_retry(prompt):
    return model.generate_content(prompt)

# Exponential backoff
for attempt in range(5):
    try:
        response = model.generate_content("Prompt")
        break
    except ResourceExhausted:
        time.sleep(2 ** attempt)
```

---

## Error Handling

**Common Errors:**

| Error | Code | Cause | Solution |
|-------|------|-------|----------|
| **INVALID_ARGUMENT** | 400 | Bad request format | Check JSON structure |
| **UNAUTHENTICATED** | 401 | Invalid API key | Verify key is correct |
| **PERMISSION_DENIED** | 403 | API not enabled | Enable in Cloud Console |
| **RESOURCE_EXHAUSTED** | 429 | Rate limit hit | Implement backoff |
| **INTERNAL** | 500 | Server error | Retry request |

**Python Error Handling:**
```python
from google.api_core import exceptions

try:
    response = model.generate_content("Prompt")
except exceptions.InvalidArgument as e:
    print(f"Bad request: {e}")
except exceptions.ResourceExhausted as e:
    print(f"Rate limit: {e}")
except Exception as e:
    print(f"Error: {e}")
```

---

## Best Practices

### 1. Security
```python
# ✅ Use environment variables
import os
api_key = os.environ["GEMINI_API_KEY"]

# ❌ Never hardcode
api_key = "AIza..."  # DON'T DO THIS
```

### 2. Cost Optimization
```python
# Use caching for repeated prompts
cached = genai.caching.CachedContent.create(
    model="gemini-3-flash",
    system_instruction=LONG_SYSTEM_PROMPT,
    ttl=3600
)

# Use Flash for simple tasks
model = genai.GenerativeModel("gemini-3-flash")  # ✅ Cheap
# model = genai.GenerativeModel("gemini-3-pro")  # ❌ Expensive
```

### 3. Performance
```python
# Stream for better UX
response = model.generate_content("Long text", stream=True)
for chunk in response:
    display(chunk.text)

# Batch for high volume
batch = genai.create_batch(...)  # 50% discount
```

### 4. Reliability
```python
# Implement retry logic
@retry.Retry()
def generate(prompt):
    return model.generate_content(prompt)

# Validate responses
response = model.generate_content("Extract data")
if not is_valid_json(response.text):
    # Retry or handle error
```

---

## Migration Guides

### From OpenAI

| OpenAI | Gemini |
|--------|--------|
| `openai.ChatCompletion.create()` | `model.generate_content()` |
| `gpt-4o` | `gemini-3-flash` or `gemini-3-pro` |
| `stream=True` | `stream=True` |
| `functions` | `tools=[func]` |
| `response_format={"type": "json"}` | `response_mime_type="application/json"` |

**Code Comparison:**
```python
# OpenAI
response = openai.ChatCompletion.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}]
)

# Gemini
response = model.generate_content("Hello")
```

### From Claude

| Claude | Gemini |
|--------|--------|
| `anthropic.messages.create()` | `model.generate_content()` |
| `claude-3.7-sonnet` | `gemini-3-flash` |
| `max_tokens` | `max_output_tokens` |
| `system` parameter | `system_instruction` |

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIM:** Gemini API supports 1M token context  
**SOURCE:** [ai.google.dev/gemini-api/docs](https://ai.google.dev/gemini-api/docs)  
**STATUS:** Verified December 2025

**CLAIM:** Batch API offers 50% discount  
**SOURCE:** [ai.google.dev/pricing](https://ai.google.dev/pricing)  
**STATUS:** Verified December 2025

**CLAIM:** Free tier: 15 requests/min, 1M tokens/min  
**SOURCE:** [ai.google.dev/pricing](https://ai.google.dev/pricing)  
**STATUS:** Verified December 2025
