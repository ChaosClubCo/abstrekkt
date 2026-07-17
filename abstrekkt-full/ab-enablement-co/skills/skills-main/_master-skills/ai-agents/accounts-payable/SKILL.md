---
name: accounts-payable
description: Complete accounts payable skill for SMB operations. Use when managing vendor payments, processing purchase orders, implementing 3-way matching, designing approval chains, scheduling payments, or setting up vendor portals. Covers invoice processing, payment optimization, and vendor relationship management.
---

# Accounts Payable Management

## Overview

Accounts Payable (AP) is the process of managing outgoing payments for goods and services purchased by the business. Effective AP management ensures timely vendor payments, captures early payment discounts, prevents duplicate payments, maintains vendor relationships, and provides accurate financial reporting. This skill covers the complete AP lifecycle from invoice receipt through payment and reconciliation.

For SMB business solutions, streamlined AP processes reduce processing costs, prevent fraud, optimize cash flow through strategic payment timing, and build strong vendor relationships through reliable payment practices.

## When to Use

Invoke this skill when:
- Processing vendor invoices and payments
- Setting up purchase order workflows
- Implementing 3-way matching controls
- Designing payment approval hierarchies
- Optimizing payment scheduling and cash management
- Managing vendor master data and portals
- Preventing duplicate or fraudulent payments
- Handling vendor disputes and discrepancies
- Implementing AP automation
- Month-end close AP procedures
- 1099 vendor reporting

## Core Processes

### 1. Invoice Processing Workflow

#### Invoice Receipt and Logging

```
INVOICE INTAKE PROCESS

RECEIPT CHANNELS
1. Email (AP@company.com)
2. Vendor Portal upload
3. Mail (physical invoices)
4. EDI/Electronic interchange
5. Supplier network (Ariba, Coupa)

INITIAL LOGGING
Upon receipt, capture:
- Vendor name
- Invoice number
- Invoice date
- Due date
- Amount
- PO number (if applicable)
- Receipt date (timestamp)

INITIAL VALIDATION
[ ] Invoice is legible/complete
[ ] Vendor is in approved vendor list
[ ] Invoice not previously received (duplicate check)
[ ] Required fields present
[ ] Tax calculations accurate
```

#### Invoice Processing Workflow Diagram

```
INVOICE RECEIVED
       |
       v
LOG IN AP SYSTEM
       |
       v
DUPLICATE CHECK -----> Duplicate? -----> REJECT/INVESTIGATE
       |                    |
       No                   |
       |                    |
       v                    |
PO-BASED INVOICE? ---------|
       |                    |
   +---+---+                |
   |       |                |
  YES      NO               |
   |       |                |
   v       v                |
3-WAY    APPROVAL           |
MATCH    ROUTING            |
   |       |                |
   v       v                |
MATCHED? APPROVED? <--------|
   |       |
   |   +---+---+
   |   |       |
   |  YES      NO
   |   |       |
   |   v       v
   |  QUEUE   RETURN TO
   |  FOR     REQUESTOR
   |  PAYMENT
   |   |
   v   v
SCHEDULE PAYMENT
       |
       v
EXECUTE PAYMENT
       |
       v
RECONCILE & CLOSE
```

#### Invoice Data Entry Standards

```
MANDATORY INVOICE FIELDS

HEADER INFORMATION
- Vendor ID (from master file)
- Vendor name (auto-populate)
- Invoice number (exactly as shown)
- Invoice date
- Due date (calculated or entered)
- Payment terms code
- Currency (if multi-currency)

LINE ITEM INFORMATION
- GL account code
- Cost center/department
- Project code (if applicable)
- Description
- Quantity
- Unit price
- Line amount
- Tax code

VALIDATION RULES
- Invoice date not future dated
- Invoice date not > 90 days old
- Amount matches line totals
- Tax calculates correctly
- GL coding is valid
- Vendor payment terms applied
```

### 2. Purchase Order Workflow

#### PO Creation Process

```
PURCHASE REQUISITION TO PO

STEP 1: REQUISITION
Requestor submits:
- Items/services needed
- Estimated cost
- Justification
- Preferred vendor (optional)
- Needed by date

STEP 2: APPROVAL
Based on amount:
| Amount | Approver |
|--------|----------|
| <$500 | Manager auto-approve |
| $500-$2,500 | Manager |
| $2,500-$10,000 | Director |
| $10,000-$50,000 | VP/Finance |
| >$50,000 | CFO/Executive |

STEP 3: VENDOR SELECTION
- Preferred vendor list
- Competitive quotes (>$5,000)
- Contract compliance
- New vendor setup if needed

STEP 4: PO CREATION
- Assign PO number
- Enter line items
- Set delivery terms
- Specify billing address
- Send to vendor
```

#### PO Status Tracking

```
PURCHASE ORDER LIFECYCLE

STATUS          | DEFINITION
----------------|------------------------------------------
Draft           | PO created, not yet approved
Pending Approval| Awaiting required approvals
Approved        | Ready to send to vendor
Sent            | Transmitted to vendor
Acknowledged    | Vendor confirmed receipt
Partially Received | Some items delivered
Fully Received  | All items delivered
Partially Invoiced | Some invoices received
Fully Invoiced  | All expected invoices received
Closed          | Complete, no further activity
Cancelled       | Voided before completion

TRACKING REQUIREMENTS
- Receipt date for each line
- Quantity received vs ordered
- Quality acceptance status
- Invoice matching status
- Remaining balance
```

### 3. Three-Way Matching

#### 3-Way Match Process

```
THREE-WAY MATCHING CONTROL

DOCUMENTS COMPARED
1. Purchase Order (what was ordered)
2. Receiving Report (what was received)
3. Vendor Invoice (what was billed)

MATCHING FIELDS
| Field | PO | Receipt | Invoice | Tolerance |
|-------|-------|---------|---------|-----------|
| Vendor | Must match | N/A | Must match | Exact |
| Item/SKU | Ordered | Received | Billed | Exact |
| Quantity | Ordered | Received | Billed | +/- 5% |
| Unit Price | Agreed | N/A | Billed | +/- 2% |
| Total | Calculated | N/A | Billed | +/- $10 |

MATCH OUTCOMES
- Perfect Match: All fields within tolerance
- Price Variance: Unit price differs
- Quantity Variance: Quantities don't match
- No PO: Invoice without purchase order
- No Receipt: Invoice without goods receipt
```

#### Match Exception Handling

```
EXCEPTION RESOLUTION WORKFLOW

PRICE VARIANCE
1. Compare invoice price to PO price
2. Check for price change agreements
3. Contact vendor for clarification
4. If valid increase:
   - Obtain approval for variance
   - Update PO if ongoing
5. If vendor error:
   - Request corrected invoice

QUANTITY VARIANCE
1. Verify receiving documents
2. Check for partial shipments
3. Inspect for damaged goods
4. If over-shipment:
   - Return excess or adjust PO
5. If under-shipment:
   - Partial payment
   - Track backorder

NO PO INVOICE
1. Determine if PO was required
2. Identify requestor/department
3. If legitimate:
   - Create retroactive PO
   - Obtain required approvals
4. If unauthorized:
   - Return to vendor
   - Investigate purchasing bypass

RESOLUTION TIMELINE
- Initial review: Same day
- Vendor contact: Within 2 business days
- Approval escalation: Within 5 business days
- Maximum hold time: 15 business days
```

### 4. Approval Chains

#### Approval Matrix

```
INVOICE APPROVAL HIERARCHY

NON-PO INVOICES
| Amount | Primary Approver | Backup |
|--------|-----------------|--------|
| $0-$500 | Cost Center Manager | Director |
| $501-$2,500 | Department Director | VP |
| $2,501-$10,000 | VP/Division Head | CFO |
| $10,001-$50,000 | CFO | CEO |
| $50,000+ | CEO | Board |

PO-INVOICES (within tolerance)
| Variance | Approver |
|----------|----------|
| 0% (exact match) | Auto-approve |
| 1-5% | Cost Center Manager |
| 5-10% | Director |
| >10% | VP + Investigation |

SPECIAL CATEGORIES
| Category | Required Approver |
|----------|------------------|
| Capital expenditure | CFO |
| Related party | Board/Audit Committee |
| Executive expense | Board designee |
| Legal fees | General Counsel + CFO |
| Consulting | VP + Finance |
```

#### Approval Workflow Configuration

```
APPROVAL ROUTING RULES

SERIAL APPROVAL (one after another)
Scenario: Large capital purchase
Flow: Manager -> Director -> VP -> CFO -> CEO

PARALLEL APPROVAL (simultaneous)
Scenario: Cross-functional project
Flow: Dept Head + Project Manager + Finance

CONDITIONAL APPROVAL
Scenario: Based on attributes
Rules:
- If Capital > $25K: Add CFO
- If Legal related: Add General Counsel
- If IT purchase: Add IT Director

AUTO-APPROVAL RULES
Conditions for automatic approval:
- PO exists and fully matched
- Variance < 2%
- Vendor = approved vendor
- Amount < $500
- Category = recurring utility/rent
```

#### Approval Timeout and Escalation

```
APPROVAL ESCALATION PROCESS

STANDARD TIMELINE
Day 1: Invoice routed to approver
Day 3: First reminder if no action
Day 5: Second reminder + manager CC
Day 7: Auto-escalate to backup approver
Day 10: Escalate to department head
Day 14: AP manager intervention

ESCALATION NOTIFICATION TEMPLATE
Subject: URGENT: Invoice Approval Required - [Vendor] - [Amount]

Invoice #{invoice_number} requires your approval:
- Vendor: {vendor_name}
- Amount: ${amount}
- Due Date: {due_date}
- Days Pending: {days_pending}

This invoice has exceeded the standard approval timeline.
Please approve or reject within 24 hours.

[Approve] [Reject] [View Details]

VACATION/ABSENCE HANDLING
- Delegate authority must be pre-configured
- Out-of-office auto-routes to backup
- Critical invoices escalate immediately
```

### 5. Payment Scheduling

#### Payment Run Calendar

```
WEEKLY PAYMENT SCHEDULE

MONDAY
- Review AP aging report
- Prioritize payments for week
- Process urgent/critical payments
- Check early payment discount opportunities

WEDNESDAY (Main Payment Run)
- Process all approved invoices
- Execute check run (if applicable)
- Submit ACH batch file
- Process wire transfers
- Schedule card payments

FRIDAY
- Emergency payments only
- Cash position review
- Next week planning
- Vendor inquiry responses

DAILY
- Process urgent items
- Monitor for discount captures
- Resolve payment failures
- Update cash forecast
```

#### Payment Method Selection

```
PAYMENT METHOD DECISION MATRIX

| Criteria | ACH | Check | Wire | Virtual Card |
|----------|-----|-------|------|--------------|
| Cost | $0.25-0.50 | $1-3 | $15-30 | Rebate! |
| Speed | 2-3 days | 5-7 days | Same day | Immediate |
| Fraud risk | Low | High | Low | Very Low |
| Best for | Domestic, recurring | Legacy, small | International, urgent | Recurring, large |

PAYMENT METHOD ASSIGNMENT
1. Virtual Card: If vendor accepts, maximizes rebates
2. ACH: Default for domestic payments
3. Wire: International or >$100K urgent
4. Check: Vendor requirement only

VENDOR PAYMENT METHOD TRACKING
- Capture during vendor setup
- Verify periodically
- Track card acceptance rates
- Monitor for fraud patterns
```

#### Cash Flow Optimization

```
PAYMENT TIMING STRATEGY

EARLY PAYMENT DISCOUNTS
| Terms | Discount | Annual ROI |
|-------|----------|------------|
| 2/10 Net 30 | 2% | 36.7% |
| 1/10 Net 30 | 1% | 18.4% |
| 2/10 Net 45 | 2% | 21.0% |
| 1.5/15 Net 45 | 1.5% | 18.3% |

DECISION RULE
If: Cost of Capital < Discount ROI
Then: Take the discount
Else: Pay on due date

PAYMENT PRIORITIZATION
1. Payroll and taxes (non-negotiable)
2. Rent and utilities
3. Critical suppliers (production impact)
4. Discount opportunities (if cash available)
5. Standard terms vendors
6. Extended terms/flexible vendors

CASH MANAGEMENT
- Maintain minimum cash buffer
- Forecast cash needs 13 weeks out
- Time payments to cash receipts
- Avoid early payment without discount
```

### 6. Vendor Management

#### Vendor Master Data

```
VENDOR MASTER FILE REQUIREMENTS

BASIC INFORMATION
- Legal entity name
- DBA name (if different)
- Tax ID (EIN or SSN)
- Business address
- Remit-to address
- Primary contact
- Phone/email

PAYMENT INFORMATION
- Payment method preference
- Bank details (for ACH)
- Payment terms
- Currency
- 1099 status (Y/N)

BUSINESS DETAILS
- Vendor category
- Approved spending limit
- Contract reference
- Certificate of insurance
- W-9 on file
- Last review date

COMPLIANCE STATUS
[ ] W-9 verified (TIN match)
[ ] Insurance current
[ ] Contract signed
[ ] Approved vendor list
[ ] Background check (if applicable)
```

#### Vendor Portal Features

```
VENDOR SELF-SERVICE PORTAL

VENDOR CAPABILITIES
- Update contact information
- Submit invoices electronically
- Check invoice status
- View payment history
- Download remittance advice
- Submit credit/debit memos
- Request information updates

INVOICE SUBMISSION REQUIREMENTS
- Standard fields captured
- Document upload (PDF)
- PO reference required
- Auto-validation rules
- Duplicate checking
- Confirmation receipt

PORTAL METRICS
- Invoice submission accuracy
- Query volume reduction
- Payment inquiry self-service
- Update request processing
- Vendor satisfaction score
```

#### Vendor Performance Tracking

```
VENDOR SCORECARD

QUALITY METRICS
| Metric | Target | Weight |
|--------|--------|--------|
| On-time delivery | >95% | 25% |
| Quality acceptance rate | >98% | 25% |
| Invoice accuracy | >95% | 20% |
| Responsiveness | <24 hrs | 15% |
| Issue resolution | <5 days | 15% |

SCORING SCALE
- 90-100: Preferred vendor
- 80-89: Approved vendor
- 70-79: Probationary
- <70: Review for removal

REVIEW FREQUENCY
- Quarterly: Top 20 vendors by spend
- Semi-annual: All active vendors
- Annual: Full vendor base review
- As needed: Issue-triggered review
```

## Tools & Templates

### Invoice Processing Checklist

```
INVOICE PROCESSING CHECKLIST

RECEIPT & VALIDATION
[ ] Invoice logged with timestamp
[ ] Vendor verified in master file
[ ] Duplicate check completed
[ ] Required fields present
[ ] Math verified (extensions, totals)
[ ] Tax calculation correct

MATCHING & CODING
[ ] PO matched (if applicable)
[ ] Receiving confirmed
[ ] 3-way match completed
[ ] GL accounts assigned
[ ] Cost center coded
[ ] Project coded (if applicable)

APPROVAL & PAYMENT
[ ] Routed to correct approver
[ ] Approval obtained
[ ] Payment terms applied
[ ] Scheduled for payment run
[ ] Payment method confirmed
[ ] Banking details verified
```

### Payment Approval Form

```
PAYMENT AUTHORIZATION

Date: _______________
Requested By: _______________
Department: _______________

PAYMENT DETAILS
Vendor: _______________
Invoice(s): _______________
Total Amount: $_______________
Due Date: _______________

PAYMENT METHOD
[ ] ACH    [ ] Wire    [ ] Check    [ ] Card

JUSTIFICATION
________________________________________________
________________________________________________

APPROVALS REQUIRED
[ ] Department Manager: _______________ Date: _____
[ ] Finance Approval: _______________ Date: _____
[ ] CFO (if >$50K): _______________ Date: _____

FOR AP USE
Payment Run Date: _______________
Payment Reference: _______________
Processed By: _______________
```

### AP Software Solutions

| Solution | Size | Price Range | Key Features |
|----------|------|-------------|--------------|
| Bill.com | SMB | $45-79/mo | Approvals, ACH, sync |
| SAP Concur | Mid-Enterprise | Custom | Full procure-to-pay |
| Tipalti | Growth | $129+/mo | Global payments, tax |
| AvidXchange | Mid-market | Custom | Invoice automation |
| BILL Spend | SMB | Free-$39/mo | Cards + AP |
| Stampli | Mid-market | Custom | AI-powered |

## Metrics & KPIs

### AP Efficiency Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| Invoice Processing Time | Avg days: receipt to approval | <5 days |
| Cost per Invoice | AP costs / Invoices processed | <$10 |
| Invoices per FTE | Invoices / AP staff | >5,000/year |
| Electronic Invoice % | E-invoices / Total | >80% |
| Touchless Rate | Auto-processed / Total | >30% |

### Accuracy Metrics

| Metric | Target |
|--------|--------|
| First-time match rate | >85% |
| Duplicate payment rate | <0.1% |
| Invoice accuracy (no corrections) | >98% |
| Payment error rate | <0.5% |

### Financial Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| Days Payable Outstanding | (AP / COGS) x 365 | 30-45 days |
| Early Payment Discount Capture | Discounts taken / Available | >80% |
| On-time Payment Rate | Paid by due / Total | >95% |
| AP Aging >90 days | Invoices >90 / Total | <2% |

## Common Pitfalls

### Processing Errors

1. **Duplicate payments**: Same invoice paid twice
2. **Wrong amounts**: Data entry errors
3. **Wrong vendor**: Paid incorrect party
4. **Missed discounts**: Not taking available terms
5. **Coding errors**: Wrong GL or cost center

### Control Weaknesses

1. **No PO requirement**: Purchases without approval
2. **Segregation issues**: Same person receives and pays
3. **No vendor verification**: Fake vendor fraud
4. **Weak approval limits**: Inadequate oversight
5. **Missing documentation**: Can't support payments

### Process Inefficiencies

1. **Paper invoices**: Slow, error-prone
2. **Manual matching**: Time-consuming
3. **Email approvals**: No audit trail
4. **Siloed systems**: Duplicate data entry
5. **No vendor portal**: High inquiry volume

## Integration Points

### Connects to These Business Functions

- **Procurement**: PO creation, vendor selection
- **Receiving**: Goods receipt, quality
- **Accounting**: GL posting, period close
- **Treasury**: Cash management, forecasting
- **Tax**: 1099 reporting, VAT/GST
- **Compliance**: Audit support, controls
- **Vendor Management**: Performance, relationships

### System Integrations

```
AP SYSTEM ECOSYSTEM

PROCUREMENT ---> PURCHASE ORDERS
                      |
                      v
RECEIVING -----> GOODS RECEIPTS
                      |
                      v
VENDOR PORTAL --> INVOICES --> AP SYSTEM
                                   |
                      +------------+------------+
                      |            |            |
                      v            v            v
                 APPROVALS    3-WAY MATCH   CODING
                      |            |            |
                      +-----+------+------+-----+
                            |
                            v
                    PAYMENT PROCESSING
                            |
                            v
                    BANK/TREASURY
                            |
                            v
                    ACCOUNTING/GL
```

---

*This skill is part of the INT Inc. Business Solutions back-of-house operations suite.*
