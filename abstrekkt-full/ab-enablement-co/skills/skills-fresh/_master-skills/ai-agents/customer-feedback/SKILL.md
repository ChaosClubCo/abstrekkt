---
name: customer-feedback
description: Collect, analyze, and act on customer feedback through surveys, NPS programs, sentiment analysis, feedback loops, and voice-of-customer reporting. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Customer Feedback

## Overview

Customer feedback is the structured discipline of capturing what customers think, feel, and need -- then converting those signals into measurable actions that improve retention, product quality, and revenue. Without a systematic feedback program, product decisions rely on assumptions, churn signals go undetected, and the gap between what you build and what customers actually need widens quarter over quarter.

An effective feedback program operates at three layers: collection (getting the right question to the right customer at the right moment), analysis (transforming unstructured responses into categorized, scored, and trended insights), and action (routing findings to owners, tracking resolution, and communicating outcomes back to the customer). This skill covers all three layers with concrete processes, benchmarks, and integration patterns for AI agent workflows.

### Why This Matters

Organizations that operationalize customer feedback consistently outperform those that treat it as an ad hoc exercise. The following benchmarks illustrate the impact:

- Companies with closed-loop feedback programs see **15-25% higher retention rates** compared to those that collect feedback without follow-up.
- Detractor follow-up within 48 hours recovers **30-50% of at-risk accounts** that would otherwise churn within 90 days.
- Teams using structured voice-of-customer data to inform roadmap decisions report **2x faster product-market fit** for new features.
- Post-support CSAT surveys with response rates above 25% provide statistically reliable data; programs below 10% response rates produce misleading signals that can drive wrong decisions.
- NPS improvements of 10-15 points correlate with **20-30% growth in organic referrals** over a 12-month period.
- Reducing customer effort (CES) by one point on a 7-point scale corresponds to a **12-18% decrease in support ticket volume** for the associated workflow.

## When to Use

### Primary Triggers

- A new product or feature is launching and you need baseline satisfaction data.
- Customer churn is increasing or retention metrics are declining without clear explanation.
- Support ticket volume is rising in a specific category and you need to understand root cause.
- Stakeholders are requesting voice-of-customer data to inform roadmap decisions.
- An existing feedback program has gone stale with declining response rates or no closed-loop process.
- You are building or configuring an AI agent that must react to customer sentiment in real time.

### Specific Use Cases

- **Post-interaction surveys**: Trigger a CSAT or CES survey after a support ticket is resolved, an onboarding session ends, or a key workflow is completed.
- **Relationship NPS programs**: Run quarterly or semi-annual NPS campaigns across the full customer base to track loyalty trends over time.
- **In-app micro-surveys**: Deploy single-question prompts inside the product to capture contextual feedback at the moment of experience.
- **Churn and cancellation analysis**: Present a structured exit survey when a customer downgrades or cancels, feeding responses into a retention pipeline.
- **Feature request aggregation**: Collect, deduplicate, and rank feature requests from support, sales, community, and surveys into a single prioritized backlog.
- **Sentiment monitoring**: Continuously analyze open-text feedback, social mentions, and review-site content to detect emerging themes and sentiment shifts before they become crises.

## Core Workflow

### 1. Feedback Collection Strategy

Before designing any survey, define the decision each data point will inform. Work backward from business objectives to select channels, audiences, and timing.

**Key decisions:**

| Decision | Options | Guidance |
|----------|---------|----------|
| Channel | Email, in-app, SMS, phone, chat | Use the channel the customer is already active in. In-app yields 2-3x higher response rates than email alone. |
| Timing | Immediate, delayed (1-24 hrs), scheduled | Post-support: within 1 hour. Post-onboarding: 24-48 hours. Relationship NPS: stagger across the quarter. |
| Audience | All customers, segment-based, event-triggered | Event-triggered surveys reduce selection bias. Avoid voluntary opt-in for core metrics. |
| Throttling | Per-customer frequency cap | No customer should receive more than one survey per 30 days across all programs. |

### 2. Survey Design and Distribution

Every survey should be as short as possible while still producing actionable data. Lead with a quantitative question so you get a scoreable metric even if the respondent drops off before the open-text field.

1. **Transactional surveys** (CSAT, CES): Limit to 1-3 questions. Include one numeric scale and one optional open-text field.
2. **Relationship surveys** (NPS): Cap at 3-5 questions. Lead with the NPS question, follow with a "why" open-text, then add 1-2 targeted questions.
3. **Research surveys**: Cap at 10 questions. Use branching logic to keep the effective length short for each respondent.
4. Use consistent scales across all surveys: 1-5 for CSAT, 0-10 for NPS, 1-7 for CES.
5. Avoid leading or double-barreled questions. Pilot every new survey with 5-10 real customers before broad launch.
6. Randomize answer order for multiple-choice questions to reduce order bias.

### 3. Sentiment Analysis and Categorization

Sentiment analysis converts open-text feedback into structured data that can be trended, filtered, and routed. A typical pipeline has four stages.

1. **Ingestion**: Collect text from survey responses, support tickets, app reviews, social mentions, and community posts into a unified queue.
2. **Preprocessing**: Normalize text (lowercase, strip HTML, redact PII, tokenize). Filter out responses below a minimum token count of 3.
3. **Classification**: Apply a sentiment model (positive, negative, neutral) and a topic model to each response. Use a confidence threshold of 0.70 or higher. Standard topic labels include billing, onboarding, performance, usability, documentation, reliability, pricing, and integrations.
4. **Output and alerting**: Write scored records to a data warehouse. Configure alert rules so that negative-sentiment reliability feedback triggers incident-channel notifications and detractor scores automatically create follow-up tickets.

**Categorization taxonomy:**

| Category | Examples | Primary Owner |
|----------|----------|---------------|
| Product | Feature requests, bugs, usability, performance | Product Manager |
| Support | Agent quality, resolution time, channel preference | Support Team Lead |
| Billing | Pricing concerns, invoice errors, refund requests | Billing Operations |
| Onboarding | Setup difficulty, documentation gaps, time-to-value | Customer Success |
| General | Praise, competitive comparisons, unrelated | Marketing / CS |

### 4. NPS and Satisfaction Programs

Each metric serves a different purpose. Use them in combination, not as substitutes.

| Metric | Question | Scale | Target Benchmark | Best For |
|--------|----------|-------|------------------|----------|
| NPS | "How likely are you to recommend us?" | 0-10 | > 40 (B2B SaaS) | Overall loyalty and advocacy trends |
| CSAT | "How satisfied were you with this experience?" | 1-5 | >= 4.2 | Transactional satisfaction after interactions |
| CES | "How easy was it to accomplish your goal?" | 1-7 | >= 5.5 | Identifying friction in specific workflows |

**NPS segmentation and actions:**

- **Promoters (9-10)**: Target for case studies, referrals, beta programs, and public reviews.
- **Passives (7-8)**: Investigate what would move them to Promoter status. Small improvements often convert this group.
- **Detractors (0-6)**: Trigger immediate outreach from the assigned CSM or account manager within 48 hours.

**Program cadence:**

- Relationship NPS: quarterly for enterprise, semi-annually for SMB.
- Transactional CSAT/CES: continuously, triggered by events.
- Aggregate score review: monthly with stakeholders. Individual detractor review: within 48 hours.

### 5. Closed-Loop Feedback Process

Closing the loop means following up with the customer who gave feedback to acknowledge their input, communicate what action was taken, and confirm the outcome. This single practice has a disproportionate impact on retention and future response rates.

1. **Acknowledge** (within 24-48 hours): Send a personalized response confirming receipt and review.
2. **Investigate**: Route to the appropriate team, create a tracking ticket, set an internal SLA.
3. **Act**: Implement a fix, adjust a process, add a request to the roadmap, or document why no action will be taken.
4. **Communicate**: Reach back out with the outcome. A "we decided not to pursue this because..." response is better than silence.
5. **Measure**: Track closed-loop completion rate (target >= 85% for detractors), time-to-close (target < 48 hours), and whether the customer's subsequent scores improve.

### 6. Reporting and Insights

Feedback data is only valuable if it reaches decision-makers in a consumable format on a reliable cadence.

| Report | Audience | Cadence | Contents |
|--------|----------|---------|----------|
| Executive VoC Summary | Leadership | Monthly | NPS/CSAT trends, top 5 themes by volume, closed-loop completion rate, action rate |
| Product Feedback Digest | Product & Engineering | Bi-weekly | Feature request rankings, bug-related sentiment, usability themes |
| Support Quality Report | Support Leadership | Weekly | CSAT by agent/team, CES trends, top complaint categories |
| Detractor Alert Dashboard | Customer Success | Real-time | Open detractor cases, SLA compliance, escalation status |

**Key program-level KPIs:**

- Response rate: >= 25% for email, >= 15% for in-app.
- Closed-loop completion: >= 85% of detractor responses.
- Action rate: >= 60% of feedback items result in a tracked action.
- Categorization accuracy: >= 85% of auto-categorized feedback confirmed by human review.
- Time to close loop: < 48 hours for detractors, < 5 business days for all other feedback.

## Tools and Templates

| Tool | Best For | Survey Types | Key Strength | Pricing Tier |
|------|----------|--------------|--------------|--------------|
| Delighted | NPS/CSAT/CES at scale | NPS, CSAT, CES | Autopilot mode with smart throttling and multi-channel delivery | Mid |
| Typeform | Engaging conversational surveys | CSAT, general research | High completion rates due to one-question-at-a-time UX | Mid |
| Qualtrics | Enterprise CX and research programs | All types | Advanced branching logic, statistical analysis, industry benchmarks | Enterprise |
| Medallia | Enterprise voice-of-customer programs | All types | Text analytics, action management, and cross-channel orchestration | Enterprise |
| Hotjar | In-app and website feedback | On-site polls, heatmaps | Visual behavior data alongside survey responses for context | Low-Mid |
| SurveyMonkey | General-purpose surveys | All types | Broad template library, easy setup, wide integration ecosystem | Low-Mid |
| Retently | B2B NPS automation | NPS, CSAT, CES | CRM-native workflows with automatic follow-up sequences | Mid |

## Common Pitfalls

### 1. Survey Fatigue

**Problem**: Sending too many surveys or surveying the same customers repeatedly drives response rates below 10%, producing unrepresentative data and customer irritation.

**Prevention**: Implement global throttling (one survey per customer per 30 days across all programs). Use a centralized survey calendar. Track response rates weekly and reduce frequency at the first sign of decline.

### 2. Collecting Without Acting

**Problem**: Feedback is gathered diligently but never reaches decision-makers, is not tracked for follow-up, or sits in a dashboard no one reviews. Customers who gave feedback and saw no change stop responding and eventually churn.

**Prevention**: Assign every feedback category an explicit owner with an SLA. Report closed-loop completion rates alongside NPS and CSAT in executive reviews. Make "action rate" a top-level program KPI with a target of 60% or higher.

### 3. Ignoring Qualitative Context

**Problem**: Teams focus exclusively on numeric scores and ignore the open-text comments that explain why scores are what they are. A score tells you the temperature; the comment tells you the diagnosis.

**Prevention**: Build sentiment analysis and topic extraction into your pipeline so open-text responses are surfaced alongside quantitative data. Require that any score-based report includes a summary of the top themes from comments.

### 4. Selection Bias in Survey Distribution

**Problem**: Only highly satisfied or highly dissatisfied customers respond, producing a bimodal distribution that misrepresents the silent majority. This is especially common with email-only, voluntary opt-in surveys.

**Prevention**: Use event-triggered surveys delivered through the channel the customer is already active in. Supplement survey data with behavioral signals (support ticket sentiment, product usage patterns, churn indicators) to fill the gaps left by non-respondents.

## Integration Points

- **Customer Support**: Trigger post-resolution CSAT/CES surveys from the ticketing system. Feed negative responses back as follow-up tickets. Surface recent feedback scores in the agent interface for context.
- **Product Management**: Aggregate feature requests into a weighted backlog. Use topic trends from sentiment analysis to validate roadmap priorities. Share quarterly VoC reports highlighting the top five themes by volume.
- **CRM and Account Management**: Sync NPS scores to the CRM so account managers see loyalty data alongside revenue. Trigger automated workflows when a high-value account submits a detractor score. Use feedback trends as leading indicators in health scoring -- declining CSAT often precedes churn by 60-90 days.
- **Marketing**: Identify promoters for case studies, testimonials, and referral programs. Use aggregated themes to inform messaging and content priorities. Monitor review-site sentiment as part of the broader pipeline.
- **AI Agent Workflows**: Configure agent nodes to ingest real-time feedback webhooks, classify sentiment on the fly, and trigger conditional branching (escalation, follow-up scheduling, or proactive outreach) based on score thresholds and topic categories.
