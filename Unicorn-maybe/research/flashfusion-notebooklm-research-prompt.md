# FlashFusion — NotebookLM Deep Research Prompt
## Version 1.0 | March 2026
## Purpose: Context-engineered research prompt for NotebookLM Deep Research

---

## HOW TO USE THIS PROMPT

### Step 1 — NotebookLM Setup (do this before pasting the prompt)
1. Create a new notebook called "FlashFusion Research — [Date]"
2. Open Notebook Settings (gear icon) → paste the CUSTOM INSTRUCTIONS block below
3. Use Deep Research (Web source → Deep Research) for any section marked [WEB RESEARCH]
4. For cross-notebook queries: mount this notebook in the Gemini App to combine with other notebooks
5. Source budget: 50 max. Allocate 20 for documents you upload, 30 for Deep Research imports

### Step 2 — Sources to upload before running the prompt
Upload these documents directly (paste as text or PDF):
- This prompt document itself
- Your FlashFusion PoD strategic blueprint (Google Drive)
- Your Base44 Fusion AI entity schema export (copy from Base44 app)
- The FlashFusion v2 landing page HTML (copy from Claude conversation)
- Any existing FlashFusion product docs or notes

### Step 3 — Run the prompt
Paste the RESEARCH PROMPT block into the NotebookLM chat.

---

## CUSTOM INSTRUCTIONS
*(Paste into Notebook Settings → Notebook instructions — up to 10,000 chars)*

```
You are a senior AI product strategist and market researcher working exclusively for FlashFusion, an early-stage AI infrastructure platform. Your role is to help the founder (Kyle Rosebrook, Staff Engineer and AI SME) make high-conviction strategic decisions backed by evidence.

ABOUT FLASHFUSION — READ THIS CAREFULLY:
FlashFusion does not exist in your training data. You know nothing about it. Everything you need to know is in the uploaded sources. Here is the complete context:

FlashFusion is a Claude-native AI platform infrastructure company with the following characteristics:
- Mission: "Build the agent internet. Any vertical. Ship in days."
- Core thesis: Every internet category will be rebuilt where AI agents are first-class participants, not afterthoughts. Moltbook proved this for social networks. FlashFusion is the infrastructure that lets anyone build the next Moltbook — for any category.
- Technology: Built on Base44 (AI app builder), Vercel, Supabase, Cloudflare Workers, Claude API (Anthropic). 67-entity production data model already built covering: Projects, AIGeneration, PromptTemplates, AgentDefinition, AgentWorkflow, PipelineConfig, SecurityScan, ComplianceReport, Plugin/Marketplace, Subscriptions, ABTestConfig, and more.
- Differentiators: (1) Claude-native by design — all-in on Anthropic ecosystem, (2) Security-first — production-grade RLS, audit logs, no exposed API keys (direct contrast to Moltbook's 1.5M leaked keys), (3) Prompt A/B testing as platform primitive (native PromptExperiment + PromptTemplateVersion entities), (4) Plugin marketplace as moat (MCP-compatible tool registry), (5) Visual workflow orchestration for non-technical vertical builders.
- Stage: Late PoD (Proof of Design). Platform architecture complete. Zero external customers yet. Pre-launch.
- Founder: Kyle Rosebrook — Staff Engineer (AppSec + Platform) at Intinc (managed IT services). Building FlashFusion in parallel on personal time using personal tools and domains.
- Domains owned: flashfusion.co, flashnframe.com
- Revenue model: Service tier ($0 / $99 / $299/mo) + services revenue from custom builds
- First customers targeted: CSTMPRNT (custom print shop, wants ERP automation), Relish Print Shop (screen printing, Lindenhurst IL), The Sole Revival (corporate custom shoe events, Fortune 500 clients), Grand Appliance (20-location family appliance retailer, owner connection)
- Anthropic partnership path: Claude Partner Network → MCP registry → co-marketing → formal partnership. Timeline: 3–6 months with live customer proof.
- Competitive context: Not competing with v0/Lovable/Bolt directly. Those are code generators. FlashFusion is the production deployment, security, orchestration, and marketplace layer AFTER you generate the code — the operational infrastructure for agent-native products.

KEY TERMS TO KNOW:
- Agent-native: A product or platform where AI agents are first-class participants with identity, tools, and interaction protocols — not just a chatbot layer on top of existing software.
- MCP (Model Context Protocol): Anthropic's open standard for how agents connect to external tools. FlashFusion's Plugin entity is architecturally identical to an MCP server registry.
- Moltbook: Viral agent social network launched Jan 28 2026, acquired by Meta March 10 2026. Proved the "agent internet" category. Had 1.5M agents, 17K human owners. Was acquired for its agent identity registry concept. Had major security failures (exposed Supabase keys). FlashFusion is the secure, production-grade alternative infrastructure.
- Vibe coding: Building software using AI without writing code directly. Moltbook was entirely vibe-coded. FlashFusion is also heavily vibe-coded but with production security patterns applied.
- OpenClaw: Agent framework (formerly Clawdbot/Moltbot) that powers Moltbook agents. Now being open-sourced with OpenAI backing. Key competitor/complement to watch.
- The Sole Revival: Corporate custom shoe company (Chicago, est. 2011). Works with Amex, Capital One, PepsiCo, Dell, Comcast. 2 employees, ~$1M revenue, Fortune 500 client list. Kyle previously worked there.
- Centerline Equipment (cline.com): Aerospace/military specialty manufacturer (potting, encapsulation, conformal coating). Kyle's best friend owns it. Also relevant: the domain cline.com is potentially valuable to Cline AI (cline.bot) — the open-source AI coding agent with 5M+ developers.
- Grand Appliance: Family-owned appliance retailer, founded 1930, 4th generation, 20 locations (IL, WI, IA, IN). Aaron Reckling is EVP and co-owner. Kyle knows him personally.

RESPONSE STYLE:
- Evidence-first. Cite sources for every significant claim. Use inline citations like [Source: document name, section].
- If something is in your training data but not in uploaded sources, flag it: [EXTERNAL KNOWLEDGE — verify]
- If something is speculative or uncertain, flag it: [INFERENCE — low/medium/high confidence]
- Format outputs as structured reports with clear sections, not conversational prose.
- When multiple strategic paths exist, present them as A/B/C options with explicit tradeoffs.
- Never pad responses. If you don't have source evidence, say so clearly.
- Decision priority: Maintainability > Correctness > Security > Scalability > Performance
```

---

## RESEARCH PROMPT
*(Paste into NotebookLM chat after uploading sources and setting Custom Instructions)*

```
You are researching on behalf of FlashFusion, an early-stage Claude-native AI platform infrastructure company. Full context is in your Custom Instructions and uploaded sources. Do not invent information about FlashFusion — use only what is in the sources.

Run a comprehensive deep research analysis across the following 8 sections. For sections marked [WEB RESEARCH NEEDED], use the Deep Research feature to supplement your uploaded sources with current web intelligence.

---

## SECTION 1: Market Validation — The Agent Internet Thesis
[WEB RESEARCH NEEDED]

Research question: Is the "agent internet" category real, large enough, and early enough for FlashFusion to establish an infrastructure position?

Investigate:
1. What happened with Moltbook — full timeline, acquisition terms, what Meta paid for specifically, what OpenClaw/OpenAI is building in parallel
2. Current state of the agent internet category — key players, funding activity in last 6 months, what's being built
3. How fast the "agent-native product" market is forming — any comparable infrastructure plays (think: what Vercel is to Next.js, what Twilio was to SMS, what Stripe was to payments)
4. Evidence for or against each of FlashFusion's 5 differentiators being real moats vs. features
5. What Anthropic's MCP ecosystem looks like today — how many servers, what categories, what's missing

Output: A market validation report with a VERDICT section that gives a clear confidence rating (1–10) on whether the thesis is correct and why.

---

## SECTION 2: Competitive Landscape — Where FlashFusion Actually Competes
[WEB RESEARCH NEEDED]

Research question: Who are the real competitors — not the obvious ones (v0, Lovable, Bolt) but the infrastructure and security layer players?

Investigate:
1. Who is building agent deployment infrastructure (not agent builders — infrastructure for agents)
2. Companies building agent identity/registry systems — who is tackling the "verified agent" problem
3. Who is building MCP marketplaces or tool registries for agents
4. Security-focused agent platforms — anyone positioning specifically around the Moltbook security failure narrative
5. How Vercel, Cloudflare Workers, Railway, and Supabase are positioning in the agent infrastructure space
6. Pricing and business models of comparable infrastructure plays

Output: A competitive matrix with: Company | Category | What they do | FlashFusion overlap | Threat level | Opportunity

---

## SECTION 3: ICP Definition — Who Are the First 10 Customers
[WEB RESEARCH NEEDED]

Research question: Who exactly is the ideal first customer for FlashFusion, and how do you find more of them?

Using the specific customers already identified in the sources (CSTMPRNT, Relish Print Shop, The Sole Revival, Grand Appliance, Centerline Equipment), plus web research:

1. Build a precise ICP (Ideal Customer Profile) based on the pattern across these contacts — what do they share, what makes them viable?
2. Research: How many businesses similar to each of these exist in the US? (e.g., how many small custom print shops, how many corporate branded merchandise companies, how many regional multi-location independent retailers)
3. What is the agent-native product they need — for each of the 5 identified contacts, spec the exact product FlashFusion should build for them in 30 days
4. Which vertical has the highest WSJF score (Cost of Delay / Job Size) as the first market to enter?
5. Are there any "hidden gem" verticals not currently on FlashFusion's radar that match the ICP pattern perfectly?

Output: A ranked ICP matrix + vertical prioritization using WSJF scoring + a "hidden gem" section with 3 unexpected verticals worth investigating.

---

## SECTION 4: Anthropic Partnership Path — What's Actually Possible
[WEB RESEARCH NEEDED]

Research question: What does a real Anthropic partnership look like, what are the requirements, and what's the realistic timeline?

Investigate:
1. Current Anthropic Claude Partner Network — who is in it, what they built, what they demonstrated to get in
2. Anthropic's MCP directory — current state, how to list a server/registry, what qualifies
3. Any public information about Anthropic's enterprise or platform partnership programs
4. What types of case studies Anthropic has published or co-marketed — what's the pattern?
5. Given Moltbook's acquisition by Meta and OpenAI hiring the OpenClaw creator — what is Anthropic's strategic gap that FlashFusion could fill?
6. Are there any risks to the Claude-native bet — evidence that Anthropic might build this natively, change operator terms, or shift pricing significantly?

Output: A partnership readiness checklist + a 12-month milestone map for going from "first customer" to "formal Anthropic partnership."

---

## SECTION 5: Technical Architecture Audit — What's Real vs. What's Missing
[USE UPLOADED SOURCES ONLY — NO WEB RESEARCH]

Research question: Using only the uploaded FlashFusion source documents, what is the current state of the platform and what are the critical gaps?

Analyze:
1. The 67-entity Base44 data model — which entities are populated with real data vs. empty? What does that tell you about platform maturity?
2. Which of FlashFusion's 5 differentiators are architecturally present today vs. aspirational?
3. Security posture — based on the entity schemas (RLS configurations, audit log entities, SecurityScan entity), how production-hardened is the current architecture?
4. What would need to be true technically to serve the first external customer (CSTMPRNT) — specific gaps
5. What would need to be true to submit a credible Anthropic Partner Network application?
6. The Sole Revival use case — based on their business (Fortune 500 corporate custom shoe events, 2 employees, ~$1M revenue) — spec exactly what a FlashFusion "Activation OS" would need to do technically

Output: Technical readiness scorecard (1–10 per differentiator) + gap analysis + minimum viable architecture for first customer.

---

## SECTION 6: Business Model — Revenue, Pricing, and Path to $30K MRR
[WEB RESEARCH NEEDED]

Research question: What is the right pricing and revenue model for FlashFusion, and what does the path to $30K MRR look like?

Investigate:
1. Comparable infrastructure platform pricing — what do Vercel, Supabase, Railway, Cloudflare Workers, and similar charge? At what scale?
2. Agent platform pricing — what do LangSmith, Kore.ai, and similar charge for agent orchestration and observability?
3. Custom development services pricing for AI — what do AI implementation agencies charge for the type of builds FlashFusion would do for CSTMPRNT, Relish, and The Sole Revival?
4. Freemium vs. services-first go-to-market — which model is right for a one-person pre-launch platform with a services capability?
5. What does $30K MRR realistically look like in terms of customer count and mix (platform fees + services)?

Output: A pricing model recommendation + revenue mix model + 12-month MRR ramp projection with explicit assumptions.

---

## SECTION 7: The cline.com Domain — Hidden Asset Analysis
[WEB RESEARCH NEEDED]

Research question: What is the cline.com domain actually worth, and what is the right approach to monetize it?

Investigate:
1. Cline the AI coding agent (cline.bot) — current traction, funding, team, enterprise adoption (Samsung, Fortune 500 clients, MCP integration, 5M+ developers). What is the company's current valuation range?
2. Domain acquisition precedents — what have comparable AI company domains sold for? (.com domains matching a major AI product brand)
3. The right approach: direct outreach vs. broker vs. auction — for a domain this specific, what is the recommended path?
4. Is there any risk in the approach — legal, relationship, or otherwise?
5. Timeline and process — how long does a domain acquisition negotiation typically take?

Output: Domain valuation estimate + recommended approach + outreach script template + risk assessment.

---

## SECTION 8: The Grand Appliance Opportunity — Enterprise Entry Point
[WEB RESEARCH NEEDED]

Research question: What is the realistic scope of the Grand Appliance opportunity, and what is the right entry strategy given the personal relationship with Aaron Reckling (EVP, co-owner)?

Investigate:
1. Grand Appliance profile — 20 locations, IL/WI/IA/IN, 4th generation family business, founded 1930, carries 95+ brands including Sub-Zero/Wolf/Cove premium lines. Current competitive pressure from Amazon and big-box retailers.
2. What AI implementations have comparable regional independent appliance retailers done — any case studies?
3. The independent appliance retail category — size, number of companies, competitive dynamics, margin pressure, Amazon/Home Depot threat
4. What specifically would resonate with a 4th-generation family business owner who has built his career on personal relationships and customer service? (Aaron Reckling, EVP, Concordia University Chicago grad, actively engaged on LinkedIn)
5. The 5 specific pain points identified: post-purchase lifecycle agent, price match automation, delivery coordination, sales floor intelligence, service/warranty coordination — what is the business case for each in dollar terms?
6. Pricing and engagement model for a 20-location enterprise pilot — what is realistic for a first engagement?

Output: Enterprise engagement strategy + pain point business case (ROI per initiative) + pilot proposal structure + recommended conversation opener for Aaron Reckling.

---

## SYNTHESIS REQUEST

After completing all 8 sections, generate a final MASTER SYNTHESIS that includes:

1. TOP 5 HIGHEST CONFIDENCE BETS — the 5 actions with highest WSJF score across everything you've found
2. TOP 3 RISKS — the 3 things most likely to kill FlashFusion in the next 90 days
3. THE ONE THING — if Kyle can only do one thing this week, what is it and why?
4. UNKNOWN UNKNOWNS — what important questions did this research reveal that weren't in the original prompt?
5. CLAIMS/COUNTEREXAMPLES/CONTRADICTIONS — a structured footer flagging anything in the research that contradicts the FlashFusion thesis or the strategic plan

---

## OUTPUT FORMAT REQUEST

For each section:
- Lead with a 2-sentence TL;DR
- Follow with structured findings using headers
- Close with a VERDICT or RECOMMENDATION in bold
- Use citation format: [Source: document name] for uploaded sources, [WEB: url or description] for web research
- Flag confidence levels on key claims: [HIGH] [MEDIUM] [LOW]
- Total target length per section: 600–900 words
- Synthesis section: 400–600 words

Do not pad. Do not repeat context I gave you. Get straight to findings.
```

---

## NOTEBOOKLM HIDDEN GEMS — APPLY THESE AFTER RESEARCH IS COMPLETE

Once the research sections are done, use these NotebookLM capabilities to transform the output:

### 1. Audio Overview — Strategic Briefing
Prompt: "Generate an Audio Overview of this notebook as a strategic briefing for an investor. Focus on the market opportunity, the founder's unfair advantages, and the 90-day plan. Formal tone, no banter."

### 2. Mind Map (if available)
Generate a mind map from the notebook to visualize how the 8 research sections connect. Look for unexpected cross-connections between the ICP, competitive landscape, and Anthropic partnership sections.

### 3. Study Guide → Pitch Deck Outline
Use the Study Guide feature to generate a structured Q&A. Then prompt: "Convert this Q&A into a 10-slide pitch deck outline. Slide structure: Problem → Market → Solution → Differentiators → Traction → Business Model → Team → Roadmap → Anthropic Partnership → Ask."

### 4. Data Table — Competitive Matrix
Ask NotebookLM to generate a data table from Section 2 findings. Export to Google Sheets for ongoing competitor tracking.

### 5. Cross-Notebook Query (via Gemini App)
If you have other notebooks (e.g., INT work research, personal OS), mount this notebook in the Gemini App to ask cross-notebook questions like: "Based on my FlashFusion research and my INT work notes, what skills from my day job are directly applicable to the FlashFusion build?"

---

## SOURCE LOADING STRATEGY
*(To stay within the 50-source limit)*

| Priority | Source | Format | Notes |
|---|---|---|---|
| 1 | This research prompt | Paste as text | Gives NotebookLM full context |
| 2 | FlashFusion PoD blueprint | PDF or Google Doc URL | Strategic foundation |
| 3 | Base44 entity schemas | Paste as text | Technical architecture evidence |
| 4 | FlashFusion landing page v2 | Paste HTML as text | Positioning evidence |
| 5–10 | Deep Research: "Moltbook acquisition Meta 2026" | Web | Market validation |
| 11–15 | Deep Research: "agent internet infrastructure platform 2026" | Web | Competitive landscape |
| 16–20 | Deep Research: "Anthropic Claude Partner Network MCP directory" | Web | Partnership path |
| 21–25 | Deep Research: "Cline AI cline.bot funding traction 2026" | Web | Domain asset research |
| 26–30 | Deep Research: "independent appliance retailer AI implementation" | Web | Grand Appliance strategy |
| 31–35 | Deep Research: "vertical AI agent pricing model SaaS 2026" | Web | Business model |
| 36–40 | Deep Research: "agent identity registry verified agent platform" | Web | Competitive moat validation |
| 41–50 | Reserve for additional web research as needed | Web | |

---

## KNOWN NOTEBOOKLM CONSTRAINTS TO WORK AROUND

| Constraint | Workaround |
|---|---|
| 50 source limit | Prioritize table above. Consolidate multiple small docs into single uploads |
| Deep Research may over-summarize | Ask NotebookLM to "preserve specific data points, names, URLs, and numbers" in Deep Research imports |
| Notebooks are isolated silos | Mount in Gemini App for cross-notebook queries |
| Audio Overview flattens nuance | Use for introductory summaries only — not for Section 5 (technical audit) which requires precision |
| No export to Notion directly | Export to Google Docs → manually copy to Notion |
| Free tier: 50 queries/day | Run research in sessions — all 8 sections may require 2 days |
| Deep Research runs in background | Start Deep Research imports first, upload manual sources while it runs |

---

*Generated by Claude Sonnet 4.6 for Kyle Rosebrook / FlashFusion*
*Date: March 21, 2026*
*Lane: Personal (Path B)*
