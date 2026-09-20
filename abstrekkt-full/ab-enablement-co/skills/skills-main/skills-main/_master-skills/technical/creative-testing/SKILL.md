---
name: creative-testing
description: Helps build and debug creative testing processes. Comprehensive creative concept and asset testing methodology. Use when validating creative concepts before launch, conducting A/B tests on creative elements, measuring ad effectiveness, testing messaging and visual approaches, or optimizing creative performance through experimentation.
---

# Creative Testing Skill

> Master creative validation with concept testing, A/B experimentation, and performance optimization to maximize creative effectiveness before and during campaigns.

## Overview

Creative testing is the systematic evaluation of creative concepts, assets, and elements to predict and optimize performance before full investment. This skill enables creative teams to validate ideas with target audiences, identify winning variations through controlled experiments, and continuously improve creative effectiveness through data-driven iteration. It balances creative intuition with empirical validation to reduce risk and maximize impact.

## Why This Matters

### For Creative Teams
- Validates creative directions before major investment
- Provides objective feedback to resolve stakeholder debates
- Enables rapid iteration based on audience response
- Builds confidence in creative recommendations

### For Business Results
- Reduces risk of creative underperformance
- Maximizes return on creative investment
- Accelerates time to effective creative
- Provides competitive advantage through optimization

### For Strategic Decision-Making
- Evidence-based creative selection
- Quantified performance predictions
- Clear optimization roadmap
- Stakeholder alignment through data

## When to Use

### Primary Triggers
- New campaign creative development
- Major creative refresh or rebrand
- High-investment creative decisions
- Conflicting creative directions to resolve
- Entering new markets or audiences
- Continuous optimization programs

### Use This Skill When
- Need to choose between creative concepts
- Want to validate creative before full production
- Optimizing existing creative performance
- Testing new messaging or visual approaches
- Entering unfamiliar markets or segments
- Stakeholders disagree on creative direction

### Do Not Use When
- Measuring long-term brand health (use brand-tracking)
- Analyzing existing content performance (use content-performance)
- Understanding audience needs (use audience-research)
- Seeking creative inspiration (use inspiration-curation)

## Core Processes

### Creative Testing Framework

```yaml
testing_framework:
  testing_types:
    concept_testing:
      purpose: "Evaluate creative concepts before full production"
      timing: "Early in creative development"
      methods:
        - "Concept boards/animatics"
        - "Survey-based evaluation"
        - "Focus group discussion"
        - "Online qualitative platforms"

      metrics:
        - "Concept appeal"
        - "Message comprehension"
        - "Brand fit"
        - "Purchase intent impact"
        - "Differentiation"

    asset_testing:
      purpose: "Evaluate finished or near-finished creative"
      timing: "Before launch"
      methods:
        - "Quantitative ad testing"
        - "Eye tracking"
        - "Facial coding"
        - "Attention measurement"

      metrics:
        - "Attention/breakthrough"
        - "Brand linkage"
        - "Message recall"
        - "Emotional response"
        - "Action intent"

    in_market_testing:
      purpose: "Optimize live creative performance"
      timing: "During campaign"
      methods:
        - "A/B testing"
        - "Multivariate testing"
        - "Geo testing"
        - "Holdout experiments"

      metrics:
        - "Click-through rate"
        - "Conversion rate"
        - "Cost efficiency"
        - "Brand lift"

    element_testing:
      purpose: "Isolate specific creative element impact"
      timing: "Any phase"
      elements:
        - "Headlines/copy"
        - "Images/video"
        - "Colors/design"
        - "Call-to-action"
        - "Format/layout"
```

### Concept Testing Methodology

```yaml
concept_testing_process:
  preparation:
    stimulus_development:
      requirements:
        - "Consistent presentation format"
        - "Comparable level of finish"
        - "Clear concept articulation"
        - "Appropriate fidelity for stage"

      formats:
        rough_concepts:
          materials: "Written descriptions, mood boards"
          use_case: "Early direction screening"

        concept_boards:
          materials: "Visual layout with key copy"
          use_case: "Creative direction validation"

        animatics:
          materials: "Animated storyboards with audio"
          use_case: "Video/TV concept testing"

        finished_creative:
          materials: "Production-ready assets"
          use_case: "Final validation"

    test_design:
      monadic_design:
        description: "Each respondent sees one concept"
        advantages: "No order effects, clean comparison"
        disadvantages: "Larger sample needed"
        sample: "n=150+ per concept"

      sequential_monadic:
        description: "Each respondent sees multiple concepts"
        advantages: "Smaller sample, relative comparison"
        disadvantages: "Order effects, fatigue"
        sample: "n=200+ total, rotate order"

      competitive_testing:
        description: "Test against competitor creative"
        use_case: "Benchmark performance potential"

  evaluation_criteria:
    standard_metrics:
      appeal:
        question: "Overall, how appealing is this [ad/concept]?"
        scale: "5-point scale: Extremely to Not at all"
        benchmark: "Top 2 box vs norms"

      relevance:
        question: "How relevant is this to you personally?"
        scale: "5-point scale"
        benchmark: "Category norms"

      uniqueness:
        question: "How different is this from other [category] advertising?"
        scale: "5-point scale"
        benchmark: "Distinctiveness threshold"

      brand_fit:
        question: "How well does this fit with [brand]?"
        scale: "5-point scale"
        benchmark: "Brand consistency threshold"

      message_takeaway:
        question: "What is the main message of this ad?"
        type: "Open-ended, coded"
        benchmark: "70%+ correct message"

      purchase_impact:
        question: "After seeing this, how likely are you to consider [brand]?"
        scale: "5-point scale"
        benchmark: "Lift vs control"

    diagnostic_metrics:
      attention_elements:
        question: "What caught your attention?"
        type: "Open-ended or click-mapping"

      emotional_response:
        question: "How did this ad make you feel?"
        type: "Emotion selection or open-ended"

      confusion_points:
        question: "Was anything confusing or unclear?"
        type: "Open-ended"

      improvement_suggestions:
        question: "What would make this more appealing?"
        type: "Open-ended"
```

### A/B Testing Methodology

```yaml
ab_testing_framework:
  test_design:
    hypothesis_formation:
      structure: "If we [change], then [metric] will [improve] by [amount]"
      requirements:
        - "Specific, measurable outcome"
        - "Reasonable expected effect size"
        - "Clear success criteria"

    variable_selection:
      principles:
        - "Test one variable at a time for clear learning"
        - "Ensure meaningful difference between variants"
        - "Consider downstream impact"

      common_test_variables:
        headlines:
          - "Benefit-focused vs feature-focused"
          - "Question vs statement"
          - "Long vs short"
          - "With numbers vs without"

        images:
          - "Product vs lifestyle"
          - "Person vs no person"
          - "Color palette variations"
          - "Photography vs illustration"

        cta:
          - "Button text variations"
          - "Button color/size"
          - "Placement/prominence"

        layout:
          - "Copy-heavy vs visual-heavy"
          - "Single vs multi-image"
          - "Format variations"

  sample_size_calculation:
    factors:
      - "Baseline conversion rate"
      - "Minimum detectable effect"
      - "Statistical confidence level (typically 95%)"
      - "Statistical power (typically 80%)"

    tools:
      - "Optimizely sample size calculator"
      - "VWO sample size calculator"
      - "Custom statistical calculators"

    guidance:
      typical_samples:
        email_subject_lines: "5,000+ per variant"
        landing_pages: "1,000+ conversions per variant"
        ad_creative: "10,000+ impressions per variant"

  execution:
    randomization:
      method: "Random assignment to variants"
      requirement: "Equal distribution across variants"
      verification: "Check segment balance"

    duration:
      minimum: "Full business cycle (typically 1-2 weeks)"
      maximum: "Until statistical significance or timeout"
      considerations:
        - "Day-of-week effects"
        - "Seasonal factors"
        - "Sufficient sample accumulation"

    monitoring:
      frequency: "Daily check-ins"
      stopping_rules:
        - "Clear winner at significance threshold"
        - "Neither variant likely to win (futility)"
        - "External factors invalidate test"

  analysis:
    statistical_testing:
      method: "Chi-square or t-test depending on metric"
      threshold: "p < 0.05 for significance"
      confidence_interval: "Report 95% CI for effect size"

    segmentation_analysis:
      purpose: "Identify differential effects by segment"
      caution: "Pre-planned segments only to avoid multiple testing bias"

    learning_documentation:
      elements:
        - "Hypothesis and test design"
        - "Results with statistical detail"
        - "Business interpretation"
        - "Recommended actions"
        - "Future test ideas"
```

## Tools & Templates

### Creative Test Plan Template

```markdown
# Creative Test Plan

## Test Overview
**Test Name**: [Descriptive name]
**Test ID**: [Tracking ID]
**Test Owner**: [Name]
**Date**: [Plan date]

## Business Context
**Campaign/Initiative**: [Name]
**Investment Level**: [Budget scope]
**Decision Timeline**: [When results needed]

## Test Objectives
**Primary Question**: What are we trying to learn?
**Decision to be Made**: What will we do differently based on results?

## Hypothesis
If we [specific creative change], then [specific metric] will [improve/change] because [rationale].

**Expected Effect Size**: [X% improvement]
**Minimum Acceptable Effect**: [Y% improvement]

## Test Design

### What We're Testing
**Variable**: [Specific element being tested]
**Control (A)**: [Description of control version]
**Variant (B)**: [Description of test version]
[Add variants C, D as needed]

### What We're Holding Constant
- [Element 1]
- [Element 2]
- [Element 3]

### Creative Stimuli
[Attach or link to creative assets]

## Methodology
**Test Type**: [Concept test / A/B test / Multivariate / etc.]
**Platform/Tool**: [Testing platform]
**Sample Size**: [n=X per variant]
**Duration**: [Estimated duration]
**Target Audience**: [Audience definition]

## Success Metrics

### Primary Metric
| Metric | Current Baseline | Success Threshold | Stretch Goal |
|--------|------------------|-------------------|--------------|
| [Metric] | X% | X%+ | X%+ |

### Secondary Metrics
| Metric | Baseline | Expected Direction |
|--------|----------|--------------------|
| [Metric 1] | X% | Improve/Maintain |
| [Metric 2] | X% | Improve/Maintain |

### Guardrail Metrics
| Metric | Acceptable Range |
|--------|------------------|
| [Metric] | Not below X% |

## Timeline
| Milestone | Date |
|-----------|------|
| Creative finalized | [Date] |
| Test launch | [Date] |
| Interim check | [Date] |
| Test end | [Date] |
| Results delivery | [Date] |

## Decision Framework
**If A wins**: [Action]
**If B wins**: [Action]
**If inconclusive**: [Action]

## Risks and Mitigations
| Risk | Mitigation |
|------|------------|
| [Risk 1] | [Mitigation] |
| [Risk 2] | [Mitigation] |

## Approvals
| Role | Name | Approval Date |
|------|------|---------------|
| Creative Lead | | |
| Marketing Lead | | |
| Analytics Lead | | |
```

### Test Results Report Template

```markdown
# Creative Test Results

## Test Summary
**Test Name**: [Name]
**Test ID**: [ID]
**Test Period**: [Start - End Date]
**Test Owner**: [Name]

## Executive Summary
[2-3 sentences: What we tested, what we learned, what we recommend]

### Key Result
**Winner**: [Variant X]
**Primary Metric Lift**: [+X%]
**Statistical Confidence**: [X%]
**Recommendation**: [Clear action]

## Test Details

### What We Tested
[Brief description with visual of variants]

### Hypothesis Recap
Original hypothesis: [Statement]
**Hypothesis Confirmed/Rejected**: [Result]


## References
- `references/results.md` — Results
