---
name: backup-strategies
description: Comprehensive backup strategy design and implementation for enterprise systems. Use when designing backup architectures, defining RPO/RTO requirements, implementing backup automation, planning data recovery procedures, or evaluating backup solutions.
---

# Backup Strategies

## Overview

Backup strategies encompass the policies, procedures, and technologies used to protect organizational data from loss, corruption, or unavailability. A well-designed backup strategy balances data protection requirements with operational constraints, cost considerations, and recovery objectives.

Modern backup strategies must address diverse data types across on-premises infrastructure, cloud platforms, SaaS applications, and hybrid environments. They must account for ransomware threats, compliance requirements, and the exponential growth of data volumes while maintaining recovery capabilities within business-defined timeframes.

Effective backup architecture considers not just data capture but the entire recovery lifecycle, including verification, testing, cataloging, and the ability to restore at granular levels from individual files to complete systems. The strategy must align with broader business continuity and disaster recovery objectives.

### Why This Matters

- **Data Protection**: Safeguard against accidental deletion, corruption, and disasters
- **Ransomware Defense**: Maintain clean recovery points immune to encryption attacks
- **Compliance**: Meet regulatory requirements for data retention and availability
- **Business Continuity**: Enable rapid recovery to minimize operational disruption
- **Cost Optimization**: Balance protection levels with storage and operational costs
- **Peace of Mind**: Confidence that critical data can be recovered when needed

## When to Use

### Primary Triggers

- Designing new backup infrastructure
- Migrating to cloud-based backup solutions
- Responding to ransomware or data loss incidents
- Meeting new compliance requirements
- Optimizing backup costs and performance
- Planning for new application deployments

### Specific Use Cases

1. **Database Backup**: Transaction-consistent database protection
2. **File Server Backup**: Unstructured data protection
3. **Virtual Machine Backup**: Full VM and application-consistent backups
4. **Cloud Workload Backup**: AWS, Azure, GCP resource protection
5. **SaaS Backup**: Microsoft 365, Salesforce, Google Workspace
6. **Container Backup**: Kubernetes persistent volume protection

## Core Processes

### Process 1: RPO/RTO Analysis

Define recovery objectives based on business requirements.

```yaml
# recovery-objectives-assessment.yaml
recovery_analysis:
  business_impact_levels:
    - level: critical
      description: "Core business operations, revenue-generating systems"
      rpo_target: "15 minutes"
      rto_target: "1 hour"
      examples:
        - "E-commerce platform"
        - "Core banking system"
        - "Manufacturing execution system"
      backup_strategy:
        type: "continuous_data_protection"
        frequency: "real-time"
        retention: "30 days granular, 1 year daily"
        replicas: 3
        offsite: true

    - level: high
      description: "Important business functions, customer-facing systems"
      rpo_target: "1 hour"
      rto_target: "4 hours"
      examples:
        - "CRM system"
        - "Email platform"
        - "HR management system"
      backup_strategy:
        type: "near_continuous"
        frequency: "hourly"
        retention: "14 days hourly, 1 year daily"
        replicas: 2
        offsite: true

    - level: medium
      description: "Departmental systems, productivity tools"
      rpo_target: "4 hours"
      rto_target: "24 hours"
      examples:
        - "Project management tools"
        - "Development environments"
        - "Internal wikis"
      backup_strategy:
        type: "scheduled"
        frequency: "every_4_hours"
        retention: "7 days frequent, 90 days daily"
        replicas: 2
        offsite: true

    - level: low
      description: "Non-critical systems, archival data"
      rpo_target: "24 hours"
      rto_target: "72 hours"
      examples:
        - "Test environments"
        - "Historical archives"
        - "Training systems"
      backup_strategy:
        type: "daily"
        frequency: "nightly"
        retention: "30 days daily, 1 year monthly"
        replicas: 1
        offsite: recommended

  calculation_worksheet:
    system_name: ""
    data_change_rate: ""  # GB/hour
    transaction_volume: ""  # transactions/hour
    revenue_per_hour: ""
    cost_of_downtime: ""
    regulatory_requirements: ""
    calculated_rpo: ""
    calculated_rto: ""
    approved_rpo: ""
    approved_rto: ""
    business_owner_signoff: ""
```

### Process 2: 3-2-1 Backup Architecture

Implement the industry-standard backup rule with modern enhancements.

```yaml
# backup-architecture-321.yaml
backup_architecture:
  rule_321:
    description: "3 copies, 2 media types, 1 offsite"

  implementation:
    primary_copy:
      location: "Production storage"
      type: "Live data"
      purpose: "Active operations"

    secondary_copy:
      location: "On-premises backup storage"
      type: "Disk-based backup"
      purpose: "Fast local recovery"
      technology:
        - "Deduplication appliance"
        - "Backup server with local disk"
        - "SAN/NAS backup target"
      retention: "14-30 days"

    tertiary_copy:
      location: "Offsite/Cloud"
      type: "Object storage or tape"
      purpose: "Disaster recovery, long-term retention"
      technology:
        - "AWS S3/Glacier"
        - "Azure Blob Storage"
        - "Google Cloud Storage"
        - "Physical tape at vault"
      retention: "1-7 years per policy"

  enhanced_321_1:
    description: "3-2-1-1 adds air-gapped/immutable copy"
    immutable_copy:
      location: "Isolated storage"
      type: "Write-once media"
      purpose: "Ransomware protection"
      technology:
        - "Immutable S3 bucket"
        - "Air-gapped tape library"
        - "Isolated recovery vault"
      retention: "90 days minimum"
      access: "Break-glass procedure only"

  network_design:
    backup_network:
      type: "Dedicated VLAN"
      bandwidth: "10Gbps minimum"
      isolation: "Separate from production traffic"

    replication_network:
      type: "Encrypted WAN/VPN"
      bandwidth: "Based on change rate"
      compression: "Enabled"

    recovery_network:
      type: "Out-of-band management"
      purpose: "Recovery when production network compromised"
```

### Process 3: Backup Scheduling Matrix

```yaml
# backup-schedule-matrix.yaml
schedule_framework:
  backup_types:
    full_backup:
      description: "Complete copy of all data"
      use_case: "Baseline for incremental/differential"
      frequency: "Weekly (Sunday night)"
      window: "8-12 hours"
      retention: "4-52 weeks"

    incremental_backup:
      description: "Changes since last backup of any type"
      use_case: "Daily protection, minimal storage"
      frequency: "Daily"
      window: "1-4 hours"
      retention: "14-30 days"
      dependencies: "Requires full + all incrementals for restore"

    differential_backup:
      description: "Changes since last full backup"
      use_case: "Balance between speed and restore simplicity"
      frequency: "Daily"
      window: "2-6 hours"
      retention: "7-14 days"
      dependencies: "Requires full + latest differential for restore"

    synthetic_full:
      description: "Full backup created from existing backups"
      use_case: "Reduce backup window while maintaining full copies"
      frequency: "Weekly"
      window: "Background processing"
      retention: "Same as full"

  schedule_templates:
    aggressive_protection:
      description: "Maximum protection for critical systems"
      schedule:
        - type: "continuous_cdp"
          frequency: "Every write"
          retention: "72 hours"
        - type: "hourly_snapshot"
          frequency: "Every hour"
          retention: "7 days"
        - type: "daily_incremental"
          frequency: "Daily 2:00 AM"
          retention: "30 days"
        - type: "weekly_full"
          frequency: "Sunday 1:00 AM"
          retention: "12 weeks"
        - type: "monthly_archive"
          frequency: "First Sunday"
          retention: "7 years"

    standard_protection:
      description: "Balanced protection for typical systems"
      schedule:
        - type: "daily_incremental"
          frequency: "Daily 2:00 AM"
          retention: "14 days"
        - type: "weekly_full"
          frequency: "Sunday 1:00 AM"
          retention: "4 weeks"
        - type: "monthly_full"
          frequency: "First Sunday"
          retention: "12 months"

    minimal_protection:
      description: "Basic protection for non-critical systems"
      schedule:
        - type: "daily_incremental"
          frequency: "Daily 3:00 AM"
          retention: "7 days"
        - type: "weekly_full"
          frequency: "Sunday 2:00 AM"
          retention: "4 weeks"
```

### Process 4: Backup Verification and Testing

```yaml
# backup-verification-framework.yaml
verification_framework:
  automated_verification:
    backup_completion:
      check: "Job completed successfully"
      frequency: "Every backup"
      alert_on: "failure or warning"

    data_integrity:
      check: "Checksum validation"
      frequency: "Every backup"
      method: "SHA-256 hash comparison"

    catalog_consistency:
      check: "Backup catalog matches storage"
      frequency: "Daily"
      method: "Automated reconciliation"

    storage_health:
      check: "Target storage accessible and healthy"
      frequency: "Hourly"
      method: "Health check probe"

  restore_testing:
    file_level_restore:
      description: "Restore random files and verify"
      frequency: "Weekly"
      sample_size: "10 files per backup set"
      validation: "Hash comparison with original"

    application_restore:
      description: "Restore application and verify functionality"
      frequency: "Monthly"
      scope: "Critical applications"
      validation:
        - "Application starts successfully"
        - "Database consistency check passes"
        - "Sample transactions complete"

    full_system_restore:
      description: "Complete system recovery to isolated environment"
      frequency: "Quarterly"
      scope: "All critical systems"
      validation:
        - "System boots successfully"
        - "All services start"
        - "Data integrity verified"
        - "Network connectivity confirmed"
        - "Application functionality tested"

    disaster_recovery_drill:
      description: "Full DR scenario execution"
      frequency: "Annually"
      scope: "Complete environment"
      validation:
        - "Recovery within RTO"
        - "Data loss within RPO"
        - "Business processes functional"
        - "User acceptance confirmed"

  test_documentation:
    template:
      test_id: ""
      test_date: ""
      test_type: ""
      systems_tested: []
      backup_used:
        date: ""
        type: ""
        size: ""
      recovery_target: ""
      actual_recovery_time: ""
      data_validation_result: ""
      issues_found: []
      remediation_actions: []
      tester_name: ""
      business_signoff: ""
```

## Tools & Templates

### Backup Policy Document Template

```markdown
# Enterprise Backup Policy

## 1. Purpose
Define backup requirements ensuring data protection and recovery capabilities.

## 2. Scope
All production systems, databases, applications, and user data.

## 3. Backup Requirements

### 3.1 Classification-Based Requirements
| Data Class | RPO | RTO | Retention | Encryption |
|------------|-----|-----|-----------|------------|
| Critical | 15 min | 1 hr | 7 years | AES-256 |
| High | 1 hr | 4 hr | 3 years | AES-256 |
| Medium | 4 hr | 24 hr | 1 year | AES-256 |
| Low | 24 hr | 72 hr | 90 days | AES-256 |

### 3.2 Backup Types
- **Full**: Weekly for all systems
- **Incremental**: Daily minimum
- **Transaction Log**: Every 15 minutes for databases

### 3.3 Storage Requirements
- Minimum 2 copies on different media
- 1 copy offsite or in cloud
- 1 copy immutable for ransomware protection

## 4. Testing Requirements
- Weekly: Automated file restore verification
- Monthly: Application restore test
- Quarterly: Full system restore drill
- Annually: Complete DR exercise

## 5. Monitoring and Alerting
- All backup failures alert within 15 minutes
- Daily backup status report
- Weekly backup health dashboard review

## 6. Responsibilities
- **IT Operations**: Execute and monitor backups
- **Data Owners**: Define retention requirements
- **Security Team**: Verify encryption and access controls
- **Compliance**: Audit backup procedures

## 7. Review
Annual policy review or upon significant changes.
```

### Backup Monitoring Dashboard Metrics

```yaml
# backup-monitoring-config.yaml
dashboard_metrics:
  backup_health:
    - metric: "Backup Success Rate"
      query: "successful_jobs / total_jobs * 100"
      threshold_warning: "<98%"
      threshold_critical: "<95%"

    - metric: "Average Backup Duration"
      query: "avg(job_duration)"
      threshold_warning: ">window * 0.8"
      threshold_critical: ">window"

    - metric: "Data Protected Today"
      query: "sum(backup_size) WHERE date = today"
      display: "GB/TB"

    - metric: "Backup Storage Used"
      query: "used_capacity / total_capacity * 100"
      threshold_warning: ">80%"
      threshold_critical: ">90%"

  recovery_readiness:
    - metric: "Last Successful Backup Age"
      query: "now() - max(successful_backup_time)"
      threshold_warning: ">RPO"
      threshold_critical: ">2*RPO"

    - metric: "Restore Test Success Rate"
      query: "successful_restores / total_tests * 100"
      threshold_warning: "<100%"
      threshold_critical: "<95%"

    - metric: "Days Since Last DR Test"
      query: "now() - last_dr_test_date"
      threshold_warning: ">90 days"
      threshold_critical: ">180 days"

  compliance:
    - metric: "Retention Policy Compliance"
      query: "compliant_backups / required_backups * 100"
      threshold_critical: "<100%"

    - metric: "Encryption Status"
      query: "encrypted_backups / total_backups * 100"
      threshold_critical: "<100%"

    - metric: "Offsite Copy Status"
      query: "systems_with_offsite / total_systems * 100"
      threshold_critical: "<100%"
```

## Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Backup Success Rate | >99% | Successful jobs / Total jobs |
| RPO Achievement | 100% | Backups within RPO window |
| RTO Achievement | 100% | Restores within RTO target |
| Restore Test Pass Rate | 100% | Successful restore tests |
| Storage Efficiency | >2:1 | Deduplication ratio |
| Backup Window Compliance | 100% | Jobs completing in window |
| Offsite Replication Lag | <4 hours | Time since last replication |
| Immutable Copy Age | <24 hours | Age of newest immutable backup |

## Common Pitfalls

1. **Backup Without Testing**: Assuming backups work without verification
   - *Solution*: Automated and manual restore testing program

2. **Insufficient Retention**: Not keeping backups long enough
   - *Solution*: Align retention with compliance and business needs

3. **No Air Gap**: All backups accessible from production network
   - *Solution*: Implement immutable, isolated backup copies

4. **Ignoring Cloud Data**: Assuming cloud providers handle backup
   - *Solution*: Implement backup for all cloud workloads

5. **Backup Window Creep**: Backups taking longer over time
   - *Solution*: Monitor trends and scale infrastructure proactively

6. **Single Point of Failure**: Backup system itself not protected
   - *Solution*: Redundant backup infrastructure and config backups

## Integration Points

- **Monitoring Systems**: Backup status and alerting
- **Ticketing Systems**: Failed backup incident creation
- **CMDB**: Asset inventory for backup scope
- **Disaster Recovery**: Recovery procedure automation
- **Security Tools**: Encryption key management
- **Compliance Systems**: Retention policy enforcement
- **Cloud Platforms**: Native and third-party backup integration
