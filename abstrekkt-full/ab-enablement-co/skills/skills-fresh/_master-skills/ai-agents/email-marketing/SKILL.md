---
name: email-marketing
description: Design, automate, and optimize email marketing campaigns including list segmentation, A/B testing, drip sequences, deliverability optimization, and performance analytics. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Email Marketing

## Overview

Email marketing remains one of the highest-ROI channels in digital marketing, consistently returning $36-$42 for every $1 spent. Unlike social media or paid advertising, email gives you direct, owned access to your audience without algorithmic gatekeeping. A well-executed email program builds long-term customer relationships, nurtures leads through complex buying journeys, and drives repeatable revenue through automation.

Effective email marketing goes far beyond batch-and-blast newsletters. Modern programs rely on behavioral segmentation, dynamic content personalization, and multi-step automation sequences that deliver the right message at the right moment. The difference between a mediocre email program and a high-performing one lies in the systematic application of data-driven testing, list hygiene discipline, and deliverability best practices.

This skill covers the end-to-end lifecycle of email marketing: from building and segmenting subscriber lists, through designing and testing campaigns, to measuring results and iterating. Whether you are launching a first welcome sequence or optimizing a mature program with millions of subscribers, the frameworks here provide a structured approach to sustained improvement.

## When to Use

### Primary Triggers

- A business needs to establish or improve its email marketing channel
- Lead nurturing sequences must be designed for a sales funnel
- Campaign performance has plateaued and requires optimization
- Deliverability issues are causing emails to land in spam
- A new product launch or event requires a coordinated email campaign

### Specific Use Cases

- **E-commerce lifecycle emails**: Welcome series, abandoned cart recovery, post-purchase follow-up, win-back campaigns
- **B2B lead nurturing**: Educational drip sequences aligned to buyer journey stages
- **SaaS onboarding**: Activation sequences that drive users from signup to first value
- **Content distribution**: Newsletter programs that build audience engagement and authority
- **Event promotion**: Registration drives, reminder sequences, and post-event follow-up
- **Re-engagement campaigns**: Reactivating dormant subscribers before list pruning

## Core Processes

### 1. List Segmentation Strategies

Segmentation is the foundation of relevant email marketing. Sending the same message to your entire list wastes opportunity and damages engagement metrics.

**Segmentation dimensions:**

- **Demographic**: Age, location, job title, company size
- **Behavioral**: Purchase history, email engagement, website activity, content downloads
- **Lifecycle stage**: New subscriber, active lead, customer, at-risk, churned
- **Preference-based**: Self-reported interests, communication frequency preferences
- **RFM scoring**: Recency, Frequency, and Monetary value for e-commerce

**Example segmentation rules in JSON:**

```json
{
  "segment": "high-value-engaged",
  "description": "Customers who spent over $200 and opened an email in the last 30 days",
  "rules": {
    "operator": "AND",
    "conditions": [
      {
        "field": "total_lifetime_value",
        "operator": "greater_than",
        "value": 200
      },
      {
        "field": "last_email_open_date",
        "operator": "within_days",
        "value": 30
      },
      {
        "field": "subscription_status",
        "operator": "equals",
        "value": "active"
      }
    ]
  },
  "actions": {
    "tag": "vip-engaged",
    "enroll_in_sequence": "vip-exclusive-offers",
    "send_frequency": "2x_per_week"
  }
}
```

**Best practices:**

- Start with 3-5 core segments and expand as data accumulates
- Re-evaluate segment definitions quarterly based on performance data
- Always maintain a "catch-all" segment so no subscriber is forgotten
- Use progressive profiling to gather segmentation data over time rather than demanding it all at signup

### 2. Campaign Design & Copywriting

Every email must earn the open, earn the read, and earn the click. Design and copy work together to accomplish this.

**Subject line principles:**

- Keep subject lines under 50 characters for mobile compatibility
- Use specificity over cleverness ("Save 30% on running shoes" beats "You will love this deal")
- Create urgency without being manipulative (real deadlines, limited quantities)
- Personalize with merge fields where it adds genuine value, not as a gimmick

**Email body structure:**

1. **Hook** (first 1-2 lines): Connect to the reader's situation or pain point
2. **Value proposition**: What the reader gains by continuing to read
3. **Supporting content**: Proof, details, social proof, or storytelling
4. **Call to action**: One primary CTA per email, visually distinct
5. **Footer**: Unsubscribe link, physical address (CAN-SPAM compliance), preference center link

**Design guidelines:**

- Use a single-column layout for mobile responsiveness
- Keep email width at 600px maximum
- Maintain a text-to-image ratio of at least 60:40
- Include ALT text on all images
- Test rendering across Outlook, Gmail, Apple Mail, and Yahoo at minimum

### 3. A/B Testing Frameworks

Systematic testing separates opinion from evidence. Every campaign is a learning opportunity.

**What to test (in priority order):**

1. **Subject lines**: Highest impact, easiest to test
2. **Send time**: Day of week and time of day
3. **CTA text and placement**: Button copy, color, position
4. **Email length**: Short vs. long-form content
5. **Personalization depth**: Name-only vs. behavior-based dynamic content
6. **From name**: Company name vs. individual name

**Testing protocol:**

- Test one variable at a time to isolate impact
- Use a minimum sample size of 1,000 per variant for statistical significance
- Run tests for at least 4 hours before declaring a winner (account for time zone spread)
- Document every test hypothesis, result, and learning in a shared log
- Apply winning insights to future campaigns as new defaults

**Statistical rigor:**

- Target 95% confidence level before acting on results
- Calculate required sample size before launching the test
- Watch for novelty effects: a tactic that wins once may not win consistently

### 4. Drip & Nurture Sequence Architecture

Automated sequences do the heavy lifting of relationship building at scale. Well-designed sequences guide subscribers through a journey with timed, conditional logic.

**Core sequence types:**

| Sequence Type       | Trigger                  | Typical Length | Goal                                      |
|---------------------|--------------------------|----------------|--------------------------------------------|
| Welcome Series      | New subscriber signup    | 3-5 emails     | Introduce brand, set expectations          |
| Onboarding          | Account creation         | 5-7 emails     | Drive activation and first value           |
| Lead Nurture        | Content download         | 4-8 emails     | Move lead toward sales readiness           |
| Abandoned Cart      | Cart abandonment event   | 3 emails       | Recover the sale                           |
| Re-engagement       | 60-90 days of inactivity | 2-3 emails     | Reactivate or confirm opt-out              |
| Post-Purchase       | Order confirmation       | 3-4 emails     | Increase satisfaction and repeat purchase  |

**Sequence design principles:**

- Map each sequence to a clear goal and measurable outcome
- Space emails appropriately: 1-2 days apart for urgent sequences (abandoned cart), 3-5 days for educational nurture
- Include conditional branching: if a subscriber takes the desired action mid-sequence, exit them or route to the next sequence
- Write each email so it stands alone, since subscribers may miss earlier messages
- Set a maximum cadence cap so subscribers in multiple sequences are not overwhelmed

### 5. Deliverability & Sender Reputation Management

None of your work matters if emails land in spam. Deliverability is a technical and behavioral discipline.

**Technical foundations:**

- **SPF**: Publish a Sender Policy Framework record authorizing your sending IPs
- **DKIM**: Sign outbound emails with DomainKeys Identified Mail using 2048-bit keys
- **DMARC**: Set a DMARC policy (start with p=none, progress to p=quarantine, then p=reject)
- **Dedicated IP**: Use a dedicated sending IP once volume exceeds 50,000 emails/month
- **IP warming**: Gradually increase volume on new IPs over 2-4 weeks, starting with your most engaged subscribers

**List hygiene practices:**

- Remove hard bounces immediately after every send
- Suppress soft bounces after 3 consecutive failures
- Run email verification on new list imports before sending
- Prune subscribers with zero engagement over 90-120 days (after a re-engagement attempt)
- Never purchase or rent email lists

**Content-related deliverability factors:**

- Avoid spam trigger words in subject lines (free, act now, limited time, guaranteed)
- Maintain consistent sending frequency and volume
- Keep complaint rates below 0.1% (1 complaint per 1,000 emails)
- Include a visible, easy-to-find unsubscribe link in every email
- Honor unsubscribe requests within 24 hours (legally required within 10 business days under CAN-SPAM)

## Tools & Templates

### Recommended Platforms

| Platform          | Best For                    | Starting Price      | Key Strength                            |
|-------------------|-----------------------------|---------------------|-----------------------------------------|
| Mailchimp         | Small business, beginners   | Free (500 contacts) | Ease of use, broad integrations         |
| Klaviyo           | E-commerce (Shopify focus)  | Free (250 contacts) | Deep e-commerce data and automation     |
| SendGrid          | Transactional + marketing   | Free (100/day)      | API-first, developer-friendly           |
| ConvertKit        | Creators and publishers     | Free (1,000 subs)   | Simple automation, landing pages        |
| ActiveCampaign    | B2B, complex automation     | $29/month           | CRM integration, advanced workflows     |

### Campaign Brief Template

Use this template to plan any email campaign before building it:

```
CAMPAIGN BRIEF
==============
Campaign Name:
Owner:
Launch Date:
Goal:

TARGET AUDIENCE
Segment(s):
Estimated List Size:
Exclusions:

CONTENT
Subject Line (Primary):
Subject Line (A/B Variant):
Preview Text:
Email Body Summary:
Primary CTA:
CTA Destination URL:

DESIGN
Template:
Hero Image:
Brand Guidelines Reference:

TECHNICAL
Sending Platform:
Send Time:
A/B Test Variable:
Test Split (%):
Winner Selection Criteria:

MEASUREMENT
Primary KPI:
Target Value:
Reporting Date:
```

## Metrics & KPIs

Track these metrics consistently and benchmark against industry averages and your own historical performance.

| Metric              | Definition                                      | Good Benchmark     | Excellent Benchmark |
|---------------------|-------------------------------------------------|--------------------|--------------------|
| Open Rate           | Unique opens / Delivered emails                 | 20-25%             | 30%+               |
| Click-Through Rate  | Unique clicks / Delivered emails                | 2.5-3.5%           | 5%+                |
| Click-to-Open Rate  | Unique clicks / Unique opens                    | 10-15%             | 20%+               |
| Conversion Rate     | Conversions / Unique clicks                     | 2-5%               | 8%+                |
| Bounce Rate         | Bounced / Sent emails                           | < 2%               | < 0.5%             |
| Unsubscribe Rate    | Unsubscribes / Delivered emails                 | < 0.5%             | < 0.2%             |
| List Growth Rate    | (New subs - Unsubs) / Total list size per month | 2-3%               | 5%+                |
| Revenue Per Email   | Total revenue / Delivered emails                | Varies by industry | Track trend growth |
| Spam Complaint Rate | Complaints / Delivered emails                   | < 0.1%             | < 0.03%            |

**Notes on measurement:**

- Apple Mail Privacy Protection inflates open rates since iOS 15. Use click-based metrics as the more reliable engagement signal.
- Track metrics at the segment level, not just aggregate. A healthy overall open rate can mask a deteriorating segment.
- Set up UTM parameters on all email links for accurate attribution in your analytics platform.

## Common Pitfalls

### 1. Sending Without Segmentation

**Problem**: Blasting the same email to the entire list leads to low engagement, high unsubscribes, and eventual deliverability damage as ISPs interpret poor engagement as a spam signal.

**Prevention**: Start with at least three segments (new subscribers, engaged subscribers, inactive subscribers) and tailor content and frequency to each group. Even basic segmentation dramatically outperforms batch-and-blast.

### 2. Neglecting Mobile Optimization

**Problem**: Over 60% of email opens occur on mobile devices. Emails designed only for desktop display broken layouts, tiny text, and unclickable buttons on phones.

**Prevention**: Design mobile-first. Use single-column layouts, minimum 16px body text, buttons at least 44px tall, and always send test emails to real mobile devices before launch.

### 3. Ignoring List Hygiene

**Problem**: Keeping unengaged subscribers inflates list size but destroys deliverability. ISPs monitor engagement rates, and a large inactive segment drags down your sender reputation.

**Prevention**: Run a re-engagement sequence for subscribers inactive for 90 days. Remove anyone who does not re-engage. Verify new email addresses at the point of collection. Clean your list quarterly at minimum.

### 4. Over-Testing Without Action

**Problem**: Running A/B tests but never implementing the findings, or testing too many variables simultaneously so no clean conclusions can be drawn.

**Prevention**: Maintain a testing log with columns for hypothesis, variable, result, confidence level, and action taken. Review the log monthly and update your default templates and practices based on confirmed winners.

### 5. No Preference Center

**Problem**: Offering only "unsubscribe from all" as the opt-out option means you lose subscribers who would have stayed if they could reduce frequency or choose topics.

**Prevention**: Build a preference center that lets subscribers choose email types (promotional, educational, product updates) and frequency (weekly, monthly). Link to it in every email footer alongside the unsubscribe link.

## Integration Points

Email marketing does not operate in isolation. It connects to and amplifies several adjacent skills:

- **content-marketing**: Email distributes blog posts, guides, and video content. Content assets serve as lead magnets that grow the email list. Align email editorial calendars with content publishing schedules.
- **lead-generation**: Email capture forms, landing pages, and gated content are primary list-building mechanisms. Lead scoring data from email engagement feeds back into lead qualification.
- **crm-management**: Subscriber data, engagement history, and lifecycle stage sync between the email platform and CRM. Sales teams use email engagement signals to prioritize outreach.
- **social-media-marketing**: Cross-promote email signups on social channels. Use email content as the basis for social posts. Retarget email non-openers with paid social ads.
- **analytics-reporting**: Email performance data feeds into marketing dashboards and attribution models. Multi-touch attribution requires email click data alongside other channel data.

When building AI agent workflows, ensure that email marketing automation triggers and data flows are connected to these adjacent systems through proper API integrations or native platform connections.
