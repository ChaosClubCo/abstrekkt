# Build: AI-Assisted Onboarding Wizard (Lovable)

Build a production-grade, 5-step AI-assisted onboarding wizard as a
React + Vite application. Use Tailwind CSS, Framer Motion, and
Supabase Edge Functions for all AI calls. Do not call any LLM API
directly from React components or hooks — all AI calls must go through
Supabase Edge Functions.

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

## Tech Stack

- React + Vite (TypeScript)
- Tailwind CSS
- Framer Motion for step transitions
- Zustand for session state (or useState if Zustand unavailable)
- sessionStorage for persistence across page refreshes
- Supabase Edge Functions for all LLM API calls
- LLM API key stored as a Supabase secret — never in React code

---

## Component Tree

```
src/
  pages/
    Onboarding.tsx               main page, renders OnboardingShell
  components/onboarding/
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
  lib/onboarding/
    types.ts                     all TypeScript types
    mockData.ts                  mock responses for all 8 goal types
    sessionStorage.ts            save/load/clear helpers
  supabase/functions/
    onboarding-infer/index.ts    Edge Function: inference call
    onboarding-generate/index.ts Edge Function: generation call
```

---

## TypeScript Types (src/lib/onboarding/types.ts)

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

## Session Persistence (src/lib/onboarding/sessionStorage.ts)

```ts
const KEY = (id: string) => `onboarding:${id}`

export function saveSession(session: OnboardingSession): void {
  try {
    sessionStorage.setItem(KEY(session.id), JSON.stringify(session))
  } catch {}
}

export function loadSession(id: string): OnboardingSession | null {
  try {
    const raw = sessionStorage.getItem(KEY(id))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.id || !parsed?.currentStep) return null
    return parsed as OnboardingSession
  } catch {
    return null
  }
}

export function clearSession(id: string): void {
  try {
    sessionStorage.removeItem(KEY(id))
  } catch {}
}
```

---

## State Management (OnboardingShell.tsx)

Use useState (or Zustand store) for the session object. Initialize with:
```ts
const initSession = (): OnboardingSession => ({
  id: crypto.randomUUID(),
  userId: 'anonymous',     // replace with auth context if available
  currentStep: 1,
  goalText: '',
  selectedGoalType: 'not-sure',
  guidanceMode: 'suggest',
  dynamicAnswers: {},
  inferredIntent: null,
  assumptions: [],
  recommendedPath: '',
  generatedOutput: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})
```

On every session update, call saveSession(session).
On mount, attempt loadSession — restore if valid.

---

## Step Components

### GoalCaptureStep.tsx

Props: `session: OnboardingSession, onUpdate: (updates) => void, onNext: () => void`

Render:
- Heading: "What are you trying to accomplish?"
- Text input bound to goalText (max 300 chars, optional)
- 8 chip buttons in a flex-wrap grid:
    Build something | Automate something | Generate content |
    Learn something | Organize something | Sell something |
    Analyze something | Not sure yet
- Chip click: sets selectedGoalType, pre-fills goalText
- Free text overrides goalText, keeps chip selection
- Continue button always enabled (default selectedGoalType: 'not-sure')
- Auto-advance after chip if guidanceMode is 'fast' (400ms delay)

---

### GuidanceModeStep.tsx

Props: `session, onUpdate, onNext`

Render:
- Heading: "How much guidance do you want?"
- 4 clickable cards (not a select or radio):
    "Guide me step by step"                → step-by-step
    "Suggest and let me choose"            → suggest
    "Move fast and make smart assumptions" → fast
    "Give me full control"                 → full-control
- Selected card shows a highlighted border
- 'fast' selection shows inline note: "I'll make smart assumptions..."
- Continue button always enabled (default: 'suggest')

---

### DynamicContextStep.tsx

Props: `session, onUpdate, onNext`

Render 2–3 fields based on session.selectedGoalType.
All fields optional. Continue always enabled.
If guidanceMode is 'fast', show smart ghost text in each field.

Field config — implement all 8, no stubs:

```ts
const FIELD_CONFIG: Record<GoalType, Array<{id: string, label: string, placeholder: string}>> = {
  build: [
    { id: 'product_type', label: 'What kind of product?', placeholder: 'e.g. Web app, API, Chrome extension' },
    { id: 'target_audience', label: 'Who is it for?', placeholder: 'e.g. Internal team, SaaS customers' },
    { id: 'desired_output', label: 'Desired output format?', placeholder: 'e.g. MVP, prototype, full product' },
  ],
  automate: [
    { id: 'trigger_event', label: 'What starts the workflow?', placeholder: 'e.g. New form submission, daily at 9am' },
    { id: 'target_action', label: 'What should happen?', placeholder: 'e.g. Send Slack message, update spreadsheet' },
    { id: 'connected_tools', label: 'Tools involved?', placeholder: 'e.g. Zapier, Notion, HubSpot' },
  ],
  content: [
    { id: 'content_type', label: 'What kind of content?', placeholder: 'e.g. LinkedIn posts, email newsletter' },
    { id: 'target_audience', label: 'Who reads it?', placeholder: 'e.g. Startup founders, HR managers' },
    { id: 'tone', label: 'What tone?', placeholder: 'e.g. Direct, friendly, technical, conversational' },
    { id: 'platform', label: 'Where does it live?', placeholder: 'e.g. LinkedIn, Substack, company blog' },
  ],
  learn: [
    { id: 'topic', label: 'What do you want to learn?', placeholder: 'e.g. Python, prompt engineering, design' },
    { id: 'current_level', label: 'Current level?', placeholder: 'e.g. Complete beginner, some experience' },
    { id: 'preferred_format', label: 'How do you learn best?', placeholder: 'e.g. Projects, videos, reading' },
  ],
  organize: [
    { id: 'what_to_organize', label: 'What needs organizing?', placeholder: 'e.g. My Notion workspace, project files' },
    { id: 'current_system', label: 'Current setup?', placeholder: 'e.g. Spreadsheets, sticky notes, nothing' },
    { id: 'output_format', label: 'Desired result?', placeholder: 'e.g. Dashboard, folder structure, template' },
  ],
  sell: [
    { id: 'product_or_service', label: 'What are you selling?', placeholder: 'e.g. SaaS tool, consulting, physical product' },
    { id: 'target_audience', label: 'Who buys it?', placeholder: 'e.g. SMB owners, enterprise IT leads' },
    { id: 'sales_channel', label: 'How do you sell?', placeholder: 'e.g. Outbound, inbound, marketplace' },
  ],
  analyze: [
    { id: 'data_source', label: 'What data?', placeholder: 'e.g. Google Analytics, CSV export, CRM data' },
    { id: 'decision_to_make', label: 'What decision does this drive?', placeholder: 'e.g. Pricing, hiring, product roadmap' },
    { id: 'output_format', label: 'Output format?', placeholder: 'e.g. Dashboard, summary report, slide deck' },
  ],
  'not-sure': [
    { id: 'describe_problem', label: 'Describe what you\'re trying to solve', placeholder: 'Anything — even vague is fine' },
    { id: 'constraint', label: 'Any constraints?', placeholder: 'e.g. Budget, timeline, specific tools' },
    { id: 'timeline', label: 'When do you need this?', placeholder: 'e.g. This week, next quarter, no rush' },
  ],
}
```

---

### AISummaryStep.tsx

Props: `session, onUpdate, onNext, onRefine, onReset`

On mount, call the Supabase Edge Function `onboarding-infer`.
Show skeleton while loading.

Display editable summary:
- EditableField for goalText
- Text display for inferred user type
- EditableField for primaryTask
- Text list for secondaryTasks
- Confidence badge: "High" (>0.8) / "Medium" (0.5–0.8) / "Low" (<0.5)
- Assumptions list — each has X button calling onUpdate to remove it
- EditableField for recommendedPath

Buttons:
  "Looks good"    → save, call onNext
  "Refine"        → call onRefine (back to Step 3 with data intact)
  "Start over"    → call onReset
  "Let AI decide" → call onNext immediately, skip manual edits

---

### GeneratedOutputStep.tsx

Props: `session, onAction: (action: string) => void`

On mount, call the Supabase Edge Function `onboarding-generate`.
Show output-shaped skeleton while loading.

Display:
- Title (large) and summary
- OutputCard for each section (collapsible, copy button per section)
- NextActionList for nextSteps and suggestedActions
- "Copy as Markdown" — copies exportableMarkdown to clipboard
- "Export JSON" — triggers download of exportableJson
- "Apply to Workspace" — calls onAction('apply-to-workspace')
  Default: show toast "Workspace configured successfully"

---

## Supabase Edge Functions

### supabase/functions/onboarding-infer/index.ts

```ts
import { serve } from 'https://deno.land/std/http/server.ts'

serve(async (req) => {
  const { session } = await req.json()
  const apiKey = Deno.env.get('LLM_API_KEY')

  const systemPrompt = `You are an onboarding assistant. Analyze the user's
input and return ONLY a valid JSON object. No preamble. No markdown. No explanation.

Return this exact shape:
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

Infer missing fields from context. secondaryTasks must be an array.`

  const userMessage = `Goal: ${session.goalText}
Type: ${session.selectedGoalType}
Mode: ${session.guidanceMode}
Context: ${JSON.stringify(session.dynamicAnswers)}`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    const data = await res.json()
    const text = data.content?.[0]?.text ?? ''
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    return new Response(JSON.stringify({ ok: true, data: parsed }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    // Return mock on failure
    return new Response(JSON.stringify({ ok: false, fallback: true, data: getMock(session.selectedGoalType) }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

Replace `getMock` with the mock inference data from mockData.ts.
Add the same pattern for `onboarding-generate`, calling the generation
prompt and parsing GeneratedOutput.

---

### Generation Prompt (for onboarding-generate)

System:
```
You are a personalized setup generator. Based on the confirmed onboarding
session below, generate a specific, non-generic output artifact.
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

Requirements: minimum 3 sections, 3 nextSteps, 2 suggestedActions.
exportableMarkdown must be a complete copy-ready Markdown document.
Content must be specific to the user's goal.
```

---

## Mock Data (src/lib/onboarding/mockData.ts)

Implement getMockInfer(goalType) and getMockOutput(goalType) covering all 8
GoalType values. Each mock must have realistic, specific content.
No placeholder text. No lorem ipsum.

Example for 'automate':
```ts
inferredIntent: {
  category: 'automate',
  primaryTask: 'Eliminate manual steps in your workflow',
  secondaryTasks: ['Map current process', 'Identify trigger points'],
  complexity: 'medium',
  confidence: 0.75,
  recommendedOutputType: 'automation-blueprint',
}
assumptions: [
  'Trigger is event-based rather than scheduled',
  'Tools involved support API or webhook access',
  'You want email or Slack notification on completion',
]
recommendedPath: 'Define trigger → map actions → test with sample data → deploy'
```

---

## Demo Flows

Add a "See an example" button on Step 1 that loads one of these pre-filled
sessions so users can see a complete flow without entering data.

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
- Top progress bar showing 5 steps: Intent / Style / Context / Verify / Launch
- Completed steps show checkmark, active step highlighted
- Clicking completed step navigates back (confirm if on Step 4–5)
- Collapsible AI suggestion panel (right side desktop, hidden mobile)
  Auto-hides when guidanceMode is 'full-control'

States — implement all four:
  Empty:   ghost text, chip grid visible
  Loading: CSS pulse skeleton shaped like output
  Error:   inline error + retry button — never full-page
  Success: output visible, export buttons prominent

Motion (Framer Motion):
- Step transitions: opacity 0→1, y +12→0, 220ms ease-out
- AnimatePresence wrapping step renders
- Card hover: scale 1.01, 150ms
- Respect prefers-reduced-motion: disable all if set

Design:
- Dark primary, light mode supported via Tailwind dark: classes
- Primary accent: #6B5CF6
- Distinctive heading font — not Inter, not Roboto, not system-ui
  Use Syne, Cabinet Grotesk, Satoshi, or similar via Google Fonts
- Strong typographic hierarchy, generous spacing
- No generic startup-template aesthetics

---

## Security

The LLM API key must be stored as a Supabase secret named LLM_API_KEY.
It must only be accessed inside Supabase Edge Functions via Deno.env.get().
It must never appear in any React file, .env file committed to source
control, or any file that ships to the browser.
If no Supabase project is connected, show a mock UI with a banner:
  "Connect Supabase to enable AI features."
