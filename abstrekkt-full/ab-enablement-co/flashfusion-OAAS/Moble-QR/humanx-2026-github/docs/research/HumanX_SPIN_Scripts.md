# HumanX 2026 — SPIN Scripts & Conversation Frameworks
**With Shadow IT + Employee Misuse woven throughout**
**INT Inc. | Kyle Rosebrook**

---

## THE SHADOW IT OPENER

Use this as a conversation starter in **any** context — vendor meeting, peer networking, hallway.
It works because it's true, it's specific, and it makes people nod immediately.

> *"The biggest AI data governance risk right now isn't infrastructure — it's the browser
> tabs your employees have open. Shadow AI is the new Shadow IT. And for MSPs, the problem
> is worse: you're responsible for client data even when an employee pastes it into a tool
> nobody approved."*

**Why it works:**
- Vendors engage because it positions you as a practitioner, not a buyer fishing for pitches
- MSP peers engage because they feel this pain and haven't framed it this clearly
- Leads directly to Data Venue ("we're building the vault that makes the governed path frictionless")

---

## PLAYBOOK 1 — Peer [X]change SPIN Script

**Context:** Tech and Ops track breakfasts, receptions, roundtables.
These are practitioners, not vendors. No pitches. Lead with questions.

---

### SITUATION openers (establish common ground)

Pick one based on how the conversation starts:

**If they mention AI tools:**
> *"What does your stack look like for AI right now — are you using anything across
> client environments, or keeping it internal only?"*

**If they mention a compliance framework:**
> *"When you went through your SOC 2 audit, did the auditors ask about AI tool usage?
> That's becoming a new line item I'm seeing."*

**If they mention Microsoft / Copilot:**
> *"We're heavy Microsoft too. The Copilot integration is interesting but we're still
> figuring out the data boundary questions for multi-tenant. How are you handling that?"*

---

### PROBLEM (surface the pain without leading)

> *"How do you handle data isolation when you're doing any kind of AI analysis across
> multiple client environments? Is that a challenge you've had to actually solve, or
> is it more theoretical right now?"*

**Shadow IT variant:**
> *"Have you done any kind of audit on which AI tools your team is actually using with
> client data? Not the approved ones — the ones they've found on their own?"*

**Let them answer. Common responses and follow-ups:**

| Their response | Your follow-up |
|----------------|----------------|
| "We just keep everything in Copilot" | "Do you have visibility into what employees are doing outside of Copilot? That's where I'm seeing the exposure." |
| "We haven't really thought about it" | "That's honest — most MSPs are in the same place. The audit question is starting to come up though." |
| "We have a policy" | "How are you enforcing it technically? Policy without a control is just a document." |
| "It's a mess honestly" | "That's the honest answer. Tell me more — what's the worst version of that problem for you?" |

---

### IMPLICATION (connect to business consequences)

> *"What happens if a compliance audit flags cross-tenant data exposure?
> Have you had to walk a client through that conversation?"*

**Shadow IT variant:**
> *"If an employee used a consumer ChatGPT account and pasted a client's patient data
> into it — how would you even know? And what's your HIPAA exposure there?"*

**Escalation version (if they're engaged):**
> *"The EU AI Act and updated HIPAA guidance are both moving toward requiring auditability
> of AI tool usage, not just data storage. The 18-month window before that becomes an audit
> line item is probably shorter than people think."*

---

### NEED-PAYOFF (test the Data Venue thesis)

> *"We're building something that addresses exactly this — a secure multi-tenant vault
> purpose-built for MSPs. The idea is that client data never leaves the vault to reach
> the model — the model comes to the data. And there's a full audit trail of every
> AI interaction by tenant.*
>
> *Would something like that be useful in your environment, or is the problem not big
> enough yet to justify dedicated infrastructure?"*

**Shadow IT variant of the payoff:**
> *"Part of what we're building is a governed path that's frictionless enough that
> employees don't need to go around it. The vault has a clean API — if your team wants
> to run AI analysis, they use the vault, and the client data never touches a consumer tool.
> Does that solve the problem you're describing?"*

---

### Closing the peer conversation

**If strong interest:**
> *"I'd love to share what we've built as a prototype and get your reaction.
> Are you around for any of the evening sessions? Or can we set up a 20-minute
> call the week after the conference?"*

**If moderate interest:**
> *"I'll share the architecture one-pager — it's a single page, no deck, no pitch.
> What's the best email for you?"*

**If low interest:**
> *"Totally fair — the timing might not be right. For what it's worth, the assessment
> tool we're showing here gives you a scored view of your current architecture in
> 90 seconds. Worth doing just to have the data."* [hand them the QR card]

---

## PLAYBOOK 2 — SolutionBridge Vendor Meetings (15 min)

**Context:** Pre-scheduled 1:1 meetings. Vendor knows you're coming.
You have 15 minutes. First 3 minutes is theirs, next 10 is yours, last 2 is next steps.

---

### Opening (let them go first — 3 min)

> *"I've done some research on your architecture ahead of this. Before I get into
> our specific requirements, can you give me 2 minutes on what's changed in your
> platform in the last 6 months? I want to make sure I'm working from current info."*

This accomplishes three things: shows you've done homework, gets fresh intel,
and gives you something specific to reference when it's your turn.

---

### Your turn — Data Venue framing (5 min)

> *"So here's what we're solving. INT Inc. manages IT for [X] clients across healthcare,
> legal, and financial services. All of them want to operationalize AI, and all of them
> have HIPAA or SOC 2 requirements.*
>
> *The infrastructure problem we keep hitting is this: the moment you run AI analysis
> across client data, you need to guarantee that client A's data never bleeds into
> client B's model context. And beyond the architecture question, we're seeing a shadow
> IT problem — employees finding their own AI tools and using them with client data
> outside any governance structure.*
>
> *We're calling the solution Data Venue. The core thesis: the vault handles tenant
> isolation, the model comes to the data rather than data leaving the vault, and every
> AI interaction is auditable by tenant. We've built a prototype on AWS with RLS and
> a custom orchestration layer. I'm here to validate whether your architecture
> handles this better."*

---

### The 5 validation questions (5 min)

Ask these in order — each one builds on the previous answer:

**Q1 — Isolation**
> *"How do you enforce data boundaries between tenants at the query execution layer?
> I'm specifically interested in whether it's logical isolation — like RLS — or
> physical separation. And what's the blast radius if an isolation control fails?"*

**Q2 — Encryption**
> *"Do you support customer-managed keys per tenant? And can you rotate keys without
> re-encrypting the underlying data? That's the specific requirement we have for
> healthcare clients."*

**Q3 — AI exposure (the Shadow IT angle)**
> *"Here's a specific scenario: an employee at one of our client companies uses
> an AI tool we didn't provision — copies client data into it. What does your
> platform do to prevent that? And separately, when our team runs sanctioned AI
> analysis through the vault, does client data leave your infrastructure to reach
> the model?"*

**Q4 — Compliance depth**
> *"We have clients on HIPAA, SOC 2, and CMMC simultaneously. Do you have
> built-in audit logging that's segregated by tenant? And can we produce a
> per-tenant compliance report without writing custom queries?"*

**Q5 — MSP fit**
> *"We're an MSP, not a direct enterprise. Do you have a partner or reseller
> program that lets us manage a vault on behalf of multiple end clients?
> And what does pricing look like at 50 tenants versus 100?"*

---

### Closing the vendor meeting (2 min)

> *"This has been useful. Based on what you've shared, there are two things I want
> to follow up on: [specific thing 1] and [specific thing 2].*
>
> *What's the best way to continue this — do you have a solutions architect I
> should talk to, or is there a trial/sandbox I can access to test the isolation
> claims directly?"*

---

## PLAYBOOK 3 — Expo Hall Booth (5 min drive-by)

**Context:** You're walking the floor, Tier 1 and Tier 2 vendors.
Goal: get the right person talking in under 60 seconds.

---

### The opener (say this to whoever greets you)

> *"We're building a secure multi-tenant data vault for MSP operations — we call it
> Data Venue. I'm specifically looking at how your architecture handles tenant isolation
> and whether client data leaves the platform when you run AI inference. Who's the right
> person to walk me through that technically?"*

This immediately filters out sales reps and gets you to an SE or architect.

---

### If they try to give you a demo

> *"I'd love the demo — can you show me specifically what happens at the query layer
> when two tenants share an underlying database? And the Shadow IT question: if an
> employee runs an unsanctioned tool against data in your platform, where does that
> show up in your audit logs?"*

---

### Shadow IT specific booth questions (add to any vendor)

For **Snowflake:**
> *"Do you have any tooling around detecting or blocking unmanaged AI tools from
> querying Snowflake data? We're seeing employees use consumer AI tools against
> Snowflake connections they shouldn't have access to."*

For **OneTrust:**
> *"Does your data mapping automatically pick up AI tool usage as a processing
> activity? We're trying to get to a place where shadow AI shows up in the
> data inventory automatically, not manually."*

For **Kong / API Gateway:**
> *"Can you enforce at the API layer that only approved AI tools can reach our
> data endpoints? And does it log model-specific request patterns, not just
> generic API calls?"*

For **Promptfoo:**
> *"This is directly relevant — can you test for cross-tenant data leakage
> in LLM outputs? Specifically, if a model has been exposed to multiple tenants'
> data, can you detect bleed-through in its responses?"*

---

## QUICK REFERENCE — Shadow IT Statistics (cite in conversation)

Use these to add credibility. All sourced.

| Stat | Use when |
|------|----------|
| **65% of employees** use at least one unsanctioned AI tool at work (Gartner 2025) | Opening any Shadow IT conversation |
| **43% of employees** who use AI at work say they've entered confidential data into a consumer AI tool (Microsoft 2024) | Escalating the implication |
| **$4.45M** average cost of a data breach involving third-party AI tools (IBM 2024) | Connecting to business risk |
| **89%** of buying decisions cross multiple departments (Forrester 2024) | Justifying why IT + compliance + legal all need to be in the room |
| **95%** of AI implementations fail due to "learning gaps" not technology failures (MIT 2025) | Positioning Data Venue's governance-first approach |

---

## THE GIVE-FIRST OPENING (for any new conversation)

Before pitching anything, lead with something useful:

> *"I've been doing deep research on how MSPs are handling the AI data governance
> challenge. The pattern I keep seeing is that the technology problem is mostly
> solved — RLS, CMK, private endpoints. The unsolved problem is the human layer:
> employees using AI tools the infrastructure doesn't know about.*
>
> *Happy to share what I'm finding if it's useful."*

This establishes you as a knowledgeable peer, not a salesperson.
Share the research freely. It builds trust and opens doors.

---

*Prepared for HumanX 2026 | INT Inc. | Kyle Rosebrook | April 6–9, Moscone Center South*
