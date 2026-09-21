---
name: payment-processing
description: Comprehensive guidance for payment processing operations including payment rails (ACH, wire, card networks), transaction processing, settlement and clearing, reconciliation, dispute management, and payment operations optimization. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Payment Processing Skill

> Payment rails, settlement, reconciliation, and transaction processing operations

## Description

This skill provides comprehensive guidance for payment processing operations including payment rails (ACH, wire, card networks), transaction processing, settlement and clearing, reconciliation, dispute management, and payment operations optimization. It covers the full payment lifecycle from initiation to settlement.

## Activation Triggers

- User mentions "payment processing", "payment rails", "settlement"
- User asks about ACH, wire transfers, or card processing
- User needs help with reconciliation or clearing
- User discusses transaction disputes or chargebacks
- User asks about PCI compliance or payment security
- User mentions interchange or payment fees
- User needs payment operations optimization

## Instructions

### Core Workflow

1. **Transaction Processing**
   - Receive and validate payment request
   - Route to appropriate payment rail
   - Process authorization/initiation
   - Handle responses and exceptions
   - Track transaction status

2. **Settlement and Clearing**
   - Batch transactions for clearing
   - Submit to clearing network
   - Receive settlement files
   - Process incoming funds
   - Update account positions

3. **Reconciliation and Reporting**
   - Match transactions to settlements
   - Identify and resolve breaks
   - Generate position reports
   - Complete month-end close
   - Produce regulatory reports

### Payment Rails Overview

```yaml
payment_rails:
  card_networks:
    visa:
      - Credit, debit, prepaid cards
      - Real-time authorization
      - T+1/T+2 settlement
      - VisaNet processing

    mastercard:
      - Credit, debit, prepaid
      - Banknet authorization
      - T+1/T+2 settlement
      - Mastercard network

    american_express:
      - Closed loop network
      - Direct merchant relationships
      - Various settlement terms

    discover:
      - Credit and debit
      - Pulse debit network
      - Standard settlement

  ach:
    nacha_network:
      - Next-day settlement (standard)
      - Same-day ACH available
      - Credit and debit transactions
      - Batch processing

    transaction_types:
      - Direct deposit (payroll)
      - Direct payment (bills)
      - Person-to-person
      - Business-to-business

    sec_codes:
      PPD: "Prearranged Payment and Deposit"
      CCD: "Corporate Credit or Debit"
      WEB: "Internet Initiated"
      TEL: "Telephone Initiated"
      POP: "Point of Purchase"
      CTX: "Corporate Trade Exchange"

  wire_transfers:
    fedwire:
      - Real-time gross settlement
      - Federal Reserve operated
      - High-value transactions
      - Irrevocable transfers

    chips:
      - Clearing House Interbank
      - Netting and settlement
      - Large-value transfers
      - Same-day settlement

    swift:
      - International messaging
      - Correspondent banking
      - MT message formats
      - Cross-border payments

  real_time:
    rtp:
      - The Clearing House
      - 24/7/365 availability
      - Immediate settlement
      - Request for Payment

    fednow:
      - Federal Reserve service
      - Instant payments
      - Real-time settlement
      - Interbank clearing
```

### Card Transaction Flow

```yaml
card_processing:
  authorization:
    flow:
      - Card presented/entered
      - Merchant POS/gateway
      - Acquirer processor
      - Card network
      - Issuing bank
      - Response returned

    authorization_codes:
      approved: "00"
      declined_do_not_honor: "05"
      insufficient_funds: "51"
      expired_card: "54"
      invalid_card: "14"

  clearing:
    - Merchant batches transactions
    - Acquirer submits to network
    - Network clears to issuer
    - Interchange calculated
    - Settlement amounts determined

  settlement:
    - Net positions calculated
    - Funds transferred
    - Merchant account credited
    - Issuer account debited
    - Fees deducted
```

### ACH Processing

```yaml
ach_processing:
  origination:
    steps:
      - Collect account information
      - Verify account (micro-deposits, instant)
      - Create ACH file (NACHA format)
      - Submit to ODFI
      - ODFI sends to Fed/EPN

  file_structure:
    file_header:
      - Priority code
      - Immediate destination
      - Immediate origin
      - File creation date
      - ID modifier

    batch_header:
      - Service class code
      - Company name
      - Company ID
      - SEC code
      - Effective date

    entry_detail:
      - Transaction code
      - Routing number
      - Account number
      - Amount
      - ID number
      - Receiver name

  return_codes:
    R01: "Insufficient Funds"
    R02: "Account Closed"
    R03: "No Account"
    R04: "Invalid Account Number"
    R05: "Unauthorized Debit"
    R06: "ODFI Requested Return"
    R07: "Authorization Revoked"
    R08: "Payment Stopped"
    R10: "Customer Advises Not Authorized"
    R16: "Account Frozen"
    R20: "Non-Transaction Account"

  timing:
    standard:
      - Submit by deadline
      - Settle next business day
    same_day:
      - Multiple windows per day
      - $1M per transaction limit
      - Higher fees apply
```

### Settlement and Clearing

```yaml
settlement:
  card_settlement:
    process:
      - Clearing file received
      - Transactions matched
      - Net position calculated
      - Funds transferred
      - Accounts updated

    timing:
      visa: "T+1 or T+2"
      mastercard: "T+1 or T+2"
      amex: "Varies by agreement"

  ach_settlement:
    process:
      - Fed processes files
      - Settlement reports generated
      - Reserve accounts debited/credited
      - ODFI/RDFI notified

    timing:
      standard: "T+1"
      same_day: "T+0"

  wire_settlement:
    fedwire: "Real-time gross"
    chips: "End-of-day net"
```

### Reconciliation Framework

```yaml
reconciliation:
  levels:
    transaction:
      - Match each transaction
      - Authorization to clearing
      - Clearing to settlement
      - Settlement to funding

    batch:
      - Batch totals match
      - Transaction counts match
      - Dollar amounts balance

    account:
      - Bank statement matching
      - GL reconciliation
      - Position verification

  break_resolution:
    identification:
      - Automated matching
      - Exception reporting
      - Aging tracking

    investigation:
      - Transaction research
      - System log review
      - Counterparty contact

    resolution:
      - Adjustment entry
      - Write-off (approved)
      - Reversal processing

  timing:
    daily:
      - Transaction matching
      - Break identification
      - Position verification
    monthly:
      - Statement reconciliation
      - GL close procedures
      - Variance analysis
```

### Dispute and Chargeback Management

```yaml
disputes:
  chargeback_process:
    initiation:
      - Cardholder disputes
      - Issuer reviews claim
      - Chargeback initiated
      - Acquirer notified

    representment:
      - Merchant reviews
      - Evidence gathered
      - Response submitted
      - Network arbitration

    time_frames:
      visa:
        - 75-120 days to dispute
        - 30 days to respond
      mastercard:
        - 45-120 days to dispute
        - 45 days to respond

  reason_codes:
    fraud:
      - Unauthorized transaction
      - Counterfeit card
      - Card not present fraud

    consumer_disputes:
      - Merchandise not received
      - Not as described
      - Duplicate charge

    processing_errors:
      - Wrong amount
      - Duplicate processing
      - Credit not processed

  prevention:
    - Address verification (AVS)
    - Card verification (CVV)
    - 3D Secure authentication
    - Clear billing descriptors
    - Proactive refunds
    - Customer communication
```

### PCI DSS Compliance

```yaml
pci_compliance:
  requirements:
    requirement_1: "Firewall configuration"
    requirement_2: "No vendor defaults"
    requirement_3: "Protect stored data"
    requirement_4: "Encrypt transmission"
    requirement_5: "Antivirus software"
    requirement_6: "Secure systems"
    requirement_7: "Restrict access"
    requirement_8: "Unique IDs"
    requirement_9: "Physical access"
    requirement_10: "Track and monitor"
    requirement_11: "Test security"
    requirement_12: "Information security policy"

  merchant_levels:
    level_1:
      - ">6M transactions annually"
      - Onsite assessment required
      - Quarterly network scan

    level_2:
      - "1-6M transactions"
      - SAQ or onsite assessment
      - Quarterly network scan

    level_3:
      - "20K-1M e-commerce"
      - SAQ required
      - Quarterly network scan

    level_4:
      - "<20K e-commerce"
      - SAQ recommended
      - Quarterly scan if applicable

  tokenization:
    - Replace card data with tokens
    - Reduce PCI scope
    - Tokens non-reversible
    - Vault-based or algorithmic
```

### Interchange and Pricing

```yaml
interchange:
  components:
    interchange_fee:
      - Paid to issuing bank
      - Varies by card type
      - Transaction type matters
      - Qualified vs non-qualified

    assessment_fee:
      - Paid to card network
      - Basis points on volume
      - Fixed per transaction

    processor_fee:
      - Markup over interchange
      - Transaction fees
      - Monthly fees

  optimization:
    - Capture level 2/3 data
    - Optimize transaction routing
    - Correct MCC codes
    - Timely settlement
    - Reduce downgrades
```

### Operations Metrics

```yaml
metrics:
  processing:
    - Transaction success rate
    - Authorization approval rate
    - Decline reason analysis
    - Processing time (latency)

  settlement:
    - Settlement accuracy
    - Days to settle
    - Break rate
    - Unmatched transactions

  disputes:
    - Chargeback rate
    - Win rate
    - Fraud rate
    - Prevention metrics

  operational:
    - System uptime
    - Error rates
    - Exception volume
    - Manual intervention rate
```

## Output Format

### Payment Operations Report
```markdown
# Payment Operations Report: [Period]

## Transaction Summary
| Rail | Volume | Value | Success Rate |
|------|--------|-------|--------------|
| Cards | [#] | [$] | [%] |
| ACH | [#] | [$] | [%] |
| Wires | [#] | [$] | [%] |

## Settlement Status
- Transactions cleared: [#]
- Pending settlement: [#]
- Settlement breaks: [#]
- Break rate: [%]

## Reconciliation Status
| Account | Status | Breaks | Value |
|---------|--------|--------|-------|
| [Account] | [Status] | [#] | [$] |

## Dispute Metrics
- Chargebacks received: [#]
- Representments submitted: [#]
- Win rate: [%]
- Chargeback ratio: [%]

## Exceptions and Issues
| Issue | Count | Status | Action Required |
|-------|-------|--------|-----------------|
| [Issue] | [#] | [Status] | [Action] |

## Key Actions
1. [Required action]
2. [Required action]
```

## Integration Points

- Core banking systems
- Card network gateways (Visa, MC, etc.)
- ACH processing (Federal Reserve, EPN)
- Wire transfer systems (Fedwire, SWIFT)
- Payment gateways and processors
- Reconciliation platforms
- Fraud detection systems

## Best Practices

1. **Automation**: Automate matching and reconciliation
2. **Real-Time Monitoring**: Track transactions continuously
3. **Exception Management**: Handle breaks promptly
4. **Security First**: Maintain PCI compliance
5. **Redundancy**: Build in failover capabilities
6. **Documentation**: Document all processes
7. **Metrics Tracking**: Monitor KPIs continuously
8. **Vendor Management**: Manage processor relationships

## Common Pitfalls

- Manual reconciliation bottlenecks
- Poor exception aging management
- Inadequate fraud controls
- Late settlement submissions
- Insufficient documentation
- Poor chargeback response rates
- Ignoring interchange optimization
- Inadequate disaster recovery

## Version History

- 1.0.0: Initial payment processing skill
- 1.0.1: Added real-time payments section
- 1.0.2: Enhanced reconciliation framework
