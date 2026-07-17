# Phase A: AI Implementation

**"AI is a multiplier, not a replacement. It multiplies whatever you give it — including bad decisions."**

---

## What This Phase Is

AI Implementation is where you integrate AI tools into your development workflow and, where appropriate, into the product itself. This phase covers two distinct concerns: using AI to build faster (developer tooling) and using AI as a product feature (user-facing capabilities).

Phase T gave you a tested, CI-protected codebase. Phase A layers AI on top of that foundation — both as an accelerant for your own development and as functionality your users interact with. The order matters: AI amplifies whatever exists. If your codebase is untested and your architecture is unclear, AI amplifies the mess. If your codebase is solid and well-structured, AI amplifies the velocity.

This phase is grounded in how I actually work. My daily toolkit includes Claude Code CLI, Claude Pro Max, GitHub Copilot, Gemini CLI, and 50+ MCP servers. I've learned through experience what AI does well, where it fails, and what guardrails prevent the failures from reaching production.

### Phase Gate

Do not proceed to Phase D (Deployment) until:

- **Production readiness score ≥ 50** (measured by audit CLI)
- **Error tracking configured and verified** (Sentry or equivalent — errors are captured in a real dashboard, not just console.log)
- **AI-generated code has been reviewed** by a human for correctness, security, and maintainability
- **Cost controls documented** if the product includes user-facing AI features (token budgets, rate limits, fallback behavior)

---

## Step 1: AI for Development (How You Build)

This is the higher-impact use of AI for most projects. Before adding AI as a product feature, use it to build the product faster and better.

### The Tools

| Tool | What It Does | When to Use |
|---|---|---|
| **Claude Code CLI** | Agentic coding from the terminal — reads your codebase, writes code, runs tests, iterates | Primary development tool. Use for feature implementation, refactoring, debugging, test writing. |
| **Claude (claude.ai)** | Conversational AI with file handling, web search, MCP integrations | Architecture decisions, code review, documentation, research, planning. |
| **GitHub Copilot** | Inline code completion in your editor | Line-by-line suggestions while typing. Good for boilerplate, repetitive patterns. |
| **Gemini CLI** | Google's CLI coding tool | Alternative perspective when Claude's approach isn't working. |
| **MCP Servers** | Model Context Protocol — connects AI to external tools and data | Integrating with Supabase, Sentry, Linear, Notion, GitHub, n8n, and 45+ other services. |

### How AI Fits Into Each VISTADEL Phase

AI isn't a phase — it's a tool used across all phases. But the way you use it changes:

| Phase | AI Use | Example |
|---|---|---|
| V: Vision | Interview synthesis, competitive research | Paste 5 interview transcripts, ask for pattern extraction |
| I: Integration | Data flow analysis, schema design, compliance mapping | Describe your data, ask Claude to enumerate all connections |
| S: Stack | Stack evaluation, migration planning, config review | Compare framework options against your requirements |
| T: Testing | Test generation, mock design, CI configuration | Paste a function, get a comprehensive test suite |
| **A: AI Impl** | **Development acceleration, product AI features** | **This phase** |
| D: Deployment | Deploy scripts, Lighthouse optimization, security hardening | Generate deploy configs, audit CSP headers |
| E: Evolution | Usage analysis, performance profiling, feature prioritization | Analyze PostHog data, identify optimization opportunities |
| L: Launch | Checklist verification, documentation generation | Review launch readiness across all quality gates |

### What AI Does Well in Development

- **Boilerplate generation** — scaffolding components, hooks, API routes, test files
- **Pattern application** — "make this component follow the same pattern as that one"
- **Refactoring** — rename across files, extract functions, restructure modules
- **Test writing** — generating test suites from function signatures and descriptions
- **Documentation** — generating README content, API docs, inline comments
- **Debugging** — analyzing error messages, suggesting fixes, tracing data flows
- **Code review** — identifying security issues, performance problems, anti-patterns

### What AI Does Poorly in Development

- **Architecture decisions without context** — AI will confidently recommend architectures that don't fit your constraints. Always provide Phase I and Phase S context.
- **Security-critical code** — AI-generated auth logic, encryption, and access control must be reviewed by a human who understands the security model. Never ship AI-generated security code without review.
- **Business logic that requires domain expertise** — AI doesn't know your business rules unless you tell it. It will generate plausible-looking code that encodes wrong assumptions.
- **Performance optimization without profiling** — AI will suggest optimizations based on general principles, not your actual bottlenecks. Profile first, optimize second.
- **Inventing facts** — AI will generate plausible-sounding but fabricated information when it doesn't have data. This is especially dangerous in documentation and client-facing content.

### The Review Rule

Every piece of AI-generated code gets reviewed before it ships. This isn't optional. The review checks:

1. **Correctness** — does it do what was asked?
2. **Security** — does it introduce vulnerabilities? (Especially: auth bypass, SQL injection, path traversal, exposed secrets)
3. **Maintainability** — will someone understand this in six months?
4. **Test coverage** — did the AI-generated code come with tests? If not, write them.
5. **Fabrication** — did the AI make up function names, API endpoints, or library features that don't exist?

---

## Step 2: AI as a Product Feature (What You Ship)

Not every app needs user-facing AI. If your Phase V validation didn't surface "I wish this tool was smarter" as a pain point, don't add AI features just because you can.

### When to Add User-Facing AI

| Signal | Action |
|---|---|
| Users explicitly asked for AI assistance during Phase V validation | Build it — validated demand |
| The core workflow involves text generation, analysis, or summarization | Strong candidate — AI directly improves the experience |
| The app handles data that benefits from pattern recognition | Consider it — but validate with users first |
| You think AI would be cool to add | Don't — this is feature creep, not validation |

### Common User-Facing AI Patterns

If your validation supports user-facing AI, these are the patterns that work:

**Summarization:** User has long content, AI produces a concise summary. Low risk, high value.

**Classification:** User has items to categorize, AI suggests categories. Works well when categories are well-defined and the user confirms.

**Generation with guardrails:** User provides a prompt, AI generates content within constraints. Requires careful prompt engineering and output validation.

**Analysis:** User has data, AI identifies patterns or anomalies. High value for data-heavy apps, but requires accuracy verification.

### What These Patterns Require

Every user-facing AI feature needs:

| Requirement | Why |
|---|---|
| **Input validation** | Reject malformed, oversized, or malicious inputs before they reach the model |
| **Output validation** | Check AI output for format compliance, content policy, and factual consistency |
| **Rate limiting** | Prevent runaway costs from single users or abuse |
| **Token budget** | Cap the cost per request and per user per period |
| **Timeout** | Kill requests that exceed a reasonable duration |
| **Fallback behavior** | What the user sees when the AI is unavailable, slow, or returns garbage |
| **Human override** | Users must be able to edit, reject, or bypass AI suggestions |
| **Logging** | Record inputs, outputs, latency, and errors for debugging and cost tracking |

### Cost Controls

AI features cost money per request. Without controls, a single misbehaving feature or a handful of heavy users can generate unexpected bills.

Document these before shipping any user-facing AI:

| Control | What to Set |
|---|---|
| Max tokens per request | Depends on use case — 500 for summaries, 2000 for generation, 4000 for analysis |
| Max requests per user per hour | Start conservative (20/hr), increase based on usage data |
| Max monthly spend per tenant | Set a ceiling, alert before reaching it |
| Fallback when budget exhausted | Show cached results, disable feature gracefully, or queue for next period |
| Model selection | Use the cheapest model that meets quality requirements — don't default to the most powerful |

---

## Step 3: Set Up Monitoring

Phase A's gate requires production readiness ≥ 50, which includes error tracking and monitoring. This isn't optional — it's the infrastructure that tells you whether your app (and its AI features) are actually working.

### Error Tracking: Sentry

The toolkit scaffolder includes a Sentry addon that configures:

- **Error capture** — unhandled exceptions, promise rejections, component errors
- **Performance tracing** — request latency, page load times, transaction traces
- **Session replay** — (opt-in) record user sessions to reproduce bugs
- **ErrorBoundary component** — catches React rendering errors and reports them

After scaffolding with the Sentry addon:

1. Set `VITE_SENTRY_DSN` in `.env.local`
2. Verify errors appear in your Sentry dashboard by triggering a test error
3. Confirm source maps are uploaded so stack traces are readable

### Product Analytics: PostHog

If your app has user-facing features (especially AI features), PostHog tracks:

- **Events** — which features are used, how often, by whom
- **Feature flags** — roll out AI features to a subset of users before full launch
- **Session recording** — (opt-in) watch how users interact with AI-generated content

After scaffolding with the PostHog addon:

1. Set `VITE_POSTHOG_KEY` in `.env.local`
2. Instrument key events: AI feature used, AI result accepted/rejected, AI error occurred
3. Set up a dashboard tracking AI feature adoption and error rates

### AI-Specific Monitoring

If you ship user-facing AI features, add these metrics to your monitoring:

| Metric | Why |
|---|---|
| Requests per minute | Detect usage spikes before they hit cost limits |
| Latency (p50, p95, p99) | Identify slow responses before users complain |
| Error rate | AI provider outages, malformed responses, timeout rate |
| Token usage per request | Cost tracking and optimization |
| User acceptance rate | How often users keep vs. discard AI output — the real quality signal |
| Fallback trigger rate | How often the fallback path activates — should be rare |

---

## Step 4: Integrate MCP Where It Adds Value

Model Context Protocol (MCP) connects AI models to external tools and data sources. I run 50+ MCP servers, but that doesn't mean every project needs MCP integration.

### When MCP Adds Value

| Scenario | MCP Value | Example |
|---|---|---|
| AI feature needs live data from external service | High | Pull Supabase records, query Linear tickets, read Notion pages |
| AI feature needs to take actions in external service | High | Create GitHub issues, send Slack messages, update HubSpot contacts |
| AI feature works with static/uploaded data only | Low | Summarizing a document the user pasted — no MCP needed |
| Development workflow benefits from tool integration | Medium | Using Supabase MCP to manage migrations, Sentry MCP to review errors |

### MCP in Development vs. Production

**Development (your workflow):** MCP servers connected to Claude Code CLI or claude.ai give you direct access to your tools — Supabase, GitHub, Linear, Notion, Sentry, n8n. This makes development faster but doesn't affect the shipped product.

**Production (user-facing):** MCP in the product means your app's AI features can access external data on behalf of users. This adds significant complexity: auth delegation, permission scoping, error handling per server, and cost per MCP call. Only add production MCP if your Phase V validation supports it.

### n8n for AI Orchestration

For complex AI workflows that involve multiple steps, conditional logic, or multi-model routing, n8n provides a visual workflow builder. Use cases:

- Multi-step processing: extract → classify → route → generate
- Multi-model fallback: try Claude → fall back to Gemini on failure
- Human-in-the-loop: AI generates → human reviews → AI refines
- Scheduled AI tasks: daily summaries, weekly reports, periodic analysis

n8n workflows are configured separately from your app code and connect via webhooks or API calls. This keeps AI orchestration logic out of your codebase while remaining auditable and modifiable.

---

## Step 5: Document Your AI Decisions

AI capabilities evolve fast. What's possible today may be obsolete in six months. Document your decisions so future you (or your team) understands the reasoning.

### What to Document

| Document | Contents |
|---|---|
| **AI usage in development** | Which tools, which workflows, review process |
| **User-facing AI features** | What they do, which model, token limits, fallback behavior |
| **Cost model** | Expected cost per user per month, ceiling, alert thresholds |
| **MCP integrations** | Which servers, what data they access, permission model |
| **Review policy** | Who reviews AI-generated code, what they check for |
| **Known limitations** | What the AI features can't do, where they fail, what the user should expect |

### Communicating AI Limitations to Users

If your product includes AI features, be transparent about what they can and can't do. Users who understand limitations trust the product more than users who discover limitations through failure.

At minimum, AI-generated content in your UI should include:

- A visual indicator that content was AI-generated
- An ability to edit or reject AI output
- A brief note about accuracy expectations (e.g., "AI-generated — review before using")

---

## Phase A Checklist

- [ ] Development AI tools configured (Claude Code CLI, Copilot, MCP servers as needed)
- [ ] AI code review process defined (who reviews, what they check)
- [ ] Error tracking configured and verified (Sentry — errors appear in dashboard)
- [ ] Performance tracing enabled
- [ ] Product analytics configured (PostHog — events tracked)
- [ ] If user-facing AI: input validation implemented
- [ ] If user-facing AI: output validation implemented
- [ ] If user-facing AI: rate limiting configured
- [ ] If user-facing AI: token budget set with fallback behavior
- [ ] If user-facing AI: timeout configured
- [ ] If user-facing AI: human override available (edit, reject, bypass)
- [ ] If user-facing AI: acceptance rate tracking instrumented
- [ ] If MCP: servers identified with permission model documented
- [ ] Cost model documented with alert thresholds
- [ ] AI limitations documented for team and (if applicable) users
- [ ] Production readiness audit score ≥ 50

---

## Common Failures

**"Let's add AI to everything."**
AI features that weren't validated in Phase V are feature creep. They add cost, complexity, and maintenance burden without proven user value. Add AI where users asked for it.

**"The AI-generated code looks right, so it's fine."**
AI-generated code is plausible by design. It looks correct even when it isn't. Review every piece — especially auth logic, data access, and anything that handles user input.

**"We don't need cost controls yet."**
You need them before the first user touches the AI feature. A single user sending 500 requests per hour without rate limiting will teach you this lesson expensively.

**"We'll add monitoring after launch."**
If you launch without error tracking, you won't know the app is broken until users tell you — and most users won't tell you, they'll just leave. Sentry takes five minutes to configure. Do it now.

**"AI can replace the testing phase."**
AI can write tests. AI cannot decide what to test, whether the tests are meaningful, or whether the assertions verify actual business requirements. AI is a tool in Phase T, not a substitute for it.

---

## AI Your BI℠: Claude in Phase A

This is the phase where Claude is most directly useful — not just as a tool, but as a subject. Three specific uses:

**Architecture for AI Features** — Describe the user-facing AI capability you want to build and ask Claude to propose the architecture: where the AI call happens (client, edge function, background job), how to handle failures, what the cost model looks like, and what monitoring to add.

**Prompt Engineering** — If your product includes AI-generated content, Claude can help design and iterate on the system prompts. Provide examples of desired input/output pairs and ask Claude to draft a prompt that produces consistent results.

**Cost Modeling** — Describe your expected usage patterns (users per day, AI interactions per user, average token count) and ask Claude to project monthly costs across different models and providers. This prevents cost surprises after launch.

Example prompt:

```
I'm building a feature where users can [describe feature].
Expected usage: [N users, M interactions/user/day].
Each interaction involves [describe input/output].

Design:
1. The architecture (where does the AI call happen?)
2. Input/output validation rules
3. Rate limiting and token budget
4. Fallback behavior when AI is unavailable
5. Monitoring metrics to track
6. Projected monthly cost at current usage and 10x growth
```

---

## References

- Scaffolder Sentry addon: `src/lib/sentry.ts`, `src/components/ErrorBoundary.tsx`
- Scaffolder PostHog addon: `src/lib/posthog.ts`, `src/hooks/useFeatureFlag.ts`
- `ref/diagrams/svg/performance-optimization.svg` — Build + load + runtime optimization paths
- `ref/docs/10-security-hardening.md` — Security review checklist applicable to AI-generated code
- n8n cloud: connected via MCP for workflow orchestration

---

**Previous Phase:** [← Phase T: Testing](./T-testing.md)
**Next Phase:** [Phase D: Deployment →](./D-deployment.md)
