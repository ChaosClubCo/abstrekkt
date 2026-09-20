---
name: fintech-operations
description: Design and optimize financial technology operations including payment processing workflows, regulatory compliance programs, risk management frameworks, and fraud prevention systems for fintech platforms and digital financial services. Use when navigating industry-specific regulations, processes, or operations.
---

# Fintech Operations Skill

> Payment processing, regulatory compliance, risk management, and operational excellence for financial technology platforms

## Description

This skill provides comprehensive guidance for operating financial technology platforms including payment processing systems, digital lending, neobanking, and embedded finance services. It covers regulatory compliance across multiple jurisdictions, risk management frameworks, fraud prevention, AML/KYC programs, and operational resilience. The skill supports fintech operations leaders, compliance officers, risk managers, and product teams in building scalable, compliant, and secure financial services infrastructure that meets the demands of evolving regulatory environments and customer expectations.

## Activation Triggers

- User mentions "fintech", "payment processing", "digital payments", or "payment gateway"
- User asks about PCI DSS compliance or payment card security
- User discusses AML, KYC, BSA, or financial crime compliance
- User needs help with money transmitter licensing or regulatory filings
- User asks about fraud detection, chargeback management, or dispute resolution
- User mentions open banking, API banking, or Banking-as-a-Service
- User discusses risk management for lending, credit, or underwriting platforms
- User asks about PSD2, Regulation E, or other payment regulations
- User mentions reconciliation, settlement, or ledger management
- User discusses operational resilience, incident management, or disaster recovery for fintech

## Instructions

### Core Workflow

1. **Regulatory Landscape Assessment**
   - Identify all applicable federal and state regulatory requirements (OCC, FDIC, CFPB, FinCEN, state regulators)
   - Determine licensing requirements including money transmitter licenses, lending licenses, and broker-dealer registrations
   - Map regulatory obligations to operational processes and assign ownership
   - Assess bank partnership or sponsor bank requirements and compliance responsibilities
   - Evaluate cross-border regulatory implications for international payment flows

2. **Payment Infrastructure Design**
   - Define payment flow architecture including authorization, capture, settlement, and funding
   - Select and integrate payment processors, acquiring banks, and card networks
   - Implement tokenization and encryption for cardholder data protection
   - Design reconciliation workflows for multi-party settlement
   - Build redundancy and failover mechanisms for payment processing continuity

3. **Risk and Compliance Framework**
   - Implement BSA/AML program with CDD, EDD, transaction monitoring, and SAR filing
   - Build KYC onboarding workflows with identity verification and sanctions screening
   - Deploy fraud detection models covering account takeover, synthetic identity, and transaction fraud
   - Establish credit risk models for lending products with ongoing portfolio monitoring
   - Create vendor risk management program for third-party service providers

4. **Operational Execution**
   - Deploy real-time monitoring dashboards for transaction throughput, error rates, and latency
   - Implement automated reconciliation between internal ledgers and external settlement files
   - Build customer dispute and chargeback management workflows with SLA tracking
   - Create incident management procedures with severity classification and escalation paths
   - Establish change management controls for production system modifications

5. **Performance Optimization and Reporting**
   - Track key operational metrics including authorization rates, settlement accuracy, and dispute ratios
   - Generate regulatory reports (CTRs, SARs, HMDA, Call Reports) within mandated timelines
   - Conduct periodic stress testing of transaction processing capacity
   - Perform root cause analysis on operational failures and implement systemic improvements
   - Report to board and regulators on compliance program effectiveness and risk posture

### Payment Processing Framework

```yaml
payment_processing:
  transaction_lifecycle:
    authorization:
      flow:
        - Cardholder initiates transaction
        - Merchant sends auth request to acquirer
        - Acquirer routes to card network (Visa/Mastercard/Amex)
        - Network routes to issuing bank
        - Issuer validates card, funds, risk checks
        - Auth response returned through chain
      key_data:
        - PAN or token, expiry, CVV
        - Transaction amount and currency
        - Merchant category code (MCC)
        - AVS and 3DS authentication results

    clearing_and_settlement:
      process:
        - Merchant submits batch of authorized transactions
        - Acquirer processes clearing file to network
        - Network calculates net settlement positions
        - Issuer debits cardholder accounts
        - Network transfers funds to acquirer
        - Acquirer deposits to merchant account
      timeline:
        visa: "T+1 to T+2 business days"
        mastercard: "T+1 to T+2 business days"
        ach: "T+1 to T+3 business days"
        wire: "Same day to T+1"
        rtp: "Real-time (seconds)"

    dispute_management:
      chargeback_flow:
        - Cardholder disputes charge with issuer
        - Issuer files chargeback with network
        - Acquirer notifies merchant
        - Merchant submits representment with evidence
        - Issuer reviews and accepts or escalates to arbitration
      reason_codes:
        fraud: "10.1-10.5 (Visa) / 4837-4863 (MC)"
        authorization: "11.1-11.3 (Visa) / 4808 (MC)"
        processing_error: "12.1-12.7 (Visa) / 4834 (MC)"
        consumer_dispute: "13.1-13.9 (Visa) / 4853 (MC)"
      metrics:
        chargeback_rate: "Must maintain below 1% of transactions"
        dispute_resolution_time: "Target <30 days from receipt"
        win_rate: "Industry benchmark 40-60% representment wins"

  pci_dss_compliance:
    requirements:
      build_secure_network:
        req_1: "Install and maintain network security controls"
        req_2: "Apply secure configurations to all system components"
      protect_account_data:
        req_3: "Protect stored account data"
        req_4: "Protect cardholder data with strong cryptography during transmission"
      maintain_vuln_program:
        req_5: "Protect all systems against malware"
        req_6: "Develop and maintain secure systems and software"
      access_controls:
        req_7: "Restrict access by business need to know"
        req_8: "Identify users and authenticate access"
        req_9: "Restrict physical access to cardholder data"
      monitoring:
        req_10: "Log and monitor all access to system components and cardholder data"
        req_11: "Test security of systems and networks regularly"
      policy:
        req_12: "Support information security with organizational policies and programs"

    saq_types:
      saq_a: "Card-not-present, all processing outsourced"
      saq_a_ep: "E-commerce with partial outsourcing"
      saq_b: "Imprint or standalone dial-out terminal only"
      saq_c: "Payment application connected to internet"
      saq_d: "All other merchants and service providers"
```

### Regulatory Compliance Framework

```yaml
regulatory_compliance:
  bsa_aml_program:
    five_pillars:
      compliance_officer: "Designated BSA officer with authority and resources"
      internal_controls: "Policies, procedures, and processes to ensure compliance"
      independent_testing: "Annual audit by qualified independent party"
      training: "Ongoing BSA/AML training for all relevant personnel"
      cdd_program: "Customer due diligence including beneficial ownership"

    kyc_requirements:
      customer_identification:
        individual: "Name, DOB, address, government ID number"
        business: "Legal name, EIN, formation docs, beneficial owners >25%"
      verification_methods:
        documentary: "Government-issued photo ID, formation documents"
        non_documentary: "Credit bureau, database verification, knowledge-based auth"
      ongoing_monitoring:
        - Transaction monitoring against expected activity profile
        - Periodic KYC refresh (risk-based: 1-3 year cycle)
        - Sanctions screening against OFAC SDN, UN, EU lists
        - PEP screening for politically exposed persons
        - Adverse media monitoring

    suspicious_activity:
      sar_filing:
        threshold: "$5,000 or more in suspected suspicious activity"
        timeline: "File within 30 days of detection (60 days if no suspect identified)"
        retention: "Maintain SAR and supporting documentation for 5 years"
      ctr_filing:
        threshold: "Currency transactions exceeding $10,000"
        timeline: "File within 15 days of transaction"
        aggregation: "Combine multiple transactions by same person in single business day"

  consumer_protection:
    regulation_e:
      scope: "Electronic fund transfers including debit, ACH, P2P, prepaid"
      error_resolution:
        consumer_notification: "60 days from statement date"
        provisional_credit: "10 business days (20 for new accounts)"
        investigation_completion: "45 days (90 for POS, foreign, new account)"
      unauthorized_transfer_liability:
        within_2_days: "Maximum $50 consumer liability"
        within_60_days: "Maximum $500 consumer liability"
        after_60_days: "Unlimited consumer liability"

    fair_lending:
      ecoa: "Equal Credit Opportunity Act - prohibit discrimination in credit"
      fcra: "Fair Credit Reporting Act - accuracy, privacy, consumer rights"
      tila: "Truth in Lending Act - clear disclosure of credit terms"
      state_laws: "State-specific lending caps, licensing, and disclosure requirements"

  licensing:
    money_transmitter:
      federal: "FinCEN MSB registration"
      state: "Individual state licenses required (47 states + DC + territories)"
      requirements:
        - Net worth and surety bond requirements per state
        - Permissible investments for customer funds
        - Annual examination and reporting obligations
        - Change of control and new activity notifications
```

### Templates

#### Fintech Compliance Program Summary
```markdown
# Compliance Program Summary: [Company Name]

## Regulatory Profile
- Entity Type: [Payment processor / Neobank / Lender / BaaS]
- Bank Partner: [Sponsor bank name and relationship type]
- Licenses Held: [MSB, MTLs by state, lending licenses]
- Primary Regulator: [State / OCC / FDIC / CFPB]
- Last Examination: [Date and result]

## BSA/AML Program Status
| Component | Status | Last Review | Findings |
|-----------|--------|-------------|----------|
| Risk Assessment | [Current/Due] | [Date] | [Count] |
| Policies & Procedures | [Current/Due] | [Date] | [Updates needed] |
| Transaction Monitoring | [Active] | [Date] | [Tuning items] |
| SAR Filing | [YTD Count] | [Last filed] | [Backlog] |
| Independent Testing | [Complete/Scheduled] | [Date] | [Findings] |

## Key Metrics
| Metric | Current | Target | Trend |
|--------|---------|--------|-------|
| KYC Completion Rate | [%] | 99%+ | [Direction] |
| False Positive Rate | [%] | <90% | [Direction] |
| SAR Filing Timeliness | [% on time] | 100% | [Direction] |
| Chargeback Rate | [%] | <1.0% | [Direction] |
| Auth Approval Rate | [%] | >95% | [Direction] |
```

#### Incident Response Report
```markdown
# Operational Incident Report: [Incident ID]

## Incident Summary
- Severity: [P1-Critical / P2-High / P3-Medium / P4-Low]
- Detection Time: [Timestamp]
- Resolution Time: [Timestamp]
- Duration: [Hours:Minutes]
- Impact: [Transactions affected, revenue impact, customers impacted]

## Timeline
| Time | Event | Action Taken | By |
|------|-------|-------------|-----|
| [Time] | [Event] | [Action] | [Team/Person] |

## Root Cause
[Detailed root cause analysis]

## Customer Impact
- Transactions Failed: [Count]
- Erroneous Charges: [Count and amount]
- Customer Complaints: [Count]
- Regulatory Notification Required: [Yes/No - reason]

## Corrective Actions
| Action | Owner | Deadline | Status |
|--------|-------|----------|--------|
| [Action] | [Name] | [Date] | [Status] |
```

### Best Practices

1. **Dual Control for Financial Operations**: Require multi-party approval for fund movements, configuration changes, and account adjustments above defined thresholds
2. **Real-Time Reconciliation**: Reconcile transaction records against bank settlement files daily; investigate discrepancies within 24 hours
3. **Defense in Depth for Fraud**: Layer multiple fraud detection signals (device fingerprint, velocity, behavioral biometrics, ML models) rather than relying on any single control
4. **Regulatory Change Management**: Monitor FinCEN advisories, CFPB bulletins, and state regulator communications weekly and assess impact within 30 days
5. **Vendor Concentration Risk**: Avoid single points of failure in payment processing chain; maintain backup processor relationships for critical payment rails
6. **Model Risk Management**: Validate fraud and credit models quarterly with documented performance metrics, bias testing, and challenger model comparison
7. **Customer Fund Safeguarding**: Maintain customer funds in segregated FBO accounts with permissible investments per applicable state requirements
8. **Capacity Planning**: Load test payment infrastructure quarterly and maintain 3x headroom above peak observed transaction volumes
9. **Audit Trail Completeness**: Log every state change in transaction lifecycle with immutable timestamps for regulatory examination readiness
10. **Incident Communication**: Establish pre-approved customer communication templates for common incident types to enable rapid, accurate notification
11. **Bank Partnership Governance**: Maintain clear RACI matrices with sponsor bank covering compliance, operations, and customer complaint handling responsibilities
12. **Consent Order Awareness**: Study recent consent orders against peer fintechs to proactively address common regulatory concerns before examination

### Common Patterns

#### Pattern 1: Payment Processing Outage Response
```
Scenario: Real-time payment authorization service experiences 50% increase
in response latency, with timeout errors affecting 15% of transactions.

Process:
1. Automated monitoring triggers P1 alert when error rate exceeds 5% threshold
2. On-call engineer confirms degradation via dashboard (auth success rate drops to 85%)
3. Activate incident bridge and notify payment operations, engineering, and executive team
4. Identify root cause: database connection pool exhaustion due to slow query in fraud check
5. Implement immediate mitigation: increase connection pool size, add query timeout
6. Monitor recovery: auth success rate returns to 99.2% within 12 minutes
7. Calculate customer impact: 3,200 failed transactions totaling $485,000 in declined volume
8. Initiate customer communication for merchants experiencing elevated declines
9. File corrective action: optimize fraud check query, add circuit breaker pattern
10. Update runbook and conduct post-incident review within 48 hours
```

#### Pattern 2: SAR Filing Workflow
```
Scenario: Transaction monitoring system flags a merchant account with
unusual pattern of small-dollar refunds totaling $47,000 over 30 days.

Process:
1. Alert triaged by Level 1 analyst - pattern matches refund fraud typology
2. Escalate to Level 2 investigator for detailed review
3. Pull full transaction history: 1,200 refunds averaging $39 each, no corresponding sales
4. Review KYC file: merchant is registered pizza restaurant, 6 months old
5. Cross-reference: refund recipients are 15 distinct prepaid card numbers
6. Determine: pattern consistent with money laundering via fictitious refunds
7. Draft SAR narrative covering who, what, when, where, why, and how
8. Compliance officer reviews and approves SAR for filing
9. File SAR via BSA E-Filing System within 30-day regulatory deadline
10. Restrict merchant account, engage sponsor bank on termination decision
11. Retain all investigation documentation for 5 years from filing date
```

### Output Formats

#### Transaction Processing Dashboard
```markdown
# Transaction Processing Dashboard: [Date]

## Real-Time Metrics
| Metric | Current | 24h Avg | 7d Avg | Threshold |
|--------|---------|---------|--------|-----------|
| Auth Success Rate | [%] | [%] | [%] | >99% |
| Avg Response Time | [ms] | [ms] | [ms] | <500ms |
| TPS (Current) | [Count] | [Count] | [Count] | Max: [Cap] |
| Error Rate | [%] | [%] | [%] | <0.5% |
| Decline Rate | [%] | [%] | [%] | <8% |

## Settlement Summary
| Rail | Volume | Amount | Reconciled | Exceptions |
|------|--------|--------|------------|------------|
| Card Networks | [Count] | [$Amount] | [Y/N] | [Count] |
| ACH | [Count] | [$Amount] | [Y/N] | [Count] |
| Wire | [Count] | [$Amount] | [Y/N] | [Count] |
| RTP | [Count] | [$Amount] | [Y/N] | [Count] |
```

#### Regulatory Examination Readiness Checklist
```markdown
# Exam Readiness: [Regulator] - [Exam Type] - [Date]

## Documentation Status
| Category | Documents | Current | Gaps | Owner |
|----------|-----------|---------|------|-------|
| BSA/AML Program | [Count] | [%] | [List] | [Name] |
| Consumer Compliance | [Count] | [%] | [List] | [Name] |
| Information Security | [Count] | [%] | [List] | [Name] |
| Vendor Management | [Count] | [%] | [List] | [Name] |
| Complaint Management | [Count] | [%] | [List] | [Name] |

## Prior Exam Findings
| Finding | MRA/MRIA | Status | Evidence of Remediation |
|---------|----------|--------|------------------------|
| [Finding] | [MRA/MRIA] | [Open/Closed] | [Description] |
```

## Integration Points

- Payment processors (Stripe, Adyen, Worldpay, FIS, Fiserv)
- Card networks (Visa, Mastercard, American Express, Discover)
- Banking cores (Galileo, Marqeta, i2c, Synapse)
- AML/KYC platforms (Alloy, Sardine, ComplyAdvantage, Jumio)
- Fraud detection (Featurespace, Feedzai, Sift, DataVisor)
- Regulatory reporting tools (Verafin, NICE Actimize, Hummingbird)
- Reconciliation engines (Ledge, Modern Treasury, Recon Art)

## Version History

- 1.0.0: Initial fintech operations skill with payment processing, regulatory compliance, and risk management
