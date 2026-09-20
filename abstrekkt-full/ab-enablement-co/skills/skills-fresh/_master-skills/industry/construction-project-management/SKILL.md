---
name: construction-project-management
description: Comprehensive guidance for construction project management including scheduling, cost estimation, contract administration, building information modeling, site operations, safety compliance, subcontractor coordination, and project closeout for commercial, residential, and infrastructure projects. Use when navigating industry-specific regulations, processes, or operations.
---

# Construction Project Management Skill

> Project scheduling, cost control, contract administration, BIM coordination, and site operations

## Description

This skill provides comprehensive guidance for construction project management across commercial, residential, industrial, and infrastructure sectors. It covers project planning and scheduling, cost estimation and budgeting, contract administration, building information modeling (BIM) coordination, site operations management, safety and regulatory compliance, subcontractor management, quality assurance, and project closeout. The skill supports project managers, construction managers, superintendents, estimators, and owners' representatives in delivering projects on time, on budget, and to specification.

## Activation Triggers

- User mentions "construction project", "construction management", "general contractor"
- User asks about project scheduling or CPM (critical path method)
- User needs help with cost estimation or construction budgeting
- User discusses contract types or construction contracts
- User asks about BIM coordination or clash detection
- User mentions RFIs, submittals, or change orders
- User needs construction safety or OSHA compliance guidance
- User asks about subcontractor management or bid evaluation
- User discusses project closeout or punch list procedures
- User mentions earned value management in construction

## Instructions

### Core Workflow

1. **Pre-Construction Planning**
   - Review contract documents and specifications
   - Develop work breakdown structure (WBS)
   - Create detailed project schedule (CPM)
   - Prepare construction cost estimate and budget
   - Establish project management information system (PMIS)

2. **Procurement and Mobilization**
   - Issue subcontractor bid packages and evaluate proposals
   - Award subcontracts and purchase orders
   - Process submittals and shop drawing approvals
   - Mobilize site and establish temporary facilities
   - Conduct pre-construction meetings with stakeholders

3. **Construction Execution**
   - Manage daily field operations and coordination
   - Conduct BIM coordination and resolve clashes
   - Track schedule progress and update CPM
   - Process RFIs, change orders, and pay applications
   - Monitor quality, safety, and environmental compliance

4. **Monitoring and Control**
   - Perform earned value analysis (EVM)
   - Track cost against budget at WBS level
   - Manage contingency and allowance drawdowns
   - Monitor subcontractor performance and compliance
   - Generate monthly project status reports

5. **Project Closeout**
   - Conduct substantial completion inspection
   - Manage punch list resolution
   - Collect and organize closeout documents
   - Process final pay applications and retainage release
   - Conduct lessons learned and archive project records

### Project Scheduling Framework

```yaml
scheduling:
  critical_path_method:
    elements:
      activities: "Individual work tasks with duration"
      dependencies: "Finish-to-Start, Start-to-Start, Finish-to-Finish, Start-to-Finish"
      constraints: "Must start on, must finish by, as late as possible"
      milestones: "Zero-duration markers for key events"
      float: "Total float, free float, negative float"

    schedule_development:
      steps:
        - Define activities from WBS
        - Estimate durations (crew productivity-based)
        - Establish logic relationships and constraints
        - Assign resources (labor, equipment, material)
        - Calculate critical path and float
        - Level resources to eliminate over-allocation
        - Set baseline schedule

    schedule_types:
      master_schedule: "Summary level, full project duration"
      phase_schedule: "Detailed by construction phase"
      three_week_lookahead: "Rolling short-interval schedule"
      pull_plan: "Last Planner System collaborative schedule"

  last_planner_system:
    components:
      master_scheduling: "Milestone-level team planning"
      phase_planning: "Pull planning by trade partners"
      lookahead_planning: "6-week constraint identification"
      weekly_work_planning: "Reliable promises for the week"
      daily_huddles: "Field coordination meetings"

    metrics:
      ppc: "Percent Plan Complete (target >80%)"
      reasons_for_variance: "Categorized root causes"
      tasks_made_ready: "Constraints removed in lookahead"

  schedule_analysis:
    delay_analysis_methods:
      as_planned_vs_as_built: "Compare original plan to actual"
      impacted_as_planned: "Insert delay into baseline"
      collapsed_as_built: "Remove delay from as-built"
      time_impact_analysis: "Contemporaneous prospective analysis"
      windows_analysis: "Period-by-period evaluation"

    claims_support:
      - Critical path identification at time of delay
      - Concurrent delay evaluation
      - Float ownership determination
      - Pacing delay assessment
      - Acceleration analysis
```

### Cost Management Framework

```yaml
cost_management:
  estimation:
    types:
      conceptual: "Order of magnitude (+/- 30-50%), per SF or unit"
      schematic: "Assembly-level (+/- 15-25%)"
      design_development: "Detailed quantity takeoff (+/- 10-15%)"
      construction_documents: "Bid-level estimate (+/- 5-10%)"
      gmp_budget: "Guaranteed Maximum Price with contingency"

    cost_components:
      direct_costs:
        labor:
          - Base wage rates by trade
          - Fringe benefits and burden
          - Labor productivity factors
          - Overtime premium
          - Crew composition
        material:
          - Quantity takeoff from drawings
          - Material unit prices
          - Waste factors (5-15% typical)
          - Delivery and handling
          - Sales tax applicability
        equipment:
          - Owned equipment rates (FHWA Blue Book)
          - Rental rates (market pricing)
          - Mobilization and demobilization
          - Operator labor (if separate)
          - Fuel and maintenance

      indirect_costs:
        general_conditions:
          - Project staff salaries
          - Field office and temporary facilities
          - Temporary utilities and services
          - Insurance and bonds
          - Permits and fees
          - Project duration-dependent items

        overhead_and_profit:
          - Home office overhead (8-15%)
          - Profit margin (3-10%)
          - Contingency (3-10%)

  budget_tracking:
    cost_codes:
      structure: "CSI MasterFormat divisions"
      divisions:
        div_03: "Concrete"
        div_04: "Masonry"
        div_05: "Metals"
        div_06: "Wood, Plastics, Composites"
        div_07: "Thermal and Moisture Protection"
        div_08: "Openings"
        div_09: "Finishes"
        div_22: "Plumbing"
        div_23: "HVAC"
        div_26: "Electrical"

    earned_value:
      metrics:
        bcws: "Budgeted Cost of Work Scheduled (PV)"
        bcwp: "Budgeted Cost of Work Performed (EV)"
        acwp: "Actual Cost of Work Performed (AC)"
        spi: "Schedule Performance Index (EV/PV)"
        cpi: "Cost Performance Index (EV/AC)"
        eac: "Estimate at Completion"
        etc: "Estimate to Complete"
        vac: "Variance at Completion"

      interpretation:
        spi_above_1: "Ahead of schedule"
        spi_below_1: "Behind schedule"
        cpi_above_1: "Under budget"
        cpi_below_1: "Over budget"

  change_management:
    change_order_process:
      - Identify scope change or changed condition
      - Issue or respond to RFI (if design clarification needed)
      - Prepare change order request with cost and time impact
      - Negotiate terms (lump sum, T&M, unit price)
      - Execute change order document
      - Update budget and schedule baseline

    pricing_methods:
      lump_sum: "Fixed price for defined scope"
      time_and_material: "Actual costs plus markup (10-15%)"
      unit_price: "Agreed rate per measured quantity"
      force_account: "Cost of work plus markup"

    markup_standards:
      subcontractor_work: "10-15% overhead and profit"
      self_performed_work: "15-20% overhead and profit"
      sub_to_sub: "10% markup"
      bond_premium: "1-3% on increased contract value"
```

### Contract Administration

```yaml
contract_administration:
  contract_types:
    lump_sum: "Fixed price, risk on contractor"
    gmp: "Guaranteed Maximum Price with shared savings"
    cost_plus_fee: "Reimbursable cost plus fixed or percentage fee"
    unit_price: "Payment per measured unit of work"
    design_build: "Single entity for design and construction"
    cmar: "Construction Manager at Risk"
    ipd: "Integrated Project Delivery"

  document_management:
    rfis:
      process:
        - Identify question or discrepancy in contract documents
        - Draft clear, specific RFI with references to drawings/specs
        - Submit through PMIS (Procore, PlanGrid, BIM 360)
        - Track response timeline (7-14 day contractual period typical)
        - Distribute response to affected parties
        - Assess cost and schedule impact of direction

    submittals:
      types:
        - Shop drawings
        - Product data sheets
        - Material samples
        - Mock-ups
        - Test reports
        - Certificates
        - O&M manuals

      review_workflow:
        - Contractor review and stamp
        - Submit to architect/engineer
        - A/E review (10-14 business days typical)
        - Return with action (Approved, Approved as Noted,
          Revise and Resubmit, Rejected)
        - Distribute approved submittals to field

    pay_applications:
      process:
        - Subcontractor submits schedule of values progress
        - PM verifies quantities and percent complete
        - Compile owner pay application (AIA G702/G703)
        - Submit with lien waivers and certified payroll
        - Owner review and approval
        - Payment within contractual terms (30 days typical)
        - Retainage held (5-10%) until substantial completion
```

### Templates

#### Monthly Project Status Report Template
```markdown
# Monthly Project Status Report

## Project: [Project Name]
## Report Period: [Month/Year]
## Report Number: [#]

## Executive Summary
[2-3 sentence project status overview]

## Schedule Status
| Milestone | Baseline Date | Forecast Date | Variance | Status |
|-----------|---------------|---------------|----------|--------|
| [Milestone] | [Date] | [Date] | [+/- days] | [G/Y/R] |

- Critical Path: [Current critical path activities]
- Schedule Status: [Ahead / On Track / Behind by X days]
- Percent Complete: [%] (Planned: [%])

## Cost Status
| Category | Budget | Committed | Spent to Date | Forecast | Variance |
|----------|--------|-----------|---------------|----------|----------|
| [Division] | [$] | [$] | [$] | [$] | [$] |
| Contingency | [$] | - | [$] Used | [$] Remaining | [$] |
| **Total** | **[$]** | **[$]** | **[$]** | **[$]** | **[$]** |

## Change Order Log
| CO# | Description | Amount | Time Impact | Status |
|-----|-------------|--------|-------------|--------|
| [#] | [Description] | [$] | [Days] | [Pending/Approved] |

## Open RFIs
| RFI# | Subject | Date Sent | Days Open | Status |
|------|---------|-----------|-----------|--------|
| [#] | [Subject] | [Date] | [Days] | [Open/Responded] |

## Safety
- Hours Worked This Period: [Hours]
- Recordable Incidents: [Count]
- Near Misses Reported: [Count]
- TRIR (Rolling 12-Month): [Rate]

## Key Risks and Issues
| Risk/Issue | Impact | Probability | Mitigation | Owner |
|------------|--------|-------------|------------|-------|
| [Risk] | [H/M/L] | [H/M/L] | [Action] | [Name] |

## Photos
[4-6 progress photos with captions]
```

#### Subcontractor Bid Evaluation Template
```markdown
# Bid Evaluation: [Trade/Scope Package]

## Bid Summary
| Bidder | Base Bid | Alt 1 | Alt 2 | Adjusted Total |
|--------|----------|-------|-------|----------------|
| [Bidder A] | [$] | [$] | [$] | [$] |
| [Bidder B] | [$] | [$] | [$] | [$] |
| [Bidder C] | [$] | [$] | [$] | [$] |
| Budget Estimate | [$] | [$] | [$] | [$] |

## Qualification Assessment
| Criteria | Weight | Bidder A | Bidder B | Bidder C |
|----------|--------|---------|---------|---------|
| Price | 40% | [Score] | [Score] | [Score] |
| Experience | 20% | [Score] | [Score] | [Score] |
| Capacity | 15% | [Score] | [Score] | [Score] |
| Safety Record | 15% | [Score] | [Score] | [Score] |
| References | 10% | [Score] | [Score] | [Score] |
| **Weighted Total** | **100%** | **[Score]** | **[Score]** | **[Score]** |

## Scope Gaps / Exclusions
| Item | Bidder A | Bidder B | Bidder C |
|------|---------|---------|---------|
| [Scope Item] | [Included/Excluded] | [Included/Excluded] | [Included/Excluded] |

## Recommendation
- Recommended Bidder: [Name]
- Award Amount: [$]
- Rationale: [Reasoning]
```

### Best Practices

1. **Baseline Early**: Establish schedule and cost baselines within 30 days of notice to proceed
2. **Three-Week Lookahead**: Maintain a rolling three-week lookahead schedule updated weekly
3. **Daily Logs**: Document weather, manpower, equipment, activities, and visitors daily without exception
4. **Proactive RFI Management**: Submit RFIs early and track response times to prevent delays
5. **Cost Forecasting**: Update cost-to-complete estimates monthly, not just cost-to-date tracking
6. **Submittal Lead Times**: Build procurement lead times into the CPM schedule as separate activities
7. **Photographic Documentation**: Capture progress photos weekly at consistent locations
8. **Retainage Management**: Track retainage per subcontractor and release promptly at substantial completion
9. **Change Order Discipline**: Never direct work without an executed change order or construction change directive
10. **Commissioning Integration**: Begin commissioning planning during design, not during construction
11. **Closeout from Day One**: Collect closeout documents progressively throughout construction
12. **BIM for Coordination**: Use federated BIM models for MEP clash detection before installation begins
13. **Contingency Tracking**: Log every contingency draw with justification and maintain a running balance

### Common Patterns

#### Pattern 1: Schedule Recovery Plan
```
Scenario: 120-unit multifamily project is 3 weeks behind schedule
at framing completion due to weather delays and lumber shortages.

Recovery approach:
1. Run time impact analysis to document excusable delay (14 weather days)
2. Identify remaining critical path: framing -> rough MEP -> insulation
   -> drywall -> finishes -> unit turnover
3. Accelerate framing: add second crew to achieve 4 units/week vs. 3
4. Overlap rough-in trades: plumbing starts 5 units behind framing
   instead of waiting for full building completion
5. Pre-fabricate MEP assemblies off-site for faster installation
6. Submit time extension request for 14 days (excusable, non-compensable)
7. Self-fund acceleration of remaining 7 days (avoid liquidated damages)
8. Revised schedule shows recovery to within 5 days by drywall start
9. Weekly pull planning sessions with framing and MEP subs to maintain pace
```

#### Pattern 2: GMP Budget Reconciliation
```
Scenario: $45M commercial office GMP, construction 60% complete,
owner requests cost status update for lender draw.

Process:
1. Update schedule of values: 58% complete per earned value
2. Committed costs: $38.2M (subcontracts + POs), 84.9% of GMP
3. Cost to date: $24.8M paid, $2.1M in retainage held
4. Approved change orders: $1.2M (net increase, funded from contingency)
5. Pending change orders: $340K (3 items under negotiation)
6. Original contingency: $2.25M (5% of GMP)
7. Contingency used: $1.54M (COs + scope gaps + unforeseen conditions)
8. Contingency remaining: $710K (1.6% of GMP) - adequate for remaining risk
9. Forecast at completion: $44.6M ($400K under GMP)
10. Shared savings projection: $200K to owner, $200K to CM per contract
```

### Output Formats

#### Project Dashboard
```markdown
# Project Dashboard: [Project Name] - [Date]

## Key Performance Indicators
| KPI | Value | Target | Status |
|-----|-------|--------|--------|
| Schedule (SPI) | [Value] | 1.00 | [G/Y/R] |
| Cost (CPI) | [Value] | 1.00 | [G/Y/R] |
| Percent Complete | [%] | [%] | [G/Y/R] |
| Safety (TRIR) | [Rate] | [Target] | [G/Y/R] |
| Quality (Rework %) | [%] | <2% | [G/Y/R] |
| RFI Response (Avg Days) | [Days] | <10 | [G/Y/R] |
| Submittal Turnaround | [Days] | <14 | [G/Y/R] |
| Change Orders (% of Contract) | [%] | <5% | [G/Y/R] |
```

## Integration Points

- Project management software (Procore, Autodesk Build, PlanGrid)
- Scheduling tools (Primavera P6, Microsoft Project, Asta Powerproject)
- Estimating software (RSMeans, Sage Estimating, HCSS HeavyBid)
- BIM platforms (Revit, Navisworks, Solibri, BIM 360)
- Accounting systems (Sage 300 CRE, Viewpoint Vista, CMiC)
- Document management (PlanGrid, Bluebeam Revu, Aconex)
- Field reporting (Raken, Fieldwire, StructionSite)
- Safety platforms (iAuditor, Safety Culture, SiteDocs)
- Drone and reality capture (DroneDeploy, OpenSpace, Matterport)

## Version History

- 1.0.0: Initial construction project management skill
- 1.0.1: Added Last Planner System and lean construction methods
- 1.0.2: Enhanced earned value and cost forecasting guidance
