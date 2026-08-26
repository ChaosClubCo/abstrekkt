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


## References
- `references/process-3-crisis-management-framework.md` — Process 3: Crisis Management Framework
- `references/references.md` — References
- `references/tools-templates.md` — Tools & Templates
