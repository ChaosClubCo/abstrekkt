# Build: AI-Assisted Onboarding Wizard (v0 / React Components)

Generate a complete set of React components for a 5-step AI-assisted
onboarding wizard. Use shadcn/ui, Tailwind CSS, and Framer Motion.
Output every component fully implemented — no stubs, no TODOs.

All AI calls are mocked in this output. Each mock function includes
a comment showing exactly where to swap in a real server action.
Under no circumstances should any component call an LLM API directly.

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
- Completable in under 60 seconds

---

## Component List

Output these files in order, each as a labeled code block:

1. lib/onboarding/types.ts
2. lib/onboarding/mock-data.ts
3. components/onboarding/OnboardingShell.tsx
4. components/onboarding/ProgressIndicator.tsx
5. components/onboarding/GoalCaptureStep.tsx
6. components/onboarding/GuidanceModeStep.tsx
7. components/onboarding/DynamicContextStep.tsx
8. components/onboarding/AISummaryStep.tsx
9. components/onboarding/GeneratedOutputStep.tsx
10. components/onboarding/AISuggestionPanel.tsx
11. components/onboarding/EditableField.tsx
12. components/onboarding/OutputCard.tsx
13. components/onboarding/NextActionList.tsx
14. app/onboarding/page.tsx  (or pages/onboarding.tsx if Pages Router)

---

## Types (lib/onboarding/types.ts)

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
  currentStep: 1 | 2 | 3 | 4 | 5
  goalText: string
  selectedGoalType: GoalType
  guidanceMode: GuidanceMode
  dynamicAnswers: Record<string, string>
  inferredIntent: InferredIntent | null
  assumptions: string[]
  recommendedPath: string
  generatedOutput: GeneratedOutput | null
}
```

---

## Mock Data (lib/onboarding/mock-data.ts)

Implement getMockInfer(goalType: GoalType) and getMockOutput(goalType: GoalType).
Cover all 8 GoalType values. Content must be realistic and specific.
No lorem ipsum. No placeholder text.

Include this comment at the top of every mock function:
```ts
// REPLACE THIS: call your server action or API route instead.
// Example: const result = await fetch('/api/onboarding/infer', { ... })
// Never call the LLM API directly from this file or any component.
```

Also export three demo sessions:

DEMO_BUILD_AI_APP — goalType: build
  goalText: "Build an AI coding assistant for my dev team"
  dynamicAnswers.product_type: "Internal developer tool"
  dynamicAnswers.target_audience: "Software engineers at a 20-person startup"
  dynamicAnswers.desired_output: "VS Code extension with chat interface"
  generatedOutput.type: app-scaffold
  generatedOutput must have 3 sections, 3 nextSteps, 2 suggestedActions

DEMO_AUTOMATE_WORKFLOW — goalType: automate
  goalText: "Automate my lead follow-up from CRM to email"
  dynamicAnswers.trigger_event: "New lead created in HubSpot"
  dynamicAnswers.target_action: "Send personalized follow-up email via Gmail"
  dynamicAnswers.connected_tools: "HubSpot, Gmail, Slack"
  generatedOutput.type: automation-blueprint
  generatedOutput must have 3 sections, 3 nextSteps, 2 suggestedActions

DEMO_GENERATE_CONTENT — goalType: content
  goalText: "Generate a 30-day LinkedIn content plan for my SaaS"
  dynamicAnswers.content_type: "Thought leadership and product updates"
  dynamicAnswers.target_audience: "Startup founders and operations leads"
  dynamicAnswers.tone: "Direct, no fluff, occasionally contrarian"
  dynamicAnswers.platform: "LinkedIn"
  generatedOutput.type: content-plan
  generatedOutput must have 3 sections, 3 nextSteps, 2 suggestedActions

---

## OnboardingShell.tsx

Manage session state with useState. Initialize:
```ts
{
  id: Math.random().toString(36).slice(2),
  currentStep: 1,
  goalText: '',
  selectedGoalType: 'not-sure',
  guidanceMode: 'suggest',
  dynamicAnswers: {},
  inferredIntent: null,
  assumptions: [],
  recommendedPath: '',
  generatedOutput: null,
}
```

Props:
  onApply?: (session: OnboardingSession, output: GeneratedOutput) => void

Render:
- ProgressIndicator (top bar mobile, left rail desktop)
- AnimatePresence wrapping current step component
- AISuggestionPanel (collapsible right side desktop, hidden mobile)
- Max-width 720px centered card

Step routing:
  1 → GoalCaptureStep
  2 → GuidanceModeStep
  3 → DynamicContextStep
  4 → AISummaryStep
  5 → GeneratedOutputStep

"See an example" link on Step 1 loads DEMO_BUILD_AI_APP session.

---

## GoalCaptureStep.tsx

Props: session, onUpdate, onNext

shadcn/ui components: Input, Badge (for chips)

- Heading: "What are you trying to accomplish?"
- Input bound to goalText, max 300 chars
- 8 chip buttons using Badge or custom chip component:
    Build something | Automate something | Generate content |
    Learn something | Organize something | Sell something |
    Analyze something | Not sure yet
- Chip click: sets selectedGoalType, pre-fills goalText
- Free text overrides goalText, chip selection stays
- Continue button (always enabled). Default: selectedGoalType='not-sure'

---

## GuidanceModeStep.tsx

Props: session, onUpdate, onNext

- Heading: "How much guidance do you want?"
- 4 shadcn/ui Card components as clickable option cards:
    "Guide me step by step"                → step-by-step
    "Suggest and let me choose"            → suggest
    "Move fast and make smart assumptions" → fast
    "Give me full control"                 → full-control
- Selected card: highlighted border (ring-2 ring-primary)
- 'fast' shows inline Alert: "I'll make smart assumptions..."
- Continue always enabled. Default: guidanceMode='suggest'

---

## DynamicContextStep.tsx

Props: session, onUpdate, onNext

Use shadcn/ui Input components. All fields optional. Continue always enabled.
guidanceMode 'fast': show ghost text suggestions via placeholder.

Implement all 8 goal types — no stubs:
```ts
const FIELDS: Record<GoalType, {id: string; label: string; placeholder: string}[]> = {
  build: [
    { id: 'product_type', label: 'What kind of product?', placeholder: 'e.g. Web app, API, Chrome extension' },
    { id: 'target_audience', label: 'Who is it for?', placeholder: 'e.g. Internal team, SaaS customers' },
    { id: 'desired_output', label: 'Desired output?', placeholder: 'e.g. MVP, prototype, full product' },
  ],
  automate: [
    { id: 'trigger_event', label: 'What starts the workflow?', placeholder: 'e.g. New form submission' },
    { id: 'target_action', label: 'What should happen?', placeholder: 'e.g. Send Slack message' },
    { id: 'connected_tools', label: 'Tools involved?', placeholder: 'e.g. Zapier, Notion, HubSpot' },
  ],
  content: [
    { id: 'content_type', label: 'Content type?', placeholder: 'e.g. LinkedIn posts, email newsletter' },
    { id: 'target_audience', label: 'Who reads it?', placeholder: 'e.g. Startup founders' },
    { id: 'tone', label: 'Tone?', placeholder: 'e.g. Direct, friendly, technical' },
    { id: 'platform', label: 'Platform?', placeholder: 'e.g. LinkedIn, Substack' },
  ],
  learn: [
    { id: 'topic', label: 'What do you want to learn?', placeholder: 'e.g. Python, prompt engineering' },
    { id: 'current_level', label: 'Current level?', placeholder: 'e.g. Beginner, some experience' },
    { id: 'preferred_format', label: 'Learning style?', placeholder: 'e.g. Projects, reading, videos' },
  ],
  organize: [
    { id: 'what_to_organize', label: 'What needs organizing?', placeholder: 'e.g. My Notion workspace' },
    { id: 'current_system', label: 'Current setup?', placeholder: 'e.g. Spreadsheets, nothing' },
    { id: 'output_format', label: 'Desired result?', placeholder: 'e.g. Dashboard, template' },
  ],
  sell: [
    { id: 'product_or_service', label: 'What are you selling?', placeholder: 'e.g. SaaS tool, consulting' },
    { id: 'target_audience', label: 'Who buys it?', placeholder: 'e.g. SMB owners, enterprise IT' },
    { id: 'sales_channel', label: 'How do you sell?', placeholder: 'e.g. Outbound, inbound' },
  ],
  analyze: [
    { id: 'data_source', label: 'What data?', placeholder: 'e.g. Google Analytics, CRM export' },
    { id: 'decision_to_make', label: 'What decision?', placeholder: 'e.g. Pricing, roadmap' },
    { id: 'output_format', label: 'Output format?', placeholder: 'e.g. Dashboard, report' },
  ],
  'not-sure': [
    { id: 'describe_problem', label: 'Describe what you\'re trying to solve', placeholder: 'Anything — even vague is fine' },
    { id: 'constraint', label: 'Any constraints?', placeholder: 'e.g. Budget, timeline, tools' },
    { id: 'timeline', label: 'Timeline?', placeholder: 'e.g. This week, no rush' },
  ],
}
```

---

## AISummaryStep.tsx

Props: session, onUpdate, onNext, onRefine, onReset

On mount: call getMockInfer(session.selectedGoalType) with 800ms simulated
delay (setTimeout) to mimic async behavior.

Include comment:
```ts
// TODO: Replace getMockInfer with a fetch to /api/onboarding/infer
// const res = await fetch('/api/onboarding/infer', {
//   method: 'POST',
//   body: JSON.stringify({ session, userId: session.id })
// })
```

Show shadcn/ui Skeleton while loading.

Display:
- EditableField for goalText
- Text: inferred user type (derive from guidanceMode: 'step-by-step' → "Detail-oriented", 'fast' → "Move-fast builder", etc.)
- EditableField for primaryTask
- ul of secondaryTasks (if any)
- Confidence Badge: >0.8 = "High confidence" (green), 0.5–0.8 = "Medium" (yellow), <0.5 = "Low" (muted)
- Assumptions: list, each has X Button to dismiss (filter from assumptions array)
- EditableField for recommendedPath

Buttons using shadcn/ui Button:
  "Looks good" (primary) → onNext
  "Refine" (outline)     → onRefine
  "Start over" (ghost)   → onReset
  "Let AI decide" (ghost) → onNext immediately

---

## GeneratedOutputStep.tsx

Props: session, onAction: (action: string) => void, onApply?: Function

On mount: call getMockOutput(session.selectedGoalType) with 1200ms delay.

Include comment:
```ts
// TODO: Replace getMockOutput with a fetch to /api/onboarding/generate
// const res = await fetch('/api/onboarding/generate', {
//   method: 'POST',
//   body: JSON.stringify({ session, userId: session.id })
// })
```

Show output-shaped Skeleton while loading.

Display:
- Large title + summary paragraph
- OutputCard for each section
- NextActionList
- "Copy as Markdown" Button → navigator.clipboard.writeText(output.exportableMarkdown)
- "Export JSON" Button → download as output.json Blob
- "Apply to Workspace" Button → calls onApply?.(session, output) or shows toast

---

## ProgressIndicator.tsx

Props: currentStep: 1–5, totalSteps: 5, onStepClick: (step: number) => void

Labels: Intent / Style / Context / Verify / Launch

- Top bar on mobile (flex row)
- Left vertical rail on desktop (md: fixed left, 200px wide)
- Completed: checkmark icon, muted color
- Active: highlighted, primary color
- Future: muted, pointer-events-none
- Clicking completed step calls onStepClick(step) with shadcn/ui
  AlertDialog confirm if current step >= 4

---

## EditableField.tsx

Props: label: string, value: string, onChange: (v: string) => void, multiline?: boolean

- Shows styled text display with pencil icon (lucide-react Pencil) on hover
- Click toggles to Input or Textarea
- Saves (calls onChange) on blur
- shadcn/ui Input / Textarea

---

## OutputCard.tsx

Props: title: string, content: string | string[], collapsible?: boolean

- shadcn/ui Card
- string: paragraph
- string[]: ul list items
- Copy icon (lucide-react Copy) in corner → copies to clipboard
- Collapsible via shadcn/ui Collapsible if collapsible prop

---

## NextActionList.tsx

Props: nextSteps: string[], suggestedActions: {label: string, action: string}[], onAction: (action: string) => void

- nextSteps: ol with numbered items
- suggestedActions: pill Badge/Button components that call onAction(action)

---

## AISuggestionPanel.tsx

Props: currentStep: number, inferredIntent: InferredIntent | null

- Collapsible panel using shadcn/ui Collapsible
- Renders contextual hint per step:
    1: "Analyzing your goal type to determine the right questions..."
    2: "Your mode choice affects how many questions I ask and how I fill gaps."
    3: "These questions help me personalize your output. All optional."
    4: "Review my interpretation. Edit anything that seems off."
    5: "Your personalized artifact is ready to copy, export, or apply."
- Hidden when guidanceMode is 'full-control'
- Dismissible — stores dismissed state in component state

---

## UI Design

Tailwind configuration:
- Extend colors: primary: '#6B5CF6', primary-hover: '#7C6EF7'
- Dark mode: class strategy

Font:
- Use next/font or a @import for a distinctive display font
- NOT Inter. NOT Roboto. NOT system-ui.
- Suggested: Plus Jakarta Sans, Syne, Cabinet Grotesk, DM Sans
- Apply to headings only. Body can use Tailwind default.

Layout:
- Wizard card: max-w-[720px] mx-auto, p-10 desktop / p-6 mobile
- Left rail: hidden md:block, w-[200px], fixed left side
- Content: md:ml-[200px]

Framer Motion:
- Wrap step renders in AnimatePresence
- Each step: initial={{ opacity: 0, y: 12 }}, animate={{ opacity: 1, y: 0 }}, exit={{ opacity: 0, y: -12 }}, transition={{ duration: 0.22 }}
- Respect prefers-reduced-motion:
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

States — all four:
  Empty:   placeholder text and chips visible
  Loading: shadcn/ui Skeleton components
  Error:   inline Alert with retry Button
  Success: full output displayed

shadcn/ui components to use:
  Card, CardContent, CardHeader
  Button, Badge, Input, Textarea
  Skeleton, Alert, AlertDescription
  Collapsible, CollapsibleContent, CollapsibleTrigger
  Separator

---

## Hard Constraints

- No fetch calls to any external API in any component file
- No API keys anywhere in this output
- No HTML form elements — onClick and onChange only
- All components fully typed — no implicit any
- No placeholder comments or stubs — every function fully implemented
- shadcn/ui components used throughout for consistency
