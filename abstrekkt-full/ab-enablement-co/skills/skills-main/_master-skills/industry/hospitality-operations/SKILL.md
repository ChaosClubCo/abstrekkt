---
name: hospitality-operations
description: Optimize hotel and restaurant operations including revenue management, guest experience programs, service standards, food and beverage controls, and workforce scheduling. Analyze occupancy, ADR, RevPAR, and operational efficiency across hospitality properties. Use when navigating industry-specific regulations, processes, or operations.
---

# Hospitality Operations Skill

> Revenue management, guest experience optimization, and operational excellence for hotels, restaurants, and hospitality venues

## Description

This skill provides comprehensive guidance for hospitality operations spanning hotel management, restaurant operations, revenue optimization, guest experience design, and service standards implementation. It covers front office operations, housekeeping management, food and beverage controls, revenue management strategies, workforce planning, and quality assurance programs. The skill supports general managers, revenue managers, F&B directors, operations managers, and hospitality consultants in driving profitability through optimized pricing, efficient operations, exceptional guest experiences, and disciplined cost management across full-service, select-service, and independent hospitality properties.

## Activation Triggers

- User mentions "hotel operations", "hospitality management", or "lodging operations"
- User asks about revenue management, yield management, or dynamic pricing for hotels
- User discusses occupancy rates, ADR, RevPAR, or hotel performance metrics
- User needs help with guest experience, service recovery, or satisfaction programs
- User asks about restaurant operations, food cost control, or menu engineering
- User mentions housekeeping management, room turnover, or property maintenance
- User discusses front desk operations, reservations, or channel management
- User asks about banquet and event operations or conference services
- User needs workforce scheduling, labor cost optimization, or staffing models
- User mentions brand standards, quality audits, or star rating requirements

## Instructions

### Core Workflow

1. **Property Performance Assessment**
   - Analyze trailing 12-month financial performance against budget and competitive set (comp set)
   - Review STR (Smith Travel Research) reports for RevPAR index, occupancy, and ADR positioning
   - Assess guest satisfaction scores across review platforms and internal surveys
   - Evaluate departmental profitability for rooms, F&B, spa, and ancillary revenue centers
   - Identify operational gaps through property walk-throughs and mystery shop results

2. **Revenue Strategy Development**
   - Segment demand by purpose (transient business, transient leisure, group, contract)
   - Build demand calendars identifying need periods, peak periods, and shoulder dates
   - Set pricing strategy by segment and channel with rate fences and restrictions
   - Optimize channel mix balancing direct bookings, OTA, GDS, and wholesale distribution
   - Implement length-of-stay controls, overbooking strategies, and displacement analysis

3. **Operational Standards Implementation**
   - Define standard operating procedures for all guest-facing and back-of-house operations
   - Establish quality checkpoints with measurable standards for each department
   - Implement pre-shift briefings, daily standup meetings, and shift handover protocols
   - Deploy preventive maintenance programs for guest rooms and public areas
   - Create training curricula for each position with certification and re-certification cadence

4. **Guest Experience Management**
   - Map the guest journey from pre-arrival through post-departure touchpoints
   - Implement guest recognition programs leveraging CRM and loyalty data
   - Design service recovery protocols with empowerment guidelines and compensation authority
   - Monitor real-time guest feedback through in-stay surveys and social media monitoring
   - Analyze guest complaint patterns to identify systemic operational improvements

5. **Financial Control and Optimization**
   - Manage labor cost through demand-based scheduling aligned with forecasted occupancy
   - Control food and beverage costs through recipe costing, inventory management, and waste tracking
   - Implement energy management programs targeting utility cost reduction
   - Negotiate vendor contracts with annual competitive bidding for major expense categories
   - Report weekly on departmental P&L performance with variance explanations and corrective actions

### Revenue Management Framework

```yaml
revenue_management:
  key_metrics:
    occupancy_rate:
      formula: "Rooms Sold / Rooms Available"
      benchmark: "Varies by market, typically 65-80% for full-service hotels"

    average_daily_rate:
      formula: "Room Revenue / Rooms Sold"
      interpretation: "Measures pricing power and rate strategy effectiveness"

    revpar:
      formula: "Room Revenue / Rooms Available (or Occupancy x ADR)"
      significance: "Primary hotel performance metric combining occupancy and rate"

    goppar:
      formula: "Gross Operating Profit / Available Room"
      significance: "Measures total profitability per available room including all revenue"

    trevpar:
      formula: "Total Revenue / Available Room"
      significance: "Captures non-room revenue contribution (F&B, spa, parking)"

    revpar_index:
      formula: "(Hotel RevPAR / Comp Set RevPAR) x 100"
      interpretation:
        above_100: "Outperforming competitive set"
        at_100: "Performing in line with market"
        below_100: "Underperforming competitive set, share loss"

  pricing_strategies:
    demand_based_pricing:
      high_demand: "Close lower rate tiers, raise BAR, apply minimum stay"
      moderate_demand: "Maintain mid-range rates, selective restrictions"
      low_demand: "Open all rate levels, offer packages, waive restrictions"

    rate_fences:
      physical: "Room type, floor level, view, amenity inclusion"
      non_physical: "Advance purchase, cancellation policy, length of stay, loyalty tier"

    channel_management:
      direct:
        website: "Best rate guarantee, loyalty benefits, lowest cost (5-8% commission equivalent)"
        voice: "Upsell opportunity, highest conversion, moderate cost"
      indirect:
        ota: "High visibility, 15-25% commission, incremental demand"
        gds: "Corporate travel, 10-15% commission, higher ADR"
        wholesale: "Tour operators, 20-30% discount, advance commitment"
        metasearch: "Google Hotels, TripAdvisor, cost-per-click model"

    overbooking:
      methodology: "Statistical model based on historical no-show and cancellation rates"
      factors:
        - Day of week no-show percentage
        - Cancellation rates by booking window
        - Group wash factor (actual vs. contracted room nights)
        - Guaranteed vs. non-guaranteed reservations
      walk_procedures:
        - Relocate guest to comparable or better hotel
        - Provide complimentary transportation
        - Cover one night's room charge at walk hotel
        - Offer future stay credit or loyalty points
        - Document incident for pattern analysis

  forecasting:
    inputs:
      - Historical occupancy by day of week and season
      - Reservation pace (on-the-books vs. same-time-last-year)
      - Group blocks and pickup rates
      - Local events, holidays, and demand generators
      - Competitive supply changes (new hotels, renovations)
      - Economic indicators and travel trends

    horizon:
      daily_forecast: "Next 7-14 days, updated daily"
      weekly_forecast: "Next 30-90 days, updated weekly"
      monthly_forecast: "Next 6-12 months, updated monthly"
      annual_budget: "Full fiscal year with monthly detail"
```

### Food and Beverage Operations Framework

```yaml
food_and_beverage:
  cost_control:
    food_cost_percentage:
      formula: "Cost of Goods Sold / Food Revenue"
      targets:
        fine_dining: "28-35%"
        casual_dining: "30-35%"
        quick_service: "25-32%"
        banquets: "25-30%"

    beverage_cost_percentage:
      formula: "Cost of Beverages Sold / Beverage Revenue"
      targets:
        liquor: "18-22%"
        wine: "28-35%"
        beer: "24-28%"
        blended: "20-25%"

    controls:
      purchasing:
        - Approved vendor list with competitive bidding
        - Par level ordering based on forecasted covers
        - Receiving verification against purchase orders
        - Invoice matching (three-way: PO, receiving, invoice)
      storage:
        - FIFO rotation for all perishable and non-perishable items
        - Daily temperature logs for walk-in coolers and freezers
        - Weekly physical inventory counts for high-value items
        - Monthly full inventory with variance analysis
      production:
        - Standardized recipes with yield testing
        - Portioned prep with waste tracking
        - Daily food cost flash reports
        - Menu mix analysis for profitability optimization

  menu_engineering:
    classification:
      stars: "High popularity, high contribution margin - promote and maintain"
      plowhorses: "High popularity, low contribution margin - re-engineer pricing/portions"
      puzzles: "Low popularity, high contribution margin - reposition or promote"
      dogs: "Low popularity, low contribution margin - replace or remove"

    analysis_method:
      - Calculate contribution margin for each menu item
      - Calculate menu mix percentage for each item
      - Plot against average contribution margin and average popularity
      - Classify each item into star, plowhorse, puzzle, or dog
      - Develop action plan for each item based on classification

  labor_management:
    scheduling_principles:
      - Forecast covers by meal period and day of week
      - Apply labor standard (covers per labor hour by position)
      - Schedule to demand curve, not flat staffing
      - Cross-train staff to enable flexible deployment
      - Track actual vs. scheduled hours with variance reporting

    productivity_metrics:
      covers_per_labor_hour: "Revenue-generating customers per total labor hours"
      revenue_per_labor_hour: "Total revenue divided by total labor hours"
      labor_cost_percentage: "Total labor cost / Total revenue (target 25-35%)"
```

### Templates

#### Daily Revenue Management Report
```markdown
# Daily Revenue Report: [Property Name] - [Date]

## Rooms Performance
| Metric | Today | MTD | YTD | Budget MTD | Var |
|--------|-------|-----|-----|-----------|-----|
| Occupancy % | [%] | [%] | [%] | [%] | [pts] |
| ADR | [$] | [$] | [$] | [$] | [$] |
| RevPAR | [$] | [$] | [$] | [$] | [$] |
| Rooms Sold | [Count] | [Count] | [Count] | [Count] | [Count] |
| Room Revenue | [$] | [$] | [$] | [$] | [$] |

## Segmentation
| Segment | Rooms | ADR | Revenue | % of Mix |
|---------|-------|-----|---------|----------|
| Transient - Business | [Count] | [$] | [$] | [%] |
| Transient - Leisure | [Count] | [$] | [$] | [%] |
| Group | [Count] | [$] | [$] | [%] |
| Contract | [Count] | [$] | [$] | [%] |

## Pickup and Pace
| Future Date | OTB Rooms | STLY OTB | Var | Rate | STLY Rate |
|-------------|-----------|----------|-----|------|-----------|
| [Date+7] | [Count] | [Count] | [+/-] | [$] | [$] |
| [Date+14] | [Count] | [Count] | [+/-] | [$] | [$] |
| [Date+30] | [Count] | [Count] | [+/-] | [$] | [$] |

## Channel Distribution
| Channel | Rooms | ADR | Revenue | Commission % | Net ADR |
|---------|-------|-----|---------|-------------|---------|
| Direct Web | [Count] | [$] | [$] | [%] | [$] |
| Voice/CRO | [Count] | [$] | [$] | [%] | [$] |
| OTA | [Count] | [$] | [$] | [%] | [$] |
| GDS | [Count] | [$] | [$] | [%] | [$] |
```

#### Guest Satisfaction Action Plan
```markdown
# Guest Satisfaction Action Plan: [Property Name] - [Quarter]

## Current Performance
| Metric | Score | Target | Trend | Rank in Brand |
|--------|-------|--------|-------|--------------|
| Overall Satisfaction | [Score] | [Target] | [Direction] | [Rank/Total] |
| Cleanliness | [Score] | [Target] | [Direction] | [Rank/Total] |
| Service | [Score] | [Target] | [Direction] | [Rank/Total] |
| F&B Quality | [Score] | [Target] | [Direction] | [Rank/Total] |
| Value | [Score] | [Target] | [Direction] | [Rank/Total] |

## Top Issues (by Mention Frequency)
| Rank | Issue | Mentions | Department | Root Cause | Action |
|------|-------|----------|------------|-----------|--------|
| 1 | [Issue] | [Count] | [Dept] | [Cause] | [Action] |
| 2 | [Issue] | [Count] | [Dept] | [Cause] | [Action] |

## Improvement Initiatives
| Initiative | Owner | Deadline | Investment | Expected Impact |
|-----------|-------|----------|-----------|----------------|
| [Initiative] | [Name] | [Date] | [$] | [Score improvement] |
```

### Best Practices

1. **Revenue Management Discipline**: Hold daily revenue meetings reviewing pace, pickup, and pricing decisions for the next 90-day window minimum
2. **Guest Recovery Speed**: Resolve guest complaints within 15 minutes of awareness; same-shift resolution drives significantly higher return intent
3. **Pre-Shift Briefings**: Conduct daily pre-shift meetings in every department covering occupancy, VIPs, group activities, maintenance issues, and service focus
4. **Labor to Demand Alignment**: Schedule staffing based on forecasted demand, not flat templates; a 10% improvement in labor efficiency can add 2-3 points to GOP margin
5. **Rate Integrity**: Maintain rate parity across all distribution channels and enforce best rate guarantee to protect direct booking value
6. **Preventive Maintenance Cycles**: Implement PM schedules for all building systems; soft goods replacement on 5-7 year cycles, case goods on 10-12 year cycles
7. **Menu Engineering Quarterly**: Re-evaluate menu item classification quarterly and adjust pricing, positioning, and descriptions based on current performance data
8. **Cross-Training Investment**: Cross-train staff across positions to provide scheduling flexibility and career development; minimum 20% of staff should be multi-certified
9. **Energy Conservation**: Implement occupancy-based HVAC controls, LED lighting conversions, and water conservation fixtures; target 5-8% annual utility reduction
10. **Competitive Intelligence**: Shop competitor properties quarterly for rate, product, and service benchmarking; maintain current comp set analysis
11. **Inventory Control Rigor**: Conduct daily high-value inventory counts (proteins, liquor) and monthly comprehensive inventories with variance investigation
12. **Digital Guest Journey**: Optimize mobile check-in, digital key, in-app messaging, and automated post-stay review solicitation to meet evolving guest expectations
13. **Safety and Sanitation First**: Maintain impeccable food safety (HACCP), pool chemistry, fire system, and life safety compliance as non-negotiable operational foundations

### Common Patterns

#### Pattern 1: Citywide Event Revenue Optimization
```
Scenario: A major convention is confirmed for the market in 6 months,
projecting 15,000 attendees over 4 nights (Tuesday-Friday).

Process:
1. Analyze historical citywide event performance: occupancy reached 95%, ADR +40%
2. Review current on-the-books for event dates: 35% booked, mostly at pre-event rates
3. Close discounted rates and promotional offers for event dates immediately
4. Raise BAR (Best Available Rate) in three incremental steps over next 6 months
5. Apply 3-night minimum stay to capture full event window and block cherry-picking
6. Negotiate group blocks at premium rates with 60-day cutoff and narrow attrition allowance
7. Price shoulder nights (Monday, Saturday) attractively to extend stays
8. Brief F&B and banquet teams to staff for increased outlet and catering demand
9. Coordinate with housekeeping for stayover service adjustments and early departures
10. Post-event analysis: achieved $245 ADR (+52% vs. normal), 97% occupancy, RevPAR index 108
```

#### Pattern 2: Food Cost Variance Investigation
```
Scenario: Monthly food cost for the main restaurant came in at 38%
against a 32% budget, representing $24,000 in unfavorable variance.

Process:
1. Pull item-level cost data and compare to standard recipe costs
2. Identify top variances: proteins ($9K over), produce ($6K over), dairy ($3K over)
3. Check purchasing: beef prices increased 12% due to supplier change mid-month
4. Review receiving logs: three deliveries lacked proper weight verification
5. Analyze waste logs: 340 lbs of protein waste (+60% vs. standard), prep over-production
6. Review menu mix: high-cost steak entree represented 28% of mix (up from 18%)
7. Check portioning: random plate audits show protein portions averaging 10oz vs. 8oz spec
8. Corrective actions: re-negotiate beef pricing, retrain on receiving procedures
9. Implement portion scales at all protein stations with daily pre-shift calibration
10. Re-engineer steak entree: adjust portion to 8oz, increase accompaniment value perception
```

### Output Formats

#### STR Competitive Performance Summary
```markdown
# Competitive Set Analysis: [Property Name] - [Month/Year]

## Performance vs. Comp Set
| Metric | Property | Comp Set | Index | Rank |
|--------|---------|----------|-------|------|
| Occupancy | [%] | [%] | [Index] | [#/Total] |
| ADR | [$] | [$] | [Index] | [#/Total] |
| RevPAR | [$] | [$] | [Index] | [#/Total] |

## 12-Month Trend
| Month | Occ Index | ADR Index | RevPAR Index |
|-------|-----------|-----------|-------------|
| [Month] | [Index] | [Index] | [Index] |

## Market Share Analysis
- Fair Share: [%] (based on room count)
- Actual Share: [%] (based on room nights sold)
- Market Penetration Index: [Index]
```

#### Departmental P&L Summary
```markdown
# Departmental P&L: [Property Name] - [Period]

| Department | Revenue | Payroll | Other Expense | Dept Profit | Margin % |
|-----------|---------|---------|-------------|-------------|----------|
| Rooms | [$] | [$] | [$] | [$] | [%] |
| Food & Beverage | [$] | [$] | [$] | [$] | [%] |
| Spa/Recreation | [$] | [$] | [$] | [$] | [%] |
| Other Operated | [$] | [$] | [$] | [$] | [%] |
| **Total Operated** | **[$]** | **[$]** | **[$]** | **[$]** | **[%]** |
| Undistributed Expenses | - | [$] | [$] | [$] | [%] |
| **Gross Operating Profit** | **[$]** | - | - | **[$]** | **[%]** |
```

## Integration Points

- Property management systems (Opera PMS, Mews, Cloudbeds, Maestro)
- Revenue management systems (IDeaS, Duetto, Atomize, RateGain)
- Central reservation systems (Synxis, Pegasus, TravelClick)
- Channel managers (SiteMinder, Derbysoft, D-Edge)
- Point-of-sale systems (Micros, Toast, Lightspeed, Aloha)
- Guest experience platforms (Medallia, ReviewPro, TrustYou)
- Housekeeping management (Optii, Flexkeeping, Quore)
- STR benchmarking and market data
- Procurement and inventory (Birchstreet, FoodBAM, MarketMan)

## Version History

- 1.0.0: Initial hospitality operations skill with hotel and F&B management
