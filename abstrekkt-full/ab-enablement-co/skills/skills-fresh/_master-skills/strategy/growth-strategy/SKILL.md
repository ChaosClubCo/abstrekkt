---
name: growth-strategy
description: Growth strategy development including growth lever identification, experimentation frameworks, and scaling methodologies. Use when planning, analyzing, or developing business strategies.
---

# Growth Strategy

## Overview

Growth strategy is the systematic approach to identifying, prioritizing, and optimizing the levers that drive sustainable business growth. This skill encompasses growth modeling, experimentation design, and scaling methodologies that transform growth from art to science.

Effective growth strategy combines analytical rigor with creative problem-solving, using data-driven experimentation to discover what works and disciplined execution to scale successful approaches.

### Core Components

1. **Growth Modeling**: Understanding growth mechanics
2. **Lever Identification**: Finding high-impact opportunities
3. **Experimentation Design**: Hypothesis-driven testing
4. **Measurement Framework**: Attribution and analysis
5. **Scaling Systems**: Operationalizing wins
6. **Growth Operations**: Process and infrastructure

## When to Use

### Primary Scenarios

- **Product-Market Fit Achieved**: Ready to accelerate
- **Growth Stall**: Need to identify new levers
- **Efficiency Focus**: Optimizing unit economics
- **New Channel Entry**: Systematic expansion
- **Competitive Pressure**: Defending or gaining share
- **Resource Reallocation**: Investment optimization

### Trigger Indicators

- Growth rate declining or plateauing
- CAC rising faster than LTV
- Conversion rates stagnating
- New customer acquisition slowing
- Expansion revenue underperforming
- Competitive wins decreasing

## Core Processes

### Phase 1: Growth Model Development

#### Growth Equation Framework

```markdown
## Growth Formula Construction

### Basic Growth Equation
Revenue = Visitors x Conversion x ARPU x Retention

### Expanded Model
Revenue = (Organic + Paid + Referral) x
          (Sign-up Rate x Activation x First Purchase) x
          (Average Order Value x Purchase Frequency) x
          (1 - Churn Rate)

### SaaS Growth Model
ARR = New MRR + Expansion MRR - Churn MRR
New MRR = Leads x Conversion x ACV/12
Expansion MRR = Customers x Expansion Rate x Avg Expansion
Churn MRR = Starting MRR x Churn Rate

### Marketplace Growth Model
GMV = Buyers x Orders per Buyer x Average Order Value
Revenue = GMV x Take Rate
```

#### Growth Funnel Mapping

```markdown
## Full-Funnel Growth Model

### Acquisition Stage
| Metric | Definition | Current | Target |
|--------|------------|---------|--------|
| Traffic | Total visitors | X | Y |
| Traffic Sources | Channel breakdown | % | % |
| Lead Capture | Visitors to leads | X% | Y% |
| Lead Quality | Score distribution | X | Y |

### Activation Stage
| Metric | Definition | Current | Target |
|--------|------------|---------|--------|
| Sign-up Rate | Leads to sign-ups | X% | Y% |
| Time to Value | First value moment | X days | Y days |
| Activation Rate | Signed up to activated | X% | Y% |
| Onboarding Complete | Full onboarding | X% | Y% |

### Monetization Stage
| Metric | Definition | Current | Target |
|--------|------------|---------|--------|
| Conversion Rate | Activated to paid | X% | Y% |
| ARPU | Average revenue per user | $X | $Y |
| Upgrade Rate | Plan upgrades | X% | Y% |

### Retention Stage
| Metric | Definition | Current | Target |
|--------|------------|---------|--------|
| Monthly Retention | M2 retention | X% | Y% |
| Annual Retention | Annual survival | X% | Y% |
| NRR | Net revenue retention | X% | Y% |

### Referral Stage
| Metric | Definition | Current | Target |
|--------|------------|---------|--------|
| K-Factor | Viral coefficient | X | Y |
| Referral Rate | Customers who refer | X% | Y% |
| Referral Conversion | Referred leads that convert | X% | Y% |
```

### Phase 2: Growth Lever Identification

#### Lever Prioritization Framework

```markdown
## ICE Scoring Model

### Scoring Dimensions
| Dimension | Definition | Scale |
|-----------|------------|-------|
| Impact | Size of potential effect | 1-10 |
| Confidence | Certainty of success | 1-10 |
| Ease | Speed and resource efficiency | 1-10 |

### ICE Score Calculation
ICE Score = (Impact + Confidence + Ease) / 3

### Lever Inventory
| Lever | Impact | Confidence | Ease | ICE | Priority |
|-------|--------|------------|------|-----|----------|
| [Lever 1] | | | | | |
| [Lever 2] | | | | | |
| [Lever 3] | | | | | |

### Alternative: RICE Framework
| Lever | Reach | Impact | Confidence | Effort | RICE |
|-------|-------|--------|------------|--------|------|
| [Lever 1] | | | | | |
RICE = (Reach x Impact x Confidence) / Effort
```

#### Growth Lever Categories

```markdown
## Lever Taxonomy

### Acquisition Levers
- Organic Search (SEO)
- Content Marketing
- Paid Acquisition
- Referral Programs
- Partnerships
- Product-Led Growth
- Community Building
- PR/Brand Awareness

### Activation Levers
- Onboarding Optimization
- Time to Value Reduction
- Aha Moment Engineering
- User Education
- Personalization
- Friction Removal

### Monetization Levers
- Pricing Optimization
- Packaging/Bundling
- Upgrade Prompts
- Usage-Based Pricing
- Premium Features
- Expansion Selling

### Retention Levers
- Engagement Features
- Habit Formation
- Customer Success
- Re-engagement Campaigns
- Feature Adoption
- Value Realization

### Referral Levers
- Viral Mechanics
- Incentive Programs
- Social Features
- Network Effects
- Customer Advocacy
```

### Phase 3: Experimentation Framework

#### Experiment Design Template

```markdown
## Experiment Brief: [Name]

### Hypothesis
If we [make this change]
Then [this metric] will [improve by X%]
Because [customer behavior insight]

### Experiment Details
| Field | Value |
|-------|-------|
| Owner | [Name] |
| Lever | [Category] |
| Primary Metric | [KPI] |
| Secondary Metrics | [Supporting KPIs] |
| Audience | [Segment] |
| Sample Size | [Required n] |
| Duration | [Weeks] |
| Confidence Level | 95% |
| MDE | [Minimum Detectable Effect] |

### Variants
| Variant | Description |
|---------|-------------|
| Control | [Current experience] |
| Treatment A | [Change description] |
| Treatment B | [Optional additional variant] |

### Success Criteria
- Primary: [Metric] improves by [X%] with statistical significance
- Secondary: [Metrics] don't degrade by more than [Y%]
- Guardrails: [Critical metrics] remain stable

### Implementation
- Dev effort: [Story points or days]
- Dependencies: [Other teams, tools]
- Risks: [Potential issues]
```

#### Experimentation Velocity

```markdown
## Experimentation Rhythm

### Weekly Cadence
| Day | Activity |
|-----|----------|
| Monday | Review last week's results |
| Tuesday | Launch new experiments |
| Wednesday | Mid-week check-ins |
| Thursday | Planning next sprint |
| Friday | Documentation and learning |

### Experiment Pipeline
| Stage | Count | SLA |
|-------|-------|-----|
| Backlog | 15-20 | N/A |
| Ready for Dev | 5-8 | 1 week |
| In Development | 3-5 | 2 weeks |
| Running | 3-5 | 2-4 weeks |
| Analysis | 2-3 | 1 week |
| Rollout | 1-2 | 1 week |

### Success Metrics
- Experiments launched per month: 8-12
- Win rate: 30-40%
- Time to insight: <4 weeks
- Learning velocity: [Key insights per month]
```

#### Statistical Rigor

```markdown
## Statistical Framework

### Sample Size Calculation
n = (Z^2 x p x (1-p)) / E^2

Where:
- Z = Z-score for confidence level (1.96 for 95%)
- p = Expected proportion
- E = Margin of error

### Power Analysis
Required for:
- Minimum Detectable Effect (MDE)
- Required sample size
- Experiment duration

### Significance Testing
- Use appropriate test (t-test, chi-square, etc.)
- Account for multiple comparisons
- Check for novelty effects
- Validate practical significance vs. statistical

### Common Mistakes to Avoid
- Peeking at results before completion
- Ending experiments early
- Ignoring segment differences
- Not accounting for seasonality
- Multiple hypothesis testing without correction
```

### Phase 4: Growth Operations

#### Growth Team Structure

```markdown
## Growth Team Composition

### Core Roles
| Role | Responsibilities | Ratio |
|------|-----------------|-------|
| Growth Lead | Strategy, prioritization | 1 |
| Growth PM | Roadmap, experiments | 1 per 2 engineers |
| Growth Engineer | Implementation | 2-4 |
| Data Analyst | Analysis, insights | 1 per 4 engineers |
| Designer | UX optimization | 0.5-1 |

### Supporting Functions
- Marketing (demand gen, content)
- Product (core product changes)
- Customer Success (retention)
- Sales (conversion optimization)

### Team Evolution
| Stage | Team Size | Focus |
|-------|-----------|-------|
| Early | 2-3 | Full funnel experiments |
| Growing | 5-8 | Specialized squads |
| Scaling | 10+ | Embedded growth pods |
```

#### Growth Process

```markdown
## Weekly Growth Process

### Monday: Review
- Check experiment results
- Update scorecards
- Document learnings

### Tuesday-Wednesday: Planning
- Prioritize backlog
- Scope next experiments
- Cross-functional alignment

### Thursday-Friday: Execution
- Launch experiments
- Monitor performance
- Stakeholder updates

### Monthly Rhythm
| Week | Focus |
|------|-------|
| 1 | Deep analysis and planning |
| 2 | Launch major experiments |
| 3 | Iterate and optimize |
| 4 | Review and strategy |
```

### Phase 5: Scaling Successful Experiments

#### Scaling Framework

```markdown
## Scale Decision Matrix

### Scaling Criteria
| Criterion | Threshold | Weight |
|-----------|-----------|--------|
| Statistical significance | p < 0.05 | Required |
| Practical significance | >10% lift | Required |
| Sustainability | Stable over time | High |
| Scalability | Works at 10x volume | High |
| Resource efficiency | Positive ROI | Medium |

### Scaling Stages
| Stage | Action | Duration |
|-------|--------|----------|
| Validate | Confirm results hold | 1-2 weeks |
| Expand | Increase to 50% traffic | 2 weeks |
| Automate | Build for scale | 2-4 weeks |
| Full Rollout | 100% deployment | 1 week |
| Optimize | Continuous improvement | Ongoing |

### Playbook Development
When an experiment wins, document:
1. What we did
2. Why it worked
3. How to replicate
4. Optimization opportunities
5. Application to other areas
```

#### Growth Playbook Template

```markdown
## Growth Play: [Name]

### Overview
- Lever: [Category]
- Impact: [Typical lift %]
- Effort: [Implementation complexity]
- Time to Results: [Weeks]

### Prerequisites
- [Required conditions]
- [Team capabilities]
- [Tool requirements]

### Step-by-Step Implementation
1. [Step 1]: [Details]
2. [Step 2]: [Details]
3. [Step N]: [Details]

### Measurement
| Metric | How to Measure | Target |
|--------|---------------|--------|
| Primary | [Method] | [Goal] |
| Secondary | [Method] | [Goal] |

### Common Pitfalls
- [Mistake 1]: [How to avoid]
- [Mistake 2]: [How to avoid]

### Case Studies
- [Company X]: [Results achieved]
- [Internal example]: [Results achieved]
```

## Tools and Templates

### Growth Strategy Toolkit

1. **Growth Model Calculator**: Revenue driver simulation
2. **ICE/RICE Prioritization**: Lever scoring framework
3. **Experiment Brief Template**: Standardized design
4. **Results Analysis Template**: Statistical reporting
5. **Growth Playbook Library**: Documented plays
6. **Growth Dashboard Template**: Metric visualization

### Technology Stack

| Category | Tools | Use Case |
|----------|-------|----------|
| Analytics | Amplitude, Mixpanel | Event tracking |
| A/B Testing | Optimizely, LaunchDarkly | Experimentation |
| Attribution | Segment, Branch | Channel attribution |
| CRM/Marketing | HubSpot, Braze | Lifecycle marketing |
| BI | Looker, Mode | Dashboard and analysis |
| Project Mgmt | Notion, Asana | Experiment tracking |

## Metrics and KPIs

### Growth Performance Metrics

```markdown
## Leading Indicators
- Experiment velocity (launches/month)
- Win rate (% of experiments with positive result)
- Time to insight (days to statistical significance)
- Idea backlog depth (weeks of pipeline)

## Lagging Indicators
- Revenue growth rate
- CAC efficiency trend
- LTV:CAC ratio change
- Net revenue retention
- Organic vs. paid mix

## North Star Metric
[Single metric that best captures customer value delivery]
- Weekly Active Users
- Monthly Active Revenue
- Core Feature Adoption Rate
```

## Common Pitfalls

### Growth Strategy Failures

1. **Premature Scaling**: Scaling before PMF
   - *Mitigation*: Validate retention before acquisition

2. **Vanity Metrics**: Tracking wrong measures
   - *Mitigation*: Focus on revenue-correlated metrics

3. **Experiment Overload**: Too many simultaneous tests
   - *Mitigation*: Limit concurrent experiments

4. **Channel Dependency**: Over-reliance on single channel
   - *Mitigation*: Diversification requirements

5. **Short-Term Focus**: Sacrificing LTV for acquisition
   - *Mitigation*: Balance acquisition and retention

6. **Siloed Growth**: Not integrating with product
   - *Mitigation*: Cross-functional growth team

## Integration Points

### Connected Skills

| Skill | Integration Type | Touchpoints |
|-------|-----------------|-------------|
| Business Modeling | Foundation | Unit economics |
| Product Strategy | Alignment | Feature prioritization |
| Market Analysis | Context | Opportunity sizing |
| Customer Segmentation | Focus | Target selection |
| Data Analytics | Enabler | Measurement |

### Organizational Interfaces

```markdown
## Cross-Functional Collaboration

### Product
- Feature prioritization
- Product-led growth
- In-product experiments

### Marketing
- Channel optimization
- Content strategy
- Demand generation

### Sales
- Conversion optimization
- Lead quality
- Sales enablement

### Customer Success
- Retention programs
- Expansion plays
- Churn reduction
```
