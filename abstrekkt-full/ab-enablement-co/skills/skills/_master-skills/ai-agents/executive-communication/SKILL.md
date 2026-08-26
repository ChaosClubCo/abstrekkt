---
name: executive-communication
description: Helps configure and build executive communication processes. Strategic all-hands meetings, town halls, and leadership communications that align, inspire, and mobilize the organization. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Executive Communication

> Strategic all-hands meetings, town halls, and leadership communications that align, inspire, and mobilize the organization.

## Metadata

- **Skill ID**: executive-communication
- **Category**: Back of House - Executive Operations
- **Complexity Level**: Advanced
- **Prerequisites**:
  - Leadership presence
  - Strategic messaging fundamentals
  - Audience analysis
  - Public speaking capability

## Overview

Executive Communication encompasses the strategic planning and execution of leadership communications that cascade vision, strategy, and organizational updates across the company. This skill covers all-hands meetings, town halls, leadership announcements, and internal messaging that shapes organizational understanding and engagement.

## Core Capabilities

### 1. All-Hands Meeting Design

**All-Hands Structure Framework**
```markdown
## All-Hands Meeting Blueprint

### Pre-Meeting (15 minutes before)
- Tech check and presenter prep
- Early join music/slides
- Informal welcome as people join

### Opening (5-10 minutes)
- Warm welcome and context
- Meeting objectives
- Quick pulse check/engagement moment

### Business Update (15-20 minutes)
- Key metrics and performance
- Strategic highlights
- Customer/market insights
- Competitive landscape

### Strategic Focus (10-15 minutes)
- Deep dive on priority topic
- Guest speaker or demo
- Story or case study
- Learning moment

### Team Spotlight (5-10 minutes)
- Celebrate wins and contributors
- New hire introductions
- Milestone recognition
- Cultural moment

### Looking Ahead (5-10 minutes)
- Upcoming priorities
- Key dates and events
- Call to action
- Transition to Q&A

### Q&A Session (15-20 minutes)
- Live questions
- Pre-submitted questions
- Anonymous question handling
- Clear action items

### Closing (3-5 minutes)
- Summary of key takeaways
- Reminder of resources
- Next meeting date
- Energizing close
```

**Cadence Planning**
```yaml
all_hands_cadence:
  company_wide:
    frequency: "Monthly or Bi-weekly"
    duration: "60-90 minutes"
    format: "Hybrid (in-person + virtual)"
    timing: "Mid-week, mid-day works best"

  division_level:
    frequency: "Bi-weekly or Weekly"
    duration: "30-45 minutes"
    format: "Virtual-first"
    timing: "Consistent day/time"

  leadership_only:
    frequency: "Weekly"
    duration: "30-60 minutes"
    format: "Video on, smaller group"
    timing: "Early week preferred"

  special_events:
    triggers:
      - "Major announcement"
      - "Quarterly results"
      - "Crisis situation"
      - "Organizational change"
    notice: "As appropriate to situation"
```

### 2. Town Hall Execution

**Town Hall Formats**
```markdown
## Town Hall Format Options

### Traditional Town Hall
- CEO-led presentation
- Department updates
- Extended Q&A
- Best for: Regular cadence, broad updates

### Fireside Chat
- Interview-style with moderator
- Conversational tone
- Audience questions drive content
- Best for: Building connection, difficult topics

### Panel Discussion
- Multiple leaders on stage
- Cross-functional perspectives
- Moderated conversation
- Best for: Complex topics, diverse viewpoints

### Town Hall with Workshop
- Brief update followed by
- Breakout discussions
- Report-back session
- Best for: Input gathering, engagement

### Ask Me Anything (AMA)
- Minimal prepared content
- All Q&A format
- Real-time responses
- Best for: Transparency, trust building

### Showcase/Demo Format
- Product or customer focus
- Live demonstrations
- Impact storytelling
- Best for: Momentum, excitement
```

**Q&A Management**
```yaml
qa_excellence:
  question_sourcing:
    live_questions:
      - "Raised hands (in-person)"
      - "Chat/Slido submission"
      - "Moderated queue"

    pre_submitted:
      - "Anonymous submission form"
      - "Themed question requests"
      - "Upvoting mechanism"

  question_handling:
    principles:
      - "Acknowledge all questions"
      - "Be honest when unsure"
      - "Follow up on commitments"
      - "Address tough questions"

    difficult_questions:
      approach:
        - "Thank the questioner"
        - "Restate for clarity"
        - "Be direct and honest"
        - "Acknowledge limitations"
        - "Commit to follow-up if needed"

  post_meeting:
    - "Publish answered questions"
    - "Address unanswered items"
    - "Track action items"
    - "Close the loop publicly"
```

### 3. Leadership Messaging Strategy

**Message Architecture**
```markdown
## Leadership Message Framework

### Core Message Components

1. **The Why (Context)**
   - Why are we communicating?
   - What triggered this message?
   - What's the background?

2. **The What (Content)**
   - What exactly is changing/happening?
   - What are the key details?
   - What should people know?

3. **The Impact (Significance)**
   - What does this mean for the company?
   - What does this mean for teams?
   - What does this mean for individuals?

4. **The How (Action)**
   - What happens next?
   - What should people do?
   - Where can they learn more?

5. **The Support (Resources)**
   - Who can they talk to?
   - What resources are available?
   - How will questions be handled?
```

**Message Cascading**
```yaml
cascade_strategy:
  tier_1_leadership:
    timing: "First, before announcement"
    format: "Live meeting or call"
    content: "Full context, talking points, Q&A"
    responsibility: "Cascade to their teams"

  tier_2_managers:
    timing: "Shortly after Tier 1"
    format: "Written + live briefing"
    content: "Key messages, FAQs, guidelines"
    responsibility: "Team discussions, questions"

  tier_3_all_employees:
    timing: "After managers briefed"
    format: "All-hands or written"
    content: "Core message, resources, support"
    follow_up: "Q&A opportunities"

  cascade_timing:
    ideal_sequence:
      - "Board/executives (if needed)"
      - "Senior leadership (same day)"
      - "Managers (within 24 hours)"
      - "All employees (within 48 hours)"
```

## Implementation Workflows

### All-Hands Preparation

**Preparation Timeline**
```markdown
## All-Hands Prep Checklist

### T-2 Weeks
- [ ] Confirm date, time, platform
- [ ] Identify key topics and themes
- [ ] Request content from departments
- [ ] Schedule speaker prep sessions
- [ ] Open question submission

### T-1 Week
- [ ] First draft of agenda
- [ ] Content collection deadline
- [ ] Speaker talking points review
- [ ] Slide deck development
- [ ] Technical dry run scheduled

### T-3 Days
- [ ] Finalize slides
- [ ] Complete speaker rehearsal
- [ ] Review submitted questions
- [ ] Prepare Q&A anticipation doc
- [ ] Send reminder and agenda

### T-1 Day
- [ ] Final deck review
- [ ] Tech platform test
- [ ] Backup plans confirmed
- [ ] Facilitator briefed
- [ ] Final reminder sent

### Day Of
- [ ] Early setup and testing
- [ ] Speaker check-in
- [ ] Recording started
- [ ] Engagement tools ready
- [ ] Backup slides accessible
```

### Message Crafting Process

**Executive Message Development**
```yaml
message_development:
  step_1_context:
    gather:
      - "What's the situation?"
      - "Who's the audience?"
      - "What's the goal?"
      - "What are sensitivities?"
    output: "Message brief"

  step_2_draft:
    approach:
      - "Start with key takeaway"
      - "Use simple language"
      - "Lead with empathy"
      - "Be specific and concrete"
      - "Include clear next steps"
    output: "First draft"

  step_3_review:
    reviewers:
      - "Communications/PR"
      - "Legal (if needed)"
      - "HR (if people impact)"
      - "Key stakeholders"
    output: "Revised draft"

  step_4_approval:
    process:
      - "Executive review"
      - "Final edits"
      - "Sign-off"
      - "Cascade plan confirmed"
    output: "Approved message"

  step_5_delivery:
    execution:
      - "Deliver per cascade plan"
      - "Monitor reception"
      - "Address questions"
      - "Follow up as needed"
    output: "Communication complete"
```

### Difficult Communication Handling

**Challenging Topics Framework**
```markdown
## Navigating Difficult Communications

### Types of Difficult Communications
1. **Bad news** (layoffs, missed targets, setbacks)
2. **Uncertainty** (market changes, strategic shifts)
3. **Controversial decisions** (policy changes, unpopular moves)
4. **Crisis situations** (incidents, external threats)
5. **Sensitive personnel matters** (departures, investigations)

### Principles for Difficult Communications

**Timing**
- Don't delay unnecessarily
- Don't surprise people
- Consider time zones and schedules
- Allow time for processing

**Transparency**
- Share what you can, when you can
- Explain what you can't share and why
- Don't speculate
- Commit to updates

**Empathy**
- Acknowledge impact on people
- Validate emotions
- Show you understand concerns
- Demonstrate care

**Clarity**
- Be direct and specific
- Avoid corporate speak
- Use simple language
- Repeat key points

**Support**
- Outline resources available
- Provide clear contacts
- Create space for questions
- Follow through on commitments
```

## Advanced Techniques

### Narrative Leadership

**Strategic Storytelling**
```yaml
executive_storytelling:
  narrative_types:
    origin_story:
      purpose: "Connect to founding values"
      elements: "Founders, early struggles, pivotal moments"
      use: "Culture, onboarding, external"

    transformation_story:
      purpose: "Inspire change"
      elements: "Where we were, what changed, where we're going"
      use: "Strategy shifts, turnarounds"

    customer_story:
      purpose: "Connect to impact"
      elements: "Real customer, their challenge, our role"
      use: "Motivation, product focus"

    future_story:
      purpose: "Paint the vision"
      elements: "What will be possible, how we'll get there"
      use: "Strategic planning, inspiration"

  storytelling_principles:
    - "Make it personal"
    - "Use specific details"
    - "Include emotion"
    - "Connect to audience"
    - "End with takeaway"
```

### Presence and Delivery

**Executive Presence Development**
```markdown
## Executive Presence Elements

### Physical Presence
- **Posture**: Confident, open stance
- **Movement**: Purposeful, not nervous
- **Eye contact**: Engaging, inclusive
- **Gestures**: Natural, reinforcing

### Vocal Presence
- **Pace**: Deliberate, with pauses
- **Volume**: Appropriate to space
- **Tone**: Confident, warm
- **Clarity**: Articulate, jargon-free

### Emotional Presence
- **Authenticity**: Genuine, not performed
- **Energy**: Appropriate to context
- **Empathy**: Connected to audience
- **Confidence**: Self-assured, not arrogant

### Intellectual Presence
- **Clarity**: Clear thinking expressed
- **Depth**: Demonstrates understanding
- **Flexibility**: Handles questions well
- **Vision**: Sees bigger picture
```

**Virtual Presence Excellence**
```yaml
virtual_excellence:
  technical_setup:
    camera:
      - "Eye level positioning"
      - "Good lighting (front-facing)"
      - "Clean background"
      - "Camera on = engaged"

    audio:
      - "Quality microphone"
      - "Quiet environment"
      - "Test before meetings"

  engagement_techniques:
    - "Direct camera eye contact"
    - "Varied vocal energy"
    - "Use names often"
    - "Interactive elements"
    - "Shorter segments"

  platform_mastery:
    - "Know your tools"
    - "Practice features"
    - "Have backup plans"
    - "Manage chat/Q&A"
```

### Multi-Audience Communication

**Tailored Messaging**
```markdown
## Audience-Specific Messaging

### By Role Level
| Audience | Focus | Depth | Format |
|----------|-------|-------|--------|
| Executives | Strategy, decisions | High context | Discussion |
| Managers | Implementation, cascade | Actionable detail | Briefing |
| Individual Contributors | Impact, action | Clear, simple | Broadcast |

### By Function
| Audience | Emphasis | Connection Point |
|----------|----------|------------------|
| Engineering | Technical implications | How it affects their work |
| Sales | Customer/revenue impact | What to tell customers |
| Operations | Process changes | What to do differently |
| HR | People implications | Support requirements |

### By Geography/Culture
- Time zone considerations
- Cultural communication norms
- Local context integration
- Translation needs
- Regional sensitivities
```

## Quality Standards

### Communication Effectiveness

**Quality Checklist**
```markdown
## Communication Quality Standards

### Content Quality
- [ ] Clear main message
- [ ] Appropriate detail level
- [ ] Accurate information
- [ ] Consistent with strategy
- [ ] Appropriate tone

### Delivery Quality
- [ ] Well-paced delivery
- [ ] Engaging presentation
- [ ] Good visual support
- [ ] Strong Q&A handling
- [ ] Time management

### Audience Quality
- [ ] Right audience reached
- [ ] Message understood
- [ ] Questions addressed
- [ ] Action clear
- [ ] Feedback gathered
```

### Measurement Framework

**Communication Metrics**
```yaml
communication_metrics:
  reach:
    - "Attendance rate"
    - "View completion rate"
    - "Message open rate"
    - "Geographic coverage"

  engagement:
    - "Questions submitted"
    - "Poll participation"
    - "Chat activity"
    - "Post-event feedback"

  understanding:
    - "Message recall surveys"
    - "Action completion"
    - "Follow-up question volume"
    - "Manager feedback"

  sentiment:
    - "Engagement scores"
    - "Comment sentiment"
    - "Trust indicators"
    - "Cultural health"

  continuous_improvement:
    - "Post-meeting surveys"
    - "Content effectiveness"
    - "Format preference"
    - "Timing optimization"
```

## Common Challenges

### Challenge Resolution

**Low Engagement**
- Vary content and format
- Increase interactivity
- Address relevant topics
- Shorten duration
- Optimize timing

**Information Overload**
- Prioritize ruthlessly
- Focus on key messages
- Use written follow-up
- Create tiered content
- Chunk information

**Trust Gaps**
- Increase frequency
- Be more transparent
- Follow through on commitments
- Address concerns directly
- Show vulnerability appropriately

## Success Metrics

### Communication Impact
- Message comprehension rates
- Employee engagement trends
- Trust and confidence scores
- Action completion rates
- Feedback quality

### Process Excellence
- Preparation efficiency
- Delivery consistency
- Follow-through completion
- Continuous improvement
- Stakeholder satisfaction

## Related Skills

- **board-reporting**: Governance communication
- **change-management**: Transformation messaging
- **culture-building**: Values communication
- **crisis-management**: Crisis communication
- **stakeholder-management**: Relationship building

## Resources

### Templates
- All-hands agenda template
- Town hall run-of-show
- Executive message framework
- Q&A preparation guide
- Feedback survey template

### Best Practices
- Public speaking techniques
- Virtual meeting excellence
- Storytelling frameworks
- Difficult conversation guides
- Inclusive communication
