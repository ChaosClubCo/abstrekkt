---
name: product-metrics
category: product-management
subcategory: front-of-house
description: Comprehensive product metrics including KPI frameworks, analytics implementation, dashboarding, and data-driven decision making. Use when defining success metrics, building analytics dashboards, measuring product performance, or establishing data-driven product practices.
version: 1.0.0
author: IntInc Strategy Skills
tags:
  - product-metrics
  - analytics
  - kpis
  - dashboards
  - data-driven
  - measurement
  - product-analytics
  - success-metrics
complexity: intermediate
time_horizon: ongoing
stakeholders:
  - product-managers
  - data-analysts
  - engineering-leads
  - executive-leadership
  - marketing-team
  - customer-success
outputs:
  - metrics-framework
  - analytics-dashboard
  - kpi-definitions
  - measurement-plan
  - performance-reports
---

# Product Metrics

## Overview

Product metrics transform product intuition into evidence-based decision making. By establishing clear measurement frameworks, teams can objectively assess product health, validate hypotheses, prioritize investments, and demonstrate value to stakeholders.

Effective product metrics go beyond vanity numbers to capture meaningful signals about user behavior, business impact, and product quality. The discipline encompasses metric selection, instrumentation, dashboard design, analysis, and the cultural practices that ensure data informs decisions.

The goal is not measurement for its own sake but actionable intelligence that accelerates learning and improves outcomes. Great product teams know what to measure, how to interpret changes, and when to act on signals versus noise.

### Why This Matters

Without metrics, product teams operate blind, making decisions based on opinion, loudest voices, or anecdote. With metrics, teams can validate assumptions, detect problems early, optimize funnels, and build compelling cases for investment. Data-driven organizations consistently outperform competitors in product-market fit and operational efficiency.

## When to Use

### Primary Triggers

- Launching new products or features
- Establishing success criteria for initiatives
- Building executive dashboards
- Investigating user behavior patterns
- Prioritizing product roadmap
- Evaluating A/B test results
- Preparing board or investor updates
- Diagnosing product health issues

### Specific Use Cases

| Scenario | Metrics Focus | Key Outputs |
|----------|--------------|-------------|
| New Feature Launch | Adoption, activation | Feature dashboard |
| Growth Initiative | Acquisition, conversion | Funnel analysis |
| Retention Problem | Churn, engagement | Cohort analysis |
| Monetization | Revenue, LTV | Business metrics |
| Quality Concerns | Errors, performance | Health dashboard |
| User Research | Behavior patterns | Usage analysis |

## Core Processes

### Phase 1: Metrics Framework Design

#### North Star Metric Selection

```markdown
## North Star Metric Criteria

A North Star Metric should:
1. Measure value delivered to customers
2. Correlate with long-term business success
3. Be actionable by product team
4. Guide prioritization decisions
5. Be understandable across the org

### North Star Examples by Business Type

| Business Type | North Star Metric | Rationale |
|--------------|------------------|-----------|
| SaaS B2B | Weekly Active Workspaces | Team adoption drives retention |
| Marketplace | Gross Transaction Value | Matches buyer/seller value |
| Social Media | Daily Active Users | Engagement drives ad revenue |
| Subscription | Monthly Retained Revenue | Combines growth and retention |
| E-commerce | Repeat Purchase Rate | Customer value beyond CAC |
| Developer Tool | Weekly Deployments | Usage = value delivered |
```

#### Metrics Hierarchy Framework

```markdown
## Metrics Pyramid

                    [North Star]
                         |
        +----------------+----------------+
        |                |                |
   [Acquisition]   [Engagement]    [Monetization]
        |                |                |
   +----+----+    +------+------+    +----+----+
   |    |    |    |      |      |    |    |    |
  L1   L2   L3   L1     L2     L3   L1   L2   L3

### Level Definitions
- North Star: Single metric representing overall product health
- Pillar Metrics: Core dimensions of product success (3-5)
- Supporting Metrics: Detailed measures under each pillar (3-5 each)
- Diagnostic Metrics: Deep-dive measures for investigation
```

#### Input vs. Output Metrics

```markdown
## Metric Type Classification

### Output Metrics (Lagging)
- Measure results/outcomes
- Typically slower to move
- Often what stakeholders care about
- Examples: Revenue, Churn, NPS

### Input Metrics (Leading)
- Measure activities/behaviors
- Faster feedback signal
- More directly actionable
- Examples: Feature usage, Time in app, Actions completed

### Connecting Inputs to Outputs

Input Metric → Leading Indicator → Output Metric

Example Chain:
Onboarding completion → Week 1 activation → 90-day retention

### Building Your Metric Model
1. Define output metrics (what success looks like)
2. Identify input metrics (what drives success)
3. Validate correlation between inputs and outputs
4. Focus team on moving input metrics
5. Track output metrics for validation
```

### Phase 2: Core Metrics Definitions

#### AARRR Pirate Metrics Framework

```markdown
## Pirate Metrics Breakdown

### Acquisition
How users find your product

| Metric | Definition | Target |
|--------|-----------|--------|
| New signups | Users completing registration | X/week |
| Traffic by source | Visits by channel | Mix % |
| Signup conversion | Visitors → Signups | X% |
| CAC by channel | Cost to acquire | $X |

### Activation
First value experience

| Metric | Definition | Target |
|--------|-----------|--------|
| Onboarding completion | Finished setup flow | X% |
| Time to first value | Signup → Key action | <X min |
| Activation rate | Signups → Activated | X% |
| Setup quality score | Steps completed properly | X% |

### Retention
Users coming back

| Metric | Definition | Target |
|--------|-----------|--------|
| D1/D7/D30 retention | Return rates by day | X%/Y%/Z% |
| Weekly active rate | WAU/Total users | X% |
| Churn rate | Users lost per period | <X% |
| Resurrection rate | Churned users returning | X% |

### Revenue
Users paying

| Metric | Definition | Target |
|--------|-----------|--------|
| Conversion to paid | Free → Paid | X% |
| ARPU/ARPA | Avg revenue per user/account | $X |
| LTV | Customer lifetime value | $X |
| Expansion revenue | Upsell/cross-sell | X% MoM |

### Referral
Users inviting others

| Metric | Definition | Target |
|--------|-----------|--------|
| Viral coefficient | Invites × Conversion | >1.0 |
| NPS | Net promoter score | >X |
| Referral rate | Users who refer | X% |
| Invite conversion | Invites → Signups | X% |
```

#### Engagement Metrics Deep Dive

```markdown
## Engagement Metrics Framework

### Frequency Metrics
| Metric | Definition | Calculation |
|--------|-----------|-------------|
| DAU | Daily active users | Unique users/day |
| WAU | Weekly active users | Unique users/week |
| MAU | Monthly active users | Unique users/month |
| DAU/MAU | Stickiness ratio | DAU ÷ MAU |
| Sessions/user | Avg visits | Sessions ÷ Users |

### Depth Metrics
| Metric | Definition | Calculation |
|--------|-----------|-------------|
| Session duration | Time spent | Avg(session length) |
| Pages/session | Navigation depth | Pages ÷ Sessions |
| Features used | Breadth of usage | Count distinct features |
| Actions/session | Activity level | Actions ÷ Sessions |

### Quality Metrics
| Metric | Definition | Calculation |
|--------|-----------|-------------|
| Task completion | Goal achievement | Completed ÷ Started |
| Error rate | Failure frequency | Errors ÷ Actions |
| Time on task | Efficiency | Avg time to complete |
| Satisfaction score | User sentiment | Survey response |
```

### Phase 3: Analytics Implementation

#### Event Taxonomy Design

```markdown
## Event Naming Convention

### Structure
[Object]_[Action]_[Context]

### Examples
- user_signed_up
- project_created
- file_uploaded_to_workspace
- subscription_upgraded_to_pro
- feature_toggle_enabled

### Event Properties Schema
{
  "event_name": "project_created",
  "timestamp": "2024-01-15T10:30:00Z",
  "user_id": "usr_123",
  "properties": {
    "project_type": "marketing",
    "template_used": "blank",
    "team_size": 5,
    "source": "onboarding_flow"
  },
  "context": {
    "platform": "web",
    "browser": "chrome",
    "country": "US"
  }
}
```

#### Tracking Plan Template

```markdown
## Feature Tracking Plan

### Feature: [Feature Name]
### Owner: [PM Name]
### Launch Date: [Date]

### Events to Track

| Event Name | Trigger | Properties | Priority |
|------------|---------|------------|----------|
| feature_viewed | Page load | source, user_segment | P0 |
| feature_action_taken | Button click | action_type, success | P0 |
| feature_completed | Goal reached | time_to_complete | P0 |
| feature_error | Error occurs | error_type, step | P1 |
| feature_abandoned | Exit without complete | last_step, time_spent | P1 |

### User Properties to Update

| Property | Type | When Updated |
|----------|------|--------------|
| has_used_feature | boolean | First usage |
| feature_usage_count | integer | Each usage |
| feature_last_used | timestamp | Each usage |

### Success Metrics

| Metric | Definition | Target | Dashboard |
|--------|-----------|--------|-----------|
| Adoption rate | Users who tried ÷ Eligible | 30% week 1 | Feature |
| Completion rate | Completed ÷ Started | >70% | Feature |
| Error rate | Errors ÷ Attempts | <5% | Quality |
```

### Phase 4: Dashboard Design

#### Dashboard Hierarchy

```markdown
## Dashboard Levels

### Level 1: Executive Dashboard
- Audience: C-suite, Board
- Refresh: Weekly/Monthly
- Metrics: North Star, revenue, growth
- Format: Single page, trend focus

### Level 2: Product Health Dashboard
- Audience: Product leadership
- Refresh: Daily
- Metrics: Pillar metrics, key funnels
- Format: Interactive, drill-down capable

### Level 3: Feature Dashboards
- Audience: Product teams
- Refresh: Real-time
- Metrics: Feature-specific KPIs
- Format: Detailed, diagnostic views

### Level 4: Operational Dashboards
- Audience: Engineering, Support
- Refresh: Real-time
- Metrics: Performance, errors, queues
- Format: Alerting-enabled
```

#### Dashboard Design Principles

```markdown
## Dashboard Best Practices

### Visual Hierarchy
1. Most important metric: top-left, largest
2. Supporting context: below or right
3. Diagnostic detail: lower sections
4. Actions: clearly labeled buttons

### Chart Selection Guide

| Data Type | Recommended Chart | When to Use |
|-----------|------------------|-------------|
| Trend over time | Line chart | Showing change |
| Part of whole | Pie/Donut | <6 categories |
| Comparison | Bar chart | Ranking items |
| Distribution | Histogram | Spread analysis |
| Correlation | Scatter plot | Relationship |
| Funnel | Funnel chart | Conversion flow |
| Cohort | Heat map | Retention patterns |

### Common Mistakes to Avoid
- Too many metrics (>10-12 on one view)
- No context (missing benchmarks/targets)
- Misleading scales (truncated axes)
- Vanity metrics without actionability
- Missing time period labels
- No definition of metric calculation
```

### Phase 5: Analysis and Action

#### Cohort Analysis Framework

```markdown
## Cohort Analysis Guide

### Retention Cohort Table

         | Week 0 | Week 1 | Week 2 | Week 3 | Week 4 |
---------|--------|--------|--------|--------|--------|
Jan W1   | 1,000  | 450    | 320    | 280    | 250    |
Jan W2   | 1,200  | 500    | 350    | 300    |        |
Jan W3   | 1,100  | 520    | 360    |        |        |
Jan W4   | 1,300  | 580    |        |        |        |

### Retention Rate View

         | Week 0 | Week 1 | Week 2 | Week 3 | Week 4 |
---------|--------|--------|--------|--------|--------|
Jan W1   | 100%   | 45%    | 32%    | 28%    | 25%    |
Jan W2   | 100%   | 42%    | 29%    | 25%    |        |
Jan W3   | 100%   | 47%    | 33%    |        |        |
Jan W4   | 100%   | 45%    |        |        |        |

### Reading Cohort Tables
- Rows: Cohorts (by signup date)
- Columns: Time since signup
- Values: Users active (or % retained)
- Diagonal patterns: Period-specific events
- Row patterns: Cohort quality differences
- Column patterns: Product improvements
```

#### Metric Investigation Framework

```markdown
## Metric Deep Dive Process

### Step 1: Quantify the Change
- What changed? (metric name and direction)
- How much? (absolute and percentage)
- When? (date range affected)
- Compared to what? (baseline period)

### Step 2: Segment Analysis
- By user segment (new vs. existing)
- By platform (web vs. mobile)
- By geography (region/country)
- By acquisition source
- By plan type (free vs. paid)

### Step 3: Correlate Events
- Product changes deployed
- Marketing campaigns launched
- External factors (seasonality, news)
- Technical incidents
- Competitive actions

### Step 4: Hypothesis Formation
- List possible causes
- Estimate likelihood of each
- Identify data to validate/invalidate

### Step 5: Action Decision
- If cause identified: Plan response
- If uncertain: Design test
- If noise: Document and monitor
```


## References
- `references/tools-templates.md` — Tools & Templates
