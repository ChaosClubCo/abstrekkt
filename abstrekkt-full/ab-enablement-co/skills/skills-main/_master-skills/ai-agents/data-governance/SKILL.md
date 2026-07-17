---
name: data-governance
description: Comprehensive data governance framework implementation and management. Use when establishing data policies, defining data ownership, implementing data quality controls, creating data catalogs, or ensuring regulatory data compliance.
---

# Data Governance

## Overview

Data governance is the framework of policies, processes, and standards that ensures data assets are managed as valuable organizational resources. It establishes accountability for data quality, security, and usage while enabling data-driven decision making across the enterprise.

Effective data governance balances control with accessibility, ensuring data is protected while remaining available to authorized users for legitimate business purposes. It encompasses data quality management, metadata management, data lineage tracking, privacy compliance, and lifecycle management.

Modern data governance extends beyond traditional database management to include cloud data platforms, data lakes, streaming data, and AI/ML training datasets. Organizations must navigate complex regulatory landscapes including GDPR, CCPA, HIPAA, and industry-specific requirements while maximizing data value.

### Why This Matters

- **Regulatory Compliance**: Avoid penalties from data protection regulations
- **Data Quality**: Ensure decisions are based on accurate, consistent data
- **Risk Management**: Reduce exposure from data breaches or misuse
- **Operational Efficiency**: Eliminate duplicate efforts and data silos
- **Trust Building**: Establish confidence in data-driven insights
- **Cost Optimization**: Reduce storage and processing costs through lifecycle management

## When to Use

### Primary Triggers

- Establishing enterprise data management programs
- Responding to regulatory compliance requirements
- Addressing data quality issues affecting business operations
- Implementing data catalogs or metadata management systems
- Defining data retention and archival policies
- Resolving data ownership disputes

### Specific Use Cases

1. **Data Classification**: Categorizing data by sensitivity and business value
2. **Data Quality Programs**: Establishing measurement and improvement processes
3. **Privacy Impact Assessments**: Evaluating data processing activities
4. **Data Lineage Mapping**: Tracking data flow through systems
5. **Master Data Management**: Establishing golden records
6. **Data Access Governance**: Controlling who can access what data

## Core Processes

### Process 1: Data Classification Framework

Establish consistent data categorization across the organization.

```yaml
# data-classification-schema.yaml
classification_framework:
  sensitivity_levels:
    - level: public
      code: P
      description: "Data intended for public consumption"
      examples:
        - "Marketing materials"
        - "Published financial reports"
        - "Public website content"
      controls:
        encryption_at_rest: optional
        encryption_in_transit: recommended
        access_logging: recommended
        retention: "Per business need"

    - level: internal
      code: I
      description: "Data for internal business use"
      examples:
        - "Internal communications"
        - "Operational procedures"
        - "Non-sensitive business data"
      controls:
        encryption_at_rest: required
        encryption_in_transit: required
        access_logging: required
        retention: "7 years"

    - level: confidential
      code: C
      description: "Sensitive business data"
      examples:
        - "Financial projections"
        - "Strategic plans"
        - "Employee records"
      controls:
        encryption_at_rest: required
        encryption_in_transit: required
        access_logging: required
        dlp_enabled: true
        retention: "10 years"

    - level: restricted
      code: R
      description: "Highly sensitive regulated data"
      examples:
        - "PII/PHI data"
        - "Payment card data"
        - "Authentication credentials"
      controls:
        encryption_at_rest: required_aes256
        encryption_in_transit: required_tls13
        access_logging: required_immutable
        dlp_enabled: true
        masking_required: true
        retention: "Per regulation"
        access_approval: required

  data_categories:
    - category: personal_data
      subcategories:
        - name: "Identifiers"
          examples: ["Name", "Email", "Phone", "SSN"]
          default_classification: restricted
        - name: "Demographic"
          examples: ["Age", "Gender", "Location"]
          default_classification: confidential
        - name: "Behavioral"
          examples: ["Purchase history", "Browsing data"]
          default_classification: confidential

    - category: financial_data
      subcategories:
        - name: "Payment"
          examples: ["Credit cards", "Bank accounts"]
          default_classification: restricted
        - name: "Transactional"
          examples: ["Invoices", "Orders"]
          default_classification: confidential
        - name: "Reporting"
          examples: ["Revenue", "Forecasts"]
          default_classification: confidential
```

### Process 2: Data Ownership Model

Define accountability structures for data assets.

```yaml
# data-ownership-model.yaml
ownership_model:
  roles:
    data_owner:
      description: "Business executive accountable for data domain"
      responsibilities:
        - "Define data quality requirements"
        - "Approve access requests"
        - "Ensure regulatory compliance"
        - "Resolve data disputes"
      authority:
        - "Final decision on data usage"
        - "Budget allocation for data initiatives"
      accountability:
        - "Data quality metrics"
        - "Compliance audit findings"

    data_steward:
      description: "Business expert managing daily data operations"
      responsibilities:
        - "Maintain data definitions"
        - "Monitor data quality"
        - "Coordinate issue resolution"
        - "Document business rules"
      authority:
        - "Approve metadata changes"
        - "Escalate quality issues"
      accountability:
        - "Data quality scores"
        - "Metadata completeness"

    data_custodian:
      description: "Technical role managing data infrastructure"
      responsibilities:
        - "Implement security controls"
        - "Manage storage and backup"
        - "Execute retention policies"
        - "Maintain access controls"
      authority:
        - "Technical architecture decisions"
        - "Tool selection recommendations"
      accountability:
        - "System availability"
        - "Security compliance"

    data_consumer:
      description: "Business user accessing data for work"
      responsibilities:
        - "Use data per policies"
        - "Report quality issues"
        - "Complete required training"
        - "Protect data appropriately"
      authority:
        - "Request data access"
        - "Provide quality feedback"
      accountability:
        - "Policy compliance"
        - "Training completion"

  domain_assignments:
    - domain: customer
      data_owner: "Chief Customer Officer"
      data_stewards:
        - "Customer Data Manager"
        - "CRM Administrator"
      scope:
        - "Customer master data"
        - "Interaction history"
        - "Preferences and consent"

    - domain: financial
      data_owner: "Chief Financial Officer"
      data_stewards:
        - "Financial Data Manager"
        - "Revenue Operations Lead"
      scope:
        - "Transaction records"
        - "Financial reporting data"
        - "Billing information"

    - domain: employee
      data_owner: "Chief Human Resources Officer"
      data_stewards:
        - "HR Data Manager"
        - "Payroll Administrator"
      scope:
        - "Employee records"
        - "Compensation data"
        - "Performance data"
```

### Process 3: Data Quality Framework

```yaml
# data-quality-framework.yaml
quality_dimensions:
  - dimension: accuracy
    definition: "Data correctly represents real-world entity"
    measurement: "Error rate in validated samples"
    target: ">99%"
    validation_rules:
      - rule: "Email format validation"
        regex: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
      - rule: "Phone number format"
        regex: "^\\+?[1-9]\\d{1,14}$"
      - rule: "Date range validation"
        logic: "birth_date < current_date AND birth_date > '1900-01-01'"

  - dimension: completeness
    definition: "Required data elements are populated"
    measurement: "Percentage of non-null required fields"
    target: ">98%"
    validation_rules:
      - rule: "Required field check"
        fields: ["customer_id", "email", "created_date"]
      - rule: "Conditional completeness"
        logic: "IF order_type='subscription' THEN renewal_date IS NOT NULL"

  - dimension: consistency
    definition: "Data values align across systems"
    measurement: "Cross-system match rate"
    target: ">97%"
    validation_rules:
      - rule: "Cross-reference validation"
        logic: "customer.id EXISTS IN orders.customer_id"
      - rule: "Domain consistency"
        logic: "status IN ('active', 'inactive', 'pending')"

  - dimension: timeliness
    definition: "Data is available when needed"
    measurement: "Data latency from source to target"
    target: "<15 minutes"
    validation_rules:
      - rule: "Freshness check"
        logic: "last_updated > CURRENT_TIMESTAMP - INTERVAL '1 hour'"
      - rule: "Processing SLA"
        logic: "processing_time < defined_sla"

  - dimension: uniqueness
    definition: "No unintended duplicate records"
    measurement: "Duplicate rate"
    target: "<0.1%"
    validation_rules:
      - rule: "Primary key uniqueness"
        logic: "COUNT(DISTINCT id) = COUNT(*)"
      - rule: "Business key uniqueness"
        logic: "No duplicates on (email, account_type)"

quality_scorecard:
  calculation: |
    Overall Score = (
      accuracy_score * 0.25 +
      completeness_score * 0.25 +
      consistency_score * 0.20 +
      timeliness_score * 0.15 +
      uniqueness_score * 0.15
    )
  thresholds:
    excellent: ">95%"
    good: "90-95%"
    acceptable: "85-90%"
    poor: "<85%"
```

### Process 4: Data Catalog Structure

```yaml
# data-catalog-schema.yaml
catalog_entry:
  technical_metadata:
    - field: source_system
      type: string
      required: true
      description: "Originating system name"
    - field: database_name
      type: string
      required: true
    - field: schema_name
      type: string
      required: true
    - field: table_name
      type: string
      required: true
    - field: column_definitions
      type: array
      required: true
      schema:
        - name: string
        - data_type: string
        - nullable: boolean
        - primary_key: boolean
        - foreign_key: reference

  business_metadata:
    - field: business_name
      type: string
      required: true
      description: "Human-readable name"
    - field: business_description
      type: text
      required: true
    - field: data_domain
      type: enum
      required: true
      values: ["customer", "financial", "product", "employee"]
    - field: data_owner
      type: reference
      required: true
    - field: data_steward
      type: reference
      required: true
    - field: business_glossary_terms
      type: array
      required: false

  operational_metadata:
    - field: classification
      type: enum
      required: true
      values: ["public", "internal", "confidential", "restricted"]
    - field: retention_period
      type: duration
      required: true
    - field: refresh_frequency
      type: enum
      required: true
      values: ["real-time", "hourly", "daily", "weekly", "monthly"]
    - field: quality_score
      type: decimal
      required: false
    - field: usage_statistics
      type: object
      required: false

  lineage_metadata:
    - field: upstream_sources
      type: array
      required: true
    - field: downstream_consumers
      type: array
      required: false
    - field: transformation_logic
      type: text
      required: false
    - field: etl_job_reference
      type: reference
      required: false
```

## Tools & Templates

### Data Governance Policy Template

```markdown
# Data Governance Policy

## 1. Purpose
This policy establishes the framework for managing [Organization]'s data assets
to ensure quality, security, and compliance with regulatory requirements.

## 2. Scope
This policy applies to all data created, collected, stored, processed, or
transmitted by [Organization], including data managed by third parties.

## 3. Data Classification
All data must be classified according to the Data Classification Framework:
- **Public**: No restrictions on access
- **Internal**: Available to all employees
- **Confidential**: Restricted to authorized personnel
- **Restricted**: Strict need-to-know basis

## 4. Roles and Responsibilities
### 4.1 Data Governance Council
- Approve governance policies
- Resolve cross-domain disputes
- Prioritize governance initiatives

### 4.2 Data Owners
- Define data requirements
- Approve access requests
- Ensure compliance

### 4.3 Data Stewards
- Maintain data quality
- Manage metadata
- Coordinate issues

## 5. Data Quality Standards
- Accuracy: >99%
- Completeness: >98%
- Timeliness: Per SLA
- Consistency: >97%

## 6. Compliance Requirements
- GDPR: EU personal data
- CCPA: California residents
- HIPAA: Health information
- PCI-DSS: Payment cards

## 7. Enforcement
Violations may result in disciplinary action up to termination.

## 8. Review
This policy will be reviewed annually or upon significant changes.
```

### Data Request Workflow

```yaml
# data-access-request-workflow.yaml
workflow:
  name: "Data Access Request"
  stages:
    - stage: request_submission
      actions:
        - "User completes access request form"
        - "System validates required fields"
        - "Request logged in governance system"
      outputs:
        - "Request ticket created"
        - "Notification to data steward"

    - stage: initial_review
      actor: data_steward
      sla: "2 business days"
      actions:
        - "Verify business justification"
        - "Confirm data classification"
        - "Check existing access"
      decisions:
        approve: "Route to data owner"
        reject: "Return with explanation"
        clarify: "Request more information"

    - stage: owner_approval
      actor: data_owner
      sla: "3 business days"
      condition: "classification IN ('confidential', 'restricted')"
      actions:
        - "Review business need"
        - "Assess risk implications"
        - "Document approval decision"
      decisions:
        approve: "Route to provisioning"
        reject: "Close request"

    - stage: access_provisioning
      actor: data_custodian
      sla: "1 business day"
      actions:
        - "Create access credentials"
        - "Configure permissions"
        - "Update access registry"
      outputs:
        - "Access granted notification"
        - "Audit log entry"

    - stage: periodic_review
      frequency: "quarterly"
      actions:
        - "Validate continued need"
        - "Recertify or revoke"
```

## Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Data Quality Score | >95% | Automated quality checks |
| Catalog Coverage | >90% | Cataloged vs total assets |
| Metadata Completeness | >95% | Required fields populated |
| Policy Compliance | >98% | Audit findings |
| Access Request SLA | <5 days | Request to provisioning |
| Data Incident Rate | <2/month | Reported data issues |
| Training Completion | 100% | Required training |
| Lineage Documentation | >85% | Traced data flows |

## Common Pitfalls

1. **Boiling the Ocean**: Trying to govern all data simultaneously
   - *Solution*: Start with critical data domains and expand

2. **Technology-First Approach**: Buying tools before defining processes
   - *Solution*: Establish governance model before tool selection

3. **Lack of Executive Sponsorship**: Governance seen as IT initiative
   - *Solution*: Position as business enabler with C-level champion

4. **Unclear Ownership**: No accountability for data quality
   - *Solution*: Define clear RACI matrix with named individuals

5. **Static Policies**: Governance doesn't evolve with business
   - *Solution*: Regular policy reviews and update cycles

6. **Compliance-Only Focus**: Missing business value opportunities
   - *Solution*: Balance compliance with data enablement

## Integration Points

- **Data Catalogs**: Collibra, Alation, Azure Purview
- **Data Quality Tools**: Great Expectations, Informatica, Talend
- **Master Data Management**: Informatica MDM, Reltio
- **Privacy Platforms**: OneTrust, BigID, Privacera
- **Identity Management**: Integration for access control
- **SIEM Systems**: Security event correlation
- **Compliance Systems**: Audit trail and reporting
