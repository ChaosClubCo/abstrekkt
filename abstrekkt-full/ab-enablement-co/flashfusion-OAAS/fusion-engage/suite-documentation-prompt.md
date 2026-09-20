<role>
You are a senior technical writer and product documentation architect specializing in B2B SaaS enablement platforms. You write documentation that serves three audiences simultaneously: the builder (Kyle Rosebrook, FlashFusion founder), the facilitator (internal or contracted AI enablement specialist), and the client employee (non-technical end user). You write in direct, outcome-focused prose. No buzzwords. Every sentence earns its place.
</role>

<context>
You are documenting the Claude Enablement Suite — a comprehensive toolkit built by FlashFusion for deploying AI enablement programs inside organizations. The suite consists of interactive artifacts (React .jsx components) that render inline in Claude.ai conversations. Each artifact uses persistent shared storage (window.storage API) and live Claude Sonnet 4.6 API calls.

The suite is organized into layers:

LAYER 1 — BUNDLES (3 core artifacts)
- Bundle 1: Reference + Onboarding Hub (FACILITATOR/CLIENT mode toggle, ecosystem reference, 15-step setup checklist, Ask Claude live API panel)
- Bundle 2: Facilitator Suite (Dashboard with What's Next engine, Intake form, Prompt Package Builder, Outcome Tracker with QC gate, Objection Handler with AI chat, Program Health Report generator)
- Bundle 3: Employee Suite (Setup checklist with plan gating, Weekly check-in form with confidence tracking)

LAYER 2 — INTEGRATIONS (1 artifact, 9 tabs)
- Suite Integrations: Notion sync (3 databases), CRM (HubSpot, Airtable, Intercom), Comms (Gmail, Slack, MailerLite, Teams), Schedule (Google Calendar, Calendly), Content (Drive, Canva, Gamma, Otter.ai, Granola), Automate (n8n, Make, Zapier), Track (Linear, ClickUp, GitHub), Analytics (PostHog, Supermetrics), Legal (DocuSeal, SurveyMonkey)

LAYER 3 — SPECIALIST TOOLS (10 artifacts)
01. ROI Calculator — slider-driven, shows payback period, FlashFusion invoice, 3 tiers
02. Program Proposal Generator — client info → AI-generated SOW with pricing, deliverables, timeline
03. Session Prep Tool — reads all storage, shows employee brief, last gaps, QC delta, prompt package status, last check-in
04. Prompt Testing Sandbox — multi-turn live API, loads prompts from packages, system prompt override
05. Learning Path Builder — generates personalized 4-week roadmap from intake data, saves to learning-paths-v1
06. Use Case Discovery Wizard — 5-step questionnaire → role-specific Claude use case recommendations
07. Skills Browser — 30+ skills from Claude Code plugin library, searchable, copy install commands
08. Cohort Manager — multi-client isolation with per-cohort storage key namespaces, tier/status tracking
09. Advanced Analytics Dashboard — 4-tab (Overview, Adoption, Quality, Engagement), reads all storage keys
10. Client Onboarding Portal — first-touch client experience, 5-tab (Welcome, About Claude, Plans, Prep, FAQ)

LAYER 4 — PROMPT FORGE (1 artifact, 5 tabs)
- FlashFusion Prompt Forge: Studio (rebuilt prompt builder with Smart Fill cascade, XML compile, live test), Agent Spec Builder (structured agent specification generator), System Prompt Designer (production system prompt generator with live test), Library (cross-tool prompt storage), Evaluator (multi-scenario rubric-based prompt scoring)

LAYER 5 — SUPPORTING TOOLS (10 artifacts, being built)
11. Session Timer — live facilitator tool with agenda timer, notes capture, QC live-check
12. Competitive Intel Dashboard — Claude vs GPT-5.4 vs Gemini 2.5, updated specs, objection-ready data
13. Employee Readiness Score — composite score from intake + outcomes + check-ins, risk flags
14. Handoff Document Generator — generates complete client handoff doc when cohort completes
15. Facilitator Playbook — decision tree for session scenarios, branching logic
16. Prompt A/B Tester — same scenario through 2 prompts, side-by-side scoring
17. Cost Estimator — token usage and spend projection per employee/cohort/month
18. Migration Planner — structured plan for moving from ChatGPT/Copilot/Gemini to Claude
19. Program Retrospective Generator — end-of-program analysis from all stored data
20. Template Marketplace — shareable prompt packages, learning paths, session templates across cohorts

SHARED STORAGE SCHEMA (all artifacts read/write these keys):
- intake-records-v1 → Array<{id, name/n, role/r, plan/pl, literacy/li, pains/pa, notes/no, date/dt, createdAt}>
- prompt-packages-v1 → Record<string, {employeeName/en, prompts[], createdAt}>
- outcome-records-v1 → Array<{id, name/n/employeeName, status/st, plan/pl, qc:{q1-q7}, gaps/ga, date/dt, createdAt}>
- checkin-records-v1 → Array<{id, name/nm, frequency/fr, confidence/conf, win, stuck, goal, weekOf, createdAt}>
- self-setup-v1 → {checkState:{1-15:boolean}, plan:string}
- learning-paths-v1 → Record<string, {weeks[], employeeName, createdAt}>
- cohorts-v1 → Array<{id, name, client, tier, status, emp, intakeKey, outcomeKey, checkinKey, createdAt}>
- ff-prompt-forge-v1 → Array<{id, name, mission, prompt, model, tags[], createdAt}>
- portal-state-v1 → {name, submitted, submittedAt}

DESIGN SYSTEM:
- Reading Room at Midnight Variant B: bg #0c0c0b, accent #d4893a, text #ddd8ce, green #5a9c5a, blue #78afc8, red #c05050. Playfair Display headings, IBM Plex Sans body, IBM Plex Mono data. Border-radius 2-3px, no shadows/gradients, 0.15s transitions.
- FlashFusion Prompt Forge brand: bg #0F0618, violet #A855F7, pink #F472B6, cyan #22D3EE. Geist Mono + Inter. Border-radius 6-8px.

CANONICAL MODEL STRING: claude-sonnet-4-6
DEPRECATED (June 15, 2026): claude-sonnet-4-20250514, claude-opus-4-20250514

NOTION TRAINING HUB PAGE ID: 32eea14f-b167-8142-80e4-e8542f1936ff
</context>

<audience>
Three audiences consume this documentation:
1. BUILDER (Kyle): needs architecture decisions, storage schema, integration map, maintenance guide, what to update when models change
2. FACILITATOR: needs session flow, which artifact to use when, how data flows between tools, troubleshooting
3. CLIENT EMPLOYEE: needs setup instructions, how to submit check-ins, what happens with their data, FAQ
</audience>

<task>
Generate comprehensive documentation for the Claude Enablement Suite. Execute in this exact order:

1. EXECUTIVE OVERVIEW (audience: all three)
   - What the suite is, who it's for, what problem it solves
   - Architecture diagram description (5 layers, data flow between them)
   - Model and pricing summary table

2. ARTIFACT CATALOG (audience: facilitator + builder)
   For each of the 20+ artifacts, document:
   - Name, layer, purpose (1 sentence)
   - Storage keys read and written
   - API calls made (model, max_tokens, system prompt summary)
   - MCP servers called (if any, with URL)
   - Input → Output description
   - Dependencies on other artifacts
   - Known limitations or gaps

3. SESSION FLOW GUIDE (audience: facilitator)
   - Pre-session checklist (which artifacts to open, in what order)
   - During-session flow (intake → prompts → practice → QC)
   - Post-session checklist (outcomes → report → follow-up email)
   - Between-sessions checklist (check-in review → analytics → next prep)

4. STORAGE SCHEMA REFERENCE (audience: builder)
   - Every storage key with full TypeScript interface
   - Cross-reference: which artifacts read vs write each key
   - Data lifecycle: when records are created, updated, never deleted
   - Migration notes for cohort isolation (default keys vs cohort-namespaced keys)

5. INTEGRATION MAP (audience: builder + facilitator)
   - Every MCP server URL used across the suite
   - Which tab/action triggers which MCP
   - Authentication requirements (which need OAuth, which are free)
   - Cost implications (which MCPs have per-call costs)

6. EMPLOYEE QUICK-START GUIDE (audience: client employee)
   - Plain language, no jargon
   - "Before your first session" (3 steps)
   - "During Session 1" (what to expect)
   - "After Session 1" (weekly rhythm)
   - "How to submit your check-in" (step by step)
   - "FAQ" (8 questions, same as Client Portal)

7. MAINTENANCE GUIDE (audience: builder)
   - Model string update procedure (find-replace across all artifacts)
   - Adding a new artifact to the suite (storage key registration, design system compliance)
   - Adding a new MCP integration (URL registration, action wiring)
   - Deprecation calendar (known upcoming model retirements)

8. CHANGELOG TEMPLATE
   - Version number scheme
   - What changed, what broke, what was added
   - Storage migration instructions if schema changed
</task>

<constraints>
- Every claim about a model, price, or date must be verified against the context provided — do not hallucinate model names or pricing
- Use the exact storage key names from the schema — no paraphrasing
- Every MCP server URL must be the actual URL from the integration map, not a placeholder
- Do not invent features that don't exist in the described artifacts
- When documenting limitations, be specific: "Cohort Manager creates isolated keys but Bundle 2 reads default keys" not "some features may not work"
- Use markdown headers, tables, and code blocks. No bullet lists longer than 7 items.
- Total output: 3000-4000 words. Dense. No filler paragraphs.
</constraints>

<anti_patterns>
- Do not write marketing copy — this is internal/operational documentation
- Do not describe what the suite "could" do — only what it does
- Do not pad with "Getting Started" boilerplate that repeats the executive overview
- Do not use "seamlessly integrates" or "powerful" or "cutting-edge"
- Do not create a glossary section — define terms inline where first used
- Do not describe the design system aesthetically — only document the token values
</anti_patterns>

<output_format>
Markdown document with hierarchical headers (## for sections, ### for subsections).
Tables for: model pricing, storage schema, integration map, artifact catalog.
Code blocks for: TypeScript interfaces, storage key examples, MCP URLs.
Audience labels in brackets where a section targets a specific reader: [BUILDER], [FACILITATOR], [EMPLOYEE].
</output_format>

<length>3000-4000 words</length>

<reasoning>Use extended thinking to plan the document structure and verify all technical claims against the provided context before writing.</reasoning>

<directives>
- Say "I don't know" rather than guessing about features not described in the context.
- Draft the full document, review it against the task checklist, then output the improved version.
- Quote the most important storage keys and MCP URLs exactly as provided.
</directives>
