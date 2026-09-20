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

### Process 3: Log Integrity and Protection

```yaml
# log-integrity-framework.yaml
log_integrity:
  tamper_detection:
    hash_chains:
      description: "Each log entry includes hash of previous entry"
      implementation:
        algorithm: "SHA-256"
        chain_interval: "Per entry or per minute"
        verification: "Continuous background validation"

    digital_signatures:
      description: "Cryptographically sign log files"
      implementation:
        algorithm: "RSA-2048 or ECDSA"
        signing_frequency: "Hourly or on rotation"
        key_management: "HSM-protected private keys"

    write_once_storage:
      description: "Immutable storage for critical logs"
      implementation:
        aws: "S3 Object Lock (Governance or Compliance mode)"
        azure: "Immutable Blob Storage"
        on_premises: "WORM storage or separate audit server"

  access_controls:
    separation_of_duties:
      principle: "Log administrators cannot modify audit logs"
      implementation:
        - "Dedicated log admin role"
        - "No delete permissions on log storage"
        - "Audit logging of log system access"
        - "Multi-party approval for log modifications"

    privileged_access:
      log_admin_permissions:
        allowed:
          - "Configure log collection"
          - "Manage retention policies"
          - "Create search queries"
        denied:
          - "Delete or modify log entries"
          - "Disable logging"
          - "Access raw log files directly"

    access_logging:
      log_these_events:
        - "Log search queries"
        - "Log export operations"
        - "Configuration changes"
        - "Access grant/revoke"

  monitoring:
    alerts:
      - alert: "Log collection stopped"
        condition: "No logs from source > 15 minutes"
        severity: "Critical"
        response: "Investigate immediately"

      - alert: "Log tampering detected"
        condition: "Hash chain validation failure"
        severity: "Critical"
        response: "Isolate system, preserve evidence"

      - alert: "Unusual log volume"
        condition: "Volume > 2x normal or < 0.5x normal"
        severity: "Warning"
        response: "Investigate source"

      - alert: "Log storage approaching capacity"
        condition: "Storage > 80% full"
        severity: "Warning"
        response: "Expand storage or archive"

    health_checks:
      - check: "Agent heartbeat"
        frequency: "Every 1 minute"
        timeout: "5 minutes"

      - check: "Pipeline latency"
        frequency: "Every 5 minutes"
        threshold: "< 5 minutes"

      - check: "Index health"
        frequency: "Every 15 minutes"
        validation: "Green status, shards allocated"
```

### Process 4: Log Analysis and Alerting

```yaml
# log-analysis-framework.yaml
analysis_framework:
  detection_rules:
    authentication:
      - rule: "Brute force detection"
        query: "event_type:authentication_failure AND count > 10 in 5 minutes"
        grouping: "source_ip, target_user"
        severity: "High"
        response: "Block IP, notify security"

      - rule: "Successful login after failures"
        query: "event_type:authentication_success PRECEDED BY authentication_failure count > 5"
        window: "30 minutes"
        severity: "Medium"
        response: "Verify legitimate user"

      - rule: "Login from new location"
        query: "event_type:authentication_success AND location NOT IN user_baseline"
        severity: "Medium"
        response: "Verify with user"

      - rule: "Impossible travel"
        query: "authentication_success with location change > 500 miles in < 1 hour"
        severity: "High"
        response: "Force reauthentication, investigate"

    authorization:
      - rule: "Privilege escalation"
        query: "event_type:privilege_change AND new_role:admin"
        severity: "High"
        response: "Verify authorization"

      - rule: "Access to sensitive data outside hours"
        query: "event_type:data_access AND data_classification:restricted AND time NOT IN business_hours"
        severity: "Medium"
        response: "Review access justification"

      - rule: "Bulk data access"
        query: "event_type:data_access AND record_count > 1000"
        severity: "Medium"
        response: "Verify business need"

    system:
      - rule: "Security control disabled"
        query: "event_type:configuration_change AND target:security_control AND action:disable"
        severity: "Critical"
        response: "Verify authorization, restore control"

      - rule: "New administrative account"
        query: "event_type:account_creation AND role:admin"
        severity: "High"
        response: "Verify authorization"

      - rule: "Audit log cleared"
        query: "event_type:log_cleared"
        severity: "Critical"
        response: "Investigate immediately, potential compromise"

  correlation_rules:
    - name: "Potential data exfiltration"
      description: "Multiple indicators of data theft"
      conditions:
        - "Large file access within 24 hours"
        - "Connection to external storage"
        - "After-hours access"
      severity: "Critical"

    - name: "Account compromise"
      description: "Multiple indicators of credential theft"
      conditions:
        - "Login from unusual location"
        - "Multiple failed logins"
        - "Password change"
        - "MFA change"
      severity: "Critical"

    - name: "Insider threat indicators"
      description: "Potential malicious insider activity"
      conditions:
        - "Access to unrelated sensitive data"
        - "Bulk download activity"
        - "Recent negative HR event"
      severity: "High"

  dashboards:
    security_operations:
      panels:
        - "Authentication events by status"
        - "Top users with failed logins"
        - "Privileged user activity"
        - "Sensitive data access trends"
        - "Geographic login distribution"
        - "Alert trends over time"

    compliance:
      panels:
        - "Log collection completeness"
        - "Retention compliance status"
        - "Access review status"
        - "Control effectiveness metrics"
```

## Tools & Templates

### Audit Log Policy Template

```markdown
# Audit Logging Policy

## 1. Purpose
Establish requirements for audit logging to support security monitoring,
incident investigation, and compliance requirements.

## 2. Scope
All information systems that process, store, or transmit company data.

## 3. Logging Requirements

### 3.1 Events to Log
All systems must log:
- Authentication events (success and failure)
- Authorization events (access grants and denials)
- Account management events
- System and security configuration changes
- Data access for sensitive information
- Administrative activities

### 3.2 Log Content
Each log entry must include:
- Timestamp (UTC, millisecond precision)
- Event type and outcome
- User identification
- Source IP address
- Affected resource
- Action performed

### 3.3 Log Protection
- Logs must be encrypted at rest and in transit
- Log integrity must be verifiable
- Log access limited to authorized personnel
- Logs protected from modification or deletion

### 3.4 Retention Requirements
| Log Type | Minimum Retention |
|----------|-------------------|
| Security events | 1 year |
| Access logs | 3 years |
| Financial system logs | 7 years |
| Healthcare data access | 6 years |

## 4. Monitoring Requirements
- Real-time alerting for critical events
- Daily review of security dashboards
- Weekly trend analysis

## 5. Compliance
Violation of this policy may result in disciplinary action.

## 6. Review
Annual review or upon significant changes.
```

### Log Format Specification

```yaml
# log-format-specification.yaml
log_format:
  standard_fields:
    - field: "timestamp"
      type: "datetime"
      format: "ISO 8601 with timezone"
      example: "2024-01-15T14:30:00.123Z"
      required: true

    - field: "event_id"
      type: "string"
      format: "UUID v4"
      example: "550e8400-e29b-41d4-a716-446655440000"
      required: true

    - field: "event_type"
      type: "enum"
      values: ["authentication", "authorization", "data_access", "change", "admin"]
      required: true

    - field: "event_action"
      type: "string"
      examples: ["login", "logout", "create", "read", "update", "delete"]
      required: true

    - field: "outcome"
      type: "enum"
      values: ["success", "failure", "error"]
      required: true

    - field: "severity"
      type: "enum"
      values: ["informational", "low", "medium", "high", "critical"]
      required: true

    - field: "source"
      type: "object"
      properties:
        ip: "IP address"
        hostname: "System hostname"
        application: "Application name"
        version: "Application version"
      required: true

    - field: "actor"
      type: "object"
      properties:
        user_id: "Unique user identifier"
        username: "Login name"
        type: "human|service|system"
        session_id: "Session identifier"
      required: true

    - field: "target"
      type: "object"
      properties:
        type: "Resource type"
        id: "Resource identifier"
        name: "Resource name"
      required: false

    - field: "details"
      type: "object"
      description: "Event-specific additional information"
      required: false

  example_log:
    timestamp: "2024-01-15T14:30:00.123Z"
    event_id: "550e8400-e29b-41d4-a716-446655440000"
    event_type: "authentication"
    event_action: "login"
    outcome: "success"
    severity: "informational"
    source:
      ip: "192.168.1.100"
      hostname: "webserver-01"
      application: "corporate-portal"
      version: "2.1.0"
    actor:
      user_id: "U12345"
      username: "jsmith"
      type: "human"
      session_id: "S98765"
    target:
      type: "application"
      id: "APP001"
      name: "Corporate Portal"
    details:
      authentication_method: "password+mfa"
      mfa_type: "totp"
      login_duration_ms: 234
```

## Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Log Collection Coverage | 100% | Systems with active logging |
| Log Completeness | >99% | Expected vs received events |
| Log Latency | <5 minutes | Source to SIEM delay |
| Retention Compliance | 100% | Meeting retention requirements |
| Integrity Verification | 100% | Pass rate on integrity checks |
| Alert Response Time | <15 minutes | Detection to acknowledgment |
| False Positive Rate | <10% | Invalid alerts vs total |
| Query Performance | <10 seconds | Average search response time |

## Common Pitfalls

1. **Logging Everything**: Capturing too much data without value
   - *Solution*: Risk-based logging requirements aligned to use cases

2. **Missing Critical Events**: Gaps in security-relevant logging
   - *Solution*: Systematic coverage assessment against frameworks

3. **No Integrity Verification**: Unable to prove logs unmodified
   - *Solution*: Implement hash chains and digital signatures

4. **Storage Cost Explosion**: Unbounded log growth
   - *Solution*: Tiered storage with appropriate retention policies

5. **Analysis Paralysis**: Logs collected but never reviewed
   - *Solution*: Automated alerting and regular review cadence

6. **Timestamp Inconsistency**: Logs with different time formats
   - *Solution*: Standardized UTC timestamps with NTP synchronization

## Integration Points

- **SIEM Systems**: Security information and event management
- **SOAR Platforms**: Security orchestration and response
- **Ticketing Systems**: Incident and alert tracking
- **Identity Platforms**: User enrichment and correlation
- **Threat Intelligence**: IOC matching and enrichment
- **Compliance Platforms**: Evidence for audits
- **Backup Systems**: Log archive and recovery
- **Cloud Platforms**: Native logging services integration
