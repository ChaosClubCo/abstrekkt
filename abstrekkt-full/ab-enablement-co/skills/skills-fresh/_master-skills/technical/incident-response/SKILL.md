---
name: incident-response
description: Comprehensive security incident response planning and execution. Use when developing incident response plans, handling active security incidents, conducting post-incident analysis, building response playbooks, or improving detection and response capabilities.
---

# Incident Response

## Overview

Incident response is the systematic approach to managing and mitigating security incidents that threaten organizational assets, data, or operations. It encompasses preparation, detection, containment, eradication, recovery, and post-incident analysis to minimize damage and prevent recurrence.

Effective incident response requires predefined processes, trained personnel, appropriate tools, and clear communication channels. Organizations must balance speed of response with thoroughness of investigation, ensuring threats are neutralized while preserving evidence for potential legal proceedings.

Modern incident response extends beyond traditional security events to include data breaches, ransomware attacks, supply chain compromises, and cloud security incidents. The discipline integrates with broader business continuity efforts and requires coordination across technical, legal, communications, and executive teams.

### Why This Matters

- **Damage Limitation**: Rapid response minimizes impact of security incidents
- **Regulatory Compliance**: Meet breach notification requirements (GDPR 72-hour rule)
- **Evidence Preservation**: Maintain forensic integrity for legal proceedings
- **Reputation Protection**: Professional handling reduces brand damage
- **Continuous Improvement**: Learn from incidents to strengthen defenses
- **Insurance Requirements**: Demonstrate due diligence for cyber insurance claims

## When to Use

### Primary Triggers

- Suspected or confirmed security breach
- Malware or ransomware detection
- Unauthorized access alerts
- Data exfiltration indicators
- Insider threat detection
- Third-party breach affecting organization

### Specific Use Cases

1. **Malware Outbreak**: Virus, worm, or ransomware spreading through network
2. **Data Breach**: Unauthorized access to sensitive information
3. **Account Compromise**: Stolen credentials or unauthorized access
4. **DDoS Attack**: Service disruption from denial of service
5. **Insider Threat**: Malicious or negligent employee activity
6. **Supply Chain Attack**: Compromise through vendor or software

## Core Processes

### Process 1: Incident Classification and Severity

Standardize incident categorization for appropriate response.

```yaml
# incident-classification-matrix.yaml
incident_classification:
  categories:
    - category: malware
      subcategories:
        - ransomware
        - trojan
        - worm
        - cryptominer
        - rootkit
      indicators:
        - "Antivirus alerts"
        - "Unusual process activity"
        - "File encryption behavior"
        - "Network beaconing"

    - category: unauthorized_access
      subcategories:
        - brute_force
        - credential_theft
        - privilege_escalation
        - lateral_movement
      indicators:
        - "Failed login attempts"
        - "Unusual login locations"
        - "After-hours access"
        - "New admin accounts"

    - category: data_breach
      subcategories:
        - exfiltration
        - unauthorized_disclosure
        - accidental_exposure
        - theft
      indicators:
        - "Large data transfers"
        - "Unusual database queries"
        - "Cloud storage access anomalies"
        - "Email forwarding rules"

    - category: denial_of_service
      subcategories:
        - volumetric
        - protocol
        - application_layer
      indicators:
        - "Traffic spikes"
        - "Service degradation"
        - "Resource exhaustion"

    - category: insider_threat
      subcategories:
        - malicious
        - negligent
        - compromised
      indicators:
        - "Policy violations"
        - "Data hoarding"
        - "Resignation + data access"

  severity_levels:
    critical:
      code: SEV-1
      description: "Active threat with significant business impact"
      criteria:
        - "Ransomware actively encrypting"
        - "Active data exfiltration"
        - "Complete service outage"
        - "Multiple systems compromised"
      response_time: "Immediate (15 minutes)"
      escalation: "Executive notification required"
      communication: "Incident commander activated"

    high:
      code: SEV-2
      description: "Confirmed incident with potential for escalation"
      criteria:
        - "Malware on production systems"
        - "Confirmed unauthorized access"
        - "Partial service degradation"
        - "Sensitive data at risk"
      response_time: "30 minutes"
      escalation: "Security leadership notification"
      communication: "On-call team activated"

    medium:
      code: SEV-3
      description: "Suspicious activity requiring investigation"
      criteria:
        - "Malware on non-critical systems"
        - "Unusual but contained behavior"
        - "Policy violations detected"
        - "Single system compromise"
      response_time: "4 hours"
      escalation: "Security team notification"
      communication: "Standard ticket workflow"

    low:
      code: SEV-4
      description: "Security event requiring documentation"
      criteria:
        - "Failed attack attempts"
        - "Minor policy violations"
        - "False positive investigation"
        - "Security awareness issues"
      response_time: "Next business day"
      escalation: "None required"
      communication: "Email notification"
```

### Process 2: Incident Response Playbook

```yaml
# incident-response-playbook.yaml
playbook:
  phase_1_preparation:
    objectives:
      - "Ensure team readiness"
      - "Validate tools and access"
      - "Confirm communication channels"

    checklist:
      - item: "IR team contact list current"
        frequency: monthly
        owner: ir_lead

      - item: "Forensic toolkit updated"
        frequency: quarterly
        owner: forensic_analyst

      - item: "Playbooks reviewed and tested"
        frequency: quarterly
        owner: ir_team

      - item: "Executive notification templates ready"
        frequency: annually
        owner: communications

      - item: "Legal/PR contacts confirmed"
        frequency: quarterly
        owner: ir_lead

  phase_2_detection_and_analysis:
    objectives:
      - "Confirm incident occurrence"
      - "Determine scope and impact"
      - "Identify attack vectors"

    actions:
      initial_triage:
        - "Review alert details and severity"
        - "Gather initial evidence"
        - "Identify affected systems"
        - "Determine incident timeline"

      evidence_collection:
        - "Capture volatile data (memory, connections)"
        - "Preserve log files"
        - "Document system state"
        - "Maintain chain of custody"

      analysis_steps:
        - "Identify indicators of compromise (IOCs)"
        - "Correlate events across systems"
        - "Determine attack origin"
        - "Assess data exposure"

    evidence_checklist:
      volatile_evidence:
        - "Memory dumps"
        - "Running processes"
        - "Network connections"
        - "Logged-in users"
        - "Open files"

      non_volatile_evidence:
        - "System logs"
        - "Application logs"
        - "Security logs"
        - "Disk images"
        - "Configuration files"

  phase_3_containment:
    objectives:
      - "Stop threat spread"
      - "Preserve evidence"
      - "Maintain business operations where possible"

    short_term_containment:
      network_isolation:
        - "Disable network port"
        - "VLAN quarantine"
        - "Firewall block rules"
        - "DNS sinkhole"

      account_actions:
        - "Disable compromised accounts"
        - "Force password reset"
        - "Revoke sessions/tokens"
        - "Review access logs"

      system_actions:
        - "Isolate from network"
        - "Disable suspicious services"
        - "Block malicious IPs"

    long_term_containment:
      - "Patch vulnerable systems"
      - "Implement additional monitoring"
      - "Deploy enhanced controls"
      - "Prepare clean systems for recovery"

  phase_4_eradication:
    objectives:
      - "Remove threat completely"
      - "Eliminate persistence mechanisms"
      - "Close attack vectors"

    actions:
      malware_removal:
        - "Run full antimalware scans"
        - "Remove malicious files"
        - "Clean registry entries"
        - "Remove scheduled tasks"

      system_hardening:
        - "Apply security patches"
        - "Update configurations"
        - "Remove unauthorized accounts"
        - "Reset credentials"

      verification:
        - "Scan for remaining IOCs"
        - "Validate system integrity"
        - "Confirm clean state"

  phase_5_recovery:
    objectives:
      - "Restore normal operations"
      - "Validate security controls"
      - "Monitor for recurrence"

    actions:
      system_restoration:
        - "Restore from clean backups"
        - "Rebuild if necessary"
        - "Apply current patches"
        - "Validate configurations"

      service_restoration:
        priority_order:
          - "Critical business services"
          - "Internal communications"
          - "Support systems"
          - "Non-critical systems"

      monitoring:
        - "Enhanced logging enabled"
        - "Additional alerting configured"
        - "Threat hunting initiated"
        - "User activity monitored"

  phase_6_post_incident:
    objectives:
      - "Document lessons learned"
      - "Improve processes"
      - "Update defenses"

    actions:
      documentation:
        - "Complete incident timeline"
        - "Document all actions taken"
        - "Calculate impact metrics"
        - "Prepare executive summary"

      lessons_learned:
        meeting_agenda:
          - "Incident summary"
          - "What worked well"
          - "What could improve"
          - "Action items"
        participants:
          - "IR team"
          - "Affected system owners"
          - "Management representatives"

      improvements:
        - "Update detection rules"
        - "Enhance playbooks"
        - "Address security gaps"
        - "Update training"
```

### Process 3: Communication Framework

```yaml
# incident-communication-plan.yaml
communication_plan:
  internal_communications:
    stakeholder_matrix:
      - role: "Executive Leadership"
        notify_when: "SEV-1 or SEV-2"
        method: "Phone + Email"
        frequency: "Every 2 hours during active incident"
        content: "Business impact, timeline, actions"

      - role: "IT Leadership"
        notify_when: "All confirmed incidents"
        method: "Email + Slack"
        frequency: "Every hour during active incident"
        content: "Technical details, resource needs"

      - role: "Legal/Compliance"
        notify_when: "Data breach or regulatory impact"
        method: "Phone + Email"
        frequency: "As needed"
        content: "Breach scope, notification requirements"

      - role: "HR"
        notify_when: "Insider threat or employee impact"
        method: "Phone"
        frequency: "As needed"
        content: "Employee involvement, disciplinary needs"

      - role: "All Employees"
        notify_when: "Service disruption or action required"
        method: "Email + Intranet"
        frequency: "Major updates only"
        content: "Impact, what to do, who to contact"

  external_communications:
    customers:
      trigger: "Customer data affected"
      method: "Email + Portal notice"
      timing: "Within 72 hours (GDPR requirement)"
      content:
        - "Nature of incident"
        - "Data potentially affected"
        - "Actions taken"
        - "Recommended user actions"
        - "Contact information"

    regulators:
      trigger: "Reportable breach"
      requirements:
        gdpr:
          authority: "Lead supervisory authority"
          timing: "72 hours"
          content: "Nature, categories, measures, contact"
        hipaa:
          authority: "HHS OCR"
          timing: "60 days"
          content: "Breach report form"
        pci:
          authority: "Payment brands, acquiring bank"
          timing: "Immediately"
          content: "Fraud alert, investigation plan"

    media:
      trigger: "Public incident or inquiry"
      spokesperson: "Designated PR contact only"
      approval: "Legal and executive approval required"
      key_messages:
        - "We take security seriously"
        - "Investigation in progress"
        - "Taking appropriate action"
        - "Cooperating with authorities"

  communication_templates:
    internal_alert:
      subject: "[SECURITY INCIDENT] [SEV-X] - Brief Description"
      body: |
        INCIDENT ALERT

        Severity: [X]
        Status: [Active/Contained/Resolved]
        Time Detected: [DateTime]

        Summary:
        [Brief description of incident]

        Impact:
        [Systems/data affected]

        Current Actions:
        [What is being done]

        Required Actions:
        [What recipients need to do]

        Next Update: [DateTime]
        Contact: [IR Lead contact]
```

### Process 4: Forensic Evidence Handling

```yaml
# forensic-evidence-procedures.yaml
evidence_handling:
  chain_of_custody:
    requirements:
      - "Document who collected evidence"
      - "Record date, time, location"
      - "Describe evidence collected"
      - "Track all transfers"
      - "Secure storage with access logs"

    custody_form:
      fields:
        - case_number
        - evidence_id
        - description
        - collected_by
        - collection_date
        - collection_location
        - hash_values
        - storage_location
        - transfer_history

  evidence_collection:
    order_of_volatility:
      - order: 1
        type: "Registers, cache"
        collection: "Specialized tools"
        volatility: "Nanoseconds"

      - order: 2
        type: "Memory (RAM)"
        collection: "Memory dump tools"
        volatility: "Power dependent"
        tools:
          - "FTK Imager"
          - "WinPmem"
          - "LiME (Linux)"

      - order: 3
        type: "Network state"
        collection: "Network commands"
        volatility: "Changes constantly"
        commands:
          windows:
            - "netstat -ano"
            - "arp -a"
            - "ipconfig /all"
          linux:
            - "netstat -anp"
            - "arp -a"
            - "ip addr"

      - order: 4
        type: "Running processes"
        collection: "Process listing"
        volatility: "Changes frequently"
        commands:
          windows:
            - "tasklist /v"
            - "wmic process list full"
          linux:
            - "ps auxww"
            - "lsof"

      - order: 5
        type: "Disk storage"
        collection: "Disk imaging"
        volatility: "Persistent"
        tools:
          - "dd"
          - "FTK Imager"
          - "EnCase"

      - order: 6
        type: "Logs"
        collection: "Log export"
        volatility: "May rotate"
        sources:
          - "System logs"
          - "Application logs"
          - "Security logs"
          - "SIEM exports"

  imaging_procedures:
    disk_imaging:
      steps:
        - "Connect write blocker"
        - "Verify source drive"
        - "Create forensic image"
        - "Generate hash values"
        - "Verify image integrity"
        - "Document process"

      commands:
        linux_dd: |
          dd if=/dev/sda of=/evidence/disk.img bs=4M conv=noerror,sync
          md5sum /dev/sda > source_hash.md5
          md5sum /evidence/disk.img > image_hash.md5

      verification: |
        Compare source and image hashes
        If match: Image verified
        If mismatch: Re-image required
```

## Tools & Templates

### Incident Response Checklist

```markdown
# Incident Response Quick Checklist

## Initial Response (First 15 minutes)
- [ ] Acknowledge alert in ticketing system
- [ ] Assess severity level (SEV-1 through SEV-4)
- [ ] Notify appropriate personnel per severity
- [ ] Begin incident log documentation
- [ ] Preserve volatile evidence if applicable

## Investigation (First hour)
- [ ] Gather available logs and alerts
- [ ] Identify affected systems
- [ ] Determine scope of compromise
- [ ] Identify indicators of compromise (IOCs)
- [ ] Document timeline of events

## Containment
- [ ] Isolate affected systems
- [ ] Block malicious IPs/domains
- [ ] Disable compromised accounts
- [ ] Implement emergency firewall rules
- [ ] Preserve evidence before changes

## Eradication
- [ ] Remove malware/unauthorized access
- [ ] Patch vulnerabilities exploited
- [ ] Reset compromised credentials
- [ ] Remove persistence mechanisms
- [ ] Verify clean system state

## Recovery
- [ ] Restore from clean backups
- [ ] Validate system integrity
- [ ] Implement enhanced monitoring
- [ ] Gradual service restoration
- [ ] User notification if required

## Post-Incident
- [ ] Complete incident documentation
- [ ] Conduct lessons learned meeting
- [ ] Update detection rules
- [ ] Implement improvements
- [ ] Archive evidence
```

### Incident Metrics Dashboard

```yaml
# incident-metrics.yaml
metrics:
  operational:
    - name: "Mean Time to Detect (MTTD)"
      calculation: "Average time from incident start to detection"
      target: "<24 hours"
      trend: "Decreasing"

    - name: "Mean Time to Respond (MTTR)"
      calculation: "Average time from detection to containment"
      target: "<4 hours"
      trend: "Decreasing"

    - name: "Mean Time to Recover"
      calculation: "Average time from containment to normal operations"
      target: "<24 hours"
      trend: "Decreasing"

  volume:
    - name: "Incidents per Month"
      breakdown_by:
        - "Severity"
        - "Category"
        - "Source"
      trend: "Context dependent"

    - name: "False Positive Rate"
      calculation: "False positives / Total alerts"
      target: "<10%"
      trend: "Decreasing"

  effectiveness:
    - name: "Containment Success Rate"
      calculation: "Incidents contained without spread"
      target: ">95%"

    - name: "Recurrence Rate"
      calculation: "Similar incidents within 90 days"
      target: "<5%"

    - name: "Evidence Preservation Rate"
      calculation: "Incidents with complete evidence"
      target: ">90%"
```

## Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Mean Time to Detect | <24 hours | Incident start to detection |
| Mean Time to Respond | <4 hours | Detection to containment |
| Mean Time to Recover | <24 hours | Containment to normal ops |
| Incident Resolution Rate | >95% | Resolved without escalation |
| False Positive Rate | <10% | Invalid alerts vs total |
| Post-Incident Review Rate | 100% | Reviews completed |
| Playbook Coverage | >90% | Incident types with playbooks |
| Training Currency | 100% | Team members trained annually |

## Common Pitfalls

1. **Delayed Response**: Waiting to confirm before acting
   - *Solution*: Predefined triggers and automatic escalation

2. **Evidence Destruction**: Rebooting or wiping before preservation
   - *Solution*: Evidence collection procedures before remediation

3. **Scope Creep**: Not identifying all affected systems
   - *Solution*: Thorough investigation before eradication

4. **Communication Gaps**: Stakeholders not informed
   - *Solution*: Predefined communication matrix and templates

5. **No Post-Incident Review**: Missing improvement opportunities
   - *Solution*: Mandatory lessons learned for all incidents

6. **Incomplete Documentation**: Unable to reconstruct events
   - *Solution*: Real-time logging during incident handling

## Integration Points

- **SIEM Systems**: Alert correlation and investigation
- **EDR Platforms**: Endpoint detection and response
- **Ticketing Systems**: Incident tracking and workflow
- **SOAR Platforms**: Automated response orchestration
- **Threat Intelligence**: IOC enrichment and context
- **Backup Systems**: Recovery capabilities
- **Legal/HR Systems**: Compliance and employee matters
- **Communication Platforms**: Stakeholder notification
