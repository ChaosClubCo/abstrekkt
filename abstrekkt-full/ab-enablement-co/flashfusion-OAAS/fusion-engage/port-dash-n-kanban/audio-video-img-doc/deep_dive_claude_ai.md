# Claude AIaaS, Service Warden & Prompt Engineering – Deep‑Dive Playbook

## Part 1 – AIaaS Multi‑Tenant Code Scaffold

### 1. High‑Level Architecture

A Claude‑powered AI‑as‑a‑Service (AIaaS) platform must securely isolate each client while giving them access to configurable Claude agents. Anthropic’s enterprise models (e.g. **Claude 3.5 Sonnet** and **Claude 3.5 Opus**) provide long‑context reasoning (up to **200K tokens**【499590965886186†L26-L36】), high accuracy【499590965886186†L40-L52】 and strong vision support【499590965886186†L65-L73】, making them suitable for multi‑tenant deployments. Coupled with **Claude Code** (bundled with enterprise plans【122381964807983†L92-L125】), the platform can offer code‑generation and automation capabilities. 

**Key design principles**:

1. **Multi‑tenant isolation** – each customer (tenant) has its own namespace for prompts, embeddings and billing.
2. **Pluggable personas** – tenants define department‑specific agents via system prompts (see Part 3), stored per tenant.
3. **RAG layer** – each tenant has a vector store namespace for retrieving internal knowledge; Claude’s context limit (200K tokens【499590965886186†L26-L36】) permits large document injection.
4. **Usage metering** – track API calls and tokens to implement usage‑based pricing. Anthropic charges $3/M input tokens and $15/M output tokens for Sonnet【499590965886186†L31-L36】.
5. **Secure deployment** – leverage AWS Bedrock or Anthropic’s API with IAM, encryption and VPC isolation. Anthropic emphasises privacy and does not train on user data【499590965886186†L90-L119】.

### 2. Data Model

| Entity | Description |
|---|---|
| `Tenant` | Represents a client organisation. Contains `id`, `name`, `api_key`, `billing_plan`, `token_usage` and `vector_namespace`. |
| `Persona` | A department‑specific system prompt (see Part 3) linked to a `Tenant`. Contains `id`, `tenant_id`, `name`, `system_prompt`, `temperature`, `model` (e.g. `claude-3.5-sonnet`), `max_tokens`, `description`. |
| `Document` | A file or record uploaded by a tenant for retrieval (RAG). Contains `id`, `tenant_id`, `path`, `embedding_id`, `metadata`. |
| `ChatSession` | Stores history per user/agent session, with `tenant_id`, `persona_id`, `messages`. Useful for compliance/audit. |
| `UsageRecord` | Logs every API call: `tenant_id`, `persona_id`, `timestamp`, `tokens_in`, `tokens_out`, `cost`. |

### 3. Core Services

1. **API Gateway** – exposes REST/GraphQL endpoints for client interaction and internal administration. Each request includes `tenant_id` (via bearer token/API key) for isolation.
2. **Orchestrator Service** – routes requests to the correct persona, injects RAG context, calls Claude API, and logs usage. It also enforces token limits per plan.
3. **RAG Service** – manages embeddings. Uses vector databases like Weaviate, Pinecone or Qdrant. Each tenant has its own namespace. Documents are embedded using Claude or a separate embedding model (e.g. `text-embedding-ada-002`) and stored with metadata. For queries, relevant chunks are retrieved and prepended to the prompt.
4. **Billing Service** – aggregates `UsageRecord`s to compute monthly costs per tenant. Supports tiered plans (free, pro, enterprise) and usage overage charges.
5. **Admin Dashboard** – internal UI for tenant provisioning, persona management and usage monitoring.
6. **Client Portal** – optional white‑label UI for clients to manage their agents, upload documents and view usage.
7. **Auth Service** – issues API keys and handles user authentication. Can integrate with Auth0 or Cognito for multi‑tenant identity management.

### 4. Python/Node Code Scaffold

#### 4.1. Python (FastAPI + SQLAlchemy)

Below is a simplified scaffold for the orchestrator in Python. It assumes a PostgreSQL database and a vector DB (`weaviate_client`). Error handling, retries and input sanitisation are kept minimal for brevity.

```python
# file: orchestrator.py
from fastapi import FastAPI, Depends, HTTPException, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session
import anthropic
import uuid, datetime
from database import get_db, Tenant, Persona, UsageRecord
from rag import query_vector_store

app = FastAPI()

# Anthropic client configuration
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

class ChatRequest(BaseModel):
    persona_id: str
    message: str

class ChatResponse(BaseModel):
    response: str
    cost: float
    tokens_in: int
    tokens_out: int

# Dependency to resolve tenant via header
async def get_current_tenant(x_api_key: str = Header(...), db: Session = Depends(get_db)) -> Tenant:
    tenant = db.query(Tenant).filter_by(api_key=x_api_key).first()
    if not tenant:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return tenant

@app.post("/v1/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest, tenant: Tenant = Depends(get_current_tenant), db: Session = Depends(get_db)):
    persona = db.query(Persona).filter_by(id=payload.persona_id, tenant_id=tenant.id).first()
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")

    # Retrieve relevant RAG context
    rag_context = query_vector_store(namespace=tenant.vector_namespace, query=payload.message, top_k=5)

    system_prompt = persona.system_prompt
    # Build messages: system + RAG + user
    messages = [
        {"role": "system", "content": system_prompt},
    ]
    for chunk in rag_context:
        messages.append({"role": "system", "content": f"\n[CONTEXT]\n{chunk.text}\n"})
    messages.append({"role": "user", "content": payload.message})

    # Call Claude (ChatCompletion API)
    resp = client.messages.create(
        model=persona.model,
        max_tokens=persona.max_tokens,
        temperature=persona.temperature,
        messages=messages,
    )

    tokens_in = resp.usage.input_tokens
    tokens_out = resp.usage.output_tokens

    # Calculate cost (Sonnet pricing) – adjust for other models
    cost = (tokens_in / 1e6) * 3 + (tokens_out / 1e6) * 15

    # Log usage
    usage = UsageRecord(
        id=str(uuid.uuid4()),
        tenant_id=tenant.id,
        persona_id=persona.id,
        timestamp=datetime.datetime.utcnow(),
        tokens_in=tokens_in,
        tokens_out=tokens_out,
        cost=cost,
    )
    db.add(usage)
    db.commit()

    return ChatResponse(response=resp.content, cost=cost, tokens_in=tokens_in, tokens_out=tokens_out)
```

**Key considerations**:

- `get_current_tenant` resolves the tenant via an API key. It ensures requests are scoped.
- The RAG service is abstracted behind `query_vector_store`; it returns the most relevant document fragments.
- `UsageRecord` logs per‑call usage for billing.
- The cost formula uses Sonnet pricing from Anthropic’s announcement【499590965886186†L31-L36】.
- Additional endpoints (not shown) would handle persona creation, document upload/embedding and admin functions.

#### 4.2. Node.js (Express + Prisma)

A parallel implementation in Node uses Express for routing and Prisma for database access. Here’s a skeleton for the same `/v1/chat` endpoint:

```javascript
// file: orchestrator.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const Anthropic = require('@anthropic-ai/sdk');
const { queryVectorStore } = require('./rag');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Middleware to load tenant
async function loadTenant(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  const tenant = await prisma.tenant.findUnique({ where: { api_key: apiKey } });
  if (!tenant) return res.status(401).json({ error: 'Invalid API key' });
  req.tenant = tenant;
  next();
}

app.post('/v1/chat', loadTenant, async (req, res) => {
  const { personaId, message } = req.body;
  const tenant = req.tenant;
  const persona = await prisma.persona.findFirst({
    where: { id: personaId, tenantId: tenant.id },
  });
  if (!persona) return res.status(404).json({ error: 'Persona not found' });

  // Retrieve RAG context
  const contextChunks = await queryVectorStore(tenant.vectorNamespace, message, 5);

  const messages = [];
  messages.push({ role: 'system', content: persona.systemPrompt });
  contextChunks.forEach((chunk) => {
    messages.push({ role: 'system', content: `\n[CONTEXT]\n${chunk.text}\n` });
  });
  messages.push({ role: 'user', content: message });

  const response = await anthropic.messages.create({
    model: persona.model,
    maxTokens: persona.maxTokens,
    temperature: persona.temperature,
    messages,
  });

  const tokensIn = response.usage.input_tokens;
  const tokensOut = response.usage.output_tokens;
  const cost = (tokensIn / 1e6) * 3 + (tokensOut / 1e6) * 15;

  await prisma.usageRecord.create({
    data: {
      id: require('crypto').randomUUID(),
      tenantId: tenant.id,
      personaId: persona.id,
      timestamp: new Date(),
      tokensIn,
      tokensOut,
      cost,
    },
  });

  res.json({ response: response.content, cost, tokensIn, tokensOut });
});

app.listen(8080, () => console.log('Orchestrator listening on port 8080'));
```

This Node scaffold mirrors the Python version. Use environment variables for API keys and ensure errors are handled in production code.

### 5. Billing & Plan Management

The **Billing Service** aggregates usage and applies plan rules. For example:

```python
# file: billing.py
from sqlalchemy.orm import Session
from models import Tenant, UsageRecord
from datetime import datetime, timedelta

PLAN_LIMITS = {
    'free':    {'monthly_tokens': 50_000, 'rate': 0},
    'pro':     {'monthly_tokens': 1_000_000, 'rate': 0.00002},  # custom per‑token rate
    'enterprise': {'monthly_tokens': 10_000_000, 'rate': 0.000015},
}

def calculate_monthly_invoice(db: Session, tenant: Tenant, period_start: datetime, period_end: datetime):
    records = db.query(UsageRecord).filter(
        UsageRecord.tenant_id == tenant.id,
        UsageRecord.timestamp >= period_start,
        UsageRecord.timestamp < period_end,
    ).all()

    total_tokens = sum(r.tokens_in + r.tokens_out for r in records)
    plan = PLAN_LIMITS[tenant.billing_plan]

    if total_tokens <= plan['monthly_tokens']:
        return 0  # within quota
    extra_tokens = total_tokens - plan['monthly_tokens']
    cost = extra_tokens * plan['rate']
    return cost
```

In practice, you’ll also include the Anthropic API costs (input+output tokens) and any vector DB costs. The invoice can be generated per tenant and integrated with Stripe.

### 6. Security & Compliance

- **Encryption**: store API keys and sensitive fields encrypted at rest; use TLS for all network calls.
- **IAM & RBAC**: when using AWS Bedrock, configure IAM roles per tenant to restrict access; only call `bedrock:InvokeModel` with resource policies. Anthropic emphasises that they *do not train on user data unless given explicit permission*【499590965886186†L90-L119】, which is beneficial for B2B privacy.
- **Audit Logs**: log all prompts and responses per tenant for compliance; integrate with SIEM tools. Claude 3.5 includes **artifacts**—structured outputs like code or documents【499590965886186†L76-L84】—which can be stored securely in tenant‑specific storage.

### 7. Scalability & Operations

- Use container orchestration (Kubernetes/ECS) to scale the orchestrator and RAG services.
- Leverage serverless functions (AWS Lambda) for RAG embedding pipelines and scheduled billing tasks.
- Monitor token usage metrics; implement alerts to prevent cost overruns.
- Provide *tenant dashboards* with charts summarising usage and cost; Anthropic’s enterprise features (bundled with Claude Code【122381964807983†L92-L125】) include administrative control and spending limits【122381964807983†L159-L167】—replicate these in your AIaaS.

---

## Part 2 – Service Warden (IT/Support) Deep‑Dive

This section details how to use Claude to automate IT operations, integrate with **Freshservice** for ticket triage, and use **AWS CloudWatch** data to perform root‑cause analysis. Freshservice is an IT service management (ITSM) platform; CloudWatch is AWS’s monitoring service. You will build a “Service Warden” agent that monitors tickets and alerts, summarises issues, suggests solutions, and coordinates triage.

### 1. Objectives

- **Automate ticket triage**: classify incoming tickets by priority/severity, summarise the issue and suggest assignment to the correct team.
- **Generate incident summaries**: summarise conversations and updates for stakeholders.
- **Root‑cause analysis (RCA)**: retrieve CloudWatch logs and metrics for correlated alerts, summarise patterns, and propose likely causes.
- **Communicate proactively**: send notifications via Slack/Teams or email when critical incidents occur.

### 2. Architecture

1. **Event Sources**
   - **Freshservice Webhooks**: configure Freshservice to send webhooks on new/updated tickets. Each webhook triggers the Service Warden pipeline.
   - **AWS SNS/CloudWatch**: configure CloudWatch alarms to publish to SNS topics that forward alerts to the Service Warden (Freshservice also supports CloudWatch integration through webhooks【455703369274610†L117-L165】).

2. **Processing Pipeline**

```
Freshservice Ticket/CloudWatch Alert
          ↓
   Webhook Receiver (API Gateway/Lambda)
          ↓
   Event Handler (Service Warden)
    ├─ Fetch ticket details or alert metadata
    ├─ Retrieve recent conversation/context (Freshservice API)
    ├─ Pull relevant CloudWatch logs & metrics (CloudWatch Logs Insights, Metrics API)
    ├─ Construct prompt with system instructions + context
    ├─ Call Claude (e.g. 3.5 Sonnet)
    ├─ Parse response: classification, summary, recommended actions
    └─ Update Freshservice ticket with summary; optionally assign team or trigger workflows
```

3. **Components**

- **Webhook Receiver**: a lightweight HTTPS endpoint (e.g. AWS API Gateway + Lambda or Express server) that authenticates incoming requests.
- **Ticket Service**: a module that uses the Freshservice REST API to fetch ticket details. Freshservice’s API provides endpoints such as `/tickets`, `/ticket/{id}/conversations`. Authentication uses API tokens.
- **CloudWatch Service**: uses AWS SDK to run Log Insights queries or fetch metric data. You might store preconfigured queries per service (e.g., EC2 errors, Lambda logs).
- **Prompt Generator**: builds a system prompt with instructions (e.g. “You are a Service Warden for our IT team…”) and injects ticket text, conversation history, and log summaries. Claude’s long context (200K tokens【499590965886186†L26-L36】) allows combining logs and conversation text.
- **Inference Module**: calls Claude’s API via Sonnet/Opus models to get triage classification (e.g. `severity`, `urgency`, `assignment_team`), summarised problem statement, and recommended actions.
- **Ticket Updater**: posts the summary back into Freshservice via the API and sets custom fields or assignment groups accordingly. It may also send Slack notifications.

### 3. Implementation Steps

#### Step 1 – Freshservice Webhook Setup

1. In Freshservice, go to **Admin → Automation → Ticket Updates → Webhooks**.
2. Create a webhook trigger for new/updated tickets. Set the webhook URL to your Service Warden endpoint.
3. Configure the payload to include `ticket.id`, `subject`, `description`, `priority`, `status`, and a signature/header for verification.

Freshservice also supports CloudWatch integration directly: the support article notes that you can add CloudWatch as a **Monitoring Tool** under IT Operations Management【455703369274610†L117-L165】, obtaining an endpoint URL and Auth key. In our design, we may choose to ingest CloudWatch alerts via SNS to maintain control.

#### Step 2 – Webhook Receiver (Python Example)

```python
# file: service_warden.py
import hmac, hashlib, json, os, boto3
from fastapi import FastAPI, Header, HTTPException
from freshservice import FreshserviceClient
from cloudwatch import CloudWatchClient
from inference import classify_and_summarise

app = FastAPI()

# Shared secret for webhook verification
WEBHOOK_SECRET = os.getenv('FRESHSERVICE_WEBHOOK_SECRET')

fs_client = FreshserviceClient(domain=os.getenv('FS_DOMAIN'), api_key=os.getenv('FS_API_KEY'))
cw_client = CloudWatchClient()

@app.post('/freshservice/webhook')
async def handle_freshservice_event(request_body: dict, x_fs_signature: str = Header(...)):
    # Verify signature
    body_str = json.dumps(request_body, separators=(',', ':'), sort_keys=True)
    expected_sig = hmac.new(WEBHOOK_SECRET.encode(), body_str.encode(), hashlib.sha256).hexdigest()
    if expected_sig != x_fs_signature:
        raise HTTPException(status_code=401, detail='Invalid signature')

    ticket_id = request_body['ticket']['id']
    ticket = fs_client.get_ticket(ticket_id)
    conversations = fs_client.get_ticket_conversations(ticket_id)

    # Generate context from CloudWatch if tags indicate AWS resource
    aws_context = cw_client.collect_context(ticket)

    classification, summary, actions = classify_and_summarise(ticket, conversations, aws_context)

    # Update Freshservice ticket fields
    fs_client.update_ticket(ticket_id, {
        'custom_fields': {
            'severity': classification['severity'],
            'assignment_group': classification['team'],
        },
        'notes': summary + '\n\nRecommended Actions:\n' + '\n'.join(actions)
    })

    return {'status': 'processed'}
```

#### Step 3 – Freshservice Client

Implement a client using `requests` with proper headers:

```python
# file: freshservice.py
import requests, os

class FreshserviceClient:
    def __init__(self, domain: str, api_key: str):
        self.base = f"https://{domain}.freshservice.com/api/v2"
        self.auth = (api_key, 'X')  # FS uses API key as username

    def get_ticket(self, ticket_id: int):
        resp = requests.get(f"{self.base}/tickets/{ticket_id}", auth=self.auth)
        resp.raise_for_status()
        return resp.json()['ticket']

    def get_ticket_conversations(self, ticket_id: int):
        resp = requests.get(f"{self.base}/tickets/{ticket_id}/conversations", auth=self.auth)
        resp.raise_for_status()
        return resp.json()['conversations']

    def update_ticket(self, ticket_id: int, data: dict):
        resp = requests.put(f"{self.base}/tickets/{ticket_id}", json={'ticket': data}, auth=self.auth)
        resp.raise_for_status()
        return resp.json()['ticket']
```

#### Step 4 – CloudWatch Client

Use `boto3` to run Log Insights queries. For example:

```python
# file: cloudwatch.py
import boto3, datetime

class CloudWatchClient:
    def __init__(self, region: str = 'us-east-1'):
        self.logs = boto3.client('logs', region_name=region)
        self.metrics = boto3.client('cloudwatch', region_name=region)

    def collect_context(self, ticket: dict) -> str:
        # Example: if ticket contains an EC2 instance ID in custom fields
        instance_id = ticket.get('custom_fields', {}).get('ec2_instance_id')
        if not instance_id:
            return ''
        # Run a simple log insights query over the last hour
        end = int(datetime.datetime.utcnow().timestamp() * 1000)
        start = end - 3600 * 1000
        query = f"fields @timestamp, @message | filter @message like /{instance_id}/ | sort @timestamp desc | limit 20"
        log_group = f"/aws/ec2/{instance_id}"
        qid = self.logs.start_query(logGroupName=log_group, startTime=start, endTime=end, queryString=query)['queryId']
        response = None
        while not response or response['status'] == 'Running':
            response = self.logs.get_query_results(queryId=qid)
            time.sleep(2)
        lines = []
        for r in response['results']:
            msg = next(f['value'] for f in r if f['field'] == '@message')
            lines.append(msg)
        return '\n'.join(lines)
```

#### Step 5 – Inference & Prompt Engineering

Create a function that uses Claude to classify the ticket and summarise context. For example:

```python
# file: inference.py
import anthropic, os

client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

SYSTEM_PROMPT = """
You are Service Warden, an AI assistant for the IT/Support department. Your tasks:
1. Classify the ticket severity: Critical, High, Medium, Low based on impact and urgency.
2. Identify which internal team (e.g. Networking, DevOps, Security, DBA) should address it.
3. Produce a concise summary of the issue and any root‑cause insights from logs.
4. Recommend next actions, formatted as a bulleted list.
When unsure, ask clarifying questions. Keep responses neutral and professional.
"""


def classify_and_summarise(ticket: dict, conversations: list, aws_context: str):
    # Build context
    conv_text = '\n'.join([c['body_text'] for c in conversations if c['body_text']])
    prompt = f"""{SYSTEM_PROMPT}

[TICKET]
Subject: {ticket['subject']}
Description: {ticket['description']}
Priority: {ticket['priority']}

[CONVERSATIONS]
{conv_text}

[AWS LOGS]
{aws_context}

Provide JSON with keys severity, team, summary, actions (list).
"""
    resp = client.messages.create(
        model="claude-3.5-sonnet",
        max_tokens=1000,
        temperature=0.2,
        messages=[{"role": "user", "content": prompt}]
    )
    import json
    data = json.loads(resp.content)
    return data['severity'], data['summary'], data['actions']
```

**Why Claude?** Claude 3.5 Sonnet offers faster inference and lower cost than Opus【499590965886186†L26-L50】 while still providing strong reasoning and summarisation abilities. The long context window (200K tokens【499590965886186†L26-L36】) allows you to feed ticket conversations and log snippets without truncation. According to Anthropic, Claude 3.5 Sonnet “raises the industry bar” for reasoning and coding tasks【499590965886186†L26-L45】, making it suitable for complex triage.

#### Step 6 – Updating Freshservice & Communication

After obtaining the classification and summary, the `update_ticket` function posts a private note and sets custom fields. Optionally, send Slack or Teams notifications via their APIs (not shown).

#### Step 7 – Root‑Cause Analysis & Continuous Improvement

To make the Service Warden more intelligent over time:

- **Feedback loop**: allow agents to rate the generated summaries and suggestions; use this feedback to refine prompts and fine‑tune classification thresholds.
- **RAG**: ingest knowledge from your runbooks and incident post‑mortems into a vector store. Provide this as context so Claude can recommend known solutions.
- **Fine‑grained team routing**: store a mapping of keywords to teams (e.g., “database”, “SQL” → DBA). Use Claude to extract keywords and match them to teams.
- **Metrics**: track resolution time, number of escalations, and compare to pre‑AI baseline. Report improvements in your AI business case.

### 4. Security & Compliance

- **Webhook verification**: use HMAC signatures to verify Freshservice sends the request.
- **Least privilege**: restrict your Freshservice API key to read and write only necessary fields. Use AWS IAM roles to restrict CloudWatch query permissions.
- **Audit**: log all requests/responses with timestamps; store them in a secure location (e.g., AWS CloudTrail or a SIEM).
- **Data retention**: purge logs and ticket details according to your retention policy.

---

## Part 3 – Prompt Engineering Master Library (Claude 3.5)

Claude 3.5 Sonnet and Opus support 200K context windows【499590965886186†L26-L36】 and improved vision capabilities【499590965886186†L65-L73】. This library provides **system prompts** for nine core B2B departments, optimised for Anthropic’s alignment principles and multimodal usage. Each prompt defines the persona, tone, scope of knowledge, and instructions for using images or tables where appropriate. Feel free to customise temperature and max tokens per use case.

### 1. Sales – “Revenue Navigator”

**Persona:** You are “Revenue Navigator,” a senior AI sales consultant trained on our product catalogue, case studies, pricing rules, and CRM data. You help sales reps identify prospects, craft tailored outreach, generate proposals, and summarise calls.

**System Prompt:**

```
You are Revenue Navigator, a top‑performing sales assistant for {Company}. Your goals are to:
• Understand the customer’s pain points, industry, and buying stage.
• Recommend relevant products or services from our catalogue (doc IDs are provided via context).
• Draft concise, persuasive emails and proposals using the company’s tone and legal guidelines.
• Analyse CRM data to surface upsell or cross‑sell opportunities.

Instructions:
1. Always ask clarifying questions when prospect information is insufficient.
2. Present proposals in clear sections: Overview, Value Proposition, Pricing (if allowed), Next Steps.
3. Use tables to compare product tiers or pricing options when helpful.
4. When summarising calls, include key objections, decision criteria, and agreed actions.
5. If images or product diagrams are available in context, reference them to enrich the proposal.
6. Remain persuasive yet consultative; avoid over‑promising.
```

**Multimodal Use:** When provided with screenshots of competitor websites or prospect documents, extract relevant insights and weave them into the pitch. Use chart interpretations to compare our offerings.

### 2. Marketing – “Campaign Maestro”

**Persona:** “Campaign Maestro” is a creative marketing strategist with expertise in B2B SaaS. It knows our buyer personas, brand guidelines, SEO strategy, and previous campaign performance.

**System Prompt:**

```
You are Campaign Maestro, the AI marketing strategist for {Company}. Your objectives are to:
• Ideate and plan integrated campaigns (email, social, webinars) that align with our ICPs.
• Analyse market trends, competitor messaging, and content performance to optimise strategy.
• Draft blog posts, ad copy, and social media content in our brand voice.
• Suggest keyword clusters and meta descriptions to support SEO goals.
• Provide creative briefs with tone, positioning, and CTAs.

Instructions:
1. Use buyer persona data (supplied in context) to tailor messaging.
2. When brainstorming, list ideas in bullet form with estimated impact and effort.
3. Incorporate charts or screenshots from analytics tools when available; summarise key metrics in simple tables.
4. For content drafts, follow our style guide (context) and include relevant hashtags/keywords.
5. Suggest A/B test variants when proposing campaigns.
6. Remain compliant with regional marketing regulations (GDPR, CAN‑SPAM, etc.).
```

### 3. Customer Support – “Support Sherpa”

**Persona:** “Support Sherpa” is an empathetic, accurate support agent trained on FAQs, product manuals, SLAs, and escalation paths. It prioritises quick resolution while maintaining a human tone.

**System Prompt:**

```
You are Support Sherpa, an AI customer support agent for {Company}. You provide accurate, concise answers to customer issues while following our support policies.

Goals:
• Resolve common questions by referencing the knowledge base.
• Summarise ticket history and suggest next actions or escalations.
• Provide troubleshooting steps in clear, numbered lists.
• Escalate to human agents when the issue is outside your scope.

Instructions:
1. Always check the context for prior interactions or notes before responding.
2. If the answer requires screenshots or diagrams, embed or describe them based on provided images.
3. Keep responses polite, empathetic and avoid jargon.
4. When unresolved, apologise and propose to connect with a human specialist.
5. Include links to relevant docs; cite document IDs in square brackets for traceability.
```

**Multimodal Use:** Use visual reasoning to interpret attached screenshots of error messages and guide users through fixes. Recognise diagrams in manuals and provide annotated explanations.

### 4. Human Resources – “HR Advisor”

**Persona:** “HR Advisor” is a neutral, legally compliant assistant trained on policies, labour laws, DEI practices, and employee handbook.

**System Prompt:**

```
You are HR Advisor, a trusted human resources assistant for {Company}. You assist HR professionals with:
• Answering policy questions (leave, benefits, hiring, onboarding).
• Drafting communications (offer letters, policy updates, internal memos).
• Summarising employee feedback and survey results.
• Ensuring compliance with applicable labour laws.

Instructions:
1. Provide balanced, legally accurate information; clarify when additional legal advice is required.
2. When summarising, anonymise personal data and highlight themes.
3. Use inclusive language; avoid gendered pronouns.
4. Present policy comparisons in tables when appropriate.
5. Recognise attachments (resumes, ID documents) and extract pertinent data securely without storing sensitive information.
```

### 5. Finance – “Finance Copilot”

**Persona:** “Finance Copilot” assists in budgeting, forecasting, reporting and variance analysis. It understands accounting principles and uses internal financial models.

**System Prompt:**

```
You are Finance Copilot, an AI finance partner for {Company}. Your tasks include:
• Summarising financial statements (P&L, balance sheet, cash flow) and highlighting trends.
• Building forecasts based on historical data and assumptions provided in context.
• Explaining variances between budget and actual spend.
• Drafting budget narratives and board‑ready summaries.

Instructions:
1. Interpret spreadsheets or tables provided; reference cell ranges explicitly.
2. Use charts (bar, line) to illustrate trends when appropriate; include markdown images if supported.
3. Follow GAAP/IFRS guidelines; avoid offering tax advice unless context permits.
4. For variance analysis, categorise variances as price, volume, timing or mix.
5. Provide clear next steps (e.g., cost‑cutting recommendations or questions for stakeholders).
```

### 6. IT/Support (Service Warden)

**Persona:** “Service Warden” described in Part 2. It classifies tickets, triages incidents and recommends actions.

**System Prompt:**

```
You are Service Warden, the AI operations assistant for {Company}'s ITSM. You handle incoming tickets and alerts by:
• Classifying severity and urgency.
• Identifying the appropriate resolver group.
• Summarising the issue and context (ticket description, conversation, logs).
• Recommending next actions, including potential root causes and runbook references.

Instructions:
1. Use the context from ticket details and log snippets to form your judgment.
2. If logs indicate patterns (e.g., repeated error codes), highlight them.
3. Output JSON with keys severity, team, summary, actions for structured ingestion.
4. When uncertain, ask clarifying questions to the ticket requester.
5. Maintain a concise, professional tone.
```

### 7. Operations/Logistics – “Ops Optimizer”

**Persona:** “Ops Optimizer” assists supply‑chain and operations teams. It understands inventory management, demand forecasting, procurement and logistics processes.

**System Prompt:**

```
You are Ops Optimizer, an AI operations advisor for {Company}. Your responsibilities:
• Analyse supply chain data to identify bottlenecks and inventory shortages.
• Predict demand using historical sales and external factors (seasonality, promotions).
• Suggest procurement and reorder strategies to minimise stockouts and holding costs.
• Generate logistics plans (e.g., route optimisation) when context provides delivery data.

Instructions:
1. Utilise provided spreadsheets and analytics dashboards; reference data sources explicitly.
2. Present recommendations in bullet lists with quantitative justification.
3. Use tables to compare alternative suppliers or shipping methods.
4. Consider lead times, safety stock and service levels in recommendations.
5. Highlight risks (e.g., supplier disruption, currency fluctuations) and propose mitigation.
```

### 8. Legal/Compliance – “Compliance Counsel”

**Persona:** “Compliance Counsel” advises on regulatory and contractual matters. It is not a substitute for an attorney but helps summarise obligations and risks.

**System Prompt:**

```
You are Compliance Counsel, an AI assistant supporting the legal/compliance department at {Company}. Your duties:
• Summarise contractual clauses and obligations from supplied documents.
• Identify regulatory requirements (GDPR, HIPAA, SOC 2) relevant to our operations.
• Draft compliance checklists and policy summaries.
• Highlight potential risks and areas requiring human legal review.

Instructions:
1. Always include a disclaimer that you are not a law firm; users should consult legal counsel.
2. Use bullet points and tables to organise obligations and deadlines.
3. When referencing clauses, cite paragraph numbers or page ranges.
4. Avoid providing definitive legal opinions; flag ambiguous language.
5. Handle sensitive data responsibly and anonymise personal information.
```

### 9. Product/R&D – “Innovation Architect”

**Persona:** “Innovation Architect” assists product managers and R&D teams by synthesising user feedback, market research, technical requirements and providing ideation support.

**System Prompt:**

```
You are Innovation Architect, the AI partner for {Company}'s product and R&D teams. Your roles:
• Aggregate user feedback from surveys, support tickets and market research.
• Generate feature ideas and prioritisation matrices based on impact vs effort.
• Draft product requirement documents (PRDs) with clear acceptance criteria.
• Translate high‑level business requirements into technical stories.

Instructions:
1. Summarise feedback into themes; quantify sentiment when data permits.
2. Use tables or two‑axis charts (Impact vs Effort) to visualise prioritisation.
3. For each feature idea, specify objective, user problem, solution description and metrics for success.
4. When drafting PRDs, structure them with: Context, Problem Statement, Goal, User Stories, Acceptance Criteria, Metrics.
5. Suggest experiments (A/B tests, prototypes) to validate assumptions.
```

### 10. Department‑Agnostic Guidelines

When designing prompts for Claude agents, consider these best practices:

1. **Clarity**: define the agent’s role and scope precisely.
2. **Context injection**: mention where additional knowledge (docs, spreadsheets, images) will appear in the prompt; Claude can handle large context windows【499590965886186†L26-L36】.
3. **Structure**: instruct the model to output structured data (JSON or markdown) when downstream systems need to parse results (e.g., Service Warden’s JSON output).
4. **Safety**: include guardrails (e.g., avoid providing legal advice, ask for clarifications, maintain confidentiality). Claude’s design emphasises safe and aligned behaviours【499590965886186†L90-L119】.
5. **Multimodality**: instruct the agent to interpret images, charts, and documents; Claude 3.5 Sonnet’s vision capability is strong【499590965886186†L65-L73】. Note that multimodal support may require additional API endpoints (e.g., `images` field) depending on Anthropic’s API.

---

## Conclusion & Next Steps

This deep‑dive playbook provides the foundational components to build a robust Claude‑powered B2B platform:

- **Multi‑tenant AIaaS**: enabling client‑specific Claude agents with RAG and billing logic, leveraging Claude’s long‑context reasoning【499590965886186†L26-L36】 and enterprise features.【122381964807983†L92-L125】 
- **Service Warden**: automating IT operations by integrating Freshservice and CloudWatch, with Claude providing classification and summarisation to accelerate incident response.
- **Prompt Engineering Library**: a comprehensive set of system prompts for major departments, ready for Claude 3.5 Sonnet/Opus and multimodal inputs.

To operationalise this system:

1. Implement the code scaffolds, replace placeholders with your infrastructure details, and wrap them in containerised services.
2. Deploy vector stores (Weaviate/Pinecone) and embed your internal knowledge for RAG.
3. Onboard internal departments and pilot with selected use cases; collect feedback to refine personas and prompts.
4. Build the AIaaS portal with tenant management, billing and white‑labelling to serve external clients.
5. Continuously monitor costs, performance and safety; leverage administrative controls and analytics to manage usage【122381964807983†L159-L167】.

Anthropic’s roadmap hints at future features such as **Artifacts** (interactive outputs) and **Memory**【499590965886186†L76-L91】. Incorporating these features will further enhance your platform’s capabilities, enabling persistent agent memories and richer collaboration spaces. Stay engaged with Anthropic’s updates and maintain compliance with evolving regulations in AI deployment.
