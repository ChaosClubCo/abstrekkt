---
name: risk-assessment
description: Enterprise risk identification, risk register development, and mitigation strategy planning. Use when identifying organizational risks, building risk registers, developing mitigation strategies, conducting risk assessments, or implementing enterprise risk management frameworks.
---

# Risk Assessment

> Enterprise risk identification frameworks, risk register development, impact analysis, and mitigation strategy planning for comprehensive risk management.

## Overview

Risk Assessment encompasses the systematic identification, analysis, evaluation, and treatment of risks that could affect organizational objectives. This skill covers risk identification methodologies, qualitative and quantitative risk analysis, risk register development, mitigation strategy design, and the ongoing monitoring and reporting frameworks that enable proactive risk management.

Effective risk assessment provides leadership with visibility into potential threats and opportunities, enabling informed decision-making about risk acceptance, mitigation, transfer, or avoidance. In an increasingly complex business environment, organizations that excel at risk assessment can pursue growth opportunities confidently while maintaining resilience against adverse events.

### Why This Matters

Poor risk management is among the leading causes of business failure and value destruction. Organizations with mature risk assessment capabilities make better strategic decisions, respond more effectively to disruptions, maintain stakeholder confidence, and often achieve lower costs of capital. Beyond defensive value, sophisticated risk assessment enables calculated risk-taking that drives competitive advantage.

## When to Use

### Primary Triggers

- Annual enterprise risk assessment cycle
- New strategic initiative or investment evaluation
- Major change or transformation program
- Regulatory compliance requirements
- Post-incident review and improvement
- Board or audit committee reporting
- M&A due diligence processes

### Specific Use Cases

1. **Enterprise Risk Assessment**: Annual comprehensive risk identification and prioritization
2. **Project Risk Analysis**: Identifying and planning for project-specific risks
3. **Strategic Planning**: Understanding risks associated with strategic options
4. **Compliance Risk Assessment**: Evaluating regulatory and compliance exposure
5. **Operational Risk Review**: Assessing risks in business processes
6. **Third-Party Risk Assessment**: Evaluating vendor and partner risks

## Core Processes

### 1. Risk Identification

**Risk Identification Framework**
```yaml
risk_identification:
  risk_categories:
    strategic_risks:
      description: "Risks to strategy execution and business model"
      examples:
        - "Market disruption"
        - "Competitive threats"
        - "Business model obsolescence"
        - "M&A integration failure"
        - "Reputation damage"

    operational_risks:
      description: "Risks in business operations and processes"
      examples:
        - "Process failures"
        - "Technology outages"
        - "Supply chain disruption"
        - "Human error"
        - "Fraud"

    financial_risks:
      description: "Risks to financial performance and position"
      examples:
        - "Liquidity risk"
        - "Credit risk"
        - "Market risk"
        - "Currency exposure"
        - "Interest rate risk"

    compliance_risks:
      description: "Regulatory and legal compliance exposure"
      examples:
        - "Regulatory changes"
        - "Non-compliance penalties"
        - "Litigation"
        - "Data privacy violations"
        - "Environmental compliance"

    external_risks:
      description: "Risks from external environment"
      examples:
        - "Economic downturn"
        - "Political/geopolitical events"
        - "Natural disasters"
        - "Pandemic"
        - "Climate change"

  identification_methods:
    workshops:
      participants: "Cross-functional stakeholders"
      techniques:
        - "Brainstorming"
        - "SWOT analysis"
        - "Scenario planning"
        - "Pre-mortem analysis"

    interviews:
      targets: "Subject matter experts, leadership"
      focus: "Domain-specific risk identification"

    document_review:
      sources:
        - "Audit reports"
        - "Incident logs"
        - "Industry reports"
        - "Regulatory guidance"
        - "Loss data"

    process_analysis:
      approach: "Walk through key processes"
      focus: "Identify failure points and vulnerabilities"
```

**Risk Identification Techniques**
```markdown
## Risk Identification Methodologies

### PESTLE Analysis (External Risks)
| Category | Risk Questions |
|----------|---------------|
| Political | Government stability? Policy changes? Trade issues? |
| Economic | Economic cycles? Interest rates? Exchange rates? |
| Social | Demographic shifts? Consumer behavior? Labor trends? |
| Technological | Technology disruption? Obsolescence? Cyber threats? |
| Legal | Regulatory changes? Litigation? Contract issues? |
| Environmental | Climate impact? Environmental regulations? Sustainability? |

### Value Chain Analysis
Map risks at each stage:
- Inbound logistics (supplier risks)
- Operations (process risks)
- Outbound logistics (distribution risks)
- Marketing/Sales (demand risks)
- Service (customer risks)
- Support functions (enabling risks)

### Pre-Mortem Analysis
**Process**
1. Assume the project/initiative has failed
2. Ask: "What went wrong?"
3. Brainstorm all possible causes of failure
4. Convert to risk statements
5. Develop mitigation for key risks

**Benefits**
- Overcomes optimism bias
- Encourages candid discussion
- Identifies blind spots

### Bow-Tie Analysis
**Structure**
```
Causes → Risk Event → Consequences
   ↑         ↓           ↓
Controls  Controls    Controls
(Preventive)      (Mitigating)
```

**Application**
- Visualize cause-effect relationships
- Identify control gaps
- Design comprehensive responses
```

### 2. Risk Analysis and Evaluation

**Risk Assessment Matrix**
```yaml
risk_assessment:
  likelihood_scale:
    5_almost_certain:
      description: "Expected to occur in most circumstances"
      probability: ">90% in assessment period"
      frequency: "Could occur several times per year"

    4_likely:
      description: "Will probably occur in most circumstances"
      probability: "60-90%"
      frequency: "Could occur once per year"

    3_possible:
      description: "Might occur at some time"
      probability: "30-60%"
      frequency: "Could occur once in 3 years"

    2_unlikely:
      description: "Could occur at some time"
      probability: "10-30%"
      frequency: "Could occur once in 10 years"

    1_rare:
      description: "May occur only in exceptional circumstances"
      probability: "<10%"
      frequency: "Could occur once in 25+ years"

  impact_scale:
    5_catastrophic:
      financial: ">$50M or >10% of revenue"
      operational: "Major service disruption >1 week"
      reputation: "Sustained negative media, major stakeholder loss"
      regulatory: "License revocation, criminal prosecution"

    4_major:
      financial: "$10-50M or 5-10% of revenue"
      operational: "Significant disruption 1-7 days"
      reputation: "National negative coverage, key stakeholder concern"
      regulatory: "Major regulatory action, significant fines"

    3_moderate:
      financial: "$1-10M or 1-5% of revenue"
      operational: "Disruption 1-3 days"
      reputation: "Local negative coverage, some complaints"
      regulatory: "Regulatory investigation, moderate fines"

    2_minor:
      financial: "$100K-1M"
      operational: "Brief disruption <1 day"
      reputation: "Minor complaints"
      regulatory: "Warning or minor violation"

    1_insignificant:
      financial: "<$100K"
      operational: "Minimal disruption"
      reputation: "No reputational impact"
      regulatory: "No regulatory impact"

  risk_matrix:
    calculation: "Risk Score = Likelihood × Impact"
    heat_map:
      critical: "Score 15-25 (Red)"
      high: "Score 10-14 (Orange)"
      medium: "Score 5-9 (Yellow)"
      low: "Score 1-4 (Green)"
```

**Quantitative Risk Analysis**
```markdown
## Quantitative Risk Assessment Methods

### Expected Value Analysis
**Formula**: Expected Loss = Probability × Impact

**Example**
| Scenario | Probability | Impact | Expected Value |
|----------|-------------|--------|----------------|
| Best case | 20% | -$500K | -$100K |
| Base case | 50% | $0 | $0 |
| Worst case | 30% | $2M | $600K |
| **Total Expected** | | | **$500K** |

### Monte Carlo Simulation
**Application**: Complex risks with multiple variables
**Process**
1. Define probability distributions for key variables
2. Run thousands of simulations
3. Analyze distribution of outcomes
4. Identify confidence intervals

**Output**
- Distribution of potential outcomes
- Probability of exceeding thresholds
- Value at Risk (VaR)

### Sensitivity Analysis
**Purpose**: Understand which factors drive risk
**Approach**: Vary one factor at a time, measure impact
**Output**: Tornado diagram showing relative importance

### Scenario Analysis
**Types**
- Best case / Base case / Worst case
- Stress scenarios (extreme but plausible)
- Historical scenarios (past events)

**Process**
1. Define scenarios
2. Estimate probability of each
3. Calculate impact for each
4. Develop response strategies
```

### 3. Risk Register Development

**Risk Register Template**
```yaml
risk_register_structure:
  risk_identification:
    risk_id: "Unique identifier (e.g., STR-001)"
    risk_name: "Brief descriptive name"
    risk_description: "Detailed description of the risk"
    risk_category: "Strategic/Operational/Financial/Compliance/External"
    risk_owner: "Individual accountable for managing"
    date_identified: "When first identified"

  risk_assessment:
    inherent_likelihood: "1-5 scale before controls"
    inherent_impact: "1-5 scale before controls"
    inherent_risk_score: "Likelihood × Impact"

    current_controls: "Existing controls in place"
    control_effectiveness: "Strong/Adequate/Weak"

    residual_likelihood: "1-5 scale after controls"
    residual_impact: "1-5 scale after controls"
    residual_risk_score: "Likelihood × Impact"

  risk_response:
    risk_treatment: "Accept/Mitigate/Transfer/Avoid"
    planned_actions: "Additional actions planned"
    action_owner: "Who is responsible"
    target_date: "Completion date"
    target_risk_score: "Score after actions"

  monitoring:
    key_risk_indicators: "Early warning metrics"
    review_frequency: "Monthly/Quarterly/Annual"
    last_review_date: "Most recent review"
    status: "Increasing/Stable/Decreasing"
```

**Sample Risk Register Entry**
```markdown
## Risk Register Entry

### Risk ID: OPS-003

**Risk Name**: Supply Chain Disruption

**Description**: Extended disruption to key supplier operations could result in inability to fulfill customer orders, revenue loss, and reputational damage.

### Risk Assessment

| Dimension | Inherent | Current | Residual | Target |
|-----------|----------|---------|----------|--------|
| Likelihood | 4 | - | 3 | 2 |
| Impact | 4 | - | 4 | 3 |
| Risk Score | 16 | - | 12 | 6 |

**Current Controls**
- Dual sourcing for critical components (Adequate)
- Safety stock policy - 30 days (Adequate)
- Supplier financial monitoring (Weak)

### Risk Response

**Treatment Strategy**: Mitigate

**Planned Actions**
| Action | Owner | Target Date | Status |
|--------|-------|-------------|--------|
| Qualify additional suppliers for top 10 components | Procurement | Q2 | In Progress |
| Increase safety stock to 45 days for critical items | Supply Chain | Q1 | Complete |
| Implement supplier risk monitoring system | Procurement | Q3 | Not Started |

### Monitoring

**Key Risk Indicators**
- Supplier on-time delivery rate (<95% = warning)
- Days of safety stock (<30 days = warning)
- Supplier financial health scores

**Review**: Monthly by Supply Chain Risk Committee
**Trend**: Stable
```


## References
- `references/4-mitigation-strategy-development.md` — 4. Mitigation Strategy Development
- `references/references.md` — References
- `references/risk-reporting-structure.md` — Risk Reporting Structure
