---
name: technical-demos
description: Helps configure and build technical demos processes. Comprehensive technical demonstration expertise covering demo environment setup, presentation strategies, stakeholder engagement, and handling technical issues during live presentations. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Technical Demos

## Overview

Technical demonstrations showcase solutions to stakeholders in compelling, memorable ways that drive decision-making. This skill covers the complete demo lifecycle from environment preparation through execution, audience engagement, and follow-up.

Effective technical demos balance showing capability with telling a story. They connect features to business value, anticipate audience questions, and gracefully handle the inevitable technical hiccups that occur during live presentations.

This skill provides frameworks for preparing reliable demo environments, structuring presentations for maximum impact, engaging diverse audiences, and recovering from issues. The goal is demos that build confidence and advance deals.

### Why This Matters

- **Deal acceleration**: Compelling demos shorten sales cycles by 25-40%
- **Stakeholder buy-in**: Seeing is believing; demos convert skeptics
- **Differentiation**: Great demos distinguish you from competitors
- **Trust building**: Technical competence on display builds confidence
- **Feedback generation**: Live demos surface requirements and concerns

## When to Use

### Primary Triggers

- "Prepare a demo for the client"
- "Set up a demo environment"
- "Present our solution to stakeholders"
- "Show them how it works"
- "Create a product demonstration"
- "Demo the integration"
- "Run through the demo"

### Specific Use Cases

1. **Sales Demos**: Pre-sales demonstrations to prospects
2. **Technical Validation**: Deep-dive demos for technical audiences
3. **Executive Presentations**: High-level demos for decision-makers
4. **Partner Showcases**: Demos for partner/channel audiences
5. **Conference Presentations**: Live demos at events
6. **Training Demos**: Demos for user onboarding

## Core Processes

### Process 1: Demo Environment Setup

**Objective**: Create reliable, professional demo environments.

**Demo Environment Checklist**:

```markdown
# Demo Environment Setup Checklist

## Environment Requirements

### Infrastructure
- [ ] Dedicated demo instance (separate from dev/prod)
- [ ] Stable hosting with high availability
- [ ] Performance optimized (no cold starts)
- [ ] SSL configured (no security warnings)
- [ ] Custom domain (demo.yourcompany.com or client-name.demo.yourcompany.com)

### Data
- [ ] Realistic sample data loaded
- [ ] Data represents client's industry/use case
- [ ] No real PII or sensitive data
- [ ] Data volume appropriate (not empty, not overwhelming)
- [ ] Reset script available for quick cleanup

### Accounts
- [ ] Demo user accounts created
- [ ] Multiple roles represented (admin, user, viewer)
- [ ] Memorable passwords for live login
- [ ] Account names match demo narrative

### Branding (if applicable)
- [ ] Client logo uploaded (with permission)
- [ ] Color scheme adjusted
- [ ] Sample products/content client-relevant
- [ ] URLs and email addresses sanitized

---

## Technical Validation

### Functionality Check
- [ ] All demo flows working end-to-end
- [ ] Integrations connected and functional
- [ ] Notifications/emails routed correctly
- [ ] All buttons and links working
- [ ] Forms submitting successfully

### Performance Check
- [ ] Page load times < 2 seconds
- [ ] No slow queries or timeouts
- [ ] Images optimized and loading
- [ ] Video/media playing correctly
- [ ] Animations smooth

### Browser Testing
- [ ] Chrome (primary demo browser)
- [ ] Firefox (backup)
- [ ] Mobile responsive (if showing)
- [ ] Clear browser cache before demo

---

## Backup Plans

### Environment Fallback
- [ ] Screenshots of key screens
- [ ] Video recording of demo flow
- [ ] Local environment as backup
- [ ] Offline version if applicable

### Data Recovery
- [ ] Database snapshot before demo
- [ ] Quick reset script tested
- [ ] Sample data export available
- [ ] Can restore in < 5 minutes
```

**Demo Data Strategy**:

```markdown
# Demo Data Guidelines

## Data Characteristics

### Realistic but Fake
- Use realistic names: "Acme Corporation" not "Test Company"
- Use realistic emails: "jane.smith@acme.co" not "test@test.com"
- Use realistic numbers: "$4,235.67" not "$1,000.00"
- Industry-appropriate terminology

### Tell a Story
Data should support narrative:
- Recent activity (dates within last week)
- In-progress items (not everything complete)
- Some issues/problems (shows error handling)
- Growth trends (for dashboards/analytics)

### Cover Demo Scenarios
| Scenario | Data Needed |
|----------|-------------|
| New customer onboarding | Fresh account with minimal data |
| Power user dashboard | Rich history, many transactions |
| Alert/notification demo | Triggered events ready |
| Search/filter demo | Diverse data for filtering |

---

## Sample Data Sets

### E-commerce Demo Data
```json
{
  "customers": [
    {"name": "Acme Corporation", "status": "active", "orders": 47},
    {"name": "TechStart Inc", "status": "active", "orders": 12},
    {"name": "Global Retail", "status": "pending", "orders": 0}
  ],
  "products": [
    {"name": "Enterprise License", "price": 999, "category": "Software"},
    {"name": "Support Package", "price": 199, "category": "Services"}
  ],
  "orders": [
    {"id": "ORD-2024-001", "status": "completed", "total": 1198},
    {"id": "ORD-2024-002", "status": "processing", "total": 999},
    {"id": "ORD-2024-003", "status": "pending", "total": 2397}
  ]
}
```

### SaaS Demo Data
- Accounts: 3-5 demo accounts with varied usage
- Users: 10-15 sample users across accounts
- Activity: 30 days of activity history
- Metrics: Trending upward for dashboards

---

## Data Reset Process

### Pre-Demo Reset Script
```bash
#!/bin/bash
# reset-demo.sh

echo "Resetting demo environment..."

# Reset database
pg_restore --clean --dbname=demo_db demo_baseline.dump

# Reset file storage
aws s3 sync s3://demo-baseline/ s3://demo-env/ --delete

# Clear caches
redis-cli FLUSHDB

# Warm up the application
curl -s https://demo.yourapp.com/health > /dev/null

echo "Demo environment reset complete!"
```

### Quick Reset (Between Demos)
- Clear specific user's session
- Reset specific records to initial state
- Use admin panel for quick edits
```

### Process 2: Demo Script Development

**Objective**: Create structured, compelling demo narratives.

**Demo Script Template**:

```markdown
# Demo Script: [Demo Name]

## Demo Overview
- **Audience**: [Who]
- **Duration**: [Minutes]
- **Objective**: [What we want them to believe/decide]
- **Key Message**: [One sentence takeaway]

---

## Pre-Demo Setup
- [ ] Environment URL: [URL]
- [ ] Login credentials ready: [User/Pass]
- [ ] Browser tabs pre-opened
- [ ] Zoom/screen share tested
- [ ] Notifications disabled
- [ ] Backup ready

---

## Opening (2-3 minutes)

### Hook
"[Opening statement that captures attention and frames the problem]"

### Context Setting
"Today I'll show you how [solution] addresses [their specific challenge].
We'll look at three key areas:
1. [Area 1]
2. [Area 2]
3. [Area 3]"

### Transition to Demo
"Let me show you this in action..."

---

## Demo Section 1: [Topic] (X minutes)

### Setup
**What to show**: [Screen/feature]
**URL/Navigation**: [How to get there]
**Login as**: [User role]

### Script
"[Exact words to say while demonstrating]"

### Actions
1. Click [element] - "This is where..."
2. Enter [data] - "Notice how..."
3. Submit form - "And now you can see..."

### Key Points to Emphasize
- [Point 1 - connect to their requirement]
- [Point 2 - differentiate from competitors]
- [Point 3 - highlight value]

### Transition
"Now that we've seen [X], let me show you [Y]..."

---

## Demo Section 2: [Topic] (X minutes)

### Setup
[Same structure]

### Script
"[Words to say]"

### Actions
[Step by step]

### Key Points
[Bullets]

### Transition
[Bridge to next section]

---

## Demo Section 3: [Topic] (X minutes)

[Same structure]

---

## Closing (2-3 minutes)

### Summary
"So today we've seen:
- [Key takeaway 1]
- [Key takeaway 2]
- [Key takeaway 3]"

### Call to Action
"[What you want them to do next]"

### Q&A Transition
"What questions do you have?"

---

## Q&A Preparation

### Anticipated Questions
| Question | Answer | Show |
|----------|--------|------|
| "How does it handle [X]?" | [Answer] | [Screen to show] |
| "What about [Y] integration?" | [Answer] | [Screen to show] |
| "Can it [Z]?" | [Answer] | [Demo or explain] |

### Questions to Defer
- [Complex customization questions] -> "Let's schedule a technical deep-dive"
- [Pricing questions] -> "I'll connect you with [person]"
- [Roadmap questions] -> "Happy to discuss in follow-up"

---

## Timing Guide

| Section | Duration | Cumulative |
|---------|----------|------------|
| Opening | 3 min | 3 min |
| Section 1 | 8 min | 11 min |
| Section 2 | 7 min | 18 min |
| Section 3 | 7 min | 25 min |
| Closing | 2 min | 27 min |
| Q&A | 10+ min | 37+ min |
```

### Process 3: Audience-Specific Demo Strategies

**Objective**: Tailor demos to different stakeholder types.

**Audience Adaptation Framework**:

```markdown
# Demo Adaptation by Audience

## Executive Audience

### Characteristics
- Time-constrained (15-20 minutes max)
- Focus on outcomes, not features
- Interested in ROI and strategic value
- May not follow technical details

### Demo Approach
- Lead with business value, not features
- Show dashboards and reports first
- Use real numbers and metrics
- Skip technical configuration
- Have one "wow" moment

### Language
- "This will save your team X hours per week"
- "Your competitors are using approaches like this"
- "This directly addresses your [strategic initiative]"
- Avoid: technical jargon, acronyms, implementation details

### Pacing
- Fast-paced overview
- Don't dwell on screens
- Keep clicking/moving
- End early for discussion

---

## Technical Audience

### Characteristics
- Want to see "how it works"
- Will ask detailed questions
- Evaluating technical fit
- May try to find weaknesses

### Demo Approach
- Show architecture diagrams
- Demonstrate API capabilities
- Show configuration options
- Discuss integration patterns
- Be prepared to go off-script

### Language
- Technical terminology appropriate
- Discuss trade-offs openly
- Reference standards and best practices
- "Under the hood" explanations welcome

### Pacing
- Slower, more thorough
- Pause for questions
- Dive into areas of interest
- Offer to show more detail

---

## End User Audience

### Characteristics
- Will use the system daily
- Focused on ease of use
- Concerned about learning curve
- May be resistant to change

### Demo Approach
- Show daily workflows
- Emphasize simplicity
- Address pain points from current system
- Show time-saving features
- Make it feel familiar

### Language
- Simple, non-technical
- Focus on "you" not "the system"
- "Click here to..." not "The UI allows..."
- Acknowledge current tools positively

### Pacing
- Steady, not rushed
- Pause to let features sink in
- Encourage questions
- Show repeat actions to reinforce

---

## Mixed Audience

### Challenges
- Different interests and attention spans
- Technical depth alienates executives
- High-level bores technical people

### Strategies
1. **Layered Demo**
   - Start high-level for executives
   - Signal technical deep-dive ("For the technical folks...")
   - Return to high-level for close

2. **Pre-Meeting Prep**
   - Identify primary decision-maker
   - Tailor to their level
   - Offer follow-up demos for others

3. **Engagement Techniques**
   - "Sarah, this addresses the workflow issue you mentioned"
   - "Tom, I know you'll want to see the API - we'll get there"
   - Acknowledge different interests explicitly
```

### Process 4: Demo Delivery Best Practices

**Objective**: Execute flawless, engaging demonstrations.

**Delivery Checklist**:

```markdown
# Demo Delivery Best Practices

## Before the Demo

### 30 Minutes Before
- [ ] Test demo environment one final time
- [ ] Clear browser cache and history
- [ ] Disable notifications (Slack, email, system)
- [ ] Close unnecessary applications
- [ ] Check audio/video for virtual demos
- [ ] Have water nearby
- [ ] Open all needed browser tabs

### 5 Minutes Before
- [ ] Take a breath
- [ ] Review opening lines
- [ ] Position for screen share
- [ ] Welcome early joiners (virtual)

---

## During the Demo

### Presence
- Stand if possible (more energy)
- Smile while speaking (audible difference)
- Make eye contact (or camera eye for virtual)
- Use presenter view (see notes while showing)

### Screen Technique
- Use full screen for application
- Zoom browser to 125% for visibility
- Use cursor to draw attention
- Pause cursor before clicking (let eyes follow)
- Scroll slowly and deliberately

### Voice Technique
- Speak slightly slower than natural
- Pause at key moments
- Vary tone and pace
- Avoid filler words (um, uh, so)
- Project confidence

### Engagement
- Ask rhetorical questions: "Can you see how this would..."
- Check in: "Does this make sense so far?"
- Reference their context: "Like your current [process]..."
- Watch for reactions (nods, confusion, interest)

---

## Handling Technical Issues

### Minor Issues
| Problem | Response |
|---------|----------|
| Page slow to load | "This is loading - while we wait, let me explain..." |
| Wrong data displayed | "Let me refresh that..." (move on quickly) |
| Small UI glitch | Ignore and continue |

### Major Issues
| Problem | Response |
|---------|----------|
| Environment down | Switch to backup (screenshots/video) |
| Demo data corrupted | Use different account/scenario |
| Critical feature broken | "I want to show you the full experience, so let me share a recording of this feature..." |

### Recovery Phrases
- "Technology always keeps us humble..."
- "Let me show you this a different way..."
- "This is actually a good opportunity to show our support process..."
- "Let me switch to our backup here..."

### What NOT to Do
- Don't apologize excessively
- Don't blame the product
- Don't try to debug live
- Don't show frustration

---

## After the Demo

### Immediate
- [ ] Thank attendees
- [ ] Confirm next steps
- [ ] Offer to answer more questions async

### Follow-Up
- [ ] Send thank you email within 24 hours
- [ ] Include recording if available
- [ ] Attach relevant materials
- [ ] Propose next meeting
```

### Process 5: Virtual Demo Excellence

**Objective**: Deliver compelling demos in virtual settings.

**Virtual Demo Guide**:

```markdown
# Virtual Demo Excellence

## Technical Setup

### Hardware
- External webcam at eye level
- Quality microphone (not laptop mic)
- Good lighting (face lit, no backlight)
- Neutral, professional background
- Second monitor for notes (if available)

### Software
- [Zoom/Teams/Meet] latest version
- Screen sharing tested
- Recording enabled (with permission)
- Virtual background tested
- Backup dial-in ready

### Environment
- Close doors
- Mute phone
- "Do Not Disturb" everywhere
- Clear visible desktop
- Professional browser bookmarks only

---

## Virtual-Specific Techniques

### Opening
- Join 5 minutes early
- Camera on (always)
- Greet by name as people join
- Small talk while waiting
- Confirm audio/video working

### Screen Sharing
- Share specific window, not entire screen
- Hide bookmark bar or make professional
- Close sensitive tabs
- Use annotation tools sparingly
- "Can everyone see my screen?"

### Engagement (virtual is harder)
- More frequent check-ins
- Direct questions to individuals
- Use chat for interaction
- Poll for preferences ("Show A or B?")
- Watch for unmutes (question coming)

### Energy Management
- Increase energy 20% (camera dampens)
- Stand if possible
- Gestures (visible in frame)
- Vocal variety even more important
- Shorter segments (attention spans shorter)

---

## Virtual Audience Management

### Large Audiences (10+)
- Mute all on entry
- Use chat for questions
- Designate chat monitor
- Acknowledge questions will be addressed
- Save Q&A for dedicated time

### Small Audiences (3-5)
- Encourage cameras on
- More conversational tone
- Address individuals by name
- Pause for input frequently
- Watch for non-verbal cues

### Mixed Remote/In-Person
- Ensure in-room camera captures room
- Remote participants see and hear clearly
- Address remote attendees directly
- Repeat in-room questions for remote
- This is hardest format - extra preparation needed

---

## Recording Best Practices

### Before Recording
- Announce: "I'll be recording for those who couldn't attend"
- Confirm permission
- Check local laws (some require all-party consent)

### During Recording
- Avoid saying anything you wouldn't want recorded
- Reference visuals: "As you can see here..."
- Pause for transitions (edit points)
- Say participant names for attribution

### After Recording
- Review before sharing
- Trim dead air at start/end
- Add chapters if long
- Host securely (not public YouTube)
- Set expiration if sensitive
```

## Tools & Templates

| Tool | Purpose | When to Use |
|------|---------|-------------|
| Demo Script | Structured narrative | Every demo |
| Environment Checklist | Setup validation | Before each demo |
| Audience Guide | Adaptation strategy | Prep for audience |
| Recovery Phrases | Issue handling | When things break |
| Follow-up Template | Post-demo communication | After demo |

## Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Demo Completion Rate | > 95% | Demos without major issues |
| Audience Engagement | Active participation | Questions, reactions |
| Demo-to-Next-Step Rate | > 70% | Demos leading to next meeting |
| Feedback Score | > 4/5 | Post-demo surveys |
| Time Adherence | +/- 5 minutes | Finish within window |

## Common Pitfalls

1. **Over-demonstrating**: Show key value, not every feature.
2. **Under-preparing**: One more runthrough prevents embarrassment.
3. **Ignoring audience**: Watch for cues; adapt in real-time.
4. **Feature-focused**: Connect every feature to business value.
5. **Poor recovery**: Practice recovery phrases; stay calm.

## Integration Points

- **Discovery**: Demo addresses discovered requirements
- **POC**: POC often becomes demo foundation
- **Proposals**: Demo supports proposal narrative
- **Sales**: Demo advances sales process
- **Training**: Demo techniques apply to training
