# API Integration Guide

**Last Updated:** December 2025  
**Scope:** OpenAI Platform API (Chat Completions, Responses API, Agents SDK, tool calling, fine-tuning)

---

## Overview

The **OpenAI Platform API** provides programmatic access to all OpenAI models for custom applications. Unlike ChatGPT (conversational UI), the API enables:

- Custom applications (mobile apps, web apps, services)
- Production deployments (scalable, reliable, monitored)
- Fine-grained control (temperature, tokens, tools, structured outputs)
- Batch processing (50% cost discount)
- Fine-tuning (custom models for your domain)

**Key Endpoints:**
- **Chat Completions** - Core conversation API (messages → response)
- **Responses API** (Beta) - High-level agent framework (replaces Assistants API)
- **Agents SDK** (Beta) - Library for building autonomous agents
- **Tool Calling** - Function execution (APIs, databases, calculators)
- **Embeddings** - Semantic search, classification, recommendations
- **Fine-Tuning** - Train custom models on your data
- **Batch** - Async processing with 50% discount

---

## Chat Completions API

### Basic Usage

**Endpoint:** `POST https://api.openai.com/v1/chat/completions`

**Simple Request:**
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is the capital of France?"}
    ]
  }'
```

**Response:**
```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1735353600,
  "model": "gpt-4o",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The capital of France is Paris."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 10,
    "total_tokens": 30
  }
}
```

### Parameters

**Required:**
- `model` - Model ID (e.g., "gpt-4o", "o3", "gpt-4.1")
- `messages` - Array of message objects

**Common Optional:**
- `temperature` - Randomness (0-2, default: 1). 0 = deterministic, 2 = very creative
- `max_tokens` - Max completion length (default: model-specific)
- `top_p` - Nucleus sampling (0-1, default: 1). Alternative to temperature
- `frequency_penalty` - Reduce repetition (0-2, default: 0)
- `presence_penalty` - Encourage new topics (0-2, default: 0)
- `stop` - Stop sequences (array of strings)
- `stream` - Stream response (boolean, default: false)
- `tools` - Function definitions (for tool calling)
- `response_format` - Structured output (JSON schema)

**Example (Advanced):**
```json
{
  "model": "gpt-4o",
  "messages": [...],
  "temperature": 0.7,
  "max_tokens": 500,
  "top_p": 0.9,
  "frequency_penalty": 0.5,
  "presence_penalty": 0.2,
  "stop": ["END", "\n\n\n"],
  "stream": true,
  "response_format": { "type": "json_object" }
}
```

### Message Roles

**system:**
- Sets behavior and instructions
- First message (optional but recommended)
- Not counted as conversation history

```json
{"role": "system", "content": "You are a Python expert. Provide concise code examples."}
```

**user:**
- User's input/query
- Can include multiple user messages (conversation)

```json
{"role": "user", "content": "How do I read a CSV file?"}
```

**assistant:**
- Model's previous responses
- Include for multi-turn conversations

```json
{"role": "assistant", "content": "You can use pandas: `df = pd.read_csv('file.csv')`"}
```

**tool:**
- Function call results (see Tool Calling section)

```json
{"role": "tool", "tool_call_id": "call_abc", "content": "{\"temperature\": 72}"}
```

### Streaming Responses

**Enable:**
```json
{
  "model": "gpt-4o",
  "messages": [...],
  "stream": true
}
```

**Response (SSE format):**
```
data: {"id":"chatcmpl-123","choices":[{"delta":{"content":"The"},"index":0}]}

data: {"id":"chatcmpl-123","choices":[{"delta":{"content":" capital"},"index":0}]}

data: {"id":"chatcmpl-123","choices":[{"delta":{"content":" of"},"index":0}]}

data: [DONE]
```

**Client Code (Node.js):**
```javascript
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const stream = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Tell me a story" }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}
```

**Use Cases:**
- Real-time chat UIs (typewriter effect)
- Long responses (show progress)
- Interactive applications

---

## Tool Calling (Function Calling)

### Overview

Tool calling enables models to invoke functions (API calls, database queries, calculations) and use the results.

**Flow:**
```
1. Define tools (functions) in request
2. Model decides when to call tools
3. Model returns function name + arguments
4. You execute function (in your code)
5. Send result back to model
6. Model generates final response using function result
```

### Defining Tools

**Example (Get Weather):**
```json
{
  "model": "gpt-4o",
  "messages": [{"role": "user", "content": "What's the weather in San Francisco?"}],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_current_weather",
        "description": "Get the current weather for a city",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City name, e.g., 'San Francisco'"
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
    }
  ],
  "tool_choice": "auto"
}
```

**tool_choice Options:**
- `"auto"` - Model decides when to call tools (default)
- `"none"` - Never call tools (generate text only)
- `"required"` - Must call at least one tool
- `{"type": "function", "function": {"name": "tool_name"}}` - Force specific tool

### Handling Tool Calls

**Model Response (Tool Call):**
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": null,
        "tool_calls": [
          {
            "id": "call_abc123",
            "type": "function",
            "function": {
              "name": "get_current_weather",
              "arguments": "{\"location\": \"San Francisco\", \"unit\": \"fahrenheit\"}"
            }
          }
        ]
      },
      "finish_reason": "tool_calls"
    }
  ]
}
```

**Execute Function (Your Code):**
```javascript
const toolCall = response.choices[0].message.tool_calls[0];
const functionName = toolCall.function.name;
const functionArgs = JSON.parse(toolCall.function.arguments);

let functionResult;
if (functionName === "get_current_weather") {
  functionResult = await getWeather(functionArgs.location, functionArgs.unit);
  // Example: {temperature: 68, condition: "sunny"}
}
```

**Send Result Back:**
```json
{
  "model": "gpt-4o",
  "messages": [
    {"role": "user", "content": "What's the weather in San Francisco?"},
    {
      "role": "assistant",
      "content": null,
      "tool_calls": [
        {
          "id": "call_abc123",
          "type": "function",
          "function": {
            "name": "get_current_weather",
            "arguments": "{\"location\": \"San Francisco\", \"unit\": \"fahrenheit\"}"
          }
        }
      ]
    },
    {
      "role": "tool",
      "tool_call_id": "call_abc123",
      "content": "{\"temperature\": 68, \"condition\": \"sunny\"}"
    }
  ],
  "tools": [...]
}
```

**Final Response:**
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "The weather in San Francisco is currently 68°F and sunny."
      },
      "finish_reason": "stop"
    }
  ]
}
```

### Parallel Tool Calling

**Model Can Call Multiple Tools Simultaneously:**

```json
{
  "tool_calls": [
    {"id": "call_1", "function": {"name": "get_weather", "arguments": "{\"city\": \"NYC\"}"}},
    {"id": "call_2", "function": {"name": "get_weather", "arguments": "{\"city\": \"LA\"}"}},
    {"id": "call_3", "function": {"name": "get_weather", "arguments": "{\"city\": \"Chicago\"}"}}
  ]
}
```

**Execute All, Return All:**
```json
{
  "messages": [
    ...,
    {"role": "tool", "tool_call_id": "call_1", "content": "{\"temp\": 55}"},
    {"role": "tool", "tool_call_id": "call_2", "content": "{\"temp\": 72}"},
    {"role": "tool", "tool_call_id": "call_3", "content": "{\"temp\": 48}"}
  ]
}
```

---

## Structured Outputs (JSON Mode)

### JSON Object Mode

**Force valid JSON response:**

```json
{
  "model": "gpt-4o",
  "messages": [
    {"role": "system", "content": "Extract user info as JSON"},
    {"role": "user", "content": "John Doe, age 30, lives in NYC, email: john@example.com"}
  ],
  "response_format": { "type": "json_object" }
}
```

**Response:**
```json
{
  "choices": [
    {
      "message": {
        "content": "{\"name\": \"John Doe\", \"age\": 30, \"city\": \"NYC\", \"email\": \"john@example.com\"}"
      }
    }
  ]
}
```

**Requirements:**
- Must include "JSON" in system/user message
- Output is guaranteed valid JSON (no syntax errors)
- No schema enforcement (any JSON structure)

### JSON Schema Mode (Strict)

**Enforce specific JSON schema:**

```json
{
  "model": "gpt-4o",
  "messages": [...],
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "user_profile",
      "schema": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "age": {"type": "integer"},
          "email": {"type": "string", "format": "email"}
        },
        "required": ["name", "age", "email"],
        "additionalProperties": false
      },
      "strict": true
    }
  }
}
```

**Guaranteed Output:**
- Matches schema exactly
- No extra fields
- Correct types (string, integer, boolean, etc.)
- Required fields always present

**Use Cases:**
- Database inserts (ensure schema match)
- API responses (contract enforcement)
- Data extraction (structured from unstructured text)

---

## Responses API (Beta)

### Overview

High-level framework for building agents (replaces Assistants API, which sunsets mid-2026).

**Key Features:**
- Thread management (conversation history)
- Tool calling (built-in)
- Streaming support
- State management
- Multi-turn interactions

**Availability:** All API tiers (rate limits apply)

### Creating an Agent

**Request:**
```bash
curl https://api.openai.com/v1/agents \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "name": "Customer Support Bot",
    "instructions": "You help customers with product questions. Be friendly and concise.",
    "tools": [{"type": "code_interpreter"}]
  }'
```

**Response:**
```json
{
  "id": "agent_abc123",
  "object": "agent",
  "created_at": 1735353600,
  "name": "Customer Support Bot",
  "model": "gpt-4o",
  "instructions": "You help customers with product questions...",
  "tools": [{"type": "code_interpreter"}]
}
```

### Creating a Thread

**Threads = Conversation history containers**

```bash
curl https://api.openai.com/v1/threads \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response:**
```json
{
  "id": "thread_xyz789",
  "object": "thread",
  "created_at": 1735353600
}
```

### Adding Messages

```bash
curl https://api.openai.com/v1/threads/thread_xyz789/messages \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "user",
    "content": "How do I reset my password?"
  }'
```

### Running the Agent

```bash
curl https://api.openai.com/v1/threads/thread_xyz789/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agent_abc123"
  }'
```

**Response:**
```json
{
  "id": "run_def456",
  "object": "run",
  "status": "queued",
  "thread_id": "thread_xyz789",
  "agent_id": "agent_abc123"
}
```

**Check Status:**
```bash
curl https://api.openai.com/v1/threads/thread_xyz789/runs/run_def456 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**When completed:**
```json
{
  "id": "run_def456",
  "status": "completed",
  "thread_id": "thread_xyz789"
}
```

**Retrieve Messages:**
```bash
curl https://api.openai.com/v1/threads/thread_xyz789/messages \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**Response:**
```json
{
  "data": [
    {
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": {
            "value": "To reset your password, go to Settings > Account > Reset Password. You'll receive an email with instructions."
          }
        }
      ]
    },
    {
      "role": "user",
      "content": [{"type": "text", "text": {"value": "How do I reset my password?"}}]
    }
  ]
}
```

### Streaming Runs

```bash
curl https://api.openai.com/v1/threads/thread_xyz789/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agent_abc123",
    "stream": true
  }'
```

**SSE Events:**
```
event: thread.run.created
data: {"id":"run_abc","status":"queued"}

event: thread.message.created
data: {"id":"msg_123","role":"assistant"}

event: thread.message.delta
data: {"delta":{"content":[{"type":"text","text":{"value":"To reset"}}]}}

event: thread.run.completed
data: {"id":"run_abc","status":"completed"}
```

---

## Agents SDK (Beta)

### Overview

Python library for building autonomous agents with Responses API.

**Installation:**
```bash
pip install openai-agents
```

### Basic Agent

```python
from openai import OpenAI
from openai_agents import Agent

client = OpenAI(api_key="your-api-key")

agent = Agent(
    client=client,
    model="gpt-4o",
    instructions="You are a helpful math tutor. Solve problems step-by-step.",
)

# Run agent
response = agent.run("Solve: 2x + 5 = 15")
print(response.content)
# Output: "To solve 2x + 5 = 15:
# Step 1: Subtract 5 from both sides: 2x = 10
# Step 2: Divide by 2: x = 5
# Answer: x = 5"
```

### Agent with Tools

```python
from openai_agents import Agent, tool

@tool
def calculate(expression: str) -> float:
    """Evaluate a mathematical expression."""
    return eval(expression)  # In production, use safe_eval

@tool
def get_stock_price(symbol: str) -> float:
    """Get current stock price for a symbol."""
    # Call external API
    return 150.25  # Example

agent = Agent(
    model="gpt-4o",
    instructions="You help with financial calculations.",
    tools=[calculate, get_stock_price],
)

response = agent.run("If I buy 10 shares of AAPL at current price, how much will it cost?")
# Agent will:
# 1. Call get_stock_price("AAPL") → 150.25
# 2. Call calculate("10 * 150.25") → 1502.5
# 3. Generate: "Buying 10 shares of AAPL at $150.25 per share will cost $1,502.50."
```

### Stateful Agents (Threads)

```python
agent = Agent(model="gpt-4o", instructions="You remember our conversation.")

# First interaction
thread_id = agent.create_thread()
agent.run("My name is Alice", thread_id=thread_id)

# Later interaction (same thread)
response = agent.run("What's my name?", thread_id=thread_id)
print(response.content)
# Output: "Your name is Alice."
```

### File Access (Code Interpreter)

```python
agent = Agent(
    model="gpt-4o",
    instructions="Analyze CSV files and create charts.",
    tools=["code_interpreter"],
)

# Upload file
file = client.files.create(file=open("sales_data.csv", "rb"), purpose="agents")

# Run analysis
response = agent.run(
    "Analyze this sales data and create a bar chart of revenue by region",
    file_ids=[file.id],
)
```

---

## Hosted MCP (Beta)

### Overview

OpenAI hosts MCP servers for you (no infrastructure management).

**Use Cases:**
- Internal tools (database access, APIs)
- No server hosting needed
- Integrated with Responses API

**Setup:**
```python
from openai_agents import Agent, hosted_mcp

mcp_server = hosted_mcp.create({
    "name": "my-db",
    "type": "postgresql",
    "connection_string": os.getenv("DATABASE_URL"),
})

agent = Agent(
    model="gpt-4o",
    instructions="Query our customer database to answer questions.",
    mcp_servers=[mcp_server],
)

response = agent.run("How many customers signed up last month?")
# Agent queries database via MCP and responds
```

---

## Fine-Tuning

### Overview

Train custom models on your data for improved performance on specific tasks.

**Supported Models:**
- GPT-4o (full fine-tuning + DPO)
- GPT-4.1 (supervised only)
- GPT-5.2 (coming Q1 2026)

**Methods:**
1. **Supervised Fine-Tuning (SFT)** - Train on input-output examples
2. **Direct Preference Optimization (DPO)** - Train on ranked outputs (GPT-4o only)

### Data Format (SFT)

**JSONL file (messages format):**
```jsonl
{"messages": [{"role": "system", "content": "You are a product expert."}, {"role": "user", "content": "What's the return policy?"}, {"role": "assistant", "content": "30-day money-back guarantee."}]}
{"messages": [{"role": "user", "content": "Do you ship internationally?"}, {"role": "assistant", "content": "Yes, we ship to 50+ countries."}]}
```

**Requirements:**
- Min 10 examples (recommend 50-100 for quality)
- Max 1M examples
- Each example = full conversation (system + user + assistant)

### Creating Fine-Tune Job

**1. Upload Training Data:**
```bash
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F purpose="fine-tune" \
  -F file="@training_data.jsonl"
```

**2. Create Fine-Tune:**
```bash
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "training_file": "file-abc123",
    "model": "gpt-4o",
    "hyperparameters": {
      "n_epochs": 3
    }
  }'
```

**3. Monitor Progress:**
```bash
curl https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**4. Use Fine-Tuned Model:**
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "ft:gpt-4o:org:custom-model:abc123",
    "messages": [{"role": "user", "content": "What's the return policy?"}]
  }'
```

### Pricing

**Training:**
- GPT-4o: $25/1M tokens
- GPT-5.2: $35/1M tokens (estimated)

**Inference:**
- 3x base model price
- Example: GPT-4o fine-tuned = $7.50/$30 per 1M tokens (vs $2.50/$10 base)

**Storage:**
- $10/model/month

---

## Batch API

### Overview

Process requests asynchronously with 50% cost discount.

**Use Cases:**
- Data labeling (1M records)
- Content moderation (bulk)
- Large-scale analysis

**Limitations:**
- 24-hour completion window (not real-time)
- No streaming
- Max 50,000 requests per batch

### Creating a Batch

**1. Prepare Batch File (JSONL):**
```jsonl
{"custom_id": "request-1", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "gpt-4o", "messages": [{"role": "user", "content": "Classify: This product is great!"}]}}
{"custom_id": "request-2", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "gpt-4o", "messages": [{"role": "user", "content": "Classify: Terrible service."}]}}
```

**2. Upload:**
```bash
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F purpose="batch" \
  -F file="@batch_input.jsonl"
```

**3. Create Batch:**
```bash
curl https://api.openai.com/v1/batches \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "input_file_id": "file-abc123",
    "endpoint": "/v1/chat/completions",
    "completion_window": "24h"
  }'
```

**4. Check Status:**
```bash
curl https://api.openai.com/v1/batches/batch_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**5. Download Results:**
```bash
curl https://api.openai.com/v1/files/file-output123/content \
  -H "Authorization: Bearer $OPENAI_API_KEY" > results.jsonl
```

**Results Format:**
```jsonl
{"id": "batch_req_abc", "custom_id": "request-1", "response": {"status_code": 200, "body": {"choices": [{"message": {"content": "Positive"}}]}}}
{"id": "batch_req_def", "custom_id": "request-2", "response": {"status_code": 200, "body": {"choices": [{"message": {"content": "Negative"}}]}}}
```

---

## Embeddings

### Overview

Convert text to vector representations for semantic search, clustering, classification.

**Models:**
- **text-embedding-3-small:** 256-1536 dimensions, $0.02/1M tokens
- **text-embedding-3-large:** 256-3072 dimensions, $0.13/1M tokens

### Usage

```bash
curl https://api.openai.com/v1/embeddings \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "text-embedding-3-large",
    "input": "OpenAI builds AI models",
    "dimensions": 1536
  }'
```

**Response:**
```json
{
  "data": [
    {
      "embedding": [0.0023, -0.009, 0.015, ...],
      "index": 0
    }
  ],
  "model": "text-embedding-3-large",
  "usage": {"prompt_tokens": 5, "total_tokens": 5}
}
```

### Use Cases

**Semantic Search:**
```python
# 1. Embed documents
docs = ["Paris is the capital of France", "London is in the UK"]
doc_embeddings = [get_embedding(doc) for doc in docs]

# 2. Embed query
query = "What's the capital of France?"
query_embedding = get_embedding(query)

# 3. Find most similar (cosine similarity)
similarities = [cosine_similarity(query_embedding, doc_emb) for doc_emb in doc_embeddings]
best_match = docs[np.argmax(similarities)]
# Result: "Paris is the capital of France"
```

**Clustering:**
```python
from sklearn.cluster import KMeans

embeddings = [get_embedding(text) for text in texts]
kmeans = KMeans(n_clusters=5)
clusters = kmeans.fit_predict(embeddings)
```

---

## Production Best Practices

### Rate Limiting

**Implement Exponential Backoff:**
```python
import time
from openai import RateLimitError

def call_with_retry(func, max_retries=5):
    for i in range(max_retries):
        try:
            return func()
        except RateLimitError:
            wait_time = 2 ** i  # 1s, 2s, 4s, 8s, 16s
            print(f"Rate limited. Retrying in {wait_time}s...")
            time.sleep(wait_time)
    raise Exception("Max retries exceeded")

response = call_with_retry(lambda: openai.chat.completions.create(...))
```

### Error Handling

```python
from openai import OpenAIError, APIError, AuthenticationError

try:
    response = openai.chat.completions.create(...)
except AuthenticationError:
    print("Invalid API key")
except APIError as e:
    print(f"API error: {e.status_code} - {e.message}")
except OpenAIError as e:
    print(f"General error: {e}")
```

### Caching

```python
import hashlib
import redis

cache = redis.Redis()

def get_completion_cached(messages):
    # Hash messages for cache key
    key = hashlib.md5(str(messages).encode()).hexdigest()
    
    # Check cache
    cached = cache.get(key)
    if cached:
        return json.loads(cached)
    
    # Call API
    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=messages,
    )
    
    # Cache result (1 hour TTL)
    cache.setex(key, 3600, json.dumps(response.dict()))
    return response
```

### Monitoring

**Log Requests:**
```python
import logging

logger = logging.getLogger(__name__)

def log_request(messages, response):
    logger.info({
        "messages": messages,
        "response": response.choices[0].message.content,
        "tokens": response.usage.total_tokens,
        "cost": calculate_cost(response.usage),
        "latency": response.response_ms,
    })
```

**Track Metrics:**
- Requests per minute (QPM)
- Tokens per minute (TPM)
- Latency (p50, p95, p99)
- Error rate (4xx, 5xx)
- Cost (tokens × price per token)

**Alerts:**
- Error rate >1% for 2 minutes → Page
- Latency >5s for 5 minutes → Slack
- Daily cost >$1,000 → Email

---

## Resources

**Official Docs:**
- API Reference: https://platform.openai.com/docs/api-reference
- Guides: https://platform.openai.com/docs/guides
- Cookbook (GitHub): https://github.com/openai/openai-cookbook

**Libraries:**
- Python SDK: https://github.com/openai/openai-python
- Node.js SDK: https://github.com/openai/openai-node
- Agents SDK: https://github.com/openai/agents-sdk (Beta)

**Community:**
- Developer Forum: https://community.openai.com
- Discord: https://discord.gg/openai

---

**End of API Integration Guide**
