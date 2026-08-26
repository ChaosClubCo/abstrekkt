---
name: lead-generation
description: Build and optimize lead generation pipelines including prospect identification, scoring models, outreach automation, landing page optimization, and conversion funnel analytics. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Lead Generation

## Overview

Lead generation is the systematic process of identifying, attracting, and converting strangers and prospects into individuals who have expressed interest in a product or service. In the context of AI agent workflows, lead generation pipelines combine data enrichment, behavioral scoring, automated outreach, and continuous optimization to produce a repeatable engine for revenue growth.

Effective lead generation goes far beyond collecting email addresses. It requires aligning marketing and sales around a shared definition of a qualified lead, building scoring models that surface the highest-intent prospects first, and designing multi-touch outreach sequences that nurture contacts through the funnel without burning goodwill. When done well, it shortens sales cycles, reduces customer acquisition cost, and gives revenue teams predictable pipeline coverage.

This skill covers the end-to-end pipeline: from initial prospect identification and data enrichment through scoring, outreach, landing page conversion, and handoff to sales. Each section provides frameworks, configuration examples, and measurable benchmarks so that an AI agent can assist at every stage of the process.

## When to Use

### Primary Triggers

- A new product, feature, or market segment needs a sourced pipeline of qualified prospects.
- Existing inbound volume is insufficient to meet revenue targets.
- Sales teams report low lead quality or excessive time spent on unqualified contacts.
- Marketing-to-sales handoff is poorly defined, causing leads to slip through the cracks.
- Leadership requests forecasting or visibility into top-of-funnel health.

### Specific Use Cases

- **Greenfield market entry** -- Building an ideal customer profile (ICP) and sourcing a target account list for a new vertical.
- **Outbound campaign launch** -- Designing a multi-channel outreach sequence with email, LinkedIn, and phone touchpoints.
- **Scoring model calibration** -- Tuning lead score weights after a quarter of conversion data has accumulated.
- **Landing page A/B testing** -- Optimizing form length, headline copy, and CTA placement to improve conversion rate.
- **Funnel diagnostics** -- Identifying the stage where leads stall and recommending interventions.
- **CRM hygiene and enrichment** -- Deduplicating records, filling missing firmographic fields, and re-scoring stale leads.

## Core Processes

### 1. Lead Scoring Models

Lead scoring assigns a numeric value to each prospect based on fit (firmographic and demographic attributes) and engagement (behavioral signals). A well-tuned model lets sales focus on the leads most likely to convert.

**Fit scoring** evaluates how closely a prospect matches your ICP. Common attributes include company size, industry, job title seniority, technology stack, and geography.

**Engagement scoring** tracks actions that signal buying intent: website visits, content downloads, email opens and clicks, webinar attendance, and pricing page views.

Below is a sample JSON configuration for a composite scoring model:

```json
{
  "scoring_model": {
    "version": "2.1",
    "fit_score": {
      "max_points": 50,
      "attributes": [
        { "field": "employee_count", "range": [200, 5000], "points": 15 },
        { "field": "industry", "values": ["SaaS", "FinTech", "HealthTech"], "points": 12 },
        { "field": "title_seniority", "values": ["VP", "Director", "C-Suite"], "points": 13 },
        { "field": "region", "values": ["US", "CA", "UK", "DE"], "points": 10 }
      ]
    },
    "engagement_score": {
      "max_points": 50,
      "signals": [
        { "event": "pricing_page_view", "points": 10, "decay_days": 14 },
        { "event": "demo_request", "points": 20, "decay_days": 30 },
        { "event": "content_download", "points": 5, "decay_days": 21 },
        { "event": "email_reply", "points": 8, "decay_days": 14 },
        { "event": "webinar_attended", "points": 7, "decay_days": 30 }
      ]
    },
    "thresholds": {
      "MQL": 40,
      "SQL": 65,
      "hot_lead": 80
    },
    "webhook": {
      "url": "https://hooks.example.com/lead-score-update",
      "events": ["score_change", "threshold_crossed"],
      "headers": { "Authorization": "Bearer ${WEBHOOK_SECRET}" }
    }
  }
}
```

Key implementation notes:

- Apply **time decay** so that stale engagement does not inflate scores.
- Re-calibrate weights quarterly by comparing scores against actual closed-won data.
- Separate fit and engagement into two visible dimensions so sales can distinguish "right company, low activity" from "wrong company, high activity."

### 2. Prospecting and Research Automation

Prospecting is the act of identifying and enriching potential buyers before any outreach occurs. Automation dramatically increases throughput while keeping data quality high.

**Step-by-step workflow:**

1. **Define ICP criteria** -- Document firmographic, technographic, and intent filters.
2. **Source target accounts** -- Pull accounts from databases such as Apollo.io, ZoomInfo, or LinkedIn Sales Navigator.
3. **Enrich contacts** -- Append verified email, phone, LinkedIn URL, tech stack, and recent funding data.
4. **Deduplicate against CRM** -- Match on email domain and contact name to avoid contacting existing customers or active opportunities.
5. **Segment into tiers** -- Assign Tier 1 (high fit plus intent signals), Tier 2 (high fit, no intent), and Tier 3 (moderate fit) for differentiated outreach.

Automation tools can execute steps 2 through 5 with minimal manual intervention when configured with the ICP criteria from step 1.

### 3. Outreach Sequence Design

A well-structured outreach sequence balances persistence with respect for the prospect's time. The goal is to earn a reply, not to exhaust a contact list.

**Recommended multi-channel sequence (Tier 1 accounts):**

| Day | Channel  | Action                                                  |
|-----|----------|---------------------------------------------------------|
| 1   | Email    | Personalized intro referencing a trigger event          |
| 2   | LinkedIn | Connection request with a short note                    |
| 4   | Email    | Follow-up sharing a relevant case study                 |
| 7   | Phone    | Brief discovery call attempt                            |
| 9   | LinkedIn | Engage with prospect's recent post                      |
| 12  | Email    | Value-add content (report, benchmark, tool)             |
| 16  | Email    | Breakup email offering to reconnect later               |

**Best practices:**

- Personalize at least the first two sentences of every email by referencing the prospect's company, role, or a recent event.
- Keep subject lines under 50 characters and avoid spam-trigger words.
- Throttle sending volume to protect domain reputation. Ramp new domains starting at 20 emails per day, increasing by 10-20% each week.
- Track reply sentiment (positive, objection, unsubscribe) to refine messaging.

### 4. Landing Page Optimization

Landing pages are where inbound interest converts into a capturable lead. Optimization focuses on reducing friction and increasing perceived value.

**Core elements of a high-converting landing page:**

- **Headline** -- Communicate the primary benefit in under 10 words.
- **Subheadline** -- Provide supporting detail or social proof.
- **Hero image or video** -- Show the product in use or illustrate the outcome.
- **Form** -- Ask for the minimum fields needed to qualify and route the lead (name, work email, company, role). Every additional field reduces conversion rate by roughly 4-7%.
- **CTA button** -- Use action-oriented text ("Get the Report," "Start Free Trial") rather than generic labels ("Submit").
- **Trust signals** -- Logos of known customers, security badges, testimonial quotes.

**Testing priorities (ordered by typical impact):**

1. Headline and value proposition copy.
2. Number of form fields.
3. CTA button text and color.
4. Page layout and content length.
5. Social proof placement.

Run A/B tests with a minimum sample size calculator to ensure statistical significance before declaring a winner.

### 5. Lead Qualification Frameworks

Qualification frameworks provide a shared vocabulary between marketing and sales for evaluating whether a lead is ready for a sales conversation.

**BANT (Budget, Authority, Need, Timeline):**

- **Budget** -- Does the prospect have allocated or allocable budget?
- **Authority** -- Is this person the decision-maker or a key influencer?
- **Need** -- Does the prospect have a clearly articulated problem your product solves?
- **Timeline** -- Is there urgency or a defined evaluation period?

**MEDDIC (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion):**

- **Metrics** -- What quantifiable outcomes does the buyer expect?
- **Economic Buyer** -- Who has final spending authority?
- **Decision Criteria** -- What technical and business requirements must be met?
- **Decision Process** -- What stages, stakeholders, and approvals are involved?
- **Identify Pain** -- What specific pain drives the initiative?
- **Champion** -- Who inside the account is actively advocating for your solution?

BANT is best suited for transactional or mid-market sales. MEDDIC excels in complex enterprise deals with long sales cycles and multiple stakeholders.

### 6. Lead Nurture Sequences

Not every lead is ready to buy today. Nurture sequences keep your brand top-of-mind and progressively build trust until the prospect is sales-ready.

**Standard nurture cadence:**

1. **Welcome email** -- Deliver the promised lead magnet immediately.
2. **Educational content** -- Address the prospect's primary pain point with a how-to or guide.
3. **Social proof** -- Share a case study or customer testimonial relevant to their segment.
4. **Comparison or evaluation guide** -- Help the prospect build their buying criteria.
5. **Direct offer** -- Invite to a demo, trial, or consultation with a clear CTA.
6. **Breakup email** -- Final outreach before moving the contact to a long-term monthly drip.

Space emails 2-4 days apart for active sequences. Use behavioral triggers (e.g., pricing page visit, content download) to accelerate or branch the sequence dynamically.

## Tools and Templates

### Platform Comparison

| Platform                  | Primary Use                | Strengths                                          | Typical Cost       |
|---------------------------|----------------------------|----------------------------------------------------|---------------------|
| HubSpot                   | CRM, marketing automation  | All-in-one platform, strong free tier, workflows   | Free - $3,600/mo   |
| Salesforce                | CRM, pipeline management   | Deep customization, massive app ecosystem          | $25 - $300/user/mo |
| Apollo.io                 | Prospecting, enrichment    | Large B2B database, built-in email sequencing      | Free - $99/user/mo |
| LinkedIn Sales Navigator  | Social selling, research   | Real-time org charts, InMail credits, alerts       | $80 - $135/user/mo |
| Lemlist                   | Email outreach, sequences  | Image personalization, deliverability monitoring    | $59 - $99/user/mo  |

### Lead Scoring Rubric Template

Use this rubric as a starting point. Adjust weights based on historical conversion data after each quarterly review.

| Attribute / Signal             | Category    | Points | Notes                            |
|--------------------------------|-------------|--------|----------------------------------|
| Matches target industry        | Fit         | 12     | From ICP definition              |
| Employee count in range        | Fit         | 10     | e.g., 100-5,000 employees       |
| Director-level or above title  | Fit         | 10     | VP and C-level get max points    |
| Target geography               | Fit         | 8      | Primary sales markets only       |
| Uses complementary technology  | Fit         | 10     | From technographic data          |
| Visited pricing page           | Engagement  | 10     | Decay after 14 days             |
| Downloaded gated content       | Engagement  | 5      | Per asset, capped at 15 total   |
| Attended webinar or event      | Engagement  | 7      | Live attendance scores higher    |
| Replied to outreach email      | Engagement  | 8      | Positive sentiment only          |
| Requested a demo               | Engagement  | 20     | Strongest buying signal          |
| Visited careers page           | Negative    | -10    | Likely a job seeker              |
| No activity in 30+ days        | Decay       | -10    | Applied monthly                  |

**Threshold guide:** 0-39 = Nurture, 40-64 = MQL, 65-79 = SQL, 80+ = Hot Lead (immediate sales follow-up).

## Metrics and KPIs

Track these metrics weekly and report monthly trends to stakeholders.

| Metric                         | Definition                                                    | Target Benchmark          |
|--------------------------------|---------------------------------------------------------------|---------------------------|
| Marketing Qualified Leads (MQLs) | Leads meeting fit + engagement score threshold              | Volume varies by segment  |
| Sales Qualified Leads (SQLs)   | MQLs accepted by sales after initial qualification            | 30-40% of MQLs           |
| MQL-to-SQL Conversion Rate     | Percentage of MQLs that become SQLs                           | 30-40%                    |
| SQL-to-Opportunity Rate        | Percentage of SQLs that enter pipeline as opportunities       | 40-60%                    |
| Cost per Lead (CPL)            | Total campaign spend divided by leads generated               | Varies by channel         |
| Cost per MQL                   | Total spend divided by marketing qualified leads              | 1.5-3x CPL               |
| Lead Velocity Rate (LVR)      | Month-over-month percentage growth of qualified leads          | 10-15% MoM                |
| Time to Conversion             | Average days from first touch to MQL status                   | Under 30 days             |
| Pipeline Coverage Ratio        | Total pipeline value divided by revenue quota                 | 3-4x quota                |
| Outbound Email Reply Rate      | Positive replies divided by emails delivered                  | 5-15%                     |
| Landing Page Conversion Rate   | Form submissions divided by unique page visitors              | 10-25% for gated content  |

**Lead Velocity Rate** deserves special attention because it is a leading indicator of future revenue, unlike lagging metrics such as closed-won deals. A sustained decline in LVR signals pipeline problems well before they surface in bookings reports.

## Common Pitfalls

### 1. Scoring Model Set-and-Forget
**Problem:** Teams build a scoring model at launch and never revisit it. Over time, score distributions drift and the model stops distinguishing strong leads from weak ones.
**Prevention:** Schedule quarterly calibration reviews. Compare score distributions against actual conversion outcomes and adjust weights. Automate a monthly report that flags when the average score of converted leads diverges from the MQL threshold by more than 10 points.

### 2. Volume Over Quality
**Problem:** Marketing optimizes for total lead count to hit a KPI, flooding sales with low-quality contacts who never convert.
**Prevention:** Shift primary KPIs from raw lead volume to MQL-to-SQL conversion rate and pipeline contribution. Align marketing and sales incentives around shared revenue targets rather than vanity metrics.

### 3. Poor Handoff Between Marketing and Sales
**Problem:** MQLs sit in a queue for days, or sales receives leads with no context on what the prospect engaged with. Research shows leads contacted after 30 minutes convert at dramatically lower rates.
**Prevention:** Define a service-level agreement (SLA) requiring sales to attempt first contact within 4 business hours of MQL creation. Pass full engagement history (pages visited, content downloaded, emails opened) into the CRM record so reps have context before calling.

### 4. Domain Reputation Damage from Aggressive Outbound
**Problem:** Sending high volumes from a new or under-warmed domain triggers spam filters, tanking deliverability across all campaigns.
**Prevention:** Warm new domains gradually (start at 20 sends per day, increase by 10-20% weekly). Use dedicated sending domains separate from the corporate domain. Monitor bounce rate (keep under 3%) and spam complaint rate (keep under 0.1%).

### 5. Ignoring Negative Signals
**Problem:** Prospects who unsubscribe, bounce, or explicitly decline are re-entered into outreach sequences through list overlaps or CRM resets.
**Prevention:** Maintain a global suppression list checked before every campaign send. Sync unsubscribe events across all outreach tools in real time via webhook or native integration.

## Integration Points

### CRM Integration
Lead generation tools must sync bidirectionally with the CRM (HubSpot, Salesforce, or equivalent) so that every lead, engagement event, and status change is reflected in a single source of truth. Key integration actions:

- Push new leads and enrichment data from prospecting tools into the CRM.
- Pull lead status updates (contacted, qualified, disqualified) back into marketing automation to adjust nurture streams.
- Sync deal stage changes so that scoring models can train on downstream conversion outcomes.

### Email Marketing and Automation
Connect lead capture forms and scoring events to email automation workflows:

- New MQL creation triggers an automated alert to the assigned sales rep plus enrollment in the appropriate nurture sequence.
- Score threshold changes trigger movement between nurture tracks (e.g., educational content for low-score leads, case studies and comparison guides for mid-score leads).
- Unsubscribe and bounce events propagate to all connected systems immediately.

### Content Marketing
Lead generation depends on a steady supply of high-value content:

- Gated assets (whitepapers, benchmark reports, templates) serve as lead magnets on landing pages.
- Blog posts drive organic traffic to ungated content, which funnels visitors toward gated offers via in-content CTAs.
- Webinars and events generate engagement signals that feed directly into the scoring model.

### Analytics and Reporting
Centralize funnel data in a BI tool or dashboard to enable:

- **Attribution modeling** -- Understand which channels and campaigns drive the highest-quality leads.
- **Cohort analysis** -- Compare conversion rates across time periods, segments, and campaigns.
- **Forecasting** -- Use lead velocity rate and historical conversion ratios to project future pipeline and revenue.
