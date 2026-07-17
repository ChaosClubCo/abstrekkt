# **Architectural Blueprint for an AI-Agentic Communications Stack**

This report delivers a production-ready, highly secure, and optimized communications architecture designed specifically for a solo-operator B2B AI enablement consultancy.1 The proposed stack utilizes the Claude API, Gemini 2.0 Pro, Supabase, Vercel, Cloudflare Workers, Make, HubSpot CRM, and Twilio to build an autonomous pipeline capable of reading, writing, and responding to client communications with zero human intervention for routine operations.1

## **1\. Platform Architecture**

### **1.1 Definitive Recommendation**

The lowest-operational-overhead path to establishing an autonomous inbound and outbound messaging sequence involves a decoupled, event-driven loop that connects Twilio's messaging webhooks directly to a serverless Cloudflare Worker, routing payloads asynchronously to Make for orchestration and utilizing the Claude API for contextual response drafting.4 This architecture strictly isolates the synchronous webhook ingestion from the latent execution of the large language model, preventing gateway timeout errors.5

### **1.2 Decision-Forcing Tradeoff**

The decision-forcing tradeoff centers on developer overhead versus structural resilience.8 While a native Make webhook requires zero code, it forces synchronous execution, blocking Twilio's gateway and risking execution timeouts during latent Claude API calls.10 Vercel Functions provide strong Next.js edge synchronization but carry a minimum $20/seat monthly license fee, whereas Cloudflare Workers Paid represents the lowest-overhead option, offering a flat $5/month base, zero egress charges, and cold start times under ![][image1].4

### **1.3 Concrete Implementation Reference**

The following JavaScript code implements a decoupled Cloudflare Worker webhook receiver. It synchronously parses the incoming form-urlencoded data from Twilio, hands off the processing payload to Make asynchronously using ctx.waitUntil, and immediately returns an empty TwiML response to prevent Twilio gateway timeouts.5

JavaScript  
// Cloudflare Worker: Asynchronous Webhook Hand-off  
export default {  
  async fetch(request, env, ctx) {  
    if (request.method\!== "POST") {  
      return new Response("Method Not Allowed", { status: 405 });  
    }

    const contentType \= request.headers.get("content-type");  
    if (\!contentType ||\!contentType.includes("application/x-www-form-urlencoded")) {  
      return new Response("Bad Request", { status: 400 });  
    }

    const formData \= await request.formData();  
    const payload \= Object.fromEntries(formData.entries());

    // Enforce immediate execution of an asynchronous background task  
    ctx.waitUntil(  
      fetch(env.MAKE\_SCENARIO\_WEBHOOK\_URL, {  
        method: "POST",  
        headers: { "Content-Type": "application/json" },  
        body: JSON.stringify(payload)  
      })  
    );

    // Return immediate HTTP 200 OK with empty TwiML to satisfy Twilio's gateway  
    return new Response("\<Response\>\</Response\>", {  
      status: 200,  
      headers: { "Content-Type": "text/xml" }  
    });  
  }  
};

### **1.4 Architectural Warn-and-Watch**

Twilio enforces a default 15-second read timeout for webhooks.12 If the receiver fails to return an HTTP response within this window, the gateway triggers automatic retries (up to 5 attempts), resulting in duplicate execution loops and runaway API costs.12

## **2\. HubSpot Integration**

### **2.1 Definitive Recommendation**

To orchestrate trigger-based outbound messaging, a HubSpot workflow must detect a CRM event (such as a deal stage transition or custom contact property update) and execute an instant webhook to Make.15 Make acts as the middleware, receiving the payload, extracting the contact's identifier, querying HubSpot's CRM API to retrieve the target's verified mobile phone number, and formatting it via the Twilio Lookup API before dispatch.16

### **2.2 Decision-Forcing Tradeoff**

The choice between pre-built app integrations and visual middleware centers on functional flexibility versus deployment velocity.16 Pre-built marketplace connectors deploy instantly but lock the operator into rigid schemas and lack support for custom transformations.19 Utilizing Make as an event-driven middleware hub reduces point-to-point connections, provides visual debugging, and handles API rate limits effectively, though it introduces a dependency on external automation tasks.2

### **2.3 Concrete Implementation Reference**

The following JSON payload is structured to log conversation history natively via HubSpot's Communications API (Object type ID 0-18), mapping properties to prevent record duplication by utilizing the Twilio MessageSid as a custom unique property for idempotency.21

JSON  
{  
  "properties": {  
    "hs\_communication\_channel\_type": "SMS",  
    "hs\_communication\_logged\_from": "CRM",  
    "hs\_communication\_body": "The proposal has been logged to your secure portal. Let us know if you require adjustments.",  
    "hs\_timestamp": "1782093000000",  
    "hubspot\_owner\_id": "4028593",  
    "twilio\_message\_sid": "SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"  
  },  
  "associations":  
    }  
  \]  
}

### **2.4 Architectural Warn-and-Watch**

HubSpot's native Twilio integration is a marketing-focused add-on requiring a premium Marketing Hub subscription and is restricted to unidirectional, US-only broadcasts, making it entirely unsuited for two-way sales engagement.23 Furthermore, bidirectional synchronization workflows must explicitly filter out messages initiated from the CRM timeline to prevent infinite, recursive loop execution.16

## **3\. Claude Agent Integration**

### **3.1 Definitive Recommendation**

The recommended pattern for a Claude agent to trigger Make scenarios utilizes a direct tool-calling JSON schema defined within the messages payload of the Claude API.10 This approach avoids the deployment and maintenance overhead of hosting dedicated Model Context Protocol (MCP) servers, which are ideal for local IDE setups but add unnecessary complexity for cloud-based, serverless agent loops.1

### **3.2 Decision-Forcing Tradeoff**

Managing conversation state across multi-turn SMS exchanges requires balancing context retention against token consumption.27 Storing structured records in a Supabase database and retrieving only the last ![][image2] messages to reconstruct the chat thread maintains budget boundaries.2 Enabling Anthropic's server-side context compaction automatically summarizes older exchanges, retaining long-term thematic coherence, but introduces variable API charges compared to flat-rate, hard-truncated client-side histories.27

### **3.3 Concrete Implementation Reference**

The following JSON schema defines the tool parameter structure used by the Claude API to execute an outbound sequence through the Make middleware.10

JSON  
{  
  "name": "trigger\_outbound\_sequence",  
  "description": "Triggers an automated outbound message sequence via Make to a verified client contact.",  
  "input\_schema": {  
    "type": "object",  
    "properties": {  
      "contact\_phone": {  
        "type": "string",  
        "description": "The client phone number in strict E.164 format."  
      },  
      "sequence\_template\_id": {  
        "type": "string",  
        "description": "The target outbound sequence template identifier."  
      },  
      "contextual\_variables": {  
        "type": "object",  
        "description": "Dynamic contact fields to merge into the outbound sequence.",  
        "properties": {  
          "client\_first\_name": { "type": "string" },  
          "outstanding\_invoice\_amount": { "type": "number" }  
        },  
        "required": \["client\_first\_name"\]  
      }  
    },  
    "required": \["contact\_phone", "sequence\_template\_id", "contextual\_variables"\]  
  }  
}

### **3.4 Architectural Warn-and-Watch**

Claude API thinking and generation cycles can require 3 to 10 seconds of processing time.10 Because this latency frequently exceeds the default HTTP read timeout limits of messaging gateways, a synchronous loop will trigger automatic webhook retries, resulting in duplicate outgoing drafts and rapid token drain.12

## **4\. Gemini and Google Ecosystem Role**

### **4.1 Definitive Recommendation**

In a B2B consulting automation context, Gemini 2.0 Pro adds exceptional value over Claude Sonnet 4.6 due to its native 1-million token context window and direct, secure enterprise connectors for Google Workspace.1 This enables the model to search and synthesize information natively across Gmail, Google Docs, Google Calendar, and Google Drive without requiring the extraction, formatting, and upload of files to external servers.30

### **4.2 Decision-Forcing Tradeoff**

Leveraging Gemini's native Workspace connectors requires choosing between integration velocity and ecosystem flexibility.11 Utilizing native Google Workspace connectors allows the solo operator to deploy context-aware meeting preparation, inbox triage, and document-synthesis agents in minutes via the Google Admin console.32 However, this couples the business operations tightly to the Google Cloud ecosystem, making future platform migrations complex.11

### **4.3 Concrete Implementation Reference**

The following markdown schema outlines the handoff structure from NotebookLM (which compiles and cites research sources) to Claude Design, demonstrating how the synthesized report is transformed into editable PowerPoint (PPTX) slide decks.35

# **MASTER BRIEF HANDOFF: RESEARCH-TO-DRAFT**

## **1\. Grounded Source Syntheses (NotebookLM Output)**

* Source Document:  
* Validated Key Findings: Competitor X launched an automated support triage agent in April 2026, leading to a 30% reduction in customer response latency.  
* Direct Citation: Page 14, Paragraph 3\.

## **2\. Dynamic Constraints (Handoff Instructions)**

* Objective: Reconstruct the competitive landscape section of the client pitch deck.  
* Tone: Executive, technical, professional, direct.  
* Format Output: Deliverable formatted as editable PowerPoint (PPTX) slides.

## **3\. Tool Instruction (Claude Design Prompt)**

"Using the attached Master Brief, generate a 3-slide competitive matrix. Execute the layout using named groups and layers optimized for PowerPoint (PPTX) format to ensure complete text-box editability. Do not flatten any element."

### **4.4 Architectural Warn-and-Watch**

While the Gemini app can read most file types in Google Drive, it cannot parse comments, images, or inline drawings within Google Docs.33 Additionally, it cannot process raw video or audio files unless they are embedded within supported presentations or document structures, requiring pre-extraction of transcripts for media-heavy client folders.33

## **5\. Supabase as the Comms Event Store**

### **5.1 Definitive Recommendation**

A relational database schema deployed on Supabase represents the optimal, multi-channel state repository for all agentic communications.2 Enforcing strict data isolation in a consulting environment requires the database to utilize Row-Level Security (RLS) policies.2 The comms\_events table holds SMS, voice, email, and WhatsApp events, and is partitioned by a client\_id foreign key.2 RLS policies validate the caller's JWT claims on every query, ensuring that an agent or portal user can only access rows belonging to their designated client tenant.41

### **5.2 Decision-Forcing Tradeoff**

The critical performance tradeoff in Supabase RLS design lies between inline SQL policy definitions and custom Security Definer helper functions.41 Inline SQL policies are simple to write but can degrade performance on high-traffic tables because PostgreSQL may evaluate nested subqueries (such as checking membership in a related client\_members table) for every single row scanned.41 Wrapping complex checks inside a PostgreSQL Security Definer function allows the execution planner to bypass intermediate table RLS, optimizing query times down to sub-10ms.41 However, this introduces potential privilege escalation risks if input validation is not rigidly locked down.41

### **5.3 Concrete Implementation Reference**

The following SQL migration script defines the structured multi-tenant schema, indexes, the Security Definer retrieval helper, and client-scoped RLS policies.2

SQL  
\-- Schema Design: Multi-Channel Comms Logging with RLS  
create table public.comms\_events (  
  id uuid default gen\_random\_uuid() primary key,  
  client\_id uuid not null references public.clients(id) on delete cascade,  
  contact\_id uuid not null,  
  channel text not null check (channel in ('SMS', 'voice', 'email', 'whatsapp')),  
  direction text not null check (direction in ('inbound', 'outbound')),  
  body text,  
  metadata jsonb default '{}'::jsonb,  
  occurred\_at timestamptz default now() not null  
);

\-- Enable RLS on the table  
alter table public.comms\_events enable row level security;

\-- Index key identifier columns for query optimization  
create index idx\_comms\_events\_client\_contact on public.comms\_events(client\_id, contact\_id);  
create index idx\_comms\_events\_occurred\_at on public.comms\_events(occurred\_at desc);

\-- Create Client-Scoped RLS policy  
create policy "client\_scoped\_access" on public.comms\_events  
  for all to authenticated  
  using (  
    client\_id \= (select auth.jwt() \-\> 'app\_metadata' \-\>\> 'client\_id')::uuid  
  );

\-- Parameterized History Retrieval Function  
create or replace function public.get\_conversation\_history(  
  p\_contact\_id uuid,  
  p\_limit integer default 20  
)  
returns setof public.comms\_events  
language sql  
security invoker  
as $$  
  select \*  
  from public.comms\_events  
  where contact\_id \= p\_contact\_id  
    and client\_id \= (select auth.jwt() \-\> 'app\_metadata' \-\>\> 'client\_id')::uuid  
  order by occurred\_at desc  
  limit p\_limit;  
$$;

### **5.4 Architectural Warn-and-Watch**

When utilizing Supabase Edge Functions for real-time event streaming via Server-Sent Events (SSE), developers must utilize the EdgeRuntime.waitUntil primitive.7 Failing to wrap long-running operations—such as PDF generation, database writes, or LLM response drafting—within a waitUntil promise will result in the Edge gateway aggressively terminating the Deno thread before execution completes.7

## **6\. Cost and Operational Risk**

### **6.1 Definitive Recommendation**

For a low-volume, solo consulting deployment, the realistic monthly operational cost of running this Twilio and Make infrastructure in the United States is highly cost-effective, typically totaling under $20.00 per month.6 This baseline assumes the acquisition of a local long-code phone number, the routing of approximately 500 SMS text message segments, 50 local voice minutes, and the maintenance of a single sole-proprietor A2P 10DLC campaign.46

### **6.2 Decision-Forcing Tradeoff**

The primary operational tradeoff is between custom API development and licensing pre-built, turnkey communications platforms (like EZ Texting or OpenPhone).6 Building a custom Twilio-and-Make integration requires approximately 20 hours of initial engineering to implement opt-out logic, error handling, and signature verification, representing a high up-front cost.6 However, it is the only approach that supports custom AI-agentic logic and avoids monthly seat fees, making it the superior choice when long-term scalability and programmatic control are required.6

### **6.3 Concrete Implementation Reference**

The following table models the precise monthly operational expenses for the proposed stack, calculating baseline carrier, compliance, and messaging costs.46  
![][image3]  
![][image4]

| Line Item | Unit Cost | Quantity | Estimated Cost |
| :---- | :---- | :---- | :---- |
| **Local long code phone number** | $1.15 / month 46 | 1 | $1.15 |
| **Sole proprietor 10DLC fee** | $2.00 / month 48 | 1 | $2.00 |
| **Outbound SMS (Base Rate)** | $0.0083 / segment 46 | 500 segments | $4.15 |
| **Carrier surcharges (Average)** | $0.0040 / segment 6 | 500 segments | $2.00 |
| **Inbound local calls** | $0.0085 / minute 46 | 50 minutes | $0.43 |
| **Conversations API User Fee** | $0.05 / active user 18 | 50 users | $2.50 |
| **Total Estimations** |  |  | **$12.23** |

Note: Outbound local voice calls run $0.0140/min 47, and one-time setup fees require a $4.00 brand registration and $15.00 campaign vetting.46

### **6.4 Architectural Warn-and-Watch**

The primary operational failure mode involves cascading webhook loops.12 If an incoming SMS triggers an uncaught error downstream or if the model's output formatting fails, a loop can continuously execute, resulting in rapid carrier filtering or severe financial depletion.9 This risk requires the implementation of a strict database-level unique constraint on Twilio's MessageSid column and an automated spend circuit breaker within the Make middleware.12

### **6.5 Dedicated Engineer Boundary**

The communications stack remains solo-manageable for a B2B consultancy with fewer than 10 active clients and low transaction volume (![][image5] messages/month).2 The boundary shifts, requiring a dedicated platform engineer, once the business transitions to a commercial multi-tenant SaaS.2 This transition introduces complex sharding, automated billing/Stripe webhooks per tenant, strict data classification, and high-concurrency performance tuning.40

#### **Works cited**

1. Claude AI Systems Architect Persona Initialization, [https://drive.google.com/open?id=1wafEE5Ci\_YjB\_kiFITgeCJRz14pknkr3vT7HfmQDxQs](https://drive.google.com/open?id=1wafEE5Ci_YjB_kiFITgeCJRz14pknkr3vT7HfmQDxQs)  
2. (No Subject), [https://mail.google.com/mail/u/0/\#all/FMfcgzQfBQMhbsmJSZzbCCBKlhswMGjv](https://mail.google.com/mail/u/0/#all/FMfcgzQfBQMhbsmJSZzbCCBKlhswMGjv)  
3. Twilio Conversations, accessed June 22, 2026, [https://www.twilio.com/docs/conversations](https://www.twilio.com/docs/conversations)  
4. 5 Best serverless computing platforms for AI (2026) | Blaxel Blog, accessed June 22, 2026, [https://blaxel.ai/blog/best-serverless-computing-platforms-ai](https://blaxel.ai/blog/best-serverless-computing-platforms-ai)  
5. The Tradeoffs of Choosing Serverless Architecture | by NEWSWIRE \- Medium, accessed June 22, 2026, [https://medium.com/@madhav2002/the-tradeoffs-of-choosing-serverless-architecture-f74041bca379](https://medium.com/@madhav2002/the-tradeoffs-of-choosing-serverless-architecture-f74041bca379)  
6. Twilio review: SMS and voice without surprise costs \- Automation Labz, accessed June 22, 2026, [https://www.automationlabz.com/integrations/twilio](https://www.automationlabz.com/integrations/twilio)  
7. Supabase Edge Functions: Introducing Background Tasks, Ephemeral Storage, and WebSockets, accessed June 22, 2026, [https://supabase.com/blog/edge-functions-background-tasks-websockets](https://supabase.com/blog/edge-functions-background-tasks-websockets)  
8. TanStack Start on Vercel vs Cloudflare, accessed June 22, 2026, [https://vercel.com/kb/guide/tanstack-start-on-vercel-vs-cloudflare](https://vercel.com/kb/guide/tanstack-start-on-vercel-vs-cloudflare)  
9. 10 Best Twilio Alternatives in 2026 (Tested & Reviewed) \- Brilo AI | AI Phone & Voice Agent For Businesses, accessed June 22, 2026, [https://www.brilo.ai/resources/twilio-alternatives](https://www.brilo.ai/resources/twilio-alternatives)  
10. Architecting Production-Ready AI Agents with the Claude Agent SDK, [https://drive.google.com/open?id=16lWXFiyLNSI7jK4h3dKAxBjHSeSvBQL4\_W26UToycAM](https://drive.google.com/open?id=16lWXFiyLNSI7jK4h3dKAxBjHSeSvBQL4_W26UToycAM)  
11. Choosing an agent framework: LangChain vs LangGraph vs CrewAI vs PydanticAI vs Mastra vs Vercel AI SDK | Speakeasy, accessed June 22, 2026, [https://www.speakeasy.com/blog/ai-agent-framework-comparison](https://www.speakeasy.com/blog/ai-agent-framework-comparison)  
12. Webhooks (HTTP callbacks): Connection Overrides \- Twilio, accessed June 22, 2026, [https://www.twilio.com/docs/usage/webhooks/webhooks-connection-overrides](https://www.twilio.com/docs/usage/webhooks/webhooks-connection-overrides)  
13. Cloudflare Workers vs Vercel (2026): $0.30/M Requests vs $20/Seat | Pricing, Cold Starts, Limits \- Morph, accessed June 22, 2026, [https://www.morphllm.com/comparisons/cloudflare-workers-vs-vercel](https://www.morphllm.com/comparisons/cloudflare-workers-vs-vercel)  
14. An HTTP call inside a @Transactional method quietly took down my whole API under load : r/SpringBoot \- Reddit, accessed June 22, 2026, [https://www.reddit.com/r/SpringBoot/comments/1u3es80/an\_http\_call\_inside\_a\_transactional\_method/](https://www.reddit.com/r/SpringBoot/comments/1u3es80/an_http_call_inside_a_transactional_method/)  
15. How to Create Custom Events \- HubSpot Knowledge Base, accessed June 22, 2026, [https://knowledge.hubspot.com/reports/create-custom-events](https://knowledge.hubspot.com/reports/create-custom-events)  
16. HubSpot Twilio Integration for CRM Messaging Automation, accessed June 22, 2026, [https://integrateiq.com/integrations/hubspot-twilio/](https://integrateiq.com/integrations/hubspot-twilio/)  
17. Overview of the WhatsApp Business Platform with Twilio, accessed June 22, 2026, [https://www.twilio.com/docs/whatsapp/api](https://www.twilio.com/docs/whatsapp/api)  
18. Twilio Pricing, accessed June 22, 2026, [https://www.twilio.com/en-us/pricing](https://www.twilio.com/en-us/pricing)  
19. Native vs Custom HubSpot Integrations: When to Build vs Buy in 2026 \- Aptitude 8, accessed June 22, 2026, [https://aptitude8.com/blog/native-vs-custom-hubspot-integrations](https://aptitude8.com/blog/native-vs-custom-hubspot-integrations)  
20. Twilio \+ HubSpot integration \- Tray.ai, accessed June 22, 2026, [https://tray.ai/connectors/twilio-hubspot-integrations/](https://tray.ai/connectors/twilio-hubspot-integrations/)  
21. Engagements | Communications \- HubSpot docs, accessed June 22, 2026, [https://developers.hubspot.com/docs/api-reference/legacy/crm/objects/communications/guide](https://developers.hubspot.com/docs/api-reference/legacy/crm/objects/communications/guide)  
22. Fixing HubSpot Duplicates: From 'Garbage In, Garbage Out' to a Flawless RevOps Engine, accessed June 22, 2026, [https://blog.glaremarketing.co/fixing-hubspot-duplicates-from-garbage-in-garbage-out-to-a-flawless-revops-engine](https://blog.glaremarketing.co/fixing-hubspot-duplicates-from-garbage-in-garbage-out-to-a-flawless-revops-engine)  
23. Why HubSpot's Native SMS Doesn't Work for Sales Teams (2026) \- Aloware, accessed June 22, 2026, [https://aloware.com/blog/hubspot-sms-for-sales](https://aloware.com/blog/hubspot-sms-for-sales)  
24. HubSpot SMS Marketing 2026: Native Add-On vs Third-Party Reality Check \- Message IQ, accessed June 22, 2026, [https://messageiq.io/blog/hubspot-sms-marketing/](https://messageiq.io/blog/hubspot-sms-marketing/)  
25. Using Aloware Actions in HubSpot Contact, Deal, Company, and Ticket Workflows, accessed June 22, 2026, [https://support.aloware.com/en/articles/9019886-using-aloware-actions-in-hubspot-contact-deal-company-and-ticket-workflows](https://support.aloware.com/en/articles/9019886-using-aloware-actions-in-hubspot-contact-deal-company-and-ticket-workflows)  
26. Supabase MCP Integration with Claude Agent SDK \- Composio, accessed June 22, 2026, [https://composio.dev/toolkits/supabase/framework/claude-agents-sdk](https://composio.dev/toolkits/supabase/framework/claude-agents-sdk)  
27. Compaction \- Claude API Docs, accessed June 22, 2026, [https://platform.claude.com/docs/en/build-with-claude/compaction](https://platform.claude.com/docs/en/build-with-claude/compaction)  
28. Mastering Context Management in Claude Code CLI: Your Guide to Efficient AI-Assisted Coding \- Lalatendu Keshari Swain, accessed June 22, 2026, [https://lalatenduswain.medium.com/mastering-context-management-in-claude-code-cli-your-guide-to-efficient-ai-assisted-coding-83753129b28e](https://lalatenduswain.medium.com/mastering-context-management-in-claude-code-cli-your-guide-to-efficient-ai-assisted-coding-83753129b28e)  
29. Memory tool \- Claude API Docs, accessed June 22, 2026, [https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)  
30. AI Tools for Business | Google Workspace, accessed June 22, 2026, [https://workspace.google.com/solutions/ai/](https://workspace.google.com/solutions/ai/)  
31. The 20 Best Free & Paid AI Websites in 2026: Tested & Ranked | Lindy, accessed June 22, 2026, [https://www.lindy.ai/blog/ai-websites](https://www.lindy.ai/blog/ai-websites)  
32. Control Gemini App access to Workspace services, accessed June 22, 2026, [https://knowledge.workspace.google.com/admin/generative-ai/gemini-app/turn-google-apps-in-gemini-on-or-off](https://knowledge.workspace.google.com/admin/generative-ai/gemini-app/turn-google-apps-in-gemini-on-or-off)  
33. Connect the Google Workspace app to Gemini Apps, accessed June 22, 2026, [https://support.google.com/gemini/answer/15229592?hl=en](https://support.google.com/gemini/answer/15229592?hl=en)  
34. This New Google Gemini Spark Always On Agent Can Work Without Prompts \- Reddit, accessed June 22, 2026, [https://www.reddit.com/r/AISEOInsider/comments/1thiqdp/this\_new\_google\_gemini\_spark\_always\_on\_agent\_can/](https://www.reddit.com/r/AISEOInsider/comments/1thiqdp/this_new_google_gemini_spark_always_on_agent_can/)  
35. NotebookLM Research Tool Connects With Hermes And Claude : r/AISEOInsider \- Reddit, accessed June 22, 2026, [https://www.reddit.com/r/AISEOInsider/comments/1u79kd9/notebooklm\_research\_tool\_connects\_with\_hermes\_and/](https://www.reddit.com/r/AISEOInsider/comments/1u79kd9/notebooklm_research_tool_connects_with_hermes_and/)  
36. Using NotebookLM for AI Development | Developing with AI Tools \- Steve Kinney, accessed June 22, 2026, [https://stevekinney.com/courses/ai-development/notebooklm](https://stevekinney.com/courses/ai-development/notebooklm)  
37. Went from messy research notes to a 12-slide client-ready pitch deck in 45 minutes using NotebookLM and Claude Design. Here is the exact four-step workflow. \- Reddit, accessed June 22, 2026, [https://www.reddit.com/r/CreatorsAI/comments/1tu6u52/went\_from\_messy\_research\_notes\_to\_a\_12slide/](https://www.reddit.com/r/CreatorsAI/comments/1tu6u52/went_from_messy_research_notes_to_a_12slide/)  
38. Claude Design \+ NotebookLM: Editable Decks, Sites & Prototypes (2026), accessed June 22, 2026, [https://notebooklm-guide.com/notebooklm-claude-design-workflow/](https://notebooklm-guide.com/notebooklm-claude-design-workflow/)  
39. Supabase Realtime Database Builder Skill \- HeyClaude, accessed June 22, 2026, [https://heyclau.de/entry/skills/supabase-realtime-database](https://heyclau.de/entry/skills/supabase-realtime-database)  
40. Supabase: Support Multi-Tenancy With Detail \+ Template Project \- Level Up Coding, accessed June 22, 2026, [https://levelup.gitconnected.com/supabase-support-multi-tenancy-with-detail-template-project-34f3a3d97ee4](https://levelup.gitconnected.com/supabase-support-multi-tenancy-with-detail-template-project-34f3a3d97ee4)  
41. Supabase RLS Best Practices: Production Patterns for Secure Multi-Tenant Apps \- MakerKit, accessed June 22, 2026, [https://makerkit.dev/blog/tutorials/supabase-rls-best-practices](https://makerkit.dev/blog/tutorials/supabase-rls-best-practices)  
42. Supabase RLS Deep Dive — Multi-tenant Access Control \- DEV Community, accessed June 22, 2026, [https://dev.to/kanta13jp1/supabase-rls-deep-dive-multi-tenant-access-control-11ig](https://dev.to/kanta13jp1/supabase-rls-deep-dive-multi-tenant-access-control-11ig)  
43. Row Level Security | Supabase Docs, accessed June 22, 2026, [https://supabase.com/docs/guides/database/postgres/row-level-security](https://supabase.com/docs/guides/database/postgres/row-level-security)  
44. Use live artifacts in Claude Cowork | Claude Help Center, accessed June 22, 2026, [https://support.claude.com/en/articles/14729249-use-live-artifacts-in-claude-cowork](https://support.claude.com/en/articles/14729249-use-live-artifacts-in-claude-cowork)  
45. Edge Functions | Supabase Docs, accessed June 22, 2026, [https://supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)  
46. Twilio Pricing 2026: Plans, Costs & Hidden Fees Explained \- CheckThat.ai, accessed June 22, 2026, [https://checkthat.ai/brands/twilio/pricing](https://checkthat.ai/brands/twilio/pricing)  
47. Twilio Pricing: What's Driving the Cost Behind Every Text? \- TextUs, accessed June 22, 2026, [https://textus.com/blog/twilio-pricing](https://textus.com/blog/twilio-pricing)  
48. 10DLC (10-digit long code numbers) \- Twilio, accessed June 22, 2026, [https://www.twilio.com/en-us/phone-numbers/a2p-10dlc](https://www.twilio.com/en-us/phone-numbers/a2p-10dlc)  
49. Programmable Voice Pricing in United States | Twilio, accessed June 22, 2026, [https://www.twilio.com/en-us/voice/pricing/us](https://www.twilio.com/en-us/voice/pricing/us)  
50. Phone System Pricing & Billing Guide \- HighLevel Support Portal, accessed June 22, 2026, [https://help.gohighlevel.com/support/solutions/articles/48001223556-phone-system-pricing-billing-guide](https://help.gohighlevel.com/support/solutions/articles/48001223556-phone-system-pricing-billing-guide)  
51. Cloudflare \+ Vercel: Does it actually boost performance or just add complexity? \- Reddit, accessed June 22, 2026, [https://www.reddit.com/r/vercel/comments/1s94oeo/cloudflare\_vercel\_does\_it\_actually\_boost/](https://www.reddit.com/r/vercel/comments/1s94oeo/cloudflare_vercel_does_it_actually_boost/)  
52. Best CometChat Alternatives & Competitors (2026 Pricing \+ Reviews) \- Chatboq, accessed June 22, 2026, [https://chatboq.com/blogs/cometchat-alternatives](https://chatboq.com/blogs/cometchat-alternatives)  
53. FlashFusion — Weekly Performance Review — June 14, 2026, [https://mail.google.com/mail/u/0/\#all/FMfcgzQgMVZKNrPlCLhNKBBXgxjKjTDs](https://mail.google.com/mail/u/0/#all/FMfcgzQgMVZKNrPlCLhNKBBXgxjKjTDs)  
54. Common Issues with HubSpot CRM Integration | Frontdesk Blog \- AI Receptionist, accessed June 22, 2026, [https://www.myaifrontdesk.com/blogs/common-issues-with-hubspot-crm-integration](https://www.myaifrontdesk.com/blogs/common-issues-with-hubspot-crm-integration)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAZCAYAAACclhZ6AAACnklEQVR4Xu2WTYhOURjH/0L5migiMZkmKaXQhIiyUpqmRD6KYihkZUYSZaFYWCAfC8k0aRJhMbNQJsq7okzNio1mFiOxQoRsfPz/85yne+71vtfbi+Zd3F/9eu9777n3nuec8zznAgUFBbUyl56k1+gpujB9eZStdA2dRsfR2XQXXRY3GmtW0od0HV1K79Of9Ais02ICvRPOx96l00ObMWcy7aV76fhwbiZ9Rr/QlnBOXKfP6St6j7Yiuacu0PIaoZ9gs+KcgI18Z3TuMtLB1R0T6UXaDwvMOQYLRr9OLcHMoAtoG51HJ9H14b9WgNDs6rmbaBOSpS10vIgeoLvpYljeVo3yQ8voO+zFzhV6gQ7S1/QpXR5dL0cH/QAbmDO0m+6gl+h7uoXepvvpUdjSPjx6pwVyjp6m82GB9NEb4XpVrII9VJVNM+eoI8eR5IkqmTqkApLHCvqVPoDlqFDnNCBvkFROH8QSrGLOgQ2c7ncUkAKsClWmR7SHTs1ca0A64b1Dt2AdqYSWkAZHS8XxXL2J9LLSqJdgwcyiL2BFRwOn92lw1Y8/ooZX6XkkI5iHd2gYNoqV8GCUJ47fm10ycTBCFVP3+lYwhCr2NQ8kXkaa0g3huJ3+oAfDf+EdknHxyPI3wQgvGmfpR9hMacMui6ZZG6SSNZ5yLYvN4dirWxyML7MS0i/PUmswaqP/8bO1sSvPylZVdX4PLEHVMW2IrpJ7bWi3GlbN4oKwnX6DVaQ8vAD4wIi8YJQnyhe10bECcJbANnSV+d/wh2Y/U+Rb2hza+ew9pvtgpfUdPRSuVUKlXCXen6nPH5Xgz9G5l3Rn+PVzur6NPqED4b4uWHXbiH9EI2xzUy79728y5e6UcKzNV3lSV59PBQUFBQW5/AIxUZUuAyFtMgAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAaCAYAAABVX2cEAAABHElEQVR4XmNgGAWUAkcgfg3E/6F4BxBzIsnzAfEuJHkQXgfE3EhqUAAjEM8C4l9A/BOILVGlwSAIiNcwoFqEFQgC8UIgzmeA2DyFAWIBMigC4mg0MaxAH4j7gVgSiK8D8RMgVkSSZwHi2VB1BAHIxnQou4EB4rocuCwDgwgDxOUgHxAEfUBsDGXrAPF7ID4BxPxQMRsgngxl4wWw8ALZDgIgLy0H4n9A7AEVA7mapPBCDnCQISDDQIaCYo+s8IIBkPdA3gR514mByPACuQYUFqboEkAQwwCJiGtA3IkmhxWghxcyEGeAJBOQgUSFF8gLoKzBhS4BBQ1A/BaINdHEUYALEH9hQOQ1UBbyRlEBAaBkAsqrBMNrFIyCIQMA260zNBT6yKgAAAAASUVORK5CYII=>

[image3]: <data:image/png;base64,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>

[image4]: <data:image/png;base64,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>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAAAZCAYAAACis3k0AAACwklEQVR4Xu2YS6iNURiGP6GI4xKSkEtKJiZCikIGJClJysDIJRNlwIQMZOCSIhnIZeRu6jJDDJRSBgyUUC5RzJgovG/fv5y1117fPt+/95/TqfXU09l77XXevf5v73X5t0ihUCgUBpPhcAucnbQHxsG98Dw8BKe1vuzGkzMMLoVn4Dm4XnR8KZ6s/8JouAGehh/hD7iopYcyC76AO+AouA6+hkviTg48OSzifvgIzoGT4BXRYo2M+nmyGmGMtL5xDhaSA1gJD0u+kCPgBXi7ehw4Cu+LZnjw5vD9v8Dl/3qIzIXv4drquTerJ+bDW/AqnJK81okDki8kL+Kz6OsxmyTf38Kbw2KwaPE07YOP4WXRb6w3qzZhTXkAz8KZrS+7sAq5Bv6W9kFzSfgDtyXtFp4cTtE70l7IsfAhfAYnii+rFlyAV4t+WidE15NusQoZBmcNOm23sPrH7aFgViFDuyfLBQu4ET6FB0V3r16xCsn23ODqDtqTwyKxWAMV0pPVEW4eW+Fz0W2fG0pTWIXcJ/nBuQdd4cmZCt/IwIX0ZHVkFXwHd0tDO1OEVUhrcFa7hdV/0KZ2/K3keauJaU2sQvIY8kvaBxcGzZ3SgyeHRxkeaaxCci/oE1+Wm7BOcifrdaMhViGni84C3mXE7ILf4IKobUJlDm8Ox5HmToYvpf9/vVm1SI8+3d4m8QJ+wsVJO/OPiG5s46s2zoqb8Jr0H4h5fuVB+oPoHUmKN2eeaAZnXWAF/AqXVc+9WV3B8IXwHrwo+YtJ4WZ1HX4XnRLBT/BU1I+DvQtviN4JXYJP4IyoDx/zlo3nO06xHJ4cwqn5Fu6E2+EruEf0GgPerJ5gEY+LfrpNwaWE035z9Tf3IwLhvS8vzMKbw6WKHwi1li1v1pCDU+qk+GZDoQP8UeGYtE7BQk34beTvmWHxLxQKhcIQ4y+DytWpVUAOnQAAAABJRU5ErkJggg==>