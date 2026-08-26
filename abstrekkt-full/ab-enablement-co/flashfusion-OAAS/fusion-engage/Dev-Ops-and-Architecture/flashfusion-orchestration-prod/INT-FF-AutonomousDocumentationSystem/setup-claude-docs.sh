#!/bin/bash
# setup-claude-docs.sh - Complete Claude Code documentation system setup
# Author: Kyle Rosebrook
# Version: 1.0.0

set -e

echo "🚀 Setting up Claude Code Documentation System for FlashFusion..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Create directory structure
echo -e "${BLUE}📁 Creating directory structure...${NC}"
mkdir -p .claude/{agents,skills,slash-commands,hooks}
mkdir -p .claude/skills/{doc-coordinator,adr-writer,diagram-generator,api-documenter}
mkdir -p docs/{decisions,context-notes,diagrams,api,errors,tutorials,how-to-guides,reference,explanation,architecture}

# 2. Install doc-coordinator skill
echo -e "${BLUE}📋 Installing doc-coordinator skill...${NC}"
cat > .claude/skills/doc-coordinator/SKILL.md << 'EOF'
---
name: doc-coordinator
version: 1.0.0
description: Orchestrates documentation generation across FlashFusion ecosystem
author: Kyle Rosebrook
triggers:
  keywords:
    - document code
    - generate docs
    - update documentation
    - create ADR
  intent_patterns:
    - "User wants to document architectural decisions"
    - "User wants to generate API documentation"
    - "User wants to update diagrams"
  content_patterns:
    - file_paths:
      - "packages/*/src/**/*.ts"
      - "docs/**/*.md"
enforcement: suggest
---

# Documentation Coordinator Skill

## Purpose
Orchestrates documentation generation across the FlashFusion monorepo by:
1. Analyzing code changes
2. Determining which docs need updates
3. Delegating to specialized subagents
4. Syncing to GitHub/Notion/Linear

## When to Use
- After merging a PR
- When user types `/doc-update`
- On PreToolUse hook (before git commit)

## Workflow

### 1. Analyze Changes
```bash
# Get changed files in last commit
git diff --name-only HEAD~1 HEAD
```

### 2. Determine Doc Updates Needed

**File Pattern → Doc Type Mapping:**
- `packages/backend/api/**/*.ts` → API documentation
- `packages/ai/**/*.ts` → AI component docs + guardrails
- `packages/integrations/stripe/**/*.ts` → Stripe integration guide
- `packages/integrations/printify/**/*.ts` → Printify integration guide
- `.github/workflows/*.yml` → CI/CD runbook
- `packages/core/src/db/**/*.ts` → Database schema docs

**ADR Triggers:**
Create new ADR when:
- New third-party service added
- Database schema changed
- Auth flow modified
- New AI model integrated
- Deployment target changed

### 3. Delegate to Subagents

Use Task tool to spawn specialized agents:

```typescript
// Example delegation logic
const changedFiles = getChangedFiles();

if (hasApiChanges(changedFiles)) {
  await Task({
    agent: "api-documenter-agent",
    input: { files: changedFiles.filter(f => f.includes('.router.ts')) }
  });
}

if (hasArchitecturalChange(changedFiles)) {
  await Task({
    agent: "adr-writer-agent",
    input: { 
      context: extractArchitecturalContext(changedFiles),
      trigger: detectChangeType(changedFiles)
    }
  });
  
  await Task({
    agent: "diagram-generator-agent",
    input: { diagramType: "container" }
  });
}
```

### 4. Quality Gates

Before finalizing documentation:
- [ ] All Mermaid diagrams render correctly
- [ ] No secrets in generated docs (scan for API keys, tokens)
- [ ] ADRs follow MADR template
- [ ] API docs include TypeScript types
- [ ] Cross-references are valid (no broken links)
- [ ] Code examples are executable

### 5. Sync to External Systems

```typescript
// GitHub PR creation
await github.createPullRequest({
  title: "docs: Auto-generated documentation updates",
  body: generatePRDescription(updatedDocs),
  files: updatedDocs,
  branch: `docs/auto-update-${Date.now()}`
});

// Notion sync
await notion.updatePage({
  pageId: process.env.NOTION_ARCHITECTURE_PAGE_ID,
  content: architectureDocs
});

// Linear ticket creation (if docs missing)
if (missingDocs.length > 0) {
  await linear.createIssue({
    title: "Missing documentation detected",
    description: missingDocs.join('\n'),
    labels: ['documentation', 'tech-debt']
  });
}
```

## Integration with staff-engineer-v3

For complex architectural decisions:
```typescript
// Use staff-engineer-v3 in SKELETON mode first
const architecture = await staffEngineer.analyze({
  mode: 'SKELETON',
  scope: changedFiles
});

// Extract decisions and convert to ADRs
const decisions = extractDecisions(architecture);
for (const decision of decisions) {
  await createADR(decision);
}
```

## Error Handling

```typescript
try {
  await generateDocs();
} catch (error) {
  if (error.code === 'MCP_UNAVAILABLE') {
    // Cause: GitHub/Notion MCP server down
    // Fix: Save docs locally, queue for retry
    // Retry: Yes, exponential backoff (1s, 2s, 4s, 8s, 16s max)
    await saveDocsLocally(updatedDocs);
    await scheduleRetry({ delay: 1000, maxRetries: 5 });
  } else if (error.code === 'DIAGRAM_RENDER_FAILED') {
    // Cause: Invalid Mermaid syntax
    // Fix: Validate syntax, regenerate
    // Retry: Yes, immediately after fix
    const fixed = await validateAndFixMermaid(diagram);
    await regenerateDiagram(fixed);
  }
}
```

## Decision Trees

### Changed File → Action Mapping

```
packages/backend/api/routes/*.ts
  → Update API docs
  → Update OpenAPI spec (if exists)
  → Add example curl commands

packages/ai/*/prompt-*.ts
  → Document prompt structure
  → Update AI guardrails section
  → Add cost/latency metrics

packages/integrations/*/api.ts
  → Update integration guide
  → Document webhooks
  → Update .env.example

packages/core/src/db/schema.ts
  → Update database schema docs
  → Generate ERD diagram
  → Create migration guide (if breaking)

.github/workflows/*.yml
  → Update CI/CD runbook
  → Document deployment steps
```

## Example Usage

```bash
# User commits code
$ git add packages/integrations/printify/
$ git commit -m "feat: add Printify webhook handler"

# Pre-commit hook triggers
⚠️  Integration change detected

# User runs doc update
$ claude-code
> /doc-update

# Coordinator analyzes:
# - Changed: packages/integrations/printify/webhooks.ts
# - Decision: Update Printify integration guide
# - Spawns: api-documenter-agent
# - Generates: docs/api/printify-webhooks.md
# - Updates: docs/integrations/printify.md
# - Creates: GitHub PR #894
```

## Monitoring

Track documentation operations:
```typescript
const metrics = {
  adrsCreated: 0,
  diagramsGenerated: 0,
  apiDocsUpdated: 0,
  prsCreated: 0,
  notionPagesSynced: 0,
  errors: []
};

// Report at end of session
console.log(`
📊 Documentation Session Summary:
- ADRs created: ${metrics.adrsCreated}
- Diagrams generated: ${metrics.diagramsGenerated}
- API docs updated: ${metrics.apiDocsUpdated}
- PRs created: ${metrics.prsCreated}
- Notion syncs: ${metrics.notionPagesSynced}
- Errors: ${metrics.errors.length}
`);
```
EOF

# 3. Install adr-writer skill
echo -e "${BLUE}📋 Installing adr-writer skill...${NC}"
cat > .claude/skills/adr-writer/SKILL.md << 'EOF'
---
name: adr-writer
version: 1.0.0
description: Generates Architecture Decision Records following MADR template
author: Kyle Rosebrook
triggers:
  keywords:
    - create ADR
    - document decision
    - architecture choice
  intent_patterns:
    - "User wants to document an architectural decision"
enforcement: suggest
---

# ADR Writer Skill

## MADR Template (Markdown Any Decision Records)

```markdown
# ADR-XXX: [Title - Present Tense Verb Phrase]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-YYY]

**Date:** YYYY-MM-DD
**Deciders:** [Names or roles]

## Context and Problem Statement
[Describe the context and problem in 2-3 sentences. What decision needs to be made? What constraints exist?]

## Decision Drivers
* [Key requirement 1]
* [Key requirement 2]
* [Key requirement 3]
* [Constraint 1]
* [Constraint 2]

## Considered Options
1. **[Option 1]** - [Brief description]
2. **[Option 2]** - [Brief description]
3. **[Option 3]** - [Brief description]

## Decision Outcome
**Chosen option:** "[Option X]"

**Rationale:**
[2-3 sentences explaining why this option was chosen over the alternatives]

**Consequences:**

### Positive
* [Benefit 1]
* [Benefit 2]
* [Benefit 3]

### Negative
* [Trade-off 1] → **Mitigation:** [How we handle this]
* [Trade-off 2] → **Mitigation:** [How we handle this]

## Implementation Notes

### Code Changes Required
```typescript
// Example implementation
```

### Configuration
```bash
# .env additions
NEW_SERVICE_URL=https://api.service.com
NEW_SERVICE_KEY=xxxxx
```

### Migration Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Compliance & Security
- **SOC2:** [Implications if applicable]
- **HIPAA:** [Implications if applicable]  
- **PCI-DSS:** [Implications if applicable]
- **GDPR:** [Implications if applicable]

## Metrics (Post-Implementation)
- [Metric 1]: Baseline → Target
- [Metric 2]: Baseline → Target
- [Review date]: YYYY-MM-DD

## Links
* Related ADR: [ADR-YYY]
* Implementation PR: #XXX
* Documentation: [Link]
* Discussion: [Slack thread / Linear issue]
```

## FlashFusion-Specific Templates

### Template 1: Database/Storage Decision

```markdown
# ADR-XXX: Choose [Database/Storage] for [Use Case]

## Context
FlashFusion needs [storage requirement] for [feature].

**Current stack:**
- Supabase (PostgreSQL) - Main database
- Firebase Firestore - Legacy auth data
- Redis - Job queue
- Cloudinary - Image storage

## Decision Drivers
* Data model: [Relational | Document | Key-Value | Object]
* Query patterns: [Read-heavy | Write-heavy | Mixed]
* Scale: [Current users] → [Target users]
* Budget: $[amount]/month
* Team expertise: [Skill level with technology]
* RLS requirement: [Yes/No - critical for multi-tenant]

## Considered Options
1. **Supabase (PostgreSQL)**
   - Pros: RLS built-in, SQL, team knows it
   - Cons: [Limitations]
2. **Firebase Firestore**
   - Pros: Real-time, offline support
   - Cons: Limited queries, expensive at scale
3. **[Other option]**

## Decision Outcome
**Chosen:** [Database]

**Why:**
- [Technical fit explanation]
- [Cost analysis: $X/month at current scale, $Y at target]
- [Team familiarity: X% of team knows this]

**Migration path:** [If moving from another DB]

## Implementation Notes

### Schema
```sql
-- Example schema
CREATE TABLE [table_name] (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;
CREATE POLICY "[policy_name]" ON [table_name]
  FOR ALL USING (creator_id = auth.uid());
```

### Connection
```typescript
// packages/core/src/db/client.ts
export const db = createClient(process.env.DATABASE_URL);
```

## Links
* Schema: `/packages/core/src/db/schema.ts`
* Migration: `/docs/migrations/XXX-migrate-to-[db].md`
```

### Template 2: AI Model Selection

```markdown
# ADR-XXX: Use [AI Model] for [Feature]

## Context
[FlashFusion | Continuum] needs AI for [brand kit generation | opportunity scoring | image analysis].

**Current AI usage:**
- GPT-4o: Brand kit generation
- Claude Sonnet 4: Continuum opportunity analysis
- DALL-E 3: Logo concepts (planned)

## Decision Drivers
* Latency requirement: <[X] seconds p95
* Cost target: <$[X] per generation
* Quality threshold: [User satisfaction | Accuracy | Creativity]
* Context window: [Tokens needed]
* Modality: [Text | Vision | Multimodal]

## Considered Options
1. **GPT-4o (OpenAI)**
   - Cost: $5/1M input tokens, $15/1M output
   - Latency: ~2-4s
   - Strengths: Structured output, JSON mode
2. **Claude Sonnet 4 (Anthropic)**
   - Cost: $3/1M input, $15/1M output
   - Latency: ~3-5s
   - Strengths: Analysis, long context (200K)
3. **Gemini 1.5 Pro (Google)**
   - Cost: $1.25/1M input, $5/1M output
   - Latency: ~2-3s
   - Strengths: Multimodal, cost

## Decision Outcome
**Chosen:** [Model]

**Prompt Structure:**
```typescript
const systemPrompt = `
You are a [role]. Generate [output] in [format].

Constraints:
- [Constraint 1]
- [Constraint 2]

Never:
- [Forbidden action 1]
- [Forbidden action 2]
`;

const userPrompt = `
Input: ${userInput}
Context: ${context}
`;
```

**Guardrails (5 Layers - CRITICAL):**
1. **Input validation:**
   - Max length: 500 chars
   - Sanitize: Remove prompt injection patterns
   - Rate limit: 10 generations/hour/user
2. **Prompt structure:**
   - Separate instructions from data
   - Never concatenate raw user input
3. **Output filtering:**
   - Allowlist: Valid hex colors, Google Fonts only
   - Content moderation: OpenAI Moderation API
4. **Rate limiting:**
   - User tier limits: Free (5/day), Pro (50/day), Team (unlimited)
5. **Human review:**
   - Trigger: Confidence <80% OR flagged content

**Cost Analysis:**
- Average generation: [X] tokens input, [Y] tokens output
- Cost per generation: $[X]
- Monthly estimate: [Z] generations × $[X] = $[Total]

**Latency:**
- p50: [X]s
- p95: [Y]s
- p99: [Z]s

## Implementation Notes

```typescript
// packages/ai/src/[feature]/generator.ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function generate(input: string) {
  // Layer 1: Input validation
  if (input.length > 500) {
    throw new Error('INPUT_TOO_LONG');
  }
  
  // Layer 2: Structured prompt
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [
      { role: 'user', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });
  
  // Layer 3: Output filtering
  const result = parseAndValidate(response.content);
  
  return result;
}
```

## Metrics (3 months post-launch)
- User satisfaction: Baseline → Target (>4.5/5)
- Generation success rate: Baseline → Target (>95%)
- Average latency: Baseline → Target (<3s p95)
- Cost per user: Baseline → Target (<$0.50/month)

## Links
* Implementation: `/packages/ai/src/[feature]/`
* Evaluation dataset: `/docs/ai/[model]-evaluation.md`
* Guardrails audit: `/docs/security/ai-guardrails.md`
```

### Template 3: Integration/Service Selection

```markdown
# ADR-XXX: Use [Service] for [Purpose]

## Context
FlashFusion needs [capability] for [use case].

**Current integrations:**
- Stripe: Payments
- Printify: Print-on-demand fulfillment
- n8n: Workflow automation
- Cloudinary: Image optimization
- Supabase: Database + Auth

## Decision Drivers
* Primary requirement: [What we need]
* Integration complexity: [Simple API | SDK | Webhook setup]
* Pricing: $[amount] at current scale
* Reliability: [SLA requirement]
* Team familiarity: [Known | New to team]

## Considered Options
1. **[Service A]**
   - Pricing: [Model]
   - Integration: [Complexity]
2. **[Service B]**
3. **Build in-house**

## Decision Outcome
**Chosen:** [Service]

**Integration Points:**
```typescript
// packages/integrations/[service]/api.ts
export async function [operation](params) {
  const response = await fetch('[service-url]', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SERVICE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
  
  return response.json();
}
```

**Webhooks:**
```typescript
// POST /api/webhooks/[service]
export async function POST(req: Request) {
  // Verify signature
  const signature = req.headers.get('[signature-header]');
  const isValid = verifySignature(await req.text(), signature);
  
  if (!isValid) {
    return new Response('Invalid signature', { status: 401 });
  }
  
  // Process event
  const event = await req.json();
  await handleEvent(event);
  
  return new Response('OK', { status: 200 });
}
```

**Environment Variables:**
```bash
# .env
SERVICE_API_KEY=xxxxx
SERVICE_WEBHOOK_SECRET=xxxxx
SERVICE_ENVIRONMENT=production # or sandbox
```

## Failure Modes & Mitigations

| Failure | Probability | Impact | Mitigation |
|---------|------------|--------|------------|
| API down | Low | High | Retry with exponential backoff, queue for later |
| Rate limit | Medium | Medium | Implement client-side rate limiting |
| Webhook missed | Low | Medium | Poll API as backup, idempotency keys |

## Links
* Integration code: `/packages/integrations/[service]/`
* Webhook handler: `/packages/backend/api/webhooks/[service].ts`
* Documentation: [External docs URL]
```

## Auto-numbering Logic

```typescript
// Find next ADR number
function getNextADRNumber(): string {
  const adrFiles = fs.readdirSync('docs/decisions');
  const numbers = adrFiles
    .map(f => {
      const match = f.match(/ADR-(\d+)/);
      return match ? parseInt(match[1]) : null;
    })
    .filter(n => n !== null);
  
  const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  return String(nextNumber).padStart(3, '0'); // e.g., "001", "012"
}

// Generate filename
function generateADRFilename(title: string): string {
  const number = getNextADRNumber();
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `ADR-${number}-${slug}.md`;
}
```

## GitHub Integration

```typescript
// Create ADR and open PR
async function createADRWithPR(adr: ADR) {
  const filename = generateADRFilename(adr.title);
  const content = renderADRTemplate(adr);
  const branchName = `docs/adr-${filename}`;
  
  // Create branch and file
  await github.createBranch(branchName, 'main');
  await github.createFile({
    path: `docs/decisions/${filename}`,
    content: content,
    branch: branchName,
    message: `docs: Add ${filename}`
  });
  
  // Create PR
  const pr = await github.createPullRequest({
    title: `${filename.replace('.md', '').replace(/-/g, ' ')}`,
    body: generatePRDescription(adr),
    base: 'main',
    head: branchName,
    labels: ['documentation', 'adr']
  });
  
  return pr.url;
}

function generatePRDescription(adr: ADR): string {
  return `
## ADR Summary
${adr.context}

## Decision
${adr.decision}

## Please Review
- [ ] Context accurately describes the problem
- [ ] All options were considered
- [ ] Consequences (positive & negative) are clear
- [ ] Implementation notes are actionable
- [ ] Links are valid
  `.trim();
}
```

## Quality Checklist

Before finalizing ADR:
- [ ] Title is clear and present-tense (e.g., "Use Redis for job queue")
- [ ] Status is set (typically "Accepted" for new ADRs)
- [ ] Context explains WHY decision was needed
- [ ] At least 2 options considered
- [ ] Decision rationale is clear
- [ ] Both positive AND negative consequences listed
- [ ] Negative consequences have mitigations
- [ ] Implementation notes are concrete
- [ ] No secrets in code examples (use env vars)
- [ ] Links are valid and accessible
- [ ] Spelling/grammar checked

## Usage Example

```bash
# User wants to document decision to use Redis
$ claude-code
> /create-adr "Use Redis with BullMQ for background jobs" \
  --context "Need reliable job queue for POD fulfillment, email, AI generation" \
  --decision "Use Redis + BullMQ instead of database polling"

# ADR Writer:
# 1. Assigns number: ADR-012
# 2. Fills MADR template
# 3. Saves: docs/decisions/ADR-012-use-redis-bullmq.md
# 4. Creates PR: #893

✅ ADR-012 created
📝 PR: https://github.com/krosebrook/source-of-truth-monorepo/pull/893
```
EOF

# 4. Install diagram-generator skill
echo -e "${BLUE}📋 Installing diagram-generator skill...${NC}"
cat > .claude/skills/diagram-generator/SKILL.md << 'EOF'
---
name: diagram-generator
version: 1.0.0
description: Generates Mermaid diagrams for architecture documentation
author: Kyle Rosebrook
triggers:
  keywords:
    - create diagram
    - generate diagram
    - architecture diagram
    - visualize system
  intent_patterns:
    - "User wants to visualize system architecture"
    - "User wants to show data flow"
enforcement: suggest
---

# Diagram Generator Skill

## Supported Diagram Types

### 1. System Context (C4 Level 1)
**When:** High-level system overview  
**Shows:** Users, main system, external dependencies

```mermaid
graph TB
    User[Creator User]
    App[FlashFusion Platform<br/>Next.js + Express]
    
    subgraph "External Services"
        DB[(Supabase<br/>PostgreSQL + Auth)]
        Stripe[Stripe API<br/>Payments]
        Printify[Printify API<br/>POD Fulfillment]
        OpenAI[OpenAI API<br/>Brand Generation]
        Cloudinary[Cloudinary<br/>Image Optimization]
    end
    
    User -->|Manages brands<br/>Publishes products| App
    App -->|SQL queries<br/>RLS policies| DB
    App -->|Auth checks<br/>JWT tokens| DB
    App -->|Create charges<br/>Webhook events| Stripe
    App -->|Submit orders<br/>Track status| Printify
    App -->|Generate brand kits<br/>GPT-4o| OpenAI
    App -->|Upload images<br/>Auto-optimize| Cloudinary
    
    style App fill:#4f46e5,stroke:#312e81,color:#fff
    style DB fill:#10b981,stroke:#065f46,color:#fff
    style Stripe fill:#6366f1,stroke:#4338ca,color:#fff
    style Printify fill:#f59e0b,stroke:#b45309,color:#fff
    style OpenAI fill:#ec4899,stroke:#be185d,color:#fff
    style Cloudinary fill:#3b82f6,stroke:#1e40af,color:#fff
```

### 2. Container Diagram (C4 Level 2)
**When:** Showing internal system structure  
**Shows:** Frontend, backend, workers, databases, queues

```mermaid
graph TB
    subgraph "FlashFusion Monorepo"
        subgraph "Frontend (packages/frontend)"
            Dashboard[Dashboard<br/>Next.js + React]
            Marketing[Marketing Site<br/>Next.js]
            Admin[Admin Panel<br/>Next.js]
        end
        
        subgraph "Backend (packages/backend)"
            API[API Server<br/>Express + tRPC]
            Workers[Background Workers<br/>BullMQ]
        end
        
        subgraph "Services (packages/)"
            AI[AI Service<br/>Brand Kit Gen]
            Integrations[Integrations<br/>Stripe/Printify/n8n]
        end
    end
    
    subgraph "Infrastructure"
        DB[(Supabase<br/>PostgreSQL)]
        Redis[(Redis<br/>Job Queue)]
        Storage[Supabase Storage<br/>User Assets]
    end
    
    Dashboard -->|API calls<br/>tRPC| API
    Marketing -->|API calls| API
    Admin -->|API calls| API
    
    API -->|SQL queries| DB
    API -->|Enqueue jobs| Redis
    API -->|Upload files| Storage
    
    Workers -->|Consume jobs| Redis
    Workers -->|Query data| DB
    Workers -->|Generate| AI
    Workers -->|Call APIs| Integrations
    
    style Dashboard fill:#4f46e5,stroke:#312e81,color:#fff
    style API fill:#4f46e5,stroke:#312e81,color:#fff
    style Workers fill:#f59e0b,stroke:#b45309,color:#fff
    style AI fill:#ec4899,stroke:#be185d,color:#fff
```

### 3. Sequence Diagrams
**When:** Showing request/response flow  
**Shows:** Step-by-step interaction between components

```mermaid
sequenceDiagram
    participant U as User
    participant D as Dashboard
    participant A as API
    participant DB as Supabase
    participant AI as AI Service
    participant Q as Redis Queue
    participant W as Worker
    
    U->>D: Create brand kit
    D->>A: POST /api/brands/generate
    A->>DB: Check user credits
    DB-->>A: Credits: 10 remaining
    
    alt Sufficient credits
        A->>Q: Enqueue brand generation job
        Q-->>A: Job ID: abc123
        A-->>D: Job queued (ID: abc123)
        D-->>U: "Generating... (30s)"
        
        W->>Q: Poll for jobs
        Q-->>W: Job: abc123
        W->>AI: Generate brand kit
        AI-->>W: Brand kit JSON
        W->>DB: Save brand kit
        DB-->>W: Saved (ID: xyz789)
        W->>DB: Deduct 1 credit
        
        D->>A: GET /api/brands/xyz789
        A->>DB: Query brand kit
        DB-->>A: Brand kit data
        A-->>D: Brand kit JSON
        D-->>U: Display brand kit
    else Insufficient credits
        A-->>D: Error: Insufficient credits
        D-->>U: "Upgrade to continue"
    end
```

### 4. Flowcharts
**When:** Showing decision logic  
**Shows:** Branching paths and conditions

```mermaid
flowchart TD
    Start([User uploads design])
    
    Validate{Valid file<br/>type?}
    Size{File size<br/>< 5MB?}
    Dims{Dimensions<br/>>= 1000px?}
    
    Process[Process image<br/>Extract colors]
    Compress[Compress<br/>90% quality]
    Resize[Resize if needed<br/>Max 4000px]
    Upload[Upload to<br/>Supabase Storage]
    Save[Save metadata<br/>to database]
    Success([Show success])
    
    Error[Show error<br/>message]
    
    Start --> Validate
    Validate -->|No<br/>Must be PNG/JPG| Error
    Validate -->|Yes| Size
    Size -->|No<br/>Max 5MB| Error
    Size -->|Yes| Dims
    Dims -->|No<br/>Min 1000px| Error
    Dims -->|Yes| Process
    
    Process --> Compress
    Compress --> Resize
    Resize --> Upload
    Upload --> Save
    Save --> Success
    
    style Start fill:#10b981,stroke:#065f46,color:#fff
    style Success fill:#10b981,stroke:#065f46,color:#fff
    style Error fill:#ef4444,stroke:#991b1b,color:#fff
    style Process fill:#4f46e5,stroke:#312e81,color:#fff
```

### 5. State Diagrams
**When:** Showing state transitions  
**Shows:** Object lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft: Create brand
    
    Draft --> Reviewing: Submit for review
    Draft --> Archived: Delete
    
    Reviewing --> Approved: Admin approves
    Reviewing --> Rejected: Admin rejects
    Reviewing --> Draft: Edit
    
    Rejected --> Draft: Revise
    Rejected --> Archived: Cancel
    
    Approved --> Published: Publish products
    Approved --> Draft: Make changes
    
    Published --> Paused: Pause sales
    Published --> Archived: Discontinue
    
    Paused --> Published: Resume
    Paused --> Archived: Discontinue
    
    Archived --> [*]
```

### 6. Entity Relationship Diagrams
**When:** Showing database schema  
**Shows:** Tables and relationships

```mermaid
erDiagram
    USERS ||--o{ BRANDS : creates
    USERS ||--o{ ORDERS : places
    USERS {
        uuid id PK
        string email UK
        timestamp created_at
        enum role
    }
    
    BRANDS ||--o{ PRODUCTS : contains
    BRANDS {
        uuid id PK
        uuid creator_id FK
        jsonb brand_kit
        string status
        timestamp created_at
    }
    
    PRODUCTS ||--o{ ORDER_ITEMS : "ordered in"
    PRODUCTS {
        uuid id PK
        uuid brand_id FK
        string title
        decimal price
        string printify_product_id
    }
    
    ORDERS ||--|{ ORDER_ITEMS : contains
    ORDERS {
        uuid id PK
        uuid user_id FK
        string stripe_payment_id
        enum status
        decimal total
        timestamp created_at
    }
    
    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        integer quantity
        decimal price
    }
```

## Auto-extraction from Code

### Extract Package Structure

```typescript
// Scan monorepo packages
function extractPackageStructure(): DiagramNode[] {
  const packagesDir = 'packages';
  const packages = fs.readdirSync(packagesDir);
  
  return packages.map(pkg => {
    const packageJson = JSON.parse(
      fs.readFileSync(`${packagesDir}/${pkg}/package.json`, 'utf-8')
    );
    
    return {
      id: pkg,
      label: packageJson.name || pkg,
      type: detectPackageType(pkg), // frontend, backend, worker, shared
      dependencies: Object.keys(packageJson.dependencies || {})
        .filter(dep => dep.startsWith('@flashfusion/'))
    };
  });
}

function detectPackageType(pkgName: string): string {
  if (pkgName.includes('frontend') || pkgName.includes('dashboard')) {
    return 'frontend';
  } else if (pkgName.includes('api') || pkgName.includes('backend')) {
    return 'backend';
  } else if (pkgName.includes('worker')) {
    return 'worker';
  } else {
    return 'shared';
  }
}
```

### Extract API Endpoints

```typescript
// Parse tRPC routers
function extractAPIEndpoints(): Endpoint[] {
  const routerFiles = glob.sync('packages/backend/api/**/*.router.ts');
  
  return routerFiles.flatMap(file => {
    const ast = parseTypeScript(fs.readFileSync(file, 'utf-8'));
    return extractProcedures(ast);
  });
}

// Generate sequence diagram for specific endpoint
function generateSequenceDiagram(endpoint: Endpoint): string {
  const steps = analyzeExecutionFlow(endpoint.implementation);
  
  return `
sequenceDiagram
    participant Client
    participant API
    ${steps.map(s => `participant ${s.service}`).join('\n    ')}
    
    Client->>API: ${endpoint.method} ${endpoint.path}
    ${steps.map(s => `API->>${s.service}: ${s.action}`).join('\n    ')}
  `;
}
```

## Mermaid Best Practices

### Color Scheme (Consistent)

```typescript
const COLORS = {
  frontend: {
    fill: '#4f46e5',    // Indigo
    stroke: '#312e81',
    text: '#fff'
  },
  backend: {
    fill: '#10b981',    // Green
    stroke: '#065f46',
    text: '#fff'
  },
  worker: {
    fill: '#f59e0b',    // Amber
    stroke: '#b45309',
    text: '#fff'
  },
  external: {
    fill: '#6366f1',    // Purple
    stroke: '#4338ca',
    text: '#fff'
  },
  ai: {
    fill: '#ec4899',    // Pink
    stroke: '#be185d',
    text: '#fff'
  },
  database: {
    fill: '#10b981',    // Green
    stroke: '#065f46',
    text: '#fff'
  },
  error: {
    fill: '#ef4444',    // Red
    stroke: '#991b1b',
    text: '#fff'
  }
};
```

### Complexity Rules

- **Max 10 nodes** per diagram
- **Max 15 edges** per diagram
- If exceeded: Create multiple diagrams (Level 1 → Level 2 → Level 3)

### Naming Conventions

```typescript
// Diagram files
const diagramNaming = {
  systemContext: 'system-context.mmd',
  container: 'container-view.mmd',
  component: 'component-{service-name}.mmd',
  sequence: 'sequence-{flow-name}.mmd',
  flowchart: 'flowchart-{process-name}.mmd',
  state: 'state-{entity-name}.mmd',
  erd: 'erd-database.mmd'
};

// Node IDs: camelCase
// Labels: Readable with line breaks
// File paths: kebab-case
```

### Validation

```typescript
// Validate Mermaid syntax before saving
function validateMermaid(code: string): boolean {
  try {
    // Use mermaid CLI or API to validate
    const result = execSync(`mmdc -i - -o /dev/null`, {
      input: code,
      encoding: 'utf-8'
    });
    return true;
  } catch (error) {
    console.error('Invalid Mermaid syntax:', error.message);
    return false;
  }
}
```

## File Storage Structure

```
docs/diagrams/
├── system-context.mmd          # C4 Level 1
├── container-view.mmd          # C4 Level 2
├── component-dashboard.mmd     # C4 Level 3
├── component-api.mmd
├── component-workers.mmd
├── sequence-brand-generation.mmd
├── sequence-payment-flow.mmd
├── sequence-auth-flow.mmd
├── flowchart-image-upload.mmd
├── flowchart-order-processing.mmd
├── state-brand-lifecycle.mmd
├── state-order-lifecycle.mmd
└── erd-database.mmd
```

## Integration with Notion

```typescript
async function syncDiagramToNotion(
  diagramPath: string,
  notionPageId: string
): Promise<void> {
  const mermaidCode = fs.readFileSync(diagramPath, 'utf-8');
  
  // Update Notion page with Mermaid code block
  await notion.updatePage({
    pageId: notionPageId,
    blocks: [
      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: 'Architecture Diagram' } }]
        }
      },
      {
        type: 'code',
        code: {
          language: 'mermaid',
          rich_text: [{ text: { content: mermaidCode } }]
        }
      },
      {
        type: 'callout',
        callout: {
          icon: { emoji: '💡' },
          rich_text: [{
            text: {
              content: `Last updated: ${new Date().toISOString()}`
            }
          }]
        }
      }
    ]
  });
}
```

## Usage Example

```bash
# Generate container diagram
$ claude-code
> /diagram container

# Diagram Generator Agent:
# 1. Scans packages/ directory
# 2. Identifies: dashboard, api, workers, ai, integrations
# 3. Extracts dependencies from package.json
# 4. Generates Mermaid code
# 5. Validates syntax
# 6. Saves: docs/diagrams/container-view.mmd
# 7. Syncs to Notion

✅ Container diagram generated
📊 Local: docs/diagrams/container-view.mmd
🔗 Notion: https://notion.so/flashfusion/architecture
```
EOF

# 5. Install api-documenter skill
echo -e "${BLUE}📋 Installing api-documenter skill...${NC}"
cat > .claude/skills/api-documenter/SKILL.md << 'EOF'
---
name: api-documenter
version: 1.0.0
description: Documents API endpoints with TypeScript types and examples
author: Kyle Rosebrook
triggers:
  keywords:
    - document API
    - API documentation
    - endpoint docs
  intent_patterns:
    - "User wants to document API endpoints"
  content_patterns:
    - file_paths:
      - "**/*.router.ts"
      - "**/*.routes.ts"
enforcement: suggest
---

# API Documenter Skill

## Standard API Documentation Format

```markdown
# [Resource] API

## Overview
[Brief description of what this API manages]

**Base URL:** `https://flashfusion.com/api/[resource]`
**Auth Required:** Yes (Bearer token)

---

## Endpoints

### GET /api/[resource]/:id

**Purpose:** Retrieve a single [resource] by ID

**Auth Required:** Yes

**Request:**
```typescript
interface GetResourceRequest {
  params: {
    id: string; // UUID format
  };
  headers: {
    Authorization: string; // "Bearer {token}"
  };
}
```

**Response (200):**
```typescript
interface Resource {
  id: string;
  created_at: string; // ISO 8601
  updated_at: string;
  // ... other fields
}
```

**Response (404):**
```typescript
interface ErrorResponse {
  error: string;
  code: 'RESOURCE_NOT_FOUND';
}
```

**Example:**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://flashfusion.com/api/brands/123e4567-e89b-12d3
```

**Example Response:**
```json
{
  "id": "123e4567-e89b-12d3",
  "created_at": "2025-02-04T12:00:00Z",
  "status": "active"
}
```

**Rate Limits:** 100 requests/minute per user

**Required ENV Vars:**
- `DATABASE_URL` - Supabase connection string
- `JWT_SECRET` - Token signing key

---
```

## tRPC Router Parsing

```typescript
// Extract procedures from tRPC router
function extractTRPCProcedures(routerFile: string): Procedure[] {
  const code = fs.readFileSync(routerFile, 'utf-8');
  const ast = parseTypeScript(code);
  
  const procedures: Procedure[] = [];
  
  // Find router definition
  traverse(ast, {
    CallExpression(path) {
      if (path.node.callee.property?.name === 'query' ||
          path.node.callee.property?.name === 'mutation') {
        
        const procedureName = getProcedureName(path);
        const inputType = extractInputType(path);
        const outputType = extractOutputType(path);
        const implementation = extractImplementation(path);
        
        procedures.push({
          name: procedureName,
          type: path.node.callee.property.name, // query or mutation
          input: inputType,
          output: outputType,
          implementation
        });
      }
    }
  });
  
  return procedures;
}
```

## Auto-generation Example

```typescript
// Generate docs from tRPC router
async function documentTRPCRouter(routerPath: string): Promise<string> {
  const procedures = extractTRPCProcedures(routerPath);
  const resourceName = path.basename(routerPath, '.router.ts');
  
  let docs = `# ${capitalize(resourceName)} API\n\n`;
  
  for (const proc of procedures) {
    docs += generateProcedureDoc(proc);
  }
  
  return docs;
}

function generateProcedureDoc(proc: Procedure): string {
  const method = proc.type === 'query' ? 'GET' : 'POST';
  const endpoint = `/api/trpc/${proc.name}`;
  
  return `
### ${method} ${endpoint}

**Purpose:** ${inferPurpose(proc.name)}

**Input:**
\`\`\`typescript
${proc.input}
\`\`\`

**Output:**
\`\`\`typescript
${proc.output}
\`\`\`

**Example:**
\`\`\`typescript
const result = await trpc.${proc.name}.${proc.type}(${generateExampleInput(proc.input)});
\`\`\`

---
`;
}
```

## Usage

```bash
# Document changed API files
$ claude-code
> /doc-update --api

# API Documenter Agent:
# 1. Finds changed .router.ts files
# 2. Extracts procedures and types
# 3. Generates markdown docs
# 4. Saves to docs/api/
# 5. Creates PR

✅ API docs updated
📝 Files: docs/api/brands.md, docs/api/products.md
```
EOF

echo -e "${GREEN}✅ All skills installed${NC}"
echo ""

# 6. Create main documentation agent
echo -e "${BLUE}🤖 Creating documentation agent...${NC}"
cat > .claude/agents/doc-agent.yaml << 'EOF'
name: documentation-agent
version: 1.0.0
description: Main documentation orchestrator for FlashFusion ecosystem

systemPrompt: |
  You are a Staff Documentation Engineer for FlashFusion, a print-on-demand creator platform.
  
  **Responsibilities:**
  1. Generate and maintain documentation across 53-repo monorepo
  2. Create ADRs for architectural decisions
  3. Generate Mermaid diagrams for system architecture
  4. Document API endpoints with TypeScript types
  5. Maintain error catalogs with Cause → Fix → Retry format
  6. Sync docs to GitHub, Notion, and Linear
  
  **Stack Knowledge:**
  - TypeScript, Next.js, Express, tRPC
  - Supabase (PostgreSQL + Auth + RLS)
  - Firebase (legacy auth, migrating away)
  - Stripe (payments), Printify (POD), n8n (automation)
  - OpenAI GPT-4o (brand kit generation)
  - Anthropic Claude (Continuum opportunity scoring)
  
  **Always Follow:**
  - MADR template for ADRs
  - C4 model for diagrams
  - Diátaxis framework for content organization
  - Security-first (never expose secrets)
  - Cause → Fix → Retry for error handling
  
  **Quality Gates:**
  - All Mermaid diagrams must render
  - No secrets in any docs
  - TypeScript types in all API docs
  - Cross-references must be valid
  - Code examples must be executable

skills:
  - doc-coordinator
  - adr-writer
  - diagram-generator
  - api-documenter
  - staff-engineer-v3
  - skill-developer

mcps:
  - github
  - notion
  - linear

subagents:
  - adr-writer-agent
  - diagram-generator-agent
  - api-documenter-agent

defaultBehavior:
  - Analyze code changes first
  - Determine which docs need updates
  - Delegate to specialized subagents
  - Verify quality before committing
  - Create PRs for doc updates
  - Sync to Notion/Linear

hooks:
  - PreToolUse: Check if commit includes code changes
  - PostToolUse: Suggest doc updates if needed
EOF

# 7. Create specialized subagents
echo -e "${BLUE}🤖 Creating subagents...${NC}"

cat > .claude/agents/adr-writer-agent.yaml << 'EOF'
name: adr-writer-agent
version: 1.0.0
description: Specialized agent for writing Architecture Decision Records

systemPrompt: |
  You are an ADR specialist. Write clear, comprehensive Architecture Decision Records following the MADR template.
  
  **When Analyzing a Decision:**
  1. Identify the problem/context
  2. List all considered options
  3. Document decision drivers (requirements, constraints)
  4. Explain the chosen option with rationale
  5. List positive and negative consequences
  6. Add implementation notes and links
  
  **For FlashFusion:**
  - Always consider: cost, scalability, team expertise, integration complexity
  - Always document: security implications, compliance requirements
  - Always link: to implementation PR, related ADRs, documentation
  
  **Auto-number ADRs:** Find highest existing number, increment by 1

skills:
  - adr-writer

mcps:
  - github

input:
  context: string # Architectural context that triggered ADR
  decision: string # What decision was made
  options: array # What options were considered

output:
  adr_file: string # Path to generated ADR
  pr_url: string # GitHub PR URL
EOF

cat > .claude/agents/diagram-generator-agent.yaml << 'EOF'
name: diagram-generator-agent
version: 1.0.0
description: Generates Mermaid architecture diagrams

systemPrompt: |
  You generate clear, readable Mermaid diagrams following C4 model principles.
  
  **Rules:**
  - Max 10 nodes per diagram (create multiple if needed)
  - Use consistent colors (Frontend: #4f46e5, Backend: #10b981, External: #f59e0b)
  - Add descriptive labels, not just IDs
  - Store as .mmd files in docs/diagrams/
  - Validate syntax before saving
  
  **Types You Generate:**
  1. System Context (C4 Level 1) - High-level overview
  2. Container Diagram (C4 Level 2) - Internal structure
  3. Sequence Diagrams - Request/response flows
  4. Flowcharts - Decision logic
  5. State Diagrams - Object lifecycle
  6. ERDs - Database schema

skills:
  - diagram-generator

mcps:
  - github
  - notion

input:
  diagramType: string # system-context | container | sequence | flowchart | state | erd
  components: array # List of components to include
  relationships: array # How components interact

output:
  mermaid_file: string # Path to .mmd file
  notion_url: string # Notion page with diagram
EOF

cat > .claude/agents/api-documenter-agent.yaml << 'EOF'
name: api-documenter-agent
version: 1.0.0
description: Documents API endpoints with TypeScript types

systemPrompt: |
  You document API endpoints in a clear, consistent format.
  
  **For Each Endpoint:**
  1. Purpose (one sentence)
  2. Auth requirements
  3. Request schema (TypeScript)
  4. Response schemas (success + error)
  5. Rate limits
  6. Example curl command
  7. Required env vars
  
  **Extract From:**
  - tRPC routers (*.router.ts)
  - Express routes (*.routes.ts)
  - OpenAPI specs (if exist)

skills:
  - api-documenter

mcps:
  - github

input:
  files: array # Changed API files

output:
  api_docs: array # Generated API documentation files
EOF

echo -e "${GREEN}✅ Agents created${NC}"
echo ""

# 8. Create slash commands
echo -e "${BLUE}⚡ Creating slash commands...${NC}"

cat > .claude/slash-commands/doc-update.yaml << 'EOF'
name: doc-update
description: Update documentation based on recent code changes
category: documentation

command: |
  /doc-update [--full | --adr | --diagrams | --api]

options:
  - name: full
    description: Update all documentation
    default: true
  - name: adr
    description: Only generate/update ADRs
  - name: diagrams
    description: Only update diagrams
  - name: api
    description: Only update API docs

execution:
  agent: documentation-agent
  workflow: |
    1. Analyze git diff (last commit or PR)
    2. Determine what changed
    3. Route to appropriate subagent(s)
    4. Generate documentation
    5. Create GitHub PR with changes

example: |
  # Update all docs
  /doc-update
  
  # Only create ADR for recent architectural change
  /doc-update --adr
  
  # Update API docs after adding new endpoint
  /doc-update --api
EOF

cat > .claude/slash-commands/create-adr.yaml << 'EOF'
name: create-adr
description: Create a new Architecture Decision Record
category: documentation

command: |
  /create-adr "<title>" --context "<context>" --decision "<decision>"

parameters:
  - name: title
    required: true
    description: ADR title (present tense verb phrase)
  - name: context
    required: true
    description: Problem statement and context
  - name: decision
    required: true
    description: What was decided

execution:
  agent: adr-writer-agent
  workflow: |
    1. Generate ADR number (auto-increment)
    2. Create ADR from MADR template
    3. Fill in context, decision, consequences
    4. Save to docs/decisions/
    5. Create GitHub PR

example: |
  /create-adr "Use Supabase RLS for authorization" \
    --context "Need database-level security for multi-tenant app" \
    --decision "Implement RLS policies instead of application-level auth checks"
EOF

cat > .claude/slash-commands/diagram.yaml << 'EOF'
name: diagram
description: Generate architecture diagram
category: documentation

command: |
  /diagram <type> [--components "<list>"]

parameters:
  - name: type
    required: true
    options: [system-context, container, sequence, flowchart, state, erd]
  - name: components
    description: Comma-separated list of components to include

execution:
  agent: diagram-generator-agent

example: |
  # Generate system context diagram
  /diagram system-context
  
  # Generate container diagram with specific packages
  /diagram container --components "dashboard,api,workers,ai"
  
  # Generate sequence diagram for auth flow
  /diagram sequence --components "user,dashboard,api,supabase,stripe"
EOF

echo -e "${GREEN}✅ Slash commands created${NC}"
echo ""

# 9. Create hooks
echo -e "${BLUE}🪝 Creating hooks...${NC}"

cat > .claude/hooks/pre-commit-doc-check.yaml << 'EOF'
name: pre-commit-doc-check
type: PreToolUse
description: Check if commit needs documentation updates

trigger:
  tool: bash_tool
  pattern: "git commit"

logic: |
  # Get staged files
  const staged = execSync('git diff --cached --name-only').toString().split('\n');
  
  # Check what changed
  const needsADR = staged.some(f => 
    f.includes('config/') || 
    f.includes('infrastructure/') ||
    f.match(/new.*service/) ||
    f.includes('package.json')
  );
  
  const needsAPI = staged.some(f => 
    f.includes('.router.ts') ||
    f.includes('.routes.ts')
  );
  
  const needsDiagram = staged.some(f =>
    f.includes('packages/') && f.includes('package.json')
  );
  
  # Suggest updates
  if (needsADR) {
    console.log('⚠️  Architectural change detected. Consider: /create-adr');
  }
  
  if (needsAPI) {
    console.log('⚠️  API change detected. Consider: /doc-update --api');
  }
  
  if (needsDiagram) {
    console.log('⚠️  Package structure changed. Consider: /diagram container');
  }

allow: true # Don't block commit, just warn
EOF

cat > .claude/hooks/post-pr-merge.yaml << 'EOF'
name: post-pr-merge
type: SessionStart
description: Auto-update docs after PR merge

trigger:
  event: github_pr_merged

logic: |
  # Get PR details via GitHub MCP
  const pr = await github.getPullRequest(prNumber);
  const files = pr.files.map(f => f.filename);
  
  # Determine doc updates needed
  const updates = {
    adr: files.some(f => f.includes('infrastructure/') || f.includes('config/')),
    api: files.some(f => f.includes('.router.ts') || f.includes('.routes.ts')),
    diagrams: files.some(f => f.includes('packages/') && f.includes('package.json'))
  };
  
  # Spawn documentation agent if needed
  if (Object.values(updates).some(Boolean)) {
    await Task({
      agent: 'documentation-agent',
      input: { prNumber, files, updates }
    });
  }
EOF

echo -e "${GREEN}✅ Hooks created${NC}"
echo ""

# 10. Configure MCPs
echo -e "${BLUE}🔌 Configuring MCPs...${NC}"
cat > .claude/mcp-config.json << 'EOF'
{
  "mcpServers": {
    "github": {
      "type": "url",
      "url": "https://github-mcp.anthropic.com/sse",
      "name": "github-mcp",
      "config": {
        "owner": "krosebrook",
        "repos": [
          "source-of-truth-monorepo",
          "continuum",
          "interact",
          "Flashfusionwebsite",
          "Flashfusionwebsitev20",
          "Enterpriseprofilebuilder"
        ]
      }
    },
    "notion": {
      "type": "url",
      "url": "https://mcp.notion.com/mcp",
      "name": "notion-mcp",
      "config": {
        "workspace": "FlashFusion"
      }
    },
    "linear": {
      "type": "url",
      "url": "https://mcp.linear.app/mcp",
      "name": "linear-mcp",
      "config": {
        "team": "FlashFusion"
      }
    }
  }
}
EOF

echo -e "${GREEN}✅ MCPs configured${NC}"
echo ""

# 11. Create initial documentation structure
echo -e "${BLUE}📚 Creating initial documentation...${NC}"

cat > docs/README.md << 'EOF'
# FlashFusion Ecosystem Documentation

## 🚀 Quick Navigation

### Architecture
- [Monorepo Structure](./architecture/monorepo-structure.md)
- [System Diagrams](./diagrams/)
- [Architecture Decisions (ADRs)](./decisions/)

### API Reference
- [API Documentation](./api/)
- [tRPC Endpoints](./api/trpc-endpoints.md)

### Guides
- [Getting Started](./tutorials/getting-started.md)
- [Deployment Guide](./how-to-guides/deploy.md)
- [Error Troubleshooting](./errors/)

### Context Notes
- [Engineering History](./context-notes/)
- [Known Constraints](./context-notes/)

---

## 🤖 Auto-Generated by Claude Code

This documentation is maintained by Claude Code's documentation agent.

### Update Documentation

```bash
# Update all docs
/doc-update

# Create new ADR
/create-adr "Your decision title"

# Generate diagram
/diagram container
```

---

## 📦 Projects

### FlashFusion
Print-on-demand creator platform  
**Stack:** Next.js, Express, tRPC, Supabase, Stripe, Printify  
**Scale:** ~15K creators, ~2K transactions/month

### Continuum
AI-powered opportunity discovery platform  
**Stack:** TypeScript, Claude Sonnet 4, Next.js

### INTeract
Base44 app experiments  
**Stack:** JavaScript, Base44 platform

### Enterprise Profile Builder
Enterprise-grade profile management  
**Stack:** TypeScript, Next.js

---

## 📊 Documentation Coverage

Last updated: 2025-02-05

- **ADRs:** 0/15 decisions documented (0%)
- **API Docs:** 0/52 endpoints documented (0%)
- **Diagrams:** 0/5 diagrams generated
- **Error Catalog:** 0/30 errors documented (0%)

Run `/doc-update --full` to bootstrap documentation.

---

## 🤝 Contributing

### Adding Documentation

1. Use slash commands when possible
2. Follow MADR template for ADRs
3. Use Mermaid for diagrams
4. Include TypeScript types in API docs
5. Never commit secrets

### Documentation Standards

- **ADRs:** MADR template, present-tense titles
- **Diagrams:** C4 model, max 10 nodes
- **API Docs:** TypeScript types, examples, rate limits
- **Errors:** Cause → Fix → Retry format

---

## 🔗 External Links

- [GitHub Repository](https://github.com/krosebrook/source-of-truth-monorepo)
- [Notion Workspace](https://notion.so/flashfusion)
- [Linear Board](https://linear.app/flashfusion)
EOF

# 12. Create .env.example
cat > .env.example << 'EOF'
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_KEY=xxxxx

# Authentication
JWT_SECRET=your_jwt_secret_min_32_chars
SESSION_TIMEOUT=3600

# Payments
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Print-on-Demand
PRINTIFY_API_KEY=xxxxx
PRINTIFY_SHOP_ID=xxxxx

# AI Services
OPENAI_API_KEY=sk-xxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Integrations
FIREBASE_SERVICE_ACCOUNT={"type":"service_account"}
N8N_WEBHOOK_URL=https://xxxxx.app.n8n.cloud/webhook/xxxxx
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# Monitoring
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
POSTHOG_API_KEY=phc_xxxxx

# Claude Code
ANTHROPIC_API_KEY=sk-ant-xxxxx

# External Services
NOTION_API_KEY=secret_xxxxx
NOTION_ARCHITECTURE_PAGE_ID=xxxxx
LINEAR_API_KEY=lin_api_xxxxx

# Environment
NODE_ENV=development
PORT=3000
EOF

echo -e "${GREEN}✅ Documentation structure created${NC}"
echo ""

# 13. Create gitignore additions
cat >> .gitignore << 'EOF'

# Claude Code
.claude/cache/
.claude/logs/

# Environment
.env
.env.local
.env.*.local
EOF

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo ""
echo "1. Configure MCPs:"
echo "   ${BLUE}vi .claude/mcp-config.json${NC}"
echo "   Add your GitHub personal access token"
echo ""
echo "2. Set environment variables:"
echo "   ${BLUE}cp .env.example .env${NC}"
echo "   ${BLUE}vi .env${NC}"
echo "   Add your ANTHROPIC_API_KEY and other credentials"
echo ""
echo "3. Test slash commands:"
echo "   ${BLUE}claude-code${NC}"
echo "   ${BLUE}> /doc-update --help${NC}"
echo "   ${BLUE}> /create-adr --help${NC}"
echo "   ${BLUE}> /diagram --help${NC}"
echo ""
echo "4. Generate initial documentation:"
echo "   ${BLUE}> /doc-update --full${NC}"
echo ""
echo "5. Verify output:"
echo "   ${BLUE}ls docs/decisions/${NC}  # Should see ADRs"
echo "   ${BLUE}ls docs/diagrams/${NC}   # Should see .mmd files"
echo "   ${BLUE}ls docs/api/${NC}        # Should see API docs"
echo ""
echo -e "${YELLOW}📚 Available Commands:${NC}"
echo "  ${BLUE}/doc-update${NC}         - Update all documentation"
echo "  ${BLUE}/create-adr <title>${NC} - Create new ADR"
echo "  ${BLUE}/diagram <type>${NC}     - Generate architecture diagram"
echo ""
echo -e "${YELLOW}🔗 Directory Structure Created:${NC}"
echo "  .claude/"
echo "  ├── agents/          (4 agent configs)"
echo "  ├── skills/          (4 skill definitions)"
echo "  ├── slash-commands/  (3 commands)"
echo "  ├── hooks/           (2 automation hooks)"
echo "  └── mcp-config.json"
echo ""
echo "  docs/"
echo "  ├── decisions/       (ADRs)"
echo "  ├── diagrams/        (Mermaid files)"
echo "  ├── api/             (API documentation)"
echo "  ├── errors/          (Error catalog)"
echo "  ├── tutorials/       (Getting started guides)"
echo "  ├── how-to-guides/   (Task-oriented docs)"
echo "  ├── reference/       (Technical specs)"
echo "  └── explanation/     (Concept docs)"
echo ""
echo -e "${GREEN}Happy documenting! 🚀${NC}"
