---
name: expense-management
description: Complete expense management skill for SMB operations. Use when creating expense policies, designing approval workflows, processing reimbursements, managing corporate card programs, or categorizing expenses. Covers policy templates, receipt handling, compliance requirements, and audit procedures.
---

# Expense Management

## Overview

Expense management encompasses the policies, procedures, and systems that control how employees spend company money and get reimbursed for business expenses. Effective expense management protects company assets, ensures tax compliance, provides spend visibility, and maintains employee satisfaction through timely reimbursements.

For SMB business solutions, a well-designed expense management system reduces fraud risk, simplifies tax preparation, enables better budgeting, and creates clear expectations for employees while minimizing administrative overhead.

## When to Use

Invoke this skill when:
- Creating or updating expense reimbursement policies
- Designing approval workflows and spending limits
- Setting up corporate card programs
- Processing employee reimbursement requests
- Categorizing expenses for accounting and tax purposes
- Implementing expense tracking software
- Auditing expense reports for compliance
- Training employees on expense procedures
- Handling expense disputes or policy violations
- Preparing expense data for tax filing
- Analyzing spending patterns across departments

## Core Processes

### 1. Expense Policy Framework

#### Policy Structure Template

```
EXPENSE REIMBURSEMENT POLICY
Version: X.X | Effective Date: MM/DD/YYYY

1. PURPOSE AND SCOPE
   - Policy objectives
   - Who is covered
   - Types of expenses covered

2. GENERAL PRINCIPLES
   - Business necessity requirement
   - Reasonableness standard
   - Documentation requirements

3. EXPENSE CATEGORIES
   - Travel
   - Meals & Entertainment
   - Office Supplies
   - Professional Development
   - Technology
   - Other Business Expenses

4. SPENDING LIMITS
   - Per diem rates
   - Category limits
   - Approval thresholds

5. APPROVAL REQUIREMENTS
   - Pre-approval requirements
   - Post-expense approval
   - Exception handling

6. SUBMISSION PROCEDURES
   - Timeline requirements
   - Documentation needed
   - Submission method

7. REIMBURSEMENT PROCESS
   - Processing timeline
   - Payment method
   - Dispute resolution

8. NON-COMPLIANCE
   - Policy violations
   - Consequences
   - Appeals process
```

#### Travel Expense Guidelines

| Category | Standard | Premium (VP+) | Notes |
|----------|----------|---------------|-------|
| Airfare | Economy | Business (6+ hrs) | Book 14+ days advance |
| Hotel | $150/night | $250/night | Per city rate may vary |
| Rental Car | Compact/Mid | Mid/Full | Fuel reimbursed |
| Meals | $75/day | $100/day | Or actual with receipts |
| Rideshare | Actual | Actual | Business use only |
| Parking | Actual | Actual | Receipts required >$25 |
| Internet | Actual | Actual | When traveling |

#### Meal & Entertainment Limits

```
MEAL EXPENSES (per person)
- Breakfast: $20
- Lunch: $30
- Dinner: $50
- Client Entertainment: $100 (pre-approval required)

DOCUMENTATION REQUIRED
- Receipt for all meals
- Business purpose
- Attendees (names and companies)
- Topics discussed

WHAT'S NOT COVERED
- Alcohol (except client entertainment with approval)
- Spouse/partner meals (except approved events)
- Excessive tips (>20%)
- Room service (except during work hours)
```

### 2. Approval Workflow Design

#### Approval Threshold Matrix

| Expense Amount | Approver Level | Pre-Approval Required |
|----------------|----------------|----------------------|
| $0 - $100 | Auto-approved | No |
| $101 - $500 | Direct Manager | No |
| $501 - $2,000 | Department Head | Yes for travel |
| $2,001 - $5,000 | VP/Director | Yes |
| $5,001 - $10,000 | CFO | Yes |
| $10,000+ | CEO | Yes |

#### Workflow Diagram

```
EXPENSE SUBMITTED
       |
       v
RECEIPT VALIDATION
       |
   +---+---+
   |       |
Valid   Invalid --> Return to Employee
   |
   v
POLICY COMPLIANCE CHECK
       |
   +---+---+
   |       |
Compliant  Non-Compliant --> Flag for Review
   |
   v
AMOUNT CHECK
       |
   +---+---+
   |       |
Under Limit  Over Limit --> Manager Approval
   |
   v
CATEGORY ROUTING
       |
   +---+---+---+---+
   |   |   |   |   |
Travel M&E Supplies Tech Other
   |   |   |   |   |
   v   v   v   v   v
APPROPRIATE APPROVER
       |
       v
APPROVED/REJECTED
       |
       v
ACCOUNTING REVIEW
       |
       v
PAYMENT PROCESSING
```

#### Exception Handling Process

```
EXCEPTION REQUEST WORKFLOW

1. EMPLOYEE SUBMITS
   - Reason for exception
   - Business justification
   - Supporting documentation

2. MANAGER REVIEW
   - Evaluate business need
   - Consider precedent
   - Recommend approval/denial

3. FINANCE REVIEW
   - Policy interpretation
   - Budget impact
   - Tax implications

4. DECISION
   - Approve (one-time or update policy)
   - Deny with explanation
   - Partial approval

5. DOCUMENTATION
   - Record decision
   - Update employee file
   - Consider policy revision if recurring
```

### 3. Reimbursement Procedures

#### Submission Requirements

```
REQUIRED DOCUMENTATION BY EXPENSE TYPE

TRAVEL
- Itemized hotel receipt (not just credit card statement)
- Flight itinerary/boarding pass
- Rental car agreement
- Toll receipts or E-ZPass statement
- Conference registration confirmation

MEALS
- Itemized receipt (showing what was ordered)
- Business purpose
- Names of all attendees
- Their company affiliations

SUPPLIES & EQUIPMENT
- Original receipt
- Business purpose
- Location of asset (for equipment)

MILEAGE
- Trip start/end locations
- Business purpose
- Calculated mileage (current IRS rate)

PROFESSIONAL DEVELOPMENT
- Course/conference description
- Registration receipt
- Manager pre-approval email
```

#### Submission Timeline

| Expense Type | Submission Deadline | Late Policy |
|--------------|--------------------|-|
| Travel | Within 30 days of return | May be denied after 60 days |
| Regular | Within 30 days of expense | May be denied after 60 days |
| Year-end | By January 15 for prior year | Required for tax compliance |
| Corporate Card | Within 20 days of statement | Affects credit standing |

#### Reimbursement Processing Schedule

```
STANDARD PROCESSING TIMELINE

Day 1-3: Submission received and logged
Day 4-7: Manager approval process
Day 8-10: Finance review and coding
Day 11-14: Payment batch processing
Day 15-21: Payment issued

PAYMENT METHODS
- Direct deposit (preferred): 2-3 business days
- Paper check: 5-7 business days
- Payroll addition: Next payroll cycle

EXPRESS PROCESSING (OVER $500)
- Available by request
- Requires VP approval
- 5 business day turnaround
```

### 4. Corporate Card Program

#### Card Program Structure

```
CARD TYPE MATRIX

TRAVEL CARD (T&E Card)
- For: Frequent travelers
- Limit: $5,000 - $25,000
- Categories: Travel, lodging, meals
- Individual liability with company payment

PURCHASING CARD (P-Card)
- For: Office managers, procurement
- Limit: $2,500 - $10,000
- Categories: Supplies, subscriptions, services
- Company liability

EXECUTIVE CARD
- For: VP and above
- Limit: $25,000+
- Categories: All business expenses
- Company liability

DEPARTMENT CARD
- For: Shared team use
- Limit: $5,000 - $15,000
- Categories: Specific to department
- Requires sign-out log
```

#### Card Policy Requirements

```
CORPORATE CARD AGREEMENT

EMPLOYEE RESPONSIBILITIES
- Card is company property
- Business use only
- Reconcile within 20 days of statement
- Report lost/stolen immediately
- Return upon termination

PROHIBITED TRANSACTIONS
- Personal purchases
- Cash advances (except emergencies)
- Gift cards
- Donations without approval
- Fuel for personal vehicles

COMPLIANCE
- First violation: Written warning
- Second violation: Card suspended, retraining
- Third violation: Card revoked, disciplinary action
- Fraud: Immediate termination, prosecution

RECONCILIATION PROCESS
1. Review monthly statement
2. Attach receipts to each transaction
3. Code each expense to correct category
4. Obtain approvals for out-of-policy items
5. Submit by deadline
6. Resolve disputes promptly
```

#### Card Reconciliation Workflow

```
MONTHLY CARD RECONCILIATION

EMPLOYEE (Days 1-10 after statement)
[ ] Download/receive statement
[ ] Match receipts to transactions
[ ] Code expense categories
[ ] Add business purpose notes
[ ] Flag personal charges for repayment
[ ] Submit for approval

MANAGER (Days 11-15)
[ ] Review for policy compliance
[ ] Verify business purposes
[ ] Approve or reject items
[ ] Return for corrections if needed

FINANCE (Days 16-20)
[ ] Final coding review
[ ] Process personal charge repayments
[ ] Post to general ledger
[ ] Reconcile to card statement
[ ] Flag for audit if needed
```

### 5. Expense Categorization

#### Standard Expense Categories

```
CATEGORY CHART OF ACCOUNTS MAPPING

6100 - TRAVEL
  6110 - Airfare
  6120 - Lodging
  6130 - Ground Transportation
  6140 - Rental Cars
  6150 - Parking & Tolls
  6160 - Travel Meals

6200 - MEALS & ENTERTAINMENT
  6210 - Team Meals
  6220 - Client Entertainment
  6230 - Business Meals
  6240 - Office Snacks/Coffee

6300 - OFFICE EXPENSES
  6310 - Office Supplies
  6320 - Postage & Shipping
  6330 - Printing & Copying
  6340 - Office Equipment (<$500)

6400 - TECHNOLOGY
  6410 - Software Subscriptions
  6420 - Hardware (<$500)
  6430 - Phone/Internet
  6440 - Cloud Services

6500 - PROFESSIONAL DEVELOPMENT
  6510 - Training & Courses
  6520 - Conferences
  6530 - Books & Subscriptions
  6540 - Certifications

6600 - OTHER BUSINESS EXPENSES
  6610 - Dues & Memberships
  6620 - Bank Fees
  6630 - Licenses & Permits
  6640 - Miscellaneous
```

#### Tax-Deductibility Guide

| Category | Deductible | Documentation Needed | Notes |
|----------|------------|---------------------|-------|
| Business Travel | 100% | Receipts, itinerary | Must be away overnight |
| Meals (business) | 50% | Itemized receipt, attendees | Must have business purpose |
| Client Entertainment | 50% | Receipt, attendees, purpose | Directly related to business |
| Home Office | Varies | Dedicated space required | Simplified or actual method |
| Vehicle | IRS rate or actual | Mileage log | Business miles only |
| Education | 100% | Receipt, course description | Must maintain/improve skills |
| Gifts | $25/person/year | Receipt | Limited deductibility |

### 6. Audit and Compliance

#### Monthly Audit Procedures

```
EXPENSE AUDIT CHECKLIST

RANDOM SAMPLE AUDIT (10% of reports)
[ ] Verify receipt matches amount claimed
[ ] Confirm business purpose documented
[ ] Check policy compliance
[ ] Validate approval chain followed
[ ] Verify correct coding
[ ] Check for duplicates

RED FLAG INDICATORS
- Round dollar amounts
- Weekend expenses without travel
- Expenses just under approval threshold
- Missing or illegible receipts
- Frequent same-vendor transactions
- Meals for one coded as client entertainment

AUDIT FINDINGS DOCUMENTATION
- Finding description
- Policy violated
- Amount involved
- Employee response
- Corrective action
- Follow-up date
```

#### Compliance Report Template

```
MONTHLY EXPENSE COMPLIANCE REPORT
Period: MM/YYYY

SUMMARY METRICS
- Total expense reports: ___
- Total reimbursements: $___
- Reports audited: ___
- Compliance rate: ___%

POLICY VIOLATIONS
| Type | Count | Amount | Trend |
|------|-------|--------|-------|
| Missing receipts | | | |
| Over limit | | | |
| Late submission | | | |
| Wrong category | | | |
| Other | | | |

TOP SPEND BY CATEGORY
1. Category: $Amount (% of total)
2. Category: $Amount (% of total)
3. Category: $Amount (% of total)

TOP SPEND BY DEPARTMENT
1. Department: $Amount
2. Department: $Amount
3. Department: $Amount

RECOMMENDATIONS
- Policy updates needed
- Training requirements
- System improvements
```

## Tools & Templates

### Expense Report Template

```
EXPENSE REPORT

Employee: _______________ Department: _______________
Report Period: ___________ Submit Date: _______________
Manager: _______________

| Date | Vendor | Description | Category | Amount | Receipt |
|------|--------|-------------|----------|--------|---------|
|      |        |             |          |        | [ ]     |
|      |        |             |          |        | [ ]     |
|      |        |             |          |        | [ ]     |

Subtotal: $___________
Less: Corporate Card Charges: ($__________)
Reimbursement Due: $___________

Certification: I certify these expenses were incurred for
legitimate business purposes and comply with company policy.

Employee Signature: _______________ Date: ___________
Manager Approval: _______________ Date: ___________
Finance Approval: _______________ Date: ___________
```

### Mileage Log Template

```
MILEAGE REIMBURSEMENT LOG
Employee: _______________ Period: _______________

| Date | From | To | Purpose | Miles | Rate | Amount |
|------|------|-------|---------|-------|------|--------|
|      |      |       |         |       | $0.67|        |
|      |      |       |         |       | $0.67|        |

Total Miles: _______ Total Reimbursement: $_______

Note: Rate as of 2024 is $0.67/mile (update annually per IRS)
```

### Expense Software Recommendations

| Solution | Best For | Price Range | Key Features |
|----------|----------|-------------|--------------|
| Expensify | SMB general | $5-18/user/mo | Receipt scanning, mileage |
| Concur | Mid-market | $8-25/user/mo | Travel integration, cards |
| Ramp | Startups | Free-$15/user/mo | Cards + expense combined |
| Brex | Tech companies | Custom | Cards + bill pay |
| Zoho Expense | Budget-conscious | $3-8/user/mo | Good integrations |
| QuickBooks | QB users | Included | Native integration |

## Metrics & KPIs

### Primary Expense Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| Processing Time | Submit to payment days | <14 days |
| Policy Compliance Rate | Compliant reports / Total | >95% |
| T&E as % of Revenue | T&E Spend / Revenue | <5% |
| Cost per Report | Processing cost / Reports | <$20 |
| Receipt Compliance | Reports with receipts / Total | >98% |

### Spend Analysis Metrics

- Expense per employee by category
- Spend by department vs budget
- Travel spend by trip purpose
- Vendor concentration
- Card utilization rate
- Exception approval rate

### Efficiency Metrics

- Average approval cycle time
- Automation rate (auto-approved %)
- Mobile submission rate
- Straight-through processing rate
- Audit finding rate

## Common Pitfalls

### Policy Design Errors

1. **Overly complex policies**: Employees don't read or follow
2. **Too restrictive**: Reduces productivity, workarounds develop
3. **Too lenient**: Excessive spending, abuse
4. **Unclear guidelines**: Inconsistent enforcement
5. **Outdated limits**: Haven't adjusted for inflation

### Process Failures

1. **Paper-based systems**: Slow, error-prone, lost receipts
2. **No receipt enforcement**: Tax audit risk
3. **Delayed reimbursements**: Employee dissatisfaction
4. **Manual coding**: Categorization errors
5. **No audit trail**: Fraud vulnerability

### Compliance Issues

1. **Missing documentation**: IRS disallowance
2. **Personal expenses**: Tax implications
3. **Entertainment limits**: Deductibility rules
4. **International expenses**: Currency, VAT issues
5. **Contractor expenses**: 1099 implications

## Integration Points

### Connects to These Business Functions

- **Payroll**: Reimbursement payments
- **Accounting**: GL coding, accruals
- **Tax**: Deductibility, 1099s
- **Budget**: Spend tracking vs plan
- **Procurement**: Vendor management
- **HR**: Policy communication, violations
- **IT**: System access, mobile apps
- **Travel**: Booking integration

### System Integrations

```
EXPENSE MANAGEMENT ECOSYSTEM

EXPENSE SYSTEM
     |
     +--- Credit Card Feeds
     |
     +--- Bank Account (reimbursements)
     |
     +--- Accounting System (GL posting)
     |
     +--- HR System (employee data)
     |
     +--- Travel Booking (itineraries)
     |
     +--- Receipt Storage (document management)
     |
     +--- Reporting/BI (spend analytics)
```

### Data Requirements

- Employee master data (cost center, manager)
- Chart of accounts mapping
- Approval hierarchy
- Budget data for comparison
- Credit card transaction feeds
- Bank account for payments

---

*This skill is part of the INT Inc. Business Solutions back-of-house operations suite.*
