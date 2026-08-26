---
name: board-reporting
description: Helps configure and build board reporting processes. Strategic board deck creation, KPI dashboards, and investor update communications that drive informed governance decisions. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Board Reporting

> Strategic board deck creation, KPI dashboards, and investor update communications that drive informed governance decisions.

## Metadata

- **Skill ID**: board-reporting
- **Category**: Back of House - Executive Operations
- **Complexity Level**: Expert
- **Prerequisites**:
  - Financial reporting knowledge
  - Executive communication skills
  - KPI framework understanding
  - Data visualization proficiency

## Overview

Board Reporting transforms complex business performance data into clear, actionable narratives for board members and investors. This skill encompasses creating compelling board decks, designing KPI dashboards that highlight what matters, and crafting investor updates that build confidence while maintaining transparency.

## Core Capabilities

### 1. Board Deck Creation

**Strategic Narrative Development**
- Executive summary frameworks
- Key message prioritization
- Story arc construction
- Decision facilitation design
- Risk/opportunity balance

**Standard Board Sections**
```markdown
## Board Deck Structure

### 1. Executive Summary (1-2 slides)
- Quarter/period highlights
- Key wins and challenges
- Critical decisions needed
- Forward outlook snapshot

### 2. Financial Performance (3-5 slides)
- Revenue and growth metrics
- Profitability analysis
- Cash position and runway
- Budget vs. actual variance
- Financial projections

### 3. Operational Metrics (2-4 slides)
- Customer/user metrics
- Product milestones
- Operational efficiency
- Team and hiring updates

### 4. Strategic Initiatives (2-3 slides)
- Progress on key initiatives
- Strategic pivots or changes
- Competitive landscape
- Market opportunities

### 5. Risk and Governance (1-2 slides)
- Risk register updates
- Compliance matters
- Legal considerations
- Governance items

### 6. Decisions Required (1 slide)
- Specific board votes needed
- Approval requests
- Strategic input sought

### 7. Appendix
- Detailed financials
- Supporting data
- Reference materials
```

### 2. KPI Dashboard Design

**Dashboard Architecture**
```yaml
executive_dashboard:
  tier_1_metrics:
    - name: "Revenue"
      visualization: "trend_line"
      comparison: "vs_target_and_prior"
      alert_threshold: "10%_variance"

    - name: "Gross Margin"
      visualization: "gauge"
      target_zone: "green_yellow_red"
      benchmark: "industry_average"

    - name: "Cash Runway"
      visualization: "countdown"
      warning_threshold: "12_months"
      critical_threshold: "6_months"

    - name: "Customer Count"
      visualization: "bar_trend"
      segmentation: "by_tier"
      growth_annotation: true

  tier_2_metrics:
    financial:
      - "MRR/ARR Growth Rate"
      - "CAC/LTV Ratio"
      - "Burn Rate"
      - "Collections Efficiency"

    operational:
      - "Customer Churn Rate"
      - "NPS Score"
      - "Employee Headcount"
      - "Product Velocity"

    strategic:
      - "Market Share"
      - "Pipeline Value"
      - "Partnership Progress"
      - "Innovation Index"

  refresh_cadence:
    real_time: ["Cash Position", "Active Users"]
    daily: ["Revenue", "Key Metrics"]
    weekly: ["Operational Metrics"]
    monthly: ["Strategic Metrics", "Benchmarks"]
```

**Visualization Best Practices**
- Consistent color coding
- Clear trend indicators
- Contextual benchmarks
- Drill-down capability
- Mobile responsiveness

### 3. Investor Update Communications

**Update Structure Template**
```markdown
## Monthly/Quarterly Investor Update

### Opening (Personal Touch)
- Brief personal note from CEO
- Company momentum summary
- Tone-setting for the update

### Key Metrics Dashboard
| Metric | Current | Prior | Target | Status |
|--------|---------|-------|--------|--------|
| ARR    | $X.XM   | $X.XM | $X.XM  | [Indicator] |
| Growth | XX%     | XX%   | XX%    | [Indicator] |
| Runway | XX mo   | XX mo | XX mo  | [Indicator] |

### Highlights
1. **Win #1**: Description and impact
2. **Win #2**: Description and impact
3. **Win #3**: Description and impact

### Challenges & Learnings
- Challenge faced and response
- Lessons learned and adaptations
- Support requests (if any)

### Looking Ahead
- Next period priorities
- Key milestones targeted
- Strategic focus areas

### Ask
- Specific introductions needed
- Expertise requests
- Other support

### Closing
- Gratitude expression
- Availability for questions
- Next update timing
```

## Implementation Workflows

### Board Meeting Preparation

**Timeline and Checklist**
```markdown
## Board Meeting Prep Timeline

### T-4 Weeks: Data Collection
- [ ] Close financial books
- [ ] Compile operational metrics
- [ ] Gather department updates
- [ ] Collect competitive intelligence
- [ ] Review strategic initiative status

### T-3 Weeks: First Draft
- [ ] Create initial deck structure
- [ ] Draft executive summary
- [ ] Build financial section
- [ ] Compile operational updates
- [ ] Identify decision items

### T-2 Weeks: Review Cycle
- [ ] CFO financial review
- [ ] Department head reviews
- [ ] Legal/compliance review
- [ ] CEO narrative review
- [ ] Incorporate feedback

### T-1 Week: Finalization
- [ ] Final CEO review
- [ ] Board chair preview
- [ ] Committee pre-briefs
- [ ] Materials distribution
- [ ] Q&A preparation

### T-2 Days: Distribution
- [ ] Send board materials
- [ ] Confirm receipt
- [ ] Schedule one-on-ones
- [ ] Prepare presentation notes
- [ ] Test technology

### Day Of: Execution
- [ ] Room/tech setup
- [ ] Materials ready
- [ ] Note-taker assigned
- [ ] Action item tracker
- [ ] Follow-up plan
```

### KPI Framework Development

**Metric Selection Process**
```yaml
kpi_development:
  step_1_strategy_alignment:
    questions:
      - "What are our strategic priorities?"
      - "What decisions do leaders need to make?"
      - "What behaviors do we want to drive?"
    output: "Strategic metric themes"

  step_2_metric_identification:
    categories:
      - "Leading vs. lagging indicators"
      - "Input vs. output metrics"
      - "Efficiency vs. effectiveness"
    criteria:
      - "Actionable"
      - "Measurable"
      - "Relevant"
      - "Timely"

  step_3_hierarchy_design:
    levels:
      board: "3-5 strategic metrics"
      executive: "10-15 operational metrics"
      management: "20-30 functional metrics"
      team: "Unlimited tactical metrics"

  step_4_target_setting:
    methods:
      - "Historical trend analysis"
      - "Benchmark comparison"
      - "Strategic aspiration"
      - "Capacity-based modeling"

  step_5_governance:
    ownership: "Metric owner assignment"
    review_cadence: "Update frequency"
    escalation: "Variance thresholds"
    evolution: "Metric retirement/addition"
```

## Advanced Techniques

### Board Narrative Construction

**Storytelling Framework**
```markdown
## Board Narrative Arc

### 1. Context Setting
- Market conditions and trends
- Competitive landscape changes
- Regulatory environment
- Economic factors

### 2. Performance Story
- What we set out to achieve
- What actually happened
- Why the variance (if any)
- What we learned

### 3. Strategic Implications
- What this means for strategy
- Opportunities identified
- Risks surfaced
- Trade-offs required

### 4. Forward Path
- Recommended actions
- Resource requirements
- Timeline and milestones
- Success measures

### 5. Board Engagement
- Decisions needed
- Input requested
- Concerns to address
- Commitments sought
```

**Data-Driven Storytelling**
- Lead with insight, not data
- Use comparisons for context
- Highlight patterns and trends
- Connect metrics to strategy
- Anticipate questions

### Investor Communication Strategy

**Communication Cadence**
```yaml
investor_communication_plan:
  regular_updates:
    monthly_email:
      content: "Key metrics, highlights, asks"
      length: "1-2 pages"
      tone: "Informative, transparent"

    quarterly_call:
      format: "30-min video call"
      content: "Deep dive on performance"
      participants: "CEO + CFO"

    annual_meeting:
      format: "In-person or extended video"
      content: "Strategy, financials, governance"
      materials: "Annual report, projections"

  situational_updates:
    major_milestone:
      timing: "Within 48 hours"
      format: "Email + optional call"

    significant_challenge:
      timing: "Proactive, before rumors"
      format: "Email + call offer"

    fundraising_mode:
      timing: "Weekly during process"
      format: "Email + data room updates"

  relationship_building:
    one_on_ones:
      frequency: "Quarterly minimum"
      purpose: "Relationship, feedback, support"

    investor_events:
      frequency: "Annual"
      format: "Dinner, demo day, conference"
```

### Crisis Communication in Board Context

**Crisis Reporting Framework**
```markdown
## Board Crisis Communication

### Immediate Notification (Within Hours)
- What happened (facts only)
- Immediate impact assessment
- Initial response actions
- Next communication timing

### Detailed Update (Within 24-48 Hours)
- Root cause analysis
- Full impact assessment
- Response plan
- Resource requirements
- Timeline for resolution

### Ongoing Updates
- Progress on resolution
- Stakeholder communications
- Legal/regulatory implications
- Lessons learned (ongoing)

### Post-Crisis Review
- Complete root cause analysis
- Response effectiveness evaluation
- Process improvements
- Governance implications
- Prevention measures
```

## Quality Standards

### Board Materials Quality

**Quality Checklist**
```markdown
## Board Deck Quality Standards

### Content Quality
- [ ] Executive summary captures essence
- [ ] Data is accurate and current
- [ ] Comparisons provide context
- [ ] Narrative is clear and coherent
- [ ] Decisions are clearly framed

### Visual Quality
- [ ] Consistent formatting throughout
- [ ] Charts are readable and labeled
- [ ] Color coding is meaningful
- [ ] Slide density is appropriate
- [ ] Professional appearance

### Strategic Quality
- [ ] Aligns with company strategy
- [ ] Addresses board priorities
- [ ] Anticipates questions
- [ ] Provides actionable insights
- [ ] Supports decision-making

### Governance Quality
- [ ] Includes required disclosures
- [ ] Risk section is comprehensive
- [ ] Compliance items addressed
- [ ] Appropriate confidentiality
- [ ] Proper version control
```

### Dashboard Effectiveness

**Dashboard Audit Criteria**
- Data accuracy and timeliness
- User engagement metrics
- Decision influence tracking
- Maintenance sustainability
- Evolution adaptability

## Integration Points

### Data Source Connections
- Financial systems (ERP, accounting)
- CRM and sales platforms
- Product analytics tools
- HR and people systems
- Market intelligence feeds

### Stakeholder Alignment
- CEO vision and priorities
- CFO financial perspective
- Board member preferences
- Investor expectations
- Legal requirements

## Common Challenges

### Challenge Resolution

**Over-Detailed Decks**
- Prioritize ruthlessly
- Use appendix for details
- Focus on insights not data
- Test with fresh eyes

**Inconsistent Metrics**
- Establish single source of truth
- Document definitions clearly
- Automate where possible
- Regular reconciliation

**Last-Minute Changes**
- Build in buffer time
- Lock content early
- Manage expectations
- Have backup plans

## Success Metrics

### Board Reporting Effectiveness
- Board meeting efficiency
- Decision quality and speed
- Director engagement levels
- Information request reduction
- Governance compliance

### Investor Relations Impact
- Investor satisfaction scores
- Follow-on investment rates
- Reference quality
- Information accuracy
- Relationship strength

## Related Skills

- **investor-relations**: Fundraising and pitch preparation
- **kpi-frameworks**: Metric design and hierarchy
- **executive-communication**: Leadership messaging
- **financial-planning**: Budget and forecast development
- **business-dashboards**: Technical dashboard creation

## Resources

### Templates
- Board deck master template
- Investor update template
- KPI dashboard framework
- Meeting minute template
- Decision log format

### Best Practices
- Board governance guidelines
- Investor communication standards
- Data visualization principles
- Executive presentation techniques
- Confidentiality protocols
