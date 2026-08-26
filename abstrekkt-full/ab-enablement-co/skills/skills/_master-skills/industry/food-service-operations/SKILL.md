---
name: food-service-operations
description: Helps manage and audit food service operations processes. Expert guidance for restaurant and food service management including food safety and HACCP compliance, menu engineering, kitchen operations optimization, and front-of-house service excellence. Use when navigating industry-specific regulations, processes, or operations.
---

# Food Service Operations Skill

> Restaurant management, food safety, menu optimization, and kitchen operations

## Description

This skill provides comprehensive guidance for food service operations including restaurant and commercial kitchen management, food safety compliance with FDA Food Code and HACCP principles, menu engineering and cost optimization, kitchen workflow design, front-of-house service standards, and inventory management. It covers full-service restaurants, quick-service operations, catering, institutional food service, and ghost kitchens. The skill supports restaurant owners, general managers, executive chefs, food safety managers, and operations directors in building efficient, safe, and profitable food service businesses.

## Activation Triggers

- User mentions "restaurant management", "food service", or "kitchen operations"
- User asks about food safety, HACCP, or ServSafe requirements
- User needs help with menu engineering, food cost, or pricing strategy
- User discusses kitchen workflow, station layout, or line efficiency
- User asks about restaurant inventory management or waste reduction
- User mentions front-of-house operations, service standards, or table management
- User needs guidance on health inspection preparation or compliance
- User asks about catering operations, banquet planning, or commissary kitchens
- User discusses restaurant P&L, labor cost, or operational budgeting
- User mentions food allergen management or dietary accommodation

## Instructions

### Core Workflow

1. **Operations Assessment**
   - Evaluate current kitchen layout and workflow efficiency
   - Review food safety practices against FDA Food Code requirements
   - Analyze menu performance using engineering matrix
   - Assess labor deployment and scheduling effectiveness
   - Identify cost control opportunities across food, labor, and overhead

2. **Food Safety System Design**
   - Implement HACCP-based food safety management system
   - Establish critical control points for each menu category
   - Design temperature monitoring and documentation protocols
   - Create allergen management and cross-contamination prevention plans
   - Build health inspection readiness and self-audit programs

3. **Menu and Cost Optimization**
   - Conduct menu engineering analysis (popularity vs. profitability)
   - Develop standardized recipes with precise costing
   - Design menu layout using visual psychology principles
   - Establish vendor relationships and purchasing specifications
   - Implement portion control and waste tracking systems

4. **Kitchen Operations Management**
   - Design station assignments and prep schedules
   - Establish mise en place standards and par levels
   - Create line check and quality assurance procedures
   - Implement kitchen display systems and ticket management
   - Optimize equipment utilization and maintenance schedules

5. **Service and Guest Experience**
   - Define front-of-house service standards and steps of service
   - Design floor plans and table management strategies
   - Establish guest complaint resolution protocols
   - Implement reservation and waitlist management
   - Create training programs for consistency and upselling

### Food Safety and HACCP Framework

```yaml
food_safety_framework:
  haccp_principles:
    principle_1:
      name: "Conduct Hazard Analysis"
      actions:
        - Identify biological hazards (bacteria, viruses, parasites)
        - Identify chemical hazards (allergens, cleaning agents, toxins)
        - Identify physical hazards (glass, metal, bones)
        - Assess severity and likelihood of each hazard
        - Determine preventive measures for significant hazards

    principle_2:
      name: "Determine Critical Control Points"
      common_ccps:
        - Receiving (temperature of deliveries)
        - Cold storage (refrigeration maintenance)
        - Cooking (minimum internal temperatures)
        - Hot holding (maintain above 135F/57C)
        - Cold holding (maintain below 41F/5C)
        - Cooling (from 135F to 70F in 2 hrs, to 41F in 4 hrs)
        - Reheating (to 165F/74C within 2 hours)

    principle_3:
      name: "Establish Critical Limits"
      temperature_standards:
        poultry: "165F (74C) for 15 seconds"
        ground_meat: "155F (68C) for 17 seconds"
        pork_seafood_eggs: "145F (63C) for 15 seconds"
        fruits_vegetables: "135F (57C) for hot holding"
        cold_holding: "41F (5C) or below"
        danger_zone: "41F-135F (5C-57C)"

    principle_4:
      name: "Establish Monitoring Procedures"
      methods:
        - Calibrated thermometer readings at defined intervals
        - Temperature logs for all refrigeration and holding units
        - Receiving inspection checklists
        - Cooking temperature verification for each batch
        - Time and temperature tracking for cooling processes

    principle_5:
      name: "Establish Corrective Actions"
      responses:
        temperature_violation: "Discard, reheat, or rapid-cool depending on context"
        receiving_rejection: "Refuse delivery, document, notify supplier"
        equipment_failure: "Transfer product, repair equipment, verify temperatures"
        cross_contamination: "Discard affected product, sanitize surfaces, retrain staff"

    principle_6:
      name: "Establish Verification Procedures"
      activities:
        - Daily manager food safety walkthroughs
        - Weekly calibration of thermometers
        - Monthly review of temperature logs and corrective actions
        - Quarterly internal food safety audits
        - Annual third-party food safety assessment

    principle_7:
      name: "Establish Record-Keeping Procedures"
      required_records: "HACCP plan, CCP monitoring logs, corrective action records, verification records, training records"

  allergen_management:
    big_nine:
      - Milk
      - Eggs
      - Fish
      - Shellfish
      - Tree nuts
      - Peanuts
      - Wheat
      - Soybeans
      - Sesame
    controls:
      - Allergen ingredient matrix for all menu items
      - Separate preparation areas and color-coded utensils
      - Clear allergen communication on menus and with guests
      - Staff training on cross-contact prevention and emergency response
```

### Menu Engineering and Cost Control

```yaml
menu_engineering:
  menu_matrix:
    categories:
      stars:
        definition: "High popularity, high profitability"
        strategy: "Maintain quality and visibility; feature prominently"
      plowhorses:
        definition: "High popularity, low profitability"
        strategy: "Reengineer recipes, adjust portions, increase prices gradually"
      puzzles:
        definition: "Low popularity, high profitability"
        strategy: "Reposition on menu, rename, improve descriptions, server training"
      dogs:
        definition: "Low popularity, low profitability"
        strategy: "Remove, replace, or drastically reengineer"

  food_cost_management:
    target_ranges:
      fine_dining: "28-35%"
      casual_dining: "28-32%"
      quick_service: "25-30%"
      catering: "20-28%"
    calculation:
      food_cost_pct: "(Cost of goods sold / Food revenue) x 100"
      plate_cost: "Sum of all ingredient costs per standardized recipe"
      menu_price: "Plate cost / Target food cost percentage"

    controls:
      purchasing:
        - Approved vendor list with negotiated pricing
        - Purchase specifications for all items
        - Order guides with par levels
        - Competitive bidding for high-volume items
        - Contract pricing for commodity items
      receiving:
        - Weight/count verification and temperature checks
        - Quality inspection and invoice verification
      storage:
        - FIFO rotation with proper date labeling
        - Temperature monitoring and allergen separation
        - Weekly inventory counts for high-cost items
      production:
        - Standardized recipes with exact measurements
        - Portion control tools (scales, scoops, ladles)
        - Batch cooking to match demand forecasts
        - Waste tracking sheets by category
        - Cross-utilization of trim and by-products

  labor_cost:
    target_ranges:
      fine_dining: "30-35%"
      casual_dining: "25-32%"
      quick_service: "22-28%"
    optimization:
      - Sales-per-labor-hour tracking
      - Demand-based scheduling using historical data
      - Cross-training for flexible deployment
      - Staggered shifts aligned to peak periods
      - Prep list prioritization by shelf life and demand
```

### Templates

#### Health Inspection Readiness Checklist
```markdown
# Health Inspection Readiness Checklist

## Temperature Control
- [ ] All refrigerators at 41F (5C) or below
- [ ] All freezers at 0F (-18C) or below
- [ ] Hot holding units at 135F (57C) or above
- [ ] Thermometers calibrated and accessible
- [ ] Temperature logs current and complete

## Personal Hygiene
- [ ] Handwashing stations stocked (soap, towels, signage)
- [ ] Staff demonstrating proper handwashing
- [ ] Glove use appropriate and changed frequently
- [ ] No bare-hand contact with ready-to-eat foods
- [ ] Hair restraints worn by all food handlers
- [ ] No eating, drinking, or smoking in food prep areas

## Cross-Contamination Prevention
- [ ] Raw proteins stored below ready-to-eat items
- [ ] Separate cutting boards for raw and cooked items
- [ ] Sanitizer test strips available and in-range
- [ ] Three-compartment sink set up correctly
- [ ] Chemical storage separated from food storage

## Facility and Equipment
- [ ] Floors, walls, and ceilings clean and in good repair
- [ ] Equipment clean and in working condition
- [ ] Pest control measures in place (no evidence of pests)
- [ ] Garbage areas clean and properly contained
- [ ] Ventilation hoods clean and functioning

## Documentation
- [ ] Food safety certifications current and posted
- [ ] HACCP plan available for review
- [ ] Employee training records on file
- [ ] Allergen information available for all menu items
- [ ] Corrective action logs maintained
```

#### Weekly Food Cost Tracker
```markdown
# Weekly Food Cost Report

## Period: [Week of Date]

## Purchases and Usage
| Category | Beginning Inventory | Purchases | Ending Inventory | Usage | Revenue | Cost % |
|----------|-------------------|-----------|-----------------|-------|---------|--------|
| Proteins | $[Amount] | $[Amount] | $[Amount] | $[Amount] | $[Amount] | [%] |
| Produce | $[Amount] | $[Amount] | $[Amount] | $[Amount] | $[Amount] | [%] |
| Dairy | $[Amount] | $[Amount] | $[Amount] | $[Amount] | $[Amount] | [%] |
| Dry Goods | $[Amount] | $[Amount] | $[Amount] | $[Amount] | $[Amount] | [%] |
| Beverages | $[Amount] | $[Amount] | $[Amount] | $[Amount] | $[Amount] | [%] |
| **Total** | **$[Amount]** | **$[Amount]** | **$[Amount]** | **$[Amount]** | **$[Amount]** | **[%]** |

## Waste Log Summary
| Category | Spoilage | Overproduction | Errors | Total Waste | % of Purchases |
|----------|----------|----------------|--------|-------------|----------------|
| [Category] | $[Amount] | $[Amount] | $[Amount] | $[Amount] | [%] |

## Variance Analysis
- Target Food Cost: [%]
- Actual Food Cost: [%]
- Variance: [+/- %]
- Primary Drivers: [Analysis]
- Corrective Actions: [Actions to take]
```

### Best Practices

- Conduct daily line checks before every service period to verify station readiness and food quality
- Enforce the two-hour / four-hour rule rigorously: discard food in the danger zone beyond safe limits
- Engineer menus seasonally to leverage lower-cost peak-availability ingredients
- Cross-train every kitchen employee on at least two stations for scheduling flexibility
- Track actual vs. theoretical food cost weekly to identify theft, waste, and portioning issues
- Use FIFO labeling religiously; date every item that enters storage
- Calibrate all thermometers weekly and keep calibration logs
- Design kitchen layouts to minimize crossover between raw protein and ready-to-eat workflows
- Schedule deep cleaning tasks across a rotating weekly calendar so no area is neglected
- Maintain a "86 board" (items unavailable) updated in real time to prevent guest disappointment
- Standardize every recipe with weights (not volumes) for consistency and costing accuracy
- Implement pre-shift briefings covering specials, 86 items, allergen reminders, and service goals
- Monitor food delivery temperature at receiving and reject anything outside specification
- Build vendor redundancy for critical items to avoid supply disruptions

### Common Patterns

#### Pattern: New Menu Item Launch
```
1. Develop recipe with full ingredient costing
2. Determine target food cost % and set price
3. Conduct tastings with kitchen and FOH teams
4. Create allergen profile and prep procedures
5. Photograph item for menu and training materials
6. Train servers on description, ingredients, and upsell points
7. Run as a special for two weeks to gauge demand
8. Analyze sales mix impact and adjust placement if added permanently
```

#### Pattern: Health Inspection Response
```
1. Greet inspector professionally; provide requested records immediately
2. Assign a manager to escort inspector throughout facility
3. Take notes on every observation and comment made
4. For any critical violation found, implement corrective action immediately
5. Request re-inspection if needed after corrections
6. Conduct post-inspection debrief with all department leads
7. Update HACCP plan and SOPs based on findings
8. Retrain staff on any identified deficiency areas
```

#### Pattern: Daily Pre-Service Kitchen Routine
```
1. Review prep list and verify completion of all items
2. Conduct temperature checks on all holding and storage units
3. Verify mise en place at every station (par levels, freshness)
4. Check equipment function (grills, fryers, ovens, salamanders)
5. Review reservation count and projected covers
6. Brief team on specials, 86 list, VIP notes, and allergen reminders
7. Verify sanitizer buckets at proper concentration at each station
8. Confirm line check sign-off by chef or kitchen manager
```

### Output Formats

#### Restaurant Operations Dashboard
```markdown
# Food Service Operations Dashboard: [Restaurant Name]

## Daily Performance
| Metric | Target | Actual | Variance |
|--------|--------|--------|----------|
| Covers Served | [Count] | [Count] | [+/-] |
| Average Check | $[Amount] | $[Amount] | [+/-] |
| Revenue | $[Amount] | $[Amount] | [+/-] |
| Food Cost % | [%] | [%] | [+/-] |
| Labor Cost % | [%] | [%] | [+/-] |
| Table Turn Time | [Minutes] | [Minutes] | [+/-] |

## Guest Satisfaction
| Channel | Score | Target | Trend |
|---------|-------|--------|-------|
| Online Reviews | [Rating] | [Rating] | [Up/Down] |
| Comment Cards | [Score] | [Score] | [Up/Down] |
| Complaints Today | [Count] | <[Target] | [Status] |

## Food Safety Status
| Check | Status | Last Verified |
|-------|--------|---------------|
| Temperature Logs | [Complete/Incomplete] | [Time] |
| Handwashing Compliance | [%] | [Time] |
| Sanitizer Concentrations | [In Range/Out] | [Time] |
| FIFO Compliance | [Pass/Fail] | [Time] |
```

#### Menu Engineering Report
```markdown
# Menu Engineering Analysis: [Menu Section]

## Period: [Date Range]

## Item Performance Matrix
| Item | Qty Sold | Mix % | Food Cost | Sell Price | CM | Category |
|------|----------|-------|-----------|------------|-----|----------|
| [Item] | [Count] | [%] | $[Cost] | $[Price] | $[Margin] | [Star/Plowhorse/Puzzle/Dog] |

## Category Summary
| Category | Count | Avg CM | Action Required |
|----------|-------|--------|-----------------|
| Stars | [Count] | $[Amount] | Maintain and promote |
| Plowhorses | [Count] | $[Amount] | Reengineer for margin |
| Puzzles | [Count] | $[Amount] | Reposition or retrain |
| Dogs | [Count] | $[Amount] | Remove or replace |

## Recommendations
1. [Specific action item with financial impact estimate]
2. [Specific action item with financial impact estimate]
3. [Specific action item with financial impact estimate]
```

## Version History

- 1.0.0: Initial food service operations skill
