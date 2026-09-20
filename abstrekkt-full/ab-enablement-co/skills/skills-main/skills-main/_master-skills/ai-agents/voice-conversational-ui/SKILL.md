---
name: voice-conversational-ui
description: Comprehensive guide to designing and building voice interfaces, conversational AI, and multimodal experiences for Alexa, Google Assistant, Siri Shortcuts, and custom voice applications. Covers best practices for natural language understanding (NLU), dialog management, and voice UX patterns. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Voice & Conversational UI Skill

## Overview
Comprehensive guide to designing and building voice interfaces, conversational AI, and multimodal experiences for Alexa, Google Assistant, Siri Shortcuts, and custom voice applications. Covers 2025 best practices for natural language understanding (NLU), dialog management, and voice UX patterns.

---

## When to Use This Skill
- Designing voice skills/actions (Alexa, Google Assistant)
- Building chatbots and conversational agents
- Creating voice-first applications
- Implementing multimodal experiences (voice + screen)
- Optimizing for natural language understanding
- Designing error handling and recovery flows

---

## Conversational Design Principles

### 1. Cooperative Principle (Grice's Maxims)

**Maxim of Quantity:** Be informative, but not overly so
- ✅ "Your package will arrive tomorrow."
- ❌ "Your package will arrive tomorrow at 2:34 PM from UPS driver John Smith in a brown truck with license plate XYZ123."

**Maxim of Quality:** Be truthful, don't speculate
- ✅ "I don't have that information. Would you like me to check?"
- ❌ "Your order is probably ready" (if uncertain)

**Maxim of Relevance:** Stay on topic
- ✅ User: "Set a timer" → Assistant: "For how long?"
- ❌ User: "Set a timer" → Assistant: "Did you know timers were invented in 1656?"

**Maxim of Manner:** Be clear and orderly
- ✅ "First, preheat the oven. Then, mix the ingredients."
- ❌ "Mix the ingredients, but first preheat the oven, unless you already did, in which case skip that step."

---

### 2. Persona & Tone

**Consistent personality:**
- **Friendly but professional:** Google Assistant, Siri
- **Playful:** Alexa (can tell jokes)
- **Formal:** Banking assistants, medical advisors

**Voice characteristics:**
- **Vocabulary:** Simple words, avoid jargon (unless technical audience)
- **Sentence structure:** Short sentences (10-15 words)
- **Contractions:** Use them (sounds natural: "you're" not "you are")
- **Avoid filler words:** "Um," "like," "you know" (unless intentional character trait)

**Example personas:**

**"Helper" (Task-focused):**
```
User: "Set a timer for 10 minutes"
Helper: "Timer set for 10 minutes."
```

**"Companion" (Conversational):**
```
User: "Set a timer for 10 minutes"
Companion: "You got it! I'll remind you in 10 minutes. Need anything else?"
```

---

### 3. Turn-Taking & Dialog Flow

**Initiative (Who drives conversation):**

**System-directed (Wizard):**
- Assistant asks questions, user answers
- Good for: Forms, surveys, onboarding

```
Assistant: "What's your destination?"
User: "San Francisco"
Assistant: "When would you like to leave?"
User: "Tomorrow at 9 AM"
Assistant: "I've found 3 flights. Would you like to hear them?"
```

**User-directed (Natural):**
- User asks questions, assistant responds
- Good for: FAQ, search, general assistance

```
User: "Book a flight to San Francisco tomorrow at 9 AM"
Assistant: "I found 3 flights. The cheapest is $150 on United. Want to book it?"
```

**Mixed-initiative (Collaborative):**
- Both can ask questions, interrupt, clarify
- Most natural, but hardest to implement

```
User: "Book a flight to San Francisco"
Assistant: "When would you like to leave?"
User: "Wait, how much are tickets?"
Assistant: "Prices range from $150 to $300. When did you want to leave?"
```

---

### 4. Confirmation Strategies

**Explicit confirmation (High stakes):**
```
User: "Transfer $1000 to John"
Assistant: "Just to confirm: Transfer $1000 to John Smith. Is that correct?"
User: "Yes"
Assistant: "Done. $1000 transferred."
```

**Implicit confirmation (Low stakes):**
```
User: "Set a timer for 10 minutes"
Assistant: "10-minute timer started." [Confirms by repeating]
```

**No confirmation (Ultra-low stakes):**
```
User: "What's the weather?"
Assistant: "It's 72° and sunny." [No confirmation needed]
```

---

## Voice Interface Components

### 1. Invocation (Wake Word)

**Examples:**
- "Alexa, ..." (Amazon Echo)
- "Hey Google, ..." (Google Assistant)
- "Hey Siri, ..." (Apple)

**Custom invocation names (Alexa skills):**
- Must be 2+ words
- No generic terms ("weather app" → "weather buddy")
- Easy to pronounce

**Best practices:**
- Tell user how to invoke (onboarding)
- Support variations ("Alexa, open weather buddy" / "Alexa, ask weather buddy...")

---

### 2. Intents (What User Wants)

**Built-in intents:**
- `AMAZON.StopIntent` (Alexa)
- `AMAZON.HelpIntent`
- `AMAZON.CancelIntent`
- `AMAZON.FallbackIntent` (catch unmatched utterances)

**Custom intents:**
```json
{
  "name": "BookFlightIntent",
  "samples": [
    "book a flight to {destination}",
    "I want to fly to {destination}",
    "get me a ticket to {destination}",
    "find flights to {destination}"
  ],
  "slots": [
    {
      "name": "destination",
      "type": "AMAZON.City"
    }
  ]
}
```

**Training utterances (intent samples):**
- Provide 10-20 variations per intent
- Cover different phrasings (formal, casual)
- Include typos, colloquialisms

---

### 3. Slots (Variables)

**Built-in slot types:**
- `AMAZON.Date` ("tomorrow", "next Tuesday", "January 15")
- `AMAZON.Time` ("3 PM", "noon", "half past five")
- `AMAZON.Number` ("five", "42", "one hundred")
- `AMAZON.City` ("San Francisco", "NYC")

**Custom slot types:**
```json
{
  "name": "PizzaTopping",
  "values": [
    "pepperoni",
    "mushrooms",
    "olives",
    "sausage"
  ]
}
```

**Slot elicitation (ask for missing info):**
```javascript
if (!destination) {
  return {
    speech: "Where would you like to fly?",
    reprompt: "What's your destination?",
    directive: "Dialog.ElicitSlot",
    slotToElicit: "destination"
  };
}
```

---

### 4. Responses (TTS & SSML)

**Plain text (simple):**
```javascript
return {
  speech: "Your flight is booked."
};
```

**SSML (advanced control):**
```xml
<speak>
  Your flight is booked!
  <break time="500ms"/>
  Departure: <say-as interpret-as="date">2025-10-25</say-as> at 9 AM.
  <break time="300ms"/>
  Have a great trip!
</speak>
```

**SSML tags:**
- `<break time="500ms"/>` - Pause
- `<emphasis level="strong">important</emphasis>` - Emphasis
- `<prosody rate="slow">speak slowly</prosody>` - Speed
- `<say-as interpret-as="cardinal">123</say-as>` - "one hundred twenty-three"
- `<say-as interpret-as="ordinal">3</say-as>` - "third"
- `<audio src="https://..."/>` - Play audio file

---

### 5. Context Management (Session State)

**Problem:** Voice is stateless (each turn is independent)

**Solution:** Store context in session attributes

**Example (flight booking):**
```javascript
// Turn 1
User: "Book a flight to San Francisco"
Assistant: "When would you like to leave?"
Session: { destination: "San Francisco" }

// Turn 2
User: "Tomorrow at 9 AM"
Assistant: "I found 3 flights. The cheapest is $150. Book it?"
Session: { destination: "San Francisco", date: "2025-10-26", time: "09:00" }

// Turn 3
User: "Yes"
Assistant: "Booked! Confirmation sent to your email."
Session: { destination: "San Francisco", date: "2025-10-26", time: "09:00", confirmed: true }
```

**Implementation (Alexa):**
```javascript
const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
sessionAttributes.destination = destination;
handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
```

---

## Error Handling & Recovery

### 1. No Match (Unrecognized Utterance)

**Anti-pattern:**
```
User: "Show me dog videos"
Assistant: "I didn't understand that."
```

**Best practice:**
```
User: "Show me dog videos"
Assistant: "I can help with weather, news, and timers. What would you like?"
```

**Progressive assistance:**
```
// 1st error
Assistant: "I didn't catch that. Try asking about weather, news, or timers."

// 2nd error
Assistant: "I'm still not sure. Here are some things you can say: 'What's the weather?' or 'Set a timer.'"

// 3rd error
Assistant: "It seems I'm having trouble. You can say 'help' or exit."
```

---

### 2. No Input (Silence)

**Reprompt strategy:**
```
// 1st prompt
Assistant: "What's your destination?"
[8 seconds of silence]

// Reprompt
Assistant: "I'm still listening. Where would you like to fly?"
[8 seconds of silence]

// Exit
Assistant: "I'll be here when you need me. Goodbye!"
```

**Timeout settings:**
- Initial: 8 seconds
- Reprompt: 5 seconds

---

### 3. Ambiguity (Multiple Interpretations)

**Clarification strategy:**
```
User: "Set a timer"
Assistant: "For how long?" [Ask for missing slot]

User: "Book a flight to Springfield"
Assistant: "Did you mean Springfield, Illinois or Springfield, Massachusetts?" [Disambiguate]
```

---

### 4. Out of Scope

**Redirect gracefully:**
```
User: "What's the meaning of life?" [Philosophical question]
Assistant: "That's a deep question! I'm better at things like weather and timers. What can I help with?"
```

**Don't pretend to know:**
```
❌ Assistant: "The meaning of life is 42." [Wrong domain]
✅ Assistant: "I don't have an answer for that, but I can help with..."
```

---

## Multimodal Design (Voice + Screen)

### 1. Visual Echo (Reinforce Voice)

**Pattern:** Show what you said

```
User: "Alexa, what's the weather?"
Voice: "It's 72° and sunny in San Francisco."
Screen: 
┌──────────────────┐
│   San Francisco  │
│   ☀️ 72°F        │
│   Sunny          │
└──────────────────┘
```

---

### 2. Visual Enhancement (Add Details)

**Pattern:** Voice gives summary, screen shows details

```
User: "Alexa, find flights to San Francisco"
Voice: "I found 3 flights. The cheapest is $150 on United."
Screen:
┌────────────────────────────────┐
│ 1. United - $150 - 9:00 AM     │
│ 2. Delta  - $180 - 11:00 AM    │
│ 3. Alaska - $200 - 2:00 PM     │
└────────────────────────────────┘
```

---

### 3. Visual-First (Screen Reduces Verbosity)

**Pattern:** Voice says less, screen shows more

```
User: "Alexa, show my calendar"
Voice: "Here's your calendar."
Screen:
┌────────────────────────────────┐
│ Monday, Oct 25                 │
│ 9:00 AM - Team Meeting         │
│ 2:00 PM - Client Call          │
│ 4:00 PM - Dentist Appointment  │
└────────────────────────────────┘
```

**Don't read entire screen:**
```
❌ Voice: "Monday October 25. 9:00 AM Team Meeting. 2:00 PM Client Call. 4:00 PM Dentist Appointment."
✅ Voice: "Here's your calendar." [Screen shows details]
```

---

### 4. Touch Targets (Tap to Act)

**Pattern:** Voice prompts, user taps

```
User: "Alexa, order a pizza"
Voice: "What toppings?"
Screen:
┌────────────────────────────────┐
│ [Pepperoni] [Mushrooms] [Olives]│
│ [Sausage]   [Peppers]   [Onions]│
└────────────────────────────────┘

User: [Taps Pepperoni]
Voice: "Pepperoni pizza. Anything else?"
```

---


## References
- `references/platform-specific-guidelines.md` — Platform-Specific Guidelines
