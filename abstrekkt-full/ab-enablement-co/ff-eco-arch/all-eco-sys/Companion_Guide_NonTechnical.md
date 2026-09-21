# Getting Started with AI Prompting
## A Plain-English Guide to Using the 15 Frameworks Library

**For:** Anyone who's never used Claude or AI assistants before  
**No coding required.** No technical background assumed.  
**Companion to:** *Top 15 Prompting Frameworks v2.0*  
**Version:** 1.0 · May 2026

---

## What This Guide Is (and Isn't)

This guide teaches you how to get good results from Claude — Anthropic's AI assistant — using a structured approach instead of guessing. It's the companion to the *Top 15 Prompting Frameworks* library, which contains 150 ready-to-use prompt templates.

You don't need to read the full library first. This guide will show you which frameworks matter most for your work, how they work, and give you examples you can copy and start using today.

**This guide assumes:**
- You've never used Claude, ChatGPT, or any AI assistant before
- You don't write code and don't plan to
- You want practical results, not a technology lecture

---

## Part 1: What You Need to Know About Claude (5 Minutes)

### What Claude Actually Is

Think of Claude as an extremely well-read assistant who can write, analyze, summarize, brainstorm, and organize — but who needs clear instructions to do any of those things well.

**What Claude is good at:**
- Writing drafts (emails, reports, proposals, presentations)
- Summarizing long documents
- Analyzing data you paste in
- Brainstorming ideas and options
- Reorganizing messy information into clean structures
- Answering questions about topics it's been trained on

**What Claude cannot do:**
- Browse the internet in real time (unless web search is enabled)
- Remember previous conversations (unless Memory is on)
- Access your company's systems, email, or files directly
- Generate images or photos
- Make decisions for you — it provides options, you decide

**What Claude should never receive:**
- Passwords or login credentials
- Social Security numbers, credit card numbers, or bank accounts
- Client data that's covered by an NDA (unless your company's AI policy allows it)
- Medical records, legal case details, or financial account numbers — unless you've confirmed this is permitted

> **Rule of thumb:** If you'd be uncomfortable seeing the information on a billboard, don't paste it into Claude.

### Why "How You Ask" Matters

Here's the difference between a vague prompt and a structured one:

**Vague prompt:**
> "Write me an email about the project update."

What Claude hears: *Write some kind of email about some kind of project. I'll guess the tone, length, audience, and content.*

**Structured prompt (using CO-STAR):**
> "Write a project status email. **Context:** Our CRM migration is 2 weeks ahead of schedule. We completed data mapping this week. **Objective:** Update the steering committee and request budget approval for Phase 2. **Style:** Professional but not stiff. **Tone:** Confident and forward-looking. **Audience:** VP Operations and CFO — they care about timeline and cost, not technical details. **Response:** Under 200 words, with a clear ask in the last paragraph."

The second prompt takes 60 seconds more to write and saves you 15 minutes of revision because Claude gets it right the first time.

**That's what the frameworks do — they give you a repeatable structure so Claude understands exactly what you need.**

---

## Part 2: The 5 Frameworks That Cover 90% of Your Work

The full library has 15 frameworks. You don't need all of them. Start with these five — they cover most of what a non-technical professional does.

### Framework 1: CO-STAR (Your Daily Driver)

**Best for:** Emails, announcements, messages, pitches, social posts — anything where *how it sounds* matters as much as *what it says*.

**The acronym:**
- **C**ontext — What's the situation?
- **O**bjective — What should this accomplish?
- **S**tyle — Formal? Casual? Technical? Narrative?
- **T**one — Confident? Empathetic? Urgent? Celebratory?
- **A**udience — Who reads this? What do they care about?
- **R**esponse — How long? What format? What channel?

**When to reach for CO-STAR:** You're writing something that another human will read, and the tone/audience matters.

#### Example: Writing a Client Thank-You Email

> **Context:** We just completed a 6-month ERP implementation for Meridian Manufacturing. The project came in on budget and 2 weeks early. The client's IT Director, Sarah Chen, was our main contact and went above and beyond coordinating on their side.
>
> **Objective:** Thank Sarah personally and plant the seed for a Phase 2 conversation about their warehouse management system, without being salesy.
>
> **Style:** Warm and professional. Not a form letter — this should feel personal.
>
> **Tone:** Genuinely grateful, not performatively grateful. Peer-to-peer, not vendor-to-client.
>
> **Audience:** Sarah Chen, IT Director. She's pragmatic, values efficiency, and hates fluff. She's also the internal champion who got the project approved.
>
> **Response:** Email, under 150 words. Subject line included. End with a soft open for the next conversation, not a pitch.

**Why this works:** Claude knows exactly who the reader is, how to sound, how long to write, and what the email needs to accomplish. No guessing.

---

### Framework 2: RCTF (Your Report Builder)

**Best for:** Reports, strategies, analyses, proposals, plans — anything with structure and substance where Claude has room to think and organize.

**The acronym:**
- **R**ole — Who should Claude pretend to be?
- **C**ontext — What's the situation? What does Claude need to know?
- **T**ask — What exactly should Claude produce?
- **F**ormat — How should it be structured? How long?

**When to reach for RCTF:** You need a document, not a message. Something with sections, analysis, or recommendations.

#### Example: Preparing a Competitive Analysis

> **Role:** You are a business analyst with expertise in the managed IT services industry.
>
> **Context:** Our company (200 employees, $18M revenue) is losing deals to two competitors who are marketing "AI-powered IT support." We don't know what that means in practice — whether it's genuine or just marketing. Our sales team needs to understand what competitors are actually offering so they can position against it. The competitors are: TechForce Solutions (300 employees, regional) and CloudFirst Partners (150 employees, national).
>
> **Task:** Write a competitive intelligence summary that covers: (1) What "AI-powered IT support" likely means in practice for each competitor, (2) What's genuinely valuable vs. marketing buzz, (3) Three talking points our sales team can use when prospects bring up AI, (4) Two areas where we should invest to close the gap.
>
> **Format:** 1,000–1,200 words. Start with a 3-sentence executive summary. Use a comparison table for the two competitors. End with the talking points as a numbered list.

---

### Framework 3: RISEN (Your Procedure Writer)

**Best for:** Step-by-step guides, checklists, onboarding procedures, how-to documents — anything where the reader needs to follow instructions in order.

**The acronym:**
- **R**ole — Who's writing this?
- **I**nstructions — What's the goal?
- **S**teps — The step-by-step procedure
- **E**nd-state — What "done" looks like
- **N**arrowing — What's out of scope

**When to reach for RISEN:** The output is a procedure someone follows. If steps are out of order, things go wrong.

#### Example: Writing an Onboarding Checklist

> **Role:** You are an onboarding coordinator for a 150-person professional services firm.
>
> **Instructions:** Create a new-hire onboarding checklist that an HR coordinator follows from the day an offer is accepted through the employee's 30th day. This replaces our current ad-hoc process where things get missed.
>
> **Steps:**
> 1. Offer acceptance → IT equipment order and account provisioning
> 2. Day -3: Confirm start date, send welcome packet, schedule orientation meetings
> 3. Day 1: Building access, equipment setup, mandatory training enrollment
> 4. Week 1: Team introductions, tool access verification, first 1:1 with manager
> 5. Week 2–4: Role-specific training, mentor assignment, 30-day check-in scheduling
>
> **End-state:** By day 30, the new hire has: all systems access working, completed mandatory training, met their team and key stakeholders, and had their first 1:1 with their manager. The HR coordinator has a completed checklist filed in the employee's record.
>
> **Narrowing:** This is for full-time employees only (contractors have a separate process). Does not cover benefits enrollment (that's a separate HR workflow). Assumes US-based employees.

---

### Framework 4: SCQA (Your Persuasion Tool)

**Best for:** Budget requests, change proposals, investment memos, business cases — anything where you need to convince someone to approve something.

**The acronym:**
- **S**ituation — What everyone agrees is true right now
- **C**omplication — What changed or what's at risk
- **Q**uestion — The strategic question this raises
- **A**nswer — Your recommendation

**When to reach for SCQA:** You need buy-in from a decision-maker. The structure builds a logical case before presenting your ask.

#### Example: Requesting a Training Budget

> **Situation:** Our team of 8 client managers handles 120 active accounts. Client satisfaction has been steady at 4.1/5 for the past 6 quarters. Our retention rate is 91%, which is slightly above industry average.
>
> **Complication:** Three of our top competitors announced AI-powered client service features in the last 90 days. We've had 4 prospects in the last month ask "Do you use AI?" during sales calls — our reps had no good answer. Meanwhile, 5 of our 8 client managers report spending 40%+ of their time on tasks that could be automated (report generation, status updates, data consolidation). If we don't upskill, we'll lose competitive positioning within 2–3 quarters.
>
> **Question:** How do we equip our client-facing team to use AI tools effectively — fast enough to maintain competitive positioning but carefully enough to protect client relationships and data?
>
> **Answer:** Invest $14,500 in a structured AI enablement program: $6,000 for Claude Team plan (12 months), $5,000 for a 2-day workshop with hands-on training, and $3,500 for developing 20 client-approved prompt templates. Expected ROI: each client manager saves 8–10 hours/month on routine tasks, freeing capacity equivalent to hiring one additional person without the headcount. Timeline: pilot with 3 managers in month 1, full team by month 3.

---

### Framework 5: Pyramid (Your Executive Summary Tool)

**Best for:** Board updates, leadership emails, status summaries — anything where the reader wants the answer immediately and will only read the detail if they choose to.

**How it works:** Lead with the conclusion. Then support it. The opposite of a suspense novel.

**When to reach for Pyramid:** Your reader is a senior leader with 2 minutes. If they read only the first paragraph, they should have the full picture.

#### Example: Monthly Business Update to the CEO

> **Conclusion:** Revenue is on track ($1.52M actual vs. $1.48M target), but client satisfaction dropped for the second consecutive month (4.1 → 3.8) driven by delayed response times in the support team. Recommendation: approve the emergency hire for one additional support specialist before the Q3 contract renewals begin.
>
> **Supporting argument 1:** Support ticket volume is up 23% since January due to three new enterprise clients onboarding simultaneously. Average first-response time has increased from 2.1 hours to 4.7 hours.
>
> **Supporting argument 2:** The 3 enterprise clients represent $340K in annual revenue and are in their first 90 days. First impressions are being set now. Two have already mentioned response times in their check-in calls.
>
> **Supporting argument 3:** The cost of one support specialist ($65K loaded) is less than 20% of the revenue at risk if one enterprise client churns. The hire pays for itself if it prevents a single loss.
>
> **Format:** Start with the conclusion paragraph. Each supporting point is one short paragraph. No more than 400 words total.

---

## Part 3: How to Pick the Right Framework

**Ask yourself one question: What am I creating?**

| If you're creating... | Use this framework |
|----------------------|-------------------|
| An email, message, or announcement | **CO-STAR** |
| A report, analysis, or proposal | **RCTF** |
| A step-by-step procedure or checklist | **RISEN** |
| A pitch, budget request, or business case | **SCQA** |
| An executive summary or status update | **Pyramid** |

If you're not sure, start with **CO-STAR** for short pieces or **RCTF** for long ones. You can't go wrong with either.

---

## Part 4: 10 Things That Trip Up First-Time Users

1. **Being too vague.** "Make it good" tells Claude nothing. "Make it under 200 words, in a professional tone, for a VP audience" tells Claude everything.

2. **Not saying who the audience is.** Claude writes differently for a CEO than for a new intern. If you don't specify, it picks a generic middle ground that satisfies nobody.

3. **Pasting an entire document and saying "summarize this."** Instead: "Summarize this document in 5 bullet points. Each bullet should be one sentence. Focus on the financial implications. The reader is our CFO who hasn't read the full report."

4. **Expecting Claude to know your company.** Claude doesn't know your org chart, your clients, your products, or your internal jargon. You need to provide that context every time (or set up a Project with persistent instructions).

5. **Not specifying length.** Without a length constraint, Claude tends to write long. Always specify: "Under 200 words," "3-5 sentences," or "One page maximum."

6. **Treating the first draft as final.** Claude's first response is a draft. It's normal to say: "Good start. Make it shorter," or "The second paragraph is too formal — make it conversational," or "Add a specific example in section 3."

7. **Being afraid to say "no."** If Claude produces something you don't like, say so directly: "This isn't what I wanted. Here's what I actually need..." Claude doesn't have feelings. Be direct.

8. **Putting sensitive data in when you shouldn't.** Check your company's AI policy before pasting in client data, financial information, or anything covered by an NDA.

9. **Not using Projects for recurring work.** If you do the same kind of task every week (status reports, client summaries, meeting notes), set up a Claude Project with custom instructions. Claude will remember your preferences.

10. **Thinking AI replaces your judgment.** Claude generates options. You decide which one is right. You are the expert on your work — Claude is the fast drafter.

---

## Part 5: Your First Week with Claude

### Day 1: Try CO-STAR
Write one email you'd normally spend 10 minutes on. Use the CO-STAR framework. Compare the result to what you'd have written. Edit as needed.

### Day 2: Try RCTF
Take a document you've been procrastinating on (a report, a proposal, a project summary). Use the RCTF framework. Give Claude the role, context, specific task, and format. See how close the first draft gets.

### Day 3: Try Iteration
Take yesterday's RCTF output and refine it. Tell Claude: "Make section 2 shorter," "Add a table comparing Option A and B," "Change the tone to be more direct." Practice the back-and-forth.

### Day 4: Try RISEN
Write a procedure you've been meaning to document. Use the RISEN framework. Focus on the Steps and End-state — Claude will fill in the details.

### Day 5: Review and Reflect
Look at what you produced this week. Ask yourself:
- What took less time with Claude?
- Where did Claude get it right on the first try?
- Where did you need 2-3 revisions?
- What will you use Claude for next week?

---

## Part 6: Quick Reference Card

### Your 5 Core Frameworks

| Framework | Remember It As | Use When |
|-----------|---------------|----------|
| **CO-STAR** | "Communication composer" | Writing emails, messages, pitches |
| **RCTF** | "Report builder" | Writing documents, analyses, proposals |
| **RISEN** | "Procedure writer" | Writing step-by-step guides, checklists |
| **SCQA** | "Persuasion builder" | Making business cases, budget requests |
| **Pyramid** | "Executive summary" | Updating leadership, board memos |

### Your 4 Rules

1. **Always say who the audience is**
2. **Always specify the length**
3. **Always provide context — Claude doesn't know your company**
4. **Always review the output — you're the expert, Claude is the drafter**

### When Something Goes Wrong

| Problem | Fix |
|---------|-----|
| Output is too long | Add: "Maximum [X] words" |
| Output is too generic | Add more context about your specific situation |
| Tone is wrong | Add: "Style: [casual/formal/technical]. Tone: [confident/empathetic/urgent]" |
| Claude invented facts | Add: "Only use information I've provided. If you're unsure, say so." |
| Output doesn't match what you wanted | Be more specific about the task. Show an example of what "good" looks like. |

---

## Glossary (Terms You'll See in the Full Library)

| Term | What It Means |
|------|---------------|
| **Prompt** | The instructions you type to Claude |
| **Framework** | A reusable structure for writing good prompts |
| **Context** | Background information Claude needs to do the job |
| **Guardrails** | Rules that prevent Claude from including sensitive information or going off-track |
| **Artifact** | Something Claude creates that appears in a side panel (documents, code, diagrams) |
| **Project** | A Claude workspace with persistent instructions and uploaded files |
| **Memory** | Claude's ability to remember your preferences across conversations |
| **Iteration** | Refining Claude's output through follow-up instructions |
| **XML tags** | Structural markers in prompts (like `<context>` and `<task>`) — you'll see these in the technical library but don't need to use them yourself |

---

*End of Non-Technical Guide. For the full 150-prompt library with all 15 frameworks, see: Top 15 Prompting Frameworks v2.0*
