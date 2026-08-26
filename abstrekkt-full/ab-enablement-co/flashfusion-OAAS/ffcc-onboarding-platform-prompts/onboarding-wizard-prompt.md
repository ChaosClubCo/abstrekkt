# Build: AI-Assisted Onboarding Wizard

Build a production-grade, 5-step AI-assisted onboarding wizard. It must be universal — no hardcoded industry, product type, or use case. It adapts to any SaaS, AI tool, app builder, marketplace, dashboard, or workflow product. The wizard infers user intent, asks the minimum necessary questions, and produces a personalized artifact as its final output.

---

## Core Goal

Help each user accomplish the main task of the app as quickly as possible. Infer missing information. Ask fewer questions, not more. Never block progress on empty optional fields. Generate structured, immediately useful outputs from incomplete input.

---

## Tech Stack

- Next.js 14 App Router (TypeScript)
- Tailwind CSS
- Framer Motion for step transitions
- Anthropic claude-sonnet-4-20250514 for inference and generation (server-side only)
- sessionStorage for client-side persistence (no DB required)

---

## File Tree

```
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
```

---

## Data Model

### schemas.ts — define and export all of these types

```ts
type GoalType =
  | 'build' | 'automate' | 'content' | 'learn'
  | 'organize' | 'sell' | 'analyze' | 'not-sure'

type GuidanceMode =
  | 'step-by-step' | 'suggest' | 'fast' | 'full-control'

type Complexity = 'low' | 'medium' | 'high'

type OutputType =
  | 'project-plan' | 'app-scaffold' | 'automation-blueprint'
  | 'content-plan' | 'learning-roadmap' | 'agent-config'
  | 'checklist' | 'first-draft' | 'dashboard-setup' | 'workspace-template'

interface InferredIntent {
  category: GoalType
  primaryTask: string
  secondaryTasks: string[]       // empty array if none — never undefined
  complexity: Complexity
  confidence: number             // 0.0 to 1.0
  recommendedOutputType: OutputType
}

interface GeneratedOutput {
  title: string
  summary: string
  type: OutputType
  sections: Array<{
    title: string
    content: string | string[]
  }>
  nextSteps: string[]
  suggestedActions: Array<{
    label: string
    action: string               // kebab-case identifier
  }>
  exportableMarkdown: string     // full copy-ready Markdown string
  exportableJson: object
}

interface OnboardingSession {
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
  createdAt: string              // ISO string
  updatedAt: string
}
```

---

## Step Definitions

### Step 1 — Goal Capture

Prompt: "What are you trying to accomplish?"

Render a free-text input (max 300 chars) and 8 quick-select chips below it. Selecting a chip sets `selectedGoalType` and pre-fills `goalText` with the chip label. Free text overrides the chip label but keeps the chip selection. Both can coexist.

Chips: Build something / Automate something / Generate content / Learn something / Organize something / Sell something / Analyze something / Not sure yet

If `guidanceMode === 'fast'`: auto-advance 400ms after chip tap.

Default if user skips without selecting: `selectedGoalType = 'not-sure'`.

---

### Step 2 — Guidance Mode

Prompt: "How much guidance do you want?"

Render 4 option cards (not a dropdown):
- Guide me step by step → `step-by-step`
- Suggest and let me choose → `suggest`
- Move fast and make smart assumptions → `fast`
- Give me full control → `full-control`

When `fast` is selected, show an inline note: "I'll make smart assumptions and skip optional fields."

Default if user skips: `guidanceMode = 'suggest'`.

---

### Step 3 — Dynamic Context

Render 2–3 fields based on `selectedGoalType`. All fields are optional. Never block progress if empty.

If `guidanceMode === 'fast'`, pre-fill each field with a smart placeholder suggestion displayed as ghost text.

Field configs for each goal type:

```
build:     product_type | target_audience | desired_output
automate:  trigger_event | target_action | connected_tools
content:   content_type | target_audience | tone | platform
learn:     topic | current_level | preferred_format
organize:  what_to_organize | current_system | output_format
sell:      product_or_service | target_audience | sales_channel
analyze:   data_source | decision_to_make | output_format
not-sure:  describe_problem | constraint | timeline
```

All 8 goal types must be implemented. Do not leave any as a stub or TODO.

---

### Step 4 — AI Summary + Confirmation

Call `POST /api/onboarding/infer` with the current session. While waiting, show an inline skeleton (not a spinner).

Display the response as an editable summary:
- Interpreted goal (EditableField)
- User type (inferred from guidanceMode + goalText)
- Primary task
- Secondary tasks (if any)
- Confidence badge (subtle, text-only — not a progress bar)
- Assumptions list — each assumption has an X dismiss button that removes it from the list
- Recommended starting path

Four action buttons:
- "Looks good" → advance to Step 5
- "Refine" → return to Step 3 with fields pre-populated from current answers
- "Start over" → reset session state, return to Step 1
- "Let AI decide" → skip to Step 5, AI fills all remaining assumptions

---

### Step 5 — Personalized Output

Call `POST /api/onboarding/generate` with the confirmed session. Show a loading skeleton shaped like the expected output layout while waiting.

Display `GeneratedOutput`:
- Each section rendered as an OutputCard (collapsible, copy icon per section)
- Next steps in NextActionList (ordered list)
- Suggested actions as pill buttons (fire `onAction(action)` callback)
- "Copy as Markdown" button — copies `exportableMarkdown` to clipboard
- "Export JSON" button — downloads `exportableJson` as a file
- "Apply to Workspace" button — fires `onApply(session, output)` prop passed from OnboardingShell. Default behavior: show a success toast. This is the host app's integration point.

---

## API Routes

### POST /api/onboarding/infer

Request body:
```ts
{
  session: Pick<OnboardingSession,
    'goalText' | 'selectedGoalType' | 'guidanceMode' | 'dynamicAnswers'>
}
```

Response:
```ts
{
  inferredIntent: InferredIntent
  assumptions: string[]
  recommendedPath: string
}
```

Call `claude-sonnet-4-20250514` with a structured system prompt. Parse the response as JSON. If `ANTHROPIC_API_KEY` is not set, fall back to `inferIntentMock(session)` — never throw, never return empty.

Require auth: verify `userId` from session cookie before processing. Rate limit: 10 requests/min per userId.

---

### POST /api/onboarding/generate

Request body:
```ts
{
  session: OnboardingSession
}
```

Response:
```ts
{
  output: GeneratedOutput
}
```

Call `claude-sonnet-4-20250514` with a generation prompt that includes `inferredIntent`, `assumptions`, `dynamicAnswers`, and `goalText`. Output must be valid JSON matching `GeneratedOutput`. Strip markdown fences before parsing. Fall back to `generateOutputMock(session)` if API is unavailable.

Require auth. Rate limit: 10 requests/min per userId.

---

## Lib Functions

### infer-intent.ts — export all three

1. `inferIntentMock(session: OnboardingSession): InferredIntent`
   - Complete mock for all 8 GoalType values
   - Realistic primaryTask strings, non-empty secondaryTasks for complex goals
   - confidence: 0.75 for all mocks

2. `buildInferPrompt(session): string`
   - System prompt for the Anthropic call
   - Instructs the model to return only valid JSON matching InferredIntent
   - No preamble, no markdown fences in the response

3. `parseInferResponse(text: string): InferredIntent`
   - Strip fences, parse JSON, validate required fields
   - Throw a typed error on invalid shape

---

### generate-output.ts — export all five

1. `generateOutputMock(session: OnboardingSession): GeneratedOutput`
   - Complete mock for all 8 GoalType values
   - Each mock: minimum 3 sections, 3 nextSteps, 2 suggestedActions, full exportableMarkdown

2. `buildGeneratePrompt(session): string`

3. `parseGenerateResponse(text: string): GeneratedOutput`

4. Named demo exports (used as seed data for the demo mode):

```ts
export const DEMO_BUILD_AI_APP: GeneratedOutput
// Goal: build an AI coding assistant
// OutputType: app-scaffold
// Must include: tech stack recommendation, file tree, first 3 implementation steps, 3 next actions

export const DEMO_AUTOMATE_WORKFLOW: GeneratedOutput
// Goal: automate lead follow-up from CRM to email
// OutputType: automation-blueprint
// Must include: trigger definition, action sequence, tool requirements, error handling note

export const DEMO_GENERATE_CONTENT: GeneratedOutput
// Goal: generate a 30-day LinkedIn content plan
// OutputType: content-plan
// Must include: theme calendar, 5 sample post hooks, tone guide, posting schedule
```

Each demo must be specific and non-generic. No "Lorem ipsum" or placeholder text in any demo output.

---

### session-storage.ts

```ts
export function saveSession(session: OnboardingSession): void
export function loadSession(id: string): OnboardingSession | null
export function clearSession(id: string): void
```

Key format: `onboarding:${id}`. Serialize as JSON. On `loadSession`, validate the shape with a guard function and return null if invalid. Handles page refresh without requiring a DB.

---

## Component Specs

### OnboardingShell
Props: `currentStep`, `totalSteps: 5`, `onApply`, optional `appName`
Layout: ProgressIndicator on left rail at md+, top bar below md. AISuggestionPanel in collapsible right drawer at lg+, bottom sheet below lg. Wizard card centered, max-width 720px.

### ProgressIndicator
Labels: Intent / Style / Context / Verify / Launch
Completed steps show a checkmark. Active step is highlighted. Clicking a completed step navigates back. Show a confirmation dialog if navigating back from Step 4 or 5.

### AISuggestionPanel
Receives `currentStep` and `inferredIntent`. Renders contextual hints explaining what the AI is inferring and why. Auto-hides when `guidanceMode === 'full-control'`. Dismissible per session (stored in sessionStorage).

### EditableField
Props: `label`, `value`, `onChange`, `multiline?: boolean`
Displays as styled text. Pencil icon appears on hover. Clicks into an input. Used in the Step 4 summary.

### OutputCard
Props: `title`, `content: string | string[]`, `collapsible?: boolean`
Renders content as a paragraph if string, as a `ul` if array. Copy-to-clipboard icon in the top-right corner.

### NextActionList
Props: `nextSteps: string[]`, `suggestedActions: Array<{label, action}>`, `onAction: (action: string) => void`
nextSteps as an ordered `ol`. suggestedActions as pill buttons that fire `onAction`.

---

## Design System

Colors:
- Background dark: #0A0A0F / light: #F8F8FC
- Surface dark: #16161E / light: #FFFFFF
- Border dark: #2A2A38 / light: #E4E4EF
- Primary: #6B5CF6 (violet), hover: #7C6EF7
- Muted text: #7070A0
- Success: #22C55E / Error: #EF4444 / Warning: #F59E0B

Typography:
- Use a distinctive display font for headings — not Inter, not Space Grotesk. Pick something with character: Syne, Cabinet Grotesk, Neue Haas Grotesk, Satoshi, or similar.
- Body: 14px/400. H1: 28px/700. H2: 22px/600. H3: 16px/600. Caption: 12px/400.

Motion:
- Step transitions: Framer Motion AnimatePresence, opacity 0→1, y +12→0, 220ms ease-out
- Card hover: scale(1.01), 150ms
- Loading skeleton: CSS pulse only — no JS animation
- Respect `prefers-reduced-motion`: disable all motion if set

Layout:
- Wizard card: max-width 720px, centered, 40px padding desktop / 24px mobile
- Progress rail: 200px, fixed left, visible at md+
- AI panel: 280px, right, collapsible at lg+
- On mobile: top progress bar, full-width cards, bottom sheet for AI panel

States required — implement all four:
- Empty: ghost text + chip grid visible, no content
- Loading: skeleton blocks shaped like expected output
- Error: inline error message + retry button, never full-page
- Success: output visible, export CTAs prominent

---

## Validation Rules

- goalText: optional, max 300 chars
- selectedGoalType: defaults to 'not-sure' if user skips Step 1
- guidanceMode: defaults to 'suggest' if user skips Step 2
- dynamicAnswers: all fields optional — never block on empty
- API errors: auto-retry once, then show inline error with manual retry button
- If guidanceMode === 'fast': skip all validation, advance with defaults

---

## Constraints

- ANTHROPIC_API_KEY must be server-side only. Never exposed to client. Use process.env in API routes only.
- No <form> elements anywhere. Use onClick and onChange handlers throughout.
- All component props must have explicit TypeScript interfaces. No implicit any.
- Error boundaries at OnboardingShell level and around each API-dependent step.
- Use the `uuid` package for session ID generation — do not rely on crypto.randomUUID() for Node < 19 compatibility.
- No placeholder text, TODO comments, or stub functions in the final output. Every function listed must be fully implemented.
