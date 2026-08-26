---
name: government-procurement
description: Expert guidance for government contracting and procurement including RFP/RFQ response management, federal acquisition regulation (FAR) compliance, proposal development, and contract administration. Use when navigating industry-specific regulations, processes, or operations.
---

# Government Procurement Skill

> Government contracting, RFP/RFQ management, FAR compliance, and federal acquisition

## Description

This skill provides comprehensive guidance for government procurement and contracting including the federal acquisition process, RFP and RFQ response development, compliance with the Federal Acquisition Regulation (FAR) and Defense Federal Acquisition Regulation Supplement (DFARS), proposal writing and evaluation, contract types and administration, and small business program requirements. It covers federal, state, and local government contracting across civilian agencies, Department of Defense, and intelligence community procurements. The skill supports contracts managers, proposal managers, business development professionals, government contracting officers, and compliance staff in navigating the complex government procurement landscape.

## Activation Triggers

- User mentions "government contracting", "federal procurement", or "government RFP"
- User asks about FAR regulations, DFARS, or acquisition compliance
- User needs help with proposal writing, RFP response, or bid preparation
- User discusses contract types (FFP, CPFF, T&M, IDIQ, BPA)
- User asks about small business set-asides, 8(a), HUBZone, or SDVOSB programs
- User mentions SAM registration, capability statements, or market research
- User needs guidance on contract administration or modifications
- User asks about government source selection, evaluation criteria, or best value
- User discusses DCAA audit, cost accounting standards, or incurred cost submissions
- User mentions GSA Schedule, GWACs, or government-wide contract vehicles

## Instructions

### Core Workflow

1. **Opportunity Identification and Qualification**
   - Monitor government procurement forecasts and opportunity databases
   - Analyze solicitations against organizational capabilities and strategy
   - Conduct bid/no-bid decisions using structured evaluation criteria
   - Research incumbent performance, contract history, and competitive landscape
   - Develop customer engagement and capture management plans

2. **Proposal Development**
   - Analyze solicitation requirements, evaluation criteria, and instructions
   - Develop compliant proposal outline mapping to all RFP sections
   - Write technical approach demonstrating understanding and solution
   - Build pricing strategy aligned with contract type and evaluation method
   - Conduct compliance and quality reviews (Pink/Red/Gold Team)

3. **Compliance and Regulatory Management**
   - Ensure FAR/DFARS compliance across all procurement activities
   - Maintain required certifications, representations, and registrations
   - Implement cost accounting standards (CAS) and disclosure statements
   - Manage organizational conflicts of interest (OCI) evaluations
   - Track regulatory changes and update internal procedures

4. **Contract Execution and Administration**
   - Establish contract startup procedures and kickoff protocols
   - Manage contract deliverables, milestones, and performance reporting
   - Process contract modifications, change orders, and options
   - Conduct earned value management for cost-type contracts
   - Handle contract disputes, claims, and termination procedures

5. **Post-Award Management**
   - Maintain contractor performance assessment reporting (CPARS)
   - Manage subcontractor and teaming partner compliance
   - Conduct internal compliance audits and self-assessments
   - Prepare for and support DCAA audits and reviews
   - Develop past performance narratives for future proposals

### Federal Acquisition Framework

```yaml
federal_acquisition:
  procurement_process:
    pre_solicitation:
      market_research:
        - Sources sought notices (RFI)
        - Industry days and pre-solicitation conferences
        - SAM.gov opportunity searches
        - Federal procurement forecasts
        - Incumbent contract research (FPDS)
      acquisition_planning:
        - Requirements definition
        - Acquisition strategy determination
        - Contract type selection
        - Source selection methodology
        - Small business consideration

    solicitation_phase:
      solicitation_types:
        rfp: "Request for Proposal - negotiated procurement"
        rfq: "Request for Quotation - simplified acquisition"
        ifb: "Invitation for Bid - sealed bidding"
        baa: "Broad Agency Announcement - research"
        rfi: "Request for Information - market research"
      key_sections:
        section_b: "Supplies or services and prices/costs"
        section_c: "Description/specifications/statement of work"
        section_i: "Contract clauses"
        section_l: "Instructions to offerors"
        section_m: "Evaluation factors"

    evaluation_and_award:
      source_selection_methods:
        lowest_price_technically_acceptable: "Meet minimum standards, lowest price wins"
        best_value_tradeoff: "Balance of technical merit, past performance, and price"
        highest_technically_rated: "Technical excellence, price secondary"
      evaluation_factors:
        - Technical approach and understanding
        - Management approach and key personnel
        - Past performance and experience
        - Price/cost realism and reasonableness
        - Small business participation
      award_process:
        - Competitive range determination
        - Discussions and negotiations (if applicable)
        - Final proposal revisions
        - Source selection decision
        - Award notification and debriefings

  contract_types:
    fixed_price:
      ffp: "Firm Fixed Price - contractor bears full cost risk"
      fpif: "Fixed Price Incentive Firm - shared savings/overruns"
      fpepa: "Fixed Price with Economic Price Adjustment"
    cost_reimbursement:
      cpff: "Cost Plus Fixed Fee - government bears cost risk"
      cpif: "Cost Plus Incentive Fee - shared savings"
      cpaf: "Cost Plus Award Fee - subjective performance evaluation"
    other:
      tm: "Time and Materials - labor rates plus materials at cost"
      lh: "Labor Hour - labor rates only, no materials"
      idiq: "Indefinite Delivery/Indefinite Quantity - task order based"
      bpa: "Blanket Purchase Agreement - simplified ordering"

  far_key_parts:
    part_6: "Competition requirements"
    part_12: "Acquisition of commercial products/services"
    part_15: "Contracting by negotiation"
    part_16: "Types of contracts"
    part_19: "Small business programs"
    part_31: "Contract cost principles"
    part_42: "Contract administration"
    part_49: "Termination of contracts"
    part_52: "Solicitation provisions and contract clauses"

  small_business_programs:
    set_aside_types:
      small_business: "Total or partial set-aside for small business"
      eight_a: "8(a) Business Development Program (SBA)"
      hubzone: "Historically Underutilized Business Zones"
      sdvosb: "Service-Disabled Veteran-Owned Small Business"
      wosb: "Women-Owned Small Business"
    size_standards: "NAICS code-specific revenue or employee thresholds per SBA table"
    subcontracting_plans: "Required > $750K ($1.5M construction); goals for SB, SDB, WOSB, HUBZone, SDVOSB"
```

### Proposal Development Framework

```yaml
proposal_development:
  capture_management:
    phases:
      identify: "Discover and qualify opportunity"
      qualify: "Bid/no-bid decision and resource commitment"
      capture: "Shape requirements and build relationships"
      propose: "Develop and submit winning proposal"
      post_submit: "Discussions, negotiations, debriefings"
    bid_decision_criteria:
      - Strategic alignment with organizational goals
      - Competitive positioning and win probability
      - Resource availability and capability fit
      - Contract value and profitability potential
      - Customer relationship and incumbent advantage
      - Risk assessment (technical, financial, schedule)

  proposal_structure:
    volume_1_technical:
      sections:
        - Executive summary and technical approach
        - Management approach and key personnel
        - Quality assurance and transition plan
    volume_2_past_performance:
      sections:
        - Relevant contract summaries and narratives
        - Customer references and performance ratings
    volume_3_cost_price:
      sections:
        - Cost summary and basis of estimate
        - Labor rates, ODCs, and subcontractor pricing
        - Indirect rate structure and forward pricing

  review_process:
    color_team_reviews:
      blue_team: "Pre-RFP - solution development and strategy"
      pink_team: "50% draft - compliance and responsiveness"
      red_team: "90% draft - full evaluation simulation"
      gold_team: "Final - executive review and quality check"

  pricing_strategies:
    approaches:
      competitive: "Price to win based on competitive intelligence"
      value_based: "Emphasize ROI and cost savings to government"
      investment: "Accept lower margins for strategic position"
```

### Templates

#### Bid/No-Bid Decision Matrix
```markdown
# Bid/No-Bid Decision: [Solicitation Number]

## Opportunity Summary
- Agency: [Agency Name]
- Title: [Requirement Title]
- NAICS: [Code] | Set-Aside: [Type or Full & Open]
- Estimated Value: $[Amount] | Period: [Base + Options]
- Proposal Due: [Date]

## Evaluation Criteria (Score 1-5)
| Factor | Weight | Score | Weighted |
|--------|--------|-------|----------|
| Strategic Fit | 15% | [1-5] | [Score] |
| Technical Capability | 20% | [1-5] | [Score] |
| Past Performance Relevance | 15% | [1-5] | [Score] |
| Competitive Position | 15% | [1-5] | [Score] |
| Win Probability | 15% | [1-5] | [Score] |
| Profitability Potential | 10% | [1-5] | [Score] |
| Resource Availability | 10% | [1-5] | [Score] |
| **Total Weighted Score** | **100%** | | **[Total]** |

## Decision Thresholds
- Score >= 4.0: Strong Bid
- Score 3.0-3.9: Bid with caveats
- Score < 3.0: No Bid

## Decision: [BID / NO BID]
## Rationale: [Key factors driving decision]
## Approved By: [Name/Date]
```

#### Proposal Compliance Matrix
```markdown
# Proposal Compliance Matrix: [Solicitation Number]

## Section L Requirements (Instructions)
| Req # | Requirement | Volume | Section | Page Limit | Compliant |
|-------|------------|--------|---------|------------|-----------|
| L.1 | [Requirement text] | [Vol] | [Section] | [Pages] | [Y/N] |
| L.2 | [Requirement text] | [Vol] | [Section] | [Pages] | [Y/N] |

## Section M Requirements (Evaluation Factors)
| Factor | Subfactor | Proposal Section | Addressed | Strength |
|--------|-----------|-----------------|-----------|----------|
| [Factor 1] | [Subfactor] | [Section ref] | [Y/N] | [Discriminator noted] |
| [Factor 2] | [Subfactor] | [Section ref] | [Y/N] | [Discriminator noted] |

## Compliance Status: [Fully Compliant / Gaps Identified]
## Open Items: [List any unresolved compliance gaps]
```

#### Contract Modification Request
```markdown
# Contract Modification Request

## Contract: [Number] | Task Order: [Number]
## Contractor: [Company] | CO: [Name]
## Type: [Admin/Scope/Option/Funding/PoP Extension/Key Personnel]

## Description and Justification
[Description of change and why it is necessary]

## Cost Impact
| Element | Current | Modified | Delta |
|---------|---------|----------|-------|
| Total | $[Amount] | $[Amount] | $[+/-] |

## Schedule Impact
- Current PoP End: [Date] | Requested: [Date]

## Approvals
| Role | Name | Date |
|------|------|------|
| Program Manager | [Name] | [Date] |
| Contracting Officer | [Name] | [Date] |
```

### Best Practices

- Read the solicitation three times before beginning proposal work: once for understanding, once for requirements, once for evaluation criteria
- Build the compliance matrix first and organize the entire proposal response around it
- Write to the evaluation criteria explicitly; evaluators score what they can find, not what they must infer
- Maintain a library of past performance references and keep contact information current
- Register and maintain SAM.gov profile, CAGE code, and all required certifications proactively
- Develop and rehearse oral presentations if source selection includes oral evaluation
- Never assume the evaluator knows your company; spell out qualifications and relevance explicitly
- Price to win by analyzing competitive intelligence, historical award data, and FPDS pricing patterns
- Conduct formal color team reviews at each milestone; skip reviews at your own peril
- Prepare for DCAA audits by maintaining clean timekeeping, cost accounting, and purchasing systems
- Maintain an active pipeline of opportunities 12-24 months out for sustained growth
- Build relationships with agency program offices through industry days, not just at proposal time

### Common Patterns

#### Pattern: RFP Response Process
```
1. Receive solicitation and conduct initial review within 24 hours
2. Build compliance matrix mapping all L, M, and C requirements
3. Conduct solution session to develop technical approach and win themes
4. Assign writing responsibilities by section with page budgets
5. Execute Blue Team review of solution concept (pre-writing)
6. Write first draft and conduct Pink Team compliance review
7. Revise and conduct Red Team simulated evaluation
8. Finalize, conduct Gold Team executive review
9. Perform final compliance and formatting check
10. Submit proposal per solicitation instructions (electronic/hardcopy)
```

#### Pattern: Protest Decision and Execution
```
1. Receive unfavorable award decision or identify solicitation deficiency
2. Request and attend debriefing (within 3 days of notification)
3. Analyze debriefing information against evaluation criteria
4. Consult legal counsel on protest grounds and likelihood of success
5. If protesting, file with GAO within 10 days of debriefing (or 10 days of award)
6. Prepare protest argument citing specific FAR violations or evaluation errors
7. Participate in ADR if offered by GAO
8. If sustained, negotiate corrective action with contracting agency
```

#### Pattern: Contract Closeout
```
1. Verify all deliverables accepted and performance requirements met
2. Submit final invoice and reconcile all payments
3. Complete property disposition for government-furnished equipment
4. Submit final incurred cost submission (cost-type contracts)
5. Resolve all open subcontractor and vendor invoices
6. Prepare and submit CPARS narrative for contracting officer review
7. Obtain final release of claims and contract closeout letter
8. Archive all contract records per retention requirements
```

### Output Formats

#### Government Contract Portfolio Dashboard
```markdown
# Government Contract Portfolio: [Company Name]

## Portfolio Summary
| Metric | Value |
|--------|-------|
| Active Contracts | [Count] |
| Total Backlog Value | $[Amount] |
| Current Year Revenue | $[Amount] |
| Funded vs. Ceiling | [%] funded |
| Contracts Expiring (12 months) | [Count] |

## Contract Status
| Contract | Agency | Type | Ceiling | Funded | PoP End | Status |
|----------|--------|------|---------|--------|---------|--------|
| [Number] | [Agency] | [FFP/CPFF/T&M] | $[Amount] | $[Amount] | [Date] | [Active/Option] |

## Pipeline Status
| Opportunity | Agency | Est. Value | Proposal Due | PWin | Status |
|-------------|--------|------------|-------------|------|--------|
| [Name] | [Agency] | $[Amount] | [Date] | [%] | [Capture/Propose/Submitted] |

## Performance Ratings (CPARS)
| Contract | Period | Quality | Schedule | Cost | Management | Overall |
|----------|--------|---------|----------|------|------------|---------|
| [Number] | [Year] | [E/VG/S/M/U] | [E/VG/S/M/U] | [E/VG/S/M/U] | [E/VG/S/M/U] | [Rating] |

## Compliance Status
| Area | Status | Last Audit | Next Due |
|------|--------|------------|----------|
| Timekeeping | [Compliant/Finding] | [Date] | [Date] |
| Cost Accounting (CAS) | [Compliant/Finding] | [Date] | [Date] |
| Purchasing System | [Compliant/Finding] | [Date] | [Date] |
| Property Management | [Compliant/Finding] | [Date] | [Date] |
```

#### Proposal Status Tracker
```markdown
# Proposal Pipeline Status: [Period]

## Active Proposals
| Solicitation | Agency | Due Date | Value | Status | Lead |
|-------------|--------|----------|-------|--------|------|
| [Number] | [Agency] | [Date] | $[Amount] | [Writing/Review/Final] | [Name] |

## Win/Loss Record (YTD)
| Metric | Count | Value |
|--------|-------|-------|
| Submitted | [Count] | $[Amount] |
| Won | [Count] | $[Amount] |
| Lost | [Count] | $[Amount] |
| Win Rate | [%] | N/A |
```

## Version History

- 1.0.0: Initial government procurement skill
