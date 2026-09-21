---
name: education-technology
description: Design and optimize education technology platforms including learning management systems, curriculum frameworks, student engagement strategies, and learning analytics. Build assessment models, implement adaptive learning paths, and measure educational outcomes. Use when navigating industry-specific regulations, processes, or operations.
---

# Education Technology Skill

> LMS design, curriculum frameworks, learning analytics, and student engagement for EdTech platforms and institutions

## Description

This skill provides comprehensive guidance for education technology spanning learning management system design, curriculum development, assessment frameworks, student engagement strategies, and learning analytics. It covers instructional design methodologies, accessibility compliance, content delivery optimization, adaptive learning implementation, and outcome measurement across K-12, higher education, corporate training, and lifelong learning contexts. The skill supports EdTech product managers, instructional designers, learning engineers, curriculum developers, and institutional technology leaders in building effective, accessible, and data-informed educational experiences that drive measurable learning outcomes.

## Activation Triggers

- User mentions "EdTech", "education technology", "e-learning", or "online learning"
- User asks about learning management systems, LMS configuration, or LMS selection
- User discusses curriculum design, course development, or instructional design
- User needs help with student engagement, completion rates, or learner retention
- User asks about learning analytics, outcome measurement, or assessment design
- User mentions adaptive learning, personalized learning paths, or competency-based education
- User discusses accessibility in education, WCAG compliance, or Section 508 for learning
- User asks about content standards like SCORM, xAPI, LTI, or QTI
- User mentions accreditation requirements, quality assurance, or program evaluation
- User discusses corporate training, professional development, or workforce learning platforms

## Instructions

### Core Workflow

1. **Learning Needs Analysis**
   - Identify target learner demographics, prior knowledge levels, and learning context
   - Define measurable learning objectives aligned to institutional goals or competency frameworks
   - Assess current technology infrastructure, integration requirements, and platform constraints
   - Evaluate content delivery modality requirements (synchronous, asynchronous, hybrid, mobile)
   - Determine accessibility requirements including WCAG 2.1 AA, Section 508, and ADA compliance

2. **Curriculum and Content Design**
   - Structure curriculum using backward design (Wiggins & McTighe) starting from desired outcomes
   - Decompose learning objectives into modules, units, and individual learning activities
   - Select appropriate instructional strategies aligned to Bloom's taxonomy cognitive levels
   - Design assessment instruments mapped to learning objectives with validity and reliability measures
   - Create content templates ensuring consistency, brand alignment, and accessibility compliance

3. **Platform Architecture and Integration**
   - Select or configure LMS capabilities matching pedagogical requirements and scale needs
   - Implement interoperability standards (LTI 1.3, SCORM 2004, xAPI, Caliper, QTI)
   - Design user roles, permissions, and enrollment workflows for all stakeholder types
   - Integrate with student information systems, authentication providers, and analytics platforms
   - Configure content delivery for performance across bandwidth and device constraints

4. **Engagement and Delivery Optimization**
   - Implement engagement mechanics including progress tracking, notifications, and social learning
   - Design adaptive learning paths based on diagnostic assessment and ongoing performance data
   - Build communication workflows for announcements, reminders, and intervention triggers
   - Create instructor dashboards with actionable student progress and at-risk indicators
   - Optimize content for mobile delivery and offline access where required

5. **Analytics and Continuous Improvement**
   - Define key learning metrics: completion rates, assessment scores, time-on-task, engagement frequency
   - Implement learning analytics dashboards for instructors, administrators, and learners
   - Build predictive models for at-risk student identification and early intervention
   - Conduct course evaluation cycles incorporating learner feedback and outcome data
   - Iterate on curriculum design based on item analysis, engagement patterns, and learning outcomes

### Instructional Design Framework

```yaml
instructional_design:
  backward_design:
    stage_1_desired_results:
      established_goals: "Institutional outcomes, accreditation standards, competency frameworks"
      understandings: "Big ideas and core concepts students should grasp"
      essential_questions: "Provocative questions that drive inquiry and transfer"
      knowledge_and_skills: "Specific facts, concepts, and procedures to acquire"

    stage_2_assessment_evidence:
      performance_tasks:
        - Authentic tasks demonstrating transfer of learning
        - Rubric-based evaluation with clear proficiency levels
        - Portfolio artifacts showing growth over time
      other_evidence:
        - Quizzes and tests aligned to specific objectives
        - Self-assessments and reflective journals
        - Peer evaluations and collaborative artifacts
        - Formative checks for understanding

    stage_3_learning_plan:
      whereto_elements:
        w: "Where are we going and why?"
        h: "Hook and hold student interest"
        e_explore: "Equip, experience, explore"
        r: "Rethink, reflect, revise"
        e_evaluate: "Evaluate and self-assess"
        t: "Tailor to individual needs"
        o: "Organize for maximum engagement"

  blooms_taxonomy:
    cognitive_levels:
      remember: "Retrieve relevant knowledge - define, list, recall, identify"
      understand: "Construct meaning - explain, summarize, classify, compare"
      apply: "Use in new situations - execute, implement, solve, demonstrate"
      analyze: "Break into parts - differentiate, organize, attribute, deconstruct"
      evaluate: "Make judgments - check, critique, judge, justify"
      create: "Produce new work - generate, plan, design, construct"

  engagement_strategies:
    active_learning:
      - Think-pair-share and structured peer discussion
      - Problem-based learning with authentic scenarios
      - Case study analysis with multiple perspectives
      - Simulation and role-play exercises
      - Collaborative document creation and wiki building

    gamification:
      elements:
        points: "Award for activity completion, quality submissions"
        badges: "Recognize milestone achievements and mastery"
        progress_bars: "Visual completion tracking for modules and courses"
      cautions:
        - Align game mechanics to learning objectives, not just engagement
        - Ensure accessibility of gamified elements

    social_learning:
      - Discussion forums with structured prompts and response requirements
      - Peer review assignments with rubrics and feedback guidelines
      - Study groups with collaborative workspaces
```

### Learning Analytics Framework

```yaml
learning_analytics:
  data_collection:
    interaction_data:
      - Login frequency and session duration
      - Content access patterns and navigation paths
      - Video engagement (play, pause, seek, completion rate)
      - Assessment attempts, scores, and time-on-task
      - Discussion participation (posts, replies, views)
      - Resource downloads and external link clicks

    standards:
      xapi:
        description: "Experience API - tracks learning activities as actor-verb-object statements"
        use_case: "Cross-platform learning activity tracking, informal learning"
        statement_format: "Actor (learner) + Verb (completed) + Object (quiz) + Context + Result"
      caliper:
        description: "IMS Caliper Analytics - structured learning events with metric profiles"
        use_case: "Institutional analytics, standardized event taxonomy"
      scorm:
        description: "Sharable Content Object Reference Model - content-LMS communication"
        use_case: "Legacy content tracking, completion and score reporting"

  analytics_levels:
    descriptive: "What happened - completion rates, scores, engagement heatmaps"
    diagnostic: "Why it happened - item analysis, drop-off points, performance correlations"
    predictive: "What will happen - at-risk identification, completion probability, enrollment forecasting"
    prescriptive: "What to do - intervention triggers, adaptive recommendations, resource allocation"

  key_metrics:
    engagement:
      login_frequency: "Sessions per week per active learner"
      content_completion: "% of assigned content accessed/completed"
      time_on_task: "Minutes spent in learning activities vs. expected"
      discussion_participation: "Posts per learner per discussion prompt"

    achievement:
      course_completion_rate: "% of enrolled learners completing course"
      assessment_pass_rate: "% achieving minimum proficiency score"
      average_score: "Mean assessment score across cohort"
      mastery_rate: "% achieving mastery-level performance on objectives"

    satisfaction:
      course_rating: "End-of-course evaluation score (typically 1-5 scale)"
      net_promoter_score: "Likelihood to recommend (NPS calculation)"
      qualitative_feedback: "Thematic analysis of open-ended responses"

  at_risk_indicators:
    early_warning_signals:
      - No login within first 3 days of course start
      - Less than 50% content completion by week 2
      - Failed first summative assessment
      - Zero discussion posts by required deadline
      - Declining login frequency over 2+ consecutive weeks
    intervention_actions:
      - Automated email with personalized support resources
      - Instructor notification via dashboard alert
      - Academic advisor referral for persistent risk signals
      - Peer mentor assignment for social support
      - Tutoring service connection for content-specific struggles
```

### Templates

#### Course Design Document
```markdown
# Course Design Document: [Course Title]

## Course Overview
- Course Code: [Code]
- Credit Hours / CEUs: [Count]
- Modality: [Online / Hybrid / In-Person]
- Duration: [Weeks]
- Target Audience: [Description]
- Prerequisites: [List]

## Learning Outcomes
Upon successful completion, learners will be able to:
1. [Outcome 1 - Bloom's level, assessment method]
2. [Outcome 2 - Bloom's level, assessment method]
3. [Outcome 3 - Bloom's level, assessment method]

## Module Structure
| Module | Topic | Objectives | Activities | Assessment | Duration |
|--------|-------|-----------|------------|-----------|----------|
| 1 | [Topic] | [Obj refs] | [Activity types] | [Assessment type] | [Hours] |
| 2 | [Topic] | [Obj refs] | [Activity types] | [Assessment type] | [Hours] |

## Assessment Plan
| Assessment | Weight | Objective Alignment | Format | Due |
|-----------|--------|-------------------|--------|-----|
| [Assessment 1] | [%] | [Obj 1, 2] | [Format] | [Week] |
| [Assessment 2] | [%] | [Obj 2, 3] | [Format] | [Week] |
| [Final Project] | [%] | [All] | [Format] | [Week] |

## Technology Requirements
- LMS: [Platform]
- Integrations: [Tools]
- Browser/Device: [Requirements]
- Accessibility: [WCAG 2.1 AA compliance details]
```

#### Learning Analytics Dashboard Specification
```markdown
# Learning Analytics Dashboard: [Program/Course Name]

## Instructor View
| Widget | Metric | Visualization | Update Frequency |
|--------|--------|-------------|-----------------|
| Enrollment Summary | Active / Inactive / Completed | Donut chart | Real-time |
| Completion Progress | Module completion distribution | Stacked bar | Daily |
| At-Risk Students | Count and list with risk factors | Table with flags | Daily |
| Assessment Performance | Score distribution by assessment | Box plot | Post-submission |
| Engagement Trend | Weekly login and activity trend | Line chart | Weekly |

## Learner View
| Widget | Metric | Visualization | Purpose |
|--------|--------|-------------|---------|
| My Progress | Modules completed vs. total | Progress bar | Self-monitoring |
| Grade Tracker | Current grade and component scores | Gauge + table | Goal awareness |
| Time Investment | Hours this week vs. recommended | Bar comparison | Self-regulation |
| Peer Comparison | Anonymous percentile ranking | Histogram | Benchmarking |

## Administrator View
| Widget | Metric | Visualization | Granularity |
|--------|--------|-------------|-------------|
| Program Completion | Rates by cohort and program | Heat map | Program > Course |
| Outcome Achievement | % meeting learning outcomes | Scorecard | Program-level |
| Enrollment Funnel | Registered > Started > Active > Completed | Funnel | Program > Course |
| Satisfaction Trends | NPS and ratings over time | Line + trend | Term-over-term |
```

### Best Practices

1. **Outcomes-First Design**: Always begin course design with measurable learning outcomes before selecting content or activities; outcomes drive everything
2. **Accessibility by Default**: Design for WCAG 2.1 AA from the start rather than retrofitting; include captions, alt text, keyboard navigation, and screen reader compatibility
3. **Chunked Content Delivery**: Break content into 5-15 minute segments for optimal retention; microlearning improves completion rates by 20-30% vs. long-form lectures
4. **Assessment Validity**: Ensure every assessment item maps directly to a stated learning objective; conduct regular item analysis to identify poor discriminators
5. **Early Engagement Monitoring**: Implement week-1 and week-2 engagement checks as the strongest predictors of course completion; intervene immediately for non-starters
6. **Universal Design for Learning**: Provide multiple means of representation, action/expression, and engagement (UDL framework) to serve diverse learner needs
7. **Feedback Timeliness**: Provide formative assessment feedback within 48 hours; immediate feedback on auto-graded items and meaningful instructor feedback on complex work
8. **Mobile-First Content**: Design content to function fully on mobile devices; over 60% of learner access occurs on smartphones or tablets in many programs
9. **Interoperability Standards**: Use LTI 1.3 for tool integration, xAPI for activity tracking, and QTI for assessment portability to avoid vendor lock-in
10. **Iterative Course Improvement**: Conduct formal course reviews after each offering using completion data, assessment analytics, and learner feedback to drive specific revisions
11. **Privacy and FERPA Compliance**: Protect student educational records per FERPA; anonymize analytics for research and ensure data minimization in third-party integrations
12. **Instructor Training**: Invest in faculty and facilitator development for online pedagogy; technology proficiency alone does not produce effective online instruction
13. **Spaced Repetition for Retention**: Incorporate spaced practice and retrieval exercises throughout courses; distributed practice produces 50%+ better long-term retention than massed study

### Common Patterns

#### Pattern 1: LMS Migration Planning
```
Scenario: A university is migrating from a legacy LMS to a modern
cloud-based platform serving 25,000 students and 2,000 faculty.

Process:
1. Inventory current LMS usage: 4,200 active courses, 850 with custom integrations
2. Audit content standards: 60% SCORM, 15% native, 25% linked external content
3. Map feature requirements: gradebook, rubrics, plagiarism detection, video, analytics
4. Evaluate LTI integrations: identify 23 tools requiring LTI 1.3 reconfiguration
5. Design migration waves: pilot (50 courses), early adopters (500), full migration (3,650)
6. Build faculty training program: self-paced orientation + live workshops + sandbox courses
7. Execute pilot with volunteer faculty, collect feedback, adjust migration procedures
8. Create automated content migration scripts for SCORM packages and gradebook structures
9. Establish parallel operation period: old and new LMS run simultaneously for one semester
10. Decommission legacy system after final grade transfer validation and archive
```

#### Pattern 2: At-Risk Student Intervention Program
```
Scenario: An online degree program has a 62% completion rate and wants
to implement analytics-driven interventions to reach 75%.

Process:
1. Analyze historical data: identify behavioral patterns distinguishing completers vs. non-completers
2. Key predictors identified: week-1 login (strongest), first assignment submission, discussion posts
3. Build risk scoring model using logistic regression on 3 semesters of historical data
4. Model achieves 78% accuracy in predicting non-completion by end of week 2
5. Design intervention tiers: automated nudge (low risk), advisor outreach (medium), faculty call (high)
6. Implement automated alerts: flag students with no week-1 login within 48 hours
7. Deploy advisor dashboard showing risk scores, engagement metrics, and intervention history
8. Train advisors on intervention scripts and warm handoff to tutoring services
9. Pilot in 3 programs (n=1,200 students): completion rate improves from 62% to 71%
10. Refine model with pilot data, expand to all programs, target 75%+ completion rate
```

### Output Formats

#### Program Effectiveness Report
```markdown
# Program Effectiveness Report: [Program Name] - [Term]

## Enrollment and Completion
| Metric | Current Term | Prior Term | YoY Change | Target |
|--------|-------------|-----------|------------|--------|
| Enrolled | [Count] | [Count] | [%] | [Count] |
| Active (>1 login/week) | [Count] | [Count] | [%] | [Count] |
| Completed | [Count] | [Count] | [%] | [Count] |
| Completion Rate | [%] | [%] | [pts] | [%] |

## Learning Outcome Achievement
| Outcome | % Proficient | % Mastery | Assessment Method | Benchmark |
|---------|-------------|-----------|------------------|-----------|
| [Outcome 1] | [%] | [%] | [Method] | [%] |
| [Outcome 2] | [%] | [%] | [Method] | [%] |

## Satisfaction
| Metric | Score | Prior Term | Benchmark |
|--------|-------|-----------|-----------|
| Overall Satisfaction | [Score/5] | [Score/5] | [Score/5] |
| NPS | [Score] | [Score] | [Score] |
| Would Recommend | [%] | [%] | [%] |
```

#### Accessibility Compliance Audit
```markdown
# Accessibility Audit: [Course/Platform Name]

## WCAG 2.1 AA Compliance Summary
| Category | Items Tested | Pass | Fail | N/A | Compliance % |
|----------|-------------|------|------|-----|-------------|
| Perceivable | [Count] | [Count] | [Count] | [Count] | [%] |
| Operable | [Count] | [Count] | [Count] | [Count] | [%] |
| Understandable | [Count] | [Count] | [Count] | [Count] | [%] |
| Robust | [Count] | [Count] | [Count] | [Count] | [%] |

## Issues Found
| ID | Criterion | Severity | Description | Remediation | Owner |
|----|-----------|----------|-------------|-------------|-------|
| A-01 | [WCAG ref] | [High/Med/Low] | [Description] | [Fix] | [Name] |
```

## Integration Points

- Learning management systems (Canvas, Blackboard, Moodle, D2L Brightspace)
- Student information systems (Banner, PeopleSoft, Workday Student)
- Video platforms (Panopto, Kaltura, YuJa, Zoom)
- Assessment tools (Respondus, Turnitin, Proctorio, ExamSoft)
- Content authoring (Articulate, Adobe Captivate, H5P, iSpring)
- Analytics platforms (Civitas Learning, Blackboard Analytics, Watershed)
- Accessibility tools (Ally, Pope Tech, SiteImprove, UDOIT)
- SSO and identity (Shibboleth, CAS, Azure AD, Okta)

## Version History

- 1.0.0: Initial education technology skill with instructional design, LMS, and learning analytics
