# Build: AI-Assisted Onboarding Wizard (Next.js + Gemini)

Output a complete Next.js 14 App Router project implementing a
production-grade, 5-step AI-assisted onboarding wizard. Use the
Gemini API for AI inference and generation. Output every file in
full as labeled markdown code blocks. Do not truncate any file.
Do not use placeholder comments like "// rest of implementation here."

After all files, output setup instructions.

---

## What This Builds

A universal onboarding wizard for any SaaS, AI tool, app builder,
marketplace, dashboard, or workflow product. Not hardcoded for one
industry. Infers user intent, asks minimum questions, produces a
personalized artifact as output.

Core behavior:
- Infer missing information rather than blocking progress
- Ask fewer questions, not more
- Explain assumptions and let the user dismiss them
- Never require optional fields to advance
- Generate structured, immediately useful outputs from vague input
- Completable in under 60 seconds

---

## Output Order

Output files in this exact order, each as a labeled code block:

1.  package.json
2.  tsconfig.json
3.  tailwind.config.ts
4.  app/layout.tsx
5.  app/globals.css
6.  lib/onboarding/schemas.ts
7.  lib/onboarding/mock-data.ts
8.  lib/onboarding/session-storage.ts
9.  lib/onboarding/infer-intent.ts
10. lib/onboarding/generate-output.ts
11. app/api/onboarding/infer/route.ts
12. app/api/onboarding/generate/route.ts
13. components/onboarding/OnboardingShell.tsx
14. components/onboarding/ProgressIndicator.tsx
15. components/onboarding/GoalCaptureStep.tsx
16. components/onboarding/GuidanceModeStep.tsx
17. components/onboarding/DynamicContextStep.tsx
18. components/onboarding/AISummaryStep.tsx
19. components/onboarding/GeneratedOutputStep.tsx
20. components/onboarding/AISuggestionPanel.tsx
21. components/onboarding/EditableField.tsx
22. components/onboarding/OutputCard.tsx
23. components/onboarding/NextActionList.tsx
24. app/onboarding/page.tsx
25. .env.local.example
26. Setup instructions (plain text, not a code block)

---

## TypeScript Types (lib/onboarding/schemas.ts)

Define and export all of the following:

```ts
export type GoalType =
  | 'build' | 'automate' | 'content' | 'learn'
  | 'organize' | 'sell' | 'analyze' | 'not-sure'

export type GuidanceMode =
  | 'step-by-step' | 'suggest' | 'fast' | 'full-control'

export type Complexity = 'low' | 'medium' | 'high'

export type OutputType =
  | 'project-plan' | 'app-scaffold' | 'automation-blueprint'
  | 'content-plan' | 'learning-roadmap' | 'agent-config'
  | 'checklist' | 'first-draft' | 'dashboard-setup' | 'workspace-template'

export interface InferredIntent {
  category: GoalType
  primaryTask: string
  secondaryTasks: string[]
  complexity: Complexity
  confidence: number
  recommendedOutputType: OutputType
}

export interface GeneratedOutput {
  title: string
  summary: string
  type: OutputType
  sections: Array<{ title: string; content: string | string[] }>
  nextSteps: string[]
  suggestedActions: Array<{ label: string; action: string }>
  exportableMarkdown: string
  exportableJson: object
}

export interface OnboardingSession {
  id: string
  userId: string
  currentStep: 1 | 2 | 3 | 4 | 5
  goalText: string
  selectedGoalType: GoalType
  guidanceMode: GuidanceMode
  dynamicAnswers: Record<string, string>
  inferredIntent: InferredIntent | null
  assumptions: string[]
  recommendedPath: string
  generatedOutput: GeneratedOutput | null
  createdAt: string
  updatedAt: string
}
```

---

## API Routes

### app/api/onboarding/infer/route.ts

- POST handler
- Reads GOOGLE_API_KEY from process.env (never from request)
- Calls Gemini API: gemini-2.0-flash or gemini-1.5-pro
- System prompt instructs model to return ONLY valid JSON
  matching InferredIntent + assumptions + recommendedPath
- Strips markdown fences from response before JSON.parse
- On parse failure or API error: returns mock from mock-data.ts
- Validates userId from request before processing (return 401 if missing)
- Rate limit: return 429 if called more than 10 times per minute per userId

Request body:
```ts
{
  session: Pick<OnboardingSession,
    'goalText' | 'selectedGoalType' | 'guidanceMode' | 'dynamicAnswers'>
  userId: string
}
```

Response:
```ts
{
  inferredIntent: InferredIntent
  assumptions: string[]
  recommendedPath: string
  fallback?: boolean
}
```

Inference system prompt:
```
You are an onboarding assistant. Analyze the user input and return
ONLY a valid JSON object. No preamble. No markdown. No explanation.

Shape:
{
  "category": string,
  "primaryTask": string,
  "secondaryTasks": string[],
  "complexity": "low" | "medium" | "high",
  "confidence": number (0.0 to 1.0),
  "recommendedOutputType": string,
  "assumptions": string[],
  "recommendedPath": string
}

Infer missing fields from context. secondaryTasks must be an array.
Set confidence based on how much signal the user provided.
```

---

### app/api/onboarding/generate/route.ts

- POST handler
- Same auth and rate limit pattern as infer route
- Calls Gemini API with the full session
- Returns GeneratedOutput
- Falls back to mock on failure

Request body:
```ts
{ session: OnboardingSession; userId: string }
```

Response:
```ts
{ output: GeneratedOutput; fallback?: boolean }
```

Generation system prompt:
```
You are a personalized setup generator. Generate a specific,
non-generic output artifact based on the user's confirmed onboarding.
Return ONLY valid JSON. No preamble. No markdown fences.

Shape:
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

Minimum: 3 sections, 3 nextSteps, 2 suggestedActions.
exportableMarkdown must be a complete copy-ready Markdown document.
```

---

## Mock Data (lib/onboarding/mock-data.ts)

Export getMockInfer(goalType: GoalType) and getMockOutput(goalType: GoalType).
Implement all 8 GoalType values with realistic, specific content.
No placeholder text. No lorem ipsum.

Also export these three named demo sessions:

DEMO_BUILD_AI_APP:
  goalText: "Build an AI coding assistant for my dev team"
  selectedGoalType: build
  dynamicAnswers:
    product_type: "Internal developer tool"
    target_audience: "Software engineers at a 20-person startup"
    desired_output: "VS Code extension with chat interface"
  generatedOutput type: app-scaffold
  Must include: tech stack, file tree, 3 implementation steps, API checklist

DEMO_AUTOMATE_WORKFLOW:
  goalText: "Automate my lead follow-up from CRM to email"
  selectedGoalType: automate
  dynamicAnswers:
    trigger_event: "New lead created in HubSpot"
    target_action: "Send personalized follow-up email via Gmail"
    connected_tools: "HubSpot, Gmail, Slack"
  generatedOutput type: automation-blueprint
  Must include: trigger definition, 5-step action sequence, error handling note

DEMO_GENERATE_CONTENT:
  goalText: "Generate a 30-day LinkedIn content plan for my SaaS"
  selectedGoalType: content
  dynamicAnswers:
    content_type: "Thought leadership and product updates"
    target_audience: "Startup founders and operations leads"
    tone: "Direct, no fluff, occasionally contrarian"
    platform: "LinkedIn"
  generatedOutput type: content-plan
  Must include: weekly theme calendar, 5 sample post hooks, posting schedule

---

## Step Components

### GoalCaptureStep.tsx
- Heading: "What are you trying to accomplish?"
- Text input: goalText, max 300 chars, optional
- 8 chip buttons: Build something / Automate something / Generate content /
  Learn something / Organize something / Sell something /
  Analyze something / Not sure yet
- Chip click sets selectedGoalType, pre-fills goalText
- Free text overrides goalText, keeps chip selection
- Continue always enabled. Default: selectedGoalType = 'not-sure'

### GuidanceModeStep.tsx
- Heading: "How much guidance do you want?"
- 4 clickable option cards (not select/radio):
    "Guide me step by step"                → step-by-step
    "Suggest and let me choose"            → suggest
    "Move fast and make smart assumptions" → fast
    "Give me full control"                 → full-control
- 'fast' shows inline note: "I'll make smart assumptions..."
- Continue always enabled. Default: guidanceMode = 'suggest'

### DynamicContextStep.tsx
- Render 2–3 fields based on selectedGoalType
- All fields optional, continue always enabled
- guidanceMode 'fast': show smart ghost text in each field
- Implement all 8 goal types with these fields:
    build:     product_type | target_audience | desired_output
    automate:  trigger_event | target_action | connected_tools
    content:   content_type | target_audience | tone | platform
    learn:     topic | current_level | preferred_format
    organize:  what_to_organize | current_system | output_format
    sell:      product_or_service | target_audience | sales_channel
    analyze:   data_source | decision_to_make | output_format
    not-sure:  describe_problem | constraint | timeline

### AISummaryStep.tsx
- On mount: POST to /api/onboarding/infer. Show skeleton while loading.
- Display editable summary using EditableField for goalText,
  primaryTask, recommendedPath
- Assumptions list with X dismiss per item
- Confidence badge (text: High / Medium / Low)
- Buttons: Looks good / Refine / Start over / Let AI decide
- Auto-retry once on API failure, then show inline error + manual retry

### GeneratedOutputStep.tsx
- On mount: POST to /api/onboarding/generate. Show skeleton while loading.
- Display: title, summary, OutputCard per section, NextActionList
- "Copy as Markdown": navigator.clipboard.writeText(exportableMarkdown)
- "Export JSON": create Blob, trigger download as output.json
- "Apply to Workspace": calls onApply prop. Default: toast success.
- If fallback=true: show inline note "Using suggested template — AI unavailable."

---

## Shared Components

### ProgressIndicator.tsx
- Props: currentStep (1–5), totalSteps (5)
- Labels: Intent / Style / Context / Verify / Launch
- Top bar on mobile (< md), left vertical rail on desktop (md+)
- Completed: checkmark. Active: highlighted. Future: muted.
- Click completed step to navigate back (confirm if step 4–5)

### EditableField.tsx
- Props: label, value, onChange, multiline?: boolean
- Displays as styled text with pencil icon on hover
- Clicks into an input/textarea
- Saves on blur

### OutputCard.tsx
- Props: title, content: string | string[], collapsible?: boolean
- string: renders as paragraph
- string[]: renders as ul
- Copy icon in corner copies section content to clipboard
- Collapsible toggle if collapsible prop is true

### NextActionList.tsx
- Props: nextSteps: string[], suggestedActions: [{label, action}],
         onAction: (action: string) => void
- nextSteps: ordered ol list
- suggestedActions: pill buttons, onClick fires onAction(action)

### AISuggestionPanel.tsx
- Props: currentStep, inferredIntent
- Renders contextual hint text explaining what AI is inferring per step
- Collapsible. Dismissible per session (store in sessionStorage).
- Hidden when guidanceMode is 'full-control'

---

## UI Design

Colors (define as CSS variables in globals.css):
  --bg: #0A0A0F (dark) / #F8F8FC (light)
  --surface: #16161E / #FFFFFF
  --border: #2A2A38 / #E4E4EF
  --primary: #6B5CF6
  --primary-hover: #7C6EF7
  --muted: #7070A0
  --success: #22C55E
  --error: #EF4444
  --warning: #F59E0B

Typography:
- Load a distinctive display font via next/font/google
  NOT Inter. NOT Roboto. NOT system-ui.
  Use Syne, DM Sans, Plus Jakarta Sans, or similar with character.
- H1: 28px/700. H2: 22px/600. H3: 16px/600. Body: 14px/400.

Layout:
- Wizard card: max-width 720px, centered, padding 40px desktop / 24px mobile
- Progress rail: 200px fixed left at md+, top bar below md
- Wizard body: ml-[200px] at md+

States — all four required:
  Empty:   ghost text, chip grid visible
  Loading: CSS pulse skeleton blocks shaped like output
  Error:   inline error + retry, never full-page
  Success: output visible, export CTAs prominent

No framer-motion required for AI Studio output (keep it optional with
a comment showing where to add it if the developer adds the dependency).

---

## Setup Instructions (output after all files)

After all code blocks, output plain text instructions:

1. npx create-next-app@latest onboarding-wizard --typescript --tailwind --app
2. cd onboarding-wizard
3. Copy all generated files into the project, overwriting defaults
4. npm install uuid
5. Copy .env.local.example to .env.local and add your Google API key:
   GOOGLE_API_KEY=your_key_here
6. npm run dev
7. Visit http://localhost:3000/onboarding
8. To try demo flows: click "See an example" on Step 1

Notes:
- Get a Google API key at https://aistudio.google.com/app/apikey
- GOOGLE_API_KEY must never be added to client components
- All AI calls go through /api/onboarding/infer and /api/onboarding/generate
- Mock fallback activates automatically if API key is missing

---

## Hard Constraints

- GOOGLE_API_KEY accessed via process.env only — never in client code
- No HTML form elements — use onClick and onChange handlers
- All components fully typed — no implicit any
- No placeholder comments or stub functions — every function implemented
- Error boundaries at shell level and around each AI-dependent step
- uuid package for session ID generation (not crypto.randomUUID directly)
