---
name: business-continuity
description: Comprehensive business continuity planning and management for organizational resilience. Use when developing BCP frameworks, conducting business impact analysis, creating continuity strategies, implementing crisis management, or building organizational resilience programs.
---

# Business Continuity

## Overview

Business continuity planning (BCP) ensures organizations can maintain essential functions during and after disruptive events. It extends beyond IT disaster recovery to encompass people, processes, facilities, and third-party dependencies that enable business operations.

Effective business continuity integrates risk assessment, business impact analysis, strategy development, plan documentation, testing, and continuous improvement into a cohesive program. It prepares organizations to respond to various scenarios from localized incidents to enterprise-wide crises.

Modern business continuity addresses an evolving threat landscape including pandemics, cyber attacks, supply chain disruptions, climate events, and geopolitical instability. Programs must balance comprehensive preparation with practical implementation and ongoing maintenance.

### Why This Matters

- **Organizational Survival**: Maintain operations during critical events
- **Regulatory Compliance**: Meet industry and regulatory BC requirements
- **Stakeholder Confidence**: Demonstrate resilience to customers and investors
- **Competitive Advantage**: Recover faster than competitors
- **Financial Protection**: Minimize revenue loss and recovery costs
- **Employee Safety**: Protect workforce during emergencies

## When to Use

### Primary Triggers

- Establishing enterprise BCP program
- Responding to regulatory requirements
- Conducting annual BCP review
- Addressing audit findings
- Preparing for known threats
- Recovering from actual incidents

### Specific Use Cases

1. **Business Impact Analysis**: Identify critical functions and dependencies
2. **Continuity Strategy**: Define how to maintain operations
3. **Crisis Management**: Coordinate organizational response
4. **Emergency Response**: Immediate incident handling
5. **Recovery Planning**: Restore normal operations
6. **Program Management**: Ongoing BC governance

## Core Processes

### Process 1: Business Impact Analysis (BIA)

Identify critical business functions and their recovery requirements.

```yaml
# business-impact-analysis-framework.yaml
bia_framework:
  scope_definition:
    organizational_scope:
      - "All business units"
      - "All locations"
      - "Critical third parties"

    function_identification:
      sources:
        - "Process documentation"
        - "Organization charts"
        - "Service catalogs"
        - "Stakeholder interviews"

  impact_assessment:
    impact_categories:
      financial:
        metrics:
          - "Revenue loss per hour/day"
          - "Penalty/fine exposure"
          - "Recovery costs"
          - "Customer compensation"
        severity_scale:
          catastrophic: ">$10M"
          critical: "$1M-$10M"
          major: "$100K-$1M"
          moderate: "$10K-$100K"
          minor: "<$10K"

      operational:
        metrics:
          - "Service delivery capability"
          - "Production capacity"
          - "Customer service ability"
          - "Internal process completion"
        severity_scale:
          catastrophic: "Complete inability to operate"
          critical: "Major operations suspended"
          major: "Significant degradation"
          moderate: "Noticeable impact"
          minor: "Minimal disruption"

      regulatory:
        metrics:
          - "Compliance violation severity"
          - "License/certification risk"
          - "Reporting obligation breach"
        severity_scale:
          catastrophic: "License revocation risk"
          critical: "Major regulatory violation"
          major: "Reportable incident"
          moderate: "Minor compliance issue"
          minor: "Documentation gap"

      reputational:
        metrics:
          - "Customer impact"
          - "Media exposure"
          - "Market confidence"
          - "Partner relationships"
        severity_scale:
          catastrophic: "Existential reputation damage"
          critical: "Major public incident"
          major: "Significant stakeholder concern"
          moderate: "Limited negative attention"
          minor: "Minimal external awareness"

  function_analysis_template:
    function_profile:
      - field: "Function name"
        example: "Order Processing"
      - field: "Business unit"
        example: "Sales Operations"
      - field: "Function owner"
        example: "Director of Sales Ops"
      - field: "Description"
        example: "Receive, validate, and fulfill customer orders"

    criticality_assessment:
      - field: "Revenue impact at 1 hour"
        scale: "$ amount"
      - field: "Revenue impact at 24 hours"
        scale: "$ amount"
      - field: "Regulatory impact"
        scale: "Severity rating"
      - field: "Reputational impact"
        scale: "Severity rating"
      - field: "Overall criticality"
        scale: "Tier 1-4"

    recovery_requirements:
      - field: "Recovery Time Objective (RTO)"
        description: "Maximum acceptable downtime"
      - field: "Recovery Point Objective (RPO)"
        description: "Maximum acceptable data loss"
      - field: "Minimum Business Continuity Objective (MBCO)"
        description: "Minimum acceptable service level"
      - field: "Maximum Tolerable Period of Disruption (MTPD)"
        description: "Time before unrecoverable impact"

    dependencies:
      internal:
        - "IT systems"
        - "Personnel"
        - "Facilities"
        - "Other functions"
      external:
        - "Suppliers"
        - "Service providers"
        - "Utilities"
        - "Regulatory bodies"

  criticality_tiering:
    tier_1_mission_critical:
      definition: "Functions essential for survival"
      rto_range: "0-4 hours"
      characteristics:
        - "Direct revenue generation"
        - "Customer-facing services"
        - "Regulatory obligations"
      examples:
        - "Payment processing"
        - "Emergency services"
        - "Trading operations"

    tier_2_business_critical:
      definition: "Functions needed for core operations"
      rto_range: "4-24 hours"
      characteristics:
        - "Supports Tier 1 functions"
        - "Important customer services"
        - "Key operational processes"
      examples:
        - "Customer service"
        - "Inventory management"
        - "Supply chain operations"

    tier_3_business_important:
      definition: "Functions for normal operations"
      rto_range: "24-72 hours"
      characteristics:
        - "Supports business efficiency"
        - "Internal services"
        - "Non-urgent processes"
      examples:
        - "HR processes"
        - "Marketing activities"
        - "Reporting functions"

    tier_4_non_critical:
      definition: "Functions that can be deferred"
      rto_range: "72+ hours"
      characteristics:
        - "No immediate impact"
        - "Can be performed later"
        - "Low urgency"
      examples:
        - "Training programs"
        - "Long-term planning"
        - "Non-essential meetings"
```

### Process 2: Continuity Strategy Development

```yaml
# continuity-strategy-framework.yaml
continuity_strategies:
  people_strategies:
    workforce_continuity:
      - strategy: "Remote work capability"
        description: "Enable employees to work from alternate locations"
        requirements:
          - "Remote access technology"
          - "Collaboration tools"
          - "Security controls"
          - "Home office equipment"
        applicable_to: "Knowledge workers"

      - strategy: "Cross-training"
        description: "Train backup personnel for critical roles"
        requirements:
          - "Documentation of procedures"
          - "Training program"
          - "Competency validation"
          - "Regular practice"
        applicable_to: "Key person dependencies"

      - strategy: "Alternative staffing"
        description: "Pre-arranged temporary staff agreements"
        requirements:
          - "Staffing agency contracts"
          - "Skill requirements documentation"
          - "Onboarding procedures"
          - "Security clearance process"
        applicable_to: "Volume-dependent operations"

    succession_planning:
      - "Identify critical roles"
      - "Document key responsibilities"
      - "Prepare potential successors"
      - "Maintain current authority matrix"

  process_strategies:
    manual_workarounds:
      - strategy: "Manual backup procedures"
        description: "Documented manual processes when systems unavailable"
        requirements:
          - "Procedure documentation"
          - "Forms and templates"
          - "Training"
          - "Regular practice"

      - strategy: "Reduced scope operations"
        description: "Operate at reduced capacity focusing on essentials"
        requirements:
          - "Prioritization criteria"
          - "Scaled-down procedures"
          - "Communication templates"

    process_relocation:
      - strategy: "Transfer to alternate site"
        description: "Move operations to backup location"
        requirements:
          - "Alternate site arrangement"
          - "Transportation logistics"
          - "Communication redirect"

      - strategy: "Mutual aid agreement"
        description: "Partner organization provides capacity"
        requirements:
          - "Formal agreement"
          - "Compatibility assessment"
          - "Regular coordination"

  technology_strategies:
    redundancy:
      - "High availability clustering"
      - "Load balancing"
      - "Failover automation"
      - "Data replication"

    recovery:
      - "Backup and restore"
      - "Disaster recovery site"
      - "Cloud-based recovery"
      - "Warm standby systems"

    alternatives:
      - "Manual procedures"
      - "Alternate systems"
      - "Third-party services"
      - "Paper-based backup"

  facility_strategies:
    alternate_sites:
      - type: "Company-owned alternate"
        advantages:
          - "Full control"
          - "Pre-configured"
          - "Known environment"
        disadvantages:
          - "High cost"
          - "Ongoing maintenance"

      - type: "Shared workspace"
        advantages:
          - "Lower cost"
          - "Flexible capacity"
          - "Multiple locations"
        disadvantages:
          - "Less control"
          - "Availability uncertainty"

      - type: "Work from home"
        advantages:
          - "Lowest cost"
          - "Immediate availability"
          - "Geographic distribution"
        disadvantages:
          - "Security challenges"
          - "Collaboration difficulty"
          - "Not suitable for all roles"

    mobile operations:
      - "Mobile command center"
      - "Laptop-based operations"
      - "Cloud-based systems"

  supply_chain_strategies:
    supplier_diversification:
      - "Multiple suppliers for critical inputs"
      - "Geographic diversification"
      - "Alternative products/services"

    inventory_buffers:
      - "Safety stock levels"
      - "Strategic reserves"
      - "Pre-positioned supplies"

    contractual_protections:
      - "BC requirements in contracts"
      - "Right to audit"
      - "Notification requirements"
      - "Penalty clauses"
```

### Process 3: Crisis Management Framework

```yaml
# crisis-management-framework.yaml
crisis_management:
  governance_structure:
    crisis_management_team:
      composition:
        - role: "Crisis Director"
          responsibility: "Overall crisis leadership"
          typical_position: "CEO or COO"

        - role: "Operations Lead"
          responsibility: "Business operations coordination"
          typical_position: "COO or SVP Operations"

        - role: "Communications Lead"
          responsibility: "Internal and external communications"
          typical_position: "Chief Communications Officer"

        - role: "Legal Lead"
          responsibility: "Legal and regulatory matters"
          typical_position: "General Counsel"

        - role: "HR Lead"
          responsibility: "Employee welfare and resources"
          typical_position: "CHRO"

        - role: "Finance Lead"
          responsibility: "Financial impact and resources"
          typical_position: "CFO"

        - role: "IT Lead"
          responsibility: "Technology recovery and support"
          typical_position: "CIO/CTO"

        - role: "Security Lead"
          responsibility: "Physical and cyber security"
          typical_position: "CISO or CSO"

    command_structure:
      strategic_level:
        role: "Crisis Management Team"
        focus: "Overall direction and decisions"
        location: "Executive command center"

      tactical_level:
        role: "Incident Management Teams"
        focus: "Coordinating specific response activities"
        location: "Operations center"

      operational_level:
        role: "Response Teams"
        focus: "Executing recovery activities"
        location: "Various locations"

  activation_process:
    assessment_criteria:
      level_1_monitor:
        description: "Potential situation requiring awareness"
        indicators:
          - "Early warning of potential disruption"
          - "Situation developing but not impacting"
        actions:
          - "Monitor situation"
          - "Prepare response teams"
          - "Communicate to key contacts"

      level_2_alert:
        description: "Situation likely to cause disruption"
        indicators:
          - "Disruption imminent or beginning"
          - "Limited impact occurring"
        actions:
          - "Activate incident team"
          - "Begin response procedures"
          - "Prepare crisis team"

      level_3_crisis:
        description: "Significant disruption requiring full response"
        indicators:
          - "Major operational impact"
          - "Multiple functions affected"
          - "Extended duration expected"
        actions:
          - "Activate crisis management team"
          - "Implement continuity plans"
          - "Full communication protocols"

    activation_procedure:
      - step: 1
        action: "Initial notification received"
        responsible: "On-call personnel"
        timeline: "Immediate"

      - step: 2
        action: "Situation assessment"
        responsible: "Incident coordinator"
        timeline: "15 minutes"

      - step: 3
        action: "Activation level determination"
        responsible: "Authorized manager"
        timeline: "30 minutes"

      - step: 4
        action: "Team activation"
        responsible: "Crisis coordinator"
        timeline: "Upon determination"

      - step: 5
        action: "Command center establishment"
        responsible: "Facilities/IT"
        timeline: "1 hour"

  communication_protocols:
    internal_communication:
      channels:
        - "Emergency notification system"
        - "Email"
        - "Intranet"
        - "SMS/Text"
        - "Phone tree"

      audiences:
        - "All employees"
        - "Affected employees"
        - "Management"
        - "Board of directors"

      message_types:
        - "Initial notification"
        - "Status updates"
        - "Instructions"
        - "Resolution notification"

    external_communication:
      stakeholders:
        customers:
          triggers:
            - "Service disruption"
            - "Data breach"
            - "Safety concern"
          channels:
            - "Website banner"
            - "Email notification"
            - "Social media"
            - "Account managers"

        media:
          approach: "Proactive when appropriate"
          spokesperson: "Designated only"
          approval: "Legal and communications"

        regulators:
          requirements: "Per regulatory obligations"
          timing: "Within required timeframes"
          documentation: "Formal written notification"

        investors:
          triggers:
            - "Material impact"
            - "Disclosure requirements"
          channels:
            - "SEC filing (if public)"
            - "Investor relations"

    message_templates:
      initial_incident:
        internal: |
          Subject: [INCIDENT ALERT] - {Brief Description}

          We are currently experiencing {brief description of situation}.

          What we know:
          - {Key fact 1}
          - {Key fact 2}

          What we're doing:
          - {Action 1}
          - {Action 2}

          What you should do:
          - {Employee instruction}

          Next update: {Time}
          Questions: {Contact}

      customer_notification: |
        Dear Valued Customer,

        We are writing to inform you of {situation description}.

        What happened:
        {Brief explanation}

        How this affects you:
        {Impact description}

        What we're doing:
        {Actions being taken}

        What you can do:
        {Customer actions if any}

        We sincerely apologize for any inconvenience.

        {Contact information}
```

### Process 4: Plan Maintenance and Testing

```yaml
# bc-maintenance-framework.yaml
maintenance_framework:
  plan_maintenance:
    review_triggers:
      scheduled:
        - "Annual comprehensive review"
        - "Semi-annual BIA review"
        - "Quarterly contact verification"

      event_driven:
        - "Organizational change"
        - "New system implementation"
        - "Process changes"
        - "After-action review"
        - "Regulatory changes"

    maintenance_activities:
      documentation_review:
        frequency: "Quarterly"
        scope:
          - "Procedure accuracy"
          - "Contact information"
          - "Resource lists"
          - "Dependencies"

      bia_review:
        frequency: "Annual"
        scope:
          - "Function criticality"
          - "Recovery objectives"
          - "Dependencies"
          - "Impact assessments"

      strategy_review:
        frequency: "Annual"
        scope:
          - "Strategy effectiveness"
          - "Resource adequacy"
          - "Cost optimization"
          - "Technology changes"

  testing_program:
    test_types:
      plan_review:
        frequency: "Quarterly"
        duration: "2 hours"
        participants: "Plan owners"
        objectives:
          - "Verify plan accuracy"
          - "Update contacts"
          - "Review procedures"

      tabletop_exercise:
        frequency: "Semi-annual"
        duration: "4 hours"
        participants: "Crisis team and function leaders"
        objectives:
          - "Test decision making"
          - "Identify plan gaps"
          - "Improve coordination"

      functional_exercise:
        frequency: "Annual"
        duration: "1-2 days"
        participants: "Recovery teams"
        objectives:
          - "Execute specific procedures"
          - "Validate resources"
          - "Measure capabilities"

      full_scale_exercise:
        frequency: "Every 2-3 years"
        duration: "1-3 days"
        participants: "All teams"
        objectives:
          - "Test full response"
          - "Measure end-to-end capability"
          - "Stress test organization"

    exercise_design:
      scenario_development:
        elements:
          - "Realistic trigger event"
          - "Evolving situation"
          - "Injects and complications"
          - "Success criteria"

        scenario_types:
          - "Natural disaster"
          - "Cyber incident"
          - "Pandemic"
          - "Supply chain disruption"
          - "Infrastructure failure"
          - "Civil unrest"

      exercise_documentation:
        pre_exercise:
          - "Exercise plan"
          - "Scenario details"
          - "Participant briefing"
          - "Evaluation criteria"

        during_exercise:
          - "Timeline log"
          - "Observer notes"
          - "Issue tracking"
          - "Decision log"

        post_exercise:
          - "After-action report"
          - "Lessons learned"
          - "Improvement actions"
          - "Follow-up tracking"

  continuous_improvement:
    feedback_sources:
      - "Exercise results"
      - "Actual incidents"
      - "Audit findings"
      - "Industry best practices"
      - "Regulatory changes"
      - "Stakeholder input"

    improvement_process:
      - step: "Identify improvement opportunity"
        input: "Feedback sources"

      - step: "Analyze and prioritize"
        criteria:
          - "Risk reduction"
          - "Cost/effort"
          - "Feasibility"

      - step: "Develop action plan"
        elements:
          - "Specific actions"
          - "Owners"
          - "Deadlines"
          - "Resources"

      - step: "Implement changes"
        activities:
          - "Update documentation"
          - "Train personnel"
          - "Acquire resources"

      - step: "Verify effectiveness"
        methods:
          - "Review"
          - "Testing"
          - "Audit"
```

## Tools & Templates

### Business Continuity Policy

```markdown
# Business Continuity Policy

## 1. Purpose
Establish the framework for business continuity management to ensure
organizational resilience and continued operations during disruptions.

## 2. Scope
All business functions, locations, and personnel of [Organization].

## 3. Policy Statements

### 3.1 BC Program
- Maintain enterprise business continuity program
- Conduct regular business impact analysis
- Develop and maintain continuity plans
- Test plans at least annually
- Review and update annually

### 3.2 Responsibilities
- **Executive Leadership**: Program sponsorship and resources
- **BC Manager**: Program management and coordination
- **Function Owners**: Develop and maintain function plans
- **All Employees**: Know and follow BC procedures

### 3.3 Recovery Objectives
Recovery objectives established through BIA process.
All critical functions must have documented plans.

### 3.4 Testing
- Tabletop exercises: Semi-annual
- Functional tests: Annual
- Full exercises: Every 2-3 years

## 4. Compliance
Compliance with this policy is mandatory.
Non-compliance may result in disciplinary action.

## 5. Review
Annual review or upon significant changes.
```

### BIA Questionnaire Template

```yaml
# bia-questionnaire.yaml
questionnaire:
  section_1_function_overview:
    - question: "Function name"
      type: "text"
    - question: "Department/Business unit"
      type: "text"
    - question: "Function owner"
      type: "text"
    - question: "Describe the function's purpose"
      type: "text"

  section_2_criticality:
    - question: "What is the financial impact if this function is unavailable for 1 hour?"
      type: "currency"
    - question: "What is the financial impact if unavailable for 24 hours?"
      type: "currency"
    - question: "Are there regulatory requirements for this function?"
      type: "yes_no_explain"
    - question: "What is the reputational impact of disruption?"
      type: "scale_1_5"

  section_3_recovery:
    - question: "What is the maximum acceptable downtime?"
      type: "duration"
    - question: "What is the maximum acceptable data loss?"
      type: "duration"
    - question: "What is the minimum service level during disruption?"
      type: "percentage"

  section_4_dependencies:
    - question: "What IT systems does this function require?"
      type: "list"
    - question: "What other internal functions does this depend on?"
      type: "list"
    - question: "What external suppliers/vendors are required?"
      type: "list"
    - question: "What minimum staff is required to operate?"
      type: "number"

  section_5_workarounds:
    - question: "Can this function operate manually?"
      type: "yes_no_explain"
    - question: "Can this function be performed from alternate location?"
      type: "yes_no_explain"
    - question: "What workarounds currently exist?"
      type: "text"
```

## Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| BIA Coverage | 100% | Functions with current BIA |
| Plan Coverage | 100% | Critical functions with plans |
| Plan Currency | <12 months | Age of last plan update |
| Test Completion | 100% | Scheduled tests completed |
| Test Success Rate | >90% | Successful test outcomes |
| Recovery Objective Met | 100% | Actual vs target RTO/RPO |
| Training Completion | 100% | Required training completed |
| Exercise Participation | >90% | Required participants involved |

## Common Pitfalls

1. **IT-Only Focus**: Treating BC as purely a technology issue
   - *Solution*: Address people, process, and facility dependencies

2. **Plan Shelfware**: Plans created but never used or updated
   - *Solution*: Regular testing and maintenance program

3. **Incomplete BIA**: Missing critical dependencies or impacts
   - *Solution*: Thorough, structured BIA process

4. **Unrealistic Objectives**: RTOs that cannot be achieved
   - *Solution*: Validate objectives through testing

5. **Single Point of Failure**: Key person or resource dependencies
   - *Solution*: Cross-training and redundancy planning

6. **Vendor Assumptions**: Assuming third parties have BC capability
   - *Solution*: Vendor BC assessment and contractual requirements

## Integration Points

- **Disaster Recovery**: IT system recovery coordination
- **Emergency Management**: Life safety and facility response
- **Risk Management**: Risk identification and treatment
- **Crisis Communications**: Stakeholder notification
- **HR Systems**: Employee safety and workforce management
- **Supply Chain Management**: Vendor continuity
- **Insurance**: Coverage and claims management
- **Regulatory Compliance**: Reporting and documentation requirements
