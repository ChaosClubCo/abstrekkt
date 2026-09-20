---
name: analytics-reporting
description: Set up and manage marketing analytics including GA4 configuration, attribution modeling, dashboard creation, KPI tracking, and automated reporting. Use when establishing measurement frameworks, building dashboards, analyzing performance, or generating insights.
---

# Analytics & Reporting

## Overview

Data-driven decision making separates high-performing marketing teams from those operating on instinct alone. Effective analytics and reporting provides visibility into what's working, identifies optimization opportunities, and demonstrates marketing's impact on business outcomes. For SMBs, getting analytics right means maximizing limited resources and proving ROI.

This skill covers the full analytics lifecycle: setting up tracking correctly, building insightful dashboards, understanding attribution, generating actionable reports, and creating a culture of measurement.

## When to Use

**Invoke this skill when:**
- Setting up or auditing Google Analytics 4
- Designing attribution models
- Creating marketing dashboards
- Establishing KPI frameworks
- Building automated reports
- Analyzing campaign performance
- Presenting marketing results to leadership
- Troubleshooting tracking issues

**Trigger phrases:**
- "Set up analytics"
- "GA4 configuration"
- "Build dashboard"
- "Attribution model"
- "Track KPIs"
- "Marketing report"

## Core Processes

### 1. Analytics Foundation

#### Measurement Framework

```markdown
## Marketing Measurement Framework

### Business Objectives to Metrics Mapping

| Business Objective | Marketing Goal | Key Metrics |
|-------------------|----------------|-------------|
| Revenue growth | Generate qualified leads | MQLs, SQLs, Pipeline |
| Market expansion | Brand awareness | Traffic, Reach, Share of Voice |
| Customer retention | Engagement | NPS, Retention rate, Repeat purchases |
| Efficiency | Marketing ROI | CAC, LTV:CAC, ROAS |

### Metric Categories

**Vanity Metrics** (awareness, not action):
- Page views, impressions, followers
- Use for: Benchmarking, trend analysis
- Caution: Don't optimize solely for these

**Engagement Metrics** (interest and action):
- Time on site, scroll depth, click-through rate
- Use for: Content quality, UX optimization
- Caution: Engagement doesn't equal conversion

**Conversion Metrics** (business outcomes):
- Leads, signups, purchases, MQLs
- Use for: Performance measurement, optimization
- Focus: Primary metrics for decision-making

**Financial Metrics** (revenue impact):
- Revenue, CAC, LTV, ROI
- Use for: Business case, budget allocation
- Focus: Ultimate measure of marketing success

### Metric Definition Template
For each key metric, document:
---
**Metric Name**: [Name]
**Definition**: [Precise definition]
**Formula**: [How calculated]
**Data Source**: [Where data comes from]
**Owner**: [Who is responsible]
**Frequency**: [How often measured]
**Target**: [Goal]
**Segments**: [How to slice data]
---
```

#### KPI Selection

```markdown
## KPI Framework by Marketing Function

### Demand Generation KPIs
| KPI | Definition | Target | Frequency |
|-----|------------|--------|-----------|
| MQLs generated | Leads meeting qualification criteria | [X]/month | Weekly |
| SQL conversion rate | MQLs that become SQLs | >25% | Monthly |
| Cost per MQL | Marketing spend / MQLs | <$[X] | Monthly |
| Pipeline generated | Attributed pipeline value | $[X]/quarter | Monthly |
| Marketing-sourced revenue | Revenue from marketing leads | $[X]/quarter | Quarterly |

### Content Marketing KPIs
| KPI | Definition | Target | Frequency |
|-----|------------|--------|-----------|
| Organic traffic | Non-paid search traffic | +[X]% MoM | Weekly |
| Content conversion rate | Conversions / Content page views | >2% | Monthly |
| Time on page | Average engagement time | >2 min | Monthly |
| Content leads | Leads from content assets | [X]/month | Monthly |
| Content ROI | Revenue attributed to content / Cost | >3:1 | Quarterly |

### Paid Acquisition KPIs
| KPI | Definition | Target | Frequency |
|-----|------------|--------|-----------|
| ROAS | Revenue / Ad spend | >3:1 | Weekly |
| CPC | Cost per click | <$[X] | Weekly |
| CTR | Clicks / Impressions | >2% | Weekly |
| Conversion rate | Conversions / Clicks | >3% | Weekly |
| CAC (paid) | Paid spend / Customers acquired | <$[X] | Monthly |

### Email Marketing KPIs
| KPI | Definition | Target | Frequency |
|-----|------------|--------|-----------|
| Open rate | Opens / Delivered | >25% | Per campaign |
| Click rate | Clicks / Delivered | >3% | Per campaign |
| Unsubscribe rate | Unsubscribes / Delivered | <0.5% | Per campaign |
| Email-attributed revenue | Revenue from email clicks | $[X]/month | Monthly |
| List growth rate | Net new subscribers | +[X]% MoM | Monthly |

### Website KPIs
| KPI | Definition | Target | Frequency |
|-----|------------|--------|-----------|
| Sessions | Total website visits | [X]/month | Weekly |
| Conversion rate | Conversions / Sessions | >2% | Weekly |
| Bounce rate | Single-page sessions | <50% | Monthly |
| Page load time | Average load speed | <3 sec | Monthly |
| Pages per session | Engagement depth | >2 | Monthly |
```

### 2. GA4 Configuration

#### GA4 Setup Checklist

```markdown
## GA4 Implementation Guide

### Property Setup
- [ ] GA4 property created
- [ ] Data stream configured (web)
- [ ] Measurement ID obtained (G-XXXXXX)
- [ ] Data retention set (14 months for most)
- [ ] Reporting timezone correct
- [ ] Currency set correctly

### Implementation Options
| Method | Best For | Complexity |
|--------|----------|------------|
| Google tag (gtag.js) | Simple sites, quick setup | Low |
| Google Tag Manager | Complex tracking, flexibility | Medium |
| Native platform integration | Shopify, WordPress, etc. | Low |

### Enhanced Measurement
Enable built-in events:
- [ ] Page views
- [ ] Scrolls
- [ ] Outbound clicks
- [ ] Site search
- [ ] Video engagement
- [ ] File downloads
- [ ] Form interactions (basic)

### Custom Event Setup

**Recommended Custom Events:**
```javascript
// Lead form submission
gtag('event', 'generate_lead', {
  'currency': 'USD',
  'value': 100,
  'lead_type': 'demo_request'
});

// CTA click
gtag('event', 'cta_click', {
  'button_text': 'Start Free Trial',
  'page_location': '/pricing'
});

// Content engagement
gtag('event', 'content_engagement', {
  'content_type': 'ebook',
  'content_name': 'Ultimate Guide to X'
});
```

### Conversion Configuration
Mark these events as conversions:
- [ ] generate_lead (form submissions)
- [ ] sign_up (account creation)
- [ ] purchase (transactions)
- [ ] demo_scheduled (sales meetings)
- [ ] trial_started (product trials)

### Audience Creation
Build audiences for analysis and remarketing:
- Users who converted
- Users who visited pricing but didn't convert
- Engaged users (X+ sessions)
- Users by traffic source
- Users by content topic interest
```

#### GA4 Reporting Setup

```markdown
## GA4 Reports Configuration

### Default Reports to Customize
1. **Acquisition Overview**
   - Focus on: Source/medium, Campaign performance
   - Add: Conversion rate by source

2. **Engagement Overview**
   - Focus on: Event counts, engagement metrics
   - Add: Custom events as key events

3. **Conversion/Monetization**
   - Focus on: Conversion counts and rates
   - Add: Conversion by traffic source

### Custom Reports to Build

**Traffic Quality Report**
Dimensions: Source/Medium, Campaign, Landing page
Metrics: Sessions, Engagement rate, Conversions, Conversion rate

**Content Performance Report**
Dimensions: Page path, Page title
Metrics: Views, Avg engagement time, Conversions, Scroll events

**Funnel Analysis**
Steps: Landing page view → Key page view → Form start → Form submit

### Exploration Reports

**User Journey Exploration**
- Path exploration from landing to conversion
- Identify common paths and drop-offs
- Discover unexpected user behaviors

**Segment Comparison**
- Compare converters vs. non-converters
- Compare traffic sources
- Compare device types

**Funnel Exploration**
- Visualize conversion funnel
- Identify largest drop-off points
- Segment by traffic source

### Looker Studio (Data Studio) Integration
- [ ] Connect GA4 as data source
- [ ] Build marketing dashboard
- [ ] Set up scheduled delivery
- [ ] Share with stakeholders
```

### 3. Attribution Modeling

#### Attribution Fundamentals

```markdown
## Attribution Model Overview

### Attribution Models Explained

**Last Click (Default)**
- 100% credit to final touchpoint
- Pro: Simple, clear accountability
- Con: Ignores awareness/consideration
- Best for: Direct response, short cycles

**First Click**
- 100% credit to first touchpoint
- Pro: Values awareness building
- Con: Ignores nurturing and closing
- Best for: Brand campaigns, awareness measurement

**Linear**
- Equal credit to all touchpoints
- Pro: Acknowledges full journey
- Con: Doesn't reflect actual influence
- Best for: Balanced view, long cycles

**Time Decay**
- More credit to recent touchpoints
- Pro: Values closer-to-conversion actions
- Con: May undervalue awareness
- Best for: Short/medium sales cycles

**Position-Based (U-Shaped)**
- 40% first, 40% last, 20% middle
- Pro: Values both intro and close
- Con: May undervalue consideration
- Best for: Balanced B2B view

**Data-Driven (GA4)**
- ML-based credit distribution
- Pro: Based on actual conversion patterns
- Con: Requires significant data volume
- Best for: High-volume properties

### Attribution Model Selection Guide
| Scenario | Recommended Model |
|----------|-------------------|
| Short sales cycle, single touch | Last click |
| Long B2B cycle, multiple touches | Position-based or Data-driven |
| Heavy brand investment | First click for brand, Last click for conversion |
| E-commerce, high volume | Data-driven |
| Limited data volume | Linear or Position-based |
```

#### Multi-Touch Attribution Setup

```markdown
## Attribution Implementation

### GA4 Attribution Settings
Navigate to: Admin → Attribution Settings

**Reporting Attribution Model:**
- Default: Data-driven (if qualified) or Paid and organic last click
- Recommendation: Data-driven when possible

**Lookback Windows:**
- Acquisition: 30 days (standard)
- Other: 90 days for longer cycles

### Attribution Analysis Process

**Step 1: Understand the Customer Journey**
Use GA4 path exploration to visualize:
- Common sequences from first touch to conversion
- Average touchpoints before conversion
- Time between first touch and conversion

**Step 2: Compare Attribution Models**
In GA4 Model Comparison:
- Compare at least 3 models
- Look for channels that shift significantly
- Consider if shifts match your understanding

**Step 3: Identify Attribution Insights**
Questions to answer:
- Which channels assist vs. close?
- How long is the typical journey?
- Where are there attribution gaps?

**Step 4: Apply to Budget Decisions**
- Channels undervalued by last-click may need investment
- Channels that only assist may need different metrics
- Long cycles may need multi-touch view

### Attribution Reporting Template
| Channel | Last Click | Linear | First Click | Data-Driven | Role |
|---------|------------|--------|-------------|-------------|------|
| Organic | [X]% | [X]% | [X]% | [X]% | [Assist/Close] |
| Paid Search | [X]% | [X]% | [X]% | [X]% | [Assist/Close] |
| Email | [X]% | [X]% | [X]% | [X]% | [Assist/Close] |
| Social | [X]% | [X]% | [X]% | [X]% | [Assist/Close] |
| Direct | [X]% | [X]% | [X]% | [X]% | [Assist/Close] |

### Attribution Caveats
- Cross-device tracking has gaps
- Privacy changes affect tracking
- Offline touchpoints often missing
- Attribution is directional, not absolute
- Test and learn; don't over-optimize
```

### 4. Dashboard Creation

#### Dashboard Design Principles

```markdown
## Dashboard Design Framework

### Dashboard Hierarchy
**Executive Dashboard**: High-level KPIs, trends, goals
**Marketing Dashboard**: Channel performance, campaign metrics
**Channel Dashboards**: Deep-dive by channel
**Campaign Dashboards**: Specific campaign analysis

### Dashboard Design Principles

**1. Purpose-Driven**
- One clear purpose per dashboard
- Answer specific questions
- Support specific decisions

**2. Audience-Appropriate**
- Executives: High-level, few metrics
- Managers: Trends, comparisons
- Analysts: Detailed, filterable

**3. Scannable**
- Most important metrics prominent
- Logical visual hierarchy
- Consistent layout and formatting

**4. Actionable**
- Include context (targets, benchmarks)
- Show trends and change
- Highlight anomalies

**5. Maintainable**
- Automated data connections
- Clear data sources
- Documented calculations

### Dashboard Layout Template
```
┌─────────────────────────────────────────────────────────┐
│  [Dashboard Title]                    [Date Range]      │
├─────────────┬─────────────┬─────────────┬──────────────┤
│  KPI 1      │  KPI 2      │  KPI 3      │  KPI 4       │
│  [Value]    │  [Value]    │  [Value]    │  [Value]     │
│  [Trend]    │  [Trend]    │  [Trend]    │  [Trend]     │
├─────────────┴─────────────┴─────────────┴──────────────┤
│  [Main Trend Chart - Time Series]                       │
│                                                         │
├─────────────────────────┬───────────────────────────────┤
│  [Breakdown Chart 1]    │  [Breakdown Chart 2]          │
│  (by channel/campaign)  │  (by segment/category)        │
│                         │                               │
├─────────────────────────┴───────────────────────────────┤
│  [Detail Table - Filterable]                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
```

#### Marketing Dashboard Template

```markdown
## Marketing Performance Dashboard

### Executive Summary Section
| Metric | Current | Previous | Change | Target | Status |
|--------|---------|----------|--------|--------|--------|
| Revenue | $[X] | $[X] | [X]% | $[X] | [G/Y/R] |
| Leads | [X] | [X] | [X]% | [X] | [G/Y/R] |
| CAC | $[X] | $[X] | [X]% | <$[X] | [G/Y/R] |
| ROAS | [X]:1 | [X]:1 | [X]% | >[X]:1 | [G/Y/R] |

### Traffic & Acquisition
**Chart 1**: Sessions over time (line chart)
**Chart 2**: Sessions by channel (pie/bar)
**Table**: Traffic sources with conversion rate

### Conversion Performance
**Chart 1**: Conversions over time (line chart)
**Chart 2**: Conversion rate by channel (bar)
**Chart 3**: Funnel visualization

### Campaign Performance
| Campaign | Spend | Leads | CPL | Conv Rate | ROAS |
|----------|-------|-------|-----|-----------|------|
| [Camp 1] | $[X] | [X] | $[X] | [X]% | [X]:1 |
| [Camp 2] | $[X] | [X] | $[X] | [X]% | [X]:1 |

### Channel Deep Dives
**Tab 1**: Paid Search metrics
**Tab 2**: Social metrics
**Tab 3**: Email metrics
**Tab 4**: Content/SEO metrics

### Filters Available
- Date range selector
- Channel filter
- Campaign filter
- Region filter (if applicable)
```

#### Dashboard Tools Setup

```markdown
## Dashboard Tool Options

### Looker Studio (Google Data Studio)
**Pros**: Free, native Google integration, shareable
**Cons**: Performance with large data, limited features
**Best for**: GA4-centric reporting, SMBs

**Setup Steps:**
1. Create new report
2. Add GA4 as data source
3. Build pages following template
4. Configure filters and date ranges
5. Set up scheduled delivery

### Spreadsheet Dashboards
**Pros**: Flexible, familiar, manual data easily added
**Cons**: Manual updates, version control, limited visuals
**Best for**: Ad-hoc analysis, early stage companies

**Setup Steps:**
1. Create data input sheet
2. Build calculation sheet
3. Design dashboard sheet
4. Add conditional formatting
5. Create update process

### Other Dashboard Options
| Tool | Best For | Complexity | Cost |
|------|----------|------------|------|
| Tableau | Advanced visualization | High | $$$ |
| Power BI | Microsoft stack | Medium | $$ |
| Databox | Metric tracking | Low | $$ |
| Klipfolio | Real-time dashboards | Medium | $$ |
| Geckoboard | TV dashboards | Low | $$ |

### Data Source Integration
Common connections needed:
- Google Analytics 4
- Google Ads
- Facebook Ads
- LinkedIn Ads
- CRM (Salesforce, HubSpot)
- Email platform
- Spreadsheet (manual data)
```

### 5. Reporting & Insights

#### Report Types and Cadence

```markdown
## Marketing Reporting Framework

### Report Types

**Weekly Report** (Quick pulse check)
- Traffic and conversion snapshot
- Campaign performance highlights
- Anomalies or issues
- Immediate actions needed
Audience: Marketing team
Format: Email or Slack summary

**Monthly Report** (Performance review)
- Full KPI dashboard
- Channel performance analysis
- Campaign deep-dives
- Trends and patterns
- Recommendations
Audience: Marketing + leadership
Format: Dashboard + narrative

**Quarterly Report** (Strategic review)
- KPI achievement vs. goals
- Attribution analysis
- Budget performance
- Competitive landscape
- Strategic recommendations
Audience: Executive team
Format: Presentation + dashboard

**Annual Report** (Year in review)
- Full year performance
- YoY comparisons
- Major wins and learnings
- Strategic impact
- Next year planning inputs
Audience: Company + board
Format: Comprehensive presentation

### Report Distribution
| Report | Audience | Format | Timing |
|--------|----------|--------|--------|
| Weekly | Marketing | Email/Slack | Monday |
| Monthly | Marketing + Exec | Meeting + Doc | 5th of month |
| Quarterly | Executive | Presentation | End of quarter |
| Annual | Company | Presentation | January |
```

#### Report Writing Framework

```markdown
## Marketing Report Template

### Executive Summary (1 page max)
**Performance snapshot:**
- [X]% to goal on [primary metric]
- [Key win of the period]
- [Key challenge faced]
- [Primary recommendation]

### KPI Dashboard (visual)
[Include dashboard screenshot or embedded view]

### Performance Analysis

**What happened:**
- Traffic: [X]% change, driven by [factors]
- Conversions: [X]% change, due to [factors]
- Revenue: $[X] attributed to marketing

**Why it happened:**
- [Analysis of key drivers]
- [External factors if relevant]
- [Campaign/initiative impacts]

**What we learned:**
- [Insight 1 and implication]
- [Insight 2 and implication]
- [Insight 3 and implication]

### Channel Performance
| Channel | Investment | Results | Efficiency | Trend |
|---------|------------|---------|------------|-------|
| Paid Search | $[X] | [X] leads | $[X] CPL | [Up/Down] |
| Social | $[X] | [X] leads | $[X] CPL | [Up/Down] |
| Content | [X] hours | [X] leads | $[X] CPL | [Up/Down] |
| Email | - | [X] leads | - | [Up/Down] |

### Campaign Highlights
**Top Performers:**
1. [Campaign]: [Result] - Why it worked: [reason]
2. [Campaign]: [Result] - Why it worked: [reason]

**Underperformers:**
1. [Campaign]: [Result] - Learning: [lesson]
2. [Campaign]: [Result] - Learning: [lesson]

### Recommendations
| Priority | Recommendation | Expected Impact | Timeline |
|----------|----------------|-----------------|----------|
| High | [Action] | [Impact] | [When] |
| Medium | [Action] | [Impact] | [When] |
| Low | [Action] | [Impact] | [When] |

### Next Period Focus
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]
```

#### Automated Reporting

```markdown
## Report Automation Framework

### Automation Levels

**Level 1: Scheduled Delivery**
- Dashboard auto-emails (Looker Studio)
- Pre-built report distribution
- Time trigger, no customization

**Level 2: Template-Based**
- Google Sheets + GA4 add-on
- Data refreshes, manual analysis
- Semi-automated, analyst adds insight

**Level 3: Fully Automated**
- Custom scripts pulling data
- Auto-generated narratives
- Slack/email delivery
- Requires technical setup

### Looker Studio Scheduled Delivery
1. Open report in edit mode
2. Click "Share" → "Schedule email delivery"
3. Set recipients, frequency, format
4. Choose pages to include
5. Set delivery time

### Google Sheets Automation
Using GA4 add-on or Supermetrics:
1. Install add-on
2. Configure queries
3. Schedule refresh
4. Build report from refreshed data
5. Email or share sheet

### Slack/Email Integration
Options for automated insights:
- Databox daily scorecards
- Custom webhook integrations
- Zapier/Make automations
- Platform native notifications

### Automation Checklist
- [ ] Data sources connected and refreshing
- [ ] Calculations verified correct
- [ ] Distribution list current
- [ ] Delivery timing appropriate
- [ ] Backup for failures
- [ ] Review for accuracy periodically
```

## Tools & Templates

### Analytics Audit Checklist

```markdown
## Analytics Health Check

### Tracking Verification
- [ ] GA4 tag firing on all pages
- [ ] No duplicate tags
- [ ] Events capturing correctly
- [ ] Conversions attributed properly
- [ ] Cross-domain tracking working (if needed)
- [ ] Filters excluding internal traffic
- [ ] UTM parameters used consistently

### Data Quality
- [ ] No significant data gaps
- [ ] Conversion numbers match CRM
- [ ] Revenue data accurate (if tracked)
- [ ] No spam/bot traffic inflation
- [ ] Goals properly configured

### Reporting Setup
- [ ] Custom reports created
- [ ] Dashboards built and shared
- [ ] Audiences configured
- [ ] Looker Studio connected
- [ ] Automated reports scheduled
```

### UTM Parameter Guide

```markdown
## UTM Naming Convention

### Standard Parameters
| Parameter | Purpose | Example |
|-----------|---------|---------|
| utm_source | Traffic source | google, facebook, newsletter |
| utm_medium | Marketing medium | cpc, social, email |
| utm_campaign | Campaign name | spring_sale_2024 |
| utm_term | Paid keywords | crm_software (paid only) |
| utm_content | Content variant | hero_cta, sidebar_link |

### Naming Convention Rules
1. Use lowercase only
2. Use underscores for spaces
3. Be consistent and descriptive
4. Document your convention

### Example URLs
```
Paid Search:
?utm_source=google&utm_medium=cpc&utm_campaign=brand_2024&utm_term=company_name

Social (Organic):
?utm_source=linkedin&utm_medium=social&utm_campaign=thought_leadership&utm_content=cto_post

Email:
?utm_source=newsletter&utm_medium=email&utm_campaign=weekly_digest_w12&utm_content=feature_article

Paid Social:
?utm_source=facebook&utm_medium=paid_social&utm_campaign=retargeting_demo&utm_content=testimonial_video
```

### UTM Builder Tool
Use: https://ga-dev-tools.google/campaign-url-builder/
```

## Metrics & KPIs

### Analytics Program Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Data accuracy | Match rate with CRM/actuals | >95% |
| Report delivery rate | On-time scheduled reports | 100% |
| Dashboard usage | Weekly active users | >80% of team |
| Data-driven decisions | Decisions citing data | Increase trend |
| Time to insight | Report request to delivery | <24 hours |

### Data Quality Indicators

| Indicator | Issue Signal | Investigation |
|-----------|--------------|---------------|
| Sudden traffic spike | Bot traffic, tag duplicate | Check source, user behavior |
| Conversion rate drop | Tracking issue, site problem | Test conversions, check funnel |
| Missing data | Tag not firing, filter issue | Debug mode, realtime report |
| Revenue mismatch | E-commerce tracking issue | Compare with backend |

## Common Pitfalls

### Pitfall 1: Tracking Without Action
**Problem**: Collecting data but not using it
**Solution**: Every report should include recommendations; tie to decisions

### Pitfall 2: Vanity Metric Focus
**Problem**: Reporting on metrics that don't matter
**Solution**: Start with business goals, work backward to metrics

### Pitfall 3: Analysis Paralysis
**Problem**: So much data, no decisions made
**Solution**: Focus on 5-7 key metrics; save details for investigation

### Pitfall 4: Broken Tracking
**Problem**: Data is wrong but decisions being made
**Solution**: Regular audits; verify tracking; cross-check with other sources

### Pitfall 5: Last-Click Tunnel Vision
**Problem**: Only valuing final touchpoint
**Solution**: Multi-touch attribution; understand full journey

### Pitfall 6: Manual Reporting Burden
**Problem**: Hours spent creating reports
**Solution**: Automate data collection; focus analyst time on insight

## Integration Points

### Connected Business Functions

| Function | Integration Point | Shared Elements |
|----------|-------------------|-----------------|
| Sales | Pipeline reporting, lead quality | CRM data, attribution |
| Finance | Marketing ROI, budget tracking | Revenue data, spend |
| Product | User analytics, feature adoption | Event data, funnels |
| Executive | Business performance | Summary dashboards |
| All Marketing | Channel performance | Unified metrics |

### Technology Stack

- **Web analytics**: Google Analytics 4
- **Tag management**: Google Tag Manager
- **Dashboards**: Looker Studio, Tableau, Power BI
- **Data warehouse**: BigQuery, Snowflake (advanced)
- **Integration**: Supermetrics, Funnel.io, Fivetran
- **Spreadsheets**: Google Sheets, Excel
- **BI tools**: Databox, Klipfolio, Geckoboard
