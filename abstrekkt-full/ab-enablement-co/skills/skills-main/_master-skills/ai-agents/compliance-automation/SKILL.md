---
name: compliance-automation
description: Comprehensive compliance automation implementation and continuous compliance monitoring. Use when automating compliance controls, implementing continuous compliance monitoring, integrating compliance into CI/CD pipelines, or building compliance-as-code frameworks.
---

# Compliance Automation

## Overview

Compliance automation transforms manual, point-in-time compliance activities into continuous, automated processes that verify and enforce regulatory requirements in real-time. It bridges the gap between security controls and compliance evidence, reducing audit burden while improving compliance posture.

Modern compliance automation leverages infrastructure-as-code, policy-as-code, and continuous monitoring to maintain compliance across dynamic cloud environments. It integrates with DevOps pipelines, cloud platforms, and governance tools to embed compliance into operational workflows.

The discipline addresses multiple compliance frameworks including SOC 2, PCI-DSS, HIPAA, GDPR, ISO 27001, and FedRAMP, enabling organizations to map controls to multiple standards and demonstrate compliance through automated evidence collection.

### Why This Matters

- **Continuous Assurance**: Real-time visibility into compliance status
- **Audit Efficiency**: Automated evidence collection reduces audit preparation
- **Risk Reduction**: Immediate detection of compliance drift
- **Cost Savings**: Reduce manual compliance activities by 60-80%
- **Scalability**: Maintain compliance across expanding infrastructure
- **Developer Velocity**: Shift compliance left without slowing delivery

## When to Use

### Primary Triggers

- Preparing for SOC 2 or ISO 27001 certification
- Implementing cloud compliance monitoring
- Integrating compliance into CI/CD pipelines
- Responding to audit findings on control gaps
- Scaling compliance across multiple frameworks
- Reducing manual compliance burden

### Specific Use Cases

1. **Policy-as-Code**: Automated policy enforcement in infrastructure
2. **Continuous Monitoring**: Real-time compliance status dashboards
3. **Evidence Collection**: Automated audit artifact gathering
4. **Drift Detection**: Identifying configuration changes affecting compliance
5. **Control Mapping**: Multi-framework compliance alignment
6. **Remediation Automation**: Auto-fixing compliance violations

## Core Processes

### Process 1: Compliance Framework Mapping

Map controls across multiple compliance frameworks for unified management.

```yaml
# compliance-control-mapping.yaml
control_mapping:
  unified_control_framework:
    - control_id: "UCF-AC-001"
      name: "User Access Management"
      description: "Ensure user access is provisioned and deprovisioned appropriately"

      framework_mappings:
        soc2:
          criteria: "CC6.1"
          description: "Logical access security"

        iso27001:
          control: "A.9.2.1"
          description: "User registration and de-registration"

        pci_dss:
          requirement: "8.1.1"
          description: "Unique user identification"

        hipaa:
          standard: "164.312(a)(2)(i)"
          description: "Unique user identification"

        nist_csf:
          subcategory: "PR.AC-1"
          description: "Identities and credentials are issued"

      automated_checks:
        - check: "all_users_have_unique_ids"
          tool: "aws_config"
          rule: "iam-user-no-policies-check"

        - check: "mfa_enabled_all_users"
          tool: "aws_config"
          rule: "iam-user-mfa-enabled"

        - check: "inactive_users_disabled"
          tool: "custom_lambda"
          threshold: "90_days"

      evidence_sources:
        - "IAM user list with creation dates"
        - "MFA enrollment report"
        - "Access review certifications"
        - "Termination procedure documentation"

    - control_id: "UCF-CM-001"
      name: "Configuration Management"
      description: "Maintain secure baseline configurations"

      framework_mappings:
        soc2:
          criteria: "CC7.1"
          description: "System configurations"

        iso27001:
          control: "A.12.5.1"
          description: "Installation of software on operational systems"

        pci_dss:
          requirement: "2.2"
          description: "Configuration standards for system components"

        cis:
          benchmark: "Multiple"
          description: "CIS Benchmark controls"

      automated_checks:
        - check: "cis_benchmark_compliance"
          tool: "aws_security_hub"
          standard: "CIS AWS Foundations"

        - check: "encryption_at_rest"
          tool: "aws_config"
          rule: "ec2-ebs-encryption-by-default"

        - check: "approved_ami_only"
          tool: "aws_config"
          rule: "approved-amis-by-id"

      evidence_sources:
        - "Configuration scan results"
        - "Hardening standard documentation"
        - "Change management records"
        - "Golden image documentation"
```

### Process 2: Policy-as-Code Implementation

```yaml
# policy-as-code-framework.yaml
policy_as_code:
  infrastructure_policies:
    aws_config_rules:
      - rule_name: "s3-bucket-public-read-prohibited"
        description: "Ensure S3 buckets are not publicly readable"
        compliance_frameworks: ["SOC2", "PCI-DSS", "HIPAA"]
        remediation:
          type: "automatic"
          action: "lambda_function"
          function: "remediate-s3-public-access"

      - rule_name: "encrypted-volumes"
        description: "Ensure EBS volumes are encrypted"
        compliance_frameworks: ["SOC2", "PCI-DSS", "HIPAA", "GDPR"]
        remediation:
          type: "manual"
          action: "Create encrypted snapshot and replace"

      - rule_name: "rds-storage-encrypted"
        description: "Ensure RDS instances are encrypted"
        compliance_frameworks: ["SOC2", "PCI-DSS", "HIPAA"]
        remediation:
          type: "manual"
          action: "Enable encryption on new instances"

    open_policy_agent:
      policies:
        - name: "require-encryption"
          description: "All resources must have encryption enabled"
          rego: |
            package terraform.encryption

            deny[msg] {
              resource := input.resource_changes[_]
              resource.type == "aws_s3_bucket"
              not resource.change.after.server_side_encryption_configuration
              msg := sprintf("S3 bucket %v must have encryption enabled", [resource.address])
            }

        - name: "require-tags"
          description: "All resources must have required tags"
          rego: |
            package terraform.tagging

            required_tags := {"Environment", "Owner", "CostCenter", "DataClassification"}

            deny[msg] {
              resource := input.resource_changes[_]
              tags := object.get(resource.change.after, "tags", {})
              missing := required_tags - {t | tags[t]}
              count(missing) > 0
              msg := sprintf("Resource %v is missing required tags: %v", [resource.address, missing])
            }

        - name: "restrict-public-access"
          description: "Prevent public access to sensitive resources"
          rego: |
            package terraform.network

            deny[msg] {
              resource := input.resource_changes[_]
              resource.type == "aws_security_group_rule"
              resource.change.after.cidr_blocks[_] == "0.0.0.0/0"
              resource.change.after.from_port <= 22
              resource.change.after.to_port >= 22
              msg := sprintf("Security group %v allows public SSH access", [resource.address])
            }

  ci_cd_integration:
    pre_commit:
      - tool: "tflint"
        purpose: "Terraform linting"
      - tool: "checkov"
        purpose: "Infrastructure security scanning"
      - tool: "tfsec"
        purpose: "Terraform security analysis"

    pull_request:
      - tool: "terraform_plan"
        purpose: "Preview infrastructure changes"
      - tool: "opa_conftest"
        purpose: "Policy validation"
      - tool: "infracost"
        purpose: "Cost estimation"

    pre_deploy:
      - tool: "terraform_sentinel"
        purpose: "Enterprise policy enforcement"
      - tool: "aws_service_control_policies"
        purpose: "Organization-level guardrails"

    post_deploy:
      - tool: "aws_config"
        purpose: "Continuous compliance monitoring"
      - tool: "security_hub"
        purpose: "Security findings aggregation"
```

### Process 3: Continuous Compliance Monitoring

```yaml
# continuous-compliance-monitoring.yaml
monitoring_framework:
  compliance_dashboards:
    executive_dashboard:
      refresh: "Real-time"
      metrics:
        - name: "Overall Compliance Score"
          calculation: "Compliant controls / Total controls * 100"
          target: ">95%"
          display: "Gauge"

        - name: "Critical Findings"
          calculation: "Count of critical non-compliant controls"
          target: "0"
          display: "Counter with trend"

        - name: "Compliance by Framework"
          calculation: "Score per framework"
          display: "Bar chart"

        - name: "Remediation Velocity"
          calculation: "Average time to remediate findings"
          target: "<7 days"
          display: "Trend line"

    technical_dashboard:
      refresh: "5 minutes"
      views:
        - name: "Control Status"
          grouping: ["Framework", "Control family", "Resource type"]
          filters: ["Compliant", "Non-compliant", "Unknown"]

        - name: "Resource Compliance"
          grouping: ["Account", "Region", "Resource type"]
          details: ["Resource ID", "Control", "Status", "Last evaluated"]

        - name: "Drift Detection"
          content: "Configuration changes affecting compliance"
          timeframe: "Last 24 hours"

  alerting:
    critical_alerts:
      - condition: "Critical control becomes non-compliant"
        channels: ["PagerDuty", "Slack-security"]
        sla: "Acknowledge within 15 minutes"

      - condition: "Public exposure detected"
        channels: ["PagerDuty", "Slack-security", "Email-security-team"]
        sla: "Remediate within 1 hour"

    warning_alerts:
      - condition: "Compliance score drops below 95%"
        channels: ["Slack-compliance", "Email-compliance-team"]
        sla: "Review within 4 hours"

      - condition: "New high-severity finding"
        channels: ["Slack-security"]
        sla: "Triage within 24 hours"

    informational_alerts:
      - condition: "Daily compliance summary"
        channels: ["Email-stakeholders"]
        schedule: "08:00 daily"

      - condition: "Weekly trend report"
        channels: ["Email-leadership"]
        schedule: "Monday 09:00"

  evidence_collection:
    automated_artifacts:
      - type: "Configuration snapshots"
        source: "AWS Config"
        frequency: "On change"
        retention: "7 years"

      - type: "Access reviews"
        source: "Identity governance platform"
        frequency: "Quarterly"
        retention: "7 years"

      - type: "Vulnerability scans"
        source: "Inspector, Qualys"
        frequency: "Weekly"
        retention: "3 years"

      - type: "Security findings"
        source: "Security Hub"
        frequency: "Real-time"
        retention: "3 years"

      - type: "Audit logs"
        source: "CloudTrail"
        frequency: "Continuous"
        retention: "7 years"

    evidence_repository:
      storage: "S3 with versioning"
      encryption: "AES-256"
      access: "Audit team read-only"
      indexing: "By control, framework, and date"
```

### Process 4: Automated Remediation

```yaml
# automated-remediation-framework.yaml
remediation_automation:
  remediation_types:
    automatic:
      description: "Fix applied immediately without approval"
      use_cases:
        - "S3 bucket made public - immediately block"
        - "Security group opens SSH to internet - immediately restrict"
        - "IAM user without MFA created - send setup notification"

      safeguards:
        - "Whitelist of approved automatic actions"
        - "Logging of all automatic remediation"
        - "Alerting on automatic remediation execution"
        - "Ability to exclude specific resources"

    semi_automatic:
      description: "Fix prepared but requires approval"
      use_cases:
        - "Encryption not enabled - prepare migration plan"
        - "Unused IAM credentials - prepare for deletion"
        - "Non-compliant configuration - prepare fix"

      workflow:
        - "Finding detected"
        - "Remediation plan generated"
        - "Approval requested from owner"
        - "Remediation executed upon approval"
        - "Verification performed"

    manual:
      description: "Human analysis and action required"
      use_cases:
        - "Complex architectural changes"
        - "Business process changes"
        - "Third-party coordination required"

  remediation_playbooks:
    s3_public_access:
      trigger: "aws_config:s3-bucket-public-read-prohibited"
      severity: "Critical"
      auto_remediate: true

      steps:
        - action: "Block public access"
          command: |
            aws s3api put-public-access-block \
              --bucket ${bucket_name} \
              --public-access-block-configuration \
              "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

        - action: "Remove public ACLs"
          command: |
            aws s3api put-bucket-acl \
              --bucket ${bucket_name} \
              --acl private

        - action: "Notify bucket owner"
          notification:
            channel: "email"
            recipient: "resource_owner"
            template: "s3_public_access_remediated"

      verification:
        - "Confirm public access blocked"
        - "Verify no public ACLs remain"
        - "Check bucket policy for public grants"

    unencrypted_ebs:
      trigger: "aws_config:encrypted-volumes"
      severity: "High"
      auto_remediate: false

      steps:
        - action: "Create encrypted snapshot"
          description: "Create snapshot of unencrypted volume"

        - action: "Create encrypted volume from snapshot"
          description: "Create new encrypted volume"

        - action: "Stop instance"
          requires_approval: true
          description: "Stop instance for volume swap"

        - action: "Detach unencrypted volume"
          description: "Detach original volume"

        - action: "Attach encrypted volume"
          description: "Attach new encrypted volume"

        - action: "Start instance"
          description: "Restart instance"

        - action: "Verify functionality"
          description: "Confirm instance operates correctly"

        - action: "Delete unencrypted volume"
          requires_approval: true
          description: "Remove original unencrypted volume"
```

## Tools & Templates

### Compliance Status Report Template

```markdown
# Compliance Status Report

**Report Date:** [Date]
**Reporting Period:** [Start Date] - [End Date]
**Prepared By:** [Name/Team]

## Executive Summary

### Overall Compliance Score: [X]%

| Framework | Score | Trend | Critical Findings |
|-----------|-------|-------|-------------------|
| SOC 2 | 96% | +2% | 0 |
| PCI-DSS | 94% | -1% | 1 |
| HIPAA | 97% | +1% | 0 |
| ISO 27001 | 95% | 0% | 0 |

### Key Highlights
- [Highlight 1]
- [Highlight 2]
- [Highlight 3]

### Critical Issues Requiring Attention
1. [Issue description and remediation status]

## Detailed Findings

### New Findings This Period
| Finding | Severity | Framework | Owner | Due Date |
|---------|----------|-----------|-------|----------|
| | | | | |

### Remediated Findings
| Finding | Severity | Days to Remediate |
|---------|----------|-------------------|
| | | |

### Open Findings Aging
| Age | Critical | High | Medium | Low |
|-----|----------|------|--------|-----|
| 0-7 days | | | | |
| 8-30 days | | | | |
| 31-90 days | | | | |
| >90 days | | | | |

## Control Performance

### Top Performing Controls
1. [Control] - 100% compliance
2. [Control] - 100% compliance

### Controls Requiring Improvement
1. [Control] - [X]% compliance - [Action]
2. [Control] - [X]% compliance - [Action]

## Recommendations
1. [Recommendation]
2. [Recommendation]

## Next Steps
- [ ] [Action item]
- [ ] [Action item]
```

### Compliance Automation Architecture

```yaml
# compliance-automation-architecture.yaml
architecture:
  data_sources:
    cloud_providers:
      aws:
        - "AWS Config"
        - "CloudTrail"
        - "Security Hub"
        - "GuardDuty"
        - "Inspector"
      azure:
        - "Azure Policy"
        - "Microsoft Defender"
        - "Azure Monitor"
      gcp:
        - "Security Command Center"
        - "Cloud Asset Inventory"

    saas_applications:
      - "SSO provider logs"
      - "SaaS security posture"

    endpoints:
      - "EDR telemetry"
      - "Configuration management"

  processing_layer:
    normalization:
      purpose: "Standardize data formats"
      technology: "Data transformation pipeline"

    control_evaluation:
      purpose: "Evaluate against control requirements"
      technology: "Policy engine (OPA, custom)"

    evidence_storage:
      purpose: "Store compliance evidence"
      technology: "Object storage with retention"

  presentation_layer:
    dashboards:
      purpose: "Visualize compliance status"
      technology: "BI platform, custom dashboards"

    reporting:
      purpose: "Generate compliance reports"
      technology: "Report automation"

    alerting:
      purpose: "Notify on compliance issues"
      technology: "Alert management platform"

  integration_points:
    ticketing:
      purpose: "Track remediation"
      integration: "Two-way sync"

    ci_cd:
      purpose: "Prevent non-compliant deployments"
      integration: "Pipeline gates"

    grc_platform:
      purpose: "Enterprise GRC integration"
      integration: "API data push"
```

## Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Overall Compliance Score | >95% | Automated control evaluation |
| Critical Finding Count | 0 | Real-time monitoring |
| Mean Time to Detect | <1 hour | Finding detection latency |
| Mean Time to Remediate | <7 days | Finding to closure |
| Automation Coverage | >80% | Automated vs manual controls |
| False Positive Rate | <5% | Invalid findings |
| Evidence Collection Rate | 100% | Automated evidence capture |
| Audit Prep Time | <5 days | Time to prepare for audit |

## Common Pitfalls

1. **Tool Overload**: Implementing too many tools without integration
   - *Solution*: Consolidate through unified compliance platform

2. **Alert Fatigue**: Too many low-priority alerts
   - *Solution*: Risk-based alerting with proper thresholds

3. **Checkbox Compliance**: Meeting requirements without security value
   - *Solution*: Focus on security outcomes, not just compliance

4. **Stale Policies**: Policies not updated as environment changes
   - *Solution*: Policy review cycles tied to change management

5. **Manual Evidence**: Still collecting evidence manually
   - *Solution*: Automate evidence collection from the start

6. **Siloed Compliance**: Different teams managing different frameworks
   - *Solution*: Unified control framework with central management

## Integration Points

- **Cloud Security Posture Management (CSPM)**: Native cloud compliance
- **Security Information and Event Management (SIEM)**: Log-based compliance
- **Governance, Risk, and Compliance (GRC)**: Enterprise compliance management
- **CI/CD Pipelines**: Compliance gates in deployment
- **Configuration Management**: Infrastructure compliance
- **Identity Governance**: Access compliance automation
- **Ticketing Systems**: Remediation workflow tracking
