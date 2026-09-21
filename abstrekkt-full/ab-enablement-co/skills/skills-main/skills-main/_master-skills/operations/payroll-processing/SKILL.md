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


## References
- `references/annual-payroll-calendar-template.md` — Annual Payroll Calendar Template
- `references/references.md` — References
- `references/tools-templates.md` — Tools & Templates
