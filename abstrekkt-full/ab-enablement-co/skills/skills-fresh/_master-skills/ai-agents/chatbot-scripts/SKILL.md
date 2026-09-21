---
name: chatbot-scripts
description: Design conversational chatbot flows, FAQ automation, lead qualification bots, and customer support scripts. Covers handoff protocols, personality design, fallback responses, and conversation optimization. Use when implementing or improving chat-based customer interactions.
---

# Chatbot Scripts & Conversational Design

## Overview

Chatbots and conversational interfaces provide instant, scalable customer engagement across marketing, sales, and support. Well-designed chatbot scripts create helpful experiences that qualify leads, answer questions, and route conversations appropriately. For SMBs, chatbots extend team capacity and ensure 24/7 responsiveness.

Effective chatbot design balances automation efficiency with genuine helpfulness. The goal is not to trick users into thinking they're talking to a human, but to provide fast, accurate assistance while knowing when to bring humans into the conversation.

## When to Use

**Invoke this skill when:**
- Designing chatbot conversation flows
- Creating FAQ automation responses
- Building lead qualification bots
- Defining human handoff protocols
- Developing chatbot personality and voice
- Writing fallback and error responses
- Optimizing existing chatbot performance
- Planning chatbot implementation strategy

**Trigger phrases:**
- "Design chatbot flow"
- "Write chatbot script"
- "Lead qualification bot"
- "FAQ automation"
- "Chatbot personality"
- "Handoff protocol"

## Core Processes

### 1. Chatbot Strategy

#### Use Case Definition

```markdown
## Chatbot Use Case Framework

### Primary Use Cases
| Use Case | Goal | Value | Priority |
|----------|------|-------|----------|
| Lead qualification | Route qualified leads to sales | Faster response, better targeting | High |
| FAQ automation | Answer common questions | Reduce support load, instant answers | High |
| Appointment scheduling | Book meetings/demos | 24/7 availability, reduce friction | Medium |
| Product guidance | Help users find right solution | Improved conversion, user experience | Medium |
| Support triage | Categorize and route issues | Faster resolution, proper routing | Medium |
| Order status | Self-service order tracking | Reduce support tickets | Low |

### Use Case Selection Criteria
- **Volume**: How often does this scenario occur?
- **Repetition**: Can responses be standardized?
- **Value**: What's the impact of automation?
- **Complexity**: Can a bot handle this adequately?
- **Fallback**: What happens when bot fails?

### Bot Type Selection
| Scenario | Bot Type | Complexity |
|----------|----------|------------|
| Simple FAQ | Rule-based decision tree | Low |
| Lead qualification | Guided conversation flow | Medium |
| Product recommendation | Conditional logic + rules | Medium |
| Complex support | AI-assisted with human backup | High |
| Free-form conversation | NLU/NLP with intents | High |

### Success Metrics by Use Case
| Use Case | Primary Metric | Target |
|----------|----------------|--------|
| Lead qualification | Leads captured | [X]/month |
| FAQ automation | Resolution rate | >70% |
| Scheduling | Bookings completed | [X]/month |
| Support triage | Tickets avoided | >50% |
```

#### Bot Personality Design

```markdown
## Chatbot Personality Framework

### Personality Definition
**Name**: [Bot name or no name]
**Role**: [What the bot does]
**Personality traits**: [3-4 adjectives]
**Communication style**: [Formal/casual/friendly]
**Limitations transparency**: [How honest about being a bot]

### Personality Traits Spectrum
Rate your bot (1-10):
Formal [1----5----10] Casual
Serious [1----5----10] Playful
Brief [1----5----10] Detailed
Reserved [1----5----10] Enthusiastic

### Voice Guidelines
**We say:**
- [Example phrase that fits our voice]
- [Example phrase that fits our voice]

**We don't say:**
- [Example phrase that doesn't fit]
- [Example phrase that doesn't fit]

### Tone by Context
| Context | Tone | Example |
|---------|------|---------|
| Greeting | Warm, helpful | "Hi there! How can I help you today?" |
| Answering FAQ | Clear, direct | "Great question! [Answer]" |
| Collecting info | Friendly, patient | "Got it! And what's your email?" |
| Error/confusion | Apologetic, solution-focused | "I'm not sure I understood. Let me try..." |
| Handoff | Reassuring | "Let me connect you with our team..." |
| Closing | Appreciative | "Thanks for chatting! Have a great day." |

### Emoji Usage
- None: Professional, enterprise contexts
- Minimal: Occasional for warmth (one per conversation)
- Moderate: Friendly brands, B2C
- Frequent: Playful brands, younger audiences

### Transparency Policy
Always disclose:
- "I'm [Name], a virtual assistant here to help!"
- "I'm a chatbot, but I'll do my best to help you."

Never:
- Pretend to be human
- Claim capabilities you don't have
- Make promises you can't keep
```

### 2. Conversation Flow Design

#### Flow Architecture

```markdown
## Conversation Flow Structure

### Basic Flow Components

**Welcome Message**
├── Greeting
├── Bot introduction (optional)
└── Initial prompt/menu

**Intent Recognition**
├── User input
├── Intent matching
└── Entity extraction

**Conversation Path**
├── Follow-up questions
├── Information collection
├── Validation
└── Confirmation

**Resolution**
├── Answer provided
├── Action completed
├── Handoff to human
└── Conversation ended

### Flow Types

**Linear Flow**: Step-by-step, one path
Best for: Simple forms, surveys, onboarding
```
Start → Q1 → Q2 → Q3 → Complete
```

**Branching Flow**: Multiple paths based on answers
Best for: Qualification, product selection
```
Start → Q1 → [If A] → Path A → Complete
            [If B] → Path B → Complete
```

**Menu-Based Flow**: User chooses topic
Best for: FAQ, support categories
```
Start → Menu → [Topic 1] → Info → Menu
             → [Topic 2] → Info → Menu
             → [Topic 3] → Info → Menu
```

**Hybrid Flow**: Combination approaches
Best for: Complex use cases
```
Start → Menu → [Topic] → Linear Q&A → Branch → Complete
```
```

#### Lead Qualification Flow

```markdown
## Lead Qualification Bot Flow

### Flow Diagram
```
[Welcome]
    │
    ▼
[Intro + Permission to ask questions]
    │
    ▼
[Question 1: What brings you here?]
    │
    ├── [Option A: Learning] → [Nurture path]
    ├── [Option B: Evaluating] → [Continue qualification]
    └── [Option C: Ready to buy] → [Fast track to sales]
    │
    ▼
[Question 2: Company info]
    │
    ▼
[Question 3: Timeline/Budget signals]
    │
    ▼
[Score lead: Hot/Warm/Cold]
    │
    ├── [Hot] → [Book meeting with sales]
    ├── [Warm] → [Demo video + follow-up]
    └── [Cold] → [Resource + newsletter]
```

### Lead Qualification Questions
**Qualifying Questions (BANT):**

Budget:
- "What's your approximate budget for [solution]?"
- "Are you currently paying for a similar solution?"

Authority:
- "What's your role in the buying decision?"
- "Who else is involved in evaluating options?"

Need:
- "What problem are you trying to solve?"
- "How are you handling [problem] today?"

Timeline:
- "When are you looking to implement a solution?"
- "Is there a specific deadline or event driving this?"

### Qualification Scoring
| Answer Pattern | Score | Action |
|----------------|-------|--------|
| Budget confirmed, decision maker, urgent | Hot | Direct to sales |
| Some qualification met, genuine interest | Warm | Nurture, offer demo |
| Just researching, no timeline | Cold | Educational content |
| Competitor/Job seeker | Disqualify | Exit gracefully |

### Sample Flow Script
---
**Bot**: Hi there! I'm here to help you find the right solution.
Mind if I ask a few quick questions? (Yes / No)

**User**: Yes

**Bot**: Great! First, what brings you to [Company] today?
- I'm researching options
- I'm evaluating specific solutions
- I'm ready to make a decision

**User**: I'm evaluating specific solutions

**Bot**: Good to know! What company are you with?

**User**: Acme Corp

**Bot**: Nice to meet you from Acme Corp! What challenge
are you looking to solve with [Product type]?

**User**: We need better reporting

**Bot**: Reporting is one of our strengths! When are you
hoping to have a solution in place?
- ASAP (within 30 days)
- Next quarter
- Just planning ahead

**User**: ASAP

**Bot**: Got it! Based on what you've shared, I think you'd
benefit from a quick demo with our team. Would you like to
book a 15-minute call?
- Yes, let's book it
- Not yet, send me more info
---
```

### 3. FAQ Automation

#### FAQ Content Structure

```markdown
## FAQ Bot Content Framework

### FAQ Categories
| Category | Questions | Priority |
|----------|-----------|----------|
| Product/Service | What is it, how it works | High |
| Pricing | Costs, plans, billing | High |
| Getting Started | Signup, onboarding, setup | High |
| Features | Capabilities, limitations | Medium |
| Technical | Requirements, integrations | Medium |
| Support | Contact, hours, policies | Medium |
| Company | About, team, location | Low |

### FAQ Entry Template
---
**Question**: [Exact question users ask]
**Variations**: [Alternative phrasings]
  - [Variation 1]
  - [Variation 2]
  - [Variation 3]
**Keywords**: [trigger words]
**Answer**: [Clear, complete response]
**Follow-up**: [Related question or CTA]
**Handoff trigger**: [When to escalate]
---

### Example FAQ Entry
---
**Question**: What's your pricing?
**Variations**:
  - How much does it cost?
  - What are your prices?
  - Is there a free plan?
  - What plans do you offer?
**Keywords**: pricing, cost, price, plan, free, pay
**Answer**: We have three plans to fit different needs:
- **Starter**: $29/month - perfect for individuals
- **Growth**: $79/month - great for small teams
- **Scale**: $199/month - for growing businesses

All plans include a 14-day free trial!
**Follow-up**: Would you like details on any specific plan?
**Handoff trigger**: Request for enterprise pricing or custom quote
---

### FAQ Response Best Practices
- Keep answers concise (under 100 words)
- Use formatting (bullets, bold) for scannability
- Include relevant links where helpful
- Offer follow-up or related questions
- Know when to hand off to human
```

#### Intent Recognition

```markdown
## Intent & Entity Framework

### Common Intents
| Intent | User Goal | Example Utterances |
|--------|-----------|-------------------|
| greeting | Start conversation | "Hi", "Hello", "Hey there" |
| pricing | Learn about costs | "How much", "What's the price" |
| features | Understand capabilities | "Can it do X", "Does it have" |
| demo | See product in action | "Show me a demo", "Want to see it" |
| contact_human | Speak to person | "Talk to someone", "Human please" |
| complaint | Express dissatisfaction | "Not working", "Frustrated" |
| thanks | Express gratitude | "Thanks", "That helped" |
| goodbye | End conversation | "Bye", "That's all" |

### Entity Extraction
| Entity Type | Examples | Use |
|-------------|----------|-----|
| email | john@company.com | Lead capture |
| phone | 555-1234 | Contact info |
| company | "Acme Corp" | Lead enrichment |
| product | "Enterprise plan" | Intent routing |
| date | "next Tuesday" | Scheduling |
| number | "50 employees" | Qualification |

### Intent Training Data
For each intent, provide:
- 15-25 example phrases
- Variety in phrasing and length
- Include common typos
- Cover edge cases

Example for "pricing" intent:
```
- How much does it cost?
- What's your pricing?
- What are your prices?
- Price?
- Is it expensive?
- What do you charge?
- How much per month?
- Do you have a free plan?
- What's the monthly cost?
- Can you tell me about pricing?
- How much would it be for my team?
- What's the cost for 10 users?
```
```

### 4. Handoff Protocols

#### Human Handoff Framework

```markdown
## Handoff Protocol Design

### Handoff Triggers
**Automatic Handoff** (always transfer):
- User requests human ("talk to person", "agent please")
- Detected frustration/anger
- Complex issue beyond bot capability
- High-value lead identified
- Legal/sensitive topics
- Payment/billing issues (when configured)

**Suggested Handoff** (offer option):
- Bot unsure of response
- Multiple failed intents
- Lengthy conversation without resolution
- User seems confused

**Avoid Handoff** (bot can handle):
- Common FAQs with clear answers
- Simple lead capture
- Content delivery requests
- Basic navigation help

### Handoff Process

**Step 1: Acknowledge Need**
"I think you'd benefit from speaking with our team on this one."

**Step 2: Collect Context** (if not already captured)
"Before I connect you, may I get your email so they can
follow up if we get disconnected?"

**Step 3: Set Expectations**
- Availability: "Our team is available 9am-6pm ET"
- Wait time: "Typical wait time is under 2 minutes"
- Alternative: "If no one's available, I can have them email you"

**Step 4: Transfer with Context**
Pass to agent:
- Conversation summary
- User intent/question
- Information collected
- Bot attempt summary

**Step 5: Confirm Handoff**
"I've connected you with [Name/Team]. They have our
conversation and will take it from here!"

### After-Hours Protocol
---
**Bot**: I'd love to connect you with our team, but we're
currently outside business hours (9am-6pm ET).

Would you like to:
- Leave a message and we'll respond first thing tomorrow
- Schedule a call for a specific time
- Get an answer to a FAQ in the meantime
---

### Handoff Message to Agent
```
--- Chat Transfer ---
User: [Name, Email]
Intent: [Primary question/need]
Conversation summary:
- User asked about [topic]
- Bot provided [information]
- User needs [specific help]
Note: [Any relevant context]
Conversation started: [timestamp]
---
```
```

#### Fallback & Error Handling

```markdown
## Fallback Response Framework

### Fallback Hierarchy
1. **Clarification**: Ask user to rephrase
2. **Narrow options**: Offer specific choices
3. **Alternative path**: Suggest different approach
4. **Human handoff**: Escalate to person

### Fallback Responses (Rotate for variety)

**First fallback (clarification):**
- "I'm not sure I understood. Could you rephrase that?"
- "Hmm, I didn't quite catch that. Can you try again?"
- "I want to make sure I help you correctly. What are you looking for?"

**Second fallback (narrow options):**
- "I'm having trouble understanding. Are you looking for:
  • Pricing information
  • Product features
  • Technical support
  • Something else"

**Third fallback (alternative path):**
- "I'm still not getting it right. Would you like me to
  connect you with our team who can definitely help?"

**Final fallback (human handoff):**
- "Let me get you to someone who can help better.
  [Handoff initiated]"

### Error-Specific Responses

**Unknown intent:**
"I'm not sure about that, but I can help with [topics].
Which would you like to explore?"

**Missing information:**
"I'll need your [email/phone/company] to help with that.
Would you mind sharing?"

**System error:**
"Oops! Something went wrong on my end. Let me try again.
If this keeps happening, I'll connect you with our team."

**Outside scope:**
"That's outside what I can help with, but our team can
definitely assist. Would you like me to connect you?"

### Frustration Detection
Trigger words: "frustrated", "annoyed", "this is useless",
"you're not helping", "forget it", "ugh"

Response:
"I can tell this isn't going smoothly, and I'm sorry about that.
Let me connect you with a real person who can help properly."
[Immediate handoff]
```

### 5. Conversation Optimization

#### Performance Analysis

```markdown
## Chatbot Analytics Framework

### Key Metrics
| Metric | Description | Target |
|--------|-------------|--------|
| Engagement rate | Chats / Visitors | >5% |
| Completion rate | Finished conversations | >70% |
| Resolution rate | Resolved without human | >60% |
| Handoff rate | Transferred to human | <30% |
| Avg conversation length | Messages per chat | 5-8 optimal |
| Lead capture rate | Leads / Conversations | >20% |
| CSAT score | User satisfaction | >4/5 |

### Conversation Quality Analysis
Review conversations for:
- [ ] Appropriate responses to intents
- [ ] Graceful fallback handling
- [ ] Smooth handoff execution
- [ ] Consistent personality/voice
- [ ] Helpful follow-up suggestions

### Common Drop-Off Points
| Drop-off Point | Possible Cause | Fix |
|----------------|----------------|-----|
| After greeting | Not relevant/poor timing | Better targeting |
| After first question | Unclear/overwhelming | Simplify |
| At form field | Too much info requested | Reduce fields |
| Before CTA | Not compelling | Improve offer |
| At handoff | Friction in process | Streamline |

### A/B Testing Opportunities
- Welcome message variations
- Question phrasing
- CTA button text
- Menu structure
- Response length
- Emoji usage
- Handoff timing
```

#### Script Optimization

```markdown
## Script Improvement Process

### Monthly Review Checklist
- [ ] Review conversations with low CSAT
- [ ] Identify frequently triggered fallbacks
- [ ] Check handoff patterns for automation opportunities
- [ ] Update FAQ content based on new questions
- [ ] Test personality consistency
- [ ] Review competitor chatbot experiences

### Script Testing Protocol
1. Test full flows internally
2. Pilot with small traffic percentage
3. Monitor key metrics
4. Gather user feedback
5. Iterate and expand

### Optimization Prioritization
| Issue | Impact | Effort | Priority |
|-------|--------|--------|----------|
| High fallback rate on X intent | High | Low | 1 |
| Missing FAQ for common question | High | Low | 1 |
| Long conversation times | Medium | Medium | 2 |
| Low engagement on widget | High | Medium | 2 |
| Personality inconsistency | Low | Low | 3 |

### Script Version Control
Track changes:
- Date of change
- What was changed
- Why it was changed
- Impact on metrics
- Rollback if needed
```

## Tools & Templates

### Conversation Script Template

```markdown
## Script: [Flow Name]
Version: [X.X] | Last Updated: [Date]

### Trigger
[When this flow starts]

### Flow
---
**Bot**: [Message 1]
[Button: Option A] [Button: Option B] [Free text allowed: Y/N]

**If Option A:**
**Bot**: [Response to A]
[Next step]

**If Option B:**
**Bot**: [Response to B]
[Next step]

**If free text:**
**Bot**: [Parse and respond or clarify]
---

### Variables Captured
- {email}: User email address
- {company}: Company name
- {intent}: Detected intent

### Handoff Conditions
- [Condition 1]: Transfer to [Team]
- [Condition 2]: Transfer to [Team]

### Exit Points
- Successful: [Outcome achieved]
- Unsuccessful: [Fallback action]
```

### Chatbot Brief Template

```markdown
## Chatbot Project Brief

### Project Overview
- **Bot name**: [Name or no name]
- **Primary purpose**: [Main goal]
- **Platform**: [Website, Messenger, etc.]
- **Tool/Platform**: [Intercom, Drift, HubSpot, etc.]

### Use Cases (Priority Order)
1. [Use case 1 - goal]
2. [Use case 2 - goal]
3. [Use case 3 - goal]

### Personality
- **Voice**: [Brand voice reference]
- **Tone**: [Formal/casual spectrum]
- **Traits**: [3-4 adjectives]

### Integration Requirements
- CRM: [System and sync requirements]
- Calendar: [Booking integration]
- Support: [Ticketing system]
- Other: [Additional integrations]

### Success Metrics
| Metric | Baseline | Target |
|--------|----------|--------|
| [Metric 1] | [Current] | [Goal] |
| [Metric 2] | [Current] | [Goal] |

### Timeline
- Script development: [Date]
- Testing: [Date]
- Pilot launch: [Date]
- Full launch: [Date]
```

## Metrics & KPIs

### Chatbot Performance Metrics

| Metric | Description | Benchmark | Target |
|--------|-------------|-----------|--------|
| Engagement rate | % visitors who chat | 2-5% | [X]% |
| Response accuracy | Correct responses / Total | >85% | [X]% |
| Resolution rate | Resolved by bot / Total | >60% | [X]% |
| Handoff rate | Human needed / Total | <30% | [X]% |
| CSAT | User satisfaction rating | >4.0/5 | [X]/5 |
| Lead capture | Leads / Conversations | >20% | [X]% |

### Conversation Quality Metrics

| Metric | What It Shows | Target |
|--------|---------------|--------|
| Fallback rate | Intent recognition quality | <15% |
| Avg messages to resolution | Efficiency | 5-8 messages |
| Time to resolution | Speed | <3 minutes |
| Abandonment rate | User frustration | <20% |

## Common Pitfalls

### Pitfall 1: Over-Automation
**Problem**: Trying to handle too much without human backup
**Solution**: Clear handoff triggers; humans for complex issues

### Pitfall 2: Robotic Personality
**Problem**: Responses feel cold and scripted
**Solution**: Natural language; personality consistency; variety in responses

### Pitfall 3: Dead Ends
**Problem**: Conversation stops without resolution or next step
**Solution**: Every path ends with action, handoff, or graceful close

### Pitfall 4: Too Many Questions
**Problem**: Users abandon long qualification flows
**Solution**: Minimum viable questions; progressive collection

### Pitfall 5: Poor Fallback Handling
**Problem**: "I don't understand" repeated frustratingly
**Solution**: Varied fallback responses; quick path to human

### Pitfall 6: Ignoring Analytics
**Problem**: Bot deployed and forgotten
**Solution**: Regular conversation review; metric monitoring

## Integration Points

### Connected Business Functions

| Function | Integration Point | Shared Elements |
|----------|-------------------|-----------------|
| Sales | Lead capture, qualification | CRM sync, lead routing |
| Support | Ticket creation, triage | Help desk integration |
| Marketing | Lead nurturing, campaigns | Email/CRM integration |
| Product | Feature questions, feedback | Product analytics |
| Content | FAQ management | Knowledge base |

### Technology Stack

- **Chatbot platforms**: Intercom, Drift, HubSpot, Tidio
- **AI-powered**: ChatGPT, Dialogflow, Amazon Lex
- **Live chat**: Zendesk, Freshdesk, LiveChat
- **Integration**: Zapier, native APIs
- **Analytics**: Platform native, Google Analytics
