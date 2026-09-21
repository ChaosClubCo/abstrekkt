# Build: AI-Assisted Onboarding Wizard (Next.js + Anthropic)

Build a production-grade, 5-step AI-assisted onboarding wizard as a
complete Next.js 14 App Router project. Use the Anthropic API for AI
inference and generation via server-side API routes only. Output every
file completely — no truncation, no stubs, no TODO placeholders.

Output the file tree first, then each file in full.

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
- Never block progress on empty optional fields
- Generate structured, immediately useful outputs from vague input
- Completable in under 60 seconds

---

## File Tree

Output this tree first, then generate every file listed:

```
/app
  /onboarding
    page.tsx
  /api/onboarding
    /infer
      route.ts
    /generate
      route.ts
/components/onboarding
  OnboardingShell.tsx
  ProgressIndicator.tsx
  GoalCaptureStep.tsx
  GuidanceModeStep.tsx
  DynamicContextStep.tsx
  AISummaryStep.tsx
  GeneratedOutputStep.tsx
  AISuggestionPanel.tsx
  EditableField.tsx
  OutputCard.tsx
  NextActionList.tsx
/lib/onboarding
  schemas.ts
  mock-data.ts
  infer-intent.ts
  generate-output.ts
  session-storage.ts
.env.local.example
```

---

## lib/onboarding/schemas.ts

Define and export:

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
  secondaryTasks: string[]       // empty array if none — never undefined
  complexity: Complexity
  confidence: number             // 0.0 to 1.0
  recommendedOutputType: OutputType
}

export interface GeneratedOutput {
  title: string
  summary: string
  type: OutputType
  sections: Array<{ title: string; content: string | string[] }>
  nextSteps: string[]
  suggestedActions: Array<{ label: string; action: string }>
  exportableMarkdown: string     // full copy-ready Markdown document
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

## lib/onboarding/session-storage.ts

```ts
import { OnboardingSession } from './schemas'

const key = (id: string) => `onboarding:${id}`

function isValidSession(obj: unknown): obj is OnboardingSession {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'currentStep' in obj &&
    typeof (obj as OnboardingSession).currentStep === 'number'
  )
}

export function saveSession(session: OnboardingSession): void {
  try {
    sessionStorage.setItem(key(session.id), JSON.stringify(session))
  } catch {}
}

export function loadSession(id: string): OnboardingSession | null {
  try {
    const raw = sessionStorage.getItem(key(id))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return isValidSession(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function clearSession(id: string): void {
  try {
    sessionStorage.removeItem(key(id))
  } catch {}
}
```

---

## lib/onboarding/mock-data.ts

Export getMockInfer(goalType: GoalType) and getMockOutput(goalType: GoalType).
Implement all 8 GoalType values. Content must be specific and realistic.
No lorem ipsum. No placeholder text.

Also export these three named demo sessions with fully populated
generatedOutput — used for the "See an example" demo on Step 1:

DEMO_BUILD_AI_APP
  goalText: "Build an AI coding assistant for my dev team"
  selectedGoalType: build
  dynamicAnswers:
    product_type: "Internal developer tool"
    target_audience: "Software engineers at a 20-person startup"
    desired_output: "VS Code extension with chat interface"
  generatedOutput:
    type: app-scaffold
    title: "AI Coding Assistant — VS Code Extension"
    3 sections minimum:
      "Recommended Stack" — list: TypeScript, VS Code Extension API,
        Anthropic claude-sonnet-4-20250514, Webpack bundler
      "File Structure" — string with tree of: src/extension.ts,
        src/chat/panel.ts, src/api/anthropic.ts, package.json
      "First Implementation Steps" — list of 3 concrete steps
    3 nextSteps minimum, 2 suggestedActions minimum
    exportableMarkdown: complete Markdown doc of the above

DEMO_AUTOMATE_WORKFLOW
  goalText: "Automate my lead follow-up from CRM to email"
  selectedGoalType: automate
  dynamicAnswers:
    trigger_event: "New lead created in HubSpot"
    target_action: "Send personalized follow-up email via Gmail"
    connected_tools: "HubSpot, Gmail, Slack"
  generatedOutput:
    type: automation-blueprint
    title: "Lead Follow-Up Automation Blueprint"
    3 sections minimum:
      "Trigger Definition" — HubSpot webhook on contact creation
      "Action Sequence" — numbered 5-step sequence
      "Error Handling" — what happens on Gmail auth failure, rate limits
    3 nextSteps, 2 suggestedActions, exportableMarkdown

DEMO_GENERATE_CONTENT
  goalText: "Generate a 30-day LinkedIn content plan for my SaaS"
  selectedGoalType: content
  dynamicAnswers:
    content_type: "Thought leadership and product updates"
    target_audience: "Startup founders and operations leads"
    tone: "Direct, no fluff, occasionally contrarian"
    platform: "LinkedIn"
  generatedOutput:
    type: content-plan
    title: "30-Day LinkedIn Content Plan"
    3 sections minimum:
      "Weekly Theme Calendar" — 4 weeks with named themes
      "5 Sample Post Hooks" — list of 5 specific, non-generic hooks
      "Posting Schedule + Engagement Strategy" — timing and response approach
    3 nextSteps, 2 suggestedActions, exportableMarkdown

---

## lib/onboarding/infer-intent.ts

Export three functions:

1. buildInferPrompt(session: Pick<OnboardingSession, 'goalText' | 'selectedGoalType' | 'guidanceMode' | 'dynamicAnswers'>): string
   Returns the system prompt string for the inference API call.
   Must instruct the model to return ONLY valid JSON, no fences, no preamble.
   Must include the full expected JSON shape in the prompt.

2. parseInferResponse(text: string): { inferredIntent: InferredIntent; assumptions: string[]; recommendedPath: string }
   Strips markdown fences, parses JSON, validates required fields.
   Throws a typed ParseError with message on invalid shape.

3. getMockInfer(goalType: GoalType): { inferredIntent: InferredIntent; assumptions: string[]; recommendedPath: string }
   Returns mock data. All 8 GoalType values. confidence: 0.75 for all mocks.

---

## lib/onboarding/generate-output.ts

Export three functions:

1. buildGeneratePrompt(session: OnboardingSession): string
   Full session context in the prompt. Instructs model to return ONLY
   valid JSON matching GeneratedOutput. Minimum 3 sections, 3 nextSteps,
   2 suggestedActions. exportableMarkdown must be a complete document.

2. parseGenerateResponse(text: string): GeneratedOutput
   Strips fences, parses JSON, validates shape. Throws on invalid.

3. getMockOutput(goalType: GoalType): GeneratedOutput
   Complete mocks for all 8 GoalType values. Specific, non-generic content.

---

## app/api/onboarding/infer/route.ts

```ts
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildInferPrompt, parseInferResponse, getMockInfer } from '@/lib/onboarding/infer-intent'
import type { OnboardingSession } from '@/lib/onboarding/schemas'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Simple in-memory rate limiter: 10 req/min per userId
const rateLimitMap = new Map<string, { count: number; reset: number }>()

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)
  if (!entry || now > entry.reset) {
    rateLimitMap.set(userId, { count: 1, reset: now + 60_000 })
    return true
  }
  if (entry.count >= 10) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  const { session, userId } = await req.json() as {
    session: Pick<OnboardingSession, 'goalText' | 'selectedGoalType' | 'guidanceMode' | 'dynamicAnswers'>
    userId: string
  }

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!checkRateLimit(userId)) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ ...getMockInfer(session.selectedGoalType), fallback: true })
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: buildInferPrompt(session),
      messages: [{ role: 'user', content: 'Analyze this onboarding session and return the JSON.' }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const parsed = parseInferResponse(text)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ ...getMockInfer(session.selectedGoalType), fallback: true })
  }
}
```

---

## app/api/onboarding/generate/route.ts

Same pattern as infer route. Use buildGeneratePrompt and parseGenerateResponse.
Max tokens: 2048.
Fallback: getMockOutput(session.selectedGoalType).
Return { output: GeneratedOutput, fallback?: boolean }.

---

## app/onboarding/page.tsx

'use client' page. Initializes OnboardingSession with uuid v4 for id.
Renders OnboardingShell. Passes onApply handler that shows a toast:
"Your workspace has been configured."

---

## Components

### OnboardingShell.tsx
Props:
  currentStep: number
  totalSteps: 5
  onApply: (session: OnboardingSession, output: GeneratedOutput) => void
  appName?: string

Manage session with useState. Save to sessionStorage on every update.
Attempt loadSession on mount. Render ProgressIndicator + current step
inside AnimatePresence. AISuggestionPanel in right drawer at lg+,
hidden below lg. Max-width 720px centered card.

---

### ProgressIndicator.tsx
Props: currentStep: 1–5, onStepClick: (step: number) => void

Top bar on mobile (< md), left vertical rail on desktop (md+).
Labels: Intent / Style / Context / Verify / Launch
Completed: checkmark (lucide CheckCircle2), active: highlighted with
primary color, future: muted. Clicking completed step shows confirm
dialog (use window.confirm) if currentStep >= 4.

---

### GoalCaptureStep.tsx
Props: session, onUpdate, onNext

Heading: "What are you trying to accomplish?"
Text input (max 300 chars, optional). 8 chip buttons.
Chips: Build something / Automate something / Generate content /
  Learn something / Organize something / Sell something /
  Analyze something / Not sure yet
Chip click: sets selectedGoalType, pre-fills goalText.
Free text overrides goalText, keeps chip active.
"See an example" link loads DEMO_BUILD_AI_APP session.
Continue always enabled. Default selectedGoalType: 'not-sure'.

---

### GuidanceModeStep.tsx
Props: session, onUpdate, onNext

Heading: "How much guidance do you want?"
4 clickable card divs (not select/radio):
  "Guide me step by step"                → step-by-step
  "Suggest and let me choose"            → suggest
  "Move fast and make smart assumptions" → fast
  "Give me full control"                 → full-control
Selected: ring-2 ring-violet-500. 'fast': shows note.
Continue always enabled. Default: 'suggest'.

---

### DynamicContextStep.tsx
Props: session, onUpdate, onNext

Render 2–3 fields based on selectedGoalType. All optional.
Implement all 8 goal types:
  build:     product_type | target_audience | desired_output
  automate:  trigger_event | target_action | connected_tools
  content:   content_type | target_audience | tone | platform
  learn:     topic | current_level | preferred_format
  organize:  what_to_organize | current_system | output_format
  sell:      product_or_service | target_audience | sales_channel
  analyze:   data_source | decision_to_make | output_format
  not-sure:  describe_problem | constraint | timeline

guidanceMode 'fast': show smart ghost text in placeholder.
Save to dynamicAnswers on every onChange.
Continue always enabled.

---

### AISummaryStep.tsx
Props: session, onUpdate, onNext, onRefine, onReset

On mount: POST to /api/onboarding/infer. Show skeleton while loading.
Auto-retry once on failure. Show inline error with manual retry on
second failure — never full-screen error.

Display:
- EditableField for goalText
- Derived user type label
- EditableField for primaryTask
- secondaryTasks as ul (if any)
- Confidence badge: >0.8 green / 0.5–0.8 yellow / <0.5 muted
- Assumptions list — each has X button to remove from array
- EditableField for recommendedPath

Buttons:
  "Looks good" (primary) → save, onNext
  "Refine" (outline)     → onRefine (back to Step 3, data intact)
  "Start over" (ghost)   → onReset
  "Let AI decide" (ghost) → onNext immediately

---

### GeneratedOutputStep.tsx
Props: session, onAction, onApply

On mount: POST to /api/onboarding/generate. Show output-shaped skeleton.
Auto-retry once. Inline error with retry on failure.

If response has fallback: true, show inline note:
"Using suggested template — AI unavailable."

Display:
- Large title + summary
- OutputCard for each section
- NextActionList for nextSteps and suggestedActions
- "Copy as Markdown" → navigator.clipboard.writeText
- "Export JSON" → Blob download
- "Apply to Workspace" → onApply(session, output) or toast

---

### AISuggestionPanel.tsx
Props: currentStep, inferredIntent

Step-specific hint text:
  1: "Tell me what you're trying to accomplish — a goal type or free text both work."
  2: "Your guidance preference determines how many questions I ask."
  3: "These details help me personalize your output. Skip anything you don't know yet."
  4: "Review my interpretation. Edit any field that seems off — I'll adjust."
  5: "Your personalized artifact is ready. Copy, export, or apply it to your workspace."

Hidden when guidanceMode is 'full-control'.
Dismissible (useState). Collapsible with toggle button.

---

### EditableField.tsx
Props: label: string, value: string, onChange: (v: string) => void, multiline?: boolean

Styled text display + pencil icon (lucide Pencil) on hover.
Click toggles to input/textarea. Saves on blur.
Cursor: text when editing, default otherwise.

---

### OutputCard.tsx
Props: title: string, content: string | string[], collapsible?: boolean

string: paragraph. string[]: ul.
Copy icon (lucide Copy) top-right → copies section to clipboard.
Collapsible via disclosure if prop is true.

---

### NextActionList.tsx
Props: nextSteps: string[], suggestedActions: {label:string, action:string}[], onAction: (action:string)=>void

nextSteps: ol numbered list.
suggestedActions: pill buttons, onClick fires onAction(action).

---

## UI Design

globals.css — add CSS variables:
```css
:root {
  --bg: #F8F8FC;
  --surface: #FFFFFF;
  --border: #E4E4EF;
  --primary: #6B5CF6;
  --primary-hover: #7C6EF7;
  --muted: #7070A0;
  --success: #22C55E;
  --error: #EF4444;
  --warning: #F59E0B;
}
.dark {
  --bg: #0A0A0F;
  --surface: #16161E;
  --border: #2A2A38;
}
```

Font: Use next/font/google. NOT Inter. NOT Roboto.
Choose one: Syne | Plus Jakarta Sans | DM Sans | Cabinet Grotesk
Apply to headings. Body: Tailwind default.

Step transitions (Framer Motion):
```ts
const variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}
const transition = { duration: 0.22, ease: 'easeOut' }
```
Wrap in AnimatePresence with mode="wait".
Check window.matchMedia('(prefers-reduced-motion: reduce)') and
skip animations if true.

Layout:
- Wizard card: max-w-[720px] mx-auto p-10 md:p-6
- Left rail: hidden md:block fixed left-0 w-[200px]
- Content: md:ml-[200px]
- Right AI panel: hidden lg:block fixed right-0 w-[280px] collapsible

States:
- Empty: placeholder + chip grid
- Loading: pulsing skeleton blocks shaped like output
- Error: inline alert + retry button
- Success: output + export CTAs

---

## .env.local.example

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

---

## Hard Constraints

1. ANTHROPIC_API_KEY accessed via process.env only.
   Never referenced in any component or client file.

2. No HTML form elements anywhere.
   Use onClick and onChange handlers only.

3. All components and functions fully typed.
   No implicit any.

4. No placeholder text, TODO comments, or stub functions.
   Every exported function must be fully implemented.

5. Error boundaries at OnboardingShell level and around
   AISummaryStep and GeneratedOutputStep.

6. Use the uuid package for session ID generation.
   Import: import { v4 as uuidv4 } from 'uuid'

7. Install list:
   npm install @anthropic-ai/sdk uuid framer-motion lucide-react
