---
name: invoicing-billing
description: Helps configure and build invoicing billing processes. Comprehensive invoicing and billing skill for SMB operations. Use when creating invoices, managing payment terms, handling AR collections, processing reconciliations, or implementing dunning sequences. Covers invoice templates, billing workflows, payment tracking, and collections best practices.
---

# Invoicing & Billing Management

## Overview

Effective invoicing and billing are the lifeblood of SMB cash flow management. This skill provides comprehensive guidance for creating professional invoices, establishing payment terms, managing accounts receivable collections, reconciling payments, and implementing automated dunning sequences. Proper invoicing directly impacts Days Sales Outstanding (DSO), customer relationships, and overall business liquidity.

For SMB business solutions, streamlined billing processes reduce administrative burden, accelerate cash collection, and minimize revenue leakage from billing errors or missed invoices.

## When to Use

Invoke this skill when:
- Creating new invoice templates or standardizing invoice formats
- Setting up payment terms for new customers or revising existing terms
- Designing AR collections workflows and escalation procedures
- Implementing dunning sequences for overdue accounts
- Reconciling payments against invoices and resolving discrepancies
- Analyzing billing metrics and identifying improvement opportunities
- Training staff on billing procedures
- Integrating billing systems with accounting software
- Handling billing disputes or customer payment issues
- Setting up recurring billing for subscription services

## Core Processes

### 1. Invoice Creation Standards

#### Essential Invoice Elements

Every invoice must include these mandatory components:

```
INVOICE HEADER
- Company name, logo, and branding
- Company address and contact information
- Tax identification number (EIN/VAT)
- Invoice number (unique, sequential)
- Invoice date
- Due date

CUSTOMER INFORMATION
- Customer/Bill-to name
- Customer address
- Customer reference/PO number
- Account number

LINE ITEMS
- Description of goods/services
- Quantity
- Unit price
- Line total
- Tax rate and amount per line (if applicable)

TOTALS
- Subtotal
- Discounts applied
- Tax totals by rate
- Shipping/handling (if applicable)
- Grand total
- Amount due

PAYMENT INFORMATION
- Accepted payment methods
- Bank details for wire/ACH
- Online payment link
- Payment terms summary

FOOTER
- Late payment terms/penalties
- Return/dispute policy
- Thank you message
```

#### Invoice Numbering Conventions

Recommended formats for SMBs:

| Format | Example | Best For |
|--------|---------|----------|
| Sequential | INV-00001 | Simple businesses |
| Year-Sequential | 2024-00001 | Annual tracking |
| Customer-Sequential | ACME-001 | Account management |
| Project-Based | PRJ-001-INV-01 | Project billing |
| Location-Based | NYC-2024-001 | Multi-location |

#### Invoice Types

1. **Standard Invoice**: One-time billing for completed work
2. **Recurring Invoice**: Automated billing for subscriptions
3. **Progress Invoice**: Milestone-based project billing
4. **Proforma Invoice**: Pre-shipment quote document
5. **Credit Memo**: Adjustment for returns/corrections
6. **Debit Memo**: Additional charges after original invoice

### 2. Payment Terms Framework

#### Standard Payment Terms

| Term | Description | Best For |
|------|-------------|----------|
| Due on Receipt | Payment due immediately | High-risk customers |
| Net 15 | Due within 15 days | Small transactions |
| Net 30 | Due within 30 days | Standard business |
| Net 45 | Due within 45 days | Enterprise clients |
| Net 60 | Due within 60 days | Government/large corp |
| 2/10 Net 30 | 2% discount if paid in 10 days | Incentivize early payment |

#### Customer Term Assignment Matrix

```
NEW CUSTOMERS
- Credit check score < 650: Due on Receipt or Prepay
- Credit check score 650-720: Net 15
- Credit check score > 720: Net 30

EXISTING CUSTOMERS (based on payment history)
- Always pays early: Offer extended terms
- Pays on time: Maintain current terms
- Occasionally late (1-15 days): Maintain with monitoring
- Frequently late (>15 days): Reduce to Net 15 or prepay
- Has gone to collections: Prepay only
```

#### Early Payment Discount Calculator

```
Discount Rate | If Paid Within | Standard Term | Annualized Rate
2% | 10 days | Net 30 | 36.7%
1.5% | 10 days | Net 30 | 27.5%
1% | 10 days | Net 30 | 18.4%
2% | 10 days | Net 45 | 21.0%
```

### 3. Accounts Receivable Collections Workflow

#### AR Aging Categories

- **Current**: 0-30 days from invoice date
- **31-60 Days**: First stage overdue
- **61-90 Days**: Second stage overdue
- **91-120 Days**: Serious delinquency
- **120+ Days**: Collections/Write-off consideration

#### Collection Escalation Timeline

```
DAY 0: Invoice sent
- Confirmation email with payment options
- Thank you for your business message

DAY -5 (before due): Courtesy reminder
- Friendly reminder of upcoming due date
- Confirm receipt of invoice
- Offer assistance with payment setup

DAY +1 (after due): First notice
- Payment is now overdue
- Request immediate payment
- Provide payment options

DAY +7: Second notice
- Firm reminder of overdue status
- Mention late fees (if applicable)
- Request contact within 48 hours

DAY +14: Phone call
- Personal outreach to decision maker
- Understand payment obstacles
- Negotiate payment plan if needed

DAY +21: Third notice
- Final warning before escalation
- Mention credit reporting impact
- Offer final payment plan option

DAY +30: Account review
- Internal review of collection status
- Decision on continued service
- Consider collection agency referral

DAY +45: Service suspension warning
- Written notice of pending suspension
- Final opportunity for resolution

DAY +60: Collections handoff
- Transfer to collection agency
- Or begin legal proceedings
- Write-off consideration
```

### 4. Dunning Sequence Templates

#### Email Template 1: Courtesy Reminder (Day -5)

```
Subject: Upcoming Payment Reminder - Invoice #{invoice_number}

Dear {customer_name},

This is a friendly reminder that Invoice #{invoice_number} for
${amount} is due on {due_date}.

Invoice Details:
- Invoice Number: {invoice_number}
- Amount Due: ${amount}
- Due Date: {due_date}

For your convenience, you can pay online at: {payment_link}

If you've already sent payment, please disregard this message.

Questions? Reply to this email or call us at {phone}.

Thank you for your business!

Best regards,
{company_name}
```

#### Email Template 2: Past Due Notice (Day +1)

```
Subject: Payment Past Due - Invoice #{invoice_number}

Dear {customer_name},

Our records indicate that Invoice #{invoice_number} for ${amount}
was due on {due_date} and remains unpaid.

Please submit payment at your earliest convenience to keep your
account in good standing.

Pay now: {payment_link}

Invoice Summary:
- Original Amount: ${amount}
- Due Date: {due_date}
- Days Overdue: {days_overdue}

If you have questions about this invoice or are experiencing
payment difficulties, please contact us immediately.

Best regards,
{company_name} Accounts Receivable
```

#### Email Template 3: Urgent Notice (Day +14)

```
Subject: URGENT: Payment Required - Invoice #{invoice_number}

Dear {customer_name},

Despite previous reminders, Invoice #{invoice_number} remains
unpaid. This invoice is now {days_overdue} days past due.

Amount Due: ${amount}
Late Fee (if applicable): ${late_fee}
Total Due: ${total_due}

Please contact us within 48 hours to resolve this matter and
avoid further collection action.

Payment Options:
1. Pay online: {payment_link}
2. Call us: {phone}
3. Mail payment to: {address}

We value your business and want to resolve this promptly.

Regards,
{company_name} Collections Department
```

#### Email Template 4: Final Notice (Day +30)

```
Subject: FINAL NOTICE: Account #{account_number}

Dear {customer_name},

This is your final notice regarding the outstanding balance
on your account.

Total Past Due: ${total_due}
Days Overdue: {days_overdue}

If payment is not received within 10 business days, we will:
- Suspend services/future orders
- Report to credit bureaus
- Refer to third-party collections

To avoid these actions, please pay immediately or contact
us to discuss payment arrangements.

{payment_link}

This matter requires your immediate attention.

{company_name} Collections
```

### 5. Payment Reconciliation Process

#### Daily Reconciliation Steps

```
STEP 1: Gather Payment Data
- Download bank statement transactions
- Pull credit card settlement reports
- Export payment processor reports
- Collect check deposit records

STEP 2: Match to Open Invoices
- Auto-match by reference number
- Review partial payments
- Flag unidentified payments

STEP 3: Apply Payments
- Post matched payments to invoices
- Create credit memos for overpayments
- Document short payments for follow-up

STEP 4: Investigate Discrepancies
- Contact customer for missing references
- Research bank fees/adjustments
- Resolve duplicate payments

STEP 5: Update AR Aging
- Refresh aging report
- Update collection status
- Trigger dunning sequences
```

#### Common Reconciliation Issues

| Issue | Resolution |
|-------|------------|
| Missing reference number | Match by amount and date, confirm with customer |
| Partial payment | Apply to oldest invoices, contact for remainder |
| Overpayment | Create credit memo, offer refund or apply to future |
| Duplicate payment | Confirm duplicate, process refund |
| Bank fees deducted | Create adjustment invoice or absorb cost |
| Wrong currency | Apply correct exchange rate, document difference |

### 6. Billing Dispute Resolution

#### Dispute Categories

1. **Pricing Disputes**: Incorrect rates, missing discounts
2. **Quantity Disputes**: Wrong quantities invoiced
3. **Service Disputes**: Work not completed as expected
4. **Duplicate Billing**: Same service billed twice
5. **Tax Disputes**: Incorrect tax calculation
6. **Timing Disputes**: Billed before delivery

#### Dispute Resolution Workflow

```
RECEIVE DISPUTE
    |
    v
LOG IN SYSTEM (assign reference number)
    |
    v
ACKNOWLEDGE TO CUSTOMER (within 24 hours)
    |
    v
INVESTIGATE
- Pull original contract/PO
- Review delivery records
- Check communication history
- Validate pricing
    |
    v
RESOLUTION DECISION
    |
    +---> CUSTOMER IS CORRECT
    |     - Issue credit memo
    |     - Apologize
    |     - Update processes
    |
    +---> CUSTOMER IS INCORRECT
    |     - Provide documentation
    |     - Explain charges
    |     - Offer payment plan
    |
    +---> PARTIAL VALIDITY
          - Negotiate settlement
          - Document agreement
          - Issue adjusted invoice
```

## Tools & Templates

### Invoice Template Checklist

- [ ] Company logo and branding applied
- [ ] All required fields present
- [ ] Tax calculations verified
- [ ] Payment terms clearly stated
- [ ] Bank details accurate
- [ ] Online payment link functional
- [ ] Terms and conditions included
- [ ] Professional formatting

### AR Aging Report Template

```
ACCOUNTS RECEIVABLE AGING REPORT
As of: {date}

Customer | Current | 1-30 | 31-60 | 61-90 | 90+ | Total
---------|---------|------|-------|-------|-----|------
         |         |      |       |       |     |
TOTALS   |         |      |       |       |     |
% of Total|        |      |       |       |     |

SUMMARY METRICS
- Total AR: $
- Average Days Outstanding:
- Accounts 60+ Days: (count and %)
- Largest Delinquent Account: $
```

### Customer Credit Application

```
CREDIT APPLICATION

Business Information:
- Legal Business Name:
- DBA (if applicable):
- Business Address:
- Phone:
- Federal Tax ID:
- Years in Business:
- Type of Business:

Banking Reference:
- Bank Name:
- Account Number:
- Contact Name:
- Phone:

Trade References (3 minimum):
1. Company: | Contact: | Phone: | Account #:
2. Company: | Contact: | Phone: | Account #:
3. Company: | Contact: | Phone: | Account #:

Credit Requested:
- Credit Limit Requested: $
- Payment Terms Requested:

Authorization:
I authorize verification of all information provided.

Signature: _________________ Date: _______
Print Name: _________________
Title: _________________
```

### Recommended Software Tools

| Category | Tool Options | Best For |
|----------|--------------|----------|
| Invoicing | QuickBooks, FreshBooks, Xero | Full accounting |
| Billing | Stripe Billing, Chargebee | Subscriptions |
| AR Automation | Tesorio, YayPay, Versapay | Collections |
| Payment Processing | Stripe, Square, PayPal | Online payments |
| Reconciliation | FloQast, BlackLine | Month-end close |

## Metrics & KPIs

### Primary Billing Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| Days Sales Outstanding (DSO) | (AR / Revenue) x Days | <45 days |
| AR Turnover Ratio | Net Credit Sales / Avg AR | >8x annually |
| Collection Effectiveness Index | (Beginning AR + Sales - Ending AR) / (Beginning AR + Sales) x 100 | >80% |
| Bad Debt Percentage | Bad Debt / Total Sales x 100 | <2% |
| Invoice Accuracy Rate | Correct Invoices / Total Invoices x 100 | >99% |

### Secondary Metrics

- Average Days to Invoice (from service delivery)
- Percentage of invoices paid on time
- Percentage of invoices paid early (with discount)
- Customer dispute rate
- Cost per invoice processed
- Electronic payment adoption rate

### Metric Review Cadence

- **Daily**: Cash receipts, payment applications
- **Weekly**: AR aging review, collection calls
- **Monthly**: DSO calculation, bad debt analysis
- **Quarterly**: Customer term reviews, process improvements
- **Annually**: Credit policy review, system evaluations

## Common Pitfalls

### Invoice Creation Errors

1. **Missing PO numbers**: Delays payment at large companies
2. **Incorrect billing address**: Invoice goes to wrong department
3. **Vague descriptions**: Customer disputes charges
4. **Tax calculation errors**: Compliance issues, disputes
5. **Wrong payment details**: Payment goes to wrong account

### Collection Mistakes

1. **Inconsistent follow-up**: Customers learn they can delay
2. **No escalation path**: Same ineffective tactics repeated
3. **Being too aggressive**: Damages customer relationships
4. **Being too passive**: Cash flow suffers
5. **Not documenting communications**: No record for disputes

### Process Failures

1. **Manual processes**: Error-prone, time-consuming
2. **No credit checks**: Extending credit to bad risks
3. **Delayed invoicing**: Increases DSO artificially
4. **Poor reconciliation**: Payments not properly applied
5. **No aging reviews**: Problems caught too late

## Integration Points

### Connects to These Business Functions

- **Sales**: Contract terms flow to billing
- **Operations**: Delivery triggers invoicing
- **Accounting**: Revenue recognition, GL posting
- **Treasury**: Cash flow forecasting
- **Customer Service**: Dispute handling, inquiries
- **Legal**: Collections escalation, contracts

### System Integrations

- **CRM to Billing**: Customer and contract data
- **ERP to Invoicing**: Order and inventory data
- **Billing to Accounting**: Revenue and AR postings
- **Banking to Reconciliation**: Payment data feeds
- **Collections to Credit**: Customer risk updates

### Data Flow Requirements

```
SALES ORDER
    |
    v
ORDER FULFILLMENT
    |
    v
INVOICING
    |
    v
AR SUBLEDGER --> GENERAL LEDGER
    |
    v
PAYMENT RECEIVED
    |
    v
CASH APPLICATION
    |
    v
BANK RECONCILIATION
```

---

*This skill is part of the INT Inc. Business Solutions back-of-house operations suite.*
