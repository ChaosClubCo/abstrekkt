---
name: feature-prioritization
category: strategy-consulting
subcategory: front-of-house
description: Comprehensive feature prioritization methodology including RICE, ICE, weighted scoring, and advanced frameworks. Use when prioritizing product backlog, making build decisions, or allocating development resources.
version: 1.0.0
author: IntInc Strategy Skills
tags:
  - prioritization
  - rice-framework
  - ice-scoring
  - weighted-scoring
  - backlog-management
  - resource-allocation
complexity: intermediate
time_horizon: sprint-to-quarterly
stakeholders:
  - product-management
  - engineering
  - design
  - executive-leadership
  - sales
outputs:
  - prioritized-backlog
  - scoring-framework
  - trade-off-analysis
  - resource-allocation-plan
  - priority-rationale
---

# Feature Prioritization

## Overview

Feature prioritization is the systematic process of determining which features, improvements, or initiatives should receive development resources and in what order. Effective prioritization transforms an overwhelming backlog into a focused, strategic sequence that maximizes value delivery while managing resource constraints and stakeholder expectations.

Prioritization frameworks provide objective, transparent methods for making difficult trade-off decisions. They replace opinion-driven debates with evidence-based discussions, create alignment across teams, and ensure resources flow to the highest-impact opportunities. The best prioritization approaches combine quantitative scoring with qualitative judgment, recognizing that not all factors can be reduced to numbers.

### Why This Matters

Poor prioritization is one of the most common causes of product failure and organizational frustration. Teams that lack clear prioritization frameworks often build features that don't move key metrics, waste resources on low-impact work, and create internal conflict over competing priorities. Effective prioritization can increase feature success rates by 2-3x while dramatically reducing wasted development cycles and improving team morale through clarity and purpose.

## When to Use

### Primary Triggers

- **Quarterly Planning**: Setting priorities for upcoming development cycles
- **Backlog Grooming**: Regular maintenance of prioritized feature list
- **Resource Allocation**: Determining team or budget allocation
- **Stakeholder Conflict**: Resolving competing priority requests
- **Strategy Shift**: Reprioritizing after strategic direction change
- **Capacity Constraints**: Too many requests for available resources

### Specific Use Cases

| Scenario | Prioritization Focus | Recommended Framework |
|----------|---------------------|----------------------|
| Early-stage startup | PMF experiments | ICE for speed |
| Growth-stage product | Scaling features | RICE for balance |
| Enterprise product | Complex stakeholders | Weighted scoring |
| Platform decisions | Long-term investments | Strategic fit matrix |
| Bug vs. feature | Severity comparison | Severity-impact matrix |
| Technical debt | Engineering priorities | Cost of delay |

### Decision Complexity Guide

| Complexity | Characteristics | Approach |
|------------|-----------------|----------|
| Low | Clear winner, small scope | Quick stack rank |
| Medium | Multiple viable options | Single framework |
| High | Significant trade-offs | Multiple frameworks |
| Very High | Strategic implications | Framework + committee |

## Core Processes

### Phase 1: Framework Selection

#### Framework Comparison Matrix

```markdown
## Prioritization Framework Selection

### Framework Overview

| Framework | Best For | Pros | Cons |
|-----------|----------|------|------|
| RICE | Balanced decisions | Comprehensive, objective | Effort to score |
| ICE | Quick prioritization | Fast, simple | Less rigorous |
| Weighted Scoring | Complex trade-offs | Customizable | Setup overhead |
| Kano | Feature categorization | Customer-centric | Requires research |
| MoSCoW | Scope decisions | Simple, fast | Subjective |
| Cost of Delay | Time-sensitive | Economic clarity | Complex calculation |
| Opportunity Scoring | JTBD alignment | Customer needs focus | Research required |

### Selection Criteria
| Factor | Your Situation | Recommended Approach |
|--------|---------------|----------------------|
| Decision urgency | Hours/Days/Weeks | ICE / RICE / Weighted |
| Data availability | Low/Medium/High | MoSCoW / ICE / RICE |
| Stakeholder complexity | Few/Many | Simple / Weighted |
| Strategic importance | Low/High | Quick / Comprehensive |
| Team maturity | Early/Established | Simple / Sophisticated |
```

### Phase 2: RICE Framework

#### RICE Scoring Methodology

```markdown
## RICE Framework

### Formula
**RICE Score = (Reach x Impact x Confidence) / Effort**

### Component Definitions

#### Reach (R)
**Definition**: How many customers will be affected in a given time period

| Scale | Reach | Example |
|-------|-------|---------|
| 10,000+ | All users | Core workflow change |
| 1,000-10,000 | Most users | Dashboard improvement |
| 100-1,000 | Some users | Segment-specific feature |
| 10-100 | Few users | Edge case handling |
| <10 | Individual | Custom request |

**Measurement Period**: Typically per quarter
**Data Sources**: Analytics, customer base size, segment analysis

#### Impact (I)
**Definition**: How much will this move the target metric per customer

| Score | Impact Level | Description |
|-------|-------------|-------------|
| 3 | Massive | Game-changing, 2x+ improvement |
| 2 | High | Significant improvement |
| 1 | Medium | Noticeable improvement |
| 0.5 | Low | Minor improvement |
| 0.25 | Minimal | Barely noticeable |

**Considerations**:
- Which metric are you impacting?
- What's the expected improvement?
- Is there evidence supporting the estimate?

#### Confidence (C)
**Definition**: How confident are you in your estimates

| Score | Confidence | Evidence Level |
|-------|------------|----------------|
| 100% | High | Data, research, proven |
| 80% | Medium | Some evidence, educated guess |
| 50% | Low | Intuition, hypothesis |

**Factors Affecting Confidence**:
- Customer research conducted
- Similar features shipped before
- Data supporting assumptions
- Technical feasibility assessed

#### Effort (E)
**Definition**: Person-months of work required

| Scale | Effort | Typical Scope |
|-------|--------|---------------|
| 0.5 | Half month | Small tweak, config |
| 1 | One month | Single feature |
| 2 | Two months | Multi-feature project |
| 3+ | Quarter+ | Major initiative |

**Considerations**:
- All disciplines (eng, design, QA, PM)
- Integration and testing time
- Documentation and training
- Risk buffer (typically +20-30%)
```

#### RICE Scoring Template

```markdown
## RICE Scoring Worksheet

### Feature: [Feature Name]

#### Reach Analysis
- Target segment size: [N]
- Percentage affected: [X]%
- Time period: Quarterly
- **Reach Score**: [R]

#### Impact Analysis
- Target metric: [Metric]
- Expected improvement: [X]%
- Impact level justification: [Rationale]
- **Impact Score**: [I]

#### Confidence Assessment
- Customer research: Yes/No [Details]
- Data evidence: Yes/No [Details]
- Technical validation: Yes/No [Details]
- **Confidence Score**: [C]%

#### Effort Estimation
- Engineering: [X] person-months
- Design: [X] person-months
- Other: [X] person-months
- Buffer: +20%
- **Total Effort**: [E] person-months

#### RICE Calculation
Score = (R x I x C) / E
Score = ([R] x [I] x [C]) / [E]
**Final RICE Score**: [Score]

### Comparison Table
| Feature | Reach | Impact | Confidence | Effort | RICE Score |
|---------|-------|--------|------------|--------|------------|
| Feature A | | | | | |
| Feature B | | | | | |
| Feature C | | | | | |
```

### Phase 3: ICE Framework

#### ICE Scoring Methodology

```markdown
## ICE Framework

### Formula
**ICE Score = Impact x Confidence x Ease**

### Component Definitions

#### Impact (I)
**Definition**: Relative impact on goal achievement (1-10 scale)

| Score | Impact Level | Description |
|-------|-------------|-------------|
| 10 | Maximum | Fundamental goal achievement |
| 7-9 | High | Major contribution to goal |
| 4-6 | Medium | Meaningful contribution |
| 1-3 | Low | Minor contribution |

#### Confidence (C)
**Definition**: Certainty in impact estimate (1-10 scale)

| Score | Confidence | Basis |
|-------|------------|-------|
| 10 | Certain | Proven, data-backed |
| 7-9 | High | Strong evidence |
| 4-6 | Medium | Some evidence |
| 1-3 | Low | Hypothesis only |

#### Ease (E)
**Definition**: How easy to implement (1-10 scale)

| Score | Ease Level | Timeline |
|-------|------------|----------|
| 10 | Trivial | Days |
| 7-9 | Easy | 1-2 weeks |
| 4-6 | Medium | 2-4 weeks |
| 1-3 | Hard | Month+ |

### ICE Scoring Template
| Feature | Impact (1-10) | Confidence (1-10) | Ease (1-10) | ICE Score |
|---------|---------------|-------------------|-------------|-----------|
| Feature A | | | | |
| Feature B | | | | |
| Feature C | | | | |

### ICE vs. RICE When to Use
| Situation | Framework | Rationale |
|-----------|-----------|-----------|
| Quick decisions | ICE | Simpler, faster |
| Growth experiments | ICE | Iteration speed |
| Major investments | RICE | More precision |
| Stakeholder alignment | RICE | More transparent |
```

### Phase 4: Weighted Scoring

#### Weighted Scoring Framework

```markdown
## Weighted Scoring Model

### Step 1: Define Criteria
| Criterion | Description | Weight |
|-----------|-------------|--------|
| Strategic Alignment | Supports company objectives | 25% |
| Customer Value | Solves significant pain | 25% |
| Revenue Impact | Drives acquisition/expansion | 20% |
| Effort Required | Development investment | 15% |
| Risk Level | Technical/market risk | 15% |
| **Total** | | 100% |

### Step 2: Define Scoring Scale
| Score | Description | Example |
|-------|-------------|---------|
| 5 | Exceptional | Directly achieves strategic goal |
| 4 | Strong | Significantly advances goal |
| 3 | Moderate | Meaningfully contributes |
| 2 | Weak | Minor contribution |
| 1 | Minimal | Barely relevant |
| 0 | None | No connection |

### Step 3: Score Each Feature
#### Feature: [Name]

| Criterion | Weight | Score (0-5) | Weighted Score |
|-----------|--------|-------------|----------------|
| Strategic Alignment | 25% | [X] | [W x S] |
| Customer Value | 25% | [X] | [W x S] |
| Revenue Impact | 20% | [X] | [W x S] |
| Effort Required* | 15% | [X] | [W x S] |
| Risk Level* | 15% | [X] | [W x S] |
| **Total** | 100% | | **[Sum]** |

*For Effort and Risk, invert scoring (5 = low effort/risk = good)

### Step 4: Compare and Rank
| Feature | Strategic | Customer | Revenue | Effort | Risk | Total |
|---------|-----------|----------|---------|--------|------|-------|
| Feature A | | | | | | |
| Feature B | | | | | | |
| Feature C | | | | | | |
```

#### Custom Criteria Development

```markdown
## Criteria Selection Guide

### Common Prioritization Criteria

#### Customer-Focused
- Customer value/pain severity
- Number of customers affected
- Customer retention impact
- User satisfaction improvement
- Support ticket reduction

#### Business-Focused
- Revenue impact
- Strategic alignment
- Competitive advantage
- Market opportunity
- Brand enhancement

#### Execution-Focused
- Development effort
- Technical risk
- Dependencies
- Time to market
- Resource availability

#### Risk-Focused
- Technical complexity
- Market uncertainty
- Integration challenges
- Regulatory risk
- Security considerations

### Criteria Selection Best Practices
1. Use 5-7 criteria maximum
2. Ensure criteria are independent (not overlapping)
3. Weight must sum to 100%
4. Define each criterion clearly
5. Create scoring rubrics for consistency
6. Review and adjust weights periodically
```

### Phase 5: Advanced Frameworks

#### Kano Model Analysis

```markdown
## Kano Model Framework

### Feature Categories

#### Must-Have (Basic)
- Expected by customers
- Absence causes dissatisfaction
- Presence doesn't increase satisfaction
- **Example**: Login functionality, data security

#### Performance (Linear)
- More is better
- Directly correlates with satisfaction
- Competitive differentiator
- **Example**: Speed, storage, features

#### Delighters (Excitement)
- Unexpected positive features
- Absence doesn't cause dissatisfaction
- Creates differentiation and loyalty
- **Example**: Innovative features, surprise upgrades

#### Indifferent
- Customers don't care either way
- No impact on satisfaction
- **Action**: Deprioritize

#### Reverse
- Causes dissatisfaction when present
- **Action**: Remove or make optional

### Kano Survey Question Format
**Functional**: "How would you feel if [feature] was included?"
**Dysfunctional**: "How would you feel if [feature] was NOT included?"

| Response Options |
|-----------------|
| I would like it |
| I expect it |
| I'm neutral |
| I can tolerate it |
| I would dislike it |

### Kano Analysis Matrix
|  | Like | Expect | Neutral | Tolerate | Dislike |
|--|------|--------|---------|----------|---------|
| **Like** | Q | A | A | A | O |
| **Expect** | R | I | I | I | M |
| **Neutral** | R | I | I | I | M |
| **Tolerate** | R | I | I | I | M |
| **Dislike** | R | R | R | R | Q |

Q=Questionable, A=Attractive, O=One-dimensional, M=Must-be, R=Reverse, I=Indifferent
```

#### Cost of Delay Analysis

```markdown
## Cost of Delay Framework

### Formula
**CD3 Score = Cost of Delay / Duration**

### Cost of Delay Components

#### 1. User/Business Value
- Revenue opportunity
- Cost savings
- Strategic positioning

#### 2. Time Criticality
- Market window
- Competitive pressure
- Regulatory deadline

#### 3. Risk Reduction
- Technical risk mitigation
- Market risk reduction
- Dependency resolution

### Cost of Delay Profiles

#### Standard
- Linear value over time
- No deadline pressure
- Delay = Proportional loss

#### Fixed Date
- Deadline-driven
- Value drops after date
- Delay past date = Major loss

#### Urgent
- Immediate need
- Rapid value decay
- Delay = Exponential loss

#### Intangible
- Strategic value
- Hard to quantify
- Enabling future options

### Cost of Delay Calculation

| Feature | Weekly CoD | Duration (weeks) | CD3 Score |
|---------|------------|------------------|-----------|
| Feature A | $50K | 4 | 12.5 |
| Feature B | $30K | 2 | 15.0 |
| Feature C | $80K | 8 | 10.0 |

**Priority Order**: B, A, C (highest CD3 first)
```

#### MoSCoW Method

```markdown


## References
- `references/moscow-prioritization.md` — MoSCoW Prioritization
