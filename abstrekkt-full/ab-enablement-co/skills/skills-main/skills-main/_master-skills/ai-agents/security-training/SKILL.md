---
name: security-training
description: Comprehensive security awareness training program design and implementation. Use when developing security training curricula, implementing phishing simulations, measuring security culture, building role-based training programs, or improving security awareness metrics.
---

# Security Training

## Overview

Security training transforms employees from security liabilities into active defenders through structured education, practical exercises, and continuous reinforcement. It addresses the human element of security by building awareness, skills, and behaviors that protect organizational assets.

Effective security training goes beyond annual compliance checkboxes to create a security-conscious culture. It combines awareness campaigns, targeted training, simulated attacks, and behavioral reinforcement to achieve measurable risk reduction.

Modern security training addresses diverse threats including phishing, social engineering, insider threats, data handling, and emerging attack vectors. Programs must adapt to different roles, learning styles, and risk profiles while maintaining engagement and measuring effectiveness.

### Why This Matters

- **Human Firewall**: Employees are both the weakest link and strongest defense
- **Compliance Requirements**: Meet regulatory training mandates (HIPAA, PCI-DSS, etc.)
- **Phishing Defense**: 90%+ of breaches involve human interaction
- **Culture Building**: Create security-positive organizational culture
- **Risk Reduction**: Trained employees make fewer security mistakes
- **Incident Prevention**: Recognition leads to reporting and prevention

## When to Use

### Primary Triggers

- Launching enterprise security awareness program
- Responding to increased phishing incidents
- Meeting compliance training requirements
- Onboarding new employees
- Addressing security audit findings
- Improving security culture metrics

### Specific Use Cases

1. **New Employee Onboarding**: Security fundamentals training
2. **Annual Compliance Training**: Regulatory requirement fulfillment
3. **Phishing Simulations**: Testing and training email security
4. **Role-Based Training**: Specialized training for high-risk roles
5. **Incident-Triggered Training**: Response to security events
6. **Security Champions Program**: Building internal advocates

## Core Processes

### Process 1: Training Program Framework

Design comprehensive security training program structure.

```yaml
# security-training-framework.yaml
training_framework:
  program_tiers:
    foundation_tier:
      audience: "All employees"
      objective: "Basic security awareness"
      frequency: "Onboarding + Annual"
      duration: "60 minutes initial, 30 minutes annual"

      topics:
        - module: "Security Fundamentals"
          duration: 15
          content:
            - "Why security matters"
            - "Threat landscape overview"
            - "Your role in security"
            - "Reporting procedures"

        - module: "Password and Authentication"
          duration: 10
          content:
            - "Strong password creation"
            - "Multi-factor authentication"
            - "Password managers"
            - "Credential protection"

        - module: "Phishing and Social Engineering"
          duration: 15
          content:
            - "Recognizing phishing emails"
            - "Social engineering tactics"
            - "Verification procedures"
            - "Reporting suspicious messages"

        - module: "Data Protection"
          duration: 10
          content:
            - "Data classification"
            - "Handling sensitive information"
            - "Secure file sharing"
            - "Data disposal"

        - module: "Physical Security"
          duration: 10
          content:
            - "Workspace security"
            - "Device protection"
            - "Visitor procedures"
            - "Clean desk policy"

    role_based_tier:
      audiences:
        developers:
          topics:
            - "Secure coding practices"
            - "OWASP Top 10"
            - "Secrets management"
            - "Security testing"
          frequency: "Quarterly"
          duration: "2 hours"

        system_administrators:
          topics:
            - "Secure configuration"
            - "Patch management"
            - "Access control"
            - "Log monitoring"
          frequency: "Quarterly"
          duration: "2 hours"

        finance_team:
          topics:
            - "Business email compromise"
            - "Wire fraud prevention"
            - "Invoice verification"
            - "Financial data protection"
          frequency: "Quarterly"
          duration: "1 hour"

        executives:
          topics:
            - "Executive targeting (whaling)"
            - "Board-level security"
            - "Incident response roles"
            - "Security investment"
          frequency: "Semi-annual"
          duration: "30 minutes"

        customer_service:
          topics:
            - "Customer data handling"
            - "Social engineering recognition"
            - "Verification procedures"
            - "Privacy requirements"
          frequency: "Quarterly"
          duration: "1 hour"

    advanced_tier:
      audience: "Security team and champions"
      topics:
        - "Advanced threat analysis"
        - "Incident response procedures"
        - "Security tool proficiency"
        - "Threat hunting basics"
      frequency: "Monthly"
      duration: "4 hours"

  delivery_methods:
    e_learning:
      platforms: ["LMS", "Security awareness platform"]
      advantages:
        - "Self-paced"
        - "Trackable completion"
        - "Consistent content"
      best_for: "Foundation training, compliance"

    instructor_led:
      formats: ["In-person", "Virtual"]
      advantages:
        - "Interactive discussion"
        - "Q&A capability"
        - "Hands-on exercises"
      best_for: "Role-based training, complex topics"

    micro_learning:
      format: "Short modules (3-5 minutes)"
      frequency: "Weekly"
      advantages:
        - "High engagement"
        - "Continuous reinforcement"
        - "Just-in-time learning"
      best_for: "Awareness maintenance, new threats"

    simulations:
      types:
        - "Phishing simulations"
        - "Social engineering tests"
        - "Physical security tests"
      advantages:
        - "Practical experience"
        - "Behavioral measurement"
        - "Targeted remediation"
      best_for: "Skill validation, high-risk users"
```

### Process 2: Phishing Simulation Program

```yaml
# phishing-simulation-program.yaml
phishing_program:
  program_structure:
    frequency: "Monthly"
    target_population: "All employees"
    simulation_types:
      - type: "Credential harvesting"
        difficulty_levels: ["Easy", "Medium", "Hard"]
        example_scenarios:
          easy: "Password expiration notice"
          medium: "IT support request"
          hard: "Personalized executive request"

      - type: "Malware delivery"
        difficulty_levels: ["Easy", "Medium", "Hard"]
        example_scenarios:
          easy: "Invoice attachment"
          medium: "Job application document"
          hard: "Encrypted file from known sender"

      - type: "Business email compromise"
        difficulty_levels: ["Medium", "Hard"]
        example_scenarios:
          medium: "Wire transfer request"
          hard: "Spoofed executive request"

  simulation_design:
    difficulty_progression:
      month_1_3:
        difficulty: "Easy"
        purpose: "Establish baseline"
        indicators:
          - "Generic greeting"
          - "Obvious spelling errors"
          - "Suspicious sender domain"

      month_4_6:
        difficulty: "Medium"
        purpose: "Build recognition skills"
        indicators:
          - "Personalized content"
          - "Legitimate-looking domain"
          - "Urgency language"

      month_7_12:
        difficulty: "Hard"
        purpose: "Advanced threat simulation"
        indicators:
          - "Spoofed trusted sender"
          - "Context-aware content"
          - "Professional appearance"

    template_requirements:
      - "Current threat intelligence"
      - "Industry-relevant scenarios"
      - "Varying difficulty levels"
      - "Multiple click indicators"
      - "Realistic landing pages"

  response_workflow:
    click_response:
      immediate:
        - "Display educational landing page"
        - "Show what they missed"
        - "Provide correct action"

      follow_up:
        - "Assign remediation training"
        - "Track completion"
        - "Schedule follow-up simulation"

    report_response:
      immediate:
        - "Acknowledge report"
        - "Provide positive feedback"
        - "Award recognition points"

      tracking:
        - "Log reporter identity"
        - "Track report timing"
        - "Monitor reporting trends"

    credential_submission:
      immediate:
        - "Display warning page"
        - "Require password change"
        - "Assign intensive training"

      follow_up:
        - "Manager notification"
        - "Security team review"
        - "Mandatory training completion"

  metrics_tracking:
    primary_metrics:
      - name: "Click rate"
        calculation: "Clicked / Sent * 100"
        target: "<5%"
        trend: "Decreasing"

      - name: "Report rate"
        calculation: "Reported / Sent * 100"
        target: ">60%"
        trend: "Increasing"

      - name: "Credential submission rate"
        calculation: "Submitted / Sent * 100"
        target: "<1%"
        trend: "Decreasing"

    derived_metrics:
      - name: "Resilience ratio"
        calculation: "Report rate / Click rate"
        target: ">10"

      - name: "Time to report"
        calculation: "Average time from receipt to report"
        target: "<10 minutes"

    segmentation:
      - "By department"
      - "By role"
      - "By location"
      - "By tenure"
      - "By previous performance"

  repeat_clicker_program:
    definition: "Clicked 3+ simulations in 12 months"

    interventions:
      first_repeat:
        - "Mandatory training module"
        - "Manager notification"
        - "Increased simulation frequency"

      second_repeat:
        - "One-on-one coaching"
        - "Enhanced email filtering"
        - "Monthly progress check"

      third_repeat:
        - "HR involvement"
        - "Access restrictions considered"
        - "Performance documentation"

    support_measures:
      - "Personalized training path"
      - "Desktop phishing indicators"
      - "Direct security team contact"
```


## References
- `references/process-3-training-content-development.md` — Process 3: Training Content Development
- `references/references.md` — References
- `references/tools-templates.md` — Tools & Templates
