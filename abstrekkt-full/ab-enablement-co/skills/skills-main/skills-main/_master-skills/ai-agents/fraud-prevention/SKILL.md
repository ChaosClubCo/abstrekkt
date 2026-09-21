---
name: fraud-prevention
description: Comprehensive guidance for fraud prevention and detection including fraud typologies, detection systems, investigation procedures, prevention strategies, and case management. Covers payment fraud, identity fraud, account takeover, and internal fraud. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Fraud Prevention Skill

> Fraud detection, prevention strategies, and investigation procedures

## Description

This skill provides comprehensive guidance for fraud prevention and detection including fraud typologies, detection systems, investigation procedures, prevention strategies, and case management. It covers payment fraud, identity fraud, account takeover, and internal fraud across financial services organizations.

## Activation Triggers

- User mentions "fraud prevention", "fraud detection", "fraud investigation"
- User asks about account takeover or identity theft
- User needs help with transaction monitoring or rules
- User discusses chargeback fraud or friendly fraud
- User asks about fraud analytics or machine learning
- User mentions suspicious activity or fraud alerts
- User needs fraud investigation procedures

## Instructions

### Core Workflow

1. **Prevention**
   - Implement authentication controls
   - Design fraud prevention rules
   - Deploy identity verification
   - Enable device intelligence
   - Train staff on red flags

2. **Detection**
   - Monitor transactions in real-time
   - Apply detection rules and models
   - Analyze behavioral patterns
   - Generate and prioritize alerts
   - Conduct investigations

3. **Response**
   - Investigate suspicious activity
   - Take protective actions
   - Document findings
   - Report as required
   - Recover losses where possible

### Fraud Typologies

```yaml
fraud_types:
  payment_fraud:
    card_not_present:
      - Stolen card data usage
      - Phishing-acquired credentials
      - Data breach exploitation
      - Card testing attacks

    card_present:
      - Counterfeit cards
      - Lost/stolen cards
      - Skimming
      - EMV bypass attempts

    ach_fraud:
      - Unauthorized debits
      - Account credential theft
      - Business email compromise
      - Payroll diversion

  identity_fraud:
    synthetic_identity:
      - Fabricated identities
      - Mixed real/fake data
      - Credit building schemes
      - Bust-out fraud

    true_identity:
      - Stolen personal data
      - Account opening fraud
      - Credit application fraud
      - Benefits fraud

    account_takeover:
      - Credential stuffing
      - Phishing attacks
      - SIM swap
      - Social engineering

  internal_fraud:
    employee_fraud:
      - Cash theft
      - Vendor schemes
      - Payroll fraud
      - Expense fraud

    collusion:
      - Employee-customer
      - Employee-vendor
      - Multi-party schemes

  application_fraud:
    first_party:
      - Misrepresentation
      - Income inflation
      - Asset falsification

    third_party:
      - Identity theft application
      - Synthetic identity
      - Straw borrowers
```

### Detection Framework

```yaml
detection:
  rule_based:
    velocity_rules:
      - Transaction count limits
      - Amount thresholds
      - Geographic patterns
      - Device usage

    pattern_rules:
      - Round dollar amounts
      - Sequential transactions
      - Time-based patterns
      - Merchant category codes

    list_matching:
      - Known fraud indicators
      - Compromised cards
      - High-risk merchants
      - Watch lists

  machine_learning:
    supervised:
      - Classification models
      - Labeled fraud data
      - Feature engineering
      - Model training/testing

    unsupervised:
      - Anomaly detection
      - Clustering
      - Pattern discovery
      - Behavioral profiling

    model_types:
      - Neural networks
      - Random forests
      - Gradient boosting
      - Ensemble methods

  behavioral_analytics:
    user_profiling:
      - Typical transaction patterns
      - Device fingerprinting
      - Location patterns
      - Time-of-day behavior

    deviation_detection:
      - Baseline comparison
      - Peer group analysis
      - Risk scoring
```

### Transaction Monitoring

```yaml
monitoring:
  real_time:
    - Pre-authorization screening
    - Risk scoring
    - Instant decisioning
    - Step-up authentication triggers

  near_real_time:
    - Post-transaction analysis
    - Pattern aggregation
    - Cross-channel correlation
    - Alert generation

  batch_processing:
    - Historical analysis
    - Model training
    - Pattern mining
    - Report generation

  alert_management:
    prioritization:
      - Risk score ranking
      - Dollar impact
      - Fraud type severity
      - Account age/value

    workflow:
      - Alert queue assignment
      - Investigation SLA
      - Decision documentation
      - Outcome tracking
```

### Investigation Procedures

```yaml
investigation:
  initial_assessment:
    - Alert review
    - Account history check
    - Transaction analysis
    - Pattern identification

  data_gathering:
    - Transaction details
    - Customer contact history
    - Device information
    - IP/location data
    - Related accounts

  analysis:
    - Timeline construction
    - Pattern recognition
    - Loss calculation
    - Victim identification

  decision:
    confirmed_fraud:
      - Account protection actions
      - Loss documentation
      - SAR consideration
      - Recovery initiation

    false_positive:
      - Model feedback
      - Rule refinement
      - Customer notification
      - Case closure

  documentation:
    - Investigation notes
    - Evidence collection
    - Decision rationale
    - Action taken
```

### Prevention Controls

```yaml
prevention:
  identity_verification:
    knowledge_based:
      - Security questions
      - Out-of-wallet questions
      - Dynamic KBA

    document_based:
      - ID document verification
      - Document authentication
      - Liveness detection
      - Selfie matching

    data_verification:
      - Credit bureau match
      - Phone/email verification
      - Address verification
      - SSN verification

  authentication:
    multi_factor:
      - Something you know (password)
      - Something you have (device)
      - Something you are (biometric)

    risk_based:
      - Low risk: standard auth
      - Medium risk: step-up auth
      - High risk: additional verification

    device_intelligence:
      - Device fingerprinting
      - Device reputation
      - Behavioral biometrics
      - Session analytics

  transaction_controls:
    - Velocity limits
    - Amount limits
    - Geographic restrictions
    - Merchant restrictions
    - New account limitations
```

### Fraud Metrics and KPIs

```yaml
metrics:
  prevention:
    - Fraud prevention rate
    - Authentication success rate
    - Friction rate
    - False decline rate

  detection:
    - Detection rate (sensitivity)
    - False positive rate
    - Detection time
    - Alert-to-fraud ratio

  investigation:
    - Case resolution time
    - Investigation accuracy
    - Case backlog
    - Analyst productivity

  losses:
    - Gross fraud losses
    - Net fraud losses (after recovery)
    - Fraud basis points
    - Write-off rate

  operational:
    - Rule effectiveness
    - Model performance (AUC, precision)
    - System uptime
    - Processing latency
```

### Case Management

```yaml
case_management:
  workflow:
    assignment:
      - Auto-assignment rules
      - Skill-based routing
      - Load balancing
      - Priority handling

    investigation:
      - Checklist completion
      - Evidence collection
      - Contact documentation
      - Escalation triggers

    resolution:
      - Decision recording
      - Action implementation
      - Customer notification
      - Case closure

  escalation:
    - Complex case escalation
    - High-value thresholds
    - Repeat offender patterns
    - Law enforcement referral

  reporting:
    - SARs (FinCEN)
    - Law enforcement reports
    - Management reports
    - Regulatory reports
```

### Fraud Analytics

```yaml
analytics:
  descriptive:
    - Fraud trends
    - Loss distribution
    - Channel analysis
    - Geographic patterns

  diagnostic:
    - Root cause analysis
    - Control effectiveness
    - Rule performance
    - Model diagnostics

  predictive:
    - Fraud propensity scoring
    - Loss forecasting
    - Emerging pattern detection
    - Risk segmentation

  prescriptive:
    - Rule optimization
    - Model tuning recommendations
    - Control enhancement
    - Resource allocation
```

### Recovery and Remediation

```yaml
recovery:
  immediate_actions:
    - Account blocking
    - Card replacement
    - Credential reset
    - Transaction reversal

  loss_recovery:
    - Chargeback initiation
    - Insurance claims
    - Legal action
    - Collection efforts

  customer_remediation:
    - Credit monitoring
    - Identity protection
    - Account restoration
    - Communication plan

  systemic_fixes:
    - Control enhancement
    - Rule updates
    - Model retraining
    - Process improvement
```

## Output Format

### Fraud Investigation Report
```markdown
# Fraud Investigation Report

## Case Information
- Case ID: [ID]
- Alert Date: [Date]
- Alert Type: [Type]
- Risk Score: [Score]
- Account: [Masked account]

## Investigation Summary
### Incident Description
[Brief description of suspicious activity]

### Timeline
| Date/Time | Event | Details |
|-----------|-------|---------|
| [DateTime] | [Event] | [Details] |

### Analysis
[Key findings from investigation]

### Evidence Reviewed
- [List of evidence items]


## References
- `references/determination.md` — Determination
