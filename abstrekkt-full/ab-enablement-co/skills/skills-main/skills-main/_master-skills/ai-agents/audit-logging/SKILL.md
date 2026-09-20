---
name: audit-logging
description: Comprehensive audit logging implementation and management for security and compliance. Use when designing audit log architectures, implementing centralized logging, ensuring log integrity, meeting compliance logging requirements, or building security monitoring capabilities.
---

# Audit Logging

## Overview

Audit logging is the systematic recording of security-relevant events across systems and applications to support security monitoring, incident investigation, compliance requirements, and forensic analysis. It provides the evidence trail necessary to understand who did what, when, and from where.

Effective audit logging balances comprehensive coverage with storage efficiency, ensuring critical events are captured while managing the volume of log data. It requires careful consideration of what to log, how to protect log integrity, and how long to retain logs for various purposes.

Modern audit logging extends across on-premises infrastructure, cloud platforms, SaaS applications, and containerized environments. It integrates with SIEM systems for real-time analysis and supports compliance requirements including SOX, PCI-DSS, HIPAA, GDPR, and industry-specific regulations.

### Why This Matters

- **Security Monitoring**: Enable detection of threats and anomalies
- **Incident Response**: Provide evidence for investigating security incidents
- **Compliance Requirements**: Meet regulatory mandates for audit trails
- **Forensic Capability**: Support post-incident analysis and legal proceedings
- **Accountability**: Establish responsibility for system changes and access
- **Operational Insight**: Understand system behavior and troubleshoot issues

## When to Use

### Primary Triggers

- Designing new application logging strategy
- Implementing centralized log management
- Preparing for compliance audits
- Improving security detection capabilities
- Investigating security incidents
- Establishing log retention policies

### Specific Use Cases

1. **Authentication Logging**: Track login attempts and credential usage
2. **Authorization Logging**: Record access decisions and permission changes
3. **Data Access Logging**: Monitor who accesses sensitive data
4. **Change Logging**: Track configuration and system changes
5. **Transaction Logging**: Record business-critical transactions
6. **Administrative Logging**: Capture privileged user activities

## Core Processes

### Process 1: Audit Logging Requirements

Define what must be logged based on security and compliance needs.

```yaml
# audit-logging-requirements.yaml
logging_requirements:
  event_categories:
    authentication_events:
      priority: critical
      events:
        - event: "Successful login"
          fields:
            - "timestamp"
            - "user_id"
            - "source_ip"
            - "authentication_method"
            - "session_id"
          retention: "1 year"

        - event: "Failed login"
          fields:
            - "timestamp"
            - "attempted_user_id"
            - "source_ip"
            - "failure_reason"
            - "attempt_count"
          retention: "1 year"

        - event: "Logout"
          fields:
            - "timestamp"
            - "user_id"
            - "session_id"
            - "session_duration"
          retention: "1 year"

        - event: "Password change"
          fields:
            - "timestamp"
            - "user_id"
            - "changed_by"
            - "change_method"
          retention: "3 years"

        - event: "MFA enrollment/change"
          fields:
            - "timestamp"
            - "user_id"
            - "mfa_method"
            - "action"
          retention: "3 years"

    authorization_events:
      priority: critical
      events:
        - event: "Access granted"
          fields:
            - "timestamp"
            - "user_id"
            - "resource_id"
            - "permission_granted"
            - "granted_by"
          retention: "3 years"

        - event: "Access denied"
          fields:
            - "timestamp"
            - "user_id"
            - "resource_id"
            - "permission_requested"
            - "denial_reason"
          retention: "1 year"

        - event: "Privilege escalation"
          fields:
            - "timestamp"
            - "user_id"
            - "original_role"
            - "elevated_role"
            - "method"
          retention: "3 years"

    data_access_events:
      priority: high
      events:
        - event: "Sensitive data read"
          fields:
            - "timestamp"
            - "user_id"
            - "data_type"
            - "record_count"
            - "access_purpose"
          retention: "7 years"

        - event: "Data export"
          fields:
            - "timestamp"
            - "user_id"
            - "data_type"
            - "export_format"
            - "record_count"
            - "destination"
          retention: "7 years"

        - event: "Bulk data access"
          fields:
            - "timestamp"
            - "user_id"
            - "query_details"
            - "record_count"
          retention: "3 years"

    change_events:
      priority: high
      events:
        - event: "Configuration change"
          fields:
            - "timestamp"
            - "user_id"
            - "system_affected"
            - "setting_changed"
            - "old_value"
            - "new_value"
            - "change_ticket"
          retention: "3 years"

        - event: "User account modification"
          fields:
            - "timestamp"
            - "modified_user_id"
            - "modified_by"
            - "changes_made"
          retention: "7 years"

        - event: "Security policy change"
          fields:
            - "timestamp"
            - "policy_name"
            - "changed_by"
            - "change_description"
            - "approval_reference"
          retention: "7 years"

    administrative_events:
      priority: critical
      events:
        - event: "Administrative action"
          fields:
            - "timestamp"
            - "admin_user_id"
            - "action_type"
            - "target_system"
            - "action_details"
          retention: "7 years"

        - event: "System startup/shutdown"
          fields:
            - "timestamp"
            - "system_id"
            - "event_type"
            - "initiated_by"
            - "reason"
          retention: "1 year"

        - event: "Backup/restore operations"
          fields:
            - "timestamp"
            - "system_id"
            - "operation_type"
            - "performed_by"
            - "scope"
            - "result"
          retention: "3 years"

  compliance_mapping:
    pci_dss:
      requirement: "10"
      controls:
        - "10.1: Audit trail linking events to users"
        - "10.2.1: User access to cardholder data"
        - "10.2.2: Actions by privileged users"
        - "10.2.4: Invalid access attempts"
        - "10.2.5: Changes to authentication mechanisms"
        - "10.2.7: Creation/deletion of system objects"

    hipaa:
      standard: "164.312(b)"
      requirements:
        - "Audit controls tracking PHI access"
        - "Activity logs for systems with PHI"

    sox:
      section: "302/404"
      requirements:
        - "Financial system access logs"
        - "Change management audit trails"

    gdpr:
      article: "30"
      requirements:
        - "Records of processing activities"
        - "Access to personal data"
```

### Process 2: Log Architecture Design

```yaml
# audit-log-architecture.yaml
log_architecture:
  collection_layer:
    agents:
      - type: "Filebeat"
        use_case: "Log file collection"
        deployment: "All servers"
        configuration:
          inputs:
            - type: "log"
              paths:
                - "/var/log/secure"
                - "/var/log/audit/audit.log"
                - "/var/log/application/*.log"

      - type: "Winlogbeat"
        use_case: "Windows event collection"
        deployment: "Windows servers"
        configuration:
          event_logs:
            - name: "Security"
              event_ids: [4624, 4625, 4634, 4648, 4672, 4720, 4722]
            - name: "System"
              event_ids: [7045, 7040]

      - type: "Fluentd"
        use_case: "Container log collection"
        deployment: "Kubernetes clusters"
        configuration:
          sources:
            - "@type": "tail"
              path: "/var/log/containers/*.log"

    cloud_native:
      aws:
        - service: "CloudTrail"
          scope: "API calls"
          configuration:
            multi_region: true
            log_file_validation: true
            s3_bucket: "audit-logs-bucket"

        - service: "CloudWatch Logs"
          scope: "Application logs"
          configuration:
            retention: 365
            metric_filters: true

      azure:
        - service: "Azure Activity Log"
          scope: "Control plane operations"

        - service: "Azure Monitor"
          scope: "Application and infrastructure"

      gcp:
        - service: "Cloud Audit Logs"
          scope: "Admin and data access"

  processing_layer:
    normalization:
      format: "Common Event Format (CEF)"
      fields:
        - "timestamp"
        - "event_type"
        - "severity"
        - "source_system"
        - "source_ip"
        - "user_id"
        - "action"
        - "target"
        - "outcome"
        - "additional_data"

      transformation_rules:
        - source_format: "Windows Security Event"
          mapping:
            timestamp: "TimeCreated"
            event_type: "EventID"
            user_id: "SubjectUserName"
            source_ip: "IpAddress"

        - source_format: "Linux audit"
          mapping:
            timestamp: "timestamp"
            event_type: "type"
            user_id: "auid"
            source_ip: "addr"

    enrichment:
      - type: "GeoIP"
        field: "source_ip"
        adds: ["country", "city", "coordinates"]

      - type: "Asset lookup"
        field: "source_ip"
        adds: ["hostname", "asset_type", "owner"]

      - type: "User lookup"
        field: "user_id"
        adds: ["full_name", "department", "role"]

      - type: "Threat intelligence"
        field: "source_ip"
        adds: ["threat_score", "known_malicious"]

  storage_layer:
    hot_storage:
      technology: "Elasticsearch"
      retention: "30 days"
      purpose: "Active analysis and search"
      capacity_planning:
        daily_volume: "100 GB"
        indexing_rate: "10,000 events/second"
        search_requirements: "Sub-second response"

    warm_storage:
      technology: "S3 Standard"
      retention: "1 year"
      purpose: "Compliance and investigation"
      format: "Parquet (compressed)"

    cold_storage:
      technology: "S3 Glacier"
      retention: "7 years"
      purpose: "Long-term compliance archive"
      format: "Parquet (compressed)"
      access_time: "3-5 hours retrieval"

  security_controls:
    integrity:
      - "Log signing with private key"
      - "Hash chain for tamper detection"
      - "Write-once storage for critical logs"

    confidentiality:
      - "Encryption at rest (AES-256)"
      - "Encryption in transit (TLS 1.3)"
      - "Field-level encryption for sensitive data"

    availability:
      - "Multi-region replication"
      - "Cross-account backup"
      - "High availability cluster"

    access_control:
      - "Role-based access to log data"
      - "Audit logging of log access"
      - "Separate admin from log viewers"
```


## References
- `references/process-3-log-integrity-and-protection.md` — Process 3: Log Integrity and Protection
- `references/references.md` — References
- `references/tools-templates.md` — Tools & Templates
