# AI Architecture Patterns Reference

## Pattern Library

### 1. RAG (Retrieval-Augmented Generation)

**Use When:**
- Need to answer questions from private knowledge base
- Documents change frequently (can't fine-tune)
- Require citations/sources for answers

**Architecture:**
```
Documents → Chunking → Embeddings → Vector DB
                                        ↓
User Question → Embedding → Similarity Search → Top-K Chunks
                                                     ↓
                                    LLM (Question + Context) → Answer
```

**Components:**
- **Chunking:** 500-1000 tokens per chunk, 100 token overlap
- **Embeddings:** OpenAI text-embedding-3-small (cost-effective)
- **Vector DB:** Pinecone (managed), Qdrant (self-hosted), or PGVector (Postgres extension)
- **Retrieval:** Top-5 chunks, rerank with cross-encoder
- **LLM:** Claude for quality, GPT-4 for cost balance

**Cost Profile:**
- Embedding: $0.00002/1K tokens
- Vector DB: $70/month (1M vectors)
- LLM: $0.015/1K tokens (Claude Sonnet)
- **Total:** ~$0.02 per query (with 5 chunks retrieved)

**Latency:** 500-800ms (embedding 100ms + vector search 100ms + LLM 300-500ms)

---

### 2. Agent Workflows

**Use When:**
- Multi-step reasoning required
- Need to call external APIs/tools
- Decision trees with branching logic

**Architecture:**
```
User Input → Agent (LLM)
              ↓
        Tool Selection
              ↓
     ┌────────┴────────┐
     ↓                 ↓
Web Search      Database Query
     ↓                 ↓
     └────────┬────────┘
              ↓
        Synthesize Results
              ↓
         Final Answer
```

**Frameworks:**
- **LangChain:** Python/JS, largest ecosystem
- **LlamaIndex:** Data-focused, simpler API
- **AutoGPT:** Autonomous agents
- **Custom:** For production reliability

**Cost Profile:**
- **Multi-turn:** 3-5 LLM calls per user query
- **Cost Multiplier:** 3-5x vs single LLM call
- **Mitigation:** Cache intermediate results, use cheaper models for routing

**Latency:** 2-5 seconds (multiple LLM round trips)

---

### 3. Classification + Routing

**Use When:**
- Route requests to specialized models/handlers
- Tier-1 automation (90% accuracy threshold)
- Intent detection for chatbots

**Architecture:**
```
User Input → Classifier (Fast Model)
                  ↓
         ┌────────┼────────┐
         ↓        ↓        ↓
    Route A   Route B   Route C
    (Haiku)   (Sonnet)  (Human)
```

**Model Selection:**
- **Classifier:** Claude Haiku (10x cheaper, <200ms)
- **Handlers:** Route to appropriate model based on complexity

**Cost Profile:**
- **Classification:** $0.00025/1K tokens (Haiku)
- **90% routed to Haiku:** $0.00025/request
- **10% routed to Sonnet:** $0.015/request
- **Blended Cost:** $0.0018/request (7.5x cheaper than all-Sonnet)

**Latency:** 150-300ms (single fast model call)

---

### 4. Caching Strategies

**Use When:**
- High volume of similar requests
- Cost optimization priority
- Acceptable staleness (hours/days)

**Types:**

**Exact Match Cache:**
```
User Query → Hash → Redis Lookup
                      ↓ (hit)
                   Cached Response
                      ↓ (miss)
                   LLM → Cache → Response
```
- **Hit Rate:** 15-25% for FAQs
- **TTL:** 24 hours typical
- **Cost Savings:** 100% on cache hits

**Semantic Cache:**
```
User Query → Embedding → Vector Similarity Search
                           ↓ (similarity > 0.95)
                        Cached Response
                           ↓ (similarity < 0.95)
                        LLM → Cache → Response
```
- **Hit Rate:** 30-50% with good coverage
- **TTL:** 24 hours typical
- **Cost Savings:** 95% on semantic hits (small embedding cost)

**Implementation:**
```python
# Redis + Vector Similarity
import redis
from openai import OpenAI

redis_client = redis.Redis(host='localhost', port=6379)
openai_client = OpenAI()

def semantic_cache_lookup(query, threshold=0.95):
    # Get query embedding
    embedding = openai_client.embeddings.create(
        input=query,
        model="text-embedding-3-small"
    ).data[0].embedding
    
    # Vector similarity search in Redis
    # (requires RediSearch module)
    similar = redis_client.ft("cache_idx").search(
        Query(f"*=>[KNN 5 @embedding $vec]")
            .return_field("response")
            .dialect(2),
        query_params={"vec": embedding}
    )
    
    if similar.total > 0 and similar.docs[0].score > threshold:
        return similar.docs[0].response
    return None
```

---

### 5. Multi-Model Orchestration

**Use When:**
- Need different models for different tasks
- Reliability via fallbacks
- Cost optimization

**Architecture:**
```
Request → Router
           ↓
    ┌──────┴──────┐
    ↓             ↓
Primary Model  Fallback Model
 (Claude)       (GPT-4)
    ↓             ↓
    └──────┬──────┘
           ↓
      Response
```

**Routing Logic:**
```python
async def get_completion(prompt, task_type):
    if task_type == "creative_writing":
        return await call_claude(prompt)
    elif task_type == "code_generation":
        return await call_gpt4(prompt)
    elif task_type == "classification":
        return await call_haiku(prompt)  # Cheapest
```

**Fallback Strategy:**
```python
async def get_completion_with_fallback(prompt):
    try:
        response = await call_claude(prompt, timeout=2.0)
        return response
    except (TimeoutError, APIError):
        # Log fallback event
        logger.warning("Claude failed, falling back to GPT-4")
        return await call_gpt4(prompt)
```

---

## Scalability Patterns

### Horizontal Scaling

**Serverless (Recommended for <1000 RPS):**
- **Platform:** Vercel, AWS Lambda, Cloudflare Workers
- **Pros:** Zero-config scaling, pay-per-use
- **Cons:** Cold starts (200-500ms), regional limits
- **Max RPS:** ~1000 per function

**Container-based (For >1000 RPS):**
- **Platform:** ECS Fargate, GKE Autopilot, Fly.io
- **Pros:** Faster response, more control, higher throughput
- **Cons:** Operational overhead, minimum costs
- **Max RPS:** 10K+ with load balancing

### Database Scaling

**Postgres (Supabase/Neon):**
- **Connection Pooling:** PgBouncer (required for serverless)
- **Read Replicas:** For >1000 QPS
- **Partitioning:** By customer_id for multi-tenant

**Vector Database:**
- **Pinecone Serverless:** Auto-scales, 100ms p99
- **Qdrant:** Self-hosted, requires scaling config
- **PGVector:** For <1M vectors, uses existing Postgres

---

## Security Patterns

### API Key Management

**Never:**
```javascript
// ❌ Hardcoded keys
const ANTHROPIC_KEY = "sk-ant-1234..."
```

**Always:**
```javascript
// ✅ Environment variables
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
```

### Rate Limiting

**Per-User Limits:**
```python
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter

@app.post("/api/chat")
@RateLimiter(times=10, seconds=60)  # 10 requests per minute
async def chat(request: ChatRequest):
    ...
```

**Cost Guardrails:**
```python
# Track spend per customer
async def check_budget(customer_id: str, estimated_cost: float):
    current_spend = await get_monthly_spend(customer_id)
    budget_limit = await get_customer_budget(customer_id)
    
    if current_spend + estimated_cost > budget_limit:
        raise BudgetExceededError(
            f"Monthly budget ${budget_limit} exceeded"
        )
```

---

## Monitoring Patterns

### LLM Observability

**Essential Metrics:**
```python
# Langfuse tracing
from langfuse import Langfuse

langfuse = Langfuse()

trace = langfuse.trace(
    name="customer_support_query",
    user_id=user_id,
    metadata={
        "customer_id": customer_id,
        "ticket_id": ticket_id
    }
)

# Track LLM call
span = trace.span(
    name="claude_completion",
    input=prompt,
    metadata={
        "model": "claude-sonnet-4",
        "temperature": 0.7
    }
)

response = await claude.complete(prompt)

span.end(
    output=response,
    usage={
        "input_tokens": response.usage.input_tokens,
        "output_tokens": response.usage.output_tokens
    }
)

# Calculate cost
cost = (
    response.usage.input_tokens * CLAUDE_INPUT_PRICE +
    response.usage.output_tokens * CLAUDE_OUTPUT_PRICE
) / 1000

span.score(
    name="cost",
    value=cost
)
```

**Dashboard Metrics:**
- **Latency:** p50, p95, p99 response times
- **Cost:** $ per request, $ per user, $ per day
- **Quality:** Hallucination rate, user satisfaction score
- **Reliability:** Error rate, fallback rate, cache hit rate

---

## Cost Optimization Patterns

### 1. Model Tiering

```python
def select_model(query_complexity):
    if query_complexity < 0.3:  # Simple FAQ
        return "claude-haiku"  # $0.00025/1K tokens
    elif query_complexity < 0.7:  # Moderate
        return "claude-sonnet"  # $0.015/1K tokens
    else:  # Complex reasoning
        return "claude-opus"  # $0.075/1K tokens
```

**Savings:** 10x on simple queries

### 2. Prompt Compression

```python
# Before: 2000 tokens
long_prompt = f"""
{system_instructions}
{few_shot_examples}
{user_query}
"""

# After: 500 tokens (4x cheaper)
compressed_prompt = compress_examples(few_shot_examples)
```

**Savings:** 75% token reduction

### 3. Batching

```python
# Process 100 classifications in single call
batch_results = await claude.complete(
    prompt=f"Classify these tickets:\n{json.dumps(tickets)}"
)
```

**Savings:** 100x fewer API calls (reduced overhead)

---

## Compliance Patterns

### GDPR Right to Delete

```python
async def handle_data_deletion(user_id: str):
    # 1. Delete from application DB
    await db.delete_user_data(user_id)
    
    # 2. Delete from vector DB
    await pinecone.delete(filter={"user_id": user_id})
    
    # 3. Delete from cache
    await redis.delete_pattern(f"user:{user_id}:*")
    
    # 4. Purge from LLM provider logs (if supported)
    # Note: Most LLM providers don't support this
    # Mitigation: Don't send PII to LLM
```

### SOC 2 Audit Trails

```python
# Log all LLM interactions
await audit_log.create({
    "timestamp": datetime.utcnow(),
    "user_id": user_id,
    "action": "llm_query",
    "input_hash": hashlib.sha256(prompt.encode()).hexdigest(),
    "model": "claude-sonnet-4",
    "output_hash": hashlib.sha256(response.encode()).hexdigest(),
    "tokens_used": response.usage.total_tokens,
    "cost": cost
})
```

---

## Reference Architectures

See `/assets/reference-architectures/` for full diagrams:
- `customer-support-ai.pdf`
- `document-qa-enterprise.pdf`
- `sales-intelligence-platform.pdf`
- `code-generation-saas.pdf`
