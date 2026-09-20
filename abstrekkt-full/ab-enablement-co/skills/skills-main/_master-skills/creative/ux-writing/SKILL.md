---
name: ux-writing
description: Microcopy and UI text design for digital products. Crafts error messages, onboarding flows, button labels, tooltips, notifications, and content systems that guide users with clarity and personality. Use when designing, creating, or reviewing creative deliverables.
---

# UX Writing

> Every word in the interface is a design decision.

## Description

UX writing is the practice of crafting the words that appear throughout a digital product to guide users, reduce friction, and communicate the brand voice at every interaction point. This skill encompasses microcopy (button labels, tooltips, placeholder text), system messaging (errors, confirmations, empty states), onboarding flows, notification copy, and the creation of scalable content design systems. Effective UX writing treats text as a core component of the user interface, not an afterthought, recognizing that the right word at the right moment can eliminate confusion, prevent errors, build trust, and create delight. Practitioners must balance brevity with clarity, personality with utility, and consistency with contextual adaptation across every screen, state, and interaction in the product.

## Activation Triggers

- "Write the error messages for this feature"
- "Create microcopy for the onboarding flow"
- "Design the UI text for this screen"
- "Write button labels and CTAs for the interface"
- "Craft empty state messages for the product"
- "Develop a content style guide for the app"
- "Write notification copy for user engagement"
- "Create tooltip and helper text for this form"
- "Design the confirmation and success messages"
- "Write the sign-up and login flow copy"
- "Plan the content strategy for this user journey"
- "Audit the existing UI copy for clarity and consistency"

## Instructions

### Core Workflow

**Step 1: Context and User Research**
- Identify the user's goal, emotional state, and knowledge level at each touchpoint
- Map the user journey to understand what happens before, during, and after each screen
- Review existing copy for tone inconsistencies, jargon, and friction points
- Catalog the product's voice attributes and any existing content guidelines
- Identify edge cases: error states, empty states, loading states, permission requests

**Step 2: Information Architecture of Content**
- Determine the hierarchy of information on each screen: what must users see first
- Classify content by type: instructional, confirmational, navigational, promotional, or error
- Define the reading pattern for each layout (F-pattern, Z-pattern, single focal point)
- Establish which copy is persistent vs. transient (always visible vs. triggered by action)
- Map content dependencies: what copy changes based on user state, data, or permissions

**Step 3: Drafting and Variation**
- Write three variations for each piece of copy: functional, conversational, and brand-forward
- Keep primary actions to 2-4 words; secondary actions to 1-3 words
- Front-load the most important information in every string
- Write for scannability: use sentence case, avoid all caps except for acronyms
- Draft gender-neutral, culturally inclusive, and accessible language

**Step 4: Content Testing and Validation**
- Read all copy aloud to check for natural rhythm and conversational tone
- Verify that every message answers the user's implicit question: "What do I do now?"
- Test copy in the actual UI to confirm it fits the layout without truncation
- Review with localization in mind: avoid idioms, puns, or culturally specific references
- Validate with real users through A/B testing, usability testing, or preference surveys

**Step 5: Documentation and Systematization**
- Create a content pattern library with reusable copy components
- Document voice and tone guidelines with before-and-after examples
- Build a terminology glossary to ensure consistent naming across the product
- Establish content governance: who approves copy, how changes are versioned
- Deliver annotated screen flows showing final copy in context

### Voice and Tone Framework

Voice is the consistent personality of the product. Tone adapts that personality to the user's emotional context. A product has one voice but many tones.

**Defining Product Voice:**
- Select 3-5 voice attributes (e.g., confident, warm, precise, playful, respectful)
- For each attribute, define what it means and what it does not mean
- Example: "Confident" means clear and direct; it does not mean arrogant or dismissive
- Create a voice spectrum: place each attribute on a scale (e.g., formal to casual)
- Write the same message in voice vs. out of voice to illustrate boundaries

**Adapting Tone to Context:**
- Celebratory moments (success, achievement): warm, enthusiastic, specific praise
- Neutral moments (navigation, settings): clear, efficient, minimal personality
- Frustration moments (errors, failures): empathetic, solution-focused, no blame
- High-stakes moments (payments, deletion): precise, reassuring, no ambiguity
- Onboarding moments: encouraging, patient, progressive disclosure

**Voice Application Matrix:**

| Context          | Formality | Humor | Empathy | Urgency |
|------------------|-----------|-------|---------|---------|
| Error messages   | Medium    | None  | High    | Medium  |
| Success states   | Low       | Light | Medium  | None    |
| Onboarding       | Low       | Light | High    | None    |
| Legal/compliance | High      | None  | Low     | Low     |
| Empty states     | Low       | Yes   | Medium  | None    |
| Notifications    | Medium    | Light | Medium  | Varies  |

**Consistency Mechanisms:**
- Maintain a "this, not that" reference document for common phrasing decisions
- Standardize punctuation rules: periods in body copy, no periods on buttons
- Define capitalization conventions: sentence case for UI, title case for navigation
- Establish pronoun usage: "you" for the user, "we" for the product/company
- Set number formatting rules: numerals for data, words for conversational copy

### Content Patterns Framework

Content patterns are reusable solutions to recurring UX writing challenges. Each pattern defines structure, principles, and adaptable templates.

**Error Messages Pattern:**
- Structure: [What happened] + [Why it matters] + [What to do next]
- Never blame the user; use passive voice or system-as-subject framing
- Be specific: "Your password needs at least 8 characters" not "Invalid password"
- Offer a clear recovery action as a button or link
- Keep error text near the element that caused the problem

**Empty States Pattern:**
- Structure: [What this space is for] + [Why it is empty] + [How to fill it]
- Use empty states as onboarding opportunities, not dead ends
- Include a primary action that helps the user populate the space
- Add light illustration or personality to soften the emptiness
- Differentiate first-use empty (educational) from cleared empty (confirmational)

**Confirmation Dialogs Pattern:**
- Structure: [What will happen] + [Is it reversible?] + [Confirm/Cancel actions]
- State the consequence explicitly: "This will permanently delete 12 files"
- Make the destructive action visually distinct and clearly labeled
- Use specific verbs on buttons: "Delete account" not "OK" or "Yes"
- Provide an undo option when possible instead of a pre-action confirmation

**Loading and Progress Pattern:**
- Structure: [What is happening] + [How long it might take]
- Use progressive messaging for long operations: step 1 of 3, almost done
- Avoid generic "Loading..." when a specific message is possible
- Add personality to wait moments when appropriate: "Crunching the numbers..."
- Set expectations: "This usually takes about 30 seconds"

**Permission Requests Pattern:**
- Structure: [What we need] + [Why we need it] + [What you get]
- Ask for permissions in context, at the moment the feature needs them
- Explain the benefit to the user, not the technical requirement
- Provide a graceful degradation message if the user declines
- Never use a permission request as the first interaction with the product

### Templates

**Template 1: Screen Copy Specification**

```
SCREEN: [Screen Name]
USER STATE: [New/Returning/Error/Success]
USER GOAL: [What the user is trying to accomplish]

HEADLINE: [Primary message - 5-10 words max]
SUBTEXT: [Supporting detail - 1-2 sentences max]

PRIMARY CTA: [2-4 words, action verb + object]
SECONDARY CTA: [1-3 words, alternative action]

FORM LABELS:
  - [Field]: Label: [text] | Placeholder: [text] | Helper: [text] | Error: [text]

SYSTEM MESSAGES:
  - Success: [message]
  - Error: [message]
  - Loading: [message]
  - Empty: [message]

NOTES: [Localization, accessibility, or edge case considerations]
```

**Template 2: Onboarding Flow Script**

```
FLOW: [Flow Name]
TARGET USER: [Persona/segment]
STEPS: [Total count]

STEP [#] of [#] - [Step Purpose]
  Screen title: [text]
  Body copy: [text - 2 sentences max]
  Visual: [Description of illustration/animation]
  CTA: [Button text]
  Skip option: [Yes/No - text if yes]
  Progress indicator: [Style description]

COMPLETION SCREEN:
  Headline: [Celebratory message]
  Body: [What they can do now - 1 sentence]
  CTA: [First action to take]
```

**Template 3: Content Audit Matrix**

```
PRODUCT: [Name]              AUDIT DATE: [Date]

| Screen       | Element     | Current Copy        | Issue           | Revised Copy        | Priority |
|--------------|-------------|---------------------|-----------------|---------------------|----------|
| Login        | Error msg   | "Error occurred"    | Vague, no help  | "Wrong password.    | High     |
|              |             |                     |                 |  Try again or reset" |          |
| Dashboard    | Empty state | "No data"           | No guidance     | "Add your first     | Medium   |
|              |             |                     |                 |  project to start"  |          |
| Settings     | Toggle      | "Enable"            | No context      | "Send me weekly     | Low      |
|              |             |                     |                 |  progress reports"  |          |
```

### Best Practices

- Lead with the verb in calls to action: "Save changes" not "Changes can be saved"
- Write for the smallest screen first; if it works on mobile, it works everywhere
- Use specific, concrete language: "3 items in your cart" not "Items have been added"
- Avoid double negatives: "Turn on notifications" not "Don't disable notifications"
- Reserve exclamation marks for genuine moments of celebration, never for errors
- Use consistent terminology: if it is a "project" on one screen, it is a "project" everywhere
- Write timestamps in human terms: "2 hours ago" not "2024-01-15T14:23:00Z"
- Provide context for toggles and checkboxes: describe the on-state, not the action
- Test every string at its maximum character length with real data
- Use numerals for quantities and measurements; words for conceptual references
- Avoid jargon and technical terms unless the audience expects them
- Make destructive actions harder to reach and clearly labeled
- Write for screen readers: ensure copy makes sense when read linearly without visual context
- Pair every error with a recovery path; never leave the user at a dead end
- Keep placeholder text distinct from labels to avoid confusion about field state

### Common Patterns

**Pattern 1: Sign-Up Flow Microcopy**

A SaaS product sign-up flow with three screens. Screen 1 shows "Create your account" as the headline with "Get started in under a minute" as supporting text. The email field uses the label "Work email" with placeholder "you@company.com" and inline validation: "We'll send a verification link to this address." The password field shows real-time strength feedback: "Add a number or symbol to strengthen" rather than arbitrary rules. The CTA reads "Create account" (not "Submit" or "Sign up"). Screen 2 is email verification: "Check your inbox" with "We sent a link to ana@example.com. It expires in 24 hours." and a secondary action "Resend email" with a cooldown note "You can resend in 58 seconds." Screen 3 is profile setup: "Tell us about your team" with progressive disclosure, only asking for essential fields and marking optional ones explicitly.

**Pattern 2: Error State Redesign**

A payment processing feature with three error scenarios. Generic server error: before was "Error 500: Internal server error." After: "Something went wrong on our end. Your card was not charged. Try again, or contact support if this keeps happening." Declined card: before was "Transaction declined." After: "Your bank declined this transaction. Double-check your card details or try a different payment method." Network timeout: before was "Request timed out." After: "We lost the connection before completing your payment. Check your internet and try again. If you were charged, we'll refund it automatically." Each revised message follows the pattern of empathy (what happened), reassurance (what did not happen), and action (what to do next).

**Pattern 3: Empty State Progression**

A project management tool's task list showing three empty state variations based on user lifecycle. First-use empty state: "This is where your tasks live. Create your first task to get started." with a prominent "Create task" button and a subtle "Import from CSV" link. No-results empty state after a search: "No tasks match your filters. Try adjusting your search terms or clearing filters." with a "Clear all filters" action. All-done empty state when tasks are completed: "You're all caught up. Nice work. Completed tasks are in your archive." with a "View archive" link. Each variant is tailored to the user's context, providing relevant guidance rather than a generic "Nothing here" message.

### Output Formats

**Format 1: Annotated Screen Flow**
A sequential document showing each screen in the user journey with all copy elements labeled, annotated with voice and tone notes, and accompanied by variant options for A/B testing. Includes edge case copy for error states, loading states, and permission scenarios. Delivered as a design-tool-compatible annotation layer or a standalone specification document.

**Format 2: Content Pattern Library**
A systematized collection of reusable copy components organized by pattern type (errors, empty states, confirmations, notifications, onboarding). Each entry includes the pattern structure, three example implementations, voice and tone guidance, accessibility notes, and localization considerations. Delivered as a living document that serves as the team's single source of truth for UI copy decisions.

**Format 3: UX Copy Deck**
A comprehensive spreadsheet or structured document mapping every string in the product, organized by screen and component. Each entry includes a unique string ID, the English source text, character count, context description, screenshot reference, and any localization notes. This format supports handoff to development, translation, and QA teams for implementation and internationalization workflows.
