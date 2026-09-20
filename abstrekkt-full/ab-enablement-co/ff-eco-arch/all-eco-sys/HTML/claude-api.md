# Claude API Integration - Complete Guide

**Last Updated:** January 2025  
**Scope:** REST API, SDKs (Python/JS/Go), Tool Use, Streaming, Batch, Computer Use

---

## TL;DR

Claude API provides programmatic access via REST or official SDKs (Python, JavaScript, Go). Supports streaming responses, tool use (function calling), vision, prompt caching (90% discount), and batch processing (50% discount). All models available via same endpoint with 200K context window.

---

## Getting Started

### API Key Setup

**1. Get API Key:**
```
1. Visit: https://console.anthropic.com
2. Create account or sign in
3. Navigate to: API Keys
4. Click: Create Key
5. Copy key (starts with "sk-ant-")
6. Store securely (never commit to git)
```

**2. Set Environment Variable:**
```bash
# Linux/macOS
export ANTHROPIC_API_KEY='sk-ant-...'

# Windows (PowerShell)
$env:ANTHROPIC_API_KEY='sk-ant-...'

# Or use .env file
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
```

---

## SDK Installation

### Python
```bash
pip install anthropic
```

**Basic Example:**
```python
import anthropic

client = anthropic.Anthropic(
    api_key="sk-ant-..."  # defaults to os.environ.get("ANTHROPIC_API_KEY")
)

message = client.messages.create(
    model="claude-sonnet-4.5-20241217",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude!"}
    ]
)

print(message.content[0].text)
```

---

### JavaScript/TypeScript
```bash
npm install @anthropic-ai/sdk
```

**Basic Example:**
```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await client.messages.create({
  model: 'claude-sonnet-4.5-20241217',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Hello, Claude!' }
  ],
});

console.log(message.content[0].text);
```

---

### Go
```bash
go get github.com/anthropic-ai/anthropic-sdk-go
```

**Basic Example:**
```go
package main

import (
    "context"
    "fmt"
    "os"
    
    "github.com/anthropic-ai/anthropic-sdk-go"
    "github.com/anthropic-ai/anthropic-sdk-go/option"
)

func main() {
    client := anthropic.NewClient(
        option.WithAPIKey(os.Getenv("ANTHROPIC_API_KEY")),
    )
    
    message, err := client.Messages.New(context.Background(), anthropic.MessageNewParams{
        Model: anthropic.F(anthropic.ModelClaudeSonnet4_520241217),
        MaxTokens: anthropic.F(int64(1024)),
        Messages: anthropic.F([]anthropic.MessageParam{
            anthropic.NewUserMessage(anthropic.NewTextBlock("Hello, Claude!")),
        }),
    })
    
    if err != nil {
        panic(err)
    }
    
    fmt.Println(message.Content[0].Text)
}
```

---

## REST API

### Endpoint
```
POST https://api.anthropic.com/v1/messages
```

### Headers
```
anthropic-version: 2023-06-01
content-type: application/json
x-api-key: YOUR_API_KEY
```

### Basic Request (cURL)
```bash
curl https://api.anthropic.com/v1/messages \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -d '{
    "model": "claude-sonnet-4.5-20241217",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude!"}
    ]
  }'
```

---

## Streaming Responses

### Python
```python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4.5-20241217",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a haiku about coding"}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### JavaScript
```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const stream = await client.messages.create({
  model: 'claude-sonnet-4.5-20241217',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Write a haiku about coding' }],
  stream: true,
});

for await (const event of stream) {
  if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
    process.stdout.write(event.delta.text);
  }
}
```

### REST API (SSE)
```bash
curl https://api.anthropic.com/v1/messages \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -d '{
    "model": "claude-sonnet-4.5-20241217",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}],
    "stream": true
  }'
```

**Response (Server-Sent Events):**
```
event: message_start
data: {"type":"message_start","message":{"id":"msg_123",...}}

event: content_block_start
data: {"type":"content_block_start","index":0,...}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"!"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: message_stop
data: {"type":"message_stop"}
```

---

## Tool Use (Function Calling)

### Define Tools
```python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City name, e.g., San Francisco, CA"
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "Temperature unit"
                }
            },
            "required": ["location"]
        }
    }
]

message = client.messages.create(
    model="claude-sonnet-4.5-20241217",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in SF?"}]
)
```

### Handle Tool Calls
```python
# Claude decides to use tool
if message.stop_reason == "tool_use":
    tool_use = next(block for block in message.content if block.type == "tool_use")
    
    # Execute tool
    if tool_use.name == "get_weather":
        location = tool_use.input["location"]
        # Fetch weather data
        weather_result = {"temperature": 72, "conditions": "sunny"}
        
        # Send result back to Claude
        response = client.messages.create(
            model="claude-sonnet-4.5-20241217",
            max_tokens=1024,
            tools=tools,
            messages=[
                {"role": "user", "content": "What's the weather in SF?"},
                {"role": "assistant", "content": message.content},
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "tool_result",
                            "tool_use_id": tool_use.id,
                            "content": str(weather_result)
                        }
                    ]
                }
            ]
        )
        
        print(response.content[0].text)
        # Output: "It's currently 72°F and sunny in San Francisco!"
```

### Parallel Tool Execution
```python
# Claude can call multiple tools in one response
message = client.messages.create(
    model="claude-sonnet-4.5-20241217",
    max_tokens=1024,
    tools=[weather_tool, calendar_tool, email_tool],
    messages=[{"role": "user", "content": "Check SF weather, my calendar, and recent emails"}]
)

# Execute all tool calls
tool_results = []
for block in message.content:
    if block.type == "tool_use":
        result = execute_tool(block.name, block.input)
        tool_results.append({
            "type": "tool_result",
            "tool_use_id": block.id,
            "content": str(result)
        })

# Send all results back
response = client.messages.create(
    model="claude-sonnet-4.5-20241217",
    max_tokens=1024,
    tools=tools,
    messages=[
        {"role": "user", "content": "..."},
        {"role": "assistant", "content": message.content},
        {"role": "user", "content": tool_results}
    ]
)
```

---

## Vision (Images & PDFs)

### Image Analysis
```python
import anthropic
import base64

client = anthropic.Anthropic()

# Read image
with open("chart.png", "rb") as f:
    image_data = base64.standard_b64encode(f.read()).decode("utf-8")

message = client.messages.create(
    model="claude-sonnet-4.5-20241217",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": image_data,
                    },
                },
                {
                    "type": "text",
                    "text": "What does this chart show?"
                }
            ],
        }
    ],
)

print(message.content[0].text)
```

### PDF Analysis
```python
import anthropic
import base64

client = anthropic.Anthropic()

# Read PDF
with open("report.pdf", "rb") as f:
    pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")

message = client.messages.create(
    model="claude-sonnet-4.5-20241217",
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "base64",
                        "media_type": "application/pdf",
                        "data": pdf_data,
                    },
                },
                {
                    "type": "text",
                    "text": "Summarize the key findings from this report"
                }
            ],
        }
    ],
)

print(message.content[0].text)
```

---

## Prompt Caching

### Enable Caching
```python
import anthropic

client = anthropic.Anthropic()

# First request (cache MISS - full cost)
response1 = client.messages.create(
    model="claude-sonnet-4.5-20241217",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are an AI assistant specialized in analyzing financial reports.",
        },
        {
            "type": "text",
            "text": open("large_document.txt").read(),
            "cache_control": {"type": "ephemeral"}  # Mark for caching
        }
    ],
    messages=[{"role": "user", "content": "What's the revenue for Q1?"}]
)

# Second request (cache HIT - 90% discount on cached tokens)
response2 = client.messages.create(
    model="claude-sonnet-4.5-20241217",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are an AI assistant specialized in analyzing financial reports.",
        },
        {
            "type": "text",
            "text": open("large_document.txt").read(),
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[{"role": "user", "content": "What about Q2?"}]
)

# Check cache usage
print(response1.usage)  # cache_creation_input_tokens: 50000
print(response2.usage)  # cache_read_input_tokens: 50000 (90% discount)
```

### Cache TTL
- **Duration:** 5 minutes
- **Auto-refresh:** On cache hit
- **Minimum:** 1024 tokens
- **Pricing:** Write: same as input, Read: 10% of input

---

## Batch API

### Create Batch
```python
import anthropic

client = anthropic.Anthropic()

# Prepare requests
requests = [
    {
        "custom_id": "req_1",
        "params": {
            "model": "claude-sonnet-4.5-20241217",
            "max_tokens": 1024,
            "messages": [{"role": "user", "content": "Analyze customer review #1"}]
        }
    },
    {
        "custom_id": "req_2",
        "params": {
            "model": "claude-sonnet-4.5-20241217",
            "max_tokens": 1024,
            "messages": [{"role": "user", "content": "Analyze customer review #2"}]
        }
    },
    # ... up to 10,000 requests
]

# Submit batch
batch = client.batches.create(requests=requests)

print(f"Batch ID: {batch.id}")
print(f"Status: {batch.status}")  # "processing"
```

### Check Status
```python
# Poll for completion
import time

while True:
    batch = client.batches.retrieve(batch.id)
    print(f"Status: {batch.status}")
    
    if batch.status == "completed":
        break
    elif batch.status == "failed":
        print(f"Error: {batch.error}")
        break
    
    time.sleep(60)  # Check every minute
```

### Retrieve Results
```python
# Get results
results = client.batches.results(batch.id)

for result in results:
    print(f"Request: {result.custom_id}")
    print(f"Response: {result.result.content[0].text}")
```

### Pricing
- **Discount:** 50% off standard pricing
- **Example:** Sonnet 4.5 → $1.50 input / $7.50 output (vs $3/$15)
- **Minimum:** 10,000 total tokens across all requests
- **Max time:** 24 hours to completion

---

## Computer Use (Beta)

### Overview
- **What:** Claude can control your computer via screenshots and actions
- **Actions:** Click, type, scroll, move mouse, keyboard shortcuts
- **Model:** Claude Sonnet 4.5 only
- **Status:** Beta (API only, not in claude.ai/Desktop)

### Basic Setup
```python
import anthropic
import base64
from anthropic.types.beta import BetaMessageParam

client = anthropic.Anthropic()

# Take screenshot
def capture_screenshot():
    # Use your preferred screenshot library
    from PIL import ImageGrab
    screenshot = ImageGrab.grab()
    screenshot.save("screen.png")
    with open("screen.png", "rb") as f:
        return base64.standard_b64encode(f.read()).decode()

# Define computer tool
computer_tool = {
    "type": "computer_20241022",
    "name": "computer",
    "display_width_px": 1920,
    "display_height_px": 1080,
    "display_number": 1
}

message = client.beta.messages.create(
    model="claude-sonnet-4.5-20241217",
    max_tokens=1024,
    tools=[computer_tool],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": capture_screenshot()
                    }
                },
                {
                    "type": "text",
                    "text": "Click on the Chrome icon"
                }
            ]
        }
    ],
    betas=["computer-use-2024-10-22"]
)

# Claude responds with action
if message.stop_reason == "tool_use":
    action = message.content[1]  # tool_use block
    print(action.input)  # {"action": "left_click", "coordinate": [100, 200]}
```

### Action Types
```python
# Mouse actions
{"action": "left_click", "coordinate": [x, y]}
{"action": "right_click", "coordinate": [x, y]}
{"action": "double_click", "coordinate": [x, y]}
{"action": "mouse_move", "coordinate": [x, y]}

# Keyboard actions
{"action": "type", "text": "Hello World"}
{"action": "key", "text": "Return"}  # Enter
{"action": "key", "text": "Control_L+c"}  # Ctrl+C

# Scrolling
{"action": "scroll", "scroll_amount": -5}  # Scroll up
{"action": "scroll", "scroll_amount": 5}   # Scroll down

# Screenshot
{"action": "screenshot"}
```

### Full Loop Example
```python
def execute_computer_task(task: str):
    messages = [{"role": "user", "content": task}]
    
    while True:
        # Send current state to Claude
        screenshot = capture_screenshot()
        messages.append({
            "role": "user",
            "content": [
                {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": screenshot}},
                {"type": "text", "text": "Current screen"}
            ]
        })
        
        response = client.beta.messages.create(
            model="claude-sonnet-4.5-20241217",
            max_tokens=1024,
            tools=[computer_tool],
            messages=messages,
            betas=["computer-use-2024-10-22"]
        )
        
        if response.stop_reason == "end_turn":
            # Task complete
            print("Task completed!")
            break
        
        # Execute action
        action_block = next(b for b in response.content if b.type == "tool_use")
        action = action_block.input
        
        if action["action"] == "left_click":
            pyautogui.click(action["coordinate"][0], action["coordinate"][1])
        elif action["action"] == "type":
            pyautogui.typewrite(action["text"])
        # ... handle other actions
        
        # Add to conversation
        messages.append({"role": "assistant", "content": response.content})
        messages.append({
            "role": "user",
            "content": [{
                "type": "tool_result",
                "tool_use_id": action_block.id,
                "content": "Action executed"
            }]
        })
```

---

## Error Handling

### Status Codes
- **200:** Success
- **400:** Invalid request (bad JSON, missing fields)
- **401:** Invalid API key
- **403:** Forbidden (permissions, rate limits)
- **429:** Rate limit exceeded
- **500:** Server error (retry)
- **529:** Overloaded (retry with backoff)

### Python Error Handling
```python
import anthropic
from anthropic import APIError, RateLimitError, APIConnectionError

client = anthropic.Anthropic()

try:
    message = client.messages.create(
        model="claude-sonnet-4.5-20241217",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Hello"}]
    )
except RateLimitError as e:
    print(f"Rate limit hit: {e}")
    # Wait and retry
except APIConnectionError as e:
    print(f"Network error: {e}")
    # Check connectivity
except APIError as e:
    print(f"API error: {e.status_code} - {e.message}")
```

### Retry Logic
```python
import time
from anthropic import RateLimitError, APIConnectionError

def create_message_with_retry(client, **kwargs):
    max_retries = 3
    backoff = 1  # seconds
    
    for attempt in range(max_retries):
        try:
            return client.messages.create(**kwargs)
        except (RateLimitError, APIConnectionError) as e:
            if attempt == max_retries - 1:
                raise
            print(f"Retry {attempt + 1}/{max_retries} after {backoff}s")
            time.sleep(backoff)
            backoff *= 2  # Exponential backoff
```

---

## Rate Limits

### By Tier

| Tier | Requests/Min | Tokens/Min | Tokens/Day |
|------|-------------|------------|------------|
| **Free Trial** | 5 | 40,000 | 300,000 |
| **Build 1** | 50 | 40,000 | 1,000,000 |
| **Build 2** | 1,000 | 80,000 | 2,500,000 |
| **Build 3** | 2,000 | 160,000 | 5,000,000 |
| **Build 4** | 4,000 | 400,000 | Unlimited |

### Headers
```
anthropic-ratelimit-requests-limit: 50
anthropic-ratelimit-requests-remaining: 49
anthropic-ratelimit-requests-reset: 2024-01-01T00:00:00Z
anthropic-ratelimit-tokens-limit: 40000
anthropic-ratelimit-tokens-remaining: 39500
anthropic-ratelimit-tokens-reset: 2024-01-01T00:00:00Z
```

---

## Best Practices

### Security
1. **Never expose API keys in client-side code**
2. **Use environment variables, not hardcoded strings**
3. **Rotate keys quarterly**
4. **Implement server-side proxy for web apps**
5. **Monitor usage for anomalies**

### Performance
1. **Use streaming for long responses**
2. **Enable prompt caching for repeated context**
3. **Batch similar requests**
4. **Choose right model (Haiku for speed, Opus for quality)**
5. **Implement retry with exponential backoff**

### Cost Optimization
1. **Use prompt caching (90% savings on repeated context)**
2. **Use Batch API (50% discount)**
3. **Choose Haiku for simple tasks**
4. **Truncate context to minimum needed**
5. **Monitor token usage in dashboard**

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIM:** Prompt caching provides 90% discount on cached reads  
**SOURCE:** [docs.anthropic.com/claude/caching](https://docs.anthropic.com/claude/caching)  
**STATUS:** Verified January 2025

**CLAIM:** Batch API offers 50% discount  
**SOURCE:** [docs.anthropic.com/claude/batch](https://docs.anthropic.com/claude/batch)  
**STATUS:** Verified January 2025

**CLAIM:** Computer Use is only available via API with Sonnet 4.5  
**SOURCE:** [docs.anthropic.com/claude/computer-use](https://docs.anthropic.com/claude/computer-use)  
**STATUS:** Verified January 2025 (Beta)

**COUNTEREXAMPLE:** Computer Use NOT available in claude.ai or Desktop - API only

**CONTRADICTION:** Rate limits may vary by account age and usage patterns
