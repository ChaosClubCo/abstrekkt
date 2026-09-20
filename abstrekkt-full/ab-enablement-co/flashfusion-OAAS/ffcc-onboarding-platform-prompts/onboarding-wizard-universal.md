# Build: AI-Assisted Onboarding Wizard

You are building a production-grade, 5-step AI-assisted onboarding wizard.
Adapt this spec to your platform's native patterns. Use your platform's
standard file structure, routing, and component conventions. Do not force
a framework that does not match your environment.

Read the PLATFORM APPENDIX at the bottom before generating any code.

---

## What This Builds

A universal onboarding wizard that works for any SaaS, AI tool, app builder,
marketplace, dashboard, or workflow product. It is not hardcoded for one
industry. It infers user intent, asks the minimum necessary questions, and
produces a personalized artifact as its final output.

Core behavior:
- Infer missing information rather than blocking progress
- Ask fewer questions, not more
- Explain assumptions clearly and let the user dismiss them
- Never require an optional field to advance
- Generate structured, immediately useful outputs from incomplete input
- Complete in under 60 seconds

---

## Data Model

Implement this session state shape using your platform's native state or
entity system. Every field listed must exist.

OnboardingSession:
  id                string         unique session identifier
  userId            string         from auth context
  currentStep       number         1 through 5
  goalText          string         raw free text from user
  selectedGoalType  GoalType       see enum below
  guidanceMode      GuidanceMode   see enum below
  dynamicAnswers    key-value map  string keys, string values
  inferredIntent    InferredIntent or null
  assumptions       list of strings
  recommendedPath   string
  generatedOutput   GeneratedOutput or null
  createdAt         timestamp
  updatedAt         timestamp

GoalType enum:
  build | automate | content | learn | organize | sell | analyze | not-sure

GuidanceMode enum:
  step-by-step | suggest | fast | full-control

InferredIntent:
  category              GoalType
  primaryTask           string
  secondaryTasks        list of strings (empty list if none — never null)
  complexity            low | medium | high
  confidence            number between 0.0 and 1.0
  recommendedOutputType OutputType

OutputType enum:
  project-plan | app-scaffold | automation-blueprint | content-plan |
  learning-roadmap | agent-config | checklist | first-draft |
  dashboard-setup | workspace-template

GeneratedOutput:
  title               string
  summary             string
  type                OutputType
  sections            list of { title: string, content: string or string[] }
  nextSteps           list of strings
  suggestedActions    list of { label: string, action: string }
  exportableMarkdown  string — full copy-ready Markdown
  exportableJson      object — structured version of the output

---

## The 5 Steps

### Step 1 — Goal Capture

Display heading: "What are you trying to accomplish?"

Show a free-text input (max 300 characters) and 8 quick-select chips:
  Build something / Automate something / Generate content / Learn something /
  Organize something / Sell something / Analyze something / Not sure yet

Behavior:
- Selecting a chip sets selectedGoalType and pre-fills goalText
- Free text input overrides the chip label but keeps the chip selected
- Both can coexist
- If guidanceMode is already 'fast': auto-advance 400ms after chip tap
- If user skips without selecting: default selectedGoalType to 'not-sure'

---

### Step 2 — Guidance Mode

Display heading: "How much guidance do you want?"

Show 4 option cards (not a dropdown, not radio buttons — visual cards):
  "Guide me step by step"          → step-by-step
  "Suggest and let me choose"      → suggest
  "Move fast and make smart assumptions" → fast
  "Give me full control"           → full-control

When 'fast' is selected, show an inline note:
  "I'll make smart assumptions and skip optional fields."

Default if user skips: guidanceMode = 'suggest'

---

### Step 3 — Dynamic Context

Render 2–3 input fields based on selectedGoalType.
All fields are optional. Never block progress if empty.
If guidanceMode is 'fast', pre-populate each field with a
smart placeholder suggestion shown as ghost/hint text.

Field config for each goal type — implement all 8, no stubs:

  build:     product_type | target_audience | desired_output
  automate:  trigger_event | target_action | connected_tools
  content:   content_type | target_audience | tone | platform
  learn:     topic | current_level | preferred_format
  organize:  what_to_organize | current_system | output_format
  sell:      product_or_service | target_audience | sales_channel
  analyze:   data_source | decision_to_make | output_format
  not-sure:  describe_problem | constraint | timeline

---

### Step 4 — AI Summary + Confirmation

Call the AI INFERENCE function (see AI Integration section below) with
the current session. While waiting, show a loading skeleton — not a spinner.

Display the result as an editable summary:
  - Interpreted goal (inline editable field)
  - Inferred user type
  - Primary task
  - Secondary tasks (if any)
  - Confidence level (text badge — not a progress bar)
  - Assumptions list (each assumption has an X button to dismiss it)
  - Recommended starting path (inline editable)

Four action buttons:
  "Looks good"    → advance to Step 5
  "Refine"        → return to Step 3 with answers pre-populated
  "Start over"    → clear session, return to Step 1
  "Let AI decide" → skip to Step 5, AI fills all remaining gaps

---

### Step 5 — Personalized Output

Call the AI GENERATION function with the confirmed session.
Show a loading skeleton shaped like the expected output while waiting.

Display GeneratedOutput:
  - Each section as a collapsible card with a copy-to-clipboard icon
  - Next steps as a numbered list
  - Suggested actions as pill buttons
  - "Copy as Markdown" button — copies exportableMarkdown to clipboard
  - "Export JSON" button — downloads exportableJson as a .json file
  - "Apply to Workspace" button — fires the host app's integration callback.
    Default behavior if no callback is defined: show a success toast.

---

## AI Integration

There are two AI calls in this wizard. Both must run server-side or in a
secure server function. Under no circumstances should an API key appear in
client-side code, a browser bundle, or any file that is served to the user.

INFERENCE CALL — fires at Step 4
  Input:  goalText, selectedGoalType, guidanceMode, dynamicAnswers
  Output: InferredIntent, assumptions list, recommendedPath string
  
  System prompt must instruct the model to:
  - Return only valid JSON matching the InferredIntent shape
  - Include no preamble, no markdown fences, no explanation
  - Infer missing fields from context rather than leaving them empty
  - Set confidence based on how much signal the user provided

GENERATION CALL — fires at Step 5
  Input:  full OnboardingSession after Step 4 confirmation
  Output: GeneratedOutput
  
  System prompt must instruct the model to:
  - Return only valid JSON matching the GeneratedOutput shape
  - Make the output specific to the user's actual goal — not generic
  - Write exportableMarkdown as a full, copy-ready document
  - Include minimum 3 sections, 3 nextSteps, 2 suggestedActions

FALLBACK — if the AI call fails or no API key is configured:
  Do not throw an error or show a blank screen.
  Fall back to a deterministic mock response keyed by selectedGoalType.
  Implement complete mocks for all 8 goal types.
  Display a subtle inline note: "Using suggested template — AI unavailable."

RETRY — on API failure, retry once automatically before showing an
  inline error with a manual retry button. Never show a full-page error.

---

## Demo Seed Data

Implement these 3 concrete demo flows as selectable examples on a
"See an example" link visible on Step 1. Each must be fully populated,
specific, and non-generic.

Demo 1 — Build an AI Coding Assistant
  selectedGoalType: build
  goalText: "I want to build an AI coding assistant for my dev team"
  dynamicAnswers:
    product_type: "Internal developer tool"
    target_audience: "Software engineers at a 20-person startup"
    desired_output: "VS Code extension with chat interface"
  Expected output type: app-scaffold
  Output must include: recommended stack, file tree sketch, first 3
    implementation steps, API integration checklist

Demo 2 — Automate Lead Follow-Up
  selectedGoalType: automate
  goalText: "Automate my lead follow-up from CRM to email"
  dynamicAnswers:
    trigger_event: "New lead created in HubSpot"
    target_action: "Send personalized follow-up email via Gmail"
    connected_tools: "HubSpot, Gmail, Slack for notifications"
  Expected output type: automation-blueprint
  Output must include: trigger definition, 5-step action sequence,
    tool connection requirements, error handling note, test checklist

Demo 3 — 30-Day LinkedIn Content Plan
  selectedGoalType: content
  goalText: "Generate a 30-day LinkedIn content plan for my SaaS"
  dynamicAnswers:
    content_type: "Thought leadership posts and product updates"
    target_audience: "Startup founders and operations leads"
    tone: "Direct, no fluff, occasionally contrarian"
    platform: "LinkedIn"
  Expected output type: content-plan
  Output must include: weekly theme calendar, 5 sample post hooks,
    tone guide, posting schedule, engagement strategy note

---

## UI Requirements

Layout:
  - Wizard card: max-width 720px, centered
  - Progress indicator: vertical rail on left at desktop widths,
    horizontal bar at top on mobile
  - Progress labels: Intent / Style / Context / Verify / Launch
  - Completed steps show a checkmark, active step highlighted
  - Clicking a completed step navigates back (confirm if on Step 4 or 5)
  - AI suggestion panel: collapsible, right side on desktop,
    bottom sheet on mobile. Auto-hides when guidanceMode is 'full-control'.

States — implement all four:
  Empty:   ghost text visible, chip grid shown, no user input yet
  Loading: skeleton blocks shaped like the expected output, CSS pulse only
  Error:   inline error message + retry button, never a full-page error
  Success: output visible, export buttons prominent

Motion:
  - Step transitions: fade in + slide up, ~200ms ease-out
  - Card hover: very subtle scale, ~150ms
  - Respect prefers-reduced-motion: disable all transitions if set

Design:
  - Dark/light mode friendly
  - Clean card-based layout, strong typographic hierarchy
  - Primary accent: violet (#6B5CF6 or platform equivalent)
  - Use a distinctive display font for headings — not Inter, not Roboto,
    not system fonts. Choose something with character.
  - Polished microinteractions on chip selection and card hover
  - No generic startup-template aesthetics

---

## Validation Rules

  goalText:          optional, max 300 chars
  selectedGoalType:  defaults to 'not-sure' if skipped
  guidanceMode:      defaults to 'suggest' if skipped
  dynamicAnswers:    all fields optional, never block progress
  guidanceMode fast: skip all validation, advance with defaults

---

## Hard Constraints

1. API keys must be server-side only. No key in any client-executed code.
   If your platform cannot enforce this, use a proxy or edge function.

2. No HTML form elements. Use click and change handlers only.

3. All components and functions must be fully typed where the platform
   supports typing. No implicit any.

4. No placeholder text, TODO comments, or stub functions in the output.
   Every function listed must be fully implemented.

5. Error boundaries must wrap the shell and each AI-dependent step.

6. Session state must survive a page refresh. Use your platform's
   available persistence (sessionStorage, local state persistence,
   or platform-native session handling).

---

## PLATFORM APPENDIX

Read the section that matches your environment. Ignore all others.

---

### IF YOU ARE BASE44

- Ignore all file paths in this spec. Generate using B44 entities, pages,
  and actions.
- Map OnboardingSession to a B44 entity with the fields above.
- Implement the 5 steps as B44 pages with B44 navigation.
- Implement the INFERENCE and GENERATION calls as B44 server actions that
  call an external API (Anthropic or your configured LLM endpoint).
- Store the API key in B44 environment variables — never in page code.
- Use B44's built-in session handling instead of sessionStorage.
- The "Apply to Workspace" button fires a B44 action you define.
- Output: a fully functional B44 app.

---

### IF YOU ARE LOVABLE

- Generate a React + Vite component tree.
- Implement the 5 steps as React components with useState or useReducer
  for session state.
- For the AI calls (INFERENCE and GENERATION): implement them as
  Supabase Edge Functions. Do not call the AI API directly from React.
  The Edge Function receives the session payload, calls the LLM, and
  returns the result. Store the API key as a Supabase secret.
- Use sessionStorage for session persistence across page refreshes.
- Use Framer Motion for step transitions.
- Use Tailwind CSS for styling.
- Output: React component files + Supabase Edge Function files.

---

### IF YOU ARE GOOGLE AI STUDIO / GEMINI

- Output all files as clearly labeled markdown code blocks.
- Replace any reference to claude-sonnet or Anthropic API with the
  Gemini equivalent (gemini-1.5-pro or gemini-2.0-flash as available).
- Structure the output as a Next.js 14 App Router project:
    /app/onboarding/page.tsx
    /app/api/onboarding/infer/route.ts
    /app/api/onboarding/generate/route.ts
    /components/onboarding/ (one file per component)
    /lib/onboarding/ (schemas, infer-intent, generate-output, session-storage)
- The API routes call the Gemini API server-side. GOOGLE_API_KEY is
  accessed via process.env only — never in client code.
- Output every file completely. Do not truncate with "// ... rest of file".
- After outputting all files, provide setup instructions:
    npm create next-app, install commands, env var setup.

---

### IF YOU ARE V0 (VERCEL)

- Generate React components only. Do not generate API routes.
- Use shadcn/ui components where appropriate.
- Use Tailwind CSS for all styling.
- Implement mock versions of the INFERENCE and GENERATION calls that
  return the demo seed data (Demo 1, 2, 3) based on selectedGoalType.
- Add a comment in each mock function: "// Replace with server action
  calling your LLM API — never call LLM API from this file directly."
- Output: component files ready to drop into an existing Next.js project.

---

### IF YOU ARE CLAUDE / CURSOR / ANY NEXT.JS ENVIRONMENT

- Generate a Next.js 14 App Router project with this file structure:
    /app/onboarding/page.tsx
    /app/api/onboarding/infer/route.ts
    /app/api/onboarding/generate/route.ts
    /components/onboarding/OnboardingShell.tsx
    /components/onboarding/ProgressIndicator.tsx
    /components/onboarding/GoalCaptureStep.tsx
    /components/onboarding/GuidanceModeStep.tsx
    /components/onboarding/DynamicContextStep.tsx
    /components/onboarding/AISummaryStep.tsx
    /components/onboarding/GeneratedOutputStep.tsx
    /components/onboarding/AISuggestionPanel.tsx
    /components/onboarding/EditableField.tsx
    /components/onboarding/OutputCard.tsx
    /components/onboarding/NextActionList.tsx
    /lib/onboarding/schemas.ts
    /lib/onboarding/infer-intent.ts
    /lib/onboarding/generate-output.ts
    /lib/onboarding/session-storage.ts
- API routes call Anthropic claude-sonnet-4-20250514 server-side.
  ANTHROPIC_API_KEY accessed via process.env only.
- Use the uuid package for session ID generation.
- Use Framer Motion for step transitions.
- Use Tailwind CSS. Use a distinctive display font — not Inter.
- Output the file tree first, then each file in full.
  Do not truncate any file.
