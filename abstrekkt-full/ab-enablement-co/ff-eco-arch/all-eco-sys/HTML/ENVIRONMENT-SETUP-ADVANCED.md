# **Advanced Environment Setup: AI-Specific & Power Tools**
## **LLM Development, Team Productivity, & Advanced Debugging**

**Version:** 1.0.0  
**Created:** December 26, 2025  
**Owner:** Staff Platform Engineer  
**Status:** Recommendations (Beyond Core Setup)

---

## **TL;DR**

Beyond the 30 core enhancements, these **25 advanced tools** unlock AI-specific workflows, team productivity, and power-user debugging capabilities.

**AI/LLM-Specific (Critical for Your Platform):**
1. **Prompt playground** - Test prompts before shipping
2. **Token usage dashboard** - Real-time cost tracking
3. **LLM response caching** - 60% cost reduction
4. **Prompt version control** - Track prompt changes like code
5. **Model A/B testing** - Compare Claude vs GPT vs Gemini

**Developer Productivity (10x Velocity):**
6. **GitHub Copilot Workspace** - AI pair programming
7. **Code snippet library** - Reusable patterns
8. **Cursor IDE integration** - AI-native development
9. **Local LLM setup** - Test without API costs
10. **AI code review bot** - Automated PR reviews

---

## **Table of Contents**

1. [AI/LLM Development Tools](#aillm-development-tools)
2. [Developer Productivity Enhancements](#developer-productivity-enhancements)
3. [Advanced Debugging & Profiling](#advanced-debugging--profiling)
4. [Team Collaboration & Knowledge](#team-collaboration--knowledge)
5. [Database & Data Management](#database--data-management)
6. [Mobile & Multi-Platform](#mobile--multi-platform)
7. [Compliance & Governance](#compliance--governance)
8. [Developer Onboarding Automation](#developer-onboarding-automation)
9. [Cost Optimization Tools](#cost-optimization-tools)
10. [Emergency & Incident Response](#emergency--incident-response)

---

## **AI/LLM Development Tools**

### **1. Prompt Playground (PromptFoo/LangSmith)**

**Why:** Test prompts systematically before shipping to production

**Setup with PromptFoo:**

```yaml
# promptfooconfig.yaml
description: "Agent code generation prompts"

prompts:
  - file://prompts/code-generation-v1.txt
  - file://prompts/code-generation-v2.txt

providers:
  - anthropic:messages:claude-sonnet-4-5-20250514
  - openai:gpt-4
  - vertex:gemini-pro

tests:
  - vars:
      task: "Create a React component for user login"
      language: "TypeScript"
    assert:
      - type: contains
        value: "useState"
      - type: contains
        value: "form"
      - type: cost
        threshold: 0.05  # Max $0.05 per generation
      - type: latency
        threshold: 5000  # Max 5 seconds
  
  - vars:
      task: "Fix SQL injection vulnerability"
      language: "Python"
    assert:
      - type: contains
        value: "parameterized"
      - type: not-contains
        value: "string concatenation"
      - type: llm-rubric
        value: "Code properly sanitizes user input"
```

```bash
# Run prompt tests
npx promptfoo eval

# View results in UI
npx promptfoo view

# Output: Side-by-side comparison of prompts across models
```

**Impact:** Catch prompt regressions, optimize for cost/quality trade-offs

---

### **2. Real-Time Token Usage Dashboard**

**Why:** Track LLM costs in real-time, prevent budget overruns

**Implementation:**

```typescript
// lib/token-tracker.ts
import { Redis } from "ioredis";
import { PostHog } from "posthog-node";

const redis = new Redis(process.env.REDIS_URL);
const posthog = new PostHog(process.env.POSTHOG_API_KEY!);

interface TokenUsage {
  userId: string;
  agentId: string;
  tokensUsed: number;
  costUsd: number;
  model: string;
  timestamp: number;
}

export async function trackTokenUsage(usage: TokenUsage) {
  // Increment user's daily usage
  const dailyKey = `tokens:daily:${usage.userId}:${new Date().toISOString().split("T")[0]}`;
  await redis.incrby(dailyKey, usage.tokensUsed);
  await redis.expire(dailyKey, 86400 * 7); // 7 day retention
  
  // Track monthly totals
  const monthlyKey = `tokens:monthly:${usage.userId}:${new Date().toISOString().substring(0, 7)}`;
  await redis.incrby(monthlyKey, usage.tokensUsed);
  
  // Send to PostHog for analytics
  posthog.capture({
    distinctId: usage.userId,
    event: "token_usage",
    properties: {
      agent_id: usage.agentId,
      tokens_used: usage.tokensUsed,
      cost_usd: usage.costUsd,
      model: usage.model,
    },
  });
  
  // Check quota warnings
  const dailyUsage = await redis.get(dailyKey);
  const dailyLimit = 100000; // 100K tokens/day
  
  if (parseInt(dailyUsage || "0") > dailyLimit * 0.8) {
    // 80% warning
    await sendSlackAlert({
      channel: "#engineering",
      message: `⚠️ User ${usage.userId} at 80% daily token quota`,
    });
  }
}

// Usage in agent executor
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5-20250514",
  messages: [{ role: "user", content: prompt }],
});

await trackTokenUsage({
  userId: user.id,
  agentId: "claude-code-cli",
  tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
  costUsd: calculateCost(response.usage),
  model: "claude-sonnet-4-5",
  timestamp: Date.now(),
});
```

**Dashboard (PostHog/Grafana):**

```sql
-- Real-time token usage by user (PostHog query)
SELECT
  properties.user_id,
  SUM(properties.tokens_used) as total_tokens,
  SUM(properties.cost_usd) as total_cost,
  COUNT(*) as api_calls
FROM events
WHERE event = 'token_usage'
  AND timestamp >= NOW() - INTERVAL '1 day'
GROUP BY properties.user_id
ORDER BY total_cost DESC
LIMIT 20;
```

**Impact:** Prevent surprise bills, identify cost optimization opportunities

---

### **3. LLM Response Caching**

**Why:** Reduce costs 40-60% by caching identical prompts

**Implementation:**

```typescript
// lib/llm-cache.ts
import { Redis } from "ioredis";
import crypto from "crypto";

const redis = new Redis(process.env.REDIS_URL);

interface CachedResponse {
  content: string;
  tokensUsed: number;
  model: string;
  cached: boolean;
}

export async function cachedLLMCall(
  prompt: string,
  model: string,
  generator: () => Promise<any>
): Promise<CachedResponse> {
  // Create cache key from prompt + model
  const hash = crypto
    .createHash("sha256")
    .update(`${model}:${prompt}`)
    .digest("hex");
  
  const cacheKey = `llm:cache:${hash}`;
  
  // Check cache
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    const data = JSON.parse(cached);
    
    // Track cache hit
    await redis.incr("llm:cache:hits");
    
    return {
      ...data,
      cached: true,
    };
  }
  
  // Cache miss: call LLM
  const response = await generator();
  
  const result = {
    content: response.content[0].text,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
    model,
    cached: false,
  };
  
  // Cache for 24 hours
  await redis.setex(cacheKey, 86400, JSON.stringify(result));
  await redis.incr("llm:cache:misses");
  
  return result;
}

// Usage
const response = await cachedLLMCall(
  "Generate a React login component",
  "claude-sonnet-4-5",
  () =>
    anthropic.messages.create({
      model: "claude-sonnet-4-5-20250514",
      messages: [
        {
          role: "user",
          content: "Generate a React login component with TypeScript",
        },
      ],
    })
);

// Get cache stats
const hits = await redis.get("llm:cache:hits");
const misses = await redis.get("llm:cache:misses");
const hitRate = (parseInt(hits || "0") / (parseInt(hits || "0") + parseInt(misses || "0"))) * 100;

console.log(`Cache hit rate: ${hitRate.toFixed(2)}%`);
```

**Advanced: Semantic Caching**

```typescript
// lib/semantic-cache.ts
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function semanticCache(
  prompt: string,
  threshold: number = 0.95
): Promise<string | null> {
  // Generate embedding for prompt
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: prompt,
  });
  
  // Search for similar prompts (vector similarity)
  const { data, error } = await supabase.rpc("match_prompts", {
    query_embedding: embedding.data[0].embedding,
    match_threshold: threshold,
    match_count: 1,
  });
  
  if (data && data.length > 0) {
    return data[0].cached_response;
  }
  
  return null;
}
```

**Impact:** 40-60% cost reduction, 10x faster responses for cached prompts

---

### **4. Prompt Version Control (Git-Based)**

**Why:** Track prompt changes like code, enable rollbacks

**Structure:**

```
prompts/
├── code-generation/
│   ├── v1.0.0.txt
│   ├── v1.1.0.txt
│   ├── v2.0.0.txt (current)
│   └── CHANGELOG.md
├── code-review/
│   ├── v1.0.0.txt (current)
│   └── CHANGELOG.md
└── test-generation/
    ├── v1.0.0.txt
    ├── v1.1.0.txt (current)
    └── CHANGELOG.md
```

**CHANGELOG.md Example:**

```markdown
# Code Generation Prompt Changelog

## [2.0.0] - 2025-12-15
### Changed
- BREAKING: Now requires explicit security guidelines in system prompt
- Improved TypeScript type inference by 40%
- Added React 19 patterns

### Added
- Support for Next.js App Router patterns
- Tailwind CSS v4 utilities
- Error boundary generation

### Metrics
- Success rate: 85% → 92% (+7pp)
- Token usage: 4,500 → 3,800 (-15%)
- User satisfaction: 3.8 → 4.5 (+0.7)

## [1.1.0] - 2025-11-01
### Added
- Support for shadcn/ui components
- Accessibility guidelines (WCAG 2.2 AA)

### Fixed
- Fixed incorrect async/await patterns in generated code

### Metrics
- Success rate: 78% → 85% (+7pp)
```

**Loading Prompts:**

```typescript
// lib/prompt-loader.ts
import fs from "fs";
import path from "path";

export function loadPrompt(category: string, version?: string): string {
  const promptDir = path.join(process.cwd(), "prompts", category);
  
  if (version) {
    // Load specific version
    return fs.readFileSync(path.join(promptDir, `${version}.txt`), "utf-8");
  }
  
  // Load latest version (from package.json or config)
  const config = JSON.parse(
    fs.readFileSync(path.join(promptDir, "config.json"), "utf-8")
  );
  
  return fs.readFileSync(path.join(promptDir, `${config.current}.txt`), "utf-8");
}

// Usage
const codeGenPrompt = loadPrompt("code-generation"); // Latest
const oldPrompt = loadPrompt("code-generation", "v1.0.0"); // Specific version
```

**Impact:** Systematic prompt improvement, easy rollbacks

---

### **5. Model A/B Testing Framework**

**Why:** Compare Claude vs GPT vs Gemini performance systematically

**Implementation:**

```typescript
// lib/model-ab-test.ts
import { z } from "zod";

const ModelConfig = z.object({
  name: z.string(),
  provider: z.enum(["anthropic", "openai", "vertex"]),
  model: z.string(),
  trafficPercentage: z.number().min(0).max(100),
  costPerToken: z.number(),
});

const testConfig = [
  {
    name: "claude-sonnet",
    provider: "anthropic",
    model: "claude-sonnet-4-5-20250514",
    trafficPercentage: 70,
    costPerToken: 0.003,
  },
  {
    name: "gpt-4",
    provider: "openai",
    model: "gpt-4-turbo-2024-04-09",
    trafficPercentage: 20,
    costPerToken: 0.01,
  },
  {
    name: "gemini-pro",
    provider: "vertex",
    model: "gemini-1.5-pro",
    trafficPercentage: 10,
    costPerToken: 0.00125,
  },
];

export function selectModel(userId: string): (typeof testConfig)[0] {
  // Deterministic selection based on user ID (sticky)
  const hash = parseInt(
    crypto.createHash("md5").update(userId).digest("hex").substring(0, 8),
    16
  );
  
  const random = (hash % 100) + 1; // 1-100
  
  let cumulative = 0;
  for (const config of testConfig) {
    cumulative += config.trafficPercentage;
    if (random <= cumulative) {
      return config;
    }
  }
  
  return testConfig[0]; // Fallback
}

// Usage in agent executor
const model = selectModel(user.id);

const response = await callLLM(model, prompt);

// Track metrics by model
await trackModelMetrics({
  modelName: model.name,
  userId: user.id,
  success: response.success,
  tokensUsed: response.tokensUsed,
  costUsd: response.tokensUsed * model.costPerToken,
  latencyMs: response.latencyMs,
  userSatisfaction: await getUserFeedback(user.id),
});
```

**Analysis Dashboard:**

```sql
-- Compare model performance (PostHog/Mixpanel)
SELECT
  model_name,
  COUNT(*) as total_calls,
  AVG(CASE WHEN success = true THEN 1.0 ELSE 0.0 END) as success_rate,
  AVG(latency_ms) as avg_latency,
  SUM(cost_usd) as total_cost,
  AVG(user_satisfaction) as avg_satisfaction
FROM model_metrics
WHERE timestamp >= NOW() - INTERVAL '7 days'
GROUP BY model_name;

-- Result:
-- claude-sonnet: 92% success, 2.8s latency, $450 cost, 4.5 satisfaction
-- gpt-4: 88% success, 4.2s latency, $820 cost, 4.2 satisfaction
-- gemini-pro: 85% success, 3.1s latency, $180 cost, 4.0 satisfaction

-- Decision: Claude wins on success + satisfaction, Gemini wins on cost
```

**Impact:** Data-driven model selection, optimize cost/quality

---

## **Developer Productivity Enhancements**

### **6. GitHub Copilot Workspace Integration**

**Why:** AI pair programming for entire codebase

**Setup:**

```json
// .github/copilot/workspace.json
{
  "version": "1.0",
  "context": {
    "files": [
      "src/**/*.ts",
      "src/**/*.tsx",
      "prisma/schema.prisma",
      "docs/**/*.md"
    ],
    "exclude": [
      "node_modules/**",
      "dist/**",
      "*.test.ts"
    ]
  },
  "patterns": [
    {
      "name": "tRPC API Route",
      "template": "src/server/routers/example.ts",
      "description": "Create a new tRPC router with Zod validation"
    },
    {
      "name": "React Component",
      "template": "src/components/example.tsx",
      "description": "Create a new React component with TypeScript"
    },
    {
      "name": "Database Migration",
      "template": "prisma/migrations/example/migration.sql",
      "description": "Create a new database migration"
    }
  ],
  "customInstructions": [
    "Always use Zod for validation",
    "Always use tRPC for API routes",
    "Always include error handling with Cause → Fix → Retry pattern",
    "Always add JSDoc comments for public functions",
    "Never use `any` type - use `unknown` instead",
    "Always use const assertions for literal types"
  ]
}
```

**Custom Snippets:**

```json
// .vscode/copilot-snippets.json
{
  "tRPC Protected Route": {
    "prefix": "trpc-protected",
    "body": [
      "export const ${1:routerName}Router = router({",
      "  ${2:methodName}: protectedProcedure",
      "    .input(",
      "      z.object({",
      "        ${3:fieldName}: z.string(),",
      "      })",
      "    )",
      "    .mutation(async ({ ctx, input }) => {",
      "      // Enforce RLS: user can only access their own data",
      "      const result = await ctx.db.${4:model}.create({",
      "        data: {",
      "          ...input,",
      "          userId: ctx.session.user.id,",
      "        },",
      "      });",
      "      ",
      "      return result;",
      "    }),",
      "});"
    ],
    "description": "Create a tRPC protected procedure with RLS enforcement"
  }
}
```

**Impact:** 30% faster code generation, fewer boilerplate errors

---

### **7. Code Snippet Library (Internal)**

**Why:** Reusable patterns for common tasks

**Structure:**

```typescript
// lib/snippets/database.ts
export const snippets = {
  // Paginated query with cursor
  paginatedQuery: `
    const items = await prisma.item.findMany({
      take: limit + 1, // Take one extra to check if there's more
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      where: {
        userId: ctx.session.user.id, // RLS enforcement
      },
    });
    
    const hasMore = items.length > limit;
    const results = hasMore ? items.slice(0, -1) : items;
    const nextCursor = hasMore ? results[results.length - 1].id : null;
    
    return { items: results, nextCursor, hasMore };
  `,
  
  // Optimistic locking
  optimisticLocking: `
    const updated = await prisma.item.update({
      where: {
        id: itemId,
        version: currentVersion, // Optimistic locking
      },
      data: {
        ...updates,
        version: { increment: 1 },
      },
    });
    
    if (!updated) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Item was updated by another user. Please refresh and try again.',
      });
    }
  `,
  
  // Batch operations with transaction
  batchTransaction: `
    await prisma.$transaction(async (tx) => {
      // Delete all existing items
      await tx.item.deleteMany({
        where: { userId: ctx.session.user.id },
      });
      
      // Insert new items
      await tx.item.createMany({
        data: items.map((item) => ({
          ...item,
          userId: ctx.session.user.id,
        })),
      });
    });
  `,
};

// lib/snippets/error-handling.ts
export const errorSnippets = {
  // API error with retry
  apiErrorHandling: `
    let retries = 3;
    let lastError;
    
    while (retries > 0) {
      try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
        }
        
        return await response.json();
      } catch (error) {
        lastError = error;
        retries--;
        
        if (retries === 0) break;
        
        // Exponential backoff: 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, 3 - retries) * 1000));
      }
    }
    
    throw new Error(\`Failed after 3 retries: \${lastError.message}\`);
  `,
  
  // Graceful degradation
  gracefulDegradation: `
    try {
      // Try primary service
      return await primaryService.execute();
    } catch (error) {
      logger.warn('Primary service failed, falling back', { error });
      
      try {
        // Fallback to secondary service
        return await secondaryService.execute();
      } catch (fallbackError) {
        logger.error('Both services failed', { error, fallbackError });
        
        // Return cached data or default
        return await getCachedData() ?? DEFAULT_RESPONSE;
      }
    }
  `,
};
```

**CLI to Insert Snippets:**

```bash
# scripts/snippet.sh
#!/bin/bash

CATEGORY=$1
NAME=$2

if [ -z "$CATEGORY" ] || [ -z "$NAME" ]; then
  echo "Usage: ./scripts/snippet.sh <category> <name>"
  echo "Available categories:"
  echo "  - database"
  echo "  - error-handling"
  echo "  - security"
  echo "  - performance"
  exit 1
fi

# Load snippet
node -e "
const snippets = require('./lib/snippets/${CATEGORY}').snippets;
console.log(snippets['${NAME}']);
" | pbcopy

echo "✅ Snippet copied to clipboard: ${CATEGORY}/${NAME}"
```

**Impact:** Consistent patterns, faster development

---

### **8. Cursor IDE Configuration**

**Why:** AI-native IDE with codebase awareness

**Setup:**

```json
// .cursorrules
{
  "rules": [
    "Always use TypeScript with strict mode",
    "Use Zod for runtime validation",
    "Use tRPC for API routes (not Next.js API routes)",
    "Enforce RLS in all database queries: userId === ctx.session.user.id",
    "Use Prisma for database access (never raw SQL)",
    "Use shadcn/ui components for UI (not custom components)",
    "Always handle errors with Cause → Fix → Retry pattern",
    "Never use 'any' type - use 'unknown' and type guards",
    "Always add JSDoc comments for exported functions",
    "Use const assertions for literal types",
    "Prefer server components over client components in Next.js",
    "Use Suspense boundaries for async components",
    "Always validate user input with Zod before processing"
  ],
  "codebaseContext": {
    "architecture": "Next.js 15 with tRPC, Prisma, Supabase Auth",
    "security": "SOC 2 Type II compliance required - security-first approach",
    "patterns": {
      "auth": "src/server/auth.ts - use protectedProcedure for authenticated routes",
      "database": "prisma/schema.prisma - all queries must enforce RLS",
      "api": "src/server/routers/* - tRPC routers with Zod validation",
      "ui": "src/components/* - React Server Components by default"
    }
  },
  "avoidPatterns": [
    "Don't use 'as any' type assertions",
    "Don't bypass Zod validation",
    "Don't use string concatenation for SQL queries",
    "Don't store secrets in code or .env committed to git",
    "Don't use client-side state for sensitive data"
  ]
}
```

**Custom AI Commands:**

```json
// .cursor/commands.json
{
  "commands": [
    {
      "name": "Add RLS to Query",
      "prompt": "Add Row-Level Security (RLS) enforcement to this Prisma query. The query should only return data where userId === ctx.session.user.id",
      "keybinding": "cmd+shift+r"
    },
    {
      "name": "Generate tRPC Route",
      "prompt": "Generate a complete tRPC route with: 1) Zod input validation, 2) RLS enforcement, 3) Error handling with Cause → Fix → Retry, 4) TypeScript types, 5) JSDoc comments",
      "keybinding": "cmd+shift+t"
    },
    {
      "name": "Security Audit Selection",
      "prompt": "Audit this code for security vulnerabilities: SQL injection, XSS, CSRF, authentication bypass, authorization issues, secrets in code, missing input validation. Provide specific fixes.",
      "keybinding": "cmd+shift+s"
    }
  ]
}
```

**Impact:** AI that understands your codebase, 40% fewer bugs

---

### **9. Local LLM Setup (Ollama)**

**Why:** Test prompts locally without API costs

**Setup:**

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull models
ollama pull codellama:13b
ollama pull mistral:latest
ollama pull llama2:13b

# Start server
ollama serve
```

**Integration:**

```typescript
// lib/local-llm.ts
import ollama from "ollama";

export async function testPromptLocally(prompt: string, model: string = "codellama") {
  const response = await ollama.chat({
    model,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  
  return {
    content: response.message.content,
    tokensUsed: 0, // Free!
    model: `local:${model}`,
  };
}

// Use in development
if (process.env.NODE_ENV === "development" && process.env.USE_LOCAL_LLM === "true") {
  const response = await testPromptLocally("Generate a login component");
} else {
  const response = await anthropic.messages.create(/* ... */);
}
```

**Impact:** Free prompt testing, faster iteration

---

### **10. AI Code Review Bot (PR Automation)**

**Why:** Automated code reviews for common issues

```typescript
// .github/workflows/ai-code-review.yml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Get changed files
        id: files
        run: |
          echo "files=$(git diff --name-only ${{ github.event.pull_request.base.sha }} ${{ github.sha }} | jq -R -s -c 'split("\n")[:-1]')" >> $GITHUB_OUTPUT
      
      - name: AI Review
        uses: ./actions/ai-review
        with:
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          files: ${{ steps.files.outputs.files }}
          review-prompt: |
            Review this code for:
            1. Security vulnerabilities (SQL injection, XSS, auth bypass)
            2. Missing RLS enforcement (userId !== ctx.session.user.id)
            3. Missing input validation (Zod schemas)
            4. Missing error handling
            5. Performance issues (N+1 queries, missing indexes)
            6. TypeScript type safety ('any' usage)
            
            For each issue found, provide:
            - Severity (critical/high/medium/low)
            - Location (file:line)
            - Description
            - Fix suggestion
```

```typescript
// actions/ai-review/index.ts
import { Octokit } from "@octokit/rest";
import OpenAI from "openai";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function reviewPR() {
  const { data: files } = await octokit.pulls.listFiles({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.issue.number,
  });
  
  const reviews = await Promise.all(
    files.map(async (file) => {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: process.env.REVIEW_PROMPT,
          },
          {
            role: "user",
            content: `File: ${file.filename}\n\n${file.patch}`,
          },
        ],
      });
      
      return {
        file: file.filename,
        review: response.choices[0].message.content,
      };
    })
  );
  
  // Post review comments
  for (const review of reviews) {
    await octokit.pulls.createReview({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.issue.number,
      body: review.review,
      event: "COMMENT",
    });
  }
}
```

**Impact:** Catch bugs before human review, faster PR cycles

---

## **Advanced Debugging & Profiling**

### **11. CPU Profiling (Clinic.js)**

**Why:** Find performance bottlenecks in Node.js

```bash
# Install
npm install -g clinic

# Profile your app
clinic doctor -- node dist/server.js

# Or profile specific endpoints
clinic flame -- node dist/server.js

# Opens flamegraph in browser
```

**Integration:**

```typescript
// Enable profiling in development
if (process.env.ENABLE_PROFILING === "true") {
  const v8Profiler = require("v8-profiler-next");
  
  // Start profiling
  v8Profiler.startProfiling("profile", true);
  
  // Stop after 60 seconds
  setTimeout(() => {
    const profile = v8Profiler.stopProfiling("profile");
    
    profile.export((error, result) => {
      fs.writeFileSync("profile.cpuprofile", result);
      profile.delete();
      console.log("✅ Profile saved to profile.cpuprofile");
    });
  }, 60000);
}
```

**Impact:** Identify slow code paths, optimize performance

---

### **12. Memory Leak Detection**

**Why:** Catch memory leaks before production

```typescript
// lib/memory-monitor.ts
import v8 from "v8";
import { writeHeapSnapshot } from "v8";

export function startMemoryMonitoring() {
  const heapStats: any[] = [];
  
  setInterval(() => {
    const stats = v8.getHeapStatistics();
    
    heapStats.push({
      timestamp: Date.now(),
      heapUsed: stats.used_heap_size,
      heapTotal: stats.total_heap_size,
      external: stats.external_memory,
    });
    
    // Keep last 100 samples
    if (heapStats.length > 100) heapStats.shift();
    
    // Check for memory leak (heap grows consistently)
    if (heapStats.length === 100) {
      const firstHalf = heapStats.slice(0, 50).reduce((sum, s) => sum + s.heapUsed, 0) / 50;
      const secondHalf = heapStats.slice(50).reduce((sum, s) => sum + s.heapUsed, 0) / 50;
      
      const growth = ((secondHalf - firstHalf) / firstHalf) * 100;
      
      if (growth > 20) {
        // 20% growth = potential leak
        console.error(`⚠️ Potential memory leak detected: ${growth.toFixed(2)}% growth`);
        
        // Take heap snapshot
        writeHeapSnapshot(`./heap-${Date.now()}.heapsnapshot`);
        
        // Alert
        sendSlackAlert({
          channel: "#engineering",
          message: `Memory leak detected in production! Heap grew ${growth.toFixed(2)}% over last 100 samples`,
        });
      }
    }
  }, 10000); // Check every 10 seconds
}

// Start in production
if (process.env.NODE_ENV === "production") {
  startMemoryMonitoring();
}
```

**Analyze Heap Snapshots:**

```bash
# Open in Chrome DevTools
# 1. Open Chrome DevTools
# 2. Go to Memory tab
# 3. Load heap snapshot file
# 4. Look for retained objects, detached DOM nodes, etc.
```

**Impact:** Prevent OOM crashes, stable production

---

### **13. Distributed Debugging (Rookout)**

**Why:** Debug production without redeploying

```typescript
// Install Rookout
import rookout from "rookout";

rookout.start({
  token: process.env.ROOKOUT_TOKEN,
  labels: {
    env: process.env.NODE_ENV,
    service: "api-server",
  },
});

// Now you can set breakpoints in production via Rookout UI
// without redeploying or adding console.logs
```

**Features:**
- Set breakpoints in production
- Inspect variables at runtime
- No performance impact (uses bytecode instrumentation)
- Works across distributed systems

**Impact:** Debug production issues without redeploying

---

## **Team Collaboration & Knowledge**

### **14. Internal Wiki (Outline/BookStack)**

**Why:** Centralized knowledge base

```yaml
# docker-compose.yml
services:
  outline:
    image: outlinewiki/outline:latest
    ports:
      - "3000:3000"
    environment:
      - SECRET_KEY=${SECRET_KEY}
      - DATABASE_URL=postgres://postgres:password@postgres:5432/outline
      - REDIS_URL=redis://redis:6379
      - URL=http://localhost:3000
      - SLACK_CLIENT_ID=${SLACK_CLIENT_ID}
      - SLACK_CLIENT_SECRET=${SLACK_CLIENT_SECRET}
    depends_on:
      - postgres
      - redis
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=outline
    volumes:
      - outline-data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine

volumes:
  outline-data:
```

**Structure:**

```
Internal Wiki
├── 📚 Engineering
│   ├── Architecture Overview
│   ├── API Documentation
│   ├── Database Schema
│   ├── Deployment Process
│   └── Incident Runbooks
├── 🚀 Product
│   ├── Product Roadmap
│   ├── Feature Specs
│   └── User Research
├── 🔐 Security
│   ├── Security Policies
│   ├── Incident Response
│   └── Compliance Docs
└── 📖 Onboarding
    ├── New Hire Checklist
    ├── Dev Environment Setup
    └── Code Review Guidelines
```

**Impact:** Faster onboarding, reduced knowledge silos

---

### **15. Async Standups (Geekbot/Standup.ly)**

**Why:** Remote-friendly daily updates

```yaml
# Geekbot configuration (Slack integration)
questions:
  - "What did you accomplish yesterday?"
  - "What are you working on today?"
  - "Any blockers or challenges?"
  - "LLM cost this week: [auto-filled from PostHog]"
  - "Agent success rate: [auto-filled from Sentry]"

schedule:
  timezone: "America/Chicago"
  time: "09:00"
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

participants:
  - "@engineering"

reporting:
  channel: "#engineering-standups"
  format: "thread"
```

**Impact:** No meeting overhead, async-friendly

---

### **16. Knowledge Graph (Obsidian + Git)**

**Why:** Connected technical documentation

```
docs/
├── .obsidian/
│   └── graph.json
├── architecture/
│   ├── database-design.md
│   ├── api-design.md
│   └── security-model.md
├── features/
│   ├── agent-execution.md
│   ├── cost-tracking.md
│   └── user-quotas.md
└── decisions/
    ├── adr-001-use-trpc.md
    ├── adr-002-use-supabase.md
    └── adr-003-use-anthropic.md
```

**Cross-References:**

```markdown
# Agent Execution

The agent execution system uses [[api-design#tRPC Routes]] to handle requests.

Security is enforced via [[security-model#Row-Level Security]].

Cost tracking is implemented in [[cost-tracking]].

**Related Decisions:**
- [[adr-003-use-anthropic]] - Why we chose Claude over GPT
- [[adr-005-agent-retry-logic]] - How we handle failures
```

**Impact:** Discoverability, connected knowledge

---

## **Database & Data Management**

### **17. Database Query Analyzer**

**Why:** Find slow queries automatically

```typescript
// lib/query-analyzer.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: [
    {
      level: "query",
      emit: "event",
    },
  ],
});

const queryStats = new Map<string, {
  count: number;
  totalDuration: number;
  slowest: number;
}>();

prisma.$on("query", (e) => {
  const stats = queryStats.get(e.query) || {
    count: 0,
    totalDuration: 0,
    slowest: 0,
  };
  
  stats.count++;
  stats.totalDuration += e.duration;
  stats.slowest = Math.max(stats.slowest, e.duration);
  
  queryStats.set(e.query, stats);
  
  // Alert on slow queries (>500ms)
  if (e.duration > 500) {
    console.warn(`🐌 Slow query (${e.duration}ms): ${e.query.substring(0, 100)}...`);
    
    Sentry.captureMessage("Slow database query", {
      level: "warning",
      extra: {
        query: e.query,
        duration: e.duration,
        params: e.params,
      },
    });
  }
});

// Report query stats every 5 minutes
setInterval(() => {
  const sorted = Array.from(queryStats.entries())
    .sort((a, b) => b[1].totalDuration - a[1].totalDuration)
    .slice(0, 10);
  
  console.log("Top 10 slowest queries:");
  for (const [query, stats] of sorted) {
    const avg = stats.totalDuration / stats.count;
    console.log(`  ${query.substring(0, 50)}... - ${stats.count} calls, ${avg.toFixed(2)}ms avg, ${stats.slowest}ms slowest`);
  }
}, 300000);
```

**Impact:** Identify optimization opportunities

---

### **18. Database Diff Tool (Prisma Migrate Diff)**

**Why:** See schema changes before applying

```bash
# Compare local schema to production
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-url ${DATABASE_URL} \
  --script

# Output: SQL that would be executed
# Review before running migrations
```

**Impact:** Prevent accidental schema changes

---

### **19. Data Quality Monitoring**

**Why:** Catch data corruption early

```typescript
// lib/data-quality.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface QualityCheck {
  name: string;
  check: () => Promise<boolean>;
  severity: "critical" | "warning";
}

const checks: QualityCheck[] = [
  {
    name: "No orphaned projects",
    check: async () => {
      const orphaned = await prisma.project.count({
        where: {
          user: null,
        },
      });
      return orphaned === 0;
    },
    severity: "critical",
  },
  {
    name: "All users have valid email",
    check: async () => {
      const invalid = await prisma.user.count({
        where: {
          OR: [
            { email: null },
            { email: { contains: "@", mode: "insensitive", not: true } },
          ],
        },
      });
      return invalid === 0;
    },
    severity: "critical",
  },
  {
    name: "Agent costs match token usage",
    check: async () => {
      const logs = await prisma.agentLog.findMany({
        select: {
          tokensUsed: true,
          costUsd: true,
        },
      });
      
      for (const log of logs) {
        const expectedCost = log.tokensUsed * 0.00003; // $0.03 per 1K tokens
        const diff = Math.abs(log.costUsd - expectedCost);
        
        if (diff > 0.001) {
          // More than $0.001 difference
          return false;
        }
      }
      
      return true;
    },
    severity: "warning",
  },
];

export async function runDataQualityChecks() {
  console.log("Running data quality checks...");
  
  const results = await Promise.all(
    checks.map(async (check) => {
      const passed = await check.check();
      return { ...check, passed };
    })
  );
  
  const failed = results.filter((r) => !r.passed);
  
  if (failed.length > 0) {
    console.error(`❌ ${failed.length} data quality check(s) failed:`);
    
    for (const f of failed) {
      console.error(`  - ${f.name} (${f.severity})`);
      
      if (f.severity === "critical") {
        Sentry.captureMessage(`Data quality check failed: ${f.name}`, {
          level: "error",
        });
      }
    }
  } else {
    console.log("✅ All data quality checks passed");
  }
}

// Run daily via cron
if (process.env.RUN_DATA_CHECKS === "true") {
  setInterval(runDataQualityChecks, 86400000); // Daily
}
```

**Impact:** Catch data issues before users do

---

## **Mobile & Multi-Platform**

### **20. React Native Setup (Expo)**

**Why:** Build mobile apps from same codebase

```bash
# Install Expo
npx create-expo-app mobile -t expo-template-blank-typescript

# Share code with web
mkdir packages/
mv src/ packages/web/
mv mobile/ packages/mobile/

# Shared code
mkdir packages/shared/
```

**Monorepo Structure:**

```
packages/
├── web/                  # Next.js web app
├── mobile/               # React Native mobile app
└── shared/               # Shared code
    ├── api/              # tRPC client
    ├── components/       # Shared components
    ├── utils/            # Shared utilities
    └── types/            # Shared TypeScript types
```

**Impact:** One codebase, multiple platforms

---

### **21. Desktop App (Tauri/Electron)**

**Why:** Native desktop experience

```bash
# Install Tauri
npm install -g @tauri-apps/cli

# Initialize Tauri in existing Next.js project
npm install --save-dev @tauri-apps/api @tauri-apps/cli

# Create desktop app
npm run tauri init
```

**Features:**
- Native system integration
- Smaller bundle size than Electron (Tauri uses system WebView)
- Secure IPC between frontend and backend

**Impact:** Professional desktop app experience

---

## **Compliance & Governance**

### **22. GDPR Compliance Tools**

**Why:** Automate data subject requests

```typescript
// lib/gdpr.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function exportUserData(userId: string): Promise<any> {
  // Export all user data (GDPR Article 20)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      projects: true,
      agentLogs: true,
      apiKeys: true,
    },
  });
  
  if (!user) {
    throw new Error("User not found");
  }
  
  // Sanitize sensitive fields
  return {
    personalData: {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    projects: user.projects,
    usage: user.agentLogs.map((log) => ({
      agentId: log.agentId,
      tokensUsed: log.tokensUsed,
      costUsd: log.costUsd,
      createdAt: log.createdAt,
    })),
    // Exclude: passwords, API keys (security)
  };
}

export async function deleteUserData(userId: string): Promise<void> {
  // Delete user data (GDPR Article 17 - Right to be forgotten)
  await prisma.$transaction([
    // Delete all related data first
    prisma.agentLog.deleteMany({ where: { project: { userId } } }),
    prisma.project.deleteMany({ where: { userId } }),
    prisma.apiKey.deleteMany({ where: { userId } }),
    
    // Then delete user
    prisma.user.delete({ where: { id: userId } }),
  ]);
  
  // Log deletion for audit trail
  await prisma.auditLog.create({
    data: {
      action: "USER_DELETED",
      userId,
      timestamp: new Date(),
      reason: "GDPR data deletion request",
    },
  });
}
```

**API Routes:**

```typescript
// src/app/api/gdpr/export/route.ts
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  
  const data = await exportUserData(session.user.id);
  
  return Response.json(data, {
    headers: {
      "Content-Disposition": `attachment; filename="user-data-${session.user.id}.json"`,
    },
  });
}

// src/app/api/gdpr/delete/route.ts
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  
  // Require email confirmation
  const { confirmEmail } = await req.json();
  if (confirmEmail !== session.user.email) {
    return Response.json({ error: "Email confirmation required" }, { status: 400 });
  }
  
  await deleteUserData(session.user.id);
  
  // Send confirmation email
  await sendEmail({
    to: session.user.email,
    subject: "Your data has been deleted",
    body: "Your account and all associated data have been permanently deleted.",
  });
  
  return Response.json({ success: true });
}
```

**Impact:** GDPR compliance, automated data requests

---

### **23. Audit Log Viewer**

**Why:** Investigate security incidents

```typescript
// components/AuditLogViewer.tsx
export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filters, setFilters] = useState({
    userId: "",
    action: "",
    startDate: "",
    endDate: "",
  });
  
  useEffect(() => {
    async function fetchLogs() {
      const response = await fetch("/api/audit-logs?" + new URLSearchParams(filters));
      const data = await response.json();
      setLogs(data.logs);
    }
    
    fetchLogs();
  }, [filters]);
  
  return (
    <div>
      <h1>Audit Logs</h1>
      
      <div className="filters">
        <input
          placeholder="User ID"
          value={filters.userId}
          onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
        />
        
        <select
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
        >
          <option value="">All Actions</option>
          <option value="LOGIN">Login</option>
          <option value="LOGOUT">Logout</option>
          <option value="USER_CREATED">User Created</option>
          <option value="USER_DELETED">User Deleted</option>
          <option value="PERMISSION_CHANGED">Permission Changed</option>
        </select>
        
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        />
        
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>IP Address</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.userId}</td>
              <td>{log.action}</td>
              <td>{log.ipAddress}</td>
              <td>{JSON.stringify(log.metadata)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**Impact:** Security incident investigation

---

## **Developer Onboarding Automation**

### **24. Automated Onboarding Checklist**

**Why:** Consistent new hire experience

```typescript
// lib/onboarding.ts
interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  dependencies: string[];
  automate?: () => Promise<void>;
}

const tasks: OnboardingTask[] = [
  {
    id: "github-access",
    title: "Get GitHub Access",
    description: "Request access to github.com/yourorg",
    estimatedTime: "5 minutes",
    dependencies: [],
    automate: async () => {
      // Automatically invite to GitHub org
      await octokit.orgs.createInvitation({
        org: "yourorg",
        email: newHire.email,
        role: "member",
      });
    },
  },
  {
    id: "clone-repo",
    title: "Clone Repository",
    description: "git clone git@github.com:yourorg/repo.git",
    estimatedTime: "2 minutes",
    dependencies: ["github-access"],
  },
  {
    id: "install-deps",
    title: "Install Dependencies",
    description: "pnpm install",
    estimatedTime: "5 minutes",
    dependencies: ["clone-repo"],
    automate: async () => {
      // Could auto-run via SSH or dev container
    },
  },
  {
    id: "setup-env",
    title: "Setup Environment Variables",
    description: "Copy .env.example to .env and fill in values",
    estimatedTime: "10 minutes",
    dependencies: ["clone-repo"],
    automate: async () => {
      // Auto-generate dev API keys
      const apiKey = await generateDevApiKey(newHire.email);
      
      // Send via email
      await sendEmail({
        to: newHire.email,
        subject: "Your dev environment API keys",
        body: `Here are your development API keys:\n\nCLAUDE_API_KEY=${apiKey}\n...`,
      });
    },
  },
  {
    id: "database-setup",
    title: "Setup Local Database",
    description: "pnpm db:reset",
    estimatedTime: "2 minutes",
    dependencies: ["install-deps", "setup-env"],
  },
  {
    id: "run-tests",
    title: "Run Tests",
    description: "pnpm test",
    estimatedTime: "5 minutes",
    dependencies: ["database-setup"],
  },
  {
    id: "first-pr",
    title: "Submit First PR",
    description: "Fix a 'good-first-issue' and submit PR",
    estimatedTime: "2 hours",
    dependencies: ["run-tests"],
  },
];

export async function createOnboardingTicket(newHire: { email: string; name: string }) {
  // Create Linear/Jira ticket with checklist
  const ticket = await linear.createIssue({
    title: `Onboarding: ${newHire.name}`,
    description: tasks
      .map(
        (t) =>
          `- [ ] ${t.title} (${t.estimatedTime})\n  ${t.description}\n  Dependencies: ${t.dependencies.join(", ") || "None"}`
      )
      .join("\n\n"),
    labels: ["onboarding"],
    assignee: newHire.email,
  });
  
  // Auto-run automatable tasks
  for (const task of tasks) {
    if (task.automate && task.dependencies.length === 0) {
      await task.automate();
    }
  }
  
  return ticket;
}
```

**Impact:** 50% faster onboarding (2 days → 1 day)

---

### **25. Interactive Onboarding Tutorial**

**Why:** Learn by doing, not reading

```typescript
// components/OnboardingTutorial.tsx
import { useState } from "react";

const steps = [
  {
    target: "#create-project-button",
    title: "Create Your First Project",
    content: "Click this button to create a new project. This will hold all your AI agents.",
    action: "click",
  },
  {
    target: "#project-name-input",
    title: "Name Your Project",
    content: "Give your project a descriptive name.",
    action: "type",
    expectedValue: /\w+/,
  },
  {
    target: "#run-agent-button",
    title: "Run Your First Agent",
    content: "Click here to run the code generation agent.",
    action: "click",
  },
  {
    target: "#agent-output",
    title: "Review Agent Output",
    content: "The agent has generated code! Review it and click 'Accept' to create a PR.",
    action: "wait",
  },
];

export function OnboardingTutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  const step = steps[currentStep];
  
  useEffect(() => {
    // Highlight target element
    const target = document.querySelector(step.target);
    target?.classList.add("tutorial-highlight");
    
    return () => target?.classList.remove("tutorial-highlight");
  }, [currentStep]);
  
  function handleNext() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
      
      // Track completion
      posthog.capture("onboarding_completed");
    }
  }
  
  if (completed) {
    return (
      <div className="tutorial-complete">
        <h2>🎉 Tutorial Complete!</h2>
        <p>You're ready to build with AI agents.</p>
      </div>
    );
  }
  
  return (
    <div className="tutorial-tooltip" style={getTooltipPosition(step.target)}>
      <h3>{step.title}</h3>
      <p>{step.content}</p>
      <div className="tutorial-actions">
        <button onClick={handleNext}>
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </button>
        <span>
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>
    </div>
  );
}
```

**Impact:** 80% onboarding completion rate (vs 40% with docs)

---

## **Cost Optimization Tools**

### **26. Cloud Cost Dashboard (Infracost)**

**Why:** Predict infrastructure costs before deploying

```bash
# Install
brew install infracost

# Generate cost estimate
infracost breakdown --path .

# Output:
# Name                         Monthly Qty  Unit         Monthly Cost
# ├─ Vercel Pro                1            instance     $20.00
# ├─ Supabase Pro              1            instance     $25.00
# ├─ Redis (Upstash)           1            instance     $10.00
# ├─ Sentry Team               1            instance     $29.00
# ├─ Claude API (estimate)     100K         tokens       $300.00
# TOTAL                                                  $384.00
```

**CI Integration:**

```yaml
# .github/workflows/cost-estimate.yml
name: Cost Estimate

on:
  pull_request:

jobs:
  infracost:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Infracost
        uses: infracost/actions/setup@v2
        with:
          api-key: ${{ secrets.INFRACOST_API_KEY }}
      
      - name: Generate cost estimate
        run: |
          infracost breakdown --path . --format json > /tmp/infracost.json
      
      - name: Post comment
        uses: infracost/actions/comment@v1
        with:
          path: /tmp/infracost.json
          behavior: update
```

**Impact:** No surprise cloud bills

---

## **Emergency & Incident Response**

### **27. Incident Response Runbooks**

**Why:** Handle incidents faster with checklists

```markdown
# Incident Runbook: API Outage

## Severity: P0 (Critical)

## Symptoms
- API returning 503 errors
- Health check endpoint failing
- Error rate >50%

## Immediate Actions (5 minutes)

1. **Acknowledge in PagerDuty**
   - Claim incident
   - Post in #incidents Slack channel

2. **Check System Status**
   ```bash
   # Check Vercel deployment status
   vercel --prod --scope yourorg

   # Check Supabase status
   curl https://status.supabase.com/api/v2/status.json
   
   # Check Redis
   redis-cli -u $REDIS_URL ping
   ```

3. **Check Recent Deployments**
   ```bash
   # Get last 5 deployments
   vercel ls --scope yourorg | head -5
   
   # If recent deploy (< 15 min ago), rollback
   vercel rollback [deployment-url]
   ```

4. **Check Error Logs**
   - Open Sentry: https://sentry.io/yourorg/api-server/
   - Filter: Last 15 minutes
   - Look for spike in specific error

## Investigation (15 minutes)

5. **Check Database**
   ```sql
   -- Check active connections
   SELECT count(*) FROM pg_stat_activity;
   
   -- Check slow queries
   SELECT * FROM pg_stat_statements
   ORDER BY mean_exec_time DESC
   LIMIT 10;
   ```

6. **Check Redis**
   ```bash
   redis-cli -u $REDIS_URL INFO
   # Look for: used_memory_peak, connected_clients
   ```

7. **Check LLM API Status**
   - Anthropic: https://status.anthropic.com
   - OpenAI: https://status.openai.com

## Resolution

8. **Common Fixes**
   - Database connection pool exhausted → Scale up pool in Supabase
   - Redis out of memory → Flush cache or upgrade plan
   - LLM API rate limit → Reduce concurrency or upgrade tier
   - Code bug → Rollback deployment

9. **Post-Incident**
   - Write incident report (template below)
   - Schedule postmortem meeting (24-48 hours)
   - Update runbook with lessons learned

## Incident Report Template

**Date:** YYYY-MM-DD  
**Duration:** X hours  
**Impact:** X users affected  
**Root Cause:** [One sentence]  
**Timeline:**
- HH:MM - Incident started
- HH:MM - Detected
- HH:MM - Team paged
- HH:MM - Root cause identified
- HH:MM - Fix deployed
- HH:MM - Incident resolved

**Action Items:**
1. [Action 1] - Owner: @person - Due: YYYY-MM-DD
2. [Action 2] - Owner: @person - Due: YYYY-MM-DD
```

**Impact:** 50% faster incident resolution

---

## **Implementation Priority**

| Priority | Tool | Effort | Impact | Timeline |
|---|---|---|---|---|
| **P0** | Prompt playground | 2 days | Critical | This week |
| **P0** | Token usage dashboard | 3 days | Critical | This week |
| **P0** | LLM response caching | 2 days | High | This week |
| **P1** | Model A/B testing | 4 days | High | This month |
| **P1** | Code snippet library | 3 days | High | This month |
| **P1** | Local LLM setup | 1 day | Medium | This month |
| **P2** | AI code review bot | 5 days | Medium | Next month |
| **P2** | Distributed tracing | 5 days | Medium | Next month |
| **P3** | Mobile app | 2 weeks | Low | Q2 2026 |

---

## **Cost Analysis**

### **Free Tools**

| Tool | Cost | Value |
|---|---|---|
| Ollama (local LLM) | $0 | Test prompts free |
| PromptFoo | $0 | Systematic prompt testing |
| Cursor (basic) | $0 | AI code completion |

### **Paid Tools (ROI-Positive)**

| Tool | Cost/Month | ROI |
|---|---|---|
| **LLM caching** | $0 (saves $1,200/mo) | Infinite |
| **GitHub Copilot** | $20/user | 30% faster coding |
| **Cursor Pro** | $20/user | 40% fewer bugs |
| **PagerDuty** | $21/user | Prevent $10K outages |
| **Total** | **~$60/user** | **20x ROI** |

---

## **Quick Wins (This Week)**

```bash
# Day 1: Prompt playground
npm install -g promptfoo
promptfoo init

# Day 2: Token tracking
# Implement token-tracker.ts (see example above)

# Day 3: LLM caching
# Implement llm-cache.ts (see example above)

# Day 4: Local LLM
curl -fsSL https://ollama.com/install.sh | sh
ollama pull codellama

# Day 5: Code snippets
mkdir -p lib/snippets
# Add snippet files (see examples above)
```

**Result:** 40% cost reduction + 30% velocity increase in one week

---

## **Conclusion**

These 25 advanced tools complement the core 30 enhancements:

**AI-Specific (Must-Have):**
- Prompt playground, token tracking, caching
- Model A/B testing, prompt version control

**Productivity (10x Gains):**
- GitHub Copilot, Cursor, code snippets
- Local LLM testing, AI code reviews

**Reliability:**
- CPU profiling, memory leak detection
- Distributed debugging, incident runbooks

**Priority:** P0 items this week (LLM tooling), P1 this month (productivity), P2/P3 as needed.
