# AI Agents Workflow Skill - Example Use Cases

## Use Case 1: GitHub PR Review Bot

### User Request
"Build me an MCP server that automatically reviews pull requests on GitHub when they're opened."

### What the Skill Provides

**Step 1: Architecture Selection**
- Skill identifies this as Pattern A (MCP Server)
- Triggers `scripts/init_mcp_server.py github-pr-reviewer`

**Step 2: Reference Loading**
- Loads `references/mcp-servers.md` for MCP patterns
- Loads `references/tool-integrations.md` § GitHub for API examples
- Loads `references/security-checklist.md` for auth requirements

**Step 3: Implementation**
Claude generates:

```python
#!/usr/bin/env python3
from fastmcp import FastMCP
import os
import requests

mcp = FastMCP("github-pr-reviewer")

@mcp.tool()
def review_pull_request(repo: str, pr_number: int) -> dict:
    """Review a GitHub pull request.
    
    Args:
        repo: Repository in format 'owner/repo'
        pr_number: Pull request number
    """
    # Input validation
    if '/' not in repo:
        raise ValueError("Repo must be in 'owner/repo' format")
    if pr_number < 1:
        raise ValueError("PR number must be positive")
    
    # Get GitHub token
    token = os.getenv("GITHUB_TOKEN")
    if not token:
        raise EnvironmentError(
            "❌ Error: GitHub authentication failed\\n"
            "📋 Cause: GITHUB_TOKEN not set\\n"
            "🔧 Fix: Generate token at github.com/settings/tokens\\n"
            "🔄 Retry: Set GITHUB_TOKEN in .env and restart"
        )
    
    # Fetch PR diff
    url = f"https://api.github.com/repos/{repo}/pulls/{pr_number}"
    headers = {"Authorization": f"token {token}"}
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    pr_data = response.json()
    diff_url = pr_data["diff_url"]
    diff = requests.get(diff_url).text
    
    # Return for Claude to analyze
    return {
        "title": pr_data["title"],
        "diff": diff,
        "author": pr_data["user"]["login"],
        "url": pr_data["html_url"]
    }

if __name__ == "__main__":
    mcp.run()
```

**Step 4: Security & Deployment**
Claude also provides:
- `.env.example` with `GITHUB_TOKEN=ghp_...`
- Installation instructions for Claude config
- Validation check: `python scripts/validate_workflow.py github-pr-reviewer/`

---

## Use Case 2: Multi-Agent Content Pipeline

### User Request
"I need a workflow where one AI researches a topic, another writes an article, and a third edits it."

### What the Skill Provides

**Step 1: Architecture Selection**
- Identifies Pattern C (CrewAI Multi-Agent)
- Triggers `scripts/init_crewai_workflow.py content-pipeline`

**Step 2: Reference Loading**
- Loads `references/agent-frameworks.md` § CrewAI
- Loads `references/multi-llm-patterns.md` for optimal model selection

**Step 3: Implementation**

```python
from crewai import Agent, Task, Crew
import os

# Researcher: Uses Claude for deep analysis
researcher = Agent(
    role="Research Analyst",
    goal="Find accurate, comprehensive information on {topic}",
    backstory="Expert researcher with access to web search and databases",
    llm="claude-sonnet-4-20250514",
    verbose=True
)

# Writer: Uses GPT-4o for fast, creative writing
writer = Agent(
    role="Content Writer",
    goal="Write engaging, SEO-optimized articles",
    backstory="Professional content writer",
    llm="gpt-4o",
    verbose=True
)

# Editor: Uses Claude for quality control
editor = Agent(
    role="Senior Editor",
    goal="Polish content to publication quality",
    backstory="Former magazine editor, stickler for grammar",
    llm="claude-sonnet-4-20250514",
    verbose=True
)

# Task 1: Research
research_task = Task(
    description="Research comprehensive information about {topic}. Focus on: latest trends, key statistics, expert opinions, and real-world examples.",
    agent=researcher,
    expected_output="Detailed research report with sources"
)

# Task 2: Write
writing_task = Task(
    description="Write a 1000-word article about {topic} using the research provided. Make it engaging with clear structure, compelling intro, and strong conclusion.",
    agent=writer,
    context=[research_task],
    expected_output="Article draft"
)

# Task 3: Edit
editing_task = Task(
    description="Edit the article for clarity, grammar, flow, and SEO. Add section headers and ensure consistent voice.",
    agent=editor,
    context=[writing_task],
    expected_output="Publication-ready article"
)

# Create crew
crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[research_task, writing_task, editing_task],
    verbose=True
)

if __name__ == "__main__":
    result = crew.kickoff(inputs={"topic": "AI in Healthcare 2025"})
    print("\\n=== FINAL ARTICLE ===\\n")
    print(result)
```

**Cost Optimization Insight**
Claude explains:
- Researcher: Claude Sonnet (best for complex research)
- Writer: GPT-4o (fast, creative, cost-effective)
- Editor: Claude Sonnet (thorough quality control)
- Estimated cost per run: ~$0.15 (vs $0.30 if all Claude Sonnet)

---

## Use Case 3: Smart LLM Router API

### User Request
"Build an API that automatically routes requests to the cheapest/fastest model that can handle them."

### What the Skill Provides

**Step 1: Architecture Selection**
- Identifies Pattern D (Multi-LLM Orchestration)
- Suggests Vercel Edge Functions for deployment

**Step 2: Reference Loading**
- Loads `references/multi-llm-patterns.md` for routing strategies
- Loads `references/deployment.md` § Vercel

**Step 3: Implementation**

```typescript
// api/complete.ts (Vercel Edge Function)
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export const config = { runtime: 'edge' };

// Model pricing (per 1M tokens)
const PRICING = {
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4o': { input: 2.50, output: 10.00 },
  'claude-haiku-3-5-20241022': { input: 0.80, output: 4.00 },
  'claude-sonnet-4-20250514': { input: 3.00, output: 15.00 },
};

// Route based on task complexity
function routeTask(prompt: string, taskType?: string): string {
  const wordCount = prompt.split(' ').length;
  
  // Simple queries → cheapest model
  if (taskType === 'simple_qa' || wordCount < 50) {
    return 'gpt-4o-mini';
  }
  
  // Code tasks → Claude
  if (taskType === 'code' || /```|function|class|def /.test(prompt)) {
    return 'claude-sonnet-4-20250514';
  }
  
  // Long context → Claude
  if (wordCount > 10000) {
    return 'claude-sonnet-4-20250514';
  }
  
  // Default: fast balanced model
  return 'gpt-4o';
}

export default async function handler(req: NextRequest) {
  const { prompt, taskType, maxCost = 0.01 } = await req.json();
  
  const model = routeTask(prompt, taskType);
  
  // Call appropriate LLM
  let response: string;
  let inputTokens: number;
  let outputTokens: number;
  
  if (model.startsWith('claude')) {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });
    response = msg.content[0].text;
    inputTokens = msg.usage.input_tokens;
    outputTokens = msg.usage.output_tokens;
  } else {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
    });
    response = completion.choices[0].message.content!;
    inputTokens = completion.usage!.prompt_tokens;
    outputTokens = completion.usage!.completion_tokens;
  }
  
  // Calculate cost
  const pricing = PRICING[model];
  const cost = (
    (inputTokens / 1_000_000) * pricing.input +
    (outputTokens / 1_000_000) * pricing.output
  );
  
  return new Response(
    JSON.stringify({
      response,
      model_used: model,
      cost_usd: cost.toFixed(4),
      tokens: { input: inputTokens, output: outputTokens },
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
```

**Deployment**
Claude provides:
```bash
# Deploy to Vercel
vercel env add ANTHROPIC_API_KEY
vercel env add OPENAI_API_KEY
vercel --prod

# Test
curl https://your-app.vercel.app/api/complete \\
  -d '{"prompt": "Explain quantum computing", "taskType": "simple_qa"}'
```

---

## Use Case 4: Notion Knowledge Base RAG

### User Request
"Connect my Notion workspace to Claude so it can answer questions about our company docs."

### What the Skill Provides

**Step 1: Architecture Selection**
- Identifies Pattern B (LangChain Agent with RAG)
- Loads `references/agent-frameworks.md` § RAG Patterns
- Loads `references/tool-integrations.md` § Notion

**Step 2: Implementation**

```python
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain_anthropic import ChatAnthropic
from langchain.chains import RetrievalQA
import requests
import os

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
DATABASE_ID = os.getenv("NOTION_DATABASE_ID")

# Fetch Notion documents
def fetch_notion_docs():
    url = f"https://api.notion.com/v1/databases/{DATABASE_ID}/query"
    headers = {
        "Authorization": f"Bearer {NOTION_TOKEN}",
        "Notion-Version": "2022-06-28"
    }
    
    response = requests.post(url, headers=headers)
    pages = response.json()["results"]
    
    docs = []
    for page in pages:
        # Fetch page content
        page_id = page["id"]
        blocks_url = f"https://api.notion.com/v1/blocks/{page_id}/children"
        blocks = requests.get(blocks_url, headers=headers).json()
        
        # Extract text
        text = extract_text_from_blocks(blocks["results"])
        docs.append({
            "content": text,
            "metadata": {
                "title": page["properties"]["Name"]["title"][0]["plain_text"],
                "url": page["url"]
            }
        })
    
    return docs

# Create vector store
docs = fetch_notion_docs()
vectorstore = Chroma.from_documents(
    docs,
    OpenAIEmbeddings(),
    persist_directory="./notion_db"
)

# Create RAG chain
qa_chain = RetrievalQA.from_chain_type(
    llm=ChatAnthropic(model="claude-sonnet-4-20250514"),
    chain_type="stuff",
    retriever=vectorstore.as_retriever(search_kwargs={"k": 3})
)

# Query
answer = qa_chain.invoke("What are our company benefits?")
print(answer)
```

**Security Checks**
Claude runs `scripts/validate_workflow.py` and confirms:
- ✅ Notion token in environment variable
- ✅ Input validation on database queries
- ✅ No secrets in code
- ✅ Error handling with clear messages

---

## Key Takeaways

1. **Comprehensive Coverage**: Skill handles MCP, LangChain, CrewAI, multi-LLM, no-code
2. **Security First**: Every pattern includes validation, auth, rate limits
3. **Cost Optimization**: Smart model routing saves money
4. **Production Ready**: Includes testing, deployment, monitoring
5. **Extensible**: Reference files can be updated with new patterns

## Try It Yourself

Install the skill and ask:
- "Build an MCP server for [your use case]"
- "Create a multi-agent workflow for [your task]"
- "Set up LLM routing to optimize [your goal]"

Claude will use the skill automatically and guide you through the entire process!
