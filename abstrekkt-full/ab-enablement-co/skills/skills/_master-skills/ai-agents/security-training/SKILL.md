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

### Process 3: Training Content Development

```yaml
# training-content-development.yaml
content_development:
  content_principles:
    engagement:
      - "Use real-world examples"
      - "Include interactive elements"
      - "Keep modules under 10 minutes"
      - "Use storytelling techniques"
      - "Include gamification elements"

    relevance:
      - "Tailor to audience roles"
      - "Use current threat examples"
      - "Connect to job responsibilities"
      - "Include industry-specific scenarios"

    effectiveness:
      - "Clear learning objectives"
      - "Knowledge checks throughout"
      - "Practical application exercises"
      - "Immediate feedback"
      - "Spaced repetition"

  module_template:
    structure:
      - section: "Hook"
        duration: 30_seconds
        purpose: "Capture attention with relevant scenario"

      - section: "Learning objectives"
        duration: 30_seconds
        purpose: "Set expectations"

      - section: "Core content"
        duration: 5_minutes
        elements:
          - "Key concepts (3-5 max)"
          - "Visual examples"
          - "Dos and don'ts"
          - "Real incident examples"

      - section: "Interactive exercise"
        duration: 2_minutes
        elements:
          - "Scenario-based questions"
          - "Spot the phish exercises"
          - "Decision simulations"

      - section: "Knowledge check"
        duration: 1_minute
        elements:
          - "Quiz questions"
          - "Immediate feedback"
          - "Explanation of correct answers"

      - section: "Summary and action items"
        duration: 1_minute
        elements:
          - "Key takeaways"
          - "Specific actions to implement"
          - "Resources for more information"

  topic_library:
    core_topics:
      phishing:
        modules:
          - "Email phishing basics"
          - "Spear phishing recognition"
          - "Business email compromise"
          - "Reporting procedures"
        refresh: "Quarterly"

      password_security:
        modules:
          - "Password best practices"
          - "Multi-factor authentication"
          - "Password manager usage"
          - "Account recovery security"
        refresh: "Annually"

      data_protection:
        modules:
          - "Data classification"
          - "Secure data handling"
          - "Encryption basics"
          - "Secure disposal"
        refresh: "Annually"

      physical_security:
        modules:
          - "Tailgating prevention"
          - "Clean desk practices"
          - "Device security"
          - "Visitor management"
        refresh: "Annually"

      social_engineering:
        modules:
          - "Phone-based attacks"
          - "In-person manipulation"
          - "Pretexting recognition"
          - "Verification procedures"
        refresh: "Semi-annually"

    emerging_topics:
      - "AI-generated phishing"
      - "Deepfake awareness"
      - "QR code attacks"
      - "Mobile device threats"
      - "Remote work security"

  content_maintenance:
    review_cycle:
      - trigger: "Quarterly"
        action: "Review metrics and update scenarios"

      - trigger: "New threat emergence"
        action: "Develop rapid response module"

      - trigger: "Major incident"
        action: "Create lessons learned content"

      - trigger: "Annual"
        action: "Full curriculum review"

    quality_assurance:
      - "Subject matter expert review"
      - "Pilot testing with sample audience"
      - "Accessibility compliance check"
      - "Technical accuracy verification"
```

### Process 4: Program Measurement and Improvement

```yaml
# training-measurement-framework.yaml
measurement_framework:
  metrics_hierarchy:
    leading_indicators:
      - metric: "Training completion rate"
        target: "100% within deadline"
        measurement: "LMS completion tracking"

      - metric: "Phishing report rate"
        target: ">60%"
        measurement: "Simulation platform"

      - metric: "Quiz pass rate"
        target: ">90%"
        measurement: "LMS assessment scores"

      - metric: "Training satisfaction"
        target: ">4.0/5.0"
        measurement: "Post-training surveys"

    lagging_indicators:
      - metric: "Phishing click rate"
        target: "<5%"
        measurement: "Simulation platform"

      - metric: "Security incident rate"
        target: "Year over year decrease"
        measurement: "Incident management system"

      - metric: "Policy violation rate"
        target: "Year over year decrease"
        measurement: "HR and security records"

      - metric: "Audit findings"
        target: "Zero training-related findings"
        measurement: "Audit reports"

  effectiveness_assessment:
    knowledge_assessment:
      method: "Pre and post training quizzes"
      measurement: "Score improvement"
      target: ">20% improvement"

    behavior_assessment:
      method: "Phishing simulations and observations"
      measurement: "Behavioral change"
      metrics:
        - "Click rate change"
        - "Report rate change"
        - "Policy compliance"

    culture_assessment:
      method: "Annual security culture survey"
      dimensions:
        - "Security awareness"
        - "Responsibility perception"
        - "Reporting comfort"
        - "Risk awareness"
      target: "Year over year improvement"

  reporting_structure:
    operational_dashboard:
      audience: "Security team"
      frequency: "Real-time"
      metrics:
        - "Training completion status"
        - "Simulation results"
        - "Overdue training"
        - "High-risk users"

    management_report:
      audience: "Security leadership"
      frequency: "Monthly"
      content:
        - "Program progress"
        - "Key metrics trends"
        - "Risk areas"
        - "Recommendations"

    executive_report:
      audience: "C-suite"
      frequency: "Quarterly"
      content:
        - "Risk reduction achieved"
        - "Compliance status"
        - "Benchmark comparison"
        - "Investment ROI"

  continuous_improvement:
    feedback_loops:
      - source: "Training evaluations"
        action: "Content refinement"
        frequency: "Monthly"

      - source: "Simulation results"
        action: "Targeted training"
        frequency: "Per campaign"

      - source: "Incident analysis"
        action: "New training development"
        frequency: "Per incident"

      - source: "Threat intelligence"
        action: "Scenario updates"
        frequency: "Weekly"

    program_maturity:
      level_1_basic:
        characteristics:
          - "Annual compliance training"
          - "Basic phishing simulations"
          - "Minimal metrics"

      level_2_developing:
        characteristics:
          - "Role-based training"
          - "Regular simulations"
          - "Basic reporting"

      level_3_defined:
        characteristics:
          - "Comprehensive curriculum"
          - "Behavioral metrics"
          - "Continuous learning"

      level_4_managed:
        characteristics:
          - "Data-driven optimization"
          - "Integrated risk metrics"
          - "Culture measurement"

      level_5_optimizing:
        characteristics:
          - "Predictive analytics"
          - "Personalized learning"
          - "Industry leadership"
```

## Tools & Templates

### Security Awareness Training Policy

```markdown
# Security Awareness Training Policy

## 1. Purpose
Establish requirements for security awareness training to build a
security-conscious workforce that protects organizational assets.

## 2. Scope
All employees, contractors, and third parties with system access.

## 3. Training Requirements

### 3.1 New Employee Training
- Complete security fundamentals within first week
- Role-specific training within 30 days
- Phishing simulation enrollment immediately

### 3.2 Annual Training
- All employees complete annual refresher training
- Completion deadline: Anniversary of hire date
- Minimum passing score: 80%

### 3.3 Role-Based Training
- Developers: Secure coding (quarterly)
- Administrators: Security operations (quarterly)
- Finance: Fraud prevention (quarterly)
- Executives: Executive threats (semi-annual)

### 3.4 Phishing Simulations
- All employees participate in monthly simulations
- Click rate target: <5%
- Repeat clickers enrolled in remediation program

## 4. Compliance
- Completion tracking via LMS
- Non-compliance reported to management
- Continued non-compliance may affect system access

## 5. Roles
- **Security Team**: Program management and content
- **HR**: Enrollment and compliance tracking
- **Managers**: Team completion monitoring
- **Employees**: Active participation and completion

## 6. Review
Annual review or upon significant threat changes.
```

### Training Needs Assessment Survey

```yaml
# training-needs-assessment.yaml
assessment_survey:
  demographic_questions:
    - "Department"
    - "Role"
    - "Years with organization"
    - "Previous security training"

  knowledge_assessment:
    - question: "What should you do if you receive a suspicious email?"
      type: "multiple_choice"
      correct: "Report to security team"

    - question: "Which is a strong password?"
      type: "multiple_choice"
      correct: "Random 16+ characters with variety"

    - question: "What is multi-factor authentication?"
      type: "multiple_choice"
      correct: "Using two or more verification methods"

  self_assessment:
    - question: "How confident are you in identifying phishing emails?"
      type: "scale_1_5"

    - question: "How well do you understand data classification?"
      type: "scale_1_5"

    - question: "How comfortable are you reporting security concerns?"
      type: "scale_1_5"

  preference_questions:
    - question: "Preferred learning format?"
      options:
        - "Short videos (5-10 min)"
        - "Interactive modules"
        - "Live sessions"
        - "Reading materials"

    - question: "Best time for training?"
      options:
        - "Morning"
        - "Afternoon"
        - "Flexible/self-paced"

  open_questions:
    - "What security topics concern you most?"
    - "What security training would be most valuable?"
    - "Any barriers to completing security training?"
```

## Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Training Completion | 100% | LMS completion records |
| Phishing Click Rate | <5% | Simulation platform |
| Phishing Report Rate | >60% | Simulation platform |
| Quiz Pass Rate | >90% | LMS assessments |
| Training Satisfaction | >4.0/5.0 | Post-training surveys |
| Repeat Clicker Rate | <3% | Simulation platform |
| Time to Complete | <14 days | LMS tracking |
| Incident Reduction | 20% YoY | Incident management |

## Common Pitfalls

1. **Compliance-Only Focus**: Training for checkbox, not behavior change
   - *Solution*: Focus on metrics that measure behavioral change

2. **One-Size-Fits-All**: Same training for all roles
   - *Solution*: Role-based and risk-based training paths

3. **Annual-Only Training**: Single training event per year
   - *Solution*: Continuous learning with micro-modules

4. **Boring Content**: Low engagement, poor retention
   - *Solution*: Interactive, relevant, story-based content

5. **No Measurement**: Unable to demonstrate effectiveness
   - *Solution*: Comprehensive metrics framework

6. **Punitive Approach**: Shaming users who fail simulations
   - *Solution*: Supportive, educational approach

## Integration Points

- **Learning Management System (LMS)**: Training delivery and tracking
- **Email Security Platform**: Phishing simulation integration
- **HR Systems**: Employee data and compliance tracking
- **Identity Management**: Training-based access decisions
- **Incident Management**: Trigger training from incidents
- **Ticketing Systems**: Training request workflow
- **Communication Platforms**: Awareness campaign delivery
