---
name: roi-calculator-building
description: Build AI implementation ROI models for B2B enterprise sales. Use when creating ROI calculators, building business cases for AI adoption, estimating cost savings from automation, projecting revenue impact of AI features, or preparing financial justification for AI projects. Triggers on ROI analysis, business case, cost-benefit analysis, payback period, TCO, AI investment justification, value engineering.
version: 1.0.0
allowed-tools: Read, Write, Bash
license: MIT
---

# ROI Calculator Building

## Purpose
Build quantitative ROI models for AI implementations that justify enterprise purchases during sales cycles.

## When to Use
- Sales asks: "What's the ROI of this AI solution?"
- Customer needs business case for $500K+ AI investment
- CFO requires payback period analysis
- Competitive deal requires value justification

## Core Workflow

### 1. Identify Cost Savings
```yaml
automation_savings:
  - metric: "Hours saved per employee"
    calculation: "50 hrs/month * $75/hr * 100 employees"
    annual_value: "$4.5M"
    
  - metric: "Reduced support tickets"
    calculation: "10K tickets/month * $15/ticket * 60% deflection"
    annual_value: "$1.08M"
```

### 2. Revenue Impact
```yaml
revenue_uplift:
  - metric: "Faster sales cycles"
    calculation: "30 day reduction * 50 deals/month * $100K ACV"
    annual_value: "$50M pipeline acceleration"
    
  - metric: "Increased conversion"
    calculation: "2% lift * $10M annual revenue"
    annual_value: "$200K"
```

### 3. Cost Structure
```yaml
implementation_costs:
  one_time: "$200K" # Professional services
  annual_recurring: "$150K" # Licenses + infrastructure
  
payback_period: "6 months"
3_year_roi: "450%"
```

## Output Format
Excel calculator with sensitivity analysis + executive summary (see `assets/roi-template.xlsx`)

