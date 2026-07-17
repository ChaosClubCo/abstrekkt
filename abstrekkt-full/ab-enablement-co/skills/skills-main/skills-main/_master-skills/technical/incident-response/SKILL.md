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


## References
- `references/process-3-communication-framework.md` — Process 3: Communication Framework
- `references/references.md` — References
- `references/tools-templates.md` — Tools & Templates
