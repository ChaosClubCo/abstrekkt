---
name: medical-billing
description: Comprehensive guidance for medical billing operations including claims submission, medical coding (CPT, ICD-10, HCPCS), denial management, payer contracts, reimbursement optimization, and revenue cycle management. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Medical Billing Skill

> Claims processing, medical coding, reimbursement optimization, and revenue cycle management

## Description

This skill provides comprehensive guidance for medical billing operations including claims submission, medical coding (CPT, ICD-10, HCPCS), denial management, payer contracts, reimbursement optimization, and revenue cycle management. It covers both professional and facility billing with focus on compliance, accuracy, and revenue maximization.

## Activation Triggers

- User mentions "medical billing", "claims", "coding"
- User asks about CPT, ICD-10, or HCPCS codes
- User needs help with denial management
- User discusses payer contracts or reimbursement
- User asks about revenue cycle management
- User mentions prior authorization or eligibility
- User needs help with billing compliance

## Instructions

### Core Workflow

1. **Pre-Billing Assessment**
   - Verify patient eligibility and benefits
   - Obtain prior authorizations
   - Capture accurate demographic information
   - Document medical necessity
   - Assign appropriate codes

2. **Claim Preparation**
   - Validate coding accuracy
   - Check for missing information
   - Apply appropriate modifiers
   - Verify place of service
   - Confirm NPI and taxonomy codes

3. **Claim Submission and Follow-Up**
   - Submit claims electronically (837)
   - Monitor clearinghouse reports
   - Track claim status
   - Manage denials and appeals
   - Post payments and adjustments

### Revenue Cycle Overview

```yaml
revenue_cycle:
  front_end:
    - Patient scheduling
    - Insurance verification
    - Prior authorization
    - Patient registration
    - Copay collection
    - Medical necessity verification

  mid_cycle:
    - Charge capture
    - Medical coding
    - Charge entry
    - Claims scrubbing
    - Claim submission

  back_end:
    - Payment posting
    - Denial management
    - Appeals processing
    - Patient billing
    - Collections
    - Reporting and analytics
```

### Medical Coding Framework

```yaml
coding_systems:
  icd_10_cm:
    purpose: "Diagnosis coding"
    structure: "3-7 characters"
    requirements:
      - Code to highest specificity
      - Use combination codes when available
      - Sequence codes properly
      - Document medical necessity

  cpt:
    purpose: "Procedure coding"
    categories:
      - Evaluation and Management (99202-99499)
      - Anesthesiology (00100-01999)
      - Surgery (10004-69990)
      - Radiology (70010-79999)
      - Pathology/Lab (80047-89398)
      - Medicine (90281-99607)

  hcpcs_level_ii:
    purpose: "Supplies, equipment, services"
    format: "Letter + 4 digits"
    categories:
      - A0000-A9999: Transport, supplies
      - B4000-B9999: Enteral/parenteral
      - C1000-C9999: Outpatient PPS
      - E0100-E9999: DME
      - G0000-G9999: Procedures/services
      - J0000-J9999: Drugs
      - L0000-L9999: Orthotics/prosthetics
```

### Claim Submission Process

```yaml
claim_submission:
  professional_claims:
    form: "CMS-1500 / 837P"
    required_fields:
      - Patient demographics
      - Subscriber information
      - Provider NPI and taxonomy
      - Diagnosis codes (ICD-10)
      - Procedure codes (CPT/HCPCS)
      - Date of service
      - Place of service
      - Rendering provider
      - Referring provider (if applicable)
      - Prior authorization number

  facility_claims:
    form: "UB-04 / 837I"
    required_fields:
      - Patient demographics
      - Admission/discharge dates
      - Type of bill
      - Revenue codes
      - HCPCS/CPT codes
      - ICD-10-CM/PCS codes
      - Attending physician
      - Other providers

  submission_timelines:
    medicare: "1 year from date of service"
    medicaid: "Varies by state (90 days - 1 year)"
    commercial: "Per contract (typically 90-180 days)"
```

### Modifier Usage Guide

```yaml
modifiers:
  common_modifiers:
    "25": "Significant, separately identifiable E/M"
    "26": "Professional component"
    "TC": "Technical component"
    "59": "Distinct procedural service"
    "XE": "Separate encounter"
    "XS": "Separate structure"
    "XP": "Separate practitioner"
    "XU": "Unusual non-overlapping service"
    "76": "Repeat procedure by same physician"
    "77": "Repeat procedure by different physician"
    "LT": "Left side"
    "RT": "Right side"
    "50": "Bilateral procedure"

  evaluation_management:
    "24": "Unrelated E/M during postop"
    "25": "Significant, separate E/M same day"
    "57": "Decision for surgery"

  surgical:
    "51": "Multiple procedures"
    "58": "Staged or related procedure"
    "78": "Unplanned return to OR"
    "79": "Unrelated procedure during postop"
    "80": "Assistant surgeon"
```

### Denial Management

```yaml
denial_management:
  common_denial_reasons:
    authorization:
      - No prior authorization
      - Expired authorization
      - Wrong authorization number
    eligibility:
      - Patient not eligible
      - Coverage terminated
      - Coordination of benefits issue
    coding:
      - Invalid diagnosis code
      - Procedure not covered
      - Medical necessity not established
      - Bundling/unbundling issues
    billing:
      - Duplicate claim
      - Timely filing exceeded
      - Missing information
      - Invalid provider number

  appeal_process:
    level_1:
      - Internal review
      - Additional documentation
      - Corrected claim if applicable
    level_2:
      - Formal written appeal
      - Medical director review
      - Peer-to-peer review
    level_3:
      - External review
      - State insurance commission
      - Medicare ALJ hearing
```

### Prior Authorization Workflow

```yaml
prior_authorization:
  triggers:
    - High-cost medications
    - Advanced imaging
    - Specialty procedures
    - Inpatient admissions
    - DME over threshold
    - Out-of-network services

  process:
    - Verify authorization requirement
    - Gather clinical documentation
    - Submit authorization request
    - Track status and timeline
    - Document approval/denial
    - Appeal if necessary

  best_practices:
    - Check requirements before scheduling
    - Use payer portals when available
    - Document medical necessity clearly
    - Track expiration dates
    - Verify covered diagnosis codes
```

### Payment Posting and Reconciliation

```yaml
payment_posting:
  remittance_advice:
    electronic: "835 EDI transaction"
    paper: "Explanation of Benefits (EOB)"

  posting_process:
    - Match ERA/EOB to claim
    - Post allowed amount
    - Post payment
    - Apply contractual adjustment
    - Transfer patient responsibility
    - Handle denials appropriately

  reconciliation:
    - Balance daily batches
    - Verify deposit matches postings
    - Identify unposted payments
    - Research credit balances
    - Monthly close procedures
```

### Payer Contract Management

```yaml
contract_management:
  fee_schedule_analysis:
    - Compare to Medicare RBRVS
    - Analyze reimbursement by code
    - Identify outliers
    - Model contract changes

  key_terms:
    - Fee schedule methodology
    - Timely filing requirements
    - Prior authorization rules
    - Appeal procedures
    - Termination provisions
    - Medical necessity criteria

  performance_monitoring:
    - Track payment accuracy
    - Monitor denial rates
    - Measure days in AR
    - Calculate effective rate
```

### Key Performance Indicators

```yaml
kpis:
  revenue_metrics:
    - Net collection rate (target: >95%)
    - Gross collection rate
    - Days in AR (target: <40)
    - AR > 90 days percentage
    - Bad debt write-off rate

  claim_metrics:
    - Clean claim rate (target: >95%)
    - First-pass resolution rate
    - Denial rate (target: <5%)
    - Appeal success rate
    - Days to bill

  productivity:
    - Claims per FTE
    - Payments posted per day
    - Accounts worked per day
```

### Compliance Requirements

```yaml
compliance:
  false_claims_act:
    - Accurate coding required
    - Medical necessity documentation
    - No upcoding or unbundling
    - Refund overpayments promptly

  stark_law:
    - Physician self-referral limits
    - Designated health services
    - Exception requirements

  anti_kickback:
    - No payment for referrals
    - Safe harbor requirements

  billing_compliance:
    - Regular audits
    - Staff education
    - Compliance hotline
    - Response to identified issues
```

## Output Format

### Denial Analysis Report
```markdown
# Denial Analysis Report

## Summary
- Total Denials: [Count]
- Total Denied Amount: [$]
- Denial Rate: [%]

## Denials by Category
| Category | Count | Amount | % of Total |
|----------|-------|--------|------------|
| Authorization | [#] | [$] | [%] |
| Eligibility | [#] | [$] | [%] |
| Coding | [#] | [$] | [%] |
| Billing | [#] | [$] | [%] |

## Top Denial Codes
| Code | Description | Count | Recovery Potential |
|------|-------------|-------|-------------------|
| [Code] | [Desc] | [#] | [High/Medium/Low] |

## Recommendations
1. [Action item]
2. [Action item]

## Root Cause Analysis
[Detailed analysis of top denial reasons]
```

## Integration Points

- Practice management system
- Electronic Health Record (EHR)
- Clearinghouse
- Payer portals
- Patient portal
- Eligibility verification services
- Prior authorization automation
- Analytics and reporting tools

## Best Practices

1. **Verify Before Service**: Check eligibility and authorization upfront
2. **Document Thoroughly**: Support medical necessity with documentation
3. **Code Accurately**: Use current code sets and guidelines
4. **Submit Clean Claims**: Scrub claims before submission
5. **Work Denials Promptly**: Don't let timely filing expire
6. **Track Patterns**: Analyze denial trends for process improvement
7. **Train Continuously**: Keep staff current on coding and billing changes
8. **Audit Regularly**: Conduct internal coding and billing audits

## Common Pitfalls

- Inadequate eligibility verification
- Missing or incorrect prior authorizations
- Insufficient documentation for medical necessity
- Incorrect modifier usage
- Exceeding timely filing limits
- Not appealing recoverable denials
- Poor charge capture processes
- Lack of denial trend analysis

## Version History

- 1.0.0: Initial medical billing skill
- 1.0.1: Added modifier usage guide
- 1.0.2: Enhanced denial management section
