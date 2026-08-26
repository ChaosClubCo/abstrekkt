---
name: paid-advertising
description: Paid advertising campaign management toolkit for planning, executing, and optimizing ad campaigns across Google Ads, Meta, and programmatic platforms. Use when building ad strategies, optimizing ROAS, or managing multi-channel ad budgets.
---

# Paid Advertising

## Overview

Paid advertising is the fastest lever for driving measurable business growth, but it demands disciplined structure, continuous optimization, and rigorous budget governance. A well-built campaign architecture determines whether ad spend compounds into profitable revenue or bleeds money into irrelevant impressions. This skill covers the full lifecycle of paid advertising: strategic planning, campaign structure, audience targeting, creative testing, bid management, budget allocation, and performance reporting across Google Ads, Meta Ads, LinkedIn, TikTok, and programmatic display/video platforms.

### Why This Matters
- Misstructured campaigns waste 20-40% of ad spend on irrelevant traffic
- Proper audience segmentation can improve ROAS by 3-5x over broad targeting
- Systematic creative testing compounds performance gains over time
- Budget allocation models prevent overspending on underperforming channels

## Core Workflow

1. **Define Campaign Objectives** -- Align advertising goals with business KPIs. Choose from awareness (CPM/reach), consideration (CPC/engagement), or conversion (CPA/ROAS) objectives. Document target metrics before any spend is allocated.

2. **Research and Segment Audiences** -- Build audience layers from first-party data (CRM lists, site visitors, purchasers), second-party data (lookalikes, similar audiences), and third-party data (interest/behavior segments). Map each audience to a funnel stage.

3. **Design Campaign Architecture** -- Structure accounts using a consistent hierarchy: Campaign > Ad Group/Ad Set > Ad. Separate campaigns by objective, geography, and funnel stage. Use naming conventions that encode targeting and creative metadata.

4. **Develop Creative Assets** -- Produce ad variations across formats (static, carousel, video, responsive). Build at least 3-5 creative variants per ad group to enable statistical testing. Align messaging to funnel stage and audience segment.

5. **Configure Bidding and Budgets** -- Select bid strategies based on data maturity. Start with manual or target CPA bidding until conversion volume reaches 30-50 per week, then shift to automated bidding. Allocate budgets proportionally to expected return.

6. **Launch with Monitoring Gates** -- Set day-one monitoring checkpoints at 2h, 8h, and 24h post-launch. Verify tracking fires correctly, spend pacing is on target, and no ad disapprovals exist.

7. **Optimize Iteratively** -- Review performance weekly. Pause underperformers, scale winners, test new variables. Follow the optimization priority: audience > offer > creative > bid > placement.

8. **Report and Reallocate** -- Generate weekly and monthly reports. Use attribution data to shift budget toward highest-returning channels and campaigns. Document learnings for future campaigns.

## Templates

### Campaign Naming Convention

```
{Platform}_{Objective}_{Audience}_{GEO}_{FunnelStage}_{CreativeType}_{Date}

Examples:
META_CONV_Lookalike2pct_US_BOF_Video_2025Q1
GADS_LEAD_InMarket-CRM_UK_MOF_RSA_2025M03
LNKD_AWARE_ITDecisionMakers_NA_TOF_Carousel_2025Q2
TIKTOK_CONV_Retarget30d_US_BOF_Spark_2025M04
```

### Campaign Structure Template

```
Account: [Brand Name]
|
+-- Campaign: CONV_Search_Brand_US
|   +-- Ad Group: Brand Exact
|   +-- Ad Group: Brand Phrase
|   +-- Ad Group: Brand + Product
|
+-- Campaign: CONV_Search_NonBrand_US
|   +-- Ad Group: Category Terms
|   +-- Ad Group: Competitor Terms
|   +-- Ad Group: Long-Tail Questions
|
+-- Campaign: CONV_Shopping_AllProducts_US
|   +-- Product Group: Best Sellers
|   +-- Product Group: New Arrivals
|   +-- Product Group: Clearance
|
+-- Campaign: AWARE_Display_Prospecting_US
|   +-- Ad Group: In-Market Audiences
|   +-- Ad Group: Custom Intent
|   +-- Ad Group: Affinity Segments
|
+-- Campaign: CONV_Remarketing_AllVisitors_US
    +-- Ad Group: Cart Abandoners (1-7d)
    +-- Ad Group: Product Viewers (8-30d)
    +-- Ad Group: Past Purchasers (Upsell)
```

### Budget Allocation Model

| Channel          | Funnel Stage | % of Budget | Target KPI     | Expected ROAS |
|------------------|--------------|-------------|----------------|---------------|
| Google Search    | BOF          | 35%         | CPA < $25      | 5.0x          |
| Google Shopping  | BOF          | 20%         | ROAS > 4.0x    | 4.5x          |
| Meta Retargeting | BOF          | 15%         | CPA < $20      | 6.0x          |
| Meta Prospecting | TOF/MOF      | 15%         | CPL < $15      | 2.5x          |
| YouTube/Display  | TOF          | 10%         | CPM < $8       | 1.5x          |
| LinkedIn         | MOF          | 5%          | CPL < $50      | 2.0x          |

### Audience Targeting Framework

| Audience Layer      | Source                        | Funnel Stage | Bid Modifier |
|---------------------|-------------------------------|--------------|--------------|
| Purchasers (Upsell) | CRM / Pixel                  | BOF          | +40%         |
| Cart Abandoners      | Pixel (1-7 days)            | BOF          | +30%         |
| Site Visitors        | Pixel (8-30 days)           | MOF          | +20%         |
| Lookalike 1%         | Seed: Purchasers            | MOF          | +10%         |
| Lookalike 2-5%       | Seed: All Converters        | TOF/MOF      | Baseline     |
| In-Market Segments   | Google/Meta behavioral data | TOF          | -10%         |
| Broad / Interest     | Platform targeting          | TOF          | -20%         |

## Best Practices

### Bid Strategy Selection

| Scenario                            | Recommended Strategy          | Platform        |
|-------------------------------------|-------------------------------|-----------------|
| New campaign, no conversion data    | Manual CPC / Cost Cap         | All             |
| 30-50 conversions/week accumulated  | Target CPA / Cost Per Result  | Google / Meta   |
| 100+ conversions/week, stable CPA   | Target ROAS / Value Optimize  | Google / Meta   |
| Brand awareness campaign            | Target CPM / Reach            | Meta / Display  |
| Limited budget, high-value leads    | Maximize Conversions (capped) | Google          |

### Creative Testing Protocol

1. **Isolate one variable per test** -- Change only headline, image, CTA, or copy per variant. Never test multiple variables simultaneously.
2. **Run to statistical significance** -- Minimum 1,000 impressions and 30 conversions per variant before declaring a winner. Use a 95% confidence threshold.
3. **Document every test** -- Record hypothesis, variants, duration, sample size, and result. Build a testing knowledge base.
4. **Test cadence** -- Launch 2-3 new creative tests per ad group per month. Refresh winning creatives every 4-6 weeks to combat fatigue.

### Budget Pacing Rules

- Daily budgets should be set at 1/30th of the monthly target, not 1/30.4
- Never increase daily budget by more than 20% in a single adjustment (avoids re-entering learning phase)
- Pause spend on campaigns exceeding 120% of target CPA for 3+ consecutive days
- Reallocate budget from channels with declining marginal returns weekly

### Platform-Specific Guidelines

**Google Ads**
- Use exact and phrase match only; avoid broad match without smart bidding
- Enable sitelink, callout, and structured snippet extensions on all search campaigns
- Set impression share targets for brand campaigns (>90%)

**Meta Ads**
- Use Advantage+ placements unless testing specific placements
- Set campaign budget optimization (CBO) at the campaign level for 3+ ad sets
- Minimum audience size: 1M+ for prospecting, 1K+ for retargeting

**LinkedIn Ads**
- Target by job title and company size rather than broad industry
- Minimum recommended budget: $100/day per campaign
- Use Lead Gen Forms over landing pages for 2-3x higher conversion rates

## Common Patterns

### Pattern 1: Full-Funnel Launch Sequence

**Week 1-2**: Launch retargeting campaigns first to capture existing demand and validate tracking. Target site visitors, email subscribers, and past purchasers.

**Week 3-4**: Launch mid-funnel campaigns targeting lookalike audiences and in-market segments. Optimize for lead or add-to-cart events.

**Week 5-6**: Launch top-of-funnel awareness campaigns on display, video, and social. Optimize for reach and engagement while building retargeting pools.

**Week 7+**: Full funnel running. Shift budget allocation based on performance data. Scale winning audiences, pause underperformers.

### Pattern 2: Competitor Conquest Campaign

1. Research competitor keywords and landing pages
2. Create comparison-focused ad copy highlighting differentiation
3. Build dedicated landing pages with feature comparison tables
4. Set higher CPCs (expect 20-40% premium over non-brand terms)
5. Monitor competitor response and adjust messaging

### Pattern 3: Seasonal Budget Surge

1. Identify peak demand periods from historical data (Black Friday, back-to-school, etc.)
2. Increase budgets 2-4 weeks before peak to build audience pools
3. Pre-approve creative assets and landing pages
4. Set automated rules to increase bids during peak hours/days
5. Post-season: analyze incrementality and document learnings

### Pattern 4: Attribution Troubleshooting

When reported ROAS diverges from actual revenue:
1. Check pixel/tag firing on all conversion pages
2. Compare platform-reported conversions with backend data
3. Evaluate attribution windows (Meta default 7-day click, 1-day view)
4. Implement UTM parameters for GA4 cross-reference
5. Consider incrementality testing (holdout groups) for true impact measurement

## Output Formats

### Weekly Performance Report

```
Campaign Performance Report: [Brand] - Week of [Date]
================================================================

EXECUTIVE SUMMARY
- Total Spend: $X,XXX / $X,XXX budget (XX% pacing)
- Blended ROAS: X.Xx (target: X.Xx)
- Total Conversions: XXX (CPA: $XX.XX)
- Top Performer: [Campaign Name] - X.Xx ROAS
- Action Required: [Brief recommendation]

CHANNEL BREAKDOWN
| Channel         | Spend    | Revenue  | ROAS  | CPA    | Conv | CTR   |
|-----------------|----------|----------|-------|--------|------|-------|
| Google Search   | $X,XXX   | $XX,XXX  | X.Xx  | $XX.XX | XXX  | X.X%  |
| Google Shopping | $X,XXX   | $XX,XXX  | X.Xx  | $XX.XX | XXX  | X.X%  |
| Meta Ads        | $X,XXX   | $XX,XXX  | X.Xx  | $XX.XX | XXX  | X.X%  |
| LinkedIn        | $XXX     | $X,XXX   | X.Xx  | $XX.XX | XX   | X.X%  |

TOP 5 CAMPAIGNS BY ROAS
1. [Campaign Name] - X.Xx ROAS, $X,XXX revenue
2. [Campaign Name] - X.Xx ROAS, $X,XXX revenue
3. [Campaign Name] - X.Xx ROAS, $X,XXX revenue
4. [Campaign Name] - X.Xx ROAS, $X,XXX revenue
5. [Campaign Name] - X.Xx ROAS, $X,XXX revenue

UNDERPERFORMERS (Below Target)
- [Campaign Name]: CPA $XX (target $XX) - Recommendation: [action]
- [Campaign Name]: ROAS X.Xx (target X.Xx) - Recommendation: [action]

CREATIVE TEST RESULTS
- Test: [Description] | Winner: [Variant] | Lift: +XX% CTR
- Test: [Description] | Inconclusive | Extending 1 week

NEXT WEEK ACTIONS
1. [Specific optimization action]
2. [Budget reallocation recommendation]
3. [New test to launch]
```

### Monthly Budget Reallocation Memo

```
Monthly Budget Review: [Month Year]
====================================

CURRENT ALLOCATION vs. RECOMMENDED
| Channel         | Current % | Recommended % | Change | Rationale              |
|-----------------|-----------|---------------|--------|------------------------|
| Google Search   | 35%       | 38%           | +3%    | Strong ROAS trend      |
| Google Shopping | 20%       | 22%           | +2%    | New product feed live  |
| Meta Prospecting| 15%       | 12%           | -3%    | CPL rising, fatigue    |
| Meta Retargeting| 15%       | 15%           | --     | Stable performance     |
| YouTube/Display | 10%       | 8%            | -2%    | Low attribution lift   |
| LinkedIn        | 5%        | 5%            | --     | Niche but consistent   |

TOTAL MONTHLY BUDGET: $XX,XXX
PROJECTED ROAS AT NEW ALLOCATION: X.Xx (vs current X.Xx)
```

### Ad Copy Testing Matrix

| Variant | Headline                        | Description                       | CTA           | Hypothesis                    |
|---------|---------------------------------|-----------------------------------|---------------|-------------------------------|
| A (Ctrl)| "Save 20% on [Product]"        | Feature-focused benefit copy      | Shop Now      | Baseline                      |
| B       | "Why 10K+ Customers Chose Us"  | Social proof-focused copy         | See Why       | Social proof > discount       |
| C       | "[Product] Rated #1 in 2025"   | Authority/ranking claim           | Learn More    | Authority signal > discount   |
| D       | "Free Shipping + Easy Returns" | Risk reversal copy                | Order Today   | Risk removal > discount       |

### Campaign Launch Checklist

- [ ] Conversion tracking verified (test purchase/lead submitted)
- [ ] UTM parameters appended to all destination URLs
- [ ] Audience exclusions set (exclude existing customers from prospecting)
- [ ] Negative keyword list applied (Google Search/Shopping)
- [ ] Ad creative approved and rendering correctly on all placements
- [ ] Budget and bid caps configured per strategy document
- [ ] Frequency caps set for display/video campaigns (3-5/week)
- [ ] Landing page load time < 3 seconds on mobile
- [ ] A/B test variants documented with hypotheses
- [ ] Monitoring alerts configured for spend anomalies
- [ ] Stakeholder notification sent with expected ramp timeline
