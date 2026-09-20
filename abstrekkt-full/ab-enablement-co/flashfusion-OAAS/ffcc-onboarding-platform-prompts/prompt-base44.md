# Build: AI-Assisted Onboarding Wizard (Base44)

Build a production-grade, 5-step AI-assisted onboarding wizard as a
fully functional Base44 app. Use B44 entities, pages, actions, and
environment variables throughout. Do not reference Next.js, Vite, or
any external framework.

---

## What This Builds

A universal onboarding wizard that works for any SaaS, AI tool, app
builder, marketplace, dashboard, or workflow product. It is not
hardcoded for one industry. It infers user intent, asks the minimum
necessary questions, and produces a personalized artifact as output.

Core behavior:
- Infer missing information rather than blocking progress
- Ask fewer questions, not more
- Explain assumptions and let the user dismiss them
- Never require an optional field to advance
- Generate structured, immediately useful outputs from vague input
- Completable in under 60 seconds

---

## B44 Entity: OnboardingSession

Create a B44 entity named OnboardingSession with these fields:

  id                Text           auto-generated UUID
  userId            Text           from auth context
  currentStep       Number         1 through 5, default 1
  goalText          Text           raw free text, optional
  selectedGoalType  Text           enum: build | automate | content |
                                   learn | organize | sell | analyze |
                                   not-sure. Default: not-sure
  guidanceMode      Text           enum: step-by-step | suggest |
                                   fast | full-control. Default: suggest
  dynamicAnswers    JSON           key-value map of string answers
  inferredIntent    JSON           null until Step 4 AI call completes
  assumptions       JSON           list of strings, dismissable
  recommendedPath   Text           populated after Step 4
  generatedOutput   JSON           null until Step 5 AI call completes
  createdAt         DateTime       auto
  updatedAt         DateTime       auto

inferredIntent JSON shape:
  {
    "category": GoalType,
    "primaryTask": string,
    "secondaryTasks": string[],
    "complexity": "low" | "medium" | "high",
    "confidence": number (0.0–1.0),
    "recommendedOutputType": OutputType
  }

OutputType values:
  project-plan | app-scaffold | automation-blueprint | content-plan |
  learning-roadmap | agent-config | checklist | first-draft |
  dashboard-setup | workspace-template

generatedOutput JSON shape:
  {
    "title": string,
    "summary": string,
    "type": OutputType,
    "sections": [{ "title": string, "content": string | string[] }],
    "nextSteps": string[],
    "suggestedActions": [{ "label": string, "action": string }],
    "exportableMarkdown": string,
    "exportableJson": object
  }

---

## B44 Pages (5 steps)

Create one B44 page per step. Navigate forward with a B44 navigation
action. Pass the session ID through navigation context.

### Page 1 — Goal Capture

Heading: "What are you trying to accomplish?"

Elements:
- Text input field bound to goalText (max 300 chars, optional)
- 8 chip/tag buttons in a grid:
    Build something | Automate something | Generate content |
    Learn something | Organize something | Sell something |
    Analyze something | Not sure yet
- Clicking a chip sets selectedGoalType and pre-fills goalText
- Free text entry overrides goalText but keeps chip selection
- "Continue" button advances to Page 2
- If guidanceMode is already 'fast': auto-advance 400ms after chip tap
- Default if user skips: selectedGoalType = 'not-sure'

---

### Page 2 — Guidance Mode

Heading: "How much guidance do you want?"

Elements:
- 4 selectable option cards (not a dropdown):
    "Guide me step by step"               → step-by-step
    "Suggest and let me choose"           → suggest
    "Move fast and make smart assumptions" → fast
    "Give me full control"                → full-control
- Selecting a card sets guidanceMode
- When 'fast' is selected, show inline note:
    "I'll make smart assumptions and skip optional fields."
- "Continue" button advances to Page 3
- Default if user skips: guidanceMode = 'suggest'

---

### Page 3 — Dynamic Context

Heading: "A few quick details"

Render 2–3 input fields based on selectedGoalType.
All fields are optional. Never block the Continue button if empty.
If guidanceMode is 'fast', show smart ghost text suggestions in each field.

Field config — implement all 8 goal types completely:

  build:
    product_type     "What kind of product?" e.g. Web app, API, Chrome extension
    target_audience  "Who is it for?" e.g. Internal team, SaaS customers
    desired_output   "Desired format?" e.g. MVP, prototype, production app

  automate:
    trigger_event    "What starts the workflow?" e.g. New form submission
    target_action    "What should happen?" e.g. Send Slack notification
    connected_tools  "Tools involved?" e.g. Zapier, Notion, Gmail

  content:
    content_type     "What kind of content?" e.g. Blog posts, LinkedIn, emails
    target_audience  "Who reads it?" e.g. Startup founders, HR managers
    tone             "What tone?" e.g. Direct, friendly, technical
    platform         "Where does it live?" e.g. LinkedIn, Substack, website

  learn:
    topic            "What do you want to learn?" e.g. Python, prompt engineering
    current_level    "Current level?" e.g. Beginner, intermediate, advanced
    preferred_format "How do you learn best?" e.g. Projects, reading, videos

  organize:
    what_to_organize "What needs organizing?" e.g. My Notion workspace, files
    current_system   "Current setup?" e.g. Spreadsheet, sticky notes, nothing
    output_format    "Desired output?" e.g. Dashboard, folder structure, template

  sell:
    product_or_service "What are you selling?" e.g. SaaS tool, consulting
    target_audience    "Who buys it?" e.g. SMB owners, enterprise IT teams
    sales_channel      "How do you sell?" e.g. Outbound, inbound, marketplace

  analyze:
    data_source      "What data?" e.g. Google Analytics, CSV export, CRM data
    decision_to_make "What decision does this drive?" e.g. Pricing, hiring
    output_format    "How do you need it?" e.g. Dashboard, summary report, chart

  not-sure:
    describe_problem "Describe what you're trying to solve"
    constraint       "Any constraints?" e.g. Budget, timeline, tech stack
    timeline         "When do you need this?" e.g. This week, this quarter

Save all answers to dynamicAnswers JSON field as user types.

"Continue" button advances to Page 4.

---

### Page 4 — AI Summary + Confirmation

On page load, call the INFERENCE server action (defined below).
While the action runs, show a loading skeleton — not a spinner.

Display the result as an editable summary:
- Interpreted goal (editable inline text)
- Inferred user type (text, not editable)
- Primary task (editable inline text)
- Secondary tasks list (if any)
- Confidence badge (text only — e.g. "High confidence" / "Medium confidence")
- Assumptions list — each assumption has an X button that removes it
  from the list (update assumptions field on session)
- Recommended starting path (editable inline text)

Four action buttons:
  "Looks good"    → save edits to session, advance to Page 5
  "Refine"        → navigate back to Page 3 with existing answers intact
  "Start over"    → clear session fields, navigate to Page 1
  "Let AI decide" → advance to Page 5 with AI filling all gaps

---

### Page 5 — Personalized Output

On page load, call the GENERATION server action (defined below).
While the action runs, show a loading skeleton shaped like the output.

Display generatedOutput:
- Title and summary at top
- Each section as a collapsible card with a copy button
- Next steps as a numbered list
- Suggested actions as pill buttons (each fires a B44 action)
- "Copy as Markdown" button — copies exportableMarkdown to clipboard
- "Export JSON" button — triggers download of exportableJson as .json file
- "Apply to Workspace" button — fires a B44 action you define.
  Default behavior: show success toast "Your workspace has been configured."

---

## B44 Server Actions

### INFERENCE Action

Name: inferOnboardingIntent

Trigger: Called from Page 4 on load.

Input: OnboardingSession (goalText, selectedGoalType, guidanceMode, dynamicAnswers)

Behavior:
1. Build a prompt from the session fields (see PROMPT TEMPLATES below)
2. Call the external LLM API using the API key stored in B44 environment
   variable: LLM_API_KEY
3. Parse the JSON response
4. Update the session: set inferredIntent, assumptions, recommendedPath
5. Return updated session to the page

On failure: return a mock response from MOCK RESPONSES below.
Never return an empty response or throw an unhandled error.

---

### GENERATION Action

Name: generateOnboardingOutput

Trigger: Called from Page 5 on load.

Input: full OnboardingSession after Page 4 confirmation

Behavior:
1. Build a generation prompt from the full session (see PROMPT TEMPLATES)
2. Call the external LLM API using LLM_API_KEY environment variable
3. Parse the JSON response
4. Update the session: set generatedOutput
5. Return updated session to the page

On failure: return mock from MOCK RESPONSES below.
Show inline note: "Using suggested template — AI unavailable."
Never block the page or show a full-screen error.

---

## Prompt Templates

### Inference Prompt (system message)

You are an onboarding assistant. Analyze the user's input and return
ONLY a valid JSON object. No preamble. No markdown. No explanation.

User input:
  Goal text: {goalText}
  Goal type: {selectedGoalType}
  Guidance mode: {guidanceMode}
  Additional context: {dynamicAnswers}

Return this exact JSON shape:
{
  "category": string,
  "primaryTask": string,
  "secondaryTasks": string[],
  "complexity": "low" | "medium" | "high",
  "confidence": number,
  "recommendedOutputType": string,
  "assumptions": string[],
  "recommendedPath": string
}

Infer missing fields from available context. Set confidence based on
how much signal the user provided. secondaryTasks must be an array —
empty array if none.

---

### Generation Prompt (system message)

You are a personalized setup generator. Based on the user's confirmed
onboarding session, generate a useful, specific, non-generic output artifact.

Session:
  Goal: {goalText}
  Type: {selectedGoalType}
  Guidance: {guidanceMode}
  Context: {dynamicAnswers}
  Primary task: {inferredIntent.primaryTask}
  Complexity: {inferredIntent.complexity}
  Output type: {inferredIntent.recommendedOutputType}
  Confirmed assumptions: {assumptions}

Return ONLY a valid JSON object. No preamble. No markdown fences.

{
  "title": string,
  "summary": string,
  "type": string,
  "sections": [{ "title": string, "content": string | string[] }],
  "nextSteps": string[],
  "suggestedActions": [{ "label": string, "action": string }],
  "exportableMarkdown": string,
  "exportableJson": object
}

Requirements:
- Minimum 3 sections
- Minimum 3 nextSteps
- Minimum 2 suggestedActions
- exportableMarkdown must be a complete, copy-ready Markdown document
- Output must be specific to the user's goal — not generic

---

## Mock Responses

Use these when the LLM API is unavailable. Implement all 8 goal types.

Mock inferredIntent by selectedGoalType:

  build:
    primaryTask: "Build and ship a working product"
    secondaryTasks: ["Define tech stack", "Set up project scaffold"]
    complexity: medium, confidence: 0.75
    recommendedOutputType: app-scaffold
    assumptions: ["You want an MVP first", "Target is a web product"]
    recommendedPath: "Start with core feature → wire UI → connect backend"

  automate:
    primaryTask: "Eliminate manual steps in your workflow"
    secondaryTasks: ["Map current process", "Identify trigger points"]
    complexity: medium, confidence: 0.75
    recommendedOutputType: automation-blueprint
    assumptions: ["Trigger is event-based", "Tools support API access"]
    recommendedPath: "Define trigger → map actions → test with sample data"

  content:
    primaryTask: "Create a consistent content output system"
    secondaryTasks: ["Define tone", "Build a content calendar"]
    complexity: low, confidence: 0.75
    recommendedOutputType: content-plan
    assumptions: ["Publishing at least weekly", "Single primary platform"]
    recommendedPath: "Set themes → batch create → schedule → measure"

  learn:
    primaryTask: "Build structured knowledge in your target area"
    secondaryTasks: ["Find learning resources", "Set milestones"]
    complexity: low, confidence: 0.75
    recommendedOutputType: learning-roadmap
    assumptions: ["Self-paced learning preferred", "Goal is practical application"]
    recommendedPath: "Foundations → applied projects → peer review → iterate"

  organize:
    primaryTask: "Create a system you will actually maintain"
    secondaryTasks: ["Audit current state", "Define naming conventions"]
    complexity: low, confidence: 0.75
    recommendedOutputType: workspace-template
    assumptions: ["Starting from partial existing system", "Solo or small team"]
    recommendedPath: "Audit → structure → template → document → maintain"

  sell:
    primaryTask: "Build a repeatable path from prospect to close"
    secondaryTasks: ["Define ICP", "Map the sales motion"]
    complexity: medium, confidence: 0.75
    recommendedOutputType: project-plan
    assumptions: ["Direct sales motion", "Defined product or service"]
    recommendedPath: "ICP → outreach → demo → follow-up → close → onboard"

  analyze:
    primaryTask: "Turn raw data into a decision"
    secondaryTasks: ["Clean data", "Choose visualization"]
    complexity: medium, confidence: 0.75
    recommendedOutputType: dashboard-setup
    assumptions: ["Data source is accessible", "One primary decision to drive"]
    recommendedPath: "Pull data → clean → model → visualize → decide"

  not-sure:
    primaryTask: "Clarify the problem before building a solution"
    secondaryTasks: ["Define success criteria", "Identify constraints"]
    complexity: low, confidence: 0.5
    recommendedOutputType: checklist
    assumptions: ["Problem is still being scoped", "Flexibility on approach"]
    recommendedPath: "Define → scope → prioritize → prototype → validate"

Mock generatedOutput — implement one complete example per goal type.
Each mock must include 3 sections, 3 nextSteps, 2 suggestedActions,
and a full exportableMarkdown string. Content must be specific and
non-generic — no lorem ipsum, no placeholder text.

---

## Demo Flows

Add a "See an example" link on Page 1 that loads one of these demo
sessions so the user can see a completed flow without entering data.

Demo 1 — Build an AI Coding Assistant
  goalText: "Build an AI coding assistant for my dev team"
  selectedGoalType: build
  dynamicAnswers:
    product_type: "Internal developer tool"
    target_audience: "Software engineers at a 20-person startup"
    desired_output: "VS Code extension with chat interface"

Demo 2 — Automate Lead Follow-Up
  goalText: "Automate my lead follow-up from CRM to email"
  selectedGoalType: automate
  dynamicAnswers:
    trigger_event: "New lead created in HubSpot"
    target_action: "Send personalized follow-up email via Gmail"
    connected_tools: "HubSpot, Gmail, Slack"

Demo 3 — 30-Day LinkedIn Content Plan
  goalText: "Generate a 30-day LinkedIn content plan for my SaaS"
  selectedGoalType: content
  dynamicAnswers:
    content_type: "Thought leadership and product updates"
    target_audience: "Startup founders and operations leads"
    tone: "Direct, no fluff, occasionally contrarian"
    platform: "LinkedIn"

---

## UI Requirements

Layout:
- Wizard card centered, max-width 720px
- Progress indicator at top showing 5 steps:
    Intent / Style / Context / Verify / Launch
- Completed steps show a checkmark, active step highlighted
- Clicking a completed step navigates back (show confirm dialog on Step 4–5)
- Collapsible AI suggestion panel visible on desktop, hidden on mobile
  (toggle button to show). Auto-hides when guidanceMode is 'full-control'.

States — implement all four:
  Empty:   ghost text, chip grid visible, no user content yet
  Loading: skeleton layout (CSS pulse), not a spinner
  Error:   inline error + retry button, never full-page error
  Success: output visible, export buttons prominent

Design:
- Dark mode primary, light mode supported
- Primary accent: violet (#6B5CF6)
- Strong typographic hierarchy — use a distinctive display font for headings
- Polished card hover states and chip selection animations
- No generic template aesthetics

---

## Security

Store the LLM API key as a B44 environment variable named LLM_API_KEY.
Never reference the key in any page code, component, or client-side logic.
Access it only inside B44 server actions.
