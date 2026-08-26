---
name: payroll-processing
description: Helps automate and manage payroll processing processes. Complete payroll processing skill for SMB operations. Use when managing payroll cycles, ensuring tax compliance, administering benefits, tracking time, creating payroll calendars, or processing contractor payments. Covers federal/state requirements, deduction management, and payroll best practices.
---

# Payroll Processing

## Overview

Payroll processing is a critical business function that directly impacts employee satisfaction, regulatory compliance, and financial accuracy. This skill covers end-to-end payroll operations including pay cycles, tax withholding and remittance, benefits administration, time tracking, payroll calendars, and contractor payment processing. Proper payroll management ensures employees are paid accurately and on time while maintaining compliance with federal, state, and local regulations.

For SMB business solutions, efficient payroll processing reduces administrative burden, minimizes compliance risks, and builds employee trust through reliable, accurate compensation.

## When to Use

Invoke this skill when:
- Setting up or modifying payroll cycles and schedules
- Processing regular payroll runs
- Ensuring federal and state tax compliance
- Managing employee benefits and deductions
- Implementing time tracking systems
- Creating annual payroll calendars
- Processing contractor and 1099 payments
- Handling payroll tax deposits and filings
- Addressing payroll discrepancies or corrections
- Onboarding new employees to payroll
- Year-end payroll processing (W-2s, 1099s)
- Responding to wage garnishments

## Core Processes

### 1. Payroll Cycle Management

#### Pay Frequency Options

| Frequency | Pay Periods/Year | Best For | Considerations |
|-----------|-----------------|----------|----------------|
| Weekly | 52 | Hourly workers, construction | Higher processing cost |
| Bi-weekly | 26 | Most common, balanced | Two 3-pay months |
| Semi-monthly | 24 | Salaried employees | Variable days in period |
| Monthly | 12 | Executives, small teams | Cash flow friendly |

#### Bi-Weekly Payroll Cycle Example

```
STANDARD BI-WEEKLY PAYROLL TIMELINE

Pay Period: Sunday through Saturday (14 days)
Pay Date: Friday following period end

TIMELINE:
Day 1-14: Work period
Day 15 (Monday): Period ends (Saturday night)
Day 16 (Tuesday): Time sheets due by noon
Day 17 (Wednesday): Manager approval deadline
Day 18 (Thursday): Payroll processing
Day 19 (Friday): Pay date

CRITICAL DEADLINES:
- Time entry cutoff: Tuesday 12:00 PM
- Manager approval: Wednesday 12:00 PM
- Payroll submission: Wednesday 5:00 PM
- Final payroll lock: Thursday 10:00 AM
- Direct deposit file: Thursday 12:00 PM
```

#### Payroll Processing Checklist

```
PRE-PAYROLL (Day 1-2)
[ ] Send time sheet reminders
[ ] Verify all time entries submitted
[ ] Check for missing punches/entries
[ ] Review overtime calculations
[ ] Confirm PTO balances and usage

PROCESSING (Day 3)
[ ] Import/verify time data
[ ] Enter new hires and changes
[ ] Process salary adjustments
[ ] Apply bonus/commission payments
[ ] Calculate deductions
[ ] Verify benefits enrollments
[ ] Process garnishments
[ ] Review payroll register

APPROVAL (Day 3-4)
[ ] Department manager review
[ ] Finance/controller approval
[ ] Final payroll verification
[ ] Run pre-check reports

TRANSMISSION (Day 4)
[ ] Submit direct deposit file
[ ] Process live checks (if any)
[ ] Verify tax deposits scheduled
[ ] Confirm bank funding

POST-PAYROLL (Day 5+)
[ ] Distribute pay stubs
[ ] File payroll journal entries
[ ] Update GL postings
[ ] Archive payroll records
[ ] Prepare next period
```

### 2. Tax Compliance

#### Federal Tax Requirements

```
FEDERAL TAX OBLIGATIONS

EMPLOYEE WITHHOLDING
- Federal Income Tax (based on W-4)
- Social Security: 6.2% (up to wage base)
- Medicare: 1.45% (no limit)
- Additional Medicare: 0.9% (over $200K)

EMPLOYER TAXES
- Social Security: 6.2% (matching)
- Medicare: 1.45% (matching)
- FUTA: 6.0% (first $7,000, reduced by SUTA credit)

DEPOSIT SCHEDULE
Monthly Depositor:
- Deposit by 15th of following month
- If liability <$2,500/quarter

Semi-Weekly Depositor:
- Wages paid Wed-Fri: Deposit by Wednesday
- Wages paid Sat-Tue: Deposit by Friday
- If liability >$50,000 previous year

FILING REQUIREMENTS
Form 941: Quarterly (by month-end after quarter)
Form 940: Annual FUTA (January 31)
Form W-2: Annual to employees (January 31)
Form W-3: Annual transmittal (January 31)
```

#### State Tax Compliance Matrix

```
STATE COMPLIANCE CHECKLIST

WITHHOLDING TAXES
[ ] Register for state withholding account
[ ] Obtain state tax tables/rates
[ ] Configure withholding calculations
[ ] Set up deposit schedule
[ ] File quarterly/annual returns

STATE UNEMPLOYMENT (SUTA)
[ ] Register for SUTA account
[ ] Determine experience rate
[ ] Calculate taxable wage base
[ ] Make quarterly deposits
[ ] File quarterly reports

LOCAL TAXES (where applicable)
[ ] City/county income tax
[ ] Local services tax
[ ] Occupational privilege tax
[ ] Transit taxes

MULTI-STATE CONSIDERATIONS
- Determine work location vs residence state
- Reciprocity agreements
- Nexus and reporting requirements
- Remote worker implications
```

#### Tax Deposit Calendar

```
PAYROLL TAX CALENDAR (Bi-Weekly Depositor)

JANUARY
- Jan 15: Q4 Form 941 due
- Jan 31: Form 940 due
- Jan 31: W-2s to employees
- Jan 31: W-2s/W-3 to SSA
- Weekly: Tax deposits per schedule

APRIL
- Apr 30: Q1 Form 941 due
- Apr 30: State quarterly reports

JULY
- Jul 31: Q2 Form 941 due
- Jul 31: State quarterly reports

OCTOBER
- Oct 31: Q3 Form 941 due
- Oct 31: State quarterly reports

ONGOING
- Deposits within 3 business days of payroll
- State deposits per state schedule
- Garnishment remittances per order
```

### 3. Benefits Administration

#### Standard Benefits Deductions

```
PRE-TAX DEDUCTIONS (Section 125)
- Medical insurance premiums
- Dental insurance premiums
- Vision insurance premiums
- Health Savings Account (HSA)
- Flexible Spending Account (FSA)
- Dependent Care FSA
- 401(k) traditional contributions
- Commuter benefits

POST-TAX DEDUCTIONS
- Roth 401(k) contributions
- Life insurance (over $50K)
- Disability insurance (some states)
- Union dues
- Charitable contributions
- Garnishments

CALCULATION ORDER
1. Gross pay
2. Pre-tax deductions
3. Tax calculations (on reduced gross)
4. Post-tax deductions
5. Net pay
```

#### Benefits Enrollment Processing

```
NEW HIRE BENEFITS ENROLLMENT

TIMELINE
Day 1: Provide benefits overview
Day 1-30: Enrollment window (per plan)
Day 30: Enrollment deadline
Day 31: Coverage effective (typically 1st of month)

PROCESSING STEPS
1. Verify eligibility
2. Collect enrollment forms
3. Validate dependent documentation
4. Enter elections in payroll system
5. Calculate deduction amounts
6. Set effective dates
7. Send to carriers
8. Confirm enrollment

DOCUMENTATION REQUIRED
- Enrollment form (signed)
- Dependent information
- Beneficiary designations
- Prior coverage certificates (if applicable)
- Life event documentation (if special enrollment)

COMMON ELECTIONS
| Benefit | Employee | Emp + Spouse | Emp + Child | Family |
|---------|----------|--------------|-------------|--------|
| Medical | $XXX/mo | $XXX/mo | $XXX/mo | $XXX/mo |
| Dental | $XX/mo | $XX/mo | $XX/mo | $XX/mo |
| Vision | $X/mo | $XX/mo | $XX/mo | $XX/mo |
```

#### 401(k) Administration

```
401(K) PAYROLL PROCESSING

CONTRIBUTION LIMITS (2024)
- Employee elective: $23,000
- Catch-up (50+): $7,500 additional
- Total limit (all sources): $69,000

PAYROLL RESPONSIBILITIES
- Calculate employee contributions
- Calculate employer match
- Remit to plan provider (timely)
- Track YTD contributions
- Apply limits/stop when reached
- Process loan repayments

DEPOSIT TIMING
- Must deposit as soon as reasonably possible
- Safe harbor: within 7 business days
- DOL scrutiny for delays

MATCHING FORMULA EXAMPLES
- 100% match on first 3%, 50% on next 2%
- 50% match up to 6%
- Dollar-for-dollar up to 4%
- Safe Harbor: 100% up to 3%, 50% next 2%
```

### 4. Time Tracking

#### Time Tracking Methods

| Method | Best For | Pros | Cons |
|--------|----------|------|------|
| Time Clock | Hourly, on-site | Accurate, objective | Hardware cost |
| Web-Based | Remote workers | Accessible | Requires discipline |
| Mobile App | Field workers | GPS tracking | Data costs |
| Manual Timesheet | Small teams | Simple | Error-prone |
| Project-Based | Professionals | Links to billing | Complexity |

#### Time Entry Policies

```
TIME TRACKING POLICY

RECORDING REQUIREMENTS
- Clock in at start of shift
- Clock out at end of shift
- Record meal breaks (if unpaid)
- Note project/job codes (if applicable)

ROUNDING RULES (7-minute rule)
- 1-7 minutes: Round down
- 8-14 minutes: Round up
- Example: 8:07 = 8:00, 8:08 = 8:15

OVERTIME CALCULATIONS
Federal FLSA:
- Over 40 hours/week = 1.5x
- Workweek = fixed 7-day period

State variations:
- California: Daily OT (over 8 hours)
- Some states: 7th day premium
- Check state requirements

MISSING TIME ENTRIES
1. Employee submits correction request
2. Supervisor reviews/approves
3. Payroll makes adjustment
4. Document in personnel file

PROHIBITED PRACTICES
- Working off the clock
- Automatic deductions for breaks not taken
- Rounding that consistently favors employer
- Requiring pre-approval for actual work time
```

#### Timesheet Approval Workflow

```
TIMESHEET APPROVAL PROCESS

EMPLOYEE RESPONSIBILITIES
1. Enter time daily (recommended)
2. Review for accuracy
3. Add notes/explanations as needed
4. Submit by deadline
5. Respond to rejection promptly

MANAGER RESPONSIBILITIES
1. Review submissions by deadline
2. Verify against schedule/projects
3. Approve or reject with comments
4. Escalate concerns to HR/Payroll
5. Ensure team compliance

SYSTEM WORKFLOW
Employee Submits
       |
       v
Manager Review
       |
   +---+---+
   |       |
Approve   Reject
   |         |
   v         v
Payroll   Return to Employee
   |         |
   v         +---> Revise & Resubmit
Process
```

### 5. Payroll Calendar

#### Annual Payroll Calendar Template

```
2024 PAYROLL CALENDAR (Bi-Weekly)

PAY   PERIOD START   PERIOD END    PAY DATE    NOTES
1     12/31/2023     01/13/2024    01/19/2024
2     01/14/2024     01/27/2024    02/02/2024
3     01/28/2024     02/10/2024    02/16/2024
4     02/11/2024     02/24/2024    03/01/2024
5     02/25/2024     03/09/2024    03/15/2024
6     03/10/2024     03/23/2024    03/29/2024
7     03/24/2024     04/06/2024    04/12/2024
8     04/07/2024     04/20/2024    04/26/2024
9     04/21/2024     05/04/2024    05/10/2024
10    05/05/2024     05/18/2024    05/24/2024
11    05/19/2024     06/01/2024    06/07/2024
12    06/02/2024     06/15/2024    06/21/2024
13    06/16/2024     06/29/2024    07/05/2024  *July 4 holiday
14    06/30/2024     07/13/2024    07/19/2024
15    07/14/2024     07/27/2024    08/02/2024
16    07/28/2024     08/10/2024    08/16/2024
17    08/11/2024     08/24/2024    08/30/2024
18    08/25/2024     09/07/2024    09/13/2024
19    09/08/2024     09/21/2024    09/27/2024
20    09/22/2024     10/05/2024    10/11/2024
21    10/06/2024     10/19/2024    10/25/2024
22    10/20/2024     11/02/2024    11/08/2024
23    11/03/2024     11/16/2024    11/22/2024
24    11/17/2024     11/30/2024    12/06/2024
25    12/01/2024     12/14/2024    12/20/2024
26    12/15/2024     12/28/2024    01/03/2025

* 3-pay months in 2024: March, August
* Holiday adjustments noted
```

#### Holiday Pay Schedule

```
COMPANY HOLIDAYS & PAY IMPACT

PAID HOLIDAYS (Company Observed)
- New Year's Day
- Martin Luther King Jr. Day
- Presidents' Day
- Memorial Day
- Independence Day
- Labor Day
- Thanksgiving Day
- Day after Thanksgiving
- Christmas Eve
- Christmas Day

HOLIDAY PAY RULES
- Full-time employees: 8 hours regular pay
- Part-time employees: Pro-rated by FTE
- Holiday falls on weekend: Observed day adjusted
- Holiday during PTO: Holiday pay applies

WORKING ON HOLIDAYS
- Approval required in advance
- Premium pay: 1.5x regular rate
- Or compensatory time off
- Manager discretion based on role
```

### 6. Contractor Payments

#### Contractor vs Employee Classification

```
CLASSIFICATION FACTORS (IRS Guidelines)

BEHAVIORAL CONTROL
Employee indicators:
- Company controls how work is done
- Set hours and schedule
- Required training
- Company provides tools/equipment

Contractor indicators:
- Controls own methods
- Sets own schedule
- Has own tools
- Can work for others

FINANCIAL CONTROL
Employee indicators:
- Guaranteed regular wage
- Expenses reimbursed
- No investment in facilities

Contractor indicators:
- Project/fixed fee payment
- Own expenses
- Invests in own business
- Profit/loss opportunity

RELATIONSHIP TYPE
Employee indicators:
- Benefits provided
- Ongoing relationship
- Work is key business activity

Contractor indicators:
- Contract for specific project
- No benefits
- Terminable per contract
```

#### 1099 Payment Processing

```
CONTRACTOR PAYMENT PROCESS

ONBOARDING
1. Verify classification appropriately
2. Collect W-9 form
3. Verify TIN (IRS TIN matching)
4. Set up in AP/payment system
5. Establish payment terms

PAYMENT PROCESSING
1. Receive invoice with required details
2. Verify work completed/deliverables
3. Approve per authorization matrix
4. Process payment (net terms)
5. Track for 1099 reporting

INVOICE REQUIREMENTS
- Contractor name/business name
- TIN (or SSN)
- Invoice number
- Service description
- Amount
- Payment terms

1099-NEC REPORTING
- Report payments $600+ per calendar year
- Issue by January 31 to contractor
- File with IRS by January 31
- E-file required if 10+ forms
```

#### Contractor Payment Calendar

```
CONTRACTOR PAYMENT SCHEDULE

INVOICE CUTOFF
- Invoices due by 25th of month
- Or 5 days before payment run

PAYMENT RUNS
- Weekly: Every Friday
- Or Bi-weekly aligned with payroll
- Net 30 standard (can vary by contract)

YEAR-END PROCESSING
December 15: Final invoice reminder
December 31: Calendar year cutoff
January 15: Prepare 1099 data
January 31: 1099s issued and filed

DOCUMENTATION RETENTION
- W-9 forms: 4 years after last payment
- Invoices: 7 years
- Payment records: 7 years
- Contracts: 7 years after termination
```

## Tools & Templates

### New Employee Payroll Setup

```
NEW HIRE PAYROLL CHECKLIST

DOCUMENTATION REQUIRED
[ ] Completed I-9 (within 3 days of start)
[ ] Completed W-4 (federal withholding)
[ ] State W-4 (if applicable)
[ ] Direct deposit authorization
[ ] Benefits enrollment forms
[ ] Emergency contact information

SYSTEM SETUP
[ ] Create employee record
[ ] Enter personal information
[ ] Set pay rate and frequency
[ ] Configure tax withholdings
[ ] Set up direct deposit
[ ] Enroll in benefits (deductions)
[ ] Assign cost center/department
[ ] Configure time tracking access

FIRST PAYROLL VERIFICATION
[ ] Verify first paycheck accuracy
[ ] Confirm direct deposit received
[ ] Review deductions correct
[ ] Provide pay stub access
```

### Payroll Correction Request Form

```
PAYROLL CORRECTION REQUEST

Employee Name: _______________
Employee ID: _______________
Pay Period: _______________
Original Pay Date: _______________

TYPE OF CORRECTION
[ ] Missing hours/time
[ ] Incorrect rate
[ ] Missing bonus/commission
[ ] Incorrect deduction
[ ] Tax withholding error
[ ] Other: _______________

DETAILS
Original Amount: $_______________
Correct Amount: $_______________
Difference: $_______________

Explanation:
_________________________________
_________________________________

SUPPORTING DOCUMENTATION
[ ] Time records attached
[ ] Manager approval attached
[ ] Other: _______________

SIGNATURES
Employee: _______________ Date: ___________
Manager: _______________ Date: ___________
Payroll: _______________ Date: ___________
```

### Payroll Software Options

| Solution | Size | Price Range | Key Features |
|----------|------|-------------|--------------|
| Gusto | 1-100 | $40+$6/ee/mo | Full service, benefits |
| Paychex | 1-1000+ | Custom | Tax service, HR |
| ADP | 1-1000+ | Custom | Enterprise, global |
| QuickBooks | 1-100 | $45+$5/ee/mo | QB integration |
| Rippling | 1-1000+ | $8/ee/mo | IT + HR + Payroll |
| Paylocity | 50-5000 | Custom | Mid-market |

## Metrics & KPIs

### Payroll Accuracy Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| Payroll Accuracy Rate | Correct paychecks / Total | >99.5% |
| On-Time Payment Rate | On-time pays / Total | 100% |
| Correction Rate | Corrections / Total paychecks | <0.5% |
| Tax Filing Accuracy | Accurate filings / Total | 100% |
| Direct Deposit Adoption | DD employees / Total | >95% |

### Efficiency Metrics

- Time to process payroll
- Cost per paycheck processed
- Time entries submitted on time
- Manager approval cycle time
- Query resolution time

### Compliance Metrics

- Tax deposit timeliness
- Penalty-free quarters
- Audit findings
- Garnishment compliance rate
- I-9 completion rate

## Common Pitfalls

### Processing Errors

1. **Missing time entries**: Employees not paid for all hours
2. **Incorrect rates**: Using wrong pay rate
3. **Deduction errors**: Wrong amounts taken
4. **Tax miscalculation**: Withholding errors
5. **Direct deposit failures**: Wrong account numbers

### Compliance Failures

1. **Late tax deposits**: Penalties and interest
2. **Misclassification**: Employee vs contractor
3. **Overtime violations**: Not paying required premium
4. **Minimum wage**: Below required rates
5. **Recordkeeping**: Missing required documentation

### Process Issues

1. **Late payroll**: Missing pay dates
2. **No backup processor**: Single point of failure
3. **Manual processes**: Error-prone, slow
4. **Poor communication**: Employees confused
5. **Inadequate audit trail**: Can't trace changes

## Integration Points

### Connects to These Business Functions

- **HR**: Employee data, status changes
- **Benefits**: Enrollment, deductions
- **Finance**: GL posting, accruals
- **Time & Attendance**: Hours worked
- **Banking**: Payments, deposits
- **Tax**: Filings, compliance
- **IT**: System access, security

### System Integrations

```
PAYROLL INTEGRATION ECOSYSTEM

HRIS <---> PAYROLL <---> ACCOUNTING
              |
              +---> TIME & ATTENDANCE
              |
              +---> BENEFITS ADMIN
              |
              +---> BANKING/ACH
              |
              +---> TAX FILING SERVICE
```

### Data Flow Requirements

- Employee master data (from HRIS)
- Time and attendance data
- Benefits enrollment data
- Tax rate tables
- Bank account information
- Chart of accounts mapping

---

*This skill is part of the INT Inc. Business Solutions back-of-house operations suite.*
