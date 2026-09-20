---
name: access-management
description: Comprehensive identity and access management implementation and governance. Use when designing IAM architectures, implementing access controls, managing user lifecycles, configuring authentication systems, or establishing authorization frameworks.
---

# Access Management

## Overview

Access management encompasses the policies, processes, and technologies that control who can access what resources under what conditions. It forms the foundation of organizational security by ensuring that only authorized individuals can access systems and data appropriate to their roles.

Modern access management extends beyond simple username/password authentication to include multi-factor authentication, single sign-on, privileged access management, identity governance, and zero-trust architectures. Organizations must balance security requirements with user experience and operational efficiency.

The discipline addresses the complete identity lifecycle from provisioning through deprovisioning, including role changes, access reviews, and compliance requirements. It integrates with HR systems, cloud platforms, SaaS applications, and on-premises infrastructure to provide unified access control.

### Why This Matters

- **Security Foundation**: Prevent unauthorized access to sensitive resources
- **Compliance Requirements**: Meet SOX, HIPAA, PCI-DSS, GDPR access control mandates
- **Operational Efficiency**: Streamline user provisioning and access requests
- **Audit Readiness**: Demonstrate access controls for regulatory audits
- **Risk Reduction**: Minimize insider threat and credential-based attacks
- **User Experience**: Enable secure, seamless access across systems

## When to Use

### Primary Triggers

- Implementing new IAM platforms
- Migrating to cloud identity providers
- Addressing audit findings on access controls
- Onboarding new applications to SSO
- Implementing zero-trust architecture
- Improving privileged access security

### Specific Use Cases

1. **User Provisioning**: Automated account creation and access assignment
2. **Single Sign-On**: Unified authentication across applications
3. **Multi-Factor Authentication**: Enhanced authentication security
4. **Privileged Access Management**: Securing administrative access
5. **Access Certification**: Periodic review and recertification
6. **Role-Based Access Control**: Standardized access through roles

## Core Processes

### Process 1: Identity Lifecycle Management

Define processes for managing identities from creation to termination.

```yaml
# identity-lifecycle-management.yaml
lifecycle_management:
  stages:
    joiner:
      description: "New employee or contractor onboarding"
      triggers:
        - "HR system new hire record"
        - "Manager access request"
        - "Contractor agreement signed"

      automated_actions:
        - action: "Create identity record"
          systems: ["Active Directory", "Azure AD", "HR System"]
          timing: "Day -3 (before start)"

        - action: "Assign base role"
          logic: "Based on job title and department"
          timing: "Day -3"

        - action: "Provision email"
          systems: ["Microsoft 365", "Google Workspace"]
          timing: "Day -1"

        - action: "Create accounts"
          systems: ["Based on role entitlements"]
          timing: "Day 1"

        - action: "Send welcome credentials"
          method: "Secure credential delivery"
          timing: "Day 1"

      manual_actions:
        - action: "Manager approval for additional access"
          sla: "2 business days"

        - action: "Security training completion"
          sla: "Within 30 days"

    mover:
      description: "Role change or department transfer"
      triggers:
        - "HR system job change"
        - "Manager transfer request"
        - "Promotion/demotion"

      automated_actions:
        - action: "Update role assignments"
          logic: "Remove old role, add new role"
          timing: "Effective date"

        - action: "Recalculate entitlements"
          logic: "Apply new role permissions"
          timing: "Effective date"

        - action: "Notify managers"
          recipients: ["Old manager", "New manager"]
          timing: "Immediately"

      manual_actions:
        - action: "Review legacy access"
          owner: "New manager"
          sla: "14 days"

        - action: "Approve exceptional access"
          owner: "Access governance team"
          sla: "5 business days"

    leaver:
      description: "Employee termination or contractor end"
      triggers:
        - "HR system termination record"
        - "Contract end date"
        - "Immediate termination request"

      immediate_termination:
        timing: "Within 1 hour of notification"
        actions:
          - "Disable Active Directory account"
          - "Revoke all SSO sessions"
          - "Disable email access"
          - "Revoke VPN certificates"
          - "Disable badge access"
          - "Block mobile device access"

      standard_termination:
        timing: "End of last working day"
        actions:
          - "Disable all accounts"
          - "Transfer mailbox to manager"
          - "Archive OneDrive/home folder"
          - "Remove from all groups"
          - "Revoke all application access"

      post_termination:
        timing: "Day +30"
        actions:
          - "Delete accounts (per retention policy)"
          - "Remove from identity store"
          - "Update compliance records"
```

### Process 2: Role-Based Access Control (RBAC)

```yaml
# rbac-framework.yaml
rbac_framework:
  role_hierarchy:
    organizational_roles:
      - role: "All Employees"
        description: "Base access for all staff"
        entitlements:
          - "Email and calendar"
          - "Intranet access"
          - "HR self-service"
          - "Expense system"
          - "Corporate directory"

      - role: "Manager"
        inherits: "All Employees"
        description: "People management access"
        entitlements:
          - "Team member records (HR)"
          - "Time approval system"
          - "Expense approval"
          - "Performance management"
          - "Access request approval"

      - role: "Executive"
        inherits: "Manager"
        description: "Senior leadership access"
        entitlements:
          - "Executive dashboards"
          - "Board materials"
          - "Strategic planning tools"
          - "Financial reporting"

    functional_roles:
      - role: "Finance Analyst"
        department: "Finance"
        entitlements:
          - "Financial reporting system"
          - "Budget management"
          - "Invoice processing"
          - "Vendor management"

      - role: "Software Developer"
        department: "Engineering"
        entitlements:
          - "Source code repositories"
          - "CI/CD pipelines"
          - "Development environments"
          - "Documentation wiki"
          - "Issue tracking"

      - role: "Customer Support"
        department: "Support"
        entitlements:
          - "CRM system (read/update)"
          - "Ticketing system"
          - "Knowledge base"
          - "Customer data (masked PII)"

    application_roles:
      - application: "Salesforce"
        roles:
          - name: "Sales User"
            permissions: ["Read accounts", "Create opportunities", "Edit contacts"]
          - name: "Sales Manager"
            permissions: ["All Sales User", "View reports", "Manage team"]
          - name: "Sales Admin"
            permissions: ["All Sales Manager", "System configuration"]

  role_assignment_rules:
    automatic_assignment:
      - condition: "job_title CONTAINS 'Manager'"
        assign_role: "Manager"

      - condition: "department = 'Finance' AND job_level >= 'Analyst'"
        assign_role: "Finance Analyst"

      - condition: "department = 'Engineering' AND job_title CONTAINS 'Developer'"
        assign_role: "Software Developer"

    request_required:
      - role: "Production Database Access"
        approval: "Data Owner + Security Team"
        justification: required
        time_bound: true

      - role: "Admin Access"
        approval: "Manager + IT Security"
        justification: required
        mfa_required: true

  role_governance:
    role_owner:
      responsibilities:
        - "Define role entitlements"
        - "Approve role changes"
        - "Review role members quarterly"
        - "Maintain role documentation"

    periodic_review:
      frequency: "Quarterly"
      actions:
        - "Validate role definitions"
        - "Review membership"
        - "Identify unused entitlements"
        - "Update role documentation"
```

### Process 3: Authentication Framework

```yaml
# authentication-framework.yaml
authentication:
  methods:
    password:
      requirements:
        min_length: 14
        complexity: "3 of 4 character types"
        history: 12
        max_age: 90
        lockout_threshold: 5
        lockout_duration: 30

    multi_factor:
      required_for:
        - "All remote access"
        - "Privileged accounts"
        - "Sensitive applications"
        - "Password reset"

      acceptable_factors:
        - type: "Hardware token"
          examples: ["YubiKey", "RSA token"]
          assurance_level: "High"

        - type: "Authenticator app"
          examples: ["Microsoft Authenticator", "Google Authenticator"]
          assurance_level: "Medium-High"

        - type: "Push notification"
          examples: ["Duo Push", "Okta Verify"]
          assurance_level: "Medium"

        - type: "SMS/Voice"
          examples: ["Text message code"]
          assurance_level: "Low"
          restrictions: "Not allowed for privileged access"

    passwordless:
      methods:
        - type: "FIDO2/WebAuthn"
          description: "Hardware security keys"
          recommended: true

        - type: "Windows Hello"
          description: "Biometric or PIN"
          scope: "Windows devices"

        - type: "Certificate-based"
          description: "Smart card or device certificate"
          scope: "High-security environments"

  single_sign_on:
    protocols:
      saml:
        use_case: "Enterprise web applications"
        configuration:
          assertion_lifetime: 3600
          signature_algorithm: "RSA-SHA256"
          name_id_format: "email"

      oidc:
        use_case: "Modern web and mobile apps"
        configuration:
          token_lifetime: 3600
          refresh_token: 86400
          scopes: ["openid", "profile", "email"]

      kerberos:
        use_case: "Windows integrated authentication"
        configuration:
          ticket_lifetime: 10
          service_ticket_lifetime: 10

    session_management:
      idle_timeout: 30  # minutes
      absolute_timeout: 480  # minutes (8 hours)
      concurrent_sessions: 3
      session_revocation: "On password change or security event"

  conditional_access:
    policies:
      - name: "Require MFA for external access"
        conditions:
          location: "Outside corporate network"
          application: "All"
        controls:
          mfa: required

      - name: "Block legacy authentication"
        conditions:
          client_app: ["Exchange ActiveSync", "Other clients"]
        controls:
          block: true

      - name: "Require compliant device"
        conditions:
          application: ["Sensitive apps"]
        controls:
          compliant_device: required
          mfa: required

      - name: "High-risk sign-in remediation"
        conditions:
          risk_level: ["High"]
        controls:
          mfa: required
          password_change: required
```

### Process 4: Access Certification

```yaml
# access-certification-process.yaml
access_certification:
  certification_campaigns:
    manager_certification:
      frequency: "Quarterly"
      scope: "All access for direct reports"
      certifier: "Direct manager"
      deadline: 14  # days
      escalation:
        - day: 7
          action: "Reminder to manager"
        - day: 12
          action: "Escalate to manager's manager"
        - day: 14
          action: "Auto-revoke uncertified access"

    application_owner_certification:
      frequency: "Semi-annually"
      scope: "All users with application access"
      certifier: "Application owner"
      deadline: 21  # days
      escalation:
        - day: 14
          action: "Reminder to owner"
        - day: 19
          action: "Escalate to IT Security"
        - day: 21
          action: "Auto-revoke uncertified access"

    privileged_access_certification:
      frequency: "Monthly"
      scope: "All privileged accounts and access"
      certifier: "Security team + System owner"
      deadline: 7  # days
      escalation:
        - day: 5
          action: "Reminder"
        - day: 7
          action: "Immediate escalation to CISO"

  certification_workflow:
    review_interface:
      display_fields:
        - "User name"
        - "Access entitlement"
        - "Last access date"
        - "Risk score"
        - "Peer comparison"

      actions:
        - action: "Certify"
          description: "Access is appropriate"

        - action: "Revoke"
          description: "Access is not needed"
          requires: "Justification"

        - action: "Modify"
          description: "Change access level"
          requires: "New access specification"

        - action: "Delegate"
          description: "Assign to different certifier"
          requires: "Delegate selection"

    completion_requirements:
      - "All items reviewed"
      - "Justification for revocations"
      - "Certifier attestation"

  reporting:
    campaign_metrics:
      - "Completion rate"
      - "On-time completion"
      - "Revocation rate"
      - "Average review time"

    risk_indicators:
      - "Users with excessive access"
      - "Unused access entitlements"
      - "Orphaned accounts"
      - "Separation of duties violations"
```

## Tools & Templates

### Access Request Form

```yaml
# access-request-template.yaml
access_request:
  requestor_information:
    - field: "Name"
      type: "auto-populated"
    - field: "Department"
      type: "auto-populated"
    - field: "Manager"
      type: "auto-populated"
    - field: "Request date"
      type: "auto-populated"

  request_details:
    - field: "Request type"
      type: "select"
      options:
        - "New access"
        - "Modification"
        - "Removal"
        - "Temporary access"

    - field: "Access requested"
      type: "multi-select"
      source: "Entitlement catalog"

    - field: "Business justification"
      type: "text"
      required: true
      min_length: 50

    - field: "Start date"
      type: "date"
      required: true

    - field: "End date"
      type: "date"
      required_for: "Temporary access"

  approval_workflow:
    - step: "Manager approval"
      approver: "requestor.manager"
      sla: "2 business days"

    - step: "Data owner approval"
      approver: "entitlement.owner"
      condition: "Sensitive data access"
      sla: "3 business days"

    - step: "Security review"
      approver: "security_team"
      condition: "Privileged access OR high-risk entitlement"
      sla: "3 business days"

  fulfillment:
    automated:
      - "Standard role assignments"
      - "Group memberships"
      - "Application provisioning (SCIM)"

    manual:
      - "Legacy system access"
      - "Physical access badges"
      - "Custom permissions"
```

### Privileged Access Policy

```markdown
# Privileged Access Management Policy

## 1. Purpose
Define controls for administrative and privileged access to systems and data.

## 2. Scope
All accounts with elevated permissions including:
- System administrators
- Database administrators
- Network administrators
- Application administrators
- Service accounts with elevated privileges

## 3. Requirements

### 3.1 Account Standards
- Separate privileged and standard user accounts
- Named accounts (no shared admin accounts)
- Privileged accounts excluded from email and internet access

### 3.2 Authentication
- Multi-factor authentication required
- Maximum session duration: 4 hours
- Re-authentication required for sensitive actions

### 3.3 Access Controls
- Just-in-time access provisioning
- Time-bound access (default: 8 hours)
- Approval required for each privileged session

### 3.4 Monitoring
- All privileged sessions recorded
- Real-time alerting on suspicious activity
- Quarterly access review

### 3.5 Service Accounts
- Documented owner for each account
- Password rotation every 90 days (or certificate-based)
- Minimum necessary permissions
- No interactive login where possible

## 4. Compliance
Violations subject to disciplinary action.

## 5. Review
Annual review or upon significant changes.
```

## Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Provisioning Time | <24 hours | Request to access granted |
| Deprovisioning Time | <4 hours | Termination to access revoked |
| Certification Completion | 100% | Campaigns completed on time |
| Orphaned Account Rate | <1% | Accounts without valid owner |
| MFA Adoption | 100% | Users enrolled in MFA |
| Access Review Coverage | 100% | Entitlements reviewed annually |
| SoD Violation Rate | <0.5% | Segregation of duties conflicts |
| Password Policy Compliance | 100% | Accounts meeting requirements |

## Common Pitfalls

1. **Access Accumulation**: Users collect access over time without removal
   - *Solution*: Regular access certifications and role-based controls

2. **Orphaned Accounts**: Accounts without valid owners
   - *Solution*: Automated HR integration and periodic cleanup

3. **Shared Accounts**: Multiple users sharing credentials
   - *Solution*: Named accounts with individual accountability

4. **Excessive Privileges**: Users with more access than needed
   - *Solution*: Least privilege principle and regular reviews

5. **Manual Provisioning**: Error-prone and slow manual processes
   - *Solution*: Automated provisioning through identity platform

6. **Inconsistent Policies**: Different rules for different systems
   - *Solution*: Centralized IAM platform with unified policies

## Integration Points

- **HR Systems**: Employee lifecycle data source
- **Active Directory/LDAP**: Directory services
- **Cloud Identity Providers**: Azure AD, Okta, Ping
- **SIEM Systems**: Authentication event logging
- **Ticketing Systems**: Access request workflow
- **GRC Platforms**: Compliance reporting
- **PAM Solutions**: Privileged access management
- **SSO Platforms**: Single sign-on integration
